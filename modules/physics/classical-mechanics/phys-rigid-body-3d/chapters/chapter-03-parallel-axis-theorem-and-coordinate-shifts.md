# Chapter 3: The Parallel Axis Theorem (Steiner's Theorem) and Coordinate Shifts

> *"A body's inertia about its own center of mass is the irreducible minimum bestowed upon it by nature. The moment you shift your perspective to an offset pivot or hinge, the geometry of space levies a distance penalty proportional to the square of your displacement."*

---

## 3.1 Shifting the Pivot Point: From Center of Mass to Real-World Hinges

In Chapter 2, we derived the fundamental Inertia Tensor $\mathbf{I}_{\text{cm}}$ of a rigid body about its Center of Mass. For an unconstrained object tumbling freely through the vacuum of space—such as an interstellar asteroid, an orbiting space station, or a gymnast mid-somersault—the Center of Mass is the natural, privileged reference point.

However, in terrestrial engineering, mechanical robotics, and structural dynamics, physical bodies are rarely free to tumble about their Center of Mass:
- A heavy bank vault door rotates about fixed mechanical hinge pins mounted along its edge.
- A robotic arm link pivots about a motor actuator joint located at its extremity.
- A car wheel rotates about an axle spindle.
- A grandfather clock pendulum swings from a suspension knife-edge high above its bob.

When an object is constrained to rotate about an offset pivot point $P$ displaced from its Center of Mass by a spatial vector $\mathbf{d}$, its resistance to rotation changes drastically. 

