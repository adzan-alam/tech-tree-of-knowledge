# Chapter 1: The Geometry of Mass: Center of Mass and Discrete-to-Continuum Rigidity

> *"Give me a place to stand, and a lever long enough, and I will move the world. But give me a rigid body, and its center of mass will move as though all the matter of the cosmos were concentrated in a single solitary point, while all its geometry twists in harmonious rotation around it."*

---

## 1.1 The Classical Idealization: What is a Rigid Body?

In elementary introductory physics, physical systems are routinely reduced to idealized zero-dimensional point particles. A point particle possesses mass $M$, spatial coordinates $(x, y, z)$, linear velocity $\mathbf{v}$, and linear momentum $\mathbf{p} = M\mathbf{v}$. It has no length, no width, no height, no internal structure, and no orientation. It can fly forward, backward, left, right, up, and down—possessing precisely **three translational degrees of freedom**.

Yet, when you look upon the engineering marvels of human civilization—an airplane landing gear absorbing impact, a 6-axis industrial welding robot, a tennis racket struck by a high-velocity ball, or a satellite deploying its solar panels in orbit—the point-particle approximation collapses completely. These objects possess **spatial extent, geometry, volume, and non-uniform mass distribution**. They do not merely translate; they pitch, roll, yaw, tumble, vibrate, and rotate.

```
       Point Particle (3-DOF)                  Rigid Body (6-DOF)
             Z                                        Z       ω (Spin)
             │                                        │      /
             │                                        │    .---.
             │    ● Mass M                            │   /     \
             │   / (Only translates)                  │  |  COM  | ───► v_cm
             └─────────── X                           │   \  ●  /
            /                                         │    '---'
           Y                                          └─────────── X
                                                     /
                                                    Y
```

### The Axiom of Rigidity
A **rigid body** is mathematically defined as an idealization of a solid object in which the spatial Euclidean distance between any two constituent material points remains strictly invariant under all applied external forces and torques:

$$\|\mathbf{r}_i(t) - \mathbf{r}_j(t)\| = d_{ij} = \text{constant}, \quad \forall i, j \in \{1, 2, \dots, N\}, \; \forall t \ge 0$$

Let us differentiate this fundamental rigidity constraint with respect to time:

$$\frac{d}{dt} \|\mathbf{r}_i(t) - \mathbf{r}_j(t)\|^2 = \frac{d}{dt} \Big( (\mathbf{r}_i - \mathbf{r}_j) \cdot (\mathbf{r}_i - \mathbf{r}_j) \Big) = 0$$

Applying the Leibniz product rule for vector dot products:

$$2(\mathbf{r}_i - \mathbf{r}_j) \cdot (\dot{\mathbf{r}}_i - \dot{\mathbf{r}}_j) = 0$$

$$\implies (\mathbf{r}_i - \mathbf{r}_j) \cdot (\mathbf{v}_i - \mathbf{v}_j) = 0$$

### The Geometric Meaning of the Rigidity Derivative:
This simple dot-product identity contains a profound physical truth: **the relative velocity vector $(\mathbf{v}_i - \mathbf{v}_j)$ between any two points in a rigid body must be strictly perpendicular to the displacement vector $(\mathbf{r}_i - \mathbf{r}_j)$ connecting them.** 

If the relative velocity had any non-zero component parallel to $(\mathbf{r}_i - \mathbf{r}_j)$, the distance between the two points would either stretch or compress, violating the axiom of rigidity. Because the relative velocity is purely orthogonal, the relative motion of point $i$ with respect to point $j$ can **only be a pure instantaneous rotation**!

---

## 1.2 The Center of Mass: Discrete Systems vs. Continuous Media

When a rigid body moves through space, every one of its trillions of atoms traces out a complex, winding trochoidal path. How can we make sense of this dizzying cacophony of trajectories? 

The answer lies in the discovery of the **Center of Mass (COM)**: a unique, privileged geometric point where the linear momentum of the entire system behaves as if the total mass were concentrated into a single point governed directly by Newton's Second Law.

### 1. Discrete Formulation
For a collection of $N$ discrete particles with masses $m_1, m_2, \dots, m_N$ and position vectors $\mathbf{r}_1, \mathbf{r}_2, \dots, \mathbf{r}_N$, the total mass is:

$$M = \sum_{i=1}^N m_i$$

The Center of Mass position vector $\mathbf{R}_{\text{cm}}$ is the mass-weighted average of all particle positions:

$$\mathbf{R}_{\text{cm}} = \frac{1}{M}\sum_{i=1}^N m_i \mathbf{r}_i = \frac{\sum m_i \mathbf{r}_i}{\sum m_i}$$

In Cartesian components:

$$X_{\text{cm}} = \frac{1}{M}\sum_{i=1}^N m_i x_i, \quad Y_{\text{cm}} = \frac{1}{M}\sum_{i=1}^N m_i y_i, \quad Z_{\text{cm}} = \frac{1}{M}\sum_{i=1}^N m_i z_i$$

### 2. Continuous Continuum Formulation
In real-world engineering, mass is distributed smoothly throughout a continuous 3D volume $V$ with a local mass density function $\rho(\mathbf{r}) = \rho(x, y, z)$ (in $\text{kg/m}^3$). An infinitesimal volume element $dV = dx \, dy \, dz$ carries an infinitesimal mass element:

$$dm = \rho(\mathbf{r}) \, dV$$

The total mass of the continuous rigid body is the triple integral over its bounding volume:

$$M = \iiint_V dm = \iiint_V \rho(\mathbf{r}) \, dV$$

The Center of Mass is the continuous integral expectation:

$$\mathbf{R}_{\text{cm}} = \frac{1}{M}\iiint_V \mathbf{r} \, dm = \frac{1}{M}\iiint_V \mathbf{r} \, \rho(\mathbf{r}) \, dV$$

Writing this out in Cartesian scalar triple integrals:

$$X_{\text{cm}} = \frac{1}{M}\iiint_V x \, \rho(x, y, z) \, dx \, dy \, dz$$
$$Y_{\text{cm}} = \frac{1}{M}\iiint_V y \, \rho(x, y, z) \, dx \, dy \, dz$$
$$Z_{\text{cm}} = \frac{1}{M}\iiint_V z \, \rho(x, y, z) \, dx \, dy \, dz$$

### Homogeneous Bodies and the Centroid
If the material is homogeneous (uniform density $\rho(\mathbf{r}) = \rho_0 = \text{constant}$), the density factors out of both the numerator and the denominator:

$$\mathbf{R}_{\text{cm}} = \frac{\rho_0 \iiint_V \mathbf{r} \, dV}{\rho_0 \iiint_V dV} = \frac{1}{V}\iiint_V \mathbf{r} \, dV$$

In a homogeneous body, the Center of Mass coincides identically with the purely geometric **Centroid** of the volume. If an object possesses geometric symmetry planes, axes, or centers of inversion, its Center of Mass must lie on those symmetry elements.

---

## 1.3 Charles' Theorem (The Mozzi-Charles Theorem)

How can we decompose the arbitrary spatial displacement of a rigid body? In 1763, Giulio Mozzi discovered—and in 1830, Michel Charles formally codified—the fundamental kinematic theorem of rigid body motion:

> **The Mozzi-Charles Theorem:**  
> *Every spatial displacement of a rigid body can be uniquely represented as a translation along an axis combined with a rotation about that same axis (a helical "screw" displacement). Furthermore, with respect to the Center of Mass, any general infinitesimal motion can be decoupled into a pure translational velocity of the Center of Mass, plus a pure instantaneous angular rotation around an axis passing through the Center of Mass.*

```
               Arbitrary Rigid Motion = Translation + Rotation
               
                    Initial Body                   Displaced Body
                      ┌─────┐                         ┌───────┐
                      │  ●  │                         │   /   │
                      └─────┘                         │  ●    │
                         \                            └───────┘
                          \ Translation of COM            ▲
                           \                             / Rotation 
                            ▼                           /  about COM
                         ┌─────┐                       /
                         │  ●  │ ─────────────────────'
                         └─────┘
```

Mathematically, let $\mathbf{R}_{\text{cm}}(t)$ be the position of the center of mass in an inertial world frame. Any material point $i$ in the body can be located relative to the center of mass by a relative displacement vector $\mathbf{r}_i'(t)$:

$$\mathbf{r}_i(t) = \mathbf{R}_{\text{cm}}(t) + \mathbf{r}_i'(t)$$

By the definition of the Center of Mass, the mass-weighted sum of these relative position vectors is identically zero:

$$\sum_{i=1}^N m_i \mathbf{r}_i' = \sum_{i=1}^N m_i (\mathbf{r}_i - \mathbf{R}_{\text{cm}}) = \sum m_i \mathbf{r}_i - \mathbf{R}_{\text{cm}} \sum m_i = M \mathbf{R}_{\text{cm}} - M \mathbf{R}_{\text{cm}} \equiv \mathbf{0}$$

Now differentiate with respect to time to obtain the velocity of point $i$:

$$\mathbf{v}_i(t) = \dot{\mathbf{r}}_i(t) = \dot{\mathbf{R}}_{\text{cm}}(t) + \dot{\mathbf{r}}_i'(t) = \mathbf{V}_{\text{cm}}(t) + \mathbf{v}_i'(t)$$

Because the body is rigid, the relative velocity $\mathbf{v}_i'$ can only arise from an instantaneous angular velocity vector $\boldsymbol{\omega}(t)$:

$$\mathbf{v}_i'(t) = \boldsymbol{\omega}(t) \times \mathbf{r}_i'(t)$$

Thus, the velocity of any arbitrary point in a rigid body is given by the universal **Rigid Body Velocity Field**:

$$\mathbf{v}_i = \mathbf{V}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}_i'$$

---

## 1.4 Koenig's Theorem: The Clean Decoupling of Kinetic Energy

One of the most magnificent theorems in classical mechanics is **Koenig's Theorem** (named after Johann Samuel König, 1751). It states that the total kinetic energy of any multi-particle or continuous rigid body decomposes cleanly into two independent, uncoupled terms:
1. The **translational kinetic energy** of the total mass moving with the center of mass.
2. The **rotational kinetic energy** of motion relative to the center of mass.

### Rigorous Analytical Derivation

The total kinetic energy of the system of $N$ particles is:

$$T = \frac{1}{2}\sum_{i=1}^N m_i \|\mathbf{v}_i\|^2 = \frac{1}{2}\sum_{i=1}^N m_i (\mathbf{v}_i \cdot \mathbf{v}_i)$$

Substitute the velocity decomposition $\mathbf{v}_i = \mathbf{V}_{\text{cm}} + \mathbf{v}_i'$:

$$T = \frac{1}{2}\sum_{i=1}^N m_i \Big( (\mathbf{V}_{\text{cm}} + \mathbf{v}_i') \cdot (\mathbf{V}_{\text{cm}} + \mathbf{v}_i') \Big)$$

Expanding the dot product:

$$T = \frac{1}{2}\sum_{i=1}^N m_i \Big( \|\mathbf{V}_{\text{cm}}\|^2 + 2\mathbf{V}_{\text{cm}} \cdot \mathbf{v}_i' + \|\mathbf{v}_i'\|^2 \Big)$$

Distribute the summation across the three terms:

$$T = \frac{1}{2}\left(\sum_{i=1}^N m_i\right) \|\mathbf{V}_{\text{cm}}\|^2 + \mathbf{V}_{\text{cm}} \cdot \left(\sum_{i=1}^N m_i \mathbf{v}_i'\right) + \frac{1}{2}\sum_{i=1}^N m_i \|\mathbf{v}_i'\|^2$$

Now, examine the middle cross-term carefully:

$$\sum_{i=1}^N m_i \mathbf{v}_i' = \sum_{i=1}^N m_i \frac{d\mathbf{r}_i'}{dt} = \frac{d}{dt}\left(\sum_{i=1}^N m_i \mathbf{r}_i'\right)$$

As proven in Section 1.3, $\sum m_i \mathbf{r}_i' \equiv \mathbf{0}$ by the very definition of the Center of Mass! Therefore:

$$\frac{d}{dt}\left(\sum_{i=1}^N m_i \mathbf{r}_i'\right) = \frac{d}{dt}(\mathbf{0}) \equiv \mathbf{0}$$

The cross-term vanishes identically! We are left with:

$$T = \frac{1}{2} M \|\mathbf{V}_{\text{cm}}\|^2 + \frac{1}{2}\sum_{i=1}^N m_i \|\mathbf{v}_i'\|^2$$

$$T = T_{\text{trans}} + T_{\text{rot}}$$

### Why This Decoupling is Revolutionary:
If we had chosen any arbitrary reference point other than the Center of Mass (for example, the corner of a table or an arbitrary tracking marker), the cross-term $\mathbf{V}_{\text{ref}} \cdot \sum m_i \mathbf{v}_i'$ would **not vanish**. 
Translational acceleration would pump energy directly into rotational modes, creating hopelessly coupled, intractable differential equations. 

By anchoring our coordinate frame at the Center of Mass, translation and rotation decouple into two independent, pristine dynamical domains:
- **Translation:** Governed by $\mathbf{F}_{\text{net}} = M\dot{\mathbf{V}}_{\text{cm}}$
- **Rotation:** Governed by $\boldsymbol{\tau}_{\text{cm}} = \dot{\mathbf{L}}_{\text{cm}}$

---

## 1.5 Degrees of Freedom Analysis: Why Exactly 6?

How many numbers are required to completely specify the configuration of a 3D rigid body in space?

Let us construct a rigid body particle by particle and count its **Degrees of Freedom (DOF)**:

```
Step 1: Point A (3 DOF)        Step 2: Point B (5 DOF)        Step 3: Point C (6 DOF)
         Z                              Z                              Z
         │                              │                              │
         │    A(x₁, y₁, z₁)             │    A                         │    A ─────── B
         │   ●                          │   ●                          │   ● \       /
         └─────────── X                 │    \ Fixed Distance d₁₂      │      \     / Fixed d₂₃
        /                               │     \                        │       \   /
       Y                                └──────●──── X                 └────────●── X
                                       /        B(on sphere)          /          C(2 points)
                                      Y                              Y
```

1. **First Particle (Point A):**
   - Free to be positioned anywhere in 3D Euclidean space: $(x_1, y_1, z_1)$.
   - **Degrees of Freedom = 3**.
2. **Second Particle (Point B):**
   - Introducing Point B adds 3 new spatial coordinates $(x_2, y_2, z_2)$.
   - However, the rigidity constraint enforces $\|\mathbf{r}_1 - \mathbf{r}_2\| = d_{12} = \text{const}$.
   - This single scalar equation restricts Point B to the 2D surface of a sphere centered at A.
   - Degrees of Freedom = $3 + 3 - 1 = \mathbf{5}$ (3 for position of A, 2 for orientation of the line AB, like latitude and longitude on a celestial sphere).
3. **Third Particle (Point C, not collinear with AB):**
   - Adding Point C introduces 3 new coordinates $(x_3, y_3, z_3)$.
   - Rigidity imposes **two** new independent distance constraints:
     $$\|\mathbf{r}_1 - \mathbf{r}_3\| = d_{13}, \quad \|\mathbf{r}_2 - \mathbf{r}_3\| = d_{23}$$
   - The intersection of two spheres centered at A and B is a 1D circle. Point C can only rotate around the axis AB.
   - Once a choice is made between the two sides of the line (fixing chirality/reflection), Point C has only 1 remaining degree of freedom (the angle of rotation $\theta$ around the AB axis).
   - Degrees of Freedom = $5 + 3 - 2 = \mathbf{6}$.
4. **Fourth Particle (Point D, non-coplanar):**
   - Adding Point D introduces 3 coordinates $(x_4, y_4, z_4)$.
   - Rigidity imposes **three** distance constraints to A, B, and C:
     $$\|\mathbf{r}_1 - \mathbf{r}_4\| = d_{14}, \quad \|\mathbf{r}_2 - \mathbf{r}_4\| = d_{24}, \quad \|\mathbf{r}_3 - \mathbf{r}_4\| = d_{34}$$
   - The intersection of three spheres with non-collinear centers consists of at most **two discrete points**.
   - Because distance constraints prevent switching between the two discrete points without breaking the body, Point D has **zero new degrees of freedom** ($3 - 3 = 0$).
5. **Every Subsequent Particle ($N \ge 4$):**
   - Every additional particle adds 3 coordinates, but is rigidly tethered to at least 3 non-collinear reference points, adding 3 constraints.
   - Net change in degrees of freedom = $3 - 3 = 0$.

### The Invariant Law:
**Any three-dimensional non-linear rigid body possesses exactly Six Degrees of Freedom (6-DOF):**
- **3 Translational Degrees of Freedom:** The Cartesian coordinates of its Center of Mass $(X_{\text{cm}}, Y_{\text{cm}}, Z_{\text{cm}})$.
- **3 Rotational Degrees of Freedom:** The spatial orientation of the body (parameterized by a unit quaternion $q \in \mathbb{S}^3$, a rotation matrix $\mathbf{R} \in SO(3)$, or three Euler angles).

*(Note: A degenerate collinear rigid body, such as a diatomic gas molecule $O_2$ or a straight needle, has only 5 degrees of freedom because rotation around the line of symmetry produces no physical displacement of mass).*

---

## 1.6 10 Step-by-Step Worked Examples

### Worked Example 1.1: Center of Mass of a Non-Uniform Discrete Triad
**Problem:** Three point masses are positioned in space:
- $m_1 = 2\text{ kg}$ at $\mathbf{r}_1 = (1, 2, 3)\text{ m}$
- $m_2 = 3\text{ kg}$ at $\mathbf{r}_2 = (-2, 0, 4)\text{ m}$
- $m_3 = 5\text{ kg}$ at $\mathbf{r}_3 = (4, -2, -1)\text{ m}$
Calculate the total mass $M$ and the Center of Mass coordinates $\mathbf{R}_{\text{cm}}$.
**Solution:**
1. Compute total mass:
   $$M = m_1 + m_2 + m_3 = 2 + 3 + 5 = 10\text{ kg}$$
2. Compute mass-weighted vector sum $\sum m_i \mathbf{r}_i$:
   $$m_1 \mathbf{r}_1 = 2(1, 2, 3) = (2, 4, 6)$$
   $$m_2 \mathbf{r}_2 = 3(-2, 0, 4) = (-6, 0, 12)$$
   $$m_3 \mathbf{r}_3 = 5(4, -2, -1) = (20, -10, -5)$$
   $$\sum m_i \mathbf{r}_i = (2 - 6 + 20, \; 4 + 0 - 10, \; 6 + 12 - 5) = (16, -6, 13)$$
3. Divide by total mass $M = 10$:
   $$\mathbf{R}_{\text{cm}} = \frac{1}{10}(16, -6, 13) = (1.6, -0.6, 1.3)\text{ m}$$
4. Component check:
   $X_{\text{cm}} = 1.6\text{ m}, Y_{\text{cm}} = -0.6\text{ m}, Z_{\text{cm}} = 1.3\text{ m}$.

---

### Worked Example 1.2: Center of Mass of a Solid Homogeneous Hemisphere
**Problem:** Derive the Center of Mass of a solid hemisphere of radius $R$ and uniform density $\rho_0$, centered at the origin with its flat base on the $xy$-plane ($z \ge 0$).
**Solution:**
1. **Symmetry:** By rotational symmetry about the $z$-axis, $X_{\text{cm}} = 0$ and $Y_{\text{cm}} = 0$. We only need to integrate $Z_{\text{cm}}$.
2. **Total Volume:**
   $$V = \frac{2}{3}\pi R^3 \implies M = \frac{2}{3}\pi \rho_0 R^3$$
3. **Volume Element (Cylindrical Slices):**
   Slice the hemisphere into circular discs of thickness $dz$ at height $z \in [0, R]$.
   The radius of the disc at height $z$ is $r(z) = \sqrt{R^2 - z^2}$.
   The volume of this thin disc is $dV = \pi r^2 dz = \pi (R^2 - z^2) dz$.
4. **Integrate Numerator:**
   $$\iiint z \, dV = \int_0^R z \cdot \pi(R^2 - z^2) \, dz = \pi \int_0^R (R^2 z - z^3) \, dz$$
   $$= \pi \left[ \frac{R^2 z^2}{2} - \frac{z^4}{4} \right]_0^R = \pi \left( \frac{R^4}{2} - \frac{R^4}{4} \right) = \frac{\pi R^4}{4}$$
5. **Compute $Z_{\text{cm}}$:**
   $$Z_{\text{cm}} = \frac{\frac{\pi R^4}{4}}{\frac{2}{3}\pi R^3} = \frac{1}{4} \times \frac{3}{2} R = \frac{3}{8}R$$
6. **Result:** $\mathbf{R}_{\text{cm}} = \left(0, 0, \frac{3}{8}R\right)$.
   For a hemisphere of radius $R = 8\text{ cm}$, the center of mass is at height $z = 3\text{ cm}$ above the base.

---

### Worked Example 1.3: Center of Mass of a Solid Right Circular Cone
**Problem:** Find the Center of Mass of a solid right circular cone of base radius $R$, height $H$, and uniform density $\rho_0$, with its vertex at the origin and expanding along the positive $z$-axis ($z \in [0, H]$).
**Solution:**
1. **Symmetry:** By symmetry around the $z$-axis, $X_{\text{cm}} = 0, Y_{\text{cm}} = 0$.
2. **Radius at height $z$:**
   At $z = 0$, radius is 0. At $z = H$, radius is $R$.
   Thus $r(z) = \frac{R}{H}z$.
3. **Volume Element:**
   $$dV = \pi r(z)^2 dz = \pi \frac{R^2}{H^2} z^2 dz$$
4. **Total Volume:**
   $$V = \int_0^H \pi \frac{R^2}{H^2} z^2 dz = \pi \frac{R^2}{H^2} \left[ \frac{z^3}{3} \right]_0^H = \frac{1}{3}\pi R^2 H$$
5. **Numerator Integral:**
   $$\iiint z \, dV = \int_0^H z \left(\pi \frac{R^2}{H^2} z^2\right) dz = \pi \frac{R^2}{H^2} \int_0^H z^3 dz = \pi \frac{R^2}{H^2} \left[ \frac{z^4}{4} \right]_0^H = \frac{1}{4}\pi R^2 H^2$$
6. **Compute $Z_{\text{cm}}$:**
   $$Z_{\text{cm}} = \frac{\frac{1}{4}\pi R^2 H^2}{\frac{1}{3}\pi R^2 H} = \frac{3}{4}H$$
7. **Result:** The center of mass is located at $Z_{\text{cm}} = \frac{3}{4}H$ from the vertex (or $\frac{1}{4}H$ from the flat circular base).

---

### Worked Example 1.4: Koenig's Theorem Calculation on a Rolling Cylinder
**Problem:** A solid homogeneous cylinder of mass $M = 10\text{ kg}$ and radius $R = 0.5\text{ m}$ rolls without slipping along a horizontal surface with Center of Mass speed $V_{\text{cm}} = 4\text{ m/s}$. The rotational kinetic energy of a solid cylinder is $T_{\text{rot}} = \frac{1}{4}M V_{\text{cm}}^2$. 
1. Calculate $T_{\text{trans}}$, $T_{\text{rot}}$, and the total kinetic energy $T$.
2. Compute the velocity of the point in contact with the ground and the highest point on the cylinder.
**Solution:**
1. **Translational Kinetic Energy:**
   $$T_{\text{trans}} = \frac{1}{2}M V_{\text{cm}}^2 = \frac{1}{2}(10)(4)^2 = \frac{1}{2}(10)(16) = 80\text{ J}$$
2. **Rotational Kinetic Energy:**
   $$T_{\text{rot}} = \frac{1}{4}M V_{\text{cm}}^2 = \frac{1}{4}(10)(16) = 40\text{ J}$$
3. **Total Kinetic Energy via Koenig's Theorem:**
   $$T = T_{\text{trans}} + T_{\text{rot}} = 80\text{ J} + 40\text{ J} = 120\text{ J}$$
4. **Point Velocities via Rigid Velocity Field $\mathbf{v} = \mathbf{V}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}'$:**
   Since rolling without slipping: $\omega = \frac{V_{\text{cm}}}{R} = \frac{4}{0.5} = 8\text{ rad/s}$.
   - **Ground Contact Point:** $\mathbf{r}' = (0, -R) = (0, -0.5)$.
     $$v_{\text{ground}} = V_{\text{cm}} - \omega R = 4 - (8)(0.5) = 4 - 4 = 0\text{ m/s}$$
     The contact point is instantaneously stationary!
   - **Top Point:** $\mathbf{r}' = (0, +R) = (0, +0.5)$.
     $$v_{\text{top}} = V_{\text{cm}} + \omega R = 4 + (8)(0.5) = 4 + 4 = 8\text{ m/s}$$
     The top moves at exactly twice the Center of Mass speed.

---

### Worked Example 1.5: Verifying the Orthogonal Velocity Constraint
**Problem:** In a rigid body simulation, particle $A$ is at $\mathbf{r}_A = (2, 1, 0)\text{ m}$ with velocity $\mathbf{v}_A = (3, 2, -1)\text{ m/s}$. Particle $B$ is at $\mathbf{r}_B = (5, 5, 0)\text{ m}$. If particle $B$ has velocity $\mathbf{v}_B = (v_x, 1, 4)\text{ m/s}$, find $v_x$ such that the rigid body distance constraint is preserved.
**Solution:**
1. Displacement vector between $A$ and $B$:
   $$\mathbf{r}_{AB} = \mathbf{r}_B - \mathbf{r}_A = (5 - 2, \; 5 - 1, \; 0 - 0) = (3, 4, 0)\text{ m}$$
2. Relative velocity vector:
   $$\mathbf{v}_{AB} = \mathbf{v}_B - \mathbf{v}_A = (v_x - 3, \; 1 - 2, \; 4 - (-1)) = (v_x - 3, \; -1, \; 5)\text{ m/s}$$
3. The rigidity constraint requires:
   $$\mathbf{r}_{AB} \cdot \mathbf{v}_{AB} = 0$$
4. Compute dot product:
   $$3(v_x - 3) + 4(-1) + 0(5) = 0$$
   $$3v_x - 9 - 4 = 0 \implies 3v_x = 13 \implies v_x = \frac{13}{3} \approx 4.333\text{ m/s}$$
5. If $v_x \ne \frac{13}{3}$, the body would deform, violating rigidity.

---

### Worked Example 1.6: Center of Mass of a Hollow Cutout (Negative Mass Method)
**Problem:** A uniform square steel plate of side length $L = 20\text{ cm}$ centered at the origin $(0, 0)$ has a circular hole of radius $R = 5\text{ cm}$ drilled with its center at $(5, 5)\text{ cm}$. Find the new Center of Mass coordinates of the plate.
**Solution:**
1. **Total Square Area:** $A_1 = L^2 = 20 \times 20 = 400\text{ cm}^2$. Center at $\mathbf{r}_1 = (0, 0)$.
2. **Cutout Hole Area:** $A_2 = \pi R^2 = \pi (5)^2 = 25\pi \approx 78.54\text{ cm}^2$. Center at $\mathbf{r}_2 = (5, 5)$.
3. **Negative Mass Concept:**
   Treat the drilled plate as a complete square with positive mass $m_1 = \sigma A_1$, superimposed with a circular disc of negative mass $m_2 = -\sigma A_2$.
4. **Remaining Mass:**
   $$M_{\text{rem}} = m_1 - m_2 = \sigma (A_1 - A_2) = \sigma (400 - 25\pi) \approx \sigma (321.46)$$
5. **Center of Mass Coordinate $X_{\text{cm}}$:**
   $$X_{\text{cm}} = \frac{m_1 x_1 - m_2 x_2}{m_1 - m_2} = \frac{\sigma(400)(0) - \sigma(25\pi)(5)}{\sigma(400 - 25\pi)} = \frac{-125\pi}{400 - 25\pi}$$
   $$X_{\text{cm}} = \frac{-392.70}{321.46} \approx -1.222\text{ cm}$$
6. **By Symmetry ($x_2 = y_2 = 5$):**
   $$Y_{\text{cm}} = -1.222\text{ cm}$$
7. **Result:** $\mathbf{R}_{\text{cm}} = (-1.222, -1.222, 0)\text{ cm}$.
   Drilling the hole in the first quadrant shifts the center of mass into the third quadrant, away from the missing mass.

---

### Worked Example 1.7: Velocity Field of a Tumbling Satellite
**Problem:** A satellite in orbit has Center of Mass velocity $\mathbf{V}_{\text{cm}} = (100, 0, 0)\text{ m/s}$ and angular velocity $\boldsymbol{\omega} = (0.1, 0.2, 0.5)\text{ rad/s}$. An antenna is mounted at body position $\mathbf{r}' = (2, -1, 3)\text{ m}$ relative to the COM. Calculate the velocity of the antenna tip in the inertial world frame.
**Solution:**
1. Rigid velocity field formula:
   $$\mathbf{v}_{\text{antenna}} = \mathbf{V}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}'$$
