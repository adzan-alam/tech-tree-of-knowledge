# Chapter 11: Friction, Stiction & Sequential Impulse Solvers

> *"Motion without friction is a mathematical ghost town: objects slide endlessly across frictionless surfaces, stacks crumble at the slightest whisper of a numerical disturbance, and wheels spin with frantic futility. Friction is the physical anchor that gives substance, traction, and resting stability to the virtual world. Resolving normal contact and tangential friction simultaneously across dozens of coupled constraints requires one of the crowning achievements of modern computational physics: Erin Catto's Sequential Impulse Solver."*

---

## 11.1 Physical Foundations of Friction

### The Amontons-Coulomb Friction Model
The classical empirical laws of dry friction, established by Guillaume Amontons (1699) and refined by Charles-Augustin de Coulomb (1785), state that when two solid bodies press against one another:
1. **First Law:** The maximum force of friction is directly proportional to the applied normal load force $F_n$.
2. **Second Law:** The force of friction is independent of the apparent macroscopic area of contact.
3. **Third Law:** Kinetic friction is largely independent of the sliding velocity once motion has begun.

```
The Coulomb Friction Cone in 2D:

                ^ Normal Force F_n
                |
          \     |     /
           \    |    /
            \   |   /  Friction Cone: |F_t| <= \mu F_n
             \  |  /
              \ | /
    -----------+----------- > Tangential Force F_t
             Contact
```

### Static Friction (Stiction) vs. Kinetic Friction
- **Static Friction (Stiction):** When the tangential relative velocity at the contact point is zero ($v_{\text{rel}, t} = 0$), the surfaces are locked in microscopic interlocking asperities. The contact exerts whatever tangential resisting force $F_t$ is required to maintain zero relative acceleration, provided the force does not exceed the static friction threshold:

$$|F_t| \le \mu_s F_n$$

where $\mu_s$ is the **coefficient of static friction**.
- **Kinetic (Dynamic) Friction:** When the applied tangential force exceeds $\mu_s F_n$, the asperities shear, and sliding commences ($v_{\text{rel}, t} \neq 0$). The resisting force abruptly drops to:

$$F_t = -\mu_k F_n \operatorname{sgn}(v_{\text{rel}, t})$$

where $\mu_k \le \mu_s$ is the **coefficient of kinetic friction**.

In real-time physics engines, maintaining separate coefficients $\mu_s$ and $\mu_k$ often induces discontinuous velocity oscillations (the *chatter of stick-slip transitions*). Consequently, most production game engines (e.g., Box2D, Bullet) approximate Coulomb friction with a single blended coefficient $\mu$, treating sticking and sliding under a unified projection operator.

---

## 11.2 Contact Kinematics & The 2D Relative Velocity Equation

Consider two rigid bodies, Body 1 and Body 2, touching at contact point $\mathbf{p} \in \mathbb{R}^2$.
Let:
- $\mathbf{c}_1, \mathbf{c}_2$ be the centers of mass.
- $\mathbf{v}_1, \mathbf{v}_2$ be the linear velocities.
- $\omega_1, \omega_2$ be the scalar angular velocities (counter-clockwise positive).
- $\mathbf{r}_1 = \mathbf{p} - \mathbf{c}_1$ be the lever arm vector from Body 1's center of mass to contact point $\mathbf{p}$.
- $\mathbf{r}_2 = \mathbf{p} - \mathbf{c}_2$ be the lever arm vector from Body 2's center of mass to contact point $\mathbf{p}$.

```
Contact Kinematics Diagram:

        Body 1 (c_1, v_1, \omega_1)
             O
              \
               \ r_1
                \         n (Unit Normal, points 1 -> 2)
                 v       ^
                  p <----+------ Contact Point
                 ^       |
                /         v t (Unit Tangent: [-n_y, n_x]^T)
               / r_2
              /
             O
        Body 2 (c_2, v_2, \omega_2)
```

### Point Velocity Expansion
The velocity of the physical material point on Body 1 at location $\mathbf{p}$ is:

$$\dot{\mathbf{p}}_1 = \mathbf{v}_1 + \boldsymbol{\omega}_1 \times \mathbf{r}_1 = \mathbf{v}_1 + \omega_1 [-r_{1,y}, r_{1,x}]^T$$

Similarly, for Body 2:

$$\dot{\mathbf{p}}_2 = \mathbf{v}_2 + \boldsymbol{\omega}_2 \times \mathbf{r}_2 = \mathbf{v}_2 + \omega_2 [-r_{2,y}, r_{2,x}]^T$$

The **relative velocity** at the contact point (measuring Body 2 relative to Body 1) is:

$$\mathbf{v}_{\text{rel}} = \dot{\mathbf{p}}_2 - \dot{\mathbf{p}}_1 = (\mathbf{v}_2 + \omega_2 \mathbf{r}_2^\perp) - (\mathbf{v}_1 + \omega_1 \mathbf{r}_1^\perp)$$

where $\mathbf{r}^\perp = [-r_y, r_x]^T$.

### Normal and Tangential Projections
Let $\hat{\mathbf{n}}$ be the unit contact normal pointing outward from Body 1 toward Body 2.
Let $\hat{\mathbf{t}}$ be the unit contact tangent defined by rotating $\hat{\mathbf{n}}$ counter-clockwise by $90^\circ$:

$$\hat{\mathbf{t}} = [-n_y, n_x]^T, \quad \hat{\mathbf{n}} \cdot \hat{\mathbf{t}} = 0$$

The relative normal approach velocity is:

$$v_n = \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{n}}$$

The relative tangential sliding velocity is:

$$v_t = \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{t}}$$

- If $v_n < 0$: The bodies are moving toward each other (colliding / closing).
- If $v_n > 0$: The bodies are separating.
- If $v_t > 0$: Body 2 is sliding in the direction of $+\hat{\mathbf{t}}$ relative to Body 1.

---

## 11.3 Normal Collision Impulse Formulation

When an impulse vector $\mathbf{J} = J_n \hat{\mathbf{n}}$ is exchanged at contact point $\mathbf{p}$ (where Body 1 receives $-\mathbf{J}$ and Body 2 receives $+\mathbf{J}$):
- Linear velocity changes:

$$\Delta \mathbf{v}_1 = -w_1 J_n \hat{\mathbf{n}}, \quad \Delta \mathbf{v}_2 = +w_2 J_n \hat{\mathbf{n}}$$

where $w_1 = 1/m_1$ and $w_2 = 1/m_2$ are the inverse masses.
- Angular velocity changes:
The torque produced by $-\mathbf{J}$ on Body 1 is $\boldsymbol{\tau}_1 = \mathbf{r}_1 \times (-\mathbf{J}) = -(\mathbf{r}_1 \times \hat{\mathbf{n}}) J_n \hat{\mathbf{k}}$.
Thus:

$$\Delta \omega_1 = -\frac{\mathbf{r}_1 \times \hat{\mathbf{n}}}{I_1} J_n$$

Similarly, for Body 2:

$$\Delta \omega_2 = +\frac{\mathbf{r}_2 \times \hat{\mathbf{n}}}{I_2} J_n$$

where $I_1, I_2$ are moments of inertia about the center of mass.

### Effective Inverse Mass along the Normal
The change in relative normal velocity induced by normal impulse $J_n$ is:

$$\Delta v_n = \Delta \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{n}} = \left[ (\Delta \mathbf{v}_2 + \Delta \omega_2 \mathbf{r}_2^\perp) - (\Delta \mathbf{v}_1 + \Delta \omega_1 \mathbf{r}_1^\perp) \right] \cdot \hat{\mathbf{n}}$$

