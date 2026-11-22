# Chapter 05: One-Dimensional Elastic Collisions — Velocity Exchange, Relative Speed Invariance, and Center-of-Mass Symmetry

> *"In a perfectly elastic collision, nature achieves dynamic perfection. Not a single quantum of kinetic energy is surrendered to heat or acoustic noise. The collision is an instantaneous dance of pure elastic compression and rebound, governed by the sacred invariance of relative speed."*

---

## 5.1 The Definition of Elastic Perfection

Throughout daily life, almost every collision we observe is partially or completely inelastic: when cars crash, metal crunches and absorbs energy; when a drop of clay strikes the floor, it flattens and sticks; when two wooden billiard balls strike each other, a sharp acoustic "clack" radiates sound energy into the surrounding air.

However, in the fundamental mechanics of idealized hard spheres—and with high precision in the atomic, subatomic, and low-energy nuclear realms—there exists a distinct physical regime: **The Perfectly Elastic Collision**.

A collision is defined as **perfectly elastic** if and only if it satisfies two simultaneous conservation laws:
1. **Conservation of Linear Momentum:** The total vector momentum is invariant across the collision:
   $$\vec{P}_{\text{total, initial}} = \vec{P}_{\text{total, final}} \iff \sum_{i} m_i \vec{v}_{i,\text{init}} = \sum_{i} m_i \vec{v}_{i,\text{final}}$$
2. **Conservation of Mechanical Kinetic Energy:** The total mechanical kinetic energy of all translating bodies before the collision equals the total mechanical kinetic energy after separation:
   $$K_{\text{total, initial}} = K_{\text{total, final}} \iff \sum_{i} \frac{1}{2} m_i v_{i,\text{init}}^2 = \sum_{i} \frac{1}{2} m_i v_{i,\text{final}}^2$$

During the microscopic microsecond of maximum compression, kinetic energy is temporarily stored as elastic potential energy $U_{\text{elastic}}$ in the atomic lattices of the colliding bodies. In a perfectly elastic impact, **one hundred percent** of this stored potential energy is returned to macroscopic kinetic motion during the restitution phase, leaving zero residual thermal excitation or structural distortion.

---

## 5.2 Mathematical Derivation: The 1D Canonical Velocity Equations

Consider two particles of masses $m_1$ and $m_2$ constrained to move along a single horizontal axis (the $x$-axis).
- Let $v_{1i}$ and $v_{2i}$ denote their initial velocities before impact.
- Let $v_{1f}$ and $v_{2f}$ denote their final velocities after separation.

```
       Before Collision:
              v1i --->                      v2i --->
            ( m1 )                        ( m2 )
       =========================================================

       After Collision:
              v1f --->                      v2f --->
            ( m1 )                        ( m2 )
       =========================================================
```

### 1. The Momentum Conservation Equation
$$\sum p_{\text{init}} = \sum p_{\text{final}} \implies m_1 v_{1i} + m_2 v_{2i} = m_1 v_{1f} + m_2 v_{2f}$$

Group terms by mass ($m_1$ on the left, $m_2$ on the right):

$$m_1 (v_{1i} - v_{1f}) = m_2 (v_{2f} - v_{2i}) \qquad \text{(Eq. 5.1)}$$

### 2. The Kinetic Energy Conservation Equation
$$\frac{1}{2} m_1 v_{1i}^2 + \frac{1}{2} m_2 v_{2i}^2 = \frac{1}{2} m_1 v_{1f}^2 + \frac{1}{2} m_2 v_{2f}^2$$

Cancel the universal factor of $\frac{1}{2}$ and group terms by mass:

$$m_1 (v_{1i}^2 - v_{1f}^2) = m_2 (v_{2f}^2 - v_{2i}^2) \qquad \text{(Eq. 5.2)}$$

### 3. Factoring the Difference of Squares
Recall the algebraic identity $a^2 - b^2 = (a - b)(a + b)$. Expand Eq. 5.2:

$$m_1 (v_{1i} - v_{1f})(v_{1i} + v_{1f}) = m_2 (v_{2f} - v_{2i})(v_{2f} + v_{2i}) \qquad \text{(Eq. 5.3)}$$

Now divide Eq. 5.3 by Eq. 5.1 (assuming non-zero interaction, so $v_{1f} \ne v_{1i}$):

$$\frac{m_1 (v_{1i} - v_{1f})(v_{1i} + v_{1f})}{m_1 (v_{1i} - v_{1f})} = \frac{m_2 (v_{2f} - v_{2i})(v_{2f} + v_{2i})}{m_2 (v_{2f} - v_{2i})}$$

The mass terms and differences cancel cleanly, leaving an extraordinarily simple linear relation:

$$v_{1i} + v_{1f} = v_{2f} + v_{2i}$$

Rearranging terms:

$$v_{2f} - v_{1f} = -(v_{2i} - v_{1i}) \qquad \text{(Eq. 5.4)}$$

### The Relative Speed Invariance Theorem
Define the relative velocity of Body 2 with respect to Body 1:
- Relative velocity of approach before impact: $\vec{v}_{\text{rel, init}} = v_{2i} - v_{1i}$
- Relative velocity of separation after impact: $\vec{v}_{\text{rel, final}} = v_{2f} - v_{1f}$

Eq. 5.4 establishes one of the most elegant theorems of classical mechanics:

$$\vec{v}_{\text{rel, final}} = -\vec{v}_{\text{rel, init}} \iff |v_{2f} - v_{1f}| = |v_{2i} - v_{1i}|$$

**The Relative Speed Invariance Theorem:**
> *In any one-dimensional perfectly elastic collision, the relative speed of separation after the collision is identically equal to the relative speed of approach before the collision!*

The collision merely reverses the sign of the relative velocity vector while preserving its scalar magnitude.

---

## 5.3 Closed-Form Analytical Velocity Solutions

Eq. 5.1 and Eq. 5.4 form a linear system of two equations in two unknowns ($v_{1f}$ and $v_{2f}$):
1. $m_1 v_{1f} + m_2 v_{2f} = m_1 v_{1i} + m_2 v_{2i}$
2. $v_{2f} - v_{1f} = v_{1i} - v_{2i} \implies v_{2f} = v_{1f} + v_{1i} - v_{2i}$

Substitute $v_{2f}$ into the momentum equation:

$$m_1 v_{1f} + m_2 (v_{1f} + v_{1i} - v_{2i}) = m_1 v_{1i} + m_2 v_{2i}$$

$$(m_1 + m_2) v_{1f} + m_2 v_{1i} - m_2 v_{2i} = m_1 v_{1i} + m_2 v_{2i}$$

$$(m_1 + m_2) v_{1f} = (m_1 - m_2) v_{1i} + 2 m_2 v_{2i}$$

