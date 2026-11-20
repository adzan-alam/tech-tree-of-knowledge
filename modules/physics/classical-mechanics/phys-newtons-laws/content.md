# Newton's Laws of Motion & Classical Dynamics

---

## 1. The Epistemological Revolution: From Impetus to the Principia (1687)

### 1.1 The Aristotelian Fallacy vs. The Principia
For nearly two thousand years, medieval physics taught the **impetus theory**: that an object requires an active, continuous push to maintain motion. If the push ends, the object naturally comes to a halt. Everyday life seemed to corroborate this: when you stop pedaling a bicycle, friction and air drag bring you to rest.

In 1687, **Sir Isaac Newton** published the *Philosophiae Naturalis Principia Mathematica*, completely overturning this intuition. Newton realized that rest and uniform straight-line motion are physically identical states. An object slows down not because motion naturally dies, but because an invisible external force—**friction**—actively opposes its forward momentum.

Newton's laws achieved the first great unification in scientific history: proving that the same mathematical laws governing an apple falling to the ground also govern the Moon orbiting Earth and the planets orbiting the Sun.

### 1.2 Inertial Reference Frames: The Hidden Heart of the First Law
Newton's First Law is often mischaracterized as merely a special case of the Second Law ($a = 0$ when $F = 0$). In truth, the First Law performs a far more profound epistemological function: **it defines what an inertial reference frame is**.

> **Inertial Reference Frame:** A coordinate frame of reference that is neither accelerating nor rotating. In an inertial frame, an isolated body experiencing zero net external force continues in its state of rest or constant linear velocity.

If you are standing inside an accelerating subway car or on a spinning carousel, a ball placed on the smooth floor begins rolling spontaneously without any physical object touching it. In such **non-inertial frames**, Newton's laws do not hold unless one invents **fictitious (inertial) forces** (such as centrifugal or Coriolis forces). Newton's Second Law ($\vec{F} = m\vec{a}$) is valid *only* within inertial frames.

---

## 2. First-Principles Formalism: The Three Universal Laws

### 2.1 The First Law (The Law of Inertia)
$$ \sum \vec{F}_{\text{ext}} = \vec{0} \iff \frac{d\vec{v}}{dt} = \vec{0} \quad (\vec{v} = \text{constant}) $$
- **Inertia:** The inherent resistance of any physical mass to changes in its state of motion.
- **Mass ($m$):** A quantitative scalar measure of an object's inertia. A $1000 \text{ kg}$ boulder has $1000$ times more inertia than a $1 \text{ kg}$ rock; applying the same force accelerates the rock $1000$ times faster.

### 2.2 The Second Law (The Fundamental Law of Dynamics)
Newton originally formulated the second law in terms of **linear momentum** $\vec{p} = m\vec{v}$:

> *"The alteration of motion is ever proportional to the motive force impress'd; and is made in the direction of the right line in which that force is impress'd."*

$$ \vec{F}_{\text{net}} = \frac{d\vec{p}}{dt} = \frac{d}{dt}(m\vec{v}) $$

Applying the product rule of calculus:
$$ \vec{F}_{\text{net}} = m \frac{d\vec{v}}{dt} + \vec{v}\frac{dm}{dt} = m\vec{a} + \vec{v}\frac{dm}{dt} $$

For classical bodies with constant mass ($\frac{dm}{dt} = 0$), this simplifies to the famous vector equation:
$$ \mathbf{\vec{F}_{\text{net}} = m \vec{a}} $$

In 2D Cartesian space, this decomposes into two uncoupled scalar differential equations:
$$ \sum F_x = m a_x = m \frac{d^2x}{dt^2}, \quad \sum F_y = m a_y = m \frac{d^2y}{dt^2} $$

### 2.3 The Third Law (Action and Reaction)
> *To every action there is always opposed an equal reaction; or the mutual actions of two bodies upon each other are always equal, and directed to contrary parts.*

$$ \mathbf{\vec{F}_{A \to B} = -\vec{F}_{B \to A}} $$

```
        Body A                     Body B
       +------+  F_{B -> A}       F_{A -> B}  +------+
       |  A   | <===========     ===========> |  B   |
       +------+                               +------+
```

