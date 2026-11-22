# Chapter 11: Computational Impulse Resolution and Contact Solvers

> "To the theoretical physicist, a collision is an infinitesimal boundary between past and future states. To the simulation engine architect, it is a discrete linear complementarity problem subject to penetration constraints, unilateral impulses, and numerical stability bounds."  
> — Principles of Modern Physics Simulation

---

## 1. Introduction: From Continuous Physics to Discrete Engines

Throughout the previous ten chapters, our mathematical formulations operated in the continuum of time: forces integrated seamlessly over differentials $dt$, velocities updated instantaneously upon impact, and surfaces interacted with exact geometric precision.

However, when programming interactive physics simulators, video game engines (such as Box2D, Bullet, PhysX, or Havok), or robotics simulators (such as MuJoCo or Drake), the computer cannot integrate continuous time. Instead, the simulation advances in **discrete temporal steps** $\Delta t$ (typically $\Delta t = 1/60\text{ s} \approx 16.67\text{ ms}$ or $\Delta t = 1/120\text{ s} \approx 8.33\text{ ms}$).

This temporal discretization introduces profound computational challenges:
1. **Interpenetration (Sinking):** Bodies moving in discrete position jumps step past one another between frames, overlapping by a finite penetration depth $d > 0$.
2. **Tunneling:** High-speed bullets pass entirely through thin walls in a single time-step without any collision being detected.
3. **Simultaneous Multi-Body Contradictions:** When five billiard balls or a stack of resting boxes touch at the same instant, standard two-body formulas fail because impulses propagate through the entire contact graph simultaneously.
4. **Energy Injection (Numerical Jitter):** Naive velocity or position adjustments violate conservation laws, pumping spurious energy into the system and causing resting objects to violently explode apart.

To overcome these hurdles, modern computational mechanics employs **Impulse-Based Contact Solvers**. In this chapter, we derive the exact equations used by production physics engines to compute collision impulses, apply Coulomb friction constraints, stabilize penetration drift via Baumgarte stabilization, and solve complex multi-body contact networks using iterative Sequential Impulses.

---

## 2. The Architecture of a Modern Physics Engine

The execution loop of a real-time rigid body engine executes a multi-stage pipeline each frame:

```
  +-------------------------------------------------------------+
  | 1. Numerical Integration: Integrate External Forces         |
  |    v(t + dt) = v(t) + (F_ext / m) * dt                      |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 2. Broadphase Collision Detection                           |
  |    Identify potential colliding pairs using Bounding Boxes   |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 3. Narrowphase Collision Detection                          |
  |    Compute exact contact manifold: normal n, penetration d  |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 4. Velocity Contact Solver (Sequential Impulses)           |
  |    Iteratively solve normal impulses J_n & friction J_t     |
  +-------------------------------------------------------------+
                                |
                                v
  +-------------------------------------------------------------+
  | 5. Position Integration & Baumgarte Stabilization           |
  |    x(t + dt) = x(t) + v(t + dt) * dt                        |
  +-------------------------------------------------------------+
```

---

## 3. Derivation of the Single-Point Normal Impulse Scalar ($J_n$)

Consider two rigid bodies, Body 1 and Body 2, with masses $m_1, m_2$ and velocities $\vec{v}_1, \vec{v}_2$. Let them collide at a contact point with unit normal $\hat{n}$ pointing from Body 1 to Body 2.

```
                  Body 1 (m1, v1)        Body 2 (m2, v2)
                      (  O1  )              (  O2  )
                         \                      /
                          \                    /
                           \      Contact     /
                            \        *       /
                             +-------|------+
                                     |
                                     v Normal n (points 1 -> 2)
```

### 3.1 Relative Contact Velocity

Define the **relative velocity** of Body 1 with respect to Body 2:
$$\vec{v}_{\text{rel}} \equiv \vec{v}_1 - \vec{v}_2$$

The relative velocity component along the normal line of impact $\hat{n}$ is:
$$v_n \equiv \vec{v}_{\text{rel}} \cdot \hat{n} = (\vec{v}_1 - \vec{v}_2) \cdot \hat{n}$$

- **Case 1: $v_n > 0$ (Separating):** Body 1 is moving in the direction of $\hat{n}$ faster than Body 2, or Body 2 is moving away. The bodies are already separating; **no impulse is applied** ($J_n = 0$).
- **Case 2: $v_n = 0$ (Resting Contact):** The bodies are in continuous contact without approaching or separating.
- **Case 3: $v_n < 0$ (Approaching):** The bodies are moving toward each other; an impulse must be delivered along $\hat{n}$ to prevent interpenetration.

### 3.2 Action-Reaction Impulse Pair

By Newton's Third Law, the collision delivers an impulse vector $\vec{J} = J_n \hat{n}$ to Body 1 and $-\vec{J} = -J_n \hat{n}$ to Body 2:
$$\vec{v}_1' = \vec{v}_1 - \frac{J_n}{m_1} \hat{n} = \vec{v}_1 - w_1 J_n \hat{n}$$
$$\vec{v}_2' = \vec{v}_2 + \frac{J_n}{m_2} \hat{n} = \vec{v}_2 + w_2 J_n \hat{n}$$
where $w_1 \equiv 1/m_1$ and $w_2 \equiv 1/m_2$ are the **inverse masses**. (Notice the elegant computational convenience: an immovable, anchored obstacle or wall has $m \to \infty \implies w = 0$, requiring zero special-case logic!).

### 3.3 Enforcing Newton's Restitution Law

The relative normal velocity after the impulse is:
$$v_n' = (\vec{v}_1' - \vec{v}_2') \cdot \hat{n}$$
Substitute the updated velocities:
$$v_n' = \left[(\vec{v}_1 - w_1 J_n \hat{n}) - (\vec{v}_2 + w_2 J_n \hat{n})\right] \cdot \hat{n}$$
$$v_n' = (\vec{v}_1 - \vec{v}_2) \cdot \hat{n} - (w_1 + w_2) J_n (\hat{n} \cdot \hat{n})$$
Since $\hat{n}$ is a unit vector ($\hat{n} \cdot \hat{n} = 1$):
$$v_n' = v_n - (w_1 + w_2) J_n$$

We require the post-collision normal relative velocity to satisfy Newton's empirical restitution coefficient $e \in [0, 1]$:
$$v_n' = -e\,v_n$$

Equating the two expressions:
$$-e\,v_n = v_n - (w_1 + w_2) J_n$$
$$(w_1 + w_2) J_n = v_n + e\,v_n = (1 + e) v_n$$

Solving for the normal impulse scalar $J_n$:

$$\mathbf{J_n = \frac{-(1 + e) v_n}{w_1 + w_2} = \frac{-(1 + e)(\vec{v}_{\text{rel}} \cdot \hat{n})}{\frac{1}{m_1} + \frac{1}{m_2}}}$$

### 3.4 Unilateral Impulse Inequality (The Complementarity Constraint)

In physical contact, surfaces can only **push** each other; they cannot exert tensile attraction to pull each other together. Therefore, the normal impulse must strictly obey the **unilateral constraint**:
$$J_n \ge 0$$

In code, this is enforced by clamping:
$$J_n = \max\left(0, \frac{-(1 + e) v_n}{w_1 + w_2}\right)$$

