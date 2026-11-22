# Chapter 05: Hamiltonian Mechanics, Phase Space & Liouville's Theorem

> *"In Newtonian mechanics, we track vectors of force and acceleration across Euclidean space. In Hamiltonian mechanics, we ascend to a higher mathematical plane: the symplectic manifold of phase space. Here, position and momentum are married as dual coordinates, and the flow of time preserves a sacred geometric volume. When a numerical algorithm respects this symplectic geometry, it gains a miraculous superpower: total immunity to long-term energy drift."*

---

### 5.1 The Ascension from Newton to Lagrange and Hamilton

For over a century following Newton's 1687 *Principia*, physics was dominated by vector forces: $\mathbf{F} = m\mathbf{a}$.
However, as systems grew complex—rigid bodies spinning in three dimensions, celestial systems with mutual perturbations, or constrained articulated chains—Newton's vector formulation became bogged down in cumbersome constraint forces (normal forces, tension forces, hinge reactions).

In 1788, Joseph-Louis Lagrange revolutionized physics with his *Mécanique Analytique*. Lagrange showed that by defining generalized coordinates $\mathbf{q} = (q_1, q_2, \dots, q_d) \in \mathbb{R}^d$ and formulating the **Lagrangian function** $L(\mathbf{q}, \dot{\mathbf{q}}, t)$:

$$L = T - V = \text{Kinetic Energy} - \text{Potential Energy}$$

the equations of motion could be derived from a single scalar variational principle (Hamilton's Principle of Least Action):

$$\delta \int_{t_1}^{t_2} L(\mathbf{q}, \dot{\mathbf{q}}, t) dt = 0 \implies \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_i}\right) - \frac{\partial L}{\partial q_i} = 0, \quad i \in \{1, \dots, d\}$$

Lagrange eliminated all constraint forces in a single stroke.

In 1834, Irish mathematician and astronomer Sir William Rowan Hamilton completed this intellectual ascent by introducing **Hamiltonian Mechanics**.

#### The Legendre Transformation & Canonical Momenta
Hamilton recognized that while Lagrange's formulation operates on positions $\mathbf{q}$ and velocities $\dot{\mathbf{q}}$ (the tangent bundle of configuration space), a far deeper symmetry emerges if we replace velocities with **generalized canonical conjugate momenta** $\mathbf{p} = (p_1, \dots, p_d)$:

$$p_i \equiv \frac{\partial L}{\partial \dot{q}_i}$$

For a standard non-relativistic particle of mass $m$ with Cartesian coordinates $q_i = x_i$:

$$L = \frac{1}{2} m (\dot{x}^2 + \dot{y}^2 + \dot{z}^2) - V(x, y, z) \implies p_i = m \dot{x}_i = m v_i$$

Hamilton performed a **Legendre Transformation** to construct the **Hamiltonian function** $\mathcal{H}(\mathbf{q}, \mathbf{p}, t)$:

$$\mathcal{H}(\mathbf{q}, \mathbf{p}, t) \equiv \sum_{i=1}^d p_i \dot{q}_i - L(\mathbf{q}, \dot{\mathbf{q}}, t)$$

For conservative systems where kinetic energy is quadratic in velocity and potential energy depends only on position:

$$\mathcal{H}(\mathbf{q}, \mathbf{p}) = T(\mathbf{p}) + V(\mathbf{q}) = \frac{\|\mathbf{p}\|^2}{2m} + V(\mathbf{q}) = \mathbf{\text{Total Mechanical Energy}}$$

---

### 5.2 Hamilton's Canonical Equations of Motion

Hamilton took the total differential of $\mathcal{H}(\mathbf{q}, \mathbf{p}, t)$:

$$d\mathcal{H} = \sum_{i=1}^d \left( \frac{\partial \mathcal{H}}{\partial q_i} dq_i + \frac{\partial \mathcal{H}}{\partial p_i} dp_i \right) + \frac{\partial \mathcal{H}}{\partial t} dt$$

Simultaneously, from the definition $\mathcal{H} = \sum p_i \dot{q}_i - L$:

$$d\mathcal{H} = \sum_{i=1}^d (\dot{q}_i dp_i + p_i d\dot{q}_i) - \sum_{i=1}^d \left( \frac{\partial L}{\partial q_i} dq_i + \frac{\partial L}{\partial \dot{q}_i} d\dot{q}_i \right) - \frac{\partial L}{\partial t} dt$$

Since $p_i = \frac{\partial L}{\partial \dot{q}_i}$, the $d\dot{q}_i$ terms cancel identically!
Using the Euler-Lagrange equations $\dot{p}_i = \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}_i}\right) = \frac{\partial L}{\partial q_i}$:

$$d\mathcal{H} = \sum_{i=1}^d \left( \dot{q}_i dp_i - \dot{p}_i dq_i \right) - \frac{\partial L}{\partial t} dt$$

Equating the differential coefficients yields **Hamilton's Canonical Equations of Motion**:

$$\mathbf{\dot{q}_i = +\frac{\partial \mathcal{H}}{\partial p_i}, \qquad \dot{p}_i = -\frac{\partial \mathcal{H}}{\partial q_i}}$$

```
+-------------------------------------------------------------------------+
|                  HAMILTON'S CANONICAL EQUATIONS                         |
+-------------------------------------------------------------------------+
|                                                                         |
|  dq_i / dt  = +\frac{\partial H}{\partial p_i}    (Velocity from Momenta)|
|                                                                         |
|  dp_i / dt  = -\frac{\partial H}{\partial q_i}    (Force from Position)  |
|                                                                         |
+-------------------------------------------------------------------------+
```

Look at the extraordinary elegance:
1. $2d$ coupled, first-order differential equations replace $d$ second-order equations.
2. The equations exhibit an antisymmetric, dual relationship between coordinates $q_i$ and momenta $p_i$, governed by the single scalar energy function $\mathcal{H}$.

---

### 5.3 The Geometry of Phase Space & The Symplectic Matrix

The mathematical stage upon which Hamiltonian mechanics unfolds is **Phase Space** $\mathcal{M} = \mathbb{R}^{2d}$.
A single point in phase space:

$$\mathbf{z} = \begin{bmatrix} \mathbf{q} \\ \mathbf{p} \end{bmatrix} = \begin{bmatrix} q_1 \\ \vdots \\ q_d \\ p_1 \\ \vdots \\ p_d \end{bmatrix} \in \mathbb{R}^{2d}$$

represents the complete, instantaneous microstate of the entire physical system.

We define the gradient of the Hamiltonian with respect to $\mathbf{z}$:

$$\nabla_{\mathbf{z}} \mathcal{H} = \begin{bmatrix} \nabla_{\mathbf{q}} \mathcal{H} \\ \nabla_{\mathbf{p}} \mathcal{H} \end{bmatrix} = \begin{bmatrix} \frac{\partial \mathcal{H}}{\partial q_1} \\ \vdots \\ \frac{\partial \mathcal{H}}{\partial q_d} \\ \frac{\partial \mathcal{H}}{\partial p_1} \\ \vdots \\ \frac{\partial \mathcal{H}}{\partial p_d} \end{bmatrix}$$

Hamilton's equations can now be written in unified matrix notation:

$$\mathbf{\dot{z}} = \mathbf{J} \nabla_{\mathbf{z}} \mathcal{H}(\mathbf{z})$$

Where $\mathbf{J}$ is the **Standard Symplectic Matrix** of dimension $2d \times 2d$:

$$\mathbf{J} = \begin{bmatrix} \mathbf{0}_d & \mathbf{I}_d \\ -\mathbf{I}_d & \mathbf{0}_d \end{bmatrix}$$

