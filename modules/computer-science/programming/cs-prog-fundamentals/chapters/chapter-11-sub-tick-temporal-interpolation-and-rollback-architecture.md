# Chapter 11: Sub-Tick Temporal Interpolation & Rollback Architecture

> *"The physical universe computes at the Planck scale, rendering its state instantaneously to the observer. In a digital simulation, physics updates at discrete frequencies while the monitor illuminates the eye at completely arbitrary intervals. Between two physical ticks lies a visual abyss: if we do not mathematically bridge that gap, the smoothest simulation will stutter like a fractured film reel."*

---

### 11.1 The Phenomenon of Temporal Aliasing

In Chapter 10, we established the canonical accumulator pattern: physics runs at an immutable fixed timestep $\Delta t$, while the display renders frames whenever the graphics hardware is ready.

Consider a simulation where:
- Physics runs at 50 Hz ($\Delta t = 20\text{ ms}$).
- The monitor displays at 144 Hz ($\Delta t_{\text{frame}} \approx 6.94\text{ ms}$).

Let us examine what the user's eye perceives if we simply render the **latest computed physics position** $\mathbf{x}_{\text{current}}$ on every render frame:

```
Physics Ticks (50 Hz):   |----- 20ms -----|----- 20ms -----|----- 20ms -----|
State Value:             x = 0.0          x = 1.0          x = 2.0
Render Frames (144 Hz):  ^   ^   ^        ^   ^   ^        ^   ^   ^
Rendered Values:        0.0 0.0 0.0      1.0 1.0 1.0      2.0 2.0 2.0
Visual Displacement:     0   0  1.0       0   0  1.0       0   0  1.0
```

Notice the visual disaster:
- On Render Frame 1, the object is at $x = 0.0$.
- On Render Frame 2 ($6.94\text{ ms}$ later), physics has not stepped; the object is still at $x = 0.0$ (velocity appears to be zero).
- On Render Frame 3 ($13.89\text{ ms}$ later), physics has still not stepped; the object remains at $x = 0.0$.
- On Render Frame 4 ($20.83\text{ ms}$ later), physics has stepped; the object suddenly teleports to $x = 1.0$!

To the human visual cortex, an object moving at a constant speed of $50\text{ m/s}$ appears to stop completely for 2 frames, jerk forward violently on the third frame, stop for 2 frames, and jerk forward again. This phenomenon is known as **Temporal Aliasing** (or **Micro-Stutter / Judder**). The simulation is mathematically perfect, but visually repulsive.

---

### 11.2 Mathematical Formulation of Sub-Tick Interpolation

To achieve perfectly fluid 144 Hz (or 240 Hz) motion from a 50 Hz physics engine, the graphics pipeline must render the entity's position **not at the discrete physics ticks, but at the exact continuous instant of the display frame**.

Recall the state of the accumulator after the consumption loop finishes in Chapter 10:

```c
while (accumulator >= dt) {
    previous_state = current_state;
    current_state = physics_step(current_state, dt);
    accumulator -= dt;
}
```

When this loop terminates, the remaining value in `accumulator` satisfies:

$$0 \le \text{accumulator} < \Delta t$$

This remainder represents the exact amount of real wall-clock time that has elapsed **since the most recent physics tick**!

We define the **Sub-Tick Interpolation Factor** $\alpha$:

$$\alpha = \frac{\text{accumulator}}{\Delta t} \in [0.0, 1.0)$$

```
Previous Physics Tick                          Next Physics Tick
        S_prev                                      S_curr
          |-------------------------------------------|
          |<------------- accumulator --------------->|
          |                      ^
          |                      |
          +---------------- Render Frame (alpha = acc / dt)
```

The rendering state $\mathbf{S}_{\text{render}}$ is computed by the linear blend (LERP) between the previous state $\mathbf{S}_{\text{prev}}$ and the current state $\mathbf{S}_{\text{curr}}$:

$$\mathbf{x}_{\text{render}} = (1 - \alpha) \cdot \mathbf{x}_{\text{prev}} + \alpha \cdot \mathbf{x}_{\text{curr}} = \mathbf{x}_{\text{prev}} + \alpha \cdot (\mathbf{x}_{\text{curr}} - \mathbf{x}_{\text{prev}})$$

#### Why State Interpolation Introduces Exactly One Tick of Latency
Notice that $\mathbf{S}_{\text{prev}}$ corresponds to physics tick $N-1$, and $\mathbf{S}_{\text{curr}}$ corresponds to physics tick $N$.
Because $\alpha \in [0, 1)$, $\mathbf{S}_{\text{render}}$ interpolates between tick $N-1$ and tick $N$.
This means the visual presentation is delayed behind the leading edge of simulation time by at most **one fixed physics tick** ($\Delta t$, typically $16.6\text{ ms}$ or $20.0\text{ ms}$).

#### Interpolation vs. Extrapolation
Could we eliminate this one-tick visual latency by **extrapolating** into the future instead?
Under extrapolation, we project forward from current position using velocity:

$$\mathbf{x}_{\text{extrapolate}} = \mathbf{x}_{\text{curr}} + \mathbf{v}_{\text{curr}} \cdot (\alpha \cdot \Delta t)$$

While extrapolation has zero latency, it is notoriously unstable in interactive physics:
- **The Wall Penetration Artifact:** Suppose a car traveling at $100\text{ km/h}$ is 10 cm from a brick wall at tick $N$. At tick $N+1$, the physics solver will detect contact and bring the car to a dead stop ($v=0$). But during the sub-tick frames between $N$ and $N+1$, extrapolation projects the car forward along its old velocity vector! The car visually plunges deeply into the concrete wall, and then suddenly snaps backward onto the surface when tick $N+1$ arrives.
- **Vibration & Overshoot:** Under rapid elastic bounces or spring oscillations, extrapolation constantly overshoots turning points, causing severe visual jitter.

*Conclusion:* In modern high-end simulation engineering, **Interpolation is unconditionally superior to Extrapolation** because it is mathematically bounded within proven physical states.

