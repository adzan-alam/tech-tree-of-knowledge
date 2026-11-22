# Chapter 2: The Geometry of 3D Space — Coordinate Frames, Octants, and Projections

> *"Space is an ocean with three independent tides: one that carries you forward, one that shifts you sideways, and one that lifts you toward the heavens. To navigate without error, you must know in which octant your vessel sails."*  
> — **Sir William Rowan Hamilton, Lectures on Quaternions (1853)**

---

## 2.1 Slicing the Universe: The Three Fundamental Coordinate Planes

In two dimensions, a single linear equation with one variable missing—such as $x = 0$ or $y = 0$—defines a one-dimensional coordinate line (the $y$-axis or $x$-axis, respectively). 

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
                          │       / yz-plane (x = 0)
                          │      /
                          │     /
       xz-plane (y = 0)   │    /
              \           │   /
               \          │  /
                \         │ /
  ────────────────────────┼──────────────────────── +y
                         /│
                        / │          \
                       /  │           \ xy-plane (z = 0)
                      /   │
                     /    │
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
                         /│\
                        / │ \
                       /  │  \
                      /   │   \
                     /    │    \
                    /     │     \
                   *      │      *
              p_xz =      │    p_yz = (0, y, z)
              (x, 0, z)   │
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
                  │                                          │      * p = (r, theta, phi)
                  │      * p = (r, theta, z)                 │     /
                  │     /│                                   │    /
                  │    / │ z                                 │phi/ rho
                  │ r /  │                                   │  /
                  │  /   │                                   │ /
                  └──┼───┼──────── +y                        └──┼───────────── +y
                 /   \   │                                  /  /
                / theta\ │                                 /  /
               /─────────┘ (r, theta, 0)                  /  / theta
              /                                          /──┘
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

### Exercise 2.1 (Elementary — Octant Classification of 8 Test Points)
Classify each of the following points into its proper Octant (I through VIII):  
(a) $(1, 2, 3)$, (b) $(-3, 4, 1)$, (c) $(-5, -2, 8)$, (d) $(4, -7, 2)$,  
(e) $(9, 1, -6)$, (f) $(-2, 8, -4)$, (g) $(-1, -1, -1)$, (h) $(5, -3, -9)$.

### Exercise 2.2 (Elementary — Orthographic Projection Coordinates)
A spatial point $\mathbf{p} = (-12, 18, 30)$ is projected orthogonally:  
(a) Onto the $xy$-plane.  
(b) Onto the $xz$-plane.  
(c) Onto the $yz$-plane.  
(d) Onto the $y$-axis.  
State the coordinates of each resulting point.

### Exercise 2.3 (Intermediate — Cylindrical to Cartesian Transformation)
A radar station reports a drone at cylindrical coordinates $r = 200\text{ m}$, $\theta = 150^\circ$, $z = 75\text{ m}$. Compute the exact Cartesian coordinates $(x, y, z)$ in meters.

### Exercise 2.4 (Intermediate — Cartesian to Spherical Transformation with `atan2`)
A target is located at Cartesian coordinates $\mathbf{p} = (0, -4, 4\sqrt{3})$. Compute its spherical coordinates $(\rho, \theta, \phi)$ with $\theta \in (-\pi, \pi]$ and $\phi \in [0, \pi]$.

### Exercise 2.5 (Intermediate — Orthogonal Projection Area of a Rectangle)
A flat rectangular signboard in 3D has corners at $(0, 0, 0)$, $(4, 0, 3)$, $(4, 5, 3)$, and $(0, 5, 0)$.  
(a) Find the true 3D area of the signboard.  
(b) Find the area of its orthogonal shadow on the $xy$-plane.

### Exercise 2.6 (Advanced — Octree Spatial Hash Key Generation)
A physics engine defines a localized octree around an origin with half-width $W = 64$. Given a point $\mathbf{p} = (-22.5, 41.0, -12.0)$, write the mathematical expressions for:  
(a) Normalizing the point to the unit cube $[0, 1]^3$.  
(b) Determining the depth-1 child index ($0$ to $7$).  
(c) Determining the depth-2 grandchild sub-octant index.

### Exercise 2.7 (Advanced — Volumetric Jacobian Derivation for Cylindrical Coordinates)
Show by computing the determinant of the Jacobian matrix:
$$\mathbf{J} = \begin{bmatrix} \frac{\partial x}{\partial r} & \frac{\partial x}{\partial \theta} & \frac{\partial x}{\partial z} \\ \frac{\partial y}{\partial r} & \frac{\partial y}{\partial \theta} & \frac{\partial y}{\partial z} \\ \frac{\partial z}{\partial r} & \frac{\partial z}{\partial \theta} & \frac{\partial z}{\partial z} \end{bmatrix}$$
that the cylindrical volume element is $dV = r \, dr \, d\theta \, dz$.

### Exercise 2.8 (Advanced — Spherical Coordinate Singularity at the Poles)
Explain mathematically why spherical coordinates possess a coordinate singularity (gimbal lock equivalent) at $\phi = 0$ (the North Pole) and $\phi = \pi$ (the South Pole), and what happens to the azimuthal angle $\theta$ at these points.

### Exercise 2.9 (Master — Orthographic Projection Matrix & Shadow Deformation)
Let sunlight fall along the direction $\mathbf{L} = (1, 1, -2)$. Find the oblique parallel shadow cast by the point $\mathbf{p} = (4, 6, 10)$ onto the ground plane $z = 0$.

### Exercise 2.10 (Master — Spatial Trajectory under Rotating Cylindrical Reference Frame)
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

Now that the macroscopic layout of 3D space is clear, we must turn to the internal vector algebra that governs all motion and interaction within it. In **Chapter 3: The 3D Vector Anatomy — Basis Vectors, Components, and the Spatial Norm**, we will dissect 3D arrows, derive the 3D Euclidean norm via double-Pythagoras, introduce direction cosines, and formulate floating-point safety principles for high-performance physics engines.
