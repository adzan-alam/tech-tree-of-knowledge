# CHAPTER 12: Production TypeScript Kinematics Engine & Civilizational Grand Gauntlet

> "What we have grasped by pure thought and mathematical deduction must now be forged into executable computational algorithms. In the sovereign civilization, theory and code are one: the equation that predicts the trajectory of a star is identical to the machine instruction that guides the craft."
> — *The Sovereign Engineering Codex*

---

### Learning Objectives
After mastering this capstone chapter, the sovereign student will be able to:
1. Architect and implement a production-grade, zero-dependency, strictly typed TypeScript simulation engine (`KinematicsEngine`) capable of solving both analytical and numerical kinematic problems.
2. Encapsulate 2D vector kinematics, Galilean frame transformations, relative navigation, and circular curvature tracking into robust object-oriented software patterns.
3. Implement a high-accuracy 4th-Order Runge-Kutta (RK4) differential equation solver for coupled non-linear ballistic trajectories with quadratic aerodynamic drag.
4. Construct an automated inverse targeting solver that resolves dual low/high ballistic firing angles and tests reachability against the Parabola of Safety envelope.
5. Conquer the **Civilizational Grand Gauntlet**: 10 comprehensive, multi-stage capstone physics problems spanning every concept from Class 6 foundations to undergraduate mechanics, complete with unabridged mathematical derivations and step-by-step numerical solutions.

---

## 12.1 The Architectural Vision of the Kinematics Engine

Throughout the first eleven chapters of this treatise, we explored the mathematical and physical foundations of motion: from Galileo’s reference frames and 1D acceleration to 2D vector calculus, parabolic ballistics, inclined planes, relative Galilean transformations, Frenet-Serret curvature, and calculus-based aerodynamic drag.

In modern aerospace guidance, autonomous robotics, defense engineering, and game physics engines, these analytical principles are translated directly into software. 

The `KinematicsEngine` is designed around four core architectural pillars:
1. **Mathematical Purity:** Zero external libraries or runtime dependencies. All vector algebra, trigonometric inversions, root-finding, and calculus integration are implemented from first principles using standard ECMAScript math.
2. **Strict Type Safety:** Exhaustive TypeScript interfaces for spatial coordinates, kinematic vectors, targeting solutions, and simulation steps, eliminating runtime type errors.
3. **Dual Analytical & Numerical Modality:** Closed-form exact equations are used where analytical solutions exist (vacuum trajectories, incline range, relative velocity), while the 4th-order Runge-Kutta (RK4) integrator is deployed where non-linear drag couples the equations of motion.
4. **Defensive Validation:** Comprehensive boundary checking protects against non-physical inputs (negative gravity, imaginary roots, zero radii, division by zero).

```
                      +---------------------------------------+
                      |           KinematicsEngine            |
                      +---------------------------------------+
                                          |
         +--------------------------------+--------------------------------+
         |                                |                                |
         v                                v                                v
+------------------+            +-------------------+            +-------------------+
| Analytical Core  |            |  Targeting Solver |            |   RK4 Simulator   |
| - 1D Equations   |            | - Dual Angle Root |            | - Quadratic Drag  |
| - Level/Cliff R  |            | - Parabola Safety |            | - Time-Stepping   |
| - Incline Range  |            | - Line-of-Sight   |            | - Trajectory Path |
| - Relative Motion|            | - CBDR Collision  |            | - Terminal Speed  |
+------------------+            +-------------------+            +-------------------+
```

---

## 12.2 Production-Grade TypeScript Source Code

Below is the complete, unabridged production implementation of the `KinematicsEngine`. It is fully typed and ready to run in any modern Node.js, Deno, Bun, or browser environment.