---

### 11.3 Rotational Interpolation: SLERP vs. Angle LERP

While translational coordinates $(x, y, z)$ interpolate linearly without difficulty, rotational orientations present non-trivial topological challenges.

#### The 2D Angle Wrap-Around Hazard
In a 2D physics engine, orientation is represented by a single scalar angle $\theta \in [-\pi, \pi]$ or $[0, 2\pi)$.
Suppose a rigid body rotates across the boundary from $\theta_{\text{prev}} = 350^\circ$ ($6.108\text{ rad}$) to $\theta_{\text{curr}} = 10^\circ$ ($0.174\text{ rad}$), having rotated clockwise by $20^\circ$.
A naive linear interpolation at $\alpha = 0.5$ evaluates:

$$\theta_{\text{render}} = (1 - 0.5) \cdot 350^\circ + 0.5 \cdot 10^\circ = 175^\circ + 5^\circ = 180^\circ!$$

Instead of smoothly advancing through $0^\circ$ ($360^\circ$), the object suddenly spins backward by $170^\circ$ across the entire circle in a single frame!

To interpolate angles correctly, we must compute the shortest angular difference:

$$\Delta \theta = ((\theta_{\text{curr}} - \theta_{\text{prev}} + \pi) \bmod 2\pi) - \pi$$

$$\theta_{\text{render}} = \theta_{\text{prev}} + \alpha \cdot \Delta \theta$$

#### 3D Quaternions and SLERP
In 3D simulation, orientations are represented by unit quaternions $\mathbf{q} = (w, x, y, z) \in \mathbb{H}, \|\mathbf{q}\| = 1$.
Linear interpolation of quaternion components does not preserve unit length, causing rotational distortion. The correct formulation is **Spherical Linear Interpolation (SLERP)**:

$$\text{SLERP}(\mathbf{q}_0, \mathbf{q}_1; \alpha) = \frac{\sin((1 - \alpha)\Omega)}{\sin \Omega} \mathbf{q}_0 + \frac{\sin(\alpha \Omega)}{\sin \Omega} \mathbf{q}_1$$

Where $\cos \Omega = \mathbf{q}_0 \cdot \mathbf{q}_1$. SLERP guarantees constant angular velocity along the geodesic arc of the 4D hypersphere.

---

### 11.4 Rollback Architecture & Time-Travel Mechanics

In multi-agent simulation, network multiplayer (the GGPO netcode model), and forensic scientific computing, the simulation must possess the ability to **travel backward in time**.

```
+-------------------------------------------------------------------------+
|                  THE CIRCULAR RING-BUFFER ROLLBACK ENGINE               |
+-------------------------------------------------------------------------+
|                                                                         |
|  Ring Buffer Slots [0 ... K-1]:                                         |
|  +--------+--------+--------+--------+--------+--------+--------+       |
|  | Tick 94| Tick 95| Tick 96| Tick 97| Tick 98| Tick 99|Tick 100| ...   |
|  +--------+--------+--------+--------+--------+--------+--------+       |
|                                                    ^                    |
|                                                    | Current Tick       |
|                                                                         |
|  1. Delayed Packet Arrives: "Player 2 pressed FIRE at Tick 96"           |
|  2. REWIND: Restore State Snapshot from Slot(96)                        |
|  3. MUTATE: Inject historical input into Tick 96                        |
|  4. RE-SIMULATE: Advance physics from Tick 96 -> 97 -> 98 -> 99 -> 100  |
|  5. CONTINUE: Render corrected present state                            |
|                                                                         |
+-------------------------------------------------------------------------+
```

#### Why Rollback Supersedes Input Delay
In traditional networked simulations, if network latency between two clients is $100\text{ ms}$, the engine artificially delays local user inputs by $100\text{ ms}$ before executing them. This feels sluggish, unresponsive, and unplayable.

Under **Rollback Netcode**:
1. When the local user presses an input at tick $N$, the engine applies it **immediately** on tick $N$. The game feels instantaneous (zero input lag).
2. The engine speculates that remote entities will continue their previous inputs.
3. At tick $N + 4$, a delayed network packet arrives revealing that Remote Agent B turned left at tick $N$.
4. The engine executes a **Rollback**:
   - It reloads the recorded state snapshot $\mathbf{S}_N$ from a circular ring buffer.
   - It injects Agent B's verified turn input into tick $N$.
   - It re-simulates ticks $N \to N+1 \to N+2 \to N+3 \to N+4$ in a fraction of a millisecond.
   - It updates the present state $\mathbf{S}_{N+4}$.

Because a headless physics step takes only a few microseconds, re-simulating 4 to 8 ticks takes less than $0.1\text{ ms}$—completely invisible to the user!

#### The Circular Snapshot Ring Buffer
To make rollback computationally viable, we cannot allocate memory on the heap every tick (`malloc` / `new`). Allocating thousands of objects per second triggers garbage collection pauses that destroy frame rates.

Instead, the engine pre-allocates a static **Circular Ring Buffer** of size $K$ (e.g., $K = 128$ ticks, providing $\approx 2.13$ seconds of rollback history at 60 Hz):

$$\text{Slot Index} = \text{tick} \bmod K$$

Each slot holds a contiguous block of flat memory (or a typed array) representing the entire physical state vector $\mathbf{S}$. Storing a snapshot is a single contiguous block copy (`memcpy` in C/C++, or `.set()` on a `Float64Array` in JavaScript/TypeScript):

$$\text{snapshots}[\text{tick} \bmod K].\text{set}(\text{currentStateBuffer})$$

Restoring state is equally instantaneous:

$$\text{currentStateBuffer}.\text{set}(\text{snapshots}[\text{targetTick} \bmod K])$$

---

### 11.5 Time-Travel Debugging in Simulation Workflows

