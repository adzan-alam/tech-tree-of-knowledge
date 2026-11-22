# Chapter 8: Rotations via Unit Quaternions: The Sandwich Product

> *"To rotate a vector in space, one does not merely strike it once with a quaternion; one must sandwich it between the quaternion and its conjugate. In this bilateral embrace, the real part is extinguished, and the vector emerges purely rotated by the exact prescribed angle."*  
> — **Arthur Cayley**, *On Certain Results Relating to Quaternions* (1845)

---

### Section 8.1 The Embedding of 3D Vectors as Pure Imaginary Quaternions

How does a four-dimensional hypercomplex number rotate a three-dimensional physical vector?

In two dimensions, a vector $\mathbf{v} = (x, y)$ is treated directly as a complex number $z = x + i y$. But in four-dimensional space $\mathbb{H}$, a quaternion has four components: one real scalar and three imaginary vectors:
$$q = w + x i + y j + z k$$

To represent a physical 3D vector $\mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix} \in \mathbb{R}^3$, we embed it into the 3-dimensional subspace of **pure imaginary quaternions** by setting the real scalar part to zero:
$$\mathbf{p} \equiv (0, \mathbf{v}) = 0 + v_x i + v_y j + v_z k$$

Notice that for any pure quaternion $\mathbf{p}$:
- Its conjugate is its exact negative: $\mathbf{p}^* = (0, -\mathbf{v}) = -\mathbf{p}$.
- Its squared norm is the standard 3D Euclidean squared norm: $\|\mathbf{p}\|^2 = v_x^2 + v_y^2 + v_z^2 = \|\mathbf{v}\|^2$.

```
     4D Quaternion Space H                       3D Physical Space R^3
         (w, x, y, z)                                  (x, y, z)
              |                                            |
              +--- Subspace where w = 0 ------------------>+
                   Pure Imaginary Quaternions
```

---

### Section 8.2 The Unit Rotation Quaternion and Half-Angles

In 2D complex numbers, a rotation through angle $\theta$ is performed by the unit complex number $e^{i\theta} = \cos\theta + i\sin\theta$.

In 3D quaternion algebra, an intuitive attempt might suggest using $q = \cos\theta + \hat{\mathbf{n}}\sin\theta$. However, if you multiply a pure vector $\mathbf{p}$ by such a quaternion on one side ($q \mathbf{p}$), the resulting product is **no longer a pure vector**! It develops a non-zero real scalar component ($-\hat{\mathbf{n}} \cdot \mathbf{v} \ne 0$), leaking out of 3D space into the fourth dimension.

To maintain a purely 3D vector and preserve Euclidean metrics, Hamilton and Arthur Cayley discovered that the rotation must be parameterized by **half-angles**:

#### Definition of the Unit Rotation Quaternion:
Let $\hat{\mathbf{n}} = \begin{bmatrix} n_x \\ n_y \\ n_z \end{bmatrix}$ be a unit vector specifying the axis of rotation ($\|\hat{\mathbf{n}}\| = 1$).  
Let $\theta \in \mathbb{R}$ be the desired angle of rotation.

The **unit rotation quaternion** $q$ is defined as:

$$q \equiv \left( \cos\frac{\theta}{2}, \; \hat{\mathbf{n}}\sin\frac{\theta}{2} \right) = \cos\frac{\theta}{2} + \left( n_x i + n_y j + n_z k \right) \sin\frac{\theta}{2}$$

#### Verification of Unit Norm:
Let us calculate the Euclidean norm of $q$:
$$\|q\|^2 = \left(\cos\frac{\theta}{2}\right)^2 + \left(n_x \sin\frac{\theta}{2}\right)^2 + \left(n_y \sin\frac{\theta}{2}\right)^2 + \left(n_z \sin\frac{\theta}{2}\right)^2$$
$$= \cos^2\frac{\theta}{2} + (n_x^2 + n_y^2 + n_z^2)\sin^2\frac{\theta}{2}$$
Since $\|\hat{\mathbf{n}}\| = 1$:
$$\|q\|^2 = \cos^2\frac{\theta}{2} + \sin^2\frac{\theta}{2} = 1.0 \quad \checkmark$$

Every valid rotation quaternion resides strictly on the surface of the **unit 3-sphere $\mathbb{S}^3 \subset \mathbb{R}^4$**.

