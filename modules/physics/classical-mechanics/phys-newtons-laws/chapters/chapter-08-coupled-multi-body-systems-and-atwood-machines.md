# Chapter 08: Coupled Multi-Body Systems and Atwood Machines — Constraints, Pulleys, and Mechanical Advantage

> *"A system of interconnected bodies is governed not by isolated equations, but by kinematic constraints. The tension in a string is not a law of force; it is an algebraic constraint multiplier ensuring that geometric continuity is never violated."*

---

## 8.1 George Atwood and the Mechanical Dilution of Inertia

In 1784, the English mathematician and physicist George Atwood confronted an experimental challenge that had persisted since Galileo: how to verify Newton’s Second Law of Motion ($\vec{F} = m\vec{a}$) under controlled, slow, and precisely measurable uniform acceleration. Free fall under Earth's gravity ($g \approx 9.81\,\text{m/s}^2$) was far too rapid to time accurately with 18th-century pendulum clocks. While Galileo had diluted gravity using inclined planes, friction between the rolling or sliding sphere and the timber track remained an unavoidable systematic error.

Atwood’s brilliant innovation was the machine that now bears his name: **the Atwood Machine**. By suspending two masses, $m_1$ and $m_2$, from opposite ends of a light, flexible cord passing over a low-friction pulley, Atwood separated the *gravitational drive* from the *inertial resistance*:
- The **net driving force** accelerating the system is the differential gravitational weight: $\Delta F = (m_2 - m_1)g$.
- The **total mass resisting acceleration** is the sum of both masses: $M_{\text{total}} = m_1 + m_2$.

By choosing masses that were very close in value (for example, $m_1 = 1.000\,\text{kg}$ and $m_2 = 1.005\,\text{kg}$), the driving force could be made arbitrarily small ($\Delta F = 0.005 \times 9.81 \approx 0.049\,\text{N}$) while maintaining a large inertial resistance ($M_{\text{total}} = 2.005\,\text{kg}$). The resulting acceleration:

$$a = g \frac{m_2 - m_1}{m_1 + m_2} = 9.81 \times \frac{0.005}{2.005} \approx 0.0245\,\text{m/s}^2$$

Under this leisurely acceleration, an object traverses a two-meter descent in over $12.7$ seconds—allowing researchers to verify $s \propto t^2$ and $a \propto \Delta F / M_{\text{total}}$ with unprecedented astronomical precision.

Yet beyond its historical fame, the Atwood machine serves as the foundational paradigm for **coupled multi-body dynamics**: mechanical systems where discrete rigid bodies interact through geometric constraints enforced by cords, rods, pulleys, and contact interfaces.

---

## 8.2 The Ideal Constraint Axioms: Strings and Pulleys

To analyze multi-body systems systematically, classical mechanics employs a set of well-defined idealization axioms. Understanding the physical origin and limitations of these axioms is essential for real-world engineering and computational physics engines.

### Axiom 1: The Massless, Inextensible String
An ideal string or cord satisfies two geometric and dynamic conditions:
1. **Inextensibility:** The distance along the cord between any two material points is strictly constant in time:
   $$\frac{d L}{dt} \equiv 0$$
   This enforces an absolute kinematic constraint relating the positions, velocities, and accelerations of connected bodies.
2. **Massless Approximation ($m_{\text{string}} \to 0$):**
   Consider a differential segment of cord of mass $dm = \lambda \, ds$ subjected to tensions $T(s)$ and $T(s + ds)$ at its ends:
   $$dm \, a = T(s + ds) - T(s) = dT$$
   In the limit where linear mass density $\lambda \to 0$, $dm \to 0$. Therefore:
   $$dT = 0 \implies T(s) = \text{constant}$$
   **Consequence:** In any unbranched, massless string passing over frictionless supports, the tension $T$ is uniform throughout its entire length.

```
       [Tension T] <---==== String Segment (dm -> 0) ====---> [Tension T]
                         dT = dm * a = 0  =>  T is constant
```

### Axiom 2: The Massless, Frictionless Pulley
An ideal pulley satisfies:
1. **Frictionless Bearings:** The axle exerts zero resistive torque on the pulley wheel.
2. **Massless Wheel ($I_{\text{pulley}} \to 0$):**
   The rotational equation of motion for a pulley of radius $R$ and moment of inertia $I$ is:
   $$\tau_{\text{net}} = (T_2 - T_1) R = I \alpha$$
   When the rotational inertia is negligible ($I \to 0$):
   $$(T_2 - T_1) R = 0 \implies T_1 = T_2$$
   **Consequence:** An ideal pulley redirects the line of action of tension without altering its magnitude.

```
                  Ideal Pulley (I -> 0, bearing friction -> 0)
                          .-------.
                         /    R    \
                        |     O     |
                       / \         / \
                      /   '-------'   \
                 T_1 |                 | T_2 = T_1
                     v                 v
```

---

## 8.3 The Simple Atwood Machine: Two Approaches to Derivation

Consider two masses $m_1$ and $m_2$ suspended vertically over an ideal pulley, with $m_2 > m_1$. Let the coordinate axis for $m_1$ be directed upward ($+y_1$), and for $m_2$ be directed downward ($+y_2$).

```
                     .-------.  (Pulley)
                    /    O    \
                   /           \
             T |  |             |  | T
               v  |             |  v
                [m1]           [m2]
                 |               |
                 v m1*g          v m2*g
             (Upward: a)    (Downward: a)
```

Because the cord is inextensible, whenever $m_2$ accelerates downward with magnitude $a$, $m_1$ must accelerate upward with the exact same magnitude $a$:

$$a_1 = a_2 = a$$

### Method A: Isolated Free-Body Diagrams (Newtonian Reductionism)
Isolate each body and apply Newton's Second Law:

1. **Body 1 (mass $m_1$, accelerating upward):**
   $$\sum F_{y1} = T - m_1 g = m_1 a \quad \implies \quad T = m_1(g + a) \qquad \text{(Eq. 8.1)}$$

2. **Body 2 (mass $m_2$, accelerating downward):**
   $$\sum F_{y2} = m_2 g - T = m_2 a \quad \implies \quad T = m_2(g - a) \qquad \text{(Eq. 8.2)}$$

We have a linear system of two equations in two unknowns ($a$ and $T$).
Equating the two expressions for $T$:

$$m_1(g + a) = m_2(g - a)$$

$$m_1 g + m_1 a = m_2 g - m_2 a$$

$$(m_1 + m_2) a = (m_2 - m_1) g$$

$$a = g \frac{m_2 - m_1}{m_1 + m_2} \qquad \text{(Eq. 8.3)}$$

Substitute this acceleration back into Eq. 8.1 to obtain the string tension:

$$T = m_1\left(g + g\frac{m_2 - m_1}{m_1 + m_2}\right) = m_1 g \left(1 + \frac{m_2 - m_1}{m_1 + m_2}\right) = m_1 g \left(\frac{m_1 + m_2 + m_2 - m_1}{m_1 + m_2}\right)$$

$$T = \frac{2 m_1 m_2 g}{m_1 + m_2} \qquad \text{(Eq. 8.4)}$$

### Method B: The Unfolded 1D System Approach
The tension $T$ is an **internal constraint force** acting between $m_1$ and $m_2$. If we treat the entire assembly of two masses and the cord as a single unified 1D system "unfolded" along the line of the string:

```
  +<--- [ m1 ] ========= String (Tension internal) ========= [ m2 ] --->+
         m1*g (Leftward drive)                              m2*g (Rightward drive)
```

- Total inertial mass: $M_{\text{tot}} = m_1 + m_2$.
- Net external force along the string coordinate:
  $$F_{\text{net, ext}} = m_2 g - m_1 g = (m_2 - m_1)g$$
- Applying $\sum F_{\text{ext}} = M_{\text{tot}} a$:
  $$(m_2 - m_1)g = (m_1 + m_2)a \implies a = g\frac{m_2 - m_1}{m_1 + m_2}$$

Both methods yield identical results, but the system approach reveals that internal tension drops out entirely when computing global system acceleration!

---

## 8.4 The Pulley Support Bracket Paradox and Apparent Weight

Now consider the support bracket holding the axle of the pulley. What force $F_{\text{bracket}}$ must the ceiling exert upward on the pulley to hold it stationary?

```
                     Ceiling Support
                          ||  ^ F_bracket
                      .---||---.
                     /    O     \
                    |   Pulley   |
                     \          /
                    T |        | T
                      v        v
```

Because the pulley is in static equilibrium ($\sum \vec{F}_{\text{pulley}} = \vec{0}$), and two strands of cord pull downward with tension $T$:

$$F_{\text{bracket}} = 2 T = \frac{4 m_1 m_2 g}{m_1 + m_2} \qquad \text{(Eq. 8.5)}$$

### The Apparent Weight Paradox
What happens if we compare this ceiling force $F_{\text{bracket}}$ to the combined static weight of the two masses, $W_{\text{static}} = (m_1 + m_2)g$?

Let us subtract the two quantities:

$$W_{\text{static}} - F_{\text{bracket}} = (m_1 + m_2)g - \frac{4 m_1 m_2 g}{m_1 + m_2} = \frac{(m_1 + m_2)^2 - 4 m_1 m_2}{m_1 + m_2} g$$

Expanding the numerator:

$$(m_1^2 + 2m_1 m_2 + m_2^2) - 4 m_1 m_2 = m_1^2 - 2m_1 m_2 + m_2^2 = (m_2 - m_1)^2$$

Therefore:

$$W_{\text{static}} - F_{\text{bracket}} = \frac{(m_2 - m_1)^2}{m_1 + m_2} g \ge 0$$

$$F_{\text{bracket}} = (m_1 + m_2)g - \frac{(m_2 - m_1)^2}{m_1 + m_2} g \le W_{\text{static}}$$

**The Theorem of the Accelerating Atwood Scale:**
> *Whenever $m_1 \ne m_2$, the force exerted by the ceiling support on an operating Atwood machine is strictly less than the combined static weight of the suspended masses.*

#### Why does this happen? (Center-of-Mass Dynamics)
Recall Newton’s Second Law for a composite system:

$$\sum \vec{F}_{\text{ext}} = M_{\text{total}} \vec{a}_{\text{CM}}$$

The external forces acting on the complete Atwood system (pulley + masses) are:
1. Upward bracket force: $+F_{\text{bracket}}\,\hat{j}$.
2. Downward gravitational forces: $-(m_1 + m_2)g\,\hat{j}$.

$$\sum F_y = F_{\text{bracket}} - (m_1 + m_2)g = (m_1 + m_2) a_{\text{CM}, y}$$

Now let us compute the vertical acceleration of the center of mass.
Since $m_1$ accelerates upward ($+a$) and $m_2$ accelerates downward ($-a$):

$$a_{\text{CM}, y} = \frac{m_1(+a) + m_2(-a)}{m_1 + m_2} = -\frac{m_2 - m_1}{m_1 + m_2} a$$

Substitute $a = g\frac{m_2 - m_1}{m_1 + m_2}$:

$$a_{\text{CM}, y} = -\left(\frac{m_2 - m_1}{m_1 + m_2}\right)^2 g$$

Notice that $a_{\text{CM}, y}$ is strictly **negative (downward)**! Because the heavier mass accelerates downward while the lighter mass accelerates upward, the mass-weighted center of gravity of the universe is falling.
Consequently:

$$F_{\text{bracket}} = (m_1 + m_2)g + (m_1 + m_2)a_{\text{CM}, y} = (m_1 + m_2)g - \frac{(m_2 - m_1)^2}{m_1 + m_2}g$$

The deficit in support force is precisely the downward inertial acceleration of the system's center of mass!

---

## 8.5 The Half-Atwood Machine: Friction and Inclines

The Half-Atwood machine features one mass resting on a horizontal or inclined surface, connected by a cord over a corner pulley to a second mass hanging vertically.

```
       [ m1 ] ===== T =====. (Pulley)
       ======               \
       Table                 | T
                             |
                            [ m2 ]
                             v m2*g
```

### Regime 1: Smooth Horizontal Table ($\mu = 0$)
- Mass $m_1$ on frictionless table: $\sum F_{x1} = T = m_1 a$.
- Mass $m_2$ hanging vertically: $\sum F_{y2} = m_2 g - T = m_2 a$.
Summing the equations:
$$m_2 g = (m_1 + m_2) a \implies a = g \frac{m_2}{m_1 + m_2}$$
$$T = m_1 a = g \frac{m_1 m_2}{m_1 + m_2}$$

### Regime 2: Rough Horizontal Table ($\mu_s, \mu_k$)
Mass $m_1$ experiences normal force $N_1 = m_1 g$.
- Maximum static friction: $f_{s,\max} = \mu_s m_1 g$.
- Kinetic friction during motion: $f_k = \mu_k m_1 g$.

#### Threshold of Motion
The hanging mass $m_2$ provides the driving tension $T = m_2 g$.
The system remains in static equilibrium if:
$$m_2 g \le f_{s,\max} = \mu_s m_1 g \implies m_2 \le \mu_s m_1$$
If $m_2 > \mu_s m_1$, static friction breaks, and the system accelerates:
$$\sum F_{x1} = T - f_k = m_1 a \implies T - \mu_k m_1 g = m_1 a$$
$$\sum F_{y2} = m_2 g - T = m_2 a$$
Summing equations:
$$m_2 g - \mu_k m_1 g = (m_1 + m_2) a$$

$$a = g \frac{m_2 - \mu_k m_1}{m_1 + m_2} \qquad \text{(Eq. 8.6)}$$

$$T = m_2(g - a) = m_1 m_2 g \frac{1 + \mu_k}{m_1 + m_2} \qquad \text{(Eq. 8.7)}$$

### Regime 3: Half-Atwood on an Incline
Let $m_1$ sit on a ramp inclined at angle $\theta$, with $m_2$ hanging vertically.
- If $m_2$ pulls $m_1$ **up the ramp**:
  $$a = g \frac{m_2 - m_1(\sin\theta + \mu_k\cos\theta)}{m_1 + m_2}$$
- If $m_1$ slides **down the ramp** pulling $m_2$ upward:
  $$a = g \frac{m_1(\sin\theta - \mu_k\cos\theta) - m_2}{m_1 + m_2}$$

---

## 8.6 Kinematic Constraint Equations and Compound Pulleys

When systems involve movable pulleys, the accelerations of connected bodies are no longer equal. We must establish **Kinematic Constraint Equations** by writing the total geometric length of the cord and differentiating twice with respect to time.

