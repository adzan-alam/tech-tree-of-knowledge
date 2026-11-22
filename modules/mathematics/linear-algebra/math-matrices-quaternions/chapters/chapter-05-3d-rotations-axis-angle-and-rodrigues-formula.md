# Chapter 5: 3D Rotations: Axis-Angle and Rodrigues' Formula

> *"Any displacement of a rigid body such that a point of the body remains fixed is equivalent to a simple rotation about some axis passing through that point."*  
> — **Leonhard Euler**, *Nova Methodus Investigandi Motus Corporum Rigidorum* (1776)

---

### Section 5.1 Euler's Rotation Theorem

In two dimensions, rotation is trivial: there is only one plane of motion ($xy$), and every rotation is completely specified by a single scalar angle $\theta$ around the origin.

In three dimensions, the geometry of rotation appears vastly more complex. A spacecraft tumbling through the vacuum of space can pitch, roll, and yaw simultaneously. A planet spins while wobbling on an inclined tilt. It is easy to imagine that compound spatial rotations might shear or twist space into knots.

In 1776, the peerless Swiss mathematician Leonhard Euler proved a breathtaking theorem that simplified spatial rotation forever:

#### Euler's Rotation Theorem:
*Any general displacement of a rigid body in three-dimensional space that leaves at least one point fixed is mathematically identical to a **single, pure rotation through an angle $\theta$ around a single, fixed axis $\hat{\mathbf{n}}$ passing through that point**.*

```
                 n (Instantaneous Rotation Axis)
                 ^
                 |
                 |      v' (Rotated Vector)
                 |     /
                 |    /   theta
                 |   /
                 +--/----------> v (Original Vector)
```

No matter how many complex rotations, gyrations, or matrix multiplications you string together:
$$\mathbf{R}_{\text{net}} = \mathbf{R}_1 \mathbf{R}_2 \mathbf{R}_3 \dots \mathbf{R}_k$$
their composite effect is always just **one rotation around one line**.

#### Algebraic Proof via Eigenvalues:
Every pure rotation matrix $\mathbf{R} \in SO(3)$ is orthogonal ($\mathbf{R}^T \mathbf{R} = \mathbf{I}$) with $\det(\mathbf{R}) = 1$.
Consider the characteristic equation $\det(\mathbf{R} - \lambda \mathbf{I}) = 0$.
We evaluate $\det(\mathbf{R} - \mathbf{I})$:
$$\det(\mathbf{R} - \mathbf{I}) = \det((\mathbf{R} - \mathbf{I})^T) = \det(\mathbf{R}^T - \mathbf{I})$$
Multiply inside by $\det(\mathbf{R}) = 1$:
$$= \det(\mathbf{R}) \det(\mathbf{R}^T - \mathbf{I}) = \det(\mathbf{R} \mathbf{R}^T - \mathbf{R}) = \det(\mathbf{I} - \mathbf{R})$$
In $3 \times 3$ space, pulling out a factor of $-1$ from all three dimensions yields:
$$\det(\mathbf{I} - \mathbf{R}) = (-1)^3 \det(\mathbf{R} - \mathbf{I}) = -\det(\mathbf{R} - \mathbf{I})$$
Therefore:
$$\det(\mathbf{R} - \mathbf{I}) = -\det(\mathbf{R} - \mathbf{I}) \implies 2 \det(\mathbf{R} - \mathbf{I}) = 0 \implies \det(\mathbf{R} - \mathbf{I}) = 0$$

Because $\det(\mathbf{R} - 1 \cdot \mathbf{I}) = 0$, **$\lambda = 1$ is guaranteed to be an eigenvalue of every 3D rotation matrix $\mathbf{R}$**!
By definition of an eigenvalue:
$$\mathbf{R} \hat{\mathbf{n}} = 1 \cdot \hat{\mathbf{n}} = \hat{\mathbf{n}}$$
There exists a non-zero eigenvector $\hat{\mathbf{n}} \in \mathbb{R}^3$ that is **completely unchanged** by the rotation. That invariant eigenvector $\hat{\mathbf{n}}$ is precisely **Euler's Axis of Rotation**! $\blacksquare$

---

### Section 5.2 Axis-Angle Parameterization

Euler's Theorem directly motivates the **Axis-Angle Representation** of 3D rotations:
- A unit vector $\hat{\mathbf{n}} = \begin{bmatrix} n_x & n_y & n_z \end{bmatrix}^T$ with $\|\hat{\mathbf{n}}\| = 1$, specifying the directed axis in space.
- A scalar angle $\theta \in \mathbb{R}$ (typically $[0, \pi]$ or $[-\pi, \pi]$ radians), specifying the amount of rotation governed by the right-hand grip rule (thumb along $\hat{\mathbf{n}}$, fingers curling in the direction of positive rotation).

