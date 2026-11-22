# Chapter 8: The Surface Area Heuristic and Optimal Tree Partitioning

> *"A ray through a volume is a gambler's throw. The larger the surface of a box, the more likely the gambler's needle shall pierce it. To minimize the sum of all wagers across all branches of the tree is to discover the path of least resistance."*
> — **J. David Goldsmith & John Salmon**, *Automatic Creation of Object Hierarchies* (1987); formalized by **James Arvo & David Kirk** (1989)

---

## 8.1 The Failure of Geometric Ignorance: Median Splitting Flaws

In Chapter 7, we explored the structural architecture of Bounding Volume Hierarchies and reviewed classical top-down partitioning heuristics: Spatial Median and Object Median.

While both heuristics are simple to implement, they suffer from a fatal flaw: **they are blind to surface area and geometric probability**.

```
                  THE OBJECT MEDIAN FAILURE CASE
                  
               Left Child AABB (Huge Empty Area)
          +--------------------------------------------+
          |  * Tiny Pebble A                           |
          |  * Tiny Pebble B                           |
          |                                            |
          |               (Massive Void)               |
          |                                            |
          |                           * Tiny Pebble C  |
          +--------------------------------------------+
          |  ========================================  |
          |  |         Giant Solid Castle           |  |
          |  ========================================  |
          +--------------------------------------------+
               Right Child AABB (Enormous Density)
               
          - Object Median sorts 4 objects: splits 2 and 2!
          - Pebbles A & B land in Left; Pebble C & Castle land in Right.
          - Result: BOTH child boxes span the ENTIRE scene width!
          - Traversal rays must enter BOTH branches 100% of the time!
```

Consider a scene containing a sprawling, high-polygon architectural model (e.g. a cathedral of $100{,}000$ triangles) alongside three small scattered decorative items ($3$ triangles).
- An **Object Median** builder sorts the $100{,}003$ primitives and divides them strictly in half: $50{,}001$ primitives on the left, and $50{,}002$ primitives on the right.
- This arbitrarily slices the cathedral in two, creating two massive, overlapping bounding boxes that both encompass the entire physical scene.
- A ray passing anywhere through the room must traverse **both child branches**, destroying the logarithmic $\mathcal{O}(\log N)$ guarantee and collapsing tree search back to linear $\mathcal{O}(N)$ brute force!

To construct truly optimal trees, we must abandon arbitrary geometric midpoints and construct a cost model based on **integral geometry and probability theory**.

---

## 8.2 Geometric Probability and Cauchy’s Surface Area Theorem

How likely is a random ray in 3D space to hit a given bounding box?

The answer comes from 19th-century French mathematician Augustin-Louis Cauchy and English mathematician Morgan Crofton in the field of **Integral Geometry**.

```
                           CROFTON'S THEOREM
                                                 Ray Field
                                                / / / / / /
                    Parent Box P               / / / / / /
                  +---------------------------/--/-------+
                  |                          /  /        |
                  |     Child Box C         /  /         |
                  |    +-------------+     /  /          |
                  |    |             |<---*--*           |
                  |    |             |   /  /            |
                  |    +-------------+  /  /             |
                  |                    /  /              |
                  +-------------------/--/---------------+
                                     /  /
```

### 8.2.1 Cauchy’s Surface Area Formula

> **Cauchy's Surface Area Theorem:**
> For any 3D convex body $\mathcal{K} \subset \mathbb{R}^3$, the average projected area $\overline{A}_{\text{proj}}(\mathcal{K})$ of $\mathcal{K}$ onto an isotropic random plane uniformly distributed over the unit sphere $S^2$ is exactly **one-fourth of its total surface area**:
> $$\boxed{\overline{A}_{\text{proj}}(\mathcal{K}) = \frac{1}{4} \, \text{SA}(\mathcal{K})}$$

### 8.2.2 Conditional Ray Hit Probability

Now consider a convex child bounding box $\mathcal{C}$ nested entirely within a convex parent bounding box $\mathcal{P}$ ($\mathcal{C} \subseteq \mathcal{P}$).

Let a random straight-line ray be cast through space from a uniform, isotropic distribution. Suppose we already know that the ray intersects the parent box $\mathcal{P}$.
What is the conditional probability $P(\text{hit } \mathcal{C} \mid \text{hit } \mathcal{P})$ that this ray will also intersect the child box $\mathcal{C}$?

By Crofton's formula, the measure of lines intersecting a convex body is proportional to its projected surface area. Taking the ratio of measures:

$$P(\text{hit } \mathcal{C} \mid \text{hit } \mathcal{P}) = \frac{\overline{A}_{\text{proj}}(\mathcal{C})}{\overline{A}_{\text{proj}}(\mathcal{P})} = \frac{\frac{1}{4}\text{SA}(\mathcal{C})}{\frac{1}{4}\text{SA}(\mathcal{P})}$$

$$\boxed{P(\text{hit } \mathcal{C} \mid \text{hit } \mathcal{P}) = \frac{\text{SA}(\mathcal{C})}{\text{SA}(\mathcal{P})}}$$

This elegant, profound formula states that **the conditional probability of a ray hitting a child bounding box is strictly equal to the ratio of their surface areas**!

---

## 8.3 The Surface Area Heuristic (SAH) Cost Model

Using this geometric probability law, computer graphics pioneers J. David Goldsmith, John Salmon, James Arvo, and David Kirk formulated the **Surface Area Heuristic (SAH)**.

SAH computes the **expected computational cost** (in CPU cycles or FLOPs) of processing a ray query against a tree node.

### 8.3.1 Elementary Computational Costs

We define two fundamental machine constants:
1. **$C_{\text{trav}}$ (Traversal Cost):** The cost of performing a ray-AABB slab intersection test on an internal node and updating the traversal stack (typically calibrated to $C_{\text{trav}} = 1.0\text{ to }1.5$).
2. **$C_{\text{isect}}$ (Intersection Cost):** The cost of performing a narrowphase geometric intersection test on a primitive (e.g., Möller-Trumbore ray-triangle test, calibrated to $C_{\text{isect}} = 1.5\text{ to }2.0$).

### 8.3.2 Expected Cost of a Leaf Node

If a node $P$ containing $N$ primitives is **not split** and declared a **Leaf Node**, every ray that enters $P$ must test all $N$ primitives:

$$\boxed{C_{\text{leaf}} = N \cdot C_{\text{isect}}}$$

### 8.3.3 Expected Cost of Splitting an Internal Node

Suppose instead we split node $P$ into a **Left Child $L$** containing $N_L$ primitives and a **Right Child $R$** containing $N_R$ primitives ($N_L + N_R = N$).

Every ray that enters $P$ incurs:
1. The base cost of traversing the parent: $C_{\text{trav}}$.
2. With probability $P(L \mid P) = \frac{\text{SA}(L)}{\text{SA}(P)}$, the ray hits the left child and tests its $N_L$ primitives.
3. With probability $P(R \mid P) = \frac{\text{SA}(R)}{\text{SA}(P)}$, the ray hits the right child and tests its $N_R$ primitives.

By the linearity of mathematical expectation, the total expected cost of splitting is:

$$C_{\text{split}} = C_{\text{trav}} + P(L \mid P) \cdot (N_L \cdot C_{\text{isect}}) + P(R \mid P) \cdot (N_R \cdot C_{\text{isect}})$$

Factoring out $C_{\text{isect}}$:

$$\boxed{C_{\text{split}} = C_{\text{trav}} + C_{\text{isect}} \left( \frac{\text{SA}(L)}{\text{SA}(P)} N_L + \frac{\text{SA}(R)}{\text{SA}(P)} N_R \right)}$$

```
                   THE SAH COST TRADEOFF
                   
       Case 1: Bad Split (Huge Overlapping Child Boxes)
               SA(L) / SA(P) = 0.9,     SA(R) / SA(P) = 0.9
               C_split = 1 + C_isect * (0.9 * N_L + 0.9 * N_R) = 1 + 0.9 * N * C_isect
               (Almost as expensive as testing all primitives twice!)
               
       Case 2: Good Split (Compact, Separated Child Boxes)
               SA(L) / SA(P) = 0.2,     SA(R) / SA(P) = 0.3
               C_split = 1 + C_isect * (0.2 * N_L + 0.3 * N_R) << C_leaf
               (Dramatic 75% reduction in expected ray intersection cost!)
```

### 8.3.4 The Optimal Split and Termination Decision

At each step of BVH construction, the algorithm searches for the partition candidate that minimizes $C_{\text{split}}$ across all three coordinate axes ($x, y, z$):

$$C_{\text{split}}^* = \min_{\text{axis} \in \{x, y, z\}} \min_{\text{splits}} C_{\text{split}}(\text{axis}, \text{split})$$

We then evaluate the **Universal SAH Decision Rule**:

$$\boxed{\text{Action} = \begin{cases}
\text{SPLIT node into Left and Right children} & \text{if } C_{\text{split}}^* < C_{\text{leaf}} \\
\text{TERMINATE and declare current node as LEAF} & \text{if } C_{\text{split}}^* \ge C_{\text{leaf}}
\end{cases}}$$

