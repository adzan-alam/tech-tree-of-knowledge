# CHAPTER 02: Operational Definitions — Mass, Force, & Vector Equilibrium

> "The quantity of matter is that which arises conjointly from its density and magnitude... The quantity of motion is that which arises conjointly from the velocity and quantity of matter."
> — **Sir Isaac Newton**, *Principia Mathematica*, Definitions I & II (1687)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Define mass operationally and distinguish rigorously between **inertial mass** ($m_i$), **gravitational mass** ($m_g$), and weight ($W$).
2. Explain the significance of the Eötvös experiment and the Equivalence Principle establishing the exact identity $m_i \equiv m_g$.
3. Classify all physical forces into fundamental interactions versus contact forces, and state their operational calibration criteria via Hookean dynamometers.
4. Apply the principle of vector superposition to calculate the net force vector $\vec{F}_{\text{net}} = \sum \vec{F}_i$ across arbitrary 2D force configurations.
5. Formulate and solve the conditions for **2D Static Equilibrium** ($\sum F_x = 0$, $\sum F_y = 0$) for concurrent force systems.
6. Derive and apply **Lami’s Theorem** for three coplanar concurrent forces in static equilibrium.
7. Solve multi-cable suspension networks, crane booms, and bracket trusses with uncompromising trigonometric and algebraic precision.

---

## 2.1 The Mystery of Mass: Inertial vs. Gravitational

In everyday colloquial conversation, people carelessly conflate three completely different physical properties:
- **Volume:** How much spatial room an object occupies ($\text{m}^3$).
- **Weight:** The gravitational force exerted on an object by a celestial body ($\text{N}$).
- **Mass:** The quantitative measure of an object's matter and inertia ($\text{kg}$).

A block of expanded styrofoam may have ten times the volume of a lead fishing sinker, yet its mass is a small fraction of the lead's mass. 
If an astronaut transports that lead sinker to the surface of the Moon, its weight drops by a factor of six (from $9.8\,\text{N}$ down to $1.6\,\text{N}$), but its mass remains stubbornly, identically $1.0\,\text{kg}$.

Even more profound is the subtle dual nature of mass within classical mechanics:

```
                            The Dual Nature of Mass
                            
          Inertial Mass (m_i)                    Gravitational Mass (m_g)
                   |                                        |
                   v                                        v
      "Resistance to Acceleration"             "Coupling to Gravitational Field"
                   |                                        |
                   v                                        v
             F = m_i * a                              F_g = m_g * g
                   |                                        |
                   +-------------------+--------------------+
                                       |
                                       v
                        The Equivalence Principle:
                                m_i == m_g
                      (Verified to 1 part in 10^15!)
```

### 1. Inertial Mass ($m_i$)
Inertial mass is an object's resistance to being accelerated by **any** net force (whether electromagnetic, mechanical, tension, or contact):
$$m_i = \frac{|\vec{F}|}{|\vec{a}|}$$
If an identical force of $100\,\text{N}$ is applied to two different objects floating in deep space, and Object A accelerates at $10\,\text{m/s}^2$ while Object B accelerates at $1\,\text{m/s}^2$, Object B possesses ten times the inertial mass of Object A.

### 2. Gravitational Mass ($m_g$)
Gravitational mass is the "gravitational charge" of an object—its susceptibility to feeling gravitational attraction, and its ability to create a gravitational field:
$$F_g = G \frac{m_{g,1} m_{g,2}}{r^2} = m_g g$$

### The Miraculous Equivalence
A priori, there is zero mathematical reason why inertial mass and gravitational mass must be identical. An electric charge has electrical susceptibility ($q$), but its inertia is governed by $m_i$; $q$ and $m_i$ are completely independent parameters.

Yet in gravity, the quantity that determines how strongly an object is pulled ($m_g$) is **identically equal** to the quantity that determines how stubbornly it resists being pulled ($m_i$):
$$m_i a = m_g g \implies a = \left(\frac{m_g}{m_i}\right) g$$

Because $m_g / m_i = 1$ identically, **all objects fall with the exact same acceleration $g$ in a vacuum**, regardless of their mass, material composition, or internal structure!
This equality was tested by Loránd Eötvös in 1889 to 1 part in $10^9$, by modern satellite experiments (MICROSCOPE) to 1 part in $10^{15}$, and served as the direct conceptual foundation for Albert Einstein's General Theory of Relativity.

---

## 2.2 Operational Definition of Force

What is a **force**?
In layman terms, force is intuitively described as a "push or a pull." In physics, we require an **operational definition**—a concrete, reproducible measurement procedure:

1. **The Static Hookean Standard:**
   A standardized steel coil spring is anchored at one end. When stretched by a displacement $\Delta x$, it exerts a restoring force governed by Hooke's Law:
   $$F_s = k \Delta x$$
   By defining a reference spring with a calibrated spring constant $k = 1.0\,\text{N/cm}$, any unknown force can be measured statically by measuring the exact millimeter extension of the spring.

2. **The Dynamic Acceleration Standard:**
   By international convention, **one Newton ($1\,\text{N}$)** is defined as the magnitude of net force required to accelerate a standardized international prototype of mass $1\,\text{kg}$ at exactly $1\,\text{m/s}^2$:
   $$1\,\text{N} \equiv 1\,\text{kg}\cdot\text{m/s}^2$$

### Classification of Forces in Classical Mechanics
In the universe, there exist only four fundamental forces:
1. **Gravitation** (infinite range, universally attractive).
2. **Electromagnetism** (infinite range, attractive or repulsive).
3. **Strong Nuclear Force** (femtometer range, binds atomic nuclei).
4. **Weak Nuclear Force** (subatomic range, governs radioactive beta decay).

In human-scale classical mechanics, **every single non-gravitational force we encounter is an electromagnetic contact force in disguise**:
- **Normal Force ($N$):** Electrostatic repulsion between the outer electron clouds of adjacent atomic layers when two surfaces are compressed together.
- **Friction Force ($f$):** Microscopic electromagnetic bonding, shearing of microscopic surface asperities, and cold-welding between surface contact points.
- **Tension ($T$):** Intermolecular covalent and metallic bonds pulling back against axial stretching inside a rope or cable.
- **Spring Force ($F_s$):** Elastic distortion of metallic atomic crystal lattices.
- **Fluid Drag / Air Resistance ($F_d$):** Momentum transfer and molecular collisions from atmospheric nitrogen and oxygen molecules bouncing off a moving body.

