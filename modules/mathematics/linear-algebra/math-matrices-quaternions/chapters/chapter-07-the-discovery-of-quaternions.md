# Chapter 7: The Discovery of Quaternions and 4D Hypercomplex Algebra

> *"And here there dawned on me the notion that we must admit, in some sense, a fourth dimension of space for the purpose of calculating with triplets... An electric circuit seemed to close, and a spark flashed forth."*  
> — **Sir William Rowan Hamilton**, *Letter to his son Archibald* (August 5, 1865)

---

### Section 7.1 Historical Epiphany: Brougham Bridge, October 16, 1843

For more than a decade, the Irish Royal Astronomer Sir William Rowan Hamilton had been tormented by a mathematical obsession.

In two-dimensional space $\mathbb{R}^2$, complex numbers $z = x + i y$ (with $i^2 = -1$) had accomplished a mathematical miracle: they unified 2D vector addition with 2D rotation. Multiplying by $e^{i\theta} = \cos\theta + i\sin\theta$ seamlessly rotated points in the complex plane, preserving lengths without matrices or coordinate axes.

Hamilton sought a similar three-dimensional algebra of "triplets":
$$q = x + i y + j z$$
He wanted an algebra where multiplying two 3D triplets would rotate vectors in 3D space.

For years, Hamilton failed. Every time he attempted to multiply two triplets, he encountered cross terms like $i j$ and $j i$. If he set $i j = -j i$, the modulus (length) of the product failed to equal the product of the moduli ($\|q_1 q_2\| \ne \|q_1\| \|q_2\|$). Every morning at breakfast, his young sons would ask him:
> *"Well, Papa, can you multiply triplets yet?"*  
> To which Hamilton was forced to sadly shake his head:  
> *"No, I can only add and subtract them."*

The breakthrough came on Monday, October 16, 1843. While walking with his wife along the Royal Canal in Dublin toward the Royal Irish Academy, Hamilton realized with blinding clarity that **three dimensions were not enough**. To rotate three dimensions without distortion, one must operate in **four dimensions**! A triplet could not exist as a closed division algebra; one needed a quadruplet: a scalar real part and **three distinct imaginary units**: $i, j, k$.

In an uncontainable flash of genius, Hamilton carved the fundamental equations of this new 4D algebra into the stone masonry of Brougham (Broome) Bridge using his pocketknife:

$$i^2 = j^2 = k^2 = i j k = -1$$

```
              Hamilton's Monument on Brougham Bridge
    +---------------------------------------------------------+
    |  Here as he walked by on the 16th of October 1843       |
    |  Sir William Rowan Hamilton in a flash of genius        |
    |  discovered the fundamental formula for                 |
    |  quaternion multiplication:                             |
    |                                                         |
    |             i^2 = j^2 = k^2 = i j k = -1               |
    |                                                         |
    |  and cut it on a stone of this bridge.                  |
    +---------------------------------------------------------+
```

He named these 4-dimensional numbers **Quaternions** (from the Latin *quaterni*, meaning "four by four").

---

### Section 7.2 The Fundamental Quaternionic Identity and Non-Commutativity

From Hamilton's single master equation:
$$i^2 = j^2 = k^2 = i j k = -1$$
the complete multiplication table between the three imaginary basis units is deduced:

1. **Multiplying $i j k = -1$ by $k$ on the right:**
   $$(i j k) k = (-1) k$$
   $$i j (k^2) = -k$$
   Since $k^2 = -1$:
   $$i j (-1) = -k \implies -(i j) = -k \implies i j = k$$

2. **Multiplying $i j k = -1$ by $i$ on the left:**
   $$i (i j k) = i (-1)$$
   $$(i^2) j k = -i \implies (-1) j k = -i \implies j k = i$$

3. **Multiplying $j k = i$ by $j$ on the left:**
   $$j (j k) = j i \implies (j^2) k = j i \implies (-1) k = j i \implies j i = -k$$

