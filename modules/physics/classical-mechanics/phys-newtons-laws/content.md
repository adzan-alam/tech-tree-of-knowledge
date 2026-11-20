# Newton's Laws of Motion & Classical Dynamics

---

## 🧭 Prologue: The World in Motion and the Friction Illusion

Imagine you are standing on a football pitch on a sunny afternoon. You kick a soccer ball across the grass. It rolls forward, slows down, and comes to a complete halt after thirty meters.

Now, take that same ball and kick it with the exact same strength across a smooth wooden basketball court. It travels eighty meters before stopping.

Now, take that same ball onto a mirror-smooth sheet of frozen lake ice. You give it the exact same kick. It glides effortlessly for two hundred meters.

Now ask yourself a fundamental question:

**What would happen if you kicked that ball in the empty vacuum of deep space, far away from all planets and stars?**

For nearly two thousand years, the greatest scholars of Western civilization, following the ancient Greek philosopher **Aristotle** (384–322 BCE), taught that:

> *"Every moving body naturally strives toward a state of rest. To keep an object moving, an active, continuous force must be applied to it at every instant. The moment the push ceases, the motion dies."*

Aristotle called this the **impetus theory**. To human common sense, it seems self-evident: if you stop pedaling your bicycle, it stops; if a horse stops pulling a wagon, the wagon stops.

Yet Aristotle was completely, profoundly deceived.

In 1687, **Sir Isaac Newton** published the *Philosophiae Naturalis Principia Mathematica*, delivering the greatest conceptual revolution in scientific history. Newton recognized that Aristotle had fallen victim to an optical and sensory illusion caused by an invisible saboteur: **Friction**.

The ball does not stop rolling because motion naturally dies. The ball stops rolling because the grass, the floor, and the air molecules are actively, relentlessly pushing *against* it. As you smooth the grass into wood, and the wood into ice, the opposing force weakens.

In the vacuum of deep space, where friction and air resistance are strictly zero:
**The ball will never stop. It will sail through the cosmos in a straight line at constant speed for billions of years until an external physical object interferes with it.**

Rest is not the natural state of matter. **Constant straight-line motion and absolute rest are physically identical states.**

Newton's three laws of motion provided the first universal mathematical framework in human history, proving that the exact same dynamical laws governing an apple falling from an orchard tree also govern the Moon orbiting the Earth and planets circling the Sun.

---

## 🗺️ Master Curriculum Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  LEVEL 8: PHILOSOPHICAL HORIZONS & ACTION-AT-A-DISTANCE                      │
│  How gravity pulls across vacuum, the field concept, and Einstein's synthesis│
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 7: MULTI-TIERED MASTERY PRACTICE SET                                  │
│  5 progressive tiers from Class 6 sliding puck to coupled Atwood & elevators │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 6: COMPLETE PRODUCTION COMPUTATIONAL ENGINE                           │
│  TypeScript NewtonianBody & DynamicsWorld, force accumulator & inverse mass  │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 5: COUPLED SYSTEMS & INCLINED PLANE DYNAMICS                          │
│  Ramp with friction, Atwood machine derivation, elevator apparent weight     │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 4: THE FORCE CATALOG & THE RIGOROUS FBD PROTOCOL                      │
│  Gravity (mg), Normal force, Coulomb friction (μ_s > μ_k), Tension & Springs │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 3: THE THIRD LAW & THE HORSE-AND-CART PARADOX                         │
│  Action-reaction pairs, why they never cancel on a single body, vacuum thrust│
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 2: THE SECOND LAW — MOMENTUM & RATE OF CHANGE                         │
│  F_net = dp/dt = m*a + v*(dm/dt); constant mass vs variable mass rockets     │
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 1: INERTIAL FRAMES & THE FIRST LAW (INERTIA UNVEILED)                 │
│  Mass as scalar inertia, coffee cup on an accelerating bus, fictitious forces│
├──────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 0: THE FRICTION ILLUSION & ARISTOTLE'S 2000-YEAR MISTAKE              │
│  The sliding hockey puck, the deep space vacuum, Class 6 intuitive base      │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# Level 0: The Friction Illusion & Aristotle's 2,000-Year Mistake

### 0.1 The Difference Between Kinematics and Dynamics
In the previous module on kinematics, we studied the **geometry of motion**: position ($x$), velocity ($v$), and acceleration ($a$). Kinematics answers the question: *How is the object moving?*