---

## 2.3 The Principle of Vector Superposition

When multiple forces $\vec{F}_1, \vec{F}_2, \dots, \vec{F}_n$ act simultaneously on a single point mass, nature does not process them sequentially. They combine **simultaneously and vectorially**.

The total physical effect on the body is identical to the effect of a single equivalent **Net Force vector ($\vec{F}_{\text{net}}$)**:
$$\vec{F}_{\text{net}} = \sum_{i=1}^n \vec{F}_i = \vec{F}_1 + \vec{F}_2 + \dots + \vec{F}_n$$

```
                    Vector Superposition of Forces
                    
                             +y
                              ^
                              |     F_2
                              |    /
                              |   /
                              |  / 
                              | /      F_net = F_1 + F_2
                              |/     /
        ----------------------*-----+---------> +x
                             /|    /
                            / |   /
                           /  |  /
                          /   | /
                         v    |/
                       F_1    v
```

In 2D Cartesian coordinates:
$$\vec{F}_{\text{net}} = F_{\text{net}, x}\,\hat{i} + F_{\text{net}, y}\,\hat{j}$$
where the scalar components are computed by independent arithmetic summation:
$$\begin{aligned}
F_{\text{net}, x} &= \sum_{i=1}^n F_{ix} = F_{1x} + F_{2x} + \dots + F_{nx} \\
F_{\text{net}, y} &= \sum_{i=1}^n F_{iy} = F_{1y} + F_{2y} + \dots + F_{ny}
\end{aligned}$$

The magnitude and direction of the net force are:
$$|\vec{F}_{\text{net}}| = \sqrt{F_{\text{net}, x}^2 + F_{\text{net}, y}^2}$$
$$\theta_{\text{net}} = \operatorname{atan2}(F_{\text{net}, y}, F_{\text{net}, x})$$

---

## 2.4 The Conditions for 2D Static Equilibrium

A particle or concurrent force system is in **Static Equilibrium** if it remains permanently at rest.
By Newton's First Law, being at rest requires that the net external force vector must vanish identically:

$$\vec{F}_{\text{net}} = \vec{0}$$

In two dimensions, this single vector equation decouples into **two independent scalar equations**:

$$\sum F_x = 0$$
$$\sum F_y = 0$$

Every static equilibrium problem in planar mechanics is fundamentally an exercise in decomposing force vectors into orthogonal components and solving this linear system of equations for unknown magnitudes or angles.

### Ideal Structural Assumptions in Classical Dynamics:
1. **The Ideal String/Cable:** Massless ($m_{\text{string}} \approx 0$) and perfectly inextensible ($\Delta L = 0$). Tension is uniform throughout its length. A string can only **pull** along its axis; it can never push.
2. **The Ideal Pulley:** Massless ($I = 0$) and frictionless. An ideal pulley changes the **direction** of a cable's tension vector with zero change in tension magnitude.
3. **The Ideal Strut:** A rigid compressive member that can push along its longitudinal axis.

---

## 2.5 Lami’s Theorem for Three Concurrent Coplanar Forces

When exactly **three** coplanar forces act on a body in static equilibrium ($\vec{F}_1 + \vec{F}_2 + \vec{F}_3 = \vec{0}$), their vectors, when placed tip-to-tail, must form a **closed triangle**.

```
                   Lami's Theorem Geometry
                   
                       F_2
                        ^
                        |
                        |   gamma
                        |  /
           beta        | /
              \         |/
               \--------*---------> F_1
                       /
                      /  alpha
                     /
                    v
                   F_3
```

Applying the Law of Sines to this closed force triangle yields **Lami's Theorem**:

$$\frac{|\vec{F}_1|}{\sin\alpha} = \frac{|\vec{F}_2|}{\sin\beta} = \frac{|\vec{F}_3|}{\sin\gamma}$$

where:
- $\alpha$ is the angle between $\vec{F}_2$ and $\vec{F}_3$.
- $\beta$ is the angle between $\vec{F}_1$ and $\vec{F}_3$.
- $\gamma$ is the angle between $\vec{F}_1$ and $\vec{F}_2$.

Lami’s theorem provides an exceptionally rapid, elegant method for solving three-force equilibrium problems without decomposing vectors into Cartesian coordinates.

---

## 2.6 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 2.1: Vector Resultant of Three Concurrent Forces
**Problem:** Three horizontal tugboats pull on a stranded cargo barge at point $O$:
- Boat 1 pulls with $\vec{F}_1 = 40.0\,\text{kN}$ along bearing $000^\circ$ (due North, $+y$).
- Boat 2 pulls with $\vec{F}_2 = 60.0\,\text{kN}$ along bearing $060^\circ$ ($30.0^\circ$ North of East).
- Boat 3 pulls with $\vec{F}_3 = 50.0\,\text{kN}$ along bearing $135^\circ$ ($45.0^\circ$ South of East).
Calculate the magnitude and direction of the resultant net force $\vec{F}_{\text{net}}$ acting on the barge.

#### Solution
**Step 1: Component decomposition**
Let $+x$ be East and $+y$ be North.
- Boat 1 ($\theta_1 = 90.0^\circ$):
  $$F_{1x} = 40.0 \cos(90.0^\circ) = 0.0\,\text{kN}$$
  $$F_{1y} = 40.0 \sin(90.0^\circ) = +40.0\,\text{kN}$$
- Boat 2 ($\theta_2 = 30.0^\circ$):
  $$F_{2x} = 60.0 \cos(30.0^\circ) = 60.0 \times 0.866025 = +51.962\,\text{kN}$$
  $$F_{2y} = 60.0 \sin(30.0^\circ) = 60.0 \times 0.500000 = +30.000\,\text{kN}$$
- Boat 3 ($\theta_3 = -45.0^\circ$):
  $$F_{3x} = 50.0 \cos(-45.0^\circ) = 50.0 \times 0.707107 = +35.355\,\text{kN}$$
  $$F_{3y} = 50.0 \sin(-45.0^\circ) = 50.0 \times (-0.707107) = -35.355\,\text{kN}$$