Where $\mathbf{I}_d$ is the $d \times d$ identity matrix and $\mathbf{0}_d$ is the $d \times d$ zero matrix.

#### Algebraic Invariants of the Symplectic Matrix $\mathbf{J}$
The matrix $\mathbf{J}$ is the geometric metric of phase space (playing a role analogous to the metric tensor $g_{\mu\nu}$ in general relativity):
1. **Skew-Symmetry:** $\mathbf{J}^T = -\mathbf{J}$.
2. **Orthogonality & Inversion:** $\mathbf{J}^T \mathbf{J} = (-\mathbf{J})\mathbf{J} = \mathbf{I}_{2d} \implies \mathbf{J}^{-1} = \mathbf{J}^T = -\mathbf{J}$.
3. **Complex Structure Property:** $\mathbf{J}^2 = -\mathbf{I}_{2d}$ (the symplectic matrix acts like the imaginary unit $i$ in linear algebra, rotating vectors by $90^\circ$ in phase space).
4. **Unit Determinant:** $\det(\mathbf{J}) = +1.0$.

---

### 5.4 The Symplectic 2-Form and Symplectic Mappings

In differential geometry, phase space is endowed with a fundamental closed, non-degenerate differential 2-form called the **Canonical Symplectic 2-Form** $\omega$:

$$\omega = \sum_{i=1}^d dq_i \wedge dp_i$$

Where $\wedge$ denotes the antisymmetric exterior wedge product ($dq \wedge dp = -dp \wedge dq$).

#### Definition of a Symplectic Mapping
Let $\Phi: \mathbb{R}^{2d} \to \mathbb{R}^{2d}$ represent a time-evolution mapping that advances the state from tick $n$ to tick $n+1$:

$$\mathbf{z}_{n+1} = \Phi(\mathbf{z}_n)$$

Let $\mathbf{M} = \nabla_{\mathbf{z}} \Phi$ represent the $2d \times 2d$ Jacobian matrix of this transformation:

$$\mathbf{M} = \frac{\partial \mathbf{z}_{n+1}}{\partial \mathbf{z}_n} = \begin{bmatrix} \frac{\partial \mathbf{q}_{n+1}}{\partial \mathbf{q}_n} & \frac{\partial \mathbf{q}_{n+1}}{\partial \mathbf{p}_n} \\ \frac{\partial \mathbf{p}_{n+1}}{\partial \mathbf{q}_n} & \frac{\partial \mathbf{p}_{n+1}}{\partial \mathbf{p}_n} \end{bmatrix}$$

The mapping $\Phi$ is defined as **Symplectic** (or **Canonical**) if and only if it preserves the symplectic 2-form $\omega$:

$$\Phi^* \omega = \omega$$

In matrix algebra, this condition is expressed by the **Symplectic Invariant Condition**:

$$\mathbf{\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}}$$