This automatic stopping condition is mathematically optimal: **the tree naturally stops subdividing when further splits would increase traversal overhead more than they save in primitive tests!**

---

## 8.4 Exhaustive Sweep SAH Construction ($\mathcal{O}(N \log N)$)

To evaluate $C_{\text{split}}$ across all possible partitions along an axis, a naive algorithm testing every split position would require recalculating bounding boxes from scratch, scaling as $\mathcal{O}(N^2)$ per level.

In production builders, we evaluate all $N - 1$ partition candidates in **linear $\mathcal{O}(N)$ time** using a **Prefix-Suffix Surface Area Sweep**.

```
                  PREFIX-SUFFIX SURFACE AREA SWEEP
                  
Primitives (Sorted):    P_0       P_1       P_2       P_3       P_4
                       [   ]     [   ]     [   ]     [   ]     [   ]
                       
Forward Sweep (Prefix):  |--------> Accumulate Left AABBs & SA(L_i)
                         [===]
                         [=========]
                         [===============]
                         
Backward Sweep (Suffix): <--------| Accumulate Right AABBs & SA(R_i)
                                                 [===]
                                       [=============]
                             [=======================]
```

### 8.4.1 The Sweep Algorithm

For each coordinate axis $\text{axis} \in \{x, y, z\}$:
1. **Sort Primitives by Centroid:** Sort the $N$ primitives in ascending order of their centroid coordinate along the chosen axis ($\mathcal{O}(N \log N)$).
2. **Forward Prefix Sweep:**
   Initialize an empty bounding box $\mathcal{B}_{\text{left}} = \emptyset$.
   Loop $i = 0$ to $N - 2$:
   - $\mathcal{B}_{\text{left}} \leftarrow \mathcal{B}_{\text{left}} \cup \text{AABB}(P_i)$
   - Store $S_{\text{left}}[i] = \text{SurfaceArea}(\mathcal{B}_{\text{left}})$
   - Store $N_{\text{left}}[i] = i + 1$
3. **Backward Suffix Sweep:**
   Initialize an empty bounding box $\mathcal{B}_{\text{right}} = \emptyset$.
   Loop $i = N - 1$ down to $1$:
   - $\mathcal{B}_{\text{right}} \leftarrow \mathcal{B}_{\text{right}} \cup \text{AABB}(P_i)$
   - Store $S_{\text{right}}[i] = \text{SurfaceArea}(\mathcal{B}_{\text{right}})$
   - Store $N_{\text{right}}[i] = N - i$
4. **Evaluate Cost at All $N - 1$ Partition Planes:**
   Loop $i = 0$ to $N - 2$:
   $$C[i] = C_{\text{trav}} + C_{\text{isect}} \left( \frac{S_{\text{left}}[i]}{\text{SA}(P)} (i + 1) + \frac{S_{\text{right}}[i + 1]}{\text{SA}(P)} (N - 1 - i) \right)$$
5. Find the split index $i^*$ that minimizes $C[i]$.

Repeating this sweep across $x, y, z$ finds the **globally optimal partition** in $\mathcal{O}(N \log N)$ time per tree level!

---

## 8.5 Binned SAH: Approximate Linear-Time Builder ($\mathcal{O}(N)$)

While the exhaustive sweep algorithm produces the highest-quality trees, sorting millions of triangles at every tree level becomes a performance bottleneck during asset loading or dynamic scene generation.

In 2007, computer scientist Ingo Wald introduced **Binned SAH**, an algorithm that approximates the optimal split in **strictly linear $\mathcal{O}(N)$ time**.

```
                         BINNED SAH (B = 8 BINS)
                         
Centroid Extent:  |-------|-------|-------|-------|-------|-------|-------|-------|
                  Bin 0   Bin 1   Bin 2   Bin 3   Bin 4   Bin 5   Bin 6   Bin 7
                  * *     *       * * *           * *     *       * *     *
                  
                  - Instead of sorting N primitives, assign each to 1 of 8 bins!
                  - Only 7 candidate split planes are evaluated!
```

### 8.5.1 The Binning Architecture

Instead of testing $N - 1$ individual primitive boundaries, Binned SAH subdivides the centroid bounding box into a small, fixed number of uniform spatial buckets (typically $B = 16$ or $B = 32$ bins):
1. Compute the centroid bounding box of all $N$ primitives along the chosen axis: $[\min_c, \max_c]$.
2. For each primitive $P$:
   - Compute its centroid $c_P$.
   - Calculate its integer bin index $k \in \{0, \dots, B - 1\}$:
     $$k = \min\left( B - 1, \, \left\lfloor B \cdot \frac{c_P - \min_c}{\max_c - \min_c} \right\rfloor \right)$$
   - Accumulate primitive into Bin $k$:
     $$\text{Bin}[k].\text{count} \mathrel{+}= 1$$
     $$\text{Bin}[k].\text{aabb} \leftarrow \text{Bin}[k].\text{aabb} \cup \text{AABB}(P)$$
