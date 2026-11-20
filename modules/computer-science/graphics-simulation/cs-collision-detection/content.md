# Collision Detection: Broadphase Spatial Grids, SAT Geometry, and Contact Manifolds

---

## 🎯 Pedagogical Roadmap & Learning Contract

How does a computer program know when two solid physical objects have bumped into each other?

In our everyday world, things never pass through one another. When you place a coffee cup on a wooden desk, it comes to rest instantly. But inside a digital computer, space and time are broken into discrete numbers. A video game character does not "glide" continuously across the screen; it teleports in tiny jumps 60 times a second.

This creates the fundamental paradox of computational physics: **by the time a computer checks if two objects are touching, they have already stepped inside each other.**

This module guides you from zero—starting with the everyday puzzle of "The Ghost in the Wall"—through the computational explosion of checking 10,000 interacting bodies, spatial hash grids, the Separating Axis Theorem (SAT) for convex polygons, and the mathematical construction of stabilized contact manifolds.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     THE 9-LEVEL COGNITIVE LADDER                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Level 0: The Ghost in the Wall & The Jittering Stack (Class 6 Anchor)   │
│ Level 1: What is a Collision? (Continuous Contact vs Discrete Overlap)  │
│ Level 2: The Two-Tier Pipeline & The O(N²) Pairwise Catastrophe         │
│ Level 3: Broadphase Acceleration: AABBs & Spatial Hash Grids            │
│ Level 4: Narrowphase Primitives: Circles, AABBs, and Voronoi Clamping   │
│ Level 5: The Separating Axis Theorem (SAT) for Convex Polygons          │
│ Level 6: Contact Manifolds, Sinking Traps & Baumgarte Positional Slop   │
│ Level 7: Production-Grade TypeScript Collision Detection & Solver Suite │
│ Level 8: Multi-Tiered Practice Problems with Complete Worked Solutions │
│ Level 9: Philosophical Horizons: The Quantum Root of Solid Matter       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Level 0: The Anchor Paradox — The Ghost in the Wall & The Jittering Stack

### Paradox 1: The Ghost in the Wall (Tunneling)
Imagine you throw a tennis ball at a thin wooden fence. The fence is $2\text{ centimeters}$ thick. The ball travels at $30\text{ meters per second}$.
In real life, the ball hits the fence and bounces back.

Now, imagine a video game running at 30 frames per second. In each frame, time advances by:
$$\Delta t = \frac{1}{30} \approx 0.0333\text{ seconds}$$
In that single tick, the ball travels:
$$\Delta x = v \cdot \Delta t = (30\text{ m/s}) \cdot (0.0333\text{ s}) = 1.0\text{ meter} = 100\text{ centimeters}!$$

```
Frame k:           ● (Tennis ball)           | (Fence: 2cm thick)
                   (x = 0 cm)                (x = 50 cm)

Frame k + 1:                                 |           ● (Tennis ball)
                                             (x = 50 cm) (x = 100 cm)
```

Look at what happened:
- At Frame $k$, the ball was at $x = 0\text{ cm}$ (in front of the fence).
- At Frame $k+1$, the ball is at $x = 100\text{ cm}$ (behind the fence).
- **At NO single point in time did the ball's coordinates ever overlap the fence!** 
To the computer, the ball was never inside the fence. The ball passed through solid wood like a ghost. This failure is known as **Tunneling**.

---

### Paradox 2: The Jittering Stack of Apples
Now consider another paradox:
You stack 5 wooden crates on top of each other in a physics sandbox. The crates should sit completely still under gravity.
Instead, after a few seconds, the crates begin to shudder, vibrate, shake violently, and suddenly **explode outward across the room** as if blasted by dynamite!

Where did this explosion come from?
- Gravity pulls crate B into crate A by a fraction of a millimeter.
- The computer detects an overlap and calculates a separation impulse to push them apart.
- Because the separation push was slightly too aggressive, crate B flies upward into crate C.
- Crate C pushes back down. The numbers compound frame-by-frame, creating a runaway feedback loop of artificial kinetic energy!

To simulate solid objects without ghosts (tunneling) and without explosions (jittering), we must understand the precise geometry of contact.

---

## Level 1: What is a Collision? Continuous Contact vs. Discrete Overlap

### 1.1 The Quantum Reality of "Touch"
In everyday speech, we say two objects "touch." But what is touch at the atomic level?
Atoms consist of a positive nucleus surrounded by an electron cloud. When two billiard balls approach each other, their outer electron orbitals begin to overlap. Because of the **Pauli Exclusion Principle** of quantum mechanics, two electrons cannot occupy the exact same quantum state. This generates an immense repulsive electromagnetic force:

$$F_{\text{repulsion}} \propto \frac{1}{r^{12}}$$

As distance $r$ approaches zero, the repulsive force skyrockets toward infinity. The surfaces never truly merge; the billiard balls deform microscopically and rebound with zero interpenetration.

### 1.2 The Discrete Computational Reality
A digital computer cannot model trillions of quantum electron clouds in real time. Instead, it approximates bodies as rigid geometric shapes: circles, rectangles, and polygons.

Because time advances in discrete chunks $\Delta t$, objects do not smoothly halt at the exact surface boundary. **Collisions in a computer are ALWAYS detected after the bodies have already illegally overlapped.**

