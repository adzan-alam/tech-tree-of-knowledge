# Chapter 09: Elastic Restitution, Springs, and Hooke’s Law — Microscopic Foundations, Coupling, and Instantaneous Dynamics

> *"Ut tensio, sic vis: as the extension, so the force. Robert Hooke’s anagram revealed that nature stores mechanical energy in the geometric distortion of atomic lattices, creating a linear restoring force that serves as the universal gateway to harmonic motion."*

---

## 9.1 The Anagram of 1676 and the Universal Law of Elasticity

In 1676, the English polymath Robert Hooke published an obscure Latin anagram in the back of a pamphlet on helioscopes: `ceiiinosssttuv`. Two years later, in 1678, he unveiled the decrypted message:

$$\textit{Ut tensio, sic vis}$$

Translated literally: *"As the extension, so the force."* Hooke had discovered that the restorative force exerted by a deformed metallic spring, a flexing bow, or a stretched wire is directly proportional to its displacement from its equilibrium configuration:

$$F_s = -k x$$

Here, $x$ represents the displacement from the unstretched resting length $L_0$ ($x = L - L_0$), $k$ is the **spring constant** (stiffness) measured in Newtons per meter ($\text{N/m}$), and the essential negative sign denotes that $\vec{F}_s$ is a **restoring force**, always directed opposite to the displacement vector.

While Hooke formulated his law as an empirical observation of macroscopic metal coils and timber beams, modern quantum mechanics and solid-state physics demonstrate that Hooke's Law is not merely a fortuitous engineering rule. It is a fundamental mathematical consequence of **energy minimization in interatomic potential fields**.

---

## 9.2 The Microscopic Origin: Taylor Expansion of Interatomic Potentials

Every macroscopic solid—whether steel, rubber, or crystalline silicon—is composed of atoms held in equilibrium by electromagnetic forces. Consider two adjacent neutral atoms or ions separated by an internuclear distance $r$. Their interaction is described by an interatomic potential energy function $V(r)$, classically modeled by the Lennard-Jones (12-6) potential or the Morse potential:

$$V(r) = 4\epsilon \left[ \left(\frac{\sigma}{r}\right)^{12} - \left(\frac{\sigma}{r}\right)^6 \right]$$

```
      Energy V(r)
          ^
          |      Repulsive (Pauli exclusion)
          |       |
          |       |
          +       \
          |        \
          |         \          Equilibrium r0: dV/dr = 0
       0 -+----------\---------.-----------------------------> Distance r
          |           \       / \
          |            \     /   '--- Attractive (Van der Waals)
          |             '---'
          |           V_min = -ε
          v
```

1. **At very small separations ($r \to 0$):** Overlapping electron clouds trigger intense quantum-mechanical Pauli exclusion repulsion, causing $V(r)$ to spike upward toward infinity as $+1/r^{12}$.
2. **At large separations ($r \to \infty$):** Induced dipole-dipole interactions (Van der Waals forces) produce a gentle attractive potential decaying as $-1/r^6$.
3. **At the equilibrium separation $r_0$:** The potential achieves an absolute minimum $V(r_0) = -\epsilon$. At this separation, the net interatomic force vanishes:
   $$F(r_0) = -\left.\frac{dV}{dr}\right|_{r = r_0} \equiv 0$$

Now suppose an external tensile or compressive load slightly perturbs the internuclear separation by a small displacement $\delta r = r - r_0$, where $|\delta r| \ll r_0$. Let us perform a **Taylor series expansion** of the potential energy function $V(r)$ around the equilibrium point $r_0$:

$$V(r) = V(r_0) + \left.\frac{dV}{dr}\right|_{r_0} (r - r_0) + \frac{1}{2!} \left.\frac{d^2V}{dr^2}\right|_{r_0} (r - r_0)^2 + \frac{1}{3!} \left.\frac{d^3V}{dr^3}\right|_{r_0} (r - r_0)^3 + \dots$$

Examine each term:
- $V(r_0)$: An arbitrary reference constant (depth of the potential well).
- $\left.\frac{dV}{dr}\right|_{r_0} = 0$: The first derivative vanishes identically because $r_0$ is a stationary minimum.
- $\left.\frac{d^2V}{dr^2}\right|_{r_0} = k_{\text{micro}} > 0$: The second derivative is strictly positive, representing the local curvature (stiffness) of the atomic potential well.

Neglecting third-order and higher terms for small displacements ($\delta r \ll r_0$), the potential energy collapses to a **pure parabolic well**:

$$V(r) \approx V(r_0) + \frac{1}{2} k_{\text{micro}} (r - r_0)^2$$

Differentiating to obtain the interatomic restoring force:

$$F(r) = -\frac{dV}{dr} \approx -k_{\text{micro}} (r - r_0) = -k_{\text{micro}} \delta r$$

**The Universal Principle of Elastic Linearity:**
> *Every stable physical system with smooth potential energy functions behaves as an ideal Hookean linear spring for sufficiently small displacements about its equilibrium configuration!*

Macroscopic stiffness $k$ is simply the macroscopic summation of trillions of parallel and series atomic bonds acting across the cross-sectional area and length of the material.

---

## 9.3 Limits of Elasticity: From Hooke to Plastic Failure

Hooke’s Law holds only within the **elastic limit**. If the applied stress exceeds material thresholds, the atomic bonds undergo irreversible physical transformations.

```
      Stress σ
         ^                               Fracture
         |                          Ultimate  x
         |                        Strength .-~'
         |                    Yield  .---'
         |                   Point .' (Plastic Flow)
         |         Elastic   /
         |          Limit   /
         |                ./
         |               /  Linear Elastic Region (Hooke's Law: σ = E * ε)
         |              /
         +-------------+---------------------------------> Strain ε
```

1. **Linear Elastic Region ($0 \le \sigma \le \sigma_{\text{prop}}$):** Hooke's Law holds exactly. Stress $\sigma = F/A$ is proportional to strain $\epsilon = \Delta L / L_0$ through Young's Modulus: $\sigma = E \epsilon$. When the load is removed, the material returns to its exact original length with zero permanent deformation.
2. **Elastic Limit / Yield Point ($\sigma_y$):** The maximum stress the material can sustain without permanent plastic deformation.
3. **Plastic Deformation Region ($\sigma > \sigma_y$):** Atomic planes slip past one another via dislocation migration. Removing the load results in a permanent plastic set; the original length is irrevocably altered.
4. **Ultimate Tensile Strength & Fracture ($\sigma_{\text{uts}}$):** Micro-voids coalesce into macroscopic cracks, culminating in structural rupture.

---

## 9.4 Vectorial Hooke’s Law in Two and Three Dimensions

In a 2D or 3D physics simulation, a spring is not constrained to a single Cartesian axis. It connects two arbitrary spatial points: an anchor position $\vec{r}_A$ and a particle position $\vec{r}_B$.

```
                     ^ +Y
                     |
                     |         (Particle B)
                     |         r_B *
                     |            /
                     |           /
                     |          /  Spring (Current length L, rest length L0)
                     |         /
                     |        * r_A (Anchor A)
                     |
                     +---------------------------------> +X
```