3. Execute the prefix and suffix sweep over the **$B$ bins** (not the $N$ primitives!).
4. Evaluate SAH cost at the **$B - 1$ bin boundaries**:
   Testing 15 or 31 planes takes a few microseconds regardless of whether $N = 1{,}000$ or $N = 10{,}000{,}000$!
5. Partition primitives into left and right subsets in a single linear pass ($\mathcal{O}(N)$).

Empirical benchmarks demonstrate that Binned SAH with $B = 16$ builds trees **$10\times\text{ to }20\times$ faster** than exhaustive sweep builders, while producing trees with within **$1\%$ of the ray-tracing performance**!

---

## 8.6 Ten Step-by-Step Worked Examples

### Worked Example 8.1: Manual Calculation of SAH Cost
**Problem:** A parent AABB $P$ has dimensions $10\text{ m} \times 10\text{ m} \times 10\text{ m}$ containing $N = 100$ triangles.
Constants are $C_{\text{trav}} = 1.0$ and $C_{\text{isect}} = 2.0$.
Candidate Split 1 divides the node into:
- Left child $L_1$: Dimensions $5 \times 10 \times 10$, containing $N_L = 20$ triangles.
- Right child $R_1$: Dimensions $5 \times 10 \times 10$, containing $N_R = 80$ triangles.
Calculate $C_{\text{leaf}}$, $C_{\text{split}}$, and determine whether the node should be split.

**Solution:**
1. **Surface Area of Parent Box $P$:**
   Dimensions: $(10, 10, 10)$.
   $$\text{SA}(P) = 2(10 \times 10 + 10 \times 10 + 10 \times 10) = 2(100 + 100 + 100) = 600\text{ m}^2$$
2. **Cost of Declaring Node a Leaf:**
   $$C_{\text{leaf}} = N \cdot C_{\text{isect}} = 100 \times 2.0 = 200.0$$
3. **Surface Area of Children:**
   - Left Child $L_1$ Dimensions: $(5, 10, 10)$.
     $$\text{SA}(L_1) = 2(5 \times 10 + 10 \times 10 + 10 \times 5) = 2(50 + 100 + 50) = 2(200) = 400\text{ m}^2$$
   - Right Child $R_1$ Dimensions: $(5, 10, 10)$.
     $$\text{SA}(R_1) = 400\text{ m}^2$$
4. **Hit Probabilities:**
   $$P(L_1 \mid P) = \frac{\text{SA}(L_1)}{\text{SA}(P)} = \frac{400}{600} = \frac{2}{3} \approx 0.6667$$
   $$P(R_1 \mid P) = \frac{\text{SA}(R_1)}{\text{SA}(P)} = \frac{400}{600} = \frac{2}{3} \approx 0.6667$$
5. **Expected Split Cost:**
   $$C_{\text{split}} = C_{\text{trav}} + C_{\text{isect}} \left( P(L_1 \mid P) N_L + P(R_1 \mid P) N_R \right)$$
   $$C_{\text{split}} = 1.0 + 2.0 \left( \frac{2}{3}(20) + \frac{2}{3}(80) \right) = 1.0 + 2.0 \left( \frac{2}{3}(100) \right) = 1.0 + 2.0(66.67) = 1.0 + 133.33 = 134.33$$
6. **Comparison:**
   $$C_{\text{split}} = 134.33 < C_{\text{leaf}} = 200.0 \quad (\mathbf{TRUE!})$$
   Splitting reduces expected cost from $200.0$ down to $134.33$ (a $32.8\%$ speedup). The node must be split!

---

### Worked Example 8.2: Optimal Split Selection Between Two Candidates
**Problem:** For the parent box in Example 8.1, an alternative Split 2 is evaluated:
- Left child $L_2$: Dimensions $2 \times 2 \times 2$ (tight cluster), containing $N_L = 90$ triangles.
- Right child $R_2$: Dimensions $10 \times 10 \times 8$, containing $N_R = 10$ triangles.
Calculate $C_{\text{split}}$ for Split 2 and identify which split candidate is superior.