```
       Ceiling
       =============================
         | (Fixed)            | (Fixed)
       .---.                .---.
      /  O  \ Fixed        /  O  \ Fixed
      |  1  | Pulley       |  2  | Pulley
       \   /                \   /
        | |                  | |
        | |      .---.       | |
        | '---->/  O  \ <----' |
        |      |  3  | Movable |
        |       \   /  Pulley  |
        v         |            v
       [m1]      [m2]         [m3]
```

### The Length Invariance Protocol
1. Establish a fixed reference datum (typically a horizontal line passing through fixed pulley axles, such as the ceiling).
2. Measure downward position coordinates $y_1, y_2, \dots, y_n$ for all moving bodies and movable pulleys from the datum.
3. Express the total length $L$ of each independent cord in terms of these coordinates, ignoring constant arc segments wrapping over pulleys.
4. Take the first time derivative ($\dot{L} \equiv 0$) to obtain velocity constraints.
5. Take the second time derivative ($\ddot{L} \equiv 0$) to obtain acceleration constraints.

### Example: The 2:1 Movable Pulley System
Consider a fixed ceiling pulley and a movable pulley supporting mass $m_2$. Mass $m_1$ hangs from the free end of the string.

```
       Ceiling (Datum y = 0)
       ======================
           |            |
         .---.          |
        /  O  \ Fixed   |
        \     /         |
         |   |          |
         |   |        .---.
         |   |       /  O  \ Movable Pulley (Carrying m2)
         |   |       \     /
         |   '--------' |
         |              |
         v              v
        [m1]           [m2]
      (Pos: y1)      (Pos: y2)
```

1. Length of cord:
   $$L = y_1 + 2 y_2 + \text{constants}$$
2. Differentiating twice:
   $$\ddot{y}_1 + 2 \ddot{y}_2 = 0 \implies a_1 + 2 a_2 = 0 \implies a_1 = -2 a_2$$
   *Physical Meaning:* If the movable pulley (carrying $m_2$) moves downward by distance $\Delta y_2$, mass $m_1$ must move upward by distance $\Delta y_1 = 2 \Delta y_2$.

3. Dynamic Equations:
   - For $m_1$ (mass on single strand, tension $T$):
     $$m_1 g - T = m_1 a_1$$
   - For $m_2$ (supported by two upward strands of tension $T$):
     $$m_2 g - 2T = m_2 a_2 = m_2 \left(-\frac{a_1}{2}\right)$$
   Multiplying the $m_1$ equation by 2:
   $$2m_1 g - 2T = 2m_1 a_1$$
   Subtracting the $m_2$ equation:
   $$(2m_1 - m_2)g = \left(2m_1 + \frac{m_2}{4}\right) a_1 = \left(\frac{8m_1 + m_2}{4}\right) a_1$$

$$a_1 = g \frac{4(2m_1 - m_2)}{8m_1 + m_2}$$

$$a_2 = -\frac{a_1}{2} = g \frac{2(m_2 - 2m_1)}{8m_1 + m_2}$$

Notice that equilibrium ($a_1 = a_2 = 0$) occurs when $m_2 = 2 m_1$, perfectly verifying the principle of mechanical advantage!

---

## 8.7 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 8.1: Precision Classical Atwood Machine
**Problem:** In an Atwood machine, $m_1 = 2.000\,\text{kg}$ and $m_2 = 2.050\,\text{kg}$ are suspended from a light cord over a frictionless pulley. Take $g = 9.810\,\text{m/s}^2$.
1. Compute the acceleration of the system.
2. Determine the tension $T$ in the cord.
3. Calculate the time required for $m_2$ to descend $1.500\,\text{m}$ from rest.
4. Compute the upward force exerted by the ceiling bracket on the pulley.

**Solution:**
- **Step 1: System acceleration**
  $$a = g \frac{m_2 - m_1}{m_1 + m_2} = (9.810\,\text{m/s}^2) \frac{2.050 - 2.000}{2.000 + 2.050} = (9.810) \frac{0.050}{4.050}$$
  $$a = 9.810 \times 0.0123457 = 0.12111\,\text{m/s}^2$$

- **Step 2: String tension**
  $$T = m_1(g + a) = (2.000\,\text{kg})(9.810 + 0.12111\,\text{m/s}^2) = 2.000 \times 9.93111 = 19.8622\,\text{N}$$
  *Check via $m_2$:*
  $$T = m_2(g - a) = (2.050\,\text{kg})(9.810 - 0.12111\,\text{m/s}^2) = 2.050 \times 9.68889 = 19.8622\,\text{N}$$

- **Step 3: Descent time**
  $$s = \frac{1}{2} a t^2 \implies t = \sqrt{\frac{2s}{a}} = \sqrt{\frac{2(1.500\,\text{m})}{0.12111\,\text{m/s}^2}} = \sqrt{24.7709} = 4.977\,\text{s}$$

- **Step 4: Bracket force**
  $$F_{\text{bracket}} = 2T = 2(19.8622\,\text{N}) = 39.724\,\text{N}$$
  *Static weight comparison:*
  $$W_{\text{static}} = (m_1 + m_2)g = (4.050\,\text{kg})(9.810\,\text{m/s}^2) = 39.7305\,\text{N}$$
  $$W_{\text{static}} - F_{\text{bracket}} = 39.7305 - 39.7244 = 0.0061\,\text{N}$$
  $F_{\text{bracket}} < W_{\text{static}}$, validating the apparent weight theorem.

---

### Example 8.2: Half-Atwood with Coulomb Friction
**Problem:** A block $m_1 = 5.00\,\text{kg}$ sits on a horizontal table connected by a cord over a corner pulley to a hanging mass $m_2 = 2.50\,\text{kg}$. The coefficients of friction between $m_1$ and the table are $\mu_s = 0.450$ and $\mu_k = 0.350$. Take $g = 9.81\,\text{m/s}^2$.
1. Determine if the system moves from rest.
2. If it moves, find its acceleration $a$ and the cord tension $T$.
3. If it remains stationary, find the magnitude of the static friction force $f_s$.

**Solution:**
- **Step 1: Check static equilibrium**
  Normal force on table: $N_1 = m_1 g = (5.00\,\text{kg})(9.81\,\text{m/s}^2) = 49.05\,\text{N}$.
  Maximum static friction:
  $$f_{s,\max} = \mu_s N_1 = (0.450)(49.05\,\text{N}) = 22.0725\,\text{N}$$
  Driving weight of hanging mass:
  $$F_{\text{drive}} = m_2 g = (2.50\,\text{kg})(9.81\,\text{m/s}^2) = 24.525\,\text{N}$$
  Comparing forces:
  $$F_{\text{drive}} = 24.525\,\text{N} > f_{s,\max} = 22.073\,\text{N}$$
  **Conclusion:** The driving force exceeds maximum static friction. The system breaks free and accelerates!

- **Step 2: Dynamic acceleration and tension**
  Kinetic friction force:
  $$f_k = \mu_k N_1 = (0.350)(49.05\,\text{N}) = 17.1675\,\text{N}$$
  Net accelerating force:
  $$F_{\text{net}} = m_2 g - f_k = 24.525 - 17.1675 = 7.3575\,\text{N}$$
  Total inertia:
  $$M_{\text{tot}} = m_1 + m_2 = 5.00 + 2.50 = 7.50\,\text{kg}$$
  Acceleration:
  $$a = \frac{F_{\text{net}}}{M_{\text{tot}}} = \frac{7.3575\,\text{N}}{7.50\,\text{kg}} = 0.9810\,\text{m/s}^2$$
  Tension in cord:
  $$T = m_2(g - a) = (2.50\,\text{kg})(9.81 - 0.981\,\text{m/s}^2) = (2.50)(8.829) = 22.0725\,\text{N}$$
  *Check on $m_1$:*
  $$T = f_k + m_1 a = 17.1675 + (5.00)(0.9810) = 17.1675 + 4.905 = 22.0725\,\text{N}$$. Exact match.