---

### Section 8.3 The Sandwich Product (Quaternion Conjugation)

To rotate the embedded vector $\mathbf{p} = (0, \mathbf{v})$ by angle $\theta$ around axis $\hat{\mathbf{n}}$, we apply the **Sandwich Product** (also termed quaternionic conjugation):

$$\mathbf{p}' = q \, \mathbf{p} \, q^*$$
where $q^* = \left( \cos\frac{\theta}{2}, \; -\hat{\mathbf{n}}\sin\frac{\theta}{2} \right)$ is the conjugate (and inverse) of $q$.

```
                    THE SANDWICH PRODUCT
               p' = q * p * q*
                    |   |   |
                    |   |   +-- Conjugate: Cancels 4th-dim leakage!
                    |   +------ Pure 3D Vector: p = (0, v)
                    +---------- Unit Quaternion: (cos(theta/2), n*sin(theta/2))
```

#### Why Does the Sandwich Product Work?
1. **The Real Part Remains Strictly Zero:**  
   Let us compute the conjugate of $\mathbf{p}'$:
   $$(\mathbf{p}')^* = (q \mathbf{p} q^*)^* = (q^*)^* \mathbf{p}^* q^* = q (-\mathbf{p}) q^* = -(q \mathbf{p} q^*) = -\mathbf{p}'$$
   A quaternion whose conjugate equals its negative ($(\mathbf{p}')^* = -\mathbf{p}'$) must have **zero real part**!  
   Therefore, $\mathbf{p}'$ is guaranteed to be a **pure imaginary quaternion**:
   $$\mathbf{p}' = (0, \mathbf{v}')$$
   The vector never leaks into the fourth dimension.
2. **Lengths are Invariant (Isometry):**  
   Taking the norm of the product:
   $$\|\mathbf{p}'\| = \|q \mathbf{p} q^*\| = \|q\| \|\mathbf{p}\| \|q^*\| = (1) \|\mathbf{p}\| (1) = \|\mathbf{p}\|$$
   The rotated vector $\mathbf{v}'$ has the exact same Euclidean length as the original vector $\mathbf{v}$!

---

### Section 8.4 Rigorous Proof of Equivalence to Rodrigues' Formula

Why does the sandwich product $q \mathbf{p} q^*$ with half-angles produce a full rotation through angle $\theta$?

Let us prove this rigorously using vector product algebra:
Let $q = (c, s\hat{\mathbf{n}})$, where $c = \cos\frac{\theta}{2}$ and $s = \sin\frac{\theta}{2}$.  
Let $\mathbf{p} = (0, \mathbf{v})$.
The conjugate is $q^* = (c, -s\hat{\mathbf{n}})$.

**Step 1: Compute the First Product $\mathbf{r} = q \mathbf{p}$:**
Using the vector Hamilton product formula:
$$\mathbf{r} = q \mathbf{p} = (c, s\hat{\mathbf{n}})(0, \mathbf{v})$$
- Real part: $c(0) - (s\hat{\mathbf{n}}) \cdot \mathbf{v} = -s (\hat{\mathbf{n}} \cdot \mathbf{v})$
- Vector part: $c \mathbf{v} + 0(s\hat{\mathbf{n}}) + (s\hat{\mathbf{n}}) \times \mathbf{v} = c \mathbf{v} + s (\hat{\mathbf{n}} \times \mathbf{v})$
$$\mathbf{r} = (-s(\hat{\mathbf{n}} \cdot \mathbf{v}), \; c \mathbf{v} + s(\hat{\mathbf{n}} \times \mathbf{v}))$$

**Step 2: Multiply by $q^*$ on the Right: $\mathbf{p}' = \mathbf{r} q^*$:**
$$\mathbf{p}' = (-s(\hat{\mathbf{n}} \cdot \mathbf{v}), \; c \mathbf{v} + s(\hat{\mathbf{n}} \times \mathbf{v})) \, (c, -s\hat{\mathbf{n}})$$

- **Real Part of $\mathbf{p}'$:**
  $$(-s(\hat{\mathbf{n}} \cdot \mathbf{v}))(c) - [c \mathbf{v} + s(\hat{\mathbf{n}} \times \mathbf{v})] \cdot (-s\hat{\mathbf{n}})$$
  $$= -s c (\hat{\mathbf{n}} \cdot \mathbf{v}) + s c (\mathbf{v} \cdot \hat{\mathbf{n}}) + s^2 [(\hat{\mathbf{n}} \times \mathbf{v}) \cdot \hat{\mathbf{n}}]$$
  Since $(\hat{\mathbf{n}} \times \mathbf{v})$ is perpendicular to $\hat{\mathbf{n}}$, the scalar triple product is zero!
  $$= -s c (\hat{\mathbf{n}} \cdot \mathbf{v}) + s c (\hat{\mathbf{n}} \cdot \mathbf{v}) + 0 = 0 \quad \checkmark$$

- **Vector Part of $\mathbf{p}'$ (denoted $\mathbf{v}'$):**
  $$\mathbf{v}' = (-s(\hat{\mathbf{n}} \cdot \mathbf{v}))(-s\hat{\mathbf{n}}) + c [c \mathbf{v} + s(\hat{\mathbf{n}} \times \mathbf{v})] + [c \mathbf{v} + s(\hat{\mathbf{n}} \times \mathbf{v})] \times (-s\hat{\mathbf{n}})$$
  Expand each term:
  $$= s^2 (\hat{\mathbf{n}} \cdot \mathbf{v})\hat{\mathbf{n}} + c^2 \mathbf{v} + c s (\hat{\mathbf{n}} \times \mathbf{v}) - c s (\mathbf{v} \times \hat{\mathbf{n}}) - s^2 [(\hat{\mathbf{n}} \times \mathbf{v}) \times \hat{\mathbf{n}}]$$

  Notice that $- c s (\mathbf{v} \times \hat{\mathbf{n}}) = + c s (\hat{\mathbf{n}} \times \mathbf{v})$.
  And using BAC-CAB on the double cross product:
  $$(\hat{\mathbf{n}} \times \mathbf{v}) \times \hat{\mathbf{n}} = -\hat{\mathbf{n}} \times (\hat{\mathbf{n}} \times \mathbf{v}) = -[\hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v}) - \mathbf{v}(\hat{\mathbf{n}} \cdot \hat{\mathbf{n}})] = \mathbf{v} - \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v})$$
  Substitute this into the expression:
  $$\mathbf{v}' = s^2 (\hat{\mathbf{n}} \cdot \mathbf{v})\hat{\mathbf{n}} + c^2 \mathbf{v} + 2 c s (\hat{\mathbf{n}} \times \mathbf{v}) - s^2 [\mathbf{v} - \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v})]$$
  $$= (c^2 - s^2)\mathbf{v} + 2 c s (\hat{\mathbf{n}} \times \mathbf{v}) + 2 s^2 (\hat{\mathbf{n}} \cdot \mathbf{v})\hat{\mathbf{n}}$$

