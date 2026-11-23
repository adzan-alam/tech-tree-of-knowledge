# Chapter 1: The Geometry of Manipulation — Configuration Space $\mathcal{Q}$, Task Space $\mathcal{X}$, and Degrees of Freedom

---

## 1. The Layman's Genesis & Intuitive Overview

Consider an ordinary, everyday action: extending your hand across a breakfast table to pick up a coffee cup. To your visual cortex and conscious perception, this action appears remarkably simple. The cup occupies a fixed location in three-dimensional space—perhaps $40\text{ cm}$ forward, $10\text{ cm}$ to the right, and resting on a flat surface. Your hand moves smoothly toward that target coordinate, aligns its fingers, and closes around the handle. 

Yet beneath this seemingly effortless gesture lies a profound geometric duality that forms the cornerstone of all robotics and physical mechanics:
1. **The External World (Task Space $\mathcal{X}$):** Where the tool, cup, or end-effector lives. This is physical Euclidean three-dimensional space $\mathbb{R}^3$, combined with three rotational angles describing the cup's orientation, forming the six-dimensional Special Euclidean group $SE(3)$.
2. **The Internal World (Configuration Space $\mathcal{Q}$):** Where the biological joints or robotic electric servomotors live. The central nervous system does not "move the hand" by directly pulling on Cartesian coordinates; rather, it activates muscles across the shoulder joint (a 3-degree-of-freedom spherical joint), bends the elbow (a 1-degree-of-freedom revolute joint), rotates the forearm (a 1-degree-of-freedom revolute joint), and flexes the wrist (a 2-degree-of-freedom joint). 

Notice an astonishing physical reality: your hand can remain perfectly stationary on the table while you swivel your elbow high into the air or drop it down toward your ribs. The external pose in Task Space $\mathcal{X}$ remains identical, yet your internal motor state in Configuration Space $\mathcal{Q}$ is actively tracing a continuous curve!

```
       [ Configuration Space Q ]                     [ Task Space X = SE(3) ]
       Internal Joint Variables                      External World Coordinates
    (theta_1, theta_2, ..., theta_n)                    (x, y, z, roll, pitch, yaw)
                  │                                                 ▲
                  │                                                 │
                  │───────── Forward Kinematics f(q) ───────────────│
                  │         (Smooth, Deterministic, Unique)         │
                  │                                                 │
                  │◀─────── Inverse Kinematics f^(-1)(x) ───────────│
                            (Non-Linear, Multi-Valued,
                             Discontinuous, or Empty)
```

In robotics, this duality is known as the **Kinematic Duality**:
- **Forward Kinematics (FK):** Computing where the hand ends up given the angles of all motorized joints. This is a deterministic, smooth, and easily computable geometric mapping $f: \mathcal{Q} \to \mathcal{X}$.
- **Inverse Kinematics (IK):** Computing what angles the motorized joints must bend into to position the hand at a specified Cartesian target. This mapping $f^{-1}: \mathcal{X} \to 2^\mathcal{Q}$ is non-linear, multi-branched, computationally demanding, and often plagued by mechanical singularities.

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical formalization of mechanical articulation began during the First Industrial Revolution, driven by the need to synthesize complex mechanical linkages for steam engines, textile looms, and locomotive drivetrains.

In 1876, the German mechanical engineer **Franz Reuleaux** published his seminal treatise *The Kinematics of Machinery: Outlines of a Theory of Machines*. Reuleaux was the first to recognize that a machine is an assembly of resistant bodies ("links") connected by pairs of elements ("kinematic pairs") that constrain relative motion. Reuleaux classified joints into lower pairs (surface contact, such as revolute and prismatic joints) and higher pairs (point or line contact, such as gears and cams).

Building upon Reuleaux's foundations, **Martin Fürchtegott Grübler** (1917) and **Karl Kutzbach** (1929) formulated the fundamental criterion of mechanical mobility. They sought a single formula to determine whether a linkage mechanism is a rigid truss (0 degrees of freedom), an over-constrained structure ($<0$ degrees of freedom), or a mobile kinematic chain capable of coordinated movement ($>0$ degrees of freedom).

In the mid-20th century, with the emergence of cybernetics, computer science, and topological mechanics, **Jacques Denavit** and **Richard Hartenberg** (1955) introduced their standardized 4-parameter convention for attaching coordinate frames to serial kinematic chains. In the 1970s and 1980s, **Tomás Lozano-Pérez** formalized the modern topological concept of **Configuration Space ($\mathcal{C}$-space or $\mathcal{Q}$)** in the context of robot motion planning, recognizing that obstacle avoidance and path planning become dramatically clearer when the entire physical geometry of an articulated robot is mapped to a single mathematical point moving inside a high-dimensional manifold $\mathcal{Q}$.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Kinematic Pairs and Degrees of Freedom
A rigid body moving freely in unobstructed space possesses:
- $d = 3$ degrees of freedom in planar mechanics ($x, y$ translations and 1 rotation in the plane).
- $d = 6$ degrees of freedom in spatial mechanics ($x, y, z$ translations and 3 independent rotational axes).

When two rigid bodies are joined by a kinematic joint, the joint removes a subset of their relative degrees of freedom while permitting others. The classical lower kinematic pairs are:
1. **Revolute Joint ($R$):** Permits 1 relative rotation about a common axis ($f = 1$ DoF). Removes 5 spatial degrees of freedom.
2. **Prismatic Joint ($P$):** Permits 1 relative linear translation along a common axis ($f = 1$ DoF). Removes 5 spatial degrees of freedom.
3. **Helical / Screw Joint ($H$):** Permits 1 coordinated translation and rotation related by pitch $h$ ($f = 1$ DoF).
4. **Cylindrical Joint ($C$):** Permits independent rotation and translation along a shared axis ($f = 2$ DoF).
5. **Universal Joint ($U$):** Consists of two orthogonal revolute joints ($f = 2$ DoF).
6. **Spherical / Ball-and-Socket Joint ($S$):** Permits 3 independent rotational degrees of freedom ($f = 3$ DoF). Removes all 3 translational degrees of freedom.
7. **Planar Joint ($E$):** Permits 2 translations and 1 rotation on a plane ($f = 3$ DoF).

### 3.2 The Grübler-Kutzbach Mobility Criterion
Consider a mechanism consisting of $N$ rigid bodies (links), where one link is designated as the stationary base (ground link). Prior to interconnection, the remaining $(N - 1)$ moving links possess $d(N - 1)$ unrestricted degrees of freedom.