```
            Thumb points along n
                   ^
                  / \
                 |   |  Fingers curl by angle theta
                  \ /
```

#### Degrees of Freedom:
How many parameters specify an axis-angle rotation?
- The axis $\hat{\mathbf{n}}$ has 3 components, but the unit constraint $n_x^2 + n_y^2 + n_z^2 = 1$ removes 1 degree of freedom, leaving 2 independent directions (a point on the unit sphere $\mathbb{S}^2$).
- The angle $\theta$ provides 1 degree of freedom.
- Total: $2 + 1 = 3$ independent degrees of freedom. This matches the exact dimensionality of the rotation group $SO(3)$.

Often, the axis and angle are combined into a single compact 3D **rotation vector** $\mathbf{r} = \theta \hat{\mathbf{n}}$ (widely used in robotic Lie algebra $\mathfrak{so}(3)$ and physics angular velocity).

---

### Section 5.3 Geometric Derivation of Rodrigues' Rotation Formula

Given an arbitrary vector $\mathbf{v} \in \mathbb{R}^3$, an axis unit vector $\hat{\mathbf{n}}$, and a rotation angle $\theta$, how do we compute the rotated vector $\mathbf{v}'$ without building a $3 \times 3$ matrix first?

In 1840, French mathematician Olinde Rodrigues derived an elegant vector formula using fundamental orthogonal decomposition:

```
                      n (Axis)
                      |
                      |    v_parallel
                      +------------------+
                     /                  /|
                    /                  / |
                   /                  /  |
                  v                  /   |
                                    v'   v_perp'
```

#### Step-by-Step Derivation:

1. **Decompose $\mathbf{v}$ into Parallel and Perpendicular Components:**  
   Relative to the rotation axis $\hat{\mathbf{n}}$:
   $$\mathbf{v} = \mathbf{v}_{\parallel} + \mathbf{v}_{\perp}$$
   From Chapter 5:
   $$\mathbf{v}_{\parallel} = (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
   $$\mathbf{v}_{\perp} = \mathbf{v} - \mathbf{v}_{\parallel} = \mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$

2. **Action of Rotation on Components:**  
   Because the rotation axis is $\hat{\mathbf{n}}$:
   - The parallel component $\mathbf{v}_{\parallel}$ lies directly on the axis, so it is **completely unaffected by rotation**:
     $$\mathbf{v}_{\parallel}' = \mathbf{v}_{\parallel} = (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}$$
   - The perpendicular component $\mathbf{v}_{\perp}$ lies in the plane orthogonal to $\hat{\mathbf{n}}$. It undergoes a pure 2D planar rotation through angle $\theta$!

3. **Constructing the 2D Planar Basis:**  
   In the plane perpendicular to $\hat{\mathbf{n}}$, the vector $\mathbf{v}_{\perp}$ has length $r = \|\mathbf{v}_{\perp}\|$.
   To rotate it, we need an orthogonal in-plane basis vector of the exact same length.  
   We take the cross product of $\hat{\mathbf{n}}$ with $\mathbf{v}$:
   $$\mathbf{w} = \hat{\mathbf{n}} \times \mathbf{v} = \hat{\mathbf{n}} \times (\mathbf{v}_{\parallel} + \mathbf{v}_{\perp}) = \mathbf{0} + \hat{\mathbf{n}} \times \mathbf{v}_{\perp}$$
   Notice that $\mathbf{w}$ is perpendicular to both $\hat{\mathbf{n}}$ and $\mathbf{v}_{\perp}$, and its magnitude is:
   $$\|\mathbf{w}\| = \|\hat{\mathbf{n}}\| \|\mathbf{v}_{\perp}\| \sin(90^\circ) = \|\mathbf{v}_{\perp}\|$$
   Thus, $\{\mathbf{v}_{\perp}, \mathbf{w}\}$ forms an orthogonal basis for the plane of rotation with identical lengths!

4. **Rotating the Perpendicular Component:**  
   Applying 2D circle trigonometry in the $\{\mathbf{v}_{\perp}, \mathbf{w}\}$ basis:
   $$\mathbf{v}_{\perp}' = \cos\theta \, \mathbf{v}_{\perp} + \sin\theta \, \mathbf{w} = \cos\theta \, [\mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}] + \sin\theta \, (\hat{\mathbf{n}} \times \mathbf{v})$$

5. **Recombining Parallel and Perpendicular Parts:**  
   $$\mathbf{v}' = \mathbf{v}_{\parallel}' + \mathbf{v}_{\perp}' = (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}} + \cos\theta \, [\mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}] + \sin\theta \, (\hat{\mathbf{n}} \times \mathbf{v})$$
   Collect terms with respect to $\mathbf{v}$, $(\hat{\mathbf{n}} \times \mathbf{v})$, and $\hat{\mathbf{n}}$:
   $$\mathbf{v}' = \mathbf{v}\cos\theta + (\hat{\mathbf{n}} \times \mathbf{v})\sin\theta + \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v})(1 - \cos\theta)$$

This is **Rodrigues' Rotation Formula**.  
It allows computing rotated vectors using only basic vector operations (dot products, cross products, and scalar multiplications), requiring **zero matrix allocations**!

---

### Section 5.4 Matrix Form of Rodrigues' Formula

While Rodrigues' formula is great for transforming individual vectors, graphics hardware and physics constraint solvers require a $3 \times 3$ rotation matrix $\mathbf{R}(\hat{\mathbf{n}}, \theta)$.

To convert Rodrigues' formula into matrix form, recall from Chapter 6 the **skew-symmetric cross product matrix** $[\hat{\mathbf{n}}]_{\times}$:
$$\hat{\mathbf{n}} \times \mathbf{v} = [\hat{\mathbf{n}}]_{\times} \mathbf{v} = \begin{bmatrix} 0 & -n_z & n_y \\ n_z & 0 & -n_x \\ -n_y & n_x & 0 \end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$$

Now, consider the second power $[\hat{\mathbf{n}}]_{\times}^2$:
Using Lagrange's BAC-CAB identity:
$$[\hat{\mathbf{n}}]_{\times}^2 \mathbf{v} = \hat{\mathbf{n}} \times (\hat{\mathbf{n}} \times \mathbf{v}) = \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v}) - \mathbf{v}(\hat{\mathbf{n}} \cdot \hat{\mathbf{n}}) = \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v}) - \mathbf{v}$$
Rearranging terms:
$$\hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v}) = \mathbf{v} + [\hat{\mathbf{n}}]_{\times}^2 \mathbf{v} = (\mathbf{I} + [\hat{\mathbf{n}}]_{\times}^2) \mathbf{v}$$