Dividing by $(m_1 + m_2)$:

$$v_{1f} = \left(\frac{m_1 - m_2}{m_1 + m_2}\right) v_{1i} + \left(\frac{2m_2}{m_1 + m_2}\right) v_{2i} \qquad \text{(Eq. 5.5)}$$

By perfect algebraic symmetry (swapping indices $1 \leftrightarrow 2$):

$$v_{2f} = \left(\frac{2m_1}{m_1 + m_2}\right) v_{1i} + \left(\frac{m_2 - m_1}{m_1 + m_2}\right) v_{2i} \qquad \text{(Eq. 5.6)}$$

These are the **Canonical One-Dimensional Elastic Collision Equations**.

---

## 5.4 Analysis of Fundamental Mass Ratio Regimes

The power of Eqs. 5.5 and 5.6 is demonstrated by examining four fundamental limiting regimes.

```
+---------------------------------------------------------------------------------------------------+
|                           FOUR REGIMES OF 1D ELASTIC COLLISIONS                                   |
+--------------------------+-----------------------+-----------------------+------------------------+
| Mass Regime              | Condition             | Final Velocity v_1f   | Final Velocity v_2f    |
+--------------------------+-----------------------+-----------------------+------------------------+
| 1. Equal Masses          | m1 = m2 = m           | v_1f = v_2i           | v_2f = v_1i            |
| 2. Stationary Target     | v_2i = 0              | v_1f = (m1-m2)/(m1+m2)*v_1i | v_2f = 2m1/(m1+m2)*v_1i|
| 3. Massive Projectile    | m1 >> m2, v_2i = 0    | v_1f ≈ v_1i           | v_2f ≈ 2 v_1i          |
| 4. Heavy Wall Target     | m1 << m2, v_2i = 0    | v_1f ≈ -v_1i          | v_2f ≈ 0               |
+--------------------------+-----------------------+-----------------------+------------------------+
```

### Regime 1: Identical Masses ($m_1 = m_2$) — Perfect Velocity Exchange
When the colliding bodies have identical masses:
- $m_1 - m_2 = 0$
- $\frac{2m_2}{m_1 + m_2} = \frac{2m}{2m} = 1$
- $\frac{2m_1}{m_1 + m_2} = 1$

Equations 5.5 and 5.6 collapse to:

$$v_{1f} = v_{2i}, \qquad v_{2f} = v_{1i}$$

**The Velocity Exchange Theorem:**
> *When two equal masses collide elastically in one dimension, they completely and perfectly exchange their velocities!*

If Ball 1 approaches with velocity $v_{1i}$ and strikes stationary Ball 2 ($v_{2i} = 0$):
- Ball 1 stops dead in its tracks: $v_{1f} = 0$.
- Ball 2 shoots forward with the exact speed of Ball 1: $v_{2f} = v_{1i}$.
This is the physical engine driving **Newton’s Cradle** and billiard cue-ball stop shots.

```
       Newton's Cradle (Equal Mass Elastic Exchange):
       (o) --->        (o)(o)(o)(o)             stops dead      (o)(o)(o)     ---> (o)
        1                   2 3 4 5  ==Impact==>    1             2 3 4          5
       (Mass m)            (Mass m)                 v1f = 0                     v5f = v1i
```

### Regime 2: Massive Projectile Striking Light Stationary Target ($m_1 \gg m_2, v_{2i} = 0$)
Let a massive bowling ball or freight train ($m_1$) strike a stationary table-tennis ball ($m_2$).
In the limit as $m_2 / m_1 \to 0$:
$$\frac{m_1 - m_2}{m_1 + m_2} = \frac{1 - m_2/m_1}{1 + m_2/m_1} \to 1 \implies v_{1f} \approx v_{1i}$$
$$\frac{2m_1}{m_1 + m_2} = \frac{2}{1 + m_2/m_1} \to 2 \implies v_{2f} \approx 2 v_{1i}$$

**The Double-Velocity Ejection Rule:**
> *When an overwhelmingly massive projectile strikes a stationary lightweight particle elastically, the projectile continues forward essentially unhindered, while the lightweight particle is ejected forward at TWICE the speed of the projectile!*

This principle is exploited in baseball and tennis: a massive swinging bat ($m_1 \approx 900\,\text{g}$) moving at $v_{\text{bat}}$ imparts a massive velocity boost to the lighter ball ($m_2 \approx 145\,\text{g}$).

### Regime 3: Lightweight Projectile Striking Immovable Barrier ($m_1 \ll m_2, v_{2i} = 0$)
Let a tennis ball ($m_1$) strike a concrete wall or Earth itself ($m_2 \to \infty$).
In the limit as $m_1 / m_2 \to 0$:
$$\frac{m_1 - m_2}{m_1 + m_2} \to -1 \implies v_{1f} \approx -v_{1i}$$
$$\frac{2m_1}{m_1 + m_2} \to 0 \implies v_{2f} \approx 0$$
The light projectile rebounds with the **exact same speed in the opposite direction** ($v_{1f} = -v_{1i}$), while the barrier absorbs momentum without noticeable motion.

---

## 5.5 The Center-of-Mass Frame: Kinematic Mirror Symmetry

Calculating elastic collisions in the laboratory frame requires non-trivial algebra. However, if we transform to the **Center-of-Mass (Zero-Momentum) Frame**, the collision becomes trivial.

Recall from Chapter 04 that in the C-frame:

$$\vec{P}'_{\text{total}} = m_1 \vec{u}'_{1i} + m_2 \vec{u}'_{2i} \equiv \vec{0} \implies u'_{2i} = -\frac{m_1}{m_2} u'_{1i}$$

Total kinetic energy in the C-frame before impact:

$$K'_{\text{init}} = \frac{1}{2} m_1 (u'_{1i})^2 + \frac{1}{2} m_2 (u'_{2i})^2 = \frac{1}{2} m_1 (u'_{1i})^2 + \frac{1}{2} m_2 \left( \frac{m_1}{m_2} u'_{1i} \right)^2 = \frac{1}{2} m_1 \left(1 + \frac{m_1}{m_2}\right) (u'_{1i})^2$$

After the collision, momentum must still sum to zero ($u'_{2f} = -\frac{m_1}{m_2} u'_{1f}$), and kinetic energy must be conserved ($K'_{\text{final}} = K'_{\text{init}}$):

$$\frac{1}{2} m_1 \left(1 + \frac{m_1}{m_2}\right) (u'_{1f})^2 = \frac{1}{2} m_1 \left(1 + \frac{m_1}{m_2}\right) (u'_{1i})^2 \implies (u'_{1f})^2 = (u'_{1i})^2$$

Taking the non-trivial root (rebound):