**Solution:**
1. Parent $\text{SA}(P) = 600\text{ m}^2$.
2. **Left Child $L_2$ Surface Area:**
   $$\text{SA}(L_2) = 2(2 \times 2 + 2 \times 2 + 2 \times 2) = 2(4 + 4 + 4) = 24\text{ m}^2$$
   $$P(L_2 \mid P) = \frac{24}{600} = 0.04 \quad (4\% \text{ chance of ray hitting left child!})$$
3. **Right Child $R_2$ Surface Area:**
   Dimensions: $(10, 10, 8)$.
   $$\text{SA}(R_2) = 2(10 \times 10 + 10 \times 8 + 8 \times 10) = 2(100 + 80 + 80) = 2(260) = 520\text{ m}^2$$
   $$P(R_2 \mid P) = \frac{520}{600} \approx 0.8667$$
4. **Expected Cost $C_{\text{split}}$:**
   $$C_{\text{split}} = 1.0 + 2.0 [ 0.04(90) + 0.8667(10) ] = 1.0 + 2.0 [ 3.6 + 8.667 ] = 1.0 + 2.0(12.267) = 1.0 + 24.53 = 25.53$$
5. **Comparison:**
   - Split 1 Cost $= 134.33$
   - Split 2 Cost $= \mathbf{25.53}$!
   Split 2 is **$5.25\times$ faster** than Split 1! Even though Split 2 is numerically unbalanced ($90$ vs $10$), the $90$ triangles are packed so tightly that $96\%$ of rays completely miss them!

---

### Worked Example 8.3: Stopping Condition (Declaring a Leaf Node)
**Problem:** A node contains $N = 3$ triangles. $\text{SA}(P) = 100\text{ m}^2$.
$C_{\text{trav}} = 1.5$, $C_{\text{isect}} = 2.0$.
The best possible split along any axis yields $\text{SA}(L) = 80\text{ m}^2$ ($N_L = 1$) and $\text{SA}(R) = 70\text{ m}^2$ ($N_R = 2$).
Determine whether the builder should split or make a leaf.

**Solution:**
1. Cost as Leaf:
   $$C_{\text{leaf}} = N \cdot C_{\text{isect}} = 3 \times 2.0 = 6.0$$
2. Cost as Split:
   $$P(L) = \frac{80}{100} = 0.8, \quad P(R) = \frac{70}{100} = 0.7$$
   $$C_{\text{split}} = C_{\text{trav}} + C_{\text{isect}} [ P(L) N_L + P(R) N_R ] = 1.5 + 2.0 [ 0.8(1) + 0.7(2) ]$$
   $$= 1.5 + 2.0 [ 0.8 + 1.4 ] = 1.5 + 2.0(2.2) = 1.5 + 4.4 = 5.9$$
3. If $C_{\text{trav}}$ was slightly higher (e.g. $C_{\text{trav}} = 2.0$):
   $$C_{\text{split}} = 2.0 + 4.4 = 6.4 > C_{\text{leaf}} = 6.0$$
   Splitting would increase expected cost! The node stops subdividing and creates a leaf of 3 triangles.

---

### Worked Example 8.4: Exhaustive Sweep Prefix-Suffix Trace
**Problem:** Three primitives are sorted along the x-axis:
- $P_0$: AABB spans $[0, 2] \times [0, 2] \times [0, 2]$, $\text{SA} = 24$.
- $P_1$: AABB spans $[3, 5] \times [0, 2] \times [0, 2]$, $\text{SA} = 24$.
- $P_2$: AABB spans $[6, 8] \times [0, 2] \times [0, 2]$, $\text{SA} = 24$.
Parent box spans $[0, 8] \times [0, 2] \times [0, 2]$, $\text{SA}(P) = 2(8 \times 2 + 2 \times 2 + 2 \times 8) = 2(16 + 4 + 16) = 72$.
Use prefix-suffix sweeps to evaluate the two partition candidates: Split at $i = 0$ ($P_0 \mid P_1, P_2$) and Split at $i = 1$ ($P_0, P_1 \mid P_2$).

**Solution:**
1. **Candidate 1 (Split after $P_0$):**
   - Left side: $\{ P_0 \}$. Bounding box is $[0, 2] \times [0, 2] \times [0, 2]$, $\text{SA}(L) = 24$. $N_L = 1$.
   - Right side: $\{ P_1, P_2 \}$. Bounding box is $[3, 8] \times [0, 2] \times [0, 2]$ (length 5).
     $$\text{SA}(R) = 2(5 \times 2 + 2 \times 2 + 2 \times 5) = 2(10 + 4 + 10) = 48$$
     $N_R = 2$.
   - Cost:
     $$C[0] = 1.0 + 2.0 \left( \frac{24}{72}(1) + \frac{48}{72}(2) \right) = 1.0 + 2.0 \left( \frac{24 + 96}{72} \right) = 1.0 + 2.0 \left(\frac{120}{72}\right) = 1.0 + 3.333 = 4.333$$
