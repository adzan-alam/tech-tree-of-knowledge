# Chapter 10: Polygonal Meshes, Triangulation, and Surface Normals

> *"In the digital realm, continuous smooth forms are an illusion: every sculpture, character, and world is composed of flat triangular facets. The art of realism lies in how the normals across these facets deceive the eye."*  
> — **Henri Gouraud**, *Continuous Shading of Curved Surfaces* (1971)

---

### Section 10.1 Indexed Face Sets and Triangle Meshes

In modern computer graphics and 3D simulation engines, virtually every physical object—from a simple cube to an intricate aircraft chassis or biomechanical skeleton—is represented as a **polygonal surface mesh**.

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