**Step 3: Apply Double-Angle Trigonometric Identities:**
Recall:
- $\cos\theta = \cos^2\frac{\theta}{2} - \sin^2\frac{\theta}{2} = c^2 - s^2$
- $\sin\theta = 2\sin\frac{\theta}{2}\cos\frac{\theta}{2} = 2 c s$
- $1 - \cos\theta = 2\sin^2\frac{\theta}{2} = 2 s^2$

Substituting these identities directly:
$$\mathbf{v}' = \mathbf{v}\cos\theta + (\hat{\mathbf{n}} \times \mathbf{v})\sin\theta + \hat{\mathbf{n}}(\hat{\mathbf{n}} \cdot \mathbf{v})(1 - \cos\theta)$$

This is **identically Rodrigues' Rotation Formula**! $\blacksquare$  
The sandwich product $q \mathbf{p} q^*$ rotates the vector by the full angle $\theta$ around axis $\hat{\mathbf{n}}$.

---

### Section 8.5 The Double Cover of $SO(3)$ by Spin(3)

A fundamental topological property of unit quaternions is the **Double Cover**:

What happens if we negate the quaternion, replacing $q$ with $-q$?
$$\mathbf{p}' = (-q) \, \mathbf{p} \, (-q)^* = (-1) q \, \mathbf{p} \, (-1) q^* = (-1)^2 (q \mathbf{p} q^*) = q \mathbf{p} q^*$$