```
+-------------------------------------------------------------------------+
|                  THE SYMPLECTIC MATRIX INVARIANT                        |
+-------------------------------------------------------------------------+
|                                                                         |
|                     M^T * J * M  ===  J                                 |
|                                                                         |
|  Where M is the Jacobian matrix of the numerical integrator step, and   |
|  J is the standard symplectic block matrix.                             |
|                                                                         |
|  Any integrator satisfying this identity is a SYMPLECTIC INTEGRATOR.    |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 5.5 Liouville's Theorem: Invariance of Phase Space Volume

In 1838, French mathematician Joseph Liouville published one of the most profound conservation laws in mathematical physics: **Liouville's Theorem**.

#### Statement of Liouville's Theorem
*The phase space volume $\mathcal{V}$ of any arbitrary ensemble of states evolving under a Hamiltonian flow is strictly invariant with respect to time:*

$$\frac{d\mathcal{V}(t)}{dt} = 0$$

```
Phase Space Volume Invariance (Liouville's Theorem):
      p ^
        |      +----+
        |      | A0 | (Initial ensemble of states)
        |      +----+
        |         \
        |          \   Hamiltonian Flow:
        |           \  Volume changes shape, shearing into a filament,
        |            v but TOTAL HYPERVOLUME REMAINS 100% CONSTANT!
        |             .----.
        |            /  A1  \
        |           '--------'  Vol(A1) === Vol(A0)
        +----------------------------------------------------------> q
```

#### Analytical Proof from Vector Calculus
Consider the phase-space velocity vector field $\dot{\mathbf{z}} = \mathbf{v}_{\text{phase}} = \begin{bmatrix} \dot{\mathbf{q}} \\ \dot{\mathbf{p}} \end{bmatrix}$.
From fluid mechanics, the rate of volumetric expansion of a continuum is given by the **divergence of the velocity field**:

$$\frac{1}{\mathcal{V}} \frac{d\mathcal{V}}{dt} = \nabla_{\mathbf{z}} \cdot \mathbf{v}_{\text{phase}} = \sum_{i=1}^d \left( \frac{\partial \dot{q}_i}{\partial q_i} + \frac{\partial \dot{p}_i}{\partial p_i} \right)$$

Substitute Hamilton's canonical equations $\dot{q}_i = \frac{\partial \mathcal{H}}{\partial p_i}$ and $\dot{p}_i = -\frac{\partial \mathcal{H}}{\partial q_i}$:

$$\nabla_{\mathbf{z}} \cdot \mathbf{v}_{\text{phase}} = \sum_{i=1}^d \left( \frac{\partial}{\partial q_i}\left(\frac{\partial \mathcal{H}}{\partial p_i}\right) + \frac{\partial}{\partial p_i}\left(-\frac{\partial \mathcal{H}}{\partial q_i}\right) \right)$$

By Clairaut's Theorem (Schwarz's theorem) on the equality of mixed second partial derivatives:

$$\frac{\partial^2 \mathcal{H}}{\partial q_i \partial p_i} - \frac{\partial^2 \mathcal{H}}{\partial p_i \partial q_i} \equiv 0$$

$$\mathbf{\nabla_{\mathbf{z}} \cdot \mathbf{v}_{\text{phase}} \equiv 0}$$

The phase-space flow of every Hamiltonian system is strictly **incompressible**.

#### Algebraic Proof from the Symplectic Condition
Take the determinant of both sides of the symplectic identity $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$:

$$\det(\mathbf{M}^T \mathbf{J} \mathbf{M}) = \det(\mathbf{J})$$

Using the product rule for determinants $\det(A B) = \det(A)\det(B)$:

$$\det(\mathbf{M}^T) \cdot \det(\mathbf{J}) \cdot \det(\mathbf{M}) = \det(\mathbf{J})$$

Since $\det(\mathbf{J}) = 1 \ne 0$:

$$\det(\mathbf{M})^2 = 1 \implies \mathbf{\det(\mathbf{M}) = +1.0}$$

(The possibility $\det = -1$ corresponds to an unphysical reflection and is excluded for continuous time flows connected to identity $\Phi_0 = \mathbf{I}$).

Every symplectic mapping preserves phase-space volume identically.

---

### 5.6 Why Symplectic Integrators Possess Infinite Stability: Backward Error Analysis

We now confront the crowning theoretical jewel of computational physics:
*Why does preserving the symplectic 2-form $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$ prevent long-term energy drift?*

When we run a numerical integrator, the algorithm does not produce the exact trajectory of the true Hamiltonian $\mathcal{H}$. Truncation errors are inevitable.

In non-symplectic integrators (Forward Euler, Backward Euler, Classical RK4):
- The truncation errors are geometrically unstructured.
- The errors act as an artificial energy source (exploding the system) or an artificial friction sink (draining the system).
- Over thousands of orbits, the energy error accumulates **monotonically** without bound: $\Delta E(t) \propto t$ or $\propto e^{ct}$.

#### The Miracle of Backward Error Analysis & The Shadow Hamiltonian
In 1990, numerical analysts Sanz-Serna, Hairer, and Lubich proved a monumental property of symplectic integrators via **Backward Error Analysis**:

When a **symplectic integrator** with timestep $\Delta t$ is applied to a Hamiltonian system $\mathcal{H}(\mathbf{q}, \mathbf{p})$, the discrete trajectory $\{\mathbf{z}_0, \mathbf{z}_1, \dots\}$ produced by the computer does *not* randomly drift.
Instead, the discrete sequence is the **EXACT, 100% ANALYTICAL TRAJECTORY OF A PERTURBED "SHADOW HAMILTONIAN"** $\tilde{\mathcal{H}}$:

$$\tilde{\mathcal{H}}(\mathbf{q}, \mathbf{p}) = \mathcal{H}(\mathbf{q}, \mathbf{p}) + \Delta t \mathcal{H}_1(\mathbf{q}, \mathbf{p}) + \Delta t^2 \mathcal{H}_2(\mathbf{q}, \mathbf{p}) + O(\Delta t^3)$$

Where each $\mathcal{H}_k$ is an analytical, time-independent correction function derived from Lie commutators and Poisson brackets!

```
+-------------------------------------------------------------------------+
|                  THE SHADOW HAMILTONIAN PRINCIPLE                       |
+-------------------------------------------------------------------------+
|                                                                         |
|  True Physical Hamiltonian:      H(q, p)  = Kinetic + Potential         |
|                                                                         |
|  Discrete Symplectic Path:       z_{n+1}  = \Phi_{Symplectic}(z_n)      |
|                                                                         |
|  EQUALS EXACT CONTINUOUS FLOW:   \tilde{H} = H + dt^2 * H_2 + ...       |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### Why Energy Cannot Drift
Because the discrete simulation is the exact solution to $\tilde{\mathcal{H}}$:
1. The Shadow Energy $\tilde{\mathcal{H}}(\mathbf{z}_n)$ is **strictly and identically conserved** for all eternity!
2. The true physical energy $\mathcal{H}$ differs from $\tilde{\mathcal{H}}$ by a tiny, bounded perturbation:
   $$\mathcal{H}(\mathbf{z}_n) = \tilde{\mathcal{H}}(\mathbf{z}_n) - \Delta t^2 \mathcal{H}_2(\mathbf{z}_n) - \dots$$
3. Therefore, the true physical energy $\mathcal{H}$ **cannot drift away to infinity, nor can it decay to zero**!
4. The physical energy is permanently trapped inside a narrow, bounded corridor:
   $$|E(t) - E_0| \le C \Delta t^p \quad \forall t \in [0, \infty)$$

Even if you simulate a planetary system for **ten billion years** (trillions of steps), the planet will never spiral into the sun or fly out into interstellar space. The orbit will oscillate gently within a microscopic boundary layer of thickness $O(\Delta t^2)$, preserving physical reality across civilizational time!

---

### 5.7 Ten In-Depth Progressive Worked Examples

#### Example 5.1: Deriving Hamilton's Equations for a 1D Harmonic Oscillator
*Scenario:* A mass $m$ attached to a spring of stiffness $k$ has position $q = x$ and momentum $p = m v$.
Write the Hamiltonian $\mathcal{H}(q, p)$ and derive Hamilton's canonical equations of motion.

*Step 1: Write kinetic and potential energy in canonical coordinates:*
Kinetic energy: $T = \frac{1}{2} m v^2 = \frac{1}{2} m \left(\frac{p}{m}\right)^2 = \frac{p^2}{2m}$.
Potential energy: $V = \frac{1}{2} k q^2$.
The Hamiltonian is:
$$\mathcal{H}(q, p) = \frac{p^2}{2m} + \frac{1}{2} k q^2$$

*Step 2: Differentiate with respect to canonical coordinates:*
- Partial derivative with respect to momentum $p$:
  $$\frac{\partial \mathcal{H}}{\partial p} = \frac{2p}{2m} = \frac{p}{m}$$
- Partial derivative with respect to position $q$:
  $$\frac{\partial \mathcal{H}}{\partial q} = \frac{2kq}{2} = k q$$

*Step 3: Apply Hamilton's canonical equations:*
$$\dot{q} = +\frac{\partial \mathcal{H}}{\partial p} = \frac{p}{m} = v$$
$$\dot{p} = -\frac{\partial \mathcal{H}}{\partial q} = -k q = F(q)$$

*Sanity Check:* Differentiating $\dot{q} = \frac{p}{m}$ with respect to time gives $\ddot{q} = \frac{\dot{p}}{m} = \frac{-kq}{m} \implies m\ddot{q} = -kq$. This exactly recovers Newton's Second Law!

---

#### Example 5.2: Symplectic Matrix Construction for a 2D Particle
*Scenario:* A particle moves in 2D Euclidean space with coordinates $\mathbf{q} = (x, y)$ and momenta $\mathbf{p} = (p_x, p_y)$.
Construct the full $4 \times 4$ symplectic matrix $\mathbf{J}$ and verify that $\mathbf{J}^2 = -\mathbf{I}_4$.

*Step 1: Construct $\mathbf{J}$ using $2 \times 2$ blocks:*
Spatial dimension $d = 2$.
$$\mathbf{J} = \begin{bmatrix} \mathbf{0}_2 & \mathbf{I}_2 \\ -\mathbf{I}_2 & \mathbf{0}_2 \end{bmatrix} = \begin{bmatrix}
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1 \\
-1 & 0 & 0 & 0 \\
0 & -1 & 0 & 0
\end{bmatrix}$$

*Step 2: Compute $\mathbf{J}^2$ via block matrix multiplication:*
$$\mathbf{J}^2 = \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} = \begin{bmatrix} \mathbf{0}\cdot\mathbf{0} + \mathbf{I}(-\mathbf{I}) & \mathbf{0}\cdot\mathbf{I} + \mathbf{I}\cdot\mathbf{0} \\ -\mathbf{I}\cdot\mathbf{0} + \mathbf{0}(-\mathbf{I}) & (-\mathbf{I})\mathbf{I} + \mathbf{0}\cdot\mathbf{0} \end{bmatrix} = \begin{bmatrix} -\mathbf{I}_2 & \mathbf{0} \\ \mathbf{0} & -\mathbf{I}_2 \end{bmatrix} = -\mathbf{I}_4$$

*Conclusion:* The symplectic matrix is a hypercomplex matrix structure whose square is negative identity, confirming its role as an imaginary unit in phase space.

---

#### Example 5.3: Verifying the Symplectic Invariant for Phase-Space Rotation
*Scenario:* In a 1D harmonic oscillator with normalized coordinates ($m=1, k=1 \implies \omega=1$), the continuous time-evolution by angle $\theta = \omega t$ is a pure 2D rotation:
$$\begin{bmatrix} q(t) \\ p(t) \end{bmatrix} = \mathbf{R}(\theta) \begin{bmatrix} q_0 \\ p_0 \end{bmatrix}, \qquad \text{where } \mathbf{R}(\theta) = \begin{bmatrix} \cos \theta & \sin \theta \\ -\sin \theta & \cos \theta \end{bmatrix}$$
Verify that $\mathbf{R}(\theta)$ satisfies the symplectic condition $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$.

*Step 1: Identify Jacobian matrix $\mathbf{M}$:*
Since the transformation is linear, $\mathbf{M} = \mathbf{R}(\theta)$.
$$\mathbf{M}^T = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}$$
Symplectic matrix in 1D: $\mathbf{J} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$.

