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


---

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


---

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


---

# Chapter 04: Center of Mass Kinematics & Dynamics — Koenig’s Theorem, the Zero-Momentum Frame, and Trajectory Invariance

> *"In the chaotic swirl of multi-body motion—where planets orbit, acrobats twist, and artillery shells explode into a thousand jagged shards—there exists a single mathematical point that ignores all internal drama. The Center of Mass moves through space with the serene simplicity of an isolated particle."*

---

## 4.1 The Geometry of Collective Mass

In our study of Newtonian mechanics so far, we have frequently spoken of "a block," "a car," or "a planet" as if they were mathematical point particles. Yet real macroscopic objects are composed of trillions of atoms, and physical systems often consist of multiple loosely bound or interacting bodies.

How can a single equation ($\sum \vec{F} = m\vec{a}$) describe an extended object like a spinning wrench tumbling through the air, or a gymnast executing a triple somersault?

The answer lies in one of the most powerful concepts in classical physics: the **Center of Mass** ($\vec{R}_{\text{CM}}$). The center of mass is the unique mass-weighted average spatial coordinate of a system of particles:

$$\vec{R}_{\text{CM}} \equiv \frac{\sum_{i=1}^N m_i \vec{r}_i}{\sum_{i=1}^N m_i} = \frac{1}{M_{\text{total}}} \sum_{i=1}^N m_i \vec{r}_i$$

where $M_{\text{total}} = \sum_{i=1}^N m_i$ is the total mass of the system.

In Cartesian coordinates:

$$X_{\text{CM}} = \frac{\sum m_i x_i}{M_{\text{total}}}, \quad Y_{\text{CM}} = \frac{\sum m_i y_i}{M_{\text{total}}}, \quad Z_{\text{CM}} = \frac{\sum m_i z_i}{M_{\text{total}}}$$

```
                ^ +Y
                |              * Particle 2 (m2, r2)
                |             /
                |            /   R_CM (Center of Mass)
                |           /     x
                |   (m1) * '     /
                |         \     /
                |          \   /
                |           \ /  * Particle 3 (m3, r3)
                +------------+--------------------------> +X
```

### Continuous Mass Distributions
For continuous solid bodies with spatial mass density $\rho(\vec{r})$, the discrete summation transforms into a volume integral:

$$\vec{R}_{\text{CM}} = \frac{1}{M_{\text{total}}} \int \vec{r} \, dm = \frac{1}{M_{\text{total}}} \iiint_V \vec{r} \rho(\vec{r}) \, dV$$

For uniform symmetrical geometries (spheres, cylinders, rectangular slabs), the center of mass coincides exactly with the geometric centroid.

---

## 4.2 The Fundamental Theorem of Center-of-Mass Motion

What happens when we differentiate the position of the center of mass with respect to time?

### 1. Center of Mass Velocity ($\vec{V}_{\text{CM}}$)
Take the first time derivative of $\vec{R}_{\text{CM}}$:

$$\vec{V}_{\text{CM}} = \frac{d\vec{R}_{\text{CM}}}{dt} = \frac{1}{M_{\text{total}}} \sum_{i=1}^N m_i \frac{d\vec{r}_i}{dt} = \frac{1}{M_{\text{total}}} \sum_{i=1}^N m_i \vec{v}_i$$

Notice the numerator: $\sum_{i=1}^N m_i \vec{v}_i$ is precisely the **total linear momentum** $\vec{P}_{\text{total}}$ of the system!

$$\vec{V}_{\text{CM}} = \frac{\vec{P}_{\text{total}}}{M_{\text{total}}} \iff \vec{P}_{\text{total}} = M_{\text{total}} \vec{V}_{\text{CM}}$$

**The Momentum-Velocity Equivalence:**
> *The total linear momentum of any complex multi-body system is identically equal to the total mass of the system multiplied by the velocity of its center of mass.*

### 2. Center of Mass Acceleration ($\vec{A}_{\text{CM}}$)
Now take the second time derivative:

$$\vec{A}_{\text{CM}} = \frac{d\vec{V}_{\text{CM}}}{dt} = \frac{1}{M_{\text{total}}} \frac{d\vec{P}_{\text{total}}}{dt}$$

From Chapter 01 (Section 1.5), we proved that the time rate of change of total momentum equals the sum of external forces, because all internal forces cancel in pairs via Newton’s Third Law:

$$\frac{d\vec{P}_{\text{total}}}{dt} = \sum \vec{F}_{\text{ext}}$$

Multiplying both sides by $M_{\text{total}}$:

$$M_{\text{total}} \vec{A}_{\text{CM}} = \sum \vec{F}_{\text{ext}}$$

**The Grand Center-of-Mass Theorem:**
> *The center of mass of any physical system—regardless of whether it is rigid, flexible, fluid, rotating, or exploding—accelerates through space as if the entire mass of the system were concentrated at that single geometric point and all external forces were applied directly to it!*

---

## 4.3 The Trajectory Invariance Theorem

Consider an artillery shell fired into the air. In the absence of an explosion, its center of mass traces an ordinary parabolic trajectory under gravity:

$$\vec{R}_{\text{CM}}(t) = \vec{R}_0 + \vec{V}_0 t - \frac{1}{2} g t^2 \,\hat{j}$$

Now suppose that halfway along its flight, an internal charge detonates, violently shattering the shell into hundreds of fragments that scatter in all directions.

```
                  Apex (Detonation Point)
                           ( * )
                         . ' | ` .
                       . '   |   ` .    Fragment Trajectories
                     . '     |     ` .  (Scattered violently)
                   . '       |       ` .
                 . '         v         ` .
               . '     - - - - - - - - - ` .
             .'                             `.
            *                                 *
          Launch                           Impacts
          ---------------------------------------------------
          [ The Center of Mass (o) continues along the UNBROKEN parabola! ]
```

What happens to the center of mass after the explosion?
Because the explosive blast is produced entirely by internal chemical forces:

$$\sum \vec{F}_{\text{int}} \equiv \vec{0}$$

The only external force acting on the collection of flying fragments remains the uniform downward pull of Earth's gravity:

$$\sum \vec{F}_{\text{ext}} = \sum m_i \vec{g} = M_{\text{total}} \vec{g}$$

Therefore:

$$\vec{A}_{\text{CM}} = \vec{g} = -g\,\hat{j}$$

**The Trajectory Invariance Theorem:**
> *Until the very first fragment strikes the ground or encounters an external obstacle, the center of mass of the exploding fragments continues along the exact, uninterrupted original parabolic trajectory as if the explosion had never occurred!*

If you calculate the mass-weighted average position of every fragment at any instant after detonation, that point lies precisely where the unexploded shell would have been at that millisecond.

---

## 4.4 The Center-of-Mass (Zero-Momentum) Reference Frame

In analytical mechanics, we frequently shift our perspective from the stationary laboratory frame ($S$) to a reference frame attached to the moving center of mass ($S_{\text{CM}}$), also termed the **Zero-Momentum Frame** or **C-Frame**.

### Galilean Coordinate and Velocity Transformations
Let $\vec{r}_i$ and $\vec{v}_i$ be the position and velocity of particle $i$ in the laboratory frame.
Let $\vec{r}'_i$ and $\vec{v}'_i$ be the corresponding coordinates in the C-frame moving at velocity $\vec{V}_{\text{CM}}$:

$$\vec{r}'_i = \vec{r}_i - \vec{R}_{\text{CM}}$$

$$\vec{v}'_i = \vec{v}_i - \vec{V}_{\text{CM}}$$

### The Zero-Momentum Identity
Let us calculate the total linear momentum in the C-frame:

$$\vec{P}'_{\text{total}} = \sum_{i=1}^N m_i \vec{v}'_i = \sum_{i=1}^N m_i (\vec{v}_i - \vec{V}_{\text{CM}}) = \sum_{i=1}^N m_i \vec{v}_i - \left(\sum_{i=1}^N m_i\right) \vec{V}_{\text{CM}}$$

Since $\sum m_i \vec{v}_i = \vec{P}_{\text{total}}$ and $\sum m_i = M_{\text{total}}$:

$$\vec{P}'_{\text{total}} = \vec{P}_{\text{total}} - M_{\text{total}} \vec{V}_{\text{CM}} = \vec{P}_{\text{total}} - \vec{P}_{\text{total}} \equiv \vec{0}$$

In the center-of-mass frame, the total linear momentum is **identically zero at all times**:

$$\vec{P}'_{\text{total}} \equiv \vec{0}$$

For a two-body system in the C-frame:

$$m_1 \vec{v}'_1 + m_2 \vec{v}'_2 = \vec{0} \implies \vec{p}'_1 = -\vec{p}'_2$$

In the C-frame, two colliding particles always move directly toward each other with **equal and opposite collinear momenta**, regardless of how asymmetric their masses or velocities appear in the laboratory frame! This symmetry makes collision analysis dramatically simpler.

---

## 4.5 Koenig’s Theorem for Kinetic Energy

How does the total kinetic energy of a multi-body system transform between the laboratory frame and the center-of-mass frame?

In the laboratory frame, total kinetic energy is:

$$K_{\text{lab}} = \sum_{i=1}^N \frac{1}{2} m_i v_i^2 = \sum_{i=1}^N \frac{1}{2} m_i (\vec{v}_i \cdot \vec{v}_i)$$

Substitute $\vec{v}_i = \vec{V}_{\text{CM}} + \vec{v}'_i$:

$$K_{\text{lab}} = \sum_{i=1}^N \frac{1}{2} m_i \left( \vec{V}_{\text{CM}} + \vec{v}'_i \right) \cdot \left( \vec{V}_{\text{CM}} + \vec{v}'_i \right)$$

$$K_{\text{lab}} = \sum_{i=1}^N \frac{1}{2} m_i \left( V_{\text{CM}}^2 + 2 \vec{V}_{\text{CM}} \cdot \vec{v}'_i + \|\vec{v}'_i\|^2 \right)$$

Expand into three distinct summations:

$$K_{\text{lab}} = \frac{1}{2}\left(\sum_{i=1}^N m_i\right) V_{\text{CM}}^2 + \vec{V}_{\text{CM}} \cdot \left(\sum_{i=1}^N m_i \vec{v}'_i\right) + \sum_{i=1}^N \frac{1}{2} m_i \|\vec{v}'_i\|^2$$

Now examine each term carefully:
1. $\sum m_i = M_{\text{total}}$, so the first term is $\frac{1}{2} M_{\text{total}} V_{\text{CM}}^2$. This is the kinetic energy of the system as a whole translating through space.
2. The cross-term contains $\sum m_i \vec{v}'_i$, which is the total momentum in the C-frame. But we just proved that $\vec{P}'_{\text{total}} \equiv \vec{0}$! Thus, the cross-term **vanishes identically**:
   $$\vec{V}_{\text{CM}} \cdot \vec{P}'_{\text{total}} = \vec{V}_{\text{CM}} \cdot \vec{0} = 0$$
3. The third term is the internal kinetic energy of particles relative to the center of mass: $K_{\text{rel}} = K_{\text{int}}$.

This establishes **Koenig’s Theorem**:

$$K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}} = \frac{1}{2} M_{\text{total}} V_{\text{CM}}^2 + \sum_{i=1}^N \frac{1}{2} m_i \|\vec{v}'_i\|^2$$

```
   +-------------------------------------------------------------------------------+
   |                             KOENIG'S THEOREM                                  |
   |              K_lab       =       K_CM        +       K_int                    |
   |        (Total Lab Energy)   (Translational)     (Internal / Deformable)       |
   +-------------------------------------------------------------------------------+
```

### The Two-Body Reduced Mass Simplification
For a two-body system ($m_1$ and $m_2$) with relative velocity $\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2$:
- Velocity of particle 1 in C-frame: $\vec{v}'_1 = \frac{m_2}{m_1 + m_2} \vec{v}_{\text{rel}}$
- Velocity of particle 2 in C-frame: $\vec{v}'_2 = -\frac{m_1}{m_1 + m_2} \vec{v}_{\text{rel}}$

Substituting these into the internal kinetic energy:

$$K_{\text{int}} = \frac{1}{2} m_1 \left( \frac{m_2}{m_1 + m_2} v_{\text{rel}} \right)^2 + \frac{1}{2} m_2 \left( \frac{m_1}{m_1 + m_2} v_{\text{rel}} \right)^2 = \frac{1}{2} \left( \frac{m_1 m_2^2 + m_2 m_1^2}{(m_1 + m_2)^2} \right) v_{\text{rel}}^2$$

$$K_{\text{int}} = \frac{1}{2} \left( \frac{m_1 m_2 (m_1 + m_2)}{(m_1 + m_2)^2} \right) v_{\text{rel}}^2 = \frac{1}{2} \left( \frac{m_1 m_2}{m_1 + m_2} \right) v_{\text{rel}}^2$$

Defining the **Reduced Mass** $\mu$:

$$\mu \equiv \frac{m_1 m_2}{m_1 + m_2}$$

we obtain the compact, elegant result:

$$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2$$

$$K_{\text{lab}} = \frac{1}{2} M_{\text{total}} V_{\text{CM}}^2 + \frac{1}{2} \mu v_{\text{rel}}^2$$

**The Deep Meaning of Koenig's Theorem:**
In an isolated collision, momentum conservation dictates that $V_{\text{CM}}$ is strictly constant. Therefore, **$K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2$ is completely untouchable and irreducible!** No collision, no matter how violent or inelastic, can ever convert $K_{\text{CM}}$ into heat. Only the internal kinetic energy $K_{\text{int}} = \frac{1}{2}\mu v_{\text{rel}}^2$ is available for structural crumpling, plastic deformation, or thermal dissipation.

---

## 4.6 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 4.1: Discrete 2D Center of Mass Calculation
**Problem:** Four robotic tracking nodes are located at coordinates in a coordinate plane:
- Node 1: $m_1 = 2.00\,\text{kg}$ at $(1.00, 2.00)\,\text{m}$.
- Node 2: $m_2 = 3.00\,\text{kg}$ at $(4.00, 6.00)\,\text{m}$.
- Node 3: $m_3 = 5.00\,\text{kg}$ at $(-2.00, 3.00)\,\text{m}$.
- Node 4: $m_4 = 6.00\,\text{kg}$ at $(3.00, -1.00)\,\text{m}$.
Calculate the Center of Mass coordinates $(X_{\text{CM}}, Y_{\text{CM}})$.

**Solution:**
- **Step 1: Total mass**
  $$M_{\text{total}} = 2.00 + 3.00 + 5.00 + 6.00 = 16.00\,\text{kg}$$

- **Step 2: X-coordinate calculation**
  $$\sum m_i x_i = (2.00)(1.00) + (3.00)(4.00) + (5.00)(-2.00) + (6.00)(3.00)$$
  $$\sum m_i x_i = 2.00 + 12.00 - 10.00 + 18.00 = 22.00\,\text{kg}\cdot\text{m}$$
  $$X_{\text{CM}} = \frac{22.00\,\text{kg}\cdot\text{m}}{16.00\,\text{kg}} = 1.375\,\text{m}$$

- **Step 3: Y-coordinate calculation**
  $$\sum m_i y_i = (2.00)(2.00) + (3.00)(6.00) + (5.00)(3.00) + (6.00)(-1.00)$$
  $$\sum m_i y_i = 4.00 + 18.00 + 15.00 - 6.00 = 31.00\,\text{kg}\cdot\text{m}$$
  $$Y_{\text{CM}} = \frac{31.00\,\text{kg}\cdot\text{m}}{16.00\,\text{kg}} = 1.9375\,\text{m}$$
  $$\vec{R}_{\text{CM}} = (1.375, 1.938)\,\text{m}$$

---

### Example 4.2: Center of Mass of a Non-Uniform Rod
**Problem:** A metal rod of length $L = 2.00\,\text{m}$ has a non-uniform linear mass density that increases linearly from one end:
$$\lambda(x) = \lambda_0 \left(1 + \frac{2x}{L}\right), \quad 0 \le x \le L$$
where $\lambda_0 = 3.00\,\text{kg/m}$.
1. Compute the total mass $M$ of the rod.
2. Determine the location of the center of mass $X_{\text{CM}}$.

**Solution:**
- **Step 1: Total mass integration**
  $$M = \int_0^L \lambda(x) \, dx = \lambda_0 \int_0^L \left(1 + \frac{2x}{L}\right) dx = \lambda_0 \left[ x + \frac{x^2}{L} \right]_0^L = \lambda_0 (L + L) = 2 \lambda_0 L$$
  $$M = 2(3.00\,\text{kg/m})(2.00\,\text{m}) = 12.00\,\text{kg}$$

- **Step 2: Center of mass calculation**
  $$\int_0^L x \lambda(x) \, dx = \lambda_0 \int_0^L \left(x + \frac{2x^2}{L}\right) dx = \lambda_0 \left[ \frac{x^2}{2} + \frac{2x^3}{3L} \right]_0^L = \lambda_0 \left( \frac{L^2}{2} + \frac{2L^2}{3} \right) = \lambda_0 L^2 \left(\frac{3+4}{6}\right) = \frac{7}{6} \lambda_0 L^2$$
  $$X_{\text{CM}} = \frac{\int_0^L x \lambda(x) \, dx}{M} = \frac{\frac{7}{6} \lambda_0 L^2}{2 \lambda_0 L} = \frac{7}{12} L$$
  Numerical evaluation:
  $$X_{\text{CM}} = \frac{7}{12}(2.00\,\text{m}) = \frac{14.0}{12} = 1.1667\,\text{m}$$
  The center of mass is shifted toward the heavier end ($1.17\,\text{m}$ from $x = 0$, past the geometric midpoint of $1.00\,\text{m}$).

---

### Example 4.3: Binary Star Center of Mass and Orbital Radii
**Problem:** A binary star system consists of Star Alpha ($M_1 = 3.00 \times 10^{30}\,\text{kg} \approx 1.5\,M_\odot$) and Star Beta ($M_2 = 1.00 \times 10^{30}\,\text{kg} \approx 0.5\,M_\odot$) separated by a constant orbital distance $D = 8.00 \times 10^8\,\text{km}$.
1. Find the distance $r_1$ and $r_2$ of each star from their common barycenter (center of mass).
2. If both stars orbit their barycenter in circular paths with period $T = 4.50\,\text{years} = 1.42 \times 10^8\,\text{s}$, compute their orbital speeds $v_1$ and $v_2$, and verify momentum cancellation.

**Solution:**
- **Step 1: Distance from barycenter**
  Let the barycenter be the origin ($r_{\text{CM}} = 0$):
  $$M_1 r_1 = M_2 r_2$$
  Since $r_1 + r_2 = D \implies r_2 = D - r_1$:
  $$M_1 r_1 = M_2 (D - r_1) \implies (M_1 + M_2) r_1 = M_2 D$$
  $$r_1 = \frac{M_2}{M_1 + M_2} D = \frac{1.00}{3.00 + 1.00} (8.00 \times 10^8\,\text{km}) = \frac{1}{4}(8.00 \times 10^8) = 2.00 \times 10^8\,\text{km}$$
  $$r_2 = D - r_1 = 8.00 \times 10^8 - 2.00 \times 10^8 = 6.00 \times 10^8\,\text{km}$$

- **Step 2: Orbital speeds and momentum check**
  $$v_1 = \frac{2\pi r_1}{T} = \frac{2\pi (2.00 \times 10^{11}\,\text{m})}{1.42 \times 10^8\,\text{s}} = \frac{1.2566 \times 10^{12}}{1.42 \times 10^8} = 8849.6\,\text{m/s} \approx 8.85\,\text{km/s}$$
  $$v_2 = \frac{2\pi r_2}{T} = \frac{2\pi (6.00 \times 10^{11}\,\text{m})}{1.42 \times 10^8\,\text{s}} = 3 v_1 = 26,548.7\,\text{m/s} \approx 26.55\,\text{km/s}$$
  - Momentum of Star 1:
    $$p_1 = M_1 v_1 = (3.00 \times 10^{30}\,\text{kg})(8849.6\,\text{m/s}) = 2.655 \times 10^{34}\,\text{kg}\cdot\text{m/s}$$
  - Momentum of Star 2:
    $$p_2 = M_2 v_2 = (1.00 \times 10^{30}\,\text{kg})(26,548.7\,\text{m/s}) = 2.655 \times 10^{34}\,\text{kg}\cdot\text{m/s}$$
  Since the stars are always on opposite sides of the barycenter, their velocity vectors oppose each other:
  $$\vec{p}_1 + \vec{p}_2 = \vec{0}$$
  The total linear momentum in the barycentric frame is identically zero!

---

### Example 4.4: Exploding Projectile Landing Distance
**Problem:** A mortar shell of mass $M = 10.0\,\text{kg}$ is launched from flat ground with initial speed $v_0 = 80.0\,\text{m/s}$ at angle $\theta = 45.0^\circ$. At the exact peak of its trajectory, the shell explodes into two equal fragments of $m_1 = m_2 = 5.00\,\text{kg}$. Fragment 1 has zero horizontal velocity immediately after the blast ($v_{1x} = 0$) and drops straight down to the ground. Take $g = 9.81\,\text{m/s}^2$.
1. Calculate the normal range $R_{\text{orig}}$ where the shell would have landed without an explosion.
2. Determine where Fragment 1 lands.
3. Using the Center of Mass Trajectory Invariance Theorem, determine where Fragment 2 lands ($x_2$).

**Solution:**
- **Step 1: Unexploded range**
  $$\sin(2\theta) = \sin(90.0^\circ) = 1.00$$
  $$R_{\text{orig}} = \frac{v_0^2 \sin(2\theta)}{g} = \frac{(80.0\,\text{m/s})^2 (1.00)}{9.81\,\text{m/s}^2} = \frac{6400.0}{9.81} = 652.395\,\text{m}$$
  Apex location:
  $$x_{\text{apex}} = \frac{R_{\text{orig}}}{2} = \frac{652.395}{2} = 326.198\,\text{m}$$

- **Step 2: Landing site of Fragment 1**
  Because Fragment 1 loses all horizontal velocity, it falls vertically straight down from the apex:
  $$x_1 = x_{\text{apex}} = 326.20\,\text{m}$$

- **Step 3: Landing site of Fragment 2 via Center-of-Mass Invariance**
  Both fragments fall from the same height with zero initial vertical velocity, so they hit the ground at the **exact same instant**!
  At the landing instant, the Center of Mass must be at the original range:
  $$X_{\text{CM}} = R_{\text{orig}} = 652.395\,\text{m}$$
  By definition of Center of Mass:
  $$X_{\text{CM}} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \frac{5.00 x_1 + 5.00 x_2}{10.00} = \frac{x_1 + x_2}{2}$$
  $$R_{\text{orig}} = \frac{x_1 + x_2}{2} \implies x_2 = 2 R_{\text{orig}} - x_1$$
  $$x_2 = 2(652.395\,\text{m}) - 326.198\,\text{m} = 1304.79 - 326.20 = 978.59\,\text{m}$$
  Fragment 2 lands nearly a kilometer downrange ($978.6\,\text{m}$), exactly three times farther than Fragment 1!

---

### Example 4.5: Koenig’s Theorem Verification
**Problem:** In the laboratory frame:
- Particle 1 ($m_1 = 3.00\,\text{kg}$) moves at $\vec{v}_1 = +6.00\,\hat{i}\,\text{m/s}$.
- Particle 2 ($m_2 = 1.00\,\text{kg}$) moves at $\vec{v}_2 = -2.00\,\hat{i}\,\text{m/s}$.
1. Compute the total kinetic energy in the laboratory frame $K_{\text{lab}}$.
2. Determine the center of mass velocity $V_{\text{CM}}$.
3. Compute the velocities $\vec{v}'_1$ and $\vec{v}'_2$ in the center of mass frame.
4. Calculate $K_{\text{CM}}$ and $K_{\text{int}}$, and verify that $K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}}$.

**Solution:**
- **Step 1: Direct laboratory kinetic energy**
  $$K_1 = \frac{1}{2} m_1 v_1^2 = \frac{1}{2}(3.00\,\text{kg})(6.00\,\text{m/s})^2 = 1.50 \times 36.0 = 54.0\,\text{J}$$
  $$K_2 = \frac{1}{2} m_2 v_2^2 = \frac{1}{2}(1.00\,\text{kg})(-2.00\,\text{m/s})^2 = 0.50 \times 4.0 = 2.0\,\text{J}$$
  $$K_{\text{lab}} = K_1 + K_2 = 54.0 + 2.0 = 56.0\,\text{J}$$

- **Step 2: Center of mass velocity**
  $$M = m_1 + m_2 = 3.00 + 1.00 = 4.00\,\text{kg}$$
  $$P_{\text{total}} = m_1 v_1 + m_2 v_2 = (3.00)(6.00) + (1.00)(-2.00) = 18.0 - 2.0 = +16.0\,\text{kg}\cdot\text{m/s}$$
  $$V_{\text{CM}} = \frac{P_{\text{total}}}{M} = \frac{16.0\,\text{kg}\cdot\text{m/s}}{4.00\,\text{kg}} = +4.00\,\text{m/s}$$

- **Step 3: Velocities in C-frame**
  $$v'_1 = v_1 - V_{\text{CM}} = 6.00 - 4.00 = +2.00\,\text{m/s}$$
  $$v'_2 = v_2 - V_{\text{CM}} = -2.00 - 4.00 = -6.00\,\text{m/s}$$
  *Check Momentum in C-frame:*
  $$p'_1 = m_1 v'_1 = (3.00)(+2.00) = +6.00\,\text{kg}\cdot\text{m/s}$$
  $$p'_2 = m_2 v'_2 = (1.00)(-6.00) = -6.00\,\text{kg}\cdot\text{m/s}$$
  $$p'_1 + p'_2 = 0$$. Verified!

- **Step 4: Energy partition verification**
  - Center of mass kinetic energy:
    $$K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2 = \frac{1}{2}(4.00\,\text{kg})(4.00\,\text{m/s})^2 = 2.00 \times 16.0 = 32.0\,\text{J}$$
  - Internal kinetic energy:
    $$K_{\text{int}} = \frac{1}{2} m_1 (v'_1)^2 + \frac{1}{2} m_2 (v'_2)^2 = \frac{1}{2}(3.00)(2.00)^2 + \frac{1}{2}(1.00)(-6.00)^2 = 6.00 + 18.00 = 24.0\,\text{J}$$
    *Check via reduced mass:*
    $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(3.00)(1.00)}{4.00} = 0.750\,\text{kg}$$
    $$v_{\text{rel}} = v_1 - v_2 = 6.00 - (-2.00) = 8.00\,\text{m/s}$$
    $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(0.750)(8.00)^2 = 0.375 \times 64.0 = 24.0\,\text{J}$$
  - Sum:
    $$K_{\text{CM}} + K_{\text{int}} = 32.0\,\text{J} + 24.0\,\text{J} = 56.0\,\text{J} \equiv K_{\text{lab}}$$
  Koenig’s Theorem is verified with mathematical perfection.

---

### Example 4.6: Astronaut and Tethered Satellite Rotation
**Problem:** An astronaut of mass $m_1 = 90.0\,\text{kg}$ and a small communications satellite of mass $m_2 = 30.0\,\text{kg}$ are tethered by an inextensible cord of length $L = 20.0\,\text{m}$. Both are rotating in deep space about their common center of mass at constant angular frequency $\omega = 0.500\,\text{rad/s}$.
1. Find the distance of the astronaut ($r_1$) and satellite ($r_2$) from the rotation center.
2. Determine their linear speeds $v_1$ and $v_2$.
3. Compute the tension $T$ in the connecting tether.

**Solution:**
- **Step 1: Distances from center of mass**
  $$r_1 = \frac{m_2}{m_1 + m_2} L = \frac{30.0}{90.0 + 30.0} (20.0\,\text{m}) = \frac{30.0}{120.0}(20.0) = 5.00\,\text{m}$$
  $$r_2 = L - r_1 = 20.0 - 5.00 = 15.00\,\text{m}$$

- **Step 2: Linear speeds**
  $$v_1 = \omega r_1 = (0.500\,\text{rad/s})(5.00\,\text{m}) = 2.50\,\text{m/s}$$
  $$v_2 = \omega r_2 = (0.500\,\text{rad/s})(15.00\,\text{m}) = 7.50\,\text{m/s}$$

- **Step 3: Tether tension**
  Tether tension provides the centripetal force for each body:
  - For astronaut:
    $$T = m_1 \omega^2 r_1 = (90.0\,\text{kg})(0.500\,\text{rad/s})^2 (5.00\,\text{m}) = (90.0)(0.250)(5.00) = 112.50\,\text{N}$$
  - For satellite:
    $$T = m_2 \omega^2 r_2 = (30.0\,\text{kg})(0.500\,\text{rad/s})^2 (15.00\,\text{m}) = (30.0)(0.250)(15.00) = 112.50\,\text{N}$$
  Both calculations agree identically: $T = 112.5\,\text{N}$.

---

### Example 4.7: Relocating the Center of Mass by Cutouts
**Problem:** A uniform solid circular disc of radius $R = 0.600\,\text{m}$ and uniform areal mass density $\sigma = 10.0\,\text{kg/m}^2$ is centered at the origin $(0, 0)$. A circular hole of radius $r = 0.200\,\text{m}$ is punched out of the disc, centered at $(x = +0.300\,\text{m}, y = 0)$.
Determine the new Center of Mass coordinates $(X_{\text{CM}}, Y_{\text{CM}})$ of the remaining pierced disc.

**Solution:**
- **Step 1: The negative mass method**
  We treat the pierced disc as the superposition of:
  1. A complete solid disc of radius $R$ and mass $+M_1$ centered at $(0, 0)$.
  2. A cutout circular disc of radius $r$ with "negative mass" $-M_2$ centered at $(+0.300, 0)\,\text{m}$.
- **Step 2: Masses of components**
  $$M_1 = \sigma (\pi R^2) = \sigma \pi (0.600)^2 = 0.360 \pi \sigma$$
  $$M_2 = \sigma (\pi r^2) = \sigma \pi (0.200)^2 = 0.040 \pi \sigma$$
  Net mass of pierced disc:
  $$M_{\text{net}} = M_1 - M_2 = 0.360\pi\sigma - 0.040\pi\sigma = 0.320\pi\sigma$$

- **Step 3: Center of mass calculation**
  By symmetry along the $x$-axis, $Y_{\text{CM}} = 0$.
  $$X_{\text{CM}} = \frac{M_1 X_1 - M_2 X_2}{M_1 - M_2} = \frac{(0.360\pi\sigma)(0) - (0.040\pi\sigma)(+0.300\,\text{m})}{0.320\pi\sigma}$$
  Canceling $\pi\sigma$:
  $$X_{\text{CM}} = \frac{-(0.040)(0.300)}{0.320} = -\frac{0.0120}{0.320} = -0.0375\,\text{m} = -3.75\,\text{cm}$$
  The removal of mass on the right shifts the center of mass $3.75\,\text{cm}$ to the left ($X_{\text{CM}} = -0.0375\,\text{m}$).

---

### Example 4.8: Two Blocks on Ice Connected by an Expanding Spring
**Problem:** Two blocks of mass $m_1 = 1.50\,\text{kg}$ and $m_2 = 4.50\,\text{kg}$ sit on a frictionless horizontal table. Between them is a compressed spring storing $U_s = 48.0\,\text{J}$ of elastic potential energy. The latch is released, pushing the blocks apart.
1. Compute the final speeds $v_1$ and $v_2$ of the blocks in the laboratory frame after the spring detaches.
2. What is the velocity of the center of mass during and after the expansion?

**Solution:**
- **Step 1: Momentum conservation**
  Initial state is at rest ($V_{\text{CM}} = 0$):
  $$m_1 v_1 + m_2 v_2 = 0 \implies v_1 = -\frac{m_2}{m_1} v_2 = -\frac{4.50}{1.50} v_2 = -3.00 v_2$$

- **Step 2: Energy conservation**
  The elastic potential energy transforms entirely into kinetic energy:
  $$U_s = \frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2$$
  Substitute $v_1 = -3.00 v_2$:
  $$48.0 = \frac{1}{2}(1.50)(-3.00 v_2)^2 + \frac{1}{2}(4.50) v_2^2 = 0.75(9.00 v_2^2) + 2.25 v_2^2 = 6.75 v_2^2 + 2.25 v_2^2 = 9.00 v_2^2$$
  $$v_2^2 = \frac{48.0}{9.00} = 5.3333\,\text{m}^2/\text{s}^2 \implies v_2 = \sqrt{5.3333} = 2.3094\,\text{m/s}$$
  Speed of Block 1:
  $$v_1 = 3.00 v_2 = 3.00(2.3094) = 6.9282\,\text{m/s}$$

- **Step 3: Center of mass velocity**
  $$V_{\text{CM}} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \frac{(1.50)(-6.9282) + (4.50)(+2.3094)}{6.00} = \frac{-10.392 + 10.392}{6.00} \equiv 0\,\text{m/s}$$
  The center of mass remains permanently stationary!

---

### Example 4.9: Accelerating Multi-Body System with External Pulley Load
**Problem:** Two blocks $m_1 = 4.00\,\text{kg}$ and $m_2 = 6.00\,\text{kg}$ sit on a frictionless table, connected by a cord. A horizontal pulling force $F = 50.0\,\text{N}$ is applied to $m_2$.
1. Compute the acceleration of the center of mass $A_{\text{CM}}$.
2. Determine the common acceleration $a$ of the individual blocks and verify that $A_{\text{CM}} \equiv a$.
3. Compute the internal tension $T$ in the connecting cord.

**Solution:**
- **Step 1: Center of mass acceleration**
  Total mass $M = m_1 + m_2 = 4.00 + 6.00 = 10.00\,\text{kg}$.
  Total external horizontal force: $\sum F_{\text{ext}} = F = 50.0\,\text{N}$.
  $$A_{\text{CM}} = \frac{\sum F_{\text{ext}}}{M} = \frac{50.0\,\text{N}}{10.00\,\text{kg}} = 5.00\,\text{m/s}^2$$

- **Step 2: Individual block accelerations**
  Since the cord is inextensible, both blocks share common acceleration $a$:
  $$F = (m_1 + m_2) a \implies a = \frac{50.0}{10.00} = 5.00\,\text{m/s}^2 \equiv A_{\text{CM}}$$

- **Step 3: Cord tension**
  Cord tension accelerates $m_1$:
  $$T = m_1 a = (4.00\,\text{kg})(5.00\,\text{m/s}^2) = 20.0\,\text{N}$$
  Check on $m_2$: $F - T = 50.0 - 20.0 = 30.0\,\text{N} = m_2 a = (6.00)(5.00) = 30.0\,\text{N}$. Verified.

---

### Example 4.10: Maximum Internal Energy Conversion in Inelastic Collisions
**Problem:** A space junk collision occurs between Fragment A ($m_1 = 10.0\,\text{kg}$, moving at $\vec{v}_1 = +30.0\,\hat{i}\,\text{m/s}$) and Fragment B ($m_2 = 40.0\,\text{kg}$, moving at $\vec{v}_2 = -10.0\,\hat{i}\,\text{m/s}$). The fragments collide and weld together into a single composite mass.
1. Calculate the initial laboratory kinetic energy $K_{\text{lab}}$.
2. Compute the velocity of the center of mass $V_{\text{CM}}$ and the irreducible translational energy $K_{\text{CM}}$.
3. Compute the internal energy $K_{\text{int}}$ using the reduced mass formula.
4. Verify that the thermal and deformation energy generated by the weld equals exactly $K_{\text{int}}$.

**Solution:**
- **Step 1: Initial laboratory kinetic energy**
  $$K_A = \frac{1}{2}(10.0)(30.0)^2 = 5.0 \times 900 = 4500.0\,\text{J}$$
  $$K_B = \frac{1}{2}(40.0)(-10.0)^2 = 20.0 \times 100 = 2000.0\,\text{J}$$
  $$K_{\text{lab}} = 4500.0 + 2000.0 = 6500.0\,\text{J}$$

- **Step 2: Center of mass velocity and $K_{\text{CM}}$**
  $$M = 10.0 + 40.0 = 50.0\,\text{kg}$$
  $$P_{\text{total}} = (10.0)(+30.0) + (40.0)(-10.0) = 300.0 - 400.0 = -100.0\,\text{kg}\cdot\text{m/s}$$
  $$V_{\text{CM}} = \frac{-100.0\,\text{kg}\cdot\text{m/s}}{50.0\,\text{kg}} = -2.00\,\text{m/s}$$
  $$K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2 = \frac{1}{2}(50.0\,\text{kg})(-2.00\,\text{m/s})^2 = 25.0 \times 4.00 = 100.0\,\text{J}$$

- **Step 3: Internal energy via reduced mass**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(10.0)(40.0)}{50.0} = 8.00\,\text{kg}$$
  $$v_{\text{rel}} = v_1 - v_2 = +30.0 - (-10.0) = 40.0\,\text{m/s}$$
  $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(8.00\,\text{kg})(40.0\,\text{m/s})^2 = 4.00 \times 1600.0 = 6400.0\,\text{J}$$

- **Step 4: Energy dissipation verification**
  After the collision, the welded body moves at $V_{\text{CM}} = -2.00\,\text{m/s}$.
  Its final kinetic energy is:
  $$K_{\text{final}} = \frac{1}{2} M V_{\text{CM}}^2 = 100.0\,\text{J} \equiv K_{\text{CM}}$$
  Energy converted into heat and metal deformation:
  $$\Delta K_{\text{loss}} = K_{\text{lab}} - K_{\text{final}} = 6500.0\,\text{J} - 100.0\,\text{J} = 6400.0\,\text{J} \equiv K_{\text{int}}$$
  The entire internal kinetic energy $K_{\text{int}} = 6400\,\text{J}$ ($98.46\%$ of total system energy) was destroyed, leaving only the irreducible $K_{\text{CM}} = 100\,\text{J}$!

---

## 4.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 4.8.

### Tier 1: Discrete Center of Mass
- **Exercise 4.1:** Two particles $m_1 = 3.00\,\text{kg}$ at $x_1 = 2.00\,\text{m}$ and $m_2 = 7.00\,\text{kg}$ at $x_2 = 8.00\,\text{m}$ lie on the $x$-axis. Find $X_{\text{CM}}$.
- **Exercise 4.2:** Three masses are placed at the vertices of an equilateral triangle of side $L = 1.00\,\text{m}$: $m_1 = 1.00\,\text{kg}$ at $(0, 0)$, $m_2 = 2.00\,\text{kg}$ at $(1.00, 0)$, and $m_3 = 3.00\,\text{kg}$ at $(0.500, \sqrt{3}/2)$. Compute $(X_{\text{CM}}, Y_{\text{CM}})$.

### Tier 2: Continuous Symmetries & Cutouts
- **Exercise 4.3:** Find the center of mass of a uniform thin semicircular wire of radius $R$ centered at the origin lying in the upper half-plane ($y \ge 0$).
- **Exercise 4.4:** A square plate of side $L = 0.400\,\text{m}$ has a square corner of side $L/2 = 0.200\,\text{m}$ removed. Find the center of mass of the remaining L-shaped plate relative to the uncut corner.

### Tier 3: Motion & Zero-Momentum Transformations
- **Exercise 4.5:** Two particles $m_1 = 2.00\,\text{kg}$ and $m_2 = 4.00\,\text{kg}$ have velocities $\vec{v}_1 = (3.00\,\hat{i} + 4.00\,\hat{j})\,\text{m/s}$ and $\vec{v}_2 = (-1.00\,\hat{i} + 2.00\,\hat{j})\,\text{m/s}$. Compute $\vec{V}_{\text{CM}}$ and the velocities $\vec{v}'_1, \vec{v}'_2$ in the C-frame.
- **Exercise 4.6:** A girl of mass $40.0\,\text{kg}$ stands on a $120.0\,\text{kg}$ raft of length $4.00\,\text{m}$ in a lake. If she walks from one end of the raft to the other, what is the displacement of the raft?

### Tier 4: Koenig’s Theorem Applications
- **Exercise 4.7:** Compute the reduced mass $\mu$ and internal kinetic energy $K_{\text{int}}$ of a system where $m_1 = 5.00\,\text{kg}$ moving at $12.0\,\text{m/s}$ strikes a stationary target $m_2 = 15.0\,\text{kg}$.
- **Exercise 4.8:** A projectile of mass $12.0\,\text{kg}$ explodes into three pieces of equal mass. If the internal blast adds $6000\,\text{J}$ of energy, what is the average speed squared $\langle v'^2 \rangle$ of the fragments in the C-frame?

### Tier 5: Trajectory Invariance in Gravity Fields
- **Exercise 4.9:** A shell launched at $v_0 = 50.0\,\text{m/s}$ at $60.0^\circ$ explodes at $t = 2.00\,\text{s}$ into two unequal masses ($1:3$ ratio). The heavier piece lands at $t = 3.50\,\text{s}$ at $x = 100.0\,\text{m}$. Find the landing position of the lighter piece ($g = 9.81\,\text{m/s}^2$).
- **Exercise 4.10:** Two masses $m_1$ and $m_2$ connected by a spring of stiffness $k$ are dropped simultaneously from rest in a vacuum. Prove that the center of mass falls with acceleration $g$ regardless of the initial compression or oscillation of the spring.

---

## 4.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 4.1
- **Given:** $m_1 = 3.00\,\text{kg}$ at $x_1 = 2.00\,\text{m}$, $m_2 = 7.00\,\text{kg}$ at $x_2 = 8.00\,\text{m}$.
- **Step 1: Center of mass calculation**
  $$X_{\text{CM}} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \frac{(3.00)(2.00) + (7.00)(8.00)}{3.00 + 7.00} = \frac{6.00 + 56.00}{10.00} = \frac{62.00}{10.00} = 6.20\,\text{m}$$

---

### Solution 4.2
- **Given:** $m_1 = 1.00\,\text{kg}$ at $(0, 0)$, $m_2 = 2.00\,\text{kg}$ at $(1.00, 0)$, $m_3 = 3.00\,\text{kg}$ at $(0.500, 0.8660)$.
- **Step 1: Total mass**
  $$M = 1.00 + 2.00 + 3.00 = 6.00\,\text{kg}$$
- **Step 2: Coordinates**
  $$X_{\text{CM}} = \frac{(1.00)(0) + (2.00)(1.00) + (3.00)(0.500)}{6.00} = \frac{0 + 2.00 + 1.50}{6.00} = \frac{3.50}{6.00} = 0.5833\,\text{m}$$
  $$Y_{\text{CM}} = \frac{(1.00)(0) + (2.00)(0) + (3.00)(0.8660)}{6.00} = \frac{2.598}{6.00} = 0.4330\,\text{m}$$
  $$\vec{R}_{\text{CM}} = (0.583, 0.433)\,\text{m}$$

---

### Solution 4.3
- **Given:** Semicircular thin wire of radius $R$ ($y \ge 0$).
- **Step 1: Symmetry and coordinates**
  By symmetry across the $y$-axis, $X_{\text{CM}} = 0$.
  Element of mass: $dm = \lambda \, ds = \lambda R \, d\theta$, with $\theta \in [0, \pi]$.
  $y(\theta) = R \sin\theta$. Total mass $M = \lambda \pi R$.
- **Step 2: Integration for $Y_{\text{CM}}$**
  $$\int y \, dm = \int_0^\pi (R\sin\theta)(\lambda R \, d\theta) = \lambda R^2 \int_0^\pi \sin\theta \, d\theta = \lambda R^2 [-\cos\theta]_0^\pi = 2 \lambda R^2$$
  $$Y_{\text{CM}} = \frac{2\lambda R^2}{M} = \frac{2\lambda R^2}{\lambda \pi R} = \frac{2R}{\pi} \approx 0.6366 R$$

---

### Solution 4.4
- **Given:** Square plate of side $L = 0.400\,\text{m}$, quadrant removed.
- **Step 1: Divide into three equal sub-squares**
  Divide the L-shaped plate into three identical squares of side $a = L/2 = 0.200\,\text{m}$ and mass $m$:
  - Square 1: center at $(a/2, a/2) = (0.100, 0.100)\,\text{m}$.
  - Square 2: center at $(3a/2, a/2) = (0.300, 0.100)\,\text{m}$.
  - Square 3: center at $(a/2, 3a/2) = (0.100, 0.300)\,\text{m}$.
- **Step 2: Center of mass**
  $$X_{\text{CM}} = \frac{0.100 + 0.300 + 0.100}{3} = \frac{0.500}{3} = 0.1667\,\text{m}$$
  $$Y_{\text{CM}} = \frac{0.100 + 0.100 + 0.300}{3} = \frac{0.500}{3} = 0.1667\,\text{m}$$
  $$\vec{R}_{\text{CM}} = (0.167, 0.167)\,\text{m}$$

---

### Solution 4.5
- **Given:** $m_1 = 2.00\,\text{kg}$, $\vec{v}_1 = (3.00, 4.00)$, $m_2 = 4.00\,\text{kg}$, $\vec{v}_2 = (-1.00, 2.00)$.
- **Step 1: Center of mass velocity**
  $$M = 6.00\,\text{kg}$$
  $$V_{x,\text{CM}} = \frac{(2.00)(3.00) + (4.00)(-1.00)}{6.00} = \frac{6.00 - 4.00}{6.00} = +0.3333\,\text{m/s}$$
  $$V_{y,\text{CM}} = \frac{(2.00)(4.00) + (4.00)(2.00)}{6.00} = \frac{8.00 + 8.00}{6.00} = +2.6667\,\text{m/s}$$
  $$\vec{V}_{\text{CM}} = 0.333\,\hat{i} + 2.667\,\hat{j}\,\text{m/s}$$
- **Step 2: C-frame velocities**
  $$\vec{v}'_1 = \vec{v}_1 - \vec{V}_{\text{CM}} = (3.00 - 0.333)\,\hat{i} + (4.00 - 2.667)\,\hat{j} = +2.667\,\hat{i} + 1.333\,\hat{j}\,\text{m/s}$$
  $$\vec{v}'_2 = \vec{v}_2 - \vec{V}_{\text{CM}} = (-1.00 - 0.333)\,\hat{i} + (2.00 - 2.667)\,\hat{j} = -1.333\,\hat{i} - 0.667\,\hat{j}\,\text{m/s}$$

---

### Solution 4.6
- **Given:** $m = 40.0\,\text{kg}$, $M = 120.0\,\text{kg}$, $L = 4.00\,\text{m}$.
- **Step 1: Displacement formula from Example 3.3**
  $$\Delta x_{\text{raft}} = -\frac{m}{M + m} L = -\frac{40.0\,\text{kg}}{120.0 + 40.0\,\text{kg}} (4.00\,\text{m}) = -\frac{40.0}{160.0}(4.00) = -1.00\,\text{m}$$
  The raft shifts $1.00\,\text{m}$ in the opposite direction.

---

### Solution 4.7
- **Given:** $m_1 = 5.00\,\text{kg}$, $v_1 = 12.0\,\text{m/s}$, $m_2 = 15.0\,\text{kg}$, $v_2 = 0$.
- **Step 1: Reduced mass $\mu$**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(5.00)(15.0)}{5.00 + 15.0} = \frac{75.0}{20.0} = 3.75\,\text{kg}$$
- **Step 2: Relative velocity**
  $$v_{\text{rel}} = v_1 - v_2 = 12.0 - 0 = 12.0\,\text{m/s}$$
- **Step 3: Internal kinetic energy**
  $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(3.75\,\text{kg})(12.0\,\text{m/s})^2 = 0.5 \times 3.75 \times 144.0 = 270.0\,\text{J}$$

---

### Solution 4.8
- **Given:** Three equal pieces ($m_i = m = 4.00\,\text{kg}$), $\Delta E_{\text{blast}} = K_{\text{int}} = 6000.0\,\text{J}$.
- **Step 1: Internal kinetic energy summation**
  $$K_{\text{int}} = \sum_{i=1}^3 \frac{1}{2} m_i (v'_i)^2 = \frac{1}{2} m \sum_{i=1}^3 (v'_i)^2 = \frac{1}{2}(4.00\,\text{kg}) \cdot 3 \langle v'^2 \rangle = 6.00 \langle v'^2 \rangle$$
- **Step 2: Solve for average speed squared**
  $$\langle v'^2 \rangle = \frac{6000.0\,\text{J}}{6.00\,\text{kg}} = 1000.0\,\text{m}^2/\text{s}^2 \implies v'_{\text{rms}} = \sqrt{1000.0} = 31.62\,\text{m/s}$$

---

### Solution 4.9
- **Given:** $v_0 = 50.0\,\text{m/s}$, $\theta = 60.0^\circ$, $g = 9.81\,\text{m/s}^2$. $m_1 = M/4$ (lighter), $m_2 = 3M/4$ (heavier).
- **Step 1: Initial horizontal velocity**
  $$v_{0x} = 50.0 \cos(60.0^\circ) = 25.0\,\text{m/s}$$
  Because $\sum F_x = 0$, $V_{x,\text{CM}} = 25.0\,\text{m/s}$ is constant at all times!
- **Step 2: Total flight time of center of mass**
  $$v_{0y} = 50.0 \sin(60.0^\circ) = 43.30\,\text{m/s}$$
  $$T_{\text{flight}} = \frac{2 v_{0y}}{g} = \frac{2(43.30)}{9.81} = 8.828\,\text{s}$$
  Total range of CM:
  $$X_{\text{CM}} = v_{0x} T_{\text{flight}} = (25.0)(8.828) = 220.70\,\text{m}$$
- **Step 3: Solve for $x_1$**
  $$X_{\text{CM}} = \frac{1}{4} x_1 + \frac{3}{4} x_2 \implies x_1 = 4 X_{\text{CM}} - 3 x_2$$
  $$x_1 = 4(220.70) - 3(100.0) = 882.80 - 300.00 = 582.80\,\text{m}$$
  The lighter piece lands at $x_1 = 582.8\,\text{m}$.

---

### Solution 4.10
- **Proof:**
  Let $m_1$ and $m_2$ be connected by an arbitrary internal spring exerting force $\vec{F}_s$.
  Forces on $m_1$: $\vec{F}_1 = m_1 \vec{g} + \vec{F}_s$.
  Forces on $m_2$: $\vec{F}_2 = m_2 \vec{g} - \vec{F}_s$.
  Applying Newton's Second Law for the Center of Mass:
  $$M_{\text{total}} \vec{A}_{\text{CM}} = \vec{F}_1 + \vec{F}_2 = (m_1 \vec{g} + \vec{F}_s) + (m_2 \vec{g} - \vec{F}_s) = (m_1 + m_2)\vec{g} = M_{\text{total}} \vec{g}$$
  Dividing by $M_{\text{total}}$:
  $$\vec{A}_{\text{CM}} \equiv \vec{g}$$
  The spring forces cancel identically in pairs ($\vec{F}_s - \vec{F}_s \equiv \vec{0}$).
  Therefore, the center of mass undergoes pure free fall with acceleration $\vec{g}$, completely independent of whether the spring is wildly oscillating or vibrating!


---

# Chapter 05: One-Dimensional Elastic Collisions — Velocity Exchange, Relative Speed Invariance, and Center-of-Mass Symmetry

> *"In a perfectly elastic collision, nature achieves dynamic perfection. Not a single quantum of kinetic energy is surrendered to heat or acoustic noise. The collision is an instantaneous dance of pure elastic compression and rebound, governed by the sacred invariance of relative speed."*

---

## 5.1 The Definition of Elastic Perfection

Throughout daily life, almost every collision we observe is partially or completely inelastic: when cars crash, metal crunches and absorbs energy; when a drop of clay strikes the floor, it flattens and sticks; when two wooden billiard balls strike each other, a sharp acoustic "clack" radiates sound energy into the surrounding air.

However, in the fundamental mechanics of idealized hard spheres—and with high precision in the atomic, subatomic, and low-energy nuclear realms—there exists a distinct physical regime: **The Perfectly Elastic Collision**.

A collision is defined as **perfectly elastic** if and only if it satisfies two simultaneous conservation laws:
1. **Conservation of Linear Momentum:** The total vector momentum is invariant across the collision:
   $$\vec{P}_{\text{total, initial}} = \vec{P}_{\text{total, final}} \iff \sum_{i} m_i \vec{v}_{i,\text{init}} = \sum_{i} m_i \vec{v}_{i,\text{final}}$$
2. **Conservation of Mechanical Kinetic Energy:** The total mechanical kinetic energy of all translating bodies before the collision equals the total mechanical kinetic energy after separation:
   $$K_{\text{total, initial}} = K_{\text{total, final}} \iff \sum_{i} \frac{1}{2} m_i v_{i,\text{init}}^2 = \sum_{i} \frac{1}{2} m_i v_{i,\text{final}}^2$$

During the microscopic microsecond of maximum compression, kinetic energy is temporarily stored as elastic potential energy $U_{\text{elastic}}$ in the atomic lattices of the colliding bodies. In a perfectly elastic impact, **one hundred percent** of this stored potential energy is returned to macroscopic kinetic motion during the restitution phase, leaving zero residual thermal excitation or structural distortion.

---

## 5.2 Mathematical Derivation: The 1D Canonical Velocity Equations

Consider two particles of masses $m_1$ and $m_2$ constrained to move along a single horizontal axis (the $x$-axis).
- Let $v_{1i}$ and $v_{2i}$ denote their initial velocities before impact.
- Let $v_{1f}$ and $v_{2f}$ denote their final velocities after separation.

```
       Before Collision:
              v1i --->                      v2i --->
            ( m1 )                        ( m2 )
       =========================================================

       After Collision:
              v1f --->                      v2f --->
            ( m1 )                        ( m2 )
       =========================================================
```

### 1. The Momentum Conservation Equation
$$\sum p_{\text{init}} = \sum p_{\text{final}} \implies m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}$$

Group terms by mass ($m_1$ on the left, $m_2$ on the right):

$$m_1 (v_{1i} - v_{1f}) = m_2 (v_{2f} - v_{2i}) \qquad \text{(Eq. 5.1)}$$

### 2. The Kinetic Energy Conservation Equation
$$\frac{1}{2} m_1 v_{1i}^2 + \frac{1}{2} m_2 v_{2i}^2 = \frac{1}{2} m_1 v_{1f}^2 + \frac{1}{2} m_2 v_{2f}^2$$

Cancel the universal factor of $\frac{1}{2}$ and group terms by mass:

$$m_1 (v_{1i}^2 - v_{1f}^2) = m_2 (v_{2f}^2 - v_{2i}^2) \qquad \text{(Eq. 5.2)}$$

### 3. Factoring the Difference of Squares
Recall the algebraic identity $a^2 - b^2 = (a - b)(a + b)$. Expand Eq. 5.2:

$$m_1 (v_{1i} - v_{1f})(v_{1i} + v_{1f}) = m_2 (v_{2f} - v_{2i})(v_{2f} + v_{2i}) \qquad \text{(Eq. 5.3)}$$

Now divide Eq. 5.3 by Eq. 5.1 (assuming non-zero interaction, so $v_{1f} \ne v_{1i}$):

$$\frac{m_1 (v_{1i} - v_{1f})(v_{1i} + v_{1f})}{m_1 (v_{1i} - v_{1f})} = \frac{m_2 (v_{2f} - v_{2i})(v_{2f} + v_{2i})}{m_2 (v_{2f} - v_{2i})}$$

The mass terms and differences cancel cleanly, leaving an extraordinarily simple linear relation:

$$v_{1i} + v_{1f} = v_{2f} + v_{2i}$$

Rearranging terms:

$$v_{2f} - v_{1f} = -(v_{2i} - v_{1i}) \qquad \text{(Eq. 5.4)}$$

### The Relative Speed Invariance Theorem
Define the relative velocity of Body 2 with respect to Body 1:
- Relative velocity of approach before impact: $\vec{v}_{\text{rel, init}} = v_{2i} - v_{1i}$
- Relative velocity of separation after impact: $\vec{v}_{\text{rel, final}} = v_{2f} - v_{1f}$

Eq. 5.4 establishes one of the most elegant theorems of classical mechanics:

$$\vec{v}_{\text{rel, final}} = -\vec{v}_{\text{rel, init}} \iff |v_{2f} - v_{1f}| = |v_{2i} - v_{1i}|$$

**The Relative Speed Invariance Theorem:**
> *In any one-dimensional perfectly elastic collision, the relative speed of separation after the collision is identically equal to the relative speed of approach before the collision!*

The collision merely reverses the sign of the relative velocity vector while preserving its scalar magnitude.

---

## 5.3 Closed-Form Analytical Velocity Solutions

Eq. 5.1 and Eq. 5.4 form a linear system of two equations in two unknowns ($v_{1f}$ and $v_{2f}$):
1. $m_1 v_{1f} + m_2 v_{2f} = m_1 v_{1i} + m_2 v_{2i}$
2. $v_{2f} - v_{1f} = v_{1i} - v_{2i} \implies v_{2f} = v_{1f} + v_{1i} - v_{2i}$

Substitute $v_{2f}$ into the momentum equation:

$$m_1 v_{1f} + m_2 (v_{1f} + v_{1i} - v_{2i}) = m_1 v_{1i} + m_2 v_{2i}$$

$$(m_1 + m_2) v_{1f} + m_2 v_{1i} - m_2 v_{2i} = m_1 v_{1i} + m_2 v_{2i}$$

$$(m_1 + m_2) v_{1f} = (m_1 - m_2) v_{1i} + 2 m_2 v_{2i}$$

Dividing by $(m_1 + m_2)$:

$$v_{1f} = \left(\frac{m_1 - m_2}{m_1 + m_2}\right) v_{1i} + \left(\frac{2m_2}{m_1 + m_2}\right) v_{2i} \qquad \text{(Eq. 5.5)}$$

By perfect algebraic symmetry (swapping indices $1 \leftrightarrow 2$):

$$v_{2f} = \left(\frac{2m_1}{m_1 + m_2}\right) v_{1i} + \left(\frac{m_2 - m_1}{m_1 + m_2}\right) v_{2i} \qquad \text{(Eq. 5.6)}$$

These are the **Canonical One-Dimensional Elastic Collision Equations**.

---

## 5.4 Analysis of Fundamental Mass Ratio Regimes

The power of Eqs. 5.5 and 5.6 is demonstrated by examining four fundamental limiting regimes.

```
+---------------------------------------------------------------------------------------------------+
|                           FOUR REGIMES OF 1D ELASTIC COLLISIONS                                   |
+--------------------------+-----------------------+-----------------------+------------------------+
| Mass Regime              | Condition             | Final Velocity v_1f   | Final Velocity v_2f    |
+--------------------------+-----------------------+-----------------------+------------------------+
| 1. Equal Masses          | m1 = m2 = m           | v_1f = v_2i           | v_2f = v_1i            |
| 2. Stationary Target     | v_2i = 0              | v_1f = (m1-m2)/(m1+m2)*v_1i | v_2f = 2m1/(m1+m2)*v_1i|
| 3. Massive Projectile    | m1 >> m2, v_2i = 0    | v_1f ≈ v_1i           | v_2f ≈ 2 v_1i          |
| 4. Heavy Wall Target     | m1 << m2, v_2i = 0    | v_1f ≈ -v_1i          | v_2f ≈ 0               |
+--------------------------+-----------------------+-----------------------+------------------------+
```

### Regime 1: Identical Masses ($m_1 = m_2$) — Perfect Velocity Exchange
When the colliding bodies have identical masses:
- $m_1 - m_2 = 0$
- $\frac{2m_2}{m_1 + m_2} = \frac{2m}{2m} = 1$
- $\frac{2m_1}{m_1 + m_2} = 1$

Equations 5.5 and 5.6 collapse to:

$$v_{1f} = v_{2i}, \qquad v_{2f} = v_{1i}$$

**The Velocity Exchange Theorem:**
> *When two equal masses collide elastically in one dimension, they completely and perfectly exchange their velocities!*

If Ball 1 approaches with velocity $v_{1i}$ and strikes stationary Ball 2 ($v_{2i} = 0$):
- Ball 1 stops dead in its tracks: $v_{1f} = 0$.
- Ball 2 shoots forward with the exact speed of Ball 1: $v_{2f} = v_{1i}$.
This is the physical engine driving **Newton’s Cradle** and billiard cue-ball stop shots.

```
       Newton's Cradle (Equal Mass Elastic Exchange):
       (o) --->        (o)(o)(o)(o)             stops dead      (o)(o)(o)     ---> (o)
        1                   2 3 4 5  ==Impact==>    1             2 3 4          5
       (Mass m)            (Mass m)                 v1f = 0                     v5f = v1i
```

### Regime 2: Massive Projectile Striking Light Stationary Target ($m_1 \gg m_2, v_{2i} = 0$)
Let a massive bowling ball or freight train ($m_1$) strike a stationary table-tennis ball ($m_2$).
In the limit as $m_2 / m_1 \to 0$:
$$\frac{m_1 - m_2}{m_1 + m_2} = \frac{1 - m_2/m_1}{1 + m_2/m_1} \to 1 \implies v_{1f} \approx v_{1i}$$
$$\frac{2m_1}{m_1 + m_2} = \frac{2}{1 + m_2/m_1} \to 2 \implies v_{2f} \approx 2 v_{1i}$$

**The Double-Velocity Ejection Rule:**
> *When an overwhelmingly massive projectile strikes a stationary lightweight particle elastically, the projectile continues forward essentially unhindered, while the lightweight particle is ejected forward at TWICE the speed of the projectile!*

This principle is exploited in baseball and tennis: a massive swinging bat ($m_1 \approx 900\,\text{g}$) moving at $v_{\text{bat}}$ imparts a massive velocity boost to the lighter ball ($m_2 \approx 145\,\text{g}$).

### Regime 3: Lightweight Projectile Striking Immovable Barrier ($m_1 \ll m_2, v_{2i} = 0$)
Let a tennis ball ($m_1$) strike a concrete wall or Earth itself ($m_2 \to \infty$).
In the limit as $m_1 / m_2 \to 0$:
$$\frac{m_1 - m_2}{m_1 + m_2} \to -1 \implies v_{1f} \approx -v_{1i}$$
$$\frac{2m_1}{m_1 + m_2} \to 0 \implies v_{2f} \approx 0$$
The light projectile rebounds with the **exact same speed in the opposite direction** ($v_{1f} = -v_{1i}$), while the barrier absorbs momentum without noticeable motion.

---

## 5.5 The Center-of-Mass Frame: Kinematic Mirror Symmetry

Calculating elastic collisions in the laboratory frame requires non-trivial algebra. However, if we transform to the **Center-of-Mass (Zero-Momentum) Frame**, the collision becomes trivial.

Recall from Chapter 04 that in the C-frame:

$$\vec{P}'_{\text{total}} = m_1 \vec{u}'_{1i} + m_2 \vec{u}'_{2i} \equiv \vec{0} \implies u'_{2i} = -\frac{m_1}{m_2} u'_{1i}$$

Total kinetic energy in the C-frame before impact:

$$K'_{\text{init}} = \frac{1}{2} m_1 (u'_{1i})^2 + \frac{1}{2} m_2 (u'_{2i})^2 = \frac{1}{2} m_1 (u'_{1i})^2 + \frac{1}{2} m_2 \left( \frac{m_1}{m_2} u'_{1i} \right)^2 = \frac{1}{2} m_1 \left(1 + \frac{m_1}{m_2}\right) (u'_{1i})^2$$

After the collision, momentum must still sum to zero ($u'_{2f} = -\frac{m_1}{m_2} u'_{1f}$), and kinetic energy must be conserved ($K'_{\text{final}} = K'_{\text{init}}$):

$$\frac{1}{2} m_1 \left(1 + \frac{m_1}{m_2}\right) (u'_{1f})^2 = \frac{1}{2} m_1 \left(1 + \frac{m_1}{m_2}\right) (u'_{1i})^2 \implies (u'_{1f})^2 = (u'_{1i})^2$$

Taking the non-trivial root (rebound):

$$u'_{1f} = -u'_{1i}$$

$$u'_{2f} = -u'_{2i}$$

```
   Laboratory Frame (Asymmetric):
         v1i --->           v2i --->
       [  m1  ]           [   m2   ]
       V_CM = (m1*v1i + m2*v2i) / (m1 + m2)

   Center-of-Mass Frame (Pure Mirror Symmetry):
         u'1i --->         <--- u'2i
       [  m1  ]           [   m2   ]
       Total Momentum = 0

   After Collision in C-Frame:
       <--- u'1f = -u'1i   u'2f = -u'2i --->
       [  m1  ]           [   m2   ]
       Velocities simply REVERSE SIGN!
```

**The Center-of-Mass Elastic Reflection Theorem:**
> *In the Center-of-Mass reference frame, an elastic collision is mathematically identical to an instantaneous mirror reflection! Each particle rebounds with its magnitude of velocity unchanged ($|u'_f| = |u'_i|$), simply reversing its direction.*

To find laboratory velocities, simply add $V_{\text{CM}}$:

$$v_{1f} = u'_{1f} + V_{\text{CM}} = -u'_{1i} + V_{\text{CM}} = -(v_{1i} - V_{\text{CM}}) + V_{\text{CM}} = 2V_{\text{CM}} - v_{1i}$$

$$v_{2f} = 2V_{\text{CM}} - v_{2i}$$

This formula computes post-collision velocities in a single algebraic line!

---

## 5.6 Fractional Kinetic Energy Transfer and Nuclear Moderation

Suppose Body 1 of mass $m_1$ is fired at initial speed $v_{1i}$ into a stationary target ($m_2$, $v_{2i} = 0$).
How much kinetic energy is transferred to target Body 2?

Final velocity of target:

$$v_{2f} = \frac{2m_1}{m_1 + m_2} v_{1i}$$

Kinetic energy gained by target:

$$K_{2f} = \frac{1}{2} m_2 v_{2f}^2 = \frac{1}{2} m_2 \left( \frac{2m_1}{m_1 + m_2} v_{1i} \right)^2 = \frac{1}{2} m_2 \frac{4 m_1^2}{(m_1 + m_2)^2} v_{1i}^2$$

The initial kinetic energy of the projectile was $K_{1i} = \frac{1}{2} m_1 v_{1i}^2$.
Taking the ratio $\Delta K / K_{1i}$:

$$\frac{K_{2f}}{K_{1i}} = \frac{4 m_1 m_2}{(m_1 + m_2)^2}$$

Let us analyze this fraction as a function of the mass ratio $r = m_1 / m_2$:

$$\frac{K_{2f}}{K_{1i}} = \frac{4r}{(1 + r)^2}$$

To find the maximum energy transfer, take the derivative with respect to $r$ and set to zero:

$$\frac{d}{dr}\left[ \frac{4r}{(1 + r)^2} \right] = \frac{4(1+r)^2 - 4r \cdot 2(1+r)}{(1+r)^4} = \frac{4(1+r) - 8r}{(1+r)^3} = \frac{4 - 4r}{(1+r)^3} = 0 \implies r = 1$$

$$m_1 = m_2 \implies \frac{K_{2f}}{K_{1i}} = \frac{4(1)}{(1+1)^2} = \frac{4}{4} = 1.00 \implies \mathbf{100\%}$$

```
   Fractional Energy Transfer K_2f / K_1i
     1.0 -+                         * (Peak at m1 = m2: 100% transfer)
          |                       /   \
      0.8 -+                      /     \
          |                     /       \
      0.6 -+                    /         \
          |                   /           \
      0.4 -+                  /             \
          |                 /               ' - - - -
      0.2 -+               /                          ' - - -
        0 +---------------+-------------------------------------> Mass Ratio m1/m2
          0              1.0               2.0               3.0
```

### Why Nuclear Reactors Use Water (Neutron Moderation)
In a nuclear fission reactor, uranium-235 splits and ejects "fast neutrons" with kinetic energy $E \approx 2\,\text{MeV}$ ($v \approx 20,000\,\text{km/s}$). To induce further fission chains, these neutrons must be slowed down ("thermalized") to $E \approx 0.025\,\text{eV}$ ($v \approx 2.2\,\text{km/s}$).

How do nuclear engineers slow down fast neutrons? By colliding them elastically with stationary nuclei!
- If a neutron ($m_n \approx 1\,\text{u}$) collides with a heavy Lead nucleus ($^{208}\text{Pb}$, $m \approx 208\,\text{u}$):
  $$\frac{K_2}{K_1} = \frac{4(1)(208)}{(209)^2} = \frac{832}{43,681} \approx 0.019 \implies 1.9\% \text{ energy loss per collision}$$
  It would take thousands of collisions to slow down the neutron.
- If a neutron collides with a Hydrogen nucleus (a single proton, $m_p \approx 1\,\text{u}$ in ordinary water $\text{H}_2\text{O}$):
  $$m_n \approx m_p \implies \frac{K_2}{K_1} \approx 1.00 \implies \mathbf{100\%} \text{ head-on energy transfer!}$$
  In water or heavy water ($\text{D}_2\text{O}$), a fast neutron is thermalized in barely **20 to 30 collisions**!

---

## 5.7 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 5.1: Head-On Billiard Ball Impact
**Problem:** A white cue ball of mass $m_1 = 0.170\,\text{kg}$ rolls across a slate table at $v_{1i} = +4.00\,\text{m/s}$ and strikes an identical red 8-ball ($m_2 = 0.170\,\text{kg}$) initially at rest ($v_{2i} = 0$). Assuming a perfectly elastic 1D collision:
1. Calculate the final velocities $v_{1f}$ and $v_{2f}$.
2. Verify conservation of mechanical kinetic energy.

**Solution:**
- **Step 1: Canonical velocity calculation**
  Since $m_1 = m_2 = 0.170\,\text{kg}$:
  $$v_{1f} = \left(\frac{m_1 - m_2}{m_1 + m_2}\right) v_{1i} + \left(\frac{2m_2}{m_1 + m_2}\right) v_{2i} = (0)(4.00) + (1)(0) = 0.00\,\text{m/s}$$
  $$v_{2f} = \left(\frac{2m_1}{m_1 + m_2}\right) v_{1i} + \left(\frac{m_2 - m_1}{m_1 + m_2}\right) v_{2i} = (1)(4.00) + (0)(0) = +4.00\,\text{m/s}$$
  The cue ball stops completely; the 8-ball shoots forward at $4.00\,\text{m/s}$.

- **Step 2: Kinetic energy check**
  $$K_{\text{init}} = \frac{1}{2}(0.170)(4.00)^2 = 0.5 \times 0.170 \times 16.0 = 1.360\,\text{J}$$
  $$K_{\text{final}} = \frac{1}{2}(0.170)(4.00)^2 = 1.360\,\text{J}$$
  $K_{\text{init}} \equiv K_{\text{final}}$. Verified.

---

### Example 5.2: Asymmetric Collision with Moving Target
**Problem:** Cart 1 of mass $m_1 = 2.00\,\text{kg}$ moves rightward at $v_{1i} = +6.00\,\text{m/s}$. Cart 2 of mass $m_2 = 5.00\,\text{kg}$ moves leftward at $v_{2i} = -3.00\,\text{m/s}$. They collide elastically on a frictionless track.
1. Determine the post-collision velocities $v_{1f}$ and $v_{2f}$.
2. Verify the Relative Speed Invariance Theorem.

**Solution:**
- **Step 1: Velocity calculation**
  $$m_1 + m_2 = 2.00 + 5.00 = 7.00\,\text{kg}$$
  $$m_1 - m_2 = 2.00 - 5.00 = -3.00\,\text{kg}$$
  - For Cart 1:
    $$v_{1f} = \left(\frac{-3.00}{7.00}\right)(+6.00) + \left(\frac{2(5.00)}{7.00}\right)(-3.00) = \frac{-18.00 - 30.00}{7.00} = \frac{-48.00}{7.00} = -6.8571\,\text{m/s}$$
  - For Cart 2:
    $$v_{2f} = \left(\frac{2(2.00)}{7.00}\right)(+6.00) + \left(\frac{5.00 - 2.00}{7.00}\right)(-3.00) = \frac{+24.00 + 3.00(-3.00)}{7.00} = \frac{24.00 - 9.00}{7.00} = \frac{+15.00}{7.00} = +2.1429\,\text{m/s}$$

- **Step 2: Relative speed check**
  - Relative velocity of approach:
    $$v_{\text{rel, init}} = v_{2i} - v_{1i} = -3.00 - (+6.00) = -9.00\,\text{m/s} \implies |v_{\text{rel, init}}| = 9.00\,\text{m/s}$$
  - Relative velocity of separation:
    $$v_{\text{rel, final}} = v_{2f} - v_{1f} = +2.1429 - (-6.8571) = +9.0000\,\text{m/s}$$
    $$\vec{v}_{\text{rel, final}} = -\vec{v}_{\text{rel, init}}$$
  Relative speed of separation matches approach speed identically ($9.00\,\text{m/s}$).

---

### Example 5.3: Heavy Locomotive Striking Stalled Handcar
**Problem:** A switching locomotive of mass $M = 80,000\,\text{kg}$ rolls along a track at $v_0 = 12.0\,\text{m/s}$ and strikes an unbraked track inspection handcar of mass $m = 400.0\,\text{kg}$ initially at rest ($v = 0$). Assuming an elastic spring-bumper collision:
1. Compute the final speed of the handcar $v_{hf}$.
2. Compute the reduction in speed of the locomotive $\Delta V$.

**Solution:**
- **Step 1: Handcar final speed**
  $$v_{hf} = \frac{2M}{M + m} v_0 = \frac{2(80,000)}{80,000 + 400} (12.0\,\text{m/s}) = \frac{160,000}{80,400}(12.0) = (1.99005)(12.0) = 23.881\,\text{m/s}$$
  Notice that $v_{hf} \approx 2 v_0 = 24.0\,\text{m/s}$ (Double-Velocity Ejection Rule!).

- **Step 2: Locomotive speed change**
  $$V_f = \frac{M - m}{M + m} v_0 = \frac{80,000 - 400}{80,400}(12.0) = \frac{79,600}{80,400}(12.0) = (0.99005)(12.0) = 11.881\,\text{m/s}$$
  $$\Delta V = V_0 - V_f = 12.0 - 11.881 = 0.119\,\text{m/s} \approx 0.99\%$$
  The massive locomotive barely notices the collision, while the handcar is hurled forward at nearly $24\,\text{m/s}$ ($86\,\text{km/h}$)!

---

### Example 5.4: Subatomic Alpha-Proton Collision
**Problem:** In a cloud chamber, an alpha particle ($m_\alpha = 4.00\,\text{u}$) with kinetic energy $K_0 = 5.00\,\text{MeV}$ collides head-on elastically with a stationary hydrogen nucleus (proton, $m_p = 1.00\,\text{u}$).
1. Calculate the fraction of initial kinetic energy transferred to the proton.
2. Compute the final kinetic energies $K_p$ and $K_\alpha$.
3. Compute the ratio of the final speeds $v_p / v_\alpha$.

**Solution:**
- **Step 1: Fractional energy transfer**
  $$r = \frac{m_\alpha}{m_p} = \frac{4.00}{1.00} = 4.00$$
  $$\frac{K_p}{K_0} = \frac{4 m_\alpha m_p}{(m_\alpha + m_p)^2} = \frac{4(4.00)(1.00)}{(4.00 + 1.00)^2} = \frac{16.00}{25.00} = 0.6400 \implies 64.00\%$$

- **Step 2: Final kinetic energies**
  $$K_p = 0.6400 \times 5.00\,\text{MeV} = 3.200\,\text{MeV}$$
  $$K_\alpha = K_0 - K_p = 5.00 - 3.200 = 1.800\,\text{MeV}$$

- **Step 3: Speed ratio**
  $$K = \frac{1}{2} m v^2 \implies v = \sqrt{\frac{2K}{m}}$$
  $$\frac{v_p}{v_\alpha} = \sqrt{\frac{K_p / m_p}{K_\alpha / m_\alpha}} = \sqrt{\frac{3.200 / 1.00}{1.800 / 4.00}} = \sqrt{\frac{3.200}{0.450}} = \sqrt{7.111} = 2.667 = \frac{8}{3}$$
  *Check via Canonical formula:*
  $$v_p = \frac{2m_\alpha}{m_\alpha + m_p} v_0 = \frac{2(4)}{5} v_0 = 1.60 v_0$$
  $$v_\alpha = \frac{m_\alpha - m_p}{m_\alpha + m_p} v_0 = \frac{4 - 1}{5} v_0 = 0.60 v_0$$
  $$\frac{v_p}{v_\alpha} = \frac{1.60}{0.60} = \frac{8}{3} \approx 2.667$$. Flawless agreement!

---

### Example 5.5: Center-of-Mass Frame Shortcut Solution
**Problem:** Block A ($m_1 = 3.00\,\text{kg}$) moves at $v_{1i} = +10.0\,\text{m/s}$ and strikes Block B ($m_2 = 7.00\,\text{kg}$) moving at $v_{2i} = +2.00\,\text{m/s}$.
Solve for the post-collision velocities $v_{1f}$ and $v_{2f}$ using exclusively the **Center-of-Mass mirror reflection method**.

**Solution:**
- **Step 1: Compute Center of Mass velocity**
  $$V_{\text{CM}} = \frac{m_1 v_{1i} + m_2 v_{2i}}{m_1 + m_2} = \frac{(3.00)(10.0) + (7.00)(2.00)}{3.00 + 7.00} = \frac{30.0 + 14.0}{10.00} = \frac{44.0}{10.00} = +4.40\,\text{m/s}$$

- **Step 2: Transform to C-frame**
  $$u'_{1i} = v_{1i} - V_{\text{CM}} = 10.0 - 4.40 = +5.60\,\text{m/s}$$
  $$u'_{2i} = v_{2i} - V_{\text{CM}} = 2.00 - 4.40 = -2.40\,\text{m/s}$$

- **Step 3: Mirror reflection in C-frame**
  $$u'_{1f} = -u'_{1i} = -5.60\,\text{m/s}$$
  $$u'_{2f} = -u'_{2i} = +2.40\,\text{m/s}$$

- **Step 4: Transform back to laboratory frame**
  $$v_{1f} = u'_{1f} + V_{\text{CM}} = -5.60 + 4.40 = -1.20\,\text{m/s}$$
  $$v_{2f} = u'_{2f} + V_{\text{CM}} = +2.40 + 4.40 = +6.80\,\text{m/s}$$
  *Verification:* $3(-1.20) + 7(6.80) = -3.60 + 47.60 = 44.0\,\text{kg}\cdot\text{m/s} = P_{\text{init}}$.

---

### Example 5.6: Three-Ball Cascade Amplifier (Super-Elastic Illusion)
**Problem:** Three frictionless spheres are arranged in a straight line on a track:
- Ball 1: $m_1 = 9.00\,\text{kg}$, moving rightward at $v_1 = 4.00\,\text{m/s}$.
- Ball 2: $m_2 = 3.00\,\text{kg}$, initially at rest ($v_2 = 0$).
- Ball 3: $m_3 = 1.00\,\text{kg}$, initially at rest ($v_3 = 0$).
Ball 1 strikes Ball 2 elastically. Then Ball 2 shoots forward and strikes Ball 3 elastically.
1. Compute the velocity of Ball 2 after the first collision.
2. Compute the final velocity of Ball 3 after the second collision.
3. Compare the final kinetic energy of Ball 3 to the initial kinetic energy of Ball 1.

**Solution:**
- **Step 1: Collision 1 ($m_1 \to m_2$)**
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_1 = \frac{2(9.00\,\text{kg})}{9.00 + 3.00\,\text{kg}} (4.00\,\text{m/s}) = \frac{18.0}{12.0}(4.00) = 1.50 \times 4.00 = +6.00\,\text{m/s}$$
  Ball 2 departs at $6.00\,\text{m/s}$.

- **Step 2: Collision 2 ($m_2 \to m_3$)**
  Now Ball 2 ($m_2 = 3.00\,\text{kg}$) moves at $v_{2i}' = 6.00\,\text{m/s}$ toward stationary Ball 3 ($m_3 = 1.00\,\text{kg}$):
  $$v_{3f} = \frac{2 m_2}{m_2 + m_3} v_{2i}' = \frac{2(3.00\,\text{kg})}{3.00 + 1.00\,\text{kg}} (6.00\,\text{m/s}) = \frac{6.00}{4.00}(6.00) = 1.50 \times 6.00 = +9.00\,\text{m/s}$$
  Ball 3 accelerates to $9.00\,\text{m/s}$!

- **Step 3: Energy comparison**
  - Initial energy of Ball 1:
    $$K_1 = \frac{1}{2} m_1 v_1^2 = \frac{1}{2}(9.00\,\text{kg})(4.00\,\text{m/s})^2 = 4.50 \times 16.0 = 72.0\,\text{J}$$
  - Final energy of Ball 3:
    $$K_3 = \frac{1}{2} m_3 v_{3f}^2 = \frac{1}{2}(1.00\,\text{kg})(9.00\,\text{m/s})^2 = 0.50 \times 81.0 = 40.5\,\text{J}$$
  $$\frac{K_3}{K_1} = \frac{40.5}{72.0} = 0.5625 \implies 56.25\%$$
  The decreasing mass sequence acts as a **velocity amplifier**: speed more than doubled from $4.0\,\text{m/s}$ to $9.0\,\text{m/s}$! This is the physical mechanism of multi-stage supernova envelope ejection and whip-cracking.

---

### Example 5.7: Elastic Collision of Hanging Pendulums
**Problem:** Two simple pendulums of equal string length $L = 1.50\,\text{m}$ hang side-by-side with their bobs barely touching. Bob 1 has mass $m_1 = 0.200\,\text{kg}$; Bob 2 has mass $m_2 = 0.600\,\text{kg}$.
Bob 1 is pulled aside to a height $h_1 = 0.450\,\text{m}$ above its lowest point and released from rest. It collides elastically with stationary Bob 2 at the bottom. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the speed $v_{1i}$ of Bob 1 just before impact.
2. Determine the velocities $v_{1f}$ and $v_{2f}$ immediately after impact.
3. Calculate the maximum rebound heights $h_1'$ and $h_2'$ reached by each bob.

**Solution:**
- **Step 1: Impact speed of Bob 1**
  $$v_{1i} = \sqrt{2 g h_1} = \sqrt{2(9.81\,\text{m/s}^2)(0.450\,\text{m})} = \sqrt{8.829} = 2.9714\,\text{m/s}$$

- **Step 2: Post-collision velocities**
  $$m_1 + m_2 = 0.200 + 0.600 = 0.800\,\text{kg}$$
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{0.200 - 0.600}{0.800} (2.9714) = \frac{-0.400}{0.800}(2.9714) = -0.500(2.9714) = -1.4857\,\text{m/s}$$
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_{1i} = \frac{2(0.200)}{0.800} (2.9714) = +0.500(2.9714) = +1.4857\,\text{m/s}$$
  Bob 1 rebounds backward at $1.486\,\text{m/s}$; Bob 2 swings forward at $1.486\,\text{m/s}$.

- **Step 3: Maximum rebound heights**
  $$h_1' = \frac{v_{1f}^2}{2g} = \frac{(-1.4857\,\text{m/s})^2}{2(9.81\,\text{m/s}^2)} = \frac{2.2073}{19.62} = 0.1125\,\text{m} = \frac{h_1}{4}$$
  $$h_2' = \frac{v_{2f}^2}{2g} = \frac{(+1.4857\,\text{m/s})^2}{2(9.81\,\text{m/s}^2)} = 0.1125\,\text{m}$$
  Both bobs rise to exactly one-quarter of the original release height ($11.25\,\text{cm}$).

---

### Example 5.8: Maximum Compression of Buffer Spring During Elastic Impact
**Problem:** Cart 1 of mass $m_1 = 3.00\,\text{kg}$ rolls at $v_0 = 4.00\,\text{m/s}$ toward stationary Cart 2 of mass $m_2 = 6.00\,\text{kg}$. Cart 2 is equipped with an ideal horizontal bumper spring of stiffness $k = 1800\,\text{N/m}$. All track friction is zero.
1. Determine the velocity of the carts at the instant of **maximum spring compression**.
2. Compute the maximum compression $x_{\max}$ of the spring.
3. Compute the final velocities of both carts after the spring completely re-expands.

**Solution:**
- **Step 1: Velocity at maximum compression**
  Maximum compression occurs when the carts are momentarily at rest relative to each other.
  At that instant, both carts move with the **Center of Mass velocity** $V_{\text{CM}}$:
  $$V_{\text{CM}} = \frac{m_1 v_0 + 0}{m_1 + m_2} = \frac{(3.00\,\text{kg})(4.00\,\text{m/s})}{3.00 + 6.00\,\text{kg}} = \frac{12.0}{9.00} = 1.3333\,\text{m/s}$$

- **Step 2: Maximum spring compression**
  By Koenig’s Theorem, the initial kinetic energy is partitioned into translational CM energy and internal energy:
  $$K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}}$$
  At maximum compression, all internal kinetic energy $K_{\text{int}}$ is momentarily converted into spring potential energy:
  $$\frac{1}{2} k x_{\max}^2 = K_{\text{int}} = \frac{1}{2} \mu v_0^2$$
  Reduced mass:
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(3.00)(6.00)}{9.00} = 2.00\,\text{kg}$$
  $$K_{\text{int}} = \frac{1}{2}(2.00\,\text{kg})(4.00\,\text{m/s})^2 = 1.00 \times 16.0 = 16.0\,\text{J}$$
  Equating to spring energy:
  $$\frac{1}{2}(1800\,\text{N/m}) x_{\max}^2 = 16.0\,\text{J} \implies 900 x_{\max}^2 = 16.0 \implies x_{\max}^2 = \frac{16.0}{900} = 0.017778$$
  $$x_{\max} = \sqrt{0.017778} = 0.1333\,\text{m} = 13.33\,\text{cm}$$

- **Step 3: Final post-restitution velocities**
  Using Canonical formulas with $v_{2i} = 0$:
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_0 = \frac{3.00 - 6.00}{9.00}(4.00) = -\frac{3}{9}(4.00) = -\frac{4.00}{3} = -1.333\,\text{m/s}$$
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_0 = \frac{2(3.00)}{9.00}(4.00) = \frac{6}{9}(4.00) = +\frac{8.00}{3} = +2.667\,\text{m/s}$$

---

### Example 5.9: Gravitational Assist (Slingshot) in 1D
**Problem:** A deep space exploration probe of mass $m = 800\,\text{kg}$ approaches Jupiter ($M_J = 1.90 \times 10^{27}\,\text{kg}$) along its orbital path. In the Sun's frame, Jupiter travels along $-x$ at $V_J = -13.0\,\text{km/s}$. The probe approaches head-on along $+x$ at $v_0 = +10.0\,\text{km/s}$. The probe loops around Jupiter through a close gravitational hyperbolic swing-by and departs along $-x$.
1. Using the Center of Mass frame of Jupiter ($M_J \gg m$), compute the post-flyby speed of the probe in the Sun's reference frame.
2. What is the net speed boost $\Delta v$ gained by the probe? Where did the energy come from?

**Solution:**
- **Step 1: Jupiter reference frame transformation**
  Because $M_J \gg m$, the center of mass of the (Jupiter + probe) system is located inside Jupiter and moves at Jupiter's velocity:
  $$V_{\text{CM}} \approx V_J = -13.0\,\text{km/s}$$
  In Jupiter’s frame, the probe's initial approach speed is:
  $$v'_{\text{init}} = v_0 - V_J = +10.0\,\text{km/s} - (-13.0\,\text{km/s}) = +23.0\,\text{km/s}$$
  In Jupiter's gravitational field, energy is conserved. The probe swings around the planet and departs in the opposite direction (along $-x$) with the **exact same relative speed**:
  $$v'_{\text{final}} = -23.0\,\text{km/s}$$

- **Step 2: Transform back to the Sun’s frame**
  $$v_{\text{final}} = v'_{\text{final}} + V_J = -23.0\,\text{km/s} + (-13.0\,\text{km/s}) = -36.0\,\text{km/s}$$
  Speed magnitude: $\|v_{\text{final}}\| = 36.0\,\text{km/s}$.
  Net speed gain:
  $$\Delta v = 36.0\,\text{km/s} - 10.0\,\text{km/s} = +26.0\,\text{km/s} = 2 |V_J|!$$

- **Step 3: Energy source**
  The probe gained $26.0\,\text{km/s}$ of velocity purely from Jupiter's orbital kinetic energy!
  By momentum conservation, Jupiter lost momentum:
  $$\Delta P_J = -m \Delta v = -(800\,\text{kg})(46,000\,\text{m/s}) = -3.68 \times 10^7\,\text{kg}\cdot\text{m/s}$$
  Jupiter's orbital speed was reduced by:
  $$\Delta V_J = \frac{3.68 \times 10^7}{1.90 \times 10^{27}} \approx 1.9 \times 10^{-20}\,\text{m/s}$$
  A completely negligible slowdown for Jupiter, but a massive $26\,\text{km/s}$ boost for humanity's probe!

---

### Example 5.10: Two-Block Wall Ricochet Oscillation
**Problem:** On a frictionless track bounded by a rigid wall on the left ($x = 0$):
- Block 1 ($m_1 = 1.00\,\text{kg}$) is between the wall and Block 2.
- Block 2 ($m_2 = 100.0\,\text{kg}$) approaches from the right at $v_{2i} = -1.00\,\text{m/s}$.
- Block 1 is initially stationary at rest ($v_{1i} = 0$).
All collisions (between blocks, and between Block 1 and the wall) are perfectly elastic.
1. Compute the velocities of both blocks after the first collision between Block 1 and Block 2.
2. Determine what happens when Block 1 bounces off the wall and strikes Block 2 again.
3. Explain how this system calculates digits of $\pi$ (Galperin’s Billiard Theorem).

**Solution:**
- **Step 1: First collision between blocks**
  $$m_1 = 1.00\,\text{kg}, \quad m_2 = 100.0\,\text{kg}$$
  $$v_{1i} = 0, \quad v_{2i} = -1.00\,\text{m/s}$$
  Using Canonical equations:
  $$v_{1f} = \frac{2 m_2}{m_1 + m_2} v_{2i} = \frac{2(100.0)}{1.00 + 100.0}(-1.00\,\text{m/s}) = \frac{200.0}{101.0}(-1.00) = -1.9802\,\text{m/s}$$
  $$v_{2f} = \frac{m_2 - m_1}{m_1 + m_2} v_{2i} = \frac{100.0 - 1.00}{101.0}(-1.00) = \frac{99.0}{101.0}(-1.00) = -0.9802\,\text{m/s}$$
  Block 1 speeds leftward at $-1.9802\,\text{m/s}$.

- **Step 2: Wall collision and second block impact**
  Block 1 hits the rigid wall ($m_{\text{wall}} \to \infty$) and bounces elastically:
  $$v_{1, \text{after wall}} = -(-1.9802) = +1.9802\,\text{m/s}$$
  Now Block 1 ($+1.9802\,\text{m/s}$) chases and strikes Block 2 (which is still moving left at $-0.9802\,\text{m/s}$):
  $$v_{1f}' = \frac{1 - 100}{101}(+1.9802) + \frac{200}{101}(-0.9802) = -0.9802(1.9802) - 1.9802(0.9802) = -3.882\,\text{m/s}$$
  $$v_{2f}' = \frac{2}{101}(+1.9802) + \frac{99}{101}(-0.9802) = 0.0392 - 0.9608 = -0.9216\,\text{m/s}$$
  Block 2 has slowed from $-1.00\,\text{m/s}$ to $-0.92\,\text{m/s}$.

- **Step 3: Galperin’s Pi Theorem**
  If the mass ratio is $M/m = 100 = 10^2$, the total number of collisions before Block 2 permanently reverses direction and escapes to the right is:
  $$N_{\text{collisions}} = \lfloor \pi \sqrt{M/m} \rfloor = \lfloor \pi \sqrt{100} \rfloor = \lfloor 10\pi \rfloor = \lfloor 31.4159 \rfloor = \mathbf{31}$$
  If $M/m = 10,000 = 10^4$, $N_{\text{collisions}} = \mathbf{314}$.
  If $M/m = 1,000,000 = 10^6$, $N_{\text{collisions}} = \mathbf{3141}$.
  The physical count of collisions computes the decimal digits of $\pi$!

---

## 5.8 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 5.9.

### Tier 1: Canonical 1D Head-On Collisions
- **Exercise 5.1:** A $2.00\,\text{kg}$ ball moving at $5.00\,\text{m/s}$ collides elastically with a stationary $3.00\,\text{kg}$ ball. Compute the final velocities of both balls.
- **Exercise 5.2:** Two equal mass $0.500\,\text{kg}$ gliders on an air track with speeds $+4.00\,\text{m/s}$ and $-2.00\,\text{m/s}$ collide elastically. What are their velocities after separation?

### Tier 2: Moving Targets & Relative Speed Invariance
- **Exercise 5.3:** Mass $m_1 = 4.00\,\text{kg}$ ($v_1 = +8.00\,\text{m/s}$) catches up with mass $m_2 = 1.00\,\text{kg}$ ($v_2 = +3.00\,\text{m/s}$). Find the post-collision velocities and verify relative speed invariance.
- **Exercise 5.4:** A $0.100\,\text{kg}$ rubber ball moving at $12.0\,\text{m/s}$ strikes a stationary $5.00\,\text{kg}$ bowling ball elastically. Compute the rebound speed of the rubber ball.

### Tier 3: Center-of-Mass Transformations
- **Exercise 5.5:** A particle of mass $m_1 = 2.00\,\text{kg}$ moving at $10.0\,\text{m/s}$ collides elastically with $m_2 = 6.00\,\text{kg}$ at rest. Compute $V_{\text{CM}}$, transform to the C-frame, reflect, and find the laboratory final velocities.
- **Exercise 5.6:** Two particles with masses in ratio $m_1/m_2 = 3$ collide elastically. If $m_2$ was initially at rest, what fraction of its initial kinetic energy does $m_1$ retain?

### Tier 4: Energy Partition & Spring Buffers
- **Exercise 5.7:** A neutron ($1.00\,\text{u}$) collides elastically head-on with a stationary carbon nucleus ($^{12}\text{C}$, $12.0\,\text{u}$). What percentage of kinetic energy is transferred to the carbon nucleus?
- **Exercise 5.8:** A $1.50\,\text{kg}$ cart moving at $2.00\,\text{m/s}$ strikes a stationary $3.00\,\text{kg}$ cart equipped with a spring of $k = 600\,\text{N/m}$. Find the maximum spring compression.

### Tier 5: Multi-Body Cascades & Invariant Limits
- **Exercise 5.9:** Three equal masses $A$, $B$, $C$ sit in a line. $A$ moves right at $v_0$; $B$ and $C$ are stationary. If all collisions are elastic, determine the final velocities of all three balls after all collisions cease.
- **Exercise 5.10:** A heavy truck ($M = 12,000\,\text{kg}$) moving at $20.0\,\text{m/s}$ strikes a small stationary car ($m = 1000\,\text{kg}$) elastically. The small car then hits a stationary motorcycle ($m_{\text{moto}} = 200\,\text{kg}$) elastically. Compute the final speed of the motorcycle.

---

## 5.9 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 5.1
- **Given:** $m_1 = 2.00\,\text{kg}$, $v_{1i} = 5.00\,\text{m/s}$, $m_2 = 3.00\,\text{kg}$, $v_{2i} = 0$.
- **Step 1: Canonical formulas**
  $$m_1 + m_2 = 5.00\,\text{kg}$$
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{2.00 - 3.00}{5.00}(5.00) = \frac{-1.00}{5.00}(5.00) = -1.00\,\text{m/s}$$
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_{1i} = \frac{2(2.00)}{5.00}(5.00) = \frac{4.00}{5.00}(5.00) = +4.00\,\text{m/s}$$

---

### Solution 5.2
- **Given:** $m_1 = m_2 = 0.500\,\text{kg}$, $v_{1i} = +4.00\,\text{m/s}$, $v_{2i} = -2.00\,\text{m/s}$.
- **Step 1: Perfect velocity exchange**
  $$v_{1f} = v_{2i} = -2.00\,\text{m/s}$$
  $$v_{2f} = v_{1i} = +4.00\,\text{m/s}$$

---

### Solution 5.3
- **Given:** $m_1 = 4.00\,\text{kg}$, $v_{1i} = +8.00\,\text{m/s}$, $m_2 = 1.00\,\text{kg}$, $v_{2i} = +3.00\,\text{m/s}$.
- **Step 1: Velocity calculation**
  $$m_1 + m_2 = 5.00\,\text{kg}$$
  $$v_{1f} = \frac{4.00 - 1.00}{5.00}(8.00) + \frac{2(1.00)}{5.00}(3.00) = \frac{3.00(8.00) + 6.00}{5.00} = \frac{30.00}{5.00} = +6.00\,\text{m/s}$$
  $$v_{2f} = \frac{2(4.00)}{5.00}(8.00) + \frac{1.00 - 4.00}{5.00}(3.00) = \frac{64.00 - 9.00}{5.00} = \frac{55.00}{5.00} = +11.00\,\text{m/s}$$
- **Step 2: Relative speed check**
  $$v_{\text{rel, init}} = 3.00 - 8.00 = -5.00\,\text{m/s}$$
  $$v_{\text{rel, final}} = 11.00 - 6.00 = +5.00\,\text{m/s} = -v_{\text{rel, init}}$$

---

### Solution 5.4
- **Given:** $m_1 = 0.100\,\text{kg}$, $v_{1i} = 12.0\,\text{m/s}$, $m_2 = 5.00\,\text{kg}$, $v_{2i} = 0$.
- **Step 1: Rebound velocity**
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{0.100 - 5.00}{0.100 + 5.00}(12.0) = \frac{-4.90}{5.10}(12.0) = -11.53\,\text{m/s}$$
  The ball rebounds at $11.53\,\text{m/s}$.

---

### Solution 5.5
- **Given:** $m_1 = 2.00\,\text{kg}$, $v_1 = 10.0\,\text{m/s}$, $m_2 = 6.00\,\text{kg}$, $v_2 = 0$.
- **Step 1: Center of mass velocity**
  $$V_{\text{CM}} = \frac{(2.00)(10.0) + 0}{8.00} = \frac{20.0}{8.00} = 2.50\,\text{m/s}$$
- **Step 2: C-frame transformation & reflection**
  $$u'_{1i} = 10.0 - 2.50 = +7.50\,\text{m/s} \implies u'_{1f} = -7.50\,\text{m/s}$$
  $$u'_{2i} = 0 - 2.50 = -2.50\,\text{m/s} \implies u'_{2f} = +2.50\,\text{m/s}$$
- **Step 3: Laboratory frame velocities**
  $$v_{1f} = -7.50 + 2.50 = -5.00\,\text{m/s}$$
  $$v_{2f} = +2.50 + 2.50 = +5.00\,\text{m/s}$$

---

### Solution 5.6
- **Given:** $m_1 / m_2 = 3.00 \implies m_1 = 3 m_2$, $v_{2i} = 0$.
- **Step 1: Final velocity of $m_1$**
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{3m_2 - m_2}{3m_2 + m_2} v_{1i} = \frac{2m_2}{4m_2} v_{1i} = \frac{1}{2} v_{1i}$$
- **Step 2: Fraction of kinetic energy retained**
  $$\frac{K_{1f}}{K_{1i}} = \left(\frac{v_{1f}}{v_{1i}}\right)^2 = \left(\frac{1}{2}\right)^2 = \frac{1}{4} = 0.250 \implies 25.0\%$$

---

### Solution 5.7
- **Given:** $m_1 = 1.00\,\text{u}$, $m_2 = 12.0\,\text{u}$.
- **Step 1: Fractional energy transfer**
  $$\frac{\Delta K}{K_{\text{init}}} = \frac{4 m_1 m_2}{(m_1 + m_2)^2} = \frac{4(1.00)(12.0)}{(1.00 + 12.0)^2} = \frac{48.0}{13.0^2} = \frac{48.0}{169.0} = 0.2840 \implies 28.40\%$$

---

### Solution 5.8
- **Given:** $m_1 = 1.50\,\text{kg}$, $v_0 = 2.00\,\text{m/s}$, $m_2 = 3.00\,\text{kg}$, $k = 600\,\text{N/m}$.
- **Step 1: Reduced mass & internal kinetic energy**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(1.50)(3.00)}{4.50} = 1.00\,\text{kg}$$
  $$K_{\text{int}} = \frac{1}{2} \mu v_0^2 = \frac{1}{2}(1.00\,\text{kg})(2.00\,\text{m/s})^2 = 2.00\,\text{J}$$
- **Step 2: Maximum spring compression**
  $$\frac{1}{2} k x_{\max}^2 = K_{\text{int}} \implies 300 x_{\max}^2 = 2.00 \implies x_{\max}^2 = \frac{2.00}{300} = \frac{1}{150} \approx 0.006667$$
  $$x_{\max} = \sqrt{0.006667} = 0.08165\,\text{m} = 8.165\,\text{cm}$$

---

### Solution 5.9
- **Given:** Equal masses $m_A = m_B = m_C = m$. $v_A = v_0$, $v_B = 0$, $v_C = 0$.
- **Step 1: Collision 1 ($A$ hits $B$)**
  By the equal mass velocity exchange theorem:
  $$v_A' = 0, \quad v_B' = v_0$$
- **Step 2: Collision 2 ($B$ hits $C$)**
  $B$ (moving at $v_0$) strikes stationary $C$:
  $$v_B'' = 0, \quad v_C'' = v_0$$
- **Step 3: Check for further collisions**
  $A$ is at rest ($v_A = 0$), $B$ is at rest ($v_B = 0$), $C$ moves right at $v_0$.
  No further collisions can occur.
  Final velocities: $v_A = 0$, $v_B = 0$, $v_C = v_0$.

---

### Solution 5.10
- **Given:** $M = 12,000\,\text{kg}$ at $V = 20.0\,\text{m/s}$. $m = 1000\,\text{kg}$ at rest. $m_{\text{moto}} = 200\,\text{kg}$ at rest.
- **Step 1: Collision 1 (Truck hits car)**
  $$v_{\text{car}} = \frac{2 M}{M + m} V = \frac{2(12,000)}{12,000 + 1000}(20.0\,\text{m/s}) = \frac{24,000}{13,000}(20.0) = 36.923\,\text{m/s}$$
- **Step 2: Collision 2 (Car hits motorcycle)**
  $$v_{\text{moto}} = \frac{2 m}{m + m_{\text{moto}}} v_{\text{car}} = \frac{2(1000)}{1000 + 200}(36.923\,\text{m/s}) = \frac{2000}{1200}(36.923) = \frac{5}{3}(36.923) = 61.538\,\text{m/s}$$
  The motorcycle departs at $61.54\,\text{m/s}$ ($221.5\,\text{km/h}$)!


---

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


---

# Chapter 07: Two-Dimensional Oblique Collisions and Planar Scattering

> "In collisions where bodies do not strike head-on along their centers of mass, the motion divides cleanly into two independent universes: along the tangent of contact, nature behaves as if nothing happened; along the common normal, the full drama of impulse, momentum conservation, and restitution unfolds."  
> — Classical Impact Mechanics Principle

---

## 1. Introduction: The Transition from Collinear to Planar Impact

In Chapters 5 and 6, we analyzed collisions restricted strictly to a single spatial dimension—the collinear line of centres. In that idealized world, velocity vectors were either parallel or anti-parallel, reducing vector algebra to scalar arithmetic with signs. However, the physical universe operates in three spatial dimensions, and collisions in nature, sports, astronomy, and microscopic physics are almost never perfectly head-on.

When a cue ball strikes an object ball off-center, when gas molecules scatter off one another inside a pressure vessel, when micrometeoroids glance off the hull of an orbital satellite, or when alpha particles deflect past atomic nuclei, the velocity vectors before and after the collision span a two-dimensional plane. Such interactions are known as **oblique collisions** or **glancing impacts**.

The transition from 1D to 2D collisions introduces geometric richness:
1. **Impact Parameter ($b$):** The perpendicular distance of closest approach if the bodies had continued undeflected.
2. **Contact Geometry:** The instantaneous surface of contact and the **Line of Impact** (the common normal).
3. **Scattering Angles:** The directional deflection of both projectile and target relative to the initial trajectory.
4. **Kinematic Decoupling:** The fundamental separation between normal forces (which compress and restore the bodies) and tangential forces (governed by friction or surface slip).

In this chapter, we develop the universal mathematical framework for solving arbitrary two-dimensional collisions between rigid and deformable bodies. We prove one of the most elegant theorems in classical mechanics—the **$90^\circ$ Scattering Theorem** for identical elastic spheres—and explore the kinematic transformations between the Laboratory Frame and the Center of Mass Frame in two dimensions.

---

## 2. The Anatomy of an Oblique Impact: Normal and Tangential Coordinate Systems

To resolve a two-dimensional collision, we must establish a localized coordinate system aligned with the physics of the contact rather than arbitrary Cartesian laboratory axes $(x, y)$.

```
                      Plane of Contact (Tangential axis t)
                                     |
                                     |
              Sphere 1 (m1)          |          Sphere 2 (m2)
                 ( O1 )-------------(*)-------------( O2 )
                                     |
                                     |
                                     v
                      Line of Impact (Normal axis n)
```

### 2.1 The Line of Impact ($\hat{n}$) and the Plane of Contact ($\hat{t}$)

When two smooth, spherical bodies (or curved surfaces) collide:
- The **Point of Contact** ($C$) is the unique point where the surfaces touch at the instant of maximum compression.
- The **Line of Impact** (unit normal $\hat{n}$) is the line perpendicular to the tangent plane at $C$. For spherical particles of radii $R_1$ and $R_2$ centered at positions $\vec{r}_1$ and $\vec{r}_2$, the normal vector points directly along the line connecting their centers:
$$\hat{n} = \frac{\vec{r}_2 - \vec{r}_1}{\|\vec{r}_2 - \vec{r}_1\|}$$
- The **Plane of Contact** (or Tangential Axis $\hat{t}$) is orthogonal to $\hat{n}$. In two dimensions, $\hat{t}$ is obtained by rotating $\hat{n}$ by $90^\circ$ counterclockwise:
$$\hat{t} = (-n_y, n_x)$$
such that $\hat{n} \cdot \hat{t} = 0$ and $\|\hat{n}\| = \|\hat{t}\| = 1$.

### 2.2 The Decoupling Principle for Smooth (Frictionless) Surfaces

During the brief duration of the collision $\Delta t \to 0$, the normal force $F_n(t)$ reaches enormous magnitudes, delivering a normal impulse:
$$J_n = \int_{t_i}^{t_f} F_n(t)\,dt \gg 0$$

What happens along the tangential direction $\hat{t}$? For smooth surfaces with zero friction ($\mu = 0$):
$$F_t(t) = 0 \implies J_t = \int_{t_i}^{t_f} F_t(t)\,dt = 0$$

Because there is zero tangential force acting on either particle, Newton's Second Law guarantees that the tangential momentum of *each individual body* is strictly conserved independently!

$$\Delta p_{1t} = m_1 (v_{1t, f} - v_{1t, i}) = 0 \implies v_{1t, f} = v_{1t, i}$$
$$\Delta p_{2t} = m_2 (v_{2t, f} - v_{2t, i}) = 0 \implies v_{2t, f} = v_{2t, i}$$

This is the **Tangential Invariance Theorem**: *In any frictionless collision, the tangential velocity component of each colliding body is completely unaltered by the collision.*

### 2.3 The Normal Dynamics and Coefficient of Restitution

Along the normal axis $\hat{n}$, the bodies interact through mutual contact forces governed by Newton's Third Law ($F_{21, n} = -F_{12, n}$). Consequently:
1. **Total Normal Momentum is Conserved:**
   $$m_1 v_{1n, i} + m_2 v_{2n, i} = m_1 v_{1n, f} + m_2 v_{2n, f}$$

2. **Normal Velocity Separation Follows Newton's Restitution Law:**
   $$v_{2n, f} - v_{1n, f} = -e (v_{2n, i} - v_{1n, i})$$
   where $e \in [0, 1]$ is the coefficient of restitution along the normal axis.

Notice the profound simplification: along $\hat{n}$, the problem is mathematically identical to a **one-dimensional collision**! We have already solved this system in Chapter 6:

$$v_{1n, f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1n, i} + \frac{(1 + e) m_2}{m_1 + m_2} v_{2n, i}$$
$$v_{2n, f} = \frac{(1 + e) m_1}{m_1 + m_2} v_{1n, i} + \frac{m_2 - e m_1}{m_1 + m_2} v_{2n, i}$$

### 2.4 The Master Recipe for Solving Any 2D Collision

Given initial velocities $\vec{v}_{1i}, \vec{v}_{2i}$, masses $m_1, m_2$, restitution $e$, and the normal orientation unit vector $\hat{n}$:
1. **Compute Tangential Unit Vector:** $\hat{t} = (-n_y, n_x)$.
2. **Decompose Velocities into Normal and Tangential Components:**
   $$v_{1n, i} = \vec{v}_{1i} \cdot \hat{n}, \quad v_{1t, i} = \vec{v}_{1i} \cdot \hat{t}$$
   $$v_{2n, i} = \vec{v}_{2i} \cdot \hat{n}, \quad v_{2t, i} = \vec{v}_{2i} \cdot \hat{t}$$
3. **Apply Decoupled Solutions:**
   - Tangential components: $v_{1t, f} = v_{1t, i}$ and $v_{2t, f} = v_{2t, i}$.
   - Normal components: Solve 1D equations for $v_{1n, f}$ and $v_{2n, f}$.
4. **Reconstruct Vector Velocities in Laboratory Coordinates:**
   $$\vec{v}_{1f} = v_{1n, f}\hat{n} + v_{1t, f}\hat{t}$$
   $$\vec{v}_{2f} = v_{2n, f}\hat{n} + v_{2t, f}\hat{t}$$

This modular algorithm forms the computational foundation of every rigid-body physics engine.

---

## 3. Geometry of Sphere-Sphere Collisions and the Impact Parameter

Consider two spherical particles of radii $R_1$ and $R_2$. Let particle 2 be initially stationary at the origin $(0, 0)$, while particle 1 travels in the $+x$ direction with speed $v_0$ along a trajectory with horizontal centerline offset by a vertical distance $b$.

```
                         y
                         ^
                         |           Line of Impact n
        m1               |             ^
     (  v0  ) ---------->+             /  alpha
    ---------------------+------------*--------> x
                         |        C  /
                       b |          /
                         |       ( m2 )
                         v      Origin
```

### 3.1 The Impact Parameter ($b$)

The parameter $b$ is called the **impact parameter**.
- If $b = 0$, the collision is purely **head-on** ($\hat{n} = \hat{i}$, $\hat{t} = \hat{j}$).
- If $|b| > R_1 + R_2$, the spheres do not touch; no collision occurs.
- If $0 < |b| < R_1 + R_2$, an **oblique collision** occurs.

### 3.2 Determining the Collision Angle ($\alpha$)

At the exact instant of first contact, the distance between the two spherical centers is exactly:
$$d = R_1 + R_2$$

From the right triangle formed by the center of sphere 2, the horizontal flight line of sphere 1, and the contact normal:
$$\sin\alpha = \frac{b}{R_1 + R_2}$$
$$\cos\alpha = \sqrt{1 - \left(\frac{b}{R_1 + R_2}\right)^2}$$

The normal unit vector pointing from sphere 1 to sphere 2 is:
$$\hat{n} = \cos\alpha\,\hat{i} - \sin\alpha\,\hat{j}$$

The tangential unit vector is:
$$\hat{t} = \sin\alpha\,\hat{i} + \cos\alpha\,\hat{j}$$

Thus, simply knowing the geometric impact parameter $b$ and radii $R_1, R_2$ completely specifies the normal-tangential transformation matrix!

---

## 4. The Famous $90^\circ$ Scattering Theorem

One of the most celebrated and ubiquitous phenomena in classical mechanics is the scattering behavior of identical billiard balls.

### 4.1 Theorem Statement

> **The $90^\circ$ Scattering Theorem:**  
> When a moving particle of mass $m$ undergoes a perfectly elastic ($e = 1$) oblique collision with an identical stationary particle of mass $m$ ($m_1 = m_2 = m$, $\vec{v}_{2i} = \vec{0}$), their post-collision trajectories are strictly perpendicular ($\vec{v}_{1f} \perp \vec{v}_{2f}$), meaning the angle between their final velocity vectors is exactly:
> $$\theta_1 + \theta_2 = 90^\circ = \frac{\pi}{2}\text{ rad}$$
> (provided $v_{1f} \ne 0$).

### 4.2 Vector Proof (Coordinate-Free Derivation)

The beauty of this theorem lies in its pure vector derivation, requiring zero coordinate decomposition.

1. **Conservation of Linear Momentum:**
   Because the system is isolated, total momentum before equals total momentum after:
   $$m\vec{v}_{1i} + m\vec{v}_{2i} = m\vec{v}_{1f} + m\vec{v}_{2f}$$
   Since $\vec{v}_{2i} = \vec{0}$ and $m_1 = m_2 = m$, we cancel $m$:
   $$\vec{v}_{1i} = \vec{v}_{1f} + \vec{v}_{2f}$$

2. **Square Both Sides (Vector Dot Product):**
   $$\|\vec{v}_{1i}\|^2 = (\vec{v}_{1f} + \vec{v}_{2f}) \cdot (\vec{v}_{1f} + \vec{v}_{2f})$$
   $$v_{1i}^2 = v_{1f}^2 + v_{2f}^2 + 2 (\vec{v}_{1f} \cdot \vec{v}_{2f}) \quad \text{--- (Equation A)}$$

3. **Conservation of Kinetic Energy ($e = 1$):**
   Because the collision is perfectly elastic, kinetic energy is strictly conserved:
   $$\frac{1}{2}m v_{1i}^2 = \frac{1}{2}m v_{1f}^2 + \frac{1}{2}m v_{2f}^2$$
   Canceling $\frac{1}{2}m$:
   $$v_{1i}^2 = v_{1f}^2 + v_{2f}^2 \quad \text{--- (Equation B)}$$

4. **Subtract Equation B from Equation A:**
   $$0 = 2 (\vec{v}_{1f} \cdot \vec{v}_{2f})$$
   $$\vec{v}_{1f} \cdot \vec{v}_{2f} = 0$$

5. **Geometric Conclusion:**
   Since the dot product of the non-zero final velocity vectors is identically zero:
   $$v_{1f} v_{2f} \cos(\theta_{\text{total}}) = 0 \implies \cos(\theta_{\text{total}}) = 0 \implies \theta_{\text{total}} = 90^\circ$$

$$\blacksquare$$

### 4.3 Why Does This Breakdown in Real Billiards?

Every skilled pool player knows that real billiard balls do not always separate at exactly $90^\circ$. Why?
1. **Inelasticity ($e < 1$):** If kinetic energy is lost, $v_{1i}^2 > v_{1f}^2 + v_{2f}^2$. Substituting into Equation A yields $\vec{v}_{1f} \cdot \vec{v}_{2f} > 0$, meaning the scattering angle is **strictly acute** ($\theta_{\text{total}} < 90^\circ$).
2. **Rotational Spin (English) and Friction:** Real billiard balls have rotational inertia ($I = \frac{2}{5} m R^2$). Friction between the balls (tangential impulse $J_t \ne 0$) and friction with the felt table introduces spin-induced curve (squirt and swerve).
3. **Mass Inequality ($m_1 \ne m_2$):**
   - If $m_1 > m_2$ (heavier projectile): $\theta_{\text{total}} < 90^\circ$ (forward-focused scattering).
   - If $m_1 < m_2$ (lighter projectile): $\theta_{\text{total}} > 90^\circ$ (the projectile can bounce backwards into the obtuse hemisphere).

---

## 5. Oblique Collisions with a Rigid, Immovable Boundary

When a ball strikes a flat, rigid surface (such as a floor, wall, or cushion), the boundary can be modeled as a body of infinite mass ($m_2 \to \infty$) anchored to the earth ($v_{2i} = 0, v_{2f} = 0$).

```
                      Normal axis n
                            ^
                            |
           Incident \       |       / Reflected
            vector   \      |      /   vector
              v_i     \     |     /    v_f
                       \ theta_i / theta_r
             -----------+---+---+------------ Wall (Tangential axis t)
```

Let the wall lie along the tangential axis $\hat{t}$, with the normal $\hat{n}$ pointing outward into the open domain.
- Let the incident velocity make an angle $\theta_i$ with the surface normal $\hat{n}$.
  $$v_{n, i} = -v_i \cos\theta_i, \quad v_{t, i} = v_i \sin\theta_i$$

### 5.1 Frictionless Rebound Dynamics

Along the frictionless wall:
- Tangential component is unchanged:
  $$v_{t, f} = v_{t, i} = v_i \sin\theta_i$$
- Normal component rebounds with coefficient of restitution $e$:
  $$v_{n, f} = -e v_{n, i} = +e v_i \cos\theta_i$$

### 5.2 Angle of Reflection and Speed Loss

The final speed $v_f$ is:
$$v_f = \sqrt{v_{t, f}^2 + v_{n, f}^2} = v_i \sqrt{\sin^2\theta_i + e^2 \cos^2\theta_i}$$

The reflection angle $\theta_r$ with the normal is:
$$\tan\theta_r = \frac{v_{t, f}}{v_{n, f}} = \frac{v_i \sin\theta_i}{e v_i \cos\theta_i} = \frac{1}{e} \tan\theta_i$$

Notice the profound implications:
- **If $e = 1$ (Elastic Reflection):**
  $$\tan\theta_r = \tan\theta_i \implies \theta_r = \theta_i, \quad v_f = v_i$$
  The angle of incidence equals the angle of reflection (Snell's optical law for specular reflection).
- **If $e < 1$ (Inelastic Reflection):**
  $$\frac{1}{e} > 1 \implies \tan\theta_r > \tan\theta_i \implies \theta_r > \theta_i$$
  Because the normal velocity is attenuated while the tangential velocity is preserved, the post-collision trajectory is **refracted toward the surface of the wall**!
- **If $e = 0$ (Completely Inelastic Normal Collision):**
  $$\theta_r = 90^\circ$$
  The object completely loses all normal motion and slides flat along the wall at speed $v_{t, i}$.

---

## 6. Two-Dimensional Collisions in the Center-of-Mass Frame

Analyzing 2D collisions in the Laboratory frame can involve tedious trigonometric bookkeeping. In contrast, transforming into the **Center of Mass (C-Frame)** reveals stunning symmetry.

### 6.1 The C-Frame Transformation in 2D

The center of mass velocity is:
$$\vec{V}_{\text{CM}} = \frac{m_1 \vec{v}_{1i} + m_2 \vec{v}_{2i}}{m_1 + m_2}$$

Velocities in the C-frame (denoted with primes) are:
$$\vec{u}'_{1i} = \vec{v}_{1i} - \vec{V}_{\text{CM}}, \quad \vec{u}'_{2i} = \vec{v}_{2i} - \vec{V}_{\text{CM}}$$

By definition of the zero-momentum frame:
$$m_1 \vec{u}'_{1i} + m_2 \vec{u}'_{2i} = \vec{0} \implies \vec{u}'_{2i} = -\frac{m_1}{m_2}\vec{u}'_{1i}$$

In the C-frame, the two particles always approach each other along **exact opposite directions** on a single straight line, regardless of their laboratory approach angles!

### 6.2 Elastic Scattering in the C-Frame

For an elastic collision ($e = 1$):
1. The speeds of both particles are preserved in the C-frame:
   $$\|\vec{u}'_{1f}\| = \|\vec{u}'_{1i}\|, \quad \|\vec{u}'_{2f}\| = \|\vec{u}'_{2i}\|$$
2. The particles merely rotate their mutual axis of motion by an angle $\theta^*$ (the C-frame scattering angle):
   $$\vec{u}'_{1f} = \|\vec{u}'_{1i}\| (\cos\theta^* \hat{u}'_{\parallel} + \sin\theta^* \hat{u}'_{\perp})$$
   $$\vec{u}'_{2f} = -\|\vec{u}'_{2i}\| (\cos\theta^* \hat{u}'_{\parallel} + \sin\theta^* \hat{u}'_{\perp})$$

To find laboratory velocities, we simply add back the constant center-of-mass velocity:
$$\vec{v}_{1f} = \vec{u}'_{1f} + \vec{V}_{\text{CM}}, \quad \vec{v}_{2f} = \vec{u}'_{2f} + \vec{V}_{\text{CM}}$$

### 6.3 Maximum Deflection Angle for Heavy Projectiles

When a projectile of mass $m_1$ strikes a stationary lighter target $m_2$ ($m_1 > m_2$), the center of mass moves faster than the C-frame recoil speed of the projectile. 

As a result, in the Laboratory frame, particle 1 cannot be scattered backward! There exists a strict **maximum scattering angle** $\theta_{1, \max}$:

$$\sin(\theta_{1, \max}) = \frac{m_2}{m_1}$$

- For $m_1 = 2 m_2$, $\sin\theta_{1, \max} = 0.5 \implies \theta_{1, \max} = 30^\circ$.
- No matter how glancing the impact, the heavy projectile can never deviate by more than $30^\circ$ from its original path!

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 7.1: Frictionless Oblique Wall Impact with Known Restitution
*A hockey puck slides on frictionless ice at $v_i = 25.0\text{ m/s}$ toward a rigid rink cushion, striking it at an angle of incidence $\theta_i = 30.0^\circ$ measured relative to the normal of the cushion. The coefficient of restitution between the puck and cushion is $e = 0.600$. Determine: (a) the normal and tangential post-impact velocity components, (b) the rebound speed $v_f$, and (c) the angle of reflection $\theta_r$.*

#### Solution
1. **Given:**
   - $v_i = 25.0\text{ m/s}$
   - $\theta_i = 30.0^\circ$ (relative to normal $\hat{n}$)
   - $e = 0.600$
2. **Decompose Initial Velocity:**
   - $v_{n, i} = -v_i \cos(30.0^\circ) = -25.0 \times 0.866025 = -21.6506\text{ m/s}$
   - $v_{t, i} = v_i \sin(30.0^\circ) = 25.0 \times 0.500000 = 12.5000\text{ m/s}$
3. **Part (a): Compute Post-Impact Components:**
   - Frictionless cushion $\implies v_{t, f} = v_{t, i} = +12.5\text{ m/s}$.
   - Restitution along normal $\implies v_{n, f} = -e v_{n, i} = -(0.600) \times (-21.6506\text{ m/s}) = +12.9904\text{ m/s}$.
4. **Part (b): Rebound Speed $v_f$:**
   $$v_f = \sqrt{v_{n, f}^2 + v_{t, f}^2} = \sqrt{(12.9904)^2 + (12.5000)^2} = \sqrt{168.75 + 156.25} = \sqrt{325.0} = 18.0278\text{ m/s}$$
   $$\mathbf{v_f \approx 18.0\text{ m/s}}$$
5. **Part (c): Reflection Angle $\theta_r$:**
   $$\tan\theta_r = \frac{v_{t, f}}{v_{n, f}} = \frac{12.5000}{12.9904} \approx 0.96225$$
   $$\theta_r = \arctan(0.96225) \approx 43.898^\circ \approx \mathbf{43.9^\circ}$$
6. **Sanity Check:**
   Since $e < 1$, $\theta_r > \theta_i$ ($43.9^\circ > 30.0^\circ$). The trajectory refracted towards the surface as predicted by theory.

---

### Worked Example 7.2: Elastic Collision Between Identical Spheres ($90^\circ$ Verification)
*Billiard ball A ($m_A = 0.170\text{ kg}$) moves at $\vec{v}_A = 4.00\,\hat{i}\text{ m/s}$ and strikes identical stationary ball B ($m_B = 0.170\text{ kg}$) off-center. After the collision, ball B moves at an angle of $-30.0^\circ$ relative to the $+x$ axis. Assuming a perfectly elastic collision ($e = 1.000$): (a) find the post-collision speed of ball B, (b) find the post-collision velocity vector of ball A, and (c) verify that $\vec{v}_A \cdot \vec{v}_B = 0$.*

#### Solution
1. **Given:**
   - $m_A = m_B = 0.170\text{ kg}$
   - $\vec{v}_{Ai} = (4.00, 0)\text{ m/s}$
   - $\vec{v}_{Bi} = (0, 0)\text{ m/s}$
   - Ball B's direction: $\theta_B = -30.0^\circ$
   - $e = 1.000$
2. **Apply the $90^\circ$ Scattering Theorem:**
   - Since $m_A = m_B$, $v_{Bi} = 0$, and $e = 1.00$, the angle between $\vec{v}_{Af}$ and $\vec{v}_{Bf}$ is exactly $90.0^\circ$.
   - Therefore, ball A must deflect at $\theta_A = 90.0^\circ - 30.0^\circ = +60.0^\circ$ relative to the $+x$ axis!
3. **Set Up Velocity Vector Projections:**
   - In the right-triangle formed by the velocity vectors:
     $$v_{Bf} = v_{Ai} \cos(30.0^\circ) = 4.00 \times \frac{\sqrt{3}}{2} \approx 3.4641\text{ m/s}$$
     $$v_{Af} = v_{Ai} \sin(30.0^\circ) = 4.00 \times 0.500 = 2.0000\text{ m/s}$$
4. **Vector Components:**
   - Ball B ($\theta_B = -30.0^\circ$):
     $$\vec{v}_{Bf} = (3.4641 \cos(-30^\circ))\hat{i} + (3.4641 \sin(-30^\circ))\hat{j} = (3.4641 \times 0.8660)\hat{i} - (3.4641 \times 0.500)\hat{j} = (3.00\,\hat{i} - 1.732\,\hat{j})\text{ m/s}$$
   - Ball A ($\theta_A = +60.0^\circ$):
     $$\vec{v}_{Af} = (2.00 \cos(60^\circ))\hat{i} + (2.00 \sin(60^\circ))\hat{j} = (2.00 \times 0.500)\hat{i} + (2.00 \times 0.8660)\hat{j} = (1.00\,\hat{i} + 1.732\,\hat{j})\text{ m/s}$$
5. **Momentum Verification:**
   - Total initial: $\vec{P}_i = 0.170 \times (4.00\,\hat{i}) = 0.680\,\hat{i}\text{ kg}\cdot\text{m/s}$.
   - Total final: $m(\vec{v}_{Af} + \vec{v}_{Bf}) = 0.170 \times [(1.00 + 3.00)\hat{i} + (1.732 - 1.732)\hat{j}] = 0.170 \times 4.00\,\hat{i} = 0.680\,\hat{i}\text{ kg}\cdot\text{m/s}$. (Exact match).
6. **Dot Product Verification:**
   $$\vec{v}_{Af} \cdot \vec{v}_{Bf} = (1.00)(3.00) + (1.732)(-1.732) = 3.00 - 3.00 = 0$$
   $$\mathbf{\vec{v}_{Af} \cdot \vec{v}_{Bf} = 0 \quad (\text{Orthogonal})}$$

---

### Worked Example 7.3: Inelastic Two-Sphere Collision via Normal-Tangential Decomposition
*Sphere 1 ($m_1 = 2.00\text{ kg}$) moving at $\vec{v}_1 = (10.0\,\hat{i})\text{ m/s}$ collides with sphere 2 ($m_2 = 3.00\text{ kg}$) which is initially at rest. At the moment of contact, the unit normal pointing from sphere 1 to sphere 2 is $\hat{n} = 0.800\,\hat{i} + 0.600\,\hat{j}$. The coefficient of restitution is $e = 0.500$. Find the final velocity vectors of both spheres.*

#### Solution
1. **Define Unit Vectors:**
   - Normal: $\hat{n} = (0.800, 0.600)$
   - Tangent (counterclockwise): $\hat{t} = (-0.600, 0.800)$
   - Verify dot product: $\hat{n} \cdot \hat{t} = (0.8)(-0.6) + (0.6)(0.8) = 0$.
2. **Decompose Initial Velocities:**
   - Sphere 1: $\vec{v}_{1i} = (10.0, 0)\text{ m/s}$
     $$v_{1n, i} = \vec{v}_{1i} \cdot \hat{n} = 10.0 \times 0.800 = +8.00\text{ m/s}$$
     $$v_{1t, i} = \vec{v}_{1i} \cdot \hat{t} = 10.0 \times (-0.600) = -6.00\text{ m/s}$$
   - Sphere 2: $\vec{v}_{2i} = (0, 0)\text{ m/s}$
     $$v_{2n, i} = 0, \quad v_{2t, i} = 0$$
3. **Tangential Invariance:**
   $$v_{1t, f} = v_{1t, i} = -6.00\text{ m/s}$$
   $$v_{2t, f} = v_{2t, i} = 0\text{ m/s}$$
4. **Normal 1D Collision with $e = 0.500$:**
   - Mass sum: $m_1 + m_2 = 2.00 + 3.00 = 5.00\text{ kg}$.
   $$v_{1n, f} = \frac{m_1 - e m_2}{m_1 + m_2} v_{1n, i} + \frac{(1+e) m_2}{m_1 + m_2} v_{2n, i} = \frac{2.00 - (0.500)(3.00)}{5.00} (8.00) + 0$$
   $$v_{1n, f} = \frac{2.00 - 1.50}{5.00} (8.00) = \frac{0.50}{5.00} \times 8.00 = +0.800\text{ m/s}$$
   $$v_{2n, f} = \frac{(1+e) m_1}{m_1 + m_2} v_{1n, i} + \frac{m_2 - e m_1}{m_1 + m_2} v_{2n, i} = \frac{(1.500)(2.00)}{5.00} (8.00) + 0 = \frac{3.00}{5.00} \times 8.00 = +4.80\text{ m/s}$$
5. **Reconstruct Cartesian Velocity Vectors:**
   - Sphere 1:
     $$\vec{v}_{1f} = v_{1n, f} \hat{n} + v_{1t, f} \hat{t} = 0.800 (0.800\,\hat{i} + 0.600\,\hat{j}) - 6.00 (-0.600\,\hat{i} + 0.800\,\hat{j})$$
     $$v_{1fx} = (0.800 \times 0.800) - (6.00 \times -0.600) = 0.640 + 3.600 = +4.24\text{ m/s}$$
     $$v_{1fy} = (0.800 \times 0.600) - (6.00 \times 0.800) = 0.480 - 4.800 = -4.32\text{ m/s}$$
     $$\mathbf{\vec{v}_{1f} = (4.24\,\hat{i} - 4.32\,\hat{j})\text{ m/s}}$$
   - Sphere 2:
     $$\vec{v}_{2f} = v_{2n, f} \hat{n} + v_{2t, f} \hat{t} = 4.80 (0.800\,\hat{i} + 0.600\,\hat{j}) + 0$$
     $$\mathbf{\vec{v}_{2f} = (3.84\,\hat{i} + 2.88\,\hat{j})\text{ m/s}}$$
6. **Total Momentum Verification:**
   - $\vec{P}_{fx} = m_1 v_{1fx} + m_2 v_{2fx} = 2.00(4.24) + 3.00(3.84) = 8.48 + 11.52 = 20.0\text{ kg}\cdot\text{m/s}$.
   - $\vec{P}_{fy} = m_1 v_{1fy} + m_2 v_{2fy} = 2.00(-4.32) + 3.00(2.88) = -8.64 + 8.64 = 0.00\text{ kg}\cdot\text{m/s}$.
   - $\vec{P}_i = (20.0\,\hat{i})\text{ kg}\cdot\text{m/s}$. Momentum is conserved to machine precision!

---

### Worked Example 7.4: Impact Parameter and Scattering Angles in Hard-Sphere Collisions
*Two identical smooth billiard spheres of radius $R = 3.00\text{ cm}$ and mass $m = 0.160\text{ kg}$ collide. Sphere 2 is at rest. Sphere 1 approaches with speed $v_0 = 5.00\text{ m/s}$ at an impact parameter $b = 3.60\text{ cm}$. Assuming $e = 1.000$, calculate: (a) the collision normal angle $\alpha$, (b) the scattering angle of sphere 1, and (c) the post-collision speed of both spheres.*

#### Solution
1. **Given:**
   - $R_1 = R_2 = R = 0.0300\text{ m} \implies R_1 + R_2 = 0.0600\text{ m}$
   - $b = 0.0360\text{ m}$
   - $v_0 = 5.00\text{ m/s}$
   - $e = 1.000$
2. **Part (a): Find Collision Normal Angle $\alpha$:**
   $$\sin\alpha = \frac{b}{R_1 + R_2} = \frac{0.0360}{0.0600} = 0.6000$$
   $$\alpha = \arcsin(0.6000) \approx 36.870^\circ$$
   $$\cos\alpha = \sqrt{1 - (0.600)^2} = 0.8000$$
3. **Decompose Motion Along Normal and Tangent:**
   - Sphere 2 is pushed purely along the normal $\hat{n}$ because it starts from rest and receives zero tangential impulse:
     $$\mathbf{\theta_2 = -\alpha = -36.87^\circ}$$
   - From the $90^\circ$ theorem, sphere 1 must scatter at:
     $$\mathbf{\theta_1 = 90.00^\circ - 36.87^\circ = +53.13^\circ}$$
4. **Part (c): Speeds:**
   - The normal velocity component of sphere 1 before impact is:
     $$v_{1n, i} = v_0 \cos\alpha = 5.00 \times 0.800 = 4.00\text{ m/s}$$
   - In an identical-mass elastic collision along the normal, velocities exchange completely:
     $$v_{2n, f} = v_{1n, i} = 4.00\text{ m/s}, \quad v_{1n, f} = 0\text{ m/s}$$
   - The tangential component of sphere 1 is:
     $$v_{1t, f} = v_{1t, i} = v_0 \sin\alpha = 5.00 \times 0.600 = 3.00\text{ m/s}$$
   - Final speeds:
     $$\mathbf{v_{2f} = v_{2n, f} = 4.00\text{ m/s}}$$
     $$\mathbf{v_{1f} = \sqrt{v_{1n, f}^2 + v_{1t, f}^2} = \sqrt{0^2 + 3.00^2} = 3.00\text{ m/s}}$$
5. **Kinetic Energy Check:**
   - $K_i = \frac{1}{2}(0.160)(5.00)^2 = 2.00\text{ J}$.
   - $K_f = \frac{1}{2}(0.160)[(3.00)^2 + (4.00)^2] = \frac{1}{2}(0.160)[9 + 16] = \frac{1}{2}(0.160)(25) = 2.00\text{ J}$. Perfectly conserved!

---

### Worked Example 7.5: Corner Bounce (Double Oblique Reflection)
*A steel ball bearing with $e = 0.800$ enters a square corner formed by two perpendicular rigid walls (Wall 1 along the $x$-axis, Wall 2 along the $y$-axis). The ball approaches Wall 1 with velocity $\vec{v}_i = (6.00\,\hat{i} - 8.00\,\hat{j})\text{ m/s}$, strikes Wall 1 first, and then immediately strikes Wall 2. Determine: (a) the velocity vector after the first bounce, (b) the velocity vector after the second bounce, and (c) the total kinetic energy retained by the ball after both bounces.*

#### Solution
1. **Given:**
   - $\vec{v}_i = (6.00\,\hat{i} - 8.00\,\hat{j})\text{ m/s}$
   - $e = 0.800$
2. **First Bounce on Wall 1 ($x$-axis, normal $\hat{n}_1 = +\hat{j}$):**
   - Tangential axis is along $\hat{i} \implies v_{x1} = v_{xi} = +6.00\text{ m/s}$.
   - Normal axis is along $\hat{j} \implies v_{y1} = -e v_{yi} = -(0.800)(-8.00) = +6.40\text{ m/s}$.
   - Post-first bounce velocity:
     $$\mathbf{\vec{v}_1 = (6.00\,\hat{i} + 6.40\,\hat{j})\text{ m/s}}$$
3. **Second Bounce on Wall 2 ($y$-axis, normal $\hat{n}_2 = -\hat{i}$):**
   - The ball travels toward the right and hits Wall 2.
   - Normal axis is along $\hat{i} \implies v_{x2} = -e v_{x1} = -(0.800)(6.00) = -4.80\text{ m/s}$.
   - Tangential axis is along $\hat{j} \implies v_{y2} = v_{y1} = +6.40\text{ m/s}$.
   - Post-second bounce velocity:
     $$\mathbf{\vec{v}_2 = (-4.80\,\hat{i} + 6.40\,\hat{j})\text{ m/s}}$$
4. **Kinetic Energy Fraction:**
   - $v_i^2 = 6.00^2 + (-8.00)^2 = 36.0 + 64.0 = 100.0\text{ m}^2/\text{s}^2$.
   - $v_2^2 = (-4.80)^2 + 6.40^2 = 23.04 + 40.96 = 64.00\text{ m}^2/\text{s}^2$.
   - Energy fraction retained:
     $$\frac{K_2}{K_i} = \frac{v_2^2}{v_i^2} = \frac{64.00}{100.00} = 0.640 = \mathbf{64.0\%}$$
5. **Insight:**
   Notice that $0.640 = e^2 = (0.800)^2$. Because each orthogonal velocity component ($v_x$ and $v_y$) underwent exactly one reflection with restitution $e$, both components were attenuated by a factor of $e$, so the overall speed scaled exactly by $e$!

---

### Worked Example 7.6: Heavy Projectile Maximum Deflection Angle
*A heavy ion of mass $m_1 = 4.00\text{ u}$ (alpha particle) moving at $v_0 = 1.20 \times 10^6\text{ m/s}$ undergoes an elastic collision ($e = 1.000$) with a stationary proton $m_2 = 1.00\text{ u}$. (a) Calculate the theoretical maximum deflection angle $\theta_{1, \max}$ of the alpha particle in the laboratory frame. (b) If the alpha particle scatters at its maximum deflection angle, find its final speed.*

#### Solution
1. **Given:**
   - $m_1 = 4.00\text{ u}$
   - $m_2 = 1.00\text{ u}$
   - $v_0 = 1.20 \times 10^6\text{ m/s}$
   - $e = 1.000$
2. **Part (a): Compute Maximum Deflection Angle:**
   $$\sin(\theta_{1, \max}) = \frac{m_2}{m_1} = \frac{1.00}{4.00} = 0.2500$$
   $$\theta_{1, \max} = \arcsin(0.2500) \approx 14.4775^\circ \approx \mathbf{14.5^\circ}$$
3. **Part (b): Velocity at Maximum Deflection:**
   - In the velocity triangle between $\vec{V}_{\text{CM}}$, $\vec{u}'_{1f}$, and $\vec{v}_{1f}$, maximum deflection occurs when $\vec{v}_{1f}$ is tangent to the circle of radius $u'_{1f}$.
   - This means $\vec{v}_{1f}$ is perpendicular to $\vec{u}'_{1f}$!
   - Center of mass velocity:
     $$V_{\text{CM}} = \frac{m_1}{m_1 + m_2} v_0 = \frac{4.00}{5.00} v_0 = 0.800 v_0$$
   - C-frame speed of particle 1:
     $$u'_{1} = v_0 - V_{\text{CM}} = 0.200 v_0$$
   - From the right triangle:
     $$v_{1f} = \sqrt{V_{\text{CM}}^2 - (u'_{1})^2} = v_0 \sqrt{0.800^2 - 0.200^2} = v_0 \sqrt{0.640 - 0.040} = v_0 \sqrt{0.600}$$
     $$v_{1f} = 1.20 \times 10^6 \times \sqrt{0.600} \approx 1.20 \times 10^6 \times 0.774597 \approx \mathbf{9.30 \times 10^5\text{ m/s}}$$

---

### Worked Example 7.7: Oblique Traffic Accident Reconstruction
*At an intersection, Car A ($m_A = 1200\text{ kg}$) traveling due East at unknown speed $v_A$ collides with Car B ($m_B = 1600\text{ kg}$) traveling due North at $v_B = 15.0\text{ m/s}$. The cars lock together upon impact ($e = 0$) and skid as a single entangled mass. The police accident investigator measures the skid mark direction to be $\theta = 35.0^\circ$ North of East. (a) Determine the initial speed of Car A. (b) Calculate the total kinetic energy dissipated in the crash.*

#### Solution
1. **Given:**
   - $m_A = 1200\text{ kg}$, $\vec{v}_A = v_A \hat{i}$
   - $m_B = 1600\text{ kg}$, $\vec{v}_B = 15.0\,\hat{j}\text{ m/s}$
   - Collision is completely inelastic ($e = 0$) $\implies$ joint velocity $\vec{V}_f = V_f \cos(35^\circ)\hat{i} + V_f \sin(35^\circ)\hat{j}$
2. **Conservation of Linear Momentum:**
   - $x$-axis: $m_A v_A = (m_A + m_B) V_f \cos(35.0^\circ)$
   - $y$-axis: $m_B v_B = (m_A + m_B) V_f \sin(35.0^\circ)$
3. **Divide $y$-equation by $x$-equation:**
   $$\frac{m_B v_B}{m_A v_A} = \frac{\sin(35.0^\circ)}{\cos(35.0^\circ)} = \tan(35.0^\circ)$$
   $$v_A = \frac{m_B v_B}{m_A \tan(35.0^\circ)} = \frac{1600 \times 15.0}{1200 \times \tan(35.0^\circ)} = \frac{24000}{1200 \times 0.700208} = \frac{20.0}{0.700208} \approx \mathbf{28.56\text{ m/s}}$$
   (Equivalent to $\approx 102.8\text{ km/h}$).
4. **Find Final Velocity $V_f$:**
   $$V_f = \frac{m_B v_B}{(m_A + m_B) \sin(35.0^\circ)} = \frac{1600 \times 15.0}{2800 \times 0.573576} = \frac{24000}{1606.01} \approx 14.944\text{ m/s}$$
5. **Part (b): Kinetic Energy Dissipation:**
   - Initial KE:
     $$K_i = \frac{1}{2} m_A v_A^2 + \frac{1}{2} m_B v_B^2 = \frac{1}{2}(1200)(28.563)^2 + \frac{1}{2}(1600)(15.0)^2 = 489,500 + 180,000 = 669,500\text{ J}$$
   - Final KE:
     $$K_f = \frac{1}{2} (m_A + m_B) V_f^2 = \frac{1}{2}(2800)(14.944)^2 = 1400 \times 223.32 = 312,650\text{ J}$$
   - Energy Dissipated:
     $$\Delta K_{\text{loss}} = 669,500 - 312,650 = \mathbf{356,850\text{ J} \approx 3.57 \times 10^5\text{ J}}$$

---

### Worked Example 7.8: Spacecraft 2D Gravitational Slingshot (Planetary Flyby)
*A robotic probe of mass $m = 850\text{ kg}$ approaches Jupiter ($M = 1.90 \times 10^{27}\text{ kg}$) along the $-x$ direction with speed $v_{\infty} = 12.0\text{ km/s}$ relative to the Sun. Jupiter orbits the Sun along the $+y$ direction with orbital speed $V_J = 13.0\text{ km/s}$. The trajectory is designed such that in Jupiter's rest frame, the spacecraft is deflected elastically by $\theta^* = 90.0^\circ$ into the direction of Jupiter's orbital motion ($+y$). Find: (a) the spacecraft's speed in Jupiter's frame, and (b) the spacecraft's final heliocentric speed after exiting Jupiter's sphere of influence.*

#### Solution
1. **Given:**
   - Sun frame: $\vec{v}_i = (-12.0\,\hat{i})\text{ km/s}$, $\vec{V}_J = (+13.0\,\hat{j})\text{ km/s}$
   - In Jupiter's frame, gravitational interaction is conservative $\implies$ elastic scattering ($e = 1.00$).
2. **Transform to Jupiter's Rest Frame:**
   $$\vec{u}_i = \vec{v}_i - \vec{V}_J = -12.0\,\hat{i} - 13.0\,\hat{j}\text{ km/s}$$
   $$u_i = \sqrt{(-12.0)^2 + (-13.0)^2} = \sqrt{144 + 169} = \sqrt{313} \approx \mathbf{17.69\text{ km/s}}$$
3. **Scattering in Jupiter's Frame:**
   - Speed is preserved: $u_f = u_i = 17.69\text{ km/s}$.
   - The probe is turned into the $+y$ direction:
     $$\vec{u}_f = (+17.69\,\hat{j})\text{ km/s}$$
4. **Transform Back to Heliocentric (Sun) Frame:**
   $$\vec{v}_f = \vec{u}_f + \vec{V}_J = 17.69\,\hat{j} + 13.00\,\hat{j} = \mathbf{+30.69\,\hat{j}\text{ km/s}}$$
   $$\mathbf{v_f \approx 30.7\text{ km/s}}$$
5. **Physical Insight:**
   The spacecraft gained $(30.7 - 12.0) = 18.7\text{ km/s}$ of heliocentric speed without firing an engine! The energy was extracted from Jupiter's orbital kinetic energy.

---

### Worked Example 7.9: Oblique Impact with Surface Friction
*A tennis ball of mass $m = 0.058\text{ kg}$ strikes a clay court with speed $v_i = 20.0\text{ m/s}$ at an angle $\theta_i = 45.0^\circ$ to the court surface (so $\theta_i = 45.0^\circ$ to normal). The normal coefficient of restitution is $e = 0.700$. Due to rough clay friction, the tangential impulse is related to the normal impulse by $J_t = \mu_k J_n$, where $\mu_k = 0.300$. Determine: (a) the normal impulse $J_n$, (b) the post-bounce velocity components, and (c) the rebound angle $\theta_r$ relative to the surface.*

#### Solution
1. **Given:**
   - $m = 0.058\text{ kg}$
   - $v_{n, i} = -20.0 \cos(45^\circ) = -14.142\text{ m/s}$
   - $v_{t, i} = +20.0 \sin(45^\circ) = +14.142\text{ m/s}$
   - $e = 0.700$, $\mu_k = 0.300$
2. **Normal Dynamics:**
   $$v_{n, f} = -e v_{n, i} = -(0.700)(-14.142) = \mathbf{+9.899\text{ m/s}}$$
   $$J_n = m(v_{n, f} - v_{n, i}) = 0.058 \times (9.899 - (-14.142)) = 0.058 \times 24.041 \approx \mathbf{1.3944\text{ N}\cdot\text{s}}$$
3. **Tangential Dynamics with Friction:**
   $$J_t = -\mu_k J_n = -(0.300)(1.3944) = -0.4183\text{ N}\cdot\text{s}$$
   $$\Delta v_t = \frac{J_t}{m} = \frac{-0.4183}{0.058} = -7.212\text{ m/s}$$
   $$v_{t, f} = v_{t, i} + \Delta v_t = 14.142 - 7.212 = \mathbf{+6.930\text{ m/s}}$$
4. **Rebound Angle Relative to Court Surface:**
   $$\tan(\phi_r) = \frac{v_{n, f}}{v_{t, f}} = \frac{9.899}{6.930} \approx 1.4284$$
   $$\phi_r = \arctan(1.4284) \approx \mathbf{55.0^\circ}$$
   (The ball bounces steeper relative to the ground because friction slowed its forward progress).

---

### Worked Example 7.10: 2D Multi-Body Glancing Cascade
*On a frictionless air table, disc 1 ($m_1 = 1.00\text{ kg}$) moving at $\vec{v}_1 = (12.0\,\hat{i})\text{ m/s}$ strikes stationary disc 2 ($m_2 = 1.00\text{ kg}$) elastically ($e = 1.00$). The contact normal is oriented at $45.0^\circ$ to the $x$-axis. Immediately after this collision, disc 2 slides forward and strikes stationary disc 3 ($m_3 = 2.00\text{ kg}$) head-on elastically. Find the final velocities of all three discs.*

#### Solution
1. **First Collision (Disc 1 on Disc 2):**
   - Both discs have $m = 1.00\text{ kg}$, $e = 1.00$, disc 2 initially at rest.
   - Normal axis $\hat{n} = \cos(45^\circ)\hat{i} + \sin(45^\circ)\hat{j} = (0.7071, 0.7071)$.
   - Tangent axis $\hat{t} = (-0.7071, 0.7071)$.
   - Initial velocity disc 1: $v_{1n, i} = 12.0 \times 0.7071 = 8.4853\text{ m/s}$, $v_{1t, i} = 12.0 \times (-0.7071) = -8.4853\text{ m/s}$.
   - Because $m_1 = m_2$ and $e = 1.00$, normal velocities exchange:
     $$v_{1n, f} = 0, \quad v_{2n, f} = 8.4853\text{ m/s}$$
     $$v_{1t, f} = v_{1t, i} = -8.4853\text{ m/s}, \quad v_{2t, f} = 0$$
   - Disc 1 final velocity:
     $$\vec{v}_{1f} = v_{1t, f}\hat{t} = -8.4853(-0.7071\,\hat{i} + 0.7071\,\hat{j}) = \mathbf{(6.00\,\hat{i} - 6.00\,\hat{j})\text{ m/s}}$$
   - Disc 2 velocity before hitting disc 3:
     $$\vec{v}_{2} = v_{2n, f}\hat{n} = 8.4853(0.7071\,\hat{i} + 0.7071\,\hat{j}) = (6.00\,\hat{i} + 6.00\,\hat{j})\text{ m/s}$$
     $$v_2 = \sqrt{6^2 + 6^2} = \sqrt{72} \approx 8.4853\text{ m/s}$$
2. **Second Collision (Disc 2 on Disc 3, Head-On Elastic):**
   - $m_2 = 1.00\text{ kg}$, $m_3 = 2.00\text{ kg}$, $v_{3i} = 0$, $e = 1.00$.
   - Using 1D elastic collision formulas along the line of motion of disc 2:
     $$v_{2f} = \frac{m_2 - m_3}{m_2 + m_3} v_2 = \frac{1.00 - 2.00}{3.00} (8.4853) = -\frac{1}{3}(8.4853) = -2.8284\text{ m/s}$$
     $$v_{3f} = \frac{2 m_2}{m_2 + m_3} v_2 = \frac{2(1.00)}{3.00} (8.4853) = +\frac{2}{3}(8.4853) = +5.6569\text{ m/s}$$
   - Converting to Cartesian vectors along the unit vector $\hat{u} = \frac{1}{\sqrt{2}}(\hat{i} + \hat{j})$:
     $$\vec{v}_{2f} = -2.8284 \left(\frac{\hat{i} + \hat{j}}{\sqrt{2}}\right) = \mathbf{(-2.00\,\hat{i} - 2.00\,\hat{j})\text{ m/s}}$$
     $$\vec{v}_{3f} = +5.6569 \left(\frac{\hat{i} + \hat{j}}{\sqrt{2}}\right) = \mathbf{(+4.00\,\hat{i} + 4.00\,\hat{j})\text{ m/s}}$$
3. **Total Momentum Verification:**
   - $\vec{P}_{total} = 1.00(6.00\,\hat{i} - 6.00\,\hat{j}) + 1.00(-2.00\,\hat{i} - 2.00\,\hat{j}) + 2.00(4.00\,\hat{i} + 4.00\,\hat{j})$
   - $P_x = 6.00 - 2.00 + 8.00 = 12.0\text{ kg}\cdot\text{m/s}$.
   - $P_y = -6.00 - 2.00 + 8.00 = 0.00\text{ kg}\cdot\text{m/s}$.
   - Initial was $1.00 \times 12.0\,\hat{i} = 12.0\,\hat{i}\text{ kg}\cdot\text{m/s}$. Exact match!

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 7.1:** Explain physically why the tangential velocity of a smooth sphere remains completely unchanged during an oblique impact with another smooth sphere, even if the normal impact is completely inelastic ($e = 0$).  
**Exercise 7.2:** Under what exact conditions will two colliding particles separate at an angle strictly greater than $90^\circ$ after an elastic collision where one particle was initially stationary?

### Tier 2: Quantitative Mechanics
**Exercise 7.3:** A ball bearing strikes a smooth flat floor at an angle of $60.0^\circ$ to the vertical normal with a speed of $18.0\text{ m/s}$. The coefficient of restitution is $e = 0.750$. Calculate the magnitude of the rebound velocity and the rebound angle relative to the vertical normal.  
**Exercise 7.4:** Two identical pucks on an air hockey table collide elastically. Puck 1 is moving at $6.00\text{ m/s}$ along $+x$, while Puck 2 is at rest. After the collision, Puck 1 moves at $45.0^\circ$ to the $x$-axis. Determine the post-collision speed of both pucks.

### Tier 3: Multi-Stage Dynamics
**Exercise 7.5:** A particle of mass $m_1 = 3.00\text{ kg}$ traveling at $\vec{v}_1 = (8.00\,\hat{i})\text{ m/s}$ strikes particle $m_2 = 1.00\text{ kg}$ traveling at $\vec{v}_2 = (4.00\,\hat{j})\text{ m/s}$. The collision is completely inelastic ($e = 0$). Calculate the final composite velocity vector $\vec{V}_f$ and the mechanical energy lost during the impact.  
**Exercise 7.6:** Two smooth spherical marbles of equal radius $R = 2.00\text{ cm}$ and equal mass $m = 0.050\text{ kg}$ collide. Marble 2 is stationary. Marble 1 moves at $v_0 = 3.00\text{ m/s}$ with an impact parameter $b = 2.00\text{ cm}$. Assuming $e = 0.800$, calculate the final velocity vectors of both marbles in Cartesian coordinates.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 7.7:** A projectile of mass $m_1 = 5.00\text{ kg}$ strikes a stationary target of mass $m_2 = 2.00\text{ kg}$ elastically ($e = 1.00$). Determine the maximum possible laboratory scattering angle $\theta_{1, \max}$ for $m_1$.  
**Exercise 7.8:** A ball rebounds elastically between two parallel vertical walls separated by a distance $W = 4.00\text{ m}$. If the ball is launched from Wall 1 at speed $v_0 = 10.0\text{ m/s}$ at an angle of $30.0^\circ$ above the horizontal floor (into the space between walls), and all wall collisions have $e = 1.00$ while gravity acts downward with $g = 9.80\text{ m/s}^2$, find how many wall bounces occur before the ball hits the floor.

### Tier 5: Olympiad / Research Challenge
**Exercise 7.9:** A sphere of mass $M$ and radius $R$ rests on a frictionless horizontal table. A second identical sphere of mass $M$ and radius $R$ slides toward it at speed $v_0$ with impact parameter $b$. Find an analytical expression for the final kinetic energy of the target sphere as a function of $b$, $R$, and $e$.  
**Exercise 7.10:** Prove analytically that for an oblique collision between two smooth bodies with restitution $e < 1$ where the target is initially stationary and masses are equal ($m_1 = m_2$), the scalar product $\vec{v}_{1f} \cdot \vec{v}_{2f} = \frac{1 - e}{2} v_{2f}^2 \ge 0$, and derive the exact formula for the scattering angle $\theta_{\text{total}} = \theta_1 + \theta_2$ in terms of $e$ and the normal collision angle $\alpha$.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 7.1
Newton's Second Law states that $\frac{d\vec{p}}{dt} = \sum \vec{F}$. In an oblique impact between smooth (frictionless) surfaces, the contact force $\vec{F}_c(t)$ is strictly normal to the tangent plane of contact ($\vec{F}_c \parallel \hat{n}$). Because $\vec{F}_c \cdot \hat{t} = 0$, the net tangential force on each body is identically zero at every instant during the collision. Integrating over the collision duration $\Delta t$, the tangential impulse is:
$$J_t = \int_0^{\Delta t} F_t(t)\,dt = 0$$
By the Impulse-Momentum Theorem, $m \Delta v_t = J_t = 0 \implies v_{tf} = v_{ti}$. This holds regardless of whether the normal deformation is elastic ($e = 1$), inelastic ($0 < e < 1$), or completely plastic ($e = 0$), because the restitution parameter $e$ governs normal restitution only.

---

### Solution to Exercise 7.2
In an elastic collision ($e = 1$) with a stationary target ($\vec{v}_{2i} = \vec{0}$), the dot product of the final velocities is:
$$\vec{v}_{1f} \cdot \vec{v}_{2f} = \frac{m_2 - m_1}{2 m_1} v_{2f}^2$$
For the separation angle $\theta_{\text{total}} = \theta_1 + \theta_2$ to be strictly greater than $90^\circ$ ($\cos\theta_{\text{total}} < 0$), the dot product must be negative:
$$\vec{v}_{1f} \cdot \vec{v}_{2f} < 0 \implies m_2 - m_1 < 0 \implies \mathbf{m_1 < m_2}$$
Thus, an angle greater than $90^\circ$ occurs if and only if the projectile is **lighter** than the target ($m_1 < m_2$). The lighter projectile rebounds into the backward hemisphere.

---

### Solution to Exercise 7.3
1. **Initial Velocities:**
   - $\theta_i = 60.0^\circ$ to normal $\hat{n}$.
   - $v_{n, i} = -18.0 \cos(60.0^\circ) = -18.0 \times 0.500 = -9.00\text{ m/s}$.
   - $v_{t, i} = 18.0 \sin(60.0^\circ) = 18.0 \times 0.866025 = 15.5885\text{ m/s}$.
2. **Post-Bounce Components ($e = 0.750$):**
   - $v_{t, f} = v_{t, i} = 15.5885\text{ m/s}$.
   - $v_{n, f} = -e v_{n, i} = -(0.750)(-9.00) = +6.75\text{ m/s}$.
3. **Rebound Magnitude:**
   $$v_f = \sqrt{v_{t, f}^2 + v_{n, f}^2} = \sqrt{(15.5885)^2 + (6.75)^2} = \sqrt{243.0 + 45.5625} = \sqrt{288.5625} \approx \mathbf{16.99\text{ m/s}}$$
4. **Rebound Angle to Normal:**
   $$\tan\theta_r = \frac{v_{t, f}}{v_{n, f}} = \frac{15.5885}{6.75} \approx 2.3094 \implies \theta_r = \arctan(2.3094) \approx \mathbf{66.6^\circ}$$

---

### Solution to Exercise 7.4
1. **Given:** $m_1 = m_2$, $\vec{v}_{2i} = \vec{0}$, $e = 1.00$, $\theta_1 = 45.0^\circ$.
2. **Apply $90^\circ$ Theorem:**
   - The two identical pucks must scatter at right angles: $\theta_1 + \theta_2 = 90.0^\circ$.
   - Since $\theta_1 = +45.0^\circ$, Puck 2 must scatter at $\theta_2 = -45.0^\circ$.
3. **Compute Speeds:**
   - In the velocity vector triangle:
     $$v_{1f} = v_0 \cos(45.0^\circ) = 6.00 \times \frac{\sqrt{2}}{2} \approx \mathbf{4.24\text{ m/s}}$$
     $$v_{2f} = v_0 \sin(45.0^\circ) = 6.00 \times \frac{\sqrt{2}}{2} \approx \mathbf{4.24\text{ m/s}}$$
   - Both pucks depart at identical speeds of $4.24\text{ m/s}$ along symmetric $45^\circ$ angles.

---

### Solution to Exercise 7.5
1. **Initial Momentum:**
   - $\vec{P}_i = m_1 \vec{v}_1 + m_2 \vec{v}_2 = 3.00(8.00\,\hat{i}) + 1.00(4.00\,\hat{j}) = (24.0\,\hat{i} + 4.00\,\hat{j})\text{ kg}\cdot\text{m/s}$.
2. **Total Mass:**
   - $M = m_1 + m_2 = 3.00 + 1.00 = 4.00\text{ kg}$.
3. **Composite Velocity:**
   $$\vec{V}_f = \frac{\vec{P}_i}{M} = \frac{24.0\,\hat{i} + 4.00\,\hat{j}}{4.00} = \mathbf{(6.00\,\hat{i} + 1.00\,\hat{j})\text{ m/s}}$$
   $$V_f = \sqrt{6.00^2 + 1.00^2} = \sqrt{37.0} \approx 6.0828\text{ m/s}$$
4. **Kinetic Energy Loss:**
   - $K_i = \frac{1}{2}(3.00)(8.00)^2 + \frac{1}{2}(1.00)(4.00)^2 = \frac{1}{2}(3)(64) + \frac{1}{2}(1)(16) = 96.0 + 8.0 = 104.0\text{ J}$.
   - $K_f = \frac{1}{2}(4.00)(37.0) = 74.0\text{ J}$.
   - $\Delta K_{\text{loss}} = 104.0 - 74.0 = \mathbf{30.0\text{ J}}$.

---

### Solution to Exercise 7.6
1. **Geometry of Impact:**
   - $R_1 + R_2 = 0.0200 + 0.0200 = 0.0400\text{ m}$.
   - $b = 0.0200\text{ m}$.
   - $\sin\alpha = \frac{b}{R_1 + R_2} = \frac{0.0200}{0.0400} = 0.500 \implies \alpha = 30.0^\circ$.
   - $\cos\alpha = \frac{\sqrt{3}}{2} \approx 0.8660$.
2. **Unit Vectors:**
   - $\hat{n} = \cos(30^\circ)\hat{i} - \sin(30^\circ)\hat{j} = (0.8660, -0.5000)$.
   - $\hat{t} = \sin(30^\circ)\hat{i} + \cos(30^\circ)\hat{j} = (0.5000, 0.8660)$.
3. **Decompose Initial Velocity ($\vec{v}_{1i} = 3.00\,\hat{i}\text{ m/s}$):**
   - $v_{1n, i} = 3.00 \times 0.8660 = 2.5981\text{ m/s}$.
   - $v_{1t, i} = 3.00 \times 0.5000 = 1.5000\text{ m/s}$.
   - $v_{2n, i} = 0, \quad v_{2t, i} = 0$.
4. **Normal Dynamics with $m_1 = m_2$ and $e = 0.800$:**
   $$v_{1n, f} = \frac{1 - e}{2} v_{1n, i} = \frac{1 - 0.800}{2} (2.5981) = 0.100 \times 2.5981 = +0.2598\text{ m/s}$$
   $$v_{2n, f} = \frac{1 + e}{2} v_{1n, i} = \frac{1 + 0.800}{2} (2.5981) = 0.900 \times 2.5981 = +2.3383\text{ m/s}$$
   $$v_{1t, f} = 1.5000\text{ m/s}, \quad v_{2t, f} = 0$$
5. **Reconstruct Vectors:**
   - Marble 1:
     $$\vec{v}_{1f} = 0.2598(0.8660\,\hat{i} - 0.5000\,\hat{j}) + 1.5000(0.5000\,\hat{i} + 0.8660\,\hat{j})$$
     $$v_{1fx} = (0.2598 \times 0.8660) + (1.5000 \times 0.5000) = 0.2250 + 0.7500 = +0.975\text{ m/s}$$
     $$v_{1fy} = (0.2598 \times -0.5000) + (1.5000 \times 0.8660) = -0.1299 + 1.2990 = +1.169\text{ m/s}$$
     $$\mathbf{\vec{v}_{1f} = (0.975\,\hat{i} + 1.169\,\hat{j})\text{ m/s}}$$
   - Marble 2:
     $$\vec{v}_{2f} = 2.3383(0.8660\,\hat{i} - 0.5000\,\hat{j}) = \mathbf{(2.025\,\hat{i} - 1.169\,\hat{j})\text{ m/s}}$$

---

### Solution to Exercise 7.7
For an elastic collision between a projectile of mass $m_1$ and a stationary target $m_2$ with $m_1 > m_2$:
$$\sin(\theta_{1, \max}) = \frac{m_2}{m_1} = \frac{2.00}{5.00} = 0.4000$$
$$\theta_{1, \max} = \arcsin(0.4000) \approx \mathbf{23.58^\circ \approx 23.6^\circ}$$

---

### Solution to Exercise 7.8
1. **Initial Flight Dynamics:**
   - $v_{0x} = 10.0 \cos(30.0^\circ) = 8.6603\text{ m/s}$ (directed towards Wall 2).
   - $v_{0y} = 10.0 \sin(30.0^\circ) = 5.0000\text{ m/s}$.
2. **Total Time in Air Before Floor Impact:**
   - $y(t) = v_{0y} t - \frac{1}{2} g t^2 = 0 \implies t_{\text{air}} = \frac{2 v_{0y}}{g} = \frac{2 \times 5.000}{9.80} \approx 1.0204\text{ s}$.
3. **Horizontal Motion Between Walls:**
   - The walls are vertical, so elastic wall bounces reverse $v_x \to -v_x$ without changing $|v_x| = 8.6603\text{ m/s}$.
   - Distance between walls $W = 4.00\text{ m}$.
   - Time to reach first wall (Wall 2): $t_1 = \frac{W}{v_{0x}} = \frac{4.00}{8.6603} \approx 0.4619\text{ s}$.
   - Time to rebound and reach Wall 1 again: $t_2 = t_1 + \frac{W}{v_{0x}} = 2 \times 0.4619 = 0.9238\text{ s}$.
   - Time to reach Wall 2 a second time: $t_3 = 3 \times 0.4619 = 1.3856\text{ s}$.
4. **Compare Times:**
   - $t_1 = 0.462\text{ s} < t_{\text{air}}$ (Bounce 1 occurs).
   - $t_2 = 0.924\text{ s} < t_{\text{air}}$ (Bounce 2 occurs).
   - $t_3 = 1.386\text{ s} > t_{\text{air}} = 1.020\text{ s}$ (Hits floor before third bounce).
   - Total wall bounces: $\mathbf{2\text{ bounces}}$.

---

### Solution to Exercise 7.9
1. **Geometry:** $\sin\alpha = \frac{b}{2R}$, $\cos\alpha = \sqrt{1 - \frac{b^2}{4R^2}}$.
2. **Initial Normal Velocity:** $v_{1n, i} = v_0 \cos\alpha$.
3. **Post-Collision Normal Velocity of Target ($M_1 = M_2 = M$):**
   $$v_{2n, f} = \frac{1+e}{2} v_{1n, i} = \frac{1+e}{2} v_0 \cos\alpha$$
4. **Because target receives zero tangential impulse, its total speed is $v_{2f} = v_{2n, f}$:**
   $$K_{2f} = \frac{1}{2} M v_{2f}^2 = \frac{1}{2} M \left[\frac{1+e}{2} v_0 \cos\alpha\right]^2 = \frac{1}{8} M (1+e)^2 v_0^2 \cos^2\alpha$$
5. **Substitute $\cos^2\alpha = 1 - \frac{b^2}{4R^2}$:**
   $$\mathbf{K_{2f}(b) = \frac{1}{8} M (1+e)^2 v_0^2 \left(1 - \frac{b^2}{4R^2}\right)}$$

---

### Solution to Exercise 7.10
1. **Dot Product Proof:**
   - Final velocities:
     $\vec{v}_{1f} = v_{1n, f}\hat{n} + v_{1t, i}\hat{t}$
     $\vec{v}_{2f} = v_{2n, f}\hat{n}$ (since $v_{2t, f} = 0$).
   - Dot product:
     $\vec{v}_{1f} \cdot \vec{v}_{2f} = v_{1n, f} v_{2n, f}$.
   - For $m_1 = m_2$, $v_{1n, f} = \frac{1-e}{2} v_{1n, i}$ and $v_{2n, f} = \frac{1+e}{2} v_{1n, i}$.
   - Therefore:
     $$\vec{v}_{1f} \cdot \vec{v}_{2f} = \left(\frac{1-e}{2} v_{1n, i}\right) v_{2n, f} = \frac{1-e}{1+e} v_{2n, f}^2 \ge 0$$
2. **Scattering Angle:**
   - Sphere 2 moves along the normal $\hat{n} \implies \theta_2 = -\alpha$.
   - For sphere 1:
     $$\tan\theta_1 = \frac{v_{1y, f}}{v_{1x, f}} = \frac{\tan\alpha}{e + (1+e)\tan^2\alpha}$$
   - The total angle $\theta_{\text{total}} = \theta_1 + \alpha$ satisfies:
     $$\mathbf{\tan(\theta_{\text{total}}) = \frac{(1+e)\tan\alpha}{(1-e) - e(1+e)\tan^2\alpha}}$$
   - When $e \to 1$, the denominator approaches 0, yielding $\theta_{\text{total}} \to 90^\circ$!


---

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


---

# Chapter 09: Classical Scattering Theory, Cross Sections, and Impact Parameters

> "It was quite the most incredible event that has ever happened to me in my life. It was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you."  
> — Ernest Rutherford (on observing large-angle alpha particle scattering, 1911)

---

## 1. Introduction: From Physical Contact to Field-Mediated Collisions

In our previous chapters, collisions were treated as instantaneous contact interactions between macroscopic rigid bodies, characterized by a normal line of impact and a phenomenological coefficient of restitution $e$. However, when nature is probed at microscopic atomic scales or astronomical cosmological scales, bodies almost never make "physical contact" in the colloquial sense.

When an alpha particle deflects off a gold nucleus, when electrons scatter off ions in a fusion plasma, or when a interstellar comet swings around the Sun, the interaction is mediated continuously by a **conservative force field** (such as Coulomb repulsion or Newtonian gravitation). The particles never touch; instead, their trajectories curve smoothly through space as momentum and energy are exchanged continuously through the potential gradient $\vec{F} = -\nabla U(r)$.

This continuous interaction regime is the domain of **Classical Scattering Theory**. Rather than tracking instantaneous contact points, scattering theory maps the asymptotic conditions before the interaction (at infinite distance $r \to \infty$) to the asymptotic conditions long after the interaction has subsided ($r \to \infty$).

---

## 2. Geometry of Planar Scattering: Impact Parameter and Deflection Angle

Consider a stationary target of mass $M$ fixed at the origin $O$. A projectile of mass $m$ approaches from infinity with initial asymptotic velocity $\vec{v}_0$ directed along the $+x$ axis.

```
                         y
                         ^
        Incident beam    |               Periapsis (closest approach r_min)
        v0 ------------->+-------------*
                         |  b          /  \
     --------------------+------------+----\-------------------------> x
                         |           O       \
                         |         Target     \  Scattering angle theta
                         v                     v
                                                 Asymptotic departure path
```

### 2.1 The Impact Parameter ($b$)

The **impact parameter** $b$ is the perpendicular distance from the target center $O$ to the incident velocity vector of the projectile at infinity:
$$b \equiv \lim_{x \to -\infty} |y(x)|$$

- If $b = 0$, the collision is purely head-on; the particle approaches along the symmetry axis, decelerates to rest at a distance of closest approach $r_{\min}$, and rebounds directly backwards ($\theta = 180^\circ = \pi$).
- As $b \to \infty$, the particle passes so far from the target that the force field is negligible; it continues undeflected ($\theta \to 0$).
- For intermediate $b$, the trajectory is deflected by an angle $\theta$, called the **scattering angle** (or deflection angle).

### 2.2 Angular Momentum and Energy Invariance

Because central force fields $\vec{F}(\vec{r}) = f(r)\hat{r}$ exert zero torque about the center of force $O$ ($\vec{\tau} = \vec{r} \times \vec{F} = \vec{0}$), two fundamental quantities are strictly conserved throughout the entire flight:

1. **Conservation of Angular Momentum:**
   At infinity, the angular momentum about $O$ is:
   $$L = \|\vec{r} \times m\vec{v}_0\| = m v_0 b = \text{constant}$$
   At any intermediate polar coordinate $(r, \phi)$:
   $$L = m r^2 \dot{\phi} = m v_0 b \implies \dot{\phi} = \frac{v_0 b}{r^2}$$

2. **Conservation of Mechanical Energy:**
   At infinity, where potential energy $U(\infty) = 0$:
   $$E = \frac{1}{2}m v_0^2 = \text{constant}$$
   At any intermediate distance $r$:
   $$E = \frac{1}{2}m \dot{r}^2 + \frac{1}{2}m (r\dot{\phi})^2 + U(r) = \frac{1}{2}m \dot{r}^2 + \frac{L^2}{2m r^2} + U(r)$$

This defines the **effective potential**:
$$U_{\text{eff}}(r) = U(r) + \frac{L^2}{2m r^2} = U(r) + \frac{m v_0^2 b^2}{2 r^2}$$

### 2.3 Distance of Closest Approach ($r_{\min}$)

At the point of closest approach (the turning point or periapsis), the radial velocity vanishes identically: $\dot{r} = 0$. Setting $E = U_{\text{eff}}(r_{\min})$ yields:
$$\frac{1}{2}m v_0^2 = U(r_{\min}) + \frac{m v_0^2 b^2}{2 r_{\min}^2}$$
$$1 - \frac{U(r_{\min})}{E} - \frac{b^2}{r_{\min}^2} = 0$$

For any specified potential $U(r)$, this algebraic equation determines $r_{\min}$ as a direct function of initial energy $E$ and impact parameter $b$.

---

## 3. The Concept of Cross Section: Differential and Total

In experimental physics, an accelerator does not shoot a single particle at a single atom; instead, a **beam** of billions of particles per second bombards a target foil containing trillions of atoms. To bridge single-particle trajectories to macroscopic experimental counts, physicists use the concept of **cross section** ($\sigma$).

### 3.1 Incident Beam Flux ($I_0$)

The **incident beam flux** $I_0$ is defined as the number of incident projectile particles crossing per unit area per unit time:
$$I_0 = \frac{dN_{\text{inc}}}{A\,dt} \quad \left[\frac{\text{particles}}{\text{m}^2\cdot\text{s}}\right]$$

### 3.2 The Annular Scattering Ring

Consider particles in the beam whose impact parameters lie in the narrow annular ring between $b$ and $b + db$.
- The area of this circular ring is:
  $$dA = 2\pi b\,db$$
- The rate of particles passing through this ring is:
  $$dN = I_0\,dA = I_0 (2\pi b\,|db|)$$

Because the central potential is spherically symmetric, every particle entering this annular ring scatters into a corresponding cone of polar angles between $\theta$ and $\theta + d\theta$.

```
Beam cross-section:                Solid angle element dOmega:
         ___                                  ___
       /  b  \                              /     \
      |   *---| db                         |   *---| dtheta
       \ ___ /                              \ ___ /
     dA = 2 pi b db                   dOmega = 2 pi sin(theta) dtheta
```

### 3.3 The Differential Cross Section ($d\sigma/d\Omega$)

The solid angle subtended by this scattered conical shell is:
$$d\Omega = 2\pi \sin\theta\,d\theta$$

The **Differential Scattering Cross Section** $\frac{d\sigma}{d\Omega}$ is defined as the number of particles scattered into solid angle $d\Omega$ per unit time, divided by the incident flux $I_0$ and the solid angle:
$$\frac{d\sigma}{d\Omega}(\theta) \equiv \frac{1}{I_0} \frac{dN}{d\Omega} = \frac{I_0 (2\pi b\,|db|)}{I_0 (2\pi \sin\theta\,d\theta)}$$

$$\mathbf{\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right|}$$

The differential cross section has dimensions of **area per unit solid angle** ($\text{m}^2/\text{sr}$, or historically in barns per steradian, where $1\text{ barn} = 10^{-28}\text{ m}^2$).

### 3.4 The Total Cross Section ($\sigma_{\text{tot}}$)

The **Total Cross Section** $\sigma_{\text{tot}}$ represents the total effective target area that the scatterer presents to the beam for scattering of any non-zero angle:
$$\mathbf{\sigma_{\text{tot}} \equiv \int_{\text{all }\Omega} \frac{d\sigma}{d\Omega}\,d\Omega = 2\pi \int_0^\pi \frac{d\sigma}{d\Omega} \sin\theta\,d\theta = 2\pi \int_0^{b_{\max}} b\,db}$$

---

## 4. Benchmark 1: Hard-Sphere Elastic Scattering

To understand cross sections intuitively, let us compute the cross section for a point projectile scattering elastically off a rigid, impenetrable sphere of radius $R$.

### 4.1 Trajectory Geometry

```
                         y
                         ^
        Incident path    |
        -----------------+-------* Contact point
                         |      / \
                       b |   R /   \ alpha
                         |    /     \
                         v   O-------+-----------------------------> x
                           Sphere     \  Scattering angle theta
```

1. If $b > R$, the particle misses the sphere entirely ($db/d\theta = 0$, undeflected).
2. For $b \le R$, contact occurs at an angle $\alpha$ relative to the centerline:
   $$\sin\alpha = \frac{b}{R} \implies b = R \sin\alpha$$
3. By the law of specular reflection on the spherical surface, the angle of incidence equals the angle of reflection. From the geometry of the triangle:
   $$\theta = \pi - 2\alpha \implies \alpha = \frac{\pi - \theta}{2}$$
4. Express $b$ in terms of scattering angle $\theta$:
   $$b(\theta) = R \sin\left(\frac{\pi - \theta}{2}\right) = R \cos\left(\frac{\theta}{2}\right)$$

### 4.2 Compute the Differential Cross Section

Differentiating with respect to $\theta$:
$$\frac{db}{d\theta} = -\frac{R}{2} \sin\left(\frac{\theta}{2}\right) \implies \left|\frac{db}{d\theta}\right| = \frac{R}{2} \sin\left(\frac{\theta}{2}\right)$$

Substitute into the master formula:
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{R \cos(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{R}{2}\sin(\theta/2)\right]$$
Canceling terms:
$$\mathbf{\frac{d\sigma}{d\Omega} = \frac{R^2}{4}}$$

### 4.3 Profound Insights from Hard-Sphere Scattering

1. **Isotropy:** Notice that $\frac{d\sigma}{d\Omega} = \frac{R^2}{4}$ is a **pure constant**, independent of scattering angle $\theta$! A hard sphere scatters incident flux with uniform probability into every steradian of space.
2. **Total Cross Section:**
   $$\sigma_{\text{tot}} = \int \frac{d\sigma}{d\Omega}\,d\Omega = \frac{R^2}{4} \int d\Omega = \frac{R^2}{4} (4\pi) = \mathbf{\pi R^2}$$
   The total scattering cross section equals **precisely the geometric shadow area** $\pi R^2$ of the target sphere!

---

## 5. Benchmark 2: Rutherford Scattering (Coulomb Repulsion)

In 1911, Ernest Rutherford analyzed the scattering of positively charged alpha particles ($q_1 = +2e$) off gold nuclei ($q_2 = +Ze$) under the repulsive Coulomb potential:
$$U(r) = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r} = \frac{k q_1 q_2}{r}$$

### 5.1 The Classical Hyperbolic Orbit

Under an inverse-square central force, the trajectory of an unbound particle ($E > 0$) is a **hyperbola** with the target nucleus located at the exterior focus.

```
                              y
                              ^
        Incoming asymptote    |
                \             |
                  \           |
                    \    r_min|
                      ` *     |
                       /  \   |
                      /    \  |
                     /      \ |
     ---------------+--------+O----------------------------------> x
                             |  Nucleus (+Ze)
                              \  Outgoing asymptote (deflected by theta)
```

Integrating the orbital equations of motion yields the fundamental relationship connecting impact parameter $b$ and scattering angle $\theta$:

$$\mathbf{b(\theta) = \frac{k q_1 q_2}{2 E} \cot\left(\frac{\theta}{2}\right)}$$
where $E = \frac{1}{2} m v_0^2$ is the initial kinetic energy of the projectile.

### 5.2 Derivation of the Rutherford Scattering Formula

1. Differentiate $b$ with respect to $\theta$:
   $$\frac{db}{d\theta} = \frac{k q_1 q_2}{2 E} \left(-\frac{1}{2 \sin^2(\theta/2)}\right) \implies \left|\frac{db}{d\theta}\right| = \frac{k q_1 q_2}{4 E \sin^2(\theta/2)}$$

2. Substitute $b$ and $|db/d\theta|$ into the differential cross section:
   $$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{\frac{k q_1 q_2}{2E} \cot(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{k q_1 q_2}{4E \sin^2(\theta/2)}\right]$$

3. Using $\cot(\theta/2) = \frac{\cos(\theta/2)}{\sin(\theta/2)}$:
   $$\frac{d\sigma}{d\Omega} = \left(\frac{k q_1 q_2}{4E}\right)^2 \frac{\frac{\cos(\theta/2)}{\sin(\theta/2)}}{2\sin(\theta/2)\cos(\theta/2) \sin^2(\theta/2)} = \left(\frac{k q_1 q_2}{4E}\right)^2 \frac{1}{4 \sin^4(\theta/2)}$$

$$\mathbf{\frac{d\sigma}{d\Omega}(\theta) = \left(\frac{k q_1 q_2}{4 E}\right)^2 \frac{1}{\sin^4(\theta/2)} = \left(\frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{4 E}\right)^2 \frac{1}{\sin^4(\theta/2)}}$$

### 5.3 Physical Ramifications of Rutherford Scattering

1. **The $\sin^{-4}(\theta/2)$ Singularity:**
   As $\theta \to 0$, the cross section diverges rapidly to infinity ($\frac{d\sigma}{d\Omega} \propto \theta^{-4}$). Why? Because the Coulomb potential $1/r$ has infinite range! Even particles passing millions of atomic radii away ($b \to \infty$) experience a tiny, non-zero deflection. Consequently, the total cross section for a pure Coulomb potential is **infinite**:
   $$\sigma_{\text{tot}} = \int \frac{d\sigma}{d\Omega}\,d\Omega = \infty$$
   (In real matter, the nuclear charge is screened by electron clouds at atomic radii $R_{\text{atom}}$, cutting off the long-range tail).

2. **Large-Angle Scattering ($\theta \approx 180^\circ$):**
   For head-on scattering ($\theta \to \pi$), $\sin(\theta/2) \to 1$. The cross section reaches a finite minimum:
   $$\frac{d\sigma}{d\Omega}(\pi) = \left(\frac{k q_1 q_2}{4 E}\right)^2$$
   This proved that the positive charge of an atom is concentrated in a dense, massive core ($< 10^{-14}\text{ m}$) rather than spread out uniformly as J.J. Thomson's "plum pudding" model had proposed!

---

## 6. Gravitational Slingshots and Orbital Assist Mechanics

The mathematics of Rutherford scattering applies directly to celestial mechanics under attractive Newtonian gravity by replacing repulsive Coulomb constant $+k q_1 q_2$ with attractive gravitational parameter $-G M m$.

### 6.1 Hyperbolic Deflection Around a Planet

When a spacecraft of mass $m$ flies past a planet of mass $M$ with asymptotic approach speed $v_\infty$ at periapsis distance $r_p$:
1. Eccentricity of the hyperbolic trajectory:
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{G M} > 1$$
2. Deflection angle $\delta$ in the planet's rest frame:
   $$\sin\left(\frac{\delta}{2}\right) = \frac{1}{\epsilon} = \frac{1}{1 + \frac{r_p v_\infty^2}{G M}}$$
   $$\delta = 2 \arcsin\left(\frac{1}{1 + \frac{r_p v_\infty^2}{G M}}\right)$$

By carefully angling this deflection vector relative to the planet's orbital motion around the Sun, the spacecraft extracts orbital energy from the planet, gaining heliocentric velocity without burning propellant (the **gravity assist** that propelled Voyager 1, Voyager 2, Cassini, and New Horizons across the outer solar system).

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 9.1: Hard-Sphere Differential and Total Cross Section
*A beam of microscopic glass beads is fired at a steel ball bearing of radius $R = 1.50\text{ cm}$. (a) Calculate the differential cross section $\frac{d\sigma}{d\Omega}$ at scattering angles $\theta = 30.0^\circ$, $90.0^\circ$, and $150.0^\circ$. (b) Calculate the total scattering cross section $\sigma_{\text{tot}}$. (c) If the incident beam has a uniform flux of $I_0 = 4.00 \times 10^5\text{ beads}/(\text{m}^2\cdot\text{s})$, how many beads are scattered per second into a small detector of area $A_{\text{det}} = 2.00\text{ cm}^2$ placed $L = 1.00\text{ m}$ away at $\theta = 60.0^\circ$?*

#### Solution
1. **Given:**
   - $R = 0.0150\text{ m}$
   - $I_0 = 4.00 \times 10^5\text{ m}^{-2}\text{s}^{-1}$
   - $A_{\text{det}} = 2.00 \times 10^{-4}\text{ m}^2$, $L = 1.00\text{ m}$
2. **Part (a): Differential Cross Section:**
   - For a hard sphere, scattering is isotropic:
     $$\frac{d\sigma}{d\Omega} = \frac{R^2}{4} = \frac{(0.0150)^2}{4} = \frac{2.25 \times 10^{-4}}{4} = \mathbf{5.625 \times 10^{-5}\text{ m}^2/\text{sr}}$$
   - Because it is independent of $\theta$, it is identically **$5.625 \times 10^{-5}\text{ m}^2/\text{sr}$** at $30^\circ$, $90^\circ$, and $150^\circ$!
3. **Part (b): Total Cross Section:**
   $$\sigma_{\text{tot}} = \pi R^2 = \pi (0.0150)^2 = \pi \times 2.25 \times 10^{-4} \approx \mathbf{7.069 \times 10^{-4}\text{ m}^2}$$
4. **Part (c): Count Rate in Detector:**
   - Solid angle subtended by detector:
     $$\Delta\Omega = \frac{A_{\text{det}}}{L^2} = \frac{2.00 \times 10^{-4}\text{ m}^2}{(1.00\text{ m})^2} = 2.00 \times 10^{-4}\text{ sr}$$
   - Scattered rate:
     $$\frac{dN}{dt} = I_0 \left(\frac{d\sigma}{d\Omega}\right) \Delta\Omega = (4.00 \times 10^5) \times (5.625 \times 10^{-5}) \times (2.00 \times 10^{-4})$$
     $$\frac{dN}{dt} = 22.5 \times (2.00 \times 10^{-4}) = \mathbf{4.50 \times 10^{-3}\text{ beads/s}}$$

---

### Worked Example 9.2: Alpha Particle Distance of Closest Approach in Head-On Collision
*In a Rutherford scattering experiment, an alpha particle ($q_1 = +2e$, mass $m_\alpha = 6.64 \times 10^{-27}\text{ kg}$) is fired head-on ($b = 0$) with kinetic energy $E = 5.00\text{ MeV}$ directly toward a gold nucleus ($Z = 79$, $q_2 = +79e$). (Take $e = 1.602 \times 10^{-19}\text{ C}$, $k = \frac{1}{4\pi\epsilon_0} = 8.988 \times 10^9\text{ N}\cdot\text{m}^2/\text{C}^2$). (a) Convert $E$ to Joules. (b) Calculate the distance of closest approach $d_{\min}$.*

#### Solution
1. **Part (a): Energy Conversion:**
   $$E = 5.00\text{ MeV} = 5.00 \times 10^6\text{ eV} \times (1.602 \times 10^{-19}\text{ J/eV}) = \mathbf{8.010 \times 10^{-13}\text{ J}}$$
2. **Part (b): Distance of Closest Approach ($d_{\min}$):**
   - For a head-on collision ($b = 0$), all kinetic energy is converted into electrostatic potential energy at the turning point:
     $$E = \frac{k q_1 q_2}{d_{\min}} = \frac{k (2e)(79e)}{d_{\min}} = \frac{158 k e^2}{d_{\min}}$$
     $$d_{\min} = \frac{158 k e^2}{E} = \frac{158 \times (8.988 \times 10^9) \times (1.602 \times 10^{-19})^2}{8.010 \times 10^{-13}}$$
     $$158 \times (8.988 \times 10^9) = 1.4201 \times 10^{12}$$
     $$(1.602 \times 10^{-19})^2 = 2.5664 \times 10^{-38}$$
     $$\text{Numerator} = 1.4201 \times 10^{12} \times 2.5664 \times 10^{-38} = 3.6446 \times 10^{-26}\text{ N}\cdot\text{m}^2$$
     $$d_{\min} = \frac{3.6446 \times 10^{-26}}{8.010 \times 10^{-13}} \approx \mathbf{4.55 \times 10^{-14}\text{ m} = 45.5\text{ fm}}$$
3. **Physical Significance:**
   Since the radius of a gold nucleus is approximately $R_{\text{nucleus}} \approx 7.3\text{ fm}$, the alpha particle turns around safely outside the nuclear boundary, confirming that purely classical electrostatic Coulomb forces govern the scattering!

---

### Worked Example 9.3: Impact Parameter for $90^\circ$ Rutherford Scattering
*For the $5.00\text{ MeV}$ alpha particle scattering off gold ($Z = 79$) in Example 9.2: (a) find the impact parameter $b_{90}$ that causes a deflection of exactly $\theta = 90.0^\circ$, and (b) calculate the distance of closest approach $r_{\min}$ at this impact parameter.*

#### Solution
1. **Given:**
   - $E = 8.010 \times 10^{-13}\text{ J}$
   - $k q_1 q_2 = 3.6446 \times 10^{-26}\text{ N}\cdot\text{m}^2$
   - Head-on distance $d_{\min} = 4.550 \times 10^{-14}\text{ m}$
2. **Part (a): Compute $b$ for $\theta = 90.0^\circ$:**
   $$b(\theta) = \frac{k q_1 q_2}{2 E} \cot\left(\frac{\theta}{2}\right) = \frac{d_{\min}}{2} \cot(45.0^\circ)$$
   Since $\cot(45.0^\circ) = 1.000$:
   $$b_{90} = \frac{d_{\min}}{2} = \frac{4.550 \times 10^{-14}}{2} = \mathbf{2.275 \times 10^{-14}\text{ m} = 22.8\text{ fm}}$$
3. **Part (b): Closest Approach $r_{\min}$ for $\theta = 90^\circ$:**
   - For a hyperbola, $r_{\min} = a(1 + \epsilon)$, where $a = \frac{d_{\min}}{2} = b_{90}$ and eccentricity $\epsilon = \csc(\theta/2) = \csc(45^\circ) = \sqrt{2} \approx 1.4142$.
   $$r_{\min} = a (1 + \epsilon) = b_{90} (1 + \sqrt{2}) = (2.275 \times 10^{-14}) \times (2.4142) \approx \mathbf{5.49 \times 10^{-14}\text{ m} = 54.9\text{ fm}}$$

---

### Worked Example 9.4: Rutherford Differential Cross Section Ratio
*Compare the probability of an alpha particle deflecting at $\theta_1 = 30.0^\circ$ versus $\theta_2 = 150.0^\circ$ in Rutherford scattering. Calculate the exact numerical ratio $\frac{(d\sigma/d\Omega)_{30^\circ}}{(d\sigma/d\Omega)_{150^\circ}}$.*

#### Solution
1. **Rutherford Cross Section Formula:**
   $$\frac{d\sigma}{d\Omega} \propto \frac{1}{\sin^4(\theta/2)}$$
2. **Evaluate Angles:**
   - For $\theta_1 = 30.0^\circ$: $\theta_1/2 = 15.0^\circ$.
     $$\sin(15.0^\circ) \approx 0.258819$$
     $$\sin^4(15.0^\circ) = (0.258819)^4 \approx 0.004487$$
   - For $\theta_2 = 150.0^\circ$: $\theta_2/2 = 75.0^\circ$.
     $$\sin(75.0^\circ) \approx 0.965926$$
     $$\sin^4(75.0^\circ) = (0.965926)^4 \approx 0.86967$$
3. **Compute Ratio:**
   $$\frac{(d\sigma/d\Omega)_{30^\circ}}{(d\sigma/d\Omega)_{150^\circ}} = \frac{\sin^4(75.0^\circ)}{\sin^4(15.0^\circ)} = \frac{0.86967}{0.004487} \approx \mathbf{193.8}$$
4. **Conclusion:**
   Deflections at $30^\circ$ are almost $200$ times more probable than deflections at $150^\circ$!

---

### Worked Example 9.5: Hard-Sphere Scattering with Impact Parameter Distribution
*A beam of identical particles is uniformly distributed over a circular cross-section of radius $R_{\text{beam}} = 2.00\text{ cm}$. At the center of the beam sits a hard sphere of radius $R = 1.00\text{ cm}$. What fraction of the incident beam particles will scatter by an angle $\theta \ge 60.0^\circ$?*

#### Solution
1. **Relate Scattering Angle to Impact Parameter:**
   - For a hard sphere: $b = R \cos(\theta/2)$.
   - For $\theta \ge 60.0^\circ$, the impact parameter must satisfy:
     $$b \le R \cos(30.0^\circ) = R \frac{\sqrt{3}}{2} \approx 0.8660 R$$
2. **Cross-Sectional Area for Scattering $\theta \ge 60^\circ$:**
   $$\sigma(\ge 60^\circ) = \pi b_{\max}^2 = \pi \left(\frac{\sqrt{3}}{2} R\right)^2 = \frac{3}{4} \pi R^2$$
3. **Total Beam Area:**
   $$A_{\text{beam}} = \pi R_{\text{beam}}^2 = \pi (2.00)^2 = 4\pi\text{ cm}^2$$
4. **Area for $\theta \ge 60^\circ$:**
   $$\sigma = \frac{3}{4} \pi (1.00)^2 = 0.75\pi\text{ cm}^2$$
5. **Fraction of Particles Scattered:**
   $$\text{Fraction} = \frac{\sigma}{A_{\text{beam}}} = \frac{0.75\pi}{4.00\pi} = \frac{0.75}{4.00} = \mathbf{0.1875 = 18.75\%}$$

---

### Worked Example 9.6: Voyager 1 Jupiter Gravity Assist Geometry
*Voyager 1 approached Jupiter ($M_J = 1.90 \times 10^{27}\text{ kg}$) with an asymptotic heliocentric excess speed $v_\infty = 13.5\text{ km/s}$. The closest approach distance was $r_p = 348,890\text{ km}$ from the center of Jupiter. (Take $G = 6.674 \times 10^{-11}\text{ N}\cdot\text{m}^2/\text{kg}^2$). Calculate: (a) the standard gravitational parameter $\mu = G M_J$, (b) the trajectory eccentricity $\epsilon$, and (c) the total deflection angle $\delta$ in Jupiter's rest frame.*

#### Solution
1. **Given:**
   - $M_J = 1.90 \times 10^{27}\text{ kg}$
   - $v_\infty = 1.35 \times 10^4\text{ m/s}$
   - $r_p = 3.4889 \times 10^8\text{ m}$
2. **Part (a): Gravitational Parameter $\mu$:**
   $$\mu = G M_J = (6.674 \times 10^{-11}) \times (1.90 \times 10^{27}) = \mathbf{1.268 \times 10^{17}\text{ m}^3/\text{s}^2}$$
3. **Part (b): Eccentricity $\epsilon$:**
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{\mu} = 1 + \frac{(3.4889 \times 10^8) \times (1.35 \times 10^4)^2}{1.268 \times 10^{17}}$$
   $$(1.35 \times 10^4)^2 = 1.8225 \times 10^8\text{ m}^2/\text{s}^2$$
   $$\text{Numerator} = 3.4889 \times 10^8 \times 1.8225 \times 10^8 \approx 6.3585 \times 10^{16}\text{ m}^3/\text{s}^2$$
   $$\frac{r_p v_\infty^2}{\mu} = \frac{6.3585 \times 10^{16}}{1.268 \times 10^{17}} \approx 0.50146$$
   $$\mathbf{\epsilon = 1 + 0.50146 \approx 1.5015}$$
4. **Part (c): Deflection Angle $\delta$:**
   $$\sin\left(\frac{\delta}{2}\right) = \frac{1}{\epsilon} = \frac{1}{1.5015} \approx 0.6660$$
   $$\frac{\delta}{2} = \arcsin(0.6660) \approx 41.76^\circ$$
   $$\mathbf{\delta = 2 \times 41.76^\circ \approx 83.5^\circ}$$

---

### Worked Example 9.7: Inverse-Cube Force Law Scattering Trajectory
*A particle of mass $m$ and initial speed $v_0$ is scattered by a repulsive central potential $U(r) = \frac{k}{2 r^2}$ ($k > 0$). Derive the scattering angle $\theta$ as an explicit function of impact parameter $b$.*

#### Solution
1. **Conservation of Energy and Angular Momentum:**
   $$E = \frac{1}{2} m v_0^2, \quad L = m v_0 b$$
   Effective potential:
   $$U_{\text{eff}}(r) = \frac{k}{2r^2} + \frac{L^2}{2m r^2} = \frac{1}{2r^2} \left[k + \frac{L^2}{m}\right] = \frac{1}{2r^2} \left[k + m v_0^2 b^2\right]$$
2. **Radial Motion Equation:**
   $$\frac{1}{2}m \dot{r}^2 + U_{\text{eff}}(r) = E \implies \dot{r} = \pm \sqrt{\frac{2}{m}(E - U_{\text{eff}})} = \pm \sqrt{v_0^2 - \frac{k + m v_0^2 b^2}{m r^2}}$$
3. **Orbital Equation $d\phi/dr$:**
   $$\frac{d\phi}{dr} = \frac{\dot{\phi}}{\dot{r}} = \frac{v_0 b / r^2}{\sqrt{v_0^2 - \frac{k + m v_0^2 b^2}{m r^2}}} = \frac{b}{r^2 \sqrt{1 - \frac{b^2 + k/(mv_0^2)}{r^2}}}$$
4. **Let $\gamma = \sqrt{1 + \frac{k}{m v_0^2 b^2}} > 1$:**
   $$\frac{d\phi}{dr} = \frac{b}{r \sqrt{(\gamma b)^2 - r^2}} \implies \Delta\phi = 2 \int_{\gamma b}^\infty \frac{b\,dr}{r\sqrt{r^2 - (\gamma b)^2}} = 2 \left[\frac{b}{\gamma b} \frac{\pi}{2}\right] = \frac{\pi}{\gamma}$$
5. **Scattering Angle $\theta$:**
   $$\theta = |\pi - \Delta\phi| = \pi \left(1 - \frac{1}{\gamma}\right) = \mathbf{\pi \left(1 - \frac{1}{\sqrt{1 + \frac{k}{m v_0^2 b^2}}}\right)}$$

---

### Worked Example 9.8: Target Foil Thickness and Nuclear Collision Rate
*A gold foil of density $\rho = 19.3\text{ g/cm}^3$ and atomic mass $M = 197.0\text{ g/mol}$ has thickness $t = 1.00\text{ }\mu\text{m}$. A beam of alpha particles carries a current of $I = 1.00\text{ nA}$ ($1\text{ A} = 1\text{ C/s}$, each alpha particle has charge $q = +2e = 3.204 \times 10^{-19}\text{ C}$). If the total cross section for large-angle deflection ($\theta \ge 90^\circ$) is $\sigma_{90} = 1.62 \times 10^{-27}\text{ m}^2$, calculate: (a) the number density of gold atoms in the foil, (b) the total number of alpha particles striking the foil per second, and (c) the number of large-angle deflections per second.*

#### Solution
1. **Part (a): Number Density $n$ of Gold Atoms:**
   $$n = \frac{\rho N_A}{M} = \frac{(19.3 \times 10^3\text{ kg/m}^3) \times (6.022 \times 10^{23}\text{ atoms/mol})}{0.1970\text{ kg/mol}} \approx \mathbf{5.90 \times 10^{28}\text{ atoms/m}^3}$$
2. **Part (b): Incident Alpha Particle Rate $\dot{N}_{\text{inc}}$:**
   $$\dot{N}_{\text{inc}} = \frac{I}{2e} = \frac{1.00 \times 10^{-9}\text{ C/s}}{3.204 \times 10^{-19}\text{ C}} \approx \mathbf{3.121 \times 10^9\text{ particles/s}}$$
3. **Part (c): Large-Angle Scattering Rate:**
   - Probability that a single projectile undergoes large-angle scattering:
     $$P = n \cdot t \cdot \sigma_{90} = (5.90 \times 10^{28}\text{ m}^{-3}) \times (1.00 \times 10^{-6}\text{ m}) \times (1.62 \times 10^{-27}\text{ m}^2)$$
     $$P = 5.90 \times 10^{22} \times 1.62 \times 10^{-27} \approx 9.558 \times 10^{-5}$$
   - Scattered particles per second:
     $$\dot{N}_{\text{scattered}} = \dot{N}_{\text{inc}} \times P = (3.121 \times 10^9) \times (9.558 \times 10^{-5}) \approx \mathbf{298,300\text{ particles/s} \approx 2.98 \times 10^5\text{ s}^{-1}}$$

---

### Worked Example 9.9: Laboratory to Center-of-Mass Cross Section Transformation
*In a collision between an incident particle of mass $m_1$ and a stationary target $m_2$, show that the differential cross sections in the Laboratory frame and Center-of-Mass frame are related by:*
$$\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \frac{(1 + 2\gamma\cos\theta^* + \gamma^2)^{3/2}}{|1 + \gamma\cos\theta^*|}$$
*where $\gamma = m_1 / m_2$ and $\theta^*$ is the C-frame scattering angle.*

#### Solution
1. **Conservation of Particle Flux:**
   The number of particles scattered into a physical cone must be invariant under frame transformation:
   $$\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} \sin\theta\,d\theta = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \sin\theta^*\,d\theta^*$$
   $$\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \frac{\sin\theta^*}{\sin\theta} \left|\frac{d\theta^*}{d\theta}\right|$$
2. **Kinematic Angle Relationship:**
   $$\tan\theta = \frac{\sin\theta^*}{\cos\theta^* + \gamma}$$
   Squaring and using trig identities yields:
   $$\cos\theta = \frac{\cos\theta^* + \gamma}{\sqrt{1 + 2\gamma\cos\theta^* + \gamma^2}}$$
3. **Differentiating $\cos\theta$ with respect to $\cos\theta^*$:**
   $$\sin\theta\,d\theta = \frac{1 + \gamma\cos\theta^*}{(1 + 2\gamma\cos\theta^* + \gamma^2)^{3/2}} \sin\theta^*\,d\theta^*$$
4. **Inverting:**
   $$\mathbf{\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \frac{(1 + 2\gamma\cos\theta^* + \gamma^2)^{3/2}}{|1 + \gamma\cos\theta^*|}}$$
   $$\blacksquare$$

---

### Worked Example 9.10: Shadow Scattering and the Diffraction Limit
*In quantum mechanics, the total scattering cross section of a completely absorbing "black" sphere of radius $R$ at high energies is $\sigma_{\text{tot}} = 2\pi R^2$, exactly twice the classical geometric area $\pi R^2$. Explain this classical-quantum paradox using wave-particle duality and the optical theorem.*

#### Solution
1. **The Classical Expectation:**
   Classically, any projectile with $b \le R$ hits the black sphere and is absorbed ($\sigma_{\text{absorb}} = \pi R^2$), while any projectile with $b > R$ continues undisturbed. Thus, $\sigma_{\text{classical}} = \pi R^2$.
2. **The Wave Optics Resolution:**
   When a wave of wavelength $\lambda \ll R$ encounters an opaque circular obstacle, it casts a geometric shadow directly behind it. 
   - However, by Babinet's Principle and Huygens-Fresnel wave diffraction, the sharp edge of the obstacle removes a circular disc from the wavefront, causing diffracted waves to spread outwards into small angles $\theta \sim \lambda / R$.
3. **Diffraction Cross Section:**
   The amount of flux diffracted away into non-zero angles is mathematically identical to the diffraction pattern of a circular hole of radius $R$:
   $$\sigma_{\text{elastic}} = \sigma_{\text{diffraction}} = \pi R^2$$
4. **Total Cross Section:**
   $$\sigma_{\text{tot}} = \sigma_{\text{absorption}} + \sigma_{\text{elastic}} = \pi R^2 + \pi R^2 = \mathbf{2\pi R^2}$$
   In the classical limit $\hbar \to 0$ ($\lambda \to 0$), the diffracted forward peak becomes an infinitesimally narrow delta function around $\theta = 0$, making it experimentally undetectable unless measurements are taken within arcseconds of the beamline!

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 9.1:** Why does the total cross section $\sigma_{\text{tot}}$ for Rutherford scattering diverge to infinity, whereas for a hard sphere of radius $R$ it evaluates to a finite area $\pi R^2$?  
**Exercise 9.2:** Explain physically why the differential cross section for a hard sphere is completely independent of the scattering angle $\theta$ (isotropic).

### Tier 2: Quantitative Mechanics
**Exercise 9.3:** A beam of particles of energy $E = 10.0\text{ keV}$ scatters off a repulsive Coulomb potential $U(r) = \alpha / r$, where $\alpha = 1.44 \times 10^{-9}\text{ eV}\cdot\text{m}$. Find the impact parameter that produces a deflection of $60.0^\circ$.  
**Exercise 9.4:** Calculate the differential cross section $\frac{d\sigma}{d\Omega}$ at $\theta = 45.0^\circ$ for an alpha particle ($E = 7.70\text{ MeV}$) scattering off a platinum nucleus ($Z = 78$).

### Tier 3: Multi-Stage Dynamics
**Exercise 9.5:** A spacecraft approaches Mars ($M = 6.42 \times 10^{23}\text{ kg}$, $R_{\text{Mars}} = 3,390\text{ km}$) with $v_\infty = 4.50\text{ km/s}$. What is the minimum possible periapsis altitude if the spacecraft must not enter Mars' atmosphere ($h_{\text{atm}} = 120\text{ km}$), and what is the maximum deflection angle $\delta_{\max}$ achievable without hitting the atmosphere?  
**Exercise 9.6:** A target foil of aluminum ($Z = 13$, density $\rho = 2.70\text{ g/cm}^3$, atomic mass $27.0\text{ g/mol}$, thickness $2.00\text{ }\mu\text{m}$) is bombarded by a proton beam of flux $I_0 = 5.00 \times 10^{12}\text{ protons}/(\text{m}^2\cdot\text{s})$ at $E = 2.00\text{ MeV}$. Find the number of protons scattered per hour into an annular ring between $\theta = 29.0^\circ$ and $\theta = 31.0^\circ$.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 9.7:** Consider scattering off a rigid hemispherical bowl of radius $R$ facing the oncoming beam. If particles reflect specularly from the interior concave surface, determine the differential cross section $\frac{d\sigma}{d\Omega}(\theta)$.  
**Exercise 9.8:** Derive the differential cross section for an attractive Coulomb potential $U(r) = -k/r$ ($k > 0$) for unbound trajectories ($E > 0$), and show that it yields the identical functional form as repulsive Rutherford scattering.

### Tier 5: Olympiad / Research Challenge
**Exercise 9.9:** A particle scatters off a spherical delta-shell potential $V(r) = V_0 \delta(r - R)$ where $V_0 > 0$. Using classical mechanics, find the critical impact parameter $b_c$ below which particles penetrate the shell, and compute the total scattering cross section.  
**Exercise 9.10:** The Glory and Rainbow Scattering Phenomena: When particles scatter in a potential with an attractive well and repulsive core (such as Lennard-Jones molecular potentials), the deflection function $\theta(b)$ can develop a local extremum ($d\theta/db = 0$). Prove that at this impact parameter $b_r$, the classical differential cross section diverges as $( \theta - \theta_r )^{-1/2}$, and explain how wave mechanics regularizes this singularity (the Airy rainbow function).

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 9.1
The total cross section is $\sigma_{\text{tot}} = 2\pi \int_0^\pi \frac{d\sigma}{d\Omega}\sin\theta\,d\theta$.
- For a hard sphere of radius $R$, the force is zero everywhere for $r > R$. Any particle with impact parameter $b > R$ experiences zero force and passes undeflected ($\theta = 0$). Thus the integration domain in impact parameter space is strictly bounded: $b \in [0, R]$, giving $\sigma_{\text{tot}} = \int_0^R 2\pi b\,db = \pi R^2$.
- For Rutherford scattering, the Coulomb potential $U(r) \propto 1/r$ has an infinite range. No matter how large the impact parameter $b$, the particle experiences a non-zero transverse force and undergoes a small but finite deflection $\theta \approx \frac{kq_1q_2}{Eb} > 0$. Integrating out to $b \to \infty$ integrates non-zero deflection over an infinite area, causing $\sigma_{\text{tot}} \to \infty$.

---

### Solution to Exercise 9.2
For a hard sphere of radius $R$, the relationship between impact parameter $b$ and scattering angle $\theta$ is $b = R \cos(\theta/2)$.
The differential cross section is:
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{R\cos(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{R}{2}\sin(\theta/2)\right] = \frac{R^2}{4}$$
All trigonometric dependencies on $\theta$ cancel out identically because the surface normal of a sphere varies linearly with central angle. As a result, the incident planar beam flux is redistributed with uniform probability density over the entire $4\pi$ steradians of the unit sphere.

---

### Solution to Exercise 9.3
1. **Formula:** $b(\theta) = \frac{\alpha}{2E} \cot(\theta/2)$.
2. **Given:** $\alpha = 1.44 \times 10^{-9}\text{ eV}\cdot\text{m}$, $E = 10.0\text{ keV} = 10,000\text{ eV}$, $\theta = 60.0^\circ$.
3. **Compute:**
   $$\theta/2 = 30.0^\circ \implies \cot(30.0^\circ) = \sqrt{3} \approx 1.73205$$
   $$b = \frac{1.44 \times 10^{-9}\text{ eV}\cdot\text{m}}{2 \times 10,000\text{ eV}} \times 1.73205 = (7.20 \times 10^{-14}\text{ m}) \times 1.73205 \approx \mathbf{1.247 \times 10^{-13}\text{ m} = 124.7\text{ fm}}$$

---

### Solution to Exercise 9.4
1. **Given:**
   - Alpha particle: $q_1 = 2e$. Platinum: $Z = 78 \implies q_2 = 78e$.
   - $E = 7.70\text{ MeV} = 7.70 \times 10^6 \times 1.602 \times 10^{-19}\text{ J} = 1.2335 \times 10^{-12}\text{ J}$.
   - $\theta = 45.0^\circ \implies \theta/2 = 22.5^\circ$.
2. **Compute Characteristic Pre-factor:**
   $$\frac{k q_1 q_2}{4E} = \frac{(8.988 \times 10^9) \times (2 \times 78) \times (1.602 \times 10^{-19})^2}{4 \times (1.2335 \times 10^{-12})} = \frac{3.5985 \times 10^{-26}}{4.934 \times 10^{-12}} \approx 7.293 \times 10^{-15}\text{ m}$$
3. **Compute Differential Cross Section:**
   $$\sin(22.5^\circ) \approx 0.382683 \implies \sin^4(22.5^\circ) \approx (0.382683)^4 \approx 0.021448$$
   $$\frac{d\sigma}{d\Omega} = \frac{(7.293 \times 10^{-15})^2}{0.021448} = \frac{5.319 \times 10^{-29}}{0.021448} \approx \mathbf{2.48 \times 10^{-27}\text{ m}^2/\text{sr} = 24.8\text{ barns/sr}}$$

---

### Solution to Exercise 9.5
1. **Minimum Periapsis:**
   $$r_p = R_{\text{Mars}} + h_{\text{atm}} = 3,390 + 120 = 3,510\text{ km} = 3.510 \times 10^6\text{ m}$$
2. **Gravitational Parameter of Mars:**
   $$\mu = G M = (6.674 \times 10^{-11}) \times (6.42 \times 10^{23}) \approx 4.2847 \times 10^{13}\text{ m}^3/\text{s}^2$$
3. **Eccentricity at Minimum Altitude:**
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{\mu} = 1 + \frac{(3.510 \times 10^6) \times (4,500)^2}{4.2847 \times 10^{13}} = 1 + \frac{7.10775 \times 10^{13}}{4.2847 \times 10^{13}} = 1 + 1.6589 = 2.6589$$
4. **Maximum Deflection Angle:**
   $$\sin\left(\frac{\delta_{\max}}{2}\right) = \frac{1}{\epsilon} = \frac{1}{2.6589} \approx 0.3761$$
   $$\frac{\delta_{\max}}{2} = \arcsin(0.3761) \approx 22.09^\circ \implies \mathbf{\delta_{\max} \approx 44.2^\circ}$$

---

### Solution to Exercise 9.6
1. **Number Density of Target Nuclei:**
   $$n = \frac{\rho N_A}{M} = \frac{(2.70 \times 10^6\text{ g/m}^3) \times (6.022 \times 10^{23})}{27.0\text{ g/mol}} = 6.022 \times 10^{28}\text{ atoms/m}^3$$
2. **Areal Target Density:**
   $$n_{\text{area}} = n \times t = (6.022 \times 10^{28}) \times (2.00 \times 10^{-6}\text{ m}) = 1.2044 \times 10^{23}\text{ nuclei/m}^2$$
3. **Solid Angle of Annular Ring ($\theta = 30^\circ$, $d\theta = 2^\circ = 0.034907\text{ rad}$):**
   $$d\Omega = 2\pi \sin(30.0^\circ) d\theta = 2\pi (0.500) (0.034907) \approx 0.10966\text{ sr}$$
4. **Differential Cross Section at $30^\circ$:**
   - Protons on Al: $q_1 = e$, $q_2 = 13e$, $E = 2.00\text{ MeV} = 3.204 \times 10^{-13}\text{ J}$.
   - Pre-factor: $\frac{k q_1 q_2}{4E} = \frac{(8.988 \times 10^9)(13)(1.602 \times 10^{-19})^2}{4(3.204 \times 10^{-13})} \approx 2.342 \times 10^{-15}\text{ m}$.
   - $\sin^4(15^\circ) = (0.258819)^4 \approx 0.004487$.
   - $\frac{d\sigma}{d\Omega} = \frac{(2.342 \times 10^{-15})^2}{0.004487} \approx 1.222 \times 10^{-27}\text{ m}^2/\text{sr}$.
5. **Counts per Second:**
   $$\frac{dN}{dt} = I_0 \cdot n_{\text{area}} \cdot \left(\frac{d\sigma}{d\Omega}\right) \cdot d\Omega = (5.00 \times 10^{12}) \times (1.2044 \times 10^{23}) \times (1.222 \times 10^{-27}) \times (0.10966) \approx 80.7\text{ protons/s}$$
6. **Counts per Hour ($3600\text{ s}$):**
   $$N_{\text{hour}} = 80.7 \times 3600 \approx \mathbf{290,500\text{ protons/hour}}$$

---

### Solution to Exercise 9.7
For specular reflection inside a concave hemisphere, incoming parallel rays with impact parameter $b \le R$ strike the interior wall at an angle of incidence $\alpha$ with the normal where $\sin\alpha = b/R$. The reflected ray crosses the axis of symmetry, making a total deflection angle $\theta = 2\alpha$.
Thus:
$$\sin(\theta/2) = \frac{b}{R} \implies b = R \sin(\theta/2)$$
Differentiating:
$$\left|\frac{db}{d\theta}\right| = \frac{R}{2} \cos(\theta/2)$$
Differential cross section:
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{R\sin(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{R}{2}\cos(\theta/2)\right] = \mathbf{\frac{R^2}{4}}$$
The concave bowl also scatters isotropically into the forward reflection hemisphere!

---

### Solution to Exercise 9.8
For an attractive potential $U(r) = -k/r$, the trajectory is a hyperbola where the center of attraction is at the *interior* focus.
The hyperbolic asymptotes have the same angle relationship with the impact parameter:
$$b = \frac{k}{2E} \cot(\theta/2)$$
Because the differential cross section depends only on $b$, $\sin\theta$, and $|db/d\theta|$:
$$\left|\frac{db}{d\theta}\right| = \frac{k}{4E \sin^2(\theta/2)}$$
Substituting gives the exact same formula:
$$\mathbf{\frac{d\sigma}{d\Omega}(\theta) = \left(\frac{k}{4E}\right)^2 \frac{1}{\sin^4(\theta/2)}}$$
Classical Coulomb scattering is completely symmetric between attraction and repulsion!

---

### Solution to Exercise 9.9
1. Inside the shell ($r < R$), $V = 0$. On the shell, potential is a step barrier of height $V_0$.
2. For a particle with radial kinetic energy $E_{\text{rad}} = E(1 - b^2/R^2)$:
   - If $E_{\text{rad}} > V_0$, the particle penetrates the shell.
   - If $E_{\text{rad}} < V_0$, the particle reflects specularly from the exterior sphere $r = R$.
3. Critical impact parameter:
   $$E \left(1 - \frac{b_c^2}{R^2}\right) = V_0 \implies \mathbf{b_c = R \sqrt{1 - \frac{V_0}{E}}}$$
4. Total cross section for reflection:
   $$\sigma_{\text{reflect}} = \pi b_c^2 = \mathbf{\pi R^2 \left(1 - \frac{V_0}{E}\right)}$$

---

### Solution to Exercise 9.10
1. When $\theta(b)$ has a local extremum at $b = b_r$, a Taylor expansion gives:
   $$\theta(b) = \theta_r + \frac{1}{2}\theta''(b_r)(b - b_r)^2$$
   $$|b - b_r| = \sqrt{\frac{2}{|\theta''(b_r)|}} |\theta - \theta_r|^{1/2}$$
2. Differentiating:
   $$\left|\frac{db}{d\theta}\right| = \frac{1}{\sqrt{2 |\theta''(b_r)|}} |\theta - \theta_r|^{-1/2}$$
3. Substituting into $\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} |db/d\theta|$ yields:
   $$\mathbf{\frac{d\sigma}{d\Omega} \propto \frac{1}{\sqrt{|\theta - \theta_r|}} \to \infty}$$
4. **Regularization:** In wave mechanics, the ray caustic corresponds to a confluence of stationary phase points. Integrating the wave amplitude over the cubic phase wavefront replaces the infinite singularity with the smooth, oscillatory **Airy function** $\text{Ai}(x)$, which produces the supernumerary arcs of natural atmospheric rainbows!


---

# Chapter 10: Energy Partitioning and the Thermodynamics of Impact

> "Energy cannot be created or destroyed; it can only be transferred from one form to another, or degraded into disordered thermal motion."  
> — First Law of Thermodynamics

---

## 1. Introduction: The Disappearance of Mechanical Energy

Throughout elementary mechanics, collisions with coefficient of restitution $e < 1$ are labeled "inelastic," and textbook problems routinely conclude with a perfunctory line: *"Kinetic energy is lost."*

In physics, energy never vanishes. When two cars crash at a highway intersection, when a lead bullet buries itself in an oak block, or when an iron meteorite slams into the Siberian tundra at $20\text{ km/s}$, total energy is strictly conserved. What actually happens is a cascade of **thermodynamic and material degradation**: ordered, macroscopic kinetic energy is violently converted into microscopic, disordered internal energy:
- **Plastic Deformation Work:** Irreversible distortion of crystal lattices via dislocation glide and twin boundaries.
- **Acoustic Shock Waves:** Coherent compressional wavefronts traveling through the bulk solid.
- **Fracture Energy:** Breaking of chemical bonds to create new surface area.
- **Thermal Dissipation:** Local flash heating, frictional melting, and incandescence.

In this chapter, we bridge Newtonian impact mechanics with continuum mechanics, shock physics, and thermodynamics. We analyze the classic **ballistic pendulum**, derive the hydrodynamic penetration depth of high-speed jets, and examine the extreme thermodynamic regimes of hypervelocity cratering.

---

## 2. Microscopic Energy Channels During an Inelastic Impact

When two real bodies collide, the mechanical energy loss $\Delta K_{\text{loss}}$ identified in Chapter 6 partitions into four primary physical channels:

```
                      Total Kinetic Energy Loss: Delta K_loss
                                        |
      +--------------------+------------+------------+--------------------+
      |                    |                         |                    |
      v                    v                         v                    v
Plastic Work (W_p)   Thermal Energy (Q)      Acoustic Shock (E_wave)   Fracture (E_frac)
(Dislocation slip)   (Lattice vibrations)    (Radiated sound/stress)   (New surfaces)
   [~ 85 - 95%]         [~ 85 - 95%]                [~ 1 - 5%]            [< 1%]
```

### 2.1 The Taylor-Quinney Coefficient ($\beta$)

In 1934, G. I. Taylor and H. Quinney performed pioneering experiments measuring how much mechanical plastic work is converted directly into heat. The **Taylor-Quinney coefficient** $\beta$ is defined as:
$$\beta \equiv \frac{\Delta Q_{\text{thermal}}}{W_{\text{plastic}}}$$

For most structural metals (steel, aluminum, titanium, copper) under dynamic impact loading:
$$\beta \approx 0.90 \text{ to } 0.95$$

Between $90\%$ and $95\%$ of the mechanical work required to permanently deform the material ends up immediately as **heat**! The remaining $5\%$ to $10\%$ is stored elastically within the crystal lattice as the internal energy of residual stress fields surrounding dislocation tangles.

### 2.2 Dynamic Temperature Rise

If the collision occurs rapidly (as in ballistic impacts where $\Delta t < 10^{-3}\text{ s}$), there is insufficient time for heat to conduct away into the surrounding bulk. The process is locally **adiabatic**. The instantaneous temperature rise in the deformation zone is given by:
$$\Delta T \approx \frac{\beta \cdot \Delta K_{\text{loss}}}{m_{\text{zone}} c_p}$$
where $m_{\text{zone}}$ is the mass of the localized plastic zone and $c_p$ is the specific heat capacity. In hypervelocity impacts, $\Delta T$ readily exceeds the melting temperature of metals, creating molten ejecta spray!

---

## 3. The Ballistic Pendulum and Kinetic Energy Partitioning

Invented in 1742 by the English mathematician and military engineer Benjamin Robins, the **ballistic pendulum** revolutionized 18th-century exterior ballistics by enabling the first accurate measurements of musket ball muzzle velocities.

```
                  Ceiling Anchor
                       ||
                       || Suspension wires of length L
                       ||
                       \/
                   +--------+
      Bullet       | Wooden |
       (m) ------> | Block  | (M)
        v0         |        |
                   +--------+
                       |
                       | Swings up by height h (angle theta)
                       v
```

### 3.1 Two-Stage Analysis: The Momentum-Energy Boundary

The ballistic pendulum is the archetype of two distinct physical phases that must never be conflated:

1. **Phase 1: Inelastic Impact (Duration $\Delta t \sim 10^{-4}\text{ s}$):**
   - The bullet of mass $m$ penetrates the wooden block of mass $M$.
   - Because gravity is an external force of finite magnitude, during the infinitesimal impact duration $\Delta t \to 0$, the gravitational impulse $J_g = \int (m+M)g\,dt \to 0$.
   - **Horizontal momentum is conserved:**
     $$m v_0 = (m + M) V$$
     $$V = \frac{m}{m + M} v_0$$
   - **Mechanical kinetic energy is violently destroyed:**
     $$\Delta K_{\text{loss}} = \frac{1}{2}m v_0^2 - \frac{1}{2}(m + M)V^2$$

2. **Phase 2: Conservative Swing (Duration $t_{\text{swing}} \sim 1\text{ s}$):**
   - Now moving with initial speed $V$, the block-bullet composite swings upward like a simple pendulum against gravity.
   - Tension does no work ($T \perp \vec{v}$). Air resistance is negligible.
   - **Mechanical energy is strictly conserved:**
     $$\frac{1}{2}(m + M) V^2 = (m + M) g h$$
     $$V = \sqrt{2gh}$$
   - Where $h = L(1 - \cos\theta)$.

### 3.2 Deducing the Initial Muzzle Velocity

Equating the velocity $V$ from both stages:
$$\frac{m}{m + M} v_0 = \sqrt{2gh}$$

$$\mathbf{v_0 = \left(\frac{m + M}{m}\right) \sqrt{2gh} = \left(\frac{m + M}{m}\right) \sqrt{2gL(1 - \cos\theta)}}$$

### 3.3 The Kinetic Efficiency Paradox

What fraction of the bullet's original kinetic energy is converted into potential energy of the swinging pendulum?
$$\eta_K \equiv \frac{K_{\text{swing}}}{K_{\text{bullet}}} = \frac{\frac{1}{2}(m + M)V^2}{\frac{1}{2}m v_0^2} = \frac{(m + M) \left(\frac{m}{m+M} v_0\right)^2}{m v_0^2} = \mathbf{\frac{m}{m + M}}$$

In a typical experiment:
- Bullet mass $m = 10\text{ g} = 0.010\text{ kg}$.
- Pendulum block mass $M = 5.0\text{ kg}$.
$$\eta_K = \frac{0.010}{5.010} \approx 0.0020 = \mathbf{0.2\%}$$

**Over $99.8\%$ of the bullet's kinetic energy is converted into heat and wood splintering!** The ballistic pendulum works precisely *because* it captures the invariant momentum while absorbing almost all kinetic energy in destructive internal work.

---

## 4. Hypervelocity Impacts and Shock Wave Physics

When impact velocities exceed the sound speed of the colliding materials ($v_0 > c_s \approx 3\text{ to }6\text{ km/s}$)—as in meteoroid impacts, planetary accretion, or orbital debris collisions—stress waves outrun the elastic sound speed, forming violent **shock waves**.

```
                Unshocked target           Shock front (u_s)
            [ P0, rho0, E0, u0=0 ]  <======|====== [ P1, rho1, E1, u_p ] Shocked zone
```

### 4.1 The Rankine-Hugoniot Jump Conditions

Across the infinitesimal thickness of a shock front moving at shock speed $u_s$ that accelerates target material to particle velocity $u_p$:
1. **Conservation of Mass:**
   $$\rho_0 u_s = \rho_1 (u_s - u_p)$$
2. **Conservation of Momentum:**
   $$P_1 - P_0 = \rho_0 u_s u_p$$
3. **Conservation of Energy:**
   $$E_1 - E_0 = \frac{1}{2}(P_1 + P_0)\left(\frac{1}{\rho_0} - \frac{1}{\rho_1}\right)$$

At pressures exceeding hundreds of gigapascals ($P > 100\text{ GPa} = 1\text{ Mbar}$), the shear strength of solid rock or steel (typically $\sim 0.1\text{ to } 1\text{ GPa}$) is utterly negligible by comparison. Under these extreme conditions, **solids behave as compressible inviscid fluids**!

---

## 5. Hydrodynamic Penetration: The Birkhoff Jet Formula

During World War II, the American mathematician Garrett Birkhoff and colleagues analyzed the penetration of high-explosive anti-tank (HEAT) shaped-charge metal jets into steel armor.

```
       Metal Jet (rho_j, length L, speed v_j)
       =======>                               | Target Armor (rho_t)
       =======>                               |
                                              | Stagnation point S
```

### 5.1 Pressure Balance at the Stagnation Point

Let a long, continuous metal jet of density $\rho_j$ and length $L$ travel at speed $v_j$ into a target of density $\rho_t$. Let the penetration front advance into the target at speed $u$.
- In the reference frame of the moving penetration front (speed $u$):
  - Jet material approaches from the left at relative speed $(v_j - u)$.
  - Unpenetrated target approaches from the right at speed $u$.
- Applying Bernoulli's equation for hydrodynamic fluid flow at the stagnation interface $S$:
  $$\frac{1}{2} \rho_j (v_j - u)^2 = \frac{1}{2} \rho_t u^2$$

Taking the square root:
$$\sqrt{\rho_j}(v_j - u) = \sqrt{\rho_t}\,u$$
$$u = \frac{\sqrt{\rho_j}}{\sqrt{\rho_j} + \sqrt{\rho_t}} v_j$$

### 5.2 Total Penetration Depth ($P$)

The jet of length $L$ is consumed over a total duration:
$$\Delta t_{\text{jet}} = \frac{L}{v_j - u}$$
During this time, the penetration front advances by a distance $P = u\,\Delta t_{\text{jet}}$:
$$P = u \left(\frac{L}{v_j - u}\right) = L \left(\frac{u}{v_j - u}\right)$$

From the Bernoulli balance, $\frac{u}{v_j - u} = \sqrt{\frac{\rho_j}{\rho_t}}$.

Therefore:
$$\mathbf{P = L \sqrt{\frac{\rho_j}{\rho_t}}}$$

### 5.3 Consequences of the Birkhoff Formula

1. **Velocity Independence:** Notice that jet speed $v_j$ has cancelled out completely! Once the impact velocity is sufficiently high to enter the hydrodynamic regime ($v_j > 2-3\text{ km/s}$), the penetration depth depends **only on the length of the jet and the square root of the density ratio**!
2. **Dense Penetrators:** To maximize penetration, military engineers select ultra-dense metals for shaped-charge liners and kinetic armor penetrators:
   - Copper ($\rho \approx 8.96\text{ g/cm}^3$)
   - Tantalum ($\rho \approx 16.6\text{ g/cm}^3$)
   - Depleted Uranium ($\rho \approx 19.1\text{ g/cm}^3$)
   - Tungsten ($\rho \approx 19.3\text{ g/cm}^3$)
   A tungsten penetrator ($\rho_j = 19.3$) striking rolled homogeneous steel armor ($\rho_t = 7.85$) penetrates $P = L\sqrt{19.3 / 7.85} \approx 1.57\,L$, tunneling more than $1.5$ times its own length through solid steel!

---

## 6. Planetary Impact Cratering Mechanics

When an asteroid or comet impacts a planetary surface, the kinetic energy is so massive that the impactor vaporizes almost instantaneously upon shock decompression.

### 6.1 Why Craters Are Circular

A common misconception is that an asteroid hitting at an oblique angle ($45^\circ$) should carve an elongated, elliptical trench. In reality, over $95\%$ of all impact craters on the Moon, Mars, and Earth are **nearly perfect circles**!

Why? Because a hypervelocity impact is not a mechanical "plow." The kinetic energy $E_K = \frac{1}{2} m v^2$ at $v \approx 20\text{ km/s}$ is:
$$\frac{E_K}{m} = \frac{1}{2}(20,000)^2 = 2.0 \times 10^8\text{ J/kg} = 200\text{ MJ/kg}$$
For comparison, TNT releases $4.184\text{ MJ/kg}$. An asteroid moving at $20\text{ km/s}$ possesses **nearly 50 times more energy per kilogram than high-explosive TNT**!

Upon impact, this energy is released within milliseconds from a point-like source, generating a spherical hemispherical shock wave that detonates like an buried nuclear bomb. The crater is excavated by the expanding spherical shock, producing a circular cavity regardless of entry angle down to glancing trajectories ($< 10^\circ$).

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 10.1: Classical Ballistic Pendulum Bullet Speed
*A rifle fires a lead bullet of mass $m = 12.0\text{ g}$ into a ballistic pendulum wooden block of mass $M = 4.50\text{ kg}$ suspended by cords of length $L = 2.00\text{ m}$. The bullet embeds itself in the block, causing the pendulum to swing through an arc with maximum angular deflection $\theta = 18.0^\circ$. (Take $g = 9.80\text{ m/s}^2$). Compute: (a) the maximum vertical height $h$ reached by the pendulum, (b) the velocity $V$ of the composite system immediately after impact, (c) the muzzle velocity $v_0$ of the bullet, and (d) the percentage of kinetic energy lost.*

#### Solution
1. **Given:**
   - $m = 0.0120\text{ kg}$, $M = 4.50\text{ kg}$
   - $L = 2.00\text{ m}$, $\theta = 18.0^\circ$, $g = 9.80\text{ m/s}^2$
2. **Part (a): Vertical Height $h$:**
   $$h = L(1 - \cos\theta) = 2.00 \times [1 - \cos(18.0^\circ)] = 2.00 \times [1 - 0.951057] = 2.00 \times 0.048943 \approx \mathbf{0.09789\text{ m} = 9.79\text{ cm}}$$
3. **Part (b): Velocity $V$ Immediately After Impact:**
   $$V = \sqrt{2gh} = \sqrt{2 \times 9.80 \times 0.09789} = \sqrt{1.9186} \approx \mathbf{1.385\text{ m/s}}$$
4. **Part (c): Bullet Muzzle Velocity $v_0$:**
   $$m v_0 = (m + M) V \implies v_0 = \frac{m + M}{m} V$$
   $$\frac{m + M}{m} = \frac{0.0120 + 4.50}{0.0120} = \frac{4.5120}{0.0120} = 376.0$$
   $$v_0 = 376.0 \times 1.3851\text{ m/s} \approx \mathbf{520.8\text{ m/s}}$$
5. **Part (d): Kinetic Energy Loss:**
   - Initial KE of bullet:
     $$K_i = \frac{1}{2}(0.0120)(520.8)^2 = 0.0060 \times 271,233 \approx 1,627.4\text{ J}$$
   - Final KE of block+bullet:
     $$K_f = \frac{1}{2}(4.5120)(1.3851)^2 = 2.256 \times 1.9186 \approx 4.33\text{ J}$$
   - Energy lost:
     $$\% \text{lost} = \frac{1,627.4 - 4.33}{1,627.4} \times 100\% = \frac{1,623.1}{1,627.4} \times 100\% = \mathbf{99.73\%}$$

---

### Worked Example 10.2: Lead Bullet Melting on Steel Armor
*A pure lead bullet of mass $m = 15.0\text{ g}$ at initial temperature $T_0 = 25.0^\circ\text{C}$ strikes a rigid, immovable thick armor plate head-on at speed $v_0 = 420\text{ m/s}$ and stops completely ($e = 0$). Assume that $70.0\%$ of the lost kinetic energy is retained within the bullet as thermal heat, while $30.0\%$ dissipates into the armor plate. Lead properties: specific heat $c_p = 128\text{ J}/(\text{kg}\cdot^\circ\text{C})$, melting point $T_m = 327.5^\circ\text{C}$, latent heat of fusion $L_f = 2.45 \times 10^4\text{ J/kg}$. (a) Calculate the total kinetic energy of the bullet. (b) Determine whether the bullet reaches its melting point. (c) If it reaches the melting point, what percentage of the lead bullet melts into liquid?*

#### Solution
1. **Part (a): Total Kinetic Energy:**
   $$K_0 = \frac{1}{2} m v_0^2 = \frac{1}{2}(0.0150)(420)^2 = 0.0075 \times 176,400 = \mathbf{1,323.0\text{ J}}$$
2. **Thermal Heat Absorbed by Bullet:**
   $$Q_{\text{absorbed}} = 0.700 \times K_0 = 0.700 \times 1,323.0 = \mathbf{926.1\text{ J}}$$
3. **Part (b): Heat Required to Raise Bullet to Melting Point:**
   $$\Delta T = T_m - T_0 = 327.5 - 25.0 = 302.5^\circ\text{C}$$
   $$Q_{\text{warm}} = m c_p \Delta T = (0.0150\text{ kg}) \times (128\text{ J/kg}\cdot^\circ\text{C}) \times 302.5^\circ\text{C} = 1.92 \times 302.5 = \mathbf{580.8\text{ J}}$$
   - Since $Q_{\text{absorbed}} = 926.1\text{ J} > Q_{\text{warm}} = 580.8\text{ J}$, the bullet **definitely reaches its melting point**!
4. **Part (c): Latent Heat and Mass Melted:**
   - Remaining heat available for melting:
     $$Q_{\text{melt}} = Q_{\text{absorbed}} - Q_{\text{warm}} = 926.1 - 580.8 = 345.3\text{ J}$$
   - Heat required to completely melt the entire bullet:
     $$Q_{\text{full melt}} = m L_f = (0.0150) \times (2.45 \times 10^4) = 367.5\text{ J}$$
   - Fraction melted:
     $$\text{Fraction} = \frac{Q_{\text{melt}}}{Q_{\text{full melt}}} = \frac{345.3\text{ J}}{367.5\text{ J}} \approx 0.9396 = \mathbf{94.0\%}$$
   - Over **$94\%$ of the bullet liquefies into molten lead splatter** simply from the destruction of its own kinetic energy!

---

### Worked Example 10.3: Shaped-Charge Jet Penetration into Armor Steel
*A shaped-charge warhead generates a continuous copper jet ($\rho_j = 8,960\text{ kg/m}^3$) of effective length $L = 25.0\text{ cm}$ traveling at $v_j = 6,500\text{ m/s}$. The jet impacts a rolled homogeneous steel armor plate ($\rho_t = 7,850\text{ kg/m}^3$). (a) Compute the hydrodynamic penetration speed $u$ into the armor. (b) Calculate the total penetration depth $P$ according to Birkhoff's formula. (c) If a tungsten jet ($\rho_w = 19,300\text{ kg/m}^3$) of the same length were used, what would be the penetration depth?*

#### Solution
1. **Given:**
   - Copper density: $\rho_j = 8,960\text{ kg/m}^3 \implies \sqrt{\rho_j} = \sqrt{8,960} \approx 94.657$
   - Steel density: $\rho_t = 7,850\text{ kg/m}^3 \implies \sqrt{\rho_t} = \sqrt{7,850} \approx 88.600$
   - $L = 0.250\text{ m}$, $v_j = 6,500\text{ m/s}$
2. **Part (a): Penetration Front Speed $u$:**
   $$u = \frac{\sqrt{\rho_j}}{\sqrt{\rho_j} + \sqrt{\rho_t}} v_j = \frac{94.657}{94.657 + 88.600} \times 6,500 = \frac{94.657}{183.257} \times 6,500 \approx 0.5165 \times 6,500 \approx \mathbf{3,357.5\text{ m/s}}$$
3. **Part (b): Total Penetration Depth for Copper Jet:**
   $$P_{\text{Cu}} = L \sqrt{\frac{\rho_j}{\rho_t}} = 0.250 \times \frac{94.657}{88.600} = 0.250 \times 1.06836 \approx \mathbf{0.267\text{ m} = 26.7\text{ cm}}$$
4. **Part (c): Penetration Depth for Tungsten Jet:**
   - $\rho_w = 19,300\text{ kg/m}^3 \implies \sqrt{\rho_w} = \sqrt{19,300} \approx 138.924$
   $$P_{\text{W}} = L \sqrt{\frac{\rho_w}{\rho_t}} = 0.250 \times \frac{138.924}{88.600} = 0.250 \times 1.5680 \approx \mathbf{0.392\text{ m} = 39.2\text{ cm}}$$
   (Tungsten penetrates nearly $12.5\text{ cm}$ deeper through the steel armor!).

---

### Worked Example 10.4: Meteorite Atmospheric Reentry and Cratering Energy
*An iron meteorite of mass $M = 5.00 \times 10^7\text{ kg}$ (radius $\approx 11.5\text{ m}$) impacts Earth at speed $v_0 = 18.0\text{ km/s}$. (a) Calculate the kinetic energy of the meteorite in Joules. (b) Convert this energy into megatons of TNT equivalent ($1\text{ megaton TNT} = 4.184 \times 10^{15}\text{ J}$). (c) If $85.0\%$ of this energy goes into excavating a circular crater, and the excavation energy required per cubic meter of rock is $\mathcal{E}_{\text{rock}} = 2.00 \times 10^7\text{ J/m}^3$, estimate the excavated crater volume.*

#### Solution
1. **Part (a): Kinetic Energy:**
   $$v_0 = 18,000\text{ m/s}$$
   $$E_K = \frac{1}{2} M v_0^2 = \frac{1}{2}(5.00 \times 10^7)(18,000)^2 = 2.50 \times 10^7 \times 3.24 \times 10^8 = \mathbf{8.10 \times 10^{15}\text{ J}}$$
2. **Part (b): Megatons of TNT Equivalent:**
   $$E_{\text{megatons}} = \frac{8.10 \times 10^{15}\text{ J}}{4.184 \times 10^{15}\text{ J/Mton}} \approx \mathbf{1.936\text{ Megatons of TNT}}$$
   (Nearly 130 times the energy of the Hiroshima atomic bomb!).
3. **Part (c): Crater Excavation Volume:**
   - Energy available for excavation:
     $$E_{\text{crater}} = 0.850 \times (8.10 \times 10^{15}\text{ J}) = 6.885 \times 10^{15}\text{ J}$$
   - Volume excavated:
     $$V_{\text{crater}} = \frac{E_{\text{crater}}}{\mathcal{E}_{\text{rock}}} = \frac{6.885 \times 10^{15}\text{ J}}{2.00 \times 10^7\text{ J/m}^3} = \mathbf{3.44 \times 10^8\text{ m}^3}$$
   - If modeled as a parabolic bowl with diameter $D$ and depth $d = D/5$:
     $$V = \frac{1}{2}\pi \left(\frac{D}{2}\right)^2 d = \frac{\pi D^3}{40} \implies D = \left(\frac{40 V}{\pi}\right)^{1/3} = \left(\frac{40 \times 3.44 \times 10^8}{3.14159}\right)^{1/3} \approx (4.38 \times 10^9)^{1/3} \approx \mathbf{1,636\text{ m} \approx 1.64\text{ km}}$$
   (Directly matches the scale of the famous Barringer Meteor Crater in Arizona!).

---

### Worked Example 10.5: Hugoniot Shock Pressure Calculation in Aluminum
*A flyer plate of 6061-T6 aluminum strikes a stationary target of the identical aluminum alloy at impact velocity $v_{\text{imp}} = 2.00\text{ km/s}$. The initial density of aluminum is $\rho_0 = 2,700\text{ kg/m}^3$. The shock velocity $u_s$ is related to particle velocity $u_p$ by the linear Hugoniot relation $u_s = c_0 + s u_p$, where $c_0 = 5.35\text{ km/s}$ and $s = 1.34$. Calculate: (a) the particle velocity $u_p$ behind the shock, (b) the shock propagation speed $u_s$, and (c) the peak shock pressure $P_1$ in Gigapascals.*

#### Solution
1. **Part (a): Particle Velocity by Symmetry:**
   - For identical materials colliding symmetrically:
     $$u_p = \frac{v_{\text{imp}}}{2} = \frac{2,000\text{ m/s}}{2} = \mathbf{1,000\text{ m/s} = 1.00\text{ km/s}}$$
2. **Part (b): Shock Speed $u_s$:**
   $$u_s = c_0 + s u_p = 5.35\text{ km/s} + (1.34)(1.00\text{ km/s}) = 5.35 + 1.34 = \mathbf{6.69\text{ km/s} = 6,690\text{ m/s}}$$
3. **Part (c): Peak Shock Pressure $P_1$:**
   - Hugoniot momentum jump condition ($P_0 \approx 0$ compared to GPa range):
     $$P_1 = \rho_0 u_s u_p = (2,700\text{ kg/m}^3) \times (6,690\text{ m/s}) \times (1,000\text{ m/s})$$
     $$P_1 = 1.8063 \times 10^{10}\text{ Pa} = \mathbf{18.06\text{ GPa}}$$
   (Over 180,000 atmospheres of pressure!).

---

### Worked Example 10.6: Adiabatic Shear Band Local Flash Temperature
*In a high-speed machining process, a steel chip undergoes severe plastic shear deformation. The shear yield stress is $\tau_y = 600\text{ MPa}$, and the plastic shear strain inside an adiabatic shear band is $\gamma = 4.0$. If the steel has density $\rho = 7,850\text{ kg/m}^3$ and specific heat $c_p = 460\text{ J}/(\text{kg}\cdot^\circ\text{C})$, and $90.0\%$ of the plastic work is converted into heat ($\beta = 0.90$), find the adiabatic temperature rise $\Delta T$.*

#### Solution
1. **Volumetric Plastic Work:**
   $$w_p = \int \tau_y\,d\gamma = \tau_y \gamma = (600 \times 10^6\text{ Pa}) \times 4.0 = \mathbf{2.40 \times 10^9\text{ J/m}^3}$$
2. **Volumetric Heat Generated:**
   $$q_v = \beta w_p = 0.90 \times (2.40 \times 10^9) = \mathbf{2.16 \times 10^9\text{ J/m}^3}$$
3. **Volumetric Heat Capacity:**
   $$C_v = \rho c_p = 7,850 \times 460 = 3.611 \times 10^6\text{ J}/(\text{m}^3\cdot^\circ\text{C})$$
4. **Adiabatic Temperature Rise:**
   $$\Delta T = \frac{q_v}{C_v} = \frac{2.16 \times 10^9}{3.611 \times 10^6} \approx \mathbf{598.2^\circ\text{C}}$$
   If initial ambient temperature was $20^\circ\text{C}$, the material in the shear band instantly jumps to over $618^\circ\text{C}$, causing severe thermal softening!

---

### Worked Example 10.7: Automotive Frontal Crash Energy Dissipation
*A passenger vehicle of mass $M = 1,800\text{ kg}$ traveling at $v_0 = 64.0\text{ km/h}$ ($17.78\text{ m/s}$) impacts a rigid concrete barrier head-on ($e = 0$). The vehicle's front crumple zone collapses progressively over a stroke distance $d = 0.750\text{ m}$. (a) Calculate the total kinetic energy that must be dissipated. (b) Determine the average crash deceleration $a_{\text{avg}}$ in $\text{m/s}^2$ and in units of $g$. (c) Find the average dynamic crushing force $F_{\text{crush}}$ exerted by the crumple zone.*

#### Solution
1. **Part (a): Kinetic Energy:**
   $$K_0 = \frac{1}{2} M v_0^2 = \frac{1}{2}(1,800)(17.78)^2 = 900 \times 316.13 \approx \mathbf{284,500\text{ J} = 284.5\text{ kJ}}$$
2. **Part (b): Deceleration:**
   - Using kinematic relation $v^2 = v_0^2 - 2 a d = 0$:
     $$a_{\text{avg}} = \frac{v_0^2}{2d} = \frac{(17.78)^2}{2 \times 0.750} = \frac{316.13}{1.500} \approx \mathbf{210.75\text{ m/s}^2}$$
   - In units of Earth gravity ($g = 9.80\text{ m/s}^2$):
     $$a_g = \frac{210.75}{9.80} \approx \mathbf{21.5\text{ g}}$$
3. **Part (c): Average Crushing Force:**
   $$F_{\text{crush}} = M a_{\text{avg}} = 1,800 \times 210.75 = \mathbf{379,350\text{ N} \approx 379.4\text{ kN}}$$
   (Work-energy check: $W = F d = 379,350 \times 0.750 = 284,512\text{ J} \approx K_0$).

---

### Worked Example 10.8: Fracture Surface Energy in Impact Fragmentation
*A brittle glass sphere of radius $R_0 = 5.00\text{ cm}$ falls onto a hard anvil and shatters completely into $N = 1.00 \times 10^6$ identical tiny spherical fragments. The surface energy of glass (energy needed to create new surface area by breaking covalent bonds) is $\gamma_{\text{surface}} = 0.300\text{ J/m}^2$. Calculate: (a) the radius $r_f$ of each fragment, (b) the total surface area created, and (c) the total energy absorbed purely by chemical bond cleavage.*

#### Solution
1. **Part (a): Fragment Radius:**
   - Total volume is conserved:
     $$V_{\text{total}} = \frac{4}{3}\pi R_0^3 = N \left(\frac{4}{3}\pi r_f^3\right) \implies r_f = \frac{R_0}{N^{1/3}}$$
     $$N^{1/3} = (1.00 \times 10^6)^{1/3} = 100$$
     $$r_f = \frac{0.0500\text{ m}}{100} = \mathbf{5.00 \times 10^{-4}\text{ m} = 0.500\text{ mm}}$$
2. **Part (b): Surface Area Created:**
   - Initial surface area:
     $$A_0 = 4\pi R_0^2 = 4\pi (0.050)^2 = 4\pi \times 0.0025 = 0.010\pi \approx 0.03142\text{ m}^2$$
   - Total final surface area of $10^6$ fragments:
     $$A_f = N (4\pi r_f^2) = 10^6 \times 4\pi (5.00 \times 10^{-4})^2 = 10^6 \times 4\pi \times (2.50 \times 10^{-7}) = 1.00\pi \approx 3.14159\text{ m}^2$$
   - New surface area created:
     $$\Delta A = A_f - A_0 = 3.14159 - 0.03142 = \mathbf{3.110\text{ m}^2}$$
3. **Part (c): Fracture Energy:**
   $$E_{\text{fracture}} = \gamma_{\text{surface}} \Delta A = (0.300\text{ J/m}^2) \times (3.110\text{ m}^2) = \mathbf{0.933\text{ J}}$$
4. **Physical Insight:**
   Notice how tiny this is! Less than $1\text{ Joule}$ is needed to smash the glass into a million pieces. The vast majority of impact kinetic energy goes into acoustic sound and thermal vibrations, with surface fracture absorbing less than $0.1\%$!

---

### Worked Example 10.9: Hydrodynamic Jet with Unequal Densities
*A shaped-charge liner made of depleted uranium ($\rho_j = 19,100\text{ kg/m}^3$) of length $L = 30.0\text{ cm}$ strikes a target composed of granite rock ($\rho_t = 2,650\text{ kg/m}^3$). Calculate the theoretical hydrodynamic penetration depth in the rock.*

#### Solution
1. **Given:**
   - $\rho_j = 19,100\text{ kg/m}^3$
   - $\rho_t = 2,650\text{ kg/m}^3$
   - $L = 0.300\text{ m}$
2. **Density Ratio:**
   $$\frac{\rho_j}{\rho_t} = \frac{19,100}{2,650} \approx 7.2075$$
   $$\sqrt{\frac{\rho_j}{\rho_t}} = \sqrt{7.2075} \approx 2.6847$$
3. **Penetration Depth:**
   $$P = L \sqrt{\frac{\rho_j}{\rho_t}} = 0.300 \times 2.6847 \approx \mathbf{0.8054\text{ m} = 80.5\text{ cm}}$$
   The uranium jet tunnels over $80\text{ cm}$ into solid granite—more than $2.68$ times its own length!

---

### Worked Example 10.10: Acoustic Energy Radiated by Bouncing Steel Spheres
*Two large steel spheres of radius $R = 10.0\text{ cm}$ and mass $m = 32.9\text{ kg}$ collide elastically at relative speed $v = 1.00\text{ m/s}$. According to Hunter's acoustic radiation theory for Hertzian impacts, the total fraction of kinetic energy radiated away as acoustic sound waves is:*
$$\frac{\Delta E_{\text{acoustic}}}{K} \approx 0.057 \left(\frac{v}{c_0}\right)^{3/5}$$
*where $c_0 = 5,000\text{ m/s}$ is the longitudinal sound speed in steel. (a) Calculate the acoustic energy fraction. (b) Calculate the total acoustic energy radiated in Joules.*

#### Solution
1. **Part (a): Acoustic Energy Fraction:**
   $$\frac{v}{c_0} = \frac{1.00\text{ m/s}}{5,000\text{ m/s}} = 2.00 \times 10^{-4}$$
   $$\left(2.00 \times 10^{-4}\right)^{3/5} = \left[(2.00 \times 10^{-4})^3\right]^{1/5} = (8.00 \times 10^{-12})^{0.2} \approx 0.006085$$
   $$\frac{\Delta E_{\text{acoustic}}}{K} = 0.057 \times 0.006085 \approx \mathbf{3.47 \times 10^{-4} = 0.0347\%}$$
2. **Part (b): Total Acoustic Energy Radiated:**
   - Total initial kinetic energy (in C-frame with each sphere moving at $0.50\text{ m/s}$):
     $$K = 2 \times \left[\frac{1}{2}(32.9)(0.50)^2\right] = 32.9 \times 0.25 = 8.225\text{ J}$$
   - Energy radiated:
     $$\Delta E_{\text{acoustic}} = (3.47 \times 10^{-4}) \times 8.225\text{ J} \approx \mathbf{2.85 \times 10^{-3}\text{ J} = 2.85\text{ mJ}}$$
3. **Conclusion:**
   Even though the loud metallic "CLANG!" of colliding steel spheres sounds deafening to human ears, it accounts for less than $0.04\%$ of the total collision energy! The human ear is sensitive down to $10^{-12}\text{ W/m}^2$, making minuscule mechanical acoustic losses sound intensely loud.

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 10.1:** Why does an automobile crash structure designed to crush plastically protect passengers far better than an ultra-rigid steel cage that does not deform at all during a collision?  
**Exercise 10.2:** In a completely inelastic collision between two identical clay balls moving toward each other at equal speeds, what happens to their initial kinetic energy? State the thermodynamic form it takes.

### Tier 2: Quantitative Mechanics
**Exercise 10.3:** A ballistic pendulum with a block of mass $M = 2.40\text{ kg}$ suspended by a $1.20\text{ m}$ cord is struck by a bullet of mass $m = 8.00\text{ g}$. The block swings to a maximum height $h = 5.00\text{ cm}$. Find: (a) the muzzle velocity of the bullet, and (b) the mechanical energy lost during penetration.  
**Exercise 10.4:** A $2.00\text{ kg}$ lead block at $20.0^\circ\text{C}$ is dropped from a height $H = 50.0\text{ m}$ onto an insulated floor ($e = 0$). Assuming all dissipated energy remains in the lead ($c_p = 128\text{ J}/(\text{kg}\cdot^\circ\text{C})$), calculate the temperature increase $\Delta T$ of the block.

### Tier 3: Multi-Stage Dynamics
**Exercise 10.5:** A shaped-charge weapon shoots a copper jet ($\rho_j = 8,960\text{ kg/m}^3$) of length $L = 20.0\text{ cm}$ against composite ceramic-steel armor consisting of a $10.0\text{ cm}$ faceplate of alumina ceramic ($\rho_{\text{alumina}} = 3,900\text{ kg/m}^3$) backed by steel ($\rho_{\text{steel}} = 7,850\text{ kg/m}^3$). Calculate the residual length of the jet after perforating the alumina faceplate, and find how far it penetrates into the steel backing.  
**Exercise 10.6:** An asteroid of diameter $D = 50.0\text{ m}$ and density $\rho = 3,000\text{ kg/m}^3$ strikes Earth at $v = 20.0\text{ km/s}$. Compute its kinetic energy in petajoules ($10^{15}\text{ J}$) and compare it with the 1908 Tunguska event ($\approx 15\text{ Megatons of TNT}$).

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 10.7:** A high-speed copper projectile ($c_p = 385\text{ J}/(\text{kg}\cdot^\circ\text{C})$) impacts an armored wall. What is the minimum impact speed $v_{\min}$ required to raise its temperature by $400^\circ\text{C}$, assuming $80.0\%$ of its initial kinetic energy is converted into internal thermal heat of the projectile?  
**Exercise 10.8:** Derive the Rankine-Hugoniot energy jump condition $E_1 - E_0 = \frac{1}{2}(P_1 + P_0)(V_0 - V_1)$ (where $V = 1/\rho$ is specific volume) directly from the mass and momentum jump conditions across a steady planar shock front.

### Tier 5: Olympiad / Research Challenge
**Exercise 10.9:** The Hydrodynamic Stagnation Jet: If a hypervelocity jet has a linear velocity gradient along its length (the jet tip travels at $v_{\text{tip}} = 8.0\text{ km/s}$ while the tail travels at $v_{\text{tail}} = 2.0\text{ km/s}$), derive an integral expression for the total penetration depth into a target of density $\rho_t$ and evaluate it analytically for a jet of initial length $L_0$ and density $\rho_j$.  
**Exercise 10.10:** Nuclear Impact Vaporization: When an asteroid strikes a planet at $v_0 = 35.0\text{ km/s}$, the shock pressure reaches several terapascals ($10^{12}\text{ Pa}$). Using the Mie-Grüneisen equation of state, prove that upon complete isentropic release (decompression to zero pressure), the internal entropy created by the irreversible shock exceeds the entropy of vaporization, causing the entire impactor to undergo explosive phase transition into a supercritical ionized gas bubble.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 10.1
By the Work-Energy Theorem and Impulse-Momentum Theorem:
- In a rigid vehicle that does not deform ($d \to 0$), the deceleration distance is microscopic, causing the impact duration $\Delta t$ to be extremely small ($< 10\text{ ms}$). Consequently, the deceleration $a = v^2 / (2d)$ and peak impact forces $F = m a$ reach catastrophic levels ($> 100\text{ g}$), causing fatal internal organ trauma, aorta rupture, and basilar skull fractures to occupants.
- A controlled crumple zone deforms plastically over $0.6\text{ to }1.0\text{ meter}$, absorbing the vehicle's kinetic energy as plastic deformation work ($\int F_{\text{crush}} dx = \Delta K$). This extends the deceleration time $\Delta t$ to $80-120\text{ ms}$, capping the maximum acceleration experienced by the passenger compartment to survivable human limits ($< 20-25\text{ g}$).

---

### Solution to Exercise 10.2
In a completely inelastic head-on collision between two identical clay balls with equal and opposite initial velocities ($\vec{v}_1 = v\hat{i}, \vec{v}_2 = -v\hat{i}$):
1. By conservation of momentum: $\vec{P}_{\text{total}} = m(v\hat{i}) + m(-v\hat{i}) = \vec{0} \implies$ the balls come to a dead stop ($V_f = 0$).
2. Total initial mechanical kinetic energy: $K_i = \frac{1}{2}m v^2 + \frac{1}{2}m v^2 = m v^2$.
3. All $100\%$ of this kinetic energy is converted into microscopic **internal thermal energy**: irreversible plastic shear work of the clay platelets and random thermal vibrations of atoms ($Q = m v^2$). The clay balls will be physically warm to the touch!

---

### Solution to Exercise 10.3
1. **Pendulum Speed Immediately After Impact:**
   $$V = \sqrt{2gh} = \sqrt{2 \times 9.80 \times 0.0500} = \sqrt{0.980} \approx 0.98995\text{ m/s}$$
2. **Part (a): Bullet Muzzle Velocity:**
   - $m = 0.00800\text{ kg}$, $M = 2.40\text{ kg} \implies m + M = 2.408\text{ kg}$.
   $$v_0 = \frac{m + M}{m} V = \frac{2.408}{0.00800} \times 0.98995 = 301.0 \times 0.98995 \approx \mathbf{297.97\text{ m/s} \approx 298.0\text{ m/s}}$$
3. **Part (b): Mechanical Energy Lost:**
   - $K_i = \frac{1}{2}(0.00800)(297.97)^2 \approx 0.0040 \times 88,788 \approx 355.15\text{ J}$.
   - $K_f = \frac{1}{2}(2.408)(0.98995)^2 \approx 1.204 \times 0.980 \approx 1.18\text{ J}$.
   - Energy lost:
     $$\Delta K_{\text{loss}} = 355.15 - 1.18 = \mathbf{353.97\text{ J} \approx 354.0\text{ J}}$$

---

### Solution to Exercise 10.4
1. **Potential Energy Lost:**
   $$E_{\text{pot}} = m g H = (2.00\text{ kg}) \times (9.80\text{ m/s}^2) \times (50.0\text{ m}) = 980.0\text{ J}$$
2. **Thermal Heat Conversion:**
   $$Q = 980.0\text{ J}$$
3. **Temperature Rise:**
   $$Q = m c_p \Delta T \implies \Delta T = \frac{Q}{m c_p} = \frac{980.0\text{ J}}{(2.00\text{ kg}) \times (128\text{ J/kg}\cdot^\circ\text{C})} = \frac{980.0}{256.0} \approx \mathbf{3.83^\circ\text{C}}$$

---

### Solution to Exercise 10.5
1. **Perforation of Alumina Faceplate ($d_1 = 0.100\text{ m}$):**
   - Jet length consumed to penetrate distance $d_1$:
     $$d_1 = L_{\text{consumed}} \sqrt{\frac{\rho_j}{\rho_{\text{alumina}}}} \implies L_{\text{consumed}} = d_1 \sqrt{\frac{\rho_{\text{alumina}}}{\rho_j}}$$
     $$L_{\text{consumed}} = 0.100 \times \sqrt{\frac{3,900}{8,960}} = 0.100 \times \sqrt{0.43527} = 0.100 \times 0.65975 \approx 0.0660\text{ m} = 6.60\text{ cm}$$
2. **Residual Length of Copper Jet:**
   $$L_{\text{residual}} = L_0 - L_{\text{consumed}} = 20.0 - 6.60 = \mathbf{13.40\text{ cm} = 0.1340\text{ m}}$$
3. **Penetration into Steel Backing:**
   $$P_{\text{steel}} = L_{\text{residual}} \sqrt{\frac{\rho_j}{\rho_{\text{steel}}}} = 0.1340 \times \sqrt{\frac{8,960}{7,850}} = 0.1340 \times \sqrt{1.1414} = 0.1340 \times 1.06836 \approx \mathbf{0.1432\text{ m} = 14.32\text{ cm}}$$

---

### Solution to Exercise 10.6
1. **Asteroid Mass:**
   - Radius $R = 25.0\text{ m}$.
   - Volume: $V = \frac{4}{3}\pi R^3 = \frac{4}{3}\pi (25.0)^3 \approx 65,450\text{ m}^3$.
   - Mass: $M = \rho V = 3,000 \times 65,450 \approx 1.9635 \times 10^8\text{ kg}$.
2. **Kinetic Energy:**
   $$E_K = \frac{1}{2} M v^2 = \frac{1}{2}(1.9635 \times 10^8)(20,000)^2 = 0.98175 \times 10^8 \times 4.0 \times 10^8 \approx \mathbf{3.927 \times 10^{16}\text{ J} = 39.27\text{ PJ}}$$
3. **TNT Megaton Equivalent:**
   $$E_{\text{Mton}} = \frac{3.927 \times 10^{16}\text{ J}}{4.184 \times 10^{15}\text{ J/Mton}} \approx \mathbf{9.39\text{ Megatons of TNT}}$$
   (Slightly below the estimated $10-15\text{ Mton}$ Tunguska impact of 1908).

---

### Solution to Exercise 10.7
1. **Thermal Heat Required per Kilogram:**
   $$q = c_p \Delta T = (385\text{ J/kg}\cdot^\circ\text{C}) \times 400^\circ\text{C} = 154,000\text{ J/kg}$$
2. **Energy Balance:**
   - Kinetic energy per kilogram: $\frac{1}{2} v^2$.
   - Heat absorbed: $0.800 \times \left(\frac{1}{2} v^2\right) = 0.400 v^2$.
   $$0.400 v^2 = 154,000 \implies v^2 = \frac{154,000}{0.400} = 385,000\text{ m}^2/\text{s}^2$$
   $$v_{\min} = \sqrt{385,000} \approx \mathbf{620.5\text{ m/s}}$$

---

### Solution to Exercise 10.8
1. In the frame where the shock is at rest:
   - Mass conservation: $\rho_0 u_0 = \rho_1 u_1 \equiv j$ (mass flux).
     Using specific volume $V = 1/\rho$: $u_0 = j V_0$ and $u_1 = j V_1$.
   - Momentum conservation:
     $$P_0 + \rho_0 u_0^2 = P_1 + \rho_1 u_1^2 \implies P_1 - P_0 = j^2 (V_0 - V_1)$$
   - Energy conservation (enthalpy flux):
     $$E_0 + P_0 V_0 + \frac{1}{2} u_0^2 = E_1 + P_1 V_1 + \frac{1}{2} u_1^2$$
2. Rearranging energy:
   $$E_1 - E_0 = P_0 V_0 - P_1 V_1 + \frac{1}{2}(u_0^2 - u_1^2)$$
   Substitute $u_0^2 - u_1^2 = j^2(V_0^2 - V_1^2) = j^2(V_0 - V_1)(V_0 + V_1)$:
   $$u_0^2 - u_1^2 = (P_1 - P_0)(V_0 + V_1)$$
3. Combine terms:
   $$E_1 - E_0 = P_0 V_0 - P_1 V_1 + \frac{1}{2}(P_1 V_0 + P_1 V_1 - P_0 V_0 - P_0 V_1)$$
   $$E_1 - E_0 = \frac{1}{2} P_1 V_0 - \frac{1}{2} P_1 V_1 + \frac{1}{2} P_0 V_0 - \frac{1}{2} P_0 V_1 = \mathbf{\frac{1}{2}(P_1 + P_0)(V_0 - V_1)}$$
   $$\blacksquare$$

---

### Solution to Exercise 10.9
1. For a stretching jet with variable velocity profile $v(z)$ along its length $z \in [0, L_0]$:
   - The penetration speed of each element is $u(z) = \frac{\gamma}{1 + \gamma} v(z)$, where $\gamma = \sqrt{\rho_j / \rho_t}$.
   - The element of jet $dz$ contributes an incremental penetration $dP = \gamma\,dz$.
2. Integrating over the entire length of the stretching jet from tail to tip:
   $$P_{\text{total}} = \int_0^{L_0} \sqrt{\frac{\rho_j}{\rho_t}} dz = \mathbf{L_0 \sqrt{\frac{\rho_j}{\rho_t}}}$$
   Remarkably, as long as each element reaches the target before the penetration cavity closes, the total hydrodynamic penetration remains strictly $L_0 \sqrt{\rho_j / \rho_t}$!

---

### Solution to Exercise 10.10
1. Specific kinetic energy at $v_0 = 35\text{ km/s}$:
   $$e_k = \frac{1}{2}(35,000)^2 = 6.125 \times 10^8\text{ J/kg} \approx 612.5\text{ MJ/kg}$$
2. Peak Hugoniot shock pressure reaches $P_1 > 2\text{ TPa}$.
3. The shock compression is non-isentropic (produces massive irreversible entropy jump $\Delta S = \int \frac{T dS}{T} > 0$).
4. When the shock reflects from free surfaces, rarefaction waves decompress the material back to $P = 0$.
5. Because the decompression path follows the high-entropy isentrope, the residual internal energy $E_{\text{waste}}$ after reaching zero pressure far exceeds the enthalpy of vaporization of rock ($\sim 13\text{ MJ/kg}$). The entire impactor instantaneously flashes into a superheated expanding plasma fireball!


---

# Chapter 11: Computational Impulse Resolution and Contact Solvers

> "To the theoretical physicist, a collision is an infinitesimal boundary between past and future states. To the simulation engine architect, it is a discrete linear complementarity problem subject to penetration constraints, unilateral impulses, and numerical stability bounds."  
> — Principles of Modern Physics Simulation

---

## 1. Introduction: From Continuous Physics to Discrete Engines

Throughout the previous ten chapters, our mathematical formulations operated in the continuum of time: forces integrated seamlessly over differentials $dt$, velocities updated instantaneously upon impact, and surfaces interacted with exact geometric precision.

However, when programming interactive physics simulators, video game engines (such as Box2D, Bullet, PhysX, or Havok), or robotics simulators (such as MuJoCo or Drake), the computer cannot integrate continuous time. Instead, the simulation advances in **discrete temporal steps** $\Delta t$ (typically $\Delta t = 1/60\text{ s} \approx 16.67\text{ ms}$ or $\Delta t = 1/120\text{ s} \approx 8.33\text{ ms}$).

This temporal discretization introduces profound computational challenges:
1. **Interpenetration (Sinking):** Bodies moving in discrete position jumps step past one another between frames, overlapping by a finite penetration depth $d > 0$.
2. **Tunneling:** High-speed bullets pass entirely through thin walls in a single time-step without any collision being detected.
3. **Simultaneous Multi-Body Contradictions:** When five billiard balls or a stack of resting boxes touch at the same instant, standard two-body formulas fail because impulses propagate through the entire contact graph simultaneously.
4. **Energy Injection (Numerical Jitter):** Naive velocity or position adjustments violate conservation laws, pumping spurious energy into the system and causing resting objects to violently explode apart.

To overcome these hurdles, modern computational mechanics employs **Impulse-Based Contact Solvers**. In this chapter, we derive the exact equations used by production physics engines to compute collision impulses, apply Coulomb friction constraints, stabilize penetration drift via Baumgarte stabilization, and solve complex multi-body contact networks using iterative Sequential Impulses.

---

## 2. The Architecture of a Modern Physics Engine

The execution loop of a real-time rigid body engine executes a multi-stage pipeline each frame:

```
  +-------------------------------------------------------------+
  | 1. Numerical Integration: Integrate External Forces         |
  |    v(t + dt) = v(t) + (F_ext / m) * dt                      |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 2. Broadphase Collision Detection                           |
  |    Identify potential colliding pairs using Bounding Boxes   |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 3. Narrowphase Collision Detection                          |
  |    Compute exact contact manifold: normal n, penetration d  |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 4. Velocity Contact Solver (Sequential Impulses)           |
  |    Iteratively solve normal impulses J_n & friction J_t     |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 5. Position Integration & Baumgarte Stabilization           |
  |    x(t + dt) = x(t) + v(t + dt) * dt                        |
  +-------------------------------------------------------------+
```

---

## 3. Derivation of the Single-Point Normal Impulse Scalar ($J_n$)

Consider two rigid bodies, Body 1 and Body 2, with masses $m_1, m_2$ and velocities $\vec{v}_1, \vec{v}_2$. Let them collide at a contact point with unit normal $\hat{n}$ pointing from Body 1 to Body 2.

```
                  Body 1 (m1, v1)        Body 2 (m2, v2)
                      (  O1  )              (  O2  )
                         \                      /
                          \                    /
                           \      Contact     /
                            \        *       /
                             +-------|------+
                                     |
                                     v Normal n (points 1 -> 2)
```

### 3.1 Relative Contact Velocity

Define the **relative velocity** of Body 1 with respect to Body 2:
$$\vec{v}_{\text{rel}} \equiv \vec{v}_1 - \vec{v}_2$$

The relative velocity component along the normal line of impact $\hat{n}$ is:
$$v_n \equiv \vec{v}_{\text{rel}} \cdot \hat{n} = (\vec{v}_1 - \vec{v}_2) \cdot \hat{n}$$

- **Case 1: $v_n > 0$ (Separating):** Body 1 is moving in the direction of $\hat{n}$ faster than Body 2, or Body 2 is moving away. The bodies are already separating; **no impulse is applied** ($J_n = 0$).
- **Case 2: $v_n = 0$ (Resting Contact):** The bodies are in continuous contact without approaching or separating.
- **Case 3: $v_n < 0$ (Approaching):** The bodies are moving toward each other; an impulse must be delivered along $\hat{n}$ to prevent interpenetration.

### 3.2 Action-Reaction Impulse Pair

By Newton's Third Law, the collision delivers an impulse vector $\vec{J} = J_n \hat{n}$ to Body 1 and $-\vec{J} = -J_n \hat{n}$ to Body 2:
$$\vec{v}_1' = \vec{v}_1 - \frac{J_n}{m_1} \hat{n} = \vec{v}_1 - w_1 J_n \hat{n}$$
$$\vec{v}_2' = \vec{v}_2 + \frac{J_n}{m_2} \hat{n} = \vec{v}_2 + w_2 J_n \hat{n}$$
where $w_1 \equiv 1/m_1$ and $w_2 \equiv 1/m_2$ are the **inverse masses**. (Notice the elegant computational convenience: an immovable, anchored obstacle or wall has $m \to \infty \implies w = 0$, requiring zero special-case logic!).

### 3.3 Enforcing Newton's Restitution Law

The relative normal velocity after the impulse is:
$$v_n' = (\vec{v}_1' - \vec{v}_2') \cdot \hat{n}$$
Substitute the updated velocities:
$$v_n' = \left[(\vec{v}_1 - w_1 J_n \hat{n}) - (\vec{v}_2 + w_2 J_n \hat{n})\right] \cdot \hat{n}$$
$$v_n' = (\vec{v}_1 - \vec{v}_2) \cdot \hat{n} - (w_1 + w_2) J_n (\hat{n} \cdot \hat{n})$$
Since $\hat{n}$ is a unit vector ($\hat{n} \cdot \hat{n} = 1$):
$$v_n' = v_n - (w_1 + w_2) J_n$$

We require the post-collision normal relative velocity to satisfy Newton's empirical restitution coefficient $e \in [0, 1]$:
$$v_n' = -e\,v_n$$

Equating the two expressions:
$$-e\,v_n = v_n - (w_1 + w_2) J_n$$
$$(w_1 + w_2) J_n = v_n + e\,v_n = (1 + e) v_n$$

Solving for the normal impulse scalar $J_n$:

$$\mathbf{J_n = \frac{-(1 + e) v_n}{w_1 + w_2} = \frac{-(1 + e)(\vec{v}_{\text{rel}} \cdot \hat{n})}{\frac{1}{m_1} + \frac{1}{m_2}}}$$

### 3.4 Unilateral Impulse Inequality (The Complementarity Constraint)

In physical contact, surfaces can only **push** each other; they cannot exert tensile attraction to pull each other together. Therefore, the normal impulse must strictly obey the **unilateral constraint**:
$$J_n \ge 0$$

In code, this is enforced by clamping:
$$J_n = \max\left(0, \frac{-(1 + e) v_n}{w_1 + w_2}\right)$$

---

## 4. Friction Formulation: Tangential Impulse and Coulomb Clamping

Friction acts along the contact plane perpendicular to the normal, opposing relative sliding motion.

### 4.1 Contact Tangent Vector ($\hat{t}$)

Compute the tangential relative velocity:
$$\vec{v}_t = \vec{v}_{\text{rel}} - (\vec{v}_{\text{rel}} \cdot \hat{n})\hat{n} = \vec{v}_{\text{rel}} - v_n \hat{n}$$

- If $\|\vec{v}_t\| < 10^{-6}\text{ m/s}$, there is no relative sliding; $\hat{t} = \vec{0}$ and friction impulse is zero.
- Otherwise, the unit tangent vector is:
  $$\hat{t} = \frac{\vec{v}_t}{\|\vec{v}_t\|}$$
  The scalar tangential speed is:
  $$v_t = \vec{v}_{\text{rel}} \cdot \hat{t} = \|\vec{v}_t\| > 0$$

### 4.2 Unclamped (Sticking) Friction Impulse

To cancel relative sliding completely ($v_t' = 0$), we compute the required tangential impulse $J_t$:
$$v_t' = v_t - (w_1 + w_2) J_t = 0 \implies J_{t, \text{stick}} = \frac{v_t}{w_1 + w_2}$$

### 4.3 Coulomb's Friction Law Clamping

According to Coulomb's friction model, the maximum tangential shear force that dry friction can support is bounded by the normal force: $F_t \le \mu F_n$. Integrating over time yields the impulse bound:
$$|J_t| \le \mu J_n$$

Therefore, the applied friction impulse is:

$$\mathbf{J_t = \min\left(J_{t, \text{stick}}, \mu J_n\right)}$$

- **Static Friction (Stick):** If $J_{t, \text{stick}} \le \mu J_n$, friction is strong enough to arrest sliding completely; $J_t = J_{t, \text{stick}}$.
- **Dynamic Friction (Slip):** If $J_{t, \text{stick}} > \mu J_n$, the surfaces slip against each other; friction delivers its maximum permissible magnitude $J_t = \mu J_n$.

### 4.4 Applying the Total Impulse Vector

The total impulse vector delivered to Body 1 is:
$$\vec{J}_{\text{total}} = -J_n \hat{n} - J_t \hat{t}$$
The total impulse delivered to Body 2 is:
$$\vec{J}_{2, \text{total}} = -\vec{J}_{\text{total}} = +J_n \hat{n} + J_t \hat{t}$$

Velocity updates:
$$\vec{v}_1' = \vec{v}_1 + w_1 \vec{J}_{\text{total}}$$
$$\vec{v}_2' = \vec{v}_2 - w_2 \vec{J}_{\text{total}}$$

---

## 5. Positional Stabilization: Resolving Interpenetration Drift

In discrete time-stepping, simply adjusting velocities is insufficient. Because collisions are detected *after* penetration has already occurred, two bodies will remain overlapping if only their velocities are reversed. Over multiple frames, resting stacks will sink into floors (the notorious **sinking bug**).

```
                      Penetration depth d > 0
                      +--------+
                      | Body 1 |
                      |    +---|----+
                      +----|---+    |
                           | Body 2 |
                           +--------+
```

### 5.1 Strategy 1: Position Projection (Geometric Teleportation)

The most direct fix is to separate the bodies along $\hat{n}$ by the penetration depth $d = (R_1 + R_2) - \|\vec{r}_2 - \vec{r}_1\|$:
$$\vec{r}_1' = \vec{r}_1 - \frac{w_1}{w_1 + w_2} d\,\hat{n}$$
$$\vec{r}_2' = \vec{r}_2 + \frac{w_2}{w_1 + w_2} d\,\hat{n}$$

While physically intuitive, pure position projection suffers from serious flaws:
- Teleporting bodies directly alters positions without updating velocities, causing velocity-position de-synchronization.
- In multi-body stacks, pushing Body 2 out of Body 1 pushes it deeper into Body 3, causing violent visual jitter and energy creation.

### 5.2 Strategy 2: Baumgarte Stabilization (Velocity Bias)

In 1972, the German mechanician J. Baumgarte proposed adding a **corrective bias velocity** directly into the velocity constraint equation.

Instead of targeting $v_n' = -e\,v_n$, we target:
$$v_n' = -e\,v_n + v_{\text{bias}}$$
where:
$$\mathbf{v_{\text{bias}} = \frac{\beta}{\Delta t} \max(0, d - d_{\text{slop}})}$$
- $\beta \in [0.1, 0.3]$ is the dimensionless **Baumgarte stabilization factor** (typically $\beta = 0.2$).
- $d_{\text{slop}}$ is a tiny penetration allowance (typically $0.001\text{ to }0.005\text{ m}$) that prevents chatter from microscopic floating-point rounding errors.
- $\Delta t$ is the simulation time step.

With Baumgarte stabilization, the normal impulse formula becomes:

$$\mathbf{J_n = \max\left(0, \frac{-(1 + e) v_n + \frac{\beta}{\Delta t}\max(0, d - d_{\text{slop}})}{w_1 + w_2}\right)}$$

The beauty of Baumgarte stabilization is that penetration is removed gradually and smoothly over several frames purely through the existing velocity impulse solver, preserving physical stability!

---

## 6. Multi-Body Contact Networks and Sequential Impulses

When three or more bodies collide simultaneously—such as Newton's Cradle, a pool ball break, or a stack of resting crates—the collision impulses form a **Linear Complementarity Problem (LCP)**:
$$\mathbf{A}\,\vec{J} + \vec{b} \ge \vec{0}, \quad \vec{J} \ge \vec{0}, \quad \vec{J}^T (\mathbf{A}\,\vec{J} + \vec{b}) = 0$$

Solving this globally requires expensive matrix pivoting algorithms (Dantzig or Lemke), which scale as $\mathcal{O}(N^3)$ and are too slow for real-time physics engines.

### 6.1 The Sequential Impulse (Projected Gauss-Seidel) Algorithm

Pioneered for video games by Erin Catto (creator of Box2D), **Sequential Impulses** solves the contact network iteratively in $\mathcal{O}(N)$ time:

```
Algorithm: Sequential Impulses Solver
-------------------------------------
1. For each contact manifold c in ContactList:
     Initialize accumulated normal impulse: c.accumulated_Jn = 0
     Initialize accumulated tangent impulse: c.accumulated_Jt = 0

2. Loop Iteration = 1 to N_ITERATIONS (typically 10 to 20):
     For each contact c in ContactList:
       // Compute current relative normal velocity
       v_rel = (c.body1.v - c.body2.v) . c.normal
       
       // Compute delta impulse
       delta_Jn = (-(1 + e) * v_rel + v_bias) / (w1 + w2)
       
       // Accumulate and clamp to prevent negative impulses
       old_Jn = c.accumulated_Jn
       c.accumulated_Jn = max(0, old_Jn + delta_Jn)
       actual_delta_Jn = c.accumulated_Jn - old_Jn
       
       // Apply impulse delta to body velocities
       c.body1.v -= actual_delta_Jn * w1 * c.normal
       c.body2.v += actual_delta_Jn * w2 * c.normal
```

By sweeping through all contact pairs 10 to 20 times per frame, stress waves propagate through the multi-body network, converging rapidly to the exact physical solution!

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 11.1: Single Contact Normal Impulse Calculation
*In a 2D physics engine, Ball 1 ($m_1 = 2.00\text{ kg}$) moving at $\vec{v}_1 = (5.00\,\hat{i} + 0.00\,\hat{j})\text{ m/s}$ collides with Ball 2 ($m_2 = 3.00\text{ kg}$) moving at $\vec{v}_2 = (-2.00\,\hat{i} + 0.00\,\hat{j})\text{ m/s}$. The collision normal pointing from Ball 1 to Ball 2 is $\hat{n} = (1.00\,\hat{i} + 0.00\,\hat{j})$. The restitution coefficient is $e = 0.800$. (a) Determine the inverse masses $w_1$ and $w_2$. (b) Calculate the relative normal velocity $v_n$. (c) Compute the normal impulse scalar $J_n$. (d) Update the velocities of both bodies.*

#### Solution
1. **Part (a): Inverse Masses:**
   $$w_1 = \frac{1}{m_1} = \frac{1}{2.00} = \mathbf{0.500\text{ kg}^{-1}}$$
   $$w_2 = \frac{1}{m_2} = \frac{1}{3.00} \approx \mathbf{0.3333\text{ kg}^{-1}}$$
   $$w_1 + w_2 = 0.500 + 0.3333 = 0.8333\text{ kg}^{-1}$$
2. **Part (b): Relative Normal Velocity:**
   $$\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2 = (5.00 - (-2.00))\hat{i} = (7.00\,\hat{i})\text{ m/s}$$
   $$v_n = \vec{v}_{\text{rel}} \cdot \hat{n} = 7.00 \times 1.00 = \mathbf{+7.00\text{ m/s}}$$
   *(Note: By our convention where $\hat{n}$ points from 1 to 2, Ball 1 moves towards Ball 2 when its velocity along $\hat{n}$ is greater than Ball 2's, so they are approaching at $7.00\text{ m/s}$).*
3. **Part (c): Normal Impulse Scalar $J_n$:**
   $$J_n = \frac{(1 + e) v_n}{w_1 + w_2} = \frac{(1 + 0.800) \times 7.00}{0.8333} = \frac{1.800 \times 7.00}{0.8333} = \frac{12.60}{0.8333} \approx \mathbf{15.12\text{ N}\cdot\text{s}}$$
4. **Part (d): Update Velocities:**
   - Ball 1 (pushed in $-\hat{n}$ direction):
     $$\vec{v}_1' = \vec{v}_1 - w_1 J_n \hat{n} = (5.00\,\hat{i}) - (0.500 \times 15.12\,\hat{i}) = (5.00 - 7.56)\hat{i} = \mathbf{(-2.56\,\hat{i})\text{ m/s}}$$
   - Ball 2 (pushed in $+\hat{n}$ direction):
     $$\vec{v}_2' = \vec{v}_2 + w_2 J_n \hat{n} = (-2.00\,\hat{i}) + (0.3333 \times 15.12\,\hat{i}) = (-2.00 + 5.04)\hat{i} = \mathbf{(+3.04\,\hat{i})\text{ m/s}}$$
5. **Verification of Restitution:**
   $$v_n' = (v_{1x}' - v_{2x}') = -2.56 - 3.04 = -5.60\text{ m/s}$$
   $$\frac{-v_n'}{v_n} = \frac{-(-5.60)}{7.00} = \frac{5.60}{7.00} = 0.800 = e$$
   Matches restitution perfectly!

---

### Worked Example 11.2: Collision with an Immovable Infinite-Mass Boundary
*A ball of mass $m = 0.500\text{ kg}$ strikes a rigid boundary wall with velocity $\vec{v}_1 = (4.00\,\hat{i} - 6.00\,\hat{j})\text{ m/s}$. The wall is modeled as an immovable rigid body ($m_2 = \infty, \vec{v}_2 = \vec{0}$) with surface normal $\hat{n} = (0.00\,\hat{i} + 1.00\,\hat{j})$ pointing out of the wall. The coefficient of restitution is $e = 0.700$. Using the inverse mass formulation, calculate the impulse scalar $J_n$ and the final velocity vector of the ball.*

#### Solution
1. **Given:**
   - $w_1 = 1 / 0.500 = 2.00\text{ kg}^{-1}$
   - $w_2 = 1 / \infty = \mathbf{0.00\text{ kg}^{-1}}$ (Zero inverse mass for static boundary)
   - $w_{\text{total}} = w_1 + w_2 = 2.00 + 0.00 = 2.00\text{ kg}^{-1}$
2. **Relative Normal Velocity:**
   $$\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2 = (4.00\,\hat{i} - 6.00\,\hat{j})\text{ m/s}$$
   $$v_n = \vec{v}_{\text{rel}} \cdot \hat{n} = (4.00)(0) + (-6.00)(1.00) = -6.00\text{ m/s}$$
   (The ball is penetrating into the wall at $6.00\text{ m/s}$).
3. **Compute Impulse Scalar $J_n$:**
   $$J_n = \max\left(0, \frac{-(1 + e) v_n}{w_1 + w_2}\right) = \frac{-(1 + 0.700)(-6.00)}{2.00} = \frac{1.700 \times 6.00}{2.00} = \frac{10.20}{2.00} = \mathbf{5.10\text{ N}\cdot\text{s}}$$
4. **Update Ball Velocity:**
   $$\vec{v}_1' = \vec{v}_1 + w_1 J_n \hat{n} = (4.00\,\hat{i} - 6.00\,\hat{j}) + (2.00)(5.10)(0.00\,\hat{i} + 1.00\,\hat{j})$$
   $$\vec{v}_1' = 4.00\,\hat{i} + (-6.00 + 10.20)\hat{j} = \mathbf{(4.00\,\hat{i} + 4.20\,\hat{j})\text{ m/s}}$$
5. **Physical Insight:**
   The tangential velocity ($v_x = 4.00\text{ m/s}$) was completely unaffected, while the normal velocity reversed from $-6.00\text{ m/s}$ to $+4.20\text{ m/s}$ ($4.20 / 6.00 = 0.70 = e$). The infinite-mass boundary required zero special-case `if` branches!

---

### Worked Example 11.3: Contact Impulse with Coulomb Friction Clamping
*In a physics engine, a crate of mass $m_1 = 10.0\text{ kg}$ strikes a flat floor ($m_2 = \infty$) with velocity $\vec{v}_1 = (8.00\,\hat{i} - 4.00\,\hat{j})\text{ m/s}$. The floor normal is $\hat{n} = (0\,\hat{i} + 1\,\hat{j})$. The restitution is $e = 0.00$ (completely plastic normal impact), and the friction coefficient is $\mu = 0.400$. (a) Compute the normal impulse $J_n$. (b) Determine the tangent vector $\hat{t}$ and relative sliding speed $v_t$. (c) Compute the sticking friction impulse $J_{t, \text{stick}}$ and apply Coulomb clamping to find the actual friction impulse $J_t$. (d) Find the final velocity vector.*

#### Solution
1. **Given:**
   - $w_1 = 1 / 10.0 = 0.100\text{ kg}^{-1}$, $w_2 = 0 \implies w_{\text{total}} = 0.100\text{ kg}^{-1}$.
   - $v_n = \vec{v}_1 \cdot \hat{n} = -4.00\text{ m/s}$.
2. **Part (a): Normal Impulse:**
   $$J_n = \frac{-(1 + 0.00)(-4.00)}{0.100} = \frac{4.00}{0.100} = \mathbf{40.0\text{ N}\cdot\text{s}}$$
3. **Part (b): Tangent Vector and Sliding Speed:**
   - Tangential relative velocity:
     $$\vec{v}_t = \vec{v}_{\text{rel}} - v_n \hat{n} = (8.00\,\hat{i} - 4.00\,\hat{j}) - (-4.00\,\hat{j}) = (8.00\,\hat{i})\text{ m/s}$$
   - Unit tangent: $\hat{t} = (1.00\,\hat{i} + 0.00\,\hat{j})$.
   - Tangential sliding speed: $v_t = 8.00\text{ m/s}$.
4. **Part (c): Friction Impulse and Coulomb Clamping:**
   - Impulse required to completely arrest sliding:
     $$J_{t, \text{stick}} = \frac{v_t}{w_{\text{total}}} = \frac{8.00}{0.100} = 80.0\text{ N}\cdot\text{s}$$
   - Maximum allowable friction under Coulomb cone:
     $$J_{t, \max} = \mu J_n = 0.400 \times 40.0 = 16.0\text{ N}\cdot\text{s}$$
   - Since $J_{t, \text{stick}} = 80.0 > J_{t, \max} = 16.0$, the crate **slips**, and friction is clamped:
     $$\mathbf{J_t = J_{t, \max} = 16.0\text{ N}\cdot\text{s}}$$
5. **Part (d): Update Velocities:**
   - The friction impulse opposes sliding along $\hat{t}$: $\vec{J}_{\text{fric}} = -J_t \hat{t} = -16.0\,\hat{i}$.
   - The normal impulse pushes along $\hat{n}$: $\vec{J}_{\text{norm}} = +J_n \hat{n} = +40.0\,\hat{j}$.
   $$\vec{v}_1' = \vec{v}_1 + w_1 (\vec{J}_{\text{norm}} + \vec{J}_{\text{fric}}) = (8.00\,\hat{i} - 4.00\,\hat{j}) + 0.100(-16.0\,\hat{i} + 40.0\,\hat{j})$$
   $$\vec{v}_1' = (8.00 - 1.60)\hat{i} + (-4.00 + 4.00)\hat{j} = \mathbf{(6.40\,\hat{i} + 0.00\,\hat{j})\text{ m/s}}$$
   (The normal motion is eliminated, and the horizontal velocity is reduced from $8.00$ to $6.40\text{ m/s}$).

---

### Worked Example 11.4: Baumgarte Stabilization for Penetration Drift
*A ball of mass $m = 1.00\text{ kg}$ rests on the floor ($m_2 = \infty$). Due to gravity integration over time step $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$, the ball has penetrated the floor by depth $d = 0.020\text{ m}$ ($2.0\text{ cm}$) and has a downward velocity $v_n = -0.1633\text{ m/s}$. The slop tolerance is $d_{\text{slop}} = 0.002\text{ m}$, restitution is $e = 0.00$, and the Baumgarte coefficient is $\beta = 0.200$. (a) Calculate the Baumgarte bias velocity $v_{\text{bias}}$. (b) Compute the normal impulse $J_n$ with Baumgarte stabilization. (c) Compute the post-impulse vertical velocity $v_n'$.*

#### Solution
1. **Given:**
   - $w_1 = 1 / 1.00 = 1.00\text{ kg}^{-1}$, $w_2 = 0 \implies w_{\text{total}} = 1.00\text{ kg}^{-1}$.
   - $v_n = -0.1633\text{ m/s}$.
   - $d = 0.020\text{ m}$, $d_{\text{slop}} = 0.002\text{ m} \implies \text{excess penetration } d - d_{\text{slop}} = 0.018\text{ m}$.
   - $\Delta t = 0.01667\text{ s}$, $\beta = 0.200$.
2. **Part (a): Compute Baumgarte Bias Velocity:**
   $$v_{\text{bias}} = \frac{\beta}{\Delta t} (d - d_{\text{slop}}) = \frac{0.200}{0.01667\text{ s}} \times 0.018\text{ m} = 12.0 \times 0.018 = \mathbf{+0.216\text{ m/s}}$$
3. **Part (b): Compute Normal Impulse $J_n$:**
   $$J_n = \frac{-(1 + e) v_n + v_{\text{bias}}}{w_{\text{total}}} = \frac{-(1 + 0)(-0.1633) + 0.216}{1.00} = 0.1633 + 0.216 = \mathbf{0.3793\text{ N}\cdot\text{s}}$$
4. **Part (c): Post-Impulse Normal Velocity:**
   $$v_n' = v_n + w_1 J_n = -0.1633 + (1.00)(0.3793) = \mathbf{+0.216\text{ m/s}}$$
5. **Physical Insight:**
   Notice that the post-impulse velocity is now **upward** at $+0.216\text{ m/s}$! Over the subsequent frame, this upward velocity will advance the position by $\Delta y = v_n' \Delta t = (+0.216)(0.01667) \approx +0.0036\text{ m}$, steadily pushing the ball out of the floor without causing an unnatural visual jump.

---

### Worked Example 11.5: Sequential Impulses Iteration for a 3-Body Line Stacking
*Three identical discs ($A, B, C$) of mass $m = 1.00\text{ kg}$ ($w = 1.00\text{ kg}^{-1}$) lie in a line on a frictionless surface. Discs $B$ and $C$ are at rest and touching ($v_B = 0, v_C = 0$). Disc $A$ strikes Disc $B$ with velocity $v_A = 6.00\text{ m/s}$. Both contacts have $e = 1.00$. Show the first two iterations of the Sequential Impulse solver across Contact 1 ($A-B$) and Contact 2 ($B-C$).*

#### Solution
1. **Initial Velocities:**
   - $v_A = 6.00\text{ m/s}$, $v_B = 0.00\text{ m/s}$, $v_C = 0.00\text{ m/s}$.
   - Normal points rightward: $\hat{n} = +1$.
   - Effective inverse mass for any pair: $w_1 + w_2 = 1.00 + 1.00 = 2.00\text{ kg}^{-1}$.
2. **Iteration 1:**
   - **Solve Contact 1 ($A-B$):**
     Relative velocity: $v_{\text{rel}} = v_A - v_B = 6.00 - 0 = +6.00\text{ m/s}$.
     Impulse scalar: $\Delta J_1 = \frac{-(1+1) \times (-6.00)}{2.00} = \frac{12.00}{2.00} = 6.00\text{ N}\cdot\text{s}$.
     Update velocities:
     $$v_A \leftarrow v_A - w \Delta J_1 = 6.00 - (1.00)(6.00) = 0.00\text{ m/s}$$
     $$v_B \leftarrow v_B + w \Delta J_1 = 0.00 + (1.00)(6.00) = +6.00\text{ m/s}$$
   - **Solve Contact 2 ($B-C$):**
     Current velocities: $v_B = 6.00\text{ m/s}$, $v_C = 0.00\text{ m/s}$.
     Relative velocity: $v_{\text{rel}} = v_B - v_C = 6.00 - 0 = +6.00\text{ m/s}$.
     Impulse scalar: $\Delta J_2 = \frac{-(2) \times (-6.00)}{2.00} = 6.00\text{ N}\cdot\text{s}$.
     Update velocities:
     $$v_B \leftarrow v_B - w \Delta J_2 = 6.00 - 6.00 = 0.00\text{ m/s}$$
     $$v_C \leftarrow v_C + w \Delta J_2 = 0.00 + 6.00 = +6.00\text{ m/s}$$
3. **Iteration 2:**
   - **Solve Contact 1 ($A-B$):**
     $v_A = 0.00$, $v_B = 0.00 \implies v_{\text{rel}} = 0 \implies \Delta J_1 = 0$.
   - **Solve Contact 2 ($B-C$):**
     $v_B = 0.00$, $v_C = 6.00 \implies v_{\text{rel}} = -6.00$ (separating) $\implies \Delta J_2 = 0$.
4. **Final Converged State:**
   $$\mathbf{v_A = 0.00\text{ m/s}, \quad v_B = 0.00\text{ m/s}, \quad v_C = +6.00\text{ m/s}}$$
   The sequential solver reproduces the exact physical behavior of Newton's Cradle in a single iteration sweep!

---

### Worked Example 11.6: Continuous Collision Detection (CCD) Raycast Time of Impact
*A high-speed particle at $\vec{r}_0 = (0.00, 5.00)\text{ m}$ moves with velocity $\vec{v} = (600.0\,\hat{i} + 0.0\,\hat{j})\text{ m/s}$. A thin vertical wall of thickness $w = 0.100\text{ m}$ is located at $x_{\text{wall}} = 4.00\text{ m}$ (spanning $x \in [4.00, 4.10]\text{ m}$). The simulation time step is $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$. (a) Show that discrete collision detection suffers a tunneling failure. (b) Formulate the continuous collision raycast equation and compute the exact time of impact $t_{\text{TOI}} \in [0, \Delta t]$.*

#### Solution
1. **Part (a): Discrete Detection Failure (Tunneling):**
   - Position at start of frame: $x(0) = 0.00\text{ m}$.
   - Position at end of frame:
     $$x(\Delta t) = x(0) + v_x \Delta t = 0.00 + (600.0) \times (0.01667) = +10.00\text{ m}$$
   - During this frame, $x$ jumps from $0.00\text{ m}$ to $10.00\text{ m}$.
   - Because $10.00\text{ m} > 4.10\text{ m}$, the particle is outside the wall at both $t = 0$ and $t = \Delta t$.
   - A standard discrete bounding box check reports **NO COLLISION**, and the bullet tunnels through the wall undetected!
2. **Part (b): Continuous Raycast Formulation:**
   - Model the displacement as a continuous ray: $\vec{r}(t) = \vec{r}_0 + \vec{v} t$ for $t \in [0, \Delta t]$.
   - Contact with the front face of the wall occurs when:
     $$x(t_{\text{TOI}}) = x_{\text{wall}} \implies x_0 + v_x t_{\text{TOI}} = 4.00\text{ m}$$
     $$0.00 + 600.0\,t_{\text{TOI}} = 4.00\text{ m}$$
     $$t_{\text{TOI}} = \frac{4.00}{600.0} = \mathbf{\frac{1}{150}\text{ s} \approx 0.00667\text{ s}}$$
3. **Check Interval:**
   - Since $0.00667\text{ s} < \Delta t = 0.01667\text{ s}$, the collision is detected at normalized frame time:
     $$\alpha = \frac{t_{\text{TOI}}}{\Delta t} = \frac{0.00667}{0.01667} = \mathbf{0.400 = 40.0\%\text{ into the frame}}$$
   - The engine clamps the time-step, advances the particle to $x = 4.00\text{ m}$, resolves the impact impulse, and simulates the remaining $60\%$ of the frame with the reflected velocity!

---

### Worked Example 11.7: Angular Impulse for an Off-Center Rigid Rod
*A uniform slender rod of mass $M = 2.00\text{ kg}$ and length $L = 1.00\text{ m}$ (moment of inertia about center of mass $I = \frac{1}{12} M L^2$) floats at rest in space. A point particle of mass $m = 0.200\text{ kg}$ traveling at $v_0 = 10.0\text{ m/s}$ strikes the tip of the rod ($r = L/2 = 0.500\text{ m}$ from CM) perpendicularly with restitution $e = 1.00$. Compute: (a) the effective rotational inverse mass of the rod tip, (b) the total effective inverse mass $w_{\text{eff}}$, (c) the collision impulse $J_n$, and (d) the final linear and angular velocities of the rod.*

#### Solution
1. **Given:**
   - $M = 2.00\text{ kg}$, $L = 1.00\text{ m}$, $I = \frac{1}{12}(2.00)(1.00)^2 = \frac{1}{6} \approx 0.1667\text{ kg}\cdot\text{m}^2$.
   - Particle mass $m = 0.200\text{ kg} \implies w_{\text{part}} = 1/0.200 = 5.00\text{ kg}^{-1}$.
   - Linear inverse mass of rod: $w_{\text{rod, lin}} = 1/2.00 = 0.500\text{ kg}^{-1}$.
   - Contact offset lever arm: $r = 0.500\text{ m}$.
2. **Part (a): Rotational Inverse Mass Contribution:**
   $$w_{\text{rod, rot}} = \frac{r^2}{I} = \frac{(0.500)^2}{0.1667} = \frac{0.250}{0.1667} = \mathbf{1.500\text{ kg}^{-1}}$$
3. **Part (b): Total Effective Inverse Mass:**
   $$w_{\text{eff}} = w_{\text{part}} + w_{\text{rod, lin}} + w_{\text{rod, rot}} = 5.00 + 0.500 + 1.500 = \mathbf{7.00\text{ kg}^{-1}}$$
4. **Part (c): Collision Impulse $J_n$ ($e = 1.00$):**
   - Relative closing velocity: $v_{\text{rel}} = v_0 - 0 = 10.0\text{ m/s}$.
   $$J_n = \frac{(1 + e) v_{\text{rel}}}{w_{\text{eff}}} = \frac{(1 + 1.00) \times 10.0}{7.00} = \frac{20.0}{7.00} \approx \mathbf{2.857\text{ N}\cdot\text{s}}$$
5. **Part (d): Final Rod Motion:**
   - Linear center of mass velocity:
     $$V_{\text{CM}} = \frac{J_n}{M} = \frac{2.857}{2.00} \approx \mathbf{1.429\text{ m/s}}$$
   - Angular velocity:
     $$\omega = \frac{\tau_{\text{impulse}}}{I} = \frac{J_n r}{I} = \frac{2.857 \times 0.500}{0.1667} = \frac{1.4285}{0.1667} \approx \mathbf{8.57\text{ rad/s}}$$

---

### Worked Example 11.8: Symplectic Euler vs Explicit Euler Integration Stability
*A harmonic oscillator consisting of a mass $m = 1.00\text{ kg}$ attached to a spring $k = 100.0\text{ N/m}$ ($\omega = 10.0\text{ rad/s}$) is simulated with time step $\Delta t = 0.050\text{ s}$. Starting from $x(0) = 1.00\text{ m}, v(0) = 0.00\text{ m/s}$: (a) Calculate $x(1)$ and $v(1)$ after one step using Explicit Euler. (b) Calculate the mechanical energy under Explicit Euler. (c) Repeat using Symplectic Euler.*

#### Solution
1. **Governing Acceleration:**
   $$a(x) = -\frac{k}{m} x = -100.0\,x$$
2. **Part (a) & (b): Explicit Euler:**
   - Position update uses old velocity:
     $$x(1) = x(0) + v(0) \Delta t = 1.00 + (0)(0.050) = \mathbf{1.00\text{ m}}$$
   - Velocity update uses old position:
     $$v(1) = v(0) + a(x(0)) \Delta t = 0.00 + (-100.0 \times 1.00)(0.050) = \mathbf{-5.00\text{ m/s}}$$
   - Mechanical Energy:
     $$E(0) = \frac{1}{2} k x(0)^2 + \frac{1}{2} m v(0)^2 = \frac{1}{2}(100)(1)^2 + 0 = 50.0\text{ J}$$
     $$E(1) = \frac{1}{2}(100)(1.00)^2 + \frac{1}{2}(1.00)(-5.00)^2 = 50.0 + 12.5 = \mathbf{62.5\text{ J}}$$
   - **Energy increased by $25\%$ in a single step!** Explicit Euler is numerically unstable and causes physics simulations to explode!
3. **Part (c): Symplectic (Semi-Implicit) Euler:**
   - Velocity update first:
     $$v(1) = v(0) + a(x(0)) \Delta t = 0.00 + (-100.0)(0.050) = \mathbf{-5.00\text{ m/s}}$$
   - Position update uses the **NEW** velocity:
     $$x(1) = x(0) + v(1) \Delta t = 1.00 + (-5.00)(0.050) = 1.00 - 0.250 = \mathbf{0.750\text{ m}}$$
   - Mechanical Energy:
     $$E(1) = \frac{1}{2}(100)(0.750)^2 + \frac{1}{2}(1.00)(-5.00)^2 = 50.0(0.5625) + 12.5 = 28.125 + 12.5 = \mathbf{40.625\text{ J}}$$
   - Symplectic Euler preserves a shadow Hamiltonian, bounding energy oscillations over millions of steps without artificial energy drift!

---

### Worked Example 11.9: Velocity Clamping for Restitution Slop (Anti-Jitter)
*When a ball bounces on a floor with restitution $e = 0.80$, its rebound velocity decreases on each bounce. In real engines, when $v_n$ drops below a threshold velocity $v_{\text{threshold}}$, restitution must be forcibly set to $e = 0$ to prevent infinite micro-bounces (Zeno's bouncing phenomenon). If $v_{\text{threshold}} = 2 g \Delta t$ with $g = 9.80\text{ m/s}^2$ and $\Delta t = 1/60\text{ s}$, calculate: (a) the numerical threshold $v_{\text{threshold}}$, and (b) the drop height below which a ball will immediately come to rest on its first bounce.*

#### Solution
1. **Part (a): Compute Threshold Velocity:**
   $$v_{\text{threshold}} = 2 g \Delta t = 2 \times 9.80 \times \left(\frac{1}{60}\right) = \frac{19.60}{60} \approx \mathbf{0.3267\text{ m/s}}$$
2. **Part (b): Drop Height for Rest:**
   - The impact velocity from free fall height $h$ is $v = \sqrt{2gh}$.
   - The ball will be clamped to $e = 0$ if its impact speed satisfies $v \le v_{\text{threshold}}$:
     $$\sqrt{2gh} \le v_{\text{threshold}} \implies h \le \frac{v_{\text{threshold}}^2}{2g} = \frac{(0.3267)^2}{2 \times 9.80} = \frac{0.1067}{19.60} \approx \mathbf{0.00544\text{ m} = 5.44\text{ mm}}$$
   - Any bounce from less than $5.4\text{ mm}$ is cleanly resolved to rest, eliminating all micro-jitter!

---

### Worked Example 11.10: Collision Detection Between Moving Circles (Narrowphase)
*Circle 1 has center $\vec{r}_1 = (2.00, 3.00)\text{ m}$ and radius $R_1 = 0.600\text{ m}$. Circle 2 has center $\vec{r}_2 = (3.20, 4.60)\text{ m}$ and radius $R_2 = 1.500\text{ m}$. (a) Calculate the center-to-center distance $d_{12}$. (b) Determine whether the circles are colliding. (c) If colliding, compute the penetration depth $d$ and the contact normal $\hat{n}$ pointing from Circle 1 to Circle 2.*

#### Solution
1. **Part (a): Center-to-Center Displacement:**
   $$\Delta\vec{r} = \vec{r}_2 - \vec{r}_1 = (3.20 - 2.00)\hat{i} + (4.60 - 3.00)\hat{j} = (1.20\,\hat{i} + 1.60\,\hat{j})\text{ m}$$
   $$d_{12} = \|\Delta\vec{r}\| = \sqrt{(1.20)^2 + (1.60)^2} = \sqrt{1.44 + 2.56} = \sqrt{4.00} = \mathbf{2.000\text{ m}}$$
2. **Part (b): Collision Condition:**
   - Sum of radii: $R_1 + R_2 = 0.600 + 1.500 = 2.100\text{ m}$.
   - Since $d_{12} = 2.000\text{ m} < R_1 + R_2 = 2.100\text{ m}$, the circles are **overlapping (COLLIDING)**!
3. **Part (c): Penetration Depth and Contact Normal:**
   - Penetration depth:
     $$d = (R_1 + R_2) - d_{12} = 2.100 - 2.000 = \mathbf{0.100\text{ m} = 10.0\text{ cm}}$$
   - Contact normal (from 1 to 2):
     $$\hat{n} = \frac{\Delta\vec{r}}{d_{12}} = \frac{1.20\,\hat{i} + 1.60\,\hat{j}}{2.000} = \mathbf{0.600\,\hat{i} + 0.800\,\hat{j}}$$
     $$\|\hat{n}\| = \sqrt{0.6^2 + 0.8^2} = 1.000$$

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 11.1:** Explain why physics engines define an "inverse mass" $w = 1/m$ rather than storing regular mass $m$, and explain how this elegantly handles static terrain.  
**Exercise 11.2:** Why does Explicit Euler integration cause orbital and spring systems to gain artificial energy and explode, while Symplectic Euler maintains long-term energy bounds?

### Tier 2: Quantitative Mechanics
**Exercise 11.3:** Two particles of masses $m_1 = 4.00\text{ kg}$ and $m_2 = 1.00\text{ kg}$ collide head-on with $v_{1i} = 3.00\text{ m/s}$ and $v_{2i} = -2.00\text{ m/s}$. The collision has restitution $e = 0.500$. Compute the impulse scalar $J_n$ and the final velocities of both particles using the inverse-mass impulse formula.  
**Exercise 11.4:** A sliding puck on a table has normal impulse $J_n = 25.0\text{ N}\cdot\text{s}$ during a collision. The friction coefficient is $\mu = 0.250$, and the initial tangential velocity is $v_t = 6.00\text{ m/s}$. The puck mass is $m = 2.00\text{ kg}$. Determine whether the collision results in sticking or slipping, and compute the post-collision tangential speed.

### Tier 3: Multi-Stage Dynamics
**Exercise 11.5:** In a physics engine stepping at $\Delta t = 1/120\text{ s}$, a box penetrates a platform by $d = 1.50\text{ cm}$ with downward normal velocity $v_n = -0.500\text{ m/s}$. If $e = 0.00$, $\beta = 0.250$, and $d_{\text{slop}} = 0.200\text{ cm}$, calculate the required Baumgarte bias velocity and the resulting normal impulse scalar for a $5.00\text{ kg}$ box.  
**Exercise 11.6:** An off-center collision occurs on a floating square box of mass $M = 10.0\text{ kg}$ and side length $s = 2.00\text{ m}$ ($I = \frac{1}{6} M s^2$). A point projectile of mass $m = 1.00\text{ kg}$ strikes the corner ($x = 1.00\text{ m}, y = 1.00\text{ m}$) with velocity $\vec{v} = 12.0\,\hat{i}\text{ m/s}$ along the normal $\hat{n} = \hat{i}$. Assuming $e = 0.800$, find the total effective inverse mass and the normal impulse $J_n$.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 11.7:** Continuous Collision Swept-Sphere: Sphere 1 (radius $R_1 = 0.50\text{ m}$) starts at $(0, 0)$ with velocity $(10, 0)\text{ m/s}$. Sphere 2 (radius $R_2 = 0.50\text{ m}$) starts at $(8, 4)\text{ m}$ with velocity $(0, -5)\text{ m/s}$. Derive the quadratic equation for the time of impact $t_{\text{TOI}}$ and calculate when the spheres touch.  
**Exercise 11.8:** Prove that in a frictionless impulse collision between two bodies with arbitrary mass and restitution $e$, the kinetic energy lost during the impulse is given exactly by $\Delta K_{\text{loss}} = \frac{1}{2} \frac{1 - e^2}{w_1 + w_2} v_n^2$.

### Tier 5: Olympiad / Research Challenge
**Exercise 11.9:** The LCP Contact Solver: Consider three identical blocks in a row on a frictionless floor resting against a fixed wall ($m_1, m_2, m_3$ with wall at the right). Formulate the $3 \times 3$ Delassus contact operator matrix $\mathbf{A}$ for the contact normals, and solve the unilateral complementarity condition $\mathbf{A}\vec{J} + \vec{b} \ge 0$ when an external force $F_0$ pushes Block 1 to the right.  
**Exercise 11.10:** Symplectic Integration and the Störmer-Verlet Invariant: Prove that the Velocity Verlet integrator preserves phase space volume exactly (determinant of the Jacobian is identically 1: $\det\left(\frac{\partial(x_{n+1}, v_{n+1})}{\partial(x_n, v_n)}\right) \equiv 1$), making it strictly symplectic, and derive the modified shadow Hamiltonian $\tilde{H}$ that the numerical trajectory conserves to order $\mathcal{O}(\Delta t^2)$.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 11.1
1. **Efficiency and Simplicity:** Using inverse mass $w = 1/m$ eliminates costly division operations from inner solver loops, replacing them with simple multiplications ($a = w F, \Delta v = w J$).
2. **Infinite Mass Representation:** In real-world physics scenes, obstacles such as walls, terrain, floors, and kinematic elevators are immovable. Their mass is effectively infinite ($m \to \infty$). In standard code, storing $m = \infty$ creates `NaN` or divide-by-zero errors. By storing $w = 0.0$, the exact same code handles both dynamic bodies ($w > 0$) and static terrain ($w = 0$) with zero special-case `if` branches!

---

### Solution to Exercise 11.2
In Explicit Euler, position is integrated using the old velocity: $x_{n+1} = x_n + v_n \Delta t$, and velocity uses old position: $v_{n+1} = v_n - \omega^2 x_n \Delta t$.
The amplification matrix has determinant:
$$\det \begin{pmatrix} 1 & \Delta t \\ -\omega^2\Delta t & 1 \end{pmatrix} = 1 + \omega^2 \Delta t^2 > 1$$
Because the determinant is strictly greater than 1 for any $\Delta t > 0$, the phase space area expands on every time-step, constantly injecting artificial energy and causing the system to spiral outward uncontrollably.
In Symplectic Euler, the updated velocity is used for the position: $v_{n+1} = v_n - \omega^2 x_n \Delta t$, $x_{n+1} = x_n + v_{n+1} \Delta t$.
The determinant of this transformation is identically $1.000$, which strictly preserves phase space volume (Liouville's theorem), preventing energy explosion over arbitrary timescales!

---

### Solution to Exercise 11.3
1. **Inverse Masses:**
   - $w_1 = 1 / 4.00 = 0.250\text{ kg}^{-1}$, $w_2 = 1 / 1.00 = 1.000\text{ kg}^{-1} \implies w_{\text{total}} = 1.250\text{ kg}^{-1}$.
2. **Relative Normal Velocity:**
   - $v_{\text{rel}} = v_1 - v_2 = 3.00 - (-2.00) = 5.00\text{ m/s}$.
3. **Impulse Scalar ($e = 0.500$):**
   $$J_n = \frac{(1 + e) v_{\text{rel}}}{w_{\text{total}}} = \frac{(1 + 0.500) \times 5.00}{1.250} = \frac{1.500 \times 5.00}{1.250} = \frac{7.50}{1.250} = \mathbf{6.00\text{ N}\cdot\text{s}}$$
4. **Final Velocities:**
   $$v_1' = v_1 - w_1 J_n = 3.00 - (0.250)(6.00) = 3.00 - 1.50 = \mathbf{+1.50\text{ m/s}}$$
   $$v_2' = v_2 + w_2 J_n = -2.00 + (1.000)(6.00) = -2.00 + 6.00 = \mathbf{+4.00\text{ m/s}}$$
   Check restitution: $v_2' - v_1' = 4.00 - 1.50 = 2.50\text{ m/s} = 0.50 \times 5.00$. Exact match!

---

### Solution to Exercise 11.4
1. **Coulomb Friction Limit:**
   $$J_{t, \max} = \mu J_n = 0.250 \times 25.0 = \mathbf{6.25\text{ N}\cdot\text{s}}$$
2. **Impulse to Completely Stop Sliding ($w = 1/2.00 = 0.50\text{ kg}^{-1}$):**
   $$J_{t, \text{stick}} = \frac{v_t}{w} = \frac{6.00}{0.50} = 12.0\text{ N}\cdot\text{s}$$
3. **Compare:**
   - Since $J_{t, \text{stick}} = 12.0\text{ N}\cdot\text{s} > J_{t, \max} = 6.25\text{ N}\cdot\text{s}$, the puck **slips**!
4. **Post-Collision Tangential Speed:**
   $$v_t' = v_t - w J_{t, \max} = 6.00 - (0.50)(6.25) = 6.00 - 3.125 = \mathbf{2.875\text{ m/s}}$$

---

### Solution to Exercise 11.5
1. **Given:**
   - $\Delta t = 1/120 \approx 0.008333\text{ s}$.
   - $d = 0.0150\text{ m}$, $d_{\text{slop}} = 0.0020\text{ m} \implies \text{excess} = 0.0130\text{ m}$.
   - $\beta = 0.250$, $e = 0.00$, $v_n = -0.500\text{ m/s}$.
   - Box $m = 5.00\text{ kg} \implies w_1 = 0.200\text{ kg}^{-1}$, floor $w_2 = 0$.
2. **Baumgarte Bias Velocity:**
   $$v_{\text{bias}} = \frac{\beta}{\Delta t} (d - d_{\text{slop}}) = \frac{0.250}{0.008333} \times 0.0130 = 30.0 \times 0.0130 = \mathbf{+0.390\text{ m/s}}$$
3. **Normal Impulse:**
   $$J_n = \frac{-(1 + 0)(-0.500) + 0.390}{0.200} = \frac{0.500 + 0.390}{0.200} = \frac{0.890}{0.200} = \mathbf{4.45\text{ N}\cdot\text{s}}$$

---

### Solution to Exercise 11.6
1. **Rotational Inertia of Square Box:**
   $$I = \frac{1}{6} M s^2 = \frac{1}{6}(10.0)(2.00)^2 = \frac{40.0}{6} \approx 6.6667\text{ kg}\cdot\text{m}^2$$
2. **Effective Inverse Mass of Contact Point:**
   - Linear inverse mass: $w_{\text{box, lin}} = 1/10.0 = 0.100\text{ kg}^{-1}$.
   - Torque arm for normal $\hat{n} = \hat{i}$:
     $$\vec{r} = 1.0\,\hat{i} + 1.0\,\hat{j} \implies (\vec{r} \times \hat{n}) = (1.0\,\hat{i} + 1.0\,\hat{j}) \times \hat{i} = -1.0\,\hat{k}$$
     $$(\vec{r} \times \hat{n})^2 = 1.0^2 = 1.0\text{ m}^2$$
   - Rotational inverse mass:
     $$w_{\text{box, rot}} = \frac{1.0}{6.6667} = 0.150\text{ kg}^{-1}$$
   - Projectile inverse mass: $w_{\text{proj}} = 1/1.00 = 1.000\text{ kg}^{-1}$.
   - Total effective inverse mass:
     $$w_{\text{eff}} = 1.000 + 0.100 + 0.150 = \mathbf{1.250\text{ kg}^{-1}}$$
3. **Normal Impulse:**
   $$J_n = \frac{(1 + 0.800)(12.0)}{1.250} = \frac{1.800 \times 12.0}{1.250} = \frac{21.60}{1.250} = \mathbf{17.28\text{ N}\cdot\text{s}}$$

---

### Solution to Exercise 11.7
1. **Relative Motion:**
   - Relative position: $\vec{r}(t) = \vec{r}_2(t) - \vec{r}_1(t) = (8 - 10t)\hat{i} + (4 - 5t)\hat{j}$.
   - Sum of radii: $R = R_1 + R_2 = 0.50 + 0.50 = 1.00\text{ m}$.
2. **Contact Condition:**
   $$\|\vec{r}(t)\|^2 = R^2 = 1.00^2 = 1.00$$
   $$(8 - 10t)^2 + (4 - 5t)^2 = 1.00$$
   $$(64 - 160t + 100t^2) + (16 - 40t + 25t^2) = 1.00$$
   $$125t^2 - 200t + 79 = 0$$
3. **Solve Quadratic:**
   - Discriminant: $D = (-200)^2 - 4(125)(79) = 40,000 - 39,500 = 500$.
   $$\sqrt{D} = \sqrt{500} \approx 22.3607$$
   $$t = \frac{200 \pm 22.3607}{250}$$
   - First contact (smallest positive root):
     $$t_{\text{TOI}} = \frac{200 - 22.3607}{250} = \frac{177.639}{250} \approx \mathbf{0.7106\text{ s}}$$

---

### Solution to Exercise 11.8
1. Initial kinetic energy along the normal direction:
   $$K_{n, i} = \frac{1}{2}\frac{v_n^2}{w_1 + w_2}$$
2. Final relative normal velocity is $v_n' = -e v_n$.
3. Final normal kinetic energy:
   $$K_{n, f} = \frac{1}{2}\frac{(v_n')^2}{w_1 + w_2} = \frac{1}{2}\frac{e^2 v_n^2}{w_1 + w_2}$$
4. Energy lost:
   $$\Delta K_{\text{loss}} = K_{n, i} - K_{n, f} = \mathbf{\frac{1}{2} \frac{1 - e^2}{w_1 + w_2} v_n^2}$$
   $$\blacksquare$$

---

### Solution to Exercise 11.9
1. Contacts: $C_1$ between 1 and 2, $C_2$ between 2 and 3, $C_3$ between 3 and the wall.
2. The Delassus matrix $\mathbf{A}_{ij} = \hat{n}_i^T \mathbf{W} \hat{n}_j$ for 3 identical unit masses in series is:
   $$\mathbf{A} = \begin{pmatrix} w_1 + w_2 & -w_2 & 0 \\ -w_2 & w_2 + w_3 & -w_3 \\ 0 & -w_3 & w_3 + w_{\text{wall}} \end{pmatrix} = \begin{pmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 1 \end{pmatrix}$$
3. External force vector pushing from left: $\vec{b} = (-F_0, 0, 0)^T$.
4. Solving $\mathbf{A} \vec{J} = -\vec{b} = (F_0, 0, 0)^T$:
   - Inverting the tridiagonal matrix yields:
     $$\mathbf{J_1 = F_0, \quad J_2 = F_0, \quad J_3 = F_0}$$
   All contacts transmit the identical normal force $F_0$ through to the wall without interpenetration!

---

### Solution to Exercise 11.10
1. The Velocity Verlet algorithm:
   $$x_{n+1} = x_n + v_n \Delta t + \frac{1}{2} a(x_n) \Delta t^2$$
   $$v_{n+1} = v_n + \frac{1}{2}[a(x_n) + a(x_{n+1})] \Delta t$$
2. Computing the Jacobian:
   $$\frac{\partial x_{n+1}}{\partial x_n} = 1 + \frac{1}{2}a'\Delta t^2, \quad \frac{\partial x_{n+1}}{\partial v_n} = \Delta t$$
   $$\frac{\partial v_{n+1}}{\partial x_n} = \frac{1}{2}a'\Delta t + \frac{1}{2}a'(x_{n+1})\Delta t\left(1 + \frac{1}{2}a'\Delta t^2\right)$$
   $$\frac{\partial v_{n+1}}{\partial v_n} = 1 + \frac{1}{2}a'(x_{n+1})\Delta t^2$$
   Direct expansion yields:
   $$\mathbf{\det(\mathbf{J}) \equiv 1.000000}$$
3. By backward error analysis, the numerical trajectory corresponds exactly to the exact flow of a shadow Hamiltonian:
   $$\mathbf{\tilde{H} = H(x, p) + \frac{\Delta t^2}{12} \left(\frac{p^2}{m} \frac{\partial^2 U}{\partial x^2} - 2\left(\frac{\partial U}{\partial x}\right)^2\right) + \mathcal{O}(\Delta t^4)}$$
   Because $\tilde{H}$ is strictly conserved, the energy error is bounded and cannot drift over time!


---

# Chapter 12: Production TypeScript Momentum Engine and the Civilizational Grand Gauntlet

> "In physics, theory without computation is a dream without limbs; computation without theory is a machine without a soul. When the exact vector calculus of momentum conservation is synthesized into an unyielding, deterministic simulation engine, we construct an engine of truth that can model everything from the deflection of subatomic alpha particles to the multi-stage ascent of interplanetary rockets."  
> — Computational Physics Architecture Standard

---

## 1. Architecture of the Sovereign Momentum & Collision Engine

In this chapter, we translate the complete mathematical apparatus developed across Chapters 1 through 11 into a production-grade, zero-dependency, fully typed TypeScript engine: `MomentumCollisionEngine`.

### 1.1 Structural Capabilities of the Engine

The engine provides:
1. **Particle Dynamics:** Full 2D vector kinematics ($x, y, v_x, v_y, a_x, a_y$) with variable mass ($m(t), \dot{m}$), finite radii, and individual material properties ($e, \mu$).
2. **Meshchersky Rocket Propulsion:** Continuous propellant mass ejection producing frame-invariant reaction thrust:
   $$\vec{F}_{\text{thrust}} = \vec{v}_{\text{rel}} \frac{dm}{dt}$$
3. **Discrete Contact Solver:** Robust impulse-based contact solver supporting:
   - Circle-to-Circle glancing impacts with arbitrary mass ratios and restitution.
   - Circle-to-Wall reflections with static boundaries.
   - Coulomb tangential friction impulses (stick-slip transition).
   - Baumgarte positional stabilization to eliminate sinking and numerical penetration drift.
4. **Symplectic Integration:** Semi-implicit Euler integration guaranteeing bounded energy behavior and strict conservation of center-of-mass velocity in isolated systems.
5. **Real-Time Diagnostic Invariants:** Live calculation of total system momentum $\vec{P}_{\text{total}}$, Center-of-Mass $\vec{R}_{\text{CM}}$, total kinetic energy $K_{\text{total}}$, and Koenig internal energy $K_{\text{int}}$.

---

## 2. Complete, Zero-Dependency TypeScript Implementation

```typescript
/**
 * SOVEREIGN MASTER TREATISE STANDARD: MODULE 05
 * Production-Grade 2D Momentum, Collision & Rocketry Engine
 * 
 * Zero external dependencies. Self-contained 2D vector math,
 * impulse-based contact solver, Baumgarte stabilization,
 * Meshchersky variable-mass rocket thrusters, and diagnostic invariants.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Particle {
  id: string;
  pos: Vector2D;
  vel: Vector2D;
  force: Vector2D;
  mass: number;         // Current mass [kg]
  dryMass: number;      // Structural dry mass [kg] (for rockets)
  invMass: number;      // 1 / mass [kg^-1] (0 for static boundaries)
  radius: number;       // Geometric radius [m]
  restitution: number;  // Normal restitution coefficient e in [0, 1]
  friction: number;     // Coulomb friction coefficient mu >= 0
  
  // Rocket thruster parameters
  isRocket: boolean;
  thrustMag: number;    // Thrust magnitude [N]
  thrustDir: Vector2D;  // Unit direction of forward thrust
  exhaustVel: number;   // Relative exhaust speed v_ex [m/s]
  burnRate: number;     // Mass loss rate |dm/dt| [kg/s]
}

export interface Wall {
  id: string;
  start: Vector2D;      // Line segment start
  end: Vector2D;        // Line segment end
  normal: Vector2D;     // Unit normal pointing into simulation domain
  restitution: number;
  friction: number;
}

export interface ContactManifold {
  bodyA: Particle;
  bodyB: Particle;
  normal: Vector2D;     // Unit normal pointing from A to B
  tangent: Vector2D;    // Unit tangent orthogonal to normal
  penetration: number;  // Overlap depth [m]
  restitution: number;
  friction: number;
}

export interface DiagnosticSnapshot {
  time: number;
  totalMass: number;
  totalMomentum: Vector2D;
  centerOfMass: Vector2D;
  cmVelocity: Vector2D;
  totalKineticEnergy: number;
  cmKineticEnergy: number;
  internalKineticEnergy: number;
  activeCollisions: number;
}

export class MomentumCollisionEngine {
  public particles: Particle[] = [];
  public walls: Wall[] = [];
  public gravity: Vector2D = { x: 0.0, y: -9.80665 };
  public time: number = 0.0;
  
  // Solver configuration parameters
  public baumgarteBeta: number = 0.20;       // Positional stabilization factor
  public penetrationSlop: number = 0.002;    // Allowed overlap before correction [m]
  public velocityThreshold: number = 0.05;   // Restitution cutoff (anti-jitter) [m/s]
  public solverIterations: number = 10;      // Sequential impulse iterations

  constructor(gravity: Vector2D = { x: 0.0, y: -9.80665 }) {
    this.gravity = gravity;
  }

  // --- VECTOR MATHEMATICS PRIMITIVES ---

  public static vec(x: number, y: number): Vector2D {
    return { x, y };
  }

  public static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  public static sub(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  public static scale(v: Vector2D, s: number): Vector2D {
    return { x: v.x * s, y: v.y * s };
  }

  public static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  public static cross(a: Vector2D, b: Vector2D): number {
    return a.x * b.y - a.y * b.x;
  }

  public static magSq(v: Vector2D): number {
    return v.x * v.x + v.y * v.y;
  }

  public static mag(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  public static normalize(v: Vector2D): Vector2D {
    const len = MomentumCollisionEngine.mag(v);
    if (len < 1e-12) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  }

  // --- ENTITY CREATION ---

  public addParticle(config: {
    id: string;
    pos: Vector2D;
    vel: Vector2D;
    mass: number;
    radius: number;
    restitution?: number;
    friction?: number;
    isRocket?: boolean;
    dryMass?: number;
    exhaustVel?: number;
    burnRate?: number;
    thrustDir?: Vector2D;
  }): Particle {
    const isStatic = config.mass <= 0 || !isFinite(config.mass);
    const m = isStatic ? Infinity : config.mass;
    const invM = isStatic ? 0.0 : 1.0 / m;

    const p: Particle = {
      id: config.id,
      pos: { ...config.pos },
      vel: { ...config.vel },
      force: { x: 0, y: 0 },
      mass: m,
      dryMass: config.dryMass ?? m,
      invMass: invM,
      radius: config.radius,
      restitution: config.restitution ?? 0.80,
      friction: config.friction ?? 0.20,
      isRocket: config.isRocket ?? false,
      thrustMag: 0,
      thrustDir: config.thrustDir ? MomentumCollisionEngine.normalize(config.thrustDir) : { x: 0, y: 1 },
      exhaustVel: config.exhaustVel ?? 3000.0,
      burnRate: config.burnRate ?? 0.0
    };

    if (p.isRocket && p.burnRate > 0) {
      p.thrustMag = p.exhaustVel * p.burnRate;
    }

    this.particles.push(p);
    return p;
  }

  public addWall(id: string, start: Vector2D, end: Vector2D, normal: Vector2D, restitution: number = 0.8, friction: number = 0.2): Wall {
    const w: Wall = {
      id,
      start,
      end,
      normal: MomentumCollisionEngine.normalize(normal),
      restitution,
      friction
    };
    this.walls.push(w);
    return w;
  }

  // --- COLLISION DETECTION (NARROWPHASE) ---

  private detectCollisions(): ContactManifold[] {
    const contacts: ContactManifold[] = [];
    const count = this.particles.length;

    for (let i = 0; i < count; i++) {
      const p1 = this.particles[i];

      // Particle-to-Particle Narrowphase
      for (let j = i + 1; j < count; j++) {
        const p2 = this.particles[j];
        if (p1.invMass === 0 && p2.invMass === 0) continue;

        const delta = MomentumCollisionEngine.sub(p2.pos, p1.pos);
        const distSq = MomentumCollisionEngine.magSq(delta);
        const minDist = p1.radius + p2.radius;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          const normal = dist > 1e-8
            ? MomentumCollisionEngine.scale(delta, 1.0 / dist)
            : { x: 1, y: 0 };

          const tangent = { x: -normal.y, y: normal.x };
          const penetration = minDist - dist;
          const combinedRestitution = Math.min(p1.restitution, p2.restitution);
          const combinedFriction = Math.sqrt(p1.friction * p2.friction);

          contacts.push({
            bodyA: p1,
            bodyB: p2,
            normal,
            tangent,
            penetration,
            restitution: combinedRestitution,
            friction: combinedFriction
          });
        }
      }

      // Particle-to-Wall Collisions
      for (const wall of this.walls) {
        // Distance from point to line segment
        const seg = MomentumCollisionEngine.sub(wall.end, wall.start);
        const toPt = MomentumCollisionEngine.sub(p1.pos, wall.start);
        const segLenSq = MomentumCollisionEngine.magSq(seg);
        const t = Math.max(0, Math.min(1, MomentumCollisionEngine.dot(toPt, seg) / segLenSq));
        const closest = MomentumCollisionEngine.add(wall.start, MomentumCollisionEngine.scale(seg, t));
        const diff = MomentumCollisionEngine.sub(p1.pos, closest);
        const dist = MomentumCollisionEngine.mag(diff);

        if (dist < p1.radius) {
          const normal = dist > 1e-8 ? MomentumCollisionEngine.scale(diff, 1.0 / dist) : wall.normal;
          const tangent = { x: -normal.y, y: normal.x };
          const penetration = p1.radius - dist;

          // Fake a static body for the wall
          const wallBody: Particle = {
            id: wall.id,
            pos: closest,
            vel: { x: 0, y: 0 },
            force: { x: 0, y: 0 },
            mass: Infinity,
            dryMass: Infinity,
            invMass: 0,
            radius: 0,
            restitution: wall.restitution,
            friction: wall.friction,
            isRocket: false,
            thrustMag: 0,
            thrustDir: { x: 0, y: 0 },
            exhaustVel: 0,
            burnRate: 0
          };

          contacts.push({
            bodyA: p1,
            bodyB: wallBody,
            normal: MomentumCollisionEngine.scale(normal, -1), // points from p1 to wall
            tangent,
            penetration,
            restitution: Math.min(p1.restitution, wall.restitution),
            friction: Math.sqrt(p1.friction * wall.friction)
          });
        }
      }
    }

    return contacts;
  }

  // --- SEQUENTIAL IMPULSE CONTACT SOLVER ---

  private solveVelocityConstraints(contacts: ContactManifold[], dt: number): void {
    for (let iter = 0; iter < this.solverIterations; iter++) {
      for (const c of contacts) {
        const A = c.bodyA;
        const B = c.bodyB;
        const wTotal = A.invMass + B.invMass;
        if (wTotal === 0) continue;

        // Relative velocity at contact point
        const vRel = MomentumCollisionEngine.sub(A.vel, B.vel);

        // 1. NORMAL IMPULSE
        const vNormal = MomentumCollisionEngine.dot(vRel, c.normal);

        // Baumgarte velocity bias for penetration resolution
        const bias = (this.baumgarteBeta / dt) * Math.max(0, c.penetration - this.penetrationSlop);

        // Restitution threshold check (prevent micro-bouncing jitter)
        let effectiveRestitution = c.restitution;
        if (Math.abs(vNormal) < this.velocityThreshold) {
          effectiveRestitution = 0.0;
        }

        const deltaJn = (-(1.0 + effectiveRestitution) * vNormal + bias) / wTotal;

        // Apply normal impulse if bodies are closing
        if (deltaJn > 0) {
          const impulseVector = MomentumCollisionEngine.scale(c.normal, deltaJn);
          A.vel = MomentumCollisionEngine.sub(A.vel, MomentumCollisionEngine.scale(impulseVector, A.invMass));
          B.vel = MomentumCollisionEngine.add(B.vel, MomentumCollisionEngine.scale(impulseVector, B.invMass));

          // 2. TANGENTIAL COULOMB FRICTION IMPULSE
          const vRelUpdated = MomentumCollisionEngine.sub(A.vel, B.vel);
          const vTangential = MomentumCollisionEngine.dot(vRelUpdated, c.tangent);
          const jtStick = -vTangential / wTotal;

          // Coulomb cone clamping: |J_t| <= mu * J_n
          const maxFriction = c.friction * deltaJn;
          const jt = Math.max(-maxFriction, Math.min(maxFriction, jtStick));

          const frictionVector = MomentumCollisionEngine.scale(c.tangent, jt);
          A.vel = MomentumCollisionEngine.add(A.vel, MomentumCollisionEngine.scale(frictionVector, A.invMass));
          B.vel = MomentumCollisionEngine.sub(B.vel, MomentumCollisionEngine.scale(frictionVector, B.invMass));
        }
      }
    }
  }

  // --- MAIN SIMULATION STEP ---

  public step(dt: number): void {
    if (dt <= 0) return;

    // Phase 1: Apply External Forces and Rocket Thrust
    for (const p of this.particles) {
      if (p.invMass === 0) continue;

      // Reset forces
      p.force = { x: 0, y: 0 };

      // Apply environmental gravity: F = m * g
      p.force.x += p.mass * this.gravity.x;
      p.force.y += p.mass * this.gravity.y;

      // Apply Meshchersky Rocket Thrust: F_thrust = v_ex * |dm/dt|
      if (p.isRocket && p.mass > p.dryMass && p.burnRate > 0) {
        const fuelConsumed = Math.min(p.mass - p.dryMass, p.burnRate * dt);
        const currentThrust = (fuelConsumed / dt) * p.exhaustVel;

        p.force.x += currentThrust * p.thrustDir.x;
        p.force.y += currentThrust * p.thrustDir.y;

        // Decrease rocket mass
        p.mass -= fuelConsumed;
        p.invMass = 1.0 / p.mass;
      }

      // Integrate velocity (Semi-Implicit Euler Stage 1)
      p.vel.x += (p.force.x * p.invMass) * dt;
      p.vel.y += (p.force.y * p.invMass) * dt;
    }

    // Phase 2: Detect Collisions
    const contacts = this.detectCollisions();

    // Phase 3: Iteratively Resolve Velocity Impulses and Friction
    this.solveVelocityConstraints(contacts, dt);

    // Phase 4: Integrate Positions (Semi-Implicit Euler Stage 2)
    for (const p of this.particles) {
      if (p.invMass === 0) continue;
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
    }

    this.time += dt;
  }

  // --- DIAGNOSTICS & CONSERVATION LAW AUDITING ---

  public computeDiagnostics(): DiagnosticSnapshot {
    let totalMass = 0;
    let Px = 0;
    let Py = 0;
    let Rx = 0;
    let Ry = 0;
    let totalKE = 0;

    for (const p of this.particles) {
      if (p.invMass === 0) continue;
      totalMass += p.mass;
      Px += p.mass * p.vel.x;
      Py += p.mass * p.vel.y;
      Rx += p.mass * p.pos.x;
      Ry += p.mass * p.pos.y;
      totalKE += 0.5 * p.mass * MomentumCollisionEngine.magSq(p.vel);
    }

    const cmX = totalMass > 0 ? Rx / totalMass : 0;
    const cmY = totalMass > 0 ? Ry / totalMass : 0;
    const cmVx = totalMass > 0 ? Px / totalMass : 0;
    const cmVy = totalMass > 0 ? Py / totalMass : 0;

    // Koenig's Theorem Partition
    const cmKE = 0.5 * totalMass * (cmVx * cmVx + cmVy * cmVy);
    const internalKE = Math.max(0, totalKE - cmKE);

    return {
      time: this.time,
      totalMass,
      totalMomentum: { x: Px, y: Py },
      centerOfMass: { x: cmX, y: cmY },
      cmVelocity: { x: cmVx, y: cmVy },
      totalKineticEnergy: totalKE,
      cmKineticEnergy: cmKE,
      internalKineticEnergy: internalKE,
      activeCollisions: this.detectCollisions().length
    };
  }
}
```

---

## 3. The Civilizational Grand Gauntlet: 10 Capstone Physics Challenges

The Grand Gauntlet tests total mastery across the entire spectrum of momentum, collisions, center-of-mass mechanics, variable-mass systems, and computational contact physics.

---

### Gauntlet Problem 1: Optimal Multi-Stage Rocket Staging with Structural Overhead
*A three-stage orbital launch vehicle has a total initial launch mass $M_0 = 500,000\text{ kg}$ and delivers a payload $m_{\text{payload}} = 5,000\text{ kg}$ into low Earth orbit ($\Delta v_{\text{target}} = 9,500\text{ m/s}$ in vacuum). Each stage $i \in \{1, 2, 3\}$ uses identical propellant with specific impulse $I_{\text{sp}} = 340\text{ s}$ ($v_{\text{ex}} = 3,334.3\text{ m/s}$) and has a structural deadweight fraction $\epsilon = 0.080$ ($\epsilon = m_{s, i} / (m_{s, i} + m_{p, i})$). Prove that equal stage payload ratios maximize final velocity, and find the required mass distribution among the three stages.*

---

### Gauntlet Problem 2: Galperin's Billiard Algorithm for Computing the Digits of $\pi$
*Consider two point masses sliding on a frictionless 1D track with an immovable rigid vertical wall at $x = 0$. Block 1 ($m_1 = 1\text{ kg}$) is initially at rest at $x_1 = 1.0\text{ m}$. Block 2 of mass $m_2 = 100^N\text{ kg}$ approaches from the right ($x_2 = 2.0\text{ m}$) with initial velocity $v_{2i} = -1.0\text{ m/s}$. All collisions (Block 2 with Block 1, and Block 1 with the wall) are perfectly elastic ($e = 1.00$). (a) For $N = 1$ ($m_2 = 100\text{ kg}$), calculate the total number of collisions that occur before Block 2 permanently recedes to infinity. (b) For $N = 2$ ($m_2 = 10,000\text{ kg}$), state the total collision count. (c) Prove that as $m_2 / m_1 = 100^N \to \infty$, the total number of collisions $K$ is exactly $\lfloor \pi \times 10^N \rfloor$.*

---

### Gauntlet Problem 3: Two-Dimensional Billiard Cascade with Spin-Induced Friction
*Three identical smooth billiard balls ($A, B, C$) of radius $R = 3.00\text{ cm}$ and mass $m = 0.170\text{ kg}$ rest in mutual contact on a frictionless table, with $B$ and $C$ touching symmetrically behind ball $A$. Ball 0 of the identical mass and radius strikes Ball $A$ head-on with velocity $\vec{v}_0 = (6.00\,\hat{i})\text{ m/s}$. Assuming all ball-to-ball collisions have normal restitution $e = 0.900$ and zero friction, determine the post-collision velocity vectors of all four balls.*

---

### Gauntlet Problem 4: Relativistic 4-Momentum Invariance in Particle Decay
*A high-energy neutral pion $\pi^0$ (rest mass $m_\pi = 135.0\text{ MeV}/c^2$) moving along the $+x$ axis with total relativistic energy $E_\pi = 225.0\text{ MeV}$ decays in flight into two photons: $\pi^0 \to \gamma_1 + \gamma_2$. In the laboratory frame, photon 1 is emitted at an angle $\theta_1 = +30.0^\circ$ relative to the $+x$ axis. Using relativistic 4-momentum conservation, determine: (a) the energy $E_{\gamma 1}$ of the first photon, (b) the emission angle $\theta_2$ of the second photon, and (c) the energy $E_{\gamma 2}$ of the second photon.*

---

### Gauntlet Problem 5: Falling Heavy Chain Dynamic Scale Impact
*A uniform flexible chain of mass $M = 6.00\text{ kg}$ and length $L = 3.00\text{ m}$ is held vertically by its upper end with its lowest link touching a digital scale pan. At $t = 0$, the chain is released from rest. Simultaneously, an external wind provides a horizontal drag force $F_x(y) = \alpha y$ on the suspended portion, where $\alpha = 2.00\text{ N/m}$. (a) Calculate the total vertical force reading $F_y(t)$ on the scale during the fall. (b) Find the scale reading at the exact instant the top link strikes the pan. (c) Calculate the total horizontal impulse delivered to the scale.*

---

### Gauntlet Problem 6: Hypervelocity Shock Hugoniot and Planetary Impact Cratering
*A stony chondrite meteorite of density $\rho_0 = 3,200\text{ kg/m}^3$ and radius $R = 20.0\text{ m}$ strikes a basaltic planetary surface ($\rho_t = 2,900\text{ kg/m}^3$) at $v_0 = 24.0\text{ km/s}$. The shock Hugoniot for basalt is $u_s = 4.50\text{ km/s} + 1.25\,u_p$. (a) Compute the particle velocity $u_p$ and the peak shock pressure $P_{\text{shock}}$ in GPa at the impact interface. (b) Determine the total kinetic energy delivered in Megatons of TNT equivalent. (c) Using the Schmidt-Housen crater scaling law $D = 1.16 \left(\frac{E_K}{\rho_t g}\right)^{0.22} \left(\frac{\rho_i}{\rho_t}\right)^{0.31}$, estimate the final crater diameter on Earth ($g = 9.80\text{ m/s}^2$).*

---

### Gauntlet Problem 7: Multi-Body Newton's Cradle Wave Propagation
*A linear array of five identical steel spheres ($m = 0.500\text{ kg}$ each) is suspended in a Newton's Cradle. Two spheres on the left are pulled back together and released from height $h = 0.200\text{ m}$, striking the three stationary spheres at speed $v_0 = \sqrt{2gh}$. Using the contact mechanics of Hertzian elastic stress wave transmission, prove why exactly two spheres emerge from the right at speed $v_0$, rather than one sphere emerging at speed $\sqrt{2}v_0$ (which would conserve energy and momentum).*

---

### Gauntlet Problem 8: 3D Double-Slingshot Interstellar Trajectory Optimization
*A probe of mass $m = 500\text{ kg}$ leaves Earth with hyperbolic excess speed $v_{\infty 1} = 8.00\text{ km/s}$ and performs an unpowered gravity assist around Jupiter ($M_J = 1.90 \times 10^{27}\text{ kg}, R_J = 71,492\text{ km}, V_J = 13.06\text{ km/s}$). Determine the minimum flyby periapsis radius $r_p$ that maximizes the post-flyby heliocentric speed, and calculate the maximum achievable heliocentric speed $v_{\text{helio, max}}$.*

---

### Gauntlet Problem 9: The Zeno Inelastic Bouncing Ball with Acoustic Losses
*A superball of mass $m = 0.050\text{ kg}$ is dropped from height $h_0 = 1.50\text{ m}$ onto a massive stone slab. On each bounce, the coefficient of normal restitution is $e = 0.850$, except that a fixed acoustic sound radiation loss $E_{\text{sound}} = 0.0020\text{ J}$ is dissipated per impact whenever $K_{\text{impact}} > E_{\text{sound}}$. (a) Calculate the total number of bounces before the ball's kinetic energy drops below $E_{\text{sound}}$. (b) Compute the total elapsed time until the ball comes to a complete rest.*

---

### Gauntlet Problem 10: Non-Inertial Momentum Flux in a Rotating Tether Space Elevator
*A rotating space tether of length $L = 200\text{ km}$ rotates in deep space with angular velocity $\Omega = 0.020\text{ rad/s}$ about its center of mass. A climber robot of mass $m = 1,000\text{ kg}$ climbs radially outward from the hub to the tether tip at constant relative speed $v_{\text{rel}} = 50.0\text{ m/s}$. Derive the total lateral Coriolis reaction force $F_{\text{Coriolis}}(t)$ exerted by the climber on the tether, and calculate the total angular momentum transferred to the tether upon reaching the tip.*

---

## 4. Complete, Unabridged Solutions to the Civilizational Grand Gauntlet

---

### Solution to Gauntlet Problem 1
1. **Governing Multi-Stage Equations:**
   - Let $N = 3$. Total payload fraction $\Lambda = m_{\text{payload}} / M_0 = 5,000 / 500,000 = 0.0100$.
   - For identical exhaust velocities $v_{\text{ex}} = 3,334.3\text{ m/s}$ and identical structural fractions $\epsilon = 0.080$, maximum velocity occurs when each stage has an identical payload ratio $\lambda_i = \lambda = \Lambda^{1/3}$:
     $$\lambda = (0.0100)^{1/3} \approx 0.215443$$
2. **Individual Stage Mass Ratios:**
   - The stage mass ratio is:
     $$R_{m, i} = \frac{1 + \lambda}{\epsilon + \lambda} = \frac{1 + 0.215443}{0.080 + 0.215443} = \frac{1.215443}{0.295443} \approx 4.11397$$
3. **Total Velocity Increment $\Delta v_{\text{total}}$:**
   $$\Delta v_i = v_{\text{ex}} \ln(R_{m, i}) = 3,334.3 \times \ln(4.11397) = 3,334.3 \times 1.41441 \approx 4,716.0\text{ m/s}$$
   $$\Delta v_{\text{total}} = 3 \times \Delta v_i = 3 \times 4,716.0 = \mathbf{14,148\text{ m/s} = 14.15\text{ km/s}}$$
   (Surpasses the orbital requirement of $9,500\text{ m/s}$ with a massive margin!).
4. **Mass Breakdown:**
   - Stage 3 initial mass: $m_{03} = m_{\text{payload}} / \lambda = 5,000 / 0.215443 \approx 23,208\text{ kg}$.
   - Stage 2 initial mass: $m_{02} = m_{03} / \lambda = 23,208 / 0.215443 \approx 107,722\text{ kg}$.
   - Stage 1 initial mass: $m_{01} = m_{02} / \lambda = 107,722 / 0.215443 \approx \mathbf{500,000\text{ kg}}$.
   - Stage 1 wet mass: $500,000 - 107,722 = \mathbf{392,278\text{ kg}}$.
   - Stage 2 wet mass: $107,722 - 23,208 = \mathbf{84,514\text{ kg}}$.
   - Stage 3 wet mass: $23,208 - 5,000 = \mathbf{18,208\text{ kg}}$.

---

### Solution to Gauntlet Problem 2
1. **Galperin Coordinate Transformation:**
   - Rescale coordinates to circular phase space:
     $$y_1 = \sqrt{m_1} x_1, \quad y_2 = \sqrt{m_2} x_2$$
     $$u_1 = \sqrt{m_1} v_1, \quad u_2 = \sqrt{m_2} v_2$$
   - Conservation of energy:
     $$\frac{1}{2}m_1 v_1^2 + \frac{1}{2}m_2 v_2^2 = \frac{1}{2}(u_1^2 + u_2^2) = E = \text{constant}$$
   - In $(y_1, y_2)$ space, the trajectory is a series of specular ray reflections between two planar boundaries:
     - Boundary 1: Wall reflection at $x_1 = 0 \implies y_1 = 0$ (vertical axis).
     - Boundary 2: Collision between blocks at $x_1 = x_2 \implies \frac{y_1}{\sqrt{m_1}} = \frac{y_2}{\sqrt{m_2}} \implies y_2 = \sqrt{\frac{m_2}{m_1}} y_1$.
2. **Angle of the Wedge ($\alpha$):**
   $$\tan\alpha = \sqrt{\frac{m_1}{m_2}} \implies \alpha = \arctan\left(\sqrt{\frac{m_1}{m_2}}\right)$$
3. **Total Number of Reflections:**
   - Each collision corresponds to one reflection across the wedge. The total number of reflections before a ray exits the wedge of opening angle $\alpha$ is:
     $$K = \left\lfloor \frac{\pi}{\alpha} \right\rfloor$$
4. **Evaluations:**
   - **Part (a): $N = 1$ ($m_2 = 100\text{ kg}, m_1 = 1\text{ kg}$):**
     $$\tan\alpha = \sqrt{1/100} = 0.100 \implies \alpha = \arctan(0.100) \approx 0.09966865\text{ rad}$$
     $$K = \left\lfloor \frac{\pi}{0.09966865} \right\rfloor = \lfloor 31.5204 \rfloor = \mathbf{31\text{ collisions}}$$
     (The first 2 digits of $\pi = 3.14\dots$).
   - **Part (b): $N = 2$ ($m_2 = 10,000\text{ kg}$):**
     $$\tan\alpha = \sqrt{1/10,000} = 0.010 \implies \alpha \approx 0.0099996667\text{ rad}$$
     $$K = \left\lfloor \frac{\pi}{0.0099996667} \right\rfloor = \lfloor 314.159 \rfloor = \mathbf{314\text{ collisions}}$$
     (The first 3 digits of $\pi$!).
   - **Part (c): General Proof for $m_2 / m_1 = 100^N$:**
     As $N \to \infty$, $\sqrt{m_1/m_2} = 10^{-N} \ll 1$.
     Using small-angle expansion: $\alpha = \arctan(10^{-N}) = 10^{-N} - \mathcal{O}(10^{-3N})$.
     $$K = \left\lfloor \frac{\pi}{10^{-N}} \right\rfloor = \mathbf{\lfloor \pi \times 10^N \rfloor}$$
     $$\blacksquare$$

---

### Solution to Gauntlet Problem 3
1. **Geometry of the Tri-Ball Cluster:**
   - Balls $B$ and $C$ touch ball $A$. From the equilateral geometry:
     The line of centers from $A$ to $B$ makes an angle $\theta = -30.0^\circ$ with $+x$.
     The line of centers from $A$ to $C$ makes an angle $\theta = +30.0^\circ$ with $+x$.
2. **First Impact (Ball 0 strikes Ball A Head-On):**
   - $m_0 = m_A$, $e = 0.900$.
   - 1D collision:
     $$v_{0f} = \frac{1 - e}{2} v_0 = \frac{1 - 0.900}{2}(6.00) = \mathbf{+0.300\,\hat{i}\text{ m/s}}$$
     $$v_{Af} = \frac{1 + e}{2} v_0 = \frac{1 + 0.900}{2}(6.00) = +5.700\,\hat{i}\text{ m/s}$$
3. **Second Impact (Ball A strikes Balls B and C Simultaneously):**
   - Ball A delivers normal impulses $J_n$ symmetrically along $\hat{n}_B = (\cos(-30^\circ)\hat{i} + \sin(-30^\circ)\hat{j})$ and $\hat{n}_C = (\cos(30^\circ)\hat{i} + \sin(30^\circ)\hat{j})$.
   - Normal components: $\cos(30^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$.
   - Normal approach speed: $v_n = v_A \cos(30^\circ) = 5.700 \times 0.866025 \approx 4.9363\text{ m/s}$.
   - Effective mass along normal:
     $$J_n = \frac{m (1 + e) v_n}{1 + 2\cos^2(30^\circ)} = \frac{0.170 \times (1.900) \times 4.9363}{1 + 2(0.75)} = \frac{1.5944}{2.50} \approx 0.6378\text{ N}\cdot\text{s}$$
4. **Final Velocities:**
   - **Ball 0:** $\mathbf{\vec{v}_0 = (0.300\,\hat{i})\text{ m/s}}$
   - **Ball B:** $\vec{v}_B = \frac{J_n}{m} \hat{n}_B = \frac{0.6378}{0.170}(0.8660\,\hat{i} - 0.500\,\hat{j}) = \mathbf{(3.25\,\hat{i} - 1.88\,\hat{j})\text{ m/s}}$
   - **Ball C:** $\vec{v}_C = \frac{J_n}{m} \hat{n}_C = \mathbf{(3.25\,\hat{i} + 1.88\,\hat{j})\text{ m/s}}$
   - **Ball A:**
     $$v_{Ax, f} = v_A - \frac{2 J_n \cos(30^\circ)}{m} = 5.700 - \frac{2(0.6378)(0.8660)}{0.170} = 5.700 - 6.500 = \mathbf{-0.80\,\hat{i}\text{ m/s}}$$

---

### Solution to Gauntlet Problem 4
1. **Relativistic Kinematics of Parent Pion:**
   - Rest mass $m_\pi c^2 = 135.0\text{ MeV}$, Total energy $E = 225.0\text{ MeV}$.
   - Pion momentum:
     $$p_\pi c = \sqrt{E^2 - (m_\pi c^2)^2} = \sqrt{225.0^2 - 135.0^2} = \sqrt{50,625 - 18,225} = \sqrt{32,400} = \mathbf{180.0\text{ MeV}}$$
2. **4-Momentum Conservation:**
   - Photons have $E = p c$.
   - Energy: $E_1 + E_2 = E = 225.0\text{ MeV} \implies E_2 = 225.0 - E_1$.
   - $x$-momentum: $E_1 \cos(30^\circ) + E_2 \cos\theta_2 = 180.0\text{ MeV}$.
   - $y$-momentum: $E_1 \sin(30^\circ) - E_2 \sin\theta_2 = 0 \implies E_2 \sin\theta_2 = E_1 \sin(30^\circ) = 0.500 E_1$.
3. **Invariant Mass Formulation:**
   - $P^\mu P_\mu = m_\pi^2 c^4 = (P_1 + P_2)^2 = 2 P_1 \cdot P_2 = 2 E_1 E_2 (1 - \cos\theta_{\text{total}})$.
   - Using energy-momentum relation:
     $$E_1 = \frac{m_\pi^2 c^4}{2 [E - p_\pi c \cos\theta_1]} = \frac{(135.0)^2}{2 [225.0 - 180.0 \cos(30.0^\circ)]} = \frac{18,225}{2 [225.0 - 180.0(0.866025)]}$$
     $$\text{Denominator} = 2 [225.0 - 155.885] = 2 [69.115] = 138.23$$
     $$\mathbf{E_{\gamma 1} = \frac{18,225}{138.23} \approx 131.85\text{ MeV}}$$
4. **Parts (b) & (c): Second Photon:**
   - Energy:
     $$\mathbf{E_{\gamma 2} = 225.0 - 131.85 = 93.15\text{ MeV}}$$
   - Angle $\theta_2$:
     $$\sin\theta_2 = \frac{E_1 \sin(30.0^\circ)}{E_2} = \frac{131.85 \times 0.500}{93.15} = \frac{65.925}{93.15} \approx 0.7077$$
     $$\mathbf{\theta_2 = \arcsin(0.7077) \approx 45.05^\circ \approx -45.1^\circ}$$

---

### Solution to Gauntlet Problem 5
1. **Vertical Fall Dynamics:**
   - The chain falls freely under gravity $g = 9.80\text{ m/s}^2$. At time $t$, distance fallen is $y(t) = \frac{1}{2} g t^2$, and velocity is $v(t) = gt$.
   - Scale force:
     $$F_y(t) = W_{\text{static}}(t) + F_{\text{impulse}}(t) = \mu y g + \mu v^2 = \mu \left(\frac{1}{2} g t^2\right) g + \mu (gt)^2 = \frac{3}{2}\mu g^2 t^2 = \mathbf{3\mu y g}$$
2. **Part (b): Force at Instant Top Strikes ($y = L = 3.00\text{ m}$):**
   - Total mass $M = 6.00\text{ kg} \implies \mu = M / L = 2.00\text{ kg/m}$.
   $$\mathbf{F_{y, \max} = 3 M g = 3 \times (6.00) \times (9.80) = 176.4\text{ N}}$$
3. **Part (c): Total Horizontal Impulse:**
   - At height $z$ from the top, wind force on suspended portion $(L - y)$ is:
     $$F_{\text{wind}}(t) = \alpha (L - y) = \alpha \left(L - \frac{1}{2}gt^2\right)$$
   - Total fall time: $t_{\text{fall}} = \sqrt{\frac{2L}{g}} = \sqrt{\frac{2 \times 3.00}{9.80}} = \sqrt{0.6122} \approx 0.7825\text{ s}$.
   - Total horizontal impulse:
     $$J_x = \int_0^{t_{\text{fall}}} \alpha \left(L - \frac{1}{2}gt^2\right) dt = \alpha \left[L t - \frac{1}{6}gt^3\right]_0^{t_{\text{fall}}} = \alpha t_{\text{fall}} \left(L - \frac{1}{6}g \frac{2L}{g}\right) = \alpha t_{\text{fall}} \left(L - \frac{L}{3}\right) = \frac{2}{3} \alpha L t_{\text{fall}}$$
     $$J_x = \frac{2}{3} \times (2.00\text{ N/m}) \times (3.00\text{ m}) \times (0.7825\text{ s}) = 4.00 \times 0.7825 = \mathbf{3.13\text{ N}\cdot\text{s}}$$

---

### Solution to Gauntlet Problem 6
1. **Shock Pressure Calculation:**
   - Meteorite $\rho_m = 3,200\text{ kg/m}^3$, Basalt $\rho_t = 2,900\text{ kg/m}^3$, $v_0 = 24.0\text{ km/s} = 24,000\text{ m/s}$.
   - Planar shock impedance matching:
     $$u_p \approx \frac{\sqrt{\rho_m}}{\sqrt{\rho_m} + \sqrt{\rho_t}} v_0 = \frac{\sqrt{3,200}}{\sqrt{3,200} + \sqrt{2,900}} \times 24.0 = \frac{56.57}{56.57 + 53.85} \times 24.0 = \frac{56.57}{110.42} \times 24.0 \approx \mathbf{12.29\text{ km/s}}$$
   - Shock speed:
     $$u_s = 4.50 + 1.25(12.29) = 4.50 + 15.36 = \mathbf{19.86\text{ km/s}}$$
   - Peak Shock Pressure:
     $$P_{\text{shock}} = \rho_t u_s u_p = (2,900) \times (19,860) \times (12,290) \approx 7.078 \times 10^{11}\text{ Pa} \approx \mathbf{708\text{ GPa}}$$
2. **Kinetic Energy:**
   - Volume: $V = \frac{4}{3}\pi (20.0)^3 \approx 33,510\text{ m}^3$.
   - Mass: $M = 3,200 \times 33,510 \approx 1.072 \times 10^8\text{ kg}$.
   $$E_K = \frac{1}{2}(1.072 \times 10^8)(24,000)^2 = 5.36 \times 10^7 \times 5.76 \times 10^8 \approx \mathbf{3.087 \times 10^{16}\text{ J}}$$
   - Megatons TNT:
     $$E_{\text{Mton}} = \frac{3.087 \times 10^{16}}{4.184 \times 10^{15}} \approx \mathbf{7.38\text{ Megatons of TNT}}$$
3. **Crater Diameter:**
   $$\frac{E_K}{\rho_t g} = \frac{3.087 \times 10^{16}}{2,900 \times 9.80} = \frac{3.087 \times 10^{16}}{28,420} \approx 1.086 \times 10^{12}\text{ m}^4$$
   $$(1.086 \times 10^{12})^{0.22} \approx 446.4$$
   $$\left(\frac{\rho_i}{\rho_t}\right)^{0.31} = \left(\frac{3,200}{2,900}\right)^{0.31} = (1.1034)^{0.31} \approx 1.031$$
   $$D = 1.16 \times 446.4 \times 1.031 \approx \mathbf{534\text{ m}}$$

---

### Solution to Gauntlet Problem 7
1. **The Apparent Paradox:**
   A single sphere departing with speed $v' = \sqrt{2}v_0$ would satisfy both:
   - Momentum: $2 m v_0 = m (\sqrt{2}v_0) \implies \text{Error: } 2 \ne 1.414$!
   Notice immediately that **momentum is not conserved** if one sphere leaves with $\sqrt{2}v_0$!
   To satisfy both $P$ and $K$ with $N$ spheres moving at speed $v'$:
   $$2 m v_0 = N m v' \implies v' = \frac{2}{N} v_0$$
   $$\frac{1}{2}(2m) v_0^2 = \frac{1}{2}(Nm) (v')^2 \implies 2 v_0^2 = N \left(\frac{2}{N} v_0\right)^2 = \frac{4}{N} v_0^2 \implies N = 2, v' = v_0$$
2. **Contact Dynamics Proof:**
   In Hertzian contact mechanics, a stress wave consists of discrete non-linear solitons. The two incoming balls form two successive compression pulses separated in time. These two pulses pass through the intermediate resting spheres independently as acoustic solitons and eject exactly the two rightmost spheres sequentially!

---

### Solution to Gauntlet Problem 8
1. **Jupiter Gravitational Parameter:**
   $$\mu_J = G M_J = (6.674 \times 10^{-11})(1.90 \times 10^{27}) = 1.268 \times 10^{17}\text{ m}^3/\text{s}^2$$
2. **Safe Minimum Periapsis Radius:**
   - Setting $r_p = R_J + 1,000\text{ km} = 72,492\text{ km} = 7.2492 \times 10^7\text{ m}$.
3. **Approach Speed in Jupiter Frame:**
   - Jupiter orbital velocity: $V_J = 13.06\text{ km/s}$.
   - Relative approach speed: $v_\infty = v_{\infty 1} + V_J = 8.00 + 13.06 = 21.06\text{ km/s} = 21,060\text{ m/s}$.
4. **Eccentricity and Deflection:**
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{\mu_J} = 1 + \frac{(7.2492 \times 10^7) \times (21,060)^2}{1.268 \times 10^{17}} = 1 + \frac{3.215 \times 10^{16}}{1.268 \times 10^{17}} = 1 + 0.2535 = 1.2535$$
   $$\sin(\delta/2) = \frac{1}{1.2535} \approx 0.7978 \implies \delta/2 \approx 52.92^\circ \implies \delta \approx 105.8^\circ$$
5. **Maximum Heliocentric Velocity:**
   - In the velocity vector triangle:
     $$v_{\text{helio, max}} = \sqrt{V_J^2 + v_\infty^2 + 2 V_J v_\infty \cos(180^\circ - \delta)}$$
     $$\mathbf{v_{\text{helio, max}} \approx 32.4\text{ km/s}}$$

---

### Solution to Gauntlet Problem 9
1. **Initial Energy:**
   $$E_0 = m g h_0 = (0.050)(9.80)(1.50) = 0.735\text{ J}$$
2. **Energy After Each Bounce with Constant Acoustic Loss:**
   - After bounce 1: $E_1 = e^2 E_0 - E_{\text{sound}} = (0.850)^2(0.735) - 0.0020 = 0.7225(0.735) - 0.0020 = 0.5310 - 0.0020 = 0.5290\text{ J}$.
   - Effective exponential decay rate: $e^2 = 0.7225$.
   - Number of bounces $N$ to drop from $0.735\text{ J}$ to $0.0020\text{ J}$:
     $$(0.7225)^N \approx \frac{0.0020}{0.735} \approx 0.002721$$
     $$N \ln(0.7225) = \ln(0.002721) \implies N(-0.3250) = -5.9066 \implies \mathbf{N \approx 18\text{ bounces}}$$
3. **Total Elapsed Time:**
   - Initial drop time: $t_0 = \sqrt{2h_0 / g} = \sqrt{3.00 / 9.80} \approx 0.5533\text{ s}$.
   - Subsequent bounces:
     $$T_{\text{total}} = t_0 + 2 t_0 \sum_{n=1}^{18} e^n \approx t_0 \left(\frac{1 + e}{1 - e}\right) = 0.5533 \times \left(\frac{1.850}{0.150}\right) = 0.5533 \times 12.333 \approx \mathbf{6.82\text{ seconds}}$$

---

### Solution to Gauntlet Problem 10
1. **Coriolis Acceleration:**
   - Relative radial velocity: $\vec{v}_{\text{rel}} = v_{\text{rel}} \hat{r} = 50.0\,\hat{r}\text{ m/s}$.
   - Angular velocity: $\vec{\Omega} = \Omega\,\hat{k} = 0.020\,\hat{k}\text{ rad/s}$.
   $$\vec{a}_{\text{Coriolis}} = 2 (\vec{\Omega} \times \vec{v}_{\text{rel}}) = 2(0.020)(50.0)\hat{\theta} = \mathbf{2.00\,\hat{\theta}\text{ m/s}^2}$$
2. **Coriolis Reaction Force on Tether:**
   $$F_{\text{Coriolis}} = m a_{\text{Coriolis}} = (1,000\text{ kg}) \times (2.00\text{ m/s}^2) = \mathbf{2,000\text{ N} = 2.00\text{ kN}}$$
   (Constant lateral force opposing the rotation direction).
3. **Total Angular Momentum Transferred to Tether:**
   - Radius increases as $r(t) = v_{\text{rel}} t$ from $r = 0$ to $r = L/2 = 100\text{ km} = 1.00 \times 10^5\text{ m}$.
   - Angular momentum of climber at tip:
     $$L_{\text{climber}} = m r_{\text{tip}}^2 \Omega = (1,000) \times (1.00 \times 10^5)^2 \times (0.020) = 1,000 \times 10^{10} \times 0.020 = \mathbf{2.00 \times 10^{11}\text{ kg}\cdot\text{m}^2/\text{s}}$$
   - By conservation of angular momentum, the tether's rotational spin slows down by exactly $\Delta L = -2.00 \times 10^{11}\text{ kg}\cdot\text{m}^2/\text{s}$!
