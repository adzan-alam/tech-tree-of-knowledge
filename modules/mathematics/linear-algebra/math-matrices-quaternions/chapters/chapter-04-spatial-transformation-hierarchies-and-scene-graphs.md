# Chapter 4: Spatial Transformation Hierarchies and Scene Graphs

> *"A complex machine or living organism is not a disjointed heap of independent parts; it is a nested hierarchy of reference frames, where each limb moves relative to its parent, and the motion of the root cascades faithfully to the farthest fingertip."*  
> — **Jacques Denavit and Richard Hartenberg**, *A Kinematic Notation for Lower-Pair Mechanisms* (1955)

---

### Section 4.1 Matrix Multiplication Non-Commutativity and Operation Ordering

When constructing a compound transformation for a 3D physical object, an engineer must combine three primary spatial operations:
1. **Scaling ($\mathbf{S}$):** Resizing the object to its correct physical dimensions.
2. **Rotation ($\mathbf{R}$):** Orienting the object to point in the desired heading.
3. **Translation ($\mathbf{T}$):** Moving the object to its world or parent position.

Because matrix multiplication is **strictly non-commutative** ($\mathbf{A}\mathbf{B} \ne \mathbf{B}\mathbf{A}$), the order in which these transformations are multiplied produces completely different physical results.

```
       Option A: Translate then Rotate (ORBIT!)
         [Start] ----> [Translate (10, 0)] ----> [Rotate 90 deg] ----> Ends at (0, 10)!

       Option B: Rotate then Translate (SPIN ON SPOT!)
         [Start] ----> [Rotate 90 deg] --------> [Translate (10, 0)] -> Ends at (10, 0)!
```

#### The Universal SRT Convention:
In virtually all modern computer graphics and game engines (Unreal, Unity, Godot, Three.js), transformations on a model's local vertex coordinates $\mathbf{p}_{\text{local}}$ are evaluated in the order:
$$\text{Scale first} \implies \text{Rotate second} \implies \text{Translate third}$$

When multiplying a column vector $\mathbf{p}$ on the right, operations apply from right to left:
$$\mathbf{p}_{\text{world}} = \mathbf{T} \, (\mathbf{R} \, (\mathbf{S} \, \mathbf{p}_{\text{local}})) = (\mathbf{T} \mathbf{R} \mathbf{S}) \, \mathbf{p}_{\text{local}}$$

Therefore, the canonical **Model Matrix** (or Local-to-Parent Matrix) is composed as:
$$\mathbf{M} = \mathbf{T} \, \mathbf{R} \, \mathbf{S}$$

#### What Happens if You Reverse the Order?
1. **$\mathbf{S} \mathbf{R} \mathbf{T}$:** The translation is scaled! If you scale by $2$ after translating by $10$, the object ends up at position $20$. Worse, if scale is non-uniform ($s_x \ne s_y$), the rotated geometry is sheared into an unnatural parallelogram.
2. **$\mathbf{R} \mathbf{T} \mathbf{S}$:** The translation vector is rotated around the origin, placing the object into an orbital arc rather than moving it in a straight line.

---

### Section 4.2 Row-Major vs Column-Major Memory Layouts

One of the most persistent sources of confusion and bugs in 3D programming is the clash between **mathematical notation**, **memory layout in RAM**, and **hardware shading languages** (OpenGL, WebGL, Vulkan, DirectX).

A $4 \times 4$ matrix has 16 numbers. But computer memory (RAM) is a flat, one-dimensional array of consecutive bytes: `float array[16]`.

```
 Matrix Grid:
  [ m00  m01  m02  m03 ]
  [ m10  m11  m12  m13 ]
  [ m20  m21  m22  m23 ]
  [ m30  m31  m32  m33 ]

 Row-Major Flat Layout (C/C++, DirectX math):
  [ m00, m01, m02, m03,  m10, m11, m12, m13,  m20, m21, m22, m23,  m30, m31, m32, m33 ]

 Column-Major Flat Layout (OpenGL, WebGL, GLSL, Three.js):
  [ m00, m10, m20, m30,  m01, m11, m21, m31,  m02, m12, m22, m32,  m03, m13, m23, m33 ]
```

