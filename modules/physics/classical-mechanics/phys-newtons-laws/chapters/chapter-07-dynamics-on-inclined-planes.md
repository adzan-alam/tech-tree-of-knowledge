# Chapter 07: Dynamics on Inclined Planes — Coordinate Transformations and Gravity Dilution

> *"The mechanical advantage of the inclined plane is not a trick to circumvent nature; it is the geometry of vector projection, diluting the unrelenting vertical pull of gravity into an accessible orthogonal vector field."*

---

## 7.1 The Inclined Plane as a Physical and Mathematical Crucible

In the development of classical mechanics, no apparatus occupies a more pivotal position than the inclined plane. In the early seventeenth century, Galileo Galilei confronted an experimental crisis: free-falling terrestrial bodies accelerated at approximately $9.81\,\text{m/s}^2$. In a world lacking electronic chronometers, photogates, or high-speed stroboscopic photography, an object dropped from a height of two meters strikes the earth in barely $0.64$ seconds. Water clocks and pulse measurements lacked the precision required to resolve the microsecond intervals of such rapid motion.

Galileo's masterstroke was conceptual and geometrical: by placing a polished sphere upon a gently tilted, grooved timber beam, he **diluted the effective acceleration of gravity**. A ramp inclined at an angle of $\theta = 5^\circ$ dilutes vertical acceleration by a factor of $\sin(5^\circ) \approx 0.087$. The acceleration of the sphere drops from $9.81\,\text{m/s}^2$ to a manageable $0.855\,\text{m/s}^2$. The time required to traverse two meters expands from $0.64$ seconds to over $2.16$ seconds—an interval easily resolved with pendulum swings and regulated water outflow.

However, the inclined plane is far more than an antique laboratory tool. It represents the quintessential archetype of **constrained two-dimensional Newtonian dynamics**. A body resting on or sliding along an inclined plane is subjected to a unilateral spatial constraint: it is prevented from penetrating the surface by microscopic quantum-electrostatic repulsion (macroscopically manifested as the normal contact force $\vec{N}$), yet it is free to accelerate along the surface vector tangent.

Mastering inclined plane dynamics requires an uncompromising grasp of:
1. **Coordinate rotations** and the principle of axis decoupling.
2. **Vector decomposition of non-orthogonal force fields**.
3. **Directional asymmetry of Coulomb friction** during upward versus downward translation.
4. **Variational force optimization** at arbitrary applied angles.
5. **Coupled non-inertial accelerating wedges**.

---

## 7.2 The Principle of Coordinate Transformation: Tilting the Cartesian Frame

When approaching any dynamic system governed by Newton’s Second Law:

$$\sum \vec{F} = m \vec{a}$$

the choice of coordinate axes does not alter physical reality, but it dictates the mathematical complexity of the equations of motion.

Consider a block of mass $m$ constrained to slide on a planar ramp inclined at angle $\theta$ relative to the horizontal. Suppose we insist on maintaining the standard laboratory Cartesian frame:
- $+\hat{I}$ horizontal (pointing rightward).
- $+\hat{J}$ vertical (pointing upward).

In this un-tilted laboratory frame, the gravitational force vector is simple:

$$\vec{F}_g = -mg\,\hat{J}$$

However, the normal force $\vec{N}$, which acts perpendicular to the inclined ramp surface, is tilted by angle $\theta$ relative to the vertical. Its unit normal vector is:

$$\hat{n} = -\sin\theta\,\hat{I} + \cos\theta\,\hat{J}$$

Thus, the normal force vector becomes:

$$\vec{N} = N(-\sin\theta\,\hat{I} + \cos\theta\,\hat{J})$$

Furthermore, the physical motion of the block is strictly constrained to the plane of the ramp. If the ramp descends to the right at angle $\theta$, the acceleration vector $\vec{a}$ must lie along the unit tangent vector $\hat{u} = \cos\theta\,\hat{I} - \sin\theta\,\hat{J}$. Therefore:

$$\vec{a} = a_x\,\hat{I} + a_y\,\hat{J} = a\cos\theta\,\hat{I} - a\sin\theta\,\hat{J}$$

Applying Newton's Second Law in the laboratory frame yields two coupled equations:

$$\sum F_X: \quad -N\sin\theta = m(a\cos\theta)$$

$$\sum F_Y: \quad N\cos\theta - mg = m(-a\sin\theta)$$

To determine the acceleration $a$, one must eliminate $N$ algebraically by substituting $N = -ma\frac{\cos\theta}{\sin\theta}$ into the second equation, multiplying trigonometric factors, and invoking Pythagorean identities. While completely valid, this coupled approach invites algebraic error and obscures physical intuition.

```
       UN-TILTED (Coupled)                  TILTED (Decoupled)
             +Y                                     +y
              ^                                     ^
              |    /|                               |    /
              |   / |                               |   /
              |  /  |                               |  /
              | /   |                               | /
      --------+---->+X                     ---------+----> +x (Down ramp)
             /|                                    /|
            / |                                   / |
           /  |                                  /  |
```

### The Tilted Frame Protocol
Now consider the **Tilted Coordinate System** $(\hat{i}, \hat{j})$:
- Let $+\hat{i}$ point **parallel to the ramp surface**, directed down the incline.
- Let $+\hat{j}$ point **perpendicular (normal) to the ramp surface**, directed outward away from the incline.

In this rotated basis, the kinematic constraint of the surface enforces an absolute identity:

$$a_y \equiv 0, \quad v_y \equiv 0$$

The block cannot levitate off the ramp ($a_y > 0$) unless driven by external forces exceeding the gravitational binding component, nor can it sink into the rigid solid plane ($a_y < 0$). Consequently, all acceleration is concentrated along the single coordinate axis $x$:

$$\vec{a} = a_x\,\hat{i} = a\,\hat{i}$$

Now observe what happens to the forces. The normal force $\vec{N}$ is purely along $+\hat{j}$:

$$\vec{N} = N\,\hat{j}$$

The friction force $\vec{f}$ (if present) is purely along $\pm\hat{i}$:

$$\vec{f} = \pm f\,\hat{i}$$

The only force that does not align with the tilted axes is gravity $\vec{F}_g$. We must therefore project $\vec{F}_g$ into its parallel and perpendicular components.

---

## 7.3 Rigorous Gravitational Vector Decomposition

The Earth exerts a downward gravitational force $\vec{F}_g = -mg\,\hat{J}$. Let us establish the exact geometric decomposition into the $(\hat{i}, \hat{j})$ frame.

Consider the right triangle formed by the incline, the horizontal floor, and the vertical back wall. The angle of inclination is $\theta$.
1. The ramp rises at angle $\theta$ above the horizontal.
2. The normal vector $\hat{j}$ is perpendicular to the ramp ($90^\circ$ relative to the ramp surface).
3. The gravitational force vector $\vec{F}_g$ is perpendicular to the horizontal floor ($90^\circ$ relative to the horizontal).
4. By classical Euclidean geometry (similar triangles), the angle between the vertical gravitational vector and the surface normal $\hat{j}$ is precisely $\theta$.

```
                     \  +y (Normal)
                      \
                       \
                        \     | -Y (True Vertical Gravity)
                         \    |
                          \   |
                           \  | angle θ
                            \ |
    =========================\|==================== Ramp surface (+x ->)
                              \
                               \
```

Projecting the vector $\vec{F}_g = m\vec{g}$ onto the orthogonal axes:
- **Perpendicular Component ($F_{g\perp}$ or $F_{gy}$):** Opposes $+\hat{j}$.
  $$F_{gy} = -mg \cos\theta$$
- **Parallel Component ($F_{g\parallel}$ or $F_{gx}$):** Directed down the incline along $+\hat{i}$.
  $$F_{gx} = +mg \sin\theta$$

Thus, in our tilted frame:

$$\vec{F}_g = (mg\sin\theta)\,\hat{i} - (mg\cos\theta)\,\hat{j}$$

### The Limiting Behavior Test (Sanity Verification)
Always verify trigonometric decomposition against extreme physical limits:
1. **Horizontal Plane ($\theta \to 0^\circ$):**
   - $\sin(0^\circ) = 0 \implies F_{gx} = 0$. (No gravitational force drives the block sideways along a flat floor).
   - $\cos(0^\circ) = 1 \implies F_{gy} = -mg$. (Full gravitational weight presses normally into the floor).
2. **Vertical Wall ($\theta \to 90^\circ$):**
   - $\sin(90^\circ) = 1 \implies F_{gx} = mg$. (The block is in unconstrained free fall parallel to the wall).
   - $\cos(90^\circ) = 0 \implies F_{gy} = 0$. (The block exerts zero normal contact pressure against the vertical wall).

