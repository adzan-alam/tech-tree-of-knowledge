# Numerical Integration: Euler, Semi-Implicit Euler, and Verlet Methods

## 1. Conceptual Foundations & Intuitive Overview
Newton's Second Law defines a second-order ordinary differential equation (ODE):

$$ \frac{d^2\vec{x}}{dt^2} = \vec{a}(\vec{x}, \vec{v}, t) = \frac{\vec{F}(\vec{x}, \vec{v}, t)}{m} $$

For simple systems (like constant gravity without drag), analytical calculus yields exact formulas. But for complex simulations (multiple interacting bodies, springs, air drag, non-linear contacts), **no closed-form analytical equation exists**. We must integrate numerically step-by-step.

---

## 2. Mathematical Formalism

### 2.1 Explicit (Forward) Euler Method
The most naive method uses the current velocity to update position:

$$ \vec{x}_{k+1} = \vec{x}_k + \vec{v}_k \Delta t $$
$$ \vec{v}_{k+1} = \vec{v}_k + \vec{a}_k \Delta t $$

**Fatal Flaw:** Explicit Euler is non-symplectic. For oscillating systems (like springs, orbits, or bouncing pendulums), it continually injects artificial energy into the system. A simulated orbiting planet will spiral outward into infinity!

### 2.2 Semi-Implicit (Symplectic) Euler Method
By simply using the *new* velocity $\vec{v}_{k+1}$ to update position:

$$ \vec{v}_{k+1} = \vec{v}_k + \vec{a}(\vec{x}_k) \Delta t $$
$$ \vec{x}_{k+1} = \vec{x}_k + \vec{v}_{k+1} \Delta t $$

This tiny modification makes the integrator **symplectic**: it preserves phase-space volume and bounds energy drift over millions of steps.

### 2.3 Velocity Verlet Integration
Derived from Taylor series expansions of position forward and backward in time, Velocity Verlet is a second-order integrator ($O(\Delta t^2)$ global accuracy) that evaluates position and velocity at the same time step:

1. **Half-step velocity:**
   $$ \vec{v}_{k + 1/2} = \vec{v}_k + \frac{1}{2} \vec{a}_k \Delta t $$
2. **Full-step position:**
   $$ \vec{x}_{k+1} = \vec{x}_k + \vec{v}_{k + 1/2} \Delta t = \vec{x}_k + \vec{v}_k \Delta t + \frac{1}{2} \vec{a}_k (\Delta t)^2 $$
3. **Compute new acceleration from new positions:**
   $$ \vec{a}_{k+1} = \frac{\vec{F}(\vec{x}_{k+1})}{m} $$
4. **Complete the velocity step:**
   $$ \vec{v}_{k+1} = \vec{v}_{k + 1/2} + \frac{1}{2} \vec{a}_{k+1} \Delta t $$

---

## 3. Worked Examples

### Example 1: Harmonic Oscillator Comparison
A mass-spring system obeys $a(x) = -\omega^2 x$ with $\omega = 1 \text{ rad/s}$, initial $x_0 = 1, v_0 = 0$.
With $\Delta t = 0.5 \text{ s}$:

**Explicit Euler Step 1:**
- $a_0 = -(1)^2 (1) = -1$
- $x_1 = x_0 + v_0 \Delta t = 1 + 0 = 1.0$
- $v_1 = v_0 + a_0 \Delta t = 0 + (-1)(0.5) = -0.5$
- Total Energy $E_1 = \frac{1}{2} k x_1^2 + \frac{1}{2} m v_1^2 = \frac{1}{2}(1) + \frac{1}{2}(0.25) = 0.625$
- Notice: Initial energy $E_0 = 0.50$. Energy *increased* by 25% in a single step!

**Semi-Implicit Euler Step 1:**
- $v_1 = v_0 + a_0 \Delta t = 0 + (-1)(0.5) = -0.5$
- $x_1 = x_0 + v_1 \Delta t = 1.0 + (-0.5)(0.5) = 0.75$
- Energy $E_1 = \frac{1}{2}(0.75^2) + \frac{1}{2}(-0.5^2) = 0.28125 + 0.125 = 0.406$
- Energy oscillates stably rather than exploding to infinity!

---

## 4. Interactive Simulation & Practical Computation

```javascript
// Production-grade Velocity Verlet step
function velocityVerletStep(body, forcesCallback, dt) {
  // 1. Calculate current acceleration
  const a0 = forcesCallback(body.pos).scale(1 / body.mass);

  // 2. Update position
  body.pos.x += body.vel.x * dt + 0.5 * a0.x * dt * dt;
  body.pos.y += body.vel.y * dt + 0.5 * a0.y * dt * dt;

  // 3. Calculate new acceleration at new position
  const a1 = forcesCallback(body.pos).scale(1 / body.mass);

  // 4. Update velocity using average acceleration
  body.vel.x += 0.5 * (a0.x + a1.x) * dt;
  body.vel.y += 0.5 * (a0.y + a1.y) * dt;
}
```