#### The Horse and Cart Paradox (Debunking a Common Fallacy)
*Paradox:* A horse pulls a cart forward with force $\vec{F}_{\text{horse} \to \text{cart}}$. By the Third Law, the cart pulls the horse backward with an equal and opposite force $\vec{F}_{\text{cart} \to \text{horse}} = -\vec{F}_{\text{horse} \to \text{cart}}$. Why don't these two forces cancel out to zero, leaving both permanently stuck?

*Resolution:* **Action-reaction pairs act on different bodies!**
- To find the acceleration of the *cart*, you sum forces acting *on the cart*: the forward pull of the horse minus wheel friction.
- To find the acceleration of the *horse*, you sum forces acting *on the horse*: the backward pull of the cart plus the forward frictional thrust of the ground on the horse's hooves.
Forces only cancel when they act on the **same** free-body diagram!

---

## 3. The Taxonomy of Physical Forces in Simulation

In building physical simulators and games, all interactions resolve into specific force models:

### 3.1 Gravitational Force (Weight)
Near Earth's surface, the gravitational force acts uniformly downward:
$$ \vec{F}_g = m \vec{g} = \begin{bmatrix} 0 \\ -m g \end{bmatrix}, \quad g \approx 9.80665 \text{ m/s}^2 $$

### 3.2 Normal Contact Force ($\vec{N}$)
A constraint force arising from electrostatic repulsion between outer electron shells when two solid surfaces touch. It acts strictly **perpendicular** (normal) to the contact surface, adjusting its magnitude automatically to prevent interpenetration:
$$ N \ge 0 $$

### 3.3 Dry Friction (Coulomb-Amontons Model)
Friction acts parallel to the contact interface opposing relative motion:
1. **Static Friction ($f_s$):** Prevents an object at rest from moving:
   $$ f_s \le \mu_s N $$
   It matches applied lateral force up to a threshold $f_{s,\max} = \mu_s N$.
2. **Kinetic Friction ($f_k$):** Retards an object already sliding with relative velocity $\vec{v}_{\text{rel}}$:
   $$ \vec{f}_k = -\mu_k N \frac{\vec{v}_{\text{rel}}}{\|\vec{v}_{\text{rel}}\|} $$
   where $\mu_s > \mu_k$ (it takes more force to initiate sliding than to maintain it).

### 3.4 Viscous and Aerodynamic Drag
1. **Linear (Stokes) Drag:** Occurs at low Reynolds numbers (tiny particles or viscous oil):
   $$ \vec{F}_{\text{drag}} = -b \vec{v} $$
2. **Quadratic Aerodynamic Drag:** Occurs at high Reynolds numbers (air drag on cars, projectiles, sports balls):
   $$ \vec{F}_{\text{drag}} = -\frac{1}{2}\rho C_D A \|\vec{v}\| \vec{v} $$
   where $\rho$ is air density ($\approx 1.225 \text{ kg/m}^3$), $C_D$ is drag coefficient, and $A$ is cross-sectional area.

### 3.5 Elastic Restoring Force (Hooke's Law)
For a spring with stiffness $k$ and natural resting length $L_0$ stretched to current length $L$:
$$ \vec{F}_s = -k (\|\Delta \vec{r}\| - L_0) \frac{\Delta \vec{r}}{\|\Delta \vec{r}\|} $$

---

## 4. Free-Body Diagrams (FBD): The Rigorous Protocol

To solve any dynamical system without errors, follow this 4-step engineering protocol:
1. **Isolate the System:** Draw an imaginary dashed boundary around the exact body of interest.
2. **Identify All External Forces:** Draw only forces crossing that boundary that act *on* the body (gravity, normal, friction, tension, applied forces). Never draw internal forces or forces exerted by the body on the world.
3. **Establish a Coordinate Frame:** Align coordinate axes with the expected direction of acceleration (e.g. parallel and perpendicular to an inclined ramp).
4. **Apply Newton's Second Law:** Write $\sum F_x = m a_x$ and $\sum F_y = m a_y$.

---

## 5. Multi-Tiered Worked Examples

### Level 1: Sliding Down an Inclined Plane with Friction
A wooden crate of mass $m = 20 \text{ kg}$ sits on a ramp inclined at $\theta = 30^\circ$ to the horizontal. The coefficient of kinetic friction between crate and ramp is $\mu_k = 0.20$. Gravity is $g = 9.8 \text{ m/s}^2$.
1. Calculate the normal force $N$.
2. Calculate the kinetic friction force $f_k$.
3. Determine the acceleration $a$ of the crate down the ramp.

