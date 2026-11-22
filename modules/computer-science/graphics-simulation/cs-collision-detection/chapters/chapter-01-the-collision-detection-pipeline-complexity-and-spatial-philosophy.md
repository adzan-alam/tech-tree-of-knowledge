# Chapter 1: The Collision Detection Pipeline: Computational Complexity & Spatial Philosophy

> *"In continuous mathematics, two solid objects touch when the distance between their boundaries equals zero. On discrete silicon, objects leap forward in finite temporal jumps, their geometric boundaries warping across memory, threatening either to miss each other entirely or interpenetrate into non-physical catastrophe. Collision detection is the algorithmic science of turning continuous physical touch into rigorous, bounded computational geometry."*

---

### Conceptual Architecture: The Tri-Stage Collision Detection Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             SIMULATION WORLD: N RIGID BODIES                             │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Exhaustive check: O(N^2) pairs [PROHIBITIVE]
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│               STAGE 1: BROAD-PHASE SPATIAL CULLING  [O(N) Complexity]                   │
│   • Spatial Hash Grids, Dynamic BVH Trees, Sweep-and-Prune                               │
│   • Conservative Bounding Volumes: Bounding Spheres & Axis-Aligned Bounding Boxes (AABB) │
│   • Philosophy: False Positives allowed; ZERO False Negatives permitted                  │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Candidate Overlap Pairs (k << N^2)
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   STAGE 2: NARROW-PHASE GEOMETRIC RESOLUTION                             │
│   • Exact Geometric Intersection Tests: Circle-Circle, Circle-AABB, SAT, GJK             │
│   • Minkowski Difference Origin Inclusion: 0 ∈ (A ⊖ B)                                   │
│   • Output: Boolean Contact Predicate + Minimum Translation Vector (MTV)                 │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Verified Colliding Pairs
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    STAGE 3: CONTACT MANIFOLD GENERATION                                  │
│   • Contact Normal n, Penetration Depth δ, Contact Points {p_k}                          │
│   • Sutherland-Hodgman Reference/Incident Edge Clipping                                  │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Contact Manifolds
                                              ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│               STAGE 4: DYNAMIC CONSTRAINT & IMPULSE RESOLUTION                           │
│   • Linear Positional Projection & Baumgarte Stabilization                               │
│   • Normal Restitution Impulse + Tangential Coulomb Friction Cone                        │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.1 The Combinatorial Bottleneck: The $\mathcal{O}(N^2)$ Pairwise Disaster

In any physical environment populated by $N$ independent entities (such as particles in a granular fluid, celestial asteroids in a debris field, or characters and projectiles in an interactive virtual world), every entity can theoretically collide with any other entity.

### 1.1.1 The Combinatorial Formula
The total number of distinct unordered pairs among $N$ bodies is given by the binomial coefficient:
$$P(N) = \binom{N}{2} = \frac{N(N - 1)}{2} = \frac{1}{2} N^2 - \frac{1}{2} N = \mathcal{O}(N^2)$$

```
Combinatorial Scaling of Pairwise Collision Checks
      Pairs ▲
            │                                                      * P(10,000) = 49,995,000
 50,000,000 ┼                                                     /
            │                                                    /
 25,000,000 ┼                                                   /
            │                                                  /
            │                                                 /
    499,500 ┼                               * P(1,000)       /
      4,950 ┼            * P(100)          /                /
          0 ┼────────────┴─────────────────┴────────────────┴──────► N (Entities)
            0           100              1,000            10,000
```

Let us evaluate the real computational scaling of naive pairwise checking:

| Entity Count ($N$) | Total Unique Pairs ($P$) | Checks at 60 Hz (per second) | Compute Feasibility on Modern CPU |
|---|---|---|---|
| $10$ | $45$ | $2,700$ | Negligible ($< 0.001\text{ ms}$) |
| $50$ | $1,225$ | $73,500$ | Trivial ($< 0.05\text{ ms}$) |
| $100$ | $4,950$ | $297,000$ | Fast ($0.2\text{ ms}$) |
| $500$ | $124,750$ | $7,485,000$ | Noticeable slowdown ($5\text{ ms}$) |
| $1,000$ | $499,500$ | $29,970,000$ | **Frame Drop Disaster** ($25\text{ ms} > 16.6\text{ ms}$) |
| $5,000$ | $12,497,500$ | $749,850,000$ | Total Engine Lockup ($600\text{ ms}$) |
| $10,000$ | $49,995,000$ | $2,999,700,000$ | Complete Unresponsiveness ($2.5\text{ seconds}$) |

### 1.1.2 The Real-Time Hardware Clock Budget
A standard interactive simulation operates at a target refresh rate of $60\text{ Hz}$ (or $120\text{ Hz}$ in virtual reality and high-precision robotics). At $60\text{ Hz}$, the engine has a strict hard deadline:
$$\Delta t_{\text{frame}} = \frac{1.0\text{ s}}{60} \approx 0.016667\text{ s} = 16.67\text{ milliseconds}$$

Within this single $16.67\text{ ms}$ budget, the simulator must execute:
1. Input handling and AI logic ($\approx 2.0\text{ ms}$)
2. Numerical integration of forces and accelerations ($\approx 1.5\text{ ms}$)
3. **Collision Detection and Spatial Culling ($\approx 5.0\text{ ms}$)**
4. Contact manifold generation and impulse constraint solving ($\approx 4.0\text{ ms}$)
5. Graphics rendering, buffer updates, and scene submission ($\approx 4.17\text{ ms}$)

On a modern $3.0\text{ GHz}$ CPU core capable of executing roughly 3 billion raw cycles per second, a $5.0\text{ ms}$ collision budget equates to:
$$\text{Cycles Available} = (3.0 \times 10^9\text{ cycles/s}) \times (0.005\text{ s}) = 15,000,000\text{ cycles}$$

If a naive all-pairs algorithm is tested with $N = 1000$ entities ($499,500$ pairs):
$$\text{Max Cycles per Pair Check} = \frac{15,000,000\text{ cycles}}{499,500\text{ pairs}} \approx 30.03\text{ cycles/pair}$$

A full narrow-phase geometric test (evaluating square roots, dot products, branch mispredictions, and cache misses) easily requires 100 to 500 CPU cycles. **Naive all-pairs collision detection causes any physics simulation with more than a few hundred objects to miss its frame budget and freeze.**

---

## 1.2 The Conservative Spatial Philosophy

To overcome the $\mathcal{O}(N^2)$ disaster, high-performance simulation systems partition collision detection into a tiered multi-stage architecture:

```
  All N Bodies ──► [ Broad-Phase Spatial Culling ] ──► Candidate Pairs (k << N^2)
                                                             │
                                                             ▼
                                                [ Narrow-Phase Geometry ]
                                                             │
                                                             ▼
                                                    Real Contacts Found
```

### 1.2.1 The Asymmetric Cost of Spatial Classification Errors
In software engineering and data science, algorithms balance false positives against false negatives. In physical simulation, however, this balance is radically asymmetric:

> **The Sovereign Law of Broad-Phase Spatial Culling:**
> 1. **A False Positive** (reporting that body $A$ and body $B$ might be colliding when they are actually separated) is merely an optimization inefficiency: the subsequent narrow-phase test will spend a few cycles discovering they do not touch and safely discard the pair.
> 2. **A False Negative** (reporting that body $A$ and body $B$ cannot collide when they actually do) is a **catastrophic physical violation**: the engine skips the narrow-phase check, generates zero contact forces, and the bodies pass through each other like ghosts, shattering physical plausibility.

Therefore, every broad-phase acceleration structure (spatial hash grids, quadtrees, bounding volume hierarchies) is mathematically designed to be **strictly conservative**:
$$\text{Actual Geometry } \mathcal{G}_i \subseteq \text{Bounding Volume } \mathcal{B}_i$$
$$\mathcal{G}_1 \cap \mathcal{G}_2 \ne \emptyset \implies \mathcal{B}_1 \cap \mathcal{B}_2 \ne \emptyset$$
Taking the logical contrapositive:
$$\mathcal{B}_1 \cap \mathcal{B}_2 = \emptyset \implies \mathcal{G}_1 \cap \mathcal{G}_2 = \emptyset$$
If the simple bounding envelopes do not intersect, the underlying complex physical bodies **cannot possibly intersect**.