Rollback architecture is not merely for multiplayer games; it is an extraordinary tool for scientific modeling and debugging:
1. **Deterministic Instant Replay:** An unexpected collision anomaly occurs at $t = 42.5\text{ s}$. The scientist hits a key: the engine rewinds to $t = 40.0\text{ s}$, plays forward at $10\%$ slow motion, visualizes contact normals, and exports state vectors at every microsecond.
2. **Bifurcation Testing (Counterfactual Analysis):** A simulation can pause at tick $N$, clone the snapshot into two parallel branches, apply a perturbation $\delta \mathbf{F}$ to Branch B, and simulate both forward simultaneously to observe whether the dynamic system diverges chaotically.

---

### 11.6 Ten In-Depth Progressive Worked Examples

#### Example 11.1: Sub-Tick Interpolation Factor Calculation
*Scenario:* A physics engine runs at $\Delta t = 20.0\text{ ms}$ ($50\text{ Hz}$). The display loop executes at an arbitrary high-refresh rate. At a given render frame, the high-resolution timer measures an elapsed time of $54.6\text{ ms}$ since the start of the previous render frame. The initial accumulator had a residual of $8.2\text{ ms}$.
Calculate:
1. The total time in the accumulator before consumption.
2. The number of fixed physics steps executed during this frame.
3. The residual accumulator value after consumption.
4. The exact sub-tick interpolation factor $\alpha$.

*Step 1: Total accumulator:*
$$\text{acc}_{\text{total}} = 8.2\text{ ms} + 54.6\text{ ms} = 62.8\text{ ms}$$

*Step 2: Number of physics steps:*
$$N_{\text{steps}} = \left\lfloor \frac{62.8\text{ ms}}{20.0\text{ ms}} \right\rfloor = 3\text{ steps}$$

*Step 3: Residual accumulator:*
$$\text{acc}_{\text{residual}} = 62.8\text{ ms} - (3 \times 20.0\text{ ms}) = 62.8 - 60.0 = 2.8\text{ ms}$$

*Step 4: Interpolation factor $\alpha$:*
$$\alpha = \frac{\text{acc}_{\text{residual}}}{\Delta t} = \frac{2.8\text{ ms}}{20.0\text{ ms}} = 0.140$$

*Interpretation:* The render frame will display a blend that is $14.0\%$ of the way from the previous physics tick toward the latest physics tick.

---

#### Example 11.2: 1D Position Linear Interpolation
*Scenario:* A particle moves along the $x$-axis.
- At physics tick $N-1$ ($t = 0.080\text{ s}$), position $x_{\text{prev}} = 14.20\text{ m}$.
- At physics tick $N$ ($t = 0.100\text{ s}$), position $x_{\text{curr}} = 15.60\text{ m}$.
If the render frame occurs with interpolation factor $\alpha = 0.35$, calculate the rendered position $x_{\text{render}}$ and verify the physical displacement.

*Step 1: Apply linear interpolation formula:*
$$x_{\text{render}} = (1 - \alpha) \cdot x_{\text{prev}} + \alpha \cdot x_{\text{curr}}$$
$$1 - \alpha = 1 - 0.35 = 0.65$$
$$x_{\text{render}} = 0.65 \times 14.20\text{ m} + 0.35 \times 15.60\text{ m}$$
$$x_{\text{render}} = 9.230\text{ m} + 5.460\text{ m} = 14.690\text{ m}$$

*Step 2: Alternative displacement check:*
$$\Delta x = x_{\text{curr}} - x_{\text{prev}} = 15.60 - 14.20 = 1.40\text{ m}$$
$$x_{\text{render}} = x_{\text{prev}} + \alpha \cdot \Delta x = 14.20 + 0.35 \times 1.40 = 14.20 + 0.49 = 14.690\text{ m}$$
Exact match.

---

#### Example 11.3: Visual Comparison: Aliasing Stutter vs. Smooth Interpolation
*Scenario:* A projectile moves at a constant velocity of $v = 100\text{ m/s}$. Physics updates at 50 Hz ($\Delta t = 20\text{ ms}$, $\Delta x = 2.0\text{ m/step}$). The display refreshes at 100 Hz ($t_k = 0, 10, 20, 30, 40\text{ ms}$).
Tabulate the positions displayed across the first 5 render frames under:
1. No interpolation (rendering raw $x_{\text{curr}}$).
2. Sub-tick linear interpolation.

*Step 1: Physics ticks:*
- $t = 0\text{ ms}$: Tick 0, $x_0 = 0.0\text{ m}$.
- $t = 20\text{ ms}$: Tick 1, $x_1 = 2.0\text{ m}$.
- $t = 40\text{ ms}$: Tick 2, $x_2 = 4.0\text{ m}$.

*Step 2: Render Frames:*
- **Frame 0 ($t = 0\text{ ms}$):**
  - $\text{acc} = 0\text{ ms}$, $\alpha = 0.0$.
  - Raw: $x_{\text{curr}} = 0.0\text{ m}$.
  - Interpolated: $x = (1 - 0) \cdot 0 + 0 \cdot 0 = 0.0\text{ m}$.
- **Frame 1 ($t = 10\text{ ms}$):**
  - $\text{acc} = 10\text{ ms} < 20 \implies 0$ steps. $\alpha = \frac{10}{20} = 0.5$.
  - Raw: $x_{\text{curr}} = 0.0\text{ m}$ (Stutter: object stopped!).
  - Interpolated: $x = (1 - 0.5) \cdot 0.0 + 0.5 \cdot 2.0 = 1.0\text{ m}$.
- **Frame 2 ($t = 20\text{ ms}$):**
  - $\text{acc} = 20\text{ ms} \implies 1$ step ($x_{\text{prev}} = 0.0, x_{\text{curr}} = 2.0$). Remainder $\text{acc} = 0$, $\alpha = 0.0$.
  - Raw: $x_{\text{curr}} = 2.0\text{ m}$ (Teleport: jumped $2.0\text{ m}$ in $10\text{ ms}$!).
  - Interpolated: $x = (1 - 0.0) \cdot 0.0 + 0.0 \cdot 2.0 = 2.0\text{ m}$ (Wait: delayed by 1 tick).
    *(Note: Using buffered 1-tick delay: $x_{\text{prev}} = 0, x_{\text{curr}} = 2.0 \implies 2.0\text{ m}$).*
