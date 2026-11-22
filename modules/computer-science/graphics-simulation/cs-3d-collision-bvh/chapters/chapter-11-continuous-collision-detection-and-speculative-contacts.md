# Chapter 11: Continuous Collision Detection and Speculative Contacts

> *"Time in a computer does not flow like a river; it leaps from stone to stone across a raging torrent. If a stone is narrow and the leap is broad, the traveler lands on the opposite bank without ever touching the water. To catch the bullet mid-flight, we must make time continuous once more."*
> — **Brian Mirtich**, *Impulse-Based Dynamic Simulation of Rigid Body Systems* (UC Berkeley, 1996)

---

## 11.1 The Tunneling Catastrophe (The "Bullet Through Paper" Problem)

In all discrete physics simulation engines, equations of motion are integrated forward across finite time steps $\Delta t$:

$$\mathbf{x}(t + \Delta t) = \mathbf{x}(t) + \mathbf{v}(t + \Delta t) \Delta t$$

In standard discrete collision detection, narrowphase algorithms (GJK, EPA, SAT) evaluate geometry only at the discrete temporal endpoints: $t_0, t_0 + \Delta t, t_0 + 2\Delta t, \dots$

This temporal discretization creates the most notorious glitch in computational physics: **Tunneling**.

```
                           THE TUNNELING CATASTROPHE
                           
       Frame t: (In front of wall)             Frame t + dt: (Behind wall)
                                  WALL
        Bullet                    |  |                   Bullet
          *                       |  |                     *
          |                       |  |                     |
          v                       |  |                     v
       Position x = -4.0 m        |  |         Position x = +6.0 m
                                  |  |
                                  
  - Wall thickness: 0.2 m. Bullet speed: 600 m/s. Frame dt = 0.01667 s.
  - Step displacement: 600 * 0.01667 = 10.0 meters!
  - At Frame t: Bullet is outside wall (No collision).
  - At Frame t + dt: Bullet is outside wall (No collision).
  - The bullet passed clean through the wall without interacting!
```

### 11.1.1 The Physics of Tunneling

Consider a high-velocity projectile (such as a bullet, an artillery shell, or a supersonic spacecraft fragment) traveling at $v = 900\text{ m/s}$.
At standard 60 Hz physics update rates ($\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$), the linear displacement per step is:

$$\Delta x = v \Delta t = 900\text{ m/s} \times 0.01667\text{ s} = 15.0\text{ meters}$$

If this projectile encounters a concrete bunker wall of thickness $T = 0.5\text{ meters}$:
- At frame $t_0$, the projectile is at $x = -7.0\text{ m}$ (7 meters in front of the wall). Discrete collision reports **no overlap**.
- At frame $t_0 + \Delta t$, the projectile is at $x = +8.0\text{ m}$ (8 meters behind the wall). Discrete collision reports **no overlap**.
- The barrier was completely transparent!

To eliminate tunneling, an engine must implement **Continuous Collision Detection (CCD)**, finding the exact **Time of Impact (TOI)** $t^* \in [t, t + \Delta t]$ where the surfaces first touch.

---

## 11.2 Swept Bounding Volumes

The first line of defense against tunneling in broadphase is the **Swept Bounding Volume**.

Instead of inserting static bounding boxes into the spatial tree, moving bodies insert bounding volumes that enclose their entire continuous trajectory over the time step $[t, t + \Delta t]$.

```
                     SWEPT BOUNDING VOLUMES
                     
       Swept AABB:                              Swept Sphere (Capsule):
          +-------------------+                     .-------------.
          | Box(t)            |                    /   Sphere(t)   \
          | *--------+        |                   |        *        |
          | |        |        |                    \       |       /
          | +--------+        |                     \      |      /
          |        \          |                      \     | v*dt/
          |         \         |                       \    |    /
          |          +--------+                        \   |   /
          |          |Box(t+dt|                         \  *  /
          +-------------------+                          `---'  Sphere(t+dt)