2. Compute cross product $\boldsymbol{\omega} \times \mathbf{r}'$:
   $$\boldsymbol{\omega} \times \mathbf{r}' = \begin{bmatrix} 0.1 \\ 0.2 \\ 0.5 \end{bmatrix} \times \begin{bmatrix} 2 \\ -1 \\ 3 \end{bmatrix} = \begin{bmatrix} (0.2)(3) - (0.5)(-1) \\ (0.5)(2) - (0.1)(3) \\ (0.1)(-1) - (0.2)(2) \end{bmatrix} = \begin{bmatrix} 0.6 + 0.5 \\ 1.0 - 0.3 \\ -0.1 - 0.4 \end{bmatrix} = \begin{bmatrix} 1.1 \\ 0.7 \\ -0.5 \end{bmatrix}\text{ m/s}$$
3. Add $\mathbf{V}_{\text{cm}} = (100, 0, 0)$:
   $$\mathbf{v}_{\text{antenna}} = (100 + 1.1, \; 0 + 0.7, \; 0 - 0.5) = (101.1, \; 0.7, \; -0.5)\text{ m/s}$$
4. Speed of antenna:
   $$v = \sqrt{101.1^2 + 0.7^2 + (-0.5)^2} = \sqrt{10221.21 + 0.49 + 0.25} = \sqrt{10221.95} \approx 101.104\text{ m/s}$$