- **Frame 3 ($t = 30\text{ ms}$):**
  - $\text{acc} = 10\text{ ms}$, $\alpha = 0.5$.
  - Raw: $x_{\text{curr}} = 2.0\text{ m}$ (Stutter: stopped again).
  - Interpolated: $x = (1 - 0.5) \cdot 2.0 + 0.5 \cdot 4.0 = 3.0\text{ m}$.
- **Frame 4 ($t = 40\text{ ms}$):**
  - Raw: $x_{\text{curr}} = 4.0\text{ m}$.
  - Interpolated: $x = 4.0\text{ m}$.

*Comparison:*
- Raw sequence: `0.0, 0.0, 2.0, 2.0, 4.0` (Stutter, jump, stutter, jump).
- Interpolated sequence: `0.0, 1.0, 2.0, 3.0, 4.0` (Perfect, silky-smooth constant velocity).

---

#### Example 11.4: 2D Angular Shortest-Path Interpolation
*Scenario:* A rotating compass needle has orientations $\theta_{\text{prev}} = 350^\circ$ and $\theta_{\text{curr}} = 20^\circ$. Interpolate the orientation at $\alpha = 0.25$ using shortest-path modular arithmetic.

*Step 1: Convert angles to radians:*
$\theta_{\text{prev}} = 350^\circ \times \frac{\pi}{180^\circ} \approx 6.10865\text{ rad}$.
$\theta_{\text{curr}} = 20^\circ \times \frac{\pi}{180^\circ} \approx 0.34907\text{ rad}$.

*Step 2: Calculate direct angular difference:*
$$\Delta \theta_{\text{raw}} = \theta_{\text{curr}} - \theta_{\text{prev}} = 20^\circ - 350^\circ = -330^\circ$$

*Step 3: Wrap to $[-\pi, \pi]$ ($[-180^\circ, 180^\circ]$):*
$$\Delta \theta = ((-330^\circ + 180^\circ) \bmod 360^\circ) - 180^\circ$$
$$-330 + 180 = -150^\circ$$
$$-150^\circ \bmod 360^\circ = +210^\circ \implies 210^\circ - 180^\circ = +30^\circ$$
The shortest angular path is a clockwise rotation of $+30^\circ$.

*Step 4: Compute interpolated angle at $\alpha = 0.25$:*
$$\theta_{\text{render}} = \theta_{\text{prev}} + \alpha \cdot \Delta \theta = 350^\circ + 0.25 \times 30^\circ = 350^\circ + 7.5^\circ = 357.5^\circ$$
Wrap modulo $360^\circ$: $357.5^\circ$.

*Sanity Check:* At $\alpha = 0.25$, the needle has moved $7.5^\circ$ past $350^\circ$, smoothly approaching $360^\circ/0^\circ$.

---

#### Example 11.5: Extrapolation Overshoot Failure During Elastic Impact
*Scenario:* A ball with radius $r = 0.1\text{ m}$ travels downward toward a rigid floor at $y = 0.0\text{ m}$.
- At tick $N-1$ ($t = 0.00\text{ s}$), position $y = 0.40\text{ m}$, velocity $v = -10.0\text{ m/s}$.
- At tick $N$ ($t = 0.02\text{ s}$), the collision occurs. The physics solver detects contact, applies an elastic restitution impulse ($e = 1.0$), resulting in position $y = 0.20\text{ m}$ and rebound velocity $v = +10.0\text{ m/s}$.
Suppose a render frame occurs between tick $N-1$ and tick $N$ at $\alpha = 0.75$.
Compare the rendered position under:
1. Linear Interpolation between tick $N-1$ and tick $N$.
2. Linear Extrapolation projecting forward from tick $N-1$.

*Step 1: Compute Linear Interpolation:*
$$y_{\text{interp}} = (1 - 0.75) \cdot y_{\text{prev}} + 0.75 \cdot y_{\text{curr}}$$
$$y_{\text{interp}} = 0.25 \times 0.40\text{ m} + 0.75 \times 0.20\text{ m} = 0.10\text{ m} + 0.15\text{ m} = 0.25\text{ m}$$
Since the ball surface is at $y - r = 0.25 - 0.10 = 0.15\text{ m} > 0$, the ball is cleanly above the floor.

*Step 2: Compute Linear Extrapolation:*
$$y_{\text{extrap}} = y_{\text{prev}} + v_{\text{prev}} \cdot (\alpha \cdot \Delta t)$$
$$y_{\text{extrap}} = 0.40\text{ m} + (-10.0\text{ m/s}) \cdot (0.75 \times 0.02\text{ s}) = 0.40 - 10.0 \times 0.015 = 0.40 - 0.15 = 0.25\text{ m}$$
Now consider what happens at $\alpha = 1.5$ (extrapolating past tick $N-1$ before tick $N$ finishes computing):
$$y_{\text{extrap}}(1.5) = 0.40 - 10.0 \times 0.03 = 0.10\text{ m}$$
Ball bottom $= 0.10 - 0.10 = 0.0\text{ m}$.
If $\Delta t = 0.05\text{ s}$, extrapolation pushes the ball deep into negative coordinates ($y = -0.10\text{ m}$), visibly sinking into the ground!

---

#### Example 11.6: Circular Ring Buffer Indexing
*Scenario:* A rollback engine allocates a circular snapshot buffer of size $K = 64$ slots.
1. Determine the memory slot index for tick $n = 150$.
2. Determine the memory slot index for tick $n = 213$.
3. If the current tick is $n = 213$, what is the oldest historical tick still preserved in the buffer?
4. Can the engine roll back to tick $n = 145$?

*Step 1: Slot for tick 150:*
$$\text{Slot} = 150 \bmod 64 = 150 - (2 \times 64) = 150 - 128 = 22$$

*Step 2: Slot for tick 213:*
$$\text{Slot} = 213 \bmod 64 = 213 - (3 \times 64) = 213 - 192 = 21$$

