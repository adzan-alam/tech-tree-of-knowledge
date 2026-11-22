# Chapter 12: Production TypeScript Momentum Engine and the Civilizational Grand Gauntlet

> "In physics, theory without computation is a dream without limbs; computation without theory is a machine without a soul. When the exact vector calculus of momentum conservation is synthesized into an unyielding, deterministic simulation engine, we construct an engine of truth that can model everything from the deflection of subatomic alpha particles to the multi-stage ascent of interplanetary rockets."  
> — Computational Physics Architecture Standard

---

## 1. Architecture of the Sovereign Momentum & Collision Engine

In this chapter, we translate the complete mathematical apparatus developed across Chapters 1 through 11 into a production-grade, zero-dependency, fully typed TypeScript engine: `MomentumCollisionEngine`.

### 1.1 Structural Capabilities of the Engine

The engine provides:
1. **Particle Dynamics:** Full 2D vector kinematics ($x, y, v_x, v_y, a_x, a_y$) with variable mass ($m(t), \dot{m}$), finite radii, and individual material properties ($e, \mu$).
2. **Meshchersky Rocket Propulsion:** Continuous propellant mass ejection producing frame-invariant reaction thrust:
   $$\vec{F}_{\text{thrust}} = \vec{v}_{\text{rel}} \frac{dm}{dt}$$
3. **Discrete Contact Solver:** Robust impulse-based contact solver supporting:
   - Circle-to-Circle glancing impacts with arbitrary mass ratios and restitution.
   - Circle-to-Wall reflections with static boundaries.
   - Coulomb tangential friction impulses (stick-slip transition).
   - Baumgarte positional stabilization to eliminate sinking and numerical penetration drift.
4. **Symplectic Integration:** Semi-implicit Euler integration guaranteeing bounded energy behavior and strict conservation of center-of-mass velocity in isolated systems.
5. **Real-Time Diagnostic Invariants:** Live calculation of total system momentum $\vec{P}_{\text{total}}$, Center-of-Mass $\vec{R}_{\text{CM}}$, total kinetic energy $K_{\text{total}}$, and Koenig internal energy $K_{\text{int}}$.

---

## 2. Complete, Zero-Dependency TypeScript Implementation