#### Key Industry Distinctions:
1. **Row-Major Memory:**  
   Consecutive elements in memory represent horizontal rows. Used by standard C/C++ 2D arrays `matrix[row][col]`, Python NumPy (by default), and historically by DirectX HLSL.
   - Translation components $(t_x, t_y, t_z)$ sit at indices `[12, 13, 14]` in row-vector notation $\mathbf{p}' = \mathbf{p} \mathbf{M}$.
2. **Column-Major Memory:**  
   Consecutive elements in memory represent vertical columns. Used by Fortran, OpenGL, WebGL, GLSL, and WebGPU.
   - Translation components sit at flat indices `[12, 13, 14]` in column-vector notation $\mathbf{p}' = \mathbf{M} \mathbf{p}$ (the fourth column!).

*Critical Rule:* Always verify whether your engine treats vectors as columns ($\mathbf{M}\mathbf{v}$) or rows ($\mathbf{v}\mathbf{M}$), and whether its matrix constructor expects array inputs in row-major or column-major order. In this textbook and engine, we strictly follow the **column-vector convention $\mathbf{M}\mathbf{v}$**.

---

### Section 4.3 Scene Graphs and Hierarchical Kinematics

In real-world scenes, objects are rarely positioned purely in absolute world space. Consider a human character holding a flashlight:
- The flashlight is a child of the hand.
- The hand is a child of the forearm.
- The forearm is a child of the upper arm.
- The upper arm is a child of the torso.
- The torso is a child of the character root.

```
                   Character Root (World Transform M_root)
                         |
                       Torso (M_torso)
                         |
                     Upper Arm (M_upper)
                         |
                      Forearm (M_forearm)
                         |
                       Hand (M_hand)
                         |
                     Flashlight (M_light)
```

This tree structure is called a **Scene Graph**.

Each node in the scene graph stores its own **Local Transformation Matrix** $\mathbf{M}_{\text{local}}$ relative to its immediate parent:
$$\mathbf{M}_{\text{local}} = \mathbf{T}_{\text{local}} \mathbf{R}_{\text{local}} \mathbf{S}_{\text{local}}$$

#### Cascading World Transform Evaluation:
To calculate the absolute **World Transformation Matrix** $\mathbf{M}_{\text{world}}$ of any node in the tree, we recursively multiply the local transforms down from the root to the leaf:
$$\mathbf{M}_{\text{world, child}} = \mathbf{M}_{\text{world, parent}} \times \mathbf{M}_{\text{local, child}}$$

For the flashlight in the kinematic chain:
$$\mathbf{M}_{\text{world, light}} = \mathbf{M}_{\text{root}} \mathbf{M}_{\text{torso}} \mathbf{M}_{\text{upper}} \mathbf{M}_{\text{forearm}} \mathbf{M}_{\text{hand}} \mathbf{M}_{\text{light}}$$

Any point $\mathbf{p}$ on the flashlight mesh is converted directly into world space in a single matrix multiplication:
$$\mathbf{p}_{\text{world}} = \mathbf{M}_{\text{world, light}} \, \mathbf{p}_{\text{mesh}}$$

When the character runs, turns, or bends down, updating $\mathbf{M}_{\text{root}}$ automatically moves every child, joint, and tool attached to it, preserving physical integrity across thousands of vertices.

---

### Section 4.4 Transforming Surface Normals Correctly: The Inverse Transpose

When an object is transformed by an affine matrix $\mathbf{M}$, its vertex positions transform as $\mathbf{p}' = \mathbf{M}\mathbf{p}$.
It is tempting to assume that the surface normal vectors $\mathbf{n}$ transform using the exact same matrix: $\mathbf{n}' \stackrel{?}{=} \mathbf{M}\mathbf{n}$.

**This assumption is disastrously wrong whenever non-uniform scaling or shearing is present!**

```
     Original Sphere (Normal perpendicular)        Non-Uniform Scale (X by 2)
              ^ n                                          ^ n_naive = M * n (WRONG! Not perpendicular)
              |                                            |
         +----+----+                                 +-----+-----+
        /     |     \                               /       \     \
       |      +      |                             |         \     |
        \           /                               \         \   /
         +---------+                                 +---------+--+
                                                              \
                                                               v n_correct = (M^-1)^T * n
```