*Step 2: Compute intermediate product $\mathbf{J} \mathbf{M}$:*
$$\mathbf{J} \mathbf{M} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \begin{bmatrix} \cos \theta & \sin \theta \\ -\sin \theta & \cos \theta \end{bmatrix} = \begin{bmatrix} -\sin \theta & \cos \theta \\ -\cos \theta & -\sin \theta \end{bmatrix}$$

*Step 3: Multiply by $\mathbf{M}^T$:*
$$\mathbf{M}^T (\mathbf{J} \mathbf{M}) = \begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix} \begin{bmatrix} -\sin \theta & \cos \theta \\ -\cos \theta & -\sin \theta \end{bmatrix}$$
- Top-left element:
  $$(\cos \theta)(-\sin \theta) + (-\sin \theta)(-\cos \theta) = -\cos \theta \sin \theta + \sin \theta \cos \theta = 0$$
- Top-right element:
  $$(\cos \theta)(\cos \theta) + (-\sin \theta)(-\sin \theta) = \cos^2 \theta + \sin^2 \theta = 1$$
- Bottom-left element:
  $$(\sin \theta)(-\sin \theta) + (\cos \theta)(-\cos \theta) = -\sin^2 \theta - \cos^2 \theta = -1$$
- Bottom-right element:
  $$(\sin \theta)(\cos \theta) + (\cos \theta)(-\sin \theta) = \sin \theta \cos \theta - \cos \theta \sin \theta = 0$$

$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \equiv \mathbf{J}$$
$\blacksquare$ Exact physical harmonic rotation is proven to be an exact symplectic mapping.

---

#### Example 5.4: Proving Forward Euler Violates Symplectic Invariance
*Scenario:* The Forward Euler mapping for $\ddot{x} = -\omega^2 x$ has state matrix $\mathbf{M} = \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$.
Evaluate $\mathbf{M}^T \mathbf{J} \mathbf{M}$ and calculate the symplectic violation error matrix.

*Step 1: Compute $\mathbf{M}^T$:*
$$\mathbf{M}^T = \begin{bmatrix} 1 & -\omega^2 \Delta t \\ \Delta t & 1 \end{bmatrix}$$

*Step 2: Compute $\mathbf{J} \mathbf{M}$:*
$$\mathbf{J} \mathbf{M} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} = \begin{bmatrix} -\omega^2 \Delta t & 1 \\ -1 & -\Delta t \end{bmatrix}$$

*Step 3: Compute $\mathbf{M}^T \mathbf{J} \mathbf{M}$:*
$$\mathbf{M}^T (\mathbf{J} \mathbf{M}) = \begin{bmatrix} 1 & -\omega^2 \Delta t \\ \Delta t & 1 \end{bmatrix} \begin{bmatrix} -\omega^2 \Delta t & 1 \\ -1 & -\Delta t \end{bmatrix}$$
- Element (1, 1): $(1)(-\omega^2 \Delta t) + (-\omega^2 \Delta t)(-1) = -\omega^2 \Delta t + \omega^2 \Delta t = 0$.
- Element (1, 2): $(1)(1) + (-\omega^2 \Delta t)(-\Delta t) = 1 + \omega^2 \Delta t^2$.
- Element (2, 1): $(\Delta t)(-\omega^2 \Delta t) + (1)(-1) = -\omega^2 \Delta t^2 - 1 = -(1 + \omega^2 \Delta t^2)$.
- Element (2, 2): $(\Delta t)(1) + (1)(-\Delta t) = \Delta t - \Delta t = 0$.

$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \begin{bmatrix} 0 & 1 + \omega^2 \Delta t^2 \\ -(1 + \omega^2 \Delta t^2) & 0 \end{bmatrix} = (1 + \omega^2 \Delta t^2) \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} = (1 + \omega^2 \Delta t^2) \mathbf{J}$$

*Error Matrix:*
$$\mathbf{E}_{\text{symp}} = \mathbf{M}^T \mathbf{J} \mathbf{M} - \mathbf{J} = \omega^2 \Delta t^2 \mathbf{J} \ne \mathbf{0}$$
The symplectic condition fails by an error of magnitude $\omega^2 \Delta t^2$. This algebraic discrepancy directly drives Forward Euler's energy explosion.

---

#### Example 5.5: Proving Backward Euler Violates Symplectic Invariance
*Scenario:* The Backward Euler state matrix is $\mathbf{M} = \frac{1}{1 + \omega^2 \Delta t^2} \begin{bmatrix} 1 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$.
Evaluate $\mathbf{M}^T \mathbf{J} \mathbf{M}$.

*Step 1: Apply scalar factoring:*
Let $c = \frac{1}{1 + \omega^2 \Delta t^2}$. Then $\mathbf{M} = c \mathbf{M}_{\text{Forward}}$.
$$\mathbf{M}^T \mathbf{J} \mathbf{M} = (c \mathbf{M}_{\text{Forward}}^T) \mathbf{J} (c \mathbf{M}_{\text{Forward}}) = c^2 (\mathbf{M}_{\text{Forward}}^T \mathbf{J} \mathbf{M}_{\text{Forward}})$$

*Step 2: Substitute result from Example 5.4:*
$$\mathbf{M}^T \mathbf{J} \mathbf{M} = c^2 \cdot (1 + \omega^2 \Delta t^2) \mathbf{J} = \left(\frac{1}{1 + \omega^2 \Delta t^2}\right)^2 (1 + \omega^2 \Delta t^2) \mathbf{J}$$
$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \frac{1}{1 + \omega^2 \Delta t^2} \mathbf{J} \ne \mathbf{J}$$

*Conclusion:* Backward Euler scales the symplectic metric by $\frac{1}{1 + \omega^2 \Delta t^2} < 1$, mathematically proving why it contracts phase space and destroys physical energy.

---

#### Example 5.6: Proof of Symplecticity for Semi-Implicit Euler
*Scenario:* Recall the "accidental" swapped code from Example 3.10:
$$\mathbf{M}_{\text{Symplectic}} = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix}$$
(Semi-Implicit / Symplectic Euler).
Evaluate $\mathbf{M}^T \mathbf{J} \mathbf{M}$ and verify whether it satisfies the symplectic invariant condition $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$.

*Step 1: Compute $\mathbf{M}^T$:*
$$\mathbf{M}^T = \begin{bmatrix} 1 - \omega^2 \Delta t^2 & -\omega^2 \Delta t \\ \Delta t & 1 \end{bmatrix}$$

*Step 2: Compute $\mathbf{J} \mathbf{M}$:*
$$\mathbf{J} \mathbf{M} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \begin{bmatrix} 1 - \omega^2 \Delta t^2 & \Delta t \\ -\omega^2 \Delta t & 1 \end{bmatrix} = \begin{bmatrix} -\omega^2 \Delta t & 1 \\ -(1 - \omega^2 \Delta t^2) & -\Delta t \end{bmatrix}$$

*Step 3: Multiply $\mathbf{M}^T (\mathbf{J} \mathbf{M})$:*
- Element (1, 1):
  $$(1 - \omega^2 \Delta t^2)(-\omega^2 \Delta t) + (-\omega^2 \Delta t)(-(1 - \omega^2 \Delta t^2)) = -\omega^2 \Delta t(1 - \omega^2 \Delta t^2) + \omega^2 \Delta t(1 - \omega^2 \Delta t^2) = 0$$
- Element (1, 2):
  $$(1 - \omega^2 \Delta t^2)(1) + (-\omega^2 \Delta t)(-\Delta t) = 1 - \omega^2 \Delta t^2 + \omega^2 \Delta t^2 = 1$$
- Element (2, 1):
  $$(\Delta t)(-\omega^2 \Delta t) + (1)(-(1 - \omega^2 \Delta t^2)) = -\omega^2 \Delta t^2 - 1 + \omega^2 \Delta t^2 = -1$$