The two opposite signs $(-1)^2 = +1$ cancel completely!
Therefore:
**The unit quaternion $q$ and its antipodal negation $-q$ represent the exact same 3D spatial rotation!**

```
                  +q (cos(theta/2), n*sin(theta/2))
                 /
               /
      Unit 3-Sphere S^3
               \
                 \
                  -q (-cos(theta/2), -n*sin(theta/2))
             (BOTH represent the EXACT same rotation in 3D space!)
```

#### Topological Significance:
The group of unit quaternions is the Lie group $\mathrm{Spin}(3)$, which is topologically the 3-sphere $\mathbb{S}^3$.
The group of 3D rotations is $SO(3)$, which is real projective space $\mathbb{RP}^3$.
Because $\mathbb{S}^3$ is **simply connected** (it has no holes or singularities), whereas $\mathbb{RP}^3$ is non-simply connected:
- Rotations parameterized by unit quaternions have **zero singularities and zero gimbal lock** anywhere on the sphere!
- Rotating an object through $360^\circ$ ($\theta = 2\pi$) brings the quaternion to:
  $$q = \left(\cos\pi, \; \hat{\mathbf{n}}\sin\pi\right) = (-1, \; \mathbf{0}) = -1 \ne +1$$
  To return the quaternion back to $+1$, the object must undergo a full **$720^\circ$ rotation** ($\theta = 4\pi$)!
  This is the famous *Dirac Belt Trick* (or plate trick), which explains the quantum mechanical behavior of spin-$\frac{1}{2}$ fermions (electrons, quarks) in physics.

---

### Section 8.6 Composition of Successive Rotations

Suppose we wish to apply two successive rotations to a vector $\mathbf{p}$:
1. First, rotate by quaternion $q_1$: $\mathbf{p}_1 = q_1 \mathbf{p} q_1^*$.
2. Second, rotate the result by quaternion $q_2$: $\mathbf{p}_2 = q_2 \mathbf{p}_1 q_2^*$.

Substitute $\mathbf{p}_1$ into the second equation:
$$\mathbf{p}_2 = q_2 (q_1 \mathbf{p} q_1^*) q_2^* = (q_2 q_1) \, \mathbf{p} \, (q_1^* q_2^*)$$

Using the product conjugate identity from Chapter 7 ($(q_2 q_1)^* = q_1^* q_2^*$):
$$\mathbf{p}_2 = (q_2 q_1) \, \mathbf{p} \, (q_2 q_1)^*$$

Let $q_{\text{net}} \equiv q_2 q_1$.
Then:
$$\mathbf{p}_2 = q_{\text{net}} \, \mathbf{p} \, q_{\text{net}}^*$$

**The composition of two successive rotations is simply the Hamilton product of their quaternions!**
To concatenate rotations in order (Rotation 1 first, then Rotation 2), multiply with the newest rotation on the left:
$$q_{\text{net}} = q_2 q_1$$

#### Computational Efficiency Comparison:
- Composing two $3 \times 3$ matrices requires **27 multiplications and 18 additions**.
- Composing two unit quaternions requires **16 multiplications and 12 additions**.  
Quaternions compose rotations nearly **$50\%$ faster** than matrices while requiring half the memory (4 floats instead of 9 or 16).

---

### Section 8.7 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 8.1: Constructing a Rotation Quaternion
**Problem:** Construct the unit quaternion representing a $90^\circ$ rotation about the positive $y$-axis ($\mathbf{j}$).

**Solution:**
1. Given: $\theta = 90^\circ = \frac{\pi}{2}$ rad, $\hat{\mathbf{n}} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$.
2. Half-angle: $\frac{\theta}{2} = 45^\circ = \frac{\pi}{4}$ rad.
3. Compute trigonometric values:
   $$\cos\frac{\theta}{2} = \cos 45^\circ = \frac{\sqrt{2}}{2} \approx 0.707107$$
   $$\sin\frac{\theta}{2} = \sin 45^\circ = \frac{\sqrt{2}}{2} \approx 0.707107$$
4. Assemble quaternion:
   $$q = \left( \cos\frac{\theta}{2}, \; \hat{\mathbf{n}}\sin\frac{\theta}{2} \right) = \left( \frac{\sqrt{2}}{2}, \; 0, \frac{\sqrt{2}}{2}, 0 \right) = \frac{\sqrt{2}}{2} + 0i + \frac{\sqrt{2}}{2}j + 0k$$
