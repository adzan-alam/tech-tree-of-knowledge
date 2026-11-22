# Chapter 10: Non-Inertial Reference Frames and Fictitious Forces — D’Alembert, Centrifugal Fields, and Coriolis Dynamics

> *"Fictitious forces are not ghosts invented to rescue broken mathematics. They are the exact kinematic price one pays for choosing an accelerated coordinate system to observe an inertial universe."*

---

## 10.1 The Crisis of the Accelerating Observer

In Chapter 01, we established Newton's First Law (Lex I) as the foundational criterion of classical mechanics: there exists a privileged class of coordinate systems—termed **Inertial Reference Frames**—in which a body free of net external forces persists indefinitely in a state of rest or uniform collinear translation:

$$\sum \vec{F}_{\text{real}} = \vec{0} \implies \frac{d\vec{v}}{dt} = \vec{0}$$

Now, imagine an observer seated inside a windowless high-speed train carriage. Suppose the train suddenly applies emergency magnetic brakes, accelerating backward with a deceleration of $A = 4.0\,\text{m/s}^2$. An empty coffee cup resting upon a polished frictionless table suddenly lurches forward, accelerating toward the front of the carriage at $a' = 4.0\,\text{m/s}^2$.

If the observer insists that the carriage represents a valid rest frame, they face a severe conceptual crisis:
1. No physical body touches the cup horizontally.
2. No magnetic, electrostatic, or gravitational gradient pulls it toward the front of the carriage.
3. The vertical forces (normal contact and terrestrial gravity) cancel completely: $\sum F_y = N - mg = 0$.
4. Yet the cup accelerates violently along the horizontal axis!

If Newton's Second Law ($\sum \vec{F} = m\vec{a}$) is applied blindly in this accelerating carriage frame, it fails completely:

$$\sum \vec{F}_{\text{real}} = \vec{0} \ne m\vec{a}'$$

To reconcile this breakdown, classical mechanics provides two distinct but mathematically equivalent pathways:
- **The Inertial Viewpoint (External Observer):** The carriage and table decelerate beneath the cup. The cup, possessing invariant mass and inertia, simply obeys Newton’s First Law and continues moving forward at its pre-braking velocity $v_0$ until it strikes the front bulkhead.
- **The Non-Inertial Viewpoint (Internal Observer & D'Alembert's Principle):** The observer retains their accelerated coordinate frame by augmenting the physical forces with a mathematically rigorous **Inertial (Fictitious) Force**:

$$\vec{F}_{\text{inertial}} = -m \vec{A}_{\text{frame}}$$

Once this inertial force is introduced, Newton's Second Law is completely restored in the non-inertial frame:

$$\sum \vec{F}_{\text{real}} + \vec{F}_{\text{inertial}} = m \vec{a}'$$

Far from being an ad-hoc hack, this formulation is deeply profound. In 1907, Albert Einstein recognized that the indistinguishability of an inertial force $\vec{F}_{\text{inertial}} = -m\vec{A}$ and a gravitational force $\vec{F}_g = m\vec{g}$ was the foundational spark of General Relativity—the **Principle of Equivalence**.

---

## 10.2 Kinematics of Linearly Accelerating Frames

Let $S$ denote an inertial laboratory frame with origin $O$, and let $S'$ denote a moving non-inertial frame with origin $O'$.
Suppose $S'$ maintains its axes parallel to $S$ (no rotation), but the origin $O'$ accelerates relative to $O$ with an instantaneous acceleration $\vec{A}(t)$.

```
      Inertial Frame S                       Non-Inertial Frame S'
            +Y                                     +y'
             ^                                      ^
             |                                      |      Particle P
             |        Origin Displacement R(t)      |      *
             |    ---------------------------->     |     /
             |                                      |    / r'(t)
             +--------------------> +X              +---+----------------> +x'
           Origin O                               Origin O'
```

Let a particle $P$ have position vector $\vec{r}$ in $S$ and $\vec{r}'$ in $S'$.
By vector addition:

$$\vec{r}(t) = \vec{R}(t) + \vec{r}'(t)$$

Differentiating twice with respect to time:

$$\dot{\vec{r}}(t) = \dot{\vec{R}}(t) + \dot{\vec{r}}'(t) \implies \vec{v} = \vec{V} + \vec{v}'$$

$$\ddot{\vec{r}}(t) = \ddot{\vec{R}}(t) + \ddot{\vec{r}}'(t) \implies \vec{a} = \vec{A} + \vec{a}'$$

Here:
- $\vec{a}$ is the true acceleration measured in the inertial frame $S$.
- $\vec{A} = \ddot{\vec{R}}$ is the acceleration of the non-inertial frame $S'$ relative to $S$.
- $\vec{a}'$ is the relative acceleration observed within the non-inertial frame $S'$.

Rearranging for the observed acceleration $\vec{a}'$:

$$\vec{a}' = \vec{a} - \vec{A}$$

Multiply throughout by the invariant mass $m$ of the particle:

$$m \vec{a}' = m \vec{a} - m \vec{A}$$

Since the particle obeys Newton's Second Law in the inertial frame, $m\vec{a} = \sum \vec{F}_{\text{real}}$:

$$m \vec{a}' = \sum \vec{F}_{\text{real}} - m \vec{A}$$

Defining the **inertial fictitious force** as:

$$\vec{F}_{\text{inertial}} = -m \vec{A}$$

we obtain the canonical non-inertial equation of motion:

$$\sum \vec{F}_{\text{effective}} = \sum \vec{F}_{\text{real}} + \vec{F}_{\text{inertial}} = m \vec{a}'$$

### The Effective Gravity Field
When a linear non-inertial frame is subjected to both terrestrial gravity $\vec{g}$ and a frame acceleration $\vec{A}$, gravity and the inertial force combine into a single vector field termed **Effective Gravity** $\vec{g}_{\text{eff}}$:

$$\vec{F}_g + \vec{F}_{\text{inertial}} = m\vec{g} - m\vec{A} = m(\vec{g} - \vec{A})$$

$$\vec{g}_{\text{eff}} = \vec{g} - \vec{A}$$

All static and dynamic phenomena within the accelerated frame behave as though the universe possessed a uniform gravitational field pointing in the direction of $\vec{g}_{\text{eff}}$!

```
                  ^ +Y (Vertical)
                  |
                  |           -A (Inertial Fictitious Vector)
                  |        <-----------------
                  |                         |
                  |                         |  g (Terrestrial Gravity)
                  |                         v
                  |                        \
                  |                         \  g_eff = g - A
                  |                          v
                  +---------------------------------> +X (Frame Acceleration A ->)
```

---

## 10.3 Manifestations of Effective Gravity