---

## 1.3 Discrete vs Continuous Collision Detection: The Tunneling Disaster

In classical Newtonian mechanics, time is an unbroken continuous continuum. In computational physics, time is discretized into finite ticks $\Delta t = t_{n+1} - t_n$.

### 1.3.1 Discrete Collision Detection (DCD)
In Discrete Collision Detection, the simulation loop alternates between integration and geometry:
1. Advance positions: $\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t$
2. Test static geometric overlap between bodies at their static positions $\mathbf{x}_{n+1}$.

```
The Bullet-Through-Paper Tunneling Phenomenon (DCD Failure)

         Time t_n                            Time t_{n+1} = t_n + Δt
  ┌───────────────────────┐            ┌───────────────────────┐
  │                       │            │                       │
  │   ●                   │ █ Wall █   │                     ● │ █ Wall █
  │ Bullet (v = 200 m/s)  │ █ w=0.02m█ │   No overlap!         │
  │ x_n = 0.0 m           │ █        █ │   x_{n+1} = 3.33 m    │
  │                       │ █ x=1.0m █ │   Bullet tunneled!    │
  └───────────────────────┘            └───────────────────────┘
```

### 1.3.2 The Tunneling Threshold Condition
Consider a small fast projectile ("bullet") of radius $r$ moving along the $x$-axis with high speed $v_x$ toward a static barrier ("paper wall") of thickness $w$ located at $x_{\text{wall}}$.
At tick $n$, the front boundary of the projectile is at $x_n + r < x_{\text{wall}}$.
At tick $n+1$, the rear boundary of the projectile has advanced to:
$$x_{n+1} - r = x_n + v_x \Delta t - r$$

If the displacement per frame exceeds the combined spatial thickness of the barrier and projectile:
$$v_x \Delta t > w + 2r$$
Then at $t = t_n$, the projectile is entirely in front of the wall ($x_n + r < x_{\text{wall}}$), and at $t = t_{n+1}$, the projectile is entirely behind the wall ($x_{n+1} - r > x_{\text{wall}} + w$).

At no discrete sampling point did the geometry overlap. The discrete detector reports zero collisions! The bullet tunnels straight through solid matter without losing momentum.

### 1.3.3 Continuous Collision Detection (CCD)
To prevent tunneling, **Continuous Collision Detection (CCD)** shifts from static point testing to spatio-temporal swept volumes:
1. Construct the continuous trajectory curve $\mathbf{x}(t)$ for $t \in [t_n, t_{n+1}]$.
2. Compute the **Time of Impact (TOI)** $t^* \in [0, \Delta t]$ where the swept shape of body $A$ first makes contact with the swept shape of body $B$.
3. Advance the simulation to the exact moment of impact $t_n + t^*$, resolve the collision impulse, and advance remaining time $\Delta t - t^*$.

---

## 1.4 Minkowski Geometry and the Origin Inclusion Principle

One of the most profound mathematical unifications in computational geometry was the realization that testing whether two complex moving shapes intersect can be reduced to testing whether a single stationary point (the origin $\mathbf{0}$) lies inside a single combined geometric shape: the **Minkowski Difference**.

```
Minkowski Difference Transformation

  Object A (Triangle)     Object B (Square)          Minkowski Difference A ⊖ B
         ▲                       ▲                                ▲
         │                       │                                │        *
         │      /\               │   ┌───┐                        │       / \
         │     /  \              │   │ B │                        │      / A ⊖ B
         │    / A  \             │   └───┘                        │     /     \
         │   /______\            │                                │    /   •   \
   ──────┼─────────────►   ──────┼─────────────►            ──────┼───/───(0,0)──\──────►
         │                       │                                │  /__________\
                                                                  │
                                                        Origin (0,0) is INSIDE!
                                                        ==> A and B INTERSECT!
```

### 1.4.1 Formal Mathematical Definitions
Let $\mathcal{A}, \mathcal{B} \subset \mathbb{R}^d$ be two non-empty point sets in Euclidean space.

1. **The Minkowski Sum** ($\mathcal{A} \oplus \mathcal{B}$):
   $$\mathcal{A} \oplus \mathcal{B} \equiv \{ \mathbf{a} + \mathbf{b} : \mathbf{a} \in \mathcal{A}, \mathbf{b} \in \mathcal{B} \}$$

2. **The Minkowski Difference** ($\mathcal{A} \ominus \mathcal{B}$):
   $$\mathcal{A} \ominus \mathcal{B} \equiv \{ \mathbf{a} - \mathbf{b} : \mathbf{a} \in \mathcal{A}, \mathbf{b} \in \mathcal{B} \} = \mathcal{A} \oplus (-\mathcal{B})$$
   where $-\mathcal{B} \equiv \{ -\mathbf{b} : \mathbf{b} \in \mathcal{B} \}$ is the reflection of set $\mathcal{B}$ through the origin.

### 1.4.2 The Origin Inclusion Theorem
> **Theorem (Origin Inclusion Equivalence):**
> Two sets $\mathcal{A}$ and $\mathcal{B}$ have a non-empty intersection if and only if the origin $\mathbf{0} \in \mathbb{R}^d$ is an element of their Minkowski difference:
> $$\mathcal{A} \cap \mathcal{B} \ne \emptyset \iff \mathbf{0} \in (\mathcal{A} \ominus \mathcal{B})$$

**Proof:**
- **($\implies$) Direct implication:**
  Suppose $\mathcal{A} \cap \mathcal{B} \ne \emptyset$. Then there exists at least one common point $\mathbf{p}$ such that $\mathbf{p} \in \mathcal{A}$ and $\mathbf{p} \in \mathcal{B}$.
  Setting $\mathbf{a} = \mathbf{p}$ and $\mathbf{b} = \mathbf{p}$, the difference is:
  $$\mathbf{a} - \mathbf{b} = \mathbf{p} - \mathbf{p} = \mathbf{0}$$
  Since $\mathbf{a} \in \mathcal{A}$ and $\mathbf{b} \in \mathcal{B}$, by definition $\mathbf{a} - \mathbf{b} \in (\mathcal{A} \ominus \mathcal{B})$. Hence, $\mathbf{0} \in (\mathcal{A} \ominus \mathcal{B})$.

- **($\impliedby$) Converse implication:**
  Suppose $\mathbf{0} \in (\mathcal{A} \ominus \mathcal{B})$. By definition of the Minkowski difference, there must exist points $\mathbf{a} \in \mathcal{A}$ and $\mathbf{b} \in \mathcal{B}$ such that:
  $$\mathbf{a} - \mathbf{b} = \mathbf{0} \implies \mathbf{a} = \mathbf{b}$$
  Let $\mathbf{p} = \mathbf{a} = \mathbf{b}$. Because $\mathbf{p} \in \mathcal{A}$ and $\mathbf{p} \in \mathcal{B}$, $\mathbf{p} \in (\mathcal{A} \cap \mathcal{B})$. Therefore, $\mathcal{A} \cap \mathcal{B} \ne \emptyset$. $\blacksquare$

### 1.4.3 Physical Interpretation of the Minkowski Difference
This equivalence transforms all collision detection and resolution:
1. **Separation Distance:** The minimum Euclidean distance between disjoint shapes $\mathcal{A}$ and $\mathcal{B}$ is precisely the minimum distance from the origin $\mathbf{0}$ to the boundary of $\mathcal{A} \ominus \mathcal{B}$:
   $$\text{dist}(\mathcal{A}, \mathcal{B}) = \min_{\mathbf{p} \in (\mathcal{A} \ominus \mathcal{B})} \|\mathbf{p}\|$$