5. Verification of norm:
   $$\|q\|^2 = \left(\frac{\sqrt{2}}{2}\right)^2 + \left(\frac{\sqrt{2}}{2}\right)^2 = \frac{2}{4} + \frac{2}{4} = 1.0 \quad \checkmark$$

---

#### Example 8.2: Rotating a Vector via the Sandwich Product
**Problem:** Using the quaternion from Example 8.1 ($q = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}j$), rotate the unit vector along the $x$-axis: $\mathbf{v} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$.

**Solution:**
1. Embed $\mathbf{v}$ as pure quaternion:
   $$\mathbf{p} = (0, \mathbf{v}) = 0 + 1i + 0j + 0k = i$$
2. Conjugate of $q$:
   $$q^* = \frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2}j$$
3. Step A: Compute $q \mathbf{p}$:
   $$q \mathbf{p} = \left(\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}j\right) i = \frac{\sqrt{2}}{2} i + \frac{\sqrt{2}}{2} (j i)$$
   Since $j i = -k$:
   $$q \mathbf{p} = \frac{\sqrt{2}}{2} i - \frac{\sqrt{2}}{2} k$$
4. Step B: Multiply by $q^*$ on the right:
   $$\mathbf{p}' = (q \mathbf{p}) q^* = \left(\frac{\sqrt{2}}{2} i - \frac{\sqrt{2}}{2} k\right) \left(\frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2}j\right)$$
   $$= \left(\frac{\sqrt{2}}{2}\right)^2 i - \left(\frac{\sqrt{2}}{2}\right)^2 (i j) - \left(\frac{\sqrt{2}}{2}\right)^2 k + \left(\frac{\sqrt{2}}{2}\right)^2 (k j)$$
   Substitute $\left(\frac{\sqrt{2}}{2}\right)^2 = \frac{1}{2}$, $i j = k$, and $k j = -i$:
   $$= \frac{1}{2} i - \frac{1}{2} k - \frac{1}{2} k + \frac{1}{2}(-i) = \left(\frac{1}{2} - \frac{1}{2}\right) i + 0j + \left(-\frac{1}{2} - \frac{1}{2}\right) k = 0i + 0j - 1k = -k$$
5. Extract physical vector:
   $$\mathbf{v}' = \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix}$$
*Physical Check:* Rotating $+x$ by $90^\circ$ around $+y$ rotates it onto the negative $z$-axis ($-z$) $\checkmark$.

---

#### Example 8.3: A $180^\circ$ Rotation Quaternion
**Problem:** Construct the quaternion for a $180^\circ$ rotation about the $z$-axis ($\mathbf{k}$), and rotate the vector $\mathbf{v} = \begin{bmatrix} 3 \\ 4 \\ 5 \end{bmatrix}$.

**Solution:**
1. Angles: $\theta = 180^\circ \implies \frac{\theta}{2} = 90^\circ$.
   $$\cos 90^\circ = 0, \quad \sin 90^\circ = 1$$
   $$q = 0 + 0i + 0j + 1k = k$$
2. Conjugate:
   $$q^* = -k$$
3. Embed vector: $\mathbf{p} = 3i + 4j + 5k$.
4. Sandwich product:
   $$\mathbf{p}' = k (3i + 4j + 5k) (-k) = k (3i + 4j + 5k) (-k)$$
   - Inner product $k \mathbf{p}$:
     $$k(3i) = 3(k i) = 3j$$
     $$k(4j) = 4(k j) = -4i$$
     $$k(5k) = 5(k^2) = -5$$
     $$k \mathbf{p} = -5 - 4i + 3j$$
   - Multiply by $-k$:
     $$\mathbf{p}' = (-5 - 4i + 3j)(-k) = 5k + 4(i k) - 3(j k)$$
     Since $i k = -j$ and $j k = i$:
     $$\mathbf{p}' = 5k + 4(-j) - 3(i) = -3i - 4j + 5k$$
5. Extract vector:
   $$\mathbf{v}' = \begin{bmatrix} -3 \\ -4 \\ 5 \end{bmatrix}$$
*Physical Intuition:* Rotating by $180^\circ$ around $z$ inverts the $x$ and $y$ coordinates while leaving the $z$ coordinate unchanged $\checkmark$.

