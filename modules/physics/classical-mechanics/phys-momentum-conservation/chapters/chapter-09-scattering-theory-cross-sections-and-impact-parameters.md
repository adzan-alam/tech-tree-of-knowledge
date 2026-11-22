# Chapter 09: Classical Scattering Theory, Cross Sections, and Impact Parameters

> "It was quite the most incredible event that has ever happened to me in my life. It was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you."  
> — Ernest Rutherford (on observing large-angle alpha particle scattering, 1911)

---

## 1. Introduction: From Physical Contact to Field-Mediated Collisions

In our previous chapters, collisions were treated as instantaneous contact interactions between macroscopic rigid bodies, characterized by a normal line of impact and a phenomenological coefficient of restitution $e$. However, when nature is probed at microscopic atomic scales or astronomical cosmological scales, bodies almost never make "physical contact" in the colloquial sense.

When an alpha particle deflects off a gold nucleus, when electrons scatter off ions in a fusion plasma, or when a interstellar comet swings around the Sun, the interaction is mediated continuously by a **conservative force field** (such as Coulomb repulsion or Newtonian gravitation). The particles never touch; instead, their trajectories curve smoothly through space as momentum and energy are exchanged continuously through the potential gradient $\vec{F} = -\nabla U(r)$.

This continuous interaction regime is the domain of **Classical Scattering Theory**. Rather than tracking instantaneous contact points, scattering theory maps the asymptotic conditions before the interaction (at infinite distance $r \to \infty$) to the asymptotic conditions long after the interaction has subsided ($r \to \infty$).

---

## 2. Geometry of Planar Scattering: Impact Parameter and Deflection Angle

Consider a stationary target of mass $M$ fixed at the origin $O$. A projectile of mass $m$ approaches from infinity with initial asymptotic velocity $\vec{v}_0$ directed along the $+x$ axis.

```
                         y
                         ^
        Incident beam    |               Periapsis (closest approach r_min)
        v0 ------------->+-------------*
                         |  b          /  \
     --------------------+------------+----\-------------------------> x
                         |           O       \
                         |         Target     \  Scattering angle theta
                         v                     v
                                                 Asymptotic departure path
```

### 2.1 The Impact Parameter ($b$)

The **impact parameter** $b$ is the perpendicular distance from the target center $O$ to the incident velocity vector of the projectile at infinity:
$$b \equiv \lim_{x \to -\infty} |y(x)|$$

- If $b = 0$, the collision is purely head-on; the particle approaches along the symmetry axis, decelerates to rest at a distance of closest approach $r_{\min}$, and rebounds directly backwards ($\theta = 180^\circ = \pi$).
- As $b \to \infty$, the particle passes so far from the target that the force field is negligible; it continues undeflected ($\theta \to 0$).
- For intermediate $b$, the trajectory is deflected by an angle $\theta$, called the **scattering angle** (or deflection angle).

### 2.2 Angular Momentum and Energy Invariance

Because central force fields $\vec{F}(\vec{r}) = f(r)\hat{r}$ exert zero torque about the center of force $O$ ($\vec{\tau} = \vec{r} \times \vec{F} = \vec{0}$), two fundamental quantities are strictly conserved throughout the entire flight:

1. **Conservation of Angular Momentum:**
   At infinity, the angular momentum about $O$ is:
   $$L = \|\vec{r} \times m\vec{v}_0\| = m v_0 b = \text{constant}$$
   At any intermediate polar coordinate $(r, \phi)$:
   $$L = m r^2 \dot{\phi} = m v_0 b \implies \dot{\phi} = \frac{v_0 b}{r^2}$$

2. **Conservation of Mechanical Energy:**
   At infinity, where potential energy $U(\infty) = 0$:
   $$E = \frac{1}{2}m v_0^2 = \text{constant}$$
   At any intermediate distance $r$:
   $$E = \frac{1}{2}m \dot{r}^2 + \frac{1}{2}m (r\dot{\phi})^2 + U(r) = \frac{1}{2}m \dot{r}^2 + \frac{L^2}{2m r^2} + U(r)$$

This defines the **effective potential**:
$$U_{\text{eff}}(r) = U(r) + \frac{L^2}{2m r^2} = U(r) + \frac{m v_0^2 b^2}{2 r^2}$$

### 2.3 Distance of Closest Approach ($r_{\min}$)

At the point of closest approach (the turning point or periapsis), the radial velocity vanishes identically: $\dot{r} = 0$. Setting $E = U_{\text{eff}}(r_{\min})$ yields:
$$\frac{1}{2}m v_0^2 = U(r_{\min}) + \frac{m v_0^2 b^2}{2 r_{\min}^2}$$
$$1 - \frac{U(r_{\min})}{E} - \frac{b^2}{r_{\min}^2} = 0$$

For any specified potential $U(r)$, this algebraic equation determines $r_{\min}$ as a direct function of initial energy $E$ and impact parameter $b$.

---

## 3. The Concept of Cross Section: Differential and Total

In experimental physics, an accelerator does not shoot a single particle at a single atom; instead, a **beam** of billions of particles per second bombards a target foil containing trillions of atoms. To bridge single-particle trajectories to macroscopic experimental counts, physicists use the concept of **cross section** ($\sigma$).

### 3.1 Incident Beam Flux ($I_0$)

The **incident beam flux** $I_0$ is defined as the number of incident projectile particles crossing per unit area per unit time:
$$I_0 = \frac{dN_{\text{inc}}}{A\,dt} \quad \left[\frac{\text{particles}}{\text{m}^2\cdot\text{s}}\right]$$

### 3.2 The Annular Scattering Ring

Consider particles in the beam whose impact parameters lie in the narrow annular ring between $b$ and $b + db$.
- The area of this circular ring is:
  $$dA = 2\pi b\,db$$
- The rate of particles passing through this ring is:
  $$dN = I_0\,dA = I_0 (2\pi b\,|db|)$$

Because the central potential is spherically symmetric, every particle entering this annular ring scatters into a corresponding cone of polar angles between $\theta$ and $\theta + d\theta$.

```
Beam cross-section:                Solid angle element dOmega:
         ___                                  ___
       /  b  \                              /     \
      |   *---| db                         |   *---| dtheta
       \ ___ /                              \ ___ /
     dA = 2 pi b db                   dOmega = 2 pi sin(theta) dtheta
```

### 3.3 The Differential Cross Section ($d\sigma/d\Omega$)

The solid angle subtended by this scattered conical shell is:
$$d\Omega = 2\pi \sin\theta\,d\theta$$