2. **Penetration Depth & MTV:** When shapes overlap ($\mathbf{0} \in \mathcal{A} \ominus \mathcal{B}$), the **Minimum Translation Vector (MTV)** required to separate them is the shortest vector from the origin to the surface of $\mathcal{A} \ominus \mathcal{B}$.

---

## 1.5 Progressive Numerical Worked Examples

---

### Worked Example 1.1: Combinatorial Scaling and CPU Budget Exhaustion
**Problem Statement:** A physics simulation runs on a single CPU core clocked at $3.2\text{ GHz}$. The target frame rate is $60\text{ Hz}$. A programmer dedicates $40\%$ of the frame time budget exclusively to collision detection.
A narrow-phase collision test between two arbitrary oriented bodies requires an average of $180\text{ CPU cycles}$.
1. Calculate the total frame duration $\Delta t_{\text{frame}}$ and the allocated collision time budget $T_{\text{col}}$ in milliseconds.
2. Determine the maximum number of pairwise checks $P_{\max}$ that can be completed within budget.
3. Compute the maximum number of entities $N_{\max}$ that can be simulated using naive brute-force all-pairs collision checking without dropping frames.
4. If the world contains $N = 2500$ entities, calculate how many seconds the brute-force collision test would take to execute a single frame.

**Step-by-Step Mathematical Solution:**

**Step 1: Frame duration and collision budget.**
$$\Delta t_{\text{frame}} = \frac{1.0\text{ s}}{60} \approx 0.016667\text{ s} = 16.667\text{ ms}$$
$$T_{\text{col}} = 0.40 \times 16.667\text{ ms} = 6.6667\text{ ms} = 0.0066667\text{ s}$$

**Step 2: Total cycles available and maximum pairs.**
Total clock cycles during $T_{\text{col}}$:
$$\text{Cycles} = (3.2 \times 10^9\text{ cycles/s}) \times (0.0066667\text{ s}) = 21,333,333\text{ cycles}$$
At $180\text{ cycles}$ per pairwise narrow-phase test:
$$P_{\max} = \frac{21,333,333\text{ cycles}}{180\text{ cycles/pair}} \approx 118,518.5 \implies 118,518\text{ pairs}$$

**Step 3: Maximum entities $N_{\max}$ for brute-force.**
The pairwise formula is $\frac{N(N - 1)}{2} = P_{\max}$:
$$N^2 - N - 2 P_{\max} = 0 \implies N^2 - N - 2(118518) = 0$$
$$N^2 - N - 237036 = 0$$
Using the quadratic formula:
$$N = \frac{1 + \sqrt{1 - 4(1)(-237036)}}{2} = \frac{1 + \sqrt{1 + 948144}}{2} = \frac{1 + \sqrt{948145}}{2} \approx \frac{1 + 973.727}{2} \approx 487.36$$
Thus, $N_{\max} = 487\text{ entities}$. Beyond 487 objects, brute-force all-pairs checking drops frames immediately.

**Step 4: Execution time for $N = 2500$ entities under brute-force.**
$$P(2500) = \frac{2500 \times 2499}{2} = 1250 \times 2499 = 3,123,750\text{ pairs}$$
Total cycles required:
$$\text{Total Cycles} = 3,123,750 \times 180 = 562,275,000\text{ cycles}$$
Time to compute on $3.2\text{ GHz}$ CPU:
$$t = \frac{562,275,000\text{ cycles}}{3.2 \times 10^9\text{ cycles/s}} \approx 0.1757\text{ seconds} = 175.7\text{ ms}$$
This is more than $10.5\times$ longer than the entire $16.67\text{ ms}$ frame budget, reducing the simulation to an unplayable slideshow of $5.7\text{ FPS}$.

---

### Worked Example 1.2: Discrete Sampling Tunneling Speed Threshold
**Problem Statement:** A 2D physics engine executes at fixed timestep $\Delta t = 0.020\text{ s}$ ($50\text{ Hz}$). A fast projectile of radius $r = 0.04\text{ m}$ is fired horizontally toward a stationary concrete barrier of thickness $w = 0.12\text{ m}$.
1. Derive the minimum velocity $v_{\text{tunnel}}$ at which the projectile is guaranteed to tunnel through the barrier under Discrete Collision Detection (DCD).
2. If the projectile travels at $v = 15.0\text{ m/s}$, can tunneling occur?
3. Calculate the maximum safe timestep $\Delta t_{\text{safe}}$ that prevents tunneling for a projectile speed of $v = 40.0\text{ m/s}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Derivation of tunneling threshold.**
For tunneling to occur, the projectile must be completely in front of the wall at step $n$ and completely behind the wall at step $n+1$.
At step $n$, the leading edge is at $x_n + r \le x_{\text{wall, front}}$.
At step $n+1$, the trailing edge is at $x_{n+1} - r \ge x_{\text{wall, back}} = x_{\text{wall, front}} + w$.
The displacement between consecutive steps is $\Delta x = x_{n+1} - x_n = v \Delta t$.
Subtracting the two boundary conditions:
$$(x_{n+1} - r) - (x_n + r) \ge (x_{\text{wall, front}} + w) - x_{\text{wall, front}}$$
$$x_{n+1} - x_n - 2r \ge w \implies v \Delta t - 2r \ge w$$
$$v \Delta t \ge w + 2r \implies v_{\text{tunnel}} = \frac{w + 2r}{\Delta t}$$

Substituting numerical values ($w = 0.12\text{ m}, r = 0.04\text{ m}, \Delta t = 0.020\text{ s}$):
$$w + 2r = 0.12 + 2(0.04) = 0.12 + 0.08 = 0.20\text{ m}$$
$$v_{\text{tunnel}} = \frac{0.20\text{ m}}{0.020\text{ s}} = 10.0\text{ m/s}$$

**Step 2: Speed comparison at $v = 15.0\text{ m/s}$.**
Because $v = 15.0\text{ m/s} > v_{\text{tunnel}} = 10.0\text{ m/s}$, the per-tick displacement is $\Delta x = 15.0 \times 0.02 = 0.30\text{ m} > 0.20\text{ m}$.
**Yes, tunneling can occur.** For instance, if the front edge is at $0.05\text{ m}$ before the wall at tick $n$, at tick $n+1$ it will be $0.25\text{ m}$ beyond the front edge ($0.13\text{ m}$ past the rear edge), passing through without any intersection detected.

**Step 3: Safe timestep for $v = 40.0\text{ m/s}$.**
To prevent tunneling under DCD, the per-tick displacement must not exceed the combined width:
$$v \Delta t \le w + 2r \implies \Delta t \le \frac{w + 2r}{v}$$
$$\Delta t_{\text{safe}} = \frac{0.20\text{ m}}{40.0\text{ m/s}} = 0.0050\text{ s} = 5.0\text{ ms} \quad (200\text{ Hz})$$
To safely simulate this projectile using discrete collision tests without continuous swept volumes, the engine would need at least 4 sub-steps per frame.

---

### Worked Example 1.3: Conservative Bounding Circle for an Equilateral Triangle
**Problem Statement:** A 2D rigid game entity is shaped as an equilateral triangle with side length $s = 2.0\text{ m}$ centered at the origin $\mathbf{c} = [0, 0]^T$.
1. Compute the distance from the centroid to each of the three vertices (the circumradius $R_{\text{circum}}$).
2. Formulate the conservative bounding circle $\mathcal{B}_{\text{circle}}$ for this entity.
3. Compare the area of the bounding circle to the true area of the triangle and compute the broad-phase geometric conservatism ratio $\frac{\text{Area}(\mathcal{B})}{\text{Area}(\mathcal{G})}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Circumradius calculation.**
For an equilateral triangle of side $s$, the height $h$ is:
$$h = \frac{\sqrt{3}}{2} s = \frac{\sqrt{3}}{2} (2.0) = \sqrt{3} \approx 1.73205\text{ m}$$
The centroid divides the median in a $2:1$ ratio:
$$R_{\text{circum}} = \frac{2}{3} h = \frac{2}{3} \sqrt{3} = \frac{2}{\sqrt{3}} \approx 1.15470\text{ m}$$