```typescript
/**
 * SOVEREIGN MASTER TREATISE STANDARD: MODULE 05
 * Production-Grade 2D Momentum, Collision & Rocketry Engine
 * 
 * Zero external dependencies. Self-contained 2D vector math,
 * impulse-based contact solver, Baumgarte stabilization,
 * Meshchersky variable-mass rocket thrusters, and diagnostic invariants.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Particle {
  id: string;
  pos: Vector2D;
  vel: Vector2D;
  force: Vector2D;
  mass: number;         // Current mass [kg]
  dryMass: number;      // Structural dry mass [kg] (for rockets)
  invMass: number;      // 1 / mass [kg^-1] (0 for static boundaries)
  radius: number;       // Geometric radius [m]
  restitution: number;  // Normal restitution coefficient e in [0, 1]
  friction: number;     // Coulomb friction coefficient mu >= 0
  
  // Rocket thruster parameters
  isRocket: boolean;
  thrustMag: number;    // Thrust magnitude [N]
  thrustDir: Vector2D;  // Unit direction of forward thrust
  exhaustVel: number;   // Relative exhaust speed v_ex [m/s]
  burnRate: number;     // Mass loss rate |dm/dt| [kg/s]
}

export interface Wall {
  id: string;
  start: Vector2D;      // Line segment start
  end: Vector2D;        // Line segment end
  normal: Vector2D;     // Unit normal pointing into simulation domain
  restitution: number;
  friction: number;
}

export interface ContactManifold {
  bodyA: Particle;
  bodyB: Particle;
  normal: Vector2D;     // Unit normal pointing from A to B
  tangent: Vector2D;    // Unit tangent orthogonal to normal
  penetration: number;  // Overlap depth [m]
  restitution: number;
  friction: number;
}

export interface DiagnosticSnapshot {
  time: number;
  totalMass: number;
  totalMomentum: Vector2D;
  centerOfMass: Vector2D;
  cmVelocity: Vector2D;
  totalKineticEnergy: number;
  cmKineticEnergy: number;
  internalKineticEnergy: number;
  activeCollisions: number;
}

export class MomentumCollisionEngine {
  public particles: Particle[] = [];
  public walls: Wall[] = [];
  public gravity: Vector2D = { x: 0.0, y: -9.80665 };
  public time: number = 0.0;
  
  // Solver configuration parameters
  public baumgarteBeta: number = 0.20;       // Positional stabilization factor
  public penetrationSlop: number = 0.002;    // Allowed overlap before correction [m]
  public velocityThreshold: number = 0.05;   // Restitution cutoff (anti-jitter) [m/s]
  public solverIterations: number = 10;      // Sequential impulse iterations

  constructor(gravity: Vector2D = { x: 0.0, y: -9.80665 }) {
    this.gravity = gravity;
  }

  // --- VECTOR MATHEMATICS PRIMITIVES ---

  public static vec(x: number, y: number): Vector2D {
    return { x, y };
  }

  public static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  public static sub(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  public static scale(v: Vector2D, s: number): Vector2D {
    return { x: v.x * s, y: v.y * s };
  }

  public static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  public static cross(a: Vector2D, b: Vector2D): number {
    return a.x * b.y - a.y * b.x;
  }

  public static magSq(v: Vector2D): number {
    return v.x * v.x + v.y * v.y;
  }

  public static mag(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  public static normalize(v: Vector2D): Vector2D {
    const len = MomentumCollisionEngine.mag(v);
    if (len < 1e-12) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  }

  // --- ENTITY CREATION ---

  public addParticle(config: {
    id: string;
    pos: Vector2D;
    vel: Vector2D;
    mass: number;
    radius: number;
    restitution?: number;
    friction?: number;
    isRocket?: boolean;
    dryMass?: number;
    exhaustVel?: number;
    burnRate?: number;
    thrustDir?: Vector2D;
  }): Particle {
    const isStatic = config.mass <= 0 || !isFinite(config.mass);
    const m = isStatic ? Infinity : config.mass;
    const invM = isStatic ? 0.0 : 1.0 / m;

    const p: Particle = {
      id: config.id,
      pos: { ...config.pos },
      vel: { ...config.vel },
      force: { x: 0, y: 0 },
      mass: m,
      dryMass: config.dryMass ?? m,
      invMass: invM,
      radius: config.radius,
      restitution: config.restitution ?? 0.80,
      friction: config.friction ?? 0.20,
      isRocket: config.isRocket ?? false,
      thrustMag: 0,
      thrustDir: config.thrustDir ? MomentumCollisionEngine.normalize(config.thrustDir) : { x: 0, y: 1 },
      exhaustVel: config.exhaustVel ?? 3000.0,
      burnRate: config.burnRate ?? 0.0
    };

    if (p.isRocket && p.burnRate > 0) {
      p.thrustMag = p.exhaustVel * p.burnRate;
    }

    this.particles.push(p);
    return p;
  }

  public addWall(id: string, start: Vector2D, end: Vector2D, normal: Vector2D, restitution: number = 0.8, friction: number = 0.2): Wall {
    const w: Wall = {
      id,
      start,
      end,
      normal: MomentumCollisionEngine.normalize(normal),
      restitution,
      friction
    };
    this.walls.push(w);
    return w;
  }

  // --- COLLISION DETECTION (NARROWPHASE) ---

  private detectCollisions(): ContactManifold[] {
    const contacts: ContactManifold[] = [];
    const count = this.particles.length;

    for (let i = 0; i < count; i++) {
      const p1 = this.particles[i];

      // Particle-to-Particle Narrowphase
      for (let j = i + 1; j < count; j++) {
        const p2 = this.particles[j];
        if (p1.invMass === 0 && p2.invMass === 0) continue;

        const delta = MomentumCollisionEngine.sub(p2.pos, p1.pos);
        const distSq = MomentumCollisionEngine.magSq(delta);
        const minDist = p1.radius + p2.radius;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);
          const normal = dist > 1e-8
            ? MomentumCollisionEngine.scale(delta, 1.0 / dist)
            : { x: 1, y: 0 };

          const tangent = { x: -normal.y, y: normal.x };
          const penetration = minDist - dist;
          const combinedRestitution = Math.min(p1.restitution, p2.restitution);
          const combinedFriction = Math.sqrt(p1.friction * p2.friction);

          contacts.push({
            bodyA: p1,
            bodyB: p2,
            normal,
            tangent,
            penetration,
            restitution: combinedRestitution,
            friction: combinedFriction
          });
        }
      }

      // Particle-to-Wall Collisions
      for (const wall of this.walls) {
        // Distance from point to line segment
        const seg = MomentumCollisionEngine.sub(wall.end, wall.start);
        const toPt = MomentumCollisionEngine.sub(p1.pos, wall.start);
        const segLenSq = MomentumCollisionEngine.magSq(seg);
        const t = Math.max(0, Math.min(1, MomentumCollisionEngine.dot(toPt, seg) / segLenSq));
        const closest = MomentumCollisionEngine.add(wall.start, MomentumCollisionEngine.scale(seg, t));
        const diff = MomentumCollisionEngine.sub(p1.pos, closest);
        const dist = MomentumCollisionEngine.mag(diff);

        if (dist < p1.radius) {
          const normal = dist > 1e-8 ? MomentumCollisionEngine.scale(diff, 1.0 / dist) : wall.normal;
          const tangent = { x: -normal.y, y: normal.x };
          const penetration = p1.radius - dist;

          // Fake a static body for the wall
          const wallBody: Particle = {
            id: wall.id,
            pos: closest,
            vel: { x: 0, y: 0 },
            force: { x: 0, y: 0 },
            mass: Infinity,
            dryMass: Infinity,
            invMass: 0,
            radius: 0,
            restitution: wall.restitution,
            friction: wall.friction,
            isRocket: false,
            thrustMag: 0,
            thrustDir: { x: 0, y: 0 },
            exhaustVel: 0,
            burnRate: 0
          };

          contacts.push({
            bodyA: p1,
            bodyB: wallBody,
            normal: MomentumCollisionEngine.scale(normal, -1), // points from p1 to wall
            tangent,
            penetration,
            restitution: Math.min(p1.restitution, wall.restitution),
            friction: Math.sqrt(p1.friction * wall.friction)
          });
        }
      }
    }

    return contacts;
  }

  // --- SEQUENTIAL IMPULSE CONTACT SOLVER ---

  private solveVelocityConstraints(contacts: ContactManifold[], dt: number): void {
    for (let iter = 0; iter < this.solverIterations; iter++) {
      for (const c of contacts) {
        const A = c.bodyA;
        const B = c.bodyB;
        const wTotal = A.invMass + B.invMass;
        if (wTotal === 0) continue;

        // Relative velocity at contact point
        const vRel = MomentumCollisionEngine.sub(A.vel, B.vel);

        // 1. NORMAL IMPULSE
        const vNormal = MomentumCollisionEngine.dot(vRel, c.normal);

        // Baumgarte velocity bias for penetration resolution
        const bias = (this.baumgarteBeta / dt) * Math.max(0, c.penetration - this.penetrationSlop);

        // Restitution threshold check (prevent micro-bouncing jitter)
        let effectiveRestitution = c.restitution;
        if (Math.abs(vNormal) < this.velocityThreshold) {
          effectiveRestitution = 0.0;
        }

        const deltaJn = (-(1.0 + effectiveRestitution) * vNormal + bias) / wTotal;

        // Apply normal impulse if bodies are closing
        if (deltaJn > 0) {
          const impulseVector = MomentumCollisionEngine.scale(c.normal, deltaJn);
          A.vel = MomentumCollisionEngine.sub(A.vel, MomentumCollisionEngine.scale(impulseVector, A.invMass));
          B.vel = MomentumCollisionEngine.add(B.vel, MomentumCollisionEngine.scale(impulseVector, B.invMass));

          // 2. TANGENTIAL COULOMB FRICTION IMPULSE
          const vRelUpdated = MomentumCollisionEngine.sub(A.vel, B.vel);
          const vTangential = MomentumCollisionEngine.dot(vRelUpdated, c.tangent);
          const jtStick = -vTangential / wTotal;

          // Coulomb cone clamping: |J_t| <= mu * J_n
          const maxFriction = c.friction * deltaJn;
          const jt = Math.max(-maxFriction, Math.min(maxFriction, jtStick));

          const frictionVector = MomentumCollisionEngine.scale(c.tangent, jt);
          A.vel = MomentumCollisionEngine.add(A.vel, MomentumCollisionEngine.scale(frictionVector, A.invMass));
          B.vel = MomentumCollisionEngine.sub(B.vel, MomentumCollisionEngine.scale(frictionVector, B.invMass));
        }
      }
    }
  }

  // --- MAIN SIMULATION STEP ---

  public step(dt: number): void {
    if (dt <= 0) return;

    // Phase 1: Apply External Forces and Rocket Thrust
    for (const p of this.particles) {
      if (p.invMass === 0) continue;

      // Reset forces
      p.force = { x: 0, y: 0 };

      // Apply environmental gravity: F = m * g
      p.force.x += p.mass * this.gravity.x;
      p.force.y += p.mass * this.gravity.y;

      // Apply Meshchersky Rocket Thrust: F_thrust = v_ex * |dm/dt|
      if (p.isRocket && p.mass > p.dryMass && p.burnRate > 0) {
        const fuelConsumed = Math.min(p.mass - p.dryMass, p.burnRate * dt);
        const currentThrust = (fuelConsumed / dt) * p.exhaustVel;

        p.force.x += currentThrust * p.thrustDir.x;
        p.force.y += currentThrust * p.thrustDir.y;

        // Decrease rocket mass
        p.mass -= fuelConsumed;
        p.invMass = 1.0 / p.mass;
      }

      // Integrate velocity (Semi-Implicit Euler Stage 1)
      p.vel.x += (p.force.x * p.invMass) * dt;
      p.vel.y += (p.force.y * p.invMass) * dt;
    }

    // Phase 2: Detect Collisions
    const contacts = this.detectCollisions();

    // Phase 3: Iteratively Resolve Velocity Impulses and Friction
    this.solveVelocityConstraints(contacts, dt);

    // Phase 4: Integrate Positions (Semi-Implicit Euler Stage 2)
    for (const p of this.particles) {
      if (p.invMass === 0) continue;
      p.pos.x += p.vel.x * dt;
      p.pos.y += p.vel.y * dt;
    }

    this.time += dt;
  }

  // --- DIAGNOSTICS & CONSERVATION LAW AUDITING ---

  public computeDiagnostics(): DiagnosticSnapshot {
    let totalMass = 0;
    let Px = 0;
    let Py = 0;
    let Rx = 0;
    let Ry = 0;
    let totalKE = 0;

    for (const p of this.particles) {
      if (p.invMass === 0) continue;
      totalMass += p.mass;
      Px += p.mass * p.vel.x;
      Py += p.mass * p.vel.y;
      Rx += p.mass * p.pos.x;
      Ry += p.mass * p.pos.y;
      totalKE += 0.5 * p.mass * MomentumCollisionEngine.magSq(p.vel);
    }

    const cmX = totalMass > 0 ? Rx / totalMass : 0;
    const cmY = totalMass > 0 ? Ry / totalMass : 0;
    const cmVx = totalMass > 0 ? Px / totalMass : 0;
    const cmVy = totalMass > 0 ? Py / totalMass : 0;

    // Koenig's Theorem Partition
    const cmKE = 0.5 * totalMass * (cmVx * cmVx + cmVy * cmVy);
    const internalKE = Math.max(0, totalKE - cmKE);

    return {
      time: this.time,
      totalMass,
      totalMomentum: { x: Px, y: Py },
      centerOfMass: { x: cmX, y: cmY },
      cmVelocity: { x: cmVx, y: cmVy },
      totalKineticEnergy: totalKE,
      cmKineticEnergy: cmKE,
      internalKineticEnergy: internalKE,
      activeCollisions: this.detectCollisions().length
    };
  }
}
```

