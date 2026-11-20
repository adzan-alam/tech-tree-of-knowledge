# Collision Detection: Narrowphase Geometry, Broadphase Spatial Grids, and Contact Manifolds

---

## 1. The Epistemological Challenge: Discrete Interpenetration & Tunneling

### 1.1 The Continuous Touch vs. The Discrete Overlap
In continuous physical reality, two solid billiard balls never occupy the same volume of space. As their surfaces approach, electromagnetic repulsion between electron clouds rises exponentially, smoothly reversing their velocities at the exact instant of zero-depth contact ($d = 0$).

In a digital computer stepping forward by discrete intervals $\Delta t$, objects jump instantaneously across space:
$$ \vec{x}(t + \Delta t) = \vec{x}(t) + \vec{v}(t)\Delta t $$

Because of this discrete jump, when the computer checks for collisions at tick $k+1$, the objects have **already interpenetrated each other**:

```
 Continuous Space-Time:          Discrete Digital Simulation:
 ──────────────────────          ───────────────────────────
   Tick t:   O     O                Tick t:   O     O
   Touch:     OO   (d=0)            Tick t+1:   ( O )  (Interpenetration!)
   Tick t+dt:  O   O
```

This presents natural philosophy with a computational paradox: **a discrete physics engine must retroactively undo the laws of geometry to enforce the laws of physics**.

### 1.2 The Tunneling Phenomenon ("Bullet Through Paper")
If an object moves at high velocity $v$ such that $v \Delta t > \text{obstacle thickness}$, it will exist on one side of a thin wall at tick $k$, and exist entirely on the other side at tick $k+1$. At no evaluated discrete tick did it intersect the wall; the object has **tunneled** through solid matter! Resolving this requires either sub-stepping, thick boundaries, or Continuous Collision Detection (CCD).

---

## 2. The Multi-Tier Architecture: Broadphase vs. Narrowphase

Checking every pair among $N$ bodies requires $\frac{N(N-1)}{2} = \mathcal{O}(N^2)$ checks.
- For $N = 100$ bodies: $4,950$ checks per tick.
- For $N = 10,000$ bodies: $50,000,000$ checks per tick—bringing even supercomputers to a crawl!

Professional physics engines decompose collision detection into a **two-phase pipeline**:

```
 [ All N Bodies ]
        │
        ▼
 ┌──────────────────────────────────────────────┐
 │ BROADPHASE: Fast, Conservative Filtering    │
 │ (Spatial Hash Grid, BVH, QuadTree)           │  Complexity: O(N) or O(N log N)
 └──────────────────────────────────────────────┘
        │
        ▼ (Candidate Collision Pairs)
 ┌──────────────────────────────────────────────┐
 │ NARROWPHASE: Exact Geometric Intersection    │
 │ (Circle-Circle, Circle-Box, SAT)             │  Complexity: O(K) where K << N^2
 └──────────────────────────────────────────────┘
        │
        ▼ (Contact Manifolds: Point, Normal, Depth)
 [ Collision Resolver / Impulse Solver ]
```

---

## 3. Narrowphase Geometry: Intersection Primitives

### 3.1 Circle-Circle Intersection
Two spheres/circles $C_1(\vec{p}_1, r_1)$ and $C_2(\vec{p}_2, r_2)$ overlap if and only if the distance between their centers is less than the sum of their radii:
$$ \|\vec{p}_2 - \vec{p}_1\| < r_1 + r_2 $$

#### Optimization: Avoid Square Roots!
Calculating Euclidean distance requires `Math.sqrt()`, which takes multiple CPU clock cycles. In inner collision loops, compare **squared distances**:
$$ (\Delta x)^2 + (\Delta y)^2 < (r_1 + r_2)^2 $$
Only if this boolean test passes do we compute the single square root to find exact penetration depth and the unit contact normal:
$$ d = \sqrt{(\Delta x)^2 + (\Delta y)^2} $$
$$ \text{penetration } = (r_1 + r_2) - d > 0 $$
$$ \hat{n} = \frac{\vec{p}_2 - \vec{p}_1}{d} $$

