# Chapter 2: Axis-Aligned Bounding Boxes and the Kay-Kajiya Slab Method

> *"A ray in space is an infinite needle; a box is a bundle of parallel planes. By intersecting the needle with each slab of space in turn, the needle either threads the needle's eye or pierces the void."*
> — **James Kajiya & Timothy Kay**, *Ray Tracing Complex Scenes* (SIGGRAPH 1986)

---

## 2.1 AABB Geometric Representations: Min/Max vs. Center/Extents

The **Axis-Aligned Bounding Box (AABB)** is the most widely utilized geometric primitive in computational geometry, game physics engines, and photorealistic ray tracers. Its defining characteristic is that its bounding planar faces are constrained to be strictly parallel to the Cartesian coordinate planes ($xy$, $yz$, $zx$).

In high-performance 3D software engineering, an AABB is typically modeled under one of two dual mathematical representations.

```
       AABB Geometric Representations:
       
       (1) Min/Max Representation            (2) Center/Extents Representation
                 max (x_max, y_max, z_max)                  e_y
                  +-------+                                  ^
                 /|      /|                                  |
                +-------+ |                               +--|----+
                | |     | |                       e_x <-- |  * c  |
                | +-----|-+                               +-------+
                |/      |/                                   /
                +-------+                                   / e_z
       min (x_min, y_min, z_min)
```

### 2.1.1 The Min/Max Interval Representation

Under the interval formulation, the AABB is defined as the Cartesian product of three closed 1D spatial intervals:

$$\mathcal{B}_{\text{min/max}} = [\min_x, \max_x] \times [\min_y, \max_y] \times [\min_z, \max_z] \subset \mathbb{R}^3$$

A point $\mathbf{x} = (x, y, z)^T \in \mathbb{R}^3$ lies inside or on the boundary of the AABB if and only if:

$$\min_i \le x_i \le \max_i \quad \forall i \in \{x, y, z\}$$

- **Memory Layout:** Two 3D vectors: $\mathbf{min} = (\min_x, \min_y, \min_z)^T$ and $\mathbf{max} = (\max_x, \max_y, \max_z)^T$.
  Total size $= 6 \times 4\text{ bytes} = 24\text{ bytes}$ (using IEEE 754 single-precision floats).
- **Primary Strength:** Merging two AABBs (bounding volume hierarchy node aggregation) requires only component-wise $\min$ and $\max$ operations:
  $$\mathbf{min}_{\text{union}} = \min(\mathbf{min}_A, \mathbf{min}_B), \quad \mathbf{max}_{\text{union}} = \max(\mathbf{max}_A, \mathbf{max}_B)$$

### 2.1.2 The Center/Half-Extents Representation

Under the affine formulation, the AABB is defined by its center point $\mathbf{c} \in \mathbb{R}^3$ and a non-negative half-extents vector $\mathbf{e} = (e_x, e_y, e_z)^T \in \mathbb{R}^3_{\ge 0}$:

$$\mathcal{B}_{\text{center/extents}} = \{ \mathbf{x} \in \mathbb{R}^3 \mid |x_i - c_i| \le e_i, \quad i \in \{x, y, z\} \}$$

- **Memory Layout:** Two 3D vectors: $\mathbf{c}$ (center) and $\mathbf{e}$ (half-extents). Total size $= 24\text{ bytes}$.
- **Primary Strength:** Optimal for collision physics and penetration resolution. The distance vector between centers $\mathbf{d} = \mathbf{c}_B - \mathbf{c}_A$ allows instantaneous calculation of separating distance and penetration depth:
  $$\text{Penetration}_i = (e_{A, i} + e_{B, i}) - |d_i|$$

### 2.1.3 Bijective Conversion Formulas

The mapping between both representations is exact, linear, and bijective:

$$\mathbf{c} = \frac{\mathbf{min} + \mathbf{max}}{2}, \quad \mathbf{e} = \frac{\mathbf{max} - \mathbf{min}}{2}$$

$$\mathbf{min} = \mathbf{c} - \mathbf{e}, \quad \mathbf{max} = \mathbf{c} + \mathbf{e}$$

---

## 2.2 Instantaneous 3D AABB-AABB Overlap Testing

The intersection test between two AABBs is governed by the **1D Interval Overlap Theorem**.

### 2.2.1 The 1D Interval Overlap Theorem

Let $I_A = [a_{\min}, a_{\max}]$ and $I_B = [b_{\min}, b_{\max}]$ be two closed intervals on the real line $\mathbb{R}$.

$$\boxed{I_A \cap I_B \neq \emptyset \iff (a_{\min} \le b_{\max}) \land (a_{\max} \ge b_{\min})}$$

```
Case 1: Overlapping Intervals
   I_A:     [==========]              a_min <= b_max (TRUE)
   I_B:          [==========]         a_max >= b_min (TRUE)  --> OVERLAP!

Case 2: Disjoint Intervals (Separated)
   I_A:     [=====]                   a_min <= b_max (TRUE)
   I_B:               [=====]         a_max >= b_min (FALSE) --> SEPARATED!
```

### 2.2.2 3D Cartesian Product Intersection

Because an AABB is the Cartesian product of three independent 1D intervals along the orthogonal coordinate axes $x, y, z$, two AABBs intersect in $\mathbb{R}^3$ **if and only if their projection intervals overlap on all three axes simultaneously**:

$$\boxed{\mathcal{B}_A \cap \mathcal{B}_B \neq \emptyset \iff \bigwedge_{i \in \{x, y, z\}} \left( A_{\min, i} \le B_{\max, i} \land A_{\max, i} \ge B_{\min, i} \right)}$$

### 2.2.3 Computational Efficiency and Branchless Execution

Testing whether two AABBs overlap requires at most **6 scalar comparisons**:
```typescript
function aabbIntersectsAABB(aMin: Vector3, aMax: Vector3, bMin: Vector3, bMax: Vector3): boolean {
  if (aMin.x > bMax.x || aMax.x < bMin.x) return false;
  if (aMin.y > bMax.y || aMax.y < bMin.y) return false;
  if (aMin.z > bMax.z || aMax.z < bMin.z) return false;
  return true;
}
```