```

### 11.2.1 The Swept AABB

Let a body have initial AABB $[\mathbf{min}(t), \mathbf{max}(t)]$ and final AABB $[\mathbf{min}(t + \Delta t), \mathbf{max}(t + \Delta t)]$.
The **Swept AABB** is the bounding box union of both temporal states:

$$\boxed{\mathbf{min}_{\text{swept}} = \min(\mathbf{min}(t), \, \mathbf{min}(t + \Delta t))}$$

$$\boxed{\mathbf{max}_{\text{swept}} = \max(\mathbf{max}(t), \, \mathbf{max}(t + \Delta t))}$$

For pure linear translation with displacement $\mathbf{d} = \mathbf{v} \Delta t$:
$$\mathbf{min}_{\text{swept}} = \mathbf{min}(t) + \min(\mathbf{0}, \mathbf{d})$$
$$\mathbf{max}_{\text{swept}} = \max(t) + \max(\mathbf{0}, \mathbf{d})$$

Any obstacle that could possibly be struck during the time step must overlap this swept volume!

### 11.2.2 The Swept Sphere (Capsule)

When a moving sphere of radius $R$ translates from initial center $\mathbf{c}_0$ to final center $\mathbf{c}_1 = \mathbf{c}_0 + \mathbf{v} \Delta t$, the volume it sweeps out in 4D space-time projects in 3D as a **perfect capsule** with radius $R$ and line segment core $\mathbf{c}_0 \mathbf{c}_1$.

Testing whether a moving sphere strikes a stationary triangle during the frame reduces exactly to **testing a stationary capsule against a triangle**!

---

## 11.3 Conservative Advancement (Mirtich / Zhang)

While swept volumes identify *potential* collisions, how do we find the exact continuous Time of Impact (TOI) between two complex, rotating convex polyhedra?

In 1996, Brian Mirtich formulated the **Conservative Advancement (CA)** algorithm, later extended to general 3D rotations by Stephane Redon, Ming Lin, and Xinyu Zhang.

```
                    CONSERVATIVE ADVANCEMENT LOOP
                    
         Body A                                  Body B
          ( * )                                   ( * )
            \                                       /
             \               d_min                 /
              *<--------------------------------->*
            w_A                                   w_B
            
  1. At current time t, compute exact Euclidean distance d_min = dist(A, B).
  2. Compute upper bound on maximum relative velocity V_max toward each other.
  3. Safe time step: dt_safe = (d_min - epsilon) / V_max.
  4. Advance bodies by dt_safe.
  5. Repeat until d_min <= epsilon (COLLISION AT TOI!) or t >= dt (SAFE!).
```

### 11.3.1 Mathematical Derivation of the Safe Time Step

Let $A(t)$ and $B(t)$ be two disjoint convex bodies at simulation time $t \in [0, \Delta t]$.
Using GJK distance (Chapter 5), we compute the exact minimum Euclidean separation distance:

$$d_{\min}(t) = \min_{\mathbf{a} \in A(t), \mathbf{b} \in B(t)} \|\mathbf{a} - \mathbf{b}\|$$

Let $\mathbf{w}_A(t) \in A$ and $\mathbf{w}_B(t) \in B$ be the witness points that achieve this minimum separation distance:
$$\|\mathbf{w}_A(t) - \mathbf{w}_B(t)\| = d_{\min}(t)$$

Separating unit vector:
$$\hat{\mathbf{n}}(t) = \frac{\mathbf{w}_B(t) - \mathbf{w}_A(t)}{d_{\min}(t)}$$

The rate of change of distance (separation speed) is bounded by the velocities of the witness points:

$$\dot{d} = \frac{d}{dt} \|\mathbf{w}_A - \mathbf{w}_B\| \ge -\|\mathbf{v}_{A,\text{contact}} - \mathbf{v}_{B,\text{contact}}\|$$

### 11.3.2 Upper Bounding Maximum Surface Velocity ($V_{\max}$)

Every point on Body $A$ moves with velocity $\mathbf{v}_A + \boldsymbol{\omega}_A \times \mathbf{r}_A$.
The maximum possible speed of any point on Body $A$ relative to Body $B$ along the separating direction is bounded by:

$$V_{\max} = \|\mathbf{v}_A - \mathbf{v}_B\| + \|\boldsymbol{\omega}_A\| R_A + \|\boldsymbol{\omega}_B\| R_B$$

where:
- $\mathbf{v}_A, \mathbf{v}_B$ are linear center-of-mass velocities.
- $\boldsymbol{\omega}_A, \boldsymbol{\omega}_B$ are angular velocity vectors.
- $R_A, R_B$ are the maximum bounding radii of the bodies measured from their centers of mass:
  $$R = \max_{\mathbf{x} \in \text{Body}} \|\mathbf{x} - \mathbf{x}_{\text{cm}}\|$$

### 11.3.3 The Safe Advance Theorem

Because no surface point on either body can approach faster than $V_{\max}$, the separation distance over a future time step $\Delta t_{\text{safe}}$ satisfies the lower bound:

$$d_{\min}(t + \Delta t_{\text{safe}}) \ge d_{\min}(t) - V_{\max} \Delta t_{\text{safe}}$$

To ensure that the bodies **cannot touch** ($d_{\min} > \epsilon$) during this advance:

$$d_{\min}(t) - V_{\max} \Delta t_{\text{safe}} \ge \epsilon$$

$$\boxed{\Delta t_{\text{safe}} = \frac{d_{\min}(t) - \epsilon}{V_{\max}}}$$

### 11.3.4 Monotonic Convergence and Termination

```typescript
function conservativeAdvancement(bodyA: RigidBody3D, bodyB: RigidBody3D, dtMax: number): number | null {
  let currentT = 0.0;
  const epsilon = 0.001; // 1 mm collision threshold
  const maxIterations = 32;

  for (let iter = 0; iter < maxIterations; iter++) {
    // 1. Compute exact distance at currentT
    const dist = gjkDistance(bodyA, bodyB);
    if (dist <= epsilon) {
      return currentT; // Collision at exact Time of Impact!
    }

    // 2. Compute maximum relative velocity bound
    const vRel = bodyA.linearVelocity.sub(bodyB.linearVelocity).length();
    const vMax = vRel + bodyA.angularVelocity.length() * bodyA.boundingRadius +
                        bodyB.angularVelocity.length() * bodyB.boundingRadius;

    if (vMax < 1e-6) {
      return null; // Bodies are stationary relative to each other; no collision!
    }

    // 3. Compute safe time step
    const dtSafe = (dist - epsilon) / vMax;
    currentT += dtSafe;

    if (currentT >= dtMax) {
      return null; // Safe! No collision during this frame.
    }

    // 4. Advance bodies to new temporal pose
    bodyA.integrateToTime(currentT);
    bodyB.integrateToTime(currentT);
  }

  return currentT;
}
```

Because $\Delta t_{\text{safe}} > 0$ whenever $d_{\min} > \epsilon$, the current time advances strictly monotonically:
$$t_0 < t_1 < t_2 < \dots \le \Delta t$$
The algorithm **provably converges** to the exact Time of Impact without ever tunneling or missing an impact!

---

## 11.4 Bilateral Time of Impact via GJK Raycasting

For purely translating bodies ($\boldsymbol{\omega}_A = \boldsymbol{\omega}_B = \mathbf{0}$), Conservative Advancement can be replaced by an even faster, direct mathematical method: **GJK Raycasting** (Gino van den Bergen, 1999).

```
                      GJK RAYCAST IN MINKOWSKI SPACE
                                                 
                                                  Minkowski Difference (A - B)
                                                        .-----------.
         Origin 0                                     .'             `.
            * -------------------------------------->/        *        \
                      Ray Direction v_rel           |                   |
                                                     \                 /
                                                      `.             .'
                                                        `-----------'
  - Translating Body A toward Body B with velocity v_rel is EQUIVALENT to
    casting a ray from the ORIGIN through the Minkowski Difference (A - B)!
  - Ray hit parameter t is the exact Time of Impact!