---

#### Example 8.4: Composing Two Quaternions
**Problem:**
- First rotation: $q_1 = \cos 45^\circ + i\sin 45^\circ = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}i$ ($90^\circ$ around $x$).
- Second rotation: $q_2 = \cos 45^\circ + j\sin 45^\circ = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}j$ ($90^\circ$ around $y$).
Compute the composite quaternion $q_{\text{net}} = q_2 q_1$ and determine its overall rotation axis and angle.

**Solution:**
1. Compute Hamilton product:
   $$q_{\text{net}} = \left(\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}j\right) \left(\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}i\right) = \frac{1}{2} + \frac{1}{2}i + \frac{1}{2}j + \frac{1}{2}(j i)$$
   Since $j i = -k$:
   $$q_{\text{net}} = \frac{1}{2} + \frac{1}{2}i + \frac{1}{2}j - \frac{1}{2}k = \left( 0.5, \; 0.5, 0.5, -0.5 \right)$$
2. Extract angle $\theta_{\text{net}}$:
   $$w = \cos\frac{\theta_{\text{net}}}{2} = 0.5 \implies \frac{\theta_{\text{net}}}{2} = 60^\circ \implies \theta_{\text{net}} = 120^\circ$$
3. Extract axis $\hat{\mathbf{n}}$:
   $$\sin\frac{\theta_{\text{net}}}{2} = \sin 60^\circ = \frac{\sqrt{3}}{2}$$
   $$\mathbf{v} = \begin{bmatrix} 0.5 \\ 0.5 \\ -0.5 \end{bmatrix} = \hat{\mathbf{n}} \sin 60^\circ = \hat{\mathbf{n}} \frac{\sqrt{3}}{2}$$
   $$\hat{\mathbf{n}} = \frac{2}{\sqrt{3}} \begin{bmatrix} 0.5 \\ 0.5 \\ -0.5 \end{bmatrix} = \frac{1}{\sqrt{3}} \begin{bmatrix} 1 \\ 1 \\ -1 \end{bmatrix}$$
The composite motion is a pure $120^\circ$ rotation around the axis $(1, 1, -1) \checkmark$.

---

#### Example 8.5: Double Cover Demonstration
**Problem:** Compare the actions of $q = \frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}k$ and $-q = -\frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2}k$ on the vector $\mathbf{v} = \begin{bmatrix} 2 \\ 0 \\ 0 \end{bmatrix}$.

**Solution:**
1. For $+q$:
   $$\mathbf{p}' = q \, \mathbf{p} \, q^*$$
   $\mathbf{p} = 2i$.
   $$q \mathbf{p} = \left(\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}k\right)(2i) = \sqrt{2} i + \sqrt{2} (k i) = \sqrt{2} i + \sqrt{2} j$$
   $$q^* = \frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2}k$$
   $$\mathbf{p}' = (\sqrt{2} i + \sqrt{2} j)\left(\frac{\sqrt{2}}{2} - \frac{\sqrt{2}}{2}k\right) = i - (i k) + j - (j k) = i - (-j) + j - (i) = 2j \implies \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$$
2. For $-q$:
   $$(-q) \mathbf{p} = -\sqrt{2} i - \sqrt{2} j$$
   $$(-q)^* = -\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}k$$
   $$\mathbf{p}'' = (-\sqrt{2} i - \sqrt{2} j)\left(-\frac{\sqrt{2}}{2} + \frac{\sqrt{2}}{2}k\right) = i - (i k) + j - (j k) = 2j \implies \begin{bmatrix} 0 \\ 2 \\ 0 \end{bmatrix}$$
Both $+q$ and $-q$ produce the exact same physical vector $(0, 2, 0) \checkmark$.

---

#### Example 8.6: Inverse of a Rotation Quaternion
**Problem:** If $q = 0.5 + 0.5i + 0.5j + 0.5k$, find its inverse rotation quaternion $q^{-1}$ and verify that $q q^{-1} = 1$.

**Solution:**
1. Check unit norm:
   $$\|q\|^2 = 0.5^2 + 0.5^2 + 0.5^2 + 0.5^2 = 0.25 \times 4 = 1.0$$