```
Continuous Physics (Ideal):        Discrete Simulation (Reality):
───────────────────────────        ───────────────────────────────
t = 0.00s:   ( A )     ( B )       t = 0.00s:   ( A )     ( B )
t = 0.01s:      ( A )( B )         t = 0.02s:      ( A ( B ) )
             Zero-depth contact!                 Interpenetration!
```

Therefore, collision detection in software is not merely a boolean question (*"Did they touch?"*). It must answer three precise quantitative questions:
1. **Overlap Boolean:** Are the shapes intersecting?
2. **Contact Normal ($\hat{n}$):** What is the unit vector pointing along the shortest path to push them apart?
3. **Penetration Depth ($d$):** How many millimeters or meters are they illegally overlapping?

---

## Level 2: The Two-Tier Pipeline & The $\mathcal{O}(N^2)$ Pairwise Catastrophe

Suppose you are building a simulation with $N$ bouncing particles. The naive approach is a nested double loop: check every particle against every other particle.

```typescript
// NAIVE PAIRWISE CHECK (DO NOT USE IN LARGE SCENES):
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    checkCollision(bodies[i], bodies[j]);
  }
}
```

### The Mathematics of Computational Collapse
The number of pairwise tests required is given by the combination formula:
$$\text{Checks} = \binom{N}{2} = \frac{N(N - 1)}{2} = \frac{1}{2}N^2 - \frac{1}{2}N = \mathcal{O}(N^2)$$

Let us observe how this number scales:
- For $N = 10$ bodies: $\frac{10 \times 9}{2} = \mathbf{45\text{ checks per frame}}$.
- For $N = 100$ bodies: $\frac{100 \times 99}{2} = \mathbf{4,950\text{ checks per frame}}$.
- For $N = 1,000$ bodies: $\frac{1000 \times 999}{2} = \mathbf{499,500\text{ checks per frame}}$.
- For $N = 10,000$ bodies: $\frac{10000 \times 9999}{2} = \mathbf{49,995,000\text{ checks per frame}}$!

At 60 frames per second, 10,000 particles would require **3 billion geometric tests every second**. Even the fastest multi-core CPU would grind to an absolute halt.

### The Solution: The Two-Tier Architecture
To solve this, modern physics engines (e.g. Box2D, Bullet, PhysX) split collision detection into two specialized phases:

```
                  [ All N Bodies in World ]
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │ BROADPHASE: Fast, Approximate Filter      │
        │ • Spatial Hash Grids, QuadTrees, BVH      │
        │ • Time Complexity: O(N) average           │
        │ • Rejects 99.9% of non-colliding pairs    │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼ (Candidate Pairs: K << N²)
        ┌───────────────────────────────────────────┐
        │ NARROWPHASE: Exact Geometric Solvers      │
        │ • Circle-Circle, Circle-AABB, SAT         │
        │ • Time Complexity: O(K)                   │
        │ • Computes Contact Normal n and Depth d   │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼ (Contact Manifolds)
        [ Contact Impulse & Positional Solver ]
```

---

## Level 3: Broadphase Acceleration: AABBs & Spatial Hash Grids

### 3.1 Axis-Aligned Bounding Boxes (AABB)
An **Axis-Aligned Bounding Box (AABB)** is the smallest rectangular box, with edges strictly parallel to the $X$ and $Y$ coordinate axes, that completely encloses a geometric shape.

An AABB in 2D is defined by four numbers:
$$\text{Box} = [x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}]$$

```
          Y ^
            |      +------------------------+ max (x_max, y_max)
            |      |         /\             |
            |      |        /  \            |
            |      |       /    \           |
            |      |      /______\          |
            |      |     (Polygon)          |
            |      +------------------------+
            |    min (x_min, y_min)
            +──────────────────────────────────────> X
```

#### The 1D Interval Overlap Theorem:
Two AABBs, $\text{Box}_A$ and $\text{Box}_B$, overlap in 2D space if and only if their projections overlap along **both** the $X$-axis and the $Y$-axis simultaneously:

$$\text{Overlap}_{2D} \iff \left(\text{Overlap}_X\right) \land \left(\text{Overlap}_Y\right)$$

$$\text{Overlap}_X \iff \left(x_{\min, A} \le x_{\max, B}\right) \land \left(x_{\max, A} \ge x_{\min, B}\right)$$
$$\text{Overlap}_Y \iff \left(y_{\min, A} \le y_{\max, B}\right) \land \left(y_{\max, A} \ge y_{\min, B}\right)$$

Testing AABB overlap requires only **4 scalar comparisons and zero multiplications or square roots**! If the AABBs do not overlap, we know with 100% mathematical certainty that the complex shapes inside cannot possibly touch.

---

### 3.2 The Uniform Spatial Hash Grid ($\mathcal{O}(N)$ Broadphase)
While AABBs make individual pair tests fast, testing all AABBs against each other is still $\mathcal{O}(N^2)$.
To achieve true linear time ($\mathcal{O}(N)$), we partition the 2D world into a uniform grid of square cells of size $S$.

```
     +──────────+──────────+──────────+──────────+
   2 |  Cell    |  Cell    |  Cell    |  Cell    |
     |  (0, 2)  |  (1, 2)  |  (2, 2)  |  (3, 2)  |
     +──────────+──────────+──────────+──────────+
   1 |  Cell    |    ● A   |    ● B   |  Cell    |   Only test A against
     |  (0, 1)  |          |          |  (3, 1)  |   entities in cell (1,1)
     +──────────+──────────+──────────+──────────+   and 8 neighbor cells!
   0 |  Cell    |  Cell    |  Cell    |  Cell    |
     |  (0, 0)  |  (1, 0)  |  (2, 0)  |  (3, 0)  |
     +──────────+──────────+──────────+──────────+
          0          1          2          3
```