Substitute these matrix operators into Rodrigues' formula:
$$\mathbf{v}' = \mathbf{v}\cos\theta + (\sin\theta) [\hat{\mathbf{n}}]_{\times} \mathbf{v} + (1 - \cos\theta) (\mathbf{I} + [\hat{\mathbf{n}}]_{\times}^2) \mathbf{v}$$
Factor out $\mathbf{v}$:
$$\mathbf{v}' = \left( \mathbf{I}\cos\theta + \sin\theta [\hat{\mathbf{n}}]_{\times} + \mathbf{I}(1 - \cos\theta) + (1 - \cos\theta) [\hat{\mathbf{n}}]_{\times}^2 \right) \mathbf{v}$$
Combine the identity terms $\mathbf{I}\cos\theta + \mathbf{I}(1 - \cos\theta) = \mathbf{I}$:

$$\mathbf{R}(\hat{\mathbf{n}}, \theta) = \mathbf{I} + \sin\theta [\hat{\mathbf{n}}]_{\times} + (1 - \cos\theta) [\hat{\mathbf{n}}]_{\times}^2$$

This is the exponential map on Lie group $SO(3)$:
$$\mathbf{R}(\hat{\mathbf{n}}, \theta) = \exp(\theta [\hat{\mathbf{n}}]_{\times})$$

#### Expanded Component Form:
Let $c = \cos\theta, s = \sin\theta, t = 1 - \cos\theta$.  
Multiplying out the components yields the explicit $3 \times 3$ matrix:

$$\mathbf{R}(\hat{\mathbf{n}}, \theta) = \begin{bmatrix} 
t n_x^2 + c & t n_x n_y - s n_z & t n_x n_z + s n_y \\ 
t n_x n_y + s n_z & t n_y^2 + c & t n_y n_z - s n_x \\ 
t n_x n_z - s n_y & t n_y n_z + s n_x & t n_z^2 + c 
\end{bmatrix}$$

---

### Section 5.5 Extracting Axis and Angle from a Rotation Matrix

Given an arbitrary $3 \times 3$ rotation matrix $\mathbf{R} \in SO(3)$, how do we reverse the process to find its original rotation axis $\hat{\mathbf{n}}$ and angle $\theta$?

#### 1. Extracting the Rotation Angle $\theta$:
Look at the sum of the diagonal entries (the trace) of the expanded matrix $\mathbf{R}(\hat{\mathbf{n}}, \theta)$:
$$\text{Tr}(\mathbf{R}) = R_{11} + R_{22} + R_{33} = (t n_x^2 + c) + (t n_y^2 + c) + (t n_z^2 + c)$$
$$= t(n_x^2 + n_y^2 + n_z^2) + 3c$$
Since $\hat{\mathbf{n}}$ is a unit vector ($n_x^2 + n_y^2 + n_z^2 = 1$) and $t = 1 - c$:
$$\text{Tr}(\mathbf{R}) = (1 - c)(1) + 3c = 1 - c + 3c = 1 + 2c = 1 + 2\cos\theta$$