---

## 3. The Civilizational Grand Gauntlet: 10 Capstone Physics Challenges

The Grand Gauntlet tests total mastery across the entire spectrum of momentum, collisions, center-of-mass mechanics, variable-mass systems, and computational contact physics.

---

### Gauntlet Problem 1: Optimal Multi-Stage Rocket Staging with Structural Overhead
*A three-stage orbital launch vehicle has a total initial launch mass $M_0 = 500,000\text{ kg}$ and delivers a payload $m_{\text{payload}} = 5,000\text{ kg}$ into low Earth orbit ($\Delta v_{\text{target}} = 9,500\text{ m/s}$ in vacuum). Each stage $i \in \{1, 2, 3\}$ uses identical propellant with specific impulse $I_{\text{sp}} = 340\text{ s}$ ($v_{\text{ex}} = 3,334.3\text{ m/s}$) and has a structural deadweight fraction $\epsilon = 0.080$ ($\epsilon = m_{s, i} / (m_{s, i} + m_{p, i})$). Prove that equal stage payload ratios maximize final velocity, and find the required mass distribution among the three stages.*

---

### Gauntlet Problem 2: Galperin's Billiard Algorithm for Computing the Digits of $\pi$
*Consider two point masses sliding on a frictionless 1D track with an immovable rigid vertical wall at $x = 0$. Block 1 ($m_1 = 1\text{ kg}$) is initially at rest at $x_1 = 1.0\text{ m}$. Block 2 of mass $m_2 = 100^N\text{ kg}$ approaches from the right ($x_2 = 2.0\text{ m}$) with initial velocity $v_{2i} = -1.0\text{ m/s}$. All collisions (Block 2 with Block 1, and Block 1 with the wall) are perfectly elastic ($e = 1.00$). (a) For $N = 1$ ($m_2 = 100\text{ kg}$), calculate the total number of collisions that occur before Block 2 permanently recedes to infinity. (b) For $N = 2$ ($m_2 = 10,000\text{ kg}$), state the total collision count. (c) Prove that as $m_2 / m_1 = 100^N \to \infty$, the total number of collisions $K$ is exactly $\lfloor \pi \times 10^N \rfloor$.*