Continuing this cyclic deduction yields the complete **Quaternionic Multiplication Table**:

$$\begin{cases} 
i j = k, & j i = -k \\ 
j k = i, & k j = -i \\ 
k i = j, & i k = -j 
\end{cases}$$

```
                Right-Hand Cyclic Wheel:
                        i
                       / \
                      v   \
                     k <-- j
             i*j = k       j*i = -k
             j*k = i       k*j = -i
             k*i = j       i*k = -j
```

#### Non-Commutativity:
Notice the profound property:
$$i j = -j i$$
Quaternions are **strictly non-commutative**! The order of multiplication cannot be inverted.  
Hamilton was the first mathematician in history to construct a consistent, fully functioning number system where $a b \ne b a$.

---

### Section 7.3 Quaternion Anatomy: Scalar and Vector Parts

A general quaternion $q \in \mathbb{H}$ (named $\mathbb{H}$ in honor of Hamilton) can be expressed in three equivalent notations:

1. **Hypercomplex Component Form:**
   $$q = w + x i + y j + z k, \quad w, x, y, z \in \mathbb{R}$$
2. **Scalar-Vector Pair Form:**
   $$q = (s, \mathbf{v})$$
   where $s = w \in \mathbb{R}$ is the **scalar real part**, and $\mathbf{v} = \begin{bmatrix} x \\ y \\ z \end{bmatrix} \in \mathbb{R}^3$ is the **vector imaginary part**.
3. **4D Euclidean Vector Form:**
   $$q = \begin{bmatrix} w \\ x \\ y \\ z \end{bmatrix} \in \mathbb{R}^4$$

#### Special Classes of Quaternions:
- **Purely Real Quaternion:** $\mathbf{v} = \mathbf{0} \implies q = (s, \mathbf{0}) = w$. Behaves identically to an ordinary real number.
- **Purely Imaginary (Pure) Quaternion:** $s = 0 \implies q = (0, \mathbf{v}) = x i + y j + z k$. Represents a pure 3D spatial vector embedded into $\mathbb{H}$.
- **Unit Quaternion:** A quaternion whose Euclidean norm equals 1: $\|q\| = 1$. These represent 3D spatial rotations.

---

### Section 7.4 The Hamilton Product in Vector Notation

How do we multiply two arbitrary quaternions $q_1 = (s_1, \mathbf{v}_1)$ and $q_2 = (s_2, \mathbf{v}_2)$?

Let us expand algebraically using the distributive law:
$$q_1 q_2 = (w_1 + x_1 i + y_1 j + z_1 k)(w_2 + x_2 i + y_2 j + z_2 k)$$

Multiplying out all 16 terms and grouping real and imaginary parts using Hamilton's rules:
- **Real Part:**
  $$w_1 w_2 + x_1 x_2(i^2) + y_1 y_2(j^2) + z_1 z_2(k^2)$$
  $$= w_1 w_2 - x_1 x_2 - y_1 y_2 - z_1 z_2 = s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2$$
- **Imaginary Part:**
  $$i (w_1 x_2 + x_1 w_2 + y_1 z_2 - z_1 y_2) + j (w_1 y_2 + y_1 w_2 + z_1 x_2 - x_1 z_2) + k (w_1 z_2 + z_1 w_2 + x_1 y_2 - y_1 x_2)$$
  $$= s_1 \mathbf{v}_2 + s_2 \mathbf{v}_1 + (\mathbf{v}_1 \times \mathbf{v}_2)$$

Look at this astonishing synthesis!  
The multiplication of two quaternions can be written in a single, breathtaking vector formula:

$$q_1 q_2 = (s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2, \; s_1 \mathbf{v}_2 + s_2 \mathbf{v}_1 + \mathbf{v}_1 \times \mathbf{v}_2)$$

