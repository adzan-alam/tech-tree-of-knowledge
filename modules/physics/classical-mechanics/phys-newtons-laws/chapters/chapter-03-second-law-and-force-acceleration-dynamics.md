# CHAPTER 03: Newton's Second Law ($\vec{F}_{\text{net}} = m\vec{a}$) & Dimensional Mechanics

> "The alteration of motion is ever proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed."
> — **Sir Isaac Newton**, *Principia Mathematica*, Axioma II (1687)

---

### Learning Objectives
After mastering this chapter, the sovereign student will be able to:
1. Formulate Newton's Second Law in its primary momentum derivative form $\vec{F}_{\text{net}} = \frac{d\vec{p}}{dt}$ and derive the constant-mass realization $\vec{F}_{\text{net}} = m\vec{a}$.
2. Explain the vector parallelism between net force and acceleration, proving why $\vec{a}$ is strictly collinear with $\vec{F}_{\text{net}}$ regardless of the direction of the velocity vector $\vec{v}$.
3. Analyze the dot product $\vec{F}_{\text{net}} \cdot \vec{v}$ to determine whether a physical body is speeding up, slowing down, or executing pure directional curvature.
4. Perform rigorous dimensional analysis on force, mass, and acceleration across the SI ($\text{N}$), CGS ($\text{dyne}$), and Imperial gravitational ($\text{lbf}, \text{slug}$) unit systems.
5. Derive the Impulse-Momentum Theorem $\vec{J} = \int \vec{F}_{\text{net}}\,dt = \Delta\vec{p}$ and explain why vehicle crumple zones and airbags reduce peak impact force.
6. Explain the computational utility of the **Inverse Mass formulation** ($w = 1/m$) in physics simulation engines.
7. Solve 10 progressive numerical worked examples and 10 chapter mastery exercises with rigorous mathematical precision.

---

## 3.1 The Engine of Dynamics: From State to Causation

In Chapter 01 and Chapter 02, we established the foundational baseline of mechanics: an object in uniform motion perseveres in that state unless disturbed, and balanced forces produce static or dynamic equilibrium ($\vec{F}_{\text{net}} = \vec{0} \iff \vec{a} = \vec{0}$).

Now, we cross the threshold into **Classical Dynamics**. We ask the fundamental causal question:

> **What happens when the net external force acting on an object is NOT zero?**

Newton answered this question in his immortal **Second Law of Motion (Lex II)**. While kinematics describes *how* objects move (velocity, trajectory, acceleration), dynamics explains *why* they move. Net force is the physical cause; acceleration is the observable kinematic effect.

---

## 3.2 Momentum Formulation: $\vec{F} = \frac{d\vec{p}}{dt}$

In the original Latin text of the *Principia*, Newton did not write the familiar formula $F = ma$. He formulated the law in terms of the "quantity of motion", known in modern physics as **linear momentum ($\vec{p}$)**:

$$\vec{p} = m\vec{v}$$

Linear momentum is a vector quantity that compounds an object’s inertial mass with its velocity vector. Its SI units are kilogram-meters per second ($\text{kg}\cdot\text{m/s}$ or $\text{N}\cdot\text{s}$).

Newton’s primary definition of Lex II states:
$$\vec{F}_{\text{net}} = \frac{d\vec{p}}{dt}$$

Applying the product rule of differential calculus:
$$\vec{F}_{\text{net}} = \frac{d}{dt}(m\vec{v}) = m \frac{d\vec{v}}{dt} + \vec{v} \frac{dm}{dt}$$

Recognizing that $\frac{d\vec{v}}{dt} = \vec{a}$ is the acceleration vector:
$$\vec{F}_{\text{net}} = m\vec{a} + \vec{v} \frac{dm}{dt}$$

### The Constant-Mass Specialization
For almost all macroscopic mechanical systems in classical physics—automobiles, pendulums, sports equipment, artillery shells, planetary bodies—the mass of the object is constant ($\frac{dm}{dt} = 0$). 
In this constant-mass regime, Newton's Second Law takes its celebrated, canonical form:

$$\vec{F}_{\text{net}} = m\vec{a}$$

*(Note: For variable-mass systems, such as ascending rockets expelling fuel or freight cars collecting rainwater, the full momentum flux formulation must be applied, as derived in Chapter 11).*

---

## 3.3 The Vector Geometry of Lex II

Newton’s Second Law is fundamentally a **vector relationship**. The scalar mass $m$ is strictly positive ($m > 0$).
Therefore, multiplying the acceleration vector $\vec{a}$ by scalar $m$ changes only its magnitude, never its direction!

$$\vec{a} = \frac{\vec{F}_{\text{net}}}{m}$$

**The Fundamental Vector Direction Rule:** The acceleration vector $\vec{a}$ is **always, unconditionally, strictly parallel** to the net force vector $\vec{F}_{\text{net}}$.

```
                     Velocity vs. Acceleration Directions
                     
 Case A: Speeding Up (F_net . v > 0)
        v --------->
        F_net ----->    (a is parallel to v; scalar speed increases)
        
 Case B: Slowing Down (F_net . v < 0)
        v --------->
  <---- F_net           (a is antiparallel to v; scalar speed decreases)
  
 Case C: Pure Curvature (F_net . v = 0)
        v --------->
        |
        | F_net         (a is perpendicular to v; speed is constant,
        v                direction changes: Uniform Circular Motion!)
```

### The Three Dynamic Regimes:
By evaluating the scalar dot product between net force and velocity, we instantly identify the physical regime:
1. **$\vec{F}_{\text{net}} \cdot \vec{v} > 0$:** Net force has a component along the direction of motion. The object **speeds up**.
2. **$\vec{F}_{\text{net}} \cdot \vec{v} < 0$:** Net force has a component opposing motion. The object **slows down**.
3. **$\vec{F}_{\text{net}} \cdot \vec{v} = 0$:** Net force is strictly perpendicular to the trajectory. The object maintains constant scalar speed while **turning** (e.g., centripetal acceleration in circular motion).

### Cartesian Component Decomposition
In 2D planar dynamics, the vector equation $\vec{F}_{\text{net}} = m\vec{a}$ uncouples into two independent scalar equations:

$$\sum F_x = m a_x$$
$$\sum F_y = m a_y$$

This uncoupling is mathematically sacred:
- A force along the $x$-axis produces acceleration **only** along the $x$-axis ($a_x = \frac{\sum F_x}{m}$).
- A force along the $y$-axis produces acceleration **only** along the $y$-axis ($a_y = \frac{\sum F_y}{m}$).
- Forces along $y$ have zero influence on acceleration along $x$, and vice versa.

---

## 3.4 Dimensional Analysis and the Spectrum of Units

The dimensional formula for force is derived directly from $F = ma$:
$$[F] = [M][L][T]^{-2}$$

| System of Units | Mass Unit | Acceleration Unit | Force Unit | Conversion to SI |
|:---|:---|:---|:---|:---|
| **SI (Metric)** | Kilogram ($\text{kg}$) | $\text{m/s}^2$ | **Newton ($\text{N}$)** | $1\,\text{N} \equiv 1\,\text{kg}\cdot\text{m/s}^2$ |
| **CGS (Centimeter-Gram-Second)** | Gram ($\text{g}$) | $\text{cm/s}^2$ | **Dyne ($\text{dyn}$)** | $1\,\text{dyn} = 10^{-5}\,\text{N}$ |
| **US Customary / Imperial** | **Slug** | $\text{ft/s}^2$ | **Pound-Force ($\text{lbf}$)** | $1\,\text{lbf} \approx 4.44822\,\text{N}$ |

### The Slug Mystery Explained
In the imperial system, the everyday unit of weight is the **pound ($\text{lb}$)**. But a pound is a unit of **force**, not mass!
To use $F = ma$ with acceleration in $\text{ft/s}^2$ ($g \approx 32.174\,\text{ft/s}^2$), physicists defined the imperial unit of mass: the **Slug**:
$$1\,\text{slug} \equiv \frac{1\,\text{lbf}}{1\,\text{ft/s}^2} \approx 14.5939\,\text{kg}$$
An object weighing $32.2\,\text{lbf}$ on Earth has a mass of exactly $1\,\text{slug}$.

---

## 3.5 The Impulse-Momentum Theorem & Impact Mitigation

When a force acts over an extended duration of time from $t_1$ to $t_2$, we define the **Impulse ($\vec{J}$)** as the time integral of the net force vector:

$$\vec{J} = \int_{t_1}^{t_2} \vec{F}_{\text{net}}(t)\,dt$$

Using Newton's Second Law $\vec{F}_{\text{net}} = \frac{d\vec{p}}{dt}$:
$$\vec{J} = \int_{t_1}^{t_2} \frac{d\vec{p}}{dt}\,dt = \int_{\vec{p}_1}^{\vec{p}_2} d\vec{p} = \vec{p}_2 - \vec{p}_1 = \Delta\vec{p}$$

This is the fundamental **Impulse-Momentum Theorem**:

$$\vec{J} = \Delta\vec{p} = m\vec{v}_2 - m\vec{v}_1$$

```
                           The Physics of Impact Time
                           
 Hard Wall (Short dt = 0.01 s)                Crumple Zone (Long dt = 0.20 s)
        F                                            F
        ^                                            ^
 200 kN |   *                                        |
        |  / \                                       |
        | /   \                               10 kN  |    * * * *
        |/     \                                     |  *         *
        +-------+---------> t                        +--+---------+---> t
          0.01 s                                          0.20 s
          
     Same Area (Impulse J = Delta p), but 20x Lower Peak Force!
```

### The Engineering Principle of Impact Mitigation:
If a passenger in a collision must be brought from $30\,\text{m/s}$ to $0\,\text{m/s}$, their change in momentum $\Delta p = m \Delta v$ is completely fixed.
Because $\Delta p = \vec{F}_{\text{avg}} \Delta t$:
$$\vec{F}_{\text{avg}} = \frac{\Delta\vec{p}}{\Delta t}$$

- If the vehicle is rigid and stops against concrete in $\Delta t = 0.01\,\text{s}$, the average force exerted on the passenger is colossal ($\propto 100 \times \Delta p$).
- If the vehicle features an engineered **crumple zone** and an **airbag** that stretch the deceleration interval to $\Delta t = 0.20\,\text{s}$ (a 20-fold increase in duration), the peak impact force drops by a factor of 20!

---

## 3.6 Computational Kinematics: The Inverse Mass Pattern

In real-time computational physics engines (e.g., Box2D, NVIDIA PhysX, Bullet), computing accelerations via:
$$\vec{a} = \frac{\vec{F}_{\text{net}}}{m}$$
presents two serious engineering liabilities:
1. **Division is Computationally Expensive:** Floating-point division operations require significantly more CPU clock cycles than floating-point multiplications.
2. **Infinite Mass Representation (Static Geometry):** In game and robotics simulations, stationary terrain (floors, bedrock, walls) cannot move. Their effective mass is infinite ($m = \infty$). Attempting to evaluate $\vec{a} = \vec{F} / \infty$ causes floating-point exceptions (`NaN` or `Infinity`), requiring ugly conditional `if (m != Infinity)` branches inside inner simulation loops.

The elegant, sovereign engineering solution is to store the **Inverse Mass ($w$)**:

$$w = \frac{1}{m}$$

- For a dynamic particle of mass $m = 2.0\,\text{kg}$, its inverse mass is $w = 0.50\,\text{kg}^{-1}$.
- For an immovable static boundary or platform, its mass is infinite ($m = \infty$), so its inverse mass is **identically zero**:
  $$w_{\text{static}} = 0.0$$

The acceleration calculation becomes a lightning-fast, branchless vector multiplication:
$$\vec{a} = w \vec{F}_{\text{net}}$$

If an object is static, $w = 0 \implies \vec{a} = 0 \cdot \vec{F} = \vec{0}$, automatically guaranteeing that static geometry never moves, regardless of the magnitude of applied forces!

---

## 3.7 Ten Progressive Worked Numerical Examples

Use $g = 9.80\,\text{m/s}^2$ throughout.

---

