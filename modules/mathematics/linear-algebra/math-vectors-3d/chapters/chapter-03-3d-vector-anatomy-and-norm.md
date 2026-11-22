# Chapter 3: The 3D Vector Anatomy — Basis Vectors, Components, and the Spatial Norm

> *"Numbers are the letters of the alphabet of science; but vectors are the words, sentences, and paragraphs that describe the physical cosmos. In three dimensions, an arrow is the complete sentence of motion."*  
> — **Oliver Heaviside, Electromagnetic Theory (1893)**

---

## 3.1 The Standard Canonical Basis of $\mathbb{R}^3$

In two-dimensional vector algebra, any arrow in the plane can be decomposed into a horizontal component and a vertical component using the standard unit basis vectors $\mathbf{i} = (1, 0)$ and $\mathbf{j} = (0, 1)$. 

In three-dimensional Euclidean space ($\mathbb{R}^3$), every vector requires three mutually perpendicular reference vectors to span the volume. The canonical standard basis consists of three unit-length vectors directed along the positive $x$-, $y$-, and $z$-axes:

$$\mathbf{i} = \mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}, \quad \mathbf{j} = \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}, \quad \mathbf{k} = \mathbf{e}_3 = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$$

```
                         +z
                          │
                          │   k = (0, 0, 1)
                          *
                          │
                          │
                          └───*───────────── +y
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
                          │
                          │          p = (x, y, z)
                          │         *
                          │        /│
                          │       / │
                          │   ||v|| │ z
                          │     /   │
                          │    /    │
                          └───┼─────┼────────── +y
                         /   /      │
                        /   / d_xy  │
                       /   *────────┘  Projection: (x, y, 0)
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

Whenever we only need to compare distances—such as testing whether two spherical bodies of radii $r_1, r_2$ are colliding:
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
                          │       / v
                          │ gamma/
                          │     /
                          │    /
                          │   / beta
                          └──┼─────── +y
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

### Exercise 3.1 (Elementary — Magnitude and Unit Vector of a Spatial Diagonal)
A room has dimensions $\Delta x = 6\text{ m}$, $\Delta y = 9\text{ m}$, $\Delta z = 2\text{ m}$. Define the diagonal displacement vector $\mathbf{v} = (6, 9, 2)$.  
(a) Compute the exact magnitude $\|\mathbf{v}\|$.  
(b) Compute the unit direction vector $\hat{\mathbf{v}}$.

### Exercise 3.2 (Elementary — Direction Cosine Validation)
A vector has direction angles $\alpha = 45^\circ$ and $\beta = 60^\circ$.  
(a) Find the two possible values for the third direction angle $\gamma$.  
(b) If the vector points toward the lower deck ($v_z < 0$), state the unique value of $\gamma$.

### Exercise 3.3 (Intermediate — Linear Independence of Three 3D Vectors)
Determine whether the three vectors $\mathbf{u} = (1, 2, 3)$, $\mathbf{v} = (2, -1, 4)$, and $\mathbf{w} = (3, 1, 7)$ are linearly independent in $\mathbb{R}^3$. Show your derivation clearly.

### Exercise 3.4 (Intermediate — Reconstructing a Force Vector from Sensor Metrics)
A robotic tension sensor measures a cable force of magnitude $\|\mathbf{T}\| = 750\text{ N}$. The cable is directed such that $\cos \alpha = 0.6$ and $\cos \beta = -0.48$. Given that the tension pulls upward along positive $z$:  
(a) Compute $\cos \gamma$.  
(b) Write out the force vector $\mathbf{T} = (T_x, T_y, T_z)$ in component form.

### Exercise 3.5 (Intermediate — Broadphase Proximity Query via Squared Distances)
A point-defense laser system tracks three incoming debris targets relative to the origin $(0, 0, 0)$:  
$\mathbf{T}_1 = (12, 16, 21)$, $\mathbf{T}_2 = (9, 22, 14)$, $\mathbf{T}_3 = (15, 12, 20)$.  
Using squared Euclidean norms exclusively (no square roots), identify which target is closest to the defense station.

### Exercise 3.6 (Advanced — Double-Pythagoras Metric Derivation)
Using vector algebra and the metric tensor of Euclidean space $\mathbf{g} = \mathbf{I}_3$, prove that the distance function $d(\mathbf{p}, \mathbf{q}) = \|\mathbf{p} - \mathbf{q}\|$ satisfies the symmetry axiom $d(\mathbf{p}, \mathbf{q}) = d(\mathbf{q}, \mathbf{p})$ and the triangle inequality $d(\mathbf{p}, \mathbf{r}) \le d(\mathbf{p}, \mathbf{q}) + d(\mathbf{q}, \mathbf{r})$ for all $\mathbf{p}, \mathbf{q}, \mathbf{r} \in \mathbb{R}^3$.

### Exercise 3.7 (Advanced — Catastrophic Floating-Point Cancellation in Vector Subtraction)
Two GPS satellite position vectors in Earth-Centered Earth-Fixed (ECEF) coordinates are:  
$\mathbf{r}_1 = (6378137.0, \; 1250.0, \; 420.0)\text{ m}$  
$\mathbf{r}_2 = (6378137.0001, \; 1250.0002, \; 420.0001)\text{ m}$  
Explain why subtracting these two vectors using 32-bit single-precision floats (`float32`) leads to catastrophic loss of precision, whereas 64-bit double precision (`float64`) preserves the sub-millimeter displacement.

### Exercise 3.8 (Advanced — Linear Interpolation (Lerp) of 3D Position Vectors)
A camera moves from start position $\mathbf{A} = (10, 5, 20)$ to target position $\mathbf{B} = (70, 35, -10)$ over a normalized time interval $t \in [0, 1]$ according to the linear interpolation function:
$$\mathbf{p}(t) = (1 - t)\mathbf{A} + t\mathbf{B}$$
(a) Find the position at $t = 0.25$ and $t = 0.75$.  
(b) Show that the velocity vector $\dot{\mathbf{p}}(t)$ is constant for all $t$.

### Exercise 3.9 (Master — Cauchy-Schwarz Inequality in $\mathbb{R}^3$)
Using only the properties of the 3D norm and the quadratic discriminant of the function $f(t) = \|\mathbf{u} + t\mathbf{v}\|^2 \ge 0$, prove the Cauchy-Schwarz inequality for any $\mathbf{u}, \mathbf{v} \in \mathbb{R}^3$:
$$|u_x v_x + u_y v_y + u_z v_z| \le \|\mathbf{u}\| \|\mathbf{v}\|$$

### Exercise 3.10 (Master — Static Equilibrium of a Suspended Mass in 3D)
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

Having mastered the length and direction of a single arrow, we now investigate how pairs of 3D arrows interact. In **Chapter 4: The 3D Dot Product — Spatial Alignment, Angles, and Orthogonality**, we will examine how the scalar product measures spatial alignment, calculates true 3D dihedral angles, and governs energy transfer, lighting calculations, and orthogonal force decomposition.