**The dot product and the cross product—the two most fundamental operations of 3D vector geometry—are secretly the real and imaginary parts of Hamilton's product!**
Historically, Josiah Willard Gibbs and Oliver Heaviside did not invent the dot and cross products from scratch; in the 1880s, they simply severed Hamilton's quaternion product into two separate pieces.

---

### Section 7.5 Conjugate, Norm, Inverse, and the Unit 3-Sphere $\mathbb{S}^3$

Just as with 2D complex numbers, quaternions possess natural metric and inversion operations:

#### 1. The Quaternion Conjugate ($q^*$):
The conjugate of $q = (s, \mathbf{v}) = w + x i + y j + z k$ is obtained by negating the imaginary vector part:
$$q^* \equiv (s, -\mathbf{v}) = w - x i - y j - z k$$

*Properties of the Conjugate:*
- $(q^*)^* = q$
- $(p + q)^* = p^* + q^*$
- **Reversal of Product Conjugation:**
  $$(p q)^* = q^* p^*$$
  *(Notice the order flips, exactly like matrix transposes!)*

#### 2. The Squared Norm ($\|q\|^2$):
Let us multiply a quaternion by its conjugate:
$$q q^* = (s, \mathbf{v})(s, -\mathbf{v}) = (s^2 - \mathbf{v} \cdot (-\mathbf{v}), \; s(-\mathbf{v}) + s\mathbf{v} + \mathbf{v} \times (-\mathbf{v}))$$
$$= (s^2 + \|\mathbf{v}\|^2, \; \mathbf{0} + \mathbf{0}) = w^2 + x^2 + y^2 + z^2$$

Similarly, $q^* q = w^2 + x^2 + y^2 + z^2$.
The product $q q^*$ is **purely real and strictly non-negative**!

We define the **Euclidean Norm (Magnitude)** of a quaternion:
$$\|q\| \equiv \sqrt{q q^*} = \sqrt{w^2 + x^2 + y^2 + z^2}$$
And the squared norm:
$$\|q\|^2 = q q^* = q^* q = w^2 + x^2 + y^2 + z^2$$