**Step 2: Conservative bounding circle.**
The bounding circle is defined by center $\mathbf{c} = [0, 0]^T$ and radius $r = R_{\text{circum}} = 1.1547\text{ m}$.
$$\mathcal{B}_{\text{circle}} = \left\{ [x, y]^T \in \mathbb{R}^2 : x^2 + y^2 \le (1.1547)^2 \approx 1.3333\text{ m}^2 \right\}$$
Any point $\mathbf{p}$ inside or on the boundary of the triangle satisfies $\|\mathbf{p}\| \le R_{\text{circum}}$, guaranteeing zero false negatives.

**Step 3: Area comparison and conservatism ratio.**
True triangle area:
$$\text{Area}(\mathcal{G}) = \frac{\sqrt{3}}{4} s^2 = \frac{\sqrt{3}}{4} (2.0^2) = \sqrt{3} \approx 1.73205\text{ m}^2$$
Bounding circle area:
$$\text{Area}(\mathcal{B}) = \pi R_{\text{circum}}^2 = \pi \left(\frac{4}{3}\right) = \frac{4\pi}{3} \approx 4.18879\text{ m}^2$$
Conservatism ratio:
$$\text{Ratio} = \frac{\text{Area}(\mathcal{B})}{\text{Area}(\mathcal{G})} = \frac{4.18879}{1.73205} \approx 2.4184$$
The bounding circle encloses $2.42\times$ the area of the actual triangle. In the broad phase, roughly $58.6\%$ of the bounding circle's area represents "empty space" that could generate false positive candidate pairs for nearby objects, but it mathematically guarantees that no real collision is ever missed.

---

### Worked Example 1.4: Broad-Phase Spatial Culling Efficiency
**Problem Statement:** A 2D simulation world of size $100.0\text{ m} \times 100.0\text{ m}$ (total area $A_{\text{world}} = 10,000\text{ m}^2$) contains $N = 500$ circular particles, each with radius $r = 0.50\text{ m}$, uniformly distributed throughout the domain.
1. Calculate the total number of pairwise checks required by naive all-pairs testing.
2. Calculate the cross-sectional interaction area $\pi (2r)^2$ within which two particles can collide.
3. If an ideal broad-phase spatial partitioner indexes the world such that particles are only tested against neighbors within their immediate neighborhood, estimate the expected number of candidate pairs $P_{\text{broad}}$ generated per frame.
4. Compute the broad-phase culling efficiency ratio $\eta = 1 - \frac{P_{\text{broad}}}{P_{\text{naive}}}$.

**Step-by-Step Mathematical Solution:**

**Step 1: Naive all-pairs checks.**
$$P_{\text{naive}} = \frac{N(N - 1)}{2} = \frac{500 \times 499}{2} = 250 \times 499 = 124,750\text{ pairs}$$

**Step 2: Interaction area.**
Two particles of radius $r$ collide if their center distance $d \le 2r = 1.0\text{ m}$.
The circular collision neighborhood around any given particle has area:
$$A_{\text{col}} = \pi (2r)^2 = \pi (1.0)^2 = \pi \approx 3.14159\text{ m}^2$$

**Step 3: Expected candidate pairs under ideal spatial broad-phase.**
Particle spatial number density:
$$\rho_{\text{spatial}} = \frac{N}{A_{\text{world}}} = \frac{500}{10000\text{ m}^2} = 0.05\text{ particles/m}^2$$
The expected number of neighbor particles inside the collision circle of any single particle is:
$$\lambda = \rho_{\text{spatial}} \times A_{\text{col}} = 0.05 \times 3.14159 \approx 0.15708\text{ neighbors}$$
Summing over all $N = 500$ particles and dividing by 2 (to count each pair once):
$$P_{\text{broad}} \approx \frac{1}{2} N \lambda = \frac{1}{2} (500) (0.15708) \approx 39.27 \approx 40\text{ candidate pairs}$$

**Step 4: Culling efficiency.**
$$\eta = 1 - \frac{P_{\text{broad}}}{P_{\text{naive}}} = 1 - \frac{40}{124750} = 1 - 0.0003206 = 0.999679 \implies \mathbf{99.968\%}$$
Broad-phase culling prunes $99.968\%$ of all potential pairs, reducing the narrow-phase computational workload from $124,750$ tests to just $\approx 40$ tests per frame!

---

### Worked Example 1.5: 1D Minkowski Difference and Origin Inclusion
**Problem Statement:** Consider two 1D closed intervals representing the extents of two rigid rods along the $x$-axis:
$$A = [2.0, 7.0]\text{ m}, \quad B = [5.0, 11.0]\text{ m}$$
1. Compute the reflection set $-B$.
2. Formulate the Minkowski Difference $C = A \ominus B = A \oplus (-B)$.
3. Determine whether the origin $0.0$ belongs to $C$, and state whether $A$ and $B$ intersect.
4. From set $C$, determine the minimum translation distance required to separate the intervals.

**Step-by-Step Mathematical Solution:**

**Step 1: Computing $-B$.**
$$-B = \{ -b : b \in [5.0, 11.0] \} = [-11.0, -5.0]\text{ m}$$

**Step 2: Formulating $C = A \oplus (-B)$.**
The sum of two 1D intervals $[a_1, a_2] \oplus [b_1, b_2] = [a_1 + b_1, a_2 + b_2]$:
$$C = [2.0 + (-11.0), \, 7.0 + (-5.0)] = [2.0 - 11.0, \, 7.0 - 5.0] = [-9.0, +2.0]\text{ m}$$

**Step 3: Origin inclusion test.**
$$0.0 \in [-9.0, +2.0] \iff -9.0 \le 0.0 \le +2.0 \quad \text{TRUE!}$$
Because $0.0 \in (A \ominus B)$, by the Origin Inclusion Theorem, **intervals $A$ and $B$ intersect!**
Verifying directly: $A \cap B = [2, 7] \cap [5, 11] = [5, 7] \ne \emptyset$.

**Step 4: Separation translation distance.**
The origin $0.0$ is inside $[-9.0, +2.0]$.
The distance from $0.0$ to the left boundary is $|0 - (-9.0)| = 9.0\text{ m}$.
The distance from $0.0$ to the right boundary is $|0 - 2.0| = 2.0\text{ m}$.
The minimum distance to push $0.0$ outside the interval is $\delta_{\min} = 2.0\text{ m}$.
Thus, shifting interval $A$ by $-2.0\text{ m}$ produces $A' = [0.0, 5.0]$, touching $B = [5.0, 11.0]$ at a single boundary point with zero penetration.

---

### Worked Example 1.6: 2D Minkowski Difference of Two Circles
**Problem Statement:** Two circles in $\mathbb{R}^2$ are defined by:
- Circle 1: Center $\mathbf{c}_1 = [3.0, 4.0]^T\text{ m}$, radius $r_1 = 1.5\text{ m}$
- Circle 2: Center $\mathbf{c}_2 = [6.0, 8.0]^T\text{ m}$, radius $r_2 = 2.0\text{ m}$
1. Prove analytically that the Minkowski difference of two circles $\mathcal{C}_1(\mathbf{c}_1, r_1) \ominus \mathcal{C}_2(\mathbf{c}_2, r_2)$ is a circle centered at $\mathbf{c}_1 - \mathbf{c}_2$ with radius $r_1 + r_2$.
2. Calculate the center $\mathbf{c}_{\text{diff}}$ and radius $r_{\text{diff}}$ of the difference circle.
3. Compute the Euclidean distance from the origin $\mathbf{0}$ to $\mathbf{c}_{\text{diff}}$.
4. Check whether $\mathbf{0}$ lies inside the difference circle, and evaluate collision status.

**Step-by-Step Mathematical Solution:**