---

### Example 8.3: Three-Body Inline Train on a Table
**Problem:** Three blocks are connected in series on a frictionless horizontal table by two light cords:
- $m_1 = 2.00\,\text{kg}$ connected by Cord A to $m_2 = 4.00\,\text{kg}$.
- $m_2$ connected by Cord B to $m_3 = 6.00\,\text{kg}$.
A horizontal force $F = 36.0\,\text{N}$ pulls $m_3$ to the right.
1. Determine the common acceleration of the train.
2. Calculate the tension $T_A$ in Cord A.
3. Calculate the tension $T_B$ in Cord B.

**Solution:**
- **Step 1: System acceleration**
  Total mass $M = m_1 + m_2 + m_3 = 2.00 + 4.00 + 6.00 = 12.0\,\text{kg}$.
  $$a = \frac{F}{M} = \frac{36.0\,\text{N}}{12.0\,\text{kg}} = 3.00\,\text{m/s}^2$$

- **Step 2: Tension $T_A$ in Cord A**
  Cord A pulls only mass $m_1$:
  $$T_A = m_1 a = (2.00\,\text{kg})(3.00\,\text{m/s}^2) = 6.00\,\text{N}$$

- **Step 3: Tension $T_B$ in Cord B**
  Cord B pulls both $m_1$ and $m_2$:
  $$T_B = (m_1 + m_2) a = (2.00 + 4.00\,\text{kg})(3.00\,\text{m/s}^2) = (6.00\,\text{kg})(3.00\,\text{m/s}^2) = 18.0\,\text{N}$$
  *Check via $m_3$:*
  $$F - T_B = m_3 a \implies 36.0 - 18.0 = (6.00)(3.00) = 18.0\,\text{N}$$. Exact match.

---

### Example 8.4: Inclined Half-Atwood with Uplink
**Problem:** Mass $m_1 = 6.00\,\text{kg}$ is placed on an incline of angle $\theta = 37.0^\circ$ ($\sin 37^\circ \approx 0.6018, \cos 37^\circ \approx 0.7986$). It is connected via a cord over the top apex pulley to a hanging mass $m_2 = 8.00\,\text{kg}$. The kinetic friction coefficient on the incline is $\mu_k = 0.200$. Take $g = 9.81\,\text{m/s}^2$.
1. Determine the acceleration of $m_1$ up the incline.
2. Determine the tension in the cord.

**Solution:**
- **Step 1: Gravitational and frictional forces on $m_1$**
  Component of gravity down the ramp:
  $$F_{g1\parallel} = m_1 g\sin\theta = (6.00\,\text{kg})(9.81\,\text{m/s}^2)(0.60182) = 35.423\,\text{N}$$
  Normal force:
  $$N_1 = m_1 g\cos\theta = (6.00\,\text{kg})(9.81\,\text{m/s}^2)(0.79864) = 47.008\,\text{N}$$
  Kinetic friction (opposing upward motion, acting downslope):
  $$f_k = \mu_k N_1 = (0.200)(47.008\,\text{N}) = 9.402\,\text{N}$$
  Total downslope resisting force on $m_1$:
  $$R_1 = F_{g1\parallel} + f_k = 35.423 + 9.402 = 44.825\,\text{N}$$

- **Step 2: Driving force on $m_2$**
  $$F_{\text{drive}} = m_2 g = (8.00\,\text{kg})(9.81\,\text{m/s}^2) = 78.480\,\text{N}$$
  Net force driving the system:
  $$F_{\text{net}} = F_{\text{drive}} - R_1 = 78.480 - 44.825 = 33.655\,\text{N}$$

- **Step 3: Acceleration**
  $$M_{\text{tot}} = m_1 + m_2 = 6.00 + 8.00 = 14.00\,\text{kg}$$
  $$a = \frac{F_{\text{net}}}{M_{\text{tot}}} = \frac{33.655\,\text{N}}{14.00\,\text{kg}} = 2.4039\,\text{m/s}^2$$

- **Step 4: String tension**
  $$T = m_2(g - a) = (8.00\,\text{kg})(9.81 - 2.4039\,\text{m/s}^2) = (8.00)(7.4061) = 59.249\,\text{N}$$
  *Check on $m_1$:*
  $$T = R_1 + m_1 a = 44.825 + (6.00)(2.4039) = 44.825 + 14.423 = 59.248\,\text{N}$$. Exact match.

---

### Example 8.5: Double Atwood Machine (Compound Tree)
**Problem:** A main cord passes over a fixed ceiling pulley. One end supports mass $m_1 = 5.00\,\text{kg}$. The other end supports a movable pulley of mass $m_p = 0$, over which passes a second cord carrying masses $m_2 = 2.00\,\text{kg}$ and $m_3 = 3.00\,\text{kg}$. Take $g = 9.81\,\text{m/s}^2$.
1. Derive the equations of motion for the system.
2. Calculate the acceleration of $m_1$, $m_2$, and $m_3$.
3. Compute the tension in both cords.

**Solution:**
- **Step 1: Constraint geometry and coordinates**
  Let $y_1$ be downward position of $m_1$, and $y_p$ be downward position of the movable pulley.
  Main cord length: $y_1 + y_p = L_1 \implies a_1 + a_p = 0 \implies a_p = -a_1$.
  Let $y_2$ and $y_3$ be downward positions of $m_2$ and $m_3$.
  Second cord length: $(y_2 - y_p) + (y_3 - y_p) = L_2 \implies y_2 + y_3 - 2y_p = L_2$.
  Differentiating:
  $$a_2 + a_3 - 2a_p = 0 \implies a_2 + a_3 + 2a_1 = 0 \implies a_p = \frac{a_2 + a_3}{2} = -a_1$$

- **Step 2: Force balances**
  Let $T_1$ be tension in main cord, $T_2$ be tension in second cord.
  Since the movable pulley is massless:
  $$\sum F_p = T_1 - 2T_2 = m_p a_p = 0 \implies T_1 = 2T_2$$
  Equations of motion (taking downwards as positive):
  1) $m_1 g - T_1 = m_1 a_1 \implies m_1 g - 2T_2 = m_1 a_1 \implies a_1 = g - \frac{2T_2}{m_1}$
  2) $m_2 g - T_2 = m_2 a_2 \implies a_2 = g - \frac{T_2}{m_2}$
  3) $m_3 g - T_2 = m_3 a_3 \implies a_3 = g - \frac{T_2}{m_3}$

- **Step 3: Solve for $T_2$ using acceleration constraint**
  Substitute $a_1, a_2, a_3$ into $2a_1 + a_2 + a_3 = 0$:
  $$2\left(g - \frac{2T_2}{m_1}\right) + \left(g - \frac{T_2}{m_2}\right) + \left(g - \frac{T_2}{m_3}\right) = 0$$
  $$4g - T_2\left(\frac{4}{m_1} + \frac{1}{m_2} + \frac{1}{m_3}\right) = 0$$
  $$T_2 = \frac{4g}{\frac{4}{m_1} + \frac{1}{m_2} + \frac{1}{m_3}}$$