*Step 3: Oldest preserved tick:*
A buffer of size $K = 64$ preserves the current tick and the preceding $K - 1 = 63$ ticks:
$$\text{Oldest Tick} = n - (K - 1) = 213 - 63 = 150$$

*Step 4: Check if tick 145 is valid:*
Since $145 < 150$, tick 145 was overwritten 5 ticks ago (at tick 209). The engine **cannot** roll back to tick 145; doing so would read corrupted data from tick 209.

---

#### Example 11.7: Re-Simulation CPU Cost Under GGPO Rollback
*Scenario:* A 2D physics simulation runs at 60 Hz ($\Delta t = 16.67\text{ ms}$). A single physics step takes $t_{\text{step}} = 12\ \mu\text{s}$ ($0.012\text{ ms}$) on modern hardware.
A delayed network packet arrives with an input timestamp that is 5 ticks behind the current simulation time ($n_{\text{current}} = 105$, $n_{\text{input}} = 100$).
Calculate:
1. The number of physics ticks that must be re-simulated.
2. The total CPU time required to restore the snapshot and re-simulate to tick 105.
3. The percentage of a single 16.67 ms frame budget consumed by this rollback.

*Step 1: Number of re-simulation ticks:*
Ticks to simulate: $100 \to 101 \to 102 \to 103 \to 104 \to 105$.
Total steps = $105 - 100 = 5\text{ steps}$.

*Step 2: Total CPU time:*
Snapshot restore time (memory copy of 10 KB): $\approx 0.5\ \mu\text{s}$.
Computation time for 5 steps:
$$T_{\text{re-sim}} = 5 \times 12\ \mu\text{s} = 60\ \mu\text{s} = 0.060\text{ ms}$$
Total time:
$$T_{\text{total}} = 0.060\text{ ms} + 0.0005\text{ ms} \approx 0.0605\text{ ms}$$

*Step 3: Fraction of frame budget:*
$$\text{Budget Fraction} = \frac{0.0605\text{ ms}}{16.667\text{ ms}} \times 100\% \approx 0.363\%$$

*Conclusion:* The entire rollback and 5-tick re-simulation takes **less than 1% of a single frame's budget**! To the user, there is zero frame drop or hesitation.

---

#### Example 11.8: Snapshot State Vector Serialization Sizing
*Scenario:* An engine stores 1,000 rigid bodies. Each body has:
- Position: $(x, y)$ (2 `Float64` = 16 bytes)
- Velocity: $(v_x, v_y)$ (2 `Float64` = 16 bytes)
- Orientation: $\theta$ (1 `Float64` = 8 bytes)
- Angular Velocity: $\omega$ (1 `Float64` = 8 bytes)
- Active Flag & Flags: (1 `Uint32` = 4 bytes + 4 bytes padding = 8 bytes)
Total per body = 56 bytes.
The PRNG state requires 16 bytes.
Global simulation counters require 16 bytes.
1. Calculate the exact byte size of one complete simulation state snapshot.
2. If the ring buffer holds 128 snapshots, calculate the total memory consumed.

*Step 1: Single snapshot size:*
$$\text{Bodies Size} = 1,000 \times 56\text{ bytes} = 56,000\text{ bytes}$$
$$\text{Global Metadata} = 16 + 16 = 32\text{ bytes}$$
$$\text{Total Snapshot Size} = 56,032\text{ bytes} \approx 54.72\text{ KB}$$

*Step 2: Ring buffer memory footprint:*
$$\text{Total RAM} = 128 \times 56,032\text{ bytes} = 7,172,096\text{ bytes} \approx 7.17\text{ MB}$$

*Engineering Sanity Check:* Holding over 2 seconds of high-fidelity physical history for 1,000 interacting bodies requires only **7.17 megabytes of RAM**—a microscopic footprint well within the L3 cache of modern CPUs!

---

#### Example 11.9: Quaternion SLERP Step-by-Step Calculation
*Scenario:* Two 3D orientations are given by quaternions $\mathbf{q}_0 = (1, 0, 0, 0)$ (identity rotation) and $\mathbf{q}_1 = (0.707107, 0.707107, 0, 0)$ (a $90^\circ$ rotation about the $X$-axis). Compute the interpolated quaternion at $\alpha = 0.5$.

*Step 1: Compute dot product $\cos \Omega$:*
$$\cos \Omega = \mathbf{q}_0 \cdot \mathbf{q}_1 = (1)(0.707107) + (0)(0.707107) + (0)(0) + (0)(0) = 0.707107$$

*Step 2: Determine angle $\Omega$:*
$$\Omega = \arccos(0.707107) = \frac{\pi}{4}\text{ rad} = 45^\circ$$
$$\sin \Omega = \sin(45^\circ) = \frac{\sqrt{2}}{2} \approx 0.707107$$

*Step 3: Evaluate SLERP weights at $\alpha = 0.5$:*
$$w_0 = \frac{\sin((1 - 0.5)\Omega)}{\sin \Omega} = \frac{\sin(0.5 \times 45^\circ)}{\sin(45^\circ)} = \frac{\sin(22.5^\circ)}{0.707107} \approx \frac{0.382683}{0.707107} \approx 0.541196$$
$$w_1 = \frac{\sin(0.5 \times 45^\circ)}{\sin(45^\circ)} \approx 0.541196$$

*Step 4: Compute blended components:*
$$\mathbf{q}_{\text{slerp}} = 0.541196 \cdot (1, 0, 0, 0) + 0.541196 \cdot (0.707107, 0.707107, 0, 0)$$
$$w = 0.541196 \times 1 + 0.541196 \times 0.707107 = 0.541196 + 0.382683 = 0.923879$$
$$x = 0 + 0.541196 \times 0.707107 = 0.382683$$
$$y = 0, \quad z = 0$$
$$\mathbf{q}_{\text{slerp}} = (0.923879, 0.382683, 0, 0)$$

