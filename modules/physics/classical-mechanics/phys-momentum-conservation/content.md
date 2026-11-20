# Linear Momentum, Impulse, and Collision Dynamics

---

## 1. The Epistemological Insight: From Huygens to Noether's Symmetry

### 1.1 The Collision Experiments of Christiaan Huygens (1669)
Before Isaac Newton published the *Principia*, natural philosophers struggled to understand collisions. René Descartes had postulated that God preserved the total "quantity of motion" ($\sum m |v|$) in the universe. However, when tested against colliding pendulum balls, Descartes' scalar formula failed.

In 1669, the Dutch physicist **Christiaan Huygens** presented a revolutionary analysis to the Royal Society. Huygens recognized that:
1. Direction matters: momentum is fundamentally a **vector** quantity ($\vec{p} = m\vec{v}$).
2. Motion is relative: by imagining the collision taking place inside a smoothly moving canal boat, Huygens derived the exact laws of elastic collisions and demonstrated that kinetic energy ($\frac{1}{2}mv^2$) is uniquely conserved in elastic impacts.

### 1.2 Emmy Noether's Theorem: Spatial Symmetry
In 1915, the mathematician **Emmy Noether** proved one of the deepest theorems in theoretical physics: **every continuous symmetry of a physical system corresponds to an exact conservation law**.

> **The Origin of Momentum Conservation:**  
> The universe possesses **spatial translational symmetry**—meaning the fundamental laws of physics do not depend on *where* you are in space. An experiment conducted in London, on Mars, or in deep intergalactic space behaves identically.  
> Noether proved mathematically that spatial translational symmetry implies that the total linear momentum of an isolated system **must remain invariant for all time**.

Momentum conservation is even more fundamental than Newton's laws. When quantum mechanics and Einstein's relativity overturned classical mechanics at atomic and cosmic scales, Newton's Second Law ($\vec{F} = m\vec{a}$) had to be modified, but **conservation of momentum survived completely intact**.

---

## 2. First-Principles Formalism: The Isolated System & Center of Mass

### 2.1 The Definition of Linear Momentum
For a point particle of mass $m$ moving with velocity $\vec{v}$:
$$ \vec{p} = m \vec{v} $$
Momentum has units of $\text{kg}\cdot\text{m/s}$ (or Newton-seconds, $\text{N}\cdot\text{s}$).

### 2.2 System Momentum and the Center of Mass
For a collection of $N$ interacting particles with masses $m_i$ and positions $\vec{r}_i$:
The **Center of Mass** $\vec{R}_{\text{cm}}$ is the mass-weighted average position:
$$ \vec{R}_{\text{cm}} = \frac{\sum_{i=1}^N m_i \vec{r}_i}{M_{\text{total}}}, \quad \text{where } M_{\text{total}} = \sum_{i=1}^N m_i $$

Differentiating with respect to time yields the velocity of the center of mass:
$$ \vec{V}_{\text{cm}} = \frac{d\vec{R}_{\text{cm}}}{dt} = \frac{\sum_{i=1}^N m_i \vec{v}_i}{M_{\text{total}}} = \frac{\vec{P}_{\text{total}}}{M_{\text{total}}} $$

Differentiating again gives Newton's Second Law for the entire system:
$$ M_{\text{total}} \vec{A}_{\text{cm}} = \frac{d\vec{P}_{\text{total}}}{dt} = \sum \vec{F}_{\text{external}} + \sum \vec{F}_{\text{internal}} $$

By Newton's Third Law, every internal force $\vec{F}_{ij}$ exerted by particle $i$ on particle $j$ is canceled by $-\vec{F}_{ji}$:
$$ \sum \vec{F}_{\text{internal}} = \vec{0} $$

Therefore:
$$ \mathbf{\sum \vec{F}_{\text{external}} = \frac{d\vec{P}_{\text{total}}}{dt}} $$