#### Mathematical Proof:
Let $\mathbf{t}$ be any tangent vector lying on the surface of the triangle. By definition, the surface normal $\mathbf{n}$ is strictly perpendicular to the tangent:
$$\mathbf{n} \cdot \mathbf{t} = \mathbf{n}^T \mathbf{t} = 0$$

Now, when the surface is transformed by matrix $\mathbf{M}$, the tangent vector transforms directly along the surface:
$$\mathbf{t}' = \mathbf{M}\mathbf{t}$$

Let $\mathbf{Q}$ be the unknown transformation matrix that correctly transforms the normal: $\mathbf{n}' = \mathbf{Q}\mathbf{n}$.  
For the transformed normal $\mathbf{n}'$ to remain strictly perpendicular to the transformed tangent $\mathbf{t}'$, their dot product must remain zero:
$$(\mathbf{n}')^T \mathbf{t}' = 0$$

Substitute $\mathbf{n}' = \mathbf{Q}\mathbf{n}$ and $\mathbf{t}' = \mathbf{M}\mathbf{t}$:
$$(\mathbf{Q}\mathbf{n})^T (\mathbf{M}\mathbf{t}) = 0$$
$$\mathbf{n}^T \mathbf{Q}^T \mathbf{M} \mathbf{t} = 0$$

For this equation to hold true for *all* tangent vectors where $\mathbf{n}^T \mathbf{t} = 0$, the product $\mathbf{Q}^T \mathbf{M}$ must equal the identity matrix $\mathbf{I}$ (up to a scalar factor):
$$\mathbf{Q}^T \mathbf{M} = \mathbf{I} \implies \mathbf{Q}^T = \mathbf{M}^{-1} \implies \mathbf{Q} = (\mathbf{M}^{-1})^T$$

**Surface normals must be transformed by the Inverse Transpose of the transformation matrix!**
$$\mathbf{n}' = (\mathbf{M}^{-1})^T \mathbf{n}$$

*Special Case:* If $\mathbf{M}$ contains only pure rotations $\mathbf{R} \in SO(3)$ and uniform scaling $s$, then $(\mathbf{R}^{-1})^T = (\mathbf{R}^T)^T = \mathbf{R}$. In that special case alone, the normal can be multiplied directly by $\mathbf{R}$ (and re-normalized).

---

### Section 4.5 The Complete Graphics Transformation Pipeline: Model, View, and Projection

In 3D computer graphics and game engines, rendering a vertex onto a 2D screen requires passing through the classical **MVP Pipeline** (Model-View-Projection):

```
 Object Local Space
         |
         v   [Model Matrix M] (Local -> World)
 World Space
         |
         v   [View Matrix V] (World -> Camera Space)
 Camera / View Space
         |
         v   [Projection Matrix P] (Camera -> Clip Space)
 Homogeneous Clip Space (w != 1)
         |
         v   [Perspective Division (x/w, y/w, z/w)]
 Normalized Device Coordinates (NDC: [-1, 1]^3)
         |
         v   [Viewport Transform]
 2D Screen Pixels (e.g., 1920x1080)
```

The composite transformation matrix sent to the GPU vertex shader is:
$$\mathbf{M}_{\text{MVP}} = \mathbf{P}_{\text{proj}} \mathbf{V}_{\text{view}} \mathbf{M}_{\text{model}}$$

#### 1. The Perspective Projection Matrix:
Let a perspective camera have:
- Vertical field of view angle: $\theta_{\text{fov}}$
- Aspect ratio: $a = \frac{\text{width}}{\text{height}}$
- Near clipping distance: $z_n > 0$
- Far clipping distance: $z_f > z_n$

Let $f = \frac{1}{\tan(\theta_{\text{fov}} / 2)}$.
The standard OpenGL/WebGL perspective projection matrix is:
$$\mathbf{P}_{\text{persp}} = \begin{bmatrix} 
\frac{f}{a} & 0 & 0 & 0 \\ 
0 & f & 0 & 0 \\ 
0 & 0 & \frac{-(z_f + z_n)}{z_f - z_n} & \frac{-2 z_f z_n}{z_f - z_n} \\ 
0 & 0 & -1 & 0 
\end{bmatrix}$$

Notice the bottom row $\begin{bmatrix} 0 & 0 & -1 & 0 \end{bmatrix}$:  
When multiplied by a camera-space point $(x, y, z, 1)$, the output $W$-component becomes:
$$W' = -z$$
Because the camera looks down the negative $z$-axis in OpenGL conventions, $-z$ is positive! The GPU rasterizer then divides by $W' = -z$, naturally making distant objects smaller:
$$x_{\text{screen}} \propto \frac{x}{-z}, \quad y_{\text{screen}} \propto \frac{y}{-z}$$
This single matrix encapsulates the entire mathematical optics of human vision.

---

### Section 4.6 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 4.1: Model Matrix SRT Assembly
**Problem:** A game prop is scaled by $\mathbf{S} = \text{diag}(2, 2, 2)$, rotated $90^\circ$ around the $y$-axis ($\mathbf{R}_y$), and translated to world position $\mathbf{t} = \begin{bmatrix} 10 & 0 & -5 \end{bmatrix}^T$.
Construct the complete $4 \times 4$ Model matrix $\mathbf{M} = \mathbf{T} \mathbf{R} \mathbf{S}$.

**Solution:**
1. Component matrices:
   $$\mathbf{S} = \begin{bmatrix} 2 & 0 & 0 & 0 \\ 0 & 2 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$\mathbf{R}_y(90^\circ) = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ -1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
   $$\mathbf{T} = \begin{bmatrix} 1 & 0 & 0 & 10 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & -5 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Compute $\mathbf{R}_y \mathbf{S}$:
   $$\mathbf{R}_y \mathbf{S} = \begin{bmatrix} 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ -1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 2 & 0 & 0 & 0 \\ 0 & 2 & 0 & 0 \\ 0 & 0 & 2 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 2 & 0 \\ 0 & 2 & 0 & 0 \\ -2 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Multiply by $\mathbf{T}$ on the left:
   $$\mathbf{M} = \mathbf{T} (\mathbf{R}_y \mathbf{S}) = \begin{bmatrix} 0 & 0 & 2 & 10 \\ 0 & 2 & 0 & 0 \\ -2 & 0 & 0 & -5 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
4. Verification:
   A local vertex at $\mathbf{p} = (1, 0, 0, 1)$ should scale to $(2, 0, 0)$, rotate to $(0, 0, -2)$, and translate to $(10, 0, -7)$.
   $$\mathbf{M} \mathbf{p} = \begin{bmatrix} 0 & 0 & 2 & 10 \\ 0 & 2 & 0 & 0 \\ -2 & 0 & 0 & -5 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1 \\ 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 + 10 \\ 0 + 0 \\ -2 - 5 \\ 1 \end{bmatrix} = \begin{bmatrix} 10 \\ 0 \\ -7 \\ 1 \end{bmatrix} \quad \checkmark$$

---

#### Example 4.2: Normal Transformation with Non-Uniform Scale
**Problem:** A cylinder surface has unit normal $\mathbf{n} = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$. The cylinder is scaled non-uniformly by $\mathbf{S} = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$.
1. Show that naively multiplying $\mathbf{n}' = \mathbf{S}\mathbf{n}$ produces an incorrect normal.
2. Compute the correct normal using the inverse transpose $(\mathbf{S}^{-1})^T$.

**Solution:**
1. **Naive Multiplication (Incorrect):**
   $$\mathbf{n}_{\text{naive}} = \mathbf{S}\mathbf{n} = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 2/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} \sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$
   Consider a surface tangent vector: $\mathbf{t} = \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$. Check original orthogonality: $\mathbf{n} \cdot \mathbf{t} = -\frac{1}{2} + \frac{1}{2} + 0 = 0 \checkmark$.
   Now transform the tangent:
   $$\mathbf{t}' = \mathbf{S}\mathbf{t} = \begin{bmatrix} 2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} -\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$
   Now test dot product of naive normal and transformed tangent:
   $$\mathbf{n}_{\text{naive}} \cdot \mathbf{t}' = (\sqrt{2})(-\sqrt{2}) + \left(\frac{1}{\sqrt{2}}\right)\left(\frac{1}{\sqrt{2}}\right) = -2 + \frac{1}{2} = -1.5 \ne 0!$$
   The naive normal is **NOT perpendicular** to the surface!