- **Step 4: Numerical evaluation**
  $$\frac{4}{m_1} = \frac{4}{5.00} = 0.800$$
  $$\frac{1}{m_2} = \frac{1}{2.00} = 0.500$$
  $$\frac{1}{m_3} = \frac{1}{3.00} = 0.33333$$
  $$\text{Denominator} = 0.800 + 0.500 + 0.33333 = 1.63333\,\text{kg}^{-1}$$
  $$T_2 = \frac{4(9.81)}{1.63333} = \frac{39.24}{1.63333} = 24.0245\,\text{N}$$
  $$T_1 = 2T_2 = 2(24.0245\,\text{N}) = 48.049\,\text{N}$$

- **Step 5: Compute accelerations (downwards positive)**
  $$a_1 = g - \frac{2T_2}{m_1} = 9.81 - \frac{48.049}{5.00} = 9.81 - 9.6098 = +0.2002\,\text{m/s}^2 \quad (\text{descends})$$
  $$a_2 = g - \frac{T_2}{m_2} = 9.81 - \frac{24.0245}{2.00} = 9.81 - 12.0123 = -2.2023\,\text{m/s}^2 \quad (\text{ascends})$$
  $$a_3 = g - \frac{T_2}{m_3} = 9.81 - \frac{24.0245}{3.00} = 9.81 - 8.0082 = +1.8018\,\text{m/s}^2 \quad (\text{descends})$$
  *Constraint Check:*
  $$2a_1 + a_2 + a_3 = 2(0.2002) - 2.2023 + 1.8018 = 0.4004 - 2.2023 + 1.8018 = -0.0001 \approx 0$$. Perfect.

---

### Example 8.6: 2:1 Movable Pulley Crane Hoist
**Problem:** A block $m_1 = 12.0\,\text{kg}$ is suspended from a single strand passing over a fixed overhead pulley and around a movable pulley supporting a load $m_2 = 30.0\,\text{kg}$. The other end of the cord around the movable pulley is anchored to the ceiling. Take $g = 9.81\,\text{m/s}^2$.
1. Determine the accelerations $a_1$ (of $m_1$) and $a_2$ (of $m_2$).
2. Compute the tension $T$ in the cord.

**Solution:**
- **Step 1: Constraint and Dynamic Relations**
  From Section 8.6:
  $$a_1 = g \frac{4(2m_1 - m_2)}{8m_1 + m_2}$$
  $$a_2 = -\frac{a_1}{2}$$

- **Step 2: Numerical evaluation**
  $$2m_1 - m_2 = 2(12.0) - 30.0 = 24.0 - 30.0 = -6.0\,\text{kg}$$
  $$8m_1 + m_2 = 8(12.0) + 30.0 = 96.0 + 30.0 = 126.0\,\text{kg}$$
  $$a_1 = (9.81\,\text{m/s}^2) \frac{4(-6.0)}{126.0} = (9.81) \frac{-24.0}{126.0} = -1.8686\,\text{m/s}^2$$
  The negative sign indicates $m_1$ accelerates **upward** at $1.869\,\text{m/s}^2$.
  Acceleration of load $m_2$:
  $$a_2 = -\frac{a_1}{2} = -\frac{-1.8686}{2} = +0.9343\,\text{m/s}^2 \quad (\text{downward})$$

- **Step 3: Cord tension**
  $$m_1 g - T = m_1 a_1 \implies T = m_1(g - a_1) = 12.0[9.81 - (-1.8686)] = 12.0(11.6786) = 140.14\,\text{N}$$
  *Check via $m_2$:*
  $$m_2 g - 2T = m_2 a_2 \implies 2T = m_2(g - a_2) = 30.0[9.81 - 0.9343] = 30.0(8.8757) = 266.27\,\text{N}$$
  $$T = \frac{266.27}{2} = 133.14 \dots$$ Wait! Let us re-verify:
  $m_1$ equation: $T - m_1 g = m_1 |a_1| \implies T = 12(9.81 + 1.8686) = 140.14\,\text{N}$.
  Wait, let us check: $30(9.81) - 2(140.14) = 294.3 - 280.28 = 14.02\,\text{N}$.
  $m_2 a_2 = 30(0.9343) = 28.03\,\text{N}$. Why the discrepancy?
  Ah! Let us re-derive the constraint rigorously:
  Position of $m_1$: $y_1$. Position of movable pulley: $y_2$.
  Cord length from anchor on ceiling down to movable pulley, up over fixed pulley, down to $m_1$:
  $L = 2y_2 + y_1$.
  Differentiating: $2a_2 + a_1 = 0 \implies a_1 = -2a_2$.
  Equations:
  $m_1 g - T = m_1 a_1 = m_1(-2a_2) = -2m_1 a_2 \implies T = m_1 g + 2m_1 a_2$.
  $m_2 g - 2T = m_2 a_2$.
  Substitute $T$:
  $m_2 g - 2(m_1 g + 2m_1 a_2) = m_2 a_2$.
  $(m_2 - 2m_1)g - 4m_1 a_2 = m_2 a_2 \implies (m_2 - 2m_1)g = (4m_1 + m_2) a_2$.
  $$a_2 = g \frac{m_2 - 2m_1}{4m_1 + m_2}$$
  $$a_1 = -2 a_2 = -2g \frac{m_2 - 2m_1}{4m_1 + m_2}$$
  Let us recalculate with this exact denominator:
  $$m_2 - 2m_1 = 30.0 - 24.0 = +6.0\,\text{kg}$$
  $$4m_1 + m_2 = 4(12.0) + 30.0 = 48.0 + 30.0 = 78.0\,\text{kg}$$
  $$a_2 = (9.81) \frac{6.0}{78.0} = 0.7546\,\text{m/s}^2 \quad (\text{downward})$$
  $$a_1 = -2(0.7546) = -1.5092\,\text{m/s}^2 \quad (\text{upward})$$
  Now check $T$:
  $$T = m_1(g - a_1) = 12.0[9.81 - (-1.5092)] = 12.0(11.3192) = 135.83\,\text{N}$$
  $$2T = 2(135.83) = 271.66\,\text{N}$$
  $$m_2 g - 2T = 30(9.81) - 271.66 = 294.30 - 271.66 = 22.64\,\text{N}$$
  $$m_2 a_2 = 30(0.7546) = 22.64\,\text{N}$$. Exact, flawless match!

---

### Example 8.7: Atwood Machine in an Accelerating Elevator
**Problem:** An Atwood machine with masses $m_1 = 3.00\,\text{kg}$ and $m_2 = 5.00\,\text{kg}$ is mounted inside an elevator cab. Take $g = 9.81\,\text{m/s}^2$.
1. If the elevator accelerates upward at $A = 2.20\,\text{m/s}^2$, find the acceleration of $m_2$ relative to the elevator, and the cord tension $T$.
2. If the elevator cable snaps and the cab enters free fall ($A = -g$), what is the relative acceleration and cord tension?

**Solution:**
- **Step 1: Upward accelerating elevator**
  In the non-inertial frame of the elevator, effective gravity is:
  $$g_{\text{eff}} = g + A = 9.81 + 2.20 = 12.01\,\text{m/s}^2$$
  Relative acceleration:
  $$a_{\text{rel}} = g_{\text{eff}} \frac{m_2 - m_1}{m_1 + m_2} = (12.01\,\text{m/s}^2) \frac{5.00 - 3.00}{5.00 + 3.00} = (12.01) \frac{2.00}{8.00} = 3.0025\,\text{m/s}^2$$
  Cord tension:
  $$T = \frac{2 m_1 m_2 g_{\text{eff}}}{m_1 + m_2} = \frac{2(3.00)(5.00)(12.01)}{8.00} = \frac{360.3}{8.00} = 45.038\,\text{N}$$