- Element (2, 2):
  $$(\Delta t)(1) + (1)(-\Delta t) = \Delta t - \Delta t = 0$$

$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \equiv \mathbf{J}$$

*Monumental Result:* The product is **identically and exactly equal to $\mathbf{J}$**!
Semi-Implicit Euler is an **exact symplectic integrator**. It satisfies the symplectic invariant condition with zero error, explaining why it conserves energy over millions of steps!

---

#### Example 5.7: Deriving the Shadow Hamiltonian of Semi-Implicit Euler
*Scenario:* For a 1D harmonic oscillator with true Hamiltonian $\mathcal{H}(q, p) = \frac{1}{2} p^2 + \frac{1}{2} \omega^2 q^2$, find the exact modified "Shadow Hamiltonian" $\tilde{\mathcal{H}}$ that Semi-Implicit Euler conserves.

*Step 1: Set up the discrete invariant quadratic form:*
We search for an invariant energy function $\tilde{\mathcal{H}}(q, p) = A q^2 + B q p + C p^2$ such that:
$$\tilde{\mathcal{H}}(q_{n+1}, p_{n+1}) = \tilde{\mathcal{H}}(q_n, p_n)$$
Semi-Implicit Euler equations:
$$p_{n+1} = p_n - \omega^2 \Delta t q_n$$
$$q_{n+1} = q_n + \Delta t p_{n+1} = q_n + \Delta t p_n - \omega^2 \Delta t^2 q_n$$

*Step 2: Evaluate the true Hamiltonian after one step:*
$$\mathcal{H}_{n+1} = \frac{1}{2} p_{n+1}^2 + \frac{1}{2} \omega^2 q_{n+1}^2$$
Substitute equations:
$$\frac{1}{2} p_{n+1}^2 = \frac{1}{2} (p_n - \omega^2 \Delta t q_n)^2 = \frac{1}{2} p_n^2 - \omega^2 \Delta t q_n p_n + \frac{1}{2} \omega^4 \Delta t^2 q_n^2$$
$$\frac{1}{2} \omega^2 q_{n+1}^2 = \frac{1}{2} \omega^2 (q_n + \Delta t p_{n+1})^2 = \frac{1}{2} \omega^2 q_n^2 + \omega^2 \Delta t q_n p_{n+1} + \frac{1}{2} \omega^2 \Delta t^2 p_{n+1}^2$$
Substitute $p_{n+1} = p_n - \omega^2 \Delta t q_n$:
Notice the cross-term $\omega^2 \Delta t q_n p_n$ appears with opposite sign!
Combining terms reveals that the quantity strictly conserved by Semi-Implicit Euler is:
$$\tilde{\mathcal{H}}(q, p) = \frac{1}{2} p^2 + \frac{1}{2} \omega^2 q^2 - \frac{1}{2} \omega^2 \Delta t q p$$

$$\mathbf{\tilde{\mathcal{H}}(q, p) = \mathcal{H}(q, p) - \frac{1}{2} \Delta t (\omega^2 q p)}$$

*Profound Insight:*
Semi-Implicit Euler does not drift. It conserves the true energy $\mathcal{H}$ minus a tiny perturbation $-\frac{1}{2}\Delta t \omega^2 q p$ **with exact 100% precision on every step**! Because $q$ and $p$ oscillate periodically, the perturbation oscillates boundedly around zero, guaranteeing that the true energy never escapes!

---

#### Example 5.8: Phase Space Area Preservation Under a Shear Mapping
*Scenario:* A coordinate shear in phase space is defined by:
$$q_{n+1} = q_n + c \cdot p_n, \qquad p_{n+1} = p_n$$
(which corresponds physically to free particle ballistic drift: $x_{n+1} = x_n + \frac{\Delta t}{m} p_n$).
Show that this transformation is symplectic and preserves phase-space area for any arbitrary value of $c \in \mathbb{R}$.

*Step 1: Compute Jacobian matrix $\mathbf{M}$:*
$$\mathbf{M} = \begin{bmatrix} \frac{\partial q_{n+1}}{\partial q_n} & \frac{\partial q_{n+1}}{\partial p_n} \\ \frac{\partial p_{n+1}}{\partial q_n} & \frac{\partial p_{n+1}}{\partial p_n} \end{bmatrix} = \begin{bmatrix} 1 & c \\ 0 & 1 \end{bmatrix}$$

*Step 2: Check determinant:*
$$\det(\mathbf{M}) = (1)(1) - (c)(0) = 1.000000$$
Phase space area is strictly conserved.

*Step 3: Check symplectic condition $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$:*
$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \begin{bmatrix} 1 & 0 \\ c & 1 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \begin{bmatrix} 1 & c \\ 0 & 1 \end{bmatrix}$$
$$\begin{bmatrix} 1 & 0 \\ c & 1 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ -1 & -c \end{bmatrix} = \begin{bmatrix} (1)(0) + (0)(-1) & (1)(1) + (0)(-c) \\ (c)(0) + (1)(-1) & (c)(1) + (1)(-c) \end{bmatrix} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} \equiv \mathbf{J}$$
$\blacksquare$ The drift shear is an exact symplectic mapping.

---

#### Example 5.9: Keplerian Two-Body Problem in Canonical Coordinates
*Scenario:* Two celestial bodies of masses $m_1$ and $m_2$ interact via Newton's gravitational law.
Reduce the system to an equivalent 1-body Hamiltonian in relative coordinates $\mathbf{r} = \mathbf{r}_1 - \mathbf{r}_2$.

*Step 1: Reduced mass $\mu$ and total mass $M$:*
$$M = m_1 + m_2, \qquad \mu = \frac{m_1 m_2}{m_1 + m_2}$$

*Step 2: Canonical momentum:*
$$\mathbf{p} = \mu \dot{\mathbf{r}}$$

*Step 3: Formulate Hamiltonian $\mathcal{H}(\mathbf{r}, \mathbf{p})$:*
$$\mathcal{H}(\mathbf{r}, \mathbf{p}) = \frac{\|\mathbf{p}\|^2}{2\mu} - \frac{G m_1 m_2}{\|\mathbf{r}\|}$$

*Step 4: Hamilton's canonical equations:*
$$\dot{\mathbf{r}} = \nabla_{\mathbf{p}} \mathcal{H} = \frac{\mathbf{p}}{\mu}$$
$$\dot{\mathbf{p}} = -\nabla_{\mathbf{r}} \mathcal{H} = -\frac{G m_1 m_2}{\|\mathbf{r}\|^3} \mathbf{r}$$
This pristine formulation forms the basis for symplectic celestial integrators used by NASA and ESA for multi-century interplanetary trajectory plotting.

---

#### Example 5.10: Poincaré Recurrence in Bounded Hamiltonian Systems
*Scenario:* State Poincaré's Recurrence Theorem. Explain why a symplectic integrator executing on a double-precision floating-point computer will eventually return arbitrarily close to its initial microstate, whereas a dissipative integrator (like Backward Euler) can never recur.

*Step 1: Statement of Poincaré's Recurrence Theorem (1890):*
Let $g$ be a volume-preserving continuous mapping of a bounded phase space $\mathcal{M}$ into itself ($\mathcal{V}(\mathcal{M}) < \infty$).
For every open neighborhood $U \subset \mathcal{M}$, there exists an infinite sequence of discrete times $n_k \to \infty$ such that the trajectory returns to $U$:
$$g^{n_k}(\mathbf{z}_0) \in U$$

*Step 2: Symplectic Integrator Recurrence:*
Because a symplectic integrator preserves phase-space volume ($\det(\mathbf{J}) \equiv 1$) and conserves a bounded shadow energy surface $\tilde{\mathcal{H}} = E_0$, the trajectory is confined to a compact energy hypersurface.
By Poincaré's theorem, the system is mathematically guaranteed to exhibit recurrence: it will eventually visit states within distance $\epsilon$ of its starting state $\mathbf{z}_0$.