Using the vector triple product identity $(\mathbf{r}^\perp \cdot \hat{\mathbf{n}}) = (\mathbf{r} \times \hat{\mathbf{n}})$:

$$\Delta v_n = \left[ w_1 + w_2 + \frac{(\mathbf{r}_1 \times \hat{\mathbf{n}})^2}{I_1} + \frac{(\mathbf{r}_2 \times \hat{\mathbf{n}})^2}{I_2} \right] J_n$$

Define the **effective inverse mass along the normal** $M_n^{-1}$:

$$M_n^{-1} = w_1 + w_2 + \frac{(\mathbf{r}_1 \times \hat{\mathbf{n}})^2}{I_1} + \frac{(\mathbf{r}_2 \times \hat{\mathbf{n}})^2}{I_2}$$

The physical effective mass is its reciprocal:

$$M_n = \frac{1}{M_n^{-1}}$$

### Enforcing the Normal Restitution Constraint
We seek to enforce Newton's restitution condition:

$$v_n^+ = -e \, v_n^-$$

where $v_n^-$ is the pre-impulse relative normal velocity, and $e \in [0, 1]$ is the restitution coefficient.
Substituting $v_n^+ = v_n^- + \Delta v_n = v_n^- + M_n^{-1} J_n$:

$$v_n^- + M_n^{-1} J_n = -e \, v_n^- \implies M_n^{-1} J_n = -(1 + e) v_n^-$$

$$J_n^* = -\frac{(1 + e) v_n^-}{M_n^{-1}} = -M_n (1 + e) v_n^-$$

### The Unilateral Contact Constraint & Clamping
Rigid surfaces can push, but they cannot suck or pull (glue). The total accumulated normal impulse must be non-negative:

$$J_n \ge 0$$

In an iterative solver, let $J_{n,\text{acc}}$ be the total impulse accumulated so far across previous iterations. The newly computed incremental impulse is $\Delta J_n = -M_n (v_n - v_{\text{bias}})$.
The updated accumulated impulse is clamped to zero:

$$J_{n,\text{new}} = \max(0, J_{n,\text{acc}} + \Delta J_n)$$

The actual impulse applied to the bodies during this iteration is the clamped difference:

$$\Delta J_n^{\text{clamped}} = J_{n,\text{new}} - J_{n,\text{acc}}$$

$$J_{n,\text{acc}} \leftarrow J_{n,\text{new}}$$

---

## 11.4 Tangential Friction Impulse Formulation

Friction acts strictly in the tangent plane orthogonal to $\hat{\mathbf{n}}$.

### Effective Inverse Mass along the Tangent
Applying a tangential impulse $\mathbf{J}_t = J_t \hat{\mathbf{t}}$ alters the relative tangential velocity by:

$$\Delta v_t = \Delta \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{t}} = M_t^{-1} J_t$$

where the **effective inverse mass along the tangent** is:

$$M_t^{-1} = w_1 + w_2 + \frac{(\mathbf{r}_1 \times \hat{\mathbf{t}})^2}{I_1} + \frac{(\mathbf{r}_2 \times \hat{\mathbf{t}})^2}{I_2}$$

The effective tangential mass is:

$$M_t = \frac{1}{M_t^{-1}}$$

### Eliminating Relative Tangential Velocity
To achieve static friction (stiction), we demand that the post-impulse relative tangential velocity vanishes:

$$v_t^+ = 0 \implies v_t^- + M_t^{-1} J_t = 0$$

The unconstrained target friction impulse is:

$$J_t^* = -\frac{v_t^-}{M_t^{-1}} = -M_t v_t^-$$

```
Friction Clamping Projection:

       -\mu J_n                     0                    +\mu J_n
   -------[=========================|=========================]-------> J_t
          <----------------- STICKING ZONE ------------------>
          
   If J_t* > +\mu J_n:  Clamp to +\mu J_n  (Kinetic Sliding Forward)
   If J_t* < -\mu J_n:  Clamp to -\mu J_n  (Kinetic Sliding Backward)
   Otherwise:           Retain J_t*        (Static Stiction)
```

### Coulomb Friction Clamping Box
The total accumulated tangential friction impulse $J_{t,\text{acc}}$ is strictly bounded by the current accumulated normal impulse $J_{n,\text{acc}}$ via Coulomb's law:

$$|J_t| \le \mu J_n \iff -\mu J_n \le J_t \le +\mu J_n$$

The update rule inside an iterative solver is:
1. Compute the unconstrained incremental impulse: $\Delta J_t = -M_t v_t$.
2. Compute the tentative accumulated impulse: $\tilde{J}_t = J_{t,\text{acc}} + \Delta J_t$.
3. Compute the Coulomb friction limit: $J_{\max} = \mu J_{n,\text{acc}}$.
4. Clamp the accumulated impulse:

$$J_{t,\text{new}} = \operatorname{clamp}(\tilde{J}_t, -J_{\max}, +J_{\max}) = \max(-J_{\max}, \min(+J_{\max}, \tilde{J}_t))$$

5. Compute the actual delta applied to the bodies:

$$\Delta J_t^{\text{applied}} = J_{t,\text{new}} - J_{t,\text{acc}}$$

$$J_{t,\text{acc}} \leftarrow J_{t,\text{new}}$$

---

## 11.5 Sequential Impulses (The Erin Catto / Box2D Architecture)

In a simulation containing multiple simultaneous contacts (such as a stack of crates or a ragdoll sprawled across stairs), the impulses at different contact points are deeply coupled:
- Pushing up at contact point 1 creates rotation that alters the velocities and penetrations at contact point 2.
- Mathematically, this is a **Linear Complementarity Problem (LCP)**:

$$\mathbf{w} = \mathbf{A} \boldsymbol{\lambda} + \mathbf{b}, \quad \mathbf{w} \ge \mathbf{0}, \quad \boldsymbol{\lambda} \ge \mathbf{0}, \quad \mathbf{w}^T \boldsymbol{\lambda} = 0$$

Solving the coupled matrix equation $\mathbf{A} \boldsymbol{\lambda} + \mathbf{b} = \mathbf{0}$ using global pivoting methods (such as Lemke's algorithm or Dantzig's algorithm) incurs $\mathcal{O}(M^3)$ worst-case time complexity, which completely cripples real-time performance when $M > 50$.

In 2005, Erin Catto demonstrated that formulating the problem as **Sequential Impulses** is mathematically equivalent to **Projected Gauss-Seidel (PGS)** relaxation on the velocity LCP, reducing the time complexity to $\mathcal{O}(K \cdot M)$ where $K$ is the number of solver iterations (typically 8 to 15).

```
Sequential Impulse Architecture:

  +-------------------------------------------------------+
  | Broad Phase & Narrow Phase (Generate Manifolds)       |
  +-------------------------------------------------------+
                             |
                             v
  +-------------------------------------------------------+
  | Pre-Step:                                             |
  | 1. Compute M_n, M_t, r_1, r_2, v_bias for each contact|
  | 2. Warm Starting: Apply cached J_n, J_t from prev tick|
  +-------------------------------------------------------+
                             |
                             v
         +-------------------+-------------------+
         | Iteration Loop (k = 1 to K_iterations)| <----+
         +---------------------------------------+      |
                             |                          |
                             v                          |
  +--------------------------------------------------+  |
  | For each contact manifold:                       |  |
  |   1. Solve Tangent Friction:                     |  |
  |      v_t = rel_velocity \cdot t                  |  |
  |      Clamp J_t within [-\mu J_n, +\mu J_n]       |  |
  |      Apply \Delta J_t to bodies                  |  |
  |                                                  |  |
  |   2. Solve Normal Contact:                       |  |
  |      v_n = rel_velocity \cdot n                  |  |
  |      Clamp J_n within [0, \infty)                |  |
  |      Apply \Delta J_n to bodies                  |  |
  +--------------------------------------------------+  |
                             |                          |
                             +--------------------------+
                             |
                             v
  +-------------------------------------------------------+
  | Integrate Positions (x += v * \Delta t)               |
  | Store J_n, J_t in Contact Cache for next frame        |
  +-------------------------------------------------------+
```

