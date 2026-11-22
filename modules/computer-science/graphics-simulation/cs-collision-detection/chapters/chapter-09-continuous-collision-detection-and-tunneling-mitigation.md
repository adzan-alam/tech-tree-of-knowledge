# Chapter 09: Continuous Collision Detection (CCD) & Tunneling Mitigation

> *"In the discrete universe of computer clock cycles, motion does not flow as an unbroken continuum; it teleports across finite chasms of time $\Delta t$. If an entity leaps further in a single chasm than the thickness of the barrier before it, reality breaks: the bullet passes through the wall without ever having touched it. Continuous Collision Detection is the mathematical bridge that restores physical continuity to discrete simulation."*

---

## 9.1 The Discrete Time Abyss and the "Bullet-Through-Paper" Problem

### The Physical Reality vs. The Discrete Simulator
In classical Newtonian mechanics, time $t$ is an unyielding, smooth continuum $t \in \mathbb{R}$. A rigid body $\mathcal{A}$ traces an unbroken manifold of spatial configurations throughout an interval $[t_0, t_0 + \Delta t]$:

$$\mathbf{x}(t) = \mathbf{x}(t_0) + \int_{t_0}^t \mathbf{v}(\tau) \, d\tau$$

If an obstacle $\mathcal{B}$ occupies a closed spatial domain in $\mathbb{R}^2$, the Intermediate Value Theorem guarantees that if body $\mathcal{A}$ begins on one side of $\mathcal{B}$ at $t_0$ and ends on the opposite side at $t_0 + \Delta t$, there exists some exact intermediate temporal instant $t^* \in [t_0, t_0 + \Delta t]$ such that the topological boundaries touch:

$$\partial \mathcal{A}(t^*) \cap \partial \mathcal{B}(t^*) \neq \emptyset \quad \text{and} \quad \operatorname{int}(\mathcal{A}(t^*)) \cap \operatorname{int}(\mathcal{B}(t^*)) = \emptyset$$

In a discrete digital physics engine, however, time advances in finite, quantum leaps $\Delta t \in \mathbb{R}^+$, typically dictated by display refresh rates or simulation update ticks (e.g., $\Delta t = 1/60 \approx 0.01667\text{ s}$ or $\Delta t = 1/120 \approx 0.00833\text{ s}$). Under standard explicit numerical schemes (such as Forward Euler or Symplectic Euler):

$$\mathbf{x}_{k+1} = \mathbf{x}_k + \mathbf{v}_k \Delta t$$

The simulator samples configuration space exclusively at the integer multiples $\{t_k = k \Delta t\}_{k=0,1,2,\dots}$. The intermediate continuum $(t_k, t_{k+1})$ does not exist in memory. It is computationally skipped.

```
Discrete Time Sampling (Tunneling Phenomenon):

Time t_k:                     Space between t_k and t_{k+1}:            Time t_{k+1}:
  [ Bullet ]  --->                   (UNCHECKED CONTINUUM)                      |  [ Bullet ]
  (x_k, y_k)                             | Wall |                               (x_{k+1}, y_{k+1})
      |                                  |      |                                       |
      v                                  |      |                                       v
Overlap: FALSE                           |      |                             Overlap: FALSE
                                   COLLISION MISSED!
```

### The Analytical Tunneling Condition
Consider a moving circular projectile $\mathcal{A}$ of radius $r$ possessing velocity $\mathbf{v} = [v_x, v_y]^T$, traveling along a trajectory directed perpendicularly toward a stationary rectangular barrier $\mathcal{B}$ of thickness $w$. Let the unit normal to the barrier be $\hat{\mathbf{n}}$ such that $\mathbf{v} \cdot \hat{\mathbf{n}} = -\|\mathbf{v}\| = -v$.

At time step $t_k$, the projectile's leading edge is situated at a distance $s_k > 0$ outside the front surface of the wall:

$$d_{\text{leading}}(t_k) = s_k$$

At time step $t_{k+1} = t_k + \Delta t$, the center of the projectile updates by displacement vector $\Delta \mathbf{x} = \mathbf{v} \Delta t$. The new distance of the projectile's trailing edge past the back surface of the wall is:

$$d_{\text{trailing}}(t_{k+1}) = s_k - v \Delta t + w + 2r$$

For a discrete collision detector to observe an intersection at step $t_k$ or $t_{k+1}$, the projectile must intersect the slab $[0, w]$ at one of those discrete instances. If the projectile is completely outside the wall at $t_k$ ($s_k > 0$) and its trailing edge is completely past the back face at $t_{k+1}$ ($d_{\text{trailing}}(t_{k+1}) < 0$), the discrete detector evaluates:

$$\mathcal{A}(t_k) \cap \mathcal{B} = \emptyset \quad \text{and} \quad \mathcal{A}(t_{k+1}) \cap \mathcal{B} = \emptyset$$

The collision is completely invisible to the engine. The projectile has **tunneled** through the barrier.

The mathematical condition for tunneling across a barrier of effective thickness $W_{\text{eff}} = w + 2r$ is:

$$\|\mathbf{v}\| \Delta t > W_{\text{eff}} + s_k \implies v > \frac{w + 2r}{\Delta t}$$

In real-world engineering simulations:
- A high-velocity tank shell traveling at $v = 1200\text{ m/s}$ in a game running at $60\text{ Hz}$ ($\Delta t = 0.01667\text{ s}$) travels $\Delta x = 1200 \times 0.01667 = 20.0\text{ meters}$ per time step! Any armor plate or bunker wall thinner than $20\text{ meters}$ will be seamlessly tunneled through.
- Even at moderate velocities, a golf ball ($r = 0.0213\text{ m}$) moving at $v = 70\text{ m/s}$ ($252\text{ km/h}$) travels $\Delta x = 1.167\text{ m}$ per frame at $60\text{ Hz}$. A standard wooden barrier of thickness $w = 0.05\text{ m}$ presents an effective collision thickness $W_{\text{eff}} = 0.05 + 2(0.0213) = 0.0926\text{ m}$. Because $1.167\text{ m} \gg 0.0926\text{ m}$, tunneling occurs with over $92\%$ probability depending on the entry phase.

---

## 9.2 The Swept Volume Formulation

The fundamental geometric cure for tunneling is to transform the collision query from a static overlap test in $\mathbb{R}^2$ to a **swept volume** overlap test in spacetime $\mathbb{R}^2 \times [t_0, t_0 + \Delta t]$.

### Swept Circles: The 2D Capsule (Spherocylinder)
The continuous swept trajectory of a circular disc $\mathcal{C}(\mathbf{c}, r) = \{\mathbf{p} \in \mathbb{R}^2 \mid \|\mathbf{p} - \mathbf{c}\| \le r\}$ translating linearly from center $\mathbf{c}_0$ at $t_0$ to $\mathbf{c}_1 = \mathbf{c}_0 + \mathbf{v} \Delta t$ at $t_0 + \Delta t$ is the Minkowski sum of the trajectory line segment $\mathcal{S} = \operatorname{seg}(\mathbf{c}_0, \mathbf{c}_1)$ and the origin-centered disc $\mathcal{B}_r(\mathbf{0})$:

$$\operatorname{Swept}(\mathcal{C}) = \mathcal{S} \oplus \mathcal{B}_r(\mathbf{0}) = \left\{ \mathbf{p} \in \mathbb{R}^2 \;\middle|\; \min_{u \in [0, 1]} \|\mathbf{p} - ((1-u)\mathbf{c}_0 + u \mathbf{c}_1)\| \le r \right\}$$

This swept geometric entity is exactly a **2D capsule** (a stadium or spherocylinder), consisting of:
1. A central rectangular core of width $\|\mathbf{c}_1 - \mathbf{c}_0\|$ and height $2r$, oriented along the displacement vector $\mathbf{d} = \mathbf{c}_1 - \mathbf{c}_0$.
2. Two semicircular caps of radius $r$ centered at $\mathbf{c}_0$ and $\mathbf{c}_1$.

```
Swept Circle Geometry (Capsule):

       +------------------------------------+
     / |                                    | \
    | c0 ---------------------------------- c1 |
     \ |                                    | /
       +------------------------------------+
       <------------- ||d|| --------------->
       <-- r -->                    <-- r -->
```

### Distance from an Arbitrary Point to a Swept Capsule
To determine if a static point $\mathbf{q} \in \mathbb{R}^2$ intersects the swept capsule of a moving circle, we compute the minimum Euclidean distance from $\mathbf{q}$ to the segment $\operatorname{seg}(\mathbf{c}_0, \mathbf{c}_1)$.

Let $\mathbf{u} = \mathbf{c}_1 - \mathbf{c}_0$. The parametric projection of $\mathbf{q} - \mathbf{c}_0$ onto $\mathbf{u}$ is:

$$\lambda^* = \frac{(\mathbf{q} - \mathbf{c}_0) \cdot \mathbf{u}}{\|\mathbf{u}\|^2}$$

Clamping $\lambda^*$ to the unit interval $[0, 1]$ yields the closest point on the trajectory segment:

$$\hat{\lambda} = \operatorname{clamp}(\lambda^*, 0, 1) = \max(0, \min(1, \lambda^*))$$

$$\mathbf{p}_{\text{closest}} = \mathbf{c}_0 + \hat{\lambda} \mathbf{u}$$

The distance from point $\mathbf{q}$ to the swept capsule is:

$$d(\mathbf{q}, \operatorname{Swept}(\mathcal{C})) = \|\mathbf{q} - \mathbf{p}_{\text{closest}}\| - r$$

- If $d(\mathbf{q}, \operatorname{Swept}(\mathcal{C})) \le 0$, the point was struck during the time step.
- The normalized time of contact is precisely $\hat{\lambda}$, meaning impact occurred at $t^* = t_0 + \hat{\lambda} \Delta t$.

---

## 9.3 Time-of-Impact (TOI) Root Finding