Both limits match physical reality precisely, proving that $\sin\theta$ governs the downslope drive and $\cos\theta$ governs normal contact pressure.

---

## 7.4 The Frictionless Incline and Galileo’s Chords Theorem

On a completely smooth, frictionless incline ($\mu = 0$):

$$\sum F_y = N - mg\cos\theta = m a_y = 0 \implies N = mg\cos\theta$$

$$\sum F_x = mg\sin\theta = m a_x \implies a_x = g\sin\theta$$

Notice that the mass $m$ cancels completely from both sides of the dynamic equation! In accordance with the Weak Equivalence Principle, **all bodies, regardless of mass, slide down a frictionless incline of angle $\theta$ with the identical acceleration $a = g\sin\theta$**.

### Kinematics on a Ramp of Length $L$ and Height $h$
Let a ramp have straight slant length $L$ and vertical vertical height $h = L\sin\theta$. If a body is released from rest ($v_0 = 0$) at the summit:

$$v^2 = v_0^2 + 2 a_x L = 0 + 2(g\sin\theta)L = 2g(L\sin\theta) = 2gh \implies v = \sqrt{2gh}$$

Remarkably, the terminal speed at the foot of the ramp depends **solely on the vertical drop $h$**, completely independent of the angle of inclination $\theta$! A block sliding down a shallow $5^\circ$ ramp of vertical drop $h$ achieves the exact same terminal speed as an object dropped in vertical free fall ($90^\circ$) from the same height $h$.

However, the **elapsed time** to reach the bottom depends sensitively on $\theta$:

$$L = \frac{1}{2} a_x t^2 = \frac{1}{2}(g\sin\theta)t^2 \implies t = \sqrt{\frac{2L}{g\sin\theta}} = \sqrt{\frac{2h}{g\sin^2\theta}} = \frac{1}{\sin\theta}\sqrt{\frac{2h}{g}}$$

As $\theta \to 0^\circ$, $t \to \infty$. As $\theta \to 90^\circ$, $t \to \sqrt{2h/g}$ (free-fall time).

### Galileo's Beautiful Chords Theorem
A classic theorem of Euclidean mechanics discovered by Galileo states:
> *Let a vertical circle of diameter $D = 2R$ be drawn in a uniform gravitational field $g$. If straight frictionless chutes are constructed along any chord originating from the apex of the circle to any point on its circumference, a body released from rest at the apex will traverse each chord in exactly the same time.*

```
                 Apex (Top of circle)
                      ( * )
                     /  |  \
                    /   |   \  Chord 2 (angle θ2)
       Chord 1     /    |    \
      (angle θ1)  /     |     \
                 /      |      \
                *       *       *
               Circumference of Circle
```

#### Analytical Proof
Let the diameter of the vertical circle be $D$. Let a chord be drawn from the uppermost point (the apex) at an angle $\alpha$ relative to the vertical diameter.
1. In the right triangle formed by the chord, the vertical diameter $D$, and the line connecting the chord's lower endpoint to the bottom of the circle (by Thales' theorem, any angle subtended by a diameter is $90^\circ$):
   $$\text{Length of chord } L = D\cos\alpha$$
2. The tilt angle of this chord relative to the horizontal is $\theta = 90^\circ - \alpha$.
3. The acceleration down this incline is:
   $$a = g\sin\theta = g\sin(90^\circ - \alpha) = g\cos\alpha$$
4. The time $t$ to slide down the chord from rest is:
   $$t = \sqrt{\frac{2L}{a}} = \sqrt{\frac{2(D\cos\alpha)}{g\cos\alpha}} = \sqrt{\frac{2D}{g}}$$

The angular factor $\cos\alpha$ cancels identically! Thus, **every chord drawn from the top of a vertical circle takes the exact same descent time $t = \sqrt{2D/g}$**, regardless of whether it is nearly vertical ($\alpha \approx 0$) or nearly horizontal ($\alpha \to 90^\circ$).

---

## 7.5 Coulomb Friction on an Incline: Asymmetry and the Angle of Repose

When Coulomb friction is introduced, the system transitions from reversible potential-kinetic energy exchange to dissipative thermodynamics.

Let the static coefficient of friction be $\mu_s$ and the kinetic coefficient be $\mu_k$, with $\mu_s > \mu_k$.

### The Critical Angle of Repose ($\theta_r$)
Place a resting block on an incline and slowly increase the tilt angle $\theta$ from zero.
- Normal force: $N = mg\cos\theta$.
- Downward gravitational drive: $F_{gx} = mg\sin\theta$.
- Static friction force $f_s$ acts upslope to maintain equilibrium:
  $$\sum F_x = mg\sin\theta - f_s = 0 \implies f_s = mg\sin\theta$$
Static friction is self-adjusting. However, it possesses an upper threshold:
$$f_s \le f_{s,\max} = \mu_s N = \mu_s mg\cos\theta$$

Equilibrium holds as long as:
$$mg\sin\theta \le \mu_s mg\cos\theta \implies \frac{\sin\theta}{\cos\theta} \le \mu_s \implies \tan\theta \le \mu_s$$

The critical angle at which slipping commences is called the **Angle of Repose** $\theta_r$:

$$\theta_r = \arctan(\mu_s)$$

- If $\theta \le \arctan(\mu_s)$, the block remains stationary indefinitely.
- If $\theta > \arctan(\mu_s)$, static friction ruptures, asperity cold-welds shear, and the block begins accelerating down the ramp under kinetic friction.

```
       tan(θ) < μs             tan(θ) = μs             tan(θ) > μs
      [ Static Hold ]        [ Incipient Slip ]      [ Accelerated Slip ]
         a_x = 0                 a_x = 0             a_x = g(sinθ - μk cosθ)
```

### Regime A: Sliding Down the Incline
When the block slides down the ramp ($v_x > 0$), kinetic friction opposes the velocity vector and points **up the incline** ($-\hat{i}$):

$$\vec{f}_k = -f_k\,\hat{i} = -(\mu_k N)\,\hat{i} = -(\mu_k mg\cos\theta)\,\hat{i}$$

Newton's Second Law along the parallel axis:

$$\sum F_x = mg\sin\theta - \mu_k mg\cos\theta = m a_{\text{down}}$$

$$a_{\text{down}} = g(\sin\theta - \mu_k\cos\theta)$$

- If $\tan\theta > \mu_k$, $a_{\text{down}} > 0$: the block accelerates downslope.
- If $\tan\theta = \mu_k$, $a_{\text{down}} = 0$: the block slides at constant terminal velocity (steady descent).
- If $\tan\theta < \mu_k$, $a_{\text{down}} < 0$: a block launched downward will decelerate and come to rest.

### Regime B: Projected Up the Incline
Suppose the block is given an initial upward velocity $v_0$ along the ramp ($v_x < 0$ or taking $+x$ directed up the incline).
Now, velocity points **up the ramp**. Because kinetic friction strictly opposes relative velocity, friction reverses direction and points **down the ramp**!

Both gravity and friction now collaborate to decelerate the body:

$$\sum F_{x,\text{upslope}} = -mg\sin\theta - f_k = -mg\sin\theta - \mu_k mg\cos\theta = m a_{\text{up}}$$

$$a_{\text{up}} = -g(\sin\theta + \mu_k\cos\theta)$$

The magnitude of deceleration on the upward journey is:

$$|a_{\text{up}}| = g(\sin\theta + \mu_k\cos\theta)$$

Notice the stark asymmetry between upward and downward acceleration:

$$|a_{\text{up}}| > |a_{\text{down}}|$$

### The Ascent-Descent Time Asymmetry Theorem
Let a projectile block be launched up a rough incline with speed $v_0$. It ascends to a stopping distance $s_{\max}$, halts instantaneously, and (assuming $\tan\theta > \mu_s$) slides back down to the launch point.

1. **Distance to apex ($s_{\max}$):**
   $$v^2 = v_0^2 - 2|a_{\text{up}}| s_{\max} = 0 \implies s_{\max} = \frac{v_0^2}{2g(\sin\theta + \mu_k\cos\theta)}$$
2. **Ascent Time ($t_{\text{up}}$):**
   $$v = v_0 - |a_{\text{up}}| t_{\text{up}} = 0 \implies t_{\text{up}} = \frac{v_0}{|a_{\text{up}}|} = \sqrt{\frac{2 s_{\max}}{|a_{\text{up}}|}}$$
3. **Descent Time ($t_{\text{down}}$):**
   The block starts from rest at the apex and covers the same distance $s_{\max}$ with acceleration $a_{\text{down}}$:
   $$s_{\max} = \frac{1}{2} a_{\text{down}} t_{\text{down}}^2 \implies t_{\text{down}} = \sqrt{\frac{2 s_{\max}}{a_{\text{down}}}}$$