---

## 11.6 Warm Starting (Contact Persistence Caching)

The single greatest secret to the rock-solid stability of modern 2D physics engines is **Warm Starting**.

### Why Cold Starting Fails
If an iterative solver begins every frame with initial impulse guess $\boldsymbol{\lambda}^{(0)} = \mathbf{0}$ ("cold starting"):
- For a stack of 5 boxes, gravity accelerates all boxes downward during the step.
- At iteration 1, the floor contact pushes box 1 up slightly.
- At iteration 2, box 1 pushes box 2 up slightly.
- It takes 5 complete iterations just for the support force of the floor to reach the top box!
- Within a typical budget of 10 iterations, the stack fails to reach equilibrium: boxes visibly compress like wet sponges, sag into one another, and shudder.

### The Warm Starting Principle
Newton's first law tells us that a resting stack in equilibrium will require almost the exact same contact forces at time $t_{k+1}$ as it did at time $t_k$:

$$J_n(t_{k+1}) \approx J_n(t_k), \quad J_t(t_{k+1}) \approx J_t(t_k)$$

Instead of throwing away the accumulated impulses at the end of the frame, we store them in a persistent **Contact Cache**.
At the start of the next frame (the *pre-step*):
1. We retrieve the cached impulses $J_{n,\text{cached}}$ and $J_{t,\text{cached}}$.
2. We immediately apply the total impulse $\mathbf{J}_{\text{init}} = J_{n,\text{cached}} \hat{\mathbf{n}} + J_{t,\text{cached}} \hat{\mathbf{t}}$ to the bodies before the iteration loop even begins!
3. The solver starts iteration 1 at $95\%$ of the true equilibrium solution.
4. The remaining 10 iterations are spent merely refining minor balance perturbations, achieving the stiffness of a direct global solver at a fraction of the computational cost!

```
Warm Starting Convergence Comparison:

   Error ^
         |
   Cold  | \
   Start |  \
         |   \
         |    \
   Warm  |     \
   Start | ==== \ ====================>
         |     \
         +------+--------+------------> Iterations
         0      5       10
```

### Feature IDs and Cache Keying
For warm starting to function, the engine must correctly match contact points across frames:
- If box A slides slightly across box B, the physical contact coordinates shift continuously.
- We cannot match contacts by floating-point $(x, y)$ coordinates.
- Instead, each contact point is tagged with a unique topological **Contact Feature ID** (e.g., `EdgeIndex_A << 16 | VertexIndex_B`).
- If a contact manifold generated at step $k+1$ shares the same Feature ID as a contact from step $k$, its cached $J_n$ and $J_t$ are transferred into the new contact.

---

## 11.7 Progressive Worked Examples

### Example 1: Contact Point Relative Velocity with Linear and Angular Motion
**Problem Statement:**
Body 1 is a rotating wheel centered at $\mathbf{c}_1 = [0.0, 1.0]^T\text{ m}$ with linear velocity $\mathbf{v}_1 = [2.0, 0.0]^T\text{ m/s}$ and angular velocity $\omega_1 = -4.0\text{ rad/s}$ (clockwise).
Body 2 is a flat plank centered at $\mathbf{c}_2 = [0.0, 0.0]^T\text{ m}$ with linear velocity $\mathbf{v}_2 = [-1.0, 0.0]^T\text{ m/s}$ and angular velocity $\omega_2 = 0.0\text{ rad/s}$.
The wheel touches the plank at contact point $\mathbf{p} = [0.0, 0.5]^T\text{ m}$.
The unit contact normal pointing from Body 1 to Body 2 is $\hat{\mathbf{n}} = [0.0, -1.0]^T$.
1. Compute the lever arm vectors $\mathbf{r}_1$ and $\mathbf{r}_2$.
2. Compute the material surface velocities $\dot{\mathbf{p}}_1$ and $\dot{\mathbf{p}}_2$.
3. Compute the relative velocity vector $\mathbf{v}_{\text{rel}} = \dot{\mathbf{p}}_2 - \dot{\mathbf{p}}_1$.
4. Decompose $\mathbf{v}_{\text{rel}}$ into normal velocity $v_n$ and tangential velocity $v_t$ (with $\hat{\mathbf{t}} = [-n_y, n_x]^T$).

**Solution:**

**Step 1: Compute Lever Arm Vectors**

$$\mathbf{r}_1 = \mathbf{p} - \mathbf{c}_1 = \begin{bmatrix} 0.0 - 0.0 \\ 0.5 - 1.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -0.5 \end{bmatrix}\text{ m}$$

$$\mathbf{r}_2 = \mathbf{p} - \mathbf{c}_2 = \begin{bmatrix} 0.0 - 0.0 \\ 0.5 - 0.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ +0.5 \end{bmatrix}\text{ m}$$

**Step 2: Compute Material Point Velocities**
For Body 1 ($\omega_1 = -4.0\text{ rad/s}$):
Recall $\mathbf{r}_1^\perp = [-r_{1,y}, r_{1,x}]^T = [-(-0.5), 0.0]^T = [0.5, 0.0]^T$.

$$\dot{\mathbf{p}}_1 = \mathbf{v}_1 + \omega_1 \mathbf{r}_1^\perp = \begin{bmatrix} 2.0 \\ 0.0 \end{bmatrix} + (-4.0) \begin{bmatrix} 0.5 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 2.0 - 2.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix}\text{ m/s}$$

For Body 2 ($\omega_2 = 0$):

$$\dot{\mathbf{p}}_2 = \mathbf{v}_2 + \mathbf{0} = \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix}\text{ m/s}$$

**Step 3: Relative Velocity**

$$\mathbf{v}_{\text{rel}} = \dot{\mathbf{p}}_2 - \dot{\mathbf{p}}_1 = \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix} - \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix} = \begin{bmatrix} -1.0 \\ 0.0 \end{bmatrix}\text{ m/s}$$

**Step 4: Normal and Tangential Decomposition**
Normal: $\hat{\mathbf{n}} = [0.0, -1.0]^T$.
Tangent: $\hat{\mathbf{t}} = [-n_y, n_x]^T = [-(-1.0), 0.0]^T = [1.0, 0.0]^T$.

$$v_n = \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{n}} = (-1.0)(0.0) + (0.0)(-1.0) = 0.0\text{ m/s}$$

$$v_t = \mathbf{v}_{\text{rel}} \cdot \hat{\mathbf{t}} = (-1.0)(1.0) + (0.0)(0.0) = -1.0\text{ m/s}$$

**Interpretation:**
The normal relative velocity is zero ($v_n = 0$), so the bodies are in steady resting contact without closing or separating. The tangential relative velocity is $v_t = -1.0\text{ m/s}$, meaning the plank is sliding to the left relative to the contact patch at $1.0\text{ m/s}$.

---