- **Step 2: Free fall ($A = -g$)**
  $$g_{\text{eff}} = g + (-g) = 0\,\text{m/s}^2$$
  $$a_{\text{rel}} = 0 \times \frac{2}{8} = 0\,\text{m/s}^2$$
  $$T = 0\,\text{N}$$
  In free fall, apparent weight vanishes completely; both masses drift weightlessly, and cord tension collapses to zero!

---

### Example 8.8: Massive Rope on an Atwood Machine
**Problem:** Two equal masses $M = 4.00\,\text{kg}$ hang from an Atwood machine. The connecting rope is uniform with length $L = 6.00\,\text{m}$ and total mass $m_r = 1.20\,\text{kg}$ (linear density $\lambda = m_r / L = 0.200\,\text{kg/m}$). The system is initially balanced with equal rope lengths on both sides. It is then displaced slightly by $x_0 = 0.500\,\text{m}$ so that the right side hangs lower by $2x_0$. Take $g = 9.81\,\text{m/s}^2$.
1. Derive the equation of motion as a function of displacement $x$ from the balanced position.
2. Calculate the instantaneous acceleration at $x = 0.500\,\text{m}$.
3. What is the nature of the motion?

**Solution:**
- **Step 1: Derivation of equation of motion**
  Let $x$ be the displacement of the right mass downward from equilibrium.
  - Length of rope on right side: $L/2 + x$.
  - Length of rope on left side: $L/2 - x$.
  - Excess rope on right side: $(L/2 + x) - (L/2 - x) = 2x$.
  - Excess gravitational drive:
    $$\Delta F = (\lambda \cdot 2x) g = 2\lambda g x$$
  - Total mass in motion (constant):
    $$M_{\text{tot}} = 2M + m_r$$
  Applying $\sum F = M_{\text{tot}} \ddot{x}$:
  $$M_{\text{tot}} \ddot{x} = 2\lambda g x \implies \ddot{x} - \left(\frac{2\lambda g}{2M + m_r}\right) x = 0$$

- **Step 2: Instantaneous acceleration at $x = 0.500\,\text{m}$**
  $$M_{\text{tot}} = 2(4.00) + 1.20 = 8.00 + 1.20 = 9.20\,\text{kg}$$
  $$\Delta F = 2(0.200\,\text{kg/m})(9.81\,\text{m/s}^2)(0.500\,\text{m}) = 1.962\,\text{N}$$
  $$a = \ddot{x} = \frac{1.962\,\text{N}}{9.20\,\text{kg}} = 0.2133\,\text{m/s}^2$$

- **Step 3: Nature of motion**
  Let $\omega^2 = \frac{2\lambda g}{M_{\text{tot}}}$. The differential equation is $\ddot{x} - \omega^2 x = 0$.
  The general solution is exponential runaway:
  $$x(t) = x_0 \cosh(\omega t)$$
  The system is in **unstable equilibrium**. Any slight perturbation triggers exponential runaway as the heavier side accumulates more rope, continuously increasing the unbalanced gravitational drive!

---

### Example 8.9: Block on a Block with Friction
**Problem:** A block $m_1 = 3.00\,\text{kg}$ rests on top of block $m_2 = 7.00\,\text{kg}$, which in turn rests on a frictionless horizontal floor. The coefficient of static friction between the two blocks is $\mu_s = 0.400$, and kinetic friction is $\mu_k = 0.300$. A horizontal force $F$ is applied directly to the bottom block $m_2$. Take $g = 9.81\,\text{m/s}^2$.
1. What is the maximum horizontal force $F_{\max}$ that can be applied to $m_2$ before $m_1$ begins to slip?
2. If $F = 55.0\,\text{N}$, determine the accelerations $a_1$ and $a_2$.

**Solution:**
- **Step 1: Maximum force without slip**
  The top block $m_1$ is accelerated purely by static friction from $m_2$:
  $$f_s = m_1 a \le f_{s,\max} = \mu_s m_1 g$$
  Therefore, the maximum acceleration $m_1$ can experience without slipping is:
  $$a_{\max} = \mu_s g = (0.400)(9.81\,\text{m/s}^2) = 3.924\,\text{m/s}^2$$
  Since both blocks accelerate together:
  $$F_{\max} = (m_1 + m_2) a_{\max} = (3.00 + 7.00\,\text{kg})(3.924\,\text{m/s}^2) = (10.0\,\text{kg})(3.924\,\text{m/s}^2) = 39.24\,\text{N}$$

- **Step 2: Accelerations when $F = 55.0\,\text{N}$**
  Since $F = 55.0\,\text{N} > F_{\max} = 39.24\,\text{N}$, relative slipping occurs!
  Kinetic friction acts between the blocks:
  $$f_k = \mu_k m_1 g = (0.300)(3.00\,\text{kg})(9.81\,\text{m/s}^2) = 8.829\,\text{N}$$
  - For top block $m_1$:
    $$a_1 = \frac{f_k}{m_1} = \frac{8.829\,\text{N}}{3.00\,\text{kg}} = \mu_k g = (0.300)(9.81) = 2.943\,\text{m/s}^2$$
  - For bottom block $m_2$:
    $$\sum F_2 = F - f_k = 55.0 - 8.829 = 46.171\,\text{N}$$
    $$a_2 = \frac{46.171\,\text{N}}{7.00\,\text{kg}} = 6.5959\,\text{m/s}^2$$
  The bottom block accelerates forward at $6.60\,\text{m/s}^2$, sliding out from underneath the top block, which accelerates forward at only $2.94\,\text{m/s}^2$.

---

### Example 8.10: Falling Chain Off a Table Edge
**Problem:** A heavy, flexible uniform chain of length $L = 2.50\,\text{m}$ and mass $M = 5.00\,\text{kg}$ lies on a frictionless horizontal table with an initial length $y_0 = 0.300\,\text{m}$ hanging vertically over the edge. It is released from rest. Take $g = 9.81\,\text{m/s}^2$.
1. Derive the velocity $v(y)$ of the chain as a function of the hanging length $y$.
2. Compute the acceleration of the chain when $y = 1.25\,\text{m}$ (half the chain hanging).
3. Compute the velocity of the chain at the exact instant the final link leaves the table ($y = L$).

**Solution:**
- **Step 1: Equation of motion and differential equation**
  Let $\lambda = M/L$ be the uniform linear mass density.
  At any instant when length $y$ hangs over the edge:
  - Driving gravitational force = weight of hanging segment = $(\lambda y)g$.
  - Total mass of chain being accelerated = $M = \lambda L$.
  $$\sum F = (\lambda y)g = (\lambda L) a \implies a = \frac{d v}{dt} = g \frac{y}{L}$$
  Using the chain rule $a = v \frac{dv}{dy}$:
  $$v \frac{dv}{dy} = \frac{g}{L} y \implies v \, dv = \frac{g}{L} y \, dy$$
  Integrate both sides from initial state $(y = y_0, v = 0)$ to arbitrary state $(y, v)$:
  $$\int_0^v v' \, dv' = \frac{g}{L} \int_{y_0}^y y' \, dy'$$
  $$\frac{1}{2} v^2 = \frac{g}{2L} (y^2 - y_0^2)$$
  $$v(y) = \sqrt{\frac{g}{L}(y^2 - y_0^2)}$$

