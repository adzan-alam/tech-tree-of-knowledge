# Chapter 8: Hierarchical Broad-Phase: Dynamic Bounding Volume Hierarchies (BVH)

> *"Uniform spatial grids excel when particles are evenly distributed across a bounded arena. But when simulation worlds become vast and unevenly clustered — when thousands of debris fragments orbit a colossal starship across empty kilometers of space — grids drown in empty buckets. To conquer non-uniform spatial chaos, we construct hierarchical trees of nested bounding volumes."*

---

### Conceptual Architecture: The Binary Dynamic AABB Tree

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                   ROOT NODE: ENCLOSES ENTIRE SIMULATION UNIVERSE                         │
└─────────────────────────────────────────────┬────────────────────────────────────────────┘
                                              │ Binary Recursive Partitioning
                       ┌──────────────────────┴──────────────────────┐
                       ▼                                             ▼
┌─────────────────────────────────────────────┐ ┌──────────────────────────────────────────┐
│              INTERNAL NODE L                │ │            INTERNAL NODE R               │
│   AABB_L = Union(Leaf_1, Leaf_2)            │ │   AABB_R = Union(Leaf_3, Leaf_4)         │
└──────────────────────┬──────────────────────┘ └────────────────────┬─────────────────────┘
                       │                                             │
             ┌─────────┴─────────┐                         ┌─────────┴─────────┐
             ▼                   ▼                         ▼                   ▼
      ┌─────────────┐     ┌─────────────┐           ┌─────────────┐     ┌─────────────┐
      │   LEAF 1    │     │   LEAF 2    │           │   LEAF 3    │     │   LEAF 4    │
      │ Entity ID 0 │     │ Entity ID 1 │           │ Entity ID 2 │     │ Entity ID 3 │
      │  Fat AABB   │     │  Fat AABB   │           │  Fat AABB   │     │  Fat AABB   │
      └─────────────┘     └─────────────┘           └─────────────┘     └─────────────┘
```

---

## 8.1 The Failure of Uniform Grids in Non-Uniform Worlds

In Chapter 7, we saw that a uniform grid achieves $\mathcal{O}(N)$ average complexity under one crucial assumption: **spatial homogeneity**.
However, real-world simulations routinely violate this assumption:
- **Massive Spatial Scale Disparity:** An open-world RPG map spans $10,000\text{ m} \times 10,000\text{ m}$, but $95\%$ of characters, physics props, and projectiles crowd into a dense castle courtyard of $50\text{ m} \times 50\text{ m}$.
- **Multi-Scale Body Dimensions:** A flight simulator contains tiny bullets ($r = 0.02\text{ m}$) flying alongside an aircraft carrier ($L = 300\text{ m}$).

If we tune a uniform grid to the small bullet ($\Delta s = 0.04\text{ m}$), the aircraft carrier spans $7,500\text{ cells}$ in length, causing billions of empty buckets.
If we tune the grid to the aircraft carrier ($\Delta s = 300\text{ m}$), all 500 bullets in a dogfight fall into the exact same cell, causing the grid to collapse back into $\mathcal{O}(N^2)$ brute force.

**The Solution:** Hierarchical spatial partitioning, where spatial resolution dynamically conforms to entity density.

---

## 8.2 Dynamic Bounding Volume Hierarchy (BVH) Architecture

A **Dynamic Bounding Volume Hierarchy (BVH)** is a balanced binary tree where:
1. **Leaf Nodes:** Contain exactly one physical entity, its user data pointer, and its expanded **Fat AABB**.
2. **Internal Nodes:** Contain exactly two child pointers (`child1`, `child2`), a pointer to their parent node, and an enclosing AABB that is the exact union of its children's boxes:
   $$\mathbf{min}_{\text{parent}} = \min(\mathbf{min}_{\text{child1}}, \mathbf{min}_{\text{child2}})$$
   $$\mathbf{max}_{\text{parent}} = \max(\mathbf{max}_{\text{child1}}, \max(\mathbf{max}_{\text{child2}}))$$
3. **Root Node:** Encloses every single entity in the entire simulation.

### 8.2.1 Data-Oriented Flat Array Node Representation
Pointers (`Node* left, Node* right`) introduce memory fragmentation and pointer chasing.
Production engines (such as Box2D's `b2DynamicTree`) store the entire tree inside a single contiguous array of 32-byte structs, referencing children and parents via integer array indices:

```typescript
export interface BVHNode {
  // Bounding box in world space (16 bytes)
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  // Tree links (12 bytes)
  parentIndex: number;    // -1 if root
  child1Index: number;    // -1 if leaf
  child2Index: number;    // Next free node if in free list
  
  // Entity reference (4 bytes)
  entityId: number;       // Valid only on leaves
  height: number;         // 0 for leaf, max(child heights) + 1 for internal
}
```

This compact 32-byte layout allows **exactly two complete nodes to fit into a single 64-byte L1 CPU cache line**, enabling tree traversals to run at maximum memory bus saturation.

---

## 8.3 The Surface Area Heuristic (SAH) and Optimal Leaf Insertion

When inserting a new entity leaf $L$ into an existing BVH, where should it be placed?
If we attach it to an arbitrary node, the enclosing bounding boxes expand haphazardly, creating massive overlap between sibling branches and destroying culling performance.

To guide insertion mathematically, engines employ the **Surface Area Heuristic (SAH)**.

### 8.3.1 Geometric Probability and Perimeter Cost
In geometric probability theory (Crofton's formula), the probability that a random ray or moving test volume intersects a convex bounding box $\mathcal{B}$ is directly proportional to its surface area (in 3D) or its **perimeter** (in 2D):
$$\text{Cost}(\mathcal{B}) \propto \text{Perimeter}(\mathcal{B}) = 2\left( (\max_x - \min_x) + (\max_y - \min_y) \right)$$

When two nodes $A$ and $B$ are combined into a parent node $P = \text{Union}(A, B)$, the total traversal cost incurred by this subtree is:
$$\text{Cost}(P) = \text{Perimeter}(P) + \text{Cost}(A) + \text{Cost}(B)$$

```
Optimal Leaf Insertion Decision via Perimeter Expansion

   Existing Node N                               Candidate Insertion of Leaf L
     ┌───────────────┐                             ┌───────────────────────────────┐
     │    Node N     │                             │  Union(N, L)                  │
     │  Perimeter: 10│                             │                               │
     └───────────────┘                             │  ┌──────────┐   ┌──────────┐  │
                                                   │  │  Node N  │   │  Leaf L  │  │
                                                   │  └──────────┘   └──────────┘  │
                                                   └───────────────────────────────┘
                                                   Expanded Perimeter: 18
                                                   Direct Insertion Cost ΔC = 18 - 10 = 8