$$u'_{1f} = -u'_{1i}$$

$$u'_{2f} = -u'_{2i}$$

```
   Laboratory Frame (Asymmetric):
         v1i --->           v2i --->
       [  m1  ]           [   m2   ]
       V_CM = (m1*v1i + m2*v2i) / (m1 + m2)

   Center-of-Mass Frame (Pure Mirror Symmetry):
         u'1i --->         <--- u'2i
       [  m1  ]           [   m2   ]
       Total Momentum = 0

   After Collision in C-Frame:
       <--- u'1f = -u'1i   u'2f = -u'2i --->
       [  m1  ]           [   m2   ]
       Velocities simply REVERSE SIGN!
```

**The Center-of-Mass Elastic Reflection Theorem:**
> *In the Center-of-Mass reference frame, an elastic collision is mathematically identical to an instantaneous mirror reflection! Each particle rebounds with its magnitude of velocity unchanged ($|u'_f| = |u'_i|$), simply reversing its direction.*

To find laboratory velocities, simply add $V_{\text{CM}}$:

$$v_{1f} = u'_{1f} + V_{\text{CM}} = -u'_{1i} + V_{\text{CM}} = -(v_{1i} - V_{\text{CM}}) + V_{\text{CM}} = 2V_{\text{CM}} - v_{1i}$$

$$v_{2f} = 2V_{\text{CM}} - v_{2i}$$

This formula computes post-collision velocities in a single algebraic line!

---

## 5.6 Fractional Kinetic Energy Transfer and Nuclear Moderation

Suppose Body 1 of mass $m_1$ is fired at initial speed $v_{1i}$ into a stationary target ($m_2$, $v_{2i} = 0$).
How much kinetic energy is transferred to target Body 2?

Final velocity of target:

$$v_{2f} = \frac{2m_1}{m_1 + m_2} v_{1i}$$

Kinetic energy gained by target:

$$K_{2f} = \frac{1}{2} m_2 v_{2f}^2 = \frac{1}{2} m_2 \left( \frac{2m_1}{m_1 + m_2} v_{1i} \right)^2 = \frac{1}{2} m_2 \frac{4 m_1^2}{(m_1 + m_2)^2} v_{1i}^2$$

The initial kinetic energy of the projectile was $K_{1i} = \frac{1}{2} m_1 v_{1i}^2$.
Taking the ratio $\Delta K / K_{1i}$:

$$\frac{K_{2f}}{K_{1i}} = \frac{4 m_1 m_2}{(m_1 + m_2)^2}$$

Let us analyze this fraction as a function of the mass ratio $r = m_1 / m_2$:

$$\frac{K_{2f}}{K_{1i}} = \frac{4r}{(1 + r)^2}$$

To find the maximum energy transfer, take the derivative with respect to $r$ and set to zero:

$$\frac{d}{dr}\left[ \frac{4r}{(1 + r)^2} \right] = \frac{4(1+r)^2 - 4r \cdot 2(1+r)}{(1+r)^4} = \frac{4(1+r) - 8r}{(1+r)^3} = \frac{4 - 4r}{(1+r)^3} = 0 \implies r = 1$$

$$m_1 = m_2 \implies \frac{K_{2f}}{K_{1i}} = \frac{4(1)}{(1+1)^2} = \frac{4}{4} = 1.00 \implies \mathbf{100\%}$$

```
   Fractional Energy Transfer K_2f / K_1i
     1.0 -+                         * (Peak at m1 = m2: 100% transfer)
          |                       /   \
      0.8 -+                      /     \
          |                     /       \
      0.6 -+                    /         \
          |                   /           \
      0.4 -+                  /             \
          |                 /               ' - - - -
      0.2 -+               /                          ' - - -
        0 +---------------+-------------------------------------> Mass Ratio m1/m2
          0              1.0               2.0               3.0
```

### Why Nuclear Reactors Use Water (Neutron Moderation)
In a nuclear fission reactor, uranium-235 splits and ejects "fast neutrons" with kinetic energy $E \approx 2\,\text{MeV}$ ($v \approx 20,000\,\text{km/s}$). To induce further fission chains, these neutrons must be slowed down ("thermalized") to $E \approx 0.025\,\text{eV}$ ($v \approx 2.2\,\text{km/s}$).

How do nuclear engineers slow down fast neutrons? By colliding them elastically with stationary nuclei!
- If a neutron ($m_n \approx 1\,\text{u}$) collides with a heavy Lead nucleus ($^{208}\text{Pb}$, $m \approx 208\,\text{u}$):
  $$\frac{K_2}{K_1} = \frac{4(1)(208)}{(209)^2} = \frac{832}{43,681} \approx 0.019 \implies 1.9\% \text{ energy loss per collision}$$
  It would take thousands of collisions to slow down the neutron.
- If a neutron collides with a Hydrogen nucleus (a single proton, $m_p \approx 1\,\text{u}$ in ordinary water $\text{H}_2\text{O}$):
  $$m_n \approx m_p \implies \frac{K_2}{K_1} \approx 1.00 \implies \mathbf{100\%} \text{ head-on energy transfer!}$$
  In water or heavy water ($\text{D}_2\text{O}$), a fast neutron is thermalized in barely **20 to 30 collisions**!

---

## 5.7 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 5.1: Head-On Billiard Ball Impact
**Problem:** A white cue ball of mass $m_1 = 0.170\,\text{kg}$ rolls across a slate table at $v_{1i} = +4.00\,\text{m/s}$ and strikes an identical red 8-ball ($m_2 = 0.170\,\text{kg}$) initially at rest ($v_{2i} = 0$). Assuming a perfectly elastic 1D collision:
1. Calculate the final velocities $v_{1f}$ and $v_{2f}$.
2. Verify conservation of mechanical kinetic energy.

**Solution:**
- **Step 1: Canonical velocity calculation**
  Since $m_1 = m_2 = 0.170\,\text{kg}$:
  $$v_{1f} = \left(\frac{m_1 - m_2}{m_1 + m_2}\right) v_{1i} + \left(\frac{2m_2}{m_1 + m_2}\right) v_{2i} = (0)(4.00) + (1)(0) = 0.00\,\text{m/s}$$
  $$v_{2f} = \left(\frac{2m_1}{m_1 + m_2}\right) v_{1i} + \left(\frac{m_2 - m_1}{m_1 + m_2}\right) v_{2i} = (1)(4.00) + (0)(0) = +4.00\,\text{m/s}$$
  The cue ball stops completely; the 8-ball shoots forward at $4.00\,\text{m/s}$.