2. **Correct Normal via Inverse Transpose:**
   $$\mathbf{S}^{-1} = \begin{bmatrix} 1/2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \implies (\mathbf{S}^{-1})^T = \begin{bmatrix} 1/2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix}$$
   $$\mathbf{n}_{\text{correct}} = (\mathbf{S}^{-1})^T \mathbf{n} = \begin{bmatrix} 1/2 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 1/(2\sqrt{2}) \\ 1/\sqrt{2} \\ 0 \end{bmatrix}$$
   Now test orthogonality with transformed tangent $\mathbf{t}'$:
   $$\mathbf{n}_{\text{correct}} \cdot \mathbf{t}' = \left(\frac{1}{2\sqrt{2}}\right)(-\sqrt{2}) + \left(\frac{1}{\sqrt{2}}\right)\left(\frac{1}{\sqrt{2}}\right) = -\frac{1}{2} + \frac{1}{2} = 0 \quad \checkmark$$
   Normalize:
   $$\|\mathbf{n}_{\text{correct}}\| = \sqrt{\frac{1}{8} + \frac{1}{2}} = \sqrt{\frac{5}{8}} = \frac{\sqrt{10}}{4}$$
   $$\hat{\mathbf{n}}' = \frac{4}{\sqrt{10}} \begin{bmatrix} 1/(2\sqrt{2}) \\ 1/\sqrt{2} \\ 0 \end{bmatrix} = \begin{bmatrix} 1/\sqrt{5} \\ 2/\sqrt{5} \\ 0 \end{bmatrix}$$