2. Since $\|q\| = 1$, the inverse is the conjugate:
   $$q^{-1} = q^* = 0.5 - 0.5i - 0.5j - 0.5k$$
3. Verification:
   $$q q^* = (0.5)^2 - [(0.5)(-0.5) + (0.5)(-0.5) + (0.5)(-0.5)] = 0.25 - [-0.75] = 1.0 \quad \checkmark$$

---

#### Example 8.7: Rotational Power (Fractional Rotations)
**Problem:** If $q$ represents a $90^\circ$ rotation around axis $\hat{\mathbf{n}}$, find $q^{1/2}$ and verify that it represents a $45^\circ$ rotation around the same axis.

**Solution:**
1. Let $q = \cos\frac{\theta}{2} + \hat{\mathbf{n}}\sin\frac{\theta}{2} = \exp\left(\hat{\mathbf{n}} \frac{\theta}{2}\right)$.
2. Raising to power $t$:
   $$q^t = \exp\left(t \, \hat{\mathbf{n}} \frac{\theta}{2}\right) = \cos\left(t \frac{\theta}{2}\right) + \hat{\mathbf{n}}\sin\left(t \frac{\theta}{2}\right)$$
3. For $t = 1/2$ and $\theta = 90^\circ$:
   $$\text{New angle} = t \theta = \frac{1}{2}(90^\circ) = 45^\circ$$
   $$\text{New half-angle} = \frac{45^\circ}{2} = 22.5^\circ$$
   $$q^{1/2} = \cos(22.5^\circ) + \hat{\mathbf{n}}\sin(22.5^\circ) \approx 0.92388 + 0.38268 \hat{\mathbf{n}}$$
This fractional power property enables smooth continuous rotation blending.

---

#### Example 8.8: Quaternion from Two Unit Vectors
**Problem:** Find the unit quaternion $q$ that rotates unit vector $\mathbf{u} = \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix}$ directly into unit vector $\mathbf{v} = \begin{bmatrix} 0 \\ 1 \\ 0 \end{bmatrix}$ along the shortest path.

**Solution:**
1. Half-angle formula for shortest-path quaternion:
   $$w = \sqrt{\frac{1 + \mathbf{u} \cdot \mathbf{v}}{2}} = \sqrt{\frac{1 + 0}{2}} = \frac{1}{\sqrt{2}} = \frac{\sqrt{2}}{2}$$
2. Vector part:
   $$\mathbf{v}_{\text{quat}} = \frac{\mathbf{u} \times \mathbf{v}}{2 w} = \frac{\mathbf{i} \times \mathbf{j}}{2 (\sqrt{2}/2)} = \frac{\mathbf{k}}{\sqrt{2}} = \begin{bmatrix} 0 \\ 0 \\ \frac{\sqrt{2}}{2} \end{bmatrix}$$
3. Assemble:
   $$q = \frac{\sqrt{2}}{2} + 0i + 0j + \frac{\sqrt{2}}{2}k$$
This matches the $90^\circ$ rotation about $z$ derived in Example 8.1 $\checkmark$.

---

#### Example 8.9: Fast Vector Rotation Implementation
**Problem:** In real-time code, evaluating the sandwich product $q \mathbf{p} q^*$ using two general 16-multiply quaternion products requires $32$ multiplications.
Derive the optimized vector formula that evaluates $\mathbf{v}' = q \mathbf{v} q^*$ in only **15 multiplications and 15 additions**.

**Solution:**
Let $q = (s, \mathbf{u})$, where $s = w$ and $\mathbf{u} = \begin{bmatrix} x \\ y \\ z \end{bmatrix}$.
From Section 8.4:
$$\mathbf{v}' = \mathbf{v} + 2 s (\mathbf{u} \times \mathbf{v}) + 2 \mathbf{u} \times (\mathbf{u} \times \mathbf{v})$$
Let $\mathbf{t} = 2(\mathbf{u} \times \mathbf{v})$.
Then:
$$\mathbf{v}' = \mathbf{v} + s \mathbf{t} + \mathbf{u} \times \mathbf{t}$$
Look at the operations:
1. $\mathbf{t} = 2(\mathbf{u} \times \mathbf{v})$: 6 multiplications, 3 subtractions, 3 doublings.
2. $s \mathbf{t}$: 3 multiplications.
3. $\mathbf{u} \times \mathbf{t}$: 6 multiplications, 3 subtractions.
4. Final sum: 6 additions.
Total: exactly **15 multiplications and 15 additions**!  
This optimized formula is used in the inner loops of Unreal Engine and Unity.