- **Step 2: Kinetic energy check**
  $$K_{\text{init}} = \frac{1}{2}(0.170)(4.00)^2 = 0.5 \times 0.170 \times 16.0 = 1.360\,\text{J}$$
  $$K_{\text{final}} = \frac{1}{2}(0.170)(4.00)^2 = 1.360\,\text{J}$$
  $K_{\text{init}} \equiv K_{\text{final}}$. Verified.

---

### Example 5.2: Asymmetric Collision with Moving Target
**Problem:** Cart 1 of mass $m_1 = 2.00\,\text{kg}$ moves rightward at $v_{1i} = +6.00\,\text{m/s}$. Cart 2 of mass $m_2 = 5.00\,\text{kg}$ moves leftward at $v_{2i} = -3.00\,\text{m/s}$. They collide elastically on a frictionless track.
1. Determine the post-collision velocities $v_{1f}$ and $v_{2f}$.
2. Verify the Relative Speed Invariance Theorem.

**Solution:**
- **Step 1: Velocity calculation**
  $$m_1 + m_2 = 2.00 + 5.00 = 7.00\,\text{kg}$$
  $$m_1 - m_2 = 2.00 - 5.00 = -3.00\,\text{kg}$$
  - For Cart 1:
    $$v_{1f} = \left(\frac{-3.00}{7.00}\right)(+6.00) + \left(\frac{2(5.00)}{7.00}\right)(-3.00) = \frac{-18.00 - 30.00}{7.00} = \frac{-48.00}{7.00} = -6.8571\,\text{m/s}$$
  - For Cart 2:
    $$v_{2f} = \left(\frac{2(2.00)}{7.00}\right)(+6.00) + \left(\frac{5.00 - 2.00}{7.00}\right)(-3.00) = \frac{+24.00 + 3.00(-3.00)}{7.00} = \frac{24.00 - 9.00}{7.00} = \frac{+15.00}{7.00} = +2.1429\,\text{m/s}$$

- **Step 2: Relative speed check**
  - Relative velocity of approach:
    $$v_{\text{rel, init}} = v_{2i} - v_{1i} = -3.00 - (+6.00) = -9.00\,\text{m/s} \implies |v_{\text{rel, init}}| = 9.00\,\text{m/s}$$
  - Relative velocity of separation:
    $$v_{\text{rel, final}} = v_{2f} - v_{1f} = +2.1429 - (-6.8571) = +9.0000\,\text{m/s}$$
    $$\vec{v}_{\text{rel, final}} = -\vec{v}_{\text{rel, init}}$$
  Relative speed of separation matches approach speed identically ($9.00\,\text{m/s}$).

---

### Example 5.3: Heavy Locomotive Striking Stalled Handcar
**Problem:** A switching locomotive of mass $M = 80,000\,\text{kg}$ rolls along a track at $v_0 = 12.0\,\text{m/s}$ and strikes an unbraked track inspection handcar of mass $m = 400.0\,\text{kg}$ initially at rest ($v = 0$). Assuming an elastic spring-bumper collision:
1. Compute the final speed of the handcar $v_{hf}$.
2. Compute the reduction in speed of the locomotive $\Delta V$.

**Solution:**
- **Step 1: Handcar final speed**
  $$v_{hf} = \frac{2M}{M + m} v_0 = \frac{2(80,000)}{80,000 + 400} (12.0\,\text{m/s}) = \frac{160,000}{80,400}(12.0) = (1.99005)(12.0) = 23.881\,\text{m/s}$$
  Notice that $v_{hf} \approx 2 v_0 = 24.0\,\text{m/s}$ (Double-Velocity Ejection Rule!).

- **Step 2: Locomotive speed change**
  $$V_f = \frac{M - m}{M + m} v_0 = \frac{80,000 - 400}{80,400}(12.0) = \frac{79,600}{80,400}(12.0) = (0.99005)(12.0) = 11.881\,\text{m/s}$$
  $$\Delta V = V_0 - V_f = 12.0 - 11.881 = 0.119\,\text{m/s} \approx 0.99\%$$
  The massive locomotive barely notices the collision, while the handcar is hurled forward at nearly $24\,\text{m/s}$ ($86\,\text{km/h}$)!

---

### Example 5.4: Subatomic Alpha-Proton Collision
**Problem:** In a cloud chamber, an alpha particle ($m_\alpha = 4.00\,\text{u}$) with kinetic energy $K_0 = 5.00\,\text{MeV}$ collides head-on elastically with a stationary hydrogen nucleus (proton, $m_p = 1.00\,\text{u}$).
1. Calculate the fraction of initial kinetic energy transferred to the proton.
2. Compute the final kinetic energies $K_p$ and $K_\alpha$.
3. Compute the ratio of the final speeds $v_p / v_\alpha$.

**Solution:**
- **Step 1: Fractional energy transfer**
  $$r = \frac{m_\alpha}{m_p} = \frac{4.00}{1.00} = 4.00$$
  $$\frac{K_p}{K_0} = \frac{4 m_\alpha m_p}{(m_\alpha + m_p)^2} = \frac{4(4.00)(1.00)}{(4.00 + 1.00)^2} = \frac{16.00}{25.00} = 0.6400 \implies 64.00\%$$

- **Step 2: Final kinetic energies**
  $$K_p = 0.6400 \times 5.00\,\text{MeV} = 3.200\,\text{MeV}$$
  $$K_\alpha = K_0 - K_p = 5.00 - 3.200 = 1.800\,\text{MeV}$$

- **Step 3: Speed ratio**
  $$K = \frac{1}{2} m v^2 \implies v = \sqrt{\frac{2K}{m}}$$
  $$\frac{v_p}{v_\alpha} = \sqrt{\frac{K_p / m_p}{K_\alpha / m_\alpha}} = \sqrt{\frac{3.200 / 1.00}{1.800 / 4.00}} = \sqrt{\frac{3.200}{0.450}} = \sqrt{7.111} = 2.667 = \frac{8}{3}$$
  *Check via Canonical formula:*
  $$v_p = \frac{2m_\alpha}{m_\alpha + m_p} v_0 = \frac{2(4)}{5} v_0 = 1.60 v_0$$
  $$v_\alpha = \frac{m_\alpha - m_p}{m_\alpha + m_p} v_0 = \frac{4 - 1}{5} v_0 = 0.60 v_0$$
  $$\frac{v_p}{v_\alpha} = \frac{1.60}{0.60} = \frac{8}{3} \approx 2.667$$. Flawless agreement!

---

### Example 5.5: Center-of-Mass Frame Shortcut Solution
**Problem:** Block A ($m_1 = 3.00\,\text{kg}$) moves at $v_{1i} = +10.0\,\text{m/s}$ and strikes Block B ($m_2 = 7.00\,\text{kg}$) moving at $v_{2i} = +2.00\,\text{m/s}$.
Solve for the post-collision velocities $v_{1f}$ and $v_{2f}$ using exclusively the **Center-of-Mass mirror reflection method**.