#### 3. The Norm Multiplicative Property:
Hamilton proved that the norm of a product equals the product of the norms:
$$\|p q\| = \|p\| \|q\|$$
$$\|p q\|^2 = (p q)(p q)^* = p (q q^*) p^* = \|q\|^2 (p p^*) = \|q\|^2 \|p\|^2 = \|p\|^2 \|q\|^2$$
*(This is Euler's famous Four-Square Identity).*

#### 4. The Quaternion Inverse ($q^{-1}$):
For any non-zero quaternion $q \ne 0$, dividing the equation $q q^* = \|q\|^2$ by $\|q\|^2$ yields:
$$q \left( \frac{q^*}{\|q\|^2} \right) = 1$$

Therefore, the unique two-sided multiplicative inverse is:
$$q^{-1} = \frac{q^*}{\|q\|^2} = \frac{w - x i - y j - z k}{w^2 + x^2 + y^2 + z^2}$$

*Special Case for Unit Quaternions:*  
If $q$ is a **unit quaternion** ($\|q\| = 1$), its inverse is simply its conjugate:
$$q^{-1} = q^*$$
Just as with orthogonal rotation matrices where $\mathbf{R}^{-1} = \mathbf{R}^T$, inverting a unit rotation quaternion requires **zero floating-point divisions**—only negating three numbers!

#### 5. The Unit 3-Sphere $\mathbb{S}^3$:
The set of all unit quaternions forms a 3-dimensional manifold embedded in 4D Euclidean space:
$$\mathbb{S}^3 = \{ (w, x, y, z) \in \mathbb{R}^4 \mid w^2 + x^2 + y^2 + z^2 = 1 \}$$
This hypersphere $\mathbb{S}^3$ is a smooth Lie group (isomorphic to the special unitary group $\mathrm{SU}(2)$). It forms the double cover of $SO(3)$, providing the singularity-free foundation for all modern spatial rotation.

---

### Section 7.6 Ten Step-by-Step Worked Examples with Complete Derivations

#### Example 7.1: Basic Hamilton Product Evaluation
**Problem:** Given $q_1 = 1 + 2i - j + 3k$ and $q_2 = 2 - i + 3j - k$:
1. Compute the Hamilton product $q_1 q_2$ using hypercomplex term expansion.
2. Compute $q_1 q_2$ using the vector formula $(s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2, \; s_1 \mathbf{v}_2 + s_2 \mathbf{v}_1 + \mathbf{v}_1 \times \mathbf{v}_2)$.
3. Verify both methods yield the identical result.

**Solution:**
1. **Vector Formula Method:**
   $s_1 = 1, \mathbf{v}_1 = \begin{bmatrix} 2 \\ -1 \\ 3 \end{bmatrix}$
   $s_2 = 2, \mathbf{v}_2 = \begin{bmatrix} -1 \\ 3 \\ -1 \end{bmatrix}$
   - Scalar part:
     $$s = s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2 = (1)(2) - [(2)(-1) + (-1)(3) + (3)(-1)] = 2 - [-2 - 3 - 3] = 2 - (-8) = 10$$
   - Vector part:
     $$s_1 \mathbf{v}_2 = 1 \begin{bmatrix} -1 \\ 3 \\ -1 \end{bmatrix} = \begin{bmatrix} -1 \\ 3 \\ -1 \end{bmatrix}$$
     $$s_2 \mathbf{v}_1 = 2 \begin{bmatrix} 2 \\ -1 \\ 3 \end{bmatrix} = \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix}$$
     $$\mathbf{v}_1 \times \mathbf{v}_2 = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ 2 & -1 & 3 \\ -1 & 3 & -1 \end{vmatrix} = \begin{bmatrix} (-1)(-1) - (3)(3) \\ -((2)(-1) - (3)(-1)) \\ (2)(3) - (-1)(-1) \end{bmatrix} = \begin{bmatrix} 1 - 9 \\ -(-2 + 3) \\ 6 - 1 \end{bmatrix} = \begin{bmatrix} -8 \\ -1 \\ 5 \end{bmatrix}$$
     Sum vector parts:
     $$\mathbf{v} = \begin{bmatrix} -1 \\ 3 \\ -1 \end{bmatrix} + \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix} + \begin{bmatrix} -8 \\ -1 \\ 5 \end{bmatrix} = \begin{bmatrix} -1 + 4 - 8 \\ 3 - 2 - 1 \\ -1 + 6 + 5 \end{bmatrix} = \begin{bmatrix} -5 \\ 0 \\ 10 \end{bmatrix}$$
   $$q_1 q_2 = 10 - 5i + 0j + 10k$$

2. **Hypercomplex Term Expansion:**
   $$q_1 q_2 = (1 + 2i - j + 3k)(2 - i + 3j - k)$$
   - Real terms: $2 - 2i^2 - 3j^2 - 3k^2 = 2 - 2(-1) - 3(-1) - 3(-1) = 2 + 2 + 3 + 3 = 10 \checkmark$
   - $i$ terms: $-i + 4i + j(-k) + 3k(3j) = 3i - (-i) + 9(-i) = 3i + i - 9i = -5i \checkmark$
   - $j$ terms: $3j - 2j + 2i(-k) + 3k(-i) = j + 2(j) - 3(j) = j + 2j - 3j = 0j \checkmark$
   - $k$ terms: $-k + 6k + 2i(3j) - j(-i) = 5k + 6k - (k) = 5k + 6k - k = 10k \checkmark$
Both methods produce $10 - 5i + 10k \quad \checkmark$.

---

#### Example 7.2: Non-Commutativity Demonstration
**Problem:** For the same quaternions in Example 7.1, compute the reverse product $q_2 q_1$ and verify $q_1 q_2 \ne q_2 q_1$.