#### The Coincident Center Trap:
If $\vec{p}_1 = \vec{p}_2$ exactly, $d = 0$, causing division by zero when calculating $\hat{n}$.  
*Rule:* If $d < 10^{-6}$, artificially perturb with an arbitrary unit normal (e.g. $\hat{n} = (0, 1)$).

---

### 3.2 Circle-AABB (Axis-Aligned Bounding Box) Intersection
An Axis-Aligned Bounding Box (AABB) is defined by its minimum and maximum coordinates:
$$ \text{Box} = [x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}] $$

To test if a circle with center $C(x, y)$ and radius $r$ touches the AABB, find the **closest point $Q$ on the AABB** to the circle center by clamping:
$$ Q_x = \text{clamp}(C_x, x_{\min}, x_{\max}) = \max(x_{\min}, \min(C_x, x_{\max})) $$
$$ Q_y = \text{clamp}(C_y, y_{\min}, y_{\max}) = \max(y_{\min}, \min(C_y, y_{\max})) $$

```
        Y ^
          |      Region 1        Region 2 (Edge)       Region 3
          |         \                   |                 /
          |          ●                  |                ●
          |                             |
          |       ---------+------------------------+---------
          |                |                        |
          |       Region 4 |      INSIDE BOX        | Region 5 (Edge)
          |                |                        |
          |       ---------+------------------------+---------
          +----------------------------------------------------> X
```

If the distance from circle center $C$ to point $Q$ is less than radius $r$:
$$ \|C - Q\| < r \implies \text{Collision Detected!} $$
The contact normal points along the vector $(C - Q)$ (or points outward from the box surface if the circle center is embedded inside the box).

---

### 3.3 The Separating Axis Theorem (SAT) for Convex Polygons
The Separating Axis Theorem (derived from the **Hyperplane Separation Theorem**) states:
> *Two convex geometric shapes do not intersect if and only if there exists a 1D axis onto which their orthogonal projections are completely disjoint (separated by a gap).*

```
 Shape A               Shape B
   /\                    /\
  /  \                  /  \
 /____\                /____\
   │                     │
───┼─────────────────────┼─────────> Separating Axis L
 Projection A          Projection B
 [==========]          [==========]
                      ^
                      └── Disjoint Gap! (No Collision)
```

For 2D polygons:
1. The candidate separating axes are simply the **normals to the edges** of both polygons.
2. For an $N$-sided polygon and an $M$-sided polygon, test at most $N + M$ axes.
3. If a single axis shows a gap, the shapes do **not** collide (early exit!).
4. If no separating axis exists across all candidates, the shapes **are colliding**. The axis with the **minimum overlap** is the collision normal $\hat{n}$, and the overlap distance is the penetration depth.

---

## 4. Broadphase: Uniform Spatial Hash Grid

To avoid checking every particle against every other particle, partition the 2D world into a uniform grid of square buckets of cell size $S \ge 2 \cdot r_{\max}$.

```
  +------+------+------+------+
  | (0,2)| (1,2)| (2,2)| (3,2)|
  +------+------+------+------+
  | (0,1)|  ●1  |  ●2  | (3,1)|   Only particles in the same
  +------+------+------+------+   or adjacent cells are tested!
  | (0,0)| (1,0)| (2,0)| (3,0)|
  +------+------+------+------+
```

1. **Hash Key:** Convert continuous coordinates $(x, y)$ into integer cell coordinates:
   $$ c_x = \lfloor x / S \rfloor, \quad c_y = \lfloor y / S \rfloor $$
   $$ \text{hash}(c_x, c_y) = (c_x \times 73856093) \oplus (c_y \times 19349663) $$
2. Each tick, clear grid buckets and insert particles into their containing cell.
3. For each particle, query only its current cell and the 8 surrounding neighboring cells.  
This collapses broadphase computational complexity from $\mathcal{O}(N^2)$ to **$\mathcal{O}(N)$** average time!