*Step 3: Failure of Backward Euler to Recur:*
Under Backward Euler, phase-space volume contracts monotonically: $\det(\mathbf{J}) < 1$.
The volume shrinks to zero, and mechanical energy decays monotonically: $E_{n+1} < E_n$.
Because energy is strictly non-increasing, the system cannot re-enter the higher-energy neighborhood of its initial condition $\mathbf{z}_0$. Recurrence is physically and geometrically impossible.

---

### 5.8 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 5.1 – 5.2)

##### Exercise 5.1
Explain the physical difference between Lagrangian mechanics and Hamiltonian mechanics. Why are generalized coordinates $\mathbf{q}$ and canonical conjugate momenta $\mathbf{p}$ treated as independent variables in phase space?

##### Exercise 5.2
State **Liouville's Theorem**. Why does the incompressibility of phase space ($\nabla \cdot \mathbf{v}_{\text{phase}} = 0$) guarantee that conservative physical systems never possess attracting fixed points or limit cycles?

---

#### Tier 2: Mathematical Derivations & Symplectic Matrix (Exercises 5.3 – 5.4)

##### Exercise 5.3
For a 3D physical system ($d = 3$):
1. Write the $6 \times 6$ standard symplectic matrix $\mathbf{J}$.
2. Prove algebraically that $\mathbf{J}^{-1} = -\mathbf{J}$.
3. Prove that $\det(\mathbf{J}) = +1.0$.

##### Exercise 5.4
A momentum impulse kick updates momentum while leaving position unchanged:
$$\mathbf{q}_{n+1} = \mathbf{q}_n, \qquad \mathbf{p}_{n+1} = \mathbf{p}_n + \Delta t \mathbf{F}(\mathbf{q}_n)$$
Prove that this "kick" mapping is strictly symplectic by verifying $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$.

---

#### Tier 3: Backward Error Analysis & Shadow Hamiltonians (Exercises 5.5 – 5.6)

##### Exercise 5.5
Explain the concept of a **Shadow (Modified) Hamiltonian** in Backward Error Analysis. Why does the existence of a shadow Hamiltonian prevent secular energy drift in symplectic simulations?

##### Exercise 5.6
For the 1D harmonic oscillator with Shadow Hamiltonian derived in Example 5.7:
$$\tilde{\mathcal{H}}(q, p) = \frac{1}{2} p^2 + \frac{1}{2} \omega^2 q^2 - \frac{1}{2} \omega^2 \Delta t q p$$
Show that the maximum fluctuation of the true physical energy $\mathcal{H} = \frac{1}{2} p^2 + \frac{1}{2} \omega^2 q^2$ along any trajectory is bounded by:
$$|\mathcal{H} - \tilde{\mathcal{H}}| \le \frac{1}{2} \omega \Delta t \tilde{\mathcal{H}} + O(\Delta t^2)$$

---

#### Tier 4: Divergence & Volume Preservation (Exercises 5.7 – 5.8)

##### Exercise 5.7
Consider an unphysical force field $\mathbf{F} = -k \mathbf{x} + \alpha (\mathbf{x} \cdot \mathbf{v}) \mathbf{v}$.
Compute the divergence of the resulting phase space vector field $\nabla_{\mathbf{z}} \cdot \dot{\mathbf{z}}$. For what value of $\alpha$ does this system satisfy Liouville's theorem?

##### Exercise 5.8
Explain why classical Runge-Kutta 4 (RK4) is **not symplectic**, even though it has a high local truncation error of $O(\Delta t^5)$. What happens to a planetary orbit simulated with RK4 over 100,000 orbits?

---

#### Tier 5: Symplectic Geometry & Canonical Invariants (Exercises 5.9 – 5.10)

##### Exercise 5.9
Prove that any linear mapping $\mathbf{z}_{n+1} = \mathbf{M} \mathbf{z}_n$ on a 2D phase space ($d = 1$) is symplectic if and only if $\det(\mathbf{M}) = 1.0$. Explain why this equivalence fails for higher dimensions ($d \ge 2$).

##### Exercise 5.10
In celestial mechanics, the Jacobi Integral $C_J$ is a conserved quantity in the Circular Restricted Three-Body Problem (CR3BP).
Explain how a symplectic integrator preserves the zero-velocity surfaces (Roche lobes) that prevent a spacecraft from escaping a gravitational Lagrange point, whereas a non-symplectic integrator breaches these barriers.

---

### 5.9 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 5.1
*Lagrangian vs. Hamiltonian Mechanics:*
- **Lagrangian Mechanics:** Operates in configuration space $\mathbb{R}^d$ parameterized by generalized coordinates $\mathbf{q}$ and generalized velocities $\dot{\mathbf{q}}$. It is formulated via the single variational action principle $\delta \int L dt = 0$, producing $d$ second-order differential equations. Velocities $\dot{\mathbf{q}}$ are defined explicitly as time derivatives of position: $\dot{\mathbf{q}} = \frac{d\mathbf{q}}{dt}$.
- **Hamiltonian Mechanics:** Operates in phase space $\mathbb{R}^{2d}$ parameterized by coordinates $\mathbf{q}$ and canonical conjugate momenta $\mathbf{p} = \frac{\partial L}{\partial \dot{\mathbf{q}}}$. It produces $2d$ coupled first-order differential equations.

*Why Treated as Independent Variables:*
In phase space, $\mathbf{q}$ and $\mathbf{p}$ are mathematically treated as completely independent coordinate axes. A point in phase space specifies both where a particle is ($\mathbf{q}$) and how it moves ($\mathbf{p}$) simultaneously. This geometric independence allows time evolution to be viewed as a volume-preserving flow along the symplectic manifold, revealing conservation laws (Noether's theorem) and geometric invariants invisible in configuration space.

---

#### Solution to Exercise 5.2
*Liouville's Theorem:* For any Hamiltonian physical system, the phase-space volume of any arbitrary ensemble of states is strictly invariant under time evolution:
$$\frac{d\mathcal{V}}{dt} = 0 \iff \nabla_{\mathbf{z}} \cdot \dot{\mathbf{z}} = 0$$

*Impossibility of Attracting Fixed Points:*
An **attracting fixed point** (or sink) is a state $\mathbf{z}^*$ where nearby trajectories converge inward over time:
$$\lim_{t \to \infty} \mathbf{z}(t) = \mathbf{z}^*$$
If a system has an attracting fixed point, any initial volume $\mathcal{V}_0$ enclosing a neighborhood around that point must shrink toward zero: $\lim_{t \to \infty} \mathcal{V}(t) = 0$.
However, Liouville's theorem proves that $\frac{d\mathcal{V}}{dt} \equiv 0$ (the volume can never shrink).
Therefore, **conservative Hamiltonian systems cannot possess attractors, asymptotic sinks, or stable limit cycles**. All motion must be conservative, closed, quasi-periodic, or chaotic.

---

#### Solution to Exercise 5.3
*Part 1: $6 \times 6$ Standard Symplectic Matrix ($d = 3$):*
$$\mathbf{J} = \begin{bmatrix} \mathbf{0}_3 & \mathbf{I}_3 \\ -\mathbf{I}_3 & \mathbf{0}_3 \end{bmatrix} = \begin{bmatrix}
0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 \\
-1 & 0 & 0 & 0 & 0 & 0 \\
0 & -1 & 0 & 0 & 0 & 0 \\
0 & 0 & -1 & 0 & 0 & 0
\end{bmatrix}$$

*Part 2: Prove $\mathbf{J}^{-1} = -\mathbf{J}$:*
Multiply $\mathbf{J}$ by $-\mathbf{J}$:
$$\mathbf{J}(-\mathbf{J}) = -\mathbf{J}^2 = -\begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} = -\begin{bmatrix} -\mathbf{I} & \mathbf{0} \\ \mathbf{0} & -\mathbf{I} \end{bmatrix} = -(-\mathbf{I}_6) = \mathbf{I}_6$$
Since $\mathbf{J}(-\mathbf{J}) = \mathbf{I}_6$, the inverse is $\mathbf{J}^{-1} = -\mathbf{J} = \mathbf{J}^T$.
$\blacksquare$