```

### 8.3.2 Branch-and-Bound Insertion Algorithm
To insert new leaf $L$:
1. Start at the root node.
2. At current node $N$, compute the cost of:
   - **Option 1 (Make Sibling):** Create a new parent node joining $N$ and $L$.
     $$\text{Cost}_{\text{direct}} = \text{Perimeter}(\text{Union}(N, L))$$
   - **Option 2 (Descend Left):** Pass $L$ down into `child1`.
     $$\text{Cost}_{\text{descend1}} = \Delta \text{Perimeter}(N) + \text{Cost}(child1, L)$$
   - **Option 3 (Descend Right):** Pass $L$ down into `child2`.
     $$\text{Cost}_{\text{descend2}} = \Delta \text{Perimeter}(N) + \text{Cost}(child2, L)$$
3. Greedy descent chooses the child that minimizes cost until a leaf is reached.
4. Walk back up to the root, refitting the AABB of every ancestor node:
   $$\mathbf{AABB}_{\text{ancestor}} = \text{Union}(\mathbf{AABB}_{\text{child1}}, \mathbf{AABB}_{\text{child2}})$$

---

## 8.4 Tree Balancing via AVL-Style Rotations

As physical entities move, leaves are continuously removed and re-inserted. Over thousands of frames, the tree becomes lopsided and unbalanced (one branch reaches depth 25 while another is depth 2), degenerating search complexity from $\mathcal{O}(\log N)$ toward $\mathcal{O}(N)$.

To maintain strict balance, after every insertion or refit, the engine inspects local subtree heights and performs **AVL-style Tree Rotations**.

```
Tree Rotation Architecture: Left-Left (LL) Rebalance

           Node A (Height 3)                                Node B (Height 2)
              /      \                                         /          \
        Node B (H 2)  Node C (H 0)      ====>            Node D (H 1)    Node A (H 1)
           /      \     (Leaf)                             /     \          /     \
     Node D (H 1)  Node E (H 0)                         ...      ...     Node E  Node C