---

### Worked Example 1.8: Degrees of Freedom of a Planar Linkage vs 3D Body
**Problem:** Compare the degrees of freedom of a single 2D rigid planar polygon with a 3D rigid body, and explain the physical meaning of each degree of freedom.
**Solution:**
1. **2D Rigid Body (Planar):**
   - Translation: Can move horizontally ($x$) and vertically ($y$) $\implies 2$ DOF.
   - Rotation: Can only rotate around the axis perpendicular to the plane (angle $\theta$) $\implies 1$ DOF.
   - Total DOF = $2 + 1 = \mathbf{3}$.
2. **3D Rigid Body:**
   - Translation: Can move along $x, y, z \implies 3$ DOF.
   - Rotation: Can rotate around $x$ (roll), $y$ (pitch), and $z$ (yaw) $\implies 3$ DOF.
   - Total DOF = $3 + 3 = \mathbf{6}$.
3. In a physics simulation, representing a 2D body requires a 3-element state vector $(x, y, \theta)$, whereas a 3D body requires a minimum of 6 generalized coordinates, typically represented as a 13-element state vector: position (3), quaternion (4), linear momentum (3), angular momentum (3).

---

### Worked Example 1.9: Acceleration Field in a Rigid Body
**Problem:** Differentiate the velocity field $\mathbf{v} = \mathbf{V}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}'$ to find the acceleration field $\mathbf{a}$ of an arbitrary point in a rigid body.
**Solution:**
1. Differentiate with respect to time:
   $$\mathbf{a} = \frac{d\mathbf{v}}{dt} = \frac{d}{dt}\mathbf{V}_{\text{cm}} + \frac{d}{dt}(\boldsymbol{\omega} \times \mathbf{r}')$$
2. Use the product rule on the cross product:
   $$\frac{d}{dt}(\boldsymbol{\omega} \times \mathbf{r}') = \dot{\boldsymbol{\omega}} \times \mathbf{r}' + \boldsymbol{\omega} \times \dot{\mathbf{r}}'$$
3. Let $\dot{\mathbf{V}}_{\text{cm}} = \mathbf{a}_{\text{cm}}$ and angular acceleration $\dot{\boldsymbol{\omega}} = \boldsymbol{\alpha}$.
4. Recall that $\dot{\mathbf{r}}' = \boldsymbol{\omega} \times \mathbf{r}'$.
5. Substituting:
   $$\mathbf{a} = \mathbf{a}_{\text{cm}} + \boldsymbol{\alpha} \times \mathbf{r}' + \boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}')$$
6. Physical interpretation of terms:
   - $\mathbf{a}_{\text{cm}}$: Linear acceleration of the Center of Mass.
   - $\boldsymbol{\alpha} \times \mathbf{r}'$: **Euler (tangential) acceleration** due to angular acceleration.
   - $\boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}')$: **Centripetal acceleration** pointing directly inward perpendicular to the instantaneous rotation axis.