Isolating $\cos\theta$:
$$\cos\theta = \frac{\text{Tr}(\mathbf{R}) - 1}{2}$$
Therefore, the rotation angle $\theta \in [0, \pi]$ is:
$$\theta = \arccos\left(\text{clamp}\left(\frac{R_{11} + R_{22} + R_{33} - 1}{2}, -1.0, 1.0\right)\right)$$

#### 2. Extracting the Rotation Axis $\hat{\mathbf{n}}$:
Consider subtracting the transpose $\mathbf{R} - \mathbf{R}^T$:
Notice that all symmetric terms $t n_i n_j$ and diagonal terms cancel, leaving only the skew-symmetric terms:
$$\mathbf{R} - \mathbf{R}^T = 2\sin\theta \begin{bmatrix} 0 & -n_z & n_y \\ n_z & 0 & -n_x \\ -n_y & n_x & 0 \end{bmatrix} = 2\sin\theta [\hat{\mathbf{n}}]_{\times}$$

Evaluating the off-diagonal elements:
$$R_{32} - R_{23} = 2 n_x \sin\theta$$
$$R_{13} - R_{31} = 2 n_y \sin\theta$$
$$R_{21} - R_{12} = 2 n_z \sin\theta$$

As long as $\sin\theta \ne 0$ (i.e., $\theta \ne 0$ and $\theta \ne \pi$):
$$\hat{\mathbf{n}} = \frac{1}{2\sin\theta} \begin{bmatrix} R_{32} - R_{23} \\ R_{13} - R_{31} \\ R_{21} - R_{12} \end{bmatrix}$$

#### Critical Edge Cases:
- **$\theta \approx 0$ (Identity Matrix):** Any axis is valid (no rotation occurred). Default to $\hat{\mathbf{n}} = \begin{bmatrix} 0 & 1 & 0 \end{bmatrix}^T$.
- **$\theta \approx \pi$ ($180^\circ$ Rotation):** $\sin\pi = 0$, so the formula divides by zero. In this case, $\cos\pi = -1 \implies t = 2$. The matrix simplifies to $R_{ii} = 2n_i^2 - 1 \implies n_i = \sqrt{\frac{R_{ii} + 1}{2}}$, choosing signs to match off-diagonal elements.

---

### Section 5.6 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 5.1: Direct Application of Rodrigues' Formula
**Problem:** Rotate the vector $\mathbf{v} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ by angle $\theta = 90^\circ$ around the axis $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}$ using Rodrigues' formula directly.

**Solution:**
1. Angles: $\cos 90^\circ = 0$, $\sin 90^\circ = 1$, $1 - \cos 90^\circ = 1$.
2. Compute $\hat{\mathbf{n}} \cdot \mathbf{v}$:
   $$\hat{\mathbf{n}} \cdot \mathbf{v} = (0)(1) + (0)(0) + (1)(0) = 0$$
3. Compute $\hat{\mathbf{n}} \times \mathbf{v}$:
   $$\hat{\mathbf{n}} \times \mathbf{v} = \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix} \times \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} = \mathbf{k} \times \mathbf{i} = \mathbf{j} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
4. Apply Rodrigues' formula:
   $$\mathbf{v}' = \mathbf{v}\cos 90^\circ + (\hat{\mathbf{n}} \times \mathbf{v})\sin 90^\circ + \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v})(1 - \cos 90^\circ)$$
   $$\mathbf{v}' = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}(0) + \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}(1) + \begin{bmatrix} 0 \\ 0 \\ 1 \end{bmatrix}(0)(1) = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$$
Rotating the $+x$ unit vector by $90^\circ$ around $+z$ produces the $+y$ unit vector $\checkmark$.

---

#### Example 5.2: Rotation Around an Arbitrary Diagonal Axis
**Problem:** Rotate vector $\mathbf{v} = \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix}$ by $\theta = 60^\circ$ around the normalized diagonal axis $\hat{\mathbf{n}} = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$.

**Solution:**
1. Angles: $\cos 60^\circ = 0.5$, $\sin 60^\circ = \frac{\sqrt{3}}{2}$, $1 - \cos 60^\circ = 0.5$.
2. Compute dot product:
   $$\hat{\mathbf{n}} \cdot \mathbf{v} = \frac{1}{\sqrt{3}}(1 + 2 + 3) = \frac{6}{\sqrt{3}} = 2\sqrt{3}$$