---

## 4. Friction Formulation: Tangential Impulse and Coulomb Clamping

Friction acts along the contact plane perpendicular to the normal, opposing relative sliding motion.

### 4.1 Contact Tangent Vector ($\hat{t}$)

Compute the tangential relative velocity:
$$\vec{v}_t = \vec{v}_{\text{rel}} - (\vec{v}_{\text{rel}} \cdot \hat{n})\hat{n} = \vec{v}_{\text{rel}} - v_n \hat{n}$$

- If $\|\vec{v}_t\| < 10^{-6}\text{ m/s}$, there is no relative sliding; $\hat{t} = \vec{0}$ and friction impulse is zero.
- Otherwise, the unit tangent vector is:
  $$\hat{t} = \frac{\vec{v}_t}{\|\vec{v}_t\|}$$
  The scalar tangential speed is:
  $$v_t = \vec{v}_{\text{rel}} \cdot \hat{t} = \|\vec{v}_t\| > 0$$

### 4.2 Unclamped (Sticking) Friction Impulse

To cancel relative sliding completely ($v_t' = 0$), we compute the required tangential impulse $J_t$:
$$v_t' = v_t - (w_1 + w_2) J_t = 0 \implies J_{t, \text{stick}} = \frac{v_t}{w_1 + w_2}$$

### 4.3 Coulomb's Friction Law Clamping

According to Coulomb's friction model, the maximum tangential shear force that dry friction can support is bounded by the normal force: $F_t \le \mu F_n$. Integrating over time yields the impulse bound:
$$|J_t| \le \mu J_n$$

Therefore, the applied friction impulse is:

$$\mathbf{J_t = \min\left(J_{t, \text{stick}}, \mu J_n\right)}$$

- **Static Friction (Stick):** If $J_{t, \text{stick}} \le \mu J_n$, friction is strong enough to arrest sliding completely; $J_t = J_{t, \text{stick}}$.
- **Dynamic Friction (Slip):** If $J_{t, \text{stick}} > \mu J_n$, the surfaces slip against each other; friction delivers its maximum permissible magnitude $J_t = \mu J_n$.

### 4.4 Applying the Total Impulse Vector

The total impulse vector delivered to Body 1 is:
$$\vec{J}_{\text{total}} = -J_n \hat{n} - J_t \hat{t}$$
The total impulse delivered to Body 2 is:
$$\vec{J}_{2, \text{total}} = -\vec{J}_{\text{total}} = +J_n \hat{n} + J_t \hat{t}$$

Velocity updates:
$$\vec{v}_1' = \vec{v}_1 + w_1 \vec{J}_{\text{total}}$$
$$\vec{v}_2' = \vec{v}_2 - w_2 \vec{J}_{\text{total}}$$

---

## 5. Positional Stabilization: Resolving Interpenetration Drift

In discrete time-stepping, simply adjusting velocities is insufficient. Because collisions are detected *after* penetration has already occurred, two bodies will remain overlapping if only their velocities are reversed. Over multiple frames, resting stacks will sink into floors (the notorious **sinking bug**).

```
                      Penetration depth d > 0
                      +--------+
                      | Body 1 |
                      |    +---|----+
                      +----|---+    |
                           | Body 2 |
                           +--------+
```

### 5.1 Strategy 1: Position Projection (Geometric Teleportation)

The most direct fix is to separate the bodies along $\hat{n}$ by the penetration depth $d = (R_1 + R_2) - \|\vec{r}_2 - \vec{r}_1\|$:
$$\vec{r}_1' = \vec{r}_1 - \frac{w_1}{w_1 + w_2} d\,\hat{n}$$
$$\vec{r}_2' = \vec{r}_2 + \frac{w_2}{w_1 + w_2} d\,\hat{n}$$

While physically intuitive, pure position projection suffers from serious flaws:
- Teleporting bodies directly alters positions without updating velocities, causing velocity-position de-synchronization.
- In multi-body stacks, pushing Body 2 out of Body 1 pushes it deeper into Body 3, causing violent visual jitter and energy creation.

### 5.2 Strategy 2: Baumgarte Stabilization (Velocity Bias)

In 1972, the German mechanician J. Baumgarte proposed adding a **corrective bias velocity** directly into the velocity constraint equation.

Instead of targeting $v_n' = -e\,v_n$, we target:
$$v_n' = -e\,v_n + v_{\text{bias}}$$
where:
$$\mathbf{v_{\text{bias}} = \frac{\beta}{\Delta t} \max(0, d - d_{\text{slop}})}$$
- $\beta \in [0.1, 0.3]$ is the dimensionless **Baumgarte stabilization factor** (typically $\beta = 0.2$).
- $d_{\text{slop}}$ is a tiny penetration allowance (typically $0.001\text{ to }0.005\text{ m}$) that prevents chatter from microscopic floating-point rounding errors.
- $\Delta t$ is the simulation time step.

With Baumgarte stabilization, the normal impulse formula becomes:

$$\mathbf{J_n = \max\left(0, \frac{-(1 + e) v_n + \frac{\beta}{\Delta t}\max(0, d - d_{\text{slop}})}{w_1 + w_2}\right)}$$

The beauty of Baumgarte stabilization is that penetration is removed gradually and smoothly over several frames purely through the existing velocity impulse solver, preserving physical stability!

---

## 6. Multi-Body Contact Networks and Sequential Impulses

When three or more bodies collide simultaneously—such as Newton's Cradle, a pool ball break, or a stack of resting crates—the collision impulses form a **Linear Complementarity Problem (LCP)**:
$$\mathbf{A}\,\vec{J} + \vec{b} \ge \vec{0}, \quad \vec{J} \ge \vec{0}, \quad \vec{J}^T (\mathbf{A}\,\vec{J} + \vec{b}) = 0$$

Solving this globally requires expensive matrix pivoting algorithms (Dantzig or Lemke), which scale as $\mathcal{O}(N^3)$ and are too slow for real-time physics engines.

### 6.1 The Sequential Impulse (Projected Gauss-Seidel) Algorithm

Pioneered for video games by Erin Catto (creator of Box2D), **Sequential Impulses** solves the contact network iteratively in $\mathcal{O}(N)$ time:

```
Algorithm: Sequential Impulses Solver
-------------------------------------
1. For each contact manifold c in ContactList:
     Initialize accumulated normal impulse: c.accumulated_Jn = 0
     Initialize accumulated tangent impulse: c.accumulated_Jt = 0

2. Loop Iteration = 1 to N_ITERATIONS (typically 10 to 20):
     For each contact c in ContactList:
       // Compute current relative normal velocity
       v_rel = (c.body1.v - c.body2.v) . c.normal
       
       // Compute delta impulse
       delta_Jn = (-(1 + e) * v_rel + v_bias) / (w1 + w2)
       
       // Accumulate and clamp to prevent negative impulses
       old_Jn = c.accumulated_Jn
       c.accumulated_Jn = max(0, old_Jn + delta_Jn)
       actual_delta_Jn = c.accumulated_Jn - old_Jn
       
       // Apply impulse delta to body velocities
       c.body1.v -= actual_delta_Jn * w1 * c.normal
       c.body2.v += actual_delta_Jn * w2 * c.normal
```

By sweeping through all contact pairs 10 to 20 times per frame, stress waves propagate through the multi-body network, converging rapidly to the exact physical solution!

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 11.1: Single Contact Normal Impulse Calculation
*In a 2D physics engine, Ball 1 ($m_1 = 2.00\text{ kg}$) moving at $\vec{v}_1 = (5.00\,\hat{i} + 0.00\,\hat{j})\text{ m/s}$ collides with Ball 2 ($m_2 = 3.00\text{ kg}$) moving at $\vec{v}_2 = (-2.00\,\hat{i} + 0.00\,\hat{j})\text{ m/s}$. The collision normal pointing from Ball 1 to Ball 2 is $\hat{n} = (1.00\,\hat{i} + 0.00\,\hat{j})$. The restitution coefficient is $e = 0.800$. (a) Determine the inverse masses $w_1$ and $w_2$. (b) Calculate the relative normal velocity $v_n$. (c) Compute the normal impulse scalar $J_n$. (d) Update the velocities of both bodies.*

#### Solution
1. **Part (a): Inverse Masses:**
   $$w_1 = \frac{1}{m_1} = \frac{1}{2.00} = \mathbf{0.500\text{ kg}^{-1}}$$
   $$w_2 = \frac{1}{m_2} = \frac{1}{3.00} \approx \mathbf{0.3333\text{ kg}^{-1}}$$
   $$w_1 + w_2 = 0.500 + 0.3333 = 0.8333\text{ kg}^{-1}$$
2. **Part (b): Relative Normal Velocity:**
   $$\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2 = (5.00 - (-2.00))\hat{i} = (7.00\,\hat{i})\text{ m/s}$$
   $$v_n = \vec{v}_{\text{rel}} \cdot \hat{n} = 7.00 \times 1.00 = \mathbf{+7.00\text{ m/s}}$$
   *(Note: By our convention where $\hat{n}$ points from 1 to 2, Ball 1 moves towards Ball 2 when its velocity along $\hat{n}$ is greater than Ball 2's, so they are approaching at $7.00\text{ m/s}$).*
3. **Part (c): Normal Impulse Scalar $J_n$:**
   $$J_n = \frac{(1 + e) v_n}{w_1 + w_2} = \frac{(1 + 0.800) \times 7.00}{0.8333} = \frac{1.800 \times 7.00}{0.8333} = \frac{12.60}{0.8333} \approx \mathbf{15.12\text{ N}\cdot\text{s}}$$
4. **Part (d): Update Velocities:**
   - Ball 1 (pushed in $-\hat{n}$ direction):
     $$\vec{v}_1' = \vec{v}_1 - w_1 J_n \hat{n} = (5.00\,\hat{i}) - (0.500 \times 15.12\,\hat{i}) = (5.00 - 7.56)\hat{i} = \mathbf{(-2.56\,\hat{i})\text{ m/s}}$$
   - Ball 2 (pushed in $+\hat{n}$ direction):
     $$\vec{v}_2' = \vec{v}_2 + w_2 J_n \hat{n} = (-2.00\,\hat{i}) + (0.3333 \times 15.12\,\hat{i}) = (-2.00 + 5.04)\hat{i} = \mathbf{(+3.04\,\hat{i})\text{ m/s}}$$
5. **Verification of Restitution:**
   $$v_n' = (v_{1x}' - v_{2x}') = -2.56 - 3.04 = -5.60\text{ m/s}$$
   $$\frac{-v_n'}{v_n} = \frac{-(-5.60)}{7.00} = \frac{5.60}{7.00} = 0.800 = e$$
   Matches restitution perfectly!

---

### Worked Example 11.2: Collision with an Immovable Infinite-Mass Boundary
*A ball of mass $m = 0.500\text{ kg}$ strikes a rigid boundary wall with velocity $\vec{v}_1 = (4.00\,\hat{i} - 6.00\,\hat{j})\text{ m/s}$. The wall is modeled as an immovable rigid body ($m_2 = \infty, \vec{v}_2 = \vec{0}$) with surface normal $\hat{n} = (0.00\,\hat{i} + 1.00\,\hat{j})$ pointing out of the wall. The coefficient of restitution is $e = 0.700$. Using the inverse mass formulation, calculate the impulse scalar $J_n$ and the final velocity vector of the ball.*

#### Solution
1. **Given:**
   - $w_1 = 1 / 0.500 = 2.00\text{ kg}^{-1}$
   - $w_2 = 1 / \infty = \mathbf{0.00\text{ kg}^{-1}}$ (Zero inverse mass for static boundary)
   - $w_{\text{total}} = w_1 + w_2 = 2.00 + 0.00 = 2.00\text{ kg}^{-1}$
2. **Relative Normal Velocity:**
   $$\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2 = (4.00\,\hat{i} - 6.00\,\hat{j})\text{ m/s}$$
   $$v_n = \vec{v}_{\text{rel}} \cdot \hat{n} = (4.00)(0) + (-6.00)(1.00) = -6.00\text{ m/s}$$
   (The ball is penetrating into the wall at $6.00\text{ m/s}$).
3. **Compute Impulse Scalar $J_n$:**
   $$J_n = \max\left(0, \frac{-(1 + e) v_n}{w_1 + w_2}\right) = \frac{-(1 + 0.700)(-6.00)}{2.00} = \frac{1.700 \times 6.00}{2.00} = \frac{10.20}{2.00} = \mathbf{5.10\text{ N}\cdot\text{s}}$$
4. **Update Ball Velocity:**
   $$\vec{v}_1' = \vec{v}_1 + w_1 J_n \hat{n} = (4.00\,\hat{i} - 6.00\,\hat{j}) + (2.00)(5.10)(0.00\,\hat{i} + 1.00\,\hat{j})$$
   $$\vec{v}_1' = 4.00\,\hat{i} + (-6.00 + 10.20)\hat{j} = \mathbf{(4.00\,\hat{i} + 4.20\,\hat{j})\text{ m/s}}$$
5. **Physical Insight:**
   The tangential velocity ($v_x = 4.00\text{ m/s}$) was completely unaffected, while the normal velocity reversed from $-6.00\text{ m/s}$ to $+4.20\text{ m/s}$ ($4.20 / 6.00 = 0.70 = e$). The infinite-mass boundary required zero special-case `if` branches!

---

### Worked Example 11.3: Contact Impulse with Coulomb Friction Clamping
*In a physics engine, a crate of mass $m_1 = 10.0\text{ kg}$ strikes a flat floor ($m_2 = \infty$) with velocity $\vec{v}_1 = (8.00\,\hat{i} - 4.00\,\hat{j})\text{ m/s}$. The floor normal is $\hat{n} = (0\,\hat{i} + 1\,\hat{j})$. The restitution is $e = 0.00$ (completely plastic normal impact), and the friction coefficient is $\mu = 0.400$. (a) Compute the normal impulse $J_n$. (b) Determine the tangent vector $\hat{t}$ and relative sliding speed $v_t$. (c) Compute the sticking friction impulse $J_{t, \text{stick}}$ and apply Coulomb clamping to find the actual friction impulse $J_t$. (d) Find the final velocity vector.*

#### Solution
1. **Given:**
   - $w_1 = 1 / 10.0 = 0.100\text{ kg}^{-1}$, $w_2 = 0 \implies w_{\text{total}} = 0.100\text{ kg}^{-1}$.
   - $v_n = \vec{v}_1 \cdot \hat{n} = -4.00\text{ m/s}$.
2. **Part (a): Normal Impulse:**
   $$J_n = \frac{-(1 + 0.00)(-4.00)}{0.100} = \frac{4.00}{0.100} = \mathbf{40.0\text{ N}\cdot\text{s}}$$
3. **Part (b): Tangent Vector and Sliding Speed:**
   - Tangential relative velocity:
     $$\vec{v}_t = \vec{v}_{\text{rel}} - v_n \hat{n} = (8.00\,\hat{i} - 4.00\,\hat{j}) - (-4.00\,\hat{j}) = (8.00\,\hat{i})\text{ m/s}$$
   - Unit tangent: $\hat{t} = (1.00\,\hat{i} + 0.00\,\hat{j})$.
   - Tangential sliding speed: $v_t = 8.00\text{ m/s}$.
4. **Part (c): Friction Impulse and Coulomb Clamping:**
   - Impulse required to completely arrest sliding:
     $$J_{t, \text{stick}} = \frac{v_t}{w_{\text{total}}} = \frac{8.00}{0.100} = 80.0\text{ N}\cdot\text{s}$$
   - Maximum allowable friction under Coulomb cone:
     $$J_{t, \max} = \mu J_n = 0.400 \times 40.0 = 16.0\text{ N}\cdot\text{s}$$
   - Since $J_{t, \text{stick}} = 80.0 > J_{t, \max} = 16.0$, the crate **slips**, and friction is clamped:
     $$\mathbf{J_t = J_{t, \max} = 16.0\text{ N}\cdot\text{s}}$$
5. **Part (d): Update Velocities:**
   - The friction impulse opposes sliding along $\hat{t}$: $\vec{J}_{\text{fric}} = -J_t \hat{t} = -16.0\,\hat{i}$.
   - The normal impulse pushes along $\hat{n}$: $\vec{J}_{\text{norm}} = +J_n \hat{n} = +40.0\,\hat{j}$.
   $$\vec{v}_1' = \vec{v}_1 + w_1 (\vec{J}_{\text{norm}} + \vec{J}_{\text{fric}}) = (8.00\,\hat{i} - 4.00\,\hat{j}) + 0.100(-16.0\,\hat{i} + 40.0\,\hat{j})$$
   $$\vec{v}_1' = (8.00 - 1.60)\hat{i} + (-4.00 + 4.00)\hat{j} = \mathbf{(6.40\,\hat{i} + 0.00\,\hat{j})\text{ m/s}}$$
   (The normal motion is eliminated, and the horizontal velocity is reduced from $8.00$ to $6.40\text{ m/s}$).

---

### Worked Example 11.4: Baumgarte Stabilization for Penetration Drift
*A ball of mass $m = 1.00\text{ kg}$ rests on the floor ($m_2 = \infty$). Due to gravity integration over time step $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$, the ball has penetrated the floor by depth $d = 0.020\text{ m}$ ($2.0\text{ cm}$) and has a downward velocity $v_n = -0.1633\text{ m/s}$. The slop tolerance is $d_{\text{slop}} = 0.002\text{ m}$, restitution is $e = 0.00$, and the Baumgarte coefficient is $\beta = 0.200$. (a) Calculate the Baumgarte bias velocity $v_{\text{bias}}$. (b) Compute the normal impulse $J_n$ with Baumgarte stabilization. (c) Compute the post-impulse vertical velocity $v_n'$.*

#### Solution
1. **Given:**
   - $w_1 = 1 / 1.00 = 1.00\text{ kg}^{-1}$, $w_2 = 0 \implies w_{\text{total}} = 1.00\text{ kg}^{-1}$.
   - $v_n = -0.1633\text{ m/s}$.
   - $d = 0.020\text{ m}$, $d_{\text{slop}} = 0.002\text{ m} \implies \text{excess penetration } d - d_{\text{slop}} = 0.018\text{ m}$.
   - $\Delta t = 0.01667\text{ s}$, $\beta = 0.200$.
2. **Part (a): Compute Baumgarte Bias Velocity:**
   $$v_{\text{bias}} = \frac{\beta}{\Delta t} (d - d_{\text{slop}}) = \frac{0.200}{0.01667\text{ s}} \times 0.018\text{ m} = 12.0 \times 0.018 = \mathbf{+0.216\text{ m/s}}$$
3. **Part (b): Compute Normal Impulse $J_n$:**
   $$J_n = \frac{-(1 + e) v_n + v_{\text{bias}}}{w_{\text{total}}} = \frac{-(1 + 0)(-0.1633) + 0.216}{1.00} = 0.1633 + 0.216 = \mathbf{0.3793\text{ N}\cdot\text{s}}$$
4. **Part (c): Post-Impulse Normal Velocity:**
   $$v_n' = v_n + w_1 J_n = -0.1633 + (1.00)(0.3793) = \mathbf{+0.216\text{ m/s}}$$
5. **Physical Insight:**
   Notice that the post-impulse velocity is now **upward** at $+0.216\text{ m/s}$! Over the subsequent frame, this upward velocity will advance the position by $\Delta y = v_n' \Delta t = (+0.216)(0.01667) \approx +0.0036\text{ m}$, steadily pushing the ball out of the floor without causing an unnatural visual jump.

---

### Worked Example 11.5: Sequential Impulses Iteration for a 3-Body Line Stacking
*Three identical discs ($A, B, C$) of mass $m = 1.00\text{ kg}$ ($w = 1.00\text{ kg}^{-1}$) lie in a line on a frictionless surface. Discs $B$ and $C$ are at rest and touching ($v_B = 0, v_C = 0$). Disc $A$ strikes Disc $B$ with velocity $v_A = 6.00\text{ m/s}$. Both contacts have $e = 1.00$. Show the first two iterations of the Sequential Impulse solver across Contact 1 ($A-B$) and Contact 2 ($B-C$).*

#### Solution
1. **Initial Velocities:**
   - $v_A = 6.00\text{ m/s}$, $v_B = 0.00\text{ m/s}$, $v_C = 0.00\text{ m/s}$.
   - Normal points rightward: $\hat{n} = +1$.
   - Effective inverse mass for any pair: $w_1 + w_2 = 1.00 + 1.00 = 2.00\text{ kg}^{-1}$.
2. **Iteration 1:**
   - **Solve Contact 1 ($A-B$):**
     Relative velocity: $v_{\text{rel}} = v_A - v_B = 6.00 - 0 = +6.00\text{ m/s}$.
     Impulse scalar: $\Delta J_1 = \frac{-(1+1) \times (-6.00)}{2.00} = \frac{12.00}{2.00} = 6.00\text{ N}\cdot\text{s}$.
     Update velocities:
     $$v_A \leftarrow v_A - w \Delta J_1 = 6.00 - (1.00)(6.00) = 0.00\text{ m/s}$$
     $$v_B \leftarrow v_B + w \Delta J_1 = 0.00 + (1.00)(6.00) = +6.00\text{ m/s}$$
   - **Solve Contact 2 ($B-C$):**
     Current velocities: $v_B = 6.00\text{ m/s}$, $v_C = 0.00\text{ m/s}$.
     Relative velocity: $v_{\text{rel}} = v_B - v_C = 6.00 - 0 = +6.00\text{ m/s}$.
     Impulse scalar: $\Delta J_2 = \frac{-(2) \times (-6.00)}{2.00} = 6.00\text{ N}\cdot\text{s}$.
     Update velocities:
     $$v_B \leftarrow v_B - w \Delta J_2 = 6.00 - 6.00 = 0.00\text{ m/s}$$
     $$v_C \leftarrow v_C + w \Delta J_2 = 0.00 + 6.00 = +6.00\text{ m/s}$$
3. **Iteration 2:**
   - **Solve Contact 1 ($A-B$):**
     $v_A = 0.00$, $v_B = 0.00 \implies v_{\text{rel}} = 0 \implies \Delta J_1 = 0$.
   - **Solve Contact 2 ($B-C$):**
     $v_B = 0.00$, $v_C = 6.00 \implies v_{\text{rel}} = -6.00$ (separating) $\implies \Delta J_2 = 0$.
4. **Final Converged State:**
   $$\mathbf{v_A = 0.00\text{ m/s}, \quad v_B = 0.00\text{ m/s}, \quad v_C = +6.00\text{ m/s}}$$
   The sequential solver reproduces the exact physical behavior of Newton's Cradle in a single iteration sweep!

---

### Worked Example 11.6: Continuous Collision Detection (CCD) Raycast Time of Impact
*A high-speed particle at $\vec{r}_0 = (0.00, 5.00)\text{ m}$ moves with velocity $\vec{v} = (600.0\,\hat{i} + 0.0\,\hat{j})\text{ m/s}$. A thin vertical wall of thickness $w = 0.100\text{ m}$ is located at $x_{\text{wall}} = 4.00\text{ m}$ (spanning $x \in [4.00, 4.10]\text{ m}$). The simulation time step is $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$. (a) Show that discrete collision detection suffers a tunneling failure. (b) Formulate the continuous collision raycast equation and compute the exact time of impact $t_{\text{TOI}} \in [0, \Delta t]$.*

#### Solution
1. **Part (a): Discrete Detection Failure (Tunneling):**
   - Position at start of frame: $x(0) = 0.00\text{ m}$.
   - Position at end of frame:
     $$x(\Delta t) = x(0) + v_x \Delta t = 0.00 + (600.0) \times (0.01667) = +10.00\text{ m}$$
   - During this frame, $x$ jumps from $0.00\text{ m}$ to $10.00\text{ m}$.
   - Because $10.00\text{ m} > 4.10\text{ m}$, the particle is outside the wall at both $t = 0$ and $t = \Delta t$.
   - A standard discrete bounding box check reports **NO COLLISION**, and the bullet tunnels through the wall undetected!
2. **Part (b): Continuous Raycast Formulation:**
   - Model the displacement as a continuous ray: $\vec{r}(t) = \vec{r}_0 + \vec{v} t$ for $t \in [0, \Delta t]$.
   - Contact with the front face of the wall occurs when:
     $$x(t_{\text{TOI}}) = x_{\text{wall}} \implies x_0 + v_x t_{\text{TOI}} = 4.00\text{ m}$$
     $$0.00 + 600.0\,t_{\text{TOI}} = 4.00\text{ m}$$
     $$t_{\text{TOI}} = \frac{4.00}{600.0} = \mathbf{\frac{1}{150}\text{ s} \approx 0.00667\text{ s}}$$
3. **Check Interval:**
   - Since $0.00667\text{ s} < \Delta t = 0.01667\text{ s}$, the collision is detected at normalized frame time:
     $$\alpha = \frac{t_{\text{TOI}}}{\Delta t} = \frac{0.00667}{0.01667} = \mathbf{0.400 = 40.0\%\text{ into the frame}}$$
   - The engine clamps the time-step, advances the particle to $x = 4.00\text{ m}$, resolves the impact impulse, and simulates the remaining $60\%$ of the frame with the reflected velocity!

---

### Worked Example 11.7: Angular Impulse for an Off-Center Rigid Rod
*A uniform slender rod of mass $M = 2.00\text{ kg}$ and length $L = 1.00\text{ m}$ (moment of inertia about center of mass $I = \frac{1}{12} M L^2$) floats at rest in space. A point particle of mass $m = 0.200\text{ kg}$ traveling at $v_0 = 10.0\text{ m/s}$ strikes the tip of the rod ($r = L/2 = 0.500\text{ m}$ from CM) perpendicularly with restitution $e = 1.00$. Compute: (a) the effective rotational inverse mass of the rod tip, (b) the total effective inverse mass $w_{\text{eff}}$, (c) the collision impulse $J_n$, and (d) the final linear and angular velocities of the rod.*

#### Solution
1. **Given:**
   - $M = 2.00\text{ kg}$, $L = 1.00\text{ m}$, $I = \frac{1}{12}(2.00)(1.00)^2 = \frac{1}{6} \approx 0.1667\text{ kg}\cdot\text{m}^2$.
   - Particle mass $m = 0.200\text{ kg} \implies w_{\text{part}} = 1/0.200 = 5.00\text{ kg}^{-1}$.
   - Linear inverse mass of rod: $w_{\text{rod, lin}} = 1/2.00 = 0.500\text{ kg}^{-1}$.
   - Contact offset lever arm: $r = 0.500\text{ m}$.
2. **Part (a): Rotational Inverse Mass Contribution:**
   $$w_{\text{rod, rot}} = \frac{r^2}{I} = \frac{(0.500)^2}{0.1667} = \frac{0.250}{0.1667} = \mathbf{1.500\text{ kg}^{-1}}$$
3. **Part (b): Total Effective Inverse Mass:**
   $$w_{\text{eff}} = w_{\text{part}} + w_{\text{rod, lin}} + w_{\text{rod, rot}} = 5.00 + 0.500 + 1.500 = \mathbf{7.00\text{ kg}^{-1}}$$
4. **Part (c): Collision Impulse $J_n$ ($e = 1.00$):**
   - Relative closing velocity: $v_{\text{rel}} = v_0 - 0 = 10.0\text{ m/s}$.
   $$J_n = \frac{(1 + e) v_{\text{rel}}}{w_{\text{eff}}} = \frac{(1 + 1.00) \times 10.0}{7.00} = \frac{20.0}{7.00} \approx \mathbf{2.857\text{ N}\cdot\text{s}}$$
5. **Part (d): Final Rod Motion:**
   - Linear center of mass velocity:
     $$V_{\text{CM}} = \frac{J_n}{M} = \frac{2.857}{2.00} \approx \mathbf{1.429\text{ m/s}}$$
   - Angular velocity:
     $$\omega = \frac{\tau_{\text{impulse}}}{I} = \frac{J_n r}{I} = \frac{2.857 \times 0.500}{0.1667} = \frac{1.4285}{0.1667} \approx \mathbf{8.57\text{ rad/s}}$$

---

### Worked Example 11.8: Symplectic Euler vs Explicit Euler Integration Stability
*A harmonic oscillator consisting of a mass $m = 1.00\text{ kg}$ attached to a spring $k = 100.0\text{ N/m}$ ($\omega = 10.0\text{ rad/s}$) is simulated with time step $\Delta t = 0.050\text{ s}$. Starting from $x(0) = 1.00\text{ m}, v(0) = 0.00\text{ m/s}$: (a) Calculate $x(1)$ and $v(1)$ after one step using Explicit Euler. (b) Calculate the mechanical energy under Explicit Euler. (c) Repeat using Symplectic Euler.*

#### Solution
1. **Governing Acceleration:**
   $$a(x) = -\frac{k}{m} x = -100.0\,x$$
2. **Part (a) & (b): Explicit Euler:**
   - Position update uses old velocity:
     $$x(1) = x(0) + v(0) \Delta t = 1.00 + (0)(0.050) = \mathbf{1.00\text{ m}}$$
   - Velocity update uses old position:
     $$v(1) = v(0) + a(x(0)) \Delta t = 0.00 + (-100.0 \times 1.00)(0.050) = \mathbf{-5.00\text{ m/s}}$$
   - Mechanical Energy:
     $$E(0) = \frac{1}{2} k x(0)^2 + \frac{1}{2} m v(0)^2 = \frac{1}{2}(100)(1)^2 + 0 = 50.0\text{ J}$$
     $$E(1) = \frac{1}{2}(100)(1.00)^2 + \frac{1}{2}(1.00)(-5.00)^2 = 50.0 + 12.5 = \mathbf{62.5\text{ J}}$$
   - **Energy increased by $25\%$ in a single step!** Explicit Euler is numerically unstable and causes physics simulations to explode!
3. **Part (c): Symplectic (Semi-Implicit) Euler:**
   - Velocity update first:
     $$v(1) = v(0) + a(x(0)) \Delta t = 0.00 + (-100.0)(0.050) = \mathbf{-5.00\text{ m/s}}$$
   - Position update uses the **NEW** velocity:
     $$x(1) = x(0) + v(1) \Delta t = 1.00 + (-5.00)(0.050) = 1.00 - 0.250 = \mathbf{0.750\text{ m}}$$
   - Mechanical Energy:
     $$E(1) = \frac{1}{2}(100)(0.750)^2 + \frac{1}{2}(1.00)(-5.00)^2 = 50.0(0.5625) + 12.5 = 28.125 + 12.5 = \mathbf{40.625\text{ J}}$$
   - Symplectic Euler preserves a shadow Hamiltonian, bounding energy oscillations over millions of steps without artificial energy drift!

---

### Worked Example 11.9: Velocity Clamping for Restitution Slop (Anti-Jitter)
*When a ball bounces on a floor with restitution $e = 0.80$, its rebound velocity decreases on each bounce. In real engines, when $v_n$ drops below a threshold velocity $v_{\text{threshold}}$, restitution must be forcibly set to $e = 0$ to prevent infinite micro-bounces (Zeno's bouncing phenomenon). If $v_{\text{threshold}} = 2 g \Delta t$ with $g = 9.80\text{ m/s}^2$ and $\Delta t = 1/60\text{ s}$, calculate: (a) the numerical threshold $v_{\text{threshold}}$, and (b) the drop height below which a ball will immediately come to rest on its first bounce.*

#### Solution
1. **Part (a): Compute Threshold Velocity:**
   $$v_{\text{threshold}} = 2 g \Delta t = 2 \times 9.80 \times \left(\frac{1}{60}\right) = \frac{19.60}{60} \approx \mathbf{0.3267\text{ m/s}}$$
2. **Part (b): Drop Height for Rest:**
   - The impact velocity from free fall height $h$ is $v = \sqrt{2gh}$.
   - The ball will be clamped to $e = 0$ if its impact speed satisfies $v \le v_{\text{threshold}}$:
     $$\sqrt{2gh} \le v_{\text{threshold}} \implies h \le \frac{v_{\text{threshold}}^2}{2g} = \frac{(0.3267)^2}{2 \times 9.80} = \frac{0.1067}{19.60} \approx \mathbf{0.00544\text{ m} = 5.44\text{ mm}}$$
   - Any bounce from less than $5.4\text{ mm}$ is cleanly resolved to rest, eliminating all micro-jitter!

---

### Worked Example 11.10: Collision Detection Between Moving Circles (Narrowphase)
*Circle 1 has center $\vec{r}_1 = (2.00, 3.00)\text{ m}$ and radius $R_1 = 0.600\text{ m}$. Circle 2 has center $\vec{r}_2 = (3.20, 4.60)\text{ m}$ and radius $R_2 = 1.500\text{ m}$. (a) Calculate the center-to-center distance $d_{12}$. (b) Determine whether the circles are colliding. (c) If colliding, compute the penetration depth $d$ and the contact normal $\hat{n}$ pointing from Circle 1 to Circle 2.*

#### Solution
1. **Part (a): Center-to-Center Displacement:**
   $$\Delta\vec{r} = \vec{r}_2 - \vec{r}_1 = (3.20 - 2.00)\hat{i} + (4.60 - 3.00)\hat{j} = (1.20\,\hat{i} + 1.60\,\hat{j})\text{ m}$$
   $$d_{12} = \|\Delta\vec{r}\| = \sqrt{(1.20)^2 + (1.60)^2} = \sqrt{1.44 + 2.56} = \sqrt{4.00} = \mathbf{2.000\text{ m}}$$
2. **Part (b): Collision Condition:**
   - Sum of radii: $R_1 + R_2 = 0.600 + 1.500 = 2.100\text{ m}$.
   - Since $d_{12} = 2.000\text{ m} < R_1 + R_2 = 2.100\text{ m}$, the circles are **overlapping (COLLIDING)**!
3. **Part (c): Penetration Depth and Contact Normal:**
   - Penetration depth:
     $$d = (R_1 + R_2) - d_{12} = 2.100 - 2.000 = \mathbf{0.100\text{ m} = 10.0\text{ cm}}$$
   - Contact normal (from 1 to 2):
     $$\hat{n} = \frac{\Delta\vec{r}}{d_{12}} = \frac{1.20\,\hat{i} + 1.60\,\hat{j}}{2.000} = \mathbf{0.600\,\hat{i} + 0.800\,\hat{j}}$$
     $$\|\hat{n}\| = \sqrt{0.6^2 + 0.8^2} = 1.000$$

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 11.1:** Explain why physics engines define an "inverse mass" $w = 1/m$ rather than storing regular mass $m$, and explain how this elegantly handles static terrain.  
**Exercise 11.2:** Why does Explicit Euler integration cause orbital and spring systems to gain artificial energy and explode, while Symplectic Euler maintains long-term energy bounds?

### Tier 2: Quantitative Mechanics
**Exercise 11.3:** Two particles of masses $m_1 = 4.00\text{ kg}$ and $m_2 = 1.00\text{ kg}$ collide head-on with $v_{1i} = 3.00\text{ m/s}$ and $v_{2i} = -2.00\text{ m/s}$. The collision has restitution $e = 0.500$. Compute the impulse scalar $J_n$ and the final velocities of both particles using the inverse-mass impulse formula.  
**Exercise 11.4:** A sliding puck on a table has normal impulse $J_n = 25.0\text{ N}\cdot\text{s}$ during a collision. The friction coefficient is $\mu = 0.250$, and the initial tangential velocity is $v_t = 6.00\text{ m/s}$. The puck mass is $m = 2.00\text{ kg}$. Determine whether the collision results in sticking or slipping, and compute the post-collision tangential speed.

### Tier 3: Multi-Stage Dynamics
**Exercise 11.5:** In a physics engine stepping at $\Delta t = 1/120\text{ s}$, a box penetrates a platform by $d = 1.50\text{ cm}$ with downward normal velocity $v_n = -0.500\text{ m/s}$. If $e = 0.00$, $\beta = 0.250$, and $d_{\text{slop}} = 0.200\text{ cm}$, calculate the required Baumgarte bias velocity and the resulting normal impulse scalar for a $5.00\text{ kg}$ box.  
**Exercise 11.6:** An off-center collision occurs on a floating square box of mass $M = 10.0\text{ kg}$ and side length $s = 2.00\text{ m}$ ($I = \frac{1}{6} M s^2$). A point projectile of mass $m = 1.00\text{ kg}$ strikes the corner ($x = 1.00\text{ m}, y = 1.00\text{ m}$) with velocity $\vec{v} = 12.0\,\hat{i}\text{ m/s}$ along the normal $\hat{n} = \hat{i}$. Assuming $e = 0.800$, find the total effective inverse mass and the normal impulse $J_n$.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 11.7:** Continuous Collision Swept-Sphere: Sphere 1 (radius $R_1 = 0.50\text{ m}$) starts at $(0, 0)$ with velocity $(10, 0)\text{ m/s}$. Sphere 2 (radius $R_2 = 0.50\text{ m}$) starts at $(8, 4)\text{ m}$ with velocity $(0, -5)\text{ m/s}$. Derive the quadratic equation for the time of impact $t_{\text{TOI}}$ and calculate when the spheres touch.  
**Exercise 11.8:** Prove that in a frictionless impulse collision between two bodies with arbitrary mass and restitution $e$, the kinetic energy lost during the impulse is given exactly by $\Delta K_{\text{loss}} = \frac{1}{2} \frac{1 - e^2}{w_1 + w_2} v_n^2$.

### Tier 5: Olympiad / Research Challenge
**Exercise 11.9:** The LCP Contact Solver: Consider three identical blocks in a row on a frictionless floor resting against a fixed wall ($m_1, m_2, m_3$ with wall at the right). Formulate the $3 \times 3$ Delassus contact operator matrix $\mathbf{A}$ for the contact normals, and solve the unilateral complementarity condition $\mathbf{A}\vec{J} + \vec{b} \ge 0$ when an external force $F_0$ pushes Block 1 to the right.  
**Exercise 11.10:** Symplectic Integration and the Störmer-Verlet Invariant: Prove that the Velocity Verlet integrator preserves phase space volume exactly (determinant of the Jacobian is identically 1: $\det\left(\frac{\partial(x_{n+1}, v_{n+1})}{\partial(x_n, v_n)}\right) \equiv 1$), making it strictly symplectic, and derive the modified shadow Hamiltonian $\tilde{H}$ that the numerical trajectory conserves to order $\mathcal{O}(\Delta t^2)$.

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 11.1
1. **Efficiency and Simplicity:** Using inverse mass $w = 1/m$ eliminates costly division operations from inner solver loops, replacing them with simple multiplications ($a = w F, \Delta v = w J$).
2. **Infinite Mass Representation:** In real-world physics scenes, obstacles such as walls, terrain, floors, and kinematic elevators are immovable. Their mass is effectively infinite ($m \to \infty$). In standard code, storing $m = \infty$ creates `NaN` or divide-by-zero errors. By storing $w = 0.0$, the exact same code handles both dynamic bodies ($w > 0$) and static terrain ($w = 0$) with zero special-case `if` branches!

---

### Solution to Exercise 11.2
In Explicit Euler, position is integrated using the old velocity: $x_{n+1} = x_n + v_n \Delta t$, and velocity uses old position: $v_{n+1} = v_n - \omega^2 x_n \Delta t$.
The amplification matrix has determinant:
$$\det \begin{pmatrix} 1 & \Delta t \\ -\omega^2\Delta t & 1 \end{pmatrix} = 1 + \omega^2 \Delta t^2 > 1$$
Because the determinant is strictly greater than 1 for any $\Delta t > 0$, the phase space area expands on every time-step, constantly injecting artificial energy and causing the system to spiral outward uncontrollably.
In Symplectic Euler, the updated velocity is used for the position: $v_{n+1} = v_n - \omega^2 x_n \Delta t$, $x_{n+1} = x_n + v_{n+1} \Delta t$.
The determinant of this transformation is identically $1.000$, which strictly preserves phase space volume (Liouville's theorem), preventing energy explosion over arbitrary timescales!

---

### Solution to Exercise 11.3
1. **Inverse Masses:**
   - $w_1 = 1 / 4.00 = 0.250\text{ kg}^{-1}$, $w_2 = 1 / 1.00 = 1.000\text{ kg}^{-1} \implies w_{\text{total}} = 1.250\text{ kg}^{-1}$.
2. **Relative Normal Velocity:**
   - $v_{\text{rel}} = v_1 - v_2 = 3.00 - (-2.00) = 5.00\text{ m/s}$.
3. **Impulse Scalar ($e = 0.500$):**
   $$J_n = \frac{(1 + e) v_{\text{rel}}}{w_{\text{total}}} = \frac{(1 + 0.500) \times 5.00}{1.250} = \frac{1.500 \times 5.00}{1.250} = \frac{7.50}{1.250} = \mathbf{6.00\text{ N}\cdot\text{s}}$$
4. **Final Velocities:**
   $$v_1' = v_1 - w_1 J_n = 3.00 - (0.250)(6.00) = 3.00 - 1.50 = \mathbf{+1.50\text{ m/s}}$$
   $$v_2' = v_2 + w_2 J_n = -2.00 + (1.000)(6.00) = -2.00 + 6.00 = \mathbf{+4.00\text{ m/s}}$$
   Check restitution: $v_2' - v_1' = 4.00 - 1.50 = 2.50\text{ m/s} = 0.50 \times 5.00$. Exact match!

---

### Solution to Exercise 11.4
1. **Coulomb Friction Limit:**
   $$J_{t, \max} = \mu J_n = 0.250 \times 25.0 = \mathbf{6.25\text{ N}\cdot\text{s}}$$
2. **Impulse to Completely Stop Sliding ($w = 1/2.00 = 0.50\text{ kg}^{-1}$):**
   $$J_{t, \text{stick}} = \frac{v_t}{w} = \frac{6.00}{0.50} = 12.0\text{ N}\cdot\text{s}$$
3. **Compare:**
   - Since $J_{t, \text{stick}} = 12.0\text{ N}\cdot\text{s} > J_{t, \max} = 6.25\text{ N}\cdot\text{s}$, the puck **slips**!
4. **Post-Collision Tangential Speed:**
   $$v_t' = v_t - w J_{t, \max} = 6.00 - (0.50)(6.25) = 6.00 - 3.125 = \mathbf{2.875\text{ m/s}}$$

---

### Solution to Exercise 11.5
1. **Given:**
   - $\Delta t = 1/120 \approx 0.008333\text{ s}$.
   - $d = 0.0150\text{ m}$, $d_{\text{slop}} = 0.0020\text{ m} \implies \text{excess} = 0.0130\text{ m}$.
   - $\beta = 0.250$, $e = 0.00$, $v_n = -0.500\text{ m/s}$.
   - Box $m = 5.00\text{ kg} \implies w_1 = 0.200\text{ kg}^{-1}$, floor $w_2 = 0$.
2. **Baumgarte Bias Velocity:**
   $$v_{\text{bias}} = \frac{\beta}{\Delta t} (d - d_{\text{slop}}) = \frac{0.250}{0.008333} \times 0.0130 = 30.0 \times 0.0130 = \mathbf{+0.390\text{ m/s}}$$
3. **Normal Impulse:**
   $$J_n = \frac{-(1 + 0)(-0.500) + 0.390}{0.200} = \frac{0.500 + 0.390}{0.200} = \frac{0.890}{0.200} = \mathbf{4.45\text{ N}\cdot\text{s}}$$

---

### Solution to Exercise 11.6
1. **Rotational Inertia of Square Box:**
   $$I = \frac{1}{6} M s^2 = \frac{1}{6}(10.0)(2.00)^2 = \frac{40.0}{6} \approx 6.6667\text{ kg}\cdot\text{m}^2$$
2. **Effective Inverse Mass of Contact Point:**
   - Linear inverse mass: $w_{\text{box, lin}} = 1/10.0 = 0.100\text{ kg}^{-1}$.
   - Torque arm for normal $\hat{n} = \hat{i}$:
     $$\vec{r} = 1.0\,\hat{i} + 1.0\,\hat{j} \implies (\vec{r} \times \hat{n}) = (1.0\,\hat{i} + 1.0\,\hat{j}) \times \hat{i} = -1.0\,\hat{k}$$
     $$(\vec{r} \times \hat{n})^2 = 1.0^2 = 1.0\text{ m}^2$$
   - Rotational inverse mass:
     $$w_{\text{box, rot}} = \frac{1.0}{6.6667} = 0.150\text{ kg}^{-1}$$
   - Projectile inverse mass: $w_{\text{proj}} = 1/1.00 = 1.000\text{ kg}^{-1}$.
   - Total effective inverse mass:
     $$w_{\text{eff}} = 1.000 + 0.100 + 0.150 = \mathbf{1.250\text{ kg}^{-1}}$$
3. **Normal Impulse:**
   $$J_n = \frac{(1 + 0.800)(12.0)}{1.250} = \frac{1.800 \times 12.0}{1.250} = \frac{21.60}{1.250} = \mathbf{17.28\text{ N}\cdot\text{s}}$$

---

### Solution to Exercise 11.7
1. **Relative Motion:**
   - Relative position: $\vec{r}(t) = \vec{r}_2(t) - \vec{r}_1(t) = (8 - 10t)\hat{i} + (4 - 5t)\hat{j}$.
   - Sum of radii: $R = R_1 + R_2 = 0.50 + 0.50 = 1.00\text{ m}$.
2. **Contact Condition:**
   $$\|\vec{r}(t)\|^2 = R^2 = 1.00^2 = 1.00$$
   $$(8 - 10t)^2 + (4 - 5t)^2 = 1.00$$
   $$(64 - 160t + 100t^2) + (16 - 40t + 25t^2) = 1.00$$
   $$125t^2 - 200t + 79 = 0$$
3. **Solve Quadratic:**
   - Discriminant: $D = (-200)^2 - 4(125)(79) = 40,000 - 39,500 = 500$.
   $$\sqrt{D} = \sqrt{500} \approx 22.3607$$
   $$t = \frac{200 \pm 22.3607}{250}$$
   - First contact (smallest positive root):
     $$t_{\text{TOI}} = \frac{200 - 22.3607}{250} = \frac{177.639}{250} \approx \mathbf{0.7106\text{ s}}$$

---

### Solution to Exercise 11.8
1. Initial kinetic energy along the normal direction:
   $$K_{n, i} = \frac{1}{2}\frac{v_n^2}{w_1 + w_2}$$
2. Final relative normal velocity is $v_n' = -e v_n$.
3. Final normal kinetic energy:
   $$K_{n, f} = \frac{1}{2}\frac{(v_n')^2}{w_1 + w_2} = \frac{1}{2}\frac{e^2 v_n^2}{w_1 + w_2}$$
4. Energy lost:
   $$\Delta K_{\text{loss}} = K_{n, i} - K_{n, f} = \mathbf{\frac{1}{2} \frac{1 - e^2}{w_1 + w_2} v_n^2}$$
   $$\blacksquare$$

---

### Solution to Exercise 11.9
1. Contacts: $C_1$ between 1 and 2, $C_2$ between 2 and 3, $C_3$ between 3 and the wall.
2. The Delassus matrix $\mathbf{A}_{ij} = \hat{n}_i^T \mathbf{W} \hat{n}_j$ for 3 identical unit masses in series is:
   $$\mathbf{A} = \begin{pmatrix} w_1 + w_2 & -w_2 & 0 \\ -w_2 & w_2 + w_3 & -w_3 \\ 0 & -w_3 & w_3 + w_{\text{wall}} \end{pmatrix} = \begin{pmatrix} 2 & -1 & 0 \\ -1 & 2 & -1 \\ 0 & -1 & 1 \end{pmatrix}$$
3. External force vector pushing from left: $\vec{b} = (-F_0, 0, 0)^T$.
4. Solving $\mathbf{A} \vec{J} = -\vec{b} = (F_0, 0, 0)^T$:
   - Inverting the tridiagonal matrix yields:
     $$\mathbf{J_1 = F_0, \quad J_2 = F_0, \quad J_3 = F_0}$$
   All contacts transmit the identical normal force $F_0$ through to the wall without interpenetration!

---

### Solution to Exercise 11.10
1. The Velocity Verlet algorithm:
   $$x_{n+1} = x_n + v_n \Delta t + \frac{1}{2} a(x_n) \Delta t^2$$
   $$v_{n+1} = v_n + \frac{1}{2}[a(x_n) + a(x_{n+1})] \Delta t$$
2. Computing the Jacobian:
   $$\frac{\partial x_{n+1}}{\partial x_n} = 1 + \frac{1}{2}a'\Delta t^2, \quad \frac{\partial x_{n+1}}{\partial v_n} = \Delta t$$
   $$\frac{\partial v_{n+1}}{\partial x_n} = \frac{1}{2}a'\Delta t + \frac{1}{2}a'(x_{n+1})\Delta t\left(1 + \frac{1}{2}a'\Delta t^2\right)$$
   $$\frac{\partial v_{n+1}}{\partial v_n} = 1 + \frac{1}{2}a'(x_{n+1})\Delta t^2$$
   Direct expansion yields:
   $$\mathbf{\det(\mathbf{J}) \equiv 1.000000}$$
3. By backward error analysis, the numerical trajectory corresponds exactly to the exact flow of a shadow Hamiltonian:
   $$\mathbf{\tilde{H} = H(x, p) + \frac{\Delta t^2}{12} \left(\frac{p^2}{m} \frac{\partial^2 U}{\partial x^2} - 2\left(\frac{\partial U}{\partial x}\right)^2\right) + \mathcal{O}(\Delta t^4)}$$
   Because $\tilde{H}$ is strictly conserved, the energy error is bounded and cannot drift over time!