**The Universal Conservation Law:**
If the net external force on a system is zero ($\sum \vec{F}_{\text{external}} = \vec{0}$), the total momentum is strictly constant:
$$ \mathbf{\vec{P}_{\text{total}} = \sum_{i=1}^N m_i \vec{v}_i = \text{constant}} $$
*Illustration:* If an artillery shell explodes in mid-air, the internal explosion forces blow fragments in all directions, but the system's center of mass continues along its original parabolic trajectory undisturbed!

---

## 3. The Impulse-Momentum Theorem

When a force acts over an interval of time $\Delta t = t_2 - t_1$, the cumulative effect is termed **impulse** $\vec{J}$:

$$ \vec{J} = \int_{t_1}^{t_2} \vec{F}(t) \, dt = \Delta \vec{p} = m \vec{v}_f - m \vec{v}_i $$

```
    Force F(t)
        ^          /---\
        |        /   |   \       Area under curve = Impulse J = Δp
        |       /    |    \
        |______/_____|_____\____> Time t
             t_1           t_2
```

### 3.1 Engineering Applications: Force Mitigation
For a given change in momentum $\Delta \vec{p}$ (e.g. bringing a moving car to a complete stop):
$$ \vec{F}_{\text{avg}} = \frac{\Delta \vec{p}}{\Delta t} $$
- If $\Delta t$ is very small (hitting a rigid concrete barrier in $0.005 \text{ s}$), the impact force $\vec{F}_{\text{avg}}$ is gigantic, causing catastrophic structural destruction.
- If $\Delta t$ is prolonged (automobile crumple zones and airbags extending deceleration time to $0.15 \text{ s}$), the peak force experienced by passengers is reduced by a factor of 30, saving human lives.

---

## 4. Analytical Physics of Collisions

Collisions are categorized according to whether kinetic energy ($K = \frac{1}{2}mv^2$) is conserved:

### 4.1 The Coefficient of Restitution ($e$)
The coefficient of restitution $e \in [0, 1]$ characterizes the elasticity of the contact materials:
$$ e = -\frac{v_{1f} - v_{2f}}{v_{1i} - v_{2i}} = \frac{\text{Separation Speed}}{\text{Approach Speed}} $$

1. **Perfectly Elastic Collision ($e = 1.0$):** Both momentum and kinetic energy are conserved ($K_f = K_i$).
2. **Inelastic Collision ($0 < e < 1.0$):** Momentum is conserved; kinetic energy is partially converted into heat, sound, and atomic lattice deformation ($K_f < K_i$).
3. **Completely Inelastic Collision ($e = 0.0$):** Colliding bodies stick together, moving with identical final velocity ($v_{1f} = v_{2f}$). This represents the **maximum possible kinetic energy dissipation** consistent with momentum conservation.

### 4.2 Rigorous Derivation of 1D Elastic Velocities
Consider two masses $m_1, m_2$ colliding head-on with initial velocities $u_1, u_2$.
From momentum conservation:
$$ m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2 \implies m_1(u_1 - v_1) = m_2(v_2 - u_2) \quad \text{(Eq. 1)} $$

From kinetic energy conservation:
$$ \frac{1}{2}m_1 u_1^2 + \frac{1}{2}m_2 u_2^2 = \frac{1}{2}m_1 v_1^2 + \frac{1}{2}m_2 v_2^2 \implies m_1(u_1^2 - v_1^2) = m_2(v_2^2 - u_2^2) $$

Factoring as difference of squares:
$$ m_1(u_1 - v_1)(u_1 + v_1) = m_2(v_2 - u_2)(v_2 + u_2) \quad \text{(Eq. 2)} $$

Dividing Eq. 2 by Eq. 1:
$$ u_1 + v_1 = v_2 + u_2 \implies \mathbf{u_1 - u_2 = -(v_1 - v_2)} $$
This proves that **the relative speed of separation equals the relative speed of approach** ($e = 1$)!

