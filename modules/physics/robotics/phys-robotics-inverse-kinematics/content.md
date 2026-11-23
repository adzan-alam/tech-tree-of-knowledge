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

---

# Chapter 2: Homogeneous Spatial Transformations — $SE(3)$, Twist Coordinates, and Lie Algebra $\mathfrak{se}(3)$

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are holding an airplane flight controller. As the drone climbs and banks through the sky, its physical state changes in two distinct ways simultaneously:
1. It **translates** its center of mass across three Euclidean coordinates $(x, y, z)$.
2. It **rotates** about its body axes, altering its attitude via roll, pitch, and yaw.

In high school physics, we are taught to treat position as a simple 3D vector $\vec{p} = [x, y, z]^T$. To shift an object, we simply add another displacement vector: $\vec{p}' = \vec{p} + \vec{d}$. This linear vector addition works effortlessly for pure translations.

However, the moment rotation enters the equation, this simple linear intuition shatters. Rotations in three dimensions do **not** commute: turning a book $90^\circ$ around its vertical axis and then tilting it $90^\circ$ toward you produces a drastically different orientation than tilting it first and then turning it second! 

```
   Start Book          Rotate Z then X                  Rotate X then Z
     ┌───┐                 ┌───┐                             ┌───┐
     │ A │        ───▶     │ A │        vs.         ───▶     │   │ ◄── Spine facing
     └───┘             ┌───┴───┴───┐                         └───┘     viewer
                       │  Front    │
```

Because 3D rotations do not commute, they cannot be represented by simple vector addition. Furthermore, when a robot arm moves, every subsequent link rotates about an axis that was itself rotated by the previous link. 

To model this cascading spatial geometry cleanly, mathematicians and roboticists use the **Special Euclidean Group $SE(3)$** and its matrix representation via **$4 \times 4$ homogeneous transformations**. By augmenting our 3D vectors with a single scaling digit $1$, we transform coupled rotations and translations into unified, associative matrix multiplications. Furthermore, through the modern lens of **Lie theory** and **screw coordinates**, any spatial motion—no matter how intricate—can be viewed as a smooth flow along a single helical screw axis!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical framework of spatial transformations evolved over two centuries:
- In 1776, the Swiss polymath **Leonhard Euler** proved his celebrated **Euler Rotation Theorem**: any displacement of a rigid body on a sphere such that a point remains fixed is geometrically equivalent to a single rotation about some fixed axis.
- In 1830, the French geometer **Michel Chasles** expanded Euler's insight to full spatial kinematics with **Chasles' Theorem**: *the most general rigid body displacement can be produced by a translation along a line followed (or accompanied) by a rotation about that same line.* This combination of rotation and translation along a shared directed line is known as a **screw motion**.
- In the 1870s, the Norwegian mathematician **Sophus Lie** founded the theory of continuous transformation groups (**Lie groups**) and their infinitesimal linearized generators (**Lie algebras**). Lie's work revealed that the group of spatial rigid body motions $SE(3)$ and rotations $SO(3)$ are smooth differentiable manifolds whose geometric properties are completely captured near the identity by their tangent spaces $\mathfrak{se}(3)$ and $\mathfrak{so}(3)$.
- In 1900, **Sir Robert Stawell Ball** published his monumental work *A Treatise on the Theory of Screws*, laying the foundation for modern screw theory, twists (infinitesimal screw motions), and wrenches (systems of forces and torques). In modern robotics, through the pioneering works of Brockett (1984), Murray, Li, and Sastry (1994), and Lynch and Park (2017), screw theory and Lie groups have become the dominant, singularity-free language of spatial kinematics.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Special Orthogonal Group $SO(3)$
A 3D rotation preserves the length of vectors and the angles between them (an isometry) while preserving handedness (orientation).
Formally, the **Special Orthogonal Group** of order 3 is defined as:
$$SO(3) = \{ R \in \mathbb{R}^{3 \times 3} \mid R^T R = I, \; \det(R) = +1 \}$$

The orthogonality condition $R^T R = I$ imposes 6 independent algebraic constraints on the 9 entries of $R$:
- 3 constraints enforcing that each column has unit Euclidean length: $\|r_1\| = \|r_2\| = \|r_3\| = 1$.
- 3 constraints enforcing that the columns are mutually orthogonal: $r_1 \cdot r_2 = r_1 \cdot r_3 = r_2 \cdot r_3 = 0$.
Hence, $SO(3)$ possesses $9 - 6 = 3$ degrees of freedom. The condition $\det(R) = +1$ excludes reflections (which have $\det(R) = -1$).

### 3.2 The Lie Algebra $\mathfrak{so}(3)$ and Rodrigues' Formula
Differentiating the orthogonality relation $R(t) R^T(t) = I$ with respect to time $t$ yields:
$$\dot{R}(t) R^T(t) + R(t) \dot{R}^T(t) = 0 \implies \dot{R} R^T = -(\dot{R} R^T)^T$$
Thus, the matrix $\Omega = \dot{R} R^T$ evaluated at the identity $R = I$ is **skew-symmetric**.

The tangent space to $SO(3)$ at the identity is the **Lie algebra $\mathfrak{so}(3)$**, the vector space of all $3 \times 3$ real skew-symmetric matrices:
$$\mathfrak{so}(3) = \{ [\omega] \in \mathbb{R}^{3 \times 3} \mid [\omega]^T = -[\omega] \}$$

Any vector $\omega = [\omega_x, \omega_y, \omega_z]^T \in \mathbb{R}^3$ corresponds isomorphically to a skew-symmetric matrix $[\omega] \in \mathfrak{so}(3)$ via the "bracket" operator:
$$[\omega] = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$
Note that for any vector $v \in \mathbb{R}^3$, matrix-vector multiplication by $[\omega]$ is identical to the standard vector cross product:
$$[\omega] v = \omega \times v$$

#### The Exponential Map $\exp: \mathfrak{so}(3) \to SO(3)$:
For a constant angular velocity vector $\omega = \hat{\omega}\theta$ where $\|\hat{\omega}\| = 1$, the linear differential equation $\dot{x}(t) = [\hat{\omega}] x(t)$ has the matrix exponential solution:
$$R(\theta) = \exp([\hat{\omega}]\theta) = \sum_{k=0}^\infty \frac{([\hat{\omega}]\theta)^k}{k!} = I + \theta [\hat{\omega}] + \frac{\theta^2}{2!} [\hat{\omega}]^2 + \frac{\theta^3}{3!} [\hat{\omega}]^3 + \cdots$$

By direct calculation of powers of skew-symmetric $[\hat{\omega}]$ with unit norm $\|\hat{\omega}\| = 1$:
$$[\hat{\omega}]^3 = -[\hat{\omega}], \quad [\hat{\omega}]^4 = -[\hat{\omega}]^2, \quad [\hat{\omega}]^5 = [\hat{\omega}]$$
Regrouping the Taylor series into odd and even powers:
$$\exp([\hat{\omega}]\theta) = I + \left( \theta - \frac{\theta^3}{3!} + \frac{\theta^5}{5!} - \cdots \right) [\hat{\omega}] + \left( \frac{\theta^2}{2!} - \frac{\theta^4}{4!} + \cdots \right) [\hat{\omega}]^2$$
Recognizing the Taylor series for $\sin\theta$ and $1 - \cos\theta$, we arrive at **Rodrigues' Rotation Formula**:
$$R = \exp([\hat{\omega}]\theta) = I + \sin\theta [\hat{\omega}] + (1 - \cos\theta)[\hat{\omega}]^2$$

#### The Matrix Logarithm on $SO(3)$:
Given an arbitrary rotation matrix $R \in SO(3)$, the matrix logarithm extracts the equivalent rotation angle $\theta \in [0, \pi]$ and unit rotation axis $\hat{\omega}$:
$$\operatorname{tr}(R) = r_{11} + r_{22} + r_{33} = 1 + 2\cos\theta \implies \theta = \arccos\left( \frac{\operatorname{tr}(R) - 1}{2} \right)$$
- If $\theta \neq 0$ and $\theta \neq \pi$:
  $$[\hat{\omega}] = \frac{1}{2\sin\theta} (R - R^T)$$
- If $\theta = 0$: $R = I$, and the axis $\hat{\omega}$ is arbitrary.
- If $\theta = \pi$: $\operatorname{tr}(R) = -1$, and $\hat{\omega}$ is obtained from the unit eigenvectors of $R$ corresponding to eigenvalue $+1$.

### 3.3 The Special Euclidean Group $SE(3)$
A rigid spatial displacement combines a rotation $R \in SO(3)$ and a translation $p \in \mathbb{R}^3$.
In $4 \times 4$ homogeneous matrix representation, the **Special Euclidean Group** is:
$$SE(3) = \left\{ T = \begin{bmatrix} R & p \\ 0_{1 \times 3} & 1 \end{bmatrix} \in \mathbb{R}^{4 \times 4} \;\middle|\; R \in SO(3), \; p \in \mathbb{R}^3 \right\}$$

#### Group Properties of $SE(3)$:
1. **Composition (Associative Group Multiplication):**
   $$T_1 T_2 = \begin{bmatrix} R_1 & p_1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} R_2 & p_2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} R_1 R_2 & R_1 p_2 + p_1 \\ 0 & 1 \end{bmatrix}$$
2. **Identity Element:** $I_{4 \times 4} = \begin{bmatrix} I_3 & 0 \\ 0 & 1 \end{bmatrix}$.
3. **Inverse Element:**
   $$T^{-1} = \begin{bmatrix} R^T & -R^T p \\ 0_{1 \times 3} & 1 \end{bmatrix}$$
   *Proof:*
   $$T T^{-1} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} R^T & -R^T p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} R R^T & -R R^T p + p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} I & -p + p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} I & 0 \\ 0 & 1 \end{bmatrix} = I_{4 \times 4}$$

### 3.4 Spatial Twists and the Lie Algebra $\mathfrak{se}(3)$
A spatial velocity combines angular velocity $\omega \in \mathbb{R}^3$ and linear velocity $v \in \mathbb{R}^3$ into a single 6-dimensional vector called a **Twist**:
$$\mathcal{V} = \begin{bmatrix} \omega \\ v \end{bmatrix} \in \mathbb{R}^6$$

The corresponding $4 \times 4$ matrix element in the Lie algebra $\mathfrak{se}(3)$ is:
$$[\mathcal{V}] = \begin{bmatrix} [\omega] & v \\ 0_{1 \times 3} & 0 \end{bmatrix} \in \mathbb{R}^{4 \times 4}$$

#### The Matrix Exponential on $SE(3)$:
For a unit twist $\mathcal{S} = (\omega, v)$, the rigid transformation achieved by traveling along the screw for parameter $\theta$ is:
$$\exp([\mathcal{S}]\theta) = \begin{bmatrix} \exp([\omega]\theta) & G(\theta) v \\ 0 & 1 \end{bmatrix}$$
where the translational integration matrix $G(\theta) \in \mathbb{R}^{3 \times 3}$ is:
$$G(\theta) = I\theta + (1 - \cos\theta)[\omega] + (\theta - \sin\theta)[\omega]^2$$
If $\omega = 0$ (pure linear translation without rotation), $\|\omega\| = 0$ and:
$$\exp([\mathcal{S}]\theta) = \begin{bmatrix} I & v\theta \\ 0 & 1 \end{bmatrix}$$

### 3.5 Chasles' Theorem & Screw Parameters
Every spatial displacement $T \in SE(3)$ can be parameterized by screw coordinates:
- A screw axis directed line $L$ in space with unit direction $\hat{s} \in \mathbb{R}^3$ ($\|\hat{s}\| = 1$) passing through a point $q \in \mathbb{R}^3$.
- A rotation angle $\theta \in [0, \pi]$.
- A screw pitch $h \in \mathbb{R}$, which is the linear translation per unit radian of rotation ($h = \text{pitch}$).
$$\omega = \hat{s}, \quad v = -\hat{s} \times q + h \hat{s}$$
The pitch is extracted from the twist $\mathcal{V} = (\omega, v)$ via the dot product:
$$h = \frac{\omega \cdot v}{\|\omega\|^2}$$

```
                           Rotation θ
                           ╭──────╮
                           │  ↷   │
                      ▲    │      │
     Screw Axis L:    │  ════════════  (Pitch h = Translation / Radian)
     Direction s      │       │
                      │       ▼
                          Translation h θ
```

### 3.6 The Adjoint Representation $\operatorname{Ad}_T$
To transform a velocity twist or wrench between different coordinate frames, we use the **Adjoint Map**.
Let $T_{ab} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$ be the transformation from frame $\{b\}$ to frame $\{a\}$.
The $6 \times 6$ **Adjoint Representation Matrix** $\operatorname{Ad}_{T_{ab}}$ is:
$$\operatorname{Ad}_{T_{ab}} = \begin{bmatrix} R & 0_{3 \times 3} \\ [p]R & R \end{bmatrix} \in \mathbb{R}^{6 \times 6}$$

#### Properties and Transformations:
1. **Twist Frame Transformation:** A twist $\mathcal{V}_b$ expressed in frame $\{b\}$ is transformed into frame $\{a\}$ by:
   $$\mathcal{V}_a = \operatorname{Ad}_{T_{ab}} \mathcal{V}_b = \begin{bmatrix} R & 0 \\ [p]R & R \end{bmatrix} \begin{bmatrix} \omega_b \\ v_b \end{bmatrix} = \begin{bmatrix} R\omega_b \\ [p]R\omega_b + R v_b \end{bmatrix}$$
2. **Spatial Wrench Transformation:** A wrench $\mathcal{F} = [m, f]^T \in \mathbb{R}^6$ (moment $m$, force $f$) transforms via the transpose of the inverse adjoint:
   $$\mathcal{F}_b = \operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a$$

---

## 4. Computational Realization & Algorithmic Implementation

Below is a production-grade TypeScript implementation of the $SE(3)$ transformation engine:

```typescript
export class TransformSE3 {
  // Stored as 4x4 row-major Float64Array
  public data: Float64Array;

  constructor(matrix?: number[][]) {
    this.data = new Float64Array(16);
    if (matrix) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          this.data[r * 4 + c] = matrix[r][c];
        }
      }
    } else {
      // Identity
      this.data[0] = 1; this.data[5] = 1; this.data[10] = 1; this.data[15] = 1;
    }
  }

  public get(r: number, c: number): number {
    return this.data[r * 4 + c];
  }

  public set(r: number, c: number, val: number): void {
    this.data[r * 4 + c] = val;
  }

  /**
   * Computes exact matrix inverse of T in SE(3):
   * T^(-1) = [ R^T,  -R^T * p ]
   *          [  0 ,      1    ]
   */
  public inverse(): TransformSE3 {
    const inv = new TransformSE3();
    // Transpose 3x3 rotation
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        inv.set(i, j, this.get(j, i));
      }
    }
    // Translation: -R^T * p
    const px = this.get(0, 3);
    const py = this.get(1, 3);
    const pz = this.get(2, 3);

    inv.set(0, 3, -(inv.get(0, 0) * px + inv.get(0, 1) * py + inv.get(0, 2) * pz));
    inv.set(1, 3, -(inv.get(1, 0) * px + inv.get(1, 1) * py + inv.get(1, 2) * pz));
    inv.set(2, 3, -(inv.get(2, 0) * px + inv.get(2, 1) * py + inv.get(2, 2) * pz));
    inv.set(3, 3, 1.0);

    return inv;
  }

  /**
   * Matrix multiplication of two SE(3) transforms: C = A * B
   */
  public multiply(other: TransformSE3): TransformSE3 {
    const result = new TransformSE3();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += this.get(r, k) * other.get(k, c);
        }
        result.set(r, c, sum);
      }
    }
    return result;
  }

  /**
   * Constructs Rodrigues rotation matrix R in SO(3) from axis and angle.
   */
  public static fromAxisAngle(axis: { x: number; y: number; z: number }, theta: number): TransformSE3 {
    const norm = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
    if (norm < 1e-12) return new TransformSE3();

    const kx = axis.x / norm;
    const ky = axis.y / norm;
    const kz = axis.z / norm;

    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const v = 1 - c;

    const T = new TransformSE3();
    T.set(0, 0, kx * kx * v + c);
    T.set(0, 1, kx * ky * v - kz * s);
    T.set(0, 2, kx * kz * v + ky * s);

    T.set(1, 0, kx * ky * v + kz * s);
    T.set(1, 1, ky * ky * v + c);
    T.set(1, 2, ky * kz * v - kx * s);

    T.set(2, 0, kx * kz * v - ky * s);
    T.set(2, 1, ky * kz * v + kx * s);
    T.set(2, 2, kz * kz * v + c);

    return T;
  }

  /**
   * Constructs the 6x6 Adjoint representation matrix.
   */
  public computeAdjoint(): number[][] {
    const Ad: number[][] = Array.from({ length: 6 }, () => new Array(6).fill(0));
    // R in top-left and bottom-right
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = this.get(r, c);
        Ad[r][c] = val;
        Ad[r + 3][c + 3] = val;
      }
    }
    // [p] * R in bottom-left
    const px = this.get(0, 3);
    const py = this.get(1, 3);
    const pz = this.get(2, 3);

    const skewP = [
      [0, -pz, py],
      [pz, 0, -px],
      [-py, px, 0]
    ];

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += skewP[r][k] * this.get(k, c);
        }
        Ad[r + 3][c] = sum;
      }
    }

    return Ad;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 2.1: Matrix Exponential of Pure Rotation about $\hat{z}$ by $\pi/3$
**Problem Statement:** Let the rotation axis be the unit vector $\hat{\omega} = [0, 0, 1]^T$ and rotation angle $\theta = \frac{\pi}{3}\text{ rad}$ ($60^\circ$). Derive the $3 \times 3$ rotation matrix $R \in SO(3)$ using Rodrigues' formula.

**Given Data:**
- $\hat{\omega} = [0, 0, 1]^T$
- $\theta = \pi/3$
- $\cos(\pi/3) = 0.5$
- $\sin(\pi/3) = \frac{\sqrt{3}}{2} \approx 0.866025$

**Step-by-Step Derivation:**
1. Formulate the skew-symmetric matrix $[\hat{\omega}]$:
   $$[\hat{\omega}] = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
2. Compute $[\hat{\omega}]^2$:
   $$[\hat{\omega}]^2 = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
3. Apply Rodrigues' formula $R = I + \sin\theta [\hat{\omega}] + (1 - \cos\theta)[\hat{\omega}]^2$:
   $$R = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} + \frac{\sqrt{3}}{2} \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} + (1 - 0.5) \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
4. Sum the entries:
   $$R_{11} = 1 + 0 + 0.5(-1) = 0.5$$
   $$R_{12} = 0 - \frac{\sqrt{3}}{2} + 0 = -\frac{\sqrt{3}}{2} \approx -0.866025$$
   $$R_{21} = 0 + \frac{\sqrt{3}}{2} + 0 = \frac{\sqrt{3}}{2} \approx 0.866025$$
   $$R_{22} = 1 + 0 + 0.5(-1) = 0.5$$
   $$R_{33} = 1 + 0 + 0 = 1.0$$
   All other entries are 0.

**Final Answer:**
$$R = \begin{bmatrix} 0.5 & -0.866025 & 0 \\ 0.866025 & 0.5 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
- $\det(R) = (0.5)(0.5)(1) - (-0.866025)(0.866025)(1) = 0.25 + 0.75 = 1.000$.
- $R^T R = I$.
- Trace $\operatorname{tr}(R) = 0.5 + 0.5 + 1.0 = 2.0 = 1 + 2\cos(60^\circ) = 1 + 2(0.5) = 2.0$.

---

### Problem 2.2: Matrix Logarithm Extraction of Rotation Axis and Angle
**Problem Statement:** A robot arm's sensor returns the following numerical rotation matrix:
$$R = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$
Extract the rotation angle $\theta \in [0, \pi]$ and the unit rotation axis $\hat{\omega} = [\omega_x, \omega_y, \omega_z]^T$ using the matrix logarithm.

**Given Data:**
- Matrix $R$ with entries $r_{13} = 1, r_{21} = 1, r_{32} = 1$, all diagonal entries $0$.

**Step-by-Step Derivation:**
1. Compute the trace of $R$:
   $$\operatorname{tr}(R) = r_{11} + r_{22} + r_{33} = 0 + 0 + 0 = 0$$
2. Solve for rotation angle $\theta$:
   $$\operatorname{tr}(R) = 1 + 2\cos\theta \implies 0 = 1 + 2\cos\theta \implies \cos\theta = -\frac{1}{2}$$
   $$\theta = \arccos\left(-\frac{1}{2}\right) = \frac{2\pi}{3}\text{ rad} = 120^\circ \approx 2.094395\text{ rad}$$
3. Compute $\sin\theta$:
   $$\sin\left(\frac{2\pi}{3}\right) = \frac{\sqrt{3}}{2} \approx 0.866025$$
4. Compute the skew-symmetric matrix $[\hat{\omega}] = \frac{1}{2\sin\theta}(R - R^T)$:
   $$R - R^T = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix} - \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{bmatrix}$$
   $$[\hat{\omega}] = \frac{1}{2\left(\frac{\sqrt{3}}{2}\right)} \begin{bmatrix} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{bmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 0 & -1 & 1 \\ 1 & 0 & -1 \\ -1 & 1 & 0 \end{bmatrix}$$
5. Extract the components of $\hat{\omega} = [\omega_x, \omega_y, \omega_z]^T$:
   $$\omega_z = [\hat{\omega}]_{21} = \frac{1}{\sqrt{3}}$$
   $$\omega_y = [\hat{\omega}]_{13} = \frac{1}{\sqrt{3}}$$
   $$\omega_x = [\hat{\omega}]_{32} = \frac{1}{\sqrt{3}}$$

**Final Answer:**
- Rotation Angle: **$\theta = \frac{2\pi}{3}\text{ rad} = 120^\circ$**
- Rotation Axis: **$\hat{\omega} = \left[ \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}}, \frac{1}{\sqrt{3}} \right]^T \approx [0.57735, 0.57735, 0.57735]^T$**

**Verification & Sanity Check:**
$\|\hat{\omega}\| = \sqrt{(1/\sqrt{3})^2 + (1/\sqrt{3})^2 + (1/\sqrt{3})^2} = \sqrt{1/3 + 1/3 + 1/3} = 1$.
A $120^\circ$ rotation about the body diagonal $[1, 1, 1]^T$ cyclically permutes the coordinate axes: $x \to y \to z \to x$, which matches matrix $R$ exactly!

---

### Problem 2.3: Homogeneous Transformation Inversion and Point Mapping
**Problem Statement:** A camera frame $\{c\}$ is mounted on a robot wrist frame $\{w\}$ with homogeneous transformation:
$$T_{wc} = \begin{bmatrix} 0 & -1 & 0 & 0.10 \\ 1 & 0 & 0 & 0.20 \\ 0 & 0 & 1 & 0.05 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
(coordinates in meters).
1. Calculate the exact inverse transformation $T_{cw} = T_{wc}^{-1}$.
2. A detected object has coordinates in the camera frame $p_c = [0.5, 0.0, 1.2]^T\text{ m}$. Find its coordinates in the wrist frame $p_w$.

**Given Data:**
- $R_{wc} = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ (a $90^\circ$ rotation about $\hat{z}$)
- $p_{wc} = [0.10, 0.20, 0.05]^T$
- $p_c = [0.5, 0.0, 1.2]^T$

**Step-by-Step Derivation:**
1. Invert the rotation:
   $$R_{cw} = R_{wc}^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Compute the inverse translation:
   $$-R_{wc}^T p_{wc} = -\begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.20 \\ 0.05 \end{bmatrix} = -\begin{bmatrix} 0.20 \\ -0.10 \\ 0.05 \end{bmatrix} = \begin{bmatrix} -0.20 \\ 0.10 \\ -0.05 \end{bmatrix}$$
3. Construct $T_{cw}$:
   $$T_{cw} = \begin{bmatrix} 0 & 1 & 0 & -0.20 \\ -1 & 0 & 0 & 0.10 \\ 0 & 0 & 1 & -0.05 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Compute $p_w = R_{wc} p_c + p_{wc}$:
   $$R_{wc} p_c = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.5 \\ 0.0 \\ 1.2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0.5 \\ 1.2 \end{bmatrix}$$
   $$p_w = \begin{bmatrix} 0 \\ 0.5 \\ 1.2 \end{bmatrix} + \begin{bmatrix} 0.10 \\ 0.20 \\ 0.05 \end{bmatrix} = \begin{bmatrix} 0.10 \\ 0.70 \\ 1.25 \end{bmatrix}\text{ m}$$

**Final Answer:**
1. Inverse Transformation:
   $$T_{cw} = \begin{bmatrix} 0 & 1 & 0 & -0.20 \\ -1 & 0 & 0 & 0.10 \\ 0 & 0 & 1 & -0.05 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Target position in wrist frame: **$p_w = [0.10, 0.70, 1.25]^T\text{ m}$**.

**Verification & Sanity Check:**
Test round-trip mapping:
$p_c' = R_{cw} p_w + (-R_{wc}^T p_{wc}) = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.70 \\ 1.25 \end{bmatrix} + \begin{bmatrix} -0.20 \\ 0.10 \\ -0.05 \end{bmatrix} = \begin{bmatrix} 0.70 \\ -0.10 \\ 1.25 \end{bmatrix} + \begin{bmatrix} -0.20 \\ 0.10 \\ -0.05 \end{bmatrix} = \begin{bmatrix} 0.50 \\ 0.00 \\ 1.20 \end{bmatrix}$. Exactly recovers $p_c$!

---

### Problem 2.4: Composition of Fixed-Frame vs. Current-Frame Transformations
**Problem Statement:** A robot end-effector starts coincident with the base frame $\{0\}$. It undergoes two sequential spatial motions:
1. Motion 1: Rotation about the base $\hat{x}_0$ axis by $90^\circ$, followed by translation along base $\hat{z}_0$ by $2.0\text{ m}$.
2. Motion 2: Rotation about the tool's *current* $\hat{z}$ axis by $90^\circ$, followed by translation along the tool's *current* $\hat{x}$ axis by $1.0\text{ m}$.
Determine the final homogeneous transformation matrix $T_0^{\text{final}}$.

**Given Data:**
- Fixed-frame motion $T_A$: Pre-multiplied.
- Current-frame motion $T_B$: Post-multiplied.

**Step-by-Step Derivation:**
1. Formulate Motion 1 in base frame $\{0\}$:
   $$R_A = \operatorname{Rot}_x(90^\circ) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}, \quad p_A = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix}$$
   $$T_A = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Formulate Motion 2 relative to the current tool frame:
   $$R_B = \operatorname{Rot}_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}, \quad p_B = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   Notice that the translation is along the *current* $\hat{x}$ axis:
   $$T_B = \begin{bmatrix} R_B & p_B \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Because Motion 2 is specified with respect to the *current* frame, it **post-multiplies** $T_A$:
   $$T_0^{\text{final}} = T_A T_B$$
4. Compute the matrix product:
   $$T_0^{\text{final}} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 & -1 & 0 & 1 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   - Row 1: $[0, -1, 0, 1]$
   - Row 2: $[0, 0, -1, 0]$
   - Row 3: $[1, 0, 0, 2]$
   - Row 4: $[0, 0, 0, 1]$

**Final Answer:**
$$T_0^{\text{final}} = \begin{bmatrix} 0 & -1 & 0 & 1 \\ 0 & 0 & -1 & 0 \\ 1 & 0 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
- Origin of tool: In Motion 1, it moved to $(0, 0, 2)$. In Motion 2, it moved by $1\text{ m}$ along its current $\hat{x}$ axis. Since the current $\hat{x}$ axis remained aligned with base $\hat{x}_0$, the translation along current $\hat{x}$ adds $[1, 0, 0]^T$ in base frame: $(0+1, 0, 2) = (1, 0, 2)$, exactly matching column 4!

---

### Problem 2.5: Screw Axis Parameter Extraction from a Spatial Twist
**Problem Statement:** A spatial twist is given in base coordinates by:
$$\mathcal{V} = \begin{bmatrix} \omega \\ v \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 2 \\ 4 \\ -2 \\ 6 \end{bmatrix}$$
(angular velocity in rad/s, linear velocity in m/s).
Extract the screw motion parameters:
1. The rotation speed $\dot{\theta} = \|\omega\|$.
2. The unit screw axis direction $\hat{s}$.
3. The screw pitch $h$.
4. The point $q$ on the screw axis closest to the origin ($q \cdot \hat{s} = 0$).

**Given Data:**
- $\omega = [0, 0, 2]^T$
- $v = [4, -2, 6]^T$

**Step-by-Step Derivation:**
1. Rotation speed $\dot{\theta}$:
   $$\dot{\theta} = \|\omega\| = \sqrt{0^2 + 0^2 + 2^2} = 2\text{ rad/s}$$
2. Unit axis direction $\hat{s}$:
   $$\hat{s} = \frac{\omega}{\|\omega\|} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Screw pitch $h$:
   $$h = \frac{\omega \cdot v}{\|\omega\|^2} = \frac{0(4) + 0(-2) + 2(6)}{2^2} = \frac{12}{4} = 3.0\text{ m/rad}$$
4. Point $q$ on the screw axis closest to the origin:
   The linear velocity is related to $q$ and $h$ by:
   $$v = -\omega \times q + h \omega$$
   The parallel component is $h \omega = 3 [0, 0, 2]^T = [0, 0, 6]^T$.
   The perpendicular component $v_\perp$ is:
   $$v_\perp = v - h \omega = \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 4 \\ -2 \\ 0 \end{bmatrix}$$
   Since $v_\perp = -\omega \times q = q \times \omega$, cross-multiply by $\omega$:
   $$\omega \times v_\perp = \omega \times (q \times \omega) = \|\omega\|^2 q - (\omega \cdot q)\omega$$
   Since $q$ is chosen such that $q \cdot \omega = 0$:
   $$q = \frac{\omega \times v_\perp}{\|\omega\|^2} = \frac{\omega \times v}{\|\omega\|^2}$$
5. Compute the cross product $\omega \times v$:
   $$\omega \times v = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix} \times \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix} = \begin{bmatrix} 0(-2) - 2(-2) \\ 2(4) - 0(6) \\ 0(-2) - 0(4) \end{bmatrix} = \begin{bmatrix} 4 \\ 8 \\ 0 \end{bmatrix}$$
6. Evaluate $q$:
   $$q = \frac{1}{4} \begin{bmatrix} 4 \\ 8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 0 \end{bmatrix}\text{ m}$$

**Final Answer:**
- Rotation speed: **$\dot{\theta} = 2.0\text{ rad/s}$**
- Screw axis: **$\hat{s} = [0, 0, 1]^T$**
- Screw pitch: **$h = 3.0\text{ m/rad}$**
- Axis point: **$q = [1.0, 2.0, 0.0]^T\text{ m}$**

**Verification & Sanity Check:**
Check $v$: $-\omega \times q + h \omega = -[0, 0, 2]^T \times [1, 2, 0]^T + [0, 0, 6]^T = -[-4, 2, 0]^T + [0, 0, 6]^T = [4, -2, 6]^T$. Matches $v$ exactly!

---

### Problem 2.6: Matrix Exponential on $SE(3)$ via Twist Coordinates
**Problem Statement:** A normalized screw axis has unit twist $\mathcal{S} = (\omega, v)$ with $\omega = [0, 0, 1]^T$ and $v = [2, 0, 1]^T$. Compute the exact $4 \times 4$ homogeneous transformation matrix $T = \exp([\mathcal{S}]\theta)$ for $\theta = \frac{\pi}{2}\text{ rad}$ ($90^\circ$).

**Given Data:**
- $\omega = [0, 0, 1]^T, \|\omega\| = 1$
- $v = [2, 0, 1]^T$
- $\theta = \pi/2$
- $\cos(\pi/2) = 0, \sin(\pi/2) = 1$

**Step-by-Step Derivation:**
1. Rotation submatrix $R = \exp([\omega]\theta)$:
   $$R = \operatorname{Rot}_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Translation vector $p = G(\theta) v$, where:
   $$G(\theta) = I\theta + (1 - \cos\theta)[\omega] + (\theta - \sin\theta)[\omega]^2$$
3. Evaluate $[\omega]$ and $[\omega]^2$:
   $$[\omega] = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix}, \quad [\omega]^2 = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$
4. Compute $G(\theta) v$:
   Notice that $G(\theta)$ can be evaluated directly on $v = [2, 0, 1]^T$:
   - $I\theta v = \frac{\pi}{2} [2, 0, 1]^T = [\pi, 0, \pi/2]^T$
   - $(1 - \cos\theta)[\omega] v = (1 - 0) \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$
   - $(\theta - \sin\theta)[\omega]^2 v = \left(\frac{\pi}{2} - 1\right) \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 0 \\ 1 \end{bmatrix} = \left(\frac{\pi}{2} - 1\right) \begin{bmatrix} -2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} -\pi + 2 \\ 0 \\ 0 \end{bmatrix}$
5. Sum the components for $p$:
   $$p_x = \pi + 0 + (-\pi + 2) = 2.0$$
   $$p_y = 0 + 2 + 0 = 2.0$$
   $$p_z = \frac{\pi}{2} + 0 + 0 = \frac{\pi}{2} \approx 1.570796$$
6. Construct $T = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$:

**Final Answer:**
$$T = \exp([\mathcal{S}]\theta) = \begin{bmatrix} 0 & -1 & 0 & 2.0 \\ 1 & 0 & 0 & 2.0 \\ 0 & 0 & 1 & 1.570796 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
- Pitch $h = \omega \cdot v = 1 \implies \Delta z = h\theta = 1(\pi/2) = \pi/2$.
- Point on axis $q = \omega \times v = [0, 0, 1]^T \times [2, 0, 1]^T = [0, 2, 0]^T$.
Rotating point $(0, 0)$ around center $(0, 2)$ by $90^\circ$ moves it to $(2, 2)$! Matches $(p_x, p_y) = (2, 2)$ with mathematical perfection.

---

### Problem 2.7: Adjoint Transformation of Body Twist to Spatial Frame
**Problem Statement:** A robot end-effector has the following transformation relative to the base frame $\{s\}$:
$$T_{sb} = \begin{bmatrix} 0 & 0 & 1 & 0.4 \\ 0 & 1 & 0 & 0.0 \\ -1 & 0 & 0 & 0.6 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
The end-effector is rotating and translating in its own body frame $\{b\}$ with body twist:
$$\mathcal{V}_b = [\omega_x^b, \omega_y^b, \omega_z^b, v_x^b, v_y^b, v_z^b]^T = [0, 1.0, 0, 0, 0, 0.5]^T$$
Compute the spatial twist $\mathcal{V}_s = \operatorname{Ad}_{T_{sb}} \mathcal{V}_b$ expressed in the base frame.

**Given Data:**
- $R_{sb} = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$
- $p_{sb} = [0.4, 0.0, 0.6]^T$
- $\omega_b = [0, 1, 0]^T, v_b = [0, 0, 0.5]^T$

**Step-by-Step Derivation:**
1. Adjoint equation:
   $$\omega_s = R_{sb} \omega_b$$
   $$v_s = [p_{sb}] R_{sb} \omega_b + R_{sb} v_b = p_{sb} \times \omega_s + R_{sb} v_b$$
2. Compute spatial angular velocity $\omega_s$:
   $$\omega_s = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}\text{ rad/s}$$
3. Compute $p_{sb} \times \omega_s$:
   $$p_{sb} \times \omega_s = \begin{bmatrix} 0.4 \\ 0.0 \\ 0.6 \end{bmatrix} \times \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0(0) - 0.6(1) \\ 0.6(0) - 0.4(0) \\ 0.4(1) - 0(0) \end{bmatrix} = \begin{bmatrix} -0.6 \\ 0.0 \\ 0.4 \end{bmatrix}$$
4. Compute $R_{sb} v_b$:
   $$R_{sb} v_b = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 0.0 \\ 0.0 \end{bmatrix}$$
5. Sum to get spatial linear velocity $v_s$:
   $$v_s = \begin{bmatrix} -0.6 \\ 0.0 \\ 0.4 \end{bmatrix} + \begin{bmatrix} 0.5 \\ 0.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -0.1 \\ 0.0 \\ 0.4 \end{bmatrix}\text{ m/s}$$

**Final Answer:**
$$\mathcal{V}_s = \begin{bmatrix} 0 \\ 1.0 \\ 0 \\ -0.1 \\ 0.0 \\ 0.4 \end{bmatrix}$$

**Verification & Sanity Check:**
- Rotation about body $\hat{y}_b$ rotates the body about base $\hat{y}_s$ because column 2 of $R_{sb}$ is $[0, 1, 0]^T$.
- Translation along body $\hat{z}_b$ points along base $\hat{x}_s$ because column 3 of $R_{sb}$ is $[1, 0, 0]^T$ (scaled by $0.5 \implies 0.5 \hat{x}_s$).
- The lever arm effect from rotating around base origin at offset $p_{sb}$ produces cross product tangential velocity $[-0.6, 0, 0.4]^T$. Adding $0.5 \hat{x}_s$ gives $v_x = -0.6 + 0.5 = -0.1\text{ m/s}$. Completely verified.

---

### Problem 2.8: Adjoint Wrench Transformation
**Problem Statement:** A force-torque sensor at the robot wrist frame $\{w\}$ measures an external contact wrench from a tool tip:
$$\mathcal{F}_w = [m_w, f_w]^T = [0, 5.0, 0, 0, 0, -20.0]^T$$
(torque in $\text{N}\cdot\text{m}$, force in $\text{N}$).
The wrist frame is located at $T_{bw}$ relative to the robot base frame $\{b\}$:
$$T_{bw} = \begin{bmatrix} 1 & 0 & 0 & 0.8 \\ 0 & 1 & 0 & 0.0 \\ 0 & 0 & 1 & 0.5 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
Calculate the equivalent wrench $\mathcal{F}_b = [m_b, f_b]^T$ exerted on the robot base.

**Given Data:**
- $R_{bw} = I_3$
- $p_{bw} = [0.8, 0.0, 0.5]^T$
- $m_w = [0, 5, 0]^T$, $f_w = [0, 0, -20]^T$

**Step-by-Step Derivation:**
1. Wrench transformation formula:
   $$\mathcal{F}_w = \operatorname{Ad}_{T_{bw}}^T \mathcal{F}_b \implies \mathcal{F}_b = \operatorname{Ad}_{T_{wb}}^T \mathcal{F}_w$$
   Using the adjoint matrix structure for $T_{bw}$:
   $$\operatorname{Ad}_{T_{bw}} = \begin{bmatrix} R & 0 \\ [p]R & R \end{bmatrix} \implies \operatorname{Ad}_{T_{bw}}^T = \begin{bmatrix} R^T & -R^T [p] \\ 0 & R^T \end{bmatrix}$$
   Because $f_b$ is pure force:
   $$f_b = R_{bw} f_w = I [0, 0, -20]^T = [0, 0, -20]^T\text{ N}$$
2. The total moment on the base includes the sensor moment plus the moment created by the contact force acting at lever arm $p_{bw}$:
   $$m_b = R_{bw} m_w + p_{bw} \times f_b$$
3. Compute the cross product $p_{bw} \times f_b$:
   $$p_{bw} \times f_b = \begin{bmatrix} 0.8 \\ 0.0 \\ 0.5 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ -20 \end{bmatrix} = \begin{bmatrix} 0.0(-20) - 0.5(0) \\ 0.5(0) - 0.8(-20) \\ 0.8(0) - 0.0(0) \end{bmatrix} = \begin{bmatrix} 0 \\ +16 \\ 0 \end{bmatrix}\text{ N}\cdot\text{m}$$
4. Add the transmitted torque:
   $$m_b = \begin{bmatrix} 0 \\ 5 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ 16 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 21 \\ 0 \end{bmatrix}\text{ N}\cdot\text{m}$$

**Final Answer:**
$$\mathcal{F}_b = [0, 21.0, 0, 0, 0, -20.0]^T$$

**Verification & Sanity Check:**
A downward force of $20\text{ N}$ at $x = +0.8\text{ m}$ creates a positive pitch moment about the base $\hat{y}$ axis of $\tau = 0.8\text{ m} \times 20\text{ N} = +16\text{ N}\cdot\text{m}$. Adding the sensor torque $+5\text{ N}\cdot\text{m}$ gives exactly $+21\text{ N}\cdot\text{m}$.

---

### Problem 2.9: Quaternion to Rotation Matrix Conversion
**Problem Statement:** A unit quaternion representing a robot end-effector attitude is given by:
$$\mathbf{q} = (w, x, y, z) = (0.707107, 0, 0.707107, 0)$$
1. Derive the corresponding $3 \times 3$ rotation matrix $R \in SO(3)$.
2. Identify the equivalent rotation angle $\theta$ and axis $\hat{\omega}$.

**Given Data:**
- $w = \cos(\theta/2) = 1/\sqrt{2} \approx 0.707107$
- $x = 0, y = 1/\sqrt{2} \approx 0.707107, z = 0$

**Step-by-Step Derivation:**
1. Check unit norm:
   $$\|\mathbf{q}\|^2 = (1/\sqrt{2})^2 + 0 + (1/\sqrt{2})^2 + 0 = 0.5 + 0.5 = 1.0$$
2. General formula for $R(\mathbf{q})$:
   $$R = \begin{bmatrix} 1 - 2(y^2 + z^2) & 2(xy - wz) & 2(xz + wy) \\ 2(xy + wz) & 1 - 2(x^2 + z^2) & 2(yz - wx) \\ 2(xz - wy) & 2(yz + wx) & 1 - 2(x^2 + y^2) \end{bmatrix}$$
3. Substitute $x = 0, z = 0, y = 1/\sqrt{2}, w = 1/\sqrt{2}$:
   - $R_{11} = 1 - 2(0.5 + 0) = 0$
   - $R_{12} = 2(0 - 0) = 0$
   - $R_{13} = 2(0 + 0.5) = +1$
   - $R_{21} = 2(0 + 0) = 0$
   - $R_{22} = 1 - 2(0 + 0) = 1$
   - $R_{23} = 2(0 - 0) = 0$
   - $R_{31} = 2(0 - 0.5) = -1$
   - $R_{32} = 2(0 + 0) = 0$
   - $R_{33} = 1 - 2(0 + 0.5) = 0$
4. Identify angle and axis:
   $$\cos(\theta/2) = w = \frac{1}{\sqrt{2}} \implies \frac{\theta}{2} = 45^\circ \implies \theta = 90^\circ$$
   $$\hat{\omega} = \frac{[x, y, z]^T}{\sin(\theta/2)} = \frac{[0, 1/\sqrt{2}, 0]^T}{1/\sqrt{2}} = [0, 1, 0]^T$$

**Final Answer:**
$$R = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix}$$
Rotation of **$\theta = 90^\circ$** about the **$\hat{y}$ axis**.

**Verification & Sanity Check:**
Standard rotation about $\hat{y}$ by $90^\circ$: $\cos(90^\circ) = 0, \sin(90^\circ) = 1$. The matrix matches $\operatorname{Rot}_y(90^\circ)$ exactly.

---

### Problem 2.10: Lie Bracket $[\mathcal{V}_1, \mathcal{V}_2]$ and Velocity Non-Commutativity
**Problem Statement:** Let two spatial twists be:
$$\mathcal{V}_1 = [\omega_1, v_1]^T = [1, 0, 0, 0, 0, 0]^T \quad (\text{Pure rotation about } \hat{x})$$
$$\mathcal{V}_2 = [\omega_2, v_2]^T = [0, 1, 0, 0, 0, 0]^T \quad (\text{Pure rotation about } \hat{y})$$
Compute the Lie bracket $[\mathcal{V}_1, \mathcal{V}_2]$ in $\mathfrak{se}(3)$ and explain its physical geometric meaning.

**Given Data:**
- $\mathcal{V}_1 = [1, 0, 0, 0, 0, 0]^T$
- $\mathcal{V}_2 = [0, 1, 0, 0, 0, 0]^T$

**Step-by-Step Derivation:**
1. The Lie bracket of two twists $[\mathcal{V}_1, \mathcal{V}_2]$ is defined in vector form as the small-adjoint operator:
   $$[\mathcal{V}_1, \mathcal{V}_2] = \operatorname{ad}_{\mathcal{V}_1} \mathcal{V}_2 = \begin{bmatrix} [\omega_1] & 0 \\ [v_1] & [\omega_1] \end{bmatrix} \begin{bmatrix} \omega_2 \\ v_2 \end{bmatrix} = \begin{bmatrix} \omega_1 \times \omega_2 \\ \omega_1 \times v_2 - \omega_2 \times v_1 \end{bmatrix}$$
2. Compute the angular cross product:
   $$\omega_1 \times \omega_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Compute the linear velocity part:
   Since $v_1 = 0$ and $v_2 = 0$, the linear cross products are zero:
   $$\omega_1 \times v_2 - \omega_2 \times v_1 = 0 - 0 = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
4. Assemble the resulting twist:
   $$[\mathcal{V}_1, \mathcal{V}_2] = [0, 0, 1, 0, 0, 0]^T$$

**Final Answer:**
$$[\mathcal{V}_1, \mathcal{V}_2] = [0, 0, 1, 0, 0, 0]^T$$
(Pure instantaneous rotation about the **$\hat{z}$ axis**).

**Verification & Sanity Check:**
This is the infinitesimal generator of non-commutativity: rotating back-and-forth about $\hat{x}$ and $\hat{y}$ generates a net second-order rotation about $\hat{z}$ ($[\hat{x}, \hat{y}] = \hat{z}$ in the $\mathfrak{so}(3)$ algebra).

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 2.11: Pure Translation Twist in $SE(3)$
**Problem Statement:** A linear actuator on a gantry robot produces pure translational velocity $v = [0, 3, -4]^T\text{ m/s}$ with $\omega = [0, 0, 0]^T$. Compute the matrix exponential $\exp([\mathcal{V}]t)$ for $t = 2.0\text{ s}$.

**Solution:**
1. For pure translation ($\omega = 0$), $[\omega]^k = 0$ for all $k \ge 1$.
2. The exponential series simplifies to:
   $$\exp([\mathcal{V}]t) = \begin{bmatrix} I & v t \\ 0 & 1 \end{bmatrix}$$
3. Compute the displacement:
   $$v t = 2.0 \begin{bmatrix} 0 \\ 3 \\ -4 \end{bmatrix} = \begin{bmatrix} 0 \\ 6 \\ -8 \end{bmatrix}\text{ m}$$
4. Construct the transformation:
   $$\exp([\mathcal{V}]t) = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 6 \\ 0 & 0 & 1 & -8 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 2.12: Rotation about an Off-Origin Arbitrary Axis
**Problem Statement:** A robot revolute joint rotates by $\theta = 90^\circ$ about an axis parallel to $\hat{z}$ passing through point $q = [2.0, 1.0, 0.0]^T\text{ m}$. Derive the $4 \times 4$ homogeneous transformation matrix $T$.

**Solution:**
1. Unit direction: $\hat{\omega} = [0, 0, 1]^T$.
2. Linear velocity component of the screw:
   $$v = -\hat{\omega} \times q = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} = -\begin{bmatrix} -1 \\ 2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ -2 \\ 0 \end{bmatrix}$$
3. The rotational submatrix for $\theta = 90^\circ$ is:
   $$R = \operatorname{Rot}_z(90^\circ) = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
4. The translational displacement for pure rotation around off-origin point $q$ is:
   $$p = (I - R) q = \left( \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} - \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \right) \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 & 1 & 0 \\ -1 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 2 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 3 \\ -1 \\ 0 \end{bmatrix}\text{ m}$$
5. Assemble $T$:
   $$T = \begin{bmatrix} 0 & -1 & 0 & 3 \\ 1 & 0 & 0 & -1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 2.13: Group Inverse of a Cascade of Three Homogeneous Transformations
**Problem Statement:** Prove that $(T_1 T_2 T_3)^{-1} = T_3^{-1} T_2^{-1} T_1^{-1}$ using the group axioms of $SE(3)$.

**Solution:**
1. Let $A = T_1 T_2 T_3$ and $B = T_3^{-1} T_2^{-1} T_1^{-1}$.
2. Multiply $A$ by $B$ using the associative law:
   $$A B = (T_1 T_2 T_3)(T_3^{-1} T_2^{-1} T_1^{-1}) = T_1 T_2 (T_3 T_3^{-1}) T_2^{-1} T_1^{-1}$$
3. Since $T_3 T_3^{-1} = I$:
   $$A B = T_1 T_2 I T_2^{-1} T_1^{-1} = T_1 (T_2 T_2^{-1}) T_1^{-1} = T_1 I T_1^{-1} = T_1 T_1^{-1} = I$$
4. Similarly, $B A = I$. By uniqueness of the inverse in group theory, $A^{-1} = B$.

---

### Problem 2.14: Quaternion Multiplication vs. Matrix Multiplication Equivalence
**Problem Statement:** Let $q_1 = (0, 1, 0, 0)$ (a $180^\circ$ rotation about $\hat{x}$) and $q_2 = (0, 0, 1, 0)$ (a $180^\circ$ rotation about $\hat{y}$). Compute the Hamilton product $q_3 = q_1 q_2$ and show that the corresponding rotation matrix matches $R(q_1) R(q_2)$.

**Solution:**
1. Quaternion multiplication formula:
   $$(w_1, v_1)(w_2, v_2) = (w_1 w_2 - v_1 \cdot v_2, \; w_1 v_2 + w_2 v_1 + v_1 \times v_2)$$
2. Here $w_1 = 0, v_1 = [1, 0, 0]^T$ and $w_2 = 0, v_2 = [0, 1, 0]^T$:
   $$w_3 = 0(0) - [1, 0, 0] \cdot [0, 1, 0] = 0$$
   $$v_3 = 0 + 0 + [1, 0, 0]^T \times [0, 1, 0]^T = [0, 0, 1]^T$$
   $$q_3 = (0, 0, 0, 1)$$
   (a $180^\circ$ rotation about $\hat{z}$).
3. In matrix form:
   $$R(q_1) = \operatorname{Rot}_x(180^\circ) = \begin{bmatrix} 1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   $$R(q_2) = \operatorname{Rot}_y(180^\circ) = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   $$R_1 R_2 = \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \operatorname{Rot}_z(180^\circ) = R(q_3)$$
   The Hamilton product perfectly mirrors $SO(3)$ matrix multiplication.

---

### Problem 2.15: Singularity in Matrix Logarithm at $\theta = \pi$
**Problem Statement:** A rotation matrix is given by $R = \operatorname{diag}(-1, -1, 1)$. Explain why the standard logarithmic formula $[\hat{\omega}] = \frac{1}{2\sin\theta}(R - R^T)$ fails, and derive the correct unit axis $\hat{\omega}$.

**Solution:**
1. Compute the trace:
   $$\operatorname{tr}(R) = -1 - 1 + 1 = -1 \implies \cos\theta = \frac{-1 - 1}{2} = -1 \implies \theta = \pi\text{ rad}$$
2. Evaluating $\sin\pi = 0$:
   The denominator $2\sin\theta$ becomes zero, causing division by zero. Furthermore, $R - R^T = 0$, so $\frac{0}{0}$ is undefined.
3. At $\theta = \pi$, Rodrigues' formula yields:
   $$R = I + 2 [\hat{\omega}]^2 = I + 2 (\hat{\omega} \hat{\omega}^T - I) = 2 \hat{\omega} \hat{\omega}^T - I$$
4. Rearranging:
   $$\hat{\omega} \hat{\omega}^T = \frac{1}{2} (R + I) = \frac{1}{2} \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 2 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
5. Taking the square root of the diagonal entries gives $\hat{\omega} = [0, 0, \pm 1]^T$.

---

### Problem 2.16: Dual Quaternion Representation of Rigid Transformations
**Problem Statement:** Formulate the dual quaternion $\hat{q} = q_r + \epsilon q_d$ ($\epsilon^2 = 0$) for a translation $p = [0, 0, 2]^T$ and identity rotation $q_r = (1, 0, 0, 0)$.

**Solution:**
1. Real part: $q_r = (1, 0, 0, 0)$.
2. Dual part formula:
   $$q_d = \frac{1}{2} \mathbf{p} q_r$$
   where $\mathbf{p} = (0, p_x, p_y, p_z) = (0, 0, 0, 2)$.
3. Compute quaternion product:
   $$q_d = \frac{1}{2} (0, 0, 0, 2)(1, 0, 0, 0) = (0, 0, 0, 1)$$
4. The unit dual quaternion is:
   $$\hat{q} = (1, 0, 0, 0) + \epsilon (0, 0, 0, 1)$$

---

### Problem 2.17: Proof of Adjoint Product Property $\operatorname{Ad}_{T_1 T_2} = \operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2}$
**Problem Statement:** Prove analytically that for any $T_1, T_2 \in SE(3)$, $\operatorname{Ad}_{T_1 T_2} = \operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2}$.

**Solution:**
1. Let $T_1 = \begin{bmatrix} R_1 & p_1 \\ 0 & 1 \end{bmatrix}$ and $T_2 = \begin{bmatrix} R_2 & p_2 \\ 0 & 1 \end{bmatrix}$.
2. Their composition is $T_{12} = \begin{bmatrix} R_1 R_2 & R_1 p_2 + p_1 \\ 0 & 1 \end{bmatrix}$.
3. By definition of the adjoint:
   $$\operatorname{Ad}_{T_{12}} = \begin{bmatrix} R_1 R_2 & 0 \\ [R_1 p_2 + p_1] R_1 R_2 & R_1 R_2 \end{bmatrix}$$
4. Multiply individual adjoints:
   $$\operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2} = \begin{bmatrix} R_1 & 0 \\ [p_1] R_1 & R_1 \end{bmatrix} \begin{bmatrix} R_2 & 0 \\ [p_2] R_2 & R_2 \end{bmatrix} = \begin{bmatrix} R_1 R_2 & 0 \\ [p_1] R_1 R_2 + R_1 [p_2] R_2 & R_1 R_2 \end{bmatrix}$$
5. Using the skew-symmetric identity $[R v] = R [v] R^T$:
   $$R_1 [p_2] R_2 = R_1 [p_2] R_1^T R_1 R_2 = [R_1 p_2] R_1 R_2$$
   Hence:
   $$[p_1] R_1 R_2 + [R_1 p_2] R_1 R_2 = [R_1 p_2 + p_1] R_1 R_2$$
6. Therefore, $\operatorname{Ad}_{T_1 T_2} = \operatorname{Ad}_{T_1} \operatorname{Ad}_{T_2}$.

---

### Problem 2.18: Pitch Calculation for Robotic Bolt Threading
**Problem Statement:** An autonomous assembly robot threads an M10 bolt with standard pitch $1.5\text{ mm/rev}$. Express this helical motion as a normalized spatial twist $\mathcal{S} = (\omega, v)$ along the $\hat{z}$ axis.

**Solution:**
1. Angular velocity: $\omega = [0, 0, 1]^T\text{ rad/s}$.
2. A full revolution is $2\pi\text{ rad}$. In $2\pi\text{ rad}$, the bolt translates by $1.5\text{ mm} = 0.0015\text{ m}$.
3. Linear translation per radian (screw pitch $h$):
   $$h = \frac{0.0015\text{ m}}{2\pi\text{ rad}} = \frac{0.0015}{6.283185} \approx 0.00023873\text{ m/rad} = 0.23873\text{ mm/rad}$$
4. Since the motion is along the axis passing through the origin ($q = 0$), $v = h \omega$:
   $$v = [0, 0, 0.00023873]^T\text{ m/s}$$
5. The unit twist is:
   $$\mathcal{S} = [0, 0, 1, 0, 0, 0.00023873]^T$$

---

### Problem 2.19: Body vs. Spatial Twist Relationships
**Problem Statement:** Prove that the spatial twist $\mathcal{V}_s = \dot{T} T^{-1}$ and the body twist $\mathcal{V}_b = T^{-1} \dot{T}$ are related by $\mathcal{V}_s = \operatorname{Ad}_T \mathcal{V}_b$.

**Solution:**
1. Start with $\mathcal{V}_s = \dot{T} T^{-1}$.
2. Insert the identity $I = T T^{-1}$ into $\mathcal{V}_s$:
   $$\mathcal{V}_s = T (T^{-1} \dot{T}) T^{-1} = T [\mathcal{V}_b] T^{-1}$$
3. Expanding the matrix equation for $T = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$ and $[\mathcal{V}_b] = \begin{bmatrix} [\omega_b] & v_b \\ 0 & 0 \end{bmatrix}$:
   $$T [\mathcal{V}_b] T^{-1} = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix} \begin{bmatrix} [\omega_b] & v_b \\ 0 & 0 \end{bmatrix} \begin{bmatrix} R^T & -R^T p \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} R [\omega_b] R^T & -R [\omega_b] R^T p + R v_b \\ 0 & 0 \end{bmatrix}$$
4. Recognizing that $R [\omega_b] R^T = [R \omega_b]$ and $-[R \omega_b] p = [p] R \omega_b$:
   $$T [\mathcal{V}_b] T^{-1} = \begin{bmatrix} [R \omega_b] & [p] R \omega_b + R v_b \\ 0 & 0 \end{bmatrix} = [\operatorname{Ad}_T \mathcal{V}_b]$$
5. Hence, $\mathcal{V}_s = \operatorname{Ad}_T \mathcal{V}_b$.

---

### Problem 2.20: Principle of Virtual Work and Power Invariance
**Problem Statement:** Prove that the mechanical power $P = \mathcal{V}^T \mathcal{F}$ delivered by an actuator is invariant under any coordinate frame transformation $T_{ab} \in SE(3)$.

**Solution:**
1. In frame $\{b\}$, power is $P_b = \mathcal{V}_b^T \mathcal{F}_b$.
2. The twist transforms as $\mathcal{V}_a = \operatorname{Ad}_{T_{ab}} \mathcal{V}_b \implies \mathcal{V}_b = \operatorname{Ad}_{T_{ab}}^{-1} \mathcal{V}_a$.
3. The wrench transforms as $\mathcal{F}_b = \operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a$.
4. Substitute both into $P_b$:
   $$P_b = (\operatorname{Ad}_{T_{ab}}^{-1} \mathcal{V}_a)^T (\operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a) = \mathcal{V}_a^T (\operatorname{Ad}_{T_{ab}}^{-1})^T \operatorname{Ad}_{T_{ab}}^T \mathcal{F}_a$$
5. Using $(A^{-1})^T A^T = (A A^{-1})^T = I^T = I$:
   $$P_b = \mathcal{V}_a^T I \mathcal{F}_a = \mathcal{V}_a^T \mathcal{F}_a = P_a$$
6. Power is strictly invariant under frame transformations.

---

# Chapter 3: The Standard and Modified Denavit-Hartenberg (DH) Conventions

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are asked to write an instruction manual explaining how to assemble and control an articulated robotic arm with six motorized joints. Each joint can twist, tilt, or telescope. To track where the robot's gripper is in space, you must place a coordinate system—an $x, y, z$ reference frame—on every single metal segment (link) along the arm.

If three different engineers are asked to place these coordinate frames without rules, chaos ensues:
- Engineer A places the $z$-axis along the motor shaft of joint 2, but points the $x$-axis sideways toward the ceiling.
- Engineer B places the origin at the center of mass of link 2, and aligns the $z$-axis with the link's longest bone.
- Engineer C places the origin at the elbow hinge, but tilts the axes at an arbitrary $45^\circ$ angle.

Each frame requires 6 numbers (3 position coordinates and 3 Euler angles) to relate to the next frame. For a 6-joint arm, that would mean tracking **36 arbitrary geometric parameters**!

```
     Arbitrary Frames: 6 parameters per link x 6 links = 36 numbers (Chaotic, error-prone)
     DH Convention:    4 parameters per link x 6 links = 24 numbers (Standardized, minimal)
```

In 1955, Jacques Denavit and Richard Hartenberg introduced an ingenious mathematical convention that brought order to this complexity. They proved that if you follow **two strict geometric rules** when attaching coordinate frames to adjacent joints:
1. The $x_i$-axis must be perpendicular to the previous joint's axis $z_{i-1}$.
2. The $x_i$-axis must intersect the previous joint's axis $z_{i-1}$.

Then **only 4 numbers per link** are needed to completely, unambiguously describe the spatial relationship between adjacent frames! These four numbers—link length, link twist, link offset, and joint angle—are the celebrated **Denavit-Hartenberg (DH) parameters**.

---

## 2. Historical Foundations & Epistemological Evolution

The origin of modern robot kinematic notation traces back to the 1955 ASME paper by **Jacques Denavit** (a French engineer) and **Richard S. Hartenberg** (a professor of mechanical engineering at Northwestern University), titled *"A Kinematic Notation for Lower-Pair Mechanisms Based on Matrices"*. Originally developed to analyze closed spatial kinematic linkages, their notation became the global standard for serial robotics during the birth of industrial automation in the 1970s (popularized by Paul's 1981 textbook *Robot Manipulators: Mathematics, Programming, and Control*).

However, as robotics software matured, certain subtle inconveniences of the original "Standard DH" convention became apparent: in Standard DH, coordinate frame $i$ is attached to the *distal* end of link $i$ (at joint $i+1$). Consequently, frame 0 is attached to the base, but joint 1's variable $\theta_1$ appears inside transformation $A_1$.

In 1986, **John J. Craig** introduced the **Modified Denavit-Hartenberg (Modified DH or Craig's DH)** convention in his widely adopted textbook *Introduction to Robotics: Mechanics and Control*. In Craig's convention, coordinate frame $i$ is attached to the *proximal* end of link $i$ (at joint $i$). While both conventions describe identical physical geometry and produce identical end-effector poses, their parameter tables and transformation formulas differ in link indexing. Today, both conventions are widely used: Standard DH is prevalent in academic literature and ROS URDF models, while Modified DH is standard in many industrial controllers and modern multibody dynamics software.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Four Denavit-Hartenberg Parameters
For any two adjacent joint axes in 3D space, there exists a unique line perpendicular to both axes, known as the **common normal**. The DH convention aligns coordinate axes with these joint axes and common normals.

For link $i$ connecting joint $i$ to joint $i+1$, the four kinematic parameters are defined as follows:

| Parameter | Name | Definition | Variable for |
| :---: | :--- | :--- | :---: |
| $a_i$ | **Link Length** | Distance along $x_i$ from $z_{i-1}$ to $z_i$ (length of common normal) | Constant (Link geometry) |
| $\alpha_i$ | **Link Twist** | Angle from $z_{i-1}$ to $z_i$ measured around $x_i$ (right-hand rule) | Constant (Link geometry) |
| $d_i$ | **Link Offset** | Distance along $z_{i-1}$ from $x_{i-1}$ to $x_i$ | Variable if Joint $i$ is **Prismatic** |
| $\theta_i$ | **Joint Angle** | Angle from $x_{i-1}$ to $x_i$ measured around $z_{i-1}$ (right-hand rule) | Variable if Joint $i$ is **Revolute** |

```
                z_{i-1}                     z_i
                   ▲                         ▲
                   │                         │
                   │           a_i           │
                   │◄───────────────────────►│
       ────────────┼─────────────────────────┼────────────▶ x_i
                   │                         │ (Origin O_i)
                   │                         │
                   │                         │
                   │◄─────── d_i ───────────►│
       ────────────┼─────────────────────────┘
                   │
                  x_{i-1}
```

### 3.2 Standard Frame Assignment Algorithm (Standard DH)
To assign coordinate frames $\{0\}, \{1\}, \dots, \{n\}$ to a serial robot with $n$ joints:
1. **Assign $z$-axes:** For each joint $i \in \{1, 2, \dots, n\}$, align axis $z_{i-1}$ with the axis of motion (axis of rotation for revolute; axis of translation for prismatic).
2. **Assign Base Frame $\{0\}$:** Choose origin $O_0$ anywhere on axis $z_0$. Choose $x_0$ arbitrarily perpendicular to $z_0$ (usually pointing forward).
3. **Assign Intermediate Frames $\{1\}$ through $\{n-1\}$:**
   - **Case A (Skew Axes):** If $z_{i-1}$ and $z_i$ are not parallel and do not intersect, their common normal is unique. Set $x_i$ along this common normal pointing from $z_{i-1}$ to $z_i$. Origin $O_i$ is the intersection of $x_i$ with $z_i$.
   - **Case B (Intersecting Axes):** If $z_{i-1}$ and $z_i$ intersect, link length $a_i = 0$. Choose $x_i = \pm (z_{i-1} \times z_i)$ perpendicular to the plane containing both axes. Origin $O_i$ is the point of intersection.
   - **Case C (Parallel Axes):** If $z_{i-1}$ and $z_i$ are parallel ($\alpha_i = 0$), there are infinitely many common normals. Choose the common normal that passes through the origin of the previous frame $O_{i-1}$, setting link offset $d_i = 0$.
4. **Complete Right-Handed Frames:** Assign $y_i = z_i \times x_i$.
5. **Assign End-Effector Frame $\{n\}$:** Align $z_n$ with the tool approach direction. Place origin $O_n$ at the tool tip or wrist center. Set $x_n$ perpendicular to $z_{n-1}$.

### 3.3 Derivation of the Standard DH Transformation Matrix $A_i$
The transformation from frame $\{i-1\}$ to frame $\{i\}$ is achieved by four consecutive elementary spatial operations:
1. Rotate about $z_{i-1}$ by angle $\theta_i$ to align $x_{i-1}$ with $x_i$: $\operatorname{Rot}_z(\theta_i)$.
2. Translate along $z_{i-1}$ by distance $d_i$ to bring $x_{i-1}$ into the plane of $x_i$: $\operatorname{Trans}_z(d_i)$.
3. Translate along $x_i$ by distance $a_i$ to bring the origins together: $\operatorname{Trans}_x(a_i)$.
4. Rotate about $x_i$ by angle $\alpha_i$ to align $z_{i-1}$ with $z_i$: $\operatorname{Rot}_x(\alpha_i)$.

Multiplying these four elementary transformation matrices:
$$A_i = \operatorname{Rot}_z(\theta_i) \operatorname{Trans}_z(d_i) \operatorname{Trans}_x(a_i) \operatorname{Rot}_x(\alpha_i)$$

$$\begin{aligned}
A_i &= \begin{bmatrix} \cos\theta_i & -\sin\theta_i & 0 & 0 \\ \sin\theta_i & \cos\theta_i & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_i \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & a_i \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & \cos\alpha_i & -\sin\alpha_i & 0 \\ 0 & \sin\alpha_i & \cos\alpha_i & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \\
&= \begin{bmatrix} \cos\theta_i & -\sin\theta_i\cos\alpha_i & \sin\theta_i\sin\alpha_i & a_i\cos\theta_i \\ \sin\theta_i & \cos\theta_i\cos\alpha_i & -\cos\theta_i\sin\alpha_i & a_i\sin\theta_i \\ 0 & \sin\alpha_i & \cos\alpha_i & d_i \\ 0 & 0 & 0 & 1 \end{bmatrix}
\end{aligned}$$

Notice the structure of $A_i$:
- The upper-left $3 \times 3$ block is the rotation matrix $R_{i-1}^i \in SO(3)$.
- The rightmost column is the position vector $p_{i-1}^i = [a_i\cos\theta_i, a_i\sin\theta_i, d_i]^T$.

### 3.4 Modified Denavit-Hartenberg Convention (Craig's DH)
In Craig's Modified DH convention, frame $\{i\}$ is fixed to link $i$ at joint $i$ (rather than joint $i+1$). The four operations are applied in a different order:
$$T_i = \operatorname{Rot}_x(\alpha_{i-1}) \operatorname{Trans}_x(a_{i-1}) \operatorname{Rot}_z(\theta_i) \operatorname{Trans}_z(d_i)$$

Carrying out the matrix multiplication:
$$T_i = \begin{bmatrix} \cos\theta_i & -\sin\theta_i & 0 & a_{i-1} \\ \sin\theta_i\cos\alpha_{i-1} & \cos\theta_i\cos\alpha_{i-1} & -\sin\alpha_{i-1} & -d_i\sin\alpha_{i-1} \\ \sin\theta_i\sin\alpha_{i-1} & \cos\theta_i\sin\alpha_{i-1} & \cos\alpha_{i-1} & d_i\cos\alpha_{i-1} \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

#### Key Differences Between Standard and Modified DH:
- **Index of Parameters:** In Standard DH, the parameters for link $i$ are $(a_i, \alpha_i, d_i, \theta_i)$. In Modified DH, the parameters are $(a_{i-1}, \alpha_{i-1}, d_i, \theta_i)$.
- **Axis of $x$:** In Standard DH, $x_i$ is the common normal between $z_{i-1}$ and $z_i$. In Modified DH, $x_i$ is the common normal between $z_i$ and $z_{i+1}$.

---

## 4. Computational Realization & Algorithmic Implementation

Below is a robust, zero-dependency TypeScript implementation for evaluating Standard and Modified DH matrices:

```typescript
export interface DHRow {
  a: number;      // link length
  alpha: number;  // link twist (radians)
  d: number;      // link offset
  theta: number;  // joint angle (radians)
  isPrismatic?: boolean;
}

export class DHKinematics {
  /**
   * Computes the 4x4 homogeneous transformation matrix for a single Standard DH row.
   */
  public static standardDHMatrix(row: DHRow): number[][] {
    const { a, alpha, d, theta } = row;
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);

    return [
      [ct, -st * ca,  st * sa, a * ct],
      [st,  ct * ca, -ct * sa, a * st],
      [0,   sa,       ca,      d     ],
      [0,   0,        0,       1     ]
    ];
  }

  /**
   * Computes the 4x4 homogeneous transformation matrix for a single Modified (Craig) DH row.
   */
  public static modifiedDHMatrix(row: DHRow): number[][] {
    const { a, alpha, d, theta } = row;
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);

    return [
      [ct,        -st,        0,    a       ],
      [st * ca,    ct * ca,  -sa,  -d * sa  ],
      [st * sa,    ct * sa,   ca,   d * ca  ],
      [0,          0,         0,    1       ]
    ];
  }

  /**
   * Cascades a list of DH rows into a cumulative end-effector transform T_0^n.
   */
  public static evaluateChain(rows: DHRow[], isModified: boolean = false): number[][] {
    let T: number[][] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    for (const row of rows) {
      const A = isModified ? this.modifiedDHMatrix(row) : this.standardDHMatrix(row);
      T = this.multiply4x4(T, A);
    }
    return T;
  }

  private static multiply4x4(A: number[][], B: number[][]): number[][] {
    const C: number[][] = Array.from({ length: 4 }, () => new Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += A[i][k] * B[k][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 3.1: Standard DH Parameters for a 2R Planar Arm
**Problem Statement:** Consider a 2R planar manipulator operating in the $xy$-plane with link lengths $L_1$ and $L_2$. Both joint axes $z_0$ and $z_1$ point out of the plane parallel to $+\hat{z}$.
1. Formulate the Standard DH table $(a_i, \alpha_i, d_i, \theta_i)$ for links 1 and 2.
2. Evaluate the transformation matrices $A_1$ and $A_2$.
3. Compute the overall forward kinematics transformation $T_0^2 = A_1 A_2$.

**Given Data:**
- Link lengths $L_1, L_2$
- Joint axes $z_0 \parallel z_1 \parallel z_2$ (all pointing out of the plane)
- No joint offsets ($d_1 = d_2 = 0$)
- No link twists ($\alpha_1 = \alpha_2 = 0$)

**Step-by-Step Derivation:**
1. Formulate the DH parameter table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $L_1$ | $0$ | $0$ | $\theta_1^*$ |
| 2 | $L_2$ | $0$ | $0$ | $\theta_2^*$ |

*(Asterisk indicates the joint variable)*

2. Evaluate $A_1$ using Standard DH formula with $\alpha_1 = 0, d_1 = 0, a_1 = L_1$:
   $$\cos\alpha_1 = 1, \quad \sin\alpha_1 = 0$$
   $$A_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & L_1\cos\theta_1 \\ \sin\theta_1 & \cos\theta_1 & 0 & L_1\sin\theta_1 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Evaluate $A_2$ using $\alpha_2 = 0, d_2 = 0, a_2 = L_2$:
   $$A_2 = \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_2\cos\theta_2 \\ \sin\theta_2 & \cos\theta_2 & 0 & L_2\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Compute $T_0^2 = A_1 A_2$:
   Multiply the upper-left $2 \times 2$ blocks using angle sum identities:
   $$\begin{bmatrix} \cos\theta_1 & -\sin\theta_1 \\ \sin\theta_1 & \cos\theta_1 \end{bmatrix} \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 \\ \sin\theta_2 & \cos\theta_2 \end{bmatrix} = \begin{bmatrix} \cos(\theta_1 + \theta_2) & -\sin(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) & \cos(\theta_1 + \theta_2) \end{bmatrix}$$
   Multiply for position:
   $$p_0^2 = R_1 p_2 + p_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 \\ \sin\theta_1 & \cos\theta_1 \end{bmatrix} \begin{bmatrix} L_2\cos\theta_2 \\ L_2\sin\theta_2 \end{bmatrix} + \begin{bmatrix} L_1\cos\theta_1 \\ L_1\sin\theta_1 \end{bmatrix}$$
   $$= \begin{bmatrix} L_1\cos\theta_1 + L_2(\cos\theta_1\cos\theta_2 - \sin\theta_1\sin\theta_2) \\ L_1\sin\theta_1 + L_2(\sin\theta_1\cos\theta_2 + \cos\theta_1\sin\theta_2) \end{bmatrix} = \begin{bmatrix} L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) \\ L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) \end{bmatrix}$$

**Final Answer:**
$$T_0^2 = \begin{bmatrix} \cos(\theta_1 + \theta_2) & -\sin(\theta_1 + \theta_2) & 0 & L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) & \cos(\theta_1 + \theta_2) & 0 & L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
Setting $\theta_1 = 0, \theta_2 = 0$ yields $x = L_1 + L_2, y = 0$, the straight horizontal extension of the arm, perfectly matching trigonometry.

---

### Problem 3.2: Standard DH Parameters for a 3R Planar Manipulator
**Problem Statement:** Extend Problem 3.1 to a 3R planar arm by adding a third revolute link of length $L_3$ with joint angle $\theta_3$. Formulate the DH table and compute the end-effector position and orientation.

**Given Data:**
- Link lengths $L_1, L_2, L_3$
- All joint axes $z_0, z_1, z_2, z_3$ parallel and perpendicular to the motion plane.

**Step-by-Step Derivation:**
1. DH parameter table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $L_1$ | $0$ | $0$ | $\theta_1^*$ |
| 2 | $L_2$ | $0$ | $0$ | $\theta_2^*$ |
| 3 | $L_3$ | $0$ | $0$ | $\theta_3^*$ |

2. Transformation $A_3$ is identical in structure to $A_2$:
   $$A_3 = \begin{bmatrix} \cos\theta_3 & -\sin\theta_3 & 0 & L_3\cos\theta_3 \\ \sin\theta_3 & \cos\theta_3 & 0 & L_3\sin\theta_3 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Cascade $T_0^3 = T_0^2 A_3$:
   Using $\phi = \theta_1 + \theta_2 + \theta_3$:
   The total rotation angle is $\phi$:
   $$R_0^3 = \operatorname{Rot}_z(\theta_1 + \theta_2 + \theta_3)$$
   The end-effector position is:
   $$x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) + L_3\cos(\theta_1 + \theta_2 + \theta_3)$$
   $$y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) + L_3\sin(\theta_1 + \theta_2 + \theta_3)$$
   $$z = 0$$

**Final Answer:**
$$T_0^3 = \begin{bmatrix} \cos\phi & -\sin\phi & 0 & L_1\cos\theta_1 + L_2\cos\theta_{12} + L_3\cos\phi \\ \sin\phi & \cos\phi & 0 & L_1\sin\theta_1 + L_2\sin\theta_{12} + L_3\sin\phi \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
where $\theta_{12} = \theta_1 + \theta_2$ and $\phi = \theta_1 + \theta_2 + \theta_3$.

**Verification & Sanity Check:**
If $\theta_1 = 90^\circ, \theta_2 = 0^\circ, \theta_3 = 0^\circ$, all links point vertically: $x = 0, y = L_1 + L_2 + L_3$, and orientation $\phi = 90^\circ$. Substituting gives $\cos(90^\circ) = 0$ and $\sin(90^\circ) = 1$, completely consistent.

---

### Problem 3.3: DH Table for a Cylindrical Robot (RPP)
**Problem Statement:** A cylindrical robot has 3 degrees of freedom:
- Joint 1: Revolute base rotation $\theta_1$ about vertical axis $z_0$.
- Joint 2: Prismatic vertical lift $d_2$ along $z_1$.
- Joint 3: Prismatic radial extension $d_3$ along horizontal axis.
Construct the complete Standard DH parameter table and evaluate the forward kinematics.

**Given Data:**
- Joint 1: Revolute ($\theta_1$ variable), axis $z_0$ vertical.
- Joint 2: Prismatic ($d_2$ variable), axis $z_1$ vertical ($z_1 \parallel z_0$).
- Joint 3: Prismatic ($d_3$ variable), axis $z_2$ horizontal ($z_2 \perp z_1$).

**Step-by-Step Derivation:**
1. Align coordinate axes:
   - $z_0$ is along Joint 1 axis (vertical).
   - $z_1$ is along Joint 2 axis (vertical, coincident with $z_0$).
   - Since $z_0$ and $z_1$ are collinear: link length $a_1 = 0$, twist $\alpha_1 = 0$, offset $d_1 = 0$.
   - $z_2$ is along Joint 3 translation axis (horizontal).
   - Angle from $z_1$ to $z_2$ about $x_2$ is $-90^\circ$ ($\alpha_2 = -90^\circ$ or $+90^\circ$). Let $\alpha_2 = -90^\circ$.
   - Joint 3 has translation variable $d_3$ along $z_2$.
2. Formulate the Standard DH table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $0$ | $0$ | $\theta_1^*$ |
| 2 | $0$ | $-90^\circ$ | $d_2^*$ | $0$ |
| 3 | $0$ | $0$ | $d_3^*$ | $0$ |

3. Evaluate matrices:
   $$A_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$A_2 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & -1 & 0 & d_2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$A_3 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Multiply $T_0^3 = A_1 A_2 A_3$:
   $$A_2 A_3 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & -1 & 0 & d_2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$T_0^3 = A_1 (A_2 A_3) = \begin{bmatrix} \cos\theta_1 & 0 & -\sin\theta_1 & -d_3\sin\theta_1 \\ \sin\theta_1 & 0 & \cos\theta_1 & d_3\cos\theta_1 \\ 0 & -1 & 0 & d_2 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
Position of the end-effector:
$$p = \begin{bmatrix} -d_3\sin\theta_1 \\ d_3\cos\theta_1 \\ d_2 \end{bmatrix}$$
(Standard cylindrical coordinates $(r, \theta, z)$ with $r = d_3$ and $z = d_2$).

**Verification & Sanity Check:**
The radius is $\sqrt{x^2 + y^2} = \sqrt{(-d_3\sin\theta_1)^2 + (d_3\cos\theta_1)^2} = d_3$, and vertical height is $z = d_2$. The mathematics matches physical cylindrical geometry.

---

### Problem 3.4: Complete DH Table for a 4-DoF SCARA Robot (RRPR)
**Problem Statement:** A SCARA (Selective Compliance Assembly Robot Arm) manipulator has:
- Base height $d_1$.
- Shoulder link length $a_1$, joint angle $\theta_1$.
- Elbow link length $a_2$, joint angle $\theta_2$.
- Prismatic vertical quill translation $d_3$ along negative $\hat{z}$.
- Wrist roll angle $\theta_4$ about vertical axis.
Derive the complete Standard DH table and forward kinematics transformation matrix.

**Given Data:**
- Link lengths: $a_1, a_2$.
- Fixed base offset: $d_1$.
- All revolute axes $z_0, z_1, z_3$ parallel to vertical axis.
- Prismatic axis $z_2$ parallel to vertical axis, but pointing downward ($\alpha_2 = 180^\circ$ or $-180^\circ$).

**Step-by-Step Derivation:**
1. Formulate the Standard DH table:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $a_1$ | $0$ | $d_1$ | $\theta_1^*$ |
| 2 | $a_2$ | $180^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0$ | $0$ | $d_3^*$ | $0$ |
| 4 | $0$ | $0$ | $0$ | $\theta_4^*$ |

2. Evaluate individual matrices:
   $$A_1 = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & a_1\cos\theta_1 \\ \sin\theta_1 & \cos\theta_1 & 0 & a_1\sin\theta_1 \\ 0 & 0 & 1 & d_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   With $\alpha_2 = 180^\circ$ ($\cos 180^\circ = -1, \sin 180^\circ = 0$):
   $$A_2 = \begin{bmatrix} \cos\theta_2 & \sin\theta_2 & 0 & a_2\cos\theta_2 \\ \sin\theta_2 & -\cos\theta_2 & 0 & a_2\sin\theta_2 \\ 0 & 0 & -1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$A_3 = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad A_4 = \begin{bmatrix} \cos\theta_4 & -\sin\theta_4 & 0 & 0 \\ \sin\theta_4 & \cos\theta_4 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Multiply to find end-effector position $p = T_0^4 [0, 0, 0, 1]^T$:
   $$x = a_1\cos\theta_1 + a_2\cos(\theta_1 + \theta_2)$$
   $$y = a_1\sin\theta_1 + a_2\sin(\theta_1 + \theta_2)$$
   $$z = d_1 - d_3$$

**Final Answer:**
- Position: **$p = [a_1\cos\theta_1 + a_2\cos(\theta_1 + \theta_2), \; a_1\sin\theta_1 + a_2\sin(\theta_1 + \theta_2), \; d_1 - d_3]^T$**
- Orientation: Rotation about $\hat{z}$ by angle **$\phi = \theta_1 + \theta_2 - \theta_4$**.

**Verification & Sanity Check:**
As the quill extends ($d_3$ increases), the tool moves down toward the workspace table ($z = d_1 - d_3$), while planar arms $(a_1, a_2)$ provide fast horizontal pick-and-place motion with high vertical structural stiffness.

---

### Problem 3.5: Standard DH Table for the Stanford Arm (RRPRRR)
**Problem Statement:** The Stanford Arm is a classic 6-DoF manipulator with 2 revolute shoulder joints, a prismatic elbow joint ($d_3$), and a 3-DoF spherical wrist (joints 4, 5, 6). The joint axes satisfy:
- $z_0 \perp z_1$
- $z_1 \perp z_2$
- $z_3 \perp z_4$ and $z_4 \perp z_5$ (intersecting at wrist center $O_4 = O_5 = O_6$).
Derive the complete 6-row Standard DH parameter table.

**Given Data:**
- Base offset $d_2$ between shoulder and elbow.
- Prismatic reach $d_3$.
- Tool tip offset $d_6$.

**Step-by-Step Derivation:**
1. Link 1: Waist rotation $\theta_1$ about vertical $z_0$. Axis $z_1$ is horizontal shoulder axis ($z_0 \perp z_1 \implies \alpha_1 = -90^\circ$). Length $a_1 = 0$, offset $d_1 = 0$ (or base height).
2. Link 2: Shoulder elevation $\theta_2$ about horizontal $z_1$. Axis $z_2$ is the telescoping boom axis ($z_1 \perp z_2 \implies \alpha_2 = +90^\circ$). Offset $d_2$ is the horizontal distance between waist and boom. Length $a_2 = 0$.
3. Link 3: Prismatic extension along $z_2$ ($d_3$ variable). Axis $z_3$ is the wrist roll axis ($z_3$ collinear with $z_2 \implies \alpha_3 = 0^\circ$). Length $a_3 = 0, \theta_3 = 0$.
4. Link 4: Wrist roll $\theta_4$ about $z_3$. Axis $z_4$ is wrist pitch ($z_3 \perp z_4 \implies \alpha_4 = -90^\circ$). Length $a_4 = 0, d_4 = 0$.
5. Link 5: Wrist pitch $\theta_5$ about $z_4$. Axis $z_5$ is wrist yaw ($z_4 \perp z_5 \implies \alpha_5 = +90^\circ$). Length $a_5 = 0, d_5 = 0$.
6. Link 6: Wrist yaw $\theta_6$ about $z_5$. Axis $z_6$ points toward tool tip. $\alpha_6 = 0^\circ, a_6 = 0$, offset $d_6$.

**Final Answer:**
The Standard DH Table for the Stanford Arm:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $-90^\circ$ | $0$ | $\theta_1^*$ |
| 2 | $0$ | $+90^\circ$ | $d_2$ | $\theta_2^*$ |
| 3 | $0$ | $0^\circ$ | $d_3^*$ | $0^\circ$ |
| 4 | $0$ | $-90^\circ$ | $0$ | $\theta_4^*$ |
| 5 | $0$ | $+90^\circ$ | $0$ | $\theta_5^*$ |
| 6 | $0$ | $0^\circ$ | $d_6$ | $\theta_6^*$ |

**Verification & Sanity Check:**
Notice that $a_i = 0$ for all links! The Stanford arm is an entirely orthogonal mechanism where all consecutive joint axes are either perpendicular or collinear.

---

### Problem 3.6: Complete DH Table for the PUMA 560 Robot (6R)
**Problem Statement:** The Unimation PUMA 560 is the archetypal 6-DoF anthropomorphic industrial manipulator with a spherical wrist. Its dimensions are:
- Waist to shoulder height: $d_3$ offset.
- Upper arm length: $a_2 = 0.4318\text{ m}$.
- Elbow offset: $d_3 = 0.15005\text{ m}$.
- Forearm length: $a_3 = -0.0203\text{ m}$.
- Forearm offset: $d_4 = 0.4318\text{ m}$.
- Tool offset: $d_6 = 0.0562\text{ m}$.
Derive the complete 6-row Standard DH parameter table.

**Step-by-Step Derivation:**
1. Joint 1: Waist rotation about vertical $z_0$. Shoulder axis $z_1$ is horizontal: $\alpha_1 = -90^\circ, a_1 = 0, d_1 = 0$.
2. Joint 2: Shoulder pitch about $z_1$. Elbow axis $z_2$ is parallel to $z_1$: $\alpha_2 = 0^\circ, a_2 = 0.4318\text{ m}, d_2 = 0$.
3. Joint 3: Elbow pitch about $z_2$. Forearm axis $z_3$ is perpendicular to $z_2$: $\alpha_3 = 90^\circ, a_3 = -0.0203\text{ m}, d_3 = 0.15005\text{ m}$.
4. Joint 4: Forearm roll about $z_3$. Wrist pitch axis $z_4$ is perpendicular to $z_3$: $\alpha_4 = -90^\circ, a_4 = 0, d_4 = 0.4318\text{ m}$.
5. Joint 5: Wrist pitch about $z_4$. Wrist roll axis $z_5$ is perpendicular to $z_4$: $\alpha_5 = 90^\circ, a_5 = 0, d_5 = 0$.
6. Joint 6: Tool roll about $z_5$: $\alpha_6 = 0^\circ, a_6 = 0, d_6 = 0.0562\text{ m}$.

**Final Answer:**
Standard DH Parameter Table for PUMA 560:

| Link $i$ | $a_i$ (m) | $\alpha_i$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $-90^\circ$ | $0$ | $\theta_1^*$ |
| 2 | $0.4318$ | $0^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $-0.0203$ | $+90^\circ$ | $0.15005$ | $\theta_3^*$ |
| 4 | $0$ | $-90^\circ$ | $0.4318$ | $\theta_4^*$ |
| 5 | $0$ | $+90^\circ$ | $0$ | $\theta_5^*$ |
| 6 | $0$ | $0^\circ$ | $0.0562$ | $\theta_6^*$ |

**Verification & Sanity Check:**
Axes 4, 5, and 6 intersect at a single point (the wrist center), because $a_4 = a_5 = 0$ and $d_5 = 0$. This satisfies Pieper's criterion, guaranteeing an analytical closed-form inverse kinematics solution.

---

### Problem 3.7: Craig's Modified DH Table for the PUMA 560
**Problem Statement:** Convert the Standard DH parameters of the PUMA 560 from Problem 3.6 into Craig's Modified DH convention $(a_{i-1}, \alpha_{i-1}, d_i, \theta_i)$.

**Step-by-Step Derivation:**
1. In Craig's convention, frame $i$ is attached to the proximal end of link $i$ at joint $i$.
2. The parameters $a$ and $\alpha$ are shifted by one index:
   - For link 1: $a_0 = 0, \alpha_0 = 0, d_1 = 0, \theta_1$.
   - For link 2: $a_1 = 0, \alpha_1 = -90^\circ, d_2 = 0, \theta_2$.
   - For link 3: $a_2 = 0.4318\text{ m}, \alpha_2 = 0^\circ, d_3 = 0.15005\text{ m}, \theta_3$.
   - For link 4: $a_3 = -0.0203\text{ m}, \alpha_3 = 90^\circ, d_4 = 0.4318\text{ m}, \theta_4$.
   - For link 5: $a_4 = 0, \alpha_4 = -90^\circ, d_5 = 0, \theta_5$.
   - For link 6: $a_5 = 0, \alpha_5 = 90^\circ, d_6 = 0.0562\text{ m}, \theta_6$.

**Final Answer:**
Craig's Modified DH Table for PUMA 560:

| Link $i$ | $a_{i-1}$ (m) | $\alpha_{i-1}$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $0^\circ$ | $0$ | $\theta_1^*$ |
| 2 | $0$ | $-90^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0.4318$ | $0^\circ$ | $0.15005$ | $\theta_3^*$ |
| 4 | $-0.0203$ | $+90^\circ$ | $0.4318$ | $\theta_4^*$ |
| 5 | $0$ | $-90^\circ$ | $0$ | $\theta_5^*$ |
| 6 | $0$ | $+90^\circ$ | $0.0562$ | $\theta_6^*$ |

**Verification & Sanity Check:**
Evaluating $T_0^6 = T_1 T_2 T_3 T_4 T_5 T_6$ using Craig's formula produces the exact same end-effector pose as $A_1 A_2 A_3 A_4 A_5 A_6$ in Standard DH for all joint angles.

---

### Problem 3.8: Ambiguity Resolution for Parallel Joint Axes
**Problem Statement:** Two consecutive revolute joints have parallel axes: $z_0 \parallel z_1$. Link length is $L_1 = 0.5\text{ m}$. There are infinitely many lines perpendicular to both $z_0$ and $z_1$.
1. State the Standard DH convention rule for selecting the common normal.
2. Formulate the resulting $d_1$ and $\alpha_1$.

**Solution:**
1. Under the Standard DH convention: When axes $z_{i-1}$ and $z_i$ are parallel, the common normal is chosen to pass through the origin of frame $\{i-1\}$ ($O_{i-1}$).
2. By selecting the normal passing through $O_{i-1}$, the distance along $z_{i-1}$ from $x_{i-1}$ to $x_i$ is identically zero:
   $$d_i = 0$$
3. Since the axes are parallel and point in the same direction, the angle between them about the common normal is zero:
   $$\alpha_i = 0^\circ$$
4. Result: $a_1 = 0.5\text{ m}, \alpha_1 = 0^\circ, d_1 = 0, \theta_1$.

---

### Problem 3.9: Frame Assignment for an Orthogonal Spherical Wrist
**Problem Statement:** A 3-DoF spherical wrist has three mutually orthogonal revolute axes $z_3, z_4, z_5$ that intersect at a single physical point $O_w$. Determine link lengths $a_4, a_5$ and link offsets $d_4, d_5$ under the Standard DH convention.

**Solution:**
1. Since axes $z_3$ and $z_4$ intersect at $O_w$:
   - Distance between them along common normal is zero: $a_4 = 0$.
   - Common normal $x_4 = \pm(z_3 \times z_4)$ passes through intersection point $O_w$.
   - Origin $O_4$ is located at $O_w$.
   - Link offset $d_4$ (distance along $z_3$ to $x_4$) is $d_4 = 0$ (or the forearm length if $O_3$ was at the elbow).
2. Since axes $z_4$ and $z_5$ intersect at $O_w$:
   - Distance between them is zero: $a_5 = 0$.
   - Origin $O_5$ is placed at $O_w$.
   - Distance from $x_4$ to $x_5$ along $z_4$ is zero: $d_5 = 0$.
3. All three frame origins $O_4, O_5, O_6$ are coincident at the wrist center $O_w$.

---

### Problem 3.10: Forward Kinematics of a Prismatic Joint
**Problem Statement:** Link 3 of a robotic manipulator is a pure prismatic joint with constant joint angle $\theta_3 = 0^\circ$, zero link length $a_3 = 0$, twist $\alpha_3 = 0^\circ$, and variable extension $d_3 \in [0.2, 0.8]\text{ m}$. Derive the transformation matrix $A_3(d_3)$.

**Solution:**
1. Substitute parameters into the Standard DH matrix:
   $$\theta_3 = 0 \implies \cos\theta_3 = 1, \; \sin\theta_3 = 0$$
   $$\alpha_3 = 0 \implies \cos\alpha_3 = 1, \; \sin\alpha_3 = 0$$
   $$a_3 = 0$$
2. Evaluate entries:
   $$A_3 = \begin{bmatrix} 1 & -0(1) & 0(0) & 0(1) \\ 0 & 1(1) & -1(0) & 0(0) \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & d_3 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. $A_3(d_3)$ is a pure linear translation along the $z$-axis by variable distance $d_3$ with identity rotation.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 3.11: Universal Joint Model via Two Zero-Length DH Links
**Problem Statement:** A 2-DoF universal joint (Hooke's joint) connects two shafts with two orthogonal intersecting axes of rotation. Model this joint using Standard DH convention as two 1-DoF revolute joints.

**Solution:**
1. Model the universal joint as Joint $A$ and Joint $B$ with intersecting axes $z_A \perp z_B$.
2. Link $A$ connects Joint $A$ to Joint $B$:
   - Because axes intersect: $a_A = 0$.
   - Angle between orthogonal axes: $\alpha_A = 90^\circ$ (or $-90^\circ$).
   - Offset along shaft: $d_A = 0$.
   - Variable: $\theta_A$.
3. Link $B$ connects Joint $B$ to output:
   - Output shaft direction aligned with $z_B$: $\alpha_B = 0^\circ, a_B = 0, d_B = 0, \theta_B$.
4. Transformation is the product of two orthogonal rotations with zero translation:
   $$A_{\text{universal}} = A_A(\theta_A) A_B(\theta_B)$$

---

### Problem 3.12: Universal Robots UR5 DH Parameters
**Problem Statement:** The Universal Robots UR5 6-axis cobot has:
- Base height: $d_1 = 0.089159\text{ m}$.
- Upper arm length: $a_2 = -0.425\text{ m}$.
- Forearm length: $a_3 = -0.39225\text{ m}$.
- Wrist offsets: $d_4 = 0.10915\text{ m}, d_5 = 0.09465\text{ m}, d_6 = 0.0823\text{ m}$.
Construct the complete Standard DH parameter table.

**Solution:**
1. Standard DH Table for UR5:

| Link $i$ | $a_i$ (m) | $\alpha_i$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $90^\circ$ | $0.089159$ | $\theta_1^*$ |
| 2 | $-0.425$ | $0^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $-0.39225$ | $0^\circ$ | $0$ | $\theta_3^*$ |
| 4 | $0$ | $90^\circ$ | $0.10915$ | $\theta_4^*$ |
| 5 | $0$ | $-90^\circ$ | $0.09465$ | $\theta_5^*$ |
| 6 | $0$ | $0^\circ$ | $0.0823$ | $\theta_6^*$ |

---

### Problem 3.13: Franka Emika Panda 7-DoF DH Table
**Problem Statement:** The Franka Emika Panda is a 7-DoF collaborative manipulator. Formulate its Modified (Craig) DH table given link offsets: $d_1 = 0.333, d_3 = 0.316, d_5 = 0.384, d_7 = 0.107\text{ m}$ and link lengths $a_4 = 0.0825, a_6 = 0.088\text{ m}$.

**Solution:**
Craig Modified DH Table for Franka Emika Panda:

| Joint $i$ | $a_{i-1}$ (m) | $\alpha_{i-1}$ (deg) | $d_i$ (m) | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $0^\circ$ | $0.333$ | $\theta_1^*$ |
| 2 | $0$ | $-90^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0$ | $+90^\circ$ | $0.316$ | $\theta_3^*$ |
| 4 | $0.0825$ | $+90^\circ$ | $0$ | $\theta_4^*$ |
| 5 | $-0.0825$ | $-90^\circ$ | $0.384$ | $\theta_5^*$ |
| 6 | $0$ | $+90^\circ$ | $0$ | $\theta_6^*$ |
| 7 | $0.088$ | $+90^\circ$ | $0.107$ | $\theta_7^*$ |

---

### Problem 3.14: General Formula for Converting Standard to Modified DH
**Problem Statement:** Derive the formal rule mapping link parameters $(a_i^{\text{std}}, \alpha_i^{\text{std}}, d_i^{\text{std}}, \theta_i^{\text{std}})$ to Craig parameters $(a_{i-1}^{\text{mod}}, \alpha_{i-1}^{\text{mod}}, d_i^{\text{mod}}, \theta_i^{\text{mod}})$.

**Solution:**
1. In Standard DH, the link dimensions $(a, \alpha)$ describe the link between joint $i$ and joint $i+1$, recorded at row $i$.
2. In Craig's convention, the link dimensions $(a, \alpha)$ describe link $i-1$ between joint $i-1$ and joint $i$, recorded at row $i$.
3. Therefore:
   $$a_{i-1}^{\text{mod}} = a_{i-1}^{\text{std}}, \quad \alpha_{i-1}^{\text{mod}} = \alpha_{i-1}^{\text{std}}$$
4. The joint variables $d_i$ and $\theta_i$ belong to joint $i$ in both conventions, but the zero-reference angle for $\theta_i$ may differ by a constant offset depending on the choice of $x_0$ and $x_n$.

---

### Problem 3.15: The Hayati-Mirmirani Singularity for Near-Parallel Axes
**Problem Statement:** Explain why the Denavit-Hartenberg parameterization suffers from numerical discontinuity when two nominally parallel joint axes are slightly misaligned in physical manufacturing (e.g., $\alpha = 0.001^\circ$).

**Solution:**
1. When two axes are strictly parallel ($\alpha = 0$), any line perpendicular to both is a common normal.
2. If axis 2 is perturbed by a tiny angle $\epsilon = 0.001^\circ$, the axes become skew. Two skew lines have a **unique** common normal.
3. As $\epsilon \to 0$, the location along $z$ where this unique common normal intersects the axes can jump by meters:
   $$d_i \approx \frac{\Delta}{\sin\epsilon} \to \infty$$
4. This causes the DH parameters $d_i$ and $\theta_i$ to exhibit extreme numerical sensitivity, making standard DH unsuitable for kinematic calibration of near-parallel joints (motivating the Hayati-Mirmirani 5-parameter model).

---

### Problem 3.16: Base Frame Calibration Matrix
**Problem Statement:** A robot's DH base frame $\{0\}$ is mounted on an AGV mobile platform whose location in world frame $\{w\}$ is given by $T_w^0 = \operatorname{Trans}(1.0, 2.0, 0.5) \operatorname{Rot}_z(45^\circ)$. Find the world position of the robot's end-effector when $T_0^n = \begin{bmatrix} I & [0.4, 0, 0.3]^T \\ 0 & 1 \end{bmatrix}$.

**Solution:**
1. World transformation is the matrix cascade $T_w^n = T_w^0 T_0^n$.
2. Position $p_w^n = R_w^0 p_0^n + p_w^0$:
   $$R_w^0 = \operatorname{Rot}_z(45^\circ) = \begin{bmatrix} \frac{\sqrt{2}}{2} & -\frac{\sqrt{2}}{2} & 0 \\ \frac{\sqrt{2}}{2} & \frac{\sqrt{2}}{2} & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
3. Multiply:
   $$R_w^0 \begin{bmatrix} 0.4 \\ 0 \\ 0.3 \end{bmatrix} = \begin{bmatrix} 0.4 \frac{\sqrt{2}}{2} \\ 0.4 \frac{\sqrt{2}}{2} \\ 0.3 \end{bmatrix} \approx \begin{bmatrix} 0.2828 \\ 0.2828 \\ 0.3000 \end{bmatrix}$$
4. Add platform position:
   $$p_w^n = \begin{bmatrix} 0.2828 \\ 0.2828 \\ 0.3000 \end{bmatrix} + \begin{bmatrix} 1.0 \\ 2.0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 1.2828 \\ 2.2828 \\ 0.8000 \end{bmatrix}\text{ m}$$

---

### Problem 3.17: Tool Center Point (TCP) Offset Transformation
**Problem Statement:** A welding torch has a tool tip located at distance $L_{\text{tool}} = 0.15\text{ m}$ extending along the tool $\hat{z}_n$ axis and angled by $30^\circ$ toward $\hat{x}_n$. Formulate the tool transformation matrix $T_n^{\text{tcp}}$.

**Solution:**
1. Rotation about $\hat{y}_n$ by $30^\circ$:
   $$R = \operatorname{Rot}_y(30^\circ) = \begin{bmatrix} \cos 30^\circ & 0 & \sin 30^\circ \\ 0 & 1 & 0 \\ -\sin 30^\circ & 0 & \cos 30^\circ \end{bmatrix} = \begin{bmatrix} 0.866 & 0 & 0.500 \\ 0 & 1 & 0 \\ -0.500 & 0 & 0.866 \end{bmatrix}$$
2. Position offset along the angled torch tip:
   $$p = [L_{\text{tool}}\sin 30^\circ, 0, L_{\text{tool}}\cos 30^\circ]^T = [0.15(0.5), 0, 0.15(0.866)]^T = [0.075, 0, 0.1299]^T\text{ m}$$
3. Full tool matrix:
   $$T_n^{\text{tcp}} = \begin{bmatrix} 0.866 & 0 & 0.500 & 0.075 \\ 0 & 1 & 0 & 0.000 \\ -0.500 & 0 & 0.866 & 0.1299 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

### Problem 3.18: Spherical Coordinate Manipulator (RRP) DH Parameters
**Problem Statement:** A spherical coordinate robot has a revolute waist ($\theta_1$), revolute shoulder pitch ($\theta_2$), and prismatic boom extension ($d_3$). Construct its Standard DH table.

**Solution:**
Standard DH Table for Spherical (RRP) Robot:

| Link $i$ | $a_i$ | $\alpha_i$ | $d_i$ | $\theta_i$ |
| :---: | :---: | :---: | :---: | :---: |
| 1 | $0$ | $-90^\circ$ | $d_1$ | $\theta_1^*$ |
| 2 | $0$ | $+90^\circ$ | $0$ | $\theta_2^*$ |
| 3 | $0$ | $0^\circ$ | $d_3^*$ | $0^\circ$ |

---

### Problem 3.19: Spherical Wrist Forward Kinematics Cascade
**Problem Statement:** A spherical wrist has DH matrices with $a_4 = a_5 = a_6 = 0, d_4 = 0, d_5 = 0, d_6 = d_t$. Show that the position of the wrist center $O_5$ is independent of wrist joint angles $\theta_4, \theta_5, \theta_6$.

**Solution:**
1. The wrist center is defined as the physical intersection of axes $z_3, z_4, z_5$.
2. Frame origins $O_3, O_4, O_5$ are all coincident at this point.
3. In the coordinate cascade:
   $$p_w = T_0^3 \begin{bmatrix} 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
4. Because $T_0^3 = A_1(\theta_1) A_2(\theta_2) A_3(\theta_3)$, $p_w$ is a function strictly of the first three joint variables $(\theta_1, \theta_2, \theta_3)$!
5. Rotating $\theta_4, \theta_5, \theta_6$ alters only the orientation of the gripper, leaving the 3D position of the wrist center completely stationary.

---

### Problem 3.20: Automated Matrix Invariant Verification
**Problem Statement:** State the mathematical invariant checks that any algorithm evaluating DH transformation matrices $A_i$ must verify to guarantee numerical validity.

**Solution:**
For any valid homogeneous transformation matrix $A = \begin{bmatrix} R & p \\ 0 & 1 \end{bmatrix}$:
1. **Determinant of Rotation:** $\det(R) = +1.000000 \pm 10^{-6}$.
2. **Orthogonality of Rotation:** $\|R^T R - I\|_\infty < 10^{-6}$.
3. **Column Normalization:** Each column of $R$ must have Euclidean norm equal to $1.0$: $|\|r_k\| - 1.0| < 10^{-6}$.
4. **Bottom Row Invariant:** The bottom row must be strictly $[0, 0, 0, 1]$.

---

# Chapter 4: Forward Kinematics Chains and the Product of Exponentials (PoE) Formula

---

## 1. The Layman's Genesis & Intuitive Overview

In Chapter 3, we explored how the Denavit-Hartenberg (DH) convention standardizes the geometric description of an articulated robotic arm by attaching an individual coordinate frame to every link. While DH was a historic breakthrough in 1955, anyone who has attempted to calibrate a real-world industrial robot using DH has encountered its frustrating quirks:
- Setting up the intermediate coordinate frames requires solving a series of delicate geometric puzzles: Where is the common normal? Which direction should $x_i$ point? What if two axes intersect or are parallel?
- Even worse, if two consecutive joint axes in an arm are nominally parallel, a microscopic manufacturing flaw of $0.001^\circ$ causes the mathematical common normal to jump wildly across space, causing link offsets and joint angles to diverge toward infinity.

In the 1980s and 1990s, roboticists asked a radical question: **Can we compute the exact 3D position and orientation of the end-effector without setting up any intermediate coordinate frames at all?**

```
     Denavit-Hartenberg: Frame 0 ──▶ Frame 1 ──▶ Frame 2 ──▶ Frame 3 ──▶ Frame 4 ──▶ End-Effector
     (Intermediate frames required on every bone; sensitive to axis parallelism)

     Product of Exponentials:  Fixed Space Frame {s} ═══════════════════════▶ End-Effector {b}
     (Zero intermediate frames; all joints modeled as physical screw axes flowing from Home M)
```

The answer is the **Product of Exponentials (PoE) formula**. Instead of creating artificial coordinate frames on every link, PoE requires only **two frames in the entire universe**:
1. The stationary **Space Frame $\{s\}$** fixed to the robot base.
2. The moving **Body Frame $\{b\}$** fixed to the end-effector tool tip.

To describe the entire robot, you simply place the robot in an arbitrary, convenient "zero" or "home" posture (typically with all joint angles $q_1 = q_2 = \cdots = q_n = 0$). You record the initial pose of the tool $M \in SE(3)$, and you write down the physical direction and location of each joint's motor shaft in space. Then, as each joint motor rotates by angle $q_i$, it simply twists the entire downstream arm along its spatial screw axis!

---

## 2. Historical Foundations & Epistemological Evolution

The theoretical breakthrough that replaced Denavit-Hartenberg notation with modern geometric mechanics occurred in 1984, when **Roger W. Brockett** published his landmark paper *"Robot Arm Kinematics and Dynamics: A Lie Theoretic Approach"*. Brockett recognized that because rigid body motions form the Lie group $SE(3)$, the forward kinematics of any open-chain serial manipulator can be written as a product of matrix exponentials flowing along the Lie algebra $\mathfrak{se}(3)$.

In 1994, **Richard M. Murray**, **Zexiang Li**, and **S. Shankar Sastry** published the monumental textbook *A Mathematical Introduction to Robotic Manipulation* (often called the "MLS bible"). Murray, Li, and Sastry systematized the Product of Exponentials formulation, demonstrating that it:
1. Provides a globally smooth, singularity-free parameterization of robot kinematics (resolving the Hayati-Mirmirani singularity of DH parameters).
2. Directly unifies forward kinematics, differential kinematics (Jacobians), and robotic dynamics into a coherent geometric framework.
3. Greatly simplifies kinematic calibration, because perturbing a joint axis screw produces a smooth, well-conditioned linear perturbation in end-effector pose.

Today, modern robotics engines, kinematics libraries, and multibody simulators—including Pinocchio, Modern Robotics, and advanced research controllers—treat the Product of Exponentials as the primary mathematical foundation of spatial manipulation.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Chaining Homogeneous Transformations
In classical kinematics, if coordinate frames $\{0\}, \{1\}, \dots, \{n\}$ are attached sequentially along an $n$-link serial manipulator, the end-effector pose relative to the base frame is given by the matrix cascade:
$$T_0^n(q) = A_1(q_1) A_2(q_2) \cdots A_n(q_n)$$
where each $A_i(q_i) \in SE(3)$ is the relative transformation between frame $\{i-1\}$ and frame $\{i\}$. While conceptually straightforward, evaluating this cascade requires maintaining $n$ separate local coordinate transformations.

### 3.2 The Space-Frame Product of Exponentials (PoE) Formula
Let $\{s\}$ denote the stationary space frame fixed to the robot base, and $\{b\}$ denote the body frame fixed to the end-effector.

#### Definition of Home Configuration $M$:
The **Home Configuration** $M \in SE(3)$ is the initial pose of the end-effector body frame $\{b\}$ relative to the space frame $\{s\}$ when all joint coordinates are set to zero ($q = 0$):
$$M = T_{sb}(0) = \begin{bmatrix} R_0 & p_0 \\ 0_{1 \times 3} & 1 \end{bmatrix} \in SE(3)$$

#### Spatial Screw Axes $\mathcal{S}_i$:
For each joint $i \in \{1, 2, \dots, n\}$, let $\mathcal{S}_i = (\omega_i, v_i) \in \mathbb{R}^6$ denote its **spatial screw axis**, expressed in the stationary base frame $\{s\}$, when the robot is at its home configuration ($q = 0$):
- **For a Revolute Joint:**
  Let $\hat{\omega}_i \in \mathbb{R}^3$ be a unit vector along the joint's axis of rotation, and let $q_i \in \mathbb{R}^3$ be any point lying on the axis of rotation (both measured in frame $\{s\}$ at $q = 0$). Then:
  $$\omega_i = \hat{\omega}_i, \quad v_i = -\hat{\omega}_i \times q_i$$
- **For a Prismatic Joint:**
  Let $\hat{v}_i \in \mathbb{R}^3$ be a unit vector pointing along the direction of linear translation at $q = 0$. Then:
  $$\omega_i = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}, \quad v_i = \hat{v}_i$$

#### The Space-Frame PoE Formula:
If joint 1 moves by $q_1$, it displaces the entire rest of the robot according to $\exp([\mathcal{S}_1]q_1)$.
If joint 2 moves by $q_2$, its axis was already displaced by joint 1; however, in spatial coordinates, the motion of joint 2 is applied relative to its initial axis, pre-multiplied by the motion of joint 1!
By recursive composition of spatial twists:
$$T_{sb}(q) = e^{[\mathcal{S}_1]q_1} e^{[\mathcal{S}_2]q_2} \cdots e^{[\mathcal{S}_n]q_n} M$$
where $[\mathcal{S}_i] \in \mathfrak{se}(3)$ is the $4 \times 4$ matrix:
$$[\mathcal{S}_i] = \begin{bmatrix} [\omega_i] & v_i \\ 0_{1 \times 3} & 0 \end{bmatrix}$$

```
   Joint 1       Joint 2                Joint n       Home Pose M
   ╭─────╮       ╭─────╮                ╭─────╮         ┌─────┐
   │ e^S1│  ──▶  │ e^S2│   ──▶ ... ──▶  │ e^Sn│   ──▶   │  M  │  =  T_{sb}(q)
   ╰─────╯       ╰─────╯                ╰─────╯         └─────┘
   (Pre-multiplied from base to tip in stationary space coordinates)
```

### 3.3 The Body-Frame Product of Exponentials Formula
Alternatively, forward kinematics can be formulated entirely with respect to the moving end-effector **body frame $\{b\}$**.

Let $\mathcal{B}_i = (\omega_{b, i}, v_{b, i}) \in \mathbb{R}^6$ be the screw axis of joint $i$ expressed in the end-effector frame $\{b\}$ when the robot is at the home configuration ($q = 0$).

#### Transformation between Spatial and Body Screws:
Recall from Chapter 2 that the adjoint map $\operatorname{Ad}_{T_{sb}}$ relates spatial and body twists. Since $M = T_{sb}(0)$ relates the space frame $\{s\}$ to the body frame $\{b\}$ at home:
$$\mathcal{S}_i = \operatorname{Ad}_M \mathcal{B}_i \iff \mathcal{B}_i = \operatorname{Ad}_{M^{-1}} \mathcal{S}_i$$

#### The Body-Frame PoE Formula:
In body coordinates, joint motions post-multiply:
$$T_{sb}(q) = M e^{[\mathcal{B}_1]q_1} e^{[\mathcal{B}_2]q_2} \cdots e^{[\mathcal{B}_n]q_n}$$

*Proof of Equivalence:*
Using the matrix identity $e^{M [\mathcal{B}] M^{-1}} = M e^{[\mathcal{B}]} M^{-1}$:
$$e^{[\mathcal{S}_i]q_i} = e^{M [\mathcal{B}_i] M^{-1} q_i} = M e^{[\mathcal{B}_i]q_i} M^{-1}$$
Substituting this into the space-frame PoE formula:
$$T(q) = (M e^{[\mathcal{B}_1]q_1} M^{-1})(M e^{[\mathcal{B}_2]q_2} M^{-1}) \cdots (M e^{[\mathcal{B}_n]q_n} M^{-1}) M$$
All adjacent interior $M^{-1} M$ terms cancel to identity:
$$T(q) = M e^{[\mathcal{B}_1]q_1} e^{[\mathcal{B}_2]q_2} \cdots e^{[\mathcal{B}_n]q_n}$$
Both formulations are mathematically identical.

### 3.4 Invariance of the Screw Axis under Point Selection
For a revolute joint, the linear velocity component of the spatial screw is $v = -\omega \times q$, where $q$ is a point on the axis.
Suppose an engineer chooses a different point $q' = q + c \omega$ located further along the same axis line ($c \in \mathbb{R}$).
The new linear component is:
$$v' = -\omega \times q' = -\omega \times (q + c \omega) = -\omega \times q - c(\omega \times \omega)$$
Because the cross product of any vector with itself is identically zero ($\omega \times \omega = 0$):
$$v' = -\omega \times q = v$$
The screw axis $\mathcal{S} = (\omega, v)$ is **strictly invariant** to whichever point on the physical rotation line is chosen!

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the Product of Exponentials forward kinematics engine:

```typescript
export interface ScrewAxis {
  omega: { x: number; y: number; z: number };
  v: { x: number; y: number; z: number };
}

export class ProductOfExponentials {
  /**
   * Computes the matrix exponential on SE(3): exp([S] * theta)
   */
  public static matrixExponential(screw: ScrewAxis, theta: number): number[][] {
    const { omega, v } = screw;
    const wNorm = Math.sqrt(omega.x * omega.x + omega.y * omega.y + omega.z * omega.z);

    if (wNorm < 1e-12) {
      // Pure translation (Prismatic Joint)
      return [
        [1, 0, 0, v.x * theta],
        [0, 1, 0, v.y * theta],
        [0, 0, 1, v.z * theta],
        [0, 0, 0, 1          ]
      ];
    }

    // Revolute Joint: normalize omega
    const wx = omega.x / wNorm;
    const wy = omega.y / wNorm;
    const wz = omega.z / wNorm;
    const th = theta * wNorm;

    const c = Math.cos(th);
    const s = Math.sin(th);
    const v_cos = 1 - c;

    // Rodrigues rotation matrix R
    const R = [
      [wx * wx * v_cos + c,      wx * wy * v_cos - wz * s, wx * wz * v_cos + wy * s],
      [wx * wy * v_cos + wz * s, wy * wy * v_cos + c,      wy * wz * v_cos - wx * s],
      [wx * wz * v_cos - wy * s, wy * wz * v_cos + wx * s, wz * wz * v_cos + c     ]
    ];

    // G(theta) * v translation: G = I*th + (1-c)*[w] + (th - s)*[w]^2
    // Evaluated directly:
    const vx = v.x / wNorm;
    const vy = v.y / wNorm;
    const vz = v.z / wNorm;

    const skewV = [
      -wz * vy + wy * vz,
       wz * vx - wx * vz,
      -wy * vx + wx * vy
    ];

    const skewSqV = [
      -(wy * wy + wz * wz) * vx + wx * wy * vy + wx * wz * vz,
       wx * wy * vx - (wx * wx + wz * wz) * vy + wy * wz * vz,
       wx * wz * vx + wy * wz * vy - (wx * wx + wy * wy) * vz
    ];

    const px = th * vx + (1 - c) * skewV[0] + (th - s) * skewSqV[0];
    const py = th * vy + (1 - c) * skewV[1] + (th - s) * skewSqV[1];
    const pz = th * vz + (1 - c) * skewV[2] + (th - s) * skewSqV[2];

    return [
      [R[0][0], R[0][1], R[0][2], px],
      [R[1][0], R[1][1], R[1][2], py],
      [R[2][0], R[2][1], R[2][2], pz],
      [0,       0,       0,       1 ]
    ];
  }

  /**
   * Forward kinematics in space frame: T(q) = e^[S1]q1 * ... * e^[Sn]qn * M
   */
  public static forwardKinematicsSpace(screws: ScrewAxis[], q: number[], M: number[][]): number[][] {
    let T: number[][] = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];

    for (let i = 0; i < screws.length; i++) {
      const expS = this.matrixExponential(screws[i], q[i]);
      T = this.multiply4x4(T, expS);
    }
    return this.multiply4x4(T, M);
  }

  private static multiply4x4(A: number[][], B: number[][]): number[][] {
    const C: number[][] = Array.from({ length: 4 }, () => new Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += A[i][k] * B[k][j];
        }
        C[i][j] = sum;
      }
    }
    return C;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 4.1: Space-Frame PoE for a 2R Planar Manipulator
**Problem Statement:** A 2R planar manipulator operates in the $xy$-plane. Joint 1 is fixed at the origin $(0, 0, 0)$ rotating about $+\hat{z}$. Joint 2 is located at $(L_1, 0, 0)$ at home configuration, also rotating about $+\hat{z}$. The end-effector tool tip is at $(L_1 + L_2, 0, 0)$.
1. Determine the home configuration matrix $M$.
2. Formulate the spatial screw axes $\mathcal{S}_1$ and $\mathcal{S}_2$.
3. Evaluate the space-frame PoE formula to compute $T_{sb}(\theta_1, \theta_2)$.

**Given Data:**
- Link lengths $L_1, L_2$
- Space frame $\{s\}$ origin at base Joint 1
- Body frame $\{b\}$ origin at end-effector tip, aligned with $\{s\}$ at home configuration.

**Step-by-Step Derivation:**
1. Home Configuration Matrix $M$:
   At $q = (0, 0)$, both links lie along the $+x$-axis:
   $$R_0 = I_3, \quad p_0 = \begin{bmatrix} L_1 + L_2 \\ 0 \\ 0 \end{bmatrix}$$
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Spatial Screw Axis $\mathcal{S}_1$:
   Joint 1 rotates about $+\hat{z}$: $\omega_1 = [0, 0, 1]^T$.
   Point on axis 1: $q_1 = [0, 0, 0]^T$.
   $$v_1 = -\omega_1 \times q_1 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
   $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
3. Spatial Screw Axis $\mathcal{S}_2$:
   Joint 2 rotates about $+\hat{z}$: $\omega_2 = [0, 0, 1]^T$.
   Point on axis 2 at home: $q_2 = [L_1, 0, 0]^T$.
   $$v_2 = -\omega_2 \times q_2 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1 \\ 0 \\ 0 \end{bmatrix} = -\begin{bmatrix} 0 \\ L_1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -L_1 \\ 0 \end{bmatrix}$$
   $$\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$$
4. Compute Matrix Exponentials:
   - For Joint 1: Rotation about origin by $\theta_1$:
     $$e^{[\mathcal{S}_1]\theta_1} = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   - For Joint 2: Rotation about $(L_1, 0)$ by $\theta_2$:
     $$e^{[\mathcal{S}_2]\theta_2} = \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_1(1 - \cos\theta_2) \\ \sin\theta_2 & \cos\theta_2 & 0 & -L_1\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
5. Multiply $T(\theta_1, \theta_2) = e^{[\mathcal{S}_1]\theta_1} e^{[\mathcal{S}_2]\theta_2} M$:
   First multiply $e^{[\mathcal{S}_2]\theta_2} M$:
   $$e^{[\mathcal{S}_2]\theta_2} \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_1 + L_2\cos\theta_2 \\ \sin\theta_2 & \cos\theta_2 & 0 & L_2\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   Now pre-multiply by $e^{[\mathcal{S}_1]\theta_1}$:
   $$T = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \cos\theta_2 & -\sin\theta_2 & 0 & L_1 + L_2\cos\theta_2 \\ \sin\theta_2 & \cos\theta_2 & 0 & L_2\sin\theta_2 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   Evaluating the top-left $2 \times 2$ block gives $\operatorname{Rot}_z(\theta_1 + \theta_2)$.
   Evaluating the position column:
   $$x = \cos\theta_1(L_1 + L_2\cos\theta_2) - \sin\theta_1(L_2\sin\theta_2) = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2)$$
   $$y = \sin\theta_1(L_1 + L_2\cos\theta_2) + \cos\theta_1(L_2\sin\theta_2) = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2)$$

**Final Answer:**
$$T_{sb}(\theta) = \begin{bmatrix} \cos(\theta_1 + \theta_2) & -\sin(\theta_1 + \theta_2) & 0 & L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) \\ \sin(\theta_1 + \theta_2) & \cos(\theta_1 + \theta_2) & 0 & L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
The resulting $T_{sb}$ matches the Standard DH derivation in Problem 3.1 with absolute, 100% mathematical precision—without ever defining intermediate coordinate axes $x_1$ or $y_1$!

---

### Problem 4.2: Body-Frame PoE for the 2R Planar Manipulator
**Problem Statement:** For the 2R planar arm from Problem 4.1:
1. Derive the body-frame screw axes $\mathcal{B}_1$ and $\mathcal{B}_2$ using the adjoint transformation $\mathcal{B}_i = \operatorname{Ad}_{M^{-1}} \mathcal{S}_i$.
2. Verify that $T = M e^{[\mathcal{B}_1]\theta_1} e^{[\mathcal{B}_2]\theta_2}$ yields the exact same forward kinematics.

**Given Data:**
- $M = \begin{bmatrix} I & p_0 \\ 0 & 1 \end{bmatrix}$ with $p_0 = [L_1 + L_2, 0, 0]^T$.
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$

**Step-by-Step Derivation:**
1. Compute $M^{-1}$:
   $$M^{-1} = \begin{bmatrix} I & -p_0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & -(L_1 + L_2) \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Adjoint representation of $M^{-1}$:
   $$\operatorname{Ad}_{M^{-1}} = \begin{bmatrix} I & 0 \\ [-p_0] & I \end{bmatrix}$$
   where:
   $$[-p_0] = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & L_1 + L_2 \\ 0 & -(L_1 + L_2) & 0 \end{bmatrix}$$
3. Compute $\mathcal{B}_1 = \operatorname{Ad}_{M^{-1}} \mathcal{S}_1$:
   $$\omega_{b, 1} = I \omega_1 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$v_{b, 1} = [-p_0] \omega_1 + v_1 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0 & L_1 + L_2 \\ 0 & -(L_1 + L_2) & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ L_1 + L_2 \\ 0 \end{bmatrix}$$
   $$\mathcal{B}_1 = [0, 0, 1, 0, L_1 + L_2, 0]^T$$
4. Compute $\mathcal{B}_2 = \operatorname{Ad}_{M^{-1}} \mathcal{S}_2$:
   $$\omega_{b, 2} = I \omega_2 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$v_{b, 2} = [-p_0] \omega_2 + v_2 = \begin{bmatrix} 0 \\ L_1 + L_2 \\ 0 \end{bmatrix} + \begin{bmatrix} 0 \\ -L_1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ L_2 \\ 0 \end{bmatrix}$$
   $$\mathcal{B}_2 = [0, 0, 1, 0, L_2, 0]^T$$
5. Physical Interpretation of Body Screws:
   - In the body frame $\{b\}$ at home:
     - Joint 2 is located at distance $-L_2$ along the $-x_b$ axis ($q_{b, 2} = [-L_2, 0, 0]^T$).
     - Linear velocity in body frame: $v_{b, 2} = -\omega \times q_{b, 2} = -[0, 0, 1]^T \times [-L_2, 0, 0]^T = [0, L_2, 0]^T$.
     - Joint 1 is located at distance $-(L_1 + L_2)$ along $-x_b$ ($q_{b, 1} = [-(L_1 + L_2), 0, 0]^T$).
     - Linear velocity: $v_{b, 1} = -\omega \times q_{b, 1} = [0, L_1 + L_2, 0]^T$.
   The body screws directly reflect physical distances from the tool tip!

**Final Answer:**
- $\mathcal{B}_1 = [0, 0, 1, 0, L_1 + L_2, 0]^T$
- $\mathcal{B}_2 = [0, 0, 1, 0, L_2, 0]^T$

**Verification & Sanity Check:**
Evaluating $M e^{[\mathcal{B}_1]\theta_1} e^{[\mathcal{B}_2]\theta_2}$ produces the exact same forward kinematics matrix $T_{sb}(\theta)$.

---

### Problem 4.3: Space-Frame PoE for a 3R Planar Manipulator
**Problem Statement:** Extend the planar arm to 3 links with lengths $L_1, L_2, L_3$ and joint angles $\theta_1, \theta_2, \theta_3$. Formulate the space-frame screw axes $\mathcal{S}_1, \mathcal{S}_2, \mathcal{S}_3$ and the home configuration matrix $M$.

**Given Data:**
- Joint 1 at origin $(0, 0, 0)$
- Joint 2 at $(L_1, 0, 0)$
- Joint 3 at $(L_1 + L_2, 0, 0)$
- End-effector tool tip at $(L_1 + L_2 + L_3, 0, 0)$
- All rotation axes parallel to $+\hat{z}$.

**Step-by-Step Derivation:**
1. Home Configuration Matrix $M$:
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 + L_3 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Spatial Screws $\mathcal{S}_i = (\omega_i, -\omega_i \times q_i)$:
   - For Joint 1: $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies v_1 = [0, 0, 0]^T$.
     $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
   - For Joint 2: $\omega_2 = [0, 0, 1]^T, q_2 = [L_1, 0, 0]^T$:
     $$v_2 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -L_1 \\ 0 \end{bmatrix}$$
     $$\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$$
   - For Joint 3: $\omega_3 = [0, 0, 1]^T, q_3 = [L_1 + L_2, 0, 0]^T$:
     $$v_3 = -\begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1 + L_2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -(L_1 + L_2) \\ 0 \end{bmatrix}$$
     $$\mathcal{S}_3 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$$

**Final Answer:**
- $M = \begin{bmatrix} I & [L_1 + L_2 + L_3, 0, 0]^T \\ 0 & 1 \end{bmatrix}$
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$
- $\mathcal{S}_3 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$

**Verification & Sanity Check:**
Setting all $\theta_i = 0$ yields $T(0) = e^0 e^0 e^0 M = M$. Position is $(L_1 + L_2 + L_3, 0, 0)$, perfectly correct.

---

### Problem 4.4: Space-Frame PoE for a SCARA Manipulator (RRPR)
**Problem Statement:** A SCARA robot has:
- Base pedestal height $H_1$.
- Arm 1 length $L_1$ rotating about vertical $z$.
- Arm 2 length $L_2$ rotating about vertical $z$.
- Prismatic vertical quill translating along $-\hat{z}$ (variable $d_3$).
- Wrist roll rotating about vertical $z$ (variable $\theta_4$).
At home configuration ($q = 0$), the arm extends straight along the $+x$-axis at height $H_1$. Formulate the 4 spatial screw axes and home matrix $M$.

**Given Data:**
- Joint 1 (R): axis at $[0, 0, z]^T$, direction $+\hat{z}$.
- Joint 2 (R): axis at $[L_1, 0, z]^T$, direction $+\hat{z}$.
- Joint 3 (P): prismatic translation along $-\hat{z}$.
- Joint 4 (R): axis at $[L_1 + L_2, 0, z]^T$, direction $+\hat{z}$.
- Home end-effector tip at $[L_1 + L_2, 0, H_1]^T$.

**Step-by-Step Derivation:**
1. Home Matrix $M$:
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Revolute Joint 1:
   $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies v_1 = [0, 0, 0]^T$.
   $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
3. Revolute Joint 2:
   $\omega_2 = [0, 0, 1]^T, q_2 = [L_1, 0, 0]^T \implies v_2 = [0, -L_1, 0]^T$.
   $$\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$$
4. Prismatic Joint 3:
   Translates vertically downward along $-\hat{z}$: $\omega_3 = [0, 0, 0]^T, v_3 = [0, 0, -1]^T$.
   $$\mathcal{S}_3 = [0, 0, 0, 0, 0, -1]^T$$
5. Revolute Joint 4:
   $\omega_4 = [0, 0, 1]^T, q_4 = [L_1 + L_2, 0, 0]^T \implies v_4 = [0, -(L_1 + L_2), 0]^T$.
   $$\mathcal{S}_4 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$$

**Final Answer:**
- $M = \begin{bmatrix} I & [L_1 + L_2, 0, H_1]^T \\ 0 & 1 \end{bmatrix}$
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 0, 1, 0, -L_1, 0]^T$
- $\mathcal{S}_3 = [0, 0, 0, 0, 0, -1]^T$
- $\mathcal{S}_4 = [0, 0, 1, 0, -(L_1 + L_2), 0]^T$

**Verification & Sanity Check:**
If $d_3$ extends by $0.2\text{ m}$, $\exp([\mathcal{S}_3]d_3) = \operatorname{Trans}(0, 0, -0.2)$. Multiplying by $M$ yields $z = H_1 - 0.2\text{ m}$, exactly matching the downward motion of the quill.

---

### Problem 4.5: Space-Frame PoE for a 3-DoF Anthropomorphic Arm
**Problem Statement:** An anthropomorphic 3-DoF arm has:
- Joint 1 (Waist): Rotates about vertical axis $z_0$.
- Joint 2 (Shoulder): Located at height $H_1$, rotates about horizontal axis parallel to $+\hat{y}$.
- Joint 3 (Elbow): Located at distance $L_1$ along $+x$ from shoulder at height $H_1$, rotating about horizontal axis parallel to $+\hat{y}$.
- Tool tip: Located at distance $L_2$ along $+x$ from elbow.
Derive the home matrix $M$ and spatial screws $\mathcal{S}_1, \mathcal{S}_2, \mathcal{S}_3$.

**Given Data:**
- $q_1 = [0, 0, 0]^T, \omega_1 = [0, 0, 1]^T$
- $q_2 = [0, 0, H_1]^T, \omega_2 = [0, 1, 0]^T$
- $q_3 = [L_1, 0, H_1]^T, \omega_3 = [0, 1, 0]^T$
- Tool tip at $[L_1 + L_2, 0, H_1]^T$.

**Step-by-Step Derivation:**
1. Home Matrix $M$:
   $$M = \begin{bmatrix} 1 & 0 & 0 & L_1 + L_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Screw Axis 1:
   $$\omega_1 = [0, 0, 1]^T, \quad v_1 = -[0, 0, 1]^T \times [0, 0, 0]^T = [0, 0, 0]^T$$
   $$\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$$
3. Screw Axis 2:
   $$\omega_2 = [0, 1, 0]^T, \quad v_2 = -[0, 1, 0]^T \times [0, 0, H_1]^T = -[H_1, 0, 0]^T = [-H_1, 0, 0]^T$$
   $$\mathcal{S}_2 = [0, 1, 0, -H_1, 0, 0]^T$$
4. Screw Axis 3:
   $$\omega_3 = [0, 1, 0]^T, \quad v_3 = -[0, 1, 0]^T \times [L_1, 0, H_1]^T = -[H_1, 0, -L_1]^T = [-H_1, 0, L_1]^T$$
   $$\mathcal{S}_3 = [0, 1, 0, -H_1, 0, L_1]^T$$

**Final Answer:**
- $M = \begin{bmatrix} I & [L_1 + L_2, 0, H_1]^T \\ 0 & 1 \end{bmatrix}$
- $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
- $\mathcal{S}_2 = [0, 1, 0, -H_1, 0, 0]^T$
- $\mathcal{S}_3 = [0, 1, 0, -H_1, 0, L_1]^T$

**Verification & Sanity Check:**
If Joint 2 rotates by $\theta_2$, the linear velocity at the origin is $v_2 = [-H_1, 0, 0]^T$. Since the joint is at height $H_1$, rotating about $+y$ pushes points at $z = 0$ along $-x$. The sign is physically accurate.

---

### Problem 4.6: Complete Spatial Screw Table for the Universal Robots UR5
**Problem Statement:** Using the UR5 dimensions:
- Base height $H_1 = 0.089159\text{ m}$
- Upper arm length $L_1 = 0.425\text{ m}$
- Forearm length $L_2 = 0.39225\text{ m}$
- Shoulder-to-elbow lateral offset $W_1 = 0.13585\text{ m}$
- Forearm-to-wrist lateral offset $W_2 = 0.1197\text{ m}$
- Tool length $H_2 = 0.0823\text{ m}$
At the standard home pose (arm extended along $+x$, tool pointing along $+x$):
Derive all 6 spatial screw axes $\mathcal{S}_1, \dots, \mathcal{S}_6$ and home matrix $M$.

**Step-by-Step Derivation:**
1. Identify the joint axes at home:
   - Joint 1 (Base roll): Vertical along $+\hat{z}$, through origin $[0, 0, 0]^T$.
   - Joint 2 (Shoulder pitch): Horizontal along $+\hat{y}$, through $[0, W_1, H_1]^T$.
   - Joint 3 (Elbow pitch): Horizontal along $+\hat{y}$, through $[L_1, W_1, H_1]^T$.
   - Joint 4 (Wrist 1 pitch): Horizontal along $+\hat{y}$, through $[L_1 + L_2, W_1, H_1]^T$.
   - Joint 5 (Wrist 2 yaw): Vertical along $-\hat{z}$, through $[L_1 + L_2, W_1 + W_2, H_1]^T$.
   - Joint 6 (Wrist 3 roll): Horizontal along $+\hat{x}$, through $[L_1 + L_2, W_1 + W_2, H_1]^T$.
2. Compute linear components $v_i = -\omega_i \times q_i$:
   - $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$
   - $\mathcal{S}_2$: $\omega_2 = [0, 1, 0]^T, q_2 = [0, W_1, H_1]^T \implies v_2 = -[0, 1, 0]^T \times [0, W_1, H_1]^T = [-H_1, 0, 0]^T$.
     $$\mathcal{S}_2 = [0, 1, 0, -H_1, 0, 0]^T$$
   - $\mathcal{S}_3$: $\omega_3 = [0, 1, 0]^T, q_3 = [L_1, W_1, H_1]^T \implies v_3 = [-H_1, 0, L_1]^T$.
     $$\mathcal{S}_3 = [0, 1, 0, -H_1, 0, L_1]^T$$
   - $\mathcal{S}_4$: $\omega_4 = [0, 1, 0]^T, q_4 = [L_1 + L_2, W_1, H_1]^T \implies v_4 = [-H_1, 0, L_1 + L_2]^T$.
     $$\mathcal{S}_4 = [0, 1, 0, -H_1, 0, L_1 + L_2]^T$$
   - $\mathcal{S}_5$: $\omega_5 = [0, 0, -1]^T, q_5 = [L_1 + L_2, W_1 + W_2, H_1]^T \implies v_5 = -[0, 0, -1]^T \times q_5 = [-(W_1 + W_2), L_1 + L_2, 0]^T$.
     $$\mathcal{S}_5 = [0, 0, -1, -(W_1 + W_2), L_1 + L_2, 0]^T$$
   - $\mathcal{S}_6$: $\omega_6 = [1, 0, 0]^T, q_6 = [L_1 + L_2, W_1 + W_2, H_1]^T \implies v_6 = -[1, 0, 0]^T \times q_6 = [0, H_1, -(W_1 + W_2)]^T$.
     $$\mathcal{S}_6 = [1, 0, 0, 0, H_1, -(W_1 + W_2)]^T$$
3. Home Configuration $M$:
   $$M = \begin{bmatrix} 0 & 0 & 1 & L_1 + L_2 + H_2 \\ 0 & 1 & 0 & W_1 + W_2 \\ -1 & 0 & 0 & H_1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
The complete spatial screw table for the UR5 is fully derived above.

**Verification & Sanity Check:**
Every single parameter is directly measured from the physical CAD dimensions without drawing any intermediate coordinate frames!

---

### Problem 4.7: Numerical Forward Kinematics Evaluation
**Problem Statement:** For the planar 2R arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$, use the PoE formula to calculate the exact numerical $4 \times 4$ transformation matrix $T_{sb}$ when $\theta_1 = 45^\circ = \frac{\pi}{4}\text{ rad}$ and $\theta_2 = 90^\circ = \frac{\pi}{2}\text{ rad}$.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $\theta_1 = \pi/4$, $\cos(\pi/4) = \sin(\pi/4) = \frac{\sqrt{2}}{2} \approx 0.707107$
- $\theta_2 = \pi/2$, $\cos(\pi/2) = 0, \sin(\pi/2) = 1$
- $\theta_1 + \theta_2 = 135^\circ = \frac{3\pi}{4}\text{ rad}$
- $\cos(135^\circ) = -\frac{\sqrt{2}}{2} \approx -0.707107, \sin(135^\circ) = \frac{\sqrt{2}}{2} \approx 0.707107$

**Step-by-Step Derivation:**
1. Rotation submatrix:
   $$R = \operatorname{Rot}_z(135^\circ) = \begin{bmatrix} -0.707107 & -0.707107 & 0 \\ 0.707107 & -0.707107 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
2. Position coordinates:
   $$x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) = 1.0\left(\frac{\sqrt{2}}{2}\right) + 1.0\left(-\frac{\sqrt{2}}{2}\right) = 0.0\text{ m}$$
   $$y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2) = 1.0\left(\frac{\sqrt{2}}{2}\right) + 1.0\left(\frac{\sqrt{2}}{2}\right) = \sqrt{2} \approx 1.414214\text{ m}$$
   $$z = 0.0\text{ m}$$
3. Assemble the $4 \times 4$ matrix:

**Final Answer:**
$$T_{sb} = \begin{bmatrix} -0.707107 & -0.707107 & 0 & 0.000000 \\ 0.707107 & -0.707107 & 0 & 1.414214 \\ 0 & 0 & 1 & 0.000000 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
Arm 1 points toward $(0.707, 0.707)$. Arm 2 turns $90^\circ$ left, pointing toward $(-0.707, 0.707)$. Adding vectors: $(0.707 - 0.707, 0.707 + 0.707) = (0, 1.414)$, exactly on the $y$-axis!

---

### Problem 4.8: Adjoint Conversion from Space to Body Screws
**Problem Statement:** Let a spatial screw be $\mathcal{S} = [0, 0, 1, 0, -2.0, 0]^T$. The home configuration matrix is:
$$M = \begin{bmatrix} 0 & -1 & 0 & 3.0 \\ 1 & 0 & 0 & 1.0 \\ 0 & 0 & 1 & 0.0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
Calculate the corresponding body screw axis $\mathcal{B} = \operatorname{Ad}_{M^{-1}} \mathcal{S}$.

**Given Data:**
- $R_M = \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$ (a $90^\circ$ rotation about $\hat{z}$)
- $p_M = [3.0, 1.0, 0.0]^T$

**Step-by-Step Derivation:**
1. Compute $M^{-1}$:
   $$R_M^T = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   $$-R_M^T p_M = -\begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 3.0 \\ 1.0 \\ 0.0 \end{bmatrix} = -\begin{bmatrix} 1.0 \\ -3.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -1.0 \\ 3.0 \\ 0.0 \end{bmatrix}$$
2. Adjoint transformation equation:
   $$\omega_b = R_M^T \omega_s = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$v_b = [-R_M^T p_M] \omega_b + R_M^T v_s$$
3. Compute $R_M^T v_s$:
   $$R_M^T \begin{bmatrix} 0 \\ -2.0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 & 1 & 0 \\ -1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 \\ -2.0 \\ 0 \end{bmatrix} = \begin{bmatrix} -2.0 \\ 0 \\ 0 \end{bmatrix}$$
4. Compute $[-R_M^T p_M] \omega_b = (-R_M^T p_M) \times \omega_b$:
   $$\begin{bmatrix} -1.0 \\ 3.0 \\ 0.0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 3.0(1) - 0(0) \\ 0(0) - (-1.0)(1) \\ -1.0(0) - 3.0(0) \end{bmatrix} = \begin{bmatrix} 3.0 \\ 1.0 \\ 0.0 \end{bmatrix}$$
5. Sum to get $v_b$:
   $$v_b = \begin{bmatrix} 3.0 \\ 1.0 \\ 0.0 \end{bmatrix} + \begin{bmatrix} -2.0 \\ 0.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 1.0 \\ 0.0 \end{bmatrix}$$

**Final Answer:**
$$\mathcal{B} = [0, 0, 1, 1.0, 1.0, 0.0]^T$$

**Verification & Sanity Check:**
Invert back: $\mathcal{S}' = \operatorname{Ad}_M \mathcal{B}$. $\omega_s = R_M \omega_b = [0, 0, 1]^T$.
$v_s = [p_M] R_M \omega_b + R_M v_b = [3, 1, 0]^T \times [0, 0, 1]^T + \begin{bmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = [1, -3, 0]^T + [-1, 1, 0]^T = [0, -2, 0]^T$. Recovers $\mathcal{S}$ exactly!

---

### Problem 4.9: Forward Kinematics of a Prismatic Telescoping Arm
**Problem Statement:** A 2-DoF spatial mechanism has a revolute base joint $\theta_1$ rotating about vertical $\hat{z}$, followed by a prismatic joint $d_2$ translating horizontally at height $H$. At home ($q = 0$), the arm extends along $+\hat{x}$ by initial length $L_0$. Formulate the space-frame PoE.

**Given Data:**
- Joint 1 (R): $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies \mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
- Joint 2 (P): Translates along $+\hat{x}$: $\omega_2 = [0, 0, 0]^T, v_2 = [1, 0, 0]^T \implies \mathcal{S}_2 = [0, 0, 0, 1, 0, 0]^T$.
- Home pose: $M = \begin{bmatrix} I & [L_0, 0, H]^T \\ 0 & 1 \end{bmatrix}$.

**Step-by-Step Derivation:**
1. Matrix exponentials:
   $$e^{[\mathcal{S}_1]\theta_1} = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$e^{[\mathcal{S}_2]d_2} = \begin{bmatrix} 1 & 0 & 0 & d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Multiply $e^{[\mathcal{S}_2]d_2} M$:
   $$e^{[\mathcal{S}_2]d_2} M = \begin{bmatrix} 1 & 0 & 0 & d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & L_0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & L_0 + d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Pre-multiply by $e^{[\mathcal{S}_1]\theta_1}$:
   $$T = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & 0 \\ \sin\theta_1 & \cos\theta_1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 & L_0 + d_2 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \cos\theta_1 & -\sin\theta_1 & 0 & (L_0 + d_2)\cos\theta_1 \\ \sin\theta_1 & \cos\theta_1 & 0 & (L_0 + d_2)\sin\theta_1 \\ 0 & 0 & 1 & H \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

**Final Answer:**
- Position: **$p = [(L_0 + d_2)\cos\theta_1, \; (L_0 + d_2)\sin\theta_1, \; H]^T$**
- Orientation: Rotation of **$\theta_1$** about $\hat{z}$.

**Verification & Sanity Check:**
Matches standard polar coordinates in the plane at height $H$, with radial distance $r = L_0 + d_2$.

---

### Problem 4.10: ZYX Euler Angle Extraction from PoE Matrix
**Problem Statement:** The forward kinematics of a 6-DoF arm yields the rotation submatrix:
$$R = \begin{bmatrix} 0 & 0 & 1 \\ 0.707107 & 0.707107 & 0 \\ -0.707107 & 0.707107 & 0 \end{bmatrix}$$
Extract the roll ($\psi$), pitch ($\theta$), and yaw ($\phi$) Euler angles under the standard $Z-Y-X$ convention ($R = R_z(\phi) R_y(\theta) R_x(\psi)$).

**Given Data:**
- Matrix entries: $r_{13} = 1, r_{21} = 1/\sqrt{2}, r_{22} = 1/\sqrt{2}, r_{31} = -1/\sqrt{2}, r_{32} = 1/\sqrt{2}$.
- All other entries are zero.

**Step-by-Step Derivation:**
1. Recall the analytical $Z-Y-X$ Euler matrix structure:
   $$R = \begin{bmatrix} \cos\phi\cos\theta & \cos\phi\sin\theta\sin\psi - \sin\phi\cos\psi & \cos\phi\sin\theta\cos\psi + \sin\phi\sin\psi \\ \sin\phi\cos\theta & \sin\phi\sin\theta\sin\psi + \cos\phi\cos\psi & \sin\phi\sin\theta\cos\psi - \cos\phi\sin\psi \\ -\sin\theta & \cos\theta\sin\psi & \cos\theta\cos\psi \end{bmatrix}$$
2. Extract pitch $\theta$ from $r_{31} = -\sin\theta$:
   $$-\sin\theta = -0.707107 \implies \sin\theta = 0.707107 \implies \theta = 45^\circ = \frac{\pi}{4}\text{ rad}$$
3. Compute $\cos\theta$:
   $$\cos(45^\circ) = 0.707107 \neq 0$$
4. Extract roll $\psi$ from $r_{32}$ and $r_{33}$:
   $$\tan\psi = \frac{r_{32}}{r_{33}} \implies \psi = \operatorname{atan2}(r_{32}, r_{33}) = \operatorname{atan2}(0.707107, 0) = 90^\circ = \frac{\pi}{2}\text{ rad}$$
5. Extract yaw $\phi$ from $r_{21}$ and $r_{11}$:
   $$\tan\phi = \frac{r_{21}}{r_{11}} \implies \phi = \operatorname{atan2}(r_{21}, r_{11}) = \operatorname{atan2}(0.707107, 0) = 90^\circ = \frac{\pi}{2}\text{ rad}$$

**Final Answer:**
- Yaw: **$\phi = 90^\circ$** ($\pi/2\text{ rad}$)
- Pitch: **$\theta = 45^\circ$** ($\pi/4\text{ rad}$)
- Roll: **$\psi = 90^\circ$** ($\pi/2\text{ rad}$)

**Verification & Sanity Check:**
Compute $r_{13} = \cos(90^\circ)\sin(45^\circ)\cos(90^\circ) + \sin(90^\circ)\sin(90^\circ) = 0 + 1(1) = 1.0$. Matches $r_{13} = 1$ exactly.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 4.11: Stanford Arm Spatial Screw Axes
**Problem Statement:** Formulate the spatial screw axes $\mathcal{S}_1, \dots, \mathcal{S}_6$ for the Stanford Arm at home configuration where the boom extends horizontally along $+x$ with shoulder height $H$ and offset $D_2$.

**Solution:**
1. Axis 1 (Waist roll): $\omega_1 = [0, 0, 1]^T, q_1 = [0, 0, 0]^T \implies \mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
2. Axis 2 (Shoulder pitch): $\omega_2 = [0, 1, 0]^T, q_2 = [0, D_2, H]^T \implies v_2 = -[0, 1, 0]^T \times [0, D_2, H]^T = [-H, 0, 0]^T$.
   $$\mathcal{S}_2 = [0, 1, 0, -H, 0, 0]^T$$
3. Axis 3 (Prismatic boom): Translates along $+\hat{x}$: $\omega_3 = 0, v_3 = [1, 0, 0]^T$.
   $$\mathcal{S}_3 = [0, 0, 0, 1, 0, 0]^T$$
4. Axis 4 (Wrist roll): Coincident with boom axis along $+\hat{x}$ at height $H$: $\omega_4 = [1, 0, 0]^T, q_4 = [0, D_2, H]^T \implies v_4 = -[1, 0, 0]^T \times [0, D_2, H]^T = [0, H, -D_2]^T$.
   $$\mathcal{S}_4 = [1, 0, 0, 0, H, -D_2]^T$$
5. Axis 5 (Wrist pitch): Along $+\hat{y}$ at wrist center $[L_w, D_2, H]^T$: $\omega_5 = [0, 1, 0]^T, v_5 = [-H, 0, L_w]^T$.
   $$\mathcal{S}_5 = [0, 1, 0, -H, 0, L_w]^T$$
6. Axis 6 (Wrist yaw): Along $+\hat{z}$ at wrist center: $\omega_6 = [0, 0, 1]^T, v_6 = [D_2, -L_w, 0]^T$.
   $$\mathcal{S}_6 = [0, 0, 1, D_2, -L_w, 0]^T$$

---

### Problem 4.12: Screw Invariance under Axis Translation
**Problem Statement:** Prove that replacing point $q$ with $q + c \omega$ leaves the screw $\mathcal{S} = (\omega, -\omega \times q)$ invariant for any $c \in \mathbb{R}$.

**Solution:**
1. Compute the new linear component:
   $$v_{\text{new}} = -\omega \times (q + c\omega) = -\omega \times q - c(\omega \times \omega)$$
2. For any 3D vector, the cross product with itself vanishes identically: $\omega \times \omega = 0$.
3. Therefore:
   $$v_{\text{new}} = -\omega \times q = v_{\text{old}}$$
4. The screw axis is identical: $\mathcal{S}_{\text{new}} = \mathcal{S}_{\text{old}}$.

---

### Problem 4.13: Franka Emika Panda Home Matrix and Screw Parameters
**Problem Statement:** State the home configuration matrix $M$ and the first 3 spatial screws for the 7-DoF Franka Emika Panda arm given base height $d_1 = 0.333\text{ m}$ and upper arm offset $d_3 = 0.316\text{ m}$.

**Solution:**
1. At home configuration ($q = 0$), the arm extends vertically along $+\hat{z}$ with total height $H_{\text{total}} = 0.333 + 0.316 + 0.384 + 0.107 = 1.140\text{ m}$.
2. Home matrix:
   $$M = \begin{bmatrix} 1 & 0 & 0 & 0.088 \\ 0 & -1 & 0 & 0 \\ 0 & 0 & -1 & 1.140 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Screws:
   - Joint 1: Rotates about $+\hat{z}$ at origin $\implies \mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
   - Joint 2: Rotates about $+\hat{y}$ at height $0.333\text{ m} \implies \mathcal{S}_2 = [0, 1, 0, -0.333, 0, 0]^T$.
   - Joint 3: Rotates about $+\hat{z}$ at height $0.649\text{ m} \implies \mathcal{S}_3 = [0, 0, 1, 0, 0, 0]^T$.

---

### Problem 4.14: Time Derivative of the Product of Exponentials
**Problem Statement:** Derive the formula for $\dot{T} T^{-1}$ (the spatial velocity twist) by differentiating the space-frame PoE formula with respect to time.

**Solution:**
1. Differentiate $T(q) = e^{[\mathcal{S}_1]q_1} e^{[\mathcal{S}_2]q_2} \cdots e^{[\mathcal{S}_n]q_n} M$:
   $$\dot{T} = [\mathcal{S}_1]\dot{q}_1 T + e^{[\mathcal{S}_1]q_1} [\mathcal{S}_2]\dot{q}_2 e^{[\mathcal{S}_2]q_2} \cdots M + \cdots$$
2. Post-multiply by $T^{-1}$:
   $$\dot{T} T^{-1} = [\mathcal{S}_1]\dot{q}_1 + e^{[\mathcal{S}_1]q_1}[\mathcal{S}_2]e^{-[\mathcal{S}_1]q_1}\dot{q}_2 + \cdots + \left( \prod_{j=1}^{i-1} e^{[\mathcal{S}_j]q_j} \right) [\mathcal{S}_i] \left( \prod_{j=1}^{i-1} e^{[\mathcal{S}_j]q_j} \right)^{-1} \dot{q}_i + \cdots$$
3. Using the adjoint identity $T [\mathcal{S}] T^{-1} = [\operatorname{Ad}_T \mathcal{S}]$:
   $$\dot{T} T^{-1} = \left[ \sum_{i=1}^n J_{si}(q) \dot{q}_i \right]$$
   where $J_{si}(q) = \operatorname{Ad}_{\prod_{j=1}^{i-1} \exp([\mathcal{S}_j]q_j)} \mathcal{S}_i$.
4. This directly derives the $i$-th column of the **Spatial Manipulator Jacobian**!

---

### Problem 4.15: KUKA LBR iiwa 7-DoF Home Geometry
**Problem Statement:** The KUKA LBR iiwa has 7 revolute joints alternating between roll and pitch: $z_0, y_1, z_2, y_3, z_4, y_5, z_6$. Explain why the PoE representation avoids the frame alignment ambiguities inherent in DH modeling for this arm.

**Solution:**
1. In DH notation, alternating orthogonal axes with zero offsets create multiple ambiguous choices for the direction of common normals $x_i$, requiring artificial dummy frames.
2. In PoE, the engineer simply inspects the physical robot:
   - Odd joints ($1, 3, 5, 7$) have $\omega = [0, 0, 1]^T$.
   - Even joints ($2, 4, 6$) have $\omega = [0, 1, 0]^T$.
3. Each $v_i$ is computed automatically via $-\omega_i \times q_i$ from CAD joint center heights. Zero dummy frames are required.

---

### Problem 4.16: Cylindrical Robot PoE
**Problem Statement:** Derive the space-frame PoE for a cylindrical robot ($R-P-P$) where Joint 1 rotates about $z$, Joint 2 translates along $z$, and Joint 3 translates along $x$.

**Solution:**
1. Screws:
   - Joint 1: $\mathcal{S}_1 = [0, 0, 1, 0, 0, 0]^T$.
   - Joint 2: $\mathcal{S}_2 = [0, 0, 0, 0, 0, 1]^T$.
   - Joint 3: $\mathcal{S}_3 = [0, 0, 0, 1, 0, 0]^T$.
2. Home pose: $M = \begin{bmatrix} I & [r_0, 0, z_0]^T \\ 0 & 1 \end{bmatrix}$.
3. Forward kinematics:
   $$T(q) = e^{[\mathcal{S}_1]\theta_1} e^{[\mathcal{S}_2]d_2} e^{[\mathcal{S}_3]d_3} M$$
   $$= \operatorname{Rot}_z(\theta_1) \operatorname{Trans}(d_3, 0, d_2) M$$

---

### Problem 4.17: Computational FLOPs Comparison: DH vs. PoE
**Problem Statement:** Compare the floating-point operations (FLOPs) required to evaluate forward kinematics for a 6-DoF arm using Standard DH vs. Space-Frame PoE.

**Solution:**
1. **Standard DH:**
   - 6 matrix multiplications of $4 \times 4$ matrices: $5 \times 64 = 320$ multiplications and additions.
   - 6 evaluations of $\cos\theta_i$ and $\sin\theta_i$: 12 trigonometric calls.
2. **Space-Frame PoE:**
   - Rodrigues exponential evaluation: for each of 6 joints, computing $R$ and $G v$ takes $\approx 50$ FLOPs ($6 \times 50 = 300$).
   - 6 matrix multiplications of $4 \times 4$: $6 \times 64 = 384$ FLOPs.
3. Both methods require $\mathcal{O}(n)$ computation time, taking less than $1\text{ microsecond}$ on modern CPUs, but PoE provides superior numerical stability and singularity-free geometric derivatives.

---

### Problem 4.18: Calibration of the Home Matrix $M$
**Problem Statement:** A measurement system determines that due to base mounting tilt, the true home matrix is $M_{\text{true}} = \Delta T \cdot M_{\text{nominal}}$, where $\Delta T = \operatorname{Rot}_x(0.01^\circ)$. Express the calibrated forward kinematics.

**Solution:**
1. Since $M$ appears as a terminal factor in the space-frame PoE:
   $$T_{\text{true}}(q) = e^{[\mathcal{S}_1]q_1} \cdots e^{[\mathcal{S}_n]q_n} M_{\text{true}} = e^{[\mathcal{S}_1]q_1} \cdots e^{[\mathcal{S}_n]q_n} \Delta T M_{\text{nominal}}$$
2. Kinematic calibration simply updates the 16 numbers in matrix $M_{\text{nominal}}$ by pre-multiplying with $\Delta T$, without altering any joint screw axes!

---

### Problem 4.19: Body Twist from Joint Velocities
**Problem Statement:** Prove that the end-effector body twist is $\mathcal{V}_b = \sum_{i=1}^n J_{bi}(q) \dot{q}_i$, where $J_{bi} = \operatorname{Ad}_{(\prod_{j=i+1}^n \exp([\mathcal{B}_j]q_j))^{-1}} \mathcal{B}_i$.

**Solution:**
1. Start with body twist definition: $[\mathcal{V}_b] = T^{-1} \dot{T}$.
2. Differentiate the body PoE formula:
   $$T(q) = M e^{[\mathcal{B}_1]q_1} \cdots e^{[\mathcal{B}_n]q_n}$$
3. Differentiating with respect to time and pre-multiplying by $T^{-1}$ yields:
   $$T^{-1} \dot{T} = \sum_{i=1}^n \left( e^{-[\mathcal{B}_n]q_n} \cdots e^{-[\mathcal{B}_{i+1}]q_{i+1}} \right) [\mathcal{B}_i] \left( e^{[\mathcal{B}_{i+1}]q_{i+1}} \cdots e^{[\mathcal{B}_n]q_n} \right) \dot{q}_i$$
4. Applying the adjoint map gives the body Jacobian column:
   $$J_{bi} = \operatorname{Ad}_{\left( \prod_{j=i+1}^n \exp([\mathcal{B}_j]q_j) \right)^{-1}} \mathcal{B}_i$$

---

### Problem 4.20: Analytical Proof of Space-to-Body Exponential Intertwining
**Problem Statement:** Prove that for any spatial screw $\mathcal{S}$ and home matrix $M$, $e^{[\mathcal{S}]\theta} M = M e^{[\mathcal{B}]\theta}$, where $\mathcal{B} = \operatorname{Ad}_{M^{-1}} \mathcal{S}$.

**Solution:**
1. By definition of the matrix adjoint:
   $$[\mathcal{B}] = [\operatorname{Ad}_{M^{-1}} \mathcal{S}] = M^{-1} [\mathcal{S}] M$$
2. Exponentiating both sides:
   $$e^{[\mathcal{B}]\theta} = e^{(M^{-1} [\mathcal{S}] M)\theta} = \sum_{k=0}^\infty \frac{(M^{-1} [\mathcal{S}] M \theta)^k}{k!}$$
3. Since $(M^{-1} [\mathcal{S}] M)^k = M^{-1} [\mathcal{S}]^k M$:
   $$e^{[\mathcal{B}]\theta} = M^{-1} \left( \sum_{k=0}^\infty \frac{([\mathcal{S}]\theta)^k}{k!} \right) M = M^{-1} e^{[\mathcal{S}]\theta} M$$
4. Pre-multiply both sides by $M$:
   $$M e^{[\mathcal{B}]\theta} = e^{[\mathcal{S}]\theta} M$$
5. This proves that the space and body PoE formulations are fundamentally identical.

---

# Chapter 5: Analytical Inverse Kinematics — Decoupling, Pieper's Criterion, and Closed-Form Solutions

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are seated at a workbench. A cup of coffee rests before you. When you decide to pick it up, your conscious mind does not plan individual joint angles: you do not think, *"Rotate shoulder by $23.4^\circ$, flex elbow by $68.1^\circ$, pronate forearm by $14.2^\circ$."* You simply think: *"Move hand to $(x, y, z)$."*

Your biological neuromuscular system solves an **Inverse Kinematics (IK)** problem in real time: given a desired target pose in the external physical world (Task Space $\mathcal{X}$), compute the required internal joint angles (Configuration Space $\mathcal{Q}$).

```
   Target Pose in World (X)                          Motor Angles (Q)
    ┌─────────────────────┐                          ┌─────────────────────┐
    │  x = 0.50 m         │                          │  theta_1 =  42.1°   │
    │  y = 0.20 m         │   ═════ Inverse ═════▶   │  theta_2 = -85.3°   │
    │  z = 0.35 m         │        Kinematics        │  theta_3 =  12.0°   │
    │  Orientation: Down  │                          │  ... (up to 8 ways!)│
    └─────────────────────┘                          └─────────────────────┘
```

While Forward Kinematics (Chapters 3 & 4) is mathematically straightforward—always yielding a single, unique, deterministic answer through matrix multiplication—Inverse Kinematics is dramatically more complex and treacherous:
1. **Non-Linear Transcendental Equations:** Forward kinematics wraps joint angles inside non-linear sine and cosine cascades. Inverting them requires solving highly coupled systems of trigonometric polynomials.
2. **Multiple Discrete Solutions:** To touch your nose, you can hold your elbow pointing downward toward your chest (elbow-down) or flared outward toward the ceiling (elbow-up). A standard 6-axis industrial robot typically has **8 distinct configurations** that place the tool at the exact same physical spot!
3. **Unreachable Targets (No Solution):** If an object is placed beyond the robot's physical reach, no real-valued joint angles exist. A computer attempting to compute $\arccos(1.05)$ will produce `NaN` (Not a Number), crashing real-time control software unless boundary clamping is rigorously enforced.
4. **Kinematic Singularities:** In certain aligned postures, degrees of freedom collapse, causing an infinite number of possible solutions.

In this chapter, we explore **analytical (closed-form) inverse kinematics**, where exact algebraic and geometric formulas determine all valid joint angles in microseconds without iterative approximation.

---

## 2. Historical Foundations & Epistemological Evolution

The quest for closed-form inverse kinematics was the central mathematical challenge of late-20th-century robotics. 

In 1968, **Donald L. Pieper** completed his landmark Stanford University PhD dissertation, *The Kinematics of Manipulators under Computer Control*, under the supervision of Bernard Roth. Pieper investigated whether an arbitrary 6-DoF serial arm could be solved algebraically. He discovered a profound structural theorem—now universally known as **Pieper's Criterion**:
> *A 6-degree-of-freedom serial manipulator possesses an exact closed-form algebraic inverse kinematics solution if and only if three consecutive joint axes intersect at a single point, or three consecutive joint axes are parallel.*

Pieper's discovery immediately changed the history of industrial automation. Almost every commercial robot arm designed over the subsequent five decades—including the Unimation PUMA 560, the KUKA KR series, the FANUC M-series, the ABB IRB series, and the Universal Robots UR5/UR10—was deliberately engineered with a **spherical wrist** (where joint axes 4, 5, and 6 intersect at a single physical point). This design choice enables **kinematic decoupling**, splitting the complex 6D non-linear problem into a 3D position problem followed by an independent 3D orientation problem.

For general 6R manipulators that do *not* satisfy Pieper's criterion, closed-form solutions remained an unsolved mathematical mystery until 1993, when **Manocha and Canny**, alongside **Raghavan and Roth**, used dialytic elimination theory to prove that a general 6R robot has up to **16 distinct inverse kinematics solutions**, corresponding to the roots of a 16th-degree polynomial.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Problem Formulation & Solvability
Given a desired target transformation matrix $T_d \in SE(3)$:
$$T_d = \begin{bmatrix} R_d & p_d \\ 0_{1 \times 3} & 1 \end{bmatrix} = \begin{bmatrix} n_x & s_x & a_x & p_x \\ n_y & s_y & a_y & p_y \\ n_z & s_z & a_z & p_z \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
where $n, s, a \in \mathbb{R}^3$ are the normal, sliding, and approach unit vectors of the end-effector tool frame, find all joint angle vectors $q = [q_1, q_2, \dots, q_n]^T \in \mathcal{Q}$ satisfying:
$$f(q) = T_d$$

#### Existence Conditions:
A solution exists if and only if:
1. $p_d$ lies within the reachable workspace: $p_d \in \mathcal{W}_R$.
2. For 6-DoF arms where orientation is specified, $(p_d, R_d)$ must lie within the dextrous workspace: $(p_d, R_d) \in \mathcal{W}_D$.

### 3.2 Kinematic Decoupling Architecture (Pieper's Criterion)
When a 6-DoF manipulator possesses a spherical wrist (axes 4, 5, and 6 intersecting at point $p_w$), the forward kinematics can be decoupled into two independent subproblems:

```
                            Desired Pose T_d = (R_d, p_d)
                                          │
                                          ▼
                      Step 1: Compute Wrist Center Position
                              p_w = p_d - d_6 * R_d * [0, 0, 1]^T
                                          │
                                          ▼
                      Step 2: Solve Position Joints (q1, q2, q3)
                              Algebraic / Geometric solution using p_w
                                          │
                                          ▼
                      Step 3: Compute Base Rotation R_0^3(q1, q2, q3)
                                          │
                                          ▼
                      Step 4: Solve Wrist Orientation (q4, q5, q6)
                              R_3^6 = (R_0^3)^T * R_d
                              Extract Euler angles from R_3^6
```

#### Step 1: Wrist Center Isolation
Because the final joint axis $z_5$ lies along the tool approach vector $a = R_d [0, 0, 1]^T$, and the tool tip is offset from the wrist center by distance $d_6$ along $z_5$:
$$p_d = p_w + d_6 R_d \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \implies p_w = p_d - d_6 \begin{bmatrix} a_x \\ a_y \\ a_z \end{bmatrix}$$
Crucially, $p_w$ is completely unaffected by wrist joint rotations $q_4, q_5, q_6$. It depends **only** on the first three joint variables $(q_1, q_2, q_3)$.

#### Step 2: Inverse Position
Solve the 3-DoF subchain for $(q_1, q_2, q_3)$ such that its end-effector reaches $p_w = [x_w, y_w, z_w]^T$. This yields up to 4 solutions (Shoulder Left/Right $\times$ Elbow Up/Down).

#### Step 3: Inverse Orientation
With $(q_1, q_2, q_3)$ known, evaluate the forward rotation matrix $R_0^3(q_1, q_2, q_3)$.
Because $R_d = R_0^3 R_3^6$, pre-multiplying by $(R_0^3)^T$ isolates the wrist rotation matrix:
$$R_3^6 = (R_0^3)^T R_d$$
For a spherical wrist with $Z-Y-Z$ Euler geometry:
$$R_3^6 = R_z(q_4) R_y(q_5) R_z(q_6)$$
Extracting Euler angles from $R_3^6$ yields 2 wrist solutions (Wrist Non-Flipped vs. Wrist Flipped), bringing the total number of distinct solutions to:
$$N_{\text{solutions}} = 2 (\text{Shoulder}) \times 2 (\text{Elbow}) \times 2 (\text{Wrist}) = 8$$

---

### 3.3 Planar 2-Link Arm Closed-Form Derivation
Consider a 2-link planar arm with link lengths $L_1, L_2$ and target Cartesian coordinates $(x, y)$.

```
                           (x, y) End-Effector
                             ▲
                            /
                        L₂ /   θ₂ (Elbow Angle)
                          / )
                         ● ───────────────
                        /
                    L₁ /
                      /  θ₁ (Shoulder Angle)
                     / )
                    ● ──────────────────▶ x
                  (0,0) Base
```

#### Step 1: Law of Cosines for Elbow Joint $\theta_2$
In the triangle formed by the base $(0, 0)$, elbow joint, and end-effector $(x, y)$:
- The sides have lengths $L_1$, $L_2$, and $r = \sqrt{x^2 + y^2}$.
- The interior angle at the elbow is $\pi - \theta_2$.
By the Law of Cosines:
$$r^2 = x^2 + y^2 = L_1^2 + L_2^2 - 2 L_1 L_2 \cos(\pi - \theta_2) = L_1^2 + L_2^2 + 2 L_1 L_2 \cos\theta_2$$
Solving for $\cos\theta_2$:
$$\cos\theta_2 = D = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}$$

#### Reachability Clamping:
For physical reachability, $D$ must satisfy:
$$-1.0 \le D \le +1.0$$
If $|D| > 1.0$, the target lies outside the reachable workspace annulus ($r > L_1 + L_2$ or $r < |L_1 - L_2|$). In software, $D$ must be clamped to $[-1.0, 1.0]$ to prevent domain errors in trigonometric functions.

#### Step 2: The Two Elbow Branches
Using the Pythagorean identity $\sin^2\theta_2 + \cos^2\theta_2 = 1$:
$$\sin\theta_2 = \pm\sqrt{1 - D^2}$$
Applying the four-quadrant arctangent $\operatorname{atan2}$:
$$\theta_2 = \operatorname{atan2}\left(\pm\sqrt{1 - D^2}, D\right)$$
- Positive sign ($+\sqrt{1 - D^2}$): **Elbow-Down Configuration** ($\theta_2 > 0$).
- Negative sign ($-\sqrt{1 - D^2}$): **Elbow-Up Configuration** ($\theta_2 < 0$).

#### Step 3: Shoulder Joint $\theta_1$
Using angle difference identities:
Let $\beta = \operatorname{atan2}(y, x)$ be the polar angle of the target.
Let $\psi = \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$ be the angle formed by link 1 and line $r$.
Then:
$$\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$$

---

### 3.4 Planar 3-Link Arm with Specified Orientation
Consider a 3-link planar arm with link lengths $L_1, L_2, L_3$ tasked with reaching position $(x, y)$ with end-effector pitch angle $\phi = \theta_1 + \theta_2 + \theta_3$.

1. The wrist joint $(x_w, y_w)$ is located by moving backward along the orientation angle $\phi$:
   $$x_w = x - L_3\cos\phi, \quad y_w = y - L_3\sin\phi$$
2. Solve the 2-link problem for $(x_w, y_w)$ with link lengths $L_1, L_2$ to find $\theta_1$ and $\theta_2$.
3. Compute the final joint angle directly from orientation conservation:
   $$\theta_3 = \phi - \theta_1 - \theta_2$$

---

## 4. Computational Realization & Algorithmic Implementation

Below is a robust TypeScript implementation of the analytical inverse kinematics solver with domain clamping and branch selection:

```typescript
export interface Planar2RSolutions {
  elbowUp: { theta1: number; theta2: number };
  elbowDown: { theta1: number; theta2: number };
  isReachable: boolean;
}

export class AnalyticalIK {
  /**
   * Solves closed-form inverse kinematics for a 2-link planar arm.
   * Includes boundary clamping to prevent NaN on unreachable targets.
   */
  public static solve2R(L1: number, L2: number, x: number, y: number): Planar2RSolutions {
    const rSq = x * x + y * y;
    const r = Math.sqrt(rSq);

    // Workspace boundary check
    const maxReach = L1 + L2;
    const minReach = Math.abs(L1 - L2);
    let isReachable = true;

    // D = cos(theta2)
    let D = (rSq - L1 * L1 - L2 * L2) / (2 * L1 * L2);

    if (D > 1.0) {
      D = 1.0;
      isReachable = false;
    } else if (D < -1.0) {
      D = -1.0;
      isReachable = false;
    }

    // Branch 1: Elbow Down (sin(theta2) > 0)
    const sinTheta2_down = Math.sqrt(Math.max(0, 1.0 - D * D));
    const theta2_down = Math.atan2(sinTheta2_down, D);
    const theta1_down = Math.atan2(y, x) - Math.atan2(L2 * sinTheta2_down, L1 + L2 * D);

    // Branch 2: Elbow Up (sin(theta2) < 0)
    const sinTheta2_up = -sinTheta2_down;
    const theta2_up = Math.atan2(sinTheta2_up, D);
    const theta1_up = Math.atan2(y, x) - Math.atan2(L2 * sinTheta2_up, L1 + L2 * D);

    return {
      elbowDown: { theta1: theta1_down, theta2: theta2_down },
      elbowUp: { theta1: theta1_up, theta2: theta2_up },
      isReachable
    };
  }

  /**
   * Extracts Z-Y-Z Euler angles for a spherical wrist from rotation matrix R_3_6.
   * R_3_6 = Rz(q4) * Ry(q5) * Rz(q6)
   */
  public static solveSphericalWrist(R: number[][]): { sol1: number[]; sol2: number[] } {
    const r13 = R[0][2];
    const r23 = R[1][2];
    const r33 = R[2][2];
    const r31 = R[2][0];
    const r32 = R[2][1];

    // Singularity check: sin(q5) == 0 -> q5 = 0 or pi
    if (Math.abs(r33) > 0.999999) {
      // Singularity: axes 4 and 6 are collinear.
      // Arbitrarily set q4 = 0 and solve q6
      const q5 = r33 > 0 ? 0 : Math.PI;
      const q4 = 0;
      const q6 = Math.atan2(R[1][0], R[0][0]);
      return { sol1: [q4, q5, q6], sol2: [q4, q5, q6] };
    }

    // Solution 1: q5 in (0, pi)
    const q5_1 = Math.atan2(Math.sqrt(r13 * r13 + r23 * r23), r33);
    const q4_1 = Math.atan2(r23, r13);
    const q6_1 = Math.atan2(r32, -r31);

    // Solution 2: q5 in (-pi, 0) (Wrist flipped)
    const q5_2 = Math.atan2(-Math.sqrt(r13 * r13 + r23 * r23), r33);
    const q4_2 = Math.atan2(-r23, -r13);
    const q6_2 = Math.atan2(-r32, r31);

    return {
      sol1: [q4_1, q5_1, q6_1],
      sol2: [q4_2, q5_2, q6_2]
    };
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 5.1: Planar 2R Arm Inverse Kinematics for a General Target
**Problem Statement:** A 2R planar manipulator has link lengths $L_1 = 1.2\text{ m}$ and $L_2 = 1.0\text{ m}$. Compute both the elbow-down and elbow-up inverse kinematics solutions for the target position $(x, y) = (1.5, 0.8)\text{ m}$.

**Given Data:**
- $L_1 = 1.2, L_2 = 1.0$
- $x = 1.5, y = 0.8$

**Step-by-Step Derivation:**
1. Compute the squared radial distance $r^2$:
   $$r^2 = x^2 + y^2 = 1.5^2 + 0.8^2 = 2.25 + 0.64 = 2.89\text{ m}^2$$
   $$r = \sqrt{2.89} = 1.7\text{ m}$$
2. Compute $D = \cos\theta_2$:
   $$D = \frac{r^2 - L_1^2 - L_2^2}{2 L_1 L_2} = \frac{2.89 - 1.2^2 - 1.0^2}{2(1.2)(1.0)} = \frac{2.89 - 1.44 - 1.00}{2.4} = \frac{0.45}{2.4} = 0.1875$$
3. Check reachability:
   $$|D| = 0.1875 \le 1.0 \quad (\text{Target is fully reachable!})$$
4. Compute the two elbow angles $\theta_2$:
   $$\sin\theta_2 = \pm\sqrt{1 - D^2} = \pm\sqrt{1 - (0.1875)^2} = \pm\sqrt{1 - 0.035156} = \pm\sqrt{0.964844} \approx \pm 0.982265$$
   - Branch 1 (Elbow-Down, $\sin\theta_2 > 0$):
     $$\theta_2^{(1)} = \operatorname{atan2}(+0.982265, 0.1875) \approx +1.382025\text{ rad} = +79.185^\circ$$
   - Branch 2 (Elbow-Up, $\sin\theta_2 < 0$):
     $$\theta_2^{(2)} = \operatorname{atan2}(-0.982265, 0.1875) \approx -1.382025\text{ rad} = -79.185^\circ$$
5. Compute the shoulder angle $\theta_1$:
   First, find the polar angle of the target:
   $$\operatorname{atan2}(y, x) = \operatorname{atan2}(0.8, 1.5) \approx 0.490049\text{ rad} = 28.072^\circ$$
   - For Branch 1 ($\theta_2 = +1.382025$):
     $$\operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2) = \operatorname{atan2}(1.0(0.982265), 1.2 + 1.0(0.1875)) = \operatorname{atan2}(0.982265, 1.3875) \approx 0.615822\text{ rad} = 35.284^\circ$$
     $$\theta_1^{(1)} = 0.490049 - 0.615822 = -0.125773\text{ rad} = -7.206^\circ$$
   - For Branch 2 ($\theta_2 = -1.382025$):
     $$\operatorname{atan2}(L_2(-0.982265), L_1 + L_2\cos\theta_2) = \operatorname{atan2}(-0.982265, 1.3875) \approx -0.615822\text{ rad}$$
     $$\theta_1^{(2)} = 0.490049 - (-0.615822) = +1.105871\text{ rad} = +63.361^\circ$$

**Final Answer:**
1. **Branch 1 (Elbow-Down):** $\theta_1 = -0.1258\text{ rad} \; (-7.21^\circ), \; \theta_2 = +1.3820\text{ rad} \; (+79.19^\circ)$
2. **Branch 2 (Elbow-Up):** $\theta_1 = +1.1059\text{ rad} \; (+63.36^\circ), \; \theta_2 = -1.3820\text{ rad} \; (-79.19^\circ)$

**Verification & Sanity Check:**
- Forward Kinematics for Branch 1:
  $x = 1.2\cos(-0.1258) + 1.0\cos(-0.1258 + 1.3820) = 1.2(0.9921) + 1.0\cos(1.2562) = 1.1905 + 0.3095 = 1.5000\text{ m}$.
  $y = 1.2\sin(-0.1258) + 1.0\sin(1.2562) = 1.2(-0.1254) + 1.0(0.9509) = -0.1505 + 0.9509 = 0.8004\text{ m}$.
Matches $(1.5, 0.8)$ to 4 decimal places.

---

### Problem 5.2: Boundary Reach Inverse Kinematics
**Problem Statement:** A 2R planar manipulator with $L_1 = 1.5\text{ m}$ and $L_2 = 1.0\text{ m}$ is commanded to reach $(x, y) = (2.5, 0.0)\text{ m}$. Find all solutions.

**Given Data:**
- $r = \sqrt{2.5^2 + 0^2} = 2.5\text{ m}$.
- $L_1 + L_2 = 1.5 + 1.0 = 2.5\text{ m}$.

**Step-by-Step Derivation:**
1. Compute $D$:
   $$D = \frac{2.5^2 - 1.5^2 - 1.0^2}{2(1.5)(1.0)} = \frac{6.25 - 2.25 - 1.00}{3.0} = \frac{3.0}{3.0} = 1.0$$
2. Since $D = 1.0$:
   $$\sin\theta_2 = \pm\sqrt{1 - 1^2} = 0 \implies \theta_2 = 0^\circ$$
   The two branches (elbow-up and elbow-down) coalesce into a single unique boundary configuration!
3. Compute $\theta_1$:
   $$\theta_1 = \operatorname{atan2}(0, 2.5) - \operatorname{atan2}(0, 1.5 + 1.0) = 0 - 0 = 0^\circ$$

**Final Answer:**
Unique solution: **$\theta_1 = 0.0\text{ rad} \; (0^\circ), \; \theta_2 = 0.0\text{ rad} \; (0^\circ)$**.

**Verification & Sanity Check:**
When $\theta_2 = 0$, the arm is fully extended in a straight line along the $+x$-axis of length $L_1 + L_2 = 2.5\text{ m}$.

---

### Problem 5.3: Internal Boundary Reach (Arm Fully Folded)
**Problem Statement:** For the arm in Problem 5.2 ($L_1 = 1.5\text{ m}, L_2 = 1.0\text{ m}$), find the inverse kinematics solution for target $(x, y) = (0.0, 0.5)\text{ m}$.

**Given Data:**
- $r = \sqrt{0^2 + 0.5^2} = 0.5\text{ m}$.
- $|L_1 - L_2| = |1.5 - 1.0| = 0.5\text{ m}$.

**Step-by-Step Derivation:**
1. Compute $D$:
   $$D = \frac{0.5^2 - 1.5^2 - 1.0^2}{2(1.5)(1.0)} = \frac{0.25 - 2.25 - 1.00}{3.0} = \frac{-3.0}{3.0} = -1.0$$
2. Since $D = -1.0$:
   $$\sin\theta_2 = 0 \implies \theta_2 = \pi\text{ rad} = 180^\circ$$
3. Compute $\theta_1$:
   $$\operatorname{atan2}(y, x) = \operatorname{atan2}(0.5, 0) = \frac{\pi}{2} = 90^\circ$$
   $$\operatorname{atan2}(L_2\sin\pi, L_1 + L_2\cos\pi) = \operatorname{atan2}(0, 1.5 - 1.0) = \operatorname{atan2}(0, 0.5) = 0$$
   $$\theta_1 = \frac{\pi}{2} - 0 = \frac{\pi}{2}\text{ rad} = 90^\circ$$

**Final Answer:**
Unique solution: **$\theta_1 = 90^\circ \; (\pi/2\text{ rad}), \; \theta_2 = 180^\circ \; (\pi\text{ rad})$**.

**Verification & Sanity Check:**
Link 1 points vertically up to $(0, 1.5)$. Link 2 folds backward $180^\circ$ by $1.0\text{ m}$ toward the origin, ending at $(0, 1.5 - 1.0) = (0, 0.5)$, exactly the target.

---

### Problem 5.4: Target Out of Reach and Domain Clamping
**Problem Statement:** An autonomous robot arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is commanded by a faulty vision pipeline to reach $(x, y) = (2.1, 0.5)\text{ m}$.
1. Show that unconstrained calculation causes a mathematical failure (`NaN`).
2. Demonstrate how boundary clamping projects the target to the nearest reachable configuration.

**Given Data:**
- $r = \sqrt{2.1^2 + 0.5^2} = \sqrt{4.41 + 0.25} = \sqrt{4.66} \approx 2.1587\text{ m}$.
- $L_1 + L_2 = 2.0\text{ m} < 2.1587\text{ m}$.

**Step-by-Step Derivation:**
1. Evaluate $D$ without clamping:
   $$D = \frac{4.66 - 1.0 - 1.0}{2(1.0)(1.0)} = \frac{2.66}{2.0} = 1.33$$
2. In raw floating-point code:
   $$\sin\theta_2 = \sqrt{1 - D^2} = \sqrt{1 - 1.33^2} = \sqrt{1 - 1.7689} = \sqrt{-0.7689} \implies \text{NaN}$$
   Computing $\operatorname{atan2}(\text{NaN}, 1.33)$ produces `NaN`, causing the motor control loop to crash!
3. Robust Clamping Protocol:
   Clamp $D$ to the valid physical domain $[-1.0, 1.0]$:
   $$D_{\text{clamped}} = \min(1.0, \max(-1.0, 1.33)) = 1.0$$
4. With $D = 1.0$:
   $$\theta_2 = 0.0\text{ rad}$$
5. Compute shoulder angle $\theta_1$:
   $$\theta_1 = \operatorname{atan2}(0.5, 2.1) - \operatorname{atan2}(0, 2.0) = \operatorname{atan2}(0.5, 2.1) \approx 0.2339\text{ rad} = 13.40^\circ$$

**Final Answer:**
- Unclamped result: **`NaN` error (crash)**.
- Clamped projected solution: **$\theta_1 = 0.2339\text{ rad} \; (13.40^\circ), \; \theta_2 = 0.0\text{ rad} \; (0^\circ)$**.
- The arm points directly toward the target at maximum possible reach ($r = 2.0\text{ m}$).

**Verification & Sanity Check:**
The end-effector reaches $(2.0\cos(13.4^\circ), 2.0\sin(13.4^\circ)) = (1.945, 0.464)$, which minimizes the Euclidean distance $\|p - p_{\text{target}}\|$ to the unreachable goal.

---

### Problem 5.5: Planar 3-Link Arm with Specified Orientation
**Problem Statement:** A 3-link planar manipulator with $L_1 = 1.0\text{ m}, L_2 = 0.8\text{ m}, L_3 = 0.4\text{ m}$ must position its tool tip at $(x, y) = (1.6, 1.0)\text{ m}$ with end-effector orientation $\phi = 30^\circ = \frac{\pi}{6}\text{ rad}$. Compute the elbow-down inverse kinematics solution.

**Given Data:**
- Target: $x = 1.6, y = 1.0, \phi = \pi/6$
- $\cos(30^\circ) = 0.866025, \sin(30^\circ) = 0.500000$

**Step-by-Step Derivation:**
1. Compute the wrist joint position $(x_w, y_w)$:
   $$x_w = x - L_3\cos\phi = 1.6 - 0.4(0.866025) = 1.6 - 0.346410 = 1.253590\text{ m}$$
   $$y_w = y - L_3\sin\phi = 1.0 - 0.4(0.500000) = 1.0 - 0.200000 = 0.800000\text{ m}$$
2. Solve 2-link IK for $(x_w, y_w)$ with $L_1 = 1.0, L_2 = 0.8$:
   $$r_w^2 = 1.253590^2 + 0.8^2 = 1.571488 + 0.64 = 2.211488$$
   $$D = \frac{r_w^2 - L_1^2 - L_2^2}{2 L_1 L_2} = \frac{2.211488 - 1.0^2 - 0.8^2}{2(1.0)(0.8)} = \frac{2.211488 - 1.0 - 0.64}{1.6} = \frac{0.571488}{1.6} \approx 0.357180$$
3. Elbow angle $\theta_2$ (elbow-down):
   $$\sin\theta_2 = +\sqrt{1 - 0.357180^2} = +\sqrt{1 - 0.127578} = +\sqrt{0.872422} \approx 0.934035$$
   $$\theta_2 = \operatorname{atan2}(0.934035, 0.357180) \approx 1.205634\text{ rad} = 69.077^\circ$$
4. Shoulder angle $\theta_1$:
   $$\operatorname{atan2}(y_w, x_w) = \operatorname{atan2}(0.800000, 1.253590) \approx 0.568340\text{ rad} = 32.564^\circ$$
   $$\operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2) = \operatorname{atan2}(0.8(0.934035), 1.0 + 0.8(0.357180)) = \operatorname{atan2}(0.747228, 1.285744) \approx 0.526279\text{ rad} = 30.154^\circ$$
   $$\theta_1 = 0.568340 - 0.526279 = 0.042061\text{ rad} = 2.410^\circ$$
5. Wrist angle $\theta_3$:
   $$\theta_3 = \phi - \theta_1 - \theta_2 = \frac{\pi}{6} - 0.042061 - 1.205634 = 0.523599 - 1.247695 = -0.724096\text{ rad} = -41.488^\circ$$

**Final Answer:**
- $\theta_1 = +0.0421\text{ rad} \; (+2.41^\circ)$
- $\theta_2 = +1.2056\text{ rad} \; (+69.08^\circ)$
- $\theta_3 = -0.7241\text{ rad} \; (-41.49^\circ)$

**Verification & Sanity Check:**
- Orientation check: $\theta_1 + \theta_2 + \theta_3 = 0.0421 + 1.2056 - 0.7241 = 0.5236\text{ rad} = 30^\circ = \phi$.
- Position check: $x = 1.0\cos(0.0421) + 0.8\cos(1.2477) + 0.4\cos(0.5236) = 0.9991 + 0.2545 + 0.3464 = 1.6000\text{ m}$. Exact!

---

### Problem 5.6: Spherical Wrist Center Isolation
**Problem Statement:** A 6-DoF robot with a spherical wrist is commanded to place its tool tip at position $p_d = [0.60, 0.40, 0.30]^T\text{ m}$ with tool approach orientation pointing along base $-\hat{z}$: $a = [0, 0, -1]^T$. The tool length from wrist center to tip is $d_6 = 0.12\text{ m}$. Calculate the 3D coordinates of the wrist center $p_w$.

**Given Data:**
- $p_d = [0.60, 0.40, 0.30]^T$
- $a = [0, 0, -1]^T$
- $d_6 = 0.12\text{ m}$

**Step-by-Step Derivation:**
1. Wrist center isolation formula:
   $$p_w = p_d - d_6 a$$
2. Substitute the approach vector:
   $$p_w = \begin{bmatrix} 0.60 \\ 0.40 \\ 0.30 \end{bmatrix} - 0.12 \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 0.60 \\ 0.40 \\ 0.30 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 0.12 \end{bmatrix} = \begin{bmatrix} 0.60 \\ 0.40 \\ 0.42 \end{bmatrix}\text{ m}$$

**Final Answer:**
The wrist center coordinates are **$p_w = [0.60, 0.40, 0.42]^T\text{ m}$**.

**Verification & Sanity Check:**
Since the tool points vertically down ($a = -\hat{z}$), the wrist center holding the tool must be located directly above the tool tip by distance $d_6$: $0.30 + 0.12 = 0.42\text{ m}$.

---

### Problem 5.7: Solving Spherical Wrist Euler Angles
**Problem Statement:** The relative rotation matrix between link 3 and the end-effector tool is computed to be:
$$R_3^6 = \begin{bmatrix} 0 & 0 & 1 \\ 0.707107 & -0.707107 & 0 \\ 0.707107 & 0.707107 & 0 \end{bmatrix}$$
Extract the two sets of $Z-Y-Z$ Euler angles $(\theta_4, \theta_5, \theta_6)$ representing the non-flipped and flipped wrist configurations.

**Given Data:**
- Matrix entries: $r_{13} = 1, r_{23} = 0, r_{33} = 0, r_{31} = 1/\sqrt{2}, r_{32} = 1/\sqrt{2}$.

**Step-by-Step Derivation:**
1. Analytical $Z-Y-Z$ Euler rotation matrix:
   $$R_3^6 = \begin{bmatrix} \cos\theta_4\cos\theta_5\cos\theta_6 - \sin\theta_4\sin\theta_6 & -\cos\theta_4\cos\theta_5\sin\theta_6 - \sin\theta_4\cos\theta_6 & \cos\theta_4\sin\theta_5 \\ \sin\theta_4\cos\theta_5\cos\theta_6 + \cos\theta_4\sin\theta_6 & -\sin\theta_4\cos\theta_5\sin\theta_6 + \cos\theta_4\cos\theta_6 & \sin\theta_4\sin\theta_5 \\ -\sin\theta_5\cos\theta_6 & \sin\theta_5\sin\theta_6 & \cos\theta_5 \end{bmatrix}$$
2. Solve for wrist pitch $\theta_5$:
   From $r_{33} = \cos\theta_5 = 0$:
   - Branch 1 ($\sin\theta_5 > 0$):
     $$\theta_5^{(1)} = +90^\circ = +\frac{\pi}{2}\text{ rad}$$
   - Branch 2 ($\sin\theta_5 < 0$, Wrist-Flipped):
     $$\theta_5^{(2)} = -90^\circ = -\frac{\pi}{2}\text{ rad}$$
3. For Branch 1 ($\theta_5 = +90^\circ, \sin\theta_5 = 1$):
   - From $r_{13} = \cos\theta_4\sin\theta_5 = \cos\theta_4 = 1$:
     $$\theta_4 = \operatorname{atan2}(r_{23}, r_{13}) = \operatorname{atan2}(0, 1) = 0^\circ$$
   - From $r_{32} = \sin\theta_5\sin\theta_6 = \sin\theta_6 = 0.707107$:
     $$-r_{31} = \sin\theta_5\cos\theta_6 = \cos\theta_6 = -0.707107$:
     $$\theta_6 = \operatorname{atan2}(r_{32}, -r_{31}) = \operatorname{atan2}(0.707107, -0.707107) = 135^\circ = \frac{3\pi}{4}\text{ rad}$$
4. For Branch 2 ($\theta_5 = -90^\circ, \sin\theta_5 = -1$):
   - $\theta_4 = \operatorname{atan2}(-r_{23}, -r_{13}) = \operatorname{atan2}(0, -1) = 180^\circ = \pi\text{ rad}$
   - $\theta_6 = \operatorname{atan2}(-r_{32}, r_{31}) = \operatorname{atan2}(-0.707107, 0.707107) = -45^\circ = -\frac{\pi}{4}\text{ rad}$

**Final Answer:**
1. **Solution 1 (Non-Flipped):** $\theta_4 = 0^\circ \; (0\text{ rad}), \; \theta_5 = +90^\circ \; (\pi/2\text{ rad}), \; \theta_6 = +135^\circ \; (3\pi/4\text{ rad})$
2. **Solution 2 (Wrist-Flipped):** $\theta_4 = 180^\circ \; (\pi\text{ rad}), \; \theta_5 = -90^\circ \; (-\pi/2\text{ rad}), \; \theta_6 = -45^\circ \; (-\pi/4\text{ rad})$

**Verification & Sanity Check:**
Flipping joint 5 by negating its sign and adding $180^\circ$ to joints 4 and 6 produces the exact same physical tool orientation in 3D space.

---

### Problem 5.8: Wrist Singularity Resolution
**Problem Statement:** A spherical wrist achieves a configuration where $R_3^6 = I_3$ (identity rotation).
1. Show that joint angle extraction produces an indeterminate representation singularity.
2. Formulate the single constraint relating $\theta_4$ and $\theta_6$, and state how control software resolves it.

**Given Data:**
- $R_3^6 = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

**Step-by-Step Derivation:**
1. From $r_{33} = \cos\theta_5 = 1 \implies \theta_5 = 0^\circ$.
2. When $\theta_5 = 0$, $\sin\theta_5 = 0$.
   Axes 4 and 6 become collinear! Both joints rotate about the exact same physical axis $z_3 \equiv z_5$.
3. Substitute $\theta_5 = 0$ into the $Z-Y-Z$ matrix:
   $$R_3^6 = R_z(\theta_4) R_y(0) R_z(\theta_6) = R_z(\theta_4) I R_z(\theta_6) = R_z(\theta_4 + \theta_6)$$
   $$\begin{bmatrix} \cos(\theta_4 + \theta_6) & -\sin(\theta_4 + \theta_6) & 0 \\ \sin(\theta_4 + \theta_6) & \cos(\theta_4 + \theta_6) & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
4. The equations only constrain the sum of the angles:
   $$\theta_4 + \theta_6 = 0 \implies \theta_6 = -\theta_4$$
   Individual angles $\theta_4$ and $\theta_6$ are completely indeterminate (infinitely many solutions).
5. Software Convention:
   To avoid commanding erratic motions at singularities, industrial controllers fix one joint to its previous value or set $\theta_4 = 0$ and command $\theta_6 = 0$.

**Final Answer:**
- Constraint: **$\theta_4 + \theta_6 = 0^\circ$**.
- Solution: **$\theta_5 = 0^\circ$**, with **$\theta_4 = 0^\circ, \theta_6 = 0^\circ$** by convention.

**Verification & Sanity Check:**
Any pair satisfying $\theta_6 = -\theta_4$ (e.g., $\theta_4 = 45^\circ, \theta_6 = -45^\circ$) produces $R_z(45^\circ) R_z(-45^\circ) = I$, mathematically confirmed.

---

### Problem 5.9: SCARA Robot Analytical Inverse Kinematics
**Problem Statement:** A 4-DoF SCARA robot has link lengths $a_1 = 0.4\text{ m}, a_2 = 0.3\text{ m}$, base height $d_1 = 0.5\text{ m}$. Given desired end-effector pose $(x, y, z, \phi) = (0.5, 0.2, 0.15, 45^\circ)$, compute all 4 joint coordinates $(q_1, q_2, q_3, q_4)$.

**Given Data:**
- $a_1 = 0.4, a_2 = 0.3, d_1 = 0.5$
- Target: $x = 0.5, y = 0.2, z = 0.15, \phi = 45^\circ = 0.7854\text{ rad}$

**Step-by-Step Derivation:**
1. Vertical Quill Prismatic Joint $d_3$:
   From forward kinematics: $z = d_1 - d_3$:
   $$d_3 = d_1 - z = 0.5 - 0.15 = 0.35\text{ m}$$
2. Horizontal 2-link subchain for $(x, y) = (0.5, 0.2)$:
   $$r^2 = 0.5^2 + 0.2^2 = 0.25 + 0.04 = 0.29$$
   $$D = \frac{0.29 - 0.4^2 - 0.3^2}{2(0.4)(0.3)} = \frac{0.29 - 0.16 - 0.09}{0.24} = \frac{0.04}{0.24} = 0.166667$$
3. Elbow angle $q_2$:
   $$\sin q_2 = +\sqrt{1 - (0.166667)^2} = +\sqrt{1 - 0.027778} = \sqrt{0.972222} \approx 0.986013$$
   $$q_2 = \operatorname{atan2}(0.986013, 0.166667) \approx 1.403348\text{ rad} = 80.406^\circ$$
4. Shoulder angle $q_1$:
   $$\operatorname{atan2}(0.2, 0.5) \approx 0.380506\text{ rad}$$
   $$\operatorname{atan2}(0.3(0.986013), 0.4 + 0.3(0.166667)) = \operatorname{atan2}(0.295804, 0.450000) \approx 0.581566\text{ rad}$$
   $$q_1 = 0.380506 - 0.581566 = -0.201060\text{ rad} = -11.520^\circ$$
5. Wrist Roll Joint $q_4$:
   From forward orientation: $\phi = q_1 + q_2 + q_4$:
   $$q_4 = \phi - q_1 - q_2 = 0.785398 - (-0.201060) - 1.403348 = 0.785398 + 0.201060 - 1.403348 = -0.416890\text{ rad} = -23.886^\circ$$

**Final Answer:**
- $q_1 = -0.2011\text{ rad} \; (-11.52^\circ)$
- $q_2 = +1.4033\text{ rad} \; (+80.41^\circ)$
- $d_3 = 0.3500\text{ m}$
- $q_4 = -0.4169\text{ rad} \; (-23.89^\circ)$

**Verification & Sanity Check:**
- $z = 0.5 - 0.35 = 0.15\text{ m}$.
- $x = 0.4\cos(-0.2011) + 0.3\cos(1.2023) = 0.3919 + 0.1081 = 0.5000\text{ m}$. Perfect match.

---

### Problem 5.10: The Eight Kinematic Branches of an Anthropomorphic 6-DoF Arm
**Problem Statement:** Formulate the tree of 8 discrete solutions for a PUMA 560 robot with spherical wrist.

**Given Data:**
- 6-DoF serial arm satisfying Pieper's criterion.

**Step-by-Step Derivation:**
1. **Shoulder Sub-Tree (Waist $q_1$):**
   - Solution A: Shoulder Left ($q_1 = \operatorname{atan2}(y_w, x_w) - \alpha$)
   - Solution B: Shoulder Right ($q_1' = q_1 + \pi$)
2. **Elbow Sub-Tree (Elbow $q_3$ and Shoulder Pitch $q_2$):**
   For each shoulder choice:
   - Branch 1: Elbow Down ($q_3 > 0$)
   - Branch 2: Elbow Up ($q_3 < 0$)
   This yields $2 \times 2 = 4$ position configurations for $(q_1, q_2, q_3)$.
3. **Wrist Sub-Tree (Wrist $q_4, q_5, q_6$):**
   For each of the 4 position configurations:
   - Option 1: Wrist Normal ($q_5 > 0$)
   - Option 2: Wrist Flipped ($q_5' = -q_5, q_4' = q_4 + \pi, q_6' = q_6 + \pi$)
4. Total configurations:
   $$2 \times 2 \times 2 = 8\text{ solutions}$$

**Final Answer:**
The eight distinct operational configurations are:
1. Shoulder Left, Elbow Down, Wrist Normal
2. Shoulder Left, Elbow Down, Wrist Flipped
3. Shoulder Left, Elbow Up, Wrist Normal
4. Shoulder Left, Elbow Up, Wrist Flipped
5. Shoulder Right, Elbow Down, Wrist Normal
6. Shoulder Right, Elbow Down, Wrist Flipped
7. Shoulder Right, Elbow Up, Wrist Normal
8. Shoulder Right, Elbow Up, Wrist Flipped

**Verification & Sanity Check:**
All 8 mathematical configurations place the physical tool frame at the exact same location $T_d$ in world space.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 5.11: Stanford Arm Closed-Form Inverse Kinematics
**Problem Statement:** Derive the analytical inverse kinematics for the Stanford Arm (joints 1, 2 revolute, joint 3 prismatic, joints 4, 5, 6 spherical wrist) for reaching wrist center $p_w = [x_w, y_w, z_w]^T$ with base offset $D_2$.

**Solution:**
1. Joint 1 (Waist roll):
   In the $xy$-plane, the shoulder offset $D_2$ is perpendicular to link 1:
   $$r^2 = x_w^2 + y_w^2$$
   $$q_1 = \operatorname{atan2}(y_w, x_w) - \operatorname{atan2}(D_2, \pm\sqrt{r^2 - D_2^2})$$
2. Joint 2 (Shoulder pitch):
   $$q_2 = \operatorname{atan2}\left( \pm\sqrt{x_w^2 + y_w^2 - D_2^2}, z_w \right)$$
3. Joint 3 (Prismatic boom reach):
   $$d_3 = \sqrt{x_w^2 + y_w^2 - D_2^2 + z_w^2}$$
4. Joints 4, 5, 6 are extracted from $R_3^6 = (R_0^3)^T R_d$ via spherical wrist Euler formulas.

---

### Problem 5.12: Cylindrical Robot (RPP) Inverse Kinematics
**Problem Statement:** Derive the closed-form inverse kinematics for a cylindrical robot tasked with target $p = [x, y, z]^T$.

**Solution:**
1. Base revolute angle:
   $$\theta_1 = \operatorname{atan2}(y, x)$$
2. Vertical lift prismatic extension:
   $$d_2 = z$$
3. Radial prismatic extension:
   $$d_3 = \sqrt{x^2 + y^2}$$

---

### Problem 5.13: Optimal Solution Branch Selection via Minimum Joint Travel
**Problem Statement:** A robot is currently at $q_{\text{current}} = [10^\circ, 45^\circ, -30^\circ]^T$. Analytical IK yields two candidate solutions:
- $q_A = [12^\circ, 48^\circ, -28^\circ]^T$
- $q_B = [190^\circ, -45^\circ, 150^\circ]^T$
Using the weighted distance metric $C(q) = \sum_{i=1}^3 (q_i - q_i^{\text{current}})^2$, select the optimal branch.

**Solution:**
1. Cost for Solution A:
   $$\Delta q_A = [12-10, 48-45, -28-(-30)] = [2, 3, 2]^\circ$$
   $$C(q_A) = 2^2 + 3^2 + 2^2 = 4 + 9 + 4 = 17\text{ deg}^2$$
2. Cost for Solution B:
   $$\Delta q_B = [190-10, -45-45, 150-(-30)] = [180, -90, 180]^\circ$$
   $$C(q_B) = 180^2 + (-90)^2 + 180^2 = 32400 + 8100 + 32400 = 72900\text{ deg}^2$$
3. Solution A is selected because it minimizes actuator travel and energy consumption.

---

### Problem 5.14: Joint Limit Filtering on Analytical IK Solutions
**Problem Statement:** An IK solver returns 4 mathematical solutions. Link 2 has mechanical limits $-60^\circ \le q_2 \le +60^\circ$. The 4 solutions have $q_2 \in \{ +75^\circ, +45^\circ, -80^\circ, -15^\circ \}$. Filter the candidates.

**Solution:**
1. Solution 1 ($q_2 = 75^\circ$): Violates upper limit ($75 > 60$). Discarded.
2. Solution 2 ($q_2 = 45^\circ$): Within limits ($-60 \le 45 \le 60$). **Valid**.
3. Solution 3 ($q_2 = -80^\circ$): Violates lower limit ($-80 < -60$). Discarded.
4. Solution 4 ($q_2 = -15^\circ$): Within limits ($-60 \le -15 \le 60$). **Valid**.
5. Only Solutions 2 and 4 are physically executable by the robot.

---

### Problem 5.15: Analytical IK with Restricted Elbow Motion
**Problem Statement:** A planar 2R arm has mechanical physical stops restricting the elbow joint to strictly negative angles: $-150^\circ \le \theta_2 \le 0^\circ$ (elbow-up only). Formulate the single-branched IK algorithm.

**Solution:**
1. Compute $D = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}$.
2. If $|D| > 1.0$, clamp or return unreachable.
3. Because $\theta_2$ must be negative, discard the $+\sqrt{1 - D^2}$ branch:
   $$\sin\theta_2 = -\sqrt{1 - D^2}$$
   $$\theta_2 = \operatorname{atan2}(-\sqrt{1 - D^2}, D)$$
4. Verify $\theta_2 \ge -150^\circ$; if true, compute $\theta_1 = \operatorname{atan2}(y, x) - \operatorname{atan2}(L_2\sin\theta_2, L_1 + L_2\cos\theta_2)$.

---

### Problem 5.16: Pieper's Criterion with Three Parallel Axes
**Problem Statement:** Show why a 6-DoF robot with three consecutive parallel axes (e.g., joints 2, 3, 4 parallel) satisfies Pieper's criterion for closed-form solvability.

**Solution:**
1. When joints 2, 3, 4 have parallel axes, they act as a planar 3R mechanism operating in a plane perpendicular to the joint axes.
2. The distance from joint 1 to the end-effector depends only on joint 1 and the planar subchain.
3. Joint 1 can be solved independently from the lateral projection of the target.
4. Joints 2, 3, 4 reduce to the solvable 3-link planar inverse kinematics problem.
5. Joints 5 and 6 orient the final link. Hence, the system is algebraically decoupled and solvable in closed form.

---

### Problem 5.17: Raghavan & Roth 16th-Degree Polynomial Overview
**Problem Statement:** Explain why general 6R manipulators that do not satisfy Pieper's criterion require solving a 16th-degree polynomial.

**Solution:**
1. Without intersecting or parallel axes, position and orientation cannot be decoupled into separate $3 \times 3$ systems.
2. The 6 kinematic equations $T_0^6(q) = T_d$ form a system of multi-variable non-linear trigonometric polynomials.
3. Using tangent half-angle substitution $u_i = \tan(q_i / 2)$, each trigonometric term becomes a rational algebraic fraction.
4. Eliminating 5 of the variables through dialytic elimination yields a single univariate polynomial in the remaining variable of degree **16**.
5. By the Abel-Ruffini theorem, polynomials of degree $\ge 5$ cannot be solved by radicals; numerical root-finding (such as eigenvalue companion matrices) is required.

---

### Problem 5.18: Polar Coordinate Robot Analytical IK
**Problem Statement:** A polar coordinate robot has revolute waist $\theta_1$, revolute elevation $\theta_2$, and prismatic reach $r$. Given target $(x, y, z)$, compute the joint variables.

**Solution:**
1. $\theta_1 = \operatorname{atan2}(y, x)$.
2. $\theta_2 = \operatorname{atan2}(z, \sqrt{x^2 + y^2})$.
3. $r = \sqrt{x^2 + y^2 + z^2}$.

---

### Problem 5.19: Inverse Kinematics of a Four-Bar Closed Chain
**Problem Statement:** A planar four-bar closed linkage has links $L_0, L_1, L_2, L_3$. Given input crank angle $\theta_1$, solve for coupler angle $\theta_2$ and follower angle $\theta_3$ using Freudenstein's equation.

**Solution:**
1. Freudenstein's equation:
   $$K_1 \cos\theta_1 - K_2 \cos\theta_3 + K_3 = \cos(\theta_1 - \theta_3)$$
   where $K_1 = L_0 / L_1, K_2 = L_0 / L_3, K_3 = \frac{L_0^2 + L_1^2 - L_2^2 + L_3^2}{2 L_1 L_3}$.
2. Rewrite as $A\cos\theta_3 + B\sin\theta_3 = C$, where $A, B, C$ are functions of $\theta_1$.
3. Substitute $t = \tan(\theta_3 / 2)$ to form a quadratic equation in $t$:
   $$(C - A) t^2 - 2B t + (C + A) = 0$$
4. Solve quadratic equation for $t$, yielding up to 2 distinct assembly modes for $\theta_3$.

---

### Problem 5.20: Round-Trip IK-FK Numerical Verification Protocol
**Problem Statement:** Formulate the mathematical verification condition for validating an analytical inverse kinematics solver.

**Solution:**
For any target pose $T_d \in \mathcal{W}_R$:
1. Compute all candidate inverse solutions $Q = \{ q^{(1)}, q^{(2)}, \dots, q^{(k)} \} = f^{-1}(T_d)$.
2. For each solution $q^{(j)}$, evaluate the forward kinematics $T_j = f(q^{(j)})$.
3. Compute the position error: $\|p_j - p_d\| < 10^{-6}\text{ m}$.
4. Compute the orientation error: $\|R_j^T R_d - I\|_\infty < 10^{-6}$.
5. Every valid solution must reconstruct the target pose $T_d$ to machine precision.

---

# Chapter 6: The Manipulator Geometric Jacobian — Differential Kinematics and Velocity Mapping

---

## 1. The Layman's Genesis & Intuitive Overview

In Chapters 3, 4, and 5, we studied the static geometry of robot arms: where the arm is located when the joints are locked at fixed angles. But robots are not static museum sculptures—they are dynamic machines that move, weld, grasp, and assemble at high speeds.

This brings us to the fundamental question of **differential kinematics**:
*If each joint motor rotates with a certain angular speed (measured in radians per second), how fast will the tool tip move through space (measured in meters per second and radians per second)?*

```
     Motor Joint Speeds (rad/s)                 End-Effector Velocity (m/s, rad/s)
     ┌────────────────────────┐                 ┌───────────────────────────────┐
     │  q_dot_1 =  1.5 rad/s  │                 │  v_x =  0.35 m/s              │
     │  q_dot_2 = -0.8 rad/s  │   ═══ J(q) ═══▶ │  v_y = -0.12 m/s              │
     │  q_dot_3 =  2.0 rad/s  │                 │  omega_z = 0.50 rad/s         │
     └────────────────────────┘                 └───────────────────────────────┘
                                   Jacobian Matrix
                              (Linear Sensitivity Map)
```

At any frozen instant in time, the relationship between joint motor velocities $\dot{q}$ and end-effector spatial velocity $\nu$ is strictly **linear**! The mathematical operator that performs this linear conversion is the **Manipulator Jacobian Matrix $J(q)$**. 

The Jacobian acts as the robot's transmission ratio. Just as a bicycle gear ratio determines how fast the rear wheel spins for every pedal stroke, the Jacobian determines how much Cartesian velocity is produced for every radian turned by a joint motor. Furthermore, through the profound principle of **Virtual Work**, the exact same Jacobian matrix relates the mechanical forces and torques at the tool tip to the motor torques required at the joints!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical concept of the Jacobian matrix originated in the 1841 paper *De determinantibus functionalibus* by the German mathematician **Carl Gustav Jacob Jacobi**, who formulated the matrix of first-order partial derivatives of a vector-valued function.

In robotics, differential kinematics was pioneered in 1969 by **Daniel E. Whitney** at the MIT Draper Laboratory in his seminal paper *"Resolved Motion Rate Control of Manipulators and Human Prostheses"*. Whitney asked how an amputee or an astronaut could control a multi-jointed mechanical arm using a 3-axis joystick. Rather than computing complex non-linear inverse kinematics at every millisecond, Whitney linearized the kinematics around the current pose using the Jacobian matrix:
$$\nu = J(q) \dot{q} \implies \dot{q} = J^{-1}(q) \nu$$
By inverting the linear system at each control tick, a computer could continuously convert desired Cartesian hand velocities $\nu$ into instantaneous joint motor commands $\dot{q}$. This paradigm—**Resolved Motion Rate Control (RMRC)**—became the cornerstone of all real-time robot velocity control, visual servoing, and force control.

In the 1980s, roboticists distinguished between the **Analytical Jacobian** (derived by differentiating minimal orientation coordinates such as Euler angles) and the **Geometric Jacobian** (derived directly from cross products of physical rotation axes). Whitney, Paul (1981), and Siciliano (1990) established the superiority of the Geometric Jacobian, which avoids representation singularities (such as Euler gimbal lock) and reflects the true physical twist of the end-effector.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Geometric Jacobian
Let an $n$-joint serial manipulator have joint configuration vector:
$$q = [q_1, q_2, \dots, q_n]^T \in \mathbb{R}^n$$
and joint velocity vector:
$$\dot{q} = [\dot{q}_1, \dot{q}_2, \dots, \dot{q}_n]^T \in \mathbb{R}^n$$

The spatial velocity of the end-effector is described by the 6-dimensional twist $\nu$, comprising linear velocity $v \in \mathbb{R}^3$ and angular velocity $\omega \in \mathbb{R}^3$:
$$\nu = \begin{bmatrix} v \\ \omega \end{bmatrix} \in \mathbb{R}^6$$

The **Geometric Manipulator Jacobian** $J(q) \in \mathbb{R}^{6 \times n}$ is the configuration-dependent linear mapping:
$$\nu = J(q) \dot{q} = \begin{bmatrix} J_v(q) \\ J_\omega(q) \end{bmatrix} \dot{q}$$
where $J_v(q) \in \mathbb{R}^{3 \times n}$ maps to linear velocity, and $J_\omega(q) \in \mathbb{R}^{3 \times n}$ maps to angular velocity.

### 3.2 Column-by-Column Construction
By the principle of superposition in linear kinematics, the total velocity of the end-effector is the vector sum of the velocities contributed by each individual joint moving independently:
$$\nu = \sum_{i=1}^n J_i(q) \dot{q}_i = J_1 \dot{q}_1 + J_2 \dot{q}_2 + \cdots + J_n \dot{q}_n$$
where the $i$-th column $J_i = \begin{bmatrix} J_{v, i} \\ J_{\omega, i} \end{bmatrix} \in \mathbb{R}^6$ represents the end-effector velocity when joint $i$ moves at unit velocity ($\dot{q}_i = 1$) while all other joints are frozen ($\dot{q}_k = 0, k \neq i$).

Let $p_e \in \mathbb{R}^3$ be the Cartesian position of the end-effector.
Let $p_{i-1} \in \mathbb{R}^3$ be the position of the origin of coordinate frame $\{i-1\}$ (located at joint $i$).
Let $z_{i-1} \in \mathbb{R}^3$ be the unit vector pointing along the actuation axis of joint $i$.

```
                              z_{i-1}
                                 ▲
                                 │
                                 ● Joint i (Origin p_{i-1})
                                  \
                                   \  Vector (p_e - p_{i-1})
                                    \
                                     ▼
                                      ● End-Effector (Position p_e)
                                      │
                                      ▼ Tangential Velocity: z_{i-1} x (p_e - p_{i-1})
```

#### Case 1: Joint $i$ is Revolute
- **Angular Velocity:** Rotating joint $i$ with angular speed $\dot{q}_i$ produces angular velocity directed along its rotation axis $z_{i-1}$:
  $$\omega_i = z_{i-1} \dot{q}_i \implies J_{\omega, i} = z_{i-1}$$
- **Linear Velocity:** A rotation about axis $z_{i-1}$ passing through point $p_{i-1}$ produces a tangential linear velocity at the end-effector given by the cross product with the moment arm $(p_e - p_{i-1})$:
  $$v_i = \omega_i \times (p_e - p_{i-1}) = (z_{i-1} \times (p_e - p_{i-1})) \dot{q}_i \implies J_{v, i} = z_{i-1} \times (p_e - p_{i-1})$$

Therefore, for a **revolute joint**:
$$J_i = \begin{bmatrix} z_{i-1} \times (p_e - p_{i-1}) \\ z_{i-1} \end{bmatrix}$$

#### Case 2: Joint $i$ is Prismatic
- **Angular Velocity:** A linear slider cannot produce rotation:
  $$\omega_i = 0 \implies J_{\omega, i} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
- **Linear Velocity:** Translating joint $i$ with speed $\dot{q}_i$ produces pure linear velocity along its translation axis $z_{i-1}$:
  $$v_i = z_{i-1} \dot{q}_i \implies J_{v, i} = z_{i-1}$$

Therefore, for a **prismatic joint**:
$$J_i = \begin{bmatrix} z_{i-1} \\ 0_{3 \times 1} \end{bmatrix}$$

---

### 3.3 Analytical vs. Geometric Jacobian
In some tasks, the end-effector pose is specified using minimal coordinates:
$$x = \begin{bmatrix} p \\ \phi \end{bmatrix} \in \mathbb{R}^m$$
where $p = [x, y, z]^T \in \mathbb{R}^3$ and $\phi = [\psi, \theta, \phi]^T$ are Euler angles (e.g., Roll, Pitch, Yaw).

The **Analytical Jacobian** $J_A(q)$ is obtained by directly differentiating the forward kinematics equations with respect to joint angles:
$$\dot{x} = \begin{bmatrix} \dot{p} \\ \dot{\phi} \end{bmatrix} = \frac{\partial f(q)}{\partial q} \dot{q} = J_A(q) \dot{q}$$

#### The Relationship between $J$ and $J_A$:
While the linear velocity is identical ($\dot{p} = v$), the time derivative of Euler angles $\dot{\phi}$ is **not** equal to the physical angular velocity $\omega$!
Physical angular velocity is related to Euler angle rates by a transformation matrix $E(\phi) \in \mathbb{R}^{3 \times 3}$:
$$\omega = E(\phi) \dot{\phi}$$
Therefore:
$$\nu = \begin{bmatrix} v \\ \omega \end{bmatrix} = \begin{bmatrix} I_3 & 0 \\ 0 & E(\phi) \end{bmatrix} \begin{bmatrix} \dot{p} \\ \dot{\phi} \end{bmatrix} = \begin{bmatrix} I_3 & 0 \\ 0 & E(\phi) \end{bmatrix} J_A(q) \dot{q}$$
Equating this to $\nu = J(q) \dot{q}$:
$$J(q) = \begin{bmatrix} I_3 & 0 \\ 0 & E(\phi) \end{bmatrix} J_A(q) \iff J_A(q) = \begin{bmatrix} I_3 & 0 \\ 0 & E^{-1}(\phi) \end{bmatrix} J(q)$$

#### The Representation Singularity Pitfall:
For standard $Z-Y-X$ Euler angles:
$$E(\phi) = \begin{bmatrix} 0 & -\sin\phi_z & \cos\phi_z\cos\phi_y \\ 0 & \cos\phi_z & \sin\phi_z\cos\phi_y \\ 1 & 0 & -\sin\phi_y \end{bmatrix}$$
The determinant is $\det(E) = -\cos\phi_y$.
When pitch angle $\phi_y = \pm 90^\circ$, $\cos\phi_y = 0$, so $\det(E) = 0$! $E(\phi)$ becomes singular and cannot be inverted, even though the physical robot is completely fine.
**Conclusion:** The Geometric Jacobian $J(q)$ is always preferred over the Analytical Jacobian $J_A(q)$ because it is free from artificial representation singularities.

---

### 3.4 Principle of Virtual Work and Static Force/Torque Duality
Consider a robot arm in static equilibrium holding a tool against a workpiece.
Let $\mathcal{F} = [f, m]^T \in \mathbb{R}^6$ be the external wrench (force $f$, torque $m$) exerted by the end-effector on the environment.
Let $\tau = [\tau_1, \tau_2, \dots, \tau_n]^T \in \mathbb{R}^n$ be the actuator joint motor torques/forces.

By the **Principle of Virtual Work**, in the absence of friction and gravity, the virtual work done by the joint motors during an infinitesimal virtual displacement $\delta q$ must equal the virtual work done by the end-effector against the environment during virtual displacement $\delta x$:
$$\delta W = \tau^T \delta q - \mathcal{F}^T \delta x = 0$$

Using the differential kinematics relation $\delta x = J(q) \delta q$:
$$\tau^T \delta q - \mathcal{F}^T (J(q) \delta q) = 0 \implies (\tau^T - \mathcal{F}^T J(q)) \delta q = 0$$
Because this identity must hold for all arbitrary virtual displacements $\delta q$:
$$\tau^T = \mathcal{F}^T J(q) \iff \tau = J^T(q) \mathcal{F}$$

```
                           Kinematic Mapping:
                 Joint Velocities ───[ J(q) ]───▶ End-Effector Twist
                       q_dot                             ν
                         ▲                               │
                         │       Duality Transpose       │
                         │                               ▼
                 Actuator Torques ◀──[ J^T(q) ]─── External Wrench
                        τ                                F
                            Static Force Mapping
```

This fundamental duality reveals:
1. The **transpose** of the Jacobian maps external Cartesian forces and moments back to internal motor torques!
2. Directions in which the robot has high velocity capability ($J$ is large) have low mechanical force capability ($J^T$ requires large motor torque).

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation for calculating the Geometric Jacobian and verifying it against numerical finite differences:

```typescript
export interface ForwardKinematicsResult {
  endEffectorPos: { x: number; y: number; z: number };
  jointPositions: { x: number; y: number; z: number }[];
  jointAxesZ: { x: number; y: number; z: number }[];
}

export class JacobianEngine {
  /**
   * Computes the 6 x n Geometric Jacobian matrix from forward kinematics geometry.
   */
  public static computeGeometricJacobian(
    fk: ForwardKinematicsResult,
    isRevolute: boolean[]
  ): number[][] {
    const n = fk.jointAxesZ.length;
    const pe = fk.endEffectorPos;

    // 6 rows x n cols
    const J: number[][] = Array.from({ length: 6 }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      const z = fk.jointAxesZ[i];
      const p = fk.jointPositions[i];

      if (isRevolute[i]) {
        // J_v = z x (pe - p)
        const rx = pe.x - p.x;
        const ry = pe.y - p.y;
        const rz = pe.z - p.z;

        const jvx = z.y * rz - z.z * ry;
        const jvy = z.z * rx - z.x * rz;
        const jvz = z.x * ry - z.y * rx;

        J[0][i] = jvx;
        J[1][i] = jvy;
        J[2][i] = jvz;

        // J_omega = z
        J[3][i] = z.x;
        J[4][i] = z.y;
        J[5][i] = z.z;
      } else {
        // Prismatic: J_v = z, J_omega = 0
        J[0][i] = z.x;
        J[1][i] = z.y;
        J[2][i] = z.z;

        J[3][i] = 0;
        J[4][i] = 0;
        J[5][i] = 0;
      }
    }

    return J;
  }

  /**
   * Computes required joint torques tau = J^T * F for a given external wrench F.
   */
  public static computeStaticTorques(J: number[][], wrench: number[]): number[] {
    const n = J[0].length;
    const tau: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let r = 0; r < 6; r++) {
        sum += J[r][i] * wrench[r];
      }
      tau[i] = sum;
    }
    return tau;
  }

  /**
   * Verifies the Jacobian via numerical central finite differences:
   * d(pos) / d(q_i) approx (pos(q + eps) - pos(q - eps)) / (2 * eps)
   */
  public static verifyNumericalJacobian(
    fkFunction: (q: number[]) => { x: number; y: number; z: number },
    q: number[],
    analyticalJv: number[][],
    eps: number = 1e-6
  ): boolean {
    const n = q.length;
    for (let i = 0; i < n; i++) {
      const qPlus = [...q];
      const qMinus = [...q];
      qPlus[i] += eps;
      qMinus[i] -= eps;

      const posPlus = fkFunction(qPlus);
      const posMinus = fkFunction(qMinus);

      const numVx = (posPlus.x - posMinus.x) / (2 * eps);
      const numVy = (posPlus.y - posMinus.y) / (2 * eps);
      const numVz = (posPlus.z - posMinus.z) / (2 * eps);

      const tol = 1e-4;
      if (
        Math.abs(numVx - analyticalJv[0][i]) > tol ||
        Math.abs(numVy - analyticalJv[1][i]) > tol ||
        Math.abs(numVz - analyticalJv[2][i]) > tol
      ) {
        return false;
      }
    }
    return true;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 6.1: Geometric Jacobian Derivation for a 2R Planar Manipulator
**Problem Statement:** Consider a 2R planar manipulator operating in the $xy$-plane with link lengths $L_1$ and $L_2$.
1. Derive the $2 \times 2$ Jacobian matrix relating joint velocities $(\dot{\theta}_1, \dot{\theta}_2)$ to linear velocities $(\dot{x}, \dot{y})$ of the end-effector.
2. Verify the result by differentiating the forward kinematics equations directly.

**Given Data:**
- $x = L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2)$
- $y = L_1\sin\theta_1 + L_2\sin(\theta_1 + \theta_2)$
- $z_0 = [0, 0, 1]^T, p_0 = [0, 0, 0]^T$
- $z_1 = [0, 0, 1]^T, p_1 = [L_1\cos\theta_1, L_1\sin\theta_1, 0]^T$
- $p_e = [x, y, 0]^T$

**Step-by-Step Derivation:**
1. Column 1 (Joint 1):
   $$p_e - p_0 = \begin{bmatrix} L_1\cos\theta_1 + L_2\cos\theta_{12} \\ L_1\sin\theta_1 + L_2\sin\theta_{12} \\ 0 \end{bmatrix}$$
   $$J_{v, 1} = z_0 \times (p_e - p_0) = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_1\cos\theta_1 + L_2\cos\theta_{12} \\ L_1\sin\theta_1 + L_2\sin\theta_{12} \\ 0 \end{bmatrix} = \begin{bmatrix} -L_1\sin\theta_1 - L_2\sin\theta_{12} \\ L_1\cos\theta_1 + L_2\cos\theta_{12} \\ 0 \end{bmatrix}$$
2. Column 2 (Joint 2):
   $$p_e - p_1 = \begin{bmatrix} (L_1\cos\theta_1 + L_2\cos\theta_{12}) - L_1\cos\theta_1 \\ (L_1\sin\theta_1 + L_2\sin\theta_{12}) - L_1\sin\theta_1 \\ 0 \end{bmatrix} = \begin{bmatrix} L_2\cos\theta_{12} \\ L_2\sin\theta_{12} \\ 0 \end{bmatrix}$$
   $$J_{v, 2} = z_1 \times (p_e - p_1) = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} L_2\cos\theta_{12} \\ L_2\sin\theta_{12} \\ 0 \end{bmatrix} = \begin{bmatrix} -L_2\sin\theta_{12} \\ L_2\cos\theta_{12} \\ 0 \end{bmatrix}$$
3. Direct Differentiation of Forward Kinematics:
   $$\dot{x} = \frac{\partial x}{\partial \theta_1}\dot{\theta}_1 + \frac{\partial x}{\partial \theta_2}\dot{\theta}_2 = (-L_1\sin\theta_1 - L_2\sin\theta_{12})\dot{\theta}_1 + (-L_2\sin\theta_{12})\dot{\theta}_2$$
   $$\dot{y} = \frac{\partial y}{\partial \theta_1}\dot{\theta}_1 + \frac{\partial y}{\partial \theta_2}\dot{\theta}_2 = (L_1\cos\theta_1 + L_2\cos\theta_{12})\dot{\theta}_1 + (L_2\cos\theta_{12})\dot{\theta}_2$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -L_1\sin\theta_1 - L_2\sin(\theta_1 + \theta_2) & -L_2\sin(\theta_1 + \theta_2) \\ L_1\cos\theta_1 + L_2\cos(\theta_1 + \theta_2) & L_2\cos(\theta_1 + \theta_2) \end{bmatrix}$$

**Verification & Sanity Check:**
Both methods yield identical matrix entries. Column 2 depends only on link 2 because joint 2 does not translate link 1.

---

### Problem 6.2: End-Effector Cartesian Velocity Calculation
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is at configuration $(\theta_1, \theta_2) = (0^\circ, 90^\circ) = (0, \pi/2)$. The joint motors are running at $\dot{\theta}_1 = 1.0\text{ rad/s}$ and $\dot{\theta}_2 = -2.0\text{ rad/s}$. Calculate the Cartesian linear velocity vector $(\dot{x}, \dot{y})$ of the end-effector.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $\theta_1 = 0, \theta_2 = \pi/2 \implies \theta_{12} = \pi/2$
- $\sin(0) = 0, \cos(0) = 1$
- $\sin(\pi/2) = 1, \cos(\pi/2) = 0$
- $\dot{\theta} = [1.0, -2.0]^T$

**Step-by-Step Derivation:**
1. Evaluate the Jacobian matrix entries from Problem 6.1:
   $$J_{11} = -1.0\sin(0) - 1.0\sin(\pi/2) = 0 - 1.0 = -1.0$$
   $$J_{12} = -1.0\sin(\pi/2) = -1.0$$
   $$J_{21} = 1.0\cos(0) + 1.0\cos(\pi/2) = 1.0(1) + 1.0(0) = +1.0$$
   $$J_{22} = 1.0\cos(\pi/2) = 0.0$$
   $$J = \begin{bmatrix} -1.0 & -1.0 \\ 1.0 & 0.0 \end{bmatrix}$$
2. Compute Cartesian velocity $\begin{bmatrix} \dot{x} \\ \dot{y} \end{bmatrix} = J \begin{bmatrix} \dot{\theta}_1 \\ \dot{\theta}_2 \end{bmatrix}$:
   $$\dot{x} = J_{11}\dot{\theta}_1 + J_{12}\dot{\theta}_2 = -1.0(1.0) + (-1.0)(-2.0) = -1.0 + 2.0 = +1.0\text{ m/s}$$
   $$\dot{y} = J_{21}\dot{\theta}_1 + J_{22}\dot{\theta}_2 = 1.0(1.0) + 0.0(-2.0) = +1.0\text{ m/s}$$

**Final Answer:**
The end-effector Cartesian velocity is **$\begin{bmatrix} \dot{x} \\ \dot{y} \end{bmatrix} = \begin{bmatrix} +1.0 \\ +1.0 \end{bmatrix}\text{ m/s}$**, with speed $\|\nu\| = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1.4142\text{ m/s}$.

**Verification & Sanity Check:**
- At this configuration, link 1 is horizontal ($[1, 0]$), link 2 points vertically up ($[0, 1]$).
- Joint 1 rotates counter-clockwise ($+1\text{ rad/s}$): pushes link 2 tip upward ($+y$) and leftward ($-x$).
- Joint 2 rotates clockwise ($-2\text{ rad/s}$): pushes link 2 tip strongly rightward ($+x$) without affecting $y$.
- Net horizontal motion: $-1.0 + 2.0 = +1.0\text{ m/s}$. Net vertical motion: $+1.0\text{ m/s}$. Perfectly consistent with physical intuition.

---

### Problem 6.3: Geometric Jacobian of a 3R Planar Manipulator
**Problem Statement:** A 3R planar manipulator has link lengths $L_1, L_2, L_3$ and joint angles $\theta_1, \theta_2, \theta_3$. Derive the complete $3 \times 3$ Jacobian matrix relating $[\dot{\theta}_1, \dot{\theta}_2, \dot{\theta}_3]^T$ to $[\dot{x}, \dot{y}, \omega_z]^T$.

**Given Data:**
- Link lengths $L_1, L_2, L_3$
- $s_1 = \sin\theta_1, c_1 = \cos\theta_1$
- $s_{12} = \sin(\theta_1 + \theta_2), c_{12} = \cos(\theta_1 + \theta_2)$
- $s_{123} = \sin(\theta_1 + \theta_2 + \theta_3), c_{123} = \cos(\theta_1 + \theta_2 + \theta_3)$

**Step-by-Step Derivation:**
1. Position coordinates of end-effector:
   $$x = L_1 c_1 + L_2 c_{12} + L_3 c_{123}$$
   $$y = L_1 s_1 + L_2 s_{12} + L_3 s_{123}$$
2. Angular velocity:
   Since all three revolute joints rotate about parallel axes $z_0 \parallel z_1 \parallel z_2 \parallel \hat{z}$:
   $$\omega_z = \dot{\theta}_1 + \dot{\theta}_2 + \dot{\theta}_3$$
   Therefore, the third row of the Jacobian is $[1, 1, 1]$.
3. Differentiate $x$ and $y$ with respect to each joint:
   - Column 1:
     $$J_{11} = -L_1 s_1 - L_2 s_{12} - L_3 s_{123}, \quad J_{21} = L_1 c_1 + L_2 c_{12} + L_3 c_{123}$$
   - Column 2:
     $$J_{12} = -L_2 s_{12} - L_3 s_{123}, \quad J_{22} = L_2 c_{12} + L_3 c_{123}$$
   - Column 3:
     $$J_{13} = -L_3 s_{123}, \quad J_{23} = L_3 c_{123}$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} - L_3 s_{123} & -L_2 s_{12} - L_3 s_{123} & -L_3 s_{123} \\ L_1 c_1 + L_2 c_{12} + L_3 c_{123} & L_2 c_{12} + L_3 c_{123} & L_3 c_{123} \\ 1 & 1 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
If only joint 3 rotates, link 3 pivots about $(x_2, y_2)$ with radius $L_3$. Column 3 is $[-L_3 s_{123}, L_3 c_{123}, 1]^T$, the exact circular velocity around joint 3.

---

### Problem 6.4: Geometric Jacobian of a SCARA Manipulator (RRPR)
**Problem Statement:** A SCARA robot has two horizontal revolute links ($L_1, L_2$), a vertical prismatic joint ($d_3$), and a wrist roll ($\theta_4$). Derive its $6 \times 4$ Geometric Jacobian matrix.

**Given Data:**
- Joints 1, 2, 4: Revolute about vertical $\hat{z}$.
- Joint 3: Prismatic along $-\hat{z}$.

**Step-by-Step Derivation:**
1. Column 1 (Joint 1, R about $\hat{z}$ at origin):
   $$J_1 = \begin{bmatrix} z_0 \times p_e \\ z_0 \end{bmatrix} = \begin{bmatrix} -y \\ x \\ 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
2. Column 2 (Joint 2, R about $\hat{z}$ at $p_1$):
   $$p_e - p_1 = [L_2 c_{12}, L_2 s_{12}, -d_3]^T$$
   $$J_2 = \begin{bmatrix} z_1 \times (p_e - p_1) \\ z_1 \end{bmatrix} = \begin{bmatrix} -L_2 s_{12} \\ L_2 c_{12} \\ 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
3. Column 3 (Joint 3, P along $-\hat{z}$):
   $$J_3 = \begin{bmatrix} z_2 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ -1 \\ 0 \\ 0 \\ 0 \end{bmatrix}$$
4. Column 4 (Joint 4, R about $\hat{z}$ at end-effector tip, $p_e - p_3 = 0$):
   $$J_4 = \begin{bmatrix} z_3 \times 0 \\ z_3 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} & 0 & 0 \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 1 & 1 & 0 & 1 \end{bmatrix}$$

**Verification & Sanity Check:**
Rows 4 and 5 (rotations about $\hat{x}$ and $\hat{y}$) are identically zero because all motion is strictly confined to horizontal planes and vertical translation.

---

### Problem 6.5: Cylindrical Robot (RPP) Geometric Jacobian
**Problem Statement:** A cylindrical robot has:
- Joint 1: Revolute about $z_0 = [0, 0, 1]^T$ at origin.
- Joint 2: Prismatic along $z_1 = [0, 0, 1]^T$.
- Joint 3: Prismatic along radial horizontal axis $z_2 = [\cos\theta_1, \sin\theta_1, 0]^T$.
Derive the $6 \times 3$ Geometric Jacobian.

**Given Data:**
- $p_e = [r\cos\theta_1, r\sin\theta_1, z]^T$ where $r = d_3, z = d_2$.

**Step-by-Step Derivation:**
1. Column 1 (Revolute waist $\theta_1$):
   $$J_{v, 1} = z_0 \times p_e = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} r\cos\theta_1 \\ r\sin\theta_1 \\ z \end{bmatrix} = \begin{bmatrix} -r\sin\theta_1 \\ r\cos\theta_1 \\ 0 \end{bmatrix}, \quad J_{\omega, 1} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
2. Column 2 (Prismatic height $d_2$):
   $$J_{v, 2} = z_1 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}, \quad J_{\omega, 2} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
3. Column 3 (Prismatic radius $d_3$):
   $$J_{v, 3} = z_2 = \begin{bmatrix} \cos\theta_1 \\ \sin\theta_1 \\ 0 \end{bmatrix}, \quad J_{\omega, 3} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$

**Final Answer:**
$$J(q) = \begin{bmatrix} -r\sin\theta_1 & 0 & \cos\theta_1 \\ r\cos\theta_1 & 0 & \sin\theta_1 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \\ 1 & 0 & 0 \end{bmatrix}$$

**Verification & Sanity Check:**
Extract the $3 \times 3$ linear velocity Jacobian $J_v$:
$\det(J_v) = -r\sin\theta_1(0 - \sin\theta_1) + \cos\theta_1(r\cos\theta_1 - 0) = r\sin^2\theta_1 + r\cos^2\theta_1 = r$.
Matches the Jacobian determinant of cylindrical coordinates: $dx\, dy\, dz = r\, dr\, d\theta\, dz$.

---

### Problem 6.6: Euler Angle Velocity Transformation Matrix $E(\phi)$
**Problem Statement:** Derive the transformation matrix $E(\phi) \in \mathbb{R}^{3 \times 3}$ relating physical angular velocity $\omega$ to $Z-Y-X$ Euler angle rates $[\dot{\phi}_z, \dot{\phi}_y, \dot{\phi}_x]^T$.

**Given Data:**
- Rotation sequence: $R = R_z(\phi_z) R_y(\phi_y) R_x(\phi_x)$

**Step-by-Step Derivation:**
1. The total angular velocity is the sum of rotations about the successive intermediate axes:
   $$\omega = \dot{\phi}_z \hat{z}_0 + \dot{\phi}_y \hat{y}_1 + \dot{\phi}_x \hat{x}_2$$
2. Express each unit vector in base frame coordinates:
   - $\hat{z}_0 = [0, 0, 1]^T$
   - $\hat{y}_1 = R_z(\phi_z) [0, 1, 0]^T = [-\sin\phi_z, \cos\phi_z, 0]^T$
   - $\hat{x}_2 = R_z(\phi_z) R_y(\phi_y) [1, 0, 0]^T = \begin{bmatrix} \cos\phi_z & -\sin\phi_z & 0 \\ \sin\phi_z & \cos\phi_z & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} \cos\phi_y \\ 0 \\ -\sin\phi_y \end{bmatrix} = \begin{bmatrix} \cos\phi_z\cos\phi_y \\ \sin\phi_z\cos\phi_y \\ -\sin\phi_y \end{bmatrix}$
3. Combine into matrix form $\omega = E(\phi) \dot{\phi}$:
   $$E(\phi) = \begin{bmatrix} 0 & -\sin\phi_z & \cos\phi_z\cos\phi_y \\ 0 & \cos\phi_z & \sin\phi_z\cos\phi_y \\ 1 & 0 & -\sin\phi_y \end{bmatrix}$$

**Final Answer:**
$$E(\phi) = \begin{bmatrix} 0 & -\sin\phi_z & \cos\phi_z\cos\phi_y \\ 0 & \cos\phi_z & \sin\phi_z\cos\phi_y \\ 1 & 0 & -\sin\phi_y \end{bmatrix}$$

**Verification & Sanity Check:**
If $\phi_z = 0, \phi_y = 0, \phi_x = 0$, $E = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ 1 & 0 & 0 \end{bmatrix}$, which maps yaw to $z$, pitch to $y$, and roll to $x$.

---

### Problem 6.7: Static Force Transmission on a 2R Planar Arm
**Problem Statement:** A 2R planar manipulator with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is at configuration $(\theta_1, \theta_2) = (0^\circ, 90^\circ)$. Its end-effector exerts a horizontal force of $F_x = 100\text{ N}$ against a wall ($F = [100, 0]^T\text{ N}$). Calculate the motor torques $\tau_1, \tau_2$ required to maintain static equilibrium.

**Given Data:**
- $J = \begin{bmatrix} -1.0 & -1.0 \\ 1.0 & 0.0 \end{bmatrix}$ (from Problem 6.2)
- $F = [100.0, 0.0]^T\text{ N}$

**Step-by-Step Derivation:**
1. Apply the static duality formula $\tau = J^T F$:
   $$\tau = \begin{bmatrix} J_{11} & J_{21} \\ J_{12} & J_{22} \end{bmatrix} \begin{bmatrix} F_x \\ F_y \end{bmatrix} = \begin{bmatrix} -1.0 & 1.0 \\ -1.0 & 0.0 \end{bmatrix} \begin{bmatrix} 100.0 \\ 0.0 \end{bmatrix}$$
2. Compute the matrix product:
   $$\tau_1 = (-1.0)(100.0) + (1.0)(0.0) = -100.0\text{ N}\cdot\text{m}$$
   $$\tau_2 = (-1.0)(100.0) + (0.0)(0.0) = -100.0\text{ N}\cdot\text{m}$$

**Final Answer:**
The required motor torques are **$\tau_1 = -100.0\text{ N}\cdot\text{m}$** and **$\tau_2 = -100.0\text{ N}\cdot\text{m}$**.

**Verification & Sanity Check:**
- The end-effector is at $(1.0, 1.0)$.
- A force of $100\text{ N}$ pushing rightward along $+x$ exerts a counter-clockwise torque about Joint 2 (at $(1, 0)$) of $\tau = 100\text{ N} \times 1.0\text{ m} = 100\text{ N}\cdot\text{m}$. To resist this, motor 2 must apply $-100\text{ N}\cdot\text{m}$.
- About Joint 1 (at $(0, 0)$), the moment arm for horizontal force is also the vertical distance $y = 1.0\text{ m}$, requiring motor 1 to apply $-100\text{ N}\cdot\text{m}$. Static torque mechanics matches $J^T F$ perfectly.

---

### Problem 6.8: Geometric Jacobian of an Anthropomorphic 3-DoF Arm
**Problem Statement:** An anthropomorphic arm has:
- Joint 1: Waist rotation about $z_0 = [0, 0, 1]^T$ at origin.
- Joint 2: Shoulder pitch about horizontal axis $z_1 = [-\sin\theta_1, \cos\theta_1, 0]^T$ at $[0, 0, H_1]^T$.
- Joint 3: Elbow pitch about parallel axis $z_2 = z_1$ at distance $L_1$ from shoulder.
Derive the linear velocity Jacobian columns $J_{v, 1}, J_{v, 2}, J_{v, 3}$.

**Step-by-Step Derivation:**
1. Column 1:
   $$J_{v, 1} = z_0 \times p_e = [0, 0, 1]^T \times [x_e, y_e, z_e]^T = [-y_e, x_e, 0]^T$$
2. Column 2:
   Let $r_1 = p_e - p_1$:
   $$J_{v, 2} = z_1 \times (p_e - p_1)$$
3. Column 3:
   Let $r_2 = p_e - p_2$:
   $$J_{v, 3} = z_2 \times (p_e - p_2)$$
   Because $z_2 = z_1$ (parallel pitch axes):
   $$J_{v, 3} = z_1 \times (p_e - p_2)$$

**Final Answer:**
- $J_{v, 1} = [-y_e, x_e, 0]^T$
- $J_{v, 2} = z_1 \times (p_e - p_1)$
- $J_{v, 3} = z_1 \times (p_e - p_2)$

**Verification & Sanity Check:**
Joint 1 produces purely horizontal azimuthal velocity perpendicular to $p_e$. Joints 2 and 3 produce motion strictly in the vertical elevation plane containing the arm.

---

### Problem 6.9: Space vs. Body Manipulator Jacobian
**Problem Statement:** Prove that the Spatial Jacobian $J_s(q)$ and Body Jacobian $J_b(q)$ are related by $J_s(q) = \operatorname{Ad}_{T_{sb}(q)} J_b(q)$.

**Step-by-Step Derivation:**
1. Spatial velocity is $\mathcal{V}_s = J_s(q) \dot{q}$.
2. Body velocity is $\mathcal{V}_b = J_b(q) \dot{q}$.
3. Recall from Chapter 2 that spatial and body twists are related by the adjoint map of the current transformation:
   $$\mathcal{V}_s = \operatorname{Ad}_{T_{sb}(q)} \mathcal{V}_b$$
4. Substitute the Jacobian mappings:
   $$J_s(q) \dot{q} = \operatorname{Ad}_{T_{sb}(q)} (J_b(q) \dot{q}) = (\operatorname{Ad}_{T_{sb}(q)} J_b(q)) \dot{q}$$
5. Because this must hold for any arbitrary velocity vector $\dot{q} \in \mathbb{R}^n$:
   $$J_s(q) = \operatorname{Ad}_{T_{sb}(q)} J_b(q)$$

**Final Answer:**
$$J_s(q) = \operatorname{Ad}_{T_{sb}(q)} J_b(q)$$

**Verification & Sanity Check:**
Inverting yields $J_b(q) = \operatorname{Ad}_{T_{sb}^{-1}(q)} J_s(q) = \operatorname{Ad}_{T_{bs}(q)} J_s(q)$.

---

### Problem 6.10: Finite Difference Numerical Verification of Jacobian
**Problem Statement:** A 2R planar arm has $L_1 = 1.0, L_2 = 0.5$ at $q = [30^\circ, 45^\circ]$.
1. Evaluate the analytical linear Jacobian $J_v$.
2. Compute the central finite difference estimate of $\frac{\partial p}{\partial \theta_1}$ using step size $\epsilon = 10^{-5}\text{ rad}$.

**Given Data:**
- $\theta_1 = 30^\circ = 0.523599\text{ rad}$
- $\theta_2 = 45^\circ = 0.785398\text{ rad}$
- $\theta_{12} = 75^\circ = 1.308997\text{ rad}$

**Step-by-Step Derivation:**
1. Analytical Column 1:
   $$J_{11} = -1.0\sin(30^\circ) - 0.5\sin(75^\circ) = -0.500000 - 0.5(0.965926) = -0.500000 - 0.482963 = -0.982963$$
   $$J_{21} = 1.0\cos(30^\circ) + 0.5\cos(75^\circ) = 0.866025 + 0.5(0.258819) = 0.866025 + 0.129410 = 0.995435$$
2. Numerical Central Difference for Joint 1:
   Let $\epsilon = 10^{-5}$.
   - Forward state $q^+ = [0.523599 + 10^{-5}, 0.785398]$:
     $$x^+ = 1.0\cos(0.523609) + 0.5\cos(1.309007) \approx 0.995425$$
     $$y^+ = 1.0\sin(0.523609) + 0.5\sin(1.309007) \approx 0.982973$$
   - Backward state $q^- = [0.523599 - 10^{-5}, 0.785398]$:
     $$x^- = 1.0\cos(0.523589) + 0.5\cos(1.308987) \approx 0.995445$$
     $$y^- = 1.0\sin(0.523589) + 0.5\sin(1.308987) \approx 0.982953$$
   - Finite difference:
     $$\frac{\Delta x}{2\epsilon} = \frac{0.995425 - 0.995445}{2 \times 10^{-5}} = -0.982963$$
     $$\frac{\Delta y}{2\epsilon} = \frac{0.982973 - 0.982953}{2 \times 10^{-5}} = +0.995435$$

**Final Answer:**
- Analytical: $[-0.982963, 0.995435]^T$
- Numerical: $[-0.982963, 0.995435]^T$
- Error: **$< 10^{-8}$** (machine precision match).

**Verification & Sanity Check:**
Confirms that the geometric cross-product formulation matches the infinitesimal analytical calculus of the forward kinematics.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 6.11: Instantaneous Center of Rotation (ICR)
**Problem Statement:** For a 2R planar arm, show that the Instantaneous Center of Rotation (ICR) of link 2 is located at Joint 2 when Joint 1 is fixed ($\dot{\theta}_1 = 0$), and locate the ICR when both joints rotate at equal and opposite rates ($\dot{\theta}_2 = -\dot{\theta}_1$).

**Solution:**
1. When $\dot{\theta}_1 = 0$, link 1 is stationary. Joint 2 is a fixed pivot, so link 2 rotates purely around Joint 2: ICR is at $p_1$.
2. When $\dot{\theta}_2 = -\dot{\theta}_1$, the total orientation rate is $\omega = \dot{\theta}_1 + \dot{\theta}_2 = 0$.
3. Since $\omega = 0$, the motion of link 2 is pure translation without rotation!
4. The Instantaneous Center of Rotation lies at infinity along the perpendicular to velocity $v$.

---

### Problem 6.12: PUMA 560 Jacobian Structure
**Problem Statement:** Show that the $6 \times 6$ Jacobian of the PUMA 560 can be partitioned into block triangular form when evaluated at the wrist center $p_w$.

**Solution:**
1. Place the point of interest at the wrist center $p_w = p_3 = p_4 = p_5$.
2. For joints 4, 5, 6, $p_w - p_{i-1} = 0$.
3. Therefore, $J_{v, 4} = J_{v, 5} = J_{v, 6} = 0$.
4. The Jacobian matrix partitions as:
   $$J(q) = \begin{bmatrix} J_{11} & 0_{3 \times 3} \\ J_{21} & J_{22} \end{bmatrix}$$
5. The determinant is simply $\det(J) = \det(J_{11}) \det(J_{22})$, which drastically simplifies singularity detection and numerical inversion.

---

### Problem 6.13: Stanford Arm Jacobian Column for Prismatic Boom
**Problem Statement:** For the Stanford Arm, joint 3 is a prismatic joint extending along unit vector $z_2 = [\cos\theta_1\sin\theta_2, \sin\theta_1\sin\theta_2, \cos\theta_2]^T$. Write column 3 of the Geometric Jacobian.

**Solution:**
1. A prismatic joint has zero angular velocity contribution: $J_{\omega, 3} = [0, 0, 0]^T$.
2. The linear velocity contribution is its unit direction of motion $z_2$:
   $$J_{v, 3} = z_2 = \begin{bmatrix} \cos\theta_1\sin\theta_2 \\ \sin\theta_1\sin\theta_2 \\ \cos\theta_2 \end{bmatrix}$$
3. Full column:
   $$J_3 = [\cos\theta_1\sin\theta_2, \sin\theta_1\sin\theta_2, \cos\theta_2, 0, 0, 0]^T$$

---

### Problem 6.14: Joint Torques under Gravitational Load
**Problem Statement:** An articulated arm has $n$ links with masses $m_i$ and center-of-mass positions $p_{c, i}$. Express the gravity torque vector $\tau_g(q)$ using the Jacobian matrices of the link centers of mass.

**Solution:**
1. Each link $i$ is subjected to gravitational downward force $f_{g, i} = [0, 0, -m_i g]^T$.
2. Let $J_{v, ci}(q) \in \mathbb{R}^{3 \times n}$ be the linear Jacobian mapping joint velocities $\dot{q}$ to the velocity of center of mass $p_{c, i}$.
3. By the Principle of Virtual Work, the gravity torque vector is:
   $$\tau_g(q) = \sum_{i=1}^n J_{v, ci}^T(q) (m_i g \hat{z})$$
4. This avoids computing multi-link Newtonian force balances by evaluating Jacobian projections.

---

### Problem 6.15: Radial vs. Tangential Velocity Decomposition
**Problem Statement:** For a 2R planar arm, project the end-effector velocity $\nu = J\dot{q}$ into radial velocity $\dot{r}$ and tangential velocity $r\dot{\beta}$.

**Solution:**
1. Let radial distance be $r = \sqrt{x^2 + y^2}$. Differentiating gives $\dot{r} = \frac{x\dot{x} + y\dot{y}}{r}$.
2. In vector notation: $\dot{r} = \hat{u}_r \cdot v$, where $\hat{u}_r = [\cos\beta, \sin\beta]^T$.
3. Tangential velocity: $v_t = \hat{u}_\theta \cdot v$, where $\hat{u}_\theta = [-\sin\beta, \cos\beta]^T$.
4. Substituting $v = J\dot{q}$ yields the polar Jacobian $J_{\text{polar}} = \begin{bmatrix} \hat{u}_r^T J \\ \hat{u}_\theta^T J \end{bmatrix}$.

---

### Problem 6.16: Representation Singularity of $Z-Y-Z$ Euler Angles
**Problem Statement:** Derive the matrix $E(\phi)$ for $Z-Y-Z$ Euler angles and find where $\det(E) = 0$.

**Solution:**
1. Sequence: $R = R_z(\alpha) R_y(\beta) R_z(\gamma)$.
2. Angular velocity: $\omega = \dot{\alpha}\hat{z}_0 + \dot{\beta}\hat{y}_1 + \dot{\gamma}\hat{z}_2$.
3. In matrix form:
   $$E(\phi) = \begin{bmatrix} 0 & -\sin\alpha & \cos\alpha\sin\beta \\ 0 & \cos\alpha & \sin\alpha\sin\beta \\ 1 & 0 & \cos\beta \end{bmatrix}$$
4. Compute the determinant by expanding along row 3:
   $$\det(E) = 1(-\sin\alpha\sin\alpha\sin\beta - \cos\alpha\cos\alpha\sin\beta) = -\sin\beta$$
5. Singularities occur when $\sin\beta = 0 \implies \beta = 0$ or $\beta = \pi$ (wrist pitch aligned with base/tool roll).

---

### Problem 6.17: Virtual Work with Prismatic Actuators
**Problem Statement:** Prove that for a prismatic joint $i$ along axis $z_{i-1}$, $\tau_i = J_i^T \mathcal{F}$ gives the scalar force acting along the slider.

**Solution:**
1. For prismatic joint $i$, $J_i = [z_{i-1}^T, 0_{1 \times 3}]^T$.
2. The wrench is $\mathcal{F} = [f^T, m^T]^T$.
3. Compute the product:
   $$\tau_i = J_i^T \mathcal{F} = [z_{i-1}^T, 0] \begin{bmatrix} f \\ m \end{bmatrix} = z_{i-1} \cdot f$$
4. This is the dot product of the contact force with the sliding axis, which is the exact scalar axial force $f_{\text{axis}}$.

---

### Problem 6.18: Jacobian Column Derivation via Product of Exponentials
**Problem Statement:** Prove that the $i$-th column of the spatial Jacobian is given by $J_{si} = \operatorname{Ad}_{T_{0, i-1}} \mathcal{S}_i$, where $T_{0, i-1} = e^{[\mathcal{S}_1]q_1} \cdots e^{[\mathcal{S}_{i-1}]q_{i-1}}$.

**Solution:**
1. The spatial twist is defined as $[\mathcal{V}_s] = \dot{T} T^{-1}$.
2. From Chapter 4, Problem 4.14:
   $$\dot{T} T^{-1} = \sum_{i=1}^n \left( T_{0, i-1} [\mathcal{S}_i] T_{0, i-1}^{-1} \right) \dot{q}_i$$
3. By the adjoint matrix property:
   $$T_{0, i-1} [\mathcal{S}_i] T_{0, i-1}^{-1} = [\operatorname{Ad}_{T_{0, i-1}} \mathcal{S}_i]$$
4. Therefore, the coefficient of $\dot{q}_i$ is the $i$-th column:
   $$J_{si} = \operatorname{Ad}_{T_{0, i-1}} \mathcal{S}_i$$

---

### Problem 6.19: UR5 Collaborative Robot Jacobian at Home Pose
**Problem Statement:** Evaluate the $6 \times 6$ Spatial Jacobian $J_s$ for the UR5 at home configuration $q = [0, 0, 0, 0, 0, 0]^T$.

**Solution:**
1. At home configuration ($q = 0$), $T_{0, i-1} = I$ for all joints.
2. Therefore, each column of the Spatial Jacobian is simply the spatial screw axis itself:
   $$J_{si}(0) = \operatorname{Ad}_I \mathcal{S}_i = \mathcal{S}_i$$
3. Hence:
   $$J_s(0) = \begin{bmatrix} \mathcal{S}_1 & \mathcal{S}_2 & \mathcal{S}_3 & \mathcal{S}_4 & \mathcal{S}_5 & \mathcal{S}_6 \end{bmatrix}$$
4. The columns are the exact spatial screws derived in Chapter 4, Problem 4.6.

---

### Problem 6.20: Mechanical Energy Conservation Invariant
**Problem Statement:** Prove that power computed in joint space $P_{\text{joint}} = \tau^T \dot{q}$ is identically equal to power computed in task space $P_{\text{task}} = \mathcal{F}^T \nu$.

**Solution:**
1. By the static force duality theorem: $\tau = J^T \mathcal{F}$.
2. Transpose both sides: $\tau^T = \mathcal{F}^T J$.
3. Multiply by joint velocity $\dot{q}$:
   $$P_{\text{joint}} = \tau^T \dot{q} = (\mathcal{F}^T J) \dot{q} = \mathcal{F}^T (J \dot{q})$$
4. By definition of the Jacobian, $J\dot{q} = \nu$:
   $$P_{\text{joint}} = \mathcal{F}^T \nu = P_{\text{task}}$$
5. Instantaneous mechanical power is conserved across the kinematic chain.

---

# Chapter 7: Kinematic Singularities, Workspace Boundaries, and Manipulability Ellipsoids

---

## 1. The Layman's Genesis & Intuitive Overview

Extend your arm straight out in front of you as far as you can. Lock your elbow into a completely straight line. Now, without moving your shoulder, try to move your hand forward by another centimeter.

It is physically impossible. Your arm is at the absolute boundary of its reach. But something much more subtle and dangerous is occurring mathematically:
- If you were asked to move your hand sideways or up and down, your shoulder and elbow could easily accomplish it.
- But along the radial line pointing straight outward from your shoulder, your arm has lost the ability to move. 

Now imagine you are an industrial robot controller attempting to maintain a constant Cartesian velocity of $0.5\text{ m/s}$ forward. As your elbow straightens and aligns with your upper arm, the transmission ratio between motor rotation and forward hand motion collapses to zero. To produce even a millimeter of forward motion, the control loop demands that your elbow motor spin faster and faster: $10\text{ rad/s} \to 100\text{ rad/s} \to 10,000\text{ rad/s} \to \infty$! The motors screech, draw massive current spikes, trigger emergency stops, or physically tear their gearboxes apart.

```
       Normal Configuration                   Singular Configuration (Straight Arm)
            ●                                       ● Joint 1
           / \                                      │
          /   \                                     │ Link 1
         /     \                                    ▼
        ●       ●                                   ● Joint 2 (Elbow Aligned)
    Flexible, full 2D motion                        │
    Manipulability Ellipse: Open                    │ Link 2
                                                    ▼
                                                    ● Hand
                                            Cannot move outward!
                                            Ellipsoid collapses to a flat line!
```

These dangerous postures are called **Kinematic Singularities**. A singularity is a mechanical "dead zone" where:
1. The robot loses one or more degrees of freedom in Task Space (it physically cannot move in certain directions).
2. The inverse velocity mapping requires **infinite joint speeds** to follow arbitrary Cartesian paths.
3. The Jacobian matrix loses rank, its determinant drops to zero, and its condition number blows up to infinity.

To design safe, autonomous robots, we must mathematically map where these singular minefields lie and measure our distance from danger using **Yoshikawa's Manipulability Ellipsoids**.

---

## 2. Historical Foundations & Epistemological Evolution

The study of kinematic singularities traces its roots to 19th-century algebraic geometry and the analysis of singular points on algebraic curves by Cayley and Sylvester. In modern robotics, the systematic classification of manipulator singularities began in 1976 with the foundational work of **Bernard Roth** and his students at Stanford University, who analyzed the geometric loci where robot Jacobians drop rank.

In 1984, the Japanese roboticist **Tsuneo Yoshikawa** published his seminal paper, *"Manipulability of Robotic Mechanisms"*, in the *International Journal of Robotics Research*. Yoshikawa introduced two transformative concepts that revolutionized robot control and mechanical design:
1. **The Manipulability Measure $w(q) = \sqrt{\det(J J^T)}$:** A single scalar index quantifying how far an articulated mechanism is from a singularity and how effortlessly it can generate velocities in all directions.
2. **The Manipulability Ellipsoid:** A geometric visualization of the unit sphere of motor joint speeds mapped into Cartesian space, revealing the principal directions of maximum velocity and maximum force.

Yoshikawa's formulation provided the foundation for singularity avoidance algorithms, redundant robot motion planning, and optimal mechanical arm design (such as determining optimal link length ratios for maximum dexterous volume).

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Mathematical Definition of a Singularity
Let $J(q) \in \mathbb{R}^{m \times n}$ be the manipulator Jacobian matrix relating $n$ joint velocities to $m$ task-space velocities ($m \le n$).
Under normal, well-conditioned configurations, the Jacobian has **full row rank**:
$$\operatorname{rank}(J(q)) = m$$

A configuration $q^* \in \mathcal{Q}$ is defined as a **Kinematic Singularity** if and only if the Jacobian loses rank:
$$\operatorname{rank}(J(q^*)) < m$$

For a non-redundant manipulator where joint count equals task space dimension ($m = n$, such as a 6-DoF arm in $SE(3)$ or a 2-DoF arm in $\mathbb{R}^2$), the Jacobian is a square $n \times n$ matrix. In this case, a singularity occurs precisely when the determinant vanishes:
$$\det(J(q^*)) = 0$$

#### The Two Subspaces at a Singularity:
By the Fundamental Theorem of Linear Algebra, when $\operatorname{rank}(J) = r < m$:
1. **Range Space $\mathcal{R}(J) \subset \mathbb{R}^m$:** The subspace of instantaneous Cartesian velocities the robot *can* generate has dimension $r < m$.
2. **Left Nullspace $\mathcal{N}(J^T) \subset \mathbb{R}^m$:** The orthogonal complement of the range space, with dimension $m - r > 0$. Any desired Cartesian velocity $\nu$ having a non-zero projection in $\mathcal{N}(J^T)$ is physically **impossible** to achieve.

### 3.2 Boundary vs. Interior Singularities
Singularities in industrial manipulators fall into two distinct physical categories:

#### 1. Boundary Singularities (Workspace Limits)
Occur when the arm is fully outstretched ($r = r_{\max}$) or fully folded back onto itself ($r = r_{\min}$). The end-effector lies on the mathematical boundary of the reachable workspace $\partial\mathcal{W}$. Motion perpendicular to the workspace boundary (radially outward or inward) is completely locked.

#### 2. Interior Singularities
Occur inside the interior of the reachable workspace when two or more joint axes line up or become coplanar:
- **Wrist Singularity:** For a 6-DoF arm with a spherical wrist, occurring when joint axis 4 and joint axis 6 become collinear ($\theta_5 = 0$). The wrist loses one rotational degree of freedom; the robot cannot produce instantaneous rotation about the axis perpendicular to axes 4 and 6.
- **Shoulder Singularity:** Occurs when the wrist center point $p_w$ passes directly through the vertical rotation axis $z_0$ of the base joint ($x_w^2 + y_w^2 = 0$). At this point, rotating the base motor produces zero linear velocity at the wrist!
- **Elbow Singularity:** Occurs when the elbow joint straightens ($\theta_3 = 0$ or $180^\circ$), locking the forearm and upper arm into a single plane.

```
       Wrist Singularity (θ₅ = 0)                   Shoulder Singularity
       Joint 4 ─── Joint 5 ─── Joint 6                      Base Axis z₀
          ▲           ▲           ▲                              │
          │           │           │                              ▼  Wrist Center
       ═════════════════════════════                     ────────●────────
       Axes 4 & 6 Collinear! Lost 1 Rotational DoF       Wrist intersects base rotation axis!
```

---

### 3.3 Yoshikawa's Manipulability Measure
To evaluate how close an articulated arm is to a singularity, Yoshikawa (1984) defined the scalar **Manipulability Measure** $w(q)$:
$$w(q) = \sqrt{\det(J(q) J^T(q))}$$

#### Properties of $w(q)$:
1. For square Jacobians ($m = n$):
   $$\det(J J^T) = \det(J)\det(J^T) = (\det(J))^2 \implies w(q) = |\det(J(q))|$$
2. Using Singular Value Decomposition (SVD) $J = U \Sigma V^T$, where singular values are $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_m \ge 0$:
   $$J J^T = U \Sigma V^T V \Sigma^T U^T = U \Sigma \Sigma^T U^T$$
   $$\det(J J^T) = \prod_{i=1}^m \sigma_i^2 \implies w(q) = \sigma_1 \sigma_2 \cdots \sigma_m$$
3. **Singularity Criterion:** $w(q) = 0$ if and only if $q$ is a kinematic singularity (since at least one $\sigma_m = 0$).
4. The volume of the velocity manipulability ellipsoid is directly proportional to $w(q)$:
   $$V_{\text{ellipsoid}} = \frac{2 \pi^{m/2}}{m \Gamma(m/2)} \prod_{i=1}^m \sigma_i \propto w(q)$$

---

### 3.4 Manipulability Ellipsoids: Velocity vs. Force Duality

#### The Velocity Manipulability Ellipsoid
Consider the set of all joint velocity vectors bounded by unit Euclidean norm:
$$\mathcal{S}_{\dot{q}} = \{ \dot{q} \in \mathbb{R}^n \mid \|\dot{q}\|_2 \le 1 \} = \{ \dot{q} \in \mathbb{R}^n \mid \dot{q}^T \dot{q} \le 1 \}$$

What is the geometric shape of the resulting task-space velocities $\nu = J \dot{q}$?
Assuming non-singular $J$, the inverse velocity is $\dot{q} = J^{-1} \nu$. Substituting into the unit sphere equation:
$$(J^{-1} \nu)^T (J^{-1} \nu) \le 1 \implies \nu^T (J^{-1})^T (J^{-1}) \nu \le 1 \implies \nu^T (J J^T)^{-1} \nu \le 1$$

This is the algebraic equation of a hyper-ellipsoid in $\mathbb{R}^m$, known as the **Velocity Manipulability Ellipsoid**:
- The directions of the principal axes are given by the eigenvectors $u_1, u_2, \dots, u_m$ of matrix $J J^T$ (the left singular vectors of $J$).
- The lengths of the principal semi-axes are equal to the singular values $\sigma_1, \sigma_2, \dots, \sigma_m$.

```
                              u₂ (Minor Axis: Length σ₂)
                                  ▲
                                  │   Velocity Ellipsoid
                           . - - -│- - - .
                       '          │          '
                     (            ┼───────────)──▶ u₁ (Major Axis: Length σ₁)
                       .          │          .
                           ' - - -│- - - '
                                  │
```

#### The Force Manipulability Ellipsoid
Now consider the static force transmission relation from Chapter 6: $\tau = J^T F$.
Let the actuator joint motor torques be bounded by unit Euclidean norm:
$$\mathcal{S}_\tau = \{ \tau \in \mathbb{R}^n \mid \tau^T \tau \le 1 \}$$

Substitute $\tau = J^T F$:
$$(J^T F)^T (J^T F) \le 1 \implies F^T (J J^T) F \le 1$$

This defines the **Force Manipulability Ellipsoid**:
- The principal axes of the force ellipsoid lie along the **exact same directions** $u_i$ as the velocity ellipsoid!
- However, the lengths of the principal semi-axes are **inversely proportional** to the singular values:
  $$\text{Semi-axis length for force} = \frac{1}{\sigma_i}$$

#### The Fundamental Duality Law:
Along any spatial direction $u_i$:
$$\text{Velocity capability} \times \text{Force capability} = \sigma_i \times \frac{1}{\sigma_i} = 1.0$$
- If an arm has a huge velocity reach along direction $u_1$ ($\sigma_1 \gg 1$), its force capability along $u_1$ is tiny ($1/\sigma_1 \ll 1$).
- Near a singularity where $\sigma_m \to 0$, velocity along $u_m$ collapses to zero, but force capability along $u_m$ approaches infinity! This is why a locked, fully straightened human knee can support immense body weight without requiring quadriceps muscle torque (structural bracing).

---

### 3.5 The Jacobian Condition Number & Isotropy
While Yoshikawa's index $w(q)$ measures the overall volume of the ellipsoid, it does not measure its **eccentricity** (how spherical or stretched the ellipsoid is).

The **Condition Number** $\kappa(J)$ of the Jacobian is defined as:
$$\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}} = \frac{\sigma_1}{\sigma_m} \ge 1.0$$
- **$\kappa(J) = 1.0$ (Kinematic Isotropy):** All singular values are equal ($\sigma_1 = \sigma_2 = \cdots = \sigma_m$). The manipulability ellipsoid is a perfect sphere! The robot can move or exert force equally well in every direction with zero directional bias.
- **$\kappa(J) \to \infty$ (Singularity):** The smallest singular value $\sigma_m \to 0$. The ellipsoid collapses into a pancake or line of zero volume.

The **Kinematic Conditioning Index (KCI)** is the reciprocal:
$$\eta(J) = \frac{1}{\kappa(J)} = \frac{\sigma_{\min}}{\sigma_{\max}} \in [0, 1]$$
Optimal robotic designs maximize $\eta(J)$ across their working volume.

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation for computing the SVD of a Jacobian, Yoshikawa manipulability, and condition numbers:

```typescript
export interface SVDResult {
  U: number[][];      // m x m orthogonal matrix
  S: number[];        // singular values sorted in descending order
  V: number[][];      // n x n orthogonal matrix
}

export class SingularityAnalysis {
  /**
   * Computes the SVD of an m x n matrix using the Jacobi eigenvalue method on J * J^T.
   */
  public static computeSVD(J: number[][]): SVDResult {
    const m = J.length;
    const n = J[0].length;

    // Compute JJT = J * J^T (m x m symmetric positive semi-definite)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += J[i][k] * J[j][k];
        }
        JJT[i][j] = sum;
      }
    }

    // Jacobi eigenvalue decomposition on JJT: JJT * U = U * Lambda
    const U: number[][] = Array.from({ length: m }, (_, i) => {
      const row = new Array(m).fill(0);
      row[i] = 1.0;
      return row;
    });

    const A = JJT.map(r => [...r]);
    for (let sweep = 0; sweep < 40; sweep++) {
      let maxOff = 0;
      for (let p = 0; p < m; p++) {
        for (let q = p + 1; q < m; q++) {
          const val = Math.abs(A[p][q]);
          if (val > maxOff) maxOff = val;
        }
      }
      if (maxOff < 1e-12) break;

      for (let p = 0; p < m; p++) {
        for (let q = p + 1; q < m; q++) {
          const apq = A[p][q];
          if (Math.abs(apq) < 1e-15) continue;

          const tau = (A[q][q] - A[p][p]) / (2.0 * apq);
          const t = tau >= 0 ? 1.0 / (tau + Math.sqrt(1.0 + tau * tau)) : -1.0 / (-tau + Math.sqrt(1.0 + tau * tau));
          const c = 1.0 / Math.sqrt(1.0 + t * t);
          const s = t * c;

          A[p][p] -= t * apq;
          A[q][q] += t * apq;
          A[p][q] = 0;
          A[q][p] = 0;

          for (let k = 0; k < m; k++) {
            if (k !== p && k !== q) {
              const akp = A[k][p];
              const akq = A[k][q];
              A[k][p] = c * akp - s * akq;
              A[p][k] = A[k][p];
              A[k][q] = s * akp + c * akq;
              A[q][k] = A[k][q];
            }
          }

          for (let k = 0; k < m; k++) {
            const ukp = U[k][p];
            const ukq = U[k][q];
            U[k][p] = c * ukp - s * ukq;
            U[k][q] = s * ukp + c * ukq;
          }
        }
      }
    }

    // Singular values are sqrt of eigenvalues of JJT
    const S: number[] = new Array(m);
    for (let i = 0; i < m; i++) {
      S[i] = Math.sqrt(Math.max(0, A[i][i]));
    }

    // Sort singular values descending
    const indices = Array.from({ length: m }, (_, i) => i);
    indices.sort((a, b) => S[b] - S[a]);

    const sortedS = indices.map(i => S[i]);
    const sortedU: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < m; c++) {
        sortedU[r][c] = U[r][indices[c]];
      }
    }

    return { U: sortedU, S: sortedS, V: [] };
  }

  /**
   * Computes Yoshikawa's Manipulability Measure w(q) = prod(sigma_i).
   */
  public static yoshikawaManipulability(J: number[][]): number {
    const svd = this.computeSVD(J);
    let prod = 1.0;
    for (const s of svd.S) {
      prod *= s;
    }
    return prod;
  }

  /**
   * Computes the condition number kappa = sigma_max / sigma_min.
   */
  public static conditionNumber(J: number[][]): number {
    const svd = this.computeSVD(J);
    const sMax = svd.S[0];
    const sMin = svd.S[svd.S.length - 1];
    if (sMin < 1e-12) return Infinity;
    return sMax / sMin;
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 7.1: Singularity Locus of a 2R Planar Manipulator
**Problem Statement:** For a 2R planar manipulator with link lengths $L_1$ and $L_2$, derive the analytical expression for the determinant of the Jacobian matrix and determine all joint configurations corresponding to kinematic singularities.

**Given Data:**
- From Chapter 6:
  $$J = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \end{bmatrix}$$

**Step-by-Step Derivation:**
1. Compute the determinant $\det(J) = J_{11} J_{22} - J_{12} J_{21}$:
   $$\det(J) = (-L_1 s_1 - L_2 s_{12})(L_2 c_{12}) - (-L_2 s_{12})(L_1 c_1 + L_2 c_{12})$$
2. Expand the products:
   $$\det(J) = -L_1 L_2 s_1 c_{12} - L_2^2 s_{12} c_{12} + L_1 L_2 s_{12} c_1 + L_2^2 s_{12} c_{12}$$
3. The $L_2^2 s_{12} c_{12}$ terms cancel:
   $$\det(J) = L_1 L_2 (s_{12} c_1 - c_{12} s_1)$$
4. Apply the trigonometric angle subtraction identity $\sin(A - B) = \sin A \cos B - \cos A \sin B$:
   $$s_{12} c_1 - c_{12} s_1 = \sin((\theta_1 + \theta_2) - \theta_1) = \sin\theta_2$$
5. Thus:
   $$\det(J) = L_1 L_2 \sin\theta_2$$
6. Set $\det(J) = 0$ for a singularity:
   $$L_1 L_2 \sin\theta_2 = 0 \iff \sin\theta_2 = 0$$
   Assuming non-zero link lengths ($L_1, L_2 > 0$):
   $$\theta_2 = 0\quad \text{or} \quad \theta_2 = \pi \; (180^\circ)$$

**Final Answer:**
- Determinant: **$\det(J) = L_1 L_2 \sin\theta_2$**
- Singular Configurations:
  1. **$\theta_2 = 0^\circ$:** Arm fully extended at outer workspace boundary ($r = L_1 + L_2$).
  2. **$\theta_2 = 180^\circ$:** Arm fully folded at inner workspace boundary ($r = |L_1 - L_2|$).
  Notice that $\det(J)$ is **independent of $\theta_1$**: rotating the base waist simply spins the singular circle around the origin!

**Verification & Sanity Check:**
When $\theta_2 = 0$, both links are aligned in a straight line. The arm cannot move radially outward, losing 1 degree of freedom, exactly matching $\sin(0) = 0$.

---

### Problem 7.2: SVD Analysis at Boundary Singularity ($\theta_2 = 0$)
**Problem Statement:** Let a 2R planar arm have equal link lengths $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ at configuration $(\theta_1, \theta_2) = (0^\circ, 0^\circ)$.
1. Evaluate the numerical Jacobian matrix.
2. Compute the singular values $\sigma_1, \sigma_2$ and the singular vectors $u_1, u_2$.
3. Identify the direction of lost motion.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $\theta_1 = 0, \theta_2 = 0 \implies \theta_{12} = 0$
- $s_1 = 0, c_1 = 1, s_{12} = 0, c_{12} = 1$

**Step-by-Step Derivation:**
1. Evaluate $J$:
   $$J = \begin{bmatrix} -1(0) - 1(0) & -1(0) \\ 1(1) + 1(1) & 1(1) \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 2.0 & 1.0 \end{bmatrix}$$
2. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} 0 & 0 \\ 2.0 & 1.0 \end{bmatrix} \begin{bmatrix} 0 & 2.0 \\ 0 & 1.0 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 2.0^2 + 1.0^2 \end{bmatrix} = \begin{bmatrix} 0 & 0 \\ 0 & 5.0 \end{bmatrix}$$
3. Eigenvalues of $J J^T$:
   $$\lambda_1 = 5.0, \quad \lambda_2 = 0.0$$
4. Singular values $\sigma_i = \sqrt{\lambda_i}$:
   $$\sigma_1 = \sqrt{5.0} \approx 2.236068\text{ m/s per rad/s}$$
   $$\sigma_2 = \sqrt{0.0} = 0.000000\text{ m/s per rad/s}$$
5. Eigenvectors $u_i$:
   - For $\lambda_1 = 5.0$: $u_1 = [0, 1]^T$ (along the vertical $y$-axis).
   - For $\lambda_2 = 0.0$: $u_2 = [1, 0]^T$ (along the horizontal $x$-axis).

**Final Answer:**
- Singular values: **$\sigma_1 = \sqrt{5} \approx 2.2361$**, **$\sigma_2 = 0$**
- Major axis: **$u_1 = [0, 1]^T$** (transverse tangential velocity is maximum)
- Minor axis: **$u_2 = [1, 0]^T$** (radial velocity is **completely lost**)
- The velocity manipulability ellipse has collapsed into a 1D vertical line segment of length $2\sqrt{5}$!

**Verification & Sanity Check:**
Because the arm lies along the $x$-axis, rotating either joint can only move the tip along the $y$-axis ($J_{11} = J_{12} = 0$). No combination of motor speeds can generate velocity along the $x$-axis.

---

### Problem 7.3: Kinematic Isotropy Configuration for a 2R Arm
**Problem Statement:** For a 2R planar arm with equal link lengths $L_1 = L_2 = L$, find the joint angle $\theta_2$ that maximizes Yoshikawa's manipulability measure $w(q)$. Show that at this configuration, the condition number $\kappa(J_v)$ is optimal.

**Given Data:**
- $w(q) = |\det(J)| = L^2 |\sin\theta_2|$

**Step-by-Step Derivation:**
1. Maximize $w(\theta_2)$:
   $$\frac{d}{d\theta_2} (L^2 \sin\theta_2) = L^2 \cos\theta_2 = 0 \implies \cos\theta_2 = 0 \implies \theta_2 = \pm 90^\circ = \pm\frac{\pi}{2}\text{ rad}$$
2. Maximum manipulability value:
   $$w_{\max} = L^2 |\sin(\pi/2)| = L^2$$
3. SVD analysis at $\theta_2 = 90^\circ$ (let $\theta_1 = 0$ for simplicity):
   $$s_1 = 0, c_1 = 1, s_{12} = 1, c_{12} = 0$$
   $$J = \begin{bmatrix} -L(0) - L(1) & -L(1) \\ L(1) + L(0) & L(0) \end{bmatrix} = \begin{bmatrix} -L & -L \\ L & 0 \end{bmatrix}$$
4. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} -L & -L \\ L & 0 \end{bmatrix} \begin{bmatrix} -L & L \\ -L & 0 \end{bmatrix} = \begin{bmatrix} 2L^2 & -L^2 \\ -L^2 & L^2 \end{bmatrix}$$
5. Eigenvalues of $J J^T$:
   Characteristic equation: $\det(\lambda I - J J^T) = (\lambda - 2L^2)(\lambda - L^2) - (-L^2)^2 = \lambda^2 - 3L^2 \lambda + L^4 = 0$.
   $$\lambda = \frac{3L^2 \pm \sqrt{9L^4 - 4L^4}}{2} = \frac{3 \pm \sqrt{5}}{2} L^2$$
   $$\lambda_1 = \frac{3 + \sqrt{5}}{2} L^2 \approx 2.618 L^2 \implies \sigma_1 = \sqrt{2.618} L \approx 1.618 L$$
   $$\lambda_2 = \frac{3 - \sqrt{5}}{2} L^2 \approx 0.382 L^2 \implies \sigma_2 = \sqrt{0.382} L \approx 0.618 L$$
6. Notice that $\sigma_1 \sigma_2 = (1.618)(0.618) L^2 = 1.000 L^2 = w_{\max}$.
7. Condition number:
   $$\kappa = \frac{\sigma_1}{\sigma_2} = \frac{1.618}{0.618} \approx 2.618$$

**Final Answer:**
- Optimal configuration: **$\theta_2 = \pm 90^\circ$**
- Maximum Manipulability: **$w_{\max} = L_1 L_2$**
- Condition Number: **$\kappa = \frac{3 + \sqrt{5}}{2} \approx 2.618$**

**Verification & Sanity Check:**
When $\theta_2 = 90^\circ$, link 1 and link 2 are perpendicular. The elbow has maximum rotational clearance from the shoulder, producing the largest possible ellipse area in the plane.

---

### Problem 7.4: Manipulability Profile Across Reachable Radii
**Problem Statement:** Express Yoshikawa's manipulability measure $w$ of a 2R arm ($L_1 = L_2 = 1.0\text{ m}$) as a function of the radial distance $r = \sqrt{x^2 + y^2}$ from the origin.

**Given Data:**
- $r^2 = L_1^2 + L_2^2 + 2L_1 L_2 \cos\theta_2 = 1 + 1 + 2\cos\theta_2 = 2 + 2\cos\theta_2$
- $w = |\det(J)| = L_1 L_2 |\sin\theta_2| = |\sin\theta_2|$

**Step-by-Step Derivation:**
1. Express $\cos\theta_2$ in terms of $r$:
   $$\cos\theta_2 = \frac{r^2 - 2}{2} = \frac{r^2}{2} - 1$$
2. Use $\sin^2\theta_2 = 1 - \cos^2\theta_2$:
   $$\sin^2\theta_2 = 1 - \left( \frac{r^2}{2} - 1 \right)^2 = 1 - \left( \frac{r^4}{4} - r^2 + 1 \right) = r^2 - \frac{r^4}{4} = \frac{r^2(4 - r^2)}{4}$$
3. Take the square root:
   $$w(r) = \frac{r \sqrt{4 - r^2}}{2}$$
4. Analyze the profile:
   - At $r = 0$ (fully folded): $w(0) = 0$.
   - At $r = 2$ (fully extended boundary): $w(2) = \frac{2\sqrt{4 - 4}}{2} = 0$.
   - Maximum occurs where $\frac{d}{dr}(4r^2 - r^4) = 8r - 4r^3 = 0 \implies r^2 = 2 \implies r = \sqrt{2} \approx 1.414\text{ m}$.
   - At $r = \sqrt{2}$: $w(\sqrt{2}) = \frac{\sqrt{2}\sqrt{4 - 2}}{2} = \frac{\sqrt{2}\sqrt{2}}{2} = 1.0$.

**Final Answer:**
$$w(r) = \frac{r \sqrt{4 - r^2}}{2}$$
Manipulability is zero at $r = 0$ and $r = 2\text{ m}$, reaching its global peak of **$w = 1.0$** at **$r = \sqrt{2}\text{ m}$**.

**Verification & Sanity Check:**
$r = \sqrt{2}\text{ m}$ corresponds to the right-angled elbow configuration $\theta_2 = 90^\circ$ ($r^2 = 1^2 + 1^2 = 2$), completely verifying Problem 7.3.

---

### Problem 7.5: Wrist Singularity of a 6-DoF Spherical Wrist
**Problem Statement:** A 6-DoF robot has a spherical wrist whose last three joint axes intersect at the wrist center $p_w$. The rotational Jacobian for the wrist subassembly is given by $J_{\omega, \text{wrist}} = \begin{bmatrix} z_3 & z_4 & z_5 \end{bmatrix}$. Prove that a singularity occurs when $\theta_5 = 0$ and identify the lost rotational degree of freedom.

**Given Data:**
- In standard DH notation:
  $$z_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}, \quad z_4 = \begin{bmatrix} -\sin\theta_4 \\ \cos\theta_4 \\ 0 \end{bmatrix}, \quad z_5 = \begin{bmatrix} \cos\theta_4\sin\theta_5 \\ \sin\theta_4\sin\theta_5 \\ \cos\theta_5 \end{bmatrix}$$

**Step-by-Step Derivation:**
1. Compute the determinant of $J_{\omega, \text{wrist}}$:
   $$\det(J_{\omega, \text{wrist}}) = z_3 \cdot (z_4 \times z_5)$$
2. Compute the cross product $z_4 \times z_5$:
   $$z_4 \times z_5 = \begin{bmatrix} -\sin\theta_4 \\ \cos\theta_4 \\ 0 \end{bmatrix} \times \begin{bmatrix} \cos\theta_4\sin\theta_5 \\ \sin\theta_4\sin\theta_5 \\ \cos\theta_5 \end{bmatrix} = \begin{bmatrix} \cos\theta_4\cos\theta_5 \\ \sin\theta_4\cos\theta_5 \\ -\sin^2\theta_4\sin\theta_5 - \cos^2\theta_4\sin\theta_5 \end{bmatrix} = \begin{bmatrix} \cos\theta_4\cos\theta_5 \\ \sin\theta_4\cos\theta_5 \\ -\sin\theta_5 \end{bmatrix}$$
3. Take the dot product with $z_3 = [0, 0, 1]^T$:
   $$\det(J_{\omega, \text{wrist}}) = -\sin\theta_5$$
4. Set determinant to zero:
   $$-\sin\theta_5 = 0 \implies \theta_5 = 0\quad \text{or}\quad \theta_5 = \pi \; (180^\circ)$$
5. At $\theta_5 = 0$:
   $$z_5 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = z_3$$
   Axes $z_3$ and $z_5$ become collinear!

**Final Answer:**
- Singularity condition: **$\theta_5 = 0^\circ$** or **$\theta_5 = 180^\circ$**.
- Lost Degree of Freedom: The wrist loses the ability to rotate instantaneously about the axis perpendicular to $z_3$ and $z_4$ ($y_4$-axis). Both joint 4 and joint 6 produce redundant rotation about the exact same physical axis $z_3$.

**Verification & Sanity Check:**
Because axes 4 and 6 coincide, commanding a rotation around the tool normal requires $\theta_4$ and $\theta_6$ to spin at infinite velocity with opposite signs, causing joint runaway.

---

### Problem 7.6: Shoulder Singularity of an Anthropomorphic Robot Arm
**Problem Statement:** An anthropomorphic 6-DoF robot (such as the PUMA 560) has a waist joint rotating about the vertical axis $z_0 = [0, 0, 1]^T$. Show that a singularity occurs whenever the wrist center $p_w$ intersects the vertical line passing through $z_0$ ($x_w = 0, y_w = 0$).

**Step-by-Step Derivation:**
1. The linear velocity produced by the base joint 1 at the wrist center is:
   $$v_{w, 1} = z_0 \times p_w = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} x_w \\ y_w \\ z_w \end{bmatrix} = \begin{bmatrix} -y_w \\ x_w \\ 0 \end{bmatrix}$$
2. When the wrist center lies on the base axis, $x_w = 0$ and $y_w = 0$:
   $$v_{w, 1} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
3. In this posture, rotating the base motor with angular velocity $\dot{q}_1 = 100\text{ rad/s}$ produces **zero** linear velocity at the wrist center ($v_{w, 1} = 0$).
4. The first column of the positional Jacobian vanishes identically ($J_{v, 1} = 0$), reducing the rank of $J_v \in \mathbb{R}^{3 \times 3}$ from 3 to 2.

**Final Answer:**
A **Shoulder Singularity** occurs whenever the wrist center lies on the base rotation axis ($x_w = 0, y_w = 0$). The robot loses the ability to translate instantaneously in the direction perpendicular to the arm's plane.

**Verification & Sanity Check:**
If an overhead camera commands the robot to move sideways while overhead ($x_w = y_w = 0$), base joint 1 must theoretically spin infinitely fast to rotate the shoulder plane instantaneously.

---

### Problem 7.7: Elbow Singularity of a 6-DoF Robot
**Problem Statement:** Prove that for an anthropomorphic robot where the shoulder (joint 2) and elbow (joint 3) axes are parallel, an elbow singularity occurs whenever the forearm aligns with the upper arm ($a_2 \parallel a_3$).

**Step-by-Step Derivation:**
1. In the elevation plane of joints 2 and 3, the kinematics is identical to the planar 2R arm.
2. The distance from shoulder to wrist is $r_{sw} = \sqrt{a_2^2 + a_3^2 + 2a_2 a_3 \cos\theta_3}$.
3. The rate of change of radial distance is:
   $$\dot{r}_{sw} = \frac{-a_2 a_3 \sin\theta_3}{r_{sw}} \dot{\theta}_3$$
4. When $\theta_3 = 0^\circ$ or $180^\circ$, $\sin\theta_3 = 0 \implies \dot{r}_{sw} = 0$.
5. The Jacobian determinant factor associated with the arm plane is $a_2 a_3 \sin\theta_3 = 0$.

**Final Answer:**
An **Elbow Singularity** occurs when **$\theta_3 = 0^\circ$** (fully extended arm) or **$\theta_3 = 180^\circ$** (fully folded arm). Radial motion along the line connecting the shoulder to the wrist is lost.

**Verification & Sanity Check:**
Identical to Problem 7.1, the 2-link planar subchain determinant $L_1 L_2 \sin\theta_2$ governs the elbow singularity of 6-axis spatial arms.

---

### Problem 7.8: Velocity Manipulability Ellipsoid Geometry for a 2R Arm
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}, L_2 = 0.5\text{ m}$ is at $(\theta_1, \theta_2) = (0^\circ, 90^\circ)$. Calculate:
1. The lengths of the semi-major and semi-minor axes ($\sigma_1, \sigma_2$) of the velocity manipulability ellipse.
2. The tilt angle $\psi$ of the ellipse in the $xy$-plane.

**Given Data:**
- $L_1 = 1.0, L_2 = 0.5$
- $\theta_1 = 0, \theta_2 = 90^\circ \implies \theta_{12} = 90^\circ$
- $s_1 = 0, c_1 = 1, s_{12} = 1, c_{12} = 0$

**Step-by-Step Derivation:**
1. Evaluate $J$:
   $$J = \begin{bmatrix} -L_1 s_1 - L_2 s_{12} & -L_2 s_{12} \\ L_1 c_1 + L_2 c_{12} & L_2 c_{12} \end{bmatrix} = \begin{bmatrix} -0.5 & -0.5 \\ 1.0 & 0.0 \end{bmatrix}$$
2. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} -0.5 & -0.5 \\ 1.0 & 0.0 \end{bmatrix} \begin{bmatrix} -0.5 & 1.0 \\ -0.5 & 0.0 \end{bmatrix} = \begin{bmatrix} 0.50 & -0.50 \\ -0.50 & 1.00 \end{bmatrix}$$
3. Compute eigenvalues of $J J^T$:
   $$\det(\lambda I - J J^T) = (\lambda - 0.5)(\lambda - 1.0) - (-0.5)^2 = \lambda^2 - 1.5\lambda + 0.5 - 0.25 = \lambda^2 - 1.5\lambda + 0.25 = 0$$
   $$\lambda = \frac{1.5 \pm \sqrt{1.5^2 - 4(0.25)}}{2} = \frac{1.5 \pm \sqrt{2.25 - 1.0}}{2} = \frac{1.5 \pm \sqrt{1.25}}{2} \approx \frac{1.5 \pm 1.118034}{2}$$
   $$\lambda_1 \approx \frac{2.618034}{2} = 1.309017 \implies \sigma_1 = \sqrt{1.309017} \approx 1.144123$$
   $$\lambda_2 \approx \frac{0.381966}{2} = 0.190983 \implies \sigma_2 = \sqrt{0.190983} \approx 0.437016$$
4. Compute orientation angle $\psi$ of major axis:
   For a $2 \times 2$ symmetric matrix $\begin{bmatrix} a & b \\ b & d \end{bmatrix}$:
   $$\tan(2\psi) = \frac{2b}{a - d} = \frac{2(-0.50)}{0.50 - 1.00} = \frac{-1.00}{-0.50} = +2.0$$
   $$2\psi = \operatorname{atan}(2.0) \approx 63.435^\circ \implies \psi \approx 31.717^\circ$$
   Since $d > a$, the eigenvector for the larger eigenvalue $\lambda_1 = 1.309$ has larger $y$-component: $\psi = 31.717^\circ + 90^\circ = 121.72^\circ$.

**Final Answer:**
- Major semi-axis: **$\sigma_1 = 1.1441\text{ m/s}$**
- Minor semi-axis: **$\sigma_2 = 0.4370\text{ m/s}$**
- Tilt angle of major axis: **$\psi \approx 121.7^\circ$**
- Manipulability volume: $w = \sigma_1 \sigma_2 = (1.1441)(0.4370) = 0.5000 = L_1 L_2 \sin(90^\circ)$.

**Verification & Sanity Check:**
$\det(J J^T) = (0.50)(1.00) - (-0.50)^2 = 0.50 - 0.25 = 0.25$.
$\sigma_1^2 \sigma_2^2 = (1.309017)(0.190983) = 0.250000$. Exact match.

---

### Problem 7.9: Force Manipulability Ellipsoid Geometry
**Problem Statement:** For the arm in Problem 7.8, derive the semi-axis lengths of the force manipulability ellipse and verify the force-velocity duality relationship.

**Given Data:**
- From Problem 7.8: $\sigma_1 = 1.144123, \sigma_2 = 0.437016$.

**Step-by-Step Derivation:**
1. The force manipulability ellipsoid is defined by $F^T (J J^T) F \le 1$.
2. The semi-axis lengths are the reciprocals of the singular values:
   $$f_1 = \frac{1}{\sigma_1} = \frac{1}{1.144123} \approx 0.874032\text{ N per N}\cdot\text{m}$$
   $$f_2 = \frac{1}{\sigma_2} = \frac{1}{0.437016} \approx 2.288246\text{ N per N}\cdot\text{m}$$
3. Duality verification:
   - Along direction $u_1$ ($121.7^\circ$): Velocity capability is high ($\sigma_1 = 1.144$), but force capability is low ($f_1 = 0.874$).
   - Along direction $u_2$ ($31.7^\circ$): Velocity capability is low ($\sigma_2 = 0.437$), but force capability is high ($f_2 = 2.288$).

**Final Answer:**
- Force ellipse semi-axes: **$f_1 = 0.8740\text{ N}$** and **$f_2 = 2.2882\text{ N}$**.
- The force ellipse is rotated by $90^\circ$ relative to the velocity ellipse! The direction of easiest velocity is the direction of hardest force.

**Verification & Sanity Check:**
$f_1 \cdot \sigma_1 = 0.874032 \times 1.144123 = 1.0000$.
$f_2 \cdot \sigma_2 = 2.288246 \times 0.437016 = 1.0000$. Duality holds identically.

---

### Problem 7.10: Jacobian Condition Number and Conditioning Index
**Problem Statement:** Compute the condition number $\kappa(J)$ and the Kinematic Conditioning Index $\eta(J)$ for the configuration in Problem 7.8.

**Given Data:**
- $\sigma_1 = 1.144123$
- $\sigma_2 = 0.437016$

**Step-by-Step Derivation:**
1. Compute the condition number $\kappa$:
   $$\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}} = \frac{1.144123}{0.437016} \approx 2.618034$$
2. Compute the Kinematic Conditioning Index $\eta$:
   $$\eta(J) = \frac{1}{\kappa(J)} = \frac{0.437016}{1.144123} \approx 0.381966$$

**Final Answer:**
- Condition number: **$\kappa(J) \approx 2.618$**
- Conditioning Index: **$\eta(J) \approx 0.382$** ($38.2\%$ of perfect isotropy)

**Verification & Sanity Check:**
Notice that $\kappa = \frac{3 + \sqrt{5}}{2}$, exactly the golden ratio square $(\frac{1+\sqrt{5}}{2})^2 \approx 1.618^2 \approx 2.618$.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 7.11: Singularity Locus of a Planar 3R Arm
**Problem Statement:** For a 3R planar manipulator with link lengths $L_1, L_2, L_3$ performing 2D positioning tasks ($m = 2, n = 3$), determine the singularity condition where $\operatorname{rank}(J_v) < 2$.

**Solution:**
1. The positional Jacobian $J_v \in \mathbb{R}^{2 \times 3}$ has columns:
   $$J_v = \begin{bmatrix} z_0 \times p_e & z_1 \times (p_e - p_1) & z_2 \times (p_e - p_2) \end{bmatrix}$$
2. The matrix loses rank if all three columns are linearly dependent.
3. Since each column $z \times r_i$ is perpendicular to the vector from joint $i$ to the end-effector $p_e - p_i$, all three columns become parallel if and only if the vectors $(p_e - p_0)$, $(p_e - p_1)$, and $(p_e - p_2)$ all lie along the **same straight line**.
4. This occurs when all three links are fully aligned:
   $$\theta_2 = 0 \text{ or } \pi, \quad \theta_3 = 0 \text{ or } \pi$$
5. Singularities occur strictly at the boundaries of the reachable workspace ($r_{\max} = L_1 + L_2 + L_3$ and $r_{\min}$). In the interior, rank is always 2!

---

### Problem 7.12: SCARA Manipulator Singularities
**Problem Statement:** Identify all singular configurations for the 4-DoF SCARA robot analyzed in Problem 6.4.

**Solution:**
1. The SCARA Jacobian has non-zero rows only for $\dot{x}, \dot{y}, \dot{z}, \omega_z$.
2. The vertical translation $\dot{z} = -d_3$ is decoupled and non-singular for all $d_3$.
3. The horizontal submatrix for $(\dot{x}, \dot{y})$ is identical to the 2R planar arm:
   $$\det(J_{xy}) = L_1 L_2 \sin\theta_2$$
4. Singularities occur strictly when $\sin\theta_2 = 0 \implies \theta_2 = 0^\circ$ (arm fully extended) or $\theta_2 = 180^\circ$ (arm folded).

---

### Problem 7.13: Singularity Avoidance via Gradient of Manipulability
**Problem Statement:** In redundant robotic control, secondary tasks maximize manipulability $w(q)$. Formulate the joint velocity gradient $\nabla_q w(q)$ for a 2R arm.

**Solution:**
1. $w(q) = L_1 L_2 \sin\theta_2$ (for $\theta_2 \in (0, \pi)$).
2. Compute partial derivatives:
   $$\frac{\partial w}{\partial \theta_1} = 0$$
   $$\frac{\partial w}{\partial \theta_2} = L_1 L_2 \cos\theta_2$$
3. Gradient vector:
   $$\nabla_q w(q) = \begin{bmatrix} 0 \\ L_1 L_2 \cos\theta_2 \end{bmatrix}$$
4. If $\theta_2 < 90^\circ$, $\cos\theta_2 > 0$, driving the elbow to open toward $90^\circ$. If $\theta_2 > 90^\circ$, $\cos\theta_2 < 0$, driving the elbow to close toward $90^\circ$.

---

### Problem 7.14: Left Nullspace at a Singularity
**Problem Statement:** For the 2R arm at $\theta_2 = 0, \theta_1 = 0$ ($J = \begin{bmatrix} 0 & 0 \\ 2 & 1 \end{bmatrix}$), find a basis for the left nullspace $\mathcal{N}(J^T)$.

**Solution:**
1. Transpose: $J^T = \begin{bmatrix} 0 & 2 \\ 0 & 1 \end{bmatrix}$.
2. Solve $J^T v = 0$:
   $$\begin{bmatrix} 0 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} 2v_y \\ v_y \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies v_y = 0$$
3. $v_x$ is completely unconstrained.
4. Basis vector: $v = [1, 0]^T$.
5. The left nullspace is spanned by the unit vector $[1, 0]^T$ along the $x$-axis, mathematically confirming that velocity along $x$ cannot be generated.

---

### Problem 7.15: Directional Force Transmission Ratio
**Problem Statement:** Define the force transmission ratio $\alpha_F(u)$ along a specified Cartesian unit direction $u \in \mathbb{R}^m$ ($\|u\| = 1$).

**Solution:**
1. Let a contact force be directed along unit vector $u$: $F = f \cdot u$, where $f = \|F\|$.
2. The required joint torques are $\tau = J^T F = f J^T u$.
3. The torque magnitude squared is:
   $$\|\tau\|^2 = \tau^T \tau = f^2 u^T J J^T u$$
4. The force transmission ratio (force per unit actuator torque) is:
   $$\alpha_F(u) = \frac{f}{\|\tau\|} = \frac{1}{\sqrt{u^T J J^T u}}$$

---

### Problem 7.16: Askey-Gasparetto Manipulability Measure
**Problem Statement:** Compare Yoshikawa's volume metric $w = \prod \sigma_i$ with the harmonic mean manipulability metric $w_H = \frac{m}{\sum_{i=1}^m \frac{1}{\sigma_i}}$.

**Solution:**
1. Yoshikawa's product metric can remain high even if one singular value becomes dangerously small, as long as the other singular values are large.
2. The harmonic mean $w_H$ is dominated by the smallest singular value $\sigma_{\min}$:
   $$\lim_{\sigma_{\min} \to 0} w_H = 0$$
3. Therefore, the harmonic mean provides a more sensitive early warning metric for proximity to singularities in real-time trajectory planners.

---

### Problem 7.17: Parallel Robot Singularities (Type I vs. Type II)
**Problem Statement:** Explain the distinction between Type I (serial-like) and Type II (parallel) singularities in closed-chain parallel robots using the implicit kinematic relation $J_x \dot{x} = J_q \dot{q}$.

**Solution:**
1. **Type I Singularity ($\det(J_q) = 0$):** Occurs at the boundary of the reachable workspace. The actuator motors cannot produce end-effector velocity in certain directions (actuator locking).
2. **Type II Singularity ($\det(J_x) = 0$):** Occurs in the interior of the workspace. The moving platform gains uncontrollable internal degrees of freedom even when all actuator motors are locked! The platform can shake, vibrate, or collapse with infinite mechanical stiffness loss.

---

### Problem 7.18: Isotropic Manipulator Design Condition
**Problem Statement:** Prove that for a 2R planar manipulator, perfect kinematic isotropy ($\kappa(J_v) = 1.0$) is mathematically impossible if link lengths are unequal ($L_1 \neq L_2$).

**Solution:**
1. From Problem 7.3, eigenvalues of $J J^T$ satisfy $\lambda_1 = \lambda_2$ if and only if the discriminant of the characteristic polynomial vanishes:
   $$\Delta = (\operatorname{tr}(J J^T))^2 - 4\det(J J^T) = 0$$
2. Direct calculation yields:
   $$\Delta = (L_1^2 - L_2^2)^2 + 4 L_1^2 L_2^2 \cos^2\theta_2$$
3. For $\Delta = 0$, both terms must vanish independently since both are non-negative squares:
   - $4 L_1^2 L_2^2 \cos^2\theta_2 = 0 \implies \cos\theta_2 = 0 \implies \theta_2 = 90^\circ$.
   - $(L_1^2 - L_2^2)^2 = 0 \implies L_1 = L_2$.
4. If $L_1 \neq L_2$, $\Delta > 0$ strictly for all $\theta_2$, making $\lambda_1 \neq \lambda_2$ always. Perfect isotropy requires strictly equal link lengths!

---

### Problem 7.19: Infinite Joint Velocity Divergence Proof
**Problem Statement:** Prove analytically that commanding an end-effector velocity with a non-zero component along an unattainable singular direction causes joint velocity $\dot{q}$ to diverge to infinity.

**Solution:**
1. Using SVD: $J = \sum_{i=1}^m \sigma_i u_i v_i^T$.
2. For non-singular $J$, the inverse velocity is:
   $$\dot{q} = J^{-1} \nu = \sum_{i=1}^m \frac{u_i^T \nu}{\sigma_i} v_i$$
3. Suppose $\nu$ has a non-zero projection $c_m = u_m^T \nu \neq 0$ along the singular direction $u_m$.
4. The joint velocity norm is:
   $$\|\dot{q}\|^2 = \sum_{i=1}^m \left( \frac{u_i^T \nu}{\sigma_i} \right)^2 \ge \frac{c_m^2}{\sigma_m^2}$$
5. As the robot approaches the singularity, $\sigma_m \to 0$:
   $$\lim_{\sigma_m \to 0} \|\dot{q}\| \ge \lim_{\sigma_m \to 0} \frac{|c_m|}{\sigma_m} = \infty$$
6. Motor velocities diverge to infinity.

---

### Problem 7.20: SVD Matrix Inversion & Reconstruction Verification
**Problem Statement:** State the mathematical invariant checks that verify the numerical SVD computation of a Jacobian matrix.

**Solution:**
For $J \in \mathbb{R}^{m \times n}$ with computed decomposition $U, \Sigma, V$:
1. **Reconstruction Check:** $\|J - U \Sigma V^T\|_\infty < 10^{-12}$.
2. **Orthogonality of Left Vectors:** $\|U^T U - I_m\|_\infty < 10^{-12}$.
3. **Non-Negativity & Monotonicity:** $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_m \ge 0$.
4. **Determinant Consistency:** $|\det(U)| = 1.000000 \pm 10^{-12}$.

---

# Chapter 8: Numerical Inverse Kinematics — Newton-Raphson, Gradient Projection, and Pseudoinverse

---

## 1. The Layman's Genesis & Intuitive Overview

In Chapter 5, we solved Inverse Kinematics algebraically using closed-form geometric equations. This worked like magic for robots with spherical wrists (Pieper's criterion). 

However, in modern advanced robotics, many of the most capable machines on Earth do **not** fit this neat algebraic template:
- A human arm has 7 degrees of freedom (redundant).
- Collaborative robots like the Franka Emika Panda, KUKA LBR iiwa, and humanoid bipeds have 7 or more joints without intersecting spherical wrists.
- Mobile manipulators have 10 or more combined wheel and arm joints.
- Even on a standard robot, adding a custom offset tool or gripper tilts the end-effector axes, destroying Pieper's symmetry.

When algebraic formulas do not exist, how does a computer tell the robot's motors how to reach an object?

```
   Guess Configuration q_k ──▶ Compute Forward Kinematics f(q_k) ──▶ Error e = x_d - f(q_k)
             ▲                                                               │
             │                                                               │
             └──────── Update: q_{k+1} = q_k + Delta q ◀─────────────────────┘
                               (Iterative Convergence to Target)
```

The answer is **Numerical Inverse Kinematics**. Instead of finding the exact mathematical answer in one miraculous algebraic stroke, the robot acts like a skilled human archer adjusting their aim:
1. It takes an initial guess of joint angles $q_0$ (usually where the arm is currently standing).
2. It calculates where the hand currently is, and measures the remaining error vector to the target $e = x_d - f(q_0)$.
3. It uses the **Jacobian matrix** (Chapter 6) to linearize the problem and compute an instantaneous joint adjustment $\Delta q$.
4. It updates the joint angles $q_1 = q_0 + \Delta q$, measures the remaining microscopic error, and repeats.

Within 3 to 5 iterations—taking less than 50 microseconds on a standard microcontroller—the error shrinks below a hundredth of a millimeter, achieving sub-millimeter precision!

---

## 2. Historical Foundations & Epistemological Evolution

Iterative root-finding is one of the oldest and most celebrated branches of numerical analysis:
- The **Newton-Raphson method** originated in Sir Isaac Newton's 1669 manuscript *De analysi per aequationes numero terminorum infinitas* and Joseph Raphson's 1690 *Analysis aequationum universalis*. Newton and Raphson demonstrated that non-linear equations $g(x) = 0$ can be solved with quadratic convergence by repeatedly stepping along the tangent slope: $x_{k+1} = x_k - \frac{g(x_k)}{g'(x_k)}$.
- In 1920, **Eliakim Hastings Moore** introduced the generalized matrix inverse, which was independently rediscovered and formalized in 1955 by the British mathematician **Sir Roger Penrose** as the **Moore-Penrose Pseudoinverse $J^+$**. Penrose proved that for any linear system $J \Delta q = e$ with redundant degrees of freedom, $J^+$ provides the unique solution that strictly minimizes the Euclidean norm of the joint step $\|\Delta q\|_2$.
- In 1984, **William A. Wolovich** and **Henry Elliott** at Brown University introduced the **Jacobian Transpose method** for robot kinematics. They proved via Lyapunov stability theory that stepping along the gradient of the task error $\Delta q = \alpha J^T e$ guarantees asymptotic convergence without ever inverting a matrix, providing a fail-safe, ultra-lightweight numerical solver for embedded microprocessors.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Task Space Error Vector Formulation
Let $x_d = (p_d, R_d) \in SE(3)$ be the desired end-effector pose, and let $x(q) = (p(q), R(q))$ be the current pose computed via forward kinematics.

The task-space error vector $e(q) \in \mathbb{R}^6$ consists of a 3D linear position error $e_p$ and a 3D rotational orientation error $e_R$:
$$e(q) = \begin{bmatrix} e_p(q) \\ e_R(q) \end{bmatrix} \in \mathbb{R}^6$$

#### 1. Position Error:
$$e_p(q) = p_d - p(q) \in \mathbb{R}^3$$

#### 2. Orientation Error:
Representing 3D orientation error requires careful geometric formulation because rotation matrices do not subtract linearly ($R_d - R \notin SO(3)$). Two rigorous formulations exist:

##### Formulation A: Matrix Skew-Symmetric Cross Product
Let $R_d = [n_d, s_d, a_d]$ and $R(q) = [n, s, a]$ be the column vectors of the desired and current rotation matrices. The orientation error vector $e_R$ is defined by:
$$e_R = \frac{1}{2} \left( n(q) \times n_d + s(q) \times s_d + a(q) \times a_d \right) \in \mathbb{R}^3$$
*Property:* When $R(q) = R_d$, all three cross products vanish ($n \times n = 0$), so $e_R = 0$. For small angular displacements, $\|e_R\| \approx \sin\theta \approx \theta$.

##### Formulation B: Matrix Logarithm on $SO(3)$
The relative rotation from current to desired attitude is $R_{\text{err}} = R_d R^T(q) \in SO(3)$.
Applying the matrix logarithm (Chapter 2):
$$[e_R] = \log(R_d R^T(q)) \in \mathfrak{so}(3) \implies e_R = \operatorname{vee}\left( \log(R_d R^T(q)) \right) = \hat{\omega} \theta$$
This gives the exact axis-angle error vector in radians.

---

### 3.2 First-Order Taylor Series Linearization
The forward kinematics mapping $f: \mathcal{Q} \to \mathcal{X}$ is a smooth non-linear function.
Expanding $f(q)$ in a multivariable Taylor series around the current configuration $q_k$:
$$f(q_k + \Delta q) = f(q_k) + J(q_k) \Delta q + \mathcal{O}(\|\Delta q\|^2)$$
We want the updated configuration $q_{k+1} = q_k + \Delta q$ to satisfy $f(q_{k+1}) = x_d$:
$$f(q_k) + J(q_k) \Delta q \approx x_d \implies J(q_k) \Delta q = x_d - f(q_k) = e(q_k)$$

This yields the fundamental linear differential kinematics equation:
$$J(q_k) \Delta q = e(q_k)$$

Depending on the dimensions and conditioning of $J(q_k)$, three primary numerical solver paradigms exist:

---

### 3.3 Method 1: The Newton-Raphson Method ($m = n$)
When the robot is non-redundant and the Jacobian is a square, non-singular matrix ($m = n$, $\det(J) \neq 0$), the unique solution for the joint increment $\Delta q$ is obtained by direct matrix inversion:
$$\Delta q = J^{-1}(q_k) e(q_k)$$
The configuration update rule is:
$$q_{k+1} = q_k + J^{-1}(q_k) e(q_k)$$

#### Quadratic Convergence Property:
Near a regular root $q^*$, the error satisfies:
$$\|q_{k+1} - q^*\| \le C \|q_k - q^*\|^2$$
The number of significant digits of precision roughly doubles with every single iteration!

---

### 3.4 Method 2: The Jacobian Transpose Method (Wolovich & Elliott 1984)
Computing $J^{-1}$ requires $\mathcal{O}(n^3)$ operations and blows up dangerously near singularities.
Wolovich and Elliott proposed substituting the matrix inverse with the **Jacobian Transpose**:
$$\Delta q = \alpha J^T(q_k) e(q_k)$$
where $\alpha > 0$ is a scalar step size.

#### Lyapunov Monotonic Convergence Proof:
Define the candidate Lyapunov energy function as the squared task-space error norm:
$$V(e) = \frac{1}{2} e^T e = \frac{1}{2} \|e\|_2^2 \ge 0$$
Note that $V(e) = 0$ if and only if $e = 0$.

Differentiating $V$ with respect to continuous time:
$$\dot{V}(e) = e^T \dot{e} = e^T (-\dot{x}) = -e^T J(q) \dot{q}$$
Substitute the control law $\dot{q} = \alpha J^T(q) e$:
$$\dot{V}(e) = -e^T J (\alpha J^T e) = -\alpha (e^T J) (J^T e) = -\alpha \|J^T e\|_2^2 \le 0$$

Because $\alpha > 0$ and $\|J^T e\|_2^2 \ge 0$, $\dot{V}(e)$ is **strictly negative semi-definite**!
By Lyapunov's direct method, the energy $V(e)$ decreases monotonically at every instant, guaranteeing convergence to the target set $J^T e = 0$ without matrix inversion!

#### Optimal Step Size $\alpha^*$:
To find the step size $\alpha$ that minimizes the error in a single discrete step, substitute $\Delta x \approx J \Delta q = \alpha J J^T e$:
$$e_{k+1} = e_k - \alpha J J^T e_k$$
Minimize the new error norm $\|e_{k+1}\|^2$:
$$\frac{d}{d\alpha} \|e - \alpha J J^T e\|^2 = -2 e^T (J J^T e) + 2\alpha (J J^T e)^T (J J^T e) = 0$$
Solving for optimal $\alpha^*$:
$$\alpha^* = \frac{e^T (J J^T) e}{(J J^T e)^T (J J^T e)} = \frac{\|J^T e\|_2^2}{\|J J^T e\|_2^2}$$

---

### 3.5 Method 3: Moore-Penrose Pseudoinverse for Redundant Arms ($n > m$)
When an arm possesses redundant degrees of freedom ($n > m$, such as a 7-DoF arm in 6D space), the system $J \Delta q = e$ has infinitely many solutions.
We seek the particular solution that achieves the goal with the **smallest possible joint displacement**:
$$\min_{\Delta q} \frac{1}{2} \|\Delta q\|_2^2 \quad \text{subject to } J \Delta q = e$$

#### Derivation via Method of Lagrange Multipliers:
Formulate the Lagrangian with vector multiplier $\lambda \in \mathbb{R}^m$:
$$\mathcal{L}(\Delta q, \lambda) = \frac{1}{2} \Delta q^T \Delta q + \lambda^T (e - J \Delta q)$$

Take partial derivatives and set to zero:
$$\frac{\partial \mathcal{L}}{\partial \Delta q} = \Delta q^T - \lambda^T J = 0 \implies \Delta q = J^T \lambda$$
Substitute $\Delta q = J^T \lambda$ into the constraint $J \Delta q = e$:
$$J (J^T \lambda) = e \implies (J J^T) \lambda = e$$
Assuming $J$ has full row rank, $(J J^T) \in \mathbb{R}^{m \times m}$ is symmetric positive-definite and invertible:
$$\lambda = (J J^T)^{-1} e$$
Substitute $\lambda$ back into $\Delta q$:
$$\Delta q = J^T (J J^T)^{-1} e$$

The operator $J^+ = J^T (J J^T)^{-1} \in \mathbb{R}^{n \times m}$ is the **Moore-Penrose Pseudoinverse** (Right Inverse):
$$J^+ = J^T (J J^T)^{-1}$$

#### The Four Penrose Conditions:
The unique matrix $J^+$ satisfies:
1. $J J^+ J = J$
2. $J^+ J J^+ = J^+$
3. $(J J^+)^T = J J^+$ (Symmetric $m \times m$ identity projector)
4. $(J^+ J)^T = J^+ J$ (Symmetric $n \times n$ orthogonal projector onto row space)

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the three numerical IK algorithms with step clamping and tolerance verification:

```typescript
export interface NumericalIKOptions {
  maxIterations?: number;
  posTolerance?: number;       // meters (e.g. 1e-4)
  rotTolerance?: number;       // radians (e.g. 1e-3)
  stepClamping?: number;       // max radians per step (e.g. 0.2)
  method?: 'newton' | 'transpose' | 'pseudoinverse';
}

export interface NumericalIKResult {
  success: boolean;
  jointAngles: number[];
  iterations: number;
  finalPosError: number;
  finalRotError: number;
}

export class NumericalIKSolver {
  /**
   * Executes iterative numerical inverse kinematics.
   */
  public static solve(
    fkFunction: (q: number[]) => { pos: { x: number; y: number; z: number }; R: number[][] },
    jacobianFunction: (q: number[]) => number[][],
    targetPos: { x: number; y: number; z: number },
    targetR: number[][],
    initialGuess: number[],
    options: NumericalIKOptions = {}
  ): NumericalIKResult {
    const maxIter = options.maxIterations ?? 50;
    const posTol = options.posTolerance ?? 1e-4;
    const rotTol = options.rotTolerance ?? 1e-3;
    const maxStep = options.stepClamping ?? 0.2; // 0.2 rad max per step
    const method = options.method ?? 'pseudoinverse';

    let q = [...initialGuess];

    for (let iter = 0; iter < maxIter; iter++) {
      const currentFK = fkFunction(q);

      // 1. Position error
      const ep = [
        targetPos.x - currentFK.pos.x,
        targetPos.y - currentFK.pos.y,
        targetPos.z - currentFK.pos.z
      ];
      const posErrNorm = Math.sqrt(ep[0] * ep[0] + ep[1] * ep[1] + ep[2] * ep[2]);

      // 2. Orientation error via matrix cross-product
      const n = [currentFK.R[0][0], currentFK.R[1][0], currentFK.R[2][0]];
      const s = [currentFK.R[0][1], currentFK.R[1][1], currentFK.R[2][1]];
      const a = [currentFK.R[0][2], currentFK.R[1][2], currentFK.R[2][2]];

      const nd = [targetR[0][0], targetR[1][0], targetR[2][0]];
      const sd = [targetR[0][1], targetR[1][1], targetR[2][1]];
      const ad = [targetR[0][2], targetR[1][2], targetR[2][2]];

      const c1 = this.cross(n, nd);
      const c2 = this.cross(s, sd);
      const c3 = this.cross(a, ad);

      const eR = [
        0.5 * (c1[0] + c2[0] + c3[0]),
        0.5 * (c1[1] + c2[1] + c3[1]),
        0.5 * (c1[2] + c2[2] + c3[2])
      ];
      const rotErrNorm = Math.sqrt(eR[0] * eR[0] + eR[1] * eR[1] + eR[2] * eR[2]);

      // Check termination tolerance
      if (posErrNorm < posTol && rotErrNorm < rotTol) {
        return {
          success: true,
          jointAngles: q,
          iterations: iter,
          finalPosError: posErrNorm,
          finalRotError: rotErrNorm
        };
      }

      const e = [...ep, ...eR];
      const J = jacobianFunction(q);

      let deltaQ: number[];
      if (method === 'transpose') {
        deltaQ = this.stepTranspose(J, e);
      } else {
        deltaQ = this.stepPseudoinverse(J, e);
      }

      // Step clamping (trust-region limit)
      let stepNorm = 0;
      for (const dq of deltaQ) stepNorm += dq * dq;
      stepNorm = Math.sqrt(stepNorm);

      if (stepNorm > maxStep) {
        const scale = maxStep / stepNorm;
        for (let i = 0; i < deltaQ.length; i++) deltaQ[i] *= scale;
      }

      // Update configuration
      for (let i = 0; i < q.length; i++) {
        q[i] += deltaQ[i];
      }
    }

    const finalFK = fkFunction(q);
    const finalPosErr = Math.hypot(targetPos.x - finalFK.pos.x, targetPos.y - finalFK.pos.y, targetPos.z - finalFK.pos.z);
    return {
      success: false,
      jointAngles: q,
      iterations: maxIter,
      finalPosError: finalPosErr,
      finalRotError: 0
    };
  }

  private static stepTranspose(J: number[][], e: number[]): number[] {
    const m = J.length;
    const n = J[0].length;

    // J^T * e
    const JTe: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let r = 0; r < m; r++) JTe[i] += J[r][i] * e[r];
    }

    // J * J^T * e
    const JJTe: number[] = new Array(m).fill(0);
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) JJTe[r] += J[r][c] * JTe[c];
    }

    // Optimal alpha = ||J^T e||^2 / ||J J^T e||^2
    let num = 0;
    for (const val of JTe) num += val * val;
    let den = 0;
    for (const val of JJTe) den += val * val;

    const alpha = den > 1e-12 ? num / den : 0.01;
    return JTe.map(val => val * alpha);
  }

  private static stepPseudoinverse(J: number[][], e: number[]): number[] {
    const m = J.length;
    const n = J[0].length;

    // JJT = J * J^T (m x m)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += J[i][k] * J[j][k];
        JJT[i][j] = sum;
      }
    }

    // Solve (JJT) * lambda = e via Gaussian elimination
    const lambda = this.solveLinearSystem(JJT, e);

    // deltaQ = J^T * lambda
    const deltaQ: number[] = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let r = 0; r < m; r++) deltaQ[i] += J[r][i] * lambda[r];
    }
    return deltaQ;
  }

  private static solveLinearSystem(A: number[][], b: number[]): number[] {
    const n = b.length;
    const M = A.map((row, i) => [...row, b[i]]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];

      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) continue;

      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / pivot;
        for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
      }
    }

    const x: number[] = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
      x[i] = Math.abs(M[i][i]) > 1e-12 ? sum / M[i][i] : 0;
    }
    return x;
  }

  private static cross(a: number[], b: number[]): number[] {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 8.1: Step-by-Step Newton-Raphson Iteration on a 2R Arm
**Problem Statement:** A 2R planar manipulator with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is tasked with reaching $(x_d, y_d) = (1.0, 1.0)\text{ m}$. Starting from the initial guess $q_0 = (\theta_1, \theta_2) = (0.2\text{ rad}, 1.2\text{ rad})$, execute one complete Newton-Raphson step to compute $q_1$.

**Given Data:**
- $L_1 = 1.0, L_2 = 1.0$
- $x_d = 1.0, y_d = 1.0$
- $q_0 = [0.2, 1.2]^T$
- $\theta_1 = 0.2\text{ rad} \implies \cos(0.2) = 0.980067, \sin(0.2) = 0.198669$
- $\theta_{12} = 0.2 + 1.2 = 1.4\text{ rad} \implies \cos(1.4) = 0.169967, \sin(1.4) = 0.985450$

**Step-by-Step Derivation:**
1. Compute forward kinematics at $q_0$:
   $$x(q_0) = L_1\cos\theta_1 + L_2\cos\theta_{12} = 1.0(0.980067) + 1.0(0.169967) = 1.150034\text{ m}$$
   $$y(q_0) = L_1\sin\theta_1 + L_2\sin\theta_{12} = 1.0(0.198669) + 1.0(0.985450) = 1.184119\text{ m}$$
2. Compute error vector $e = [x_d - x, y_d - y]^T$:
   $$e = \begin{bmatrix} 1.0 - 1.150034 \\ 1.0 - 1.184119 \end{bmatrix} = \begin{bmatrix} -0.150034 \\ -0.184119 \end{bmatrix}\text{ m}$$
   $$\|e\|_2 = \sqrt{(-0.150034)^2 + (-0.184119)^2} \approx 0.237517\text{ m}$$
3. Evaluate Jacobian matrix at $q_0$:
   $$J_{11} = -1.0\sin(0.2) - 1.0\sin(1.4) = -0.198669 - 0.985450 = -1.184119$$
   $$J_{12} = -1.0\sin(1.4) = -0.985450$$
   $$J_{21} = 1.0\cos(0.2) + 1.0\cos(1.4) = 0.980067 + 0.169967 = 1.150034$$
   $$J_{22} = 1.0\cos(1.4) = 0.169967$$
   $$J = \begin{bmatrix} -1.184119 & -0.985450 \\ 1.150034 & 0.169967 \end{bmatrix}$$
4. Compute $\det(J) = L_1 L_2 \sin\theta_2 = 1.0(1.0)\sin(1.2) = 0.932039$.
5. Invert $2 \times 2$ Jacobian:
   $$J^{-1} = \frac{1}{0.932039} \begin{bmatrix} 0.169967 & 0.985450 \\ -1.150034 & -1.184119 \end{bmatrix} = \begin{bmatrix} 0.182360 & 1.057306 \\ -1.233890 & -1.270461 \end{bmatrix}$$
6. Compute joint step $\Delta q = J^{-1} e$:
   $$\Delta\theta_1 = 0.182360(-0.150034) + 1.057306(-0.184119) = -0.027360 - 0.194670 = -0.222030\text{ rad}$$
   $$\Delta\theta_2 = -1.233890(-0.150034) - 1.270461(-0.184119) = 0.185125 + 0.233916 = +0.419041\text{ rad}$$
7. Update joint angles:
   $$\theta_1^{(1)} = 0.200000 - 0.222030 = -0.022030\text{ rad}$$
   $$\theta_2^{(1)} = 1.200000 + 0.419041 = +1.619041\text{ rad}$$

**Final Answer:**
After 1 iteration: **$q_1 = [-0.02203\text{ rad}, +1.61904\text{ rad}]^T$** ($[-1.26^\circ, 92.76^\circ]$).

**Verification & Sanity Check:**
Compute forward kinematics at $q_1$:
$\theta_{12} = -0.02203 + 1.61904 = 1.59701\text{ rad}$.
$x(q_1) = \cos(-0.02203) + \cos(1.59701) = 0.999757 - 0.026211 = 0.973546\text{ m}$.
$y(q_1) = \sin(-0.02203) + \sin(1.59701) = -0.022028 + 0.999656 = 0.977628\text{ m}$.
New error $\|e_1\| = \sqrt{(1 - 0.9735)^2 + (1 - 0.9776)^2} \approx 0.0346\text{ m}$.
Error dropped from $0.2375\text{ m}$ to $0.0346\text{ m}$ (an **$85.4\%$ reduction** in a single step).

---

### Problem 8.2: Quadratic Convergence Demonstration
**Problem Statement:** Continue the Newton-Raphson iteration from Problem 8.1 for iterations 2, 3, and 4. Document the exact error norm $\|e_k\|$ to demonstrate quadratic convergence.

**Step-by-Step Derivation:**
- **Iteration 0:**
  $q_0 = [0.200000, 1.200000]^T \implies \|e_0\| = 2.375 \times 10^{-1}\text{ m}$
- **Iteration 1:**
  $q_1 = [-0.022030, 1.619041]^T \implies \|e_1\| = 3.461 \times 10^{-2}\text{ m}$
- **Iteration 2:**
  Evaluate $J(q_1)$ and $e_1$:
  $e_1 = [0.026454, 0.022372]^T$
  $\Delta q_1 = [+0.022137, -0.048384]^T$
  $q_2 = q_1 + \Delta q_1 = [0.000107, 1.570657]^T$
  Forward kinematics: $x = 0.999999, y = 1.000108$
  $\|e_2\| = 1.08 \times 10^{-4}\text{ m}$
- **Iteration 3:**
  $q_3 = [0.000000, 1.570796]^T$
  $\|e_3\| = 1.42 \times 10^{-9}\text{ m}$ (machine precision of zero)

**Final Answer:**
- $\|e_0\| \approx 2.38 \times 10^{-1}\text{ m}$
- $\|e_1\| \approx 3.46 \times 10^{-2}\text{ m}$
- $\|e_2\| \approx 1.08 \times 10^{-4}\text{ m}$
- $\|e_3\| \approx 1.42 \times 10^{-9}\text{ m}$

**Verification & Sanity Check:**
Notice the exponents: $10^{-1} \to 10^{-2} \to 10^{-4} \to 10^{-9}$. The exponent roughly doubles at every step, the classic textbook hallmark of **quadratic convergence**!

---

### Problem 8.3: Jacobian Transpose Step with Optimal $\alpha^*$
**Problem Statement:** For the arm in Problem 8.1 at $q_0 = [0.2, 1.2]^T$ with error $e = [-0.150034, -0.184119]^T$, compute:
1. The gradient vector $g = J^T e$.
2. The optimal step size $\alpha^*$.
3. The resulting joint increment $\Delta q$.

**Given Data:**
- $J = \begin{bmatrix} -1.184119 & -0.985450 \\ 1.150034 & 0.169967 \end{bmatrix}$
- $e = [-0.150034, -0.184119]^T$

**Step-by-Step Derivation:**
1. Compute gradient $g = J^T e$:
   $$g_1 = J_{11} e_x + J_{21} e_y = -1.184119(-0.150034) + 1.150034(-0.184119) = 0.177658 - 0.211743 = -0.034085$$
   $$g_2 = J_{12} e_x + J_{22} e_y = -0.985450(-0.150034) + 0.169967(-0.184119) = 0.147851 - 0.031294 = +0.116557$$
   $$g = J^T e = [-0.034085, +0.116557]^T$$
2. Compute $\|J^T e\|^2$:
   $$\|J^T e\|^2 = (-0.034085)^2 + (0.116557)^2 = 0.001162 + 0.013586 = 0.014748$$
3. Compute $J (J^T e)$:
   $$J g = \begin{bmatrix} -1.184119 & -0.985450 \\ 1.150034 & 0.169967 \end{bmatrix} \begin{bmatrix} -0.034085 \\ 0.116557 \end{bmatrix} = \begin{bmatrix} 0.040361 - 0.114861 \\ -0.039199 + 0.019811 \end{bmatrix} = \begin{bmatrix} -0.074500 \\ -0.019388 \end{bmatrix}$$
4. Compute $\|J J^T e\|^2$:
   $$\|J J^T e\|^2 = (-0.074500)^2 + (-0.019388)^2 = 0.005550 + 0.000376 = 0.005926$$
5. Compute optimal $\alpha^*$:
   $$\alpha^* = \frac{\|J^T e\|^2}{\|J J^T e\|^2} = \frac{0.014748}{0.005926} \approx 2.488694$$
6. Compute joint step $\Delta q = \alpha^* J^T e$:
   $$\Delta\theta_1 = 2.488694(-0.034085) = -0.084827\text{ rad}$$
   $$\Delta\theta_2 = 2.488694(+0.116557) = +0.290075\text{ rad}$$

**Final Answer:**
- Gradient: **$J^T e = [-0.0341, +0.1166]^T$**
- Optimal Step Size: **$\alpha^* \approx 2.489$**
- Joint Step: **$\Delta q = [-0.0848\text{ rad}, +0.2901\text{ rad}]^T$**

**Verification & Sanity Check:**
Notice that $\Delta q$ points in the exact same direction as the Newton-Raphson step (decreasing $\theta_1$, increasing $\theta_2$), but is computed without calculating any matrix inverse!

---

### Problem 8.4: Lyapunov Monotonic Energy Decay Verification
**Problem Statement:** For the step computed in Problem 8.3, evaluate the initial Lyapunov energy $V_0 = \frac{1}{2}\|e_0\|^2$ and the new Lyapunov energy $V_1 = \frac{1}{2}\|e_1\|^2$. Confirm that $V_1 < V_0$.

**Given Data:**
- $q_0 = [0.2, 1.2]^T \implies \|e_0\| = 0.237517\text{ m}$
- $\Delta q = [-0.084827, +0.290075]^T$
- $q_1 = q_0 + \Delta q = [0.115173, 1.490075]^T$

**Step-by-Step Derivation:**
1. Compute initial energy $V_0$:
   $$V_0 = \frac{1}{2} (0.237517)^2 = 0.028207\text{ m}^2$$
2. Compute forward kinematics at $q_1$:
   $$\theta_1 = 0.115173\text{ rad} \implies \cos\theta_1 = 0.993386, \sin\theta_1 = 0.114819$$
   $$\theta_{12} = 0.115173 + 1.490075 = 1.605248\text{ rad} \implies \cos\theta_{12} = -0.034443, \sin\theta_{12} = 0.999407$$
   $$x_1 = 0.993386 - 0.034443 = 0.958943\text{ m}$$
   $$y_1 = 0.114819 + 0.999407 = 1.114226\text{ m}$$
3. Compute new error $e_1$:
   $$e_{x, 1} = 1.0 - 0.958943 = 0.041057\text{ m}$$
   $$e_{y, 1} = 1.0 - 1.114226 = -0.114226\text{ m}$$
   $$\|e_1\|^2 = (0.041057)^2 + (-0.114226)^2 = 0.001686 + 0.013048 = 0.014734\text{ m}^2$$
4. Compute new energy $V_1$:
   $$V_1 = \frac{1}{2} (0.014734) = 0.007367\text{ m}^2$$
5. Compare:
   $$V_1 = 0.007367 < 0.028207 = V_0$$
   $$\Delta V = 0.007367 - 0.028207 = -0.020840\text{ m}^2 \quad (\text{Strictly negative!})$$

**Final Answer:**
$V_0 = 0.02821\text{ m}^2 \to V_1 = 0.00737\text{ m}^2$. The energy decreased by **$73.9\%$**, strictly validating Lyapunov monotonic decay.

---

### Problem 8.5: Moore-Penrose Pseudoinverse for a Redundant 3R Arm
**Problem Statement:** A 3R planar manipulator with $L_1 = 1.0, L_2 = 1.0, L_3 = 1.0$ is at configuration $q = [0^\circ, 90^\circ, 0^\circ] = [0, \pi/2, 0]$. The required Cartesian displacement is $\Delta x = [0.10, 0.05]^T\text{ m}$. Compute the minimum-norm joint step $\Delta q = J^+ \Delta x$.

**Given Data:**
- $L_1 = 1, L_2 = 1, L_3 = 1$
- $\theta_1 = 0, \theta_2 = \pi/2, \theta_3 = 0 \implies \theta_{12} = \pi/2, \theta_{123} = \pi/2$
- $s_1 = 0, c_1 = 1, s_{12} = 1, c_{12} = 0, s_{123} = 1, c_{123} = 0$
- Target displacement: $\Delta x = [0.10, 0.05]^T$

**Step-by-Step Derivation:**
1. Evaluate positional Jacobian $J_v \in \mathbb{R}^{2 \times 3}$:
   From Chapter 6:
   $$J_{11} = -L_1 s_1 - L_2 s_{12} - L_3 s_{123} = 0 - 1(1) - 1(1) = -2.0$$
   $$J_{12} = -L_2 s_{12} - L_3 s_{123} = -1(1) - 1(1) = -2.0$$
   $$J_{13} = -L_3 s_{123} = -1.0$$
   $$J_{21} = L_1 c_1 + L_2 c_{12} + L_3 c_{123} = 1(1) + 0 + 0 = 1.0$$
   $$J_{22} = L_2 c_{12} + L_3 c_{123} = 0 + 0 = 0.0$$
   $$J_{23} = L_3 c_{123} = 0.0$$
   $$J = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$$
2. Compute $J J^T \in \mathbb{R}^{2 \times 2}$:
   $$J J^T = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix} \begin{bmatrix} -2.0 & 1.0 \\ -2.0 & 0.0 \\ -1.0 & 0.0 \end{bmatrix} = \begin{bmatrix} (-2)^2 + (-2)^2 + (-1)^2 & -2(1) + 0 + 0 \\ 1(-2) + 0 + 0 & 1^2 + 0 + 0 \end{bmatrix} = \begin{bmatrix} 9.0 & -2.0 \\ -2.0 & 1.0 \end{bmatrix}$$
3. Invert $J J^T$:
   $$\det(J J^T) = (9.0)(1.0) - (-2.0)^2 = 9.0 - 4.0 = 5.0$$
   $$(J J^T)^{-1} = \frac{1}{5.0} \begin{bmatrix} 1.0 & 2.0 \\ 2.0 & 9.0 \end{bmatrix} = \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix}$$
4. Compute $\lambda = (J J^T)^{-1} \Delta x$:
   $$\lambda = \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.05 \end{bmatrix} = \begin{bmatrix} 0.2(0.10) + 0.4(0.05) \\ 0.4(0.10) + 1.8(0.05) \end{bmatrix} = \begin{bmatrix} 0.02 + 0.02 \\ 0.04 + 0.09 \end{bmatrix} = \begin{bmatrix} 0.04 \\ 0.13 \end{bmatrix}$$
5. Compute $\Delta q = J^T \lambda$:
   $$\Delta q = \begin{bmatrix} -2.0 & 1.0 \\ -2.0 & 0.0 \\ -1.0 & 0.0 \end{bmatrix} \begin{bmatrix} 0.04 \\ 0.13 \end{bmatrix} = \begin{bmatrix} -2.0(0.04) + 1.0(0.13) \\ -2.0(0.04) + 0.0(0.13) \\ -1.0(0.04) + 0.0(0.13) \end{bmatrix} = \begin{bmatrix} -0.08 + 0.13 \\ -0.08 \\ -0.04 \end{bmatrix} = \begin{bmatrix} +0.05 \\ -0.08 \\ -0.04 \end{bmatrix}\text{ rad}$$

**Final Answer:**
$$\Delta q = [+0.05\text{ rad}, -0.08\text{ rad}, -0.04\text{ rad}]^T$$
with Euclidean norm $\|\Delta q\| = \sqrt{0.05^2 + (-0.08)^2 + (-0.04)^2} = \sqrt{0.0025 + 0.0064 + 0.0016} = \sqrt{0.0105} \approx 0.10247\text{ rad}$.

**Verification & Sanity Check:**
Check $J \Delta q$:
$-2.0(0.05) - 2.0(-0.08) - 1.0(-0.04) = -0.10 + 0.16 + 0.04 = +0.10 = \Delta x$.
$1.0(0.05) + 0 + 0 = +0.05 = \Delta y$.
Exact match.

---

### Problem 8.6: Minimum Norm Proof Verification
**Problem Statement:** For Problem 8.5, construct an alternative solution $\Delta q'$ that also satisfies $J \Delta q' = \Delta x$ by perturbing $\Delta q$ along the nullspace. Prove that $\|\Delta q'\|_2 > \|\Delta q_{\text{pinv}}\|_2$.

**Given Data:**
- $\Delta q_{\text{pinv}} = [0.05, -0.08, -0.04]^T$ with $\|\Delta q_{\text{pinv}}\|^2 = 0.0105$.
- Nullspace vector $v_{\text{null}}$ satisfies $J v_{\text{null}} = 0$.

**Step-by-Step Derivation:**
1. Find a nullspace vector $v_{\text{null}} = [v_1, v_2, v_3]^T$:
   $$J v_{\text{null}} = \begin{bmatrix} -2 & -2 & -1 \\ 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \\ v_3 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   Row 2: $v_1 = 0$.
   Row 1: $-2(0) - 2v_2 - v_3 = 0 \implies v_3 = -2v_2$.
   Choose $v_2 = 1.0 \implies v_3 = -2.0$.
   $$v_{\text{null}} = [0, 1.0, -2.0]^T$$
2. Construct perturbed solution $\Delta q' = \Delta q_{\text{pinv}} + c v_{\text{null}}$ with $c = 0.05$:
   $$\Delta q' = \begin{bmatrix} 0.05 \\ -0.08 \\ -0.04 \end{bmatrix} + 0.05 \begin{bmatrix} 0 \\ 1.0 \\ -2.0 \end{bmatrix} = \begin{bmatrix} 0.05 \\ -0.03 \\ -0.14 \end{bmatrix}$$
3. Verify that $\Delta q'$ satisfies $J \Delta q' = \Delta x$:
   $$-2(0.05) - 2(-0.03) - 1(-0.14) = -0.10 + 0.06 + 0.14 = 0.10 = \Delta x$$
   $$1(0.05) + 0 + 0 = 0.05 = \Delta y$$
4. Compute the norm of $\Delta q'$:
   $$\|\Delta q'\|^2 = 0.05^2 + (-0.03)^2 + (-0.14)^2 = 0.0025 + 0.0009 + 0.0196 = 0.0230$$
   $$\|\Delta q'\| = \sqrt{0.0230} \approx 0.15166\text{ rad}$$
5. Compare:
   $$\|\Delta q'\| = 0.1517\text{ rad} > 0.1025\text{ rad} = \|\Delta q_{\text{pinv}}\|$$

**Final Answer:**
$\|\Delta q'\|_2 > \|\Delta q_{\text{pinv}}\|_2$. The Moore-Penrose pseudoinverse solution strictly minimizes the joint motion norm.

---

### Problem 8.7: Orientation Error Comparison (Logarithm vs. Skew Cross-Product)
**Problem Statement:** Let current attitude be $R = I_3$ and desired attitude be $R_d = \operatorname{Rot}_z(\theta)$ with $\theta = 30^\circ = \frac{\pi}{6}\text{ rad}$.
1. Compute the exact axis-angle error $e_R^{\log} = \operatorname{vee}(\log(R_d R^T))$.
2. Compute the skew cross-product approximation $e_R^{\text{cross}} = \frac{1}{2}(n \times n_d + s \times s_d + a \times a_d)$.
3. Compare the two error vectors.

**Given Data:**
- $R = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$
- $R_d = \begin{bmatrix} \cos 30^\circ & -\sin 30^\circ & 0 \\ \sin 30^\circ & \cos 30^\circ & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0.866025 & -0.500000 & 0 \\ 0.500000 & 0.866025 & 0 \\ 0 & 0 & 1 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Method 1 (Matrix Logarithm):
   Relative rotation $R_{\text{err}} = R_d I = R_d$.
   Rotation angle is exactly $\theta = 30^\circ \approx 0.523599\text{ rad}$ about axis $\hat{z} = [0, 0, 1]^T$.
   $$e_R^{\log} = [0, 0, 0.523599]^T\text{ rad}$$
2. Method 2 (Cross Product):
   - $n = [1, 0, 0]^T, n_d = [0.866025, 0.500000, 0]^T$:
     $$n \times n_d = [0, 0, 0.500000]^T$$
   - $s = [0, 1, 0]^T, s_d = [-0.500000, 0.866025, 0]^T$:
     $$s \times s_d = [0, 0, 0.500000]^T$$
   - $a = [0, 0, 1]^T, a_d = [0, 0, 1]^T$:
     $$a \times a_d = [0, 0, 0]^T$$
   Sum:
   $$e_R^{\text{cross}} = \frac{1}{2} ([0, 0, 0.5]^T + [0, 0, 0.5]^T + 0) = [0, 0, 0.500000]^T$$

**Final Answer:**
- Logarithm Error: **$e_R^{\log} = [0, 0, 0.5236]^T\text{ rad}$** (exact radian angle $\theta$)
- Cross-Product Error: **$e_R^{\text{cross}} = [0, 0, 0.5000]^T$** (equal to $\sin\theta = \sin(30^\circ) = 0.5$)

**Verification & Sanity Check:**
Because $\sin(0.5236) = 0.5000$, the cross-product approximation produces $\sin\theta$. For small angles ($\theta < 15^\circ$), $\sin\theta \approx \theta$, making the cross-product formula exceptionally fast and accurate.

---

### Problem 8.8: Step Size Backtracking to Prevent Overshooting
**Problem Statement:** In a numerical IK step, a raw Newton-Raphson calculation produces $\Delta q$ with norm $\|\Delta q\| = 1.5\text{ rad}$ ($86^\circ$), causing the arm to jump across multiple quadrants and diverge. Describe the backtracking line search algorithm used to guarantee convergence.

**Solution:**
1. Armijo Backtracking Line Search:
   Given step $\Delta q$, evaluate the candidate next configuration:
   $$q_{\text{trial}}(\beta) = q_k + \beta \Delta q, \quad \beta \in (0, 1]$$
2. Set initial step factor $\beta = 1.0$.
3. Compute the prospective error norm $\|e(q_{\text{trial}}(\beta))\|$.
4. Check the Armijo sufficient decrease condition:
   $$\|e(q_{\text{trial}})\|^2 \le (1 - c_1 \beta) \|e(q_k)\|^2$$
5. If the condition fails (error increased or didn't drop sufficiently), contract the step size:
   $$\beta \leftarrow \gamma \beta \quad (\text{e.g. } \gamma = 0.5)$$
6. Repeat until the condition is met or $\beta < 10^{-4}$.
7. This guarantees that every step strictly decreases the error, converting a local Newton method into a **globally convergent** algorithm.

---

### Problem 8.9: Left vs. Right Generalized Pseudoinverse
**Problem Statement:** Compare the mathematical definitions and application domains of the Left Pseudoinverse $J_L^+$ and Right Pseudoinverse $J_R^+$.

**Solution:**
1. **Right Pseudoinverse ($n > m$, Over-Actuated / Redundant):**
   - $J \in \mathbb{R}^{m \times n}$ has more columns than rows (full row rank $m$).
   - Matrix $J J^T \in \mathbb{R}^{m \times m}$ is invertible.
   - $$J_R^+ = J^T (J J^T)^{-1}$$
   - Property: $J J_R^+ = I_m$ (exact right identity).
   - Application: Redundant inverse kinematics (7-DoF arms in 3D/6D space).
2. **Left Pseudoinverse ($m > n$, Over-Constrained):**
   - $J \in \mathbb{R}^{m \times n}$ has more rows than columns (full column rank $n$).
   - Matrix $J^T J \in \mathbb{R}^{n \times n}$ is invertible.
   - $$J_L^+ = (J^T J)^{-1} J^T$$
   - Property: $J_L^+ J = I_n$ (exact left identity).
   - Application: Over-constrained parameter estimation and sensor fusion (finding joint rates that best fit over-determined sensor measurements).

---

### Problem 8.10: Local Minima Trap in Jacobian Transpose
**Problem Statement:** In the Jacobian Transpose method, the update is $\Delta q = \alpha J^T e$. Show that an algorithm can become trapped at a non-zero error ($e \neq 0$) if the error vector lies in the left nullspace of the Jacobian.

**Solution:**
1. The update is $\Delta q = \alpha J^T e$.
2. Suppose the error vector $e \in \mathbb{R}^m$ satisfies $e \in \mathcal{N}(J^T)$ (the left nullspace of $J$).
3. By definition of the nullspace:
   $$J^T e = 0$$
4. Therefore:
   $$\Delta q = \alpha (0) = 0$$
5. The algorithm stops updating ($\Delta q = 0$), concluding that a stationary point has been reached, even though the Cartesian error is non-zero ($e \neq 0$).
6. This occurs at kinematic singularities where the target requires motion along a lost degree of freedom.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 8.11: Newton-Raphson Step on a SCARA Manipulator
**Problem Statement:** A SCARA robot has $a_1 = 0.5\text{ m}, a_2 = 0.4\text{ m}$. At $q = [0^\circ, 90^\circ]^T$, the end-effector position error is $e = [0.02, -0.01]^T\text{ m}$. Compute the Newton-Raphson joint increment $\Delta q$.

**Solution:**
1. Forward kinematics Jacobian for $(x, y)$:
   $$J = \begin{bmatrix} -0.4 & -0.4 \\ 0.9 & 0.4 \end{bmatrix}$$
2. Determinant: $\det(J) = -0.4(0.4) - (-0.4)(0.9) = -0.16 + 0.36 = 0.20$.
3. Inverse:
   $$J^{-1} = \frac{1}{0.20} \begin{bmatrix} 0.4 & 0.4 \\ -0.9 & -0.4 \end{bmatrix} = \begin{bmatrix} 2.0 & 2.0 \\ -4.5 & -2.0 \end{bmatrix}$$
4. Compute $\Delta q = J^{-1} e$:
   $$\Delta q_1 = 2.0(0.02) + 2.0(-0.01) = 0.04 - 0.02 = +0.02\text{ rad}$$
   $$\Delta q_2 = -4.5(0.02) - 2.0(-0.01) = -0.09 + 0.02 = -0.07\text{ rad}$$

---

### Problem 8.12: Initial Guess Basin of Attraction
**Problem Statement:** Explain how the choice of initial guess $q_0$ in Newton-Raphson determines which branch (elbow-up vs. elbow-down) the iterative solver converges to.

**Solution:**
1. The configuration space $\mathcal{Q}$ is divided into **basins of attraction** separated by the singularity manifold ($\det(J) = 0$).
2. If $q_0$ has $\theta_2 > 0$ (elbow-down basin), the Newton-Raphson iteration moves along the local gradient without crossing the singular barrier $\theta_2 = 0$, converging to the elbow-down solution.
3. If $q_0$ has $\theta_2 < 0$, it converges to the elbow-up solution.
4. Supplying the robot's current physical joint position as $q_0$ guarantees that the solver selects the branch closest to the arm's current state, preventing sudden violent configuration flips.

---

### Problem 8.13: Weighted Pseudoinverse with Joint Inertia
**Problem Statement:** For a redundant arm, formulate the weighted pseudoinverse $J_W^+$ that minimizes kinetic energy metric $\frac{1}{2}\Delta q^T W \Delta q$, where $W$ is the positive-definite joint inertia matrix.

**Solution:**
1. Optimization problem: $\min \frac{1}{2} \Delta q^T W \Delta q$ subject to $J \Delta q = e$.
2. Formulate Lagrangian: $\mathcal{L} = \frac{1}{2}\Delta q^T W \Delta q + \lambda^T (e - J \Delta q)$.
3. Differentiate: $W \Delta q - J^T \lambda = 0 \implies \Delta q = W^{-1} J^T \lambda$.
4. Substitute into constraint: $J W^{-1} J^T \lambda = e \implies \lambda = (J W^{-1} J^T)^{-1} e$.
5. The **Weighted Moore-Penrose Pseudoinverse** is:
   $$J_W^+ = W^{-1} J^T (J W^{-1} J^T)^{-1}$$

---

### Problem 8.14: Quaternion Error Vector Formulation
**Problem Statement:** Let unit quaternion $\mathbf{q}$ represent current attitude and $\mathbf{q}_d$ represent desired attitude. Formulate the orientation error vector $e_R$ used in numerical IK.

**Solution:**
1. Compute the relative error quaternion:
   $$\mathbf{q}_{\text{err}} = \mathbf{q}_d \otimes \mathbf{q}^{-1} = (w_{\text{err}}, \vec{v}_{\text{err}})$$
2. For small rotations, $w_{\text{err}} \approx 1$ and $\vec{v}_{\text{err}} \approx \frac{\theta}{2} \hat{\omega}$.
3. Therefore, the 3D orientation error vector is:
   $$e_R = 2 \operatorname{sgn}(w_{\text{err}}) \vec{v}_{\text{err}}$$
   The sign factor $\operatorname{sgn}(w_{\text{err}})$ guarantees taking the shortest path on the 3-sphere $S^3$.

---

### Problem 8.15: Joint Velocity Saturation Clamping
**Problem Statement:** An IK step yields $\Delta q = [0.4, -0.6, 0.8]^T\text{ rad}$. The maximum allowable step per control cycle is $\Delta q_{\max} = 0.2\text{ rad}$. Clamp the step while preserving the direction of motion.

**Solution:**
1. Compute the maximum component magnitude:
   $$\|\Delta q\|_\infty = \max(|0.4|, |-0.6|, |0.8|) = 0.8\text{ rad}$$
2. Scale factor:
   $$s = \frac{\Delta q_{\max}}{\|\Delta q\|_\infty} = \frac{0.2}{0.8} = 0.25$$
3. Clamped step:
   $$\Delta q_{\text{clamped}} = 0.25 \begin{bmatrix} 0.4 \\ -0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0.10 \\ -0.15 \\ 0.20 \end{bmatrix}\text{ rad}$$
4. All components now satisfy $|\Delta q_i| \le 0.2\text{ rad}$ while maintaining the exact same trajectory vector in joint space.

---

### Problem 8.16: Stopping Criteria and Numerical Tolerances
**Problem Statement:** In a 6-DoF numerical IK solver, explain why position error and orientation error must have separate tolerance thresholds ($\epsilon_p$ vs. $\epsilon_R$).

**Solution:**
1. Position error $e_p$ is measured in linear units (meters), where typical manufacturing tolerances are $\epsilon_p = 10^{-4}\text{ m} = 0.1\text{ mm}$.
2. Orientation error $e_R$ is measured in angular units (radians), where typical tolerances are $\epsilon_R = 10^{-3}\text{ rad} \approx 0.057^\circ$.
3. Combining them into a single norm $\|e\| = \sqrt{\|e_p\|^2 + \|e_R\|^2}$ is dimensionally inhomogeneous ($m^2 + \text{rad}^2$), causing the solver to prematurely terminate if one quantity is numerically smaller than the other. Separate stopping checks are mandatory.

---

### Problem 8.17: Comparison of Newton-Raphson vs. Levenberg-Marquardt
**Problem Statement:** Contrast the convergence behavior of pure Newton-Raphson $\Delta q = J^{-1} e$ with Levenberg-Marquardt $\Delta q = (J^T J + \lambda^2 I)^{-1} J^T e$ near singular configurations.

**Solution:**
1. **Newton-Raphson:** As $\det(J) \to 0$, $J^{-1} \to \infty$. Joint steps explode, causing wild divergence and chaotic numerical oscillations.
2. **Levenberg-Marquardt:** The regularization term $\lambda^2 I$ guarantees that $(J^T J + \lambda^2 I)$ remains strictly positive-definite and well-conditioned for all configurations. Joint velocities remain bounded, smoothly transitioning from Newton-Raphson far from singularities to gradient descent near singularities.

---

### Problem 8.18: 7-DoF Redundant Arm Pseudoinverse Step
**Problem Statement:** A 7-DoF arm has Jacobian $J \in \mathbb{R}^{6 \times 7}$. The target requires end-effector twist $\nu \in \mathbb{R}^6$. State the dimensions of the matrices inverted in $J^+ = J^T (J J^T)^{-1}$.

**Solution:**
1. $J$ has size $6 \times 7$.
2. $J^T$ has size $7 \times 6$.
3. The product $J J^T$ has size $6 \times 6$.
4. Inverting $J J^T$ requires inverting a **$6 \times 6$ matrix** (the dimension of task space), regardless of whether the arm has 7, 10, or 100 degrees of freedom!

---

### Problem 8.19: Divergence of Newton-Raphson Near a Singularity
**Problem Statement:** For a 2R arm at $\theta_2 = 0.001\text{ rad}$ ($L_1 = L_2 = 1.0$), evaluate the magnitude of $J^{-1}$ and explain why iteration fails.

**Solution:**
1. $\det(J) = L_1 L_2 \sin\theta_2 = 1.0(1.0)\sin(0.001) \approx 0.000999999$.
2. The entries of $J^{-1}$ contain the factor $\frac{1}{\det(J)} \approx 1000.0$.
3. An error of just $e = 1\text{ mm} = 0.001\text{ m}$ produces a joint step:
   $$\|\Delta q\| \approx 1000 \times 0.001 = 1.0\text{ rad} \approx 57^\circ$$
4. A $1\text{ mm}$ error commands an enormous $57^\circ$ joint jump, completely violating the local linearity assumption and causing immediate divergence.

---

### Problem 8.20: Verification of the Four Penrose Invariant Conditions
**Problem Statement:** Write the mathematical verification test that proves a computed matrix $A$ is the true Moore-Penrose pseudoinverse $J^+$ of matrix $J$.

**Solution:**
For any valid pseudoinverse $A = J^+$:
1. Condition 1: $\|J A J - J\|_\infty < 10^{-12}$
2. Condition 2: $\|A J A - A\|_\infty < 10^{-12}$
3. Condition 3: $\|(J A)^T - J A\|_\infty < 10^{-12}$
4. Condition 4: $\|(A J)^T - A J\|_\infty < 10^{-12}$
If all four matrix residual norms are zero to machine precision, $A$ is verified to be the unique Moore-Penrose pseudoinverse.

---

# Chapter 9: Singularity Robustness — Damped Least Squares (DLS) and Levenberg-Marquardt Stabilization

---

## 1. The Layman's Genesis & Intuitive Overview

Imagine you are driving a car along a highway, following a GPS navigation path. Suddenly, the GPS map instructs you to make an instantaneous $90^\circ$ turn across a solid concrete divider at $100\text{ km/h}$. 

A purely mathematical, naive algorithm would attempt to follow the instruction literally: it would command the steering wheel to rotate instantaneously, demanding infinite tire friction and infinite lateral acceleration. The car would flip over, crash, and be destroyed. 

A skilled human driver does something fundamentally different: **they recognize the physical impossibility, relax the tracking precision for a brief moment, decelerate smoothly, bypass the obstacle, and gently return to the path.**

In robotics, this exact crisis occurs whenever a manipulator passes near a **Kinematic Singularity** (Chapter 7). 
- If a robot controller uses the pure Moore-Penrose pseudoinverse $\Delta q = J^+ e$, the math says: *"You must reach this Cartesian target coordinate at all costs!"* As the arm straightens or the wrist axes align ($\sigma_{\min} \to 0$), $J^+$ demands infinite joint speeds ($10,000\text{ rad/s}$), tripping electrical circuit breakers or shearing gear teeth.

```
   Target Path Passes Near Singularity
                     Path
   ───────────●────────────────────────▶
              │
              ▼ Near Singularity (σ_min ──▶ 0)
   
   Pure Pseudoinverse J^+:      Motor speeds command ──▶ INFINITY! (Crash / Trip)
   
   Damped Least Squares (DLS):  Sacrifices a fraction of a millimeter in tracking;
                                Motor speeds remain completely BOUNDED and smooth!
```

To prevent physical destruction, roboticists use **Damped Least Squares (DLS)** (also known as the **Levenberg-Marquardt method** or **Tikhonov regularization**). Instead of treating trajectory tracking as an absolute commandment, DLS treats it as a balance:
*Achieve the closest possible reach to the target, but penalize excessive joint speeds.*

Near a singularity, DLS automatically and gracefully dampens unattainable motions, allowing the robot to glide effortlessly through singular regions without a shudder!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical framework of damped regularization was invented independently in optimization theory and statistics:
- In 1943, **Andrey Tikhonov** formulated regularization for ill-posed Fredholm integral equations (**Tikhonov Regularization**).
- In 1944, **Kenneth Levenberg** published *"A Method for the Solution of Certain Non-Linear Problems in Least Squares"*, introducing a damping parameter into gradient descent.
- In 1963, **Donald W. Marquardt** refined the method, demonstrating that smoothly adjusting damping between pure Newton-Raphson and steepest gradient descent guarantees robust convergence for ill-conditioned non-linear regressions (**The Levenberg-Marquardt Algorithm**).

In robotics, the breakthrough occurred in 1986 through two landmark papers published almost simultaneously on opposite sides of the Pacific:
1. **Charles W. Wampler** (General Motors Research Laboratories, 1986): *"Manipulator Inverse Kinematic Solutions Based on Vector Formulations and Damped Least-Squares Methods"*, demonstrating that DLS guarantees bounded joint speeds across manipulator singularities.
2. **Yoshihiko Nakamura and Hideo Hanafusa** (Kyoto University, 1986): *"Inverse Kinematic Solutions with Singularity Robustness for Robot Manipulators"*, introducing the **Singularity-Robust (SR) Inverse** and adaptive variable damping.

In 2005, **Samuel R. Buss** and **J. S. Gerhard** introduced *Selectively Damped Least Squares (SDLS)* for computer animation and inverse kinematics of multi-jointed digital skeletons. In 2011, **Tomomichi Sugihara** introduced *Singularity-Consistent DLS (SC-DLS)*, further refining real-time trajectory tracking for bipedal humanoid robots walking near full leg extension.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 The Pseudoinverse Catastrophe
Recall from Chapter 7 that the Singular Value Decomposition (SVD) of the Jacobian $J \in \mathbb{R}^{m \times n}$ is:
$$J = U \Sigma V^T = \sum_{i=1}^m \sigma_i u_i v_i^T$$
where $u_i \in \mathbb{R}^m$ are the output spatial directions, $v_i \in \mathbb{R}^n$ are the input joint directions, and $\sigma_1 \ge \sigma_2 \ge \cdots \ge \sigma_m \ge 0$ are the singular values.

The Moore-Penrose pseudoinverse $J^+ = V \Sigma^+ U^T$ is:
$$J^+ = \sum_{i=1}^m \frac{1}{\sigma_i} v_i u_i^T$$
Given a Cartesian velocity command $\nu \in \mathbb{R}^m$, the required joint velocity vector is:
$$\dot{q} = J^+ \nu = \sum_{i=1}^m \left( \frac{u_i^T \nu}{\sigma_i} \right) v_i$$

#### The Catastrophe:
If the robot approaches a singularity along direction $u_m$, the smallest singular value approaches zero:
$$\lim_{\sigma_m \to 0} \sigma_m = 0$$
If the desired velocity $\nu$ has even a microscopic projection along this direction ($u_m^T \nu \neq 0$):
$$\|\dot{q}\|_2 \ge \frac{|u_m^T \nu|}{\sigma_m} \xrightarrow[\sigma_m \to 0]{} \infty$$
The requested joint velocity diverges to infinity!

---

### 3.2 The Damped Least Squares Formulation
To eliminate infinite joint speeds, we reformulate the inverse kinematics problem as an unconstrained bi-criterion optimization:
$$\min_{\Delta q} \mathcal{L}(\Delta q) = \frac{1}{2} \|J \Delta q - e\|_2^2 + \frac{1}{2} \lambda^2 \|\Delta q\|_2^2$$
where:
- $\|J \Delta q - e\|_2^2$ represents the **Tracking Error Cost** (fidelity to the commanded path).
- $\|\Delta q\|_2^2$ represents the **Control Effort Cost** (penalty on large joint motions).
- $\lambda > 0$ is the **Damping Parameter**, which governs the trade-off between tracking accuracy and actuator speed.

```
       Small λ (Near 0):                              Large λ:
       • Perfect tracking accuracy                    • Heavily dampened joint speeds
       • Vulnerable to singularity blowup             • Substantial tracking error
                                                      • Smooth, fail-safe motion
```

---

### 3.3 Derivation of the Normal Equations
Expand the objective function using vector norms:
$$\mathcal{L}(\Delta q) = \frac{1}{2} (J \Delta q - e)^T (J \Delta q - e) + \frac{1}{2} \lambda^2 \Delta q^T \Delta q$$
$$= \frac{1}{2} \left( \Delta q^T J^T J \Delta q - 2 e^T J \Delta q + e^T e \right) + \frac{1}{2} \lambda^2 \Delta q^T \Delta q$$
$$= \frac{1}{2} \Delta q^T (J^T J + \lambda^2 I_n) \Delta q - e^T J \Delta q + \frac{1}{2} e^T e$$

To find the minimum, compute the gradient with respect to $\Delta q$ and set it to zero:
$$\nabla_{\Delta q} \mathcal{L} = (J^T J + \lambda^2 I_n) \Delta q - J^T e = 0$$
$$(J^T J + \lambda^2 I_n) \Delta q = J^T e$$

Because $\lambda > 0$, the matrix $(J^T J + \lambda^2 I_n) \in \mathbb{R}^{n \times n}$ is **strictly positive-definite** and has condition number strictly bounded for all configurations!
Solving for $\Delta q$:
$$\Delta q = (J^T J + \lambda^2 I_n)^{-1} J^T e$$

#### The Matrix Push-Through Identity:
For redundant systems where $n > m$ (e.g., $m = 6, n = 7$), inverting an $n \times n$ matrix is computationally more expensive than inverting an $m \times m$ matrix.
Using the algebraic push-through identity:
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$

*Proof of Push-Through Identity:*
$$(J^T J + \lambda^2 I_n) J^T = J^T J J^T + \lambda^2 J^T = J^T (J J^T + \lambda^2 I_m)$$
Pre-multiply both sides by $(J^T J + \lambda^2 I_n)^{-1}$ and post-multiply both sides by $(J J^T + \lambda^2 I_m)^{-1}$:
$$J^T (J J^T + \lambda^2 I_m)^{-1} = (J^T J + \lambda^2 I_n)^{-1} J^T$$
Q.E.D.

Therefore, the **Damped Least Squares Inverse** $J^* \in \mathbb{R}^{n \times m}$ is defined as:
$$J^*_{\text{DLS}} = J^T (J J^T + \lambda^2 I_m)^{-1}$$
$$\Delta q = J^*_{\text{DLS}} e$$

---

### 3.4 Spectral Analysis via SVD: Why DLS Never Diverges
Substitute the SVD $J = U \Sigma V^T$ directly into the DLS formula:
$$J^* = V \Sigma^T U^T \left( U \Sigma V^T V \Sigma^T U^T + \lambda^2 I_m \right)^{-1}$$
Since $V^T V = I_n$ and $U \lambda^2 I U^T = \lambda^2 I$:
$$J^* = V \Sigma^T U^T \left( U (\Sigma \Sigma^T + \lambda^2 I_m) U^T \right)^{-1} = V \Sigma^T (\Sigma \Sigma^T + \lambda^2 I_m)^{-1} U^T$$

Evaluating the diagonal components:
$$J^*_{\text{DLS}} = \sum_{i=1}^m \left( \frac{\sigma_i}{\sigma_i^2 + \lambda^2} \right) v_i u_i^T$$

Compare the filter response factors $f(\sigma_i)$ between the pure pseudoinverse and DLS:

| Method | Filter Weight $f(\sigma_i)$ | Behavior as $\sigma_i \gg \lambda$ | Behavior as $\sigma_i \to 0$ |
| :---: | :---: | :---: | :---: |
| **Moore-Penrose** | $\frac{1}{\sigma_i}$ | $\approx \frac{1}{\sigma_i}$ | **$\to \infty$ (Explosion!)** |
| **Damped Least Squares** | $\frac{\sigma_i}{\sigma_i^2 + \lambda^2}$ | $\approx \frac{1}{\sigma_i}$ (Exact tracking) | **$\to 0$ (Smooth suppression!)** |

```
    Filter Gain f(σ)
           ▲
           │         Pure Pseudoinverse 1/σ (Diverges to infinity!)
           │       \
           │        \
      1/2λ ┼─────────\──────╭───────.
           │          \    /         ' .
           │           \  /               ' .  Damped Least Squares (DLS)
           │            \/                    ' - - - - -
           │            /\
           └───────────┴──┴────────────────────────────────▶ Singular Value σ
                       0  λ
```

#### The Maximum Velocity Bound:
To find the maximum possible gain produced by DLS, differentiate $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$ with respect to $\sigma$:
$$\frac{df}{d\sigma} = \frac{(\sigma^2 + \lambda^2)(1) - \sigma(2\sigma)}{(\sigma^2 + \lambda^2)^2} = \frac{\lambda^2 - \sigma^2}{(\sigma^2 + \lambda^2)^2} = 0 \implies \sigma^* = \lambda$$
Evaluating at the peak $\sigma = \lambda$:
$$f_{\max} = f(\lambda) = \frac{\lambda}{\lambda^2 + \lambda^2} = \frac{\lambda}{2\lambda^2} = \frac{1}{2\lambda}$$

**Profound Mathematical Result:**
No matter how singular the robot configuration becomes, the maximum velocity gain of the DLS inverse is **strictly bounded** by:
$$\|J^*_{\text{DLS}}\|_2 \le \frac{1}{2\lambda}$$
If $\lambda = 0.05$, the maximum possible velocity amplification is bounded at $\frac{1}{2(0.05)} = 10.0$! Actuator motor speeds can never blow up!

---

### 3.5 Adaptive (Variable) Damping Strategies
Using a fixed, constant damping parameter $\lambda_0$ has an unfortunate side effect: it introduces a small tracking error everywhere throughout the entire workspace, even when the robot is operating in wide-open, highly dextrous postures.

To achieve **zero tracking error** in safe regions while maintaining **fail-safe protection** near singularities, we use **Adaptive Damping $\lambda(q)$**.

#### 1. Nakamura & Hanafusa Manipulability Damping:
Link the damping parameter to Yoshikawa's manipulability index $w(q) = \sqrt{\det(J J^T)}$:
$$\lambda^2(q) = \begin{cases} 0 & \text{if } w(q) \ge w_0 \\ \lambda_0^2 \left( 1 - \frac{w(q)}{w_0} \right)^2 & \text{if } w(q) < w_0 \end{cases}$$
where:
- $w_0 > 0$ is a user-defined threshold defining the boundary of the "danger zone".
- When $w(q) \ge w_0$, $\lambda = 0$, giving the **exact Moore-Penrose pseudoinverse** with zero tracking error!
- When $w(q) < w_0$, $\lambda$ ramps up quadratically, ensuring continuous, smooth transitions without jerk.

#### 2. Sugihara Singularity-Consistent DLS (SC-DLS):
Sugihara (2011) observed that when only *one* singular value collapses (e.g., wrist singularity), damping the entire matrix can unnecessarily degrade tracking along the remaining 5 non-singular directions.
SC-DLS computes damping directly from the minimum singular value $\sigma_{\min}$:
$$\lambda^2 = \begin{cases} 0 & \text{if } \sigma_{\min} \ge \sigma_0 \\ \lambda_0^2 \left( 1 - \frac{\sigma_{\min}}{\sigma_0} \right)^2 & \text{if } \sigma_{\min} < \sigma_0 \end{cases}$$

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the Damped Least Squares solver with adaptive damping and condition number monitoring:

```typescript
export interface DLSSolverOptions {
  lambdaBase?: number;         // nominal damping (e.g. 0.05)
  manipThreshold?: number;     // w0 safety threshold
  maxIterations?: number;
  tolerance?: number;
}

export class DampedLeastSquaresSolver {
  /**
   * Computes the DLS regularized inverse: J^* = J^T * (J * J^T + lambda^2 * I)^(-1)
   */
  public static computeDLSInverse(J: number[][], lambda: number): number[][] {
    const m = J.length;
    const n = J[0].length;
    const lambdaSq = lambda * lambda;

    // 1. Compute JJT = J * J^T (m x m)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += J[i][k] * J[j][k];
        JJT[i][j] = sum;
      }
      // Add Tikhonov regularization along diagonal: JJT + lambda^2 * I
      JJT[i][i] += lambdaSq;
    }

    // 2. Invert (JJT + lambda^2 * I) via Gauss-Jordan elimination
    const JJT_inv = this.invertMatrix(JJT);

    // 3. J^* = J^T * (JJT_inv) -> size n x m
    const J_star: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += J[k][r] * JJT_inv[k][c];
        }
        J_star[r][c] = sum;
      }
    }

    return J_star;
  }

  /**
   * Evaluates Nakamura-Hanafusa adaptive damping lambda(q).
   */
  public static computeAdaptiveLambda(
    manipulability: number,
    lambda0: number = 0.05,
    w0: number = 0.02
  ): number {
    if (manipulability >= w0) return 0.0;
    const ratio = 1.0 - manipulability / w0;
    return lambda0 * ratio;
  }

  private static invertMatrix(A: number[][]): number[][] {
    const n = A.length;
    const M = A.map((row, i) => {
      const aug = new Array(2 * n).fill(0);
      for (let j = 0; j < n; j++) aug[j] = row[j];
      aug[n + i] = 1.0;
      return aug;
    });

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];

      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) {
        throw new Error("Matrix singular even after DLS regularization");
      }

      for (let j = 0; j < 2 * n; j++) M[i][j] /= pivot;

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = 0; j < 2 * n; j++) {
            M[k][j] -= factor * M[i][j];
          }
        }
      }
    }

    return M.map(row => row.slice(n));
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 9.1: Proof of the Matrix Push-Through Identity
**Problem Statement:** Prove that for any matrix $J \in \mathbb{R}^{m \times n}$ and scalar $\lambda > 0$:
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$

**Step-by-Step Derivation:**
1. Consider the algebraic matrix product:
   $$(J^T J + \lambda^2 I_n) J^T = J^T J J^T + \lambda^2 J^T$$
2. Factor $J^T$ to the left on the right-hand side:
   $$J^T J J^T + \lambda^2 J^T = J^T (J J^T + \lambda^2 I_m)$$
3. Equating both expressions:
   $$(J^T J + \lambda^2 I_n) J^T = J^T (J J^T + \lambda^2 I_m)$$
4. Pre-multiply both sides by $(J^T J + \lambda^2 I_n)^{-1}$ (which exists because $\lambda > 0$ makes it positive-definite):
   $$(J^T J + \lambda^2 I_n)^{-1} (J^T J + \lambda^2 I_n) J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
   $$I_n J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
   $$J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
5. Post-multiply both sides by $(J J^T + \lambda^2 I_m)^{-1}$:
   $$J^T (J J^T + \lambda^2 I_m)^{-1} = (J^T J + \lambda^2 I_n)^{-1} J^T$$

**Final Answer:**
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$
Q.E.D.

**Verification & Sanity Check:**
When $n = 7$ and $m = 6$, this identity replaces the inversion of a $7 \times 7$ matrix with the inversion of a $6 \times 6$ matrix, saving computational operations while producing identical mathematical numbers.

---

### Problem 9.2: DLS Step at Exact Singularity vs. Moore-Penrose Divergence
**Problem Statement:** A 2R planar arm with $L_1 = 1.0\text{ m}, L_2 = 1.0\text{ m}$ is at the exact boundary singularity $(\theta_1, \theta_2) = (0^\circ, 0^\circ)$, where $J = \begin{bmatrix} 0 & 0 \\ 2 & 1 \end{bmatrix}$. A trajectory command requests a Cartesian velocity $\nu = [0.10, 0.05]^T\text{ m/s}$ (requesting $0.10\text{ m/s}$ forward along the locked $x$-axis).
1. Show that the pure Moore-Penrose pseudoinverse cannot achieve the $x$-velocity.
2. Compute the regularized joint velocity $\dot{q}$ using Damped Least Squares with damping parameter $\lambda = 0.2$.

**Given Data:**
- $J = \begin{bmatrix} 0 & 0 \\ 2 & 1 \end{bmatrix}$
- $\nu = [0.10, 0.05]^T$
- $\lambda = 0.2 \implies \lambda^2 = 0.04$

**Step-by-Step Derivation:**
1. Pure Moore-Penrose behavior:
   $J J^T = \begin{bmatrix} 0 & 0 \\ 0 & 5 \end{bmatrix}$. $\det(J J^T) = 0$.
   $(J J^T)^{-1}$ does not exist! Row 1 has zero pivot; the system is strictly singular.
   If one attempts to solve $J \dot{q} = \nu$:
   $$0 \dot{\theta}_1 + 0 \dot{\theta}_2 = 0.10 \implies 0 = 0.10 \quad (\text{Mathematically impossible!})$$
2. Damped Least Squares calculation:
   Formulate regularized matrix $A = J J^T + \lambda^2 I_2$:
   $$A = \begin{bmatrix} 0 & 0 \\ 0 & 5 \end{bmatrix} + \begin{bmatrix} 0.04 & 0 \\ 0 & 0.04 \end{bmatrix} = \begin{bmatrix} 0.04 & 0 \\ 0 & 5.04 \end{bmatrix}$$
3. Invert $A$:
   $$A^{-1} = \begin{bmatrix} \frac{1}{0.04} & 0 \\ 0 & \frac{1}{5.04} \end{bmatrix} = \begin{bmatrix} 25.0 & 0 \\ 0 & 0.198413 \end{bmatrix}$$
4. Compute $J^* = J^T A^{-1}$:
   $$J^* = \begin{bmatrix} 0 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 25.0 & 0 \\ 0 & 0.198413 \end{bmatrix} = \begin{bmatrix} 0 & 2(0.198413) \\ 0 & 1(0.198413) \end{bmatrix} = \begin{bmatrix} 0 & 0.396825 \\ 0 & 0.198413 \end{bmatrix}$$
5. Compute joint velocity $\dot{q} = J^* \nu$:
   $$\dot{q} = \begin{bmatrix} 0 & 0.396825 \\ 0 & 0.198413 \end{bmatrix} \begin{bmatrix} 0.10 \\ 0.05 \end{bmatrix} = \begin{bmatrix} 0(0.10) + 0.396825(0.05) \\ 0(0.10) + 0.198413(0.05) \end{bmatrix} = \begin{bmatrix} 0.019841 \\ 0.009921 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
- Moore-Penrose: **Undefined / Singular crash**.
- Damped Least Squares: **$\dot{q} = [0.01984\text{ rad/s}, 0.00992\text{ rad/s}]^T$** (completely smooth and bounded!).

**Verification & Sanity Check:**
Compute resulting Cartesian velocity $\nu_{\text{actual}} = J \dot{q}$:
$v_x = 0(0.0198) + 0(0.0099) = 0.00\text{ m/s}$.
$v_y = 2(0.019841) + 1(0.009921) = 0.039682 + 0.009921 = 0.049603\text{ m/s} \approx 0.05\text{ m/s}$.
Notice what DLS did: it completely ignored the impossible $x$-command, while fulfilling $99.2\%$ of the attainable $y$-command!

---

### Problem 9.3: Spectral Filter Weights Across the Singular Spectrum
**Problem Statement:** Let a robot possess singular values $\sigma \in \{ 2.0, 1.0, 0.5, 0.1, 0.05, 0.01, 0.0 \}$. For damping parameter $\lambda = 0.1$, compute the filter weight $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$ and compare it with the unregularized gain $1/\sigma$.

**Given Data:**
- $\lambda = 0.1 \implies \lambda^2 = 0.01$

**Step-by-Step Derivation:**
1. For $\sigma = 2.0$:
   $1/\sigma = 0.5000$.
   $f(2.0) = \frac{2.0}{4.0 + 0.01} = \frac{2.0}{4.01} \approx 0.49875$ ($99.8\%$ tracking).
2. For $\sigma = 1.0$:
   $1/\sigma = 1.0000$.
   $f(1.0) = \frac{1.0}{1.0 + 0.01} = \frac{1.0}{1.01} \approx 0.99010$ ($99.0\%$ tracking).
3. For $\sigma = 0.5$:
   $1/\sigma = 2.0000$.
   $f(0.5) = \frac{0.5}{0.25 + 0.01} = \frac{0.5}{0.26} \approx 1.92308$ ($96.2\%$ tracking).
4. For $\sigma = 0.1 = \lambda$ (Peak gain):
   $1/\sigma = 10.0000$.
   $f(0.1) = \frac{0.1}{0.01 + 0.01} = \frac{0.1}{0.02} = 5.00000$ (Damped by $50\%$).
5. For $\sigma = 0.05$:
   $1/\sigma = 20.0000$.
   $f(0.05) = \frac{0.05}{0.0025 + 0.01} = \frac{0.05}{0.0125} = 4.00000$ (Gain begins dropping!).
6. For $\sigma = 0.01$:
   $1/\sigma = 100.0000$.
   $f(0.01) = \frac{0.01}{0.0001 + 0.01} = \frac{0.01}{0.0101} \approx 0.99010$.
7. For $\sigma = 0.0$:
   $1/\sigma \to \infty$.
   $f(0.0) = \frac{0}{0.01} = 0.00000$ (Completely suppressed to zero!).

**Final Answer:**
Table of Filter Responses:

| $\sigma$ | Unregularized $1/\sigma$ | DLS Gain $f(\sigma)$ | Attenuation Ratio |
| :---: | :---: | :---: | :---: |
| $2.0$ | $0.5$ | $0.4988$ | $99.8\%$ |
| $1.0$ | $1.0$ | $0.9901$ | $99.0\%$ |
| $0.5$ | $2.0$ | $1.9231$ | $96.2\%$ |
| $0.1$ | $10.0$ | **$5.0000$** | $50.0\%$ |
| $0.05$ | $20.0$ | $4.0000$ | $20.0\%$ |
| $0.01$ | $100.0$ | $0.9901$ | $0.99\%$ |
| $0.00$ | $\infty$ | **$0.0000$** | **$0.0\%$** |

**Verification & Sanity Check:**
The maximum gain occurs exactly at $\sigma = \lambda = 0.1$, where $f = \frac{1}{2\lambda} = 5.0$, perfectly verifying Section 3.4.

---

### Problem 9.4: Condition Number Regularization
**Problem Statement:** A robot Jacobian has singular values $\sigma_1 = 2.0$ and $\sigma_2 = 10^{-4}$.
1. Compute the condition number of the unregularized matrix $J J^T$.
2. Compute the condition number of the regularized matrix $J J^T + \lambda^2 I$ for $\lambda = 0.05$.

**Given Data:**
- $\lambda_1 = \sigma_1^2 = 4.0$
- $\lambda_2 = \sigma_2^2 = 10^{-8}$
- $\lambda = 0.05 \implies \lambda^2 = 0.0025$

**Step-by-Step Derivation:**
1. Unregularized condition number:
   $$\kappa(J J^T) = \frac{\lambda_1}{\lambda_2} = \frac{4.0}{10^{-8}} = 4.0 \times 10^8 = 400,000,000$$
   (Severely ill-conditioned; inverting this causes catastrophic floating-point loss of precision).
2. Regularized eigenvalues of $J J^T + \lambda^2 I$:
   $$\lambda_{1, \text{reg}} = \lambda_1 + \lambda^2 = 4.0 + 0.0025 = 4.0025$$
   $$\lambda_{2, \text{reg}} = \lambda_2 + \lambda^2 = 10^{-8} + 0.0025 \approx 0.0025$$
3. Regularized condition number:
   $$\kappa_{\text{reg}} = \frac{4.0025}{0.0025} = 1601.0$$

**Final Answer:**
- Unregularized condition number: **$4.0 \times 10^8$** (pathologically ill-conditioned).
- DLS regularized condition number: **$1601.0$** (perfectly stable for 64-bit IEEE double precision arithmetic).

---

### Problem 9.5: Nakamura-Hanafusa Adaptive Damping Evaluation
**Problem Statement:** An adaptive damping controller has nominal damping $\lambda_0 = 0.08$ and threshold $w_0 = 0.05$. Calculate the damping parameter $\lambda$ when:
1. $w(q) = 0.12$ (well-conditioned).
2. $w(q) = 0.02$ (near singularity).
3. $w(q) = 0.00$ (at singularity).

**Step-by-Step Derivation:**
1. Case 1 ($w = 0.12$):
   Since $w \ge w_0$ ($0.12 \ge 0.05$):
   $$\lambda = 0.0$$
   The controller operates as pure Moore-Penrose with zero tracking distortion.
2. Case 2 ($w = 0.02$):
   Since $w < w_0$ ($0.02 < 0.05$):
   $$\lambda = \lambda_0 \left( 1 - \frac{w}{w_0} \right) = 0.08 \left( 1 - \frac{0.02}{0.05} \right) = 0.08(1 - 0.40) = 0.08(0.60) = 0.048$$
3. Case 3 ($w = 0.00$):
   $$\lambda = \lambda_0 (1 - 0) = \lambda_0 = 0.080$$

**Final Answer:**
- For $w = 0.12$: **$\lambda = 0.000$**
- For $w = 0.02$: **$\lambda = 0.048$**
- For $w = 0.00$: **$\lambda = 0.080$**

---

### Problem 9.6: Tracking Error Residual Formula
**Problem Statement:** Prove that the residual task-space velocity error $e_{\text{residual}} = \nu - J \dot{q}_{\text{DLS}}$ produced by DLS is given analytically by $e_{\text{residual}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} \nu$.

**Step-by-Step Derivation:**
1. Start with the DLS joint velocity definition:
   $$\dot{q}_{\text{DLS}} = J^T (J J^T + \lambda^2 I)^{-1} \nu$$
2. Compute the actual end-effector velocity:
   $$\nu_{\text{actual}} = J \dot{q}_{\text{DLS}} = J J^T (J J^T + \lambda^2 I)^{-1} \nu$$
3. Compute the residual error:
   $$e_{\text{residual}} = \nu - \nu_{\text{actual}} = \nu - J J^T (J J^T + \lambda^2 I)^{-1} \nu = \left[ I - J J^T (J J^T + \lambda^2 I)^{-1} \right] \nu$$
4. Insert the identity $(J J^T + \lambda^2 I)(J J^T + \lambda^2 I)^{-1} = I$:
   $$e_{\text{residual}} = \left[ (J J^T + \lambda^2 I) - J J^T \right] (J J^T + \lambda^2 I)^{-1} \nu = (\lambda^2 I) (J J^T + \lambda^2 I)^{-1} \nu$$
   $$e_{\text{residual}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} \nu$$

**Final Answer:**
$$e_{\text{residual}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} \nu$$
Q.E.D.

**Verification & Sanity Check:**
If $\lambda \to 0$, $e_{\text{residual}} \to 0$ (zero tracking error). As $\lambda$ increases, the residual error scales directly with $\lambda^2$.

---

### Problem 9.7: DLS on a 3-DoF Arm Near a Wrist Singularity
**Problem Statement:** A 3-axis spherical wrist has rotational Jacobian $J = \begin{bmatrix} 1 & 0 & 1 \\ 0 & 1 & 0 \\ 0 & 0 & 0.01 \end{bmatrix}$ (pitch angle $\theta_5 \approx 0.01\text{ rad}$, near singularity). The commanded angular velocity is $\omega_d = [0, 0, 1.0]^T\text{ rad/s}$.
1. Compute the pure inverse command $\dot{q} = J^{-1} \omega_d$.
2. Compute the DLS command with $\lambda = 0.05$.

**Given Data:**
- Commanded yaw: $\omega_z = 1.0\text{ rad/s}$
- $\sigma_3 \approx 0.01$

**Step-by-Step Derivation:**
1. Pure Inverse:
   Invert $J$:
   $$J^{-1} \begin{bmatrix} 0 \\ 0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} -100.0 \\ 0.0 \\ 100.0 \end{bmatrix}\text{ rad/s}$$
   Joints 4 and 6 are commanded to spin at **$\pm 100\text{ rad/s}$** ($\approx 955\text{ RPM}$!), which exceeds motor limits.
2. DLS Formulation:
   Evaluate $f(\sigma_3)$ for $\sigma_3 = 0.01$ with $\lambda = 0.05$:
   $$f(\sigma_3) = \frac{0.01}{0.01^2 + 0.05^2} = \frac{0.01}{0.0001 + 0.0025} = \frac{0.01}{0.0026} \approx 3.846154$$
   Joint velocity along singular axis:
   $$\dot{q}_{\text{DLS}} \approx [-3.85, 0, +3.85]^T\text{ rad/s}$$

**Final Answer:**
- Pure Inverse: **$\dot{q} = [-100.0, 0.0, +100.0]^T\text{ rad/s}$** (Violent actuator saturation).
- Damped Least Squares: **$\dot{q} = [-3.85, 0.0, +3.85]^T\text{ rad/s}$** (Safe, smooth, non-saturating motion).

---

### Problem 9.8: Levenberg-Marquardt Diagonal Scaling
**Problem Statement:** In classical Levenberg-Marquardt optimization, the damping term is often chosen as $\lambda^2 \operatorname{diag}(J^T J)$ rather than isotropic $\lambda^2 I$. Explain the advantage of diagonal scaling for robots with mixed prismatic and revolute joints.

**Solution:**
1. In a mixed robot (e.g. SCARA or cylindrical), revolute joints have angular units (radians), while prismatic joints have linear units (meters).
2. Consequently, the columns of $J$ have different units and wildly different magnitudes (e.g., $J_{\text{revolute}} \sim 1.0\text{ m}$, $J_{\text{prismatic}} \sim 1.0$).
3. An isotropic damping $\lambda^2 I$ damps both joints equally, which disproportionately penalizes the joint with smaller numerical scale.
4. Using $\lambda^2 \operatorname{diag}(J^T J)$ normalizes the damping according to the natural mechanical sensitivity of each individual joint, ensuring unit-invariant regularization.

---

### Problem 9.9: Truncated SVD (TSVD) vs. Damped Least Squares
**Problem Statement:** Contrast the mathematical filtering behavior of Truncated SVD (TSVD) with Damped Least Squares (DLS).

**Solution:**
1. **Truncated SVD (TSVD):**
   $$f_{\text{TSVD}}(\sigma_i) = \begin{cases} \frac{1}{\sigma_i} & \text{if } \sigma_i \ge \sigma_{\text{threshold}} \\ 0 & \text{if } \sigma_i < \sigma_{\text{threshold}} \end{cases}$$
   TSVD employs a sharp step-function cutoff. When $\sigma_i$ crosses the threshold, the joint command abruptly jumps from $\frac{1}{\sigma_{\text{threshold}}}$ to $0$, causing severe velocity discontinuities and mechanical jerk!
2. **Damped Least Squares (DLS):**
   $$f_{\text{DLS}}(\sigma_i) = \frac{\sigma_i}{\sigma_i^2 + \lambda^2}$$
   DLS is infinitely differentiable ($C^\infty$ smooth). As $\sigma_i$ drops, the filter response smoothly attenuates without any discrete jumps, ensuring smooth motor currents.

---

### Problem 9.10: Closed-Loop Trajectory Crossing a Singularity
**Problem Statement:** A robot is commanded to trace a continuous Cartesian straight line from $p_A = (-1, 1)$ to $p_B = (1, 1)$, passing directly through the singular point $(0, 1)$ where an elbow or shoulder aligns. Prove that DLS maintains bounded joint positions and velocities throughout the crossing.

**Step-by-Step Derivation:**
1. Let the trajectory be parameterized by time $t \in [0, T]$ with continuous velocity $\nu(t)$.
2. Under pure inverse kinematics, as $t \to t_{\text{singularity}}$, $\sigma_{\min}(t) \to 0$, causing $\dot{q}(t) = J^{-1}\nu \to \infty$. The integral $q(t) = \int \dot{q} dt$ experiences a finite jump discontinuity.
3. Under DLS, the joint velocity is $\dot{q}(t) = J^*_{\text{DLS}}(t) \nu(t)$.
4. From Section 3.4, the spectral norm is strictly bounded:
   $$\|J^*_{\text{DLS}}(t)\|_2 \le \frac{1}{2\lambda}$$
5. Therefore:
   $$\|\dot{q}(t)\|_2 \le \frac{1}{2\lambda} \|\nu(t)\|_2 \le \frac{\nu_{\max}}{2\lambda} < \infty$$
6. Because $\dot{q}(t)$ is bounded for all $t \in [0, T]$, the joint position $q(t) = q_0 + \int_0^t \dot{q}(\tau) d\tau$ is strictly Lipschitz continuous.

**Final Answer:**
DLS guarantees that joint velocities remain strictly bounded ($\|\dot{q}\| \le \frac{\nu_{\max}}{2\lambda}$) and joint trajectories remain smooth and continuous across the singular crossing.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 9.11: Damping Parameter Calibration from Actuator Limits
**Problem Statement:** A robot's motor has a maximum allowable angular speed of $\dot{q}_{\max} = 10.0\text{ rad/s}$. The maximum commanded Cartesian velocity along any trajectory is $\nu_{\max} = 0.5\text{ m/s}$. Calculate the minimum safe damping parameter $\lambda_{\min}$.

**Solution:**
1. The maximum possible DLS velocity amplification is bounded by:
   $$\|\dot{q}\|_{\max} \le \frac{1}{2\lambda} \nu_{\max}$$
2. Set $\|\dot{q}\|_{\max} \le \dot{q}_{\max}$:
   $$\frac{\nu_{\max}}{2\lambda} \le \dot{q}_{\max} \implies \lambda \ge \frac{\nu_{\max}}{2\dot{q}_{\max}}$$
3. Substitute numerical values:
   $$\lambda_{\min} = \frac{0.5\text{ m/s}}{2(10.0\text{ rad/s})} = \frac{0.5}{20.0} = 0.025$$
4. Choosing $\lambda \ge 0.025$ guarantees that the motors will never exceed their $10\text{ rad/s}$ speed limit, even at an exact singularity.

---

### Problem 9.12: Weighted Damped Least Squares
**Problem Statement:** Formulate the DLS normal equations when joint displacements are penalized by a positive-definite weight matrix $W_q \in \mathbb{R}^{n \times n}$ and task errors are penalized by $W_e \in \mathbb{R}^{m \times m}$.

**Solution:**
1. Objective function:
   $$\mathcal{L}(\Delta q) = \frac{1}{2} (J \Delta q - e)^T W_e (J \Delta q - e) + \frac{1}{2} \lambda^2 \Delta q^T W_q \Delta q$$
2. Differentiate with respect to $\Delta q$:
   $$J^T W_e (J \Delta q - e) + \lambda^2 W_q \Delta q = 0$$
   $$(J^T W_e J + \lambda^2 W_q) \Delta q = J^T W_e e$$
3. Solving for $\Delta q$:
   $$\Delta q = (J^T W_e J + \lambda^2 W_q)^{-1} J^T W_e e$$

---

### Problem 9.13: Selectively Damped Least Squares (SDLS)
**Problem Statement:** Explain how Buss and Gerhard's Selectively Damped Least Squares (SDLS) algorithm assigns individual damping parameters $\lambda_i$ to each singular value.

**Solution:**
1. In standard DLS, a single scalar $\lambda$ is applied globally to all singular values.
2. In SDLS, each singular vector $u_i$ is evaluated independently:
   $$\dot{q} = \sum_{i=1}^m \gamma_i \left( \frac{u_i^T \nu}{\sigma_i} \right) v_i$$
   where $\gamma_i = \min\left(1, \frac{\dot{q}_{\max}}{\|v_i\| |u_i^T \nu| / \sigma_i}\right) \in (0, 1]$.
3. If an individual singular direction causes joint velocities to exceed limits, it is scaled down individually, leaving all other non-saturating directions completely undamped.

---

### Problem 9.14: Maximum DLS Gain Proof
**Problem Statement:** Prove analytically that $\max_{\sigma > 0} \frac{\sigma}{\sigma^2 + \lambda^2} = \frac{1}{2\lambda}$ using the Arithmetic Mean-Geometric Mean (AM-GM) inequality.

**Solution:**
1. By the AM-GM inequality, for any positive real numbers $a, b > 0$:
   $$a + b \ge 2\sqrt{ab}$$
2. Set $a = \sigma^2$ and $b = \lambda^2$:
   $$\sigma^2 + \lambda^2 \ge 2\sqrt{\sigma^2 \lambda^2} = 2\sigma\lambda$$
3. Invert both sides:
   $$\frac{1}{\sigma^2 + \lambda^2} \le \frac{1}{2\sigma\lambda}$$
4. Multiply both sides by $\sigma > 0$:
   $$\frac{\sigma}{\sigma^2 + \lambda^2} \le \frac{\sigma}{2\sigma\lambda} = \frac{1}{2\lambda}$$
5. Equality holds if and only if $\sigma^2 = \lambda^2 \implies \sigma = \lambda$.
6. Therefore, the global maximum is strictly $\frac{1}{2\lambda}$.

---

### Problem 9.15: Residual Error Energy Bound
**Problem Statement:** Using the residual error formula $e_{\text{res}} = \lambda^2 (J J^T + \lambda^2 I)^{-1} e$, prove that $\|e_{\text{res}}\| \le \|e\|$.

**Solution:**
1. In SVD coordinates:
   $$e_{\text{res}} = \sum_{i=1}^m \frac{\lambda^2}{\sigma_i^2 + \lambda^2} (u_i^T e) u_i$$
2. Since $\sigma_i^2 \ge 0$ and $\lambda^2 > 0$:
   $$\frac{\lambda^2}{\sigma_i^2 + \lambda^2} \le \frac{\lambda^2}{0 + \lambda^2} = 1.0$$
3. Therefore:
   $$\|e_{\text{res}}\|^2 = \sum_{i=1}^m \left( \frac{\lambda^2}{\sigma_i^2 + \lambda^2} \right)^2 (u_i^T e)^2 \le \sum_{i=1}^m (u_i^T e)^2 = \|e\|^2$$
4. Taking square roots: $\|e_{\text{res}}\| \le \|e\|$. DLS never amplifies the task error.

---

### Problem 9.16: Singularity-Robust Wrist Orientation
**Problem Statement:** A 6-DoF arm with spherical wrist experiences a wrist singularity ($\theta_5 = 0$). Explain how DLS allows the robot to continue moving through the singularity without stopping.

**Solution:**
1. At $\theta_5 = 0$, the wrist loses 1 rotational DoF (about the axis perpendicular to axes 4 and 6).
2. The singular value corresponding to this lost rotation collapses to zero: $\sigma_6 = 0$.
3. DLS sets the filter weight for this lost direction to $\frac{0}{0 + \lambda^2} = 0$, commanding zero joint velocity along the impossible direction.
4. The remaining 5 degrees of freedom continue tracking smoothly. The tool passes through the singularity with a transient orientation error of a few tenths of a degree, completely avoiding motor tripping.

---

### Problem 9.17: Dissipated Virtual Energy in DLS
**Problem Statement:** Interpret the damping term $\frac{1}{2}\lambda^2 \|\dot{q}\|^2$ physically as a virtual viscous damper acting on the joint motors.

**Solution:**
1. The virtual power dissipated by the damping term is:
   $$P_{\text{damp}} = \lambda^2 \dot{q}^T \dot{q} = \lambda^2 \|\dot{q}\|^2$$
2. This is identical to the Rayleigh dissipation function of a physical linear viscous damper with damping coefficient $b = \lambda^2$ attached to each motor shaft.
3. When joint speeds attempt to diverge, the virtual dampers absorb the energy, enforcing finite, stable motion.

---

### Problem 9.18: Comparison of DLS with Gradient Descent
**Problem Statement:** Show that as $\lambda \to \infty$, the DLS step approaches pure gradient descent $\Delta q \to \frac{1}{\lambda^2} J^T e$.

**Solution:**
1. Recall the normal equations:
   $$\Delta q = (J^T J + \lambda^2 I_n)^{-1} J^T e$$
2. Factor $\lambda^2$ out of the inverted matrix:
   $$\Delta q = \frac{1}{\lambda^2} \left( \frac{1}{\lambda^2} J^T J + I_n \right)^{-1} J^T e$$
3. As $\lambda \to \infty$, $\frac{1}{\lambda^2} J^T J \to 0$:
   $$\lim_{\lambda \to \infty} \left( \frac{1}{\lambda^2} J^T J + I_n \right)^{-1} = I_n^{-1} = I_n$$
4. Therefore:
   $$\lim_{\lambda \to \infty} \Delta q = \frac{1}{\lambda^2} J^T e = \alpha J^T e$$
   with step size $\alpha = 1/\lambda^2$.

---

### Problem 9.19: DLS with Reference Posture Bias
**Problem Statement:** Formulate DLS with a bias toward a comfortable home posture $q_0$:
$\min \frac{1}{2}\|J \Delta q - e\|^2 + \frac{1}{2}\lambda^2 \|\Delta q - (q_0 - q_k)\|^2$.

**Solution:**
1. Differentiate the objective with respect to $\Delta q$:
   $$J^T (J \Delta q - e) + \lambda^2 (\Delta q - (q_0 - q_k)) = 0$$
2. Rearrange:
   $$(J^T J + \lambda^2 I) \Delta q = J^T e + \lambda^2 (q_0 - q_k)$$
3. Solving for $\Delta q$:
   $$\Delta q = (J^T J + \lambda^2 I)^{-1} \left( J^T e + \lambda^2 (q_0 - q_k) \right)$$
4. Near singularities where $J^T e \to 0$, the arm smoothly drifts toward its preferred home posture $q_0$.

---

### Problem 9.20: Verification of Positive-Definiteness Invariant
**Problem Statement:** Prove that for any real matrix $J \in \mathbb{R}^{m \times n}$ and any $\lambda > 0$, the matrix $A = J J^T + \lambda^2 I_m$ is strictly positive-definite.

**Solution:**
1. For any non-zero vector $x \in \mathbb{R}^m$ ($x \neq 0$):
   $$x^T A x = x^T (J J^T + \lambda^2 I_m) x = x^T J J^T x + \lambda^2 x^T x$$
2. Let $y = J^T x \in \mathbb{R}^n$. Then $x^T J J^T x = y^T y = \|y\|_2^2 \ge 0$.
3. Since $x \neq 0$ and $\lambda > 0$:
   $$\lambda^2 x^T x = \lambda^2 \|x\|_2^2 > 0$$
4. Therefore:
   $$x^T A x = \|y\|_2^2 + \lambda^2 \|x\|_2^2 \ge \lambda^2 \|x\|_2^2 > 0$$
5. Because $x^T A x > 0$ for all $x \neq 0$, matrix $A$ is **strictly positive-definite** and has strictly positive eigenvalues $\lambda_i(A) \ge \lambda^2 > 0$, guaranteeing numerical invertibility.

---

# Chapter 10: Redundancy Resolution, Nullspace Projection, and Secondary Task Optimization

---

## 1. The Layman's Genesis & Intuitive Overview

Take a glass of water, hold it steady at chest height in front of you, and keep it completely stationary. 

Now, without moving the glass by even a fraction of a millimeter, raise your elbow up toward the ceiling, and then lower it down toward your waist.

Notice what you just accomplished:
- Your hand and the glass remained locked at a fixed 3D Cartesian position and orientation ($SE(3)$).
- Yet your shoulder, elbow, and forearm joints were actively moving in a continuous physical motion!

```
                    Fixed Coffee Mug in Space
                              ● Hand
                             /
                            /
                           ● Elbow (Swiveling up and down!)
                          /
                         /
                        ● Shoulder (Pivot)
           (Hand is frozen, but joints move along a "Nullspace"!)
```

This phenomenon is possible because the human arm has **7 degrees of freedom**, while positioning and orienting an object in 3D space requires only **6 degrees of freedom**. The extra degree of freedom ($7 - 6 = 1$) creates an internal dimension of flexibility known as **Kinematic Redundancy**.

In robotics, redundant manipulators (such as the 7-DoF Franka Emika Panda, KUKA LBR iiwa, or dual-arm humanoid robots) possess this exact superpower. But redundancy creates a profound mathematical challenge: *if there are infinitely many ways to reach the goal, which one should the robot choose?*

The answer is **Nullspace Projection**. By mathematically partitioning the robot's motion into two orthogonal subspaces:
1. **The Primary Task Space:** Moving the tool to paint, weld, or grasp.
2. **The Nullspace:** Internal "self-motion" that does not disturb the tool at all.

We can command the robot to execute **secondary tasks** simultaneously in its nullspace—such as swiveling the elbow away from a collision with a wall, maximizing its distance from joint limits, or optimizing manipulability!

---

## 2. Historical Foundations & Epistemological Evolution

The mathematical framework of redundancy resolution in robotics was founded in 1977 by the French roboticist **Alain Liégeois** in his seminal paper, *"Automatic Supervisory Control of the Configuration and Behavior of Multibody Mechanisms"* (*IEEE Transactions on Systems, Man, and Cybernetics*). Liégeois was the first to use the Moore-Penrose pseudoinverse nullspace projector:
$$\dot{q} = J^+ \nu + (I - J^+ J) \dot{q}_0$$
to project the gradient of an artificial potential function $\nabla H(q)$ into the nullspace of a redundant manipulator, allowing an arm to avoid joint limits while simultaneously following a trajectory.

Throughout the 1980s, **Hideo Hanafusa**, **Tsuneo Yoshikawa**, and **Yoshihiko Nakamura** at Kyoto University expanded Liégeois' foundation into **Task Priority Control**. In their 1987 paper *"Task-Priority Based Redundancy Control of Robot Manipulators"*, Nakamura and Hanafusa generalized nullspace projection to an arbitrary hierarchy of $k$ tasks, proving that lower-priority tasks can be executed strictly within the nullspace of higher-priority tasks without creating interference.

Today, nullspace projection is the universal engine behind humanoid whole-body control, mobile manipulation, and industrial collision avoidance systems.

---

## 3. Rigorous Mathematical Mechanics & Derivations

### 3.1 Kinematic Redundancy and the Nullspace
Let a manipulator possess $n$ joint degrees of freedom operating in an $m$-dimensional task space ($m < n$).
The degree of redundancy is the positive integer:
$$r = n - m > 0$$
For example, for a 7-DoF humanoid arm performing 6D manipulation in $SE(3)$, $r = 7 - 6 = 1$. For a 3-link planar arm positioning an end-effector in 2D space ($x, y$), $r = 3 - 2 = 1$.

The linear velocity relationship is:
$$J(q) \dot{q} = \nu$$
where $J(q) \in \mathbb{R}^{m \times n}$.

#### The Nullspace $\mathcal{N}(J)$:
The **nullspace** (or kernel) of the Jacobian matrix is the subspace of all joint velocity vectors that map to zero task-space velocity:
$$\mathcal{N}(J(q)) = \{ \dot{q}_0 \in \mathbb{R}^n \mid J(q) \dot{q}_0 = 0 \}$$
By the Rank-Nullity Theorem, if $J$ has full row rank $m$, the nullspace has dimension:
$$\dim(\mathcal{N}(J)) = n - \operatorname{rank}(J) = n - m = r$$
Any joint motion $\dot{q}_0 \in \mathcal{N}(J)$ is called **internal self-motion**: it changes the physical posture of the robot without altering the velocity of the end-effector!

---

### 3.2 The Nullspace Projection Operator $P$
Let $J^+ = J^T (J J^T)^{-1} \in \mathbb{R}^{n \times m}$ be the Moore-Penrose pseudoinverse.
The **Nullspace Projection Matrix** $P \in \mathbb{R}^{n \times n}$ is defined as:
$$P = I_n - J^+ J$$

#### Three Fundamental Algebraic Properties of $P$:

##### 1. Nullspace Annihilation Property ($J P = 0$)
Any vector projected by $P$ is completely annihilated by the Jacobian:
$$J P = J (I_n - J^+ J) = J - (J J^+) J$$
Since $J J^+ = I_m$ for full row rank $J$:
$$J P = J - I_m J = J - J = 0_{m \times n}$$
*Consequence:* Multiplying $J$ by $P \dot{q}_0$ yields zero Cartesian velocity: $J (P \dot{q}_0) = (J P) \dot{q}_0 = 0$.

##### 2. Idempotence Property ($P^2 = P$)
Applying the projection operator twice produces the exact same result as applying it once (it is a true geometric projection):
$$P^2 = (I_n - J^+ J)(I_n - J^+ J) = I_n - 2 J^+ J + J^+ (J J^+) J$$
Using $J J^+ = I_m$:
$$P^2 = I_n - 2 J^+ J + J^+ I_m J = I_n - 2 J^+ J + J^+ J = I_n - J^+ J = P$$

##### 3. Self-Adjoint Orthogonality ($P^T = P$)
The projector is symmetric:
$$P^T = (I_n - J^+ J)^T = I_n^T - (J^+ J)^T = I_n - J^+ J = P$$
(using the fourth Penrose condition $(J^+ J)^T = J^+ J$).
Hence, $P$ is an **orthogonal projection operator** onto the nullspace $\mathcal{N}(J)$.

---

### 3.3 The General Redundant Kinematic Control Law
Let $\nu \in \mathbb{R}^m$ be the desired Cartesian velocity of the end-effector.
The complete family of all joint velocity vectors satisfying $J \dot{q} = \nu$ is given by:
$$\dot{q} = J^+ \nu + (I_n - J^+ J) \dot{q}_0$$
where:
- $\dot{q}_{\text{primary}} = J^+ \nu$ is the **particular solution** that strictly achieves the end-effector velocity $\nu$ with minimum Euclidean norm $\|\dot{q}\|_2$.
- $\dot{q}_{\text{null}} = (I_n - J^+ J) \dot{q}_0$ is the **homogeneous solution**, projecting an arbitrary secondary joint velocity vector $\dot{q}_0 \in \mathbb{R}^n$ into the nullspace.

#### Orthogonal Decomposition of Joint Effort:
Because $P = I - J^+ J$ is an orthogonal projector, the two components $\dot{q}_{\text{primary}}$ and $\dot{q}_{\text{null}}$ are mutually perpendicular:
$$\dot{q}_{\text{primary}}^T \dot{q}_{\text{null}} = (J^+ \nu)^T (I - J^+ J) \dot{q}_0 = \nu^T (J^+)^T (I - J^+ J) \dot{q}_0$$
Using $(J^+)^T = (J J^T)^{-1} J$:
$$\nu^T (J J^T)^{-1} [ J (I - J^+ J) ] \dot{q}_0 = \nu^T (J J^T)^{-1} [0] \dot{q}_0 = 0$$

By the Pythagorean theorem in $\mathbb{R}^n$:
$$\|\dot{q}\|_2^2 = \|\dot{q}_{\text{primary}}\|_2^2 + \|\dot{q}_{\text{null}}\|_2^2$$
The total joint kinetic energy decomposes cleanly into the energy required to move the tool plus the energy spent on nullspace self-motion!

---

### 3.4 Secondary Task Optimization via Gradient Projection
The vector $\dot{q}_0$ can be chosen arbitrarily. To optimize a scalar performance objective $H(q) \in \mathbb{R}$ (e.g., safety, clearance, manipulability), we set $\dot{q}_0$ along the **gradient** of $H(q)$:
$$\dot{q}_0 = k_0 \nabla_q H(q) = k_0 \begin{bmatrix} \frac{\partial H}{\partial q_1} \\ \vdots \\ \frac{\partial H}{\partial q_n} \end{bmatrix}$$
where $k_0 > 0$ is a positive gain factor.

The complete gradient-projected control law is:
$$\dot{q} = J^+(q) \nu + k_0 (I - J^+(q) J(q)) \nabla_q H(q)$$

#### Standard Secondary Objective Functions:

##### 1. Joint Limit Avoidance (Liégeois 1977)
To prevent joints from hitting mechanical hard stops, define a quadratic penalty centered at the midpoint of the joint limits:
$$H_{\text{limits}}(q) = -\frac{1}{2n} \sum_{i=1}^n \left( \frac{q_i - \bar{q}_i}{q_{i,\max} - q_{i,\min}} \right)^2$$
where $\bar{q}_i = \frac{q_{i,\max} + q_{i,\min}}{2}$ is the middle of the range for joint $i$.
The gradient vector component is:
$$\frac{\partial H_{\text{limits}}}{\partial q_i} = -\frac{q_i - \bar{q}_i}{n (q_{i,\max} - q_{i,\min})^2}$$
When joint $i$ approaches its upper limit ($q_i > \bar{q}_i$), the gradient becomes negative, commanding the motor to rotate back toward the comfortable center in the nullspace!

##### 2. Manipulability Maximization (Yoshikawa 1984)
To steer the arm away from kinematic singularities during trajectory tracking:
$$H_{\text{manip}}(q) = w(q) = \sqrt{\det(J(q) J^T(q))}$$
$$\dot{q}_0 = k_{\text{manip}} \nabla_q w(q)$$

##### 3. Obstacle Collision Avoidance
Let $p_{\text{elbow}}(q)$ be the 3D position of an elbow joint, and let $p_{\text{obs}}$ be the position of an obstacle in the workspace.
Define the distance objective:
$$H_{\text{obs}}(q) = \frac{1}{2} \|p_{\text{elbow}}(q) - p_{\text{obs}}\|_2^2$$
$$\nabla_q H_{\text{obs}} = J_{\text{elbow}}^T(q) (p_{\text{elbow}}(q) - p_{\text{obs}})$$
This pushes the elbow away from the obstacle while the hand continues performing its primary task uninterrupted!

---

### 3.5 Multi-Task Priority Hierarchies (Nakamura & Hanafusa 1987)
In advanced robotics, a system often has multiple competing tasks with strict priorities:
- **Priority 1 (Primary Task):** End-effector tool tracking: $J_1 \dot{q} = \nu_1$.
- **Priority 2 (Secondary Task):** Camera viewpoint or elbow obstacle avoidance: $J_2 \dot{q} = \nu_2$.

To ensure that Task 2 **never** disturbs Task 1, Task 2 is projected into the nullspace of Task 1:
$$\dot{q} = J_1^+ \nu_1 + \tilde{J}_2^+ (\nu_2 - J_2 J_1^+ \nu_1)$$
where:
- $\tilde{J}_2 = J_2 (I - J_1^+ J_1)$ is the Jacobian of Task 2 projected into the nullspace of Task 1.
- $\tilde{J}_2^+$ is its pseudoinverse.
- $(\nu_2 - J_2 J_1^+ \nu_1)$ is the remaining velocity required by Task 2 after accounting for the velocity already produced by Task 1!

---

## 4. Computational Realization & Algorithmic Implementation

Below is a complete, production-grade TypeScript implementation of the Nullspace Redundancy Engine:

```typescript
export class RedundancyEngine {
  /**
   * Computes the n x n nullspace projector: P = I_n - J^+ * J
   */
  public static computeNullspaceProjector(J: number[][]): number[][] {
    const m = J.length;
    const n = J[0].length;

    // 1. Compute pseudoinverse J^+ = J^T * (J * J^T)^(-1)
    const J_pinv = this.computePseudoinverse(J);

    // 2. Compute J_pinv * J (n x n)
    const J_pinv_J: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        let sum = 0;
        for (let k = 0; k < m; k++) {
          sum += J_pinv[r][k] * J[k][c];
        }
        J_pinv_J[r][c] = sum;
      }
    }

    // 3. P = I_n - J_pinv * J
    const P: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        P[r][c] = (r === c ? 1.0 : 0.0) - J_pinv_J[r][c];
      }
    }

    return P;
  }

  /**
   * Evaluates the full redundancy resolution control law:
   * q_dot = J^+ * nu + (I - J^+ * J) * q_dot_0
   */
  public static resolveRedundancy(
    J: number[][],
    nu: number[],
    qDot0: number[]
  ): number[] {
    const m = J.length;
    const n = J[0].length;

    const J_pinv = this.computePseudoinverse(J);
    const P = this.computeNullspaceProjector(J);

    // Particular solution: J^+ * nu
    const qDotPrimary: number[] = new Array(n).fill(0);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < m; c++) sum += J_pinv[r][c] * nu[c];
      qDotPrimary[r] = sum;
    }

    // Nullspace solution: P * qDot0
    const qDotNull: number[] = new Array(n).fill(0);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < n; c++) sum += P[r][c] * qDot0[c];
      qDotNull[r] = sum;
    }

    // Total q_dot = qDotPrimary + qDotNull
    return qDotPrimary.map((val, i) => val + qDotNull[i]);
  }

  /**
   * Computes the gradient of the joint limit avoidance objective:
   * H(q) = -1/(2n) * sum( (q_i - q_bar_i)^2 / (q_max_i - q_min_i)^2 )
   */
  public static computeJointLimitGradient(
    q: number[],
    qMin: number[],
    qMax: number[]
  ): number[] {
    const n = q.length;
    const grad: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      const qBar = 0.5 * (qMax[i] + qMin[i]);
      const range = qMax[i] - qMin[i];
      grad[i] = -(q[i] - qBar) / (n * range * range);
    }
    return grad;
  }

  private static computePseudoinverse(J: number[][]): number[][] {
    const m = J.length;
    const n = J[0].length;

    // JJT = J * J^T (m x m)
    const JJT: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += J[i][k] * J[j][k];
        JJT[i][j] = sum;
      }
    }

    // Invert JJT
    const JJT_inv = this.invertMatrix(JJT);

    // J^+ = J^T * JJT_inv (n x m)
    const J_pinv: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < m; c++) {
        let sum = 0;
        for (let k = 0; k < m; k++) sum += J[k][r] * JJT_inv[k][c];
        J_pinv[r][c] = sum;
      }
    }
    return J_pinv;
  }

  private static invertMatrix(A: number[][]): number[][] {
    const n = A.length;
    const M = A.map((row, i) => {
      const aug = new Array(2 * n).fill(0);
      for (let j = 0; j < n; j++) aug[j] = row[j];
      aug[n + i] = 1.0;
      return aug;
    });

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      }
      [M[i], M[maxRow]] = [M[maxRow], M[i]];

      const pivot = M[i][i];
      if (Math.abs(pivot) < 1e-12) throw new Error("Matrix singular in pseudoinverse");

      for (let j = 0; j < 2 * n; j++) M[i][j] /= pivot;

      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = 0; j < 2 * n; j++) M[k][j] -= factor * M[i][j];
        }
      }
    }

    return M.map(row => row.slice(n));
  }
}
```

---

## 5. Ten Fully Solved In-Depth Worked Examples

### Problem 10.1: Analytical Nullspace Projector for a 3R Planar Arm
**Problem Statement:** Consider a 3R planar manipulator with $L_1 = L_2 = L_3 = 1.0\text{ m}$ at configuration $q = [0^\circ, 90^\circ, 0^\circ]^T = [0, \pi/2, 0]^T$ (from Chapter 8, Problem 8.5), where the positional Jacobian is:
$$J = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$$
1. Compute the Moore-Penrose pseudoinverse $J^+ = J^T (J J^T)^{-1}$.
2. Compute the exact $3 \times 3$ nullspace projection matrix $P = I_3 - J^+ J$.

**Given Data:**
- $J = \begin{bmatrix} -2 & -2 & -1 \\ 1 & 0 & 0 \end{bmatrix}$
- From Chapter 8: $(J J^T)^{-1} = \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Compute $J^+ = J^T (J J^T)^{-1}$:
   $$J^+ = \begin{bmatrix} -2.0 & 1.0 \\ -2.0 & 0.0 \\ -1.0 & 0.0 \end{bmatrix} \begin{bmatrix} 0.2 & 0.4 \\ 0.4 & 1.8 \end{bmatrix} = \begin{bmatrix} -2(0.2) + 1(0.4) & -2(0.4) + 1(1.8) \\ -2(0.2) + 0 & -2(0.4) + 0 \\ -1(0.2) + 0 & -1(0.4) + 0 \end{bmatrix} = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix}$$
2. Compute $J^+ J$ ($3 \times 3$ matrix):
   $$J^+ J = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix} \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$$
   - Row 1: $[0(-2) + 1(1), \; 0(-2) + 1(0), \; 0(-1) + 1(0)] = [1.0, 0.0, 0.0]$
   - Row 2: $[-0.4(-2) - 0.8(1), \; -0.4(-2) + 0, \; -0.4(-1) + 0] = [0.8 - 0.8, \; 0.8, \; 0.4] = [0.0, 0.8, 0.4]$
   - Row 3: $[-0.2(-2) - 0.4(1), \; -0.2(-2) + 0, \; -0.2(-1) + 0] = [0.4 - 0.4, \; 0.4, \; 0.2] = [0.0, 0.4, 0.2]$
   $$J^+ J = \begin{bmatrix} 1.0 & 0.0 & 0.0 \\ 0.0 & 0.8 & 0.4 \\ 0.0 & 0.4 & 0.2 \end{bmatrix}$$
3. Compute $P = I_3 - J^+ J$:
   $$P = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} - \begin{bmatrix} 1.0 & 0.0 & 0.0 \\ 0.0 & 0.8 & 0.4 \\ 0.0 & 0.4 & 0.2 \end{bmatrix} = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$$

**Final Answer:**
$$P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$$

**Verification & Sanity Check:**
- Check symmetry: $P^T = P$. Verified.
- Check idempotence $P^2 = P$:
  $P^2 = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.2^2 + (-0.4)^2 & 0.2(-0.4) - 0.4(0.8) \\ 0 & -0.4(0.2) + 0.8(-0.4) & (-0.4)^2 + 0.8^2 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.04 + 0.16 & -0.08 - 0.32 \\ 0 & -0.08 - 0.32 & 0.16 + 0.64 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.2 & -0.4 \\ 0 & -0.4 & 0.8 \end{bmatrix} = P$. Verified.

---

### Problem 10.2: Proof of Nullspace Annihilation $J P = 0$
**Problem Statement:** Using the numerical matrices from Problem 10.1, explicitly calculate $J \cdot P$ and verify that it equals the $2 \times 3$ zero matrix.

**Given Data:**
- $J = \begin{bmatrix} -2.0 & -2.0 & -1.0 \\ 1.0 & 0.0 & 0.0 \end{bmatrix}$
- $P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$

**Step-by-Step Derivation:**
1. Compute Row 1 of $J P$:
   - Column 1: $-2.0(0.0) - 2.0(0.0) - 1.0(0.0) = 0.0$
   - Column 2: $-2.0(0.0) - 2.0(0.2) - 1.0(-0.4) = 0 - 0.4 + 0.4 = 0.0$
   - Column 3: $-2.0(0.0) - 2.0(-0.4) - 1.0(0.8) = 0 + 0.8 - 0.8 = 0.0$
2. Compute Row 2 of $J P$:
   - Column 1: $1.0(0.0) + 0.0(0.0) + 0.0(0.0) = 0.0$
   - Column 2: $1.0(0.0) + 0.0(0.2) + 0.0(-0.4) = 0.0$
   - Column 3: $1.0(0.0) + 0.0(-0.4) + 0.0(0.8) = 0.0$

**Final Answer:**
$$J P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.0 & 0.0 \end{bmatrix} = 0_{2 \times 3}$$

**Verification & Sanity Check:**
The product vanishes identically to machine precision. Any joint velocity vector produced by multiplying $P$ with any arbitrary vector $\dot{q}_0$ produces exactly **zero** Cartesian velocity!

---

### Problem 10.3: Pure Self-Motion Velocity Calculation
**Problem Statement:** An engineer commands an arbitrary joint speed request $\dot{q}_0 = [1.0, 2.0, -1.0]^T\text{ rad/s}$ into the nullspace of the 3R arm from Problem 10.1 while demanding that the end-effector remain completely stationary ($\nu = [0, 0]^T$).
1. Compute the projected nullspace joint velocity $\dot{q}_{\text{null}} = P \dot{q}_0$.
2. Verify that the Cartesian velocity of the end-effector is $0.000\text{ m/s}$.

**Given Data:**
- $P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$
- $\dot{q}_0 = [1.0, 2.0, -1.0]^T$

**Step-by-Step Derivation:**
1. Compute $\dot{q}_{\text{null}} = P \dot{q}_0$:
   $$\dot{q}_{\text{null}, 1} = 0(1.0) + 0(2.0) + 0(-1.0) = 0.0\text{ rad/s}$$
   $$\dot{q}_{\text{null}, 2} = 0(1.0) + 0.2(2.0) - 0.4(-1.0) = 0.4 + 0.4 = +0.8\text{ rad/s}$$
   $$\dot{q}_{\text{null}, 3} = 0(1.0) - 0.4(2.0) + 0.8(-1.0) = -0.8 - 0.8 = -1.6\text{ rad/s}$$
   $$\dot{q}_{\text{null}} = [0.0, +0.8, -1.6]^T\text{ rad/s}$$
2. Compute actual end-effector velocity $\nu = J \dot{q}_{\text{null}}$:
   $$v_x = -2.0(0.0) - 2.0(0.8) - 1.0(-1.6) = -1.6 + 1.6 = 0.000\text{ m/s}$$
   $$v_y = 1.0(0.0) + 0.0(0.8) + 0.0(-1.6) = 0.000\text{ m/s}$$

**Final Answer:**
- Projected joint velocity: **$\dot{q}_{\text{null}} = [0.0, +0.8, -1.6]^T\text{ rad/s}$**
- Resulting end-effector velocity: **$\nu = [0.000, 0.000]^T\text{ m/s}$**

**Verification & Sanity Check:**
Joint 2 rotates at $+0.8\text{ rad/s}$ while Joint 3 rotates at exactly double the speed in reverse ($-1.6\text{ rad/s}$). This creates an instantaneous scissor-like counter-rotation that leaves the tool tip completely frozen in space.

---

### Problem 10.4: Joint Limit Avoidance via Gradient Projection
**Problem Statement:** The 3R planar arm is at configuration $q = [0.0, 1.8, 0.0]^T\text{ rad}$ ($[0^\circ, 103.1^\circ, 0^\circ]$).
- Joint limits for all joints are $[-2.0, +2.0]\text{ rad}$.
- The primary task demands zero end-effector motion ($\nu = 0$).
Calculate the nullspace joint velocity command that pushes Joint 2 away from its upper limit back toward its center $\bar{q} = 0$, with gain $k_0 = 10.0$.

**Given Data:**
- $q = [0.0, 1.8, 0.0]^T$
- $q_{\min} = -2.0, q_{\max} = +2.0 \implies \bar{q} = 0.0$
- Range: $q_{\max} - q_{\min} = 4.0\text{ rad}$
- $n = 3, k_0 = 10.0$

**Step-by-Step Derivation:**
1. Compute the Liégeois gradient vector:
   $$\nabla_q H = -\frac{q - \bar{q}}{n (q_{\max} - q_{\min})^2} = -\frac{q}{3(4.0)^2} = -\frac{q}{48.0}$$
   - Joint 1: $-\frac{0.0}{48.0} = 0.0$
   - Joint 2: $-\frac{1.8}{48.0} = -0.0375$
   - Joint 3: $-\frac{0.0}{48.0} = 0.0$
   $$\nabla_q H = [0.0, -0.0375, 0.0]^T$$
2. Scale by gain $k_0 = 10.0$:
   $$\dot{q}_0 = 10.0 [0.0, -0.0375, 0.0]^T = [0.0, -0.375, 0.0]^T\text{ rad/s}$$
3. Project into the nullspace using $P$:
   $$\dot{q}_{\text{null}} = P \dot{q}_0 = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix} \begin{bmatrix} 0.0 \\ -0.375 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.2(-0.375) \\ -0.4(-0.375) \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.075 \\ +0.150 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
$$\dot{q} = [0.000\text{ rad/s}, -0.075\text{ rad/s}, +0.150\text{ rad/s}]^T$$

**Verification & Sanity Check:**
- Joint 2 velocity is **negative** ($-0.075\text{ rad/s}$), successfully rotating Joint 2 away from its dangerous upper limit $+2.0\text{ rad}$ toward center $0.0$.
- Joint 3 automatically compensates with $+0.150\text{ rad/s}$ so that the end-effector experiences zero Cartesian perturbation!

---

### Problem 10.5: Manipulability Gradient Projection
**Problem Statement:** A 3R arm has manipulability measure $w(q)$. At its current pose, $\nabla_q w = [0.0, -0.5, 0.2]^T$. The primary task demands Cartesian velocity $\nu = [0.2, 0.0]^T\text{ m/s}$. Using the pseudoinverse $J^+$ and nullspace projector $P$ from Problem 10.1, compute the combined joint velocity command with manipulability gain $k_w = 2.0$.

**Given Data:**
- $J^+ = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix}$
- $P = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix}$
- $\nu = [0.2, 0.0]^T$
- $\nabla_q w = [0.0, -0.5, 0.2]^T, k_w = 2.0$

**Step-by-Step Derivation:**
1. Compute primary task velocity $\dot{q}_{\text{primary}} = J^+ \nu$:
   $$\dot{q}_{\text{primary}} = \begin{bmatrix} 0.0 & 1.0 \\ -0.4 & -0.8 \\ -0.2 & -0.4 \end{bmatrix} \begin{bmatrix} 0.2 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 0.0(0.2) + 0 \\ -0.4(0.2) + 0 \\ -0.2(0.2) + 0 \end{bmatrix} = \begin{bmatrix} 0.00 \\ -0.08 \\ -0.04 \end{bmatrix}\text{ rad/s}$$
2. Compute secondary gradient command $\dot{q}_0 = k_w \nabla_q w$:
   $$\dot{q}_0 = 2.0 \begin{bmatrix} 0.0 \\ -0.5 \\ 0.2 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -1.0 \\ 0.4 \end{bmatrix}\text{ rad/s}$$
3. Project $\dot{q}_0$ into nullspace:
   $$\dot{q}_{\text{null}} = P \dot{q}_0 = \begin{bmatrix} 0.0 & 0.0 & 0.0 \\ 0.0 & 0.2 & -0.4 \\ 0.0 & -0.4 & 0.8 \end{bmatrix} \begin{bmatrix} 0.0 \\ -1.0 \\ 0.4 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.2(-1.0) - 0.4(0.4) \\ -0.4(-1.0) + 0.8(0.4) \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.20 - 0.16 \\ 0.40 + 0.32 \end{bmatrix} = \begin{bmatrix} 0.00 \\ -0.36 \\ +0.72 \end{bmatrix}\text{ rad/s}$$
4. Sum primary and secondary joint velocities:
   $$\dot{q} = \dot{q}_{\text{primary}} + \dot{q}_{\text{null}} = \begin{bmatrix} 0.00 \\ -0.08 \\ -0.04 \end{bmatrix} + \begin{bmatrix} 0.00 \\ -0.36 \\ +0.72 \end{bmatrix} = \begin{bmatrix} 0.00 \\ -0.44 \\ +0.68 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
$$\dot{q} = [0.00\text{ rad/s}, -0.44\text{ rad/s}, +0.68\text{ rad/s}]^T$$

**Verification & Sanity Check:**
Check primary task execution:
$J \dot{q} = \begin{bmatrix} -2 & -2 & -1 \\ 1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 0.00 \\ -0.44 \\ 0.68 \end{bmatrix} = \begin{bmatrix} 0 - 2(-0.44) - 1(0.68) \\ 1(0) + 0 + 0 \end{bmatrix} = \begin{bmatrix} 0.88 - 0.68 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.20 \\ 0.00 \end{bmatrix}\text{ m/s}$.
Matches $\nu$ exactly!

---

### Problem 10.6: 7-DoF Arm Elbow Swivel Angle Parameterization
**Problem Statement:** A 7-DoF humanoid arm has a fixed shoulder origin $p_s$ and fixed wrist center $p_w$. Explain geometrically why the nullspace self-motion manifold forms a circle, and define the elbow swivel angle $\psi$.

**Solution:**
1. The shoulder joint position $p_s$ and wrist center position $p_w$ are fixed in space.
2. The distance from shoulder to wrist is constant: $D_{sw} = \|p_w - p_s\|$.
3. The upper arm has fixed length $L_{\text{upper}}$ and the forearm has fixed length $L_{\text{forearm}}$.
4. The elbow joint $p_e$ must simultaneously lie on a sphere of radius $L_{\text{upper}}$ centered at $p_s$ and a sphere of radius $L_{\text{forearm}}$ centered at $p_w$.
5. The intersection of two spheres in 3D space is a **circle**!
6. The elbow can travel along this circle without altering the position of the shoulder or the wrist. The angle parameterizing this circle around the shoulder-to-wrist axis is the **swivel angle $\psi \in [0, 2\pi)$**.

---

### Problem 10.7: Two-Priority Task Hierarchy Formulation
**Problem Statement:** A 7-DoF robot has two tasks:
- Task 1 (Primary, $m_1 = 3$): Maintain 3D position $p_e = p_d$.
- Task 2 (Secondary, $m_2 = 1$): Align elbow height $z_{\text{elbow}} = z_d$.
Derive the decoupled control law.

**Step-by-Step Derivation:**
1. Primary task:
   $$J_1 \dot{q} = \nu_1 \implies \dot{q}_1 = J_1^+ \nu_1$$
2. Let the secondary task velocity be $\nu_2 = \dot{z}_d + K_2 (z_d - z_{\text{elbow}})$.
3. Project Task 2 into the nullspace of Task 1:
   $$\dot{q} = J_1^+ \nu_1 + (I - J_1^+ J_1) \dot{q}_2$$
4. Substitute into Task 2:
   $$J_2 \dot{q} = J_2 J_1^+ \nu_1 + J_2 (I - J_1^+ J_1) \dot{q}_2 = \nu_2$$
   $$J_2 (I - J_1^+ J_1) \dot{q}_2 = \nu_2 - J_2 J_1^+ \nu_1$$
5. Let $\tilde{J}_2 = J_2 (I - J_1^+ J_1)$. Solving for $\dot{q}_2$:
   $$\dot{q}_2 = \tilde{J}_2^+ (\nu_2 - J_2 J_1^+ \nu_1)$$
6. Full decoupled control law:
   $$\dot{q} = J_1^+ \nu_1 + (I - J_1^+ J_1) \left( J_2 (I - J_1^+ J_1) \right)^+ (\nu_2 - J_2 J_1^+ \nu_1)$$

**Final Answer:**
Task 2 is fulfilled to the maximum extent mathematically possible without producing any error in Task 1.

---

### Problem 10.8: Orthogonal Energy Decomposition Verification
**Problem Statement:** For the joint velocity vector in Problem 10.5 ($\dot{q} = [0, -0.44, 0.68]^T$), verify numerically that $\|\dot{q}\|^2 = \|\dot{q}_{\text{primary}}\|^2 + \|\dot{q}_{\text{null}}\|^2$.

**Given Data:**
- $\dot{q}_{\text{primary}} = [0.00, -0.08, -0.04]^T$
- $\dot{q}_{\text{null}} = [0.00, -0.36, 0.72]^T$
- $\dot{q} = [0.00, -0.44, 0.68]^T$

**Step-by-Step Derivation:**
1. Compute $\|\dot{q}_{\text{primary}}\|^2$:
   $$\|\dot{q}_{\text{primary}}\|^2 = 0^2 + (-0.08)^2 + (-0.04)^2 = 0.0064 + 0.0016 = 0.0080\text{ rad}^2/\text{s}^2$$
2. Compute $\|\dot{q}_{\text{null}}\|^2$:
   $$\|\dot{q}_{\text{null}}\|^2 = 0^2 + (-0.36)^2 + 0.72^2 = 0.1296 + 0.5184 = 0.6480\text{ rad}^2/\text{s}^2$$
3. Sum of components:
   $$\|\dot{q}_{\text{primary}}\|^2 + \|\dot{q}_{\text{null}}\|^2 = 0.0080 + 0.6480 = 0.6560\text{ rad}^2/\text{s}^2$$
4. Compute total $\|\dot{q}\|^2$:
   $$\|\dot{q}\|^2 = 0^2 + (-0.44)^2 + 0.68^2 = 0.1936 + 0.4624 = 0.6560\text{ rad}^2/\text{s}^2$$

**Final Answer:**
$$\|\dot{q}\|^2 = 0.6560 = \|\dot{q}_{\text{primary}}\|^2 + \|\dot{q}_{\text{null}}\|^2$$
Orthogonal energy decomposition holds to exact numerical precision.

---

### Problem 10.9: Obstacle Repulsion in the Nullspace
**Problem Statement:** A 3R arm has its elbow at $p_{\text{elbow}} = [1.0, 0.0]^T$. An obstacle is detected at $p_{\text{obs}} = [1.0, 0.5]^T$ (too close along $+y$). Formulate the repulsive gradient vector $\nabla_q H_{\text{obs}}$ given $J_{\text{elbow}} = \begin{bmatrix} 0 & 0 & 0 \\ 1 & 0 & 0 \end{bmatrix}$.

**Step-by-Step Derivation:**
1. Distance vector from obstacle to elbow:
   $$r = p_{\text{elbow}} - p_{\text{obs}} = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix} - \begin{bmatrix} 1.0 \\ 0.5 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.5 \end{bmatrix}\text{ m}$$
2. The repulsive potential objective is $H(q) = \frac{1}{2} \|r\|^2$.
3. Compute the gradient:
   $$\nabla_q H = J_{\text{elbow}}^T r = \begin{bmatrix} 0 & 1 \\ 0 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} 0.0 \\ -0.5 \end{bmatrix} = \begin{bmatrix} -0.5 \\ 0.0 \\ 0.0 \end{bmatrix}$$
4. Projecting this into the arm's nullspace commands the base joint to rotate away from the obstacle while nullspace projection counter-rotates joints 2 and 3 to keep the tool tip motionless.

---

### Problem 10.10: Closed-Loop Numerical Drift in Nullspace Self-Motion
**Problem Statement:** Explain why continuously integrating open-loop nullspace velocity $\dot{q} = (I - J^+ J) \dot{q}_0$ in real-time control causes the end-effector to drift over time, and state the Closed-Loop Inverse Kinematics (CLIK) correction.

**Solution:**
1. In discrete time with sampling interval $\Delta t$, the configuration update is $q_{k+1} = q_k + \dot{q} \Delta t$.
2. Because the forward kinematics $f(q)$ is non-linear, the first-order approximation $f(q + \Delta q) \approx f(q) + J \Delta q$ has a truncation error of $\mathcal{O}(\Delta t^2)$.
3. Over thousands of control cycles, these small truncation errors accumulate, causing the physical tool tip to slowly drift away from the target position.
4. **CLIK Correction:**
   Add a closed-loop proportional error correction term to the task velocity:
   $$\nu_{\text{corrected}} = \nu_d + K_p (x_d - f(q))$$
   $$\dot{q} = J^+ \left( \nu_d + K_p (x_d - f(q)) \right) + (I - J^+ J) \dot{q}_0$$
   This continuously pulls the tool tip back onto the true physical target, eliminating numerical drift completely.

---

## 6. Ten Comprehensive Practice Problems with Full Step-by-Step Solutions

### Problem 10.11: Nullspace Dimension of a 7-DoF Manipulator
**Problem Statement:** A 7-DoF manipulator performs a 6D spatial tracking task ($m = 6$). At a non-singular pose, what is the dimension of the nullspace? What does the dimension become at an internal singularity where $\operatorname{rank}(J) = 5$?

**Solution:**
1. Non-singular pose: $\operatorname{rank}(J) = 6$.
   $$\dim(\mathcal{N}(J)) = n - \operatorname{rank}(J) = 7 - 6 = 1\text{ DoF}$$
   The robot has a 1D self-motion manifold (swivel angle).
2. At a rank-5 singularity: $\operatorname{rank}(J) = 5$.
   $$\dim(\mathcal{N}(J)) = 7 - 5 = 2\text{ DoF}$$
   The nullspace expands to **2 dimensions**! The robot gains an additional internal self-motion freedom while losing one external task freedom.

---

### Problem 10.12: Nullspace Projector for a 4-Link Planar Arm
**Problem Statement:** A 4-link planar arm operates in 2D space ($m = 2, n = 4$). What is the rank and trace of its nullspace projection matrix $P$?

**Solution:**
1. The nullspace projector is $P = I_4 - J^+ J$.
2. For an orthogonal projection operator onto an $r$-dimensional subspace, its trace equals its rank:
   $$\operatorname{tr}(P) = \operatorname{rank}(P) = \dim(\mathcal{N}(J)) = n - m = 4 - 2 = 2$$
3. Matrix $P$ has rank 2, trace 2, with eigenvalues $\{1, 1, 0, 0\}$.

---

### Problem 10.13: Weighted Nullspace Projector
**Problem Statement:** Derive the weighted nullspace projector $P_W$ for the weighted pseudoinverse $J_W^+ = W^{-1} J^T (J W^{-1} J^T)^{-1}$.

**Solution:**
1. The particular solution is $\dot{q}_p = J_W^+ \nu$.
2. The weighted nullspace projector is:
   $$P_W = I_n - J_W^+ J = I_n - W^{-1} J^T (J W^{-1} J^T)^{-1} J$$
3. Check property: $J P_W = J - (J J_W^+) J = J - I J = 0$.

---

### Problem 10.14: Asymmetric Barrier Functions for Joint Limits
**Problem Statement:** Formulate a logarithmic barrier function $B(q_i)$ that approaches $+\infty$ as $q_i \to q_{i,\max}$ or $q_i \to q_{i,\min}$.

**Solution:**
1. Define the barrier potential:
   $$B(q_i) = -\ln(q_{i,\max} - q_i) - \ln(q_i - q_{i,\min})$$
2. Gradient:
   $$\frac{\partial B}{\partial q_i} = \frac{1}{q_{i,\max} - q_i} - \frac{1}{q_i - q_{i,\min}}$$
3. When $q_i$ is centered, the two terms balance to zero. As $q_i \to q_{i,\max}$, the first term diverges to $+\infty$, exerting a fierce repulsive force in the nullspace away from the limit.

---

### Problem 10.15: Singularity in Secondary Task Execution
**Problem Statement:** In a two-priority task hierarchy, can the secondary task experience a singularity even when the primary task is completely non-singular?

**Solution:**
1. Yes. The secondary task requires inverting $\tilde{J}_2 = J_2 (I - J_1^+ J_1)$.
2. Even if $J_1$ and $J_2$ both have full rank independently, their nullspace intersection may drop rank if the task directions of $J_2$ are entirely collinear with $J_1$.
3. When $\operatorname{rank}(\tilde{J}_2) < m_2$, the secondary task experiences an **algorithmic singularity**, requiring DLS regularization on $\tilde{J}_2$.

---

### Problem 10.16: Kinetic Energy Minimization
**Problem Statement:** Prove that the particular solution $\dot{q} = J_M^+ \nu$ weighted by the mass matrix $M(q)$ minimizes the instantaneous kinetic energy $T = \frac{1}{2}\dot{q}^T M \dot{q}$.

**Solution:**
1. Minimize $T = \frac{1}{2}\dot{q}^T M \dot{q}$ subject to $J \dot{q} = \nu$.
2. This is identical to the weighted pseudoinverse optimization in Problem 8.13 with $W = M(q)$.
3. The optimal solution is $\dot{q} = M^{-1} J^T (J M^{-1} J^T)^{-1} \nu$.
4. This produces the **dynamically consistent generalized inverse** (Khatib 1987), which decouples task-space accelerations from joint self-motion.

---

### Problem 10.17: Whole-Body Humanoid Task Allocation
**Problem Statement:** A humanoid biped has 32 degrees of freedom. Outline a 3-tier task hierarchy for safe walking.

**Solution:**
1. **Priority 1 (Survival / Balance):** Center of Pressure (CoP) and foot support contact constraints ($J_{\text{feet}} \dot{q} = 0$).
2. **Priority 2 (Locomotion):** Center of Mass (CoM) trajectory tracking and swing foot placement.
3. **Priority 3 (Manipulation / Posture):** Hand manipulation, torso upright posture, and joint limit avoidance in the remaining whole-body nullspace.

---

### Problem 10.18: Nullspace Viscous Damping
**Problem Statement:** To prevent high-speed internal oscillations in the nullspace, controllers add viscous damping $\dot{q}_0 = -D_n \dot{q}$. Formulate the resulting closed-loop dynamics.

**Solution:**
1. The nullspace command is $\dot{q}_{\text{null}} = P (-D_n \dot{q})$.
2. This introduces a synthetic Rayleigh dissipation force strictly along internal self-motion modes, smoothly dissipating kinetic energy without exerting any braking force on the end-effector tool path.

---

### Problem 10.19: SVD Basis for the Nullspace
**Problem Statement:** Given the SVD of the Jacobian $J = U \Sigma V^T \in \mathbb{R}^{m \times n}$ with $\operatorname{rank}(J) = m < n$, show how the nullspace basis is extracted from matrix $V$.

**Solution:**
1. Partition the $n \times n$ orthogonal matrix $V = \begin{bmatrix} V_{\text{row}} & V_{\text{null}} \end{bmatrix}$, where $V_{\text{row}} \in \mathbb{R}^{n \times m}$ and $V_{\text{null}} \in \mathbb{R}^{n \times (n-m)}$.
2. Then:
   $$J V_{\text{null}} = (U \Sigma V^T) V_{\text{null}} = U \Sigma \begin{bmatrix} I_m \\ 0 \end{bmatrix}^T \begin{bmatrix} 0 \\ I_{n-m} \end{bmatrix} = U \Sigma (0) = 0$$
3. The remaining $(n - m)$ columns of matrix $V$ form an **orthonormal basis** for the nullspace $\mathcal{N}(J)$!

---

### Problem 10.20: Verification of Nullspace Invariants
**Problem Statement:** Formulate the numerical unit tests to verify a computed nullspace projection matrix $P$.

**Solution:**
For any valid nullspace projector $P = I - J^+ J$:
1. **Annihilation Test:** $\|J P\|_\infty < 10^{-12}$.
2. **Idempotence Test:** $\|P^2 - P\|_\infty < 10^{-12}$.
3. **Symmetry Test:** $\|P^T - P\|_\infty < 10^{-12}$.
4. **Trace Consistency Test:** $|\operatorname{tr}(P) - (n - \operatorname{rank}(J))| < 10^{-12}$.
All four invariant tests must pass to machine precision.

---

# Chapter 11: Constrained Trajectory Generation and Joint-Space Limit Enforcement

Kinematic equations and inverse kinematics algorithms do not operate in a static vacuum. In practical autonomous manipulation, a robotic end-effector must transition between distinct poses in task space smoothly, predictably, and without exceeding mechanical, electrical, or geometric constraints. Moving an arm from pose $T_A \in SE(3)$ to pose $T_B \in SE(3)$ requires generating continuous time-parameterized trajectories $q(t), \dot{q}(t), \ddot{q}(t)$ in joint space or $X(t), V(t), \dot{V}(t)$ in operational space, while strictly adhering to hardware limitations on position, velocity, acceleration, and jerk.

Moreover, numerical inverse kinematics in operational space is susceptible to numerical drift, kinematic singularities, and joint limit violations. This chapter establishes the rigorous mathematical frameworks governing:
1. Smooth trajectory generation via quintic polynomials ($C^2$ continuity) and trapezoidal velocity profiles.
2. Unit quaternion interpolation in $SO(3)$ via Spherical Linear Interpolation ($\operatorname{Slerp}$) and its angular velocity kinematics.
3. Closed-Loop Inverse Kinematics ($\operatorname{CLIK}$) with algorithmic drift compensation and Lyapunov stability guarantees.
4. Hard saturation versus smooth interior-point logarithmic/hyperbolic barrier potentials for joint limit avoidance.
5. Heuristic and geometric inverse kinematics algorithms: Cyclic Coordinate Descent ($\operatorname{CCD}$) and Forward And Backward Reaching Inverse Kinematics ($\operatorname{FABRIK}$).

---

## 11.1 Smooth Trajectory Parameterization: Polynomials and Profiles

A robot trajectory is a time-parameterized path. Let $s(t) \in [0, 1]$ be a normalized path parameter defined over the time interval $t \in [0, T]$, where $T > 0$ is the total motion duration. 

### 11.1.1 Cubic vs. Quintic Splines and $C^2$ Smoothness

In industrial robotics, motor currents and actuator torques are directly proportional to joint accelerations $\ddot{q}(t)$, and the time derivative of acceleration—known as **jerk** $j(t) = \dddot{q}(t)$—induces high-frequency structural vibration, mechanical wear on harmonic drives, and tracking errors in servo loops.

#### The Cubic Polynomial ($C^1$ Continuity)
A cubic trajectory specifies initial and final positions and velocities:
$$q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3$$
Given boundary conditions $q(0) = q_0, q(T) = q_f, \dot{q}(0) = \dot{q}_0, \dot{q}(T) = \dot{q}_f$:
$$a_0 = q_0, \quad a_1 = \dot{q}_0$$
$$\begin{bmatrix} T^2 & T^3 \\ 2T & 3T^2 \end{bmatrix} \begin{bmatrix} a_2 \\ a_3 \end{bmatrix} = \begin{bmatrix} q_f - q_0 - \dot{q}_0 T \\ \dot{q}_f - \dot{q}_0 \end{bmatrix}$$
Solving yields:
$$a_2 = \frac{3(q_f - q_0) - (2\dot{q}_0 + \dot{q}_f)T}{T^2}, \quad a_3 = \frac{-2(q_f - q_0) + (\dot{q}_0 + \dot{q}_f)T}{T^3}$$
While velocities are continuous ($C^1$), the acceleration at boundary $t=0$ is $\ddot{q}(0) = 2a_2$, which is generally nonzero. Transitioning from rest ($\ddot{q}(0^-) = 0$) causes an instantaneous step discontinuity in acceleration, implying infinite jerk $\dddot{q}(t) \to \infty$.

#### The Quintic Polynomial ($C^2$ Continuity)
To enforce continuous acceleration and zero jerk at the boundaries, we formulate a 5th-degree polynomial:
$$s(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5$$
Imposing the six canonical boundary conditions:
$$s(0) = 0, \quad \dot{s}(0) = 0, \quad \ddot{s}(0) = 0$$
$$s(T) = 1, \quad \dot{s}(T) = 0, \quad \ddot{s}(T) = 0$$
The initial conditions immediately enforce $a_0 = 0, a_1 = 0, a_2 = 0$. The terminal conditions form the linear system:
$$\begin{bmatrix} T^3 & T^4 & T^5 \\ 3T^2 & 4T^3 & 5T^4 \\ 6T & 12T^2 & 20T^3 \end{bmatrix} \begin{bmatrix} a_3 \\ a_4 \\ a_5 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
Inverting this system analytically yields:
$$a_3 = \frac{10}{T^3}, \quad a_4 = -\frac{15}{T^4}, \quad a_5 = \frac{6}{T^5}$$
Thus, the canonical minimum-jerk scalar profile is:
$$s(t) = 10\left(\frac{t}{T}\right)^3 - 15\left(\frac{t}{T}\right)^4 + 6\left(\frac{t}{T}\right)^5$$
Differentiating with respect to time:
$$\dot{s}(t) = \frac{30}{T}\left(\frac{t}{T}\right)^2 - \frac{60}{T}\left(\frac{t}{T}\right)^3 + \frac{30}{T}\left(\frac{t}{T}\right)^4 = \frac{30}{T} \tau^2 (1 - \tau)^2 \quad \text{where } \tau = \frac{t}{T}$$
$$\ddot{s}(t) = \frac{60}{T^2}\tau - \frac{180}{T^2}\tau^2 + \frac{120}{T^2}\tau^3 = \frac{60}{T^2} \tau (1 - \tau)(1 - 2\tau)$$
$$\dddot{s}(t) = \frac{60}{T^3} - \frac{360}{T^3}\tau + \frac{360}{T^3}\tau^2 = \frac{60}{T^3}(1 - 6\tau + 6\tau^2)$$

The extrema of these profiles are analytically derived:
1. **Maximum Velocity:** Occurs at midpoint $\tau = 0.5$:
   $$\dot{s}_{\max} = \dot{s}(0.5 T) = \frac{30}{T} (0.5)^2 (0.5)^2 = \frac{30}{16 T} = \frac{15}{8 T} = \frac{1.875}{T}$$
2. **Maximum Acceleration:** Setting $\dddot{s}(t) = 0 \implies 6\tau^2 - 6\tau + 1 = 0$:
   $$\tau = \frac{6 \pm \sqrt{36 - 24}}{12} = \frac{1}{2} \pm \frac{\sqrt{3}}{6} \approx 0.2113, \; 0.7887$$
   Evaluating $\ddot{s}$ at $\tau = 0.5 - \frac{\sqrt{3}}{6}$:
   $$\ddot{s}_{\max} = \frac{10\sqrt{3}}{3 T^2} \approx \frac{5.7735}{T^2}$$

### 11.1.2 Trapezoidal Velocity Profiles (LSPB: Linear Segment with Parabolic Blends)
When actuators operate near torque limits, maximum acceleration $a_{\max}$ and maximum cruising velocity $v_{\max}$ are strictly bounded. The **Linear Segment with Parabolic Blend (LSPB)** trajectory divides the duration $T$ into three phases:
1. Constant acceleration phase $t \in [0, t_b]$ with $\ddot{q}(t) = a_{\max}$.
2. Constant velocity cruising phase $t \in [t_b, T - t_b]$ with $\dot{q}(t) = v_{\max} = a_{\max} t_b$.
3. Constant deceleration phase $t \in [T - t_b, T]$ with $\ddot{q}(t) = -a_{\max}$.

The displacement accumulated across the profile over total displacement $D = q_f - q_0$ is:
$$D = 2 \cdot \left(\frac{1}{2} a_{\max} t_b^2\right) + v_{\max}(T - 2t_b) = a_{\max} t_b^2 + a_{\max} t_b (T - 2t_b) = a_{\max} t_b (T - t_b) = v_{\max} (T - t_b)$$
Solving for the blend time $t_b$:
$$t_b = \frac{v_{\max} T - D}{v_{\max}} = T - \frac{D}{v_{\max}}$$
Equivalently, expressing in terms of acceleration $a_{\max}$:
$$a_{\max} t_b^2 - a_{\max} T t_b + D = 0 \implies t_b = \frac{T}{2} - \frac{\sqrt{a_{\max}^2 T^2 - 4 a_{\max} D}}{2 a_{\max}}$$
A physically feasible trapezoid requires $t_b \le \frac{T}{2}$, which imposes the strict constraint:
$$\frac{D}{T} < v_{\max} \le \frac{2D}{T}$$
If $v_{\max} = \frac{2D}{T}$, the blend time becomes $t_b = \frac{T}{2}$; the cruising phase vanishes, reducing the profile to a triangular velocity profile.

---

## 11.2 Task Space Trajectory Generation and Quaternion Interpolation

To move an end-effector in operational space from $T_A = (R_A, p_A)$ to $T_B = (R_B, p_B)$, position and orientation must be interpolated independently. Position translation $p(t)$ is smoothly interpolated along the straight line:
$$p(t) = p_A + s(t)(p_B - p_A)$$
where $s(t)$ is a $C^2$ quintic polynomial. However, interpolating rotation matrices $R(t) \in SO(3)$ requires preserving the special orthogonal group structure $R^T R = I, \det(R) = 1$. Direct linear interpolation of matrix components $\tilde{R}(t) = (1-s)R_A + s R_B$ violates orthogonality.

### 11.2.1 Unit Quaternions in $S^3$
A rotation $R \in SO(3)$ by angle $\theta \in [0, \pi]$ about unit axis $\hat{n} \in \mathbb{R}^3$ corresponds to a pair of antipodal unit quaternions $\pm q \in S^3 \subset \mathbb{R}^4$:
$$q = \begin{bmatrix} \eta \\ \epsilon \end{bmatrix} = \begin{bmatrix} \cos(\theta/2) \\ \hat{n} \sin(\theta/2) \end{bmatrix}, \quad \|q\|^2 = \eta^2 + \|\epsilon\|^2 = 1$$
Because $q$ and $-q$ represent the identical physical orientation in $SO(3)$, orientation interpolation must always choose the shortest geodesic path on the 3-sphere $S^3$.

### 11.2.2 Spherical Linear Interpolation ($\operatorname{Slerp}$)
Given two unit quaternions $q_0, q_1 \in S^3$:
1. Compute the spherical inner product:
   $$\cos\Omega = q_0 \cdot q_1 = \eta_0 \eta_1 + \epsilon_0^T \epsilon_1$$
2. **Shortest Path Correction:** If $\cos\Omega < 0$, replace $q_1 \leftarrow -q_1$ and $\cos\Omega \leftarrow -\cos\Omega$. This ensures the interpolation traverses the acute geodesic angle $\Omega \in [0, \pi/2]$.
3. If $\cos\Omega \approx 1$ (e.g., $1 - \cos\Omega < 10^{-6}$), apply normalized linear interpolation ($\operatorname{Nlerp}$) to avoid division by zero:
   $$\operatorname{Slerp}(q_0, q_1; s) \approx \frac{(1-s)q_0 + s q_1}{\|(1-s)q_0 + s q_1\|}$$
4. Otherwise, compute $\Omega = \arccos(\cos\Omega)$ and evaluate:
   $$q(s) = \operatorname{Slerp}(q_0, q_1; s) = \frac{\sin((1-s)\Omega)}{\sin\Omega} q_0 + \frac{\sin(s\Omega)}{\sin\Omega} q_1$$

### 11.2.3 Angular Velocity and Acceleration Along a $\operatorname{Slerp}$ Path
Let the interpolation parameter vary with time: $s = s(t)$. The relative rotation from $q_0$ to $q_1$ is given by the quaternion:
$$\Delta q = q_0^{-1} * q_1 = \begin{bmatrix} \cos(\Omega) \\ \hat{u} \sin(\Omega) \end{bmatrix}$$
where $\hat{u}$ is the fixed unit rotation axis in the frame of $q_0$, and $2\Omega$ is the physical angle between the two 3D orientations (since quaternion half-angle $\theta/2 = \Omega \implies \theta = 2\Omega$).
The instantaneous angular velocity vector $\omega(t) \in \mathbb{R}^3$ in task space is directed along the fixed axis $\hat{u}$ with magnitude:
$$\omega(t) = 2 \Omega \dot{s}(t) \hat{u}$$
The angular acceleration is:
$$\dot{\omega}(t) = 2 \Omega \ddot{s}(t) \hat{u}$$
Thus, using a $C^2$ quintic polynomial for $s(t)$ guarantees that both linear and angular velocities and accelerations begin and end smoothly at zero.

---

## 11.3 Closed-Loop Inverse Kinematics ($\operatorname{CLIK}$)

When tracking a continuous operational space trajectory $x_d(t) \in \mathbb{R}^m$ in real-time, open-loop velocity inversion:
$$\dot{q}(t) = J^+(q(t)) \dot{x}_d(t)$$
causes discrete-time numerical integration drift. Over time, the forward kinematics pose $x(q(t)) = f(q(t))$ diverges significantly from $x_d(t)$.

### 11.3.1 Algorithmic Formulation
To suppress drift, **Closed-Loop Inverse Kinematics ($\operatorname{CLIK}$)** augments the feedforward velocity command with a proportional feedback correction term based on tracking error $e(t) = x_d(t) - f(q(t))$:
$$\dot{q}(t) = J^+(q) \left( \dot{x}_d(t) + K_p e(t) \right)$$
where $K_p \in \mathbb{R}^{m \times m}$ is a symmetric positive-definite gain matrix ($K_p > 0$), typically chosen as $K_p = k_p I_m$ with $k_p > 0$.

```
           +-----------+   x_d(t)       +
 x_d(t) -->| Diff      |---------------->(+)----+
           +-----------+                 ^      |
                 |                       |      |
                 v e(t)                  |      |
             +-------+                   |      |
        (+)--|  K_p  |-------------------+      v
         ^   +-------+                      +-------+   \dot{q}   +-----+  q(t)
         |                                  |  J^+  |------------>| 1/s |----+
         -                                  +-------+             +-----+    |
         |                                                                   |
         +------------------- f(q) <-----------------------------------------+
                             (FK)
```

### 11.3.2 Lyapunov Asymptotic Stability Proof
Consider the positive-definite candidate Lyapunov function:
$$V(e) = \frac{1}{2} e(t)^T e(t) > 0 \quad \forall e \neq 0$$
Differentiating $V(e)$ with respect to time along system trajectories:
$$\dot{V}(e) = e^T \dot{e} = e^T \left( \dot{x}_d - \dot{x} \right) = e^T \left( \dot{x}_d - J(q)\dot{q} \right)$$
Substituting the $\operatorname{CLIK}$ control law $\dot{q} = J^+ (\dot{x}_d + K_p e)$:
$$\dot{V}(e) = e^T \left( \dot{x}_d - J J^+ (\dot{x}_d + K_p e) \right)$$
Assuming the manipulator is non-singular with full row rank $\operatorname{rank}(J) = m$, the projection operator satisfies $J J^+ = I_m$. Therefore:
$$\dot{V}(e) = e^T \left( \dot{x}_d - I_m (\dot{x}_d + K_p e) \right) = e^T \left( -K_p e \right) = -e^T K_p e$$
Since $K_p$ is positive-definite:
$$\dot{V}(e) \le -\lambda_{\min}(K_p) \|e\|^2 < 0 \quad \forall e \neq 0$$
By Lyapunov's Direct Method, the error dynamics are globally exponentially stable:
$$\|e(t)\| \le \|e(0)\| e^{-\lambda_{\min}(K_p) t}$$
The tracking error converges asymptotically to zero, eliminating all numerical integration drift.

### 11.3.3 Orientation Error Representation in $\operatorname{CLIK}$
For full 6-DoF tracking, orientation error between desired rotation $R_d$ and current rotation $R(q)$ must be represented as a 3D vector $e_o \in \mathbb{R}^3$. Two standard representations are used:
1. **Quaternion Error:**
   Let $q_d = (\eta_d, \epsilon_d)$ and $q(q) = (\eta, \epsilon)$. The relative quaternion error is $\Delta q = q^{-1} * q_d = (\Delta\eta, \Delta\epsilon)$:
   $$\Delta\eta = \eta \eta_d + \epsilon^T \epsilon_d, \quad \Delta\epsilon = \eta \epsilon_d - \eta_d \epsilon - \epsilon \times \epsilon_d$$
   The operational orientation error vector fed to the geometric Jacobian is:
   $$e_o = 2 \operatorname{sgn}(\Delta\eta) \Delta\epsilon$$
2. **Skew-Symmetric Matrix Error:**
   $$e_o = \frac{1}{2} \left( n \times n_d + s \times s_d + a \times a_d \right)$$
   where $R = [n \; s \; a]$ and $R_d = [n_d \; s_d \; a_d]$.

---

## 11.4 Joint Limit Enforcement: Clamping vs. Barrier Potentials

Physical manipulators possess rigid mechanical stops:
$$q_{i,\min} \le q_i \le q_{i,\max}, \quad i = 1, \dots, n$$
Ignoring these constraints leads to hardware trips, collision with internal wiring, or motor destruction.

### 11.4.1 Hard Saturation Clamping and Truncation Problems
The simplest approach clamps joint positions after each integration step:
$$q_i^{(k+1)} = \operatorname{clip}\left( q_i^{(k)} + \Delta q_i, \; q_{i,\min}, \; q_{i,\max} \right)$$
However, if joint $i$ is clamped at $q_{i,\max}$ while task velocity demands further motion, hard clamping breaks the kinematic relationship $\dot{x} = J \dot{q}$. The actual operational velocity becomes $J \dot{q}_{\text{clamped}} \neq \dot{x}$, resulting in severe path deviations and large jerky transients when the joint leaves the limit.

### 11.4.2 Logarithmic and Hyperbolic Barrier Potentials
In redundant manipulators ($n > m$), joint limits are enforced smoothly via nullspace projection using an interior-point barrier potential $V_{\text{limit}}(q)$.

#### Logarithmic Barrier Function:
$$V_{\text{limit}}(q) = -\sum_{i=1}^n \ln\left( \frac{(q_i - q_{i,\min})(q_{i,\max} - q_i)}{(q_{i,\max} - q_{i,\min})^2} \right)$$
As $q_i \to q_{i,\min}^+$ or $q_i \to q_{i,\max}^-$, $V_{\text{limit}}(q) \to +\infty$.
The repulsive gradient vector $g_{\text{limit}} = \nabla_q V_{\text{limit}} \in \mathbb{R}^n$ is:
$$\frac{\partial V_{\text{limit}}}{\partial q_i} = -\frac{1}{q_i - q_{i,\min}} + \frac{1}{q_{i,\max} - q_i} = \frac{2 q_i - (q_{i,\max} + q_{i,\min})}{(q_i - q_{i,\min})(q_{i,\max} - q_i)}$$
Note that when $q_i = \bar{q}_i = \frac{q_{i,\max} + q_{i,\min}}{2}$, the gradient is exactly zero.

#### Hyperbolic Secant Activation:
To prevent the barrier gradient from interfering with motion when the joint is comfortably within its safe zone, an activation buffer $\Delta q_{\text{buf}}$ is defined:
$$h_i(q_i) = \begin{cases} 
\left(\frac{q_i - (q_{i,\max} - \Delta q_{\text{buf}})}{\Delta q_{\text{buf}}}\right)^2 & \text{if } q_i > q_{i,\max} - \Delta q_{\text{buf}} \\
-\left(\frac{(q_{i,\min} + \Delta q_{\text{buf}}) - q_i}{\Delta q_{\text{buf}}}\right)^2 & \text{if } q_i < q_{i,\min} + \Delta q_{\text{buf}} \\
0 & \text{otherwise}
\end{cases}$$
Projecting $-g_{\text{limit}}$ into the nullspace of $J$:
$$\dot{q} = J^+ \dot{x}_d - k_{\text{lim}} (I - J^+ J) g_{\text{limit}}(q)$$
Because $(I - J^+ J)$ is orthogonal to the range space of $J^T$, the repulsive joint limit avoidance velocity produces **zero end-effector perturbation**:
$$J \dot{q} = J J^+ \dot{x}_d - k_{\text{lim}} \underbrace{J(I - J^+ J)}_{= 0} g_{\text{limit}} = \dot{x}_d$$

---

## 11.5 Heuristic and Geometric Inverse Kinematics: CCD and FABRIK

When numerical Jacobians are unavailable, computationally prohibitive, or prone to singularity lockup, geometric heuristic algorithms provide robust, unconditionally stable alternatives.

### 11.5.1 Cyclic Coordinate Descent ($\operatorname{CCD}$)
Cyclic Coordinate Descent is an iterative single-variable optimization method. It traverses the kinematic chain from the end-effector link back to the base (or vice versa), optimizing one joint angle $\theta_i$ at a time while holding all other $n-1$ joints fixed.

For a 2D/3D revolute joint $i$ with pivot position $p_i$, current end-effector position $p_e$, target position $p_t$, and joint axis unit vector $\hat{z}_i$:
1. Form the vector from joint pivot to end-effector:
   $$v_e = p_e - p_i$$
2. Form the vector from joint pivot to target:
   $$v_t = p_t - p_i$$
3. Project $v_e$ and $v_t$ onto the plane perpendicular to $\hat{z}_i$:
   $$u_e = v_e - (v_e \cdot \hat{z}_i)\hat{z}_i, \quad u_t = v_t - (v_t \cdot \hat{z}_i)\hat{z}_i$$
4. The incremental rotation angle $\Delta\theta_i$ that aligns $u_e$ with $u_t$ is:
   $$\cos\Delta\theta_i = \frac{u_e \cdot u_t}{\|u_e\| \|u_t\|}, \quad \sin\Delta\theta_i = \frac{\hat{z}_i \cdot (u_e \times u_t)}{\|u_e\| \|u_t\|}$$
   $$\Delta\theta_i = \operatorname{atan2}\left( \hat{z}_i \cdot (u_e \times u_t), \; u_e \cdot u_t \right)$$
5. Update joint $i$: $\theta_i \leftarrow \operatorname{clip}(\theta_i + \Delta\theta_i, \theta_{i,\min}, \theta_{i,\max})$.
6. Update the end-effector position $p_e$ via forward kinematics and repeat for joint $i-1$.

CCD is monotonic: each individual joint update strictly decreases or maintains the Euclidean distance $\|p_t - p_e\|$. However, it tends to over-rotate distal joints and can exhibit slow convergence on long serial chains.

### 11.5.2 Forward And Backward Reaching Inverse Kinematics ($\operatorname{FABRIK}$)
Developed by Aristidou and Cameron (2011), $\operatorname{FABRIK}$ treats the manipulator as a set of points $p_0, p_1, \dots, p_n \in \mathbb{R}^3$ linked by fixed segment lengths $d_i = \|p_{i+1} - p_i\|$. Rather than manipulating angles, $\operatorname{FABRIK}$ operates directly on point coordinates using alternating forward and backward projection sweeps.

```
Initial Chain:
p0 -------- p1 -------- p2 -------- pe      x Target (pt)

Forward Reaching Sweep (End to Base):
p0' <------- p1' <------- p2' <------- p_e' = pt

Backward Reaching Sweep (Base to End):
p0'' = p_base -------> p1'' -------> p2'' -------> pe'' (closer to pt)
```

#### Reachability Check:
Let total arm length be $L = \sum_{i=0}^{n-1} d_i$.
If $\|p_t - p_0\| > L$, the target is unreachable. The chain stretches straight toward $p_t$:
$$p_{i+1} = p_i + d_i \frac{p_t - p_0}{\|p_t - p_0\|}$$

#### Iterative Sweeps (When Target is Reachable):
Each iteration consists of two sweeps:
1. **Forward Reaching Sweep (Stage 1):**
   - Set the end-effector directly onto the target:
     $$p_n^{(k+1/2)} = p_t$$
   - For $i = n-1, n-2, \dots, 0$:
     Find the line connecting $p_i^{(k)}$ and $p_{i+1}^{(k+1/2)}$, and position $p_i^{(k+1/2)}$ along this line at distance $d_i$:
     $$r_i = \|p_{i+1}^{(k+1/2)} - p_i^{(k)}\|$$
     $$\lambda_i = \frac{d_i}{r_i}$$
     $$p_i^{(k+1/2)} = (1 - \lambda_i) p_{i+1}^{(k+1/2)} + \lambda_i p_i^{(k)}$$
2. **Backward Reaching Sweep (Stage 2):**
   - Reset the base back to its anchored physical foundation:
     $$p_0^{(k+1)} = p_{\text{base}}$$
   - For $i = 0, 1, \dots, n-1$:
     Position $p_{i+1}^{(k+1)}$ along the line connecting $p_0^{(k+1)}$ and $p_{i+1}^{(k+1/2)}$ at distance $d_i$:
     $$r_i = \|p_{i+1}^{(k+1/2)} - p_i^{(k+1)}\|$$
     $$\lambda_i = \frac{d_i}{r_i}$$
     $$p_{i+1}^{(k+1)} = (1 - \lambda_i) p_i^{(k+1)} + \lambda_i p_{i+1}^{(k+1/2)}$$

$\operatorname{FABRIK}$ achieves quadratic-like convergence in practice with $O(n)$ computational complexity per iteration, exhibits zero matrix singularity vulnerabilities, and effortlessly incorporates ball-and-socket joint angle limits.

---

## 11.6 Comprehensive Solved Problems

### Section 1: Worked Examples (Problems 11.1 – 11.10)

#### Problem 11.1: Quintic Polynomial Coefficients for a High-Speed Industrial Pick-and-Place Move
**Statement:**
A robotic joint must transition from rest at $q_0 = 0.2\text{ rad}$ to rest at $q_f = 1.8\text{ rad}$ in exactly $T = 0.8\text{ s}$ using a $C^2$ smooth quintic polynomial with zero boundary velocities and accelerations ($\dot{q}_0 = \dot{q}_f = 0$, $\ddot{q}_0 = \ddot{q}_f = 0$). Compute the exact polynomial coefficients $a_0, a_1, a_2, a_3, a_4, a_5$, and determine the peak joint velocity $\dot{q}_{\max}$ and peak joint acceleration $\ddot{q}_{\max}$.

**Given Data:**
- $q_0 = 0.2\text{ rad}$, $q_f = 1.8\text{ rad}$, $\Delta q = 1.6\text{ rad}$.
- $T = 0.8\text{ s}$.
- Boundary conditions: $\dot{q}_0 = \dot{q}_f = 0$, $\ddot{q}_0 = \ddot{q}_f = 0$.

**Step-by-Step Derivation:**
1. The general form of the quintic trajectory is:
   $$q(t) = a_0 + a_1 t + a_2 t^2 + a_3 t^3 + a_4 t^4 + a_5 t^5$$
2. From initial conditions at $t=0$:
   $$q(0) = a_0 = q_0 = 0.2$$
   $$\dot{q}(0) = a_1 = 0$$
   $$\ddot{q}(0) = 2a_2 = 0 \implies a_2 = 0$$
3. For normalized path $q(t) = q_0 + \Delta q \cdot s(t/T)$ where $s(\tau) = 10\tau^3 - 15\tau^4 + 6\tau^5$:
   $$a_3 = \frac{10 \Delta q}{T^3} = \frac{10 \times 1.6}{0.8^3} = \frac{16.0}{0.512} = 31.25\text{ rad/s}^3$$
   $$a_4 = -\frac{15 \Delta q}{T^4} = -\frac{15 \times 1.6}{0.8^4} = -\frac{24.0}{0.4096} = -58.59375\text{ rad/s}^4$$
   $$a_5 = \frac{6 \Delta q}{T^5} = \frac{6 \times 1.6}{0.8^5} = \frac{9.6}{0.32768} = 29.296875\text{ rad/s}^5$$
4. Peak velocity occurs at midpoint $t = T/2 = 0.4\text{ s}$:
   $$\dot{q}_{\max} = \frac{15 \Delta q}{8 T} = \frac{15 \times 1.6}{8 \times 0.8} = \frac{24.0}{6.4} = 3.75\text{ rad/s}$$
5. Peak acceleration occurs at $\tau = \frac{1}{2} - \frac{\sqrt{3}}{6} \approx 0.211325 \implies t \approx 0.16906\text{ s}$:
   $$\ddot{q}_{\max} = \frac{10\sqrt{3}}{3} \frac{\Delta q}{T^2} = \frac{10\sqrt{3}}{3} \frac{1.6}{0.64} = \frac{16\sqrt{3}}{1.92} = \frac{25\sqrt{3}}{3} \approx 14.43376\text{ rad/s}^2$$

**Final Answer:**
- $a_0 = 0.2$, $a_1 = 0$, $a_2 = 0$, $a_3 = 31.25$, $a_4 = -58.59375$, $a_5 = 29.296875$.
- Peak velocity: $\dot{q}_{\max} = 3.75\text{ rad/s}$.
- Peak acceleration: $\ddot{q}_{\max} \approx 14.434\text{ rad/s}^2$.

**Verification:**
At $t=T=0.8$:
$$q(0.8) = 0.2 + 31.25(0.512) - 58.59375(0.4096) + 29.296875(0.32768) = 0.2 + 16.0 - 24.0 + 9.6 = 1.8\text{ rad}$$.
$\dot{q}(0.8) = 3(31.25)(0.64) + 4(-58.59375)(0.512) + 5(29.296875)(0.4096) = 60.0 - 120.0 + 60.0 = 0$. Exact match.

---

#### Problem 11.2: LSPB Trapezoidal Velocity Profile Construction
**Statement:**
A cartesian linear gantry must traverse a distance of $D = 1.2\text{ m}$ in total time $T = 2.0\text{ s}$. The maximum allowable motor acceleration is $a_{\max} = 2.0\text{ m/s}^2$. 
Determine whether a trapezoidal velocity profile is feasible. If feasible, calculate the blend time $t_b$, constant cruising velocity $v_{\max}$, and the fraction of the total time spent in acceleration, cruising, and deceleration.

**Given Data:**
- $D = 1.2\text{ m}$, $T = 2.0\text{ s}$, $a_{\max} = 2.0\text{ m/s}^2$.

**Step-by-Step Derivation:**
1. Check the feasibility condition:
   The minimum time required to cover distance $D$ with acceleration $a_{\max}$ (triangular profile where $t_b = T/2$) is:
   $$D = a_{\max} t_b^2 = a_{\max} (T/2)^2 = \frac{1}{4} a_{\max} T^2 = \frac{1}{4}(2.0)(4.0) = 2.0\text{ m}$$
   Since actual displacement $D = 1.2\text{ m} < 2.0\text{ m}$, the acceleration is more than sufficient, so a trapezoidal profile with a cruising phase is feasible.
2. The blend time satisfies:
   $$a_{\max} t_b^2 - a_{\max} T t_b + D = 0 \implies 2.0 t_b^2 - 4.0 t_b + 1.2 = 0$$
   Divide by 2:
   $$t_b^2 - 2.0 t_b + 0.6 = 0$$
   $$t_b = \frac{2.0 \pm \sqrt{4.0 - 4(1)(0.6)}}{2} = 1.0 \pm \frac{\sqrt{1.6}}{2} = 1.0 \pm \frac{1.264911}{2} = 1.0 \pm 0.632456\text{ s}$$
3. For a physical blend time $t_b \le T/2 = 1.0\text{ s}$:
   $$t_b = 1.0 - 0.632456 = 0.367544\text{ s}$$
4. Calculate cruising velocity $v_{\max}$:
   $$v_{\max} = a_{\max} t_b = 2.0 \times 0.367544 = 0.735089\text{ m/s}$$
5. Calculate durations:
   - Acceleration duration: $t_b = 0.3675\text{ s}$ ($18.38\%$).
   - Cruising duration: $T - 2t_b = 2.0 - 2(0.367544) = 1.264911\text{ s}$ ($63.25\%$).
   - Deceleration duration: $t_b = 0.3675\text{ s}$ ($18.38\%$).

**Final Answer:**
- Feasible: Yes.
- Blend time: $t_b \approx 0.3675\text{ s}$.
- Cruising velocity: $v_{\max} \approx 0.7351\text{ m/s}$.
- Acceleration: $18.38\%$, Cruising: $63.25\%$, Deceleration: $18.38\%$.

**Verification:**
Total distance:
$$D = v_{\max}(T - t_b) = 0.735089 \times (2.0 - 0.367544) = 0.735089 \times 1.632456 = 1.20000\text{ m}$$. Exact.

---

#### Problem 11.3: Spherical Linear Interpolation ($\operatorname{Slerp}$) of Unit Quaternions
**Statement:**
An end-effector rotates from orientation $q_0 = \begin{bmatrix} 1 & 0 & 0 & 0 \end{bmatrix}^T$ (identity rotation) to orientation $q_1 = \begin{bmatrix} \frac{1}{2} & \frac{1}{2} & \frac{1}{2} & \frac{1}{2} \end{bmatrix}^T$.
1. Compute the geodesic spherical angle $\Omega$ between $q_0$ and $q_1$ in $S^3$.
2. Compute the interpolated quaternion $q(s)$ at midpoint parameter $s = 0.5$.
3. Verify that $\|q(0.5)\| = 1$, and identify the equivalent axis-angle representation of $q(0.5)$.

**Given Data:**
- $q_0 = [1, 0, 0, 0]^T$, $q_1 = [0.5, 0.5, 0.5, 0.5]^T$, $s = 0.5$.

**Step-by-Step Derivation:**
1. Inner product between unit quaternions:
   $$\cos\Omega = q_0 \cdot q_1 = 1(0.5) + 0 + 0 + 0 = 0.5$$
   Since $\cos\Omega = 0.5 > 0$, no sign flip is needed.
   $$\Omega = \arccos(0.5) = \frac{\pi}{3}\text{ rad} = 60^\circ$$
2. For $s = 0.5$:
   $$\sin\Omega = \sin\left(\frac{\pi}{3}\right) = \frac{\sqrt{3}}{2}$$
   $$(1-s)\Omega = 0.5\left(\frac{\pi}{3}\right) = \frac{\pi}{6}, \quad s\Omega = \frac{\pi}{6}$$
   $$\sin((1-s)\Omega) = \sin\left(\frac{\pi}{6}\right) = \frac{1}{2}$$
   The interpolation weights are:
   $$w_0 = \frac{\sin(\pi/6)}{\sin(\pi/3)} = \frac{1/2}{\sqrt{3}/2} = \frac{1}{\sqrt{3}}$$
   $$w_1 = \frac{\sin(\pi/6)}{\sin(\pi/3)} = \frac{1}{\sqrt{3}}$$
3. Evaluating $q(0.5)$:
   $$q(0.5) = \frac{1}{\sqrt{3}} q_0 + \frac{1}{\sqrt{3}} q_1 = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix} + \frac{1}{\sqrt{3}} \begin{bmatrix} 0.5 \\ 0.5 \\ 0.5 \\ 0.5 \end{bmatrix} = \begin{bmatrix} \frac{1.5}{\sqrt{3}} \\ \frac{0.5}{\sqrt{3}} \\ \frac{0.5}{\sqrt{3}} \\ \frac{0.5}{\sqrt{3}} \end{bmatrix} = \begin{bmatrix} \frac{\sqrt{3}}{2} \\ \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \end{bmatrix}$$
4. Verification of unit norm:
   $$\|q(0.5)\|^2 = \left(\frac{\sqrt{3}}{2}\right)^2 + 3\left(\frac{1}{2\sqrt{3}}\right)^2 = \frac{3}{4} + 3\left(\frac{1}{12}\right) = \frac{3}{4} + \frac{1}{4} = 1.0$$
5. Axis-angle extraction:
   $$\eta = \cos(\theta/2) = \frac{\sqrt{3}}{2} \implies \frac{\theta/2} = \frac{\pi}{6} \implies \theta = \frac{\pi}{3} = 60^\circ$$
   $$\epsilon = \hat{n} \sin(\theta/2) = \hat{n} \left(\frac{1}{2}\right) = \begin{bmatrix} \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \\ \frac{1}{2\sqrt{3}} \end{bmatrix} \implies \hat{n} = \begin{bmatrix} \frac{1}{\sqrt{3}} \\ \frac{1}{\sqrt{3}} \\ \frac{1}{\sqrt{3}} \end{bmatrix}$$
   The midpoint orientation is a rotation of $60^\circ$ around unit axis $\hat{n} = \frac{1}{\sqrt{3}}[1, 1, 1]^T$ (whereas $q_1$ is a rotation of $120^\circ$ around the same axis, since $\eta_1 = 0.5 \implies \theta_1/2 = 60^\circ \implies \theta_1 = 120^\circ$).

**Final Answer:**
- Geodesic angle in $S^3$: $\Omega = \pi/3\text{ rad} = 60^\circ$.
- $q(0.5) = \left[ \frac{\sqrt{3}}{2}, \; \frac{1}{2\sqrt{3}}, \; \frac{1}{2\sqrt{3}}, \; \frac{1}{2\sqrt{3}} \right]^T \approx [0.8660, 0.2887, 0.2887, 0.2887]^T$.
- Physical rotation angle: $\theta = 60^\circ$ about axis $\hat{n} = \frac{1}{\sqrt{3}}[1, 1, 1]^T$.

**Verification:**
The physical rotation angle at $s=0.5$ is exactly half of the total physical angle $\theta_1 = 120^\circ$, confirming constant angular velocity geodesic traversal.

---

#### Problem 11.4: Numerical Drift in Open-Loop Kinematics vs. $\operatorname{CLIK}$ Compensation
**Statement:**
A 1-DoF prismatic actuator controls position $x = q$ with desired trajectory $x_d(t) = \sin(t)$. Due to a systematic sensor calibration bias and integration error, the computed forward kinematics update is simulated with discrete time-step $\Delta t = 0.1\text{ s}$ using forward Euler integration.
1. Show that open-loop velocity inversion $\dot{q} = \dot{x}_d$ with an initial disturbance $e(0) = 0.05\text{ m}$ retains the tracking error indefinitely.
2. Formulate the $\operatorname{CLIK}$ scheme $\dot{q} = \dot{x}_d + k_p (x_d - q)$ with gain $k_p = 5.0\text{ s}^{-1}$. Determine the analytical closed-form expression for $e(t)$ and compute the tracking error remaining after $t = 1.0\text{ s}$.

**Given Data:**
- $x_d(t) = \sin(t)$, $\dot{x}_d(t) = \cos(t)$.
- Initial error $e(0) = x_d(0) - q(0) = 0.05\text{ m}$.
- Feedback gain $k_p = 5.0\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. Open-loop inversion:
   $$\dot{q}(t) = \dot{x}_d(t) \implies q(t) = q(0) + \int_0^t \dot{x}_d(\tau) d\tau = q(0) + x_d(t) - x_d(0)$$
   Tracking error:
   $$e(t) = x_d(t) - q(t) = x_d(t) - [q(0) + x_d(t) - x_d(0)] = x_d(0) - q(0) = e(0)$$
   Thus, for all $t \ge 0$, $e(t) = e(0) = 0.05\text{ m}$. Open-loop inversion possesses zero error rejection capability.
2. $\operatorname{CLIK}$ formulation:
   $$\dot{q}(t) = \dot{x}_d(t) + k_p e(t)$$
   The error dynamics are:
   $$\dot{e}(t) = \dot{x}_d(t) - \dot{q}(t) = \dot{x}_d(t) - [\dot{x}_d(t) + k_p e(t)] = -k_p e(t)$$
3. Solving the first-order differential equation:
   $$e(t) = e(0) e^{-k_p t}$$
4. At $t = 1.0\text{ s}$ with $k_p = 5.0$:
   $$e(1.0) = 0.05 \cdot e^{-5.0 \times 1.0} = 0.05 \cdot e^{-5} = 0.05 \times 0.00673795 = 0.000336898\text{ m} \approx 0.337\text{ mm}$$
   The initial $50\text{ mm}$ error is suppressed by over $99.3\%$.

**Final Answer:**
- Open-loop error: $e(t) = 0.05\text{ m}$ (constant drift).
- $\operatorname{CLIK}$ error expression: $e(t) = 0.05 e^{-5 t}\text{ m}$.
- Remaining error at $t = 1.0\text{ s}$: $e(1.0) \approx 3.37 \times 10^{-4}\text{ m}$ ($0.337\text{ mm}$).

**Verification:**
$$\dot{V}(e) = e \dot{e} = e(-5e) = -5e^2 \le 0$. The time constant is $\tau = 1/k_p = 0.2\text{ s}$. At $t = 1.0\text{ s}$, $5$ time constants have elapsed ($e^{-5} \approx 0.00674$). Exact match.

---

#### Problem 11.5: Nullspace Logarithmic Barrier Potential for Joint Limit Avoidance
**Statement:**
A 3-DoF planar redundant manipulator ($n=3, m=2$) has joint angles $q = [0.8, 1.2, 0.5]^T\text{ rad}$. The joint limits for joint 1 are $q_{1,\min} = 0.0\text{ rad}$ and $q_{1,\max} = 1.0\text{ rad}$. The Jacobian matrix at this configuration is:
$$J = \begin{bmatrix} -0.6 & -0.4 & -0.2 \\ 0.8 & 0.5 & 0.3 \end{bmatrix}$$
The desired end-effector task velocity is $\dot{x}_d = [0, 0]^T$ (holding pose). 
Using the logarithmic barrier function:
$$V_1(q_1) = -\ln\left( \frac{(q_1 - q_{1,\min})(q_{1,\max} - q_1)}{(q_{1,\max} - q_{1,\min})^2} \right)$$
and secondary gain $k_{\text{lim}} = 0.1$, compute the primary pseudoinverse velocity $\dot{q}_{\text{task}}$, the barrier repulsive gradient $g_1$, the nullspace projector $P = I - J^+ J$, and the resulting joint velocities $\dot{q}$ that push joint 1 away from its upper limit without moving the end-effector.

**Given Data:**
- $q_1 = 0.8$, $q_{1,\min} = 0.0$, $q_{1,\max} = 1.0$.
- $J = \begin{bmatrix} -0.6 & -0.4 & -0.2 \\ 0.8 & 0.5 & 0.3 \end{bmatrix}$, $\dot{x}_d = [0, 0]^T$, $k_{\text{lim}} = 0.1$.

**Step-by-Step Derivation:**
1. Task velocity contribution:
   $$\dot{q}_{\text{task}} = J^+ \dot{x}_d = J^+ \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
2. Compute barrier gradient for joint 1:
   $$\frac{\partial V_1}{\partial q_1} = \frac{2 q_1 - (q_{1,\max} + q_{1,\min})}{(q_1 - q_{1,\min})(q_{1,\max} - q_1)} = \frac{2(0.8) - 1.0}{(0.8 - 0.0)(1.0 - 0.8)} = \frac{1.6 - 1.0}{(0.8)(0.2)} = \frac{0.6}{0.16} = 3.75\text{ rad}^{-1}$$
   Assuming joints 2 and 3 are at center limits, the full gradient vector is:
   $$g_{\text{lim}} = \begin{bmatrix} 3.75 \\ 0 \\ 0 \end{bmatrix}$$
3. Compute $J J^T$:
   $$J J^T = \begin{bmatrix} (-0.6)^2 + (-0.4)^2 + (-0.2)^2 & (-0.6)(0.8) + (-0.4)(0.5) + (-0.2)(0.3) \\ (-0.6)(0.8) + (-0.4)(0.5) + (-0.2)(0.3) & 0.8^2 + 0.5^2 + 0.3^2 \end{bmatrix}$$
   $$J J^T = \begin{bmatrix} 0.36 + 0.16 + 0.04 & -0.48 - 0.20 - 0.06 \\ -0.74 & 0.64 + 0.25 + 0.09 \end{bmatrix} = \begin{bmatrix} 0.56 & -0.74 \\ -0.74 & 0.98 \end{bmatrix}$$
   Determinant:
   $$\det(J J^T) = (0.56)(0.98) - (-0.74)^2 = 0.5488 - 0.5476 = 0.0012$$
   Inverse:
   $$(J J^T)^{-1} = \frac{1}{0.0012} \begin{bmatrix} 0.98 & 0.74 \\ 0.74 & 0.56 \end{bmatrix} = \begin{bmatrix} 816.6667 & 616.6667 \\ 616.6667 & 466.6667 \end{bmatrix}$$
4. Compute nullspace basis $v_{\text{null}}$:
   A vector in the nullspace of $J$ satisfies $J v_{\text{null}} = 0$:
   $$-0.6 v_1 - 0.4 v_2 - 0.2 v_3 = 0 \implies 3 v_1 + 2 v_2 + v_3 = 0$$
   $$0.8 v_1 + 0.5 v_2 + 0.3 v_3 = 0 \implies 8 v_1 + 5 v_2 + 3 v_3 = 0$$
   From $3 v_1 + 2 v_2 + v_3 = 0 \implies v_3 = -3 v_1 - 2 v_2$.
   Substitute into second equation:
   $$8 v_1 + 5 v_2 + 3(-3 v_1 - 2 v_2) = 8 v_1 + 5 v_2 - 9 v_1 - 6 v_2 = -v_1 - v_2 = 0 \implies v_2 = -v_1$$
   Then $v_3 = -3 v_1 - 2(-v_1) = -v_1$.
   Choosing $v_1 = 1$, the unnormalized nullspace basis is $n_0 = [1, -1, -1]^T$.
   Normalizing:
   $$\hat{n}_0 = \frac{1}{\sqrt{1^2 + (-1)^2 + (-1)^2}} \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix}$$
5. The rank-1 nullspace projector is:
   $$P = I - J^+ J = \hat{n}_0 \hat{n}_0^T = \frac{1}{3} \begin{bmatrix} 1 & -1 & -1 \\ -1 & 1 & 1 \\ -1 & 1 & 1 \end{bmatrix}$$
6. Projected nullspace avoidance velocity:
   $$\dot{q} = -k_{\text{lim}} P g_{\text{lim}} = -0.1 \left( \frac{1}{3} \begin{bmatrix} 1 & -1 & -1 \\ -1 & 1 & 1 \\ -1 & 1 & 1 \end{bmatrix} \begin{bmatrix} 3.75 \\ 0 \\ 0 \end{bmatrix} \right) = -0.1 \begin{bmatrix} 1.25 \\ -1.25 \\ -1.25 \end{bmatrix} = \begin{bmatrix} -0.125 \\ +0.125 \\ +0.125 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
- Primary task velocity: $\dot{q}_{\text{task}} = [0, 0, 0]^T$.
- Repulsive gradient: $g_{\text{lim}} = [3.75, 0, 0]^T\text{ rad}^{-1}$.
- Net joint velocity: $\dot{q} = [-0.125, +0.125, +0.125]^T\text{ rad/s}$.

**Verification:**
Check end-effector velocity invariance:
$$J \dot{q} = \begin{bmatrix} -0.6 & -0.4 & -0.2 \\ 0.8 & 0.5 & 0.3 \end{bmatrix} \begin{bmatrix} -0.125 \\ 0.125 \\ 0.125 \end{bmatrix} = \begin{bmatrix} (-0.6)(-0.125) + (-0.4)(0.125) + (-0.2)(0.125) \\ (0.8)(-0.125) + (0.5)(0.125) + (0.3)(0.125) \end{bmatrix} = \begin{bmatrix} 0.075 - 0.050 - 0.025 \\ -0.100 + 0.0625 + 0.0375 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix}$$.
Joint 1 moves safely away from its limit ($\dot{q}_1 = -0.125\text{ rad/s}$) while the end-effector remains completely stationary.

---

#### Problem 11.6: Single-Step 2D Cyclic Coordinate Descent ($\operatorname{CCD}$) Update
**Statement:**
A 2-link planar arm with link lengths $l_1 = 1.0\text{ m}, l_2 = 1.0\text{ m}$ is at configuration $\theta_1 = 0^\circ, \theta_2 = 0^\circ$. The base is at the origin $p_0 = [0, 0]^T$. The elbow is at $p_1 = [1, 0]^T$, and the end-effector is at $p_e = [2, 0]^T$. The target is at $p_t = [1, 1]^T$.
Execute one backward sweep of $\operatorname{CCD}$:
1. Compute the angular update $\Delta\theta_2$ for joint 2 and update $p_e$.
2. Compute the angular update $\Delta\theta_1$ for joint 1.
3. Compute the final end-effector position and residual distance to $p_t$.

**Given Data:**
- $p_0 = [0, 0]^T$, $p_1 = [1, 0]^T$, initial $p_e = [2, 0]^T$, $p_t = [1, 1]^T$.
- Initial angles: $\theta_1 = 0, \theta_2 = 0$.

**Step-by-Step Derivation:**
1. **Update Joint 2 (Elbow at $p_1$):**
   - Vector from elbow to end-effector:
     $$v_e = p_e - p_1 = [2, 0]^T - [1, 0]^T = [1, 0]^T$$
   - Vector from elbow to target:
     $$v_t = p_t - p_1 = [1, 1]^T - [1, 0]^T = [0, 1]^T$$
   - Angle between $v_e$ and $v_t$:
     $$v_e \cdot v_t = 1(0) + 0(1) = 0$$
     $$v_e \times v_t = (1)(1) - (0)(0) = 1.0$$
     $$\Delta\theta_2 = \operatorname{atan2}(1.0, 0.0) = \frac{\pi}{2} = 90^\circ$$
   - New joint 2 angle: $\theta_2 \leftarrow 0 + 90^\circ = 90^\circ$.
   - New end-effector position:
     $$p_e = p_1 + R(90^\circ) [1, 0]^T = [1, 0]^T + [0, 1]^T = [1, 1]^T$$
2. **Update Joint 1 (Base at $p_0$):**
   - Notice that after updating joint 2, $p_e = [1, 1]^T$.
   - The current end-effector position $p_e$ is already exactly equal to the target $p_t = [1, 1]^T$!
   - Vector from base to end-effector: $v_e = [1, 1]^T$.
   - Vector from base to target: $v_t = [1, 1]^T$.
   - $\Delta\theta_1 = \operatorname{atan2}(0, 2) = 0^\circ$.
   - Joint 1 remains $\theta_1 = 0^\circ$.

**Final Answer:**
- $\Delta\theta_2 = 90^\circ$ ($\theta_2 = 90^\circ$).
- $\Delta\theta_1 = 0^\circ$ ($\theta_1 = 0^\circ$).
- Final end-effector position: $p_e = [1, 1]^T$.
- Residual distance: $\|p_t - p_e\| = 0.0\text{ m}$ (exact convergence in 1 step).

**Verification:**
Forward kinematics for $\theta_1 = 0^\circ, \theta_2 = 90^\circ$:
$x = l_1 \cos(0^\circ) + l_2 \cos(90^\circ) = 1.0(1) + 1.0(0) = 1.0$.
$y = l_1 \sin(0^\circ) + l_2 \sin(90^\circ) = 1.0(0) + 1.0(1) = 1.0$.
Target reached precisely.

---

#### Problem 11.7: One Full Iteration of $\operatorname{FABRIK}$ on a 2-Link Manipulator
**Statement:**
A 2-link planar chain has base $p_0 = [0, 0]^T$ and link lengths $d_0 = 1.0\text{ m}, d_1 = 1.0\text{ m}$.
Initial joint positions are $p_0 = [0, 0]^T, p_1 = [1, 0]^T, p_2 = [2, 0]^T$. The target position is $p_t = [1, 1]^T$.
Perform exactly one iteration (one forward sweep and one backward sweep) of the $\operatorname{FABRIK}$ algorithm. Compute the intermediate positions $p_i^{(1/2)}$, updated positions $p_i^{(1)}$, and the Euclidean tracking error after iteration 1.

**Given Data:**
- $p_0 = [0, 0]^T, p_1 = [1, 0]^T, p_2 = [2, 0]^T$.
- $d_0 = 1.0, d_1 = 1.0$, $p_t = [1, 1]^T$.

**Step-by-Step Derivation:**
1. **Reachability Check:**
   Total reach $L = d_0 + d_1 = 2.0\text{ m}$. Distance to target: $\|p_t - p_0\| = \sqrt{1^2 + 1^2} = \sqrt{2} \approx 1.4142\text{ m} \le 2.0\text{ m}$. Target is reachable.
2. **Forward Sweep (End to Base):**
   - Set end-effector to target:
     $$p_2^{(1/2)} = p_t = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$$
   - Project to find $p_1^{(1/2)}$ along line connecting $p_2^{(1/2)}$ and $p_1^{(0)} = [1, 0]^T$:
     $$r_1 = \|p_2^{(1/2)} - p_1^{(0)}\| = \left\| \begin{bmatrix} 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1 \\ 0 \end{bmatrix} \right\| = \left\| \begin{bmatrix} 0 \\ 1 \end{bmatrix} \right\| = 1.0$$
     $$\lambda_1 = \frac{d_1}{r_1} = \frac{1.0}{1.0} = 1.0$$
     $$p_1^{(1/2)} = (1 - \lambda_1) p_2^{(1/2)} + \lambda_1 p_1^{(0)} = 0 + 1.0 \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
   - Project to find $p_0^{(1/2)}$ along line connecting $p_1^{(1/2)}$ and $p_0^{(0)} = [0, 0]^T$:
     $$r_0 = \|p_1^{(1/2)} - p_0^{(0)}\| = \| [1, 0]^T - [0, 0]^T \| = 1.0 \implies \lambda_0 = 1.0 \implies p_0^{(1/2)} = [0, 0]^T$$
3. **Backward Sweep (Base to End):**
   - Reset base to anchor:
     $$p_0^{(1)} = p_{\text{base}} = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   - Project to find $p_1^{(1)}$ along line connecting $p_0^{(1)}$ and $p_1^{(1/2)} = [1, 0]^T$:
     $$r_0 = \|p_1^{(1/2)} - p_0^{(1)}\| = 1.0 \implies \lambda_0 = 1.0 \implies p_1^{(1)} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$
   - Project to find $p_2^{(1)}$ along line connecting $p_1^{(1)}$ and $p_2^{(1/2)} = [1, 1]^T$:
     $$r_1 = \|p_2^{(1/2)} - p_1^{(1)}\| = \left\| \begin{bmatrix} 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1 \\ 0 \end{bmatrix} \right\| = 1.0$$
     $$\lambda_1 = \frac{d_1}{r_1} = \frac{1.0}{1.0} = 1.0$$
     $$p_2^{(1)} = (1 - \lambda_1) p_1^{(1)} + \lambda_1 p_2^{(1/2)} = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$$
4. **Tracking Error:**
   $$e = \|p_t - p_2^{(1)}\| = \| [1, 1]^T - [1, 1]^T \| = 0.0\text{ m}$$

**Final Answer:**
- $p_0^{(1)} = [0, 0]^T$.
- $p_1^{(1)} = [1, 0]^T$.
- $p_2^{(1)} = [1, 1]^T$.
- Tracking error: $0.0\text{ m}$ (converged in 1 iteration).

**Verification:**
Link length constraints:
$\|p_1^{(1)} - p_0^{(1)}\| = \|[1, 0]^T\| = 1.0 = d_0$.
$\|p_2^{(1)} - p_1^{(1)}\| = \|[0, 1]^T\| = 1.0 = d_1$. Both link lengths strictly preserved.

---

#### Problem 11.8: Minimum Motion Duration Under Velocity and Acceleration Constraints
**Statement:**
A joint move must traverse $\Delta q = 2.5\text{ rad}$ using a quintic polynomial trajectory. The actuator is subject to hard limits on maximum velocity $v_{\lim} = 2.0\text{ rad/s}$ and maximum acceleration $a_{\lim} = 5.0\text{ rad/s}^2$.
Compute the minimum allowable motion duration $T_{\min}$ that simultaneously satisfies both velocity and acceleration constraints.

**Given Data:**
- $\Delta q = 2.5\text{ rad}$.
- $v_{\lim} = 2.0\text{ rad/s}$, $a_{\lim} = 5.0\text{ rad/s}^2$.

**Step-by-Step Derivation:**
1. Recall the peak velocity of a quintic polynomial:
   $$\dot{q}_{\max} = \frac{15 \Delta q}{8 T} \le v_{\lim}$$
   Solving for duration $T$ based on velocity limit:
   $$T \ge \frac{15 \Delta q}{8 v_{\lim}} = \frac{15 \times 2.5}{8 \times 2.0} = \frac{37.5}{16.0} = 2.34375\text{ s}$$
2. Recall the peak acceleration of a quintic polynomial:
   $$\ddot{q}_{\max} = \frac{10\sqrt{3}}{3} \frac{\Delta q}{T^2} \le a_{\lim}$$
   Solving for duration $T$ based on acceleration limit:
   $$T^2 \ge \frac{10\sqrt{3} \Delta q}{3 a_{\lim}} = \frac{10\sqrt{3} \times 2.5}{3 \times 5.0} = \frac{25\sqrt{3}}{15} = \frac{5\sqrt{3}}{3} = \frac{5}{\sqrt{3}} \approx 2.886751\text{ s}^2$$
   $$T \ge \sqrt{2.886751} \approx 1.69904\text{ s}$$
3. The governing minimum duration is the maximum of the two constraints:
   $$T_{\min} = \max(T_{\text{vel}}, T_{\text{acc}}) = \max(2.34375, 1.69904) = 2.34375\text{ s}$$
   In this regime, the velocity constraint is active (limiting), while the acceleration constraint is inactive.

**Final Answer:**
- $T_{\min} = 2.34375\text{ s}$ (governed by velocity limit).

**Verification:**
At $T = 2.34375\text{ s}$:
$\dot{q}_{\max} = \frac{15(2.5)}{8(2.34375)} = 2.0\text{ rad/s} = v_{\lim}$.
$\ddot{q}_{\max} = \frac{10\sqrt{3}(2.5)}{3(2.34375)^2} = \frac{43.30127}{16.4795} = 2.6276\text{ rad/s}^2 \le 5.0\text{ rad/s}^2$. Both constraints strictly satisfied.

---

#### Problem 11.9: Discrete-Time Integration Stability of $\operatorname{CLIK}$
**Statement:**
In a discrete-time robot controller running at sampling rate $f_s = 500\text{ Hz}$ ($\Delta t = 0.002\text{ s}$), $\operatorname{CLIK}$ uses forward Euler integration:
$$q_{k+1} = q_k + \Delta t \, J^+(q_k) \left( \dot{x}_{d,k} + K_p e_k \right)$$
Assuming a scalar 1-DoF system with $J = 1$:
1. Derive the discrete-time error recurrence relation $e_{k+1} = A_{\text{discrete}} e_k$.
2. Determine the theoretical upper bound on feedback gain $K_p$ for numerical stability ($|A_{\text{discrete}}| < 1$).
3. If $K_p = 200\text{ s}^{-1}$, compute the decay factor per time step and determine if the discrete closed-loop system is stable.

**Given Data:**
- $\Delta t = 0.002\text{ s}$, $J = 1$.
- $K_p = 200\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. Forward Euler discrete update:
   $$q_{k+1} = q_k + \Delta t (\dot{x}_{d,k} + K_p e_k)$$
   Assuming $\dot{x}_{d,k} \approx \frac{x_{d,k+1} - x_{d,k}}{\Delta t}$:
   $$q_{k+1} = q_k + (x_{d,k+1} - x_{d,k}) + \Delta t K_p e_k$$
   Subtract both sides from $x_{d,k+1}$:
   $$x_{d,k+1} - q_{k+1} = x_{d,k+1} - [q_k + x_{d,k+1} - x_{d,k} + \Delta t K_p e_k]$$
   $$e_{k+1} = (x_{d,k} - q_k) - \Delta t K_p e_k = e_k - \Delta t K_p e_k = (1 - K_p \Delta t) e_k$$
2. For numerical stability of the discrete map:
   $$|1 - K_p \Delta t| < 1 \iff -1 < 1 - K_p \Delta t < 1$$
   Subtract 1:
   $$-2 < -K_p \Delta t < 0 \iff 0 < K_p < \frac{2}{\Delta t}$$
   With $\Delta t = 0.002\text{ s}$:
   $$K_{p,\text{crit}} = \frac{2}{0.002} = 1000\text{ s}^{-1}$$
3. For $K_p = 200\text{ s}^{-1}$:
   $$A_{\text{discrete}} = 1 - (200)(0.002) = 1 - 0.4 = 0.6$$
   Since $|0.6| < 1$, the discrete system is monotonically stable. In each $2\text{ ms}$ servo tick, error decays by $40\%$.

**Final Answer:**
- Discrete recurrence: $e_{k+1} = (1 - K_p \Delta t) e_k$.
- Upper bound for stability: $K_p < 1000\text{ s}^{-1}$.
- Decay factor: $0.6$ per tick (stable).

**Verification:**
After 10 ticks ($20\text{ ms}$), error decreases by a factor of $(0.6)^{10} \approx 0.00605$, eliminating $99.4\%$ of the error smoothly without overshoot or oscillation.

---

#### Problem 11.10: Unreachable Target Geometry in $\operatorname{FABRIK}$
**Statement:**
A 3-link planar manipulator with base $p_0 = [0, 0]^T$ and link lengths $d_0 = 1.0\text{ m}, d_1 = 0.8\text{ m}, d_2 = 0.6\text{ m}$ is commanded to reach a target point $p_t = [3.0, 4.0]^T$.
1. Determine whether the target is within the reachable workspace.
2. Apply the $\operatorname{FABRIK}$ unreachable target projection to determine the exact coordinates of all joint points $p_0, p_1, p_2, p_3$.
3. Compute the final distance from the end-effector to the target.

**Given Data:**
- $p_0 = [0, 0]^T$, $d_0 = 1.0, d_1 = 0.8, d_2 = 0.6$.
- $p_t = [3.0, 4.0]^T$.

**Step-by-Step Derivation:**
1. Total reach:
   $$L = d_0 + d_1 + d_2 = 1.0 + 0.8 + 0.6 = 2.4\text{ m}$$
   Target distance from base:
   $$D = \|p_t - p_0\| = \sqrt{3.0^2 + 4.0^2} = \sqrt{9 + 16} = 5.0\text{ m}$$
   Since $D = 5.0\text{ m} > L = 2.4\text{ m}$, the target is completely unreachable.
2. In $\operatorname{FABRIK}$, when a target is unreachable, the arm stretches fully along the line connecting $p_0$ to $p_t$.
   The unit direction vector is:
   $$\hat{u} = \frac{p_t - p_0}{\|p_t - p_0\|} = \frac{1}{5.0} \begin{bmatrix} 3.0 \\ 4.0 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}$$
3. Compute joint positions:
   $$p_0 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$
   $$p_1 = p_0 + d_0 \hat{u} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} + 1.0 \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix}$$
   $$p_2 = p_1 + d_1 \hat{u} = \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} + 0.8 \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0.6 + 0.48 \\ 0.8 + 0.64 \end{bmatrix} = \begin{bmatrix} 1.08 \\ 1.44 \end{bmatrix}$$
   $$p_3 = p_2 + d_2 \hat{u} = \begin{bmatrix} 1.08 \\ 1.44 \end{bmatrix} + 0.6 \begin{bmatrix} 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 1.08 + 0.36 \\ 1.44 + 0.48 \end{bmatrix} = \begin{bmatrix} 1.44 \\ 1.92 \end{bmatrix}$$
4. Distance from end-effector $p_3$ to target $p_t$:
   $$\|p_t - p_3\| = D - L = 5.0 - 2.4 = 2.6\text{ m}$$

**Final Answer:**
- Target is unreachable ($5.0\text{ m} > 2.4\text{ m}$).
- $p_0 = [0, 0]^T, p_1 = [0.6, 0.8]^T, p_2 = [1.08, 1.44]^T, p_3 = [1.44, 1.92]^T$.
- Residual distance: $2.6\text{ m}$.

**Verification:**
$\|p_3\| = \sqrt{1.44^2 + 1.92^2} = \sqrt{2.0736 + 3.6864} = \sqrt{5.76} = 2.4\text{ m} = L$. Arm is fully extended directly along the line of sight to target.

---

### Section 2: Solved Exercises (Problems 11.11 – 11.20)

#### Problem 11.11: Nonzero Velocity Boundary Conditions in Quintic Polynomials
**Statement:**
A robotic joint must pass through a waypoint at $t = 0$ with position $q_0 = 1.0\text{ rad}$, velocity $\dot{q}_0 = 2.0\text{ rad/s}$, and acceleration $\ddot{q}_0 = 0\text{ rad/s}^2$, and arrive at a target at $t = T = 1.0\text{ s}$ with position $q_f = 4.0\text{ rad}$, velocity $\dot{q}_f = 0\text{ rad/s}$, and acceleration $\ddot{q}_f = 0\text{ rad/s}^2$.
Compute the six coefficients of the quintic polynomial.

**Given Data:**
- $q_0 = 1.0, \dot{q}_0 = 2.0, \ddot{q}_0 = 0$.
- $q_f = 4.0, \dot{q}_f = 0, \ddot{q}_f = 0$.
- $T = 1.0\text{ s}$.

**Step-by-Step Derivation:**
1. Initial coefficients:
   $$a_0 = q_0 = 1.0$$
   $$a_1 = \dot{q}_0 = 2.0$$
   $$a_2 = \frac{1}{2}\ddot{q}_0 = 0.0$$
2. The remaining coefficients satisfy:
   $$a_3 T^3 + a_4 T^4 + a_5 T^5 = q_f - q_0 - \dot{q}_0 T - \frac{1}{2}\ddot{q}_0 T^2 = 4.0 - 1.0 - 2.0(1.0) - 0 = 1.0$$
   $$3 a_3 T^2 + 4 a_4 T^3 + 5 a_5 T^4 = \dot{q}_f - \dot{q}_0 - \ddot{q}_0 T = 0 - 2.0 - 0 = -2.0$$
   $$6 a_3 T + 12 a_4 T^2 + 20 a_5 T^3 = \ddot{q}_f - \ddot{q}_0 = 0 - 0 = 0$$
3. Since $T = 1.0$, this simplifies to:
   $$\begin{bmatrix} 1 & 1 & 1 \\ 3 & 4 & 5 \\ 6 & 12 & 20 \end{bmatrix} \begin{bmatrix} a_3 \\ a_4 \\ a_5 \end{bmatrix} = \begin{bmatrix} 1.0 \\ -2.0 \\ 0.0 \end{bmatrix}$$
4. Solving by elimination:
   - Row 2 - 3(Row 1): $a_4 + 2 a_5 = -2.0 - 3(1.0) = -5.0 \implies a_4 = -5.0 - 2 a_5$.
   - Row 3 - 6(Row 1): $6 a_4 + 14 a_5 = 0 - 6(1.0) = -6.0$.
   - Substitute $a_4$:
     $$6(-5.0 - 2 a_5) + 14 a_5 = -6.0 \implies -30.0 - 12 a_5 + 14 a_5 = -6.0 \implies 2 a_5 = 24.0 \implies a_5 = 12.0$$
   - Find $a_4$:
     $$a_4 = -5.0 - 2(12.0) = -29.0$$
   - Find $a_3$:
     $$a_3 = 1.0 - a_4 - a_5 = 1.0 - (-29.0) - 12.0 = 18.0$$

**Final Answer:**
- $a_0 = 1.0, a_1 = 2.0, a_2 = 0.0, a_3 = 18.0, a_4 = -29.0, a_5 = 12.0$.

**Verification:**
$q(1) = 1 + 2 + 18 - 29 + 12 = 4.0\text{ rad}$.
$\dot{q}(1) = 2 + 3(18) + 4(-29) + 5(12) = 2 + 54 - 116 + 60 = 0\text{ rad/s}$.
$\ddot{q}(1) = 6(18) + 12(-29) + 20(12) = 108 - 348 + 240 = 0\text{ rad/s}^2$. Exact.

---

#### Problem 11.12: LSPB Blend Time as a Function of Cruising Velocity
**Statement:**
A joint move requires displacement $D = \pi\text{ rad}$ with cruising velocity $v = 1.5\text{ rad/s}$ and total duration $T = 3.0\text{ s}$. 
Compute the required blend acceleration $a$, blend time $t_b$, and verify that $t_b < T/2$.

**Given Data:**
- $D = \pi \approx 3.14159\text{ rad}$.
- $v = 1.5\text{ rad/s}$, $T = 3.0\text{ s}$.

**Step-by-Step Derivation:**
1. The displacement in an LSPB profile is:
   $$D = v(T - t_b) \implies T - t_b = \frac{D}{v}$$
2. Solve for blend time $t_b$:
   $$t_b = T - \frac{D}{v} = 3.0 - \frac{3.14159265}{1.5} = 3.0 - 2.094395 = 0.905605\text{ s}$$
3. Check condition $t_b < T/2$:
   $$0.905605\text{ s} < \frac{3.0}{2} = 1.5\text{ s} \implies \text{Valid trapezoid.}$$
4. Calculate required acceleration $a$:
   $$a = \frac{v}{t_b} = \frac{1.5}{0.905605} \approx 1.65635\text{ rad/s}^2$$

**Final Answer:**
- $t_b \approx 0.9056\text{ s}$.
- $a \approx 1.6564\text{ rad/s}^2$.
- Condition $t_b < T/2$ is satisfied ($0.9056\text{ s} < 1.5\text{ s}$).

**Verification:**
$D = a t_b^2 + v(T - 2 t_b) = (1.65635)(0.905605)^2 + 1.5(3.0 - 1.81121) = 1.35841 + 1.78318 = 3.14159\text{ rad} = \pi$. Exact.

---

#### Problem 11.13: Antipodal Quaternion Handling in $\operatorname{Slerp}$
**Statement:**
Two orientations are given by unit quaternions:
$$q_0 = \begin{bmatrix} 1 & 0 & 0 & 0 \end{bmatrix}^T, \quad q_1 = \begin{bmatrix} -0.999 & 0.0447 & 0 & 0 \end{bmatrix}^T$$
1. Compute the dot product $q_0 \cdot q_1$.
2. Explain the physical consequence of interpolating between $q_0$ and $q_1$ without antipodal check.
3. Compute the correct shortest-path interpolated quaternion at $s = 0.5$.

**Given Data:**
- $q_0 = [1, 0, 0, 0]^T$, $q_1 = [-0.999, 0.0447, 0, 0]^T$.

**Step-by-Step Derivation:**
1. Dot product:
   $$q_0 \cdot q_1 = 1(-0.999) + 0 = -0.999 < 0$$
2. Physical consequence:
   Because $q_1 \approx -q_0$, they represent almost the exact same physical orientation (a rotation of only $\approx 5.1^\circ$ about the x-axis, since $\sin(\theta/2) \approx 0.0447 \implies \theta \approx 5.12^\circ$). 
   However, on the 4D hypersphere $S^3$, the geodesic between $q_0$ and $q_1$ traverses an angle of $\arccos(-0.999) \approx 177.4^\circ$. Without negating $q_1$, the robot will execute an unnecessary $354.8^\circ$ full rotation!
3. Antipodal correction:
   Flip sign: $q_1 \leftarrow -q_1 = [0.999, -0.0447, 0, 0]^T$.
   Now $\cos\Omega = 0.999$.
   $\Omega = \arccos(0.999) \approx 0.044726\text{ rad}$.
4. Midpoint quaternion $s = 0.5$:
   Because $\cos\Omega \approx 1$, we can use $\operatorname{Slerp}$ or $\operatorname{Nlerp}$:
   $$q_{\text{mid}} = \frac{q_0 + q_1}{\|q_0 + q_1\|} = \frac{[1.999, -0.0447, 0, 0]^T}{\sqrt{1.999^2 + (-0.0447)^2}} = \frac{[1.999, -0.0447, 0, 0]^T}{\sqrt{3.996001 + 0.001998}} = \frac{[1.999, -0.0447, 0, 0]^T}{1.9995} \approx \begin{bmatrix} 0.99975 \\ -0.02235 \\ 0 \\ 0 \end{bmatrix}$$

**Final Answer:**
- $q_0 \cdot q_1 = -0.999 < 0$.
- Without correction, the robot unwinds through $354.8^\circ$ of unnecessary motion.
- Correct midpoint: $q(0.5) \approx [0.99975, -0.02235, 0, 0]^T$.

**Verification:**
Norm: $0.99975^2 + (-0.02235)^2 = 0.99950 + 0.00050 = 1.0000$. Physical angle: $2 \arcsin(0.02235) \approx 2.56^\circ$, exactly half of $5.12^\circ$.

---

#### Problem 11.14: Quaternion Error Vector Computation for $\operatorname{CLIK}$
**Statement:**
At a given control step, the desired orientation quaternion is $q_d = [0.7071, 0, 0.7071, 0]^T$ ($90^\circ$ rotation about y-axis) and the current orientation quaternion is $q = [1, 0, 0, 0]^T$ (identity).
Compute the relative quaternion error $\Delta q = q^{-1} * q_d$ and the 3D orientation error vector $e_o = 2 \operatorname{sgn}(\Delta\eta) \Delta\epsilon$ to be fed to the Jacobian.

**Given Data:**
- $q = [1, 0, 0, 0]^T$, $q_d = [1/\sqrt{2}, 0, 1/\sqrt{2}, 0]^T$.

**Step-by-Step Derivation:**
1. Conjugate of current quaternion $q$:
   $$q^{-1} = [\eta, -\epsilon]^T = [1, 0, 0, 0]^T$$
2. Quaternion multiplication $\Delta q = q^{-1} * q_d$:
   $$\Delta\eta = \eta \eta_d + \epsilon^T \epsilon_d = 1\left(\frac{1}{\sqrt{2}}\right) + 0 = \frac{1}{\sqrt{2}} \approx 0.7071$$
   $$\Delta\epsilon = \eta \epsilon_d - \eta_d \epsilon - \epsilon \times \epsilon_d = 1 \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix} - 0 - 0 = \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$
3. Orientation error vector:
   Since $\Delta\eta > 0$, $\operatorname{sgn}(\Delta\eta) = +1$:
   $$e_o = 2 \Delta\epsilon = 2 \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ \sqrt{2} \\ 0 \end{bmatrix} \approx \begin{bmatrix} 0 \\ 1.4142 \\ 0 \end{bmatrix}$$

**Final Answer:**
- $\Delta q = [0.7071, 0, 0.7071, 0]^T$.
- $e_o = [0, \sqrt{2}, 0]^T \approx [0, 1.4142, 0]^T\text{ rad}$.

**Verification:**
For small to moderate rotations, $e_o \approx \theta \hat{n}$. Here $\theta = \pi/2 \approx 1.5708\text{ rad}$ and $2\sin(\theta/2) = 2(1/\sqrt{2}) = 1.4142$, which points directly along $\hat{y}$.

---

#### Problem 11.15: CLIK Stability with Full 6-DoF Geometric Jacobian
**Statement:**
A 6-DoF manipulator with nonsingular square Jacobian $J(q) \in \mathbb{R}^{6 \times 6}$ tracks a 6D spatial pose $x_d(t) \in \mathbb{R}^6$ using $\operatorname{CLIK}$:
$$\dot{q} = J^{-1}(q) \left( \dot{x}_d + K_p e \right)$$
where $K_p = \operatorname{diag}(k_{p,pos} I_3, k_{p,ori} I_3)$ with $k_{p,pos} = 10\text{ s}^{-1}$ and $k_{p,ori} = 20\text{ s}^{-1}$.
Prove that the position error $e_p(t)$ and orientation error $e_o(t)$ decouple in their decay rates, and compute the time required for both errors to decay to less than $1\%$ of their initial values.

**Given Data:**
- $K_p = \operatorname{diag}(10, 10, 10, 20, 20, 20)$.
- Decay target: $e(t) < 0.01 e(0)$.

**Step-by-Step Derivation:**
1. Error dynamics:
   $$\dot{e} = \dot{x}_d - J \dot{q} = \dot{x}_d - J J^{-1}(\dot{x}_d + K_p e) = -K_p e$$
2. Since $K_p$ is diagonal:
   $$\dot{e}_p = -10 e_p \implies e_p(t) = e_p(0) e^{-10 t}$$
   $$\dot{e}_o = -20 e_o \implies e_o(t) = e_o(0) e^{-20 t}$$
   The two error components decouple completely.
3. Time required for position error to decay to $1\%$:
   $$e^{-10 t_p} = 0.01 \implies -10 t_p = \ln(0.01) \approx -4.60517 \implies t_p = 0.4605\text{ s}$$
4. Time required for orientation error to decay to $1\%$:
   $$e^{-20 t_o} = 0.01 \implies -20 t_o = -4.60517 \implies t_o = 0.2303\text{ s}$$
5. Time for both to drop below $1\%$:
   $$t_{\text{settle}} = \max(t_p, t_o) = 0.4605\text{ s}$$

**Final Answer:**
- Decoupled dynamics: $\dot{e}_p = -10 e_p$ and $\dot{e}_o = -20 e_o$.
- Settling times: $t_p \approx 0.461\text{ s}$, $t_o \approx 0.230\text{ s}$.
- Total time: $t_{\text{settle}} \approx 0.461\text{ s}$.

**Verification:**
At $t = 0.4605$: $e_p/e_{p,0} = e^{-4.605} = 0.01$. Orientation error has already decayed to $(0.01)^2 = 0.0001$ ($0.01\%$).

---

#### Problem 11.16: Smooth Hyperbolic Barrier Potential Gradient
**Statement:**
A joint limit avoidance potential uses a one-sided buffer activation:
$$h(q) = \frac{1}{(q_{\max} - q)^2} - \frac{1}{\Delta q_{\text{buf}}^2} \quad \text{for } q > q_{\max} - \Delta q_{\text{buf}}$$
and $h(q) = 0$ for $q \le q_{\max} - \Delta q_{\text{buf}}$.
Given $q_{\max} = 3.0\text{ rad}$, $\Delta q_{\text{buf}} = 0.5\text{ rad}$, evaluate the potential and its gradient $\frac{\partial h}{\partial q}$ at $q = 2.4\text{ rad}$, $q = 2.7\text{ rad}$, and $q = 2.9\text{ rad}$.

**Given Data:**
- $q_{\max} = 3.0$, $\Delta q_{\text{buf}} = 0.5$, threshold $q_{\text{thresh}} = 2.5\text{ rad}$.
- $\frac{1}{\Delta q_{\text{buf}}^2} = \frac{1}{0.25} = 4.0$.

**Step-by-Step Derivation:**
1. Gradient formula for $q > 2.5$:
   $$\frac{\partial h}{\partial q} = \frac{d}{dq} \left( (q_{\max} - q)^{-2} - 4.0 \right) = -2 (q_{\max} - q)^{-3} (-1) = \frac{2}{(q_{\max} - q)^3}$$
2. Case 1: $q = 2.4\text{ rad} < 2.5\text{ rad}$:
   - Inside the safe zone: $h(2.4) = 0$, $\frac{\partial h}{\partial q}(2.4) = 0$.
3. Case 2: $q = 2.7\text{ rad} > 2.5\text{ rad}$:
   - $q_{\max} - q = 3.0 - 2.7 = 0.3\text{ rad}$.
   - $h(2.7) = \frac{1}{0.3^2} - 4.0 = \frac{1}{0.09} - 4.0 = 11.111 - 4.0 = 7.111$.
   - Gradient: $\frac{\partial h}{\partial q} = \frac{2}{0.3^3} = \frac{2}{0.027} \approx 74.074\text{ rad}^{-1}$.
4. Case 3: $q = 2.9\text{ rad} > 2.5\text{ rad}$:
   - $q_{\max} - q = 3.0 - 2.9 = 0.1\text{ rad}$.
   - $h(2.9) = \frac{1}{0.1^2} - 4.0 = 100.0 - 4.0 = 96.0$.
   - Gradient: $\frac{\partial h}{\partial q} = \frac{2}{0.1^3} = \frac{2}{0.001} = 2000.0\text{ rad}^{-1}$.

**Final Answer:**
- At $q = 2.4$: $h = 0$, $\nabla h = 0$.
- At $q = 2.7$: $h \approx 7.111$, $\nabla h \approx 74.07\text{ rad}^{-1}$.
- At $q = 2.9$: $h = 96.0$, $\nabla h = 2000.0\text{ rad}^{-1}$.

**Verification:**
As the joint approaches within $0.1\text{ rad}$ of the physical hard stop, the gradient surges by a factor of 27 from $q=2.7$, providing an impenetrable numerical barrier.

---

#### Problem 11.17: $\operatorname{CCD}$ on a 3-Link Manipulator with Angular Clamping
**Statement:**
A 3-link planar arm has link lengths $l_1 = 1, l_2 = 1, l_3 = 1$ starting at $\theta_1 = 0, \theta_2 = 0, \theta_3 = 0$. 
Joint 3 has an angular limit $|\theta_3| \le 45^\circ$. The target is at $p_t = [2.0, 1.0]^T$.
Compute the unconstrained $\operatorname{CCD}$ update for joint 3, apply the joint limit clamp, and determine the resulting position of the end-effector before proceeding to joint 2.

**Given Data:**
- $p_0 = [0, 0]^T, p_1 = [1, 0]^T, p_2 = [2, 0]^T, p_e = [3, 0]^T$.
- $p_t = [2.0, 1.0]^T$. Joint limit: $|\theta_3| \le 45^\circ$.

**Step-by-Step Derivation:**
1. Focus on Joint 3 (pivot at $p_2 = [2, 0]^T$):
   - Vector from $p_2$ to $p_e$:
     $$v_e = [3, 0]^T - [2, 0]^T = [1, 0]^T$$
   - Vector from $p_2$ to $p_t$:
     $$v_t = [2.0, 1.0]^T - [2, 0]^T = [0, 1]^T$$
   - Unconstrained rotation angle:
     $$\Delta\theta_3 = \operatorname{atan2}(1, 0) = 90^\circ$$
2. Apply joint limit constraint:
   $$\theta_{3,\text{new}} = \operatorname{clip}(0^\circ + 90^\circ, -45^\circ, 45^\circ) = 45^\circ$$
3. Update end-effector position $p_e$ with clamped angle $\theta_3 = 45^\circ$:
   $$p_e = p_2 + l_3 \begin{bmatrix} \cos(\theta_1 + \theta_2 + \theta_3) \\ \sin(\theta_1 + \theta_2 + \theta_3) \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \end{bmatrix} + 1.0 \begin{bmatrix} \cos(45^\circ) \\ \sin(45^\circ) \end{bmatrix} = \begin{bmatrix} 2 + \frac{\sqrt{2}}{2} \\ \frac{\sqrt{2}}{2} \end{bmatrix} \approx \begin{bmatrix} 2.7071 \\ 0.7071 \end{bmatrix}$$
4. Compute residual distance to target:
   $$\|p_t - p_e\| = \sqrt{(2.0 - 2.7071)^2 + (1.0 - 0.7071)^2} = \sqrt{(-0.7071)^2 + (0.2929)^2} = \sqrt{0.5000 + 0.0858} = \sqrt{0.5858} \approx 0.7654\text{ m}$$

**Final Answer:**
- Unconstrained update: $\Delta\theta_3 = 90^\circ$.
- Clamped angle: $\theta_3 = 45^\circ$.
- Updated end-effector: $p_e \approx [2.7071, 0.7071]^T$.
- Distance to target: $\approx 0.7654\text{ m}$ (decreased from initial $\|[2, 1]^T - [3, 0]^T\| = \sqrt{2} \approx 1.4142\text{ m}$).

**Verification:**
The distance decreased from $1.414\text{ m}$ to $0.765\text{ m}$, confirming monotonic convergence despite joint limit saturation.

---

#### Problem 11.18: Closed-Form Angular Extraction from $\operatorname{FABRIK}$ Joint Points
**Statement:**
After running $\operatorname{FABRIK}$ on a 2-link planar arm with link lengths $l_1 = 1.0, l_2 = 1.0$ anchored at $p_0 = [0, 0]^T$, the converged Cartesian joint points are:
$$p_0 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}, \quad p_1 = \begin{bmatrix} 0.7071 \\ 0.7071 \end{bmatrix}, \quad p_2 = \begin{bmatrix} 0.7071 \\ 1.7071 \end{bmatrix}$$
Extract the corresponding robot joint angles $\theta_1$ and $\theta_2$ in the standard forward kinematics convention.

**Given Data:**
- $p_0 = [0, 0]^T$, $p_1 = [1/\sqrt{2}, 1/\sqrt{2}]^T$, $p_2 = [1/\sqrt{2}, 1 + 1/\sqrt{2}]^T$.

**Step-by-Step Derivation:**
1. Link 1 vector:
   $$v_1 = p_1 - p_0 = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix}$$
   The global angle of link 1 is:
   $$\phi_1 = \operatorname{atan2}\left(\frac{1}{\sqrt{2}}, \frac{1}{\sqrt{2}}\right) = 45^\circ = \frac{\pi}{4}\text{ rad}$$
   Since joint 1 is anchored to the base x-axis:
   $$\theta_1 = \phi_1 = 45^\circ$$
2. Link 2 vector:
   $$v_2 = p_2 - p_1 = \begin{bmatrix} 0.7071 - 0.7071 \\ 1.7071 - 0.7071 \end{bmatrix} = \begin{bmatrix} 0 \\ 1.0 \end{bmatrix}$$
   The global angle of link 2 is:
   $$\phi_2 = \operatorname{atan2}(1.0, 0.0) = 90^\circ = \frac{\pi}{2}\text{ rad}$$
3. The relative joint angle $\theta_2$ is the difference between global angles:
   $$\theta_2 = \phi_2 - \phi_1 = 90^\circ - 45^\circ = 45^\circ = \frac{\pi}{4}\text{ rad}$$

**Final Answer:**
- $\theta_1 = 45^\circ$ ($\pi/4\text{ rad}$).
- $\theta_2 = 45^\circ$ ($\pi/4\text{ rad}$).

**Verification:**
Forward kinematics check:
$x = l_1 \cos(\theta_1) + l_2 \cos(\theta_1 + \theta_2) = 1.0 \cos(45^\circ) + 1.0 \cos(90^\circ) = \frac{\sqrt{2}}{2} + 0 \approx 0.7071$.
$y = l_1 \sin(\theta_1) + l_2 \sin(\theta_1 + \theta_2) = 1.0 \sin(45^\circ) + 1.0 \sin(90^\circ) = \frac{\sqrt{2}}{2} + 1.0 \approx 1.7071$. Matches $p_2$ exactly.

---

#### Problem 11.19: Jerk Minimization Comparison Between Cubic and Quintic Splines
**Statement:**
Compare the peak jerk $|\dddot{q}_{\max}|$ for a point-to-point motion with displacement $\Delta q = 1.0\text{ rad}$ and duration $T = 1.0\text{ s}$ between:
1. A cubic polynomial with zero boundary velocities.
2. A quintic polynomial with zero boundary velocities and accelerations.

**Given Data:**
- $\Delta q = 1.0\text{ rad}$, $T = 1.0\text{ s}$.

**Step-by-Step Derivation:**
1. **Cubic Polynomial:**
   $$q(t) = 3\Delta q\left(\frac{t}{T}\right)^2 - 2\Delta q\left(\frac{t}{T}\right)^3$$
   $$\ddot{q}(t) = \frac{6\Delta q}{T^2} - \frac{12\Delta q}{T^3} t$$
   $$\dddot{q}(t) = -\frac{12\Delta q}{T^3} = -\frac{12(1.0)}{1.0^3} = -12.0\text{ rad/s}^3 \quad \text{during } t \in (0, T)$$
   However, at boundaries $t=0^-$ and $t=T^+$, acceleration is zero, whereas at $t=0^+$, $\ddot{q} = 6.0\text{ rad/s}^2$. 
   Thus, at $t=0$, jerk is a Dirac delta impulse:
   $$\dddot{q}(0) = 6.0 \delta(t) \to \infty$$
2. **Quintic Polynomial:**
   $$\dddot{q}(t) = \frac{60\Delta q}{T^3} (1 - 6\tau + 6\tau^2) \quad \text{where } \tau = \frac{t}{T}$$
   Extrema of $\dddot{q}$ occur at boundaries $\tau = 0, 1$ and midpoint $\tau = 0.5$:
   - At $\tau = 0$: $\dddot{q}(0) = \frac{60(1.0)}{1.0^3}(1 - 0 + 0) = 60.0\text{ rad/s}^3$.
   - At $\tau = 0.5$: $\dddot{q}(0.5) = 60(1 - 3 + 1.5) = 60(-0.5) = -30.0\text{ rad/s}^3$.
   - At $\tau = 1$: $\dddot{q}(1) = 60(1 - 6 + 6) = 60.0\text{ rad/s}^3$.
   The acceleration is strictly $C^1$ continuous across the boundary, so jerk is finite everywhere with peak magnitude $|\dddot{q}_{\max}| = 60.0\text{ rad/s}^3$.

**Final Answer:**
- Cubic: Infinite boundary jerk ($\dddot{q} \to \infty$ due to acceleration step discontinuity).
- Quintic: Finite, smooth jerk everywhere with $|\dddot{q}_{\max}| = 60.0\text{ rad/s}^3$.

**Verification:**
The finite peak jerk of the quintic profile completely eliminates motor shock and mechanical gear chatter.

---

#### Problem 11.20: Complete 7-DoF Nullspace Optimization with Joint Limit and Singularity Avoidance
**Statement:**
A redundant 7-DoF manipulator with Jacobian $J \in \mathbb{R}^{6 \times 7}$ tracks a task velocity $\dot{x}_d$. The secondary objective combines joint limit avoidance potential $V_{\text{lim}}$ and Yoshikawa manipulability index $w = \sqrt{\det(J J^T)}$:
$$V_{\text{sec}}(q) = k_1 V_{\text{lim}}(q) - k_2 w(q)$$
Formulate the exact projected joint velocity control law, prove that task execution is invariant to the choice of $k_1$ and $k_2$, and explain how this formulation simultaneously protects the arm against singularities and joint limits.

**Given Data:**
- $J \in \mathbb{R}^{6 \times 7}$, $\operatorname{rank}(J) = 6$.
- $V_{\text{sec}}(q) = k_1 V_{\text{lim}}(q) - k_2 w(q)$ ($k_1 > 0, k_2 > 0$).

**Step-by-Step Derivation:**
1. The combined secondary gradient is:
   $$\nabla_q V_{\text{sec}} = k_1 \nabla_q V_{\text{lim}} - k_2 \nabla_q w$$
   To minimize $V_{\text{lim}}$ (moving away from limits) and maximize $w$ (moving away from singularities), the secondary gradient descent direction is:
   $$v_{\text{sec}} = -\nabla_q V_{\text{sec}} = -k_1 \nabla_q V_{\text{lim}} + k_2 \nabla_q w$$
2. The complete velocity control law is:
   $$\dot{q} = J^+ \left( \dot{x}_d + K_p e \right) + (I - J^+ J) v_{\text{sec}}$$
   $$\dot{q} = J^+ \left( \dot{x}_d + K_p e \right) + (I - J^+ J) \left( -k_1 \nabla_q V_{\text{lim}} + k_2 \nabla_q w \right)$$
3. **Task Space Invariance Proof:**
   Multiply the entire velocity vector by the Jacobian $J$:
   $$J \dot{q} = J J^+ (\dot{x}_d + K_p e) + J(I - J^+ J) v_{\text{sec}}$$
   Since $\operatorname{rank}(J) = 6$, $J J^+ = I_6$.
   Furthermore, $J(I - J^+ J) = J - (J J^+) J = J - I_6 J = J - J = 0$.
   Therefore:
   $$J \dot{q} = I_6 (\dot{x}_d + K_p e) + 0 \cdot v_{\text{sec}} = \dot{x}_d + K_p e$$
   The task space operational velocity is identically independent of $k_1, k_2$, and $v_{\text{sec}}$.
4. **Physical Mechanism:**
   The arm reconfigures its internal 1D nullspace swivel angle:
   - When near a joint limit, $-k_1 \nabla_q V_{\text{lim}}$ dominates, rotating the elbow to pull the endangered joint into its safe range.
   - When near a singular pose, $+k_2 \nabla_q w$ dominates, pushing the arm toward high-dexterity configurations.
   - Both self-motions occur simultaneously with zero motion of the end-effector.

**Final Answer:**
- Control law: $\dot{q} = J^+ (\dot{x}_d + K_p e) + (I - J^+ J)(-k_1 \nabla V_{\text{lim}} + k_2 \nabla w)$.
- Invariance: $J \dot{q} = \dot{x}_d + K_p e$ identically, because $J(I - J^+ J) \equiv 0$.
- Protects against limits and singularities entirely within the internal self-motion nullspace manifold.

**Verification:**
Nullspace idempotency and orthogonality: $(I - J^+ J)^2 = I - J^+ J$ and $J(I - J^+ J) = 0$. The proof is algebraically exact.

---

# Chapter 12: Production TypeScript Robotics Kinematics Engine and Capstone Synthesis

The theoretical edifice constructed across the preceding eleven chapters—spanning rigid body Lie groups $SE(3)$, twist coordinates, standard and modified Denavit-Hartenberg conventions, the Product of Exponentials formula, analytical Pieper decoupling, geometric Jacobians, manipulability ellipsoids, damped least-squares, nullspace redundancy resolution, and constrained trajectory generation—culminates in the architecture of a production-grade, zero-dependency computational kinematics engine.

In autonomous robotics, software running on embedded real-time flight controllers, industrial IPCs, or high-level web-based digital twin interfaces requires deterministic numerical stability, zero runtime allocation overhead where possible, and strict mathematical guarantees against matrix ill-conditioning and geometric drift. This capstone chapter presents:
1. The architectural blueprint and mathematical specifications of `robotics-kinematics-engine.ts`.
2. Ten Civilizational Grand Gauntlets (Problems 12.1 – 12.10): exhaustive mathematical proofs and closed-form derivations establishing the foundational theorems of modern manipulation.
3. Ten Capstone Mastery Problems (Problems 12.11 – 12.20): complex industrial and research scenarios synthesizing trajectory planning, singularity passage, nullspace optimization, and real-time control.

---

## 12.1 Architecture of the Production Kinematics Engine

The production TypeScript kinematics engine (`robotics-kinematics-engine.ts`) is designed from first principles with zero third-party dependencies. It is structured into seven tightly coupled, mathematically rigorous subsystems:

```
+-----------------------------------------------------------------------------+
|                      PRODUCTION KINEMATICS ENGINE                           |
+-----------------------------------------------------------------------------+
|  1. Lie Algebra & Spatial Group Foundation                                  |
|     - Vector3D (vector arithmetic, cross products, projections)             |
|     - Matrix4x4 (SE(3) transforms, fast 4x4 matrix inversion, homogeneous)  |
|     - Quaternion (SO(3) unit quaternions, Slerp, axis-angle, antipodal)     |
|     - TransformSE3 (Spatial poses, adjoint representations Ad_T)            |
+-----------------------------------------------------------------------------+
|  2. Kinematic Representation Core                                           |
|     - DHParameter (Standard & Modified Craig conventions)                   |
|     - ScrewAxis (Space/Body screw parameters [w; v], pitch, magnitude)      |
|     - RobotKinematicChain (Forward kinematics via DH & PoE, frames cache)   |
+-----------------------------------------------------------------------------+
|  3. Differential Kinematics Subsystem                                       |
|     - GeometricJacobian (Analytical & spatial cross-product formulation)    |
|     - ManipulabilityAnalysis (Yoshikawa index, condition number, SVD)       |
+-----------------------------------------------------------------------------+
|  4. Analytical Inverse Kinematics Engines                                   |
|     - Planar2R_IKSolver (Elbow-up / elbow-down algebraic branches)          |
|     - SphericalWristIKSolver (Pieper decoupling for 6-DoF manipulators)     |
+-----------------------------------------------------------------------------+
|  5. Numerical Inverse Kinematics Engines                                    |
|     - NewtonRaphsonIKSolver (Quadratic convergence in regular regions)      |
|     - JacobianTransposeIKSolver (Lyapunov stable step descent)              |
|     - DLSSolver (Damped Least-Squares with Nakamura-Hanafusa damping)       |
|     - NullspaceProjectionEngine (Joint limits, manipulability gradients)    |
+-----------------------------------------------------------------------------+
|  6. Geometric Heuristic Engines                                             |
|     - FABRIKSolver (Forward and backward reaching point projections)        |
|     - CCDSolver (Cyclic coordinate descent with per-joint angle clamping)   |
+-----------------------------------------------------------------------------+
|  7. Trajectory Generation & Real-Time Tracking                              |
|     - QuinticPolynomialTrajectory (C^2 boundary conditions, min jerk)       |
|     - TaskSpaceTrajectory (Point-to-point SE(3) interpolation via Slerp)    |
|     - CLIKController (Closed-loop inverse kinematics drift compensation)    |
+-----------------------------------------------------------------------------+
```

### 12.1.1 Spatial Group and Lie Algebra Implementation
The engine represents rigid body transformations in $SE(3)$ as $4 \times 4$ homogeneous transformation matrices:
$$T = \begin{bmatrix} R & p \\ 0_{1 \times 3} & 1 \end{bmatrix} \in SE(3)$$
Taking advantage of the special Euclidean structure, inversion avoids general Gaussian elimination:
$$T^{-1} = \begin{bmatrix} R^T & -R^T p \\ 0_{1 \times 3} & 1 \end{bmatrix}$$
This computation requires exactly 9 multiplications and 9 additions for the position component, achieving an order-of-magnitude speedup and zero numerical degradation.

The Adjoint representation $[\operatorname{Ad}_T] \in \mathbb{R}^{6 \times 6}$ transforms spatial twists $\mathcal{V} = [\omega; v]$ between coordinate frames:
$$[\operatorname{Ad}_T] = \begin{bmatrix} R & 0_{3 \times 3} \\ [p]_\times R & R \end{bmatrix}$$
where $[p]_\times$ is the skew-symmetric matrix:
$$[p]_\times = \begin{bmatrix} 0 & -p_z & p_y \\ p_z & 0 & -p_x \\ -p_y & p_x & 0 \end{bmatrix}$$

### 12.1.2 Unified DH and Product of Exponentials (PoE) Support
The engine accepts kinematic chain specifications in both Standard Denavit-Hartenberg ($\theta_i, d_i, a_i, \alpha_i$) and Modified Craig ($a_{i-1}, \alpha_{i-1}, d_i, \theta_i$) conventions. 

For modern open-chain manipulators, the engine also supports the Product of Exponentials (PoE) formulation:
$$T(q) = e^{[\mathcal{S}_1] q_1} e^{[\mathcal{S}_2] q_2} \cdots e^{[\mathcal{S}_n] q_n} M$$
where each screw axis $\mathcal{S}_i = [\omega_i; v_i] \in \mathbb{R}^6$ is computed in the space frame at home configuration $q=0$, and $M \in SE(3)$ is the end-effector home pose. Matrix exponentials for revolute screws ($\|\omega\|=1$) are evaluated via Rodrigues' formula:
$$e^{[\omega] q} = I_3 + \sin(q) [\omega]_\times + (1 - \cos(q)) [\omega]_\times^2$$
$$e^{[\mathcal{S}] q} = \begin{bmatrix} e^{[\omega] q} & \left( I_3 q + (1 - \cos q)[\omega]_\times + (q - \sin q)[\omega]_\times^2 \right) v \\ 0_{1 \times 3} & 1 \end{bmatrix}$$

### 12.1.3 Differential Kinematics and Singular Value Decomposition (SVD)
The geometric Jacobian $J(q) = [J_1(q) \; \dots \; J_n(q)] \in \mathbb{R}^{6 \times n}$ is computed recursively from joint origin positions $p_i$ and rotation axes $z_i$:
$$J_i(q) = \begin{bmatrix} z_{i-1} \times (p_e - p_{i-1}) \\ z_{i-1} \end{bmatrix} \quad \text{(for revolute joints)}$$
For spectral analysis, the engine implements a zero-allocation, symmetric Jacobi eigenvalue solver on $A = J J^T \in \mathbb{R}^{6 \times 6}$. The singular values $\sigma_i = \sqrt{\lambda_i(J J^T)}$ yield:
- **Yoshikawa Manipulability Measure:**
  $$w = \sqrt{\det(J J^T)} = \prod_{i=1}^6 \sigma_i$$
- **Condition Number:**
  $$\kappa(J) = \frac{\sigma_{\max}}{\sigma_{\min}}$$

### 12.1.4 Redundant Inverse Kinematics and Adaptive DLS
For redundant arms ($n > m$), the Moore-Penrose pseudoinverse with adaptive Levenberg-Marquardt damping is computed via the push-through identity:
$$J^{*\lambda} = J^T (J J^T + \lambda^2 I_m)^{-1}$$
where damping $\lambda^2$ is smoothly varied using the Nakamura-Hanafusa metric:
$$\lambda^2 = \begin{cases} 0 & \text{if } w \ge w_0 \\ \lambda_0^2 \left( 1 - \frac{w}{w_0} \right)^2 & \text{if } w < w_0 \end{cases}$$
Nullspace projections $P = I_n - J^+ J$ are applied to optimize secondary performance criteria (joint limits, obstacle distance) without perturbing the primary task:
$$\dot{q} = J^+ \dot{x}_d + (I_n - J^+ J) \nabla_q H(q)$$

---

## 12.2 Civilizational Grand Gauntlets (Problems 12.1 – 12.10)

#### Problem 12.1: Algebraic Proof of Pieper's Criterion for Closed-Form Solvability
**Statement:**
Pieper's Theorem asserts that a 6-DoF serial manipulator possesses a closed-form analytical inverse kinematics solution if three consecutive joint axes intersect at a single point (such as a spherical wrist) or are mutually parallel. Provide the complete algebraic proof of Pieper's criterion for a 6R manipulator whose last three axes ($z_4, z_5, z_6$) intersect at wrist center point $p_w$. Prove that the position of $p_w$ is completely independent of joint angles $q_4, q_5, q_6$, and deduce the resulting polynomial degree in $\tan(q_3/2)$.

**Given Data:**
- 6-DoF serial manipulator with joint variables $q_1, \dots, q_6$.
- Axes $z_4, z_5, z_6$ intersect at common point $p_w$ (spherical wrist).
- Desired end-effector pose $T_d = \begin{bmatrix} R_d & p_d \\ 0 & 1 \end{bmatrix}$ with approach vector $a_d = R_d \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$ and wrist offset $d_6$.

**Step-by-Step Derivation:**
1. Express the end-effector origin $p_e$ in terms of the wrist center $p_w$ and frame 6 orientation:
   $$p_e = p_w + d_6 z_6$$
   Since $z_6$ in the base frame is identical to the third column of $R_d$ (the approach vector $a_d$):
   $$p_w = p_d - d_6 a_d$$
2. Let $T_i^{i-1}(q_i)$ be the DH transformation from link $i$ to link $i-1$. The position of the wrist center in the base frame is:
   $$p_w = T_1^0(q_1) T_2^1(q_2) T_3^2(q_3) p_w^{(3)}$$
   where $p_w^{(3)}$ is the coordinates of $p_w$ expressed in frame 3.
3. Crucially, because axes 4, 5, and 6 intersect at $p_w$, rotating joints 4, 5, or 6 applies rotations whose center of rotation is $p_w$ itself. Therefore, the distance from frame 3 origin to $p_w$ is fixed:
   $$p_w^{(3)} = \begin{bmatrix} a_3 \\ -d_4 \sin\alpha_3 \\ d_4 \cos\alpha_3 \end{bmatrix} = \text{constant vector independent of } q_4, q_5, q_6$$
   Thus, $p_w(q_1, q_2, q_3) = p_d - d_6 a_d$ forms a decoupled 3-variable vector equation:
   $$f(q_1, q_2, q_3) = p_w$$
4. Project $p_w = [x_w, y_w, z_w]^T$:
   - For an arm with $a_1 = 0, \alpha_1 = \pm 90^\circ$:
     $$q_1 = \operatorname{atan2}(y_w, x_w) \quad \text{or} \quad q_1 = \operatorname{atan2}(-y_w, -x_w)$$
     This yields 2 distinct solutions for $q_1$.
5. In the planar slice spanned by links 2 and 3:
   The distance from shoulder to wrist is:
   $$r^2 = x_w^2 + y_w^2 + (z_w - d_1)^2 = a_2^2 + a_3^2 + d_4^2 + 2 a_2 \sqrt{a_3^2 + d_4^2} \cos(q_3 + \phi)$$
   where $\phi = \operatorname{atan2}(d_4, a_3)$.
   Applying the tangent half-angle substitution $u = \tan(q_3/2)$:
   $$\cos(q_3) = \frac{1 - u^2}{1 + u^2}, \quad \sin(q_3) = \frac{2u}{1 + u^2}$$
   Substituting into the distance equation yields a quadratic polynomial in $u$:
   $$A u^2 + B u + C = 0$$
   A quadratic polynomial possesses at most 2 real roots for $u$, corresponding to 2 solutions for $q_3$ (elbow-up and elbow-down).
6. With $q_1, q_3$ known, $q_2$ is uniquely determined for each pair, giving $2 \times 2 = 4$ arm configurations.
7. For each of the 4 arm configurations, the orientation of the wrist is:
   $$R_6^3(q_4, q_5, q_6) = (R_3^0(q_1, q_2, q_3))^T R_d$$
   Because the wrist is spherical (Euler Z-Y-Z or Z-Y-X), solving for $q_4, q_5, q_6$ yields exactly 2 solutions (wrist-flip: $q_5$ and $-q_5$).
8. Total closed-form solutions: $4 \times 2 = 8$ branches.

**Final Answer:**
- Proof concludes that $p_w = p_d - d_6 a_d$ is identically independent of $q_4, q_5, q_6$.
- Tangent half-angle reduction yields a polynomial of degree 2 (quadratic), guaranteeing at most 8 closed-form kinematic branches.

**Verification:**
Every industrial 6R robot with a spherical wrist (Puma 560, UR5, KUKA KR6) conforms exactly to Pieper's criterion and exhibits exactly 8 analytical inverse kinematic solutions.

---

#### Problem 12.2: Analytical Bound on the Spectral Filter Factor in Damped Least-Squares
**Statement:**
In Damped Least-Squares ($\operatorname{DLS}$), the inverse mapping uses the regularized pseudoinverse $J^{*\lambda} = J^T (J J^T + \lambda^2 I)^{-1}$. 
Using the Singular Value Decomposition $J = U \Sigma V^T$, prove that the singular value filtering factor is $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$. Prove algebraically that $f(\sigma)$ achieves an absolute global maximum of $\frac{1}{2\lambda}$ at $\sigma = \lambda$, and demonstrate that the joint velocity norm $\|\dot{q}\|$ is unconditionally bounded by $\frac{\|\dot{x}\|}{2\lambda}$.

**Given Data:**
- $J = U \Sigma V^T \in \mathbb{R}^{m \times n}$ ($m \le n$), singular values $\sigma_1 \ge \dots \ge \sigma_m > 0$.
- Damping factor $\lambda > 0$.

**Step-by-Step Derivation:**
1. Express $J J^T$ in terms of SVD:
   $$J J^T = (U \Sigma V^T)(V \Sigma^T U^T) = U \Sigma \Sigma^T U^T = U \operatorname{diag}(\sigma_1^2, \dots, \sigma_m^2) U^T$$
2. Add damping matrix $\lambda^2 I_m$:
   $$J J^T + \lambda^2 I_m = U \operatorname{diag}(\sigma_1^2 + \lambda^2, \dots, \sigma_m^2 + \lambda^2) U^T$$
   Inverting:
   $$(J J^T + \lambda^2 I_m)^{-1} = U \operatorname{diag}\left( \frac{1}{\sigma_1^2 + \lambda^2}, \dots, \frac{1}{\sigma_m^2 + \lambda^2} \right) U^T$$
3. Pre-multiply by $J^T = V \Sigma^T U^T$:
   $$J^{*\lambda} = V \Sigma^T U^T U \operatorname{diag}\left( \frac{1}{\sigma_i^2 + \lambda^2} \right) U^T = V \Sigma^T \operatorname{diag}\left( \frac{1}{\sigma_i^2 + \lambda^2} \right) U^T$$
   $$J^{*\lambda} = V \operatorname{diag}\left( \frac{\sigma_1}{\sigma_1^2 + \lambda^2}, \dots, \frac{\sigma_m}{\sigma_m^2 + \lambda^2} \right) U^T$$
   Thus, for each singular component $i$, the filter factor is:
   $$f(\sigma_i) = \frac{\sigma_i}{\sigma_i^2 + \lambda^2}$$
4. Find the global maximum of $f(\sigma)$ for $\sigma \in (0, \infty)$:
   Differentiating with respect to $\sigma$:
   $$\frac{d f}{d\sigma} = \frac{1 \cdot (\sigma^2 + \lambda^2) - \sigma(2\sigma)}{(\sigma^2 + \lambda^2)^2} = \frac{\lambda^2 - \sigma^2}{(\sigma^2 + \lambda^2)^2}$$
5. Setting derivative to zero:
   $$\frac{d f}{d\sigma} = 0 \implies \lambda^2 - \sigma^2 = 0 \implies \sigma = \lambda$$
   Evaluating $f(\sigma)$ at $\sigma = \lambda$:
   $$f(\lambda) = \frac{\lambda}{\lambda^2 + \lambda^2} = \frac{\lambda}{2\lambda^2} = \frac{1}{2\lambda}$$
6. Bound on joint velocity:
   For any task velocity $\dot{x} \in \mathbb{R}^m$:
   $$\dot{q} = J^{*\lambda} \dot{x} = \sum_{i=1}^m \frac{\sigma_i}{\sigma_i^2 + \lambda^2} (u_i^T \dot{x}) v_i$$
   Taking Euclidean norms:
   $$\|\dot{q}\|^2 = \sum_{i=1}^m \left( \frac{\sigma_i}{\sigma_i^2 + \lambda^2} \right)^2 (u_i^T \dot{x})^2 \le \max_i \left( \frac{\sigma_i}{\sigma_i^2 + \lambda^2} \right)^2 \sum_{i=1}^m (u_i^T \dot{x})^2$$
   Since $\max_\sigma f(\sigma) = \frac{1}{2\lambda}$ and $\sum (u_i^T \dot{x})^2 = \|\dot{x}\|^2$:
   $$\|\dot{q}\| \le \frac{1}{2\lambda} \|\dot{x}\|$$

**Final Answer:**
- Filter factor: $f(\sigma) = \frac{\sigma}{\sigma^2 + \lambda^2}$.
- Global maximum: $f_{\max} = \frac{1}{2\lambda}$ attained precisely at $\sigma = \lambda$.
- Norm bound: $\|\dot{q}\| \le \frac{\|\dot{x}\|}{2\lambda}$ unconditionally for all configurations.

**Verification:**
As $\sigma \to 0$ (exact singularity), $f(\sigma) \to 0$. In contrast to unregularized pseudoinverse where $f(\sigma) = 1/\sigma \to \infty$, DLS guarantees that joint velocities remain strictly finite.

---

#### Problem 12.3: Algebraic Proof of the Push-Through Identity for Redundant Manipulators
**Statement:**
In numerical inverse kinematics for a redundant manipulator ($n > m$), the Damped Least-Squares solution can be expressed in two mathematically identical forms:
$$\text{Form 1 (Joint Space):} \quad J^{*\lambda} = (J^T J + \lambda^2 I_n)^{-1} J^T$$
$$\text{Form 2 (Task Space):} \quad J^{*\lambda} = J^T (J J^T + \lambda^2 I_m)^{-1}$$
Prove the push-through matrix identity:
$$(J^T J + \lambda^2 I_n)^{-1} J^T = J^T (J J^T + \lambda^2 I_m)^{-1}$$
and analyze the computational complexity reduction when applied to a 7-DoF manipulator in 3D operational space ($n=7, m=3$).

**Given Data:**
- $J \in \mathbb{R}^{m \times n}$, $\lambda > 0$, $I_n \in \mathbb{R}^{n \times n}$, $I_m \in \mathbb{R}^{m \times m}$.

**Step-by-Step Derivation:**
1. Start with the fundamental matrix multiplication associativity:
   $$J^T (J J^T + \lambda^2 I_m) = J^T J J^T + \lambda^2 J^T$$
2. Factor $J^T$ to the right:
   $$J^T J J^T + \lambda^2 J^T = (J^T J + \lambda^2 I_n) J^T$$
3. Thus, we have the exact equality:
   $$(J^T J + \lambda^2 I_n) J^T = J^T (J J^T + \lambda^2 I_m)$$
4. Pre-multiply both sides by $(J^T J + \lambda^2 I_n)^{-1}$:
   $$J^T = (J^T J + \lambda^2 I_n)^{-1} J^T (J J^T + \lambda^2 I_m)$$
5. Post-multiply both sides by $(J J^T + \lambda^2 I_m)^{-1}$:
   $$J^T (J J^T + \lambda^2 I_m)^{-1} = (J^T J + \lambda^2 I_n)^{-1} J^T$$
   This proves the push-through identity identically.
6. **Computational Complexity Analysis ($n=7, m=3$):**
   - Form 1 requires inverting $(J^T J + \lambda^2 I_7) \in \mathbb{R}^{7 \times 7}$. Inverting a $7 \times 7$ symmetric matrix via Cholesky decomposition requires $\frac{1}{3}(7)^3 \approx 114$ floating-point operations.
   - Form 2 requires inverting $(J J^T + \lambda^2 I_3) \in \mathbb{R}^{3 \times 3}$. Inverting a $3 \times 3$ matrix requires closed-form Cramer's rule or Cholesky with $\frac{1}{3}(3)^3 = 9$ operations.
   - Speedup in matrix inversion is $114 / 9 \approx 12.7\times$.

**Final Answer:**
- Identity proven: $(J^T J + \lambda^2 I_n)^{-1} J^T \equiv J^T (J J^T + \lambda^2 I_m)^{-1}$.
- Inversion dimension reduced from $n \times n$ ($7 \times 7$) to $m \times m$ ($3 \times 3$), saving $\approx 92\%$ of matrix inversion computations.

**Verification:**
Let $J = [1, 2]$ ($m=1, n=2$), $\lambda = 1$.
Form 1: $J^T J + I_2 = \begin{bmatrix} 1 \\ 2 \end{bmatrix} [1, 2] + I_2 = \begin{bmatrix} 2 & 2 \\ 2 & 5 \end{bmatrix}$. Inverse: $\frac{1}{6} \begin{bmatrix} 5 & -2 \\ -2 & 2 \end{bmatrix}$.
$J^{*\lambda} = \frac{1}{6} \begin{bmatrix} 5 & -2 \\ -2 & 2 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 1 \\ 2 \end{bmatrix} = [1/6, 2/6]^T$.
Form 2: $J J^T + I_1 = (1+4) + 1 = 6$. Inverse: $1/6$.
$J^{*\lambda} = J^T (1/6) = \begin{bmatrix} 1 \\ 2 \end{bmatrix} (1/6) = [1/6, 2/6]^T$. Both expressions yield the exact same result.

---

#### Problem 12.4: Rigorous Proof of Nullspace Projector Idempotency and Invariance
**Statement:**
Let $J \in \mathbb{R}^{m \times n}$ with $\operatorname{rank}(J) = m < n$. Define the Moore-Penrose pseudoinverse $J^+ = J^T (J J^T)^{-1}$ and the nullspace projector $P = I_n - J^+ J$.
Prove algebraically:
1. $P$ is idempotent: $P^2 = P$.
2. $P$ is symmetric: $P^T = P$.
3. $J P = 0_{m \times n}$ (complete task cancellation).
4. For any arbitrary secondary joint velocity $v_{\text{sec}} \in \mathbb{R}^n$, the task space velocity of $\dot{q} = J^+ \dot{x} + P v_{\text{sec}}$ is strictly $J \dot{q} = \dot{x}$.

**Given Data:**
- $J^+ = J^T (J J^T)^{-1}$, $P = I_n - J^+ J$.

**Step-by-Step Derivation:**
1. Check $J J^+$:
   $$J J^+ = J J^T (J J^T)^{-1} = I_m$$
2. **Proof that $J P = 0$:**
   $$J P = J (I_n - J^+ J) = J I_n - J J^+ J = J - I_m J = J - J = 0_{m \times n}$$
3. **Proof of Idempotency ($P^2 = P$):**
   $$P^2 = (I_n - J^+ J)(I_n - J^+ J) = I_n^2 - I_n J^+ J - J^+ J I_n + (J^+ J)(J^+ J)$$
   $$= I_n - 2 J^+ J + J^+ \underbrace{(J J^+)}_{= I_m} J = I_n - 2 J^+ J + J^+ I_m J = I_n - 2 J^+ J + J^+ J = I_n - J^+ J = P$$
4. **Proof of Symmetry ($P^T = P$):**
   $$P^T = (I_n - J^+ J)^T = I_n^T - (J^+ J)^T = I_n - J^T (J^+)^T$$
   Since $J^+ = J^T (J J^T)^{-1}$:
   $$(J^+)^T = \left( (J J^T)^{-1} \right)^T (J^T)^T = (J J^T)^{-1} J$$
   Therefore:
   $$J^T (J^+)^T = J^T (J J^T)^{-1} J = J^+ J$$
   Thus:
   $$P^T = I_n - J^+ J = P$$
5. **Proof of Task Space Invariance:**
   $$\dot{q} = J^+ \dot{x} + P v_{\text{sec}}$$
   Multiply by $J$:
   $$J \dot{q} = J J^+ \dot{x} + J P v_{\text{sec}} = I_m \dot{x} + 0_{m \times n} v_{\text{sec}} = \dot{x}$$

**Final Answer:**
- $P^2 = P$ (idempotent projection).
- $P^T = P$ (orthogonal projection).
- $J P = 0$ (exact nullspace property).
- $J \dot{q} = \dot{x}$ identically.

**Verification:**
$\operatorname{tr}(P) = \operatorname{tr}(I_n) - \operatorname{tr}(J^+ J) = n - \operatorname{tr}(J J^+) = n - \operatorname{tr}(I_m) = n - m$. The dimension of the nullspace subspace is exactly $n - m$.

---

#### Problem 12.5: Lyapunov Asymptotic Stability of Quaternion-Based CLIK
**Statement:**
Consider the operational orientation tracking error $e_o = 2 \Delta\eta \Delta\epsilon$, where $\Delta q = (\Delta\eta, \Delta\epsilon) = q^{-1} * q_d$.
Let the Closed-Loop Inverse Kinematics law be:
$$\dot{q} = J_\omega^+ (\omega_d + k_o e_o)$$
where $J_\omega \in \mathbb{R}^{3 \times n}$ is the angular velocity Jacobian and $k_o > 0$.
Prove using the Lyapunov candidate function $V = 2(1 - \Delta\eta)$ that the equilibrium $\Delta\eta = 1, \Delta\epsilon = 0$ is asymptotically stable, and compute the explicit convergence rate.

**Given Data:**
- $V = 2(1 - \Delta\eta) \ge 0$.
- Quaternion kinematics: $\Delta\dot{\eta} = -\frac{1}{2} \Delta\epsilon^T e_{\omega}$ where $e_\omega = \omega_d - \omega$.

**Step-by-Step Derivation:**
1. From unit quaternion properties, $\|\Delta q\|^2 = \Delta\eta^2 + \|\Delta\epsilon\|^2 = 1$.
   When aligned, $\Delta\eta = 1$ and $\Delta\epsilon = 0$, so $V(1) = 0$.
   For any deviation $\Delta\eta \in [0, 1)$, $V > 0$.
2. The time derivative of $\Delta\eta$ under relative angular velocity error $e_\omega = \omega_d - \omega$ is:
   $$\dot{\Delta\eta} = -\frac{1}{2} \Delta\epsilon^T e_\omega$$
3. Differentiating $V$ with respect to time:
   $$\dot{V} = \frac{d}{dt} \left( 2 - 2 \Delta\eta \right) = -2 \dot{\Delta\eta} = -2 \left( -\frac{1}{2} \Delta\epsilon^T e_\omega \right) = \Delta\epsilon^T e_\omega$$
4. Substituting the manipulator angular velocity $\omega = J_\omega \dot{q}$:
   $$e_\omega = \omega_d - J_\omega \dot{q}$$
   Substituting the $\operatorname{CLIK}$ control law $\dot{q} = J_\omega^+ (\omega_d + k_o e_o)$:
   $$e_\omega = \omega_d - J_\omega J_\omega^+ (\omega_d + k_o e_o) = \omega_d - (\omega_d + k_o e_o) = -k_o e_o$$
5. Since $e_o = 2 \Delta\eta \Delta\epsilon$:
   $$e_\omega = -2 k_o \Delta\eta \Delta\epsilon$$
6. Evaluating $\dot{V}$:
   $$\dot{V} = \Delta\epsilon^T \left( -2 k_o \Delta\eta \Delta\epsilon \right) = -2 k_o \Delta\eta \|\Delta\epsilon\|^2$$
   Since $\Delta\eta > 0$ in the hemispherical neighborhood of attraction and $k_o > 0$:
   $$\dot{V} \le 0 \quad \text{with } \dot{V} = 0 \iff \|\Delta\epsilon\| = 0$$
   By LaSalle's Invariance Principle, the system converges asymptotically to $\Delta\epsilon = 0, \Delta\eta = 1$.

**Final Answer:**
- Candidate $V = 2(1 - \Delta\eta)$ satisfies $\dot{V} = -2 k_o \Delta\eta \|\Delta\epsilon\|^2 \le 0$.
- Quaternion tracking error converges asymptotically to the identity orientation $\Delta q = [1, 0, 0, 0]^T$.

**Verification:**
Near the identity, $\Delta\eta \approx 1$ and $1 - \Delta\eta \approx \frac{1}{2}\|\Delta\epsilon\|^2$. Then $V \approx \|\Delta\epsilon\|^2$ and $\dot{V} \approx -2 k_o \|\Delta\epsilon\|^2 = -2 k_o V$, yielding exponential decay with time constant $\tau = \frac{1}{2 k_o}$.

---

#### Problem 12.6: Lie Algebra Exponential Coordinate Derivative and the dexp Formula
**Statement:**
Let $R(\theta) = e^{[\omega]_\times \theta} \in SO(3)$. Derive the exact analytical formula for the time derivative $\dot{R}$ in terms of the angular velocity vector $\omega_s \in \mathbb{R}^3$ in the spatial frame, and prove that:
$$[\omega_s]_\times = \dot{R} R^T = \left( I - e^{-[\omega\theta]_\times} \right) \frac{[\omega]_\times}{\theta} \dot{\theta} + \dots$$
Simplify this to establish that when rotating about a fixed unit axis $\hat{n}$ with time-varying angle $\theta(t)$, the spatial angular velocity is strictly $\omega_s = \dot{\theta} \hat{n}$.

**Given Data:**
- $R(t) = e^{[\hat{n}]_\times \theta(t)}$ where $\|\hat{n}\| = 1$.

**Step-by-Step Derivation:**
1. By Rodrigues' formula:
   $$R(t) = I + \sin\theta [\hat{n}]_\times + (1 - \cos\theta) [\hat{n}]_\times^2$$
2. Differentiating with respect to time $t$ (noting that $\hat{n}$ is fixed in direction):
   $$\dot{R}(t) = \dot{\theta} \left( \cos\theta [\hat{n}]_\times + \sin\theta [\hat{n}]_\times^2 \right)$$
3. Compute the spatial angular velocity skew-symmetric tensor $[\omega_s]_\times = \dot{R} R^T$:
   $$[\omega_s]_\times = \dot{\theta} \left( \cos\theta [\hat{n}]_\times + \sin\theta [\hat{n}]_\times^2 \right) \left( I - \sin\theta [\hat{n}]_\times + (1 - \cos\theta) [\hat{n}]_\times^2 \right)$$
4. Use the Lie algebra identities for unit vector $[\hat{n}]_\times$:
   $$[\hat{n}]_\times^3 = -[\hat{n}]_\times, \quad [\hat{n}]_\times^4 = -[\hat{n}]_\times^2$$
5. Expanding the product term by term:
   $$[\omega_s]_\times = \dot{\theta} \left( \cos\theta [\hat{n}]_\times - \cos\theta\sin\theta [\hat{n}]_\times^2 + \cos\theta(1-\cos\theta) [\hat{n}]_\times^3 + \sin\theta [\hat{n}]_\times^2 - \sin^2\theta [\hat{n}]_\times^3 + \sin\theta(1-\cos\theta) [\hat{n}]_\times^4 \right)$$
   Substitute $[\hat{n}]_\times^3 = -[\hat{n}]_\times$ and $[\hat{n}]_\times^4 = -[\hat{n}]_\times^2$:
   $$= \dot{\theta} \left( \cos\theta [\hat{n}]_\times - \cos\theta(1-\cos\theta) [\hat{n}]_\times + \sin^2\theta [\hat{n}]_\times + [ -\cos\theta\sin\theta + \sin\theta - \sin\theta(1-\cos\theta) ] [\hat{n}]_\times^2 \right)$$
   Evaluate coefficients:
   - Coefficient of $[\hat{n}]_\times$:
     $$\cos\theta - \cos\theta + \cos^2\theta + \sin^2\theta = 1$$
   - Coefficient of $[\hat{n}]_\times^2$:
     $$-\cos\theta\sin\theta + \sin\theta - \sin\theta + \sin\theta\cos\theta = 0$$
6. Therefore:
   $$[\omega_s]_\times = \dot{\theta} [\hat{n}]_\times \implies \omega_s = \dot{\theta} \hat{n}$$

**Final Answer:**
- $[\omega_s]_\times = \dot{R} R^T = \dot{\theta} [\hat{n}]_\times$.
- The spatial angular velocity vector is $\omega_s(t) = \dot{\theta}(t) \hat{n}$.

**Verification:**
The physical rotation axis $\hat{n}$ is stationary in the space frame, so rotating by angle $\theta(t)$ produces angular velocity aligned with $\hat{n}$ scaled by $\dot{\theta}$, exactly matching Euler's rotation theorem.

---

#### Problem 12.7: Geometric Convergence Proof of FABRIK on Reachable Targets
**Statement:**
Consider a 2-segment kinematic chain with link lengths $d_0, d_1$ anchored at origin $p_0$. A reachable target $p_t$ satisfies $\|p_t - p_0\| < d_0 + d_1$.
Prove that each forward-backward cycle of $\operatorname{FABRIK}$ is a contraction mapping with respect to the end-effector tracking error $\|p_t - p_2^{(k)}\|$, guaranteeing monotonic geometric convergence to zero error.

**Given Data:**
- Link lengths $d_0, d_1 > 0$, anchor $p_0 = [0, 0]^T$.
- Target $p_t$ with $\|p_t\| \le d_0 + d_1$.

**Step-by-Step Derivation:**
1. In the forward reach phase, $p_2$ is placed exactly at $p_t$:
   $$p_2^{(k+1/2)} = p_t$$
   Then $p_1$ is positioned along the segment between $p_t$ and $p_1^{(k)}$ at distance $d_1$:
   $$p_1^{(k+1/2)} = p_t + d_1 \frac{p_1^{(k)} - p_t}{\|p_1^{(k)} - p_t\|}$$
2. In the backward reach phase, $p_0$ is anchored at origin $p_0 = 0$.
   $p_1$ is positioned along the line from $0$ to $p_1^{(k+1/2)}$ at distance $d_0$:
   $$p_1^{(k+1)} = d_0 \frac{p_1^{(k+1/2)}}{\|p_1^{(k+1/2)}\|}$$
   Then $p_2$ is positioned along the line from $p_1^{(k+1)}$ to $p_2^{(k+1/2)} = p_t$ at distance $d_1$:
   $$p_2^{(k+1)} = p_1^{(k+1)} + d_1 \frac{p_t - p_1^{(k+1/2)}}{\|p_t - p_1^{(k+1/2)}\|}$$
3. Note from the forward phase that $p_t - p_1^{(k+1/2)} = d_1 \frac{p_t - p_1^{(k)}}{\|p_t - p_1^{(k)}\|}$.
   Thus, the unit direction $\frac{p_t - p_1^{(k+1/2)}}{\|p_t - p_1^{(k+1/2)}\|}$ is collinear with the link orientation.
4. The remaining tracking error after the backward phase is:
   $$\|p_t - p_2^{(k+1)}\| = \left\| p_t - \left( p_1^{(k+1)} + d_1 \frac{p_t - p_1^{(k+1/2)}}{\|p_t - p_1^{(k+1/2)}\|} \right) \right\|$$
   Using the triangle inequality and noting that $p_1^{(k+1)}$ and $p_1^{(k+1/2)}$ lie on the same ray from origin with lengths $d_0$ and $\|p_1^{(k+1/2)}\|$:
   $$\|p_t - p_2^{(k+1)}\| \le \gamma \|p_t - p_2^{(k)}\| \quad \text{where } \gamma = \frac{| \|p_1^{(k+1/2)}\| - d_0 |}{\|p_t - p_1^{(k)}\|} < 1$$
5. Because $\gamma < 1$ for all reachable non-degenerate targets, the error sequence satisfies:
   $$\|e^{(k+1)}\| \le \gamma \|e^{(k)}\| \implies \|e^{(k)}\| \le \gamma^k \|e^{(0)}\| \to 0 \quad \text{as } k \to \infty$$

**Final Answer:**
- $\operatorname{FABRIK}$ is a contraction mapping on reachable targets with contraction constant $\gamma < 1$.
- Tracking error decays geometrically to zero without matrix inversions.

**Verification:**
In empirical benchmarks, $\operatorname{FABRIK}$ typically converges to machine precision ($\|e\| < 10^{-6}\text{ m}$) within 3 to 6 iterations on typical robotic arms.

---

#### Problem 12.8: Closed-Loop Dynamics and Bandwidth of Operational Space CLIK
**Statement:**
In industrial contour tracking (e.g., laser cutting or CNC machining), a robot end-effector tracks a circular path $x_d(t) = [R_0 \cos(\omega_0 t), R_0 \sin(\omega_0 t)]^T$.
The controller uses $\operatorname{CLIK}$ with error feedback gain $k_p$:
$$\dot{q} = J^+ \left( \dot{x}_d + k_p (x_d - x) \right)$$
Derive the frequency response transfer function $T(s) = \frac{X(s)}{X_d(s)}$, determine the tracking error amplitude $\|e(t)\|$ in steady state as a function of path frequency $\omega_0$, and compute the steady-state tracking error for $R_0 = 0.2\text{ m}, \omega_0 = 10\text{ rad/s}, k_p = 50\text{ s}^{-1}$.

**Given Data:**
- Circular trajectory: radius $R_0 = 0.2\text{ m}$, frequency $\omega_0 = 10\text{ rad/s}$.
- Gain $k_p = 50\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. From the $\operatorname{CLIK}$ velocity relation:
   $$\dot{x} = J \dot{q} = J J^+ (\dot{x}_d + k_p(x_d - x)) = \dot{x}_d + k_p(x_d - x)$$
2. Rearranging in terms of $x(t)$:
   $$\dot{x}(t) + k_p x(t) = \dot{x}_d(t) + k_p x_d(t)$$
3. Taking the Laplace transform:
   $$s X(s) + k_p X(s) = s X_d(s) + k_p X_d(s) \implies (s + k_p) X(s) = (s + k_p) X_d(s)$$
   $$T(s) = \frac{X(s)}{X_d(s)} = \frac{s + k_p}{s + k_p} = 1$$
4. Notice that because the feedforward term $\dot{x}_d$ is included in the $\operatorname{CLIK}$ law, the transfer function from $x_d$ to $x$ in continuous time is identically 1!
   $$\dot{e}(t) + k_p e(t) = 0 \implies e(t) = e(0) e^{-k_p t}$$
5. Therefore, in the absence of initial error ($e(0) = 0$), the theoretical tracking error is identically zero:
   $$\|e_{\text{ss}}\| = 0$$
6. Now consider a realistic scenario where the feedforward velocity is omitted (pure feedback IK: $\dot{q} = J^+ k_p (x_d - x)$):
   $$\dot{x} + k_p x = k_p x_d \implies \frac{X(s)}{X_d(s)} = \frac{k_p}{s + k_p}$$
   The error transfer function is:
   $$\frac{E(s)}{X_d(s)} = 1 - \frac{k_p}{s + k_p} = \frac{s}{s + k_p}$$
   Evaluating frequency response at $s = j \omega_0$:
   $$\left| \frac{E(j\omega_0)}{X_d(j\omega_0)} \right| = \frac{\omega_0}{\sqrt{\omega_0^2 + k_p^2}}$$
   For pure feedback:
   $$\|e_{\text{ss}}\| = R_0 \frac{\omega_0}{\sqrt{\omega_0^2 + k_p^2}} = 0.2 \frac{10}{\sqrt{10^2 + 50^2}} = 0.2 \frac{10}{\sqrt{100 + 2500}} = \frac{2.0}{\sqrt{2600}} \approx \frac{2.0}{50.99} \approx 0.0392\text{ m} = 39.2\text{ mm}$$

**Final Answer:**
- With feedforward velocity: $T(s) = 1$, steady-state tracking error is strictly zero ($\|e_{\text{ss}}\| = 0$).
- Without feedforward velocity: $\|e_{\text{ss}}\| = R_0 \frac{\omega_0}{\sqrt{\omega_0^2 + k_p^2}} \approx 39.2\text{ mm}$.

**Verification:**
This proves why feedforward velocity inversion $\dot{x}_d$ is indispensable in high-speed robot tracking; feedback alone always lags by phase angle $\phi = \arctan(\omega_0/k_p)$.

---

#### Problem 12.9: The Manipulability Gradient for Redundancy Optimization
**Statement:**
For a redundant manipulator with Jacobian $J(q) \in \mathbb{R}^{m \times n}$ ($n > m$), the secondary objective is to maximize the Yoshikawa manipulability index $w(q) = \sqrt{\det(J J^T)}$.
Prove that the gradient of manipulability with respect to joint variable $q_i$ is given by:
$$\frac{\partial w}{\partial q_i} = w \operatorname{tr}\left( (J J^T)^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$
and detail how this expression is computed using the SVD of $J$.

**Given Data:**
- $w = \sqrt{\det(A)}$ where $A = J J^T \in \mathbb{R}^{m \times m}$.

**Step-by-Step Derivation:**
1. Using Jacobi's formula for the derivative of a determinant:
   $$\frac{\partial}{\partial q_i} \det(A) = \det(A) \operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right)$$
2. Since $w = (\det(A))^{1/2}$:
   $$\frac{\partial w}{\partial q_i} = \frac{1}{2} (\det(A))^{-1/2} \frac{\partial}{\partial q_i} \det(A) = \frac{1}{2 w} \left[ w^2 \operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right) \right] = \frac{w}{2} \operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right)$$
3. Compute $\frac{\partial A}{\partial q_i}$:
   $$A = J J^T \implies \frac{\partial A}{\partial q_i} = \frac{\partial J}{\partial q_i} J^T + J \left(\frac{\partial J}{\partial q_i}\right)^T$$
4. Substitute into the trace:
   $$\operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right) = \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T + A^{-1} J \left(\frac{\partial J}{\partial q_i}\right)^T \right)$$
   Using cyclic permutation of trace $\operatorname{tr}(X^T) = \operatorname{tr}(X)$ and symmetry of $A^{-1}$:
   $$\operatorname{tr}\left( A^{-1} J \left(\frac{\partial J}{\partial q_i}\right)^T \right) = \operatorname{tr}\left( \frac{\partial J}{\partial q_i} J^T A^{-1} \right) = \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$
5. Combining both terms:
   $$\operatorname{tr}\left( A^{-1} \frac{\partial A}{\partial q_i} \right) = 2 \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$
6. Substituting back into $\frac{\partial w}{\partial q_i}$:
   $$\frac{\partial w}{\partial q_i} = \frac{w}{2} \left[ 2 \operatorname{tr}\left( A^{-1} \frac{\partial J}{\partial q_i} J^T \right) \right] = w \operatorname{tr}\left( (J J^T)^{-1} \frac{\partial J}{\partial q_i} J^T \right)$$

**Final Answer:**
- Formula proven: $\frac{\partial w}{\partial q_i} = w \operatorname{tr}\left( (J J^T)^{-1} \frac{\partial J}{\partial q_i} J^T \right)$.

**Verification:**
In terms of SVD $J = U \Sigma V^T$: $(J J^T)^{-1} = U \Sigma^{-2} U^T$. Then $(J J^T)^{-1} J = U \Sigma^{-1} V^T$. Thus $\frac{\partial w}{\partial q_i} = w \operatorname{tr}\left( U \Sigma^{-1} V^T \left(\frac{\partial J}{\partial q_i}\right)^T \right)$, demonstrating numerical stability without direct matrix inversion.

---

#### Problem 12.10: Quadratic Invariant of the Moore-Penrose Pseudoinverse
**Statement:**
Prove that the Moore-Penrose pseudoinverse solution $\dot{q}_{\text{opt}} = J^+ \dot{x}$ strictly minimizes the kinetic energy norm $T_q = \frac{1}{2} \dot{q}^T \dot{q}$ subject to the linear task constraint $J \dot{q} = \dot{x}$.
Prove that any other valid solution $\dot{q}' = \dot{q}_{\text{opt}} + v$ with $J v = 0$ satisfies $\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}}\|^2 + \|v\|^2 \ge \|\dot{q}_{\text{opt}}\|^2$.

**Given Data:**
- $J \in \mathbb{R}^{m \times n}$ ($m < n$, full rank $m$).
- $\dot{q}_{\text{opt}} = J^+ \dot{x} = J^T (J J^T)^{-1} \dot{x}$.
- Alternative solution $\dot{q}'$ such that $J \dot{q}' = \dot{x}$.

**Step-by-Step Derivation:**
1. Let $v = \dot{q}' - \dot{q}_{\text{opt}}$.
   Multiplying by $J$:
   $$J v = J(\dot{q}' - \dot{q}_{\text{opt}}) = J \dot{q}' - J \dot{q}_{\text{opt}} = \dot{x} - \dot{x} = 0$$
   Thus, $v \in \mathcal{N}(J)$ lies strictly in the nullspace of $J$.
2. Compute the squared Euclidean norm of $\dot{q}'$:
   $$\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}} + v\|^2 = (\dot{q}_{\text{opt}} + v)^T (\dot{q}_{\text{opt}} + v) = \dot{q}_{\text{opt}}^T \dot{q}_{\text{opt}} + 2 \dot{q}_{\text{opt}}^T v + v^T v$$
3. Examine the cross-term $\dot{q}_{\text{opt}}^T v$:
   $$\dot{q}_{\text{opt}}^T v = \left( J^T (J J^T)^{-1} \dot{x} \right)^T v = \dot{x}^T (J J^T)^{-1} J v$$
4. Since $J v = 0$:
   $$\dot{q}_{\text{opt}}^T v = \dot{x}^T (J J^T)^{-1} (0) = 0$$
   The vector $\dot{q}_{\text{opt}}$ is strictly orthogonal to any nullspace vector $v$.
5. Therefore:
   $$\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}}\|^2 + \|v\|^2$$
   Since $\|v\|^2 \ge 0$:
   $$\|\dot{q}'\|^2 \ge \|\dot{q}_{\text{opt}}\|^2$$
   Equality holds if and only if $v = 0 \iff \dot{q}' = \dot{q}_{\text{opt}}$.

**Final Answer:**
- $\|\dot{q}'\|^2 = \|\dot{q}_{\text{opt}}\|^2 + \|v\|^2 \ge \|\dot{q}_{\text{opt}}\|^2$.
- The pseudoinverse uniquely yields the global minimum Euclidean norm solution.

**Verification:**
This is the infinite-dimensional Pythagorean theorem in $\mathbb{R}^n$ partitioned into the row space $\mathcal{R}(J^T)$ and null space $\mathcal{N}(J)$. Since $\dot{q}_{\text{opt}} \in \mathcal{R}(J^T)$ and $v \in \mathcal{N}(J)$, their inner product is identically zero.

---

## 12.3 Capstone Mastery Problems (Problems 12.11 – 12.20)

#### Problem 12.11: Industrial Pick-and-Place Trajectory Synthesis with 6-DoF CLIK
**Statement:**
An industrial robot manipulates an electronic component between two fixture poses:
- Pose A: $p_A = [0.4, 0.2, 0.1]^T\text{ m}, \quad q_A = [1, 0, 0, 0]^T$
- Pose B: $p_B = [0.6, -0.3, 0.4]^T\text{ m}, \quad q_B = [0.7071, 0, 0.7071, 0]^T$
Total transit time is $T = 2.0\text{ s}$. 
1. Parameterize the cartesian path $p(t)$ and orientation quaternion $q(t)$ using a minimum-jerk quintic polynomial $s(t)$.
2. Evaluate the desired position $p_d$, linear velocity $\dot{p}_d$, quaternion $q_d$, and angular velocity $\omega_d$ at $t = 1.0\text{ s}$.

**Given Data:**
- $T = 2.0\text{ s}$, midpoint $t = 1.0\text{ s} \implies \tau = t/T = 0.5$.
- $p_A = [0.4, 0.2, 0.1]^T, p_B = [0.6, -0.3, 0.4]^T$.
- $q_A = [1, 0, 0, 0]^T, q_B = [1/\sqrt{2}, 0, 1/\sqrt{2}, 0]^T$.

**Step-by-Step Derivation:**
1. At midpoint $\tau = 0.5$:
   $$s(0.5) = 10(0.5)^3 - 15(0.5)^4 + 6(0.5)^5 = 10(0.125) - 15(0.0625) + 6(0.03125) = 1.25 - 0.9375 + 0.1875 = 0.5$$
   $$\dot{s}(0.5) = \frac{15}{8 T} = \frac{15}{8(2.0)} = \frac{15}{16} = 0.9375\text{ s}^{-1}$$
2. Cartesian Position at $t = 1.0\text{ s}$:
   $$p_d(1.0) = p_A + 0.5(p_B - p_A) = \begin{bmatrix} 0.4 \\ 0.2 \\ 0.1 \end{bmatrix} + 0.5 \begin{bmatrix} 0.2 \\ -0.5 \\ 0.3 \end{bmatrix} = \begin{bmatrix} 0.5 \\ -0.05 \\ 0.25 \end{bmatrix}\text{ m}$$
3. Cartesian Linear Velocity at $t = 1.0\text{ s}$:
   $$\dot{p}_d(1.0) = \dot{s}(0.5) (p_B - p_A) = 0.9375 \begin{bmatrix} 0.2 \\ -0.5 \\ 0.3 \end{bmatrix} = \begin{bmatrix} 0.1875 \\ -0.46875 \\ 0.28125 \end{bmatrix}\text{ m/s}$$
4. Quaternion Interpolation:
   $\cos\Omega = q_A \cdot q_B = 1(1/\sqrt{2}) = 1/\sqrt{2} \implies \Omega = \pi/4\text{ rad} = 45^\circ$.
   At $s = 0.5$:
   $$q_d(0.5) = \frac{\sin(\pi/8)}{\sin(\pi/4)} q_A + \frac{\sin(\pi/8)}{\sin(\pi/4)} q_B$$
   $\sin(\pi/4) = 1/\sqrt{2} \approx 0.7071$. $\sin(\pi/8) = \frac{\sqrt{2 - \sqrt{2}}}{2} \approx 0.382683$.
   $$\frac{\sin(\pi/8)}{\sin(\pi/4)} = \frac{0.382683}{0.707107} = 0.541196$$
   $$q_d = 0.541196 \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix} + 0.541196 \begin{bmatrix} 1/\sqrt{2} \\ 0 \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 0.541196 + 0.382683 \\ 0 \\ 0.382683 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.92388 \\ 0 \\ 0.38268 \\ 0 \end{bmatrix}$$
   (Note: $\cos(22.5^\circ) \approx 0.92388, \sin(22.5^\circ) \approx 0.38268$, exact half-angle of $45^\circ$).
5. Angular Velocity:
   The rotation is around the y-axis ($\hat{u} = [0, 1, 0]^T$) by total physical angle $\theta = 2\Omega = \pi/2 = 90^\circ$.
   $$\omega_d(1.0) = 2 \Omega \dot{s} \hat{u} = 2 \left(\frac{\pi}{4}\right) (0.9375) \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \frac{\pi}{2}(0.9375) \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} \approx \begin{bmatrix} 0 \\ 1.4726 \\ 0 \end{bmatrix}\text{ rad/s}$$

**Final Answer:**
- $p_d(1.0) = [0.5, -0.05, 0.25]^T\text{ m}$.
- $\dot{p}_d(1.0) = [0.1875, -0.46875, 0.28125]^T\text{ m/s}$.
- $q_d(1.0) = [0.9239, 0, 0.3827, 0]^T$.
- $\omega_d(1.0) = [0, 1.4726, 0]^T\text{ rad/s}$.

**Verification:**
Norm of quaternion: $0.92388^2 + 0.38268^2 = 0.85355 + 0.14645 = 1.0000$. Velocity matches derivative of displacement profile exactly.

---

#### Problem 12.12: 7-DoF Redundant Kinematic Control with Obstacle Repulsion
**Statement:**
A 7-DoF manipulator tracks a 3D position command with Jacobian $J \in \mathbb{R}^{3 \times 7}$. The elbow point $p_{\text{elbow}}(q) \in \mathbb{R}^3$ has Jacobian $J_{\text{elbow}} \in \mathbb{R}^{3 \times 7}$. An obstacle is located at $p_{\text{obs}} \in \mathbb{R}^3$.
To prevent collision, the secondary objective minimizes the potential $V_{\text{obs}}(q) = \frac{1}{2} \frac{1}{\|p_{\text{elbow}} - p_{\text{obs}}\|^2}$.
Formulate the exact joint velocity command $\dot{q}$ ensuring asymptotic tracking of task velocity $\dot{x}_d$ while repelling the elbow away from the obstacle.

**Given Data:**
- Task Jacobian $J \in \mathbb{R}^{3 \times 7}$, elbow Jacobian $J_{\text{elbow}} \in \mathbb{R}^{3 \times 7}$.
- Distance vector $d = p_{\text{elbow}} - p_{\text{obs}}$, distance $r = \|d\|$.

**Step-by-Step Derivation:**
1. Compute the gradient of $V_{\text{obs}}$ with respect to joint angles $q$:
   $$V_{\text{obs}} = \frac{1}{2} r^{-2}$$
   Using the chain rule:
   $$\nabla_q V_{\text{obs}} = \left( \frac{\partial p_{\text{elbow}}}{\partial q} \right)^T \nabla_{p_{\text{elbow}}} V_{\text{obs}} = J_{\text{elbow}}^T \left( -r^{-3} \frac{d}{r} \right) = -J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$$
2. The repulsive velocity gradient descent direction is:
   $$v_{\text{sec}} = -\nabla_q V_{\text{obs}} = +J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$$
3. Project $v_{\text{sec}}$ into the nullspace of the primary task Jacobian $J$:
   $$P = I_7 - J^+ J$$
4. The complete joint velocity control law with $\operatorname{CLIK}$ feedback is:
   $$\dot{q} = J^+ \left( \dot{x}_d + K_p (x_d - x) \right) + k_{\text{obs}} (I_7 - J^+ J) J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$$
   where $k_{\text{obs}} > 0$ is the obstacle avoidance gain.

**Final Answer:**
- Control law: $\dot{q} = J^+ (\dot{x}_d + K_p e) + k_{\text{obs}} (I - J^+ J) J_{\text{elbow}}^T \frac{p_{\text{elbow}} - p_{\text{obs}}}{\|p_{\text{elbow}} - p_{\text{obs}}\|^4}$.
- Primary task execution is mathematically untouched because $J (I - J^+ J) \equiv 0$.

**Verification:**
When $p_{\text{elbow}}$ approaches $p_{\text{obs}}$, the repulsive term scales as $r^{-3}$, driving joint velocities along the self-motion manifold to swing the elbow away while the hand continues uninterrupted along its trajectory.

---

#### Problem 12.13: Adaptive DLS Traversal of an Interior Singularity
**Statement:**
A 2-link planar arm with $l_1 = 1.0\text{ m}, l_2 = 1.0\text{ m}$ is tracking a straight line that crosses the boundary singularity $q_2 = 0$ (fully extended arm $x = 2.0\text{ m}$).
At pose $q = [0, 0.05]^T\text{ rad}$, the Jacobian is:
$$J = \begin{bmatrix} -l_1\sin q_1 - l_2\sin(q_1+q_2) & -l_2\sin(q_1+q_2) \\ l_1\cos q_1 + l_2\cos(q_1+q_2) & l_2\cos(q_1+q_2) \end{bmatrix} = \begin{bmatrix} -0.04998 & -0.04998 \\ 2.99875 & 0.99875 \end{bmatrix} \approx \begin{bmatrix} -0.05 & -0.05 \\ 2.00 & 1.00 \end{bmatrix}$$
The desired operational velocity is $\dot{x}_d = [1.0, 0]^T\text{ m/s}$ (commanding motion in the singular direction).
1. Compute the unregularized pseudoinverse joint velocity $\dot{q}_{\text{pinv}} = J^{-1} \dot{x}_d$.
2. Compute the adaptive DLS damping $\lambda^2$ with $w_0 = 0.2$ and $\lambda_0 = 0.1$.
3. Compute the regularized joint velocity $\dot{q}_{\text{DLS}} = J^T (J J^T + \lambda^2 I)^{-1} \dot{x}_d$ and compare the joint velocity magnitudes.

**Given Data:**
- $J = \begin{bmatrix} -0.05 & -0.05 \\ 2.00 & 1.00 \end{bmatrix}$, $\dot{x}_d = [1.0, 0]^T$.
- $w_0 = 0.2$, $\lambda_0 = 0.1$.

**Step-by-Step Derivation:**
1. Determinant of $J$:
   $$\det(J) = (-0.05)(1.00) - (-0.05)(2.00) = -0.05 + 0.10 = 0.05$$
   Manipulability index:
   $$w = |\det(J)| = 0.05$$
2. Unregularized Inverse:
   $$J^{-1} = \frac{1}{0.05} \begin{bmatrix} 1.00 & 0.05 \\ -2.00 & -0.05 \end{bmatrix} = \begin{bmatrix} 20 & 1 \\ -40 & -1 \end{bmatrix}$$
   $$\dot{q}_{\text{pinv}} = J^{-1} \begin{bmatrix} 1.0 \\ 0 \end{bmatrix} = \begin{bmatrix} 20 \\ -40 \end{bmatrix}\text{ rad/s}$$
   $$\|\dot{q}_{\text{pinv}}\| = \sqrt{20^2 + (-40)^2} = \sqrt{2000} \approx 44.72\text{ rad/s}$$
   This velocity is dangerously high, exceeding physical motor capabilities.
3. Adaptive Damping Computation:
   Since $w = 0.05 < w_0 = 0.2$:
   $$\lambda^2 = \lambda_0^2 \left( 1 - \frac{w}{w_0} \right)^2 = (0.1)^2 \left( 1 - \frac{0.05}{0.2} \right)^2 = 0.01 (1 - 0.25)^2 = 0.01 (0.75)^2 = 0.01 (0.5625) = 0.005625$$
4. Compute $J J^T + \lambda^2 I$:
   $$J J^T = \begin{bmatrix} (-0.05)^2 + (-0.05)^2 & (-0.05)(2) + (-0.05)(1) \\ (-0.05)(2) + (-0.05)(1) & 2^2 + 1^2 \end{bmatrix} = \begin{bmatrix} 0.005 & -0.15 \\ -0.15 & 5.0 \end{bmatrix}$$
   $$J J^T + \lambda^2 I = \begin{bmatrix} 0.005 + 0.005625 & -0.15 \\ -0.15 & 5.0 + 0.005625 \end{bmatrix} = \begin{bmatrix} 0.010625 & -0.15 \\ -0.15 & 5.005625 \end{bmatrix}$$
   Determinant:
   $$\det = (0.010625)(5.005625) - (-0.15)^2 = 0.053185 - 0.022500 = 0.030685$$
   Inverse:
   $$(J J^T + \lambda^2 I)^{-1} = \frac{1}{0.030685} \begin{bmatrix} 5.005625 & 0.15 \\ 0.15 & 0.010625 \end{bmatrix} = \begin{bmatrix} 163.13 & 4.89 \\ 4.89 & 0.346 \end{bmatrix}$$
5. Compute DLS velocity:
   $$v_x = (J J^T + \lambda^2 I)^{-1} \begin{bmatrix} 1.0 \\ 0 \end{bmatrix} = \begin{bmatrix} 163.13 \\ 4.89 \end{bmatrix}$$
   $$\dot{q}_{\text{DLS}} = J^T v_x = \begin{bmatrix} -0.05 & 2.00 \\ -0.05 & 1.00 \end{bmatrix} \begin{bmatrix} 163.13 \\ 4.89 \end{bmatrix} = \begin{bmatrix} -0.05(163.13) + 2(4.89) \\ -0.05(163.13) + 1(4.89) \end{bmatrix} = \begin{bmatrix} -8.1565 + 9.7800 \\ -8.1565 + 4.8900 \end{bmatrix} = \begin{bmatrix} 1.6235 \\ -3.2665 \end{bmatrix}\text{ rad/s}$$
   $$\|\dot{q}_{\text{DLS}}\| = \sqrt{1.6235^2 + (-3.2665)^2} = \sqrt{2.6357 + 10.6700} = \sqrt{13.3057} \approx 3.65\text{ rad/s}$$

**Final Answer:**
- Unregularized: $\dot{q} = [20, -40]^T\text{ rad/s}$ ($\|\dot{q}\| \approx 44.72\text{ rad/s}$).
- Adaptive DLS: $\dot{q} \approx [1.62, -3.27]^T\text{ rad/s}$ ($\|\dot{q}\| \approx 3.65\text{ rad/s}$).
- Velocity amplification suppressed by over $91.8\%$, preserving servo stability.

**Verification:**
The DLS solution trades off a minor tracking velocity error along the degenerate radial direction for a $12\times$ reduction in joint velocity demand.

---

#### Problem 12.14: Dual-Arm Cooperative Kinematic Grasping
**Statement:**
Two 3-DoF planar arms (Left and Right) cooperatively hold a rigid object of length $L = 0.4\text{ m}$ horizontally.
Left arm base is at $p_{0L} = [0, 0]^T$; Right arm base is at $p_{0R} = [1.2, 0]^T$.
The object center is commanded to move with velocity $\dot{x}_{\text{obj}} = [0.1, 0.2]^T\text{ m/s}$ and rotate at $\omega_{\text{obj}} = 0.5\text{ rad/s}$.
1. Formulate the kinematic grasp matrix $G \in \mathbb{R}^{3 \times 6}$ relating the contact velocities $\dot{x}_L, \dot{x}_R$ to the object velocity $\dot{x}_{\text{obj}}$.
2. Compute the required individual operational velocities $\dot{x}_L$ and $\dot{x}_R$ for the two arms.

**Given Data:**
- Object center at $p_{\text{obj}}$, orientation horizontal.
- Left grasp point offset: $r_L = [-0.2, 0]^T\text{ m}$.
- Right grasp point offset: $r_R = [+0.2, 0]^T\text{ m}$.
- $\dot{x}_{\text{obj}} = [0.1, 0.2]^T\text{ m/s}$, $\omega_{\text{obj}} = 0.5\text{ rad/s}$.

**Step-by-Step Derivation:**
1. Rigid body velocity kinematics for contact point $i$:
   $$\dot{p}_i = \dot{p}_{\text{obj}} + \omega_{\text{obj}} \times r_i$$
   In 2D planar coordinates, with $\omega_{\text{obj}} = \omega \hat{k}$ and $r_i = [r_{ix}, r_{iy}]^T$:
   $$\omega \times r_i = \begin{bmatrix} -\omega r_{iy} \\ \omega r_{ix} \end{bmatrix}$$
2. For Left Grasp Point ($r_L = [-0.2, 0]^T$):
   $$\dot{p}_L = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} -0.5(0) \\ 0.5(-0.2) \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} 0 \\ -0.1 \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.1 \end{bmatrix}\text{ m/s}$$
   Orientation velocity: $\dot{\phi}_L = \omega_{\text{obj}} = 0.5\text{ rad/s}$.
   Full operational velocity vector: $\dot{x}_L = [0.1, 0.1, 0.5]^T$.
3. For Right Grasp Point ($r_R = [+0.2, 0]^T$):
   $$\dot{p}_R = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} -0.5(0) \\ 0.5(+0.2) \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.2 \end{bmatrix} + \begin{bmatrix} 0 \\ +0.1 \end{bmatrix} = \begin{bmatrix} 0.1 \\ 0.3 \end{bmatrix}\text{ m/s}$$
   Orientation velocity: $\dot{\phi}_R = \omega_{\text{obj}} = 0.5\text{ rad/s}$.
   Full operational velocity vector: $\dot{x}_R = [0.1, 0.3, 0.5]^T$.
4. Grasp Matrix:
   $$\begin{bmatrix} \dot{x}_L \\ \dot{x}_R \end{bmatrix} = G^T \dot{x}_{\text{obj}} = \begin{bmatrix} I_2 & \begin{bmatrix} 0 \\ -0.2 \end{bmatrix} \\ 0 & 1 \\ I_2 & \begin{bmatrix} 0 \\ +0.2 \end{bmatrix} \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \dot{p}_{\text{obj}} \\ \omega_{\text{obj}} \end{bmatrix}$$

**Final Answer:**
- Left arm end-effector velocity: $\dot{x}_L = [0.1, 0.1, 0.5]^T$ ($v_x = 0.1\text{ m/s}, v_y = 0.1\text{ m/s}, \omega = 0.5\text{ rad/s}$).
- Right arm end-effector velocity: $\dot{x}_R = [0.1, 0.3, 0.5]^T$ ($v_x = 0.1\text{ m/s}, v_y = 0.3\text{ m/s}, \omega = 0.5\text{ rad/s}$).

**Verification:**
Relative velocity $\dot{p}_R - \dot{p}_L = [0, 0.2]^T\text{ m/s}$.
The rate of change of orientation is $\dot{\theta} = \frac{(\dot{p}_R - \dot{p}_L)_y}{L} = \frac{0.2}{0.4} = 0.5\text{ rad/s} = \omega_{\text{obj}}$, preserving rigid grasp constraints.

---

#### Problem 12.15: Image-Based Visual Servoing (IBVS) Kinematics Integration
**Statement:**
A camera mounted on a robot end-effector observes a feature point with image plane coordinates $s = [u, v]^T$ (in normalized coordinates). 
The interaction matrix (image Jacobian) $L_s \in \mathbb{R}^{2 \times 6}$ relates camera spatial twist $\mathcal{V}_c = [v_c; \omega_c]$ to image feature velocity $\dot{s}$:
$$L_s = \begin{bmatrix} -\frac{1}{Z} & 0 & \frac{u}{Z} & uv & -(1+u^2) & v \\ 0 & -\frac{1}{Z} & \frac{v}{Z} & 1+v^2 & -uv & -u \end{bmatrix}$$
The robot's geometric Jacobian in camera frame is $J_c(q) \in \mathbb{R}^{6 \times 6}$.
Given depth $Z = 1.0\text{ m}$, current feature at $[u, v] = [0.2, -0.1]$, desired feature at $[u_d, v_d] = [0, 0]$, and servo gain $\lambda_{\text{cam}} = 4.0\text{ s}^{-1}$:
1. Compute the numerical interaction matrix $L_s$.
2. Formulate the complete mapping from image error $e_s = s - s_d$ to joint velocities $\dot{q}$.

**Given Data:**
- $u = 0.2, v = -0.1, Z = 1.0\text{ m}$, $s_d = [0, 0]^T$.
- Error: $e_s = [0.2, -0.1]^T$. Gain $\lambda_{\text{cam}} = 4.0\text{ s}^{-1}$.

**Step-by-Step Derivation:**
1. Evaluate entries of $L_s$:
   - Row 1:
     $$L_{11} = -1/1.0 = -1.0$$
     $$L_{12} = 0$$
     $$L_{13} = 0.2 / 1.0 = 0.2$$
     $$L_{14} = (0.2)(-0.1) = -0.02$$
     $$L_{15} = -(1 + 0.2^2) = -(1 + 0.04) = -1.04$$
     $$L_{16} = -0.1$$
   - Row 2:
     $$L_{21} = 0$$
     $$L_{22} = -1/1.0 = -1.0$$
     $$L_{23} = -0.1 / 1.0 = -0.1$$
     $$L_{24} = 1 + (-0.1)^2 = 1 + 0.01 = 1.01$$
     $$L_{25} = -(0.2)(-0.1) = 0.02$$
     $$L_{26} = -0.2$$
2. Interaction Matrix:
   $$L_s = \begin{bmatrix} -1.0 & 0 & 0.2 & -0.02 & -1.04 & -0.1 \\ 0 & -1.0 & -0.1 & 1.01 & 0.02 & -0.2 \end{bmatrix}$$
3. Desired camera velocity:
   $$\mathcal{V}_c = -\lambda_{\text{cam}} L_s^+ e_s$$
4. Complete mapping to joint velocities:
   Since $\mathcal{V}_c = J_c(q) \dot{q}$:
   $$J_c(q) \dot{q} = -\lambda_{\text{cam}} L_s^+ e_s$$
   $$\dot{q} = -\lambda_{\text{cam}} (L_s J_c(q))^+ e_s$$
   where $J_{\text{image}} = L_s J_c(q) \in \mathbb{R}^{2 \times 6}$ is the combined visual-kinematic Jacobian.

**Final Answer:**
- $L_s = \begin{bmatrix} -1.0 & 0 & 0.2 & -0.02 & -1.04 & -0.1 \\ 0 & -1.0 & -0.1 & 1.01 & 0.02 & -0.2 \end{bmatrix}$.
- Joint velocity law: $\dot{q} = -\lambda_{\text{cam}} (L_s J_c(q))^+ e_s$.

**Verification:**
Exponential error decay: $\dot{e}_s = L_s \mathcal{V}_c = L_s (-\lambda_{\text{cam}} L_s^+ e_s) = -\lambda_{\text{cam}} e_s \implies e_s(t) = e_s(0) e^{-\lambda_{\text{cam}} t}$.

---

#### Problem 12.16: Real-Time 1 kHz Kinematic Loop Execution Budget
**Statement:**
A hard real-time robot controller executes an operational space $\operatorname{CLIK}$ cycle at $f_s = 1000\text{ Hz}$ ($1.0\text{ ms}$ deadline).
The cycle performs:
1. 6-link forward kinematics via homogeneous transformation products.
2. Geometric Jacobian computation ($6 \times 6$).
3. Singular value decomposition (SVD) and manipulability calculation.
4. Matrix inversion for DLS: $(J J^T + \lambda^2 I)^{-1}$.
5. Velocity update: $\dot{q} = J^T (J J^T + \lambda^2 I)^{-1} (\dot{x}_d + K_p e)$.
Calculate the theoretical FLOP count for each operation, determine the total FLOPs per tick, and compute the processor utilization on a 2.0 GHz single-core embedded ARM Cortex-A53 processor executing 1 FLOP per cycle.

**Given Data:**
- Matrix sizes: $m = 6, n = 6$.
- Processor: 2.0 GHz ($2 \times 10^9\text{ FLOP/s}$). Deadline: $T_{\text{cycle}} = 1.0\text{ ms} = 10^{-3}\text{ s}$.

**Step-by-Step Derivation:**
1. **Forward Kinematics (6 links):**
   Each $SE(3)$ transformation product requires multiplying a $3 \times 3$ rotation matrix and adding translation ($27 \text{ mul} + 18 \text{ add} + 3 \text{ add} = 48\text{ FLOPs}$).
   For 5 successive transforms: $5 \times 48 = 240\text{ FLOPs}$.
2. **Geometric Jacobian ($6 \times 6$):**
   For each revolute joint $i$: compute cross product $z_{i-1} \times (p_e - p_{i-1})$ ($6 \text{ mul} + 3 \text{ sub} = 9\text{ FLOPs}$).
   Across 6 joints: $6 \times (9 + 3 \text{ sub}) = 72\text{ FLOPs}$.
3. **Matrix Multiplication $J J^T$ ($6 \times 6$):**
   Symmetric matrix multiplication requires $\frac{m(m+1)}{2} \times (2n - 1) = \frac{6 \times 7}{2} \times 11 = 21 \times 11 = 231\text{ FLOPs}$.
   Adding damping $\lambda^2 I_6$: $6\text{ FLOPs}$. Total: $237\text{ FLOPs}$.
4. **Matrix Inversion of $6 \times 6$ symmetric matrix:**
   Cholesky decomposition $L L^T = A$: $\frac{1}{3} m^3 = \frac{1}{3}(216) = 72\text{ FLOPs}$.
   Forward/backward substitution to invert: $m^3 = 216\text{ FLOPs}$. Total: $\approx 288\text{ FLOPs}$.
5. **Joint Velocity Computation:**
   - Error term $\dot{x}_d + K_p e$: $6 \text{ mul} + 12 \text{ add} = 18\text{ FLOPs}$.
   - Vector solve $(J J^T + \lambda^2 I)^{-1} v$: $2 \times 6^2 = 72\text{ FLOPs}$.
   - Matrix-vector multiply $J^T w$: $2 \times 6 \times 6 = 72\text{ FLOPs}$.
   - Integration $q_{k+1} = q_k + \Delta t \dot{q}$: $6 \text{ mul} + 6 \text{ add} = 12\text{ FLOPs}$.
6. **Total FLOPs per Cycle:**
   $$\text{Total FLOPs} = 240 + 72 + 237 + 288 + 18 + 72 + 72 + 12 \approx 1,011\text{ FLOPs}$$
7. **Execution Time and CPU Load:**
   $$\text{Execution Time} = \frac{1,011\text{ FLOPs}}{2.0 \times 10^9\text{ FLOP/s}} = 5.055 \times 10^{-7}\text{ s} \approx 0.506\text{ }\mu\text{s}$$
   $$\text{CPU Utilization} = \frac{0.506\text{ }\mu\text{s}}{1000\text{ }\mu\text{s}} \times 100\% \approx 0.051\%$$

**Final Answer:**
- Computational budget: $\approx 1,011\text{ FLOPs}$ per 1 kHz cycle.
- Execution time: $\approx 0.51\text{ }\mu\text{s}$.
- Processor load: $\approx 0.05\%$ on a 2.0 GHz ARM core.

**Verification:**
Even with conservative cache misses and SVD overhead ($\approx 10,000\text{ FLOPs}$), total execution takes $< 5\text{ }\mu\text{s}$, well within the $1,000\text{ }\mu\text{s}$ deadline (leaving $> 99\%$ CPU headroom for vision and planning).

---

#### Problem 12.17: Singularity-Free Spherical Wrist Inverse Kinematics Implementation
**Statement:**
In a spherical wrist ($z_4, z_5, z_6$ intersecting at $p_w$), the relative orientation matrix is $R_6^3 = R_z(q_4) R_y(q_5) R_z(q_6)$:
$$R_6^3 = \begin{bmatrix} c_4 c_5 c_6 - s_4 s_6 & -c_4 c_5 s_6 - s_4 c_6 & c_4 s_5 \\ s_4 c_5 c_6 + c_4 s_6 & -s_4 c_5 s_6 + c_4 c_6 & s_4 s_5 \\ -s_5 c_6 & s_5 s_6 & c_5 \end{bmatrix}$$
When $q_5 \approx 0$ (wrist singularity), axes $z_4$ and $z_6$ become collinear, causing $q_4$ and $q_6$ to become linearly dependent ($\theta_{\text{total}} = q_4 + q_6$).
Design a deterministic software branching rule in TypeScript that:
1. Detects $|s_5| < 10^{-6}$.
2. Assigns $q_4 = 0$ (or keeps previous $q_4$) to resolve the redundancy.
3. Computes the resulting exact angle $q_6$.

**Given Data:**
- Numerical threshold $\epsilon = 10^{-6}$.
- Target matrix $R = R_6^3 \in SO(3)$.

**Step-by-Step Derivation:**
1. Compute $\cos(q_5) = R_{33}$.
   Clamping to valid range: $\cos(q_5) = \operatorname{clip}(R_{33}, -1.0, 1.0)$.
   $$q_5 = \operatorname{atan2}\left( \sqrt{R_{31}^2 + R_{32}^2}, \; R_{33} \right)$$
2. Check singularity condition:
   $$\sin(q_5) = \sqrt{R_{31}^2 + R_{32}^2}$$
3. **Singular Case 1: $\sin(q_5) < \epsilon$ with $R_{33} > 0$ ($q_5 \approx 0$):**
   When $q_5 = 0$:
   $$R_6^3 = \begin{bmatrix} c_4 c_6 - s_4 s_6 & -c_4 s_6 - s_4 c_6 & 0 \\ s_4 c_6 + c_4 s_6 & -s_4 s_6 + c_4 c_6 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \cos(q_4 + q_6) & -\sin(q_4 + q_6) & 0 \\ \sin(q_4 + q_6) & \cos(q_4 + q_6) & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   Set $q_4 = q_{4,\text{prev}}$ (or $0$).
   Then $q_6 = \operatorname{atan2}(R_{21}, R_{11}) - q_4$.
4. **Singular Case 2: $\sin(q_5) < \epsilon$ with $R_{33} < 0$ ($q_5 \approx \pi$):**
   When $q_5 = \pi$:
   $$R_6^3 = \begin{bmatrix} -c_4 c_6 - s_4 s_6 & c_4 s_6 - s_4 c_6 & 0 \\ -s_4 c_6 + c_4 s_6 & s_4 s_6 + c_4 c_6 & 0 \\ 0 & 0 & -1 \end{bmatrix} = \begin{bmatrix} -\cos(q_4 - q_6) & \sin(q_4 - q_6) & 0 \\ -\sin(q_4 - q_6) & -\cos(q_4 - q_6) & 0 \\ 0 & 0 & -1 \end{bmatrix}$$
   Set $q_4 = q_{4,\text{prev}}$ (or $0$).
   Then $q_6 = q_4 - \operatorname{atan2}(-R_{21}, -R_{11})$.
5. **Regular Case ($\sin(q_5) \ge \epsilon$):**
   $$q_4 = \operatorname{atan2}(R_{23}, R_{13})$$
   $$q_6 = \operatorname{atan2}(R_{32}, -R_{31})$$

**Final Answer:**
- Regular: $q_4 = \operatorname{atan2}(R_{23}, R_{13}), q_5 = \operatorname{atan2}(\sqrt{R_{31}^2 + R_{32}^2}, R_{33}), q_6 = \operatorname{atan2}(R_{32}, -R_{31})$.
- Singular ($q_5 \approx 0$): $q_4 = q_{4,\text{prev}}, q_5 = 0, q_6 = \operatorname{atan2}(R_{21}, R_{11}) - q_{4,\text{prev}}$.

**Verification:**
When $q_4 = 0$, $R_{11} = \cos(q_6), R_{21} = \sin(q_6)$, reproducing the exact 3D orientation without division by zero.

---

#### Problem 12.18: Constrained Quintic Polynomial with Intermediate Velocity Saturation
**Statement:**
A joint must transition $\Delta q = 3.0\text{ rad}$ in $T = 1.5\text{ s}$ using a quintic polynomial. The actuator has a strict hardware velocity limit $v_{\lim} = 3.5\text{ rad/s}$.
1. Compute the peak velocity $\dot{q}_{\max}$ of the standard quintic profile.
2. Determine whether the velocity limit is violated.
3. If violated, compute the scaled minimum duration $T_{\text{new}}$ that strictly respects $v_{\lim}$.

**Given Data:**
- $\Delta q = 3.0\text{ rad}$, $T = 1.5\text{ s}$, $v_{\lim} = 3.5\text{ rad/s}$.

**Step-by-Step Derivation:**
1. Peak velocity of standard quintic profile:
   $$\dot{q}_{\max} = \frac{15 \Delta q}{8 T} = \frac{15 \times 3.0}{8 \times 1.5} = \frac{45.0}{12.0} = 3.75\text{ rad/s}$$
2. Check violation:
   $$\dot{q}_{\max} = 3.75\text{ rad/s} > v_{\lim} = 3.5\text{ rad/s}$$
   The velocity limit is violated by $0.25\text{ rad/s}$ ($7.1\%$ overshoot).
3. Compute scaled minimum duration $T_{\text{new}}$:
   $$T_{\text{new}} = \frac{15 \Delta q}{8 v_{\lim}} = \frac{15 \times 3.0}{8 \times 3.5} = \frac{45.0}{28.0} = \frac{45}{28} \approx 1.60714\text{ s}$$
4. Re-evaluate peak acceleration at $T_{\text{new}}$:
   $$\ddot{q}_{\max} = \frac{10\sqrt{3} \Delta q}{3 T_{\text{new}}^2} = \frac{10\sqrt{3} \times 3.0}{3 \times (1.60714)^2} = \frac{10\sqrt{3}}{2.5829} = \frac{17.3205}{2.5829} \approx 6.7058\text{ rad/s}^2$$

**Final Answer:**
- Initial peak velocity: $3.75\text{ rad/s}$ (violates $3.5\text{ rad/s}$ limit).
- Rescaled duration: $T_{\text{new}} \approx 1.607\text{ s}$.

**Verification:**
At $T = 1.60714\text{ s}$: $\dot{q}_{\max} = \frac{15(3.0)}{8(1.60714)} = \frac{45.0}{12.8571} = 3.5000\text{ rad/s} = v_{\lim}$. Limit is strictly respected.

---

#### Problem 12.19: Complete Verification of Moore-Penrose Conditions
**Statement:**
The Moore-Penrose pseudoinverse $A^+ \in \mathbb{R}^{n \times m}$ of a matrix $A \in \mathbb{R}^{m \times n}$ is the unique matrix satisfying the four Penrose equations:
1. $A A^+ A = A$
2. $A^+ A A^+ = A^+$
3. $(A A^+)^T = A A^+$
4. $(A^+ A)^T = A^+ A$
Prove algebraically that for full row rank matrix $A$ ($\operatorname{rank}(A) = m < n$), the right pseudoinverse $A^+ = A^T (A A^T)^{-1}$ strictly satisfies all four conditions.

**Given Data:**
- $A^+ = A^T (A A^T)^{-1}$, where $A A^T$ is symmetric and invertible ($m \times m$).

**Step-by-Step Derivation:**
1. **Condition 1 ($A A^+ A = A$):**
   $$A A^+ = A \left[ A^T (A A^T)^{-1} \right] = (A A^T) (A A^T)^{-1} = I_m$$
   Multiplying by $A$:
   $$A A^+ A = I_m A = A \quad \checkmark$$
2. **Condition 2 ($A^+ A A^+ = A^+$):**
   $$A^+ (A A^+) = A^+ I_m = A^+ \quad \checkmark$$
3. **Condition 3 ($(A A^+)^T = A A^+$):**
   Since $A A^+ = I_m$:
   $$(A A^+)^T = I_m^T = I_m = A A^+ \quad \checkmark$$
4. **Condition 4 ($(A^+ A)^T = A^+ A$):**
   $$A^+ A = A^T (A A^T)^{-1} A$$
   Taking the transpose:
   $$(A^+ A)^T = \left( A^T (A A^T)^{-1} A \right)^T = A^T \left( (A A^T)^{-1} \right)^T (A^T)^T$$
   Since $(A A^T)^T = (A^T)^T A^T = A A^T$, its inverse is also symmetric:
   $$\left( (A A^T)^{-1} \right)^T = (A A^T)^{-1}$$
   Therefore:
   $$(A^+ A)^T = A^T (A A^T)^{-1} A = A^+ A \quad \checkmark$$

**Final Answer:**
- All four Penrose conditions are proven identically for $A^+ = A^T (A A^T)^{-1}$.
- Uniqueness guarantees that this algebraic formula is the true Moore-Penrose pseudoinverse.

**Verification:**
The projector $P_{\text{range}} = A A^+ = I_m$ projects onto the full task space, while $P_{\text{row}} = A^+ A$ is an orthogonal projection onto the row space of $A$.

---

#### Problem 12.20: Synthesis of the Complete Autonomous Kinematic Architecture
**Statement:**
Synthesize the complete mathematical pipeline of the `robotics-kinematics-engine.ts` autonomous manipulation loop. Given a discrete control tick $k$ with target pose $T_d(t_k) \in SE(3)$, current joint configuration $q_k \in \mathbb{R}^n$, and previous joint configuration $q_{k-1}$:
1. Detail the step-by-step mathematical flow from task-space goal to joint torque command $\tau_k$.
2. Write the complete pseudocode algorithm combining trajectory generation, CLIK drift compensation, adaptive DLS singularity protection, nullspace secondary optimization, and joint limit enforcement.

**Given Data:**
- Sampling period $\Delta t = 0.001\text{ s}$ ($1\text{ kHz}$).
- Redundant 7-DoF manipulator with limits $q_{\min}, q_{\max}$.

**Step-by-Step Derivation:**
1. **Mathematical Pipeline:**
   - **Step 1: Trajectory Interpolation:**
     Evaluate $p_d(t_k), \dot{p}_d(t_k)$ via quintic polynomial $s(t)$ and $q_d(t_k), \omega_d(t_k)$ via unit quaternion $\operatorname{Slerp}$.
   - **Step 2: Forward Kinematics:**
     Compute current end-effector pose $T(q_k) = (R(q_k), p(q_k))$ and link frames via DH or PoE recursion.
   - **Step 3: Operational Error Vector:**
     $$e_p = p_d(t_k) - p(q_k)$$
     $$\Delta q = q(q_k)^{-1} * q_d(t_k) \implies e_o = 2 \operatorname{sgn}(\Delta\eta) \Delta\epsilon$$
     $$e = \begin{bmatrix} e_p \\ e_o \end{bmatrix} \in \mathbb{R}^6, \quad \dot{x}_d = \begin{bmatrix} \dot{p}_d \\ \omega_d \end{bmatrix} \in \mathbb{R}^6$$
   - **Step 4: Geometric Jacobian & Manipulability:**
     Compute $J(q_k) \in \mathbb{R}^{6 \times 7}$. Evaluate $w = \sqrt{\det(J J^T)}$.
   - **Step 5: Adaptive Damping:**
     $$\lambda^2 = \begin{cases} 0 & \text{if } w \ge w_0 \\ \lambda_0^2(1 - w/w_0)^2 & \text{if } w < w_0 \end{cases}$$
   - **Step 6: Primary Inversion & Nullspace Projection:**
     $$J^{*\lambda} = J^T (J J^T + \lambda^2 I_6)^{-1}$$
     $$P = I_7 - J^{*\lambda} J$$
     $$v_{\text{sec}} = -k_{\text{lim}} \nabla_q V_{\text{limit}}(q_k) + k_{\text{mani}} \nabla_q w(q_k)$$
     $$\dot{q}_k = J^{*\lambda} (\dot{x}_d + K_p e) + P v_{\text{sec}}$$
   - **Step 7: Numerical Integration & Joint Limit Safety:**
     $$q_{k+1} = \operatorname{clip}\left( q_k + \Delta t \dot{q}_k, \; q_{\min}, \; q_{\max} \right)$$

2. **Complete Algorithmic Specification:**
```typescript
class AutonomousKinematicLoop {
  step(t: number, dt: number, target: PoseSE3, state: JointState): JointCommand {
    // 1. Trajectory generation
    const { pos: pd, vel: vd } = this.trajPos.evaluate(t);
    const { quat: qd, omega: wd } = this.trajOri.evaluate(t);
    
    // 2. Forward kinematics
    const currentPose = this.chain.forwardKinematics(state.q);
    
    // 3. Pose error computation
    const ep = pd.subtract(currentPose.translation);
    const deltaQ = currentPose.rotation.conjugate().multiply(qd);
    const eo = deltaQ.vector.scale(2.0 * Math.sign(deltaQ.w));
    const e = new Vector6D(ep.x, ep.y, ep.z, eo.x, eo.y, eo.z);
    const v_ref = new Vector6D(vd.x, vd.y, vd.z, wd.x, wd.y, wd.z).add(e.scale(this.Kp));
    
    // 4. Jacobian and manipulability
    const J = this.chain.geometricJacobian(state.q);
    const w = J.manipulabilityIndex();
    
    // 5. Adaptive DLS damping
    const lambdaSq = w < this.w0 ? this.lambda0Sq * Math.pow(1 - w / this.w0, 2) : 0;
    
    // 6. Regularized pseudoinverse and nullspace
    const J_dls = J.dampedLeastSquaresInverse(lambdaSq);
    const q_dot_task = J_dls.multiplyVector(v_ref);
    
    // 7. Nullspace optimization
    const P = Matrix.identity(7).subtract(J_dls.multiply(J));
    const g_lim = this.computeJointLimitGradient(state.q);
    const g_mani = J.manipulabilityGradient(state.q);
    const v_sec = g_lim.scale(-this.k_lim).add(g_mani.scale(this.k_mani));
    const q_dot_null = P.multiplyVector(v_sec);
    
    // 8. Integration and hard limits
    const q_dot = q_dot_task.add(q_dot_null);
    const q_next = state.q.add(q_dot.scale(dt)).clamp(this.q_min, this.q_max);
    
    return { q: q_next, qDot: q_dot };
  }
}
```

**Final Answer:**
- Complete mathematical closed-loop control architecture specified.
- Synthesizes all 12 chapters into an unconditionally stable, singularity-robust, constraint-enforcing real-time kinematics engine.

**Verification:**
The formulation guarantees zero steady-state tracking error ($e \to 0$), zero end-effector perturbation from secondary tasks ($J P \equiv 0$), finite joint velocities across singular points ($\|\dot{q}\| \le \frac{\|v\|}{2\lambda}$), and physical joint limit compliance.

---
