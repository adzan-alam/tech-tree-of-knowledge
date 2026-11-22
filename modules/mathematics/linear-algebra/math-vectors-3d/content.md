# Chapter 1: The Escape from Flatland â€” The Third Dimension & Spatial Intuition

> *"To the inhabitant of Flatland, an upward journey does not mean climbing a mountain; it means a miracle. A direction pointing nowhere that can be conceived, yet everywhere present."*  
> â€” **Edwin A. Abbott, Flatland: A Romance of Many Dimensions (1884)**

---

## 1.1 The Philosophical and Physical Genesis of the Third Dimension

In our journey through two-dimensional space, we operated within the pristine confines of a sheet of paper. Every trajectory, every velocity arrow, and every collision between two discs occurred along a planar surface defined entirely by two numbers: a horizontal displacement $x$ and a vertical displacement $y$. In that two-dimensional universe, every point lived upon an infinitely thin membrane.

Consider the classic thought experiment posed by Edwin Abbott in 1884. Imagine an intelligent, two-dimensional sentient square residing entirely within a planar sheet. The square can glide north, south, east, and west. It possesses a full geometry of lines, angles, and areas. It understands distance:
$$d = \sqrt{(\Delta x)^2 + (\Delta y)^2}$$

Now, imagine a three-dimensional sphere descending from above the page, passing through the plane of Flatland. 

What does the two-dimensional observer witness? 

The square does not see a sphere. The square has no physiological or cognitive apparatus to see "above" or "below." Instead, the square witnesses an impossible supernatural event: a microscopic point suddenly materializes out of absolute vacuum, expands into a growing circular ring, reaches a maximum diameter, contracts back into a shrinking ring, dwindles into a solitary point, and vanishes without a trace.

```
       3D Realm: A Sphere Passing Through a 2D Slice
       
               â—  (Sphere touches plane at a single point)
              / \
            (     )
           ( â€”â€”â€”â€”â€” )  <-- 2D Observer only sees this planar circular slice!
            (     )
              \ /
               â—
```

To the Flatlander, mass was created from nothing and destroyed into nothing. Yet to an observer standing in three-dimensional Euclidean space ($\mathbb{R}^3$), nothing magical occurred. A rigid, invariant spherical body moved along an axis that the Flatlander was blind to: the **$z$-axis**.

Our universeâ€”from the tumbling of celestial asteroids and the flight dynamics of a quadcopter to the protein folding of computational biology and the simulation of rigid multi-body dynamicsâ€”is unapologetically three-dimensional. A particle cannot merely dodge left or right; it can leap upward, burrow downward, dive toward the camera, or recede into the cosmic distance. 

To model this reality without handwaving, we must formally construct the mathematical language of three-dimensional space. We must escape Flatland.

---

## 1.2 The Cartesian Spatial Frame: Extending $\mathbb{R}^2$ to $\mathbb{R}^3$

In two dimensions, the Cartesian coordinate system is established by two mutually perpendicular real number lines: the horizontal $x$-axis and the vertical $y$-axis. Their point of intersection is the origin $\mathbf{O} = (0, 0)$. Any point in the plane is uniquely identified by an ordered pair $(x, y) \in \mathbb{R}^2$.

To describe three-dimensional space, we introduce a third axis, denoted $z$, that passes through the origin $\mathbf{O}$ and is simultaneously perpendicular to both the $x$-axis and the $y$-axis:
$$x \perp y, \quad y \perp z, \quad z \perp x$$

The point of mutual intersection of all three axes is the spatial origin:
$$\mathbf{O} = (0, 0, 0)$$

Any physical location in space is now uniquely pinned down by an ordered triplet of real numbers:
$$\mathbf{p} = (x, y, z) \in \mathbb{R}^3$$

Each component represents a directed signed distance measured along the corresponding coordinate axis:
1. **$x$ (Abscissa / Width / East-West):** Displacement along the $x$-axis from the $yz$-plane.
2. **$y$ (Ordinate / Depth or Height / North-South):** Displacement along the $y$-axis from the $xz$-plane.
3. **$z$ (Applicate / Altitude or Depth / Up-Down or Forward-Back):** Displacement along the $z$-axis from the $xy$-plane.

```
                         +z (Altitude / Up)
                          â”‚
                          â”‚
                          â”‚        p = (x, y, z)
                          â”‚       *
                          â”‚      /â”‚
                          â”‚     / â”‚
                          â”‚    /  â”‚
                          â”‚   /   â”‚
                          â””â”€â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ +y (Depth / North)
                         /   /    â”‚
                        /   /     â”‚
                       /   *â”€â”€â”€â”€â”€â”€â”˜  (Projection on xy-plane: (x, y, 0))
                      /   (x, y, 0)
                     /
                   +x (Width / East)
```

The introduction of the third coordinate fundamentally alters the topology and geometric freedom of the space:
- A single point has **three degrees of freedom** ($3$ DoF) of pure translation: it can translate independently along $x$, $y$, or $z$.
- A rigid body in 3D will possess **six degrees of freedom** ($6$ DoF): $3$ translational degrees of freedom $(x, y, z)$ plus $3$ rotational degrees of freedom (roll, pitch, yaw), compared to just $3$ DoF ($2$ translation, $1$ rotation) in 2D.

---

## 1.3 The Great Coordinate War: Right-Handed vs. Left-Handed Systems

When you draw two perpendicular axes in 2D, the choice is straightforward: $+x$ points right, $+y$ points up. Any other orientation is just a 2D planar rotation.

In three dimensions, however, once $+x$ is assigned to point right and $+y$ points up, the $z$-axis can point in **two mutually incompatible directions**:
1. It can point **out of the page directly toward you**.
2. It can point **into the page directly away from you**.

These two choices cannot be made to coincide by any rigid rotation in 3D space! They are topological **enantiomorphs** (mirror images of each other, like a left hand and a right hand). This distinction defines the handedness of the coordinate frame.

```
       Right-Handed System                      Left-Handed System
       
              +z (Up)                                  +y (Up)
               â”‚                                        â”‚
               â”‚                                        â”‚
               â”‚                                        â”‚
               â””â”€â”€â”€â”€â”€â”€â”€â”€â”€ +y (Forward)                  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€ +x (Right)
              /                                        /
             /                                        /
            /                                        /
          +x (Right / Out of screen)               +z (Forward / Into screen)
```

### 1.3.1 The Right-Hand Rule (Physics & Mathematics Standard)
In standard mathematics, classical mechanics, robotics, and physics (as formalized by Gibbs and Heaviside), three-dimensional space is universally defined to be **Right-Handed**:

> **The Right-Hand Rule:**  
> Take your right hand. Point your index finger along the positive $x$-axis. Curl your middle finger so it points along the positive $y$-axis. Extend your thumb perpendicular to both. Your thumb points along the positive $z$-axis.
> 
> Alternatively: Curl the fingers of your right hand in the direction of a $90^\circ$ rotation from the positive $x$-axis to the positive $y$-axis. Your extended right thumb points along the positive $z$-axis.

### 1.3.2 The Engine Tower of Babel
In computational simulation, graphics, and robotics, the lack of an agreed-upon axis convention is one of the most persistent sources of bugs, inverted normal vectors, and inverted rotations.

| Environment / Engine | Handedness | Forward Vector | Up Vector | Right Vector | Typical Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Mathematics & Physics** | Right-Handed | $+y$ or $+x$ | $+z$ | $+x$ or $+y$ | Classical mechanics, dynamics |
| **OpenGL / WebGL** | Right-Handed | $-z$ (into screen) | $+y$ (up) | $+x$ (right) | Standard 3D graphics rendering |
| **Blender** | Right-Handed | $+y$ (forward) | $+z$ (up) | $+x$ (right) | 3D modelling, CAD, robotics |
| **ROS (Robot Operating System)** | Right-Handed | $+x$ (forward) | $+z$ (up) | $-y$ (right) / $+y$ (left) | Autonomous vehicles, drones |
| **DirectX / Direct3D** | Left-Handed | $+z$ (into screen) | $+y$ (up) | $+x$ (right) | Game engines, Windows graphics |
| **Unity Engine** | Left-Handed | $+z$ (forward) | $+y$ (up) | $+x$ (right) | Game development |
| **Unreal Engine** | Left-Handed | $+x$ (forward) | $+z$ (up) | $+y$ (right) | Simulation, games, film VFX |

> [!WARNING]
> If you export a 3D polygonal mesh from Blender (Right-handed, $+Z$ up) into Unity (Left-handed, $+Y$ up), or compute a cross product in a left-handed engine using right-handed formulas, vectors will point in opposite directions, triangle faces will face backward, and collision solvers will pull penetrating bodies deeper inside obstacles rather than ejecting them!

---

## 1.4 Coordinate Parity, Chirality, and Axis Reflections

How do we mathematically transform a right-handed system into a left-handed system?

Consider a point $\mathbf{p} = (x, y, z)$ in a right-handed coordinate frame. If we reflect the space across the $xy$-plane by negating the $z$-coordinate:
$$\mathbf{p}' = (x, y, -z)$$

This transformation reverses the **chirality** (handedness) of the space. 

Let us represent this reflection as an operator matrix acting on the coordinate triplet:
$$\begin{bmatrix} x' \\ y' \\ z' \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix}$$

Notice the determinant of this transformation matrix:
$$\det \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix} = 1 \cdot (1 \cdot (-1) - 0) = -1$$

A coordinate transformation that has a determinant of $+1$ represents a **pure rigid rotation**; it preserves handedness. A transformation that has a determinant of $-1$ involves an odd number of reflections; it **inverts handedness** (turns a right hand into a left hand).

If you negate all three axes simultaneously (a point reflection through the origin, or spatial inversion):
$$\mathbf{p}'' = (-x, -y, -z) \implies \det \begin{bmatrix} -1 & 0 & 0 \\ 0 & -1 & 0 \\ 0 & 0 & -1 \end{bmatrix} = (-1)^3 = -1$$
Spatial inversion also flips the handedness of the universe. In physics, this fundamental symmetry is known as **Parity ($\mathcal{P}$)**.

---

## 1.5 Position Vectors in Three Dimensions

A **vector** in three dimensions is a directed geometric arrow characterized completely by its:
1. **Magnitude (length):** A non-negative real scalar $\|\mathbf{v}\| \ge 0$.
2. **Direction:** The line of action and orientation in $\mathbb{R}^3$.

A vector has no fixed location in space; it can be translated anywhere so long as its length and direction are preserved. However, when an arrow is tethered to originate at the spatial origin $\mathbf{O} = (0, 0, 0)$ and terminate at a point $\mathbf{P} = (p_x, p_y, p_z)$, it is designated as a **position vector**, denoted:
$$\mathbf{r} = \vec{OP} = \begin{bmatrix} p_x \\ p_y \\ p_z \end{bmatrix} \quad \text{or} \quad \mathbf{r} = (p_x, p_y, p_z)$$

### Vector Displacement Between Two Arbitrary 3D Points
Let $\mathbf{A} = (x_1, y_1, z_1)$ and $\mathbf{B} = (x_2, y_2, z_2)$ be two arbitrary points in 3D space. The displacement vector pointing from $\mathbf{A}$ to $\mathbf{B}$, denoted $\vec{AB}$, is computed by subtracting the initial point from the terminal point:
$$\vec{AB} = \mathbf{B} - \mathbf{A} = (x_2 - x_1, \; y_2 - y_1, \; z_2 - z_1)$$

```
                     B = (x2, y2, z2)
                    *
                   / ^
                  /   \
                 /     \  \vec{AB} = B - A
                /       \
      r_A      /         *
              /         /
             /         /  r_B
            /         /
           /         /
          *â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
         O = (0, 0, 0)
```

By the fundamental tip-to-tail triangle law of vector addition:
$$\mathbf{r}_A + \vec{AB} = \mathbf{r}_B \implies \vec{AB} = \mathbf{r}_B - \mathbf{r}_A$$

This simple principle holds universally in 3D: *Displacement is always Terminal minus Initial*.

---

## 1.6 Worked Examples: Foundations of 3D Spatial Vectors

### Worked Example 1.1: Translating a Point in 3D Space (Flight Navigation)
*Problem:* An autonomous delivery drone takes off from a ground control station located at the origin $\mathbf{O} = (0, 0, 0)$ meters. It flies along a straight vector displacement $\mathbf{d}_1 = (120, 80, 45)$ meters to delivery point $\mathbf{A}$. After dropping its parcel, it executes a second displacement $\mathbf{d}_2 = (-40, 110, 25)$ meters to reach a recharging rooftop $\mathbf{B}$.  
1. Find the coordinates of point $\mathbf{A}$ and point $\mathbf{B}$.  
2. Find the direct return vector $\mathbf{d}_{\text{return}}$ from $\mathbf{B}$ back to the ground control station $\mathbf{O}$.

*Solution:*  
1. The position vector of $\mathbf{A}$ is:
   $$\mathbf{r}_A = \mathbf{O} + \mathbf{d}_1 = (0 + 120, \; 0 + 80, \; 0 + 45) = (120, 80, 45)\text{ m}$$
   The position vector of $\mathbf{B}$ is:
   $$\mathbf{r}_B = \mathbf{r}_A + \mathbf{d}_2 = (120 - 40, \; 80 + 110, \; 45 + 25) = (80, 190, 70)\text{ m}$$
2. The return vector points from $\mathbf{B}$ to $\mathbf{O}$:
   $$\mathbf{d}_{\text{return}} = \mathbf{O} - \mathbf{r}_B = (0 - 80, \; 0 - 190, \; 0 - 70) = (-80, -190, -70)\text{ m}$$
   *Verification:* $\mathbf{r}_B + \mathbf{d}_{\text{return}} = (80 - 80, 190 - 190, 70 - 70) = (0, 0, 0) = \mathbf{O}$. The flight loop closes cleanly.

---

### Worked Example 1.2: Determining Handedness of an Arbitrary Coordinate Basis
*Problem:* A robotic rover defines its local coordinate frame using three basis vectors:  
$\mathbf{u}_1 = (1, 0, 0)$ (pointing forward),  
$\mathbf{u}_2 = (0, 0, 1)$ (pointing up),  
$\mathbf{u}_3 = (0, 1, 0)$ (pointing right).  
Determine whether this rover coordinate frame is Right-Handed or Left-Handed.

*Solution:*  
To check handedness analytically without relying on physical finger contortions, we assemble the three vectors as columns of a $3 \times 3$ matrix $\mathbf{M} = [\mathbf{u}_1 \quad \mathbf{u}_2 \quad \mathbf{u}_3]$ and evaluate its determinant:
$$\mathbf{M} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$
Expanding the determinant along the first row:
$$\det(\mathbf{M}) = 1 \cdot \begin{vmatrix} 0 & 1 \\ 1 & 0 \end{vmatrix} - 0 + 0 = 1 \cdot (0 \cdot 0 - 1 \cdot 1) = -1$$
Because $\det(\mathbf{M}) = -1 < 0$, the basis vectors form a **Left-Handed system**. To make it right-handed, either the second or third vector must be inverted, or their order swapped.

---

### Worked Example 1.3: Coordinate System Conversion (Blender Z-Up to Unity Y-Up)
*Problem:* A 3D CAD model authored in Blender (Right-handed: $x_{\text{blender}}$ = Right, $y_{\text{blender}}$ = Forward, $z_{\text{blender}}$ = Up) has a vertex at $\mathbf{p}_{\text{blender}} = (12.5, -4.0, 8.2)$. We wish to import this vertex into Unity (Left-handed: $x_{\text{unity}}$ = Right, $y_{\text{unity}}$ = Up, $z_{\text{unity}}$ = Forward).  
1. Write down the linear mapping rule from Blender coordinates to Unity coordinates.  
2. Calculate the corresponding coordinates $\mathbf{p}_{\text{unity}}$.  
3. Verify the determinant of the transformation matrix.

*Solution:*  
1. Mapping the spatial roles:
   - "Right" remains "Right": $x_{\text{unity}} = x_{\text{blender}}$
   - "Up" comes from Blender's "Up": $y_{\text{unity}} = z_{\text{blender}}$
   - "Forward" comes from Blender's "Forward": $z_{\text{unity}} = y_{\text{blender}}$
2. Substituting the numerical components:
   $$\mathbf{p}_{\text{unity}} = (x_{\text{blender}}, \; z_{\text{blender}}, \; y_{\text{blender}}) = (12.5, \; 8.2, \; -4.0)$$
3. The matrix representation is:
   $$\mathbf{T} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix} \implies \det(\mathbf{T}) = 1(0 - 1) = -1$$
   Because $\det(\mathbf{T}) = -1$, this transformation successfully converts from a right-handed frame (Blender) to a left-handed frame (Unity) while keeping geometric positions physically aligned.

---

### Worked Example 1.4: Distance from Point to Coordinate Axes
*Problem:* A spatial point is located at $\mathbf{p} = (3, -4, 12)$.  
1. Calculate the shortest perpendicular distance from $\mathbf{p}$ to each of the three coordinate planes ($xy$, $xz$, $yz$).  
2. Calculate the shortest perpendicular distance from $\mathbf{p}$ to each of the three coordinate axes ($x$-axis, $y$-axis, $z$-axis).

*Solution:*  
1. The perpendicular distance from a point $(x, y, z)$ to a coordinate plane is simply the absolute value of the coordinate that is zero on that plane:
   - Distance to $xy$-plane ($z = 0$): $d_{xy} = |z| = |12| = 12$
   - Distance to $xz$-plane ($y = 0$): $d_{xz} = |y| = |-4| = 4$
   - Distance to $yz$-plane ($x = 0$): $d_{yz} = |x| = |3| = 3$
2. The closest point on the $x$-axis to $\mathbf{p}(x, y, z)$ is $(x, 0, 0)$. By Pythagoras in the $yz$-plane:
   $$d_{\text{x-axis}} = \sqrt{y^2 + z^2} = \sqrt{(-4)^2 + 12^2} = \sqrt{16 + 144} = \sqrt{160} = 4\sqrt{10} \approx 12.649$$
   The closest point on the $y$-axis is $(0, y, 0)$:
   $$d_{\text{y-axis}} = \sqrt{x^2 + z^2} = \sqrt{3^2 + 12^2} = \sqrt{9 + 144} = \sqrt{153} = 3\sqrt{17} \approx 12.369$$
   The closest point on the $z$-axis is $(0, 0, z)$:
   $$d_{\text{z-axis}} = \sqrt{x^2 + y^2} = \sqrt{3^2 + (-4)^2} = \sqrt{9 + 16} = \sqrt{25} = 5$$

---

### Worked Example 1.5: Satellite Constellation Relative Displacement
*Problem:* Two communication satellites in low-Earth orbit are tracked by an earth-centered Cartesian tracking frame:  
Satellite 1: $\mathbf{r}_1 = (4200, 3100, 1800)\text{ km}$  
Satellite 2: $\mathbf{r}_2 = (4100, 3350, 1950)\text{ km}$  
1. Compute the relative displacement vector $\vec{S_1 S_2}$ pointing from Satellite 1 to Satellite 2.  
2. Compute the straight-line distance (Euclidean separation) between the two satellites.

*Solution:*  
1. The displacement vector from 1 to 2 is:
   $$\vec{S_1 S_2} = \mathbf{r}_2 - \mathbf{r}_1 = (4100 - 4200, \; 3350 - 3100, \; 1950 - 1800) = (-100, \; 250, \; 150)\text{ km}$$
2. The Euclidean distance between them is the norm of the displacement vector:
   $$d = \|\vec{S_1 S_2}\| = \sqrt{(-100)^2 + 250^2 + 150^2} = \sqrt{10000 + 62500 + 22500} = \sqrt{95000} \approx 308.22\text{ km}$$

---

### Worked Example 1.6: Spatial Reflection Across Coordinate Planes
*Problem:* A particle with position vector $\mathbf{r} = (-5, 7, -9)$ is reflected:  
1. Across the $xy$-plane to yield point $\mathbf{p}_1$.  
2. Next, $\mathbf{p}_1$ is reflected across the $yz$-plane to yield point $\mathbf{p}_2$.  
3. Finally, $\mathbf{p}_2$ is reflected across the $xz$-plane to yield point $\mathbf{p}_3$.  
Find the coordinates of $\mathbf{p}_1, \mathbf{p}_2, \mathbf{p}_3$, and state the relationship between $\mathbf{r}$ and $\mathbf{p}_3$.

*Solution:*  
1. Reflection across the $xy$-plane negates $z$:
   $$\mathbf{p}_1 = (x, y, -z) = (-5, 7, 9)$$
2. Reflection across the $yz$-plane negates $x$:
   $$\mathbf{p}_2 = (-x_{\mathbf{p}_1}, y_{\mathbf{p}_1}, z_{\mathbf{p}_1}) = (5, 7, 9)$$
3. Reflection across the $xz$-plane negates $y$:
   $$\mathbf{p}_3 = (x_{\mathbf{p}_2}, -y_{\mathbf{p}_2}, z_{\mathbf{p}_2}) = (5, -7, 9)$$
Comparing $\mathbf{p}_3$ with the original $\mathbf{r} = (-5, 7, -9)$:
$$\mathbf{p}_3 = -\mathbf{r}$$
*Conclusion:* Successive reflection across all three mutually orthogonal coordinate planes is mathematically identical to a point reflection through the origin (spatial inversion).

---

### Worked Example 1.7: Axis Parity Inversion and Chirality (The Spatial Hand Trap)
*Problem:* Let three vectors in $\mathbb{R}^3$ be $\mathbf{a} = (1, 0, 0)$, $\mathbf{b} = (0, 1, 0)$, $\mathbf{c} = (0, 0, 1)$.  
Show that applying a parity inversion $\mathbf{P} \mapsto -\mathbf{P}$ to all three vectors produces a triad that cannot be brought into alignment with the original triad using any rigid rotation.

*Solution:*  
1. The original triad has determinant:
   $$\det([\mathbf{a} \quad \mathbf{b} \quad \mathbf{c}]) = \det(\mathbf{I}_3) = +1$$
2. The inverted triad is $\mathbf{a}' = (-1, 0, 0)$, $\mathbf{b}' = (0, -1, 0)$, $\mathbf{c}' = (0, 0, -1)$.
3. Its determinant is:
   $$\det([\mathbf{a}' \quad \mathbf{b}' \quad \mathbf{c}']) = \det(-\mathbf{I}_3) = (-1)^3 \det(\mathbf{I}_3) = -1$$
4. Every proper rigid rotation matrix $\mathbf{R} \in \text{SO}(3)$ has determinant $\det(\mathbf{R}) = +1$.
5. Since the determinant of a product of matrices is the product of their determinants ($\det(\mathbf{R} \mathbf{M}) = \det(\mathbf{R})\det(\mathbf{M}) = 1 \cdot (-1) = -1 \neq +1$), no sequence of continuous 3D rotations can ever transform $\mathbf{a}', \mathbf{b}', \mathbf{c}'$ into $\mathbf{a}, \mathbf{b}, \mathbf{c}$. They possess opposite chirality.

---

### Worked Example 1.8: Axis-Aligned Bounding Box (AABB) Center and Diagonal
*Problem:* In a 3D physics engine, a rigid collision obstacle is defined by its minimum and maximum bounding corners:  
$\mathbf{p}_{\min} = (-10, -5, 2)$,  
$\mathbf{p}_{\max} = (4, 15, 14)$.  
1. Compute the center of the bounding box $\mathbf{c}$.  
2. Compute the extents (width, height, depth) along the three axes.  
3. Compute the length of the internal spatial diagonal vector $\mathbf{d}_{\text{diag}} = \mathbf{p}_{\max} - \mathbf{p}_{\min}$.

*Solution:*  
1. The center point is the arithmetic midpoint:
   $$\mathbf{c} = \frac{\mathbf{p}_{\min} + \mathbf{p}_{\max}}{2} = \left(\frac{-10 + 4}{2}, \; \frac{-5 + 15}{2}, \; \frac{2 + 14}{2}\right) = (-3, 5, 8)$$
2. The spatial dimensions (extents) are:
   $$\Delta x = 4 - (-10) = 14, \quad \Delta y = 15 - (-5) = 20, \quad \Delta z = 14 - 2 = 12$$
3. The diagonal vector is $\mathbf{d}_{\text{diag}} = (14, 20, 12)$.  
   Its length is:
   $$\|\mathbf{d}_{\text{diag}}\| = \sqrt{14^2 + 20^2 + 12^2} = \sqrt{196 + 400 + 144} = \sqrt{740} = 2\sqrt{185} \approx 27.203$$

---

### Worked Example 1.9: Drone Elevation Angle and Ground Range
*Problem:* A tracking sensor at the origin $\mathbf{O} = (0, 0, 0)$ detects an airborne object at coordinates $\mathbf{p} = (300, 400, 500)$ meters, where $+x$ is East, $+y$ is North, and $+z$ is Altitude.  
1. Calculate the horizontal ground distance $r_{\text{ground}}$ from the tracker to the point directly underneath the drone.  
2. Calculate the direct 3D line-of-sight distance $R_{\text{3D}}$ to the drone.  
3. Calculate the elevation angle $\phi$ (angle above the horizontal horizon) to the drone in degrees.

*Solution:*  
1. The ground distance is the 2D Euclidean norm in the $xy$-plane:
   $$r_{\text{ground}} = \sqrt{x^2 + y^2} = \sqrt{300^2 + 400^2} = \sqrt{90000 + 160000} = \sqrt{250000} = 500\text{ m}$$
2. The 3D line-of-sight distance is:
   $$R_{\text{3D}} = \sqrt{r_{\text{ground}}^2 + z^2} = \sqrt{500^2 + 500^2} = \sqrt{250000 + 250000} = \sqrt{500000} = 500\sqrt{2} \approx 707.11\text{ m}$$
3. The elevation angle satisfies $\tan \phi = \frac{z}{r_{\text{ground}}}$:
   $$\tan \phi = \frac{500}{500} = 1 \implies \phi = \arctan(1) = 45^\circ$$

---

### Worked Example 1.10: Submarine Sonar Triangulation in 3D
*Problem:* A research vessel on the ocean surface is stationed at $(0, 0, 0)$. It deploys an underwater robotic probe that moves sequentially through three displacement vectors:  
$\mathbf{v}_1 = (50, 30, -120)$ meters,  
$\mathbf{v}_2 = (-20, 60, -80)$ meters,  
$\mathbf{v}_3 = (10, -40, -50)$ meters.  
1. Determine the final resting position of the probe.  
2. What is the total straight-line distance from the surface vessel to the probe?

*Solution:*  
1. The final position vector is the vector sum of all displacements:
   $$\mathbf{r}_{\text{final}} = \mathbf{v}_1 + \mathbf{v}_2 + \mathbf{v}_3$$
   Summing component by component:
   $$x = 50 - 20 + 10 = 40\text{ m}$$
   $$y = 30 + 60 - 40 = 50\text{ m}$$
   $$z = -120 - 80 - 50 = -250\text{ m}$$
   $$\mathbf{r}_{\text{final}} = (40, 50, -250)\text{ m}$$
2. The straight-line distance is:
   $$d = \|\mathbf{r}_{\text{final}}\| = \sqrt{40^2 + 50^2 + (-250)^2} = \sqrt{1600 + 2500 + 62500} = \sqrt{66600} \approx 258.07\text{ m}$$

---

## 1.7 Chapter Mastery Exercise Set

### Exercise 1.1 (Elementary â€” Room Corner Coordinate Mapping)
A rectangular classroom has dimensions $8\text{ m}$ (length along $x$), $6\text{ m}$ (width along $y$), and $3\text{ m}$ (height along $z$). Place the bottom-southwest corner at the origin $(0, 0, 0)$. Write down the coordinates of all 8 vertices of the room, and compute the displacement vector pointing from the origin to the diagonally opposite ceiling corner.

### Exercise 1.2 (Elementary â€” Point Distances to the Three Coordinate Planes)
A target in a flight simulator is located at $\mathbf{p} = (-7, 24, -15)$.  
(a) Find the perpendicular distance from the target to the $xy$-plane, the $xz$-plane, and the $yz$-plane.  
(b) Identify which octant (by sign pattern of $x, y, z$) contains this point.

### Exercise 1.3 (Intermediate â€” Engine Coordinate Reorientation: Unreal to OpenGL)
Unreal Engine uses a left-handed coordinate system where $+x$ is forward, $+y$ is right, and $+z$ is up. OpenGL uses a right-handed system where $+x$ is right, $+y$ is up, and $-z$ is forward. Construct the linear transformation matrix $\mathbf{M}$ that maps an Unreal position vector $(x_u, y_u, z_u)$ to an OpenGL position vector $(x_g, y_g, z_g)$. Verify that $\det(\mathbf{M}) = -1$.

### Exercise 1.4 (Intermediate â€” Cube Vertex Enumeration & Spatial Diagonals)
Consider a cube centered at the origin $\mathbf{O} = (0, 0, 0)$ with side length $2s$. Its 8 vertices are given by $(\pm s, \pm s, \pm s)$.  
(a) Write out all 4 main internal diagonals passing through the center as vectors.  
(b) Show that the length of each internal diagonal is $2s\sqrt{3}$.

### Exercise 1.5 (Intermediate â€” Spherical Radar Coordinate Translation)
A tracking radar at $(0, 0, 0)$ reports an aircraft at azimuth $\theta = 60^\circ$ (measured counterclockwise from the $+x$ axis in the $xy$-plane), elevation angle $\phi = 30^\circ$ (above the $xy$-plane), and slant range $R = 10\text{ km}$. Calculate the exact Cartesian coordinates $(x, y, z)$ of the aircraft.

### Exercise 1.6 (Advanced â€” Handedness Inversion under Householder Reflection)
Given a unit vector $\mathbf{n} = (n_x, n_y, n_z)$ with $\|\mathbf{n}\| = 1$, the Householder reflection matrix across the plane through the origin perpendicular to $\mathbf{n}$ is defined as:
$$\mathbf{H} = \mathbf{I}_3 - 2\mathbf{n}\mathbf{n}^T$$
Prove analytically that $\det(\mathbf{H}) = -1$, confirming that any planar reflection in $\mathbb{R}^3$ reverses spatial handedness.

### Exercise 1.7 (Advanced â€” Camera Frustum Spatial Bounding Box Extents)
A synthetic camera in a 3D engine is positioned at $\mathbf{c} = (0, 10, 50)$. Its viewing volume defines a near plane with corners at $(-4, 7, 45)$, $(4, 7, 45)$, $(4, 13, 45)$, and $(-4, 13, 45)$, and a far plane with corners at $(-20, -5, 5)$, $(20, -5, 5)$, $(20, 25, 5)$, and $(-20, 25, 5)$. Compute the minimum corner $\mathbf{p}_{\min}$ and maximum corner $\mathbf{p}_{\max}$ of the Axis-Aligned Bounding Box (AABB) that encloses the entire camera viewing volume.

### Exercise 1.8 (Advanced â€” Multi-Segment Drone Flight Vector Summation)
A delivery drone flies through four waypoints: starting at $\mathbf{W}_0 = (10, 20, 0)$, it travels through three legs defined by relative displacements $\mathbf{d}_1 = (30, -15, 50)$, $\mathbf{d}_2 = (-20, 45, 30)$, and $\mathbf{d}_3 = (-40, -10, -20)$.  
(a) Determine the final waypoint position $\mathbf{W}_3$.  
(b) Find the single net displacement vector from $\mathbf{W}_0$ to $\mathbf{W}_3$.  
(c) Find the total flight path length (sum of leg distances) vs. the direct straight-line distance.

### Exercise 1.9 (Master â€” Chirality & Coordinate Swap Parity Proof)
Show that swapping any two coordinate axes (for example, replacing $(x, y, z)$ with $(y, x, z)$) always inverts the handedness of a 3D coordinate system, whereas performing a cyclic permutation (replacing $(x, y, z)$ with $(y, z, x)$) preserves handedness.

### Exercise 1.10 (Master â€” Robotic Arm 3D End-Effector Spatial Mapping)
A two-link robotic arm in 3D has its base at $(0, 0, 0)$. Link 1 has length $L_1 = 4\text{ m}$ and points along vector $\mathbf{v}_1 = (0, 0, 4)$ (purely vertical). Link 2 of length $L_2 = 3\text{ m}$ rotates outward by angle $\theta = 30^\circ$ relative to the horizontal $xy$-plane and at an azimuth of $\psi = 45^\circ$ relative to the $+x$ axis. Compute the exact Cartesian position of the end-effector (tip of Link 2).

---

## 1.8 Comprehensive Solutions to Chapter Exercises

### Solution to Exercise 1.1
1. With the corner at $(0, 0, 0)$ and dimensions $L_x = 8$, $L_y = 6$, $L_z = 3$, the 8 corner vertices are:
   - Ground level ($z = 0$): $(0, 0, 0)$, $(8, 0, 0)$, $(8, 6, 0)$, $(0, 6, 0)$
   - Ceiling level ($z = 3$): $(0, 0, 3)$, $(8, 0, 3)$, $(8, 6, 3)$, $(0, 6, 3)$
2. The diagonally opposite ceiling corner is $(8, 6, 3)$.
3. The displacement vector from the origin is:
   $$\mathbf{d} = (8 - 0, \; 6 - 0, \; 3 - 0) = (8, 6, 3)\text{ m}$$
   Its length is $\|\mathbf{d}\| = \sqrt{8^2 + 6^2 + 3^2} = \sqrt{64 + 36 + 9} = \sqrt{109} \approx 10.44\text{ m}$.

---

### Solution to Exercise 1.2
1. Point $\mathbf{p} = (-7, 24, -15)$:
   - Distance to $xy$-plane ($z = 0$): $d_{xy} = |z| = |-15| = 15$
   - Distance to $xz$-plane ($y = 0$): $d_{xz} = |y| = |24| = 24$
   - Distance to $yz$-plane ($x = 0$): $d_{yz} = |x| = |-7| = 7$
2. The signs of the coordinates are $(-, +, -)$. In standard Cartesian nomenclature, this is Octant IV in the lower deck (or Octant 6 depending on indexing convention).

---

### Solution to Exercise 1.3
1. We map Unreal $(x_u, y_u, z_u)$ (where $x_u$ = forward, $y_u$ = right, $z_u$ = up) to OpenGL $(x_g, y_g, z_g)$ (where $x_g$ = right, $y_g$ = up, $z_g$ = backward $\implies -z_g$ = forward):
   - $x_g = y_u$
   - $y_g = z_u$
   - $z_g = -x_u$
2. In matrix form:
   $$\begin{bmatrix} x_g \\ y_g \\ z_g \end{bmatrix} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} x_u \\ y_u \\ z_u \end{bmatrix}$$
3. Determinant calculation:
   $$\det(\mathbf{M}) = 0 - 1 \cdot \begin{vmatrix} 0 & 1 \\ -1 & 0 \end{vmatrix} + 0 = -1 \cdot (0 - (-1)) = -1$$
   Since $\det(\mathbf{M}) = -1$, the mapping correctly converts between a left-handed system and a right-handed system.

---

### Solution to Exercise 1.4
1. The 4 pairs of diametrically opposite vertices form 4 main spatial diagonals passing through the center $(0, 0, 0)$:
   - From $(-s, -s, -s)$ to $(s, s, s) \implies \mathbf{d}_1 = (2s, 2s, 2s)$
   - From $(s, -s, -s)$ to $(-s, s, s) \implies \mathbf{d}_2 = (-2s, 2s, 2s)$
   - From $(-s, s, -s)$ to $(s, -s, s) \implies \mathbf{d}_3 = (2s, -2s, 2s)$
   - From $(-s, -s, s)$ to $(s, s, -s) \implies \mathbf{d}_4 = (2s, 2s, -2s)$
2. The length of any such diagonal vector is:
   $$\|\mathbf{d}_k\| = \sqrt{(\pm 2s)^2 + (\pm 2s)^2 + (\pm 2s)^2} = \sqrt{4s^2 + 4s^2 + 4s^2} = \sqrt{12s^2} = 2s\sqrt{3}$$
   This proves that the spatial diagonal of any cube with side $2s$ is precisely $2s\sqrt{3}$.

---

### Solution to Exercise 1.5
1. The projection of the slant range onto the horizontal ground plane is:
   $$r_{\text{ground}} = R \cos \phi = 10 \cos(30^\circ) = 10 \cdot \frac{\sqrt{3}}{2} = 5\sqrt{3} \approx 8.660\text{ km}$$
2. The height (altitude) $z$ is:
   $$z = R \sin \phi = 10 \sin(30^\circ) = 10 \cdot \frac{1}{2} = 5.0\text{ km}$$
3. The horizontal coordinates $x$ and $y$ are:
   $$x = r_{\text{ground}} \cos \theta = 5\sqrt{3} \cos(60^\circ) = 5\sqrt{3} \cdot \frac{1}{2} = 2.5\sqrt{3} \approx 4.330\text{ km}$$
   $$y = r_{\text{ground}} \sin \theta = 5\sqrt{3} \sin(60^\circ) = 5\sqrt{3} \cdot \frac{\sqrt{3}}{2} = \frac{15}{2} = 7.5\text{ km}$$
4. The exact Cartesian position is:
   $$\mathbf{p} = (2.5\sqrt{3}, \; 7.5, \; 5.0) \approx (4.330, 7.500, 5.000)\text{ km}$$

---

### Solution to Exercise 1.6
1. Choose an orthonormal basis where $\mathbf{n}$ is the first basis vector $\mathbf{u}_1 = \mathbf{n}$, and $\mathbf{u}_2, \mathbf{u}_3$ are two unit vectors mutually perpendicular to $\mathbf{n}$ and to each other.
2. Under the Householder reflection $\mathbf{H}\mathbf{x} = \mathbf{x} - 2(\mathbf{n} \cdot \mathbf{x})\mathbf{n}$:
   - For $\mathbf{u}_1 = \mathbf{n}$: $\mathbf{H}\mathbf{n} = \mathbf{n} - 2(\mathbf{n} \cdot \mathbf{n})\mathbf{n} = \mathbf{n} - 2\mathbf{n} = -\mathbf{n} = -1 \cdot \mathbf{u}_1$. Thus $\mathbf{n}$ is an eigenvector with eigenvalue $\lambda_1 = -1$.
   - For any vector $\mathbf{v} \perp \mathbf{n}$ (such as $\mathbf{u}_2, \mathbf{u}_3$): $\mathbf{n} \cdot \mathbf{v} = 0 \implies \mathbf{H}\mathbf{v} = \mathbf{v} - 2(0)\mathbf{n} = \mathbf{v}$. Thus $\mathbf{u}_2, \mathbf{u}_3$ are eigenvectors with eigenvalues $\lambda_2 = 1, \lambda_3 = 1$.
3. The determinant of any linear operator is the product of its eigenvalues:
   $$\det(\mathbf{H}) = \lambda_1 \cdot \lambda_2 \cdot \lambda_3 = (-1) \cdot (1) \cdot (1) = -1$$
   This proves rigorously that any Householder planar reflection in $\mathbb{R}^3$ reverses handedness.

---

### Solution to Exercise 1.7
1. To find the bounding box of the camera frustum, we assemble all corner vertices from both near and far planes:
   Near plane: $(-4, 7, 45)$, $(4, 7, 45)$, $(4, 13, 45)$, $(-4, 13, 45)$  
   Far plane: $(-20, -5, 5)$, $(20, -5, 5)$, $(20, 25, 5)$, $(-20, 25, 5)$  
   Camera position: $(0, 10, 50)$
2. For the minimum corner $\mathbf{p}_{\min}$:
   - $x_{\min} = \min(-4, 4, 4, -4, -20, 20, 20, -20, 0) = -20$
   - $y_{\min} = \min(7, 7, 13, 13, -5, -5, 25, 25, 10) = -5$
   - $z_{\min} = \min(45, 45, 45, 45, 5, 5, 5, 5, 50) = 5$
   $$\mathbf{p}_{\min} = (-20, -5, 5)$$
3. For the maximum corner $\mathbf{p}_{\max}$:
   - $x_{\max} = \max(-4, 4, 4, -4, -20, 20, 20, -20, 0) = 20$
   - $y_{\max} = \max(7, 7, 13, 13, -5, -5, 25, 25, 10) = 25$
   - $z_{\max} = \max(45, 45, 45, 45, 5, 5, 5, 5, 50) = 50$
   $$\mathbf{p}_{\max} = (20, 25, 50)$$
4. The enclosing AABB is defined by $\mathbf{p}_{\min} = (-20, -5, 5)$ and $\mathbf{p}_{\max} = (20, 25, 50)$, with dimensions $40 \times 30 \times 45$.

---

### Solution to Exercise 1.8
1. Start at $\mathbf{W}_0 = (10, 20, 0)$.
   - $\mathbf{W}_1 = \mathbf{W}_0 + \mathbf{d}_1 = (10+30, \; 20-15, \; 0+50) = (40, 5, 50)$
   - $\mathbf{W}_2 = \mathbf{W}_1 + \mathbf{d}_2 = (40-20, \; 5+45, \; 50+30) = (20, 50, 80)$
   - $\mathbf{W}_3 = \mathbf{W}_2 + \mathbf{d}_3 = (20-40, \; 50-10, \; 80-20) = (-20, 40, 60)$
2. The net displacement vector is:
   $$\mathbf{D}_{\text{net}} = \mathbf{d}_1 + \mathbf{d}_2 + \mathbf{d}_3 = (30-20-40, \; -15+45-10, \; 50+30-20) = (-30, 20, 60)$$
   *Check:* $\mathbf{W}_3 - \mathbf{W}_0 = (-20 - 10, \; 40 - 20, \; 60 - 0) = (-30, 20, 60)$. Matches perfectly.
3. Path lengths:
   - Direct distance:
     $$\|\mathbf{D}_{\text{net}}\| = \sqrt{(-30)^2 + 20^2 + 60^2} = \sqrt{900 + 400 + 3600} = \sqrt{4900} = 70.0\text{ m}$$
   - Sum of leg lengths:
     $$\|\mathbf{d}_1\| = \sqrt{30^2 + (-15)^2 + 50^2} = \sqrt{900 + 225 + 2500} = \sqrt{3625} \approx 60.208\text{ m}$$
     $$\|\mathbf{d}_2\| = \sqrt{(-20)^2 + 45^2 + 30^2} = \sqrt{400 + 2025 + 900} = \sqrt{3325} \approx 57.663\text{ m}$$
     $$\|\mathbf{d}_3\| = \sqrt{(-40)^2 + (-10)^2 + (-20)^2} = \sqrt{1600 + 100 + 400} = \sqrt{2100} \approx 45.826\text{ m}$$
     Total path length $= 60.208 + 57.663 + 45.826 = 163.697\text{ m}$.
   Notice that the total path distance ($163.7\text{ m}$) is significantly larger than the net straight-line distance ($70.0\text{ m}$), demonstrating the triangle inequality in 3D: $\|\sum \mathbf{d}_i\| \le \sum \|\mathbf{d}_i\|$.

---

### Solution to Exercise 1.9
1. Consider the permutation matrix representing the swap of $x$ and $y$ (i.e. $(x, y, z) \mapsto (y, x, z)$):
   $$\mathbf{P}_{\text{swap}} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   Evaluating its determinant:
   $$\det(\mathbf{P}_{\text{swap}}) = 0 - 1(1 - 0) + 0 = -1$$
   Since $\det(\mathbf{P}_{\text{swap}}) = -1$, swapping two axes introduces an odd permutation (a reflection), thereby reversing the chirality (handedness).
2. Now consider the cyclic permutation $(x, y, z) \mapsto (y, z, x)$:
   $$\mathbf{P}_{\text{cyclic}} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & 1 \\ 1 & 0 & 0 \end{bmatrix}$$
   Evaluating its determinant:
   $$\det(\mathbf{P}_{\text{cyclic}}) = 0 - 1(0 - 1) + 0 = +1$$
   Since $\det(\mathbf{P}_{\text{cyclic}}) = +1$, a cyclic permutation is an even permutation (equivalent to a $120^\circ$ rotation around the diagonal $(1, 1, 1)$), preserving the handedness of the coordinate frame.

---

### Solution to Exercise 1.10
1. Link 1 has position $\mathbf{p}_1 = \mathbf{v}_1 = (0, 0, 4)\text{ m}$.
2. Link 2 originates at $\mathbf{p}_1$. Its direction is defined by:
   - Elevation $\theta = 30^\circ$ above the horizontal.
   - Azimuth $\psi = 45^\circ$ in the $xy$-plane.
3. The displacement vector along Link 2 of length $L_2 = 3\text{ m}$ is:
   - Horizontal projection length: $r_2 = L_2 \cos \theta = 3 \cos(30^\circ) = 3 \cdot \frac{\sqrt{3}}{2} = \frac{3\sqrt{3}}{2} \approx 2.598\text{ m}$.
   - Vertical displacement: $\Delta z_2 = L_2 \sin \theta = 3 \sin(30^\circ) = 3 \cdot \frac{1}{2} = 1.5\text{ m}$.
   - $x$-displacement: $\Delta x_2 = r_2 \cos \psi = \frac{3\sqrt{3}}{2} \cos(45^\circ) = \frac{3\sqrt{3}}{2} \cdot \frac{\sqrt{2}}{2} = \frac{3\sqrt{6}}{4} \approx 1.837\text{ m}$.
   - $y$-displacement: $\Delta y_2 = r_2 \sin \psi = \frac{3\sqrt{3}}{2} \sin(45^\circ) = \frac{3\sqrt{6}}{4} \approx 1.837\text{ m}$.
   $$\mathbf{v}_2 = \left(\frac{3\sqrt{6}}{4}, \; \frac{3\sqrt{6}}{4}, \; 1.5\right)$$
4. The end-effector position is:
   $$\mathbf{p}_{\text{end}} = \mathbf{p}_1 + \mathbf{v}_2 = \left(\frac{3\sqrt{6}}{4}, \; \frac{3\sqrt{6}}{4}, \; 4 + 1.5\right) = \left(\frac{3\sqrt{6}}{4}, \; \frac{3\sqrt{6}}{4}, \; 5.5\right) \approx (1.837, \; 1.837, \; 5.500)\text{ m}$$

---

## 1.9 Chapter Summary and Bridge to Chapter 2

In this foundational chapter, we achieved the dimensional breakthrough from 2D Flatland to 3D Euclidean space:
- We established the third perpendicular axis ($z$) and formalized position vectors as ordered triplets $\mathbf{r} = (x, y, z) \in \mathbb{R}^3$.
- We resolved the universal trap of coordinate handedness, analyzing the Right-Hand Rule and the mathematical determinants separating right-handed engines (Blender, OpenGL, ROS) from left-handed engines (Unity, Unreal, DirectX).
- We explored the geometry of reflections, parity inversion, displacement vectors between arbitrary points, and bounding box metrics.
- We grounded every concept through 10 multi-step worked examples and 10 fully solved chapter mastery exercises.

With the basic anatomy of 3D points and vectors established, we now turn to the structural architecture of the space itself. In **Chapter 2: The Geometry of 3D Space â€” Coordinate Frames, Octants, and Projections**, we will explore how space divides into 8 distinct octants, how vectors project orthogonally onto coordinate sheets, and how cylindrical and spherical coordinate frames provide alternative, powerful lenses for spatial physics and simulation.

# Chapter 2: The Geometry of 3D Space â€” Coordinate Frames, Octants, and Projections

> *"Space is an ocean with three independent tides: one that carries you forward, one that shifts you sideways, and one that lifts you toward the heavens. To navigate without error, you must know in which octant your vessel sails."*  
> â€” **Sir William Rowan Hamilton, Lectures on Quaternions (1853)**

---

## 2.1 Slicing the Universe: The Three Fundamental Coordinate Planes

In two dimensions, a single linear equation with one variable missingâ€”such as $x = 0$ or $y = 0$â€”defines a one-dimensional coordinate line (the $y$-axis or $x$-axis, respectively). 

In three dimensions, setting a single coordinate to a constant value does not produce a line; it produces an entire **infinite two-dimensional plane**. 

When the three Cartesian axes $x, y, z$ intersect at the origin $\mathbf{O} = (0, 0, 0)$, they naturally pair up to define the **three fundamental coordinate planes**:

1. **The $xy$-Plane ($z = 0$):**  
   The set of all points where the vertical altitude is zero:
   $$\Pi_{xy} = \{(x, y, z) \in \mathbb{R}^3 \mid z = 0\}$$
   In architectural and physical modeling, this is commonly referred to as the "ground plane" or the "floor."

2. **The $xz$-Plane ($y = 0$):**  
   The set of all points where the depth/ordinate is zero:
   $$\Pi_{xz} = \{(x, y, z) \in \mathbb{R}^3 \mid y = 0\}$$
   In graphical side-scrolling or elevation views, this forms the vertical longitudinal elevation plane.

3. **The $yz$-Plane ($x = 0$):**  
   The set of all points where the lateral width/abscissa is zero:
   $$\Pi_{yz} = \{(x, y, z) \in \mathbb{R}^3 \mid x = 0\}$$
   In engineering drawings, this constitutes the lateral cross-sectional profile plane.

```
                         +z
                          â”‚       / yz-plane (x = 0)
                          â”‚      /
                          â”‚     /
       xz-plane (y = 0)   â”‚    /
              \           â”‚   /
               \          â”‚  /
                \         â”‚ /
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ +y
                         /â”‚
                        / â”‚          \
                       /  â”‚           \ xy-plane (z = 0)
                      /   â”‚
                     /    â”‚
                   +x
```

These three planes are mutually orthogonal:
$$\Pi_{xy} \perp \Pi_{xz}, \quad \Pi_{xz} \perp \Pi_{yz}, \quad \Pi_{yz} \perp \Pi_{xy}$$

Every pair of coordinate planes intersects along one of the three coordinate axes:
$$\Pi_{xy} \cap \Pi_{xz} = \text{the } x\text{-axis} \quad (y=0, z=0)$$
$$\Pi_{xy} \cap \Pi_{yz} = \text{the } y\text{-axis} \quad (x=0, z=0)$$
$$\Pi_{xz} \cap \Pi_{yz} = \text{the } z\text{-axis} \quad (x=0, y=0)$$

And all three planes simultaneously intersect at the unique point:
$$\Pi_{xy} \cap \Pi_{xz} \cap \Pi_{yz} = \{(0, 0, 0)\} = \mathbf{O}$$

---

## 2.2 The Eight Octants: Spatial Partitioning & Sign Signatures

Just as the two coordinate axes divide the 2D plane into four **quadrants**, the three coordinate planes slice the entire three-dimensional universe into **eight infinite compartments**, termed **octants**.

### 2.2.1 Sign Signatures and Standard Classification
Every point $\mathbf{p} = (x, y, z)$ that does not lie directly on any coordinate plane belongs to exactly one octant, governed by the sign triplet of its coordinates: $(\text{sgn}(x), \text{sgn}(y), \text{sgn}(z))$.

| Octant | Sign of $x$ | Sign of $y$ | Sign of $z$ | Deck | Standard Geometric Description | Binary Code ($z, y, x$) |
| :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **I** | $+$ | $+$ | $+$ | Upper | All positive (First octant) | `111` ($7$) |
| **II** | $-$ | $+$ | $+$ | Upper | Negative $x$, positive $y$ and $z$ | `110` ($6$) |
| **III** | $-$ | $-$ | $+$ | Upper | Negative $x$ and $y$, positive $z$ | `100` ($4$) |
| **IV** | $+$ | $-$ | $+$ | Upper | Positive $x$ and $z$, negative $y$ | `101` ($5$) |
| **V** | $+$ | $+$ | $-$ | Lower | Positive $x$ and $y$, negative $z$ | `011` ($3$) |
| **VI** | $-$ | $+$ | $-$ | Lower | Negative $x$ and $z$, positive $y$ | `010` ($2$) |
| **VII** | $-$ | $-$ | $-$ | Lower | All negative (Seventh octant) | `000` ($0$) |
| **VIII**| $+$ | $-$ | $-$ | Lower | Positive $x$, negative $y$ and $z$ | `001` ($1$) |

> [!NOTE]
> The numbering of Octants I through IV mirrors the familiar quadrants of the 2D $xy$-plane on the upper deck ($z > 0$). Octants V through VIII mirror those same quadrants directly beneath them on the lower deck ($z < 0$).

### 2.2.2 Algorithmic Significance: The Octree
In modern 3D game engines, spatial physics simulators, and raytracing acceleration structures, the division of space into eight sub-volumes is the computational basis of the **Octree**. 

By evaluating three binary threshold tests:
$$b_x = (x \ge x_{\text{center}}) ? 1 : 0$$
$$b_y = (y \ge y_{\text{center}}) ? 1 : 0$$
$$b_z = (z \ge z_{\text{center}}) ? 1 : 0$$

An engine computes an index from $0$ to $7$ via bitwise packing:
$$\text{child\_index} = (b_z \ll 2) \mid (b_y \ll 1) \mid b_x$$

This allows a 3D engine to discard seven-eighths ($87.5\%$) of the physical universe in a single branching operation when querying for potential collision pairs or visible geometry!

---

## 2.3 Orthogonal Projections onto Planes and Lines

Projection is the mathematical process of casting a shadow. In three-dimensional space, we frequently need to isolate how a 3D trajectory or force behaves along a specific plane or axis.

```
                         p = (x, y, z)
                          *
                         /â”‚\
                        / â”‚ \
                       /  â”‚  \
                      /   â”‚   \
                     /    â”‚    \
                    /     â”‚     \
                   *      â”‚      *
              p_xz =      â”‚    p_yz = (0, y, z)
              (x, 0, z)   â”‚
                          * p_xy = (x, y, 0)
```

### 2.3.1 Orthogonal Projection onto Coordinate Planes
The orthogonal projection of an arbitrary point $\mathbf{p} = (x, y, z)$ onto a coordinate plane is obtained by setting the coordinate perpendicular to that plane to zero:

- **Projection onto $xy$-plane ($z = 0$):**
  $$\mathcal{P}_{xy}(\mathbf{p}) = (x, y, 0)$$
  Matrix operator:
  $$\mathbf{P}_{xy} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$

- **Projection onto $xz$-plane ($y = 0$):**
  $$\mathcal{P}_{xz}(\mathbf{p}) = (x, 0, z)$$
  Matrix operator:
  $$\mathbf{P}_{xz} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

- **Projection onto $yz$-plane ($x = 0$):**
  $$\mathcal{P}_{yz}(\mathbf{p}) = (0, y, z)$$
  Matrix operator:
  $$\mathbf{P}_{yz} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$

Notice an essential linear algebra property of projection operators: they are **idempotent**, meaning projecting twice changes nothing:
$$\mathbf{P}_{xy}^2 = \mathbf{P}_{xy} \mathbf{P}_{xy} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 0 \end{bmatrix} = \mathbf{P}_{xy}$$

Furthermore, notice that $\det(\mathbf{P}_{xy}) = 0$. A projection collapses a 3D volume into a 2D sheet, irreversibly discarding dimensional information. You cannot invert a projection!

### 2.3.2 Orthogonal Projection onto Coordinate Axes
Similarly, projecting a point $\mathbf{p} = (x, y, z)$ onto any single coordinate axis isolates that axis's coordinate while nullifying the other two:
- Onto the $x$-axis: $\mathcal{P}_x(\mathbf{p}) = (x, 0, 0)$
- Onto the $y$-axis: $\mathcal{P}_y(\mathbf{p}) = (0, y, 0)$
- Onto the $z$-axis: $\mathcal{P}_z(\mathbf{p}) = (0, 0, z)$

The original position vector is the exact vector sum of its three axial projections:
$$\mathbf{p} = \mathcal{P}_x(\mathbf{p}) + \mathcal{P}_y(\mathbf{p}) + \mathcal{P}_z(\mathbf{p}) = (x, 0, 0) + (0, y, 0) + (0, 0, z)$$

---

## 2.4 The Coordinate Bridge: Cylindrical & Spherical Representations

Cartesian coordinates $(x, y, z)$ are ideal for rectilinear environments (grids, rooms, voxel worlds, bounding boxes). However, when dealing with rotational symmetry (propellers, wheels, planetary orbits, robotic arm turrets, radar beacons), Cartesian coordinates lead to cumbersome trigonometry.

Two curvilinear systems provide natural mathematical coordinate bridges.

```
       Cylindrical Coordinates                     Spherical Coordinates
       
                 +z                                         +z
                  â”‚                                          â”‚      * p = (r, theta, phi)
                  â”‚      * p = (r, theta, z)                 â”‚     /
                  â”‚     /â”‚                                   â”‚    /
                  â”‚    / â”‚ z                                 â”‚phi/ rho
                  â”‚ r /  â”‚                                   â”‚  /
                  â”‚  /   â”‚                                   â”‚ /
                  â””â”€â”€â”¼â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€ +y                        â””â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ +y
                 /   \   â”‚                                  /  /
                / theta\ â”‚                                 /  /
               /â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ (r, theta, 0)                  /  / theta
              /                                          /â”€â”€â”˜
            +x                                         +x
```

### 2.4.1 Cylindrical Coordinate System $(r, \theta, z)$
Cylindrical coordinates replace the planar $(x, y)$ coordinates with 2D polar coordinates $(r, \theta)$, while keeping the Cartesian altitude coordinate $z$ intact:
- $r \ge 0$: Radial distance from the $z$-axis to the point.
- $\theta \in [0, 2\pi)$ or $(-\pi, \pi]$: Azimuthal angle in the $xy$-plane measured counterclockwise from the $+x$-axis.
- $z \in \mathbb{R}$: Signed vertical height above the $xy$-plane.

#### Forward Transformation (Cylindrical $\to$ Cartesian):
$$x = r \cos \theta$$
$$y = r \sin \theta$$
$$z = z$$

#### Inverse Transformation (Cartesian $\to$ Cylindrical):
$$r = \sqrt{x^2 + y^2}$$
$$\theta = \text{atan2}(y, x)$$
$$z = z$$

#### Volume Element (Jacobian):
When integrating over cylindrical volumes, an infinitesimal box has dimensions $dr$ by $r\,d\theta$ by $dz$:
$$dV = r \, dr \, d\theta \, dz$$

---

### 2.4.2 Spherical Coordinate System $(\rho, \theta, \phi)$
Spherical coordinates are tailored for radial phenomena centered around a focal point (such as gravity fields, camera Look-At rotations, celestial astronomy, and omnidirectional radiation).

> [!IMPORTANT]
> **Notation Warning:** Mathematics and physics occasionally invert the symbols for the angles. In the ISO 80000-2 standard (and graphics/physics engine convention followed here):
> - $\rho$ or $r \ge 0$: Radius (straight-line distance from the origin to the point).
> - $\phi \in [0, \pi]$: **Colatitude / Polar angle / Zenith angle**, measured down from the positive $+z$-axis ($\phi = 0$ is North Pole, $\phi = \frac{\pi}{2}$ is equator, $\phi = \pi$ is South Pole).
> - $\theta \in [0, 2\pi)$: **Azimuthal angle**, measured in the $xy$-plane from the $+x$-axis toward $+y$.

#### Forward Transformation (Spherical $\to$ Cartesian):
Looking at the geometry:
- The projection onto the $xy$-plane has length $r = \rho \sin \phi$.
- The altitude along the $z$-axis is $z = \rho \cos \phi$.

Therefore:
$$x = \rho \sin \phi \cos \theta$$
$$y = \rho \sin \phi \sin \theta$$
$$z = \rho \cos \phi$$

#### Inverse Transformation (Cartesian $\to$ Spherical):
$$\rho = \sqrt{x^2 + y^2 + z^2}$$
$$\phi = \arccos\left(\frac{z}{\rho}\right) = \arctan\left(\frac{\sqrt{x^2 + y^2}}{z}\right)$$
$$\theta = \text{atan2}(y, x)$$

#### Volume Element (Jacobian):
$$dV = \rho^2 \sin \phi \, d\rho \, d\phi \, d\theta$$

---

## 2.5 Worked Examples: 3D Coordinate Geometry & Projections

### Worked Example 2.1: Octant Identification and Sign Signatures
*Problem:* Classify each of the following 4 spatial points into its proper Octant (I through VIII) and compute its binary code index $((z>0) \ll 2 \mid (y>0) \ll 1 \mid (x>0))$:
1. $\mathbf{A} = (15, 22, 10)$
2. $\mathbf{B} = (-4, 18, 5)$
3. $\mathbf{C} = (8, -12, -25)$
4. $\mathbf{D} = (-10, -5, -30)$

*Solution:*  
1. For $\mathbf{A} = (15, 22, 10)$:  
   Signs: $(+, +, +)$. Upper deck ($z > 0$).  
   Octant: **Octant I**.  
   Binary index: $b_z=1, b_y=1, b_x=1 \implies (1 \ll 2) \mid (1 \ll 1) \mid 1 = 4 + 2 + 1 = 7$.
2. For $\mathbf{B} = (-4, 18, 5)$:  
   Signs: $(-, +, +)$. Upper deck ($z > 0$).  
   Octant: **Octant II**.  
   Binary index: $b_z=1, b_y=1, b_x=0 \implies 4 + 2 + 0 = 6$.
3. For $\mathbf{C} = (8, -12, -25)$:  
   Signs: $(+, -, -)$. Lower deck ($z < 0$).  
   Octant: **Octant VIII**.  
   Binary index: $b_z=0, b_y=0, b_x=1 \implies 0 + 0 + 1 = 1$.
4. For $\mathbf{D} = (-10, -5, -30)$:  
   Signs: $(-, -, -)$. Lower deck ($z < 0$).  
   Octant: **Octant VII**.  
   Binary index: $b_z=0, b_y=0, b_x=0 \implies 0 + 0 + 0 = 0$.

---

### Worked Example 2.2: Orthogonal Projection of a 3D Triangle onto Coordinate Planes
*Problem:* A polygonal triangle in 3D has vertices at:  
$\mathbf{V}_1 = (2, 3, 6)$, $\mathbf{V}_2 = (8, 5, 2)$, $\mathbf{V}_3 = (4, 9, 4)$.  
1. Find the coordinates of the projected triangle on the $xy$-plane ($\Pi_{xy}$).  
2. Find the coordinates of the projected triangle on the $xz$-plane ($\Pi_{xz}$).  
3. Find the coordinates of the projected triangle on the $yz$-plane ($\Pi_{yz}$).

*Solution:*  
1. For projection onto the $xy$-plane, set $z = 0$:
   $$\mathbf{V}'_{1, xy} = (2, 3, 0), \quad \mathbf{V}'_{2, xy} = (8, 5, 0), \quad \mathbf{V}'_{3, xy} = (4, 9, 0)$$
2. For projection onto the $xz$-plane, set $y = 0$:
   $$\mathbf{V}'_{1, xz} = (2, 0, 6), \quad \mathbf{V}'_{2, xz} = (8, 0, 2), \quad \mathbf{V}'_{3, xz} = (4, 0, 4)$$
3. For projection onto the $yz$-plane, set $x = 0$:
   $$\mathbf{V}'_{1, yz} = (0, 3, 6), \quad \mathbf{V}'_{2, yz} = (0, 5, 2), \quad \mathbf{V}'_{3, yz} = (0, 9, 4)$$

---

### Worked Example 2.3: Distance from an Off-Axis Point to Planes and Diagonals
*Problem:* A point in a physics collision world is located at $\mathbf{p} = (6, -8, 24)$.  
1. Compute the perpendicular distance from $\mathbf{p}$ to the coordinate planes $xy$, $xz$, and $yz$.  
2. Compute the perpendicular distance from $\mathbf{p}$ to the $z$-axis.  
3. Compute the full 3D distance from $\mathbf{p}$ to the origin $\mathbf{O} = (0, 0, 0)$.

*Solution:*  
1. Distances to planes:
   - Distance to $xy$-plane ($z = 0$): $d_{xy} = |z| = |24| = 24$
   - Distance to $xz$-plane ($y = 0$): $d_{xz} = |y| = |-8| = 8$
   - Distance to $yz$-plane ($x = 0$): $d_{yz} = |x| = |6| = 6$
2. The closest point on the $z$-axis is $(0, 0, 24)$. The perpendicular distance to the $z$-axis is:
   $$d_z = \sqrt{x^2 + y^2} = \sqrt{6^2 + (-8)^2} = \sqrt{36 + 64} = \sqrt{100} = 10$$
3. The full 3D distance to the origin is:
   $$\|\mathbf{p}\| = \sqrt{x^2 + y^2 + z^2} = \sqrt{10^2 + 24^2} = \sqrt{100 + 576} = \sqrt{676} = 26$$
   *Verification:* Notice the Pythagorean triples in action: $(6, 8, 10)$ and $(10, 24, 26)$.

---

### Worked Example 2.4: Transforming a Trajectory to Cylindrical Coordinates
*Problem:* A particle moves along a spiral trajectory defined in Cartesian coordinates by:
$$\mathbf{r}(t) = (4 \cos(3t), \; 4 \sin(3t), \; 2t)$$
for $t \ge 0$.  
1. Convert this trajectory into cylindrical coordinates $(r(t), \theta(t), z(t))$.  
2. Calculate the position in cylindrical coordinates at time $t = \frac{\pi}{6}$ seconds.

*Solution:*  
1. Using the inverse formulas:
   $$r(t) = \sqrt{x(t)^2 + y(t)^2} = \sqrt{(4\cos(3t))^2 + (4\sin(3t))^2} = \sqrt{16(\cos^2(3t) + \sin^2(3t))} = \sqrt{16} = 4$$
   $$\theta(t) = \text{atan2}(y(t), x(t)) = \text{atan2}(4\sin(3t), 4\cos(3t)) = 3t \pmod{2\pi}$$
   $$z(t) = 2t$$
   Thus, in cylindrical coordinates:
   $$(r(t), \theta(t), z(t)) = (4, \; 3t, \; 2t)$$
   *Physical interpretation:* The particle executes uniform circular motion of constant radius $r = 4$ while climbing vertically at a constant speed of $2\text{ m/s}$.
2. At $t = \frac{\pi}{6}$:
   $$r = 4$$
   $$\theta = 3\left(\frac{\pi}{6}\right) = \frac{\pi}{2}\text{ radians } (90^\circ)$$
   $$z = 2\left(\frac{\pi}{6}\right) = \frac{\pi}{3} \approx 1.047$$
   $$(r, \theta, z) = \left(4, \; \frac{\pi}{2}, \; \frac{\pi}{3}\right)$$

---

### Worked Example 2.5: Spherical Coordinate Position of a Geosynchronous Satellite
*Problem:* A satellite is located in spherical coordinates at:  
$\rho = 42,164\text{ km}$ (geostationary orbital radius),  
$\phi = \frac{\pi}{3} = 60^\circ$ (colatitude),  
$\theta = \frac{\pi}{4} = 45^\circ$ (azimuthal longitude).  
Compute its exact Cartesian coordinates $(x, y, z)$.

*Solution:*  
Using the forward spherical transformations:
1. First, find horizontal radius:
   $$r_{\text{horiz}} = \rho \sin \phi = 42164 \cdot \sin(60^\circ) = 42164 \cdot \frac{\sqrt{3}}{2} \approx 36515.11\text{ km}$$
2. Component $x$:
   $$x = r_{\text{horiz}} \cos \theta = 36515.11 \cdot \cos(45^\circ) = 36515.11 \cdot \frac{\sqrt{2}}{2} \approx 25820.08\text{ km}$$
3. Component $y$:
   $$y = r_{\text{horiz}} \sin \theta = 36515.11 \cdot \sin(45^\circ) = 36515.11 \cdot \frac{\sqrt{2}}{2} \approx 25820.08\text{ km}$$
4. Component $z$:
   $$z = \rho \cos \phi = 42164 \cdot \cos(60^\circ) = 42164 \cdot \frac{1}{2} = 21082.00\text{ km}$$
Thus:
$$\mathbf{p} = (25820.08, \; 25820.08, \; 21082.00)\text{ km}$$

---

### Worked Example 2.6: Inverse Spherical Mapping with Four-Quadrant `atan2`
*Problem:* Convert the Cartesian position $\mathbf{p} = (-6, -6, 6\sqrt{6})$ into spherical coordinates $(\rho, \theta, \phi)$.

*Solution:*  
1. Compute radius $\rho$:
   $$\rho = \sqrt{x^2 + y^2 + z^2} = \sqrt{(-6)^2 + (-6)^2 + (6\sqrt{6})^2} = \sqrt{36 + 36 + 216} = \sqrt{288} = 12\sqrt{2} \approx 16.97$$
2. Compute colatitude $\phi$:
   $$\cos \phi = \frac{z}{\rho} = \frac{6\sqrt{6}}{12\sqrt{2}} = \frac{\sqrt{3}}{2} \implies \phi = \arccos\left(\frac{\sqrt{3}}{2}\right) = \frac{\pi}{6} = 30^\circ$$
3. Compute azimuth $\theta$:
   Notice that both $x < 0$ and $y < 0$ (Quadrant III in the $xy$-plane).
   $$\theta = \text{atan2}(y, x) = \text{atan2}(-6, -6) = -\frac{3\pi}{4}\text{ rad } (-135^\circ) \equiv \frac{5\pi}{4}\text{ rad } (225^\circ)$$
Thus:
$$(\rho, \theta, \phi) = \left(12\sqrt{2}, \; \frac{5\pi}{4}, \; \frac{\pi}{6}\right)$$

---

### Worked Example 2.7: Bounding Octree Node Assignment
*Problem:* An octree bounding cube extends from $\mathbf{p}_{\min} = (-100, -100, -100)$ to $\mathbf{p}_{\max} = (100, 100, 100)$ with center at $\mathbf{c} = (0, 0, 0)$. A physics particle is located at $\mathbf{p} = (-14, 52, -88)$. Determine the child node index (from $0$ to $7$) that contains this particle.

*Solution:*  
Evaluate the threshold conditions relative to the center $\mathbf{c} = (0, 0, 0)$:
- $x = -14 < 0 \implies b_x = 0$
- $y = 52 \ge 0 \implies b_y = 1$
- $z = -88 < 0 \implies b_z = 0$

Assemble the child bitmask:
$$\text{node\_index} = (b_z \ll 2) \mid (b_y \ll 1) \mid b_x = (0 \ll 2) \mid (1 \ll 1) \mid 0 = 0 + 2 + 0 = 2$$
The particle resides in child node $2$ (which corresponds to Octant VI).

---

### Worked Example 2.8: Shadow Area of an Inclined Polygonal Triangle
*Problem:* A flat triangular solar collector has vertices at $\mathbf{A} = (0, 0, 5)$, $\mathbf{B} = (6, 0, 8)$, and $\mathbf{C} = (0, 4, 7)$ meters. Find the area of the shadow cast by this collector onto the horizontal ground plane ($xy$-plane, $z = 0$) under directly overhead vertical sunlight.

*Solution:*  
1. Direct overhead sunlight projects points orthogonally onto the $xy$-plane by setting $z = 0$:
   $$\mathbf{A}' = (0, 0, 0), \quad \mathbf{B}' = (6, 0, 0), \quad \mathbf{C}' = (0, 4, 0)$$
2. In the $xy$-plane, the vertices are $\mathbf{A}' = (0, 0)$, $\mathbf{B}' = (6, 0)$, $\mathbf{C}' = (0, 4)$.
3. This is a right-angled triangle with base along the $x$-axis of length $6\text{ m}$ and altitude along the $y$-axis of length $4\text{ m}$.
4. The shadow area is:
   $$\text{Area}_{\text{shadow}} = \frac{1}{2} \cdot \text{base} \cdot \text{height} = \frac{1}{2} \cdot 6 \cdot 4 = 12\text{ m}^2$$

---

### Worked Example 2.9: Cylindrical Helix Velocity Vector
*Problem:* An amusement park ride carries passengers along a cylindrical helix:
$$\mathbf{r}(t) = (R \cos(\omega t), \; R \sin(\omega t), \; c t)$$
with $R = 5\text{ m}$, $\omega = 2\text{ rad/s}$, and $c = 3\text{ m/s}$.  
1. Differentiate $\mathbf{r}(t)$ with respect to time to obtain the velocity vector $\mathbf{v}(t)$.  
2. Compute the constant speed $\|\mathbf{v}(t)\|$ of the passengers.

*Solution:*  
1. Differentiating component-wise:
   $$v_x(t) = \frac{d}{dt}(5\cos(2t)) = -10\sin(2t)$$
   $$v_y(t) = \frac{d}{dt}(5\sin(2t)) = 10\cos(2t)$$
   $$v_z(t) = \frac{d}{dt}(3t) = 3$$
   $$\mathbf{v}(t) = (-10\sin(2t), \; 10\cos(2t), \; 3)\text{ m/s}$$
2. The speed is the magnitude of the velocity vector:
   $$\|\mathbf{v}(t)\| = \sqrt{(-10\sin(2t))^2 + (10\cos(2t))^2 + 3^2} = \sqrt{100(\sin^2(2t) + \cos^2(2t)) + 9} = \sqrt{100 + 9} = \sqrt{109} \approx 10.44\text{ m/s}$$
   *Notice:* Although the position changes continuously in 3D, the passenger speed is completely invariant over time!

---

### Worked Example 2.10: Great-Circle Separation on a Sphere
*Problem:* Two tracking beacons are situated on a spherical dome of radius $R = 50\text{ m}$. In spherical coordinates:  
Beacon 1: $\phi_1 = \frac{\pi}{2} = 90^\circ$, $\theta_1 = 0^\circ$  
Beacon 2: $\phi_2 = \frac{\pi}{3} = 60^\circ$, $\theta_2 = 90^\circ$  
1. Convert both beacons to Cartesian coordinates.  
2. Compute the straight-line tunnel distance through the sphere between the beacons.

*Solution:*  
1. Cartesian coordinates:
   - For Beacon 1 ($\phi_1 = 90^\circ, \theta_1 = 0^\circ$):
     $$x_1 = 50 \sin(90^\circ)\cos(0^\circ) = 50(1)(1) = 50$$
     $$y_1 = 50 \sin(90^\circ)\sin(0^\circ) = 50(1)(0) = 0$$
     $$z_1 = 50 \cos(90^\circ) = 0$$
     $$\mathbf{p}_1 = (50, 0, 0)$$
   - For Beacon 2 ($\phi_2 = 60^\circ, \theta_2 = 90^\circ$):
     $$x_2 = 50 \sin(60^\circ)\cos(90^\circ) = 50\left(\frac{\sqrt{3}}{2}\right)(0) = 0$$
     $$y_2 = 50 \sin(60^\circ)\sin(90^\circ) = 50\left(\frac{\sqrt{3}}{2}\right)(1) = 25\sqrt{3} \approx 43.30$$
     $$z_2 = 50 \cos(60^\circ) = 50\left(\frac{1}{2}\right) = 25$$
     $$\mathbf{p}_2 = (0, 25\sqrt{3}, 25)$$
2. The straight-line tunnel distance is:
   $$d = \|\mathbf{p}_2 - \mathbf{p}_1\| = \sqrt{(0 - 50)^2 + (25\sqrt{3} - 0)^2 + (25 - 0)^2} = \sqrt{2500 + 1875 + 625} = \sqrt{5000} = 50\sqrt{2} \approx 70.71\text{ m}$$

---

## 2.6 Chapter Mastery Exercise Set

### Exercise 2.1 (Elementary â€” Octant Classification of 8 Test Points)
Classify each of the following points into its proper Octant (I through VIII):  
(a) $(1, 2, 3)$, (b) $(-3, 4, 1)$, (c) $(-5, -2, 8)$, (d) $(4, -7, 2)$,  
(e) $(9, 1, -6)$, (f) $(-2, 8, -4)$, (g) $(-1, -1, -1)$, (h) $(5, -3, -9)$.

### Exercise 2.2 (Elementary â€” Orthographic Projection Coordinates)
A spatial point $\mathbf{p} = (-12, 18, 30)$ is projected orthogonally:  
(a) Onto the $xy$-plane.  
(b) Onto the $xz$-plane.  
(c) Onto the $yz$-plane.  
(d) Onto the $y$-axis.  
State the coordinates of each resulting point.

### Exercise 2.3 (Intermediate â€” Cylindrical to Cartesian Transformation)
A radar station reports a drone at cylindrical coordinates $r = 200\text{ m}$, $\theta = 150^\circ$, $z = 75\text{ m}$. Compute the exact Cartesian coordinates $(x, y, z)$ in meters.

### Exercise 2.4 (Intermediate â€” Cartesian to Spherical Transformation with `atan2`)
A target is located at Cartesian coordinates $\mathbf{p} = (0, -4, 4\sqrt{3})$. Compute its spherical coordinates $(\rho, \theta, \phi)$ with $\theta \in (-\pi, \pi]$ and $\phi \in [0, \pi]$.

### Exercise 2.5 (Intermediate â€” Orthogonal Projection Area of a Rectangle)
A flat rectangular signboard in 3D has corners at $(0, 0, 0)$, $(4, 0, 3)$, $(4, 5, 3)$, and $(0, 5, 0)$.  
(a) Find the true 3D area of the signboard.  
(b) Find the area of its orthogonal shadow on the $xy$-plane.

### Exercise 2.6 (Advanced â€” Octree Spatial Hash Key Generation)
A physics engine defines a localized octree around an origin with half-width $W = 64$. Given a point $\mathbf{p} = (-22.5, 41.0, -12.0)$, write the mathematical expressions for:  
(a) Normalizing the point to the unit cube $[0, 1]^3$.  
(b) Determining the depth-1 child index ($0$ to $7$).  
(c) Determining the depth-2 grandchild sub-octant index.

### Exercise 2.7 (Advanced â€” Volumetric Jacobian Derivation for Cylindrical Coordinates)
Show by computing the determinant of the Jacobian matrix:
$$\mathbf{J} = \begin{bmatrix} \frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} & \frac{\partial x}{\partial z} \\ \frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta} & \frac{\partial y}{\partial z} \\ \frac{\partial z}{\partial r} & \frac{\partial z}{\partial \theta} & \frac{\partial z}{\partial z} \end{bmatrix}$$
that the cylindrical volume element is $dV = r \, dr \, d\theta \, dz$.

### Exercise 2.8 (Advanced â€” Spherical Coordinate Singularity at the Poles)
Explain mathematically why spherical coordinates possess a coordinate singularity (gimbal lock equivalent) at $\phi = 0$ (the North Pole) and $\phi = \pi$ (the South Pole), and what happens to the azimuthal angle $\theta$ at these points.

### Exercise 2.9 (Master â€” Orthographic Projection Matrix & Shadow Deformation)
Let sunlight fall along the direction $\mathbf{L} = (1, 1, -2)$. Find the oblique parallel shadow cast by the point $\mathbf{p} = (4, 6, 10)$ onto the ground plane $z = 0$.

### Exercise 2.10 (Master â€” Spatial Trajectory under Rotating Cylindrical Reference Frame)
A particle moves in a rotating centrifuge such that its cylindrical coordinates are $r(t) = 2 + t$, $\theta(t) = \omega t$, $z(t) = t^2$. Write its Cartesian position $\mathbf{r}(t)$ and derive the velocity vector $\mathbf{v}(t) = \dot{\mathbf{r}}(t)$ in Cartesian components.

---

## 2.7 Comprehensive Solutions to Chapter Exercises

### Solution to Exercise 2.1
Classifying by sign signatures:
- (a) $(1, 2, 3) \implies (+, +, +) \implies$ **Octant I**
- (b) $(-3, 4, 1) \implies (-, +, +) \implies$ **Octant II**
- (c) $(-5, -2, 8) \implies (-, -, +) \implies$ **Octant III**
- (d) $(4, -7, 2) \implies (+, -, +) \implies$ **Octant IV**
- (e) $(9, 1, -6) \implies (+, +, -) \implies$ **Octant V**
- (f) $(-2, 8, -4) \implies (-, +, -) \implies$ **Octant VI**
- (g) $(-1, -1, -1) \implies (-, -, -) \implies$ **Octant VII**
- (h) $(5, -3, -9) \implies (+, -, -) \implies$ **Octant VIII**

---

### Solution to Exercise 2.2
For point $\mathbf{p} = (-12, 18, 30)$:
- (a) $xy$-plane ($z=0$): $\mathcal{P}_{xy}(\mathbf{p}) = (-12, 18, 0)$
- (b) $xz$-plane ($y=0$): $\mathcal{P}_{xz}(\mathbf{p}) = (-12, 0, 30)$
- (c) $yz$-plane ($x=0$): $\mathcal{P}_{yz}(\mathbf{p}) = (0, 18, 30)$
- (d) $y$-axis ($x=0, z=0$): $\mathcal{P}_y(\mathbf{p}) = (0, 18, 0)$

---

### Solution to Exercise 2.3
Given $r = 200\text{ m}$, $\theta = 150^\circ$, $z = 75\text{ m}$:
$$x = r \cos \theta = 200 \cos(150^\circ) = 200 \left(-\frac{\sqrt{3}}{2}\right) = -100\sqrt{3} \approx -173.205\text{ m}$$
$$y = r \sin \theta = 200 \sin(150^\circ) = 200 \left(\frac{1}{2}\right) = 100\text{ m}$$
$$z = 75\text{ m}$$
Thus, $\mathbf{p} = (-100\sqrt{3}, \; 100, \; 75) \approx (-173.205, \; 100.000, \; 75.000)\text{ m}$.

---

### Solution to Exercise 2.4
Given $\mathbf{p} = (0, -4, 4\sqrt{3})$:
1. Radius $\rho$:
   $$\rho = \sqrt{0^2 + (-4)^2 + (4\sqrt{3})^2} = \sqrt{0 + 16 + 48} = \sqrt{64} = 8$$
2. Colatitude $\phi$:
   $$\cos \phi = \frac{z}{\rho} = \frac{4\sqrt{3}}{8} = \frac{\sqrt{3}}{2} \implies \phi = \frac{\pi}{6} = 30^\circ$$
3. Azimuth $\theta$:
   Since $x = 0$ and $y = -4 < 0$:
   $$\theta = \text{atan2}(-4, 0) = -\frac{\pi}{2} = -90^\circ$$
Thus, in spherical coordinates: $(\rho, \theta, \phi) = \left(8, \; -\frac{\pi}{2}, \; \frac{\pi}{6}\right)$.

---

### Solution to Exercise 2.5
1. The rectangle has edge vectors:
   $$\mathbf{e}_1 = (4, 0, 3) - (0, 0, 0) = (4, 0, 3)$$
   $$\mathbf{e}_2 = (0, 5, 0) - (0, 0, 0) = (0, 5, 0)$$
   Length of $\mathbf{e}_1$: $\|\mathbf{e}_1\| = \sqrt{4^2 + 0^2 + 3^2} = \sqrt{25} = 5$.  
   Length of $\mathbf{e}_2$: $\|\mathbf{e}_2\| = \sqrt{0^2 + 5^2 + 0^2} = 5$.  
   Since $\mathbf{e}_1 \cdot \mathbf{e}_2 = (4)(0) + (0)(5) + (3)(0) = 0$, they are perpendicular.  
   True 3D Area $= \|\mathbf{e}_1\| \cdot \|\mathbf{e}_2\| = 5 \cdot 5 = 25\text{ units}^2$.
2. Projected onto the $xy$-plane ($z = 0$):
   $$\mathbf{e}'_1 = (4, 0, 0), \quad \mathbf{e}'_2 = (0, 5, 0)$$
   The projected shape is a flat 2D rectangle in the $xy$-plane with sides of length $4$ and $5$.  
   Shadow Area $= 4 \cdot 5 = 20\text{ units}^2$.

---

### Solution to Exercise 2.6
1. For bounding cube $[-64, 64]^3$, normalized coordinates in $[0, 1]^3$ are:
   $$u_x = \frac{x - (-64)}{128} = \frac{-22.5 + 64}{128} = \frac{41.5}{128} \approx 0.3242$$
   $$u_y = \frac{y - (-64)}{128} = \frac{41.0 + 64}{128} = \frac{105.0}{128} \approx 0.8203$$
   $$u_z = \frac{z - (-64)}{128} = \frac{-12.0 + 64}{128} = \frac{52.0}{128} \approx 0.40625$$
2. Depth-1 child index:
   Comparing against center $0.5$:
   $b_x = (0.3242 \ge 0.5) ? 1 : 0 = 0$  
   $b_y = (0.8203 \ge 0.5) ? 1 : 0 = 1$  
   $b_z = (0.40625 \ge 0.5) ? 1 : 0 = 0$  
   $$\text{child}_1 = (0 \ll 2) \mid (1 \ll 1) \mid 0 = 2$$
3. Depth-2 grandchild index:
   Within the sub-quadrant, check against quarter boundaries ($0.25$ or $0.75$):
   - $u_x = 0.3242 \ge 0.25 \implies g_x = 1$
   - $u_y = 0.8203 \ge 0.75 \implies g_y = 1$
   - $u_z = 0.40625 \ge 0.25 \implies g_z = 1$  
   $$\text{child}_2 = (g_z \ll 2) \mid (g_y \ll 1) \mid g_x = (1 \ll 2) \mid (1 \ll 1) \mid 1 = 7$$

---

### Solution to Exercise 2.7
1. The forward transformation equations are $x = r \cos \theta$, $y = r \sin \theta$, $z = z$.
2. Compute the partial derivatives:
   $$\frac{\partial x}{\partial r} = \cos \theta, \quad \frac{\partial x}{\partial \theta} = -r \sin \theta, \quad \frac{\partial x}{\partial z} = 0$$
   $$\frac{\partial y}{\partial r} = \sin \theta, \quad \frac{\partial y}{\partial \theta} = r \cos \theta, \quad \frac{\partial y}{\partial z} = 0$$
   $$\frac{\partial z}{\partial r} = 0, \quad \frac{\partial z}{\partial \theta} = 0, \quad \frac{\partial z}{\partial z} = 1$$
3. The Jacobian determinant is:
   $$\det(\mathbf{J}) = \begin{vmatrix} \cos \theta & -r \sin \theta & 0 \\ \sin \theta & r \cos \theta & 0 \\ 0 & 0 & 1 \end{vmatrix} = 1 \cdot (\cos \theta(r \cos \theta) - (-r \sin \theta)(\sin \theta)) = r(\cos^2\theta + \sin^2\theta) = r$$
4. Therefore, the volume element is $dV = |\det(\mathbf{J})| \, dr \, d\theta \, dz = r \, dr \, d\theta \, dz$.

---

### Solution to Exercise 2.8
1. At $\phi = 0$ (the North Pole), $z = \rho \cos(0) = \rho$.
2. The horizontal components become:
   $$x = \rho \sin(0) \cos \theta = 0$$
   $$y = \rho \sin(0) \sin \theta = 0$$
3. For any value of $\theta \in [0, 2\pi)$, the resulting Cartesian point is identically $(0, 0, \rho)$. 
4. Thus, at the poles, the mapping from Cartesian to spherical coordinates is not one-to-one: $\theta$ is completely indeterminate (undefined). This coordinate breakdown is the exact spatial analogue of Gimbal Lock in rotation kinematics.

---

### Solution to Exercise 2.9
1. Sunlight vector $\mathbf{L} = (1, 1, -2)$. The ray of light passing through $\mathbf{p} = (4, 6, 10)$ is parametrized by:
   $$\mathbf{r}(t) = \mathbf{p} + t \mathbf{L} = (4 + t, \; 6 + t, \; 10 - 2t)$$
2. The ground plane is $z = 0$:
   $$10 - 2t = 0 \implies 2t = 10 \implies t = 5$$
3. Substituting $t = 5$ into the horizontal components:
   $$x_{\text{shadow}} = 4 + 5 = 9$$
   $$y_{\text{shadow}} = 6 + 5 = 11$$
   $$z_{\text{shadow}} = 0$$
   The shadow is cast at point $\mathbf{p}_{\text{shadow}} = (9, 11, 0)$.

---

### Solution to Exercise 2.10
1. The position in Cartesian components is:
   $$x(t) = r(t) \cos(\theta(t)) = (2 + t)\cos(\omega t)$$
   $$y(t) = r(t) \sin(\theta(t)) = (2 + t)\sin(\omega t)$$
   $$z(t) = t^2$$
2. Differentiating with respect to $t$ using the product rule:
   $$v_x(t) = \dot{x}(t) = \cos(\omega t) - \omega(2 + t)\sin(\omega t)$$
   $$v_y(t) = \dot{y}(t) = \sin(\omega t) + \omega(2 + t)\cos(\omega t)$$
   $$v_z(t) = \dot{z}(t) = 2t$$
   $$\mathbf{v}(t) = \begin{bmatrix} \cos(\omega t) - \omega(2 + t)\sin(\omega t) \\ \sin(\omega t) + \omega(2 + t)\cos(\omega t) \\ 2t \end{bmatrix}$$
   The first term in the horizontal components represents radial expansion velocity, while the second term represents tangential rotational velocity.

---

## 2.8 Chapter Summary and Bridge to Chapter 3

In this chapter, we explored the structural geometry of 3D Euclidean space:
- We derived the three fundamental coordinate planes ($\Pi_{xy}, \Pi_{xz}, \Pi_{yz}$) and analyzed how they partition space into the 8 canonical octants.
- We investigated the linear algebra of orthogonal projections, showing that projection matrices are idempotent ($\mathbf{P}^2 = \mathbf{P}$) and singular ($\det(\mathbf{P}) = 0$).
- We constructed the coordinate bridges to cylindrical $(r, \theta, z)$ and spherical $(\rho, \theta, \phi)$ systems, analyzing their Jacobians, forward/inverse conversions, and polar singularities.
- We demonstrated how these spatial partitions empower octree data structures in computational engines.

Now that the macroscopic layout of 3D space is clear, we must turn to the internal vector algebra that governs all motion and interaction within it. In **Chapter 3: The 3D Vector Anatomy â€” Basis Vectors, Components, and the Spatial Norm**, we will dissect 3D arrows, derive the 3D Euclidean norm via double-Pythagoras, introduce direction cosines, and formulate floating-point safety principles for high-performance physics engines.

# Chapter 3: The 3D Vector Anatomy â€” Basis Vectors, Components, and the Spatial Norm

> *"Numbers are the letters of the alphabet of science; but vectors are the words, sentences, and paragraphs that describe the physical cosmos. In three dimensions, an arrow is the complete sentence of motion."*  
> â€” **Oliver Heaviside, Electromagnetic Theory (1893)**

---

## 3.1 The Standard Canonical Basis of $\mathbb{R}^3$

In two-dimensional vector algebra, any arrow in the plane can be decomposed into a horizontal component and a vertical component using the standard unit basis vectors $\mathbf{i} = (1, 0)$ and $\mathbf{j} = (0, 1)$. 

In three-dimensional Euclidean space ($\mathbb{R}^3$), every vector requires three mutually perpendicular reference vectors to span the volume. The canonical standard basis consists of three unit-length vectors directed along the positive $x$-, $y$-, and $z$-axes:

$$\mathbf{i} = \mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{j} = \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{k} = \mathbf{e}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$

```
                         +z
                          â”‚
                          â”‚   k = (0, 0, 1)
                          *
                          â”‚
                          â”‚
                          â””â”€â”€â”€*â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ +y
                         /    j = (0, 1, 0)
                        /
                       * i = (1, 0, 0)
                      /
                   +x
```

### 3.1.1 The Orthogonality and Unit Length of the Basis
The standard basis vectors satisfy two fundamental geometric conditions:
1. **Unit Length (Normality):**
   $$\|\mathbf{i}\| = \sqrt{1^2 + 0^2 + 0^2} = 1$$
   $$\|\mathbf{j}\| = \sqrt{0^2 + 1^2 + 0^2} = 1$$
   $$\|\mathbf{k}\| = \sqrt{0^2 + 0^2 + 1^2} = 1$$
2. **Mutual Orthogonality:**
   $$\mathbf{i} \perp \mathbf{j}, \quad \mathbf{j} \perp \mathbf{k}, \quad \mathbf{k} \perp \mathbf{i}$$

Because they are both orthogonal and of unit length, the set $\{\mathbf{i}, \mathbf{j}, \mathbf{k}\}$ constitutes an **orthonormal basis** of $\mathbb{R}^3$.

### 3.1.2 Unique Linear Combination Representation
Any arbitrary vector $\mathbf{v} \in \mathbb{R}^3$ can be expressed as a unique linear combination of the standard basis:
$$\mathbf{v} = v_x \mathbf{i} + v_y \mathbf{j} + v_z \mathbf{k} = v_x \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + v_y \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} + v_z \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$$

The real numbers $v_x, v_y, v_z$ are the **Cartesian components** of the vector:
- $v_x$: The scalar projection of $\mathbf{v}$ along the $x$-axis.
- $v_y$: The scalar projection of $\mathbf{v}$ along the $y$-axis.
- $v_z$: The scalar projection of $\mathbf{v}$ along the $z$-axis.

---

## 3.2 Vector Arithmetic in $\mathbb{R}^3$

The operations of addition, subtraction, and scalar multiplication extend naturally from $\mathbb{R}^2$ to $\mathbb{R}^3$ via component-wise execution.

### 3.2.1 Vector Addition (The Parallelepiped Law)
Let $\mathbf{u} = (u_x, u_y, u_z)$ and $\mathbf{v} = (v_x, v_y, v_z)$. Their vector sum is:
$$\mathbf{u} + \mathbf{v} = (u_x + v_x, \; u_y + v_y, \; u_z + v_z)$$

Geometrically, in 3D space, place the tail of $\mathbf{v}$ at the tip of $\mathbf{u}$. The sum $\mathbf{u} + \mathbf{v}$ is the directed arrow pointing from the tail of $\mathbf{u}$ to the tip of $\mathbf{v}$. Together, $\mathbf{u}$ and $\mathbf{v}$ define a spatial parallelogram lying on an inclined 2D plane embedded within $\mathbb{R}^3$.

### 3.2.2 Vector Subtraction (Relative Displacement)
$$\mathbf{u} - \mathbf{v} = \mathbf{u} + (-\mathbf{v}) = (u_x - v_x, \; u_y - v_y, \; u_z - v_z)$$
The difference $\mathbf{u} - \mathbf{v}$ represents the directed arrow pointing from the tip of $\mathbf{v}$ to the tip of $\mathbf{u}$.

### 3.2.3 Scalar Multiplication (Scaling and Inversion)
For any scalar $c \in \mathbb{R}$:
$$c\mathbf{v} = (c v_x, \; c v_y, \; c v_z)$$
- If $c > 0$, the vector scales in length by a factor of $c$ while keeping its direction invariant.
- If $c < 0$, the vector scales in length by $|c|$ and completely reverses its spatial direction by $180^\circ$.
- If $c = 0$, the vector collapses to the **zero vector**:
  $$\mathbf{0} = (0, 0, 0)$$

---

## 3.3 The 3D Euclidean Norm: Double-Pythagoras from First Principles

In 2D, the Pythagorean theorem establishes that the length of an arrow $(x, y)$ is the hypotenuse of a right-angled triangle:
$$d = \sqrt{x^2 + y^2}$$

How do we measure the straight-line length of an arrow in three dimensions? 

We do not invent a new axiom; we apply the Pythagorean theorem **twice in succession**.

```
                         +z
                          â”‚
                          â”‚          p = (x, y, z)
                          â”‚         *
                          â”‚        /â”‚
                          â”‚       / â”‚
                          â”‚   ||v|| â”‚ z
                          â”‚     /   â”‚
                          â”‚    /    â”‚
                          â””â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ +y
                         /   /      â”‚
                        /   / d_xy  â”‚
                       /   *â”€â”€â”€â”€â”€â”€â”€â”€â”˜  Projection: (x, y, 0)
                      /   /    x
                     /   / y
                   +x   *
```

### 3.3.1 Step 1: The Ground Projection Hypotenuse
Let $\mathbf{v} = (v_x, v_y, v_z)$ be a vector anchored at the origin. Project $\mathbf{v}$ orthogonally onto the horizontal $xy$-plane ($z = 0$). This shadow vector is:
$$\mathbf{v}_{xy} = (v_x, v_y, 0)$$

The components $v_x$ and $v_y$ are mutually perpendicular ($x \perp y$). Therefore, $\mathbf{v}_{xy}$ forms the hypotenuse of a right triangle in the $xy$-plane with legs of length $|v_x|$ and $|v_y|$:
$$d_{xy}^2 = v_x^2 + v_y^2 \implies d_{xy} = \sqrt{v_x^2 + v_y^2}$$

### 3.3.2 Step 2: The Vertical Spatial Triangle
Now consider the vertical plane containing both the shadow vector $\mathbf{v}_{xy}$ and the original 3D vector $\mathbf{v}$. 

Because the $z$-axis is perpendicular to the entire $xy$-plane, the vertical segment of length $|v_z|$ is strictly perpendicular to the ground projection $\mathbf{v}_{xy}$:
$$\mathbf{v}_{xy} \perp v_z \mathbf{k}$$

Thus, the shadow vector of length $d_{xy}$ and the vertical altitude segment of length $|v_z|$ form the two perpendicular legs of a second right-angled triangle, whose hypotenuse is the true 3D vector $\mathbf{v}$!

Applying the Pythagorean theorem a second time:
$$\|\mathbf{v}\|^2 = d_{xy}^2 + v_z^2$$

Substituting $d_{xy}^2 = v_x^2 + v_y^2$:
$$\|\mathbf{v}\|^2 = (v_x^2 + v_y^2) + v_z^2 = v_x^2 + v_y^2 + v_z^2$$

Taking the positive square root yields the **3D Euclidean Norm**:
$$\|\mathbf{v}\| = \sqrt{v_x^2 + v_y^2 + v_z^2}$$

### 3.3.3 Fundamental Properties of the 3D Norm
The Euclidean norm satisfies the four defining axioms of a normed vector space:
1. **Non-Negativity:** $\|\mathbf{v}\| \ge 0$ for all $\mathbf{v} \in \mathbb{R}^3$.
2. **Positive Definiteness:** $\|\mathbf{v}\| = 0 \iff \mathbf{v} = \mathbf{0} = (0, 0, 0)$.
3. **Absolute Homogeneity (Scalability):** $\|c\mathbf{v}\| = |c| \|\mathbf{v}\|$ for any $c \in \mathbb{R}$.
4. **Triangle Inequality:** For any two vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$:
   $$\|\mathbf{u} + \mathbf{v}\| \le \|\mathbf{u}\| + \|\mathbf{v}\|$$

### 3.3.4 Computational Engine Optimization: The Squared Norm
In high-performance physics simulation and collision detection (such as broadphase bounding sphere overlap testing), computing a square root (`Math.sqrt()`) requires multiple CPU clock cycles (typically $10$ to $20$ cycles, compared to $1$ cycle for multiplication or addition).

Whenever we only need to compare distancesâ€”such as testing whether two spherical bodies of radii $r_1, r_2$ are colliding:
$$d \le r_1 + r_2 \iff d^2 \le (r_1 + r_2)^2$$

We calculate the **squared Euclidean norm**:
$$\|\mathbf{v}\|^2 = v_x^2 + v_y^2 + v_z^2$$

By avoiding the square root on every frame across millions of potential collision pairs, production engines execute broadphase queries orders of magnitude faster.

---

## 3.4 Unit Direction Vectors & Numerical Normalization

A vector that possesses a length of exactly $1$ is termed a **unit vector**:
$$\|\hat{\mathbf{v}}\| = 1$$

Unit vectors are the pure direction compass needles of 3D space. They convey orientation without carrying any scale or distance payload. 

### 3.4.1 Analytical Normalization
To convert any non-zero vector $\mathbf{v} \neq \mathbf{0}$ into a unit vector pointing in the identical spatial direction, we divide each component by the vector's Euclidean norm:
$$\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|} = \left(\frac{v_x}{\|\mathbf{v}\|}, \; \frac{v_y}{\|\mathbf{v}\|}, \; \frac{v_z}{\|\mathbf{v}\|}\right)$$

*Proof of Unit Length:*
$$\|\hat{\mathbf{v}}\| = \left\|\frac{\mathbf{v}}{\|\mathbf{v}\|}\right\| = \frac{1}{\|\mathbf{v}\|} \|\mathbf{v}\| = 1$$

### 3.4.2 The Division-by-Zero Trap & The Epsilon Guard
In theoretical mathematics, one simply states $\mathbf{v} \neq \mathbf{0}$. In computational physics engines, however, a physics object at rest may have velocity $\mathbf{v} = (0, 0, 0)$, or numerical roundoff may yield a near-zero vector such as $(10^{-18}, -10^{-19}, 10^{-18})$.

If an algorithm naively executes `v.x / len`, the CPU will perform floating-point division by zero:
$$\frac{0}{0} \implies \text{NaN (Not a Number)}$$

Once a `NaN` enters a physics engine's memory registers, it behaves like an incurable contagion:
$$\text{NaN} + 5.0 = \text{NaN}, \quad \text{NaN} \cdot 0.0 = \text{NaN}$$

Within two physics ticks, all particle positions, velocities, bounding boxes, and camera matrices collapse into `NaN`, causing the entire simulation to instantly disintegrate.

#### Production Normalization Implementation (with Epsilon Guard):
```typescript
function normalizeSafe(v: Vector3, epsilon = 1e-12): Vector3 {
  const lenSq = v.x * v.x + v.y * v.y + v.z * v.z;
  if (lenSq < epsilon * epsilon) {
    // Graceful fallback for degenerate zero vectors
    return new Vector3(0, 0, 0);
  }
  const invLen = 1.0 / Math.sqrt(lenSq);
  return new Vector3(v.x * invLen, v.y * invLen, v.z * invLen);
}
```

Notice the optimization: we compute the inverse square root `invLen = 1.0 / len` once, and then perform **three fast multiplications** rather than three expensive floating-point divisions!

---

## 3.5 Direction Cosines & Direction Angles

How do we specify the spatial direction of a 3D vector using angles? 

In 2D space, a single polar angle $\theta$ measured from the $+x$-axis completely determines direction:
$$\hat{\mathbf{u}} = (\cos \theta, \sin \theta)$$

In 3D space, a single angle is insufficient. A vector makes a distinct angle with **each of the three coordinate axes**.

Let $\mathbf{v} = (v_x, v_y, v_z)$ be a non-zero vector. We define the three **direction angles**:
- $\alpha \in [0, \pi]$: The angle between $\mathbf{v}$ and the positive $x$-axis.
- $\beta \in [0, \pi]$: The angle between $\mathbf{v}$ and the positive $y$-axis.
- $\gamma \in [0, \pi]$: The angle between $\mathbf{v}$ and the positive $z$-axis.

```
                         +z
                          â”‚       / v
                          â”‚ gamma/
                          â”‚     /
                          â”‚    /
                          â”‚   / beta
                          â””â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€ +y
                         /  /
                        /  / alpha
                       /  /
                      /  /
                   +x
```

### 3.5.1 Derivation of the Direction Cosines
Recall that the standard basis vectors along the axes are $\mathbf{i} = (1, 0, 0)$, $\mathbf{j} = (0, 1, 0)$, $\mathbf{k} = (0, 0, 1)$.

Projecting $\mathbf{v}$ onto the $x$-axis via the basic definition of cosine in the right triangle formed by $\mathbf{v}$ and its $x$-component:
$$\cos \alpha = \frac{v_x}{\|\mathbf{v}\|}$$

Similarly, projecting onto the $y$-axis and $z$-axis:
$$\cos \beta = \frac{v_y}{\|\mathbf{v}\|}$$
$$\cos \gamma = \frac{v_z}{\|\mathbf{v}\|}$$

The three quantities $(\cos \alpha, \cos \beta, \cos \gamma)$ are designated the **Direction Cosines** of the vector $\mathbf{v}$.

### 3.5.2 The Fundamental Direction Cosine Identity
Now consider the unit vector $\hat{\mathbf{v}}$:
$$\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|} = \left(\frac{v_x}{\|\mathbf{v}\|}, \; \frac{v_y}{\|\mathbf{v}\|}, \; \frac{v_z}{\|\mathbf{v}\|}\right) = (\cos \alpha, \; \cos \beta, \; \cos \gamma)$$

> **Theorem:**  
> The components of any unit direction vector $\hat{\mathbf{v}}$ in $\mathbb{R}^3$ are precisely its direction cosines!

Because the length of any unit vector is identically $1$:
$$\|\hat{\mathbf{v}}\|^2 = (\cos \alpha)^2 + (\cos \beta)^2 + (\cos \gamma)^2 = 1$$

Therefore, for any non-zero vector in three-dimensional space, the direction cosines satisfy the **Fundamental Identity**:
$$\cos^2 \alpha + \cos^2 \beta + \cos^2 \gamma = 1$$

> [!TIP]
> This identity means that the three direction angles $\alpha, \beta, \gamma$ are **not completely independent**. If you know any two direction angles, you can solve for the third (up to a sign ambiguity corresponding to forward or backward orientation)!

---

## 3.6 Worked Examples: 3D Vector Operations & Norms

### Worked Example 3.1: Vector Linear Combinations and Basis Expansion
*Problem:* Let three vectors in $\mathbb{R}^3$ be:  
$\mathbf{u} = 2\mathbf{i} - 3\mathbf{j} + 4\mathbf{k} = (2, -3, 4)$,  
$\mathbf{v} = -\mathbf{i} + 5\mathbf{j} - 2\mathbf{k} = (-1, 5, -2)$,  
$\mathbf{w} = 4\mathbf{i} + \mathbf{j} - 6\mathbf{k} = (4, 1, -6)$.  
1. Compute the linear combination $\mathbf{r} = 3\mathbf{u} - 2\mathbf{v} + \mathbf{w}$.  
2. Express $\mathbf{r}$ in standard basis component form.

*Solution:*  
1. Compute component by component:
   $$r_x = 3(2) - 2(-1) + 4 = 6 + 2 + 4 = 12$$
   $$r_y = 3(-3) - 2(5) + 1 = -9 - 10 + 1 = -18$$
   $$r_z = 3(4) - 2(-2) + (-6) = 12 + 4 - 6 = 10$$
2. The resulting vector is:
   $$\mathbf{r} = (12, -18, 10) = 12\mathbf{i} - 18\mathbf{j} + 10\mathbf{k}$$

---

### Worked Example 3.2: Spatial Magnitude and Double-Pythagorean Verification
*Problem:* A ballistic artillery shell is observed with velocity vector $\mathbf{v} = (120, -160, 150)\text{ m/s}$.  
1. Compute the horizontal ground speed $v_{\text{horiz}}$.  
2. Compute the true 3D spatial speed $\|\mathbf{v}\|$.  
3. Verify that $\|\mathbf{v}\|^2 = v_{\text{horiz}}^2 + v_z^2$.

*Solution:*  
1. Horizontal speed:
   $$v_{\text{horiz}} = \sqrt{v_x^2 + v_y^2} = \sqrt{120^2 + (-160)^2} = \sqrt{14400 + 25600} = \sqrt{40000} = 200\text{ m/s}$$
2. True 3D spatial speed:
   $$\|\mathbf{v}\| = \sqrt{v_x^2 + v_y^2 + v_z^2} = \sqrt{120^2 + (-160)^2 + 150^2} = \sqrt{40000 + 22500} = \sqrt{62500} = 250\text{ m/s}$$
3. Verification:
   $$v_{\text{horiz}}^2 + v_z^2 = 200^2 + 150^2 = 40000 + 22500 = 62500 = 250^2 = \|\mathbf{v}\|^2$$
   The double right-triangle structure holds with pristine integer Pythagorean triples: $(120, 160, 200)$ and $(200, 150, 250)$.

---

### Worked Example 3.3: Normalization and Floating-Point Epsilon Guard
*Problem:* A computational simulation receives a displacement vector $\mathbf{d} = (0.003, -0.004, 0.012)\text{ mm}$.  
1. Calculate the Euclidean norm $\|\mathbf{d}\|$.  
2. Calculate the normalized unit direction vector $\hat{\mathbf{d}}$.  
3. Verify that $\|\hat{\mathbf{d}}\| = 1.0$.

*Solution:*  
1. Compute norm:
   $$\|\mathbf{d}\| = \sqrt{(0.003)^2 + (-0.004)^2 + (0.012)^2} = \sqrt{0.000009 + 0.000016 + 0.000144} = \sqrt{0.000169} = 0.013\text{ mm}$$
2. Divide each component by $\|\mathbf{d}\| = 0.013$:
   $$\hat{d}_x = \frac{0.003}{0.013} = \frac{3}{13} \approx 0.23077$$
   $$\hat{d}_y = \frac{-0.004}{0.013} = -\frac{4}{13} \approx -0.30769$$
   $$\hat{d}_z = \frac{0.012}{0.013} = \frac{12}{13} \approx 0.92308$$
   $$\hat{\mathbf{d}} = \left(\frac{3}{13}, \; -\frac{4}{13}, \; \frac{12}{13}\right)$$
3. Verification of unit norm:
   $$\|\hat{\mathbf{d}}\| = \sqrt{\left(\frac{3}{13}\right)^2 + \left(-\frac{4}{13}\right)^2 + \left(\frac{12}{13}\right)^2} = \sqrt{\frac{9 + 16 + 144}{169}} = \sqrt{\frac{169}{169}} = 1.0$$

---

### Worked Example 3.4: Direction Cosines and Direction Angles of a Force Vector
*Problem:* A cable on a suspension bridge pulls on a support tower with a force $\mathbf{F} = (300, -400, 1200)\text{ N}$.  
1. Find the magnitude of the tensile force $\|\mathbf{F}\|$.  
2. Determine the direction cosines $(\cos \alpha, \cos \beta, \cos \gamma)$.  
3. Determine the direction angles $(\alpha, \beta, \gamma)$ in degrees.  
4. Verify the identity $\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$.

*Solution:*  
1. Magnitude:
   $$\|\mathbf{F}\| = \sqrt{300^2 + (-400)^2 + 1200^2} = \sqrt{90000 + 160000 + 1440000} = \sqrt{1690000} = 1300\text{ N}$$
2. Direction cosines:
   $$\cos \alpha = \frac{300}{1300} = \frac{3}{13} \approx 0.23077$$
   $$\cos \beta = \frac{-400}{1300} = -\frac{4}{13} \approx -0.30769$$
   $$\cos \gamma = \frac{1200}{1300} = \frac{12}{13} \approx 0.92308$$
3. Direction angles:
   $$\alpha = \arccos\left(\frac{3}{13}\right) \approx 76.66^\circ$$
   $$\beta = \arccos\left(-\frac{4}{13}\right) \approx 107.92^\circ$$
   $$\gamma = \arccos\left(\frac{12}{13}\right) \approx 22.62^\circ$$
4. Identity verification:
   $$\cos^2\alpha + \cos^2\beta + \cos^2\gamma = \left(\frac{3}{13}\right)^2 + \left(-\frac{4}{13}\right)^2 + \left(\frac{12}{13}\right)^2 = \frac{9 + 16 + 144}{169} = \frac{169}{169} = 1.0$$

---

### Worked Example 3.5: Reconstructing a Vector from Direction Cosines
*Problem:* A wind vector has magnitude $\|\mathbf{w}\| = 50\text{ km/h}$. It makes an angle $\alpha = 60^\circ$ with the $+x$-axis and $\beta = 45^\circ$ with the $+y$-axis. It is directed upwards into the upper deck ($w_z > 0$).  
1. Find the third direction angle $\gamma$.  
2. Find the exact Cartesian components $(w_x, w_y, w_z)$.

*Solution:*  
1. Using the fundamental identity $\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$:
   $$\cos(60^\circ) = \frac{1}{2} \implies \cos^2(60^\circ) = \frac{1}{4}$$
   $$\cos(45^\circ) = \frac{\sqrt{2}}{2} \implies \cos^2(45^\circ) = \frac{2}{4} = \frac{1}{2}$$
   $$\frac{1}{4} + \frac{1}{2} + \cos^2\gamma = 1 \implies \frac{3}{4} + \cos^2\gamma = 1 \implies \cos^2\gamma = \frac{1}{4}$$
   Since $w_z > 0$, we take the positive root:
   $$\cos \gamma = +\sqrt{\frac{1}{4}} = \frac{1}{2} \implies \gamma = \arccos\left(\frac{1}{2}\right) = 60^\circ$$
2. The Cartesian components are:
   $$w_x = \|\mathbf{w}\| \cos \alpha = 50 \cdot \frac{1}{2} = 25\text{ km/h}$$
   $$w_y = \|\mathbf{w}\| \cos \beta = 50 \cdot \frac{\sqrt{2}}{2} = 25\sqrt{2} \approx 35.36\text{ km/h}$$
   $$w_z = \|\mathbf{w}\| \cos \gamma = 50 \cdot \frac{1}{2} = 25\text{ km/h}$$
   $$\mathbf{w} = (25, \; 25\sqrt{2}, \; 25)\text{ km/h}$$

---

### Worked Example 3.6: Triangle Inequality Verification in 3D Space
*Problem:* Given two spatial vectors $\mathbf{u} = (2, -1, 2)$ and $\mathbf{v} = (1, 4, 8)$:  
1. Compute $\|\mathbf{u}\|$ and $\|\mathbf{v}\|$.  
2. Compute the sum $\mathbf{w} = \mathbf{u} + \mathbf{v}$ and its norm $\|\mathbf{w}\|$.  
3. Demonstrate that $\|\mathbf{u} + \mathbf{v}\| < \|\mathbf{u}\| + \|\mathbf{v}\|$ and calculate the difference.

*Solution:*  
1. Norms:
   $$\|\mathbf{u}\| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{4 + 1 + 4} = \sqrt{9} = 3$$
   $$\|\mathbf{v}\| = \sqrt{1^2 + 4^2 + 8^2} = \sqrt{1 + 16 + 64} = \sqrt{81} = 9$$
   $$\|\mathbf{u}\| + \|\mathbf{v}\| = 3 + 9 = 12$$
2. Sum vector:
   $$\mathbf{w} = \mathbf{u} + \mathbf{v} = (2+1, \; -1+4, \; 2+8) = (3, 3, 10)$$
   Norm of the sum:
   $$\|\mathbf{w}\| = \sqrt{3^2 + 3^2 + 10^2} = \sqrt{9 + 9 + 100} = \sqrt{118} \approx 10.863$$
3. Comparison:
   $$10.863 < 12.0 \implies \|\mathbf{u} + \mathbf{v}\| < \|\mathbf{u}\| + \|\mathbf{v}\|$$
   The difference is $12 - 10.863 = 1.137$. The inequality is strictly satisfied because $\mathbf{u}$ and $\mathbf{v}$ are not parallel.

---

### Worked Example 3.7: 3D Velocity Addition in Aircraft Flight Dynamics
*Problem:* An airplane flies with an airspeed vector relative to the air mass of $\mathbf{v}_{\text{air}} = (180, 240, 20)\text{ km/h}$. A high-altitude jet stream wind blows with velocity $\mathbf{v}_{\text{wind}} = (-40, 60, -5)\text{ km/h}$.  
1. Determine the ground velocity vector $\mathbf{v}_{\text{ground}}$ of the aircraft.  
2. Compute the ground speed of the aircraft.

*Solution:*  
1. By Galilean velocity addition in 3D:
   $$\mathbf{v}_{\text{ground}} = \mathbf{v}_{\text{air}} + \mathbf{v}_{\text{wind}}$$
   $$v_{gx} = 180 - 40 = 140\text{ km/h}$$
   $$v_{gy} = 240 + 60 = 300\text{ km/h}$$
   $$v_{gz} = 20 - 5 = 15\text{ km/h}$$
   $$\mathbf{v}_{\text{ground}} = (140, 300, 15)\text{ km/h}$$
2. The ground speed is:
   $$\|\mathbf{v}_{\text{ground}}\| = \sqrt{140^2 + 300^2 + 15^2} = \sqrt{19600 + 90000 + 225} = \sqrt{109825} \approx 331.40\text{ km/h}$$

---

### Worked Example 3.8: Fast Distance Filtering in Collision Detection
*Problem:* Two spherical bounding volumes have radii $R_1 = 5.0\text{ m}$ and $R_2 = 7.0\text{ m}$. Their centers are at $\mathbf{c}_1 = (10, 20, 15)$ and $\mathbf{c}_2 = (18, 26, 21)$.  
1. Compute the squared distance $d^2$ between their centers.  
2. Without taking any square roots, determine whether the bounding spheres overlap.

*Solution:*  
1. The displacement vector between the centers is:
   $$\Delta \mathbf{r} = \mathbf{c}_2 - \mathbf{c}_1 = (18 - 10, \; 26 - 20, \; 21 - 15) = (8, 6, 6)\text{ m}$$
   The squared distance is:
   $$d^2 = \|\Delta \mathbf{r}\|^2 = 8^2 + 6^2 + 6^2 = 64 + 36 + 36 = 136\text{ m}^2$$
2. The sum of the radii is $R_{\text{sum}} = R_1 + R_2 = 5.0 + 7.0 = 12.0\text{ m}$.  
   The squared threshold is:
   $$R_{\text{sum}}^2 = 12.0^2 = 144\text{ m}^2$$
   Since $d^2 = 136 < 144 = R_{\text{sum}}^2$, the centers are closer than the sum of their radii.  
   *Conclusion:* The two bounding spheres **overlap**. Collision narrowphase must be triggered.

---

### Worked Example 3.9: Center of Mass of a 3-Particle System in Space
*Problem:* Three point masses are positioned in space:  
$m_1 = 2\text{ kg}$ at $\mathbf{r}_1 = (1, 2, 4)$,  
$m_2 = 3\text{ kg}$ at $\mathbf{r}_2 = (6, -1, 2)$,  
$m_3 = 5\text{ kg}$ at $\mathbf{r}_3 = (-2, 4, -1)$.  
Compute the position vector $\mathbf{r}_{\text{CM}}$ of the system's center of mass.

*Solution:*  
1. Total mass $M = m_1 + m_2 + m_3 = 2 + 3 + 5 = 10\text{ kg}$.
2. The center of mass formula is:
   $$\mathbf{r}_{\text{CM}} = \frac{1}{M} \sum_{i=1}^3 m_i \mathbf{r}_i = \frac{m_1 \mathbf{r}_1 + m_2 \mathbf{r}_2 + m_3 \mathbf{r}_3}{M}$$
3. Computing component-wise:
   $$x_{\text{CM}} = \frac{2(1) + 3(6) + 5(-2)}{10} = \frac{2 + 18 - 10}{10} = \frac{10}{10} = 1.0$$
   $$y_{\text{CM}} = \frac{2(2) + 3(-1) + 5(4)}{10} = \frac{4 - 3 + 20}{10} = \frac{21}{10} = 2.1$$
   $$z_{\text{CM}} = \frac{2(4) + 3(2) + 5(-1)}{10} = \frac{8 + 6 - 5}{10} = \frac{9}{10} = 0.9$$
   $$\mathbf{r}_{\text{CM}} = (1.0, \; 2.1, \; 0.9)$$

---

### Worked Example 3.10: Unit Direction Vector Between Two Moving Targets
*Problem:* Target 1 moves along $\mathbf{r}_1(t) = (10t, \; 20, \; 5t)$, while Target 2 moves along $\mathbf{r}_2(t) = (0, \; 5t, \; 10 + 2t)$.  
1. Find the relative displacement vector $\mathbf{d}(t) = \mathbf{r}_2(t) - \mathbf{r}_1(t)$.  
2. At time $t = 2$, evaluate the displacement vector and find the unit direction vector $\hat{\mathbf{d}}(2)$ from Target 1 to Target 2.

*Solution:*  
1. General displacement:
   $$\mathbf{d}(t) = (0 - 10t, \; 5t - 20, \; (10 + 2t) - 5t) = (-10t, \; 5t - 20, \; 10 - 3t)$$
2. At $t = 2$:
   $$d_x(2) = -10(2) = -20$$
   $$d_y(2) = 5(2) - 20 = -10$$
   $$d_z(2) = 10 - 3(2) = 4$$
   $$\mathbf{d}(2) = (-20, -10, 4)$$
   Magnitude:
   $$\|\mathbf{d}(2)\| = \sqrt{(-20)^2 + (-10)^2 + 4^2} = \sqrt{400 + 100 + 16} = \sqrt{516} = 2\sqrt{129} \approx 22.716$$
   Normalized unit vector:
   $$\hat{\mathbf{d}}(2) = \frac{(-20, -10, 4)}{2\sqrt{129}} = \left(-\frac{10}{\sqrt{129}}, \; -\frac{5}{\sqrt{129}}, \; \frac{2}{\sqrt{129}}\right) \approx (-0.4402, \; -0.2201, \; 0.0880)$$

---

## 3.7 Chapter Mastery Exercise Set

### Exercise 3.1 (Elementary â€” Magnitude and Unit Vector of a Spatial Diagonal)
A room has dimensions $\Delta x = 6\text{ m}$, $\Delta y = 9\text{ m}$, $\Delta z = 2\text{ m}$. Define the diagonal displacement vector $\mathbf{v} = (6, 9, 2)$.  
(a) Compute the exact magnitude $\|\mathbf{v}\|$.  
(b) Compute the unit direction vector $\hat{\mathbf{v}}$.

### Exercise 3.2 (Elementary â€” Direction Cosine Validation)
A vector has direction angles $\alpha = 45^\circ$ and $\beta = 60^\circ$.  
(a) Find the two possible values for the third direction angle $\gamma$.  
(b) If the vector points toward the lower deck ($v_z < 0$), state the unique value of $\gamma$.

### Exercise 3.3 (Intermediate â€” Linear Independence of Three 3D Vectors)
Determine whether the three vectors $\mathbf{u} = (1, 2, 3)$, $\mathbf{v} = (2, -1, 4)$, and $\mathbf{w} = (3, 1, 7)$ are linearly independent in $\mathbb{R}^3$. Show your derivation clearly.

### Exercise 3.4 (Intermediate â€” Reconstructing a Force Vector from Sensor Metrics)
A robotic tension sensor measures a cable force of magnitude $\|\mathbf{T}\| = 750\text{ N}$. The cable is directed such that $\cos \alpha = 0.6$ and $\cos \beta = -0.48$. Given that the tension pulls upward along positive $z$:  
(a) Compute $\cos \gamma$.  
(b) Write out the force vector $\mathbf{T} = (T_x, T_y, T_z)$ in component form.

### Exercise 3.5 (Intermediate â€” Broadphase Proximity Query via Squared Distances)
A point-defense laser system tracks three incoming debris targets relative to the origin $(0, 0, 0)$:  
$\mathbf{T}_1 = (12, 16, 21)$, $\mathbf{T}_2 = (9, 22, 14)$, $\mathbf{T}_3 = (15, 12, 20)$.  
Using squared Euclidean norms exclusively (no square roots), identify which target is closest to the defense station.

### Exercise 3.6 (Advanced â€” Double-Pythagoras Metric Derivation)
Using vector algebra and the metric tensor of Euclidean space $\mathbf{g} = \mathbf{I}_3$, prove that the distance function $d(\mathbf{p}, \mathbf{q}) = \|\mathbf{p} - \mathbf{q}\|$ satisfies the symmetry axiom $d(\mathbf{p}, \mathbf{q}) = d(\mathbf{q}, \mathbf{p})$ and the triangle inequality $d(\mathbf{p}, \mathbf{r}) \le d(\mathbf{p}, \mathbf{q}) + d(\mathbf{q}, \mathbf{r})$ for all $\mathbf{p}, \mathbf{q}, \mathbf{r} \in \mathbb{R}^3$.

### Exercise 3.7 (Advanced â€” Catastrophic Floating-Point Cancellation in Vector Subtraction)
Two GPS satellite position vectors in Earth-Centered Earth-Fixed (ECEF) coordinates are:  
$\mathbf{r}_1 = (6378137.0, \; 1250.0, \; 420.0)\text{ m}$  
$\mathbf{r}_2 = (6378137.0001, \; 1250.0002, \; 420.0001)\text{ m}$  
Explain why subtracting these two vectors using 32-bit single-precision floats (`float32`) leads to catastrophic loss of precision, whereas 64-bit double precision (`float64`) preserves the sub-millimeter displacement.

### Exercise 3.8 (Advanced â€” Linear Interpolation (Lerp) of 3D Position Vectors)
A camera moves from start position $\mathbf{A} = (10, 5, 20)$ to target position $\mathbf{B} = (70, 35, -10)$ over a normalized time interval $t \in [0, 1]$ according to the linear interpolation function:
$$\mathbf{p}(t) = (1 - t)\mathbf{A} + t\mathbf{B}$$
(a) Find the position at $t = 0.25$ and $t = 0.75$.  
(b) Show that the velocity vector $\dot{\mathbf{p}}(t)$ is constant for all $t$.

### Exercise 3.9 (Master â€” Cauchy-Schwarz Inequality in $\mathbb{R}^3$)
Using only the properties of the 3D norm and the quadratic discriminant of the function $f(t) = \|\mathbf{u} + t\mathbf{v}\|^2 \ge 0$, prove the Cauchy-Schwarz inequality for any $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$:
$$|u_x v_x + u_y v_y + u_z v_z| \le \|\mathbf{u}\| \|\mathbf{v}\|$$

### Exercise 3.10 (Master â€” Static Equilibrium of a Suspended Mass in 3D)
A heavy sensor payload of mass $m = 100\text{ kg}$ hangs in static equilibrium at the origin $\mathbf{O} = (0, 0, 0)$ supported by three non-coplanar cables attached to ceiling anchor rings:  
Ring 1: $\mathbf{A}_1 = (-2, -3, 4)\text{ m}$,  
Ring 2: $\mathbf{A}_2 = (3, -2, 4)\text{ m}$,  
Ring 3: $\mathbf{A}_3 = (0, 4, 4)\text{ m}$.  
Assuming gravity $g = 9.81\text{ m/s}^2$ acts along $-z$ (downward load $\mathbf{W} = (0, 0, -981)\text{ N}$), set up the $3 \times 3$ linear system of unit direction vectors and solve for the tensions $T_1, T_2, T_3$ in the three cables.

---

## 3.8 Comprehensive Solutions to Chapter Exercises

### Solution to Exercise 3.1
1. Given $\mathbf{v} = (6, 9, 2)$:
   $$\|\mathbf{v}\| = \sqrt{6^2 + 9^2 + 2^2} = \sqrt{36 + 81 + 4} = \sqrt{121} = 11\text{ m}$$
2. Unit vector $\hat{\mathbf{v}}$:
   $$\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|} = \left(\frac{6}{11}, \; \frac{9}{11}, \; \frac{2}{11}\right) \approx (0.5455, \; 0.8182, \; 0.1818)$$

---

### Solution to Exercise 3.2
1. Fundamental identity: $\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$.  
   $\cos(45^\circ) = \frac{\sqrt{2}}{2} \implies \cos^2(45^\circ) = \frac{1}{2}$.  
   $\cos(60^\circ) = \frac{1}{2} \implies \cos^2(60^\circ) = \frac{1}{4}$.  
   $$\frac{1}{2} + \frac{1}{4} + \cos^2\gamma = 1 \implies \frac{3}{4} + \cos^2\gamma = 1 \implies \cos^2\gamma = \frac{1}{4} \implies \cos \gamma = \pm \frac{1}{2}$$
   Thus $\gamma = \arccos\left(\frac{1}{2}\right) = 60^\circ$ or $\gamma = \arccos\left(-\frac{1}{2}\right) = 120^\circ$.
2. For $v_z < 0$, $\cos \gamma$ must be negative:
   $$\cos \gamma = -\frac{1}{2} \implies \gamma = 120^\circ$$

---

### Solution to Exercise 3.3
Three vectors are linearly dependent if and only if the determinant of the matrix formed by their components is zero:
$$\det \begin{bmatrix} 1 & 2 & 3 \\ 2 & -1 & 4 \\ 3 & 1 & 7 \end{bmatrix}$$
Expanding along row 1:
$$\det = 1 \cdot \begin{vmatrix} -1 & 4 \\ 1 & 7 \end{vmatrix} - 2 \cdot \begin{vmatrix} 2 & 4 \\ 3 & 7 \end{vmatrix} + 3 \cdot \begin{vmatrix} 2 & -1 \\ 3 & 1 \end{vmatrix}$$
$$= 1(-7 - 4) - 2(14 - 12) + 3(2 - (-3)) = 1(-11) - 2(2) + 3(5) = -11 - 4 + 15 = 0$$
Because the determinant is identically $0$, the vectors are **linearly dependent** (they are coplanar). Notice that $\mathbf{u} + \mathbf{v} = (1+2, 2-1, 3+4) = (3, 1, 7) = \mathbf{w}$.

---

### Solution to Exercise 3.4
1. Direction cosine identity:
   $$\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$$
   $$0.6^2 + (-0.48)^2 + \cos^2\gamma = 1 \implies 0.36 + 0.2304 + \cos^2\gamma = 1$$
   $$0.5904 + \cos^2\gamma = 1 \implies \cos^2\gamma = 0.4096 \implies \cos \gamma = +\sqrt{0.4096} = 0.64$$
2. Components of force vector $\mathbf{T}$ with $\|\mathbf{T}\| = 750\text{ N}$:
   $$T_x = \|\mathbf{T}\| \cos \alpha = 750(0.6) = 450\text{ N}$$
   $$T_y = \|\mathbf{T}\| \cos \beta = 750(-0.48) = -360\text{ N}$$
   $$T_z = \|\mathbf{T}\| \cos \gamma = 750(0.64) = 480\text{ N}$$
   $$\mathbf{T} = (450, -360, 480)\text{ N}$$

---

### Solution to Exercise 3.5
Compute squared norms from the origin $(0, 0, 0)$:
- Target 1: $\|\mathbf{T}_1\|^2 = 12^2 + 16^2 + 21^2 = 144 + 256 + 441 = 841$
- Target 2: $\|\mathbf{T}_2\|^2 = 9^2 + 22^2 + 14^2 = 81 + 484 + 196 = 761$
- Target 3: $\|\mathbf{T}_3\|^2 = 15^2 + 12^2 + 20^2 = 225 + 144 + 400 = 769$

Comparing the scalar values:
$$761 < 769 < 841 \implies \|\mathbf{T}_2\|^2 < \|\mathbf{T}_3\|^2 < \|\mathbf{T}_1\|^2$$
**Target 2** is strictly the closest to the defense station, determined with zero square root operations.

---

### Solution to Exercise 3.6
1. Symmetry:
   $$d(\mathbf{p}, \mathbf{q}) = \|\mathbf{p} - \mathbf{q}\| = \|-(\mathbf{q} - \mathbf{p})\| = |-1| \|\mathbf{q} - \mathbf{p}\| = \|\mathbf{q} - \mathbf{p}\| = d(\mathbf{q}, \mathbf{p})$$
2. Triangle Inequality:
   Let $\mathbf{u} = \mathbf{p} - \mathbf{q}$ and $\mathbf{v} = \mathbf{q} - \mathbf{r}$.
   Notice that $\mathbf{u} + \mathbf{v} = (\mathbf{p} - \mathbf{q}) + (\mathbf{q} - \mathbf{r}) = \mathbf{p} - \mathbf{r}$.
   By the vector norm triangle inequality:
   $$\|\mathbf{p} - \mathbf{r}\| = \|\mathbf{u} + \mathbf{v}\| \le \|\mathbf{u}\| + \|\mathbf{v}\| = \|\mathbf{p} - \mathbf{q}\| + \|\mathbf{q} - \mathbf{r}\|$$
   $$d(\mathbf{p}, \mathbf{r}) \le d(\mathbf{p}, \mathbf{q}) + d(\mathbf{q}, \mathbf{r})$$
   This proves that Euclidean space $(\mathbb{R}^3, d)$ is a true metric space.

---

### Solution to Exercise 3.7
1. In IEEE 754 single-precision float (`float32`), there are only 24 bits of mantissa precision ($\approx 7.22$ decimal digits).
2. The large component $6378137.0$ requires 7 significant digits just to represent the integer meters. The fractional millimeter parts ($0.0001\text{ m}$) reside beyond the 24-bit mantissa horizon and are completely truncated (rounded off). When subtracting, the identical rounded bits cancel, yielding $0.0$, a complete catastrophic loss of precision.
3. In double-precision float (`float64`), there are 53 bits of mantissa ($\approx 15.95$ decimal digits). The number $6378137.0001$ requires 11 significant digits, which fits comfortably within the 16-digit limit. Subtraction correctly preserves the true displacement $\Delta \mathbf{r} = (0.0001, 0.0002, 0.0001)\text{ m}$.

---

### Solution to Exercise 3.8
1. Start $\mathbf{A} = (10, 5, 20)$, end $\mathbf{B} = (70, 35, -10)$.
   Displacement $\mathbf{d} = \mathbf{B} - \mathbf{A} = (60, 30, -30)$.
   - At $t = 0.25$:
     $$\mathbf{p}(0.25) = \mathbf{A} + 0.25\mathbf{d} = (10 + 15, \; 5 + 7.5, \; 20 - 7.5) = (25, 12.5, 12.5)$$
   - At $t = 0.75$:
     $$\mathbf{p}(0.75) = \mathbf{A} + 0.75\mathbf{d} = (10 + 45, \; 5 + 22.5, \; 20 - 22.5) = (55, 27.5, -2.5)$$
2. Velocity is the derivative with respect to $t$:
   $$\dot{\mathbf{p}}(t) = \frac{d}{dt}[(1 - t)\mathbf{A} + t\mathbf{B}] = -\mathbf{A} + \mathbf{B} = \mathbf{B} - \mathbf{A} = (60, 30, -30)$$
   Since $(60, 30, -30)$ is independent of $t$, the velocity vector is strictly constant throughout the entire interpolation.

---

### Solution to Exercise 3.9
1. For any real number $t$, consider the squared norm function:
   $$f(t) = \|\mathbf{u} + t\mathbf{v}\|^2 = (\mathbf{u} + t\mathbf{v}) \cdot (\mathbf{u} + t\mathbf{v})$$
2. Expanding using dot product distributivity:
   $$f(t) = \|\mathbf{u}\|^2 + 2t(\mathbf{u} \cdot \mathbf{v}) + t^2\|\mathbf{v}\|^2$$
3. By the positive definiteness of the norm, $f(t) \ge 0$ for all $t \in \mathbb{R}$.
4. A quadratic polynomial $A t^2 + B t + C$ that is always non-negative must have a non-positive discriminant:
   $$\Delta = B^2 - 4AC \le 0$$
   Here $A = \|\mathbf{v}\|^2$, $B = 2(\mathbf{u} \cdot \mathbf{v})$, $C = \|\mathbf{u}\|^2$:
   $$\Delta = [2(\mathbf{u} \cdot \mathbf{v})]^2 - 4\|\mathbf{v}\|^2 \|\mathbf{u}\|^2 \le 0$$
   $$4(\mathbf{u} \cdot \mathbf{v})^2 \le 4\|\mathbf{u}\|^2 \|\mathbf{v}\|^2 \implies (\mathbf{u} \cdot \mathbf{v})^2 \le \|\mathbf{u}\|^2 \|\mathbf{v}\|^2$$
5. Taking the square root of both sides:
   $$|\mathbf{u} \cdot \mathbf{v}| \le \|\mathbf{u}\| \|\mathbf{v}\|$$
   $$|u_x v_x + u_y v_y + u_z v_z| \le \|\mathbf{u}\| \|\mathbf{v}\|$$
   This completes the proof of the Cauchy-Schwarz inequality in $\mathbb{R}^3$.

---

### Solution to Exercise 3.10
1. Payload is at $\mathbf{O} = (0, 0, 0)$. Cables point from $\mathbf{O}$ to anchors:
   - $\mathbf{A}_1 = (-2, -3, 4) \implies \|\mathbf{A}_1\| = \sqrt{(-2)^2 + (-3)^2 + 4^2} = \sqrt{4 + 9 + 16} = \sqrt{29} \approx 5.3852$
   - $\mathbf{A}_2 = (3, -2, 4) \implies \|\mathbf{A}_2\| = \sqrt{3^2 + (-2)^2 + 4^2} = \sqrt{9 + 4 + 16} = \sqrt{29} \approx 5.3852$
   - $\mathbf{A}_3 = (0, 4, 4) \implies \|\mathbf{A}_3\| = \sqrt{0^2 + 4^2 + 4^2} = \sqrt{32} = 4\sqrt{2} \approx 5.6569$
2. The unit direction vectors of the cable forces are:
   $$\hat{\mathbf{u}}_1 = \frac{1}{\sqrt{29}}(-2, -3, 4)$$
   $$\hat{\mathbf{u}}_2 = \frac{1}{\sqrt{29}}(3, -2, 4)$$
   $$\hat{\mathbf{u}}_3 = \frac{1}{\sqrt{32}}(0, 4, 4) = \left(0, \frac{\sqrt{2}}{2}, \frac{\sqrt{2}}{2}\right)$$
3. Static equilibrium requires $\sum \mathbf{F} = \mathbf{0}$:
   $$T_1 \hat{\mathbf{u}}_1 + T_2 \hat{\mathbf{u}}_2 + T_3 \hat{\mathbf{u}}_3 + \mathbf{W} = \mathbf{0}$$
   where $\mathbf{W} = (0, 0, -981)\text{ N}$.
   This yields the linear system:
   $$\begin{cases}
   -\frac{2}{\sqrt{29}} T_1 + \frac{3}{\sqrt{29}} T_2 + 0 T_3 = 0 \\
   -\frac{3}{\sqrt{29}} T_1 - \frac{2}{\sqrt{29}} T_2 + \frac{\sqrt{2}}{2} T_3 = 0 \\
   \frac{4}{\sqrt{29}} T_1 + \frac{4}{\sqrt{29}} T_2 + \frac{\sqrt{2}}{2} T_3 = 981
   \end{cases}$$
4. From equation (1):
   $$2 T_1 = 3 T_2 \implies T_1 = 1.5 T_2$$
5. Subtract equation (2) from equation (3):
   $$\left(\frac{4}{\sqrt{29}} - \left(-\frac{3}{\sqrt{29}}\right)\right) T_1 + \left(\frac{4}{\sqrt{29}} - \left(-\frac{2}{\sqrt{29}}\right)\right) T_2 = 981 - 0$$
   $$\frac{7}{\sqrt{29}} T_1 + \frac{6}{\sqrt{29}} T_2 = 981$$
   Substitute $T_1 = 1.5 T_2$:
   $$\frac{7(1.5) + 6}{\sqrt{29}} T_2 = 981 \implies \frac{10.5 + 6}{\sqrt{29}} T_2 = 981 \implies \frac{16.5}{\sqrt{29}} T_2 = 981$$
   $$T_2 = \frac{981 \sqrt{29}}{16.5} \approx \frac{981 \cdot 5.38516}{16.5} \approx 320.17\text{ N}$$
   $$T_1 = 1.5 T_2 = 1.5(320.17) \approx 480.26\text{ N}$$
6. Solve for $T_3$ using equation (2):
   $$\frac{\sqrt{2}}{2} T_3 = \frac{3 T_1 + 2 T_2}{\sqrt{29}} = \frac{3(480.26) + 2(320.17)}{5.38516} = \frac{1440.78 + 640.34}{5.38516} = \frac{2081.12}{5.38516} \approx 386.45$$
   $$T_3 = 386.45 \cdot \sqrt{2} \approx 546.53\text{ N}$$
   *Summary of cable tensions:* $T_1 \approx 480.26\text{ N}$, $T_2 \approx 320.17\text{ N}$, $T_3 \approx 546.53\text{ N}$. All tensions are positive, confirming the cables remain taut in stable equilibrium.

---

## 3.9 Chapter Summary and Bridge to Chapter 4

In this chapter, we dissected the anatomical structure of three-dimensional vectors:
- We formalized the standard orthonormal basis $(\mathbf{i}, \mathbf{j}, \mathbf{k})$ and decomposed spatial arrows into their unique component triplets.
- We proved the 3D Euclidean norm from first principles through a double right-triangle Pythagorean derivation, establishing the squared norm as a critical performance optimization in collision engines.
- We analyzed unit vectors, floating-point epsilon guards against catastrophic `NaN` contamination, and derived the fundamental direction cosine identity $\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1$.
- We grounded these principles in 10 multi-step engineering worked examples and 10 fully solved challenge exercises.

Having mastered the length and direction of a single arrow, we now investigate how pairs of 3D arrows interact. In **Chapter 4: The 3D Dot Product â€” Spatial Alignment, Angles, and Orthogonality**, we will examine how the scalar product measures spatial alignment, calculates true 3D dihedral angles, and governs energy transfer, lighting calculations, and orthogonal force decomposition.

# Chapter 4: The 3D Dot Product, Cosine Metric, and Spatial Angles

> *"The introduction of numbers as coordinates is an act of violence against the pristine nature of space; yet it is only through this violence that we learn the measure of its depths and the angles of its inclinations."*  
> â€” **Hermann Weyl**, *Space, Time, Matter* (1918)

---

### Section 4.1 Algebraic Definition: Component-Wise Sum of Products in $\mathbb{R}^3$

In two dimensions, we learned that multiplying two vectors component by component and summing the results yielded a single, real-valued scalar: $\mathbf{a} \cdot \mathbf{b} = a_x b_x + a_y b_y$. What happens when we ascend into three-dimensional Euclidean space $\mathbb{R}^3$?

Let two vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$ be expressed in terms of their Cartesian coordinates relative to a standard orthonormal basis $\{\mathbf{i}, \mathbf{j}, \mathbf{k}\}$:
$$\mathbf{u} = \begin{bmatrix} u_x \\ u_y \\ u_z \end{bmatrix} = u_x \mathbf{i} + u_y \mathbf{j} + u_z \mathbf{k}$$
$$\mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix} = v_x \mathbf{i} + v_y \mathbf{j} + v_z \mathbf{k}$$

The **algebraic dot product** (also designated the standard Euclidean inner product) is defined as the scalar sum:
$$\mathbf{u} \cdot \mathbf{v} \equiv u_x v_x + u_y v_y + u_z v_z = \sum_{i=1}^3 u_i v_i$$

In matrix notation, treating column vectors as $3 \times 1$ matrices, the dot product is represented elegantly as a row-column matrix multiplication:
$$\mathbf{u} \cdot \mathbf{v} = \mathbf{u}^T \mathbf{v} = \begin{bmatrix} u_x & u_y & u_z \end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix} = u_x v_x + u_y v_y + u_z v_z$$

Notice the extreme simplicity of this computation: it requires exactly three floating-point multiplications and two additions. On modern SIMD (Single Instruction, Multiple Data) processor architectures (such as Intel AVX-512 or ARM NEON), this operation is executed in a single cycle via fused multiply-add (FMA) instructions.

```
       u = (ux, uy, uz)
               \
                \     theta
                 \ ----------> v = (vx, vy, vz)
                  \
                   \
           u Â· v = ux*vx + uy*vy + uz*vz = ||u|| ||v|| cos(theta)
```

---

### Section 4.2 Bilinearity, Symmetry, and Positive Definiteness: The Inner Product Axioms on $\mathbb{R}^3$

The algebraic definition is not an arbitrary formula; it satisfies the foundational mathematical axioms that define an **Inner Product Space** $(V, \langle \cdot, \cdot \rangle)$ over the field of real numbers $\mathbb{R}$:

1. **Symmetry (Commutativity):**
   $$\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u} \quad \forall \mathbf{u}, \mathbf{v} \in \mathbb{R}^3$$
   *Proof:* Since real multiplication is commutative, $u_x v_x + u_y v_y + u_z v_z = v_x u_x + v_y u_y + v_z u_z$.

2. **Bilinearity (Linearity in Each Argument):**
   For any scalars $\alpha, \beta \in \mathbb{R}$ and vectors $\mathbf{u}, \mathbf{v}, \mathbf{w} \in \mathbb{R}^3$:
   $$(\alpha \mathbf{u} + \beta \mathbf{v}) \cdot \mathbf{w} = \alpha (\mathbf{u} \cdot \mathbf{w}) + \beta (\mathbf{v} \cdot \mathbf{w})$$
   $$\mathbf{u} \cdot (\alpha \mathbf{v} + \beta \mathbf{w}) = \alpha (\mathbf{u} \cdot \mathbf{v}) + \beta (\mathbf{u} \cdot \mathbf{w})$$
   *Proof:* Follows directly from the distributive and associative laws of real numbers applied coordinate-wise:
   $$\sum_{i=1}^3 (\alpha u_i + \beta v_i) w_i = \sum_{i=1}^3 (\alpha u_i w_i + \beta v_i w_i) = \alpha \sum_{i=1}^3 u_i w_i + \beta \sum_{i=1}^3 v_i w_i$$

3. **Positive Definiteness:**
   $$\mathbf{u} \cdot \mathbf{u} \ge 0 \quad \forall \mathbf{u} \in \mathbb{R}^3, \quad \text{and} \quad \mathbf{u} \cdot \mathbf{u} = 0 \iff \mathbf{u} = \mathbf{0}$$
   *Proof:* $\mathbf{u} \cdot \mathbf{u} = u_x^2 + u_y^2 + u_z^2$. In $\mathbb{R}$, the square of any real number is non-negative ($u_i^2 \ge 0$). The sum of non-negative terms can only equal zero if and only if each individual term is zero ($u_x = u_y = u_z = 0$), which is the definition of the zero vector $\mathbf{0}$.

4. **Connection to the Euclidean Norm:**
   The positive definiteness property immediately induces the standard Euclidean metric (length):
   $$\|\mathbf{u}\| = \sqrt{\mathbf{u} \cdot \mathbf{u}} = \sqrt{u_x^2 + u_y^2 + u_z^2}$$
   And the squared norm:
   $$\|\mathbf{u}\|^2 = \mathbf{u} \cdot \mathbf{u}$$

---

### Section 4.3 Geometric Definition and Equivalence: The Law of Cosines in 3D Space

Why should the algebraic sum of products $u_x v_x + u_y v_y + u_z v_z$ have anything to do with spatial geometry, lengths, and angles?

To uncover this deep geometric connection, consider two non-zero vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$ meeting at a common origin, spanning a flat 2D plane embedded within 3D space. Let $\theta \in [0, \pi]$ be the interior angle between them.

```
                    C
                   / \
                  /   \
                 /     \  ||u - v||
         ||u||  /       \
               /         \
              / theta     \
             A ------------ B
                  ||v||
```

The vector connecting the terminal point of $\mathbf{v}$ to the terminal point of $\mathbf{u}$ is the difference vector $\mathbf{w} = \mathbf{u} - \mathbf{v}$.

In the triangle $\triangle ABC$ formed by the origin $A$, terminal point of $\mathbf{v}$ ($B$), and terminal point of $\mathbf{u}$ ($C$), the side lengths are:
- $a = \|\mathbf{u} - \mathbf{v}\|$
- $b = \|\mathbf{u}\|$
- $c = \|\mathbf{v}\|$

By the classical **Law of Cosines** from plane trigonometry applied to this triangle in its embedding plane:
$$\|\mathbf{u} - \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2 - 2 \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$$

Now, let us expand the left-hand side $\|\mathbf{u} - \mathbf{v}\|^2$ algebraically using the inner product axioms:
$$\|\mathbf{u} - \mathbf{v}\|^2 = (\mathbf{u} - \mathbf{v}) \cdot (\mathbf{u} - \mathbf{v})$$
Applying bilinearity:
$$(\mathbf{u} - \mathbf{v}) \cdot (\mathbf{u} - \mathbf{v}) = \mathbf{u} \cdot \mathbf{u} - \mathbf{u} \cdot \mathbf{v} - \mathbf{v} \cdot \mathbf{u} + \mathbf{v} \cdot \mathbf{v}$$
Applying symmetry ($\mathbf{v} \cdot \mathbf{u} = \mathbf{u} \cdot \mathbf{v}$) and the norm relationship ($\mathbf{u} \cdot \mathbf{u} = \|\mathbf{u}\|^2$):
$$\|\mathbf{u} - \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2 - 2(\mathbf{u} \cdot \mathbf{v})$$

We now equate the two expressions for $\|\mathbf{u} - \mathbf{v}\|^2$:
$$\|\mathbf{u}\|^2 + \|\mathbf{v}\|^2 - 2(\mathbf{u} \cdot \mathbf{v}) = \|\mathbf{u}\|^2 + \|\mathbf{v}\|^2 - 2 \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$$

Subtracting $\|\mathbf{u}\|^2 + \|\mathbf{v}\|^2$ from both sides:
$$-2(\mathbf{u} \cdot \mathbf{v}) = -2 \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$$
Dividing by $-2$:
$$\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$$

This is the celebrated **Geometric Definition of the Dot Product**. It bridges pure coordinate arithmetic ($\sum u_i v_i$) with coordinate-free Euclidean spatial geometry ($\|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$).

---

### Section 4.4 Spatial Orthogonality: $\mathbf{u} \cdot \mathbf{v} = 0$, Geometric Independence, and the Normal Plane

The geometric formula $\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$ reveals fundamental qualitative behaviors depending on the sign of the dot product:

1. **Acute Angle ($0 \le \theta < \frac{\pi}{2}$):** $\cos\theta > 0 \implies \mathbf{u} \cdot \mathbf{v} > 0$. The vectors generally point in the same direction.
2. **Right Angle ($\theta = \frac{\pi}{2}$ or $90^\circ$):** $\cos\theta = 0 \implies \mathbf{u} \cdot \mathbf{v} = 0$. The vectors are **orthogonal** (perpendicular).
3. **Obtuse Angle ($\frac{\pi}{2} < \theta \le \pi$):** $\cos\theta < 0 \implies \mathbf{u} \cdot \mathbf{v} < 0$. The vectors generally point in opposite directions.

```
       Acute (u Â· v > 0)          Orthogonal (u Â· v = 0)         Obtuse (u Â· v < 0)
             u                               u                          u
            /                                |                           \
           /                                 |                            \
          / theta < 90Â°                      | theta = 90Â°                 \ theta > 90Â°
         +----------> v                      +----------> v                 +----------> v
```

#### The Normal Plane in 3D
In 2D, the condition $\mathbf{u} \cdot \mathbf{v} = 0$ for a fixed vector $\mathbf{n} = (n_x, n_y)$ defines a 1D line: all vectors perpendicular to $\mathbf{n}$.
In 3D, for a fixed non-zero vector $\mathbf{n} = \begin{bmatrix} A & B & C \end{bmatrix}^T$, the condition:
$$\mathbf{n} \cdot \mathbf{r} = 0 \iff A x + B y + C z = 0$$
defines a **two-dimensional plane passing through the origin**!
Every vector $\mathbf{r} = \begin{bmatrix} x & y & z \end{bmatrix}^T$ lying in this plane is perpendicular to $\mathbf{n}$. Thus, a single 3D vector $\mathbf{n}$ acts as the normal vector that uniquely specifies the orientation of an entire 2D plane in space.

---

### Section 4.5 The Spatial Angle Formula and Numerical Safeguards

From the geometric identity, if neither $\mathbf{u}$ nor $\mathbf{v}$ is the zero vector, the cosine of the angle between them is:
$$\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|} = \hat{\mathbf{u}} \cdot \hat{\mathbf{v}}$$
where $\hat{\mathbf{u}} = \frac{\mathbf{u}}{\|\mathbf{u}\|}$ and $\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$ are the normalized unit vectors.

Therefore, the angle $\theta \in [0, \pi]$ radians ($[0^\circ, 180^\circ]$) is given by:
$$\theta = \arccos\left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|}\right)$$

#### The Fatal Floating-Point Pitfall: Domain Violation in $\arccos$
In pure mathematics, Cauchy-Schwarz guarantees:
$$|\mathbf{u} \cdot \mathbf{v}| \le \|\mathbf{u}\| \|\mathbf{v}\| \implies -1 \le \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|} \le 1$$
However, in computer arithmetic using IEEE 754 floating-point numbers (`float32` or `float64`), round-off errors are inevitable!
Suppose $\mathbf{u} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.
Due to rounding in `sqrt(3) * sqrt(3)` vs `1*1 + 1*1 + 1*1`, the computed ratio can easily evaluate to:
$$\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\| \|\mathbf{v}\|} = \frac{3.0}{2.9999999999999996} = 1.0000000000000002$$
The standard library function `Math.acos(1.0000000000000002)` or `std::acos` will immediately return **`NaN`** (Not a Number)!
If this `NaN` propagates into rigid body rotations or physics integration, the simulation explodes: entity positions become `NaN`, bounding boxes collapse, and the entire game engine crashes.

#### The Production Numerical Safeguard
To guarantee numerical stability, every production graphics and physics engine **must clamp** the cosine argument to the closed interval $[-1.0, 1.0]$:
```typescript
function angleBetween(u: Vector3, v: Vector3): number {
  const lenU = u.length();
  const lenV = v.length();
  if (lenU === 0 || lenV === 0) return 0;
  
  const cosTheta = (u.x * v.x + u.y * v.y + u.z * v.z) / (lenU * lenV);
  // Robust numerical clamp to [-1, 1]
  const clampedCos = Math.max(-1.0, Math.min(1.0, cosTheta));
  return Math.acos(clampedCos);
}
```

---

### Section 4.6 Direction Cosines Matrix and Relative Angular Separation

When a vector $\mathbf{v}$ is normalized to unit length $\hat{\mathbf{v}} = \begin{bmatrix} v_x & v_y & v_z \end{bmatrix}^T$ with $\|\hat{\mathbf{v}}\| = 1$, its dot products with the coordinate basis vectors $\{\mathbf{i}, \mathbf{j}, \mathbf{k}\}$ yield its **direction cosines**:
$$\cos\alpha = \hat{\mathbf{v}} \cdot \mathbf{i} = v_x$$
$$\cos\beta = \hat{\mathbf{v}} \cdot \mathbf{j} = v_y$$
$$\cos\gamma = \hat{\mathbf{v}} \cdot \mathbf{k} = v_z$$

If we have two unit vectors $\hat{\mathbf{u}} = (\cos\alpha_1, \cos\beta_1, \cos\gamma_1)$ and $\hat{\mathbf{v}} = (\cos\alpha_2, \cos\beta_2, \cos\gamma_2)$, their mutual angular separation $\theta$ is:
$$\cos\theta = \cos\alpha_1 \cos\alpha_2 + \cos\beta_1 \cos\beta_2 + \cos\gamma_1 \cos\gamma_2$$

This provides a direct spherical-trigonometric bridge between coordinate axes and arbitrary directions in 3D space.

---

### Section 4.7 Game Engine Applications

The dot product is the workhorse of 3D computer graphics, physics simulation, and game AI. Here are three ubiquitous production applications:

#### 1. Backface Culling in Graphics Pipelines
In a 3D scene, rendering faces that are pointed away from the camera wastes massive GPU rasterization bandwidth.
Let $\mathbf{N}$ be the outward-pointing unit normal of a triangle, and $\mathbf{V}$ be the view vector from the surface point towards the camera:
$$\mathbf{V} = \frac{\mathbf{P}_{\text{camera}} - \mathbf{P}_{\text{surface}}}{\|\mathbf{P}_{\text{camera}} - \mathbf{P}_{\text{surface}}\|}$$
- If $\mathbf{N} \cdot \mathbf{V} > 0$: The triangle faces the camera (front-facing) $\implies$ **Render**.
- If $\mathbf{N} \cdot \mathbf{V} \le 0$: The triangle faces away or is seen edge-on $\implies$ **Cull (Discard)**.

```
            Camera
              \
           V   \
                v
       ------------------- Surface
                 ^
                 |  N
            (Front-facing: N Â· V > 0)
```

#### 2. Diffuse Lambertian Reflectance (Lighting)
According to Lambert's Cosine Law, the intensity of light reflected from an ideal matte surface is proportional to the cosine of the angle between the surface normal $\mathbf{N}$ and the direction vector to the light source $\mathbf{L}$:
$$I_{\text{diffuse}} = I_{\text{light}} \cdot k_d \cdot \max(0, \hat{\mathbf{N}} \cdot \hat{\mathbf{L}})$$
Where $k_d$ is the diffuse reflection coefficient. The `max(0, ...)` ensures that surfaces turned away from the light receive zero direct illumination rather than negative light.

#### 3. AI Cone of Vision / Field of View (FOV) Checks
In stealth or combat games, an enemy guard located at position $\mathbf{P}_e$ with forward facing direction unit vector $\hat{\mathbf{f}}$ needs to determine if the player at $\mathbf{P}_p$ is inside their visual cone of half-angle $\theta_{\text{half}}$ (e.g., $45^\circ$, where full FOV is $90^\circ$):
1. Compute the displacement vector to the player: $\mathbf{d} = \mathbf{P}_p - \mathbf{P}_e$.
2. Check range: if $\|\mathbf{d}\| > R_{\text{vision}}$, the player is too far.
3. Normalize direction: $\hat{\mathbf{d}} = \frac{\mathbf{d}}{\|\mathbf{d}\|}$.
4. Compare cosine:
   $$\hat{\mathbf{f}} \cdot \hat{\mathbf{d}} \ge \cos(\theta_{\text{half}})$$
   If true, the player is within the guard's field of view! Notice that we do **not** need to call `Math.acos`: comparing the dot product directly to the precomputed scalar $\cos(\theta_{\text{half}})$ saves expensive transcendental function calls across thousands of AI agents per frame.

---

### Section 4.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 4.1: Basic 3D Dot Product and Angle Calculation
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 2 \\ -1 \\ 2 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}$:
1. Compute $\mathbf{u} \cdot \mathbf{v}$.
2. Compute $\|\mathbf{u}\|$ and $\|\mathbf{v}\|$.
3. Find the angle $\theta$ between them in both radians and degrees.

**Solution:**
1. Apply the algebraic formula:
   $$\mathbf{u} \cdot \mathbf{v} = (2)(0) + (-1)(3) + (2)(4) = 0 - 3 + 8 = 5$$
2. Compute Euclidean norms:
   $$\|\mathbf{u}\| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{4 + 1 + 4} = \sqrt{9} = 3$$
   $$\|\mathbf{v}\| = \sqrt{0^2 + 3^2 + 4^2} = \sqrt{0 + 9 + 16} = \sqrt{25} = 5$$
3. Compute the cosine and angle:
   $$\cos\theta = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\|\mathbf{v}\|} = \frac{5}{(3)(5)} = \frac{5}{15} = \frac{1}{3} \approx 0.333333$$
   $$\theta = \arccos\left(\frac{1}{3}\right) \approx 1.230959 \text{ rad}$$
   $$\theta_{\text{deg}} = 1.230959 \times \frac{180^\circ}{\pi} \approx 70.528779^\circ \approx 70.53^\circ$$

---

#### Example 4.2: Determining Orthogonality in Space
**Problem:** Find the value of scalar $k$ such that the vectors $\mathbf{a} = \begin{bmatrix} 3 \\ k \\ -2 \end{bmatrix}$ and $\mathbf{b} = \begin{bmatrix} 4 \\ 2 \\ 5 \end{bmatrix}$ are mutually perpendicular.

**Solution:**
Two vectors are perpendicular if and only if their dot product equals zero:
$$\mathbf{a} \cdot \mathbf{b} = 0$$
Substitute the components:
$$(3)(4) + (k)(2) + (-2)(5) = 0$$
$$12 + 2k - 10 = 0$$
$$2 + 2k = 0 \implies 2k = -2 \implies k = -1$$
*Verification:*
$$\mathbf{a} \cdot \mathbf{b} = (3)(4) + (-1)(2) + (-2)(5) = 12 - 2 - 10 = 0 \quad \checkmark$$

---

#### Example 4.3: Orthogonal Vector Construction
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, find two non-collinear vectors $\mathbf{v}$ and $\mathbf{w}$ that are both orthogonal to $\mathbf{u}$.

**Solution:**
A vector $\mathbf{x} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}$ is orthogonal to $\mathbf{u}$ if:
$$\mathbf{u} \cdot \mathbf{x} = 1x + 2y + 3z = 0$$
This is a single linear equation with three unknowns (defining a 2D plane through the origin). We have two free degrees of freedom.
1. Choose $z = 0$ and $y = 1$:
   $$x + 2(1) + 3(0) = 0 \implies x = -2$$
   Thus, $\mathbf{v} = \begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix}$. Check: $(1)(-2) + (2)(1) + (3)(0) = -2 + 2 + 0 = 0$.
2. Choose $y = 0$ and $z = 1$:
   $$x + 2(0) + 3(1) = 0 \implies x = -3$$
   Thus, $\mathbf{w} = \begin{bmatrix} -3 \\ 0 \\ 1 \end{bmatrix}$. Check: $(1)(-3) + (2)(0) + (3)(1) = -3 + 0 + 3 = 0$.
Notice that $\mathbf{v}$ and $\mathbf{w}$ are not scalar multiples of each other: their ratios $-\frac{2}{-3} \ne \frac{1}{0}$. Hence they are linearly independent and span the normal plane.

---

#### Example 4.4: Cauchy-Schwarz Inequality Verification
**Problem:** Rigorously verify the Cauchy-Schwarz inequality $|\mathbf{u} \cdot \mathbf{v}| \le \|\mathbf{u}\|\|\mathbf{v}\|$ for $\mathbf{u} = \begin{bmatrix} -1 \\ 2 \\ -2 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 4 \\ 3 \\ -5 \end{bmatrix}$.

**Solution:**
1. Compute the dot product:
   $$\mathbf{u} \cdot \mathbf{v} = (-1)(4) + (2)(3) + (-2)(-5) = -4 + 6 + 10 = 12$$
   Absolute value: $|\mathbf{u} \cdot \mathbf{v}| = 12$.
2. Compute the norms:
   $$\|\mathbf{u}\| = \sqrt{(-1)^2 + 2^2 + (-2)^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
   $$\|\mathbf{v}\| = \sqrt{4^2 + 3^2 + (-5)^2} = \sqrt{16 + 9 + 25} = \sqrt{50} = 5\sqrt{2} \approx 7.071068$$
3. Compute the product of norms:
   $$\|\mathbf{u}\|\|\mathbf{v}\| = 3 \times 5\sqrt{2} = 15\sqrt{2} = \sqrt{225 \times 2} = \sqrt{450} \approx 21.213203$$
4. Check inequality:
   $$12 \le 15\sqrt{2} \iff 12^2 \le (15\sqrt{2})^2 \iff 144 \le 450 \quad \checkmark$$
The inequality holds strictly because $\mathbf{u}$ and $\mathbf{v}$ are not parallel.

---

#### Example 4.5: Triangle Interior Angles in 3D Space
**Problem:** A triangle in 3D space has vertices $A(1, 0, 1)$, $B(3, 2, 0)$, and $C(1, 4, 3)$. Find the interior angle at vertex $A$.

**Solution:**
The angle at vertex $A$ is the angle between the vectors $\vec{AB}$ and $\vec{AC}$:
$$\vec{AB} = B - A = \begin{bmatrix} 3 - 1 \\ 2 - 0 \\ 0 - 1 \end{bmatrix} = \begin{bmatrix} 2 \\ 2 \\ -1 \end{bmatrix}$$
$$\vec{AC} = C - A = \begin{bmatrix} 1 - 1 \\ 4 - 0 \\ 3 - 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 4 \\ 2 \end{bmatrix}$$
1. Compute dot product $\vec{AB} \cdot \vec{AC}$:
   $$\vec{AB} \cdot \vec{AC} = (2)(0) + (2)(4) + (-1)(2) = 0 + 8 - 2 = 6$$
2. Compute lengths:
   $$\|\vec{AB}\| = \sqrt{2^2 + 2^2 + (-1)^2} = \sqrt{4 + 4 + 1} = \sqrt{9} = 3$$
   $$\|\vec{AC}\| = \sqrt{0^2 + 4^2 + 2^2} = \sqrt{0 + 16 + 4} = \sqrt{20} = 2\sqrt{5}$$
3. Compute angle $\angle A$:
   $$\cos A = \frac{\vec{AB} \cdot \vec{AC}}{\|\vec{AB}\|\|\vec{AC}\|} = \frac{6}{(3)(2\sqrt{5})} = \frac{6}{6\sqrt{5}} = \frac{1}{\sqrt{5}} = \frac{\sqrt{5}}{5} \approx 0.447214$$
   $$A = \arccos\left(\frac{1}{\sqrt{5}}\right) \approx 1.107149 \text{ rad} \approx 63.4349^\circ \approx 63.43^\circ$$

---

#### Example 4.6: Direction Cosines and Relative Axis Inclination
**Problem:** A line in space has direction vector $\mathbf{d} = \begin{bmatrix} 2 \\ -3 \\ 6 \end{bmatrix}$. Find:
1. The direction cosines of $\mathbf{d}$.
2. The acute angle that $\mathbf{d}$ makes with the positive $y$-axis.

**Solution:**
1. Compute the magnitude of $\mathbf{d}$:
   $$\|\mathbf{d}\| = \sqrt{2^2 + (-3)^2 + 6^2} = \sqrt{4 + 9 + 36} = \sqrt{49} = 7$$
   The normalized unit vector is:
   $$\hat{\mathbf{d}} = \begin{bmatrix} 2/7 \\ -3/7 \\ 6/7 \end{bmatrix}$$
   The direction cosines are:
   $$\cos\alpha = \frac{2}{7}, \quad \cos\beta = -\frac{3}{7}, \quad \cos\gamma = \frac{6}{7}$$
   *Verification of sum of squares:*
   $$\left(\frac{2}{7}\right)^2 + \left(-\frac{3}{7}\right)^2 + \left(\frac{6}{7}\right)^2 = \frac{4 + 9 + 36}{49} = \frac{49}{49} = 1 \quad \checkmark$$
2. Angle with positive $y$-axis ($\mathbf{j} = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$):
   $$\cos\beta = -\frac{3}{7} \implies \beta = \arccos\left(-\frac{3}{7}\right) \approx 2.0137 \text{ rad} \approx 115.38^\circ$$
   The acute angle between the line and the $y$-axis is:
   $$\beta_{\text{acute}} = 180^\circ - 115.38^\circ = 64.62^\circ$$

---

#### Example 4.7: Graphics Backface Culling Determination
**Problem:** A 3D polygonal triangle has surface normal $\mathbf{N} = \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix}$. The triangle's centroid is at $\mathbf{P} = \begin{bmatrix} 10 \\ 5 \\ 0 \end{bmatrix}$. A perspective camera is stationed at $\mathbf{C} = \begin{bmatrix} 2 \\ -1 \\ 0 \end{bmatrix}$. Determine whether this polygon should be culled or rendered.

**Solution:**
1. Determine the view vector $\mathbf{V}$ pointing from the surface point $\mathbf{P}$ to the camera $\mathbf{C}$:
   $$\mathbf{V} = \mathbf{C} - \mathbf{P} = \begin{bmatrix} 2 - 10 \\ -1 - 5 \\ 0 - 0 \end{bmatrix} = \begin{bmatrix} -8 \\ -6 \\ 0 \end{bmatrix}$$
2. Compute the dot product between the surface normal $\mathbf{N}$ and the view vector $\mathbf{V}$:
   $$\mathbf{N} \cdot \mathbf{V} = (0.6)(-8) + (0.8)(-6) + (0)(0) = -4.8 - 4.8 + 0 = -9.6$$
3. Evaluation:
   Since $\mathbf{N} \cdot \mathbf{V} = -9.6 < 0$, the surface normal points away from the camera.
   **Decision:** The polygon faces away from the camera and is **CULLED** (discarded).

---

#### Example 4.8: Lambertian Diffuse Lighting Calculation
**Problem:** A terrain point has unit normal $\hat{\mathbf{N}} = \begin{bmatrix} 0 \\ 0.8 \\ 0.6 \end{bmatrix}$. A directional sun light shines down along vector $\mathbf{d}_{\text{sun}} = \begin{bmatrix} 1 \\ -2 \\ -2 \end{bmatrix}$. If light intensity $I_0 = 100 \text{ Lux}$ and diffuse albedo $k_d = 0.75$, calculate the perceived diffuse illuminance at the surface.

**Solution:**
1. The light direction vector $\hat{\mathbf{L}}$ points *towards* the light source, which is opposite to the sunlight travel direction:
   $$\mathbf{L} = -\mathbf{d}_{\text{sun}} = \begin{bmatrix} -1 \\ 2 \\ 2 \end{bmatrix}$$
2. Normalize $\mathbf{L}$:
   $$\|\mathbf{L}\| = \sqrt{(-1)^2 + 2^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
   $$\hat{\mathbf{L}} = \begin{bmatrix} -1/3 \\ 2/3 \\ 2/3 \end{bmatrix}$$
3. Compute the Lambertian cosine factor $\hat{\mathbf{N}} \cdot \hat{\mathbf{L}}$:
   $$\hat{\mathbf{N}} \cdot \hat{\mathbf{L}} = (0)\left(-\frac{1}{3}\right) + (0.8)\left(\frac{2}{3}\right) + (0.6)\left(\frac{2}{3}\right) = 0 + \frac{1.6}{3} + \frac{1.2}{3} = \frac{2.8}{3} \approx 0.933333$$
4. Compute diffuse illuminance:
   $$I_{\text{diffuse}} = I_0 \cdot k_d \cdot \max(0, \hat{\mathbf{N}} \cdot \hat{\mathbf{L}}) = 100 \times 0.75 \times \frac{2.8}{3} = 75 \times 0.933333 = 70.0 \text{ Lux}$$

---

#### Example 4.9: Guard AI Field of View (FOV) Detection
**Problem:** A security bot in a stealth game is located at $\mathbf{P}_{\text{bot}} = (5, 0, 5)$ facing along horizontal direction vector $\mathbf{f} = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}$. The bot has a visual half-angle $\theta_{\text{half}} = 45^\circ$ and maximum detection range $R_{\max} = 15 \text{ m}$. A stealth player is at position $\mathbf{P}_{\text{player}} = (12, 0, 8)$. Determine if the bot detects the player.

**Solution:**
1. Calculate the displacement vector from bot to player:
   $$\mathbf{d} = \mathbf{P}_{\text{player}} - \mathbf{P}_{\text{bot}} = \begin{bmatrix} 12 - 5 \\ 0 - 0 \\ 8 - 5 \end{bmatrix} = \begin{bmatrix} 7 \\ 0 \\ 3 \end{bmatrix}$$
2. Check distance range:
   $$\|\mathbf{d}\|^2 = 7^2 + 0^2 + 3^2 = 49 + 0 + 9 = 58$$
   $$R_{\max}^2 = 15^2 = 225$$
   Since $\|\mathbf{d}\|^2 = 58 \le 225$, the player is well within range ($d \approx 7.616 \text{ m}$).
3. Normalize the forward facing vector $\mathbf{f}$:
   $$\|\mathbf{f}\| = \sqrt{1^2 + 0^2 + 1^2} = \sqrt{2} \implies \hat{\mathbf{f}} = \begin{bmatrix} 1/\sqrt{2} \\ 0 \\ 1/\sqrt{2} \end{bmatrix}$$
4. Compute the cosine of the angle between $\mathbf{f}$ and $\mathbf{d}$:
   $$\mathbf{f} \cdot \mathbf{d} = (1)(7) + (0)(0) + (1)(3) = 7 + 3 = 10$$
   $$\|\mathbf{f}\|\|\mathbf{d}\| = \sqrt{2} \times \sqrt{58} = \sqrt{116} = \sqrt{4 \times 29} = 2\sqrt{29} \approx 10.77033$$
   $$\cos\theta = \frac{10}{2\sqrt{29}} = \frac{5}{\sqrt{29}} \approx \frac{5}{5.385165} \approx 0.928477$$
5. Compare with FOV threshold:
   $$\cos(\theta_{\text{half}}) = \cos(45^\circ) = \frac{\sqrt{2}}{2} \approx 0.707107$$
   Since $\cos\theta \approx 0.9285 \ge 0.7071$, the angle $\theta \approx 21.8^\circ \le 45^\circ$.
**Conclusion:** The player is inside the guard's cone of vision and is **DETECTED**.

---

#### Example 4.10: Numerical Stability Clamping Demonstration
**Problem:** In a single-precision physics engine, two nearly parallel unit vectors evaluate to:
$$\hat{\mathbf{u}} = \begin{bmatrix} 0.57735026 \\ 0.57735026 \\ 0.57735026 \end{bmatrix}, \quad \hat{\mathbf{v}} = \begin{bmatrix} 0.57735026 \\ 0.57735026 \\ 0.57735026 \end{bmatrix}$$
Show how floating-point roundoff can produce an invalid argument to $\arccos$, and show how clamping restores numerical stability.

**Solution:**
1. Compute the dot product algebraically:
   $$\hat{\mathbf{u}} \cdot \hat{\mathbf{v}} = 3 \times (0.57735026)^2 = 3 \times 0.3333333226 = 1.0000000278$$
2. Without clamping:
   $$\text{argument} = 1.0000000278 > 1.0$$
   Computing $\arccos(1.0000000278)$ in IEEE 754 math produces `NaN` because the domain of real $\arccos(x)$ is strictly $[-1, 1]$.
3. Applying clamping:
   $$\text{clamped} = \min(1.0, \max(-1.0, 1.0000000278)) = 1.0$$
   $$\theta = \arccos(1.0) = 0.0 \text{ rad} = 0.0^\circ$$
The physics engine correctly computes an angular separation of $0^\circ$ and avoids system-wide `NaN` contamination.

---

### Section 4.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 4.1
**Problem:** Calculate the dot product of $\mathbf{u} = \begin{bmatrix} -5 \\ 12 \\ 4 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 6 \\ 2 \\ -3 \end{bmatrix}$.
**Solution:**
$$\mathbf{u} \cdot \mathbf{v} = (-5)(6) + (12)(2) + (4)(-3) = -30 + 24 - 12 = -18$$
The negative dot product signifies an obtuse angle between the two vectors.

---

#### Exercise 4.2
**Problem:** Determine if the angle between $\mathbf{u} = \begin{bmatrix} 3 \\ -2 \\ 7 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} -4 \\ 5 \\ 3 \end{bmatrix}$ is acute, right, or obtuse without computing the inverse cosine.
**Solution:**
Compute $\mathbf{u} \cdot \mathbf{v}$:
$$\mathbf{u} \cdot \mathbf{v} = (3)(-4) + (-2)(5) + (7)(3) = -12 - 10 + 21 = -1$$
Since $\mathbf{u} \cdot \mathbf{v} = -1 < 0$, $\cos\theta < 0$, which strictly implies that the angle is **obtuse** ($\theta \in (90^\circ, 180^\circ]$).

---

#### Exercise 4.3
**Problem:** Find the exact angle $\theta$ between vectors $\mathbf{u} = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix}$.
**Solution:**
1. Dot product:
   $$\mathbf{u} \cdot \mathbf{v} = (1)(0) + (1)(1) + (0)(1) = 1$$
2. Lengths:
   $$\|\mathbf{u}\| = \sqrt{1^2 + 1^2 + 0^2} = \sqrt{2}$$
   $$\|\mathbf{v}\| = \sqrt{0^2 + 1^2 + 1^2} = \sqrt{2}$$
3. Cosine:
   $$\cos\theta = \frac{1}{\sqrt{2} \times \sqrt{2}} = \frac{1}{2}$$
4. Exact angle:
   $$\theta = \arccos\left(\frac{1}{2}\right) = \frac{\pi}{3} \text{ rad} = 60^\circ$$

---

#### Exercise 4.4
**Problem:** For what value of $\lambda$ are the vectors $\mathbf{a} = \begin{bmatrix} \lambda \\ 4 \\ -3 \end{bmatrix}$ and $\mathbf{b} = \begin{bmatrix} 2 \\ \lambda \\ 6 \end{bmatrix}$ perpendicular?
**Solution:**
Set $\mathbf{a} \cdot \mathbf{b} = 0$:
$$(\lambda)(2) + (4)(\lambda) + (-3)(6) = 0$$
$$2\lambda + 4\lambda - 18 = 0$$
$$6\lambda = 18 \implies \lambda = 3$$
Check: $(3)(2) + (4)(3) + (-3)(6) = 6 + 12 - 18 = 0$.

---

#### Exercise 4.5
**Problem:** Prove algebraically that $\|\mathbf{u} + \mathbf{v}\|^2 + \|\mathbf{u} - \mathbf{v}\|^2 = 2\|\mathbf{u}\|^2 + 2\|\mathbf{v}\|^2$ for all $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$ (The Parallelogram Law).
**Solution:**
Expand each term using inner product axioms:
$$\|\mathbf{u} + \mathbf{v}\|^2 = (\mathbf{u} + \mathbf{v}) \cdot (\mathbf{u} + \mathbf{v}) = \|\mathbf{u}\|^2 + 2(\mathbf{u} \cdot \mathbf{v}) + \|\mathbf{v}\|^2$$
$$\|\mathbf{u} - \mathbf{v}\|^2 = (\mathbf{u} - \mathbf{v}) \cdot (\mathbf{u} - \mathbf{v}) = \|\mathbf{u}\|^2 - 2(\mathbf{u} \cdot \mathbf{v}) + \|\mathbf{v}\|^2$$
Summing the two equations:
$$\|\mathbf{u} + \mathbf{v}\|^2 + \|\mathbf{u} - \mathbf{v}\|^2 = (\|\mathbf{u}\|^2 + \|\mathbf{u}\|^2) + (2\mathbf{u}\cdot\mathbf{v} - 2\mathbf{u}\cdot\mathbf{v}) + (\|\mathbf{v}\|^2 + \|\mathbf{v}\|^2)$$
$$= 2\|\mathbf{u}\|^2 + 2\|\mathbf{v}\|^2 \quad \blacksquare$$

---

#### Exercise 4.6
**Problem:** Prove the Polarization Identity in $\mathbb{R}^3$:
$$\mathbf{u} \cdot \mathbf{v} = \frac{1}{4}\left(\|\mathbf{u} + \mathbf{v}\|^2 - \|\mathbf{u} - \mathbf{v}\|^2\right)$$
**Solution:**
From Exercise 4.5:
$$\|\mathbf{u} + \mathbf{v}\|^2 = \|\mathbf{u}\|^2 + 2(\mathbf{u} \cdot \mathbf{v}) + \|\mathbf{v}\|^2$$
$$\|\mathbf{u} - \mathbf{v}\|^2 = \|\mathbf{u}\|^2 - 2(\mathbf{u} \cdot \mathbf{v}) + \|\mathbf{v}\|^2$$
Subtracting the second equation from the first:
$$\|\mathbf{u} + \mathbf{v}\|^2 - \|\mathbf{u} - \mathbf{v}\|^2 = 4(\mathbf{u} \cdot \mathbf{v})$$
Dividing both sides by 4:
$$\mathbf{u} \cdot \mathbf{v} = \frac{1}{4}\left(\|\mathbf{u} + \mathbf{v}\|^2 - \|\mathbf{u} - \mathbf{v}\|^2\right) \quad \blacksquare$$

---

#### Exercise 4.7
**Problem:** Find the angle between the space diagonal of a unit cube and one of its edge vectors.
**Solution:**
Place the cube in the first octant with vertices from $(0,0,0)$ to $(1,1,1)$.
The space diagonal vector is $\mathbf{d} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.
Choose the edge vector along the $x$-axis: $\mathbf{e}_x = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$.
1. Dot product:
   $$\mathbf{d} \cdot \mathbf{e}_x = (1)(1) + (1)(0) + (1)(0) = 1$$
2. Lengths:
   $$\|\mathbf{d}\| = \sqrt{1^2 + 1^2 + 1^2} = \sqrt{3}$$
   $$\|\mathbf{e}_x\| = \sqrt{1^2 + 0^2 + 0^2} = 1$$
3. Angle:
   $$\cos\theta = \frac{1}{\sqrt{3} \times 1} = \frac{1}{\sqrt{3}} = \frac{\sqrt{3}}{3} \approx 0.577350$$
   $$\theta = \arccos\left(\frac{1}{\sqrt{3}}\right) \approx 0.955317 \text{ rad} \approx 54.7356^\circ \approx 54.74^\circ$$

---

#### Exercise 4.8
**Problem:** Find the angle between two space diagonals of a unit cube.
**Solution:**
Consider the two space diagonals:
$\mathbf{d}_1 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ (from $(0,0,0)$ to $(1,1,1)$)
$\mathbf{d}_2 = \begin{bmatrix} 1 \\ 1 \\ -1 \end{bmatrix}$ (from $(0,0,1)$ to $(1,1,0)$)
1. Dot product:
   $$\mathbf{d}_1 \cdot \mathbf{d}_2 = (1)(1) + (1)(1) + (1)(-1) = 1 + 1 - 1 = 1$$
2. Lengths:
   $$\|\mathbf{d}_1\| = \sqrt{3}, \quad \|\mathbf{d}_2\| = \sqrt{1^2 + 1^2 + (-1)^2} = \sqrt{3}$$
3. Angle:
   $$\cos\theta = \frac{1}{\sqrt{3} \times \sqrt{3}} = \frac{1}{3}$$
   $$\theta = \arccos\left(\frac{1}{3}\right) \approx 1.230959 \text{ rad} \approx 70.5288^\circ \approx 70.53^\circ$$
(The obtuse supplement is $180^\circ - 70.53^\circ = 109.47^\circ$, the well-known tetrahedral bond angle of methane).

---

#### Exercise 4.9
**Problem:** A spacecraft is oriented with forward thruster pointing along $\hat{\mathbf{T}} = \begin{bmatrix} 0.8 \\ 0 \\ 0.6 \end{bmatrix}$. The flight computer requires course correction toward waypoint direction $\hat{\mathbf{W}} = \begin{bmatrix} 0 \\ 0.6 \\ 0.8 \end{bmatrix}$. Calculate the required rotation angle of the thruster gimbal.
**Solution:**
Verify unit vectors:
$$\|\hat{\mathbf{T}}\| = \sqrt{0.8^2 + 0^2 + 0.6^2} = \sqrt{0.64 + 0.36} = 1.0$$
$$\|\hat{\mathbf{W}}\| = \sqrt{0^2 + 0.6^2 + 0.8^2} = \sqrt{0.36 + 0.64} = 1.0$$
Compute dot product:
$$\hat{\mathbf{T}} \cdot \hat{\mathbf{W}} = (0.8)(0) + (0)(0.6) + (0.6)(0.8) = 0 + 0 + 0.48 = 0.48$$
Compute gimbal angle:
$$\theta = \arccos(0.48) \approx 1.07014 \text{ rad} \approx 61.3146^\circ \approx 61.31^\circ$$

---

#### Exercise 4.10
**Problem:** In a radar tracking installation, a missile velocity vector is reported as $\mathbf{v} = \begin{bmatrix} 400 \\ -300 \\ 500 \end{bmatrix} \text{ m/s}$. Find the angle of climb $\phi$ above the horizontal ground plane ($xy$-plane).
**Solution:**
1. The horizontal ground plane is perpendicular to the vertical unit vector $\mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$.
2. The angle $\psi$ between $\mathbf{v}$ and the vertical axis $\mathbf{k}$ is:
   $$\mathbf{v} \cdot \mathbf{k} = v_z = 500$$
   $$\|\mathbf{v}\| = \sqrt{400^2 + (-300)^2 + 500^2} = \sqrt{160000 + 90000 + 250000} = \sqrt{500000} = 500\sqrt{2} \approx 707.1068 \text{ m/s}$$
   $$\cos\psi = \frac{500}{500\sqrt{2}} = \frac{1}{\sqrt{2}} \implies \psi = 45^\circ$$
3. The angle of climb $\phi$ above the horizontal plane is the complement of $\psi$:
   $$\phi = 90^\circ - \psi = 90^\circ - 45^\circ = 45^\circ$$
The missile climbs at an angle of exactly $45^\circ$ above the horizontal ground.

# Chapter 5: Vector Projections, Orthogonal Decompositions, and Gram-Schmidt in 3D

> *"The mind cannot conceive of any change of coordinate system without the operation of projecting the old upon the new, resolving the complex whole into its independent, orthogonal limbs."*  
> â€” **Arthur Cayley**, *Collected Mathematical Papers* (1889)

---

### Section 5.1 Scalar Projection (Component) of $\mathbf{u}$ onto $\mathbf{v}$

When analyzing physical systems in three dimensionsâ€”such as an aircraft experiencing a crosswind, a robotic manipulator pushing against a surface, or light reflecting off a faceted prismâ€”we frequently need to answer a fundamental question:  
*How much of vector $\mathbf{u}$ acts in the direction of vector $\mathbf{v}$?*

Let $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$, with $\mathbf{v} \ne \mathbf{0}$. Let $\theta$ be the spatial angle between them ($0 \le \theta \le \pi$).

```
                u
               /|
              / |
             /  |
            /   |
           /    |
          /     |
         +------+----------> v
         0    proj_v(u)
         |------|
         comp_v(u)
```

The **scalar projection** (also termed the *scalar component*) of $\mathbf{u}$ onto $\mathbf{v}$, denoted $\text{comp}_{\mathbf{v}}(\mathbf{u})$, is the signed length of the shadow cast by $\mathbf{u}$ onto the infinite line containing $\mathbf{v}$:
$$\text{comp}_{\mathbf{v}}(\mathbf{u}) \equiv \|\mathbf{u}\| \cos\theta$$

Recalling from Chapter 4 that $\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$, we can isolate $\|\mathbf{u}\| \cos\theta$ by dividing both sides by $\|\mathbf{v}\|$:
$$\text{comp}_{\mathbf{v}}(\mathbf{u}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|}$$

Notice that if we define the normalized unit vector in the direction of $\mathbf{v}$ as $\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$, the scalar projection simplifies beautifully to:
$$\text{comp}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} \cdot \hat{\mathbf{v}}$$

#### Properties of the Scalar Projection:
1. **Signed Nature:**
   - If $0 \le \theta < \frac{\pi}{2}$ (acute), $\cos\theta > 0$, so $\text{comp}_{\mathbf{v}}(\mathbf{u}) > 0$ (points in the direction of $\mathbf{v}$).
   - If $\theta = \frac{\pi}{2}$ (orthogonal), $\cos\theta = 0$, so $\text{comp}_{\mathbf{v}}(\mathbf{u}) = 0$.
   - If $\frac{\pi}{2} < \theta \le \pi$ (obtuse), $\cos\theta < 0$, so $\text{comp}_{\mathbf{v}}(\mathbf{u}) < 0$ (points opposite to $\mathbf{v}$).
2. **Units:** The scalar projection carries the same physical units as $\mathbf{u}$ (e.g., Newtons if $\mathbf{u}$ is a force vector, or meters per second if $\mathbf{u}$ is velocity).

---

### Section 5.2 Vector Projection: Parallel Component $\mathbf{u}_{\parallel}$

While the scalar projection $\text{comp}_{\mathbf{v}}(\mathbf{u})$ gives the *magnitude and sign*, the **vector projection** of $\mathbf{u}$ onto $\mathbf{v}$, denoted $\text{proj}_{\mathbf{v}}(\mathbf{u})$ or $\mathbf{u}_{\parallel}$, is an actual 3D vector. It points in the direction of $\mathbf{v}$ (or opposite to $\mathbf{v}$ if the scalar projection is negative) with length equal to $|\text{comp}_{\mathbf{v}}(\mathbf{u})|$.

To construct this vector, we simply multiply the scalar projection by the unit direction vector $\hat{\mathbf{v}}$:
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\text{comp}_{\mathbf{v}}(\mathbf{u})\right) \hat{\mathbf{v}} = (\mathbf{u} \cdot \hat{\mathbf{v}}) \hat{\mathbf{v}}$$

Substituting $\hat{\mathbf{v}} = \frac{\mathbf{v}}{\|\mathbf{v}\|}$:
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\mathbf{u} \cdot \frac{\mathbf{v}}{\|\mathbf{v}\|}\right) \frac{\mathbf{v}}{\|\mathbf{v}\|} = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}\right) \mathbf{v}$$

Recalling that $\|\mathbf{v}\|^2 = \mathbf{v} \cdot \mathbf{v}$:
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v}$$

#### Computational Efficiency:
Notice that this closed-form expression $\left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right)\mathbf{v}$ requires **zero square roots**!
Square roots (`Math.sqrt` or `sqrtf`) are computationally expensive (taking 10â€“15 CPU clock cycles). Computing $\text{proj}_{\mathbf{v}}(\mathbf{u})$ directly requires only two dot products (6 multiplications, 4 additions), one floating-point division, and one scalar-vector multiply (3 multiplications). This optimization is vital in high-frequency physics engines executing millions of projection operations per second.

---

### Section 5.3 Vector Rejection: Perpendicular Component $\mathbf{u}_{\perp}$

Every vector $\mathbf{u} \in \mathbb{R}^3$ can be decomposed uniquely into the sum of two orthogonal vectors relative to a reference direction $\mathbf{v}$:
$$\mathbf{u} = \mathbf{u}_{\parallel} + \mathbf{u}_{\perp}$$
where:
- $\mathbf{u}_{\parallel} = \text{proj}_{\mathbf{v}}(\mathbf{u})$ is parallel to $\mathbf{v}$.
- $\mathbf{u}_{\perp}$ is perpendicular (orthogonal) to $\mathbf{v}$.

The perpendicular component $\mathbf{u}_{\perp}$ is called the **vector rejection** of $\mathbf{u}$ from $\mathbf{v}$, denoted $\text{perp}_{\mathbf{v}}(\mathbf{u})$:
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \equiv \mathbf{u} - \text{proj}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} - \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v}$$

#### Rigorous Proof of Orthogonality:
We must prove that $\text{perp}_{\mathbf{v}}(\mathbf{u})$ is strictly orthogonal to $\mathbf{v}$, i.e., $\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = 0$:

$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = \left(\mathbf{u} - \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v}\right) \cdot \mathbf{v}$$

By bilinearity of the dot product:
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = \mathbf{u} \cdot \mathbf{v} - \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) (\mathbf{v} \cdot \mathbf{v})$$

The scalar $(\mathbf{v} \cdot \mathbf{v})$ in the denominator cancels with $(\mathbf{v} \cdot \mathbf{v})$ in the numerator:
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) \cdot \mathbf{v} = \mathbf{u} \cdot \mathbf{v} - \mathbf{u} \cdot \mathbf{v} = 0 \quad \blacksquare$$

#### The Pythagorean Verification:
Since $\mathbf{u}_{\parallel}$ and $\mathbf{u}_{\perp}$ are strictly orthogonal, the Pythagorean theorem must hold:
$$\|\mathbf{u}\|^2 = \|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2$$
*Proof:*
$$\|\mathbf{u}\|^2 = (\mathbf{u}_{\parallel} + \mathbf{u}_{\perp}) \cdot (\mathbf{u}_{\parallel} + \mathbf{u}_{\perp}) = \|\mathbf{u}_{\parallel}\|^2 + 2(\mathbf{u}_{\parallel} \cdot \mathbf{u}_{\perp}) + \|\mathbf{u}_{\perp}\|^2$$
Since $\mathbf{u}_{\parallel} \parallel \mathbf{v}$ and $\mathbf{u}_{\perp} \perp \mathbf{v}$, their dot product is identically zero:
$$\|\mathbf{u}\|^2 = \|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2 \quad \blacksquare$$

---

### Section 5.4 Physics Applications: Incline Planes and Contact Friction Resolution

In classical mechanics and game physics engines, contact manifolds require decomposing forces and velocities relative to surface contact normals:

```
               \  F_total
                \
                 \
       -----------+------------ Normal n
                 /|
        F_normal/ |
               /  | F_tangent
              v   v
       ======================== Surface Plane
```

#### 1. Contact Force Resolution
When an external force $\mathbf{F}_{\text{ext}}$ acts on a rigid body resting on an arbitrary 3D collision plane with unit surface normal $\hat{\mathbf{n}}$:
1. The **normal force component** pushing directly into the surface is:
   $$\mathbf{F}_n = (\mathbf{F}_{\text{ext}} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
2. The **tangential shear force component** attempting to slide the body along the surface is:
   $$\mathbf{F}_t = \mathbf{F}_{\text{ext}} - \mathbf{F}_n = \mathbf{F}_{\text{ext}} - (\mathbf{F}_{\text{ext}} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
3. Coulomb Friction Law:
   The maximum static friction before sliding occurs is:
   $$F_{\text{friction, max}} = \mu_s \|\mathbf{F}_n\|$$
   - If $\|\mathbf{F}_t\| \le \mu_s \|\mathbf{F}_n\|$, the body remains stationary (static friction balances $\mathbf{F}_t$).
   - If $\|\mathbf{F}_t\| > \mu_s \|\mathbf{F}_n\|$, the body slips, and kinetic friction acts antiparallel to the tangential sliding velocity:
     $$\mathbf{F}_{\text{kinetic}} = -\mu_k \|\mathbf{F}_n\| \frac{\mathbf{v}_t}{\|\mathbf{v}_t\|}$$

#### 2. Elastic Collision Velocity Reflection
When a particle with velocity $\mathbf{v}$ collides with a rigid immovable plane having unit normal $\hat{\mathbf{n}}$ and coefficient of restitution $e \in [0, 1]$:
$$\mathbf{v}_n = (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
$$\mathbf{v}_t = \mathbf{v} - \mathbf{v}_n$$
The post-collision velocity is:
$$\mathbf{v}' = \mathbf{v}_t - e \mathbf{v}_n = (\mathbf{v} - \mathbf{v}_n) - e \mathbf{v}_n = \mathbf{v} - (1 + e)(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
For a perfectly elastic collision ($e = 1$):
$$\mathbf{v}' = \mathbf{v} - 2(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
This is the famous vector reflection formula used in optics raytracing and physics simulators worldwide.

---

### Section 5.5 The Gram-Schmidt Orthonormalization Process in $\mathbb{R}^3$

Given any three linearly independent vectors $\{\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3\}$ spanning $\mathbb{R}^3$, how do we construct a mutually perpendicular set of unit vectors $\{\mathbf{q}_1, \mathbf{q}_2, \mathbf{q}_3\}$ that spans the exact same space?

This algorithm is the **Gram-Schmidt Orthonormalization Process**. It proceeds inductively by stripping away parallel projections at each stage:

```
Step 1: Choose v1
        u1 = v1
        q1 = u1 / ||u1||

Step 2: Strip projection of v2 onto q1
        u2 = v2 - (v2 Â· q1) q1
        q2 = u2 / ||u2||

Step 3: Strip projections of v3 onto q1 AND q2
        u3 = v3 - (v3 Â· q1) q1 - (v3 Â· q2) q2
        q3 = u3 / ||u3||
```

#### Detailed Mathematical Steps:

1. **Step 1 (First Basis Vector):**
   Take the first vector as our reference direction:
   $$\mathbf{u}_1 = \mathbf{v}_1$$
   Normalize to unit length:
   $$\mathbf{q}_1 = \frac{\mathbf{u}_1}{\|\mathbf{u}_1\|}$$

2. **Step 2 (Second Basis Vector):**
   Project $\mathbf{v}_2$ onto $\mathbf{q}_1$ and subtract (reject):
   $$\mathbf{u}_2 = \mathbf{v}_2 - \text{proj}_{\mathbf{q}_1}(\mathbf{v}_2) = \mathbf{v}_2 - (\mathbf{v}_2 \cdot \mathbf{q}_1)\mathbf{q}_1$$
   Notice that $\mathbf{u}_2 \cdot \mathbf{q}_1 = \mathbf{v}_2 \cdot \mathbf{q}_1 - (\mathbf{v}_2 \cdot \mathbf{q}_1)(\mathbf{q}_1 \cdot \mathbf{q}_1) = 0$.
   Normalize:
   $$\mathbf{q}_2 = \frac{\mathbf{u}_2}{\|\mathbf{u}_2\|}$$

3. **Step 3 (Third Basis Vector):**
   $\mathbf{v}_3$ has components along both $\mathbf{q}_1$ and $\mathbf{q}_2$. We subtract both projections:
   $$\mathbf{u}_3 = \mathbf{v}_3 - \text{proj}_{\mathbf{q}_1}(\mathbf{v}_3) - \text{proj}_{\mathbf{q}_2}(\mathbf{v}_3) = \mathbf{v}_3 - (\mathbf{v}_3 \cdot \mathbf{q}_1)\mathbf{q}_1 - (\mathbf{v}_3 \cdot \mathbf{q}_2)\mathbf{q}_2$$
   Let us verify that $\mathbf{u}_3$ is orthogonal to $\mathbf{q}_1$:
   $$\mathbf{u}_3 \cdot \mathbf{q}_1 = \mathbf{v}_3 \cdot \mathbf{q}_1 - (\mathbf{v}_3 \cdot \mathbf{q}_1)(\mathbf{q}_1 \cdot \mathbf{q}_1) - (\mathbf{v}_3 \cdot \mathbf{q}_2)(\mathbf{q}_2 \cdot \mathbf{q}_1) = (\mathbf{v}_3 \cdot \mathbf{q}_1) - (\mathbf{v}_3 \cdot \mathbf{q}_1) - 0 = 0$$
   Similarly, $\mathbf{u}_3 \cdot \mathbf{q}_2 = 0$.
   Normalize:
   $$\mathbf{q}_3 = \frac{\mathbf{u}_3}{\|\mathbf{u}_3\|}$$

The resulting set $\{\mathbf{q}_1, \mathbf{q}_2, \mathbf{q}_3\}$ forms an **orthonormal basis** of $\mathbb{R}^3$:
$$\mathbf{q}_i \cdot \mathbf{q}_j = \delta_{ij} = \begin{cases} 1 & \text{if } i = j \\ 0 & \text{if } i \ne j \end{cases}$$

---

### Section 5.6 Camera "Look-At" Matrix Basis Construction

In 3D graphics rendering (OpenGL, Vulkan, DirectX, WebGL), setting up a virtual camera requires transforming world coordinates into the camera's local coordinate frame. This is established via a "Look-At" construction.

Given:
- Camera eye position in world space: $\mathbf{P}_{\text{eye}}$
- Target point the camera is looking at: $\mathbf{P}_{\text{target}}$
- Approximate "World Up" hint vector: $\mathbf{v}_{\text{up, world}}$ (usually $\begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$ or $\begin{bmatrix} 0 & 0 & 1 \end{bmatrix}^T$)

```
          v_up,world
             ^
             |    P_eye
             |   /  \
             |  /    \  z_cam (backward) = normalize(P_eye - P_target)
             | /      \
             +---------> P_target
```

To construct the camera's orthonormal basis vectors $\{\hat{\mathbf{r}}, \hat{\mathbf{u}}, \hat{\mathbf{f}}\}$ (Right, Up, Forward):
1. **Forward Vector $\hat{\mathbf{f}}$ (or viewing direction):**
   In right-handed camera conventions (like OpenGL), the camera looks down its negative $z$-axis. So the camera's local positive $z$-axis points backward:
   $$\mathbf{z}_{\text{cam}} = \frac{\mathbf{P}_{\text{eye}} - \mathbf{P}_{\text{target}}}{\|\mathbf{P}_{\text{eye}} - \mathbf{P}_{\text{target}}\|}$$
2. **Right Vector $\hat{\mathbf{r}}$ ($x_{\text{cam}}$):**
   The camera right vector must be perpendicular to both the viewing axis $\mathbf{z}_{\text{cam}}$ and the approximate world up vector:
   $$\mathbf{x}_{\text{cam}} = \frac{\mathbf{v}_{\text{up, world}} \times \mathbf{z}_{\text{cam}}}{\|\mathbf{v}_{\text{up, world}} \times \mathbf{z}_{\text{cam}}\|}$$
3. **True Orthogonal Camera Up Vector $\hat{\mathbf{u}}$ ($y_{\text{cam}}$):**
   Because the user-supplied $\mathbf{v}_{\text{up, world}}$ is rarely exactly perpendicular to $\mathbf{z}_{\text{cam}}$, we obtain the true camera up vector via vector rejection or cross product:
   $$\mathbf{y}_{\text{cam}} = \mathbf{z}_{\text{cam}} \times \mathbf{x}_{\text{cam}}$$
   Or via Gram-Schmidt rejection:
   $$\mathbf{y}_{\text{cam}} = \frac{\mathbf{v}_{\text{up, world}} - (\mathbf{v}_{\text{up, world}} \cdot \mathbf{z}_{\text{cam}})\mathbf{z}_{\text{cam}}}{\|\mathbf{v}_{\text{up, world}} - (\mathbf{v}_{\text{up, world}} \cdot \mathbf{z}_{\text{cam}})\mathbf{z}_{\text{cam}}\|}$$

---

### Section 5.7 Numerical Drift and Re-Orthonormalization in Game Loops

In 3D physics and flight simulators, orientation matrices are continuously integrated over thousands of frames:
$$\mathbf{R}(t + \Delta t) \approx \mathbf{R}(t) + \boldsymbol{\Omega} \mathbf{R}(t) \Delta t$$
Because floating-point arithmetic introduces tiny truncation errors at each step, after thousands of ticks the column vectors of $\mathbf{R}$ drift:
- Their lengths deviate from 1.0 (shear and scale distortion).
- Their mutual dot products deviate from 0.0 (skew and non-orthogonality).

If left uncorrected, spaceships distort into trapezoids, collision detection fails, and physics objects explode.

#### Modified Gram-Schmidt Re-Orthonormalization
To prevent drift, engines periodically (e.g., every frame or every 10 frames) apply a lightweight Gram-Schmidt re-orthonormalization to the column vectors $\mathbf{c}_0, \mathbf{c}_1, \mathbf{c}_2$ of the rotation matrix:
```typescript
function reorthonormalizeMatrix(c0: Vector3, c1: Vector3, c2: Vector3): void {
  // 1. Normalize primary axis (c0)
  c0.normalize();
  
  // 2. Make c1 perpendicular to c0, then normalize
  const dot01 = c0.dot(c1);
  c1.x -= dot01 * c0.x;
  c1.y -= dot01 * c0.y;
  c1.z -= dot01 * c0.z;
  c1.normalize();
  
  // 3. Make c2 perpendicular to both c0 and c1 (or take cross product c0 x c1)
  const dot02 = c0.dot(c2);
  const dot12 = c1.dot(c2);
  c2.x -= (dot02 * c0.x + dot12 * c1.x);
  c2.y -= (dot02 * c0.y + dot12 * c1.y);
  c2.z -= (dot02 * c0.z + dot12 * c1.z);
  c2.normalize();
}
```

---

### Section 5.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 5.1: Scalar and Vector Projection Calculation
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 4 \\ 2 \\ -4 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$:
1. Find the scalar projection $\text{comp}_{\mathbf{v}}(\mathbf{u})$.
2. Find the vector projection $\text{proj}_{\mathbf{v}}(\mathbf{u})$.
3. Find the vector rejection $\text{perp}_{\mathbf{v}}(\mathbf{u})$.
4. Verify that $\text{proj}_{\mathbf{v}}(\mathbf{u}) \cdot \text{perp}_{\mathbf{v}}(\mathbf{u}) = 0$.

**Solution:**
1. Compute $\mathbf{u} \cdot \mathbf{v}$ and $\|\mathbf{v}\|$:
   $$\mathbf{u} \cdot \mathbf{v} = (4)(1) + (2)(2) + (-4)(2) = 4 + 4 - 8 = 0$$
   Wait! The dot product is exactly 0!
   $$\|\mathbf{v}\| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{9} = 3$$
   Therefore:
   $$\text{comp}_{\mathbf{v}}(\mathbf{u}) = \frac{0}{3} = 0$$
2. Vector projection:
   $$\text{proj}_{\mathbf{v}}(\mathbf{u}) = 0 \cdot \hat{\mathbf{v}} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
3. Vector rejection:
   $$\text{perp}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} - \mathbf{0} = \mathbf{u} = \begin{bmatrix} 4 \\ 2 \\ -4 \end{bmatrix}$$
4. Verification:
   $$\mathbf{0} \cdot \mathbf{u} = 0 \quad \checkmark$$
Because the vectors are already orthogonal, $\mathbf{u}$ has zero component along $\mathbf{v}$.

---

#### Example 5.2: Non-Zero Projection and Decomposition
**Problem:** Let $\mathbf{u} = \begin{bmatrix} 3 \\ 6 \\ 2 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 2 \\ 1 \\ -2 \end{bmatrix}$. Compute $\mathbf{u}_{\parallel}$ and $\mathbf{u}_{\perp}$ relative to $\mathbf{v}$, and verify the Pythagorean relation $\|\mathbf{u}\|^2 = \|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2$.

**Solution:**
1. Compute $\mathbf{u} \cdot \mathbf{v}$ and $\mathbf{v} \cdot \mathbf{v}$:
   $$\mathbf{u} \cdot \mathbf{v} = (3)(2) + (6)(1) + (2)(-2) = 6 + 6 - 4 = 8$$
   $$\mathbf{v} \cdot \mathbf{v} = 2^2 + 1^2 + (-2)^2 = 4 + 1 + 4 = 9$$
2. Compute parallel component:
   $$\mathbf{u}_{\parallel} = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v} = \frac{8}{9} \begin{bmatrix} 2 \\ 1 \\ -2 \end{bmatrix} = \begin{bmatrix} 16/9 \\ 8/9 \\ -16/9 \end{bmatrix}$$
3. Compute perpendicular component:
   $$\mathbf{u}_{\perp} = \mathbf{u} - \mathbf{u}_{\parallel} = \begin{bmatrix} 3 - 16/9 \\ 6 - 8/9 \\ 2 - (-16/9) \end{bmatrix} = \begin{bmatrix} 11/9 \\ 46/9 \\ 34/9 \end{bmatrix}$$
4. Check orthogonality:
   $$\mathbf{u}_{\parallel} \cdot \mathbf{u}_{\perp} = \left(\frac{16}{9}\right)\left(\frac{11}{9}\right) + \left(\frac{8}{9}\right)\left(\frac{46}{9}\right) + \left(-\frac{16}{9}\right)\left(\frac{34}{9}\right)$$
   $$= \frac{176 + 368 - 544}{81} = \frac{544 - 544}{81} = 0 \quad \checkmark$$
5. Pythagorean verification:
   $$\|\mathbf{u}\|^2 = 3^2 + 6^2 + 2^2 = 9 + 36 + 4 = 49$$
   $$\|\mathbf{u}_{\parallel}\|^2 = \left(\frac{8}{9}\right)^2 \|\mathbf{v}\|^2 = \frac{64}{81} \times 9 = \frac{64}{9}$$
   $$\|\mathbf{u}_{\perp}\|^2 = \frac{11^2 + 46^2 + 34^2}{81} = \frac{121 + 2116 + 1156}{81} = \frac{3393}{81} = \frac{377}{9}$$
   $$\|\mathbf{u}_{\parallel}\|^2 + \|\mathbf{u}_{\perp}\|^2 = \frac{64}{9} + \frac{377}{9} = \frac{441}{9} = 49 = \|\mathbf{u}\|^2 \quad \checkmark$$

---

#### Example 5.3: Distance from a Point to an Arbitrary 3D Line
**Problem:** Find the perpendicular distance from point $P(4, 1, -2)$ to the 3D line passing through origin $O(0, 0, 0)$ with direction $\mathbf{d} = \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix}$.

**Solution:**
Let $\mathbf{p} = \vec{OP} = \begin{bmatrix} 4 \\ 1 \\ -2 \end{bmatrix}$.
The vector projection of $\mathbf{p}$ onto the line direction $\mathbf{d}$ represents the vector from $O$ to the closest point on the line $Q$:
$$\vec{OQ} = \text{proj}_{\mathbf{d}}(\mathbf{p}) = \left(\frac{\mathbf{p} \cdot \mathbf{d}}{\mathbf{d} \cdot \mathbf{d}}\right) \mathbf{d}$$
1. Compute dot products:
   $$\mathbf{p} \cdot \mathbf{d} = (4)(1) + (1)(2) + (-2)(-1) = 4 + 2 + 2 = 8$$
   $$\mathbf{d} \cdot \mathbf{d} = 1^2 + 2^2 + (-1)^2 = 1 + 4 + 1 = 6$$
2. Compute $\vec{OQ}$:
   $$\vec{OQ} = \frac{8}{6} \mathbf{d} = \frac{4}{3} \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix} = \begin{bmatrix} 4/3 \\ 8/3 \\ -4/3 \end{bmatrix}$$
3. The displacement vector from line to $P$ is the rejection $\mathbf{p}_{\perp}$:
   $$\mathbf{p}_{\perp} = \mathbf{p} - \vec{OQ} = \begin{bmatrix} 4 - 4/3 \\ 1 - 8/3 \\ -2 - (-4/3) \end{bmatrix} = \begin{bmatrix} 8/3 \\ -5/3 \\ -2/3 \end{bmatrix}$$
4. The perpendicular distance is $\|\mathbf{p}_{\perp}\|$:
   $$\text{dist} = \sqrt{\left(\frac{8}{3}\right)^2 + \left(-\frac{5}{3}\right)^2 + \left(-\frac{2}{3}\right)^2} = \sqrt{\frac{64 + 25 + 4}{9}} = \sqrt{\frac{93}{9}} = \frac{\sqrt{93}}{3} \approx 3.21455$$

---

#### Example 5.4: Resolving Gravity on an Arbitrary 3D Incline
**Problem:** A block of mass $m = 10 \text{ kg}$ rests on an inclined surface with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0.36 \\ 0.48 \\ 0.80 \end{bmatrix}$ in a coordinate system where gravity acts along the negative $z$-axis: $\mathbf{g} = \begin{bmatrix} 0 \\ 0 \\ -9.81 \end{bmatrix} \text{ m/s}^2$.
Find the normal force vector $\mathbf{F}_n$ and the tangential downslope sliding force vector $\mathbf{F}_t$.

**Solution:**
1. Gravitational force vector:
   $$\mathbf{F}_g = m\mathbf{g} = 10 \begin{bmatrix} 0 \\ 0 \\ -9.81 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ -98.1 \end{bmatrix} \text{ N}$$
2. Verify unit normal:
   $$\|\hat{\mathbf{n}}\|^2 = 0.36^2 + 0.48^2 + 0.80^2 = 0.1296 + 0.2304 + 0.6400 = 1.0000 \quad \checkmark$$
3. Scalar projection of $\mathbf{F}_g$ along normal $\hat{\mathbf{n}}$:
   $$\mathbf{F}_g \cdot \hat{\mathbf{n}} = (0)(0.36) + (0)(0.48) + (-98.1)(0.80) = -78.48 \text{ N}$$
   The normal force $\mathbf{F}_n$ exerted by the surface opposes this penetration:
   $$\mathbf{F}_{\text{normal}} = -(\mathbf{F}_g \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} = -(-78.48) \begin{bmatrix} 0.36 \\ 0.48 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 28.2528 \\ 37.6704 \\ 62.7840 \end{bmatrix} \text{ N}$$
4. Tangential downslope force $\mathbf{F}_t$:
   $$\mathbf{F}_t = \mathbf{F}_g - (\mathbf{F}_g \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0 \\ -98.1 \end{bmatrix} - (-78.48) \begin{bmatrix} 0.36 \\ 0.48 \\ 0.80 \end{bmatrix} = \begin{bmatrix} 0 + 28.2528 \\ 0 + 37.6704 \\ -98.1 + 62.7840 \end{bmatrix} = \begin{bmatrix} 28.2528 \\ 37.6704 \\ -35.3160 \end{bmatrix} \text{ N}$$
5. Magnitude checks:
   $$\|\mathbf{F}_g\| = 98.1 \text{ N}$$
   $$\|\mathbf{F}_n\| = 78.48 \text{ N}$$
   $$\|\mathbf{F}_t\| = \sqrt{28.2528^2 + 37.6704^2 + (-35.3160)^2} = \sqrt{798.22 + 1419.06 + 1247.22} = \sqrt{3464.50} \approx 58.86 \text{ N}$$
   $$\sqrt{\|\mathbf{F}_n\|^2 + \|\mathbf{F}_t\|^2} = \sqrt{78.48^2 + 58.86^2} = \sqrt{6159.11 + 3464.50} = \sqrt{9623.61} = 98.1 \text{ N} \quad \checkmark$$

---

#### Example 5.5: Full Gram-Schmidt Orthonormalization in $\mathbb{R}^3$
**Problem:** Construct an orthonormal basis $\{\mathbf{q}_1, \mathbf{q}_2, \mathbf{q}_3\}$ from the linearly independent vectors:
$$\mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}, \quad \mathbf{v}_3 = \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix}$$

**Solution:**
**Step 1:**
$$\mathbf{u}_1 = \mathbf{v}_1 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$$
$$\|\mathbf{u}_1\| = \sqrt{1^2 + 1^2 + 0^2} = \sqrt{2}$$
$$\mathbf{q}_1 = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$

**Step 2:**
$$\mathbf{v}_2 \cdot \mathbf{q}_1 = (1)\left(\frac{1}{\sqrt{2}}\right) + (0)\left(\frac{1}{\sqrt{2}}\right) + (1)(0) = \frac{1}{\sqrt{2}}$$
$$\mathbf{u}_2 = \mathbf{v}_2 - (\mathbf{v}_2 \cdot \mathbf{q}_1)\mathbf{q}_1 = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} - \frac{1}{\sqrt{2}} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} - \begin{bmatrix} 1/2 \\ 1/2 \\ 0 \end{bmatrix} = \begin{bmatrix} 1/2 \\ -1/2 \\ 1 \end{bmatrix}$$
$$\|\mathbf{u}_2\| = \sqrt{(1/2)^2 + (-1/2)^2 + 1^2} = \sqrt{\frac{1}{4} + \frac{1}{4} + 1} = \sqrt{\frac{6}{4}} = \frac{\sqrt{6}}{2}$$
$$\mathbf{q}_2 = \frac{\mathbf{u}_2}{\|\mathbf{u}_2\|} = \frac{2}{\sqrt{6}} \begin{bmatrix} 1/2 \\ -1/2 \\ 1 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{6} \\ -1/\sqrt{6} \\ 2/\sqrt{6} \end{bmatrix}$$

**Step 3:**
$$\mathbf{v}_3 \cdot \mathbf{q}_1 = (0)\left(\frac{1}{\sqrt{2}}\right) + (1)\left(\frac{1}{\sqrt{2}}\right) + (1)(0) = \frac{1}{\sqrt{2}}$$
$$\mathbf{v}_3 \cdot \mathbf{q}_2 = (0)\left(\frac{1}{\sqrt{6}}\right) + (1)\left(-\frac{1}{\sqrt{6}}\right) + (1)\left(\frac{2}{\sqrt{6}}\right) = \frac{1}{\sqrt{6}}$$
Now subtract both projections from $\mathbf{v}_3$:
$$\mathbf{u}_3 = \mathbf{v}_3 - (\mathbf{v}_3 \cdot \mathbf{q}_1)\mathbf{q}_1 - (\mathbf{v}_3 \cdot \mathbf{q}_2)\mathbf{q}_2$$
$$= \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix} - \frac{1}{\sqrt{2}} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} - \frac{1}{\sqrt{6}} \begin{bmatrix} 1/\sqrt{6} \\ -1/\sqrt{6} \\ 2/\sqrt{6} \end{bmatrix}$$
$$= \begin{bmatrix} 0 \\ 1 \\ 1 \end{bmatrix} - \begin{bmatrix} 1/2 \\ 1/2 \\ 0 \end{bmatrix} - \begin{bmatrix} 1/6 \\ -1/6 \\ 2/6 \end{bmatrix} = \begin{bmatrix} 0 - 3/6 - 1/6 \\ 1 - 3/6 + 1/6 \\ 1 - 0 - 2/6 \end{bmatrix} = \begin{bmatrix} -4/6 \\ 4/6 \\ 4/6 \end{bmatrix} = \begin{bmatrix} -2/3 \\ 2/3 \\ 2/3 \end{bmatrix}$$
$$\|\mathbf{u}_3\| = \sqrt{(-2/3)^2 + (2/3)^2 + (2/3)^2} = \sqrt{\frac{4+4+4}{9}} = \sqrt{\frac{12}{9}} = \frac{2\sqrt{3}}{3}$$
$$\mathbf{q}_3 = \frac{3}{2\sqrt{3}} \begin{bmatrix} -2/3 \\ 2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} -1/\sqrt{3} \\ 1/\sqrt{3} \\ 1/\sqrt{3} \end{bmatrix}$$

**Verification:**
- $\mathbf{q}_1 \cdot \mathbf{q}_2 = \frac{1}{\sqrt{12}} - \frac{1}{\sqrt{12}} + 0 = 0 \quad \checkmark$
- $\mathbf{q}_1 \cdot \mathbf{q}_3 = -\frac{1}{\sqrt{6}} + \frac{1}{\sqrt{6}} + 0 = 0 \quad \checkmark$
- $\mathbf{q}_2 \cdot \mathbf{q}_3 = -\frac{1}{\sqrt{18}} - \frac{1}{\sqrt{18}} + \frac{2}{\sqrt{18}} = 0 \quad \checkmark$
- All magnitudes equal 1.0 $\checkmark$.

---

#### Example 5.6: Camera Look-At Frame Construction
**Problem:** Construct the camera basis vectors $\hat{\mathbf{r}}$ (right), $\hat{\mathbf{u}}$ (up), and $\hat{\mathbf{f}}$ (forward) for a virtual camera positioned at $\mathbf{P}_{\text{eye}} = (0, 5, 10)$, gazing at target $\mathbf{P}_{\text{target}} = (0, 0, 0)$, with world up reference $\mathbf{v}_{\text{up, world}} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$.

**Solution:**
1. Compute camera view direction (looking from eye to target):
   $$\mathbf{d} = \mathbf{P}_{\text{target}} - \mathbf{P}_{\text{eye}} = \begin{bmatrix} 0 - 0 \\ 0 - 5 \\ 0 - 10 \end{bmatrix} = \begin{bmatrix} 0 \\ -5 \\ -10 \end{bmatrix}$$
   $$\|\mathbf{d}\| = \sqrt{0 + 25 + 100} = \sqrt{125} = 5\sqrt{5}$$
   $$\hat{\mathbf{f}} = \frac{\mathbf{d}}{\|\mathbf{d}\|} = \begin{bmatrix} 0 \\ -1/\sqrt{5} \\ -2/\sqrt{5} \end{bmatrix}$$
2. The backward camera $z$-axis in OpenGL conventions:
   $$\hat{\mathbf{z}}_{\text{cam}} = -\hat{\mathbf{f}} = \begin{bmatrix} 0 \\ 1/\sqrt{5} \\ 2/\sqrt{5} \end{bmatrix}$$
3. Compute the right vector $\hat{\mathbf{r}}$ via cross product $\mathbf{v}_{\text{up, world}} \times \hat{\mathbf{z}}_{\text{cam}}$:
   $$\mathbf{r} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 1/\sqrt{5} \\ 2/\sqrt{5} \end{bmatrix} = \begin{bmatrix} (1)(2/\sqrt{5}) - (0)(1/\sqrt{5}) \\ (0)(0) - (0)(2/\sqrt{5}) \\ (0)(1/\sqrt{5}) - (1)(0) \end{bmatrix} = \begin{bmatrix} 2/\sqrt{5} \\ 0 \\ 0 \end{bmatrix}$$
   Normalize $\mathbf{r}$:
   $$\|\mathbf{r}\| = 2/\sqrt{5} \implies \hat{\mathbf{r}} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
4. Compute the true camera up vector $\hat{\mathbf{u}}$:
   $$\hat{\mathbf{u}} = \hat{\mathbf{z}}_{\text{cam}} \times \hat{\mathbf{r}} = \begin{bmatrix} 0 \\ 1/\sqrt{5} \\ 2/\sqrt{5} \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} (1/\sqrt{5})(0) - (2/\sqrt{5})(0) \\ (2/\sqrt{5})(1) - (0)(0) \\ (0)(0) - (1/\sqrt{5})(1) \end{bmatrix} = \begin{bmatrix} 0 \\ 2/\sqrt{5} \\ -1/\sqrt{5} \end{bmatrix}$$
5. Verification:
   $$\|\hat{\mathbf{u}}\| = \sqrt{0 + \frac{4}{5} + \frac{1}{5}} = 1.0$$
   $$\hat{\mathbf{r}} \cdot \hat{\mathbf{u}} = 0$$
   $$\hat{\mathbf{u}} \cdot \hat{\mathbf{z}}_{\text{cam}} = (0)(0) + \left(\frac{2}{\sqrt{5}}\right)\left(\frac{1}{\sqrt{5}}\right) + \left(-\frac{1}{\sqrt{5}}\right)\left(\frac{2}{\sqrt{5}}\right) = \frac{2}{5} - \frac{2}{5} = 0 \quad \checkmark$$

---

#### Example 5.7: Elastic Reflection of a Velocity Vector
**Problem:** A billiard ball moving in 3D with velocity $\mathbf{v} = \begin{bmatrix} 5 \\ -4 \\ 3 \end{bmatrix} \text{ m/s}$ bounces off a cushion plane with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$. The coefficient of restitution is $e = 0.8$. Find the rebound velocity $\mathbf{v}'$.

**Solution:**
1. Component along normal:
   $$v_n = \mathbf{v} \cdot \hat{\mathbf{n}} = (5)(0) + (-4)(1) + (3)(0) = -4 \text{ m/s}$$
   Notice $v_n < 0$, which confirms the ball is approaching the surface.
2. Normal velocity vector:
   $$\mathbf{v}_n = v_n \hat{\mathbf{n}} = -4 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ -4 \\ 0 \end{bmatrix}$$
3. Tangential velocity vector:
   $$\mathbf{v}_t = \mathbf{v} - \mathbf{v}_n = \begin{bmatrix} 5 \\ -4 \\ 3 \end{bmatrix} - \begin{bmatrix} 0 \\ -4 \\ 0 \end{bmatrix} = \begin{bmatrix} 5 \\ 0 \\ 3 \end{bmatrix}$$
4. Rebound velocity:
   $$\mathbf{v}' = \mathbf{v}_t - e \mathbf{v}_n = \begin{bmatrix} 5 \\ 0 \\ 3 \end{bmatrix} - (0.8) \begin{bmatrix} 0 \\ -4 \\ 0 \end{bmatrix} = \begin{bmatrix} 5 \\ 3.2 \\ 3 \end{bmatrix} \text{ m/s}$$

---

#### Example 5.8: Closest Approach of a Particle to a Ray
**Problem:** A laser beam travels along ray $\mathbf{R}(t) = \mathbf{P}_0 + t \hat{\mathbf{d}}$ with $\mathbf{P}_0 = (1, 2, 3)$ and $\hat{\mathbf{d}} = \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix}$ ($t \ge 0$). A target drone is at $\mathbf{T}(4, 1, 3)$. Find the ray parameter $t^*$ where the laser is closest to the drone, and find the minimum distance.

**Solution:**
1. Vector from ray origin to drone:
   $$\mathbf{w} = \mathbf{T} - \mathbf{P}_0 = \begin{bmatrix} 4 - 1 \\ 1 - 2 \\ 3 - 3 \end{bmatrix} = \begin{bmatrix} 3 \\ -1 \\ 0 \end{bmatrix}$$
2. The parameter $t^*$ is the scalar projection of $\mathbf{w}$ onto $\hat{\mathbf{d}}$:
   $$t^* = \mathbf{w} \cdot \hat{\mathbf{d}} = (3)(0.6) + (-1)(0.8) + (0)(0) = 1.8 - 0.8 = 1.0$$
   Since $t^* = 1.0 \ge 0$, the closest point lies on the forward ray.
3. The closest point on the ray is:
   $$\mathbf{P}(1.0) = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} + 1.0 \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1.6 \\ 2.8 \\ 3.0 \end{bmatrix}$$
4. The minimum distance is the length of the vector rejection:
   $$\mathbf{d}_{\min} = \mathbf{T} - \mathbf{P}(1.0) = \begin{bmatrix} 4 - 1.6 \\ 1 - 2.8 \\ 3 - 3.0 \end{bmatrix} = \begin{bmatrix} 2.4 \\ -1.8 \\ 0 \end{bmatrix}$$
   $$\|\mathbf{d}_{\min}\| = \sqrt{2.4^2 + (-1.8)^2 + 0^2} = \sqrt{5.76 + 3.24} = \sqrt{9.00} = 3.0 \text{ units}$$

---

#### Example 5.9: Projection Matrix Operator Formulation
**Problem:** Find the $3 \times 3$ matrix $\mathbf{P}$ that projects any vector in $\mathbb{R}^3$ orthogonally onto the line spanned by the unit vector $\hat{\mathbf{n}} = \begin{bmatrix} 1/3 \\ 2/3 \\ 2/3 \end{bmatrix}$.

**Solution:**
The vector projection is $\text{proj}_{\hat{\mathbf{n}}}(\mathbf{x}) = (\mathbf{x} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$.
In matrix form:
$$\text{proj}_{\hat{\mathbf{n}}}(\mathbf{x}) = \hat{\mathbf{n}} (\hat{\mathbf{n}}^T \mathbf{x}) = (\hat{\mathbf{n}} \hat{\mathbf{n}}^T) \mathbf{x}$$
The projection matrix is the outer product $\mathbf{P} = \hat{\mathbf{n}} \hat{\mathbf{n}}^T$:
$$\mathbf{P} = \begin{bmatrix} 1/3 \\ 2/3 \\ 2/3 \end{bmatrix} \begin{bmatrix} 1/3 & 2/3 & 2/3 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix} \begin{bmatrix} 1 & 2 & 2 \end{bmatrix} = \frac{1}{9} \begin{bmatrix} 1 & 2 & 2 \\ 2 & 4 & 4 \\ 2 & 4 & 4 \end{bmatrix}$$
*Verification of idempotency ($\mathbf{P}^2 = \mathbf{P}$):*
$$\mathbf{P}^2 = (\hat{\mathbf{n}} \hat{\mathbf{n}}^T)(\hat{\mathbf{n}} \hat{\mathbf{n}}^T) = \hat{\mathbf{n}} (\hat{\mathbf{n}}^T \hat{\mathbf{n}}) \hat{\mathbf{n}}^T = \hat{\mathbf{n}} (1) \hat{\mathbf{n}}^T = \mathbf{P} \quad \checkmark$$

---

#### Example 5.10: Re-Orthonormalizing a Drifted Transformation Matrix
**Problem:** Due to numerical accumulation, a transformation matrix has column vectors:
$$\mathbf{c}_0 = \begin{bmatrix} 1.002 \\ 0.001 \\ -0.001 \end{bmatrix}, \quad \mathbf{c}_1 = \begin{bmatrix} 0.003 \\ 0.998 \\ 0.002 \end{bmatrix}$$
Perform one step of Gram-Schmidt to re-orthonormalize $\mathbf{c}_0$ and $\mathbf{c}_1$.

**Solution:**
1. Re-normalize $\mathbf{c}_0$:
   $$\|\mathbf{c}_0\| = \sqrt{(1.002)^2 + (0.001)^2 + (-0.001)^2} = \sqrt{1.004004 + 0.000001 + 0.000001} \approx 1.002001$$
   $$\mathbf{q}_0 = \frac{\mathbf{c}_0}{\|\mathbf{c}_0\|} \approx \begin{bmatrix} 0.999999 \\ 0.000998 \\ -0.000998 \end{bmatrix}$$
2. Remove projection of $\mathbf{c}_1$ onto $\mathbf{q}_0$:
   $$\mathbf{c}_1 \cdot \mathbf{q}_0 \approx (0.003)(1.0) + (0.998)(0.000998) + (0.002)(-0.000998) \approx 0.003 + 0.000996 - 0.000002 = 0.003994$$
   $$\mathbf{u}_1 = \mathbf{c}_1 - (\mathbf{c}_1 \cdot \mathbf{q}_0)\mathbf{q}_0 = \begin{bmatrix} 0.003 \\ 0.998 \\ 0.002 \end{bmatrix} - 0.003994 \begin{bmatrix} 1.0 \\ 0.001 \\ -0.001 \end{bmatrix} \approx \begin{bmatrix} -0.000994 \\ 0.997996 \\ 0.002004 \end{bmatrix}$$
3. Re-normalize $\mathbf{u}_1$:
   $$\|\mathbf{u}_1\| \approx \sqrt{(-0.001)^2 + (0.998)^2 + (0.002)^2} \approx 0.998$$
   $$\mathbf{q}_1 = \frac{\mathbf{u}_1}{\|\mathbf{u}_1\|} \approx \begin{bmatrix} -0.000996 \\ 0.999998 \\ 0.002008 \end{bmatrix}$$
Now $\mathbf{q}_0$ and $\mathbf{q}_1$ are unit length and strictly orthogonal ($\mathbf{q}_0 \cdot \mathbf{q}_1 = 0$).

---

### Section 5.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 5.1
**Problem:** Find the scalar projection of $\mathbf{a} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}$ onto $\mathbf{b} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.
**Solution:**
$$\mathbf{a} \cdot \mathbf{b} = (2)(1) + (-1)(1) + (4)(1) = 2 - 1 + 4 = 5$$
$$\|\mathbf{b}\| = \sqrt{1^2 + 1^2 + 1^2} = \sqrt{3}$$
$$\text{comp}_{\mathbf{b}}(\mathbf{a}) = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|} = \frac{5}{\sqrt{3}} = \frac{5\sqrt{3}}{3} \approx 2.88675$$

---

#### Exercise 5.2
**Problem:** Find the vector projection of $\mathbf{u} = \begin{bmatrix} 5 \\ 0 \\ -2 \end{bmatrix}$ onto $\mathbf{v} = \begin{bmatrix} 2 \\ 3 \\ 6 \end{bmatrix}$.
**Solution:**
$$\mathbf{u} \cdot \mathbf{v} = (5)(2) + (0)(3) + (-2)(6) = 10 + 0 - 12 = -2$$
$$\mathbf{v} \cdot \mathbf{v} = 2^2 + 3^2 + 6^2 = 4 + 9 + 36 = 49$$
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\right) \mathbf{v} = -\frac{2}{49} \begin{bmatrix} 2 \\ 3 \\ 6 \end{bmatrix} = \begin{bmatrix} -4/49 \\ -6/49 \\ -12/49 \end{bmatrix}$$

---

#### Exercise 5.3
**Problem:** If $\text{proj}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u}$, what can you deduce about the geometric relationship between $\mathbf{u}$ and $\mathbf{v}$?
**Solution:**
By definition, $\mathbf{u} = \mathbf{u}_{\parallel} + \mathbf{u}_{\perp}$.
If $\text{proj}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u}_{\parallel} = \mathbf{u}$, then:
$$\mathbf{u}_{\perp} = \mathbf{u} - \mathbf{u}_{\parallel} = \mathbf{0}$$
Since $\mathbf{u}_{\parallel} = c \mathbf{v}$ for scalar $c = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}$, it follows that $\mathbf{u} = c \mathbf{v}$.
Therefore, $\mathbf{u}$ and $\mathbf{v}$ are **collinear** (parallel or antiparallel).

---

#### Exercise 5.4
**Problem:** Find the vector rejection of $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$ from $\mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$.
**Solution:**
Here $\mathbf{v} = \mathbf{k}$ is the standard unit vector along the $z$-axis.
$$\mathbf{u} \cdot \mathbf{v} = (1)(0) + (2)(0) + (3)(1) = 3$$
$$\mathbf{v} \cdot \mathbf{v} = 1$$
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = 3 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$$
$$\text{perp}_{\mathbf{v}}(\mathbf{u}) = \mathbf{u} - \text{proj}_{\mathbf{v}}(\mathbf{u}) = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 0 \end{bmatrix}$$
Notice this simply removes the $z$-component, projecting $\mathbf{u}$ onto the $xy$-plane.

---

#### Exercise 5.5
**Problem:** Prove that for any two non-zero vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$, the scalar projection satisfies $\|\text{proj}_{\mathbf{v}}(\mathbf{u})\| = |\text{comp}_{\mathbf{v}}(\mathbf{u})|$.
**Solution:**
$$\text{proj}_{\mathbf{v}}(\mathbf{u}) = \left(\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}\right)\mathbf{v}$$
Taking the norm of both sides:
$$\|\text{proj}_{\mathbf{v}}(\mathbf{u})\| = \left|\frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|^2}\right| \|\mathbf{v}\| = \frac{|\mathbf{u} \cdot \mathbf{v}|}{\|\mathbf{v}\|^2} \|\mathbf{v}\| = \frac{|\mathbf{u} \cdot \mathbf{v}|}{\|\mathbf{v}\|}$$
Since $\text{comp}_{\mathbf{v}}(\mathbf{u}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{v}\|}$, we have:
$$|\text{comp}_{\mathbf{v}}(\mathbf{u})| = \frac{|\mathbf{u} \cdot \mathbf{v}|}{\|\mathbf{v}\|}$$
Thus, $\|\text{proj}_{\mathbf{v}}(\mathbf{u})\| = |\text{comp}_{\mathbf{v}}(\mathbf{u})| \quad \blacksquare$

---

#### Exercise 5.6
**Problem:** Perform the Gram-Schmidt process on the basis:
$$\mathbf{v}_1 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}, \quad \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
**Solution:**
1. Step 1:
   $$\mathbf{u}_1 = \mathbf{v}_1 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}$$
   $$\|\mathbf{u}_1\| = \sqrt{0 + 9 + 16} = 5$$
   $$\mathbf{q}_1 = \begin{bmatrix} 0 \\ 3/5 \\ 4/5 \end{bmatrix}$$
2. Step 2:
   $$\mathbf{v}_2 \cdot \mathbf{q}_1 = (1)(0) + (0)(3/5) + (0)(4/5) = 0$$
   $$\mathbf{u}_2 = \mathbf{v}_2 - 0 \cdot \mathbf{q}_1 = \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   $$\|\mathbf{u}_2\| = 1 \implies \mathbf{q}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
The two vectors were already orthogonal!

---

#### Exercise 5.7
**Problem:** In a physics engine, an incoming photon with velocity $\mathbf{v} = \begin{bmatrix} 3 \\ -4 \\ -5 \end{bmatrix}$ strikes a reflective mirror with unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$. Compute the reflected velocity vector.
**Solution:**
Using the reflection formula $\mathbf{v}' = \mathbf{v} - 2(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$:
1. $\mathbf{v} \cdot \hat{\mathbf{n}} = (3)(0) + (-4)(0) + (-5)(1) = -5$
2. $\mathbf{v}' = \begin{bmatrix} 3 \\ -4 \\ -5 \end{bmatrix} - 2(-5) \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 3 \\ -4 \\ -5 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 10 \end{bmatrix} = \begin{bmatrix} 3 \\ -4 \\ 5 \end{bmatrix}$
The horizontal components ($x, y$) are completely unchanged, while the vertical velocity ($z$) is inverted.

---

#### Exercise 5.8
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 2 \\ 4 \\ 4 \end{bmatrix}$, decompose $\mathbf{u}$ into components parallel and perpendicular to the direction $\mathbf{d} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$.
**Solution:**
$$\mathbf{u}_{\parallel} = (\mathbf{u} \cdot \mathbf{d})\mathbf{d} = (2)(1) \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$$
$$\mathbf{u}_{\perp} = \mathbf{u} - \mathbf{u}_{\parallel} = \begin{bmatrix} 2 \\ 4 \\ 4 \end{bmatrix} - \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 4 \\ 4 \end{bmatrix}$$
Check: $\mathbf{u}_{\parallel} \cdot \mathbf{u}_{\perp} = (2)(0) + (0)(4) + (0)(4) = 0 \quad \checkmark$

---

#### Exercise 5.9
**Problem:** Let $\mathbf{P}_{\text{plane}}$ be a plane through the origin with unit normal $\hat{\mathbf{n}}$. Derive the matrix formula for projecting any vector $\mathbf{x}$ onto this plane.
**Solution:**
Any vector $\mathbf{x}$ can be decomposed as:
$$\mathbf{x} = \mathbf{x}_{\parallel \mathbf{n}} + \mathbf{x}_{\text{plane}}$$
Therefore:
$$\mathbf{x}_{\text{plane}} = \mathbf{x} - \mathbf{x}_{\parallel \mathbf{n}} = \mathbf{x} - (\mathbf{x} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
In matrix notation:
$$\mathbf{x}_{\text{plane}} = \mathbf{I}\mathbf{x} - (\hat{\mathbf{n}}\hat{\mathbf{n}}^T)\mathbf{x} = (\mathbf{I} - \hat{\mathbf{n}}\hat{\mathbf{n}}^T)\mathbf{x}$$
Thus, the plane projection matrix is:
$$\mathbf{P}_{\text{plane}} = \mathbf{I} - \hat{\mathbf{n}}\hat{\mathbf{n}}^T = \begin{bmatrix} 1 - n_x^2 & -n_x n_y & -n_x n_z \\ -n_y n_x & 1 - n_y^2 & -n_y n_z \\ -n_z n_x & -n_z n_y & 1 - n_z^2 \end{bmatrix} \quad \blacksquare$$

---

#### Exercise 5.10
**Problem:** A physics constraint solver must remove any velocity component of a sliding box along the constraint normal $\hat{\mathbf{n}} = \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix}$. If current velocity is $\mathbf{v} = \begin{bmatrix} 10 \\ 0 \\ 5 \end{bmatrix} \text{ m/s}$, calculate the projected velocity that satisfies the constraint.
**Solution:**
$$\mathbf{v}_{\text{constrained}} = \mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$$
1. Dot product:
   $$\mathbf{v} \cdot \hat{\mathbf{n}} = (10)(0.6) + (0)(0.8) + (5)(0) = 6.0 \text{ m/s}$$
2. Normal velocity:
   $$\mathbf{v}_n = 6.0 \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 3.6 \\ 4.8 \\ 0 \end{bmatrix}$$
3. Constrained tangential velocity:
   $$\mathbf{v}_{\text{constrained}} = \begin{bmatrix} 10 \\ 0 \\ 5 \end{bmatrix} - \begin{bmatrix} 3.6 \\ 4.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 6.4 \\ -4.8 \\ 5.0 \end{bmatrix} \text{ m/s}$$
*Verification:*
$$\mathbf{v}_{\text{constrained}} \cdot \hat{\mathbf{n}} = (6.4)(0.6) + (-4.8)(0.8) + (5.0)(0) = 3.84 - 3.84 + 0 = 0 \quad \checkmark$$
The velocity along the constraint normal has been completely eliminated.

# Chapter 6: The Vector Cross Product: Handedness and Orthogonal Generation

> *"The scalar product is a peace treaty between two vectors, collapsing them into a single mutual number; the vector cross product is an explosive third dimension, born perpendicular to both, demanding a right hand to claim its domain."*  
> â€” **Oliver Heaviside**, *Electromagnetic Theory* (1893)

---

### Section 6.1 The Dimensional Anomaly: Why the Cross Product Exists in 3D (and 7D)

In elementary vector arithmetic, students often assume that the "cross product" is a universal operation that exists in all dimensional spaces $\mathbb{R}^n$. This is a profound misconception.

In two-dimensional space $\mathbb{R}^2$, given two non-parallel vectors $\mathbf{a}$ and $\mathbf{b}$, any vector perpendicular to both would have to point *out of the 2D plane* into a third dimensionâ€”meaning the operation cannot produce an output vector that remains within $\mathbb{R}^2$. In four-dimensional space $\mathbb{R}^4$, the set of all vectors perpendicular to two linearly independent vectors is not a 1D line, but an entire *two-dimensional plane* of orthogonal directions; hence, two vectors alone cannot uniquely specify a third vector up to a single sign choice!

In modern differential geometry and normed division algebra (Hurwitz's 1898 theorem on composition algebras), a bilinear binary operation $\times: \mathbb{R}^n \times \mathbb{R}^n \to \mathbb{R}^n$ satisfying:
1. Orthogonality: $(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{u} = 0$ and $(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{v} = 0$
2. Norm preservation: $\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2$

exists **only** in dimensions **$n = 0, 1, 3,$ and $7$**!
- In dimension 0 and 1, the product is trivial or zero.
- In dimension 3, it arises from the imaginary part of Hamilton's **quaternions** ($\mathbb{H}$).
- In dimension 7, it arises from the imaginary part of Graves-Cayley **octonions** ($\mathbb{O}$).

Three-dimensional space $\mathbb{R}^3$ is uniquely privileged: it is the only non-trivial associative division-algebra space where two vectors uniquely define a mutually perpendicular third vector.

---

### Section 6.2 Formal Definition via $3 \times 3$ Determinant Expansion

Let two vectors $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$ be specified in standard Cartesian components:
$$\mathbf{u} = \begin{bmatrix} u_x \\ u_y \\ u_z \end{bmatrix}, \quad \mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$$

The **vector cross product** $\mathbf{u} \times \mathbf{v}$ is formally defined as the symbolic expansion of a $3 \times 3$ determinant whose first row contains the standard basis vectors $\{\mathbf{i}, \mathbf{j}, \mathbf{k}\}$:

$$\mathbf{u} \times \mathbf{v} \equiv \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ u_x & u_y & u_z \\ v_x & v_y & v_z \end{vmatrix}$$

Expanding along the top row by minors (cofactor expansion):
$$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} u_y & u_z \\ v_y & v_z \end{vmatrix} \mathbf{i} - \begin{vmatrix} u_x & u_z \\ v_x & v_z \end{vmatrix} \mathbf{j} + \begin{vmatrix} u_x & u_y \\ v_x & v_y \end{vmatrix} \mathbf{k}$$

Evaluating each $2 \times 2$ determinant:
$$\begin{vmatrix} u_y & u_z \\ v_y & v_z \end{vmatrix} = u_y v_z - u_z v_y$$
$$-\begin{vmatrix} u_x & u_z \\ v_x & v_z \end{vmatrix} = -(u_x v_z - u_z v_x) = u_z v_x - u_x v_z$$
$$\begin{vmatrix} u_x & u_y \\ v_x & v_y \end{vmatrix} = u_x v_y - u_y v_x$$

Collecting into coordinate components:
$$\mathbf{u} \times \mathbf{v} = \begin{bmatrix} u_y v_z - u_z v_y \\ u_z v_x - u_x v_z \\ u_x v_y - u_y v_x \end{bmatrix}$$

#### Cyclic Index Memory Pattern:
Notice the elegant cyclic permutation of the coordinate indices $(x, y, z) \to (y, z, x) \to (z, x, y)$:
- $x$-component: uses indices $(y, z)$
- $y$-component: uses indices $(z, x)$
- $z$-component: uses indices $(x, y)$

In tensor index notation with Levi-Civita permutation tensor $\epsilon_{ijk}$:
$$(\mathbf{u} \times \mathbf{v})_i = \sum_{j=1}^3 \sum_{k=1}^3 \epsilon_{ijk} u_j v_k$$
where $\epsilon_{ijk} = +1$ for even permutations $(1,2,3), (2,3,1), (3,1,2)$, $\epsilon_{ijk} = -1$ for odd permutations $(1,3,2), (2,1,3), (3,2,1)$, and $0$ if any two indices match.

---

### Section 6.3 Geometric Magnitude and Direction: The Right-Hand Rule

The cross product produces a vector with two distinct geometric characteristics:

```
                  u x v
                    ^
                    |
                    |
                    + - - - - - - +
                   /             /
                  /             /
                 /             /
                +-------------> v
               /  theta
              /
             v u
```

#### 1. Magnitude: Area of the Spanned Parallelogram
The Euclidean norm of the cross product is given by:
$$\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\| \|\mathbf{v}\| \sin\theta$$
where $\theta \in [0, \pi]$ is the interior angle between $\mathbf{u}$ and $\mathbf{v}$.

*Rigorous Proof (Lagrange's Identity):*
Let us compute $\|\mathbf{u} \times \mathbf{v}\|^2$:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = (u_y v_z - u_z v_y)^2 + (u_z v_x - u_x v_z)^2 + (u_x v_y - u_y v_x)^2$$
Expanding each binomial:
$$= (u_y^2 v_z^2 - 2 u_y v_z u_z v_y + u_z^2 v_y^2) + (u_z^2 v_x^2 - 2 u_z v_x u_x v_z + u_x^2 v_z^2) + (u_x^2 v_y^2 - 2 u_x v_y u_y v_x + u_y^2 v_x^2)$$

Now consider the product of squared norms minus the squared dot product:
$$\|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2 = (u_x^2 + u_y^2 + u_z^2)(v_x^2 + v_y^2 + v_z^2) - (u_x v_x + u_y v_y + u_z v_z)^2$$
Expanding both terms and simplifying shows that all identical square products $u_x^2 v_x^2 + u_y^2 v_y^2 + u_z^2 v_z^2$ cancel, leaving exactly the same nine terms:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2$$

Since $\mathbf{u} \cdot \mathbf{v} = \|\mathbf{u}\| \|\mathbf{v}\| \cos\theta$:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 \cos^2\theta = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 (1 - \cos^2\theta) = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 \sin^2\theta$$
Taking the principal square root (noting that for $\theta \in [0, \pi]$, $\sin\theta \ge 0$):
$$\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\| \|\mathbf{v}\| \sin\theta \quad \blacksquare$$

Because the base of the parallelogram spanned by $\mathbf{u}$ and $\mathbf{v}$ has length $\|\mathbf{u}\|$, and the perpendicular altitude has length $h = \|\mathbf{v}\|\sin\theta$, the magnitude $\|\mathbf{u} \times \mathbf{v}\|$ represents **the exact geometric area of the parallelogram** formed by $\mathbf{u}$ and $\mathbf{v}$!

#### 2. Direction: Orthogonality and the Right-Hand Rule
The resulting vector $\mathbf{u} \times \mathbf{v}$ is perpendicular to both $\mathbf{u}$ and $\mathbf{v}$:
$$(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{u} = (u_y v_z - u_z v_y) u_x + (u_z v_x - u_x v_z) u_y + (u_x v_y - u_y v_x) u_z$$
$$= u_x u_y v_z - u_x u_z v_y + u_y u_z v_x - u_x u_y v_z + u_z u_x v_y - u_y u_z v_x = 0$$
Similarly, $(\mathbf{u} \times \mathbf{v}) \cdot \mathbf{v} = 0$.

Since $\mathbf{u} \times \mathbf{v}$ is perpendicular to the plane containing $\mathbf{u}$ and $\mathbf{v}$, there are two possible opposite directions along that normal line. In a right-handed coordinate system, the choice is governed by the **Right-Hand Rule**:
- Point the fingers of your right hand along vector $\mathbf{u}$.
- Curl your fingers toward vector $\mathbf{v}$ through the interior angle $\theta$.
- Your extended right thumb points in the exact direction of $\mathbf{u} \times \mathbf{v}$.

---

### Section 6.4 Key Algebraic Properties

The cross product has algebraic properties that differ sharply from ordinary scalar arithmetic:

1. **Anti-Commutativity:**
   $$\mathbf{u} \times \mathbf{v} = -(\mathbf{v} \times \mathbf{u})$$
   *Consequence:* Swapping operands negates the resulting vector (it points in the opposite direction).
   *Special Case:* Any vector crossed with itself yields the zero vector:
   $$\mathbf{u} \times \mathbf{u} = \mathbf{0}$$

2. **Non-Associativity:**
   In general:
   $$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) \ne (\mathbf{u} \times \mathbf{v}) \times \mathbf{w}$$
   *Counterexample:* Let $\mathbf{u} = \mathbf{i}$, $\mathbf{v} = \mathbf{i}$, $\mathbf{w} = \mathbf{j}$.
   $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{i} \times (\mathbf{i} \times \mathbf{j}) = \mathbf{i} \times \mathbf{k} = -\mathbf{j}$.
   $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w} = (\mathbf{i} \times \mathbf{i}) \times \mathbf{j} = \mathbf{0} \times \mathbf{j} = \mathbf{0}$.
   $-\mathbf{j} \ne \mathbf{0}$.

3. **Distributivity over Vector Addition:**
   $$\mathbf{u} \times (\mathbf{v} + \mathbf{w}) = (\mathbf{u} \times \mathbf{v}) + (\mathbf{u} \times \mathbf{w})$$
   $$(\mathbf{u} + \mathbf{v}) \times \mathbf{w} = (\mathbf{u} \times \mathbf{w}) + (\mathbf{v} \times \mathbf{w})$$

4. **Compatibility with Scalar Multiplication:**
   $$(\alpha \mathbf{u}) \times \mathbf{v} = \mathbf{u} \times (\alpha \mathbf{v}) = \alpha (\mathbf{u} \times \mathbf{v})$$

5. **Cross Products of Standard Basis Vectors:**
   $$\mathbf{i} \times \mathbf{j} = \mathbf{k}, \quad \mathbf{j} \times \mathbf{k} = \mathbf{i}, \quad \mathbf{k} \times \mathbf{i} = \mathbf{j}$$
   $$\mathbf{j} \times \mathbf{i} = -\mathbf{k}, \quad \mathbf{k} \times \mathbf{j} = -\mathbf{i}, \quad \mathbf{i} \times \mathbf{k} = -\mathbf{j}$$
   $$\mathbf{i} \times \mathbf{i} = \mathbf{j} \times \mathbf{j} = \mathbf{k} \times \mathbf{k} = \mathbf{0}$$

---

### Section 6.5 Collinearity Detection and Numerical Epsilon Safeguards

Since $\|\mathbf{u} \times \mathbf{v}\| = \|\mathbf{u}\|\|\mathbf{v}\|\sin\theta$, the cross product vanishes ($\mathbf{u} \times \mathbf{v} = \mathbf{0}$) if and only if:
1. $\mathbf{u} = \mathbf{0}$ or $\mathbf{v} = \mathbf{0}$, or
2. $\sin\theta = 0 \implies \theta = 0$ or $\theta = \pi$.

That is, **the cross product of two non-zero vectors is zero if and only if they are collinear (parallel or antiparallel)**.

#### Numerical Collinearity in Game Engines:
In computer software, checking for collinearity using exact equality `(cross.length() === 0)` is dangerous due to floating-point imprecision. Two vectors that are mathematically collinear may produce a tiny residual norm like $1.4 \times 10^{-16}$.
Furthermore, normalizing such a near-zero vector produces division by zero or massive numerical instability:
$$\hat{\mathbf{n}} = \frac{\mathbf{u} \times \mathbf{v}}{\|\mathbf{u} \times \mathbf{v}\|}$$

Every robust physics and geometry engine must use a squared-norm threshold:
```typescript
function safeCrossNormalize(u: Vector3, v: Vector3, fallback: Vector3): Vector3 {
  const cx = u.y * v.z - u.z * v.y;
  const cy = u.z * v.x - u.x * v.z;
  const cz = u.x * v.y - u.y * v.x;
  
  const lenSq = cx * cx + cy * cy + cz * cz;
  const EPSILON_SQ = 1e-12; // 1e-6 threshold for float32, 1e-12 for float64
  
  if (lenSq < EPSILON_SQ) {
    // Vectors are collinear! Return user-supplied fallback orthogonal axis
    return fallback.clone();
  }
  
  const invLen = 1.0 / Math.sqrt(lenSq);
  return new Vector3(cx * invLen, cy * invLen, cz * invLen);
}
```

---

### Section 6.6 Computing 3D Triangle Areas and Surface Normals

In 3D mesh processing and rendering pipelines, virtually all geometry consists of triangular faces.
Let a triangle in 3D space have vertices $A, B, C \in \mathbb{R}^3$.

```
               C
              / \
             /   \
            /     \
           A ------> B
```

The edge vectors sharing vertex $A$ are:
$$\mathbf{e}_1 = \vec{AB} = B - A$$
$$\mathbf{e}_2 = \vec{AC} = C - A$$

1. **Parallelogram Area:**
   The parallelogram formed by $\vec{AB}$ and $\vec{AC}$ has area:
   $$\text{Area}_{\text{parallelogram}} = \|\vec{AB} \times \vec{AC}\|$$
2. **Triangle Area:**
   Since any triangle is exactly half of the spanned parallelogram:
   $$\text{Area}_{\triangle ABC} = \frac{1}{2} \|\vec{AB} \times \vec{AC}\|$$
3. **Face Normal Vector:**
   The unnormalized normal vector is:
   $$\mathbf{N}_{\text{unnormalized}} = \vec{AB} \times \vec{AC}$$
   And the unit face normal is:
   $$\hat{\mathbf{N}} = \frac{\vec{AB} \times \vec{AC}}{\|\vec{AB} \times \vec{AC}\|}$$

*Winding Order Note:*
If the vertices are ordered counter-clockwise (CCW) $A \to B \to C$ as viewed from the outside, $\hat{\mathbf{N}}$ points directly outward. If ordered clockwise (CW) $A \to C \to B$, the normal points inward:
$$\vec{AC} \times \vec{AB} = -(\vec{AB} \times \vec{AC})$$

---

### Section 6.7 Physics Applications: Torque, Angular Momentum, and Lorentz Force

The cross product is the mathematical language of spatial rotation and rotational dynamics in physics:

#### 1. Torque ($\boldsymbol{\tau}$)
When a force $\mathbf{F}$ is applied at position $\mathbf{r}$ relative to a pivot point, the resulting rotational torque vector is:
$$\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$$
- Magnitude: $\|\boldsymbol{\tau}\| = \|\mathbf{r}\| \|\mathbf{F}\| \sin\theta = r F_{\perp}$. Only the component of force perpendicular to the lever arm creates rotational acceleration.
- Direction: The vector points along the axis of rotation dictated by the right-hand rule.

#### 2. Angular Momentum ($\mathbf{L}$)
For a particle of mass $m$ with linear momentum $\mathbf{p} = m\mathbf{v}$ located at position $\mathbf{r}$:
$$\mathbf{L} = \mathbf{r} \times \mathbf{p} = m(\mathbf{r} \times \mathbf{v})$$
By Newton's second rotational law, the time rate of change of angular momentum equals the net external torque:
$$\frac{d\mathbf{L}}{dt} = \boldsymbol{\tau}_{\text{net}}$$

#### 3. Tangential Velocity of a Rotating Rigid Body
If a rigid body rotates about an axis with angular velocity vector $\boldsymbol{\omega}$ (whose direction specifies the axis of rotation and whose magnitude $\|\boldsymbol{\omega}\|$ is the angular speed in rad/s), the linear tangential velocity $\mathbf{v}$ of a point at position vector $\mathbf{r}$ is:
$$\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$$

#### 4. The Lorentz Magnetic Force
A charged particle carrying electric charge $q$ moving with velocity $\mathbf{v}$ through a magnetic field $\mathbf{B}$ experiences a deflecting Lorentz force:
$$\mathbf{F}_{\text{mag}} = q(\mathbf{v} \times \mathbf{B})$$
Because $\mathbf{F}_{\text{mag}}$ is always perpendicular to velocity $\mathbf{v}$ ($(\mathbf{v} \times \mathbf{B}) \cdot \mathbf{v} = 0$), a purely magnetic field does zero mechanical work on the particle ($W = \int \mathbf{F} \cdot d\mathbf{r} = \int \mathbf{F} \cdot \mathbf{v} dt = 0$). It changes the particle's direction of motion into a spiral helix, but never changes its kinetic energy!

---

### Section 6.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 6.1: Basic Cross Product Calculation
**Problem:** Compute $\mathbf{u} \times \mathbf{v}$ for $\mathbf{u} = \begin{bmatrix} 2 \\ 3 \\ 4 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 5 \\ 6 \\ 7 \end{bmatrix}$.

**Solution:**
Expand the determinant:
$$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 3 & 4 \\ 5 & 6 & 7 \end{vmatrix}$$
$$= \mathbf{i} \begin{vmatrix} 3 & 4 \\ 6 & 7 \end{vmatrix} - \mathbf{j} \begin{vmatrix} 2 & 4 \\ 5 & 7 \end{vmatrix} + \mathbf{k} \begin{vmatrix} 2 & 3 \\ 5 & 6 \end{vmatrix}$$
$$= \mathbf{i} ((3)(7) - (4)(6)) - \mathbf{j} ((2)(7) - (4)(5)) + \mathbf{k} ((2)(6) - (3)(5))$$
$$= \mathbf{i} (21 - 24) - \mathbf{j} (14 - 20) + \mathbf{k} (12 - 15)$$
$$= -3\mathbf{i} - (-6)\mathbf{j} - 3\mathbf{k} = \begin{bmatrix} -3 \\ 6 \\ -3 \end{bmatrix}$$
*Verification of Orthogonality:*
$$\mathbf{u} \cdot (\mathbf{u} \times \mathbf{v}) = (2)(-3) + (3)(6) + (4)(-3) = -6 + 18 - 12 = 0 \quad \checkmark$$
$$\mathbf{v} \cdot (\mathbf{u} \times \mathbf{v}) = (5)(-3) + (6)(6) + (7)(-3) = -15 + 36 - 21 = 0 \quad \checkmark$$

---

#### Example 6.2: Anti-Commutativity Demonstration
**Problem:** For the same vectors in Example 6.1, compute $\mathbf{v} \times \mathbf{u}$ and verify anti-commutativity.

**Solution:**
$$\mathbf{v} \times \mathbf{u} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 5 & 6 & 7 \\ 2 & 3 & 4 \end{vmatrix}$$
$$= \mathbf{i}((6)(4) - (7)(3)) - \mathbf{j}((5)(4) - (7)(2)) + \mathbf{k}((5)(3) - (6)(2))$$
$$= \mathbf{i}(24 - 21) - \mathbf{j}(20 - 14) + \mathbf{k}(15 - 12)$$
$$= 3\mathbf{i} - 6\mathbf{j} + 3\mathbf{k} = \begin{bmatrix} 3 \\ -6 \\ 3 \end{bmatrix}$$
Comparing with Example 6.1:
$$\mathbf{v} \times \mathbf{u} = \begin{bmatrix} 3 \\ -6 \\ 3 \end{bmatrix} = -\begin{bmatrix} -3 \\ 6 \\ -3 \end{bmatrix} = -(\mathbf{u} \times \mathbf{v}) \quad \checkmark$$

---

#### Example 6.3: Surface Normal and Area of a 3D Triangle
**Problem:** A triangle in 3D space has vertices $A(1, -1, 0)$, $B(2, 1, -1)$, and $C(-1, 1, 2)$.
1. Find the outward unit normal vector $\hat{\mathbf{N}}$ assuming counter-clockwise order $A \to B \to C$.
2. Compute the exact surface area of the triangle.

**Solution:**
1. Compute edge vectors:
   $$\vec{AB} = B - A = \begin{bmatrix} 2 - 1 \\ 1 - (-1) \\ -1 - 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix}$$
   $$\vec{AC} = C - A = \begin{bmatrix} -1 - 1 \\ 1 - (-1) \\ 2 - 0 \end{bmatrix} = \begin{bmatrix} -2 \\ 2 \\ 2 \end{bmatrix}$$
2. Compute unnormalized cross product:
   $$\vec{AB} \times \vec{AC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & -1 \\ -2 & 2 & 2 \end{vmatrix}$$
   $$= \mathbf{i}((2)(2) - (-1)(2)) - \mathbf{j}((1)(2) - (-1)(-2)) + \mathbf{k}((1)(2) - (2)(-2))$$
   $$= \mathbf{i}(4 + 2) - \mathbf{j}(2 - 2) + \mathbf{k}(2 + 4)$$
   $$= 6\mathbf{i} - 0\mathbf{j} + 6\mathbf{k} = \begin{bmatrix} 6 \\ 0 \\ 6 \end{bmatrix}$$
3. Compute magnitude:
   $$\|\vec{AB} \times \vec{AC}\| = \sqrt{6^2 + 0^2 + 6^2} = \sqrt{36 + 36} = \sqrt{72} = 6\sqrt{2}$$
4. Unit normal:
   $$\hat{\mathbf{N}} = \frac{1}{6\sqrt{2}} \begin{bmatrix} 6 \\ 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{2} \\ 0 \\ 1/\sqrt{2} \end{bmatrix}$$
5. Triangle area:
   $$\text{Area} = \frac{1}{2} \|\vec{AB} \times \vec{AC}\| = \frac{1}{2}(6\sqrt{2}) = 3\sqrt{2} \approx 4.24264 \text{ units}^2$$

---

#### Example 6.4: Tangential Velocity of a Rotating Rigid Body
**Problem:** An industrial centrifuge rotates with angular velocity vector $\boldsymbol{\omega} = \begin{bmatrix} 0 \\ 0 \\ 150 \end{bmatrix} \text{ rad/s}$ about the $z$-axis. A sample vial is mounted at position $\mathbf{r} = \begin{bmatrix} 0.4 \\ 0.3 \\ 0.1 \end{bmatrix} \text{ m}$ from the origin. Find the instantaneous linear velocity vector $\mathbf{v}$ and its speed.

**Solution:**
1. Compute $\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$:
   $$\mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 0 & 150 \\ 0.4 & 0.3 & 0.1 \end{vmatrix}$$
   $$= \mathbf{i}((0)(0.1) - (150)(0.3)) - \mathbf{j}((0)(0.1) - (150)(0.4)) + \mathbf{k}((0)(0.3) - (0)(0.4))$$
   $$= \mathbf{i}(0 - 45) - \mathbf{j}(0 - 60) + \mathbf{k}(0)$$
   $$= \begin{bmatrix} -45 \\ 60 \\ 0 \end{bmatrix} \text{ m/s}$$
2. Speed:
   $$\|\mathbf{v}\| = \sqrt{(-45)^2 + 60^2 + 0^2} = \sqrt{2025 + 3600} = \sqrt{5625} = 75.0 \text{ m/s}$$
*Physical Intuition:* The sample rotates purely in the horizontal $xy$-plane at height $z = 0.1 \text{ m}$ with radius $R = \sqrt{0.4^2 + 0.3^2} = 0.5 \text{ m}$. Speed is $v = \omega R = 150 \times 0.5 = 75 \text{ m/s} \quad \checkmark$.

---

#### Example 6.5: Mechanical Torque Calculation
**Problem:** A robotic arm pivot is located at origin $(0, 0, 0)$. A force $\mathbf{F} = \begin{bmatrix} 10 \\ -20 \\ 30 \end{bmatrix} \text{ N}$ is exerted at the end-effector positioned at $\mathbf{r} = \begin{bmatrix} 1.2 \\ 0.5 \\ -0.8 \end{bmatrix} \text{ m}$. Calculate the resulting torque vector $\boldsymbol{\tau}$ and the total torque magnitude.

**Solution:**
1. Torque vector $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$:
   $$\boldsymbol{\tau} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1.2 & 0.5 & -0.8 \\ 10 & -20 & 30 \end{vmatrix}$$
   $$\tau_x = (0.5)(30) - (-0.8)(-20) = 15 - 16 = -1.0 \text{ N}\cdot\text{m}$$
   $$\tau_y = -((1.2)(30) - (-0.8)(10)) = -(36 - (-8)) = -(36 + 8) = -44.0 \text{ N}\cdot\text{m}$$
   $$\tau_z = (1.2)(-20) - (0.5)(10) = -24 - 5 = -29.0 \text{ N}\cdot\text{m}$$
   $$\boldsymbol{\tau} = \begin{bmatrix} -1.0 \\ -44.0 \\ -29.0 \end{bmatrix} \text{ N}\cdot\text{m}$$
2. Magnitude:
   $$\|\boldsymbol{\tau}\| = \sqrt{(-1)^2 + (-44)^2 + (-29)^2} = \sqrt{1 + 1936 + 841} = \sqrt{2778} \approx 52.7067 \text{ N}\cdot\text{m}$$

---

#### Example 6.6: Detecting Collinearity with Threshold
**Problem:** Determine if $\mathbf{u} = \begin{bmatrix} 1.5 \\ -3.0 \\ 4.5 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} -1.0 \\ 2.0 \\ -3.0 \end{bmatrix}$ are parallel using the cross product.

**Solution:**
Compute $\mathbf{u} \times \mathbf{v}$:
$$\mathbf{u} \times \mathbf{v} = \begin{bmatrix} (-3.0)(-3.0) - (4.5)(2.0) \\ (4.5)(-1.0) - (1.5)(-3.0) \\ (1.5)(2.0) - (-3.0)(-1.0) \end{bmatrix} = \begin{bmatrix} 9.0 - 9.0 \\ -4.5 - (-4.5) \\ 3.0 - 3.0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
Since $\mathbf{u} \times \mathbf{v} = \mathbf{0}$, the vectors are collinear.
Furthermore, $\mathbf{u} = -1.5 \mathbf{v}$, so they point in exactly opposite directions ($\theta = 180^\circ$).

---

#### Example 6.7: Lorentz Magnetic Force on an Electron
**Problem:** An ion with charge $q = 3.2 \times 10^{-19} \text{ C}$ travels with velocity $\mathbf{v} = \begin{bmatrix} 10^5 \\ 2 \times 10^5 \\ 0 \end{bmatrix} \text{ m/s}$ through a magnetic field $\mathbf{B} = \begin{bmatrix} 0 \\ 0.5 \\ 1.0 \end{bmatrix} \text{ T}$. Calculate the magnetic force vector acting on the ion.

**Solution:**
1. Cross product $\mathbf{v} \times \mathbf{B}$:
   $$\mathbf{v} \times \mathbf{B} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 10^5 & 2 \times 10^5 & 0 \\ 0 & 0.5 & 1.0 \end{vmatrix}$$
   $$(\mathbf{v} \times \mathbf{B})_x = (2 \times 10^5)(1.0) - (0)(0.5) = 2 \times 10^5$$
   $$(\mathbf{v} \times \mathbf{B})_y = -((10^5)(1.0) - (0)(0)) = -10^5$$
   $$(\mathbf{v} \times \mathbf{B})_z = (10^5)(0.5) - (2 \times 10^5)(0) = 5 \times 10^4$$
   $$\mathbf{v} \times \mathbf{B} = \begin{bmatrix} 200000 \\ -100000 \\ 50000 \end{bmatrix} \text{ m}\cdot\text{T/s}$$
2. Multiply by charge $q$:
   $$\mathbf{F} = (3.2 \times 10^{-19}) \begin{bmatrix} 2 \times 10^5 \\ -10^5 \\ 0.5 \times 10^5 \end{bmatrix} = \begin{bmatrix} 6.4 \times 10^{-14} \\ -3.2 \times 10^{-14} \\ 1.6 \times 10^{-14} \end{bmatrix} \text{ N}$$

---

#### Example 6.8: Skew-Symmetric Cross Product Matrix Operator
**Problem:** In 3D physics engines, the cross product $\boldsymbol{\omega} \times \mathbf{r}$ is often represented as a matrix-vector multiplication $[\boldsymbol{\omega}]_{\times} \mathbf{r}$.
For $\boldsymbol{\omega} = \begin{bmatrix} \omega_x \\ \omega_y \\ \omega_z \end{bmatrix}$, derive the $3 \times 3$ skew-symmetric matrix $[\boldsymbol{\omega}]_{\times}$.

**Solution:**
From the component definition of $\boldsymbol{\omega} \times \mathbf{r}$:
$$\boldsymbol{\omega} \times \mathbf{r} = \begin{bmatrix} 0\cdot r_x - \omega_z r_y + \omega_y r_z \\ \omega_z r_x + 0\cdot r_y - \omega_x r_z \\ -\omega_y r_x + \omega_x r_y + 0\cdot r_z \end{bmatrix}$$
Expressing this as a linear transformation on $\mathbf{r} = \begin{bmatrix} r_x \\ r_y \\ r_z \end{bmatrix}$:
$$\boldsymbol{\omega} \times \mathbf{r} = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix} \begin{bmatrix} r_x \\ r_y \\ r_z \end{bmatrix}$$
The matrix:
$$[\boldsymbol{\omega}]_{\times} = \begin{bmatrix} 0 & -\omega_z & \omega_y \\ \omega_z & 0 & -\omega_x \\ -\omega_y & \omega_x & 0 \end{bmatrix}$$
Notice that $[\boldsymbol{\omega}]_{\times}^T = -[\boldsymbol{\omega}]_{\times}$ (it is skew-symmetric). This Lie algebra representation ($\mathfrak{so}(3)$) is the cornerstone of modern rigid body kinematics.

---

#### Example 6.9: Parallelogram Area and Height
**Problem:** Given adjacent sides $\mathbf{u} = \begin{bmatrix} 3 \\ 0 \\ 0 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 4 \\ 0 \end{bmatrix}$ in the $xy$-plane:
1. Find the area using the cross product.
2. Find the altitude $h$ of the parallelogram perpendicular to side $\mathbf{u}$.

**Solution:**
1. Cross product:
   $$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 3 & 0 & 0 \\ 1 & 4 & 0 \end{vmatrix} = \mathbf{k}((3)(4) - (0)(1)) = 12 \mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 12 \end{bmatrix}$$
   $$\text{Area} = \|\mathbf{u} \times \mathbf{v}\| = 12$$
2. Altitude $h$:
   $$\text{Area} = \|\mathbf{u}\| \times h \implies h = \frac{\text{Area}}{\|\mathbf{u}\|}$$
   $$\|\mathbf{u}\| = \sqrt{3^2 + 0^2 + 0^2} = 3$$
   $$h = \frac{12}{3} = 4$$
Notice that $\mathbf{v}$ has $y$-coordinate $4$, which is indeed the perpendicular height!

---

#### Example 6.10: Construction of an Orthogonal Vector to Any Non-Zero Vector
**Problem:** Write a robust mathematical procedure to construct a non-zero vector $\mathbf{p}$ perpendicular to an arbitrary non-zero vector $\mathbf{v} \in \mathbb{R}^3$ using the cross product.

**Solution:**
If we pick a fixed arbitrary vector $\mathbf{a}$ and compute $\mathbf{p} = \mathbf{v} \times \mathbf{a}$, $\mathbf{p}$ is guaranteed perpendicular to $\mathbf{v}$. However, if $\mathbf{v}$ happens to be parallel to $\mathbf{a}$, $\mathbf{v} \times \mathbf{a} = \mathbf{0}$!
To guarantee a non-zero perpendicular vector:
1. Compare $|v_x|$ and $|v_y|$ with $|v_z|$:
   - If $|v_x| < |v_y|$ and $|v_x| < |v_z|$: $\mathbf{v}$ is furthest from the $x$-axis $\mathbf{i} = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T$. Choose $\mathbf{a} = \mathbf{i}$.
   - Otherwise, choose $\mathbf{a} = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$.
2. Compute $\mathbf{p} = \mathbf{v} \times \mathbf{a}$.
3. Because $\mathbf{v}$ and $\mathbf{a}$ cannot be parallel, $\|\mathbf{p}\| > 0$.
*Example test:* Let $\mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ 5 \end{bmatrix}$. Smallest component is $x$ ($0 < 5$).
Take $\mathbf{a} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$.
$$\mathbf{p} = \begin{bmatrix} 0 \\ 0 \\ 5 \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 5 \\ 0 \end{bmatrix}$$
Check: $\mathbf{v} \cdot \mathbf{p} = (0)(0) + (0)(5) + (5)(0) = 0 \quad \checkmark$.

---

### Section 6.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 6.1
**Problem:** Compute the cross product $\mathbf{a} \times \mathbf{b}$ for $\mathbf{a} = \begin{bmatrix} 1 \\ 0 \\ -2 \end{bmatrix}$ and $\mathbf{b} = \begin{bmatrix} 3 \\ -1 \\ 4 \end{bmatrix}$.
**Solution:**
$$\mathbf{a} \times \mathbf{b} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 0 & -2 \\ 3 & -1 & 4 \end{vmatrix}$$
$$= \mathbf{i}((0)(4) - (-2)(-1)) - \mathbf{j}((1)(4) - (-2)(3)) + \mathbf{k}((1)(-1) - (0)(3))$$
$$= \mathbf{i}(0 - 2) - \mathbf{j}(4 + 6) + \mathbf{k}(-1 - 0) = \begin{bmatrix} -2 \\ -10 \\ -1 \end{bmatrix}$$

---

#### Exercise 6.2
**Problem:** Verify that the cross product of any vector $\mathbf{v} \in \mathbb{R}^3$ with the zero vector is the zero vector.
**Solution:**
$$\mathbf{v} \times \mathbf{0} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ v_x & v_y & v_z \\ 0 & 0 & 0 \end{vmatrix}$$
Expanding across the row of zeros gives $0\mathbf{i} + 0\mathbf{j} + 0\mathbf{k} = \mathbf{0} \quad \blacksquare$

---

#### Exercise 6.3
**Problem:** Show that $\mathbf{i} \times (\mathbf{j} \times \mathbf{k}) \ne (\mathbf{i} \times \mathbf{j}) \times \mathbf{k}$ or determine if they are equal in this specific case.
**Solution:**
1. Left side:
   $\mathbf{j} \times \mathbf{k} = \mathbf{i}$
   $\mathbf{i} \times (\mathbf{j} \times \mathbf{k}) = \mathbf{i} \times \mathbf{i} = \mathbf{0}$
2. Right side:
   $\mathbf{i} \times \mathbf{j} = \mathbf{k}$
   $(\mathbf{i} \times \mathbf{j}) \times \mathbf{k} = \mathbf{k} \times \mathbf{k} = \mathbf{0}$
In this particular symmetric case, both evaluate to $\mathbf{0}$. (However, associativity fails in general, as demonstrated in Section 6.4).

---

#### Exercise 6.4
**Problem:** Find the area of the triangle with vertices $P(0, 0, 0)$, $Q(3, 0, 0)$, and $R(0, 4, 0)$.
**Solution:**
$$\vec{PQ} = \begin{bmatrix} 3 \\ 0 \\ 0 \end{bmatrix}, \quad \vec{PR} = \begin{bmatrix} 0 \\ 4 \\ 0 \end{bmatrix}$$
$$\vec{PQ} \times \vec{PR} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 3 & 0 & 0 \\ 0 & 4 & 0 \end{vmatrix} = 12 \mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 12 \end{bmatrix}$$
$$\text{Area} = \frac{1}{2} \|\vec{PQ} \times \vec{PR}\| = \frac{1}{2}(12) = 6 \text{ units}^2$$
*Check via elementary geometry:* Right triangle with base 3 and height 4: $\frac{1}{2}(3)(4) = 6 \quad \checkmark$.

---

#### Exercise 6.5
**Problem:** Find a unit vector orthogonal to both $\mathbf{u} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$.
**Solution:**
1. Cross product:
   $$\mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 1 & 1 \\ 1 & 2 & 3 \end{vmatrix} = \mathbf{i}(3 - 2) - \mathbf{j}(3 - 1) + \mathbf{k}(2 - 1) = \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix}$$
2. Magnitude:
   $$\|\mathbf{u} \times \mathbf{v}\| = \sqrt{1^2 + (-2)^2 + 1^2} = \sqrt{1 + 4 + 1} = \sqrt{6}$$
3. Unit vector:
   $$\hat{\mathbf{n}} = \begin{bmatrix} 1/\sqrt{6} \\ -2/\sqrt{6} \\ 1/\sqrt{6} \end{bmatrix}$$

---

#### Exercise 6.6
**Problem:** If $\|\mathbf{u}\| = 5$, $\|\mathbf{v}\| = 8$, and $\mathbf{u} \cdot \mathbf{v} = 24$, find $\|\mathbf{u} \times \mathbf{v}\|$ without finding the coordinates of $\mathbf{u}$ or $\mathbf{v}$.
**Solution:**
Use Lagrange's Identity:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2$$
$$\|\mathbf{u} \times \mathbf{v}\|^2 = (5^2)(8^2) - 24^2 = (25)(64) - 576 = 1600 - 576 = 1024$$
$$\|\mathbf{u} \times \mathbf{v}\| = \sqrt{1024} = 32$$

---

#### Exercise 6.7
**Problem:** Prove that $(\mathbf{u} - \mathbf{v}) \times (\mathbf{u} + \mathbf{v}) = 2(\mathbf{u} \times \mathbf{v})$.
**Solution:**
Expand using distributivity:
$$(\mathbf{u} - \mathbf{v}) \times (\mathbf{u} + \mathbf{v}) = \mathbf{u} \times \mathbf{u} + \mathbf{u} \times \mathbf{v} - \mathbf{v} \times \mathbf{u} - \mathbf{v} \times \mathbf{v}$$
Since $\mathbf{u} \times \mathbf{u} = \mathbf{0}$ and $\mathbf{v} \times \mathbf{v} = \mathbf{0}$:
$$= \mathbf{0} + \mathbf{u} \times \mathbf{v} - (-(\mathbf{u} \times \mathbf{v})) - \mathbf{0} = \mathbf{u} \times \mathbf{v} + \mathbf{u} \times \mathbf{v} = 2(\mathbf{u} \times \mathbf{v}) \quad \blacksquare$$

---

#### Exercise 6.8
**Problem:** In a physics engine, a rigid body spins with angular velocity $\boldsymbol{\omega} = \begin{bmatrix} 2 \\ -1 \\ 3 \end{bmatrix} \text{ rad/s}$. Find the velocity of the point located at $\mathbf{r} = \begin{bmatrix} 1 \\ 4 \\ -2 \end{bmatrix} \text{ m}$.
**Solution:**
$$\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & -1 & 3 \\ 1 & 4 & -2 \end{vmatrix}$$
$$v_x = (-1)(-2) - (3)(4) = 2 - 12 = -10$$
$$v_y = -((2)(-2) - (3)(1)) = -(-4 - 3) = 7$$
$$v_z = (2)(4) - (-1)(1) = 8 - (-1) = 9$$
$$\mathbf{v} = \begin{bmatrix} -10 \\ 7 \\ 9 \end{bmatrix} \text{ m/s}$$

---

#### Exercise 6.9
**Problem:** Prove that if $\mathbf{u} \times \mathbf{v} = \mathbf{u} \times \mathbf{w}$ and $\mathbf{u} \ne \mathbf{0}$, it does NOT necessarily imply $\mathbf{v} = \mathbf{w}$.
**Solution:**
$$\mathbf{u} \times \mathbf{v} - \mathbf{u} \times \mathbf{w} = \mathbf{0} \implies \mathbf{u} \times (\mathbf{v} - \mathbf{w}) = \mathbf{0}$$
The cross product vanishes if and only if $(\mathbf{v} - \mathbf{w})$ is parallel to $\mathbf{u}$, i.e., $\mathbf{v} - \mathbf{w} = c \mathbf{u}$ for some scalar $c \in \mathbb{R}$.
Therefore, $\mathbf{v} = \mathbf{w} + c \mathbf{u}$.
As long as $c \ne 0$, $\mathbf{v} \ne \mathbf{w}$, yet their cross products with $\mathbf{u}$ are identical. (The cross product cannot be inverted uniquely; it has a non-trivial null space along $\mathbf{u}$). $\blacksquare$

---

#### Exercise 6.10
**Problem:** Three points in space are given by $A(2, 1, 3)$, $B(4, 2, 5)$, and $C(6, 3, 7)$. Determine whether these three points are collinear.
**Solution:**
Compute displacement vectors:
$$\vec{AB} = \begin{bmatrix} 4 - 2 \\ 2 - 1 \\ 5 - 3 \end{bmatrix} = \begin{bmatrix} 2 \\ 1 \\ 2 \end{bmatrix}$$
$$\vec{AC} = \begin{bmatrix} 6 - 2 \\ 3 - 1 \\ 7 - 3 \end{bmatrix} = \begin{bmatrix} 4 \\ 2 \\ 4 \end{bmatrix}$$
Compute their cross product:
$$\vec{AB} \times \vec{AC} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 1 & 2 \\ 4 & 2 & 4 \end{vmatrix}$$
$$= \mathbf{i}((1)(4) - (2)(2)) - \mathbf{j}((2)(4) - (2)(4)) + \mathbf{k}((2)(2) - (1)(4))$$
$$= \mathbf{i}(4 - 4) - \mathbf{j}(8 - 8) + \mathbf{k}(4 - 4) = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
Since $\vec{AB} \times \vec{AC} = \mathbf{0}$, the points $A, B, C$ lie on the exact same straight line (they are collinear).

# Chapter 7: Algebraic Identities and Triple Products in $\mathbb{R}^3$

> *"In the geometry of three dimensions, the interplay of the scalar and vector products creates algebraic harmonies of astonishing beautyâ€”where volumes are measured by determinants, and rotations obey the Lie algebra of spatial symmetries."*  
> â€” **Josiah Willard Gibbs**, *Vector Analysis* (1901)

---

### Section 7.1 The Scalar Triple Product (Box Product)

When we combine the dot product and the cross product across three vectors $\mathbf{u}, \mathbf{v}, \mathbf{w} \in \mathbb{R}^3$, the most natural scalar combination is:
$$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})$$

This quantity is known as the **scalar triple product**, or the **box product**, frequently written with the concise bracket notation:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] \equiv \mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})$$

Let us express the vectors in standard Cartesian components:
$$\mathbf{u} = \begin{bmatrix} u_x \\ u_y \\ u_z \end{bmatrix}, \quad \mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}, \quad \mathbf{w} = \begin{bmatrix} w_x \\ w_y \\ w_z \end{bmatrix}$$

Recalling the definition of the cross product $\mathbf{v} \times \mathbf{w}$:
$$\mathbf{v} \times \mathbf{w} = \begin{bmatrix} v_y w_z - v_z w_y \\ v_z w_x - v_x w_z \\ v_x w_y - v_y w_x \end{bmatrix}$$

Taking the dot product with $\mathbf{u}$:
$$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = u_x (v_y w_z - v_z w_y) + u_y (v_z w_x - v_x w_z) + u_z (v_x w_y - v_y w_x)$$

Notice that this expression is precisely the Laplace cofactor expansion of the $3 \times 3$ matrix formed by stacking the vectors as rows:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \begin{vmatrix} u_x & u_y & u_z \\ v_x & v_y & v_z \\ w_x & w_y & w_z \end{vmatrix}$$

Because the determinant of the transpose of a matrix equals the determinant of the matrix itself ($\det(\mathbf{M}) = \det(\mathbf{M}^T)$), the box product is also the determinant of the matrix having $\mathbf{u}, \mathbf{v}, \mathbf{w}$ as its columns:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \det\begin{bmatrix} \mathbf{u} & \mathbf{v} & \mathbf{w} \end{bmatrix}$$

```
                   w
                  /|
                 / |
                /  |
               +---+-----------+
              /|  /           /|
             / | /           / |
            +--+------------+  |
            |  |/           |  |
            |  +------------+--+
            | /   u         | /
            |/              |/
            +---------------+
                   v
        Volume = |u Â· (v x w)|
```

#### Cyclic and Interchange Symmetries:
By the alternating properties of determinants:
1. **Cyclic Permutations are Invariant:**
   Swapping two rows twice (an even permutation of rows) leaves the determinant unchanged:
   $$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = [\mathbf{v}, \mathbf{w}, \mathbf{u}] = [\mathbf{w}, \mathbf{u}, \mathbf{v}]$$
   In dot-cross notation:
   $$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = \mathbf{v} \cdot (\mathbf{w} \times \mathbf{u}) = \mathbf{w} \cdot (\mathbf{u} \times \mathbf{v})$$

2. **Swapping Dot and Cross:**
   Because the dot product is commutative, $\mathbf{w} \cdot (\mathbf{u} \times \mathbf{v}) = (\mathbf{u} \times \mathbf{v}) \cdot \mathbf{w}$.
   Therefore:
   $$\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = (\mathbf{u} \times \mathbf{v}) \cdot \mathbf{w}$$
   *The dot and cross operators can be freely interchanged without altering the result!*

3. **Odd Permutations Invert the Sign:**
   Swapping any two adjacent vectors (an odd permutation) negates the determinant:
   $$[\mathbf{u}, \mathbf{w}, \mathbf{v}] = -[\mathbf{u}, \mathbf{v}, \mathbf{w}]$$
   $$[\mathbf{v}, \mathbf{u}, \mathbf{w}] = -[\mathbf{u}, \mathbf{v}, \mathbf{w}]$$

---

### Section 7.2 Geometric Meaning: Signed Volume and Handedness

What is the physical and geometric interpretation of the scalar triple product?

Consider the parallelepiped (the 3D skewed box) spanned by the three vectors $\mathbf{u}, \mathbf{v}, \mathbf{w}$ meeting at a common vertex:
- The base of the parallelepiped is the parallelogram spanned by $\mathbf{v}$ and $\mathbf{w}$.
- Its base area is:
  $$A_{\text{base}} = \|\mathbf{v} \times \mathbf{w}\|$$
- The vector $\mathbf{n} = \mathbf{v} \times \mathbf{w}$ is perpendicular to the base parallelogram.
- The height $h$ of the parallelepiped is the perpendicular altitude of vector $\mathbf{u}$ above the plane of the base, which is the scalar projection of $\mathbf{u}$ onto the unit normal $\hat{\mathbf{n}}$:
  $$h = \|\mathbf{u}\| |\cos\phi| = \left| \mathbf{u} \cdot \frac{\mathbf{v} \times \mathbf{w}}{\|\mathbf{v} \times \mathbf{w}\|} \right|$$
  where $\phi$ is the angle between $\mathbf{u}$ and $\mathbf{v} \times \mathbf{w}$.

The geometric volume of the parallelepiped is:
$$V = A_{\text{base}} \times h = \|\mathbf{v} \times \mathbf{w}\| \times \left| \frac{\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})}{\|\mathbf{v} \times \mathbf{w}\|} \right| = |\mathbf{u} \cdot (\mathbf{v} \times \mathbf{w})|$$

Thus:
$$\text{Volume}_{\text{parallelepiped}} = |[\mathbf{u}, \mathbf{v}, \mathbf{w}]|$$

#### The Significance of the Sign: Handedness of the Triad
The sign of $[\mathbf{u}, \mathbf{v}, \mathbf{w}]$ reveals the spatial orientation (chirality) of the three vectors:
- **$[\mathbf{u}, \mathbf{v}, \mathbf{w}] > 0$:** The vectors form a **right-handed system** (positive orientation). Pointing the fingers of your right hand along $\mathbf{v}$ and curling toward $\mathbf{w}$ places your thumb on the same side of the plane as $\mathbf{u}$.
- **$[\mathbf{u}, \mathbf{v}, \mathbf{w}] < 0$:** The vectors form a **left-handed system** (negative orientation).
- **$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = 0$:** The volume collapses to zero; the three vectors are **coplanar**.

---

### Section 7.3 Coplanarity Test for Vectors and Points

Three vectors $\mathbf{u}, \mathbf{v}, \mathbf{w} \in \mathbb{R}^3$ lie in the exact same 2D plane (or are linearly dependent) if and only if their scalar triple product vanishes:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \mathbf{u} \cdot (\mathbf{v} \times \mathbf{w}) = 0$$

#### The 4-Point Coplanarity Test:
In 3D CAD modeling and mesh processing, four arbitrary points $A, B, C, D \in \mathbb{R}^3$ are coplanar (all four lie on a single flat plane) if and only if the three vectors originating from $A$ are coplanar:
$$[(\vec{B} - \vec{A}), (\vec{C} - \vec{A}), (\vec{D} - \vec{A})] = 0$$
$$\begin{vmatrix} B_x - A_x & B_y - A_y & B_z - A_z \\ C_x - A_x & C_y - A_y & C_z - A_z \\ D_x - A_x & D_y - A_y & D_z - A_z \end{vmatrix} = 0$$

If this determinant is non-zero, the four points form a non-degenerate 3D tetrahedron.

---

### Section 7.4 Tetrahedron Volume in 3D Space

A tetrahedron is the 3D simplexâ€”the simplest solid figure bounded by four planar triangular faces and four vertices: $A, B, C, D$.

```
                 D
                /|\
               / | \
              /  |  \
             /   |   \
            A----+----C
             \   |   /
              \  |  /
               \ | /
                 B
```

From solid geometry, any pyramid has volume $V = \frac{1}{3} \times \text{Base Area} \times \text{Height}$.
For a tetrahedron with base triangle $\triangle ABC$ and apex $D$:
- Base Area: $A_{\triangle} = \frac{1}{2} \|\vec{AB} \times \vec{AC}\|$.
- Height: $h = \text{scalar projection of } \vec{AD} \text{ onto } \frac{\vec{AB} \times \vec{AC}}{\|\vec{AB} \times \vec{AC}\|}$.

Therefore:
$$V_{\text{tetrahedron}} = \frac{1}{3} \left( \frac{1}{2} \|\vec{AB} \times \vec{AC}\| \right) h = \frac{1}{6} | \vec{AD} \cdot (\vec{AB} \times \vec{AC}) |$$

$$V_{\text{tetrahedron}} = \frac{1}{6} |[\vec{AB}, \vec{AC}, \vec{AD}]| = \frac{1}{6} \left| \det\begin{bmatrix} B_x - A_x & B_y - A_y & B_z - A_z \\ C_x - A_x & C_y - A_y & C_z - A_z \\ D_x - A_x & D_y - A_y & D_z - A_z \end{bmatrix} \right|$$

*Every parallelepiped can be decomposed into exactly 6 tetrahedra of equal volume.*
This formula is the fundamental building block for computing the exact volume, center of mass, and moment of inertia tensor of arbitrary 3D polygonal meshes (via tetrahedral decomposition).

---

### Section 7.5 The Vector Triple Product: Lagrange's "BAC-CAB" Identity

Now consider crossing a vector with the cross product of two other vectors:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$$

This is the **vector triple product**. Unlike the scalar triple product, the output is an actual 3D vector.

#### Geometric Direction Analysis:
1. The inner cross product $\mathbf{n} = \mathbf{v} \times \mathbf{w}$ is perpendicular to the plane spanned by $\mathbf{v}$ and $\mathbf{w}$.
2. The outer cross product $\mathbf{u} \times \mathbf{n}$ is perpendicular to $\mathbf{n}$.
3. But any vector perpendicular to the normal of a plane must **lie in that plane**!
Therefore, $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$ must be a linear combination of $\mathbf{v}$ and $\mathbf{w}$:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \alpha \mathbf{v} + \beta \mathbf{w}$$

The exact values of the scalars $\alpha$ and $\beta$ are given by **Lagrange's Vector Triple Product Identity**, universally remembered by the mnemonic **"BAC-CAB"**:

$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})$$

```
  Memory Rule: "B Â· (A Â· C) - C Â· (A Â· B)"
  Here:
    A = u, B = v, C = w
    u x (v x w) = v (u Â· w) - w (u Â· v)
```

#### What about $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w}$?
Applying anti-commutativity and the BAC-CAB rule:
$$(\mathbf{u} \times \mathbf{v}) \times \mathbf{w} = -\mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = -[\mathbf{u}(\mathbf{w} \cdot \mathbf{v}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u})] = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{u}(\mathbf{v} \cdot \mathbf{w})$$
Notice that $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$ lies in the plane of $\mathbf{v}$ and $\mathbf{w}$, whereas $(\mathbf{u} \times \mathbf{v}) \times \mathbf{w}$ lies in the plane of $\mathbf{u}$ and $\mathbf{v}$. They are completely different vectors!

#### Rigorous Algebraic Proof of the BAC-CAB Rule:
We evaluate the $x$-component of $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$:
Let $\mathbf{p} = \mathbf{v} \times \mathbf{w} = \begin{bmatrix} v_y w_z - v_z w_y \\ v_z w_x - v_x w_z \\ v_x w_y - v_y w_x \end{bmatrix}$.
Then:
$$[\mathbf{u} \times \mathbf{p}]_x = u_y p_z - u_z p_y = u_y(v_x w_y - v_y w_x) - u_z(v_z w_x - v_x w_z)$$
$$= u_y v_x w_y - u_y v_y w_x - u_z v_z w_x + u_z v_x w_z$$
Add and subtract $u_x v_x w_x$:
$$= (u_x v_x w_x + u_y v_x w_y + u_z v_x w_z) - (u_x v_x w_x + u_y v_y w_x + u_z v_z w_x)$$
Factor out $v_x$ from the first group, and $w_x$ from the second:
$$= v_x (u_x w_x + u_y w_y + u_z w_z) - w_x (u_x v_x + u_y v_y + u_z v_z)$$
$$= v_x (\mathbf{u} \cdot \mathbf{w}) - w_x (\mathbf{u} \cdot \mathbf{v}) = [\mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})]_x$$
By cyclic symmetry of indices, the exact same relation holds for the $y$ and $z$ components. Thus:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v}) \quad \blacksquare$$

---

### Section 7.6 The Jacobi Identity and the Lie Algebra $\mathfrak{so}(3)$

In theoretical physics and robotics, 3D rotations form the continuous Lie group $\mathrm{SO}(3)$ (Special Orthogonal group). The infinitesimal generators of 3D rotations form the Lie algebra $\mathfrak{so}(3)$, where the Lie bracket between two vectors is precisely the cross product:
$$[\mathbf{u}, \mathbf{v}]_{\text{Lie}} \equiv \mathbf{u} \times \mathbf{v}$$

Every Lie algebra must satisfy the **Jacobi Identity**:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) + \mathbf{v} \times (\mathbf{w} \times \mathbf{u}) + \mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{0}$$

#### Proof via BAC-CAB:
Expand all three terms using the BAC-CAB formula:
1. $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})$
2. $\mathbf{v} \times (\mathbf{w} \times \mathbf{u}) = \mathbf{w}(\mathbf{v} \cdot \mathbf{u}) - \mathbf{u}(\mathbf{v} \cdot \mathbf{w})$
3. $\mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{u}(\mathbf{w} \cdot \mathbf{v}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u})$

Summing the left-hand sides:
$$\text{Sum} = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v}) + \mathbf{w}(\mathbf{v} \cdot \mathbf{u}) - \mathbf{u}(\mathbf{v} \cdot \mathbf{w}) + \mathbf{u}(\mathbf{w} \cdot \mathbf{v}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u})$$

Since the dot product is commutative ($\mathbf{u} \cdot \mathbf{w} = \mathbf{w} \cdot \mathbf{u}$, $\mathbf{u} \cdot \mathbf{v} = \mathbf{v} \cdot \mathbf{u}$, $\mathbf{v} \cdot \mathbf{w} = \mathbf{w} \cdot \mathbf{v}$), the terms cancel in exact pairs:
- $\mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{v}(\mathbf{w} \cdot \mathbf{u}) = \mathbf{0}$
- $-\mathbf{w}(\mathbf{u} \cdot \mathbf{v}) + \mathbf{w}(\mathbf{v} \cdot \mathbf{u}) = \mathbf{0}$
- $-\mathbf{u}(\mathbf{v} \cdot \mathbf{w}) + \mathbf{u}(\mathbf{w} \cdot \mathbf{v}) = \mathbf{0}$

Therefore:
$$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) + \mathbf{v} \times (\mathbf{w} \times \mathbf{u}) + \mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{0} \quad \blacksquare$$

This guarantees that rotational kinematics and angular velocity addition are mathematically consistent in 3D physics engines.

---

### Section 7.7 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 7.1: Scalar Triple Product and Parallelepiped Volume
**Problem:** Given $\mathbf{u} = \begin{bmatrix} 2 \\ -3 \\ 1 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 1 \\ 0 \\ 4 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} -1 \\ 2 \\ 5 \end{bmatrix}$:
1. Compute the scalar triple product $[\mathbf{u}, \mathbf{v}, \mathbf{w}]$.
2. Find the volume of the parallelepiped spanned by these three vectors.
3. Determine whether $\{\mathbf{u}, \mathbf{v}, \mathbf{w}\}$ forms a right-handed or left-handed system.

**Solution:**
1. Compute via determinant:
   $$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \begin{vmatrix} 2 & -3 & 1 \\ 1 & 0 & 4 \\ -1 & 2 & 5 \end{vmatrix}$$
   Expand along row 1:
   $$= 2 \begin{vmatrix} 0 & 4 \\ 2 & 5 \end{vmatrix} - (-3) \begin{vmatrix} 1 & 4 \\ -1 & 5 \end{vmatrix} + 1 \begin{vmatrix} 1 & 0 \\ -1 & 2 \end{vmatrix}$$
   $$= 2(0 - 8) + 3(5 - (-4)) + 1(2 - 0)$$
   $$= 2(-8) + 3(9) + 1(2) = -16 + 27 + 2 = 13$$
2. Parallelepiped volume:
   $$\text{Volume} = |[\mathbf{u}, \mathbf{v}, \mathbf{w}]| = |13| = 13 \text{ units}^3$$
3. Handedness:
   Since $[\mathbf{u}, \mathbf{v}, \mathbf{w}] = +13 > 0$, the triad forms a **right-handed system**.

---

#### Example 7.2: Vector Triple Product via BAC-CAB
**Problem:** Compute $\mathbf{u} \times (\mathbf{v} \times \mathbf{w})$ for $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$ using:
1. The BAC-CAB identity.
2. Direct sequential cross products.

**Solution:**
1. **Via BAC-CAB:**
   $$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{v}(\mathbf{u} \cdot \mathbf{w}) - \mathbf{w}(\mathbf{u} \cdot \mathbf{v})$$
   Compute dot products:
   $$\mathbf{u} \cdot \mathbf{w} = (1)(0) + (2)(0) + (3)(1) = 3$$
   $$\mathbf{u} \cdot \mathbf{v} = (1)(0) + (2)(1) + (3)(0) = 2$$
   Substitute:
   $$= \mathbf{v}(3) - \mathbf{w}(2) = 3 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} - 2 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ 3 \\ -2 \end{bmatrix}$$

2. **Via Sequential Cross Products:**
   $$\mathbf{v} \times \mathbf{w} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \mathbf{j} \times \mathbf{k} = \mathbf{i} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   $$\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
   $$= \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & 3 \\ 1 & 0 & 0 \end{vmatrix} = \mathbf{i}(0 - 0) - \mathbf{j}(0 - 3) + \mathbf{k}(0 - 2) = 3\mathbf{j} - 2\mathbf{k} = \begin{bmatrix} 0 \\ 3 \\ -2 \end{bmatrix}$$
Both methods produce the identical vector $\begin{bmatrix} 0 \\ 3 \\ -2 \end{bmatrix} \quad \checkmark$.

---

#### Example 7.3: Testing Coplanarity of 4 Points
**Problem:** Determine if the four points $A(1, 2, 3)$, $B(2, 4, 5)$, $C(4, 5, 6)$, and $D(3, 1, 0)$ lie on the same 3D plane.

**Solution:**
1. Form displacement vectors with base $A$:
   $$\vec{AB} = B - A = \begin{bmatrix} 2 - 1 \\ 4 - 2 \\ 5 - 3 \end{bmatrix} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$$
   $$\vec{AC} = C - A = \begin{bmatrix} 4 - 1 \\ 5 - 2 \\ 6 - 3 \end{bmatrix} = \begin{bmatrix} 3 \\ 3 \\ 3 \end{bmatrix}$$
   $$\vec{AD} = D - A = \begin{bmatrix} 3 - 1 \\ 1 - 2 \\ 0 - 3 \end{bmatrix} = \begin{bmatrix} 2 \\ -1 \\ -3 \end{bmatrix}$$
2. Compute the scalar triple product:
   $$[\vec{AB}, \vec{AC}, \vec{AD}] = \begin{vmatrix} 1 & 2 & 2 \\ 3 & 3 & 3 \\ 2 & -1 & -3 \end{vmatrix}$$
   Factor out 3 from row 2:
   $$= 3 \begin{vmatrix} 1 & 2 & 2 \\ 1 & 1 & 1 \\ 2 & -1 & -3 \end{vmatrix}$$
   Expand determinant:
   $$= 3 [ 1(1(-3) - 1(-1)) - 2(1(-3) - 1(2)) + 2(1(-1) - 1(2)) ]$$
   $$= 3 [ 1(-3 + 1) - 2(-3 - 2) + 2(-1 - 2) ]$$
   $$= 3 [ -2 - 2(-5) + 2(-3) ] = 3 [ -2 + 10 - 6 ] = 3 [ 2 ] = 6$$
3. Conclusion:
   Since $[\vec{AB}, \vec{AC}, \vec{AD}] = 6 \ne 0$, the four points are **not coplanar**. They form a 3D tetrahedron with non-zero volume ($V = \frac{6}{6} = 1.0$).

---

#### Example 7.4: Exact Tetrahedron Volume Calculation
**Problem:** Find the exact volume of the tetrahedron with vertices $O(0, 0, 0)$, $A(3, 0, 0)$, $B(0, 4, 0)$, and $C(0, 0, 5)$.

**Solution:**
The edge vectors from origin $O$ are:
$$\mathbf{a} = \begin{bmatrix} 3 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 0 \\ 4 \\ 0 \end{bmatrix}, \quad \mathbf{c} = \begin{bmatrix} 0 \\ 0 \\ 5 \end{bmatrix}$$
The scalar triple product is the determinant of this diagonal matrix:
$$[\mathbf{a}, \mathbf{b}, \mathbf{c}] = \begin{vmatrix} 3 & 0 & 0 \\ 0 & 4 & 0 \\ 0 & 0 & 5 \end{vmatrix} = 3 \times 4 \times 5 = 60$$
The volume of the tetrahedron is:
$$V_{\text{tet}} = \frac{1}{6} |[\mathbf{a}, \mathbf{b}, \mathbf{c}]| = \frac{1}{6}(60) = 10 \text{ units}^3$$
*Elementary geometry check:* A right corner tetrahedron with perpendicular heights 3, 4, 5 has base area $\frac{1}{2}(3)(4) = 6$ and volume $\frac{1}{3}(6)(5) = 10 \quad \checkmark$.

---

#### Example 7.5: Proving the Product of Two Cross Products (Binet-Cauchy Identity)
**Problem:** Prove the Binet-Cauchy identity:
$$(\mathbf{a} \times \mathbf{b}) \cdot (\mathbf{c} \times \mathbf{d}) = (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{a} \cdot \mathbf{d})(\mathbf{b} \cdot \mathbf{c})$$

**Solution:**
Let $\mathbf{u} = \mathbf{a} \times \mathbf{b}$.
We need to evaluate $\mathbf{u} \cdot (\mathbf{c} \times \mathbf{d})$.
Using the interchange property of dot and cross products (Section 7.1):
$$\mathbf{u} \cdot (\mathbf{c} \times \mathbf{d}) = (\mathbf{u} \times \mathbf{c}) \cdot \mathbf{d}$$
Substitute back $\mathbf{u} = \mathbf{a} \times \mathbf{b}$:
$$= ((\mathbf{a} \times \mathbf{b}) \times \mathbf{c}) \cdot \mathbf{d}$$
Apply the BAC-CAB identity to $(\mathbf{a} \times \mathbf{b}) \times \mathbf{c} = -\mathbf{c} \times (\mathbf{a} \times \mathbf{b}) = -[\mathbf{a}(\mathbf{c} \cdot \mathbf{b}) - \mathbf{b}(\mathbf{c} \cdot \mathbf{a})] = \mathbf{b}(\mathbf{a} \cdot \mathbf{c}) - \mathbf{a}(\mathbf{b} \cdot \mathbf{c})$:
$$= [\mathbf{b}(\mathbf{a} \cdot \mathbf{c}) - \mathbf{a}(\mathbf{b} \cdot \mathbf{c})] \cdot \mathbf{d}$$
Distributing the dot product with $\mathbf{d}$:
$$= (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{b} \cdot \mathbf{c})(\mathbf{a} \cdot \mathbf{d})$$
$$= (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{a} \cdot \mathbf{d})(\mathbf{b} \cdot \mathbf{c}) \quad \blacksquare$$

---

#### Example 7.6: Lagrange's Identity as a Special Case of Binet-Cauchy
**Problem:** Use the Binet-Cauchy identity to derive Lagrange's identity for $\|\mathbf{u} \times \mathbf{v}\|^2$.

**Solution:**
In the Binet-Cauchy identity:
$$(\mathbf{a} \times \mathbf{b}) \cdot (\mathbf{c} \times \mathbf{d}) = (\mathbf{a} \cdot \mathbf{c})(\mathbf{b} \cdot \mathbf{d}) - (\mathbf{a} \cdot \mathbf{d})(\mathbf{b} \cdot \mathbf{c})$$
Set $\mathbf{a} = \mathbf{c} = \mathbf{u}$ and $\mathbf{b} = \mathbf{d} = \mathbf{v}$:
$$(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{u} \times \mathbf{v}) = (\mathbf{u} \cdot \mathbf{u})(\mathbf{v} \cdot \mathbf{v}) - (\mathbf{u} \cdot \mathbf{v})(\mathbf{v} \cdot \mathbf{u})$$
Since $(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{u} \times \mathbf{v}) = \|\mathbf{u} \times \mathbf{v}\|^2$, $\mathbf{u} \cdot \mathbf{u} = \|\mathbf{u}\|^2$, and $\mathbf{v} \cdot \mathbf{v} = \|\mathbf{v}\|^2$:
$$\|\mathbf{u} \times \mathbf{v}\|^2 = \|\mathbf{u}\|^2 \|\mathbf{v}\|^2 - (\mathbf{u} \cdot \mathbf{v})^2 \quad \blacksquare$$

---

#### Example 7.7: Verification of Jacobi's Identity
**Problem:** Explicitly verify the Jacobi Identity for $\mathbf{u} = \mathbf{i}$, $\mathbf{v} = \mathbf{j}$, and $\mathbf{w} = \mathbf{k}$.

**Solution:**
Compute each of the three cyclical terms:
1. First term:
   $\mathbf{v} \times \mathbf{w} = \mathbf{j} \times \mathbf{k} = \mathbf{i}$
   $\mathbf{u} \times (\mathbf{v} \times \mathbf{w}) = \mathbf{i} \times \mathbf{i} = \mathbf{0}$
2. Second term:
   $\mathbf{w} \times \mathbf{u} = \mathbf{k} \times \mathbf{i} = \mathbf{j}$
   $\mathbf{v} \times (\mathbf{w} \times \mathbf{u}) = \mathbf{j} \times \mathbf{j} = \mathbf{0}$
3. Third term:
   $\mathbf{u} \times \mathbf{v} = \mathbf{i} \times \mathbf{j} = \mathbf{k}$
   $\mathbf{w} \times (\mathbf{u} \times \mathbf{v}) = \mathbf{k} \times \mathbf{k} = \mathbf{0}$
Sum:
$$\mathbf{0} + \mathbf{0} + \mathbf{0} = \mathbf{0} \quad \checkmark$$

---

#### Example 7.8: Physics Application: Centripetal Acceleration Derivation
**Problem:** For a point rotating at fixed radius with constant angular velocity $\boldsymbol{\omega}$, its velocity is $\mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$.
Using the product rule and BAC-CAB, prove that the acceleration is $\mathbf{a} = \boldsymbol{\alpha} \times \mathbf{r} - \omega^2 \mathbf{r}_{\perp}$, where $\boldsymbol{\alpha} = \frac{d\boldsymbol{\omega}}{dt}$.

**Solution:**
1. Differentiate velocity with respect to time:
   $$\mathbf{a} = \frac{d\mathbf{v}}{dt} = \frac{d}{dt}(\boldsymbol{\omega} \times \mathbf{r}) = \left(\frac{d\boldsymbol{\omega}}{dt} \times \mathbf{r}\right) + \left(\boldsymbol{\omega} \times \frac{d\mathbf{r}}{dt}\right)$$
2. Substitute $\boldsymbol{\alpha} = \frac{d\boldsymbol{\omega}}{dt}$ and $\frac{d\mathbf{r}}{dt} = \mathbf{v} = \boldsymbol{\omega} \times \mathbf{r}$:
   $$\mathbf{a} = (\boldsymbol{\alpha} \times \mathbf{r}) + \boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r})$$
3. Apply BAC-CAB to the second term:
   $$\boldsymbol{\omega} \times (\boldsymbol{\omega} \times \mathbf{r}) = \boldsymbol{\omega}(\boldsymbol{\omega} \cdot \mathbf{r}) - \mathbf{r}(\boldsymbol{\omega} \cdot \boldsymbol{\omega})$$
   $$= \boldsymbol{\omega}(\boldsymbol{\omega} \cdot \mathbf{r}) - \omega^2 \mathbf{r} = -\omega^2 \left[ \mathbf{r} - \frac{\boldsymbol{\omega} \cdot \mathbf{r}}{\omega^2}\boldsymbol{\omega} \right] = -\omega^2 \mathbf{r}_{\perp}$$
   where $\mathbf{r}_{\perp}$ is the perpendicular component of position from the rotation axis.
4. Therefore:
   $$\mathbf{a} = \boldsymbol{\alpha} \times \mathbf{r} - \omega^2 \mathbf{r}_{\perp} \quad \blacksquare$$
The first term is the **tangential acceleration** and the second term is the **centripetal acceleration** pointing directly toward the axis of rotation!

---

#### Example 7.9: Coplanarity with a Free Parameter
**Problem:** Find the scalar $k$ such that the vectors $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 3 \\ k \\ 1 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}$ are coplanar.

**Solution:**
The vectors are coplanar if and only if $[\mathbf{u}, \mathbf{v}, \mathbf{w}] = 0$:
$$\begin{vmatrix} 1 & 2 & 3 \\ 3 & k & 1 \\ 2 & -1 & 4 \end{vmatrix} = 0$$
Expand along row 1:
$$1(4k - (-1)(1)) - 2(3(4) - 1(2)) + 3(3(-1) - k(2)) = 0$$
$$1(4k + 1) - 2(12 - 2) + 3(-3 - 2k) = 0$$
$$4k + 1 - 2(10) - 9 - 6k = 0$$
$$-2k + 1 - 20 - 9 = 0$$
$$-2k - 28 = 0 \implies 2k = -28 \implies k = -14$$
*Check:* With $k = -14$:
$$1(4(-14) + 1) - 20 - 9 - 6(-14) = 1(-55) - 29 + 84 = -84 + 84 = 0 \quad \checkmark$$

---

#### Example 7.10: Reciprocal Basis in Crystallography
**Problem:** Given a non-coplanar crystal lattice basis $\{\mathbf{a}, \mathbf{b}, \mathbf{c}\}$, the reciprocal lattice vectors are defined as:
$$\mathbf{a}^* = \frac{\mathbf{b} \times \mathbf{c}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}, \quad \mathbf{b}^* = \frac{\mathbf{c} \times \mathbf{a}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}, \quad \mathbf{c}^* = \frac{\mathbf{a} \times \mathbf{b}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}$$
Prove that $\mathbf{a} \cdot \mathbf{a}^* = 1$ and $\mathbf{a} \cdot \mathbf{b}^* = 0$.

**Solution:**
1. Compute $\mathbf{a} \cdot \mathbf{a}^*$:
   $$\mathbf{a} \cdot \mathbf{a}^* = \mathbf{a} \cdot \left(\frac{\mathbf{b} \times \mathbf{c}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}\right) = \frac{\mathbf{a} \cdot (\mathbf{b} \times \mathbf{c})}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]} = \frac{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]} = 1 \quad \checkmark$$
2. Compute $\mathbf{a} \cdot \mathbf{b}^*$:
   $$\mathbf{a} \cdot \mathbf{b}^* = \mathbf{a} \cdot \left(\frac{\mathbf{c} \times \mathbf{a}}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}\right) = \frac{\mathbf{a} \cdot (\mathbf{c} \times \mathbf{a})}{[\mathbf{a}, \mathbf{b}, \mathbf{c}]}$$
   Since $(\mathbf{c} \times \mathbf{a})$ is perpendicular to $\mathbf{a}$, the numerator is $\mathbf{a} \cdot (\mathbf{c} \times \mathbf{a}) = 0$.
   Therefore:
   $$\mathbf{a} \cdot \mathbf{b}^* = 0 \quad \checkmark$$
In general, $\mathbf{a}_i \cdot \mathbf{a}_j^* = \delta_{ij}$.

---

### Section 7.8 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 7.1
**Problem:** Calculate $[\mathbf{u}, \mathbf{v}, \mathbf{w}]$ for $\mathbf{u} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$.
**Solution:**
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = \begin{vmatrix} 1 & 0 & 0 \\ 0 & 2 & 0 \\ 0 & 0 & 3 \end{vmatrix} = 1 \times 2 \times 3 = 6$$

---

#### Exercise 7.2
**Problem:** If $[\mathbf{a}, \mathbf{b}, \mathbf{c}] = 7$, find the value of $[\mathbf{b}, \mathbf{a}, \mathbf{c}]$.
**Solution:**
Swapping the first two arguments $\mathbf{a}$ and $\mathbf{b}$ corresponds to swapping row 1 and row 2 of the determinant, which negates the value:
$$[\mathbf{b}, \mathbf{a}, \mathbf{c}] = -[\mathbf{a}, \mathbf{b}, \mathbf{c}] = -7$$

---

#### Exercise 7.3
**Problem:** If $[\mathbf{a}, \mathbf{b}, \mathbf{c}] = 7$, find the value of $[2\mathbf{a} + \mathbf{b}, 3\mathbf{b}, \mathbf{c}]$.
**Solution:**
By multilinearity of determinants:
$$[2\mathbf{a} + \mathbf{b}, 3\mathbf{b}, \mathbf{c}] = [2\mathbf{a}, 3\mathbf{b}, \mathbf{c}] + [\mathbf{b}, 3\mathbf{b}, \mathbf{c}]$$
The second term has two collinear rows ($\mathbf{b}$ and $3\mathbf{b}$), so its determinant is zero: $[\mathbf{b}, 3\mathbf{b}, \mathbf{c}] = 0$.
For the first term, factor out scalars:
$$[2\mathbf{a}, 3\mathbf{b}, \mathbf{c}] = (2)(3)[\mathbf{a}, \mathbf{b}, \mathbf{c}] = 6(7) = 42$$

---

#### Exercise 7.4
**Problem:** Prove that $(\mathbf{a} \times \mathbf{b}) \times (\mathbf{c} \times \mathbf{d}) = [\mathbf{a}, \mathbf{b}, \mathbf{d}]\mathbf{c} - [\mathbf{a}, \mathbf{b}, \mathbf{c}]\mathbf{d}$.
**Solution:**
Let $\mathbf{N} = \mathbf{a} \times \mathbf{b}$.
Then the expression is $\mathbf{N} \times (\mathbf{c} \times \mathbf{d})$.
Applying BAC-CAB:
$$\mathbf{N} \times (\mathbf{c} \times \mathbf{d}) = \mathbf{c}(\mathbf{N} \cdot \mathbf{d}) - \mathbf{d}(\mathbf{N} \cdot \mathbf{c})$$
Substitute back $\mathbf{N} = \mathbf{a} \times \mathbf{b}$:
$$\mathbf{N} \cdot \mathbf{d} = (\mathbf{a} \times \mathbf{b}) \cdot \mathbf{d} = [\mathbf{a}, \mathbf{b}, \mathbf{d}]$$
$$\mathbf{N} \cdot \mathbf{c} = (\mathbf{a} \times \mathbf{b}) \cdot \mathbf{c} = [\mathbf{a}, \mathbf{b}, \mathbf{c}]$$
Thus:
$$(\mathbf{a} \times \mathbf{b}) \times (\mathbf{c} \times \mathbf{d}) = [\mathbf{a}, \mathbf{b}, \mathbf{d}]\mathbf{c} - [\mathbf{a}, \mathbf{b}, \mathbf{c}]\mathbf{d} \quad \blacksquare$$

---

#### Exercise 7.5
**Problem:** Find the volume of the tetrahedron with vertices $A(1, 1, 1)$, $B(2, 1, 3)$, $C(3, 2, 2)$, and $D(1, 3, 4)$.
**Solution:**
Displacement vectors from $A$:
$$\vec{AB} = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix}, \quad \vec{AC} = \begin{bmatrix} 2 \\ 1 \\ 1 \end{bmatrix}, \quad \vec{AD} = \begin{bmatrix} 0 \\ 2 \\ 3 \end{bmatrix}$$
Determinant:
$$[\vec{AB}, \vec{AC}, \vec{AD}] = \begin{vmatrix} 1 & 0 & 2 \\ 2 & 1 & 1 \\ 0 & 2 & 3 \end{vmatrix}$$
$$= 1(3 - 2) - 0 + 2(4 - 0) = 1(1) + 2(4) = 1 + 8 = 9$$
Volume:
$$V = \frac{1}{6} |9| = \frac{9}{6} = \frac{3}{2} = 1.5 \text{ units}^3$$

---

#### Exercise 7.6
**Problem:** Show that $\mathbf{u} \cdot (\mathbf{u} \times \mathbf{v}) = 0$ directly from the determinant definition of the scalar triple product.
**Solution:**
$$[\mathbf{u}, \mathbf{u}, \mathbf{v}] = \begin{vmatrix} u_x & u_y & u_z \\ u_x & u_y & u_z \\ v_x & v_y & v_z \end{vmatrix}$$
A determinant with two identical rows is identically zero. Thus $[\mathbf{u}, \mathbf{u}, \mathbf{v}] = 0 \quad \blacksquare$

---

#### Exercise 7.7
**Problem:** Expand and simplify $(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{v} \times \mathbf{w})$.
**Solution:**
Using the Binet-Cauchy identity with $\mathbf{a} = \mathbf{u}$, $\mathbf{b} = \mathbf{v}$, $\mathbf{c} = \mathbf{v}$, $\mathbf{d} = \mathbf{w}$:
$$(\mathbf{u} \times \mathbf{v}) \cdot (\mathbf{v} \times \mathbf{w}) = (\mathbf{u} \cdot \mathbf{v})(\mathbf{v} \cdot \mathbf{w}) - (\mathbf{u} \cdot \mathbf{w})(\mathbf{v} \cdot \mathbf{v}) = (\mathbf{u} \cdot \mathbf{v})(\mathbf{v} \cdot \mathbf{w}) - \|\mathbf{v}\|^2(\mathbf{u} \cdot \mathbf{w})$$

---

#### Exercise 7.8
**Problem:** Prove that if $\mathbf{u} + \mathbf{v} + \mathbf{w} = \mathbf{0}$, then $\mathbf{u} \times \mathbf{v} = \mathbf{v} \times \mathbf{w} = \mathbf{w} \times \mathbf{u}$.
**Solution:**
1. Cross $\mathbf{u} + \mathbf{v} + \mathbf{w} = \mathbf{0}$ with $\mathbf{u}$ on the left:
   $$\mathbf{u} \times (\mathbf{u} + \mathbf{v} + \mathbf{w}) = \mathbf{u} \times \mathbf{0} \implies \mathbf{0} + \mathbf{u} \times \mathbf{v} + \mathbf{u} \times \mathbf{w} = \mathbf{0}$$
   $$\mathbf{u} \times \mathbf{v} = -(\mathbf{u} \times \mathbf{w}) = \mathbf{w} \times \mathbf{u}$$
2. Cross $\mathbf{u} + \mathbf{v} + \mathbf{w} = \mathbf{0}$ with $\mathbf{v}$ on the left:
   $$\mathbf{v} \times (\mathbf{u} + \mathbf{v} + \mathbf{w}) = \mathbf{0} \implies \mathbf{v} \times \mathbf{u} + \mathbf{0} + \mathbf{v} \times \mathbf{w} = \mathbf{0}$$
   $$\mathbf{v} \times \mathbf{w} = -(\mathbf{v} \times \mathbf{u}) = \mathbf{u} \times \mathbf{v}$$
Therefore, $\mathbf{u} \times \mathbf{v} = \mathbf{v} \times \mathbf{w} = \mathbf{w} \times \mathbf{u} \quad \blacksquare$

---

#### Exercise 7.9
**Problem:** In physics, the Poynting vector is $\mathbf{S} = \frac{1}{\mu_0}(\mathbf{E} \times \mathbf{B})$. For an electromagnetic plane wave with $\mathbf{E} = E_0 \mathbf{i}$ and $\mathbf{B} = B_0 \mathbf{j}$, find the direction and magnitude of energy flow $\mathbf{S}$.
**Solution:**
$$\mathbf{S} = \frac{1}{\mu_0}(E_0 \mathbf{i} \times B_0 \mathbf{j}) = \frac{E_0 B_0}{\mu_0}(\mathbf{i} \times \mathbf{j}) = \frac{E_0 B_0}{\mu_0} \mathbf{k}$$
The energy flows along the positive $z$-axis ($\mathbf{k}$) with magnitude $\frac{E_0 B_0}{\mu_0} \text{ W/m}^2$.

---

#### Exercise 7.10
**Problem:** What is the volume of the parallelepiped spanned by $\mathbf{u} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$, $\mathbf{v} = \begin{bmatrix} 2 \\ 4 \\ 6 \end{bmatrix}$, and $\mathbf{w} = \begin{bmatrix} 7 \\ 8 \\ 9 \end{bmatrix}$?
**Solution:**
Notice that $\mathbf{v} = 2\mathbf{u}$.
Since two of the vectors are linearly dependent (collinear), the three vectors do not span a 3D volume (they span at most a 2D plane).
Thus:
$$[\mathbf{u}, \mathbf{v}, \mathbf{w}] = 0 \implies \text{Volume} = 0 \text{ units}^3$$

# Chapter 8: Lines and Skew Rays in 3D Space

> *"In the flat plane of Euclid, two straight lines that never meet must needs be parallel; but in the vast theatre of three dimensions, lines may pass one another like ships in the nightâ€”infinitely separated, never parallel, and never touching."*  
> â€” **Gaspard Monge**, *Application de l'Analyse Ã  la GÃ©omÃ©trie* (1807)

---

### Section 8.1 Vector and Parametric Equations of a Line in $\mathbb{R}^3$

In two-dimensional analytic geometry, a straight line is customarily described by a single scalar equation: $y = mx + b$ or $Ax + By + C = 0$. In three-dimensional space, however, a single linear equation in coordinates $(x, y, z)$ does **not** describe a lineâ€”it describes an infinite **two-dimensional plane**!

To define a 1D line in $\mathbb{R}^3$, we must specify a trajectory through space parameterized by a real scalar $t \in \mathbb{R}$.

Let $\mathbf{P}_0 = (x_0, y_0, z_0)$ be a known reference point on the line, and let $\mathbf{d} = \begin{bmatrix} d_x \\ d_y \\ d_z \end{bmatrix}$ be a non-zero **direction vector** pointing along the line.

```
                   r(t) = P0 + t * d
                 +-----------------------> Line L
                /
               /
              / P0
             /
            /
           O
```

Any point $\mathbf{r}(t) = (x(t), y(t), z(t))$ on the line is reached by starting at $\mathbf{P}_0$ and traveling a scaled distance along direction $\mathbf{d}$:
$$\mathbf{r}(t) = \mathbf{P}_0 + t \mathbf{d}, \quad t \in \mathbb{R}$$

In scalar Cartesian components, this yields the **parametric equations** of the line:
$$\begin{cases} x(t) = x_0 + t \, d_x \\ y(t) = y_0 + t \, d_y \\ z(t) = z_0 + t \, d_z \end{cases}$$

#### Rays versus Line Segments:
- **Infinite Line:** $-\infty < t < \infty$.
- **Ray (Half-Line):** $0 \le t < \infty$ (emanating from origin $\mathbf{P}_0$ toward $\mathbf{d}$, ubiquitous in raytracing and optics).
- **Line Segment:** $0 \le t \le 1$ connecting endpoints $\mathbf{P}_0$ and $\mathbf{P}_1$ (where $\mathbf{d} = \mathbf{P}_1 - \mathbf{P}_0$).

---

### Section 8.2 Symmetric Form of a Line Equation

If all three direction components are non-zero ($d_x \ne 0, d_y \ne 0, d_z \ne 0$), we can solve each parametric equation for the common parameter $t$:
$$t = \frac{x - x_0}{d_x} = \frac{y - y_0}{d_y} = \frac{z - z_0}{d_z}$$

This continuous double equality is the **symmetric form** of the line.

Notice that this double equality actually represents the simultaneous intersection of two independent planes:
$$\frac{x - x_0}{d_x} = \frac{y - y_0}{d_y} \iff d_y(x - x_0) - d_x(y - y_0) = 0 \quad (\text{Plane 1})$$
$$\frac{y - y_0}{d_y} = \frac{z - z_0}{d_z} \iff d_z(y - y_0) - d_y(z - z_0) = 0 \quad (\text{Plane 2})$$

A 1D line in 3D space is geometrically the intersection of two non-parallel 2D planes!

*Handling Zero Components:*  
If one component is zero, say $d_z = 0$, the line remains parallel to the $xy$-plane, and its symmetric form is written as:
$$\frac{x - x_0}{d_x} = \frac{y - y_0}{d_y}, \quad z = z_0$$

---

### Section 8.3 The Four Relative Configurations of Two Lines in 3D

In 2D, two lines can only be parallel, coincident, or intersecting. In 3D space, there are **four** mutually exclusive geometric relationships between two lines $L_1: \mathbf{r}_1(s) = \mathbf{P}_1 + s\mathbf{d}_1$ and $L_2: \mathbf{r}_2(t) = \mathbf{P}_2 + t\mathbf{d}_2$:

```
        Parallel                Intersecting                   Skew
    L1 ------------>         L1 \     / L2               L1 ------------>
    L2 ------------>             \   /                      
                                  \ /                     L2 ...../.....
                                   X                             /
                                  / \                           /
```

1. **Coincident:** The lines are identical ($L_1 = L_2$). Direction vectors are collinear ($\mathbf{d}_1 \times \mathbf{d}_2 = \mathbf{0}$) and $\mathbf{P}_2 - \mathbf{P}_1$ is also collinear with $\mathbf{d}_1$.
2. **Parallel (Distinct):** Direction vectors are collinear ($\mathbf{d}_1 \times \mathbf{d}_2 = \mathbf{0}$), but $\mathbf{P}_2$ does not lie on $L_1$ ($(\mathbf{P}_2 - \mathbf{P}_1) \times \mathbf{d}_1 \ne \mathbf{0}$).
3. **Intersecting:** The direction vectors are not collinear ($\mathbf{d}_1 \times \mathbf{d}_2 \ne \mathbf{0}$), they share a common plane ($[(\mathbf{P}_2 - \mathbf{P}_1), \mathbf{d}_1, \mathbf{d}_2] = 0$), and meet at exactly one intersection point.
4. **Skew:** The lines are not parallel ($\mathbf{d}_1 \times \mathbf{d}_2 \ne \mathbf{0}$) and **never intersect**! They lie in different parallel planes ($[(\mathbf{P}_2 - \mathbf{P}_1), \mathbf{d}_1, \mathbf{d}_2] \ne 0$).

Skew lines are a unique phenomenon of 3D (and higher) space. In our physical world, high-voltage power lines crossing at different altitudes over a highway are skew lines.

---

### Section 8.4 Distance from an Arbitrary Point to a 3D Line

Let a line $L$ be given by $\mathbf{r}(t) = \mathbf{P}_0 + t\mathbf{d}$, and let $Q \in \mathbb{R}^3$ be an arbitrary query point not necessarily on $L$.

```
                 Q
                /|
               / |
              /  |  d_perp = ||(Q - P0) x d|| / ||d||
             /   |
            /    |
          P0-----+----------> d
               proj
```

Consider the displacement vector from $\mathbf{P}_0$ to $Q$:
$$\mathbf{v} = Q - \mathbf{P}_0$$
Together with direction vector $\mathbf{d}$, $\mathbf{v}$ spans a parallelogram in space whose base has length $\|\mathbf{d}\|$.
The area of this parallelogram is given by the cross product magnitude:
$$\text{Area} = \|\mathbf{v} \times \mathbf{d}\| = \|(Q - \mathbf{P}_0) \times \mathbf{d}\|$$

On the other hand, the area of any parallelogram is base $\times$ perpendicular height:
$$\text{Area} = \|\mathbf{d}\| \times d_{\perp}$$

Equating the two expressions and solving for the perpendicular distance $d_{\perp}$:
$$d(Q, L) = \frac{\|(Q - \mathbf{P}_0) \times \mathbf{d}\|}{\|\mathbf{d}\|}$$

If $\hat{\mathbf{d}}$ is already normalized ($\|\hat{\mathbf{d}}\| = 1$), the denominator is 1, simplifying directly to:
$$d(Q, L) = \|(Q - \mathbf{P}_0) \times \hat{\mathbf{d}}\|$$

---

### Section 8.5 Shortest Distance Between Two Skew Lines

Let two skew lines be defined by:
$$L_1: \mathbf{r}_1(s) = \mathbf{P}_1 + s \mathbf{d}_1$$
$$L_2: \mathbf{r}_2(t) = \mathbf{P}_2 + t \mathbf{d}_2$$

Since the lines are non-parallel, their direction cross product $\mathbf{n} = \mathbf{d}_1 \times \mathbf{d}_2$ is a non-zero vector. By construction, $\mathbf{n}$ is perpendicular to *both* lines!

```
         L1 --------- P1 ------------------> d1
                       \
                        \  (P2 - P1)
                         \
         L2 ..............P2 ............... d2
                           \
                            v  n = d1 x d2
```

We can envision two parallel planes $\Pi_1$ and $\Pi_2$:
- $\Pi_1$ contains line $L_1$ and has normal $\mathbf{n}$.
- $\Pi_2$ contains line $L_2$ and has normal $\mathbf{n}$.

The shortest distance between the two lines is precisely the perpendicular distance between these two parallel planes!
Any vector connecting a point on $L_1$ to a point on $L_2$ is $\mathbf{w} = \mathbf{P}_2 - \mathbf{P}_1$.
The shortest distance is the absolute scalar projection of $\mathbf{w}$ onto the mutual unit normal $\hat{\mathbf{n}}$:
$$d_{\text{skew}} = |\mathbf{w} \cdot \hat{\mathbf{n}}| = \left| (\mathbf{P}_2 - \mathbf{P}_1) \cdot \frac{\mathbf{d}_1 \times \mathbf{d}_2}{\|\mathbf{d}_1 \times \mathbf{d}_2\|} \right|$$

$$d_{\text{skew}} = \frac{|(\mathbf{P}_2 - \mathbf{P}_1) \cdot (\mathbf{d}_1 \times \mathbf{d}_2)|}{\|\mathbf{d}_1 \times \mathbf{d}_2\|} = \frac{|[\mathbf{P}_2 - \mathbf{P}_1, \mathbf{d}_1, \mathbf{d}_2]|}{\|\mathbf{d}_1 \times \mathbf{d}_2\|}$$

Notice the extraordinary geometric elegance: the numerator is the volume of the parallelepiped spanned by the displacement and both directions, and the denominator is the area of the base!

---

### Section 8.6 Closest Points of Approach (CPA) on Two Rays

Knowing the minimum distance $d_{\text{skew}}$ is often not enough: in physics engines and robotics, we need the exact coordinates of the two points $C_1 \in L_1$ and $C_2 \in L_2$ where this closest approach occurs.

Let the points be parameterized by unknown scalars $s^*$ and $t^*$:
$$C_1 = \mathbf{P}_1 + s^* \mathbf{d}_1$$
$$C_2 = \mathbf{P}_2 + t^* \mathbf{d}_2$$

The vector connecting them is $\mathbf{v}(s^*, t^*) = C_1 - C_2 = (\mathbf{P}_1 - \mathbf{P}_2) + s^* \mathbf{d}_1 - t^* \mathbf{d}_2$.

At the points of closest approach, the segment $C_1 C_2$ must be simultaneously perpendicular to both direction vectors $\mathbf{d}_1$ and $\mathbf{d}_2$:
$$\begin{cases} \mathbf{v}(s^*, t^*) \cdot \mathbf{d}_1 = 0 \\ \mathbf{v}(s^*, t^*) \cdot \mathbf{d}_2 = 0 \end{cases}$$

Let us define the scalar constants:
- $\mathbf{w}_0 = \mathbf{P}_1 - \mathbf{P}_2$
- $a = \mathbf{d}_1 \cdot \mathbf{d}_1 = \|\mathbf{d}_1\|^2$
- $b = \mathbf{d}_1 \cdot \mathbf{d}_2$
- $c = \mathbf{d}_2 \cdot \mathbf{d}_2 = \|\mathbf{d}_2\|^2$
- $d = \mathbf{d}_1 \cdot \mathbf{w}_0$
- $e = \mathbf{d}_2 \cdot \mathbf{w}_0$

Expanding the two orthogonality conditions:
1. $(\mathbf{w}_0 + s^* \mathbf{d}_1 - t^* \mathbf{d}_2) \cdot \mathbf{d}_1 = 0 \implies d + s^* a - t^* b = 0 \implies a s^* - b t^* = -d$
2. $(\mathbf{w}_0 + s^* \mathbf{d}_1 - t^* \mathbf{d}_2) \cdot \mathbf{d}_2 = 0 \implies e + s^* b - t^* c = 0 \implies b s^* - c t^* = -e$

In matrix form:
$$\begin{bmatrix} a & -b \\ b & -c \end{bmatrix} \begin{bmatrix} s^* \\ t^* \end{bmatrix} = \begin{bmatrix} -d \\ -e \end{bmatrix}$$

The determinant of this $2 \times 2$ system is:
$$\Delta = -ac - (-b^2) = b^2 - ac = (\mathbf{d}_1 \cdot \mathbf{d}_2)^2 - \|\mathbf{d}_1\|^2 \|\mathbf{d}_2\|^2 = -\|\mathbf{d}_1 \times \mathbf{d}_2\|^2$$

Since the lines are non-parallel, $\|\mathbf{d}_1 \times \mathbf{d}_2\| \ne 0$, so $\Delta < 0$, guaranteeing a unique solution!
Applying Cramer's rule:
$$s^* = \frac{b e - c d}{a c - b^2}$$
$$t^* = \frac{a e - b d}{a c - b^2}$$

#### Clamping for Finite Line Segments (Capsule-Capsule Collisions):
If testing finite line segments $s \in [0, 1]$ and $t \in [0, 1]$, if $s^*$ or $t^*$ falls outside $[0, 1]$, the unconstrained closest points lie outside the segment endpoints. One must clamp the out-of-bounds parameter to the boundary $[0, 1]$ and re-project onto the other segment. This algorithm is the basis of **capsule-capsule collision detection** in Unreal Engine, Unity, and PhysX.

---

### Section 8.7 Continuous Collision Detection (CCD)

In high-speed bullet or projectile simulations, discrete frame-by-frame collision detection suffers from **tunneling**: a fast bullet can completely pass through a thin wall between frame $k$ and frame $k+1$ without ever overlapping it.

```
       Frame k                  Frame k+1
       Bullet â—                 (Inside Wall)            Bullet â—
          |                                                 |
          v                                                 v
       ====================== WALL ==========================
```

Continuous Collision Detection (CCD) solves tunneling by modeling the moving projectile as a swept ray or swept sphere:
$$\mathbf{r}(t) = \mathbf{P}(t_0) + t \mathbf{v} \Delta t, \quad t \in [0, 1]$$
The problem of collision reduces to intersecting this dynamic 3D ray segment with static scene geometry (planes, triangles, or other swept rays).

---

### Section 8.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 8.1: Finding Vector and Parametric Equations
**Problem:** Find the vector and parametric equations of the 3D line passing through points $A(2, -1, 4)$ and $B(5, 3, -2)$.

**Solution:**
1. Direction vector:
   $$\mathbf{d} = B - A = \begin{bmatrix} 5 - 2 \\ 3 - (-1) \\ -2 - 4 \end{bmatrix} = \begin{bmatrix} 3 \\ 4 \\ -6 \end{bmatrix}$$
2. Vector equation taking $A$ as base point:
   $$\mathbf{r}(t) = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix} + t \begin{bmatrix} 3 \\ 4 \\ -6 \end{bmatrix}, \quad t \in \mathbb{R}$$
3. Parametric equations:
   $$x(t) = 2 + 3t$$
   $$y(t) = -1 + 4t$$
   $$z(t) = 4 - 6t$$

---

#### Example 8.2: Symmetric Form and Point Membership
**Problem:** A line has symmetric form $\frac{x - 1}{2} = \frac{y + 3}{-1} = \frac{z - 5}{4}$.
1. Find a reference point $\mathbf{P}_0$ and direction vector $\mathbf{d}$.
2. Determine whether the point $Q(7, -6, 17)$ lies on this line.

**Solution:**
1. Reference point $\mathbf{P}_0 = (1, -3, 5)$ and direction vector $\mathbf{d} = \begin{bmatrix} 2 \\ -1 \\ 4 \end{bmatrix}$.
2. Substitute coordinates of $Q$ into the symmetric ratios:
   $$t_x = \frac{7 - 1}{2} = \frac{6}{2} = 3$$
   $$t_y = \frac{-6 - (-3)}{-1} = \frac{-3}{-1} = 3$$
   $$t_z = \frac{17 - 5}{4} = \frac{12}{4} = 3$$
Since $t_x = t_y = t_z = 3$, all three ratios are identical.
**Conclusion:** The point $Q$ lies on the line (at parameter $t = 3$).

---

#### Example 8.3: Distance from a Point to a 3D Line
**Problem:** Find the perpendicular distance from point $Q(1, 1, 5)$ to the line $\mathbf{r}(t) = \begin{bmatrix} 0 \\ 1 \\ 2 \end{bmatrix} + t \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$.

**Solution:**
1. Extract $\mathbf{P}_0 = (0, 1, 2)$ and $\mathbf{d} = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$.
2. Vector from $\mathbf{P}_0$ to $Q$:
   $$\mathbf{v} = Q - \mathbf{P}_0 = \begin{bmatrix} 1 - 0 \\ 1 - 1 \\ 5 - 2 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \\ 3 \end{bmatrix}$$
3. Compute cross product $\mathbf{v} \times \mathbf{d}$:
   $$\mathbf{v} \times \mathbf{d} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 0 & 3 \\ 1 & 2 & 2 \end{vmatrix} = \mathbf{i}(0 - 6) - \mathbf{j}(2 - 3) + \mathbf{k}(2 - 0) = \begin{bmatrix} -6 \\ 1 \\ 2 \end{bmatrix}$$
4. Compute magnitudes:
   $$\|\mathbf{v} \times \mathbf{d}\| = \sqrt{(-6)^2 + 1^2 + 2^2} = \sqrt{36 + 1 + 4} = \sqrt{41} \approx 6.403124$$
   $$\|\mathbf{d}\| = \sqrt{1^2 + 2^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
5. Distance:
   $$d = \frac{\sqrt{41}}{3} \approx 2.13437 \text{ units}$$

---

#### Example 8.4: Classifying Line Relationships in 3D
**Problem:** Classify the relationship between the two lines:
$$L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix} + s \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}$$
$$L_2: \mathbf{r}_2(t) = \begin{bmatrix} 2 \\ 0 \\ 2 \end{bmatrix} + t \begin{bmatrix} -2 \\ 2 \\ -4 \end{bmatrix}$$

**Solution:**
1. Check direction vectors:
   $$\mathbf{d}_1 = \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}, \quad \mathbf{d}_2 = \begin{bmatrix} -2 \\ 2 \\ -4 \end{bmatrix}$$
   Notice that $\mathbf{d}_2 = -2 \mathbf{d}_1$. Their cross product is zero; the lines are parallel or coincident.
2. Check if $\mathbf{P}_1(1, 1, 0)$ lies on $L_2$:
   $$\begin{cases} 1 = 2 - 2t \implies 2t = 1 \implies t = 1/2 \\ 1 = 0 + 2t \implies t = 1/2 \\ 0 = 2 - 4t \implies 4t = 2 \implies t = 1/2 \end{cases}$$
Since $t = 1/2$ satisfies all three equations, the reference point $\mathbf{P}_1$ lies on $L_2$.
**Conclusion:** The lines are **COINCIDENT** (they are the exact same line).

---

#### Example 8.5: Intersection of Two Non-Parallel Coplanar Lines
**Problem:** Find the point of intersection between:
$$L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 2 \\ 0 \end{bmatrix} + s \begin{bmatrix} 2 \\ -1 \\ 1 \end{bmatrix}$$
$$L_2: \mathbf{r}_2(t) = \begin{bmatrix} 3 \\ 0 \\ 5 \end{bmatrix} + t \begin{bmatrix} 1 \\ 1 \\ -2 \end{bmatrix}$$

**Solution:**
Equate coordinates component-wise:
1. $1 + 2s = 3 + t \implies 2s - t = 2$ (Eq. 1)
2. $2 - s = 0 + t \implies s + t = 2$ (Eq. 2)
3. $0 + s = 5 - 2t \implies s + 2t = 5$ (Eq. 3)

Add Eq. 1 and Eq. 2:
$$(2s - t) + (s + t) = 2 + 2 \implies 3s = 4 \implies s = 4/3$$
From Eq. 2:
$$t = 2 - s = 2 - 4/3 = 2/3$$

Now check if $(s = 4/3, t = 2/3)$ satisfies Eq. 3:
$$s + 2t = \frac{4}{3} + 2\left(\frac{2}{3}\right) = \frac{4}{3} + \frac{4}{3} = \frac{8}{3} \ne 5$$
Because $8/3 \ne 5$, the system is inconsistent! The lines do not intersect.
Since their directions $\mathbf{d}_1 \ne c \mathbf{d}_2$, the lines are **SKEW**.

---

#### Example 8.6: Shortest Distance Between Two Skew Lines
**Problem:** Find the shortest distance between the skew lines:
$$L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + s \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
$$L_2: \mathbf{r}_2(t) = \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix} + t \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$

**Solution:**
1. Base points and directions:
   $$\mathbf{P}_1 = (1, 0, 0), \quad \mathbf{d}_1 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} = \mathbf{j}$$
   $$\mathbf{P}_2 = (0, 0, 2), \quad \mathbf{d}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \mathbf{i}$$
2. Vector connecting reference points:
   $$\mathbf{P}_2 - \mathbf{P}_1 = \begin{bmatrix} 0 - 1 \\ 0 - 0 \\ 2 - 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 0 \\ 2 \end{bmatrix}$$
3. Mutual perpendicular normal:
   $$\mathbf{n} = \mathbf{d}_1 \times \mathbf{d}_2 = \mathbf{j} \times \mathbf{i} = -\mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$$
   $$\|\mathbf{n}\| = 1$$
4. Scalar triple product:
   $$(\mathbf{P}_2 - \mathbf{P}_1) \cdot \mathbf{n} = (-1)(0) + (0)(0) + (2)(-1) = -2$$
5. Shortest distance:
   $$d_{\text{skew}} = \frac{|-2|}{1} = 2 \text{ units}$$
*Geometric intuition:* $L_1$ is a line parallel to the $y$-axis in the ground plane $z = 0$. $L_2$ is a line parallel to the $x$-axis in the plane $z = 2$. The perpendicular distance between the two planes is obviously $2 - 0 = 2 \quad \checkmark$.

---

#### Example 8.7: Analytical CPA Calculation on Two Skew Rays
**Problem:** Two drones fly along linear trajectories in space:
- Drone 1: $\mathbf{r}_1(s) = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} + s \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}$
- Drone 2: $\mathbf{r}_2(t) = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix} + t \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix}$
Find the closest points of approach $C_1$ and $C_2$ on each trajectory and the minimum separation distance.

**Solution:**
1. Extract values:
   $$\mathbf{P}_1 = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{d}_1 = \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix}$$
   $$\mathbf{P}_2 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix}, \quad \mathbf{d}_2 = \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix}$$
   $$\mathbf{w}_0 = \mathbf{P}_1 - \mathbf{P}_2 = \begin{bmatrix} 0 \\ -3 \\ -4 \end{bmatrix}$$
2. Compute dot products:
   $$a = \mathbf{d}_1 \cdot \mathbf{d}_1 = 1^2 + 2^2 + 1^2 = 6$$
   $$b = \mathbf{d}_1 \cdot \mathbf{d}_2 = (1)(2) + (2)(0) + (1)(-1) = 2 - 1 = 1$$
   $$c = \mathbf{d}_2 \cdot \mathbf{d}_2 = 2^2 + 0^2 + (-1)^2 = 5$$
   $$d = \mathbf{d}_1 \cdot \mathbf{w}_0 = (1)(0) + (2)(-3) + (1)(-4) = -6 - 4 = -10$$
   $$e = \mathbf{d}_2 \cdot \mathbf{w}_0 = (2)(0) + (0)(-3) + (-1)(-4) = 4$$
3. Denominator:
   $$D = ac - b^2 = (6)(5) - 1^2 = 30 - 1 = 29$$
4. Compute $s^*$ and $t^*$:
   $$s^* = \frac{be - cd}{D} = \frac{(1)(4) - (5)(-10)}{29} = \frac{4 + 50}{29} = \frac{54}{29} \approx 1.86207$$
   $$t^* = \frac{ae - bd}{D} = \frac{(6)(4) - (1)(-10)}{29} = \frac{24 + 10}{29} = \frac{34}{29} \approx 1.17241$$
5. Compute closest points:
   $$C_1 = \mathbf{P}_1 + s^* \mathbf{d}_1 = \frac{54}{29} \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} = \begin{bmatrix} 54/29 \\ 108/29 \\ 54/29 \end{bmatrix}$$
   $$C_2 = \mathbf{P}_2 + t^* \mathbf{d}_2 = \begin{bmatrix} 0 \\ 3 \\ 4 \end{bmatrix} + \frac{34}{29} \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} 68/29 \\ 87/29 \\ 82/29 \end{bmatrix}$$
6. Connecting vector $C_1 - C_2$:
   $$C_1 - C_2 = \begin{bmatrix} (54 - 68)/29 \\ (108 - 87)/29 \\ (54 - 82)/29 \end{bmatrix} = \frac{1}{29} \begin{bmatrix} -14 \\ 21 \\ -28 \end{bmatrix} = \frac{7}{29} \begin{bmatrix} -2 \\ 3 \\ -4 \end{bmatrix}$$
7. Check orthogonality to $\mathbf{d}_1$ and $\mathbf{d}_2$:
   $$\begin{bmatrix} -2 \\ 3 \\ -4 \end{bmatrix} \cdot \begin{bmatrix} 1 \\ 2 \\ 1 \end{bmatrix} = -2 + 6 - 4 = 0 \quad \checkmark$$
   $$\begin{bmatrix} -2 \\ 3 \\ -4 \end{bmatrix} \cdot \begin{bmatrix} 2 \\ 0 \\ -1 \end{bmatrix} = -4 + 0 + 4 = 0 \quad \checkmark$$
8. Minimum distance:
   $$d_{\min} = \frac{7}{29} \sqrt{(-2)^2 + 3^2 + (-4)^2} = \frac{7}{29} \sqrt{4 + 9 + 16} = \frac{7\sqrt{29}}{29} = \frac{7}{\sqrt{29}} \approx 1.29986 \text{ m}$$

---

#### Example 8.8: Ray-Sphere Intersection Formulation
**Problem:** A ray has origin $\mathbf{P}_0 = (0, 0, -10)$ and normalized direction $\hat{\mathbf{d}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$. A solid sphere has center $\mathbf{C} = (0, 0, 0)$ and radius $R = 3$. Find the entry and exit hit points on the sphere.

**Solution:**
A point on the ray is $\mathbf{P}(t) = \mathbf{P}_0 + t\hat{\mathbf{d}}$ for $t \ge 0$.
The equation of the sphere is $\|\mathbf{P} - \mathbf{C}\|^2 = R^2$.
Let $\mathbf{m} = \mathbf{P}_0 - \mathbf{C} = \begin{bmatrix} 0 \\ 0 \\ -10 \end{bmatrix}$.
Substitute the ray equation:
$$\|\mathbf{m} + t\hat{\mathbf{d}}\|^2 = R^2 \implies (\mathbf{m} + t\hat{\mathbf{d}}) \cdot (\mathbf{m} + t\hat{\mathbf{d}}) = R^2$$
$$(\hat{\mathbf{d}} \cdot \hat{\mathbf{d}}) t^2 + 2(\mathbf{m} \cdot \hat{\mathbf{d}}) t + (\mathbf{m} \cdot \mathbf{m} - R^2) = 0$$
Since $\|\hat{\mathbf{d}}\| = 1$:
$$t^2 + 2 b t + c = 0$$
where:
$$b = \mathbf{m} \cdot \hat{\mathbf{d}} = (0)(0) + (0)(0) + (-10)(1) = -10$$
$$c = \mathbf{m} \cdot \mathbf{m} - R^2 = (-10)^2 - 3^2 = 100 - 9 = 91$$
Discriminant:
$$\Delta = b^2 - c = (-10)^2 - 91 = 100 - 91 = 9$$
Since $\Delta = 9 > 0$, the ray pierces the sphere in two distinct points:
$$t = -b \pm \sqrt{\Delta} = -(-10) \pm \sqrt{9} = 10 \pm 3$$
- Entry hit: $t_1 = 10 - 3 = 7 \implies \mathbf{P}(7) = (0, 0, -3)$
- Exit hit: $t_2 = 10 + 3 = 13 \implies \mathbf{P}(13) = (0, 0, 3)$

---

#### Example 8.9: Capsule Geometry Representation
**Problem:** In physics engines, a capsule collider is defined by a central line segment between points $A(0, 0, 1)$ and $B(0, 0, 5)$, with radius $r = 0.5$. Determine whether a test point $P(0.4, 0.3, 3.0)$ is inside the capsule.

**Solution:**
1. Capsule segment direction:
   $$\mathbf{d} = B - A = \begin{bmatrix} 0 \\ 0 \\ 4 \end{bmatrix}$$
2. Vector from $A$ to $P$:
   $$\mathbf{v} = P - A = \begin{bmatrix} 0.4 - 0 \\ 0.3 - 0 \\ 3.0 - 1 \end{bmatrix} = \begin{bmatrix} 0.4 \\ 0.3 \\ 2.0 \end{bmatrix}$$
3. Project $P$ onto the infinite line containing $AB$:
   $$t = \frac{\mathbf{v} \cdot \mathbf{d}}{\mathbf{d} \cdot \mathbf{d}} = \frac{(0.4)(0) + (0.3)(0) + (2.0)(4)}{0^2 + 0^2 + 4^2} = \frac{8}{16} = 0.5$$
4. Clamp $t$ to segment range $[0, 1]$:
   $$t_{\text{clamped}} = \max(0, \min(1, 0.5)) = 0.5$$
5. Closest point on central core segment:
   $$C = A + 0.5 \mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} + \begin{bmatrix} 0 \\ 0 \\ 2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$$
6. Distance from $P$ to core segment:
   $$\text{dist} = \|P - C\| = \sqrt{(0.4 - 0)^2 + (0.3 - 0)^2 + (3.0 - 3.0)^2} = \sqrt{0.16 + 0.09 + 0} = \sqrt{0.25} = 0.5$$
Since $\text{dist} = 0.5 \le r = 0.5$, the point lies exactly on the boundary of the capsule.

---

#### Example 8.10: Angle Between Two 3D Lines
**Problem:** Find the acute angle between the two lines:
$$L_1: \frac{x-1}{2} = \frac{y+2}{1} = \frac{z-3}{-2}$$
$$L_2: \frac{x+5}{1} = \frac{y-1}{2} = \frac{z}{2}$$

**Solution:**
1. Extract direction vectors:
   $$\mathbf{d}_1 = \begin{bmatrix} 2 \\ 1 \\ -2 \end{bmatrix}, \quad \mathbf{d}_2 = \begin{bmatrix} 1 \\ 2 \\ 2 \end{bmatrix}$$
2. Compute dot product:
   $$\mathbf{d}_1 \cdot \mathbf{d}_2 = (2)(1) + (1)(2) + (-2)(2) = 2 + 2 - 4 = 0$$
3. Angle:
   $$\cos\theta = \frac{0}{\|\mathbf{d}_1\|\|\mathbf{d}_2\|} = 0 \implies \theta = 90^\circ$$
The two lines are mutually perpendicular.

---

### Section 8.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 8.1
**Problem:** Write down the parametric equations for the line through point $(1, -2, 3)$ with direction $\begin{bmatrix} 4 \\ 0 \\ -5 \end{bmatrix}$.
**Solution:**
$$\begin{cases} x(t) = 1 + 4t \\ y(t) = -2 \\ z(t) = 3 - 5t \end{cases}$$

---

#### Exercise 8.2
**Problem:** Convert the parametric line $x = 3 - 2t, y = 4 + 5t, z = 1 + t$ into symmetric form.
**Solution:**
Solve for $t$:
$$\frac{x - 3}{-2} = \frac{y - 4}{5} = \frac{z - 1}{1}$$

---

#### Exercise 8.3
**Problem:** Find the distance from origin $O(0, 0, 0)$ to the line $\mathbf{r}(t) = \begin{bmatrix} 3 \\ 4 \\ 0 \end{bmatrix} + t \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$.
**Solution:**
$\mathbf{P}_0 = (3, 4, 0)$, $\mathbf{d} = (0, 0, 1)$ (unit vector).
$\mathbf{v} = O - \mathbf{P}_0 = \begin{bmatrix} -3 \\ -4 \\ 0 \end{bmatrix}$.
$$\mathbf{v} \times \mathbf{d} = \begin{bmatrix} -3 \\ -4 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} -4 \\ 3 \\ 0 \end{bmatrix}$$
$$\text{dist} = \|\mathbf{v} \times \mathbf{d}\| = \sqrt{(-4)^2 + 3^2 + 0^2} = \sqrt{16 + 9} = 5 \text{ units}$$

---

#### Exercise 8.4
**Problem:** Are the lines $L_1: \mathbf{r}_1(s) = \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} + s \begin{bmatrix} 2 \\ 1 \\ 3 \end{bmatrix}$ and $L_2: \mathbf{r}_2(t) = \begin{bmatrix} 0 \\ 2 \\ 2 \end{bmatrix} + t \begin{bmatrix} 4 \\ 2 \\ 6 \end{bmatrix}$ parallel or coincident?
**Solution:**
$\mathbf{d}_2 = 2\mathbf{d}_1$, so they are parallel.
Check if $\mathbf{P}_1(1, 0, 1)$ lies on $L_2$:
$$\begin{cases} 1 = 0 + 4t \implies t = 1/4 \\ 0 = 2 + 2t \implies t = -1 \end{cases}$$
Since $1/4 \ne -1$, $\mathbf{P}_1$ does not lie on $L_2$.
Therefore, the lines are **distinct parallel lines**.

---

#### Exercise 8.5
**Problem:** Find the distance between the parallel lines from Exercise 8.4.
**Solution:**
Distance from $\mathbf{P}_1(1, 0, 1)$ to $L_2$:
$\mathbf{P}_2 = (0, 2, 2)$, $\mathbf{d} = \begin{bmatrix} 2 \\ 1 \\ 3 \end{bmatrix}$.
$$\mathbf{w} = \mathbf{P}_1 - \mathbf{P}_2 = \begin{bmatrix} 1 \\ -2 \\ -1 \end{bmatrix}$$
$$\mathbf{w} \times \mathbf{d} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & -2 & -1 \\ 2 & 1 & 3 \end{vmatrix} = \mathbf{i}(-6 + 1) - \mathbf{j}(3 + 2) + \mathbf{k}(1 + 4) = \begin{bmatrix} -5 \\ -5 \\ 5 \end{bmatrix}$$
$$\|\mathbf{w} \times \mathbf{d}\| = \sqrt{25 + 25 + 25} = 5\sqrt{3}$$
$$\|\mathbf{d}\| = \sqrt{4 + 1 + 9} = \sqrt{14}$$
$$d = \frac{5\sqrt{3}}{\sqrt{14}} = \frac{5\sqrt{42}}{14} \approx 2.31455 \text{ units}$$

---

#### Exercise 8.6
**Problem:** State the condition for two lines $\mathbf{r}_1(s) = \mathbf{P}_1 + s\mathbf{d}_1$ and $\mathbf{r}_2(t) = \mathbf{P}_2 + t\mathbf{d}_2$ to be coplanar.
**Solution:**
Two lines are coplanar if and only if their scalar triple product with displacement vector $\mathbf{P}_2 - \mathbf{P}_1$ vanishes:
$$[(\mathbf{P}_2 - \mathbf{P}_1), \mathbf{d}_1, \mathbf{d}_2] = 0$$

---

#### Exercise 8.7
**Problem:** Find the point on the line segment between $A(0, 0, 0)$ and $B(10, 0, 0)$ that is closest to point $P(15, 5, 0)$.
**Solution:**
Segment parameterized by $t \in [0, 1]$: $\mathbf{r}(t) = \begin{bmatrix} 10t \\ 0 \\ 0 \end{bmatrix}$.
Unconstrained projection of $P(15, 5, 0)$ onto the $x$-axis gives $x = 15 \implies 10t = 15 \implies t = 1.5$.
Since $1.5 > 1.0$, clamp to boundary $t = 1.0$.
The closest point on the segment is $B(10, 0, 0)$.

---

#### Exercise 8.8
**Problem:** In ray tracing, what does a negative ray parameter $t < 0$ represent?
**Solution:**
A parameter $t < 0$ represents an intersection point that lies **behind the ray origin**, along the negative ray direction. In rendering pipelines, intersections with $t \le 0$ must be rejected (ignored) because the camera or light cannot see backwards.

---

#### Exercise 8.9
**Problem:** Prove that the shortest distance vector connecting two skew lines is orthogonal to both line direction vectors.
**Solution:**
Let $f(s, t) = \|\mathbf{r}_1(s) - \mathbf{r}_2(t)\|^2$. At the local minimum $(s^*, t^*)$, the partial derivatives must vanish:
$$\frac{\partial f}{\partial s} = 2(\mathbf{r}_1(s^*) - \mathbf{r}_2(t^*)) \cdot \frac{d\mathbf{r}_1}{ds} = 2(C_1 - C_2) \cdot \mathbf{d}_1 = 0 \implies (C_1 - C_2) \perp \mathbf{d}_1$$
$$\frac{\partial f}{\partial t} = -2(\mathbf{r}_1(s^*) - \mathbf{r}_2(t^*)) \cdot \frac{d\mathbf{r}_2}{dt} = -2(C_1 - C_2) \cdot \mathbf{d}_2 = 0 \implies (C_1 - C_2) \perp \mathbf{d}_2$$
Thus the connecting vector $C_1 - C_2$ is strictly orthogonal to both $\mathbf{d}_1$ and $\mathbf{d}_2 \quad \blacksquare$.

---

#### Exercise 8.10
**Problem:** Two rays have direction vectors $\mathbf{d}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ and $\mathbf{d}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$. If $\mathbf{P}_1 = (0, 0, 0)$ and $\mathbf{P}_2 = (3, 4, 5)$, find the closest points of approach $C_1$ and $C_2$.
**Solution:**
Here $\mathbf{d}_1 = \mathbf{i}$ and $\mathbf{d}_2 = \mathbf{j}$.
$L_1$ is the $x$-axis: $\mathbf{r}_1(s) = (s, 0, 0)$.
$L_2$ is the line through $(3, 4, 5)$ parallel to the $y$-axis: $\mathbf{r}_2(t) = (3, 4+t, 5)$.
The displacement is $(s - 3, -(4+t), -5)$.
For orthogonality:
$$(s - 3) = 0 \implies s^* = 3 \implies C_1 = (3, 0, 0)$$
$$-(4 + t) = 0 \implies t^* = -4 \implies C_2 = (3, 0, 5)$$
Separation vector: $C_2 - C_1 = (0, 0, 5)$.
Distance: $5 \text{ units}$.

# Chapter 9: The Geometry of 3D Planes

> *"A plane is a surface in which, any two points being taken, the straight line between them lies wholly in that surface. It is the infinite canvas upon which all spatial orientation is cast."*  
> â€” **Euclid of Alexandria**, *Elements*, Book I, Definition 7 (c. 300 BC)

---

### Section 9.1 Point-Normal Form of a Plane in $\mathbb{R}^3$

In three-dimensional space, the most elegant and computationally fundamental way to specify a flat 2D plane $\Pi$ is via a reference point and an orientation vector.

Let $\mathbf{P}_0 = (x_0, y_0, z_0)$ be a known point resting on the plane.  
Let $\mathbf{n} = \begin{bmatrix} A \\ B \\ C \end{bmatrix}$ be a non-zero **normal vector** that is strictly perpendicular to the plane.

```
                     n
                     ^
                     |
                     |       r
                     |      /
                     |     /
                     |    /
       ==============+===+================= Plane Pi
                     P0
```

Now consider an arbitrary query point $\mathbf{r} = (x, y, z)$ in $\mathbb{R}^3$.
The displacement vector from $\mathbf{P}_0$ to $\mathbf{r}$ is:
$$\mathbf{r} - \mathbf{P}_0 = \begin{bmatrix} x - x_0 \\ y - y_0 \\ z - z_0 \end{bmatrix}$$

The point $\mathbf{r}$ lies in the plane $\Pi$ if and only if the displacement vector $\mathbf{r} - \mathbf{P}_0$ lies entirely in the plane, which means it must be strictly perpendicular to the surface normal $\mathbf{n}$!

Recalling the orthogonality condition from Chapter 4, two vectors are perpendicular if and only if their dot product vanishes. Therefore, the **point-normal equation of a plane** is:
$$\mathbf{n} \cdot (\mathbf{r} - \mathbf{P}_0) = 0$$

Expanding this dot product into Cartesian coordinates:
$$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$$

Notice the remarkable simplicity: every point $(x, y, z)$ on this infinite 2D surface satisfies this single linear constraint.

---

### Section 9.2 General Cartesian Form of a Plane

Distributing the normal components in the point-normal equation:
$$A x + B y + C z - (A x_0 + B y_0 + C z_0) = 0$$

Let us define the constant scalar:
$$D \equiv -(A x_0 + B y_0 + C z_0) = -\mathbf{n} \cdot \mathbf{P}_0$$

This yields the canonical **General Cartesian Equation of a Plane**:
$$A x + B y + C z + D = 0$$

#### The Geometric Meaning of $D$:
What does the constant $D$ represent physically?
If we divide the entire equation by the magnitude of the normal $\|\mathbf{n}\| = \sqrt{A^2 + B^2 + C^2}$, the coefficients become the components of the normalized unit normal $\hat{\mathbf{n}}$:
$$\hat{\mathbf{n}} \cdot \mathbf{r} + d = 0 \iff \hat{\mathbf{n}} \cdot \mathbf{r} = -d$$
where $d = \frac{D}{\|\mathbf{n}\|}$.
- The quantity $|d| = \frac{|D|}{\|\mathbf{n}\|}$ is **the exact perpendicular distance from the origin $(0, 0, 0)$ to the plane**!
- If $D = 0$, the plane passes directly through the coordinate origin.
- The sign of $D$ reveals which side of the plane the origin lies on relative to the direction of $\mathbf{n}$.

---

### Section 9.3 Plane Defined by Three Non-Collinear Points

In computer graphics, 3D meshes are composed of polygonal triangles. Each triangle is defined by three vertices in space: $\mathbf{P}_1, \mathbf{P}_2, \mathbf{P}_3$.

```
                 P3
                /  \
               /    \
              /      \
             P1 ------> P2
```

How do we construct the plane equation containing these three points?
1. Form two edge vectors sharing base vertex $\mathbf{P}_1$:
   $$\mathbf{v}_1 = \mathbf{P}_2 - \mathbf{P}_1$$
   $$\mathbf{v}_2 = \mathbf{P}_3 - \mathbf{P}_1$$
2. Compute the surface normal using the cross product:
   $$\mathbf{n} = \mathbf{v}_1 \times \mathbf{v}_2 = (\mathbf{P}_2 - \mathbf{P}_1) \times (\mathbf{P}_3 - \mathbf{P}_1)$$
   If $\|\mathbf{n}\| = 0$, the three points are collinear and do not define a unique plane.
3. Compute the offset scalar $D$:
   $$D = -\mathbf{n} \cdot \mathbf{P}_1$$
4. The plane equation is:
   $$n_x x + n_y y + n_z z + D = 0$$

#### Determinant Formulation:
Equivalently, a point $\mathbf{r} = (x, y, z)$ lies in the plane of $\mathbf{P}_1, \mathbf{P}_2, \mathbf{P}_3$ if and only if the three vectors originating from $\mathbf{P}_1$ are coplanar:
$$\begin{vmatrix} x - x_1 & y - y_1 & z - z_1 \\ x_2 - x_1 & y_2 - y_1 & z_2 - z_1 \\ x_3 - x_1 & y_3 - y_1 & z_3 - z_1 \end{vmatrix} = 0$$

---

### Section 9.4 Signed Distance and Half-Space Partitioning

Let a plane $\Pi$ be given by $A x + B y + C z + D = 0$, with normal $\mathbf{n} = \begin{bmatrix} A & B & C \end{bmatrix}^T$.
Let $Q = (x_q, y_q, z_q)$ be an arbitrary query point in $\mathbb{R}^3$.

```
                    Q (Positive Half-Space: d > 0)
                   /|
                  / |  d_signed
                 /  |
       =========+===+========= Plane Pi (d = 0)
                P0
                 \
                  \  (Negative Half-Space: d < 0)
```

The **signed perpendicular distance** from point $Q$ to the plane is given by:
$$d_{\text{signed}}(Q, \Pi) = \frac{A x_q + B y_q + C z_q + D}{\sqrt{A^2 + B^2 + C^2}} = \frac{\mathbf{n} \cdot Q + D}{\|\mathbf{n}\|}$$

If the plane equation is normalized such that $\|\mathbf{n}\| = 1$, the formula reduces to a single dot product and an addition:
$$d_{\text{signed}}(Q, \Pi) = \hat{\mathbf{n}} \cdot Q + D$$

#### Half-Space Partitioning (Binary Space Partitioning - BSP):
The sign of $d_{\text{signed}}$ partitions all of 3D space into three disjoint subsets:
1. **Positive Half-Space ($d_{\text{signed}} > 0$):** $Q$ lies on the side of the plane toward which normal $\mathbf{n}$ points.
2. **On the Plane ($d_{\text{signed}} = 0$):** $Q$ lies exactly on the planar surface.
3. **Negative Half-Space ($d_{\text{signed}} < 0$):** $Q$ lies on the opposite side of the plane.

This operation is the fundamental primitive of **Binary Space Partitioning (BSP) trees**, camera frustum culling, and physics collision detection.

---

### Section 9.5 Dihedral Angle Between Two Planes

The angle between two intersecting planes $\Pi_1$ and $\Pi_2$ is called their **dihedral angle** $\phi$.

```
            Plane 1                Plane 2
                 \                  /
            n1    \                /    n2
              ^    \              /    ^
               \    \            /    /
                \    \   phi    /    /
                 +----\--------/----+
```

Because the orientation of each plane is uniquely defined by its normal vector, the dihedral angle between the planes is simply the spatial angle between their respective normal vectors $\mathbf{n}_1$ and $\mathbf{n}_2$:
$$\cos\phi = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{\|\mathbf{n}_1\| \|\mathbf{n}_2\|}$$

The absolute value $|\mathbf{n}_1 \cdot \mathbf{n}_2|$ is taken when measuring the acute angle between the two planes ($\phi \in [0, \frac{\pi}{2}]$ or $[0^\circ, 90^\circ]$).
- If $\mathbf{n}_1 \cdot \mathbf{n}_2 = 0$: The planes are **perpendicular** ($\phi = 90^\circ$).
- If $\mathbf{n}_1 \times \mathbf{n}_2 = \mathbf{0}$: The normals are parallel; the planes are **parallel** ($\phi = 0^\circ$).

---

### Section 9.6 Line of Intersection Between Two Non-Parallel Planes

If two planes $\Pi_1: \mathbf{n}_1 \cdot \mathbf{r} + D_1 = 0$ and $\Pi_2: \mathbf{n}_2 \cdot \mathbf{r} + D_2 = 0$ are not parallel ($\mathbf{n}_1 \times \mathbf{n}_2 \ne \mathbf{0}$), they intersect along an infinite straight line $L$.

```
                 Plane 1
                    \
                     \     Line L: r(t) = P_line + t * d
                      \   /
                       \ /
       =================X================= Plane 2
                       / \
                      /   \
```

To determine the parametric equation $\mathbf{r}(t) = \mathbf{P}_{\text{line}} + t \mathbf{d}$ of this line:

1. **Direction Vector $\mathbf{d}$:**
   The line of intersection lies simultaneously in both planes. Therefore, it must be perpendicular to both plane normals $\mathbf{n}_1$ and $\mathbf{n}_2$:
   $$\mathbf{d} = \mathbf{n}_1 \times \mathbf{n}_2$$

2. **Finding a Reference Point $\mathbf{P}_{\text{line}}$:**
   Any point on the line satisfies the two plane equations:
   $$\begin{cases} A_1 x + B_1 y + C_1 z = -D_1 \\ A_2 x + B_2 y + C_2 z = -D_2 \end{cases}$$
   Since we have two equations and three unknowns, we can set one coordinate to zero (e.g., $z = 0$, provided $d_z = (\mathbf{n}_1 \times \mathbf{n}_2)_z \ne 0$) and solve the remaining $2 \times 2$ system via Cramer's rule:
   $$\begin{bmatrix} A_1 & B_1 \\ A_2 & B_2 \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} -D_1 \\ -D_2 \end{bmatrix}$$
   $$x = \frac{-D_1 B_2 - (-D_2 B_1)}{A_1 B_2 - A_2 B_1}, \quad y = \frac{A_1(-D_2) - A_2(-D_1)}{A_1 B_2 - A_2 B_1}$$

#### Direct Vector Form for the Closest Point to Origin:
Alternatively, the point on the intersection line closest to the coordinate origin is given directly by:
$$\mathbf{P}_{\text{closest}} = \frac{(-D_1 \mathbf{n}_2 + D_2 \mathbf{n}_1) \times (\mathbf{n}_1 \times \mathbf{n}_2)}{\|\mathbf{n}_1 \times \mathbf{n}_2\|^2}$$

---

### Section 9.7 Intersection of Three Planes: Unique Point Solution

Three non-parallel planes $\Pi_1, \Pi_2, \Pi_3$:
$$\begin{cases} \mathbf{n}_1 \cdot \mathbf{r} = -D_1 \\ \mathbf{n}_2 \cdot \mathbf{r} = -D_2 \\ \mathbf{n}_3 \cdot \mathbf{r} = -D_3 \end{cases}$$
intersect at a **single, unique point $\mathbf{P}^*$** if and only if their normal vectors are linearly independent, which means their scalar triple product is non-zero:
$$\Delta = [\mathbf{n}_1, \mathbf{n}_2, \mathbf{n}_3] = \mathbf{n}_1 \cdot (\mathbf{n}_2 \times \mathbf{n}_3) \ne 0$$

Using the reciprocal basis properties established in Chapter 7, the exact analytical solution for the intersection point is:
$$\mathbf{P}^* = \frac{-D_1(\mathbf{n}_2 \times \mathbf{n}_3) - D_2(\mathbf{n}_3 \times \mathbf{n}_1) - D_3(\mathbf{n}_1 \times \mathbf{n}_2)}{[\mathbf{n}_1, \mathbf{n}_2, \mathbf{n}_3]}$$

This closed-form vector formula is extensively utilized in graphics engines for computing the eight corner vertices of a perspective camera view frustum from its six bounding clipping planes!

---

### Section 9.8 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 9.1: Plane Equation from Point and Normal
**Problem:** Find the Cartesian equation of the plane passing through point $P_0(3, -2, 5)$ with normal vector $\mathbf{n} = \begin{bmatrix} 2 \\ 4 \\ -1 \end{bmatrix}$.

**Solution:**
Apply the point-normal formula:
$$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$$
Substitute $A = 2, B = 4, C = -1$ and $(x_0, y_0, z_0) = (3, -2, 5)$:
$$2(x - 3) + 4(y - (-2)) - 1(z - 5) = 0$$
$$2x - 6 + 4y + 8 - z + 5 = 0$$
$$2x + 4y - z + 7 = 0$$
*Verification:*
Substitute $P_0(3, -2, 5)$:
$$2(3) + 4(-2) - 5 + 7 = 6 - 8 - 5 + 7 = 0 \quad \checkmark$$

---

#### Example 9.2: Plane Defined by Three Points
**Problem:** Find the equation of the plane passing through $A(1, 1, 0)$, $B(2, 0, -1)$, and $C(0, 2, 3)$.

**Solution:**
1. Compute displacement vectors from $A$:
   $$\mathbf{u} = B - A = \begin{bmatrix} 2 - 1 \\ 0 - 1 \\ -1 - 0 \end{bmatrix} = \begin{bmatrix} 1 \\ -1 \\ -1 \end{bmatrix}$$
   $$\mathbf{v} = C - A = \begin{bmatrix} 0 - 1 \\ 2 - 1 \\ 3 - 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 1 \\ 3 \end{bmatrix}$$
2. Compute surface normal:
   $$\mathbf{n} = \mathbf{u} \times \mathbf{v} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & -1 & -1 \\ -1 & 1 & 3 \end{vmatrix}$$
   $$= \mathbf{i}((-1)(3) - (-1)(1)) - \mathbf{j}((1)(3) - (-1)(-1)) + \mathbf{k}((1)(1) - (-1)(-1))$$
   $$= \mathbf{i}(-3 + 1) - \mathbf{j}(3 - 1) + \mathbf{k}(1 - 1)$$
   $$= -2\mathbf{i} - 2\mathbf{j} + 0\mathbf{k} = \begin{bmatrix} -2 \\ -2 \\ 0 \end{bmatrix}$$
   We can scale by $-1/2$ to simplify: $\mathbf{n}' = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$.
3. Find constant $D$:
   $$D = -\mathbf{n}' \cdot A = -(1(1) + 1(1) + 0(0)) = -2$$
4. Plane equation:
   $$x + y - 2 = 0 \iff x + y = 2$$
*Check with points:*
- $A(1, 1, 0): 1 + 1 = 2 \quad \checkmark$
- $B(2, 0, -1): 2 + 0 = 2 \quad \checkmark$
- $C(0, 2, 3): 0 + 2 = 2 \quad \checkmark$

---

#### Example 9.3: Signed Distance and Point Classification
**Problem:** Given the plane $\Pi: 2x - y + 2z - 6 = 0$:
1. Calculate the signed distance from $Q_1(4, 3, 2)$ to the plane.
2. Calculate the signed distance from $Q_2(1, 2, -1)$ to the plane.
3. Classify their half-space locations.

**Solution:**
Normal vector $\mathbf{n} = \begin{bmatrix} 2 \\ -1 \\ 2 \end{bmatrix}$.
Magnitude:
$$\|\mathbf{n}\| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{4 + 1 + 4} = \sqrt{9} = 3$$
1. For $Q_1(4, 3, 2)$:
   $$d_{\text{signed}}(Q_1) = \frac{2(4) - 1(3) + 2(2) - 6}{3} = \frac{8 - 3 + 4 - 6}{3} = \frac{3}{3} = +1.0 \text{ units}$$
   $Q_1$ is in the **positive half-space** (1 unit in the direction of $\mathbf{n}$).
2. For $Q_2(1, 2, -1)$:
   $$d_{\text{signed}}(Q_2) = \frac{2(1) - 1(2) + 2(-1) - 6}{3} = \frac{2 - 2 - 2 - 6}{3} = \frac{-8}{3} \approx -2.667 \text{ units}$$
   $Q_2$ is in the **negative half-space** ($2.667$ units opposite to $\mathbf{n}$).

---

#### Example 9.4: Distance Between Two Parallel Planes
**Problem:** Find the perpendicular distance between the parallel planes:
$$\Pi_1: 2x - 2y + z + 4 = 0$$
$$\Pi_2: 4x - 4y + 2z - 10 = 0$$

**Solution:**
1. Normalize $\Pi_2$ so its coefficients match $\Pi_1$:
   Divide $\Pi_2$ by 2:
   $$2x - 2y + z - 5 = 0$$
2. Both planes now share the normal $\mathbf{n} = \begin{bmatrix} 2 \\ -2 \\ 1 \end{bmatrix}$, with $D_1 = 4$ and $D_2 = -5$.
3. Compute normal length:
   $$\|\mathbf{n}\| = \sqrt{2^2 + (-2)^2 + 1^2} = \sqrt{4 + 4 + 1} = \sqrt{9} = 3$$
4. Perpendicular distance formula for parallel planes:
   $$d = \frac{|D_1 - D_2|}{\|\mathbf{n}\|} = \frac{|4 - (-5)|}{3} = \frac{9}{3} = 3.0 \text{ units}$$

---

#### Example 9.5: Dihedral Angle Between Two Planes
**Problem:** Find the acute angle between the planes $\Pi_1: x + y + z - 1 = 0$ and $\Pi_2: x - 2y + 2z + 3 = 0$.

**Solution:**
1. Extract normal vectors:
   $$\mathbf{n}_1 = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}, \quad \mathbf{n}_2 = \begin{bmatrix} 1 \\ -2 \\ 2 \end{bmatrix}$$
2. Compute dot product:
   $$\mathbf{n}_1 \cdot \mathbf{n}_2 = (1)(1) + (1)(-2) + (1)(2) = 1 - 2 + 2 = 1$$
3. Compute magnitudes:
   $$\|\mathbf{n}_1\| = \sqrt{1^2 + 1^2 + 1^2} = \sqrt{3}$$
   $$\|\mathbf{n}_2\| = \sqrt{1^2 + (-2)^2 + 2^2} = \sqrt{1 + 4 + 4} = \sqrt{9} = 3$$
4. Compute cosine:
   $$\cos\phi = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{\|\mathbf{n}_1\|\|\mathbf{n}_2\|} = \frac{1}{3\sqrt{3}} = \frac{\sqrt{3}}{9} \approx 0.19245$$
5. Angle:
   $$\phi = \arccos\left(\frac{1}{3\sqrt{3}}\right) \approx 1.37714 \text{ rad} \approx 78.904^\circ \approx 78.90^\circ$$

---

#### Example 9.6: Line of Intersection of Two Planes
**Problem:** Find the parametric equation of the line formed by the intersection of:
$$\Pi_1: x + 2y - z = 2$$
$$\Pi_2: 2x - y + z = 1$$

**Solution:**
1. Direction vector $\mathbf{d} = \mathbf{n}_1 \times \mathbf{n}_2$:
   $$\mathbf{n}_1 = \begin{bmatrix} 1 \\ 2 \\ -1 \end{bmatrix}, \quad \mathbf{n}_2 = \begin{bmatrix} 2 \\ -1 \\ 1 \end{bmatrix}$$
   $$\mathbf{d} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 2 & -1 \\ 2 & -1 & 1 \end{vmatrix} = \mathbf{i}(2 - 1) - \mathbf{j}(1 - (-2)) + \mathbf{k}(-1 - 4) = \begin{bmatrix} 1 \\ -3 \\ -5 \end{bmatrix}$$
2. Find a particular point on the line by setting $z = 0$:
   $$\begin{cases} x + 2y = 2 \\ 2x - y = 1 \end{cases}$$
   Multiply the second equation by 2:
   $$4x - 2y = 2$$
   Add to the first equation:
   $$5x = 4 \implies x = 4/5$$
   From $2x - y = 1 \implies y = 2(4/5) - 1 = 8/5 - 5/5 = 3/5$.
   So reference point is $\mathbf{P}_0 = (4/5, 3/5, 0)$.
3. Parametric equations:
   $$\mathbf{r}(t) = \begin{bmatrix} 4/5 \\ 3/5 \\ 0 \end{bmatrix} + t \begin{bmatrix} 1 \\ -3 \\ -5 \end{bmatrix}$$

---

#### Example 9.7: Intersection Point of Three Planes
**Problem:** Find the point of intersection of the three planes:
$$\begin{cases} x + y + z = 6 \\ 2x - y + z = 3 \\ x + 2y - z = 2 \end{cases}$$

**Solution:**
1. Write as matrix system $\mathbf{M} \mathbf{r} = \mathbf{b}$:
   $$\begin{bmatrix} 1 & 1 & 1 \\ 2 & -1 & 1 \\ 1 & 2 & -1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \end{bmatrix} = \begin{bmatrix} 6 \\ 3 \\ 2 \end{bmatrix}$$
2. Compute $\det(\mathbf{M})$:
   $$\det(\mathbf{M}) = 1((-1)(-1) - (1)(2)) - 1((2)(-1) - (1)(1)) + 1((2)(2) - (-1)(1))$$
   $$= 1(1 - 2) - 1(-2 - 1) + 1(4 + 1) = -1 + 3 + 5 = 7 \ne 0$$
   A unique intersection point exists.
3. Solve using Cramer's rule:
   $$\det(\mathbf{M}_x) = \begin{vmatrix} 6 & 1 & 1 \\ 3 & -1 & 1 \\ 2 & 2 & -1 \end{vmatrix} = 6(1 - 2) - 1(-3 - 2) + 1(6 - (-2)) = -6 + 5 + 8 = 7$$
   $$x = \frac{\det(\mathbf{M}_x)}{\det(\mathbf{M})} = \frac{7}{7} = 1$$
   $$\det(\mathbf{M}_y) = \begin{vmatrix} 1 & 6 & 1 \\ 2 & 3 & 1 \\ 1 & 2 & -1 \end{vmatrix} = 1(-3 - 2) - 6(-2 - 1) + 1(4 - 3) = -5 + 18 + 1 = 14$$
   $$y = \frac{\det(\mathbf{M}_y)}{\det(\mathbf{M})} = \frac{14}{7} = 2$$
   $$\det(\mathbf{M}_z) = \begin{vmatrix} 1 & 1 & 6 \\ 2 & -1 & 3 \\ 1 & 2 & 2 \end{vmatrix} = 1(-2 - 6) - 1(4 - 3) + 6(4 - (-1)) = -8 - 1 + 30 = 21$$
   $$z = \frac{\det(\mathbf{M}_z)}{\det(\mathbf{M})} = \frac{21}{7} = 3$$
The three planes meet at the unique point $(1, 2, 3)$.

---

#### Example 9.8: Camera View Frustum Plane Extraction
**Problem:** In 3D graphics, a camera clipping plane has unit normal $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0.6 \\ 0.8 \end{bmatrix}$ and offset $D = -4.0$. A bounding sphere has center $\mathbf{C} = (0, 10, 5)$ and radius $r = 2.0$. Determine whether the sphere is completely inside, intersecting, or completely outside this half-space.

**Solution:**
1. Compute the signed distance from sphere center to the clipping plane:
   $$d_{\text{signed}} = \hat{\mathbf{n}} \cdot \mathbf{C} + D = (0)(0) + (0.6)(10) + (0.8)(5) - 4.0 = 0 + 6.0 + 4.0 - 4.0 = 6.0$$
2. Compare with radius $r = 2.0$:
   - If $d_{\text{signed}} > +r$: Completely inside ($6.0 > 2.0 \implies$ completely inside).
   - If $|d_{\text{signed}}| \le r$: Intersecting the boundary.
   - If $d_{\text{signed}} < -r$: Completely outside (culled).
**Conclusion:** Since $d_{\text{signed}} = +6.0 > 2.0$, the bounding sphere is **COMPLETELY INSIDE** the view frustum half-space.

---

#### Example 9.9: Orthogonal Projection of a Point onto a Plane
**Problem:** Find the point $P_{\text{proj}}$ on the plane $x - 2y + 2z = 9$ closest to the point $Q(4, 1, 1)$.

**Solution:**
1. Express plane in standard form:
   $$x - 2y + 2z - 9 = 0$$
   Normal $\mathbf{n} = \begin{bmatrix} 1 \\ -2 \\ 2 \end{bmatrix}$, with $\|\mathbf{n}\| = \sqrt{1 + 4 + 4} = 3$.
2. Compute signed distance from $Q$ to the plane:
   $$d = \frac{1(4) - 2(1) + 2(1) - 9}{3} = \frac{4 - 2 + 2 - 9}{3} = \frac{-5}{3}$$
3. Project $Q$ onto the plane by subtracting $d \hat{\mathbf{n}}$:
   $$\hat{\mathbf{n}} = \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix}$$
   $$P_{\text{proj}} = Q - d \hat{\mathbf{n}} = \begin{bmatrix} 4 \\ 1 \\ 1 \end{bmatrix} - \left(-\frac{5}{3}\right) \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} 4 + 5/9 \\ 1 - 10/9 \\ 1 + 10/9 \end{bmatrix} = \begin{bmatrix} 41/9 \\ -1/9 \\ 19/9 \end{bmatrix}$$
*Check membership in plane:*
$$\frac{41}{9} - 2\left(-\frac{1}{9}\right) + 2\left(\frac{19}{9}\right) = \frac{41 + 2 + 38}{9} = \frac{81}{9} = 9 \quad \checkmark$$

---

#### Example 9.10: Reflection of a Point Across a Plane
**Problem:** Find the mirror reflection point $Q'$ of $Q(4, 1, 1)$ across the plane $x - 2y + 2z = 9$.

**Solution:**
From Example 9.9, the signed distance is $d = -5/3$.
To reflect across the plane, we travel twice the distance along the normal:
$$Q' = Q - 2 d \hat{\mathbf{n}} = \begin{bmatrix} 4 \\ 1 \\ 1 \end{bmatrix} - 2\left(-\frac{5}{3}\right) \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} 4 \\ 1 \\ 1 \end{bmatrix} + \frac{10}{3} \begin{bmatrix} 1/3 \\ -2/3 \\ 2/3 \end{bmatrix} = \begin{bmatrix} 4 + 10/9 \\ 1 - 20/9 \\ 1 + 20/9 \end{bmatrix} = \begin{bmatrix} 46/9 \\ -11/9 \\ 29/9 \end{bmatrix}$$
*Verification:*
The midpoint of $Q$ and $Q'$ must be $P_{\text{proj}}$:
$$\frac{Q + Q'}{2} = \frac{1}{2}\left( \begin{bmatrix} 36/9 \\ 9/9 \\ 9/9 \end{bmatrix} + \begin{bmatrix} 46/9 \\ -11/9 \\ 29/9 \end{bmatrix} \right) = \frac{1}{2} \begin{bmatrix} 82/9 \\ -2/9 \\ 38/9 \end{bmatrix} = \begin{bmatrix} 41/9 \\ -1/9 \\ 19/9 \end{bmatrix} = P_{\text{proj}} \quad \checkmark$$

---

### Section 9.9 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 9.1
**Problem:** Find the equation of the plane through $(0, 0, 0)$ with normal $\mathbf{n} = \begin{bmatrix} 5 \\ -2 \\ 1 \end{bmatrix}$.
**Solution:**
$$5(x - 0) - 2(y - 0) + 1(z - 0) = 0 \implies 5x - 2y + z = 0$$

---

#### Exercise 9.2
**Problem:** Find the unit normal of the plane $3x - 4z + 12 = 0$.
**Solution:**
$\mathbf{n} = \begin{bmatrix} 3 \\ 0 \\ -4 \end{bmatrix}$.
$$\|\mathbf{n}\| = \sqrt{3^2 + 0^2 + (-4)^2} = \sqrt{9 + 16} = 5$$
$$\hat{\mathbf{n}} = \begin{bmatrix} 3/5 \\ 0 \\ -4/5 \end{bmatrix}$$

---

#### Exercise 9.3
**Problem:** Determine whether the planes $2x - 3y + 6z = 4$ and $4x - 6y + 12z = 1$ are parallel, perpendicular, or neither.
**Solution:**
$\mathbf{n}_1 = \begin{bmatrix} 2 \\ -3 \\ 6 \end{bmatrix}$, $\mathbf{n}_2 = \begin{bmatrix} 4 \\ -6 \\ 12 \end{bmatrix}$.
Notice $\mathbf{n}_2 = 2 \mathbf{n}_1$.
Since their normal vectors are proportional, the planes are **parallel**.

---

#### Exercise 9.4
**Problem:** Calculate the distance from point $(2, 3, 4)$ to the plane $x + 2y - 2z + 5 = 0$.
**Solution:**
$$d = \frac{|1(2) + 2(3) - 2(4) + 5|}{\sqrt{1^2 + 2^2 + (-2)^2}} = \frac{|2 + 6 - 8 + 5|}{\sqrt{1 + 4 + 4}} = \frac{|5|}{3} = \frac{5}{3} \approx 1.667 \text{ units}$$

---

#### Exercise 9.5
**Problem:** Find the angle between the planes $x = 0$ and $x + y = 0$.
**Solution:**
$\mathbf{n}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$, $\mathbf{n}_2 = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$.
$$\cos\phi = \frac{|\mathbf{n}_1 \cdot \mathbf{n}_2|}{\|\mathbf{n}_1\|\|\mathbf{n}_2\|} = \frac{|(1)(1) + 0 + 0|}{1 \times \sqrt{2}} = \frac{1}{\sqrt{2}} \implies \phi = 45^\circ$$

---

#### Exercise 9.6
**Problem:** Find the $x$, $y$, and $z$ intercepts of the plane $2x + 3y + 4z = 12$.
**Solution:**
- $x$-intercept (set $y=0, z=0$): $2x = 12 \implies x = 6 \implies (6, 0, 0)$
- $y$-intercept (set $x=0, z=0$): $3y = 12 \implies y = 4 \implies (0, 4, 0)$
- $z$-intercept (set $x=0, y=0$): $4z = 12 \implies z = 3 \implies (0, 0, 3)$

---

#### Exercise 9.7
**Problem:** Write down the equation of the plane containing points $(a, 0, 0)$, $(0, b, 0)$, and $(0, 0, c)$ (the intercept form).
**Solution:**
$$\frac{x}{a} + \frac{y}{b} + \frac{z}{c} = 1$$

---

#### Exercise 9.8
**Problem:** Under what condition is a line with direction $\mathbf{d}$ parallel to a plane with normal $\mathbf{n}$?
**Solution:**
A line is parallel to a plane if and only if its direction vector is perpendicular to the plane's normal vector:
$$\mathbf{d} \cdot \mathbf{n} = 0$$

---

#### Exercise 9.9
**Problem:** Find the distance from the origin $(0, 0, 0)$ to the plane $3x - 2y + 6z - 21 = 0$.
**Solution:**
$$d = \frac{|-21|}{\sqrt{3^2 + (-2)^2 + 6^2}} = \frac{21}{\sqrt{9 + 4 + 36}} = \frac{21}{\sqrt{49}} = \frac{21}{7} = 3 \text{ units}$$

---

#### Exercise 9.10
**Problem:** Find the intersection point of the line $\mathbf{r}(t) = \begin{bmatrix} 1 \\ 0 \\ 2 \end{bmatrix} + t \begin{bmatrix} 2 \\ 1 \\ -1 \end{bmatrix}$ with the plane $x + 2y + 3z = 17$.
**Solution:**
Substitute parametric line equations $x = 1+2t, y = t, z = 2-t$ into the plane equation:
$$(1 + 2t) + 2(t) + 3(2 - t) = 17$$
$$1 + 2t + 2t + 6 - 3t = 17$$
$$t + 7 = 17 \implies t = 10$$
Substitute $t = 10$ into the line equation:
$$\mathbf{r}(10) = \begin{bmatrix} 1 + 2(10) \\ 10 \\ 2 - 10 \end{bmatrix} = \begin{bmatrix} 21 \\ 10 \\ -8 \end{bmatrix}$$
*Check membership in plane:*
$$21 + 2(10) + 3(-8) = 21 + 20 - 24 = 17 \quad \checkmark$$

# Chapter 10: Polygonal Meshes, Triangulation, and Surface Normals

> *"In the digital realm, continuous smooth forms are an illusion: every sculpture, character, and world is composed of flat triangular facets. The art of realism lies in how the normals across these facets deceive the eye."*  
> â€” **Henri Gouraud**, *Continuous Shading of Curved Surfaces* (1971)

---

### Section 10.1 Indexed Face Sets and Triangle Meshes

In modern computer graphics and 3D simulation engines, virtually every physical objectâ€”from a simple cube to an intricate aircraft chassis or biomechanical skeletonâ€”is represented as a **polygonal surface mesh**.

While arbitrary $n$-gons (quads, pentagons) can exist in authoring software like Blender or Maya, real-time rendering pipelines (GPUs) and physics collision systems exclusively process **triangles**. Triangles have three irreplaceable geometric properties:
1. **Planar Invariance:** Any three non-collinear points in $\mathbb{R}^3$ are guaranteed to lie on a single, flat plane. A quadrilateral with four vertices in 3D can bend or twist (be non-planar), which creates ambiguous shading and collision artifacts; a triangle can never be non-planar.
2. **Simplex Geometry:** A triangle is the 2D simplex, possessing the minimal number of vertices required to enclose a non-zero surface area.
3. **Barycentric Interpolation:** Properties defined at the three vertices (colors, normals, texture coordinates) can be uniquely and linearly interpolated across the entire face interior.

#### The Data Structure: Vertex and Index Buffers
To store a 3D mesh in memory efficiently, engines use an **Indexed Face Set (IFS)** consisting of two separate contiguous arrays:

```
 Vertex Buffer (Unique Positions)        Index Buffer (Triangles)
  Index 0: (-1, -1,  0)                   Triangle 0: [0, 1, 2]
  Index 1: ( 1, -1,  0)                   Triangle 1: [0, 2, 3]
  Index 2: ( 1,  1,  0)                   (Shares vertices 0 and 2!)
  Index 3: (-1,  1,  0)
```

1. **Vertex Buffer:** A flat array of unique 3D positions $\mathbf{v}_i \in \mathbb{R}^3$, plus auxiliary vertex attributes (normals, UV texture coordinates, tangents).
2. **Index Buffer:** An array of integer triples $(i_0, i_1, i_2)$, where each integer references a vertex in the vertex buffer.

This separation prevents massive memory duplication: in a closed triangular mesh, each vertex is shared by an average of 6 adjacent triangles. Storing each vertex once and referencing it with lightweight 16-bit or 32-bit integer indices reduces memory bandwidth by over $60\%$.

---

### Section 10.2 Winding Order Conventions and Normal Inversion

When three vertices $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2$ define a triangle, the order in which they are traversed is called their **winding order**.

```
    Counter-Clockwise (CCW)                  Clockwise (CW)
             v0                                    v0
            /  ^                                  ^  \
           /    \                                /    \
          /      \                              /      \
         v2 <---- v1                          v1 -----> v2
       Normal points OUT                     Normal points IN
```

Because the vector cross product is anti-commutative ($\mathbf{a} \times \mathbf{b} = -(\mathbf{b} \times \mathbf{a})$), reversing the traversal order completely inverts the direction of the computed surface normal:
$$\mathbf{n}_{\text{CCW}} = (\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{v}_2 - \mathbf{v}_0)$$
$$\mathbf{n}_{\text{CW}} = (\mathbf{v}_2 - \mathbf{v}_0) \times (\mathbf{v}_1 - \mathbf{v}_0) = -\mathbf{n}_{\text{CCW}}$$

#### Industry Standards:
- **OpenGL, WebGL, Vulkan, and Three.js:** Standard default is **Counter-Clockwise (CCW)** for front-facing triangles. When viewed from outside the solid object, the vertices circulate counter-clockwise, and the cross product points outward toward the viewer.
- **DirectX:** Historically defaulted to **Clockwise (CW)**.

If winding orders are mixed within a single mesh, lighting engines will shade adjacent faces incorrectly, backface culling will discard visible exterior walls, and physics engines will push penetrating colliders inward rather than outward!

---

### Section 10.3 Geometric Face Normal Computation

For a triangle with counter-clockwise vertices $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2 \in \mathbb{R}^3$:
1. Form two directional edge vectors:
   $$\mathbf{e}_1 = \mathbf{v}_1 - \mathbf{v}_0$$
   $$\mathbf{e}_2 = \mathbf{v}_2 - \mathbf{v}_0$$
2. Compute the unnormalized cross product:
   $$\mathbf{N} = \mathbf{e}_1 \times \mathbf{e}_2 = \begin{bmatrix} e_{1y} e_{2z} - e_{1z} e_{2y} \\ e_{1z} e_{2x} - e_{1x} e_{2z} \\ e_{1x} e_{2y} - e_{1y} e_{2x} \end{bmatrix}$$
3. Compute the magnitude:
   $$\|\mathbf{N}\| = \sqrt{N_x^2 + N_y^2 + N_z^2}$$
   Recall from Chapter 6 that $\|\mathbf{N}\| = 2 \times \text{Area}_{\triangle}$.
4. Normalize to obtain the unit face normal $\hat{\mathbf{n}}$:
   $$\hat{\mathbf{n}} = \frac{\mathbf{N}}{\|\mathbf{N}\|}$$

---

### Section 10.4 The Problem of Degenerate Triangles and Slivers

In procedural geometry generation, CAD tessellation, and physics destruction systems, triangles can become **degenerate**:
- **Collinear Vertices:** All three vertices lie along a single 1D straight line ($\mathbf{e}_1 \parallel \mathbf{e}_2$).
- **Coincident Vertices:** Two or more vertices share the exact same coordinates ($\mathbf{v}_0 = \mathbf{v}_1$ or $\mathbf{v}_1 = \mathbf{v}_2$).
- **Slivers (Needle Triangles):** The triangle has non-zero edge lengths, but one interior angle is nearly $0^\circ$ and another is nearly $180^\circ$, producing an area close to floating-point precision ($< 10^{-14}$).

```
      Normal Triangle                      Sliver / Needle Triangle
            v2                               v0 ----------------- v1
           /  \                                       v2
          /    \                              (Near-zero area, unstable normal)
         v0 --- v1
```

#### The Fatal Zero-Division Trap:
When a triangle is degenerate:
$$\mathbf{N} = \mathbf{e}_1 \times \mathbf{e}_2 \approx \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} \implies \|\mathbf{N}\| \approx 0$$
Attempting to normalize $\hat{\mathbf{n}} = \frac{\mathbf{N}}{\|\mathbf{N}\|}$ produces a fatal division by zero, generating `NaN` or `Infinity` components that crash the graphics shader or physics solver.

#### Robust Production Safeguard:
Every production mesh processor must test against an area or length threshold:
```typescript
function computeFaceNormal(v0: Vector3, v1: Vector3, v2: Vector3): Vector3 {
  const e1 = v1.clone().sub(v0);
  const e2 = v2.clone().sub(v0);
  const n = e1.cross(e2);
  const lenSq = n.lengthSq();
  
  const EPSILON_SQ = 1e-12;
  if (lenSq < EPSILON_SQ) {
    // Degenerate triangle! Return default safe upward normal
    return new Vector3(0, 1, 0);
  }
  
  return n.multiplyScalar(1.0 / Math.sqrt(lenSq));
}
```

---

### Section 10.5 Vertex Normal Smoothing: Unweighted vs Angle-Weighted Averaging

When rendering faceted surfaces (like a low-poly gemstone), using the flat **face normal** $\hat{\mathbf{n}}_f$ for every pixel on a triangle creates sharp, visible boundaries between adjacent polygons (Flat Shading).

To create the visual illusion of a curved, smooth surface (such as a sphere, cylinder, or human face), we compute **vertex normals** $\hat{\mathbf{n}}_v$ at each shared vertex, and the GPU smoothly interpolates these normals across each pixel (Phong / Gouraud Shading).

```
        Flat Shading (Face Normals)         Smooth Shading (Vertex Normals)
             n_f1       n_f2                     n_v1      n_v2      n_v3
               ^         ^                         ^         ^         ^
               |         |                          \        |        /
          +----+----+----+----+                 +----+----+----+----+
          | Face 1  | Face 2  |                 | Face 1  | Face 2  |
          (Sharp visible seam)                  (Smooth continuous lighting)
```

How should the face normals of all triangles meeting at vertex $V$ be averaged?

#### 1. Unweighted Averaging (Naive):
$$\mathbf{N}_v = \sum_{k=1}^m \hat{\mathbf{n}}_{f_k}, \quad \hat{\mathbf{n}}_v = \frac{\mathbf{N}_v}{\|\mathbf{N}_v\|}$$
*Defect:* If a mesh is tessellated with many tiny triangles on one side and a single large triangle on the other, the tiny triangles unfairly dominate the average, biasing the normal away from the dominant geometric orientation.

#### 2. Area-Weighted Averaging:
Recall that the unnormalized cross product $\mathbf{N}_{f_k} = \mathbf{e}_{1k} \times \mathbf{e}_{2k}$ has length equal to twice the triangle area: $\|\mathbf{N}_{f_k}\| = 2 A_k$.
By summing the unnormalized cross products directly:
$$\mathbf{N}_v = \sum_{k=1}^m (\mathbf{e}_{1k} \times \mathbf{e}_{2k})$$
larger triangles automatically receive greater weight proportional to their surface area!

#### 3. Angle-Weighted Averaging (Gold Standard):
Let $\alpha_k$ be the interior angle of triangle $k$ at vertex $V$:
$$\mathbf{N}_v = \sum_{k=1}^m \alpha_k \hat{\mathbf{n}}_{f_k}$$
This scheme is mathematically invariant under arbitrary edge subdivision and tessellation changes. It produces the highest quality smooth shading across complex organic meshes.

---

### Section 10.6 Tangent, Bitangent, and Normal (TBN) Frames for Normal Mapping

In modern PBR (Physically Based Rendering) game engines, surface micro-details (pores, cracks, metal bumps) are encoded in a 2D RGB texture called a **normal map**.

To apply the normal map to a 3D polygon, the shader must convert coordinates between **Texture Tangent Space** and **World/Camera Space**. This requires constructing a local orthonormal basis at every vertex: the **TBN Frame**:
- $\hat{\mathbf{T}}$: Tangent vector (pointing in the direction of increasing horizontal texture coordinate $U$).
- $\hat{\mathbf{B}}$: Bitangent vector (pointing in the direction of increasing vertical texture coordinate $V$).
- $\hat{\mathbf{N}}$: Surface normal vector.

```
                   N (Surface Normal)
                   ^
                   |
                   |      B (Bitangent / +V texture)
                   |     /
                   |    /
                   |   /
                   +--------------> T (Tangent / +U texture)
```

#### Derivation of Tangent and Bitangent from UV Coordinates:
Let a triangle have vertices $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2$ and texture coordinates $(u_0, v_0), (u_1, v_1), (u_2, v_2)$.
The spatial edges are $\mathbf{e}_1 = \mathbf{v}_1 - \mathbf{v}_0$ and $\mathbf{e}_2 = \mathbf{v}_2 - \mathbf{v}_0$.
The texture coordinate differences are:
$$\Delta u_1 = u_1 - u_0, \quad \Delta v_1 = v_1 - v_0$$
$$\Delta u_2 = u_2 - u_0, \quad \Delta v_2 = v_2 - v_0$$

The spatial edges can be expressed in terms of the unknown tangent $\mathbf{T}$ and bitangent $\mathbf{B}$:
$$\mathbf{e}_1 = \Delta u_1 \mathbf{T} + \Delta v_1 \mathbf{B}$$
$$\mathbf{e}_2 = \Delta u_2 \mathbf{T} + \Delta v_2 \mathbf{B}$$

In matrix form:
$$\begin{bmatrix} \mathbf{e}_1^T \\ \mathbf{e}_2^T \end{bmatrix} = \begin{bmatrix} \Delta u_1 & \Delta v_1 \\ \Delta u_2 & \Delta v_2 \end{bmatrix} \begin{bmatrix} \mathbf{T}^T \\ \mathbf{B}^T \end{bmatrix}$$

Inverting the $2 \times 2$ matrix:
$$\begin{bmatrix} \mathbf{T}^T \\ \mathbf{B}^T \end{bmatrix} = \frac{1}{\Delta u_1 \Delta v_2 - \Delta u_2 \Delta v_1} \begin{bmatrix} \Delta v_2 & -\Delta v_1 \\ -\Delta u_2 & \Delta u_1 \end{bmatrix} \begin{bmatrix} \mathbf{e}_1^T \\ \mathbf{e}_2^T \end{bmatrix}$$

Thus:
$$\mathbf{T} = \frac{1}{\Delta u_1 \Delta v_2 - \Delta u_2 \Delta v_1} (\Delta v_2 \mathbf{e}_1 - \Delta v_1 \mathbf{e}_2)$$
$$\mathbf{B} = \frac{1}{\Delta u_1 \Delta v_2 - \Delta u_2 \Delta v_1} (-\Delta u_2 \mathbf{e}_1 + \Delta u_1 \mathbf{e}_2)$$

Once computed, $\mathbf{T}$ is made strictly orthogonal to $\hat{\mathbf{N}}$ via Gram-Schmidt:
$$\hat{\mathbf{T}}_{\text{ortho}} = \frac{\mathbf{T} - (\mathbf{T} \cdot \hat{\mathbf{N}})\hat{\mathbf{N}}}{\|\mathbf{T} - (\mathbf{T} \cdot \hat{\mathbf{N}})\hat{\mathbf{N}}\|}$$
And $\hat{\mathbf{B}}$ is obtained via cross product:
$$\hat{\mathbf{B}} = \hat{\mathbf{N}} \times \hat{\mathbf{T}}_{\text{ortho}}$$

---

### Section 10.7 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 10.1: Face Normal and Area from Vertex Coordinates
**Problem:** A triangle in a 3D mesh has vertices $V_0(0, 0, 0)$, $V_1(2, 0, 0)$, and $V_2(0, 3, 0)$ in counter-clockwise order.
1. Find the unit face normal $\hat{\mathbf{n}}_f$.
2. Compute the exact triangle area.

**Solution:**
1. Compute edge vectors:
   $$\mathbf{e}_1 = V_1 - V_0 = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = V_2 - V_0 = \begin{bmatrix} 0 \\ 3 \\ 0 \end{bmatrix}$$
2. Cross product:
   $$\mathbf{N} = \mathbf{e}_1 \times \mathbf{e}_2 = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 0 & 0 \\ 0 & 3 & 0 \end{vmatrix} = 6 \mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ 6 \end{bmatrix}$$
3. Magnitude:
   $$\|\mathbf{N}\| = 6$$
4. Unit normal:
   $$\hat{\mathbf{n}}_f = \frac{1}{6} \begin{bmatrix} 0 \\ 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
5. Triangle area:
   $$\text{Area} = \frac{1}{2} \|\mathbf{N}\| = \frac{1}{2}(6) = 3.0 \text{ units}^2$$

---

#### Example 10.2: Normal Inversion via Winding Order Flip
**Problem:** Invert the winding order of the triangle in Example 10.1 to $V_0 \to V_2 \to V_1$ and calculate the resulting normal.

**Solution:**
$$\mathbf{e}_1' = V_2 - V_0 = \begin{bmatrix} 0 \\ 3 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2' = V_1 - V_0 = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$$
$$\mathbf{N}' = \mathbf{e}_1' \times \mathbf{e}_2' = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 3 & 0 \\ 2 & 0 & 0 \end{vmatrix} = -6\mathbf{k} = \begin{bmatrix} 0 \\ 0 \\ -6 \end{bmatrix}$$
$$\hat{\mathbf{n}}' = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} = -\hat{\mathbf{n}}_f$$
Flipping the vertex order reversed the surface normal from $+z$ to $-z$.

---

#### Example 10.3: Detecting Degenerate Triangles
**Problem:** A mesh exporter outputs triangle $T$ with vertices $A(1, 2, 3)$, $B(3, 4, 5)$, and $C(5, 6, 7)$. Determine whether this triangle is degenerate.

**Solution:**
1. Compute edge vectors:
   $$\mathbf{e}_1 = B - A = \begin{bmatrix} 2 \\ 2 \\ 2 \end{bmatrix}, \quad \mathbf{e}_2 = C - A = \begin{bmatrix} 4 \\ 4 \\ 4 \end{bmatrix}$$
2. Cross product:
   $$\mathbf{N} = \mathbf{e}_1 \times \mathbf{e}_2 = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 2 & 2 \\ 4 & 4 & 4 \end{vmatrix}$$
   Notice that $\mathbf{e}_2 = 2 \mathbf{e}_1$.
   $$\mathbf{N} = \begin{bmatrix} (2)(4) - (2)(4) \\ (2)(4) - (2)(4) \\ (2)(4) - (2)(4) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
Since $\|\mathbf{N}\| = 0$, the triangle has zero area. The vertices are collinear.
**Conclusion:** Triangle $T$ is **DEGENERATE** and must be purged from the index buffer.

---

#### Example 10.4: Unweighted Vertex Normal Smoothing
**Problem:** Two triangles share an edge $V_0 V_1$.
- Triangle 1 has vertices $V_0(0, 0, 0)$, $V_1(0, 1, 0)$, $V_2(1, 0, 0)$ (lying in $xy$-plane with normal $\hat{\mathbf{n}}_1 = \begin{bmatrix} 0 & 0 & -1 \end{bmatrix}^T$).
- Triangle 2 has vertices $V_0(0, 0, 0)$, $V_3(0, 0, 1)$, $V_1(0, 1, 0)$ (lying in $yz$-plane with normal $\hat{\mathbf{n}}_2 = \begin{bmatrix} -1 & 0 & 0 \end{bmatrix}^T$).
Compute the smoothed unweighted vertex normal at shared vertex $V_0$.

**Solution:**
$$\mathbf{N}_{\text{unweighted}} = \hat{\mathbf{n}}_1 + \hat{\mathbf{n}}_2 = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} + \begin{bmatrix} -1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} -1 \\ 0 \\ -1 \end{bmatrix}$$
Normalize:
$$\|\mathbf{N}_{\text{unweighted}}\| = \sqrt{(-1)^2 + 0^2 + (-1)^2} = \sqrt{2}$$
$$\hat{\mathbf{n}}_{v_0} = \frac{1}{\sqrt{2}} \begin{bmatrix} -1 \\ 0 \\ -1 \end{bmatrix} = \begin{bmatrix} -1/\sqrt{2} \\ 0 \\ -1/\sqrt{2} \end{bmatrix}$$

---

#### Example 10.5: Area-Weighted Vertex Normal Smoothing
**Problem:** At vertex $V$, two triangles meet:
- Triangle 1 has normal $\hat{\mathbf{n}}_1 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ and area $A_1 = 10.0 \text{ m}^2$.
- Triangle 2 has normal $\hat{\mathbf{n}}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ and area $A_2 = 1.0 \text{ m}^2$.
Calculate the area-weighted smoothed vertex normal $\hat{\mathbf{n}}_v$.

**Solution:**
1. Sum weighted normals:
   $$\mathbf{N} = A_1 \hat{\mathbf{n}}_1 + A_2 \hat{\mathbf{n}}_2 = 10.0 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} + 1.0 \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 10.0 \\ 0 \end{bmatrix}$$
2. Normalize:
   $$\|\mathbf{N}\| = \sqrt{1.0^2 + 10.0^2 + 0^2} = \sqrt{1 + 100} = \sqrt{101} \approx 10.049875$$
   $$\hat{\mathbf{n}}_v = \begin{bmatrix} 1/\sqrt{101} \\ 10/\sqrt{101} \\ 0 \end{bmatrix} \approx \begin{bmatrix} 0.0995 \\ 0.9950 \\ 0 \end{bmatrix}$$
Notice that because Triangle 1 is ten times larger, the smoothed normal is oriented almost entirely in the direction of Triangle 1 ($\hat{\mathbf{n}}_1$).

---

#### Example 10.6: Angle-Weighted Normal Calculation
**Problem:** In a right triangle with vertices $A(0, 0, 0)$, $B(4, 0, 0)$, and $C(0, 3, 0)$:
Find the interior angles at all three vertices and verify their sum equals $\pi$ ($180^\circ$).

**Solution:**
1. At vertex $A$:
   $\vec{AB} = \begin{bmatrix} 4 \\ 0 \\ 0 \end{bmatrix}$, $\vec{AC} = \begin{bmatrix} 0 \\ 3 \\ 0 \end{bmatrix}$.
   $\vec{AB} \cdot \vec{AC} = 0 \implies \alpha_A = 90^\circ = \frac{\pi}{2} \text{ rad}$.
2. At vertex $B$:
   $\vec{BA} = \begin{bmatrix} -4 \\ 0 \\ 0 \end{bmatrix}$, $\vec{BC} = C - B = \begin{bmatrix} -4 \\ 3 \\ 0 \end{bmatrix}$.
   $\vec{BA} \cdot \vec{BC} = (-4)(-4) + 0 + 0 = 16$.
   $\|\vec{BA}\| = 4$, $\|\vec{BC}\| = \sqrt{(-4)^2 + 3^2} = 5$.
   $\cos\alpha_B = \frac{16}{(4)(5)} = \frac{16}{20} = 0.8 \implies \alpha_B = \arccos(0.8) \approx 36.8699^\circ \approx 0.6435 \text{ rad}$.
3. At vertex $C$:
   $\vec{CA} = \begin{bmatrix} 0 \\ -3 \\ 0 \end{bmatrix}$, $\vec{CB} = \begin{bmatrix} 4 \\ -3 \\ 0 \end{bmatrix}$.
   $\vec{CA} \cdot \vec{CB} = 0 + 9 + 0 = 9$.
   $\|\vec{CA}\| = 3$, $\|\vec{CB}\| = 5$.
   $\cos\alpha_C = \frac{9}{(3)(5)} = \frac{9}{15} = 0.6 \implies \alpha_C = \arccos(0.6) \approx 53.1301^\circ \approx 0.9273 \text{ rad}$.
4. Check sum:
   $$90^\circ + 36.87^\circ + 53.13^\circ = 180^\circ \quad \checkmark$$

---

#### Example 10.7: Tangent and Bitangent (TBN) Computation
**Problem:** A triangle in 3D space has vertex positions and UV coordinates:
- $V_0 = (0, 0, 0)$, $UV_0 = (0, 0)$
- $V_1 = (1, 0, 0)$, $UV_1 = (1, 0)$
- $V_2 = (0, 1, 0)$, $UV_2 = (0, 1)$
Find the tangent vector $\mathbf{T}$ and bitangent vector $\mathbf{B}$.

**Solution:**
1. Spatial edges:
   $$\mathbf{e}_1 = V_1 - V_0 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = V_2 - V_0 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
2. UV deltas:
   $$\Delta u_1 = 1 - 0 = 1, \quad \Delta v_1 = 0 - 0 = 0$$
   $$\Delta u_2 = 0 - 0 = 0, \quad \Delta v_2 = 1 - 0 = 1$$
3. UV determinant:
   $$\Delta = \Delta u_1 \Delta v_2 - \Delta u_2 \Delta v_1 = (1)(1) - (0)(0) = 1$$
4. Compute tangent $\mathbf{T}$:
   $$\mathbf{T} = \frac{1}{1} (\Delta v_2 \mathbf{e}_1 - \Delta v_1 \mathbf{e}_2) = 1 \mathbf{e}_1 - 0 \mathbf{e}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$$
5. Compute bitangent $\mathbf{B}$:
   $$\mathbf{B} = \frac{1}{1} (-\Delta u_2 \mathbf{e}_1 + \Delta u_1 \mathbf{e}_2) = 0 \mathbf{e}_1 + 1 \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
6. Surface normal:
   $$\hat{\mathbf{N}} = \mathbf{e}_1 \times \mathbf{e}_2 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
Notice that $\hat{\mathbf{T}} = \mathbf{i}$, $\hat{\mathbf{B}} = \mathbf{j}$, and $\hat{\mathbf{N}} = \mathbf{k}$ form a perfect orthonormal right-handed basis!

---

#### Example 10.8: TBN Orthogonalization via Gram-Schmidt
**Problem:** Due to texture stretching, a computed tangent evaluates to $\mathbf{T} = \begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$ for a surface having normal $\hat{\mathbf{N}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$. Apply Gram-Schmidt to make the tangent strictly orthogonal to the normal and normalize it.

**Solution:**
1. Project $\mathbf{T}$ onto $\hat{\mathbf{N}}$:
   $$\mathbf{T} \cdot \hat{\mathbf{N}} = (1)(0) + (1)(0) + (0)(1) = 0$$
   Here $\mathbf{T}$ is already perpendicular to $\hat{\mathbf{N}}$!
2. Normalize:
   $$\|\mathbf{T}\| = \sqrt{1^2 + 1^2 + 0^2} = \sqrt{2}$$
   $$\hat{\mathbf{T}}_{\text{ortho}} = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$
3. Compute bitangent:
   $$\hat{\mathbf{B}} = \hat{\mathbf{N}} \times \hat{\mathbf{T}}_{\text{ortho}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$

---

#### Example 10.9: Centroid Calculation of a 3D Triangle
**Problem:** Find the centroid $\mathbf{C}$ of the triangle with vertices $A(1, 4, -2)$, $B(3, -2, 6)$, and $C(5, 1, -1)$.

**Solution:**
The centroid of any triangle is the arithmetic mean of its vertex coordinates:
$$\mathbf{C} = \frac{A + B + C}{3} = \frac{1}{3} \left( \begin{bmatrix} 1 \\ 4 \\ -2 \end{bmatrix} + \begin{bmatrix} 3 \\ -2 \\ 6 \end{bmatrix} + \begin{bmatrix} 5 \\ 1 \\ -1 \end{bmatrix} \right) = \frac{1}{3} \begin{bmatrix} 9 \\ 3 \\ 3 \end{bmatrix} = \begin{bmatrix} 3 \\ 1 \\ 1 \end{bmatrix}$$

---

#### Example 10.10: Subdividing a Triangle into 4 Sub-Triangles
**Problem:** In terrain level-of-detail (LOD) systems, a triangle $T_0(A, B, C)$ is tessellated by inserting midpoints on its three edges: $M_{AB} = \frac{A+B}{2}$, $M_{BC} = \frac{B+C}{2}$, $M_{CA} = \frac{C+A}{2}$. Write down the 4 child triangles maintaining consistent CCW winding order.

**Solution:**
Let the original winding order be $A \to B \to C$.
The 4 child triangles are:
1. Corner $A$: $\triangle_1 = (A, M_{AB}, M_{CA})$
2. Corner $B$: $\triangle_2 = (M_{AB}, B, M_{BC})$
3. Corner $C$: $\triangle_3 = (M_{CA}, M_{BC}, C)$
4. Central inverted triangle: $\triangle_4 = (M_{AB}, M_{BC}, M_{CA})$
Every child triangle preserves identical counter-clockwise winding order and outward-facing normal orientation.

---

### Section 10.8 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 10.1
**Problem:** A triangle has vertices $(0, 0, 0)$, $(1, 0, 0)$, and $(0, 1, 0)$. What is its surface area?
**Solution:**
$$\text{Area} = \frac{1}{2} \|\mathbf{i} \times \mathbf{j}\| = \frac{1}{2}\|\mathbf{k}\| = 0.5 \text{ units}^2$$

---

#### Exercise 10.2
**Problem:** Why are quadrilaterals routinely triangulated in 3D physics engines before collision testing?
**Solution:**
A 4-vertex quad in 3D space can be non-planar (warped or saddle-shaped), meaning no single plane equation or normal vector can represent it. Triangulating the quad into two triangles guarantees that each element is strictly planar, enabling exact plane-based and SAT collision algorithms.

---

#### Exercise 10.3
**Problem:** Find the normal vector to the triangle $A(1, 0, 0)$, $B(0, 1, 0)$, $C(0, 0, 1)$.
**Solution:**
$\vec{AB} = \begin{bmatrix} -1 \\ 1 \\ 0 \end{bmatrix}$, $\vec{AC} = \begin{bmatrix} -1 \\ 0 \\ 1 \end{bmatrix}$.
$$\mathbf{N} = \vec{AB} \times \vec{AC} = \begin{bmatrix} (1)(1) - 0 \\ -((-1)(1) - 0) \\ 0 - (1)(-1) \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$$
$$\hat{\mathbf{n}} = \begin{bmatrix} 1/\sqrt{3} \\ 1/\sqrt{3} \\ 1/\sqrt{3} \end{bmatrix}$$

---

#### Exercise 10.4
**Problem:** If a triangle has vertices $A(0, 0, 0)$, $B(2, 0, 0)$, and $C(2, 0, 0)$, what will be the value of $\vec{AB} \times \vec{AC}$?
**Solution:**
Notice $B = C$, so $\vec{AC} = \vec{AB}$.
The cross product of any vector with itself is zero:
$$\vec{AB} \times \vec{AB} = \mathbf{0}$$
The triangle is degenerate.

---

#### Exercise 10.5
**Problem:** A vertex normal is computed by summing three face normals: $\mathbf{n}_1 = (0, 1, 0)$, $\mathbf{n}_2 = (0, 1, 0)$, $\mathbf{n}_3 = (0, 0, 1)$. Find the normalized vertex normal.
**Solution:**
$$\mathbf{N} = \mathbf{n}_1 + \mathbf{n}_2 + \mathbf{n}_3 = \begin{bmatrix} 0 \\ 2 \\ 1 \end{bmatrix}$$
$$\|\mathbf{N}\| = \sqrt{0 + 4 + 1} = \sqrt{5}$$
$$\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 2/\sqrt{5} \\ 1/\sqrt{5} \end{bmatrix}$$

---

#### Exercise 10.6
**Problem:** In an indexed mesh, how many triangles can share a single vertex?
**Solution:**
There is no theoretical limit; in closed 2D 2-manifold surfaces, a vertex typically shares between 3 and 8 triangles (with an average valence of 6 in regular triangular meshes).

---

#### Exercise 10.7
**Problem:** Under what condition would the angle-weighted vertex normal computation fail?
**Solution:**
It fails if all triangles incident to the vertex are degenerate (zero area, so interior angles are undefined), or if the sum of angle-weighted face normals sums to the exact zero vector $\mathbf{0}$ (e.g., symmetric opposite faces canceling each other out, such as on a 2D sheet with duplicate opposite-facing triangles).

---

#### Exercise 10.8
**Problem:** What is the relationship between the bitangent $\mathbf{B}$ and the tangent $\mathbf{T}$ and normal $\mathbf{N}$ in a right-handed tangent space?
**Solution:**
$$\mathbf{B} = \mathbf{N} \times \mathbf{T}$$

---

#### Exercise 10.9
**Problem:** If a triangle has area $A = 12 \text{ m}^2$, what is the magnitude of the unnormalized cross product of two of its edges?
**Solution:**
Since $\|\mathbf{e}_1 \times \mathbf{e}_2\| = 2 \times \text{Area}$, the magnitude is:
$$\|\mathbf{e}_1 \times \mathbf{e}_2\| = 2 \times 12 = 24$$

---

#### Exercise 10.10
**Problem:** In Gouraud shading, where are the lighting equations calculated, and how is the color propagated across the triangle?
**Solution:**
Lighting calculations (diffuse, specular) are computed exclusively at the **vertices** of each triangle using the vertex normals. The resulting RGB color values are then bilinearly interpolated across the interior pixels of the triangle using barycentric coordinates.

# Chapter 11: Ray-Plane and Ray-Triangle Intersections (MÃ¶ller-Trumbore Algorithm)

> *"The foundation of modern ray tracing rests on a single geometric query repeated billions of times per second: does a directed beam of light pierce a given triangular facet, and if so, at what exact instant of time?"*  
> â€” **Tomas MÃ¶ller and Ben Trumbore**, *Fast, Minimum Storage Ray/Triangle Intersection* (1997)

---

### Section 11.1 Analytical Ray-Plane Intersection

Before we can test whether a ray intersects a finite 3D triangle, we must first master the simpler problem of intersecting a ray with an infinite 2D plane.

Let a 3D ray be parameterized by:
$$\mathbf{R}(t) = \mathbf{P}_0 + t \mathbf{d}, \quad t \ge 0$$
where $\mathbf{P}_0 \in \mathbb{R}^3$ is the ray origin, $\mathbf{d} \in \mathbb{R}^3$ is the non-zero ray direction vector, and $t$ is the scalar ray distance (time parameter).

Let an infinite plane $\Pi$ be described in General Cartesian Form:
$$\mathbf{n} \cdot \mathbf{r} + D = 0$$
where $\mathbf{n} = \begin{bmatrix} A & B & C \end{bmatrix}^T$ is the plane surface normal and $D$ is the offset constant.

```
          Ray Origin P0
              \
               \   Ray direction d
                \
       ==========+====================== Plane Pi (n Â· r + D = 0)
              Hit Point P(t*)
```

#### Analytical Derivation of Hit Time $t^*$:
To find the intersection, we substitute the ray equation $\mathbf{R}(t)$ directly into the plane equation:
$$\mathbf{n} \cdot (\mathbf{P}_0 + t \mathbf{d}) + D = 0$$

By the distributive property of the dot product:
$$\mathbf{n} \cdot \mathbf{P}_0 + t (\mathbf{n} \cdot \mathbf{d}) + D = 0$$

Isolating the term containing $t$:
$$t (\mathbf{n} \cdot \mathbf{d}) = -(\mathbf{n} \cdot \mathbf{P}_0 + D)$$

Assuming that the denominator $\mathbf{n} \cdot \mathbf{d} \ne 0$, we divide to obtain the closed-form solution:
$$t^* = \frac{-(\mathbf{n} \cdot \mathbf{P}_0 + D)}{\mathbf{n} \cdot \mathbf{d}}$$

#### Physical and Geometric Interpretation of Terms:
- **Numerator $-(\mathbf{n} \cdot \mathbf{P}_0 + D)$:** This is the negative of the signed distance from the ray origin $\mathbf{P}_0$ to the plane (scaled by $\|\mathbf{n}\|$).
- **Denominator $\mathbf{n} \cdot \mathbf{d}$:** This measures the rate of approach. If $\mathbf{n} \cdot \mathbf{d} < 0$, the ray is traveling *towards* the front side of the plane. If $\mathbf{n} \cdot \mathbf{d} > 0$, the ray is traveling away from the front side.

#### Critical Edge Cases:
1. **Parallel Ray ($\mathbf{n} \cdot \mathbf{d} = 0$):**  
   The ray direction is perpendicular to the plane normal. The ray runs parallel to the plane surface.
   - If $\mathbf{n} \cdot \mathbf{P}_0 + D = 0$: The ray origin lies inside the plane, so the entire ray lies in the plane (infinite intersections).
   - If $\mathbf{n} \cdot \mathbf{P}_0 + D \ne 0$: The ray never intersects the plane (zero intersections).
   In software: test if $|\mathbf{n} \cdot \mathbf{d}| < \epsilon$ (e.g., $10^{-7}$). If true, return *No Hit*.
2. **Behind the Ray ($t^* < 0$):**  
   The intersection point lies behind the ray origin along the negative ray direction. In rendering and raycasting, this is discarded: valid hits must satisfy $t^* \ge \epsilon_{\text{hit}} > 0$.

Once a valid $t^*$ is found, the 3D coordinates of the hit point are computed instantly:
$$\mathbf{P}_{\text{hit}} = \mathbf{P}_0 + t^* \mathbf{d}$$

---

### Section 11.2 The Two-Step Ray-Triangle Test

Historically, the earliest algorithm for testing ray-triangle intersection proceeded in two sequential stages:

1. **Step 1: Intersect with the Embedding Plane.**  
   Compute the plane equation containing triangle vertices $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2$:
   $$\mathbf{n} = (\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{v}_2 - \mathbf{v}_0), \quad D = -\mathbf{n} \cdot \mathbf{v}_0$$
   Compute $t^* = \frac{-(\mathbf{n} \cdot \mathbf{P}_0 + D)}{\mathbf{n} \cdot \mathbf{d}}$. If $t^* \le 0$, reject.  
   Compute $\mathbf{P}_{\text{hit}} = \mathbf{P}_0 + t^* \mathbf{d}$.

2. **Step 2: Inside-Outside Edge Test (Point-in-Triangle Test).**  
   Determine whether $\mathbf{P}_{\text{hit}}$ lies within the 2D boundaries of the triangle.  
   For a counter-clockwise triangle, $\mathbf{P}_{\text{hit}}$ is inside if and only if it lies to the left of all three directed edge vectors:
   $$[(\mathbf{v}_1 - \mathbf{v}_0) \times (\mathbf{P}_{\text{hit}} - \mathbf{v}_0)] \cdot \mathbf{n} \ge 0$$
   $$[(\mathbf{v}_2 - \mathbf{v}_1) \times (\mathbf{P}_{\text{hit}} - \mathbf{v}_1)] \cdot \mathbf{n} \ge 0$$
   $$[(\mathbf{v}_0 - \mathbf{v}_2) \times (\mathbf{P}_{\text{hit}} - \mathbf{v}_2)] \cdot \mathbf{n} \ge 0$$

```
              v2
             /  \
            /  P \    (Inside if P is to the left of all 3 edges)
           /      \
          v0 ---- v1
```

While conceptually clear, this two-step approach is computationally wasteful: it requires precomputing and storing the plane equation $(A, B, C, D)$ for every triangle in the scene (increasing memory footprints) or recomputing normal cross products repeatedly.

---

### Section 11.3 3D Barycentric Coordinates

To construct a faster algorithm, we parameterize any point $\mathbf{P}$ in the plane of triangle $\triangle \mathbf{v}_0 \mathbf{v}_1 \mathbf{v}_2$ using **Barycentric Coordinates** $(u, v, w)$:
$$\mathbf{P}(u, v, w) = (1 - u - v)\mathbf{v}_0 + u \mathbf{v}_1 + v \mathbf{v}_2$$
where $w = 1 - u - v$, so that:
$$u + v + w = 1$$

```
                    v2 (0, 1, 0)
                     /\
                    /  \
                   /    \
                  /  P   \
                 /        \
    (1, 0, 0) v0 ---------- v1 (0, 0, 1)
```

#### Interior Point Criterion:
A point $\mathbf{P}$ lies **strictly inside** the triangle if and only if its barycentric weights satisfy the three simultaneous inequalities:
$$u \ge 0$$
$$v \ge 0$$
$$u + v \le 1 \quad (\iff w \ge 0)$$

If $u = 0$, the point lies on edge $\mathbf{v}_0 \mathbf{v}_2$. If $v = 0$, it lies on edge $\mathbf{v}_0 \mathbf{v}_1$. If $u + v = 1$, it lies on edge $\mathbf{v}_1 \mathbf{v}_2$. If $u = v = 0$, it is vertex $\mathbf{v}_0$.

---

### Section 11.4 The MÃ¶ller-Trumbore Algorithm

In 1997, Tomas MÃ¶ller and Ben Trumbore published a revolutionary breakthrough: an algorithm that computes the ray intersection time $t$ and barycentric coordinates $(u, v)$ simultaneously **without precomputing or storing the plane equation**!

#### 1. Mathematical Formulation:
Equating the ray equation with the barycentric triangle parameterization:
$$\mathbf{P}_0 + t \mathbf{d} = (1 - u - v)\mathbf{v}_0 + u \mathbf{v}_1 + v \mathbf{v}_2$$

Rearranging terms:
$$\mathbf{P}_0 + t \mathbf{d} = \mathbf{v}_0 + u(\mathbf{v}_1 - \mathbf{v}_0) + v(\mathbf{v}_2 - \mathbf{v}_0)$$
$$\mathbf{P}_0 - \mathbf{v}_0 = -t \mathbf{d} + u(\mathbf{v}_1 - \mathbf{v}_0) + v(\mathbf{v}_2 - \mathbf{v}_0)$$

Let us define the edge vectors and displacement vector:
$$\mathbf{e}_1 \equiv \mathbf{v}_1 - \mathbf{v}_0$$
$$\mathbf{e}_2 \equiv \mathbf{v}_2 - \mathbf{v}_0$$
$$\mathbf{s} \equiv \mathbf{P}_0 - \mathbf{v}_0$$

The equation becomes:
$$\mathbf{s} = -t \mathbf{d} + u \mathbf{e}_1 + v \mathbf{e}_2$$

Grouping into a $3 \times 3$ matrix equation with unknowns $\begin{bmatrix} t \\ u \\ v \end{bmatrix}$:
$$\begin{bmatrix} -\mathbf{d} & \mathbf{e}_1 & \mathbf{e}_2 \end{bmatrix} \begin{bmatrix} t \\ u \\ v \end{bmatrix} = \mathbf{s}$$

#### 2. Solution via Cramer's Rule:
Recall from linear algebra that the solution to $\mathbf{M} \mathbf{x} = \mathbf{s}$ via Cramer's rule expresses each unknown as the ratio of determinants:
$$\det(\mathbf{M}) = \det\begin{bmatrix} -\mathbf{d} & \mathbf{e}_1 & \mathbf{e}_2 \end{bmatrix} = -[-\mathbf{d}, \mathbf{e}_1, \mathbf{e}_2] = (\mathbf{d} \times \mathbf{e}_2) \cdot \mathbf{e}_1$$

Let $\mathbf{p} \equiv \mathbf{d} \times \mathbf{e}_2$.
Then the determinant is simply:
$$\det = \mathbf{p} \cdot \mathbf{e}_1$$

Applying Cramer's rule to each column:
- For $u$: replace column 2 ($\mathbf{e}_1$) with $\mathbf{s}$:
  $$\det_u = \det\begin{bmatrix} -\mathbf{d} & \mathbf{s} & \mathbf{e}_2 \end{bmatrix} = (\mathbf{d} \times \mathbf{e}_2) \cdot \mathbf{s} = \mathbf{p} \cdot \mathbf{s} \quad \text{... wait!}$$
  Using scalar triple product identities:
  $$\det\begin{bmatrix} \mathbf{s} & \mathbf{e}_2 & \mathbf{d} \end{bmatrix} = (\mathbf{s} \times \mathbf{e}_1) \cdot \mathbf{e}_2$$
  More directly:
  $$u = \frac{(\mathbf{s} \times \mathbf{e}_1) \cdot \mathbf{d} \text{ ? No: let's verify precisely:}}$$

Let us solve the linear system:
$$\begin{bmatrix} t \\ u \\ v \end{bmatrix} = \frac{1}{\det} \begin{bmatrix} \det_t \\ \det_u \\ \det_v \end{bmatrix}$$
where:
$$\det = (\mathbf{d} \times \mathbf{e}_2) \cdot \mathbf{e}_1 = \mathbf{p} \cdot \mathbf{e}_1$$
Let $\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$.
Let $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$.

Then:
$$\begin{bmatrix} t \\ u \\ v \end{bmatrix} = \frac{1}{\mathbf{p} \cdot \mathbf{e}_1} \begin{bmatrix} \mathbf{q} \cdot \mathbf{e}_2 \\ \mathbf{p} \cdot \mathbf{s} \\ \mathbf{q} \cdot \mathbf{d} \end{bmatrix}$$

Notice the astonishing symmetry of this formula:
- $u = \frac{\mathbf{p} \cdot \mathbf{s}}{\det}$
- $v = \frac{\mathbf{q} \cdot \mathbf{d}}{\det}$
- $t = \frac{\mathbf{q} \cdot \mathbf{e}_2}{\det}$

It requires only **two vector cross products** ($\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$ and $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$) and **four scalar dot products**!

---

### Section 11.5 Early-Out Rejection Branches in MÃ¶ller-Trumbore

The brilliance of MÃ¶ller-Trumbore lies in its computational pipelining: intermediate values can be tested immediately, terminating the calculation at the earliest possible microsecond without evaluating the rest of the equations.

```
       [Start]
          |
          v
     p = d x e2
     det = e1 Â· p
          |
     |det| < EPSILON? -------------> [REJECT: Ray parallel to triangle]
          | NO
          v
     invDet = 1 / det
     s = P0 - v0
     u = (s Â· p) * invDet
          |
     u < 0 or u > 1? --------------> [REJECT: Outside edge v0-v2]
          | NO
          v
     q = s x e1
     v = (d Â· q) * invDet
          |
     v < 0 or u + v > 1? ----------> [REJECT: Outside edges v0-v1 or v1-v2]
          | NO
          v
     t = (e2 Â· q) * invDet
          |
     t < EPSILON? -----------------> [REJECT: Hit behind ray origin]
          | NO
          v
      [HIT DETECTED: Return t, u, v]
```

#### Production TypeScript Implementation:
```typescript
interface HitRecord {
  hit: boolean;
  t: number;
  u: number;
  v: number;
}

function intersectRayTriangle(
  origin: Vector3,
  dir: Vector3,
  v0: Vector3,
  v1: Vector3,
  v2: Vector3,
  cullBackfaces: boolean = true
): HitRecord {
  const EPSILON = 1e-7;
  const noHit: HitRecord = { hit: false, t: 0, u: 0, v: 0 };

  const e1 = v1.clone().sub(v0);
  const e2 = v2.clone().sub(v0);
  const p = dir.clone().cross(e2);
  const det = e1.dot(p);

  if (cullBackfaces) {
    // If det < EPSILON, ray is parallel or faces away (backface culling)
    if (det < EPSILON) return noHit;
  } else {
    // Double-sided test: only reject if near zero
    if (Math.abs(det) < EPSILON) return noHit;
  }

  const invDet = 1.0 / det;
  const s = origin.clone().sub(v0);
  const u = s.dot(p) * invDet;
  if (u < 0.0 || u > 1.0) return noHit;

  const q = s.clone().cross(e1);
  const v = dir.dot(q) * invDet;
  if (v < 0.0 || u + v > 1.0) return noHit;

  const t = e2.dot(q) * invDet;
  if (t < EPSILON) return noHit;

  return { hit: true, t, u, v };
}
```

---

### Section 11.6 Edge and Vertex Hit Ambiguities and Floating-Point Robustness

In real-world ray tracers (such as Arnold, RenderMan, or custom BVH traversers), rays occasionally strike directly along a shared triangle edge or through a vertex shared by multiple triangles.

Due to IEEE 754 floating-point inaccuracies:
- **Double Hits:** The ray could register a hit on *both* adjacent triangles, triggering duplicate lighting calculations or incorrect refractive dispersion.
- **Misses (Cracks):** The ray could slip through the mathematical seam between the triangles, producing dark visual spark artifacts ("fireflies" or "pinholes").

To guarantee topological watertightness, modern engines:
1. Use conservative boundary inequalities: $u \ge 0.0 - \epsilon_{\text{edge}}$ and $u + v \le 1.0 + \epsilon_{\text{edge}}$.
2. Consistently break ties based on the ray's octant or orientation.
3. Compute intersection coordinates in double precision (`float64`) while storing geometry in single precision (`float32`).

---

### Section 11.7 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 11.1: Direct Ray-Plane Intersection
**Problem:** A ray has origin $\mathbf{P}_0 = (0, 10, 0)$ and normalized direction $\mathbf{d} = \begin{bmatrix} 0 \\ -1 \\ 0 \end{bmatrix}$. A horizontal floor plane has equation $y = 0$ (normal $\mathbf{n} = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$, offset $D = 0$). Compute the hit time $t^*$ and the hit point.

**Solution:**
1. Compute $\mathbf{n} \cdot \mathbf{d}$:
   $$\mathbf{n} \cdot \mathbf{d} = (0)(0) + (1)(-1) + (0)(0) = -1$$
   Since $\mathbf{n} \cdot \mathbf{d} \ne 0$, the ray is not parallel to the floor.
2. Compute $\mathbf{n} \cdot \mathbf{P}_0 + D$:
   $$\mathbf{n} \cdot \mathbf{P}_0 + D = (0)(0) + (1)(10) + (0)(0) + 0 = 10$$
3. Compute $t^*$:
   $$t^* = \frac{-(\mathbf{n} \cdot \mathbf{P}_0 + D)}{\mathbf{n} \cdot \mathbf{d}} = \frac{-(10)}{-1} = 10.0$$
4. Compute hit position:
   $$\mathbf{P}_{\text{hit}} = \mathbf{P}_0 + t^* \mathbf{d} = \begin{bmatrix} 0 \\ 10 \\ 0 \end{bmatrix} + 10 \begin{bmatrix} 0 \\ -1 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix}$$
The ray strikes the floor at origin $(0, 0, 0)$ at time $t = 10$.

---

#### Example 11.2: Ray-Plane Parallel Rejection
**Problem:** A ray has origin $\mathbf{P}_0 = (1, 2, 3)$ and direction $\mathbf{d} = \begin{bmatrix} 2 \\ -1 \\ 0 \end{bmatrix}$. The plane is $x + 2y - 4z = 10$. Determine if the ray intersects the plane.

**Solution:**
1. Normal $\mathbf{n} = \begin{bmatrix} 1 \\ 2 \\ -4 \end{bmatrix}$.
2. Compute dot product $\mathbf{n} \cdot \mathbf{d}$:
   $$\mathbf{n} \cdot \mathbf{d} = (1)(2) + (2)(-1) + (-4)(0) = 2 - 2 + 0 = 0$$
3. Since $\mathbf{n} \cdot \mathbf{d} = 0$, the ray is parallel to the plane.
4. Check if origin $\mathbf{P}_0$ lies on the plane:
   $$1(1) + 2(2) - 4(3) = 1 + 4 - 12 = -7 \ne 10$$
**Conclusion:** The ray is strictly parallel to the plane and never intersects it (**NO HIT**).

---

#### Example 11.3: Ray-Triangle MÃ¶ller-Trumbore Full Execution (Hit)
**Problem:** A triangle has vertices $V_0(0, 0, 0)$, $V_1(2, 0, 0)$, and $V_2(0, 2, 0)$.
A ray has origin $\mathbf{P}_0 = (0.5, 0.5, 5.0)$ and direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.
Execute the MÃ¶ller-Trumbore algorithm step by step to determine if the ray hits the triangle.

**Solution:**
1. Edge vectors:
   $$\mathbf{e}_1 = V_1 - V_0 = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = V_2 - V_0 = \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$$
2. Vector $\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$:
   $$\mathbf{p} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} \times \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix} = \begin{bmatrix} (0)(0) - (-1)(2) \\ (-1)(0) - (0)(0) \\ (0)(2) - (0)(0) \end{bmatrix} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$$
3. Determinant $\det = \mathbf{e}_1 \cdot \mathbf{p}$:
   $$\det = (2)(2) + (0)(0) + (0)(0) = 4.0 \ne 0$$
   $$\text{invDet} = \frac{1}{4.0} = 0.25$$
4. Displacement vector $\mathbf{s} = \mathbf{P}_0 - V_0$:
   $$\mathbf{s} = \begin{bmatrix} 0.5 \\ 0.5 \\ 5.0 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 0.5 \\ 5.0 \end{bmatrix}$$
5. Barycentric coordinate $u = (\mathbf{s} \cdot \mathbf{p}) \times \text{invDet}$:
   $$\mathbf{s} \cdot \mathbf{p} = (0.5)(2) + (0.5)(0) + (5.0)(0) = 1.0$$
   $$u = 1.0 \times 0.25 = 0.25$$
   Check: $0 \le u \le 1 \implies 0.25 \in [0, 1] \quad \checkmark$
6. Vector $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$:
   $$\mathbf{q} = \begin{bmatrix} 0.5 \\ 0.5 \\ 5.0 \end{bmatrix} \times \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} (0.5)(0) - (5.0)(0) \\ (5.0)(2) - (0.5)(0) \\ (0.5)(0) - (0.5)(2) \end{bmatrix} = \begin{bmatrix} 0 \\ 10 \\ -1 \end{bmatrix}$$
7. Barycentric coordinate $v = (\mathbf{d} \cdot \mathbf{q}) \times \text{invDet}$:
   $$\mathbf{d} \cdot \mathbf{q} = (0)(0) + (0)(10) + (-1)(-1) = 1.0$$
   $$v = 1.0 \times 0.25 = 0.25$$
   Check: $v \ge 0$ and $u + v \le 1 \implies 0.25 + 0.25 = 0.50 \le 1.0 \quad \checkmark$
8. Hit time $t = (\mathbf{e}_2 \cdot \mathbf{q}) \times \text{invDet}$:
   $$\mathbf{e}_2 \cdot \mathbf{q} = (0)(0) + (2)(10) + (0)(-1) = 20.0$$
   $$t = 20.0 \times 0.25 = 5.0$$
   Check: $t = 5.0 > 0 \quad \checkmark$
**Result:** **HIT!** $t = 5.0$, $u = 0.25$, $v = 0.25$.
Hit position: $\mathbf{P}(5) = (0.5, 0.5, 0)$.

---

#### Example 11.4: MÃ¶ller-Trumbore Early Out on $u < 0$
**Problem:** Using the same triangle as Example 11.3, test a ray with origin $\mathbf{P}_0 = (-1.0, 0.5, 5.0)$ and direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.

**Solution:**
1. From Example 11.3, $\mathbf{p} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$ and $\text{invDet} = 0.25$.
2. $\mathbf{s} = \mathbf{P}_0 - V_0 = \begin{bmatrix} -1.0 \\ 0.5 \\ 5.0 \end{bmatrix}$.
3. Compute $u$:
   $$\mathbf{s} \cdot \mathbf{p} = (-1.0)(2) + 0 + 0 = -2.0$$
   $$u = -2.0 \times 0.25 = -0.5$$
4. Check bounds:
   Since $u = -0.5 < 0.0$, the ray misses the triangle to the left of edge $V_0 V_2$.
**Result:** **EARLY REJECTION (NO HIT)**. (Step 6, 7, and 8 are skipped entirely!).

---

#### Example 11.5: MÃ¶ller-Trumbore Early Out on $u + v > 1$
**Problem:** Using the same triangle, test ray origin $\mathbf{P}_0 = (1.5, 1.5, 5.0)$ and direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.

**Solution:**
1. $\mathbf{s} = \begin{bmatrix} 1.5 \\ 1.5 \\ 5.0 \end{bmatrix}$.
2. $u = (\mathbf{s} \cdot \mathbf{p}) \times \text{invDet} = ((1.5)(2)) \times 0.25 = 3.0 \times 0.25 = 0.75$. ($u \in [0, 1] \checkmark$).
3. $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1 = \begin{bmatrix} 1.5 \\ 1.5 \\ 5.0 \end{bmatrix} \times \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 10 \\ -3 \end{bmatrix}$.
4. $v = (\mathbf{d} \cdot \mathbf{q}) \times \text{invDet} = ((-1)(-3)) \times 0.25 = 3.0 \times 0.25 = 0.75$.
5. Check sum:
   $$u + v = 0.75 + 0.75 = 1.5 > 1.0$$
**Result:** **EARLY REJECTION (NO HIT)**. The point lies outside the hypotenuse edge $V_1 V_2$.

---

#### Example 11.6: Ray Hit Behind Origin ($t < 0$)
**Problem:** Using the same triangle, test ray origin $\mathbf{P}_0 = (0.5, 0.5, -5.0)$ with direction $\mathbf{d} = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$.

**Solution:**
Here the ray is at $z = -5$ pointing downwards toward $z = -\infty$, while the triangle is at $z = 0$.
1. $u = 0.25$, $v = 0.25$ (both valid).
2. $t = (\mathbf{e}_2 \cdot \mathbf{q}) \times \text{invDet}$.
   With $\mathbf{P}_0 = (0.5, 0.5, -5.0)$, $\mathbf{s} = (0.5, 0.5, -5.0)$.
   $\mathbf{q} = \mathbf{s} \times \mathbf{e}_1 = \begin{bmatrix} 0 \\ -10 \\ -1 \end{bmatrix}$.
   $\mathbf{e}_2 \cdot \mathbf{q} = (2)(-10) = -20$.
   $$t = -20 \times 0.25 = -5.0$$
Since $t = -5.0 < 0$, the intersection lies behind the ray.
**Result:** **NO HIT**.

---

#### Example 11.7: Reconstructing 3D Position from Barycentric Coordinates
**Problem:** An intersection returns $u = 0.2, v = 0.5$ on a triangle with vertices $V_0(1, 0, 1)$, $V_1(4, 2, 3)$, and $V_2(2, 5, 2)$. Calculate the 3D position $\mathbf{P}_{\text{hit}}$.

**Solution:**
Compute third barycentric coordinate $w$:
$$w = 1 - u - v = 1 - 0.2 - 0.5 = 0.3$$
Evaluate the weighted linear combination:
$$\mathbf{P}_{\text{hit}} = w V_0 + u V_1 + v V_2$$
$$= 0.3 \begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix} + 0.2 \begin{bmatrix} 4 \\ 2 \\ 3 \end{bmatrix} + 0.5 \begin{bmatrix} 2 \\ 5 \\ 2 \end{bmatrix}$$
$$= \begin{bmatrix} 0.3 \\ 0.0 \\ 0.3 \end{bmatrix} + \begin{bmatrix} 0.8 \\ 0.4 \\ 0.6 \end{bmatrix} + \begin{bmatrix} 1.0 \\ 2.5 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 0.3 + 0.8 + 1.0 \\ 0.0 + 0.4 + 2.5 \\ 0.3 + 0.6 + 1.0 \end{bmatrix} = \begin{bmatrix} 2.1 \\ 2.9 \\ 1.9 \end{bmatrix}$$

---

#### Example 11.8: Barycentric Interpolation of Vertex Normals (Phong Shading)
**Problem:** At the hit point from Example 11.7 ($w = 0.3, u = 0.2, v = 0.5$), the triangle has vertex normals:
$$\hat{\mathbf{n}}_0 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \hat{\mathbf{n}}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \hat{\mathbf{n}}_2 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
Calculate the interpolated and re-normalized surface normal $\hat{\mathbf{n}}_{\text{shading}}$.

**Solution:**
1. Linear interpolation:
   $$\mathbf{N} = w \hat{\mathbf{n}}_0 + u \hat{\mathbf{n}}_1 + v \hat{\mathbf{n}}_2 = 0.3 \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix} + 0.2 \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + 0.5 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0.2 \\ 0.3 \\ 0.5 \end{bmatrix}$$
2. Normalize:
   $$\|\mathbf{N}\| = \sqrt{0.2^2 + 0.3^2 + 0.5^2} = \sqrt{0.04 + 0.09 + 0.25} = \sqrt{0.38} \approx 0.616441$$
   $$\hat{\mathbf{n}}_{\text{shading}} = \frac{1}{\sqrt{0.38}} \begin{bmatrix} 0.2 \\ 0.3 \\ 0.5 \end{bmatrix} \approx \begin{bmatrix} 0.3244 \\ 0.4867 \\ 0.8111 \end{bmatrix}$$

---

#### Example 11.9: Ray-Plane Intersection with Oblique Ray
**Problem:** A ray has origin $\mathbf{P}_0 = (2, 3, 4)$ and direction $\mathbf{d} = \begin{bmatrix} 1 \\ -1 \\ 2 \end{bmatrix}$. The plane is $2x + y - z = 5$. Find the exact hit point.

**Solution:**
1. Normal $\mathbf{n} = \begin{bmatrix} 2 \\ 1 \\ -1 \end{bmatrix}$, $D = -5$.
2. $\mathbf{n} \cdot \mathbf{d} = (2)(1) + (1)(-1) + (-1)(2) = 2 - 1 - 2 = -1$.
3. $\mathbf{n} \cdot \mathbf{P}_0 + D = (2)(2) + (1)(3) + (-1)(4) - 5 = 4 + 3 - 4 - 5 = -2$.
4. $t^* = \frac{-(-2)}{-1} = \frac{2}{-1} = -2.0$.
Since $t^* = -2.0 < 0$, the intersection occurs behind the ray origin.
**Result:** No forward hit.

---

#### Example 11.10: Single-Sided vs Double-Sided Culling
**Problem:** A ray hits the back side of a triangle ($\det = \mathbf{e}_1 \cdot \mathbf{p} = -3.5 < 0$).
Explain why a single-sided test rejects the triangle, and how a double-sided test proceeds.

**Solution:**
- **Single-Sided:** If backface culling is enabled, any triangle whose normal faces away from the ray direction has $\det < 0$. The test `if (det < EPSILON) return false;` immediately discards the triangle. This halves the rendering cost for closed 3D meshes.
- **Double-Sided:** If rendering thin two-sided surfaces (like leaves, paper, or clothing), we allow $\det < 0$. We only reject if $|\det| < \epsilon$. We compute $\text{invDet} = \frac{1}{\det}$ (which will be negative). Both the numerator and denominator in Cramer's rule have negative signs, which cancel out, yielding positive valid $u, v, t$ parameters!

---

### Section 11.8 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 11.1
**Problem:** What are the barycentric coordinates of vertex $\mathbf{v}_1$ in triangle $(\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2)$?
**Solution:**
$u = 1, v = 0, w = 0$.

---

#### Exercise 11.2
**Problem:** If $u = 0.4$ and $v = 0.7$ for a point in the plane of a triangle, does the point lie inside the triangle?
**Solution:**
Check sum: $u + v = 0.4 + 0.7 = 1.1 > 1.0$.
No, the point lies outside the triangle.

---

#### Exercise 11.3
**Problem:** Find the intersection of ray $\mathbf{P}_0 = (0, 0, 10), \mathbf{d} = (0, 0, -2)$ with the plane $z = 0$.
**Solution:**
$z(t) = 10 - 2t = 0 \implies 2t = 10 \implies t = 5$.
Hit point: $(0, 0, 0)$.

---

#### Exercise 11.4
**Problem:** In the MÃ¶ller-Trumbore algorithm, what does the scalar $\det = \mathbf{e}_1 \cdot (\mathbf{d} \times \mathbf{e}_2)$ represent geometrically?
**Solution:**
It represents $-(\mathbf{n} \cdot \mathbf{d})$, which is proportional to the cosine of the angle between the ray direction and the triangle face normal multiplied by twice the triangle area.

---

#### Exercise 11.5
**Problem:** Why is `Math.abs(det) < 1e-7` checked before computing `1.0 / det`?
**Solution:**
To prevent division by zero or floating-point overflow (`Infinity`) when the ray is parallel or nearly parallel to the triangle plane.

---

#### Exercise 11.6
**Problem:** A ray strikes a triangle at its exact centroid. What are the barycentric coordinates $(w, u, v)$?
**Solution:**
$w = \frac{1}{3}, u = \frac{1}{3}, v = \frac{1}{3}$.

---

#### Exercise 11.7
**Problem:** If a ray origin lies directly on the plane of the triangle ($t = 0$), why do ray tracers typically require $t > \epsilon_{\text{min}}$ (e.g., $10^{-4}$)?
**Solution:**
To prevent **shadow acne / self-intersection**: when a ray is spawned from a surface point to test visibility to a light source, floating-point roundoff can cause the ray to immediately re-intersect the very same triangle it originated from.

---

#### Exercise 11.8
**Problem:** How many cross products are evaluated in the MÃ¶ller-Trumbore algorithm if the ray misses the bounding box or fails on $u$?
**Solution:**
Exactly **one** cross product ($\mathbf{p} = \mathbf{d} \times \mathbf{e}_2$). The second cross product ($\mathbf{q} = \mathbf{s} \times \mathbf{e}_1$) is never computed!

---

#### Exercise 11.9
**Problem:** If triangle vertices are given in clockwise order, how does that affect the sign of $\det$ in MÃ¶ller-Trumbore?
**Solution:**
The cross product $\mathbf{e}_1 \times \mathbf{e}_2$ will point in the opposite direction, inverting the sign of $\det$. If backface culling is enabled, front-facing rays will be erroneously culled unless the winding order convention is adjusted.

---

#### Exercise 11.10
**Problem:** What is the maximum number of times a straight line can intersect a single flat triangle in $\mathbb{R}^3$?
**Solution:**
If the line does not lie in the plane of the triangle, it can intersect at most **one** point. If the line lies in the plane of the triangle, it can intersect along a line segment (infinitely many points).

# Chapter 12: Production TypeScript 3D Geometry Engine and the Civilizational Grand Gauntlet

> *"Mathematics is the supreme judge; from its decisions there is no appeal. But when mathematics is translated into code, every floating-point bit must be accounted for, lest an infinitesimal error bring down an entire digital universe."*  
> â€” **William Kahan**, *Father of the IEEE 754 Floating-Point Standard* (1985)

---

### Section 12.1 Engineering Specification: Performance, Memory Layout, and In-Place Mutations

In high-performance 3D software engineeringâ€”spanning real-time game engines (such as Unreal, Unity, and custom WebGPU renderers), aerospace orbital mechanics, robotic kinematic chains, and physics collision solversâ€”writing correct mathematics is only half the battle. The code must execute at **60 to 144 frames per second**, processing hundreds of thousands of vector and matrix operations every 16 milliseconds.

#### 1. The Garbage Collection (GC) Crisis
In garbage-collected runtimes like JavaScript/TypeScript (V8 engine in Node.js and Chromium):
```typescript
// NAIVE ANTI-PATTERN: Generates massive GC pressure!
function updateParticles(particles: Particle[]): void {
  for (const p of particles) {
    // Each '+' or method creates a NEW Vector3 on the heap!
    p.velocity = p.velocity.add(gravity.multiplyScalar(dt));
    p.position = p.position.add(p.velocity.multiplyScalar(dt));
  }
}
```
If a simulation updates 50,000 particles at 60 FPS, creating 4 temporary vector objects per particle generates:
$$50{,}000 \times 4 \times 60 = 12{,}000{,}000 \text{ objects/second!}$$
This floods the V8 young generation heap (Eden space), triggering full Garbage Collection pauses (stop-the-world spikes of 15â€“50 ms) every few seconds. In a game or interactive simulator, this results in catastrophic frame drops ("micro-stuttering").

#### 2. The High-Performance Paradigm: In-Place Mutation and Object Pooling
To achieve zero memory allocations in the core animation and physics loop, a production vector math library must support **in-place mutation** chaining (`addScaledVector`, `copy`, `set`), returning `this`:
```typescript
// ZERO-ALLOCATION PRODUCTION PATTERN:
p.velocity.addScaledVector(gravity, dt);
p.position.addScaledVector(p.velocity, dt);
```
Temporary scratch variables are allocated once as static module-level singletons or thread-local pools (`_scratchV0`, `_scratchV1`), never inside the per-tick loop.

#### 3. Numerical Epsilon and Machine Precision
Because IEEE 754 floating-point arithmetic contains inevitable round-off errors:
- We define $\epsilon = 10^{-7}$ for single precision (`float32`) and $\epsilon = 10^{-14}$ for double precision (`float64`).
- We avoid `Math.sqrt` wherever possible by using squared norms and squared distances (`lengthSq`, `distanceToSq`).
- We clamp all trigonometric inputs for $\arccos$ to $[-1.0, 1.0]$.
- We protect all vector normalizations against zero-length divisions.

---

### Section 12.2 Full Production TypeScript Implementation

Here is the complete, self-contained, enterprise-grade 3D Vector Geometry Engine:

```typescript
/**
 * Sovereign Master 3D Geometry Engine
 * Zero-allocation, high-performance vector mathematics for physics and rendering.
 */

export const EPSILON = 1e-7;
export const EPSILON_SQ = 1e-14;

export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // --- Assignment and Cloning ---
  public set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  public copy(v: Vector3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  public clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  // --- Basic Arithmetic (In-Place) ---
  public add(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  public addVectors(a: Vector3, b: Vector3): this {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  }

  public addScaledVector(v: Vector3, s: number): this {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }

  public sub(v: Vector3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  public subVectors(a: Vector3, b: Vector3): this {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }

  public multiplyScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  public divideScalar(s: number): this {
    if (Math.abs(s) < EPSILON) {
      this.set(0, 0, 0);
      return this;
    }
    const inv = 1.0 / s;
    this.x *= inv;
    this.y *= inv;
    this.z *= inv;
    return this;
  }

  public negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  // --- Metrics and Norms ---
  public lengthSq(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public normalize(): this {
    const lenSq = this.lengthSq();
    if (lenSq < EPSILON_SQ) {
      this.set(0, 0, 0);
      return this;
    }
    return this.multiplyScalar(1.0 / Math.sqrt(lenSq));
  }

  public distanceToSq(v: Vector3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  public distanceTo(v: Vector3): number {
    return Math.sqrt(this.distanceToSq(v));
  }

  // --- Dot, Cross, and Triple Products ---
  public dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  public cross(v: Vector3): this {
    const ax = this.x, ay = this.y, az = this.z;
    const bx = v.x, by = v.y, bz = v.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  public crossVectors(a: Vector3, b: Vector3): this {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }

  public scalarTripleProduct(b: Vector3, c: Vector3): number {
    return (
      this.x * (b.y * c.z - b.z * c.y) +
      this.y * (b.z * c.x - b.x * c.z) +
      this.z * (b.x * c.y - b.y * c.x)
    );
  }

  // --- Projections and Reflections ---
  public projectOnVector(v: Vector3): this {
    const den = v.lengthSq();
    if (den < EPSILON_SQ) {
      this.set(0, 0, 0);
      return this;
    }
    const scalar = this.dot(v) / den;
    return this.copy(v).multiplyScalar(scalar);
  }

  public projectOnPlane(planeNormal: Vector3): this {
    _scratchV0.copy(this).projectOnVector(planeNormal);
    return this.sub(_scratchV0);
  }

  public reflect(normal: Vector3): this {
    // v' = v - 2 * (v Â· n) * n
    const factor = 2.0 * this.dot(normal);
    this.x -= factor * normal.x;
    this.y -= factor * normal.y;
    this.z -= factor * normal.z;
    return this;
  }

  public angleTo(v: Vector3): number {
    const den = Math.sqrt(this.lengthSq() * v.lengthSq());
    if (den < EPSILON) return 0;
    const cosTheta = this.dot(v) / den;
    // Robust clamp against NaN
    const clamped = Math.max(-1.0, Math.min(1.0, cosTheta));
    return Math.acos(clamped);
  }

  public lerp(target: Vector3, alpha: number): this {
    this.x += (target.x - this.x) * alpha;
    this.y += (target.y - this.y) * alpha;
    this.z += (target.z - this.z) * alpha;
    return this;
  }

  public equals(v: Vector3, tolerance: number = EPSILON): boolean {
    return (
      Math.abs(this.x - v.x) <= tolerance &&
      Math.abs(this.y - v.y) <= tolerance &&
      Math.abs(this.z - v.z) <= tolerance
    );
  }
}

// Scratch allocation pool
const _scratchV0 = new Vector3();
const _scratchV1 = new Vector3();
const _scratchV2 = new Vector3();

export class Ray3 {
  public origin: Vector3;
  public direction: Vector3;

  constructor(origin: Vector3 = new Vector3(), direction: Vector3 = new Vector3(0, 0, 1)) {
    this.origin = origin.clone();
    this.direction = direction.clone().normalize();
  }

  public at(t: number, target: Vector3 = new Vector3()): Vector3 {
    return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  }
}

export class Plane3 {
  public normal: Vector3;
  public constant: number; // Ax + By + Cz + D = 0 -> constant = D

  constructor(normal: Vector3 = new Vector3(0, 1, 0), constant: number = 0) {
    this.normal = normal.clone().normalize();
    this.constant = constant;
  }

  public setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this {
    this.normal.copy(normal).normalize();
    this.constant = -point.dot(this.normal);
    return this;
  }

  public setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): this {
    _scratchV0.subVectors(b, a);
    _scratchV1.subVectors(c, a);
    this.normal.crossVectors(_scratchV0, _scratchV1).normalize();
    this.constant = -a.dot(this.normal);
    return this;
  }

  public distanceToPoint(point: Vector3): number {
    return this.normal.dot(point) + this.constant;
  }

  public projectPoint(point: Vector3, target: Vector3 = new Vector3()): Vector3 {
    const dist = this.distanceToPoint(point);
    return target.copy(point).addScaledVector(this.normal, -dist);
  }

  public intersectRay(ray: Ray3, target: Vector3 = new Vector3()): Vector3 | null {
    const denom = this.normal.dot(ray.direction);
    if (Math.abs(denom) < EPSILON) {
      return null; // Parallel to plane
    }
    const t = -(this.normal.dot(ray.origin) + this.constant) / denom;
    if (t < 0) {
      return null; // Intersection behind ray origin
    }
    return ray.at(t, target);
  }
}

export interface TriangleHitResult {
  hit: boolean;
  t: number;
  u: number;
  v: number;
  w: number;
  point: Vector3;
}

export class Triangle3 {
  public a: Vector3;
  public b: Vector3;
  public c: Vector3;

  constructor(
    a: Vector3 = new Vector3(),
    b: Vector3 = new Vector3(),
    c: Vector3 = new Vector3()
  ) {
    this.a = a.clone();
    this.b = b.clone();
    this.c = c.clone();
  }

  public getNormal(target: Vector3 = new Vector3()): Vector3 {
    _scratchV0.subVectors(this.b, this.a);
    _scratchV1.subVectors(this.c, this.a);
    return target.crossVectors(_scratchV0, _scratchV1).normalize();
  }

  public getArea(): number {
    _scratchV0.subVectors(this.b, this.a);
    _scratchV1.subVectors(this.c, this.a);
    return _scratchV2.crossVectors(_scratchV0, _scratchV1).length() * 0.5;
  }

  public getBarycentricCoordinates(
    p: Vector3,
    target: Vector3 = new Vector3()
  ): Vector3 {
    _scratchV0.subVectors(this.b, this.a);
    _scratchV1.subVectors(this.c, this.a);
    _scratchV2.subVectors(p, this.a);

    const d00 = _scratchV0.dot(_scratchV0);
    const d01 = _scratchV0.dot(_scratchV1);
    const d11 = _scratchV1.dot(_scratchV1);
    const d20 = _scratchV2.dot(_scratchV0);
    const d21 = _scratchV2.dot(_scratchV1);

    const denom = d00 * d11 - d01 * d01;
    if (Math.abs(denom) < EPSILON_SQ) {
      return target.set(0, 0, 0); // Degenerate triangle
    }

    const v = (d11 * d20 - d01 * d21) / denom;
    const w = (d00 * d21 - d01 * d20) / denom;
    const u = 1.0 - v - w;

    return target.set(u, v, w);
  }

  /**
   * Fast, minimum storage MÃ¶ller-Trumbore ray-triangle intersection algorithm.
   */
  public intersectRayMÃ¶llerTrumbore(
    ray: Ray3,
    cullBackface: boolean = true
  ): TriangleHitResult | null {
    _scratchV0.subVectors(this.b, this.a); // e1
    _scratchV1.subVectors(this.c, this.a); // e2

    const pvec = _scratchV2.crossVectors(ray.direction, _scratchV1);
    const det = _scratchV0.dot(pvec);

    if (cullBackface) {
      if (det < EPSILON) return null;
    } else {
      if (Math.abs(det) < EPSILON) return null;
    }

    const invDet = 1.0 / det;
    const tvec = new Vector3().subVectors(ray.origin, this.a); // s
    const u = tvec.dot(pvec) * invDet;
    if (u < 0.0 || u > 1.0) return null;

    const qvec = new Vector3().crossVectors(tvec, _scratchV0); // q
    const v = ray.direction.dot(qvec) * invDet;
    if (v < 0.0 || u + v > 1.0) return null;

    const t = _scratchV1.dot(qvec) * invDet;
    if (t < EPSILON) return null;

    const w = 1.0 - u - v;
    const hitPoint = ray.at(t);

    return { hit: true, t, u, v, w, point: hitPoint };
  }
}

/**
 * Robustly constructs an orthonormal basis from a single normal vector
 * (Duff et al. 2017 method: Building an Orthonormal Basis, Revisited).
 */
export function makeOrthonormalBasis(normal: Vector3): { u: Vector3; v: Vector3; w: Vector3 } {
  const w = normal.clone().normalize();
  let u = new Vector3();
  let v = new Vector3();

  // If normal is close to +/- Z axis, use Y axis as helper
  if (Math.abs(w.z) > 0.9999) {
    u.set(1, 0, 0);
  } else {
    // Sign-preserving orthogonal branch
    const sign = w.z >= 0 ? 1 : -1;
    const a = -1.0 / (sign + w.z);
    const b = w.x * w.y * a;
    u.set(1.0 + sign * w.x * w.x * a, sign * b, -sign * w.x);
    v.set(b, sign + w.y * w.y * a, -w.y);
    return { u, v, w };
  }

  u.crossVectors(new Vector3(0, 1, 0), w).normalize();
  v.crossVectors(w, u).normalize();
  return { u, v, w };
}
```

---

### Section 12.3 Automated Test Suite

```typescript
export function runVector3Tests(): boolean {
  console.log("Starting Vector3 Unit Test Suite...");

  // Test 1: Vector Norm & Normalization
  const v1 = new Vector3(3, 4, 0);
  console.assert(v1.length() === 5, "Failed length()");
  v1.normalize();
  console.assert(Math.abs(v1.length() - 1.0) < EPSILON, "Failed normalize()");

  // Test 2: Dot Product & Angle
  const vX = new Vector3(1, 0, 0);
  const vY = new Vector3(0, 1, 0);
  console.assert(vX.dot(vY) === 0, "Failed orthogonality dot");
  console.assert(Math.abs(vX.angleTo(vY) - Math.PI / 2) < EPSILON, "Failed 90 degree angle");

  // Test 3: Cross Product Right-Hand Rule
  const vZ = new Vector3().crossVectors(vX, vY);
  console.assert(vZ.equals(new Vector3(0, 0, 1)), "Failed i x j = k");

  // Test 4: Lagrange BAC-CAB Identity
  const a = new Vector3(1, 2, 3);
  const b = new Vector3(4, 5, 6);
  const c = new Vector3(7, 8, 9);
  const lhs = a.clone().cross(b.clone().cross(c));
  const rhs = b.clone().multiplyScalar(a.dot(c)).sub(c.clone().multiplyScalar(a.dot(b)));
  console.assert(lhs.equals(rhs, 1e-5), "Failed BAC-CAB identity");

  // Test 5: MÃ¶ller-Trumbore Ray-Triangle Hit
  const tri = new Triangle3(
    new Vector3(0, 0, 0),
    new Vector3(2, 0, 0),
    new Vector3(0, 2, 0)
  );
  const ray = new Ray3(new Vector3(0.5, 0.5, 5), new Vector3(0, 0, -1));
  const hit = tri.intersectRayMÃ¶llerTrumbore(ray);
  console.assert(hit !== null && hit.hit, "Failed MÃ¶ller-Trumbore hit detection");
  console.assert(Math.abs(hit!.t - 5.0) < EPSILON, "Failed hit time t");
  console.assert(Math.abs(hit!.u - 0.25) < EPSILON, "Failed hit barycentric u");
  console.assert(Math.abs(hit!.v - 0.25) < EPSILON, "Failed hit barycentric v");

  console.log("All Vector3 tests passed successfully!");
  return true;
}
```

---

### Section 12.4 The Civilizational Grand Gauntlet: Ten Multi-Step Problems

To demonstrate mastery over spatial geometry and computational vector algebra, solve the following ten complex real-world engineering problems:

1. **Problem 1: Orbital Satellite Ground Station Tracking and Horizon Tangency.**  
   A Low Earth Orbit (LEO) satellite is at position $\mathbf{r}_{\text{sat}} = (0, 4200, 5600) \text{ km}$ relative to the Earth's center. A ground communication dish is located at $\mathbf{r}_{\text{dish}} = (0, 0, 6371) \text{ km}$ (the North Pole). Assuming a spherical Earth of radius $R = 6371 \text{ km}$, find:
   - The line-of-sight elevation angle $\alpha$ of the satellite above the ground station's local horizon plane.
   - The exact minimum altitude of the line-of-sight ray above the Earth's surface to determine if the signal grazes the atmosphere.

2. **Problem 2: Stealth Fighter Radar Cross-Section (RCS) Backscattering Simulation.**  
   A stealth faceted aircraft has a triangular wing panel with vertices $A(10, -5, 0)$, $B(14, -8, 0.5)$, and $C(12, -3, 0.2) \text{ m}$. An enemy monostatic radar transmitter at $\mathbf{P}_{\text{radar}} = (2000, 5000, 1000) \text{ m}$ illuminates the aircraft.
   - Compute the outward unit normal $\hat{\mathbf{N}}$ of the panel.
   - Determine whether the reflected beam directs energy back toward the radar transmitter by computing the angular deviation between the reflection vector $\mathbf{v}_{\text{refl}}$ and the radar line-of-sight.

3. **Problem 3: Robotic 6-DOF Manipulator Inverse Kinematic Wrist Decoupling.**  
   An industrial 6-axis articulated robot has a tool center point (TCP) required at position $\mathbf{P}_{\text{TCP}} = (0.8, 0.4, 0.5) \text{ m}$ with tool pointing direction unit vector $\hat{\mathbf{a}} = \begin{bmatrix} 0.6 & 0.8 & 0 \end{bmatrix}^T$. If the tool length offset along $\hat{\mathbf{a}}$ is $d_6 = 0.15 \text{ m}$, find the exact 3D coordinates of the spherical wrist center $\mathbf{P}_{\text{wrist}} = \mathbf{P}_{\text{TCP}} - d_6 \hat{\mathbf{a}}$, and determine if it lies within the primary reach cylinder of radius $R_{\text{arm}} = 1.0 \text{ m}$.

4. **Problem 4: 3D Camera Look-At Matrix and Frustum Plane Extraction.**  
   A virtual camera is placed at $\mathbf{C} = (10, 20, 15)$, gazing toward target point $\mathbf{T} = (0, 0, 0)$, with world up reference $\mathbf{U} = (0, 0, 1)$.
   - Derive the camera's orthonormal frame $\{\hat{\mathbf{r}}, \hat{\mathbf{u}}, \hat{\mathbf{f}}\}$.
   - If the camera field of view is $\text{FOV}_v = 60^\circ$ and aspect ratio is $1.0$, find the Cartesian plane equation of the camera's Top Clipping Plane.

5. **Problem 5: Moving Sphere Continuous Collision Detection (CCD).**  
   A soccer ball of radius $R = 0.11 \text{ m}$ starts at position $\mathbf{P}_0 = (1, 2, 5)$ with constant velocity $\mathbf{v} = \begin{bmatrix} 4 \\ 2 \\ -8 \end{bmatrix} \text{ m/s}$. The ground plane is given by $x + y + 2z = 2$.
   - Find the exact time of first impact $t_{\text{impact}}$.
   - Find the center position of the sphere at impact, and the point on the ground plane where contact first occurs.

6. **Problem 6: Molecular Dynamics Dihedral Torsion Angle.**  
   In protein structural biology, a peptide backbone contains four bonded atoms: $N(0, 0, 0)$, $C_\alpha(1.46, 0, 0)$, $C(2.0, 1.42, 0)$, and $O(1.5, 2.4, 0.8) \text{ \AA}$.
   - Compute the two normal vectors $\mathbf{n}_1$ and $\mathbf{n}_2$ to the adjacent peptide planes.
   - Calculate the Ramachandran dihedral torsion angle $\psi \in [-\pi, \pi]$ using the signed scalar triple product formulation.

7. **Problem 7: Rigid Body Contact Manifold Generation via Polygonal Clipping.**  
   Two colliding boxes in a physics engine have incident face edges intersecting a reference contact plane $z = 0$. A line segment on the colliding face connects $P_1(2, 3, 0.4)$ to $P_2(5, -1, -0.2)$.
   - Find the exact point $P_{\text{clip}}$ where the segment pierces the contact plane.
   - Compute the penetration depth of $P_2$ into the ground plane.

8. **Problem 8: Atmospheric Refraction and Vector Ray Marching.**  
   A light ray enters a stratified atmosphere where the refractive index varies with height: $n(z) = 1.0 + 0.0003 e^{-z / 8000}$. Using Snell's law in vector form $\mathbf{d}' = \frac{n_1}{n_2}\mathbf{d} + \left( \frac{n_1}{n_2}\cos\theta_1 - \sqrt{1 - \left(\frac{n_1}{n_2}\right)^2(1 - \cos^2\theta_1)} \right)\hat{\mathbf{n}}$, calculate the refracted direction after traveling through a horizontal boundary layer with normal $\hat{\mathbf{n}} = (0, 0, 1)$.

9. **Problem 9: Gyroscopic Torque and Precession Vector Dynamics.**  
   A heavy flywheel of mass $M = 50 \text{ kg}$ and radius $R = 0.4 \text{ m}$ spins about its horizontal axle with angular velocity $\boldsymbol{\omega} = \begin{bmatrix} 0 \\ 300 \\ 0 \end{bmatrix} \text{ rad/s}$. The axle is supported at a pivot $L = 0.5 \text{ m}$ from the center of mass. Gravity acts along $-\mathbf{k}$ ($g = 9.81 \text{ m/s}^2$).
   - Compute the angular momentum vector $\mathbf{L} = I \boldsymbol{\omega}$ (where $I = \frac{1}{2} M R^2$).
   - Compute the gravitational torque vector $\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}_g$.
   - Calculate the steady-state precession angular velocity vector $\boldsymbol{\Omega}_p$ around the vertical axis.

10. **Problem 10: Photorealistic Path Tracing with Normal Interpolation and Roughness Mapping.**  
    A ray from a virtual camera strikes a triangular mesh facet at barycentric coordinates $u = 0.3, v = 0.4$. The three vertex positions are $V_0(0, 0, 0)$, $V_1(1, 0, 0)$, $V_2(0, 1, 0)$ with vertex normals $\hat{\mathbf{n}}_0 = (0, 0, 1), \hat{\mathbf{n}}_1 = (0.2, 0, 0.98), \hat{\mathbf{n}}_2 = (0, 0.2, 0.98)$.
    - Compute the interpolated normal $\hat{\mathbf{n}}_{\text{geom}}$.
    - If a microfacet roughness perturbation adds $\Delta \mathbf{n} = \begin{bmatrix} 0.05 & -0.05 & 0 \end{bmatrix}^T$, re-normalize and compute the specular reflection vector for incoming light direction $\mathbf{L} = \begin{bmatrix} 0.5 & 0.5 & 0.7071 \end{bmatrix}^T$.

---

### Section 12.5 Full Analytical and Computational Solutions for All Ten Gauntlet Problems

#### Solution to Problem 1: Orbital Satellite Ground Station Tracking
1. **Displacement Vector:**
   $$\mathbf{d} = \mathbf{r}_{\text{sat}} - \mathbf{r}_{\text{dish}} = \begin{bmatrix} 0 \\ 4200 \\ 5600 \end{bmatrix} - \begin{bmatrix} 0 \\ 0 \\ 6371 \end{bmatrix} = \begin{bmatrix} 0 \\ 4200 \\ -771 \end{bmatrix} \text{ km}$$
2. **Local Horizon Normal at North Pole:**
   The ground dish is at $(0, 0, 6371)$, so the local vertical (zenith) unit vector is:
   $$\hat{\mathbf{n}}_{\text{zenith}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   The horizontal tangent plane to the Earth at the North Pole is $z = 6371$.
3. **Elevation Angle $\alpha$ Above Horizon:**
   The angle $\theta_z$ between the line of sight $\mathbf{d}$ and zenith $\hat{\mathbf{n}}_{\text{zenith}}$ is:
   $$\mathbf{d} \cdot \hat{\mathbf{n}}_{\text{zenith}} = -771 \text{ km}$$
   $$\|\mathbf{d}\| = \sqrt{0^2 + 4200^2 + (-771)^2} = \sqrt{17640000 + 594441} = \sqrt{18234441} \approx 4270.18 \text{ km}$$
   $$\cos\theta_z = \frac{-771}{4270.18} \approx -0.180555 \implies \theta_z \approx 100.4^\circ$$
   The elevation angle above the horizontal plane is:
   $$\alpha = 90^\circ - \theta_z = 90^\circ - 100.4^\circ = -10.4^\circ$$
   Since $\alpha = -10.4^\circ < 0^\circ$, the satellite is **below the local horizon**!
4. **Line-of-Sight Distance to Earth's Center:**
   Ray line: $\mathbf{r}(t) = \mathbf{r}_{\text{dish}} + t \hat{\mathbf{d}}$ where $\hat{\mathbf{d}} = \frac{1}{4270.18} \begin{bmatrix} 0 \\ 4200 \\ -771 \end{bmatrix} = \begin{bmatrix} 0 \\ 0.983565 \\ -0.180555 \end{bmatrix}$.
   Closest point of approach to Earth's center $(0, 0, 0)$:
   $$t^* = -\mathbf{r}_{\text{dish}} \cdot \hat{\mathbf{d}} = -(6371)(-0.180555) = 1150.32 \text{ km}$$
   $$\mathbf{r}(t^*) = \begin{bmatrix} 0 \\ 0 \\ 6371 \end{bmatrix} + 1150.32 \begin{bmatrix} 0 \\ 0.983565 \\ -0.180555 \end{bmatrix} = \begin{bmatrix} 0 \\ 1131.41 \\ 6163.29 \end{bmatrix}$$
   Distance to center:
   $$\|\mathbf{r}(t^*)\| = \sqrt{1131.41^2 + 6163.29^2} = \sqrt{1280089 + 37986144} = \sqrt{39266233} \approx 6266.28 \text{ km}$$
   Altitude relative to Earth radius $R = 6371 \text{ km}$:
   $$h_{\min} = 6266.28 - 6371 = -104.72 \text{ km}$$
**Conclusion:** The line-of-sight passes $104.7 \text{ km}$ **underground**. The Earth completely blocks the signal.

---

#### Solution to Problem 2: Stealth Fighter Radar Cross-Section
1. **Edge Vectors:**
   $$\mathbf{e}_1 = B - A = \begin{bmatrix} 14 - 10 \\ -8 - (-5) \\ 0.5 - 0 \end{bmatrix} = \begin{bmatrix} 4 \\ -3 \\ 0.5 \end{bmatrix}$$
   $$\mathbf{e}_2 = C - A = \begin{bmatrix} 12 - 10 \\ -3 - (-5) \\ 0.2 - 0 \end{bmatrix} = \begin{bmatrix} 2 \\ 2 \\ 0.2 \end{bmatrix}$$
2. **Cross Product:**
   $$\mathbf{N} = \mathbf{e}_1 \times \mathbf{e}_2 = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 4 & -3 & 0.5 \\ 2 & 2 & 0.2 \end{vmatrix}$$
   $$N_x = (-3)(0.2) - (0.5)(2) = -0.6 - 1.0 = -1.6$$
   $$N_y = -((4)(0.2) - (0.5)(2)) = -(0.8 - 1.0) = +0.2$$
   $$N_z = (4)(2) - (-3)(2) = 8 + 6 = 14.0$$
   $$\mathbf{N} = \begin{bmatrix} -1.6 \\ 0.2 \\ 14.0 \end{bmatrix}$$
   Normalize:
   $$\|\mathbf{N}\| = \sqrt{(-1.6)^2 + 0.2^2 + 14.0^2} = \sqrt{2.56 + 0.04 + 196} = \sqrt{198.6} \approx 14.09255$$
   $$\hat{\mathbf{N}} \approx \begin{bmatrix} -0.1135 \\ 0.0142 \\ 0.9934 \end{bmatrix}$$
3. **Radar Direction:**
   Panel centroid $\mathbf{P}_{\text{panel}} \approx \frac{A+B+C}{3} = (12, -5.33, 0.23)$.
   Displacement to radar $\mathbf{R} = \mathbf{P}_{\text{radar}} - \mathbf{P}_{\text{panel}} \approx \begin{bmatrix} 1988 \\ 5005 \\ 1000 \end{bmatrix}$.
   $$\|\mathbf{R}\| \approx \sqrt{1988^2 + 5005^2 + 1000^2} \approx 5477.4 \text{ m}$$
   $$\hat{\mathbf{L}} = \frac{\mathbf{R}}{\|\mathbf{R}\|} \approx \begin{bmatrix} 0.3630 \\ 0.9137 \\ 0.1826 \end{bmatrix}$$
4. **Incidence Angle with Facet Normal:**
   $$\cos\theta = \hat{\mathbf{N}} \cdot \hat{\mathbf{L}} = (-0.1135)(0.3630) + (0.0142)(0.9137) + (0.9934)(0.1826)$$
   $$= -0.0412 + 0.0130 + 0.1814 = 0.1532$$
   $$\theta = \arccos(0.1532) \approx 81.18^\circ$$
Because $\theta = 81.2^\circ \ne 0^\circ$, the incident radar beam is deflected away at an angle of $162.4^\circ$ relative to the incoming line of sight!
**Conclusion:** Zero direct specular energy returns to the receiver. The faceted stealth shaping successfully achieves radar cloaking.

---

#### Solution to Problem 3: Robotic 6-DOF Wrist Decoupling
1. **Wrist Center Coordinates:**
   $$\mathbf{P}_{\text{wrist}} = \mathbf{P}_{\text{TCP}} - d_6 \hat{\mathbf{a}} = \begin{bmatrix} 0.8 \\ 0.4 \\ 0.5 \end{bmatrix} - 0.15 \begin{bmatrix} 0.6 \\ 0.8 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.8 - 0.09 \\ 0.4 - 0.12 \\ 0.5 - 0 \end{bmatrix} = \begin{bmatrix} 0.71 \\ 0.28 \\ 0.50 \end{bmatrix} \text{ m}$$
2. **Radial Distance from Robot Base Z-Axis:**
   $$R_{xy} = \sqrt{x_{\text{wrist}}^2 + y_{\text{wrist}}^2} = \sqrt{0.71^2 + 0.28^2} = \sqrt{0.5041 + 0.0784} = \sqrt{0.5825} \approx 0.7632 \text{ m}$$
3. **Total Spherical Reach from Robot Base $(0, 0, 0)$:**
   $$\|\mathbf{P}_{\text{wrist}}\| = \sqrt{0.71^2 + 0.28^2 + 0.50^2} = \sqrt{0.5825 + 0.25} = \sqrt{0.8325} \approx 0.9124 \text{ m}$$
4. **Reach Evaluation:**
   Since $\|\mathbf{P}_{\text{wrist}}\| = 0.9124 \text{ m} \le R_{\text{arm}} = 1.0 \text{ m}$, the target wrist position is **within the robot's reachable workspace**.

---

#### Solution to Problem 4: Camera Look-At and Frustum Plane
1. **Forward Viewing Direction (from eye to target):**
   $$\mathbf{d} = \mathbf{T} - \mathbf{C} = \begin{bmatrix} 0 - 10 \\ 0 - 20 \\ 0 - 15 \end{bmatrix} = \begin{bmatrix} -10 \\ -20 \\ -15 \end{bmatrix} = -5 \begin{bmatrix} 2 \\ 4 \\ 3 \end{bmatrix}$$
   $$\|\mathbf{d}\| = 5\sqrt{2^2 + 4^2 + 3^2} = 5\sqrt{4 + 16 + 9} = 5\sqrt{29} \approx 26.9258$$
   The camera $z$-axis in right-handed convention points backward:
   $$\hat{\mathbf{z}}_{\text{cam}} = -\frac{\mathbf{d}}{\|\mathbf{d}\|} = \frac{1}{\sqrt{29}} \begin{bmatrix} 2 \\ 4 \\ 3 \end{bmatrix}$$
2. **Right Vector $\hat{\mathbf{r}}$:**
   World Up $\mathbf{U} = \begin{bmatrix} 0 & 0 & 1 \end{bmatrix}^T$.
   $$\mathbf{r} = \mathbf{U} \times \hat{\mathbf{z}}_{\text{cam}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \frac{1}{\sqrt{29}} \begin{bmatrix} 2 \\ 4 \\ 3 \end{bmatrix} = \frac{1}{\sqrt{29}} \begin{bmatrix} -4 \\ 2 \\ 0 \end{bmatrix}$$
   Normalize:
   $$\|\mathbf{r}\| = \frac{\sqrt{(-4)^2 + 2^2}}{\sqrt{29}} = \frac{\sqrt{20}}{\sqrt{29}} \implies \hat{\mathbf{r}} = \frac{1}{\sqrt{20}} \begin{bmatrix} -4 \\ 2 \\ 0 \end{bmatrix} = \frac{1}{\sqrt{5}} \begin{bmatrix} -2 \\ 1 \\ 0 \end{bmatrix}$$
3. **Camera True Up Vector $\hat{\mathbf{u}}$:**
   $$\hat{\mathbf{u}} = \hat{\mathbf{z}}_{\text{cam}} \times \hat{\mathbf{r}} = \frac{1}{\sqrt{29 \times 5}} \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & 4 & 3 \\ -2 & 1 & 0 \end{vmatrix} = \frac{1}{\sqrt{145}} \begin{bmatrix} -3 \\ -6 \\ 10 \end{bmatrix}$$
4. **Top Frustum Plane:**
   For vertical $\text{FOV}_v = 60^\circ$, half-angle $\theta_{\text{half}} = 30^\circ$.
   The normal to the top clipping plane in camera space is tilted down by $30^\circ$:
   $$\mathbf{n}_{\text{top, cam}} = -\cos(30^\circ) \hat{\mathbf{u}}_{\text{cam}} - \sin(30^\circ) \hat{\mathbf{z}}_{\text{cam}}$$
   Transforming to world coordinates and ensuring it passes through eye $\mathbf{C}$ yields the exact Cartesian plane equation $A x + B y + C z + D = 0$.

---

#### Solution to Problem 5: Moving Sphere Continuous Collision Detection
1. **Plane Normal and Metric:**
   Plane $\Pi: x + y + 2z - 2 = 0$.
   Normal $\mathbf{n} = \begin{bmatrix} 1 \\ 1 \\ 2 \end{bmatrix}$, $\|\mathbf{n}\| = \sqrt{1^2 + 1^2 + 2^2} = \sqrt{6}$.
   Unit normal: $\hat{\mathbf{n}} = \frac{1}{\sqrt{6}} \begin{bmatrix} 1 \\ 1 \\ 2 \end{bmatrix}$.
2. **Sphere Center Trajectory:**
   $$\mathbf{C}(t) = \mathbf{P}_0 + t \mathbf{v} = \begin{bmatrix} 1 \\ 2 \\ 5 \end{bmatrix} + t \begin{bmatrix} 4 \\ 2 \\ -8 \end{bmatrix}$$
3. **Condition for Surface Impact:**
   The sphere touches the plane when the distance from its center to the plane equals its radius $R = 0.11 \text{ m}$:
   $$\frac{\mathbf{n} \cdot \mathbf{C}(t) + D}{\|\mathbf{n}\|} = R = 0.11$$
   $$\mathbf{n} \cdot \mathbf{C}(t) - 2 = 0.11 \sqrt{6} \approx 0.11 \times 2.44949 = 0.26944$$
   $$\mathbf{n} \cdot \mathbf{C}(t) = 2.26944$$
4. **Evaluate Dot Product:**
   $$\mathbf{n} \cdot \mathbf{C}(t) = (1)(1 + 4t) + (1)(2 + 2t) + (2)(5 - 8t) = (1 + 2 + 10) + (4 + 2 - 16)t = 13 - 10t$$
   Equate:
   $$13 - 10t = 2.26944 \implies 10t = 13 - 2.26944 = 10.73056$$
   $$t_{\text{impact}} \approx 1.07306 \text{ seconds}$$
5. **Impact Position:**
   $$\mathbf{C}(1.073) = \begin{bmatrix} 1 + 4(1.073) \\ 2 + 2(1.073) \\ 5 - 8(1.073) \end{bmatrix} = \begin{bmatrix} 5.292 \\ 4.146 \\ -3.584 \end{bmatrix} \text{ m}$$
   Contact point on ground plane:
   $$\mathbf{P}_{\text{contact}} = \mathbf{C}(t_{\text{impact}}) - R \hat{\mathbf{n}} = \mathbf{C}(1.073) - 0.11 \frac{1}{\sqrt{6}} \begin{bmatrix} 1 \\ 1 \\ 2 \end{bmatrix} = \begin{bmatrix} 5.247 \\ 4.101 \\ -3.674 \end{bmatrix} \text{ m}$$

---

#### Solution to Problem 6: Molecular Dynamics Dihedral Torsion
1. **Bond Vectors:**
   $$\mathbf{b}_1 = C_\alpha - N = \begin{bmatrix} 1.46 \\ 0 \\ 0 \end{bmatrix}$$
   $$\mathbf{b}_2 = C - C_\alpha = \begin{bmatrix} 2.0 - 1.46 \\ 1.42 - 0 \\ 0 - 0 \end{bmatrix} = \begin{bmatrix} 0.54 \\ 1.42 \\ 0 \end{bmatrix}$$
   $$\mathbf{b}_3 = O - C = \begin{bmatrix} 1.5 - 2.0 \\ 2.4 - 1.42 \\ 0.8 - 0 \end{bmatrix} = \begin{bmatrix} -0.50 \\ 0.98 \\ 0.80 \end{bmatrix}$$
2. **Plane Normals:**
   $$\mathbf{n}_1 = \mathbf{b}_1 \times \mathbf{b}_2 = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1.46 & 0 & 0 \\ 0.54 & 1.42 & 0 \end{vmatrix} = (1.46)(1.42) \mathbf{k} = 2.0732 \mathbf{k} \implies \hat{\mathbf{n}}_1 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$
   $$\mathbf{n}_2 = \mathbf{b}_2 \times \mathbf{b}_3 = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0.54 & 1.42 & 0 \\ -0.50 & 0.98 & 0.80 \end{vmatrix}$$
   $$n_{2x} = (1.42)(0.80) - 0 = 1.136$$
   $$n_{2y} = -(0.54 \times 0.80 - 0) = -0.432$$
   $$n_{2z} = (0.54)(0.98) - (1.42)(-0.50) = 0.5292 + 0.7100 = 1.2392$$
   $$\hat{\mathbf{n}}_2 = \frac{1}{\sqrt{1.136^2 + (-0.432)^2 + 1.2392^2}} \begin{bmatrix} 1.136 \\ -0.432 \\ 1.2392 \end{bmatrix} = \frac{1}{1.7358} \begin{bmatrix} 1.136 \\ -0.432 \\ 1.2392 \end{bmatrix} \approx \begin{bmatrix} 0.6544 \\ -0.2489 \\ 0.7139 \end{bmatrix}$$
3. **Dihedral Angle $\psi$:**
   $$\cos\psi = \hat{\mathbf{n}}_1 \cdot \hat{\mathbf{n}}_2 = 0.7139$$
   $$\psi = \arccos(0.7139) \approx 0.7758 \text{ rad} \approx 44.45^\circ$$
   The sign is confirmed positive via scalar triple product $[\hat{\mathbf{n}}_1, \hat{\mathbf{n}}_2, \frac{\mathbf{b}_2}{\|\mathbf{b}_2\|}] > 0$.

---

#### Solution to Problem 7: Rigid Body Contact Manifold Clipping
1. **Segment Piercing Parameter $t^*$:**
   Line equation: $\mathbf{r}(t) = P_1 + t(P_2 - P_1)$.
   $z(t) = 0.4 + t(-0.2 - 0.4) = 0.4 - 0.6t = 0$.
   $$0.6t = 0.4 \implies t^* = \frac{0.4}{0.6} = \frac{2}{3} \approx 0.6667$$
2. **Clipping Contact Point:**
   $$P_{\text{clip}} = P_1 + \frac{2}{3}(P_2 - P_1) = \begin{bmatrix} 2 + \frac{2}{3}(5 - 2) \\ 3 + \frac{2}{3}(-1 - 3) \\ 0.4 + \frac{2}{3}(-0.6) \end{bmatrix} = \begin{bmatrix} 2 + 2 \\ 3 - 8/3 \\ 0 \end{bmatrix} = \begin{bmatrix} 4.0 \\ 0.3333 \\ 0.0 \end{bmatrix}$$
3. **Penetration Depth of $P_2$:**
   Since $z = 0$ is the ground surface and $P_2$ has $z = -0.2$:
   $$\text{depth} = 0 - (-0.2) = 0.2 \text{ m} = 20.0 \text{ cm}$$

---

#### Solution to Problem 8: Atmospheric Refraction Vector Marching
1. **Given:** Layer normal $\hat{\mathbf{n}} = (0, 0, 1)$, ratio $\frac{n_1}{n_2} = \mu$.
2. Substituting into Snell's vector formula produces the exact refracted unit direction vector preserving Snell's invariant $n_1 \sin\theta_1 = n_2 \sin\theta_2$ in 3D space.

---

#### Solution to Problem 9: Gyroscopic Torque and Precession
1. **Moment of Inertia:**
   $$I = \frac{1}{2} M R^2 = \frac{1}{2}(50)(0.4^2) = 25 \times 0.16 = 4.0 \text{ kg}\cdot\text{m}^2$$
2. **Angular Momentum:**
   $$\mathbf{L} = I \boldsymbol{\omega} = 4.0 \begin{bmatrix} 0 \\ 300 \\ 0 \end{bmatrix} = \begin{bmatrix} 0 \\ 1200 \\ 0 \end{bmatrix} \text{ kg}\cdot\text{m}^2/\text{s}$$
   $$\|\mathbf{L}\| = 1200 \text{ N}\cdot\text{m}\cdot\text{s}$$
3. **Gravitational Torque:**
   Displacement to center of mass along axle ($y$-axis): $\mathbf{r} = \begin{bmatrix} 0 \\ 0.5 \\ 0 \end{bmatrix}$.
   Gravity force: $\mathbf{F}_g = \begin{bmatrix} 0 \\ 0 \\ -M g \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ -50 \times 9.81 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ -490.5 \end{bmatrix} \text{ N}$.
   $$\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}_g = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 0 & 0.5 & 0 \\ 0 & 0 & -490.5 \end{vmatrix} = \mathbf{i}((0.5)(-490.5)) = -245.25 \mathbf{i} = \begin{bmatrix} -245.25 \\ 0 \\ 0 \end{bmatrix} \text{ N}\cdot\text{m}$$
4. **Precession Angular Velocity:**
   $$\boldsymbol{\tau} = \boldsymbol{\Omega}_p \times \mathbf{L}$$
   Since $\boldsymbol{\Omega}_p$ acts around vertical axis $z$ ($\boldsymbol{\Omega}_p = \Omega_p \mathbf{k}$):
   $$\Omega_p \mathbf{k} \times (L \mathbf{j}) = -\Omega_p L \mathbf{i}$$
   Equating with $\boldsymbol{\tau} = -245.25 \mathbf{i}$:
   $$-\Omega_p (1200) = -245.25 \implies \Omega_p = \frac{245.25}{1200} \approx 0.204375 \text{ rad/s}$$
   In RPM:
   $$\Omega_{p, \text{rpm}} = 0.204375 \times \frac{60}{2\pi} \approx 1.95 \text{ RPM}$$
The gyroscope precesses steadily around the vertical axis at approximately $1.95$ revolutions per minute.

---

#### Solution to Problem 10: Photorealistic Path Tracing Normal Interpolation
1. **Compute Third Barycentric Weight:**
   $$w = 1 - u - v = 1 - 0.3 - 0.4 = 0.3$$
2. **Interpolate Geometric Normal:**
   $$\mathbf{N}_{\text{interp}} = w \hat{\mathbf{n}}_0 + u \hat{\mathbf{n}}_1 + v \hat{\mathbf{n}}_2$$
   $$= 0.3 \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} + 0.3 \begin{bmatrix} 0.2 \\ 0 \\ 0.98 \end{bmatrix} + 0.4 \begin{bmatrix} 0 \\ 0.2 \\ 0.98 \end{bmatrix} = \begin{bmatrix} 0.06 \\ 0.08 \\ 0.3 + 0.294 + 0.392 \end{bmatrix} = \begin{bmatrix} 0.06 \\ 0.08 \\ 0.986 \end{bmatrix}$$
3. **Apply Roughness Perturbation $\Delta \mathbf{n}$:**
   $$\mathbf{N}_{\text{perturbed}} = \begin{bmatrix} 0.06 \\ 0.08 \\ 0.986 \end{bmatrix} + \begin{bmatrix} 0.05 \\ -0.05 \\ 0 \end{bmatrix} = \begin{bmatrix} 0.11 \\ 0.03 \\ 0.986 \end{bmatrix}$$
4. **Normalize Shading Normal:**
   $$\|\mathbf{N}_{\text{perturbed}}\| = \sqrt{0.11^2 + 0.03^2 + 0.986^2} = \sqrt{0.0121 + 0.0009 + 0.972196} = \sqrt{0.985196} \approx 0.99257$$
   $$\hat{\mathbf{n}}_{\text{shading}} \approx \begin{bmatrix} 0.1108 \\ 0.0302 \\ 0.9934 \end{bmatrix}$$
5. **Compute Specular Reflection Vector:**
   Incoming light $\mathbf{L} = \begin{bmatrix} 0.5 \\ 0.5 \\ 0.7071 \end{bmatrix}$.
   $$\mathbf{L} \cdot \hat{\mathbf{n}}_{\text{shading}} = (0.5)(0.1108) + (0.5)(0.0302) + (0.7071)(0.9934) = 0.0554 + 0.0151 + 0.7024 = 0.7729$$
   $$\mathbf{R} = 2(\mathbf{L} \cdot \hat{\mathbf{n}}_{\text{shading}})\hat{\mathbf{n}}_{\text{shading}} - \mathbf{L}$$
   $$= 2(0.7729)\begin{bmatrix} 0.1108 \\ 0.0302 \\ 0.9934 \end{bmatrix} - \begin{bmatrix} 0.5 \\ 0.5 \\ 0.7071 \end{bmatrix} = 1.5458 \begin{bmatrix} 0.1108 \\ 0.0302 \\ 0.9934 \end{bmatrix} - \begin{bmatrix} 0.5 \\ 0.5 \\ 0.7071 \end{bmatrix}$$
   $$\mathbf{R} \approx \begin{bmatrix} 0.1713 - 0.5 \\ 0.0467 - 0.5 \\ 1.5356 - 0.7071 \end{bmatrix} = \begin{bmatrix} -0.3287 \\ -0.4533 \\ 0.8285 \end{bmatrix}$$
   Verification of reflection unit norm:
   $$\|\mathbf{R}\| = \sqrt{(-0.3287)^2 + (-0.4533)^2 + 0.8285^2} = \sqrt{0.1080 + 0.2055 + 0.6864} = \sqrt{0.9999} \approx 1.000 \quad \blacksquare$$

The 3D vector physics and geometry foundations of modern computer graphics and scientific simulation are complete.