**Step 1: Analytical proof for circle Minkowski difference.**
A circle $\mathcal{C}(\mathbf{c}, r)$ is the set of points $\mathbf{c} + \mathbf{u}$ where $\|\mathbf{u}\| \le r$.
$$\mathcal{C}_1 \ominus \mathcal{C}_2 = \{ \mathbf{p}_1 - \mathbf{p}_2 : \mathbf{p}_1 \in \mathcal{C}_1, \mathbf{p}_2 \in \mathcal{C}_2 \}$$
$$\mathbf{p}_1 - \mathbf{p}_2 = (\mathbf{c}_1 + \mathbf{u}_1) - (\mathbf{c}_2 + \mathbf{u}_2) = (\mathbf{c}_1 - \mathbf{c}_2) + (\mathbf{u}_1 - \mathbf{u}_2)$$
where $\|\mathbf{u}_1\| \le r_1$ and $\|\mathbf{u}_2\| \le r_2$.
By the triangle inequality, the maximum possible magnitude of $\mathbf{w} = \mathbf{u}_1 - \mathbf{u}_2$ occurs when $\mathbf{u}_1$ and $\mathbf{u}_2$ point in opposite directions:
$$\|\mathbf{w}\|_{\max} = \|\mathbf{u}_1\| + \|-\mathbf{u}_2\| = r_1 + r_2$$
Because $\mathbf{u}_1$ and $\mathbf{u}_2$ can span any direction in the plane, the set of all vectors $\mathbf{w}$ forms a closed solid disc of radius $r_1 + r_2$ centered at $\mathbf{0}$.
Therefore, $\mathcal{C}_1 \ominus \mathcal{C}_2$ is a solid circle centered at $\mathbf{c}_1 - \mathbf{c}_2$ with radius $r_1 + r_2$. $\blacksquare$

**Step 2: Numerical evaluation of difference circle.**
$$\mathbf{c}_{\text{diff}} = \mathbf{c}_1 - \mathbf{c}_2 = \begin{bmatrix} 3.0 - 6.0 \\ 4.0 - 8.0 \end{bmatrix} = \begin{bmatrix} -3.0 \\ -4.0 \end{bmatrix}\text{ m}$$
$$r_{\text{diff}} = r_1 + r_2 = 1.5 + 2.0 = 3.5\text{ m}$$

**Step 3: Distance from origin to center of difference circle.**
$$d = \|\mathbf{c}_{\text{diff}} - \mathbf{0}\| = \sqrt{(-3.0)^2 + (-4.0)^2} = \sqrt{9.0 + 16.0} = \sqrt{25.0} = 5.0\text{ m}$$

**Step 4: Collision status evaluation.**
The condition $\mathbf{0} \in (\mathcal{C}_1 \ominus \mathcal{C}_2)$ requires:
$$\|\mathbf{c}_{\text{diff}} - \mathbf{0}\| \le r_{\text{diff}} \iff 5.0\text{ m} \le 3.5\text{ m} \quad \text{FALSE!}$$
Because the origin is strictly outside the difference circle, **the two circles DO NOT collide.**
The minimum separation distance between the two circles is:
$$\text{dist}(\mathcal{C}_1, \mathcal{C}_2) = d - r_{\text{diff}} = 5.0 - 3.5 = 1.5\text{ meters}$$

---

### Worked Example 1.7: Continuous Collision Detection Swept Capsule Geometry
**Problem Statement:** A spherical particle of radius $r = 0.25\text{ m}$ starts at position $\mathbf{p}_0 = [1.0, 2.0]^T\text{ m}$ at $t = 0$ and moves with constant velocity $\mathbf{v} = [12.0, 5.0]^T\text{ m/s}$ across a timestep $\Delta t = 0.10\text{ s}$.
1. Compute the ending position $\mathbf{p}_1$ at $t = 0.10\text{ s}$.
2. Calculate the displacement vector $\Delta \mathbf{p}$ and travel length $L$.
3. Describe the swept geometry mathematically and specify its bounding capsule representation.
4. Calculate the Axis-Aligned Bounding Box (AABB) of this continuous swept capsule.

**Step-by-Step Mathematical Solution:**

**Step 1: Ending position $\mathbf{p}_1$.**
$$\mathbf{p}_1 = \mathbf{p}_0 + \mathbf{v} \Delta t = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} + \begin{bmatrix} 12.0 \\ 5.0 \end{bmatrix}(0.10) = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} + \begin{bmatrix} 1.20 \\ 0.50 \end{bmatrix} = \begin{bmatrix} 2.20 \\ 2.50 \end{bmatrix}\text{ m}$$

**Step 2: Displacement vector and length.**
$$\Delta \mathbf{p} = \mathbf{p}_1 - \mathbf{p}_0 = \begin{bmatrix} 1.20 \\ 0.50 \end{bmatrix}\text{ m}$$
$$L = \|\Delta \mathbf{p}\| = \sqrt{1.20^2 + 0.50^2} = \sqrt{1.44 + 0.25} = \sqrt{1.69} = 1.30\text{ meters}$$

**Step 3: Swept capsule representation.**
The continuous path of the sphere's center is the line segment $\mathcal{S} = \{ (1 - \lambda)\mathbf{p}_0 + \lambda \mathbf{p}_1 : \lambda \in [0, 1] \}$.
The swept volume $\mathcal{V}_{\text{swept}}$ is the Minkowski sum of line segment $\mathcal{S}$ and a disc of radius $r$:
$$\mathcal{V}_{\text{swept}} = \mathcal{S} \oplus \mathcal{C}(\mathbf{0}, r)$$
This geometry forms a **2D capsule (stadium shape)** consisting of a central rectangle of dimensions $1.30\text{ m} \times 0.50\text{ m}$ capped by two semicircular lobes of radius $0.25\text{ m}$ at $\mathbf{p}_0$ and $\mathbf{p}_1$.

**Step 4: Swept AABB calculation.**
The AABB must conservatively contain the sphere along its entire continuous trajectory:
$$x_{\min} = \min(p_{0, x}, p_{1, x}) - r = \min(1.0, 2.20) - 0.25 = 1.0 - 0.25 = 0.75\text{ m}$$
$$x_{\max} = \max(p_{0, x}, p_{1, x}) + r = \max(1.0, 2.20) + 0.25 = 2.20 + 0.25 = 2.45\text{ m}$$
$$y_{\min} = \min(p_{0, y}, p_{1, y}) - r = \min(2.0, 2.50) - 0.25 = 2.0 - 0.25 = 1.75\text{ m}$$
$$y_{\max} = \max(p_{0, y}, p_{1, y}) + r = \max(2.0, 2.50) + 0.25 = 2.50 + 0.25 = 2.75\text{ m}$$
The swept AABB is $\mathbf{min} = [0.75, 1.75]^T\text{ m}$, $\mathbf{max} = [2.45, 2.75]^T\text{ m}$. Any obstacle whose AABB does not overlap this box can be safely culled from continuous collision testing.

---

### Worked Example 1.8: Floating-Point Roundoff Hazards in Collision Predicates
**Problem Statement:** Two circles of identical radius $r = 1.0\text{ m}$ rest on a flat surface. In exact arithmetic, their centers are placed at $\mathbf{c}_1 = [0.0, 0.0]^T$ and $\mathbf{c}_2 = [2.0, 0.0]^T$, so they touch at a single point with zero penetration ($d = 2r = 2.0$).
A graphics transform evaluates the $x$-coordinate of $\mathbf{c}_2$ via multiple additions and subtractions, resulting in IEEE 754 double-precision value:
$$c_{2, x} = 2.0 - 2.220446049250313 \times 10^{-16}$$
1. Compute the computed center distance $d_{\text{comp}} = c_{2, x}$.
2. Evaluate the naive collision overlap predicate $d_{\text{comp}} \le r_1 + r_2$.
3. Compute the resulting penetration depth $\delta = (r_1 + r_2) - d_{\text{comp}}$.
4. If a penalty force algorithm computes contact thrust $F = k \delta$ with $k = 10^7\text{ N/m}$, compute the resulting unphysical ghost force and explain how numerical tolerances ($\epsilon_{\text{slop}}$) resolve this issue.

**Step-by-Step Mathematical Solution:**

