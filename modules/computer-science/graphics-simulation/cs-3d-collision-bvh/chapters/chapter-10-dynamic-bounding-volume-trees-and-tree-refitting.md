# Chapter 10: Dynamic Bounding Volume Trees and Tree Refitting

> *"A static tree is a monument of stone; a dynamic tree is a living organism. When leaves drift and branches sway with the physical tempest, the tree must bend without breaking, pruning its decayed limbs and expanding its canopy to shelter moving worlds."*
> — **Erin Catto**, *Dynamic Trees & Incremental Broadphase* (Game Developers Conference, 2011)

---

## 10.1 Static vs. Dynamic Simulation Regimes

Throughout Chapters 7, 8, and 9, we examined Bounding Volume Hierarchy construction under the assumption of a **static geometric universe**:
- In photorealistic ray tracing and offline rendering, a static architectural scene is processed once via high-quality SAH, and then queried billions of times by cameras, shadows, and photon rays.
- Build time can afford to take hundreds of milliseconds or seconds, because tree quality $\text{Cost}(\mathcal{T})$ directly dictates the performance of the rendering pass.

In **interactive physics simulation and game engines**, this assumption collapses:
1. Rigid bodies move, translate, spin, collide, and tumble at $60\text{ to }144\text{ Hz}$.
2. Thousands of dynamic entities (vehicles, ragdolls, debris, projectiles) change their spatial coordinates every $16.6\text{ milliseconds}$.
3. Deformable bodies (cloth, soft tissue, ropes) alter their vertex coordinates every numerical integration sub-step.

```
+-----------------------------------------------------------------------------+
|                     STATIC vs. DYNAMIC SIMULATION REGIMES                   |
+-----------------------------------------------------------------------------+
| Property            | Static Regime (Ray Tracing)   | Dynamic Regime (Physics)|
+---------------------+-------------------------------+-------------------------+
| Primary Goal        | Maximize ray traversal speed  | Minimize frame latency  |
| Update Frequency    | Once at scene load            | 60 - 240 times / second |
| Permissible Build T | 100 ms - 10 seconds           | < 1.0 millisecond       |
| Geometry Status     | Immobile, immutable           | Continuously moving     |
| Tree Strategy       | Full Offline SAH / LBVH       | Dynamic Tree Refitting &|
|                     |                               | Predictive Fattening    |
+-----------------------------------------------------------------------------+
```

A physics engine cannot afford to rebuild a million-node BVH from scratch every single frame. Doing so on the CPU exhausts frame budgets; doing so on the GPU consumes substantial PCIe bandwidth and power.

To achieve sustained real-time performance, physics engines utilize **Dynamic Bounding Volume Trees** that adapt incrementally to motion.

---

## 10.2 Bottom-Up AABB Refitting and Tree Degradation

The simplest strategy for handling moving geometry is **Tree Refitting**.

If the topological connectivity of the tree (which node is a child of which parent) is held constant, moving primitives do not require reorganizing tree pointers. Instead, the engine updates the bounding boxes in place.

```
                    BOTTOM-UP AABB REFITTING PASS
                    
                              [ Root AABB ]  <-- Recomputed last
                               /         \
                              /           \
                       [ Node 1 ]       [ Node 2 ]  <-- Recomputed second
                        /      \         /      \
                      [L_A]   [L_B]    [L_C]   [L_D] <-- Updated first from
                      Prim A  Prim B   Prim C  Prim D    moving bodies!
```

### 10.2.1 The Post-Order Refitting Pass

Refitting operates as a bottom-up post-order traversal:
1. **Leaf Update:** For each leaf node $l \in \mathcal{V}_{\text{leaf}}$, recompute its AABB directly from the transformed geometry of its physical primitive:
   $$\mathcal{B}(l) = \text{AABB}(\text{Primitive}_l)$$
2. **Bottom-Up Propagation:** For each internal node $v \in \mathcal{V}_{\text{internal}}$ whose children have both been updated, recompute its bounding box as the exact union of its children:
   $$\boxed{\mathcal{B}(v) = \mathcal{B}(\text{LeftChild}(v)) \cup \mathcal{B}(\text{RightChild}(v))}$$

### 10.2.2 The Phenomenon of Tree Degradation

While refitting runs in strictly linear $\mathcal{O}(N)$ time with zero memory allocations, it suffers from a fatal degenerative illness: **Tree Degradation**.

When the tree was initially constructed, primitives were clustered based on spatial proximity. But as time progresses:
- Primitive $A$ travels to the left; Primitive $B$ travels to the right.
- Because they share parent Node 1, Node 1's bounding box must stretch continuously across the entire distance separating them!
- Eventually, Node 1 encloses an enormous empty void.