2. **Candidate 2 (Split after $P_1$):**
   - Left side: $\{ P_0, P_1 \}$. Bounding box is $[0, 5] \times [0, 2] \times [0, 2]$, $\text{SA}(L) = 48$. $N_L = 2$.
   - Right side: $\{ P_2 \}$. Bounding box is $[6, 8] \times [0, 2] \times [0, 2]$, $\text{SA}(R) = 24$. $N_R = 1$.
   - Cost:
     $$C[1] = 1.0 + 2.0 \left( \frac{48}{72}(2) + \frac{24}{72}(1) \right) = 1.0 + 3.333 = 4.333$$
3. By symmetry, both splits are equally optimal ($C = 4.333$).

---

### Worked Example 8.5: Binned SAH Bucket Assignment
**Problem:** Centroids of four primitives along the x-axis are $c_0 = 1.2, c_1 = 3.8, c_2 = 4.1, c_3 = 8.9$.
Centroid bounds are $[\min_c, \max_c] = [1.0, 9.0]$.
Using $B = 4$ bins, calculate the bin index $k \in \{0, 1, 2, 3\}$ for each primitive.

**Solution:**
1. Span length: $W = \max_c - \min_c = 9.0 - 1.0 = 8.0$.
2. Bin width: $w_{\text{bin}} = W / B = 8.0 / 4 = 2.0$.
   - Bin 0 interval: $[1.0, 3.0)$
   - Bin 1 interval: $[3.0, 5.0)$
   - Bin 2 interval: $[5.0, 7.0)$
   - Bin 3 interval: $[7.0, 9.0]$
3. Bin index formula:
   $$k = \min\left(3, \left\lfloor 4 \cdot \frac{c - 1.0}{8.0} \right\rfloor \right)$$
4. Evaluate:
   - $P_0 (1.2)$: $k = \lfloor 4 \cdot \frac{0.2}{8} \rfloor = \lfloor 0.1 \rfloor = \mathbf{0}$.
   - $P_1 (3.8)$: $k = \lfloor 4 \cdot \frac{2.8}{8} \rfloor = \lfloor 1.4 \rfloor = \mathbf{1}$.
   - $P_2 (4.1)$: $k = \lfloor 4 \cdot \frac{3.1}{8} \rfloor = \lfloor 1.55 \rfloor = \mathbf{1}$.
   - $P_3 (8.9)$: $k = \lfloor 4 \cdot \frac{7.9}{8} \rfloor = \lfloor 3.95 \rfloor = \mathbf{3}$.
5. Distribution: Bin 0 has 1 prim, Bin 1 has 2 prims, Bin 2 has 0 prims, Bin 3 has 1 prim.

---

### Worked Example 8.6: Empty Bin Handling in Binned SAH
**Problem:** In Example 8.5, Bin 2 is completely empty ($\text{count} = 0$).
How does Binned SAH handle empty bins during the prefix-suffix sweep?

**Solution:**
1. If $\text{Bin}[k].\text{count} == 0$, its bounding box is empty ($\emptyset$).
2. During the forward prefix sweep:
   $$\mathcal{B}_{\text{left}}[2] = \mathcal{B}_{\text{left}}[1] \cup \emptyset = \mathcal{B}_{\text{left}}[1]$$
   $S_{\text{left}}[2] = S_{\text{left}}[1]$, and $N_{\text{left}}[2] = N_{\text{left}}[1]$.
3. An empty bin introduces no artificial expansion to the bounding boxes.
   A split plane placed between Bin 1 and Bin 2 simply carves away the empty vacuum between $x = 5.0$ and $x = 7.0$!

---

### Worked Example 8.7: Calibrating Traversal vs Intersection Costs ($C_{\text{trav}} / C_{\text{isect}}$)
**Problem:** A graphics hardware architect profiles a ray tracing engine:
- Ray-AABB slab test takes $16\text{ nanoseconds}$.
- Ray-Triangle Möller-Trumbore test takes $32\text{ nanoseconds}$.
Determine the normalized ratio of $C_{\text{trav}}$ and $C_{\text{isect}}$.

**Solution:**
1. Normalize by setting $C_{\text{trav}} = 1.0$:
   $$C_{\text{trav}} = 1.0$$
2. Intersection cost ratio:
   $$C_{\text{isect}} = \frac{32\text{ ns}}{16\text{ ns}} \cdot C_{\text{trav}} = 2.0$$