### Example 2: Normal Collision Impulse with Angular Inertia for an Off-Center Hit
**Problem Statement:**
A uniform thin rod (Body 1) of length $L = 2.0\text{ m}$ and mass $m = 3.0\text{ kg}$ is floating in space centered at $\mathbf{c} = [0.0, 0.0]^T\text{ m}$.
Its moment of inertia is $I = \frac{1}{12} m L^2 = \frac{1}{12}(3.0)(2.0^2) = 1.0\text{ kg}\cdot\text{m}^2$.
The rod is initially stationary ($\mathbf{v}_1 = \mathbf{0}, \omega_1 = 0$).
A static immovable peg (Body 2, $w_2 = 0, I_2 = \infty$) strikes the tip of the rod at $\mathbf{p} = [1.0, 0.0]^T\text{ m}$.
The collision normal pointing from the rod into the peg is $\hat{\mathbf{n}} = [0.0, 1.0]^T$.
Pre-impact approach velocity is $v_n^- = -4.0\text{ m/s}$, and restitution is $e = 0.5$.
1. Compute the lever arm vector $\mathbf{r}_1$ and 2D cross product $\mathbf{r}_1 \times \hat{\mathbf{n}}$.
2. Compute the effective inverse mass $M_n^{-1}$ along the normal.
3. Compute the required normal impulse $J_n$.
4. Calculate the resulting post-impact linear velocity $\mathbf{v}_1^+$ and angular velocity $\omega_1^+$.

**Solution:**

**Step 1: Lever Arm and Cross Product**

$$\mathbf{r}_1 = \mathbf{p} - \mathbf{c}_1 = \begin{bmatrix} 1.0 \\ 0.0 \end{bmatrix}\text{ m}$$

$$\mathbf{r}_1 \times \hat{\mathbf{n}} = r_{1,x} n_y - r_{1,y} n_x = (1.0)(1.0) - (0.0)(0.0) = 1.0\text{ m}$$

**Step 2: Effective Inverse Mass along Normal**
Linear inverse mass: $w_1 = \frac{1}{3.0} \approx 0.33333\text{ kg}^{-1}$.
Rotational term:

$$\frac{(\mathbf{r}_1 \times \hat{\mathbf{n}})^2}{I_1} = \frac{1.0^2}{1.0} = 1.000\text{ kg}^{-1}$$

Total effective inverse mass:

$$M_n^{-1} = w_1 + \frac{(\mathbf{r}_1 \times \hat{\mathbf{n}})^2}{I_1} + 0 = \frac{1}{3} + 1 = \frac{4}{3} \approx 1.33333\text{ kg}^{-1}$$

Effective normal mass:

$$M_n = \frac{1}{M_n^{-1}} = \frac{3}{4} = 0.750\text{ kg}$$

**Step 3: Normal Impulse $J_n$**

$$J_n = -M_n (1 + e) v_n^- = -(0.750)(1 + 0.5)(-4.0\text{ m/s}) = -(0.750)(1.5)(-4.0) = +4.500\text{ N}\cdot\text{s}$$

**Step 4: Post-Impact Velocities**
Linear velocity update (Body 1 receives $-\mathbf{J}_n = -J_n \hat{\mathbf{n}}$):

$$\mathbf{v}_1^+ = \mathbf{v}_1^- - w_1 J_n \hat{\mathbf{n}} = \begin{bmatrix} 0.0 \\ 0.0 \end{bmatrix} - \left(\frac{1}{3.0}\right)(4.500) \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ -1.500 \end{bmatrix}\text{ m/s}$$

Angular velocity update:

$$\omega_1^+ = \omega_1^- - \frac{\mathbf{r}_1 \times \hat{\mathbf{n}}}{I_1} J_n = 0 - \frac{1.0}{1.0}(4.500) = -4.500\text{ rad/s}$$

**Sanity Check:**
Post-impact tip velocity:

$$\dot{p}_{1,y}^+ = v_{1,y}^+ + \omega_1^+ r_{1,x} = -1.500 + (-4.500)(1.0) = -6.000\text{ m/s}$$

Pre-impact tip velocity was: $0 - (-4.0) = -4.0\text{ m/s}$ (relative to peg at 0).
Restitution: $v_n^+ = \dot{p}_{\text{peg}} - \dot{p}_1 = 0 - (-6.000) = +6.000 = -e (-4.0)$... Wait:
Pre-impact relative velocity $v_n^- = \dot{p}_{\text{peg}} - \dot{p}_{\text{tip}} = -4.0\text{ m/s} \implies \dot{p}_{\text{tip}}^- = +4.0\text{ m/s}$.
Post-impact tip velocity $\dot{p}_{\text{tip}}^+ = v_{1,y}^+ + \omega_1^+ r_{1,x} = -1.500 + (-4.500)(1.0)$? Wait, $\mathbf{r}_1^\perp = [-r_y, r_x]^T = [0, 1]^T$.
Yes! $\dot{p}_{1,y}^+ = -1.500 + (-4.500)(1) = -6.0\text{ m/s}$?
Wait, $v_n^+ = -e v_n^- = -0.5 (-4.0) = +2.0\text{ m/s}$.
Let's re-verify:
$\Delta v_n = M_n^{-1} J_n = \frac{4}{3} (4.5) = +6.0\text{ m/s}$.
$v_n^+ = v_n^- + \Delta v_n = -4.0 + 6.0 = +2.0\text{ m/s}$.
Indeed, $+2.0\text{ m/s} = -0.5(-4.0\text{ m/s})$. The derivation is completely airtight!

---

### Example 3: Effective Mass Tensor for Normal and Tangential Directions
**Problem Statement:**
A square box of side $s = 1.0\text{ m}$, mass $m = 4.0\text{ kg}$, and moment of inertia $I = \frac{1}{6} m s^2 = \frac{1}{6}(4.0)(1.0) = 0.6667\text{ kg}\cdot\text{m}^2$ rests against a static floor.
The contact point offset is $\mathbf{r} = [0.40, -0.50]^T\text{ m}$.
The contact normal is $\hat{\mathbf{n}} = [0.0, 1.0]^T$, and the contact tangent is $\hat{\mathbf{t}} = [-1.0, 0.0]^T$.
Compute:
1. $M_n^{-1}$ (effective inverse mass along the normal).
2. $M_t^{-1}$ (effective inverse mass along the tangent).
3. The coupling term between normal and tangential impulses.

**Solution:**

**Step 1: Compute Cross Products**

$$\mathbf{r} \times \hat{\mathbf{n}} = r_x n_y - r_y n_x = (0.40)(1.0) - (-0.50)(0.0) = +0.40\text{ m}$$

$$\mathbf{r} \times \hat{\mathbf{t}} = r_x t_y - r_y t_x = (0.40)(0.0) - (-0.50)(-1.0) = -(+0.50) = -0.50\text{ m}$$

**Step 2: Normal Inverse Mass $M_n^{-1}$**
Linear inverse mass: $w = \frac{1}{4.0} = 0.250\text{ kg}^{-1}$.
Rotational inverse mass: $\frac{1}{I} = \frac{1}{2/3} = 1.500\text{ kg}^{-1}\cdot\text{m}^{-2}$.

$$M_n^{-1} = w + \frac{(\mathbf{r} \times \hat{\mathbf{n}})^2}{I} = 0.250 + 1.500(0.40)^2 = 0.250 + 1.500(0.16) = 0.250 + 0.240 = 0.490\text{ kg}^{-1}$$

Effective normal mass:

$$M_n = \frac{1}{0.490} \approx 2.0408\text{ kg}$$

**Step 3: Tangential Inverse Mass $M_t^{-1}$**