```typescript
/**
 * @file KinematicsEngine.ts
 * @description Sovereign 1D & 2D Kinematics and Ballistic Simulation Engine
 * @version 3.0.0
 * @license MIT
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface KinematicState1D {
  position: number;
  velocity: number;
  acceleration: number;
}

export interface ProjectileVacuumResult {
  initialSpeed: number;
  launchAngleDeg: number;
  timeToApex: number;
  totalFlightTime: number;
  maxHeight: number;
  horizontalRange: number;
  impactVelocity: Vector2D;
}

export interface TargetingSolution {
  isReachable: boolean;
  maxReachableHeightAtTarget: number;
  lowAngleDeg?: number;
  highAngleDeg?: number;
  lowAngleFlightTime?: number;
  highAngleFlightTime?: number;
}

export interface InclineSolution {
  slopeAngleDeg: number;
  launchAngleDeg: number;
  optimalLaunchAngleDeg: number;
  flightTime: number;
  rangeAlongIncline: number;
  maxRangeAlongIncline: number;
  impactCoords: Vector2D;
}

export interface RelativeMotionSolution {
  relativeInitialPosition: Vector2D;
  relativeVelocity: Vector2D;
  timeOfClosestApproach: number;
  distanceOfClosestApproach: number;
  isCBDRCollision: boolean;
}

export interface CurvatureState {
  speed: number;
  tangentialAcceleration: number;
  centripetalAcceleration: number;
  totalAcceleration: number;
  radiusOfCurvature: number;
}

export interface SimulationTrajectoryPoint {
  time: number;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  speed: number;
}

export class KinematicsEngine {
  public static readonly DEFAULT_GRAVITY = 9.80665; // Standard Earth gravity (m/s^2)

  /**
   * Solve 1D constant acceleration kinematics for final position and velocity.
   */
  public static solve1D(x0: number, v0: number, a: number, t: number): KinematicState1D {
    if (t < 0) {
      throw new RangeError("Elapsed time t cannot be negative.");
    }
    const velocity = v0 + a * t;
    const position = x0 + v0 * t + 0.5 * a * t * t;
    return { position, velocity, acceleration: a };
  }

  /**
   * Analytical vacuum projectile motion over flat or cliff terrain.
   */
  public static solveVacuumProjectile(
    v0: number,
    angleDeg: number,
    initialHeight: number = 0,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): ProjectileVacuumResult {
    if (v0 < 0) throw new RangeError("Initial speed v0 cannot be negative.");
    if (initialHeight < 0) throw new RangeError("Initial height cannot be negative.");
    if (g <= 0) throw new RangeError("Gravity g must be strictly positive.");

    const thetaRad = (angleDeg * Math.PI) / 180.0;
    const v0x = v0 * Math.cos(thetaRad);
    const v0y = v0 * Math.sin(thetaRad);

    const timeToApex = v0y > 0 ? v0y / g : 0;
    const apexHeight = initialHeight + (v0y > 0 ? (v0y * v0y) / (2 * g) : 0);

    // Asymmetric flight time formula: y(T) = h + v0y*T - 0.5*g*T^2 = 0
    const discriminant = v0y * v0y + 2 * g * initialHeight;
    const totalFlightTime = (v0y + Math.sqrt(discriminant)) / g;

    const horizontalRange = v0x * totalFlightTime;

    const impactVx = v0x;
    const impactVy = v0y - g * totalFlightTime;

    return {
      initialSpeed: v0,
      launchAngleDeg: angleDeg,
      timeToApex,
      totalFlightTime,
      maxHeight: apexHeight,
      horizontalRange,
      impactVelocity: { x: impactVx, y: impactVy }
    };
  }

  /**
   * Inverse Ballistic Targeting Solver: Given target (X, Y) and muzzle speed v0,
   * calculates low and high launch angles and checks the Parabola of Safety.
   */
  public static solveInverseTargeting(
    targetX: number,
    targetY: number,
    v0: number,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): TargetingSolution {
    if (targetX <= 0) throw new RangeError("Target X coordinate must be positive.");
    if (v0 <= 0) throw new RangeError("Muzzle velocity v0 must be positive.");

    const v0Sq = v0 * v0;
    const v0Quad = v0Sq * v0Sq;

    // Safety parabola envelope ceiling at targetX: Y_envelope = v0^2/(2g) - g*X^2/(2v0^2)
    const maxReachableHeight = v0Sq / (2 * g) - (g * targetX * targetX) / (2 * v0Sq);

    // Quadratic discriminant: Delta = v0^4 - 2*g*Y*v0^2 - g^2*X^2
    const discriminant = v0Quad - 2 * g * targetY * v0Sq - g * g * targetX * targetX;

    if (discriminant < 0) {
      return {
        isReachable: false,
        maxReachableHeightAtTarget: maxReachableHeight
      };
    }

    const sqrtDelta = Math.sqrt(discriminant);
    const tanLow = (v0Sq - sqrtDelta) / (g * targetX);
    const tanHigh = (v0Sq + sqrtDelta) / (g * targetX);

    const lowAngleRad = Math.atan(tanLow);
    const highAngleRad = Math.atan(tanHigh);

    const lowAngleDeg = (lowAngleRad * 180.0) / Math.PI;
    const highAngleDeg = (highAngleRad * 180.0) / Math.PI;

    const tLow = targetX / (v0 * Math.cos(lowAngleRad));
    const tHigh = targetX / (v0 * Math.cos(highAngleRad));

    return {
      isReachable: true,
      maxReachableHeightAtTarget: maxReachableHeight,
      lowAngleDeg,
      highAngleDeg,
      lowAngleFlightTime: tLow,
      highAngleFlightTime: tHigh
    };
  }

  /**
   * Ballistic trajectory across an inclined slope of angle alpha.
   */
  public static solveInclineBallistics(
    v0: number,
    launchAngleDeg: number,
    slopeAngleDeg: number,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): InclineSolution {
    if (launchAngleDeg <= slopeAngleDeg) {
      throw new Error("Launch angle must be strictly greater than the slope angle.");
    }

    const theta = (launchAngleDeg * Math.PI) / 180.0;
    const alpha = (slopeAngleDeg * Math.PI) / 180.0;

    // Rotated frame time of flight: T = 2*v0*sin(theta - alpha) / (g*cos(alpha))
    const flightTime = (2 * v0 * Math.sin(theta - alpha)) / (g * Math.cos(alpha));

    // Universal Incline Range Formula:
    // d = v0^2 / (g*cos^2(alpha)) * [ sin(2*theta - alpha) - sin(alpha) ]
    const cosAlpha = Math.cos(alpha);
    const rangeAlongIncline =
      ((v0 * v0) / (g * cosAlpha * cosAlpha)) *
      (Math.sin(2 * theta - alpha) - Math.sin(alpha));

    // Optimal launch angle: theta* = 45 deg + alpha / 2
    const optimalAngleDeg = 45.0 + slopeAngleDeg / 2.0;

    // Max range at optimal angle: d_max = v0^2 / (g * (1 + sin(alpha)))
    const maxRange = (v0 * v0) / (g * (1 + Math.sin(alpha)));

    const impactX = rangeAlongIncline * Math.cos(alpha);
    const impactY = rangeAlongIncline * Math.sin(alpha);

    return {
      slopeAngleDeg,
      launchAngleDeg,
      optimalLaunchAngleDeg: optimalAngleDeg,
      flightTime,
      rangeAlongIncline,
      maxRangeAlongIncline: maxRange,
      impactCoords: { x: impactX, y: impactY }
    };
  }

  /**
   * Relative Motion & Constant Bearing Decreasing Range (CBDR) Collision Solver.
   */
  public static solveRelativeMotion(
    r10: Vector2D,
    v1: Vector2D,
    r20: Vector2D,
    v2: Vector2D
  ): RelativeMotionSolution {
    // Relative position r_rel = r2 - r1
    const rx = r20.x - r10.x;
    const ry = r20.y - r10.y;

    // Relative velocity v_rel = v2 - v1
    const vx = v2.x - v1.x;
    const vy = v2.y - v1.y;

    const vRelSq = vx * vx + vy * vy;
    if (vRelSq === 0) {
      const initialDist = Math.sqrt(rx * rx + ry * ry);
      return {
        relativeInitialPosition: { x: rx, y: ry },
        relativeVelocity: { x: 0, y: 0 },
        timeOfClosestApproach: 0,
        distanceOfClosestApproach: initialDist,
        isCBDRCollision: initialDist < 1e-4
      };
    }

    // Dot product r0_rel . v_rel
    const rDotV = rx * vx + ry * vy;

    // Time of closest approach: t_min = - (r0 . v) / |v|^2
    const tMin = -rDotV / vRelSq;

    let closestDist: number;
    if (tMin <= 0) {
      // Craft are diverging; closest distance was at t = 0
      closestDist = Math.sqrt(rx * rx + ry * ry);
    } else {
      const closestX = rx + vx * tMin;
      const closestY = ry + vy * tMin;
      closestDist = Math.sqrt(closestX * closestX + closestY * closestY);
    }

    const isCBDR = tMin > 0 && closestDist < 1e-3;

    return {
      relativeInitialPosition: { x: rx, y: ry },
      relativeVelocity: { x: vx, y: vy },
      timeOfClosestApproach: Math.max(0, tMin),
      distanceOfClosestApproach: closestDist,
      isCBDRCollision: isCBDR
    };
  }

  /**
   * Frenet-Serret Curvature and Acceleration Decomposition.
   */
  public static computeCurvatureState(
    velocity: Vector2D,
    acceleration: Vector2D
  ): CurvatureState {
    const vSq = velocity.x * velocity.x + velocity.y * velocity.y;
    const speed = Math.sqrt(vSq);

    if (speed < 1e-9) {
      const totalAcc = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y);
      return {
        speed: 0,
        tangentialAcceleration: totalAcc,
        centripetalAcceleration: 0,
        totalAcceleration: totalAcc,
        radiusOfCurvature: Infinity
      };
    }

    // Tangential unit vector: u_t = v / |v|
    // Tangential acceleration: a_t = a . u_t = (a_x*v_x + a_y*v_y) / speed
    const aTangential = (acceleration.x * velocity.x + acceleration.y * velocity.y) / speed;

    // 2D Cross product magnitude: |v x a| = |v_x*a_y - v_y*a_x|
    const crossProduct = Math.abs(velocity.x * acceleration.y - velocity.y * acceleration.x);

    // Centripetal / normal acceleration: a_n = |v x a| / speed
    const aCentripetal = crossProduct / speed;

    const totalAcceleration = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y);

    // Radius of curvature: rho = speed^2 / a_n = speed^3 / |v x a|
    const radiusOfCurvature = aCentripetal > 1e-9 ? (speed * speed) / aCentripetal : Infinity;

    return {
      speed,
      tangentialAcceleration: aTangential,
      centripetalAcceleration: aCentripetal,
      totalAcceleration,
      radiusOfCurvature
    };
  }

  /**
   * 4th-Order Runge-Kutta (RK4) Numerical Integrator for 2D Ballistics with Drag.
   * Acceleration: a = [-c * v * vx, -g - c * v * vy]
   */
  public static simulateRK4WithDrag(
    v0: number,
    angleDeg: number,
    dragCoeffPerMeter: number,
    initialHeight: number = 0,
    dt: number = 0.01,
    g: number = KinematicsEngine.DEFAULT_GRAVITY
  ): SimulationTrajectoryPoint[] {
    const thetaRad = (angleDeg * Math.PI) / 180.0;
    let x = 0.0;
    let y = initialHeight;
    let vx = v0 * Math.cos(thetaRad);
    let vy = v0 * Math.sin(thetaRad);
    let t = 0.0;

    const trajectory: SimulationTrajectoryPoint[] = [];

    const getDerivatives = (vxIn: number, vyIn: number) => {
      const currentSpeed = Math.sqrt(vxIn * vxIn + vyIn * vyIn);
      const ax = -dragCoeffPerMeter * currentSpeed * vxIn;
      const ay = -g - dragCoeffPerMeter * currentSpeed * vyIn;
      return { ax, ay };
    };

    // Initial state
    const initialDeriv = getDerivatives(vx, vy);
    trajectory.push({
      time: t,
      position: { x, y },
      velocity: { x: vx, y: vy },
      acceleration: { x: initialDeriv.ax, y: initialDeriv.ay },
      speed: Math.sqrt(vx * vx + vy * vy)
    });

    while (y >= 0.0 && t < 1000.0) {
      // Stage 1
      const k1 = getDerivatives(vx, vy);

      // Stage 2
      const vx_k2 = vx + 0.5 * dt * k1.ax;
      const vy_k2 = vy + 0.5 * dt * k1.ay;
      const k2 = getDerivatives(vx_k2, vy_k2);

      // Stage 3
      const vx_k3 = vx + 0.5 * dt * k2.ax;
      const vy_k3 = vy + 0.5 * dt * k2.ay;
      const k3 = getDerivatives(vx_k3, vy_k3);

      // Stage 4
      const vx_k4 = vx + dt * k3.ax;
      const vy_k4 = vy + dt * k3.ay;
      const k4 = getDerivatives(vx_k4, vy_k4);

      // Weighted acceleration updates
      const axEff = (k1.ax + 2 * k2.ax + 2 * k3.ax + k4.ax) / 6.0;
      const ayEff = (k1.ay + 2 * k2.ay + 2 * k3.ay + k4.ay) / 6.0;

      // Position update using velocity midpoint
      const vxAvg = (vx + vx_k4) * 0.5;
      const vyAvg = (vy + vy_k4) * 0.5;

      x += vxAvg * dt;
      y += vyAvg * dt;
      vx += axEff * dt;
      vy += ayEff * dt;
      t += dt;

      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      trajectory.push({
        time: t,
        position: { x, y: Math.max(0, y) },
        velocity: { x: vx, y: vy },
        acceleration: { x: axEff, y: ayEff },
        speed: currentSpeed
      });
    }

    return trajectory;
  }
}
```