---

### Gauntlet Problem 3: Two-Dimensional Billiard Cascade with Spin-Induced Friction
*Three identical smooth billiard balls ($A, B, C$) of radius $R = 3.00\text{ cm}$ and mass $m = 0.170\text{ kg}$ rest in mutual contact on a frictionless table, with $B$ and $C$ touching symmetrically behind ball $A$. Ball 0 of the identical mass and radius strikes Ball $A$ head-on with velocity $\vec{v}_0 = (6.00\,\hat{i})\text{ m/s}$. Assuming all ball-to-ball collisions have normal restitution $e = 0.900$ and zero friction, determine the post-collision velocity vectors of all four balls.*

---

### Gauntlet Problem 4: Relativistic 4-Momentum Invariance in Particle Decay
*A high-energy neutral pion $\pi^0$ (rest mass $m_\pi = 135.0\text{ MeV}/c^2$) moving along the $+x$ axis with total relativistic energy $E_\pi = 225.0\text{ MeV}$ decays in flight into two photons: $\pi^0 \to \gamma_1 + \gamma_2$. In the laboratory frame, photon 1 is emitted at an angle $\theta_1 = +30.0^\circ$ relative to the $+x$ axis. Using relativistic 4-momentum conservation, determine: (a) the energy $E_{\gamma 1}$ of the first photon, (b) the emission angle $\theta_2$ of the second photon, and (c) the energy $E_{\gamma 2}$ of the second photon.*

---

### Gauntlet Problem 5: Falling Heavy Chain Dynamic Scale Impact
*A uniform flexible chain of mass $M = 6.00\text{ kg}$ and length $L = 3.00\text{ m}$ is held vertically by its upper end with its lowest link touching a digital scale pan. At $t = 0$, the chain is released from rest. Simultaneously, an external wind provides a horizontal drag force $F_x(y) = \alpha y$ on the suspended portion, where $\alpha = 2.00\text{ N/m}$. (a) Calculate the total vertical force reading $F_y(t)$ on the scale during the fall. (b) Find the scale reading at the exact instant the top link strikes the pan. (c) Calculate the total horizontal impulse delivered to the scale.*

---

### Gauntlet Problem 6: Hypervelocity Shock Hugoniot and Planetary Impact Cratering
*A stony chondrite meteorite of density $\rho_0 = 3,200\text{ kg/m}^3$ and radius $R = 20.0\text{ m}$ strikes a basaltic planetary surface ($\rho_t = 2,900\text{ kg/m}^3$) at $v_0 = 24.0\text{ km/s}$. The shock Hugoniot for basalt is $u_s = 4.50\text{ km/s} + 1.25\,u_p$. (a) Compute the particle velocity $u_p$ and the peak shock pressure $P_{\text{shock}}$ in GPa at the impact interface. (b) Determine the total kinetic energy delivered in Megatons of TNT equivalent. (c) Using the Schmidt-Housen crater scaling law $D = 1.16 \left(\frac{E_K}{\rho_t g}\right)^{0.22} \left(\frac{\rho_i}{\rho_t}\right)^{0.31}$, estimate the final crater diameter on Earth ($g = 9.80\text{ m/s}^2$).*

---

### Gauntlet Problem 7: Multi-Body Newton's Cradle Wave Propagation
*A linear array of five identical steel spheres ($m = 0.500\text{ kg}$ each) is suspended in a Newton's Cradle. Two spheres on the left are pulled back together and released from height $h = 0.200\text{ m}$, striking the three stationary spheres at speed $v_0 = \sqrt{2gh}$. Using the contact mechanics of Hertzian elastic stress wave transmission, prove why exactly two spheres emerge from the right at speed $v_0$, rather than one sphere emerging at speed $\sqrt{2}v_0$ (which would conserve energy and momentum).*

---

### Gauntlet Problem 8: 3D Double-Slingshot Interstellar Trajectory Optimization
*A probe of mass $m = 500\text{ kg}$ leaves Earth with hyperbolic excess speed $v_{\infty 1} = 8.00\text{ km/s}$ and performs an unpowered gravity assist around Jupiter ($M_J = 1.90 \times 10^{27}\text{ kg}, R_J = 71,492\text{ km}, V_J = 13.06\text{ km/s}$). Determine the minimum flyby periapsis radius $r_p$ that maximizes the post-flyby heliocentric speed, and calculate the maximum achievable heliocentric speed $v_{\text{helio, max}}$.*

---