Let:
- $\vec{r}_{AB} = \vec{r}_B - \vec{r}_A$ be the displacement vector from anchor $A$ to body $B$.
- $L = \|\vec{r}_{AB}\| = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$ be the instantaneous Euclidean length of the spring.
- $L_0$ be the unstretched resting length of the spring.
- $\hat{u}_{AB} = \frac{\vec{r}_{AB}}{\|\vec{r}_{AB}\|}$ be the unit vector pointing from $A$ to $B$.

The scalar elongation (extension or compression) of the spring is:

$$\Delta L = L - L_0$$

- If $\Delta L > 0$, the spring is stretched (in tension); it pulls body $B$ back toward $A$.
- If $\Delta L < 0$, the spring is compressed; it pushes body $B$ away from $A$.
- If $\Delta L = 0$, the spring is at rest; it exerts zero force.

The vector force exerted **on body $B$** by the spring is:

$$\vec{F}_{s \to B} = -k (L - L_0) \hat{u}_{AB} = -k \left( \|\vec{r}_B - \vec{r}_A\| - L_0 \right) \frac{\vec{r}_B - \vec{r}_A}{\|\vec{r}_B - \vec{r}_A\|}$$

By Newton's Third Law, the force exerted **on anchor $A$** is equal and opposite:

$$\vec{F}_{s \to A} = -\vec{F}_{s \to B} = +k (L - L_0) \hat{u}_{AB}$$

This formulation is universally valid in 2D and 3D computational physics engines and naturally handles arbitrary rotations, extensions, and compressions without trigonometric singularity.

---

## 9.5 Equivalent Spring Constants: Parallel and Series Architectures

When multiple springs are assembled into mechanical networks, they can be reduced to an single **equivalent spring constant** $k_{\text{eq}}$.

### Architecture 1: Parallel Configuration
In a parallel arrangement, multiple springs are mounted side-by-side between the same rigid boundary and the same moving mass.

```
           Anchor Ceiling
           =====================
             |        |        |
            [k1]     [k2]     [k3]
             |        |        |
           --+--------+--------+--
           |     Mass (m)        |
           -----------------------
```

1. **Displacement Condition:** Because the mass is rigid and moves by displacement $x$, every spring undergoes the **identical extension**:
   $$x_1 = x_2 = \dots = x_n = x$$
2. **Force Summation:** The total restoring force acting on the mass is the sum of the individual forces exerted by each spring:
   $$F_{\text{total}} = F_1 + F_2 + \dots + F_n = -(k_1 x + k_2 x + \dots + k_n x) = -\left(\sum_{i=1}^n k_i\right) x$$
3. Equating this to the equivalent single spring $F_{\text{total}} = -k_{\text{eq}} x$:

$$k_{\text{parallel}} = \sum_{i=1}^n k_i = k_1 + k_2 + \dots + k_n$$

**Rule:** Springs in parallel reinforce one another; the equivalent stiffness is the direct algebraic sum of individual stiffnesses.

### Architecture 2: Series Configuration
In a series arrangement, springs are connected end-to-end like links in a chain.

```
           Anchor Ceiling
           ==============
                 |
                [k1]
                 | (Junction node: massless)
                [k2]
                 |
               [ m ] Mass
```

1. **Force Condition:** Consider the massless junction connecting Spring 1 and Spring 2. Since the junction has mass $m_j \to 0$, Newton's Second Law requires:
   $$\sum F_j = T_1 - T_2 = m_j a_j = 0 \implies T_1 = T_2 = F$$
   Therefore, **every spring in a series chain experiences the exact same tension/force $F$**:
   $$F = k_1 x_1 = k_2 x_2 = \dots = k_n x_n$$
2. **Displacement Summation:** The total displacement $x_{\text{total}}$ of the attached mass is the sum of the individual extensions of each spring:
   $$x_{\text{total}} = x_1 + x_2 + \dots + x_n$$
3. Substitute $x_i = F / k_i$:
   $$x_{\text{total}} = \frac{F}{k_1} + \frac{F}{k_2} + \dots + \frac{F}{k_n} = F \left( \frac{1}{k_1} + \frac{1}{k_2} + \dots + \frac{1}{k_n} \right)$$
4. By definition of equivalent spring constant, $x_{\text{total}} = F / k_{\text{eq}}$:

$$\frac{1}{k_{\text{series}}} = \sum_{i=1}^n \frac{1}{k_i} = \frac{1}{k_1} + \frac{1}{k_2} + \dots + \frac{1}{k_n}$$

For two springs in series:

$$k_{\text{series}} = \frac{k_1 k_2}{k_1 + k_2}$$

**Rule:** Springs in series are always *more compliant (softer)* than any individual spring in the chain ($k_{\text{series}} < \min(k_i)$).

### The Spring Cutting Theorem
What happens to the spring constant when an ideal spring of length $L$ and constant $k$ is cut into two segments of lengths $L_1$ and $L_2$?
Regard the original spring as two smaller springs connected in series:
$$\frac{1}{k} = \frac{1}{k_1} + \frac{1}{k_2}$$
Because stiffness is inversely proportional to length ($k \propto 1/L$):
$$k \cdot L = k_1 \cdot L_1 = k_2 \cdot L_2 = \text{constant}$$

$$k_1 = k \frac{L}{L_1}, \qquad k_2 = k \frac{L}{L_2}$$

**Consequence:** Cutting a spring in half ($L_1 = L/2$) doubles its stiffness ($k_1 = 2k$)! A shorter coil requires twice as much force to produce a one-meter extension because there are half as many atomic bonds to share the strain.

---

## 9.6 The Vertical Hanging Spring: Origin Shift and Harmonic Equivalence

Consider a spring of stiffness $k$ suspended vertically from a rigid ceiling. When an object of mass $m$ is attached, the spring extends under gravity to a new equilibrium position.

```
       Unstretched Spring       Static Equilibrium        Dynamic Oscillation
           (Length L0)             (Length L0 + y_eq)      (Position y = y_eq + y')
       ==================      =====================     =========================
              |                           |                          |
              |                           |                          |
             [ ]                         [ ]                        [ ]
              |                           |                          |
              |                           |                          |
             --- (y = 0)                 [m]                        [m]
                                          |                          |
                                         --- (y = y_eq = mg/k)       v +y'
                                                                    --- (y = y_eq + y')
```

### Static Equilibrium
At static rest, the upward spring force balances downward gravitational weight:

$$\sum F_y = k y_{\text{eq}} - mg = 0 \implies y_{\text{eq}} = \frac{mg}{k}$$

### Equation of Motion About Unstretched Position ($y = 0$)
Let $y$ measure downward displacement from the *unstretched* spring tip:

$$m \ddot{y} = mg - k y$$

This is an inhomogeneous linear second-order differential equation.

### The Coordinate Origin Shift
Now perform a transformation of coordinates to measure displacement $y'$ relative to the **static equilibrium position**:

$$y' = y - y_{\text{eq}} \implies y = y_{\text{eq}} + y'$$

Differentiating with respect to time:

$$\dot{y} = \dot{y}', \qquad \ddot{y} = \ddot{y}'$$

Substitute into the equation of motion:

$$m \ddot{y}' = mg - k(y_{\text{eq}} + y') = mg - k y_{\text{eq}} - k y'$$

Since $k y_{\text{eq}} = mg$:

$$m \ddot{y}' = mg - mg - k y' = -k y'$$

$$m \ddot{y}' + k y' = 0 \implies \ddot{y}' + \omega_0^2 y' = 0, \quad \text{where } \omega_0 = \sqrt{\frac{k}{m}}$$

**The Principle of Gravity Invariance for Linear Oscillators:**
> *A uniform gravitational field does not alter the natural oscillation frequency $\omega_0 = \sqrt{k/m}$ or the dynamic harmonic behavior of a spring-mass system. Its sole physical effect is a static shift of the equilibrium center by $\Delta y = mg/k$.*

---

## 9.7 The Instantaneous State Paradox: Strings vs. Springs

A classic diagnostic problem in Newtonian dynamics tests the fundamental distinction between ideal rigid strings and elastic springs.

### The Setup
Two identical masses $m_A = m$ and $m_B = m$ hang vertically in series from the ceiling. Mass $A$ is suspended from the ceiling by Spring 1 (stiffness $k$). Mass $B$ is suspended from Mass $A$ by an ideal light cord (String 2).

```
                 Ceiling
                 =======
                    |
                   [k]  Spring 1 (Elongation x1)
                    |
                  [ m ] Mass A
                    |
                    |   String 2 (Tension T2)
                    |
                  [ m ] Mass B
```

### Static Initial State ($t < 0$)
1. **For Mass B:**
   $$\sum F_B = T_2 - mg = 0 \implies T_2 = mg$$
2. **For Mass A:**
   $$\sum F_A = F_{s1} - T_2 - mg = 0 \implies F_{s1} = T_2 + mg = mg + mg = 2mg$$
   The spring extension is:
   $$x_1 = \frac{2mg}{k}$$

### The Sudden Cut: String 2 is Severed at $t = 0$
What are the instantaneous accelerations $a_A(0^+)$ and $a_B(0^+)$ immediately after String 2 is severed?

#### 1. Analysis of Mass B
The string is cut. Tension $T_2$ vanishes instantly ($T_2 = 0$).
The only force acting on Mass B is gravity:
$$\sum F_B = -mg = m a_B \implies a_B = -g = 9.81\,\text{m/s}^2 \quad (\text{downward})$$
Mass B enters instantaneous free fall.

#### 2. Analysis of Mass A
What happens to Spring 1 at the instant $t = 0^+$?
An ideal spring requires physical displacement to change its force:
$$F_{s1}(t) = k x_1(t)$$
Because Mass A has finite mass $m$, its position cannot change instantaneously ($\Delta x \to 0$ as $\Delta t \to 0$).
Therefore, **at the instant immediately after the cut, the spring remains stretched by exactly $x_1 = 2mg/k$**:

$$F_{s1}(0^+) = k x_1(0^-) = 2mg \quad (\text{directed upward})$$

Now evaluate Newton's Second Law for Mass A at $t = 0^+$:
- Upward spring force: $+2mg$
- Downward gravity: $-mg$
- Cut string tension: $T_2 = 0$

$$\sum F_A(0^+) = F_{s1}(0^+) - mg = 2mg - mg = +mg$$

$$m a_A(0^+) = +mg \implies a_A(0^+) = +g = 9.81\,\text{m/s}^2 \quad (\text{upward}!)$$

**The Result:** At the very instant the string is cut, **Mass A accelerates upward with an acceleration of $+g$**!
While intuitive observers might assume Mass A remains stationary until the spring contracts, Newton’s Second Law dictates that the instantaneous net unbalanced force $+mg$ produces an immediate upward acceleration of $9.81\,\text{m/s}^2$.

---

## 9.8 Worked Numerical Examples (10 Progressive Scenarios)

---

### Example 9.1: Basic Spring Calibration and Potential Energy
**Problem:** A laboratory spring of unstretched length $L_0 = 0.250\,\text{m}$ hangs vertically. When a mass of $m = 1.500\,\text{kg}$ is attached, the spring reaches a new static equilibrium length of $L = 0.325\,\text{m}$. Take $g = 9.81\,\text{m/s}^2$.
1. Calculate the spring stiffness $k$.
2. Calculate the elastic potential energy stored in the spring at equilibrium.
3. If an additional $0.800\,\text{kg}$ mass is added, find the new total length.

**Solution:**
- **Step 1: Spring stiffness**
  Static extension:
  $$\Delta y = L - L_0 = 0.325\,\text{m} - 0.250\,\text{m} = 0.0750\,\text{m}$$
  Force balance:
  $$k \Delta y = mg \implies k = \frac{mg}{\Delta y} = \frac{(1.500\,\text{kg})(9.81\,\text{m/s}^2)}{0.0750\,\text{m}} = \frac{14.715\,\text{N}}{0.0750\,\text{m}} = 196.20\,\text{N/m}$$

- **Step 2: Elastic potential energy**
  $$U_s = \frac{1}{2} k (\Delta y)^2 = \frac{1}{2}(196.20\,\text{N/m})(0.0750\,\text{m})^2 = 0.5 \times 196.20 \times 0.005625 = 0.5518\,\text{J}$$

- **Step 3: New equilibrium with total mass $M = 1.500 + 0.800 = 2.300\,\text{kg}$**
  $$\Delta y_{\text{new}} = \frac{M g}{k} = \frac{(2.300\,\text{kg})(9.81\,\text{m/s}^2)}{196.20\,\text{N/m}} = \frac{22.563\,\text{N}}{196.20\,\text{N/m}} = 0.1150\,\text{m}$$
  $$L_{\text{new}} = L_0 + \Delta y_{\text{new}} = 0.250\,\text{m} + 0.1150\,\text{m} = 0.3650\,\text{m}$$

---

### Example 9.2: Parallel vs. Series Spring Configuration
**Problem:** Two springs have constants $k_1 = 300\,\text{N/m}$ and $k_2 = 600\,\text{N/m}$.
1. Compute the equivalent spring constant when connected in parallel.
2. Compute the equivalent spring constant when connected in series.
3. If a mass of $m = 10.0\,\text{kg}$ is suspended from each combination, calculate the static deflection in both cases ($g = 9.81\,\text{m/s}^2$).

**Solution:**
- **Step 1: Parallel combination**
  $$k_{\text{parallel}} = k_1 + k_2 = 300 + 600 = 900\,\text{N/m}$$

- **Step 2: Series combination**
  $$k_{\text{series}} = \frac{k_1 k_2}{k_1 + k_2} = \frac{(300)(600)}{300 + 600} = \frac{180,000}{900} = 200\,\text{N/m}$$

