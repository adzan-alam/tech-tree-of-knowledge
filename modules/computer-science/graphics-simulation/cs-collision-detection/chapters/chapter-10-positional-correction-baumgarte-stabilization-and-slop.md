# Chapter 10: Positional Correction, Baumgarte Stabilization & Slop

> *"A velocity impulse acts purely on the first derivative of position. It answers the question of how fast bodies should part ways, but it is utterly blind to where they currently reside. If two bodies penetrate by five centimeters and you set their relative separating velocity to zero, they will comfortably remain five centimeters inside one another for the rest of eternity. To maintain the illusion of absolute rigidity, a physics engine must actively repair the past while steering the future."*

---

## 10.1 The Post-Collision Sinking Dilemma

### The Failure of Pure Velocity Impulses
In an idealized continuous universe governed by analytical differential equations, rigid bodies never interpenetrate. When contact occurs at time $t^*$, the relative normal velocity instantaneously reverses according to Poisson's or Newton's restitution hypothesis:

$$v_{\text{rel}}^+(t^*) = -e \, v_{\text{rel}}^-(t^*)$$

For a resting contact (e.g., a crate sitting on the floor under gravity), the coefficient of restitution is $e = 0$. The impulse solver applies an upward normal impulse $J_n$ that precisely cancels the downward gravitational acceleration over the time step $\Delta t$, enforcing:

$$v_{\text{rel}}^+(t_{k+1}) = 0$$

Now examine what occurs inside a discrete numerical simulator using fixed time step $\Delta t$:
1. At step $t_k$, the crate rests on the floor with vertical velocity $v_y = 0$ and position $y = 0$.
2. Gravity accelerates the crate downward during the step: $v_y^* = v_y - g \Delta t = -9.81 \times 0.01667 = -0.1635\text{ m/s}$.
3. Position integration moves the crate: $y_{k+1} = y_k + v_y^* \Delta t = 0 + (-0.1635)(0.01667) = -0.002725\text{ m}$ (a penetration depth of $\delta = 2.73\text{ mm}$).
4. At step $t_{k+1}$, collision detection identifies an overlap of depth $\delta = 2.73\text{ mm}$.
5. The velocity impulse solver computes the impulse required to enforce $v_{\text{rel}}^+ = 0$. It sets $v_y = 0$.
6. **The Critical Trap:** Setting $v_y = 0$ prevents the crate from sinking *further* during that instant, but it does **nothing** to push the crate back up to $y = 0$!

If numerical round-off or slight solver inaccuracies permit even a fraction of a millimeter of uncorrected penetration per tick, the crate sinks deeper and deeper into the terrain with every passing second. Within 60 frames (one second of real time), an uncorrected stack of boxes will visually submerge into the floor. This catastrophic artifact is known as **resting contact sinking** or **constraint drift**.

```
The Sinking Dilemma:

  Frame k:                     Frame k+1 (Gravity steps):     Frame k+1 (Velocity Solved):
  +-------+                    +-------+                      +-------+
  | Crate |                    | Crate |                      | Crate |  v_y = 0
  +-------+                    +---+---+                      +---+---+  STILL SUNK!
  ========= Floor              ====|===|====                  ====|===|====
                                   +---+                          +---+
                                   Penetration \delta              Penetration \delta persists!
```

---

## 10.2 Linear Positional Projection (The Direct Kinematic Fix)

The most direct and intuitive method to eliminate geometric overlap is **Linear Positional Projection** (often termed *direct position projection*).

### Formulation
Let body $\mathcal{A}$ and body $\mathcal{B}$ overlap with penetration depth $\delta > 0$ along contact unit normal $\hat{\mathbf{n}}$ (pointing from $\mathcal{A}$ toward $\mathcal{B}$).
Let $m_1$ and $m_2$ be the masses of the two bodies, and let:

$$w_1 = \frac{1}{m_1}, \quad w_2 = \frac{1}{m_2}$$

be their respective inverse masses.

To separate the bodies by exactly $\delta$ along $\hat{\mathbf{n}}$, we apply instantaneous spatial translation corrections $\Delta \mathbf{x}_1$ and $\Delta \mathbf{x}_2$:

$$\Delta \mathbf{x}_2 - \Delta \mathbf{x}_1 = \delta \hat{\mathbf{n}}$$

To preserve Newton's third law and avoid creating artificial center-of-mass translation for an isolated two-body system, the position corrections must be weighted inversely by mass:

$$m_1 \Delta \mathbf{x}_1 + m_2 \Delta \mathbf{x}_2 = \mathbf{0} \implies \Delta \mathbf{x}_1 = -\frac{m_2}{m_1} \Delta \mathbf{x}_2 = -\frac{w_1}{w_2} \Delta \mathbf{x}_2$$

Substituting this into the separation condition yields:

$$\Delta \mathbf{x}_2 - \left(-\frac{w_1}{w_2} \Delta \mathbf{x}_2\right) = \delta \hat{\mathbf{n}} \implies \Delta \mathbf{x}_2 \left(1 + \frac{w_1}{w_2}\right) = \delta \hat{\mathbf{n}}$$

$$\Delta \mathbf{x}_2 \left(\frac{w_1 + w_2}{w_2}\right) = \delta \hat{\mathbf{n}} \implies \Delta \mathbf{x}_2 = +\frac{w_2}{w_1 + w_2} \delta \hat{\mathbf{n}}$$

$$\Delta \mathbf{x}_1 = -\frac{w_1}{w_1 + w_2} \delta \hat{\mathbf{n}}$$

```
Mass-Weighted Linear Projection:

   Case 1: Equal Masses (m1 = m2, w1 = w2)
   Body 1 <-- [0.5 \delta]       [0.5 \delta] --> Body 2

   Case 2: Heavy Body 1, Light Body 2 (m1 = 100 kg, m2 = 1 kg)
   Body 1 <-- [0.0099 \delta]    [0.9901 \delta] --> Body 2

   Case 3: Static Obstacle (m1 = \infty, w1 = 0)
   Wall   <-- [0.0]              [1.0 \delta] --> Dynamic Body 2
```

### The Pitfalls of Naive Linear Projection
While mathematically trivial, applying direct position projection at the end of the physics pipeline introduces severe side effects:
1. **Kinetic Energy Creation:** If positions are updated without altering velocities, the effective kinetic energy of the system remains unchanged while its potential energy abruptly jumps.
2. **Velocity Inconsistency:** In the subsequent frame, the velocity derived from numerical differences ($v \approx \frac{x_{k+1} - x_k}{\Delta t}$) will register an artificial surge in velocity, causing resting stacks to vibrate and jitter violently.
3. **Internal Stress / Constraint Fighting:** In a stack of 10 boxes, projecting box 1 out of the floor pushes it into box 2, which is then projected into box 3, creating an unstable feedback loop that can blow the stack apart.

---

## 10.3 Baumgarte Stabilization

To resolve penetration smoothly without brutally teleporting bodies across coordinate space, J. Baumgarte (1972) proposed injecting a penalty constraint stabilization term directly into the velocity constraint equations.

### Derivation from Constraint Dynamics
Consider an equality or inequality kinematic constraint $C(\mathbf{x}) \ge 0$. For a contact with penetration depth $\delta$, the constraint function is:

$$C(\mathbf{x}) = (\mathbf{x}_B - \mathbf{x}_A) \cdot \hat{\mathbf{n}} \ge 0$$

When bodies penetrate, $C(\mathbf{x}) = -\delta < 0$.
The time derivative of the constraint gives the velocity condition:

$$\dot{C}(\mathbf{x}, \mathbf{v}) = (\mathbf{v}_B - \mathbf{v}_A) \cdot \hat{\mathbf{n}} \ge 0$$

Baumgarte's profound insight was to treat the constraint error as a damped harmonic oscillator. We demand that the constraint error $C(t)$ decays exponentially toward zero according to the first-order differential equation:

$$\dot{C} + \frac{\beta}{\Delta t} C = 0$$

where $\beta \in [0, 1]$ is a dimensionless gain parameter known as the **Baumgarte coefficient**.

Rearranging:

$$\dot{C} = -\frac{\beta}{\Delta t} C$$

Substituting $C = -\delta$:

$$\dot{C} = -\frac{\beta}{\Delta t} (-\delta) = +\frac{\beta}{\Delta t} \delta$$

Therefore, instead of solving for $\dot{C} \ge 0$ (which merely maintains the current penetration), the velocity solver is instructed to satisfy:

$$\dot{C} \ge v_{\text{bias}}$$

where the **Baumgarte velocity bias** is:

$$v_{\text{bias}} = \frac{\beta}{\Delta t} \delta$$

```
Baumgarte Stabilization Mechanics:

   Target Velocity Equation:
   (v_B - v_A) \cdot n >= -e (v_rel^- \cdot n) + v_bias
                                                \______/
                                            Penalty term pushing bodies apart!

   If \beta = 0.2, \Delta t = 0.01667 s, \delta = 0.005 m:
   v_bias = (0.2 / 0.01667) * 0.005 = 12.0 * 0.005 = 0.060 m/s
```

### Physical Interpretation & The Spring-Damper Analogy
The Baumgarte term acts as an implicit virtual spring-damper system placed at the contact point:
- The spring stiffness is $k = \frac{\beta}{\Delta t^2}$.
- The damping coefficient is $c = \frac{2\sqrt{\beta}}{\Delta t}$.

Each frame, the solver attempts to remove a fraction $\beta$ of the penetration.
- If $\beta = 0.1$: $10\%$ of the penetration is removed per frame. Over 10 frames ($\approx 0.16\text{ s}$), the penetration decays smoothly to zero with negligible visible disturbance.
- If $\beta = 0.2$: $20\%$ is removed per frame (standard industry setting in Box2D and PhysX).
- If $\beta > 0.5$: Over-correction! The virtual spring becomes hyper-stiff. Numerical overshoot causes the body to bounce upwards aggressively, creating the infamous **"popcorn effect"** where resting stacks spontaneously explode.

---

## 10.4 The Penetration Slop Parameter

### The Limit-Cycle Chatter Phenomenon
In computer arithmetic and discrete time integration, achieving exact zero penetration ($\delta \equiv 0.000000$) is physically and numerically impossible for resting objects.
Consider what happens if Baumgarte stabilization is applied with zero tolerance:
1. At step $t_k$, gravity pulls a block down by $\delta = 0.0001\text{ m}$ ($0.1\text{ mm}$).
2. The engine computes $v_{\text{bias}} = \frac{0.2}{0.01667}(0.0001) = 0.0012\text{ m/s}$.
3. The solver applies an upward impulse, accelerating the block upward.
4. At step $t_{k+1}$, the block lifts slightly off the surface into the air ($d = +0.00005\text{ m}$).
5. The contact manifold is destroyed because the bodies no longer touch!
6. At step $t_{k+2}$, gravity acts unhindered, accelerating the block downward again.
7. The block strikes the floor again, re-triggering penetration.

This creates high-frequency numerical vibration known as **limit-cycle chatter**. It wastes immense CPU cycles constantly allocating and deallocating contact manifolds and causes stacked objects to visibly jitter and hum.

```
Limit-Cycle Chatter Without Slop:

   Height ^
          |      /\      /\      /\      /\      /\
        0 +-----/--\----/--\----/--\----/--\----/--\----> Time (Frames)
          |    /    \  /    \  /    \  /    \  /    \
          |   v      \/      \/      \/      \/      \
          +---------------------------------------------> Sinking & Bouncing Oscillation
```

### The Slop Deadband Function
To eliminate chatter, game physics engines introduce a deadband threshold called **penetration slop** (denoted $\delta_{\text{slop}}$ or $\text{allowedPenetration}$).
Typically, $\delta_{\text{slop}}$ is set between $0.002\text{ m}$ and $0.01\text{ m}$ (e.g., $5\text{ mm}$ for human-scale worlds).

The effective penetration $\delta_{\text{eff}}$ fed into the Baumgarte formula is filtered through a rectified deadband function:

$$\delta_{\text{eff}} = \max(0, \delta - \delta_{\text{slop}})$$

```
The Slop Deadband Response Curve:

   \delta_eff ^
              |                   / (Slope = 1)
              |                  /
              |                 /
              |                /
            0 +---------------+--------------------> Penetration \delta
              0           \delta_slop
              <-- DEADBAND -->
```

Under this policy:
- If $\delta \le \delta_{\text{slop}}$: $\delta_{\text{eff}} = 0 \implies v_{\text{bias}} = 0$. The solver does not generate any corrective velocity bias. The contact manifold remains stable and resting, completely silent.
- If $\delta > \delta_{\text{slop}}$: The solver smoothly drives the excess penetration $\delta - \delta_{\text{slop}}$ down until it settles peacefully inside the deadband $[0, \delta_{\text{slop}}]$.

The complete, production-grade Baumgarte velocity bias formula is:

$$v_{\text{bias}} = \frac{\beta}{\Delta t} \max(0, \delta - \delta_{\text{slop}})$$

---

## 10.5 The Split Impulse Method (Baraff & Catto)

While Baumgarte stabilization prevents sinking, it suffers from a fundamental mathematical flaw: **it mixes velocity corrections with physical momentum**.

Because $v_{\text{bias}}$ is added directly into the velocity constraint:

$$v_n^+ = -e v_n^- + v_{\text{bias}}$$

The impulse $J_n$ generated by the solver includes both the physical collision impulse and the artificial positional correction impulse. This added impulse alters the true kinetic energy $\frac{1}{2} m v^2$ of the body. In restitution scenarios, bodies can artificially bounce higher than their drop height, violating the Second Law of Thermodynamics!

### The Two-Velocity Architecture
To completely eliminate energy injection while maintaining the numerical robustness of Baumgarte stabilization, David Baraff and Erin Catto formulated the **Split Impulse Method**.

Each rigid body maintains **two distinct velocity states**:
1. **Physical Velocity ($\mathbf{v}, \boldsymbol{\omega}$):** Governed strictly by Newton-Euler equations of motion, gravity, applied forces, and physical collision/friction impulses.
2. **Pseudo-Velocity / Correction Velocity ($\mathbf{v}_{\text{bias}}, \boldsymbol{\omega}_{\text{bias}}$):** Governed strictly by positional error correction impulses.

```
Split Impulse Pipeline:

   +--------------------------------------------------------------+
   | Step 1: Solve Velocity Constraints (Normal + Friction)       |
   | Target: (v_B - v_A) \cdot n >= -e (v_B^- - v_A^-) \cdot n    |
   | Updates: v_A, v_B, \omega_A, \omega_B                        |
   +--------------------------------------------------------------+
                                |
                                v
   +--------------------------------------------------------------+
   | Step 2: Solve Position Constraints via Pseudo-Velocities     |
   | Target: (v_bias,B - v_bias,A) \cdot n >= \beta / \Delta t (\delta - \delta_slop) |
   | Updates: v_bias,A, v_bias,B (Zero initial pseudo-velocities) |
   +--------------------------------------------------------------+
                                |
                                v
   +--------------------------------------------------------------+
   | Step 3: Integrate States Separately                          |
   | Real Velocities update:     x_temp = x + v * \Delta t        |
   | Pseudo-Velocities correct:  x_final = x_temp + v_bias * \Delta t |
   | Reset:                      v_bias = 0                       |
   +--------------------------------------------------------------+
```

### Position Integration under Split Impulses
At the end of the physics step:
1. Physical velocity is integrated into position:

$$\mathbf{x}_{\text{mid}} = \mathbf{x}_k + \mathbf{v}_{k+1} \Delta t$$