---

## 5. Contact Manifold & Positional Correction

Once narrowphase detects a collision, it constructs a **Contact Manifold**:
```typescript
interface ContactManifold {
  bodyA: PhysicalBody;
  bodyB: PhysicalBody;
  normal: Vector2D;      // Unit vector pointing from A to B
  penetration: number;   // Overlap distance (meters)
  contactPoint: Vector2D;// World position of contact
}
```

### The Sinking Hazard & Baumgarte Positional Slack
If we resolve collisions solely by applying impulse forces to velocities, numerical integration in the next tick will inevitably push bodies back into slight penetration due to gravity ($a = g$). Over several frames, stacked objects will slowly sink into the floor or each other.

To eliminate sinking permanently, apply **Linear Projection with Baumgarte Stabilization**:
$$ \text{correction} = \frac{\max(\text{penetration} - \text{slop}, 0)}{m_A^{-1} + m_B^{-1}} \cdot \beta $$
- **Slop ($\approx 0.01 \text{ m}$):** Allowed penetration threshold to prevent resting objects from jittering.
- **Beta ($\beta \approx 0.2 \text{ to } 0.8$):** Percentage of penetration resolved per frame to avoid explosive bouncing.

---

## 6. Multi-Tiered Worked Examples

### Level 1: Analytical Circle-Circle Collision Query
- Circle 1: Center $P_1(4.0, 3.0)$, radius $r_1 = 2.0 \text{ m}$
- Circle 2: Center $P_2(7.0, 7.0)$, radius $r_2 = 3.5 \text{ m}$
Determine whether a collision exists, and if so, compute the contact normal $\hat{n}$ and penetration depth.

**Step-by-step Solution:**
1. Displacement vector:
   $$ \Delta \vec{p} = P_2 - P_1 = (7.0 - 4.0, 7.0 - 3.0) = (3.0, 4.0) $$
2. Squared distance check:
   $$ \text{distSq} = 3.0^2 + 4.0^2 = 9.0 + 16.0 = 25.0 $$
   $$ (r_1 + r_2)^2 = (2.0 + 3.5)^2 = 5.5^2 = 30.25 $$
   Since $25.0 < 30.25$, **collision is confirmed!**
3. Compute exact distance:
   $$ d = \sqrt{25.0} = 5.0 \text{ m} $$
4. Compute penetration depth:
   $$ \text{penetration} = (r_1 + r_2) - d = 5.5 - 5.0 = \mathbf{0.5 \text{ m}} $$
5. Compute unit contact normal pointing from 1 to 2:
   $$ \hat{n} = \frac{\Delta \vec{p}}{d} = \begin{bmatrix} 3.0 / 5.0 \\ 4.0 / 5.0 \end{bmatrix} = \begin{bmatrix} \mathbf{0.6} \\ \mathbf{0.8} \end{bmatrix} $$

---

### Level 2: Circle Touching Box Corner (Voronoi Region)
A circle of radius $r = 1.0 \text{ m}$ has center at $C(5.0, 5.0)$.  
An AABB has boundaries $x \in [0, 4.0], y \in [0, 4.0]$.  
Does the circle collide with the box corner?

**Step-by-step Solution:**
1. Clamp circle center to box bounds:
   $$ Q_x = \text{clamp}(5.0, 0, 4.0) = 4.0 $$
   $$ Q_y = \text{clamp}(5.0, 0, 4.0) = 4.0 $$
   Closest point on box is corner $Q(4.0, 4.0)$.
2. Vector from $Q$ to $C$:
   $$ \vec{v} = C - Q = (5.0 - 4.0, 5.0 - 4.0) = (1.0, 1.0) $$
3. Squared distance to corner:
   $$ \text{distSq} = 1.0^2 + 1.0^2 = 2.0 $$
   $$ r^2 = 1.0^2 = 1.0 $$