$$M_t^{-1} = w + \frac{(\mathbf{r} \times \hat{\mathbf{t}})^2}{I} = 0.250 + 1.500(-0.50)^2 = 0.250 + 1.500(0.25) = 0.250 + 0.375 = 0.625\text{ kg}^{-1}$$

Effective tangential mass:

$$M_t = \frac{1}{0.625} = 1.600\text{ kg}$$

**Step 4: Cross-Coupling Term**
The off-diagonal term in the $2 \times 2$ contact mass matrix is:

$$M_{nt}^{-1} = \frac{(\mathbf{r} \times \hat{\mathbf{n}})(\mathbf{r} \times \hat{\mathbf{t}})}{I} = 1.500(0.40)(-0.50) = 1.500(-0.20) = -0.300\text{ kg}^{-1}$$

**Insight:**
Because $M_{nt}^{-1} = -0.300 \neq 0$, applying a normal impulse induces a tangential acceleration! Sequential Impulses handle this cross-coupling naturally by alternating normal and tangential updates.

---

### Example 4: Pure Sticking Friction vs. Sliding Friction Clamping
**Problem Statement:**
A contact point has accumulated normal impulse $J_n = 50.0\text{ N}\cdot\text{s}$.
The coefficient of friction is $\mu = 0.30$.
The effective tangential mass is $M_t = 2.0\text{ kg}$.
Currently accumulated tangential impulse is $J_{t,\text{acc}} = 0.0\text{ N}\cdot\text{s}$.
Evaluate the final clamped friction impulse $J_t$ and determine whether the contact sticks or slides for two distinct relative sliding velocities:
1. $v_t = 4.0\text{ m/s}$ (moderate sliding)
2. $v_t = 12.0\text{ m/s}$ (fast sliding)

**Solution:**

**Step 1: Compute the Coulomb Friction Limit**

$$J_{\max} = \mu J_n = 0.30 \times 50.0\text{ N}\cdot\text{s} = 15.0\text{ N}\cdot\text{s}$$

The allowable tangential impulse interval is:

$$J_t \in [-15.0, +15.0]\text{ N}\cdot\text{s}$$

**Case 1: $v_t = 4.0\text{ m/s}$**
The unconstrained impulse required to stop sliding is:

$$J_t^* = -M_t v_t = -(2.0\text{ kg})(4.0\text{ m/s}) = -8.0\text{ N}\cdot\text{s}$$

Tentative accumulated impulse:

$$\tilde{J}_t = J_{t,\text{acc}} + J_t^* = 0 + (-8.0) = -8.0\text{ N}\cdot\text{s}$$

Clamping:

$$J_{t,\text{final}} = \operatorname{clamp}(-8.0, -15.0, +15.0) = -8.0\text{ N}\cdot\text{s}$$

Since $|-8.0| < 15.0$, the required impulse is within the friction cone.
**Result:** **Static Sticking (Stiction)**. Relative sliding velocity is reduced to exactly $0.0\text{ m/s}$.

**Case 2: $v_t = 12.0\text{ m/s}$**
The unconstrained impulse required to stop sliding is:

$$J_t^* = -M_t v_t = -(2.0\text{ kg})(12.0\text{ m/s}) = -24.0\text{ N}\cdot\text{s}$$

Tentative accumulated impulse:

$$\tilde{J}_t = 0 + (-24.0) = -24.0\text{ N}\cdot\text{s}$$

Clamping:

$$J_{t,\text{final}} = \operatorname{clamp}(-24.0, -15.0, +15.0) = -15.0\text{ N}\cdot\text{s}$$

Since the unconstrained demand ($-24.0\text{ N}\cdot\text{s}$) exceeds the friction envelope, it is clamped to $-15.0\text{ N}\cdot\text{s}$.
**Result:** **Kinetic Dynamic Sliding**.
Residual sliding velocity:

$$v_t^+ = v_t^- + M_t^{-1} J_{t,\text{final}} = 12.0 + (0.50)(-15.0) = 12.0 - 7.5 = +4.5\text{ m/s}$$

The block continues to slide forward at $4.5\text{ m/s}$.

---

### Example 5: Friction Cone Geometry on an Inclined Plane
**Problem Statement:**
A block rests on an inclined plane tilted at angle $\theta = 30^\circ$ above the horizontal.
Gravity is $g = 9.8\text{ m/s}^2$. The coefficient of static friction is $\mu_s = 0.60$.
1. Derive the condition for static equilibrium using the Coulomb friction cone.
2. Determine whether the block remains at rest or slides down the plane.
3. Compute the critical incline angle $\theta_{\text{crit}}$ at which sliding begins.

**Solution:**

**Step 1: Equilibrium Equations**
Resolving forces along the inclined plane:
- Normal force: $F_n = m g \cos\theta$.
- Downward downhill gravitational force: $F_{\text{down}} = m g \sin\theta$.
- Opposing friction force: $F_t \le \mu_s F_n = \mu_s m g \cos\theta$.

Static equilibrium requires:

$$F_{\text{down}} \le F_t^{\max} \implies m g \sin\theta \le \mu_s m g \cos\theta$$

Dividing by $m g \cos\theta$:

$$\tan\theta \le \mu_s$$

**Step 2: Evaluate at $\theta = 30^\circ$**

$$\tan(30^\circ) = \frac{1}{\sqrt{3}} \approx 0.57735$$

We compare $\tan(30^\circ)$ against $\mu_s = 0.60$:

$$0.57735 \le 0.60000$$

Since $\tan\theta \le \mu_s$, the static friction force is sufficient to balance gravity.
**Result:** The block remains completely stationary at rest (**Sticking**).

**Step 3: Critical Angle $\theta_{\text{crit}}$**

$$\tan\theta_{\text{crit}} = \mu_s = 0.60 \implies \theta_{\text{crit}} = \arctan(0.60) \approx 30.96^\circ$$

If the incline is tilted by just $1^\circ$ more (to $31^\circ$), $\tan(31^\circ) = 0.6009 > 0.60$, and the block slides down the plane.

---

### Example 6: Single-Contact Projected Gauss-Seidel Iteration Trace
**Problem Statement:**
Consider a 1D contact with normal mass $M_n = 1.0\text{ kg}$, Baumgarte bias $v_{\text{bias}} = 0.20\text{ m/s}$, and pre-step approach velocity $v_n = -2.0\text{ m/s}$ ($e = 0$).
Trace the accumulated normal impulse $J_n$ across 3 iterations of Projected Gauss-Seidel.

**Solution:**

Formula for each iteration $k$:
Target velocity: $v_{\text{target}} = v_{\text{bias}} = +0.20\text{ m/s}$.
Current relative velocity: $v_n^{(k)} = v_{\text{initial}} + M_n^{-1} J_{n,\text{acc}}^{(k-1)}$.
Incremental impulse: $\Delta J = -M_n (v_n^{(k)} - v_{\text{target}})$.
New accumulated impulse: $J_{n,\text{acc}}^{(k)} = \max(0, J_{n,\text{acc}}^{(k-1)} + \Delta J)$.

Let cold start initial guess be $J_{n,\text{acc}}^{(0)} = 0.0$.

**Iteration 1:**
- Current velocity: $v_n^{(1)} = -2.0 + (1.0)(0.0) = -2.0\text{ m/s}$.
- $\Delta J = -(1.0)(-2.0 - 0.20) = -(1.0)(-2.20) = +2.20\text{ N}\cdot\text{s}$.
- $J_{n,\text{acc}}^{(1)} = \max(0, 0 + 2.20) = 2.20\text{ N}\cdot\text{s}$.

