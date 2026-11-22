# CHAPTER 04: The Art of the Free-Body Diagram (FBD) & Normal Forces

> "To isolate a body is to see it as God sees it: severed from all its entanglements, floating in empty space, touching nothing except where forces pierce its boundary."
> — *The Sovereign Mechanics Handbook*

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Execute the 5-step canonical protocol for constructing flawless **Free-Body Diagrams (FBDs)** for any classical mechanical system.
2. Distinguish rigorously between external forces acting *on* a body versus forces exerted *by* the body on its surroundings.
3. Identify and eradicate the four "Deadly Sins" of FBD construction (impetus fallacy, internal force leakage, reaction force confusion, and the $N = mg$ reflex).
4. Deconstruct the **Normal Force ($N$)** as an electrostatic macroscopic constraint force, proving why $N$ is self-adjusting and almost never equals $mg$ in non-trivial dynamics.
5. Calculate the exact normal force across seven distinct physical configurations (level surfaces, angled pushes/pulls, accelerating elevators, banked curves, and roller coaster loops).
6. Determine the critical threshold conditions for **loss of physical contact** ($N \to 0$).
7. Solve 10 progressive numerical worked examples and 10 chapter mastery exercises with complete, unabridged arithmetic transparency.

---

## 4.1 The Cognitive Discipline of Isolation

In classical mechanics, more than ninety percent of student errors do not arise from faulty calculus or broken algebra. They arise from a catastrophic cognitive failure in the very first step of problem-solving: **drawing a flawed Free-Body Diagram (FBD)**.

A Free-Body Diagram is an idealized, stripped-down visual blueprint that represents a physical body isolated from its environment, displaying all the external force vectors acting upon it.

The keyword is **Free**. You must mentally sever the object from the physical universe:
- Erase the table, the floor, the incline, and the wall.
- Erase the cables, strings, hands, and surrounding fluid.
- Replace every single physical contact with an explicit, labeled **vector arrow** originating at the body and pointing in the true direction of the applied force.

```
                  The Anatomy of the Boundary Cut
                  
 Physical World:                              The Isolated Free-Body Diagram:
 
        Ceiling                                              +y
       =========                                              ^
           | Rope                                             | Tension T
           v                                                  |
       +-------+                                          +-------+
 Push  | Block | Table                                    |   m   |
 ----> |   m   | ======> Friction f_k   F_push ---------> |       | <--- Friction f_k
       +-------+                                          +-------+
       /////////                                              |
        Ground                                                | Weight W = mg
                                                              v
                                                             -y
                                                   (Table replaced by Normal N!)
```

---

## 4.2 The Five-Step Canonical FBD Protocol

Whenever you encounter a mechanical problem, you must execute the following five-step protocol with unyielding discipline:

### Step 1: Identify the Target Body
Choose the exact physical object (or system of rigidly connected objects) whose motion you wish to determine. Draw a simplified representation—either a dot or a neat rectangular box.