### Example 3.1: Fundamental Second Law Acceleration
**Problem:** A rocket sled of total mass $m = 800.0\,\text{kg}$ is accelerated from rest along a straight horizontal track by solid-fuel rocket boosters producing a total forward thrust $F_{\text{thrust}} = 24.0\,\text{kN} = 24,000.0\,\text{N}$. The track guide rails exert a constant total resisting friction force $f = 3,200.0\,\text{N}$.
1. Compute the net horizontal force $F_{\text{net}}$ acting on the sled.
2. Determine the acceleration $a$ of the sled.
3. Calculate the sled's speed after $t = 3.50\,\text{s}$ and the distance traveled.

#### Solution
**Step 1: Net horizontal force**
$$F_{\text{net}} = F_{\text{thrust}} - f = 24000.0\,\text{N} - 3200.0\,\text{N} = +20800.0\,\text{N}$$

**Step 2: Acceleration**
$$a = \frac{F_{\text{net}}}{m} = \frac{20800.0\,\text{N}}{800.0\,\text{kg}} = 26.00\,\text{m/s}^2 \approx 2.65\,g$$

**Step 3: Kinematics at $t = 3.50\,\text{s}$**
$$v(t) = v_0 + a t = 0 + 26.00\,\text{m/s}^2 \times 3.50\,\text{s} = 91.00\,\text{m/s} \approx 327.6\,\text{km/h}$$
$$x(t) = \frac{1}{2} a t^2 = 0.5 \times 26.00 \times (3.50)^2 = 13.00 \times 12.25 = 159.25\,\text{m}$$

---

### Example 3.2: 2D Force Vector Producing 2D Acceleration
**Problem:** An autonomous hovercraft of mass $m = 150.0\,\text{kg}$ floating on a frictionless air cushion is acted upon by two vector thrusters:
- Thruster 1 exerts $\vec{F}_1 = 450.0\,\hat{i} + 300.0\,\hat{j}\,\text{N}$.
- Thruster 2 exerts $\vec{F}_2 = -150.0\,\hat{i} + 600.0\,\hat{j}\,\text{N}$.
1. Find the net force vector $\vec{F}_{\text{net}}$ and its magnitude.
2. Determine the acceleration vector $\vec{a}$ in component form and its magnitude.
3. If the hovercraft starts from rest at $(x_0, y_0) = (0, 0)$, what are its coordinates at $t = 4.00\,\text{s}$?

#### Solution
**Step 1: Net force vector**
$$\vec{F}_{\text{net}} = \vec{F}_1 + \vec{F}_2 = (450.0 - 150.0)\,\hat{i} + (300.0 + 600.0)\,\hat{j} = 300.0\,\hat{i} + 900.0\,\hat{j}\,\text{N}$$
$$|\vec{F}_{\text{net}}| = \sqrt{(300.0)^2 + (900.0)^2} = \sqrt{90000 + 810000} = \sqrt{900000} = 948.683\,\text{N} \approx 948.7\,\text{N}$$

**Step 2: Acceleration vector**
$$\vec{a} = \frac{\vec{F}_{\text{net}}}{m} = \frac{300.0\,\hat{i} + 900.0\,\hat{j}\,\text{N}}{150.0\,\text{kg}} = 2.00\,\hat{i} + 6.00\,\hat{j}\,\text{m/s}^2$$
$$|\vec{a}| = \sqrt{(2.00)^2 + (6.00)^2} = \sqrt{4.00 + 36.00} = \sqrt{40.00} = 6.3245\,\text{m/s}^2 \approx 6.32\,\text{m/s}^2$$
*Sanity Check:* $|\vec{a}| = \frac{|\vec{F}_{\text{net}}|}{m} = \frac{948.683}{150.0} = 6.3245\,\text{m/s}^2$. Exact match.

**Step 3: Position at $t = 4.00\,\text{s}$**
$$x(t) = \frac{1}{2} a_x t^2 = 0.5 \times 2.00 \times (4.00)^2 = 1.00 \times 16.0 = 16.00\,\text{m}$$
$$y(t) = \frac{1}{2} a_y t^2 = 0.5 \times 6.00 \times (4.00)^2 = 3.00 \times 16.0 = 48.00\,\text{m}$$
Coordinates: $(16.00\,\text{m}, 48.00\,\text{m})$.

---

### Example 3.3: Apparent Weight in an Accelerating Elevator
**Problem:** A physics student of mass $m = 70.0\,\text{kg}$ stands on a calibrated electronic scale inside an elevator.
1. What does the scale read (in Newtons and equivalent apparent mass in $\text{kg}$) when the elevator accelerates upward at $a = +2.45\,\text{m/s}^2$?
2. What does the scale read when the elevator accelerates downward at $a = -3.20\,\text{m/s}^2$?
3. At what downward acceleration does the scale read exactly zero?

#### Solution
**Step 1: Upward acceleration ($a = +2.45\,\text{m/s}^2$)**
Forces acting on the student:
- Downward gravity: $W = m g = 70.0 \times 9.80 = 686.0\,\text{N}$.
- Upward normal force from scale: $N$.
By Newton's Second Law:
$$\sum F_y = N - m g = m a \implies N = m(g + a)$$
$$N = 70.0\,\text{kg} \times (9.80 + 2.45)\,\text{m/s}^2 = 70.0 \times 12.25 = 857.50\,\text{N}$$
Equivalent apparent mass reading:
$$m_{\text{apparent}} = \frac{N}{g} = \frac{857.50\,\text{N}}{9.80\,\text{m/s}^2} = 87.50\,\text{kg}$$
The student feels $25\%$ heavier.

**Step 2: Downward acceleration ($a = -3.20\,\text{m/s}^2$)**
Taking upward as positive:
$$N = m(g + a) = 70.0\,\text{kg} \times (9.80 - 3.20)\,\text{m/s}^2 = 70.0 \times 6.60 = 462.00\,\text{N}$$
Equivalent apparent mass reading:
$$m_{\text{apparent}} = \frac{462.00}{9.80} = 47.14\,\text{kg}$$
The student feels substantially lighter.

**Step 3: Weightlessness ($N = 0$)**
$$N = m(g + a) = 0 \implies g + a = 0 \implies a = -g = -9.80\,\text{m/s}^2$$
When in free fall, the scale reads zero.

---