**Step 2: Vector summation**
$$F_{\text{net}, x} = F_{1x} + F_{2x} + F_{3x} = 0.0 + 51.962 + 35.355 = +87.317\,\text{kN}$$
$$F_{\text{net}, y} = F_{1y} + F_{2y} + F_{3y} = 40.0 + 30.000 - 35.355 = +34.645\,\text{kN}$$

**Step 3: Magnitude and direction**
$$|\vec{F}_{\text{net}}| = \sqrt{(87.317)^2 + (34.645)^2} = \sqrt{7624.26 + 1200.28} = \sqrt{8824.54} = 93.939\,\text{kN} \approx 93.9\,\text{kN}$$
$$\theta = \arctan\left(\frac{34.645}{87.317}\right) = \arctan(0.39677) = 21.64^\circ \approx 21.6^\circ\,\text{North of East}$$
Compass bearing: $90.0^\circ - 21.64^\circ = 068.4^\circ$.

---

### Example 2.2: Equilibrant Force Determination
**Problem:** For the tugboat system in Example 2.1 ($\vec{F}_{\text{net}} = 87.317\,\hat{i} + 34.645\,\hat{j}\,\text{kN}$), a fourth tugboat must apply an **equilibrant force ($\vec{F}_E$)** to bring the net force on the barge to exactly zero ($\vec{F}_{\text{net}} + \vec{F}_E = \vec{0}$).
Determine the required pull magnitude and direction of the fourth tugboat.

#### Solution
**Step 1: Definition of Equilibrant**
The equilibrant is the exact negative reflection of the resultant vector:
$$\vec{F}_E = -\vec{F}_{\text{net}} = -87.317\,\hat{i} - 34.645\,\hat{j}\,\text{kN}$$

**Step 2: Magnitude**
$$|\vec{F}_E| = |\vec{F}_{\text{net}}| = 93.94\,\text{kN}$$

**Step 3: Direction**
Since both components are negative, $\vec{F}_E$ lies in the third quadrant (South of West):
$$\theta_E = 21.64^\circ + 180.0^\circ = 201.64^\circ \approx 201.6^\circ$$
Compass bearing: $068.4^\circ + 180.0^\circ = 248.4^\circ$ ($21.6^\circ$ South of West).

---

### Example 2.3: Symmetric Two-Cable Crane Suspension
**Problem:** A heavy steel beam of mass $m = 1200.0\,\text{kg}$ is suspended horizontally by two symmetric crane rigging slings. Each sling is attached to the crane hook above and forms an angle $\theta = 40.0^\circ$ relative to the vertical.
1. Formulate the vertical and horizontal equilibrium equations.
2. Calculate the tension $T$ in each sling.
3. What happens to the cable tension if the slings are shortened such that $\theta$ increases to $70.0^\circ$?

#### Solution
**Step 1: Equilibrium formulation**
Total beam weight:
$$W = m g = 1200.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 11760.0\,\text{N}$$

Let $T$ be the tension in each sling.
Horizontal equilibrium:
$$\sum F_x = T \sin(40.0^\circ) - T \sin(40.0^\circ) = 0 \quad (\text{satisfied by symmetry})$$
Vertical equilibrium:
$$\sum F_y = 2 T \cos(40.0^\circ) - W = 0$$

**Step 2: Solve for tension at $\theta = 40.0^\circ$**
$$2 T \cos(40.0^\circ) = W \implies T = \frac{W}{2 \cos(40.0^\circ)}$$
$$\cos(40.0^\circ) = 0.766044$$
$$T = \frac{11760.0\,\text{N}}{2 \times 0.766044} = \frac{11760.0}{1.53209} = 7675.80\,\text{N} \approx 7.68\,\text{kN}$$
Notice that each cable supports $7.68\,\text{kN}$, even though half the beam's weight is only $5.88\,\text{kN}$!

**Step 3: Tension at wide angle $\theta = 70.0^\circ$**
$$\cos(70.0^\circ) = 0.342020$$
$$T' = \frac{11760.0\,\text{N}}{2 \times 0.342020} = \frac{11760.0}{0.68404} = 17191.98\,\text{N} \approx 17.19\,\text{kN}$$
Widening the sling angle more than doubles the cable tension ($17.2\,\text{kN}$ vs $7.7\,\text{kN}$).
*Rigging Safety Principle:* Never rig slings at wide angles; as $\theta \to 90^\circ$, tension approaches infinity ($\cos\theta \to 0$).

---

### Example 2.4: Asymmetric Cable Junction
**Problem:** A heavy lighting fixture of weight $W = 500.0\,\text{N}$ hangs from a central ring $C$. Two cables connect ring $C$ to the ceiling:
- Cable AC makes an angle of $\alpha = 60.0^\circ$ with the horizontal ceiling.
- Cable BC makes an angle of $\beta = 30.0^\circ$ with the horizontal ceiling.
Calculate the tensions $T_{AC}$ and $T_{BC}$ using Cartesian decomposition.