2. Pseudo-velocity applies the corrective displacement:

$$\mathbf{x}_{k+1} = \mathbf{x}_{\text{mid}} + \mathbf{v}_{\text{bias}} \Delta t$$

3. Pseudo-velocity is immediately discarded (reset to zero):

$$\mathbf{v}_{\text{bias}} = \mathbf{0}, \quad \boldsymbol{\omega}_{\text{bias}} = 0$$

4. The body enters the next frame with its true physical velocity $\mathbf{v}_{k+1}$ completely unpolluted by the geometric correction!
Zero extra kinetic energy is injected into the simulation. Bounces remain purely physical, while resting stacks remain perfectly rigid.

---

## 10.6 Non-Linear Gauss-Seidel (NGS) Full Position Correction

In modern Box2D (v2.3+), Erin Catto transitioned from velocity-level Baumgarte stabilization to a dedicated **Full Non-Linear Position Solver (NGS)** executed after velocity solving.

### How NGS Operates
1. Velocity constraints are solved completely with $v_{\text{bias}} = 0$.
2. Velocities are integrated to compute tentative positions $\mathbf{x}_{\text{tentative}}, \theta_{\text{tentative}}$.
3. The engine runs a secondary iterative loop purely on positions:
   - For each contact manifold, recalculate the true geometric separation $C(\mathbf{x}) = (\mathbf{x}_B - \mathbf{x}_A) \cdot \hat{\mathbf{n}} - \delta_{\text{slop}}$.
   - If $C(\mathbf{x}) < 0$, compute the exact positional Lagrange multiplier:

$$\Delta \lambda_p = \frac{-C(\mathbf{x})}{w_1 + w_2 + \frac{(\mathbf{r}_1 \times \hat{\mathbf{n}})^2}{I_1} + \frac{(\mathbf{r}_2 \times \hat{\mathbf{n}})^2}{I_2}}$$

   - Directly apply the spatial corrections:

$$\Delta \mathbf{x}_1 = -w_1 \Delta \lambda_p \hat{\mathbf{n}}, \quad \Delta \theta_1 = -\frac{1}{I_1} (\mathbf{r}_1 \times \hat{\mathbf{n}}) \Delta \lambda_p$$

$$\Delta \mathbf{x}_2 = +w_2 \Delta \lambda_p \hat{\mathbf{n}}, \quad \Delta \theta_2 = +\frac{1}{I_2} (\mathbf{r}_2 \times \hat{\mathbf{n}}) \Delta \lambda_p$$

   - Because positions and orientations update immediately inside the loop, subsequent constraints in the stack see the updated geometry (the Gauss-Seidel principle), eliminating the stacking lag that plagues simultaneous linear projection.

---

## 10.7 Progressive Worked Examples

### Example 1: Velocity-Only Resting Contact Sinking Drift Analysis
**Problem Statement:**
A uniform cube of mass $m = 10.0\text{ kg}$ rests on a horizontal static floor under gravity $g = 9.80\text{ m/s}^2$. The physics engine runs at $60\text{ Hz}$ ($\Delta t = 1/60\text{ s} \approx 0.016667\text{ s}$).
Assume the velocity solver perfectly enforces $v_y^+ = 0$ at the end of every step, but applies zero positional correction.
1. Calculate the downward velocity $v_y^*$ acquired during each free gravitational integration step before collision resolution.
2. Calculate the incremental penetration depth $\Delta \delta$ added to the floor during each time step.
3. Compute the cumulative sinking depth after $t = 1.0\text{ second}$ (60 frames) and $t = 10.0\text{ seconds}$ (600 frames).

**Solution:**

**Step 1: Compute Downward Velocity per Free Step**
During each time step, gravity accelerates the mass from rest ($v_0 = 0$):

$$v_y^* = v_0 - g \Delta t = 0 - 9.80\text{ m/s}^2 \times \frac{1}{60}\text{ s} = -\frac{9.80}{60}\text{ m/s} \approx -0.163333\text{ m/s}$$

**Step 2: Incremental Penetration per Step**
Using explicit Euler integration for position:

$$\Delta y = v_y^* \Delta t = -0.163333\text{ m/s} \times \frac{1}{60}\text{ s} = -\frac{9.80}{3600}\text{ m} \approx -0.0027222\text{ m} = -2.722\text{ mm}$$

At the end of the frame, the velocity solver sets $v_y = 0$, but leaves the position sunk by:

$$\Delta \delta = 2.7222\text{ mm}$$

**Step 3: Cumulative Sinking Depth**
Since the velocity is reset to zero each step, the position drifts downward by exactly $\Delta \delta$ every single frame:
- After $t = 1.0\text{ s}$ ($N = 60\text{ frames}$):

$$\delta(1\text{ s}) = 60 \times 0.0027222\text{ m} = 0.16333\text{ m} = 16.33\text{ cm}$$

- After $t = 10.0\text{ s}$ ($N = 600\text{ frames}$):

$$\delta(10\text{ s}) = 600 \times 0.0027222\text{ m} = 1.6333\text{ m}$$

**Physical Sanity Check:**
In just 1 second, a solid steel box sinks over $16\text{ centimeters}$ into a concrete floor! In 10 seconds, it has submerged by over $1.6\text{ meters}$. This proves conclusively that velocity-level impulses cannot maintain resting equilibrium.

---

### Example 2: Linear Positional Projection for Equal and Unequal Masses
**Problem Statement:**
Two colliding circular discs $\mathcal{A}$ and $\mathcal{B}$ penetrate with overlap depth $\delta = 0.080\text{ m}$ ($8\text{ cm}$) along collision normal $\hat{\mathbf{n}} = [1.0, 0.0]^T$.
Calculate the position correction vectors $\Delta \mathbf{x}_1$ and $\Delta \mathbf{x}_2$ for two cases:
1. Equal masses: $m_1 = 4.0\text{ kg}, m_2 = 4.0\text{ kg}$.
2. Asymmetric masses: $m_1 = 1.0\text{ kg}$ (light), $m_2 = 9.0\text{ kg}$ (heavy).

**Solution:**

**Case 1: Equal Masses ($m_1 = m_2 = 4.0\text{ kg}$)**
Inverse masses:

$$w_1 = \frac{1}{4.0} = 0.25\text{ kg}^{-1}, \quad w_2 = \frac{1}{4.0} = 0.25\text{ kg}^{-1}$$

Total inverse mass:

$$w_{\text{tot}} = w_1 + w_2 = 0.25 + 0.25 = 0.50\text{ kg}^{-1}$$

Position corrections:

$$\Delta \mathbf{x}_1 = -\frac{w_1}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = -\frac{0.25}{0.50}(0.080) [1.0, 0.0]^T = -0.50(0.080) [1.0, 0.0]^T = [-0.040, 0.0]^T\text{ m}$$

$$\Delta \mathbf{x}_2 = +\frac{w_2}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = +\frac{0.25}{0.50}(0.080) [1.0, 0.0]^T = +0.50(0.080) [1.0, 0.0]^T = [+0.040, 0.0]^T\text{ m}$$

Total relative separation:

$$\Delta \mathbf{x}_2 - \Delta \mathbf{x}_1 = [0.040 - (-0.040), 0.0]^T = [0.080, 0.0]^T\text{ m} = \delta \hat{\mathbf{n}}$$

Both bodies move symmetrically by $4.0\text{ cm}$ in opposite directions.

**Case 2: Asymmetric Masses ($m_1 = 1.0\text{ kg}, m_2 = 9.0\text{ kg}$)**
Inverse masses:

$$w_1 = \frac{1}{1.0} = 1.00\text{ kg}^{-1}, \quad w_2 = \frac{1}{9.0} \approx 0.11111\text{ kg}^{-1}$$

Total inverse mass:

$$w_{\text{tot}} = 1.00 + 0.11111 = 1.11111\text{ kg}^{-1}$$

Position corrections:

$$\Delta \mathbf{x}_1 = -\frac{w_1}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = -\frac{1.00}{1.11111}(0.080) [1.0, 0.0]^T = -0.90(0.080) [1.0, 0.0]^T = [-0.072, 0.0]^T\text{ m}$$

$$\Delta \mathbf{x}_2 = +\frac{w_2}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = +\frac{0.11111}{1.11111}(0.080) [1.0, 0.0]^T = +0.10(0.080) [1.0, 0.0]^T = [+0.008, 0.0]^T\text{ m}$$

Total relative separation:

$$\Delta \mathbf{x}_2 - \Delta \mathbf{x}_1 = [0.008 - (-0.072), 0.0]^T = [0.080, 0.0]^T\text{ m}$$

**Physical Sanity Check:**
The light body ($1\text{ kg}$) absorbs $90\%$ of the displacement ($7.2\text{ cm}$), while the heavy body ($9\text{ kg}$) absorbs only $10\%$ ($0.8\text{ cm}$), exactly mirroring physical inertia.

---

### Example 3: Static-Dynamic Collision Positional Projection
**Problem Statement:**
A dynamic crate of mass $m_2 = 25.0\text{ kg}$ penetrates into a static bedrock cliff (body 1) by $\delta = 0.035\text{ m}$ along normal $\hat{\mathbf{n}} = [0.0, 1.0]^T$.
1. State the inverse mass $w_1$ of the static bedrock.
2. Compute the position corrections $\Delta \mathbf{x}_1$ and $\Delta \mathbf{x}_2$.
3. Verify that momentum and kinematic boundary conditions are strictly respected.

**Solution:**

**Step 1: Inverse Mass of Static Body**
Static entities possess infinite mass ($m_1 = \infty$):

$$w_1 = \frac{1}{\infty} = 0.0\text{ kg}^{-1}$$

For the dynamic crate:

$$w_2 = \frac{1}{25.0} = 0.040\text{ kg}^{-1}$$

$$w_{\text{tot}} = w_1 + w_2 = 0.0 + 0.040 = 0.040\text{ kg}^{-1}$$

**Step 2: Compute Displacements**

$$\Delta \mathbf{x}_1 = -\frac{w_1}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = -\frac{0.0}{0.040}(0.035) [0.0, 1.0]^T = [0.0, 0.0]^T\text{ m}$$

$$\Delta \mathbf{x}_2 = +\frac{w_2}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = +\frac{0.040}{0.040}(0.035) [0.0, 1.0]^T = +1.0(0.035) [0.0, 1.0]^T = [0.0, 0.035]^T\text{ m}$$

**Step 3: Verification**
- The bedrock cliff experiences $\Delta \mathbf{x}_1 = \mathbf{0}$, ensuring static world geometry never moves.
- The dynamic crate absorbs $100\%$ of the penetration ($\Delta y = +0.035\text{ m}$), pushing it fully clear of the cliff.

---

### Example 4: Baumgarte Stabilization Velocity Bias Derivation for Varying $\beta$
**Problem Statement:**
A contact manifold has a measured penetration depth of $\delta = 0.015\text{ m}$ ($15\text{ mm}$).
The simulation time step is $\Delta t = 0.01667\text{ s}$ ($60\text{ Hz}$).
The penetration slop is set to $\delta_{\text{slop}} = 0.005\text{ m}$ ($5\text{ mm}$).
Compute the Baumgarte velocity bias $v_{\text{bias}}$ for four different gain settings:
1. $\beta = 0.0$ (No stabilization)
2. $\beta = 0.1$ (Gentle stabilization)
3. $\beta = 0.2$ (Standard Box2D stabilization)
4. $\beta = 0.8$ (Extreme over-stabilization)

**Solution:**

**Step 1: Compute Effective Penetration**

$$\delta_{\text{eff}} = \max(0, \delta - \delta_{\text{slop}}) = \max(0, 0.015 - 0.005) = 0.010\text{ m} = 10\text{ mm}$$

**Step 2: Evaluate $v_{\text{bias}} = \frac{\beta}{\Delta t} \delta_{\text{eff}}$**

- For $\beta = 0.0$:

$$v_{\text{bias}} = \frac{0.0}{0.01667}(0.010) = 0.000\text{ m/s}$$

- For $\beta = 0.1$:

$$v_{\text{bias}} = \frac{0.1}{0.01667}(0.010) = (6.00)(0.010) = 0.060\text{ m/s}$$

- For $\beta = 0.2$:

$$v_{\text{bias}} = \frac{0.2}{0.01667}(0.010) = (12.00)(0.010) = 0.120\text{ m/s}$$

- For $\beta = 0.8$:

$$v_{\text{bias}} = \frac{0.8}{0.01667}(0.010) = (48.00)(0.010) = 0.480\text{ m/s}$$

**Physical Commentary:**
At $\beta = 0.2$, a gentle corrective velocity of $0.12\text{ m/s}$ is applied, removing $2\text{ mm}$ of the $10\text{ mm}$ excess penetration in the first frame without alarming the user. At $\beta = 0.8$, the violent $0.48\text{ m/s}$ upward kick visibly launches resting objects into the air.

---

### Example 5: Limit-Cycle Oscillation Analysis Without Slop Deadband
**Problem Statement:**
A resting mass $m = 1.0\text{ kg}$ on a rigid floor has $\beta = 0.5$, $\Delta t = 0.02\text{ s}$, and **zero slop** ($\delta_{\text{slop}} = 0.0\text{ m}$). Gravity is $g = 10.0\text{ m/s}^2$. Restitution $e = 0$.
Trace the height $y$ and velocity $v$ for 4 consecutive steps starting at $y_0 = 0.0\text{ m}, v_0 = 0.0\text{ m/s}$.

**Solution:**

**Step 1 ($t = 0 \to 0.02\text{ s}$):**
- Free fall under gravity: $v_1^* = v_0 - g \Delta t = 0 - 10.0(0.02) = -0.20\text{ m/s}$.
- Position update: $y_1 = y_0 + v_1^* \Delta t = 0.0 + (-0.20)(0.02) = -0.0040\text{ m}$ (Penetration $\delta_1 = 0.0040\text{ m}$).
- Baumgarte bias ($\delta_{\text{slop}} = 0$):

$$v_{\text{bias}} = \frac{\beta}{\Delta t} \delta_1 = \frac{0.5}{0.02}(0.0040) = 25.0 \times 0.0040 = +0.100\text{ m/s}$$

- Solver enforces $v_1^+ = v_{\text{bias}} = +0.100\text{ m/s}$.

**Step 2 ($t = 0.02 \to 0.04\text{ s}$):**
- Gravity integration: $v_2^* = v_1^+ - g \Delta t = +0.100 - 10.0(0.02) = +0.100 - 0.200 = -0.100\text{ m/s}$.
- Position update: $y_2 = y_1 + v_2^* \Delta t = -0.0040 + (-0.100)(0.02) = -0.0040 - 0.0020 = -0.0060\text{ m}$ ($\delta_2 = 0.0060\text{ m}$).
- Baumgarte bias:

$$v_{\text{bias}} = 25.0 \times 0.0060 = +0.150\text{ m/s}$$

- Solver enforces $v_2^+ = +0.150\text{ m/s}$.

**Step 3 ($t = 0.04 \to 0.06\text{ s}$):**
- Gravity integration: $v_3^* = +0.150 - 0.200 = -0.050\text{ m/s}$.
- Position update: $y_3 = -0.0060 + (-0.050)(0.02) = -0.0060 - 0.0010 = -0.0070\text{ m}$ ($\delta_3 = 0.0070\text{ m}$).
- Baumgarte bias: $v_{\text{bias}} = 25.0 \times 0.0070 = +0.175\text{ m/s}$.
- Solver enforces $v_3^+ = +0.175\text{ m/s}$.

