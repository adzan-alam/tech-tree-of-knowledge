# Chapter 04: Center of Mass Kinematics & Dynamics — Koenig’s Theorem, the Zero-Momentum Frame, and Trajectory Invariance

> *"In the chaotic swirl of multi-body motion—where planets orbit, acrobats twist, and artillery shells explode into a thousand jagged shards—there exists a single mathematical point that ignores all internal drama. The Center of Mass moves through space with the serene simplicity of an isolated particle."*

---

## 4.1 The Geometry of Collective Mass

In our study of Newtonian mechanics so far, we have frequently spoken of "a block," "a car," or "a planet" as if they were mathematical point particles. Yet real macroscopic objects are composed of trillions of atoms, and physical systems often consist of multiple loosely bound or interacting bodies.

How can a single equation ($\sum \vec{F} = m\vec{a}$) describe an extended object like a spinning wrench tumbling through the air, or a gymnast executing a triple somersault?

The answer lies in one of the most powerful concepts in classical physics: the **Center of Mass** ($\vec{R}_{\text{CM}}$). The center of mass is the unique mass-weighted average spatial coordinate of a system of particles:

$$\vec{R}_{\text{CM}} \equiv \frac{\sum_{i=1}^N m_i \vec{r}_i}{\sum_{i=1}^N m_i} = \frac{1}{M_{\text{total}}} \sum_{i=1}^N m_i \vec{r}_i$$

where $M_{\text{total}} = \sum_{i=1}^N m_i$ is the total mass of the system.

In Cartesian coordinates:

$$X_{\text{CM}} = \frac{\sum m_i x_i}{M_{\text{total}}}, \quad Y_{\text{CM}} = \frac{\sum m_i y_i}{M_{\text{total}}}, \quad Z_{\text{CM}} = \frac{\sum m_i z_i}{M_{\text{total}}}$$

```
                ^ +Y
                |              * Particle 2 (m2, r2)
                |             /
                |            /   R_CM (Center of Mass)
                |           /     x
                |   (m1) * '     /
                |         \     /
                |          \   /
                |           \ /  * Particle 3 (m3, r3)
                +------------+--------------------------> +X
```

### Continuous Mass Distributions
For continuous solid bodies with spatial mass density $\rho(\vec{r})$, the discrete summation transforms into a volume integral:

$$\vec{R}_{\text{CM}} = \frac{1}{M_{\text{total}}} \int \vec{r} \, dm = \frac{1}{M_{\text{total}}} \iiint_V \vec{r} \rho(\vec{r}) \, dV$$

For uniform symmetrical geometries (spheres, cylinders, rectangular slabs), the center of mass coincides exactly with the geometric centroid.

---

## 4.2 The Fundamental Theorem of Center-of-Mass Motion

What happens when we differentiate the position of the center of mass with respect to time?

### 1. Center of Mass Velocity ($\vec{V}_{\text{CM}}$)
Take the first time derivative of $\vec{R}_{\text{CM}}$:

$$\vec{V}_{\text{CM}} = \frac{d\vec{R}_{\text{CM}}}{dt} = \frac{1}{M_{\text{total}}} \sum_{i=1}^N m_i \frac{d\vec{r}_i}{dt} = \frac{1}{M_{\text{total}}} \sum_{i=1}^N m_i \vec{v}_i$$

Notice the numerator: $\sum_{i=1}^N m_i \vec{v}_i$ is precisely the **total linear momentum** $\vec{P}_{\text{total}}$ of the system!

$$\vec{V}_{\text{CM}} = \frac{\vec{P}_{\text{total}}}{M_{\text{total}}} \iff \vec{P}_{\text{total}} = M_{\text{total}} \vec{V}_{\text{CM}}$$

**The Momentum-Velocity Equivalence:**
> *The total linear momentum of any complex multi-body system is identically equal to the total mass of the system multiplied by the velocity of its center of mass.*

### 2. Center of Mass Acceleration ($\vec{A}_{\text{CM}}$)
Now take the second time derivative:

$$\vec{A}_{\text{CM}} = \frac{d\vec{V}_{\text{CM}}}{dt} = \frac{1}{M_{\text{total}}} \frac{d\vec{P}_{\text{total}}}{dt}$$

From Chapter 01 (Section 1.5), we proved that the time rate of change of total momentum equals the sum of external forces, because all internal forces cancel in pairs via Newton’s Third Law:

$$\frac{d\vec{P}_{\text{total}}}{dt} = \sum \vec{F}_{\text{ext}}$$

Multiplying both sides by $M_{\text{total}}$:

$$M_{\text{total}} \vec{A}_{\text{CM}} = \sum \vec{F}_{\text{ext}}$$

**The Grand Center-of-Mass Theorem:**
> *The center of mass of any physical system—regardless of whether it is rigid, flexible, fluid, rotating, or exploding—accelerates through space as if the entire mass of the system were concentrated at that single geometric point and all external forces were applied directly to it!*

---

## 4.3 The Trajectory Invariance Theorem

Consider an artillery shell fired into the air. In the absence of an explosion, its center of mass traces an ordinary parabolic trajectory under gravity:

$$\vec{R}_{\text{CM}}(t) = \vec{R}_0 + \vec{V}_0 t - \frac{1}{2} g t^2 \,\hat{j}$$

Now suppose that halfway along its flight, an internal charge detonates, violently shattering the shell into hundreds of fragments that scatter in all directions.

```
                  Apex (Detonation Point)
                           ( * )
                         . ' | ` .
                       . '   |   ` .    Fragment Trajectories
                     . '     |     ` .  (Scattered violently)
                   . '       |       ` .
                 . '         v         ` .
               . '     - - - - - - - - - ` .
             .'                             `.
            *                                 *
          Launch                           Impacts
          ---------------------------------------------------
          [ The Center of Mass (o) continues along the UNBROKEN parabola! ]