---

### Worked Example 1.10: Koenig's Theorem on a Spinning Dumbbell
**Problem:** A dumbbell consists of two equal masses $m = 2\text{ kg}$ joined by a rigid massless rod of length $L = 1.0\text{ m}$. The dumbbell is translating at $\mathbf{V}_{\text{cm}} = (3, 0, 0)\text{ m/s}$ and spinning at $\omega = 10\text{ rad/s}$ in the $xy$-plane. Compute the velocities of both masses and verify that the sum of particle kinetic energies equals $T_{\text{trans}} + T_{\text{rot}}$.
**Solution:**
1. **Total mass:** $M = 2 + 2 = 4\text{ kg}$.
2. **Center of Mass coordinates:** Located midway between the masses at distance $r' = \frac{L}{2} = 0.5\text{ m}$.
3. **Translational kinetic energy:**
   $$T_{\text{trans}} = \frac{1}{2}M \|\mathbf{V}_{\text{cm}}\|^2 = \frac{1}{2}(4)(3^2) = 18\text{ J}$$
4. **Rotational kinetic energy:**
   Each mass has relative speed $v' = \omega r' = 10 \times 0.5 = 5\text{ m/s}$.
   $$T_{\text{rot}} = \frac{1}{2}m_1 (v_1')^2 + \frac{1}{2}m_2 (v_2')^2 = \frac{1}{2}(2)(5^2) + \frac{1}{2}(2)(5^2) = 25 + 25 = 50\text{ J}$$
5. **Koenig's total kinetic energy:**
   $$T_{\text{koenig}} = T_{\text{trans}} + T_{\text{rot}} = 18 + 50 = 68\text{ J}$$
6. **Direct particle calculation:**
   At an instant where the rod is aligned with the $y$-axis ($\mathbf{r}_1' = (0, 0.5)$, $\mathbf{r}_2' = (0, -0.5)$):
   $\mathbf{v}_1' = (-5, 0)$, $\mathbf{v}_2' = (+5, 0)$.
   - Mass 1 velocity: $\mathbf{v}_1 = \mathbf{V}_{\text{cm}} + \mathbf{v}_1' = (3 - 5, 0) = (-2, 0)\text{ m/s} \implies \|\mathbf{v}_1\|^2 = 4$.
   - Mass 2 velocity: $\mathbf{v}_2 = \mathbf{V}_{\text{cm}} + \mathbf{v}_2' = (3 + 5, 0) = (8, 0)\text{ m/s} \implies \|\mathbf{v}_2\|^2 = 64$.
   - Direct kinetic energy:
     $$T = \frac{1}{2}(2)(4) + \frac{1}{2}(2)(64) = 4 + 64 = 68\text{ J}$$
7. The direct sum matches Koenig's decomposition identically.

---

## 1.7 10 Granular Solved Exercises

### Exercise 1.1
**Problem:** Prove that if a rigid body has a plane of mass symmetry ($z \to -z$), its Center of Mass must lie on that plane ($Z_{\text{cm}} = 0$).
**Solution:**
1. A plane of symmetry means that for every mass element $dm$ at $(x, y, z)$, there is an identical mass element $dm$ at $(x, y, -z)$, with density satisfying $\rho(x, y, z) = \rho(x, y, -z)$.
2. The $Z$-coordinate of the Center of Mass is:
   $$Z_{\text{cm}} = \frac{1}{M}\iiint_V z \rho(x, y, z) \, dx \, dy \, dz$$
3. Split the integral across the upper ($z > 0$) and lower ($z < 0$) halves:
   $$\int_{-\infty}^\infty z \rho(z) dz = \int_0^\infty z \rho(z) dz + \int_{-\infty}^0 z \rho(z) dz$$
4. In the second integral, substitute $u = -z$, $dz = -du$:
   $$\int_{-\infty}^0 z \rho(z) dz = \int_\infty^0 (-u) \rho(-u) (-du) = -\int_0^\infty u \rho(u) du$$
5. Thus the two integrals cancel identically:
   $$\int_0^\infty z \rho(z) dz - \int_0^\infty u \rho(u) du = 0 \implies Z_{\text{cm}} = 0$$
6. Therefore, the Center of Mass must lie directly on the symmetry plane.

---

### Exercise 1.2
**Problem:** Find the Center of Mass of a thin uniform semicircular wire of radius $R$ bent into the upper half-plane ($y \ge 0, x^2 + y^2 = R^2$).
**Solution:**
1. **Symmetry:** By symmetry across the $y$-axis, $X_{\text{cm}} = 0$.
2. **Arc Length Element:**
   In polar coordinates: $x = R\cos\theta, y = R\sin\theta$ for $\theta \in [0, \pi]$.
   Differential arc length: $ds = R \, d\theta$.
   Total length: $L = \pi R$.
3. **Integrate $Y$:**
   $$\int_0^\pi y \, ds = \int_0^\pi (R\sin\theta)(R \, d\theta) = R^2 \int_0^\pi \sin\theta \, d\theta = R^2 [-\cos\theta]_0^\pi = R^2 (1 - (-1)) = 2R^2$$
4. **Compute $Y_{\text{cm}}$:**
   $$Y_{\text{cm}} = \frac{1}{L}\int y \, ds = \frac{2R^2}{\pi R} = \frac{2}{\pi}R \approx 0.6366 R$$