3. Compute cross product $\hat{\mathbf{n}} \times \mathbf{v}$:
   $$\hat{\mathbf{n}} \times \mathbf{v} = \frac{1}{\sqrt{3}} \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 1 & 1 & 1 \\ 1 & 2 & 3 \end{vmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 3 - 2 \\ -(3 - 1) \\ 2 - 1 \end{bmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix}$$
4. Substitute into Rodrigues' formula:
   $$\mathbf{v}' = 0.5 \begin{bmatrix} 1 \\ 2 \\ 3 \end{bmatrix} + \left(\frac{\sqrt{3}}{2}\right) \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix} + 0.5 (2\sqrt{3}) \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$$
   $$= \begin{bmatrix} 0.5 \\ 1.0 \\ 1.5 \end{bmatrix} + \frac{1}{2} \begin{bmatrix} 1 \\ -2 \\ 1 \end{bmatrix} + 1.0 \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$$
   $$= \begin{bmatrix} 0.5 + 0.5 + 1.0 \\ 1.0 - 1.0 + 1.0 \\ 1.5 + 0.5 + 1.0 \end{bmatrix} = \begin{bmatrix} 2.0 \\ 1.0 \\ 3.0 \end{bmatrix}$$
5. Norm verification:
   $$\|\mathbf{v}\| = \sqrt{1^2 + 2^2 + 3^2} = \sqrt{14}$$
   $$\|\mathbf{v}'\| = \sqrt{2^2 + 1^2 + 3^2} = \sqrt{14} \quad \checkmark$$
The length is perfectly preserved.

---

#### Example 5.3: Constructing a $3 \times 3$ Rotation Matrix from Axis-Angle
**Problem:** Construct the explicit $3 \times 3$ rotation matrix for a $180^\circ$ rotation ($\theta = \pi$) around the axis $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix}$.

**Solution:**
1. Angles: $\cos\pi = -1$, $\sin\pi = 0$, $t = 1 - \cos\pi = 2$.
2. Components: $n_x = 0, n_y = 1/\sqrt{2}, n_z = 1/\sqrt{2}$.
3. Substitute into the matrix form of Rodrigues' formula:
   - $R_{11} = t n_x^2 + c = 2(0) - 1 = -1$
   - $R_{12} = t n_x n_y - s n_z = 2(0) - 0 = 0$
   - $R_{13} = t n_x n_z + s n_y = 2(0) + 0 = 0$
   - $R_{21} = t n_x n_y + s n_z = 0$
   - $R_{22} = t n_y^2 + c = 2(1/2) - 1 = 1 - 1 = 0$
   - $R_{23} = t n_y n_z - s n_x = 2(1/2) - 0 = 1$
   - $R_{31} = t n_x n_z - s n_y = 0$
   - $R_{32} = t n_y n_z + s n_x = 2(1/2) + 0 = 1$
   - $R_{33} = t n_z^2 + c = 2(1/2) - 1 = 0$
$$\mathbf{R} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$
4. Verification:
   Test $\mathbf{R} \hat{\mathbf{n}}$:
   $$\mathbf{R} \hat{\mathbf{n}} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} = \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} = \hat{\mathbf{n}} \quad \checkmark$$
The rotation axis remains invariant.

---

#### Example 5.4: Extracting Axis and Angle from Matrix
**Problem:** Given the rotation matrix:
$$\mathbf{R} = \begin{bmatrix} 0 & 0 & 1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}$$
Extract the rotation angle $\theta$ and the unit rotation axis $\hat{\mathbf{n}}$.

**Solution:**
1. Compute the trace:
   $$\text{Tr}(\mathbf{R}) = R_{11} + R_{22} + R_{33} = 0 + 0 + 0 = 0$$
2. Compute angle $\theta$:
   $$\cos\theta = \frac{\text{Tr}(\mathbf{R}) - 1}{2} = \frac{0 - 1}{2} = -\frac{1}{2}$$
   $$\theta = \arccos(-0.5) = \frac{2\pi}{3} \text{ rad} = 120^\circ$$
3. Compute $\sin\theta$:
   $$\sin(120^\circ) = \frac{\sqrt{3}}{2}$$
   $$2\sin\theta = 2\left(\frac{\sqrt{3}}{2}\right) = \sqrt{3}$$
4. Extract axis $\hat{\mathbf{n}}$:
   $$n_x = \frac{R_{32} - R_{23}}{2\sin\theta} = \frac{1 - 0}{\sqrt{3}} = \frac{1}{\sqrt{3}}$$
   $$n_y = \frac{R_{13} - R_{31}}{2\sin\theta} = \frac{1 - 0}{\sqrt{3}} = \frac{1}{\sqrt{3}}$$
   $$n_z = \frac{R_{21} - R_{12}}{2\sin\theta} = \frac{1 - 0}{\sqrt{3}} = \frac{1}{\sqrt{3}}$$
   $$\hat{\mathbf{n}} = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix}$$
*Physical Intuition:* This matrix cyclically permutes the axes: $x \to y \to z \to x$, which is a $120^\circ$ rotation around the main diagonal cube axis $(1, 1, 1) \checkmark$.

---