The **Differential Scattering Cross Section** $\frac{d\sigma}{d\Omega}$ is defined as the number of particles scattered into solid angle $d\Omega$ per unit time, divided by the incident flux $I_0$ and the solid angle:
$$\frac{d\sigma}{d\Omega}(\theta) \equiv \frac{1}{I_0} \frac{dN}{d\Omega} = \frac{I_0 (2\pi b\,|db|)}{I_0 (2\pi \sin\theta\,d\theta)}$$

$$\mathbf{\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right|}$$

The differential cross section has dimensions of **area per unit solid angle** ($\text{m}^2/\text{sr}$, or historically in barns per steradian, where $1\text{ barn} = 10^{-28}\text{ m}^2$).

### 3.4 The Total Cross Section ($\sigma_{\text{tot}}$)

The **Total Cross Section** $\sigma_{\text{tot}}$ represents the total effective target area that the scatterer presents to the beam for scattering of any non-zero angle:
$$\mathbf{\sigma_{\text{tot}} \equiv \int_{\text{all }\Omega} \frac{d\sigma}{d\Omega}\,d\Omega = 2\pi \int_0^\pi \frac{d\sigma}{d\Omega} \sin\theta\,d\theta = 2\pi \int_0^{b_{\max}} b\,db}$$

---

## 4. Benchmark 1: Hard-Sphere Elastic Scattering

To understand cross sections intuitively, let us compute the cross section for a point projectile scattering elastically off a rigid, impenetrable sphere of radius $R$.

### 4.1 Trajectory Geometry

```
                         y
                         ^
        Incident path    |
        -----------------+-------* Contact point
                         |      / \
                       b |   R /   \ alpha
                         |    /     \
                         v   O-------+-----------------------------> x
                           Sphere     \  Scattering angle theta
```

1. If $b > R$, the particle misses the sphere entirely ($db/d\theta = 0$, undeflected).
2. For $b \le R$, contact occurs at an angle $\alpha$ relative to the centerline:
   $$\sin\alpha = \frac{b}{R} \implies b = R \sin\alpha$$
3. By the law of specular reflection on the spherical surface, the angle of incidence equals the angle of reflection. From the geometry of the triangle:
   $$\theta = \pi - 2\alpha \implies \alpha = \frac{\pi - \theta}{2}$$
4. Express $b$ in terms of scattering angle $\theta$:
   $$b(\theta) = R \sin\left(\frac{\pi - \theta}{2}\right) = R \cos\left(\frac{\theta}{2}\right)$$

### 4.2 Compute the Differential Cross Section

Differentiating with respect to $\theta$:
$$\frac{db}{d\theta} = -\frac{R}{2} \sin\left(\frac{\theta}{2}\right) \implies \left|\frac{db}{d\theta}\right| = \frac{R}{2} \sin\left(\frac{\theta}{2}\right)$$