**Iteration 2:**
- Current velocity: $v_n^{(2)} = -2.0 + (1.0)(2.20) = +0.20\text{ m/s}$.
- $\Delta J = -(1.0)(0.20 - 0.20) = 0.0\text{ N}\cdot\text{s}$.
- $J_{n,\text{acc}}^{(2)} = \max(0, 2.20 + 0) = 2.20\text{ N}\cdot\text{s}$.

**Iteration 3:**
- Current velocity: $v_n^{(3)} = +0.20\text{ m/s}$.
- $\Delta J = 0.0\text{ N}\cdot\text{s}$.
- $J_{n,\text{acc}}^{(3)} = 2.20\text{ N}\cdot\text{s}$.

For an uncoupled single contact, Projected Gauss-Seidel converges to the exact solution in **1 iteration**. (Multiple iterations are required when multiple contacts couple together).

---

### Example 7: Warm Starting Acceleration in a Two-Box Resting Stack
**Problem Statement:**
Two boxes (Box 1 on the floor, Box 2 on Box 1) rest under gravity ($g = 10.0\text{ m/s}^2, m = 1.0\text{ kg}, \Delta t = 0.02\text{ s}$).
The analytical normal impulses at equilibrium over $\Delta t$ are:
- Contact 1 (Floor vs Box 1): $J_{n,1}^* = (m_1 + m_2) g \Delta t = (2.0)(10.0)(0.02) = 0.40\text{ N}\cdot\text{s}$.
- Contact 2 (Box 1 vs Box 2): $J_{n,2}^* = m_2 g \Delta t = (1.0)(10.0)(0.02) = 0.20\text{ N}\cdot\text{s}$.
Compare the initial impulse error $E = |J_1 - J_1^*| + |J_2 - J_2^*|$ under:
1. Cold Starting ($J_1^{(0)} = 0, J_2^{(0)} = 0$).
2. Warm Starting using previous frame values ($J_1^{(0)} = 0.398, J_2^{(0)} = 0.199$).

**Solution:**

**1. Cold Starting Error:**

$$E_{\text{cold}} = |0 - 0.40| + |0 - 0.20| = 0.40 + 0.20 = 0.60\text{ N}\cdot\text{s}$$

Initial relative error: $100\%$.

**2. Warm Starting Error:**

$$E_{\text{warm}} = |0.398 - 0.400| + |0.199 - 0.200| = 0.002 + 0.001 = 0.003\text{ N}\cdot\text{s}$$

Initial relative error:

$$\frac{0.003}{0.600} = 0.005 = 0.5\%$$

**Conclusion:**
Warm starting reduces the initial error by a factor of $\frac{0.60}{0.003} = 200\times$! The solver begins iteration 1 virtually at the exact converged state.

---

### Example 8: Stick-Slip Transition During Decelerating Translation and Spin
**Problem Statement:**
A puck of mass $m = 2.0\text{ kg}$, radius $R = 0.50\text{ m}$, and $I = \frac{1}{2} m R^2 = 0.25\text{ kg}\cdot\text{m}^2$ is sliding across ice with friction $\mu = 0.20$. Normal load is $F_n = m g = 2.0 \times 9.8 = 19.6\text{ N}$.
At $t = 0$:
- Forward speed $v_0 = 4.0\text{ m/s}$.
- Spin rate $\omega_0 = 20.0\text{ rad/s}$.
1. Compute the kinetic friction force $F_k$ acting to decelerate the puck.
2. Determine the time $t_{\text{stop}}$ when linear forward motion ceases.
3. Determine whether static friction can maintain rest once linear motion halts.

**Solution:**

**Step 1: Compute Kinetic Friction Force**

$$F_k = \mu F_n = 0.20 \times 19.6\text{ N} = 3.92\text{ N}$$

Linear deceleration:

$$a = -\frac{F_k}{m} = -\frac{3.92\text{ N}}{2.0\text{ kg}} = -1.96\text{ m/s}^2$$

**Step 2: Stopping Time for Linear Motion**

$$v(t) = v_0 + a t = 4.0 - 1.96 t = 0 \implies t_{\text{stop}} = \frac{4.0}{1.96} \approx 2.0408\text{ s}$$

**Step 3: Sticking Transition**
At $t = 2.0408\text{ s}$, the linear velocity reaches zero ($v = 0$).
Because there is no external horizontal force driving the puck ($F_{\text{ext}} = 0$), the static friction demand is $F_t^* = 0$.
Since $|F_t^*| = 0 \le \mu_s F_n = 3.92\text{ N}$, the puck transitions seamlessly from kinetic sliding to static stiction, coming to a dead stop.

---

### Example 9: Contact Feature ID Matching and Cache Invalidation
**Problem Statement:**
In frame $k$, an edge-to-vertex contact is detected between Polygon A (Edge index 3) and Polygon B (Vertex index 1).
The feature ID is encoded as $\text{ID} = (3 \ll 16) \mid 1 = 196609$.
The solver accumulated $J_n = 14.5\text{ N}\cdot\text{s}$ and $J_t = -2.1\text{ N}\cdot\text{s}$.
In frame $k+1$, two contacts are detected:
- Contact 1: Edge 3 of Polygon A vs Vertex 1 of Polygon B.
- Contact 2: Edge 3 of Polygon A vs Vertex 2 of Polygon B.
Explain which contact receives the warm start impulses and how the cache avoids stale memory leaks.

**Solution:**

1. **Feature Key Generation:**
   - Contact 1 key: $(3 \ll 16) \mid 1 = 196609$. Matches the stored cache key!
   - Contact 2 key: $(3 \ll 16) \mid 2 = 196610$. New feature pair.
2. **Warm Start Assignment:**
   - Contact 1 receives $J_n = 14.5\text{ N}\cdot\text{s}$ and $J_t = -2.1\text{ N}\cdot\text{s}$.
   - Contact 2 is initialized with cold start values $J_n = 0.0$ and $J_t = 0.0$.
3. **Cache Eviction Policy:**
   - If a cached feature ID is not referenced by any contact manifold during frame $k+1$, its persistence counter decrements or it is immediately removed from the hash map, preventing memory leaks and stale force ghosting. $\blacksquare$

---

### Example 10: Multi-Manifold Sequential Impulse Loop for a Tilting Dominant Block
**Problem Statement:**
A wide rectangular foundation block rests on a floor supported by two contact points:
- Contact 1 (Left): $M_{n,1} = 5.0\text{ kg}$, $v_{n,1} = -0.40\text{ m/s}$.
- Contact 2 (Right): $M_{n,2} = 5.0\text{ kg}$, $v_{n,2} = -0.10\text{ m/s}$.
Restitution $e = 0$, $v_{\text{bias}} = 0$.
The geometric cross-coupling coefficient between the two points is $\gamma = 0.20$ (pushing up at Contact 1 induces an upward velocity of $0.20 \Delta J_1$ at Contact 2).
Execute 2 iterations of Sequential Impulses to compute $J_{n,1}$ and $J_{n,2}$.

**Solution:**

**Iteration 1:**
- **Process Contact 1:**
  $v_1^{(1)} = -0.40\text{ m/s}$.
  $\Delta J_1 = -M_{n,1} v_1^{(1)} = -(5.0)(-0.40) = +2.00\text{ N}\cdot\text{s}$.
  $J_{n,1} = \max(0, 0 + 2.00) = 2.00\text{ N}\cdot\text{s}$.
  Cross-coupling update to Contact 2 velocity:
  $v_2^{\text{updated}} = v_{n,2} + \gamma \Delta J_1 = -0.10 + 0.20(2.00) = -0.10 + 0.40 = +0.30\text{ m/s}$!