The surface normal is strictly perpendicular.

---

#### Example 4.3: Two-Link Robotic Arm Forward Kinematics
**Problem:** A planar 2-link robotic arm operates in the $xy$-plane:
- Link 1 has length $L_1 = 2 \text{ m}$ rotated by joint angle $\theta_1 = 30^\circ$.
- Link 2 has length $L_2 = 1.5 \text{ m}$ rotated by relative joint angle $\theta_2 = 45^\circ$.
Construct the local transformation matrices and compute the world position of the end-effector.

**Solution:**
1. Base to Link 1 transform $\mathbf{T}_1$:
   $$\mathbf{T}_1 = \mathbf{R}_z(30^\circ) = \begin{bmatrix} \cos 30^\circ & -\sin 30^\circ & 0 & 0 \\ \sin 30^\circ & \cos 30^\circ & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \sqrt{3}/2 & -1/2 & 0 & 0 \\ 1/2 & \sqrt{3}/2 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
2. Link 1 joint to Link 2 transform $\mathbf{T}_2$:
   Joint 2 is located at the end of Link 1: displacement along $x_1$ by $L_1 = 2$, rotated by $\theta_2 = 45^\circ$:
   $$\mathbf{T}_2 = \begin{bmatrix} \cos 45^\circ & -\sin 45^\circ & 0 & 2 \\ \sin 45^\circ & \cos 45^\circ & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} \sqrt{2}/2 & -\sqrt{2}/2 & 0 & 2 \\ \sqrt{2}/2 & \sqrt{2}/2 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
3. Composite transform to end-effector $\mathbf{T}_{\text{world}} = \mathbf{T}_1 \mathbf{T}_2$:
   Compute translation column of $\mathbf{T}_1 \mathbf{T}_2$:
   $$\mathbf{t}_{\text{world}} = \mathbf{T}_1 \begin{bmatrix} 2 \\ 0 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 2\cos 30^\circ \\ 2\sin 30^\circ \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} \sqrt{3} \\ 1 \\ 0 \\ 1 \end{bmatrix} \approx \begin{bmatrix} 1.732 \\ 1.000 \\ 0 \\ 1 \end{bmatrix}$$
4. The end-effector is at local position $(L_2, 0, 0) = (1.5, 0, 0)$ relative to Link 2:
   $$\mathbf{p}_{\text{TCP}} = \mathbf{T}_1 \mathbf{T}_2 \begin{bmatrix} 1.5 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
   Total orientation angle is $\theta_1 + \theta_2 = 30^\circ + 45^\circ = 75^\circ$.
   $$\mathbf{p}_{\text{TCP}} = \begin{bmatrix} L_1 \cos 30^\circ + L_2 \cos 75^\circ \\ L_1 \sin 30^\circ + L_2 \sin 75^\circ \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 2(0.866) + 1.5(0.2588) \\ 2(0.500) + 1.5(0.9659) \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 1.732 + 0.388 \\ 1.000 + 1.449 \\ 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 2.120 \\ 2.449 \\ 0 \\ 1 \end{bmatrix} \text{ m}$$