### Gauntlet Problem 9: The Zeno Inelastic Bouncing Ball with Acoustic Losses
*A superball of mass $m = 0.050\text{ kg}$ is dropped from height $h_0 = 1.50\text{ m}$ onto a massive stone slab. On each bounce, the coefficient of normal restitution is $e = 0.850$, except that a fixed acoustic sound radiation loss $E_{\text{sound}} = 0.0020\text{ J}$ is dissipated per impact whenever $K_{\text{impact}} > E_{\text{sound}}$. (a) Calculate the total number of bounces before the ball's kinetic energy drops below $E_{\text{sound}}$. (b) Compute the total elapsed time until the ball comes to a complete rest.*

---

### Gauntlet Problem 10: Non-Inertial Momentum Flux in a Rotating Tether Space Elevator
*A rotating space tether of length $L = 200\text{ km}$ rotates in deep space with angular velocity $\Omega = 0.020\text{ rad/s}$ about its center of mass. A climber robot of mass $m = 1,000\text{ kg}$ climbs radially outward from the hub to the tether tip at constant relative speed $v_{\text{rel}} = 50.0\text{ m/s}$. Derive the total lateral Coriolis reaction force $F_{\text{Coriolis}}(t)$ exerted by the climber on the tether, and calculate the total angular momentum transferred to the tether upon reaching the tip.*

---

## 4. Complete, Unabridged Solutions to the Civilizational Grand Gauntlet

---

### Solution to Gauntlet Problem 1
1. **Governing Multi-Stage Equations:**
   - Let $N = 3$. Total payload fraction $\Lambda = m_{\text{payload}} / M_0 = 5,000 / 500,000 = 0.0100$.
   - For identical exhaust velocities $v_{\text{ex}} = 3,334.3\text{ m/s}$ and identical structural fractions $\epsilon = 0.080$, maximum velocity occurs when each stage has an identical payload ratio $\lambda_i = \lambda = \Lambda^{1/3}$:
     $$\lambda = (0.0100)^{1/3} \approx 0.215443$$
2. **Individual Stage Mass Ratios:**
   - The stage mass ratio is:
     $$R_{m, i} = \frac{1 + \lambda}{\epsilon + \lambda} = \frac{1 + 0.215443}{0.080 + 0.215443} = \frac{1.215443}{0.295443} \approx 4.11397$$
3. **Total Velocity Increment $\Delta v_{\text{total}}$:**
   $$\Delta v_i = v_{\text{ex}} \ln(R_{m, i}) = 3,334.3 \times \ln(4.11397) = 3,334.3 \times 1.41441 \approx 4,716.0\text{ m/s}$$
   $$\Delta v_{\text{total}} = 3 \times \Delta v_i = 3 \times 4,716.0 = \mathbf{14,148\text{ m/s} = 14.15\text{ km/s}}$$
   (Surpasses the orbital requirement of $9,500\text{ m/s}$ with a massive margin!).
4. **Mass Breakdown:**
   - Stage 3 initial mass: $m_{03} = m_{\text{payload}} / \lambda = 5,000 / 0.215443 \approx 23,208\text{ kg}$.
   - Stage 2 initial mass: $m_{02} = m_{03} / \lambda = 23,208 / 0.215443 \approx 107,722\text{ kg}$.
   - Stage 1 initial mass: $m_{01} = m_{02} / \lambda = 107,722 / 0.215443 \approx \mathbf{500,000\text{ kg}}$.
   - Stage 1 wet mass: $500,000 - 107,722 = \mathbf{392,278\text{ kg}}$.
   - Stage 2 wet mass: $107,722 - 23,208 = \mathbf{84,514\text{ kg}}$.
   - Stage 3 wet mass: $23,208 - 5,000 = \mathbf{18,208\text{ kg}}$.

---

### Solution to Gauntlet Problem 2
1. **Galperin Coordinate Transformation:**
   - Rescale coordinates to circular phase space:
     $$y_1 = \sqrt{m_1} x_1, \quad y_2 = \sqrt{m_2} x_2$$
     $$u_1 = \sqrt{m_1} v_1, \quad u_2 = \sqrt{m_2} v_2$$
   - Conservation of energy:
     $$\frac{1}{2}m_1 v_1^2 + \frac{1}{2}m_2 v_2^2 = \frac{1}{2}(u_1^2 + u_2^2) = E = \text{constant}$$
   - In $(y_1, y_2)$ space, the trajectory is a series of specular ray reflections between two planar boundaries:
     - Boundary 1: Wall reflection at $x_1 = 0 \implies y_1 = 0$ (vertical axis).
     - Boundary 2: Collision between blocks at $x_1 = x_2 \implies \frac{y_1}{\sqrt{m_1}} = \frac{y_2}{\sqrt{m_2}} \implies y_2 = \sqrt{\frac{m_2}{m_1}} y_1$.
2. **Angle of the Wedge ($\alpha$):**
   $$\tan\alpha = \sqrt{\frac{m_1}{m_2}} \implies \alpha = \arctan\left(\sqrt{\frac{m_1}{m_2}}\right)$$
3. **Total Number of Reflections:**
   - Each collision corresponds to one reflection across the wedge. The total number of reflections before a ray exits the wedge of opening angle $\alpha$ is:
     $$K = \left\lfloor \frac{\pi}{\alpha} \right\rfloor$$