When both bodies move simultaneously, or when geometric shapes are complex convex polygons, closed-form swept volumes become topologically intricate. Instead of building high-dimensional swept polygons, modern physics engines formulate collision as a **Time-of-Impact (TOI)** root-finding problem.

### The Continuous Separation Function
Let $\mathcal{A}(t)$ and $\mathcal{B}(t)$ denote the positions and orientations of two rigid bodies at time $t \in [0, \Delta t]$. Define the signed distance function:

$$f(t) = \operatorname{dist}(\mathcal{A}(t), \mathcal{B}(t)) = \min_{\mathbf{a} \in \mathcal{A}(t), \mathbf{b} \in \mathcal{B}(t)} \|\mathbf{a} - \mathbf{b}\|$$

Assuming the bodies are disjoint at the beginning of the step, $f(0) > 0$. If $f(\Delta t) \ge 0$ and no intermediate collision occurs, $f(t) > 0$ for all $t \in [0, \Delta t]$. However, if the trajectories intersect, $f(t)$ reaches zero at some critical time.

The **Time of Impact** $t^*$ is the infimum:

$$t^* = \inf \{ t \in [0, \Delta t] \mid f(t) \le 0 \}$$

```
The Separation Function f(t):

   f(t) ^
        |   \
        |    \
        |     \
   f(0) +      \
        |       \
        |        \
        |         \
      0 +----------+---------------------> t
        |         t* \        /
        |             \______/
        |                   \
        +--------------------\-----------> t
        0                    \Delta t
```

### Root-Finding Methodologies

#### 1. The Bisection Method
If $f(0) > 0$ and $f(\Delta t) < 0$, the Intermediate Value Theorem ensures a root exists in $[0, \Delta t]$.
We iteratively evaluate the midpoint $t_{\text{mid}} = \frac{t_{\text{low}} + t_{\text{high}}}{2}$:
- If $f(t_{\text{mid}}) > 0$, set $t_{\text{low}} = t_{\text{mid}}$.
- If $f(t_{\text{mid}}) \le 0$, set $t_{\text{high}} = t_{\text{mid}}$.

Convergence is linear, reducing the uncertainty interval by a factor of 2 per iteration:

$$\text{Error}_k = \frac{\Delta t}{2^k}$$

To achieve a spatial precision of $\epsilon = 10^{-4}\text{ m}$ for a projectile moving at $v = 100\text{ m/s}$ with $\Delta t = 0.01667\text{ s}$ ($\Delta x = 1.667\text{ m}$), we require:

$$\frac{1.667}{2^k} \le 10^{-4} \implies 2^k \ge 16670 \implies k \ge \lceil \log_2(16670) \rceil = 14\text{ iterations}$$

Each iteration requires running a full static narrow-phase distance query (e.g., GJK or SAT), making naive bisection computationally expensive.

#### 2. The Secant Method and Regula Falsi
By approximating the derivative $f'(t)$ using finite differences between previous evaluations:

$$t_{k+1} = t_k - f(t_k) \frac{t_k - t_{k-1}}{f(t_k) - f(t_{k-1})}$$

While faster near simple roots (superlinear convergence $\phi \approx 1.618$), the Secant method can oscillate wildly or diverge if $f(t)$ is non-smooth (which occurs frequently in computational geometry as contact features switch between vertices and edges).

---

## 9.4 Conservative Advancement (The Mirtich-Gino Algorithm)

To guarantee both unconditional convergence and physical non-penetration without wasting cycles inside the penetration zone, Brian Mirtich (1996) and Gino van den Bergen (2004) developed **Conservative Advancement (CA)**.

### Mathematical Formulation of Conservative Advancement
Conservative Advancement operates by stepping time forward by a provably safe step $\Delta t_{\text{safe}}$ based on the current minimum Euclidean distance and an upper bound on the relative approach velocity along the separating direction.

```
Conservative Advancement Concept:

   Body A (x_A(t))                     Body B (x_B(t))
      O ------> v_A                   v_B <------ O
       \                                         /
        \                                       /
         +-------------------------------------+
                     d_min(t_k)
                     
   Maximum Approach Speed: v_rel_max = ||v_A|| + ||v_B|| + \omega_A r_A + \omega_B r_B
   Safe Time Step:         \Delta t_safe = (d_min - \epsilon) / v_rel_max
```

Let $\mathbf{n}$ be the unit separating vector between $\mathcal{A}(t)$ and $\mathcal{B}(t)$ at time $t_k$, such that the closest points are $\mathbf{p}_A \in \partial \mathcal{A}$ and $\mathbf{p}_B \in \partial \mathcal{B}$:

$$d(t_k) = (\mathbf{p}_B(t_k) - \mathbf{p}_A(t_k)) \cdot \mathbf{n} > 0$$

Let $\mathbf{v}_A, \boldsymbol{\omega}_A$ and $\mathbf{v}_B, \boldsymbol{\omega}_B$ be the linear and angular velocities of the bodies. The velocity of point $\mathbf{p}_A$ in the global frame is:

$$\dot{\mathbf{p}}_A = \mathbf{v}_A + \boldsymbol{\omega}_A \times (\mathbf{p}_A - \mathbf{c}_A)$$

The maximum possible relative approach speed along the normal $\mathbf{n}$ across the entire surface of both bodies is bounded by the triangle inequality:

$$v_{\text{approach}} = \max_{\mathbf{a} \in \mathcal{A}, \mathbf{b} \in \mathcal{B}} |(\dot{\mathbf{b}} - \dot{\mathbf{a}}) \cdot \mathbf{n}| \le \|\mathbf{v}_A\| + \|\mathbf{v}_B\| + |\omega_A| R_A + |\omega_B| R_B = v_{\text{rel}}^{\max}$$

where $R_A = \max_{\mathbf{a} \in \mathcal{A}} \|\mathbf{a} - \mathbf{c}_A\|$ and $R_B = \max_{\mathbf{b} \in \mathcal{B}} \|\mathbf{b} - \mathbf{c}_B\|$ are the maximum circumscribed bounding radii of the bodies.

### The Safe Time Step Theorem
If at time $t_k$ the minimum distance separating $\mathcal{A}$ and $\mathcal{B}$ is $d(t_k) > 0$, then for any intermediate time step:

$$\Delta t_{\text{safe}} = \frac{d(t_k) - \epsilon}{v_{\text{rel}}^{\max}}$$

no collision can occur in the interval $[t_k, t_k + \Delta t_{\text{safe}})$, where $\epsilon \ge 0$ is a tolerance distance.

#### Proof:
By the Mean Value Theorem, for any $t \in [t_k, t_k + \Delta t_{\text{safe}}]$:

$$d(t) = d(t_k) + \int_{t_k}^t \dot{d}(\tau) \, d\tau \ge d(t_k) - \int_{t_k}^t |\dot{d}(\tau)| \, d\tau$$

Since $|\dot{d}(\tau)| \le v_{\text{rel}}^{\max}$ for all $\tau$:

$$d(t) \ge d(t_k) - v_{\text{rel}}^{\max} (t - t_k) \ge d(t_k) - v_{\text{rel}}^{\max} \Delta t_{\text{safe}} = d(t_k) - (d(t_k) - \epsilon) = \epsilon \ge 0$$

Therefore, $d(t) > 0$ for all $t < t_k + \Delta t_{\text{safe}}$. Penetration is mathematically impossible during this advance. $\blacksquare$

### The Conservative Advancement Algorithm
```typescript
interface BodyState {
  x: Vector2;
  v: Vector2;
  angle: number;
  omega: number;
  radius: number; // Maximum radius from centroid
}

function computeTimeOfImpact(
  bodyA: BodyState,
  bodyB: BodyState,
  dtMax: number,
  tolerance: number = 0.001,
  maxIterations: number = 20
): { hit: boolean; toi: number; iterations: number } {
  let t = 0;
  let iterations = 0;

  // Upper bound on relative velocity
  const vRelMax =
    bodyA.v.length() +
    bodyB.v.length() +
    Math.abs(bodyA.omega) * bodyA.radius +
    Math.abs(bodyB.omega) * bodyB.radius;

  if (vRelMax < 1e-6) {
    return { hit: false, toi: dtMax, iterations: 0 };
  }

  while (t < dtMax && iterations < maxIterations) {
    iterations++;

    // Compute configuration of bodies at current time t
    const currentA = integrateState(bodyA, t);
    const currentB = integrateState(bodyB, t);

    // Compute Euclidean distance between shapes at time t
    const dist = computeNarrowPhaseDistance(currentA, currentB);

    if (dist <= tolerance) {
      // Reached surface within acceptable physical margin
      return { hit: true, toi: t, iterations };
    }

    // Compute safe advance step
    const dtSafe = (dist - tolerance) / vRelMax;

    if (dtSafe < 1e-7) {
      // Numerical floor: advance by minimal epsilon to prevent stall
      t += 1e-5;
    } else {
      t += dtSafe;
    }
  }

  return { hit: false, toi: dtMax, iterations };
}
```

---

## 9.5 Ray Casting Fundamentals & Fast Geometric Intersections

Ray casting is the foundational primitive of Continuous Collision Detection. A sweeping sphere or circular projectile can be rigorously reduced to a ray-cast against Minkowski-expanded obstacles.

A parametric ray in 2D is defined by an origin $\mathbf{p} = [p_x, p_y]^T$ and a unit direction $\hat{\mathbf{d}} = [d_x, d_y]^T$ with scalar length $t \in [0, t_{\max}]$:

$$\mathbf{r}(t) = \mathbf{p} + t \hat{\mathbf{d}}, \quad t \ge 0$$

### 1. Ray vs. Circle Intersection
Consider a circle centered at $\mathbf{c} = [c_x, c_y]^T$ with radius $r$. An intersection point satisfies the implicit equation:

$$\|\mathbf{r}(t) - \mathbf{c}\|^2 = r^2$$

Substituting $\mathbf{r}(t) = \mathbf{p} + t \hat{\mathbf{d}}$ and letting $\mathbf{m} = \mathbf{p} - \mathbf{c}$:

$$\|t \hat{\mathbf{d}} + \mathbf{m}\|^2 = r^2 \implies (t \hat{\mathbf{d}} + \mathbf{m}) \cdot (t \hat{\mathbf{d}} + \mathbf{m}) = r^2$$

Expanding:

$$(\hat{\mathbf{d}} \cdot \hat{\mathbf{d}}) t^2 + 2 (\mathbf{m} \cdot \hat{\mathbf{d}}) t + (\mathbf{m} \cdot \mathbf{m} - r^2) = 0$$

Since $\hat{\mathbf{d}}$ is a unit vector, $\hat{\mathbf{d}} \cdot \hat{\mathbf{d}} = 1$. Let:

$$b = \mathbf{m} \cdot \hat{\mathbf{d}}, \quad c = \mathbf{m} \cdot \mathbf{m} - r^2$$

$$t^2 + 2b t + c = 0$$

The discriminant is:

$$\Delta = b^2 - c$$

- If $\Delta < 0$: The ray completely misses the circle (no real roots).
- If $\Delta \ge 0$: The roots are:

$$t_1 = -b - \sqrt{\Delta}, \quad t_2 = -b + \sqrt{\Delta}$$

We seek the smallest non-negative root $t^* \ge 0$:
1. If $c \le 0$: The ray origin $\mathbf{p}$ is already inside or on the circle ($\|\mathbf{m}\|^2 \le r^2$). Thus $t^* = 0$.
2. If $c > 0$: The ray origin is outside. If $b > 0$, the circle lies strictly behind the ray origin ($\mathbf{m}$ points away from $\hat{\mathbf{d}}$), so no forward intersection exists. If $b \le 0$, the entry impact is:

$$t^* = -b - \sqrt{b^2 - c}$$

The outward surface normal at impact is:

$$\mathbf{n}_{\text{hit}} = \frac{\mathbf{r}(t^*) - \mathbf{c}}{r}$$

### 2. Ray vs. 2D AABB Intersection (The Kay-Kajiya Slab Method)
An Axis-Aligned Bounding Box (AABB) is the Cartesian product of two orthogonal 1D closed intervals (slabs):

$$\mathcal{B} = [x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}]$$

A ray $\mathbf{r}(t) = \mathbf{p} + t \mathbf{d}$ intersects the AABB if and only if there exists a parameter interval $[t_{\text{enter}}, t_{\text{exit}}]$ where the ray is simultaneously inside both the $X$-slab and the $Y$-slab.

```
Kay-Kajiya Slab Method:

           Y_max +---------------------+
                 |          /          |  t_y2
                 |         /           |
           Y_min +--------/------------+
                         /  t_y1
                        /
                       /  t_x2
               +------/--------+
               |     /         |
               |    /          |
               +---/-----------+
                  / t_x1
                 /
                p (Ray Origin)
```

For each axis $i \in \{x, y\}$:
If $d_i \neq 0$:

$$t_{i1} = \frac{\min_i - p_i}{d_i}, \quad t_{i2} = \frac{\max_i - p_i}{d_i}$$

Let $t_{i,\text{near}} = \min(t_{i1}, t_{i2})$ and $t_{i,\text{far}} = \max(t_{i1}, t_{i2})$.

The composite entry and exit parameters across both dimensions are:

$$t_{\text{enter}} = \max(t_{x,\text{near}}, t_{y,\text{near}})$$

$$t_{\text{exit}} = \min(t_{x,\text{far}}, t_{y,\text{far}})$$

The ray intersects the AABB if and only if:

$$t_{\text{enter}} \le t_{\text{exit}} \quad \text{and} \quad t_{\text{exit}} \ge 0$$

If $t_{\text{enter}} < 0$, the ray origin started inside the box, so the earliest forward hit is $t^* = 0$. Otherwise, $t^* = t_{\text{enter}}$.

To make this routine ultra-fast and branchless in IEEE 754 floating-point hardware:
1. Compute the reciprocal direction vector $\mathbf{inv\_d} = [1.0/d_x, 1.0/d_y]^T$ once.
2. If $d_x = 0$, IEEE 754 correctly computes $\pm \infty$. Multiplication by reciprocal avoids division inside hot loops.

---

## 9.6 Speculative Contacts: The Predictive Alternative

While full Continuous Collision Detection via Conservative Advancement or swept volumes resolves tunneling, it requires rolling back simulation time, sub-stepping individual islands, and recalculating constraints, which can induce severe frame rate drops in dense scenes.

**Speculative Contacts** (pioneered by Paul Firth and adopted in modern commercial physics engines) provide a purely discrete, forward-stepping alternative that completely prevents tunneling without requiring temporal backtracking.

### The Core Mechanics of Speculative Contacts
Instead of waiting for an intersection to occur and then projecting shapes out of penetration, speculative contacts detect that two bodies **will** collide within the next time step $\Delta t$ and create a speculative contact constraint before penetration occurs.

```
Speculative Contact Principle:

      Time t_k:                               Predicted Time t_{k+1}:
         A                                               A
         O --------> v_A \Delta t                        +---------------+
                                                         |  PENETRATION! |
                                                 +-------+-------+       |
                                                 |               |   B   |
                                                 |               +-------+
                                                 |       B       |
                                                 +---------------+
         
      Speculative Constraint Injected at t_k:
         Distance d_k > 0
         Constraint: v_rel \cdot n <= d_k / \Delta t
         Result: Velocity clamped so that at t_{k+1}, final distance = 0 (Resting Contact, Zero Penetration)
```

1. At time $t_k$, broad-phase fat AABBs expand along their velocity vectors: $\mathcal{B}_{\text{fat}} = \mathcal{B} \cup (\mathcal{B} + \mathbf{v} \Delta t)$.
2. The narrow phase identifies the closest features between $\mathcal{A}$ and $\mathcal{B}$.
3. Let the current separating distance along separating normal $\hat{\mathbf{n}}$ be $d > 0$.
4. The predicted relative normal approach velocity is:

$$v_{\text{rel}} = (\mathbf{v}_A - \mathbf{v}_B) \cdot \hat{\mathbf{n}}$$

If $v_{\text{rel}} \Delta t > d$, the bodies are on an inescapable collision course that will penetrate by $\delta_{\text{predicted}} = v_{\text{rel}} \Delta t - d > 0$ at $t_{k+1}$.
5. The constraint solver treats this pair as a normal contact constraint with a **negative penetration** (positive separation distance $d$):

$$C(\mathbf{x}) = (\mathbf{x}_B - \mathbf{x}_A) \cdot \hat{\mathbf{n}} - d \ge 0$$

The velocity constraint enforces that the post-step separation remains non-negative:

$$\dot{C} = (\mathbf{v}_B - \mathbf{v}_A) \cdot \hat{\mathbf{n}} + \frac{d}{\Delta t} \ge 0$$

When passed to a Sequential Impulse solver:
- The impulse accumulator applies a braking impulse $J$ along $\hat{\mathbf{n}}$ during step $t_k$ such that the relative approach velocity is clamped to exactly:

$$v_{\text{approach}}^{\text{allowed}} = \frac{d}{\Delta t}$$

- At step $t_{k+1}$, the projectile advances by exactly $d$ units and lands flush against the surface with zero penetration. No tunneling occurs, and no simulation rollback is required.

### Trade-Offs of Speculative Contacts
- **Ghost Collisions:** If a third body or an external force alters body $\mathcal{A}$'s trajectory midway through $\Delta t$, the speculative impulse has already been applied, causing the body to brake in mid-air near the obstacle ("ghost braking").
- **Computational Efficiency:** $\mathcal{O}(1)$ overhead within the standard LCP/Sequential Impulse pipeline, making it up to $50\times$ faster than iterative continuous sweeping.

---

## 9.7 Progressive Worked Examples

### Example 1: Tunneling Threshold & Maximum Safe Time Step for a High-Velocity Projectile
**Problem Statement:**
A depleted uranium anti-tank penetrator is modeled as a 2D circle of radius $r = 0.03\text{ m}$ traveling horizontally at $v = 1500\text{ m/s}$. It encounters a composite armor plate of thickness $w = 0.12\text{ m}$.
1. Determine the maximum simulation time step $\Delta t_{\text{crit}}$ above which tunneling through the plate becomes geometrically possible under standard discrete collision detection.
2. If the physics engine operates at a fixed tick rate of $60\text{ Hz}$ ($\Delta t = 1/60\text{ s}$), calculate the actual distance traversed in one tick and find the minimum barrier thickness $w_{\min}$ required to guarantee that discrete detection never misses the penetrator.

**Solution:**

**Step 1: Compute Effective Collision Thickness**
The penetrator has radius $r = 0.03\text{ m}$. The leading edge enters when the center is at distance $r$ from the front face; the trailing edge clears when the center is at distance $r$ behind the rear face.
The total effective collision thickness of the plate is:

$$W_{\text{eff}} = w + 2r = 0.12\text{ m} + 2(0.03\text{ m}) = 0.12\text{ m} + 0.06\text{ m} = 0.18\text{ m}$$

**Step 2: Calculate Critical Time Step $\Delta t_{\text{crit}}$**
Tunneling occurs if the displacement per tick $\Delta x = v \Delta t$ exceeds $W_{\text{eff}}$:

$$v \Delta t_{\text{crit}} = W_{\text{eff}} \implies \Delta t_{\text{crit}} = \frac{W_{\text{eff}}}{v} = \frac{0.18\text{ m}}{1500\text{ m/s}} = 0.00012\text{ s} = 1.20 \times 10^{-4}\text{ s} = 0.12\text{ ms}$$

In terms of frequency:

$$f_{\text{crit}} = \frac{1}{\Delta t_{\text{crit}}} = \frac{1}{0.00012\text{ s}} \approx 8333.33\text{ Hz}$$

A discrete engine would need to run at over $8,333\text{ frames per second}$ to safely capture this collision without CCD!

**Step 3: Distance Traversed at $60\text{ Hz}$**
For $\Delta t = \frac{1}{60}\text{ s} \approx 0.016667\text{ s}$:

$$\Delta x = v \Delta t = 1500\text{ m/s} \times \frac{1}{60}\text{ s} = 25.000\text{ m}$$

**Step 4: Minimum Barrier Thickness to Prevent Tunneling at $60\text{ Hz}$**
To ensure discrete detection regardless of arrival phase, the barrier's effective width must exceed the displacement per tick:

$$W_{\text{eff}} \ge \Delta x \implies w_{\min} + 2r \ge 25.000\text{ m}$$

$$w_{\min} = 25.000\text{ m} - 2(0.03\text{ m}) = 25.000\text{ m} - 0.060\text{ m} = 24.940\text{ m}$$

**Physical Sanity Check:**
Without CCD, a $12\text{ cm}$ armor plate is completely bypassed because the penetrator leaps $25\text{ meters}$ per frame. Only a massive $24.94\text{ meter}$ bunker wall could reliably trap the bullet discretely. CCD is non-negotiable here.

---

### Example 2: Swept Circle (Capsule) vs. Point Minimum Distance
**Problem Statement:**
A player character's hurtbox is represented as a circular disc of radius $r = 0.40\text{ m}$. At time $t_0$, the center is at $\mathbf{c}_0 = [1.0, 2.0]^T\text{ m}$. Over time step $\Delta t = 0.05\text{ s}$, it moves with constant velocity to $\mathbf{c}_1 = [7.0, 10.0]^T\text{ m}$. A stationary point hazard (a spike) is located at $\mathbf{q} = [5.0, 5.0]^T\text{ m}$.
1. Compute the trajectory displacement vector $\mathbf{u}$ and its squared length $\|\mathbf{u}\|^2$.
2. Calculate the parametric projection parameter $\lambda^*$ of the spike onto the trajectory segment.
3. Determine the closest point $\mathbf{p}^*$ on the swept segment to the spike and compute the signed clearance distance.
4. Conclude whether the character hit the spike, and if so, compute the exact time of impact $t^*$.

**Solution:**

**Step 1: Compute Trajectory Displacement Vector**

$$\mathbf{u} = \mathbf{c}_1 - \mathbf{c}_0 = \begin{bmatrix} 7.0 - 1.0 \\ 10.0 - 2.0 \end{bmatrix} = \begin{bmatrix} 6.0 \\ 8.0 \end{bmatrix}\text{ m}$$

$$\|\mathbf{u}\|^2 = u_x^2 + u_y^2 = 6.0^2 + 8.0^2 = 36.0 + 64.0 = 100.0\text{ m}^2$$

$$\|\mathbf{u}\| = \sqrt{100.0} = 10.0\text{ m}$$

**Step 2: Compute Projection Parameter $\lambda^*$**
The vector from the initial center to the spike is:

$$\mathbf{w} = \mathbf{q} - \mathbf{c}_0 = \begin{bmatrix} 5.0 - 1.0 \\ 5.0 - 2.0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 3.0 \end{bmatrix}\text{ m}$$

The dot product is:

$$\mathbf{w} \cdot \mathbf{u} = (4.0)(6.0) + (3.0)(8.0) = 24.0 + 24.0 = 48.0\text{ m}^2$$

The unconstrained projection parameter is:

$$\lambda^* = \frac{\mathbf{w} \cdot \mathbf{u}}{\|\mathbf{u}\|^2} = \frac{48.0}{100.0} = 0.480$$

Since $0 \le 0.480 \le 1$, the closest point lies strictly within the interior of the trajectory segment:

$$\hat{\lambda} = 0.480$$

**Step 3: Closest Point and Clearance Distance**

$$\mathbf{p}^* = \mathbf{c}_0 + \hat{\lambda} \mathbf{u} = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} + 0.480 \begin{bmatrix} 6.0 \\ 8.0 \end{bmatrix} = \begin{bmatrix} 1.0 + 2.88 \\ 2.0 + 3.84 \end{bmatrix} = \begin{bmatrix} 3.88 \\ 5.84 \end{bmatrix}\text{ m}$$

The vector from $\mathbf{p}^*$ to the spike $\mathbf{q}$ is:

$$\mathbf{d} = \mathbf{q} - \mathbf{p}^* = \begin{bmatrix} 5.0 - 3.88 \\ 5.0 - 5.84 \end{bmatrix} = \begin{bmatrix} 1.12 \\ -0.84 \end{bmatrix}\text{ m}$$

The Euclidean distance to the center trajectory is:

$$\|\mathbf{d}\| = \sqrt{(1.12)^2 + (-0.84)^2} = \sqrt{1.2544 + 0.7056} = \sqrt{1.9600} = 1.400\text{ m}$$

The clearance distance to the swept disc surface is:

$$d_{\text{clearance}} = \|\mathbf{d}\| - r = 1.400\text{ m} - 0.400\text{ m} = 1.000\text{ m}$$

**Step 4: Collision Evaluation**
Because $d_{\text{clearance}} = 1.000\text{ m} > 0$, the circular disc clears the spike with a $1.0\text{ meter}$ safety margin. No collision occurred.

---

### Example 3: Swept Circle vs. Static Circle Time of Impact (Quadratic Formulation)
**Problem Statement:**
A moving ball $\mathcal{A}$ of radius $r_A = 0.50\text{ m}$ starts at position $\mathbf{c}_A(0) = [-6.0, 0.0]^T\text{ m}$ with velocity $\mathbf{v}_A = [10.0, 0.0]^T\text{ m/s}$.
A stationary target ball $\mathcal{B}$ of radius $r_B = 0.50\text{ m}$ sits at position $\mathbf{c}_B = [0.0, 0.6]^T\text{ m}$.
The simulation time step is $\Delta t = 1.0\text{ s}$.
1. Set up the continuous contact condition equation for the two circles.
2. Formulate the quadratic equation $a t^2 + b t + c = 0$ for the time of impact $t^*$.
3. Solve for $t^*$ and determine the exact contact position and collision normal.

**Solution:**

**Step 1: Continuous Contact Condition**
Contact occurs at the earliest time $t \ge 0$ where the center-to-center distance equals the sum of radii:

$$\|\mathbf{c}_A(t) - \mathbf{c}_B\|^2 = (r_A + r_B)^2 = (0.50 + 0.50)^2 = 1.00^2 = 1.00\text{ m}^2$$

The trajectory of ball $\mathcal{A}$ as a function of time is:

$$\mathbf{c}_A(t) = \mathbf{c}_A(0) + \mathbf{v}_A t = \begin{bmatrix} -6.0 + 10.0 t \\ 0.0 \end{bmatrix}$$

The relative position vector is:

$$\boldsymbol{\Delta}(t) = \mathbf{c}_A(t) - \mathbf{c}_B = \begin{bmatrix} -6.0 + 10.0 t - 0.0 \\ 0.0 - 0.6 \end{bmatrix} = \begin{bmatrix} 10.0 t - 6.0 \\ -0.6 \end{bmatrix}$$

**Step 2: Formulate the Quadratic Equation**

$$\|\boldsymbol{\Delta}(t)\|^2 = (10.0 t - 6.0)^2 + (-0.6)^2 = 1.00$$

Expanding:

$$100.0 t^2 - 120.0 t + 36.0 + 0.36 = 1.00$$

$$100.0 t^2 - 120.0 t + 35.36 = 0$$

Divide through by $100.0$:

$$t^2 - 1.20 t + 0.3536 = 0$$

Here:
- $a = 1.0$
- $b = -1.20$
- $c = 0.3536$

**Step 3: Solve for Roots**
The discriminant is:

$$\Delta = b^2 - 4ac = (-1.20)^2 - 4(1.0)(0.3536) = 1.4400 - 1.4144 = 0.0256$$

$$\sqrt{\Delta} = \sqrt{0.0256} = 0.160$$

The two roots are:

$$t_1 = \frac{-b - \sqrt{\Delta}}{2a} = \frac{1.20 - 0.160}{2.0} = \frac{1.040}{2.0} = 0.520\text{ s}$$

$$t_2 = \frac{-b + \sqrt{\Delta}}{2a} = \frac{1.20 + 0.160}{2.0} = \frac{1.360}{2.0} = 0.680\text{ s}$$

The earliest impact occurs at the smaller root:

$$t^* = 0.520\text{ s}$$

Since $t^* = 0.520\text{ s} \le \Delta t = 1.0\text{ s}$, collision occurs during this simulation time step.

**Step 4: Contact Position and Normal**
At $t^* = 0.520\text{ s}$, the center of ball $\mathcal{A}$ is:

$$\mathbf{c}_A(t^*) = \begin{bmatrix} -6.0 + 10.0(0.520) \\ 0.0 \end{bmatrix} = \begin{bmatrix} -6.0 + 5.20 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -0.80 \\ 0.0 \end{bmatrix}\text{ m}$$

The contact normal pointing from $\mathcal{A}$ into $\mathcal{B}$ is:

$$\mathbf{n} = \frac{\mathbf{c}_B - \mathbf{c}_A(t^*)}{\|\mathbf{c}_B - \mathbf{c}_A(t^*)\|} = \frac{\begin{bmatrix} 0.0 - (-0.80) \\ 0.60 - 0.0 \end{bmatrix}}{1.00\text{ m}} = \begin{bmatrix} 0.80 \\ 0.60 \end{bmatrix}$$

The physical contact point is:

$$\mathbf{p}_{\text{contact}} = \mathbf{c}_A(t^*) + r_A \mathbf{n} = \begin{bmatrix} -0.80 \\ 0.0 \end{bmatrix} + 0.50 \begin{bmatrix} 0.80 \\ 0.60 \end{bmatrix} = \begin{bmatrix} -0.40 \\ 0.30 \end{bmatrix}\text{ m}$$

---