- **Step 3: Static deflections under $W = mg = (10.0)(9.81) = 98.1\,\text{N}$**
  - For parallel:
    $$\Delta y_{\text{parallel}} = \frac{W}{k_{\text{parallel}}} = \frac{98.1\,\text{N}}{900\,\text{N/m}} = 0.1090\,\text{m} = 10.90\,\text{cm}$$
  - For series:
    $$\Delta y_{\text{series}} = \frac{W}{k_{\text{series}}} = \frac{98.1\,\text{N}}{200\,\text{N/m}} = 0.4905\,\text{m} = 49.05\,\text{cm}$$
  *Notice:* The series combination deflects $4.5$ times farther than the parallel combination ($900 / 200 = 4.5$).

---

### Example 9.3: 2D Planar Vector Spring Force
**Problem:** In a physics engine, a spring with stiffness $k = 450\,\text{N/m}$ and unstretched length $L_0 = 1.200\,\text{m}$ is anchored at point $A = (0.500, 1.000)\,\text{m}$. A particle $B$ is currently positioned at $B = (2.100, 3.400)\,\text{m}$.
1. Compute the vector displacement $\vec{r}_{AB}$ and current spring length $L$.
2. Determine the unit direction vector $\hat{u}_{AB}$.
3. Calculate the scalar spring elongation $\Delta L$.
4. Compute the Cartesian vector force $\vec{F}_{s \to B} = (F_x, F_y)$ exerted on particle $B$.

**Solution:**
- **Step 1: Displacement vector and length**
  $$\Delta x = x_B - x_A = 2.100 - 0.500 = 1.600\,\text{m}$$
  $$\Delta y = y_B - y_A = 3.400 - 1.000 = 2.400\,\text{m}$$
  $$\vec{r}_{AB} = 1.600\,\hat{i} + 2.400\,\hat{j}\,\text{m}$$
  $$L = \|\vec{r}_{AB}\| = \sqrt{1.600^2 + 2.400^2} = \sqrt{2.560 + 5.760} = \sqrt{8.320} = 2.8844\,\text{m}$$

- **Step 2: Unit direction vector**
  $$\hat{u}_{AB} = \frac{1.600}{2.8844}\,\hat{i} + \frac{2.400}{2.8844}\,\hat{j} = 0.5547\,\hat{i} + 0.8321\,\hat{j}$$

- **Step 3: Spring elongation**
  $$\Delta L = L - L_0 = 2.8844\,\text{m} - 1.200\,\text{m} = +1.6844\,\text{m} \quad (\text{stretched})$$

- **Step 4: Vector force on particle $B$**
  Scalar force magnitude:
  $$F_s = k \Delta L = (450\,\text{N/m})(1.6844\,\text{m}) = 757.98\,\text{N}$$
  Because the spring is stretched, it pulls $B$ toward $A$ ($-\hat{u}_{AB}$):
  $$\vec{F}_{s \to B} = -F_s \hat{u}_{AB} = -(757.98\,\text{N})(0.5547\,\hat{i} + 0.8321\,\hat{j})$$
  $$F_x = -(757.98)(0.5547) = -420.45\,\text{N}$$
  $$F_y = -(757.98)(0.8321) = -630.72\,\text{N}$$
  $$\vec{F}_{s \to B} = -420.45\,\hat{i} - 630.72\,\hat{j}\,\text{N}$$

---

### Example 9.4: The Cut-String Instantaneous Acceleration Paradox
**Problem:** As described in Section 9.7, two masses $m_A = 4.00\,\text{kg}$ and $m_B = 6.00\,\text{kg}$ are suspended vertically. Mass $A$ is held by a spring with $k = 500\,\text{N/m}$ attached to the ceiling. Mass $B$ is suspended from Mass $A$ by a light string. Take $g = 9.81\,\text{m/s}^2$.
1. Find the initial static equilibrium spring extension $x_1$ and string tension $T$.
2. String 2 is suddenly cut. Find the instantaneous accelerations $a_A(0^+)$ and $a_B(0^+)$.
3. Now suppose instead that Spring 1 is severed (leaving String 2 intact). What are the instantaneous accelerations $a_A(0^+)$ and $a_B(0^+)$?

**Solution:**
- **Step 1: Initial static equilibrium**
  $$T = m_B g = (6.00\,\text{kg})(9.81\,\text{m/s}^2) = 58.86\,\text{N}$$
  $$F_{s1} = (m_A + m_B)g = (4.00 + 6.00\,\text{kg})(9.81\,\text{m/s}^2) = (10.00)(9.81) = 98.10\,\text{N}$$
  $$x_1 = \frac{F_{s1}}{k} = \frac{98.10\,\text{N}}{500\,\text{N/m}} = 0.1962\,\text{m}$$

- **Step 2: String 2 is cut**
  - For Mass B:
    $T$ drops to 0 instantly.
    $$a_B(0^+) = -g = -9.81\,\text{m/s}^2 \quad (\text{free fall downwards})$$
  - For Mass A:
    Spring length cannot change instantaneously, so $F_{s1}(0^+) = +98.10\,\text{N}$ (upward).
    Downward forces on A: only its own weight $m_A g = (4.00)(9.81) = 39.24\,\text{N}$.
    $$\sum F_A(0^+) = F_{s1}(0^+) - m_A g = 98.10 - 39.24 = +58.86\,\text{N} \quad (\text{upwards})$$
    $$a_A(0^+) = \frac{\sum F_A}{m_A} = \frac{+58.86\,\text{N}}{4.00\,\text{kg}} = +14.715\,\text{m/s}^2 \quad (\text{upward})$$
    Notice that $a_A = \frac{m_B}{m_A} g = \frac{6.00}{4.00}(9.81) = 1.5 g = 14.715\,\text{m/s}^2$!

- **Step 3: Spring 1 is severed instead**
  Spring force drops to zero. Both masses remain connected by the string.
  The total assembly of $(m_A + m_B)$ experiences only gravity:
  $$\sum F_{\text{total}} = -(m_A + m_B)g = (m_A + m_B) a \implies a = -g = -9.81\,\text{m/s}^2$$
  Both masses accelerate downward at $g = 9.81\,\text{m/s}^2$. The internal string tension immediately collapses to $T = 0$!

---

### Example 9.5: Horizontal Incline with Spring and Friction
**Problem:** A block of mass $m = 2.50\,\text{kg}$ rests on a rough ramp of angle $\theta = 25.0^\circ$ ($\sin 25^\circ \approx 0.4226, \cos 25^\circ \approx 0.9063$). A spring of stiffness $k = 180\,\text{N/m}$ parallel to the ramp connects the block to an anchor at the top of the ramp. The static coefficient of friction is $\mu_s = 0.350$. Take $g = 9.81\,\text{m/s}^2$.
Find the range of spring extensions $[x_{\min}, x_{\max}]$ for which the block can remain in static equilibrium without sliding.