---

#### Example 4.4: Column-Major Flat Array Storage
**Problem:** A $4 \times 4$ matrix has entries:
$$\mathbf{M} = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 5 & 6 & 7 & 8 \\ 9 & 10 & 11 & 12 \\ 13 & 14 & 15 & 16 \end{bmatrix}$$
Write out the 16-element flat array representation in:
1. Row-major order.
2. Column-major order (WebGL / OpenGL).

**Solution:**
1. **Row-Major Order (Row by Row):**
   `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]`
2. **Column-Major Order (Column by Column):**
   `[1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]`

---

#### Example 4.5: Perspective Division by $W$
**Problem:** After multiplication by a perspective projection matrix, a vertex has clip-space coordinates:
$$\mathbf{p}_{\text{clip}} = \begin{bmatrix} -4.0 \\ 2.0 \\ 8.0 \\ 4.0 \end{bmatrix}$$
1. Find the Normalized Device Coordinates (NDC).
2. Determine if the point is inside the canonical view volume $[-1, 1]^3$.

**Solution:**
1. Perform perspective division by $W = 4.0$:
   $$x_{\text{ndc}} = \frac{-4.0}{4.0} = -1.0$$
   $$y_{\text{ndc}} = \frac{2.0}{4.0} = +0.5$$
   $$z_{\text{ndc}} = \frac{8.0}{4.0} = +2.0$$
2. Test boundaries:
   - $x = -1.0 \in [-1, 1] \checkmark$ (lies on left screen edge).
   - $y = 0.5 \in [-1, 1] \checkmark$ (inside vertical bounds).
   - $z = 2.0 > 1.0 \implies$ **FAILS!** (The point lies beyond the Far clipping plane).
**Conclusion:** The point is culled (clipped) and will not be rendered.

---

#### Example 4.6: Orthographic Projection Matrix Construction
**Problem:** Construct an orthographic projection matrix $\mathbf{P}_{\text{ortho}}$ for a 2D engineering blueprint viewport with boundaries: left $l = -10$, right $r = 10$, bottom $b = -5$, top $t = 5$, near $n = 0$, far $f = 100$.

**Solution:**
The orthographic matrix maps $[l, r] \to [-1, 1]$, $[b, t] \to [-1, 1]$, and $[-n, -f] \to [-1, 1]$:
$$\mathbf{P}_{\text{ortho}} = \begin{bmatrix} 
\frac{2}{r - l} & 0 & 0 & -\frac{r + l}{r - l} \\ 
0 & \frac{2}{t - b} & 0 & -\frac{t + b}{t - b} \\ 
0 & 0 & \frac{-2}{f - n} & -\frac{f + n}{f - n} \\ 
0 & 0 & 0 & 1 
\end{bmatrix}$$
Substitute the values:
- $\frac{2}{r - l} = \frac{2}{20} = 0.1$, $-\frac{r + l}{r - l} = 0$
- $\frac{2}{t - b} = \frac{2}{10} = 0.2$, $-\frac{t + b}{t - b} = 0$
- $\frac{-2}{f - n} = \frac{-2}{100} = -0.02$, $-\frac{f + n}{f - n} = -\frac{100}{100} = -1.0$
$$\mathbf{P}_{\text{ortho}} = \begin{bmatrix} 
0.1 & 0 & 0 & 0 \\ 
0 & 0.2 & 0 & 0 \\ 
0 & 0 & -0.02 & -1.0 \\ 
0 & 0 & 0 & 1 
\end{bmatrix}$$

---

#### Example 4.7: Extracting Translation from a Compound Matrix
**Problem:** A compound matrix is given by $\mathbf{M} = \begin{bmatrix} 0 & -2 & 0 & 14 \\ 2 & 0 & 0 & -8 \\ 0 & 0 & 2 & 3 \\ 0 & 0 & 0 & 1 \end{bmatrix}$.
Extract the translation vector $\mathbf{t}$ and the uniform scale factor $s$.