Let the mechanism contain $J$ joints. Each joint $i \in \{1, 2, \dots, J\}$ permits $f_i$ degrees of freedom and consequently imposes $(d - f_i)$ independent kinematic constraints. Summing all constraints, the net mobility $M$ (total number of independent generalized coordinates required to specify the configuration of the entire mechanism) is:

$$M = d(N - 1) - \sum_{i=1}^J (d - f_i) = d(N - 1 - J) + \sum_{i=1}^J f_i$$

For planar mechanisms ($d = 3$):
$$M_{\text{planar}} = 3(N - 1 - J) + \sum_{i=1}^J f_i$$

For spatial mechanisms ($d = 6$):
$$M_{\text{spatial}} = 6(N - 1 - J) + \sum_{i=1}^J f_i$$

If all joints are simple 1-DoF joints ($f_i = 1$ for all $i$), the formulas simplify to:
$$M_{\text{planar}} = 3(N - 1) - 2J, \quad M_{\text{spatial}} = 6(N - 1) - 5J$$

#### Physical Interpretation of Mobility $M$:
- **$M > 0$ (Mechanism):** The linkage possesses $M$ independent degrees of freedom and requires $M$ independent motors/actuators to fully control its state.
- **$M = 0$ (Statically Determinate Structure / Truss):** The linkage cannot move without deforming its links.
- **$M < 0$ (Statically Indeterminate / Over-constrained Structure):** The linkage contains redundant internal geometric constraints.

#### Exceptions: Over-Constrained Linkages
The Grübler-Kutzbach criterion is purely topological; it counts numbers of links and joints without considering metric geometry (such as exact link lengths or special parallel/intersecting axis alignments). In certain symmetric configurations, mobility can exceed Grübler's prediction:
- **Sarrus Linkage (1853):** A spatial linkage with $N = 6$ links and $J = 6$ revolute joints. Grübler predicts:
  $$M = 6(6 - 1 - 6) + 6(1) = 6(-1) + 6 = 0$$
  Yet, due to the perpendicular alignment of two sets of hinged plates, the Sarrus linkage transforms circular motion into exact rectilinear motion with **$M = 1$**!
- **Bennett 4R Linkage (1903):** A spatial 4-link closed chain with $N = 4$ and $J = 4$ revolute joints. Grübler predicts $M = 6(4 - 1 - 4) + 4 = -2$, yet with specific link twists and lengths satisfying $\frac{\sin\alpha_1}{a_1} = \frac{\sin\alpha_2}{a_2}$, the mechanism moves smoothly with **$M = 1$**.

### 3.3 Topology of Configuration Space $\mathcal{Q}$
The **Configuration Space** $\mathcal{Q}$ (or $\mathcal{C}$-space) is the $n$-dimensional topological manifold containing all possible physical arrangements of the robot's links.

For an $n$-joint serial arm with $n$ revolute joints, each joint variable is an angle $\theta_i$ that is periodic modulo $2\pi$: $\theta_i \in S^1$, where $S^1$ denotes the 1-dimensional circle group.
The complete configuration space is the topological Cartesian product of $n$ circles:
$$\mathcal{Q} = S^1 \times S^1 \times \cdots \times S^1 = T^n$$
where $T^n$ is the **$n$-dimensional Torus**.

For a 2-link planar arm (2R), $\mathcal{Q} = T^2 = S^1 \times S^1$, which is topologically equivalent to the surface of a doughnut. 

```
                          θ₂ ↑ 2π ┌────────────────────┐
                             │    │                    │
                             │    │                    │
                             │    │     T² Chart       │
                             │    │                    │
                             │  0 └────────────────────┘
                             └─────────────────────────▶ θ₁
                                  0                   2π
                      (Left edge wraps to Right; Bottom wraps to Top)
```

Because $\theta_i$ wraps at $2\pi \equiv 0$, the standard Euclidean distance metric on $\mathbb{R}^n$ does **not** reflect physical joint displacement. The true geodesic distance on $S^1$ between two angles $\theta_a, \theta_b \in [-\pi, \pi)$ is:
$$d_{S^1}(\theta_a, \theta_b) = \min\left( |\theta_a - \theta_b|, 2\pi - |\theta_a - \theta_b| \right)$$

For mixed chains with $r$ revolute joints and $p$ prismatic joints:
$$\mathcal{Q} = T^r \times \mathbb{R}^p$$

### 3.4 Task Space $\mathcal{X}$ and Workspace Manifolds
The **Task Space** $\mathcal{X}$ (also called Operational Space or Workspace) is the space in which the robot's end-effector or tool performs physical work.
For an end-effector moving in unobstructed 3D space:
$$\mathcal{X} = SE(3) \cong \mathbb{R}^3 \times SO(3)$$
where $\mathbb{R}^3$ denotes position $(x, y, z)$ and $SO(3)$ denotes 3D rotation orientation.

#### Reachable vs. Dextrous Workspace:
Let $f: \mathcal{Q} \to \mathcal{X}$ be the forward kinematics mapping.
- **Reachable Workspace ($\mathcal{W}_R \subset \mathbb{R}^3$):** The set of all spatial positions $p \in \mathbb{R}^3$ that can be attained by the end-effector in at least one orientation:
  $$\mathcal{W}_R = \{ p \in \mathbb{R}^3 \mid \exists q \in \mathcal{Q}, R \in SO(3) \text{ such that } f(q) = (p, R) \}$$
- **Dextrous Workspace ($\mathcal{W}_D \subset \mathcal{W}_R$):** The set of positions $p \in \mathbb{R}^3$ that can be attained by the end-effector with **all** possible orientations $R \in SO(3)$:
  $$\mathcal{W}_D = \{ p \in \mathbb{R}^3 \mid \forall R \in SO(3), \exists q \in \mathcal{Q} \text{ such that } f(q) = (p, R) \}$$
In practice, $\mathcal{W}_D \subset \mathcal{W}_R$, and for many industrial arms with limited joint ranges, $\mathcal{W}_D$ is significantly smaller than $\mathcal{W}_R$ or may even be empty!

### 3.5 Holonomic vs. Non-Holonomic Kinematic Constraints
Kinematic constraints govern how a system can move through its configuration space:
1. **Holonomic Constraints:** Algebraic constraints on the configuration variables alone:
   $$h_j(q) = 0, \quad j = 1, \dots, k$$
   Each independent holonomic constraint reduces the effective dimension of configuration space from $n$ to $n - k$. The system is confined to an $(n - k)$-dimensional smooth submanifold $\mathcal{M} \subset \mathcal{Q}$.