*Step 5: Verify unit length and physical angle:*
$$\|\mathbf{q}\| = \sqrt{0.923879^2 + 0.382683^2} = \sqrt{0.853553 + 0.146446} = \sqrt{1.00000} = 1.0$$
Rotation angle:
$$\theta = 2 \arccos(w) = 2 \arccos(0.923879) = 2 \times (22.5^\circ) = 45.0^\circ$$
The rotation is exactly half of the $90^\circ$ target rotation!

---

#### Example 11.10: Complete TypeScript Rollback Snapshot Ring Buffer
*Scenario:* Write a production-grade TypeScript class `SnapshotRingBuffer` that manages pre-allocated `Float64Array` state vectors, supporting recording, instant rollback restoration, and circular slot mapping.

```typescript
export class SnapshotRingBuffer {
  public readonly capacity: number;
  public readonly stateSize: number;
  
  private bufferPool: Float64Array[];
  private tickIndices: Int32Array;

  constructor(capacity: number = 128, stateSize: number = 64) {
    this.capacity = capacity;
    this.stateSize = stateSize;

    // Pre-allocate all memory upfront: Zero GC overhead during simulation
    this.bufferPool = new Array(capacity);
    for (let i = 0; i < capacity; i++) {
      this.bufferPool[i] = new Float64Array(stateSize);
    }
    this.tickIndices = new Int32Array(capacity).fill(-1);
  }

  /**
   * Saves currentState into the ring buffer at the given tick index.
   */
  public saveSnapshot(tick: number, currentState: Float64Array): void {
    const slot = tick % this.capacity;
    this.bufferPool[slot].set(currentState);
    this.tickIndices[slot] = tick;
  }

  /**
   * Restores historical state for targetTick into destinationState.
   * Returns true if successful, false if tick was overwritten.
   */
  public restoreSnapshot(targetTick: number, destinationState: Float64Array): boolean {
    const slot = targetTick % this.capacity;
    if (this.tickIndices[slot] !== targetTick) {
      // Historical state has been overwritten or was never recorded
      return false;
    }
    destinationState.set(this.bufferPool[slot]);
    return true;
  }
}
```

---

### 11.7 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 11.1 – 11.2)

##### Exercise 11.1
Explain the physical cause of **temporal aliasing** (micro-stutter) when a 60 Hz physics simulation is displayed on a 144 Hz gaming monitor without state interpolation.

##### Exercise 11.2
Define the sub-tick interpolation factor $\alpha$. What physical quantity does $\alpha$ measure, and why is its range strictly bounded to $[0.0, 1.0)$?

---

#### Tier 2: Linear & Rotational Interpolation (Exercises 11.3 – 11.4)

##### Exercise 11.3
A vehicle moves in 2D with positions $\mathbf{p}_{\text{prev}} = (10.0\text{ m}, 25.0\text{ m})$ and $\mathbf{p}_{\text{curr}} = (12.4\text{ m}, 28.6\text{ m})$.
If the display loop renders at $\alpha = 0.60$, calculate the rendered 2D position $\mathbf{p}_{\text{render}}$.

##### Exercise 11.4
A turntable rotates through angles $\theta_{\text{prev}} = 3.10\text{ rad}$ and $\theta_{\text{curr}} = -3.10\text{ rad}$ (wrapping around the $\pm \pi$ boundary).
1. What happens if a naive linear interpolation formula is applied at $\alpha = 0.5$?
2. What is the correct interpolated angle using shortest-path wrapping?

---

#### Tier 3: Interpolation vs. Extrapolation (Exercises 11.5 – 11.6)

##### Exercise 11.5
Explain why sub-tick state interpolation introduces exactly one physics tick of visual display latency. Why is this latency acceptable in modern graphics pipelines?

##### Exercise 11.6
A high-speed projectile moves toward a wall at $v = 500\text{ m/s}$. At tick $N-1$, it is $2.0\text{ m}$ from the wall. At tick $N$ ($\Delta t = 0.010\text{ s}$), it impacts the wall and stops ($x_{\text{curr}} = \text{wall}$).
Explain what visual anomaly occurs if the engine uses linear extrapolation to predict positions between tick $N-1$ and tick $N$.

---

#### Tier 4: Rollback & Ring Buffer Architecture (Exercises 11.7 – 11.8)

##### Exercise 11.7
A simulation engine uses a circular ring buffer of size $K = 120$ slots running at 60 Hz.
1. What is the maximum rollback time window in seconds?
2. If the current tick is 350, calculate the slot index for tick 350 and the oldest valid tick available for rollback.

##### Exercise 11.8
In a peer-to-peer multiplayer simulation using GGPO rollback, Client A receives an input packet from Client B timestamped at tick $T_{\text{past}} = 88$. The current simulation tick on Client A is $T_{\text{now}} = 94$. Detail the exact step-by-step sequence of operations executed by Client A's simulation engine to resolve this packet.

---

#### Tier 5: Forensic Systems & Memory Optimization (Exercises 11.9 – 11.10)

##### Exercise 11.9
A physics engine simulates 5,000 particles. Each particle requires 32 bytes of state. The engine maintains a 256-tick rollback ring buffer.
1. Calculate the total memory footprint in megabytes.
2. If memory bandwidth to L3 cache is $200\text{ GB/s}$, calculate the time required to perform a bulk memory copy (`memcpy`) to restore one snapshot.

##### Exercise 11.10
Prove mathematically that if a particle moves under constant acceleration $\mathbf{a}$, linear interpolation between physics ticks introduces a spatial truncation error bounded by $E \le \frac{1}{8} \|\mathbf{a}\| \Delta t^2$.

---