### Step 2: Draw the Non-Contact Field Forces
Draw all forces that act through space without physical contact:
- For terrestrial mechanics, this is almost exclusively the **downward force of gravity (Weight, $\vec{W}$)**:
  $$\vec{W} = m g\,\text{directed straight down toward Earth's center}$$

### Step 3: Walk the Perimeter (Contact Forces)
Mentally trace your finger around the entire physical boundary of the object. Everywhere your finger touches something external, a contact force exists:
- Touching a solid surface? $\to$ Add a **Normal Force ($\vec{N}$)** pointing perpendicular away from the surface into the object, and a **Friction Force ($\vec{f}$)** pointing parallel to the surface opposing relative motion.
- Touching a stretched rope or wire? $\to$ Add a **Tension Force ($\vec{T}$)** pulling along the axis of the rope away from the object.
- Touching a compressed or stretched spring? $\to$ Add a **Spring Force ($\vec{F}_s$)** along the spring axis.
- Touching a human hand, engine piston, or thrust nozzle? $\to$ Add an **Applied Force ($\vec{F}_{\text{applied}}$)**.

### Step 4: Choose the Optimal Coordinate System
Never default blindly to standard horizontal-vertical axes $(x, y)$. 
**The Golden Rule of Axes Selection:** Align one axis (usually $+x$) **directly along the anticipated line of acceleration**, so that $a_y = 0$!
- If a block slides down a $30^\circ$ incline, tilt your axes by $30^\circ$ so that motion is purely along $+x$.

### Step 5: Decompose Vectors and Write Newton's Equations
Resolve all angled forces into their orthogonal components along your chosen coordinate axes, and formulate the dynamic equations:
$$\sum F_x = m a_x$$
$$\sum F_y = m a_y$$

---

## 4.3 The Four Deadly Sins of FBD Construction

Every sovereign physicist must guard against four seductive errors that contaminate mechanical diagrams:

### Sin 1: Drawing the "Force of Motion" (The Aristotelian Impetus)
*The Error:* When an artillery shell flies through the air or a puck glides across ice, students often draw a forward arrow labeled "$F_{\text{motion}}$" or "$F_{\text{inertia}}$".
*The Truth:* **There is no force of motion!** Once a ball leaves a cannon or a hand, the forward push has ended. The projectile moves forward purely by its own **inertia** (Lex I). Drawing an impetus force destroys the diagram.

### Sin 2: Drawing Internal Forces
*The Error:* If you isolate a truck, drawing the force exerted by the truck's engine on the truck's transmission.
*The Truth:* Only **external forces**—forces exerted *by the outside world on the body*—can accelerate the center of mass. Internal forces cancel out in pairs by Newton's Third Law and must never appear on an FBD.

### Sin 3: Drawing Reaction Forces Exerted BY the Body
*The Error:* On a block resting on a table, drawing the downward push that the block exerts on the table.
*The Truth:* An FBD depicts only forces acting **on** the body. The block does not push on itself; the table pushes on the block!

### Sin 4: The "$N = mg$" Reflex
*The Error:* Blindly assuming that the normal force $N$ is always equal to $mg$.
*The Truth:* In most non-trivial dynamics, **$N \ne mg$**!

---

## 4.4 The True Nature of the Normal Force ($N$)

What is the **Normal Force**?
The word *normal* comes from the Latin *norma*, meaning a carpenter's square—indicating a **perpendicular** direction ($90^\circ$).

At the atomic scale, solid matter is mostly empty space surrounded by electron probability clouds. When you place a textbook on a table, gravity pulls the book downward, attempting to compress the book's atoms into the table's atoms.
As the electron clouds overlap, quantum mechanical electrostatic repulsion (and the Pauli Exclusion Principle) exerts a fierce upward push.

The normal force is a **macroscopic constraint force**:
- It is **self-adjusting**: it produces exactly whatever magnitude of force is required to prevent the two solid objects from occupying the same space.
- If you place a feather on a table, $N \approx 0.001\,\text{N}$. If you place a $100\,\text{kg}$ anvil on the same table, $N$ instantly self-adjusts to $980\,\text{N}$!
- It has an upper structural limit: if the load exceeds the chemical bond strength of the surface, the table snaps and collapses.

---

## 4.5 The Seven Regimes of Normal Force

To permanently destroy the "$N = mg$" reflex, consider the seven canonical physical configurations:

```
                            The Seven Normal Force Regimes
                            
 1. Flat Surface (Rest):        2. Angled Push Down:         3. Angled Pull Up:
       N = mg                         N = mg + F sin(theta)        N = mg - F sin(theta)
       
       ^ N                            ^ N                          ^ N     / F
       |                              |   \ F                      |      /
    +-----+                        +-----+ \                    +-----+  /
    |  m  |                        |  m  |  v                   |  m  |
    +-----+                        +-----+                      +-----+
       |                              |                            |
       v mg                           v mg                         v mg
       
 4. Accelerating Elevator:      5. Inclined Plane:           6. Banked Curve:
       N = m(g + a)                   N = mg cos(theta)            N cos(theta) = mg
       (Apparent weight!)                                          N = mg / cos(theta)
```

### Regime 1: Flat Horizontal Surface at Rest
$$\sum F_y = N - m g = 0 \implies N = m g$$

### Regime 2: Level Surface with Downward Angled Push ($\theta$ below horizontal)
An applied force pushes down and forward: $F_y = -F \sin\theta$.
$$\sum F_y = N - m g - F \sin\theta = 0 \implies N = m g + F \sin\theta > m g$$
The normal force is **greater** than the object's weight.

### Regime 3: Level Surface with Upward Angled Pull ($\theta$ above horizontal)
An applied force pulls up and forward: $F_y = +F \sin\theta$.
$$\sum F_y = N + F \sin\theta - m g = 0 \implies N = m g - F \sin\theta < m g$$
The normal force is **less** than the object's weight.

### Regime 4: Vertically Accelerating Platform / Elevator
The floor accelerates upward with acceleration $a$:
$$\sum F_y = N - m g = m a \implies N = m(g + a)$$
- Upward acceleration ($a > 0$): $N > mg$ (heavy sensation).
- Downward acceleration ($a < 0$): $N < mg$ (light sensation).
- Free fall ($a = -g$): $N = m(g - g) = 0$ (weightlessness).

### Regime 5: Inclined Plane of Slope Angle $\theta$
Tilted coordinate axis perpendicular to the slope:
$$\sum F_y = N - m g \cos\theta = 0 \implies N = m g \cos\theta \le m g$$
As the incline gets steeper ($\theta \to 90^\circ$), $\cos\theta \to 0 \implies N \to 0$.

### Regime 6: Centripetal Roller Coaster Inverted Loop
At the apex of an inside loop of radius $R$ where the cart has speed $v$:
Both gravity and the track's normal force push **downward** toward the loop center:
$$\sum F_{\text{radial}} = N + m g = m \frac{v^2}{R} \implies N = m \left(\frac{v^2}{R} - g\right)$$
If $v = \sqrt{g R}$, $N = 0$ (critical speed where wheels momentarily lose contact with the rails).

### Regime 7: Loss of Contact Condition
In mechanical engineering, a solid body loses contact with a surface at the exact instant the normal force drops to zero:
$$N = 0$$
Any calculation that yields $N < 0$ on an unglued surface indicates that the physical assumption of contact has failed: the object has launched off the surface into airborne projectile motion!

---

## 4.6 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 4.1: Downward Push on a Vacuum Cleaner
**Problem:** A custodian pushes a commercial vacuum cleaner of mass $m = 12.0\,\text{kg}$ across a carpet with an applied force $F = 45.0\,\text{N}$ directed along the handle at an angle of $\theta = 40.0^\circ$ below the horizontal.
1. Draw the FBD and calculate the normal force $N$ exerted by the carpet on the vacuum.
2. If the kinetic friction coefficient is $\mu_k = 0.300$, compute the friction force $f_k$.
3. Determine the horizontal acceleration $a_x$ of the vacuum cleaner.

#### Solution
**Step 1: Normal force**
Forces in the vertical direction:
- Downward gravity: $W = m g = 12.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 117.60\,\text{N}$.
- Downward push component: $F_y = F \sin(40.0^\circ) = 45.0 \times 0.642788 = 28.925\,\text{N}$.
- Upward normal force: $N$.
Vertical equilibrium ($a_y = 0$):
$$\sum F_y = N - m g - F \sin(40.0^\circ) = 0$$
$$N = m g + F \sin(40.0^\circ) = 117.60\,\text{N} + 28.925\,\text{N} = 146.525\,\text{N} \approx 146.5\,\text{N}$$

**Step 2: Friction force**
$$f_k = \mu_k N = 0.300 \times 146.525\,\text{N} = 43.958\,\text{N} \approx 44.0\,\text{N}$$

**Step 3: Horizontal acceleration**
Forward component of push:
$$F_x = F \cos(40.0^\circ) = 45.0 \times 0.766044 = 34.472\,\text{N}$$
Net horizontal force:
$$\sum F_x = F_x - f_k = 34.472\,\text{N} - 43.958\,\text{N} = -9.486\,\text{N}$$
Since $\sum F_x < 0$, the push force is insufficient to overcome kinetic friction! The vacuum cleaner cannot accelerate forward under this force; it will rapidly grind to a halt or fail to move.

---

### Example 4.2: Upward Pull on a Sled (Contact Liftoff Threshold)
**Problem:** A sled of mass $m = 20.0\,\text{kg}$ rests on a frozen lake. A rope pulls the sled upward and forward at an angle $\theta = 35.0^\circ$ above the horizontal with tension $T$.
1. Derive the formula for normal force $N(T)$.
2. Calculate $N$ when $T = 150.0\,\text{N}$.
3. What critical pull tension $T_{\text{liftoff}}$ causes the sled to lift off the ice entirely ($N = 0$)?

#### Solution
**Step 1: Normal force expression**
$$\sum F_y = N + T \sin\theta - m g = 0 \implies N(T) = m g - T \sin\theta$$
$$m g = 20.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 196.00\,\text{N}$$
$$N(T) = 196.00 - T \sin(35.0^\circ) = 196.00 - 0.573576 T$$

**Step 2: Evaluate at $T = 150.0\,\text{N}$**
$$N = 196.00 - (150.0 \times 0.573576) = 196.00 - 86.036 = 109.964\,\text{N} \approx 110.0\,\text{N}$$

**Step 3: Critical liftoff tension ($N = 0$)**
$$196.00 - T_{\text{liftoff}} \sin(35.0^\circ) = 0 \implies T_{\text{liftoff}} = \frac{196.00\,\text{N}}{\sin(35.0^\circ)} = \frac{196.00}{0.573576} = 341.72\,\text{N} \approx 341.7\,\text{N}$$
If tension exceeds $341.7\,\text{N}$, the sled leaves the ice.

---

### Example 4.3: Apparent Weight on an Elevating Scale
**Problem:** An instrument sensor of mass $m = 5.00\,\text{kg}$ is placed on an electronic force plate inside a rocket capsule. During launch, the rocket ascends vertically from the pad with constant acceleration $a = 3.50\,g = 3.50 \times 9.80 = 34.30\,\text{m/s}^2$.
1. What is the true gravitational weight of the sensor?
2. What normal force $N$ does the force plate register during launch?
3. Express the apparent weight as a multiple of true weight.

#### Solution
**Step 1: True weight**
$$W = m g = 5.00\,\text{kg} \times 9.80\,\text{m/s}^2 = 49.00\,\text{N}$$

**Step 2: Normal force during launch**
Taking upward as positive:
$$\sum F_y = N - m g = m a \implies N = m (g + a)$$
$$N = 5.00\,\text{kg} \times (9.80 + 34.30)\,\text{m/s}^2 = 5.00 \times 44.10 = 220.50\,\text{N}$$

**Step 3: Ratio to true weight**
$$\frac{N}{W} = \frac{m(g + a)}{mg} = 1 + \frac{a}{g} = 1 + 3.50 = 4.50$$
The sensor experiences an apparent weight of $4.50\,g$ ($220.5\,\text{N}$ vs $49.0\,\text{N}$).

---

### Example 4.4: Inverted Loop Normal Force at the Apex
**Problem:** A roller coaster car of mass $m = 600.0\,\text{kg}$ traverses the top of a circular vertical loop of radius $R = 14.0\,\text{m}$.
1. If the car passes the apex with speed $v = 16.0\,\text{m/s}$, calculate the downward normal force $N$ exerted by the rails on the car.
2. What is the minimum critical speed $v_{\text{crit}}$ required to maintain contact with the rails ($N = 0$)?
3. What is the normal force if the car travels at $v = 11.0\,\text{m/s}$?

#### Solution
**Step 1: Normal force at $v = 16.0\,\text{m/s}$**
At the apex of an inside loop, both gravity and the rail's normal force point downward toward the center:
$$\sum F_{\text{radial}} = N + m g = m \frac{v^2}{R} \implies N = m \left(\frac{v^2}{R} - g\right)$$
$$\frac{v^2}{R} = \frac{(16.0\,\text{m/s})^2}{14.0\,\text{m}} = \frac{256.0}{14.0} = 18.2857\,\text{m/s}^2$$
$$N = 600.0\,\text{kg} \times (18.2857 - 9.8000)\,\text{m/s}^2 = 600.0 \times 8.4857 = 5091.43\,\text{N} \approx 5.09\,\text{kN}$$

**Step 2: Minimum critical speed ($N = 0$)**
$$m \left(\frac{v_{\text{crit}}^2}{R} - g\right) = 0 \implies v_{\text{crit}} = \sqrt{g R} = \sqrt{9.80 \times 14.0} = \sqrt{137.2} = 11.713\,\text{m/s} \approx 11.7\,\text{m/s}$$

**Step 3: Speed at $v = 11.0\,\text{m/s}$**
$$\frac{v^2}{R} = \frac{(11.0)^2}{14.0} = \frac{121.0}{14.0} = 8.643\,\text{m/s}^2 < g = 9.80\,\text{m/s}^2$$
$$N = 600.0 \times (8.643 - 9.800) = -694.2\,\text{N} < 0$$
Because the rails cannot pull upward on standard wheels, $N < 0$ means the car has separated from the rails and fallen out of circular motion! (Modern coasters prevent this with under-friction safety locking wheels).

---

### Example 4.5: Cresting a Humpback Bridge
**Problem:** A sports car of mass $m = 1400.0\,\text{kg}$ drives over a circular hill crest with a radius of curvature $R = 80.0\,\text{m}$.
1. Formulate the normal force $N(v)$ as a function of speed.
2. Calculate the normal force when the car crosses the crest at $v = 54.0\,\text{km/h} = 15.0\,\text{m/s}$.
3. At what speed $v_{\text{airborne}}$ do the car's tires lose contact with the road?

#### Solution
**Step 1: Normal force equation**
At the crest, the center of curvature is below the road. Centripetal acceleration points vertically downward:
$$\sum F_y = m g - N = m \frac{v^2}{R} \implies N = m \left(g - \frac{v^2}{R}\right)$$

**Step 2: Normal force at $v = 15.0\,\text{m/s}$**
$$\frac{v^2}{R} = \frac{(15.0)^2}{80.0} = \frac{225.0}{80.0} = 2.8125\,\text{m/s}^2$$
$$N = 1400.0\,\text{kg} \times (9.80 - 2.8125)\,\text{m/s}^2 = 1400.0 \times 6.9875 = 9782.50\,\text{N} \approx 9.78\,\text{kN}$$
*(Rest weight: $W = 1400 \times 9.8 = 13720\,\text{N}$; the car feels $29\%$ lighter).*

**Step 3: Speed for airborne liftoff ($N = 0$)**
$$g - \frac{v_{\text{airborne}}^2}{R} = 0 \implies v_{\text{airborne}} = \sqrt{g R} = \sqrt{9.80 \times 80.0} = \sqrt{784.0} = 28.00\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v_{\text{airborne}} = 28.00 \times 3.6 = 100.8\,\text{km/h}$$
At $100.8\,\text{km/h}$, the car flies off the road.

---

### Example 4.6: Block on an Accelerating Wedge (No Slip Condition)
**Problem:** A block of mass $m = 5.00\,\text{kg}$ rests on a frictionless triangular wedge inclined at angle $\theta = 30.0^\circ$. The wedge is accelerated horizontally to the right with acceleration $A$.
1. Draw the FBD of the block.
2. Determine the required horizontal acceleration $A$ such that the block does not slide up or down the wedge.
3. Compute the normal force $N$ exerted by the wedge on the block under this acceleration.

#### Solution
**Step 1: FBD and coordinate axes**
Since the acceleration of the block is purely horizontal ($a_x = A, a_y = 0$), use standard horizontal/vertical axes $(x, y)$!
Forces acting on block:
- Gravity: $\vec{W} = -m g\,\hat{j}$.
- Normal force: $\vec{N}$ perpendicular to the $30.0^\circ$ incline, pointing up and left at angle $\theta = 30.0^\circ$ to the vertical:
  $$N_x = N \sin\theta, \quad N_y = N \cos\theta$$

**Step 2: Solve for horizontal acceleration $A$**
Vertical equilibrium ($a_y = 0$):
$$\sum F_y = N \cos\theta - m g = 0 \implies N \cos\theta = m g \implies N = \frac{m g}{\cos\theta}$$
Horizontal dynamics ($a_x = A$):
$$\sum F_x = N \sin\theta = m A$$
Substitute $N = \frac{m g}{\cos\theta}$:
$$\left(\frac{m g}{\cos\theta}\right) \sin\theta = m A \implies m g \tan\theta = m A$$
$$A = g \tan\theta = 9.80\,\text{m/s}^2 \times \tan(30.0^\circ) = 9.80 \times \frac{1}{\sqrt{3}} = \frac{9.80}{1.73205} = 5.658\,\text{m/s}^2 \approx 5.66\,\text{m/s}^2$$

**Step 3: Normal force $N$**
$$N = \frac{m g}{\cos(30.0^\circ)} = \frac{5.00\,\text{kg} \times 9.80\,\text{m/s}^2}{0.866025} = \frac{49.00}{0.866025} = 56.58\,\text{N}$$
Notice that $N > mg$ ($56.6\,\text{N}$ vs $49.0\,\text{N}$) because the wedge must both support gravity and accelerate the block horizontally!

---

### Example 4.7: Banked Curve without Friction
**Problem:** Civil engineers design an unbanked curve on a high-speed highway with radius $R = 250.0\,\text{m}$ for an intended design speed of $v = 108.0\,\text{km/h} = 30.0\,\text{m/s}$.
1. Find the required banking angle $\theta$ such that a car can navigate the turn with zero friction.
2. Calculate the normal force $N$ on a $1200.0\,\text{kg}$ car navigating the turn at this design speed.

#### Solution
**Step 1: Banking angle $\theta$**
Forces acting on the car:
- Downward gravity: $W = m g$.
- Normal force: $\vec{N}$ perpendicular to the banked road (angle $\theta$ with the vertical).
Vertical equilibrium:
$$\sum F_y = N \cos\theta - m g = 0 \implies N \cos\theta = m g$$
Horizontal centripetal dynamics:
$$\sum F_{\text{radial}} = N \sin\theta = m \frac{v^2}{R}$$
Dividing horizontal by vertical:
$$\frac{N \sin\theta}{N \cos\theta} = \frac{m v^2 / R}{m g} \implies \tan\theta = \frac{v^2}{g R}$$
$$\tan\theta = \frac{(30.0\,\text{m/s})^2}{9.80\,\text{m/s}^2 \times 250.0\,\text{m}} = \frac{900.0}{2450.0} = 0.367347$$
$$\theta = \arctan(0.367347) = 20.17^\circ \approx 20.2^\circ$$

**Step 2: Normal force on $1200.0\,\text{kg}$ car**
$$N = \frac{m g}{\cos\theta} = \frac{1200.0 \times 9.80}{\cos(20.17^\circ)} = \frac{11760.0}{0.93866} = 12528.5\,\text{N} \approx 12.53\,\text{kN}$$
*(Rest weight: $11.76\,\text{kN}$; banking increases the normal load by $6.5\%$).*

---

### Example 4.8: Normal Force in a Centrifuge Rotor
**Problem:** An astronaut trainee of mass $m = 75.0\,\text{kg}$ sits in the gondola of a human centrifuge rotating in a horizontal circle of radius $R = 8.00\,\text{m}$ at angular velocity $\omega = 2.50\,\text{rad/s}$. The back of the seat is vertical.
1. What normal force $N_{\text{seat}}$ is exerted horizontally on the astronaut's back?
2. What normal force $N_{\text{bottom}}$ is exerted vertically on the seat cushion?
3. Calculate the total contact force and the effective $g$-force experienced.

#### Solution
**Step 1: Horizontal normal force (Back of seat)**
The back of the seat must provide the entire centripetal force:
$$N_{\text{seat}} = m \omega^2 R = 75.0\,\text{kg} \times (2.50\,\text{rad/s})^2 \times 8.00\,\text{m} = 75.0 \times 6.25 \times 8.00 = 75.0 \times 50.00 = 3750.0\,\text{N}$$

**Step 2: Vertical normal force (Seat cushion)**
The cushion supports gravity:
$$N_{\text{bottom}} = m g = 75.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 735.0\,\text{N}$$

**Step 3: Total contact force and $g$-force**
$$F_{\text{total}} = \sqrt{N_{\text{seat}}^2 + N_{\text{bottom}}^2} = \sqrt{(3750.0)^2 + (735.0)^2} = \sqrt{14062500 + 540225} = \sqrt{14602725} = 3821.35\,\text{N} \approx 3.82\,\text{kN}$$
$$g\text{-force} = \frac{F_{\text{total}}}{m g} = \frac{3821.35\,\text{N}}{735.0\,\text{N}} = 5.20\,g$$
The astronaut experiences a $5.20\,g$ acceleration environment.

---

### Example 4.9: Normal Force on a Skier in a Dip
**Problem:** A cross-country skier of mass $m = 68.0\,\text{kg}$ glides through the bottom of a circular valley dip of radius $R = 30.0\,\text{m}$ at speed $v = 18.0\,\text{m/s}$.
1. Draw the FBD at the bottom of the dip.
2. Calculate the normal force $N$ exerted by the snow on the skis.
3. Compare $N$ to the skier's normal weight.

#### Solution
**Step 1: FBD at the bottom of the dip**
- Gravity points downward: $W = m g$.
- Normal force points upward toward the center of curvature: $N$.
Centripetal acceleration points vertically upward: $a_c = +v^2/R$.

**Step 2: Normal force calculation**
$$\sum F_y = N - m g = m \frac{v^2}{R} \implies N = m \left(g + \frac{v^2}{R}\right)$$
$$\frac{v^2}{R} = \frac{(18.0\,\text{m/s})^2}{30.0\,\text{m}} = \frac{324.0}{30.0} = 10.80\,\text{m/s}^2$$
$$N = 68.0\,\text{kg} \times (9.80 + 10.80)\,\text{m/s}^2 = 68.0 \times 20.60 = 1400.80\,\text{N} \approx 1.40\,\text{kN}$$

**Step 3: Comparison with normal weight**
$$W = m g = 68.0 \times 9.80 = 666.40\,\text{N}$$
$$\text{Ratio} = \frac{1400.80\,\text{N}}{666.40\,\text{N}} = 2.10$$
The skier feels more than double their normal weight ($2.10\,g$) as they bottom out.

---

### Example 4.10: Two-Block Stack on an Inclined Plane
**Problem:** Block 1 of mass $m_1 = 4.00\,\text{kg}$ rests on a frictionless ramp inclined at $\theta = 25.0^\circ$. Block 2 of mass $m_2 = 2.00\,\text{kg}$ rests on top of Block 1. The two blocks slide down the frictionless ramp together.
1. Draw the separate FBD for Block 2 and for Block 1.
2. Determine the common acceleration of the stack.
3. Calculate the normal force $N_{12}$ between Block 1 and Block 2.
4. Calculate the normal force $N_{\text{ramp}}$ between the ramp and Block 1.

#### Solution
**Step 1: FBDs and coordinate system**
Tilt axes: $+x$ down the ramp, $+y$ perpendicular upward from the ramp.
Both blocks accelerate down the ramp together with acceleration $a_x = a, a_y = 0$.

**Step 2: Common acceleration**
Combined mass $M = m_1 + m_2 = 6.00\,\text{kg}$.
Since the ramp is frictionless:
$$\sum F_x = M g \sin\theta = M a \implies a = g \sin(25.0^\circ) = 9.80 \times 0.422618 = 4.1417\,\text{m/s}^2 \approx 4.14\,\text{m/s}^2$$

**Step 3: Normal force $N_{12}$ on Block 2**
Isolate Block 2 ($m_2 = 2.00\,\text{kg}$):
Forces in the $y$-direction (perpendicular to ramp):
- Upward normal force from Block 1: $N_{12}$.
- Perpendicular gravity component: $m_2 g \cos\theta$.
Since $a_y = 0$:
$$\sum F_y = N_{12} - m_2 g \cos\theta = 0 \implies N_{12} = m_2 g \cos\theta$$
$$N_{12} = 2.00\,\text{kg} \times 9.80\,\text{m/s}^2 \times \cos(25.0^\circ) = 19.60 \times 0.906308 = 17.764\,\text{N} \approx 17.76\,\text{N}$$

**Step 4: Normal force $N_{\text{ramp}}$ on Block 1**
Isolate Block 1 ($m_1 = 4.00\,\text{kg}$):
Forces in $y$-direction:
- Upward normal force from ramp: $N_{\text{ramp}}$.
- Downward normal force from Block 2 (Newton's Third Law): $N_{12}$.
- Perpendicular gravity component: $m_1 g \cos\theta$.
$$\sum F_y = N_{\text{ramp}} - N_{12} - m_1 g \cos\theta = 0$$
$$N_{\text{ramp}} = N_{12} + m_1 g \cos\theta = m_2 g \cos\theta + m_1 g \cos\theta = (m_1 + m_2) g \cos\theta$$
$$N_{\text{ramp}} = 6.00\,\text{kg} \times 9.80\,\text{m/s}^2 \times 0.906308 = 58.80 \times 0.906308 = 53.291\,\text{N} \approx 53.29\,\text{N}$$

---

## 4.7 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 4.1 (Tier 1: Angled Push Normal Force)
A lawnmower of mass $m = 16.0\,\text{kg}$ is pushed with a force of $F = 60.0\,\text{N}$ directed along the handle at an angle of $\theta = 35.0^\circ$ below the horizontal. What is the normal force exerted by the ground on the lawnmower?

### Exercise 4.2 (Tier 1: Normal Force on a Roof)
A worker of mass $m = 82.0\,\text{kg}$ stands on a pitched roof inclined at $\theta = 22.0^\circ$ to the horizontal. What is the normal force exerted by the roof shingles on the worker?

### Exercise 4.3 (Tier 2: Angled Pull Normal Force)
A child pulls a wagon of mass $m = 14.0\,\text{kg}$ with a handle force of $T = 50.0\,\text{N}$ inclined at $\theta = 45.0^\circ$ above the horizontal. What is the normal force on the wagon?

### Exercise 4.4 (Tier 2: Elevator with Scale)
A package of mass $m = 15.0\,\text{kg}$ sits on the floor of an elevator. Calculate the normal force exerted on the package when the elevator:
(a) Accelerates upward at $a = 2.00\,\text{m/s}^2$.
(b) Cruises upward at constant speed $v = 3.00\,\text{m/s}$.
(c) Accelerates downward at $a = 2.00\,\text{m/s}^2$.

### Exercise 4.5 (Tier 3: Inverted Roller Coaster Loop)
A coaster car travels over the top of a vertical circular loop of radius $R = 18.0\,\text{m}$.
(a) What is the minimum speed $v_{\text{crit}}$ required for the passengers to avoid falling out of their seats?
(b) If the car enters the loop apex at $v = 20.0\,\text{m/s}$, what is the apparent weight of a $70.0\,\text{kg}$ passenger?

### Exercise 4.6 (Tier 3: Humpback Road Crest Liftoff)
A delivery van drives over a rounded road crest with radius of curvature $R = 65.0\,\text{m}$. What is the maximum speed in $\text{km/h}$ at which the van can cross the crest without losing contact with the pavement?

### Exercise 4.7 (Tier 4: Accelerating Wedge with Steeper Incline)
A block rests on a frictionless wedge inclined at $\theta = 45.0^\circ$. What horizontal acceleration $A$ must be imparted to the wedge so that the block remains stationary relative to the wedge? What is the normal force if the block has mass $m = 3.00\,\text{kg}$?

### Exercise 4.8 (Tier 4: Centrifuge Wall Normal Force)
In an amusement park "Rotor" ride, riders stand against the inner vertical wall of a rotating cylindrical drum of radius $R = 4.50\,\text{m}$. The drum rotates at $\omega = 3.20\,\text{rad/s}$. What normal force does the wall exert on an $80.0\,\text{kg}$ rider?

### Exercise 4.9 (Tier 5: Normal Force with Two Angled Forces)
A crate of mass $m = 50.0\,\text{kg}$ on a horizontal floor is simultaneously acted upon by two ropes:
- Rope 1 pulls with $T_1 = 200.0\,\text{N}$ at $30.0^\circ$ above horizontal.
- Rope 2 pushes with $F_2 = 150.0\,\text{N}$ at $20.0^\circ$ below horizontal.
(a) Determine the normal force $N$ on the crate.
(b) If $\mu_k = 0.200$, calculate the crate's horizontal acceleration.

### Exercise 4.10 (Tier 5: Sphere in a Spherical Bowl)
A small marble of mass $m = 0.050\,\text{kg}$ rolls on the inside frictionless surface of a hemispherical bowl of radius $R = 0.400\,\text{m}$. When the marble is at an angular position $\theta = 60.0^\circ$ from the bottom, its speed is $v = 1.20\,\text{m/s}$.
Calculate the normal force $N$ exerted by the bowl on the marble.

---

## 4.8 Comprehensive Solutions to Chapter Exercises

---

### Solution 4.1
Downward push: $F_y = F \sin(35.0^\circ) = 60.0 \times 0.573576 = 34.415\,\text{N}$.
Weight: $W = m g = 16.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 156.80\,\text{N}$.
$$N = m g + F \sin(35.0^\circ) = 156.80\,\text{N} + 34.415\,\text{N} = 191.215\,\text{N} \approx 191.2\,\text{N}$$

---

### Solution 4.2
On an incline of $\theta = 22.0^\circ$:
$$N = m g \cos(22.0^\circ) = 82.0\,\text{kg} \times 9.80\,\text{m/s}^2 \times \cos(22.0^\circ) = 803.60 \times 0.927184 = 745.085\,\text{N} \approx 745.1\,\text{N}$$

---

### Solution 4.3
Upward pull component: $T_y = T \sin(45.0^\circ) = 50.0 \times 0.707107 = 35.355\,\text{N}$.
Weight: $W = m g = 14.0 \times 9.80 = 137.20\,\text{N}$.
$$N = m g - T \sin(45.0^\circ) = 137.20\,\text{N} - 35.355\,\text{N} = 101.845\,\text{N} \approx 101.8\,\text{N}$$

---

### Solution 4.4
Package mass $m = 15.0\,\text{kg} \implies m g = 15.0 \times 9.80 = 147.0\,\text{N}$.
**(a) Upward acceleration ($a = +2.00\,\text{m/s}^2$):**
$$N = m(g + a) = 15.0 \times (9.80 + 2.00) = 15.0 \times 11.80 = 177.00\,\text{N}$$

**(b) Constant velocity ($a = 0$):**
$$N = m g = 147.00\,\text{N}$$

**(c) Downward acceleration ($a = -2.00\,\text{m/s}^2$):**
$$N = m(g + a) = 15.0 \times (9.80 - 2.00) = 15.0 \times 7.80 = 117.00\,\text{N}$$

---

### Solution 4.5
**(a) Minimum critical speed ($N = 0$):**
$$v_{\text{crit}} = \sqrt{g R} = \sqrt{9.80 \times 18.0} = \sqrt{176.4} = 13.28\,\text{m/s}$$

**(b) Apparent weight at $v = 20.0\,\text{m/s}$ ($m = 70.0\,\text{kg}$):**
$$N = m \left(\frac{v^2}{R} - g\right) = 70.0 \left(\frac{400.0}{18.0} - 9.80\right) = 70.0 (22.222 - 9.800) = 70.0 \times 12.422 = 869.56\,\text{N}$$

---

### Solution 4.6
Liftoff occurs when $N = 0$:
$$v_{\text{max}} = \sqrt{g R} = \sqrt{9.80 \times 65.0} = \sqrt{637.0} = 25.239\,\text{m/s}$$
Convert to $\text{km/h}$:
$$v_{\text{max}} = 25.239 \times 3.6 = 90.86\,\text{km/h} \approx 90.9\,\text{km/h}$$

---

### Solution 4.7
For an inclined wedge of $\theta = 45.0^\circ$:
$$A = g \tan(45.0^\circ) = 9.80 \times 1.000 = 9.80\,\text{m/s}^2$$
Normal force:
$$N = \frac{m g}{\cos(45.0^\circ)} = \frac{3.00 \times 9.80}{1/\sqrt{2}} = 29.40 \times \sqrt{2} = 41.58\,\text{N}$$

---

### Solution 4.8
The normal force from the vertical wall supplies centripetal acceleration:
$$N = m \omega^2 R = 80.0\,\text{kg} \times (3.20\,\text{rad/s})^2 \times 4.50\,\text{m} = 80.0 \times 10.24 \times 4.50 = 3686.40\,\text{N} \approx 3.69\,\text{kN}$$

---

### Solution 4.9
**(a) Normal force:**
- $W = 50.0 \times 9.80 = 490.0\,\text{N}$.
- Upward component of $T_1$: $T_{1y} = 200.0 \sin(30.0^\circ) = 100.0\,\text{N}$.
- Downward component of $F_2$: $F_{2y} = 150.0 \sin(20.0^\circ) = 150.0 \times 0.342020 = 51.303\,\text{N}$.
$$\sum F_y = N + T_{1y} - F_{2y} - W = 0$$
$$N = W + F_{2y} - T_{1y} = 490.0 + 51.303 - 100.0 = 441.303\,\text{N} \approx 441.3\,\text{N}$$

**(b) Horizontal acceleration:**
- Forward pull $T_{1x} = 200.0 \cos(30.0^\circ) = 173.205\,\text{N}$.
- Forward push $F_{2x} = 150.0 \cos(20.0^\circ) = 150.0 \times 0.939693 = 140.954\,\text{N}$.
- Total forward force: $F_x = 173.205 + 140.954 = 314.159\,\text{N}$.
- Friction: $f_k = \mu_k N = 0.200 \times 441.303 = 88.261\,\text{N}$.
$$\sum F_x = 314.159 - 88.261 = 225.898\,\text{N}$$
$$a_x = \frac{\sum F_x}{m} = \frac{225.898\,\text{N}}{50.0\,\text{kg}} = 4.518\,\text{m/s}^2 \approx 4.52\,\text{m/s}^2$$

---

### Solution 4.10
In a spherical bowl of radius $R$, at angle $\theta = 60.0^\circ$ from the bottom, the normal points inward toward the bowl center.
Gravity has component radially outward: $W_{\text{rad}} = m g \cos\theta$.
The normal force points radially inward:
$$\sum F_{\text{rad}} = N - m g \cos\theta = m \frac{v^2}{R} \implies N = m \left(g \cos\theta + \frac{v^2}{R}\right)$$
Substitute values:
- $m = 0.050\,\text{kg}$
- $g \cos(60.0^\circ) = 9.80 \times 0.500 = 4.90\,\text{m/s}^2$
- $\frac{v^2}{R} = \frac{(1.20)^2}{0.400} = \frac{1.44}{0.400} = 3.60\,\text{m/s}^2$
$$N = 0.050\,\text{kg} \times (4.90 + 3.60)\,\text{m/s}^2 = 0.050 \times 8.50 = 0.425\,\text{N}$$