4. **Ratio of Descent to Ascent Time:**
   $$\frac{t_{\text{down}}}{t_{\text{up}}} = \sqrt{\frac{|a_{\text{up}}|}{a_{\text{down}}}} = \sqrt{\frac{\sin\theta + \mu_k\cos\theta}{\sin\theta - \mu_k\cos\theta}} > 1$$

Because $|a_{\text{up}}| > a_{\text{down}}$, **the return trip always takes strictly longer than the upward trip**:

$$t_{\text{down}} > t_{\text{up}}$$

Furthermore, the return speed $v_{\text{return}}$ at the bottom is:

$$v_{\text{return}} = \sqrt{2 a_{\text{down}} s_{\max}} = v_0 \sqrt{\frac{a_{\text{down}}}{|a_{\text{up}}|}} = v_0 \sqrt{\frac{\sin\theta - \mu_k\cos\theta}{\sin\theta + \mu_k\cos\theta}} < v_0$$

The difference in kinetic energy $\Delta K = \frac{1}{2}m(v_0^2 - v_{\text{return}}^2) = 2 f_k s_{\max}$ is irrevocably dissipated as thermal energy into the contact asperities.

---

## 7.6 Variational Force Optimization: Pulling at an Arbitrary Angle

Suppose an engineer must drag a massive crate of mass $m$ up an inclined plane of tilt $\theta$ with kinetic coefficient $\mu_k$. The pulling force $\vec{F}$ can be applied at any angle $\phi$ relative to the inclined ramp surface.

```
                     ^ +y (Normal)
                     |       /  Pulling Force F
                     |      /
                     |     / ) angle φ
                     |    /
    -----------------+---+-------------------- Ramp surface (+x ->)
                    / \
                   /   \
                  /     \
```

What is the optimal angle $\phi^*$ that minimizes the pulling force $F$ required to maintain a constant velocity ($a = 0$)?

### Force Balance Equations
Resolve all forces along the tilted axes $(\hat{i}, \hat{j})$ where $+x$ is up the ramp and $+y$ is perpendicular to the ramp:
- Pulling force: $\vec{F} = F\cos\phi\,\hat{i} + F\sin\phi\,\hat{j}$
- Normal force: $\vec{N} = N\,\hat{j}$
- Gravity: $\vec{F}_g = -mg\sin\theta\,\hat{i} - mg\cos\theta\,\hat{j}$
- Kinetic friction: $\vec{f}_k = -f_k\,\hat{i} = -\mu_k N\,\hat{i}$

Apply equilibrium conditions ($\sum F_y = 0$ and $\sum F_x = 0$):

$$\sum F_y: \quad N + F\sin\phi - mg\cos\theta = 0 \implies N = mg\cos\theta - F\sin\phi$$

*(Note the crucial condition: $F\sin\phi \le mg\cos\theta$ to prevent the block from lifting off the surface).*

$$\sum F_x: \quad F\cos\phi - mg\sin\theta - \mu_k N = 0$$

Substitute the expression for $N$:

$$F\cos\phi - mg\sin\theta - \mu_k (mg\cos\theta - F\sin\phi) = 0$$

$$F(\cos\phi + \mu_k\sin\phi) = mg(\sin\theta + \mu_k\cos\theta)$$

$$F(\phi) = mg \frac{\sin\theta + \mu_k\cos\theta}{\cos\phi + \mu_k\sin\phi}$$

### Analytical Minimization
To minimize $F(\phi)$, we must maximize the denominator function:

$$D(\phi) = \cos\phi + \mu_k\sin\phi$$

Take the first derivative with respect to $\phi$ and set it to zero:

$$\frac{d D}{d\phi} = -\sin\phi + \mu_k\cos\phi = 0 \implies \sin\phi = \mu_k\cos\phi \implies \tan\phi^* = \mu_k$$

$$\phi^* = \arctan(\mu_k)$$

This is a profound and elegant result: **The optimal pulling angle relative to the incline depends exclusively on the coefficient of friction $\mu_k$ and is completely independent of the ramp tilt angle $\theta$ and the mass $m$!**

Let us compute the maximum value of $D(\phi^*)$. Using the standard right-triangle identity where $\tan\phi = \mu_k$, the hypotenuse is $\sqrt{1 + \mu_k^2}$:
- $\cos\phi^* = \frac{1}{\sqrt{1 + \mu_k^2}}$
- $\sin\phi^* = \frac{\mu_k}{\sqrt{1 + \mu_k^2}}$

$$D_{\max} = \frac{1}{\sqrt{1 + \mu_k^2}} + \mu_k \frac{\mu_k}{\sqrt{1 + \mu_k^2}} = \frac{1 + \mu_k^2}{\sqrt{1 + \mu_k^2}} = \sqrt{1 + \mu_k^2}$$

Substituting $D_{\max}$ into the force formula gives the absolute minimum force:

$$F_{\min} = mg \frac{\sin\theta + \mu_k\cos\theta}{\sqrt{1 + \mu_k^2}}$$

If we define the friction angle $\phi_f = \arctan(\mu_k)$, then $\mu_k = \tan\phi_f = \frac{\sin\phi_f}{\cos\phi_f}$. The numerator simplifies to:
$$\sin\theta + \frac{\sin\phi_f}{\cos\phi_f}\cos\theta = \frac{\sin\theta\cos\phi_f + \cos\theta\sin\phi_f}{\cos\phi_f} = \frac{\sin(\theta + \phi_f)}{\cos\phi_f}$$
And since $\sqrt{1 + \mu_k^2} = \sec\phi_f = 1/\cos\phi_f$, the expression collapses to:

$$F_{\min} = mg \sin(\theta + \phi_f)$$

Physical intuition reveals why $\phi^* > 0$: pulling upward relieves normal force, slashing frictional drag, while still directing the majority of effort parallel to the incline.

---

## 7.7 Movable Wedges and Non-Inertial Coupled Systems

Consider a classic problem in advanced Newtonian mechanics: a triangular wedge of mass $M$ with an incline angle $\theta$ rests upon a frictionless horizontal floor. A block of mass $m$ is placed upon the smooth incline of the wedge. Both bodies are released from rest.

```
                  m
                 /|
                / |
               /  |
            M /   |
             /    |
            /θ    |
    =======+======+===================== Horizontal Floor (Frictionless)
```

Because the floor is frictionless, the wedge accelerates horizontally to the left as the block slides down and to the right. The wedge is a **non-inertial accelerating reference frame**.

Let:
- $X$ be the horizontal coordinate of the wedge (measured positive to the left).
- $x$ and $y$ be the coordinates of the block in the stationary laboratory frame.

Let us solve this rigorously using Newton’s laws and kinematic constraints.

### 1. Forces on the Block of Mass $m$
The block touches only the frictionless incline of the wedge. The contact force is the normal force $N$, acting perpendicular to the ramp face.
The ramp surface is tilted at angle $\theta$ to the horizontal. The unit normal pointing away from the ramp face (upward and rightward) has components:
- Horizontal: $N\sin\theta$ (directed rightward)
- Vertical: $N\cos\theta$ (directed upward)

Newton's Second Law for the block in the laboratory frame:

$$\sum F_x^{(m)} = N\sin\theta = m a_{mx} \implies a_{mx} = \frac{N\sin\theta}{m}$$

$$\sum F_y^{(m)} = N\cos\theta - mg = m a_{my} \implies a_{my} = \frac{N\cos\theta - mg}{m}$$

### 2. Forces on the Wedge of Mass $M$
By Newton's Third Law, the block exerts an equal and opposite force on the wedge:
$$\vec{F}_{\text{block}\to\text{wedge}} = -N\sin\theta\,\hat{I} - N\cos\theta\,\hat{J}$$
The horizontal floor exerts a vertical normal support force $N_{\text{floor}}$ on the base of the wedge. Since the wedge does not move vertically:
$$a_{My} \equiv 0$$
Along the horizontal direction, the only force acting on the wedge is the horizontal component of the normal force from the block, directed to the left:
$$\sum F_X^{(M)} = N\sin\theta = M A_W$$
where $A_W$ is the leftward horizontal acceleration of the wedge:

$$A_W = \frac{N\sin\theta}{M}$$

### 3. The Kinematic Surface Constraint
The block must remain in contact with the inclined surface of the wedge at all times.
In the reference frame of the wedge (which accelerates leftward with acceleration $A_W$), the block's relative horizontal acceleration to the right is:

$$a_{\text{rel}, x} = a_{mx} - (-A_W) = a_{mx} + A_W$$

The relative vertical acceleration is simply $a_{my}$ (since the wedge has no vertical motion):

$$a_{\text{rel}, y} = a_{my}$$