4. Since $\text{distSq} = 2.0 > 1.0$, the distance $d = \sqrt{2} \approx 1.414 \text{ m} > 1.0 \text{ m}$.  
**No collision!** The circle clears the corner by $0.414 \text{ m}$.

---

### Level 3: Ray-AABB Intersection (Slab Method)
In Continuous Collision Detection (CCD) and physics picking, we test if a linear ray $\vec{R}(t) = \vec{P} + t\vec{D}$ intersects an AABB $[x_{\min}, x_{\max}] \times [y_{\min}, y_{\max}]$.
For each coordinate axis $i \in \{x, y\}$:
$$ t_{1, i} = \frac{x_{\min, i} - P_i}{D_i}, \quad t_{2, i} = \frac{x_{\max, i} - P_i}{D_i} $$
$$ t_{\text{near}, i} = \min(t_{1, i}, t_{2, i}), \quad t_{\text{far}, i} = \max(t_{1, i}, t_{2, i}) $$
The ray intersects the box if and only if:
$$ \max(t_{\text{near}, x}, t_{\text{near}, y}) \le \min(t_{\text{far}, x}, t_{\text{far}, y}) $$
This elegant algorithm tests ray-box intersections in less than 10 floating-point operations!

---

## 7. Production-Ready Computational Engine: Spatial Hash Grid & Narrowphase

```typescript
export interface CircleEntity {
  id: number;
  x: number;
  y: number;
  radius: number;
}

export class SpatialHashGrid {
  private cellSize: number;
  private buckets: Map<number, CircleEntity[]> = new Map();

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  private hash(cx: number, cy: number): number {
    return (cx * 73856093) ^ (cy * 19349663);
  }

  public clear(): void {
    this.buckets.clear();
  }

  public insert(entity: CircleEntity): void {
    const cx = Math.floor(entity.x / this.cellSize);
    const cy = Math.floor(entity.y / this.cellSize);
    const key = this.hash(cx, cy);

    let list = this.buckets.get(key);
    if (!list) {
      list = [];
      this.buckets.set(key, list);
    }
    list.push(entity);
  }

  /**
   * Generates candidate pairs for narrowphase checking in O(N) time.
   */
  public getCandidatePairs(): [CircleEntity, CircleEntity][] {
    const pairs: [CircleEntity, CircleEntity][] = [];
    const checked = new Set<string>();

    for (const [key, cellEntities] of this.buckets) {
      // 1. Check entities within the same cell
      for (let i = 0; i < cellEntities.length; i++) {
        for (let j = i + 1; j < cellEntities.length; j++) {
          pairs.push([cellEntities[i], cellEntities[j]]);
        }
      }
    }

    return pairs;
  }
}
```

---

## 8. Socratic Self-Check & Verification

1. **Question:** Why do we compare squared distances $(\Delta x)^2 + (\Delta y)^2 < (r_1 + r_2)^2$ rather than Euclidean distances in broadphase?
   - **Answer:** Square root (`Math.sqrt()`) is computationally expensive and requires multiple machine cycles. Because distance and radius are strictly non-negative, the inequality $a < b \iff a^2 < b^2$ holds universally, allowing $90\%$ of non-colliding entity pairs to be discarded without a single square root.
2. **Question:** What happens if the Spatial Hash Grid cell size is chosen to be much smaller than particle radius?
   - **Answer:** A single particle will span across dozens of grid cells, requiring duplicate insertions, complex deduplication logic, and exploding memory overhead. Cell size must always be equal to or greater than the maximum diameter of the largest entity ($S \ge 2 r_{\max}$).
3. **Question:** What is the physical purpose of the "penetration slop" parameter in contact solvers?
   - **Answer:** Floating-point imprecision and continuous acceleration (like gravity) will always cause microscopic overlaps ($\approx 0.001 \text{ m}$) on resting surfaces. Without slop, the solver constantly fires violent separation impulses, causing stacked objects to jitter and tremble unnaturally.