Solving simultaneously for final velocities:
$$ \mathbf{v_1 = \left(\frac{m_1 - m_2}{m_1 + m_2}\right) u_1 + \left(\frac{2m_2}{m_1 + m_2}\right) u_2} $$
$$ \mathbf{v_2 = \left(\frac{2m_1}{m_1 + m_2}\right) u_1 + \left(\frac{m_2 - m_1}{m_1 + m_2}\right) u_2} $$

#### Remarkable Special Cases:
- **Case 1 ($m_1 = m_2$):** $v_1 = u_2$ and $v_2 = u_1$. Equal masses cleanly exchange velocities! (The basis of Newton's Cradle).
- **Case 2 ($m_1 \ll m_2$, Target at rest $u_2 = 0$):** $v_1 \approx -u_1$ and $v_2 \approx 0$. A tennis ball bounces off a massive wall with inverted speed.
- **Case 3 ($m_1 \gg m_2$, Target at rest $u_2 = 0$):** $v_1 \approx u_1$ and $v_2 \approx 2 u_1$. A speeding truck hits a tennis ball, launching the ball at twice the truck's speed!

---

## 5. 2D Oblique Collisions & Computational Impulse Resolution

In 2D physics engines, bodies collide at arbitrary angles. The collision resolution occurs strictly along the **contact normal** $\hat{n}$.

```
                  Sphere 1 (m1)        Sphere 2 (m2)
                       ●                  ●
                      / \   Contact n    / \
                     | v1| ------------>| v2|
                      \ /                \ /
```

### 5.1 The Impulse Scalar Formula
1. Compute the unit contact normal pointing from body 1 to body 2:
   $$ \hat{n} = \frac{\vec{r}_2 - \vec{r}_1}{\|\vec{r}_2 - \vec{r}_1\|} $$
2. Relative velocity along the normal:
   $$ v_{\text{rel}} = (\vec{v}_1 - \vec{v}_2) \cdot \hat{n} $$
   *(If $v_{\text{rel}} \le 0$, the bodies are already separating; no collision impulse is applied).*
3. Impulse magnitude $j$:
   $$ j = \frac{-(1 + e) v_{\text{rel}}}{\frac{1}{m_1} + \frac{1}{m_2}} $$
4. Velocity updates:
   $$ \vec{v}_1' = \vec{v}_1 + \frac{j}{m_1} \hat{n} $$
   $$ \vec{v}_2' = \vec{v}_2 - \frac{j}{m_2} \hat{n} $$

### 5.2 Positional Penetration Resolution
Due to finite discrete time steps $\Delta t$, colliding bodies overlap before a collision is detected. If only velocities are altered, objects may remain stuck or sink into each other ("sinking trap").
We apply **Baumgarte position projection** to separate overlapping bodies:
$$ d = (R_1 + R_2) - \|\vec{r}_2 - \vec{r}_1\| $$
$$ \vec{r}_1' = \vec{r}_1 - \frac{m_2}{m_1 + m_2} d \hat{n}, \quad \vec{r}_2' = \vec{r}_2 + \frac{m_1}{m_1 + m_2} d \hat{n} $$

---

## 6. Multi-Tiered Worked Examples

### Level 1: The Ballistic Pendulum
A wooden block of mass $M = 1.98 \text{ kg}$ hangs from light vertical wires. A bullet of mass $m = 0.02 \text{ kg}$ is fired horizontally into the block and embeds itself inside ($e = 0$). The combined block and bullet swing upward to a maximum vertical height $h = 0.20 \text{ m}$. Calculate the muzzle velocity $v_0$ of the bullet ($g = 9.8 \text{ m/s}^2$).

**Step-by-step Solution:**
1. **Stage 1 (Inelastic Collision):** During the instant of impact, external forces (gravity, string tension) have negligible impulse. Momentum is conserved:
   $$ m v_0 = (m + M) V_{\text{post}} \implies V_{\text{post}} = \frac{m}{m + M} v_0 = \frac{0.02}{2.00} v_0 = 0.01 v_0 $$
2. **Stage 2 (Swing to Height $h$):** After the bullet embeds, mechanical energy is conserved as the block swings up:
   $$ \frac{1}{2}(m + M) V_{\text{post}}^2 = (m + M) g h $$
   $$ V_{\text{post}} = \sqrt{2 g h} = \sqrt{2 \times 9.8 \times 0.20} = \sqrt{3.92} \approx 1.9799 \text{ m/s} $$
3. **Connecting Stages:**
   $$ 0.01 v_0 = 1.9799 \implies v_0 = \frac{1.9799}{0.01} \approx \mathbf{198.0 \text{ m/s}} $$
Notice how the problem combines momentum conservation during the brief inelastic collision with energy conservation during the subsequent gravity swing!

---

### Level 2: 2D Oblique Billiard Scattering
A cue ball of mass $m$ moving at $v_0 = 5 \text{ m/s}$ along the $+x$-axis strikes a stationary target ball of identical mass $m$ in a glancing elastic collision. After the collision, the cue ball moves at an angle of $\theta = 30^\circ$ relative to the $+x$-axis.
1. Show that the angle between the two departing balls is always $90^\circ$.
2. Calculate the final speeds $v_1$ and $v_2$.

**Step-by-step Solution:**
1. Vector momentum conservation:
   $$ m \vec{v}_0 = m \vec{v}_1 + m \vec{v}_2 \implies \vec{v}_0 = \vec{v}_1 + \vec{v}_2 $$
   Take the dot product of both sides with itself:
   $$ \|\vec{v}_0\|^2 = \|\vec{v}_1 + \vec{v}_2\|^2 = v_1^2 + v_2^2 + 2(\vec{v}_1 \cdot \vec{v}_2) \quad \text{(Eq. A)} $$
2. Kinetic energy conservation ($e = 1$):
   $$ \frac{1}{2}m v_0^2 = \frac{1}{2}m v_1^2 + \frac{1}{2}m v_2^2 \implies v_0^2 = v_1^2 + v_2^2 \quad \text{(Eq. B)} $$
3. Equating Eq. A and Eq. B:
   $$ v_1^2 + v_2^2 + 2(\vec{v}_1 \cdot \vec{v}_2) = v_1^2 + v_2^2 \implies 2(\vec{v}_1 \cdot \vec{v}_2) = 0 \implies \mathbf{\vec{v}_1 \cdot \vec{v}_2 = 0} $$
   Since the dot product is zero, the departing velocity vectors are strictly **perpendicular** ($90^\circ$)!
4. Since $\theta_1 = 30^\circ$, it follows that $\theta_2 = 30^\circ - 90^\circ = -60^\circ$.
   From the right triangle of velocities:
   $$ v_1 = v_0 \cos(30^\circ) = 5 \times \frac{\sqrt{3}}{2} \approx \mathbf{4.33 \text{ m/s}} $$
   $$ v_2 = v_0 \sin(30^\circ) = 5 \times 0.5 = \mathbf{2.50 \text{ m/s}} $$

---

### Level 3: The Tsiolkovsky Rocket Equation
Derive the ideal rocket equation from first principles of momentum conservation for a rocket of total initial mass $m_0$ burning propellant expelled backward at constant relative exhaust speed $v_e$.

**Step-by-step Solution:**
1. At time $t$, system momentum: $P(t) = m v$.
2. At time $t + dt$, mass has decreased by $dm > 0$ to $(m - dm)$, moving at $(v + dv)$. The expelled gas has mass $dm$ and world velocity $(v - v_e)$:
   $$ P(t + dt) = (m - dm)(v + dv) + dm(v - v_e) $$
   $$ = mv + m\,dv - v\,dm - dm\,dv + v\,dm - v_e\,dm $$
   Discarding second-order infinitesimal $dm\,dv \approx 0$:
   $$ P(t + dt) = mv + m\,dv - v_e\,dm $$
3. In absence of external forces ($P(t + dt) = P(t)$):
   $$ mv + m\,dv - v_e\,dm = mv \implies m\,dv = v_e\,dm $$
   Since the rocket mass changes by $d m_{\text{rocket}} = -dm$:
   $$ dv = -v_e \frac{dm_{\text{rocket}}}{m_{\text{rocket}}} $$
4. Integrate from initial fuel load $m_0$ to burnout mass $m_f$:
   $$ \int_{v_0}^{v_f} dv = -v_e \int_{m_0}^{m_f} \frac{dm}{m} $$
   $$ \mathbf{\Delta v = v_f - v_0 = v_e \ln\left(\frac{m_0}{m_f}\right)} \quad \blacksquare $$

---

## 7. Production-Ready Computational Engine: 2D Sphere Collision Resolver

```typescript
export interface CircleBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  restitution: number;
}

export class CollisionResolver {
  /**
   * Resolves impulse and positional penetration between two 2D circular bodies.
   */
  public static resolveCircleCollision(b1: CircleBody, b2: CircleBody): boolean {
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const distSq = dx * dx + dy * dy;
    const minDist = b1.radius + b2.radius;

    if (distSq >= minDist * minDist || distSq === 0) {
      return false; // No collision
    }

    const dist = Math.sqrt(distSq);
    // Contact normal pointing from b1 to b2
    const nx = dx / dist;
    const ny = dy / dist;

    // Relative velocity along normal
    const rvx = b1.vx - b2.vx;
    const rvy = b1.vy - b2.vy;
    const velAlongNormal = rvx * nx + rvy * ny;

    // Do not resolve if velocities are already separating
    if (velAlongNormal <= 0) return false;

    // Combined restitution (elasticity)
    const e = Math.min(b1.restitution, b2.restitution);

    // Compute impulse scalar j
    const invMass1 = b1.mass > 0 ? 1 / b1.mass : 0;
    const invMass2 = b2.mass > 0 ? 1 / b2.mass : 0;
    const totalInvMass = invMass1 + invMass2;
    if (totalInvMass === 0) return false;

    const j = (-(1 + e) * velAlongNormal) / totalInvMass;

    // Apply impulse to velocities
    b1.vx += j * invMass1 * nx;
    b1.vy += j * invMass1 * ny;
    b2.vx -= j * invMass2 * nx;
    b2.vy -= j * invMass2 * ny;

    // Positional correction to resolve penetration
    const penetration = minDist - dist;
    const percent = 0.8; // Baumgarte penetration slack factor
    const correctionX = (penetration / totalInvMass) * percent * nx;
    const correctionY = (penetration / totalInvMass) * percent * ny;

    b1.x -= correctionX * invMass1;
    b1.y -= correctionY * invMass1;
    b2.x += correctionX * invMass2;
    b2.y += correctionY * invMass2;

    return true;
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** In an inelastic collision, total kinetic energy decreases. Where does the missing kinetic energy go?
   - **Answer:** The missing macroscopic kinetic energy is converted into microscopic internal thermal energy (random vibration of molecules), plastic deformation (permanent bending of lattice bonds), and acoustic energy (sound waves radiating into the air).
2. **Question:** Can a body have zero momentum but non-zero kinetic energy?
   - **Answer:** For an individual point particle, no ($p = mv = 0 \implies v = 0 \implies K = 0$). But for a **system of particles**, absolutely yes! For example, two identical masses moving directly toward each other with velocities $+v$ and $-v$ have total momentum $\vec{P} = mv - mv = 0$, but total kinetic energy $K = \frac{1}{2}mv^2 + \frac{1}{2}mv^2 = mv^2 > 0$.
3. **Question:** Why do modern rockets need multiple stages to achieve orbit?
   - **Answer:** By the Tsiolkovsky equation, $\Delta v = v_e \ln(m_0/m_f)$. To reach Earth orbital velocity ($\sim 8 \text{ km/s}$), a single-stage rocket would need a fuel-to-dry-mass fraction exceeding $90\%$, which is structurally impossible. Staging discards heavy empty fuel tanks and engines during flight, resetting the dry mass $m_f$ and allowing higher final velocity.