Because the block slides along a ramp inclined at angle $\theta$ to the horizontal:

$$\tan\theta = \frac{|a_{\text{rel}, y}|}{a_{\text{rel}, x}} = \frac{-a_{my}}{a_{mx} + A_W}$$

Substitute the dynamic relations for $a_{mx}$, $a_{my}$, and $A_W$:

$$-a_{my} = g - \frac{N\cos\theta}{m}$$

$$a_{mx} + A_W = \frac{N\sin\theta}{m} + \frac{N\sin\theta}{M} = N\sin\theta\left(\frac{1}{m} + \frac{1}{M}\right) = N\sin\theta\left(\frac{m+M}{mM}\right)$$

Equating via the constraint:

$$g - \frac{N\cos\theta}{m} = \tan\theta \cdot N\sin\theta\left(\frac{m+M}{mM}\right) = N\frac{\sin^2\theta}{\cos\theta}\left(\frac{m+M}{mM}\right)$$

Multiply throughout by $m\cos\theta$:

$$mg\cos\theta - N\cos^2\theta = N\sin^2\theta\left(\frac{m+M}{M}\right) = N\sin^2\theta\left(1 + \frac{m}{M}\right) = N\sin^2\theta + N\frac{m}{M}\sin^2\theta$$

Rearrange to solve for $N$:

$$mg\cos\theta = N\left(\cos^2\theta + \sin^2\theta + \frac{m}{M}\sin^2\theta\right) = N\left(1 + \frac{m}{M}\sin^2\theta\right)$$

$$N = \frac{mg\cos\theta}{1 + \frac{m}{M}\sin^2\theta}$$

### Analysis of the Result
1. **Infinitely Massive Wedge ($M \to \infty$):**
   $$\frac{m}{M} \to 0 \implies N \to mg\cos\theta$$
   This perfectly recovers the static inclined plane formula!
2. **Finite Wedge Mass ($M < \infty$):**
   Since $\frac{m}{M}\sin^2\theta > 0$, the denominator is strictly greater than 1.
   Therefore, **$N < mg\cos\theta$**. As the wedge accelerates out from underneath the block, the normal contact pressure decreases!
3. **Horizontal Acceleration of the Wedge:**
   $$A_W = \frac{N\sin\theta}{M} = \frac{mg\sin\theta\cos\theta}{M + m\sin^2\theta} = \frac{mg\sin(2\theta)}{2(M + m\sin^2\theta)}$$

---

## 7.8 Worked Numerical Examples (10 Progressive Scenarios)

The following 10 worked examples progress methodically from fundamental elementary kinematics to advanced coupled systems.

---

### Example 7.1: Frictionless Skier Acceleration and Final Speed
**Problem:** A skier of mass $m = 75.0\,\text{kg}$ starts from rest at the top of a smooth, frictionless snowy incline of angle $\theta = 28.0^\circ$ and length $L = 120.0\,\text{m}$. Taking $g = 9.81\,\text{m/s}^2$:
1. Calculate the normal force exerted by the snow on the skier.
2. Determine the skier's downslope acceleration.
3. Calculate the time required to reach the base of the incline.
4. Calculate the skier's velocity at the base.

**Solution:**
- **Step 1: Normal force**
  $$N = mg\cos\theta = (75.0\,\text{kg})(9.81\,\text{m/s}^2)\cos(28.0^\circ)$$
  $$\cos(28.0^\circ) = 0.88295$$
  $$N = (75.0)(9.81)(0.88295) = 649.63\,\text{N}$$

- **Step 2: Acceleration**
  $$a = g\sin\theta = (9.81\,\text{m/s}^2)\sin(28.0^\circ)$$
  $$\sin(28.0^\circ) = 0.46947$$
  $$a = (9.81)(0.46947) = 4.6055\,\text{m/s}^2$$

- **Step 3: Time of descent**
  $$L = \frac{1}{2} a t^2 \implies t = \sqrt{\frac{2L}{a}} = \sqrt{\frac{2(120.0\,\text{m})}{4.6055\,\text{m/s}^2}} = \sqrt{52.1116} = 7.219\,\text{s}$$

- **Step 4: Final velocity**
  $$v = a t = (4.6055\,\text{m/s}^2)(7.219\,\text{s}) = 33.247\,\text{m/s}$$
  *Sanity Check via Energy:*
  $$h = L\sin(28.0^\circ) = 120.0 \times 0.46947 = 56.336\,\text{m}$$
  $$v = \sqrt{2gh} = \sqrt{2(9.81)(56.336)} = \sqrt{1105.32} = 33.246\,\text{m/s}$$
  Both methods agree to five significant digits.

---

### Example 7.2: Determination of Static and Kinetic Friction Coefficients
**Problem:** An aluminum block of mass $m = 4.20\,\text{kg}$ is placed on an adjustable steel ramp.
1. The ramp is slowly tilted until the block just begins to slip at an angle $\theta_{\text{slip}} = 24.5^\circ$. Compute the static friction coefficient $\mu_s$.
2. Once sliding, the ramp angle is adjusted to $\theta_{\text{slide}} = 18.0^\circ$, where the block is observed to slide down the ramp at a constant velocity of $1.50\,\text{m/s}$. Compute the kinetic friction coefficient $\mu_k$.

**Solution:**
- **Step 1: Coefficient of static friction**
  At incipient slip:
  $$\mu_s = \tan\theta_{\text{slip}} = \tan(24.5^\circ) = 0.4557$$
- **Step 2: Coefficient of kinetic friction**
  At constant velocity, $a = 0$:
  $$\sum F_x = mg\sin\theta_{\text{slide}} - \mu_k mg\cos\theta_{\text{slide}} = 0 \implies \mu_k = \tan\theta_{\text{slide}}$$
  $$\mu_k = \tan(18.0^\circ) = 0.3249$$
  *Sanity Check:* $\mu_s (0.4557) > \mu_k (0.3249)$, satisfying the universal thermodynamic friction law.

---

### Example 7.3: Downhill Braking Distance with Coulomb Friction
**Problem:** A cargo crate of mass $m = 250\,\text{kg}$ is accidentally released with an initial downward speed $v_0 = 8.00\,\text{m/s}$ at the top of an escape ramp inclined at $\theta = 15.0^\circ$. The surface is coated with high-friction rubber gravel giving $\mu_k = 0.420$. Take $g = 9.81\,\text{m/s}^2$.
1. Determine the net acceleration of the crate.
2. Find the distance $d$ the crate slides before coming to rest.
3. Compute the total thermal energy dissipated.

**Solution:**
- **Step 1: Net acceleration**
  $$a = g(\sin\theta - \mu_k\cos\theta)$$
  $$\sin(15.0^\circ) = 0.25882, \quad \cos(15.0^\circ) = 0.96593$$
  $$a = 9.81[0.25882 - (0.420)(0.96593)] = 9.81[0.25882 - 0.40569] = 9.81[-0.14687] = -1.4408\,\text{m/s}^2$$
  The negative sign indicates deceleration (braking).

- **Step 2: Stopping distance**
  $$v^2 = v_0^2 + 2 a d = 0 \implies d = \frac{-v_0^2}{2a} = \frac{-(8.00\,\text{m/s})^2}{2(-1.4408\,\text{m/s}^2)} = \frac{64.0}{2.8816} = 22.21\,\text{m}$$

- **Step 3: Thermal energy dissipated**
  $$\Delta E_{\text{th}} = f_k \cdot d = (\mu_k mg\cos\theta) \cdot d$$
  $$N = (250\,\text{kg})(9.81\,\text{m/s}^2)(0.96593) = 2368.94\,\text{N}$$
  $$f_k = (0.420)(2368.94\,\text{N}) = 994.95\,\text{N}$$
  $$\Delta E_{\text{th}} = (994.95\,\text{N})(22.21\,\text{m}) = 22,098\,\text{J} = 22.10\,\text{kJ}$$
  *Energy Check:* Initial $K = \frac{1}{2}(250)(8^2) = 8000\,\text{J}$. Gravitational potential energy lost $\Delta U = mg(d\sin\theta) = 250(9.81)(22.21 \times 0.25882) = 14,098\,\text{J}$.
  Total dissipated energy = $K + \Delta U = 8000 + 14098 = 22,098\,\text{J}$. Exact match.

---

### Example 7.4: Projectile Motion Up a Rough Ramp
**Problem:** A hockey puck of mass $m = 0.160\,\text{kg}$ is launched up an inclined ramp of angle $\theta = 35.0^\circ$ with initial speed $v_0 = 12.0\,\text{m/s}$. The kinetic friction coefficient is $\mu_k = 0.220$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the deceleration during ascent.
2. Determine the maximum distance $s_{\max}$ reached along the incline.
3. Determine the time of ascent $t_{\text{up}}$.
4. Determine whether the puck slides back down, and if so, compute $t_{\text{down}}$ and the return speed $v_{\text{return}}$.