```
          /|
         / |
        /  |
    m [ ]  |
      / \  |
     /   \ |  θ = 30°
    +-----+------------------
```

**Step-by-step Solution:**
1. Coordinate setup: Let the $+x$-axis point down along the ramp surface, and $+y$-axis point perpendicular away from the ramp surface.
2. Resolve gravity into components:
   $$ F_{g,x} = m g \sin\theta, \quad F_{g,y} = -m g \cos\theta $$
3. Equilibrium along normal axis ($a_y = 0$ because crate does not leave the ramp):
   $$ \sum F_y = N - m g \cos\theta = 0 \implies \mathbf{N = m g \cos\theta} $$
   $$ N = (20)(9.8)\cos(30^\circ) = 196 \times 0.8660 \approx \mathbf{169.74 \text{ N}} $$
4. Compute kinetic friction:
   $$ f_k = \mu_k N = 0.20 \times 169.74 \approx \mathbf{33.95 \text{ N}} \quad (\text{pointing up the ramp, } -x) $$
5. Apply Second Law along $x$-axis:
   $$ \sum F_x = m g \sin\theta - f_k = m a_x $$
   $$ a_x = g \sin\theta - \frac{f_k}{m} = 9.8 \sin(30^\circ) - \frac{33.95}{20} = 4.90 - 1.6975 = \mathbf{3.2025 \text{ m/s}^2} $$
The crate accelerates down the ramp at $3.20 \text{ m/s}^2$.

---

### Level 2: The Coupled Atwood Machine
Two masses $m_1 = 3 \text{ kg}$ and $m_2 = 5 \text{ kg}$ are connected by a massless, inextensible string hanging over an ideal frictionless pulley.
1. Derive an analytical expression for the acceleration $a$ of the system.
2. Compute the tension $T$ in the string during motion.

**Step-by-step Solution:**
1. Let $m_2$ accelerate downwards with $+a$, which forces $m_1$ to accelerate upwards with $+a$ (since string length is fixed).
2. FBD for $m_1$ (upward motion):
   $$ \sum F_1 = T - m_1 g = m_1 a \implies T = m_1 g + m_1 a \quad \text{(Eq. 1)} $$
3. FBD for $m_2$ (downward motion):
   $$ \sum F_2 = m_2 g - T = m_2 a \quad \text{(Eq. 2)} $$
4. Add Eq. 1 and Eq. 2 to eliminate internal tension $T$:
   $$ (T - m_1 g) + (m_2 g - T) = m_1 a + m_2 a $$
   $$ (m_2 - m_1) g = (m_1 + m_2) a $$
   $$ \mathbf{a = \frac{m_2 - m_1}{m_1 + m_2} g} $$
   $$ a = \frac{5 - 3}{5 + 3}(9.8) = \frac{2}{8}(9.8) = \mathbf{2.45 \text{ m/s}^2} $$
5. Substitute $a$ back into Eq. 1 to find tension $T$:
   $$ T = m_1(g + a) = 3(9.8 + 2.45) = 3(12.25) = \mathbf{36.75 \text{ N}} $$
Notice that $T = 36.75 \text{ N}$ is greater than $m_1 g = 29.4 \text{ N}$ (accelerating $m_1$ upward) and less than $m_2 g = 49.0 \text{ N}$ (allowing $m_2$ to accelerate downward).

---

### Level 3: Terminal Velocity Under Quadratic Aerodynamic Drag
A skydiver of mass $m = 80 \text{ kg}$ jumps from an aircraft. The cross-sectional area is $A = 0.7 \text{ m}^2$, air density is $\rho = 1.2 \text{ kg/m}^3$, and drag coefficient is $C_D = 1.0$.
1. Derive the terminal velocity $v_{\text{term}}$.
2. Calculate the numerical value of $v_{\text{term}}$ in $\text{m/s}$ and $\text{km/h}$.

**Step-by-step Solution:**
1. Sum of vertical forces (taking downward as positive):
   $$ \sum F_y = m g - \frac{1}{2}\rho C_D A v^2 = m a_y $$