```
                    THE DEGENERATIVE SWELLING OF REFITTED BOXES
                    
       Initial State (Frame 0):                After Motion (Frame 500):
          Node 1: [A B] (Compact)                 Node 1: [ A .............. B ]
                                                  (Enormous empty box spanning
                                                   the entire world!)
```

Within a few seconds of free motion, the total tree surface area $\text{Cost}(\mathcal{T})$ swells by **$300\%\text{ to }1{,}000\%$**, causing broadphase overlap queries to slow down to a crawl!

---

## 10.3 Node Fattening and Velocity-Predictive Margins

In 2009, Blizzard and Box2D architect **Erin Catto** introduced a profound breakthrough that eliminated the need to refit or reinsert moving objects every frame: **Node Fattening with Velocity Prediction**.

```
                         NODE FATTENING ARCHITECTURE
                         
                    +------------------------------------+
                    |  Fattened Leaf AABB (In Tree)      |
                    |                                    |
                    |      +----------------------+      |
                    |      |  Actual Moving Body  |      |
                    |      |  (Frame t)           |      |
                    |      +----------------------+      |
                    |                 |                  |
                    |                 v Velocity Vector  |
                    |                 +----------------+ |
                    |                 | Body at t + dt | |
                    |                 +----------------+ |
                    +------------------------------------+
                    
  - Bounding box in the tree is ENLARGED by Margin delta + Velocity prediction.
  - As long as the moving body stays INSIDE the fattened box:
    --> ZERO TREE UPDATES! ZERO REFITS! ZERO CPU WORK!
```

### 10.3.1 The Fattening Formula

Instead of fitting leaf bounding boxes tightly to the current primitive geometry, the dynamic tree inflates each leaf by:
1. A **Uniform Safety Margin $\delta$** (typically $\delta \approx 0.1\text{ to }0.2\text{ meters}$).
2. A **Velocity-Predictive Displacement Vector $\mathbf{v} \Delta t$** multiplied by a lookahead multiplier $\alpha \approx 2.0\text{ to }4.0$:

$$\mathbf{d}_{\text{predict}} = \alpha \, \mathbf{v} \Delta t$$

The fattened leaf bounds $[\mathbf{min}_{\text{fat}}, \mathbf{max}_{\text{fat}}]$ are computed as:

$$\boxed{\mathbf{min}_{\text{fat}} = \mathbf{min}_{\text{prim}} - \delta \mathbf{1} + \min(\mathbf{0}, \, \mathbf{d}_{\text{predict}})}$$

$$\boxed{\mathbf{max}_{\text{fat}} = \mathbf{max}_{\text{prim}} + \delta \mathbf{1} + \max(\mathbf{0}, \, \mathbf{d}_{\text{predict}})}$$

### 10.3.2 The Zero-Update Invariant

At every simulation step, the physics engine evaluates:

$$\text{Contains}(\mathcal{B}_{\text{fat}}, \, \text{AABB}_{\text{current}})$$

- **If the current primitive AABB is still fully enclosed within $\mathcal{B}_{\text{fat}}$:**
  **DO ABSOLUTELY NOTHING.** The tree is unchanged! No node refits, no parent adjustments, no memory writes.
- **Only when the primitive breaks through the boundary of $\mathcal{B}_{\text{fat}}$:**
  The leaf is removed from the tree, assigned a newly expanded fattened box, and reinserted using the Surface Area Heuristic.

In typical physics simulations (rigid bodies settling, rolling, or sliding), **over $98\%$ of all bodies remain inside their fattened leaves every frame**. The computational cost of tree maintenance drops by nearly two orders of magnitude!

---

## 10.4 Dynamic Incremental Insertion via Surface Area Heuristic

When a leaf breaks its fattening margin or a new entity is spawned into the world, it must be inserted into the existing dynamic tree without rebuilding the hierarchy from scratch.

Erin Catto formalized the **Greedy SAH Branch-and-Bound Insertion Algorithm**.

```
                   INCREMENTAL LEAF INSERTION SEARCH
                   
                              ( Node 0 )
                               /      \
                             (L)      (R)
                             / \      / \
                            *   *    *   *
                            
  - To insert New Leaf N, we search for the best sibling S in the tree.
  - At each node, evaluate the cost of:
    1. Making S the sibling of N (creating new parent).
    2. Descending into Left child.
    3. Descending into Right child.
  - Choose the branch that minimizes total surface area growth!
```

### 10.4.1 Insertion Cost Metric

Let $\text{leaf}_{\text{new}}$ be the new node to insert with bounding box $\mathcal{B}_{\text{new}}$.
If we select an existing node $S \in \mathcal{V}$ to be the sibling of $\text{leaf}_{\text{new}}$, a new internal parent node $P_{\text{new}}$ is created whose children are $S$ and $\text{leaf}_{\text{new}}$.