5. **Result:** $\mathbf{R}_{\text{cm}} = \left(0, \frac{2}{\pi}R\right)$.
   Notice that the Center of Mass lies in empty space, outside the physical wire!

---

### Exercise 1.3
**Problem:** In an $N$-particle rigid system, prove that the total linear momentum is strictly $\mathbf{P} = M\mathbf{V}_{\text{cm}}$.
**Solution:**
1. Total linear momentum is the vector sum:
   $$\mathbf{P} = \sum_{i=1}^N \mathbf{p}_i = \sum_{i=1}^N m_i \mathbf{v}_i = \sum_{i=1}^N m_i \frac{d\mathbf{r}_i}{dt}$$
2. By linearity of differentiation:
   $$\mathbf{P} = \frac{d}{dt}\left(\sum_{i=1}^N m_i \mathbf{r}_i\right)$$
3. From the definition of Center of Mass, $\sum m_i \mathbf{r}_i = M \mathbf{R}_{\text{cm}}$:
   $$\mathbf{P} = \frac{d}{dt}(M \mathbf{R}_{\text{cm}}) = M \frac{d\mathbf{R}_{\text{cm}}}{dt} = M \mathbf{V}_{\text{cm}}$$
4. Thus, internal velocities and rotations cancel out entirely from the total linear momentum.

---

### Exercise 1.4
**Problem:** A robotic arm link is composed of two uniform rods of equal linear mass density $\lambda = 2\text{ kg/m}$. Rod 1 lies along the $x$-axis from $x = 0$ to $x = 1\text{ m}$. Rod 2 is welded at $(1, 0, 0)$ and extends along the $y$-axis from $y = 0$ to $y = 2\text{ m}$. Find the Center of Mass of the welded structure.
**Solution:**
1. **Rod 1:**
   Length $L_1 = 1\text{ m}$, mass $m_1 = \lambda L_1 = 2\text{ kg}$.
   Center of mass at midpoint: $\mathbf{r}_1 = (0.5, 0, 0)\text{ m}$.
2. **Rod 2:**
   Length $L_2 = 2\text{ m}$, mass $m_2 = \lambda L_2 = 4\text{ kg}$.
   Center of mass at midpoint: $\mathbf{r}_2 = (1.0, 1.0, 0)\text{ m}$.
3. **Total mass:** $M = m_1 + m_2 = 2 + 4 = 6\text{ kg}$.
4. **Compute $\mathbf{R}_{\text{cm}}$:**
   $$\mathbf{R}_{\text{cm}} = \frac{m_1 \mathbf{r}_1 + m_2 \mathbf{r}_2}{M} = \frac{2(0.5, 0, 0) + 4(1.0, 1.0, 0)}{6} = \frac{(1.0 + 4.0, \; 0 + 4.0, \; 0)}{6} = \frac{(5.0, 4.0, 0)}{6}$$
   $$\mathbf{R}_{\text{cm}} = \left(\frac{5}{6}, \frac{2}{3}, 0\right) \approx (0.833, 0.667, 0)\text{ m}$$.

---

### Exercise 1.5
**Problem:** Why does a uniform linear diatomic molecule have only 5 degrees of freedom while a non-linear triatomic molecule has 6?
**Solution:**
1. For a linear diatomic molecule (atoms along the $z$-axis), all atoms are zero-dimensional point masses lying on a line.
2. Rotation about the molecular axis ($z$) does not displace any of the point masses; the position of every atom is invariant under this rotation ($\mathbf{r}_i \times \boldsymbol{\omega}_z = \mathbf{0}$).
3. Therefore, rotation about the longitudinal axis corresponds to no physical kinetic energy or coordinate displacement.
4. The system has 3 translational DOF + 2 rotational DOF (pitch and yaw) = **5 DOF**.
5. In a non-linear molecule (like $H_2O$), the atoms span a 2D plane. Rotation about any of the three Cartesian axes moves atoms in space, requiring 3 independent rotational coordinates $\implies 3 + 3 = \mathbf{6}$ DOF.

---

### Exercise 1.6
**Problem:** Show that the rate of change of total angular momentum about the origin is $\dot{\mathbf{L}} = \boldsymbol{\tau}_{\text{ext}}$, and that internal forces cancel due to Newton's Third Law.
**Solution:**
1. Total angular momentum: $\mathbf{L} = \sum \mathbf{r}_i \times \mathbf{p}_i$.
2. Differentiate:
   $$\dot{\mathbf{L}} = \sum (\dot{\mathbf{r}}_i \times \mathbf{p}_i) + \sum (\mathbf{r}_i \times \dot{\mathbf{p}}_i)$$
3. Since $\dot{\mathbf{r}}_i = \mathbf{v}_i$ and $\mathbf{p}_i = m_i \mathbf{v}_i$, $\mathbf{v}_i \times m_i \mathbf{v}_i = \mathbf{0}$.
4. Newton's Second Law: $\dot{\mathbf{p}}_i = \mathbf{F}_i^{\text{ext}} + \sum_{j \ne i} \mathbf{F}_{ij}^{\text{int}}$.
5. Sum of internal torques:
   $$\sum_{i} \sum_{j \ne i} \mathbf{r}_i \times \mathbf{F}_{ij}^{\text{int}} = \sum_{i < j} (\mathbf{r}_i \times \mathbf{F}_{ij}^{\text{int}} + \mathbf{r}_j \times \mathbf{F}_{ji}^{\text{int}})$$
6. By Newton's Third Law, $\mathbf{F}_{ji}^{\text{int}} = -\mathbf{F}_{ij}^{\text{int}}$.
   $$= \sum_{i < j} (\mathbf{r}_i - \mathbf{r}_j) \times \mathbf{F}_{ij}^{\text{int}}$$
7. If internal forces are central (acting along the line connecting the particles), $(\mathbf{r}_i - \mathbf{r}_j) \parallel \mathbf{F}_{ij}^{\text{int}}$, so the cross product is zero.
8. Thus, internal torques vanish, leaving $\dot{\mathbf{L}} = \sum \mathbf{r}_i \times \mathbf{F}_i^{\text{ext}} = \boldsymbol{\tau}_{\text{ext}}$.

---