**Solution:**
Using the vector formula for $q_2 q_1$:
- Scalar part:
  $$s = s_2 s_1 - \mathbf{v}_2 \cdot \mathbf{v}_1 = (2)(1) - (-8) = 10$$
  *(The scalar part is always commutative because dot products are commutative!)*
- Vector part:
  $$s_2 \mathbf{v}_1 + s_1 \mathbf{v}_2 + \mathbf{v}_2 \times \mathbf{v}_1$$
  Notice that $\mathbf{v}_2 \times \mathbf{v}_1 = -(\mathbf{v}_1 \times \mathbf{v}_2) = \begin{bmatrix} 8 \\ 1 \\ -5 \end{bmatrix}$.
  $$\mathbf{v} = \begin{bmatrix} 4 \\ -2 \\ 6 \end{bmatrix} + \begin{bmatrix} -1 \\ 3 \\ -1 \end{bmatrix} + \begin{bmatrix} 8 \\ 1 \\ -5 \end{bmatrix} = \begin{bmatrix} 11 \\ 2 \\ 0 \end{bmatrix}$$
$$q_2 q_1 = 10 + 11i + 2j + 0k$$
Comparing:
$$q_1 q_2 = 10 - 5i + 10k \ne 10 + 11i + 2j = q_2 q_1$$
The product is strictly non-commutative.

---

#### Example 7.3: Norm and Normalization
**Problem:** Given $q = 2 + 3i - 1j + 5k$:
1. Calculate the Euclidean norm $\|q\|$.
2. Normalize $q$ to form a unit quaternion $\hat{q} \in \mathbb{S}^3$.
3. Verify that $\|\hat{q}\| = 1.0$.

**Solution:**
1. Compute squared norm:
   $$\|q\|^2 = w^2 + x^2 + y^2 + z^2 = 2^2 + 3^2 + (-1)^2 + 5^2 = 4 + 9 + 1 + 25 = 39$$
   $$\|q\| = \sqrt{39} \approx 6.244998$$
2. Normalize:
   $$\hat{q} = \frac{q}{\|q\|} = \frac{1}{\sqrt{39}}(2 + 3i - j + 5k) = \begin{bmatrix} 2/\sqrt{39} \\ 3/\sqrt{39} \\ -1/\sqrt{39} \\ 5/\sqrt{39} \end{bmatrix}$$
3. Verification:
   $$\|\hat{q}\|^2 = \left(\frac{2}{\sqrt{39}}\right)^2 + \left(\frac{3}{\sqrt{39}}\right)^2 + \left(\frac{-1}{\sqrt{39}}\right)^2 + \left(\frac{5}{\sqrt{39}}\right)^2 = \frac{4 + 9 + 1 + 25}{39} = \frac{39}{39} = 1.0 \quad \checkmark$$

---

#### Example 7.4: Quaternion Inversion
**Problem:** Find the exact multiplicative inverse of $q = 1 + 2i - 2j + 4k$.

**Solution:**
1. Conjugate:
   $$q^* = 1 - 2i + 2j - 4k$$
2. Squared norm:
   $$\|q\|^2 = 1^2 + 2^2 + (-2)^2 + 4^2 = 1 + 4 + 4 + 16 = 25$$
3. Inverse:
   $$q^{-1} = \frac{q^*}{\|q\|^2} = \frac{1}{25}(1 - 2i + 2j - 4k) = 0.04 - 0.08i + 0.08j - 0.16k$$
4. Verification:
   $$q q^{-1} = \frac{q q^*}{25} = \frac{25}{25} = 1.0 \quad \checkmark$$

---

#### Example 7.5: Product of Two Pure Imaginary Quaternions
**Problem:** Let $\mathbf{u} = \begin{bmatrix} u_x \\ u_y \\ u_z \end{bmatrix}$ and $\mathbf{v} = \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}$ be pure 3D vectors embedded as pure quaternions $p = (0, \mathbf{u})$ and $q = (0, \mathbf{v})$. Compute their Hamilton product $p q$.