3. If primitives were complex NURBS curves taking $160\text{ ns}$:
   $$C_{\text{isect}} = \frac{160}{16} = 10.0$$
   With higher $C_{\text{isect}}$, the builder will split much more aggressively to isolate the expensive primitives!

---

### Worked Example 8.8: SAH Tree Quality Metric (Total Expected Ray Cost)
**Problem:** For an entire built BVH, define the tree quality metric $\text{Cost}(\mathcal{T})$ and explain how it predicts overall rendering framerate.

**Solution:**
1. The global tree cost is the sum of costs across all nodes weighted by their probability of being visited:
   $$\text{Cost}(\mathcal{T}) = C_{\text{trav}} \sum_{v \in \mathcal{V}_{\text{internal}}} \frac{\text{SA}(v)}{\text{SA}(v_{\text{root}})} + C_{\text{isect}} \sum_{v \in \mathcal{V}_{\text{leaf}}} \frac{\text{SA}(v)}{\text{SA}(v_{\text{root}})} N_v$$
2. By Crofton's theorem, this formula computes the **exact expected number of CPU clock cycles per random ray**!
3. A tree with $\text{Cost}(\mathcal{T}) = 15.2$ will render frames exactly $2\times$ faster than a tree with $\text{Cost}(\mathcal{T}) = 30.4$.

---

### Worked Example 8.9: Planar Degeneracy (2D Flat Meshes)
**Problem:** A triangle mesh lies entirely in the xy-plane ($z = 0$).
Show why the SAH denominator surface area $\text{SA}(P) = 2(w \cdot h + h \cdot 0 + 0 \cdot w) = 2 w h$ does not divide by zero.

**Solution:**
1. For a planar box of width $w > 0$ and height $h > 0$ with thickness $d = 0$:
   $$\text{SA}(P) = 2(wh + w \cdot 0 + h \cdot 0) = 2wh > 0$$
2. The surface area is non-zero (equal to twice the front-and-back face areas).
3. The ratio $\frac{\text{SA}(C)}{\text{SA}(P)} = \frac{2 w_c h_c}{2 w_p h_p} = \frac{w_c h_c}{w_p h_p}$ reduces exactly to the 2D area ratio, perfectly preserving geometric probability!

---

### Worked Example 8.10: Memory vs SAH Build Time Tradeoff
**Problem:** Compare build times and memory overhead for a 16-bin SAH builder versus an exhaustive $\mathcal{O}(N \log N)$ builder on $1{,}000{,}000$ triangles.

**Solution:**
1. **Exhaustive Builder:**
   Sorting $10^6$ elements takes $\sim 20 \times 10^6$ operations per level.
   Over 20 levels: $\approx 4 \times 10^8$ operations.
   Build time: $\sim 1.5\text{ seconds}$.
2. **Binned Builder ($B = 16$):**
   Assigning $10^6$ elements to 16 bins takes $10^6$ operations per level.
   Evaluating 15 bin splits takes $15$ operations.
   Over 20 levels: $\approx 2 \times 10^7$ operations.
   Build time: $\sim 0.08\text{ seconds}$ ($\mathbf{18.7\times\text{ faster!}}$).
   Memory overhead: 16 bin structs $\times 32\text{ bytes} = 512\text{ bytes}$ (negligible!).

---

## 8.7 Ten Granular Solved Exercises

### Exercise 8.1: Cauchy Formula for Sphere Surface Area
**Problem:** Using Cauchy's theorem $\overline{A}_{\text{proj}} = \frac{1}{4}\text{SA}$, prove that the projected area of a sphere of radius $R$ is $\pi R^2$.

**Solution:**
1. Surface area of sphere: $\text{SA} = 4\pi R^2$.
2. By Cauchy's formula:
   $$\overline{A}_{\text{proj}} = \frac{1}{4}(4\pi R^2) = \pi R^2$$
   Every 2D projection of a sphere is a circle of area $\pi R^2$. $\blacksquare$

---

### Exercise 8.2: Maximum Possible SAH Ratio
**Problem:** What is the maximum possible value of the ratio $\frac{\text{SA}(L) + \text{SA}(R)}{\text{SA}(P)}$ for non-overlapping children?

**Solution:**
When a parent box is sliced in half by a planar cut, the two children share the internal cut face.
The sum of child surface areas equals $\text{SA}(P) + 2 A_{\text{cut}}$.
The maximum ratio occurs for a cube sliced across its largest cross-section:
$$\frac{\text{SA}(L) + \text{SA}(R)}{\text{SA}(P)} = 1 + \frac{2 s^2}{6 s^2} = 1 + \frac{1}{3} = \frac{4}{3} \approx 1.333$$