**Solution:**
1. Translation vector is column 4:
   $$\mathbf{t} = \begin{bmatrix} 14 \\ -8 \\ 3 \end{bmatrix}$$
2. The length of the first column is:
   $$\|\mathbf{c}_1\| = \sqrt{0^2 + 2^2 + 0^2} = 2.0$$
   The length of the second column is:
   $$\|\mathbf{c}_2\| = \sqrt{(-2)^2 + 0^2 + 0^2} = 2.0$$
   The length of the third column is:
   $$\|\mathbf{c}_3\| = \sqrt{0^2 + 0^2 + 2^2} = 2.0$$
Since all three column lengths equal $2.0$, the scale factor is $s = 2.0$.

---

#### Example 4.8: View Matrix Construction from Camera Basis
**Problem:** A camera is at eye $\mathbf{E} = (0, 0, 10)$ looking along $-z$, with right $\hat{\mathbf{r}} = (1, 0, 0)$ and up $\hat{\mathbf{u}} = (0, 1, 0)$. Write down the $4 \times 4$ View Matrix $\mathbf{V}$.

**Solution:**
Using the View matrix formula from Chapter 3:
$$\mathbf{V} = \begin{bmatrix} 
1 & 0 & 0 & -\hat{\mathbf{r}} \cdot \mathbf{E} \\ 
0 & 1 & 0 & -\hat{\mathbf{u}} \cdot \mathbf{E} \\ 
0 & 0 & 1 & -\hat{\mathbf{b}} \cdot \mathbf{E} \\ 
0 & 0 & 0 & 1 
\end{bmatrix}$$
Camera backward axis is $\hat{\mathbf{b}} = (0, 0, 1)$.
- $-\hat{\mathbf{r}} \cdot \mathbf{E} = -(1)(0) = 0$
- $-\hat{\mathbf{u}} \cdot \mathbf{E} = -(1)(0) = 0$
- $-\hat{\mathbf{b}} \cdot \mathbf{E} = -(1)(10) = -10$
$$\mathbf{V} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & -10 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
This simply translates the world by $-10$ along $z$, centering the camera at the origin.

---

#### Example 4.9: Detaching an Object from a Parent in a Scene Graph
**Problem:** In a scene graph, a sword is attached to a character's hand:
- Hand World Transform: $\mathbf{M}_{\text{hand}} = \begin{bmatrix} 1 & 0 & 0 & 5 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{bmatrix}$.
- Sword Local Transform: $\mathbf{M}_{\text{sword, local}} = \begin{bmatrix} 0 & -1 & 0 & 0.5 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$.
The character drops the sword onto the ground. What must the sword's new **World Transform** $\mathbf{M}_{\text{sword, world}}$ be so that it doesn't jump or move at the instant of release?

**Solution:**
The sword's world transform at the instant of release is simply its compound parent-local product:
$$\mathbf{M}_{\text{sword, world}} = \mathbf{M}_{\text{hand}} \mathbf{M}_{\text{sword, local}}$$
$$\mathbf{M}_{\text{sword, world}} = \begin{bmatrix} 1 & 0 & 0 & 5 \\ 0 & 1 & 0 & 2 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} 0 & -1 & 0 & 0.5 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & -1 & 0 & 5.5 \\ 1 & 0 & 0 & 2.0 \\ 0 & 0 & 1 & 1.0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
By reassigning the sword's parent to the Scene Root and setting its local transform to $\mathbf{M}_{\text{sword, world}}$, the sword remains visually seamless at $(5.5, 2.0, 1.0)$.

---

#### Example 4.10: Re-Parenting an Object
**Problem:** A weapon with current world transform $\mathbf{M}_{\text{weapon, world}}$ is picked up by a player with world transform $\mathbf{M}_{\text{player, world}}$. Find the new local transform $\mathbf{M}_{\text{weapon, local}}$ such that the weapon maintains its current world pose.

**Solution:**
We require:
$$\mathbf{M}_{\text{player, world}} \mathbf{M}_{\text{weapon, local}} = \mathbf{M}_{\text{weapon, world}}$$
Multiply both sides by $\mathbf{M}_{\text{player, world}}^{-1}$ on the left:
$$\mathbf{M}_{\text{weapon, local}} = \mathbf{M}_{\text{player, world}}^{-1} \mathbf{M}_{\text{weapon, world}}$$
This is the universal re-parenting formula used across all game engines.