The surface area of this new parent is:
$$\mathcal{B}_{P_{\text{new}}} = \mathcal{B}_S \cup \mathcal{B}_{\text{new}}$$
$$\text{Cost}_{\text{direct}} = \text{SA}(\mathcal{B}_{P_{\text{new}}})$$

Furthermore, expanding this branch increases the bounding boxes of **all ancestor nodes** from $S$ up to the root:
$$\text{Cost}_{\text{ancestors}} = \sum_{A \in \text{Ancestors}(S)} \left( \text{SA}(\mathcal{B}_A \cup \mathcal{B}_{\text{new}}) - \text{SA}(\mathcal{B}_A) \right)$$

Total cost of choosing $S$ as sibling:

$$\boxed{\text{Cost}(S) = \text{SA}(\mathcal{B}_S \cup \mathcal{B}_{\text{new}}) + \sum_{A \in \text{Ancestors}(S)} \Delta \text{SA}(A)}$$

### 10.4.2 Branch-and-Bound Traversal Loop

Starting at the root, the insertion algorithm traverses down the tree using a priority queue or greedy heuristic:
```typescript
function insertLeaf(newLeafIndex: number): void {
  const newAABB = nodes[newLeafIndex].aabb;
  if (rootIndex === null) {
    rootIndex = newLeafIndex;
    return;
  }

  // 1. Search for best sibling starting at root
  let current = rootIndex;
  while (!nodes[current].isLeaf) {
    const left = nodes[current].left;
    const right = nodes[current].right;

    const area = surfaceArea(nodes[current].aabb);
    const combinedAABB = union(nodes[current].aabb, newAABB);
    const combinedArea = surfaceArea(combinedAABB);

    // Cost of creating a new parent for this node and newLeaf
    const costDirect = 2.0 * combinedArea;

    // Minimum cost push down to children
    const inheritanceCost = 2.0 * (combinedArea - area);

    // Cost of descending into left child
    let costLeft = inheritanceCost;
    if (nodes[left].isLeaf) {
      costLeft += surfaceArea(union(nodes[left].aabb, newAABB));
    } else {
      costLeft += surfaceArea(union(nodes[left].aabb, newAABB)) - surfaceArea(nodes[left].aabb);
    }

    // Cost of descending into right child
    let costRight = inheritanceCost;
    if (nodes[right].isLeaf) {
      costRight += surfaceArea(union(nodes[right].aabb, newAABB));
    } else {
      costRight += surfaceArea(union(nodes[right].aabb, newAABB)) - surfaceArea(nodes[right].aabb);
    }

    // Descend along the path of minimum cost
    if (costDirect < costLeft && costDirect < costRight) {
      break; // Found best sibling!
    }

    current = (costLeft < costRight) ? left : right;
  }

  const sibling = current;

  // 2. Create new internal parent and splice sibling and newLeaf into tree
  const oldParent = nodes[sibling].parent;
  const newParent = allocateNode();
  nodes[newParent].parent = oldParent;
  nodes[newParent].aabb = union(nodes[sibling].aabb, newAABB);
  nodes[newParent].left = sibling;
  nodes[newParent].right = newLeafIndex;
  nodes[sibling].parent = newParent;
  nodes[newLeafIndex].parent = newParent;

  if (oldParent !== null) {
    if (nodes[oldParent].left === sibling) nodes[oldParent].left = newParent;
    else nodes[oldParent].right = newParent;
  } else {
    rootIndex = newParent;
  }

  // 3. Walk back up to root, refitting bounding boxes and running tree rotations
  refitAndRotate(newParent);
}
```

---

## 10.5 Local Tree Rotations (Restructuring)

As objects move and are incrementally reinserted, the dynamic tree slowly loses balance and spatial coherence. Rather than rebuilding the tree, modern dynamic trees perform **local tree rotations** (analogous to AVL tree rotations) during the bottom-up refitting pass.

```
                     LOCAL TREE ROTATION (SWAP)
                     
             ( Node A )                              ( Node A )
              /      \                                /      \
          ( Node B )  ( Node C )                  ( Node D )  ( Node C )
           /      \                                /      \
       ( Node D ) ( Node E )                   ( Node B ) ( Node E )
                                                /      \
                                              ...      ...
                                              
  - If swapping Child C with Grandchild D reduces the total surface area:
    --> EXECUTE ROTATION!
    --> Tree quality is continuously healed in O(1) time per step!
```

### 10.5.1 The 4 Rotation Configurations