**Dynamics** takes the decisive step forward. Dynamics answers the causal question: **Why** is the object accelerating? What interactions in the physical universe cause motion to speed up, slow down, or curve?

---

### 0.2 The Thought Experiment: The Infinite Air-Hockey Table
Imagine an air-hockey table in an arcade. When the fan is turned off, the plastic puck slides only a few inches before friction drags it to a halt.

Now, flip the electric switch. Jets of pressurized air blast through thousands of tiny pinholes in the table surface. The puck floats on a microscopic cushion of air.

Give the puck the gentlest tap with your fingernail. What happens?
- The puck glides across the table with **zero noticeable loss of speed**.
- It does not slow down.
- It moves in an **arrow-straight line**.
- It continues indefinitely until it strikes the boundary cushion.

If the table were a mile long, the puck would glide for a mile. If the table stretched across the solar system in a vacuum, the puck would glide forever without consuming a single drop of fuel.

> **Key Rule (Newton's Core Axiom):** Objects do not need a force to keep moving. **Objects only need a force to CHANGE how they are moving.**

---

# Level 1: Inertial Reference Frames & The First Law

### 1.1 Newton's First Law (The Law of Inertia)
Newton formulated his First Law in Latin:
> *"Corpus omne perseverare in statu suo quiescendi vel movendi uniformiter in directum, nisi quatenus a viribus impressis cogitur statum illum mutare."*  
> ("Every body perseveres in its state of rest, or of uniform motion in a right line, unless it is compelled to change that state by forces impress'd thereon.")

In modern vector mathematical notation:
$$\mathbf{\sum \vec{F}_{\text{ext}} = \vec{0} \iff \frac{d\vec{v}}{dt} = \vec{0} \quad (\vec{v} = \text{constant})}$$

- If an object is at rest ($\vec{v} = \vec{0}$), it remains at rest forever unless an unbalanced external force acts on it.
- If an object is moving at $100\text{ m/s}$ North, it continues moving at exactly $100\text{ m/s}$ North forever unless an unbalanced external force acts on it.

---

### 1.2 What is Inertia? What is Mass?
- **Inertia:** The inherent physical resistance of any material object to changing its state of motion (i.e. resistance to acceleration).
- **Mass ($m$):** A quantitative scalar metric of inertia.
  - A $2000\text{ kg}$ automobile has a tremendous amount of inertia. To push it from rest to $10\text{ km/h}$ requires immense muscular effort.
  - A $0.145\text{ kg}$ baseball has very little inertia. A child can easily throw it to $50\text{ km/h}$.
  - Mass is **not** weight! A $100\text{ kg}$ iron anvil has a weight of $980\text{ N}$ on Earth, $162\text{ N}$ on the Moon, and $0\text{ N}$ in deep space. But its **mass is $100\text{ kg}$ everywhere in the universe**. If you try to kick that anvil in deep space where it is weightless, you will still shatter your toe, because its $100\text{ kg}$ of inertia violently resists being accelerated!

---

### 1.3 The Secret of the First Law: Defining Inertial Reference Frames
Beginners often ask: *"Isn't the First Law just a trivial special case of $F = ma$ with $a = 0$?"*

**No!** The First Law performs a much deeper epistemological duty: **It defines the coordinate frames in which the laws of physics are valid.**

#### The Coffee Cup on the Bus:
Imagine sitting on a city bus. On the smooth tray table in front of you sits a cup of coffee.
1. The bus cruises down a straight highway at a steady $60\text{ km/h}$. The coffee surface is flat and peaceful.
2. Suddenly, the bus driver slams on the brakes!
3. The coffee cup slides forward and crashes onto the floor.

Now ask yourself: **What physical object pushed the coffee cup forward?**
- Did a hand push it? No.
- Did a magnet pull it? No.
- Did wind blow it? No.

From the viewpoint of a passenger locked inside the accelerating bus, the cup accelerated spontaneously without any physical force acting on it!

This happens because the bus is a **Non-Inertial Reference Frame** (an accelerating or rotating frame). Inside an accelerating frame, Newton's laws fail unless you invent "fictitious forces" (like centrifugal force or the backward lurch).

From the viewpoint of an observer standing on the sidewalk outside (an **Inertial Reference Frame**):
- When the bus braked, the bus slowed down.
- The coffee cup simply continued moving forward at $60\text{ km/h}$ due to its own **inertia** (First Law), while the bus stopped beneath it!

> **Definition:** An **Inertial Reference Frame** is a coordinate system that is not accelerating or rotating. **Newton's Second Law ($\vec{F} = m\vec{a}$) is physically valid ONLY in inertial reference frames.**

---

# Level 2: The Second Law — Momentum & Rate of Change

### 2.1 The Fundamental Law of Dynamics
Newton did not originally write $\vec{F} = m\vec{a}$. He formulated his Second Law in terms of **Linear Momentum** ($\vec{p}$):
$$\mathbf{\vec{p} = m\vec{v}}$$
Linear momentum is the "quantity of motion"—the product of how much mass is moving and how fast it is moving.

> **Newton's Second Law (Original Formulation):**
> *"The rate of change of momentum of a body is directly proportional to the net motive force applied, and occurs in the straight line in which that force is applied."*

$$\mathbf{\vec{F}_{\text{net}} = \frac{d\vec{p}}{dt} = \frac{d}{dt}(m\vec{v})}$$

Apply the Product Rule of differential calculus:
$$\vec{F}_{\text{net}} = m \frac{d\vec{v}}{dt} + \vec{v}\frac{dm}{dt} = m\vec{a} + \vec{v}\frac{dm}{dt}$$

For standard classical bodies whose mass does not change over time ($\frac{dm}{dt} = 0$), this simplifies to the most celebrated vector equation in physics:
$$\mathbf{\vec{F}_{\text{net}} = m \vec{a}}$$

In 2D Cartesian space, this single vector equation decouples into two independent scalar equations:
$$\sum F_x = m a_x = m \frac{d^2x}{dt^2}$$
$$\sum F_y = m a_y = m \frac{d^2y}{dt^2}$$

---

### 2.2 What is a "Newton" of Force?
A **Newton** ($\text{N}$) is the derived SI unit of force:
$$\mathbf{1\text{ N} = 1\text{ kg} \cdot \text{m/s}^2}$$
*Physical Intuition:* One Newton is approximately the gravitational downward weight of an ordinary medium apple sitting in your palm ($m \approx 102\text{ grams} \implies F_g = 0.102 \times 9.8 \approx 1.0\text{ N}$).

---

### 2.3 Variable Mass Systems: The Tsiolkovsky Rocket Equation
When an object expels or consumes mass (such as a space rocket burning hundreds of tons of liquid propellant every minute), $\frac{dm}{dt} \neq 0$.

If a rocket expels exhaust gases at relative velocity $\vec{v}_{\text{rel}}$ at mass consumption rate $\frac{dm}{dt} < 0$, the forward thrust force is:
$$\mathbf{F_{\text{thrust}} = -v_{\text{rel}} \frac{dm}{dt}}$$
Integrating this yields the famous **Tsiolkovsky Rocket Equation**:
$$\Delta v = v_{\text{rel}} \ln\left(\frac{m_{\text{initial}}}{m_{\text{final}}}\right)$$

---

# Level 3: The Third Law & The Horse-and-Cart Paradox

### 3.1 Action and Reaction
Newton's Third Law governs all physical interactions in the cosmos:

> *"To every action there is always opposed an equal reaction; or the mutual actions of two bodies upon each other are always equal, and directed to contrary parts."*

$$\mathbf{\vec{F}_{A \to B} = -\vec{F}_{B \to A}}$$

Whenever Body A exerts a force on Body B, Body B simultaneously exerts a force on Body A of **identical magnitude** and **opposite direction**.

Everyday manifestations:
- When you jump off a small rowboat, you leap forward into the dock, but your feet push the rowboat backward into the lake.
- When an assault rifle fires a bullet forward, the expanding gunpowder gas drives the bullet forward, while exerting an equal and opposite backward force on the rifle (the kickback/recoil).
- When Earth pulls down on your body with $700\text{ N}$ of gravitational force, your body pulls upward on the entire planet Earth with exactly $700\text{ N}$!

---

### 3.2 The Horse-and-Cart Paradox (Debunking a Classical Trap)
Consider a famous puzzle that has confused generations of students:

> **The Puzzle:**
> A horse is hitched to a wooden wagon.
> The farmer commands the horse: *"Pull the wagon forward!"*
> The horse shakes its head and replies:
> *"According to Newton's Third Law, if I exert a forward force $F$ on the cart, the cart will exert an equal and opposite backward force $-F$ on me. Since $F + (-F) = 0$, the net force is zero and it is physically impossible for us to move!"*

```
                 F_{cart -> horse}         F_{horse -> cart}
                <=================         =================>
                 +---------------+         +---------------+
                 |     HORSE     |-------- |     CART      |
                 +---------------+         +---------------+
                    |        ^                |         ^
                    v        |                v         |
                 F_{hoof} F_{ground}        F_{drag}  F_{normal}
```

How do you refute the horse?

**The Resolution: Action-reaction pairs act on DIFFERENT bodies!**
Forces can only cancel out if they act on the **same** physical object.
1. **Look at the Cart alone:**
   What forces act *on the cart*?
   - Forward pull of the horse ($\vec{F}_{\text{horse} \to \text{cart}}$).
   - Opposing ground wheel friction ($\vec{f}_{\text{friction}}$).
   If $\vec{F}_{\text{horse} \to \text{cart}} > \vec{f}_{\text{friction}}$, the cart **accelerates forward** ($F_{\text{net}} = ma$).
2. **Look at the Horse alone:**
   What forces act *on the horse*?
   - Backward pull of the cart ($\vec{F}_{\text{cart} \to \text{horse}}$).
   - **Forward thrust of the ground on the horse's hooves!** The horse uses its muscles to push the ground backward; by Newton's Third Law, the ground pushes the horse *forward*.
   If the ground's forward push exceeds the cart's backward pull, the horse **accelerates forward**.

---

### 3.3 The Rocket Propulsion Fallacy
A common student misconception: *"Rockets cannot maneuver in outer space because there is no air for their exhaust to push against."*

**Scientific Truth:** Rockets do **not** push against the air! 
In fact, atmospheric air actively impedes rockets through drag.
A rocket moves via Newton's Third Law: the rocket engine accelerates burnt gas molecules backward inside the combustion chamber; the gas molecules exert an equal and opposite forward reaction force on the rocket's injector plate and chamber walls, driving the rocket forward in total vacuum.

---

# Level 4: The Force Catalog & The Rigorous FBD Protocol

To build physical simulations, we must catalog the primary forces of classical mechanics.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FORCE CATALOG                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Gravity (Weight):    F_g = m * g           (points straight down)       │
│  2. Normal Force:        N                     (perpendicular to surface)   │
│  3. Static Friction:     f_s <= μ_s * N        (matches lateral force)      │
│  4. Kinetic Friction:    f_k = μ_k * N         (opposes sliding velocity)   │
│  5. Tension:             T                     (pulls along string/cable)   │
│  6. Hooke's Spring:      F_s = -k * Δx         (restores to rest length)    │
│  7. Fluid Drag:          F_d = 1/2 ρ C_d A v²  (opposes velocity vector)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 4.1 Weight ($\vec{F}_g$) vs. Mass ($m$)
- **Mass ($m$):** The intrinsic amount of matter (scalar, in $\text{kg}$).
- **Weight ($\vec{F}_g$):** The gravitational force pulling on that mass (vector, in $\text{Newtons}$):
  $$\mathbf{\vec{F}_g = m \vec{g}}$$

---

### 4.2 The Normal Contact Force ($\vec{N}$)
When a book rests on a table, gravity pulls it downward. Why doesn't it plunge straight to the center of the Earth?
Because the outer electron shells of the table's atoms repel the outer electron shells of the book's atoms.
This contact constraint force is called the **Normal Force** ($\vec{N}$). It acts strictly **perpendicular** ("normal") to the contact surface.

> **Warning:** $N$ is **not** an action-reaction partner to gravity! Gravity is exerted by the Earth; the normal force is exerted by the table surface.

---

### 4.3 Dry Friction: Coulomb's Law of Friction
Friction acts parallel to the contact interface opposing relative motion:

1. **Static Friction ($f_s$):** Acts when two contacting surfaces are not sliding relative to each other. It matches whatever lateral force is applied, up to a maximum threshold:
   $$\mathbf{f_s \le \mu_s N}$$
   where $\mu_s$ is the dimensionless **coefficient of static friction**.
2. **Kinetic Friction ($f_k$):** Acts once the applied force overcomes the static threshold and the surfaces begin sliding:
   $$\mathbf{f_k = \mu_k N}$$
   where $\mu_k$ is the **coefficient of kinetic friction**.
   *Universal Invariant:* For almost all materials, $\mathbf{\mu_s > \mu_k}$. It takes significantly more force to start an object sliding than to keep it sliding!

---

### 4.4 The 4-Step Free-Body Diagram (FBD) Protocol
To solve any mechanics problem without errors, follow this protocol:

1. **Isolate the Object:** Draw a simple box or dot representing the body of interest.
2. **Draw ONLY External Forces:** Draw arrows pointing in the direction of forces acting *on* this body (Gravity down, Normal perpendicular, Friction opposing slide, Tension along strings). Never draw internal forces!
3. **Establish an Intelligent Coordinate Frame:** Align one axis along the direction of anticipated acceleration (e.g., parallel to an incline).
4. **Apply $\sum F_x = m a_x$ and $\sum F_y = m a_y$.**

---

# Level 5: Coupled Systems & Inclined Plane Dynamics

---

### 5.1 Sliding Down an Inclined Ramp with Friction
Consider a crate of mass $m$ on a ramp inclined at angle $\theta$ above horizontal, with kinetic friction coefficient $\mu_k$.

```
               Y ^
                 |   Normal N
                 |   ^
                 |   |   .---.
                 |   |  /   /|
                 |   | / m / |
                 |   ●'---'  | 
                 |  / \      |
                 | /   \     |  Gravity F_g = mg
                 |/  θ  v    +--------------------> X (Down ramp)
                 +-----------------
```

**Step 1: Rotate coordinate axes.**
Let $+x$ point down the ramp surface, and $+y$ point perpendicular away from the ramp.

**Step 2: Decompose gravity into rotated components.**
- Component pulling down the ramp: $F_{gx} = mg \sin\theta$
- Component pressing into the ramp: $F_{gy} = -mg \cos\theta$

**Step 3: Solve equilibrium along $Y$-axis (crate does not levitate or sink into ramp):**
$$\sum F_y = N - mg \cos\theta = 0 \implies \mathbf{N = mg \cos\theta}$$

**Step 4: Compute kinetic friction:**
$$f_k = \mu_k N = \mu_k mg \cos\theta$$

**Step 5: Apply Newton's Second Law along the ramp ($X$-axis):**
$$\sum F_x = mg \sin\theta - f_k = m a_x$$
$$mg \sin\theta - \mu_k mg \cos\theta = m a_x$$

Divide by mass $m$:
$$\mathbf{a_x = g(\sin\theta - \mu_k \cos\theta)} \quad \blacksquare$$

*Critical Angle of Sliding:* The crate slides only if the downward gravitational pull exceeds static friction:
$$mg \sin\theta > \mu_s mg \cos\theta \implies \frac{\sin\theta}{\cos\theta} > \mu_s \implies \mathbf{\tan\theta > \mu_s}$$

---

### 5.2 The Coupled Atwood Machine
Two masses $m_1$ and $m_2$ ($m_2 > m_1$) are connected by a light string draped over a frictionless pulley.

```
                 [ Pulley ]
                   /   \
                  /     \
             T   ^       ^  T
                 |       |
              [ m₁ ]   [ m₂ ]
                 |       |
                 v       v
               m₁g     m₂g
```

Both masses experience the same magnitude of acceleration $a$.
- Mass $m_1$ accelerates upward: $\sum F_1 = T - m_1 g = m_1 a \implies \mathbf{T = m_1(g + a)}$
- Mass $m_2$ accelerates downward: $\sum F_2 = m_2 g - T = m_2 a \implies \mathbf{T = m_2(g - a)}$

Equating the tensions:
$$m_1(g + a) = m_2(g - a) \implies m_1 g + m_1 a = m_2 g - m_2 a$$
$$(m_1 + m_2)a = (m_2 - m_1)g$$
$$\mathbf{a = \left(\frac{m_2 - m_1}{m_1 + m_2}\right)g} \quad \blacksquare$$

---

### 5.3 Elevator Dynamics: Apparent Weight
When you stand on a bathroom scale inside an elevator, the scale does not measure gravity; **it measures the normal contact force $N$ pressing against your feet**.

Taking upward as positive:
$$\sum F_y = N - mg = ma \implies \mathbf{N = m(g + a)}$$

1. **Elevator stationary or constant speed ($a = 0$):**
   $$N = mg \quad (\text{Scale reads your true weight})$$
2. **Elevator accelerating upward ($a > 0$):**
   $$N = m(g + a) > mg \quad (\text{You feel heavier!})$$
3. **Elevator accelerating downward / braking while climbing ($a < 0$):**
   $$N = m(g - |a|) < mg \quad (\text{You feel lighter!})$$
4. **Cable snaps (Free-fall, $a = -g$):**
   $$N = m(g - g) = \mathbf{0\text{ N}} \quad (\text{Apparent Weightlessness!})$$

---

# Level 6: Complete Production Computational Engine

In software physics engines and game loops, forces must never overwrite each other. Instead, physical bodies use the **Force Accumulator Pattern**:
1. At the start of a tick, `forceAccumulator` is $(0, 0)$.
2. All force generators (gravity, springs, player thrust, aerodynamic drag, friction) add their vectors to the accumulator.
3. The integrator computes $\vec{a} = \vec{F}_{\text{net}} / m$ and advances velocity and position.
4. The accumulator is cleared to zero for the next frame.

```typescript
/**
 * ============================================================================
 * THE TECH TREE OF KNOWLEDGE: SOVEREIGN COMPUTATIONAL ENGINE
 * Module: Classical Dynamics & Force Accumulator Engine
 * Standard: GSMS-10 (Gold Standard Module Specification)
 * ============================================================================
 */

export interface Vector2D {
  x: number;
  y: number;
}

export class NewtonianBody {
  public position: Vector2D;
  public velocity: Vector2D;
  public forceAccumulator: Vector2D;
  public mass: number;
  public invMass: number; // Cached inverse mass (0 for static immovable bodies)

  constructor(x: number, y: number, mass: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.forceAccumulator = { x: 0, y: 0 };
    this.mass = mass;
    // Inverse mass optimization: avoids expensive division by zero in tight loops
    this.invMass = mass > 0 ? 1 / mass : 0;
  }

  /**
   * Additively accumulates an external force vector into the net force.
   */
  public applyForce(fx: number, fy: number): void {
    this.forceAccumulator.x += fx;
    this.forceAccumulator.y += fy;
  }

  /**
   * Applies uniform downward gravitational force: F_g = [0, -m * g]
   */
  public applyGravity(g: number = 9.80665): void {
    if (this.invMass === 0) return;
    this.forceAccumulator.y -= this.mass * g;
  }

  /**
   * Applies quadratic aerodynamic drag: F_d = -0.5 * rho * C_d * A * |v| * v
   */
  public applyQuadraticDrag(kDrag: number): void {
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed < 1e-6) return;
    const fDragMag = kDrag * speed * speed;
    this.forceAccumulator.x -= (this.velocity.x / speed) * fDragMag;
    this.forceAccumulator.y -= (this.velocity.y / speed) * fDragMag;
  }

  /**
   * Applies Coulomb friction opposing relative velocity across a contact surface.
   */
  public applySurfaceFriction(normalForce: number, muKinetic: number): void {
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed < 1e-6) return;
    const frictionMag = muKinetic * normalForce;
    this.forceAccumulator.x -= (this.velocity.x / speed) * frictionMag;
    this.forceAccumulator.y -= (this.velocity.y / speed) * frictionMag;
  }

  /**
   * Advances motion by time step dt using Newton's Second Law and Semi-Implicit Euler.
   * v(t + dt) = v(t) + (F / m) * dt
   * x(t + dt) = x(t) + v(t + dt) * dt
   */
  public integrate(dt: number): void {
    if (this.invMass === 0) return; // Immovable static body

    // Newton's Second Law: a = F_net / m = F_net * invMass
    const ax = this.forceAccumulator.x * this.invMass;
    const ay = this.forceAccumulator.y * this.invMass;

    // Semi-Implicit (Symplectic) Euler integration
    this.velocity.x += ax * dt;
    this.velocity.y += ay * dt;
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Critical: Clear force accumulator for next frame
    this.forceAccumulator.x = 0;
    this.forceAccumulator.y = 0;
  }
}

export class DynamicsWorld {
  public bodies: NewtonianBody[] = [];
  public gravity: number;

  constructor(gravity: number = 9.80665) {
    this.gravity = gravity;
  }

  public addBody(body: NewtonianBody): void {
    this.bodies.push(body);
  }

  /**
   * Executes a complete physics frame: applies global forces and integrates.
   */
  public step(dt: number): void {
    for (const body of this.bodies) {
      body.applyGravity(this.gravity);
      body.integrate(dt);
    }
  }
}
```

---

# Level 7: Multi-Tiered Mastery Practice Set

---

### 🟢 Tier 1 (Class 6–7 Foundations): The Frictionless Sled
**Problem:** A child pulls a $10\text{ kg}$ sled across frictionless ice with a horizontal force of $30\text{ N}$.
1. What is the acceleration of the sled?
2. If the sled starts from rest, what is its speed after $4\text{ seconds}$?

#### Step-by-Step Solution:
**Part 1: Acceleration**
Apply Newton's Second Law:
$$F_{\text{net}} = m a \implies 30\text{ N} = (10\text{ kg})a \implies \mathbf{a = 3.0\text{ m/s}^2}$$

**Part 2: Final Speed**
Apply kinematics ($v_0 = 0$):
$$v = v_0 + at = 0 + (3.0\text{ m/s}^2)(4\text{ s}) = \mathbf{12.0\text{ m/s}} \quad (43.2\text{ km/h})$$

---

### 🟡 Tier 2 (Class 8–9 Intermediate): The Elevator Scale
**Problem:** A person with a mass of $70\text{ kg}$ stands on a spring scale inside an elevator ($g = 9.8\text{ m/s}^2$).
1. What does the scale read when the elevator is cruising upward at a constant speed of $5\text{ m/s}$?
2. What does the scale read when the elevator is accelerating upward at $2.2\text{ m/s}^2$?
3. What does the scale read when the elevator is accelerating downward at $3.0\text{ m/s}^2$?

#### Step-by-Step Solution:
The scale reads the normal contact force $N = m(g + a)$:
- True weight: $mg = 70 \times 9.8 = 686\text{ N}$.
- **Case 1: Constant Velocity ($a = 0$):**
  $$N = 70(9.8 + 0) = \mathbf{686\text{ N}}$$
- **Case 2: Upward Acceleration ($a = +2.2\text{ m/s}^2$):**
  $$N = 70(9.8 + 2.2) = 70(12.0) = \mathbf{840\text{ N}} \quad (\text{Feels } 22\% \text{ heavier})$$
- **Case 3: Downward Acceleration ($a = -3.0\text{ m/s}^2$):**
  $$N = 70(9.8 - 3.0) = 70(6.8) = \mathbf{476\text{ N}} \quad (\text{Feels } 31\% \text{ lighter})$$

---

### 🟠 Tier 3 (Class 10–11 Advanced): The Inclined Ramp with Friction
**Problem:** A $20\text{ kg}$ crate sits on a $30^\circ$ ramp. The coefficients of friction are $\mu_s = 0.40$ and $\mu_k = 0.25$. Take $g = 9.8\text{ m/s}^2$.
1. Will the crate start sliding on its own?
2. If given a slight nudge to overcome static friction, what will be its acceleration down the ramp?

#### Step-by-Step Solution:
**Part 1: Static Friction Check**
- Normal force: $N = mg \cos(30^\circ) = 20(9.8)(0.866) = \mathbf{169.74\text{ N}}$.
- Maximum static friction: $f_{s,\max} = \mu_s N = 0.40 \times 169.74 = \mathbf{67.90\text{ N}}$.
- Downward gravity component: $F_{gx} = mg \sin(30^\circ) = 20(9.8)(0.50) = \mathbf{98.00\text{ N}}$.
Since $98.00\text{ N} > 67.90\text{ N}$, gravity overcomes static friction! **Yes, the crate slides on its own.**

**Part 2: Kinetic Acceleration**
- Kinetic friction: $f_k = \mu_k N = 0.25 \times 169.74 = \mathbf{42.44\text{ N}}$.
- Net force down ramp: $F_{\text{net}} = 98.00 - 42.44 = \mathbf{55.56\text{ N}}$.
- Acceleration:
  $$a = \frac{F_{\text{net}}}{m} = \frac{55.56\text{ N}}{20\text{ kg}} = \mathbf{2.778\text{ m/s}^2}$$

---

### 🔴 Tier 4 (Engineering Mastery): The Coupled Atwood Machine
**Problem:** Two masses $m_1 = 3.0\text{ kg}$ and $m_2 = 5.0\text{ kg}$ hang over an ideal frictionless pulley ($g = 9.8\text{ m/s}^2$).
1. Derive and calculate the acceleration $a$ of the system.
2. Calculate the tension $T$ in the connecting cable.

#### Step-by-Step Solution:
**Part 1: Acceleration**
$$a = \left(\frac{m_2 - m_1}{m_1 + m_2}\right)g = \left(\frac{5.0 - 3.0}{5.0 + 3.0}\right)(9.8) = \frac{2.0}{8.0}(9.8) = \mathbf{2.45\text{ m/s}^2}$$

**Part 2: Cable Tension**
$$T = m_1(g + a) = 3.0(9.8 + 2.45) = 3.0(12.25) = \mathbf{36.75\text{ N}}$$
*Verification with $m_2$:* $T = m_2(g - a) = 5.0(9.8 - 2.45) = 5.0(7.35) = 36.75\text{ N}$ (Identical!).

---

### 🟣 Tier 5 (Computational / Algorithmic): Variable Mass Rocket Ascent
**Problem:** A single-stage research rocket has initial mass $M_0 = 1000\text{ kg}$ (of which $800\text{ kg}$ is propellant). The engine expels propellant at a steady rate of $R = 10\text{ kg/s}$ with exhaust velocity $v_{\text{rel}} = 2500\text{ m/s}$. Take $g = 9.8\text{ m/s}^2$.
1. Compute the thrust force $F_{\text{thrust}}$.
2. Calculate the rocket's initial net acceleration at liftoff ($t = 0$).
3. Calculate the rocket's net acceleration just before burnout ($t = 80\text{ s}$).

#### Step-by-Step Solution:
**Part 1: Thrust Force**
$$F_{\text{thrust}} = v_{\text{rel}} R = 2500\text{ m/s} \times 10\text{ kg/s} = \mathbf{25,000\text{ N}}$$

**Part 2: Initial Acceleration at Liftoff ($t = 0$)**
- Mass at liftoff: $m(0) = 1000\text{ kg}$.
- Weight at liftoff: $F_g = 1000 \times 9.8 = 9800\text{ N}$.
- Net force: $F_{\text{net}} = 25,000 - 9800 = 15,200\text{ N}$.
$$a(0) = \frac{15,200\text{ N}}{1000\text{ kg}} = \mathbf{15.20\text{ m/s}^2} \quad (\approx 1.55 g)$$

**Part 3: Acceleration at Burnout ($t = 80\text{ s}$)**
- Mass at burnout: $m(80) = 1000 - (10 \times 80) = 1000 - 800 = \mathbf{200\text{ kg}}$.
- Weight at burnout: $F_g = 200 \times 9.8 = 1960\text{ N}$.
- Net force: $F_{\text{net}} = 25,000 - 1960 = 23,040\text{ N}$.
$$a(80) = \frac{23,040\text{ N}}{200\text{ kg}} = \mathbf{115.20\text{ m/s}^2} \quad (\approx 11.75 g!)$$
*Rocket Insight:* As fuel burns, mass plummets to one-fifth of its starting value, causing acceleration to surge by nearly **800%**!

---

# Level 8: Socratic Inquiry & Philosophical Horizons

### 8.1 The Riddle of Action-at-a-Distance
*Question:* When you push a box with your hand, physical contact occurs. But when the Sun holds Earth in orbit across $150\text{ million kilometers}$ of empty vacuum, how does the force travel? Does the Sun reach out across empty void instantly?

*Reflection:*
Newton himself was deeply troubled by this paradox, writing in a letter to Richard Bentley in 1692:
> *"That one body may act upon another at a distance through a vacuum, without the mediation of any thing else... is to me so great an absurdity that I believe no man who has in philosophical matters a competent faculty of thinking can ever fall into it."*

In the 19th century, Michael Faraday and James Clerk Maxwell resolved this by introducing the concept of the **Physical Field**: mass does not act directly on distant mass; mass creates a gravitational field in the space surrounding it, and other masses react locally to that field. In the 20th century, Einstein proved that gravitational changes propagate at the finite **speed of light** ($c$), banishing instantaneous action-at-a-distance forever.

---

### 8.2 The Bridge to the Next Horizon
In this module, you mastered how external forces govern acceleration ($F = ma$).
- But what happens when two bodies collide and transfer motion instantaneously?
- In **Module `phys-momentum-conservation`**, we will discover that Newton's Third Law leads directly to the cosmic principle of **Conservation of Linear Momentum**, governing everything from snooker balls to subatomic particle colliders.