**Solution:**
- **Step 1: Normal force and maximum static friction**
  $$N = mg\cos\theta = (2.50\,\text{kg})(9.81\,\text{m/s}^2)(0.90631) = 22.227\,\text{N}$$
  $$f_{s,\max} = \mu_s N = (0.350)(22.227\,\text{N}) = 7.780\,\text{N}$$
  Downslope gravity drive:
  $$F_{g\parallel} = mg\sin\theta = (2.50\,\text{kg})(9.81\,\text{m/s}^2)(0.42262) = 10.365\,\text{N}$$

- **Step 2: Regime 1 — Incipient downward slip (minimum spring extension $x_{\min}$)**
  The spring is not pulling hard enough; the block wants to slide *down* the ramp. Static friction points *up* the ramp ($+\hat{i}$):
  $$\sum F_{\parallel} = F_s + f_{s,\max} - F_{g\parallel} = 0$$
  $$k x_{\min} + 7.780 - 10.365 = 0 \implies k x_{\min} = 10.365 - 7.780 = 2.585\,\text{N}$$
  $$x_{\min} = \frac{2.585\,\text{N}}{180\,\text{N/m}} = 0.01436\,\text{m} = 1.44\,\text{cm}$$

- **Step 3: Regime 2 — Incipient upward slip (maximum spring extension $x_{\max}$)**
  The spring is pulled very tight; the block wants to slip *up* the ramp. Static friction points *down* the ramp ($-\hat{i}$):
  $$\sum F_{\parallel} = F_s - f_{s,\max} - F_{g\parallel} = 0$$
  $$k x_{\max} - 7.780 - 10.365 = 0 \implies k x_{\max} = 10.365 + 7.780 = 18.145\,\text{N}$$
  $$x_{\max} = \frac{18.145\,\text{N}}{180\,\text{N/m}} = 0.10081\,\text{m} = 10.08\,\text{cm}$$
  **Equilibrium Range:** $0.0144\,\text{m} \le x \le 0.1008\,\text{m}$.

---

### Example 9.6: Dynamic Spring Deceleration and Maximum Compression
**Problem:** A bumper car of mass $m = 400\,\text{kg}$ rolls on a frictionless track at speed $v_0 = 4.50\,\text{m/s}$ and strikes a horizontal buffer spring of constant $k = 16,000\,\text{N/m}$.
1. Calculate the maximum compression $x_{\max}$ of the spring.
2. Determine the maximum instantaneous deceleration experienced by the driver.
3. Compute the time interval $\Delta t$ from initial contact to maximum compression.

**Solution:**
- **Step 1: Maximum compression from energy conservation**
  Initial kinetic energy:
  $$K_0 = \frac{1}{2} m v_0^2 = \frac{1}{2}(400\,\text{kg})(4.50\,\text{m/s})^2 = 200 \times 20.25 = 4050\,\text{J}$$
  At maximum compression, all kinetic energy is converted into elastic potential energy:
  $$\frac{1}{2} k x_{\max}^2 = K_0 \implies x_{\max} = \sqrt{\frac{2 K_0}{k}} = \sqrt{\frac{2(4050)}{16,000}} = \sqrt{\frac{8100}{16,000}} = \sqrt{0.50625} = 0.7115\,\text{m}$$

- **Step 2: Maximum deceleration**
  Maximum force occurs at maximum compression:
  $$F_{\max} = k x_{\max} = (16,000\,\text{N/m})(0.7115\,\text{m}) = 11,384\,\text{N}$$
  $$a_{\max} = \frac{F_{\max}}{m} = \frac{11,384\,\text{N}}{400\,\text{kg}} = 28.46\,\text{m/s}^2 \approx 2.90\,g$$

- **Step 3: Time to maximum compression**
  The motion during contact is simple harmonic with quarter-period:
  $$\omega_0 = \sqrt{\frac{k}{m}} = \sqrt{\frac{16,000}{400}} = \sqrt{40} = 6.3246\,\text{rad/s}$$
  $$\Delta t = \frac{T}{4} = \frac{\pi / 2}{\omega_0} = \frac{1.5708}{6.3246} = 0.2484\,\text{s}$$

---

### Example 9.7: Cutting and Recombining Springs
**Problem:** A spring of resting length $L = 1.00\,\text{m}$ and stiffness $k = 240\,\text{N/m}$ is sliced into two segments with length ratio $1:3$ ($L_1 = 0.250\,\text{m}$, $L_2 = 0.750\,\text{m}$). The two cut segments are then connected in *parallel*.
1. Find the individual spring constants $k_1$ and $k_2$.
2. Calculate the equivalent spring constant $k_{\text{eq}}$ of the parallel assembly.
3. What is the ratio $k_{\text{eq}} / k$?

**Solution:**
- **Step 1: Individual spring constants**
  Using the Spring Cutting Theorem ($k_i L_i = k L$):
  $$k_1 = k \frac{L}{L_1} = (240\,\text{N/m}) \frac{1.00\,\text{m}}{0.250\,\text{m}} = 240 \times 4 = 960\,\text{N/m}$$
  $$k_2 = k \frac{L}{L_2} = (240\,\text{N/m}) \frac{1.00\,\text{m}}{0.750\,\text{m}} = 240 \times \frac{4}{3} = 320\,\text{N/m}$$

- **Step 2: Equivalent parallel constant**
  $$k_{\text{eq}} = k_1 + k_2 = 960 + 320 = 1280\,\text{N/m}$$

- **Step 3: Ratio to original stiffness**
  $$\frac{k_{\text{eq}}}{k} = \frac{1280\,\text{N/m}}{240\,\text{N/m}} = \frac{16}{3} \approx 5.333$$
  The cut-and-parallel reconfiguration increases the spring stiffness by over $533\%$!

---

### Example 9.8: Coupled Two-Body Mass-Spring System
**Problem:** Two blocks $m_1 = 2.00\,\text{kg}$ and $m_2 = 3.00\,\text{kg}$ rest on a frictionless horizontal table, connected by a spring of stiffness $k = 150\,\text{N/m}$. The blocks are pulled apart such that the spring is stretched by $x_0 = 0.200\,\text{m}$, and then released simultaneously from rest.
1. Determine the instantaneous accelerations $a_1(0)$ and $a_2(0)$ at the moment of release.
2. Determine the acceleration of the center of mass $a_{\text{CM}}$.
3. Compute the effective reduced mass $\mu$ and the natural frequency of oscillation $\omega$.

**Solution:**
- **Step 1: Instantaneous accelerations at release**
  Spring force magnitude:
  $$F_s = k x_0 = (150\,\text{N/m})(0.200\,\text{m}) = 30.0\,\text{N}$$
  By Newton's Third Law:
  - On $m_1$ (pulled to the right):
    $$a_1 = +\frac{F_s}{m_1} = \frac{+30.0\,\text{N}}{2.00\,\text{kg}} = +15.0\,\text{m/s}^2$$
  - On $m_2$ (pulled to the left):
    $$a_2 = -\frac{F_s}{m_2} = \frac{-30.0\,\text{N}}{3.00\,\text{kg}} = -10.0\,\text{m/s}^2$$