For any internal node $A$ with children $B$ and $C$, where child $B$ has children $D$ and $E$:
1. We evaluate the total surface area if child $C$ is swapped with grandchild $D$.
2. We evaluate the total surface area if child $C$ is swapped with grandchild $E$.
3. If either swap strictly reduces $\text{SA}(A) + \text{SA}(B)$, the swap is executed immediately!

This continuous, lock-free rotational healing guarantees that **a dynamic tree can run indefinitely for hours of simulation without ever needing a full rebuild**!

---

## 10.6 Dual-Tree Traversal for Broadphase Pair Queries

In a physics engine, we do not simply cast rays into a tree. We must discover **all pairs of overlapping dynamic bodies**:

$$\text{Find all } (i, j) \text{ such that } \text{AABB}_i \cap \text{AABB}_j \neq \emptyset$$

Testing every leaf against the tree individually takes $\mathcal{O}(N \log N)$ steps.
We can solve this query significantly faster by running a **Dual-Tree Traversal** (colliding the tree against itself).

```
                      DUAL-TREE TRAVERSAL RECURSION
                      
                           Collide( Node_A, Node_B )
                                       |
                +----------------------+----------------------+
                |                                             |
     Node_A overlaps Node_B?                       Bounding Boxes Disjoint?
                |                                             |
               YES                                       TERMINATE!
                |                                    (Prune entire branch!)
    +-----------+-----------+
    |                       |
 Both Leaves?       At least one is Internal?
    |                       |
REPORT PAIR!        Descend LARGER node:
                    If SA(A) > SA(B):
                      Collide( A.left,  B )
                      Collide( A.right, B )
                    Else:
                      Collide( A, B.left  )
                      Collide( A, B.right )
```

### 10.6.1 The Dual-Tree Algorithm

```typescript
function collideTrees(nodeA: number, nodeB: number, pairCallback: (idA: number, idB: number) => void): void {
  if (nodeA === nodeB) {
    // Self-collision of an internal node with itself
    const node = nodes[nodeA];
    if (node.isLeaf) return;
    collideTrees(node.left, node.left, pairCallback);
    collideTrees(node.right, node.right, pairCallback);
    collideTrees(node.left, node.right, pairCallback);
    return;
  }

  // 1. Box-Box Overlap Check
  if (!aabbIntersectsAABB(nodes[nodeA].aabb, nodes[nodeB].aabb)) {
    return; // Prune branch!
  }

  // 2. Both nodes are leaves: Contact found!
  if (nodes[nodeA].isLeaf && nodes[nodeB].isLeaf) {
    pairCallback(nodes[nodeA].primitiveId, nodes[nodeB].primitiveId);
    return;
  }

  // 3. Descend the node with larger surface area
  if (nodes[nodeB].isLeaf || (!nodes[nodeA].isLeaf && surfaceArea(nodes[nodeA].aabb) >= surfaceArea(nodes[nodeB].aabb))) {
    collideTrees(nodes[nodeA].left, nodeB, pairCallback);
    collideTrees(nodes[nodeA].right, nodeB, pairCallback);
  } else {
    collideTrees(nodeA, nodes[nodeB].left, pairCallback);
    collideTrees(nodeA, nodes[nodeB].right, pairCallback);
  }
}
```

By descending the larger bounding box first, dual-tree traversal maximizes early pruning, reducing all-pairs collision broadphase from $\mathcal{O}(N^2)$ down to **$\mathcal{O}(N \log N)$ or $\mathcal{O}(N)$**!

---

## 10.7 Ten Step-by-Step Worked Examples

### Worked Example 10.1: Calculating Fattened Leaf AABB
**Problem:** A moving rigid body has current bounds $\mathbf{min} = (1.0, 2.0, -0.5)^T$ and $\mathbf{max} = (3.0, 4.0, 1.5)^T$.
Its linear velocity is $\mathbf{v} = (5.0, -2.0, 0.0)^T\text{ m/s}$.
Physics time step is $\Delta t = 0.01667\text{ s}$ ($60\text{ Hz}$).
Safety margin is $\delta = 0.1\text{ m}$, and velocity lookahead multiplier is $\alpha = 2.0$.
Compute the fattened leaf bounds $[\mathbf{min}_{\text{fat}}, \mathbf{max}_{\text{fat}}]$.

**Solution:**
1. Predicted displacement vector:
   $$\mathbf{d} = \alpha \, \mathbf{v} \Delta t = 2.0 \times \begin{pmatrix} 5.0 \\ -2.0 \\ 0.0 \end{pmatrix} \times 0.01667 \approx \begin{pmatrix} 0.1667 \\ -0.0667 \\ 0.0000 \end{pmatrix}\text{ m}$$