- **Step 2: Acceleration when $y = 1.25\,\text{m}$**
  $$a(y=1.25) = g \frac{y}{L} = (9.81\,\text{m/s}^2) \frac{1.25\,\text{m}}{2.50\,\text{m}} = 9.81 \times 0.500 = 4.905\,\text{m/s}^2$$

- **Step 3: Terminal velocity when $y = L = 2.50\,\text{m}$**
  $$v(L) = \sqrt{\frac{9.81}{2.50}\left(2.50^2 - 0.300^2\right)} = \sqrt{3.924(6.25 - 0.090)} = \sqrt{3.924 \times 6.160} = \sqrt{24.1718} = 4.916\,\text{m/s}$$

---

## 8.8 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 8.9.

### Tier 1: Foundational Atwood Dynamics
- **Exercise 8.1:** An Atwood machine has masses $m_1 = 3.20\,\text{kg}$ and $m_2 = 3.60\,\text{kg}$. Find the system acceleration and string tension ($g = 9.81\,\text{m/s}^2$).
- **Exercise 8.2:** In an Atwood machine, the tension in the cord is measured to be $24.0\,\text{N}$ while $m_1 = 2.00\,\text{kg}$. Compute the acceleration and the unknown mass $m_2$.

### Tier 2: Half-Atwood & Table Systems
- **Exercise 8.3:** A block $m_1 = 4.00\,\text{kg}$ on a frictionless horizontal table is connected to hanging mass $m_2 = 1.00\,\text{kg}$. If released from rest, how far does $m_1$ travel in $1.20\,\text{s}$?
- **Exercise 8.4:** In a half-Atwood setup, $m_1 = 10.0\,\text{kg}$ sits on a rough table with $\mu_s = 0.300$ and $\mu_k = 0.220$. What minimum hanging mass $m_2$ will initiate motion, and what will the acceleration be once sliding begins?

### Tier 3: Incline Coupling & Apparent Weight
- **Exercise 8.5:** An Atwood machine with $m_1 = 2.50\,\text{kg}$ and $m_2 = 4.50\,\text{kg}$ hangs from a spring scale attached to the ceiling. What weight does the scale register during motion?
- **Exercise 8.6:** A block $m_1 = 8.00\,\text{kg}$ on a $30.0^\circ$ frictionless incline is connected over a top pulley to hanging mass $m_2 = 6.00\,\text{kg}$. Compute the acceleration and string tension.

### Tier 4: Compound Constraints & Movable Pulleys
- **Exercise 8.7:** In a 2:1 movable pulley system (movable pulley carrying load $m_2 = 20.0\,\text{kg}$, single strand supporting $m_1 = 8.00\,\text{kg}$), determine the acceleration of $m_2$ and the string tension.
- **Exercise 8.8:** Two masses $m_1 = 5.00\,\text{kg}$ and $m_2 = 2.00\,\text{kg}$ are connected across a table where $m_1$ has a movable pulley attached to it. If the cord wraps around $m_1$'s pulley and anchors to a wall, derive the constraint and find the acceleration of each mass on a frictionless table.

### Tier 5: Stacked Systems & Continuous Chains
- **Exercise 8.9:** A $2.00\,\text{kg}$ block sits on a $6.00\,\text{kg}$ block on a frictionless table. The coefficient of static friction between the blocks is $\mu_s = 0.350$. If a horizontal force is applied to the *top* block, what is the maximum force before it slips relative to the bottom block?
- **Exercise 8.10:** A uniform chain of length $L = 3.00\,\text{m}$ and mass $M = 4.50\,\text{kg}$ hangs over a small frictionless peg with $1.00\,\text{m}$ on one side and $2.00\,\text{m}$ on the other. It is released from rest. Compute the time required for the shorter end to slip completely off the peg.

---

## 8.9 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 8.1
- **Given:** $m_1 = 3.20\,\text{kg}$, $m_2 = 3.60\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: System acceleration**
  $$a = g \frac{m_2 - m_1}{m_1 + m_2} = (9.81) \frac{3.60 - 3.20}{3.60 + 3.20} = (9.81) \frac{0.40}{6.80} = (9.81)(0.058824) = 0.5771\,\text{m/s}^2$$
- **Step 2: String tension**
  $$T = m_1(g + a) = (3.20\,\text{kg})(9.81 + 0.5771\,\text{m/s}^2) = (3.20)(10.3871) = 33.24\,\text{N}$$

---

### Solution 8.2
- **Given:** $m_1 = 2.00\,\text{kg}$, $T = 24.0\,\text{N}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Determine acceleration from $m_1$**
  Since $T = 24.0\,\text{N} > m_1 g = (2.00)(9.81) = 19.62\,\text{N}$, $m_1$ accelerates upward:
  $$\sum F_1 = T - m_1 g = m_1 a \implies a = \frac{T - m_1 g}{m_1} = \frac{24.0 - 19.62}{2.00} = \frac{4.38}{2.00} = 2.19\,\text{m/s}^2$$
- **Step 2: Determine $m_2$**
  For $m_2$ (accelerating downward):
  $$m_2 g - T = m_2 a \implies m_2(g - a) = T \implies m_2 = \frac{T}{g - a}$$
  $$m_2 = \frac{24.0\,\text{N}}{9.81 - 2.19\,\text{m/s}^2} = \frac{24.0}{7.62} = 3.15\,\text{kg}$$

---

### Solution 8.3
- **Given:** $m_1 = 4.00\,\text{kg}$, $m_2 = 1.00\,\text{kg}$, frictionless table, $t = 1.20\,\text{s}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Acceleration**
  $$a = g \frac{m_2}{m_1 + m_2} = (9.81) \frac{1.00}{4.00 + 1.00} = \frac{9.81}{5.00} = 1.962\,\text{m/s}^2$$
- **Step 2: Distance traveled**
  $$s = \frac{1}{2} a t^2 = \frac{1}{2}(1.962\,\text{m/s}^2)(1.20\,\text{s})^2 = 0.981 \times 1.44 = 1.413\,\text{m}$$

---

### Solution 8.4
- **Given:** $m_1 = 10.0\,\text{kg}$, $\mu_s = 0.300$, $\mu_k = 0.220$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Minimum hanging mass to initiate motion**
  At static limit:
  $$m_2 g = f_{s,\max} = \mu_s m_1 g \implies m_2 = \mu_s m_1 = (0.300)(10.0\,\text{kg}) = 3.00\,\text{kg}$$
- **Step 2: Acceleration once sliding**
  $$a = g \frac{m_2 - \mu_k m_1}{m_1 + m_2} = (9.81) \frac{3.00 - (0.220)(10.0)}{10.0 + 3.00} = (9.81) \frac{3.00 - 2.20}{13.0} = (9.81) \frac{0.80}{13.0} = 0.6037\,\text{m/s}^2$$

---

### Solution 8.5
- **Given:** $m_1 = 2.50\,\text{kg}$, $m_2 = 4.50\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Cord tension**
  $$T = \frac{2 m_1 m_2 g}{m_1 + m_2} = \frac{2(2.50)(4.50)(9.81)}{2.50 + 4.50} = \frac{220.725}{7.00} = 31.532\,\text{N}$$