```

What happens to the center of mass after the explosion?
Because the explosive blast is produced entirely by internal chemical forces:

$$\sum \vec{F}_{\text{int}} \equiv \vec{0}$$

The only external force acting on the collection of flying fragments remains the uniform downward pull of Earth's gravity:

$$\sum \vec{F}_{\text{ext}} = \sum m_i \vec{g} = M_{\text{total}} \vec{g}$$

Therefore:

$$\vec{A}_{\text{CM}} = \vec{g} = -g\,\hat{j}$$

**The Trajectory Invariance Theorem:**
> *Until the very first fragment strikes the ground or encounters an external obstacle, the center of mass of the exploding fragments continues along the exact, uninterrupted original parabolic trajectory as if the explosion had never occurred!*

If you calculate the mass-weighted average position of every fragment at any instant after detonation, that point lies precisely where the unexploded shell would have been at that millisecond.

---

## 4.4 The Center-of-Mass (Zero-Momentum) Reference Frame

In analytical mechanics, we frequently shift our perspective from the stationary laboratory frame ($S$) to a reference frame attached to the moving center of mass ($S_{\text{CM}}$), also termed the **Zero-Momentum Frame** or **C-Frame**.

### Galilean Coordinate and Velocity Transformations
Let $\vec{r}_i$ and $\vec{v}_i$ be the position and velocity of particle $i$ in the laboratory frame.
Let $\vec{r}'_i$ and $\vec{v}'_i$ be the corresponding coordinates in the C-frame moving at velocity $\vec{V}_{\text{CM}}$:

$$\vec{r}'_i = \vec{r}_i - \vec{R}_{\text{CM}}$$

$$\vec{v}'_i = \vec{v}_i - \vec{V}_{\text{CM}}$$

### The Zero-Momentum Identity
Let us calculate the total linear momentum in the C-frame:

$$\vec{P}'_{\text{total}} = \sum_{i=1}^N m_i \vec{v}'_i = \sum_{i=1}^N m_i (\vec{v}_i - \vec{V}_{\text{CM}}) = \sum_{i=1}^N m_i \vec{v}_i - \left(\sum_{i=1}^N m_i\right) \vec{V}_{\text{CM}}$$

Since $\sum m_i \vec{v}_i = \vec{P}_{\text{total}}$ and $\sum m_i = M_{\text{total}}$:

$$\vec{P}'_{\text{total}} = \vec{P}_{\text{total}} - M_{\text{total}} \vec{V}_{\text{CM}} = \vec{P}_{\text{total}} - \vec{P}_{\text{total}} \equiv \vec{0}$$

In the center-of-mass frame, the total linear momentum is **identically zero at all times**:

$$\vec{P}'_{\text{total}} \equiv \vec{0}$$

For a two-body system in the C-frame:

$$m_1 \vec{v}'_1 + m_2 \vec{v}'_2 = \vec{0} \implies \vec{p}'_1 = -\vec{p}'_2$$

In the C-frame, two colliding particles always move directly toward each other with **equal and opposite collinear momenta**, regardless of how asymmetric their masses or velocities appear in the laboratory frame! This symmetry makes collision analysis dramatically simpler.

---

## 4.5 Koenig’s Theorem for Kinetic Energy

How does the total kinetic energy of a multi-body system transform between the laboratory frame and the center-of-mass frame?

In the laboratory frame, total kinetic energy is:

$$K_{\text{lab}} = \sum_{i=1}^N \frac{1}{2} m_i v_i^2 = \sum_{i=1}^N \frac{1}{2} m_i (\vec{v}_i \cdot \vec{v}_i)$$

Substitute $\vec{v}_i = \vec{V}_{\text{CM}} + \vec{v}'_i$:

$$K_{\text{lab}} = \sum_{i=1}^N \frac{1}{2} m_i \left( \vec{V}_{\text{CM}} + \vec{v}'_i \right) \cdot \left( \vec{V}_{\text{CM}} + \vec{v}'_i \right)$$

$$K_{\text{lab}} = \sum_{i=1}^N \frac{1}{2} m_i \left( V_{\text{CM}}^2 + 2 \vec{V}_{\text{CM}} \cdot \vec{v}'_i + \|\vec{v}'_i\|^2 \right)$$

Expand into three distinct summations:

$$K_{\text{lab}} = \frac{1}{2}\left(\sum_{i=1}^N m_i\right) V_{\text{CM}}^2 + \vec{V}_{\text{CM}} \cdot \left(\sum_{i=1}^N m_i \vec{v}'_i\right) + \sum_{i=1}^N \frac{1}{2} m_i \|\vec{v}'_i\|^2$$

Now examine each term carefully:
1. $\sum m_i = M_{\text{total}}$, so the first term is $\frac{1}{2} M_{\text{total}} V_{\text{CM}}^2$. This is the kinetic energy of the system as a whole translating through space.
2. The cross-term contains $\sum m_i \vec{v}'_i$, which is the total momentum in the C-frame. But we just proved that $\vec{P}'_{\text{total}} \equiv \vec{0}$! Thus, the cross-term **vanishes identically**:
   $$\vec{V}_{\text{CM}} \cdot \vec{P}'_{\text{total}} = \vec{V}_{\text{CM}} \cdot \vec{0} = 0$$
3. The third term is the internal kinetic energy of particles relative to the center of mass: $K_{\text{rel}} = K_{\text{int}}$.

This establishes **Koenig’s Theorem**:

$$K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}} = \frac{1}{2} M_{\text{total}} V_{\text{CM}}^2 + \sum_{i=1}^N \frac{1}{2} m_i \|\vec{v}'_i\|^2$$

```
   +-------------------------------------------------------------------------------+
   |                             KOENIG'S THEOREM                                  |
   |              K_lab       =       K_CM        +       K_int                    |
   |        (Total Lab Energy)   (Translational)     (Internal / Deformable)       |
   +-------------------------------------------------------------------------------+