2. Component-wise displacement min/max:
   - X-axis: $d_x = +0.1667 > 0 \implies \min(0, d_x) = 0.0, \max(0, d_x) = +0.1667$.
   - Y-axis: $d_y = -0.0667 < 0 \implies \min(0, d_y) = -0.0667, \max(0, d_y) = 0.0$.
   - Z-axis: $d_z = 0.0 \implies \min(0, d_z) = 0.0, \max(0, d_z) = 0.0$.
3. Compute $\mathbf{min}_{\text{fat}}$:
   $$\min_{\text{fat}, x} = \min_x - \delta + \min(0, d_x) = 1.0 - 0.1 + 0.0 = 0.90\text{ m}$$
   $$\min_{\text{fat}, y} = \min_y - \delta + \min(0, d_y) = 2.0 - 0.1 - 0.0667 = 1.8333\text{ m}$$
   $$\min_{\text{fat}, z} = \min_z - \delta + \min(0, d_z) = -0.5 - 0.1 + 0.0 = -0.60\text{ m}$$
   $$\mathbf{min}_{\text{fat}} = (0.9000, 1.8333, -0.6000)^T\text{ m}$$
4. Compute $\mathbf{max}_{\text{fat}}$:
   $$\max_{\text{fat}, x} = \max_x + \delta + \max(0, d_x) = 3.0 + 0.1 + 0.1667 = 3.2667\text{ m}$$
   $$\max_{\text{fat}, y} = \max_y + \delta + \max(0, d_y) = 4.0 + 0.1 + 0.0 = 4.10\text{ m}$$
   $$\max_{\text{fat}, z} = \max_z + \delta + \max(0, d_z) = 1.5 + 0.1 + 0.0 = 1.60\text{ m}$$
   $$\mathbf{max}_{\text{fat}} = (3.2667, 4.1000, 1.6000)^T\text{ m}$$
5. As long as the body travels with this velocity, it will remain safely inside this box for the next 2 frames without triggering any tree updates!

---

### Worked Example 10.2: Zero-Update Evaluation Across 3 Frames
**Problem:** In Example 10.1, the body moves by $\Delta \mathbf{x} = \mathbf{v} \Delta t = (0.0833, -0.0333, 0.0)^T$ each frame.
Evaluate whether tree updates occur on Frame 1, Frame 2, and Frame 3.

**Solution:**
1. **Frame 1:**
   $$\mathbf{min}_1 = (1.0 + 0.0833, 2.0 - 0.0333, -0.5) = (1.0833, 1.9667, -0.50)$$
   $$\mathbf{max}_1 = (3.0833, 3.9667, 1.50)$$
   Compare to fattened bounds:
   $1.0833 \ge 0.90$ (Pass), $1.9667 \ge 1.8333$ (Pass), $-0.5 \ge -0.6$ (Pass).
   $3.0833 \le 3.2667$ (Pass), $3.9667 \le 4.10$ (Pass), $1.5 \le 1.6$ (Pass).
   Fully inside $\implies$ **ZERO UPDATES!**
2. **Frame 2:**
   $$\mathbf{min}_2 = (1.1667, 1.9333, -0.50), \quad \mathbf{max}_2 = (3.1667, 3.9333, 1.50)$$
   $3.1667 \le 3.2667$ (Pass). Fully inside $\implies$ **ZERO UPDATES!**
3. **Frame 3:**
   $$\mathbf{max}_3 = (3.0 + 3 \times 0.0833, \dots) = (3.2500, \dots)$$
   Still inside ($3.2500 \le 3.2667$). **ZERO UPDATES!**
   The fattened leaf absorbed 3 frames of continuous motion with zero tree refits.

---

### Worked Example 10.3: SAH Sibling Selection for Incremental Insertion
**Problem:** A dynamic tree has root $P$ with left child $L$ and right child $R$.
- Node $P$: Bounds $[0, 10] \times [0, 10] \times [0, 10]$, $\text{SA}(P) = 600$.
- Node $L$: Bounds $[0, 4] \times [0, 10] \times [0, 10]$, $\text{SA}(L) = 2(40 + 100 + 40) = 360$.
- Node $R$: Bounds $[6, 10] \times [0, 10] \times [0, 10]$, $\text{SA}(R) = 360$.
A new leaf $N$ is inserted with bounds $[1, 3] \times [1, 3] \times [1, 3]$ ($\text{SA}(N) = 24$).
Evaluate the cost of inserting $N$ as sibling of $L$ vs sibling of $R$.

