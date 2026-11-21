# Chapter 12: Production TypeScript Calculus Engine and the Civilizational Grand Gauntlet

> *"Mathematics achieved its civilizational destiny when its theoretical discoveries were transcribed into automated digital engines. When the formulas of Leibniz and Newton are encoded into typed algorithms, they cease to be ink on parchment and become the living nervous system of autonomous aircraft, physics engines, and robotics simulators."*

---

## 12.1 Engineering Philosophy: Numerical Precision on the Silicon Canvas

In physics engines, aerospace flight controllers, and graphics pipelines, differential calculus must run in real time with absolute stability. A single unhandled division by zero, unmanaged floating-point underflow, or runaway Newton iteration can crash a flight computer or corrupt an entire physics frame.

A production-grade calculus engine must adhere to four sovereign software principles:

1. **Defensive Clamping and Adaptive Step Sizing:** Step size $h$ must never drop below the hardware precision threshold ($\sim 10^{-15}$) nor exceed the curvature scale of the function.
2. **Order-Aware Stencils:** Use Central Differences ($\mathcal{O}(h^2)$) by default, reserve Backward Differences for causal real-time streams, and deploy Richardson Extrapolation ($\mathcal{O}(h^4)$) for high-precision orbit tracking.
3. **Fail-Safe Iterative Root Finding:** Newton-Raphson solvers must feature strict iteration guards, divergence checks, and fallback mechanisms when slopes vanish ($f'(x) \approx 0$).
4. **Symbolic Polynomial Autodiff:** When functions are known polynomials, perform exact algebraic differentiation on coefficient arrays, bypassing floating-point truncation entirely!

---

## 12.2 Production-Grade TypeScript `CalculusEngine`

Below is the complete, typed, zero-dependency `CalculusEngine` class ready for deployment in any browser, Node.js, or WebAssembly runtime.

```typescript
/**
 * Sovereign Civilizational Calculus Engine (SMTS-40K Standard)
 * Differential Calculus: Numerical Stencils, Polynomial Autodiff, and Root Finding
 */

export type ScalarFunction = (x: number) => number;
export type ScalarField2D = (x: number, y: number) => number;

export interface Vector2D {
  x: number;
  y: number;
}

export interface RootFindingResult {
  root: number;
  iterations: number;
  converged: boolean;
  residual: number;
}

export interface ExtremumResult {
  x: number;
  y: number;
  type: 'minimum' | 'maximum' | 'saddle' | 'inconclusive';
  firstDerivative: number;
  secondDerivative: number;
}

export class CalculusEngine {
  /** Machine epsilon for 64-bit IEEE 754 floating-point */
  public static readonly EPSILON_MACH = 2.220446049250313e-16;

  /** Optimal step size for central differences: (eps)^(1/3) ~ 1e-5 */
  public static readonly DEFAULT_CENTRAL_H = 1e-5;

  /** Optimal step size for forward/backward differences: sqrt(eps) ~ 1e-8 */
  public static readonly DEFAULT_ONELATERAL_H = 1e-8;

  /**
   * Evaluates the first derivative using the Central Difference Stencil: O(h^2)
   */
  public static centralDifference(f: ScalarFunction, x: number, h = this.DEFAULT_CENTRAL_H): number {
    const step = Math.max(Math.abs(h), 1e-12);
    return (f(x + step) - f(x - step)) / (2 * step);
  }

  /**
   * Evaluates the first derivative using Forward Difference: O(h)
   */
  public static forwardDifference(f: ScalarFunction, x: number, h = this.DEFAULT_ONELATERAL_H): number {
    const step = Math.max(Math.abs(h), 1e-12);
    return (f(x + step) - f(x)) / step;
  }

  /**
   * Evaluates the first derivative using Backward Difference (Causal Real-Time): O(h)
   */
  public static backwardDifference(f: ScalarFunction, x: number, h = this.DEFAULT_ONELATERAL_H): number {
    const step = Math.max(Math.abs(h), 1e-12);
    return (f(x) - f(x - step)) / step;
  }

  /**
   * Evaluates the second derivative (acceleration/curvature) using 3-point stencil: O(h^2)
   */
  public static secondDerivative(f: ScalarFunction, x: number, h = this.DEFAULT_CENTRAL_H): number {
    const step = Math.max(Math.abs(h), 1e-12);
    return (f(x + step) - 2 * f(x) + f(x - step)) / (step * step);
  }

  /**
   * Fourth-order accurate derivative via Richardson Extrapolation: O(h^4)
   */
  public static richardsonDerivative(f: ScalarFunction, x: number, h = 1e-3): number {
    const dH = this.centralDifference(f, x, h);
    const dHalf = this.centralDifference(f, x, h / 2);
    return (4 * dHalf - dH) / 3;
  }

  /**
   * Computes the 2D spatial gradient vector: ∇f(x, y) = <∂f/∂x, ∂f/∂y>
   */
  public static gradient2D(f: ScalarField2D, x: number, y: number, h = this.DEFAULT_CENTRAL_H): Vector2D {
    const dfdx = (f(x + h, y) - f(x - h, y)) / (2 * h);
    const dfdy = (f(x, y + h) - f(x, y - h)) / (2 * h);
    return { x: dfdx, y: dfdy };
  }

  /**
   * Finds the root f(x) = 0 using the Newton-Raphson method with quadratic convergence.
   */
  public static solveNewtonRaphson(
    f: ScalarFunction,
    initialGuess: number,
    tolerance = 1e-9,
    maxIterations = 100
  ): RootFindingResult {
    let x = initialGuess;

    for (let iter = 1; iter <= maxIterations; iter++) {
      const fx = f(x);
      const fPrime = this.centralDifference(f, x);

      // Check convergence
      if (Math.abs(fx) <= tolerance) {
        return { root: x, iterations: iter, converged: true, residual: fx };
      }

      // Safeguard against zero slope / horizontal tangent
      if (Math.abs(fPrime) < 1e-14) {
        // Perturb guess slightly to escape local flat spot
        x += tolerance * 10;
        continue;
      }

      const nextX = x - fx / fPrime;

      // Check step size convergence
      if (Math.abs(nextX - x) <= tolerance) {
        return { root: nextX, iterations: iter, converged: true, residual: f(nextX) };
      }

      x = nextX;
    }

    return { root: x, iterations: maxIterations, converged: false, residual: f(x) };
  }

  /**
   * Classifies a local stationary point using first and second derivative tests.
   */
  public static analyzeStationaryPoint(f: ScalarFunction, x: number): ExtremumResult {
    const y = f(x);
    const d1 = this.centralDifference(f, x);
    const d2 = this.secondDerivative(f, x);

    let type: ExtremumResult['type'] = 'inconclusive';

    if (Math.abs(d1) < 1e-4) {
      if (d2 > 1e-5) {
        type = 'minimum';
      } else if (d2 < -1e-5) {
        type = 'maximum';
      } else {
        type = 'saddle';
      }
    }

    return { x, y, type, firstDerivative: d1, secondDerivative: d2 };
  }

  /**
   * Exact symbolic differentiation of polynomials:
   * P(x) = c0 + c1*x + c2*x^2 + ... + cn*x^n
   * Represented as array of coefficients: [c0, c1, c2, ..., cn]
   */
  public static differentiatePolynomial(coeffs: number[]): number[] {
    if (coeffs.length <= 1) return [0];
    const derived: number[] = [];
    for (let power = 1; power < coeffs.length; power++) {
      derived.push(coeffs[power] * power);
    }
    return derived;
  }

  /**
   * Evaluates a polynomial given its coefficient array at value x.
   */
  public static evaluatePolynomial(coeffs: number[], x: number): number {
    let result = 0;
    let power = 1;
    for (let i = 0; i < coeffs.length; i++) {
      result += coeffs[i] * power;
      power *= x;
    }
    return result;
  }
}
```

---

## 12.3 The Civilizational Grand Gauntlet: Ten Capstone Problems

This gauntlet represents the highest standard of applied differential calculus. Every problem models a real-world scientific, aerospace, civil, or computational engineering scenario. Full written step-by-step arithmetic solutions follow immediately.

---

### Gauntlet Problem 1: The Mars Lander Descent Profile
A robotic spacecraft descends to the Martian surface. During final thruster burn ($t \ge 0$), its altitude in meters is given by:
$$z(t) = 180 - 30t + 2t^2 - \frac{1}{30}t^3$$
1. Find formulas for descent velocity $v(t) = z'(t)$ and descent acceleration $a(t) = z''(t)$.
2. Calculate the exact landing time $T$ when the lander touches down at the Martian surface ($z(T) = 0$).
3. What is the impact touchdown velocity at that moment?
4. Determine whether the touchdown complies with NASA soft-landing specs (impact speed $\le 3.0\text{ m/s}$).

---

### Gauntlet Problem 2: Non-Linear Hydraulic Surge Tank Oscillation
A municipal water surge tank exhibits water level oscillations modeled by:
$$h(t) = 15 + 4e^{-0.1t} \cos(0.5t)$$
meters, where $t$ is in seconds.
1. Compute the exact rate of change of water height $h'(t)$.
2. Determine the vertical velocity of the water surface at $t = 2\pi\text{ seconds}$ ($\approx 6.283\text{ s}$).
3. State whether the tank is filling or draining at that instant.

---

### Gauntlet Problem 3: Aerodynamic Glider Lift-to-Drag Maximization
The aerodynamic glide ratio (lift over drag, $L/D$) of an autonomous reconnaissance aircraft as a function of airspeed $v$ (in $\text{m/s}$) is modeled by:
$$R(v) = \frac{40v}{v^2 + 400}$$
1. Find the cruising airspeed $v^*$ that maximizes the glide ratio.
2. What is the maximum glide ratio $R_{\text{max}}$?
3. If the aircraft is currently cruising at $v = 15\text{ m/s}$, is its efficiency increasing or decreasing with speed?

---

### Gauntlet Problem 4: High-Current Electromagnetic Coil Energy Dissipation
The electric current pulse flowing through an electromagnetic launcher coil is:
$$I(t) = 1000 t^2 e^{-4t}\text{ amperes} \quad (t \ge 0)$$
The magnetic energy stored in the coil is $E(t) = \frac{1}{2} L [I(t)]^2$, where coil inductance $L = 0.05\text{ Henries}$.
1. Find the exact time $t_{\text{peak}}$ when the electric current reaches its absolute maximum.
2. What is that peak current $I_{\text{max}}$?
3. Calculate the instantaneous rate of magnetic energy change $\frac{dE}{dt}$ at $t = 0.25$ seconds.

---

### Gauntlet Problem 5: Collision Normal on an Elliptical Physics Engine Arena
In a 2D physics simulation, an elliptical retaining wall is governed by:
$$x^2 + 4y^2 = 100$$
A simulated particle strikes the wall at point $P(6, 4)$.
1. Verify that point $P(6, 4)$ lies exactly on the elliptical boundary.
2. Compute the slope of the tangent line to the wall at $P$.
3. Compute the outward normal vector $\vec{n}$ needed to resolve the elastic bounce impulse.

---

### Gauntlet Problem 6: Shockwave Density Gradient and Shock Front Inflection
The atmospheric air density across a supersonic explosion shock front is modeled by:
$$\rho(x) = \frac{1}{1 + e^{-2x}}$$
where $x$ is spatial position across the front in millimeters.
1. Compute the density gradient $\rho'(x)$ (the rate of density change).
2. Compute $\rho''(x)$ to locate the steepest point (the inflection shock center).
3. Find the spatial coordinate $x$ where the shock front is steepest, and calculate that maximum density gradient.

---

### Gauntlet Problem 7: Drone Trajectory Curvature and Centripetal Acceleration
A search-and-rescue drone executes a planar curve parameterized by:
$$\vec{r}(t) = \langle x(t), y(t) \rangle = \langle 5t^2, \ 2t^3 - 9t \rangle\text{ meters}$$
At time $t = 2$ seconds:
1. Compute the velocity vector $\vec{v}(2)$ and scalar speed $|\vec{v}(2)|$.
2. Compute the acceleration vector $\vec{a}(2)$.
3. Compute the tangential acceleration $a_t = \frac{d}{dt}|\vec{v}(t)|$ at $t = 2$.

---

### Gauntlet Problem 8: Optimal Pipeline Routing Across Divergent Terrain
A high-pressure natural gas pipeline connects an offshore drilling platform $A$ located $4\text{ km}$ offshore to an inland refinery $B$ located $10\text{ km}$ down the straight coastline and $3\text{ km}$ inland. Offshore pipeline construction costs $\$4\text{ million}$ per km, while overland construction costs $\$2\text{ million}$ per km.
Determine the landing coordinate along the coastline that minimizes total infrastructure capital expenditure.

---

### Gauntlet Problem 9: Catastrophic Cancellation Finite Difference Analysis
Using the `CalculusEngine` principles, consider $f(x) = \cos x$ at $x = 1.0$.
1. Derive the analytic Taylor expansion expression for the relative error of the forward difference stencil.
2. Given that standard IEEE 754 arithmetic loses roughly $k$ bits of precision when subtracting two numbers agreeing to $k$ bits, compute the exact $h$ where roundoff error surpasses truncation error for forward difference versus central difference.

---

### Gauntlet Problem 10: The Civilizational Capstone — Autonomous Vehicle Braking Distance
An autonomous electric vehicle equipped with active anti-lock regenerative braking decelerates on a wet highway. Its telemetry records acceleration varying linearly with speed:
$$a(v) = -0.2 v - 3.0\text{ m/s}^2$$
Using the chain rule identity $a = \frac{dv}{dt} = v \frac{dv}{dx}$:
1. Express acceleration as a differential relation involving distance $x$.
2. Compute the exact stopping distance for an initial highway speed $v_0 = 30\text{ m/s}$ ($108\text{ km/h}$).

---

## 12.4 Complete Step-by-Step Solutions to the Grand Gauntlet

---

### Solution to Gauntlet Problem 1
**1. Formulas for Velocity and Acceleration:**
Given $z(t) = 180 - 30t + 2t^2 - \frac{1}{30}t^3$:
$$v(t) = z'(t) = -30 + 4t - \frac{3}{30}t^2 = -30 + 4t - 0.1t^2\text{ m/s}$$
$$a(t) = v'(t) = 4 - 0.2t\text{ m/s}^2$$

**2. Exact Landing Time:**
Touchdown occurs when $z(T) = 0$:
$$180 - 30T + 2T^2 - \frac{1}{30}T^3 = 0$$
Multiply through by $-30$:
$$T^3 - 60T^2 + 900T - 5400 = 0$$
Notice that $(T - 30)^2 = T^2 - 60T + 900$.
Thus:
$$T(T^2 - 60T + 900) - 5400 = T(T - 30)^2 - 5400 = 0$$
Let us test $T$ near the physical landing envelope.
At $T = 10$: $10(10 - 30)^2 - 5400 = 10(-20)^2 - 5400 = 10(400) - 5400 = 4000 - 5400 = -1400$.
At $T = 8$: $z(8) = 180 - 30(8) + 2(64) - \frac{512}{30} = 180 - 240 + 128 - 17.07 = 50.93\text{ m}$.
At $T = 9$: $z(9) = 180 - 270 + 2(81) - \frac{729}{30} = -90 + 162 - 24.3 = 47.7\text{ m} \dots$
Wait, let us evaluate the roots of $T^3 - 60T^2 + 900T - 5400 = 0$ using Newton-Raphson:
Let $f(T) = T^3 - 60T^2 + 900T - 5400$, $f'(T) = 3T^2 - 120T + 900$.
Test $T_0 = 10$:
$f(10) = -1400$, $f'(10) = 300 - 1200 + 900 = 0$ (a local maximum!).
Notice $f'(T) = 3(T^2 - 40T + 300) = 3(T - 10)(T - 30) = 0 \implies$ local extrema at $T = 10$ and $T = 30$.
At $T = 30$: $f(30) = 30^3 - 60(900) + 900(30) - 5400 = 27000 - 54000 + 27000 - 5400 = -5400$.
Since $f(10) = -1400 < 0$ and $f(T) \to +\infty$ as $T \to \infty$, the real root must be $> 30$.
Wait! Check $z(0) = 180$.
At $T = 6$: $z(6) = 180 - 30(6) + 2(36) - \frac{216}{30} = 180 - 180 + 72 - 7.2 = 64.8\text{ m}$.
Let us check where $z(T) = 0$:
At $T = 30$: $z(30) = 180 - 30(30) + 2(900) - \frac{27000}{30} = 180 - 900 + 1800 - 900 = 180\text{ m}$.
Wait! Notice that $z(t)$ starts at $180$, dips to a local minimum at $t = 10$:
$$z(10) = 180 - 30(10) + 2(100) - \frac{1000}{30} = 180 - 300 + 200 - 33.33 = 46.67\text{ m}$$
Then rises back to $180\text{ m}$ at $t = 30$, and then descends toward zero for $t > 30$!
Let us find when $z(T) = 0$ for $T > 30$:
Test $T = 40$:
$$f(40) = 40^3 - 60(40^2) + 900(40) - 5400 = 64000 - 96000 + 36000 - 5400 = 4000 - 5400 = -1400$$
Test $T = 45$:
$$f(45) = 45^3 - 60(45^2) + 900(45) - 5400 = 91125 - 121500 + 40500 - 5400 = 10125 - 5400 = +4725$$
Interpolating between $40$ and $45$:
$$T \approx 40 + \frac{1400}{1400 + 4725} \times 5 = 40 + \frac{1400}{6125} \times 5 = 40 + 1.14 \approx 41.14\text{ s}$$
Refining with Newton-Raphson:
$$f(41.4) = 41.4^3 - 60(41.4^2) + 900(41.4) - 5400 \approx 70958 - 102838 + 37260 - 5400 = -20$$
$$f'(41.4) = 3(41.4^2) - 120(41.4) + 900 \approx 5142 - 4968 + 900 = 1074$$
$$T = 41.4 - \frac{-20}{1074} \approx 41.42\text{ seconds}$$

**3. Impact Touchdown Velocity:**
$$v(41.42) = -30 + 4(41.42) - 0.1(41.42)^2 = -30 + 165.68 - 171.56 = -35.88\text{ m/s}$$
**4. Compliance:**
Since $|v| = 35.88\text{ m/s} > 3.0\text{ m/s}$, the lander crashes into the surface at excessive speed. Thruster calibration must be redesigned.

---

### Solution to Gauntlet Problem 2
Given $h(t) = 15 + 4e^{-0.1t} \cos(0.5t)$:
**1. Compute $h'(t)$:**
Using product and chain rules on $u = 4e^{-0.1t}$ and $v = \cos(0.5t)$:
$$u' = 4(-0.1)e^{-0.1t} = -0.4e^{-0.1t}$$
$$v' = -\sin(0.5t) \cdot 0.5 = -0.5\sin(0.5t)$$
$$h'(t) = u' v + u v' = -0.4e^{-0.1t}\cos(0.5t) + 4e^{-0.1t}(-0.5\sin(0.5t))$$
$$h'(t) = -e^{-0.1t}[0.4\cos(0.5t) + 2.0\sin(0.5t)]$$

**2. Evaluate at $t = 2\pi \approx 6.283185$:**
$$0.5t = 0.5(2\pi) = \pi\text{ radians} \implies \cos(\pi) = -1, \quad \sin(\pi) = 0$$
$$e^{-0.1(2\pi)} = e^{-0.6283185} \approx 0.533488$$
$$h'(2\pi) = -0.533488 [0.4(-1) + 2.0(0)] = -0.533488(-0.4) = +0.2134\text{ m/s}$$

**3. State:**
Because $h'(2\pi) = +0.2134\text{ m/s} > 0$, the water level is rising; the surge tank is **filling**.

---

### Solution to Gauntlet Problem 3
Given $R(v) = \frac{40v}{v^2 + 400}$ for $v > 0$:
**1. Cruise Airspeed for Maximum Glide Ratio:**
Use quotient rule:
$$R'(v) = \frac{(v^2 + 400)\frac{d}{dv}[40v] - 40v \frac{d}{dv}[v^2 + 400]}{(v^2 + 400)^2} = \frac{(v^2 + 400)(40) - 40v(2v)}{(v^2 + 400)^2}$$
$$R'(v) = \frac{40v^2 + 16000 - 80v^2}{(v^2 + 400)^2} = \frac{16000 - 40v^2}{(v^2 + 400)^2} = \frac{40(400 - v^2)}{(v^2 + 400)^2}$$
Set $R'(v) = 0$:
$$400 - v^2 = 0 \implies v^2 = 400 \implies v^* = 20\text{ m/s}$$

**2. Maximum Glide Ratio:**
$$R_{\text{max}} = R(20) = \frac{40(20)}{20^2 + 400} = \frac{800}{400 + 400} = \frac{800}{800} = 1.000$$

**3. State at $v = 15\text{ m/s}$:**
Evaluate $R'(15)$:
$$R'(15) = \frac{40(400 - 15^2)}{(15^2 + 400)^2} = \frac{40(400 - 225)}{(225 + 400)^2} = \frac{40(175)}{625^2} = \frac{7000}{390625} \approx +0.0179 > 0$$
Since $R'(15) > 0$, efficiency is **increasing** as speed increases toward $20\text{ m/s}$.

---

### Solution to Gauntlet Problem 4
Given $I(t) = 1000 t^2 e^{-4t}$ and $E(t) = \frac{1}{2} L [I(t)]^2$ with $L = 0.05\text{ H}$:
**1. Time of Peak Current:**
Differentiate $I(t)$ using product rule:
$$I'(t) = 1000 [2t e^{-4t} + t^2(-4e^{-4t})] = 1000 t e^{-4t} (2 - 4t)$$
Set $I'(t) = 0$ for $t > 0$:
$$2 - 4t = 0 \implies 4t = 2 \implies t_{\text{peak}} = 0.5\text{ seconds}$$

**2. Peak Current:**
$$I(0.5) = 1000 (0.5)^2 e^{-4(0.5)} = 1000(0.25)e^{-2} = \frac{250}{e^2} \approx \frac{250}{7.389056} \approx 33.83\text{ amperes}$$

**3. Rate of Magnetic Energy Change at $t = 0.25\text{ s}$:**
By the chain rule:
$$\frac{dE}{dt} = \frac{d}{dt}\left[\frac{1}{2} L I^2\right] = L I(t) I'(t)$$
Evaluate at $t = 0.25$:
$$I(0.25) = 1000(0.25^2) e^{-4(0.25)} = 1000(0.0625) e^{-1} = \frac{62.5}{e} \approx 22.9928\text{ A}$$
$$I'(0.25) = 1000(0.25) e^{-1} (2 - 4(0.25)) = \frac{250}{e}(2 - 1) = \frac{250}{e} \approx 91.9699\text{ A/s}$$
$$\frac{dE}{dt} = (0.05\text{ H}) \times (22.9928\text{ A}) \times (91.9699\text{ A/s}) \approx 0.05 \times 2114.64 \approx 105.73\text{ Watts (J/s)}$$

---

### Solution to Gauntlet Problem 5
Given $x^2 + 4y^2 = 100$ and $P(6, 4)$:
**1. Verify $P(6, 4)$:**
$$6^2 + 4(4^2) = 36 + 4(16) = 36 + 64 = 100 \quad \text{(Verified)}$$

**2. Tangent Slope:**
Differentiate implicitly:
$$2x + 8y \frac{dy}{dx} = 0 \implies \frac{dy}{dx} = -\frac{2x}{8y} = -\frac{x}{4y}$$
Evaluate at $(6, 4)$:
$$m_{\text{tan}} = -\frac{6}{4(4)} = -\frac{6}{16} = -\frac{3}{8} = -0.375$$

**3. Normal Vector:**
Tangent vector direction is $\vec{t} = \langle 1, m_{\text{tan}} \rangle = \langle 1, -0.375 \rangle = \langle 8, -3 \rangle$.
The gradient vector $\nabla F = \langle 2x, 8y \rangle$ points along the outward normal:
$$\nabla F(6, 4) = \langle 2(6), 8(4) \rangle = \langle 12, 32 \rangle = 4 \langle 3, 8 \rangle$$
Normalize to unit length:
$$|\langle 3, 8 \rangle| = \sqrt{3^2 + 8^2} = \sqrt{9 + 64} = \sqrt{73} \approx 8.544$$
$$\vec{n} = \left\langle \frac{3}{\sqrt{73}}, \frac{8}{\sqrt{73}} \right\rangle \approx \langle 0.3511, \ 0.9363 \rangle$$

---

### Solution to Gauntlet Problem 6
Given $\rho(x) = \frac{1}{1 + e^{-2x}} = (1 + e^{-2x})^{-1}$:
**1. Density Gradient $\rho'(x)$:**
$$\rho'(x) = -1(1 + e^{-2x})^{-2} \cdot (-2e^{-2x}) = \frac{2e^{-2x}}{(1 + e^{-2x})^2} = 2 \rho(x)[1 - \rho(x)]$$

**2. Second Derivative $\rho''(x)$:**
$$\rho''(x) = 2 \frac{d}{dx}[\rho - \rho^2] = 2(\rho' - 2\rho \rho') = 2\rho'(1 - 2\rho)$$

**3. Steepest Coordinate:**
Inflection occurs when $\rho''(x) = 0$:
$$2\rho'(1 - 2\rho) = 0 \implies 1 - 2\rho = 0 \implies \rho = \frac{1}{2}$$
$$\frac{1}{1 + e^{-2x}} = \frac{1}{2} \implies 1 + e^{-2x} = 2 \implies e^{-2x} = 1 \implies -2x = 0 \implies x = 0\text{ mm}$$
Maximum gradient:
$$\rho'(0) = 2\left(\frac{1}{2}\right)\left(1 - \frac{1}{2}\right) = 2\left(\frac{1}{4}\right) = 0.500\text{ mm}^{-1}$$

---

### Solution to Gauntlet Problem 7
Given $\vec{r}(t) = \langle 5t^2, \ 2t^3 - 9t \rangle$:
**1. Velocity and Speed at $t = 2$:**
$$\vec{v}(t) = \langle 10t, \ 6t^2 - 9 \rangle$$
$$\vec{v}(2) = \langle 10(2), \ 6(4) - 9 \rangle = \langle 20, \ 24 - 9 \rangle = \langle 20, 15 \rangle\text{ m/s}$$
$$|\vec{v}(2)| = \sqrt{20^2 + 15^2} = \sqrt{400 + 225} = \sqrt{625} = 25.0\text{ m/s}$$

**2. Acceleration Vector at $t = 2$:**
$$\vec{a}(t) = \langle 10, \ 12t \rangle \implies \vec{a}(2) = \langle 10, 24 \rangle\text{ m/s}^2$$

**3. Tangential Acceleration $a_t$ at $t = 2$:**
Recall: $a_t = \frac{\vec{v} \cdot \vec{a}}{|\vec{v}|}$.
$$\vec{v}(2) \cdot \vec{a}(2) = (20)(10) + (15)(24) = 200 + 360 = 560$$
$$a_t = \frac{560}{25} = 22.4\text{ m/s}^2$$

---

### Solution to Gauntlet Problem 8
Offshore platform $A$ is $4\text{ km}$ offshore. Refinery $B$ is $10\text{ km}$ down-coast and $3\text{ km}$ inland.
Pipeline lands on coastline at distance $x$ from point opposite $A$ ($0 \le x \le 10$).
- Water length: $L_{\text{water}} = \sqrt{4^2 + x^2} = \sqrt{x^2 + 16}$
- Land length: $L_{\text{land}} = \sqrt{3^2 + (10 - x)^2} = \sqrt{x^2 - 20x + 109}$
- Total Cost (in millions):
  $$C(x) = 4\sqrt{x^2 + 16} + 2\sqrt{(10-x)^2 + 9}$$
Differentiate:
$$C'(x) = 4 \cdot \frac{x}{\sqrt{x^2 + 16}} - 2 \cdot \frac{10 - x}{\sqrt{(10-x)^2 + 9}} = 0$$
$$2 \cdot \frac{x}{\sqrt{x^2 + 16}} = \frac{10 - x}{\sqrt{(10-x)^2 + 9}}$$
Notice that $\frac{x}{\sqrt{x^2 + 16}} = \sin\theta_1$ and $\frac{10-x}{\sqrt{(10-x)^2 + 9}} = \sin\theta_2$!
This is Snell's Law: $4\sin\theta_1 = 2\sin\theta_2 \implies 2\sin\theta_1 = \sin\theta_2$.
Squaring:
$$\frac{4x^2}{x^2 + 16} = \frac{(10-x)^2}{(10-x)^2 + 9}$$
Let $u = 10 - x$.
Solving numerically via Newton-Raphson:
At $x = 3$:
$\frac{2(3)}{\sqrt{9 + 16}} = \frac{6}{5} = 1.20$.
$\frac{10 - 3}{\sqrt{7^2 + 9}} = \frac{7}{\sqrt{58}} \approx \frac{7}{7.6158} = 0.919$.
At $x = 2.4$:
$\frac{2(2.4)}{\sqrt{2.4^2 + 16}} = \frac{4.8}{\sqrt{21.76}} \approx \frac{4.8}{4.6648} \approx 1.029$.
$\frac{7.6}{\sqrt{7.6^2 + 9}} = \frac{7.6}{\sqrt{66.76}} \approx \frac{7.6}{8.1707} \approx 0.930$.
At $x = 2.1$:
$LHS \approx \frac{4.2}{4.5177} \approx 0.9296$.
$RHS = \frac{7.9}{\sqrt{7.9^2 + 9}} = \frac{7.9}{\sqrt{71.41}} \approx \frac{7.9}{8.450} \approx 0.9349$.
Interpolating: $x \approx 2.12\text{ km}$.
**Conclusion:** The optimal pipeline landing is located $2.12\text{ km}$ down the coastline from the point directly opposite Platform $A$.

---

### Solution to Gauntlet Problem 9
**1. Analytic Taylor Relative Error:**
For forward difference:
$$\frac{f(x+h) - f(x)}{h} = f'(x) + \frac{f''(x)}{2}h + \mathcal{O}(h^2)$$
$$\text{Absolute Error} \approx \left|\frac{f''(x)}{2}\right| h$$
$$\text{Relative Truncation Error} = \left|\frac{f''(x)}{2 f'(x)}\right| h$$
For $f(x) = \cos x$ at $x = 1$:
$f'(1) = -\sin(1) \approx -0.8415$, $f''(1) = -\cos(1) \approx -0.5403$.
$$\text{Relative Truncation Error} \approx \frac{0.5403}{2(0.8415)} h \approx 0.321 h$$

**2. Crossover Point where Roundoff Equals Truncation:**
Roundoff error from machine epsilon $\epsilon_{\text{mach}} \approx 2 \times 10^{-16}$:
- Forward Difference: $E_{\text{round}} \approx \frac{\epsilon_{\text{mach}}}{h}$.
  Equating: $\frac{f''(x)}{2} h = \frac{\epsilon_{\text{mach}}}{h} \implies h^2 = \frac{2\epsilon_{\text{mach}}}{f''(x)} \implies h^* \approx \sqrt{\epsilon_{\text{mach}}} \approx 10^{-8}$.
- Central Difference: $E_{\text{trunc}} \approx \frac{f'''(x)}{6} h^2$.
  Equating: $\frac{f'''(x)}{6} h^2 = \frac{\epsilon_{\text{mach}}}{h} \implies h^3 = \frac{6\epsilon_{\text{mach}}}{f'''(x)} \implies h^* \approx \sqrt[3]{\epsilon_{\text{mach}}} \approx 10^{-5}$.
**Conclusion:** Roundoff error overtakes truncation error at $h \approx 10^{-8}$ for forward differences and at $h \approx 10^{-5}$ for central differences.

---

### Solution to Gauntlet Problem 10
Given $a(v) = -0.2v - 3.0$ and $v_0 = 30\text{ m/s}$.
**1. Differential Relation:**
By the chain rule:
$$a = \frac{dv}{dt} = \frac{dv}{dx} \frac{dx}{dt} = v \frac{dv}{dx}$$
Therefore:
$$v \frac{dv}{dx} = -0.2v - 3.0 = -(0.2v + 3.0)$$
$$dx = \frac{v}{-(0.2v + 3.0)} dv = -\frac{v}{0.2v + 3.0} dv$$

**2. Compute Stopping Distance:**
Rewrite the integrand using long division:
$$\frac{v}{0.2v + 3} = \frac{5v}{v + 15} = \frac{5(v + 15) - 75}{v + 15} = 5 - \frac{75}{v + 15}$$
Integrate from initial velocity $v = 30$ down to rest $v = 0$:
$$X = \int_{30}^0 -\left(5 - \frac{75}{v + 15}\right) dv = \int_0^{30} \left(5 - \frac{75}{v + 15}\right) dv$$
$$X = \left[ 5v - 75 \ln(v + 15) \right]_0^{30}$$
Evaluate at upper limit $v = 30$:
$$5(30) - 75 \ln(45) = 150 - 75(3.80666) = 150 - 285.50 = -135.50$$
Evaluate at lower limit $v = 0$:
$$5(0) - 75 \ln(15) = 0 - 75(2.70805) = -203.10$$
Subtract lower from upper:
$$X = -135.50 - (-203.10) = 203.10 - 135.50 = \mathbf{67.60\text{ meters}}$$

**Conclusion:** The autonomous vehicle comes to a complete halt in exactly $67.60$ meters.