**Step 4 ($t = 0.06 \to 0.08\text{ s}$):**
- Gravity integration: $v_4^* = +0.175 - 0.200 = -0.025\text{ m/s}$.
- Position update: $y_4 = -0.0070 + (-0.025)(0.02) = -0.0070 - 0.0005 = -0.0075\text{ m}$ ($\delta_4 = 0.0075\text{ m}$).
- Baumgarte bias: $v_{\text{bias}} = 25.0 \times 0.0075 = +0.1875\text{ m/s}$.
- Solver enforces $v_4^+ = +0.1875\text{ m/s}$.

Notice the steady-state equilibrium:
Equilibrium requires $v^* = v_{\text{bias}} - g \Delta t = 0 \implies v_{\text{bias}} = g \Delta t = 0.20\text{ m/s}$.
At equilibrium:

$$25.0 \times \delta_{\text{eq}} = 0.20 \implies \delta_{\text{eq}} = \frac{0.20}{25.0} = 0.0080\text{ m} = 8.0\text{ mm}$$

Without slop, the system never comes to rest at $y = 0$; it permanently chatters around an equilibrium penetration depth of $8\text{ mm}$.

---

### Example 6: Slop Hysteresis Function and Effective Penetration Filtering
**Problem Statement:**
A physics engine defines penetration slop $\delta_{\text{slop}} = 0.004\text{ m}$ ($4\text{ mm}$).
Evaluate the effective penetration $\delta_{\text{eff}}$ and the resulting velocity bias $v_{\text{bias}}$ (with $\beta = 0.2, \Delta t = 0.01667\text{ s}$) for five measured penetration levels:
1. $\delta = 0.001\text{ m}$
2. $\delta = 0.0039\text{ m}$
3. $\delta = 0.0040\text{ m}$
4. $\delta = 0.006\text{ m}$
5. $\delta = 0.020\text{ m}$

**Solution:**

Formula:

$$\delta_{\text{eff}} = \max(0, \delta - 0.004\text{ m})$$

$$v_{\text{bias}} = \frac{0.2}{0.01667} \delta_{\text{eff}} \approx 12.0 \times \delta_{\text{eff}}$$

| Case | Measured $\delta$ | Slop Subtracted ($\delta - 0.004$) | $\delta_{\text{eff}}$ | $v_{\text{bias}}$ (m/s) | Solver Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | $0.0010\text{ m}$ | $-0.0030\text{ m}$ | $0.0000\text{ m}$ | $0.000\text{ m/s}$ | In Deadband (Quiet) |
| 2 | $0.0039\text{ m}$ | $-0.0001\text{ m}$ | $0.0000\text{ m}$ | $0.000\text{ m/s}$ | In Deadband (Quiet) |
| 3 | $0.0040\text{ m}$ | $0.0000\text{ m}$ | $0.0000\text{ m}$ | $0.000\text{ m/s}$ | Exact Boundary (Quiet) |
| 4 | $0.0060\text{ m}$ | $+0.0020\text{ m}$ | $0.0020\text{ m}$ | $0.024\text{ m/s}$ | Correcting Excess |
| 5 | $0.0200\text{ m}$ | $+0.0160\text{ m}$ | $0.0160\text{ m}$ | $0.192\text{ m/s}$ | Strong Active Push |

**Insight:**
Any micro-penetration below $4\text{ mm}$ produces zero velocity bias, guaranteeing absolute resting calm without solver chatter.

---

### Example 7: Explosive Energy Injection Under High Baumgarte Gain
**Problem Statement:**
A crate of mass $m = 5.0\text{ kg}$ is dropped onto a floor. Due to high frame lag, it penetrates by $\delta = 0.10\text{ m}$ ($10\text{ cm}$) at $t_k$.
A developer sets $\beta = 1.0$ and $\delta_{\text{slop}} = 0$ with $\Delta t = 0.02\text{ s}$.
1. Compute the Baumgarte velocity bias $v_{\text{bias}}$ imparted to the crate.
2. Calculate the artificial kinetic energy $E_k$ injected into the crate by this single frame correction.
3. Determine how high the crate will bounce upward into the air under gravity ($g = 9.8\text{ m/s}^2$).

**Solution:**

**Step 1: Compute Baumgarte Velocity Bias**

$$v_{\text{bias}} = \frac{\beta}{\Delta t} \delta = \frac{1.0}{0.02\text{ s}} \times 0.10\text{ m} = 50.0 \times 0.10 = 5.00\text{ m/s}$$

The crate is launched upward at $v_y = 5.00\text{ m/s}$!

**Step 2: Calculate Injected Kinetic Energy**

$$E_k = \frac{1}{2} m v^2 = \frac{1}{2} (5.0\text{ kg}) (5.00\text{ m/s})^2 = 2.5 \times 25.0 = 62.5\text{ Joules}$$

**Step 3: Maximum Rebound Height**
Using conservation of mechanical energy ($m g h = E_k$):

$$h = \frac{v^2}{2g} = \frac{5.00^2}{2(9.8)} = \frac{25.0}{19.6} \approx 1.2755\text{ m}$$

**Conclusion:**
A minor $10\text{ cm}$ lag penetration causes the crate to rocket $1.28\text{ meters}$ into the air! This is the classic "popcorn explosion" caused by excessive Baumgarte gain ($\beta = 1.0$).

---

### Example 8: Split Impulse Pseudo-Velocity Accumulation
**Problem Statement:**
A rigid box of mass $m = 2.0\text{ kg}$ with downward physical velocity $v_y = -3.0\text{ m/s}$ collides with a floor ($e = 0.5$).
Collision detection reports penetration $\delta = 0.020\text{ m}$.
Parameters: $\Delta t = 0.01667\text{ s}$, $\delta_{\text{slop}} = 0.005\text{ m}$, $\beta = 0.2$.
Using the Split Impulse architecture:
1. Compute the physical restitution impulse $J_{\text{real}}$ and new physical velocity $v_{\text{real}}^+$.
2. Compute the pseudo-velocity bias $v_{\text{bias}}$ and the pseudo-impulse $J_{\text{bias}}$.
3. Compute the tentative position $y_{\text{mid}}$ and final position $y_{\text{final}}$ after applying pseudo-velocities.
4. Verify the kinetic energy of the system entering the next frame.

**Solution:**

**Step 1: Physical Velocity Constraint**
The physical target relative velocity is:

$$v_{\text{rel}}^+ = -e v_{\text{rel}}^- = -0.5 (-3.0\text{ m/s}) = +1.50\text{ m/s}$$

Change in velocity:

$$\Delta v_{\text{real}} = v_{\text{rel}}^+ - v_{\text{rel}}^- = +1.50 - (-3.0) = +4.50\text{ m/s}$$

Physical impulse:

$$J_{\text{real}} = m \Delta v_{\text{real}} = 2.0\text{ kg} \times 4.50\text{ m/s} = +9.00\text{ N}\cdot\text{s}$$

New physical velocity:

$$v_{\text{real}}^+ = -3.0 + 4.50 = +1.50\text{ m/s}$$

**Step 2: Pseudo-Velocity Correction**
Effective penetration:

$$\delta_{\text{eff}} = \max(0, 0.020 - 0.005) = 0.015\text{ m}$$

Baumgarte target bias:

$$v_{\text{target, bias}} = \frac{\beta}{\Delta t} \delta_{\text{eff}} = \frac{0.2}{0.01667}(0.015) = 12.0 \times 0.015 = +0.180\text{ m/s}$$

Pseudo-impulse:

$$J_{\text{bias}} = m v_{\text{target, bias}} = 2.0\text{ kg} \times 0.180\text{ m/s} = +0.360\text{ N}\cdot\text{s}$$

