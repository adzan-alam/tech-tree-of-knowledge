# Linear Momentum, Impulse, and Collision Dynamics

## 1. Conceptual Foundations & Intuitive Overview
The linear momentum $\vec{p}$ of an object of mass $m$ moving with velocity $\vec{v}$ represents its "quantity of motion":

$$ \vec{p} = m \vec{v} $$

When multiple objects interact, they exert forces upon one another. By Newton's Third Law, internal forces between colliding bodies are always equal in magnitude and opposite in direction ($\vec{F}_{12} = -\vec{F}_{21}$). Consequently, for any **isolated system** (where net external force is zero), the total momentum of the system is strictly **conserved**:

$$ \vec{P}_{\text{total}} = \sum_{i=1}^N \vec{p}_i = \text{constant} $$

---

## 2. Mathematical Formalism

### 2.1 The Impulse-Momentum Theorem
The time integral of force $\vec{F}(t)$ over interval $\Delta t$ is the **impulse** $\vec{J}$:

$$ \vec{J} = \int_{t_1}^{t_2} \vec{F}_{\text{net}}(t) \, dt = \Delta \vec{p} = m \vec{v}_f - m \vec{v}_i $$

### 2.2 Elastic vs. Inelastic Collisions
1. **Perfectly Elastic Collision:** Both total linear momentum AND total kinetic energy are conserved:
   $$ \vec{P}_i = \vec{P}_f \quad \text{and} \quad \sum \frac{1}{2} m_i v_{i, \text{initial}}^2 = \sum \frac{1}{2} m_i v_{i, \text{final}}^2 $$
2. **Inelastic Collision:** Momentum is conserved, but kinetic energy is partially converted into internal thermal/deformation energy.
3. **Coefficient of Restitution ($e$):**
   $$ e = -\frac{v_{2f} - v_{1f}}{v_{2i} - v_{1i}} = \frac{v_{\text{relative, final}}}{v_{\text{relative, initial}}} $$
   - $e = 1.0$: Perfectly elastic.
   - $0 < e < 1.0$: Real-world partially elastic collision.
   - $e = 0.0$: Completely inelastic (colliding bodies stick together).

### 2.3 Collision Impulse in Physics Engines
For two colliding spheres with masses $m_1, m_2$, velocities $\vec{v}_1, \vec{v}_2$, and contact normal $\hat{n}$:
Relative velocity along normal:
$$ v_{\text{rel}} = (\vec{v}_1 - \vec{v}_2) \cdot \hat{n} $$

If $v_{\text{rel}} < 0$ (approaching):
The impulse scalar $j$ is:
$$ j = \frac{-(1 + e) v_{\text{rel}}}{\frac{1}{m_1} + \frac{1}{m_2}} $$

Post-collision velocities:
$$ \vec{v}_1' = \vec{v}_1 + \frac{j}{m_1} \hat{n} $$
$$ \vec{v}_2' = \vec{v}_2 - \frac{j}{m_2} \hat{n} $$

---

## 3. Worked Examples

### Example 1: 1D Elastic Collision with Equal Masses
Sphere 1 ($m_1 = 2 \text{ kg}$) moving at $v_1 = 6 \text{ m/s}$ collides elastically ($e = 1$) head-on with Sphere 2 ($m_2 = 2 \text{ kg}$) initially at rest ($v_2 = 0 \text{ m/s}$).

**Solution:**
Using normal $\hat{n} = (1, 0)$:
$$ v_{\text{rel}} = 6 - 0 = 6 \text{ m/s} $$
$$ j = \frac{-(1 + 1)(6)}{\frac{1}{2} + \frac{1}{2}} = \frac{-12}{1} = -12 \text{ N}\cdot\text{s} $$
$$ v_1' = 6 + \frac{-12}{2} = 6 - 6 = 0 \text{ m/s} $$
$$ v_2' = 0 - \frac{-12}{2} = 0 + 6 = 6 \text{ m/s} $$
The moving sphere stops dead, transferring 100% of its momentum and kinetic energy to the target!

---

## 4. Interactive Simulation & Practical Computation

```javascript
function resolveElasticCollision(b1, b2, restitution = 0.8) {
  const dx = b2.x - b1.x;
  const dy = b2.y - b1.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return;

  // Collision normal
  const nx = dx / dist;
  const ny = dy / dist;

  // Relative velocity along normal
  const rvx = b1.vx - b2.vx;
  const rvy = b1.vy - b2.vy;
  const velAlongNormal = rvx * nx + rvy * ny;

  // Do not resolve if velocities are separating
  if (velAlongNormal < 0) return;

  // Impulse scalar
  const invMass1 = 1 / b1.mass;
  const invMass2 = 1 / b2.mass;
  const j = (-(1 + restitution) * velAlongNormal) / (invMass1 + invMass2);

  // Apply impulse
  b1.vx += j * invMass1 * nx;
  b1.vy += j * invMass1 * ny;
  b2.vx -= j * invMass2 * nx;
  b2.vy -= j * invMass2 * ny;
}
```