```

If node $A$ has child $B$ and child $C$, and $\text{Height}(B) - \text{Height}(C) > 1$:
The engine tests swapping child $C$ with one of $B$'s children ($D$ or $E$).
If swapping reduces the total combined perimeter or restores height balance:
1. Update child pointers.
2. Re-point parent indices.
3. Recompute bounding boxes for $A$ and $B$.
This guarantees the tree depth remains bounded by:
$$\text{Depth} \le 1.44 \log_2(N)$$

---

## 8.5 Dual-Tree Collision Query Architecture

To discover all overlapping entity pairs without checking $\mathcal{O}(N^2)$ combinations, the engine performs a **Recursive Dual-Tree Traversal**:

```typescript
function queryCollisionPairs(nodeA: number, nodeB: number): void {
  // 1. Bounding box culling
  if (!aabbOverlap(tree[nodeA].aabb, tree[nodeB].aabb)) {
    return; // CULL SUBTREES! (Zero checks below this point)
  }

  const isLeafA = tree[nodeA].child1Index === -1;
  const isLeafB = tree[nodeB].child1Index === -1;

  // 2. Both nodes are leaves: Verified candidate pair!
  if (isLeafA && isLeafB) {
    if (tree[nodeA].entityId !== tree[nodeB].entityId) {
      emitCandidatePair(tree[nodeA].entityId, tree[nodeB].entityId);
    }
    return;
  }

  // 3. Split the larger node first to maximize culling
  if (isLeafA || (!isLeafB && tree[nodeB].surfaceArea > tree[nodeA].surfaceArea)) {
    queryCollisionPairs(nodeA, tree[nodeB].child1Index);
    queryCollisionPairs(nodeA, tree[nodeB].child2Index);
  } else {
    queryCollisionPairs(tree[nodeA].child1Index, nodeB);
    queryCollisionPairs(tree[nodeA].child2Index, nodeB);
  }
}
```

### 8.5.1 The Split-Larger-Node Invariant
When traversing two internal nodes $A$ and $B$, why split the node with the larger surface area first?
If $\text{Area}(B) \gg \text{Area}(A)$, node $B$'s bounding box covers a larger volume of empty space. Splitting $B$ into its two smaller children $B_1$ and $B_2$ immediately increases the probability that $A$ will miss at least one of them, terminating that entire recursive branch earlier!

---

## 8.6 Progressive Numerical Worked Examples

---

### Worked Example 8.1: Hand Construction of a 4-Leaf BVH
**Problem Statement:** Four stationary entities have the following AABBs:
- Leaf 1: $\mathbf{min}_1 = [1, 1]^T, \mathbf{max}_1 = [2, 2]^T$
- Leaf 2: $\mathbf{min}_2 = [2, 1]^T, \mathbf{max}_2 = [3, 2]^T$
- Leaf 3: $\mathbf{min}_3 = [8, 8]^T, \mathbf{max}_3 = [9, 9]^T$
- Leaf 4: $\mathbf{min}_4 = [9, 8]^T, \mathbf{max}_4 = [10, 9]^T$
1. Group the leaves into two natural parent clusters based on proximity.
2. Compute the bounding box for Internal Node $L$ (Leaves 1 & 2) and Internal Node $R$ (Leaves 3 & 4).
3. Compute the bounding box for the Root Node.
4. Calculate the 2D perimeter of each node in the hierarchy.

**Step-by-Step Mathematical Solution:**

**Step 1: Clustering.**
Leaves 1 and 2 lie adjacent along the $x$-axis at $y \in [1, 2]$.
Leaves 3 and 4 lie adjacent along the $x$-axis at $y \in [8, 9]$.
Distance between Cluster $(1, 2)$ and Cluster $(3, 4)$ is $\approx \sqrt{(8-3)^2 + (8-2)^2} = \sqrt{25 + 36} \approx 7.81\text{ m}$.
Natural pairing: Node $L = \text{Union}(1, 2)$, Node $R = \text{Union}(3, 4)$.

**Step 2: Internal nodes $L$ and $R$.**
- **Node $L$ (Union of Leaf 1 & Leaf 2):**
  $$\mathbf{min}_L = [\min(1, 2), \min(1, 1)]^T = [1.0, 1.0]^T\text{ m}$$
  $$\mathbf{max}_L = [\max(2, 3), \max(2, 2)]^T = [3.0, 2.0]^T\text{ m}$$
  Dimensions: $w = 2.0\text{ m}, h = 1.0\text{ m}$.
- **Node $R$ (Union of Leaf 3 & Leaf 4):**
  $$\mathbf{min}_R = [\min(8, 9), \min(8, 8)]^T = [8.0, 8.0]^T\text{ m}$$
  $$\mathbf{max}_R = [\max(9, 10), \max(9, 9)]^T = [10.0, 9.0]^T\text{ m}$$
  Dimensions: $w = 2.0\text{ m}, h = 1.0\text{ m}$.

**Step 3: Root node.**
$$\mathbf{min}_{\text{root}} = [\min(1, 8), \min(1, 8)]^T = [1.0, 1.0]^T\text{ m}$$
$$\mathbf{max}_{\text{root}} = [\max(3, 10), \max(2, 9)]^T = [10.0, 9.0]^T\text{ m}$$
Dimensions: $w = 9.0\text{ m}, h = 8.0\text{ m}$.

**Step 4: Perimeters.**
Formula: $\text{Perimeter} = 2(w + h)$.
- Leaf 1: $2(1 + 1) = 4.0\text{ m}$
- Leaf 2: $2(1 + 1) = 4.0\text{ m}$
- Leaf 3: $2(1 + 1) = 4.0\text{ m}$
- Leaf 4: $2(1 + 1) = 4.0\text{ m}$
- Node $L$: $2(2 + 1) = 6.0\text{ m}$
- Node $R$: $2(2 + 1) = 6.0\text{ m}$
- Root Node: $2(9 + 8) = 2(17) = 34.0\text{ m}$

---

### Worked Example 8.2: SAH Cost Evaluation for Leaf Insertion
**Problem Statement:** In the tree from Example 8.1, a new particle (Leaf 5) with box $\mathbf{min}_5 = [2.5, 1.5]^T, \mathbf{max}_5 = [3.5, 2.5]^T$ (dimensions $1 \times 1$, perimeter $4.0\text{ m}$) is inserted.
The algorithm evaluates two candidate insertion targets:
- Option A: Insert into Node $L$ (making Leaf 5 a sibling of Node $L$).
- Option B: Insert into Node $R$ (making Leaf 5 a sibling of Node $R$).
1. Compute the perimeter of $\text{Union}(L, \text{Leaf 5})$ and the change in perimeter $\Delta P_L$.
2. Compute the perimeter of $\text{Union}(R, \text{Leaf 5})$ and the change in perimeter $\Delta P_R$.
3. Based on the SAH metric, determine which branch the insertion algorithm selects.

**Step-by-Step Mathematical Solution:**

**Step 1: Option A (Insert into Node $L$).**
Node $L$ currently spans $[1, 1]$ to $[3, 2]$ (Perimeter $P_L = 6.0\text{ m}$).
Union of $L$ and Leaf 5 ($[2.5, 1.5]$ to $[3.5, 2.5]$):
$$\mathbf{min}_{\text{new}, L} = [\min(1.0, 2.5), \min(1.0, 1.5)]^T = [1.0, 1.0]^T\text{ m}$$
$$\mathbf{max}_{\text{new}, L} = [\max(3.0, 3.5), \max(2.0, 2.5)]^T = [3.5, 2.5]^T\text{ m}$$
Dimensions: $w = 3.5 - 1.0 = 2.5\text{ m}, h = 2.5 - 1.0 = 1.5\text{ m}$.
New Perimeter:
$$P_{\text{new}, L} = 2(2.5 + 1.5) = 2(4.0) = 8.00\text{ meters}$$
Cost expansion:
$$\Delta P_L = P_{\text{new}, L} - P_L = 8.00 - 6.00 = +2.00\text{ meters}$$

**Step 2: Option B (Insert into Node $R$).**
Node $R$ currently spans $[8, 8]$ to $[10, 9]$ (Perimeter $P_R = 6.0\text{ m}$).
Union of $R$ and Leaf 5 ($[2.5, 1.5]$ to $[3.5, 2.5]$):
$$\mathbf{min}_{\text{new}, R} = [\min(8.0, 2.5), \min(8.0, 1.5)]^T = [2.5, 1.5]^T\text{ m}$$
$$\mathbf{max}_{\text{new}, R} = [\max(10.0, 3.5), \max(9.0, 2.5)]^T = [10.0, 9.0]^T\text{ m}$$
Dimensions: $w = 10.0 - 2.5 = 7.5\text{ m}, h = 9.0 - 1.5 = 7.5\text{ m}$.
New Perimeter:
$$P_{\text{new}, R} = 2(7.5 + 7.5) = 2(15.0) = 30.00\text{ meters}$$
Cost expansion:
$$\Delta P_R = P_{\text{new}, R} - P_R = 30.00 - 6.00 = +24.00\text{ meters}$$

**Step 3: SAH decision.**
$$\Delta P_L = 2.00\text{ m} \ll \Delta P_R = 24.00\text{ m}$$
The algorithm decisively selects **Option A (Node $L$)**, expanding the tree by only $2.0\text{ m}$ of perimeter instead of an astronomical $24.0\text{ m}$.

---

### Worked Example 8.3: Ray-BVH Traversal Trace
**Problem Statement:** A ray with origin $\mathbf{o} = [0, 1.5]^T$ and direction $\mathbf{d} = [1, 0]^T$ (horizontal ray pointing right at $y = 1.5$) traverses the BVH from Example 8.1:
- Root: $[1, 1]$ to $[10, 9]$
- Node $L$: $[1, 1]$ to $[3, 2]$ (Children: Leaf 1 $[1, 1] \to [2, 2]$, Leaf 2 $[2, 1] \to [3, 2]$)
- Node $R$: $[8, 8]$ to $[10, 9]$ (Children: Leaf 3, Leaf 4)
Trace the traversal and list all node tests and culling events.

**Step-by-Step Mathematical Solution:**

**Step 1: Test Root Node ($[1, 1] \to [10, 9]$).**
Ray is at $y = 1.5$.
$y \in [1, 9]$ and ray travels from $x = 0$ toward $+x$.
Ray enters Root at $x = 1.0\text{ m} \implies$ **HIT!** Descend to children (Node $L$ and Node $R$).

**Step 2: Test Node $L$ ($[1, 1] \to [3, 2]$).**
Ray at $y = 1.5$ enters $y \in [1, 2]$ at $x = 1.0\text{ m} \implies$ **HIT!** Descend into Leaf 1 and Leaf 2:
- Test Leaf 1 ($[1, 1] \to [2, 2]$): Ray enters at $x = 1.0$, exits at $x = 2.0$. **HIT!** Emit Entity 0.
- Test Leaf 2 ($[2, 1] \to [3, 2]$): Ray enters at $x = 2.0$, exits at $x = 3.0$. **HIT!** Emit Entity 1.

**Step 3: Test Node $R$ ($[8, 8] \to [10, 9]$).**
Ray is at $y = 1.5$.
Node $R$ spans $y \in [8, 9]$.
Ray interval on $y$ is strictly $1.5 \ne [8, 9]$.
The ray misses Node $R$'s slab completely!
**Result:** Node $R$ is **CULLED IMMEDIATELY!**
Neither Leaf 3 nor Leaf 4 is ever evaluated.
The BVH pruned $50\%$ of the world's entities in a single bounding check.

---

### Worked Example 8.4: Performing an AVL Tree Rotation
**Problem Statement:** An internal node $A$ has height 3 with children $B$ (height 2) and $C$ (height 0).
Because $\text{Height}(B) - \text{Height}(C) = 2 > 1$, the tree is imbalanced.
Node $B$ has children $D$ (height 1) and $E$ (height 0).
Perimeters:
- $P(D) = 8.0\text{ m}, P(E) = 6.0\text{ m}, P(C) = 4.0\text{ m}$
- $P(\text{Union}(E, C)) = 9.0\text{ m}$
- $P(\text{Union}(D, C)) = 15.0\text{ m}$
1. Test rotation by swapping child $C$ with $E$.
2. Compute the new height of node $A$ and node $B$.
3. Verify that the tree balance is restored.

**Step-by-Step Mathematical Solution:**

**Step 1: Testing swap of $C$ and $E$.**
Original structure:
- Parent of $D$ and $E$ is $B$.
- Parent of $B$ and $C$ is $A$.
Rotated structure (swap $C$ and $E$):
- New node $B'$ joins child $D$ and child $A'$ (or joins child $E$ and $C$).
In a standard right-rotation:
Node $B$ becomes the new root of the subtree!
- Children of $B$: Child 1 is $D$ (height 1); Child 2 is $A$ (new internal node).
- Children of $A$: Child 1 is $E$ (height 0); Child 2 is $C$ (height 0).

**Step 2: Recomputing heights.**
- For node $A$:
  $$\text{Height}(A) = \max(\text{Height}(E), \text{Height}(C)) + 1 = \max(0, 0) + 1 = 1$$
- For node $B$:
  $$\text{Height}(B) = \max(\text{Height}(D), \text{Height}(A)) + 1 = \max(1, 1) + 1 = 2$$

**Step 3: Balance verification.**
The maximum height dropped from 3 to 2!
At node $B$: $|\text{Height}(D) - \text{Height}(A)| = |1 - 1| = 0 \le 1$.
At node $A$: $|\text{Height}(E) - \text{Height}(C)| = |0 - 0| = 0 \le 1$.
The subtree is **perfectly balanced**, cutting maximum leaf search depth by 1 level.

---

### Worked Example 8.5: Fat AABB Re-Insertion Decision Logic
**Problem Statement:** A physics particle has base AABB $\mathbf{min} = [10.0, 5.0]^T, \mathbf{max} = [11.0, 6.0]^T$.
Its current Fat AABB stored in the BVH leaf is:
$$\mathbf{min}_{\text{fat}} = [9.80, 4.80]^T\text{ m}, \quad \mathbf{max}_{\text{fat}} = [11.50, 6.20]^T\text{ m}$$
Across four consecutive simulation steps, the particle moves to the following positions:
- Tick 1: $[10.10, 5.05]^T$ to $[11.10, 6.05]^T$
- Tick 2: $[10.30, 5.10]^T$ to $[11.30, 6.10]^T$
- Tick 3: $[10.45, 5.15]^T$ to $[11.45, 6.15]^T$
- Tick 4: $[10.55, 5.20]^T$ to $[11.55, 6.20]^T$
For each tick, determine if the entity's true AABB is contained within $\mathbf{AABB}_{\text{fat}}$, and state whether a BVH re-insertion must be executed.

**Step-by-Step Mathematical Solution:**

Condition for containment: $\min_{\text{true}} \ge \min_{\text{fat}} \land \max_{\text{true}} \le \max_{\text{fat}}$.
- **Tick 1:**
  $\min = [10.10, 5.05] \ge [9.80, 4.80]$ (T)
  $\max = [11.10, 6.05] \le [11.50, 6.20]$ (T)
  **Result:** Contained. Zero BVH operations!
- **Tick 2:**
  $\min = [10.30, 5.10] \ge [9.80, 4.80]$ (T)
  $\max = [11.30, 6.10] \le [11.50, 6.20]$ (T)
  **Result:** Contained. Zero BVH operations!
- **Tick 3:**
  $\min = [10.45, 5.15] \ge [9.80, 4.80]$ (T)
  $\max = [11.45, 6.15] \le [11.50, 6.20]$ (T)
  **Result:** Contained. Zero BVH operations!
- **Tick 4:**
  $x_{\max} = 11.55\text{ m} > \max_{\text{fat}, x} = 11.50\text{ m}$ (**BREACHED!**)
  **Result:** Fat boundary breached! Extract leaf from BVH, compute new expanded Fat AABB with velocity extrapolation, re-insert with SAH, and refit ancestors.
*Performance Impact:* The tree was updated only once across 4 frames ($75\%$ reduction in tree write overhead).

---

### Worked Example 8.6: Dual-Tree Collision Traversal Step
**Problem Statement:** Two BVH subtrees $\mathcal{T}_A$ and $\mathcal{T}_B$ are queried for mutual collisions:
- Node $A$ (Internal): Box $[0, 0]$ to $[6, 6]$, Perimeter $P_A = 24\text{ m}$.
  Children: $A_1$ ($[0, 0] \to [3, 6]$), $A_2$ ($[3, 0] \to [6, 6]$).
- Node $B$ (Internal): Box $[4, 1]$ to $[10, 5]$, Perimeter $P_B = 20\text{ m}$.
  Children: $B_1$ ($[4, 1] \to [7, 5]$), $B_2$ ($[7, 1] \to [10, 5]$).
1. Check if Node $A$ and Node $B$ overlap.
2. Apply the "split larger node first" heuristic and determine which node is split.
3. Formulate the two recursive child query pairs.
4. Test both child pairs for bounding overlap and state which recursive branches survive.

**Step-by-Step Mathematical Solution:**

**Step 1: Node $A$ vs Node $B$ overlap check.**
$A$: $x \in [0, 6], y \in [0, 6]$
$B$: $x \in [4, 10], y \in [1, 5]$
- $x$: $\min(6, 10) - \max(0, 4) = 6 - 4 = +2.0\text{ m} > 0$ (Overlap)
- $y$: $\min(6, 5) - \max(0, 1) = 5 - 1 = +4.0\text{ m} > 0$ (Overlap)
Nodes $A$ and $B$ **OVERLAP**.

**Step 2: Split larger node.**
$P_A = 24.0\text{ m}$, $P_B = 20.0\text{ m}$.
Because $P_A > P_B$, **Node $A$ is split first**.

**Step 3: Two child query pairs.**
$$\text{Pair 1: } (A_1, B), \quad \text{Pair 2: } (A_2, B)$$

**Step 4: Overlap checks on child pairs.**
- **Pair 1: $A_1$ ($x \in [0, 3], y \in [0, 6]$) vs $B$ ($x \in [4, 10], y \in [1, 5]$):**
  $x$-overlap: $\max(A_1) = 3.0 < \min(B) = 4.0$.
  $x$-gap is $4.0 - 3.0 = 1.0\text{ m} > 0$.
  **Result:** Separated! **CULLED IMMEDIATELY!** (All leaves under $A_1$ are pruned).
- **Pair 2: $A_2$ ($x \in [3, 6], y \in [0, 6]$) vs $B$ ($x \in [4, 10], y \in [1, 5]$):**
  $x$: $\min(6, 10) - \max(3, 4) = 6 - 4 = 2.0\text{ m} > 0$ (Overlap)
  $y$: $\min(6, 5) - \max(0, 1) = 5 - 1 = 4.0\text{ m} > 0$ (Overlap)
  **Result:** Overlaps! Recurse on $(A_2, B)$.

---

### Worked Example 8.7: Flat Array BVH Memory Footprint
**Problem Statement:** A simulation maintains $N = 10,000$ active physical entities in a binary dynamic BVH.
1. In a full binary tree with $N$ leaves, calculate the number of internal nodes and the total node count $N_{\text{total}}$.
2. If each node struct requires 32 bytes of storage, compute the total array memory footprint in megabytes.
3. Compare this memory footprint to an un-indexed all-pairs matrix of size $N \times N$ storing 1-byte booleans.

**Step-by-Step Mathematical Solution:**

**Step 1: Total node count.**
For any strictly binary tree with $N$ leaves:
$$N_{\text{internal}} = N - 1 = 10,000 - 1 = 9,999\text{ internal nodes}$$
$$N_{\text{total}} = N_{\text{leaves}} + N_{\text{internal}} = 10,000 + 9,999 = 19,999\text{ nodes}$$
With a pool capacity safety margin of $2N = 20,000\text{ nodes}$:
$$N_{\text{allocated}} = 20,000\text{ nodes}$$

**Step 2: Array memory footprint.**
$$\text{Memory} = 20,000\text{ nodes} \times 32\text{ bytes/node} = 640,000\text{ bytes} \approx 625\text{ KB}$$
The entire BVH for 10,000 dynamic physical entities fits comfortably in less than $1\text{ MB}$ of memory!

**Step 3: Comparison with all-pairs matrix.**
An $N \times N$ adjacency matrix:
$$\text{Matrix Size} = 10,000 \times 10,000 \times 1\text{ byte} = 100,000,000\text{ bytes} \approx 95.37\text{ MB}$$
The BVH consumes **less than $1\%$ of the memory** of an adjacency matrix.

---

### Worked Example 8.8: Degenerate Tree vs Balanced Tree Complexity
**Problem Statement:** A poorly implemented BVH degenerates into a linked list (every internal node has 1 leaf and 1 internal child).
For $N = 1024$ leaves:
1. Compute the tree depth and search complexity for a single query in the degenerate tree.
2. Compute the tree depth and search complexity in a balanced BVH where $\text{Depth} = \lceil \log_2 N \rceil$.
3. Compute the ratio of operations between the degenerate tree and the balanced tree.

**Step-by-Step Mathematical Solution:**

**Step 1: Degenerate linked-list tree.**
$$\text{Depth}_{\text{degen}} = N = 1024$$
$$\text{Query Complexity} = \mathcal{O}(N) = 1024\text{ node evaluations}$$

**Step 2: Balanced binary BVH.**
$$\text{Depth}_{\text{balanced}} = \log_2(1024) = 10$$
$$\text{Query Complexity} = \mathcal{O}(\log_2 N) = 10 \times 2 = 20\text{ node evaluations}$$

**Step 3: Performance ratio.**
$$\text{Ratio} = \frac{1024}{20} = 51.2\times$$
The balanced tree runs **over 50 times faster** than the degenerate tree, illustrating why AVL tree rotations are critical.

---

### Worked Example 8.9: Incremental Refit vs Full Rebuild Cost
**Problem Statement:** A game world contains $N = 4000$ physics props.
- Method A (Full Rebuild): Re-creates the BVH from scratch each tick using top-down SAH partitioning ($\mathcal{O}(N \log N)$ complexity with constant $C_1 = 50\text{ cycles/node}$).
- Method B (Incremental Fat BVH): Only updates leaves that breach their Fat AABB margin ($5\%$ of entities per frame, each taking $\mathcal{O}(\log N)$ re-insertion cost with $C_2 = 120\text{ cycles/step}$).
1. Calculate the cycles required for Method A per frame.
2. Calculate the cycles required for Method B per frame.
3. Compute the cycle savings ratio of the incremental engine.

**Step-by-Step Mathematical Solution:**

**Step 1: Method A (Full rebuild).**
$$N \log_2 N = 4000 \times \log_2(4000) \approx 4000 \times 11.9658 \approx 47,863\text{ operations}$$
$$\text{Cycles}_A = 47,863 \times 50\text{ cycles} \approx 2,393,150\text{ CPU cycles} \approx 2.39\times 10^6\text{ cycles}$$

**Step 2: Method B (Incremental Fat AABB).**
Active re-insertions per frame: $5\%$ of $4000 = 200\text{ entities}$.
Each re-insertion travels tree depth $\log_2(4000) \approx 12$ levels:
$$\text{Operations}_B = 200 \times 12 = 2,400\text{ node evaluations}$$
$$\text{Cycles}_B = 2,400 \times 120\text{ cycles} = 288,000\text{ CPU cycles}$$

**Step 3: Cycle savings.**
$$\text{Ratio} = \frac{2,393,150}{288,000} \approx 8.31\times$$
Incremental Fat BVH updating runs **over $8\times$ faster**, freeing more than $2.1\text{ million CPU cycles}$ per frame for narrow-phase simulation.

---

### Worked Example 8.10: Complete BVH Lifecycle Trace
**Problem Statement:** An engine executes a complete BVH lifecycle for two dynamic bodies starting at $t = 0$:
- Body 1: $r = 0.5\text{ m}$, position $[2, 2]^T$, velocity $[0, 0]^T$
- Body 2: $r = 0.5\text{ m}$, position $[8, 2]^T$, velocity $[-120, 0]^T\text{ m/s}$ (fast projectile)
Timestep $\Delta t = 0.016667\text{ s}$, skin margin $\sigma = 0.10\text{ m}$.
1. Compute the Fat AABB for both bodies at $t = 0$.
2. Construct the Root node.
3. Advance simulation by one tick: Body 2 moves to $x = 8.0 - 120(0.016667) = 6.0\text{ m}$.
4. Check if Body 2 remains inside its Fat AABB.
5. Perform dual-tree collision query at the new state.

**Step-by-Step Mathematical Solution:**

**Step 1: Fat AABBs at $t = 0$.**
- Body 1 ($\mathbf{v} = [0, 0]$):
  Base box: $[1.5, 1.5]$ to $[2.5, 2.5]$.
  With skin $\sigma = 0.10$:
  $$\mathbf{AABB}_{\text{fat}, 1} = [1.40, 1.40]^T \text{ to } [2.60, 2.60]^T\text{ m}$$
- Body 2 ($\mathbf{v} = [-120, 0]^T$):
  Base box: $[7.5, 1.5]$ to $[8.5, 2.5]$.
  Velocity sweep: $\Delta x = -120 \times 0.016667 = -2.000\text{ m}$.
  Swept box: $[7.5 - 2.0, 1.5]$ to $[8.5, 2.5] = [5.50, 1.50]$ to $[8.50, 2.50]$.
  With skin $\sigma = 0.10$:
  $$\mathbf{AABB}_{\text{fat}, 2} = [5.40, 1.40]^T \text{ to } [8.60, 2.60]^T\text{ m}$$

**Step 2: Root node.**
$$\mathbf{AABB}_{\text{root}} = \text{Union}(\mathbf{AABB}_{\text{fat}, 1}, \mathbf{AABB}_{\text{fat}, 2}) = [1.40, 1.40]^T \text{ to } [8.60, 2.60]^T\text{ m}$$

**Step 3 & 4: Advance to $t = 1$ tick.**
Body 2 center moves to $x = 6.00\text{ m}, y = 2.00\text{ m}$.
Body 2 new base box: $[6.0 - 0.5, 2.0 - 0.5]$ to $[6.0 + 0.5, 2.0 + 0.5] = [5.50, 1.50]$ to $[6.50, 2.50]$.
Check against $\mathbf{AABB}_{\text{fat}, 2} = [5.40, 1.40]$ to $[8.60, 2.60]$:
$5.50 \ge 5.40$ (T) and $6.50 \le 8.60$ (T).
$1.50 \ge 1.40$ (T) and $2.50 \le 2.60$ (T).
**Result:** Body 2 is still **100% inside its Fat AABB**. Zero tree modifications required!

**Step 5: Collision query at $t = 1$ tick.**
Compare Leaf 1 and Leaf 2:
- Leaf 1: $[1.40, 1.40]$ to $[2.60, 2.60]$
- Leaf 2: $[5.40, 1.40]$ to $[8.60, 2.60]$
$x$-gap: $5.40 - 2.60 = 2.80\text{ m} > 0$.
**Result:** Separated! Zero collision candidates emitted. The pipeline executed with optimal efficiency.

---

## 8.7 Chapter Mastery Exercises

### Exercise 8.1 (Tier 1): Parent Node Bounding Box Union
Given Leaf $A$ with $\mathbf{min}_A = [2, 3]^T, \mathbf{max}_A = [5, 7]^T$ and Leaf $B$ with $\mathbf{min}_B = [4, 1]^T, \mathbf{max}_B = [8, 4]^T$, compute the union AABB of their parent node.

### Exercise 8.2 (Tier 1): Node Count for Large Worlds
In a robotics warehouse simulation with $N = 65,536$ inventory items, how many internal nodes and total nodes exist in a full binary BVH?

### Exercise 8.3 (Tier 2): 2D Surface Area Heuristic Metric
A candidate parent node has $x \in [-2, 6]$ and $y \in [1, 9]$. Compute its 2D perimeter metric $P$.

### Exercise 8.4 (Tier 2): Leaf Height Definition
What is the height of a leaf node in a dynamic BVH, and how is the height of an internal node defined recursively?

### Exercise 8.5 (Tier 3): Insertion Cost Comparison
A leaf of perimeter $6.0\text{ m}$ is evaluated for insertion into:
- Node 1: Current perimeter $12.0\text{ m}$, expanded union perimeter $15.0\text{ m}$.
- Node 2: Current perimeter $20.0\text{ m}$, expanded union perimeter $25.0\text{ m}$.
Compute the SAH cost expansion $\Delta P$ for both nodes and state the insertion choice.

### Exercise 8.6 (Tier 3): Degenerate Tree Height
If $N = 100$ nodes are inserted into a dynamic tree in strictly increasing coordinate order without tree rotations, what is the resulting tree height?

### Exercise 8.7 (Tier 4): Tree Rotation Invariant
Prove that performing an AVL-style tree rotation on an internal node does not alter the bounding volume of its parent node.

### Exercise 8.8 (Tier 4): Fat AABB Margin Sizing
A particle moves at maximum speed $v_{\max} = 10.0\text{ m/s}$ at $\Delta t = 0.016\text{ s}$.
If the engine developer wants the Fat AABB to remain valid for at least 3 simulation frames before requiring a re-insertion, what is the minimum skin margin $\sigma$ required?

### Exercise 8.9 (Tier 5): Parallel Multi-Threaded BVH Traversal
Explain how the recursive dual-tree traversal loop can be parallelized across multi-core CPUs by dispatching independent subtree pairs onto task work-stealing queues.

### Exercise 8.10 (Tier 5): BVH vs Spatial Hash Grid Decision Matrix
Construct a comprehensive decision matrix comparing Dynamic BVH vs Uniform Spatial Hash Grids across: memory footprint, handling of large scale disparities, dynamic insertion speed, ray-casting efficiency, and cache locality.

---

## 8.8 Complete Written Solutions to Mastery Exercises

### Solution to Exercise 8.1
Given $\mathbf{min}_A = [2, 3]^T, \mathbf{max}_A = [5, 7]^T$ and $\mathbf{min}_B = [4, 1]^T, \mathbf{max}_B = [8, 4]^T$:
$$\mathbf{min}_{\text{parent}} = \begin{bmatrix} \min(2, 4) \\ \min(3, 1) \end{bmatrix} = \begin{bmatrix} 2.0 \\ 1.0 \end{bmatrix}\text{ m}$$
$$\mathbf{max}_{\text{parent}} = \begin{bmatrix} \max(5, 8) \\ \max(7, 4) \end{bmatrix} = \begin{bmatrix} 8.0 \\ 7.0 \end{bmatrix}\text{ m}$$
Parent box: $[2.0, 1.0]^T$ to $[8.0, 7.0]^T\text{ m}$.

---

### Solution to Exercise 8.2
For $N = 65,536$ leaves in a binary tree:
$$N_{\text{internal}} = N - 1 = 65,536 - 1 = \mathbf{65,535\text{ internal nodes}}$$
$$N_{\text{total}} = N + (N - 1) = 65,536 + 65,535 = \mathbf{131,071\text{ total nodes}}$$

---

### Solution to Exercise 8.3
$x \in [-2, 6] \implies w = 6 - (-2) = 8.0\text{ m}$.
$y \in [1, 9] \implies h = 9 - 1 = 8.0\text{ m}$.
$$P = 2(w + h) = 2(8.0 + 8.0) = 2(16.0) = \mathbf{32.00\text{ meters}}$$

---

### Solution to Exercise 8.4
1. By convention, a **leaf node has height 0**:
   $$\text{Height}(\text{leaf}) = 0$$
2. An **internal node's height** is one plus the maximum of its children's heights:
   $$\text{Height}(N) = 1 + \max(\text{Height}(child1), \, \text{Height}(child2))$$

---

### Solution to Exercise 8.5
- Node 1: $\Delta P_1 = 15.0 - 12.0 = +3.00\text{ meters}$.
- Node 2: $\Delta P_2 = 25.0 - 20.0 = +5.00\text{ meters}$.
Comparing expansions: $\Delta P_1 = 3.0\text{ m} < \Delta P_2 = 5.0\text{ m}$.
The SAH algorithm selects **Node 1**, minimizing surface area growth.

---

### Solution to Exercise 8.6
Inserting sorted coordinates without balancing attaches each new node to the right-most leaf, degenerating into a singly-linked vine:
$$\text{Height} = N - 1 = 100 - 1 = \mathbf{99\text{ levels}}$$
(Compared to $\lceil \log_2 100 \rceil = 7$ levels in a balanced tree).

---

### Solution to Exercise 8.7
Let internal node $A$ have children $B$ and $C$.
The bounding box of $A$ is $\mathbf{AABB}_A = \text{Union}(\mathbf{AABB}_B, \mathbf{AABB}_C)$.
If $B$ has children $D$ and $E$, then by definition $\mathbf{AABB}_B = \text{Union}(\mathbf{AABB}_D, \mathbf{AABB}_E)$.
Substituting:
$$\mathbf{AABB}_A = \text{Union}(\text{Union}(\mathbf{AABB}_D, \mathbf{AABB}_E), \mathbf{AABB}_C)$$
By associativity of set union:
$$\mathbf{AABB}_A = \text{Union}(\mathbf{AABB}_D, \text{Union}(\mathbf{AABB}_E, \mathbf{AABB}_C))$$
A tree rotation merely re-associates the children (making $E$ and $C$ children of a new node, while $D$ remains a sibling).
Because the union of the three constituent bounding sets is mathematically identical, the outer bounding box of node $A$ remains **strictly invariant**. $\blacksquare$

---

### Solution to Exercise 8.8
Per-frame maximum displacement:
$$\Delta x_{\text{frame}} = v_{\max} \Delta t = 10.0\text{ m/s} \times 0.016\text{ s} = 0.160\text{ m}$$
Over 3 frames, total travel distance is:
$$\Delta x_{3\text{-frames}} = 3 \times 0.160\text{ m} = 0.480\text{ m}$$
Because the velocity-swept AABB already accounts for 1 frame of displacement ($0.16\text{ m}$), the remaining 2 frames must be absorbed by the skin margin $\sigma$:
$$\sigma \ge 2 \times \Delta x_{\text{frame}} = 2 \times 0.160\text{ m} = \mathbf{0.320\text{ meters}}$$

---

### Solution to Exercise 8.9
In parallel execution:
1. When recursive dual-tree traversal reaches depth 2 or 3, multiple independent node pairs $(N_i, N_j)$ have been generated.
2. Rather than recursing synchronously, each independent node pair is enqueued as an atomic task in a thread pool's lock-free work-stealing queue.
3. Worker threads pop node pairs and execute independent sub-tree descents in parallel without shared state or race conditions.
4. Each thread writes discovered candidate pairs to a thread-local candidate list, which are concatenated at the end of the broad phase.

---

### Solution to Exercise 8.10
**Comparison Matrix:**

| Evaluation Metric | Dynamic Bounding Volume Hierarchy (BVH) | Uniform Spatial Hash Grid |
|---|---|---|
| **Best-fit Environment** | Non-uniform clustering, sparse open worlds, extreme scale differences | Dense homogeneous particle fluids, granular matter, uniform speeds |
| **Memory Footprint** | $\mathcal{O}(N)$ strictly (32 bytes/node, zero empty bucket overhead) | $\mathcal{O}(N + M)$ (Allocates table size $M$ regardless of entity count) |
| **Object Scale Disparity** | Seamless ($\mathcal{O}(\log N)$ irrespective of object sizes) | Struggles (Large objects span hundreds of cells) |
| **Dynamic Insertion Speed** | Moderate ($\mathcal{O}(\log N)$ with SAH branch descent) | Ultra-fast ($\mathcal{O}(1)$ direct coordinate floor hash) |
| **Ray-Casting Traversal** | Superior ($\mathcal{O}(\log N)$ hierarchical bounding pruning) | Inferior (Must step ray DDA through every intermediate cell) |
| **Cache Locality** | High (Flat array index structure) | Highest (Contiguous prefix-sum array layouts) |