#### The Spatial Hashing Algorithm:
1. **Choose Cell Size:** Set cell size $S \ge 2 \cdot r_{\max}$ (where $r_{\max}$ is the radius of the largest entity in the scene).
2. **Convert Continuous $(x, y)$ to Integer Bucket Coordinates:**
   $$c_x = \left\lfloor \frac{x}{S} \right\rfloor, \quad c_y = \left\lfloor \frac{y}{S} \right\rfloor$$
3. **Map 2D Cell Coordinates to a 1D Hash Key:**
   To store buckets in a hash table without allocating infinite 2D arrays, compute a deterministic bitwise hash using large prime multipliers:
   $$\text{Hash}(c_x, c_y) = \left(c_x \cdot 73856093\right) \oplus \left(c_y \cdot 19349663\right)$$
4. **Query:** For any particle in cell $(c_x, c_y)$, test candidates **only** within its own cell and the 8 adjacent neighboring cells:
   $$\text{Neighbors} = \{(c_x + dx, c_y + dy) \mid dx, dy \in \{-1, 0, 1\}\}$$

Because each particle tests only a small constant number of local neighbors, total broadphase complexity drops from $\mathcal{O}(N^2)$ to **$\mathcal{O}(N)$** average time!

---

## Level 4: Narrowphase Primitives: Circles, AABBs, and Voronoi Clamping

Once broadphase identifies candidate pairs, narrowphase calculates exact geometric intersections.

### 4.1 Circle-Circle Intersection & The Sqrt Optimization
Two circles with centers $\vec{p}_1, \vec{p}_2$ and radii $r_1, r_2$ overlap if and only if the distance between their centers is strictly less than the sum of their radii:

$$\|\vec{p}_2 - \vec{p}_1\| < r_1 + r_2$$

#### inner Loop Optimization: Squared Distances
Computing Euclidean distance requires the CPU instruction for square root (`Math.sqrt()`), which is 10 to 20 times slower than addition or multiplication.
Because distances and radii are strictly non-negative:
$$a < b \iff a^2 < b^2$$

We test:
$$(\Delta x)^2 + (\Delta y)^2 < (r_1 + r_2)^2$$
Where $\Delta x = x_2 - x_1$ and $\Delta y = y_2 - y_1$.

Only if this boolean condition is `true` do we calculate the single square root to extract the contact geometry:
$$d = \sqrt{(\Delta x)^2 + (\Delta y)^2}$$
$$\text{Penetration Depth: } \delta = (r_1 + r_2) - d$$
$$\text{Unit Contact Normal: } \hat{n} = \frac{\vec{p}_2 - \vec{p}_1}{d} = \begin{bmatrix} \Delta x / d \\ \Delta y / d \end{bmatrix}$$

#### The Coincident Center Trap ($d = 0$):
If two circles spawn at the exact same coordinate ($\vec{p}_1 = \vec{p}_2$), then $d = 0$. Dividing by $d$ results in `NaN` (Not-a-Number), crashing the simulation.
*Defense:* If $d < 10^{-6}\text{ m}$, arbitrarily assign $\hat{n} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$ and $\delta = r_1 + r_2$.

---

### 4.2 Circle vs. Axis-Aligned Bounding Box (Voronoi Clamping)
How do we test if a circle with center $C(x_C, y_C)$ and radius $r$ collides with a rectangle $[x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}]$?

We find the **Closest Point $Q$ on the Box** to the circle center. This is accomplished mathematically by clamping the circle's coordinates into the box's interval:

$$Q_x = \text{clamp}(x_C, x_{\min}, x_{\max}) = \max\left(x_{\min}, \min\left(x_C, x_{\max}\right)\right)$$
$$Q_y = \text{clamp}(y_C, y_{\min}, y_{\max}) = \max\left(y_{\min}, \min\left(y_C, y_{\max}\right)\right)$$

```
     Y ^
       |  Voronoi Region 1   |      Edge Region 2       |  Voronoi Region 3
       |      (Corner)       |          (Top)           |      (Corner)
       |                     |                          |
       |  ───────────────────+──────────────────────────+───────────────────
       |                     |                          |
       |  Edge Region 4      |       INSIDE BOX         |  Edge Region 5
       |     (Left)          |                          |     (Right)
       |  ───────────────────+──────────────────────────+───────────────────
       |  Voronoi Region 6   |      Edge Region 7       |  Voronoi Region 8
       |      (Corner)       |         (Bottom)         |      (Corner)
       +─────────────────────────────────────────────────────────────────────> X
```

1. **Calculate Displacement from Closest Point to Circle Center:**
   $$\vec{u} = C - Q = \begin{bmatrix} x_C - Q_x \\ y_C - Q_y \end{bmatrix}$$
2. **Compare Squared Distance:**
   $$\|\vec{u}\|^2 = u_x^2 + u_y^2 < r^2 \implies \text{COLLISION DETECTED!}$$
3. **Contact Geometry:**
   - If the circle center is *outside* the box ($\|\vec{u}\| > 0$):
     $$d = \sqrt{u_x^2 + u_y^2}, \quad \hat{n} = \frac{\vec{u}}{d}, \quad \delta = r - d$$
   - If the circle center is *inside* the box ($C = Q$, meaning $\|\vec{u}\| = 0$):
     Find which of the 4 box edges is closest to $C$, push the circle out along that edge normal, and set penetration depth equal to radius plus the distance to that boundary.