**Solution:**
- **Step 1: Upward deceleration**
  $$|a_{\text{up}}| = g(\sin\theta + \mu_k\cos\theta)$$
  $$\sin(35.0^\circ) = 0.57358, \quad \cos(35.0^\circ) = 0.81915$$
  $$|a_{\text{up}}| = 9.81[0.57358 + (0.220)(0.81915)] = 9.81[0.57358 + 0.18021] = 9.81[0.75379] = 7.3947\,\text{m/s}^2$$

- **Step 2: Maximum distance**
  $$s_{\max} = \frac{v_0^2}{2|a_{\text{up}}|} = \frac{(12.0\,\text{m/s})^2}{2(7.3947\,\text{m/s}^2)} = \frac{144.0}{14.7894} = 9.7367\,\text{m}$$

- **Step 3: Ascent time**
  $$t_{\text{up}} = \frac{v_0}{|a_{\text{up}}|} = \frac{12.0\,\text{m/s}}{7.3947\,\text{m/s}^2} = 1.6228\,\text{s}$$

- **Step 4: Slide back analysis**
  To slide back down, we must have $\tan\theta > \mu_s$. Assuming $\mu_s \approx \mu_k = 0.220$:
  $$\tan(35.0^\circ) = 0.7002 \gg 0.220 \implies \text{The puck definitely slides back down!}$$
  Downslope acceleration:
  $$a_{\text{down}} = g(\sin\theta - \mu_k\cos\theta) = 9.81[0.57358 - 0.18021] = 9.81[0.39337] = 3.8589\,\text{m/s}^2$$
  Descent time:
  $$t_{\text{down}} = \sqrt{\frac{2 s_{\max}}{a_{\text{down}}}} = \sqrt{\frac{2(9.7367)}{3.8589}} = \sqrt{5.0464} = 2.2464\,\text{s}$$
  Return speed:
  $$v_{\text{return}} = a_{\text{down}} t_{\text{down}} = (3.8589\,\text{m/s}^2)(2.2464\,\text{s}) = 8.669\,\text{m/s}$$
  *Notice:* $t_{\text{down}} = 2.246\,\text{s} > t_{\text{up}} = 1.623\,\text{s}$, and $v_{\text{return}} = 8.67\,\text{m/s} < v_0 = 12.0\,\text{m/s}$, verifying the Ascent-Descent Asymmetry Theorem!

---

### Example 7.5: Horizontal Push on an Inclined Plane
**Problem:** A block of mass $m = 15.0\,\text{kg}$ sits on an incline of angle $\theta = 30.0^\circ$. A purely horizontal force $\vec{F}_{\text{push}}$ is applied to push the block *up* the incline. The coefficients of friction are $\mu_s = 0.350$ and $\mu_k = 0.250$. Take $g = 9.81\,\text{m/s}^2$.
1. Find the normal force $N$ as a function of the applied force magnitude $P$.
2. Calculate the minimum horizontal force $P_{\min}$ required to start the block moving up the incline.
3. If $P = 220.0\,\text{N}$, calculate the resulting acceleration up the incline.

**Solution:**
- **Step 1: Normal force decomposition**
  In the tilted frame:
  $\vec{F}_{\text{push}} = P\cos\theta\,\hat{i} - P\sin\theta\,\hat{j}$ (pushing horizontally rightward directs a component $P\sin\theta$ *into* the ramp!).
  $$\sum F_y = N - mg\cos\theta - P\sin\theta = 0 \implies N = mg\cos\theta + P\sin\theta$$
  Notice that pushing horizontally *increases* the normal force!

- **Step 2: Minimum horizontal force to initiate upward motion**
  At incipient motion up the ramp, static friction opposes upward motion (points down the ramp):
  $$\sum F_x = P\cos\theta - mg\sin\theta - f_{s,\max} = 0$$
  $$P\cos\theta - mg\sin\theta - \mu_s(mg\cos\theta + P\sin\theta) = 0$$
  $$P(\cos\theta - \mu_s\sin\theta) = mg(\sin\theta + \mu_s\cos\theta)$$
  $$P_{\min} = mg \frac{\sin\theta + \mu_s\cos\theta}{\cos\theta - \mu_s\sin\theta}$$
  Evaluate trigonometric values for $\theta = 30.0^\circ$:
  $\sin(30^\circ) = 0.5000, \quad \cos(30^\circ) = 0.86603$
  $$mg = (15.0\,\text{kg})(9.81\,\text{m/s}^2) = 147.15\,\text{N}$$
  $$\text{Numerator} = 147.15[0.5000 + (0.350)(0.86603)] = 147.15[0.5000 + 0.30311] = 147.15(0.80311) = 118.178\,\text{N}$$
  $$\text{Denominator} = 0.86603 - (0.350)(0.5000) = 0.86603 - 0.17500 = 0.69103$$
  $$P_{\min} = \frac{118.178}{0.69103} = 171.02\,\text{N}$$

- **Step 3: Acceleration when $P = 220.0\,\text{N}$**
  Now kinetic friction acts:
  $$N = mg\cos\theta + P\sin\theta = (147.15)(0.86603) + (220.0)(0.5000) = 127.436 + 110.000 = 237.436\,\text{N}$$
  $$f_k = \mu_k N = (0.250)(237.436\,\text{N}) = 59.359\,\text{N}$$
  $$\sum F_x = P\cos\theta - mg\sin\theta - f_k = (220.0)(0.86603) - (147.15)(0.5000) - 59.359$$
  $$\sum F_x = 190.527 - 73.575 - 59.359 = 57.593\,\text{N}$$
  $$a = \frac{\sum F_x}{m} = \frac{57.593\,\text{N}}{15.0\,\text{kg}} = 3.840\,\text{m/s}^2$$

---

### Example 7.6: Variational Optimization of Pulling Force
**Problem:** A heavy crate of mass $m = 80.0\,\text{kg}$ must be dragged up a concrete ramp of angle $\theta = 20.0^\circ$ at constant speed. The coefficient of kinetic friction is $\mu_k = 0.400$. Take $g = 9.81\,\text{m/s}^2$.
1. Compute the optimal angle $\phi^*$ relative to the ramp at which the tow cable should be hitched.
2. Calculate the tension $T_{\min}$ in the cable at this optimal angle.
3. Compare this to pulling parallel to the ramp ($\phi = 0^\circ$).

**Solution:**
- **Step 1: Optimal angle $\phi^*$**
  $$\phi^* = \arctan(\mu_k) = \arctan(0.400) = 21.801^\circ$$

- **Step 2: Minimum tension $T_{\min}$**
  $$T_{\min} = mg \frac{\sin\theta + \mu_k\cos\theta}{\sqrt{1 + \mu_k^2}}$$
  $$mg = (80.0\,\text{kg})(9.81\,\text{m/s}^2) = 784.8\,\text{N}$$
  $$\sin(20.0^\circ) = 0.34202, \quad \cos(20.0^\circ) = 0.93969$$
  $$\sin\theta + \mu_k\cos\theta = 0.34202 + (0.400)(0.93969) = 0.34202 + 0.37588 = 0.71790$$
  $$\sqrt{1 + \mu_k^2} = \sqrt{1 + 0.400^2} = \sqrt{1.16} = 1.07703$$
  $$T_{\min} = (784.8\,\text{N}) \frac{0.71790}{1.07703} = (784.8)(0.66655) = 523.11\,\text{N}$$

- **Step 3: Comparison with parallel pull ($\phi = 0^\circ$)**
  At $\phi = 0^\circ$:
  $$T(\phi=0) = mg(\sin\theta + \mu_k\cos\theta) = (784.8\,\text{N})(0.71790) = 563.41\,\text{N}$$
  Percentage force savings:
  $$\Delta = \frac{563.41 - 523.11}{563.41} \times 100\% = \frac{40.30}{563.41} \times 100\% = 7.15\%$$
  The optimal hitch angle reduces required mechanical work and prevents motor overheating.

---

### Example 7.7: Galileo's Chords Theorem Verification
**Problem:** A vertical circular ring of radius $R = 5.00\,\text{m}$ (diameter $D = 10.0\,\text{m}$) has three frictionless wire chutes running from the apex (top) to three points on the circumference:
- Chute A: Angle $\alpha_A = 0^\circ$ (vertical diameter).
- Chute B: Angle $\alpha_B = 30.0^\circ$ relative to the vertical.
- Chute C: Angle $\alpha_C = 60.0^\circ$ relative to the vertical.
Using $g = 9.81\,\text{m/s}^2$, calculate the length $L$, acceleration $a$, and time of travel $t$ for beads released from rest at the apex down each of the three chutes.