---

## 12.3 The Civilizational Grand Gauntlet: Ten Capstone Problems

Below are the 10 Civilizational Grand Gauntlet problems. Every problem is accompanied by a complete, unabridged step-by-step arithmetic derivation with full units and physical sanity checks.

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Gauntlet 1: Autonomous Maglev Braking with Jerk and Drag
**Problem:** An experimental maglev train traveling at $v_0 = 100.0\,\text{m/s}$ activates a two-phase emergency braking procedure:
- **Phase 1 (Jerk-Limited Deceleration):** For the first $t_1 = 4.00\,\text{s}$, the deceleration increases linearly from zero with constant jerk $j = -0.750\,\text{m/s}^3$ ($a(t) = -0.750 t$).
- **Phase 2 (Linear Drag Braking):** At $t = 4.00\,\text{s}$, aerodynamic flaps and eddy brakes deploy, producing a drag deceleration $a(v) = -0.0800 v\,\text{s}^{-1}$.
Calculate the total distance traversed by the train from the initiation of braking until its speed drops to $v_f = 5.00\,\text{m/s}$.

#### Solution
**Step 1: Kinematics of Phase 1 ($0 \le t \le 4.00\,\text{s}$)**
$$a(t) = -0.750 t\,\text{m/s}^2$$
$$v(t) = v_0 + \int_0^t -0.750 \tau\,d\tau = 100.0 - 0.375 t^2\,\text{m/s}$$
At $t_1 = 4.00\,\text{s}$:
$$v_1 = v(4.00) = 100.0 - 0.375(4.00)^2 = 100.0 - 0.375(16.0) = 100.0 - 6.00 = 94.00\,\text{m/s}$$