**Step 1: Computed distance.**
$$d_{\text{comp}} = 2.0 - 2.220446 \times 10^{-16}\text{ m}$$

**Step 2: Naive collision predicate.**
$$r_1 + r_2 = 1.0 + 1.0 = 2.0\text{ m}$$
$$d_{\text{comp}} \le 2.0 \implies (2.0 - 2.22 \times 10^{-16}) \le 2.0 \quad \text{TRUE!}$$
The naive boolean predicate incorrectly reports that the bodies are in active collision.

**Step 3: Penetration depth.**
$$\delta = 2.0 - (2.0 - 2.220446 \times 10^{-16}) = +2.220446 \times 10^{-16}\text{ m}$$

**Step 4: Contact force and slop resolution.**
If a stiff penalty spring computes repulsive force:
$$F = k \delta = (10^7\text{ N/m})(2.220446 \times 10^{-16}\text{ m}) \approx 2.22 \times 10^{-9}\text{ N}$$
While $2.22\times 10^{-9}\text{ N}$ is small, in iterative impulse solvers with small particle masses, computing the contact normal $\mathbf{n} = (\mathbf{c}_2 - \mathbf{c}_1)/d$ triggers normalization arithmetic: if coordinates undergo catastrophic cancellation, dividing by near-zero distances can produce `NaN` or unphysical velocity spikes ("jitter").

**Resolution:** Production collision engines introduce an **allowed penetration tolerance (slop)**:
$$\delta_{\text{effective}} = \max(0.0, \, \delta - \epsilon_{\text{slop}})$$
Setting $\epsilon_{\text{slop}} = 1.0\times 10^{-4}\text{ m}$ ($0.1\text{ mm}$) guarantees that sub-micron floating-point roundoff noise is ignored, stabilizing resting contact completely.

---

### Worked Example 1.9: Time Budget Allocation Across Engine Systems
**Problem Statement:** An autonomous mobile robotics simulation runs at $100\text{ Hz}$ ($\Delta t = 10.0\text{ ms}$). The lead architect allocates the available frame time across the five core subsystems as follows:
- Subsystem 1: Sensor & Perception Pipeline: $25\%$
- Subsystem 2: Numerical State Integration: $15\%$
- Subsystem 3: Broad-Phase Spatial Culling: $15\%$
- Subsystem 4: Narrow-Phase SAT & Manifolds: $25\%$
- Subsystem 5: Impulse & Constraint Resolution: $20\%$
1. Compute the allocated time budget in milliseconds for each subsystem.
2. If broad-phase spatial hashing takes $1.20\text{ ms}$, how many milliseconds of headroom remain in the broad-phase budget?
3. If each narrow-phase SAT collision test takes $4.0\ \mu\text{s}$, what is the hard ceiling on the number of candidate pairs that can be processed without exceeding the narrow-phase budget?

**Step-by-Step Mathematical Solution:**

**Step 1: Subsystem time allocations.**
Total frame duration: $\Delta t = 10.0\text{ ms}$.
- Sensor & Perception ($25\%$): $T_{\text{sensor}} = 0.25 \times 10.0 = 2.50\text{ ms}$
- State Integration ($15\%$): $T_{\text{integ}} = 0.15 \times 10.0 = 1.50\text{ ms}$
- Broad-Phase Culling ($15\%$): $T_{\text{broad}} = 0.15 \times 10.0 = 1.50\text{ ms}$
- Narrow-Phase SAT ($25\%$): $T_{\text{narrow}} = 0.25 \times 10.0 = 2.50\text{ ms}$
- Impulse Resolution ($20\%$): $T_{\text{impulse}} = 0.20 \times 10.0 = 2.00\text{ ms}$

**Step 2: Broad-phase headroom.**
Measured broad-phase execution time: $t_{\text{broad, actual}} = 1.20\text{ ms}$.
$$\text{Headroom} = T_{\text{broad}} - t_{\text{broad, actual}} = 1.50\text{ ms} - 1.20\text{ ms} = 0.30\text{ ms} \quad (20\%\text{ safety margin})$$

**Step 3: Narrow-phase candidate pair ceiling.**
Narrow-phase budget: $T_{\text{narrow}} = 2.50\text{ ms} = 2500\ \mu\text{s}$.
Each SAT test requires $4.0\ \mu\text{s}$.
$$\text{Max Pairs} = \frac{2500\ \mu\text{s}}{4.0\ \mu\text{s/pair}} = 625\text{ pairs}$$
The broad-phase spatial structure must cull the world down to no more than 625 potential collision pairs, or the engine will exceed its frame deadline.

---

### Worked Example 1.10: Complete Multi-Stage Collision Pipeline Trace
**Problem Statement:** Trace two moving circular bodies through the entire 3-stage collision detection pipeline:
- Body 1: $m_1 = 2.0\text{ kg}$, radius $r_1 = 0.80\text{ m}$, current center $\mathbf{c}_1 = [2.0, 3.0]^T\text{ m}$.
- Body 2: $m_2 = 3.0\text{ kg}$, radius $r_2 = 0.60\text{ m}$, current center $\mathbf{c}_2 = [3.0, 3.0]^T\text{ m}$.
1. **Stage 1 (Broad-Phase):** Construct the Axis-Aligned Bounding Box (AABB) for both bodies and evaluate the AABB-AABB overlap condition.
2. **Stage 2 (Narrow-Phase):** Calculate the exact Euclidean center distance $d$, verify geometric collision, and compute the penetration depth $\delta$.
3. **Stage 3 (Manifold Generation):** Determine the unit contact normal $\mathbf{n}$ (pointing from Body 1 to Body 2) and the world-space contact point $\mathbf{p}_{\text{contact}}$ on the boundary.

**Step-by-Step Mathematical Solution:**

**Step 1: Stage 1 (Broad-Phase AABB Test).**
- For Body 1:
  $$\mathbf{min}_1 = [c_{1, x} - r_1, c_{1, y} - r_1]^T = [2.0 - 0.8, 3.0 - 0.8]^T = [1.20, 2.20]^T\text{ m}$$
  $$\mathbf{max}_1 = [c_{1, x} + r_1, c_{1, y} + r_1]^T = [2.0 + 0.8, 3.0 + 0.8]^T = [2.80, 3.80]^T\text{ m}$$
- For Body 2:
  $$\mathbf{min}_2 = [c_{2, x} - r_2, c_{2, y} - r_2]^T = [3.0 - 0.6, 3.0 - 0.6]^T = [2.40, 2.40]^T\text{ m}$$
  $$\mathbf{max}_2 = [c_{2, x} + r_2, c_{2, y} + r_2]^T = [3.0 + 0.6, 3.0 + 0.6]^T = [3.60, 3.60]^T\text{ m}$$

AABB overlap predicate requires overlap in both $x$ and $y$:
$$x\text{-overlap}: \quad \min_{1, x} \le \max_{2, x} \land \max_{1, x} \ge \min_{2, x} \iff 1.20 \le 3.60 \land 2.80 \ge 2.40 \quad (\text{TRUE})$$
$$y\text{-overlap}: \quad \min_{1, y} \le \max_{2, y} \land \max_{1, y} \ge \min_{2, y} \iff 2.20 \le 3.60 \land 3.80 \ge 2.40 \quad (\text{TRUE})$$
**Broad-Phase Result:** AABBs overlap! Candidate pair `(Body 1, Body 2)` is forwarded to Stage 2.

**Step 2: Stage 2 (Narrow-Phase Circle Test).**
Center difference vector:
$$\mathbf{d}_{12} = \mathbf{c}_2 - \mathbf{c}_1 = \begin{bmatrix} 3.0 - 2.0 \\ 3.0 - 3.0 \end{bmatrix} = \begin{bmatrix} 1.00 \\ 0.00 \end{bmatrix}\text{ m}$$
Euclidean distance:
$$d = \|\mathbf{d}_{12}\| = \sqrt{1.00^2 + 0.00^2} = 1.000\text{ m}$$
Sum of radii:
$$R_{\text{sum}} = r_1 + r_2 = 0.80 + 0.60 = 1.400\text{ m}$$
Narrow-phase condition:
$$d < R_{\text{sum}} \iff 1.000\text{ m} < 1.400\text{ m} \quad (\text{COLLISION CONFIRMED!})$$
Penetration depth:
$$\delta = R_{\text{sum}} - d = 1.400 - 1.000 = 0.400\text{ meters}$$