- **Step 2: Acceleration of Center of Mass**
  $$a_{\text{CM}} = \frac{m_1 a_1 + m_2 a_2}{m_1 + m_2} = \frac{(2.00)(+15.0) + (3.00)(-10.0)}{2.00 + 3.00} = \frac{30.0 - 30.0}{5.00} = 0\,\text{m/s}^2$$
  Because the spring force is purely internal, the center of mass remains permanently at rest!

- **Step 3: Reduced mass and oscillation frequency**
  $$\mu = \frac{m_1 m_2}{m_1 + m_2} = \frac{(2.00)(3.00)}{2.00 + 3.00} = \frac{6.00}{5.00} = 1.200\,\text{kg}$$
  $$\omega = \sqrt{\frac{k}{\mu}} = \sqrt{\frac{150\,\text{N/m}}{1.200\,\text{kg}}} = \sqrt{125} = 11.18\,\text{rad/s}$$

---

### Example 9.9: Non-Linear Hardening Spring (Duffing Model)
**Problem:** A non-linear vehicle suspension spring obeys the cubic Duffing force law:
$$F_s(x) = -k x - \beta x^3$$
with linear stiffness $k = 25,000\,\text{N/m}$ and hardening coefficient $\beta = 400,000\,\text{N/m}^3$.
1. Compute the restoring force at compressions $x_1 = 0.050\,\text{m}$ and $x_2 = 0.150\,\text{m}$.
2. Compare the non-linear force at $x_2$ to the prediction of an ideal linear spring ($\beta = 0$).
3. Derive the expression for the stored potential energy $U(x)$ and compute $U(x_2)$.

**Solution:**
- **Step 1: Restoring force calculation**
  - At $x_1 = 0.050\,\text{m}$:
    $$F_{\text{linear}} = -k x_1 = -(25,000)(0.050) = -1250\,\text{N}$$
    $$F_{\text{cubic}} = -\beta x_1^3 = -(400,000)(0.050)^3 = -(400,000)(0.000125) = -50\,\text{N}$$
    $$F_s(x_1) = -1250 - 50 = -1300\,\text{N}$$
  - At $x_2 = 0.150\,\text{m}$:
    $$F_{\text{linear}} = -(25,000)(0.150) = -3750\,\text{N}$$
    $$F_{\text{cubic}} = -(400,000)(0.150)^3 = -(400,000)(0.003375) = -1350\,\text{N}$$
    $$F_s(x_2) = -3750 - 1350 = -5100\,\text{N}$$

- **Step 2: Comparison with linear model**
  $$\text{Discrepancy} = \frac{5100 - 3750}{3750} \times 100\% = \frac{1350}{3750} \times 100\% = 36.0\%$$
  The hardening effect stiffens the spring by $36\%$ at large deflections, preventing vehicle bottoming-out!