### Example 4: Swept Circle vs. Infinite Line and Line Segment
**Problem Statement:**
A circle of radius $r = 0.25\text{ m}$ starts at $\mathbf{c}_0 = [2.0, 4.0]^T\text{ m}$ and moves with constant velocity $\mathbf{v} = [4.0, -8.0]^T\text{ m/s}$ over $\Delta t = 0.50\text{ s}$.
A thin obstacle line segment extends from $\mathbf{a} = [0.0, 1.0]^T\text{ m}$ to $\mathbf{b} = [6.0, 1.0]^T\text{ m}$ (a horizontal segment lying on the line $y = 1.0$).
1. Determine the time $t_{\text{line}}$ when the circle's leading edge contacts the infinite line supporting the segment.
2. Calculate the $x$-coordinate of the circle's center at $t_{\text{line}}$.
3. Verify whether the contact point lies within the finite bounds of the segment $\mathbf{a} \to \mathbf{b}$.

**Solution:**

**Step 1: Contact with Infinite Line**
The line has equation $y = 1.0$ with upward unit normal $\hat{\mathbf{n}} = [0.0, 1.0]^T$.
The circle approaches the line from above ($y > 1.0$). The leading edge of the circle is at:

$$y_{\text{lead}}(t) = y_c(t) - r = (4.0 - 8.0 t) - 0.25 = 3.75 - 8.0 t$$

Contact with the line occurs when $y_{\text{lead}}(t) = 1.0$:

$$3.75 - 8.0 t = 1.0 \implies 8.0 t = 2.75 \implies t_{\text{line}} = \frac{2.75}{8.0} = 0.34375\text{ s}$$

Since $0 \le 0.34375\text{ s} \le 0.50\text{ s}$, the contact time is valid within the time step.

**Step 2: Compute $x$-Coordinate at Contact**
The trajectory along $x$ is:

$$x_c(t) = x_0 + v_x t = 2.0 + 4.0(0.34375) = 2.0 + 1.375 = 3.375\text{ m}$$

The contact point on the line is directly beneath the center:

$$\mathbf{p}_{\text{contact}} = [x_c(t_{\text{line}}), 1.0]^T = [3.375, 1.000]^T\text{ m}$$

**Step 3: Segment Boundary Validation**
The segment spans $x \in [a_x, b_x] = [0.0, 6.0]\text{ m}$.
Since $0.0 \le 3.375 \le 6.0$, the contact point lands cleanly within the interior of the segment.
Thus, impact occurs at $t^* = 0.34375\text{ s}$ at coordinates $[3.375, 1.000]^T\text{ m}$.

---

### Example 5: Ray vs. Circle Exact Intersection and Surface Normal Calculation
**Problem Statement:**
A sensor laser beam is modeled as a ray starting at $\mathbf{p} = [0.0, 5.0]^T\text{ m}$ pointing in direction $\mathbf{d} = [1.0, -1.0]^T$.
A target circular drone is centered at $\mathbf{c} = [4.0, 2.0]^T\text{ m}$ with radius $r = 1.50\text{ m}$.
1. Normalize the direction vector $\hat{\mathbf{d}}$.
2. Compute the quadratic coefficients $b$ and $c$, and evaluate the discriminant $\Delta$.
3. Determine the ray parameter $t^*$, the coordinates of the hit point, and the outward surface normal.

**Solution:**

**Step 1: Normalize Direction Vector**

$$\|\mathbf{d}\| = \sqrt{1.0^2 + (-1.0)^2} = \sqrt{2.0} \approx 1.414214$$

$$\hat{\mathbf{d}} = \begin{bmatrix} \frac{1}{\sqrt{2}} \\ -\frac{1}{\sqrt{2}} \end{bmatrix} \approx \begin{bmatrix} 0.707107 \\ -0.707107 \end{bmatrix}$$

**Step 2: Vector from Circle Center to Ray Origin**

$$\mathbf{m} = \mathbf{p} - \mathbf{c} = \begin{bmatrix} 0.0 - 4.0 \\ 5.0 - 2.0 \end{bmatrix} = \begin{bmatrix} -4.0 \\ 3.0 \end{bmatrix}\text{ m}$$

Compute scalar terms:

$$b = \mathbf{m} \cdot \hat{\mathbf{d}} = (-4.0)\left(\frac{1}{\sqrt{2}}\right) + (3.0)\left(-\frac{1}{\sqrt{2}}\right) = -\frac{7.0}{\sqrt{2}} \approx -4.949747$$

$$c = \mathbf{m} \cdot \mathbf{m} - r^2 = ((-4.0)^2 + 3.0^2) - 1.50^2 = (16.0 + 9.0) - 2.25 = 25.0 - 2.25 = 22.75$$

Discriminant:

$$\Delta = b^2 - c = \left(-\frac{7.0}{\sqrt{2}}\right)^2 - 22.75 = \frac{49.0}{2.0} - 22.75 = 24.50 - 22.75 = 1.750$$

$$\sqrt{\Delta} = \sqrt{1.750} \approx 1.322876$$

**Step 3: Compute $t^*$ and Intersection Details**
Since $b < 0$ and $\Delta > 0$, the smallest root is:

$$t^* = -b - \sqrt{\Delta} = 4.949747 - 1.322876 = 3.626871\text{ m}$$

The physical intersection coordinates are:

$$\mathbf{p}_{\text{hit}} = \mathbf{p} + t^* \hat{\mathbf{d}} = \begin{bmatrix} 0.0 \\ 5.0 \end{bmatrix} + 3.626871 \begin{bmatrix} 0.707107 \\ -0.707107 \end{bmatrix} = \begin{bmatrix} 2.5646 \\ 2.4354 \end{bmatrix}\text{ m}$$

The outward surface normal is:

$$\mathbf{n}_{\text{hit}} = \frac{\mathbf{p}_{\text{hit}} - \mathbf{c}}{r} = \frac{\begin{bmatrix} 2.5646 - 4.0 \\ 2.4354 - 2.0 \end{bmatrix}}{1.50} = \frac{\begin{bmatrix} -1.4354 \\ 0.4354 \end{bmatrix}}{1.50} = \begin{bmatrix} -0.9569 \\ 0.2903 \end{bmatrix}$$

**Sanity Check:**
$\|\mathbf{n}_{\text{hit}}\|^2 = (-0.9569)^2 + (0.2903)^2 = 0.9157 + 0.0843 = 1.0000$. The normal is unit length.

---

### Example 6: Ray vs. 2D AABB Intersection via Kay-Kajiya Slab Method
**Problem Statement:**
An AABB occupies the region $[x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}] = [2.0, 6.0] \times [1.0, 4.0]\text{ m}$.
A ray originates at $\mathbf{p} = [-2.0, -1.0]^T\text{ m}$ with direction vector $\mathbf{d} = [4.0, 3.0]^T\text{ m/s}$.
1. Compute the entry and exit parameters $t_{x1}, t_{x2}$ for the $X$-slab.
2. Compute the entry and exit parameters $t_{y1}, t_{y2}$ for the $Y$-slab.
3. Determine $t_{\text{enter}}$ and $t_{\text{exit}}$, evaluate whether the ray hits the box, and find the entry coordinates and collision normal.

**Solution:**

**Step 1: $X$-Slab Parameters**
Here $p_x = -2.0, d_x = 4.0$.

$$t_{x1} = \frac{x_{\min} - p_x}{d_x} = \frac{2.0 - (-2.0)}{4.0} = \frac{4.0}{4.0} = 1.000\text{ s}$$

$$t_{x2} = \frac{x_{\max} - p_x}{d_x} = \frac{6.0 - (-2.0)}{4.0} = \frac{8.0}{4.0} = 2.000\text{ s}$$

Since $d_x > 0$:

$$t_{x,\text{near}} = 1.000\text{ s}, \quad t_{x,\text{far}} = 2.000\text{ s}$$

**Step 2: $Y$-Slab Parameters**
Here $p_y = -1.0, d_y = 3.0$.

$$t_{y1} = \frac{y_{\min} - p_y}{d_y} = \frac{1.0 - (-1.0)}{3.0} = \frac{2.0}{3.0} \approx 0.6667\text{ s}$$

$$t_{y2} = \frac{y_{\max} - p_y}{d_y} = \frac{4.0 - (-1.0)}{3.0} = \frac{5.0}{3.0} \approx 1.6667\text{ s}$$

Since $d_y > 0$:

$$t_{y,\text{near}} = 0.6667\text{ s}, \quad t_{y,\text{far}} = 1.6667\text{ s}$$

**Step 3: Composite Parameters and Intersection**

$$t_{\text{enter}} = \max(t_{x,\text{near}}, t_{y,\text{near}}) = \max(1.000, 0.6667) = 1.000\text{ s}$$

$$t_{\text{exit}} = \min(t_{x,\text{far}}, t_{y,\text{far}}) = \min(2.000, 1.6667) = 1.6667\text{ s}$$

Because $t_{\text{enter}} \le t_{\text{exit}}$ ($1.000 \le 1.6667$) and $t_{\text{exit}} \ge 0$, an intersection occurs!
The time of entry is:

$$t^* = t_{\text{enter}} = 1.000\text{ s}$$

The intersection point is:

$$\mathbf{p}_{\text{hit}} = \mathbf{p} + t^* \mathbf{d} = \begin{bmatrix} -2.0 \\ -1.0 \end{bmatrix} + 1.000 \begin{bmatrix} 4.0 \\ 3.0 \end{bmatrix} = \begin{bmatrix} 2.0 \\ 2.0 \end{bmatrix}\text{ m}$$

Notice that $x = 2.0 = x_{\min}$, while $y = 2.0 \in [1.0, 4.0]$.
Because the entry boundary was determined by the $X$-slab minimum, the outward normal is:

$$\mathbf{n} = [-1.0, 0.0]^T$$

---

### Example 7: Conservative Advancement Iteration for Approaching Discs
**Problem Statement:**
Two identical discs $\mathcal{A}$ and $\mathcal{B}$ with radii $r = 1.0\text{ m}$ move along the $x$-axis.
At $t = 0$:
- $\mathbf{c}_A(0) = [0.0, 0.0]^T\text{ m}$, $\mathbf{v}_A = [6.0, 0.0]^T\text{ m/s}$
- $\mathbf{c}_B(0) = [10.0, 0.0]^T\text{ m}$, $\mathbf{v}_B = [-4.0, 0.0]^T\text{ m/s}$
- Neither disc rotates ($\omega_A = \omega_B = 0$).
- Target tolerance $\epsilon = 0.01\text{ m}$. Time step $\Delta t = 1.0\text{ s}$.