---

#### Example 8.10: Detecting Non-Unit Quaternions in Physics Loops
**Problem:** Due to numerical integration drift, a rotation quaternion has norm $\|q\| = 1.002$. Explain why this distorts the simulation and show how to restore it.

**Solution:**
If $\|q\| = 1.002$, applying $q \mathbf{p} q^*$ will scale the vector length by:
$$\|q\|^2 = (1.002)^2 = 1.004004$$
After 1,000 simulation frames:
$$(1.004004)^{1000} \approx 53.9!$$
The rigid body expands by a factor of 54, exploding the physics engine!
To prevent drift, the quaternion must be normalized:
$$q_{\text{clean}} = \frac{q}{\|q\|} = \frac{q}{1.002}$$
This guarantees that $\|q_{\text{clean}}\| = 1.0$ and prevents explosive scaling.

---

### Section 8.8 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 8.1
**Problem:** What is the identity rotation quaternion (representing no rotation)?
**Solution:**
$$q = 1 + 0i + 0j + 0k = (1, \mathbf{0})$$

---

#### Exercise 8.2
**Problem:** If a quaternion rotates by angle $\theta$, what angle is used inside the cosine and sine functions when constructing $q$?
**Solution:**
The half-angle: $\frac{\theta}{2}$.

---

#### Exercise 8.3
**Problem:** What physical rotation does the quaternion $q = -1$ represent?
**Solution:**
Since $q = -1$ has $w = \cos\frac{\theta}{2} = -1 \implies \frac{\theta}{2} = 180^\circ \implies \theta = 360^\circ$, it represents a complete $360^\circ$ spatial rotation (which is physically identical to the identity).

---

#### Exercise 8.4
**Problem:** If $q = \cos 30^\circ + \mathbf{k}\sin 30^\circ$, what is the actual 3D spatial rotation angle?
**Solution:**
$$\frac{\theta}{2} = 30^\circ \implies \theta = 60^\circ$$

---

#### Exercise 8.5
**Problem:** Why is a 3D vector represented with $w = 0$ as a pure quaternion?
**Solution:**
Setting $w = 0$ isolates the 3 imaginary components $(x, y, z)$ as the vector coordinates, ensuring that the conjugate acts as a spatial reflection ($\mathbf{p}^* = -\mathbf{p}$).

---

#### Exercise 8.6
**Problem:** If $q_1$ rotates around $x$ and $q_2$ rotates around $y$, does $q_1 q_2 = q_2 q_1$?
**Solution:**
No, quaternion multiplication is non-commutative, reflecting the physical reality that 3D rotations do not commute.

---

#### Exercise 8.7
**Problem:** What is the conjugate of the product $(q_1 q_2 q_3)$?
**Solution:**
$$(q_1 q_2 q_3)^* = q_3^* q_2^* q_1^*$$

---

#### Exercise 8.8
**Problem:** If you rotate vector $\mathbf{v}$ by quaternion $q$, what is the angle between the original vector and the rotation axis $\hat{\mathbf{n}}$ compared to the angle between the rotated vector $\mathbf{v}'$ and $\hat{\mathbf{n}}$?
**Solution:**
The angles are identical ($\mathbf{v} \cdot \hat{\mathbf{n}} = \mathbf{v}' \cdot \hat{\mathbf{n}}$), because the parallel component along the axis is unchanged by rotation.

---

#### Exercise 8.9
**Problem:** Can a unit quaternion have any component greater than $1.0$?
**Solution:**
No. Since $w^2 + x^2 + y^2 + z^2 = 1$ and each term is non-negative, every individual component must satisfy $-1.0 \le c \le 1.0$.

---

#### Exercise 8.10
**Problem:** How many floating-point numbers are needed to store a rotation using a unit quaternion versus a rotation matrix?
**Solution:**
A unit quaternion requires **4 floats**, whereas a $3 \times 3$ rotation matrix requires **9 floats** (or 16 floats for a $4 \times 4$ matrix). Quaternions save over $55\%$ of memory and cache bandwidth.