---

## Level 5: The Separating Axis Theorem (SAT) for Convex Polygons

What if our shapes are arbitrary rotated triangles, pentagons, or oriented bounding boxes?
The universal tool for all convex shapes is the **Separating Axis Theorem (SAT)**, derived from the **Hyperplane Separation Theorem** of functional analysis.

### 5.1 The Fundamental Theorem
> **Separating Axis Theorem:** Two convex geometric shapes in Euclidean space do NOT intersect if and only if there exists a 1D line (axis) onto which their orthogonal shadows (projections) are completely disjoint.

```
       Shape A                    Shape B
         /\                         /\
        /  \                       /  \
       /____\                     /____\
         │                          │
─────────┼──────────────────────────┼───────────> Candidate Axis L
     Projection A               Projection B
     [==========]               [==========]
                               ^
                               └── Disjoint Gap! (NO COLLISION)
```

Think of this geometrically as shining a flashlight from infinite angles around the two shapes:
- If you can find even **ONE single flashlight angle** where the two shadows on the wall do not overlap, the objects cannot be touching.
- If the shadows overlap from **EVERY possible angle**, the shapes are 100% guaranteed to be intersecting!

### 5.2 Which Axes Must We Test?
Do we need to test infinitely many angles? **No!**
For 2D convex polygons, the only axes capable of separating the shapes are the **normals to the edges of the polygons**.
- For polygon $A$ with $N$ vertices: test $N$ edge normals.
- For polygon $B$ with $M$ vertices: test $M$ edge normals.
- Total tests: at most $N + M$ candidate axes!

### 5.3 Step-by-Step SAT Mathematical Algorithm
For each candidate unit normal axis $\hat{u}$:

1. **Project Polygon $A$ onto $\hat{u}$:**
   The projection of each vertex $V_i \in A$ onto 1D axis $\hat{u}$ is the scalar dot product:
   $$p_i = V_i \cdot \hat{u}$$
   The shadow interval of Polygon $A$ is:
   $$I_A = [\min_{i}(p_i), \max_{i}(p_i)] = [a_{\min}, a_{\max}]$$

2. **Project Polygon $B$ onto $\hat{u}$:**
   $$I_B = [\min_{j}(V_j \cdot \hat{u}), \max_{j}(V_j \cdot \hat{u})] = [b_{\min}, b_{\max}]$$

3. **Check for 1D Interval Disjointness:**
   If $a_{\max} < b_{\min}$ OR $b_{\max} < a_{\min}$:
   $$\mathbf{\text{SEPARATION FOUND! Exit early: NO COLLISION.}}$$

4. **Compute Overlap on Axis $\hat{u}$:**
   If the intervals overlap, the overlap distance is:
   $$\text{overlap}(\hat{u}) = \min(a_{\max}, b_{\max}) - \max(a_{\min}, b_{\min})$$

5. **Find the Minimum Translation Vector (MTV):**
   If *all* $N + M$ axes show overlaps, the polygons are colliding.
   The axis with the **SMALLEST overlap distance** is the true physical **Contact Normal** $\hat{n}$, and that minimal overlap is the **Penetration Depth** $\delta$:
   $$\delta = \min_{\text{all axes}}(\text{overlap}), \quad \hat{n} = \text{axis with minimum overlap}$$
   The Minimum Translation Vector (MTV) is:
   $$\vec{\text{MTV}} = \delta \cdot \hat{n}$$
   Moving Polygon $A$ by $-\vec{\text{MTV}}$ is the exact minimum displacement required to resolve the collision!

---

## Level 6: Contact Manifolds, Sinking Traps & Baumgarte Positional Slop

### 6.1 The Contact Manifold Structure
When a collision is confirmed, narrowphase packages the geometric data into a **Contact Manifold**:

```typescript
export interface ContactManifold {
  bodyAId: number;
  bodyBId: number;
  normal: Vector2D;       // Unit normal pointing from A to B
  penetration: number;    // Scalar penetration depth delta (meters)
  contactPoint: Vector2D; // World position of contact point
}
```

---

### 6.2 The Sinking Hazard in Gravity
Suppose a box rests on the floor.
1. At tick $k$, velocity is zero ($v = 0$).
2. Gravity accelerates the box downward: $v_{\text{new}} = v + g \cdot \Delta t = -9.81 \cdot (0.016) = -0.16\text{ m/s}$.
3. Position updates: $y_{\text{new}} = y + v_{\text{new}} \cdot \Delta t$. The box penetrates the floor by $2.5\text{ millimeters}$.
4. Narrowphase detects the collision and fires an impulse to set vertical velocity back to zero ($v = 0$).

Look at what happened: **The velocity was fixed, but the $2.5\text{ millimeter}$ overlap was NEVER removed!**
On the next tick, gravity penetrates another $2.5\text{ mm}$. Over 60 frames, the box slowly sinks through the solid floor and disappears. This is the notorious **Sinking Trap**.

---

### 6.3 The Antidote: Baumgarte Positional Stabilization
To permanently eliminate sinking, we must separate the bodies positionally as well as dynamically.

#### Method: Linear Projection with Slop
We displace the bodies along the contact normal inversely proportional to their masses:

$$\Delta \vec{p}_A = -\frac{m_A^{-1}}{m_A^{-1} + m_B^{-1}} \cdot \delta_{\text{stabilized}} \cdot \hat{n}$$
$$\Delta \vec{p}_B = +\frac{m_B^{-1}}{m_A^{-1} + m_B^{-1}} \cdot \delta_{\text{stabilized}} \cdot \hat{n}$$

Where $m^{-1} = 1/m$ is the inverse mass (for an immovable floor, $m_{\text{floor}} = \infty \implies m_{\text{floor}}^{-1} = 0$).

#### The Slop and Baumgarte Parameters:
$$\delta_{\text{stabilized}} = \beta \cdot \max\left(\delta - \text{slop}, 0\right)$$
1. **Penetration Slop ($\text{slop} \approx 0.005\text{ to } 0.01\text{ meters}$):**
   A tiny allowable tolerance. If the overlap is less than $5\text{ millimeters}$, no positional push is applied. This prevents resting objects from micro-jittering due to floating-point truncation.
2. **Baumgarte Factor ($\beta \approx 0.2\text{ to } 0.8$):**
   Instead of resolving 100% of the overlap in a single violent jump (which causes bouncy explosions), we resolve $20\%$ to $40\%$ of the penetration per tick. Within 3 to 4 frames, the object smoothly and imperceptibly settles to rest with zero sinking and zero jitter!

---

## Level 7: Production-Grade TypeScript Collision Detection & Solver Suite

```typescript
/**
 * Sovereign Tech Tree of Knowledge: Level 7 Production Implementation
 * Module: cs-collision-detection
 * Architecture: Complete 2D Collision Pipeline (Spatial Hash Grid, SAT Convex Polygons, Baumgarte Solver)
 */

export class Vector2D {
  constructor(public x: number, public y: number) {}

  public static add(a: Vector2D, b: Vector2D): Vector2D {
    return new Vector2D(a.x + b.x, a.y + b.y);
  }

  public static sub(a: Vector2D, b: Vector2D): Vector2D {
    return new Vector2D(a.x - b.x, a.y - b.y);
  }

  public static scale(v: Vector2D, s: number): Vector2D {
    return new Vector2D(v.x * s, v.y * s);
  }

  public static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  public lengthSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  public length(): number {
    return Math.sqrt(this.lengthSq());
  }

  public normalize(): Vector2D {
    const len = this.length();
    if (len < 1e-9) return new Vector2D(0, 1);
    return new Vector2D(this.x / len, this.y / len);
  }
}

export interface Body {
  id: number;
  pos: Vector2D;
  vel: Vector2D;
  mass: number;
  invMass: number;
  restitution: number;
  radius?: number;       // For circles
  vertices?: Vector2D[]; // For convex polygons (local space)
}

export interface ContactManifold {
  bodyA: Body;
  bodyB: Body;
  normal: Vector2D;    // Unit normal pointing from A to B
  penetration: number; // Positive overlap distance
}

export class CollisionDetector {
  /**
   * Circle vs Circle Narrowphase
   */
  public static testCircleCircle(a: Body, b: Body): ContactManifold | null {
    if (a.radius === undefined || b.radius === undefined) return null;

    const delta = Vector2D.sub(b.pos, a.pos);
    const distSq = delta.lengthSq();
    const rSum = a.radius + b.radius;

    if (distSq >= rSum * rSum) {
      return null; // Disjoint
    }

    const dist = Math.sqrt(distSq);
    let normal: Vector2D;
    let penetration: number;

    if (dist < 1e-6) {
      normal = new Vector2D(0, 1);
      penetration = rSum;
    } else {
      normal = Vector2D.scale(delta, 1.0 / dist);
      penetration = rSum - dist;
    }

    return { bodyA: a, bodyB: b, normal, penetration };
  }

  /**
   * Separating Axis Theorem (SAT) for Convex Polygons
   */
  public static testPolygonPolygon(a: Body, b: Body): ContactManifold | null {
    if (!a.vertices || !b.vertices) return null;

    // Transform local vertices to world coordinates
    const worldA = a.vertices.map(v => Vector2D.add(a.pos, v));
    const worldB = b.vertices.map(v => Vector2D.add(b.pos, v));

    let minOverlap = Infinity;
    let smallestAxis = new Vector2D(0, 1);

    // Collect all candidate normal axes from edges of A and B
    const axes: Vector2D[] = [];
    CollisionDetector.addPolygonEdgeNormals(worldA, axes);
    CollisionDetector.addPolygonEdgeNormals(worldB, axes);

    for (const axis of axes) {
      const projA = CollisionDetector.projectPolygon(worldA, axis);
      const projB = CollisionDetector.projectPolygon(worldB, axis);

      // Check for disjoint interval
      if (projA.max < projB.min || projB.max < projA.min) {
        return null; // Separation axis found -> NO COLLISION!
      }

      // Compute 1D overlap
      const overlap = Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min);
      if (overlap < minOverlap) {
        minOverlap = overlap;
        smallestAxis = axis;
      }
    }

    // Ensure normal points from A to B
    const centerDir = Vector2D.sub(b.pos, a.pos);
    if (Vector2D.dot(centerDir, smallestAxis) < 0) {
      smallestAxis = Vector2D.scale(smallestAxis, -1);
    }

    return {
      bodyA: a,
      bodyB: b,
      normal: smallestAxis,
      penetration: minOverlap
    };
  }

  private static addPolygonEdgeNormals(vertices: Vector2D[], axes: Vector2D[]): void {
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const edge = Vector2D.sub(p2, p1);
      // Perpendicular normal: (-dy, dx)
      const normal = new Vector2D(-edge.y, edge.x).normalize();
      axes.push(normal);
    }
  }

  private static projectPolygon(vertices: Vector2D[], axis: Vector2D): { min: number; max: number } {
    let min = Vector2D.dot(vertices[0], axis);
    let max = min;
    for (let i = 1; i < vertices.length; i++) {
      const p = Vector2D.dot(vertices[i], axis);
      if (p < min) min = p;
      if (p > max) max = p;
    }
    return { min, max };
  }
}

/**
 * High-Performance Spatial Hash Grid Broadphase
 */
export class SpatialHashBroadphase {
  private cellSize: number;
  private buckets: Map<number, Body[]> = new Map();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  public clear(): void {
    this.buckets.clear();
  }

  private hash(cx: number, cy: number): number {
    return (cx * 73856093) ^ (cy * 19349663);
  }

  public insert(body: Body): void {
    const cx = Math.floor(body.pos.x / this.cellSize);
    const cy = Math.floor(body.pos.y / this.cellSize);
    const key = this.hash(cx, cy);

    let list = this.buckets.get(key);
    if (!list) {
      list = [];
      this.buckets.set(key, list);
    }
    list.push(body);
  }

  public queryCandidatePairs(): [Body, Body][] {
    const pairs: [Body, Body][] = [];
    for (const [_, cellBodies] of this.buckets) {
      for (let i = 0; i < cellBodies.length; i++) {
        for (let j = i + 1; j < cellBodies.length; j++) {
          pairs.push([cellBodies[i], cellBodies[j]]);
        }
      }
    }
    return pairs;
  }
}

/**
 * Complete Contact Resolver: Velocity Restitution Impulse + Baumgarte Position Stabilization
 */
export class ContactResolver {
  private static slop = 0.01; // 1 cm penetration tolerance
  private static beta = 0.4;  // 40% Baumgarte positional recovery per frame

  public static resolve(manifold: ContactManifold): void {
    const { bodyA, bodyB, normal, penetration } = manifold;
    const totalInvMass = bodyA.invMass + bodyB.invMass;
    if (totalInvMass === 0) return; // Two immovable bodies

    // 1. Relative Velocity
    const relVel = Vector2D.sub(bodyB.vel, bodyA.vel);
    const velAlongNormal = Vector2D.dot(relVel, normal);

    // Do not resolve if objects are already separating
    if (velAlongNormal < 0) {
      const e = Math.min(bodyA.restitution, bodyB.restitution);
      const impulseScalar = -(1.0 + e) * velAlongNormal / totalInvMass;
      const impulse = Vector2D.scale(normal, impulseScalar);

      bodyA.vel = Vector2D.sub(bodyA.vel, Vector2D.scale(impulse, bodyA.invMass));
      bodyB.vel = Vector2D.add(bodyB.vel, Vector2D.scale(impulse, bodyB.invMass));
    }

    // 2. Baumgarte Positional Correction (Anti-Sinking)
    const correctionMagnitude = (Math.max(penetration - ContactResolver.slop, 0) / totalInvMass) * ContactResolver.beta;
    const correction = Vector2D.scale(normal, correctionMagnitude);

    bodyA.pos = Vector2D.sub(bodyA.pos, Vector2D.scale(correction, bodyA.invMass));
    bodyB.pos = Vector2D.add(bodyB.pos, Vector2D.scale(correction, bodyB.invMass));
  }
}
```