In tight simulation loops, CPU branch predictors can suffer pipeline stalls if boxes randomly overlap and separate. Modern compilers can vectorize this check branchlessly using SIMD register comparisons:
```typescript
// Branchless boolean formulation:
const overlap = (aMin.x <= bMax.x) & (aMax.x >= bMin.x) &
                (aMin.y <= bMax.y) & (aMax.y >= bMin.y) &
                (aMin.z <= bMax.z) & (aMax.z >= bMin.z);
```

---

## 2.3 Ray-AABB Intersection: The Kay-Kajiya Slab Method

A semi-infinite geometric ray is parameterized by an origin $\mathbf{O} \in \mathbb{R}^3$, a normalized direction vector $\mathbf{D} \in \mathbb{R}^3$ ($\|\mathbf{D}\| = 1$), and a scalar parameter $t \ge 0$:

$$\mathbf{P}(t) = \mathbf{O} + t \mathbf{D}, \quad t \in [0, +\infty)$$

In 1986, computer scientists Timothy Kay and James Kajiya introduced the **Slab Method**, an optimal formulation that treats an AABB as the intersection of three infinite orthogonal spatial "slabs".

```
                          THE SLAB METHOD (2D VIEW)
       
             Y-planes: y = y_max ------------------------------------
                                 |          AABB            |
                                 |    +---------------+     |   Slab Y
                                 |    |               |     |
             Y-planes: y = y_min ------------------------------------
                                      |               |
             Ray                     x = x_min       x = x_max
              * O                     <--- Slab X --->
               \
                \  t_enter = max(t_min_x, t_min_y)
                 \
                  \-----> [ Enters Box ]
                   \
                    \---> [ Exits Box ]
                     \    t_exit = min(t_max_x, t_max_y)
                      v
```

### 2.3.1 Definition of a Coordinate Slab

A **slab** along axis $i \in \{x, y, z\}$ is the region of infinite 3D space bounded between two parallel planes perpendicular to axis $i$:

$$\text{Slab}_i = \{ \mathbf{x} \in \mathbb{R}^3 \mid \min_i \le x_i \le \max_i \}$$

An AABB is the geometric intersection of the three coordinate slabs:

$$\mathcal{B} = \text{Slab}_x \cap \text{Slab}_y \cap \text{Slab}_z$$

### 2.3.2 1D Ray-Plane Intersections

Substitute the ray equation $P_i(t) = O_i + t D_i$ into the two slab plane equations $x_i = \min_i$ and $x_i = \max_i$:

$$O_i + t_{1, i} D_i = \min_i \implies t_{1, i} = \frac{\min_i - O_i}{D_i}$$

$$O_i + t_{2, i} D_i = \max_i \implies t_{2, i} = \frac{\max_i - O_i}{D_i}$$

If the ray direction component $D_i$ is negative ($D_i < 0$), the ray hits the near plane $\max_i$ first and the far plane $\min_i$ second. We therefore sort the parameters to define the entering and exiting ray intervals for slab $i$:

$$t_{\min, i} = \min(t_{1, i}, t_{2, i}), \quad t_{\max, i} = \max(t_{1, i}, t_{2, i})$$

### 2.3.3 Global Interval Intersection

The ray passes through the entire 3D box only while it is simultaneously inside **all three slabs**. The intersection of the three parameter intervals $[t_{\min, x}, t_{\max, x}]$, $[t_{\min, y}, t_{\max, y}]$, and $[t_{\min, z}, t_{\max, z}]$ defines the global entering parameter $t_{\text{enter}}$ and exiting parameter $t_{\text{exit}}$:

$$t_{\text{enter}} = \max(t_{\min, x}, \, t_{\min, y}, \, t_{\min, z})$$

$$t_{\text{exit}} = \min(t_{\max, x}, \, t_{\max, y}, \, t_{\max, z})$$

### 2.3.4 The Slab Intersection Criterion

$$\boxed{\text{Ray intersects AABB} \iff (t_{\text{enter}} \le t_{\text{exit}}) \land (t_{\text{exit}} \ge 0)}$$

1. **$t_{\text{enter}} \le t_{\text{exit}}$:** The ray penetrates all three slabs before it leaves any one slab. If $t_{\text{enter}} > t_{\text{exit}}$, the ray misses the box entirely.
2. **$t_{\text{exit}} \ge 0$:** The box lies in front of the ray. If $t_{\text{exit}} < 0$, the box is entirely behind the ray origin.
3. **The Exact Hit Distance:**
   $$t_{\text{hit}} = \begin{cases}
   t_{\text{enter}} & \text{if } t_{\text{enter}} \ge 0 \quad (\text{Ray origin is OUTSIDE the box}) \\
   0 & \text{if } t_{\text{enter}} < 0 \quad (\text{Ray origin is INSIDE the box})
   \end{cases}$$

---

## 2.4 IEEE 754 Floating-Point Robustness and Division by Zero

In real-world implementations, floating-point divisions $\frac{\min_i - O_i}{D_i}$ present potential failure modes when a ray travels strictly parallel to a coordinate plane ($D_i = 0$).

### 2.4.1 The Grace of IEEE 754 Infinity Arithmetic

The **IEEE 754 floating-point specification** guarantees well-defined behavior for division by zero:

$$\frac{+c}{+0.0} = +\infty, \quad \frac{-c}{+0.0} = -\infty, \quad \frac{+c}{-0.0} = -\infty, \quad \frac{-c}{-0.0} = +\infty \quad (\text{for } c > 0)$$