**Solution:**
- **Step 1: Compute Center of Mass velocity**
  $$V_{\text{CM}} = \frac{m_1 v_{1i} + m_2 v_{2i}}{m_1 + m_2} = \frac{(3.00)(10.0) + (7.00)(2.00)}{3.00 + 7.00} = \frac{30.0 + 14.0}{10.00} = \frac{44.0}{10.00} = +4.40\,\text{m/s}$$

- **Step 2: Transform to C-frame**
  $$u'_{1i} = v_{1i} - V_{\text{CM}} = 10.0 - 4.40 = +5.60\,\text{m/s}$$
  $$u'_{2i} = v_{2i} - V_{\text{CM}} = 2.00 - 4.40 = -2.40\,\text{m/s}$$

- **Step 3: Mirror reflection in C-frame**
  $$u'_{1f} = -u'_{1i} = -5.60\,\text{m/s}$$
  $$u'_{2f} = -u'_{2i} = +2.40\,\text{m/s}$$

- **Step 4: Transform back to laboratory frame**
  $$v_{1f} = u'_{1f} + V_{\text{CM}} = -5.60 + 4.40 = -1.20\,\text{m/s}$$
  $$v_{2f} = u'_{2f} + V_{\text{CM}} = +2.40 + 4.40 = +6.80\,\text{m/s}$$
  *Verification:* $3(-1.20) + 7(6.80) = -3.60 + 47.60 = 44.0\,\text{kg}\cdot\text{m/s} = P_{\text{init}}$.

---

### Example 5.6: Three-Ball Cascade Amplifier (Super-Elastic Illusion)
**Problem:** Three frictionless spheres are arranged in a straight line on a track:
- Ball 1: $m_1 = 9.00\,\text{kg}$, moving rightward at $v_1 = 4.00\,\text{m/s}$.
- Ball 2: $m_2 = 3.00\,\text{kg}$, initially at rest ($v_2 = 0$).
- Ball 3: $m_3 = 1.00\,\text{kg}$, initially at rest ($v_3 = 0$).
Ball 1 strikes Ball 2 elastically. Then Ball 2 shoots forward and strikes Ball 3 elastically.
1. Compute the velocity of Ball 2 after the first collision.
2. Compute the final velocity of Ball 3 after the second collision.
3. Compare the final kinetic energy of Ball 3 to the initial kinetic energy of Ball 1.

**Solution:**
- **Step 1: Collision 1 ($m_1 \to m_2$)**
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_1 = \frac{2(9.00\,\text{kg})}{9.00 + 3.00\,\text{kg}} (4.00\,\text{m/s}) = \frac{18.0}{12.0}(4.00) = 1.50 \times 4.00 = +6.00\,\text{m/s}$$
  Ball 2 departs at $6.00\,\text{m/s}$.

- **Step 2: Collision 2 ($m_2 \to m_3$)**
  Now Ball 2 ($m_2 = 3.00\,\text{kg}$) moves at $v_{2i}' = 6.00\,\text{m/s}$ toward stationary Ball 3 ($m_3 = 1.00\,\text{kg}$):
  $$v_{3f} = \frac{2 m_2}{m_2 + m_3} v_{2i}' = \frac{2(3.00\,\text{kg})}{3.00 + 1.00\,\text{kg}} (6.00\,\text{m/s}) = \frac{6.00}{4.00}(6.00) = 1.50 \times 6.00 = +9.00\,\text{m/s}$$
  Ball 3 accelerates to $9.00\,\text{m/s}$!

- **Step 3: Energy comparison**
  - Initial energy of Ball 1:
    $$K_1 = \frac{1}{2} m_1 v_1^2 = \frac{1}{2}(9.00\,\text{kg})(4.00\,\text{m/s})^2 = 4.50 \times 16.0 = 72.0\,\text{J}$$
  - Final energy of Ball 3:
    $$K_3 = \frac{1}{2} m_3 v_{3f}^2 = \frac{1}{2}(1.00\,\text{kg})(9.00\,\text{m/s})^2 = 0.50 \times 81.0 = 40.5\,\text{J}$$
  $$\frac{K_3}{K_1} = \frac{40.5}{72.0} = 0.5625 \implies 56.25\%$$
  The decreasing mass sequence acts as a **velocity amplifier**: speed more than doubled from $4.0\,\text{m/s}$ to $9.0\,\text{m/s}$! This is the physical mechanism of multi-stage supernova envelope ejection and whip-cracking.

---

### Example 5.7: Elastic Collision of Hanging Pendulums
**Problem:** Two simple pendulums of equal string length $L = 1.50\,\text{m}$ hang side-by-side with their bobs barely touching. Bob 1 has mass $m_1 = 0.200\,\text{kg}$; Bob 2 has mass $m_2 = 0.600\,\text{kg}$.
Bob 1 is pulled aside to a height $h_1 = 0.450\,\text{m}$ above its lowest point and released from rest. It collides elastically with stationary Bob 2 at the bottom. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the speed $v_{1i}$ of Bob 1 just before impact.
2. Determine the velocities $v_{1f}$ and $v_{2f}$ immediately after impact.
3. Calculate the maximum rebound heights $h_1'$ and $h_2'$ reached by each bob.

**Solution:**
- **Step 1: Impact speed of Bob 1**
  $$v_{1i} = \sqrt{2 g h_1} = \sqrt{2(9.81\,\text{m/s}^2)(0.450\,\text{m})} = \sqrt{8.829} = 2.9714\,\text{m/s}$$

- **Step 2: Post-collision velocities**
  $$m_1 + m_2 = 0.200 + 0.600 = 0.800\,\text{kg}$$
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{0.200 - 0.600}{0.800} (2.9714) = \frac{-0.400}{0.800}(2.9714) = -0.500(2.9714) = -1.4857\,\text{m/s}$$
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_{1i} = \frac{2(0.200)}{0.800} (2.9714) = +0.500(2.9714) = +1.4857\,\text{m/s}$$
  Bob 1 rebounds backward at $1.486\,\text{m/s}$; Bob 2 swings forward at $1.486\,\text{m/s}$.

- **Step 3: Maximum rebound heights**
  $$h_1' = \frac{v_{1f}^2}{2g} = \frac{(-1.4857\,\text{m/s})^2}{2(9.81\,\text{m/s}^2)} = \frac{2.2073}{19.62} = 0.1125\,\text{m} = \frac{h_1}{4}$$
  $$h_2' = \frac{v_{2f}^2}{2g} = \frac{(+1.4857\,\text{m/s})^2}{2(9.81\,\text{m/s}^2)} = 0.1125\,\text{m}$$
  Both bobs rise to exactly one-quarter of the original release height ($11.25\,\text{cm}$).