**Step 3: Stage 3 (Contact Manifold Generation).**
Unit contact normal directed from Body 1 to Body 2:
$$\mathbf{n} = \frac{\mathbf{d}_{12}}{d} = \frac{[1.00, 0.00]^T}{1.000} = \begin{bmatrix} 1.00 \\ 0.00 \end{bmatrix}$$
Contact point $\mathbf{p}_{\text{contact}}$: We locate the midpoint of the overlapping region along the normal line:
$$\mathbf{p}_{\text{contact}} = \mathbf{c}_1 + \left(r_1 - \frac{\delta}{2}\right) \mathbf{n} = \begin{bmatrix} 2.0 \\ 3.0 \end{bmatrix} + \left(0.80 - \frac{0.40}{2}\right) \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}$$
$$\mathbf{p}_{\text{contact}} = \begin{bmatrix} 2.0 \\ 3.0 \end{bmatrix} + 0.60 \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 2.60 \\ 3.00 \end{bmatrix}\text{ m}$$
The contact manifold is fully generated: Normal $\mathbf{n} = [1.0, 0.0]^T$, Penetration $\delta = 0.40\text{ m}$, Point $\mathbf{p} = [2.60, 3.00]^T\text{ m}$. It is immediately ready for impulse constraint solving.

---

## 1.6 Chapter Mastery Exercises

### Exercise 1.1 (Tier 1): Pairwise Count for Particle Clusters
Compute the exact number of unique pairwise checks $P(N)$ for:
1. $N = 32$ bodies
2. $N = 256$ bodies
3. $N = 1024$ bodies

### Exercise 1.2 (Tier 1): Bounding Radius of a Rectangle
A rigid rectangular crate has width $w = 4.0\text{ m}$ and height $h = 3.0\text{ m}$ centered at the origin. Calculate the radius $R$ of its tightest conservative bounding circle.

### Exercise 1.3 (Tier 2): Fast Rejection Ratio
In a simulation of $N = 800$ entities, broad-phase spatial hashing generates $120$ candidate overlap pairs. Compute the fraction of total pairs successfully pruned by the broad phase.

### Exercise 1.4 (Tier 2): Tunneling Velocity for Thin Membranes
A high-velocity debris particle of radius $r = 0.01\text{ m}$ travels toward a micrometeoroid shield of thickness $w = 0.002\text{ m}$ ($2\text{ mm}$). If the simulation runs at $120\text{ Hz}$ ($\Delta t = 1/120\text{ s}$), what is the minimum velocity $v_{\text{tunnel}}$ that guarantees discrete tunneling?

### Exercise 1.5 (Tier 3): 1D Minkowski Sum of Two Line Segments
Let $A = [-3.0, 1.0]$ and $B = [2.0, 5.0]$.
1. Calculate the Minkowski sum $A \oplus B$.
2. Calculate the Minkowski difference $A \ominus B$.
3. Check whether $0 \in (A \ominus B)$.

### Exercise 1.6 (Tier 3): Conservative Bounding Sphere for a Cloud of 2D Points
Given four vertices of a convex quadrilateral $\mathbf{v}_1 = [1, 2]^T, \mathbf{v}_2 = [5, 2]^T, \mathbf{v}_3 = [4, 6]^T, \mathbf{v}_4 = [2, 5]^T$:
1. Compute the centroid $\mathbf{c} = \frac{1}{4} \sum \mathbf{v}_i$.
2. Compute the distance from $\mathbf{c}$ to each vertex.
3. Determine the minimum bounding radius $R$ centered at $\mathbf{c}$ that encloses all four vertices.

### Exercise 1.7 (Tier 4): Origin Inclusion Boundary Condition
Suppose two convex sets $\mathcal{A}$ and $\mathcal{B}$ touch at exactly one boundary point with zero interpenetration ($\text{dist}(\mathcal{A}, \mathcal{B}) = 0$). Prove where the origin $\mathbf{0}$ lies relative to the Minkowski difference set $\mathcal{A} \ominus \mathcal{B}$.

### Exercise 1.8 (Tier 4): Swept Circle Capsule Area
A circle of radius $r = 0.50\text{ m}$ sweeps along a line segment of length $L = 4.0\text{ m}$.
1. Formulate the total surface area of the resulting swept capsule in 2D.
2. Compare this to the area of the static circle and the area of the circumscribed AABB.

### Exercise 1.9 (Tier 5): Cache Locality & Memory Bandwidth in Pairwise Checks
Suppose each rigid body state is stored as a 64-byte struct. A naive all-pairs loop accesses body pairs randomly in memory.
1. For $N = 10,000$ bodies, calculate the memory size of the entity array.
2. If naive checking performs $P \approx 5.0\times 10^7$ pair evaluations, and each evaluation incurs a cache miss requiring a $64\text{ ns}$ DRAM read, calculate the total memory latency time.
3. Explain why spatial coherence and linear cache tiling are essential in broad-phase design.

### Exercise 1.10 (Tier 5): The Contact Manifold Invariance
Prove that translating both bodies by an arbitrary constant displacement vector $\mathbf{T} \in \mathbb{R}^2$ leaves the penetration depth $\delta$ and unit contact normal $\mathbf{n}$ strictly unchanged.

---

## 1.7 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 1.1
Using the formula $P(N) = \frac{N(N - 1)}{2}$:
1. For $N = 32$:
   $$P(32) = \frac{32 \times 31}{2} = 16 \times 31 = 496\text{ pairs}$$
2. For $N = 256$:
   $$P(256) = \frac{256 \times 255}{2} = 128 \times 255 = 32,640\text{ pairs}$$
3. For $N = 1024$:
   $$P(1024) = \frac{1024 \times 1023}{2} = 512 \times 1023 = 523,776\text{ pairs}$$

---

### Solution to Exercise 1.2
The farthest points on a rectangle from its center are its four corners.
The distance from the center $[0, 0]$ to any corner $[\pm w/2, \pm h/2]$ is:
$$R = \sqrt{\left(\frac{w}{2}\right)^2 + \left(\frac{h}{2}\right)^2} = \frac{1}{2} \sqrt{w^2 + h^2}$$
Substituting $w = 4.0\text{ m}$ and $h = 3.0\text{ m}$:
$$R = \frac{1}{2} \sqrt{4.0^2 + 3.0^2} = \frac{1}{2} \sqrt{16.0 + 9.0} = \frac{1}{2} \sqrt{25.0} = \frac{1}{2}(5.0) = 2.50\text{ meters}$$
The tightest conservative bounding circle has radius $R = 2.50\text{ m}$.

---

### Solution to Exercise 1.3
Total naive pairs for $N = 800$:
$$P_{\text{naive}} = \frac{800 \times 799}{2} = 400 \times 799 = 319,600\text{ pairs}$$
The broad phase generates $120$ candidate pairs.
Pruned pairs:
$$P_{\text{pruned}} = 319,600 - 120 = 319,480\text{ pairs}$$
Pruning fraction:
$$\text{Fraction} = \frac{319,480}{319,600} \approx 0.9996245 \implies \mathbf{99.962\%}$$

---

### Solution to Exercise 1.4
From Section 1.3.2:
$$v_{\text{tunnel}} = \frac{w + 2r}{\Delta t}$$
Given $w = 0.002\text{ m}$, $r = 0.010\text{ m}$, $\Delta t = 1/120\text{ s} \approx 0.008333\text{ s}$:
$$w + 2r = 0.002 + 2(0.010) = 0.002 + 0.020 = 0.022\text{ m}$$
$$v_{\text{tunnel}} = \frac{0.022\text{ m}}{1/120\text{ s}} = 0.022 \times 120 = 2.64\text{ m/s}$$
At any speed above $2.64\text{ m/s}$ ($\approx 9.5\text{ km/h}$), the debris particle can tunnel cleanly through the shield in a single frame.