Execute the first 3 iterations of the Conservative Advancement algorithm, calculating for each iteration $k$:
1. Current separation distance $d(t_k)$.
2. Maximum relative velocity bound $v_{\text{rel}}^{\max}$.
3. Safe time step $\Delta t_{\text{safe}}$.
4. Updated simulation time $t_{k+1}$.

**Solution:**

**Step 1: Compute Maximum Relative Velocity**

$$v_{\text{rel}}^{\max} = \|\mathbf{v}_A\| + \|\mathbf{v}_B\| = 6.0 + 4.0 = 10.0\text{ m/s}$$

**Iteration 1 ($t_0 = 0.0\text{ s}$):**
- Positions: $\mathbf{c}_A(0) = [0.0, 0.0]^T$, $\mathbf{c}_B(0) = [10.0, 0.0]^T$.
- Center distance: $D_0 = 10.0 - 0.0 = 10.0\text{ m}$.
- Surface separation: $d_0 = D_0 - 2r = 10.0 - 2.0 = 8.000\text{ m}$.
- Safe step:

$$\Delta t_{\text{safe}, 0} = \frac{d_0 - \epsilon}{v_{\text{rel}}^{\max}} = \frac{8.000 - 0.010}{10.0} = \frac{7.990}{10.0} = 0.7990\text{ s}$$

- Updated time:

$$t_1 = t_0 + \Delta t_{\text{safe}, 0} = 0.0 + 0.7990 = 0.7990\text{ s}$$

**Iteration 2 ($t_1 = 0.7990\text{ s}$):**
- Positions:
  $\mathbf{c}_A(t_1) = 0.0 + 6.0(0.7990) = 4.794\text{ m}$.
  $\mathbf{c}_B(t_1) = 10.0 - 4.0(0.7990) = 10.0 - 3.196 = 6.804\text{ m}$.
- Center distance: $D_1 = 6.804 - 4.794 = 2.010\text{ m}$.
- Surface separation: $d_1 = 2.010 - 2.000 = 0.010\text{ m}$.
- Check termination: $d_1 = 0.010\text{ m} \le \epsilon = 0.010\text{ m}$!
The algorithm converges in only 2 iterations!

**Analytical Exact TOI Verification:**
Analytical contact occurs when center distance is $2.0\text{ m}$:

$$10.0 - 10.0 t^* = 2.0 \implies 10.0 t^* = 8.0 \implies t^* = 0.8000\text{ s}$$

Conservative Advancement arrived at $t = 0.7990\text{ s}$, which is within $1\text{ millisecond}$ of the exact root, safely halting outside the boundary by exactly $\epsilon = 1\text{ cm}$.

---

### Example 8: Bisection Root Finding for Nonlinear Dynamic Trajectory
**Problem Statement:**
A projectile follows a parabolic trajectory under gravity ($g = 9.8\text{ m/s}^2$):

$$\mathbf{x}(t) = \begin{bmatrix} 20.0 t \\ 15.0 t - 4.9 t^2 \end{bmatrix}\text{ m}$$

It encounters a stationary circular force field centered at $\mathbf{c} = [16.0, 8.0]^T\text{ m}$ of radius $R = 2.0\text{ m}$.
At $t = 0$, the projectile is outside ($d(0) > 0$). At $t = 1.0\text{ s}$, the projectile is inside the field.
Perform 3 bisection iterations to bracket the entry Time of Impact $t^* \in [t_{\text{low}}, t_{\text{high}}]$.

**Solution:**

Define the signed distance function:

$$f(t) = \|\mathbf{x}(t) - \mathbf{c}\| - R = \sqrt{(20.0 t - 16.0)^2 + (15.0 t - 4.9 t^2 - 8.0)^2} - 2.0$$

**Initial Bracket:**
- $t_{\text{low}} = 0.0\text{ s}$: $\mathbf{x}(0) = [0.0, 0.0]^T$.
  $\|\mathbf{x}(0) - \mathbf{c}\| = \sqrt{(-16.0)^2 + (-8.0)^2} = \sqrt{256 + 64} = \sqrt{320} \approx 17.8885\text{ m}$.
  $f(0) = 17.8885 - 2.0 = 15.8885\text{ m} > 0$.
- $t_{\text{high}} = 1.0\text{ s}$: $\mathbf{x}(1.0) = [20.0, 10.1]^T$.
  $\|\mathbf{x}(1.0) - \mathbf{c}\| = \sqrt{(20.0 - 16.0)^2 + (10.1 - 8.0)^2} = \sqrt{4.0^2 + 2.1^2} = \sqrt{16.0 + 4.41} = \sqrt{20.41} \approx 4.5177\text{ m}$.
  Wait, at $t = 1.0$, $f(1.0) = 4.5177 - 2.0 = +2.5177 > 0$. The projectile is not yet inside at $t = 1.0\text{ s}$!
  Let's check $t = 0.8\text{ s}$:
  $\mathbf{x}(0.8) = [16.0, 15.0(0.8) - 4.9(0.64)]^T = [16.0, 12.0 - 3.136]^T = [16.0, 8.864]^T$.
  $\|\mathbf{x}(0.8) - \mathbf{c}\| = \sqrt{0^2 + (8.864 - 8.0)^2} = 0.864\text{ m}$.
  $f(0.8) = 0.864 - 2.0 = -1.136\text{ m} < 0$ (Inside!).

We initialize the bisection bracket to $[t_{\text{low}}, t_{\text{high}}] = [0.0, 0.8]\text{ s}$.

**Iteration 1:**
- $t_{\text{mid}, 1} = \frac{0.0 + 0.8}{2} = 0.40\text{ s}$.
- Position: $\mathbf{x}(0.4) = [20.0(0.4), 15.0(0.4) - 4.9(0.16)]^T = [8.0, 6.0 - 0.784]^T = [8.0, 5.216]^T$.
- Distance to center:
  $\|\mathbf{x}(0.4) - \mathbf{c}\| = \sqrt{(8.0 - 16.0)^2 + (5.216 - 8.0)^2} = \sqrt{(-8.0)^2 + (-2.784)^2} = \sqrt{64.0 + 7.7506} = \sqrt{71.7506} \approx 8.4706\text{ m}$.
  $f(0.4) = 8.4706 - 2.0 = +6.4706\text{ m} > 0$.
- Because $f(0.4) > 0$, set $t_{\text{low}} = 0.40\text{ s}$. New bracket: $[0.40, 0.80]\text{ s}$.

**Iteration 2:**
- $t_{\text{mid}, 2} = \frac{0.40 + 0.80}{2} = 0.60\text{ s}$.
- Position: $\mathbf{x}(0.6) = [20.0(0.6), 15.0(0.6) - 4.9(0.36)]^T = [12.0, 9.0 - 1.764]^T = [12.0, 7.236]^T$.
- Distance to center:
  $\|\mathbf{x}(0.6) - \mathbf{c}\| = \sqrt{(12.0 - 16.0)^2 + (7.236 - 8.0)^2} = \sqrt{(-4.0)^2 + (-0.764)^2} = \sqrt{16.0 + 0.5837} = \sqrt{16.5837} \approx 4.0723\text{ m}$.
  $f(0.6) = 4.0723 - 2.0 = +2.0723\text{ m} > 0$.
- Because $f(0.6) > 0$, set $t_{\text{low}} = 0.60\text{ s}$. New bracket: $[0.60, 0.80]\text{ s}$.

**Iteration 3:**
- $t_{\text{mid}, 3} = \frac{0.60 + 0.80}{2} = 0.70\text{ s}$.
- Position: $\mathbf{x}(0.7) = [20.0(0.7), 15.0(0.7) - 4.9(0.49)]^T = [14.0, 10.5 - 2.401]^T = [14.0, 8.099]^T$.
- Distance to center:
  $\|\mathbf{x}(0.7) - \mathbf{c}\| = \sqrt{(14.0 - 16.0)^2 + (8.099 - 8.0)^2} = \sqrt{(-2.0)^2 + (0.099)^2} = \sqrt{4.0 + 0.0098} = \sqrt{4.0098} \approx 2.00245\text{ m}$.
  $f(0.7) = 2.00245 - 2.0 = +0.00245\text{ m} > 0$.
- Because $f(0.7) > 0$, set $t_{\text{low}} = 0.70\text{ s}$. New bracket: $[0.70, 0.80]\text{ s}$.

At $t = 0.70\text{ s}$, the distance is $2.00245\text{ m}$, which is within $2.5\text{ mm}$ of the field surface!

---

### Example 9: Speculative Contact Distance and Impulse Clamping Formulation
**Problem Statement:**
A block of mass $m = 2.0\text{ kg}$ is moving toward a rigid static wall with velocity $v_0 = 8.0\text{ m/s}$ along normal $\hat{\mathbf{n}} = [1.0, 0.0]^T$.
At time $t_k$, the block is at a separation distance of $d = 0.06\text{ m}$ outside the wall.
The physics engine runs at $\Delta t = 0.02\text{ s}$ ($50\text{ Hz}$).
1. Show that discrete integration without speculative contacts results in severe penetration at $t_{k+1}$.
2. Formulate the speculative contact velocity constraint.
3. Compute the required speculative impulse $J_{\text{spec}}$ to clamp the velocity, and verify the post-step position.

**Solution:**

**Step 1: Unconstrained Discrete Step**
Without constraint intervention:

$$\Delta x = v_0 \Delta t = 8.0\text{ m/s} \times 0.02\text{ s} = 0.16\text{ m}$$

The post-step position relative to the wall face is:

$$\text{pos}_{k+1} = d - \Delta x = 0.06\text{ m} - 0.16\text{ m} = -0.10\text{ m}$$