---

### Example 5.8: Maximum Compression of Buffer Spring During Elastic Impact
**Problem:** Cart 1 of mass $m_1 = 3.00\,\text{kg}$ rolls at $v_0 = 4.00\,\text{m/s}$ toward stationary Cart 2 of mass $m_2 = 6.00\,\text{kg}$. Cart 2 is equipped with an ideal horizontal bumper spring of stiffness $k = 1800\,\text{N/m}$. All track friction is zero.
1. Determine the velocity of the carts at the instant of **maximum spring compression**.
2. Compute the maximum compression $x_{\max}$ of the spring.
3. Compute the final velocities of both carts after the spring completely re-expands.

**Solution:**
- **Step 1: Velocity at maximum compression**
  Maximum compression occurs when the carts are momentarily at rest relative to each other.
  At that instant, both carts move with the **Center of Mass velocity** $V_{\text{CM}}$:
  $$V_{\text{CM}} = \frac{m_1 v_0 + 0}{m_1 + m_2} = \frac{(3.00\,\text{kg})(4.00\,\text{m/s})}{3.00 + 6.00\,\text{kg}} = \frac{12.0}{9.00} = 1.3333\,\text{m/s}$$

- **Step 2: Maximum spring compression**
  By Koenig’s Theorem, the initial kinetic energy is partitioned into translational CM energy and internal energy:
  $$K_{\text{lab}} = K_{\text{CM}} + K_{\text{int}}$$
  At maximum compression, all internal kinetic energy $K_{\text{int}}$ is momentarily converted into spring potential energy:
  $$\frac{1}{2} k x_{\max}^2 = K_{\text{int}} = \frac{1}{2} \mu v_0^2$$
  Reduced mass:
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(3.00)(6.00)}{9.00} = 2.00\,\text{kg}$$
  $$K_{\text{int}} = \frac{1}{2}(2.00\,\text{kg})(4.00\,\text{m/s})^2 = 1.00 \times 16.0 = 16.0\,\text{J}$$
  Equating to spring energy:
  $$\frac{1}{2}(1800\,\text{N/m}) x_{\max}^2 = 16.0\,\text{J} \implies 900 x_{\max}^2 = 16.0 \implies x_{\max}^2 = \frac{16.0}{900} = 0.017778$$
  $$x_{\max} = \sqrt{0.017778} = 0.1333\,\text{m} = 13.33\,\text{cm}$$

- **Step 3: Final post-restitution velocities**
  Using Canonical formulas with $v_{2i} = 0$:
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_0 = \frac{3.00 - 6.00}{9.00}(4.00) = -\frac{3}{9}(4.00) = -\frac{4.00}{3} = -1.333\,\text{m/s}$$
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_0 = \frac{2(3.00)}{9.00}(4.00) = \frac{6}{9}(4.00) = +\frac{8.00}{3} = +2.667\,\text{m/s}$$

---

### Example 5.9: Gravitational Assist (Slingshot) in 1D
**Problem:** A deep space exploration probe of mass $m = 800\,\text{kg}$ approaches Jupiter ($M_J = 1.90 \times 10^{27}\,\text{kg}$) along its orbital path. In the Sun's frame, Jupiter travels along $-x$ at $V_J = -13.0\,\text{km/s}$. The probe approaches head-on along $+x$ at $v_0 = +10.0\,\text{km/s}$. The probe loops around Jupiter through a close gravitational hyperbolic swing-by and departs along $-x$.
1. Using the Center of Mass frame of Jupiter ($M_J \gg m$), compute the post-flyby speed of the probe in the Sun's reference frame.
2. What is the net speed boost $\Delta v$ gained by the probe? Where did the energy come from?

**Solution:**
- **Step 1: Jupiter reference frame transformation**
  Because $M_J \gg m$, the center of mass of the (Jupiter + probe) system is located inside Jupiter and moves at Jupiter's velocity:
  $$V_{\text{CM}} \approx V_J = -13.0\,\text{km/s}$$
  In Jupiter’s frame, the probe's initial approach speed is:
  $$v'_{\text{init}} = v_0 - V_J = +10.0\,\text{km/s} - (-13.0\,\text{km/s}) = +23.0\,\text{km/s}$$
  In Jupiter's gravitational field, energy is conserved. The probe swings around the planet and departs in the opposite direction (along $-x$) with the **exact same relative speed**:
  $$v'_{\text{final}} = -23.0\,\text{km/s}$$

- **Step 2: Transform back to the Sun’s frame**
  $$v_{\text{final}} = v'_{\text{final}} + V_J = -23.0\,\text{km/s} + (-13.0\,\text{km/s}) = -36.0\,\text{km/s}$$
  Speed magnitude: $\|v_{\text{final}}\| = 36.0\,\text{km/s}$.
  Net speed gain:
  $$\Delta v = 36.0\,\text{km/s} - 10.0\,\text{km/s} = +26.0\,\text{km/s} = 2 |V_J|!$$

- **Step 3: Energy source**
  The probe gained $26.0\,\text{km/s}$ of velocity purely from Jupiter's orbital kinetic energy!
  By momentum conservation, Jupiter lost momentum:
  $$\Delta P_J = -m \Delta v = -(800\,\text{kg})(46,000\,\text{m/s}) = -3.68 \times 10^7\,\text{kg}\cdot\text{m/s}$$
  Jupiter's orbital speed was reduced by:
  $$\Delta V_J = \frac{3.68 \times 10^7}{1.90 \times 10^{27}} \approx 1.9 \times 10^{-20}\,\text{m/s}$$
  A completely negligible slowdown for Jupiter, but a massive $26\,\text{km/s}$ boost for humanity's probe!

---

### Example 5.10: Two-Block Wall Ricochet Oscillation
**Problem:** On a frictionless track bounded by a rigid wall on the left ($x = 0$):
- Block 1 ($m_1 = 1.00\,\text{kg}$) is between the wall and Block 2.
- Block 2 ($m_2 = 100.0\,\text{kg}$) approaches from the right at $v_{2i} = -1.00\,\text{m/s}$.
- Block 1 is initially stationary at rest ($v_{1i} = 0$).
All collisions (between blocks, and between Block 1 and the wall) are perfectly elastic.
1. Compute the velocities of both blocks after the first collision between Block 1 and Block 2.
2. Determine what happens when Block 1 bounces off the wall and strikes Block 2 again.
3. Explain how this system calculates digits of $\pi$ (Galperin’s Billiard Theorem).