---

### Exercise 8.3: Degenerate Split with Zero Primitives
**Problem:** Why must the SAH builder forbid splits where $N_L = 0$ or $N_R = 0$?

**Solution:**
If $N_L = 0$ and $N_R = N$, the right child has the same primitives as the parent. The builder would recurse infinitely on the right child without reducing problem size.

---

### Exercise 8.4: SAH on Identical Coincident Primitives
**Problem:** If 100 triangles have identical bounding boxes, what does the SAH stopping condition decide?

**Solution:**
Any split would produce child boxes with $\text{SA}(L) = \text{SA}(P)$ and $\text{SA}(R) = \text{SA}(P)$.
$C_{\text{split}} = C_{\text{trav}} + C_{\text{isect}} [ 1.0(N_L) + 1.0(N_R) ] = C_{\text{trav}} + N C_{\text{isect}} > C_{\text{leaf}}$.
The SAH automatically declares a leaf containing all 100 triangles, preventing infinite loops!

---

### Exercise 8.5: Dynamic Programming in Tree Building
**Problem:** In the prefix-suffix sweep, why is storing prefix bounding boxes considered dynamic programming?

**Solution:**
Because $\mathcal{B}_{\text{left}}[i] = \mathcal{B}_{\text{left}}[i-1] \cup \text{AABB}(P_i)$, computing the prefix array reuses previous subproblem solutions in $\mathcal{O}(1)$ time per element rather than recomputing unions from scratch.

---

### Exercise 8.6: Splitting Along Non-Longest Axes
**Problem:** Can the optimal SAH split lie on an axis that is NOT the longest axis of the bounding box?

**Solution:**
Yes! If primitives are distributed along a thin diagonal sheet, a cut along a shorter axis may produce much smaller child surface areas than a cut along the longest axis. This is why high-quality builders sweep all three axes!

---

### Exercise 8.7: Binned SAH Optimal Bin Count
**Problem:** Why do engines rarely use more than $B = 64$ bins in Binned SAH?

**Solution:**
Because $B = 32$ already captures $>99\%$ of the optimal sweep quality. Increasing to $B = 128$ increases bin evaluation time without noticeable rendering speedups.

---

### Exercise 8.8: Surface Area vs Volume Probability
**Problem:** Why is ray hit probability proportional to surface area rather than volume?

**Solution:**
Rays enter a body through its surface boundary $\partial \mathcal{K}$. The interior volume cannot be reached without first crossing the 2D bounding surface.

---

### Exercise 8.9: Leaf Primitive Threshold Effect
**Problem:** If $N_{\text{leaf\_max}} = 1$, can a leaf ever contain 2 primitives?

**Solution:**
Only if all candidate splits fail the SAH test ($C_{\text{split}} \ge C_{\text{leaf}}$) and force-splitting is disabled, or if the primitives are coincident.

---

### Exercise 8.10: Amortized SAH Evaluation per Ray
**Problem:** If building an SAH BVH takes $50\text{ ms}$ and saves $1\ \mu\text{s}$ per ray, how many rays must be cast to break even?

**Solution:**
$$\text{Rays} = \frac{50 \times 10^{-3}\text{ s}}{10^{-6}\text{ s/ray}} = 50{,}000\text{ rays}$$
In a $1920 \times 1080$ frame ($2{,}073{,}600$ rays), the build cost is amortized in less than $2.5\%$ of a single frame!

---

## 8.8 Chapter Summary and Bridge to Chapter 9

In this chapter, we formulated the mathematical pinnacle of spatial hierarchy construction:
1. **Geometric Probability:** Proved Cauchy's theorem $P(\text{hit } C \mid \text{hit } P) = \frac{\text{SA}(C)}{\text{SA}(P)}$.
2. **The SAH Cost Model:** Formulated $C_{\text{split}} = C_{\text{trav}} + C_{\text{isect}} [ \frac{\text{SA}(L)}{\text{SA}(P)} N_L + \frac{\text{SA}(R)}{\text{SA}(P)} N_R ]$.
3. **Exhaustive Sweep Builder:** Implemented the $\mathcal{O}(N \log N)$ prefix-suffix sweep algorithm.
4. **Binned SAH:** Accelerated construction to linear $\mathcal{O}(N)$ using spatial binning.

However, both sweep and binned builders rely on recursive CPU partitioning that is difficult to parallelize on GPUs. In **Chapter 9: Spatial Morton Codes and Linear BVH (LBVH)**, we investigate how space-filling curves and bitwise radix sorting enable massive GPU parallelism and instant tree generation.