#### Example 5.5: Handling the $\theta = 180^\circ$ Singularity in Axis Extraction
**Problem:** Given the matrix from Example 5.3:
$$\mathbf{R} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix}$$
Show why standard axis extraction fails, and extract the axis using the $180^\circ$ fallback method.

**Solution:**
1. Trace:
   $$\text{Tr}(\mathbf{R}) = -1 + 0 + 0 = -1$$
   $$\cos\theta = \frac{-1 - 1}{2} = -1 \implies \theta = 180^\circ$$
2. Notice that $\sin(180^\circ) = 0$.
   The standard formula divides by $2\sin\theta = 0$, producing a fatal division by zero!
3. Fallback Method for $\theta = \pi$:
   For $\theta = \pi$, $\mathbf{R} = 2 \hat{\mathbf{n}}\hat{\mathbf{n}}^T - \mathbf{I}$.
   Therefore:
   $$\hat{\mathbf{n}}\hat{\mathbf{n}}^T = \frac{\mathbf{R} + \mathbf{I}}{2}$$
   $$\mathbf{R} + \mathbf{I} = \begin{bmatrix} -1 & 0 & 0 \\ 0 & 0 & 1 \\ 0 & 1 & 0 \end{bmatrix} + \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 1 & 1 \\ 0 & 1 & 1 \end{bmatrix}$$
   $$\hat{\mathbf{n}}\hat{\mathbf{n}}^T = \begin{bmatrix} 0 & 0 & 0 \\ 0 & 0.5 & 0.5 \\ 0 & 0.5 & 0.5 \end{bmatrix}$$
   From diagonal entries:
   $n_x^2 = 0 \implies n_x = 0$.
   $n_y^2 = 0.5 \implies n_y = 1/\sqrt{2}$.
   $n_z^2 = 0.5 \implies n_z = 1/\sqrt{2}$.
   Check off-diagonal: $n_y n_z = 0.5 > 0$, so $n_y$ and $n_z$ have the same sign.
   $$\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix}$$
The axis is successfully recovered without numerical division by zero $\checkmark$.

---

#### Example 5.6: Inverse of an Axis-Angle Rotation
**Problem:** If a rotation is specified by $(\hat{\mathbf{n}}, \theta)$, what are the two equivalent ways to express its inverse rotation?

**Solution:**
To undo a rotation through angle $\theta$ around axis $\hat{\mathbf{n}}$:
1. Rotate by the **negative angle** $-\theta$ around the same axis: $(\hat{\mathbf{n}}, -\theta)$.
2. Rotate by the **same angle** $\theta$ around the **inverted axis** $-\hat{\mathbf{n}}$: $(-\hat{\mathbf{n}}, \theta)$.
*Proof using Rodrigues' formula:*
In Rodrigues' formula:
- $\cos(-\theta) = \cos\theta$
- $\sin(-\theta) = -\sin\theta$
- $1 - \cos(-\theta) = 1 - \cos\theta$
The only term that changes sign is the cross product term:
$$(\hat{\mathbf{n}} \times \mathbf{v})\sin(-\theta) = -(\hat{\mathbf{n}} \times \mathbf{v})\sin\theta = ((-\hat{\mathbf{n}}) \times \mathbf{v})\sin\theta$$
Both representations produce the exact same transposed inverse matrix $\mathbf{R}^T \quad \blacksquare$.

---

#### Example 5.7: Small-Angle (Infinitesimal) Rotation Approximation
**Problem:** In physics simulation, small time steps $\Delta t$ produce tiny rotation angles $\Delta \theta \ll 1$. Derive the first-order Taylor approximation of Rodrigues' formula.

**Solution:**
For small angles $\Delta \theta \approx 0$:
$$\cos(\Delta\theta) \approx 1 - \frac{\Delta\theta^2}{2} \approx 1$$
$$\sin(\Delta\theta) \approx \Delta\theta$$
$$1 - \cos(\Delta\theta) \approx \frac{\Delta\theta^2}{2} \approx 0$$
Substitute into Rodrigues' matrix formula:
$$\mathbf{R}(\hat{\mathbf{n}}, \Delta\theta) = \mathbf{I} + \sin(\Delta\theta) [\hat{\mathbf{n}}]_{\times} + (1 - \cos(\Delta\theta)) [\hat{\mathbf{n}}]_{\times}^2$$
$$\mathbf{R}(\hat{\mathbf{n}}, \Delta\theta) \approx \mathbf{I} + \Delta\theta [\hat{\mathbf{n}}]_{\times} = \mathbf{I} + [\boldsymbol{\omega} \Delta t]_{\times}$$
where $\boldsymbol{\omega} = \frac{\Delta\theta}{\Delta t}\hat{\mathbf{n}}$ is the angular velocity vector!
This linearization is the bedrock of real-time rigid body dynamics.