**Solution:**
1. **Candidate 1: Sibling of Left Child $L$:**
   $$\text{AABB}(L \cup N) = [0, 4] \times [0, 10] \times [0, 10] \quad (\text{Since } [1, 3] \subset [0, 4] \text{ and } [1, 3] \subset [0, 10])$$
   Notice: Leaf $N$ is completely enclosed inside $L$'s current bounds!
   $$\text{SA}(L \cup N) = \text{SA}(L) = 360$$
   Increase in surface area:
   $$\Delta \text{SA}(L) = 360 - 360 = 0!$$
   $$\Delta \text{Cost}(L) = 360 + 0 = 360$$
2. **Candidate 2: Sibling of Right Child $R$:**
   $$\text{AABB}(R \cup N) = [1, 10] \times [0, 10] \times [0, 10] \quad (\text{Width expands from } 4 \text{ to } 9\text{ m}!)$$
   $$\text{SA}(R \cup N) = 2(9 \times 10 + 10 \times 10 + 10 \times 9) = 2(90 + 100 + 90) = 2(280) = 560$$
   Increase in surface area:
   $$\Delta \text{SA}(R) = 560 - 360 = 200!$$
   $$\Delta \text{Cost}(R) = 560 + 200 = 760$$
3. **Decision:**
   Candidate 1 ($\Delta \text{Cost} = 360$) is far lower than Candidate 2 ($760$).
   The algorithm selects $L$ as the sibling, preserving spatial clustering!

---

### Worked Example 10.4: Tree Rotation (Restructuring) Surface Area Reduction
**Problem:** In a dynamic tree, Node $A$ has children $B$ and $C$.
Child $B$ has children $D$ and $E$.
Surface areas in the current configuration:
$\text{SA}(B) = 150$, $\text{SA}(C) = 100$, $\text{SA}(D) = 60$, $\text{SA}(E) = 120$.
Current local area sum:
$$\text{Area}_{\text{current}} = \text{SA}(B) + \text{SA}(A) = 150 + \text{SA}(A)$$
Suppose we evaluate swapping child $C$ with grandchild $D$:
New bounding box of $B$ would become $C \cup E$, with surface area $\text{SA}(C \cup E) = 110$.
Evaluate whether the swap should be executed.

**Solution:**
1. Current surface area of Node $B$:
   $$\text{SA}(B)_{\text{old}} = \text{SA}(D \cup E) = 150$$
2. Proposed surface area of Node $B$ after swapping $C$ and $D$:
   $$\text{SA}(B)_{\text{new}} = \text{SA}(C \cup E) = 110$$
3. Surface area of parent $A$ ($B \cup C \cup D \cup E$) is identical before and after the swap.
4. Difference in surface area:
   $$\Delta \text{SA} = \text{SA}(B)_{\text{new}} - \text{SA}(B)_{\text{old}} = 110 - 150 = -40\text{ m}^2$$
5. Because $\Delta \text{SA} = -40 < 0$, **the rotation strictly improves tree quality!**
   The rotation is executed immediately.

---

### Worked Example 10.5: Dual-Tree Traversal Pruning
**Problem:** Two dynamic trees $\mathcal{T}_A$ and $\mathcal{T}_B$ each contain 100 objects.
Tree $\mathcal{T}_A$ is located in the positive octant ($x \ge 5$).
Tree $\mathcal{T}_B$ is located in the negative octant ($x \le -5$).
Trace the root-level call `collideTrees(RootA, RootB)` and determine the total number of box overlap tests.

**Solution:**
1. Call `collideTrees(RootA, RootB)`.
2. Test box overlap:
   $$\mathcal{B}(\text{RootA})_{\min, x} = 5.0, \quad \mathcal{B}(\text{RootB})_{\max, x} = -5.0$$
   $$\mathcal{B}(\text{RootA})_{\min, x} \le \mathcal{B}(\text{RootB})_{\max, x} \iff 5.0 \le -5.0 \quad (\mathbf{FALSE!})$$
3. Because the roots do not overlap along the x-axis, the test returns `false` immediately!
4. **Total tests:** Exactly **1 box-box test**!
   All $100 \times 100 = 10{,}000$ pairwise object checks are pruned in a single operation!

---

### Worked Example 10.6: Dual-Tree Self-Collision of a Single Tree
**Problem:** A dynamic tree has Root with children $L$ and $R$.
Explain how `collideTrees(Root, Root)` avoids duplicate pair testing ($(A, B)$ and $(B, A)$) and self-testing ($(A, A)$).

**Solution:**
1. A node does not collide with itself ($A \leftrightarrow A$ is trivial).
2. The self-collision of an internal node $P$ decomposes into:
   - Self-collision of left subtree: `collideTrees(P.left, P.left)`
   - Self-collision of right subtree: `collideTrees(P.right, P.right)`
   - Cross-collision between subtrees: `collideTrees(P.left, P.right)`