---

## Level 8: Multi-Tiered Practice Problems with Complete Step-by-Step Solutions

### Tier 1: Class 6 Anchor Problem (Circle-Circle Distance Check)
**Problem Statement:**  
Two bumper cars in an amusement park are shaped like circles:
- Car A: Center at $P_1(3.0, 4.0)\text{ m}$, radius $r_1 = 1.5\text{ m}$.
- Car B: Center at $P_2(7.0, 7.0)\text{ m}$, radius $r_2 = 2.0\text{ m}$.
1. Find the straight-line distance $d$ between the centers of the two cars.
2. Are the cars currently colliding? If so, what is the penetration depth?

**Exhaustive Step-by-Step Solution:**  
1. **Displacement Vector:**
   $$\Delta \vec{p} = P_2 - P_1 = \begin{bmatrix} 7.0 - 3.0 \\ 7.0 - 4.0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 3.0 \end{bmatrix}$$
2. **Euclidean Distance:**
   $$d = \sqrt{(\Delta x)^2 + (\Delta y)^2} = \sqrt{4.0^2 + 3.0^2} = \sqrt{16.0 + 9.0} = \sqrt{25.0} = \mathbf{5.0\text{ meters}}$$
3. **Collision Test:**
   Sum of radii:
   $$R_{\text{sum}} = r_1 + r_2 = 1.5\text{ m} + 2.0\text{ m} = \mathbf{3.5\text{ meters}}$$
   Comparing distance to radius sum:
   $$d = 5.0\text{ m} > 3.5\text{ m} = R_{\text{sum}}$$
   **Conclusion:** No collision! The surfaces are separated by a gap of $5.0 - 3.5 = 1.5\text{ meters}$.

---

### Tier 2: High School Physics (Circle vs. AABB Voronoi Clamping)
**Problem Statement:**  
A soccer ball of radius $r = 0.5\text{ m}$ has its center at coordinates $C(4.3, 4.4)$.  
A rectangular goalpost is represented as an AABB with bounds $x \in [0.0, 4.0]\text{ m}$ and $y \in [0.0, 4.0]\text{ m}$.  
Determine whether the ball is touching the corner of the goalpost.