---

#### Example 5.8: Rotating a Laser Pointer via Gimbal Axis-Angle
**Problem:** A turret aiming along vector $\mathbf{v}_1 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ must rotate to point at target $\mathbf{v}_2 = \begin{bmatrix} 0 \\ 0.6 \\ 0.8 \end{bmatrix}$. Find the minimal-angle rotation axis $\hat{\mathbf{n}}$ and angle $\theta$ required.

**Solution:**
1. Check magnitudes:
   $$\|\mathbf{v}_1\| = 1.0, \quad \|\mathbf{v}_2\| = \sqrt{0.6^2 + 0.8^2} = 1.0$$
2. Rotation angle $\theta$ via dot product:
   $$\mathbf{v}_1 \cdot \mathbf{v}_2 = (1)(0) + (0)(0.6) + (0)(0.8) = 0$$
   $$\cos\theta = 0 \implies \theta = 90^\circ = \frac{\pi}{2} \text{ rad}$$
3. Rotation axis $\hat{\mathbf{n}}$ via normalized cross product:
   $$\mathbf{n} = \mathbf{v}_1 \times \mathbf{v}_2 = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} \times \begin{bmatrix} 0 \\ 0.6 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 0 \\ -0.8 \\ 0.6 \end{bmatrix}$$
   $$\|\mathbf{n}\| = \sqrt{(-0.8)^2 + 0.6^2} = 1.0$$
   $$\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ -0.8 \\ 0.6 \end{bmatrix}$$

---

#### Example 5.9: Numerical Clamp Protection in Trace Extraction
**Problem:** Due to single-precision floating-point roundoff, a computed rotation matrix evaluates to trace $\text{Tr}(\mathbf{R}) = 3.0000002$.
Show what happens when extracting angle $\theta$ with and without clamping.

**Solution:**
1. Formula:
   $$\cos\theta = \frac{\text{Tr}(\mathbf{R}) - 1}{2} = \frac{3.0000002 - 1}{2} = \frac{2.0000002}{2} = 1.0000001$$
2. Without clamping:
   `Math.acos(1.0000001)` returns **`NaN`**!
3. With clamping:
   $$\text{clamped} = \min(1.0, \max(-1.0, 1.0000001)) = 1.0$$
   $$\theta = \arccos(1.0) = 0.0 \text{ rad}$$
The engine remains stable.

---

#### Example 5.10: Composition of Two Successive Axis-Angle Rotations
**Problem:** Explain why simply adding rotation vectors $\mathbf{r}_{\text{net}} \stackrel{?}{=} \theta_1 \hat{\mathbf{n}}_1 + \theta_2 \hat{\mathbf{n}}_2$ fails in 3D space.

**Solution:**
In 3D, rotations do not commute.
For example, let:
- Rotation 1: $90^\circ$ around $x$-axis ($\mathbf{r}_1 = \frac{\pi}{2}\mathbf{i}$).
- Rotation 2: $90^\circ$ around $y$-axis ($\mathbf{r}_2 = \frac{\pi}{2}\mathbf{j}$).
If vector addition were valid, the sum would be $\frac{\pi}{2}(\mathbf{i} + \mathbf{j})$.
However, multiplying their matrices:
$$\mathbf{R}_y(90^\circ) \mathbf{R}_x(90^\circ) = \begin{bmatrix} 0 & 0 & 1 \\ 0 & 1 & 0 \\ -1 & 0 & 0 \end{bmatrix} \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} = \begin{bmatrix} 0 & 1 & 0 \\ 0 & 0 & -1 \\ -1 & 0 & 0 \end{bmatrix}$$
The trace of this composite matrix is $0 + 0 + 0 = 0 \implies \cos\theta_{\text{net}} = -0.5 \implies \theta_{\text{net}} = 120^\circ$!
Yet the magnitude of $\mathbf{r}_1 + \mathbf{r}_2$ would be $\frac{\pi}{2}\sqrt{2} \approx 127.28^\circ \ne 120^\circ$.
Spatial rotations cannot be added as vectors; their composition requires non-Abelian Lie algebra (the Baker-Campbell-Hausdorff formula) or quaternions.

---

### Section 5.7 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 5.1
**Problem:** What is the invariant axis of the identity matrix $\mathbf{I}$?
**Solution:**
Because $\mathbf{I}\mathbf{v} = \mathbf{v}$ for every vector $\mathbf{v} \in \mathbb{R}^3$, every line through the origin is an invariant axis of the identity.

---

#### Exercise 5.2
**Problem:** If $\theta = 0$, what does Rodrigues' formula reduce to?
**Solution:**
For $\theta = 0$: $\cos 0 = 1, \sin 0 = 0, 1 - \cos 0 = 0$.
$$\mathbf{v}' = \mathbf{v}(1) + (\hat{\mathbf{n}} \times \mathbf{v})(0) + \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v})(0) = \mathbf{v}$$
It reduces to the identity mapping.