3. Because we only call cross-collision once (`(P.left, P.right)` and never `(P.right, P.left)`), every pair is tested **at most once**, and no body is ever tested against itself!

---

### Worked Example 10.7: Dynamic Free-List Node Pool Allocation
**Problem:** A dynamic tree uses a pre-allocated array of 1024 nodes with a free-list stack.
Show how `allocateNode()` and `freeNode(index)` operate in $\mathcal{O}(1)$ time with zero garbage collection.

**Solution:**
```typescript
class NodePool {
  private freeStack: number[] = [];
  constructor(size: number) {
    for (let i = size - 1; i >= 0; i--) this.freeStack.push(i);
  }
  allocateNode(): number {
    if (this.freeStack.length === 0) throw new Error("Pool exhausted");
    return this.freeStack.pop()!; // O(1)
  }
  freeNode(index: number): void {
    this.freeStack.push(index); // O(1)
  }
}
```
Zero heap allocations, zero garbage collection pauses!

---

### Worked Example 10.8: Velocity-Predictive Lookahead Tuning ($\alpha$)
**Problem:** A physics simulation runs at $\Delta t = 0.01667\text{ s}$.
If an object moves at $v = 30\text{ m/s}$ (fast racing car), compare leaf fattening size for $\alpha = 1.0$ vs $\alpha = 4.0$.

**Solution:**
1. Distance per frame:
   $$\Delta x = v \Delta t = 30 \times 0.01667 = 0.50\text{ m}$$
2. For $\alpha = 1.0$:
   $$d_{\text{predict}} = 1.0 \times 0.50 = 0.50\text{ m}$$
   The fattened box lasts only 1 frame before breaking out!
3. For $\alpha = 4.0$:
   $$d_{\text{predict}} = 4.0 \times 0.50 = 2.0\text{ m}$$
   The fattened box encompasses the next 4 frames of continuous travel! Tree updates occur only once every 4 frames (a $75\%$ reduction in tree work).

---

### Worked Example 10.9: Refitting Speed vs Full Rebuild Speed
**Problem:** In a benchmark with $N = 10{,}000$ dynamic rigid bodies:
- Full SAH rebuild takes $12\text{ ms}$.
- Bottom-up refitting takes $0.4\text{ ms}$.
- Predictive leaf fattening takes $0.05\text{ ms}$ on non-breakout frames.
Calculate the CPU frame time savings over a 60-frame second if $95\%$ of frames use fattening and $5\%$ use refitting.

**Solution:**
1. Cost with full rebuild every frame:
   $$\text{Cost}_{\text{rebuild}} = 60 \times 12\text{ ms} = 720\text{ ms/sec} \quad (72\% \text{ of entire second!})$$
2. Cost with Dynamic Tree (fattening + refitting):
   - 57 fattened frames: $57 \times 0.05\text{ ms} = 2.85\text{ ms}$.
   - 3 refit frames: $3 \times 0.4\text{ ms} = 1.20\text{ ms}$.
   $$\text{Cost}_{\text{dynamic}} = 2.85 + 1.20 = 4.05\text{ ms/sec} \quad (0.4\% \text{ of entire second!})$$
3. **Speedup:**
   $$\frac{720\text{ ms}}{4.05\text{ ms}} \approx \mathbf{177.8\times\text{ faster!}}$$

---

### Worked Example 10.10: Descending the Larger Node in Dual-Tree Traversal
**Problem:** In `collideTrees(NodeA, NodeB)`, Node $A$ has volume $1000\text{ m}^3$ ($\text{SA} = 600$), while Node $B$ has volume $1\text{ m}^3$ ($\text{SA} = 6$).
Why must the algorithm descend Node $A$ first rather than Node $B$?

**Solution:**
1. Node $A$ is massive; Node $B$ is tiny.
2. Splitting Node $B$ into two tiny sub-boxes does not reduce the overlap with giant Node $A$ (both children of $B$ will still overlap $A$).
3. Splitting Node $A$ divides the giant box into two smaller halves. Most likely, only one half overlaps tiny Node $B$, while the other half misses completely!
4. Descending the larger node maximizes the probability of **pruning an entire branch on the very next step**.

---

## 10.8 Ten Granular Solved Exercises

### Exercise 10.1: Fattened Margin Reversal on Direction Change
**Problem:** If an object moving at $+10\text{ m/s}$ along X suddenly bounces and moves at $-10\text{ m/s}$, does it immediately break out of its fattened leaf?

**Solution:**
Yes. Because the velocity prediction expanded the box in the $+x$ direction, reversing direction to $-x$ causes the primitive to move backward and cross the $-\delta$ margin within $1\text{ to }2$ frames, triggering an immediate re-fattening in the new direction.