**Exhaustive Step-by-Step Solution:**  
1. **Find Closest Point $Q$ on Box via Clamping:**
   $$Q_x = \text{clamp}(4.3, 0.0, 4.0) = 4.0\text{ m}$$
   $$Q_y = \text{clamp}(4.4, 0.0, 4.0) = 4.0\text{ m}$$
   The closest point on the goalpost is the corner $Q(4.0, 4.0)$.
2. **Compute Displacement Vector from Corner to Ball Center:**
   $$\vec{u} = C - Q = \begin{bmatrix} 4.3 - 4.0 \\ 4.4 - 4.0 \end{bmatrix} = \begin{bmatrix} 0.3 \\ 0.4 \end{bmatrix}$$
3. **Compute Squared Distance vs Radius Squared:**
   $$\text{distSq} = u_x^2 + u_y^2 = 0.3^2 + 0.4^2 = 0.09 + 0.16 = \mathbf{0.25}$$
   $$r^2 = 0.5^2 = \mathbf{0.25}$$
4. **Distance Evaluation:**
   $$d = \sqrt{0.25} = 0.50\text{ meters}$$
   Since $d = r = 0.5\text{ m}$, the surface of the ball is touching the corner at the exact tangent threshold with penetration depth $\delta = 0.0\text{ m}$.

---

### Tier 3: AP / College Level (SAT Projection on Tilted Polygon)
**Problem Statement:**  
A right-angled triangle $A$ has vertices at $(0, 0)$, $(2, 0)$, and $(0, 2)$.  
A unit square $B$ has vertices at $(1.5, 0.5)$, $(2.5, 0.5)$, $(2.5, 1.5)$, and $(1.5, 1.5)$.  
Test whether the shapes can be separated by the diagonal hypotenuse normal of triangle $A$:
$$\hat{u} = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 \\ 1 \end{bmatrix} \approx \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix}$$

**Exhaustive Step-by-Step Solution:**  
1. **Project Triangle $A$ onto $\hat{u}$:**
   - $V_1(0, 0): p_1 = 0(0.7071) + 0(0.7071) = 0.0$
   - $V_2(2, 0): p_2 = 2(0.7071) + 0(0.7071) = 1.4142$
   - $V_3(0, 2): p_3 = 0(0.7071) + 2(0.7071) = 1.4142$
   Interval of $A$:
   $$I_A = [\min(0, 1.4142), \max(0, 1.4142)] = [0.0, 1.4142]$$

2. **Project Square $B$ onto $\hat{u}$:**
   - $W_1(1.5, 0.5): q_1 = 1.5(0.7071) + 0.5(0.7071) = 2.0 \times 0.7071 = 1.4142$
   - $W_2(2.5, 0.5): q_2 = 2.5(0.7071) + 0.5(0.7071) = 3.0 \times 0.7071 = 2.1213$
   - $W_3(2.5, 1.5): q_3 = 2.5(0.7071) + 1.5(0.7071) = 4.0 \times 0.7071 = 2.8284$
   - $W_4(1.5, 1.5): q_4 = 1.5(0.7071) + 1.5(0.7071) = 3.0 \times 0.7071 = 2.1213$
   Interval of $B$:
   $$I_B = [1.4142, 2.8284]$$

3. **Check Interval Overlap:**
   $a_{\max} = 1.4142$ and $b_{\min} = 1.4142$.
   The intervals touch at a single boundary point ($1.4142$) with zero interior overlap. If the square moves even $0.001\text{ m}$ to the right, $b_{\min} > a_{\max}$, proving that this axis successfully separates the two polygons!

---

### Tier 4: University Level (Spatial Hash Grid Memory & Stride Analysis)
**Problem Statement:**  
A particle simulation contains $N = 50,000$ particles of maximum radius $r_{\max} = 0.2\text{ m}$ distributed uniformly across a $100\text{ m} \times 100\text{ m}$ domain.  
1. What is the optimal cell size $S$ for the spatial hash grid?  
2. How many total cells exist across the domain?  
3. What is the average number of particles contained in any given cell?  
4. Calculate the average number of narrowphase candidate checks per frame and compare this against the naive $\mathcal{O}(N^2)$ pairwise approach.

**Exhaustive Step-by-Step Solution:**  
1. **Optimal Cell Size:**
   Rule: $S \ge 2 r_{\max} = 2(0.2\text{ m}) = 0.4\text{ m}$. To balance bucket density and boundary crossings, set $S = 0.5\text{ meters}$.
2. **Total Cells:**
   $$\text{Cells}_X = \frac{100\text{ m}}{0.5\text{ m}} = 200, \quad \text{Cells}_Y = \frac{100\text{ m}}{0.5\text{ m}} = 200$$
   $$\text{Total Cells} = 200 \times 200 = \mathbf{40,000\text{ cells}}$$
3. **Average Particles per Cell ($\lambda$):**
   $$\lambda = \frac{N}{\text{Total Cells}} = \frac{50,000}{40,000} = \mathbf{1.25\text{ particles / cell}}$$