**Solution:**
Apply the vector product formula with $s_1 = 0$ and $s_2 = 0$:
$$p q = (s_1 s_2 - \mathbf{u} \cdot \mathbf{v}, \; s_1 \mathbf{v} + s_2 \mathbf{u} + \mathbf{u} \times \mathbf{v})$$
$$= (0 - \mathbf{u} \cdot \mathbf{v}, \; \mathbf{0} + \mathbf{0} + \mathbf{u} \times \mathbf{v})$$
$$p q = (-\mathbf{u} \cdot \mathbf{v}, \; \mathbf{u} \times \mathbf{v})$$
This is a foundational theorem:
- The real part of the product of two pure vectors is **the negative dot product** $-\mathbf{u} \cdot \mathbf{v}$.
- The imaginary vector part is **the cross product** $\mathbf{u} \times \mathbf{v}$.

---

#### Example 7.6: Squaring a Pure Unit Vector Quaternion
**Problem:** Let $\hat{\mathbf{n}}$ be any 3D unit vector ($\|\hat{\mathbf{n}}\| = 1$). Show that the pure imaginary quaternion $q = (0, \hat{\mathbf{n}})$ is a generalized square root of $-1$.

**Solution:**
Using the formula from Example 7.5 with $\mathbf{u} = \mathbf{v} = \hat{\mathbf{n}}$:
$$q^2 = q q = (-\hat{\mathbf{n}} \cdot \hat{\mathbf{n}}, \; \hat{\mathbf{n}} \times \hat{\mathbf{n}})$$
Since $\hat{\mathbf{n}}$ is a unit vector, $\hat{\mathbf{n}} \cdot \hat{\mathbf{n}} = \|\hat{\mathbf{n}}\|^2 = 1$.
The cross product of any vector with itself is zero: $\hat{\mathbf{n}} \times \hat{\mathbf{n}} = \mathbf{0}$.
Therefore:
$$q^2 = (-1, \; \mathbf{0}) = -1$$
**Every unit vector in 3D space is a square root of $-1$!**  
In ordinary complex numbers $\mathbb{C}$, there are only two square roots of $-1$ ($+i$ and $-i$). In quaternions $\mathbb{H}$, there are **infinitely many square roots of $-1$**, forming an entire 2-sphere $\mathbb{S}^2$ of imaginary units!

---

#### Example 7.7: Verification of Multiplicative Norm Property
**Problem:** Verify Euler's identity $\|p q\| = \|p\| \|q\|$ for $p = 1 + i$ and $q = 2 - k$.

**Solution:**
1. Norms of individuals:
   $$\|p\|^2 = 1^2 + 1^2 + 0^2 + 0^2 = 2 \implies \|p\| = \sqrt{2}$$
   $$\|q\|^2 = 2^2 + 0^2 + 0^2 + (-1)^2 = 4 + 1 = 5 \implies \|q\| = \sqrt{5}$$
   $$\|p\| \|q\| = \sqrt{2} \times \sqrt{5} = \sqrt{10}$$
2. Compute product $p q$:
   $$p q = (1 + i)(2 - k) = 2 - k + 2i - i k$$
   Since $i k = -j$:
   $$p q = 2 - k + 2i - (-j) = 2 + 2i + j - k$$
3. Compute norm of product:
   $$\|p q\|^2 = 2^2 + 2^2 + 1^2 + (-1)^2 = 4 + 4 + 1 + 1 = 10$$
   $$\|p q\| = \sqrt{10}$$
Both match identically: $\|p q\| = \|p\| \|q\| = \sqrt{10} \quad \checkmark$.

---

