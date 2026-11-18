# Differential Calculus: Rates of Change and Derivatives

## 1. Conceptual Foundations & Intuitive Overview
In everyday life, motion is rarely uniform. A car accelerates from a red light, a ball slows down as it rises against gravity, and currents surge. While average velocity over an interval $\Delta t$ is straightforward ($\frac{\Delta x}{\Delta t}$), how do we define the speed of an object at an *exact instant in time*?

The answer is the **derivative**: the limit of average rates of change as the elapsed time interval approaches zero.

---

## 2. Mathematical Formalism

### 2.1 Formal Limit Definition
For a real-valued function $f(x)$, the derivative $f'(x)$ (or $\frac{df}{dx}$) at a point $x$ is defined as:

$$ f'(x) = \frac{df}{dx} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x} $$

Geometrically, this represents the slope of the tangent line to the curve $y = f(x)$ at $(x, f(x))$.

### 2.2 Core Differentiation Rules
For differentiable functions $f(x), g(x)$ and constant $c \in \mathbb{R}$:
1. **Power Rule:**
   $$ \frac{d}{dx}[x^n] = n x^{n-1}, \quad \forall n \in \mathbb{R} $$
2. **Constant Multiple Rule:**
   $$ \frac{d}{dx}[c f(x)] = c \frac{df}{dx} $$
3. **Sum and Difference Rule:**
   $$ \frac{d}{dx}[f(x) \pm g(x)] = \frac{df}{dx} \pm \frac{dg}{dx} $$

### 2.3 Physical Interpretation in Kinematics
If $x(t)$ represents the position of a particle along an axis as a function of time $t$:
- **Instantaneous Velocity $v(t)$:** The first time derivative of position:
  $$ v(t) = \frac{dx}{dt} = \dot{x}(t) $$
- **Instantaneous Acceleration $a(t)$:** The first time derivative of velocity (second time derivative of position):
  $$ a(t) = \frac{dv}{dt} = \frac{d^2x}{dt^2} = \ddot{x}(t) $$

---

## 3. Worked Examples

### Example 1: Trajectory Analysis
A body moves along a 1D coordinate line according to the cubic position function:
$$ x(t) = 2t^3 - 9t^2 + 12t + 4 \quad (x \text{ in meters, } t \text{ in seconds}) $$

1. Find the velocity function $v(t)$.
2. Determine at what times the particle is instantaneously at rest ($v(t) = 0$).
3. Find the acceleration $a(t)$ at $t = 3 \text{ s}$.

**Solution:**
1. Differentiating with respect to $t$ using the power rule:
   $$ v(t) = \frac{dx}{dt} = 2(3t^2) - 9(2t) + 12(1) + 0 = 6t^2 - 18t + 12 \text{ m/s} $$
2. Setting $v(t) = 0$:
   $$ 6(t^2 - 3t + 2) = 0 \implies 6(t - 1)(t - 2) = 0 $$
   The particle is at rest at $t = 1 \text{ s}$ and $t = 2 \text{ s}$.
3. Differentiating velocity to obtain acceleration:
   $$ a(t) = \frac{dv}{dt} = 12t - 18 \text{ m/s}^2 $$
   At $t = 3 \text{ s}$:
   $$ a(3) = 12(3) - 18 = 36 - 18 = 18 \text{ m/s}^2 $$

---

## 4. Interactive Simulation & Practical Computation

In numerical simulations, when analytical derivatives are unavailable, we compute finite-difference approximations:

```javascript
// Central finite difference numerical derivative
function numericalDerivative(f, x, h = 1e-5) {
  return (f(x + h) - f(x - h)) / (2 * h);
}

// Example: Test on f(x) = x^3 at x = 2 (Analytical: 3 * 2^2 = 12)
const f = (x) => Math.pow(x, 3);
console.log(numericalDerivative(f, 2)); // ~12.00000000001
```