**Solution:**
- **Chute A ($\alpha_A = 0^\circ$):**
  $$L_A = D\cos(0^\circ) = 10.0\,\text{m}$$
  $$a_A = g\cos(0^\circ) = 9.81\,\text{m/s}^2$$
  $$t_A = \sqrt{\frac{2 L_A}{a_A}} = \sqrt{\frac{2(10.0)}{9.81}} = \sqrt{2.03874} = 1.4278\,\text{s}$$

- **Chute B ($\alpha_B = 30.0^\circ$):**
  $$\cos(30.0^\circ) = 0.86603$$
  $$L_B = 10.0 \times 0.86603 = 8.6603\,\text{m}$$
  $$a_B = 9.81 \times 0.86603 = 8.4957\,\text{m/s}^2$$
  $$t_B = \sqrt{\frac{2 L_B}{a_B}} = \sqrt{\frac{2(8.6603)}{8.4957}} = \sqrt{2.03874} = 1.4278\,\text{s}$$

- **Chute C ($\alpha_C = 60.0^\circ$):**
  $$\cos(60.0^\circ) = 0.50000$$
  $$L_C = 10.0 \times 0.50000 = 5.0000\,\text{m}$$
  $$a_C = 9.81 \times 0.50000 = 4.9050\,\text{m/s}^2$$
  $$t_C = \sqrt{\frac{2 L_C}{a_C}} = \sqrt{\frac{2(5.0000)}{4.9050}} = \sqrt{2.03874} = 1.4278\,\text{s}$$

*Conclusion:* In all three cases, the travel time is identically $t = 1.428\,\text{s}$, rigorously validating Galileo's theorem!

---

### Example 7.8: Accelerating Wedge with Fixed Block
**Problem:** A triangular block of mass $m = 2.50\,\text{kg}$ sits on a smooth, frictionless wedge of inclination angle $\theta = 32.0^\circ$. The wedge is placed on a flat horizontal floor. What horizontal acceleration $A$ must be applied to the wedge (to the left) so that the block remains completely stationary relative to the wedge? Take $g = 9.81\,\text{m/s}^2$.

**Solution:**
- **Step 1: Set up the equations of motion**
  In the stationary laboratory frame:
  The block accelerates horizontally with the exact same acceleration $A$ as the wedge:
  $$a_x = A, \quad a_y = 0$$
  The only forces acting on the block are gravity (downward) and the normal force $N$ (perpendicular to the incline):
  $$\sum F_y = N\cos\theta - mg = m a_y = 0 \implies N\cos\theta = mg \implies N = \frac{mg}{\cos\theta}$$
  $$\sum F_x = N\sin\theta = m a_x = m A$$

- **Step 2: Solve for $A$**
  Substitute $N$:
  $$\left(\frac{mg}{\cos\theta}\right)\sin\theta = m A$$
  $$mg\tan\theta = m A \implies A = g\tan\theta$$

- **Step 3: Numerical evaluation**
  $$\tan(32.0^\circ) = 0.62487$$
  $$A = (9.81\,\text{m/s}^2)(0.62487) = 6.130\,\text{m/s}^2$$

- **Step 4: Normal force magnitude**
  $$N = \frac{(2.50\,\text{kg})(9.81\,\text{m/s}^2)}{\cos(32.0^\circ)} = \frac{24.525\,\text{N}}{0.84805} = 28.919\,\text{N}$$
  *Notice:* Since the wedge is accelerating, $N > mg$ (where $mg = 24.53\,\text{N}$), because the wedge must both support gravity and accelerate the block horizontally.

---

### Example 7.9: Free Wedge-Block Coupled System
**Problem:** A block of mass $m = 3.00\,\text{kg}$ rests on a triangular wedge of mass $M = 9.00\,\text{kg}$ with ramp angle $\theta = 40.0^\circ$. All surfaces (between block and wedge, and between wedge and floor) are frictionless. Both are released from rest. Take $g = 9.81\,\text{m/s}^2$.
1. Calculate the normal force $N$ between the block and the wedge.
2. Calculate the horizontal acceleration $A_W$ of the wedge.
3. Calculate the acceleration of the block relative to the wedge, $a_{\text{rel}}$.
4. Calculate the horizontal and vertical accelerations of the block in the laboratory frame.

**Solution:**
- **Step 1: Normal force**
  From Section 7.7:
  $$N = \frac{mg\cos\theta}{1 + \frac{m}{M}\sin^2\theta}$$
  $$mg = (3.00\,\text{kg})(9.81\,\text{m/s}^2) = 29.43\,\text{N}$$
  $$\sin(40.0^\circ) = 0.64279, \quad \cos(40.0^\circ) = 0.76604$$
  $$\sin^2(40.0^\circ) = 0.41318$$
  $$\frac{m}{M} = \frac{3.00}{9.00} = \frac{1}{3} \approx 0.33333$$
  $$\text{Denominator} = 1 + \left(\frac{1}{3}\right)(0.41318) = 1 + 0.13773 = 1.13773$$
  $$\text{Numerator} = 29.43 \times 0.76604 = 22.5446\,\text{N}$$
  $$N = \frac{22.5446\,\text{N}}{1.13773} = 19.815\,\text{N}$$

- **Step 2: Wedge acceleration $A_W$ (directed leftward)**
  $$A_W = \frac{N\sin\theta}{M} = \frac{(19.815\,\text{N})(0.64279)}{9.00\,\text{kg}} = \frac{12.737\,\text{N}}{9.00\,\text{kg}} = 1.4152\,\text{m/s}^2$$

- **Step 3: Laboratory frame block accelerations**
  $$a_{mx} = \frac{N\sin\theta}{m} = \frac{12.737\,\text{N}}{3.00\,\text{kg}} = 4.2457\,\text{m/s}^2 \quad (\text{rightward})$$
  $$a_{my} = \frac{N\cos\theta - mg}{m} = \frac{(19.815)(0.76604) - 29.43}{3.00} = \frac{15.179 - 29.43}{3.00} = \frac{-14.251}{3.00} = -4.7503\,\text{m/s}^2 \quad (\text{downward})$$

- **Step 4: Relative acceleration $a_{\text{rel}}$ along the wedge**
  The relative horizontal acceleration is:
  $$a_{\text{rel}, x} = a_{mx} - (-A_W) = 4.2457 + 1.4152 = 5.6609\,\text{m/s}^2$$
  Since the block is constrained to the ramp:
  $$a_{\text{rel}} = \frac{a_{\text{rel}, x}}{\cos\theta} = \frac{5.6609\,\text{m/s}^2}{0.76604} = 7.3898\,\text{m/s}^2$$
  *Kinematic Constraint Check:*
  $$a_{\text{rel}, y} = -a_{\text{rel}}\sin\theta = -(7.3898)(0.64279) = -4.7501\,\text{m/s}^2$$
  Matches $a_{my} = -4.7503\,\text{m/s}^2$ perfectly.

---

### Example 7.10: Critical Acceleration for Incline Tip-Over vs Slide
**Problem:** A uniform solid rectangular crate of height $H = 1.60\,\text{m}$, width $W = 0.80\,\text{m}$, and mass $m = 120\,\text{kg}$ sits on an incline of angle $\theta$. The static friction coefficient is $\mu_s = 0.650$.
1. Determine the maximum ramp angle $\theta_{\text{slip}}$ before the crate begins to slide.
2. Determine the critical angle $\theta_{\text{tip}}$ at which the crate tips over (topples) down the incline before slipping.
3. Will the crate slide first or tip first as the incline angle is steadily increased?

**Solution:**
- **Step 1: Slipping threshold**
  $$\tan\theta_{\text{slip}} = \mu_s = 0.650 \implies \theta_{\text{slip}} = \arctan(0.650) = 33.02^\circ$$

- **Step 2: Tipping threshold**
  A uniform rectangular block tips over when the line of action of the gravitational force passes outside the supporting footprint (i.e., beyond the lower downhill corner).
  The center of mass is located at $(W/2, H/2)$ relative to the lower edge.
  The angle of the diagonal connecting the downhill contact pivot to the center of mass is:
  $$\tan\theta_{\text{tip}} = \frac{W/2}{H/2} = \frac{W}{H}$$
  $$\tan\theta_{\text{tip}} = \frac{0.80\,\text{m}}{1.60\,\text{m}} = 0.500 \implies \theta_{\text{tip}} = \arctan(0.500) = 26.57^\circ$$