The block penetrates $10\text{ cm}$ deep into the wall!

**Step 2: Speculative Contact Velocity Constraint**
The contact constraint requires that post-step distance be at least zero:

$$d + v_{\text{new}} \Delta t \ge 0 \implies v_{\text{new}} \ge -\frac{d}{\Delta t}$$

The maximum allowable approach speed is:

$$v_{\text{allowed}} = \frac{d}{\Delta t} = \frac{0.06\text{ m}}{0.02\text{ s}} = 3.0\text{ m/s}$$

Because $v_0 = 8.0\text{ m/s} > 3.0\text{ m/s}$, the velocity must be decelerated from $8.0\text{ m/s}$ down to $3.0\text{ m/s}$.

**Step 3: Compute Speculative Impulse**
The impulse equation is:

$$\Delta v = v_{\text{target}} - v_0 = 3.0\text{ m/s} - 8.0\text{ m/s} = -5.0\text{ m/s}$$

$$J_{\text{spec}} = m \Delta v = 2.0\text{ kg} \times (-5.0\text{ m/s}) = -10.0\text{ N}\cdot\text{s}$$

The post-impulse velocity of the block during step $k$ is $v = 3.0\text{ m/s}$.
The position at $t_{k+1}$ is:

$$\text{pos}_{k+1} = d - v \Delta t = 0.06\text{ m} - (3.0\text{ m/s} \times 0.02\text{ s}) = 0.06\text{ m} - 0.06\text{ m} = 0.000\text{ m}$$

The block arrives perfectly flush at the wall surface with zero penetration and zero tunneling!

---

### Example 10: Sub-Stepping Budgeting and Performance Trade-Off
**Problem Statement:**
A physics world contains $N = 200$ dynamic rigid bodies. Among them, $M = 5$ are high-speed sniper bullets traveling at $v \approx 800\text{ m/s}$. The simulation frame budget is $\Delta t = 0.01667\text{ s}$ ($60\text{ Hz}$).
A full physics step of the entire world with $N = 200$ bodies takes $T_{\text{world}} = 1.80\text{ ms}$.
A swept-volume ray-cast for a single bullet takes $T_{\text{bullet}} = 0.04\text{ ms}$.
1. If the engine handles tunneling by globally sub-stepping the entire world at 10 sub-steps per frame, calculate the total world update time and determine if the $60\text{ Hz}$ frame budget ($16.67\text{ ms}$) is exceeded if rendering takes $8.0\text{ ms}$.
2. If instead the engine uses CCD ray-casting only for the $M = 5$ high-speed bullets while running the rest of the world at standard $1\times$ stepping, calculate the total physics update time and the resulting CPU speedup.

**Solution:**

**Step 1: Global Sub-Stepping Evaluation**
With $K = 10$ sub-steps for the entire world:

$$T_{\text{physics, global}} = K \times T_{\text{world}} = 10 \times 1.80\text{ ms} = 18.00\text{ ms}$$

Total frame time:

$$T_{\text{frame}} = T_{\text{physics}} + T_{\text{render}} = 18.00\text{ ms} + 8.00\text{ ms} = 26.00\text{ ms}$$

Maximum attainable frame rate:

$$\text{FPS} = \frac{1000\text{ ms}}{26.00\text{ ms}} \approx 38.46\text{ Hz}$$

The engine drops below $60\text{ Hz}$ (frame drop of $35.9\%$), inducing severe visual stutter.

**Step 2: Selective CCD Ray-Casting Evaluation**
Running $1\times$ step for the world ($1.80\text{ ms}$) plus selective ray-casting for the $M = 5$ fast bullets:

$$T_{\text{physics, selective}} = T_{\text{world}} + M \times T_{\text{bullet}} = 1.80\text{ ms} + 5 \times 0.04\text{ ms} = 1.80\text{ ms} + 0.20\text{ ms} = 2.00\text{ ms}$$

Total frame time:

$$T_{\text{frame}} = 2.00\text{ ms} + 8.00\text{ ms} = 10.00\text{ ms} < 16.67\text{ ms}$$

Attainable frame rate:

$$\text{FPS} = \frac{1000\text{ ms}}{10.00\text{ ms}} = 100.0\text{ Hz}$$

Speedup in physics computation:

$$\text{Speedup} = \frac{T_{\text{physics, global}}}{T_{\text{physics, selective}}} = \frac{18.00\text{ ms}}{2.00\text{ ms}} = 9.00\times$$

**Conclusion:**
Selective CCD provides a $9\times$ performance advantage over global brute-force sub-stepping, comfortably staying within the $60\text{ Hz}$ budget with $6.67\text{ ms}$ of headroom remaining.

---

## 9.8 Chapter Mastery Exercises

### Tier 1: Intuition & Foundational Principles
1. **Exercise 9.1:** A soccer ball of radius $r = 0.11\text{ m}$ is kicked at $v = 30.0\text{ m/s}$. The simulation runs at $30\text{ Hz}$. A goal net is modeled as a plane with an effective detection tolerance of $0.05\text{ m}$. Compute the displacement per step and show whether the ball can tunnel through the net.
2. **Exercise 9.2:** Explain why rotating objects require the angular velocity term $\omega R$ in the Conservative Advancement approach velocity bound $v_{\text{rel}}^{\max}$, whereas pure translations do not.

### Tier 2: Analytical Swept Volumes
3. **Exercise 9.3:** A circular disc of radius $r = 0.20\text{ m}$ moves from $\mathbf{c}_0 = [0.0, 0.0]^T\text{ m}$ to $\mathbf{c}_1 = [5.0, 0.0]^T\text{ m}$. A stationary point pin is located at $\mathbf{q} = [2.5, 0.15]^T\text{ m}$. Determine whether the disc hits the pin, and calculate the exact time parameter $\lambda^*$.
4. **Exercise 9.4:** A disc of radius $r = 0.50\text{ m}$ travels along the path $\mathbf{c}(t) = [t, 2t]^T\text{ m}$. Find the distance from the center trajectory line to the origin $[0, 0]^T$ and determine if the disc covers the origin at any time.

### Tier 3: Ray Casting & Slab Methods
5. **Exercise 9.5:** A ray with origin $\mathbf{p} = [0.0, 0.0]^T$ and unit direction $\hat{\mathbf{d}} = [1.0, 0.0]^T$ is fired toward a circular obstacle centered at $\mathbf{c} = [10.0, 0.0]^T$ with radius $r = 2.0\text{ m}$. Compute the exact entry parameter $t_1$, exit parameter $t_2$, and the normal at entry.
6. **Exercise 9.6:** An AABB is defined by $[-2.0, 2.0] \times [-2.0, 2.0]$. A ray starts at $\mathbf{p} = [-5.0, 0.0]^T$ with direction $\mathbf{d} = [2.0, 1.0]^T$. Compute $t_{\text{enter}}$ and $t_{\text{exit}}$ using the slab method.

### Tier 4: Time-of-Impact & Root Finding
7. **Exercise 9.7:** Two identical circular discs of radius $r = 0.5\text{ m}$ move directly toward each other along the $x$-axis. At $t = 0$, $\mathbf{c}_A = [-5.0, 0.0]^T$ with $v_A = 4.0\text{ m/s}$, and $\mathbf{c}_B = [5.0, 0.0]^T$ with $v_B = -6.0\text{ m/s}$. Find the analytical Time of Impact $t^*$ to 4 decimal places.
8. **Exercise 9.8:** For the two discs in Exercise 9.7, carry out 2 manual iterations of Conservative Advancement with $\epsilon = 0.02\text{ m}$.

### Tier 5: Speculative Contacts & Architecture
9. **Exercise 9.9:** A particle of mass $m = 1.5\text{ kg}$ has speed $v = 12.0\text{ m/s}$ toward a wall located at distance $d = 0.08\text{ m}$. Time step $\Delta t = 0.01667\text{ s}$. Compute the speculative contact impulse required to prevent penetration.
10. **Exercise 9.10:** In a multi-body physics engine, describe the failure mode known as "ghost collisions" caused by speculative contacts, and devise an algorithmic filter to mitigate it.

---

## 9.9 Complete Step-by-Step Solutions to Chapter Exercises

### Solution 9.1
- Ball radius $r = 0.11\text{ m}$.
- Speed $v = 30.0\text{ m/s}$.
- Time step $\Delta t = \frac{1}{30}\text{ s} \approx 0.03333\text{ s}$.
- Displacement per tick: $\Delta x = v \Delta t = 30.0 \times \frac{1}{30} = 1.000\text{ m}$.
- The effective detection thickness of the net is $W_{\text{eff}} = w + 2r = 0.05 + 2(0.11) = 0.27\text{ m}$.
- Since $\Delta x = 1.000\text{ m} > W_{\text{eff}} = 0.27\text{ m}$, the displacement per tick is over $3.7\times$ the net's thickness.
- If the ball is more than $0.05\text{ m}$ outside the net at frame $k$, it will leap completely past the net at frame $k+1$. Tunneling will occur with a probability of approximately $(1.00 - 0.27) / 1.00 = 73\%$. $\blacksquare$

### Solution 9.2
- A rigid body undergoing rotation has surface points moving with linear velocity $\mathbf{v}_{\text{point}} = \mathbf{v}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}$.
- The magnitude of the tangential velocity for a point at distance $R$ from the center of mass is $\|\boldsymbol{\omega} \times \mathbf{r}\| = |\omega| R$.
- In the worst-case scenario, the point on the perimeter moves directly toward the obstacle along the collision normal. By the triangle inequality:

$$\|\mathbf{v}_{\text{point}}\| \le \|\mathbf{v}_{\text{cm}}\| + |\omega| R$$

- If $|\omega| R$ were omitted, the estimated approach speed would be strictly lower than the actual physical approach speed, which would cause $\Delta t_{\text{safe}} = \frac{d - \epsilon}{v_{\text{rel}}^{\max}}$ to be overestimated, violating the non-penetration guarantee and allowing tunneling to occur. $\blacksquare$