---

### Solution to Exercise 1.5
Given $A = [-3.0, 1.0]$ and $B = [2.0, 5.0]$:
1. **Minkowski sum $A \oplus B$:**
   $$A \oplus B = [-3.0 + 2.0, \, 1.0 + 5.0] = [-1.0, \, 6.0]$$
2. **Minkowski difference $A \ominus B = A \oplus (-B)$:**
   $$-B = [-5.0, -2.0]$$
   $$A \ominus B = [-3.0 + (-5.0), \, 1.0 + (-2.0)] = [-8.0, \, -1.0]$$
3. **Origin inclusion:**
   $$0 \in [-8.0, -1.0] \iff -8.0 \le 0 \le -1.0 \quad \text{FALSE!}$$
   Because $0 \notin (A \ominus B)$, sets $A$ and $B$ do not intersect. The minimum separation distance is $|-1.0 - 0| = 1.0\text{ m}$.

---

### Solution to Exercise 1.6
Vertices: $\mathbf{v}_1 = [1, 2]^T, \mathbf{v}_2 = [5, 2]^T, \mathbf{v}_3 = [4, 6]^T, \mathbf{v}_4 = [2, 5]^T$.
1. **Centroid $\mathbf{c}$:**
   $$\mathbf{c} = \frac{1}{4} \begin{bmatrix} 1 + 5 + 4 + 2 \\ 2 + 2 + 6 + 5 \end{bmatrix} = \frac{1}{4} \begin{bmatrix} 12 \\ 15 \end{bmatrix} = \begin{bmatrix} 3.0 \\ 3.75 \end{bmatrix}$$
2. **Distances to vertices:**
   - $d_1 = \sqrt{(1 - 3)^2 + (2 - 3.75)^2} = \sqrt{(-2)^2 + (-1.75)^2} = \sqrt{4 + 3.0625} = \sqrt{7.0625} \approx 2.6575\text{ m}$
   - $d_2 = \sqrt{(5 - 3)^2 + (2 - 3.75)^2} = \sqrt{2^2 + (-1.75)^2} = \sqrt{4 + 3.0625} = \sqrt{7.0625} \approx 2.6575\text{ m}$
   - $d_3 = \sqrt{(4 - 3)^2 + (6 - 3.75)^2} = \sqrt{1^2 + 2.25^2} = \sqrt{1 + 5.0625} = \sqrt{6.0625} \approx 2.4622\text{ m}$
   - $d_4 = \sqrt{(2 - 3)^2 + (5 - 3.75)^2} = \sqrt{(-1)^2 + 1.25^2} = \sqrt{1 + 1.5625} = \sqrt{2.5625} \approx 1.6008\text{ m}$
3. **Minimum bounding radius:**
   $$R = \max(d_1, d_2, d_3, d_4) = \sqrt{7.0625} \approx 2.658\text{ meters}$$

---

### Solution to Exercise 1.7
Let $\partial \mathcal{S}$ denote the boundary of set $\mathcal{S}$.
If $\mathcal{A}$ and $\mathcal{B}$ touch at exactly one boundary point $\mathbf{p}^*$ without interior interpenetration:
$$\mathcal{A} \cap \mathcal{B} = \{ \mathbf{p}^* \} \quad \text{where } \mathbf{p}^* \in \partial \mathcal{A} \text{ and } \mathbf{p}^* \in \partial \mathcal{B}$$
By the Origin Inclusion Theorem:
$$\mathbf{p}^* - \mathbf{p}^* = \mathbf{0} \in (\mathcal{A} \ominus \mathcal{B})$$
Furthermore, because $\text{int}(\mathcal{A}) \cap \text{int}(\mathcal{B}) = \emptyset$, there exist no interior points whose difference is zero.
Therefore, the origin $\mathbf{0}$ lies **strictly on the outer topological boundary** of the Minkowski difference set:
$$\mathbf{0} \in \partial(\mathcal{A} \ominus \mathcal{B})$$
This proves that the distance from the origin to $\mathcal{A} \ominus \mathcal{B}$ is identically zero ($\text{dist}(\mathbf{0}, \mathcal{A} \ominus \mathcal{B}) = 0$). $\blacksquare$

---

### Solution to Exercise 1.8
A 2D swept capsule consists of a central rectangle of dimensions $L \times 2r$ plus two semicircles of radius $r$ (which together form a complete circle of radius $r$).
1. **Capsule area:**
   $$\text{Area}_{\text{capsule}} = (L \times 2r) + \pi r^2 = (4.0 \times 2(0.50)) + \pi (0.50)^2 = (4.0 \times 1.0) + 0.25\pi = 4.0 + 0.7854 = 4.7854\text{ m}^2$$
2. **Comparison:**
   - Static circle area: $\pi r^2 = 0.7854\text{ m}^2$. (Capsule is $6.1\times$ larger).
   - If oriented along an axis, the circumscribed AABB has width $L + 2r = 4.0 + 1.0 = 5.0\text{ m}$ and height $2r = 1.0\text{ m}$.
     $$\text{Area}_{\text{AABB}} = 5.0 \times 1.0 = 5.000\text{ m}^2$$
     The AABB overestimates the swept capsule area by only $\frac{5.0 - 4.7854}{4.7854} \approx 4.48\%$.

---

### Solution to Exercise 1.9
1. **Array memory size:**
   $$M = 10,000\text{ bodies} \times 64\text{ bytes/body} = 640,000\text{ bytes} = 625\text{ KB}$$
2. **Cache miss latency:**
   With $P = 5.0\times 10^7$ checks and $64\text{ ns}$ per miss:
   $$t_{\text{memory}} = (5.0 \times 10^7) \times (64 \times 10^{-9}\text{ s}) = 3.20\text{ seconds!}$$
3. **Why spatial coherence is required:**
   Even though the entire 625 KB array easily fits within a modern L3 CPU cache, random pointer chasing and un-indexed memory access across millions of pairs causes the CPU pipeline to stall waiting on memory lines. By organizing entities into contiguous spatial cells (spatial hash grids or Morton-coded Z-order curves), all bodies within the same geographic neighborhood are stored contiguously in memory, ensuring $100\%$ L1/L2 cache hit rates and enabling SIMD vectorized collision tests.

---

### Solution to Exercise 1.10
Let the original bodies be $\mathcal{A}$ and $\mathcal{B}$.
Translate both bodies by constant vector $\mathbf{T}$:
$$\mathcal{A}' = \{ \mathbf{a} + \mathbf{T} : \mathbf{a} \in \mathcal{A} \}, \quad \mathcal{B}' = \{ \mathbf{b} + \mathbf{T} : \mathbf{b} \in \mathcal{B} \}$$
Formulate the Minkowski difference of the translated bodies:
$$\mathcal{A}' \ominus \mathcal{B}' = \{ (\mathbf{a} + \mathbf{T}) - (\mathbf{b} + \mathbf{T}) : \mathbf{a} \in \mathcal{A}, \mathbf{b} \in \mathcal{B} \}$$
$$= \{ \mathbf{a} + \mathbf{T} - \mathbf{b} - \mathbf{T} \} = \{ \mathbf{a} - \mathbf{b} \} = \mathcal{A} \ominus \mathcal{B}$$
The Minkowski difference set is **strictly identical**: $\mathcal{A}' \ominus \mathcal{B}' \equiv \mathcal{A} \ominus \mathcal{B}$.
Because penetration depth $\delta$ is the minimum distance from $\mathbf{0}$ to $\partial(\mathcal{A} \ominus \mathcal{B})$ and normal $\mathbf{n}$ is the unit gradient of that distance function, both $\delta$ and $\mathbf{n}$ depend solely on the relative configuration $\mathcal{A} \ominus \mathcal{B}$, and are therefore completely invariant under global translation. $\blacksquare$