#### Example 7.8: Matrix Representation of Quaternion Multiplication
**Problem:** The Hamilton product $q_1 q_2$ is linear in $q_2$.
Show that multiplying an arbitrary quaternion $q_2 = \begin{bmatrix} w_2 & x_2 & y_2 & z_2 \end{bmatrix}^T$ by $q_1 = \begin{bmatrix} w_1 & x_1 & y_1 & z_1 \end{bmatrix}^T$ on the left can be represented as a $4 \times 4$ matrix-vector multiplication $\mathbf{M}_L(q_1) q_2$.

**Solution:**
From the component expansion in Section 7.4:
$$\begin{bmatrix} w_{\text{out}} \\ x_{\text{out}} \\ y_{\text{out}} \\ z_{\text{out}} \end{bmatrix} = \begin{bmatrix} 
w_1 w_2 - x_1 x_2 - y_1 y_2 - z_1 z_2 \\ 
w_1 x_2 + x_1 w_2 + y_1 z_2 - z_1 y_2 \\ 
w_1 y_2 - x_1 z_2 + y_1 w_2 + z_1 x_2 \\ 
w_1 z_2 + x_1 y_2 - y_1 x_2 + z_1 w_2 
\end{bmatrix}$$
Factoring out the column vector $\begin{bmatrix} w_2 & x_2 & y_2 & z_2 \end{bmatrix}^T$:
$$\mathbf{M}_L(q_1) = \begin{bmatrix} 
w_1 & -x_1 & -y_1 & -z_1 \\ 
x_1 & w_1 & -z_1 & y_1 \\ 
y_1 & z_1 & w_1 & -x_1 \\ 
z_1 & -y_1 & x_1 & w_1 
\end{bmatrix}$$
This reveals that quaternion multiplication is an orthogonal linear transformation on $\mathbb{R}^4$.

---

#### Example 7.9: The Commutator Bracket of Pure Quaternions
**Problem:** The commutator bracket of two quaternions is defined as $[p, q] = p q - q p$.
For pure quaternions $p = (0, \mathbf{u})$ and $q = (0, \mathbf{v})$, evaluate $[p, q]$.

**Solution:**
From Example 7.5:
$$p q = (-\mathbf{u} \cdot \mathbf{v}, \; \mathbf{u} \times \mathbf{v})$$
$$q p = (-\mathbf{v} \cdot \mathbf{u}, \; \mathbf{v} \times \mathbf{u}) = (-\mathbf{u} \cdot \mathbf{v}, \; -(\mathbf{u} \times \mathbf{v}))$$
Subtracting the two expressions:
$$[p, q] = p q - q p = (-\mathbf{u} \cdot \mathbf{v} - (-\mathbf{u} \cdot \mathbf{v}), \; \mathbf{u} \times \mathbf{v} - (-(\mathbf{u} \times \mathbf{v})))$$
$$[p, q] = (0, \; 2(\mathbf{u} \times \mathbf{v}))$$
The commutator of pure quaternions is **exactly twice their cross product**!  
This establishes the direct isomorphism between the imaginary quaternions and the Lie algebra $\mathfrak{so}(3)$ of spatial rotations.

---

#### Example 7.10: Reversing the Product of Conjugates
**Problem:** Prove algebraically that $(p q)^* = q^* p^*$ for all $p, q \in \mathbb{H}$.

**Solution:**
Let $p = (s_1, \mathbf{v}_1)$ and $q = (s_2, \mathbf{v}_2)$.
1. Left side:
   $$p q = (s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2, \; s_1 \mathbf{v}_2 + s_2 \mathbf{v}_1 + \mathbf{v}_1 \times \mathbf{v}_2)$$
   Taking the conjugate negates the vector part:
   $$(p q)^* = (s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2, \; -s_1 \mathbf{v}_2 - s_2 \mathbf{v}_1 - \mathbf{v}_1 \times \mathbf{v}_2)$$
