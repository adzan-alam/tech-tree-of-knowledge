# Collision Detection and Contact Manifold Resolution

## 1. Conceptual Foundations & Intuitive Overview
In physical simulation, moving bodies must not pass through each other like ghosts. Collision handling consists of two sequential phases:
1. **Collision Detection (The Query):** Did body $A$ and body $B$ touch or overlap during this time step? If so, what is the contact normal $\hat{n}$ and the penetration depth $d$?
2. **Collision Resolution (The Response):** 
   - **Positional Correction:** Push the bodies apart so they no longer overlap.
   - **Impulse Response:** Adjust velocities according to the law of momentum conservation and the coefficient of restitution $e$.

---

## 2. Mathematical Formalism

### 2.1 Circle-Circle Collision Detection
Two circles $C_1 = (\vec{p}_1, r_1)$ and $C_2 = (\vec{p}_2, r_2)$ collide if and only if the Euclidean distance between their centers is less than the sum of their radii:

$$ \|\vec{p}_2 - \vec{p}_1\| < r_1 + r_2 $$

To avoid expensive square root computations in inner loops, we test using squared distances:
$$ (\Delta x)^2 + (\Delta y)^2 < (r_1 + r_2)^2 $$

If a collision occurs:
- **Distance:** $d = \|\vec{p}_2 - \vec{p}_1\|$
- **Penetration Depth:** $\text{penetration} = (r_1 + r_2) - d > 0$
- **Collision Normal:** $\hat{n} = \frac{\vec{p}_2 - \vec{p}_1}{d}$ (pointing from body 1 to body 2)

### 2.2 Boundary (Wall / Floor) Collisions
For a particle at $(x, y)$ with radius $r$ inside a bounding box $[0, W] \times [0, H]$:
- Floor ($y = 0$): If $y - r < 0$:
  $$ y = r, \quad v_y = -e \cdot v_y $$
- Ceiling ($y = H$): If $y + r > H$:
  $$ y = H - r, \quad v_y = -e \cdot v_y $$
- Left Wall ($x = 0$): If $x - r < 0$:
  $$ x = r, \quad v_x = -e \cdot v_x $$
- Right Wall ($x = W$): If $x + r > W$:
  $$ x = W - r, \quad v_x = -e \cdot v_x $$

### 2.3 Positional Correction (Preventing Sinking)
Without positional correction, resting objects will slowly sink into the floor or each other due to gravity (the "sinking effect").
We displace the bodies inversely proportional to their masses:

$$ \vec{p}_1 \gets \vec{p}_1 - \hat{n} \left( \text{penetration} \cdot \frac{m_2}{m_1 + m_2} \right) $$
$$ \vec{p}_2 \gets \vec{p}_2 + \hat{n} \left( \text{penetration} \cdot \frac{m_1}{m_1 + m_2} \right) $$

---

## 3. Worked Examples

### Example 1: Circle Collision Detection
- Ball 1: Position $(10, 10)$, radius $r_1 = 4 \text{ m}$
- Ball 2: Position $(16, 18)$, radius $r_2 = 7 \text{ m}$

**Solution:**
1. Distance vector $\Delta \vec{p} = (16 - 10, 18 - 10) = (6, 8)$
2. Distance $d = \sqrt{6^2 + 8^2} = \sqrt{36 + 64} = 10 \text{ m}$
3. Sum of radii $r_1 + r_2 = 4 + 7 = 11 \text{ m}$
4. Since $d = 10 < 11$, the balls are colliding!
5. Penetration depth $= 11 - 10 = 1 \text{ m}$
6. Collision normal $\hat{n} = \left(\frac{6}{10}, \frac{8}{10}\right) = (0.6, 0.8)$

---

## 4. Interactive Simulation & Practical Computation

```javascript
function handleCircleCollision(b1, b2, restitution = 0.85) {
  const dx = b2.x - b1.x;
  const dy = b2.y - b1.y;
  const distSq = dx * dx + dy * dy;
  const radSum = b1.radius + b2.radius;

  if (distSq >= radSum * radSum || distSq === 0) return;

  const dist = Math.sqrt(distSq);
  const nx = dx / dist;
  const ny = dy / dist;
  const penetration = radSum - dist;

  // 1. Positional correction (50% each for equal masses)
  const percent = 0.5;
  b1.x -= nx * penetration * percent;
  b1.y -= ny * penetration * percent;
  b2.x += nx * penetration * percent;
  b2.y += ny * penetration * percent;

  // 2. Relative velocity along normal
  const rvx = b2.vx - b1.vx;
  const rvy = b2.vy - b1.vy;
  const velAlongNormal = rvx * nx + rvy * ny;

  // Do not resolve if moving apart
  if (velAlongNormal > 0) return;

  // 3. Impulse response
  const j = (-(1 + restitution) * velAlongNormal) / (1 / b1.mass + 1 / b2.mass);
  const impulseX = j * nx;
  const impulseY = j * ny;

  b1.vx -= impulseX / b1.mass;
  b1.vy -= impulseY / b1.mass;
  b2.vx += impulseX / b2.mass;
  b2.vy += impulseY / b2.mass;
}
```