2. **Non-Holonomic Constraints:** Differential constraints on velocities that cannot be integrated into algebraic relations on configurations:
   $$A(q) \dot{q} = 0$$
   A classic example is a rolling wheel or unicycle: the wheel cannot slide sideways ($\dot{x}\sin\theta - \dot{y}\cos\theta = 0$). Although the unicycle is restricted to a 2D velocity subspace at any instant, it can reach **any** 3D configuration $(x, y, \theta)$ in the plane through parallel parking maneuvers. Non-holonomic constraints restrict instantaneous velocities without restricting the global reachable configuration manifold!

---

## 4. Computational Realization & Algorithmic Implementation

When implementing configuration space mathematics in production software, angular representation and distance metrics require careful numerical handling:

```typescript
export class ConfigurationSpace {
  /**
   * Normalizes an angle into [-pi, pi).
   */
  public static normalizeAngle(theta: number): number {
    let a = theta % (2 * Math.PI);
    if (a >= Math.PI) a -= 2 * Math.PI;
    if (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  /**
   * Computes the shortest signed angular difference (target - current) on S^1.
   * Result lies strictly in [-pi, pi).
   */
  public static angularDifference(current: number, target: number): number {
    const diff = (target - current) % (2 * Math.PI);
    return Math.atan2(Math.sin(diff), Math.cos(diff));
  }

  /**
   * Computes geodesic distance on the n-dimensional torus T^n.
   */
  public static torusDistance(q1: number[], q2: number[], weights?: number[]): number {
    if (q1.length !== q2.length) {
      throw new Error("Dimension mismatch between configuration vectors");
    }
    let sumSq = 0;
    for (let i = 0; i < q1.length; i++) {
      const dTheta = this.angularDifference(q1[i], q2[i]);
      const w = weights ? weights[i] : 1.0;
      sumSq += w * dTheta * dTheta;
    }
    return Math.sqrt(sumSq);
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 1.1: Grübler Mobility of a Planar 3R Serial Manipulator
**Problem Statement:** Consider an open-chain planar manipulator consisting of a fixed ground base (link 0) and 3 moving links (links 1, 2, 3) connected by 3 revolute joints ($J_1, J_2, J_3$). Each joint permits planar rotation ($f_i = 1$). Calculate the system's mobility using the Grübler-Kutzbach criterion.

**Given Data:**
- Planar space: $d = 3$
- Total links: $N = 4$ (base + 3 moving links)
- Total joints: $J = 3$
- Joint freedoms: $f_1 = f_2 = f_3 = 1$

**Step-by-Step Derivation:**
1. Apply the planar Grübler mobility equation:
   $$M = 3(N - 1 - J) + \sum_{i=1}^J f_i$$
2. Substitute the parameters:
   $$N - 1 - J = 4 - 1 - 3 = 0$$
   $$\sum_{i=1}^3 f_i = 1 + 1 + 1 = 3$$
3. Evaluate mobility:
   $$M = 3(0) + 3 = 3$$

**Final Answer:**
The planar 3R arm possesses exactly **3 degrees of freedom**. In the plane, this allows independent positioning of the end-effector in Cartesian $(x, y)$ and independent orientation of the final link ($\phi$).

**Verification & Sanity Check:**
Because $M = 3 = \dim(SE(2))$, the robot is non-redundant for full planar poses $(x, y, \phi)$.

---

### Problem 1.2: Grübler Mobility of a Planar Four-Bar Closed-Loop Mechanism
**Problem Statement:** A closed-loop planar four-bar linkage consists of 4 rigid links (including the ground frame) connected in a single closed kinematic loop by 4 1-DoF revolute joints. Determine the mobility of the mechanism.

**Given Data:**
- Space dimension: $d = 3$
- Total links: $N = 4$
- Total joints: $J = 4$
- Joint freedoms: $f_i = 1$ for all $i \in \{1, 2, 3, 4\}$

**Step-by-Step Derivation:**
1. Evaluate link and joint terms:
   $$N - 1 - J = 4 - 1 - 4 = -1$$
   $$\sum_{i=1}^4 f_i = 4(1) = 4$$
2. Apply the planar Grübler criterion:
   $$M = 3(N - 1 - J) + \sum_{i=1}^4 f_i = 3(-1) + 4 = -3 + 4 = 1$$

**Final Answer:**
The planar four-bar linkage has **$M = 1$ degree of freedom**.

**Verification & Sanity Check:**
Driving one joint (e.g., the crank angle $\theta_1$) uniquely determines the configurations of all other three links through the loop-closure algebraic equations, confirming a single independent degree of freedom.

---

### Problem 1.3: Grübler Mobility of a Spatial 6R Industrial Manipulator
**Problem Statement:** Calculate the mobility of an open-chain 6-axis industrial robot (such as the KUKA KR6 or FANUC M-20iA) consisting of a fixed mounting base and 6 articulated links connected by 6 revolute joints.

**Given Data:**
- Spatial dimension: $d = 6$
- Total links: $N = 7$ (base + 6 links)
- Total joints: $J = 6$
- Joint freedoms: $f_i = 1$ for each $i \in \{1, \dots, 6\}$

**Step-by-Step Derivation:**
1. Evaluate spatial Grübler parameters:
   $$N - 1 - J = 7 - 1 - 6 = 0$$
   $$\sum_{i=1}^6 f_i = 6(1) = 6$$
2. Compute mobility:
   $$M = 6(N - 1 - J) + \sum_{i=1}^6 f_i = 6(0) + 6 = 6$$

**Final Answer:**
The 6R industrial arm possesses **$M = 6$ degrees of freedom**.

**Verification & Sanity Check:**
Because $\dim(SE(3)) = 6$, having 6 independent joints is the minimal necessary condition for an open-chain serial manipulator to achieve arbitrary 3D position $(x, y, z)$ and arbitrary 3D orientation (roll, pitch, yaw) within its workspace.

---

### Problem 1.4: Grübler Mobility of the Delta Parallel Robot
**Problem Statement:** A 3-DoF Delta parallel robot consists of a fixed base plate, a moving end-effector platform, and 3 identical parallel kinematic chains connecting them. Each chain consists of:
- An actuated upper arm attached to the base by a revolute joint ($R$, $f = 1$).
- A parallelogram forearm consisting of 2 parallel rods connected to the upper arm and mobile platform by spherical ball joints ($S$, $f = 3$) at both ends.
Treating each parallelogram as an equivalent 2-DoF universal-like subsystem, the standard Delta has 1 fixed base, 1 moving platform, 3 upper arms, and 6 forearm rods, totaling $N = 1 + 1 + 3 + 6 = 11$ links. There are 3 actuated revolute joints ($f = 1$) and 12 spherical joints ($f = 3$). Use Grübler's spatial formula and explain the resulting mobility.

**Given Data:**
- $d = 6$
- $N = 11$
- Revolute joints: $J_R = 3$ with $f_R = 1$
- Spherical joints: $J_S = 12$ with $f_S = 3$
- Total joints: $J = 15$

**Step-by-Step Derivation:**
1. Compute link and joint sums:
   $$N - 1 - J = 11 - 1 - 15 = -5$$
   $$\sum f_i = 3(1) + 12(3) = 3 + 36 = 39$$
2. Apply spatial Grübler formula:
   $$M = 6(N - 1 - J) + \sum f_i = 6(-5) + 39 = -30 + 39 = 9$$
3. Interpret internal vs. task degrees of freedom:
   Notice that each of the 6 forearm rods can spin freely around its own longitudinal axis between its two spherical ball joints without affecting the platform pose. There are 6 such idle/passive internal degrees of freedom ($6 \times 1 = 6$).
4. Subtract passive rotations to obtain operational mobility:
   $$M_{\text{platform}} = M_{\text{total}} - M_{\text{passive}} = 9 - 6 = 3$$

**Final Answer:**
The Delta robot possesses **3 operational degrees of freedom** (pure translational $x, y, z$ motion of the end-effector platform without rotation).

**Verification & Sanity Check:**
The parallel parallelogram geometry forces the mobile platform to remain strictly parallel to the fixed base plate at all times, constraining all 3 rotational DoFs and leaving exactly 3 translational DoFs.

---

### Problem 1.5: The Bennett 4R Spatial Mechanism Paradox
**Problem Statement:** A spatial 4-link closed chain has 4 revolute joints ($N = 4, J = 4, f_i = 1$). 
1. Evaluate Grübler's spatial mobility formula for this mechanism.
2. Explain the physical mechanism discovered by G. T. Bennett (1903) that violates this formula, and state its true mobility.

**Given Data:**
- $d = 6, N = 4, J = 4, f_i = 1$

**Step-by-Step Derivation:**
1. Apply Grübler's spatial formula:
   $$M = 6(4 - 1 - 4) + 4(1) = 6(-1) + 4 = -2$$
2. Grübler predicts $M = -2$, implying a doubly statically indeterminate structure that is completely locked and incapable of motion.
3. Bennett's Geometric Insight: Bennett proved that if the link lengths $a_i$ and link twists $\alpha_i$ satisfy the skew-symmetry conditions:
   $$a_1 = a_3, \quad a_2 = a_4, \quad \alpha_1 = \alpha_3, \quad \alpha_2 = \alpha_4$$
   and the ratio constraint:
   $$\frac{\sin\alpha_1}{a_1} = \frac{\sin\alpha_2}{a_2}$$
   then 3 of the 5 spatial constraints per joint become linearly dependent with constraints on adjacent links.
4. Hence, the algebraic loop constraints collapse from rank 5 down to rank 3, permitting a 1-dimensional continuous solution manifold.

**Final Answer:**
Grübler's formula predicts **$M = -2$**, but Bennett's 4R mechanism has a true mobility of **$M = 1$**.

**Verification & Sanity Check:**
This demonstrates that the Grübler-Kutzbach criterion is a necessary topological estimate, but not a sufficient condition when special metric geometric symmetries exist.

---

### Problem 1.6: Configuration Space Topology of a 2R Planar Arm
**Problem Statement:** A 2-link planar arm has joint angles $\theta_1, \theta_2 \in [-\pi, \pi)$. Let configuration $A$ be $(\theta_1^A, \theta_2^A) = (3.10, -3.00)\text{ rad}$ and configuration $B$ be $(\theta_1^B, \theta_2^B) = (-3.10, 3.00)\text{ rad}$.
1. Compute the naive Euclidean distance $\|\Delta q\|_{\mathbb{R}^2}$.
2. Compute the exact geodesic distance on the torus $T^2$ with identity metric.

**Given Data:**
- $q_A = (3.10, -3.00)$
- $q_B = (-3.10, 3.00)$

**Step-by-Step Derivation:**
1. Naive Euclidean distance:
   $$\Delta\theta_1 = -3.10 - 3.10 = -6.20\text{ rad}$$
   $$\Delta\theta_2 = 3.00 - (-3.00) = 6.00\text{ rad}$$
   $$d_{\mathbb{R}^2} = \sqrt{(-6.20)^2 + (6.00)^2} = \sqrt{38.44 + 36.00} = \sqrt{74.44} \approx 8.6279\text{ rad}$$
2. Geodesic distance on $S^1$ for joint 1:
   $$|\theta_1^B - \theta_1^A| = |-3.10 - 3.10| = 6.20\text{ rad}$$
   $$d_{S^1}(\theta_1^A, \theta_1^B) = \min(6.20, 2\pi - 6.20) = \min(6.20, 6.283185 - 6.20) = \min(6.20, 0.083185) = 0.083185\text{ rad}$$
3. Geodesic distance on $S^1$ for joint 2:
   $$|\theta_2^B - \theta_2^A| = |3.00 - (-3.00)| = 6.00\text{ rad}$$
   $$d_{S^1}(\theta_2^A, \theta_2^B) = \min(6.00, 2\pi - 6.00) = \min(6.00, 0.283185) = 0.283185\text{ rad}$$
4. True torus distance $d_{T^2}$:
   $$d_{T^2} = \sqrt{d_{S^1}^2(\theta_1) + d_{S^1}^2(\theta_2)} = \sqrt{(0.083185)^2 + (0.283185)^2} = \sqrt{0.006920 + 0.080194} = \sqrt{0.087114} \approx 0.29515\text{ rad}$$

**Final Answer:**
- Naive Euclidean distance: **$8.6279\text{ rad}$** (erroneous)
- Exact Torus geodesic distance: **$0.2952\text{ rad}$**

**Verification & Sanity Check:**
Because $3.10\text{ rad} \approx 177.6^\circ$ and $-3.10\text{ rad} \approx -177.6^\circ$, the joint only needs to rotate across the $180^\circ$ boundary by $4.8^\circ \approx 0.083\text{ rad}$. Treating configuration space as flat $\mathbb{R}^2$ miscalculates the physical path length by a factor of 29!

---

### Problem 1.7: Reachable vs. Dextrous Workspace for a 2R Planar Arm
**Problem Statement:** A 2R planar manipulator has link lengths $L_1 = 2.0\text{ m}$ and $L_2 = 1.2\text{ m}$. Both joints can rotate through complete revolutions $[-\pi, \pi)$. 
1. Determine the outer and inner boundary radii of the reachable workspace $\mathcal{W}_R$.
2. Determine the dextrous workspace $\mathcal{W}_D$ for reaching positions with all end-effector orientations $\phi \in [-\pi, \pi)$, where link 2 is the end-effector.

**Given Data:**
- $L_1 = 2.0\text{ m}$
- $L_2 = 1.2\text{ m}$

**Step-by-Step Derivation:**
1. Forward kinematics position of end-effector:
   $$x = L_1 \cos\theta_1 + L_2 \cos(\theta_1 + \theta_2)$$
   $$y = L_1 \sin\theta_1 + L_2 \sin(\theta_1 + \theta_2)$$
2. Squared radial distance from base:
   $$r^2 = x^2 + y^2 = L_1^2 + L_2^2 + 2 L_1 L_2 \cos\theta_2$$
3. Maximum radius occurs at $\theta_2 = 0$ (arm fully extended):
   $$r_{\max} = \sqrt{L_1^2 + L_2^2 + 2L_1 L_2} = L_1 + L_2 = 2.0 + 1.2 = 3.2\text{ m}$$
4. Minimum radius occurs at $\theta_2 = \pi$ (arm fully folded):
   $$r_{\min} = \sqrt{L_1^2 + L_2^2 - 2L_1 L_2} = |L_1 - L_2| = |2.0 - 1.2| = 0.8\text{ m}$$
   Therefore, the reachable workspace $\mathcal{W}_R$ is an annulus:
   $$\mathcal{W}_R = \{ (x, y) \in \mathbb{R}^2 \mid 0.8\text{ m} \le \sqrt{x^2 + y^2} \le 3.2\text{ m} \}$$
5. Dextrous workspace: To achieve **any** orientation $\phi = \theta_1 + \theta_2$ at point $(x, y)$, the base joint $\theta_1 = \phi - \theta_2$ must be able to place the elbow at $(x - L_2\cos\phi, y - L_2\sin\phi)$ at distance $L_1$ from the origin for all $\phi \in [0, 2\pi)$.
   Since the arm only has 2 links, specifying $(x, y)$ and $\phi$ gives 3 constraints on 2 variables ($M = 2 < 3$).
   A 2R arm cannot independently choose position and orientation.

**Final Answer:**
- Reachable Workspace: Annulus with inner radius **$0.8\text{ m}$** and outer radius **$3.2\text{ m}$**.
- Dextrous Workspace: **Empty ($\emptyset$)**, as 3 independent coordinates $(x, y, \phi)$ cannot be satisfied by 2 joints.

**Verification & Sanity Check:**
Area of reachable workspace is $\pi(r_{\max}^2 - r_{\min}^2) = \pi(3.2^2 - 0.8^2) = \pi(10.24 - 0.64) = 9.6\pi \approx 30.16\text{ m}^2$.

---

### Problem 1.8: Holonomic Constraint on an Articulated Mechanism
**Problem Statement:** A 2-link planar arm ($L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$) has its end-effector mechanically constrained by a rigid tether to remain on the circle $(x - 1)^2 + y^2 = 1$. Formulate the holonomic constraint equation $h(\theta_1, \theta_2) = 0$ and determine the resulting mobility.

**Given Data:**
- $x = \cos\theta_1 + \cos(\theta_1 + \theta_2)$
- $y = \sin\theta_1 + \sin(\theta_1 + \theta_2)$
- Constraint: $(x - 1)^2 + y^2 - 1 = 0$

**Step-by-Step Derivation:**
1. Expand the constraint:
   $$x^2 - 2x + 1 + y^2 - 1 = 0 \implies x^2 + y^2 - 2x = 0$$
2. Substitute forward kinematics into $x^2 + y^2$:
   $$x^2 + y^2 = L_1^2 + L_2^2 + 2L_1 L_2 \cos\theta_2 = 1 + 1 + 2\cos\theta_2 = 2 + 2\cos\theta_2$$
3. Substitute into $2x$:
   $$2x = 2(\cos\theta_1 + \cos(\theta_1 + \theta_2))$$
4. Set up $h(\theta_1, \theta_2)$:
   $$h(\theta_1, \theta_2) = 2 + 2\cos\theta_2 - 2\cos\theta_1 - 2\cos(\theta_1 + \theta_2) = 0$$
   Dividing by 2:
   $$1 + \cos\theta_2 - \cos\theta_1 - \cos(\theta_1 + \theta_2) = 0$$
5. Dimensionality reduction: The unconstrained C-space had dimension 2 ($T^2$). The single independent algebraic equation $h(\theta_1, \theta_2) = 0$ removes 1 DoF:
   $$\dim(\mathcal{M}) = 2 - 1 = 1$$

**Final Answer:**
Constraint equation: **$1 + \cos\theta_2 - \cos\theta_1 - \cos(\theta_1 + \theta_2) = 0$**. 
The constrained system forms a 1-dimensional manifold with **$M = 1$ degree of freedom**.

**Verification & Sanity Check:**
If $\theta_1 = 0, \theta_2 = 0$, $x = 2, y = 0 \implies (2-1)^2 + 0^2 = 1$, which satisfies the constraint. Evaluating $h(0, 0) = 1 + 1 - 1 - 1 = 0$, perfectly consistent.

---

### Problem 1.9: Non-Holonomic Constraint of a Unicycle Robot
**Problem Statement:** A unicycle mobile robot on a 2D floor has configuration coordinates $q = (x, y, \theta)^T \in \mathbb{R}^2 \times S^1$, where $(x, y)$ is the wheel contact point and $\theta$ is the heading angle. The wheel rolls without slipping.
1. Formulate the Pfaffian velocity constraint equation $A(q)\dot{q} = 0$.
2. Prove that this constraint is non-holonomic using the Frobenius integrability criterion.

**Given Data:**
- Configuration: $q = [x, y, \theta]^T$
- Forward speed: $v$
- Turning rate: $\omega = \dot{\theta}$

**Step-by-Step Derivation:**
1. The wheel can only travel parallel to its heading $[\cos\theta, \sin\theta]^T$. The velocity perpendicular to the wheel direction $[-\sin\theta, \cos\theta]^T$ must be zero:
   $$\dot{x}\sin\theta - \dot{y}\cos\theta = 0$$
2. In Pfaffian form $A(q)\dot{q} = 0$:
   $$A(q) = \begin{bmatrix} \sin\theta & -\cos\theta & 0 \end{bmatrix}, \quad \dot{q} = \begin{bmatrix} \dot{x} \\ \dot{y} \\ \dot{\theta} \end{bmatrix}$$
   $$\omega(q) = \sin\theta\, dx - \cos\theta\, dy = 0$$
3. Frobenius Integrability Condition: A 1-form $\omega$ is integrable if and only if:
   $$\omega \wedge d\omega = 0$$
4. Compute the exterior derivative $d\omega$:
   $$d\omega = d(\sin\theta\, dx - \cos\theta\, dy) = \cos\theta\, d\theta \wedge dx - (-\sin\theta)\, d\theta \wedge dy = \cos\theta\, (d\theta \wedge dx) + \sin\theta\, (d\theta \wedge dy)$$
5. Compute the wedge product $\omega \wedge d\omega$:
   $$\omega \wedge d\omega = (\sin\theta\, dx - \cos\theta\, dy) \wedge (\cos\theta\, d\theta \wedge dx + \sin\theta\, d\theta \wedge dy)$$
   $$= \sin^2\theta\, (dx \wedge d\theta \wedge dy) - \cos^2\theta\, (dy \wedge d\theta \wedge dx)$$
   Using $dy \wedge d\theta \wedge dx = - dx \wedge d\theta \wedge dy$:
   $$\omega \wedge d\omega = \sin^2\theta\, (dx \wedge d\theta \wedge dy) + \cos^2\theta\, (dx \wedge d\theta \wedge dy) = (\sin^2\theta + \cos^2\theta)(dx \wedge d\theta \wedge dy) = dx \wedge d\theta \wedge dy \neq 0$$

**Final Answer:**
Because $\omega \wedge d\omega = dx \wedge d\theta \wedge dy \neq 0$, the constraint is **strictly non-holonomic** (completely non-integrable).

**Verification & Sanity Check:**
Since the constraint cannot be integrated into a relation $h(x, y, \theta) = 0$, the unicycle is capable of reaching any point $(x, y)$ with any orientation $\theta$ in 3D configuration space, despite having only 2 control velocity inputs $(v, \omega)$.

---

### Problem 1.10: Forward Mapping Multi-Valued Preimages (Elbow-Up vs. Elbow-Down)
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}$ and $L_2 = 1.0\text{ m}$ is commanded to reach the Cartesian target position $(x, y) = (1.0, 1.0)\text{ m}$. Find all distinct preimages in configuration space $\mathcal{Q} = [-\pi, \pi) \times [-\pi, \pi)$.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $x = 1.0, y = 1.0$

**Step-by-Step Derivation:**
1. Compute the squared distance from base to target:
   $$r^2 = x^2 + y^2 = 1.0^2 + 1.0^2 = 2.0$$
2. Law of cosines for elbow joint $\theta_2$:
   $$r^2 = L_1^2 + L_2^2 + 2L_1 L_2 \cos\theta_2 \implies 2.0 = 1.0 + 1.0 + 2(1.0)(1.0)\cos\theta_2$$
   $$2.0 = 2.0 + 2.0\cos\theta_2 \implies 2.0\cos\theta_2 = 0 \implies \cos\theta_2 = 0$$
3. Solve for the two elbow branches:
   $$\theta_2^{(1)} = +\frac{\pi}{2} = +1.5708\text{ rad} \quad (\text{Elbow-Down})$$
   $$\theta_2^{(2)} = -\frac{\pi}{2} = -1.5708\text{ rad} \quad (\text{Elbow-Up})$$
4. Solve for shoulder angle $\theta_1$ using:
   $$\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$$
   Note: $\operatorname{atan2}(1.0, 1.0) = \frac{\pi}{4} = 0.7854\text{ rad}$.
   - For Branch 1 ($\theta_2 = +\pi/2$):
     $$\sin(\pi/2) = 1, \quad \cos(\pi/2) = 0$$
     $$\operatorname{atan2}(1.0(1), 1.0 + 0) = \operatorname{atan2}(1.0, 1.0) = \frac{\pi}{4}$$
     $$\theta_1^{(1)} = \frac{\pi}{4} - \frac{\pi}{4} = 0\text{ rad}$$
   - For Branch 2 ($\theta_2 = -\pi/2$):
     $$\sin(-\pi/2) = -1, \quad \cos(-\pi/2) = 0$$
     $$\operatorname{atan2}(1.0(-1), 1.0 + 0) = \operatorname{atan2}(-1.0, 1.0) = -\frac{\pi}{4}$$
     $$\theta_1^{(2)} = \frac{\pi}{4} - \left(-\frac{\pi}{4}\right) = \frac{\pi}{2} = 1.5708\text{ rad}$$

**Final Answer:**
There are exactly two preimages in $\mathcal{Q}$:
1. **Branch 1 (Elbow-Down):** $q^{(1)} = (0\text{ rad}, +\pi/2\text{ rad}) = (0^\circ, 90^\circ)$
2. **Branch 2 (Elbow-Up):** $q^{(2)} = (+\pi/2\text{ rad}, -\pi/2\text{ rad}) = (90^\circ, -90^\circ)$

**Verification & Sanity Check:**
- For Branch 1: $x = 1.0\cos(0) + 1.0\cos(0 + \pi/2) = 1.0(1) + 1.0(0) = 1.0$. $y = 1.0\sin(0) + 1.0\sin(\pi/2) = 0 + 1.0(1) = 1.0$.
- For Branch 2: $x = 1.0\cos(\pi/2) + 1.0\cos(\pi/2 - \pi/2) = 0 + 1.0\cos(0) = 1.0$. $y = 1.0\sin(\pi/2) + 1.0\sin(0) = 1.0 + 0 = 1.0$.
Both forward kinematics evaluations return $(1.0, 1.0)$ exactly.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 1.11: Mobility of a Planar 5-Bar Linkage
**Problem Statement:** A closed-loop planar five-bar linkage consists of 5 links connected by 5 revolute joints ($f_i = 1$). Calculate its mobility using Grübler's criterion and determine how many actuators are required to control it.

**Solution:**
1. Parameters: $d = 3, N = 5, J = 5, f_i = 1$.
2. Grübler calculation:
   $$M = 3(N - 1 - J) + \sum_{i=1}^5 f_i = 3(5 - 1 - 5) + 5(1) = 3(-1) + 5 = -3 + 5 = 2$$
3. The linkage possesses **$M = 2$ degrees of freedom**.
4. Exactly **2 independent motor actuators** are required to fully control the configuration.

---

### Problem 1.12: Mobility of the 6-DoF Stewart-Gough Platform
**Problem Statement:** The Stewart-Gough platform consists of a fixed base plate, a mobile top plate, and 6 variable-length prismatic legs. Each leg is connected to the base by a 2-DoF universal joint ($U$, $f = 2$) and to the top platform by a 3-DoF spherical ball joint ($S$, $f = 3$), with a 1-DoF prismatic actuator ($P$, $f = 1$) in between. Calculate the total mobility.

**Solution:**
1. Count the links:
   - 1 fixed base link
   - 1 mobile platform link
   - 6 legs, each having 2 telescoping segments: $6 \times 2 = 12$ link segments
   - Total links $N = 1 + 1 + 12 = 14$.
2. Count the joints:
   - 6 Universal joints: $f = 2$
   - 6 Prismatic joints: $f = 1$
   - 6 Spherical joints: $f = 3$
   - Total joints $J = 6 + 6 + 6 = 18$.
3. Sum degrees of freedom:
   $$\sum_{i=1}^{18} f_i = 6(2) + 6(1) + 6(3) = 12 + 6 + 18 = 36$$
4. Spatial Grübler mobility:
   $$M = 6(N - 1 - J) + \sum f_i = 6(14 - 1 - 18) + 36 = 6(-5) + 36 = -30 + 36 = 6$$
5. The platform possesses **$M = 6$ degrees of freedom** ($x, y, z$ position and roll, pitch, yaw orientation).

---

### Problem 1.13: Anatomical Degree-of-Freedom Analysis of the Human Arm
**Problem Statement:** Model the human arm kinematics from shoulder to wrist:
- Shoulder: Spherical joint (3 DoF: flexion/extension, abduction/adduction, internal/external rotation).
- Elbow: Revolute joint (1 DoF: flexion/extension).
- Forearm: Revolute joint (1 DoF: pronation/supination).
- Wrist: Universal joint (2 DoF: flexion/extension, radial/ulnar deviation).
Compute the total mobility of the arm and determine whether the arm is kinematically redundant for 3D positioning tasks ($\mathbb{R}^3$) and for full spatial poses ($SE(3)$).

**Solution:**
1. Sum of joint degrees of freedom:
   $$n = f_{\text{shoulder}} + f_{\text{elbow}} + f_{\text{forearm}} + f_{\text{wrist}} = 3 + 1 + 1 + 2 = 7\text{ DoF}$$
2. For 3D Cartesian positioning tasks ($\mathcal{X} = \mathbb{R}^3$, $m = 3$):
   Degree of redundancy: $n - m = 7 - 3 = 4$.
3. For full 6D spatial poses ($\mathcal{X} = SE(3)$, $m = 6$):
   Degree of redundancy: $n - m = 7 - 6 = 1$.
4. The human arm possesses a **1-dimensional internal self-motion manifold** (swivel angle of the elbow around the shoulder-to-wrist axis).

---

### Problem 1.14: The Sarrus Over-Constrained Linkage Proof
**Problem Statement:** The Sarrus linkage consists of 6 rectangular plates ($N = 6$) connected in a spatial loop by 6 revolute joints ($J = 6, f_i = 1$). Show why the spatial Grübler formula fails and derive its physical mobility.

**Solution:**
1. Topological formula:
   $$M = 6(6 - 1 - 6) + 6(1) = 6(-1) + 6 = 0$$
   Predicting a rigid structure.
2. Geometric analysis: The 6 hinges are arranged in two groups of three parallel axes. Group A has axes parallel to $\hat{x}$, while Group B has axes parallel to $\hat{y}$.
3. Group A constrains motion to a plane perpendicular to $\hat{x}$, eliminating rotation about $\hat{y}$ and $\hat{z}$.
4. Group B constrains motion to a plane perpendicular to $\hat{y}$, eliminating rotation about $\hat{x}$ and $\hat{z}$.
5. Together, the constraints eliminate all 3 rotational degrees of freedom and the 2 lateral translational degrees of freedom, leaving exactly 1 pure rectilinear translation along $\hat{z}$.
6. Physical mobility is **$M = 1$**.

---

### Problem 1.15: Configuration Space Topology of Cylindrical and SCARA Robots
**Problem Statement:** Determine the mathematical topology and compactness of the configuration spaces for:
1. A 3-DoF Cylindrical robot ($R-P-P$).
2. A 4-DoF SCARA robot ($R-R-P-R$).

**Solution:**
1. Cylindrical robot:
   - Joint 1: Revolute angle $\theta_1 \in S^1$ (compact, bounded 1D circle).
   - Joint 2: Prismatic extension $z \in [z_{\min}, z_{\max}] \subset \mathbb{R}$ (bounded interval).
   - Joint 3: Prismatic radius $r \in [r_{\min}, r_{\max}] \subset \mathbb{R}$.
   - Topology: $\mathcal{Q}_{\text{cyl}} = S^1 \times \mathbb{R}^2$. Non-compact manifold with boundary.
2. SCARA robot:
   - Joint 1: Shoulder $\theta_1 \in S^1$.
   - Joint 2: Elbow $\theta_2 \in S^1$.
   - Joint 3: Quill translation $d_3 \in \mathbb{R}$.
   - Joint 4: Wrist roll $\theta_4 \in S^1$.
   - Topology: $\mathcal{Q}_{\text{SCARA}} = S^1 \times S^1 \times \mathbb{R} \times S^1 = T^3 \times \mathbb{R}$.

---

### Problem 1.16: Void Analysis of a 3R Planar Manipulator
**Problem Statement:** A 3R planar arm has link lengths $L_1 = 3.0\text{ m}$, $L_2 = 1.5\text{ m}$, and $L_3 = 1.0\text{ m}$. All joints have full $360^\circ$ rotation. Does the reachable workspace contain an internal void (inaccessible hole around the origin)? If so, determine its radius.

**Solution:**
1. The maximum reach is:
   $$R_{\max} = L_1 + L_2 + L_3 = 3.0 + 1.5 + 1.0 = 5.5\text{ m}$$
2. An internal void exists around the origin if and only if the longest link is strictly longer than the sum of all other links combined:
   $$L_1 > L_2 + L_3$$
3. Evaluating the condition:
   $$3.0 > 1.5 + 1.0 \iff 3.0 > 2.5 \quad (\text{Condition holds!})$$
4. The minimum distance the arm can reach occurs when link 1 is folded inward against links 2 and 3 aligned along the same radial line:
   $$R_{\min} = L_1 - (L_2 + L_3) = 3.0 - (1.5 + 1.0) = 3.0 - 2.5 = 0.5\text{ m}$$
5. An internal void **exists**, forming a circular hole of radius **$0.5\text{ m}$** centered at the origin.

---

### Problem 1.17: Shortest Angular Path on $S^1$ Metric
**Problem Statement:** A robot joint is at $\theta_{\text{start}} = 3.00\text{ rad}$ and must move to $\theta_{\text{target}} = -3.00\text{ rad}$. Calculate the signed shortest angular rotation $\Delta\theta \in [-\pi, \pi)$ using the closed-form atan2 formulation.

**Solution:**
1. Raw difference:
   $$\text{diff} = \theta_{\text{target}} - \theta_{\text{start}} = -3.00 - 3.00 = -6.00\text{ rad}$$
2. Apply atan2 trigonometric unwrapping:
   $$\Delta\theta = \operatorname{atan2}(\sin(\text{diff}), \cos(\text{diff}))$$
3. Numerical evaluation:
   $$\sin(-6.00) \approx 0.279415$$
   $$\cos(-6.00) \approx 0.960170$$
   $$\Delta\theta = \operatorname{atan2}(0.279415, 0.960170) \approx +0.283185\text{ rad}$$
4. Physical interpretation: Instead of rotating backwards by $-6.00\text{ rad} \approx -343.8^\circ$, the motor rotates forward by **$+0.2832\text{ rad} \approx +16.2^\circ$** crossing the $\pm\pi$ seam.

---

### Problem 1.18: Preimage Dimension of a Redundant 3R Planar Arm
**Problem Statement:** A 3R planar manipulator operates in a 2D task space where only position $(x, y)$ is specified. Determine the mathematical structure and dimension of the preimage fiber $f^{-1}(x_0, y_0)$ for a regular target point in the interior of the reachable workspace.

**Solution:**
1. Dimension of configuration space: $\dim(\mathcal{Q}) = 3$ (coordinates $\theta_1, \theta_2, \theta_3$).
2. Dimension of task space: $\dim(\mathcal{X}) = 2$ (coordinates $x, y$).
3. By the Regular Value Theorem (Preimage Theorem) from differential topology: If $(x_0, y_0)$ is a regular value of the smooth forward kinematics map $f: \mathcal{Q} \to \mathcal{X}$, then the preimage $f^{-1}(x_0, y_0)$ is a smooth submanifold of $\mathcal{Q}$ of dimension:
   $$\dim(f^{-1}(x_0, y_0)) = \dim(\mathcal{Q}) - \dim(\mathcal{X}) = 3 - 2 = 1$$
4. The preimage is a **1-dimensional manifold** (a set of closed topological loops $S^1$ inside $T^3$). The robot can move continuously along this 1D curve without changing the end-effector position $(x_0, y_0)$ (known as nullspace self-motion).

---

### Problem 1.19: Dextrous Workspace of a 3R Planar Manipulator
**Problem Statement:** A 3R planar manipulator has link lengths $L_1 = 2.0\text{ m}, L_2 = 1.5\text{ m}, L_3 = 0.8\text{ m}$. Derive the exact radius of the dextrous workspace $\mathcal{W}_D$ within which the end-effector can achieve all orientations $\phi \in [-\pi, \pi)$.

**Solution:**
1. The end-effector pose is specified by $(x, y, \phi)$, where $\phi = \theta_1 + \theta_2 + \theta_3$.
2. The wrist joint position $(x_2, y_2)$ is located at distance $L_3$ from the end-effector:
   $$x_2 = x - L_3\cos\phi, \quad y_2 = y - L_3\sin\phi$$
3. For $(x, y)$ to be in the dextrous workspace, $(x_2, y_2)$ must be reachable by the first two links $(L_1, L_2)$ for **every** $\phi \in [0, 2\pi)$.
4. The reachable workspace of the 2-link subchain $(L_1, L_2)$ is:
   $$|L_1 - L_2| \le \sqrt{x_2^2 + y_2^2} \le L_1 + L_2$$
   Here, $|2.0 - 1.5| = 0.5\text{ m}$ and $2.0 + 1.5 = 3.5\text{ m}$.
5. As $\phi$ varies over $[0, 2\pi)$, $(x_2, y_2)$ traces a circle of radius $L_3 = 0.8\text{ m}$ centered at $(x, y)$.
6. By triangle inequality, the entire circle of radius $L_3$ lies inside the annulus $[0.5, 3.5]$ if and only if:
   $$r + L_3 \le L_1 + L_2 \implies r \le 3.5 - 0.8 = 2.7\text{ m}$$
   and
   $$r - L_3 \ge |L_1 - L_2| \implies r \ge 0.5 + 0.8 = 1.3\text{ m}$$
7. The dextrous workspace is an annulus:
   $$\mathcal{W}_D = \{ (x, y) \in \mathbb{R}^2 \mid 1.3\text{ m} \le \sqrt{x^2 + y^2} \le 2.7\text{ m} \}$$

---

### Problem 1.20: Closed-Loop Vector Loop-Closure Kinematics
**Problem Statement:** A planar four-bar mechanism has ground link length $L_0 = 4.0\text{ m}$, input crank $L_1 = 2.0\text{ m}$, coupler link $L_2 = 3.0\text{ m}$, and follower link $L_3 = 3.0\text{ m}$. Formulate the complex exponential loop-closure equation and express the system of 2 non-linear algebraic equations in terms of joint angles $\theta_1, \theta_2, \theta_3$.

**Solution:**
1. Represent each link as a 2D planar vector in the complex plane $\mathbb{C}$:
   $$\vec{r}_k = L_k e^{i\theta_k} = L_k (\cos\theta_k + i\sin\theta_k)$$
2. The closed kinematic loop requires the vector sum along the closed chain to vanish:
   $$L_1 e^{i\theta_1} + L_2 e^{i\theta_2} - L_3 e^{i\theta_3} - L_0 = 0$$
3. Separate real and imaginary components:
   - Real part ($x$-projection):
     $$L_1 \cos\theta_1 + L_2 \cos\theta_2 - L_3 \cos\theta_3 - L_0 = 0$$
   - Imaginary part ($y$-projection):
     $$L_1 \sin\theta_1 + L_2 \sin\theta_2 - L_3 \sin\theta_3 = 0$$
4. Substitute numerical link lengths:
   $$2.0\cos\theta_1 + 3.0\cos\theta_2 - 3.0\cos\theta_3 - 4.0 = 0$$
   $$2.0\sin\theta_1 + 3.0\sin\theta_2 - 3.0\sin\theta_3 = 0$$
5. For any given input crank angle $\theta_1$, this constitutes a system of 2 non-linear algebraic equations in 2 unknowns $(\theta_2, \theta_3)$, confirming mobility $M = 3 - 2 = 1$.