*Part 3: Prove $\det(\mathbf{J}) = +1.0$:*
Using the block determinant formula for $\begin{bmatrix} \mathbf{A} & \mathbf{B} \\ \mathbf{C} & \mathbf{D} \end{bmatrix}$ when $\mathbf{A} = \mathbf{0}$:
$$\det\begin{bmatrix} \mathbf{0} & \mathbf{I}_3 \\ -\mathbf{I}_3 & \mathbf{0} \end{bmatrix} = \det(-(-\mathbf{I}_3)\mathbf{I}_3) = \det(\mathbf{I}_3 \cdot \mathbf{I}_3) = \det(\mathbf{I}_3) = +1.0$$
$\blacksquare$

---

#### Solution to Exercise 5.4
*Proof that a Momentum Kick is Symplectic:*
Given: $\mathbf{q}_{n+1} = \mathbf{q}_n$, $\mathbf{p}_{n+1} = \mathbf{p}_n + \Delta t \mathbf{F}(\mathbf{q}_n)$.
The Jacobian matrix $\mathbf{M}$ is:
$$\mathbf{M} = \begin{bmatrix} \frac{\partial \mathbf{q}_{n+1}}{\partial \mathbf{q}_n} & \frac{\partial \mathbf{q}_{n+1}}{\partial \mathbf{p}_n} \\ \frac{\partial \mathbf{p}_{n+1}}{\partial \mathbf{q}_n} & \frac{\partial \mathbf{p}_{n+1}}{\partial \mathbf{p}_n} \end{bmatrix} = \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ \Delta t \frac{\partial \mathbf{F}}{\partial \mathbf{q}} & \mathbf{I} \end{bmatrix}$$
Let $\mathbf{K} = \Delta t \frac{\partial \mathbf{F}}{\partial \mathbf{q}}$. For a conservative force $\mathbf{F} = -\nabla V$, $\mathbf{K} = -\Delta t \nabla^2 V$ is symmetric ($\mathbf{K}^T = \mathbf{K}$).
$$\mathbf{M} = \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ \mathbf{K} & \mathbf{I} \end{bmatrix}, \qquad \mathbf{M}^T = \begin{bmatrix} \mathbf{I} & \mathbf{K} \\ \mathbf{0} & \mathbf{I} \end{bmatrix}$$

Evaluate $\mathbf{M}^T \mathbf{J} \mathbf{M}$:
$$\mathbf{J} \mathbf{M} = \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} \begin{bmatrix} \mathbf{I} & \mathbf{0} \\ \mathbf{K} & \mathbf{I} \end{bmatrix} = \begin{bmatrix} \mathbf{K} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix}$$
$$\mathbf{M}^T (\mathbf{J} \mathbf{M}) = \begin{bmatrix} \mathbf{I} & \mathbf{K} \\ \mathbf{0} & \mathbf{I} \end{bmatrix} \begin{bmatrix} \mathbf{K} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} = \begin{bmatrix} \mathbf{I}\mathbf{K} + \mathbf{K}(-\mathbf{I}) & \mathbf{I}\cdot\mathbf{I} + \mathbf{K}\cdot\mathbf{0} \\ \mathbf{0}\cdot\mathbf{K} + \mathbf{I}(-\mathbf{I}) & \mathbf{0}\cdot\mathbf{I} + \mathbf{I}\cdot\mathbf{0} \end{bmatrix} = \begin{bmatrix} \mathbf{K} - \mathbf{K} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} = \begin{bmatrix} \mathbf{0} & \mathbf{I} \\ -\mathbf{I} & \mathbf{0} \end{bmatrix} \equiv \mathbf{J}$$
$\blacksquare$ The momentum kick mapping is strictly and unconditionally symplectic!

---

#### Solution to Exercise 5.5
*Shadow Hamiltonian Concept:*
In Backward Error Analysis, instead of comparing the numerical trajectory to the true Hamiltonian $\mathcal{H}$, we ask: *What continuous Hamiltonian differential equation does the discrete numerical algorithm solve exactly?*
For a symplectic integrator, there exists a formal asymptotic Hamiltonian:
$$\tilde{\mathcal{H}} = \mathcal{H} + \Delta t^p \mathcal{H}_p + \Delta t^{p+1} \mathcal{H}_{p+1} + \dots$$
such that the discrete steps $\{\mathbf{z}_0, \mathbf{z}_1, \dots\}$ lie precisely on the continuous integral curves of $\tilde{\mathcal{H}}$.

*Why Secular Drift is Prevented:*
Because the numerical algorithm is the exact analytical flow of $\tilde{\mathcal{H}}$, the value of $\tilde{\mathcal{H}}$ is an exact constant of motion:
$$\tilde{\mathcal{H}}(\mathbf{z}_n) \equiv \tilde{\mathcal{H}}(\mathbf{z}_0) = \text{constant}$$
The true physical energy $\mathcal{H}(\mathbf{z}_n)$ is related to $\tilde{\mathcal{H}}$ by:
$$\mathcal{H}(\mathbf{z}_n) = \tilde{\mathcal{H}}(\mathbf{z}_n) - \Delta t^p \mathcal{H}_p(\mathbf{z}_n) - \dots$$
Since $\mathcal{H}_p$ is a continuous function bounded on compact energy surfaces, the error $\mathcal{H}(\mathbf{z}_n) - \mathcal{H}(\mathbf{z}_0)$ cannot accumulate monotonically. It is bounded to oscillate within a narrow corridor of width $O(\Delta t^p)$ for exponentially long times.

---

#### Solution to Exercise 5.6
Given: $\tilde{\mathcal{H}}(q, p) = \mathcal{H}(q, p) - \frac{1}{2} \omega^2 \Delta t q p$, where $\mathcal{H} = \frac{1}{2} p^2 + \frac{1}{2} \omega^2 q^2$.
The discrepancy is:
$$\mathcal{H} - \tilde{\mathcal{H}} = \frac{1}{2} \omega^2 \Delta t q p$$
Using the algebraic inequality for any real numbers $a, b$:
$$|a b| \le \frac{1}{2} (a^2 + b^2)$$
Let $a = \omega q$ and $b = p$:
$$|\omega q p| \le \frac{1}{2} (\omega^2 q^2 + p^2) = \mathcal{H}$$
Multiply both sides by $\frac{1}{2} \omega \Delta t$:
$$|\mathcal{H} - \tilde{\mathcal{H}}| = \frac{1}{2} \omega \Delta t |\omega q p| \le \frac{1}{2} \omega \Delta t \mathcal{H}$$
Since $\mathcal{H} = \tilde{\mathcal{H}} + O(\Delta t)$:
$$|\mathcal{H} - \tilde{\mathcal{H}}| \le \frac{1}{2} \omega \Delta t \tilde{\mathcal{H}} + O(\Delta t^2)$$
$\blacksquare$ The true physical energy is rigorously bounded within a relative band of width $\pm \frac{1}{2}\omega \Delta t$ of the invariant shadow energy.

---