Let a ray be parallel to the x-axis ($D_x = 0$):
- **Case 1: Ray origin $O_x$ is strictly outside the slab ($O_x < \min_x$):**
  $$\min_x - O_x > 0 \implies t_{1, x} = \frac{+c}{+0} = +\infty$$
  $$\max_x - O_x > 0 \implies t_{2, x} = \frac{+c'}{+0} = +\infty$$
  $$t_{\min, x} = +\infty, \quad t_{\max, x} = +\infty$$
  When we compute $t_{\text{enter}} = \max(t_{\min, x}, \dots)$, $t_{\text{enter}}$ becomes $+\infty$.
  Unless the other intervals also equal $+\infty$, $t_{\text{enter}} > t_{\text{exit}}$, and the test **correctly reports NO INTERSECTION** without a single conditional check!
- **Case 2: Ray origin $O_x$ is strictly inside the slab ($\min_x \le O_x \le \max_x$):**
  $$\min_x - O_x \le 0 \implies t_{1, x} = -\infty$$
  $$\max_x - O_x \ge 0 \implies t_{2, x} = +\infty$$
  $$t_{\min, x} = -\infty, \quad t_{\max, x} = +\infty$$
  The interval is $[-\infty, +\infty]$. When we take $\max(t_{\min, x}, \dots)$ and $\min(t_{\max, x}, \dots)$, $-\infty$ and $+\infty$ have no effect on the other axes. The intersection depends entirely on the remaining two axes!

### 2.4.2 Precomputing Inverse Ray Direction

Division is one of the slowest CPU operations, taking $10\text{ to }25$ clock cycles on x86/ARM processors, compared to a single clock cycle for multiplication.

In a BVH tree traversal, a single ray may be tested against hundreds of AABBs. We precompute the **inverse direction vector** once per ray:

$$\mathbf{D}_{\text{inv}} = \left( \frac{1}{D_x}, \, \frac{1}{D_y}, \, \frac{1}{D_z} \right)^T$$

The slab intersection equation then simplifies from division to blazing-fast multiplication:

$$t_{1, i} = (\min_i - O_i) \cdot D_{\text{inv}, i}, \quad t_{2, i} = (\max_i - O_i) \cdot D_{\text{inv}, i}$$

### 2.4.3 The NaN Hazard and Signed Zero Avoidance

A critical hazard occurs if the ray origin lies **exactly on the slab boundary** ($O_x = \min_x$) while traveling parallel to it ($D_x = 0$):

$$\frac{0.0}{0.0} = \text{NaN} \quad (\text{Not a Number})$$

Under IEEE 754 rules, comparisons with `NaN` (`NaN < x` or `NaN > x`) always evaluate to `false`. This can cause `Math.min` or `Math.max` to fail unpredictably.

**Production Solution:** Replace zero components with a tiny non-zero epsilon, or enforce robust min/max ordering:
```typescript
const invD_x = Math.abs(D.x) > 1e-12 ? 1.0 / D.x : (D.x >= 0 ? 1e12 : -1e12);
```

---

## 2.5 SIMD Vectorization of the Slab Method

On modern x86 (SSE/AVX) and ARM (NEON) architectures, the slab test can be computed for all three axes simultaneously in 128-bit vector registers.

```
SIMD Vectorized Ray-AABB Slab Execution:
Register 0: [ O_x,         O_y,         O_z,         0.0 ] (Ray Origin)
Register 1: [ invD_x,      invD_y,      invD_z,      0.0 ] (Inverse Direction)
Register 2: [ min_x,       min_y,       min_z,       0.0 ] (Box Min)
Register 3: [ max_x,       max_y,       max_z,       0.0 ] (Box Max)

Step 1: Subtraction:
  t1 = (Register 2 - Register 0) * Register 1
  t2 = (Register 3 - Register 0) * Register 1

Step 2: Component Min/Max:
  t_min_vec = _mm_min_ps(t1, t2)
  t_max_vec = _mm_max_ps(t1, t2)

Step 3: Horizontal Reduction:
  t_enter = max(t_min_vec.x, max(t_min_vec.y, t_min_vec.z))
  t_exit  = min(t_max_vec.x, min(t_max_vec.y, t_max_vec.z))

Step 4: Comparison:
  hit = (t_enter <= t_exit) && (t_exit >= 0.0)
```
Total instruction count: **12 SIMD instructions**, executing in $\sim 4\text{ nanoseconds}$ per box!

---

## 2.6 Ten Step-by-Step Worked Examples

### Worked Example 2.1: Manual Calculation of the Slab Method
**Problem:** A ray has origin $\mathbf{O} = (-5, 2, 1)^T$ and normalized direction $\mathbf{D} = (0.8, 0.6, 0.0)^T$.
An AABB is defined by $\mathbf{min} = (-1, -1, -2)^T$ and $\mathbf{max} = (3, 5, 2)^T$.
Compute the entering and exiting parameters for each slab, and determine whether the ray intersects the box. If it intersects, find the world-space entry point.

**Solution:**
1. **X-Slab Evaluation:**
   $$D_x = 0.8$$
   $$t_{1, x} = \frac{\min_x - O_x}{D_x} = \frac{-1 - (-5)}{0.8} = \frac{4}{0.8} = 5.0$$
   $$t_{2, x} = \frac{\max_x - O_x}{D_x} = \frac{3 - (-5)}{0.8} = \frac{8}{0.8} = 10.0$$
   $$t_{\min, x} = \min(5.0, 10.0) = 5.0, \quad t_{\max, x} = \max(5.0, 10.0) = 10.0$$
2. **Y-Slab Evaluation:**
   $$D_y = 0.6$$
   $$t_{1, y} = \frac{\min_y - O_y}{D_y} = \frac{-1 - 2}{0.6} = \frac{-3}{0.6} = -5.0$$
   $$t_{2, y} = \frac{\max_y - O_y}{D_y} = \frac{5 - 2}{0.6} = \frac{3}{0.6} = 5.0$$
   $$t_{\min, y} = \min(-5.0, 5.0) = -5.0, \quad t_{\max, y} = \max(-5.0, 5.0) = 5.0$$
3. **Z-Slab Evaluation (Parallel Ray, $D_z = 0$):**
   $O_z = 1.0$. The slab interval is $[\min_z, \max_z] = [-2, 2]$.
   Since $-2 \le 1.0 \le 2$, the ray origin is strictly inside the Z-slab!
   $$t_{\min, z} = -\infty, \quad t_{\max, z} = +\infty$$
4. **Global Overlap Calculation:**
   $$t_{\text{enter}} = \max(t_{\min, x}, t_{\min, y}, t_{\min, z}) = \max(5.0, -5.0, -\infty) = 5.0$$
   $$t_{\text{exit}} = \min(t_{\max, x}, t_{\max, y}, t_{\max, z}) = \min(10.0, 5.0, +\infty) = 5.0$$
5. **Intersection Test:**
   $$t_{\text{enter}} \le t_{\text{exit}} \iff 5.0 \le 5.0 \quad (\text{TRUE! The ray grazes the box!})$$
   $$t_{\text{exit}} = 5.0 \ge 0 \quad (\text{TRUE})$$
   The ray intersects the box at the singular point $t = 5.0$!
6. **Entry Point Coordinates:**
   $$\mathbf{P}(5.0) = \mathbf{O} + 5.0 \mathbf{D} = \begin{pmatrix} -5 \\ 2 \\ 1 \end{pmatrix} + 5.0 \begin{pmatrix} 0.8 \\ 0.6 \\ 0.0 \end{pmatrix} = \begin{pmatrix} -5 + 4 \\ 2 + 3 \\ 1 + 0 \end{pmatrix} = \begin{pmatrix} -1.0 \\ 5.0 \\ 1.0 \end{pmatrix}$$
   Notice that $x = -1.0 = \min_x$ and $y = 5.0 = \max_y$. The ray hits the exact corner edge formed by the intersection of the $-x$ and $+y$ faces!

---

### Worked Example 2.2: Miss Detection via Slab Disjointness
**Problem:** A ray has origin $\mathbf{O} = (0, 0, 0)^T$ and direction $\mathbf{D} = (0.7071, 0.7071, 0.0)^T$.
An AABB is located at $\mathbf{min} = (4, 1, -1)^T$ and $\mathbf{max} = (6, 3, 1)^T$.
Determine whether the ray intersects the AABB using the slab method.

**Solution:**
1. **X-Slab:**
   $$t_{1, x} = \frac{4 - 0}{0.7071} \approx 5.6569, \quad t_{2, x} = \frac{6 - 0}{0.7071} \approx 8.4853$$
   $$[t_{\min, x}, t_{\max, x}] = [5.6569, 8.4853]$$
2. **Y-Slab:**
   $$t_{1, y} = \frac{1 - 0}{0.7071} \approx 1.4142, \quad t_{2, y} = \frac{3 - 0}{0.7071} \approx 4.2426$$
   $$[t_{\min, y}, t_{\max, y}] = [1.4142, 4.2426]$$
3. **Z-Slab:**
   $O_z = 0$, inside $[-1, 1] \implies [-\infty, +\infty]$.
4. **Global Overlap:**
   $$t_{\text{enter}} = \max(5.6569, 1.4142, -\infty) = 5.6569$$
   $$t_{\text{exit}} = \min(8.4853, 4.2426, +\infty) = 4.2426$$
5. **Criterion:**
   $$t_{\text{enter}} \le t_{\text{exit}} \iff 5.6569 \le 4.2426 \quad (\mathbf{FALSE!})$$
   Because $t_{\text{enter}} > t_{\text{exit}}$, the ray exits the Y-slab at $t = 4.24$ before it even enters the X-slab at $t = 5.66$. **The ray misses the box!**

---

### Worked Example 2.3: Ray Originating Inside the Box
**Problem:** A ray origin is located at $\mathbf{O} = (1, 1, 0)^T$ inside the box $\mathbf{min} = (-2, -2, -2)^T$, $\mathbf{max} = (2, 2, 2)^T$.
Direction vector is $\mathbf{D} = (0, 1, 0)^T$ (traveling along $+y$).
Trace the slab method and determine the hit distance.

**Solution:**
1. **X-Slab ($D_x = 0$):**
   $O_x = 1 \in [-2, 2] \implies [t_{\min, x}, t_{\max, x}] = [-\infty, +\infty]$.
2. **Y-Slab ($D_y = 1$):**
   $$t_{1, y} = \frac{-2 - 1}{1} = -3.0, \quad t_{2, y} = \frac{2 - 1}{1} = +1.0$$
   $$[t_{\min, y}, t_{\max, y}] = [-3.0, 1.0]$$
3. **Z-Slab ($D_z = 0$):**
   $O_z = 0 \in [-2, 2] \implies [-\infty, +\infty]$.
4. **Global Parameters:**
   $$t_{\text{enter}} = \max(-\infty, -3.0, -\infty) = -3.0$$
   $$t_{\text{exit}} = \min(+\infty, 1.0, +\infty) = +1.0$$
5. **Evaluation:**
   $t_{\text{enter}} \le t_{\text{exit}}$ ($-3.0 \le 1.0$) is TRUE.
   $t_{\text{exit}} \ge 0$ ($1.0 \ge 0$) is TRUE.
   Because $t_{\text{enter}} = -3.0 < 0$, the ray started inside the box.
   The hit distance is $t_{\text{hit}} = 0$ (or exiting distance $t = 1.0$ at the front wall $\mathbf{P}(1.0) = (1, 2, 0)^T$).

---

### Worked Example 2.4: Inverse Direction Vector Precomputation
**Problem:** Given ray direction $\mathbf{D} = (-0.57735, 0.57735, -0.57735)^T$, calculate the inverse direction vector $\mathbf{D}_{\text{inv}}$.
Show that testing an AABB with $\mathbf{min} = (-4, -4, -4)^T$ and $\mathbf{max} = (-1, -1, -1)^T$ from origin $\mathbf{O} = (2, 2, 2)^T$ using multiplications yields identical results to division.

**Solution:**
1. Inverse direction vector:
   $$D_{\text{inv}, x} = \frac{1}{-0.57735} \approx -1.73205$$
   $$D_{\text{inv}, y} = \frac{1}{0.57735} \approx +1.73205$$
   $$D_{\text{inv}, z} = \frac{1}{-0.57735} \approx -1.73205$$
   $$\mathbf{D}_{\text{inv}} = (-1.73205, 1.73205, -1.73205)^T$$
2. X-Slab using multiplication:
   $$t_{1, x} = (\min_x - O_x) \cdot D_{\text{inv}, x} = (-4 - 2)(-1.73205) = (-6)(-1.73205) = +10.3923$$
   $$t_{2, x} = (\max_x - O_x) \cdot D_{\text{inv}, x} = (-1 - 2)(-1.73205) = (-3)(-1.73205) = +5.1962$$
   $$t_{\min, x} = \min(10.3923, 5.1962) = 5.1962, \quad t_{\max, x} = 10.3923$$
3. X-Slab using direct division:
   $$t_{1, x} = \frac{-6}{-0.57735} = +10.3923, \quad t_{2, x} = \frac{-3}{-0.57735} = +5.1962$$
   Results match to 6 decimal places while saving 20 CPU cycles per slab!

---

### Worked Example 2.5: Ray Directed Away from Box (Box Behind Ray)
**Problem:** A ray has origin $\mathbf{O} = (10, 0, 0)^T$ and direction $\mathbf{D} = (1, 0, 0)^T$ (pointing in $+x$).
An AABB is located at $\mathbf{min} = (2, -1, -1)^T$, $\mathbf{max} = (5, 1, 1)^T$.
Trace the slab method and show how the condition $t_{\text{exit}} \ge 0$ prevents false positive detections of objects behind the camera.

**Solution:**
1. X-Slab:
   $$t_{1, x} = \frac{2 - 10}{1} = -8.0, \quad t_{2, x} = \frac{5 - 10}{1} = -5.0$$
   $$[t_{\min, x}, t_{\max, x}] = [-8.0, -5.0]$$
2. Y-Slab ($D_y = 0$, $O_y = 0 \in [-1, 1]$):
   $$[-\infty, +\infty]$$
3. Z-Slab ($D_z = 0$, $O_z = 0 \in [-1, 1]$):
   $$[-\infty, +\infty]$$
4. Global Parameters:
   $$t_{\text{enter}} = \max(-8.0, -\infty, -\infty) = -8.0$$
   $$t_{\text{exit}} = \min(-5.0, +\infty, +\infty) = -5.0$$
5. Evaluation:
   $t_{\text{enter}} \le t_{\text{exit}}$ ($-8.0 \le -5.0$) is TRUE.
   However, $t_{\text{exit}} = -5.0 \ge 0$ is **FALSE!**
   The entire box is strictly behind the ray origin ($t < 0$). The algorithm correctly rejects the box!

---

### Worked Example 2.6: Calculating the Surface Normal at Hit Point
**Problem:** In Worked Example 2.1, the ray hit the box at $\mathbf{P} = (-1.0, 5.0, 1.0)^T$ at $t_{\text{enter}} = 5.0$.
Derive an algorithm to determine which bounding face was struck and compute the outward unit normal vector $\hat{\mathbf{n}}$.

**Solution:**
1. The face struck corresponds to whichever axis determined the maximum entering time $t_{\text{enter}}$:
   $$t_{\text{enter}} = \max(t_{\min, x}, t_{\min, y}, t_{\min, z})$$
2. In Example 2.1:
   $t_{\min, x} = 5.0$, $t_{\min, y} = -5.0$, $t_{\min, z} = -\infty$.
   The maximum was produced by the **X-axis** ($t_{\min, x} = 5.0$).
3. To determine whether the hit was on the min face or max face:
   Look at the sign of the ray direction component $D_x$:
   - If $D_x > 0$: The ray entered through the **minimum face** ($x = \min_x$).
     Normal points against the ray: $\hat{\mathbf{n}} = (-1, 0, 0)^T$.
   - If $D_x < 0$: The ray entered through the **maximum face** ($x = \max_x$).
     Normal points against the ray: $\hat{\mathbf{n}} = (+1, 0, 0)^T$.
4. Here $D_x = +0.8 > 0 \implies$ Outward normal is:
   $$\hat{\mathbf{n}} = (-1, 0, 0)^T$$

---

### Worked Example 2.7: Ray-Segment (Clamped Ray) AABB Intersection
**Problem:** A line segment spans from $\mathbf{A} = (-2, 0, 0)^T$ to $\mathbf{B} = (2, 0, 0)^T$.
An AABB is located at $\mathbf{min} = (3, -1, -1)^T$, $\mathbf{max} = (5, 1, 1)^T$.
Explain how the slab method is modified to test line segments of finite length $L = \|\mathbf{B} - \mathbf{A}\|$ rather than infinite rays.

**Solution:**
1. Parameterize the segment:
   $$\mathbf{O} = \mathbf{A} = (-2, 0, 0)^T$$
   $$\mathbf{d} = \mathbf{B} - \mathbf{A} = (4, 0, 0)^T$$
   Length $L = 4.0$. Normalized direction $\mathbf{D} = (1, 0, 0)^T$.
2. For an infinite ray, the intersection condition is $t_{\text{enter}} \le t_{\text{exit}} \land t_{\text{exit}} \ge 0$.
3. For a finite segment of length $L$, the ray only exists on $t \in [0, L]$.
   The intersection condition is clamped:
   $$\boxed{\text{Segment intersects AABB} \iff (t_{\text{enter}} \le t_{\text{exit}}) \land (t_{\text{exit}} \ge 0) \land (t_{\text{enter}} \le L)}$$
4. Compute parameters:
   $$t_{1, x} = \frac{3 - (-2)}{1} = 5.0, \quad t_{2, x} = \frac{5 - (-2)}{1} = 7.0$$
   $$t_{\text{enter}} = 5.0, \quad t_{\text{exit}} = 7.0$$
5. Check segment bounds:
   $t_{\text{enter}} \le t_{\text{exit}}$ ($5.0 \le 7.0$) $\implies$ True.
   $t_{\text{enter}} \le L$ ($5.0 \le 4.0$) $\implies$ **FALSE!**
   The segment terminates at $t = 4.0$ before reaching the box at $t = 5.0$. The segment does not intersect the box.

---

### Worked Example 2.8: Transforming an AABB via an Affine Matrix
**Problem:** An AABB in local coordinates has $\mathbf{min}_{\text{local}} = (-1, -2, -3)^T$ and $\mathbf{max}_{\text{local}} = (1, 2, 3)^T$.
The object undergoes translation $\mathbf{T} = (10, 0, 5)^T$ and a $90^\circ$ rotation about the x-axis:
$$\mathbf{R} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{pmatrix}$$
Calculate the new world-space AABB bounds.

**Solution:**
1. Local center and half-extents:
   $$\mathbf{c}_{\text{local}} = \frac{\mathbf{min} + \mathbf{max}}{2} = (0, 0, 0)^T$$
   $$\mathbf{e}_{\text{local}} = \frac{\mathbf{max} - \mathbf{min}}{2} = (1, 2, 3)^T$$
2. Transformed world center:
   $$\mathbf{c}_{\text{world}} = \mathbf{R} \mathbf{c}_{\text{local}} + \mathbf{T} = \mathbf{0} + (10, 0, 5)^T = (10, 0, 5)^T$$
3. World half-extents via absolute rotation matrix $|\mathbf{R}|$:
   $$|\mathbf{R}| = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{pmatrix}$$
   $$\mathbf{e}_{\text{world}} = |\mathbf{R}| \, \mathbf{e}_{\text{local}} = \begin{pmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{pmatrix} \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} = \begin{pmatrix} 1 \cdot 1 \\ 1 \cdot 3 \\ 1 \cdot 2 \end{pmatrix} = \begin{pmatrix} 1 \\ 3 \\ 2 \end{pmatrix}$$
4. World AABB bounds:
   $$\mathbf{min}_{\text{world}} = \mathbf{c}_{\text{world}} - \mathbf{e}_{\text{world}} = (10 - 1, 0 - 3, 5 - 2)^T = (9, -3, 3)^T$$
   $$\mathbf{max}_{\text{world}} = \mathbf{c}_{\text{world}} + \mathbf{e}_{\text{world}} = (10 + 1, 0 + 3, 5 + 2)^T = (11, 3, 7)^T$$

---

### Worked Example 2.9: Fast Point-AABB Distance (Clamping Method)
**Problem:** Given an AABB with $\mathbf{min} = (-2, -2, -2)^T$ and $\mathbf{max} = (2, 2, 2)^T$, find the closest point $\mathbf{Q}$ on or inside the AABB to the query point $\mathbf{P} = (5, 1, -4)^T$, and calculate the Euclidean distance.

**Solution:**
1. **The Component Clamping Law:**
   The closest point $\mathbf{Q}$ on an AABB to any external point $\mathbf{P}$ is found by clamping each coordinate of $\mathbf{P}$ to the interval $[\min_i, \max_i]$:
   $$Q_i = \max(\min_i, \, \min(\max_i, P_i))$$
2. Apply to each axis:
   $$Q_x = \max(-2, \min(2, 5)) = \max(-2, 2) = 2.0$$
   $$Q_y = \max(-2, \min(2, 1)) = \max(-2, 1) = 1.0$$
   $$Q_z = \max(-2, \min(2, -4)) = \max(-2, -2) = -2.0$$
   $$\mathbf{Q} = (2.0, 1.0, -2.0)^T$$
3. Distance calculation:
   $$\mathbf{d} = \mathbf{P} - \mathbf{Q} = \begin{pmatrix} 5 - 2 \\ 1 - 1 \\ -4 - (-2) \end{pmatrix} = \begin{pmatrix} 3 \\ 0 \\ -2 \end{pmatrix}$$
   $$\|\mathbf{d}\| = \sqrt{3^2 + 0^2 + (-2)^2} = \sqrt{9 + 4} = \sqrt{13} \approx 3.6055\text{ m}$$

---

### Worked Example 2.10: AABB Collision Margin (Fattening / Inflation)
**Problem:** An AABB has bounds $\mathbf{min} = (-1, 0, 2)^T$ and $\mathbf{max} = (3, 4, 6)^T$.
In real-time physics engines, nodes are "fattened" by a scalar safety margin $\delta = 0.1\text{ m}$ to absorb velocity jitter and rotational motion without triggering tree rebalancing.
Calculate the inflated bounds and the percentage increase in surface area.

**Solution:**
1. Inflate bounds by subtracting $\delta$ from $\mathbf{min}$ and adding $\delta$ to $\mathbf{max}$:
   $$\mathbf{min}_{\text{fat}} = \mathbf{min} - \delta \mathbf{1} = (-1 - 0.1, 0 - 0.1, 2 - 0.1)^T = (-1.1, -0.1, 1.9)^T$$
   $$\mathbf{max}_{\text{fat}} = \mathbf{max} + \delta \mathbf{1} = (3 + 0.1, 4 + 0.1, 6 + 0.1)^T = (3.1, 4.1, 6.1)^T$$
2. Original Dimensions:
   $$d_x = 3 - (-1) = 4, \quad d_y = 4 - 0 = 4, \quad d_z = 6 - 2 = 4$$
   Original Surface Area:
   $$\text{SA}_{\text{orig}} = 2(4 \times 4 + 4 \times 4 + 4 \times 4) = 2(48) = 96.0\text{ m}^2$$
3. Fattened Dimensions:
   $$d_{x, \text{fat}} = 3.1 - (-1.1) = 4.2, \quad d_{y, \text{fat}} = 4.2, \quad d_{z, \text{fat}} = 4.2$$
   Fattened Surface Area:
   $$\text{SA}_{\text{fat}} = 2(4.2 \times 4.2 \times 3) = 2(52.92) = 105.84\text{ m}^2$$
4. Increase:
   $$\Delta \text{SA} = \frac{105.84 - 96.0}{96.0} = \frac{9.84}{96.0} = +10.25\%$$
   A $10\text{ cm}$ margin increases ray hit probability by only $10\%$, while saving hundreds of tree refits per second!

---

## 2.7 Ten Granular Solved Exercises

### Exercise 2.1: Corner Intersection Test
**Problem:** A ray has origin $\mathbf{O} = (-2, -2, -2)^T$ and direction $\mathbf{D} = \frac{1}{\sqrt{3}}(1, 1, 1)^T$.
An AABB is defined by $\mathbf{min} = (0, 0, 0)^T$ and $\mathbf{max} = (2, 2, 2)^T$.
Trace the slab parameters and verify that the ray hits the exact corner vertex $(0, 0, 0)^T$.

**Solution:**
1. For all three axes $i \in \{x, y, z\}$:
   $$t_{1, i} = \frac{0 - (-2)}{1/\sqrt{3}} = 2\sqrt{3} \approx 3.4641$$
   $$t_{2, i} = \frac{2 - (-2)}{1/\sqrt{3}} = 4\sqrt{3} \approx 6.9282$$
2. Thus $t_{\min, x} = t_{\min, y} = t_{\min, z} = 2\sqrt{3}$.
   $$t_{\text{enter}} = \max(2\sqrt{3}, 2\sqrt{3}, 2\sqrt{3}) = 2\sqrt{3}$$
   $$t_{\text{exit}} = \min(4\sqrt{3}, 4\sqrt{3}, 4\sqrt{3}) = 4\sqrt{3}$$
3. Hit point at $t_{\text{enter}} = 2\sqrt{3}$:
   $$\mathbf{P}(2\sqrt{3}) = \begin{pmatrix} -2 \\ -2 \\ -2 \end{pmatrix} + 2\sqrt{3} \begin{pmatrix} 1/\sqrt{3} \\ 1/\sqrt{3} \\ 1/\sqrt{3} \end{pmatrix} = \begin{pmatrix} -2 + 2 \\ -2 + 2 \\ -2 + 2 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$$
   Matches corner $(0, 0, 0)^T$ exactly!

---

### Exercise 2.2: Proof of Bounding Invariant for Transformed AABBs
**Problem:** Prove analytically that for any 3D rotation matrix $\mathbf{R}$ and local box half-extents $\mathbf{e}$, the transformed world half-extents $\mathbf{e}_{\text{world}} = |\mathbf{R}| \mathbf{e}$ conservatively encloses all 8 rotated box vertices.

**Solution:**
1. A vertex of the local box is given by $\mathbf{v} = (\pm e_x, \pm e_y, \pm e_z)^T$.
2. The $i$-th coordinate of the rotated vertex is:
   $$(\mathbf{R} \mathbf{v})_i = R_{i0} v_x + R_{i1} v_y + R_{i2} v_z$$
3. By the Triangle Inequality:
   $$|(\mathbf{R} \mathbf{v})_i| \le |R_{i0} v_x| + |R_{i1} v_y| + |R_{i2} v_z| = |R_{i0}| e_x + |R_{i1}| e_y + |R_{i2}| e_z$$
4. The right-hand side is precisely the $i$-th row of $|\mathbf{R}|$ multiplied by $\mathbf{e}$:
   $$|(\mathbf{R} \mathbf{v})_i| \le (|\mathbf{R}| \mathbf{e})_i = e_{\text{world}, i}$$
5. Therefore, $-e_{\text{world}, i} \le (\mathbf{R}\mathbf{v})_i \le e_{\text{world}, i}$ for all 8 vertices, proving strict containment. $\blacksquare$

---

### Exercise 2.3: Degenerate 2D Slabs (Zero-Thickness AABBs)
**Problem:** A flat planar polygon in the xy-plane has AABB bounds $\mathbf{min} = (0, 0, 0)^T$ and $\mathbf{max} = (5, 5, 0)^T$ (thickness on Z is zero).
How does the slab method handle rays striking or missing this flat box?

**Solution:**
1. On the Z-axis: $\min_z = \max_z = 0$.
2. If $D_z \neq 0$:
   $$t_{1, z} = \frac{0 - O_z}{D_z}, \quad t_{2, z} = \frac{0 - O_z}{D_z}$$
   Both planes coincide, so $t_{\min, z} = t_{\max, z} = -\frac{O_z}{D_z}$.
3. The Z-interval is a single point: $[t_z^*, t_z^*]$.
4. The ray hits the polygon if and only if $t_z^*$ falls within the X and Y intervals $[t_{\min, x}, t_{\max, x}]$ and $[t_{\min, y}, t_{\max, y}]$. The slab method handles zero-thickness planar boxes without modification!

---

### Exercise 2.4: Fast Intersection of a Sphere with an AABB
**Problem:** Formulate an algorithm to determine whether a bounding sphere with center $\mathbf{c}_{\text{sphere}}$ and radius $R$ intersects an AABB $[\mathbf{min}, \mathbf{max}]$ using the clamping distance method.

**Solution:**
1. Find closest point $\mathbf{Q}$ on AABB to $\mathbf{c}_{\text{sphere}}$:
   $$Q_i = \max(\min_i, \min(\max_i, c_{\text{sphere}, i})) \quad \forall i \in \{x, y, z\}$$
2. Compute squared distance:
   $$\text{dist}^2 = \|\mathbf{c}_{\text{sphere}} - \mathbf{Q}\|^2 = \sum_{i \in \{x, y, z\}} (c_{\text{sphere}, i} - Q_i)^2$$
3. Intersects if and only if:
   $$\text{dist}^2 \le R^2$$
   Requires zero square roots and runs in 15 FLOPs!

---

### Exercise 2.5: Ray Grazing Parallel to an Outer Face
**Problem:** A ray has origin $\mathbf{O} = (-2, 6, 0)^T$ and direction $\mathbf{D} = (1, 0, 0)^T$.
An AABB has bounds $[-1, 3] \times [-1, 5] \times [-1, 1]$.
Show that IEEE 754 division by zero correctly flags this parallel ray as a miss.

**Solution:**
1. Y-axis: $D_y = +0.0$. Origin $O_y = 6 > \max_y = 5$.
   $$t_{1, y} = \frac{\min_y - O_y}{D_y} = \frac{-1 - 6}{+0.0} = \frac{-7}{+0.0} = -\infty$$
   $$t_{2, y} = \frac{\max_y - O_y}{D_y} = \frac{5 - 6}{+0.0} = \frac{-1}{+0.0} = -\infty$$
2. $t_{\min, y} = -\infty, t_{\max, y} = -\infty$.
3. When computing $t_{\text{exit}} = \min(\dots, t_{\max, y}) = \min(\dots, -\infty) = -\infty$.
4. Check condition:
   $t_{\text{exit}} \ge 0 \iff -\infty \ge 0 \implies \mathbf{FALSE}$.
   The ray is rejected with zero branching!

---

### Exercise 2.6: Union of $N$ Random 3D Points
**Problem:** Write a linear-time $\mathcal{O}(N)$ algorithm to compute the minimal enclosing AABB for an array of $N$ points in $\mathbb{R}^3$.

**Solution:**
```typescript
function computeAABBFromPoints(points: Vector3[]): { min: Vector3; max: Vector3 } {
  if (points.length === 0) return { min: Vector3.zero(), max: Vector3.zero() };
  const min = points[0].clone();
  const max = points[0].clone();
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.x < min.x) min.x = p.x; else if (p.x > max.x) max.x = p.x;
    if (p.y < min.y) min.y = p.y; else if (p.y > max.y) max.y = p.y;
    if (p.z < min.z) min.z = p.z; else if (p.z > max.z) max.z = p.z;
  }
  return { min, max };
}
```

---

### Exercise 2.7: Ray-AABB Intersection with Bounded Range $[t_{\min}, t_{\max}]$
**Problem:** In ray tracing, shadow rays and ambient occlusion rays are restricted to a range $[t_{\text{near}}, t_{\text{far}}]$ (e.g. $[0.001, 100.0]$).
How are $t_{\text{near}}$ and $t_{\text{far}}$ integrated into the slab method?

**Solution:**
Initialize:
$$t_{\text{enter}} = t_{\text{near}}, \quad t_{\text{exit}} = t_{\text{far}}$$
For each slab $i$:
$$t_{\text{enter}} = \max(t_{\text{enter}}, t_{\min, i})$$
$$t_{\text{exit}} = \min(t_{\text{exit}}, t_{\max, i})$$
If at any point $t_{\text{enter}} > t_{\text{exit}}$, early exit with `false` immediately!

---

### Exercise 2.8: Volumetric Overlap Ratio of Two Partially Intersecting AABBs
**Problem:** Box $A$ spans $[0, 2] \times [0, 2] \times [0, 2]$. Box $B$ spans $[1, 3] \times [1, 3] \times [1, 3]$.
Calculate the intersection volume and the Jaccard similarity index:
$$J(A, B) = \frac{\text{Vol}(A \cap B)}{\text{Vol}(A \cup B)}$$

**Solution:**
1. Volumes: $\text{Vol}(A) = 2^3 = 8\text{ m}^3$, $\text{Vol}(B) = 2^3 = 8\text{ m}^3$.
2. Intersection interval on each axis: $[\max(0, 1), \min(2, 3)] = [1, 2]$, length $= 1.0$.
   $$\text{Vol}(A \cap B) = 1.0 \times 1.0 \times 1.0 = 1.0\text{ m}^3$$
3. Union volume:
   $$\text{Vol}(A \cup B) = \text{Vol}(A) + \text{Vol}(B) - \text{Vol}(A \cap B) = 8 + 8 - 1 = 15.0\text{ m}^3$$
4. Jaccard Index:
   $$J(A, B) = \frac{1.0}{15.0} \approx 0.0667\text{ (or } 6.67\%)$$

---

### Exercise 2.9: Minimum Distance Between Two Disjoint AABBs
**Problem:** Derive the formula for the minimum Euclidean distance between two disjoint AABBs $A$ and $B$.

**Solution:**
1. Along each coordinate axis $i \in \{x, y, z\}$, the separation distance between intervals is:
   $$\Delta_i = \max(0, \, \max(A_{\min, i} - B_{\max, i}, \, B_{\min, i} - A_{\max, i}))$$
2. The minimum Euclidean distance between the boxes is:
   $$\text{dist}(A, B) = \sqrt{\Delta_x^2 + \Delta_y^2 + \Delta_z^2}$$
   If the boxes overlap, $\Delta_x = \Delta_y = \Delta_z = 0 \implies \text{dist} = 0$.

---

### Exercise 2.10: Branchless Sign Masking for Slab Min/Max Swapping
**Problem:** In C++/TypeScript, sorting $t_1$ and $t_2$ using `if (invD < 0) swap(t1, t2)` can cause branch mispredictions. Show how to eliminate the branch using the sign bit of $D_{\text{inv}}$.

**Solution:**
1. Precompute two vectors for each ray:
   $\mathbf{bounds}[0] = \mathbf{min}$, $\mathbf{bounds}[1] = \mathbf{max}$.
2. Store the sign bit of each inverse direction component:
   `sign_x = (invD.x < 0) ? 1 : 0`.
3. Then:
   $$t_{\min, x} = (\mathbf{bounds}[\text{sign}_x].x - O_x) \cdot D_{\text{inv}, x}$$
   $$t_{\max, x} = (\mathbf{bounds}[1 - \text{sign}_x].x - O_x) \cdot D_{\text{inv}, x}$$
   This completely eliminates branching and `min`/`max` calls!

---

## 2.8 Chapter Summary and Bridge to Chapter 3

In this chapter, we thoroughly analyzed Axis-Aligned Bounding Boxes:
1. **Representations:** Compared interval $[\mathbf{min}, \mathbf{max}]$ and affine $[\mathbf{c}, \mathbf{e}]$ formulations.
2. **AABB-AABB Overlap:** Implemented the 6-comparison interval overlap theorem.
3. **The Slab Method:** Derived the Kay-Kajiya parametric ray-box intersection test.
4. **IEEE 754 Robustness:** Demonstrated how division-by-zero infinities naturally handle parallel rays.
5. **Optimizations:** Established inverse direction precomputation and branchless SIMD execution.

However, when an elongated object rotates, its AABB expands drastically, creating enormous empty space. In **Chapter 3: Oriented Bounding Boxes (OBB) and the 15-Axis Separating Axis Theorem (SAT)**, we investigate bounding boxes that rotate rigidly with the body, deriving the complete 15-axis SAT projection theory.