### 11.8 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 11.1
Temporal aliasing occurs because the display refresh cycles and the physics update cycles are asynchronous and non-integer multiples of one another.
At 60 Hz physics, state updates occur every $\Delta t_{\text{phys}} = 16.67\text{ ms}$.
At 144 Hz display, render frames occur every $\Delta t_{\text{render}} = 6.94\text{ ms}$.
Because $16.67 / 6.94 \approx 2.4$, there are alternating stretches where the display renders 2 consecutive frames, then 3 consecutive frames between physics updates:
- During frames where no physics update occurred, the entity's position is unchanged ($\Delta x = 0$).
- On the frame immediately following a physics update, the entity's position jumps by the full physics step ($\Delta x = v \cdot \Delta t$).
The eye tracks continuous velocity. When presented with alternating zero-motion and sudden jumps, the visual cortex registers judder, stutter, and blur.

---

#### Solution to Exercise 11.2
*Definition:* The sub-tick interpolation factor $\alpha$ is the normalized fraction of the current physics tick that has elapsed in real wall-clock time:

$$\alpha = \frac{\text{accumulator}}{\Delta t}$$

*Physical Quantity:* $\alpha$ measures the continuous temporal phase of the rendering instant within the current discrete physics interval $[t_n, t_{n+1})$.

*Bounds $[0.0, 1.0)$:*
- When the consumption loop finishes, `accumulator < dt` (otherwise another step would execute). Therefore, $\text{accumulator} / \Delta t < 1.0$.
- Since wall-clock time is non-negative, $\text{accumulator} \ge 0.0$. Thus, $\alpha \in [0.0, 1.0)$.

---

#### Solution to Exercise 11.3
Given $\mathbf{p}_{\text{prev}} = (10.0, 25.0)$, $\mathbf{p}_{\text{curr}} = (12.4, 28.6)$, $\alpha = 0.60$.
Using linear interpolation:
$$\mathbf{p}_{\text{render}} = (1 - \alpha) \mathbf{p}_{\text{prev}} + \alpha \mathbf{p}_{\text{curr}}$$
- $X$-coordinate:
  $$x_{\text{render}} = (1 - 0.60)(10.0) + (0.60)(12.4) = 0.40(10.0) + 0.60(12.4) = 4.0 + 7.44 = 11.44\text{ m}$$
- $Y$-coordinate:
  $$y_{\text{render}} = (1 - 0.60)(25.0) + (0.60)(28.6) = 0.40(25.0) + 0.60(28.6) = 10.0 + 17.16 = 27.16\text{ m}$$

Result: $\mathbf{p}_{\text{render}} = (11.44\text{ m}, 27.16\text{ m})$.

---

#### Solution to Exercise 11.4
*Part 1: Naive Interpolation:*
$$\theta_{\text{naive}} = (1 - 0.5)(3.10) + 0.5(-3.10) = 1.55 - 1.55 = 0.00\text{ rad}$$
Instead of rotating by $0.083\text{ rad}$ across the $\pi / -\pi$ boundary, the needle erroneously swings all the way through $0.0\text{ rad}$ (the opposite side of the circle), creating a massive visual glitch!

*Part 2: Correct Shortest-Path Interpolation:*
$$\Delta \theta = ((\theta_{\text{curr}} - \theta_{\text{prev}} + \pi) \bmod 2\pi) - \pi$$
$$\theta_{\text{curr}} - \theta_{\text{prev}} = -3.10 - 3.10 = -6.20\text{ rad}$$
$$-6.20 + \pi \approx -6.20 + 3.14159 = -3.05841\text{ rad}$$
Modulo $2\pi$:
$$-3.05841 \bmod 2\pi = 3.22477\text{ rad}$$
Subtract $\pi$:
$$\Delta \theta = 3.22477 - 3.14159 = +0.08318\text{ rad}$$
Interpolate:
$$\theta_{\text{render}} = \theta_{\text{prev}} + \alpha \cdot \Delta \theta = 3.10 + 0.5(0.08318) = 3.10 + 0.04159 = 3.14159\text{ rad} = \pi\text{ rad}$$
The turntable smoothly passes through the exact boundary at $\pi\text{ rad}$ ($180^\circ$).

---

#### Solution to Exercise 11.5
*Why 1-Tick Latency Exists:*
To interpolate smoothly, the engine must know both the starting state $\mathbf{S}_{\text{prev}}$ (at tick $N-1$) and the destination state $\mathbf{S}_{\text{curr}}$ (at tick $N$). Therefore, when rendering at continuous time $t \in [t_{N-1}, t_N)$, the graphics pipeline is presenting a state that is between 0 and $\Delta t$ seconds in the past relative to the leading edge of simulation calculation.

*Why It Is Acceptable:*
At 60 Hz, $\Delta t = 16.67\text{ ms}$. Human visual reaction time is approximately $150 - 250\text{ ms}$. A display delay of $16.67\text{ ms}$ is completely imperceptible to the human eye, whereas the alternative (temporal aliasing stutter or extrapolation overshoot) is immediately glaring and disruptive.

---

#### Solution to Exercise 11.6
At tick $N-1$, the projectile is at $x = -2.0\text{ m}$ traveling toward the wall at $x = 0.0\text{ m}$ with velocity $v = 500\text{ m/s}$.
The step size is $\Delta t = 0.010\text{ s}$.
If extrapolation is used between $N-1$ and $N$ at $\alpha = 0.8$:
$$x_{\text{extrap}} = x_{\text{prev}} + v_{\text{prev}} \cdot (\alpha \cdot \Delta t) = -2.0 + 500 \cdot (0.8 \times 0.010) = -2.0 + 4.0 = +2.0\text{ m}$$
The projectile is rendered **2 meters inside or behind the wall**!
Then, when tick $N$ arrives, the physics engine stops the projectile at $x = 0.0\text{ m}$. The projectile visually leaps backward out of the wall! This unsightly "penetration-and-snap" artifact ruins the visual fidelity of physical impacts.

---

#### Solution to Exercise 11.7
*Part 1: Maximum Rollback Window:*
$$\text{Window} = \frac{K - 1}{\text{Hz}} = \frac{119}{60\text{ Hz}} \approx 1.983\text{ seconds}$$