**Solution:**
- **Step 1: First collision between blocks**
  $$m_1 = 1.00\,\text{kg}, \quad m_2 = 100.0\,\text{kg}$$
  $$v_{1i} = 0, \quad v_{2i} = -1.00\,\text{m/s}$$
  Using Canonical equations:
  $$v_{1f} = \frac{2 m_2}{m_1 + m_2} v_{2i} = \frac{2(100.0)}{1.00 + 100.0}(-1.00\,\text{m/s}) = \frac{200.0}{101.0}(-1.00) = -1.9802\,\text{m/s}$$
  $$v_{2f} = \frac{m_2 - m_1}{m_1 + m_2} v_{2i} = \frac{100.0 - 1.00}{101.0}(-1.00) = \frac{99.0}{101.0}(-1.00) = -0.9802\,\text{m/s}$$
  Block 1 speeds leftward at $-1.9802\,\text{m/s}$.

- **Step 2: Wall collision and second block impact**
  Block 1 hits the rigid wall ($m_{\text{wall}} \to \infty$) and bounces elastically:
  $$v_{1, \text{after wall}} = -(-1.9802) = +1.9802\,\text{m/s}$$
  Now Block 1 ($+1.9802\,\text{m/s}$) chases and strikes Block 2 (which is still moving left at $-0.9802\,\text{m/s}$):
  $$v_{1f}' = \frac{1 - 100}{101}(+1.9802) + \frac{200}{101}(-0.9802) = -0.9802(1.9802) - 1.9802(0.9802) = -3.882\,\text{m/s}$$
  $$v_{2f}' = \frac{2}{101}(+1.9802) + \frac{99}{101}(-0.9802) = 0.0392 - 0.9608 = -0.9216\,\text{m/s}$$
  Block 2 has slowed from $-1.00\,\text{m/s}$ to $-0.92\,\text{m/s}$.

- **Step 3: Galperin’s Pi Theorem**
  If the mass ratio is $M/m = 100 = 10^2$, the total number of collisions before Block 2 permanently reverses direction and escapes to the right is:
  $$N_{\text{collisions}} = \lfloor \pi \sqrt{M/m} \rfloor = \lfloor \pi \sqrt{100} \rfloor = \lfloor 10\pi \rfloor = \lfloor 31.4159 \rfloor = \mathbf{31}$$
  If $M/m = 10,000 = 10^4$, $N_{\text{collisions}} = \mathbf{314}$.
  If $M/m = 1,000,000 = 10^6$, $N_{\text{collisions}} = \mathbf{3141}$.
  The physical count of collisions computes the decimal digits of $\pi$!

---

## 5.8 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 5.9.

### Tier 1: Canonical 1D Head-On Collisions
- **Exercise 5.1:** A $2.00\,\text{kg}$ ball moving at $5.00\,\text{m/s}$ collides elastically with a stationary $3.00\,\text{kg}$ ball. Compute the final velocities of both balls.
- **Exercise 5.2:** Two equal mass $0.500\,\text{kg}$ gliders on an air track with speeds $+4.00\,\text{m/s}$ and $-2.00\,\text{m/s}$ collide elastically. What are their velocities after separation?

### Tier 2: Moving Targets & Relative Speed Invariance
- **Exercise 5.3:** Mass $m_1 = 4.00\,\text{kg}$ ($v_1 = +8.00\,\text{m/s}$) catches up with mass $m_2 = 1.00\,\text{kg}$ ($v_2 = +3.00\,\text{m/s}$). Find the post-collision velocities and verify relative speed invariance.
- **Exercise 5.4:** A $0.100\,\text{kg}$ rubber ball moving at $12.0\,\text{m/s}$ strikes a stationary $5.00\,\text{kg}$ bowling ball elastically. Compute the rebound speed of the rubber ball.

### Tier 3: Center-of-Mass Transformations
- **Exercise 5.5:** A particle of mass $m_1 = 2.00\,\text{kg}$ moving at $10.0\,\text{m/s}$ collides elastically with $m_2 = 6.00\,\text{kg}$ at rest. Compute $V_{\text{CM}}$, transform to the C-frame, reflect, and find the laboratory final velocities.
- **Exercise 5.6:** Two particles with masses in ratio $m_1/m_2 = 3$ collide elastically. If $m_2$ was initially at rest, what fraction of its initial kinetic energy does $m_1$ retain?

### Tier 4: Energy Partition & Spring Buffers
- **Exercise 5.7:** A neutron ($1.00\,\text{u}$) collides elastically head-on with a stationary carbon nucleus ($^{12}\text{C}$, $12.0\,\text{u}$). What percentage of kinetic energy is transferred to the carbon nucleus?
- **Exercise 5.8:** A $1.50\,\text{kg}$ cart moving at $2.00\,\text{m/s}$ strikes a stationary $3.00\,\text{kg}$ cart equipped with a spring of $k = 600\,\text{N/m}$. Find the maximum spring compression.

### Tier 5: Multi-Body Cascades & Invariant Limits
- **Exercise 5.9:** Three equal masses $A$, $B$, $C$ sit in a line. $A$ moves right at $v_0$; $B$ and $C$ are stationary. If all collisions are elastic, determine the final velocities of all three balls after all collisions cease.
- **Exercise 5.10:** A heavy truck ($M = 12,000\,\text{kg}$) moving at $20.0\,\text{m/s}$ strikes a small stationary car ($m = 1000\,\text{kg}$) elastically. The small car then hits a stationary motorcycle ($m_{\text{moto}} = 200\,\text{kg}$) elastically. Compute the final speed of the motorcycle.

---

## 5.9 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 5.1
- **Given:** $m_1 = 2.00\,\text{kg}$, $v_{1i} = 5.00\,\text{m/s}$, $m_2 = 3.00\,\text{kg}$, $v_{2i} = 0$.
- **Step 1: Canonical formulas**
  $$m_1 + m_2 = 5.00\,\text{kg}$$
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{2.00 - 3.00}{5.00}(5.00) = \frac{-1.00}{5.00}(5.00) = -1.00\,\text{m/s}$$
  $$v_{2f} = \frac{2 m_1}{m_1 + m_2} v_{1i} = \frac{2(2.00)}{5.00}(5.00) = \frac{4.00}{5.00}(5.00) = +4.00\,\text{m/s}$$

---

### Solution 5.2
- **Given:** $m_1 = m_2 = 0.500\,\text{kg}$, $v_{1i} = +4.00\,\text{m/s}$, $v_{2i} = -2.00\,\text{m/s}$.
- **Step 1: Perfect velocity exchange**
  $$v_{1f} = v_{2i} = -2.00\,\text{m/s}$$
  $$v_{2f} = v_{1i} = +4.00\,\text{m/s}$$

---