Distance traversed in Phase 1:
$$x_1 = \int_0^{4.00} (100.0 - 0.375 \tau^2)\,d\tau = \left[ 100.0 \tau - 0.125 \tau^3 \right]_0^{4.00} = 100.0(4.00) - 0.125(64.0) = 400.0 - 8.00 = 392.00\,\text{m}$$

**Step 2: Kinematics of Phase 2 ($v_1 = 94.00\,\text{m/s} \to v_f = 5.00\,\text{m/s}$)**
The acceleration is $a(v) = -k v$ with $k = 0.0800\,\text{s}^{-1}$.
Using $v \frac{dv}{dx} = -k v \implies dv = -k\,dx$:
$$\int_{v_1}^{v_f} dv' = -k \int_0^{x_2} dx' \implies v_f - v_1 = -k x_2$$
$$x_2 = \frac{v_1 - v_f}{k} = \frac{94.00\,\text{m/s} - 5.00\,\text{m/s}}{0.0800\,\text{s}^{-1}} = \frac{89.00}{0.0800} = 1112.50\,\text{m}$$

**Step 3: Total braking distance**
$$x_{\text{total}} = x_1 + x_2 = 392.00\,\text{m} + 1112.50\,\text{m} = 1504.50\,\text{m} \approx 1.50\,\text{km}$$

---

### Gauntlet 2: The Two-Stage Sounding Rocket Ascent & Coast
**Problem:** A meteorological sounding rocket launches vertically from rest from sea level.
- **Powered Ascent:** The motor burns for $t_b = 25.0\,\text{s}$, producing a net upward acceleration $a_{\text{net}} = +14.0\,\text{m/s}^2$ (including gravity).
- **Free-Flight Coast:** At $t_b = 25.0\,\text{s}$, the motor shuts down and the rocket coasts upward under gravity ($g = 9.80\,\text{m/s}^2$).
1. What is the burnout altitude $y_b$ and burnout speed $v_b$?
2. What is the maximum peak altitude $Y_{\text{max}}$ reached by the rocket?
3. What is the total time elapsed from launch until the rocket impacts the ocean?

#### Solution
**Step 1: Powered phase ($t = 0 \to 25.0\,\text{s}$)**
$$v_b = a_{\text{net}} t_b = 14.0\,\text{m/s}^2 \times 25.0\,\text{s} = 350.0\,\text{m/s}$$
$$y_b = \frac{1}{2} a_{\text{net}} t_b^2 = 0.5 \times 14.0 \times (25.0)^2 = 7.0 \times 625.0 = 4375.0\,\text{m}$$

**Step 2: Coasting phase to apex**
During coasting, $a = -g = -9.80\,\text{m/s}^2$.
$$t_{\text{coast}} = \frac{v_b}{g} = \frac{350.0\,\text{m/s}}{9.80\,\text{m/s}^2} = 35.714\,\text{s}$$
Coasting distance:
$$h_{\text{coast}} = \frac{v_b^2}{2g} = \frac{(350.0)^2}{2 \times 9.80} = \frac{122500.0}{19.60} = 6250.0\,\text{m}$$
Maximum altitude:
$$Y_{\text{max}} = y_b + h_{\text{coast}} = 4375.0\,\text{m} + 6250.0\,\text{m} = 10625.0\,\text{m} \approx 10.63\,\text{km}$$

**Step 3: Descent from apex to ocean**
Free fall from $Y_{\text{max}} = 10625.0\,\text{m}$:
$$Y_{\text{max}} = \frac{1}{2} g t_{\text{fall}}^2 \implies t_{\text{fall}} = \sqrt{\frac{2 \times 10625.0}{9.80}} = \sqrt{\frac{21250.0}{9.80}} = \sqrt{2168.367} = 46.566\,\text{s}$$

Total flight time:
$$T_{\text{total}} = t_b + t_{\text{coast}} + t_{\text{fall}} = 25.000 + 35.714 + 46.566 = 107.28\,\text{s} \approx 1\,\text{min}\,47.3\,\text{s}$$

---

### Gauntlet 3: Inverse Targeting Over an Intermediate Mountain Ridge
**Problem:** A mortar battery at $(0,0)$ must strike an enemy redoubt located at $(X_{\text{target}}, Y_{\text{target}}) = (1800.0\,\text{m}, 120.0\,\text{m})$. An intervening mountain ridge of height $H_{\text{ridge}} = 350.0\,\text{m}$ is located at $X_{\text{ridge}} = 800.0\,\text{m}$. The mortar muzzle speed is $v_0 = 160.0\,\text{m/s}$.
1. Find both the low-angle and high-angle firing solutions.
2. Determine which solution safely clears the mountain ridge.
3. Compute the ridge clearance margin for the viable trajectory.

