# Newton's Laws of Motion & Classical Dynamics

## 1. Conceptual Foundations & Intuitive Overview
While kinematics tells us *how* an object moves, dynamics reveals *why* it moves. Sir Isaac Newton established the physical foundation of classical mechanics through three universal principles of motion:

1. **First Law (Law of Inertia):** An object at rest remains at rest, and an object in uniform motion in a straight line continues with constant velocity, unless acted upon by a non-zero net external force.
2. **Second Law (Fundamental Law of Dynamics):** The net force on a body equals the rate of change of its linear momentum. For constant mass:
   $$ \vec{F}_{\text{net}} = m \vec{a} $$
3. **Third Law (Action and Reaction):** Whenever body $A$ exerts a force on body $B$, body $B$ simultaneously exerts an equal and opposite force on body $A$:
   $$ \vec{F}_{A \to B} = -\vec{F}_{B \to A} $$

---

## 2. Mathematical Formalism

### 2.1 Vector Summation of Forces
In two-dimensional Cartesian space, forces add vectorially according to the superposition principle:

$$ \vec{F}_{\text{net}} = \sum_{i=1}^N \vec{F}_i = \begin{bmatrix} \sum F_{x, i} \\ \sum F_{y, i} \end{bmatrix} = m \begin{bmatrix} a_x \\ a_y \end{bmatrix} $$

Solving for the resulting acceleration:
$$ a_x = \frac{\sum F_{x, i}}{m}, \quad a_y = \frac{\sum F_{y, i}}{m} $$

### 2.2 Common Forces in Physics Engines
1. **Gravitational Force (Weight):**
   $$ \vec{F}_g = \begin{bmatrix} 0 \\ -m g \end{bmatrix} $$
2. **Linear Viscous Drag (Air Resistance):**
   $$ \vec{F}_d = -c_d \vec{v} = \begin{bmatrix} -c_d v_x \\ -c_d v_y \end{bmatrix} $$
3. **Quadratic Drag (High Speed Fluid Drag):**
   $$ \vec{F}_d = -\frac{1}{2} \rho C_D A \|\vec{v}\| \vec{v} $$
4. **Frictional Contact Force:**
   $$ f_k = \mu_k N $$
   opposing the relative velocity vector at the contact plane.

---

## 3. Worked Examples

### Example 1: Terminal Velocity with Linear Drag
A ball of mass $m = 2.0 \text{ kg}$ is dropped from rest under gravity ($g = 9.8 \text{ m/s}^2$). An upward viscous drag force acts with drag coefficient $c_d = 0.4 \text{ N}\cdot\text{s/m}$.
1. Formulate the equation of motion.
2. Calculate the terminal velocity $v_{\text{term}}$ of the ball.

**Solution:**
Setting up Newton's Second Law along the vertical axis (taking downwards as positive):
$$ F_{\text{net}} = m g - c_d v = m a $$

Terminal velocity occurs when net acceleration reaches zero ($a = 0$):
$$ m g - c_d v_{\text{term}} = 0 \implies v_{\text{term}} = \frac{m g}{c_d} $$
$$ v_{\text{term}} = \frac{2.0 \times 9.8}{0.4} = \frac{19.6}{0.4} = 49.0 \text{ m/s} $$

---

## 4. Interactive Simulation & Practical Computation

In modern computational physics, forces are accumulated each frame:

```javascript
class Particle {
  constructor(x, y, mass) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.force = { x: 0, y: 0 };
    this.mass = mass;
    this.invMass = mass > 0 ? 1 / mass : 0;
  }

  applyForce(fx, fy) {
    this.force.x += fx;
    this.force.y += fy;
  }

  integrate(dt) {
    // a = F / m
    const ax = this.force.x * this.invMass;
    const ay = this.force.y * this.invMass;

    // Velocity update
    this.vel.x += ax * dt;
    this.vel.y += ay * dt;

    // Position update
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;

    // Clear accumulated forces for next frame
    this.force.x = 0;
    this.force.y = 0;
  }
}
```