Pseudo-velocity assigned:

$$v_{\text{bias}} = +0.180\text{ m/s}$$

**Step 3: Separate Position Integrations**
Let initial position be $y_0 = -0.020\text{ m}$ (sunk by $20\text{ mm}$):
1. Advance by physical velocity:

$$y_{\text{mid}} = y_0 + v_{\text{real}}^+ \Delta t = -0.020 + (1.50\text{ m/s} \times 0.01667\text{ s}) = -0.020 + 0.0250 = +0.0050\text{ m}$$

2. Advance by pseudo-velocity:

$$y_{\text{final}} = y_{\text{mid}} + v_{\text{bias}} \Delta t = +0.0050 + (0.180\text{ m/s} \times 0.01667\text{ s}) = +0.0050 + 0.0030 = +0.0080\text{ m}$$

3. Reset pseudo-velocity:

$$v_{\text{bias}} \leftarrow 0.000\text{ m/s}$$

**Step 4: Energy Verification**
The crate leaves the frame with physical velocity $v = +1.50\text{ m/s}$.
Its kinetic energy is:

$$E_k = \frac{1}{2} (2.0)(1.50)^2 = 2.25\text{ Joules}$$

The initial pre-collision kinetic energy was $\frac{1}{2}(2.0)(-3.0)^2 = 9.0\text{ Joules}$.
Energy ratio:

$$\frac{E_{\text{final}}}{E_{\text{initial}}} = \frac{2.25}{9.00} = 0.25 = e^2$$

The kinetic energy ratio matches $e^2 = 0.5^2 = 0.25$ **exactly**! The positional correction injected precisely zero joules of artificial kinetic energy.

---

### Example 9: Multi-Body Stack Penetration Cascade
**Problem Statement:**
A vertical stack consists of 3 identical boxes ($m = 2.0\text{ kg}$, height $h = 1.0\text{ m}$) resting on a floor.
During a frame, box 1 penetrates the floor by $\delta_1 = 6\text{ mm}$.
Box 2 penetrates box 1 by $\delta_2 = 4\text{ mm}$.
Box 3 penetrates box 2 by $\delta_3 = 2\text{ mm}$.
Compute the mass-weighted linear position corrections $\Delta y_1, \Delta y_2, \Delta y_3$ if solved simultaneously in a single uncoupled pass.

**Solution:**

Each box has inverse mass $w = 1/2.0 = 0.5\text{ kg}^{-1}$. The floor has $w_{\text{floor}} = 0$.

**Contact 1 (Box 1 vs Floor):**
- $\delta_1 = 6\text{ mm}$. Floor is static.
- Displacement of box 1 from Contact 1:

$$\Delta y_{1,(1)} = +\frac{w_1}{w_{\text{floor}} + w_1} \delta_1 = +\frac{0.5}{0.5}(6\text{ mm}) = +6\text{ mm}$$

**Contact 2 (Box 2 vs Box 1):**
- $\delta_2 = 4\text{ mm}$. Both dynamic ($w_1 = w_2 = 0.5$).
- Displacements:

$$\Delta y_{1,(2)} = -\frac{w_1}{w_1 + w_2} \delta_2 = -0.5(4\text{ mm}) = -2\text{ mm}$$

$$\Delta y_{2,(2)} = +\frac{w_2}{w_1 + w_2} \delta_2 = +0.5(4\text{ mm}) = +2\text{ mm}$$

**Contact 3 (Box 3 vs Box 2):**
- $\delta_3 = 2\text{ mm}$. Both dynamic ($w_2 = w_3 = 0.5$).
- Displacements:

$$\Delta y_{2,(3)} = -\frac{w_2}{w_2 + w_3} \delta_3 = -0.5(2\text{ mm}) = -1\text{ mm}$$

$$\Delta y_{3,(3)} = +\frac{w_3}{w_2 + w_3} \delta_3 = +0.5(2\text{ mm}) = +1\text{ mm}$$

**Total Net Displacements:**

$$\Delta y_1 = \Delta y_{1,(1)} + \Delta y_{1,(2)} = +6\text{ mm} - 2\text{ mm} = +4\text{ mm}$$

$$\Delta y_2 = \Delta y_{2,(2)} + \Delta y_{2,(3)} = +2\text{ mm} - 1\text{ mm} = +1\text{ mm}$$

$$\Delta y_3 = \Delta y_{3,(3)} = +1\text{ mm}$$

**Resulting Residual Overlaps:**
- Box 1 vs Floor: New overlap $= 6\text{ mm} - \Delta y_1 = 6 - 4 = 2\text{ mm}$ (Still penetrating!).
- Box 2 vs Box 1: Relative shift $= \Delta y_2 - \Delta y_1 = 1 - 4 = -3\text{ mm}$.
  New overlap $= 4\text{ mm} - (-3\text{ mm}) = 7\text{ mm}$! Box 2 penetrated deeper into Box 1!

**Pedagogical Insight:**
Simultaneous uncoupled position projection produces severe constraint fighting. This is why sequential iterative Gauss-Seidel or Non-Linear Position Solvers (NGS) with multiple sub-iterations are mandatory for stable stacking.

---

### Example 10: Non-Linear Position Solver for an Oriented Rectangle
**Problem Statement:**
A rectangular box of width $W = 2.0\text{ m}$, height $H = 1.0\text{ m}$, mass $m = 10.0\text{ kg}$, and moment of inertia $I = \frac{1}{12} m (W^2 + H^2) = \frac{1}{12}(10)(4.0 + 1.0) = 4.167\text{ kg}\cdot\text{m}^2$ tilts such that its bottom corner penetrates a static horizontal floor by $\delta = 0.050\text{ m}$ ($5\text{ cm}$).
The contact normal is $\hat{\mathbf{n}} = [0.0, 1.0]^T$.
The contact point offset from the center of mass is $\mathbf{r} = [0.80, -0.50]^T\text{ m}$.
Using a Non-Linear Position Solver step:
1. Compute the effective rotational inertia term $(\mathbf{r} \times \hat{\mathbf{n}})^2 / I$.
2. Compute the total effective inverse mass $M_{\text{eff}}^{-1}$.
3. Calculate the positional Lagrange multiplier $\Delta \lambda_p$.
4. Determine the resulting linear position displacement $\Delta \mathbf{x}$ and angular rotation $\Delta \theta$.

**Solution:**

**Step 1: Compute 2D Cross Product and Rotational Term**
In 2D, the cross product scalar of $\mathbf{r} = [r_x, r_y]^T$ and $\hat{\mathbf{n}} = [n_x, n_y]^T$ is:

$$r \times n = r_x n_y - r_y n_x = (0.80)(1.0) - (-0.50)(0.0) = 0.80\text{ m}$$

Squaring:

$$(r \times n)^2 = 0.80^2 = 0.64\text{ m}^2$$

Rotational contribution:

$$\frac{(r \times n)^2}{I} = \frac{0.64\text{ m}^2}{4.167\text{ kg}\cdot\text{m}^2} = 0.1536\text{ kg}^{-1}$$

**Step 2: Total Effective Inverse Mass**
Linear inverse mass:

$$w = \frac{1}{m} = \frac{1}{10.0} = 0.100\text{ kg}^{-1}$$

Floor is static ($w_{\text{floor}} = 0, I_{\text{floor}} = \infty$).
Total effective inverse mass:

$$M_{\text{eff}}^{-1} = w + \frac{(r \times n)^2}{I} = 0.100 + 0.1536 = 0.2536\text{ kg}^{-1}$$

**Step 3: Positional Lagrange Multiplier**
Target correction $C = -\delta = -0.050\text{ m}$:

$$\Delta \lambda_p = \frac{\delta}{M_{\text{eff}}^{-1}} = \frac{0.050\text{ m}}{0.2536\text{ kg}^{-1}} \approx 0.19716\text{ kg}\cdot\text{m}$$