- **Step 3: Physical outcome comparison**
  Comparing the two critical angles:
  $$\theta_{\text{tip}} = 26.57^\circ < \theta_{\text{slip}} = 33.02^\circ$$
  As the incline is raised, the angle reaches $26.57^\circ$ first.
  **Conclusion:** The crate will **topple (tip over)** down the ramp at $\theta = 26.57^\circ$ before it has any opportunity to slip!

---

## 7.9 Chapter Mastery Exercises

Consolidate your mastery through these 10 rigorous progressive exercises spanning Tiers 1 through 5. Complete solutions follow immediately in Section 7.10.

### Tier 1: Foundational Kinematics & Statics
- **Exercise 7.1:** A $5.00\,\text{kg}$ block rests on a ramp inclined at $22.0^\circ$. Compute the magnitude of the gravitational force components parallel and perpendicular to the ramp ($g = 9.81\,\text{m/s}^2$).
- **Exercise 7.2:** An object slides from rest down a $4.50\,\text{m}$ long frictionless ramp in $1.80\,\text{s}$. Calculate the inclination angle $\theta$ of the ramp.

### Tier 2: Friction & Threshold Dynamics
- **Exercise 7.3:** A block of mass $m = 8.00\,\text{kg}$ is placed on a ramp with $\mu_s = 0.400$ and $\mu_k = 0.280$. If $\theta = 30.0^\circ$, determine whether the block moves, and find its acceleration down the ramp.
- **Exercise 7.4:** A box is launched up a $25.0^\circ$ incline with an initial speed of $6.00\,\text{m/s}$. If $\mu_k = 0.180$, find the total distance traversed before stopping and the time elapsed.

### Tier 3: Asymmetry & Energy Dissipation
- **Exercise 7.5:** A block is projected up an incline of angle $\theta = 35.0^\circ$ with speed $v_0$ and slides back down to the launch point. If the descent time is exactly twice the ascent time ($t_{\text{down}} = 2 t_{\text{up}}$), determine the kinetic coefficient of friction $\mu_k$.
- **Exercise 7.6:** A block slides down a ramp of length $L = 10.0\,\text{m}$ inclined at $45.0^\circ$. If its speed at the bottom is $7.00\,\text{m/s}$, calculate the fraction of total initial mechanical energy dissipated as heat ($g = 9.81\,\text{m/s}^2$).

### Tier 4: Force Minimization & Compound Loading
- **Exercise 7.7:** A crate of mass $50.0\,\text{kg}$ is pulled up a $15.0^\circ$ incline with $\mu_k = 0.300$. Find the optimal tow angle $\phi^*$ and the minimum pull force $F_{\min}$ required for constant velocity.
- **Exercise 7.8:** A horizontal force $P$ pushes a $12.0\,\text{kg}$ block down a $40.0^\circ$ incline at constant velocity. If $\mu_k = 0.550$, find the required force magnitude $P$.

### Tier 5: Advanced Coupled & Non-Inertial Systems
- **Exercise 7.9:** A wedge of mass $M = 10.0\,\text{kg}$ with angle $\theta = 30.0^\circ$ rests on a frictionless table. A block of mass $m = 2.00\,\text{kg}$ slides down the wedge. Compute the horizontal displacement of the wedge during the time the block descends a vertical height $h = 1.20\,\text{m}$.
- **Exercise 7.10:** An inverted wedge with two symmetrical slopes of angle $\theta = 30.0^\circ$ holds two masses $m_1 = 4.00\,\text{kg}$ and $m_2 = 6.00\,\text{kg}$ connected by a light string over a frictionless apex pulley. If the wedge is accelerated horizontally at $A = 2.50\,\text{m/s}^2$ to the right, determine the acceleration of $m_2$ relative to the wedge.

---

## 7.10 Complete Step-by-Step Solutions to Chapter Exercises

---

### Solution 7.1
- **Given:** $m = 5.00\,\text{kg}$, $\theta = 22.0^\circ$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Total weight**
  $$W = mg = (5.00\,\text{kg})(9.81\,\text{m/s}^2) = 49.05\,\text{N}$$
- **Step 2: Parallel component**
  $$F_{g\parallel} = mg\sin\theta = (49.05\,\text{N})\sin(22.0^\circ) = (49.05)(0.37461) = 18.37\,\text{N}$$
- **Step 3: Perpendicular component**
  $$F_{g\perp} = mg\cos\theta = (49.05\,\text{N})\cos(22.0^\circ) = (49.05)(0.92718) = 45.48\,\text{N}$$
- **Sanity check:** $\sqrt{18.37^2 + 45.48^2} = \sqrt{337.46 + 2068.43} = \sqrt{2405.89} = 49.05\,\text{N}$. Verified.

---

### Solution 7.2
- **Given:** $L = 4.50\,\text{m}$, $t = 1.80\,\text{s}$, $v_0 = 0$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Acceleration from kinematics**
  $$L = \frac{1}{2} a t^2 \implies a = \frac{2L}{t^2} = \frac{2(4.50\,\text{m})}{(1.80\,\text{s})^2} = \frac{9.00}{3.24} = 2.7778\,\text{m/s}^2$$
- **Step 2: Relation to incline angle**
  On a frictionless ramp:
  $$a = g\sin\theta \implies \sin\theta = \frac{a}{g} = \frac{2.7778\,\text{m/s}^2}{9.81\,\text{m/s}^2} = 0.28316$$
- **Step 3: Invert sine**
  $$\theta = \arcsin(0.28316) = 16.45^\circ$$

---

### Solution 7.3
- **Given:** $m = 8.00\,\text{kg}$, $\theta = 30.0^\circ$, $\mu_s = 0.400$, $\mu_k = 0.280$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Check motion threshold**
  $$\tan(30.0^\circ) = 0.57735$$
  Since $\tan\theta = 0.577 > \mu_s = 0.400$, the static friction threshold is exceeded. **The block definitely moves.**
- **Step 2: Compute kinetic acceleration**
  $$a = g(\sin\theta - \mu_k\cos\theta)$$
  $$\sin(30.0^\circ) = 0.5000, \quad \cos(30.0^\circ) = 0.86603$$
  $$a = 9.81[0.5000 - (0.280)(0.86603)] = 9.81[0.5000 - 0.24249] = 9.81(0.25751) = 2.526\,\text{m/s}^2$$
  The block accelerates down the ramp at $2.53\,\text{m/s}^2$.

---

### Solution 7.4
- **Given:** $v_0 = 6.00\,\text{m/s}$, $\theta = 25.0^\circ$, $\mu_k = 0.180$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Upward deceleration**
  $$|a_{\text{up}}| = g(\sin\theta + \mu_k\cos\theta)$$
  $$\sin(25.0^\circ) = 0.42262, \quad \cos(25.0^\circ) = 0.90631$$
  $$|a_{\text{up}}| = 9.81[0.42262 + (0.180)(0.90631)] = 9.81[0.42262 + 0.16314] = 9.81(0.58575) = 5.7462\,\text{m/s}^2$$
- **Step 2: Stopping distance**
  $$s_{\max} = \frac{v_0^2}{2|a_{\text{up}}|} = \frac{(6.00\,\text{m/s})^2}{2(5.7462\,\text{m/s}^2)} = \frac{36.0}{11.4924} = 3.132\,\text{m}$$
- **Step 3: Time elapsed**
  $$t_{\text{up}} = \frac{v_0}{|a_{\text{up}}|} = \frac{6.00\,\text{m/s}}{5.7462\,\text{m/s}^2} = 1.044\,\text{s}$$

---

### Solution 7.5
- **Given:** $\theta = 35.0^\circ$, $t_{\text{down}} = 2 t_{\text{up}}$.
- **Step 1: Ratio of times and accelerations**
  From Section 7.5:
  $$\frac{t_{\text{down}}}{t_{\text{up}}} = \sqrt{\frac{|a_{\text{up}}|}{a_{\text{down}}}} = 2$$
  Squaring both sides:
  $$\frac{|a_{\text{up}}|}{a_{\text{down}}} = 4 \implies |a_{\text{up}}| = 4 a_{\text{down}}$$
- **Step 2: Insert acceleration formulas**
  $$g(\sin\theta + \mu_k\cos\theta) = 4 g(\sin\theta - \mu_k\cos\theta)$$
  $$\sin\theta + \mu_k\cos\theta = 4\sin\theta - 4\mu_k\cos\theta$$
  $$5\mu_k\cos\theta = 3\sin\theta$$
  $$\mu_k = \frac{3}{5}\tan\theta$$
- **Step 3: Numerical evaluation**
  $$\tan(35.0^\circ) = 0.70021$$
  $$\mu_k = 0.600 \times 0.70021 = 0.4201$$

---