### Example 3.4: Helicopter Cargo Lift Dynamics
**Problem:** A rescue helicopter of mass $M = 3500.0\,\text{kg}$ lifts a relief cargo pod of mass $m = 1200.0\,\text{kg}$ suspended below it by a high-strength vertical cable. The helicopter accelerates vertically upward at $a = +1.80\,\text{m/s}^2$.
1. Calculate the tension $T$ in the cargo cable.
2. Calculate the upward lift force $L$ generated by the helicopter's rotor blades.

#### Solution
**Step 1: Cargo cable tension**
Isolate the cargo pod ($m = 1200.0\,\text{kg}$):
Forces on pod: upward cable tension $T$, downward gravity $m g$.
$$\sum F_y = T - m g = m a \implies T = m (g + a)$$
$$T = 1200.0\,\text{kg} \times (9.80 + 1.80)\,\text{m/s}^2 = 1200.0 \times 11.60 = 13920.0\,\text{N} = 13.92\,\text{kN}$$

**Step 2: Rotor lift force $L$**
Method A (Isolating the helicopter $M = 3500.0\,\text{kg}$):
Forces on helicopter: upward rotor lift $L$, downward helicopter weight $M g$, downward cable tension $T$ (pulling down on helicopter by Newton's Third Law!).
$$\sum F_y = L - M g - T = M a \implies L = M(g + a) + T$$
$$M(g + a) = 3500.0 \times 11.60 = 40600.0\,\text{N}$$
$$L = 40600.0 + 13920.0 = 54520.0\,\text{N} = 54.52\,\text{kN}$$

Method B (Treating the combined system as a single body of mass $M_{\text{total}} = M + m = 4700.0\,\text{kg}$):
Internal cable tension cancels out:
$$\sum F_y = L - M_{\text{total}} g = M_{\text{total}} a \implies L = M_{\text{total}} (g + a)$$
$$L = 4700.0\,\text{kg} \times 11.60\,\text{m/s}^2 = 54520.0\,\text{N} = 54.52\,\text{kN}$$
Both methods produce identical results.

---

### Example 3.5: Automobile Braking and Stopping Distance
**Problem:** A family sedan of mass $m = 1600.0\,\text{kg}$ travels at $v_0 = 108.0\,\text{km/h} = 30.0\,\text{m/s}$. The driver slams on the brakes. The locked-wheel kinetic friction coefficient on dry asphalt is $\mu_k = 0.750$.
1. Compute the braking friction force $f_k$.
2. Compute the deceleration of the car. Notice whether mass matters!
3. Calculate the time to come to a complete stop and the braking distance.

#### Solution
**Step 1: Braking friction force**
Vertical equilibrium:
$$N = m g = 1600.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 15680.0\,\text{N}$$
Kinetic friction force:
$$f_k = \mu_k N = 0.750 \times 15680.0\,\text{N} = 11760.0\,\text{N}$$

**Step 2: Deceleration**
$$\sum F_x = -f_k = m a \implies a = -\frac{f_k}{m} = -\frac{\mu_k m g}{m} = -\mu_k g$$
$$a = -0.750 \times 9.80\,\text{m/s}^2 = -7.350\,\text{m/s}^2$$
**Mass Independence Principle:** Notice that mass $m$ cancels completely! A $40,000\,\text{kg}$ semi-truck and a $1,000\,\text{kg}$ compact car on the same tires on the same asphalt have the exact same theoretical stopping acceleration.

**Step 3: Stopping time and distance**
$$t_{\text{stop}} = \frac{v_0}{|a|} = \frac{30.0\,\text{m/s}}{7.350\,\text{m/s}^2} = 4.0816\,\text{s} \approx 4.08\,\text{s}$$
$$d_{\text{stop}} = \frac{v_0^2}{2 |a|} = \frac{(30.0)^2}{2 \times 7.350} = \frac{900.0}{14.70} = 61.224\,\text{m} \approx 61.2\,\text{m}$$

---

### Example 3.6: Impulse and Impact Force of a Baseball
**Problem:** A baseball of mass $m = 0.145\,\text{kg}$ approaches home plate horizontally with speed $v_1 = 40.0\,\text{m/s}$. The batter strikes the ball, sending it straight back toward the pitcher at $v_2 = 50.0\,\text{m/s}$ in the opposite direction. High-speed cameras reveal that the ball remains in contact with the bat for $\Delta t = 0.800\,\text{ms} = 0.000800\,\text{s}$.
1. Calculate the initial and final momentum of the baseball.
2. Determine the impulse $\vec{J}$ delivered by the bat.
3. Compute the average impact force $F_{\text{avg}}$ exerted by the bat on the ball.

#### Solution
**Step 1: Momentum calculation**
Let the pitcher-to-batter direction be $+x$.
Initial velocity: $v_{1x} = +40.0\,\text{m/s}$.
Final velocity: $v_{2x} = -50.0\,\text{m/s}$ (rebounding in the opposite direction).
$$p_{1x} = m v_{1x} = 0.145\,\text{kg} \times (+40.0\,\text{m/s}) = +5.80\,\text{kg}\cdot\text{m/s}$$
$$p_{2x} = m v_{2x} = 0.145\,\text{kg} \times (-50.0\,\text{m/s}) = -7.25\,\text{kg}\cdot\text{m/s}$$

**Step 2: Impulse**
$$J_x = \Delta p_x = p_{2x} - p_{1x} = (-7.25) - (+5.80) = -13.05\,\text{kg}\cdot\text{m/s} = -13.05\,\text{N}\cdot\text{s}$$
Magnitude of impulse: $13.05\,\text{N}\cdot\text{s}$ back toward the pitcher.

**Step 3: Average impact force**
$$F_{\text{avg}} = \frac{J_x}{\Delta t} = \frac{-13.05\,\text{N}\cdot\text{s}}{0.000800\,\text{s}} = -16312.5\,\text{N} \approx -16.31\,\text{kN}$$
Magnitude: $16.31\,\text{kN}$ (over $1.6\,\text{tons}$ of force!).

---

### Example 3.7: Non-Constant Force via Calculus Integration
**Problem:** An experimental electromagnetic railgun projectile of mass $m = 0.250\,\text{kg}$ starts from rest at $x = 0$ at $t = 0$. The electrical pulse applies a time-varying force:
$$F(t) = F_0 \sin\left(\frac{\pi t}{T}\right) \quad (\text{for } 0 \le t \le T)$$
where $F_0 = 12000.0\,\text{N}$ and pulse duration $T = 0.0100\,\text{s} = 10.0\,\text{ms}$.
1. Calculate the total impulse $J$ delivered to the projectile.
2. Determine the muzzle velocity $v_{\text{muzzle}}$ as the projectile exits the pulse.
3. Find an analytical expression for velocity $v(t)$ during the pulse.

#### Solution
**Step 1: Total impulse**
$$J = \int_0^T F_0 \sin\left(\frac{\pi t}{T}\right) dt = F_0 \left[ -\frac{T}{\pi} \cos\left(\frac{\pi t}{T}\right) \right]_0^T = \frac{F_0 T}{\pi} [-\cos(\pi) + \cos(0)] = \frac{F_0 T}{\pi} [-(-1) + 1] = \frac{2 F_0 T}{\pi}$$
Substitute numbers:
$$J = \frac{2 \times 12000.0\,\text{N} \times 0.0100\,\text{s}}{\pi} = \frac{240.0}{\pi} = 76.394\,\text{N}\cdot\text{s}$$

**Step 2: Muzzle velocity**
By the Impulse-Momentum Theorem:
$$J = \Delta p = m v_{\text{muzzle}} - 0 \implies v_{\text{muzzle}} = \frac{J}{m} = \frac{76.394\,\text{N}\cdot\text{s}}{0.250\,\text{kg}} = 305.58\,\text{m/s} \approx 305.6\,\text{m/s}$$

**Step 3: Analytical velocity function $v(t)$**
$$a(t) = \frac{F(t)}{m} = \frac{F_0}{m} \sin\left(\frac{\pi t}{T}\right)$$
$$v(t) = \int_0^t a(\tau)\,d\tau = \frac{F_0 T}{\pi m} \left[ 1 - \cos\left(\frac{\pi t}{T}\right) \right]$$
At $t = T$: $v(T) = \frac{2 F_0 T}{\pi m} = 305.58\,\text{m/s}$. Exact match.

---

### Example 3.8: Two-Block Tension Transmission
**Problem:** Two blocks connected by a light cord rest on a frictionless horizontal table:
- Block 1 has mass $m_1 = 4.00\,\text{kg}$.
- Block 2 has mass $m_2 = 6.00\,\text{kg}$.
A horizontal pulling force $F_{\text{pull}} = 50.0\,\text{N}$ is applied to Block 2.
1. What is the acceleration of the two-block system?
2. What is the tension $T$ in the connecting cord?
3. What would be the tension $T'$ if the force were applied to Block 1 instead?

#### Solution
**Step 1: System acceleration**
Total mass $M_{\text{total}} = m_1 + m_2 = 4.00 + 6.00 = 10.00\,\text{kg}$.
Since the cord is inextensible, both blocks accelerate together:
$$F_{\text{pull}} = M_{\text{total}} a \implies a = \frac{F_{\text{pull}}}{m_1 + m_2} = \frac{50.0\,\text{N}}{10.00\,\text{kg}} = 5.00\,\text{m/s}^2$$

**Step 2: Tension $T$ (Pull applied to Block 2)**
Isolate Block 1 ($m_1 = 4.00\,\text{kg}$):
The only horizontal force acting on Block 1 is the cord tension $T$:
$$T = m_1 a = 4.00\,\text{kg} \times 5.00\,\text{m/s}^2 = 20.00\,\text{N}$$

*Check on Block 2:* $\sum F_x = F_{\text{pull}} - T = 50.0 - 20.0 = 30.0\,\text{N} = m_2 a = 6.00 \times 5.00 = 30.0\,\text{N}$. Verified.

**Step 3: Force applied to Block 1 instead**
Acceleration remains identical: $a = 5.00\,\text{m/s}^2$.
Now isolate Block 2 ($m_2 = 6.00\,\text{kg}$):
The cord must accelerate Block 2:
$$T' = m_2 a = 6.00\,\text{kg} \times 5.00\,\text{m/s}^2 = 30.00\,\text{N}$$
Tension depends directly on which mass is being towed!

---

### Example 3.9: Pulling a Sled at an Angle with Friction
**Problem:** A child pulls a sled of mass $m = 25.0\,\text{kg}$ across packed snow using a rope inclined at $\theta = 30.0^\circ$ above the horizontal. The tension in the rope is $T = 80.0\,\text{N}$. The kinetic friction coefficient between the runners and the snow is $\mu_k = 0.120$.
1. Compute the normal force $N$ exerted by the snow on the sled.
2. Calculate the kinetic friction force $f_k$.
3. Determine the horizontal acceleration $a_x$ of the sled.

#### Solution
**Step 1: Normal force**
Rope tension components:
$$T_x = T \cos(30.0^\circ) = 80.0 \times 0.866025 = 69.282\,\text{N}$$
$$T_y = T \sin(30.0^\circ) = 80.0 \times 0.500000 = 40.000\,\text{N}$$
Vertical equilibrium ($a_y = 0$):
$$\sum F_y = N + T_y - m g = 0 \implies N = m g - T_y$$
$$m g = 25.0 \times 9.80 = 245.0\,\text{N}$$
$$N = 245.0\,\text{N} - 40.0\,\text{N} = 205.0\,\text{N}$$
The upward component of the pull reduces the normal force from $245\,\text{N}$ to $205\,\text{N}$.

**Step 2: Friction force**
$$f_k = \mu_k N = 0.120 \times 205.0\,\text{N} = 24.60\,\text{N}$$

**Step 3: Horizontal acceleration**
$$\sum F_x = T_x - f_k = 69.282\,\text{N} - 24.60\,\text{N} = 44.682\,\text{N}$$
$$a_x = \frac{\sum F_x}{m} = \frac{44.682\,\text{N}}{25.0\,\text{kg}} = 1.787\,\text{m/s}^2 \approx 1.79\,\text{m/s}^2$$

---

### Example 3.10: Computational Physics Inverse Mass State Update
**Problem:** A 2D game physics engine models three bodies:
- Body A (Player): mass $m_A = 80.0\,\text{kg}$.
- Body B (Crate): mass $m_B = 200.0\,\text{kg}$.
- Body C (Bedrock Floor): static geometry ($m_C = \infty$).
At time step $n$, each body experiences a net force $\vec{F} = 400.0\,\hat{i} - 200.0\,\hat{j}\,\text{N}$.
1. Compute the inverse mass $w$ for all three bodies.
2. Using the inverse mass formulation $\vec{a} = w \vec{F}_{\text{net}}$, compute the acceleration vector for each body.
3. Compute the velocity update $\vec{v}_{n+1} = \vec{v}_n + \vec{a} \Delta t$ for a time step $\Delta t = 0.01667\,\text{s}$ ($60\,\text{Hz}$), assuming all bodies start from rest.

#### Solution
**Step 1: Compute inverse masses**
$$w_A = \frac{1}{m_A} = \frac{1}{80.0} = 0.01250\,\text{kg}^{-1}$$
$$w_B = \frac{1}{m_B} = \frac{1}{200.0} = 0.00500\,\text{kg}^{-1}$$
$$w_C = \frac{1}{\infty} = 0.00000\,\text{kg}^{-1}$$

**Step 2: Compute acceleration vectors**
Given $\vec{F} = 400.0\,\hat{i} - 200.0\,\hat{j}\,\text{N}$:
Body A:
$$\vec{a}_A = w_A \vec{F} = 0.01250 \times (400.0\,\hat{i} - 200.0\,\hat{j}) = 5.00\,\hat{i} - 2.50\,\hat{j}\,\text{m/s}^2$$
Body B:
$$\vec{a}_B = w_B \vec{F} = 0.00500 \times (400.0\,\hat{i} - 200.0\,\hat{j}) = 2.00\,\hat{i} - 1.00\,\hat{j}\,\text{m/s}^2$$
Body C:
$$\vec{a}_C = w_C \vec{F} = 0.00000 \times (400.0\,\hat{i} - 200.0\,\hat{j}) = 0.00\,\hat{i} + 0.00\,\hat{j}\,\text{m/s}^2$$

**Step 3: Velocity update ($\Delta t = 0.01667\,\text{s}$)**
Body A:
$$\vec{v}_A = (5.00 \times 0.01667)\,\hat{i} + (-2.50 \times 0.01667)\,\hat{j} = 0.08335\,\hat{i} - 0.04168\,\hat{j}\,\text{m/s}$$
Body B:
$$\vec{v}_B = (2.00 \times 0.01667)\,\hat{i} + (-1.00 \times 0.01667)\,\hat{j} = 0.03334\,\hat{i} - 0.01667\,\hat{j}\,\text{m/s}$$
Body C:
$$\vec{v}_C = 0\,\hat{i} + 0\,\hat{j}\,\text{m/s}$$
Static geometry remains locked at rest with zero conditional branching.

---

## 3.8 Chapter Mastery Exercises

Solve each of the following 10 problems. Full, unabridged solutions follow immediately below.

### Exercise 3.1 (Tier 1: Basic Force and Mass)
An object of mass $m = 4.50\,\text{kg}$ accelerates at $\vec{a} = 3.20\,\hat{i} - 1.80\,\hat{j}\,\text{m/s}^2$.
(a) What are the components of the net force acting on the object?
(b) What is the magnitude of the net force?

### Exercise 3.2 (Tier 1: Elevator Cable Failure)
An elevator cab with passengers has a total mass of $M = 1500.0\,\text{kg}$. While moving downward, the motor brakes apply an upward cable tension of $T = 18,000.0\,\text{N}$.
(a) What is the net vertical force on the cab?
(b) What is the magnitude and direction of the cab's acceleration?

### Exercise 3.3 (Tier 2: Towing a Trailer with Friction)
A truck pulls a utility trailer of mass $m = 850.0\,\text{kg}$ along a flat highway with an acceleration of $a = 1.40\,\text{m/s}^2$. The rolling resistance opposing the trailer's motion is $F_{\text{drag}} = 420.0\,\text{N}$. What is the horizontal tension in the hitch connecting the trailer to the truck?

### Exercise 3.4 (Tier 2: Speeding Up vs Turning Dot Product)
A particle of mass $m = 2.00\,\text{kg}$ has an instantaneous velocity $\vec{v} = 6.00\,\hat{i} + 8.00\,\hat{j}\,\text{m/s}$. A net force $\vec{F}_{\text{net}} = -4.00\,\hat{i} + 3.00\,\hat{j}\,\text{N}$ acts on it.
(a) Compute the dot product $\vec{F}_{\text{net}} \cdot \vec{v}$.
(b) Is the particle speeding up, slowing down, or maintaining constant speed?
(c) What is the rate of change of speed $\frac{dv}{dt}$?

### Exercise 3.5 (Tier 3: Three-Car Train Transmission)
A miniature freight train consists of three linked cars on a frictionless track:
- Car 1: $m_1 = 3.00\,\text{kg}$
- Car 2: $m_2 = 2.00\,\text{kg}$
- Car 3: $m_3 = 5.00\,\text{kg}$
A forward pull of $F = 40.0\,\text{N}$ is applied to Car 3.
(a) What is the acceleration of the train?
(b) What is the tension $T_{12}$ in the coupling between Car 1 and Car 2?
(c) What is the tension $T_{23}$ in the coupling between Car 2 and Car 3?

### Exercise 3.6 (Tier 3: Football Kick Impulse)
A punter kicks a stationary football of mass $m = 0.420\,\text{kg}$, launching it with speed $v = 28.0\,\text{m/s}$ at an angle of $45.0^\circ$ above the horizontal. The punter's foot remains in contact with the ball for $\Delta t = 8.00\,\text{ms} = 0.00800\,\text{s}$.
(a) What is the magnitude of the impulse delivered to the football?
(b) What is the average force exerted by the punter's foot?

### Exercise 3.7 (Tier 4: Stopping a Bullet in Ballistic Gel)
A bullet of mass $m = 9.00\,\text{g} = 0.00900\,\text{kg}$ enters a block of ballistic gel at $v_0 = 360.0\,\text{m/s}$ and penetrates to a depth of $d = 24.0\,\text{cm} = 0.240\,\text{m}$ before stopping.
Assuming a uniform resisting force:
(a) Calculate the acceleration of the bullet in the gel.
(b) Calculate the average retarding force exerted by the gel.
(c) How many milliseconds did the penetration take?

### Exercise 3.8 (Tier 4: Parachute Deployment Shock)
A parachutist of mass $m = 90.0\,\text{kg}$ is in free fall at terminal velocity $v_0 = 55.0\,\text{m/s}$. When the parachute deploys, lines and canopy generate an upward drag force that reduces the parachutist's speed to $v_f = 6.00\,\text{m/s}$ over an interval of $\Delta t = 2.50\,\text{s}$.
Assuming constant deceleration:
(a) Calculate the deceleration during parachute deployment.
(b) Calculate the total upward force exerted by the parachute harness on the jumper.
(c) Express the total harness force in terms of multiples of body weight ($g$-force).

### Exercise 3.9 (Tier 5: Time-Dependent Deceleration Profile)
A braking mechanism applies a force that decays linearly with time:
$$F(t) = F_0 \left(1 - \frac{t}{T}\right) \quad (\text{for } 0 \le t \le T)$$
A test vehicle of mass $m = 1200.0\,\text{kg}$ enters the braking channel at $v_0 = 25.0\,\text{m/s}$. The parameters are $F_0 = 15,000.0\,\text{N}$ and $T = 3.00\,\text{s}$.
(a) Find an analytical expression for velocity $v(t)$.
(b) Calculate the vehicle's speed at the end of the braking interval ($t = T$).
(c) Calculate the total distance traveled during braking.

### Exercise 3.10 (Tier 5: 2D Curved Motion Force Decomposition)
A vehicle of mass $m = 1000.0\,\text{kg}$ travels along a circular track of radius $R = 80.0\,\text{m}$. At a particular instant, its speed is $v = 20.0\,\text{m/s}$ and its speed is increasing at a rate of $\frac{dv}{dt} = 3.00\,\text{m/s}^2$.
(a) Compute the tangential force $F_t$ and centripetal force $F_c$.
(b) Determine the magnitude of the total net force acting on the vehicle.
(c) What angle does the net force vector make with the vehicle's heading?

---

## 3.9 Comprehensive Solutions to Chapter Exercises

---

### Solution 3.1
**(a) Force components:**
$$F_x = m a_x = 4.50\,\text{kg} \times 3.20\,\text{m/s}^2 = +14.40\,\text{N}$$
$$F_y = m a_y = 4.50\,\text{kg} \times (-1.80\,\text{m/s}^2) = -8.10\,\text{N}$$
$$\vec{F}_{\text{net}} = 14.40\,\hat{i} - 8.10\,\hat{j}\,\text{N}$$

**(b) Magnitude:**
$$|\vec{F}_{\text{net}}| = \sqrt{(14.40)^2 + (-8.10)^2} = \sqrt{207.36 + 65.61} = \sqrt{272.97} = 16.522\,\text{N} \approx 16.52\,\text{N}$$

---

### Solution 3.2
**(a) Net vertical force:**
Downward gravity:
$$W = M g = 1500.0\,\text{kg} \times 9.80\,\text{m/s}^2 = 14700.0\,\text{N}$$
Upward cable tension: $T = 18000.0\,\text{N}$.
Taking upward as positive:
$$F_{\text{net}} = T - M g = 18000.0\,\text{N} - 14700.0\,\text{N} = +3300.0\,\text{N}\quad (\text{upward})$$

**(b) Acceleration:**
$$a = \frac{F_{\text{net}}}{M} = \frac{+3300.0\,\text{N}}{1500.0\,\text{kg}} = +2.20\,\text{m/s}^2\quad (\text{upward})$$
Because the cab is moving downward while accelerating upward, it is **slowing down** at $2.20\,\text{m/s}^2$.

---

### Solution 3.3
Isolate trailer ($m = 850.0\,\text{kg}$):
Forces acting horizontally: forward hitch tension $T_{\text{hitch}}$, backward rolling resistance $F_{\text{drag}} = 420.0\,\text{N}$.
$$\sum F_x = T_{\text{hitch}} - F_{\text{drag}} = m a$$
$$T_{\text{hitch}} = m a + F_{\text{drag}} = (850.0\,\text{kg} \times 1.40\,\text{m/s}^2) + 420.0\,\text{N} = 1190.0\,\text{N} + 420.0\,\text{N} = 1610.0\,\text{N}$$

---

### Solution 3.4
**(a) Dot product:**
$$\vec{F}_{\text{net}} \cdot \vec{v} = (-4.00)(6.00) + (3.00)(8.00) = -24.00 + 24.00 = 0.00\,\text{W}$$

**(b) Motion behavior:**
Since $\vec{F}_{\text{net}} \cdot \vec{v} = 0$, the net force is strictly perpendicular to the velocity vector.
The particle maintains **constant scalar speed** while its direction curves!

**(c) Rate of change of speed:**
$$\frac{dv}{dt} = \frac{\vec{F}_{\text{net}} \cdot \vec{v}}{m v} = 0.00\,\text{m/s}^2$$

---

### Solution 3.5
**(a) Train acceleration:**
Total mass $M = m_1 + m_2 + m_3 = 3.00 + 2.00 + 5.00 = 10.00\,\text{kg}$.
$$a = \frac{F}{M} = \frac{40.0\,\text{N}}{10.00\,\text{kg}} = 4.00\,\text{m/s}^2$$

**(b) Tension $T_{12}$:**
Coupling $T_{12}$ accelerates only Car 1 ($m_1 = 3.00\,\text{kg}$):
$$T_{12} = m_1 a = 3.00\,\text{kg} \times 4.00\,\text{m/s}^2 = 12.00\,\text{N}$$

**(c) Tension $T_{23}$:**
Coupling $T_{23}$ accelerates both Car 1 and Car 2 ($m_1 + m_2 = 5.00\,\text{kg}$):
$$T_{23} = (m_1 + m_2) a = (3.00 + 2.00) \times 4.00 = 5.00 \times 4.00 = 20.00\,\text{N}$$
*Check on Car 3:* $\sum F = F - T_{23} = 40.0 - 20.0 = 20.0\,\text{N} = m_3 a = 5.00 \times 4.00 = 20.0\,\text{N}$. Verified.

---

### Solution 3.6
**(a) Magnitude of impulse:**
Initial momentum: $p_1 = 0$.
Final speed: $v = 28.0\,\text{m/s}$.
$$J = |\Delta\vec{p}| = m v = 0.420\,\text{kg} \times 28.0\,\text{m/s} = 11.76\,\text{N}\cdot\text{s}$$

**(b) Average force:**
$$F_{\text{avg}} = \frac{J}{\Delta t} = \frac{11.76\,\text{N}\cdot\text{s}}{0.00800\,\text{s}} = 1470.0\,\text{N} \approx 1.47\,\text{kN}$$

---

### Solution 3.7
**(a) Acceleration:**
Using $v^2 = v_0^2 + 2 a d$ with $v = 0, v_0 = 360.0\,\text{m/s}, d = 0.240\,\text{m}$:
$$0 = (360.0)^2 + 2 a (0.240) \implies 0.480 a = -129600.0$$
$$a = -\frac{129600.0}{0.480} = -270000.0\,\text{m/s}^2 = -2.70 \times 10^5\,\text{m/s}^2$$

**(b) Retarding force:**
$$F_{\text{gel}} = m a = 0.00900\,\text{kg} \times (-270000.0\,\text{m/s}^2) = -2430.0\,\text{N} = -2.43\,\text{kN}$$

**(c) Penetration duration:**
$$t = \frac{v_0}{|a|} = \frac{360.0\,\text{m/s}}{270000.0\,\text{m/s}^2} = 0.001333\,\text{s} = 1.33\,\text{ms}$$

---

### Solution 3.8
**(a) Deceleration:**
$$a = \frac{v_f - v_0}{\Delta t} = \frac{6.00\,\text{m/s} - 55.0\,\text{m/s}}{2.50\,\text{s}} = \frac{-49.0\,\text{m/s}}{2.50\,\text{s}} = -19.60\,\text{m/s}^2$$
Taking upward as positive, the deceleration is $a = +19.60\,\text{m/s}^2$ upward.

**(b) Total upward harness force $F_{\text{harness}}$:**
Taking upward as positive:
$$\sum F_y = F_{\text{harness}} - m g = m a \implies F_{\text{harness}} = m (g + a)$$
$$F_{\text{harness}} = 90.0\,\text{kg} \times (9.80 + 19.60)\,\text{m/s}^2 = 90.0 \times 29.40 = 2646.0\,\text{N}$$

**(c) Harness force in $g$-force multiples:**
$$\text{Multiples of body weight} = \frac{F_{\text{harness}}}{m g} = \frac{2646.0\,\text{N}}{90.0 \times 9.80} = \frac{2646.0}{882.0} = 3.00\,g$$
The parachutist experiences a $3.00\,g$ opening shock.

---

### Solution 3.9
Given $F(t) = -F_0 (1 - t/T)$ opposing motion.
**(a) Analytical velocity expression:**
$$a(t) = -\frac{F_0}{m} \left(1 - \frac{t}{T}\right)$$
$$v(t) = v_0 + \int_0^t a(\tau)\,d\tau = v_0 - \frac{F_0}{m} \left[ \tau - \frac{\tau^2}{2T} \right]_0^t = v_0 - \frac{F_0}{m} \left(t - \frac{t^2}{2T}\right)$$

**(b) Speed at $t = T = 3.00\,\text{s}$:**
At $t = T$:
$$T - \frac{T^2}{2T} = T - \frac{T}{2} = \frac{T}{2} = \frac{3.00}{2} = 1.50\,\text{s}$$
$$\Delta v = \frac{F_0}{m} \left(\frac{T}{2}\right) = \frac{15000.0}{1200.0} \times 1.50 = 12.50 \times 1.50 = 18.75\,\text{m/s}$$
$$v(T) = v_0 - \Delta v = 25.00\,\text{m/s} - 18.75\,\text{m/s} = 6.25\,\text{m/s}$$

**(c) Total distance traveled:**
$$x(T) = \int_0^T v(t)\,dt = \int_0^T \left[ v_0 - \frac{F_0}{m} \left(t - \frac{t^2}{2T}\right) \right] dt = v_0 T - \frac{F_0}{m} \left[ \frac{T^2}{2} - \frac{T^3}{6T} \right] = v_0 T - \frac{F_0}{m} \left[ \frac{T^2}{2} - \frac{T^2}{6} \right] = v_0 T - \frac{F_0 T^2}{3m}$$
$$v_0 T = 25.0 \times 3.00 = 75.00\,\text{m}$$
$$\frac{F_0 T^2}{3m} = \frac{15000.0 \times (3.00)^2}{3 \times 1200.0} = \frac{15000.0 \times 9.00}{3600.0} = \frac{135000.0}{3600.0} = 37.50\,\text{m}$$
$$x(T) = 75.00\,\text{m} - 37.50\,\text{m} = 37.50\,\text{m}$$

---

### Solution 3.10
**(a) Tangential and centripetal forces:**
$$F_t = m a_t = m \frac{dv}{dt} = 1000.0\,\text{kg} \times 3.00\,\text{m/s}^2 = 3000.0\,\text{N}$$
$$a_c = \frac{v^2}{R} = \frac{(20.0\,\text{m/s})^2}{80.0\,\text{m}} = \frac{400.0}{80.0} = 5.00\,\text{m/s}^2$$
$$F_c = m a_c = 1000.0\,\text{kg} \times 5.00\,\text{m/s}^2 = 5000.0\,\text{N}$$

**(b) Total net force magnitude:**
$$F_{\text{total}} = \sqrt{F_t^2 + F_c^2} = \sqrt{(3000.0)^2 + (5000.0)^2} = \sqrt{9000000 + 25000000} = \sqrt{34000000} = 5830.95\,\text{N} \approx 5.83\,\text{kN}$$

**(c) Angle with heading:**
The heading vector is aligned with the tangent. Centripetal force points inward at $90^\circ$ to the tangent:
$$\tan\theta = \frac{F_c}{F_t} = \frac{5000.0}{3000.0} = \frac{5}{3} \approx 1.6667$$
$$\theta = \arctan(1.6667) = 59.04^\circ \approx 59.0^\circ\,\text{inward from the forward heading}$$