2. Right side:
   $p^* = (s_1, -\mathbf{v}_1)$ and $q^* = (s_2, -\mathbf{v}_2)$.
   $$q^* p^* = (s_2 s_1 - (-\mathbf{v}_2) \cdot (-\mathbf{v}_1), \; s_2(-\mathbf{v}_1) + s_1(-\mathbf{v}_2) + (-\mathbf{v}_2) \times (-\mathbf{v}_1))$$
   Notice that $(-\mathbf{v}_2) \cdot (-\mathbf{v}_1) = \mathbf{v}_2 \cdot \mathbf{v}_1 = \mathbf{v}_1 \cdot \mathbf{v}_2$.
   And $(-\mathbf{v}_2) \times (-\mathbf{v}_1) = \mathbf{v}_2 \times \mathbf{v}_1 = -(\mathbf{v}_1 \times \mathbf{v}_2)$.
   $$q^* p^* = (s_1 s_2 - \mathbf{v}_1 \cdot \mathbf{v}_2, \; -s_2 \mathbf{v}_1 - s_1 \mathbf{v}_2 - \mathbf{v}_1 \times \mathbf{v}_2)$$
Both sides match identically $\checkmark$.

---

### Section 7.7 Ten Granular Solved Exercises with Comprehensive Step-by-Step Solutions

#### Exercise 7.1
**Problem:** What is the value of $i j k$?
**Solution:**
By Hamilton's defining formula, $i j k = -1$.

---

#### Exercise 7.2
**Problem:** What is the product $k j$?
**Solution:**
From the cyclic table, $j k = i$, so by anti-commutativity:
$$k j = -i$$

---

#### Exercise 7.3
**Problem:** Find the conjugate of $q = 3 - 4i + 5j - 6k$.
**Solution:**
Negate the imaginary components:
$$q^* = 3 + 4i - 5j + 6k$$

---

#### Exercise 7.4
**Problem:** If $q = (0, \mathbf{v})$ is a pure quaternion, what is its conjugate $q^*$?
**Solution:**
$$q^* = (0, -\mathbf{v}) = -q$$
A pure quaternion is equal to the negative of its conjugate (skew-Hermitian).

---

#### Exercise 7.5
**Problem:** Calculate the norm of $q = \frac{1}{2} + \frac{1}{2}i + \frac{1}{2}j + \frac{1}{2}k$.
**Solution:**
$$\|q\|^2 = \left(\frac{1}{2}\right)^2 + \left(\frac{1}{2}\right)^2 + \left(\frac{1}{2}\right)^2 + \left(\frac{1}{2}\right)^2 = \frac{1}{4} + \frac{1}{4} + \frac{1}{4} + \frac{1}{4} = 1.0$$
$$\|q\| = 1.0$$
It is a unit quaternion.

---

#### Exercise 7.6
**Problem:** What is the inverse of any unit quaternion $q$?
**Solution:**
For any unit quaternion, $q^{-1} = q^*$.

---

#### Exercise 7.7
**Problem:** If $p = 2$ (a purely real scalar) and $q = 1 + i - j$, what is $p q$?
**Solution:**
Multiplying by a real scalar distributes across all components:
$$p q = 2(1 + i - j) = 2 + 2i - 2j$$

---

#### Exercise 7.8
**Problem:** Calculate $i^4$.
**Solution:**
$$i^4 = (i^2)^2 = (-1)^2 = 1$$

---

#### Exercise 7.9
**Problem:** If $q = 1 + i + j + k$, find $q + q^*$.
**Solution:**
$$q + q^* = (1 + i + j + k) + (1 - i - j - k) = 2$$
The imaginary parts cancel, leaving exactly $2 \times \text{Re}(q)$.

---

#### Exercise 7.10
**Problem:** Why can't quaternions be ordered (i.e., why can't we say $q_1 > q_2$)?
**Solution:**
In any ordered field, squares of non-zero elements must be strictly positive ($x^2 > 0$). In quaternions, $i^2 = -1 < 0$, which mathematically forbids the existence of a compatible total ordering relation.