```

### 11.4.1 Equivalence to Minkowski Ray Intersection

Let Body $A$ move with constant relative linear velocity $\mathbf{v}_{\text{rel}} = \mathbf{v}_A - \mathbf{v}_B$.
At time $t \ge 0$, its position is $\mathbf{x}_A(t) = \mathbf{x}_A(0) + t \mathbf{v}_{\text{rel}}$.
The collision condition is:
$$A(t) \cap B \neq \emptyset \iff \mathbf{0} \in (A(t) \ominus B)$$
$$(A(0) + t \mathbf{v}_{\text{rel}}) \ominus B = (A(0) \ominus B) + t \mathbf{v}_{\text{rel}}$$
$$\mathbf{0} \in (A(0) \ominus B) + t \mathbf{v}_{\text{rel}} \iff -t \mathbf{v}_{\text{rel}} \in (A(0) \ominus B)$$

Define a geometric ray starting at the origin $\mathbf{O} = \mathbf{0}$ with direction $\mathbf{D} = -\mathbf{v}_{\text{rel}}$:

$$\mathbf{P}(t) = \mathbf{0} - t \mathbf{v}_{\text{rel}} = -t \mathbf{v}_{\text{rel}}$$

**Theorem:** Finding the Time of Impact (TOI) between two moving convex bodies is **strictly mathematically equivalent to intersecting a ray from the origin with their static Minkowski difference $A(0) \ominus B$**!

Van den Bergen's GJK Raycast algorithm evaluates this intersection directly using support mappings in **3 to 5 iterations**, running in less than $2\ \mu\text{s}$!

---

## 11.5 Speculative Contacts: The Discrete CCD Alternative

While Conservative Advancement and GJK Raycasting calculate exact Times of Impact, they share a major operational cost: **they require sub-stepping the physics integration clock**.
If a bullet hits a wall at $t^* = 0.23 \Delta t$, the engine must split the frame:
1. Integrate all bodies to $t^*$.
2. Solve collision impulse.
3. Integrate all bodies across the remaining $0.77 \Delta t$.

In complex multi-body piles (e.g. 500 falling dominoes or tumbling debris), micro-stepping causes temporal cascade explosions, dropping framerates.

In 2010, physics researcher Paul Firth introduced **Speculative Contacts** in the *ChaiEngine*, later adopted by Valve's *Source 2* and *Box2D*.

```
                        SPECULATIVE CONTACTS CONCEPT
                        
          Frame t:                                  Frame t + dt:
                                 WALL                                      WALL
          Moving Body            |  |               Desired Position       |  |
             [ * ]               |  |               (Velocity clamped!)    |  |
               \                 |  |                    [ * ]             |  |
                \                |  |                      |               |  |
                 \  v_rel        |  |                      v               |  |
                  \              |  |               Stops EXACTLY          |  |
                   v             |  |               at contact surface!    |  |
          Separation dist: d     |  |               No tunneling!          |  |