4. **Checks Comparison:**
   - **Naive Pairwise Checks:**
     $$\text{Checks}_{\text{naive}} = \frac{N(N - 1)}{2} = \frac{50,000 \times 49,999}{2} \approx \mathbf{1,249,975,000\text{ checks per frame}}$$
   - **Spatial Hash Grid Checks:**
     Each particle queries 9 cells (itself + 8 neighbors), encompassing an expected $9 \times 1.25 \approx 11.25$ candidate particles.
     Total candidate pairs evaluated across all 50,000 particles:
     $$\text{Checks}_{\text{grid}} \approx 50,000 \times \frac{11.25}{2} \approx \mathbf{281,250\text{ checks per frame}}$$
   - **Speedup Ratio:**
     $$\frac{\text{Checks}_{\text{naive}}}{\text{Checks}_{\text{grid}}} = \frac{1,249,975,000}{281,250} \approx \mathbf{4,444\times\text{ faster!}}$$
     The spatial hash grid reduces computational load by over **$99.97\%$**, converting an impossible calculation into real-time 60 FPS performance!

---

### Tier 5: Industry / Synthesis (Continuous Collision Detection & Time-of-Impact)
**Problem Statement:**  
A thin bullet moving at $\vec{v} = (600, 0)\text{ m/s}$ starts at $\vec{p}_0 = (10, 50)$ at $t = 0$.  
A solid steel target wall is an AABB with boundaries $x \in [50, 60], y \in [0, 100]$.  
If the simulation updates at $60\text{ Hz}$ ($\Delta t = 0.01667\text{ s}$):
1. Show that discrete collision detection fails (the bullet tunnels).
2. Using Continuous Collision Detection (CCD) via raycasting, find the exact **Time of Impact (TOI)** $t^* \in [0, \Delta t]$ and the contact point where the bullet strikes the wall.

**Exhaustive Step-by-Step Solution:**  
1. **Discrete Collision Tunneling Proof:**
   In one discrete tick:
   $$\vec{p}_1 = \vec{p}_0 + \vec{v} \cdot \Delta t = (10, 50) + (600, 0) \cdot (0.01667) = (10 + 10.0, 50) = (20, 50) \quad \text{[Wait! Let's check 600 m/s: 600 * 0.01667 = 10.0 m]}$$
   Suppose the bullet travels at $v = 3600\text{ m/s}$ (hypersonic sniper round):
   $$\Delta x = 3600 \cdot (0.01667) = 60.0\text{ meters}$$
   $$\vec{p}_1 = (10 + 60, 50) = (70, 50)$$
   - At $t = 0$: $x_0 = 10 < 50$ (Outside, in front of wall).
   - At $t = \Delta t$: $x_1 = 70 > 60$ (Outside, behind wall).
   At both evaluated discrete endpoints, the point is outside the box:
   $$\text{AABB overlap test outputs: FALSE (Tunneling Confirmed!)}$$
2. **Continuous Collision Detection (Ray-AABB Intersection):**
   The ray trajectory is:
   $$\vec{r}(t) = \vec{p}_0 + t \cdot \vec{v} = \begin{bmatrix} 10 + 3600 t \\ 50 + 0 t \end{bmatrix}$$
   The wall's left boundary plane is at $x = 50\text{ meters}$.
   Set $r_x(t^*) = 50$:
   $$10 + 3600 t^* = 50 \implies 3600 t^* = 40$$
   $$t^* = \frac{40}{3600} = \frac{1}{90} \approx \mathbf{0.01111\text{ seconds}}$$
   Since $0 \le t^* = 0.01111\text{ s} \le 0.01667\text{ s} = \Delta t$, the collision occurs inside the current time slice!
3. **Contact Coordinates:**
   $$\vec{p}_{\text{hit}} = \vec{r}(t^*) = (10 + 3600(1/90), 50) = \mathbf{(50.0, 50.0)\text{ meters}}$$
   The bullet strikes the front face of the wall at coordinate $(50, 50)$ at $t = 11.11\text{ milliseconds}$. The physics engine clamps the bullet's motion to $t^*$, halts penetration, and resolves impact without tunneling.

---

## Level 9: Philosophical & Scientific Horizons

### 9.1 The Illusion of Hardness
In classical antiquity, Democritus declared:
> *"Nothing exists except atoms and empty space; everything else is opinion."*

When you bang your fist on a solid table, you feel unyielding hardness. But modern physics reveals that the atom is $99.9999999999999\%$ empty space. If the nucleus of an atom were the size of a marble on the 50-yard line of a football stadium, the electrons would be gnats buzzing in the outermost upper-deck bleachers.

Why doesn't your hand pass straight through the table?
Because of the **Pauli Exclusion Principle** and electrostatic field repulsion. Solid matter is not solid substance—it is an **energy barrier enforced by quantum symmetry**.

### 9.2 The Minkowski Sum & Geometric Duality
In higher computational geometry, the collision between two shapes $A$ and $B$ can be mapped into a single point test using the **Minkowski Difference**:

$$A \ominus B = \{ \vec{a} - \vec{b} \mid \vec{a} \in A, \vec{b} \in B \}$$

Two shapes intersect if and only if **the origin $(0, 0)$ is contained inside their Minkowski Difference**:

$$A \cap B \neq \emptyset \iff \mathbf{0} \in (A \ominus B)$$

This mind-bending transformation converts the complex problem of colliding arbitrary moving shapes into the elegant problem of finding whether a single point $(0,0)$ sits inside a convex hull (the foundation of the Gilbert-Johnson-Keerthi GJK algorithm).

Mathematics once again reveals that what human senses perceive as mechanical collision is, at its deepest core, an invariant topological relation between vector spaces.