```

### The Two-Body Reduced Mass Simplification
For a two-body system ($m_1$ and $m_2$) with relative velocity $\vec{v}_{\text{rel}} = \vec{v}_1 - \vec{v}_2$:
- Velocity of particle 1 in C-frame: $\vec{v}'_1 = \frac{m_2}{m_1 + m_2} \vec{v}_{\text{rel}}$
- Velocity of particle 2 in C-frame: $\vec{v}'_2 = -\frac{m_1}{m_1 + m_2} \vec{v}_{\text{rel}}$

Substituting these into the internal kinetic energy:

$$K_{\text{int}} = \frac{1}{2} m_1 \left( \frac{m_2}{m_1 + m_2} v_{\text{rel}} \right)^2 + \frac{1}{2} m_2 \left( \frac{m_1}{m_1 + m_2} v_{\text{rel}} \right)^2 = \frac{1}{2} \left( \frac{m_1 m_2^2 + m_2 m_1^2}{(m_1 + m_2)^2} \right) v_{\text{rel}}^2$$

$$K_{\text{int}} = \frac{1}{2} \left( \frac{m_1 m_2 (m_1 + m_2)}{(m_1 + m_2)^2} \right) v_{\text{rel}}^2 = \frac{1}{2} \left( \frac{m_1 m_2}{m_1 + m_2} \right) v_{\text{rel}}^2$$

Defining the **Reduced Mass** $\mu$:

$$\mu \equiv \frac{m_1 m_2}{m_1 + m_2}$$

we obtain the compact, elegant result:

$$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2$$

$$K_{\text{lab}} = \frac{1}{2} M_{\text{total}} V_{\text{CM}}^2 + \frac{1}{2} \mu v_{\text{rel}}^2$$

**The Deep Meaning of Koenig's Theorem:**
In an isolated collision, momentum conservation dictates that $V_{\text{CM}}$ is strictly constant. Therefore, **$K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2$ is completely untouchable and irreducible!** No collision, no matter how violent or inelastic, can ever convert $K_{\text{CM}}$ into heat. Only the internal kinetic energy $K_{\text{int}} = \frac{1}{2}\mu v_{\text{rel}}^2$ is available for structural crumpling, plastic deformation, or thermal dissipation.

---

## 4.6 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 4.1: Discrete 2D Center of Mass Calculation
**Problem:** Four robotic tracking nodes are located at coordinates in a coordinate plane:
- Node 1: $m_1 = 2.00\,\text{kg}$ at $(1.00, 2.00)\,\text{m}$.
- Node 2: $m_2 = 3.00\,\text{kg}$ at $(4.00, 6.00)\,\text{m}$.
- Node 3: $m_3 = 5.00\,\text{kg}$ at $(-2.00, 3.00)\,\text{m}$.
- Node 4: $m_4 = 6.00\,\text{kg}$ at $(3.00, -1.00)\,\text{m}$.
Calculate the Center of Mass coordinates $(X_{\text{CM}}, Y_{\text{CM}})$.

**Solution:**
- **Step 1: Total mass**
  $$M_{\text{total}} = 2.00 + 3.00 + 5.00 + 6.00 = 16.00\,\text{kg}$$

- **Step 2: X-coordinate calculation**
  $$\sum m_i x_i = (2.00)(1.00) + (3.00)(4.00) + (5.00)(-2.00) + (6.00)(3.00)$$
  $$\sum m_i x_i = 2.00 + 12.00 - 10.00 + 18.00 = 22.00\,\text{kg}\cdot\text{m}$$
  $$X_{\text{CM}} = \frac{22.00\,\text{kg}\cdot\text{m}}{16.00\,\text{kg}} = 1.375\,\text{m}$$

- **Step 3: Y-coordinate calculation**
  $$\sum m_i y_i = (2.00)(2.00) + (3.00)(6.00) + (5.00)(3.00) + (6.00)(-1.00)$$
  $$\sum m_i y_i = 4.00 + 18.00 + 15.00 - 6.00 = 31.00\,\text{kg}\cdot\text{m}$$
  $$Y_{\text{CM}} = \frac{31.00\,\text{kg}\cdot\text{m}}{16.00\,\text{kg}} = 1.9375\,\text{m}$$
  $$\vec{R}_{\text{CM}} = (1.375, 1.938)\,\text{m}$$

---

### Example 4.2: Center of Mass of a Non-Uniform Rod
**Problem:** A metal rod of length $L = 2.00\,\text{m}$ has a non-uniform linear mass density that increases linearly from one end:
$$\lambda(x) = \lambda_0 \left(1 + \frac{2x}{L}\right), \quad 0 \le x \le L$$
where $\lambda_0 = 3.00\,\text{kg/m}$.
1. Compute the total mass $M$ of the rod.
2. Determine the location of the center of mass $X_{\text{CM}}$.

**Solution:**
- **Step 1: Total mass integration**
  $$M = \int_0^L \lambda(x) \, dx = \lambda_0 \int_0^L \left(1 + \frac{2x}{L}\right) dx = \lambda_0 \left[ x + \frac{x^2}{L} \right]_0^L = \lambda_0 (L + L) = 2 \lambda_0 L$$
  $$M = 2(3.00\,\text{kg/m})(2.00\,\text{m}) = 12.00\,\text{kg}$$

- **Step 2: Center of mass calculation**
  $$\int_0^L x \lambda(x) \, dx = \lambda_0 \int_0^L \left(x + \frac{2x^2}{L}\right) dx = \lambda_0 \left[ \frac{x^2}{2} + \frac{2x^3}{3L} \right]_0^L = \lambda_0 \left( \frac{L^2}{2} + \frac{2L^2}{3} \right) = \lambda_0 L^2 \left(\frac{3+4}{6}\right) = \frac{7}{6} \lambda_0 L^2$$
  $$X_{\text{CM}} = \frac{\int_0^L x \lambda(x) \, dx}{M} = \frac{\frac{7}{6} \lambda_0 L^2}{2 \lambda_0 L} = \frac{7}{12} L$$
  Numerical evaluation:
  $$X_{\text{CM}} = \frac{7}{12}(2.00\,\text{m}) = \frac{14.0}{12} = 1.1667\,\text{m}$$
  The center of mass is shifted toward the heavier end ($1.17\,\text{m}$ from $x = 0$, past the geometric midpoint of $1.00\,\text{m}$).

---

### Example 4.3: Binary Star Center of Mass and Orbital Radii
**Problem:** A binary star system consists of Star Alpha ($M_1 = 3.00 \times 10^{30}\,\text{kg} \approx 1.5\,M_\odot$) and Star Beta ($M_2 = 1.00 \times 10^{30}\,\text{kg} \approx 0.5\,M_\odot$) separated by a constant orbital distance $D = 8.00 \times 10^8\,\text{km}$.
1. Find the distance $r_1$ and $r_2$ of each star from their common barycenter (center of mass).
2. If both stars orbit their barycenter in circular paths with period $T = 4.50\,\text{years} = 1.42 \times 10^8\,\text{s}$, compute their orbital speeds $v_1$ and $v_2$, and verify momentum cancellation.

**Solution:**
- **Step 1: Distance from barycenter**
  Let the barycenter be the origin ($r_{\text{CM}} = 0$):
  $$M_1 r_1 = M_2 r_2$$
  Since $r_1 + r_2 = D \implies r_2 = D - r_1$:
  $$M_1 r_1 = M_2 (D - r_1) \implies (M_1 + M_2) r_1 = M_2 D$$
  $$r_1 = \frac{M_2}{M_1 + M_2} D = \frac{1.00}{3.00 + 1.00} (8.00 \times 10^8\,\text{km}) = \frac{1}{4}(8.00 \times 10^8) = 2.00 \times 10^8\,\text{km}$$
  $$r_2 = D - r_1 = 8.00 \times 10^8 - 2.00 \times 10^8 = 6.00 \times 10^8\,\text{km}$$

- **Step 2: Orbital speeds and momentum check**
  $$v_1 = \frac{2\pi r_1}{T} = \frac{2\pi (2.00 \times 10^{11}\,\text{m})}{1.42 \times 10^8\,\text{s}} = \frac{1.2566 \times 10^{12}}{1.42 \times 10^8} = 8849.6\,\text{m/s} \approx 8.85\,\text{km/s}$$
  $$v_2 = \frac{2\pi r_2}{T} = \frac{2\pi (6.00 \times 10^{11}\,\text{m})}{1.42 \times 10^8\,\text{s}} = 3 v_1 = 26,548.7\,\text{m/s} \approx 26.55\,\text{km/s}$$
  - Momentum of Star 1:
    $$p_1 = M_1 v_1 = (3.00 \times 10^{30}\,\text{kg})(8849.6\,\text{m/s}) = 2.655 \times 10^{34}\,\text{kg}\cdot\text{m/s}$$
  - Momentum of Star 2:
    $$p_2 = M_2 v_2 = (1.00 \times 10^{30}\,\text{kg})(26,548.7\,\text{m/s}) = 2.655 \times 10^{34}\,\text{kg}\cdot\text{m/s}$$
  Since the stars are always on opposite sides of the barycenter, their velocity vectors oppose each other:
  $$\vec{p}_1 + \vec{p}_2 = \vec{0}$$
  The total linear momentum in the barycentric frame is identically zero!

---

### Example 4.4: Exploding Projectile Landing Distance
**Problem:** A mortar shell of mass $M = 10.0\,\text{kg}$ is launched from flat ground with initial speed $v_0 = 80.0\,\text{m/s}$ at angle $\theta = 45.0^\circ$. At the exact peak of its trajectory, the shell explodes into two equal fragments of $m_1 = m_2 = 5.00\,\text{kg}$. Fragment 1 has zero horizontal velocity immediately after the blast ($v_{1x} = 0$) and drops straight down to the ground. Take $g = 9.81\,\text{m/s}^2$.
1. Calculate the normal range $R_{\text{orig}}$ where the shell would have landed without an explosion.
2. Determine where Fragment 1 lands.
3. Using the Center of Mass Trajectory Invariance Theorem, determine where Fragment 2 lands ($x_2$).

**Solution:**
- **Step 1: Unexploded range**
  $$\sin(2\theta) = \sin(90.0^\circ) = 1.00$$
  $$R_{\text{orig}} = \frac{v_0^2 \sin(2\theta)}{g} = \frac{(80.0\,\text{m/s})^2 (1.00)}{9.81\,\text{m/s}^2} = \frac{6400.0}{9.81} = 652.395\,\text{m}$$
  Apex location:
  $$x_{\text{apex}} = \frac{R_{\text{orig}}}{2} = \frac{652.395}{2} = 326.198\,\text{m}$$

- **Step 2: Landing site of Fragment 1**
  Because Fragment 1 loses all horizontal velocity, it falls vertically straight down from the apex:
  $$x_1 = x_{\text{apex}} = 326.20\,\text{m}$$

- **Step 3: Landing site of Fragment 2 via Center-of-Mass Invariance**
  Both fragments fall from the same height with zero initial vertical velocity, so they hit the ground at the **exact same instant**!
  At the landing instant, the Center of Mass must be at the original range:
  $$X_{\text{CM}} = R_{\text{orig}} = 652.395\,\text{m}$$
  By definition of Center of Mass:
  $$X_{\text{CM}} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \frac{5.00 x_1 + 5.00 x_2}{10.00} = \frac{x_1 + x_2}{2}$$
  $$R_{\text{orig}} = \frac{x_1 + x_2}{2} \implies x_2 = 2 R_{\text{orig}} - x_1$$
  $$x_2 = 2(652.395\,\text{m}) - 326.198\,\text{m} = 1304.79 - 326.20 = 978.59\,\text{m}$$
  Fragment 2 lands nearly a kilometer downrange ($978.6\,\text{m}$), exactly three times farther than Fragment 1!

---

### Example 4.5: Koenig’s Theorem Verification
**Problem:** In the laboratory frame:
- Particle 1 ($m_1 = 3.00\,\text{kg}$) moves at $\vec{v}_1 = +6.00\,\hat{i}\,\text{m/s}$.
- Particle 2 ($m_2 = 1.00\,\text{kg}$) moves at $\vec{v}_2 = -2.00\,\hat{i}\,\text{m/s}$.
1. Compute the total kinetic energy in the laboratory frame $K_{\text{lab}}$.
2. Determine the center of mass velocity $V_{\text{CM}}$.
3. Compute the velocities $\vec{v}'_1$ and $\vec{v}'_2$ in the center of mass frame.
4. Calculate $K_{\text{CM}}$ and $K_{\text{int}}$, and verify that $K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}}$.

**Solution:**
- **Step 1: Direct laboratory kinetic energy**
  $$K_1 = \frac{1}{2} m_1 v_1^2 = \frac{1}{2}(3.00\,\text{kg})(6.00\,\text{m/s})^2 = 1.50 \times 36.0 = 54.0\,\text{J}$$
  $$K_2 = \frac{1}{2} m_2 v_2^2 = \frac{1}{2}(1.00\,\text{kg})(-2.00\,\text{m/s})^2 = 0.50 \times 4.0 = 2.0\,\text{J}$$
  $$K_{\text{lab}} = K_1 + K_2 = 54.0 + 2.0 = 56.0\,\text{J}$$

- **Step 2: Center of mass velocity**
  $$M = m_1 + m_2 = 3.00 + 1.00 = 4.00\,\text{kg}$$
  $$P_{\text{total}} = m_1 v_1 + m_2 v_2 = (3.00)(6.00) + (1.00)(-2.00) = 18.0 - 2.0 = +16.0\,\text{kg}\cdot\text{m/s}$$
  $$V_{\text{CM}} = \frac{P_{\text{total}}}{M} = \frac{16.0\,\text{kg}\cdot\text{m/s}}{4.00\,\text{kg}} = +4.00\,\text{m/s}$$

- **Step 3: Velocities in C-frame**
  $$v'_1 = v_1 - V_{\text{CM}} = 6.00 - 4.00 = +2.00\,\text{m/s}$$
  $$v'_2 = v_2 - V_{\text{CM}} = -2.00 - 4.00 = -6.00\,\text{m/s}$$
  *Check Momentum in C-frame:*
  $$p'_1 = m_1 v'_1 = (3.00)(+2.00) = +6.00\,\text{kg}\cdot\text{m/s}$$
  $$p'_2 = m_2 v'_2 = (1.00)(-6.00) = -6.00\,\text{kg}\cdot\text{m/s}$$
  $$p'_1 + p'_2 = 0$$. Verified!

- **Step 4: Energy partition verification**
  - Center of mass kinetic energy:
    $$K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2 = \frac{1}{2}(4.00\,\text{kg})(4.00\,\text{m/s})^2 = 2.00 \times 16.0 = 32.0\,\text{J}$$
  - Internal kinetic energy:
    $$K_{\text{int}} = \frac{1}{2} m_1 (v'_1)^2 + \frac{1}{2} m_2 (v'_2)^2 = \frac{1}{2}(3.00)(2.00)^2 + \frac{1}{2}(1.00)(-6.00)^2 = 6.00 + 18.00 = 24.0\,\text{J}$$
    *Check via reduced mass:*
    $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(3.00)(1.00)}{4.00} = 0.750\,\text{kg}$$
    $$v_{\text{rel}} = v_1 - v_2 = 6.00 - (-2.00) = 8.00\,\text{m/s}$$
    $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(0.750)(8.00)^2 = 0.375 \times 64.0 = 24.0\,\text{J}$$
  - Sum:
    $$K_{\text{CM}} + K_{\text{int}} = 32.0\,\text{J} + 24.0\,\text{J} = 56.0\,\text{J} \equiv K_{\text{lab}}$$
  Koenig’s Theorem is verified with mathematical perfection.

---

### Example 4.6: Astronaut and Tethered Satellite Rotation
**Problem:** An astronaut of mass $m_1 = 90.0\,\text{kg}$ and a small communications satellite of mass $m_2 = 30.0\,\text{kg}$ are tethered by an inextensible cord of length $L = 20.0\,\text{m}$. Both are rotating in deep space about their common center of mass at constant angular frequency $\omega = 0.500\,\text{rad/s}$.
1. Find the distance of the astronaut ($r_1$) and satellite ($r_2$) from the rotation center.
2. Determine their linear speeds $v_1$ and $v_2$.
3. Compute the tension $T$ in the connecting tether.

**Solution:**
- **Step 1: Distances from center of mass**
  $$r_1 = \frac{m_2}{m_1 + m_2} L = \frac{30.0}{90.0 + 30.0} (20.0\,\text{m}) = \frac{30.0}{120.0}(20.0) = 5.00\,\text{m}$$
  $$r_2 = L - r_1 = 20.0 - 5.00 = 15.00\,\text{m}$$

- **Step 2: Linear speeds**
  $$v_1 = \omega r_1 = (0.500\,\text{rad/s})(5.00\,\text{m}) = 2.50\,\text{m/s}$$
  $$v_2 = \omega r_2 = (0.500\,\text{rad/s})(15.00\,\text{m}) = 7.50\,\text{m/s}$$

- **Step 3: Tether tension**
  Tether tension provides the centripetal force for each body:
  - For astronaut:
    $$T = m_1 \omega^2 r_1 = (90.0\,\text{kg})(0.500\,\text{rad/s})^2 (5.00\,\text{m}) = (90.0)(0.250)(5.00) = 112.50\,\text{N}$$
  - For satellite:
    $$T = m_2 \omega^2 r_2 = (30.0\,\text{kg})(0.500\,\text{rad/s})^2 (15.00\,\text{m}) = (30.0)(0.250)(15.00) = 112.50\,\text{N}$$
  Both calculations agree identically: $T = 112.5\,\text{N}$.

---

### Example 4.7: Relocating the Center of Mass by Cutouts
**Problem:** A uniform solid circular disc of radius $R = 0.600\,\text{m}$ and uniform areal mass density $\sigma = 10.0\,\text{kg/m}^2$ is centered at the origin $(0, 0)$. A circular hole of radius $r = 0.200\,\text{m}$ is punched out of the disc, centered at $(x = +0.300\,\text{m}, y = 0)$.
Determine the new Center of Mass coordinates $(X_{\text{CM}}, Y_{\text{CM}})$ of the remaining pierced disc.

**Solution:**
- **Step 1: The negative mass method**
  We treat the pierced disc as the superposition of:
  1. A complete solid disc of radius $R$ and mass $+M_1$ centered at $(0, 0)$.
  2. A cutout circular disc of radius $r$ with "negative mass" $-M_2$ centered at $(+0.300, 0)\,\text{m}$.
- **Step 2: Masses of components**
  $$M_1 = \sigma (\pi R^2) = \sigma \pi (0.600)^2 = 0.360 \pi \sigma$$
  $$M_2 = \sigma (\pi r^2) = \sigma \pi (0.200)^2 = 0.040 \pi \sigma$$
  Net mass of pierced disc:
  $$M_{\text{net}} = M_1 - M_2 = 0.360\pi\sigma - 0.040\pi\sigma = 0.320\pi\sigma$$

- **Step 3: Center of mass calculation**
  By symmetry along the $x$-axis, $Y_{\text{CM}} = 0$.
  $$X_{\text{CM}} = \frac{M_1 X_1 - M_2 X_2}{M_1 - M_2} = \frac{(0.360\pi\sigma)(0) - (0.040\pi\sigma)(+0.300\,\text{m})}{0.320\pi\sigma}$$
  Canceling $\pi\sigma$:
  $$X_{\text{CM}} = \frac{-(0.040)(0.300)}{0.320} = -\frac{0.0120}{0.320} = -0.0375\,\text{m} = -3.75\,\text{cm}$$
  The removal of mass on the right shifts the center of mass $3.75\,\text{cm}$ to the left ($X_{\text{CM}} = -0.0375\,\text{m}$).

---

### Example 4.8: Two Blocks on Ice Connected by an Expanding Spring
**Problem:** Two blocks of mass $m_1 = 1.50\,\text{kg}$ and $m_2 = 4.50\,\text{kg}$ sit on a frictionless horizontal table. Between them is a compressed spring storing $U_s = 48.0\,\text{J}$ of elastic potential energy. The latch is released, pushing the blocks apart.
1. Compute the final speeds $v_1$ and $v_2$ of the blocks in the laboratory frame after the spring detaches.
2. What is the velocity of the center of mass during and after the expansion?

**Solution:**
- **Step 1: Momentum conservation**
  Initial state is at rest ($V_{\text{CM}} = 0$):
  $$m_1 v_1 + m_2 v_2 = 0 \implies v_1 = -\frac{m_2}{m_1} v_2 = -\frac{4.50}{1.50} v_2 = -3.00 v_2$$

- **Step 2: Energy conservation**
  The elastic potential energy transforms entirely into kinetic energy:
  $$U_s = \frac{1}{2} m_1 v_1^2 + \frac{1}{2} m_2 v_2^2$$
  Substitute $v_1 = -3.00 v_2$:
  $$48.0 = \frac{1}{2}(1.50)(-3.00 v_2)^2 + \frac{1}{2}(4.50) v_2^2 = 0.75(9.00 v_2^2) + 2.25 v_2^2 = 6.75 v_2^2 + 2.25 v_2^2 = 9.00 v_2^2$$
  $$v_2^2 = \frac{48.0}{9.00} = 5.3333\,\text{m}^2/\text{s}^2 \implies v_2 = \sqrt{5.3333} = 2.3094\,\text{m/s}$$
  Speed of Block 1:
  $$v_1 = 3.00 v_2 = 3.00(2.3094) = 6.9282\,\text{m/s}$$

- **Step 3: Center of mass velocity**
  $$V_{\text{CM}} = \frac{m_1 v_1 + m_2 v_2}{m_1 + m_2} = \frac{(1.50)(-6.9282) + (4.50)(+2.3094)}{6.00} = \frac{-10.392 + 10.392}{6.00} \equiv 0\,\text{m/s}$$
  The center of mass remains permanently stationary!

---

### Example 4.9: Accelerating Multi-Body System with External Pulley Load
**Problem:** Two blocks $m_1 = 4.00\,\text{kg}$ and $m_2 = 6.00\,\text{kg}$ sit on a frictionless table, connected by a cord. A horizontal pulling force $F = 50.0\,\text{N}$ is applied to $m_2$.
1. Compute the acceleration of the center of mass $A_{\text{CM}}$.
2. Determine the common acceleration $a$ of the individual blocks and verify that $A_{\text{CM}} \equiv a$.
3. Compute the internal tension $T$ in the connecting cord.

**Solution:**
- **Step 1: Center of mass acceleration**
  Total mass $M = m_1 + m_2 = 4.00 + 6.00 = 10.00\,\text{kg}$.
  Total external horizontal force: $\sum F_{\text{ext}} = F = 50.0\,\text{N}$.
  $$A_{\text{CM}} = \frac{\sum F_{\text{ext}}}{M} = \frac{50.0\,\text{N}}{10.00\,\text{kg}} = 5.00\,\text{m/s}^2$$

- **Step 2: Individual block accelerations**
  Since the cord is inextensible, both blocks share common acceleration $a$:
  $$F = (m_1 + m_2) a \implies a = \frac{50.0}{10.00} = 5.00\,\text{m/s}^2 \equiv A_{\text{CM}}$$

- **Step 3: Cord tension**
  Cord tension accelerates $m_1$:
  $$T = m_1 a = (4.00\,\text{kg})(5.00\,\text{m/s}^2) = 20.0\,\text{N}$$
  Check on $m_2$: $F - T = 50.0 - 20.0 = 30.0\,\text{N} = m_2 a = (6.00)(5.00) = 30.0\,\text{N}$. Verified.

---

### Example 4.10: Maximum Internal Energy Conversion in Inelastic Collisions
**Problem:** A space junk collision occurs between Fragment A ($m_1 = 10.0\,\text{kg}$, moving at $\vec{v}_1 = +30.0\,\hat{i}\,\text{m/s}$) and Fragment B ($m_2 = 40.0\,\text{kg}$, moving at $\vec{v}_2 = -10.0\,\hat{i}\,\text{m/s}$). The fragments collide and weld together into a single composite mass.
1. Calculate the initial laboratory kinetic energy $K_{\text{lab}}$.
2. Compute the velocity of the center of mass $V_{\text{CM}}$ and the irreducible translational energy $K_{\text{CM}}$.
3. Compute the internal energy $K_{\text{int}}$ using the reduced mass formula.
4. Verify that the thermal and deformation energy generated by the weld equals exactly $K_{\text{int}}$.

**Solution:**
- **Step 1: Initial laboratory kinetic energy**
  $$K_A = \frac{1}{2}(10.0)(30.0)^2 = 5.0 \times 900 = 4500.0\,\text{J}$$
  $$K_B = \frac{1}{2}(40.0)(-10.0)^2 = 20.0 \times 100 = 2000.0\,\text{J}$$
  $$K_{\text{lab}} = 4500.0 + 2000.0 = 6500.0\,\text{J}$$

- **Step 2: Center of mass velocity and $K_{\text{CM}}$**
  $$M = 10.0 + 40.0 = 50.0\,\text{kg}$$
  $$P_{\text{total}} = (10.0)(+30.0) + (40.0)(-10.0) = 300.0 - 400.0 = -100.0\,\text{kg}\cdot\text{m/s}$$
  $$V_{\text{CM}} = \frac{-100.0\,\text{kg}\cdot\text{m/s}}{50.0\,\text{kg}} = -2.00\,\text{m/s}$$
  $$K_{\text{CM}} = \frac{1}{2} M V_{\text{CM}}^2 = \frac{1}{2}(50.0\,\text{kg})(-2.00\,\text{m/s})^2 = 25.0 \times 4.00 = 100.0\,\text{J}$$

- **Step 3: Internal energy via reduced mass**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(10.0)(40.0)}{50.0} = 8.00\,\text{kg}$$
  $$v_{\text{rel}} = v_1 - v_2 = +30.0 - (-10.0) = 40.0\,\text{m/s}$$
  $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(8.00\,\text{kg})(40.0\,\text{m/s})^2 = 4.00 \times 1600.0 = 6400.0\,\text{J}$$

- **Step 4: Energy dissipation verification**
  After the collision, the welded body moves at $V_{\text{CM}} = -2.00\,\text{m/s}$.
  Its final kinetic energy is:
  $$K_{\text{final}} = \frac{1}{2} M V_{\text{CM}}^2 = 100.0\,\text{J} \equiv K_{\text{CM}}$$
  Energy converted into heat and metal deformation:
  $$\Delta K_{\text{loss}} = K_{\text{lab}} - K_{\text{final}} = 6500.0\,\text{J} - 100.0\,\text{J} = 6400.0\,\text{J} \equiv K_{\text{int}}$$
  The entire internal kinetic energy $K_{\text{int}} = 6400\,\text{J}$ ($98.46\%$ of total system energy) was destroyed, leaving only the irreducible $K_{\text{CM}} = 100\,\text{J}$!

---

## 4.7 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 4.8.

### Tier 1: Discrete Center of Mass
- **Exercise 4.1:** Two particles $m_1 = 3.00\,\text{kg}$ at $x_1 = 2.00\,\text{m}$ and $m_2 = 7.00\,\text{kg}$ at $x_2 = 8.00\,\text{m}$ lie on the $x$-axis. Find $X_{\text{CM}}$.
- **Exercise 4.2:** Three masses are placed at the vertices of an equilateral triangle of side $L = 1.00\,\text{m}$: $m_1 = 1.00\,\text{kg}$ at $(0, 0)$, $m_2 = 2.00\,\text{kg}$ at $(1.00, 0)$, and $m_3 = 3.00\,\text{kg}$ at $(0.500, \sqrt{3}/2)$. Compute $(X_{\text{CM}}, Y_{\text{CM}})$.

### Tier 2: Continuous Symmetries & Cutouts
- **Exercise 4.3:** Find the center of mass of a uniform thin semicircular wire of radius $R$ centered at the origin lying in the upper half-plane ($y \ge 0$).
- **Exercise 4.4:** A square plate of side $L = 0.400\,\text{m}$ has a square corner of side $L/2 = 0.200\,\text{m}$ removed. Find the center of mass of the remaining L-shaped plate relative to the uncut corner.

### Tier 3: Motion & Zero-Momentum Transformations
- **Exercise 4.5:** Two particles $m_1 = 2.00\,\text{kg}$ and $m_2 = 4.00\,\text{kg}$ have velocities $\vec{v}_1 = (3.00\,\hat{i} + 4.00\,\hat{j})\,\text{m/s}$ and $\vec{v}_2 = (-1.00\,\hat{i} + 2.00\,\hat{j})\,\text{m/s}$. Compute $\vec{V}_{\text{CM}}$ and the velocities $\vec{v}'_1, \vec{v}'_2$ in the C-frame.
- **Exercise 4.6:** A girl of mass $40.0\,\text{kg}$ stands on a $120.0\,\text{kg}$ raft of length $4.00\,\text{m}$ in a lake. If she walks from one end of the raft to the other, what is the displacement of the raft?

### Tier 4: Koenig’s Theorem Applications
- **Exercise 4.7:** Compute the reduced mass $\mu$ and internal kinetic energy $K_{\text{int}}$ of a system where $m_1 = 5.00\,\text{kg}$ moving at $12.0\,\text{m/s}$ strikes a stationary target $m_2 = 15.0\,\text{kg}$.
- **Exercise 4.8:** A projectile of mass $12.0\,\text{kg}$ explodes into three pieces of equal mass. If the internal blast adds $6000\,\text{J}$ of energy, what is the average speed squared $\langle v'^2 \rangle$ of the fragments in the C-frame?

### Tier 5: Trajectory Invariance in Gravity Fields
- **Exercise 4.9:** A shell launched at $v_0 = 50.0\,\text{m/s}$ at $60.0^\circ$ explodes at $t = 2.00\,\text{s}$ into two unequal masses ($1:3$ ratio). The heavier piece lands at $t = 3.50\,\text{s}$ at $x = 100.0\,\text{m}$. Find the landing position of the lighter piece ($g = 9.81\,\text{m/s}^2$).
- **Exercise 4.10:** Two masses $m_1$ and $m_2$ connected by a spring of stiffness $k$ are dropped simultaneously from rest in a vacuum. Prove that the center of mass falls with acceleration $g$ regardless of the initial compression or oscillation of the spring.

---

## 4.8 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 4.1
- **Given:** $m_1 = 3.00\,\text{kg}$ at $x_1 = 2.00\,\text{m}$, $m_2 = 7.00\,\text{kg}$ at $x_2 = 8.00\,\text{m}$.
- **Step 1: Center of mass calculation**
  $$X_{\text{CM}} = \frac{m_1 x_1 + m_2 x_2}{m_1 + m_2} = \frac{(3.00)(2.00) + (7.00)(8.00)}{3.00 + 7.00} = \frac{6.00 + 56.00}{10.00} = \frac{62.00}{10.00} = 6.20\,\text{m}$$

---

### Solution 4.2
- **Given:** $m_1 = 1.00\,\text{kg}$ at $(0, 0)$, $m_2 = 2.00\,\text{kg}$ at $(1.00, 0)$, $m_3 = 3.00\,\text{kg}$ at $(0.500, 0.8660)$.
- **Step 1: Total mass**
  $$M = 1.00 + 2.00 + 3.00 = 6.00\,\text{kg}$$
- **Step 2: Coordinates**
  $$X_{\text{CM}} = \frac{(1.00)(0) + (2.00)(1.00) + (3.00)(0.500)}{6.00} = \frac{0 + 2.00 + 1.50}{6.00} = \frac{3.50}{6.00} = 0.5833\,\text{m}$$
  $$Y_{\text{CM}} = \frac{(1.00)(0) + (2.00)(0) + (3.00)(0.8660)}{6.00} = \frac{2.598}{6.00} = 0.4330\,\text{m}$$
  $$\vec{R}_{\text{CM}} = (0.583, 0.433)\,\text{m}$$

---

### Solution 4.3
- **Given:** Semicircular thin wire of radius $R$ ($y \ge 0$).
- **Step 1: Symmetry and coordinates**
  By symmetry across the $y$-axis, $X_{\text{CM}} = 0$.
  Element of mass: $dm = \lambda \, ds = \lambda R \, d\theta$, with $\theta \in [0, \pi]$.
  $y(\theta) = R \sin\theta$. Total mass $M = \lambda \pi R$.
- **Step 2: Integration for $Y_{\text{CM}}$**
  $$\int y \, dm = \int_0^\pi (R\sin\theta)(\lambda R \, d\theta) = \lambda R^2 \int_0^\pi \sin\theta \, d\theta = \lambda R^2 [-\cos\theta]_0^\pi = 2 \lambda R^2$$
  $$Y_{\text{CM}} = \frac{2\lambda R^2}{M} = \frac{2\lambda R^2}{\lambda \pi R} = \frac{2R}{\pi} \approx 0.6366 R$$

---

### Solution 4.4
- **Given:** Square plate of side $L = 0.400\,\text{m}$, quadrant removed.
- **Step 1: Divide into three equal sub-squares**
  Divide the L-shaped plate into three identical squares of side $a = L/2 = 0.200\,\text{m}$ and mass $m$:
  - Square 1: center at $(a/2, a/2) = (0.100, 0.100)\,\text{m}$.
  - Square 2: center at $(3a/2, a/2) = (0.300, 0.100)\,\text{m}$.
  - Square 3: center at $(a/2, 3a/2) = (0.100, 0.300)\,\text{m}$.
- **Step 2: Center of mass**
  $$X_{\text{CM}} = \frac{0.100 + 0.300 + 0.100}{3} = \frac{0.500}{3} = 0.1667\,\text{m}$$
  $$Y_{\text{CM}} = \frac{0.100 + 0.100 + 0.300}{3} = \frac{0.500}{3} = 0.1667\,\text{m}$$
  $$\vec{R}_{\text{CM}} = (0.167, 0.167)\,\text{m}$$

---

### Solution 4.5
- **Given:** $m_1 = 2.00\,\text{kg}$, $\vec{v}_1 = (3.00, 4.00)$, $m_2 = 4.00\,\text{kg}$, $\vec{v}_2 = (-1.00, 2.00)$.
- **Step 1: Center of mass velocity**
  $$M = 6.00\,\text{kg}$$
  $$V_{x,\text{CM}} = \frac{(2.00)(3.00) + (4.00)(-1.00)}{6.00} = \frac{6.00 - 4.00}{6.00} = +0.3333\,\text{m/s}$$
  $$V_{y,\text{CM}} = \frac{(2.00)(4.00) + (4.00)(2.00)}{6.00} = \frac{8.00 + 8.00}{6.00} = +2.6667\,\text{m/s}$$
  $$\vec{V}_{\text{CM}} = 0.333\,\hat{i} + 2.667\,\hat{j}\,\text{m/s}$$
- **Step 2: C-frame velocities**
  $$\vec{v}'_1 = \vec{v}_1 - \vec{V}_{\text{CM}} = (3.00 - 0.333)\,\hat{i} + (4.00 - 2.667)\,\hat{j} = +2.667\,\hat{i} + 1.333\,\hat{j}\,\text{m/s}$$
  $$\vec{v}'_2 = \vec{v}_2 - \vec{V}_{\text{CM}} = (-1.00 - 0.333)\,\hat{i} + (2.00 - 2.667)\,\hat{j} = -1.333\,\hat{i} - 0.667\,\hat{j}\,\text{m/s}$$

---

### Solution 4.6
- **Given:** $m = 40.0\,\text{kg}$, $M = 120.0\,\text{kg}$, $L = 4.00\,\text{m}$.
- **Step 1: Displacement formula from Example 3.3**
  $$\Delta x_{\text{raft}} = -\frac{m}{M + m} L = -\frac{40.0\,\text{kg}}{120.0 + 40.0\,\text{kg}} (4.00\,\text{m}) = -\frac{40.0}{160.0}(4.00) = -1.00\,\text{m}$$
  The raft shifts $1.00\,\text{m}$ in the opposite direction.

---

### Solution 4.7
- **Given:** $m_1 = 5.00\,\text{kg}$, $v_1 = 12.0\,\text{m/s}$, $m_2 = 15.0\,\text{kg}$, $v_2 = 0$.
- **Step 1: Reduced mass $\mu$**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(5.00)(15.0)}{5.00 + 15.0} = \frac{75.0}{20.0} = 3.75\,\text{kg}$$
- **Step 2: Relative velocity**
  $$v_{\text{rel}} = v_1 - v_2 = 12.0 - 0 = 12.0\,\text{m/s}$$
- **Step 3: Internal kinetic energy**
  $$K_{\text{int}} = \frac{1}{2} \mu v_{\text{rel}}^2 = \frac{1}{2}(3.75\,\text{kg})(12.0\,\text{m/s})^2 = 0.5 \times 3.75 \times 144.0 = 270.0\,\text{J}$$

---

### Solution 4.8
- **Given:** Three equal pieces ($m_i = m = 4.00\,\text{kg}$), $\Delta E_{\text{blast}} = K_{\text{int}} = 6000.0\,\text{J}$.
- **Step 1: Internal kinetic energy summation**
  $$K_{\text{int}} = \sum_{i=1}^3 \frac{1}{2} m_i (v'_i)^2 = \frac{1}{2} m \sum_{i=1}^3 (v'_i)^2 = \frac{1}{2}(4.00\,\text{kg}) \cdot 3 \langle v'^2 \rangle = 6.00 \langle v'^2 \rangle$$
- **Step 2: Solve for average speed squared**
  $$\langle v'^2 \rangle = \frac{6000.0\,\text{J}}{6.00\,\text{kg}} = 1000.0\,\text{m}^2/\text{s}^2 \implies v'_{\text{rms}} = \sqrt{1000.0} = 31.62\,\text{m/s}$$

---

### Solution 4.9
- **Given:** $v_0 = 50.0\,\text{m/s}$, $\theta = 60.0^\circ$, $g = 9.81\,\text{m/s}^2$. $m_1 = M/4$ (lighter), $m_2 = 3M/4$ (heavier).
- **Step 1: Initial horizontal velocity**
  $$v_{0x} = 50.0 \cos(60.0^\circ) = 25.0\,\text{m/s}$$
  Because $\sum F_x = 0$, $V_{x,\text{CM}} = 25.0\,\text{m/s}$ is constant at all times!
- **Step 2: Total flight time of center of mass**
  $$v_{0y} = 50.0 \sin(60.0^\circ) = 43.30\,\text{m/s}$$
  $$T_{\text{flight}} = \frac{2 v_{0y}}{g} = \frac{2(43.30)}{9.81} = 8.828\,\text{s}$$
  Total range of CM:
  $$X_{\text{CM}} = v_{0x} T_{\text{flight}} = (25.0)(8.828) = 220.70\,\text{m}$$
- **Step 3: Solve for $x_1$**
  $$X_{\text{CM}} = \frac{1}{4} x_1 + \frac{3}{4} x_2 \implies x_1 = 4 X_{\text{CM}} - 3 x_2$$
  $$x_1 = 4(220.70) - 3(100.0) = 882.80 - 300.00 = 582.80\,\text{m}$$
  The lighter piece lands at $x_1 = 582.8\,\text{m}$.

---

### Solution 4.10
- **Proof:**
  Let $m_1$ and $m_2$ be connected by an arbitrary internal spring exerting force $\vec{F}_s$.
  Forces on $m_1$: $\vec{F}_1 = m_1 \vec{g} + \vec{F}_s$.
  Forces on $m_2$: $\vec{F}_2 = m_2 \vec{g} - \vec{F}_s$.
  Applying Newton's Second Law for the Center of Mass:
  $$M_{\text{total}} \vec{A}_{\text{CM}} = \vec{F}_1 + \vec{F}_2 = (m_1 \vec{g} + \vec{F}_s) + (m_2 \vec{g} - \vec{F}_s) = (m_1 + m_2)\vec{g} = M_{\text{total}} \vec{g}$$
  Dividing by $M_{\text{total}}$:
  $$\vec{A}_{\text{CM}} \equiv \vec{g}$$
  The spring forces cancel identically in pairs ($\vec{F}_s - \vec{F}_s \equiv \vec{0}$).
  Therefore, the center of mass undergoes pure free fall with acceleration $\vec{g}$, completely independent of whether the spring is wildly oscillating or vibrating!