---

### Section 4.7 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 4.1
**Problem:** If matrix $\mathbf{A}$ rotates by $45^\circ$ and $\mathbf{B}$ translates by $(1, 0, 0)$, what operation does $\mathbf{B}\mathbf{A}$ perform on a vector?
**Solution:**
It rotates the vector by $45^\circ$ first, then translates the rotated result by $(1, 0, 0)$.

---

#### Exercise 4.2
**Problem:** Why does non-uniform scaling break naive normal transformation?
**Solution:**
Non-uniform scaling stretches angles between non-orthogonal vectors unevenly, causing the surface tangent to rotate at a different rate than the surface normal, destroying their mutual $90^\circ$ perpendicularity.

---

#### Exercise 4.3
**Problem:** If $\mathbf{M} = \mathbf{T} \mathbf{R} \mathbf{S}$, write down the formula for $\mathbf{M}^{-1}$ in terms of $\mathbf{T}^{-1}, \mathbf{R}^{-1}, \mathbf{S}^{-1}$.
**Solution:**
$$(\mathbf{T} \mathbf{R} \mathbf{S})^{-1} = \mathbf{S}^{-1} \mathbf{R}^{-1} \mathbf{T}^{-1}$$

---

#### Exercise 4.4
**Problem:** In OpenGL GLSL shaders, why is the matrix declared as `mat4` multiplied by `vec4` as `mat4 * vec4`?
**Solution:**
Because GLSL uses column-vector convention, where transformations act on column vectors on the right: $\mathbf{v}' = \mathbf{M}\mathbf{v}$.

---

#### Exercise 4.5
**Problem:** If a camera has near plane $z_n = 1.0$ and far plane $z_f = 1000.0$, what is the effect on depth buffer precision if $z_n$ is decreased to $0.001$?
**Solution:**
Decreasing $z_n$ closer to $0$ causes extreme **depth buffer non-linearity**, clustering over $90\%$ of the floating-point precision right near the camera lens and producing catastrophic **$Z$-fighting** (flickering polygons) across distant terrain.

---

#### Exercise 4.6
**Problem:** What is the inverse transpose of a pure rotation matrix $\mathbf{R}$?
**Solution:**
$(\mathbf{R}^{-1})^T = (\mathbf{R}^T)^T = \mathbf{R}$.

---

#### Exercise 4.7
**Problem:** In a scene graph, if a parent node is scaled by $2.0$, how are all of its child geometries scaled?
**Solution:**
Because matrix multiplication cascades down the tree ($\mathbf{M}_{\text{child, world}} = \mathbf{M}_{\text{parent, world}} \mathbf{M}_{\text{child, local}}$), all child geometries inherit the parent's scale factor of $2.0$.

---

#### Exercise 4.8
**Problem:** What is the result of multiplying the perspective projection matrix by a point where $z = 0$?
**Solution:**
The $W$-component of the output becomes $W' = -z = 0$. Perspective division by zero produces `Infinity` or `NaN`, which is why the Near clipping plane $z_n$ must always be strictly greater than zero ($z_n > 0$).

---

#### Exercise 4.9
**Problem:** If an object is transformed by $\mathbf{M} = \begin{bmatrix} 3 & 0 & 0 & 0 \\ 0 & 3 & 0 & 0 \\ 0 & 0 & 3 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$, what is the normal matrix $(\mathbf{M}^{-1})^T$?
**Solution:**
$$\mathbf{M}^{-1} = \text{diag}(1/3, 1/3, 1/3, 1) \implies (\mathbf{M}^{-1})^T = \text{diag}(1/3, 1/3, 1/3, 1)$$
Scaling the normal by $1/3$ and normalizing it returns the exact same unit normal direction.

---

#### Exercise 4.10
**Problem:** Why do scene graphs update world transforms using a pre-order tree traversal?
**Solution:**
Because a child node's world transform requires its parent's world transform to be fully computed first ($\mathbf{M}_{\text{world, child}} = \mathbf{M}_{\text{world, parent}} \mathbf{M}_{\text{local, child}}$). Traversing from root to leaf (pre-order) guarantees that every parent is updated before its children are evaluated.