- **Step 2: Scale reading (Bracket force)**
  $$F_{\text{scale}} = 2 T = 2(31.532\,\text{N}) = 63.06\,\text{N}$$
  *Notice:* Combined static weight is $(2.50 + 4.50)(9.81) = 68.67\,\text{N}$. The scale registers $5.61\,\text{N}$ less than static weight!

---

### Solution 8.6
- **Given:** $m_1 = 8.00\,\text{kg}$ on $\theta = 30.0^\circ$ frictionless ramp, $m_2 = 6.00\,\text{kg}$ hanging, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Downslope gravity component on $m_1$**
  $$F_{g1\parallel} = m_1 g\sin(30.0^\circ) = (8.00)(9.81)(0.500) = 39.24\,\text{N}$$
- **Step 2: Hanging mass drive**
  $$F_{\text{drive}} = m_2 g = (6.00)(9.81) = 58.86\,\text{N}$$
  Since $F_{\text{drive}} > F_{g1\parallel}$, $m_2$ falls and pulls $m_1$ up the incline.
- **Step 3: Acceleration**
  $$a = \frac{F_{\text{drive}} - F_{g1\parallel}}{m_1 + m_2} = \frac{58.86 - 39.24}{8.00 + 6.00} = \frac{19.62\,\text{N}}{14.00\,\text{kg}} = 1.4014\,\text{m/s}^2$$
- **Step 4: Tension**
  $$T = m_2(g - a) = (6.00)(9.81 - 1.4014) = (6.00)(8.4086) = 50.45\,\text{N}$$

---

### Solution 8.7
- **Given:** Movable pulley with $m_2 = 20.0\,\text{kg}$, single strand with $m_1 = 8.00\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Acceleration formula from Example 8.6**
  $$a_2 = g \frac{m_2 - 2m_1}{4m_1 + m_2} = (9.81) \frac{20.0 - 2(8.00)}{4(8.00) + 20.0} = (9.81) \frac{20.0 - 16.0}{32.0 + 20.0} = (9.81) \frac{4.0}{52.0} = 0.7546\,\text{m/s}^2 \quad (\text{downward})$$
  $$a_1 = -2 a_2 = -1.509\,\text{m/s}^2 \quad (\text{upward})$$
- **Step 2: Tension**
  $$T = m_1(g - a_1) = (8.00)[9.81 - (-1.5092)] = 8.00(11.3192) = 90.55\,\text{N}$$

---

### Solution 8.8
- **Given:** $m_1 = 5.00\,\text{kg}$ on table has movable pulley. Cord anchored to wall, wraps around $m_1$'s pulley, passes over table edge pulley to hanging $m_2 = 2.00\,\text{kg}$. Frictionless.
- **Step 1: Constraint equation**
  Let $x_1$ be distance of $m_1$ from wall anchor. Two strands connect wall to $m_1$'s pulley: length on table = $2x_1$.
  Hanging strand length: $y_2$.
  Total length: $L = 2x_1 + y_2 \implies 2a_1 + a_2 = 0 \implies a_2 = -2a_1$.
  When $m_1$ moves distance $d$ right, $m_2$ drops distance $2d$.
- **Step 2: Force balances**
  Two strands pull $m_1$ rightward:
  $$2T = m_1 a_1 \implies T = \frac{1}{2} m_1 a_1$$
  For hanging mass $m_2$:
  $$m_2 g - T = m_2 a_2 = m_2 (2a_1)$$
  Substitute $T$:
  $$m_2 g - \frac{1}{2} m_1 a_1 = 2m_2 a_1 \implies m_2 g = \left(2m_2 + \frac{1}{2}m_1\right) a_1 = \left(\frac{4m_2 + m_1}{2}\right) a_1$$
  $$a_1 = \frac{2 m_2 g}{4m_2 + m_1} = \frac{2(2.00)(9.81)}{4(2.00) + 5.00} = \frac{39.24}{13.00} = 3.018\,\text{m/s}^2$$
  $$a_2 = 2 a_1 = 2(3.018) = 6.037\,\text{m/s}^2$$

---

### Solution 8.9
- **Given:** Top block $m_1 = 2.00\,\text{kg}$, bottom block $m_2 = 6.00\,\text{kg}$, $\mu_s = 0.350$, force $F$ applied to $m_1$.
- **Step 1: Maximum acceleration of the bottom block**
  The bottom block $m_2$ is propelled solely by static friction from $m_1$:
  $$f_s = m_2 a \le f_{s,\max} = \mu_s m_1 g$$
  $$a_{\max} = \frac{\mu_s m_1 g}{m_2} = \frac{(0.350)(2.00\,\text{kg})(9.81\,\text{m/s}^2)}{6.00\,\text{kg}} = \frac{6.867}{6.00} = 1.1445\,\text{m/s}^2$$
- **Step 2: Total force required for this acceleration**
  $$F_{\max} = (m_1 + m_2) a_{\max} = (2.00 + 6.00\,\text{kg})(1.1445\,\text{m/s}^2) = (8.00)(1.1445) = 9.156\,\text{N}$$
  If $F > 9.16\,\text{N}$, the top block slips relative to the bottom block!

---

### Solution 8.10
- **Given:** Chain length $L = 3.00\,\text{m}$, initial hanging lengths $y_1(0) = 1.00\,\text{m}$, $y_2(0) = 2.00\,\text{m}$.
- **Step 1: Differential equation**
  Let $x$ be the displacement of the chain toward the longer side.
  At displacement $x$:
  - Longer side length = $2.00 + x$.
  - Shorter side length = $1.00 - x$.
  - Difference = $(2.00 + x) - (1.00 - x) = 1.00 + 2x$.
  Driving force: $\Delta F = (\lambda g)(1.00 + 2x)$.
  Total mass: $M = \lambda L$.
  $$\ddot{x} = \frac{\Delta F}{M} = \frac{g}{L}(1.00 + 2x) = \frac{2g}{L}\left(x + \frac{1.00}{2}\right) = \frac{2g}{L}(x + 0.50)$$
- **Step 2: Define substitution**
  Let $u(t) = x(t) + 0.50$. Then $\ddot{u} = \ddot{x}$.
  $$\ddot{u} = \omega^2 u, \quad \text{where } \omega = \sqrt{\frac{2g}{L}} = \sqrt{\frac{2(9.81)}{3.00}} = \sqrt{6.54} = 2.5573\,\text{s}^{-1}$$
  Initial conditions: at $t = 0$, $x(0) = 0 \implies u(0) = 0.50$, and $\dot{u}(0) = 0$.
  The solution is:
  $$u(t) = 0.50 \cosh(\omega t)$$
  $$x(t) = 0.50 \cosh(\omega t) - 0.50$$
- **Step 3: Condition for shorter end to slip off peg**
  The shorter end leaves the peg when $1.00 - x = 0 \implies x = 1.00\,\text{m}$.
  $$1.00 = 0.50 \cosh(\omega t) - 0.50 \implies 0.50 \cosh(\omega t) = 1.50 \implies \cosh(\omega t) = 3.00$$
  $$\omega t = \operatorname{arcosh}(3.00) = \ln(3 + \sqrt{3^2 - 1}) = \ln(3 + \sqrt{8}) = \ln(3 + 2.8284) = \ln(5.8284) = 1.7628$$
  $$t = \frac{1.7628}{\omega} = \frac{1.7628}{2.5573\,\text{s}^{-1}} = 0.6893\,\text{s}$$
  The chain slips completely off the peg in $0.689$ seconds.