*Part 2: Slot Index and Oldest Valid Tick:*
Current tick $n = 350$.
$$\text{Slot Index} = 350 \bmod 120 = 350 - (2 \times 120) = 350 - 240 = 110$$
Oldest valid tick:
$$T_{\text{oldest}} = 350 - (120 - 1) = 350 - 119 = 231$$
Any rollback request for ticks $231 \le T \le 350$ can be fulfilled safely.

---

#### Solution to Exercise 11.8
When Client A receives input for tick 88 at tick 94:
1. **Pause & Save:** Current presentation paused; tick delta $k = 94 - 88 = 6$ ticks.
2. **Snapshot Restore:** Locate slot $88 \bmod K$. Copy state snapshot $\mathbf{S}_{88}$ into the active simulation state buffer.
3. **Input Injection:** Overwrite the historical input table at tick 88 with Client B's verified input packet.
4. **Fast Re-Simulation Loop:**
   - Execute $\mathbf{S}_{89} = \text{PhysicsStep}(\mathbf{S}_{88}, \mathbf{I}_{88}, \Delta t)$; update snapshot 89.
   - Execute $\mathbf{S}_{90} = \text{PhysicsStep}(\mathbf{S}_{89}, \mathbf{I}_{89}, \Delta t)$; update snapshot 90.
   - Execute $\mathbf{S}_{91} = \text{PhysicsStep}(\mathbf{S}_{90}, \mathbf{I}_{90}, \Delta t)$; update snapshot 91.
   - Execute $\mathbf{S}_{92} = \text{PhysicsStep}(\mathbf{S}_{91}, \mathbf{I}_{91}, \Delta t)$; update snapshot 92.
   - Execute $\mathbf{S}_{93} = \text{PhysicsStep}(\mathbf{S}_{92}, \mathbf{I}_{92}, \Delta t)$; update snapshot 93.
   - Execute $\mathbf{S}_{94} = \text{PhysicsStep}(\mathbf{S}_{93}, \mathbf{I}_{93}, \Delta t)$; update snapshot 94.
5. **Resume Rendering:** Present corrected interpolated state for tick 94.

---

#### Solution to Exercise 11.9
*Part 1: Memory Footprint:*
Per snapshot size:
$$\text{Snapshot Size} = 5,000 \times 32\text{ bytes} = 160,000\text{ bytes} = 160\text{ KB}$$
Total for 256 snapshots:
$$\text{Total RAM} = 256 \times 160,000\text{ bytes} = 40,960,000\text{ bytes} \approx 40.96\text{ MB}$$

*Part 2: Restore Memory Copy Latency:*
Restoring one snapshot copies $160\text{ KB} = 1.6 \times 10^5\text{ bytes}$.
At bandwidth $B = 200\text{ GB/s} = 2 \times 10^{11}\text{ bytes/s}$:
$$t_{\text{copy}} = \frac{1.6 \times 10^5\text{ bytes}}{2 \times 10^{11}\text{ bytes/s}} = 8 \times 10^{-7}\text{ seconds} = 0.8\ \mu\text{s}$$
Restoring a full snapshot takes just **800 nanoseconds**, representing virtually zero CPU burden.

---

#### Solution to Exercise 11.10
*Proof of Linear Interpolation Error Bound:*
Let a particle move under constant acceleration $\mathbf{a}$. Its exact physical position at continuous time $t \in [0, \Delta t]$ is:
$$\mathbf{x}(t) = \mathbf{x}_0 + \mathbf{v}_0 t + \frac{1}{2} \mathbf{a} t^2$$
At the boundary ticks:
- $t = 0 \implies \mathbf{x}_{\text{prev}} = \mathbf{x}_0$
- $t = \Delta t \implies \mathbf{x}_{\text{curr}} = \mathbf{x}_0 + \mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a} \Delta t^2$

Sub-tick linear interpolation with parameter $\alpha = t / \Delta t$ approximates $\mathbf{x}(t)$ by:
$$\mathbf{x}_{\text{interp}}(t) = (1 - \alpha) \mathbf{x}_{\text{prev}} + \alpha \mathbf{x}_{\text{curr}} = \mathbf{x}_0 + \alpha (\mathbf{v}_0 \Delta t + \frac{1}{2} \mathbf{a} \Delta t^2) = \mathbf{x}_0 + \mathbf{v}_0 t + \frac{1}{2} \mathbf{a} t \Delta t$$

The spatial truncation error is:
$$\mathbf{E}(t) = \mathbf{x}_{\text{interp}}(t) - \mathbf{x}(t) = \left( \mathbf{x}_0 + \mathbf{v}_0 t + \frac{1}{2} \mathbf{a} t \Delta t \right) - \left( \mathbf{x}_0 + \mathbf{v}_0 t + \frac{1}{2} \mathbf{a} t^2 \right)$$
$$\mathbf{E}(t) = \frac{1}{2} \mathbf{a} (t \Delta t - t^2) = \frac{1}{2} \mathbf{a} \Delta t^2 (\alpha - \alpha^2)$$

To find the maximum error, differentiate $f(\alpha) = \alpha - \alpha^2$ with respect to $\alpha$:
$$f'(\alpha) = 1 - 2\alpha = 0 \implies \alpha = \frac{1}{2}$$
Maximum value:
$$f\left(\frac{1}{2}\right) = \frac{1}{2} - \frac{1}{4} = \frac{1}{4}$$

Substitute back into the error expression:
$$\|\mathbf{E}_{\text{max}}\| = \frac{1}{2} \|\mathbf{a}\| \Delta t^2 \cdot \frac{1}{4} = \frac{1}{8} \|\mathbf{a}\| \Delta t^2$$
$\blacksquare$

*Significance:* Under Earth gravity ($g = 9.81\text{ m/s}^2$) at 60 Hz ($\Delta t = 0.01667\text{ s}$), the maximum visual deviation of linear interpolation from a true parabolic trajectory is:
$$E_{\text{max}} = \frac{1}{8} \times 9.81 \times (0.01667)^2 \approx 0.00034\text{ m} = 0.34\text{ mm}$$
A deviation of one third of a millimeter is completely invisible on screen, proving that linear interpolation is mathematically and visually sufficient.