### Exercise 1.7
**Problem:** In Mozzi-Charles theorem, show that if $\boldsymbol{\omega} \ne \mathbf{0}$, there exists a unique axis parallel to $\boldsymbol{\omega}$ where the velocity field is purely parallel to $\boldsymbol{\omega}$ (the instantaneous screw axis).
**Solution:**
1. Let the velocity field be $\mathbf{v}(\mathbf{r}) = \mathbf{V}_0 + \boldsymbol{\omega} \times \mathbf{r}$.
2. We seek a line of points $\mathbf{r}_s$ where the velocity $\mathbf{v}(\mathbf{r}_s)$ has no component perpendicular to $\boldsymbol{\omega}$, i.e., $\mathbf{v}(\mathbf{r}_s) = v_\parallel \hat{\boldsymbol{\omega}}$ where $\hat{\boldsymbol{\omega}} = \frac{\boldsymbol{\omega}}{\|\boldsymbol{\omega}\|}$.
3. Condition: $\boldsymbol{\omega} \times \mathbf{v}(\mathbf{r}_s) = \mathbf{0}$.
   $$\boldsymbol{\omega} \times (\mathbf{V}_0 + \boldsymbol{\omega} \times \mathbf{r}_s) = \mathbf{0}$$
   $$\boldsymbol{\omega} \times \mathbf{V}_0 + \boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}_s) = \mathbf{0}$$
4. Vector identity: $\boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}_s) = (\boldsymbol{\omega} \cdot \mathbf{r}_s)\boldsymbol{\omega} - \|\boldsymbol{\omega}\|^2 \mathbf{r}_s$.
5. Choosing the point on the axis closest to the origin ($\mathbf{r}_s \cdot \boldsymbol{\omega} = 0$):
   $$\boldsymbol{\omega} \times \mathbf{V}_0 - \|\boldsymbol{\omega}\|^2 \mathbf{r}_s = \mathbf{0} \implies \mathbf{r}_s = \frac{\boldsymbol{\omega} \times \mathbf{V}_0}{\|\boldsymbol{\omega}\|^2}$$
6. The entire screw axis is given by the line $\mathbf{r}(\lambda) = \mathbf{r}_s + \lambda \hat{\boldsymbol{\omega}}$ for $\lambda \in \mathbb{R}$.

---

### Exercise 1.8
**Problem:** A 3D rigid body has Center of Mass at $(0, 0, 0)$ and is rotating at $\boldsymbol{\omega} = (0, 0, 4)\text{ rad/s}$ with $\mathbf{V}_{\text{cm}} = (0, 0, 0)$. What is the instantaneous velocity of a particle at $(3, 4, 0)\text{ m}$?
**Solution:**
1. Velocity formula: $\mathbf{v} = \mathbf{V}_{\text{cm}} + \boldsymbol{\omega} \times \mathbf{r}'$.
2. Here $\mathbf{V}_{\text{cm}} = \mathbf{0}$, $\boldsymbol{\omega} = (0, 0, 4)$, $\mathbf{r}' = (3, 4, 0)$.
3. Cross product:
   $$\mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix} \times \begin{bmatrix} 3 \\ 4 \\ 0 \end{bmatrix} = \begin{bmatrix} 0(0) - 4(4) \\ 4(3) - 0(0) \\ 0(4) - 0(3) \end{bmatrix} = \begin{bmatrix} -16 \\ 12 \\ 0 \end{bmatrix}\text{ m/s}$$
4. Speed: $v = \sqrt{(-16)^2 + 12^2} = \sqrt{256 + 144} = \sqrt{400} = 20\text{ m/s}$.
5. Notice that $v = \omega r = 4 \times \sqrt{3^2 + 4^2} = 4 \times 5 = 20\text{ m/s}$. The direction $(-16, 12, 0)$ is perpendicular to $(3, 4, 0)$ since $(-16)(3) + (12)(4) = -48 + 48 = 0$.

---

### Exercise 1.9
**Problem:** Prove that the Center of Mass of any planar sheet of uniform density lies inside the convex hull of its geometry.
**Solution:**
1. Let the planar sheet occupy region $\Omega \subset \mathbb{R}^2$ with area $A$.
2. The Center of Mass is $\mathbf{R}_{\text{cm}} = \frac{1}{A}\iint_\Omega \mathbf{r} \, dA$.
3. Any closed half-plane $H = \{\mathbf{r} \in \mathbb{R}^2 : \mathbf{n} \cdot \mathbf{r} \le c\}$ that contains $\Omega$ satisfies $\mathbf{n} \cdot \mathbf{r} \le c$ for all $\mathbf{r} \in \Omega$.
4. Integrating this inequality over $\Omega$:
   $$\mathbf{n} \cdot \mathbf{R}_{\text{cm}} = \frac{1}{A}\iint_\Omega (\mathbf{n} \cdot \mathbf{r}) \, dA \le \frac{1}{A}\iint_\Omega c \, dA = \frac{c A}{A} = c$$
5. Thus $\mathbf{R}_{\text{cm}} \in H$ for every half-plane containing $\Omega$.
6. The convex hull of $\Omega$ is defined as the intersection of all closed half-planes containing $\Omega$.
7. Therefore, $\mathbf{R}_{\text{cm}}$ must lie strictly inside the convex hull of $\Omega$.

---

### Exercise 1.10
**Problem:** In Koenig's Theorem, what is the value of the cross term $\mathbf{V}_{\text{ref}} \cdot \sum m_i \mathbf{v}_i'$ if the reference point is chosen at distance $d$ from the Center of Mass?
**Solution:**
1. Let the reference point be $P$ with position $\mathbf{R}_P$ and velocity $\mathbf{V}_P$.
2. The position of particle $i$ relative to $P$ is $\mathbf{r}_i'' = \mathbf{r}_i - \mathbf{R}_P$.
3. The sum $\sum m_i \mathbf{r}_i'' = \sum m_i (\mathbf{r}_i - \mathbf{R}_P) = M\mathbf{R}_{\text{cm}} - M\mathbf{R}_P = M(\mathbf{R}_{\text{cm}} - \mathbf{R}_P) = M\mathbf{d}$, where $\mathbf{d}$ is the displacement vector from $P$ to the Center of Mass.
4. Differentiating gives the relative momentum:
   $$\sum m_i \mathbf{v}_i'' = M \dot{\mathbf{d}} = M(\mathbf{V}_{\text{cm}} - \mathbf{V}_P)$$
5. The cross term in the kinetic energy expansion becomes:
   $$\text{Cross Term} = \mathbf{V}_P \cdot \left(\sum m_i \mathbf{v}_i''\right) = M \mathbf{V}_P \cdot (\mathbf{V}_{\text{cm}} - \mathbf{V}_P)$$
6. This cross term is non-zero unless $\mathbf{V}_P = \mathbf{0}$ (stationary pivot) or $\mathbf{V}_P = \mathbf{V}_{\text{cm}}$ (the Center of Mass itself). This proves why the Center of Mass is the unique moving origin that cleanly decouples translation from rotation.