- **Step 3: Stored potential energy**
  $$U(x) = -\int_0^x F_s(x') \, dx' = \int_0^x (k x' + \beta x'^3) \, dx' = \frac{1}{2} k x^2 + \frac{1}{4} \beta x^4$$
  At $x_2 = 0.150\,\text{m}$:
  $$\frac{1}{2}(25,000)(0.150)^2 = 12,500 \times 0.0225 = 281.25\,\text{J}$$
  $$\frac{1}{4}(400,000)(0.150)^4 = 100,000 \times 0.00050625 = 50.625\,\text{J}$$
  $$U(x_2) = 281.25 + 50.625 = 331.875\,\text{J}$$

---

### Example 9.10: Self-Weight Sag of a Heavy Vertical Spring
**Problem:** A heavy steel spring of total mass $m_s = 0.800\,\text{kg}$, unstretched length $L_0 = 1.50\,\text{m}$, and stiffness $k = 40.0\,\text{N/m}$ hangs vertically under its own weight with no mass attached at the bottom. Take $g = 9.81\,\text{m/s}^2$.
1. Derive the formula for the total elongation $\Delta L$ due to its own distributed weight.
2. Calculate the numerical elongation $\Delta L$.
3. Compare this to the elongation produced if the entire mass $m_s$ were concentrated at the bottom tip.

**Solution:**
- **Step 1: Derivation of continuous elongation**
  Let $y$ measure coordinate along the spring from the top anchor ($y = 0$) to the bottom tip ($y = L_0$).
  Let $\lambda_0 = m_s / L_0$ be the linear mass density.
  At position $y$, the spring segment supports only the weight of the spring hanging *below* it, which has length $L_0 - y$:
  $$T(y) = \left[\lambda_0 (L_0 - y)\right] g = \frac{m_s g}{L_0} (L_0 - y)$$
  Consider a differential element $dy$. Its local stiffness is $dk = k \frac{L_0}{dy}$.
  The local extension $d(\Delta L)$ of this element is:
  $$d(\Delta L) = \frac{T(y)}{dk} = \frac{\frac{m_s g}{L_0}(L_0 - y)}{k \frac{L_0}{dy}} = \frac{m_s g}{k L_0^2} (L_0 - y) \, dy$$
  Integrate over the entire length from $y = 0$ to $y = L_0$:
  $$\Delta L = \int_0^{L_0} \frac{m_s g}{k L_0^2} (L_0 - y) \, dy = \frac{m_s g}{k L_0^2} \left[ L_0 y - \frac{1}{2} y^2 \right]_0^{L_0} = \frac{m_s g}{k L_0^2} \left( L_0^2 - \frac{1}{2} L_0^2 \right) = \frac{m_s g}{2 k}$$

- **Step 2: Numerical evaluation**
  $$\Delta L = \frac{m_s g}{2k} = \frac{(0.800\,\text{kg})(9.81\,\text{m/s}^2)}{2(40.0\,\text{N/m})} = \frac{7.848\,\text{N}}{80.0\,\text{N/m}} = 0.0981\,\text{m} = 9.81\,\text{cm}$$

- **Step 3: Comparison with tip mass**
  If mass $m_s$ were concentrated at the bottom tip:
  $$\Delta L_{\text{tip}} = \frac{m_s g}{k} = \frac{7.848\,\text{N}}{40.0\,\text{N/m}} = 0.1962\,\text{m} = 19.62\,\text{cm}$$
  $$\frac{\Delta L_{\text{self}}}{\Delta L_{\text{tip}}} = \frac{1}{2}$$
  **Theorem:** A uniform heavy spring hanging under its own weight sags by **exactly half** as much as it would if its entire mass were hung from its bottom tip!

---

## 9.9 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 9.10.

### Tier 1: Foundational Elasticity
- **Exercise 9.1:** A spring stretches by $4.50\,\text{cm}$ when a $1.20\,\text{kg}$ mass is hung vertically. Compute its spring constant $k$ and the work done on the spring during this extension ($g = 9.81\,\text{m/s}^2$).
- **Exercise 9.2:** Three identical springs, each of constant $k = 150\,\text{N/m}$, are connected in parallel. What is the equivalent stiffness? What would the equivalent stiffness be if all three were connected in series?

### Tier 2: Networks & Incline Assemblies
- **Exercise 9.3:** A block of mass $m = 3.50\,\text{kg}$ is held between two horizontal springs on a frictionless surface: Spring 1 ($k_1 = 200\,\text{N/m}$) on the left anchored to a wall, and Spring 2 ($k_2 = 400\,\text{N/m}$) on the right anchored to an opposite wall. When the block is displaced $0.050\,\text{m}$ to the right, what is the net restoring force?
- **Exercise 9.4:** A $5.00\,\text{kg}$ block on a frictionless $30.0^\circ$ incline is attached to a spring ($k = 250\,\text{N/m}$) running parallel to the incline to the top anchor. Find the equilibrium stretch of the spring.

### Tier 3: Instantaneous State Paradoxes
- **Exercise 9.5:** In a vertical stack, a ceiling supports Spring 1 ($k_1 = 300\,\text{N/m}$), which holds Mass $A = 2.00\,\text{kg}$. Below Mass $A$, Spring 2 ($k_2 = 150\,\text{N/m}$) holds Mass $B = 3.00\,\text{kg}$. Find the static stretch of both springs. If Spring 2 is suddenly cut, find the instantaneous acceleration of Mass $A$.
- **Exercise 9.6:** A vertical spring of constant $k = 800\,\text{N/m}$ is compressed by $0.150\,\text{m}$. A ball of mass $m = 0.250\,\text{kg}$ is placed on top (not attached). When released, calculate the maximum height $h_{\max}$ the ball reaches above the initial compressed point.

### Tier 4: Energy Dissipation & 2D Geometry
- **Exercise 9.7:** A $2.00\,\text{kg}$ block moving at $3.00\,\text{m/s}$ on a rough horizontal floor ($\mu_k = 0.250$) hits an uncompressed spring with $k = 400\,\text{N/m}$. Find the maximum compression $x_{\max}$ of the spring before the block momentarily stops.
- **Exercise 9.8:** A 2D particle of mass $m = 1.00\,\text{kg}$ is attached to a spring ($k = 100\,\text{N/m}$, $L_0 = 1.00\,\text{m}$) anchored at the origin $(0, 0)$. At $t = 0$, the particle is at $(1.50, 2.00)\,\text{m}$ with zero velocity. Compute the magnitude and direction of its initial acceleration vector.

### Tier 5: Non-Linearity & Continuum Systems
- **Exercise 9.9:** A softening spring obeys $F_s = -k x + \beta x^3$ with $k = 1000\,\text{N/m}$ and $\beta = 4000\,\text{N/m}^3$. Determine the critical displacement $x_{\text{crit}}$ at which the restoring force peaks, and find the maximum restoring force.
- **Exercise 9.10:** A heavy uniform spring of mass $m_s = 0.600\,\text{kg}$, unstretched length $L_0 = 1.20\,\text{m}$, and stiffness $k = 50.0\,\text{N/m}$ hangs vertically, carrying a concentrated load $M = 2.00\,\text{kg}$ at its bottom tip. Calculate the total elongation of the spring ($g = 9.81\,\text{m/s}^2$).

---

## 9.10 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 9.1
- **Given:** $\Delta y = 0.0450\,\text{m}$, $m = 1.20\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Spring stiffness**
  $$k = \frac{mg}{\Delta y} = \frac{(1.20\,\text{kg})(9.81\,\text{m/s}^2)}{0.0450\,\text{m}} = \frac{11.772\,\text{N}}{0.0450\,\text{m}} = 261.60\,\text{N/m}$$
- **Step 2: Work done / Elastic energy**
  $$W = \frac{1}{2} k (\Delta y)^2 = \frac{1}{2}(261.60\,\text{N/m})(0.0450\,\text{m})^2 = 0.5 \times 261.60 \times 0.002025 = 0.2649\,\text{J}$$

---

### Solution 9.2
- **Given:** Three springs with $k = 150\,\text{N/m}$.
- **Step 1: Parallel combination**
  $$k_{\text{parallel}} = k + k + k = 3k = 3(150\,\text{N/m}) = 450\,\text{N/m}$$
- **Step 2: Series combination**
  $$\frac{1}{k_{\text{series}}} = \frac{1}{k} + \frac{1}{k} + \frac{1}{k} = \frac{3}{k} \implies k_{\text{series}} = \frac{k}{3} = \frac{150\,\text{N/m}}{3} = 50.0\,\text{N/m}$$

---

### Solution 9.3
- **Given:** $m = 3.50\,\text{kg}$, $k_1 = 200\,\text{N/m}$ (left), $k_2 = 400\,\text{N/m}$ (right), displaced $x = +0.050\,\text{m}$ (rightward).
- **Step 1: Force analysis**
  - Left spring is stretched by $+x$: exerts leftward force $F_1 = -k_1 x = -(200)(0.050) = -10.0\,\text{N}$.
  - Right spring is compressed by $x$: pushes leftward with force $F_2 = -k_2 x = -(400)(0.050) = -20.0\,\text{N}$.
- **Step 2: Total restoring force**
  $$F_{\text{net}} = F_1 + F_2 = -10.0 - 20.0 = -30.0\,\text{N} \quad (\text{leftward})$$
  *Notice:* Two opposing springs acting on a central mass behave dynamically as a **parallel** system with $k_{\text{eq}} = k_1 + k_2 = 600\,\text{N/m}$, so $F_{\text{net}} = -(600)(0.050) = -30.0\,\text{N}$!

---

### Solution 9.4
- **Given:** $m = 5.00\,\text{kg}$, $\theta = 30.0^\circ$, $k = 250\,\text{N/m}$, frictionless incline, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Downslope gravity component**
  $$F_{g\parallel} = mg\sin(30.0^\circ) = (5.00\,\text{kg})(9.81\,\text{m/s}^2)(0.500) = 24.525\,\text{N}$$
- **Step 2: Spring stretch**
  $$k x = F_{g\parallel} \implies x = \frac{F_{g\parallel}}{k} = \frac{24.525\,\text{N}}{250\,\text{N/m}} = 0.0981\,\text{m} = 9.81\,\text{cm}$$

---

### Solution 9.5
- **Given:** $k_1 = 300\,\text{N/m}$, $m_A = 2.00\,\text{kg}$, $k_2 = 150\,\text{N/m}$, $m_B = 3.00\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Static stretches**
  - Spring 2 supports only $m_B$:
    $$F_{s2} = m_B g = (3.00)(9.81) = 29.43\,\text{N} \implies x_2 = \frac{29.43}{150} = 0.1962\,\text{m}$$
  - Spring 1 supports both masses:
    $$F_{s1} = (m_A + m_B)g = (5.00)(9.81) = 49.05\,\text{N} \implies x_1 = \frac{49.05}{300} = 0.1635\,\text{m}$$
- **Step 2: Spring 2 is severed**
  Spring 2 tension drops to zero immediately.
  Spring 1 cannot change length instantaneously, so $F_{s1}(0^+) = +49.05\,\text{N}$ (upward).
  Forces on Mass A at $t = 0^+$:
  $$\sum F_A = F_{s1}(0^+) - m_A g = 49.05 - (2.00)(9.81) = 49.05 - 19.62 = +29.43\,\text{N} \quad (\text{upward})$$
  $$a_A(0^+) = \frac{+29.43\,\text{N}}{2.00\,\text{kg}} = +14.715\,\text{m/s}^2 \quad (\text{upward})$$

---

### Solution 9.6
- **Given:** $k = 800\,\text{N/m}$, compression $x_0 = 0.150\,\text{m}$, $m = 0.250\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Energy conservation**
  Let the initial compressed position be the reference height $y = 0$.
  Initial energy: purely elastic potential energy:
  $$E_{\text{init}} = \frac{1}{2} k x_0^2 = \frac{1}{2}(800\,\text{N/m})(0.150\,\text{m})^2 = 400 \times 0.0225 = 9.00\,\text{J}$$
- **Step 2: Maximum height $h_{\max}$**
  At peak height $h_{\max}$, kinetic energy is zero, and the spring is unstretched:
  $$E_{\text{final}} = m g h_{\max} = 9.00\,\text{J}$$
  $$h_{\max} = \frac{9.00\,\text{J}}{m g} = \frac{9.00\,\text{J}}{(0.250\,\text{kg})(9.81\,\text{m/s}^2)} = \frac{9.00}{2.4525} = 3.6697\,\text{m}$$
  The ball ascends $3.67\,\text{m}$ above the release point.

---

### Solution 9.7
- **Given:** $m = 2.00\,\text{kg}$, $v_0 = 3.00\,\text{m/s}$, $\mu_k = 0.250$, $k = 400\,\text{N/m}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Work-Energy balance**
  Initial kinetic energy:
  $$K_0 = \frac{1}{2} m v_0^2 = \frac{1}{2}(2.00)(3.00)^2 = 9.00\,\text{J}$$
  As the spring compresses by distance $x$, friction does work over distance $x$:
  $$W_{\text{fric}} = -f_k x = -(\mu_k m g) x = -(0.250)(2.00)(9.81) x = -4.905 x\,\text{J}$$
  Final state: $K_f = 0$, $U_s = \frac{1}{2} k x^2 = 200 x^2$.
  $$K_0 + W_{\text{fric}} = U_s \implies 9.00 - 4.905 x = 200 x^2$$
  $$200 x^2 + 4.905 x - 9.00 = 0$$
- **Step 2: Solve quadratic equation**
  $$x = \frac{-4.905 + \sqrt{4.905^2 - 4(200)(-9.00)}}{2(200)} = \frac{-4.905 + \sqrt{24.059 + 7200}}{400} = \frac{-4.905 + \sqrt{7224.06}}{400}$$
  $$\sqrt{7224.06} = 84.994$$
  $$x = \frac{-4.905 + 84.994}{400} = \frac{80.089}{400} = 0.2002\,\text{m}$$
  The maximum spring compression is $20.0\,\text{cm}$.

---

### Solution 9.8
- **Given:** $m = 1.00\,\text{kg}$, anchor at $(0, 0)$, $k = 100\,\text{N/m}$, $L_0 = 1.00\,\text{m}$, particle at $(1.50, 2.00)\,\text{m}$.
- **Step 1: Geometry**
  $$L = \sqrt{1.50^2 + 2.00^2} = \sqrt{2.25 + 4.00} = \sqrt{6.25} = 2.50\,\text{m}$$
  $$\Delta L = L - L_0 = 2.50 - 1.00 = 1.50\,\text{m}$$
  Unit vector pointing toward origin (restoring):
  $$\hat{u}_{\text{origin}} = -\frac{1.50}{2.50}\,\hat{i} - \frac{2.00}{2.50}\,\hat{j} = -0.600\,\hat{i} - 0.800\,\hat{j}$$
- **Step 2: Force and acceleration**
  $$F_s = k \Delta L = (100\,\text{N/m})(1.50\,\text{m}) = 150\,\text{N}$$
  $$\vec{F}_s = 150(-0.600\,\hat{i} - 0.800\,\hat{j}) = -90.0\,\hat{i} - 120.0\,\hat{j}\,\text{N}$$
  $$\vec{a} = \frac{\vec{F}_s}{m} = -90.0\,\hat{i} - 120.0\,\hat{j}\,\text{m/s}^2$$
  Magnitude:
  $$\|\vec{a}\| = \sqrt{(-90.0)^2 + (-120.0)^2} = 150\,\text{m/s}^2$$
  Direction: directly toward the origin at angle $\theta = 180^\circ + \arctan(2.00/1.50) = 233.13^\circ$.

---

### Solution 9.9
- **Given:** Softening spring $F_s(x) = k x - \beta x^3$ (magnitude of restoring force), with $k = 1000\,\text{N/m}$, $\beta = 4000\,\text{N/m}^3$.
- **Step 1: Find critical displacement where force is maximized**
  $$\frac{d F_s}{dx} = k - 3\beta x^2 = 0 \implies x_{\text{crit}}^2 = \frac{k}{3\beta}$$
  $$x_{\text{crit}} = \sqrt{\frac{1000}{3(4000)}} = \sqrt{\frac{1000}{12,000}} = \sqrt{\frac{1}{12}} = \frac{1}{3.4641} = 0.2887\,\text{m}$$
- **Step 2: Maximum restoring force**
  $$F_{s,\max} = k x_{\text{crit}} - \beta x_{\text{crit}}^3 = x_{\text{crit}}(k - \beta x_{\text{crit}}^2) = (0.2887)\left(1000 - 4000 \times \frac{1}{12}\right)$$
  $$F_{s,\max} = (0.2887)(1000 - 333.33) = (0.2887)(666.67) = 192.45\,\text{N}$$

---

### Solution 9.10
- **Given:** Heavy spring $m_s = 0.600\,\text{kg}$, $L_0 = 1.20\,\text{m}$, $k = 50.0\,\text{N/m}$, tip load $M = 2.00\,\text{kg}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Superposition of extensions**
  By linear elasticity (Hooke's Law), the total elongation is the sum of:
  1. Elongation due to its own distributed weight:
     $$\Delta L_{\text{self}} = \frac{m_s g}{2k}$$
  2. Elongation due to the tip load $M$:
     $$\Delta L_{\text{tip}} = \frac{M g}{k}$$
- **Step 2: Total elongation**
  $$\Delta L_{\text{total}} = \frac{(M + \frac{1}{2} m_s)g}{k}$$
  Effective suspended mass:
  $$M_{\text{eff}} = M + \frac{1}{2} m_s = 2.00\,\text{kg} + \frac{1}{2}(0.600\,\text{kg}) = 2.00 + 0.300 = 2.300\,\text{kg}$$
  Numerical calculation:
  $$\Delta L_{\text{total}} = \frac{(2.300\,\text{kg})(9.81\,\text{m/s}^2)}{50.0\,\text{N/m}} = \frac{22.563\,\text{N}}{50.0\,\text{N/m}} = 0.4513\,\text{m} = 45.13\,\text{cm}$$