2. Terminal velocity occurs when acceleration drops to zero ($a_y = 0$):
   $$ m g - \frac{1}{2}\rho C_D A v_{\text{term}}^2 = 0 $$
   $$ v_{\text{term}}^2 = \frac{2 m g}{\rho C_D A} \implies \mathbf{v_{\text{term}} = \sqrt{\frac{2 m g}{\rho C_D A}}} $$
3. Compute numerical value:
   $$ v_{\text{term}} = \sqrt{\frac{2 \times 80 \times 9.8}{1.2 \times 1.0 \times 0.7}} = \sqrt{\frac{1568}{0.84}} = \sqrt{1866.67} \approx \mathbf{43.20 \text{ m/s}} $$
   Converting to $\text{km/h}$:
   $$ 43.20 \times 3.6 \approx \mathbf{155.5 \text{ km/h}} $$

---

## 6. Production-Ready Computational Engine: Force Accumulator

In game physics and physical simulators, forces must never overwrite each other; they are accumulated additively each tick and cleared after integration:

```typescript
export interface Vector2D {
  x: number;
  y: number;
}

export class PhysicalParticle {
  public position: Vector2D;
  public velocity: Vector2D;
  public forceAccumulator: Vector2D;
  public mass: number;
  public invMass: number;

  constructor(x: number, y: number, mass: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.forceAccumulator = { x: 0, y: 0 };
    this.mass = mass;
    // Cache inverse mass for performance and to support immovable/static bodies (mass = 0 -> invMass = 0)
    this.invMass = mass > 0 ? 1 / mass : 0;
  }

  /**
   * Applies an external force (e.g. thrust, wind, spring)
   */
  public applyForce(fx: number, fy: number): void {
    this.forceAccumulator.x += fx;
    this.forceAccumulator.y += fy;
  }

  /**
   * Applies aerodynamic quadratic drag: F_drag = -0.5 * rho * Cd * A * |v| * v
   */
  public applyQuadraticDrag(dragCoeff: number): void {
    const speed = Math.hypot(this.velocity.x, this.velocity.y);
    if (speed < 1e-6) return;
    const dragMagnitude = 0.5 * dragCoeff * speed * speed;
    this.forceAccumulator.x -= (this.velocity.x / speed) * dragMagnitude;
    this.forceAccumulator.y -= (this.velocity.y / speed) * dragMagnitude;
  }

  /**
   * Advances motion by dt using Newton's Second Law and Semi-Implicit Euler
   */
  public integrate(dt: number): void {
    if (this.invMass === 0) return; // Static obstacle

    // a = F / m
    const ax = this.forceAccumulator.x * this.invMass;
    const ay = this.forceAccumulator.y * this.invMass;

    // v(t + dt) = v(t) + a * dt
    this.velocity.x += ax * dt;
    this.velocity.y += ay * dt;

    // x(t + dt) = x(t) + v(t + dt) * dt
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // Vital: Clear accumulated forces for next frame
    this.forceAccumulator.x = 0;
    this.forceAccumulator.y = 0;
  }
}
```

---

## 7. Socratic Self-Check & Verification

1. **Question:** If you are floating in deep outer space far from all stars, and you throw a $5 \text{ kg}$ wrench forward at $10 \text{ m/s}$, what happens to you?
   - **Answer:** By Newton's Third Law, the wrench exerts an equal and opposite force on your hands. By conservation of momentum, you accelerate backward with velocity $v_{\text{you}} = -\frac{m_{\text{wrench}}}{m_{\text{you}}} v_{\text{wrench}}$. If your mass is $80 \text{ kg}$, you drift backward at $-0.625 \text{ m/s}$ indefinitely (Newton's First Law).
2. **Question:** Why can't a rocket propel itself in the vacuum of space if there is "no air to push against"?
   - **Answer:** Rockets do **not** push against the atmosphere! Rockets propel themselves via Newton's Third Law: the rocket engine accelerates high-speed exhaust gas backward; the reaction force of the expelled gas drives the rocket forward. In fact, rockets operate *more* efficiently in space because there is zero atmospheric drag opposing their motion.
3. **Question:** What is the difference between inertial mass and gravitational mass?
   - **Answer:** Inertial mass measures resistance to acceleration ($m_i = F/a$); gravitational mass determines the strength of gravitational attraction ($m_g = F_g / g$). Albert Einstein's **Equivalence Principle** posited that $m_i \equiv m_g$ exactly, forming the foundational postulate of General Relativity.