Substitute into the master formula:
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{R \cos(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{R}{2}\sin(\theta/2)\right]$$
Canceling terms:
$$\mathbf{\frac{d\sigma}{d\Omega} = \frac{R^2}{4}}$$

### 4.3 Profound Insights from Hard-Sphere Scattering

1. **Isotropy:** Notice that $\frac{d\sigma}{d\Omega} = \frac{R^2}{4}$ is a **pure constant**, independent of scattering angle $\theta$! A hard sphere scatters incident flux with uniform probability into every steradian of space.
2. **Total Cross Section:**
   $$\sigma_{\text{tot}} = \int \frac{d\sigma}{d\Omega}\,d\Omega = \frac{R^2}{4} \int d\Omega = \frac{R^2}{4} (4\pi) = \mathbf{\pi R^2}$$
   The total scattering cross section equals **precisely the geometric shadow area** $\pi R^2$ of the target sphere!

---

## 5. Benchmark 2: Rutherford Scattering (Coulomb Repulsion)

In 1911, Ernest Rutherford analyzed the scattering of positively charged alpha particles ($q_1 = +2e$) off gold nuclei ($q_2 = +Ze$) under the repulsive Coulomb potential:
$$U(r) = \frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{r} = \frac{k q_1 q_2}{r}$$

### 5.1 The Classical Hyperbolic Orbit

Under an inverse-square central force, the trajectory of an unbound particle ($E > 0$) is a **hyperbola** with the target nucleus located at the exterior focus.

```
                              y
                              ^
        Incoming asymptote    |
                \             |
                  \           |
                    \    r_min|
                      ` *     |
                       /  \   |
                      /    \  |
                     /      \ |
     ---------------+--------+O----------------------------------> x
                             |  Nucleus (+Ze)
                              \  Outgoing asymptote (deflected by theta)
```

Integrating the orbital equations of motion yields the fundamental relationship connecting impact parameter $b$ and scattering angle $\theta$:

$$\mathbf{b(\theta) = \frac{k q_1 q_2}{2 E} \cot\left(\frac{\theta}{2}\right)}$$
where $E = \frac{1}{2} m v_0^2$ is the initial kinetic energy of the projectile.

### 5.2 Derivation of the Rutherford Scattering Formula

1. Differentiate $b$ with respect to $\theta$:
   $$\frac{db}{d\theta} = \frac{k q_1 q_2}{2 E} \left(-\frac{1}{2 \sin^2(\theta/2)}\right) \implies \left|\frac{db}{d\theta}\right| = \frac{k q_1 q_2}{4 E \sin^2(\theta/2)}$$

2. Substitute $b$ and $|db/d\theta|$ into the differential cross section:
   $$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{\frac{k q_1 q_2}{2E} \cot(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{k q_1 q_2}{4E \sin^2(\theta/2)}\right]$$

3. Using $\cot(\theta/2) = \frac{\cos(\theta/2)}{\sin(\theta/2)}$:
   $$\frac{d\sigma}{d\Omega} = \left(\frac{k q_1 q_2}{4E}\right)^2 \frac{\frac{\cos(\theta/2)}{\sin(\theta/2)}}{2\sin(\theta/2)\cos(\theta/2) \sin^2(\theta/2)} = \left(\frac{k q_1 q_2}{4E}\right)^2 \frac{1}{4 \sin^4(\theta/2)}$$

$$\mathbf{\frac{d\sigma}{d\Omega}(\theta) = \left(\frac{k q_1 q_2}{4 E}\right)^2 \frac{1}{\sin^4(\theta/2)} = \left(\frac{1}{4\pi\epsilon_0} \frac{q_1 q_2}{4 E}\right)^2 \frac{1}{\sin^4(\theta/2)}}$$

### 5.3 Physical Ramifications of Rutherford Scattering

1. **The $\sin^{-4}(\theta/2)$ Singularity:**
   As $\theta \to 0$, the cross section diverges rapidly to infinity ($\frac{d\sigma}{d\Omega} \propto \theta^{-4}$). Why? Because the Coulomb potential $1/r$ has infinite range! Even particles passing millions of atomic radii away ($b \to \infty$) experience a tiny, non-zero deflection. Consequently, the total cross section for a pure Coulomb potential is **infinite**:
   $$\sigma_{\text{tot}} = \int \frac{d\sigma}{d\Omega}\,d\Omega = \infty$$
   (In real matter, the nuclear charge is screened by electron clouds at atomic radii $R_{\text{atom}}$, cutting off the long-range tail).

2. **Large-Angle Scattering ($\theta \approx 180^\circ$):**
   For head-on scattering ($\theta \to \pi$), $\sin(\theta/2) \to 1$. The cross section reaches a finite minimum:
   $$\frac{d\sigma}{d\Omega}(\pi) = \left(\frac{k q_1 q_2}{4 E}\right)^2$$
   This proved that the positive charge of an atom is concentrated in a dense, massive core ($< 10^{-14}\text{ m}$) rather than spread out uniformly as J.J. Thomson's "plum pudding" model had proposed!

---

## 6. Gravitational Slingshots and Orbital Assist Mechanics

The mathematics of Rutherford scattering applies directly to celestial mechanics under attractive Newtonian gravity by replacing repulsive Coulomb constant $+k q_1 q_2$ with attractive gravitational parameter $-G M m$.

### 6.1 Hyperbolic Deflection Around a Planet

When a spacecraft of mass $m$ flies past a planet of mass $M$ with asymptotic approach speed $v_\infty$ at periapsis distance $r_p$:
1. Eccentricity of the hyperbolic trajectory:
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{G M} > 1$$
2. Deflection angle $\delta$ in the planet's rest frame:
   $$\sin\left(\frac{\delta}{2}\right) = \frac{1}{\epsilon} = \frac{1}{1 + \frac{r_p v_\infty^2}{G M}}$$
   $$\delta = 2 \arcsin\left(\frac{1}{1 + \frac{r_p v_\infty^2}{G M}}\right)$$

By carefully angling this deflection vector relative to the planet's orbital motion around the Sun, the spacecraft extracts orbital energy from the planet, gaining heliocentric velocity without burning propellant (the **gravity assist** that propelled Voyager 1, Voyager 2, Cassini, and New Horizons across the outer solar system).

---

## 7. 10 Progressive Numerical Worked Examples

---

### Worked Example 9.1: Hard-Sphere Differential and Total Cross Section
*A beam of microscopic glass beads is fired at a steel ball bearing of radius $R = 1.50\text{ cm}$. (a) Calculate the differential cross section $\frac{d\sigma}{d\Omega}$ at scattering angles $\theta = 30.0^\circ$, $90.0^\circ$, and $150.0^\circ$. (b) Calculate the total scattering cross section $\sigma_{\text{tot}}$. (c) If the incident beam has a uniform flux of $I_0 = 4.00 \times 10^5\text{ beads}/(\text{m}^2\cdot\text{s})$, how many beads are scattered per second into a small detector of area $A_{\text{det}} = 2.00\text{ cm}^2$ placed $L = 1.00\text{ m}$ away at $\theta = 60.0^\circ$?*

#### Solution
1. **Given:**
   - $R = 0.0150\text{ m}$
   - $I_0 = 4.00 \times 10^5\text{ m}^{-2}\text{s}^{-1}$
   - $A_{\text{det}} = 2.00 \times 10^{-4}\text{ m}^2$, $L = 1.00\text{ m}$
2. **Part (a): Differential Cross Section:**
   - For a hard sphere, scattering is isotropic:
     $$\frac{d\sigma}{d\Omega} = \frac{R^2}{4} = \frac{(0.0150)^2}{4} = \frac{2.25 \times 10^{-4}}{4} = \mathbf{5.625 \times 10^{-5}\text{ m}^2/\text{sr}}$$
   - Because it is independent of $\theta$, it is identically **$5.625 \times 10^{-5}\text{ m}^2/\text{sr}$** at $30^\circ$, $90^\circ$, and $150^\circ$!
3. **Part (b): Total Cross Section:**
   $$\sigma_{\text{tot}} = \pi R^2 = \pi (0.0150)^2 = \pi \times 2.25 \times 10^{-4} \approx \mathbf{7.069 \times 10^{-4}\text{ m}^2}$$
4. **Part (c): Count Rate in Detector:**
   - Solid angle subtended by detector:
     $$\Delta\Omega = \frac{A_{\text{det}}}{L^2} = \frac{2.00 \times 10^{-4}\text{ m}^2}{(1.00\text{ m})^2} = 2.00 \times 10^{-4}\text{ sr}$$
   - Scattered rate:
     $$\frac{dN}{dt} = I_0 \left(\frac{d\sigma}{d\Omega}\right) \Delta\Omega = (4.00 \times 10^5) \times (5.625 \times 10^{-5}) \times (2.00 \times 10^{-4})$$
     $$\frac{dN}{dt} = 22.5 \times (2.00 \times 10^{-4}) = \mathbf{4.50 \times 10^{-3}\text{ beads/s}}$$

---

### Worked Example 9.2: Alpha Particle Distance of Closest Approach in Head-On Collision
*In a Rutherford scattering experiment, an alpha particle ($q_1 = +2e$, mass $m_\alpha = 6.64 \times 10^{-27}\text{ kg}$) is fired head-on ($b = 0$) with kinetic energy $E = 5.00\text{ MeV}$ directly toward a gold nucleus ($Z = 79$, $q_2 = +79e$). (Take $e = 1.602 \times 10^{-19}\text{ C}$, $k = \frac{1}{4\pi\epsilon_0} = 8.988 \times 10^9\text{ N}\cdot\text{m}^2/\text{C}^2$). (a) Convert $E$ to Joules. (b) Calculate the distance of closest approach $d_{\min}$.*

#### Solution
1. **Part (a): Energy Conversion:**
   $$E = 5.00\text{ MeV} = 5.00 \times 10^6\text{ eV} \times (1.602 \times 10^{-19}\text{ J/eV}) = \mathbf{8.010 \times 10^{-13}\text{ J}}$$
2. **Part (b): Distance of Closest Approach ($d_{\min}$):**
   - For a head-on collision ($b = 0$), all kinetic energy is converted into electrostatic potential energy at the turning point:
     $$E = \frac{k q_1 q_2}{d_{\min}} = \frac{k (2e)(79e)}{d_{\min}} = \frac{158 k e^2}{d_{\min}}$$
     $$d_{\min} = \frac{158 k e^2}{E} = \frac{158 \times (8.988 \times 10^9) \times (1.602 \times 10^{-19})^2}{8.010 \times 10^{-13}}$$
     $$158 \times (8.988 \times 10^9) = 1.4201 \times 10^{12}$$
     $$(1.602 \times 10^{-19})^2 = 2.5664 \times 10^{-38}$$
     $$\text{Numerator} = 1.4201 \times 10^{12} \times 2.5664 \times 10^{-38} = 3.6446 \times 10^{-26}\text{ N}\cdot\text{m}^2$$
     $$d_{\min} = \frac{3.6446 \times 10^{-26}}{8.010 \times 10^{-13}} \approx \mathbf{4.55 \times 10^{-14}\text{ m} = 45.5\text{ fm}}$$
3. **Physical Significance:**
   Since the radius of a gold nucleus is approximately $R_{\text{nucleus}} \approx 7.3\text{ fm}$, the alpha particle turns around safely outside the nuclear boundary, confirming that purely classical electrostatic Coulomb forces govern the scattering!

---

### Worked Example 9.3: Impact Parameter for $90^\circ$ Rutherford Scattering
*For the $5.00\text{ MeV}$ alpha particle scattering off gold ($Z = 79$) in Example 9.2: (a) find the impact parameter $b_{90}$ that causes a deflection of exactly $\theta = 90.0^\circ$, and (b) calculate the distance of closest approach $r_{\min}$ at this impact parameter.*

#### Solution
1. **Given:**
   - $E = 8.010 \times 10^{-13}\text{ J}$
   - $k q_1 q_2 = 3.6446 \times 10^{-26}\text{ N}\cdot\text{m}^2$
   - Head-on distance $d_{\min} = 4.550 \times 10^{-14}\text{ m}$
2. **Part (a): Compute $b$ for $\theta = 90.0^\circ$:**
   $$b(\theta) = \frac{k q_1 q_2}{2 E} \cot\left(\frac{\theta}{2}\right) = \frac{d_{\min}}{2} \cot(45.0^\circ)$$
   Since $\cot(45.0^\circ) = 1.000$:
   $$b_{90} = \frac{d_{\min}}{2} = \frac{4.550 \times 10^{-14}}{2} = \mathbf{2.275 \times 10^{-14}\text{ m} = 22.8\text{ fm}}$$
3. **Part (b): Closest Approach $r_{\min}$ for $\theta = 90^\circ$:**
   - For a hyperbola, $r_{\min} = a(1 + \epsilon)$, where $a = \frac{d_{\min}}{2} = b_{90}$ and eccentricity $\epsilon = \csc(\theta/2) = \csc(45^\circ) = \sqrt{2} \approx 1.4142$.
   $$r_{\min} = a (1 + \epsilon) = b_{90} (1 + \sqrt{2}) = (2.275 \times 10^{-14}) \times (2.4142) \approx \mathbf{5.49 \times 10^{-14}\text{ m} = 54.9\text{ fm}}$$

---

### Worked Example 9.4: Rutherford Differential Cross Section Ratio
*Compare the probability of an alpha particle deflecting at $\theta_1 = 30.0^\circ$ versus $\theta_2 = 150.0^\circ$ in Rutherford scattering. Calculate the exact numerical ratio $\frac{(d\sigma/d\Omega)_{30^\circ}}{(d\sigma/d\Omega)_{150^\circ}}$.*

#### Solution
1. **Rutherford Cross Section Formula:**
   $$\frac{d\sigma}{d\Omega} \propto \frac{1}{\sin^4(\theta/2)}$$
2. **Evaluate Angles:**
   - For $\theta_1 = 30.0^\circ$: $\theta_1/2 = 15.0^\circ$.
     $$\sin(15.0^\circ) \approx 0.258819$$
     $$\sin^4(15.0^\circ) = (0.258819)^4 \approx 0.004487$$
   - For $\theta_2 = 150.0^\circ$: $\theta_2/2 = 75.0^\circ$.
     $$\sin(75.0^\circ) \approx 0.965926$$
     $$\sin^4(75.0^\circ) = (0.965926)^4 \approx 0.86967$$
3. **Compute Ratio:**
   $$\frac{(d\sigma/d\Omega)_{30^\circ}}{(d\sigma/d\Omega)_{150^\circ}} = \frac{\sin^4(75.0^\circ)}{\sin^4(15.0^\circ)} = \frac{0.86967}{0.004487} \approx \mathbf{193.8}$$
4. **Conclusion:**
   Deflections at $30^\circ$ are almost $200$ times more probable than deflections at $150^\circ$!

---

### Worked Example 9.5: Hard-Sphere Scattering with Impact Parameter Distribution
*A beam of identical particles is uniformly distributed over a circular cross-section of radius $R_{\text{beam}} = 2.00\text{ cm}$. At the center of the beam sits a hard sphere of radius $R = 1.00\text{ cm}$. What fraction of the incident beam particles will scatter by an angle $\theta \ge 60.0^\circ$?*

#### Solution
1. **Relate Scattering Angle to Impact Parameter:**
   - For a hard sphere: $b = R \cos(\theta/2)$.
   - For $\theta \ge 60.0^\circ$, the impact parameter must satisfy:
     $$b \le R \cos(30.0^\circ) = R \frac{\sqrt{3}}{2} \approx 0.8660 R$$
2. **Cross-Sectional Area for Scattering $\theta \ge 60^\circ$:**
   $$\sigma(\ge 60^\circ) = \pi b_{\max}^2 = \pi \left(\frac{\sqrt{3}}{2} R\right)^2 = \frac{3}{4} \pi R^2$$
3. **Total Beam Area:**
   $$A_{\text{beam}} = \pi R_{\text{beam}}^2 = \pi (2.00)^2 = 4\pi\text{ cm}^2$$
4. **Area for $\theta \ge 60^\circ$:**
   $$\sigma = \frac{3}{4} \pi (1.00)^2 = 0.75\pi\text{ cm}^2$$
5. **Fraction of Particles Scattered:**
   $$\text{Fraction} = \frac{\sigma}{A_{\text{beam}}} = \frac{0.75\pi}{4.00\pi} = \frac{0.75}{4.00} = \mathbf{0.1875 = 18.75\%}$$

---

### Worked Example 9.6: Voyager 1 Jupiter Gravity Assist Geometry
*Voyager 1 approached Jupiter ($M_J = 1.90 \times 10^{27}\text{ kg}$) with an asymptotic heliocentric excess speed $v_\infty = 13.5\text{ km/s}$. The closest approach distance was $r_p = 348,890\text{ km}$ from the center of Jupiter. (Take $G = 6.674 \times 10^{-11}\text{ N}\cdot\text{m}^2/\text{kg}^2$). Calculate: (a) the standard gravitational parameter $\mu = G M_J$, (b) the trajectory eccentricity $\epsilon$, and (c) the total deflection angle $\delta$ in Jupiter's rest frame.*

#### Solution
1. **Given:**
   - $M_J = 1.90 \times 10^{27}\text{ kg}$
   - $v_\infty = 1.35 \times 10^4\text{ m/s}$
   - $r_p = 3.4889 \times 10^8\text{ m}$
2. **Part (a): Gravitational Parameter $\mu$:**
   $$\mu = G M_J = (6.674 \times 10^{-11}) \times (1.90 \times 10^{27}) = \mathbf{1.268 \times 10^{17}\text{ m}^3/\text{s}^2}$$
3. **Part (b): Eccentricity $\epsilon$:**
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{\mu} = 1 + \frac{(3.4889 \times 10^8) \times (1.35 \times 10^4)^2}{1.268 \times 10^{17}}$$
   $$(1.35 \times 10^4)^2 = 1.8225 \times 10^8\text{ m}^2/\text{s}^2$$
   $$\text{Numerator} = 3.4889 \times 10^8 \times 1.8225 \times 10^8 \approx 6.3585 \times 10^{16}\text{ m}^3/\text{s}^2$$
   $$\frac{r_p v_\infty^2}{\mu} = \frac{6.3585 \times 10^{16}}{1.268 \times 10^{17}} \approx 0.50146$$
   $$\mathbf{\epsilon = 1 + 0.50146 \approx 1.5015}$$
4. **Part (c): Deflection Angle $\delta$:**
   $$\sin\left(\frac{\delta}{2}\right) = \frac{1}{\epsilon} = \frac{1}{1.5015} \approx 0.6660$$
   $$\frac{\delta}{2} = \arcsin(0.6660) \approx 41.76^\circ$$
   $$\mathbf{\delta = 2 \times 41.76^\circ \approx 83.5^\circ}$$

---

### Worked Example 9.7: Inverse-Cube Force Law Scattering Trajectory
*A particle of mass $m$ and initial speed $v_0$ is scattered by a repulsive central potential $U(r) = \frac{k}{2 r^2}$ ($k > 0$). Derive the scattering angle $\theta$ as an explicit function of impact parameter $b$.*

#### Solution
1. **Conservation of Energy and Angular Momentum:**
   $$E = \frac{1}{2} m v_0^2, \quad L = m v_0 b$$
   Effective potential:
   $$U_{\text{eff}}(r) = \frac{k}{2r^2} + \frac{L^2}{2m r^2} = \frac{1}{2r^2} \left[k + \frac{L^2}{m}\right] = \frac{1}{2r^2} \left[k + m v_0^2 b^2\right]$$
2. **Radial Motion Equation:**
   $$\frac{1}{2}m \dot{r}^2 + U_{\text{eff}}(r) = E \implies \dot{r} = \pm \sqrt{\frac{2}{m}(E - U_{\text{eff}})} = \pm \sqrt{v_0^2 - \frac{k + m v_0^2 b^2}{m r^2}}$$
3. **Orbital Equation $d\phi/dr$:**
   $$\frac{d\phi}{dr} = \frac{\dot{\phi}}{\dot{r}} = \frac{v_0 b / r^2}{\sqrt{v_0^2 - \frac{k + m v_0^2 b^2}{m r^2}}} = \frac{b}{r^2 \sqrt{1 - \frac{b^2 + k/(mv_0^2)}{r^2}}}$$
4. **Let $\gamma = \sqrt{1 + \frac{k}{m v_0^2 b^2}} > 1$:**
   $$\frac{d\phi}{dr} = \frac{b}{r \sqrt{(\gamma b)^2 - r^2}} \implies \Delta\phi = 2 \int_{\gamma b}^\infty \frac{b\,dr}{r\sqrt{r^2 - (\gamma b)^2}} = 2 \left[\frac{b}{\gamma b} \frac{\pi}{2}\right] = \frac{\pi}{\gamma}$$
5. **Scattering Angle $\theta$:**
   $$\theta = |\pi - \Delta\phi| = \pi \left(1 - \frac{1}{\gamma}\right) = \mathbf{\pi \left(1 - \frac{1}{\sqrt{1 + \frac{k}{m v_0^2 b^2}}}\right)}$$

---

### Worked Example 9.8: Target Foil Thickness and Nuclear Collision Rate
*A gold foil of density $\rho = 19.3\text{ g/cm}^3$ and atomic mass $M = 197.0\text{ g/mol}$ has thickness $t = 1.00\text{ }\mu\text{m}$. A beam of alpha particles carries a current of $I = 1.00\text{ nA}$ ($1\text{ A} = 1\text{ C/s}$, each alpha particle has charge $q = +2e = 3.204 \times 10^{-19}\text{ C}$). If the total cross section for large-angle deflection ($\theta \ge 90^\circ$) is $\sigma_{90} = 1.62 \times 10^{-27}\text{ m}^2$, calculate: (a) the number density of gold atoms in the foil, (b) the total number of alpha particles striking the foil per second, and (c) the number of large-angle deflections per second.*

#### Solution
1. **Part (a): Number Density $n$ of Gold Atoms:**
   $$n = \frac{\rho N_A}{M} = \frac{(19.3 \times 10^3\text{ kg/m}^3) \times (6.022 \times 10^{23}\text{ atoms/mol})}{0.1970\text{ kg/mol}} \approx \mathbf{5.90 \times 10^{28}\text{ atoms/m}^3}$$
2. **Part (b): Incident Alpha Particle Rate $\dot{N}_{\text{inc}}$:**
   $$\dot{N}_{\text{inc}} = \frac{I}{2e} = \frac{1.00 \times 10^{-9}\text{ C/s}}{3.204 \times 10^{-19}\text{ C}} \approx \mathbf{3.121 \times 10^9\text{ particles/s}}$$
3. **Part (c): Large-Angle Scattering Rate:**
   - Probability that a single projectile undergoes large-angle scattering:
     $$P = n \cdot t \cdot \sigma_{90} = (5.90 \times 10^{28}\text{ m}^{-3}) \times (1.00 \times 10^{-6}\text{ m}) \times (1.62 \times 10^{-27}\text{ m}^2)$$
     $$P = 5.90 \times 10^{22} \times 1.62 \times 10^{-27} \approx 9.558 \times 10^{-5}$$
   - Scattered particles per second:
     $$\dot{N}_{\text{scattered}} = \dot{N}_{\text{inc}} \times P = (3.121 \times 10^9) \times (9.558 \times 10^{-5}) \approx \mathbf{298,300\text{ particles/s} \approx 2.98 \times 10^5\text{ s}^{-1}}$$

---

### Worked Example 9.9: Laboratory to Center-of-Mass Cross Section Transformation
*In a collision between an incident particle of mass $m_1$ and a stationary target $m_2$, show that the differential cross sections in the Laboratory frame and Center-of-Mass frame are related by:*
$$\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \frac{(1 + 2\gamma\cos\theta^* + \gamma^2)^{3/2}}{|1 + \gamma\cos\theta^*|}$$
*where $\gamma = m_1 / m_2$ and $\theta^*$ is the C-frame scattering angle.*

#### Solution
1. **Conservation of Particle Flux:**
   The number of particles scattered into a physical cone must be invariant under frame transformation:
   $$\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} \sin\theta\,d\theta = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \sin\theta^*\,d\theta^*$$
   $$\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \frac{\sin\theta^*}{\sin\theta} \left|\frac{d\theta^*}{d\theta}\right|$$
2. **Kinematic Angle Relationship:**
   $$\tan\theta = \frac{\sin\theta^*}{\cos\theta^* + \gamma}$$
   Squaring and using trig identities yields:
   $$\cos\theta = \frac{\cos\theta^* + \gamma}{\sqrt{1 + 2\gamma\cos\theta^* + \gamma^2}}$$
3. **Differentiating $\cos\theta$ with respect to $\cos\theta^*$:**
   $$\sin\theta\,d\theta = \frac{1 + \gamma\cos\theta^*}{(1 + 2\gamma\cos\theta^* + \gamma^2)^{3/2}} \sin\theta^*\,d\theta^*$$
4. **Inverting:**
   $$\mathbf{\left(\frac{d\sigma}{d\Omega}\right)_{\text{lab}} = \left(\frac{d\sigma}{d\Omega}\right)_{\text{cm}} \frac{(1 + 2\gamma\cos\theta^* + \gamma^2)^{3/2}}{|1 + \gamma\cos\theta^*|}}$$
   $$\blacksquare$$

---

### Worked Example 9.10: Shadow Scattering and the Diffraction Limit
*In quantum mechanics, the total scattering cross section of a completely absorbing "black" sphere of radius $R$ at high energies is $\sigma_{\text{tot}} = 2\pi R^2$, exactly twice the classical geometric area $\pi R^2$. Explain this classical-quantum paradox using wave-particle duality and the optical theorem.*

#### Solution
1. **The Classical Expectation:**
   Classically, any projectile with $b \le R$ hits the black sphere and is absorbed ($\sigma_{\text{absorb}} = \pi R^2$), while any projectile with $b > R$ continues undisturbed. Thus, $\sigma_{\text{classical}} = \pi R^2$.
2. **The Wave Optics Resolution:**
   When a wave of wavelength $\lambda \ll R$ encounters an opaque circular obstacle, it casts a geometric shadow directly behind it. 
   - However, by Babinet's Principle and Huygens-Fresnel wave diffraction, the sharp edge of the obstacle removes a circular disc from the wavefront, causing diffracted waves to spread outwards into small angles $\theta \sim \lambda / R$.
3. **Diffraction Cross Section:**
   The amount of flux diffracted away into non-zero angles is mathematically identical to the diffraction pattern of a circular hole of radius $R$:
   $$\sigma_{\text{elastic}} = \sigma_{\text{diffraction}} = \pi R^2$$
4. **Total Cross Section:**
   $$\sigma_{\text{tot}} = \sigma_{\text{absorption}} + \sigma_{\text{elastic}} = \pi R^2 + \pi R^2 = \mathbf{2\pi R^2}$$
   In the classical limit $\hbar \to 0$ ($\lambda \to 0$), the diffracted forward peak becomes an infinitesimally narrow delta function around $\theta = 0$, making it experimentally undetectable unless measurements are taken within arcseconds of the beamline!

---

## 8. Chapter Mastery Exercises

### Tier 1: Conceptual Foundations
**Exercise 9.1:** Why does the total cross section $\sigma_{\text{tot}}$ for Rutherford scattering diverge to infinity, whereas for a hard sphere of radius $R$ it evaluates to a finite area $\pi R^2$?  
**Exercise 9.2:** Explain physically why the differential cross section for a hard sphere is completely independent of the scattering angle $\theta$ (isotropic).

### Tier 2: Quantitative Mechanics
**Exercise 9.3:** A beam of particles of energy $E = 10.0\text{ keV}$ scatters off a repulsive Coulomb potential $U(r) = \alpha / r$, where $\alpha = 1.44 \times 10^{-9}\text{ eV}\cdot\text{m}$. Find the impact parameter that produces a deflection of $60.0^\circ$.  
**Exercise 9.4:** Calculate the differential cross section $\frac{d\sigma}{d\Omega}$ at $\theta = 45.0^\circ$ for an alpha particle ($E = 7.70\text{ MeV}$) scattering off a platinum nucleus ($Z = 78$).

### Tier 3: Multi-Stage Dynamics
**Exercise 9.5:** A spacecraft approaches Mars ($M = 6.42 \times 10^{23}\text{ kg}$, $R_{\text{Mars}} = 3,390\text{ km}$) with $v_\infty = 4.50\text{ km/s}$. What is the minimum possible periapsis altitude if the spacecraft must not enter Mars' atmosphere ($h_{\text{atm}} = 120\text{ km}$), and what is the maximum deflection angle $\delta_{\max}$ achievable without hitting the atmosphere?  
**Exercise 9.6:** A target foil of aluminum ($Z = 13$, density $\rho = 2.70\text{ g/cm}^3$, atomic mass $27.0\text{ g/mol}$, thickness $2.00\text{ }\mu\text{m}$) is bombarded by a proton beam of flux $I_0 = 5.00 \times 10^{12}\text{ protons}/(\text{m}^2\cdot\text{s})$ at $E = 2.00\text{ MeV}$. Find the number of protons scattered per hour into an annular ring between $\theta = 29.0^\circ$ and $\theta = 31.0^\circ$.

### Tier 4: Advanced Synthesis & Edge Cases
**Exercise 9.7:** Consider scattering off a rigid hemispherical bowl of radius $R$ facing the oncoming beam. If particles reflect specularly from the interior concave surface, determine the differential cross section $\frac{d\sigma}{d\Omega}(\theta)$.  
**Exercise 9.8:** Derive the differential cross section for an attractive Coulomb potential $U(r) = -k/r$ ($k > 0$) for unbound trajectories ($E > 0$), and show that it yields the identical functional form as repulsive Rutherford scattering.

### Tier 5: Olympiad / Research Challenge
**Exercise 9.9:** A particle scatters off a spherical delta-shell potential $V(r) = V_0 \delta(r - R)$ where $V_0 > 0$. Using classical mechanics, find the critical impact parameter $b_c$ below which particles penetrate the shell, and compute the total scattering cross section.  
**Exercise 9.10:** The Glory and Rainbow Scattering Phenomena: When particles scatter in a potential with an attractive well and repulsive core (such as Lennard-Jones molecular potentials), the deflection function $\theta(b)$ can develop a local extremum ($d\theta/db = 0$). Prove that at this impact parameter $b_r$, the classical differential cross section diverges as $( \theta - \theta_r )^{-1/2}$, and explain how wave mechanics regularizes this singularity (the Airy rainbow function).

---

## 9. Complete, Unabridged Solutions to Chapter Exercises

---

### Solution to Exercise 9.1
The total cross section is $\sigma_{\text{tot}} = 2\pi \int_0^\pi \frac{d\sigma}{d\Omega}\sin\theta\,d\theta$.
- For a hard sphere of radius $R$, the force is zero everywhere for $r > R$. Any particle with impact parameter $b > R$ experiences zero force and passes undeflected ($\theta = 0$). Thus the integration domain in impact parameter space is strictly bounded: $b \in [0, R]$, giving $\sigma_{\text{tot}} = \int_0^R 2\pi b\,db = \pi R^2$.
- For Rutherford scattering, the Coulomb potential $U(r) \propto 1/r$ has an infinite range. No matter how large the impact parameter $b$, the particle experiences a non-zero transverse force and undergoes a small but finite deflection $\theta \approx \frac{kq_1q_2}{Eb} > 0$. Integrating out to $b \to \infty$ integrates non-zero deflection over an infinite area, causing $\sigma_{\text{tot}} \to \infty$.

---

### Solution to Exercise 9.2
For a hard sphere of radius $R$, the relationship between impact parameter $b$ and scattering angle $\theta$ is $b = R \cos(\theta/2)$.
The differential cross section is:
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{R\cos(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{R}{2}\sin(\theta/2)\right] = \frac{R^2}{4}$$
All trigonometric dependencies on $\theta$ cancel out identically because the surface normal of a sphere varies linearly with central angle. As a result, the incident planar beam flux is redistributed with uniform probability density over the entire $4\pi$ steradians of the unit sphere.

---

### Solution to Exercise 9.3
1. **Formula:** $b(\theta) = \frac{\alpha}{2E} \cot(\theta/2)$.
2. **Given:** $\alpha = 1.44 \times 10^{-9}\text{ eV}\cdot\text{m}$, $E = 10.0\text{ keV} = 10,000\text{ eV}$, $\theta = 60.0^\circ$.
3. **Compute:**
   $$\theta/2 = 30.0^\circ \implies \cot(30.0^\circ) = \sqrt{3} \approx 1.73205$$
   $$b = \frac{1.44 \times 10^{-9}\text{ eV}\cdot\text{m}}{2 \times 10,000\text{ eV}} \times 1.73205 = (7.20 \times 10^{-14}\text{ m}) \times 1.73205 \approx \mathbf{1.247 \times 10^{-13}\text{ m} = 124.7\text{ fm}}$$

---

### Solution to Exercise 9.4
1. **Given:**
   - Alpha particle: $q_1 = 2e$. Platinum: $Z = 78 \implies q_2 = 78e$.
   - $E = 7.70\text{ MeV} = 7.70 \times 10^6 \times 1.602 \times 10^{-19}\text{ J} = 1.2335 \times 10^{-12}\text{ J}$.
   - $\theta = 45.0^\circ \implies \theta/2 = 22.5^\circ$.
2. **Compute Characteristic Pre-factor:**
   $$\frac{k q_1 q_2}{4E} = \frac{(8.988 \times 10^9) \times (2 \times 78) \times (1.602 \times 10^{-19})^2}{4 \times (1.2335 \times 10^{-12})} = \frac{3.5985 \times 10^{-26}}{4.934 \times 10^{-12}} \approx 7.293 \times 10^{-15}\text{ m}$$
3. **Compute Differential Cross Section:**
   $$\sin(22.5^\circ) \approx 0.382683 \implies \sin^4(22.5^\circ) \approx (0.382683)^4 \approx 0.021448$$
   $$\frac{d\sigma}{d\Omega} = \frac{(7.293 \times 10^{-15})^2}{0.021448} = \frac{5.319 \times 10^{-29}}{0.021448} \approx \mathbf{2.48 \times 10^{-27}\text{ m}^2/\text{sr} = 24.8\text{ barns/sr}}$$

---

### Solution to Exercise 9.5
1. **Minimum Periapsis:**
   $$r_p = R_{\text{Mars}} + h_{\text{atm}} = 3,390 + 120 = 3,510\text{ km} = 3.510 \times 10^6\text{ m}$$
2. **Gravitational Parameter of Mars:**
   $$\mu = G M = (6.674 \times 10^{-11}) \times (6.42 \times 10^{23}) \approx 4.2847 \times 10^{13}\text{ m}^3/\text{s}^2$$
3. **Eccentricity at Minimum Altitude:**
   $$\epsilon = 1 + \frac{r_p v_\infty^2}{\mu} = 1 + \frac{(3.510 \times 10^6) \times (4,500)^2}{4.2847 \times 10^{13}} = 1 + \frac{7.10775 \times 10^{13}}{4.2847 \times 10^{13}} = 1 + 1.6589 = 2.6589$$
4. **Maximum Deflection Angle:**
   $$\sin\left(\frac{\delta_{\max}}{2}\right) = \frac{1}{\epsilon} = \frac{1}{2.6589} \approx 0.3761$$
   $$\frac{\delta_{\max}}{2} = \arcsin(0.3761) \approx 22.09^\circ \implies \mathbf{\delta_{\max} \approx 44.2^\circ}$$

---

### Solution to Exercise 9.6
1. **Number Density of Target Nuclei:**
   $$n = \frac{\rho N_A}{M} = \frac{(2.70 \times 10^6\text{ g/m}^3) \times (6.022 \times 10^{23})}{27.0\text{ g/mol}} = 6.022 \times 10^{28}\text{ atoms/m}^3$$
2. **Areal Target Density:**
   $$n_{\text{area}} = n \times t = (6.022 \times 10^{28}) \times (2.00 \times 10^{-6}\text{ m}) = 1.2044 \times 10^{23}\text{ nuclei/m}^2$$
3. **Solid Angle of Annular Ring ($\theta = 30^\circ$, $d\theta = 2^\circ = 0.034907\text{ rad}$):**
   $$d\Omega = 2\pi \sin(30.0^\circ) d\theta = 2\pi (0.500) (0.034907) \approx 0.10966\text{ sr}$$
4. **Differential Cross Section at $30^\circ$:**
   - Protons on Al: $q_1 = e$, $q_2 = 13e$, $E = 2.00\text{ MeV} = 3.204 \times 10^{-13}\text{ J}$.
   - Pre-factor: $\frac{k q_1 q_2}{4E} = \frac{(8.988 \times 10^9)(13)(1.602 \times 10^{-19})^2}{4(3.204 \times 10^{-13})} \approx 2.342 \times 10^{-15}\text{ m}$.
   - $\sin^4(15^\circ) = (0.258819)^4 \approx 0.004487$.
   - $\frac{d\sigma}{d\Omega} = \frac{(2.342 \times 10^{-15})^2}{0.004487} \approx 1.222 \times 10^{-27}\text{ m}^2/\text{sr}$.
5. **Counts per Second:**
   $$\frac{dN}{dt} = I_0 \cdot n_{\text{area}} \cdot \left(\frac{d\sigma}{d\Omega}\right) \cdot d\Omega = (5.00 \times 10^{12}) \times (1.2044 \times 10^{23}) \times (1.222 \times 10^{-27}) \times (0.10966) \approx 80.7\text{ protons/s}$$
6. **Counts per Hour ($3600\text{ s}$):**
   $$N_{\text{hour}} = 80.7 \times 3600 \approx \mathbf{290,500\text{ protons/hour}}$$

---

### Solution to Exercise 9.7
For specular reflection inside a concave hemisphere, incoming parallel rays with impact parameter $b \le R$ strike the interior wall at an angle of incidence $\alpha$ with the normal where $\sin\alpha = b/R$. The reflected ray crosses the axis of symmetry, making a total deflection angle $\theta = 2\alpha$.
Thus:
$$\sin(\theta/2) = \frac{b}{R} \implies b = R \sin(\theta/2)$$
Differentiating:
$$\left|\frac{db}{d\theta}\right| = \frac{R}{2} \cos(\theta/2)$$
Differential cross section:
$$\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} \left|\frac{db}{d\theta}\right| = \frac{R\sin(\theta/2)}{2\sin(\theta/2)\cos(\theta/2)} \left[\frac{R}{2}\cos(\theta/2)\right] = \mathbf{\frac{R^2}{4}}$$
The concave bowl also scatters isotropically into the forward reflection hemisphere!

---

### Solution to Exercise 9.8
For an attractive potential $U(r) = -k/r$, the trajectory is a hyperbola where the center of attraction is at the *interior* focus.
The hyperbolic asymptotes have the same angle relationship with the impact parameter:
$$b = \frac{k}{2E} \cot(\theta/2)$$
Because the differential cross section depends only on $b$, $\sin\theta$, and $|db/d\theta|$:
$$\left|\frac{db}{d\theta}\right| = \frac{k}{4E \sin^2(\theta/2)}$$
Substituting gives the exact same formula:
$$\mathbf{\frac{d\sigma}{d\Omega}(\theta) = \left(\frac{k}{4E}\right)^2 \frac{1}{\sin^4(\theta/2)}}$$
Classical Coulomb scattering is completely symmetric between attraction and repulsion!

---

### Solution to Exercise 9.9
1. Inside the shell ($r < R$), $V = 0$. On the shell, potential is a step barrier of height $V_0$.
2. For a particle with radial kinetic energy $E_{\text{rad}} = E(1 - b^2/R^2)$:
   - If $E_{\text{rad}} > V_0$, the particle penetrates the shell.
   - If $E_{\text{rad}} < V_0$, the particle reflects specularly from the exterior sphere $r = R$.
3. Critical impact parameter:
   $$E \left(1 - \frac{b_c^2}{R^2}\right) = V_0 \implies \mathbf{b_c = R \sqrt{1 - \frac{V_0}{E}}}$$
4. Total cross section for reflection:
   $$\sigma_{\text{reflect}} = \pi b_c^2 = \mathbf{\pi R^2 \left(1 - \frac{V_0}{E}\right)}$$

---

### Solution to Exercise 9.10
1. When $\theta(b)$ has a local extremum at $b = b_r$, a Taylor expansion gives:
   $$\theta(b) = \theta_r + \frac{1}{2}\theta''(b_r)(b - b_r)^2$$
   $$|b - b_r| = \sqrt{\frac{2}{|\theta''(b_r)|}} |\theta - \theta_r|^{1/2}$$
2. Differentiating:
   $$\left|\frac{db}{d\theta}\right| = \frac{1}{\sqrt{2 |\theta''(b_r)|}} |\theta - \theta_r|^{-1/2}$$
3. Substituting into $\frac{d\sigma}{d\Omega} = \frac{b}{\sin\theta} |db/d\theta|$ yields:
   $$\mathbf{\frac{d\sigma}{d\Omega} \propto \frac{1}{\sqrt{|\theta - \theta_r|}} \to \infty}$$
4. **Regularization:** In wave mechanics, the ray caustic corresponds to a confluence of stationary phase points. Integrating the wave amplitude over the cubic phase wavefront replaces the infinite singularity with the smooth, oscillatory **Airy function** $\text{Ai}(x)$, which produces the supernumerary arcs of natural atmospheric rainbows!
