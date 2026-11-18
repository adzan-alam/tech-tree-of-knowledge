# 1D and 2D Kinematics: The Description of Motion

## 1. Conceptual Foundations & Intuitive Overview
Kinematics is the branch of classical mechanics that describes the motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion.

Key scalar vs. vector distinctions:
- **Position ($\vec{r}$):** Location relative to an origin (vector).
- **Displacement ($\Delta \vec{r} = \vec{r}_f - \vec{r}_i$):** Straight-line net change in position (vector).
- **Velocity ($\vec{v} = \frac{d\vec{r}}{dt}$):** Rate of change of displacement (vector), whereas speed is magnitude $\|\vec{v}\|$.
- **Acceleration ($\vec{a} = \frac{d\vec{v}}{dt}$):** Rate of change of velocity (vector).

---

## 2. Mathematical Formalism

### 2.1 One-Dimensional Constant Acceleration Equations
When acceleration $a$ is constant across time interval $t \in [0, t]$:

$$ v(t) = v_0 + a t $$
$$ x(t) = x_0 + v_0 t + \frac{1}{2} a t^2 $$
$$ v(t)^2 = v_0^2 + 2 a (x(t) - x_0) $$
$$ x(t) - x_0 = \frac{v_0 + v(t)}{2} t $$

### 2.2 Two-Dimensional Projectile Motion
Galileo discovered that **orthogonal components of motion are completely independent**. Under uniform gravitational acceleration $\vec{g} = (0, -g)$ with no air resistance:

$$ \vec{a}(t) = \begin{bmatrix} a_x \\ a_y \end{bmatrix} = \begin{bmatrix} 0 \\ -g \end{bmatrix} $$

Integrating with initial velocity $\vec{v}_0 = (v_0 \cos\theta, v_0 \sin\theta)$:
- **Horizontal Axis (Constant Velocity):**
  $$ v_x(t) = v_0 \cos\theta $$
  $$ x(t) = x_0 + (v_0 \cos\theta) t $$
- **Vertical Axis (Constant Acceleration $-g$):**
  $$ v_y(t) = v_0 \sin\theta - g t $$
  $$ y(t) = y_0 + (v_0 \sin\theta) t - \frac{1}{2} g t^2 $$

Eliminating $t$ yields the parabolic path equation:
$$ y(x) = (\tan\theta) x - \frac{g}{2 v_0^2 \cos^2\theta} x^2 $$

---

## 3. Worked Examples

### Example 1: Cannon Projectile
A projectile is launched from ground level ($y_0 = 0$) at $v_0 = 20 \text{ m/s}$ and $\theta = 45^\circ$. Taking $g = 9.8 \text{ m/s}^2$:
1. Calculate time of flight $T$.
2. Calculate total horizontal distance (range $R$).

**Solution:**
1. At landing $y(T) = 0$:
   $$ (v_0 \sin 45^\circ) T - \frac{1}{2} g T^2 = 0 \implies T = \frac{2 v_0 \sin 45^\circ}{g} $$
   $$ T = \frac{2 \times 20 \times 0.7071}{9.8} = \frac{28.284}{9.8} \approx 2.886 \text{ seconds} $$
2. Range $R = v_x T = (v_0 \cos 45^\circ) T$:
   $$ R = (20 \times 0.7071) \times 2.886 = 14.142 \times 2.886 \approx 40.82 \text{ meters} $$

---

## 4. Interactive Simulation & Practical Computation

```javascript
// Discrete Euler kinematic step for a projectile
function stepProjectile(state, dt, g = 9.81) {
  return {
    x: state.x + state.vx * dt,
    y: state.y + state.vy * dt,
    vx: state.vx,             // ax = 0
    vy: state.vy - g * dt     // ay = -g
  };
}
```