---

### Exercise 10.2: Dual-Tree Worst-Case Complexity
**Problem:** What is the worst-case time complexity of dual-tree traversal if all $N$ bounding boxes overlap?

**Solution:**
$\mathcal{O}(N^2)$. If every object overlaps every other object, every pair of leaves must be visited, matching the theoretical lower bound of all-pairs.

---

### Exercise 10.3: Tree Depth Under Incremental Insertion
**Problem:** Does greedy SAH incremental insertion guarantee a balanced tree?

**Solution:**
No. Greedy insertion minimizes surface area, which can produce unbalanced trees if spatial clustering is asymmetric. However, surface area is the true predictor of traversal speed, not tree depth!

---

### Exercise 10.4: Dynamic Tree Node Deletion
**Problem:** Describe the steps to remove a leaf node from a dynamic binary tree.

**Solution:**
1. Identify parent $P$ and sibling $S$.
2. Grandparent $G = P.\text{parent}$.
3. Replace parent $P$ with sibling $S$ as child of $G$.
4. Free parent node $P$.
5. Walk up from $S$ to root, refitting bounding boxes.

---

### Exercise 10.5: Raycasting a Dynamic Tree vs Static BVH
**Problem:** Can the same iterative ray traversal algorithm from Chapter 7 be used on a dynamic tree?

**Solution:**
Yes! Because a dynamic tree is still a valid bounding volume hierarchy whose parent boxes strictly enclose all children, ray traversal works without any modification.

---

### Exercise 10.6: Cost Metric of Ancestor Expansion
**Problem:** In incremental insertion, why is $\Delta \text{SA}(A) = \text{SA}(\mathcal{B}_A \cup \mathcal{B}_{\text{new}}) - \text{SA}(\mathcal{B}_A)$ rather than the full surface area?

**Solution:**
Because parent node $A$ already exists in the tree. The ray traversal cost penalty incurred by inserting into this subtree is only the *increase* in surface area caused by the new leaf.

---

### Exercise 10.7: Fattening Margin for Stationary Objects
**Problem:** What is the fattened bounds formula for a stationary object ($\mathbf{v} = \mathbf{0}$)?

**Solution:**
$$\mathbf{min}_{\text{fat}} = \mathbf{min}_{\text{prim}} - \delta \mathbf{1}, \quad \mathbf{max}_{\text{fat}} = \mathbf{max}_{\text{prim}} + \delta \mathbf{1}$$
The box is uniformly inflated by $\delta$ on all 6 sides.

---

### Exercise 10.8: Cache Coherence of Pointer vs Dynamic Index Trees
**Problem:** Why do dynamic trees use 32-bit integer indices instead of raw memory pointers?

**Solution:**
Indices can be serialized directly, allow reallocating the backing array without invalidating pointers, and consume only 4 bytes instead of 8 bytes on 64-bit systems.

---

### Exercise 10.9: Rotation Check Frequency
**Problem:** How often should tree rotations be evaluated in a dynamic physics engine?

**Solution:**
During every bottom-up refit pass. Evaluating 2 rotation candidates takes only $\sim 20$ FLOPs per ancestor, keeping the tree continuously optimized.

---

### Exercise 10.10: Contact Pair Hash Set Deduplication
**Problem:** Why must the broadphase pair callback insert pairs into an unordered set using a symmetric key `hash(min(idA, idB), max(idA, idB))`?

**Solution:**
To ensure that contact pairs are strictly unique regardless of which order bodies are visited, preventing redundant narrowphase checks.

---

## 10.9 Chapter Summary and Bridge to Chapter 11

In this chapter, we solved the dynamic motion challenge:
1. **The Motion Dilemma:** Identified why rebuilding from scratch every frame is unfeasible for real-time physics.
2. **Refitting & Degradation:** Formulated linear $\mathcal{O}(N)$ refitting and diagnosed the swelling of bounding boxes.
3. **Predictive Leaf Fattening:** Implemented Erin Catto's $\delta + \alpha \mathbf{v} \Delta t$ margin that eliminates $98\%$ of tree updates.
4. **Greedy SAH Insertion & Rotations:** Developed incremental insertion and AVL-style rotational healing.
5. **Dual-Tree Traversal:** Solved all-pairs broadphase in $\mathcal{O}(N \log N)$ by colliding the dynamic tree against itself.

However, all collision queries so far have been **discrete**: testing geometry at frozen instants $t, t + \Delta t$. If an object moves faster than its thickness in one frame, it passes through obstacles undetected.
In **Chapter 11: Continuous Collision Detection (CCD) and Speculative Contacts**, we conquer the catastrophe of high-speed tunneling.