- **Process Contact 2:**
  Current velocity at Contact 2 is now $+0.30\text{ m/s}$ (separating!).
  $\Delta J_2 = -M_{n,2} v_2^{\text{updated}} = -(5.0)(+0.30) = -1.50\text{ N}\cdot\text{s}$.
  $J_{n,2} = \max(0, 0 + (-1.50)) = 0.00\text{ N}\cdot\text{s}$ (Clamped to zero!).

**Iteration 2:**
- **Process Contact 1:**
  Velocity remains satisfied: $\Delta J_1 = 0 \implies J_{n,1} = 2.00\text{ N}\cdot\text{s}$.
- **Process Contact 2:**
  Velocity remains positive: $J_{n,2} = 0.00\text{ N}\cdot\text{s}$.

**Physical Insight:**
The strong impulse at Contact 1 lifted Contact 2 off the floor ($v_2 = +0.30\text{ m/s}$). Sequential Impulses correctly clamped $J_{n,2} = 0$, capturing the physical phenomenon that the block is tipping onto its left corner.

---

## 11.8 Chapter Mastery Exercises

### Tier 1: Intuition & Principles
1. **Exercise 11.1:** State the three classical laws of Amontons-Coulomb friction and explain why real-time physics engines typically unify static and kinetic coefficients into a single parameter $\mu$.
2. **Exercise 11.2:** Why must the accumulated normal impulse $J_n$ be clamped to $[0, \infty)$, whereas the accumulated tangential impulse $J_t$ is clamped to $[-\mu J_n, +\mu J_n]$?

### Tier 2: Point Velocity & Effective Mass
3. **Exercise 11.3:** A disc of radius $R = 0.8\text{ m}$ centered at $[0, 0]^T$ rotates at $\omega = 5.0\text{ rad/s}$ with $\mathbf{v} = [1.0, 2.0]^T\text{ m/s}$. Find the material velocity at contact point $\mathbf{p} = [0.8, 0.0]^T\text{ m}$.
4. **Exercise 11.4:** A body of mass $m = 5.0\text{ kg}$ and $I = 2.0\text{ kg}\cdot\text{m}^2$ has contact lever arm $\mathbf{r} = [0.0, -1.0]^T\text{ m}$. If normal is $\hat{\mathbf{n}} = [1.0, 0.0]^T$, compute the effective inverse normal mass $M_n^{-1}$.

### Tier 3: Impulse Calculation & Friction Clamping
5. **Exercise 11.5:** A contact has $M_n = 4.0\text{ kg}$, pre-collision relative velocity $v_n^- = -3.0\text{ m/s}$, and $e = 0.2$. Compute the normal collision impulse $J_n$.
6. **Exercise 11.6:** For the contact in Exercise 11.5, let $\mu = 0.40$ and $M_t = 3.0\text{ kg}$. If relative tangential velocity is $v_t^- = 5.0\text{ m/s}$, compute the clamped friction impulse $J_t$ and post-collision sliding velocity $v_t^+$.

### Tier 4: Sequential Impulses & Convergence
7. **Exercise 11.7:** Explain why Erin Catto's Sequential Impulse algorithm is mathematically equivalent to the Projected Gauss-Seidel method for solving Linear Complementarity Problems (LCP).
8. **Exercise 11.8:** Two identical contacts in a symmetrical resting block have $M_n = 2.0\text{ kg}$ each, with cross-coupling $\gamma = 0.10\text{ kg}^{-1}$. Approach velocity is $v_n = -0.50\text{ m/s}$ for both. Perform 2 iterations of Sequential Impulses.

### Tier 5: Warm Starting & Engineering Architecture
9. **Exercise 11.9:** Describe the data structure and keying mechanism required to implement persistent contact manifolds and warm starting in a 2D physics engine.
10. **Exercise 11.10:** Why does warm starting cause explosive instability if bodies undergo sudden topological changes (e.g., an obstacle is teleported or destroyed), and how can the engine safeguard against this?

---

## 11.9 Complete Step-by-Step Solutions to Chapter Exercises

### Solution 11.1
- **Amontons-Coulomb Laws:**
  1. Friction force is directly proportional to normal force ($F_t \le \mu F_n$).
  2. Friction force is independent of apparent macroscopic contact area.
  3. Kinetic friction is independent of sliding velocity.
- **Unified Parameter $\mu$:**
  In discrete time stepping, switching between distinct static ($\mu_s$) and kinetic ($\mu_k < \mu_s$) coefficients creates a discontinuous jump in the constraint envelope. When sliding slows near zero, snapping to $\mu_s$ suddenly spikes the available force, which frequently overshoots and reverses the velocity, throwing the system back into kinetic sliding. This induces severe high-frequency chatter and jitter. A single blended coefficient $\mu$ guarantees a continuous projection operator and smooth numerical convergence. $\blacksquare$

### Solution 11.2
- **Normal Impulse Clamping ($J_n \ge 0$):**
  Rigid bodies exhibit unilateral non-penetration. Solids can exert repulsive normal forces to prevent interpenetration, but they cannot exert attractive (tensile) forces. If $J_n < 0$ were allowed, surfaces would act like sticky glue, pulling bodies together when they attempt to separate.
- **Tangential Impulse Clamping ($|J_t| \le \mu J_n$):**
  Friction is a bilateral resisting force that opposes relative motion in either direction along the tangent line ($+\hat{\mathbf{t}}$ or $-\hat{\mathbf{t}}$). Coulomb's law establishes that the maximum shear stress sustainable by surface asperities before slipping occurs is bounded symmetrically by $\mu J_n$ in both directions. $\blacksquare$

### Solution 11.3
- Center $\mathbf{c} = [0, 0]^T$, contact $\mathbf{p} = [0.8, 0.0]^T$.
- Lever arm: $\mathbf{r} = \mathbf{p} - \mathbf{c} = [0.8, 0.0]^T\text{ m}$.
- Rotational lever arm: $\mathbf{r}^\perp = [-r_y, r_x]^T = [0.0, 0.8]^T$.
- Linear velocity: $\mathbf{v} = [1.0, 2.0]^T\text{ m/s}$. Angular velocity: $\omega = 5.0\text{ rad/s}$.
- Material point velocity:

$$\dot{\mathbf{p}} = \mathbf{v} + \omega \mathbf{r}^\perp = \begin{bmatrix} 1.0 \\ 2.0 \end{bmatrix} + 5.0 \begin{bmatrix} 0.0 \\ 0.8 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 2.0 + 4.0 \end{bmatrix} = \begin{bmatrix} 1.0 \\ 6.0 \end{bmatrix}\text{ m/s}$$

$\blacksquare$

### Solution 11.4
- $m = 5.0\text{ kg} \implies w = 1/5.0 = 0.20\text{ kg}^{-1}$.
- $I = 2.0\text{ kg}\cdot\text{m}^2$.
- $\mathbf{r} = [0.0, -1.0]^T\text{ m}$, $\hat{\mathbf{n}} = [1.0, 0.0]^T$.
- Cross product:

$$\mathbf{r} \times \hat{\mathbf{n}} = r_x n_y - r_y n_x = (0.0)(0.0) - (-1.0)(1.0) = +1.0\text{ m}$$

- Effective inverse mass:

$$M_n^{-1} = w + \frac{(\mathbf{r} \times \hat{\mathbf{n}})^2}{I} = 0.20 + \frac{1.0^2}{2.0} = 0.20 + 0.50 = 0.70\text{ kg}^{-1}$$