```

### 11.5.1 The Predictive Constraint Formulation

Instead of stopping time at TOI, **Speculative Contacts creates a virtual contact constraint before the collision even occurs!**

At the beginning of the frame ($t_0$):
1. Compute the current separation distance $d = \text{dist}(A, B)$ and contact normal $\hat{\mathbf{n}}$ using standard discrete GJK.
2. If the bodies are approaching along the normal:
   $$v_n = (\mathbf{v}_A - \mathbf{v}_B) \cdot \hat{\mathbf{n}} < 0$$
   and the bodies will close the distance within the time step:
   $$-v_n \Delta t \ge d$$
3. Inject a **Speculative Contact Constraint** directly into the sequential impulse velocity solver from Chapter 11 of `phys-rigid-body-3d`!

### 11.5.2 Modified Target Velocity Bias

The standard discrete impulse solver enforces:
$$v_n^+ \ge -e v_n^-$$

For a speculative contact separated by distance $d > 0$, the relative velocity must not be reversed at the current position (which would cause the body to bounce off empty air!).
Instead, the solver demands that over the time step $\Delta t$, the bodies close **at most distance $d$**:

$$\Delta x = -v_n^+ \Delta t \le d \iff v_n^+ \ge -\frac{d}{\Delta t}$$

$$\boxed{v_{\text{target}} = -\frac{d}{\Delta t}}$$

The sequential impulse solver treats $-\frac{d}{\Delta t}$ as the velocity limit:
- If the body travels fast, the solver applies an impulsive brake that reduces its velocity to exactly $-\frac{d}{\Delta t}$.
- Over the full time step $\Delta t$, the body travels distance $\Delta x = \left(\frac{d}{\Delta t}\right)\Delta t = d$.
- **The body lands with micro-precision exactly touching the surface of the wall at the end of the frame!**

### 11.5.3 Trade-offs: Ghost Collisions vs. Zero Performance Cost

- **Advantages:** Zero sub-stepping! Runs entirely inside the standard discrete impulse solver. Completely immune to tunneling.
- **Drawback (Ghost Collisions):** If a fast-moving body was heading toward a wall, but an earlier lateral collision with another object deflected its path away from the wall, the speculative impulse may have already arrested its forward momentum, creating a momentary "phantom deceleration" in mid-air. In high-speed action games, this trade-off is widely accepted for its immense performance gains.

---

## 11.6 Ten Step-by-Step Worked Examples

### Worked Example 11.1: Tunneling Velocity Threshold Calculation
**Problem:** A thin glass pane has thickness $T = 0.05\text{ m}$ ($5\text{ cm}$).
A physics simulation updates at fixed time step $\Delta t = 1/60\text{ s} \approx 0.01667\text{ s}$.
A spherical baseball has diameter $D = 0.074\text{ m}$.
Calculate the critical velocity $v_{\text{tunnel}}$ above which the baseball can tunnel completely through the glass pane in a single frame without discrete detection.

**Solution:**
1. In discrete collision detection, collision is detected if the baseball overlaps the pane at either the start of the frame or the end of the frame.
2. The total thickness of the interaction barrier is the sum of the pane thickness and the baseball diameter:
   $$T_{\text{barrier}} = T + D = 0.05 + 0.074 = 0.124\text{ m}$$
3. Tunneling occurs if the linear displacement in a single time step strictly exceeds the barrier thickness:
   $$\Delta x = v \Delta t > T_{\text{barrier}}$$
4. Critical tunneling velocity:
   $$v_{\text{tunnel}} = \frac{T_{\text{barrier}}}{\Delta t} = \frac{0.124\text{ m}}{0.01667\text{ s}} \approx 7.44\text{ m/s}$$
   $7.44\text{ m/s}$ is only $26.8\text{ km/h}$ ($16.6\text{ mph}$)—a gentle toss!
   Without CCD, even slow-pitch baseballs will tunnel straight through glass windows!

---

### Worked Example 11.2: Swept AABB Calculation for a Fast Projectile
**Problem:** A cube of side length $s = 0.2\text{ m}$ is centered at $\mathbf{x}(t) = (0.0, 1.0, 0.0)^T$.
Its velocity is $\mathbf{v} = (120.0, -10.0, 0.0)^T\text{ m/s}$ over $\Delta t = 0.01667\text{ s}$.
Calculate:
(a) The initial AABB at time $t$.
(b) The final AABB at time $t + \Delta t$.
(c) The Swept AABB.

**Solution:**
1. **(a) Initial AABB at time $t$:**
   Half-extents $\mathbf{e} = (0.1, 0.1, 0.1)^T$.
   $$\mathbf{min}(t) = \mathbf{x}(t) - \mathbf{e} = (-0.1, 0.9, -0.1)^T$$
   $$\mathbf{max}(t) = \mathbf{x}(t) + \mathbf{e} = (0.1, 1.1, 0.1)^T$$
2. **(b) Displacement Vector:**
   $$\mathbf{d} = \mathbf{v} \Delta t = \begin{pmatrix} 120.0 \times 0.01667 \\ -10.0 \times 0.01667 \\ 0.0 \end{pmatrix} = \begin{pmatrix} 2.0000 \\ -0.1667 \\ 0.0000 \end{pmatrix}\text{ m}$$
   Final position: $\mathbf{x}(t + \Delta t) = (2.0, 0.8333, 0.0)^T$.
   $$\mathbf{min}(t + \Delta t) = (2.0 - 0.1, 0.8333 - 0.1, -0.1) = (1.9, 0.7333, -0.1)^T$$
   $$\mathbf{max}(t + \Delta t) = (2.0 + 0.1, 0.8333 + 0.1, 0.1) = (2.1, 0.9333, 0.1)^T$$
3. **(c) Swept AABB:**
   $$\mathbf{min}_{\text{swept}} = \min(\mathbf{min}(t), \mathbf{min}(t + \Delta t)) = \begin{pmatrix} \min(-0.1, 1.9) \\ \min(0.9, 0.7333) \\ \min(-0.1, -0.1) \end{pmatrix} = \begin{pmatrix} -0.1000 \\ 0.7333 \\ -0.1000 \end{pmatrix}\text{ m}$$
   $$\mathbf{max}_{\text{swept}} = \max(\mathbf{max}(t), \mathbf{max}(t + \Delta t)) = \begin{pmatrix} \max(0.1, 2.1) \\ \max(1.1, 0.9333) \\ \max(0.1, 0.1) \end{pmatrix} = \begin{pmatrix} 2.1000 \\ 1.1000 \\ 0.1000 \end{pmatrix}\text{ m}$$
   The Swept AABB has length $2.1 - (-0.1) = 2.2\text{ m}$ along X, perfectly bounding the projectile's flight path!

---

### Worked Example 11.3: Conservative Advancement Step 1 Trace
**Problem:** Two spheres of radius $R = 1.0\text{ m}$:
Sphere $A$: Center $(0, 0, 0)^T$, velocity $\mathbf{v}_A = (10, 0, 0)^T\text{ m/s}$.
Sphere $B$: Center $(10, 0, 0)^T$, velocity $\mathbf{v}_B = (0, 0, 0)^T$.
Time step is $\Delta t = 1.0\text{ s}$. Collision tolerance is $\epsilon = 0.001\text{ m}$.
Calculate the initial separation distance $d_{\min}$, maximum velocity $V_{\max}$, and first safe advancement step $\Delta t_{\text{safe}}$.

**Solution:**
1. Distance between centers:
   $$D = \|\mathbf{c}_B - \mathbf{c}_A\| = 10.0\text{ m}$$
   Separation distance:
   $$d_{\min}(0) = D - (R_A + R_B) = 10.0 - (1.0 + 1.0) = 8.0\text{ m}$$
2. Maximum velocity bound:
   $$V_{\max} = \|\mathbf{v}_A - \mathbf{v}_B\| = \|(10, 0, 0) - (0, 0, 0)\| = 10.0\text{ m/s}$$
   (Rotational velocities are zero).
3. Safe time step:
   $$\Delta t_{\text{safe}} = \frac{d_{\min} - \epsilon}{V_{\max}} = \frac{8.0 - 0.001}{10.0} = \frac{7.999}{10.0} = 0.7999\text{ seconds}$$
4. Advance simulation to $t_1 = 0.7999\text{ s}$:
   Sphere $A$ moves to $x_A(t_1) = 10 \times 0.7999 = 7.999\text{ m}$.
   New distance between centers: $10.0 - 7.999 = 2.001\text{ m}$.
   New separation distance:
   $$d_{\min}(t_1) = 2.001 - 2.0 = 0.001\text{ m} = \epsilon!$$
   In a single step, Conservative Advancement converged to within $\epsilon = 1\text{ mm}$ of the impact surface!
   Time of Impact: $\text{TOI} = 0.7999\text{ s} \approx 0.80\text{ s}$.

---

### Worked Example 11.4: Rotational Velocity Impact on Conservative Advancement
**Problem:** An elongated rod of length $L = 2.0\text{ m}$ (bounding radius $R_A = 1.0\text{ m}$) translates at $v_A = 5.0\text{ m/s}$ and spins rapidly at $\omega_A = 20.0\text{ rad/s}$ toward a stationary flat wall.
Current separation distance is $d_{\min} = 1.5\text{ m}$.
Calculate $V_{\max}$ and show how angular velocity reduces $\Delta t_{\text{safe}}$.

**Solution:**
1. Maximum velocity bound without rotation:
   $$V_{\text{trans}} = 5.0\text{ m/s}$$
2. Rotational tip velocity:
   $$V_{\text{rot}} = \omega_A R_A = 20.0\text{ rad/s} \times 1.0\text{ m} = 20.0\text{ m/s}$$
3. Total upper bound:
   $$V_{\max} = V_{\text{trans}} + V_{\text{rot}} = 5.0 + 20.0 = 25.0\text{ m/s}$$
4. Safe time step with rotation:
   $$\Delta t_{\text{safe}} = \frac{1.5 - 0.001}{25.0} = \frac{1.499}{25.0} \approx 0.05996\text{ seconds}$$
5. Compare to without rotation:
   $$\Delta t_{\text{safe, no rot}} = \frac{1.499}{5.0} \approx 0.2998\text{ seconds}$$
   Fast rotation increases $V_{\max}$ by $5\times$, requiring smaller advancement steps to prevent the spinning tip from clipping into the wall!

---

### Worked Example 11.5: Speculative Contact Target Velocity Calculation
**Problem:** A billiard ball of radius $R = 0.03\text{ m}$ moves with velocity $\mathbf{v} = (4.0, 0.0, 0.0)^T\text{ m/s}$ toward a cushion located at $x = 0.05\text{ m}$.
Time step is $\Delta t = 0.01667\text{ s}$.
(a) Show that the ball would penetrate the cushion without CCD.
(b) Calculate the speculative contact distance $d$ and target velocity $v_{\text{target}}$.

**Solution:**
1. **(a) Discrete Integration Without CCD:**
   Initial position of front of ball: $x_{\text{front}}(0) = 0.0 + 0.03 = 0.03\text{ m}$.
   Distance to cushion:
   $$d = 0.05 - 0.03 = 0.02\text{ m} \quad (2\text{ cm})$$
   Displacement during frame:
   $$\Delta x = v_x \Delta t = 4.0 \times 0.01667 \approx 0.0667\text{ m} \quad (6.67\text{ cm})$$
   Final position of front of ball:
   $$x_{\text{front}}(\Delta t) = 0.03 + 0.0667 = 0.0967\text{ m} > 0.05\text{ m}$$
   The ball penetrates the cushion by $0.0967 - 0.05 = 0.0467\text{ m}$ ($4.67\text{ cm}$)—more than its own radius!
2. **(b) Speculative Contact Formulation:**
   Contact normal pointing from cushion into ball: $\hat{\mathbf{n}} = (-1, 0, 0)^T$.
   Separation distance: $d = 0.02\text{ m}$.
   Speculative target velocity limit:
   $$v_{\text{target}} = -\frac{d}{\Delta t} = -\frac{0.02\text{ m}}{0.01667\text{ s}} = -1.20\text{ m/s}$$
   The velocity solver constrains the approach speed along $-x$ to at most $1.20\text{ m/s}$.
3. Resulting motion:
   $$\Delta x = 1.20\text{ m/s} \times 0.01667\text{ s} = 0.0200\text{ m} = d$$
   The ball travels exactly $2.0\text{ cm}$ and comes to rest touching the cushion surface with zero penetration!

---

### Worked Example 11.6: GJK Raycast Time of Impact Trace
**Problem:** In 1D Minkowski space, the Minkowski difference is an interval $A \ominus B = [2.0, 6.0]$.
A ray starts at origin $x = 0$ with velocity direction $v_{\text{rel}} = +5.0$.
Find the exact Time of Impact $t^*$.

**Solution:**
1. The ray equation is:
   $$P(t) = 0 + t v_{\text{rel}} = 5.0 t$$
2. The ray enters $A \ominus B$ when it hits the closest boundary point $x = 2.0$:
   $$5.0 t^* = 2.0 \implies t^* = \frac{2.0}{5.0} = 0.40\text{ seconds}$$
3. The Time of Impact is exactly $t^* = 0.40\text{ s}$.

---

### Worked Example 11.7: Continuous Sphere-Triangle Swept Test
**Problem:** A sphere of radius $R = 0.5\text{ m}$ moves from $\mathbf{c}_0 = (0, 5, 0)^T$ to $\mathbf{c}_1 = (0, -1, 0)^T$ (traveling straight down).
A triangle lies in the plane $y = 1.0$ spanning $[-2, 2] \times [1, 1] \times [-2, 2]$.
Find the exact Time of Impact $t^* \in [0, 1]$ where the sphere first contacts the triangle plane.

**Solution:**
1. The sphere moves purely along Y:
   $$y(t) = 5.0 - 6.0 t$$
2. The bottom of the sphere is at height:
   $$y_{\text{bottom}}(t) = y(t) - R = (5.0 - 6.0 t) - 0.5 = 4.5 - 6.0 t$$
3. Contact occurs when the bottom touches the triangle plane at $y = 1.0$:
   $$4.5 - 6.0 t^* = 1.0 \implies 6.0 t^* = 3.5 \implies t^* = \frac{3.5}{6.0} = \frac{7}{12} \approx 0.5833$$
4. At $t^* = 0.5833$, the sphere center is at $y = 5.0 - 6.0(0.5833) = 1.5\text{ m}$, and its bottom touches the triangle at $(0, 1, 0)^T$.

---

### Worked Example 11.8: Sub-Stepping Clock Cascade
**Problem:** A physics engine simulates 3 colliding bodies with pairwise TOIs:
$t_{12}^* = 0.2\Delta t$, $t_{23}^* = 0.5\Delta t$, $t_{13}^* = 0.8\Delta t$.
Explain the sequence of temporal sub-steps required to resolve all collisions chronologically.

**Solution:**
1. **Sub-step 1:** Advance all bodies from $t = 0$ to first TOI $t_1 = 0.2\Delta t$.
   Solve collision impulse between Body 1 and Body 2.
   Trajectories of 1 and 2 are modified.
2. **Recompute TOIs:** The subsequent TOIs ($0.5$ and $0.8$) are invalid because velocities changed! Recompute all TOIs from $t_1$.
3. **Sub-step 2:** Advance to next chronological TOI, solve impulses, and repeat until the clock reaches $t = \Delta t$.

---

### Worked Example 11.9: False Positive Speculative Brake (The Phantom Wall)
**Problem:** A race car moving at $40\text{ m/s}$ parallel to a guardrail is separated from the rail by $d = 0.1\text{ m}$.
Due to slight steering jitter, its lateral velocity toward the rail is $v_{\text{lat}} = 0.05\text{ m/s}$.
Explain why a poorly tuned speculative contact can cause the car to violently brake forward.

**Solution:**
1. Speculative contacts constrain relative normal velocity:
   $$v_n \ge -\frac{d}{\Delta t} = -\frac{0.1}{0.01667} = -6.0\text{ m/s}$$
2. Here $v_{\text{lat}} = -0.05\text{ m/s} \ge -6.0\text{ m/s}$.
   The constraint is satisfied!
3. However, if Coulomb friction is coupled to the speculative normal impulse, any non-zero normal impulse generated will exert a massive tangential friction impulse against the car's forward speed, causing it to suddenly "stick" to empty air!
4. **Remedy:** Disable friction on speculative contacts until physical penetration actually occurs ($d \le 0$).

---

### Worked Example 11.10: Bilateral vs Unilateral TOI Root Finding
**Problem:** Compare the mathematical difference between finding roots of $f(t) = d(t) = 0$ (unilateral) versus finding the first sign change of an implicit distance field (bilateral).

**Solution:**
- **Unilateral:** Seeks the boundary where distance reaches zero from above ($d \to 0^+$).
- **Bilateral:** Accommodates negative distances (penetration depth).
In physics engines, bilateral root finders are superior because they can resolve cases where bodies started the frame already slightly interpenetrating.

---

## 11.7 Ten Granular Solved Exercises

### Exercise 11.1: Maximum Linear Velocity for Given Barrier Thickness
**Problem:** If a wall has thickness $T = 0.1\text{ m}$ and $\Delta t = 0.01667\text{ s}$, what is the maximum speed a point particle can travel without risk of tunneling?

**Solution:**
$$v_{\max} = \frac{T}{\Delta t} = \frac{0.1}{0.01667} = 6.0\text{ m/s} = 21.6\text{ km/h}$$

---

### Exercise 11.2: Conservative Advancement Step Sign Invariant
**Problem:** Prove that if $d_{\min} > \epsilon$ and $V_{\max} > 0$, the safe time step $\Delta t_{\text{safe}} > 0$.

**Solution:**
$$\Delta t_{\text{safe}} = \frac{d_{\min} - \epsilon}{V_{\max}}$$
Because numerator $d_{\min} - \epsilon > 0$ and denominator $V_{\max} > 0$, the quotient is strictly positive ($\Delta t_{\text{safe}} > 0$), guaranteeing forward temporal progress. $\blacksquare$

---

### Exercise 11.3: Swept OBB Half-Extents
**Problem:** An OBB has half-extents $\mathbf{e}$ and translates by $\mathbf{d}$. Can the swept volume be represented as another OBB?

**Solution:**
Not exactly. The swept volume of an OBB along a vector is a 14-faced convex polyhedron (a prismatoid). However, it can be conservatively bounded by an expanded OBB or Swept AABB.

---

### Exercise 11.4: Angular Velocity Upper Bound on a Sphere
**Problem:** Why is the rotational velocity term $\|\boldsymbol{\omega}\| R$ zero for a perfectly smooth sphere?

**Solution:**
Because rotating a smooth sphere about its center does not alter the geometric position of its boundary surface; all surface points remain on the exact same sphere!

---

### Exercise 11.5: Speculative Contact Restitution Suppression
**Problem:** Why must restitution $e$ be set to $0$ for speculative contacts?

**Solution:**
Because the body has not yet physically reached the surface at time $t_0$. If restitution were positive, the body would bounce off empty air before reaching the obstacle!

---

### Exercise 11.6: Minkowski Ray Origin Distance
**Problem:** In GJK raycasting, what does it mean if the ray origin $\mathbf{0}$ is already inside $A(0) \ominus B$?

**Solution:**
It means the bodies were already interpenetrating at the start of the frame ($t = 0$). The Time of Impact is immediately $t^* = 0$.

---

### Exercise 11.7: Linear vs Quadratic Trajectories
**Problem:** If a projectile undergoes constant gravitational acceleration $\mathbf{g}$, how is Conservative Advancement adapted?

**Solution:**
Velocity is updated along the trajectory:
$$\mathbf{v}(t) = \mathbf{v}_0 + \mathbf{g} t$$
$V_{\max}$ incorporates the maximum speed over the candidate interval $[t, t + \Delta t_{\text{safe}}]$.

---

### Exercise 11.8: Swept AABB Volume Expansion Ratio
**Problem:** An AABB of size $1 \times 1 \times 1$ translates by $\mathbf{d} = (10, 0, 0)^T$. Calculate the volume expansion ratio of the swept AABB.

**Solution:**
Initial volume: $V_{\text{init}} = 1^3 = 1\text{ m}^3$.
Swept AABB dimensions: $(1 + 10) \times 1 \times 1 = 11 \times 1 \times 1 = 11\text{ m}^3$.
Expansion ratio: $11 / 1 = 11\times$.

---

### Exercise 11.9: TOI Numerical Tolerance
**Problem:** Why is the collision threshold in CCD set to $\epsilon \approx 1\text{ mm}$ ($0.001\text{ m}$) rather than $0.0$?

**Solution:**
Setting $\epsilon = 0.0$ requires infinite iterations as $\Delta t_{\text{safe}} \to 0$ near the surface (Zeno's paradox). A threshold of $1\text{ mm}$ guarantees rapid convergence while being invisible to human observers.

---

### Exercise 11.10: Speculative Contacts in Rigid Body Chains
**Problem:** Why are speculative contacts essential for simulating ragdolls and articulated chains?

**Solution:**
High-velocity joint angular swings can cause adjacent limb bones to tunnel through each other. Speculative contacts prevent joint interpenetration without expensive sub-stepping.

---

## 11.8 Chapter Summary and Bridge to Chapter 12

In this chapter, we solved the temporal discretization crisis:
1. **The Tunneling Catastrophe:** Identified how discrete stepping allows supersonic projectiles to tunnel through thin barriers.
2. **Swept Bounding Volumes:** Formulated Swept AABBs and Swept Spheres to catch moving geometry in broadphase.
3. **Conservative Advancement:** Derived Brian Mirtich's safe time-stepping algorithm that converges monotonically to the exact Time of Impact.
4. **GJK Raycasting:** Proved that continuous translation is equivalent to casting a ray through the Minkowski difference.
5. **Speculative Contacts:** Implemented Paul Firth's zero-substepping discrete CCD algorithm using predictive target velocity limits.

With all 11 theoretical chapters complete, we have assembled the entire mathematical universe of 3D rigid body dynamics and spatial collision acceleration.
In **Chapter 12: Production TypeScript 3D Collision Engine and the Grand Gauntlet**, we synthesize everything into a complete, high-performance production TypeScript engine and solve 10 landmark civilizational engineering challenges!