### Solution 9.3
- Segment $\mathbf{u} = \mathbf{c}_1 - \mathbf{c}_0 = [5.0, 0.0]^T$.
- Point $\mathbf{q} = [2.5, 0.15]^T$.
- Vector $\mathbf{w} = \mathbf{q} - \mathbf{c}_0 = [2.5, 0.15]^T$.
- Projection parameter:

$$\lambda^* = \frac{\mathbf{w} \cdot \mathbf{u}}{\|\mathbf{u}\|^2} = \frac{(2.5)(5.0) + (0.15)(0.0)}{5.0^2} = \frac{12.5}{25.0} = 0.500$$

- Closest point on segment: $\mathbf{p}^* = \mathbf{c}_0 + 0.500 \mathbf{u} = [2.5, 0.0]^T$.
- Distance from $\mathbf{p}^*$ to pin $\mathbf{q}$:

$$d = \|\mathbf{q} - \mathbf{p}^*\| = \sqrt{(2.5 - 2.5)^2 + (0.15 - 0.0)^2} = 0.15\text{ m}$$

- Clearance distance to disc surface:

$$d_{\text{clearance}} = d - r = 0.15\text{ m} - 0.20\text{ m} = -0.05\text{ m} \le 0$$

- Because $d_{\text{clearance}} < 0$, the disc hits the pin at normalized time $\lambda^* = 0.500$. $\blacksquare$

### Solution 9.4
- The trajectory line is $\mathbf{c}(t) = t [1, 2]^T$.
- The origin is $\mathbf{0} = [0, 0]^T$.
- At $t = 0$, $\mathbf{c}(0) = [0, 0]^T$.
- The distance from the center trajectory line to the origin is zero ($d = 0$).
- Since the disc radius is $r = 0.50\text{ m}$, the disc covers the origin for all $t$ satisfying $\|\mathbf{c}(t)\| \le 0.50\text{ m}$:

$$\sqrt{t^2 + (2t)^2} \le 0.50 \implies \sqrt{5 t^2} \le 0.50 \implies |t| \sqrt{5} \le 0.50 \implies |t| \le \frac{0.50}{\sqrt{5}} \approx 0.2236\text{ s}$$

- Thus, the disc covers the origin throughout the interval $t \in [-0.2236\text{ s}, +0.2236\text{ s}]$. $\blacksquare$

### Solution 9.5
- Ray origin $\mathbf{p} = [0, 0]^T$, $\hat{\mathbf{d}} = [1, 0]^T$.
- Circle center $\mathbf{c} = [10, 0]^T$, radius $r = 2.0\text{ m}$.
- Vector $\mathbf{m} = \mathbf{p} - \mathbf{c} = [-10, 0]^T$.
- Coefficients:
  $b = \mathbf{m} \cdot \hat{\mathbf{d}} = -10(1) + 0(0) = -10$.
  $c = \mathbf{m} \cdot \mathbf{m} - r^2 = (-10)^2 + 0^2 - 2.0^2 = 100 - 4 = 96$.
- Discriminant: $\Delta = b^2 - c = (-10)^2 - 96 = 100 - 96 = 4$.
- Roots:

$$t_1 = -b - \sqrt{\Delta} = 10 - 2 = 8.0\text{ m}$$

$$t_2 = -b + \sqrt{\Delta} = 10 + 2 = 12.0\text{ m}$$

- Entry point: $\mathbf{p}_{\text{hit}} = \mathbf{p} + t_1 \hat{\mathbf{d}} = [8.0, 0.0]^T\text{ m}$.
- Entry normal:

$$\mathbf{n} = \frac{\mathbf{p}_{\text{hit}} - \mathbf{c}}{r} = \frac{[8.0 - 10.0, 0.0]^T}{2.0} = \frac{[-2.0, 0.0]^T}{2.0} = [-1.0, 0.0]^T$$

$\blacksquare$

### Solution 9.6
- AABB: $x \in [-2.0, 2.0]$, $y \in [-2.0, 2.0]$.
- Ray: $\mathbf{p} = [-5.0, 0.0]^T$, $\mathbf{d} = [2.0, 1.0]^T$.
- $X$-slab:

$$t_{x1} = \frac{-2.0 - (-5.0)}{2.0} = \frac{3.0}{2.0} = 1.50\text{ s}, \quad t_{x2} = \frac{2.0 - (-5.0)}{2.0} = \frac{7.0}{2.0} = 3.50\text{ s}$$

$$t_{x,\text{near}} = 1.50\text{ s}, \quad t_{x,\text{far}} = 3.50\text{ s}$$

- $Y$-slab:

$$t_{y1} = \frac{-2.0 - 0.0}{1.0} = -2.00\text{ s}, \quad t_{y2} = \frac{2.0 - 0.0}{1.0} = 2.00\text{ s}$$

$$t_{y,\text{near}} = -2.00\text{ s}, \quad t_{y,\text{far}} = 2.00\text{ s}$$

- Composite:

$$t_{\text{enter}} = \max(t_{x,\text{near}}, t_{y,\text{near}}) = \max(1.50, -2.00) = 1.50\text{ s}$$

$$t_{\text{exit}} = \min(t_{x,\text{far}}, t_{y,\text{far}}) = \min(3.50, 2.00) = 2.00\text{ s}$$

- Since $t_{\text{enter}} \le t_{\text{exit}}$ ($1.50 \le 2.00$) and $t_{\text{exit}} \ge 0$, the ray hits the box at $t^* = 1.50\text{ s}$.
- Hit point: $\mathbf{p}_{\text{hit}} = [-5.0, 0.0]^T + 1.50 [2.0, 1.0]^T = [-2.0, 1.50]^T\text{ m}$. $\blacksquare$

### Solution 9.7
- Trajectories:
  $\mathbf{c}_A(t) = [-5.0 + 4.0 t, 0.0]^T$
  $\mathbf{c}_B(t) = [5.0 - 6.0 t, 0.0]^T$
- Distance between centers:

$$D(t) = (5.0 - 6.0 t) - (-5.0 + 4.0 t) = 10.0 - 10.0 t$$

- Contact condition:

$$D(t^*) = r_A + r_B = 0.50 + 0.50 = 1.00\text{ m}$$

$$10.0 - 10.0 t^* = 1.00 \implies 10.0 t^* = 9.00 \implies t^* = 0.9000\text{ s}$$

$\blacksquare$

### Solution 9.8
- Parameters: $r_A = r_B = 0.5\text{ m}$, $v_{\text{rel}}^{\max} = 4.0 + 6.0 = 10.0\text{ m/s}$, $\epsilon = 0.02\text{ m}$.
- **Iteration 1 ($t_0 = 0$):**
  $D_0 = 10.0\text{ m}$.
  Separation $d_0 = D_0 - (r_A + r_B) = 10.0 - 1.0 = 9.000\text{ m}$.
  Safe step:

$$\Delta t_0 = \frac{d_0 - \epsilon}{v_{\text{rel}}^{\max}} = \frac{9.000 - 0.020}{10.0} = \frac{8.980}{10.0} = 0.8980\text{ s}$$

  New time: $t_1 = 0.8980\text{ s}$.
- **Iteration 2 ($t_1 = 0.8980\text{ s}$):**
  $\mathbf{c}_A(t_1) = -5.0 + 4.0(0.8980) = -5.0 + 3.592 = -1.408\text{ m}$.
  $\mathbf{c}_B(t_1) = 5.0 - 6.0(0.8980) = 5.0 - 5.388 = -0.388\text{ m}$.
  Distance $D_1 = -0.388 - (-1.408) = 1.020\text{ m}$.
  Separation $d_1 = 1.020 - 1.000 = 0.020\text{ m}$.
  Since $d_1 = 0.020\text{ m} \le \epsilon = 0.020\text{ m}$, the algorithm terminates at $t = 0.8980\text{ s}$, which is within $0.002\text{ s}$ of the exact root ($0.9000\text{ s}$). $\blacksquare$

### Solution 9.9
- Mass $m = 1.5\text{ kg}$, speed $v = 12.0\text{ m/s}$.
- Distance $d = 0.08\text{ m}$, $\Delta t = 0.01667\text{ s}$.
- Maximum allowable approach velocity to prevent penetration:

$$v_{\text{target}} = \frac{d}{\Delta t} = \frac{0.08\text{ m}}{0.01667\text{ s}} \approx 4.80\text{ m/s}$$

- Required change in velocity:

$$\Delta v = v_{\text{target}} - v = 4.80 - 12.00 = -7.20\text{ m/s}$$

- Required impulse:

$$J = m \Delta v = 1.5\text{ kg} \times (-7.20\text{ m/s}) = -10.80\text{ N}\cdot\text{s}$$

$\blacksquare$

### Solution 9.10
- **Ghost Collision Mechanism:**
  Speculative contacts generate braking impulses during step $t_k$ based on the assumption of unperturbed linear motion over the entire interval $\Delta t$. If the approaching body is simultaneously subjected to an external force (such as a lateral blast, steering input, or an orthogonal collision) that turns it away from the obstacle before it reaches it, the speculative constraint has already removed kinetic energy along the obstacle normal. The body appears to hit an invisible wall in empty space ("ghost braking").
- **Algorithmic Mitigation:**
  1. **Distance-Based Activation Window:** Only activate speculative contacts when predicted penetration $\delta_{\text{pred}} = v_{\text{rel}} \Delta t - d$ is significant and distance $d$ is less than a small threshold (e.g., $d < 0.5 v \Delta t$).
  2. **Unilateral Impulse Cancellation:** In the iterative impulse solver, if the relative separating velocity becomes positive due to other constraints during the iteration loops, clamp the accumulated speculative impulse to zero immediately: $J_{\text{spec}} = \max(0, J_{\text{spec}})$.
  3. **Feature Pair Hysteresis:** Track geometric feature IDs so that speculative contacts are discarded if the closest feature pair changes topology before contact occurs. $\blacksquare$