**Step 4: Compute Linear and Angular Corrections**
Linear displacement:

$$\Delta \mathbf{x} = w \Delta \lambda_p \hat{\mathbf{n}} = 0.100 \times 0.19716 \begin{bmatrix} 0.0 \\ 1.0 \end{bmatrix} = \begin{bmatrix} 0.0 \\ 0.01972 \end{bmatrix}\text{ m} \approx [0.0, 1.972\text{ cm}]^T$$

Angular displacement:

$$\Delta \theta = \frac{1}{I} (\mathbf{r} \times \hat{\mathbf{n}}) \Delta \lambda_p = \frac{1}{4.167} (0.80) (0.19716) = 0.1920 \times 0.19716 \approx +0.03785\text{ rad} \approx 2.17^\circ$$

**Verification of Surface Point Displacement:**
The displacement of the contact point itself is:

$$\Delta \mathbf{p} = \Delta \mathbf{x} + \Delta \theta [-r_y, r_x]^T$$

Along the normal $\hat{\mathbf{n}} = [0, 1]^T$:

$$\Delta p_y = \Delta y + \Delta \theta \, r_x = 0.01972 + (0.03785)(0.80) = 0.01972 + 0.03028 = 0.0500\text{ m} = 5.00\text{ cm}$$

The contact point lifts by exactly $5.00\text{ cm}$, perfectly removing the penetration through a physically balanced combination of upward translation ($1.97\text{ cm}$) and counter-clockwise rotation ($2.17^\circ$)!

---

## 10.8 Chapter Mastery Exercises

### Tier 1: Intuition & Principles
1. **Exercise 10.1:** Explain why applying direct positional translation to resolve penetration violates physical conservation of energy if velocities are not adjusted.
2. **Exercise 10.2:** What is the physical role of the Baumgarte coefficient $\beta$, and what catastrophic simulation artifact occurs if $\beta$ is set greater than $0.5$?

### Tier 2: Baumgarte & Slop Calculations
3. **Exercise 10.3:** A physics simulation runs at $120\text{ Hz}$ ($\Delta t = 1/120\text{ s}$). A contact penetration of $\delta = 0.008\text{ m}$ is measured. With $\beta = 0.25$ and $\delta_{\text{slop}} = 0.002\text{ m}$, calculate the Baumgarte velocity bias $v_{\text{bias}}$.
4. **Exercise 10.4:** For the system in Exercise 10.3, what would $v_{\text{bias}}$ be if the measured penetration were $\delta = 0.0015\text{ m}$? Explain the result.

### Tier 3: Linear Positional Projection
5. **Exercise 10.5:** Two bodies $\mathcal{A}$ ($m_A = 20\text{ kg}$) and $\mathcal{B}$ ($m_B = 5\text{ kg}$) penetrate along normal $\hat{\mathbf{n}} = [0.0, 1.0]^T$ by $\delta = 0.050\text{ m}$. Compute the mass-weighted linear position displacement vectors $\Delta \mathbf{x}_A$ and $\Delta \mathbf{x}_B$.
6. **Exercise 10.6:** A dynamic ball ($m = 3\text{ kg}$) penetrates an immovable static wall ($m = \infty$) by $\delta = 0.025\text{ m}$. Compute the displacement of both bodies.

### Tier 4: Split Impulse Architecture
7. **Exercise 10.7:** A ball of mass $m = 4\text{ kg}$ hits a floor with downward velocity $v = -5.0\text{ m/s}$ ($e = 0.8$). The penetration is $\delta = 0.030\text{ m}$, $\delta_{\text{slop}} = 0.005\text{ m}$, $\beta = 0.2$, $\Delta t = 0.02\text{ s}$. Compute:
   (a) The post-collision physical velocity $v_{\text{real}}^+$.
   (b) The pseudo-velocity bias $v_{\text{bias}}$.
   (c) Verify that no artificial kinetic energy is retained by the ball after the step.
8. **Exercise 10.8:** Explain why pseudo-velocities in the Split Impulse method must be reset to zero at the conclusion of every simulation step.

### Tier 5: Non-Linear Position Solving & Stacking
9. **Exercise 10.9:** A square crate of side length $L = 1.0\text{ m}$, mass $m = 6.0\text{ kg}$, and moment of inertia $I = 1.0\text{ kg}\cdot\text{m}^2$ contacts a floor at corner $\mathbf{r} = [0.5, -0.5]^T\text{ m}$ with normal $\hat{\mathbf{n}} = [0.0, 1.0]^T$. If penetration is $\delta = 0.040\text{ m}$, compute the exact angular correction $\Delta \theta$ and linear correction $\Delta y$.
10. **Exercise 10.10:** Describe why Gauss-Seidel relaxation is superior to Jacobi relaxation when resolving positional constraints in tall stacks of rigid bodies.

---

## 10.9 Complete Step-by-Step Solutions to Chapter Exercises

### Solution 10.1
- When an object's position is instantaneously translated by $\Delta \mathbf{x}$ in a potential field (such as gravity $\mathbf{g} = [0, -g]^T$), its potential energy changes by $\Delta U = -m \mathbf{g} \cdot \Delta \mathbf{x} = m g \Delta y$.
- If velocity $\mathbf{v}$ is left unchanged, kinetic energy $E_k = \frac{1}{2} m v^2$ remains constant.
- The total mechanical energy $E_{\text{total}} = E_k + U$ increases by $\Delta U$ out of nothing.
- Furthermore, numerical differentiation schemes in subsequent frames observe a non-physical jump $\frac{\Delta \mathbf{x}}{\Delta t}$ in effective velocity, creating artificial explosive forces and violating conservation of momentum. $\blacksquare$

### Solution 10.2
- The Baumgarte coefficient $\beta$ acts as a dimensionless proportional gain governing what fraction of the geometric penetration error $\delta$ is converted into corrective separating velocity over time step $\Delta t$: $v_{\text{bias}} = \frac{\beta}{\Delta t} \delta$.
- If $\beta > 0.5$, the virtual correction spring becomes under-damped and hyper-stiff. In discrete integration, this creates massive numerical overshoot: the corrective impulse propels the body completely off the contact surface with a velocity much higher than its entry speed.
- In resting contact stacks, this produces the **popcorn effect**, where stacks spontaneously shudder, bounce, and explode into the air. $\blacksquare$

### Solution 10.3
- $\Delta t = \frac{1}{120}\text{ s} \approx 0.008333\text{ s}$.
- Measured penetration $\delta = 0.008\text{ m}$, slop $\delta_{\text{slop}} = 0.002\text{ m}$, $\beta = 0.25$.
- Effective penetration:

$$\delta_{\text{eff}} = \max(0, \delta - \delta_{\text{slop}}) = \max(0, 0.008 - 0.002) = 0.006\text{ m}$$

- Baumgarte velocity bias:

$$v_{\text{bias}} = \frac{\beta}{\Delta t} \delta_{\text{eff}} = \frac{0.25}{1/120\text{ s}} \times 0.006\text{ m} = (0.25 \times 120) \times 0.006 = 30.0 \times 0.006 = 0.180\text{ m/s}$$

$\blacksquare$

### Solution 10.4
- Measured penetration $\delta = 0.0015\text{ m}$.
- Slop threshold $\delta_{\text{slop}} = 0.0020\text{ m}$.
- Effective penetration:

$$\delta_{\text{eff}} = \max(0, 0.0015 - 0.0020) = \max(0, -0.0005) = 0.000\text{ m}$$

- Therefore:

$$v_{\text{bias}} = \frac{0.25}{\Delta t}(0.000) = 0.000\text{ m/s}$$

- **Physical Explanation:** The penetration lies strictly within the slop deadband ($0.0015\text{ m} \le 0.0020\text{ m}$). The solver treats this as an acceptable resting tolerance, suppressing corrective velocity bias to prevent limit-cycle chatter and contact jitter. $\blacksquare$