#### Solution
**Step 1: Targeting solutions**
$$v_0 = 160.0\,\text{m/s} \implies v_0^2 = 25600.0\,\text{m}^2/\text{s}^2$$
$$k = \frac{g X_{\text{target}}^2}{2 v_0^2} = \frac{9.80 \times (1800.0)^2}{2 \times 25600.0} = \frac{9.80 \times 3240000}{51200} = \frac{31752000}{51200} = 620.15625\,\text{m}$$
$$Y + k = 120.0 + 620.156 = 740.156\,\text{m}$$
$$\Delta = X^2 - 4 k (Y + k) = (1800.0)^2 - 4(620.15625)(740.15625) = 3240000 - 2480.625 \times 740.15625 = 3240000 - 1836050.2 = 1403949.8\,\text{m}^2$$
$$\sqrt{\Delta} = \sqrt{1403949.8} = 1184.8839\,\text{m}$$

Low Angle:
$$\tan\theta_{\text{low}} = \frac{1800.0 - 1184.8839}{2 \times 620.15625} = \frac{615.1161}{1240.3125} = 0.495936 \implies \theta_{\text{low}} = 26.378^\circ \approx 26.4^\circ$$
High Angle:
$$\tan\theta_{\text{high}} = \frac{1800.0 + 1184.8839}{1240.3125} = \frac{2984.8839}{1240.3125} = 2.406558 \implies \theta_{\text{high}} = 67.436^\circ \approx 67.4^\circ$$

**Step 2: Trajectory height at ridge ($X = 800.0\,\text{m}$)**
Trajectory equation: $y(X) = X \tan\theta - \frac{g X^2}{2 v_0^2} (1 + \tan^2\theta)$.
$$\frac{g X^2}{2 v_0^2} = \frac{9.80 \times (800.0)^2}{2 \times 25600.0} = \frac{9.80 \times 640000}{51200} = \frac{6272000}{51200} = 122.50\,\text{m}$$

For Low Angle ($\tan\theta = 0.495936, 1 + \tan^2\theta = 1 + 0.24595 = 1.24595$):
$$y_{\text{low}}(800) = 800.0(0.495936) - 122.50(1.24595) = 396.75 - 152.63 = 244.12\,\text{m}$$
Since $y_{\text{low}}(800) = 244.12\,\text{m} < 350.0\,\text{m}$, **the low-angle shot impacts the mountain ridge and fails!**

For High Angle ($\tan\theta = 2.406558, 1 + \tan^2\theta = 1 + 5.79152 = 6.79152$):
$$y_{\text{high}}(800) = 800.0(2.406558) - 122.50(6.79152) = 1925.25 - 831.96 = 1093.29\,\text{m}$$
Since $y_{\text{high}}(800) = 1093.29\,\text{m} > 350.0\,\text{m}$, the high-angle shot soars far above the ridge!

**Step 3: Clearance margin**
$$\text{Margin} = 1093.29\,\text{m} - 350.0\,\text{m} = +743.29\,\text{m}$$

---

### Gauntlet 4: Incline Intercept with Moving Downhill Target
**Problem:** A defensive laser/projectile cannon at the base of a ski slope ($\alpha = 20.0^\circ$ incline) launches an interceptor with muzzle velocity $v_0 = 70.0\,\text{m/s}$ at angle $\theta = 50.0^\circ$ above the horizontal. At the instant of launch ($t = 0$), a robotic skier located at distance $D_0 = 350.0\,\text{m}$ up the slope skims down the slope toward the launcher with constant speed $u = 12.0\,\text{m/s}$.
1. Find the flight time of the interceptor before hitting the incline surface.
2. Determine where on the slope the interceptor strikes.
3. Determine whether the interceptor strikes the moving skier (calculate miss distance along the slope).