---

#### Exercise 5.3
**Problem:** What is the maximum possible trace of a $3 \times 3$ rotation matrix?
**Solution:**
$\text{Tr}(\mathbf{R}) = 1 + 2\cos\theta$.
Since $\cos\theta \le 1$, the maximum trace occurs at $\theta = 0$:
$$\text{Tr}_{\max} = 1 + 2(1) = 3.0$$
(Achieved only by the identity matrix $\mathbf{I}$).

---

#### Exercise 5.4
**Problem:** What is the minimum possible trace of a $3 \times 3$ rotation matrix?
**Solution:**
The minimum occurs at $\theta = \pi$ ($180^\circ$):
$$\text{Tr}_{\min} = 1 + 2\cos(\pi) = 1 - 2 = -1.0$$

---

#### Exercise 5.5
**Problem:** Prove that $[\hat{\mathbf{n}}]_{\times}^3 = -[\hat{\mathbf{n}}]_{\times}$ for any unit vector $\hat{\mathbf{n}}$.
**Solution:**
From Section 5.4: $[\hat{\mathbf{n}}]_{\times}^2 = \hat{\mathbf{n}}\hat{\mathbf{n}}^T - \mathbf{I}$.
Multiply by $[\hat{\mathbf{n}}]_{\times}$:
$$[\hat{\mathbf{n}}]_{\times}^3 = (\hat{\mathbf{n}}\hat{\mathbf{n}}^T - \mathbf{I})[\hat{\mathbf{n}}]_{\times} = \hat{\mathbf{n}}(\hat{\mathbf{n}}^T [\hat{\mathbf{n}}]_{\times}) - [\hat{\mathbf{n}}]_{\times}$$
Since $[\hat{\mathbf{n}}]_{\times} \hat{\mathbf{n}} = \hat{\mathbf{n}} \times \hat{\mathbf{n}} = \mathbf{0}$, $\hat{\mathbf{n}}^T [\hat{\mathbf{n}}]_{\times} = \mathbf{0}$.
Therefore:
$$[\hat{\mathbf{n}}]_{\times}^3 = \mathbf{0} - [\hat{\mathbf{n}}]_{\times} = -[\hat{\mathbf{n}}]_{\times} \quad \blacksquare$$

---

#### Exercise 5.6
**Problem:** Find the rotation matrix for a $90^\circ$ rotation around the $x$-axis using the matrix form of Rodrigues' formula.
**Solution:**
$\hat{\mathbf{n}} = (1, 0, 0)$, $\theta = 90^\circ$, $c = 0, s = 1, t = 1$.
$$\mathbf{R}_x(90^\circ) = \begin{bmatrix} 1(1) + 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{bmatrix}$$

---

#### Exercise 5.7
**Problem:** If a vector $\mathbf{v}$ is parallel to the rotation axis $\hat{\mathbf{n}}$, what does Rodrigues' formula evaluate to?
**Solution:**
If $\mathbf{v} = k \hat{\mathbf{n}}$:
- $\hat{\mathbf{n}} \times \mathbf{v} = \mathbf{0}$
- $\hat{\mathbf{n}} \cdot \mathbf{v} = k$
$$\mathbf{v}' = (k\hat{\mathbf{n}})\cos\theta + \mathbf{0} + \hat{\mathbf{n}}(k)(1 - \cos\theta) = k\hat{\mathbf{n}}\cos\theta + k\hat{\mathbf{n}} - k\hat{\mathbf{n}}\cos\theta = k\hat{\mathbf{n}} = \mathbf{v}$$
Vectors along the axis are completely unchanged.

---

#### Exercise 5.8
**Problem:** Can a non-zero rotation angle $\theta \in (0, 2\pi)$ have $\det(\mathbf{R}) = -1$?
**Solution:**
No. Every pure 3D rotation matrix belongs to $SO(3)$, which strictly has $\det(\mathbf{R}) = +1$. A determinant of $-1$ indicates an improper rotation (a reflection).

---

#### Exercise 5.9
**Problem:** In robotics, why is axis-angle representation often preferred over $3 \times 3$ matrices for storing joint limits?
**Solution:**
An articulated robot joint typically rotates around a single physical pin or hinge axis. Storing the axis $\hat{\mathbf{n}}$ and scalar angle $\theta$ directly maps to the motor encoder reading, allowing trivial verification of joint angle limits ($\theta_{\min} \le \theta \le \theta_{\max}$).

---

#### Exercise 5.10
**Problem:** What is the angle between the rotation axes $\hat{\mathbf{n}}$ and $-\hat{\mathbf{n}}$?
**Solution:**
$180^\circ$ ($\pi$ radians); they point in exact opposite directions.