### Solution 5.3
- **Given:** $m_1 = 4.00\,\text{kg}$, $v_{1i} = +8.00\,\text{m/s}$, $m_2 = 1.00\,\text{kg}$, $v_{2i} = +3.00\,\text{m/s}$.
- **Step 1: Velocity calculation**
  $$m_1 + m_2 = 5.00\,\text{kg}$$
  $$v_{1f} = \frac{4.00 - 1.00}{5.00}(8.00) + \frac{2(1.00)}{5.00}(3.00) = \frac{3.00(8.00) + 6.00}{5.00} = \frac{30.00}{5.00} = +6.00\,\text{m/s}$$
  $$v_{2f} = \frac{2(4.00)}{5.00}(8.00) + \frac{1.00 - 4.00}{5.00}(3.00) = \frac{64.00 - 9.00}{5.00} = \frac{55.00}{5.00} = +11.00\,\text{m/s}$$
- **Step 2: Relative speed check**
  $$v_{\text{rel, init}} = 3.00 - 8.00 = -5.00\,\text{m/s}$$
  $$v_{\text{rel, final}} = 11.00 - 6.00 = +5.00\,\text{m/s} = -v_{\text{rel, init}}$$

---

### Solution 5.4
- **Given:** $m_1 = 0.100\,\text{kg}$, $v_{1i} = 12.0\,\text{m/s}$, $m_2 = 5.00\,\text{kg}$, $v_{2i} = 0$.
- **Step 1: Rebound velocity**
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{0.100 - 5.00}{0.100 + 5.00}(12.0) = \frac{-4.90}{5.10}(12.0) = -11.53\,\text{m/s}$$
  The ball rebounds at $11.53\,\text{m/s}$.

---

### Solution 5.5
- **Given:** $m_1 = 2.00\,\text{kg}$, $v_1 = 10.0\,\text{m/s}$, $m_2 = 6.00\,\text{kg}$, $v_2 = 0$.
- **Step 1: Center of mass velocity**
  $$V_{\text{CM}} = \frac{(2.00)(10.0) + 0}{8.00} = \frac{20.0}{8.00} = 2.50\,\text{m/s}$$
- **Step 2: C-frame transformation & reflection**
  $$u'_{1i} = 10.0 - 2.50 = +7.50\,\text{m/s} \implies u'_{1f} = -7.50\,\text{m/s}$$
  $$u'_{2i} = 0 - 2.50 = -2.50\,\text{m/s} \implies u'_{2f} = +2.50\,\text{m/s}$$
- **Step 3: Laboratory frame velocities**
  $$v_{1f} = -7.50 + 2.50 = -5.00\,\text{m/s}$$
  $$v_{2f} = +2.50 + 2.50 = +5.00\,\text{m/s}$$

---

### Solution 5.6
- **Given:** $m_1 / m_2 = 3.00 \implies m_1 = 3 m_2$, $v_{2i} = 0$.
- **Step 1: Final velocity of $m_1$**
  $$v_{1f} = \frac{m_1 - m_2}{m_1 + m_2} v_{1i} = \frac{3m_2 - m_2}{3m_2 + m_2} v_{1i} = \frac{2m_2}{4m_2} v_{1i} = \frac{1}{2} v_{1i}$$
- **Step 2: Fraction of kinetic energy retained**
  $$\frac{K_{1f}}{K_{1i}} = \left(\frac{v_{1f}}{v_{1i}}\right)^2 = \left(\frac{1}{2}\right)^2 = \frac{1}{4} = 0.250 \implies 25.0\%$$

---

### Solution 5.7
- **Given:** $m_1 = 1.00\,\text{u}$, $m_2 = 12.0\,\text{u}$.
- **Step 1: Fractional energy transfer**
  $$\frac{\Delta K}{K_{\text{init}}} = \frac{4 m_1 m_2}{(m_1 + m_2)^2} = \frac{4(1.00)(12.0)}{(1.00 + 12.0)^2} = \frac{48.0}{13.0^2} = \frac{48.0}{169.0} = 0.2840 \implies 28.40\%$$

---

### Solution 5.8
- **Given:** $m_1 = 1.50\,\text{kg}$, $v_0 = 2.00\,\text{m/s}$, $m_2 = 3.00\,\text{kg}$, $k = 600\,\text{N/m}$.
- **Step 1: Reduced mass & internal kinetic energy**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(1.50)(3.00)}{4.50} = 1.00\,\text{kg}$$
  $$K_{\text{int}} = \frac{1}{2} \mu v_0^2 = \frac{1}{2}(1.00\,\text{kg})(2.00\,\text{m/s})^2 = 2.00\,\text{J}$$
- **Step 2: Maximum spring compression**
  $$\frac{1}{2} k x_{\max}^2 = K_{\text{int}} \implies 300 x_{\max}^2 = 2.00 \implies x_{\max}^2 = \frac{2.00}{300} = \frac{1}{150} \approx 0.006667$$
  $$x_{\max} = \sqrt{0.006667} = 0.08165\,\text{m} = 8.165\,\text{cm}$$

---

### Solution 5.9
- **Given:** Equal masses $m_A = m_B = m_C = m$. $v_A = v_0$, $v_B = 0$, $v_C = 0$.
- **Step 1: Collision 1 ($A$ hits $B$)**
  By the equal mass velocity exchange theorem:
  $$v_A' = 0, \quad v_B' = v_0$$
- **Step 2: Collision 2 ($B$ hits $C$)**
  $B$ (moving at $v_0$) strikes stationary $C$:
  $$v_B'' = 0, \quad v_C'' = v_0$$
- **Step 3: Check for further collisions**
  $A$ is at rest ($v_A = 0$), $B$ is at rest ($v_B = 0$), $C$ moves right at $v_0$.
  No further collisions can occur.
  Final velocities: $v_A = 0$, $v_B = 0$, $v_C = v_0$.

---

### Solution 5.10
- **Given:** $M = 12,000\,\text{kg}$ at $V = 20.0\,\text{m/s}$. $m = 1000\,\text{kg}$ at rest. $m_{\text{moto}} = 200\,\text{kg}$ at rest.
- **Step 1: Collision 1 (Truck hits car)**
  $$v_{\text{car}} = \frac{2 M}{M + m} V = \frac{2(12,000)}{12,000 + 1000}(20.0\,\text{m/s}) = \frac{24,000}{13,000}(20.0) = 36.923\,\text{m/s}$$
- **Step 2: Collision 2 (Car hits motorcycle)**
  $$v_{\text{moto}} = \frac{2 m}{m + m_{\text{moto}}} v_{\text{car}} = \frac{2(1000)}{1000 + 200}(36.923\,\text{m/s}) = \frac{2000}{1200}(36.923) = \frac{5}{3}(36.923) = 61.538\,\text{m/s}$$
  The motorcycle departs at $61.54\,\text{m/s}$ ($221.5\,\text{km/h}$)!