4. **Evaluations:**
   - **Part (a): $N = 1$ ($m_2 = 100\text{ kg}, m_1 = 1\text{ kg}$):**
     $$\tan\alpha = \sqrt{1/100} = 0.100 \implies \alpha = \arctan(0.100) \approx 0.09966865\text{ rad}$$
     $$K = \left\lfloor \frac{\pi}{0.09966865} \right\rfloor = \lfloor 31.5204 \rfloor = \mathbf{31\text{ collisions}}$$
     (The first 2 digits of $\pi = 3.14\dots$).
   - **Part (b): $N = 2$ ($m_2 = 10,000\text{ kg}$):**
     $$\tan\alpha = \sqrt{1/10,000} = 0.010 \implies \alpha \approx 0.0099996667\text{ rad}$$
     $$K = \left\lfloor \frac{\pi}{0.0099996667} \right\rfloor = \lfloor 314.159 \rfloor = \mathbf{314\text{ collisions}}$$
     (The first 3 digits of $\pi$!).
   - **Part (c): General Proof for $m_2 / m_1 = 100^N$:**
     As $N \to \infty$, $\sqrt{m_1/m_2} = 10^{-N} \ll 1$.
     Using small-angle expansion: $\alpha = \arctan(10^{-N}) = 10^{-N} - \mathcal{O}(10^{-3N})$.
     $$K = \left\lfloor \frac{\pi}{10^{-N}} \right\rfloor = \mathbf{\lfloor \pi \times 10^N \rfloor}$$
     $$\blacksquare$$

---

### Solution to Gauntlet Problem 3
1. **Geometry of the Tri-Ball Cluster:**
   - Balls $B$ and $C$ touch ball $A$. From the equilateral geometry:
     The line of centers from $A$ to $B$ makes an angle $\theta = -30.0^\circ$ with $+x$.
     The line of centers from $A$ to $C$ makes an angle $\theta = +30.0^\circ$ with $+x$.
2. **First Impact (Ball 0 strikes Ball A Head-On):**
   - $m_0 = m_A$, $e = 0.900$.
   - 1D collision:
     $$v_{0f} = \frac{1 - e}{2} v_0 = \frac{1 - 0.900}{2}(6.00) = \mathbf{+0.300\,\hat{i}\text{ m/s}}$$
     $$v_{Af} = \frac{1 + e}{2} v_0 = \frac{1 + 0.900}{2}(6.00) = +5.700\,\hat{i}\text{ m/s}$$
3. **Second Impact (Ball A strikes Balls B and C Simultaneously):**
   - Ball A delivers normal impulses $J_n$ symmetrically along $\hat{n}_B = (\cos(-30^\circ)\hat{i} + \sin(-30^\circ)\hat{j})$ and $\hat{n}_C = (\cos(30^\circ)\hat{i} + \sin(30^\circ)\hat{j})$.
   - Normal components: $\cos(30^\circ) = \frac{\sqrt{3}}{2} \approx 0.866025$.
   - Normal approach speed: $v_n = v_A \cos(30^\circ) = 5.700 \times 0.866025 \approx 4.9363\text{ m/s}$.
   - Effective mass along normal:
     $$J_n = \frac{m (1 + e) v_n}{1 + 2\cos^2(30^\circ)} = \frac{0.170 \times (1.900) \times 4.9363}{1 + 2(0.75)} = \frac{1.5944}{2.50} \approx 0.6378\text{ N}\cdot\text{s}$$
4. **Final Velocities:**
   - **Ball 0:** $\mathbf{\vec{v}_0 = (0.300\,\hat{i})\text{ m/s}}$
   - **Ball B:** $\vec{v}_B = \frac{J_n}{m} \hat{n}_B = \frac{0.6378}{0.170}(0.8660\,\hat{i} - 0.500\,\hat{j}) = \mathbf{(3.25\,\hat{i} - 1.88\,\hat{j})\text{ m/s}}$
   - **Ball C:** $\vec{v}_C = \frac{J_n}{m} \hat{n}_C = \mathbf{(3.25\,\hat{i} + 1.88\,\hat{j})\text{ m/s}}$
   - **Ball A:**
     $$v_{Ax, f} = v_A - \frac{2 J_n \cos(30^\circ)}{m} = 5.700 - \frac{2(0.6378)(0.8660)}{0.170} = 5.700 - 6.500 = \mathbf{-0.80\,\hat{i}\text{ m/s}}$$

---

### Solution to Gauntlet Problem 4
1. **Relativistic Kinematics of Parent Pion:**
   - Rest mass $m_\pi c^2 = 135.0\text{ MeV}$, Total energy $E = 225.0\text{ MeV}$.
   - Pion momentum:
     $$p_\pi c = \sqrt{E^2 - (m_\pi c^2)^2} = \sqrt{225.0^2 - 135.0^2} = \sqrt{50,625 - 18,225} = \sqrt{32,400} = \mathbf{180.0\text{ MeV}}$$
2. **4-Momentum Conservation:**
   - Photons have $E = p c$.
   - Energy: $E_1 + E_2 = E = 225.0\text{ MeV} \implies E_2 = 225.0 - E_1$.
   - $x$-momentum: $E_1 \cos(30^\circ) + E_2 \cos\theta_2 = 180.0\text{ MeV}$.
   - $y$-momentum: $E_1 \sin(30^\circ) - E_2 \sin\theta_2 = 0 \implies E_2 \sin\theta_2 = E_1 \sin(30^\circ) = 0.500 E_1$.
3. **Invariant Mass Formulation:**
   - $P^\mu P_\mu = m_\pi^2 c^4 = (P_1 + P_2)^2 = 2 P_1 \cdot P_2 = 2 E_1 E_2 (1 - \cos\theta_{\text{total}})$.
   - Using energy-momentum relation:
     $$E_1 = \frac{m_\pi^2 c^4}{2 [E - p_\pi c \cos\theta_1]} = \frac{(135.0)^2}{2 [225.0 - 180.0 \cos(30.0^\circ)]} = \frac{18,225}{2 [225.0 - 180.0(0.866025)]}$$
     $$\text{Denominator} = 2 [225.0 - 155.885] = 2 [69.115] = 138.23$$
     $$\mathbf{E_{\gamma 1} = \frac{18,225}{138.23} \approx 131.85\text{ MeV}}$$