#### Solution
**Step 1: Equilibrium equations**
Horizontal:
$$\sum F_x = -T_{AC} \cos(60.0^\circ) + T_{BC} \cos(30.0^\circ) = 0$$
$$\cos(60.0^\circ) = 0.500, \quad \cos(30.0^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$$
$$-0.500 T_{AC} + 0.866025 T_{BC} = 0 \implies T_{AC} = \frac{0.866025}{0.500} T_{BC} = \sqrt{3}\,T_{BC} \approx 1.73205 T_{BC}$$

Vertical:
$$\sum F_y = T_{AC} \sin(60.0^\circ) + T_{BC} \sin(30.0^\circ) - W = 0$$
$$\frac{\sqrt{3}}{2} T_{AC} + 0.500 T_{BC} = 500.0$$

**Step 2: Solve the 2x2 linear system**
Substitute $T_{AC} = \sqrt{3}\,T_{BC}$:
$$\frac{\sqrt{3}}{2} (\sqrt{3}\,T_{BC}) + 0.500 T_{BC} = 500.0$$
$$\frac{3}{2} T_{BC} + \frac{1}{2} T_{BC} = 500.0$$
$$2.000 T_{BC} = 500.0 \implies T_{BC} = 250.0\,\text{N}$$

Now compute $T_{AC}$:
$$T_{AC} = \sqrt{3} \times 250.0\,\text{N} = 1.73205 \times 250.0 = 433.01\,\text{N} \approx 433.0\,\text{N}$$

---

### Example 2.5: Verifying Example 2.4 via Lami's Theorem
**Problem:** Re-solve Example 2.4 using Lami's Theorem to prove mathematical equivalence.

#### Solution
Identify the three concurrent forces meeting at ring $C$:
1. Cable AC tension $\vec{T}_{AC}$ (directed $60.0^\circ$ above negative $x$-axis; polar angle $120.0^\circ$).
2. Cable BC tension $\vec{T}_{BC}$ (directed $30.0^\circ$ above positive $x$-axis; polar angle $30.0^\circ$).
3. Fixture downward weight $\vec{W}$ (directed straight down; polar angle $270.0^\circ$).

Calculate the angles between the forces:
- Angle between $\vec{T}_{BC}$ and $\vec{W}$: $\theta_1 = 30.0^\circ + 90.0^\circ = 120.0^\circ$.
- Angle between $\vec{T}_{AC}$ and $\vec{W}$: $\theta_2 = 60.0^\circ + 90.0^\circ = 150.0^\circ$.
- Angle between $\vec{T}_{AC}$ and $\vec{T}_{BC}$: $\theta_3 = 180.0^\circ - (60.0^\circ + 30.0^\circ) = 90.0^\circ$.

Apply Lami's Theorem:
$$\frac{T_{AC}}{\sin(120.0^\circ)} = \frac{T_{BC}}{\sin(150.0^\circ)} = \frac{W}{\sin(90.0^\circ)}$$

Evaluate the trigonometric values:
- $\sin(90.0^\circ) = 1.000$
- $\sin(150.0^\circ) = \sin(30.0^\circ) = 0.500$
- $\sin(120.0^\circ) = \sin(60.0^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$

Calculate tensions directly:
$$\frac{W}{\sin(90.0^\circ)} = \frac{500.0}{1.000} = 500.0\,\text{N}$$
$$T_{BC} = 500.0 \times \sin(150.0^\circ) = 500.0 \times 0.500 = 250.0\,\text{N}$$
$$T_{AC} = 500.0 \times \sin(120.0^\circ) = 500.0 \times 0.866025 = 433.01\,\text{N}$$
Both methods produce identical results with zero discrepancy.

---

### Example 2.6: Wall-Bracket Boom Crane (Strut in Compression)
**Problem:** A wall-mounted jib crane consists of:
- A horizontal rigid strut $AB$ of length $L = 3.00\,\text{m}$ pinned to a vertical wall at $A$.
- A diagonal steel tie cable $BC$ pinned to the wall at $C$ (height $h = 2.00\,\text{m}$ directly above $A$) and connected to the outer tip of the strut at $B$.
A load of mass $m = 800.0\,\text{kg}$ hangs from the outer tip $B$.
Neglecting the weight of the strut and cable:
1. Determine the angle $\theta$ of the tie cable relative to the horizontal strut.
2. Calculate the tension $T$ in the tie cable $BC$.
3. Calculate the compressive force $C_{\text{strut}}$ inside the horizontal strut $AB$.

#### Solution
**Step 1: Geometry**
$$\tan\theta = \frac{h}{L} = \frac{2.00\,\text{m}}{3.00\,\text{m}} = 0.66667 \implies \theta = \arctan(0.66667) = 33.69^\circ$$
Length of tie cable:
$$L_{BC} = \sqrt{3.00^2 + 2.00^2} = \sqrt{9.00 + 4.00} = \sqrt{13.00} = 3.60555\,\text{m}$$
$$\sin\theta = \frac{2.00}{3.60555} = 0.55470, \quad \cos\theta = \frac{3.00}{3.60555} = 0.83205$$

**Step 2: Equilibrium at joint $B$**
Load weight:
$$W = m g = 800.0 \times 9.80 = 7840.0\,\text{N}$$
Forces acting on pin $B$:
1. Cable tension $\vec{T}$ pulling up and left toward $C$ ($T_x = -T \cos\theta, T_y = +T \sin\theta$).
2. Hanging weight $\vec{W}$ pulling down ($-W\,\hat{j}$).
3. Strut reaction force $\vec{C}_{\text{strut}}$ pushing horizontally right ($+C_{\text{strut}}\,\hat{i}$).

Vertical equilibrium:
$$\sum F_y = T \sin\theta - W = 0 \implies T \sin\theta = W$$
$$T = \frac{W}{\sin\theta} = \frac{7840.0\,\text{N}}{0.55470} = 14133.77\,\text{N} \approx 14.13\,\text{kN}$$

**Step 3: Horizontal equilibrium (Compressive force)**
$$\sum F_x = C_{\text{strut}} - T \cos\theta = 0 \implies C_{\text{strut}} = T \cos\theta$$
$$C_{\text{strut}} = 14133.77 \times 0.83205 = 11760.0\,\text{N} = 11.76\,\text{kN}$$
*Sanity Check:* $C_{\text{strut}} = W \frac{L}{h} = 7840.0 \times \frac{3.00}{2.00} = 11760.0\,\text{N}$. Exact match.

---

### Example 2.7: Continuous Cable Over an Ideal Pulley
**Problem:** A block of mass $m_1 = 50.0\,\text{kg}$ rests on a frictionless horizontal tabletop. A light, inextensible cable connected to $m_1$ passes over a frictionless pulley at the table edge and supports a hanging counterweight of mass $m_2 = 30.0\,\text{kg}$. A horizontal restraining force $F_{\text{hold}}$ is applied to $m_1$ to keep the system in static equilibrium.
1. Determine the tension $T$ in the cable.
2. Determine the holding force $F_{\text{hold}}$.
3. Determine the magnitude and direction of the net force exerted by the cable on the pulley.

#### Solution
**Step 1: Cable tension**
Isolate hanging mass $m_2$:
$$\sum F_y = T - m_2 g = 0 \implies T = m_2 g = 30.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 294.0\,\text{N}$$
Because the pulley is ideal, tension is uniform across both segments of the cable: $T = 294.0\,\text{N}$.

**Step 2: Restraining force $F_{\text{hold}}$**
Isolate tabletop mass $m_1$:
$$\sum F_x = T - F_{\text{hold}} = 0 \implies F_{\text{hold}} = T = 294.0\,\text{N}$$

**Step 3: Force exerted on the pulley**
The pulley is wrapped by two cable segments:
- Horizontal segment pulling left on pulley: $\vec{F}_{\text{horiz}} = -T\,\hat{i} = -294.0\,\hat{i}\,\text{N}$.
- Vertical segment pulling down on pulley: $\vec{F}_{\text{vert}} = -T\,\hat{j} = -294.0\,\hat{j}\,\text{N}$.
Net force on pulley:
$$\vec{F}_{\text{pulley}} = -294.0\,\hat{i} - 294.0\,\hat{j}\,\text{N}$$
Magnitude:
$$|\vec{F}_{\text{pulley}}| = \sqrt{(-294.0)^2 + (-294.0)^2} = 294.0 \times \sqrt{2} = 415.78\,\text{N} \approx 415.8\,\text{N}$$
Direction: Directed at $45.0^\circ$ down and to the left (bearing $225.0^\circ$).

---

### Example 2.8: Sphere Resting Between Two Inclined Planes
**Problem:** A solid steel sphere of mass $M = 24.0\,\text{kg}$ and radius $R = 0.150\,\text{m}$ rests in a frictionless V-shaped symmetrical trough. The two walls of the trough are inclined at angles $\alpha = 30.0^\circ$ and $\beta = 60.0^\circ$ relative to the horizontal.
Calculate the normal contact forces $N_1$ and $N_2$ exerted by each plane on the sphere.

#### Solution
**Step 1: Geometric orientation of normal forces**
Normal forces act perpendicular to the inclined surfaces through the center of the sphere:
- Surface 1 ($\alpha = 30.0^\circ$): The normal vector $\vec{N}_1$ makes an angle of $30.0^\circ$ with the vertical, which is $60.0^\circ$ above the horizontal pointing right:
  $$\vec{N}_1 = N_1 \cos(60.0^\circ)\,\hat{i} + N_1 \sin(60.0^\circ)\,\hat{j} = N_1 (0.500\,\hat{i} + 0.866025\,\hat{j})$$
- Surface 2 ($\beta = 60.0^\circ$): The normal vector $\vec{N}_2$ makes an angle of $60.0^\circ$ with the vertical, which is $30.0^\circ$ above the horizontal pointing left:
  $$\vec{N}_2 = -N_2 \cos(30.0^\circ)\,\hat{i} + N_2 \sin(30.0^\circ)\,\hat{j} = N_2 (-0.866025\,\hat{i} + 0.500\,\hat{j})$$

Notice that $\vec{N}_1$ and $\vec{N}_2$ are mutually perpendicular:
$$\theta_{\text{between}} = 60.0^\circ + 30.0^\circ = 90.0^\circ$$

**Step 2: Equilibrium equations**
Sphere weight:
$$W = M g = 24.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 235.2\,\text{N}$$

Horizontal equilibrium:
$$\sum F_x = 0.500 N_1 - 0.866025 N_2 = 0 \implies N_1 = \frac{0.866025}{0.500} N_2 = \sqrt{3}\,N_2$$

Vertical equilibrium:
$$\sum F_y = 0.866025 N_1 + 0.500 N_2 - 235.2 = 0$$

**Step 3: Solve linear system**
Substitute $N_1 = \sqrt{3}\,N_2$:
$$0.866025 (\sqrt{3}\,N_2) + 0.500 N_2 = 235.2$$
$$\frac{3}{2} N_2 + \frac{1}{2} N_2 = 235.2 \implies 2.000 N_2 = 235.2 \implies N_2 = 117.6\,\text{N}$$

Now compute $N_1$:
$$N_1 = \sqrt{3} \times 117.6\,\text{N} = 1.73205 \times 117.6 = 203.69\,\text{N} \approx 203.7\,\text{N}$$

---

### Example 2.9: Four-Force Particle Equilibrium with Unknown Angle
**Problem:** A particle at $(0,0)$ is acted upon by four coplanar forces:
- $\vec{F}_1 = 80.0\,\hat{i}\,\text{N}$
- $\vec{F}_2 = 120.0\,\hat{j}\,\text{N}$
- $\vec{F}_3 = -60.0\,\hat{i} - 40.0\,\hat{j}\,\text{N}$
- $\vec{F}_4$ has an unknown magnitude $F_4$ and unknown direction $\phi$.
Determine $F_4$ and $\phi$ such that the particle remains in static equilibrium.

#### Solution
**Step 1: Sum the known forces**
$$\vec{F}_{\text{known}} = \vec{F}_1 + \vec{F}_2 + \vec{F}_3 = (80.0 - 60.0)\,\hat{i} + (120.0 - 40.0)\,\hat{j} = +20.0\,\hat{i} + 80.0\,\hat{j}\,\text{N}$$

**Step 2: Condition for static equilibrium**
$$\vec{F}_{\text{known}} + \vec{F}_4 = \vec{0} \implies \vec{F}_4 = -\vec{F}_{\text{known}}$$
$$\vec{F}_4 = -20.0\,\hat{i} - 80.0\,\hat{j}\,\text{N}$$

**Step 3: Magnitude and direction**
$$F_4 = |\vec{F}_4| = \sqrt{(-20.0)^2 + (-80.0)^2} = \sqrt{400.0 + 6400.0} = \sqrt{6800.0} = 82.462\,\text{N} \approx 82.5\,\text{N}$$

Direction angle:
Since both $F_{4x} < 0$ and $F_{4y} < 0$, $\vec{F}_4$ lies in the third quadrant:
$$\phi = 180.0^\circ + \arctan\left(\frac{-80.0}{-20.0}\right) = 180.0^\circ + \arctan(4.000) = 180.0^\circ + 75.96^\circ = 255.96^\circ \approx 256.0^\circ$$

---

### Example 2.10: Cable Suspension with Movable Ring (Geometric Equilibrium)
**Problem:** A flexible cable of total length $L = 5.00\,\text{m}$ is fixed at two ceiling anchor points $A$ and $B$ separated by a horizontal distance $D = 4.00\,\text{m}$ at the exact same elevation. A frictionless ring carrying a heavy weight $W = 600.0\,\text{N}$ slides freely along the cable until it settles into static equilibrium.
1. Prove that in equilibrium, the two cable segments make identical angles with the horizontal ceiling ($\theta_1 = \theta_2 = \theta$).
2. Calculate the equilibrium angle $\theta$.
3. Compute the tension $T$ in the cable.

#### Solution
**Step 1: Proof of symmetric angles**
Because the ring is frictionless, the cable slides effortlessly through it. Tension throughout the continuous cable must be strictly identical in both segments:
$$T_1 = T_2 = T$$
Horizontal equilibrium at the ring:
$$\sum F_x = T \cos\theta_2 - T \cos\theta_1 = 0 \implies T (\cos\theta_2 - \cos\theta_1) = 0$$
Since $T \ne 0$:
$$\cos\theta_2 = \cos\theta_1 \implies \theta_1 = \theta_2 = \theta$$
The angles are identically equal by physics!

**Step 2: Geometric calculation of angle $\theta$**
Let the ring be located at a horizontal distance $x$ from anchor $A$ and vertical depth $y$ below the ceiling.
Length of segment 1: $L_1 = \sqrt{x^2 + y^2}$.
Length of segment 2: $L_2 = \sqrt{(D - x)^2 + y^2}$.
Since $\theta_1 = \theta_2 = \theta$:
$$\cos\theta = \frac{x}{L_1} = \frac{D - x}{L_2}$$
By symmetry, $x = D/2 = 2.00\,\text{m}$, and $L_1 = L_2 = L/2 = 2.50\,\text{m}$.
Therefore:
$$\cos\theta = \frac{D / 2}{L / 2} = \frac{D}{L} = \frac{4.00\,\text{m}}{5.00\,\text{m}} = 0.800$$
$$\theta = \arccos(0.800) = 36.87^\circ \approx 36.9^\circ$$

**Step 3: Cable tension $T$**
Vertical equilibrium at the ring:
$$\sum F_y = 2 T \sin\theta - W = 0 \implies 2 T \sin\theta = W$$
$$\sin\theta = \sqrt{1 - \cos^2\theta} = \sqrt{1 - 0.64} = \sqrt{0.36} = 0.600$$
$$2 T (0.600) = 600.0\,\text{N} \implies 1.200 T = 600.0\,\text{N} \implies T = \frac{600.0}{1.200} = 500.0\,\text{N}$$

---

## 2.7 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 2.1 (Tier 1: Resultant of Orthogonal Forces)
Two forces act on an eyebolt: $\vec{F}_1 = 450.0\,\text{N}\,\hat{i}$ and $\vec{F}_2 = 600.0\,\text{N}\,\hat{j}$.
(a) What is the magnitude of the net force $|\vec{F}_{\text{net}}|$?
(b) What is the directional angle $\theta$ relative to the $+x$ axis?

### Exercise 2.2 (Tier 1: Hookean Spring Balance Calibration)
A laboratory spring stretches by $\Delta x = 3.50\,\text{cm} = 0.0350\,\text{m}$ when a certified $2.00\,\text{kg}$ calibration mass is hung from it at rest.
(a) Determine the spring constant $k$ in $\text{N/m}$.
(b) What mass $m_x$ produces a stretch of $5.25\,\text{cm}$?

### Exercise 2.3 (Tier 2: Symmetric Signboard Suspension)
A shop signboard of mass $m = 18.0\,\text{kg}$ hangs from two identical steel wires. Each wire makes an angle of $\theta = 50.0^\circ$ with the horizontal ceiling.
(a) Calculate the tension in each wire.
(b) What is the minimum wire breaking strength required with a safety factor of 2.0?

### Exercise 2.4 (Tier 2: Horizontal Strut with Vertical Tie)
A horizontal light rod $AB$ of length $L = 1.80\,\text{m}$ is hinged to a wall at $A$. The outer end $B$ is supported by a cable making an angle of $\theta = 45.0^\circ$ with the rod, anchored to the wall at $C$ above $A$. A mass of $m = 40.0\,\text{kg}$ hangs from $B$.
(a) Calculate the tension $T$ in the cable.
(b) Calculate the compressive force inside rod $AB$.

### Exercise 2.5 (Tier 3: Three-Cable Ring with Asymmetric Angles)
A ring is held in static equilibrium by three ropes in a horizontal plane:
- Rope 1 pulls with $T_1 = 300.0\,\text{N}$ at $\theta_1 = 0^\circ$ ($+x$).
- Rope 2 pulls with tension $T_2$ at $\theta_2 = 135.0^\circ$.
- Rope 3 pulls with tension $T_3$ at $\theta_3 = 240.0^\circ$.
Calculate the required tensions $T_2$ and $T_3$.

### Exercise 2.6 (Tier 3: Sphere on an Inclined Plane Held by a Cable)
A smooth sphere of mass $M = 30.0\,\text{kg}$ rests on a frictionless plane inclined at $\alpha = 35.0^\circ$. A horizontal cable anchored to a vertical wall prevents the sphere from rolling down.
(a) Draw the FBD and formulate equilibrium along and perpendicular to the incline.
(b) Calculate the tension $T$ in the horizontal cable.
(c) Calculate the normal force $N$ exerted by the incline on the sphere.

### Exercise 2.7 (Tier 4: Lami's Theorem for a Pinned Cylinder)
A heavy steel cylinder of weight $W = 1200.0\,\text{N}$ rests against a smooth vertical wall and is supported by a strut inclined at $\theta = 60.0^\circ$ to the wall.
Using Lami's Theorem:
(a) Determine the angles between the three concurrent forces (weight, normal force from wall, and compression from strut).
(b) Calculate the compressive force in the strut and the normal force from the wall.

### Exercise 2.8 (Tier 4: Crane Jib with Non-Horizontal Strut)
A crane boom of length $L = 6.00\,\text{m}$ is inclined at $\alpha = 30.0^\circ$ above the horizontal. A tie cable connects the tip of the boom to the mast, making an angle of $\beta = 20.0^\circ$ with the boom. A load of mass $m = 2500.0\,\text{kg}$ is suspended from the tip.
Neglecting the boom weight, calculate the cable tension $T$ and the axial compression in the boom.

### Exercise 2.9 (Tier 5: Four-Bar Cable Linkage Mechanism)
A dual-mass cable network supports two suspended weights:
- Joint 1 supports weight $W_1 = 400.0\,\text{N}$, connected to the left ceiling by Cable A ($\theta_A = 60.0^\circ$ above horizontal).
- Joint 2 supports weight $W_2 = 600.0\,\text{N}$, connected to the right ceiling by Cable C ($\theta_C = 45.0^\circ$ above horizontal).
- A central horizontal cable B connects Joint 1 to Joint 2.
Verify whether static equilibrium is possible with a purely horizontal central cable B, and if so, determine the tensions $T_A, T_B,$ and $T_C$.

### Exercise 2.10 (Tier 5: Generalization of the Continuous Cable Sag)
A continuous cable of length $L = 10.0\,\text{m}$ supports a heavy pulley of weight $W = 2000.0\,\text{N}$ that rolls along the cable. The two anchors are separated by horizontal distance $D = 8.00\,\text{m}$ and vertical distance $H = 2.00\,\text{m}$ (one anchor is higher than the other).
Formulate the exact transcendental equations for the equilibrium coordinates $(x, y)$ and calculate the cable tension $T$.

---

## 2.8 Comprehensive Solutions to Chapter Exercises

---

### Solution 2.1
**(a) Magnitude:**
$$|\vec{F}_{\text{net}}| = \sqrt{F_1^2 + F_2^2} = \sqrt{(450.0)^2 + (600.0)^2} = \sqrt{202500 + 360000} = \sqrt{562500} = 750.0\,\text{N}$$

**(b) Directional angle:**
$$\theta = \arctan\left(\frac{600.0}{450.0}\right) = \arctan\left(\frac{4}{3}\right) = 53.13^\circ \approx 53.1^\circ$$

---

### Solution 2.2
**(a) Spring constant $k$:**
Weight of calibration mass:
$$F = m g = 2.00\,\text{kg} \times 9.80\,\text{m/s}^2 = 19.60\,\text{N}$$
$$k = \frac{F}{\Delta x} = \frac{19.60\,\text{N}}{0.0350\,\text{m}} = 560.0\,\text{N/m}$$

**(b) Mass for $5.25\,\text{cm}$ stretch:**
$$\Delta x_2 = 0.0525\,\text{m}$$
$$F_2 = k \Delta x_2 = 560.0\,\text{N/m} \times 0.0525\,\text{m} = 29.40\,\text{N}$$
$$m_x = \frac{F_2}{g} = \frac{29.40\,\text{N}}{9.80\,\text{m/s}^2} = 3.00\,\text{kg}$$

---

### Solution 2.3
**(a) Cable tension:**
Signboard weight:
$$W = m g = 18.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 176.4\,\text{N}$$
Vertical equilibrium:
$$2 T \sin(50.0^\circ) = W \implies T = \frac{176.4\,\text{N}}{2 \sin(50.0^\circ)} = \frac{176.4}{2 \times 0.766044} = \frac{176.4}{1.53209} = 115.14\,\text{N} \approx 115.1\,\text{N}$$

**(b) Required breaking strength with safety factor 2.0:**
$$T_{\text{break}} = 2.0 \times T = 2.0 \times 115.14\,\text{N} = 230.28\,\text{N} \approx 230\,\text{N}$$

---

### Solution 2.4
Load weight:
$$W = m g = 40.0 \times 9.80 = 392.0\,\text{N}$$

**(a) Cable tension $T$:**
Vertical equilibrium at pin $B$:
$$T \sin(45.0^\circ) = W \implies T = \frac{W}{\sin(45.0^\circ)} = \frac{392.0\,\text{N}}{\sqrt{2}/2} = 392.0 \times \sqrt{2} = 554.37\,\text{N} \approx 554.4\,\text{N}$$

**(b) Compressive force $C$ in rod $AB$:**
Horizontal equilibrium at pin $B$:
$$C - T \cos(45.0^\circ) = 0 \implies C = T \cos(45.0^\circ) = (554.37)\left(\frac{\sqrt{2}}{2}\right) = 392.0\,\text{N}$$

---

### Solution 2.5
Component equations for ring:
Horizontal:
$$\sum F_x = T_1 + T_2 \cos(135.0^\circ) + T_3 \cos(240.0^\circ) = 0$$
$$300.0 + T_2 (-0.707107) + T_3 (-0.500) = 0 \implies 0.707107 T_2 + 0.500 T_3 = 300.0$$

Vertical:
$$\sum F_y = 0 + T_2 \sin(135.0^\circ) + T_3 \sin(240.0^\circ) = 0$$
$$T_2 (0.707107) + T_3 (-0.866025) = 0 \implies 0.707107 T_2 = 0.866025 T_3$$

Substitute into horizontal equation:
$$0.866025 T_3 + 0.500 T_3 = 300.0 \implies 1.366025 T_3 = 300.0$$
$$T_3 = \frac{300.0}{1.366025} = 219.615\,\text{N} \approx 219.6\,\text{N}$$
Now compute $T_2$:
$$T_2 = \frac{0.866025}{0.707107} T_3 = 1.22474 \times 219.615 = 268.97\,\text{N} \approx 269.0\,\text{N}$$

---

### Solution 2.6
Sphere mass $M = 30.0\,\text{kg} \implies W = 30.0 \times 9.80 = 294.0\,\text{N}$.
Incline angle $\alpha = 35.0^\circ$.
Forces acting on sphere:
1. Weight $\vec{W} = -294.0\,\hat{j}\,\text{N}$.
2. Normal force $\vec{N}$ perpendicular to incline: angle with vertical is $35.0^\circ$.
3. Horizontal cable tension $\vec{T} = -T\,\hat{i}\,\text{N}$ (pulling left toward wall).

**(a) Equilibrium equations:**
Horizontal:
$$\sum F_x = N \sin(35.0^\circ) - T = 0 \implies T = N \sin(35.0^\circ)$$
Vertical:
$$\sum F_y = N \cos(35.0^\circ) - W = 0 \implies N \cos(35.0^\circ) = W$$

**(b) Calculate normal force $N$:**
$$N = \frac{W}{\cos(35.0^\circ)} = \frac{294.0\,\text{N}}{\cos(35.0^\circ)} = \frac{294.0}{0.819152} = 358.91\,\text{N} \approx 358.9\,\text{N}$$

**(c) Calculate cable tension $T$:**
$$T = N \sin(35.0^\circ) = 358.91 \times 0.573576 = 205.86\,\text{N} \approx 205.9\,\text{N}$$
Alternatively: $T = W \tan(35.0^\circ) = 294.0 \times 0.700208 = 205.86\,\text{N}$.

---

### Solution 2.7
**(a) Angles between forces:**
The strut is inclined at $60.0^\circ$ to the vertical wall, meaning it makes an angle of $30.0^\circ$ with the horizontal (pushing up and right at $30.0^\circ$ above horizontal).
Forces acting on cylinder:
- Weight $\vec{W}$ (straight down, $270.0^\circ$).
- Normal force from wall $\vec{N}_{\text{wall}}$ (horizontal to the right, $0.0^\circ$).
- Strut compressive force $\vec{C}$ (pushing up and left, $150.0^\circ$).

Angles between forces:
- Between $\vec{N}_{\text{wall}}$ and $\vec{W}$: $\theta_1 = 90.0^\circ$.
- Between $\vec{C}$ and $\vec{W}$: $\theta_2 = 120.0^\circ$.
- Between $\vec{C}$ and $\vec{N}_{\text{wall}}$: $\theta_3 = 150.0^\circ$.

**(b) Calculate forces via Lami's Theorem:**
$$\frac{W}{\sin(150.0^\circ)} = \frac{C}{\sin(90.0^\circ)} = \frac{N_{\text{wall}}}{\sin(120.0^\circ)}$$
$$\frac{1200.0}{\sin(150.0^\circ)} = \frac{1200.0}{0.500} = 2400.0\,\text{N}$$
$$C = 2400.0 \times \sin(90.0^\circ) = 2400.0\,\text{N}$$
$$N_{\text{wall}} = 2400.0 \times \sin(120.0^\circ) = 2400.0 \times 0.866025 = 2078.46\,\text{N} \approx 2078\,\text{N}$$

---

### Solution 2.8
Load weight:
$$W = m g = 2500.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 24500.0\,\text{N}$$
Boom is inclined at $\alpha = 30.0^\circ$ to horizontal.
Tie cable makes $\beta = 20.0^\circ$ with boom, meaning it pulls at angle $\theta_{\text{cable}} = 30.0^\circ + 20.0^\circ = 50.0^\circ$ above the horizontal back toward the mast.
Boom reaction force $\vec{C}$ acts along the boom axis ($30.0^\circ$ above horizontal).

Align coordinate axes along and perpendicular to the boom:
Perpendicular to boom equilibrium:
The load weight has component perpendicular to boom: $W_\perp = W \cos(30.0^\circ) = 24500.0 \times 0.866025 = 21217.6\,\text{N}$.
Cable tension has component perpendicular to boom: $T_\perp = T \sin(20.0^\circ)$.
$$T \sin(20.0^\circ) = W \cos(30.0^\circ)$$
$$T = \frac{21217.6\,\text{N}}{\sin(20.0^\circ)} = \frac{21217.6}{0.342020} = 62036.1\,\text{N} \approx 62.04\,\text{kN}$$

Parallel to boom equilibrium (axial compression $C$):
$$C = W \sin(30.0^\circ) + T \cos(20.0^\circ)$$
$$W \sin(30.0^\circ) = 24500.0 \times 0.500 = 12250.0\,\text{N}$$
$$T \cos(20.0^\circ) = 62036.1 \times 0.939693 = 58294.9\,\text{N}$$
$$C = 12250.0 + 58294.9 = 70544.9\,\text{N} \approx 70.54\,\text{kN}$$

---

### Solution 2.9
At Joint 1:
Vertical equilibrium:
$$T_A \sin(60.0^\circ) = W_1 \implies T_A = \frac{400.0}{\sin(60.0^\circ)} = \frac{400.0}{0.866025} = 461.88\,\text{N}$$
Horizontal equilibrium:
$$T_B = T_A \cos(60.0^\circ) = 461.88 \times 0.500 = 230.94\,\text{N}$$

At Joint 2:
Vertical equilibrium:
$$T_C \sin(45.0^\circ) = W_2 \implies T_C = \frac{600.0}{\sin(45.0^\circ)} = \frac{600.0}{0.707107} = 848.53\,\text{N}$$
Horizontal equilibrium:
$$T'_B = T_C \cos(45.0^\circ) = 848.53 \times 0.707107 = 600.0\,\text{N}$$

Notice that $T_B = 230.94\,\text{N} \ne T'_B = 600.0\,\text{N}$!
Therefore, **static equilibrium is impossible with a purely horizontal central cable B**. Joint 1 and Joint 2 would shift horizontally and vertically until cable B tilts at an angle to balance the tension mismatch.

---

### Solution 2.10
Let the lower anchor be at the origin $(0, 0)$ and the higher anchor be at $(D, H) = (8.00\,\text{m}, 2.00\,\text{m})$.
Because the rolling pulley is frictionless, the cable tension $T$ is identical in both segments.
At the pulley position $(x, y)$:
- Segment 1 connects $(0,0)$ to $(x, y)$ with length $L_1 = \sqrt{x^2 + y^2}$.
- Segment 2 connects $(x, y)$ to $(D, H)$ with length $L_2 = \sqrt{(D - x)^2 + (H - y)^2}$.
Total cable length constraint:
$$L_1 + L_2 = L = 10.0\,\text{m}$$

This geometric equation defines an **ellipse** with foci at $(0, 0)$ and $(D, H)$!
In static equilibrium under gravity, the pulley settles at the **lowest possible point** (minimizing gravitational potential energy).
At the minimum point of the ellipse, the tangent is horizontal: $\frac{dy}{dx} = 0$.
By the reflection property of ellipses, the two focal segments make equal angles $\theta$ with the horizontal tangent:
$$\cos\theta_1 = \cos\theta_2 = \cos\theta$$

For an ellipse with semi-major axis $a = L/2 = 5.00\,\text{m}$ and focal distance $2c = \sqrt{D^2 + H^2} = \sqrt{8.00^2 + 2.00^2} = \sqrt{68.0} = 8.2462\,\text{m} \implies c = 4.1231\,\text{m}$.
The semi-minor axis is $b = \sqrt{a^2 - c^2} = \sqrt{25.0 - 17.0} = \sqrt{8.00} = 2.8284\,\text{m}$.

The vertical equilibrium equation at the pulley is:
$$2 T \sin\theta = W$$
Where $\sin\theta = \frac{b}{a} = \frac{2.8284}{5.00} = 0.565685$.
$$2 T (0.565685) = 2000.0\,\text{N} \implies 1.13137 T = 2000.0\,\text{N}$$
$$T = \frac{2000.0}{1.13137} = 1767.77\,\text{N} \approx 1.77\,\text{kN}$$