$\blacksquare$

### Solution 11.5
- $M_n = 4.0\text{ kg}$, $v_n^- = -3.0\text{ m/s}$, $e = 0.2$.
- Unconstrained normal impulse formula:

$$J_n = -M_n (1 + e) v_n^- = -(4.0\text{ kg})(1 + 0.2)(-3.0\text{ m/s}) = -(4.0)(1.2)(-3.0) = +14.4\text{ N}\cdot\text{s}$$

- Since $14.4 \ge 0$, clamping is satisfied. $J_n = 14.4\text{ N}\cdot\text{s}$. $\blacksquare$

### Solution 11.6
- Normal impulse: $J_n = 14.4\text{ N}\cdot\text{s}$. Friction coefficient: $\mu = 0.40$.
- Maximum friction limit:

$$J_{\max} = \mu J_n = 0.40 \times 14.4 = 5.76\text{ N}\cdot\text{s}$$

- Tangential parameters: $M_t = 3.0\text{ kg}$, $v_t^- = 5.0\text{ m/s}$.
- Unconstrained impulse to halt sliding:

$$J_t^* = -M_t v_t^- = -(3.0\text{ kg})(5.0\text{ m/s}) = -15.0\text{ N}\cdot\text{s}$$

- Clamping to $[-J_{\max}, +J_{\max}] = [-5.76, +5.76]$:

$$J_t = \operatorname{clamp}(-15.0, -5.76, +5.76) = -5.76\text{ N}\cdot\text{s}$$

- Post-collision tangential velocity:

$$v_t^+ = v_t^- + M_t^{-1} J_t = 5.0 + \left(\frac{1}{3.0}\right)(-5.76) = 5.0 - 1.92 = +3.08\text{ m/s}$$

$\blacksquare$

### Solution 11.7
- In constrained multi-body dynamics, the equations of motion with velocity constraints form a Linear Complementarity Problem (LCP): $\mathbf{A} \boldsymbol{\lambda} + \mathbf{b} \ge \mathbf{0}, \boldsymbol{\lambda} \ge \mathbf{0}, \boldsymbol{\lambda}^T (\mathbf{A} \boldsymbol{\lambda} + \mathbf{b}) = 0$.
- In Projected Gauss-Seidel (PGS), the system matrix $\mathbf{A}$ is split into diagonal $\mathbf{D}$, strictly lower triangular $\mathbf{L}$, and strictly upper triangular $\mathbf{U}$. The algorithm iterates: $\lambda_i^{(k+1)} = \operatorname{proj}\left( \frac{1}{A_{ii}} (b_i - \sum_{j < i} A_{ij} \lambda_j^{(k+1)} - \sum_{j > i} A_{ij} \lambda_j^{(k)}) \right)$.
- In Sequential Impulses:
  1. Each constraint $i$ is visited in order.
  2. The current relative velocity is evaluated using the latest body velocities (which already contain updates from constraints $j < i$ from the current iteration and $j > i$ from the previous iteration).
  3. The scalar delta impulse $\Delta \lambda_i$ is computed using the diagonal inverse mass $M_i = 1/A_{ii}$.
  4. The accumulated impulse is projected onto the admissible set (clamping).
  5. The change is immediately applied to the bodies' velocity state.
- Because the physical velocity state stores the running sum $\mathbf{v} = \mathbf{v}_0 + \mathbf{M}^{-1} \mathbf{J}^T \boldsymbol{\lambda}$, evaluating the constraint directly on $\mathbf{v}$ computes the exact matrix-vector product row $\sum A_{ij} \lambda_j$. The mathematical operations of Sequential Impulses and PGS are algebraically identical. $\blacksquare$

### Solution 11.8
- Parameters: $M_{n,1} = M_{n,2} = 2.0\text{ kg}$, coupling $\gamma = 0.10\text{ kg}^{-1}$.
- Initial velocities: $v_1 = -0.50\text{ m/s}, v_2 = -0.50\text{ m/s}$. Initial impulses: $J_1 = 0, J_2 = 0$.
- **Iteration 1:**
  - Contact 1: $\Delta J_1 = -M_1 v_1 = -(2.0)(-0.50) = +1.00\text{ N}\cdot\text{s}$.
    $J_1 = 1.00\text{ N}\cdot\text{s}$.
    Velocity update to Contact 2: $v_2 \leftarrow v_2 + \gamma \Delta J_1 = -0.50 + 0.10(1.00) = -0.40\text{ m/s}$.
  - Contact 2: $\Delta J_2 = -M_2 v_2 = -(2.0)(-0.40) = +0.80\text{ N}\cdot\text{s}$.
    $J_2 = 0.80\text{ N}\cdot\text{s}$.
    Velocity update to Contact 1: $v_1 \leftarrow v_1 + \gamma \Delta J_2 = 0.00 + 0.10(0.80) = +0.08\text{ m/s}$.
- **Iteration 2:**
  - Contact 1: $\Delta J_1 = -M_1 v_1 = -(2.0)(+0.08) = -0.16\text{ N}\cdot\text{s}$.
    $J_1 = \max(0, 1.00 - 0.16) = 0.84\text{ N}\cdot\text{s}$.
    Velocity update to Contact 2: $v_2 \leftarrow 0.00 + 0.10(-0.16) = -0.016\text{ m/s}$.
  - Contact 2: $\Delta J_2 = -M_2 v_2 = -(2.0)(-0.016) = +0.032\text{ N}\cdot\text{s}$.
    $J_2 = \max(0, 0.80 + 0.032) = 0.832\text{ N}\cdot\text{s}$.
- Both impulses rapidly converge toward the symmetric equilibrium $J \approx 0.833\text{ N}\cdot\text{s}$. $\blacksquare$

### Solution 11.9
- **Data Structure:**
  - A hash map or persistent manifold pool keyed by a 64-bit combined integer: `(BodyId_A << 32) | BodyId_B`.
  - Inside each manifold entry, an array of up to 2 contact points is maintained.
  - Each contact point stores:
    - `id`: 32-bit Feature ID encoding `(referenceEdgeIndex << 16) | incidentVertexIndex`.
    - `normalImpulse`: scalar $J_n$ accumulated over previous iterations.
    - `tangentImpulse`: scalar $J_t$ accumulated over previous iterations.
- **Workflow:**
  1. When new narrow-phase contacts are generated, match each new point against the existing cache using `id`.
  2. If matched, copy `normalImpulse` and `tangentImpulse` into the active solver contact.
  3. Pre-apply cached impulses during the velocity pre-step.
  4. After solver iterations, write the new accumulated impulses back to the cache.
  5. Unmatched stale cache entries are purged. $\blacksquare$

### Solution 11.10
- **Failure Mode:**
  If an obstacle is suddenly teleported, deleted, or flipped, the cached impulses from the previous frame represent massive supporting forces that belonged to the previous geometric configuration. Applying those old impulses blindly into the new configuration launches bodies across the world or creates explosive rotational energy.
- **Safeguards:**
  1. **Maximum Impulse Cap:** Clamp warm start impulses to a safe threshold (e.g., $J_n \le m g \Delta t \times 5$).
  2. **Topological Invalidation:** Invalidate and clear the contact cache for any body that experiences manual teleportation, deletion, or kinematic velocity overrides.
  3. **Separation Distance Check:** If the current separation distance at a cached contact point exceeds a threshold (e.g., $d > 0.02\text{ m}$), immediately discard the cached impulses. $\blacksquare$