4. **Parts (b) & (c): Second Photon:**
   - Energy:
     $$\mathbf{E_{\gamma 2} = 225.0 - 131.85 = 93.15\text{ MeV}}$$
   - Angle $\theta_2$:
     $$\sin\theta_2 = \frac{E_1 \sin(30.0^\circ)}{E_2} = \frac{131.85 \times 0.500}{93.15} = \frac{65.925}{93.15} \approx 0.7077$$
     $$\mathbf{\theta_2 = \arcsin(0.7077) \approx 45.05^\circ \approx -45.1^\circ}$$

---

### Solution to Gauntlet Problem 5
1. **Vertical Fall Dynamics:**
   - The chain falls freely under gravity $g = 9.80\text{ m/s}^2$. At time $t$, distance fallen is $y(t) = \frac{1}{2} g t^2$, and velocity is $v(t) = gt$.
   - Scale force:
     $$F_y(t) = W_{\text{static}}(t) + F_{\text{impulse}}(t) = \mu y g + \mu v^2 = \mu \left(\frac{1}{2} g t^2\right) g + \mu (gt)^2 = \frac{3}{2}\mu g^2 t^2 = \mathbf{3\mu y g}$$
2. **Part (b): Force at Instant Top Strikes ($y = L = 3.00\text{ m}$):**
   - Total mass $M = 6.00\text{ kg} \implies \mu = M / L = 2.00\text{ kg/m}$.
   $$\mathbf{F_{y, \max} = 3 M g = 3 \times (6.00) \times (9.80) = 176.4\text{ N}}$$
3. **Part (c): Total Horizontal Impulse:**
   - At height $z$ from the top, wind force on suspended portion $(L - y)$ is:
     $$F_{\text{wind}}(t) = \alpha (L - y) = \alpha \left(L - \frac{1}{2}gt^2\right)$$
   - Total fall time: $t_{\text{fall}} = \sqrt{\frac{2L}{g}} = \sqrt{\frac{2 \times 3.00}{9.80}} = \sqrt{0.6122} \approx 0.7825\text{ s}$.
   - Total horizontal impulse:
     $$J_x = \int_0^{t_{\text{fall}}} \alpha \left(L - \frac{1}{2}gt^2\right) dt = \alpha \left[L t - \frac{1}{6}gt^3\right]_0^{t_{\text{fall}}} = \alpha t_{\text{fall}} \left(L - \frac{1}{6}g \frac{2L}{g}\right) = \alpha t_{\text{fall}} \left(L - \frac{L}{3}\right) = \frac{2}{3} \alpha L t_{\text{fall}}$$
     $$J_x = \frac{2}{3} \times (2.00\text{ N/m}) \times (3.00\text{ m}) \times (0.7825\text{ s}) = 4.00 \times 0.7825 = \mathbf{3.13\text{ N}\cdot\text{s}}$$

---

### Solution to Gauntlet Problem 6
1. **Shock Pressure Calculation:**
   - Meteorite $\rho_m = 3,200\text{ kg/m}^3$, Basalt $\rho_t = 2,900\text{ kg/m}^3$, $v_0 = 24.0\text{ km/s} = 24,000\text{ m/s}$.
   - Planar shock impedance matching:
     $$u_p \approx \frac{\sqrt{\rho_m}}{\sqrt{\rho_m} + \sqrt{\rho_t}} v_0 = \frac{\sqrt{3,200}}{\sqrt{3,200} + \sqrt{2,900}} \times 24.0 = \frac{56.57}{56.57 + 53.85} \times 24.0 = \frac{56.57}{110.42} \times 24.0 \approx \mathbf{12.29\text{ km/s}}$$
   - Shock speed:
     $$u_s = 4.50 + 1.25(12.29) = 4.50 + 15.36 = \mathbf{19.86\text{ km/s}}$$
   - Peak Shock Pressure:
     $$P_{\text{shock}} = \rho_t u_s u_p = (2,900) \times (19,860) \times (12,290) \approx 7.078 \times 10^{11}\text{ Pa} \approx \mathbf{708\text{ GPa}}$$
2. **Kinetic Energy:**
   - Volume: $V = \frac{4}{3}\pi (20.0)^3 \approx 33,510\text{ m}^3$.
   - Mass: $M = 3,200 \times 33,510 \approx 1.072 \times 10^8\text{ kg}$.
   $$E_K = \frac{1}{2}(1.072 \times 10^8)(24,000)^2 = 5.36 \times 10^7 \times 5.76 \times 10^8 \approx \mathbf{3.087 \times 10^{16}\text{ J}}$$
   - Megatons TNT:
     $$E_{\text{Mton}} = \frac{3.087 \times 10^{16}}{4.184 \times 10^{15}} \approx \mathbf{7.38\text{ Megatons of TNT}}$$
3. **Crater Diameter:**
   $$\frac{E_K}{\rho_t g} = \frac{3.087 \times 10^{16}}{2,900 \times 9.80} = \frac{3.087 \times 10^{16}}{28,420} \approx 1.086 \times 10^{12}\text{ m}^4$$
   $$(1.086 \times 10^{12})^{0.22} \approx 446.4$$
   $$\left(\frac{\rho_i}{\rho_t}\right)^{0.31} = \left(\frac{3,200}{2,900}\right)^{0.31} = (1.1034)^{0.31} \approx 1.031$$
   $$D = 1.16 \times 446.4 \times 1.031 \approx \mathbf{534\text{ m}}$$

---