### Solution 7.6
- **Given:** $L = 10.0\,\text{m}$, $\theta = 45.0^\circ$, $v = 7.00\,\text{m/s}$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Initial potential energy per unit mass**
  $$h = L\sin(45.0^\circ) = (10.0\,\text{m})(0.70711) = 7.0711\,\text{m}$$
  $$\frac{E_{\text{init}}}{m} = gh = (9.81\,\text{m/s}^2)(7.0711\,\text{m}) = 69.367\,\text{J/kg}$$
- **Step 2: Final kinetic energy per unit mass**
  $$\frac{E_{\text{final}}}{m} = \frac{1}{2}v^2 = \frac{1}{2}(7.00\,\text{m/s})^2 = 24.500\,\text{J/kg}$$
- **Step 3: Energy dissipated**
  $$\frac{\Delta E_{\text{diss}}}{m} = 69.367 - 24.500 = 44.867\,\text{J/kg}$$
- **Step 4: Fraction dissipated**
  $$\text{Fraction} = \frac{44.867}{69.367} = 0.6468 \implies 64.68\%$$

---

### Solution 7.7
- **Given:** $m = 50.0\,\text{kg}$, $\theta = 15.0^\circ$, $\mu_k = 0.300$, $g = 9.81\,\text{m/s}^2$.
- **Step 1: Optimal angle $\phi^*$**
  $$\phi^* = \arctan(\mu_k) = \arctan(0.300) = 16.70^\circ$$
- **Step 2: Minimum force formula**
  $$F_{\min} = mg \frac{\sin\theta + \mu_k\cos\theta}{\sqrt{1 + \mu_k^2}}$$
  $$mg = (50.0)(9.81) = 490.5\,\text{N}$$
  $$\sin(15.0^\circ) = 0.25882, \quad \cos(15.0^\circ) = 0.96593$$
  $$\sin\theta + \mu_k\cos\theta = 0.25882 + (0.300)(0.96593) = 0.25882 + 0.28978 = 0.54860$$
  $$\sqrt{1 + \mu_k^2} = \sqrt{1 + 0.090} = \sqrt{1.090} = 1.04403$$
  $$F_{\min} = (490.5\,\text{N}) \frac{0.54860}{1.04403} = (490.5)(0.52546) = 257.74\,\text{N}$$

---

### Solution 7.8
- **Given:** $m = 12.0\,\text{kg}$, $\theta = 40.0^\circ$, $\mu_k = 0.550$, $g = 9.81\,\text{m/s}^2$. Constant velocity ($a = 0$).
- **Step 1: Check natural downslope drive vs friction**
  $$\tan(40.0^\circ) = 0.8391 > \mu_k = 0.550$$
  Since gravity alone exceeds kinetic friction, the block accelerates down naturally unless held back or pushed into the surface.
  A horizontal force $P$ directed to the left (into the ramp) will increase $N$:
  $$\vec{F}_{\text{push}} = -P\cos\theta\,\hat{i} - P\sin\theta\,\hat{j}$$
  $$\sum F_y = N - mg\cos\theta - P\sin\theta = 0 \implies N = mg\cos\theta + P\sin\theta$$
  Friction opposes downward sliding (acts up the ramp $+\hat{i}$):
  $$\sum F_x = mg\sin\theta - P\cos\theta - \mu_k(mg\cos\theta + P\sin\theta) = 0$$
  $$mg(\sin\theta - \mu_k\cos\theta) = P(\cos\theta + \mu_k\sin\theta)$$
  $$P = mg \frac{\sin\theta - \mu_k\cos\theta}{\cos\theta + \mu_k\sin\theta}$$
- **Step 2: Numerical evaluation**
  $$\sin(40.0^\circ) = 0.64279, \quad \cos(40.0^\circ) = 0.76604$$
  $$mg = (12.0)(9.81) = 117.72\,\text{N}$$
  $$\text{Numerator} = 0.64279 - (0.550)(0.76604) = 0.64279 - 0.42132 = 0.22147$$
  $$\text{Denominator} = 0.76604 + (0.550)(0.64279) = 0.76604 + 0.35353 = 1.11957$$
  $$P = 117.72 \times \frac{0.22147}{1.11957} = 117.72 \times 0.19782 = 23.29\,\text{N}$$

---

### Solution 7.9
- **Given:** $M = 10.0\,\text{kg}$, $m = 2.00\,\text{kg}$, $\theta = 30.0^\circ$, $h = 1.20\,\text{m}$, frictionless system.
- **Step 1: Center of mass conservation**
  Because no external horizontal forces act on the system (the floor is frictionless):
  $$\sum F_{X,\text{ext}} = 0 \implies X_{\text{CM}} = \text{constant}$$
  $$\Delta X_{\text{CM}} = \frac{M \Delta X_W + m \Delta x_m}{M + m} = 0 \implies M \Delta X_W + m \Delta x_m = 0$$
- **Step 2: Relative displacement constraint**
  The block slides down the wedge by vertical distance $h$. Its relative horizontal displacement relative to the wedge is:
  $$\Delta x_{\text{rel}} = \frac{h}{\tan\theta} = \frac{1.20\,\text{m}}{\tan(30.0^\circ)} = \frac{1.20}{0.57735} = 2.0785\,\text{m} \quad (\text{to the right})$$
  The laboratory displacement of the block is:
  $$\Delta x_m = \Delta X_W + \Delta x_{\text{rel}}$$
- **Step 3: Solve for $\Delta X_W$**
  $$M \Delta X_W + m(\Delta X_W + \Delta x_{\text{rel}}) = 0$$
  $$(M + m)\Delta X_W = -m \Delta x_{\text{rel}}$$
  $$\Delta X_W = -\frac{m}{M + m} \Delta x_{\text{rel}} = -\frac{2.00\,\text{kg}}{10.0\,\text{kg} + 2.00\,\text{kg}} (2.0785\,\text{m}) = -\frac{2}{12}(2.0785) = -0.3464\,\text{m}$$
  The wedge recoils $0.346\,\text{m}$ to the left.

---

### Solution 7.10
- **Given:** Symmetrical inverted wedge, $\theta = 30.0^\circ$. Mass $m_1 = 4.00\,\text{kg}$ on left slope, $m_2 = 6.00\,\text{kg}$ on right slope. Accelerated horizontally to the right with $A = 2.50\,\text{m/s}^2$.
- **Step 1: Effective gravity in the accelerated reference frame**
  In the reference frame of the wedge, an inertial fictitious force $\vec{F}_{\text{fict}} = -m\vec{A}$ acts to the left on both masses.
- **Step 2: Force on $m_2$ (right slope, sloping down to the right)**
  Along the right slope (taking downslope as positive):
  - Gravity component downslope: $+m_2 g\sin\theta$
  - Fictitious force (points horizontally left, which is *upslope* on the right ramp!):
    Component parallel to right ramp: $-m_2 A\cos\theta$
  Net drive along right ramp:
  $$F_2 = m_2(g\sin\theta - A\cos\theta)$$
  Evaluate:
  $$g\sin(30^\circ) - A\cos(30^\circ) = (9.81)(0.5000) - (2.50)(0.86603) = 4.9050 - 2.1651 = 2.7399\,\text{m/s}^2$$
  $$F_2 = (6.00\,\text{kg})(2.7399\,\text{m/s}^2) = 16.439\,\text{N}$$

- **Step 3: Force on $m_1$ (left slope, sloping down to the left)**
  Along the left slope (taking downslope as positive):
  - Gravity component downslope: $+m_1 g\sin\theta$
  - Fictitious force (points horizontally left, which is *downslope* on the left ramp!):
    Component parallel to left ramp: $+m_1 A\cos\theta$
  Net drive along left ramp:
  $$F_1 = m_1(g\sin\theta + A\cos\theta)$$
  Evaluate:
  $$g\sin(30^\circ) + A\cos(30^\circ) = 4.9050 + 2.1651 = 7.0701\,\text{m/s}^2$$
  $$F_1 = (4.00\,\text{kg})(7.0701\,\text{m/s}^2) = 28.280\,\text{N}$$

- **Step 4: Coupled acceleration along string**
  Taking motion toward $m_1$ (leftward over the pulley) as positive:
  $$\sum F_{\text{net}} = F_1 - F_2 = 28.280\,\text{N} - 16.439\,\text{N} = 11.841\,\text{N}$$
  Total inertia:
  $$m_1 + m_2 = 4.00 + 6.00 = 10.00\,\text{kg}$$
  $$a_{\text{rel}} = \frac{11.841\,\text{N}}{10.00\,\text{kg}} = 1.184\,\text{m/s}^2$$
  *Conclusion:* Despite $m_2 > m_1$, the horizontal acceleration of the wedge shifts the balance so dramatically that $m_1$ accelerates down the left slope at $1.18\,\text{m/s}^2$, pulling $m_2$ *up* the right slope!