To compute the new Inertia Tensor $\mathbf{I}_P$ from scratch by recalculating the 3D volume integrals would be computationally agonizing. Fortunately, in 1840, the Swiss geometer Jakob Steiner proved a universal mathematical shortcut: **The Parallel Axis Theorem** (often called **Steiner's Theorem**).

```
                 Steiner's Spatial Coordinate Shift
                 
            Pivot P (New Origin)
                 ● ─────────────────────────────────► d (Displacement Vector)
                /                                   \
               /                                     ▼
              /                              Center of Mass (COM)
             /                                      ●  (I_cm is minimum)
            /                                     .---.
           /                                     /     \
          /                                     |       |
         /                                       \     /
        /                                         '---'
       Z
```

---

## 3.2 Vectorial and Tensor Derivation of Steiner's Theorem

Let $\mathbf{R}_{\text{cm}}$ be the position of the Center of Mass in an inertial frame. Let $P$ be a new reference point with position vector $\mathbf{R}_P$.

Define the displacement vector $\mathbf{d}$ pointing from the pivot $P$ to the Center of Mass:

$$\mathbf{d} = \mathbf{R}_{\text{cm}} - \mathbf{R}_P$$

For any infinitesimal mass element $dm$ in the body:
- Let $\mathbf{r}'$ be its position vector relative to the Center of Mass: $\mathbf{r}' = \mathbf{r} - \mathbf{R}_{\text{cm}}$.
- Let $\mathbf{r}_P$ be its position vector relative to the new pivot $P$: $\mathbf{r}_P = \mathbf{r} - \mathbf{R}_P$.

By vector triangle addition:

$$\mathbf{r}_P = \mathbf{r}' + \mathbf{d}$$

### Deriving the Inertia Tensor About Pivot $P$
Recall the index notation formula for the Inertia Tensor derived in Section 2.4:

$$I_{jk}^{(P)} = \int \Big( \|\mathbf{r}_P\|^2 \delta_{jk} - x_{P,j} x_{P,k} \Big) dm$$

Substitute $\mathbf{r}_P = \mathbf{r}' + \mathbf{d}$:

$$\|\mathbf{r}_P\|^2 = (\mathbf{r}' + \mathbf{d}) \cdot (\mathbf{r}' + \mathbf{d}) = \|\mathbf{r}'\|^2 + 2\mathbf{r}' \cdot \mathbf{d} + \|\mathbf{d}\|^2$$
$$x_{P,j} x_{P,k} = (x_j' + d_j)(x_k' + d_k) = x_j' x_k' + x_j' d_k + d_j x_k' + d_j d_k$$

Now substitute both expansions into the integral:

$$\begin{aligned}
I_{jk}^{(P)} &= \int \Big( [\|\mathbf{r}'\|^2 + 2\mathbf{r}' \cdot \mathbf{d} + \|\mathbf{d}\|^2]\delta_{jk} - [x_j' x_k' + x_j' d_k + d_j x_k' + d_j d_k] \Big) dm \\
&= \int \Big( \|\mathbf{r}'\|^2 \delta_{jk} - x_j' x_k' \Big) dm \\
&\quad + \int \Big( 2(\mathbf{r}' \cdot \mathbf{d})\delta_{jk} - x_j' d_k - d_j x_k' \Big) dm \\
&\quad + \int \Big( \|\mathbf{d}\|^2 \delta_{jk} - d_j d_k \Big) dm
\end{aligned}$$

### The Miracle of the Center of Mass
Look closely at the middle integral: every term in it contains the relative coordinate $\mathbf{r}'$ to the first power:

$$\int \mathbf{r}' dm = \int (\mathbf{r} - \mathbf{R}_{\text{cm}}) dm = \int \mathbf{r} \, dm - \mathbf{R}_{\text{cm}}\int dm = M\mathbf{R}_{\text{cm}} - M\mathbf{R}_{\text{cm}} \equiv \mathbf{0}$$

Because the origin of $\mathbf{r}'$ is the Center of Mass, **the first moment of mass $\int \mathbf{r}' dm$ vanishes identically!**
Therefore:
$$\int x_j' dm = 0, \quad \int x_k' dm = 0, \quad \int (\mathbf{r}' \cdot \mathbf{d}) dm = \left(\int \mathbf{r}' dm\right) \cdot \mathbf{d} = \mathbf{0} \cdot \mathbf{d} = 0$$

The entire middle integral collapses to zero!

We are left with two remaining terms:
1. The first integral is, by definition, the Inertia Tensor about the Center of Mass:
   $$\int \Big( \|\mathbf{r}'\|^2 \delta_{jk} - x_j' x_k' \Big) dm = I_{jk}^{(\text{cm})}$$
2. In the third integral, the vector $\mathbf{d}$ is constant with respect to the mass integration, so it factors outside:
   $$\int \Big( \|\mathbf{d}\|^2 \delta_{jk} - d_j d_k \Big) dm = \Big( \|\mathbf{d}\|^2 \delta_{jk} - d_j d_k \Big) \int dm = M \Big( \|\mathbf{d}\|^2 \delta_{jk} - d_j d_k \Big)$$

This delivers the complete, coordinate-free **3D Parallel Axis Theorem in Tensor Form**:

$$\mathbf{I}_P = \mathbf{I}_{\text{cm}} + M \Big( \|\mathbf{d}\|^2 \mathbf{I}_3 - \mathbf{d} \otimes \mathbf{d} \Big)$$

where $\mathbf{I}_3$ is the $3 \times 3$ identity matrix, and $\mathbf{d} \otimes \mathbf{d} = \mathbf{d} \mathbf{d}^T$ is the outer product of the displacement vector with itself.

---

## 3.3 Explicit Coordinate Shifts in Matrix Form

Writing Steiner's Theorem out in explicit matrix components clarifies its computational simplicity. Let the displacement vector from pivot $P$ to the Center of Mass be:

$$\mathbf{d} = \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix}, \quad \|\mathbf{d}\|^2 = d^2 = d_x^2 + d_y^2 + d_z^2$$

The displacement tensor $\Delta \mathbf{I} = M (d^2 \mathbf{I}_3 - \mathbf{d}\mathbf{d}^T)$ expands as:

$$\Delta \mathbf{I} = M \begin{bmatrix}
d^2 - d_x^2 & -d_x d_y & -d_x d_z \\
-d_y d_x & d^2 - d_y^2 & -d_y d_z \\
-d_z d_x & -d_z d_y & d^2 - d_z^2
\end{bmatrix} = M \begin{bmatrix}
d_y^2 + d_z^2 & -d_x d_y & -d_x d_z \\
-d_y d_x & d_x^2 + d_z^2 & -d_y d_z \\
-d_z d_x & -d_z d_y & d_x^2 + d_y^2
\end{bmatrix}$$

Adding this to the Center-of-Mass Inertia Tensor yields the 6 independent components:

### Diagonal Elements (Moments of Inertia):
$$I_{xx}^{(P)} = I_{xx}^{(\text{cm})} + M(d_y^2 + d_z^2)$$
$$I_{yy}^{(P)} = I_{yy}^{(\text{cm})} + M(d_x^2 + d_z^2)$$
$$I_{zz}^{(P)} = I_{zz}^{(\text{cm})} + M(d_x^2 + d_y^2)$$

### Off-Diagonal Elements (Products of Inertia):
$$I_{xy}^{(P)} = I_{xy}^{(\text{cm})} - M d_x d_y$$
$$I_{xz}^{(P)} = I_{xz}^{(\text{cm})} - M d_x d_z$$
$$I_{yz}^{(P)} = I_{yz}^{(\text{cm})} - M d_y d_z$$

### Critical Engineering Insights:
1. **The Minimum Inertia Principle:** Notice that the shift terms for the diagonal elements ($M(d_y^2 + d_z^2)$, etc.) are **always strictly positive** for any non-zero displacement. Therefore:
   $$I_{xx}^{(P)} \ge I_{xx}^{(\text{cm})}, \quad I_{yy}^{(P)} \ge I_{yy}^{(\text{cm})}, \quad I_{zz}^{(P)} \ge I_{zz}^{(\text{cm})}$$
   The moment of inertia of a rigid body is at an **absolute global minimum** when evaluated about an axis passing through its Center of Mass! Moving the rotation axis away from the COM *always* increases rotational inertia.
2. **Products of Inertia Generation:** Even if the Center-of-Mass tensor is strictly diagonal ($I_{xy}^{(\text{cm})} = 0$), shifting the origin to a point where both $d_x \ne 0$ and $d_y \ne 0$ introduces **non-zero off-diagonal products of inertia** ($-M d_x d_y$). Shifting coordinate frames can turn a dynamically balanced body into an unbalanced one.
3. **Reversibility Warning (The Center of Mass Hub Rule):** Steiner's Theorem only works when shifting **to or from the Center of Mass**. You cannot shift directly between two arbitrary points $P_1$ and $P_2$ without routing through the Center of Mass:
   $$\mathbf{I}_{P_2} = \mathbf{I}_{P_1} - M(d_1^2 \mathbf{I} - \mathbf{d}_1\mathbf{d}_1^T) + M(d_2^2 \mathbf{I} - \mathbf{d}_2\mathbf{d}_2^T)$$

---

## 3.4 Compound Physical Pendulums and Offset Pivot Dynamics

A quintessential application of Steiner's Theorem is the **Compound Physical Pendulum**: a rigid body of mass $M$ free to oscillate in a vertical plane about a horizontal frictionless pivot pin $P$ located at distance $d$ from its Center of Mass.

```
                    Pivot Pin P
                         ●
                         │\  θ
                         │ \
                         │  \ d (Distance to COM)
                         │   ▼
                         │    ● Center of Mass (COM)
                         │   / \
                         │  | M |
                         │   \ /
                         │    '
                     Equilibrium
```

### Equation of Motion
The restoring torque about the pivot axis $P$ is produced by gravity acting at the Center of Mass:

$$\tau_P = - M g d \sin\theta$$

Applying Newton's Second Law for rotation about a fixed pivot $P$:

$$\tau_P = I_P \ddot{\theta} \implies I_P \ddot{\theta} + M g d \sin\theta = 0$$

For small angular oscillations ($\sin\theta \approx \theta$):

$$\ddot{\theta} + \left( \frac{M g d}{I_P} \right)\theta = 0$$

This is the standard equation of Simple Harmonic Motion: $\ddot{\theta} + \omega_0^2 \theta = 0$, with natural frequency:

$$\omega_0 = \sqrt{\frac{M g d}{I_P}}$$

Applying Steiner's Theorem: $I_P = I_{\text{cm}} + M d^2$:

$$\omega_0 = \sqrt{\frac{M g d}{I_{\text{cm}} + M d^2}} = \sqrt{\frac{g d}{\frac{I_{\text{cm}}}{M} + d^2}} = \sqrt{\frac{g d}{k_{\text{cm}}^2 + d^2}}$$

where $k_{\text{cm}} = \sqrt{I_{\text{cm}}/M}$ is the **Radius of Gyration** of the body about its Center of Mass.

The period of small oscillations is:

$$T = 2\pi \sqrt{\frac{I_P}{M g d}} = 2\pi \sqrt{\frac{k_{\text{cm}}^2 + d^2}{g d}}$$

---

## 3.5 The Center of Percussion (The "Sweet Spot")

When a baseball strikes a bat, a tennis ball hits a racket, or a robot manipulator strikes an obstacle, an instantaneous collision impulse $\mathbf{J}$ is delivered at some impact distance $q$ from the pivot.

In general, this collision causes the bat or robot joint to deliver an uncomfortable, jarring reaction impulse $\mathbf{J}_{\text{pivot}}$ into the batter's hands or the robot's drive gears. However, there exists a unique, magical impact location $q$ where the reaction impulse at the pivot is **identically zero**! This point is called the **Center of Percussion (COP)**, colloquially known as the **"Sweet Spot"**.

```
    Pivot P (Hands / Bearings)
         ● ─── J_pivot = 0  (Zero sting / Zero gear shock!)
         │
         │ d
         ▼
        COM ● ─── Δv_cm = J / M
         │
         │
         ▼
      COP ★ ─── Impact Impulse J (The Sweet Spot)
```

### Derivation of the Center of Percussion
Let a rigid body of mass $M$ be pivoted at point $P$. Its Center of Mass is at distance $d$ from $P$.
Suppose an impulse $J$ is delivered perpendicular to the body at distance $q$ from $P$.

1. **Angular Impulse about Pivot $P$:**
   $$\Delta L_P = q J$$
   The resulting change in angular velocity about $P$ is:
   $$\Delta\omega = \frac{\Delta L_P}{I_P} = \frac{q J}{I_P}$$
2. **Linear Impulse at the Center of Mass:**
   The Center of Mass is at distance $d$ from $P$, so its linear velocity changes by:
   $$\Delta v_{\text{cm}} = d \Delta\omega = \frac{d q J}{I_P}$$
3. **Linear Impulse Balance:**
   The net linear impulse acting on the body is the external impact $J$ plus the pivot reaction $J_{\text{pivot}}$:
   $$J_{\text{net}} = J + J_{\text{pivot}} = M \Delta v_{\text{cm}}$$
   $$J_{\text{pivot}} = M \Delta v_{\text{cm}} - J = M \left(\frac{d q J}{I_P}\right) - J = J \left( \frac{M d q}{I_P} - 1 \right)$$
4. **Condition for Zero Pivot Reaction:**
   We demand that the pivot feels zero shock: $J_{\text{pivot}} = 0$:
   $$\frac{M d q}{I_P} - 1 = 0 \implies q_{\text{cop}} = \frac{I_P}{M d}$$

Substituting Steiner's Theorem $I_P = I_{\text{cm}} + M d^2$:

$$q_{\text{cop}} = \frac{I_{\text{cm}} + M d^2}{M d} = \frac{I_{\text{cm}}}{M d} + d = \frac{k_{\text{cm}}^2}{d} + d$$

### Physical Meaning:
The Center of Percussion is located at distance $\frac{k_{\text{cm}}^2}{d}$ **below the Center of Mass**. When an impact occurs at the Center of Percussion, the translational acceleration of the body at the pivot point exactly cancels the rotational acceleration caused by the torque, leaving the pivot completely stationary without transmitting any mechanical shock into the bearings.

---

## 3.6 10 Step-by-Step Worked Examples

### Worked Example 3.1: Steiner Shift of a Solid Cuboid
**Problem:** A solid homogeneous rectangular box of mass $M = 12\text{ kg}$ has side lengths $a = 2\text{ m}, b = 4\text{ m}, c = 6\text{ m}$. Its Center-of-Mass Inertia Tensor is:
$$I_{xx}^{(\text{cm})} = \frac{1}{12}M(b^2 + c^2) = \frac{1}{12}(12)(16 + 36) = 52\text{ kg}\cdot\text{m}^2$$
$$I_{yy}^{(\text{cm})} = \frac{1}{12}M(a^2 + c^2) = \frac{1}{12}(12)(4 + 36) = 40\text{ kg}\cdot\text{m}^2$$
$$I_{zz}^{(\text{cm})} = \frac{1}{12}M(a^2 + b^2) = \frac{1}{12}(12)(4 + 16) = 20\text{ kg}\cdot\text{m}^2$$
with all products of inertia zero.
Calculate the Inertia Tensor $\mathbf{I}_C$ about one of its corners $C$, displaced by $\mathbf{d} = (a/2, b/2, c/2) = (1, 2, 3)\text{ m}$ from the Center of Mass.
**Solution:**
1. Displacement components:
   $$d_x = 1, \quad d_y = 2, \quad d_z = 3$$
   $$d^2 = 1^2 + 2^2 + 3^2 = 1 + 4 + 9 = 14\text{ m}^2$$
2. Compute diagonal shifts:
   $$\Delta I_{xx} = M(d_y^2 + d_z^2) = 12(4 + 9) = 12(13) = 156\text{ kg}\cdot\text{m}^2$$
   $$\Delta I_{yy} = M(d_x^2 + d_z^2) = 12(1 + 9) = 12(10) = 120\text{ kg}\cdot\text{m}^2$$
   $$\Delta I_{zz} = M(d_x^2 + d_y^2) = 12(1 + 4) = 12(5) = 60\text{ kg}\cdot\text{m}^2$$
3. Compute new moments of inertia:
   $$I_{xx}^{(C)} = 52 + 156 = 208\text{ kg}\cdot\text{m}^2$$
   $$I_{yy}^{(C)} = 40 + 120 = 160\text{ kg}\cdot\text{m}^2$$
   $$I_{zz}^{(C)} = 20 + 60 = 80\text{ kg}\cdot\text{m}^2$$
4. Compute off-diagonal products of inertia:
   $$I_{xy}^{(C)} = 0 - M d_x d_y = -12(1)(2) = -24\text{ kg}\cdot\text{m}^2$$
   $$I_{xz}^{(C)} = 0 - M d_x d_z = -12(1)(3) = -36\text{ kg}\cdot\text{m}^2$$
   $$I_{yz}^{(C)} = 0 - M d_y d_z = -12(2)(3) = -72\text{ kg}\cdot\text{m}^2$$
5. Assembled matrix about the corner:
   $$\mathbf{I}_C = \begin{bmatrix} 208 & -24 & -36 \\ -24 & 160 & -72 \\ -36 & -72 & 80 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
6. Notice that shifting to the corner quadrupled $I_{xx}$ and introduced large negative products of inertia.

---

### Worked Example 3.2: Period of a Meter Stick Physical Pendulum
**Problem:** A uniform thin meter stick of mass $M = 0.3\text{ kg}$ and length $L = 1.0\text{ m}$ is pivoted at one end ($d = L/2 = 0.5\text{ m}$).
1. Calculate the moment of inertia $I_P$ about the pivot.
2. Calculate the small-angle period of oscillation $T$.
3. Compare with a simple point-mass pendulum of length $L = 1.0\text{ m}$.
**Solution:**
1. Center-of-Mass inertia of a thin rod:
   $$I_{\text{cm}} = \frac{1}{12}M L^2$$
2. By Steiner's Theorem:
   $$I_P = I_{\text{cm}} + M d^2 = \frac{1}{12}M L^2 + M\left(\frac{L}{2}\right)^2 = \frac{1}{12}M L^2 + \frac{1}{4}M L^2 = \frac{1}{3}M L^2$$
   $$I_P = \frac{1}{3}(0.3)(1.0)^2 = 0.10\text{ kg}\cdot\text{m}^2$$
3. Oscillation period:
   $$T = 2\pi \sqrt{\frac{I_P}{M g d}} = 2\pi \sqrt{\frac{\frac{1}{3}ML^2}{Mg(L/2)}} = 2\pi \sqrt{\frac{2L}{3g}}$$
   Taking $g = 9.80665\text{ m/s}^2$:
   $$T = 2\pi \sqrt{\frac{2(1.0)}{3(9.80665)}} = 2\pi \sqrt{\frac{2}{29.420}} = 2\pi \sqrt{0.06798} = 2\pi (0.2607) \approx 1.638\text{ seconds}$$
4. Simple pendulum of length $L = 1.0\text{ m}$:
   $$T_{\text{simple}} = 2\pi \sqrt{\frac{L}{g}} = 2\pi \sqrt{\frac{1.0}{9.80665}} \approx 2.006\text{ seconds}$$
5. The meter stick swings substantially faster ($1.638\text{ s}$ vs $2.006\text{ s}$) because its effective length is $L_{\text{eff}} = \frac{2}{3}L \approx 0.667\text{ m}$.

---

### Worked Example 3.3: Sweet Spot of a Baseball Bat
**Problem:** A baseball bat is modeled as an elongated rigid body of mass $M = 0.90\text{ kg}$ and length $L = 0.85\text{ m}$. A batter grips the bat at pivot $P$ located $d = 0.50\text{ m}$ from its Center of Mass. The moment of inertia about the grip is $I_P = 0.27\text{ kg}\cdot\text{m}^2$. Calculate the distance $q_{\text{cop}}$ from the grip to the Center of Percussion.
**Solution:**
1. Center of Percussion formula:
   $$q_{\text{cop}} = \frac{I_P}{M d}$$
2. Substitute the parameters:
   $$q_{\text{cop}} = \frac{0.27}{(0.90)(0.50)} = \frac{0.27}{0.45} = 0.60\text{ m}$$
3. Result: The sweet spot is located **$0.60\text{ m}$ ($60\text{ cm}$)** from the batter's hands (or $10\text{ cm}$ past the Center of Mass toward the thick barrel of the bat).
4. If the baseball strikes at exactly $60\text{ cm}$, the batter's hands feel zero translational sting.

---

### Worked Example 3.4: Reversing Steiner's Theorem (Finding $I_{\text{cm}}$ from an Offset Measurement)
**Problem:** A drone manufacturer suspends a completed quadcopter by a string attached to its forward bumper (distance $d = 0.40\text{ m}$ from the estimated Center of Mass). A torsional pendulum test measures the moment of inertia about the suspension point to be $I_P = 0.125\text{ kg}\cdot\text{m}^2$. The total drone mass is $M = 0.50\text{ kg}$. Calculate the drone's true Center-of-Mass moment of inertia $I_{\text{cm}}$.
**Solution:**
1. Steiner's Theorem states: $I_P = I_{\text{cm}} + M d^2$.
2. Invert to solve for $I_{\text{cm}}$:
   $$I_{\text{cm}} = I_P - M d^2$$
3. Compute the offset penalty:
   $$M d^2 = (0.50)(0.40)^2 = 0.50 \times 0.16 = 0.080\text{ kg}\cdot\text{m}^2$$
4. Subtract:
   $$I_{\text{cm}} = 0.125 - 0.080 = 0.045\text{ kg}\cdot\text{m}^2$$
5. Result: The quadcopter's true inertia about its Center of Mass is $0.045\text{ kg}\cdot\text{m}^2$. The suspension point inflated the measured inertia by nearly $300\%$.

---

### Worked Example 3.5: Pivot Location for Minimum Oscillation Period
**Problem:** A physical pendulum has Center-of-Mass radius of gyration $k_{\text{cm}}$. At what distance $d$ from the Center of Mass should the pivot be located to make the period of oscillation $T$ an absolute minimum?
**Solution:**
1. The period formula is:
   $$T(d) = 2\pi \sqrt{\frac{k_{\text{cm}}^2 + d^2}{g d}}$$
2. Minimizing $T$ is equivalent to minimizing the function $f(d) = \frac{k_{\text{cm}}^2 + d^2}{d} = \frac{k_{\text{cm}}^2}{d} + d$.
3. Differentiate with respect to $d$ and set to zero:
   $$f'(d) = -\frac{k_{\text{cm}}^2}{d^2} + 1 = 0 \implies \frac{k_{\text{cm}}^2}{d^2} = 1 \implies d^2 = k_{\text{cm}}^2 \implies d = k_{\text{cm}}$$
4. Check second derivative:
   $$f''(d) = \frac{2k_{\text{cm}}^2}{d^3} > 0 \quad (\text{strictly a local minimum})$$
5. Result: The period of oscillation is minimized when the pivot distance equals the body's radius of gyration: **$d = k_{\text{cm}}$**.
   At this distance, the minimum period is $T_{\min} = 2\pi \sqrt{\frac{2k_{\text{cm}}}{g}}$.

---

### Worked Example 3.6: Off-Center Rotation of a Disc Hinge
**Problem:** A circular steel hatch of mass $M = 20\text{ kg}$ and radius $R = 0.4\text{ m}$ has Center-of-Mass inertia for in-plane rotation $I_{zz}^{(\text{cm})} = \frac{1}{2}MR^2$. It is hung from a hinge on its outer rim ($d = R = 0.4\text{ m}$). Compute the torque required to give it an angular acceleration of $\alpha = 5\text{ rad/s}^2$ about the rim hinge.
**Solution:**
1. Compute Center-of-Mass inertia:
   $$I_{\text{cm}} = \frac{1}{2}MR^2 = \frac{1}{2}(20)(0.4)^2 = 10(0.16) = 1.6\text{ kg}\cdot\text{m}^2$$
2. Compute hinge inertia via Steiner's Theorem:
   $$I_{\text{hinge}} = I_{\text{cm}} + M d^2 = \frac{1}{2}MR^2 + MR^2 = \frac{3}{2}MR^2$$
   $$I_{\text{hinge}} = \frac{3}{2}(20)(0.16) = 30(0.16) = 4.8\text{ kg}\cdot\text{m}^2$$
   Notice that shifting to the rim tripled the rotational inertia!
3. Required torque:
   $$\tau = I_{\text{hinge}}\alpha = (4.8\text{ kg}\cdot\text{m}^2)(5\text{ rad/s}^2) = 24.0\text{ N}\cdot\text{m}$$

---

### Worked Example 3.7: Robot Arm Link Composite Shift
**Problem:** A 2-DOF robotic arm link consists of a hollow aluminum tube of mass $m_1 = 3\text{ kg}$, length $L = 1.0\text{ m}$ ($I_{\text{cm},1} = \frac{1}{12}m_1 L^2$), with an electric gripper motor of mass $m_2 = 1\text{ kg}$ (treated as a point mass) mounted at the distal tip ($x = L = 1.0\text{ m}$).
1. Find the Center of Mass of the combined link.
2. Find the total moment of inertia about the motor joint at the shoulder base ($x = 0$).
**Solution:**
1. **Center of Mass:**
   Tube COM at $x_1 = 0.5\text{ m}$. Motor at $x_2 = 1.0\text{ m}$.
   Total mass $M = 3 + 1 = 4\text{ kg}$.
   $$X_{\text{cm}} = \frac{m_1 x_1 + m_2 x_2}{M} = \frac{3(0.5) + 1(1.0)}{4} = \frac{1.5 + 1.0}{4} = \frac{2.5}{4} = 0.625\text{ m}$$
2. **Inertia about Base Pivot ($x = 0$):**
   - Tube inertia about base (via Steiner):
     $$I_{\text{tube,base}} = \frac{1}{12}m_1 L^2 + m_1 (L/2)^2 = \frac{1}{3}m_1 L^2 = \frac{1}{3}(3)(1.0)^2 = 1.0\text{ kg}\cdot\text{m}^2$$
   - Motor inertia about base:
     $$I_{\text{motor,base}} = m_2 L^2 = 1(1.0)^2 = 1.0\text{ kg}\cdot\text{m}^2$$
   - Total inertia about base:
     $$I_{\text{base}} = 1.0 + 1.0 = 2.0\text{ kg}\cdot\text{m}^2$$
3. **Verification via Link Center of Mass:**
   $I_{\text{cm,tube}} = \frac{1}{12}(3)(1) = 0.25$.
   Distance from tube COM to link COM: $d_1 = 0.625 - 0.5 = 0.125\text{ m}$.
   Distance from motor to link COM: $d_2 = 1.0 - 0.625 = 0.375\text{ m}$.
   $$I_{\text{link,cm}} = [0.25 + 3(0.125)^2] + [0 + 1(0.375)^2] = [0.25 + 0.046875] + 0.140625 = 0.4375\text{ kg}\cdot\text{m}^2$$
   Now shift to base from link COM ($d = 0.625\text{ m}$):
   $$I_{\text{base}} = I_{\text{link,cm}} + M d^2 = 0.4375 + 4(0.625)^2 = 0.4375 + 4(0.390625) = 0.4375 + 1.5625 = 2.000\text{ kg}\cdot\text{m}^2$$
   Both methods yield identical results!

---

### Worked Example 3.8: Torsional Rigidity of an Off-Center Drive Shaft
**Problem:** A steel flywheel of mass $M = 50\text{ kg}$ and radius $R = 0.3\text{ m}$ is accidentally keyed onto a drive shaft $d = 2\text{ mm}$ ($0.002\text{ m}$) off-center.
1. Calculate the percentage increase in moment of inertia.
2. If the shaft spins at $\omega = 3000\text{ RPM}$, calculate the rotating centrifugal force exerted on the shaft bearings.
**Solution:**
1. Center-of-Mass inertia:
   $$I_{\text{cm}} = \frac{1}{2}MR^2 = \frac{1}{2}(50)(0.3)^2 = 25(0.09) = 2.25\text{ kg}\cdot\text{m}^2$$
2. Steiner offset term:
   $$M d^2 = 50(0.002)^2 = 50(4 \times 10^{-6}) = 0.0002\text{ kg}\cdot\text{m}^2$$
3. New inertia:
   $$I_{\text{shaft}} = 2.25 + 0.0002 = 2.2502\text{ kg}\cdot\text{m}^2$$
   Percentage increase: $\frac{0.0002}{2.25} \times 100\% \approx 0.0089\%$.
   The inertia change is completely negligible.
4. **Centrifugal force on bearings:**
   Convert RPM to rad/s:
   $$\omega = \frac{3000 \times 2\pi}{60} = 100\pi \approx 314.16\text{ rad/s}$$
   Centrifugal force due to offset center of mass:
   $$F_{\text{centrifugal}} = M \omega^2 d = (50\text{ kg})(314.16\text{ rad/s})^2(0.002\text{ m})$$
   $$F_{\text{centrifugal}} = 50 \times 98696 \times 0.002 = 9869.6\text{ N} \approx 9.87\text{ kN}$$
5. Result: A tiny $2\text{ mm}$ eccentricity creates an enormous **$9.87\text{ kN}$ (over 1 ton of force!)** rotating shock load, demonstrating why dynamic mass centering is vital in mechanical engineering.

---

### Worked Example 3.9: Coordinate Shift Across All Three Axes
**Problem:** A satellite component has Center-of-Mass Inertia Tensor:
$$\mathbf{I}_{\text{cm}} = \begin{bmatrix} 10 & 0 & 0 \\ 0 & 20 & 0 \\ 0 & 0 & 25 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$
Its mass is $M = 5\text{ kg}$. The sensor origin is shifted to $\mathbf{d} = (2, -1, 3)\text{ m}$ relative to the sensor. Compute the complete new $3 \times 3$ tensor.
**Solution:**
1. Displacement components: $d_x = 2, d_y = -1, d_z = 3$.
2. Diagonal shifts:
   $$\Delta I_{xx} = M(d_y^2 + d_z^2) = 5((-1)^2 + 3^2) = 5(1 + 9) = 50$$
   $$\Delta I_{yy} = M(d_x^2 + d_z^2) = 5(2^2 + 3^2) = 5(4 + 9) = 65$$
   $$\Delta I_{zz} = M(d_x^2 + d_y^2) = 5(2^2 + (-1)^2) = 5(4 + 1) = 25$$
3. Diagonal sums:
   $$I_{xx}^{(P)} = 10 + 50 = 60$$
   $$I_{yy}^{(P)} = 20 + 65 = 85$$
   $$I_{zz}^{(P)} = 25 + 25 = 50$$
4. Off-diagonal products:
   $$I_{xy}^{(P)} = 0 - M d_x d_y = -5(2)(-1) = +10$$
   $$I_{xz}^{(P)} = 0 - M d_x d_z = -5(2)(3) = -30$$
   $$I_{yz}^{(P)} = 0 - M d_y d_z = -5(-1)(3) = +15$$
5. New tensor:
   $$\mathbf{I}_P = \begin{bmatrix} 60 & 10 & -30 \\ 10 & 85 & 15 \\ -30 & 15 & 50 \end{bmatrix}\text{ kg}\cdot\text{m}^2$$

---

### Worked Example 3.10: Conjugate Pacing in Kater's Reversible Pendulum
**Problem:** In geophysics, Kater's Pendulum is designed with two knife-edge pivots $A$ and $B$ on opposite sides of the Center of Mass ($d_A \ne d_B$) that have identical oscillation periods $T_A = T_B$. Prove that the distance between the knife edges is $L = d_A + d_B = \frac{g T^2}{4\pi^2}$.
**Solution:**
1. Period equations for both pivots:
   $$T_A^2 = \frac{4\pi^2 (k_{\text{cm}}^2 + d_A^2)}{g d_A}, \quad T_B^2 = \frac{4\pi^2 (k_{\text{cm}}^2 + d_B^2)}{g d_B}$$
2. Set $T_A = T_B = T$:
   $$\frac{k_{\text{cm}}^2 + d_A^2}{d_A} = \frac{k_{\text{cm}}^2 + d_B^2}{d_B}$$
   $$\frac{k_{\text{cm}}^2}{d_A} + d_A = \frac{k_{\text{cm}}^2}{d_B} + d_B \implies k_{\text{cm}}^2\left(\frac{1}{d_A} - \frac{1}{d_B}\right) = d_B - d_A$$
   $$k_{\text{cm}}^2 \left(\frac{d_B - d_A}{d_A d_B}\right) = d_B - d_A$$
3. Since $d_A \ne d_B$, divide both sides by $(d_B - d_A)$:
   $$\frac{k_{\text{cm}}^2}{d_A d_B} = 1 \implies k_{\text{cm}}^2 = d_A d_B$$
4. Now substitute $k_{\text{cm}}^2 = d_A d_B$ back into the period equation for pivot $A$:
   $$\frac{g T^2}{4\pi^2} = \frac{d_A d_B + d_A^2}{d_A} = \frac{d_A(d_B + d_A)}{d_A} = d_A + d_B = L$$
5. Result: The distance between the knife edges $L = d_A + d_B$ is precisely the length of an ideal simple pendulum with the exact same period, completely independent of the mass or internal mass distribution of the pendulum!

---

## 3.7 10 Granular Solved Exercises

### Exercise 3.1
**Problem:** Prove that shifting the origin along the direction of a principal axis leaves the corresponding moment of inertia about that axis unchanged.
**Solution:**
1. Let the shift be purely along the $z$-axis: $\mathbf{d} = (0, 0, d_z)$.
2. Steiner's formula for $I_{zz}^{(P)}$:
   $$I_{zz}^{(P)} = I_{zz}^{(\text{cm})} + M(d_x^2 + d_y^2)$$
3. Since $d_x = 0$ and $d_y = 0$:
   $$I_{zz}^{(P)} = I_{zz}^{(\text{cm})} + M(0 + 0) = I_{zz}^{(\text{cm})}$$
4. Thus, translating a coordinate frame along the rotation axis does not alter the moment of inertia about that axis.

---

### Exercise 3.2
**Problem:** A thin uniform rectangular plate of mass $M$ with dimensions $a \times b$ has Center-of-Mass inertia $I_{zz}^{(\text{cm})} = \frac{1}{12}M(a^2 + b^2)$. Find its moment of inertia about an axis perpendicular to the plate passing through one of its corners.
**Solution:**
1. Distance from Center of Mass $(0, 0)$ to corner $(a/2, b/2)$:
   $$d^2 = \left(\frac{a}{2}\right)^2 + \left(\frac{b}{2}\right)^2 = \frac{a^2 + b^2}{4}$$
2. By Steiner's Theorem:
   $$I_{zz}^{(\text{corner})} = I_{zz}^{(\text{cm})} + M d^2 = \frac{1}{12}M(a^2 + b^2) + \frac{1}{4}M(a^2 + b^2)$$
3. Common denominator 12:
   $$I_{zz}^{(\text{corner})} = \left(\frac{1}{12} + \frac{3}{12}\right)M(a^2 + b^2) = \frac{4}{12}M(a^2 + b^2) = \frac{1}{3}M(a^2 + b^2)$$.

---

### Exercise 3.3
**Problem:** Explain why attempting to shift inertia directly between two points $P_1$ and $P_2$ without using the Center of Mass via $\mathbf{I}_{P_2} = \mathbf{I}_{P_1} + M\|\mathbf{r}_{P_2} - \mathbf{r}_{P_1}\|^2$ is fundamentally invalid.
**Solution:**
1. In the derivation of Steiner's Theorem, the cross-term $\int \mathbf{r}' dm$ vanishes if and only if the reference origin is the **Center of Mass**.
2. If the initial reference point is $P_1 \ne \text{COM}$, the relative coordinates $\mathbf{r}'' = \mathbf{r} - \mathbf{R}_{P_1}$ have non-zero first moment:
   $$\int \mathbf{r}'' dm = M(\mathbf{R}_{\text{cm}} - \mathbf{R}_{P_1}) \ne \mathbf{0}$$
3. This creates non-vanishing cross-terms in the expansion that depend on the relative angle and position of the Center of Mass.
4. Omitting these cross-terms overestimates the inertia and violates conservation of angular momentum.

---

### Exercise 3.4
**Problem:** A solid homogeneous sphere of mass $M$ and radius $R$ has $I_{\text{cm}} = \frac{2}{5}MR^2$. Find its moment of inertia about a tangent axis touching its surface.
**Solution:**
1. Distance from Center of Mass to tangent axis is $d = R$.
2. By Steiner's Theorem:
   $$I_{\text{tangent}} = I_{\text{cm}} + M d^2 = \frac{2}{5}MR^2 + MR^2 = \frac{7}{5}MR^2$$.

---

### Exercise 3.5
**Problem:** A hoop of mass $M$ and radius $R$ is suspended from a nail on its rim. Find its oscillation period for in-plane swinging.
**Solution:**
1. Center-of-Mass inertia for in-plane rotation: $I_{\text{cm}} = MR^2$.
2. Distance from COM to nail: $d = R$.
3. Inertia about nail: $I_{\text{nail}} = I_{\text{cm}} + M d^2 = MR^2 + MR^2 = 2MR^2$.
4. Period:
   $$T = 2\pi \sqrt{\frac{I_{\text{nail}}}{M g d}} = 2\pi \sqrt{\frac{2MR^2}{MgR}} = 2\pi \sqrt{\frac{2R}{g}}$$.

---

### Exercise 3.6
**Problem:** If an impulse $J$ is struck at distance $q$ from the pivot, where does the Center of Percussion lie if the pivot is at the Center of Mass ($d \to 0$)?
**Solution:**
1. Formula: $q_{\text{cop}} = \frac{I_P}{M d}$.
2. As $d \to 0$, $q_{\text{cop}} \to \infty$.
3. Physical interpretation: Any finite force or impulse applied at a finite distance from the Center of Mass produces linear acceleration of the Center of Mass. There is no finite point where an impact will leave the Center of Mass stationary without external pivot constraints.

---

### Exercise 3.7
**Problem:** Prove that for any 3D body, the trace of the Inertia Tensor shifts under displacement $\mathbf{d}$ according to $\text{tr}(\mathbf{I}_P) = \text{tr}(\mathbf{I}_{\text{cm}}) + 2M\|\mathbf{d}\|^2$.
**Solution:**
1. $\text{tr}(\mathbf{I}_P) = I_{xx}^{(P)} + I_{yy}^{(P)} + I_{zz}^{(P)}$.
2. Substitute the diagonal Steiner equations:
   $$I_{xx}^{(P)} = I_{xx}^{(\text{cm})} + M(d_y^2 + d_z^2)$$
   $$I_{yy}^{(P)} = I_{yy}^{(\text{cm})} + M(d_x^2 + d_z^2)$$
   $$I_{zz}^{(P)} = I_{zz}^{(\text{cm})} + M(d_x^2 + d_y^2)$$
3. Sum the three:
   $$\text{tr}(\mathbf{I}_P) = (I_{xx}^{(\text{cm})} + I_{yy}^{(\text{cm})} + I_{zz}^{(\text{cm})}) + M[(d_y^2 + d_z^2) + (d_x^2 + d_z^2) + (d_x^2 + d_y^2)]$$
   $$= \text{tr}(\mathbf{I}_{\text{cm}}) + M[2(d_x^2 + d_y^2 + d_z^2)] = \text{tr}(\mathbf{I}_{\text{cm}}) + 2M\|\mathbf{d}\|^2$$.

---

### Exercise 3.8
**Problem:** A uniform door of mass $M = 30\text{ kg}$, width $w = 0.8\text{ m}$, and height $h = 2.0\text{ m}$ is hinged along its height. What is its moment of inertia about the hinge axis?
**Solution:**
1. Treat the door as a planar sheet. Center-of-Mass moment of inertia about an axis parallel to height:
   $$I_{yy}^{(\text{cm})} = \frac{1}{12}M w^2$$
2. Distance from Center of Mass to hinge: $d = w/2$.
3. By Steiner's Theorem:
   $$I_{\text{hinge}} = \frac{1}{12}M w^2 + M(w/2)^2 = \frac{1}{3}M w^2$$
4. Numerical value:
   $$I_{\text{hinge}} = \frac{1}{3}(30)(0.8)^2 = 10(0.64) = 6.4\text{ kg}\cdot\text{m}^2$$.

---

### Exercise 3.9
**Problem:** In a robotic arm, why does minimizing the mass of the distal end-effector produce an exponential reduction in the required motor torque at the base joint?
**Solution:**
1. A distal end-effector of mass $m_e$ at the end of an arm of reach $L$ contributes $m_e L^2$ to the base joint inertia.
2. The motor torque required for angular acceleration $\alpha$ is $\tau = I_{\text{base}}\alpha$.
3. Because inertia scales with $L^2$, shaving $1\text{ kg}$ off a $2\text{ m}$ arm reduces the base inertia by $1 \times 2^2 = 4\text{ kg}\cdot\text{m}^2$.
4. At high accelerations (e.g., $10\text{ rad/s}^2$), this reduces motor torque demand by $40\text{ N}\cdot\text{m}$, allowing smaller, lighter, and more responsive actuators throughout the kinetic chain.

---

### Exercise 3.10
**Problem:** Can a Steiner coordinate shift cause a positive-definite Inertia Tensor to become indefinite or negative?
**Solution:**
1. The displacement tensor is $\Delta \mathbf{I} = M(d^2 \mathbf{I}_3 - \mathbf{d}\mathbf{d}^T)$.
2. For any non-zero vector $\mathbf{v} \in \mathbb{R}^3$:
   $$\mathbf{v}^T \Delta \mathbf{I} \mathbf{v} = M [ d^2 (\mathbf{v} \cdot \mathbf{v}) - (\mathbf{v} \cdot \mathbf{d})^2 ] = M [ \|\mathbf{d}\|^2 \|\mathbf{v}\|^2 - (\mathbf{v} \cdot \mathbf{d})^2 ]$$
3. By the Cauchy-Schwarz inequality, $(\mathbf{v} \cdot \mathbf{d})^2 \le \|\mathbf{v}\|^2 \|\mathbf{d}\|^2$.
4. Therefore, $\mathbf{v}^T \Delta \mathbf{I} \mathbf{v} \ge 0$ for all $\mathbf{v}$, meaning $\Delta \mathbf{I}$ is **positive semi-definite**.
5. The sum of a strictly positive-definite matrix $\mathbf{I}_{\text{cm}}$ and a positive semi-definite matrix $\Delta \mathbf{I}$ is **strictly positive-definite**.
6. Therefore, $\mathbf{I}_P$ is guaranteed to remain positive-definite under any spatial translation.