#### Solution
**Step 1: Flight time to incline surface**
Using the rotated coordinate system:
$$\beta = \theta - \alpha = 50.0^\circ - 20.0^\circ = 30.0^\circ$$
$$a_{y'} = g \cos\alpha = 9.80 \cos(20.0^\circ) = 9.80 \times 0.939693 = 9.2090\,\text{m/s}^2$$
$$v_{0y'} = v_0 \sin\beta = 70.0 \sin(30.0^\circ) = 35.00\,\text{m/s}$$
$$T = \frac{2 v_{0y'}}{a_{y'}} = \frac{2 \times 35.00}{9.2090} = 7.6013\,\text{s} \approx 7.60\,\text{s}$$

**Step 2: Landing position of projectile along incline ($d_p$)**
$$v_{0x'} = v_0 \cos\beta = 70.0 \cos(30.0^\circ) = 70.0 \times 0.866025 = 60.6218\,\text{m/s}$$
$$a_{x'} = g \sin\alpha = 9.80 \sin(20.0^\circ) = 9.80 \times 0.342020 = 3.3518\,\text{m/s}^2$$
$$d_p = v_{0x'} T - \frac{1}{2} a_{x'} T^2 = 60.6218(7.6013) - 0.5(3.3518)(7.6013)^2 = 460.805 - 1.6759(57.7798) = 460.805 - 96.833 = 363.97\,\text{m}$$

**Step 3: Position of skier at $t = T$**
The skier moves downhill toward the origin from $D_0 = 350.0\,\text{m}$ at $u = 12.0\,\text{m/s}$:
$$d_s(T) = D_0 - u T = 350.0 - 12.0(7.6013) = 350.0 - 91.216 = 258.78\,\text{m}$$

Miss distance:
$$\Delta d = d_p - d_s = 363.97\,\text{m} - 258.78\,\text{m} = +105.19\,\text{m}$$
The projectile overshoots the skier by $105.2\,\text{m}$.

---

### Gauntlet 5: Three-Body Maritime CBDR Intercept
**Problem:** At $t = 0$:
- Vessel A is at $(0, 0)$ steaming due East at $v_A = 12.0\,\text{knots}$.
- Vessel B is at $(8.00\,\text{NM}, 6.00\,\text{NM})$ steaming due South at $v_B = 16.0\,\text{knots}$.
1. Compute the relative position and velocity vectors of Vessel B relative to Vessel A.
2. Determine the time of closest approach $t_{\text{min}}$ and the minimum miss distance $D_{\text{min}}$.
3. Does Vessel B satisfy the CBDR collision condition?

#### Solution
**Step 1: Relative vectors**
$$\vec{r}_{0,\text{rel}} = \vec{r}_B - \vec{r}_A = 8.00\,\hat{i} + 6.00\,\hat{j}\,\text{NM}$$
$$\vec{v}_A = 12.0\,\hat{i} + 0\,\hat{j}\,\text{knots}$$
$$\vec{v}_B = 0\,\hat{i} - 16.0\,\hat{j}\,\text{knots}$$
$$\vec{v}_{\text{rel}} = \vec{v}_B - \vec{v}_A = -12.0\,\hat{i} - 16.0\,\hat{j}\,\text{knots}$$

**Step 2: Closest approach**
$$\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}} = (8.00 \times -12.0) + (6.00 \times -16.0) = -96.0 - 96.0 = -192.0\,\text{NM}^2/\text{hr}$$
$$|\vec{v}_{\text{rel}}|^2 = (-12.0)^2 + (-16.0)^2 = 144.0 + 256.0 = 400.0\,\text{knots}^2$$
$$t_{\text{min}} = -\frac{\vec{r}_{0,\text{rel}} \cdot \vec{v}_{\text{rel}}}{|\vec{v}_{\text{rel}}|^2} = -\frac{-192.0}{400.0} = 0.480\,\text{hours} = 28.8\,\text{minutes}$$

Relative position at $t = 0.480\,\text{hr}$:
$$\vec{r}_{\text{rel}}(0.480) = [8.00 - 12.0(0.480)]\,\hat{i} + [6.00 - 16.0(0.480)]\,\hat{j} = (8.00 - 5.76)\,\hat{i} + (6.00 - 7.68)\,\hat{j} = 2.24\,\hat{i} - 1.68\,\hat{j}\,\text{NM}$$
$$D_{\text{min}} = \sqrt{(2.24)^2 + (-1.68)^2} = \sqrt{5.0176 + 2.8224} = \sqrt{7.8400} = 2.80\,\text{NM}$$

**Step 3: CBDR Assessment**
Since $D_{\text{min}} = 2.80\,\text{NM} > 0$, the vessels will not collide. The relative velocity vector does not point directly antiparallel to $\vec{r}_{0,\text{rel}}$ ($8/6 = 1.33 \ne 12/16 = 0.75$).

---

### Gauntlet 6: Frenet-Serret Curvature of a Hypersonic Re-entry Trajectory
**Problem:** A spacecraft re-entering the upper atmosphere follows a 2D descent path parameterized by:
$$x(t) = 3000.0 t, \quad y(t) = 80000.0 e^{-0.0150 t} \quad (\text{meters, for } t \ge 0)$$
At $t = 40.0\,\text{s}$, determine:
1. The velocity vector $\vec{v}$ and instantaneous speed.
2. The acceleration vector $\vec{a}$.
3. The tangential and normal components of acceleration ($a_t, a_n$).
4. The instantaneous radius of curvature $\rho$.

#### Solution
**Step 1: Velocity at $t = 40.0\,\text{s}$**
$$v_x(t) = 3000.0\,\text{m/s} \implies v_x(40) = 3000.0\,\text{m/s}$$
$$v_y(t) = \frac{d}{dt}\left(80000.0 e^{-0.0150 t}\right) = -1200.0 e^{-0.0150 t}$$
At $t = 40.0\,\text{s}$:
$$-0.0150 \times 40.0 = -0.600 \implies e^{-0.600} = 0.548812$$
$$v_y(40) = -1200.0 \times 0.548812 = -658.574\,\text{m/s}$$
Speed:
$$v = \sqrt{(3000.0)^2 + (-658.574)^2} = \sqrt{9000000 + 433720} = \sqrt{9433720} = 3071.44\,\text{m/s}$$

**Step 2: Acceleration at $t = 40.0\,\text{s}$**
$$a_x(t) = 0\,\text{m/s}^2$$
$$a_y(t) = \frac{d}{dt}\left(-1200.0 e^{-0.0150 t}\right) = +18.00 e^{-0.0150 t}$$
$$a_y(40) = 18.00 \times 0.548812 = +9.8786\,\text{m/s}^2$$
$$\vec{a} = 0\,\hat{i} + 9.8786\,\hat{j}\,\text{m/s}^2$$

**Step 3: Tangential and normal acceleration**
$$a_t = \frac{\vec{a} \cdot \vec{v}}{v} = \frac{0(3000.0) + (9.8786 \times -658.574)}{3071.44} = \frac{-6505.79}{3071.44} = -2.118\,\text{m/s}^2$$
Cross product:
$$|\vec{v} \times \vec{a}| = |v_x a_y - v_y a_x| = |3000.0 \times 9.8786 - (-658.574 \times 0)| = 29635.8\,\text{m}^2/\text{s}^3$$
$$a_n = \frac{|\vec{v} \times \vec{a}|}{v} = \frac{29635.8}{3071.44} = 9.6488\,\text{m/s}^2 \approx 9.65\,\text{m/s}^2$$

**Step 4: Radius of curvature**
$$\rho = \frac{v^2}{a_n} = \frac{(3071.44)^2}{9.6488} = \frac{9433744}{9.6488} = 977,712\,\text{m} \approx 977.7\,\text{km}$$

---

### Gauntlet 7: Railgun Launch Through Stratified Atmosphere
**Problem:** An electromagnetic hypervelocity projectile of mass $m = 5.00\,\text{kg}$ is launched vertically upward at $v_0 = 2000.0\,\text{m/s}$. The atmospheric density decays exponentially with altitude: $\rho(y) = \rho_0 e^{-y / H_{\text{scale}}}$ with $\rho_0 = 1.20\,\text{kg/m}^3$ and $H_{\text{scale}} = 8000.0\,\text{m}$. The quadratic drag parameter is $c(y) = c_0 e^{-y / H_{\text{scale}}}$ with $c_0 = 5.00 \times 10^{-5}\,\text{m}^{-1}$.
Assuming the projectile exits the dense lower atmosphere into space before reversing direction, write the non-linear differential equation and compute the speed loss $\Delta v$ across the first $y = 1000.0\,\text{m}$ interval using the average density approximation.

#### Solution
**Step 1: Differential equation**
$$v \frac{dv}{dy} = -g - c_0 e^{-y / H_{\text{scale}}} v^2$$

**Step 2: Mean drag parameter over first $1000\,\text{m}$**
At $y = 0$: $c = 5.00 \times 10^{-5}\,\text{m}^{-1}$.
At $y = 1000\,\text{m}$: $e^{-1000 / 8000} = e^{-0.125} = 0.8825 \implies c(1000) = 4.41 \times 10^{-5}\,\text{m}^{-1}$.
$$\bar{c} \approx \frac{5.00 + 4.41}{2} \times 10^{-5} = 4.705 \times 10^{-5}\,\text{m}^{-1}$$

**Step 3: Speed loss calculation**
Since $g \ll \bar{c} v^2$ at $2000\,\text{m/s}$ ($\bar{c} v^2 = 4.705 \times 10^{-5} \times 4 \times 10^6 = 188.2\,\text{m/s}^2 \gg 9.8$):
$$v \frac{dv}{dy} \approx -\bar{c} v^2 \implies \frac{dv}{v} = -\bar{c}\,dy$$
$$\ln\left(\frac{v_1}{v_0}\right) = -\bar{c} \Delta y = -4.705 \times 10^{-5} \times 1000.0 = -0.04705$$
$$v_1 = v_0 e^{-0.04705} = 2000.0 \times 0.95404 = 1908.08\,\text{m/s}$$
$$\Delta v = 2000.0 - 1908.08 = 91.92\,\text{m/s}$$

---

### Gauntlet 8: Acoustic Well-Depth Problem with 2D Wind Drift
**Problem:** A stone is dropped from rest into a deep vertical ventilation shaft. A horizontal crosswind inside the shaft blows with constant velocity $u = 3.00\,\text{m/s}$. The total time elapsed between releasing the stone and hearing the sound of impact is $T_{\text{total}} = 5.40\,\text{s}$. Speed of sound in air is $v_s = 340.0\,\text{m/s}$.
1. Calculate the exact vertical depth $h$ of the shaft.
2. Determine the horizontal displacement of the stone at impact.

#### Solution
**Step 1: Vertical depth equation**
Let $t_1$ be fall time and $t_2$ be acoustic return time:
$$t_1 + t_2 = T_{\text{total}} = 5.40\,\text{s}$$
$$h = \frac{1}{2} g t_1^2 = 4.90 t_1^2$$
$$t_2 = \frac{h}{v_s} = \frac{4.90 t_1^2}{340.0} = 0.0144118 t_1^2$$

Substitute into the time sum:
$$0.0144118 t_1^2 + t_1 - 5.40 = 0$$
Using the quadratic formula:
$$t_1 = \frac{-1.00 + \sqrt{1.00^2 - 4(0.0144118)(-5.40)}}{2(0.0144118)} = \frac{-1.00 + \sqrt{1.00 + 0.311295}}{0.0288235} = \frac{-1.00 + \sqrt{1.311295}}{0.0288235} = \frac{-1.00 + 1.145118}{0.0288235} = \frac{0.145118}{0.0288235} = 5.0347\,\text{s}$$

Vertical depth:
$$h = 4.90 (5.0347)^2 = 4.90 \times 25.3483 = 124.21\,\text{m}$$

Check acoustic return time:
$$t_2 = \frac{124.21}{340.0} = 0.3653\,\text{s}$$
$$t_1 + t_2 = 5.0347 + 0.3653 = 5.400\,\text{s}$$. Exact match.

**Step 2: Horizontal displacement**
$$x = u t_1 = 3.00\,\text{m/s} \times 5.0347\,\text{s} = 15.10\,\text{m}$$

---

### Gauntlet 9: High-Precision RK4 Ballistics with Quadratic Drag
**Problem:** An artillery shell is fired at $v_0 = 300.0\,\text{m/s}$ at $\theta = 45.0^\circ$ through air with $c = 0.00010\,\text{m}^{-1}$.
1. What is the theoretical vacuum range $R_{\text{vac}}$?
2. Set up the coupled RK4 differential equations.
3. Compute the velocity vector at $t = 1.00\,\text{s}$ using RK4 with $\Delta t = 1.00\,\text{s}$.

#### Solution
**Step 1: Vacuum range**
$$R_{\text{vac}} = \frac{v_0^2 \sin(2\theta)}{g} = \frac{(300.0)^2 \sin(90.0^\circ)}{9.80} = \frac{90000.0}{9.80} = 9183.67\,\text{m} \approx 9.18\,\text{km}$$

**Step 2: Coupled equations**
$$v_{0x} = v_{0y} = 300.0 \cos(45^\circ) = 212.132\,\text{m/s}$$
$$\frac{dv_x}{dt} = -0.00010 \sqrt{v_x^2 + v_y^2}\,v_x$$
$$\frac{dv_y}{dt} = -9.80 - 0.00010 \sqrt{v_x^2 + v_y^2}\,v_y$$

**Step 3: RK4 step with $\Delta t = 1.00\,\text{s}$**
Stage 1:
$$v = 300.0\,\text{m/s}$$
$$k_{1,x} = -0.00010 \times 300.0 \times 212.132 = -6.3640\,\text{m/s}^2$$
$$k_{1,y} = -9.80 - 6.3640 = -16.1640\,\text{m/s}^2$$

Stage 2:
$$v_{x,2} = 212.132 + 0.5(-6.3640) = 212.132 - 3.182 = 208.950\,\text{m/s}$$
$$v_{y,2} = 212.132 + 0.5(-16.1640) = 212.132 - 8.082 = 204.050\,\text{m/s}$$
$$v_2 = \sqrt{(208.950)^2 + (204.050)^2} = \sqrt{43660.1 + 41636.4} = \sqrt{85296.5} = 292.056\,\text{m/s}$$
$$k_{2,x} = -0.00010 \times 292.056 \times 208.950 = -6.1025\,\text{m/s}^2$$
$$k_{2,y} = -9.80 - (0.00010 \times 292.056 \times 204.050) = -9.80 - 5.9594 = -15.7594\,\text{m/s}^2$$

Stage 3:
$$v_{x,3} = 212.132 + 0.5(-6.1025) = 209.081\,\text{m/s}$$
$$v_{y,3} = 212.132 + 0.5(-15.7594) = 204.252\,\text{m/s}$$
$$v_3 = \sqrt{(209.081)^2 + (204.252)^2} = \sqrt{43714.9 + 41718.9} = \sqrt{85433.8} = 292.291\,\text{m/s}$$
$$k_{3,x} = -0.00010 \times 292.291 \times 209.081 = -6.1112\,\text{m/s}^2$$
$$k_{3,y} = -9.80 - (0.00010 \times 292.291 \times 204.252) = -9.80 - 5.9701 = -15.7701\,\text{m/s}^2$$

Stage 4:
$$v_{x,4} = 212.132 + 1.0(-6.1112) = 206.021\,\text{m/s}$$
$$v_{y,4} = 212.132 + 1.0(-15.7701) = 196.362\,\text{m/s}$$
$$v_4 = \sqrt{(206.021)^2 + (196.362)^2} = \sqrt{42444.7 + 38558.0} = \sqrt{81002.7} = 284.610\,\text{m/s}$$
$$k_{4,x} = -0.00010 \times 284.610 \times 206.021 = -5.8636\,\text{m/s}^2$$
$$k_{4,y} = -9.80 - (0.00010 \times 284.610 \times 196.362) = -9.80 - 5.5886 = -15.3886\,\text{m/s}^2$$

Weighted acceleration updates:
$$k_{x,\text{eff}} = \frac{1}{6} \left[ -6.3640 + 2(-6.1025) + 2(-6.1112) - 5.8636 \right] = \frac{1}{6} \left[ -36.6550 \right] = -6.1092\,\text{m/s}^2$$
$$k_{y,\text{eff}} = \frac{1}{6} \left[ -16.1640 + 2(-15.7594) + 2(-15.7701) - 15.3886 \right] = \frac{1}{6} \left[ -94.6116 \right] = -15.7686\,\text{m/s}^2$$

Velocity at $t = 1.00\,\text{s}$:
$$v_x(1.00) = 212.132 - 6.1092(1.00) = 206.02\,\text{m/s}$$
$$v_y(1.00) = 212.132 - 15.7686(1.00) = 196.36\,\text{m/s}$$

---

### Gauntlet 10: Multi-Body Orbital Hyperbolic Flyby Kinematics
**Problem:** A deep space reconnaissance probe performs an unpowered planetary flyby. In the planetocentric reference frame, the probe's trajectory is a hyperbola:
$$r(\theta) = \frac{p}{1 + e \cos\theta}$$
with semi-latus rectum $p = 1.80 \times 10^7\,\text{m}$ and eccentricity $e = 1.50$.
At periapsis ($\theta = 0^\circ$), the probe passes at its minimum altitude with speed $v_{\text{peri}} = 12000.0\,\text{m/s}$.
1. Compute the periapsis radius $r_{\text{peri}}$.
2. Using the Frenet-Serret osculating curvature relation, compute the probe's centripetal acceleration at periapsis.
3. Compute the gravitational acceleration $g_{\text{peri}} = \mu / r_{\text{peri}}^2$ and verify that $a_c = g_{\text{peri}}$.

#### Solution
**Step 1: Periapsis radius**
At $\theta = 0^\circ$:
$$r_{\text{peri}} = \frac{p}{1 + e \cos(0^\circ)} = \frac{p}{1 + e} = \frac{1.80 \times 10^7\,\text{m}}{1 + 1.50} = \frac{1.80 \times 10^7}{2.50} = 7.20 \times 10^6\,\text{m} = 7200.0\,\text{km}$$

**Step 2: Radius of curvature at periapsis**
For any conic section in polar form $r = \frac{p}{1 + e \cos\theta}$, the radius of curvature at the periapsis vertex is identically equal to the semi-latus rectum $p$:
$$\rho_{\text{peri}} = p = 1.80 \times 10^7\,\text{m}$$

Centripetal acceleration:
$$a_c = \frac{v_{\text{peri}}^2}{\rho_{\text{peri}}} = \frac{(12000.0\,\text{m/s})^2}{1.80 \times 10^7\,\text{m}} = \frac{1.44 \times 10^8}{1.80 \times 10^7} = 8.00\,\text{m/s}^2$$

**Step 3: Verification with orbital mechanics**
In celestial mechanics, the semi-latus rectum satisfies $p = \frac{h^2}{\mu}$, where $h$ is specific angular momentum:
$$h = r_{\text{peri}} v_{\text{peri}} = (7.20 \times 10^6) \times (1.20 \times 10^4) = 8.64 \times 10^{10}\,\text{m}^2/\text{s}$$
$$\mu = \frac{h^2}{p} = \frac{(8.64 \times 10^{10})^2}{1.80 \times 10^7} = \frac{7.46496 \times 10^{21}}{1.80 \times 10^7} = 4.1472 \times 10^{14}\,\text{m}^3/\text{s}^2$$

The gravitational acceleration at periapsis is:
$$g_{\text{peri}} = \frac{\mu}{r_{\text{peri}}^2} = \frac{4.1472 \times 10^{14}}{(7.20 \times 10^6)^2} = \frac{4.1472 \times 10^{14}}{5.184 \times 10^{13}} = 8.00\,\text{m/s}^2$$

Notice the magnificent harmony:
$$a_c \equiv g_{\text{peri}} = 8.00\,\text{m/s}^2$$
Pure differential kinematics and Newton’s celestial gravitation merge in complete, unbreakable unity.