### Solution to Gauntlet Problem 7
1. **The Apparent Paradox:**
   A single sphere departing with speed $v' = \sqrt{2}v_0$ would satisfy both:
   - Momentum: $2 m v_0 = m (\sqrt{2}v_0) \implies \text{Error: } 2 \ne 1.414$!
   Notice immediately that **momentum is not conserved** if one sphere leaves with $\sqrt{2}v_0$!
   To satisfy both $P$ and $K$ with $N$ spheres moving at speed $v'$:
   $$2 m v_0 = N m v' \implies v' = \frac{2}{N} v_0$$
   $$\frac{1}{2}(2m) v_0^2 = \frac{1}{2}(Nm) (v')^2 \implies 2 v_0^2 = N \left(\frac{2}{N} v_0\right)^2 = \frac{4}{N} v_0^2 \implies N = 2, v' = v_0$$
2. **Contact Dynamics Proof:**
   In Hertzian contact mechanics, a stress wave consists of discrete non-linear solitons. The two incoming balls form two successive compression pulses separated in time. These two pulses pass through the intermediate resting spheres independently as acoustic solitons and eject exactly the two rightmost spheres sequentially!

---

### Solution to Gauntlet Problem 8
1. **Jupiter Gravitational Parameter:**
   $$\mu_J = G M_J = (6.674 \times 10^{-11})(1.90 \times 10^{27}) = 1.268 \times 10^{17}\text{ m}^3/\text{s}^2$$
2. **Safe Minimum Periapsis Radius:**
   - Setting $r_p = R_J + 1,000\text{ km} = 72,492\text{ km} = 7.2492 \times 10^7\text{ m}$.
3. **Approach Speed in Jupiter Frame:**
   - Jupiter orbital velocity: $V_J = 13.06\text{ km/s}$.
   - Relative approach speed: $v_\infty = v_{\infty 1} + V_J = 8.00 + 13.06 = 21.06\text{ km/s} = 21,060\text{ m/s}$.
4. **Eccentricity and Deflection:**
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{\mu_J} = 1 + \frac{(7.2492 \times 10^7) \times (21,060)^2}{1.268 \times 10^{17}} = 1 + \frac{3.215 \times 10^{16}}{1.268 \times 10^{17}} = 1 + 0.2535 = 1.2535$$
   $$\sin(\delta/2) = \frac{1}{1.2535} \approx 0.7978 \implies \delta/2 \approx 52.92^\circ \implies \delta \approx 105.8^\circ$$
5. **Maximum Heliocentric Velocity:**
   - In the velocity vector triangle:
     $$v_{\text{helio, max}} = \sqrt{V_J^2 + v_\infty^2 + 2 V_J v_\infty \cos(180^\circ - \delta)}$$
     $$\mathbf{v_{\text{helio, max}} \approx 32.4\text{ km/s}}$$

---

### Solution to Gauntlet Problem 9
1. **Initial Energy:**
   $$E_0 = m g h_0 = (0.050)(9.80)(1.50) = 0.735\text{ J}$$
2. **Energy After Each Bounce with Constant Acoustic Loss:**
   - After bounce 1: $E_1 = e^2 E_0 - E_{\text{sound}} = (0.850)^2(0.735) - 0.0020 = 0.7225(0.735) - 0.0020 = 0.5310 - 0.0020 = 0.5290\text{ J}$.
   - Effective exponential decay rate: $e^2 = 0.7225$.
   - Number of bounces $N$ to drop from $0.735\text{ J}$ to $0.0020\text{ J}$:
     $$(0.7225)^N \approx \frac{0.0020}{0.735} \approx 0.002721$$
     $$N \ln(0.7225) = \ln(0.002721) \implies N(-0.3250) = -5.9066 \implies \mathbf{N \approx 18\text{ bounces}}$$
3. **Total Elapsed Time:**
   - Initial drop time: $t_0 = \sqrt{2h_0 / g} = \sqrt{3.00 / 9.80} \approx 0.5533\text{ s}$.
   - Subsequent bounces:
     $$T_{\text{total}} = t_0 + 2 t_0 \sum_{n=1}^{18} e^n \approx t_0 \left(\frac{1 + e}{1 - e}\right) = 0.5533 \times \left(\frac{1.850}{0.150}\right) = 0.5533 \times 12.333 \approx \mathbf{6.82\text{ seconds}}$$

---

### Solution to Gauntlet Problem 10
1. **Coriolis Acceleration:**
   - Relative radial velocity: $\vec{v}_{\text{rel}} = v_{\text{rel}} \hat{r} = 50.0\,\hat{r}\text{ m/s}$.
   - Angular velocity: $\vec{\Omega} = \Omega\,\hat{k} = 0.020\,\hat{k}\text{ rad/s}$.
   $$\vec{a}_{\text{Coriolis}} = 2 (\vec{\Omega} \times \vec{v}_{\text{rel}}) = 2(0.020)(50.0)\hat{\theta} = \mathbf{2.00\,\hat{\theta}\text{ m/s}^2}$$
2. **Coriolis Reaction Force on Tether:**
   $$F_{\text{Coriolis}} = m a_{\text{Coriolis}} = (1,000\text{ kg}) \times (2.00\text{ m/s}^2) = \mathbf{2,000\text{ N} = 2.00\text{ kN}}$$
   (Constant lateral force opposing the rotation direction).
3. **Total Angular Momentum Transferred to Tether:**
   - Radius increases as $r(t) = v_{\text{rel}} t$ from $r = 0$ to $r = L/2 = 100\text{ km} = 1.00 \times 10^5\text{ m}$.
   - Angular momentum of climber at tip:
     $$L_{\text{climber}} = m r_{\text{tip}}^2 \Omega = (1,000) \times (1.00 \times 10^5)^2 \times (0.020) = 1,000 \times 10^{10} \times 0.020 = \mathbf{2.00 \times 10^{11}\text{ kg}\cdot\text{m}^2/\text{s}}$$
   - By conservation of angular momentum, the tether's rotational spin slows down by exactly $\Delta L = -2.00 \times 10^{11}\text{ kg}\cdot\text{m}^2/\text{s}$!