### 1. The Accelerating Plumb Bob
A plumb bob of mass $m$ is suspended by a light cord inside a railcar accelerating horizontally rightward with acceleration $\vec{A} = A\,\hat{i}$.
In the frame of the railcar, the bob hangs at rest in static equilibrium ($\vec{a}' = \vec{0}$).

The forces acting on the bob in the carriage frame are:
1. Tension in cord: $\vec{T} = -T\sin\theta\,\hat{i} + T\cos\theta\,\hat{j}$
2. Terrestrial gravity: $\vec{F}_g = -mg\,\hat{j}$
3. Inertial fictitious force: $\vec{F}_{\text{inertial}} = -mA\,\hat{i}$

Equilibrium equations:

$$\sum F_x' = -T\sin\theta - mA = 0 \implies T\sin\theta = -mA$$

$$\sum F_y' = T\cos\theta - mg = 0 \implies T\cos\theta = mg$$

Dividing the two equations:

$$\tan\theta = \frac{A}{g} \implies \theta = \arctan\left(\frac{A}{g}\right)$$

Squaring and adding:

$$T^2(\sin^2\theta + \cos^2\theta) = (mA)^2 + (mg)^2 \implies T = m\sqrt{g^2 + A^2} = m \|\vec{g}_{\text{eff}}\|$$

The cord aligns itself precisely parallel to the effective gravity vector $\vec{g}_{\text{eff}}$!

```
              Ceiling of Carriage
              ====================
                        \  ) angle θ = arctan(A/g)
                         \
                          \  Tension T = m * ||g_eff||
                           \
                            * [m] Plumb Bob
                            | \
                     m*g    |  \  g_eff
                            v   v
```

### 2. The Tilting Fluid Surface in an Accelerating Tanker
Why does the surface of water in a glass or a tanker truck tilt when the vehicle accelerates?

In hydrostatics, a fluid at rest cannot support shear stresses. Consequently, the free surface of a liquid must always align itself **strictly perpendicular to the local effective gravity vector $\vec{g}_{\text{eff}}$**.

Since $\vec{g}_{\text{eff}} = -A\,\hat{i} - g\,\hat{j}$, the slope of the liquid surface relative to the horizontal is:

$$\tan\alpha = \frac{A}{g}$$

The fluid rises toward the rear of the tanker and drops at the front, creating a hydrostatic pressure gradient:

$$\nabla P = \rho \vec{g}_{\text{eff}}$$

### 3. The Accelerating Helium Balloon Paradox
If you hold a string attached to a helium balloon inside a car and suddenly accelerate forward, **which way does the balloon tilt**?
- Intuition based on naive inertia suggests the balloon should tilt backward like a human passenger or a plumb bob.
- **Physical Reality:** The helium balloon tilts **forward** into the direction of acceleration!

```
       =========================================================
       [ Carriage Accelerating Forward (--> A)                 ]
       [                                                       ]
       [         Heavy Air pushes backward                     ]
       [         (Pressure higher at back)                     ]
       [                                                       ]
       [                  /                                    ]
       [                 /  Helium Balloon tilts FORWARD!      ]
       [              ( O )                                    ]
       [               /                                       ]
       [              /                                        ]
       [             * Anchor                                  ]
       =========================================================
```

#### The Rigorous Explanation
A balloon floats via Archimedes' Principle: buoyancy is generated by the pressure gradient of the surrounding fluid:

$$\vec{F}_{\text{buoyancy}} = -\iint P \, d\vec{A} = -\int (\nabla P) \, dV = -V (\nabla P)$$

In the accelerating car, the effective gravity is $\vec{g}_{\text{eff}} = -A\,\hat{i} - g\,\hat{j}$.
The surrounding air forms a pressure gradient matching effective gravity:

$$\nabla P = \rho_{\text{air}} \vec{g}_{\text{eff}}$$

Therefore, the buoyant force on the balloon is:

$$\vec{F}_{\text{buoyancy}} = -\rho_{\text{air}} V \vec{g}_{\text{eff}}$$

Meanwhile, the effective gravitational-inertial force on the balloon of mass $m_{\text{balloon}} = \rho_{\text{He}} V$ is:

$$\vec{F}_{\text{eff}} = m_{\text{balloon}} \vec{g}_{\text{eff}} = \rho_{\text{He}} V \vec{g}_{\text{eff}}$$

The net force acting on the balloon (excluding string tension) is:

$$\vec{F}_{\text{net}} = \vec{F}_{\text{buoyancy}} + \vec{F}_{\text{eff}} = -(\rho_{\text{air}} - \rho_{\text{He}}) V \vec{g}_{\text{eff}}$$

Because air is significantly denser than helium ($\rho_{\text{air}} \approx 1.2\,\text{kg/m}^3 \gg \rho_{\text{He}} \approx 0.18\,\text{kg/m}^3$), the coefficient $-(\rho_{\text{air}} - \rho_{\text{He}})$ is **negative**!
Thus, $\vec{F}_{\text{net}}$ points **opposite to $\vec{g}_{\text{eff}}$**.
Since $\vec{g}_{\text{eff}}$ points downward and *backward*, the buoyant force points upward and **forward**! The denser air rushes to the rear of the car, displacing the lighter helium balloon forward.

---

## 10.4 Kinematics in Rotating Reference Frames

The most mathematically rich non-inertial systems are **rotating reference frames**. Consider a frame $S'$ rotating with instantaneous angular velocity vector $\vec{\omega}(t)$ relative to an inertial frame $S$.

### The Transport Theorem for Vector Operators
Let $\vec{G}(t)$ be an arbitrary vector. The time derivative of $\vec{G}$ as seen by an inertial observer differs from the time derivative seen by an observer rotating within $S'$ according to the universal **Transport Theorem**:

$$\left(\frac{d\vec{G}}{dt}\right)_{\text{inertial}} = \left(\frac{d\vec{G}}{dt}\right)_{\text{rot}} + \vec{\omega} \times \vec{G}$$

Applying the Transport Theorem to the position vector $\vec{r}$ (assuming shared origin $O \equiv O'$):

$$\vec{v}_{\text{inertial}} = \vec{v}' + \vec{\omega} \times \vec{r}$$

Here:
- $\vec{v}' = \left(\frac{d\vec{r}}{dt}\right)_{\text{rot}}$ is the velocity of the particle measured relative to the rotating frame.
- $\vec{\omega} \times \vec{r}$ is the tangential velocity due to the frame's rotation.

Now apply the Transport Theorem a second time to the velocity vector $\vec{v}_{\text{inertial}}$:

$$\vec{a}_{\text{inertial}} = \left(\frac{d\vec{v}_{\text{inertial}}}{dt}\right)_{\text{inertial}} = \left(\frac{d\vec{v}_{\text{inertial}}}{dt}\right)_{\text{rot}} + \vec{\omega} \times \vec{v}_{\text{inertial}}$$

Substitute $\vec{v}_{\text{inertial}} = \vec{v}' + \vec{\omega} \times \vec{r}$:

$$\vec{a}_{\text{inertial}} = \left(\frac{d}{dt}[\vec{v}' + \vec{\omega} \times \vec{r}]\right)_{\text{rot}} + \vec{\omega} \times [\vec{v}' + \vec{\omega} \times \vec{r}]$$

Expand both terms carefully:
1. $\left(\frac{d\vec{v}'}{dt}\right)_{\text{rot}} = \vec{a}'$ (the relative acceleration inside the rotating frame).
2. $\left(\frac{d}{dt}[\vec{\omega} \times \vec{r}]\right)_{\text{rot}} = \dot{\vec{\omega}} \times \vec{r} + \vec{\omega} \times \dot{\vec{r}}' = \dot{\vec{\omega}} \times \vec{r} + \vec{\omega} \times \vec{v}'$.
3. $\vec{\omega} \times [\vec{v}' + \vec{\omega} \times \vec{r}] = \vec{\omega} \times \vec{v}' + \vec{\omega} \times (\vec{\omega} \times \vec{r})$.

Combining like terms:

$$\vec{a}_{\text{inertial}} = \vec{a}' + 2(\vec{\omega} \times \vec{v}') + \vec{\omega} \times (\vec{\omega} \times \vec{r}) + \dot{\vec{\omega}} \times \vec{r}$$

Multiplying by mass $m$ and setting $m\vec{a}_{\text{inertial}} = \sum \vec{F}_{\text{real}}$, we solve for the equation of motion in the rotating frame:

$$m\vec{a}' = \sum \vec{F}_{\text{real}} + \vec{F}_{\text{coriolis}} + \vec{F}_{\text{centrifugal}} + \vec{F}_{\text{euler}}$$

---

## 10.5 The Trinity of Rotating Fictitious Forces

In a rotating frame, three distinct fictitious forces emerge naturally from coordinate geometry:

```
+---------------------------------------------------------------------------------------------------------+
|                                THE TRINITY OF ROTATING FORCES                                           |
+----------------------+------------------------------------------+---------------------------------------+
| Force Name           | Mathematical Formula                     | Physical Nature                       |
+----------------------+------------------------------------------+---------------------------------------+
| Centrifugal Force    | F_cf = -m [ ω x (ω x r) ] = m ω^2 r_perp | Purely Position-Dependent (Outward)   |
| Coriolis Force       | F_cor = -2m ( ω x v' )                   | Purely Velocity-Dependent (Deflective)|
| Euler Force          | F_euler = -m ( dω/dt x r )               | Present only when rotation accelerates|
+----------------------+------------------------------------------+---------------------------------------+
```

### 1. The Centrifugal Force ($\vec{F}_{\text{centrifugal}} = m\omega^2 \vec{r}_{\perp}$)
Using the vector triple product identity $\vec{A} \times (\vec{B} \times \vec{C}) = \vec{B}(\vec{A}\cdot\vec{C}) - \vec{C}(\vec{A}\cdot\vec{B})$:
If the rotation axis is aligned with $\hat{z}$ ($\vec{\omega} = \omega\,\hat{k}$) and $\vec{r} = x\,\hat{i} + y\,\hat{j} + z\,\hat{k}$:
$$\vec{\omega} \times \vec{r} = \omega(-y\,\hat{i} + x\,\hat{j})$$
$$\vec{\omega} \times (\vec{\omega} \times \vec{r}) = -\omega^2(x\,\hat{i} + y\,\hat{j}) = -\omega^2 \vec{r}_{\perp}$$
where $\vec{r}_{\perp} = x\,\hat{i} + y\,\hat{j}$ is the perpendicular radius vector from the axis of rotation.
Therefore:

$$\vec{F}_{\text{centrifugal}} = -m [-\omega^2 \vec{r}_{\perp}] = +m \omega^2 \vec{r}_{\perp}$$

- The centrifugal force acts strictly **radially outward** from the rotation axis.
- It depends solely on position $\vec{r}_{\perp}$, completely independent of whether the particle is moving or stationary within the frame!
- It is a **conservative force field** derived from a centrifugal potential:
  $$U_{\text{centrifugal}}(\vec{r}_{\perp}) = -\frac{1}{2} m \omega^2 r_{\perp}^2$$
  $$\vec{F}_{\text{centrifugal}} = -\nabla U_{\text{centrifugal}}$$

### 2. The Coriolis Force ($\vec{F}_{\text{Coriolis}} = -2m(\vec{\omega} \times \vec{v}')$)
Named after Gaspard-Gustave de Coriolis (1835):
- The Coriolis force exists **only when a body moves relative to the rotating frame** ($\vec{v}' \ne \vec{0}$).
- It is always **perpendicular to the relative velocity vector** $\vec{v}'$:
  $$\vec{F}_{\text{Coriolis}} \cdot \vec{v}' = -2m [(\vec{\omega} \times \vec{v}') \cdot \vec{v}'] \equiv 0$$
- **Consequence:** The Coriolis force **never does mechanical work**! It cannot alter the kinetic energy or speed of a particle in the rotating frame; it can only bend its trajectory.
- **Directional Rule:** In the Northern Hemisphere of a counterclockwise rotating planet ($\vec{\omega}$ pointing out of the North Pole), moving bodies are deflected to their **right**. In the Southern Hemisphere, they are deflected to their **left**.

### 3. The Euler Force ($\vec{F}_{\text{Euler}} = -m(\dot{\vec{\omega}} \times \vec{r})$)
When a carousel or centrifuge spins up or slows down ($\dot{\vec{\omega}} \ne \vec{0}$), an azimuthal fictitious force arises tangentially:
$$\vec{F}_{\text{Euler}} = -m \left(\frac{d\vec{\omega}}{dt} \times \vec{r}\right)$$
It opposes the angular acceleration of the reference frame.

---

## 10.6 Artificial Gravity and the Human Factor

In long-duration interplanetary space travel (such as missions to Mars), prolonged microgravity causes catastrophic bone mineral demineralization, muscle atrophy, and cardiovascular deconditioning. The premier civilizational solution is **Artificial Gravity via Centrifugal Rotation**.

```
                         Station Center (r = 0)
                                ( * ) Hub
                               /  |  \
                              /   |   \  Spokes
                             /    |    \
                            /     |     \
                           [=============] Outer Habitation Ring (Radius R)
                              v       ^
                             N=m*g   Centrifugal Force F_cf = m * ω^2 * R
```

### The Design Equation
To simulate standard terrestrial gravity ($g = 9.81\,\text{m/s}^2$) at the outer floor of a habitat ring of radius $R$:

$$a_{\text{centrifugal}} = \omega^2 R = g \implies \omega = \sqrt{\frac{g}{R}}$$

Rotational frequency $f$ in revolutions per minute (RPM):

$$f = \frac{\omega}{2\pi} \times 60 = \frac{60}{2\pi} \sqrt{\frac{g}{R}} \approx \frac{9.549}{\sqrt{R}} \quad \text{RPM}$$

### The Coriolis Dizziness Threshold
Why cannot we simply build a compact, 2-meter radius centrifuge spinning rapidly?
The human inner ear (vestibular system) contains three orthogonal semicircular canals filled with endolymph fluid. When an astronaut walks or turns their head in a rotating habitat:
1. **Head Turning ($v'$):** Turning the head produces an instantaneous Coriolis torque on the fluid in the semicircular canals, creating the nauseating cross-coupled angular illusion known as the **Coriolis Sickness Syndrome**.
2. **Medical Limit:** Decades of NASA and naval aeromedical research demonstrate that humans can adapt comfortably without chronic motion sickness only if the rotation rate is kept below:
   $$\omega_{\max} \le 2.0 \text{ to } 3.0\,\text{RPM}$$

To achieve $g = 9.81\,\text{m/s}^2$ at $\omega = 2.0\,\text{RPM} = 2.0 \times \frac{2\pi}{60} = 0.2094\,\text{rad/s}$:

$$R = \frac{g}{\omega^2} = \frac{9.81\,\text{m/s}^2}{(0.2094\,\text{rad/s})^2} = \frac{9.81}{0.04387} \approx 223.6\,\text{m}$$

An artificial gravity station must have a diameter of nearly **half a kilometer** to prevent vestibular disorientation!

---

## 10.7 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 10.1: Accelerating Subway Car Plumb Bob
**Problem:** A subway train accelerates horizontally from rest out of a station with constant acceleration $A = 2.45\,\text{m/s}^2$. A strap-hanger of mass $m = 65.0\,\text{kg}$ holds a light vertical strap suspended from the ceiling. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the deflection angle $\theta$ of the strap relative to the vertical.
2. Determine the tension $T$ in the strap during acceleration.
3. What is the magnitude of the effective gravity field $\vec{g}_{\text{eff}}$ felt inside the car?

**Solution:**
- **Step 1: Deflection angle**
  $$\tan\theta = \frac{A}{g} = \frac{2.45\,\text{m/s}^2}{9.81\,\text{m/s}^2} = 0.24975$$
  $$\theta = \arctan(0.24975) = 14.02^\circ$$

- **Step 2: Effective gravity magnitude**
  $$\|\vec{g}_{\text{eff}}\| = \sqrt{g^2 + A^2} = \sqrt{9.81^2 + 2.45^2} = \sqrt{96.2361 + 6.0025} = \sqrt{102.2386} = 10.111\,\text{m/s}^2$$

- **Step 3: Strap tension**
  $$T = m \|\vec{g}_{\text{eff}}\| = (65.0\,\text{kg})(10.111\,\text{m/s}^2) = 657.2\,\text{N}$$
  *Static comparison:* At rest, $T_0 = mg = (65.0)(9.81) = 637.65\,\text{N}$. Tension increases by $19.55\,\text{N}$ ($+3.07\%$).

---

### Example 10.2: Liquid Surface Tilt in an Accelerating Fuel Truck
**Problem:** A fuel tanker has a rectangular cargo tank of length $L = 8.00\,\text{m}$ and height $H = 2.50\,\text{m}$. The tank is initially filled with diesel oil ($\rho = 840\,\text{kg/m}^3$) to a depth of $h_0 = 1.80\,\text{m}$. The truck accelerates forward with $A = 3.20\,\text{m/s}^2$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the tilt angle $\alpha$ of the oil surface.
2. Determine the oil depth at the rear wall ($h_{\text{rear}}$) and front wall ($h_{\text{front}}$).
3. Verify whether oil spills over the top rear edge.

**Solution:**
- **Step 1: Surface tilt angle**
  $$\tan\alpha = \frac{A}{g} = \frac{3.20\,\text{m/s}^2}{9.81\,\text{m/s}^2} = 0.32620 \implies \alpha = 18.07^\circ$$

- **Step 2: Depths at front and rear walls**
  The liquid pivots symmetrically about the center of the tank ($x = L/2 = 4.00\,\text{m}$):
  $$\Delta h = \left(\frac{L}{2}\right)\tan\alpha = (4.00\,\text{m})(0.32620) = 1.3048\,\text{m}$$
  - Depth at rear:
    $$h_{\text{rear}} = h_0 + \Delta h = 1.80\,\text{m} + 1.3048\,\text{m} = 3.105\,\text{m}$$
  - Depth at front:
    $$h_{\text{front}} = h_0 - \Delta h = 1.80\,\text{m} - 1.3048\,\text{m} = 0.495\,\text{m}$$

- **Step 3: Spillover check**
  Since $h_{\text{rear}} = 3.105\,\text{m} > H = 2.50\,\text{m}$, the liquid strikes the ceiling and will spill violently if the hatch is unsealed!
  The maximum safe acceleration to prevent spilling without hitting the ceiling is:
  $$\Delta h_{\max} = H - h_0 = 2.50 - 1.80 = 0.700\,\text{m}$$
  $$\tan\alpha_{\max} = \frac{\Delta h_{\max}}{L/2} = \frac{0.700}{4.00} = 0.1750$$
  $$A_{\max} = g \tan\alpha_{\max} = (9.81)(0.1750) = 1.717\,\text{m/s}^2$$

---

### Example 10.3: Helium Balloon Forward Tilt
**Problem:** A child holds a helium balloon inside an automobile accelerating at $A = 2.80\,\text{m/s}^2$. The balloon volume is $V = 0.0140\,\text{m}^3$. Air density is $\rho_{\text{air}} = 1.225\,\text{kg/m}^3$, helium density is $\rho_{\text{He}} = 0.179\,\text{kg/m}^3$, and the balloon skin has mass $m_{\text{skin}} = 2.50\,\text{g} = 0.00250\,\text{kg}$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the total mass of the balloon assembly.
2. Determine the forward tilt angle $\phi$ of the tether string.
3. Compute the tension $T$ in the string.

**Solution:**
- **Step 1: Total mass**
  $$m_{\text{gas}} = \rho_{\text{He}} V = (0.179\,\text{kg/m}^3)(0.0140\,\text{m}^3) = 0.002506\,\text{kg}$$
  $$m_{\text{total}} = m_{\text{gas}} + m_{\text{skin}} = 0.002506 + 0.002500 = 0.005006\,\text{kg}$$
  Displaced air mass:
  $$m_{\text{air}} = \rho_{\text{air}} V = (1.225\,\text{kg/m}^3)(0.0140\,\text{m}^3) = 0.01715\,\text{kg}$$

- **Step 2: Effective forces in the car's frame**
  In the car frame:
  $$\vec{g}_{\text{eff}} = -A\,\hat{i} - g\,\hat{j} = -2.80\,\hat{i} - 9.81\,\hat{j}\,\text{m/s}^2$$
  Effective gravity on balloon mass:
  $$\vec{F}_{\text{eff, grav}} = m_{\text{total}} \vec{g}_{\text{eff}} = (0.005006)(-2.80\,\hat{i} - 9.81\,\hat{j}) = -0.01402\,\hat{i} - 0.04911\,\hat{j}\,\text{N}$$
  Buoyant force:
  $$\vec{F}_{\text{buoy}} = -m_{\text{air}} \vec{g}_{\text{eff}} = -(0.01715)(-2.80\,\hat{i} - 9.81\,\hat{j}) = +0.04802\,\hat{i} + 0.16824\,\hat{j}\,\text{N}$$
  Net force on balloon before string tension:
  $$\vec{F}_{\text{net}} = \vec{F}_{\text{buoy}} + \vec{F}_{\text{eff, grav}} = (+0.04802 - 0.01402)\,\hat{i} + (+0.16824 - 0.04911)\,\hat{j}$$
  $$\vec{F}_{\text{net}} = +0.03400\,\hat{i} + 0.11913\,\hat{j}\,\text{N}$$
  Notice that $F_x > 0$! The net force pulls **forward**!

- **Step 3: String angle and tension**
  $$\tan\phi = \frac{F_x}{F_y} = \frac{0.03400}{0.11913} = 0.28540 \implies \phi = 15.93^\circ \quad (\text{forward of vertical!})$$
  $$T = \|\vec{F}_{\text{net}}\| = \sqrt{0.03400^2 + 0.11913^2} = \sqrt{0.001156 + 0.014192} = \sqrt{0.015348} = 0.1239\,\text{N}$$

---

### Example 10.4: Artificial Gravity Space Habitat Ring
**Problem:** A Stanford Torus space station rotates about its central axis to create an artificial gravity environment of $g = 9.81\,\text{m/s}^2$ at the outer rim. The outer ring radius is $R = 250.0\,\text{m}$.
1. Calculate the required angular velocity $\omega$ in radians per second and revolutions per minute (RPM).
2. What is the tangential speed $v$ of the habitat rim?
3. If an astronaut of height $h = 1.90\,\text{m}$ stands on the floor, calculate the percentage gravity gradient between their feet and their head.

**Solution:**
- **Step 1: Angular velocity**
  $$a_{\text{rim}} = \omega^2 R = g \implies \omega = \sqrt{\frac{g}{R}} = \sqrt{\frac{9.81\,\text{m/s}^2}{250.0\,\text{m}}} = \sqrt{0.03924} = 0.19809\,\text{rad/s}$$
  $$\text{RPM} = \frac{0.19809 \times 60}{2\pi} = \frac{11.8855}{6.283185} = 1.892\,\text{RPM}$$
  *Notice:* $1.89\,\text{RPM} < 2.0\,\text{RPM}$, ensuring zero Coriolis nausea!

- **Step 2: Tangential speed**
  $$v = \omega R = (0.19809\,\text{rad/s})(250.0\,\text{m}) = 49.52\,\text{m/s} = 178.3\,\text{km/h}$$

- **Step 3: Head-to-toe gradient**
  - Radius at feet: $R_{\text{feet}} = 250.0\,\text{m} \implies g_{\text{feet}} = 9.810\,\text{m/s}^2$.
  - Radius at head: $R_{\text{head}} = 250.0 - 1.90 = 248.10\,\text{m}$.
  - Acceleration at head:
    $$g_{\text{head}} = \omega^2 R_{\text{head}} = (0.19809)^2 (248.10) = (0.03924)(248.10) = 9.7354\,\text{m/s}^2$$
  - Percentage drop:
    $$\Delta = \frac{9.810 - 9.7354}{9.810} \times 100\% = \frac{0.0746}{9.810} \times 100\% = 0.760\%$$
  The gradient is less than $1\%$, completely imperceptible to human physiology.

---

### Example 10.5: Coriolis Deflection on a Rotating Carousel
**Problem:** A playground carousel of radius $R = 3.00\,\text{m}$ rotates counterclockwise with constant angular speed $\omega = 1.50\,\text{rad/s}$. A child of mass $m = 40.0\,\text{kg}$ walks radially outward from the center ($r = 0$) toward the rim at a constant relative speed $v' = 1.20\,\text{m/s}$.
1. When the child reaches radius $r = 2.00\,\text{m}$, calculate the centrifugal force $\vec{F}_{\text{centrifugal}}$.
2. Calculate the Coriolis force $\vec{F}_{\text{Coriolis}}$ acting on the child.
3. Determine the minimum coefficient of static friction $\mu_s$ required between the child's shoes and the deck to prevent slipping at $r = 2.00\,\text{m}$ ($g = 9.81\,\text{m/s}^2$).

**Solution:**
- **Step 1: Centrifugal force**
  $$\vec{F}_{\text{centrifugal}} = m \omega^2 r\,\hat{u}_r$$
  $$F_{\text{cf}} = (40.0\,\text{kg})(1.50\,\text{rad/s})^2 (2.00\,\text{m}) = (40.0)(2.25)(2.00) = 180.0\,\text{N} \quad (\text{radially outward})$$

- **Step 2: Coriolis force**
  $\vec{\omega} = 1.50\,\hat{k}$, $\vec{v}' = 1.20\,\hat{u}_r$.
  $$\vec{F}_{\text{Coriolis}} = -2m (\vec{\omega} \times \vec{v}')$$
  $\hat{k} \times \hat{u}_r = +\hat{u}_\theta$ (tangential counterclockwise).
  $$\vec{F}_{\text{Coriolis}} = -2(40.0\,\text{kg})(1.50\,\text{rad/s})(1.20\,\text{m/s})\,\hat{u}_\theta = -144.0\,\hat{u}_\theta\,\text{N}$$
  The Coriolis force acts **tangentially to the right** (clockwise), with magnitude $144.0\,\text{N}$.

- **Step 3: Total horizontal force and friction requirement**
  Because the centrifugal force (radial) and Coriolis force (tangential) are mutually orthogonal:
  $$F_{\text{total, horiz}} = \sqrt{F_{\text{cf}}^2 + F_{\text{cor}}^2} = \sqrt{180.0^2 + 144.0^2} = \sqrt{32,400 + 20,736} = \sqrt{53,136} = 230.51\,\text{N}$$
  Normal force:
  $$N = mg = (40.0\,\text{kg})(9.81\,\text{m/s}^2) = 392.4\,\text{N}$$
  Condition to prevent slipping:
  $$f_s = F_{\text{total, horiz}} \le \mu_s N \implies \mu_s \ge \frac{F_{\text{total, horiz}}}{N} = \frac{230.51\,\text{N}}{392.4\,\text{N}} = 0.5874$$
  The deck must have a static friction coefficient of at least $\mu_s = 0.587$.

---

### Example 10.6: Deflection of a Dropped Particle by Earth's Rotation
**Problem:** A heavy lead pellet is dropped from rest from the top of the Eiffel Tower (height $h = 300.0\,\text{m}$) in Paris (latitude $\lambda = 48.85^\circ\,\text{N}$). Earth's angular velocity is $\omega_E = 7.292 \times 10^{-5}\,\text{rad/s}$, and $g = 9.81\,\text{m/s}^2$. Neglecting air resistance:
1. Determine the direction of the Coriolis deflection.
2. Derive the analytical formula for the eastward deflection $d_{\text{east}}$.
3. Compute the numerical deflection upon reaching ground level.

**Solution:**
- **Step 1: Direction of deflection**
  Let the local coordinate system be:
  - $+\hat{i}$: East
  - $+\hat{j}$: North
  - $+\hat{k}$: Zenith (Upward)
  Earth's angular velocity vector at latitude $\lambda$:
  $$\vec{\omega}_E = \omega_E(\cos\lambda\,\hat{j} + \sin\lambda\,\hat{k})$$
  As the pellet falls, its vertical velocity is downward:
  $$\vec{v}' = -v_z(t)\,\hat{k} = -gt\,\hat{k}$$
  Compute the Coriolis acceleration:
  $$\vec{a}_{\text{cor}} = -2(\vec{\omega}_E \times \vec{v}') = -2 \left[ \omega_E(\cos\lambda\,\hat{j} + \sin\lambda\,\hat{k}) \times (-gt\,\hat{k}) \right]$$
  Since $\hat{j} \times \hat{k} = \hat{i}$ and $\hat{k} \times \hat{k} = \vec{0}$:
  $$\vec{a}_{\text{cor}} = -2 \omega_E \cos\lambda (-gt) \hat{i} = +2 \omega_E g t \cos\lambda\,\hat{i}$$
  Because the acceleration is along $+\hat{i}$, **the pellet is deflected strictly Eastward**!

- **Step 2: Integration for Eastward deflection**
  $$\frac{d^2 x}{dt^2} = 2 \omega_E g \cos\lambda \cdot t$$
  $$\frac{dx}{dt} = \omega_E g \cos\lambda \cdot t^2$$
  $$x(t) = \frac{1}{3} \omega_E g \cos\lambda \cdot t^3$$
  The total fall time is $t_{\text{fall}} = \sqrt{\frac{2h}{g}}$.
  $$d_{\text{east}} = \frac{1}{3} \omega_E g \cos\lambda \left(\frac{2h}{g}\right)^{3/2} = \frac{1}{3} \omega_E \cos\lambda \sqrt{\frac{8h^3}{g}} = \frac{2}{3} \omega_E h \cos\lambda \sqrt{\frac{2h}{g}}$$

- **Step 3: Numerical calculation**
  $$\cos(48.85^\circ) = 0.65803$$
  $$t_{\text{fall}} = \sqrt{\frac{2(300.0\,\text{m})}{9.81\,\text{m/s}^2}} = \sqrt{61.162} = 7.8206\,\text{s}$$
  $$t_{\text{fall}}^3 = (7.8206)^3 = 478.33\,\text{s}^3$$
  $$d_{\text{east}} = \frac{1}{3}(7.292 \times 10^{-5})(9.81)(0.65803)(478.33)$$
  $$d_{\text{east}} = \frac{1}{3}(0.00071535)(0.65803)(478.33) = \frac{1}{3}(0.22516) = 0.07505\,\text{m} = 7.51\,\text{cm}$$
  The pellet strikes the ground deflected $7.51\,\text{cm}$ to the East.

---

### Example 10.7: Rotating Fluid Paraboloid
**Problem:** A cylindrical bucket of water ($\rho = 1000\,\text{kg/m}^3$) of radius $R = 0.200\,\text{m}$ is placed on a turntable rotating at constant angular speed $\omega = 12.0\,\text{rad/s}$ about its central axis. Take $g = 9.81\,\text{m/s}^2$.
1. Derive the shape equation $z(r)$ of the free liquid surface.
2. Calculate the height difference $\Delta z = z(R) - z(0)$ between the rim and the center.
3. Compute the effective gravity magnitude and tilt at the outer rim $r = R$.

**Solution:**
- **Step 1: Derivation of surface profile**
  In the rotating frame, the effective force on a surface element $dm$ is:
  $$d\vec{F}_{\text{eff}} = dm(\omega^2 r\,\hat{r} - g\,\hat{z})$$
  The tangent to the free surface $dz/dr$ must be perpendicular to $d\vec{F}_{\text{eff}}$:
  $$\frac{dz}{dr} = \frac{F_{\text{cf}}}{F_g} = \frac{\omega^2 r}{g}$$
  Integrating with respect to $r$:
  $$z(r) = z(0) + \int_0^r \frac{\omega^2 r'}{g} \, dr' = z(0) + \frac{\omega^2 r^2}{2g}$$
  The free surface forms a perfect **paraboloid of revolution**!

- **Step 2: Height difference $\Delta z$**
  $$\Delta z = \frac{\omega^2 R^2}{2g} = \frac{(12.0\,\text{rad/s})^2 (0.200\,\text{m})^2}{2(9.81\,\text{m/s}^2)} = \frac{(144.0)(0.0400)}{19.62} = \frac{5.76}{19.62} = 0.2936\,\text{m} = 29.36\,\text{cm}$$

- **Step 3: Effective gravity at rim**
  $$a_{\text{cf}}(R) = \omega^2 R = (144.0)(0.200) = 28.80\,\text{m/s}^2$$
  $$\|\vec{g}_{\text{eff}}\| = \sqrt{g^2 + a_{\text{cf}}^2} = \sqrt{9.81^2 + 28.80^2} = \sqrt{96.24 + 829.44} = \sqrt{925.68} = 30.42\,\text{m/s}^2$$
  $$\tan\theta = \frac{28.80}{9.81} = 2.9358 \implies \theta = 71.19^\circ \text{ from the vertical}$$

---

### Example 10.8: Euler Force in a Spinning Flywheel
**Problem:** A robotic arm of length $R = 1.50\,\text{m}$ holding a gripper of mass $m = 3.00\,\text{kg}$ starts from rest and undergoes uniform angular acceleration $\alpha = \dot{\omega} = 8.00\,\text{rad/s}^2$ about its base.
1. At $t = 0.500\,\text{s}$, compute the angular velocity $\omega$.
2. Calculate the instantaneous Centrifugal force on the gripper.
3. Calculate the instantaneous Euler force on the gripper.
4. Compute the magnitude of the total fictitious force experienced by the gripper.

**Solution:**
- **Step 1: Angular velocity at $t = 0.500\,\text{s}$**
  $$\omega(t) = \alpha t = (8.00\,\text{rad/s}^2)(0.500\,\text{s}) = 4.00\,\text{rad/s}$$

- **Step 2: Centrifugal force**
  $$F_{\text{cf}} = m \omega^2 R = (3.00\,\text{kg})(4.00\,\text{rad/s})^2 (1.50\,\text{m}) = (3.00)(16.0)(1.50) = 72.0\,\text{N} \quad (\text{radially outward})$$

- **Step 3: Euler force**
  $$\vec{F}_{\text{Euler}} = -m(\vec{\alpha} \times \vec{r})$$
  Since $\vec{\alpha} = +8.00\,\hat{k}$ and $\vec{r} = 1.50\,\hat{r}$:
  $$\vec{\alpha} \times \vec{r} = (8.00 \times 1.50)\,\hat{\theta} = +12.0\,\hat{\theta}\,\text{m/s}^2$$
  $$\vec{F}_{\text{Euler}} = -(3.00\,\text{kg})(12.0\,\hat{\theta}) = -36.0\,\hat{\theta}\,\text{N} \quad (\text{tangential, opposing rotation})$$

- **Step 4: Total fictitious force magnitude**
  Since radial and tangential components are perpendicular:
  $$F_{\text{fict, total}} = \sqrt{F_{\text{cf}}^2 + F_{\text{Euler}}^2} = \sqrt{72.0^2 + 36.0^2} = \sqrt{5184 + 1296} = \sqrt{6480} = 80.50\,\text{N}$$

---

### Example 10.9: Running on an Artificial Gravity Ring
**Problem:** In the space station of Example 10.4 ($R = 250.0\,\text{m}$, $\omega = 0.1981\,\text{rad/s}$, $g = 9.81\,\text{m/s}^2$), an astronaut of mass $m = 80.0\,\text{kg}$ jogs along the circular track at relative speed $v' = 5.00\,\text{m/s}$.
1. Find their apparent weight (normal force $N_{\text{pro}}$) if they jog in the **prograde direction** (direction of station rotation).
2. Find their apparent weight (normal force $N_{\text{retro}}$) if they jog in the **retrograde direction** (against station rotation).

**Solution:**
- **Step 1: Prograde jogging**
  Jogging prograde adds to the frame rotation: $\vec{v}' = +v'\,\hat{\theta}$.
  - Centrifugal force: $F_{\text{cf}} = m\omega^2 R = (80.0)(9.81) = 784.8\,\text{N}$ (outward/downward toward floor).
  - Coriolis force:
    $$\vec{F}_{\text{cor}} = -2m(\vec{\omega} \times \vec{v}') = -2m(\omega\,\hat{k} \times v'\,\hat{\theta}) = -2m\omega v'(-\hat{r}) = +2m\omega v'\,\hat{r}$$
    The Coriolis force pushes **radially outward (toward the floor)**, increasing apparent weight!
    $$F_{\text{cor}} = 2(80.0\,\text{kg})(0.1981\,\text{rad/s})(5.00\,\text{m/s}) = 158.48\,\text{N}$$
  Normal force:
  $$N_{\text{pro}} = F_{\text{cf}} + F_{\text{cor}} = 784.8 + 158.48 = 943.28\,\text{N}$$
  *Apparent gravity:* $g_{\text{app}} = 943.28 / 80.0 = 11.79\,\text{m/s}^2$ ($+20.2\%$ heavier!).

- **Step 2: Retrograde jogging**
  Now $\vec{v}' = -v'\,\hat{\theta}$.
  The Coriolis force reverses sign and points **radially inward (away from the floor)**:
  $$N_{\text{retro}} = F_{\text{cf}} - F_{\text{cor}} = 784.8 - 158.48 = 626.32\,\text{N}$$
  *Apparent gravity:* $g_{\text{app}} = 626.32 / 80.0 = 7.83\,\text{m/s}^2$ ($-20.2\%$ lighter!).

---

### Example 10.10: Foucault Pendulum Precession Rate
**Problem:** A Foucault pendulum is installed at the Panthéon in Paris (latitude $\lambda = 48.85^\circ\,\text{N}$). Earth's sidereal rotation period is $T_E = 23.934\,\text{hours} = 86,164\,\text{s}$ ($\omega_E = 7.292 \times 10^{-5}\,\text{rad/s}$).
1. Calculate the vertical component of Earth's angular velocity vector $\omega_z$.
2. Compute the angular precession rate $\Omega_{\text{prec}}$ of the pendulum's plane of oscillation in degrees per hour.
3. Calculate the time $T_{\text{prec}}$ required for the pendulum plane to complete one full $360^\circ$ rotation.

**Solution:**
- **Step 1: Vertical component of rotation**
  The horizontal components of the Coriolis force drive the precession. The effective vertical rotation rate is:
  $$\Omega_{\text{prec}} = \omega_E \sin\lambda$$
  $$\sin(48.85^\circ) = 0.75299$$
  $$\Omega_{\text{prec}} = (7.292 \times 10^{-5}\,\text{rad/s})(0.75299) = 5.4908 \times 10^{-5}\,\text{rad/s}$$

- **Step 2: Precession rate in degrees per hour**
  $$\Omega_{\text{deg/hr}} = \Omega_{\text{prec}} \times \left(\frac{180}{\pi}\right) \times 3600$$
  $$\Omega_{\text{deg/hr}} = (5.4908 \times 10^{-5}) \times 57.29578 \times 3600 = 11.326^\circ/\text{hour}$$
  The plane of oscillation precesses clockwise at $11.33^\circ$ per hour.

- **Step 3: Full rotation period**
  $$T_{\text{prec}} = \frac{360^\circ}{\Omega_{\text{deg/hr}}} = \frac{360^\circ}{11.326^\circ/\text{hour}} = 31.785\,\text{hours} \approx 31\,\text{hours } 47\,\text{minutes}$$
  *Check against formula:* $T = \frac{23.934\,\text{hr}}{\sin(48.85^\circ)} = \frac{23.934}{0.75299} = 31.785\,\text{hours}$. Exact match.

---

## 10.8 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 10.9.

### Tier 1: Linear Acceleration & Plumb Bobs
- **Exercise 10.1:** A car accelerates at $A = 3.50\,\text{m/s}^2$. What is the tilt angle $\theta$ of a rear-view mirror fuzzy dice pendant? What is the apparent weight factor $g_{\text{eff}}/g$?
- **Exercise 10.2:** An elevator accelerates downward at $A = 3.00\,\text{m/s}^2$. What is the apparent weight registered by a bathroom scale for an $80.0\,\text{kg}$ person?

### Tier 2: Accelerating Fluids & Wedges
- **Exercise 10.3:** A cylindrical container of oil accelerates horizontally at $A = 4.905\,\text{m/s}^2$ ($A = g/2$). Find the angle the oil surface makes with the floor.
- **Exercise 10.4:** A block of mass $m = 2.00\,\text{kg}$ sits on a $30.0^\circ$ incline inside an elevator accelerating upward at $A = 4.00\,\text{m/s}^2$. If the incline is frictionless, find the block's acceleration relative to the incline.

### Tier 3: Centrifugal Fields & Rotating Frames
- **Exercise 10.5:** A centrifuge arm of length $R = 0.800\,\text{m}$ spins at $1200\,\text{RPM}$. Compute the centrifugal acceleration in units of $g$ ($g = 9.81\,\text{m/s}^2$).
- **Exercise 10.6:** A bead slides on a frictionless horizontal rod rotating at constant angular speed $\omega = 5.00\,\text{rad/s}$ about a vertical axis at one end. Write the equation of motion for $r(t)$ and solve for $r(t)$ given $r(0) = 0.100\,\text{m}$ and $\dot{r}(0) = 0$.

### Tier 4: Coriolis Deflection Dynamics
- **Exercise 10.7:** A bullet of mass $m = 0.010\,\text{kg}$ is fired horizontally North at $v' = 850\,\text{m/s}$ at latitude $45.0^\circ\,\text{N}$. Calculate the magnitude and direction of the Coriolis force.
- **Exercise 10.8:** In a space habitat ring with $R = 200.0\,\text{m}$ and $g_{\text{eff}} = 9.81\,\text{m/s}^2$, an astronaut drops a wrench from a height $h = 1.50\,\text{m}$. Find the Coriolis deflection of the wrench relative to the vertical line from which it was released.

### Tier 5: Multi-Fictitious Coupled Systems
- **Exercise 10.9:** A marble rolls inside a smooth bowl shaped like a paraboloid $z = c r^2$ rotating at constant angular speed $\omega$. Find the critical rotation speed $\omega_{\text{crit}}$ at which the marble can remain in stable equilibrium at any radius $r$.
- **Exercise 10.10:** Compute the precession rate of a Foucault pendulum situated at the geographic South Pole ($\lambda = -90.0^\circ$) and at the Equator ($\lambda = 0^\circ$).

---

## 10.9 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 10.1
- **Given:** $A = 3.50\,\text{m/s}^2$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Tilt angle**
  $$\tan\theta = \frac{A}{g} = \frac{3.50}{9.81} = 0.35678 \implies \theta = \arctan(0.35678) = 19.63^\circ$$
- **Step 2: Apparent weight factor**
  $$g_{\text{eff}} = \sqrt{g^2 + A^2} = \sqrt{9.81^2 + 3.50^2} = \sqrt{96.236 + 12.250} = \sqrt{108.486} = 10.416\,\text{m/s}^2$$
  $$\frac{g_{\text{eff}}}{g} = \frac{10.416}{9.81} = 1.0617 \implies +6.17\%$$

---

### Solution 10.2
- **Given:** $m = 80.0\,\text{kg}$, downward acceleration $A = 3.00\,\text{m/s}^2$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Effective gravity**
  $$g_{\text{eff}} = g - A = 9.81 - 3.00 = 6.81\,\text{m/s}^2$$
- **Step 2: Scale reading (Normal force)**
  $$N = m g_{\text{eff}} = (80.0\,\text{kg})(6.81\,\text{m/s}^2) = 544.8\,\text{N}$$
  *Effective mass reading on scale:* $m_{\text{scale}} = 544.8 / 9.81 = 55.54\,\text{kg}$.

---

### Solution 10.3
- **Given:** $A = 4.905\,\text{m/s}^2 = g/2$.
- **Step 1: Fluid surface tilt**
  $$\tan\alpha = \frac{A}{g} = \frac{4.905}{9.81} = 0.5000$$
  $$\alpha = \arctan(0.5000) = 26.57^\circ$$

---

### Solution 10.4
- **Given:** $m = 2.00\,\text{kg}$, $\theta = 30.0^\circ$, upward elevator acceleration $A = 4.00\,\text{m/s}^2$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Effective gravity in elevator**
  $$g_{\text{eff}} = g + A = 9.81 + 4.00 = 13.81\,\text{m/s}^2$$
- **Step 2: Acceleration down the incline**
  $$a' = g_{\text{eff}} \sin\theta = (13.81\,\text{m/s}^2)\sin(30.0^\circ) = (13.81)(0.500) = 6.905\,\text{m/s}^2$$

---

### Solution 10.5
- **Given:** $R = 0.800\,\text{m}$, $\omega = 1200\,\text{RPM} = 1200 \times \frac{2\pi}{60} = 40\pi \approx 125.66\,\text{rad/s}$.
- **Step 1: Centrifugal acceleration**
  $$a_{\text{cf}} = \omega^2 R = (125.66\,\text{rad/s})^2 (0.800\,\text{m}) = (15,791.37)(0.800) = 12,633.1\,\text{m/s}^2$$
- **Step 2: Convert to g's**
  $$\text{g's} = \frac{12,633.1\,\text{m/s}^2}{9.81\,\text{m/s}^2} = 1287.8\,g$$

---

### Solution 10.6
- **Given:** Frictionless rod, $\omega = 5.00\,\text{rad/s}$, $r(0) = 0.100\,\text{m}$, $\dot{r}(0) = 0$.
- **Step 1: Equation of motion**
  The only horizontal force along the rod is the centrifugal force (the normal force from the rod is perpendicular and provides the Coriolis force):
  $$m \ddot{r} = m \omega^2 r \implies \ddot{r} - \omega^2 r = 0$$
- **Step 2: General solution**
  $$r(t) = C_1 \cosh(\omega t) + C_2 \sinh(\omega t)$$
  From $\dot{r}(0) = 0 \implies C_2 = 0$.
  From $r(0) = 0.100 \implies C_1 = 0.100$.
  $$r(t) = 0.100 \cosh(5.00 t)\,\text{m}$$

---

### Solution 10.7
- **Given:** $m = 0.010\,\text{kg}$, $v' = 850\,\text{m/s}$ North, latitude $\lambda = 45.0^\circ\,\text{N}$, $\omega_E = 7.292 \times 10^{-5}\,\text{rad/s}$.
- **Step 1: Direction**
  In the Northern hemisphere, horizontal motion North is deflected to the **Right (East)**.
- **Step 2: Magnitude of Coriolis force**
  $$F_{\text{cor}} = 2 m \omega_E v' \sin\lambda = 2(0.010\,\text{kg})(7.292 \times 10^{-5}\,\text{rad/s})(850\,\text{m/s})\sin(45.0^\circ)$$
  $$\sin(45.0^\circ) = 0.70711$$
  $$F_{\text{cor}} = 2(0.010)(7.292 \times 10^{-5})(850)(0.70711) = 0.000876\,\text{N} = 8.76 \times 10^{-4}\,\text{N}$$

---

### Solution 10.8
- **Given:** Habitat ring $R = 200.0\,\text{m}$, $g = 9.81\,\text{m/s}^2$, $h = 1.50\,\text{m}$.
- **Step 1: Station rotation rate**
  $$\omega = \sqrt{\frac{g}{R}} = \sqrt{\frac{9.81}{200.0}} = \sqrt{0.04905} = 0.22147\,\text{rad/s}$$
- **Step 2: Fall time**
  $$t_{\text{fall}} = \sqrt{\frac{2h}{g}} = \sqrt{\frac{2(1.50)}{9.81}} = \sqrt{0.30581} = 0.5530\,\text{s}$$
- **Step 3: Deflection**
  During fall, downward relative velocity is $v_y'(t) = gt$.
  The Coriolis acceleration is $a_{\text{cor}} = 2\omega v_y' = 2\omega g t$ (directed opposite to rotation, i.e., retrograde).
  Integrating:
  $$d_{\text{cor}} = \frac{1}{3} \omega g t_{\text{fall}}^3 = \frac{1}{3}(0.22147)(9.81)(0.5530)^3 = \frac{1}{3}(2.1726)(0.1691) = 0.1225\,\text{m} = 12.25\,\text{cm}$$
  The wrench lands $12.25\,\text{cm}$ behind the drop point!

---

### Solution 10.9
- **Given:** Paraboloid $z = c r^2$, rotating at speed $\omega$.
- **Step 1: Balance of forces**
  Tangent slope: $\frac{dz}{dr} = 2 c r$.
  At equilibrium, the slope must balance the ratio of centrifugal to gravitational force:
  $$\frac{dz}{dr} = \frac{F_{\text{cf}}}{F_g} = \frac{m \omega^2 r}{m g} = \frac{\omega^2 r}{g}$$
  Equating:
  $$2 c r = \frac{\omega^2 r}{g}$$
- **Step 2: Solve for critical speed**
  Dividing by $r$:
  $$2 c = \frac{\omega_{\text{crit}}^2}{g} \implies \omega_{\text{crit}} = \sqrt{2 g c}$$
  At this precise angular velocity, the effective force is everywhere perpendicular to the bowl surface, allowing neutral equilibrium at any radius $r$!

---

### Solution 10.10
- **Given:** $\omega_E = 7.292 \times 10^{-5}\,\text{rad/s} \approx 15.04^\circ/\text{hour}$.
- **Step 1: South Pole ($\lambda = -90.0^\circ$)**
  $$\Omega = \omega_E \sin(-90.0^\circ) = -\omega_E = -15.04^\circ/\text{hour}$$
  The pendulum precesses **counterclockwise** at $15.04^\circ$ per hour, completing one full rotation in exactly 24 sidereal hours ($23.93\,\text{hours}$).
- **Step 2: Equator ($\lambda = 0^\circ$)**
  $$\Omega = \omega_E \sin(0^\circ) = 0^\circ/\text{hour}$$
  At the Equator, the plane of oscillation **does not precess at all**!