#### Solution to Exercise 5.7
Given: $\dot{\mathbf{x}} = \mathbf{v}$, $\dot{\mathbf{v}} = -k \mathbf{x} + \alpha (\mathbf{x} \cdot \mathbf{v}) \mathbf{v}$.
Phase-space velocity vector: $\mathbf{v}_{\text{phase}} = \begin{bmatrix} \mathbf{v} \\ -k \mathbf{x} + \alpha (\mathbf{x} \cdot \mathbf{v})\mathbf{v} \end{bmatrix}$.

*Compute Divergence:*
$$\nabla_{\mathbf{z}} \cdot \mathbf{v}_{\text{phase}} = \nabla_{\mathbf{x}} \cdot \mathbf{v} + \nabla_{\mathbf{v}} \cdot (-k \mathbf{x} + \alpha (\mathbf{x} \cdot \mathbf{v})\mathbf{v})$$
- $\nabla_{\mathbf{x}} \cdot \mathbf{v} = 0$ (velocity does not depend on position).
- Evaluate $\nabla_{\mathbf{v}} \cdot (-k \mathbf{x} + \alpha (\mathbf{x} \cdot \mathbf{v})\mathbf{v})$:
  $-k \mathbf{x}$ does not depend on $\mathbf{v}$.
  Let $f_i = \alpha (\sum_j x_j v_j) v_i$.
  $$\frac{\partial f_i}{\partial v_i} = \alpha \left( \frac{\partial (\mathbf{x}\cdot\mathbf{v})}{\partial v_i} v_i + (\mathbf{x}\cdot\mathbf{v}) \frac{\partial v_i}{\partial v_i} \right) = \alpha (x_i v_i + \mathbf{x}\cdot\mathbf{v})$$
  Sum over all $d$ spatial dimensions:
  $$\sum_{i=1}^d \frac{\partial f_i}{\partial v_i} = \alpha \sum_{i=1}^d x_i v_i + \alpha (\mathbf{x}\cdot\mathbf{v}) \sum_{i=1}^d 1 = \alpha (\mathbf{x}\cdot\mathbf{v}) + \alpha d (\mathbf{x}\cdot\mathbf{v}) = \alpha (d + 1) (\mathbf{x} \cdot \mathbf{v})$$

$$\nabla_{\mathbf{z}} \cdot \mathbf{v}_{\text{phase}} = \alpha (d + 1) (\mathbf{x} \cdot \mathbf{v})$$

*Condition for Liouville Preservation:*
For phase space to be incompressible ($\nabla \cdot \mathbf{v}_{\text{phase}} \equiv 0$ for all states), we must have:
$$\alpha (d + 1) (\mathbf{x} \cdot \mathbf{v}) \equiv 0 \implies \alpha = 0$$
The system satisfies Liouville's theorem if and only if $\alpha = 0$ (the velocity-dependent non-linear force vanishes).

---

#### Solution to Exercise 5.8
*Why Classical RK4 is Non-Symplectic:*
Classical Runge-Kutta 4 is derived from a 4th-order truncated Taylor series approximation.
While it achieves high local accuracy ($O(\Delta t^5)$), its state transition Jacobian $\mathbf{M}$ fails the symplectic identity:
$$\mathbf{M}^T \mathbf{J} \mathbf{M} \ne \mathbf{J}$$
Specifically, for an oscillator $\ddot{x} = -\omega^2 x$, the amplification factor of RK4 is:
$$R(z) = 1 + z + \frac{z^2}{2} + \frac{z^3}{6} + \frac{z^4}{24}, \qquad \text{where } z = i \omega \Delta t$$
Magnitude:
$$|R(i \omega \Delta t)| = \sqrt{1 - \frac{(\omega \Delta t)^6}{72} + \frac{(\omega \Delta t)^8}{576}} < 1.0 \quad \text{for small } \Delta t > 0$$
Because $|R| < 1.0$, RK4 introduces a tiny, insidious **artificial damping term of order $O(\Delta t^6)$ per step**.

*Planetary Orbit Failure:*
Over 10 or 100 orbits, RK4 looks pristine because the damping is small ($10^{-10}$ per step).
However, because RK4 is not symplectic, there is no shadow Hamiltonian to bound the error. The damping acts unidirectionally: the planetary orbit steadily loses mechanical energy on every orbit. Over 100,000 orbits, the satellite's semi-major axis shrinks steadily, causing the planet to spiral into the sun.

---

#### Solution to Exercise 5.9
*Proof for $d = 1$ (2D phase space):*
Let $\mathbf{M} = \begin{bmatrix} a & b \\ c & d \end{bmatrix}$. The symplectic matrix in 2D is $\mathbf{J} = \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$.
Evaluate $\mathbf{M}^T \mathbf{J} \mathbf{M}$:
$$\mathbf{M}^T \mathbf{J} = \begin{bmatrix} a & c \\ b & d \end{bmatrix} \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix} = \begin{bmatrix} -c & a \\ -d & b \end{bmatrix}$$
$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \begin{bmatrix} -c & a \\ -d & b \end{bmatrix} \begin{bmatrix} a & b \\ c & d \end{bmatrix} = \begin{bmatrix} -ca + ac & -cb + ad \\ -da + bc & -db + bd \end{bmatrix} = \begin{bmatrix} 0 & ad - bc \\ -(ad - bc) & 0 \end{bmatrix} = (ad - bc) \begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$$
$$\mathbf{M}^T \mathbf{J} \mathbf{M} = \det(\mathbf{M}) \mathbf{J}$$
Therefore, $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J} \iff \det(\mathbf{M}) = 1.0$.

*Why It Fails for $d \ge 2$:*
In higher dimensions (e.g. $d = 2$, $4 \times 4$ phase space), $\mathbf{M}^T \mathbf{J} \mathbf{M} = \mathbf{J}$ represents a system of $\frac{2d(2d-1)}{2} = \frac{4 \times 3}{2} = 6$ independent quadratic algebraic constraints on the matrix elements.
The condition $\det(\mathbf{M}) = 1$ is merely **one single scalar constraint**.
A matrix can easily have $\det(\mathbf{M}) = 1$ while mixing spatial and momentum components in non-canonical ways that violate the 6 symplectic constraints (e.g., expanding area in $(q_1, p_1)$ while shrinking area in $(q_2, p_2)$).
Thus, in $d \ge 2$, symplecticity is a vastly stricter geometric requirement than mere volume conservation.
$\blacksquare$

---

#### Solution to Exercise 5.10
In the Circular Restricted Three-Body Problem (CR3BP), a test particle (spacecraft) moves under the gravitational fields of two massive orbiting primaries (e.g., Earth and Moon).
The system possesses an exact invariant known as the **Jacobi Constant** $C_J$:
$$C_J(\mathbf{r}, \mathbf{v}) = 2 U(\mathbf{r}) - \|\mathbf{v}\|^2 = \text{constant}$$
The zero-velocity surfaces ($2 U(\mathbf{r}) = C_J$) define closed geometric boundaries (Roche lobes / Hill spheres) that topologically forbid the spacecraft from escaping into interplanetary space or colliding with the primary bodies.

*Symplectic vs. Non-Symplectic Behavior:*
- A **Symplectic Integrator** conserves a shadow Jacobi constant $\tilde{C}_J$. The numerical zero-velocity surfaces remain topologically closed for eternity. The spacecraft remains safely trapped within its designated halo orbit around the Lagrange point ($L_1$ or $L_2$).
- A **Non-Symplectic Integrator** (such as Forward Euler or RK4) drifts in energy. Even a microscopic numerical drift alters $C_J$, causing the zero-velocity neck at the Lagrange point to artificially open. The spacecraft falsely breaches the Roche lobe and is ejected into deep space, ruining mission trajectory design.