### Solution 10.5
- Masses: $m_A = 20\text{ kg}$, $m_B = 5\text{ kg}$.
- Inverse masses: $w_A = \frac{1}{20} = 0.05\text{ kg}^{-1}$, $w_B = \frac{1}{5} = 0.20\text{ kg}^{-1}$.
- Total inverse mass: $w_{\text{tot}} = 0.05 + 0.20 = 0.25\text{ kg}^{-1}$.
- Penetration: $\delta = 0.050\text{ m}$, normal $\hat{\mathbf{n}} = [0.0, 1.0]^T$.
- Displacements:

$$\Delta \mathbf{x}_A = -\frac{w_A}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = -\frac{0.05}{0.25}(0.050) [0.0, 1.0]^T = -0.20(0.050) [0.0, 1.0]^T = [0.0, -0.010]^T\text{ m}$$

$$\Delta \mathbf{x}_B = +\frac{w_B}{w_{\text{tot}}} \delta \hat{\mathbf{n}} = +\frac{0.20}{0.25}(0.050) [0.0, 1.0]^T = +0.80(0.050) [0.0, 1.0]^T = [0.0, +0.040]^T\text{ m}$$

- Body $\mathcal{A}$ shifts down by $1.0\text{ cm}$; body $\mathcal{B}$ shifts up by $4.0\text{ cm}$. Total relative separation is $0.040 - (-0.010) = 0.050\text{ m} = \delta$. $\blacksquare$

### Solution 10.6
- Ball: $m = 3\text{ kg} \implies w_{\text{ball}} = 1/3 \approx 0.3333\text{ kg}^{-1}$.
- Wall: $m = \infty \implies w_{\text{wall}} = 0$.
- Total inverse mass: $w_{\text{tot}} = 0.3333 + 0 = 0.3333\text{ kg}^{-1}$.
- Wall displacement:

$$\Delta \mathbf{x}_{\text{wall}} = -\frac{0}{0.3333} \delta \hat{\mathbf{n}} = \mathbf{0}$$

- Ball displacement:

$$\Delta \mathbf{x}_{\text{ball}} = +\frac{0.3333}{0.3333} \delta \hat{\mathbf{n}} = +1.0 \delta \hat{\mathbf{n}} = 0.025 \hat{\mathbf{n}}\text{ m}$$

- The static wall remains immovable ($\Delta \mathbf{x} = \mathbf{0}$); the dynamic ball absorbs $100\%$ of the displacement ($2.5\text{ cm}$). $\blacksquare$

### Solution 10.7
- Parameters: $m = 4\text{ kg}$, $v^- = -5.0\text{ m/s}$, $e = 0.8$, $\delta = 0.030\text{ m}$, $\delta_{\text{slop}} = 0.005\text{ m}$, $\beta = 0.2$, $\Delta t = 0.02\text{ s}$.
- **(a) Physical Velocity:**

$$v_{\text{real}}^+ = -e v^- = -0.8 (-5.0\text{ m/s}) = +4.00\text{ m/s}$$

- **(b) Pseudo-Velocity Bias:**
  $\delta_{\text{eff}} = \max(0, 0.030 - 0.005) = 0.025\text{ m}$.

$$v_{\text{bias}} = \frac{\beta}{\Delta t} \delta_{\text{eff}} = \frac{0.2}{0.02\text{ s}} \times 0.025\text{ m} = 10.0 \times 0.025 = +0.250\text{ m/s}$$

- **(c) Energy Verification:**
  The body's persistent physical velocity entering the next frame is $v_{\text{real}}^+ = +4.00\text{ m/s}$.
  Its persistent kinetic energy is:

$$E_k = \frac{1}{2} (4\text{ kg}) (4.00\text{ m/s})^2 = 2.0 \times 16.0 = 32.0\text{ Joules}$$

  Initial kinetic energy: $E_{k,0} = \frac{1}{2}(4)(5.0)^2 = 50.0\text{ Joules}$.
  Energy ratio: $\frac{32.0}{50.0} = 0.64 = (0.8)^2 = e^2$.
  The pseudo-velocity $v_{\text{bias}} = 0.25\text{ m/s}$ was applied purely to shift position during integration and then discarded. The stored kinetic energy is exactly $e^2 E_{k,0}$, proving zero artificial kinetic energy was retained. $\blacksquare$

### Solution 10.8
- Pseudo-velocities represent synthetic, non-physical velocities created solely to transport geometry out of numerical overlap during a single time step.
- If pseudo-velocities were allowed to persist into the next time step, they would act as real momentum, adding artificial kinetic energy, disturbing ballistic trajectories, and causing resting bodies to drift horizontally or bounce vertically.
- Resetting $\mathbf{v}_{\text{bias}} \leftarrow \mathbf{0}$ at step completion ensures that physical momentum is governed purely by true forces and impulses. $\blacksquare$

### Solution 10.9
- Mass $m = 6.0\text{ kg} \implies w = 1/6 \approx 0.16667\text{ kg}^{-1}$.
- Moment of inertia $I = 1.0\text{ kg}\cdot\text{m}^2$.
- Contact offset $\mathbf{r} = [0.5, -0.5]^T\text{ m}$, normal $\hat{\mathbf{n}} = [0.0, 1.0]^T$.
- 2D Cross product:

$$\mathbf{r} \times \hat{\mathbf{n}} = r_x n_y - r_y n_x = (0.5)(1.0) - (-0.5)(0.0) = 0.5\text{ m}$$

- Effective rotational inverse mass:

$$\frac{(\mathbf{r} \times \hat{\mathbf{n}})^2}{I} = \frac{0.5^2}{1.0} = \frac{0.25}{1.0} = 0.25\text{ kg}^{-1}$$

- Total effective inverse mass:

$$M_{\text{eff}}^{-1} = w + 0.25 = 0.16667 + 0.25000 = 0.41667\text{ kg}^{-1} = \frac{5}{12}\text{ kg}^{-1}$$

- Positional multiplier for $\delta = 0.040\text{ m}$:

$$\Delta \lambda_p = \frac{\delta}{M_{\text{eff}}^{-1}} = \frac{0.040}{5/12} = 0.040 \times 2.4 = 0.096\text{ kg}\cdot\text{m}$$

- Linear displacement:

$$\Delta y = w \Delta \lambda_p = \left(\frac{1}{6}\right)(0.096) = 0.0160\text{ m} = 1.60\text{ cm}$$

- Angular displacement:

$$\Delta \theta = \frac{1}{I} (\mathbf{r} \times \hat{\mathbf{n}}) \Delta \lambda_p = \frac{1}{1.0} (0.5)(0.096) = +0.0480\text{ rad} \approx 2.75^\circ$$

- Verification: $\Delta y + \Delta \theta r_x = 0.0160 + (0.0480)(0.5) = 0.0160 + 0.0240 = 0.0400\text{ m} = \delta$. $\blacksquare$

### Solution 10.10
- In a tall stack of $N$ rigid bodies (e.g., 10 boxes):
  - **Jacobi Relaxation:** Updates all contact constraints simultaneously using state values from the previous iteration. Box 1 resolves penetration against the floor, but Box 2's penetration against Box 1 is computed assuming Box 1 hasn't moved yet! The correction wave propagates by only one box per iteration, requiring at least $N$ iterations just for the floor contact to reach the top box. This causes extreme "sponge-like" softness and sagging.
  - **Gauss-Seidel Relaxation:** Immediately writes position updates to memory as each constraint is processed. When Box 1 is pushed up by the floor, Box 2's constraint immediately evaluates using Box 1's newly corrected position in the very same iteration. The support force propagates instantaneously up the entire column in a single sweep, yielding orders-of-magnitude stiffer, more stable stacking with far fewer solver iterations. $\blacksquare$
