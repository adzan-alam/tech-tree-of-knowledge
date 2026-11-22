# Chapter 10: The Discrete Simulation Loop & The Spiral of Death

> *"Time in physical reality flows continuously, without pause or stutter. In a digital computer, time does not flow at all—it is hammered into discrete chronological slices by the ticking of a quartz crystal. How we meter, accumulate, and consume those slices determines whether a virtual world sings with mathematical harmony or collapses into the catastrophic death spiral."*

---

### 10.1 The Architecture of Time in Computational Physics

Every interactive simulation, game engine, and scientific visualization is fundamentally driven by a loop that repeats indefinitely until the simulation terminates. This master control loop is known as the **Simulation Loop** (or **Game Loop**).

In continuous Newtonian mechanics, the differential equations of motion:

$$\frac{d\mathbf{x}}{dt} = \mathbf{v}(t), \qquad \frac{d\mathbf{v}}{dt} = \frac{\mathbf{F}(t)}{m}$$

assume an infinitesimal time differential $dt \to 0$. A digital computer cannot execute an infinite number of infinitesimal calculations; it must discretize time into finite intervals $\Delta t > 0$, advancing the state vector through discrete ticks $n \in \{0, 1, 2, \dots\}$:

$$\mathbf{x}_{n+1} = \mathbf{x}_n + \mathbf{v}_n \Delta t + \frac{1}{2} \mathbf{a}_n \Delta t^2$$

The fundamental engineering challenge is: **How should the computer correlate the passage of wall-clock time in the physical world ($t_{\text{real}}$) with the advancement of simulation time ($t_{\text{sim}}$)?**

Over the history of computer science, four distinct simulation loop architectures have evolved.

```
+-------------------------------------------------------------------------+
|                  TAXONOMY OF SIMULATION LOOP ARCHITECTURES              |
+-------------------------------------------------------------------------+
|                                                                         |
|  1. Unthrottled Loop:     dt = unmetered (Ties physics to CPU clock)   |
|  2. Variable Delta Loop:  dt = now() - last (Framerate-dependent drift) |
|  3. Locked Step Loop:     Fixed dt with sleep() (Judder & stutter)      |
|  4. Fixed Timestep with                                                 |
|     Accumulator Pattern:  Decoupled Physics & Rendering (Canonical)     |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

### 10.2 The Evolution of the Game Loop

#### Paradigm 1: The Unthrottled Loop (The Silicon Speed Trap)
In the early days of personal computing (such as MS-DOS games in the 1980s), code was executed in a raw, unmetered `while (true)` loop:

```c
// ARCHITECTURAL ANTI-PATTERN: Unthrottled Loop
while (running) {
    process_input();
    update_physics(1.0); // Assume 1 arbitrary unit of time per iteration
    render();
}
```

*The Flaw:* On an Intel 8086 CPU running at 4.77 MHz, the loop executed 30 times per second; the simulation felt natural. But when the user upgraded to an Intel 486 running at 66 MHz, the loop executed 500 times per second! Space Invaders moved at supersonic speed, spacecraft crashed into walls instantaneously, and the program became completely unplayable. The physics was fundamentally married to the CPU's instructions-per-second throughput.

#### Paradigm 2: The Variable Delta-Time Loop (`dt = now - last`)
To make simulations hardware-independent, engineers introduced wall-clock time querying (using system high-resolution timers like `clock_gettime`, `QueryPerformanceCounter`, or `performance.now()`):

```c
// ARCHITECTURAL FLAW: Variable Delta-Time
double last_time = get_current_time();
while (running) {
    double current_time = get_current_time();
    double dt = current_time - last_time;
    last_time = current_time;

    process_input();
    update_physics(dt); // Pass variable dt to integrator
    render();
}
```

If the computer runs at 100 FPS, $\Delta t = 0.010\text{ s}$ ($10\text{ ms}$). If the frame rate drops to 20 FPS (due to background OS load or rendering thousands of shadows), $\Delta t = 0.050\text{ s}$ ($50\text{ ms}$).

##### The Fatal Flaws of Variable Delta-Time
While seemingly intuitive, passing a variable $\Delta t$ to numerical physics integrators is disastrous for three mathematical reasons:
1. **Destruction of Determinism:** Because wall-clock time fluctuates continuously due to OS thread preemption, cache misses, and thermal throttling, no two executions will ever experience the identical sequence of $\Delta t$ values. Replays and network lockstep synchronization become completely impossible.
2. **Symplectic Energy Explosions:** Classical numerical integrators (such as Verlet or Symplectic Euler) conserve energy and maintain stable orbital phase spaces **only when $\Delta t$ remains strictly constant**. When $\Delta t$ fluctuates from tick to tick, the symplectic invariant is broken: stiff springs gain artificial kinetic energy, orbits spiral out of control, and constraints violently explode.
3. **Tunneling and Collision Penetration:** When the framerate suddenly drops (e.g., when loading a new level or when a GC pause occurs), $\Delta t$ spikes to a massive value (e.g., $\Delta t = 0.250\text{ s}$). A fast-moving particle with velocity $v = 100\text{ m/s}$ travels $\Delta x = 100 \times 0.250 = 25\text{ m}$ in a single step! It leaps completely through a $0.5\text{ m}$ concrete barrier without the collision detection algorithm ever registering contact.

```
Variable dt Collision Tunneling:
Frame N:          [Particle] ------------>                        | Wall |
Frame N+1 (Lag):                                [Particle] (Tunnel)| Wall |
(The collision was never evaluated because dt was too large!)
```

---

### 10.3 The Canonical Solution: Fixed Timestep with Accumulator

In 2004, physics programmer Glenn Fiedler published the definitive architectural formulation for real-time physics: *"Fix Your Timestep!"*

The foundational insight of the accumulator pattern is that **Physics Time and Rendering Time are two completely independent physical dimensions**:
- **Simulation Time:** Must advance in strict, immutable, fixed increments ($\Delta t_{\text{fixed}}$, typically $\frac{1}{60}\text{ s} \approx 16.666\text{ ms}$ or $\frac{1}{50}\text{ s} = 20.0\text{ ms}$) to ensure 100% numerical stability and determinism.
- **Rendering Time:** Must adapt fluidly to the user's display hardware (e.g., 60 Hz, 120 Hz, 144 Hz, 240 Hz).

To bridge these two dimensions, the engine introduces a **temporal reservoir** called the **Accumulator**.

```
+-------------------------------------------------------------------------+
|                  THE ACCUMULATOR INTEGRATION ARCHITECTURE               |
+-------------------------------------------------------------------------+
|                                                                         |
|  Real Wall-Clock Time Delta: frameTime = now() - last                   |
|                                                                         |
|                               |                                         |
|                               v                                         |
|                 [ Accumulator += frameTime ]                            |
|                               |                                         |
|                               +<------------------------+               |
|                               |                         |               |
|            Is Accumulator >= dt_fixed?                  |               |
|                     /            \                      |               |
|                   YES             NO                    |               |
|                   /                 \                   |               |
|                  v                   v                  |               |
|         [ Update Physics ]   [ Interpolate State ]      |               |
|         [ Accumulator -= dt] [ Render Frame ]           |               |
|                  |                   |                  |               |
|                  +-------------------+                  |               |
|                                                         |               |
+-------------------------------------------------------------------------+
```

#### The Accumulator Algorithm
1. Query the real elapsed wall-clock time since the previous render frame:
   $$\text{frameTime} = t_{\text{current}} - t_{\text{last}}$$
2. Pour $\text{frameTime}$ into the accumulator reservoir:
   $$\text{accumulator} = \text{accumulator} + \text{frameTime}$$
3. While the accumulator contains at least one fixed slice $\Delta t_{\text{fixed}}$, consume exactly $\Delta t_{\text{fixed}}$ and advance the deterministic physics engine:
   $$\text{while } (\text{accumulator} \ge \Delta t_{\text{fixed}}) \ \{$$
   $$\quad \mathbf{S}_{n+1} = \text{PhysicsStep}(\mathbf{S}_n, \Delta t_{\text{fixed}});$$
   $$\quad \text{accumulator} = \text{accumulator} - \Delta t_{\text{fixed}};$$
   $$\}$$
4. The remaining fractional time in the accumulator:
   $$\alpha = \frac{\text{accumulator}}{\Delta t_{\text{fixed}}} \in [0.0, 1.0)$$
   represents the exact temporal position of the render frame between the previous physics state $\mathbf{S}_n$ and the current physics state $\mathbf{S}_{n+1}$.

---

### 10.4 The Spiral of Death (The Death Spiral)

The fixed-timestep accumulator pattern is mathematically rigorous and aesthetically beautiful. However, in naive implementations, it hides a catastrophic computational instability known throughout computer science as **The Spiral of Death**.

#### Mathematical Diagnosis of the Spiral of Death
Let:
- $\Delta t$: The fixed physics step duration in seconds (e.g., $\Delta t = 0.016667\text{ s} = 16.67\text{ ms}$).
- $t_{\text{phys}}$: The actual CPU time required to compute one single physics step.
- $t_{\text{rend}}$: The CPU/GPU time required to render one frame.
- $T_{\text{frame}}$: The total wall-clock time for the current frame iteration.

Suppose the physical world becomes dense with particles or complex colliding bodies such that:

$$t_{\text{phys}} > \Delta t$$

That is, the CPU takes **longer to compute the physics for a 16.67 ms slice than 16.67 ms of real time** (for instance, $t_{\text{phys}} = 20\text{ ms}$).

Let us trace the positive feedback loop:
1. **Frame 1:** Suppose $\text{frameTime} = 20\text{ ms}$.
   - The accumulator receives $20\text{ ms}$.
   - It executes 1 physics step: cost $= 20\text{ ms}$.
   - The loop finishes and renders: total elapsed wall-clock time $= 20\text{ ms} + t_{\text{rend}} \approx 25\text{ ms}$.
2. **Frame 2:** Now $\text{frameTime}$ is measured as $25\text{ ms}$!
   - The accumulator receives $25\text{ ms}$.
   - Since $25 \ge 16.67$, it executes step 1 (taking $20\text{ ms}$).
   - Accumulator remainder $= 25 - 16.67 = 8.33\text{ ms}$.
   - Total elapsed wall-clock time $= 20\text{ ms} + 5\text{ ms} = 25\text{ ms}$.
3. **Frame 3:** Suppose a slight background OS interrupt occurs, raising $\text{frameTime}$ to $35\text{ ms}$.
   - Total in accumulator $= 8.33 + 35 = 43.33\text{ ms}$.
   - How many steps are required? $\lfloor 43.33 / 16.67 \rfloor = 2\text{ steps}$!
   - The CPU must now compute **two** physics steps:
     $$T_{\text{calc}} = 2 \times 20\text{ ms} = 40\text{ ms}$$
   - Adding render time ($5\text{ ms}$), the total frame time expands to $45\text{ ms}$!
4. **Frame 4:** The accumulator receives $45\text{ ms}$ plus the remainder.
   - Now the accumulator contains enough time for **3 steps**!
   - Computing 3 steps takes $3 \times 20\text{ ms} = 60\text{ ms}$.
   - Frame 5 now receives $65\text{ ms}$, requiring **4 steps** ($80\text{ ms}$).
   - Frame 6 requires **5 steps** ($100\text{ ms}$).

```
                     THE SPIRAL OF DEATH FEEDBACK LOOP
                     
           +---------------------------------------------+
           |                                             |
           v                                             |
    Frame Takes Longer                                   |
           |                                             |
           v                                             |
    Accumulator Fills with More Time                     |
           |                                             |
           v                                             |
    Must Compute MORE Physics Steps Per Frame            |
           |                                             |
           v                                             |
    CPU Burden Increases Exponentially                   |
           |                                             |
           +---------------------------------------------+
```

Within a few frames, the inner `while (accumulator >= dt)` loop executes dozens, then hundreds of physics steps per frame. The frame rate drops from 60 FPS to 10 FPS, then to 1 FPS, and finally the thread freezes entirely. The simulation has entered the **Spiral of Death**.

---

### 10.5 Breaking the Spiral: Delta Clamping and Time Budgets

To immunize an engine against the Spiral of Death, we must introduce a **safety breaker** that strictly bounds the maximum wall-clock time that the accumulator is permitted to absorb in a single frame.

#### Technique 1: Maximum Frame Clamping (`dt_clamp`)
We enforce a hard upper bound $T_{\text{max}}$ (typically $0.100\text{ s}$ or $0.250\text{ s}$, corresponding to 4 to 15 physics steps):

$$\text{frameTime}_{\text{effective}} = \min(\text{frameTime}_{\text{measured}}, T_{\text{max}})$$

```typescript
// Sovereign Defense Against the Spiral of Death
const MAX_FRAME_TIME = 0.100; // 100 milliseconds (max 6 steps at 60 Hz)

let frameTime = (currentTime - lastTime) / 1000.0;
if (frameTime > MAX_FRAME_TIME) {
  frameTime = MAX_FRAME_TIME; // Clamp to prevent death spiral
}
accumulator += frameTime;

while (accumulator >= DT_FIXED) {
  physicsStep(DT_FIXED);
  accumulator -= DT_FIXED;
}
```

##### The Physical Consequence of Clamping
When the CPU is overloaded and $t_{\text{frame}} > T_{\text{max}}$, clamping the accumulator means the simulation deliberately **discards wall-clock time**.
- The virtual world does not freeze or crash.
- Instead, the simulation gracefully slows down into **slow-motion** (bullet-time) relative to real-world wall-clock time.
- The numerical integrity, determinism, and collision physics remain 100% flawless!
- Once the computational surge passes, the simulation resumes normal 1:1 speed.

#### Technique 2: Maximum Sub-Step Budgeting (`maxSubSteps`)
Alternatively, one can bound the loop iterations directly:

```typescript
let stepsTaken = 0;
const MAX_SUB_STEPS = 5;

while (accumulator >= DT_FIXED && stepsTaken < MAX_SUB_STEPS) {
  physicsStep(DT_FIXED);
  accumulator -= DT_FIXED;
  stepsTaken++;
}

// Optional: If clamped, drop leftover accumulator to avoid residual backlog
if (accumulator >= DT_FIXED) {
  accumulator = 0; // Prevent runaway backlog
}
```

---

### 10.6 Ten In-Depth Progressive Worked Examples

#### Example 10.1: Accumulator Step Calculation Under Perfect 60 FPS
*Scenario:* A physics engine uses a fixed physics timestep of $\Delta t = \frac{1}{60}\text{ s} \approx 0.0166667\text{ s}$ ($16.667\text{ ms}$). The display runs at an exact refresh rate of 60.0 Hz, yielding $\text{frameTime} = 0.0166667\text{ s}$ on every frame. Starting with an empty accumulator ($\text{acc}_0 = 0$), trace the accumulator value and number of physics steps executed across 3 consecutive frames.

*Frame 1:*
- Incoming frame time: $\Delta t_{\text{frame}} = 0.0166667\text{ s}$.
- $\text{acc} = 0 + 0.0166667 = 0.0166667\text{ s}$.
- Check condition: $\text{acc} \ge \Delta t \implies 0.0166667 \ge 0.0166667$ (True).
- Execute Step 1.
- Subtract: $\text{acc} = 0.0166667 - 0.0166667 = 0.0000000\text{ s}$.
- Condition check: $\text{acc} \ge \Delta t$ (False).
- Steps taken: **1 step**. Remaining accumulator: $0.0\text{ ms}$.

*Frame 2:*
- $\text{acc} = 0 + 0.0166667 = 0.0166667\text{ s}$.
- Execute Step 2.
- Subtract: $\text{acc} = 0.0000000\text{ s}$.
- Steps taken: **1 step**. Remaining accumulator: $0.0\text{ ms}$.

*Frame 3:*
- $\text{acc} = 0 + 0.0166667 = 0.0166667\text{ s}$.
- Execute Step 3.
- Subtract: $\text{acc} = 0.0000000\text{ s}$.
- Steps taken: **1 step**. Remaining accumulator: $0.0\text{ ms}$.

*Conclusion:* In a perfectly synchronized 60 Hz display with 60 Hz physics, the accumulator acts as a pass-through buffer, executing exactly 1 physics step per render frame.

---

#### Example 10.2: Decoupled 144 Hz Display with 50 Hz Physics
*Scenario:* A high-end gaming monitor refreshes at 144 Hz ($\text{frameTime} = \frac{1}{144}\text{ s} \approx 6.9444\text{ ms}$). The physics engine runs at 50 Hz ($\Delta t_{\text{phys}} = \frac{1}{50}\text{ s} = 20.0\text{ ms}$). Starting with an empty accumulator, trace the number of physics steps executed and the residual accumulator for the first 5 render frames.

*Frame 1:*
- $\text{acc} = 0 + 6.9444 = 6.9444\text{ ms}$.
- $6.9444 < 20.0 \implies$ **0 physics steps**.
- Residual: $6.9444\text{ ms}$.

*Frame 2:*
- $\text{acc} = 6.9444 + 6.9444 = 13.8889\text{ ms}$.
- $13.8889 < 20.0 \implies$ **0 physics steps**.
- Residual: $13.8889\text{ ms}$.

*Frame 3:*
- $\text{acc} = 13.8889 + 6.9444 = 20.8333\text{ ms}$.
- $20.8333 \ge 20.0 \implies$ **1 physics step**.
- $\text{acc} = 20.8333 - 20.0 = 0.8333\text{ ms}$.
- Residual: $0.8333\text{ ms}$.

*Frame 4:*
- $\text{acc} = 0.8333 + 6.9444 = 7.7778\text{ ms}$.
- $7.7778 < 20.0 \implies$ **0 physics steps**.
- Residual: $7.7778\text{ ms}$.

*Frame 5:*
- $\text{acc} = 7.7778 + 6.9444 = 14.7222\text{ ms}$.
- $14.7222 < 20.0 \implies$ **0 physics steps**.
- Residual: $14.7222\text{ ms}$.

*Analysis:* Notice that physics steps occur roughly once every 3 frames ($144 / 50 = 2.88$). Without interpolation, the simulation would appear to "stutter" because visual updates happen at 144 Hz while physical positions only update every third frame.

---

#### Example 10.3: Tracing a Spiral of Death Onset
*Scenario:* A physics engine has $\Delta t = 20\text{ ms}$ ($0.020\text{ s}$). Due to an explosion spawning 500 debris particles, each physics step takes $t_{\text{phys}} = 25\text{ ms}$ of real CPU computation time. Render time is constant at $t_{\text{rend}} = 5\text{ ms}$. No frame clamping is implemented. Trace the first 4 frames starting from an initial single-frame lag spike where $\text{frameTime} = 30\text{ ms}$, with $\text{acc}_0 = 0$.

*Frame 1:*
- Incoming wall time: $\Delta t_{\text{frame}} = 30\text{ ms}$.
- $\text{acc} = 30\text{ ms}$.
- Loop condition: $\text{acc} \ge 20\text{ ms}$ (True).
  - Execute Step 1: takes $25\text{ ms}$ CPU time.
  - $\text{acc} = 30 - 20 = 10\text{ ms}$.
- Loop condition: $10 \ge 20$ (False).
- Total CPU time spent in Frame 1: $T_1 = 25\text{ ms} (\text{phys}) + 5\text{ ms} (\text{rend}) = 30\text{ ms}$.

*Frame 2:*
- Measured wall-clock time for Frame 2 is the duration of Frame 1: $\Delta t_{\text{frame}} = 30\text{ ms}$.
- Accumulator receives: $\text{acc} = 10\text{ ms} (\text{residual}) + 30\text{ ms} = 40\text{ ms}$.
- Loop condition: $40 \ge 20$ (True).
  - Execute Step 1: takes $25\text{ ms}$. $\text{acc} = 40 - 20 = 20\text{ ms}$.
  - Loop condition: $20 \ge 20$ (True).
  - Execute Step 2: takes $25\text{ ms}$. $\text{acc} = 20 - 20 = 0\text{ ms}$.
- Total CPU time spent in Frame 2: $T_2 = 2 \times 25\text{ ms} + 5\text{ ms} = 55\text{ ms}$!

*Frame 3:*
- Measured wall-clock time for Frame 3 is duration of Frame 2: $\Delta t_{\text{frame}} = 55\text{ ms}$.
- Accumulator receives: $\text{acc} = 0 + 55 = 55\text{ ms}$.
- Steps executed: $\lfloor 55 / 20 \rfloor = 2\text{ steps}$.
  - CPU time for physics: $2 \times 25 = 50\text{ ms}$.
  - Residual accumulator: $55 - 40 = 15\text{ ms}$.
- Total CPU time spent in Frame 3: $T_3 = 50\text{ ms} + 5\text{ ms} = 55\text{ ms}$.

*Frame 4:*
- Measured wall time: $\Delta t_{\text{frame}} = 55\text{ ms}$.
- Accumulator receives: $\text{acc} = 15 + 55 = 70\text{ ms}$!
- Steps executed: $\lfloor 70 / 20 \rfloor = 3\text{ steps}$!
  - CPU time for physics: $3 \times 25 = 75\text{ ms}$.
  - Residual accumulator: $70 - 60 = 10\text{ ms}$.
- Total CPU time spent in Frame 4: $T_4 = 75\text{ ms} + 5\text{ ms} = 80\text{ ms}$!

*Diagnosis:* In 4 frames, CPU time per frame spiraled from $30\text{ ms}$ to $80\text{ ms}$. Framerate plummeted from 33 FPS to 12.5 FPS. Without intervention, Frame 5 will execute 4 steps ($105\text{ ms}$), entering total deadlock.

---

#### Example 10.4: Quenching the Death Spiral with Delta Clamping
*Scenario:* Take the exact scenario from Example 10.3, but enforce a maximum frame clamp of $T_{\text{max}} = 50\text{ ms}$. Trace Frames 1 to 4 to show how clamping stabilizes the loop.

*Frame 1:*
- Measured: $30\text{ ms} \le 50\text{ ms} \implies \text{clamped} = 30\text{ ms}$.
- $\text{acc} = 30\text{ ms}$. Executes 1 step ($25\text{ ms}$). $\text{acc}_{\text{rem}} = 10\text{ ms}$.
- Total Frame 1 duration: $25 + 5 = 30\text{ ms}$.

*Frame 2:*
- Measured: $30\text{ ms} \le 50\text{ ms} \implies \text{clamped} = 30\text{ ms}$.
- $\text{acc} = 10 + 30 = 40\text{ ms}$. Executes 2 steps ($50\text{ ms}$). $\text{acc}_{\text{rem}} = 0\text{ ms}$.
- Total Frame 2 duration: $50 + 5 = 55\text{ ms}$.

*Frame 3:*
- Measured: $55\text{ ms} > 50\text{ ms} \implies \mathbf{Clamped\ to\ 50\text{ ms}}$!
- Accumulator receives only $50\text{ ms}$: $\text{acc} = 0 + 50 = 50\text{ ms}$.
- Steps executed: $\lfloor 50 / 20 \rfloor = 2\text{ steps}$.
  - Physics CPU time: $2 \times 25 = 50\text{ ms}$.
  - Residual accumulator: $50 - 40 = 10\text{ ms}$.
- Total Frame 3 duration: $50 + 5 = 55\text{ ms}$.

*Frame 4:*
- Measured: $55\text{ ms} > 50\text{ ms} \implies \mathbf{Clamped\ to\ 50\text{ ms}}$!
- Accumulator receives: $\text{acc} = 10 + 50 = 60\text{ ms}$.
- Steps executed: $\lfloor 60 / 20 \rfloor = 3\text{ steps}$.
  - Physics CPU time: $3 \times 25 = 75\text{ ms}$.
  - Residual accumulator: $60 - 60 = 0\text{ ms}$.
- Total Frame 4 duration: $75 + 5 = 80\text{ ms}$.

*Frame 5:*
- Measured: $80\text{ ms} \implies \mathbf{Clamped\ to\ 50\text{ ms}}$!
- Accumulator receives: $\text{acc} = 0 + 50 = 50\text{ ms}$.
- Steps executed: $\lfloor 50 / 20 \rfloor = 2\text{ steps}$.
  - Physics CPU time: $2 \times 25 = 50\text{ ms}$.
  - Residual accumulator: $10\text{ ms}$.
- Total Frame 5 duration: $55\text{ ms}$.

*Conclusion:* The steps oscillate stably between 2 and 3 steps per frame. The loop cannot runaway because the accumulator input is strictly throttled to at most $50\text{ ms}$. The simulation runs in slow-motion without crashing!

---

#### Example 10.5: Calculating the Slow-Motion Ratio Under Clamping
*Scenario:* In a heavy simulation where physics requires $t_{\text{phys}} = 40\text{ ms}$ per 20 ms physics tick, the engine enforces a maximum clamp of $T_{\text{max}} = 60\text{ ms}$. Render time is negligible. Determine the steady-state ratio between simulation time advancement and real wall-clock time advancement (the slow-motion factor $\gamma$).

*Step 1: Determine steps per frame under clamp:*
When clamped, the accumulator absorbs exactly $T_{\text{max}} = 60\text{ ms}$ of simulated time per frame.
Number of physics steps executed per frame:
$$N_{\text{steps}} = \left\lfloor \frac{60\text{ ms}}{20\text{ ms}} \right\rfloor = 3\text{ steps}$$
Simulated time advanced per frame:
$$\Delta t_{\text{sim}} = 3 \times 20\text{ ms} = 60\text{ ms} = 0.060\text{ s}$$

*Step 2: Determine actual wall-clock time required to execute those 3 steps:*
Each step takes $40\text{ ms}$ of real CPU computation:
$$\Delta t_{\text{real}} = 3 \times t_{\text{phys}} = 3 \times 40\text{ ms} = 120\text{ ms} = 0.120\text{ s}$$

*Step 3: Calculate the time dilation factor:*
$$\gamma = \frac{\Delta t_{\text{sim}}}{\Delta t_{\text{real}}} = \frac{60\text{ ms}}{120\text{ ms}} = 0.50$$

*Physical Meaning:* The simulation runs at exactly **50% speed** (half-speed bullet-time). For every 2 seconds of real time experienced by the user, exactly 1 second of physical motion occurs in the simulation. The physics remains 100% numerically stable and crash-free.

---

#### Example 10.6: Numerical Instability of Variable Timestep with a Harmonic Oscillator
*Scenario:* A mass-spring oscillator obeys $\ddot{x} = -\omega^2 x$ with $\omega = 10\text{ rad/s}$. Compare the numerical energy growth of an Explicit Euler integrator after 2 steps between:
- Case A: Two fixed steps with $\Delta t_1 = \Delta t_2 = 0.05\text{ s}$.
- Case B: Two variable steps with $\Delta t_1 = 0.01\text{ s}$ and $\Delta t_2 = 0.09\text{ s}$ (same total time of $0.10\text{ s}$).
Initial conditions: $x_0 = 1.0\text{ m}$, $v_0 = 0.0\text{ m/s}$. ($m=1\text{ kg}$, $k = 100\text{ N/m}$). Initial energy $E_0 = \frac{1}{2} k x_0^2 = 50.0\text{ J}$.

*Explicit Euler equations:*
$$x_{n+1} = x_n + v_n \Delta t$$
$$v_{n+1} = v_n - \omega^2 x_n \Delta t = v_n - 100 x_n \Delta t$$
Total energy: $E_n = \frac{1}{2} m v_n^2 + \frac{1}{2} k x_n^2 = \frac{1}{2} v_n^2 + 50 x_n^2$.

*Case A: Two fixed steps ($\Delta t = 0.05\text{ s}$):*
- Step 1:
  $$x_1 = 1.0 + 0 \times 0.05 = 1.0\text{ m}$$
  $$v_1 = 0 - 100 \times 1.0 \times 0.05 = -5.0\text{ m/s}$$
  $$E_1 = \frac{1}{2}(-5.0)^2 + 50(1.0)^2 = 12.5 + 50.0 = 62.5\text{ J}$$
- Step 2:
  $$x_2 = 1.0 + (-5.0) \times 0.05 = 1.0 - 0.25 = 0.75\text{ m}$$
  $$v_2 = -5.0 - 100 \times 1.0 \times 0.05 = -5.0 - 5.0 = -10.0\text{ m/s}$$
  $$E_2 = \frac{1}{2}(-10.0)^2 + 50(0.75)^2 = 50.0 + 50(0.5625) = 50.0 + 28.125 = 78.125\text{ J}$$
Energy growth ratio: $\frac{E_2}{E_0} = \frac{78.125}{50.0} = 1.5625$.

*Case B: Two variable steps ($\Delta t_1 = 0.01\text{ s}$, $\Delta t_2 = 0.09\text{ s}$):*
- Step 1 ($\Delta t_1 = 0.01\text{ s}$):
  $$x_1 = 1.0 + 0 \times 0.01 = 1.0\text{ m}$$
  $$v_1 = 0 - 100 \times 1.0 \times 0.01 = -1.0\text{ m/s}$$
  $$E_1 = \frac{1}{2}(-1.0)^2 + 50(1.0)^2 = 0.5 + 50.0 = 50.5\text{ J}$$
- Step 2 ($\Delta t_2 = 0.09\text{ s}$):
  $$x_2 = 1.0 + (-1.0) \times 0.09 = 1.0 - 0.09 = 0.91\text{ m}$$
  $$v_2 = -1.0 - 100 \times 1.0 \times 0.09 = -1.0 - 9.0 = -10.0\text{ m/s}$$
  $$E_2 = \frac{1}{2}(-10.0)^2 + 50(0.91)^2 = 50.0 + 50(0.8281) = 50.0 + 41.405 = 91.405\text{ J}$$
Energy growth ratio: $\frac{E_2}{E_0} = \frac{91.405}{50.0} = 1.8281$.

*Conclusion:* In Case B, the variable spike to $\Delta t = 0.09\text{ s}$ caused an energy explosion of **82.8%** compared to only **56.2%** for uniform steps, proving that variable $\Delta t$ drastically accelerates numerical instability.

---

#### Example 10.7: High-Resolution Timer Query Latency
*Scenario:* A high-frequency physics simulator queries the CPU time using `clock_gettime(CLOCK_MONOTONIC_RAW)`. Each call requires a system call switch taking $t_{\text{call}} = 45\text{ ns}$.
1. If the simulation executes 1,000,000 particle updates per second, calculate the total CPU time wasted purely on querying the clock if the timer is queried inside the particle loop.
2. How does querying the clock once per master frame resolve this overhead?

*Step 1: Intra-loop timer overhead:*
$$T_{\text{overhead}} = 1,000,000 \times 45\text{ ns} = 45,000,000\text{ ns} = 0.045\text{ s} = 45\text{ ms/second}$$
The CPU spends $45\text{ ms}$ out of every $1000\text{ ms}$ (a **4.5% overall CPU penalty**) purely reading quartz crystal clock registers!

*Step 2: Master loop optimization:*
At 60 FPS, the clock is queried only once per frame:
$$N_{\text{queries}} = 60\text{ queries/second}$$
$$T_{\text{overhead}} = 60 \times 45\text{ ns} = 2,700\text{ ns} = 0.0027\text{ ms/second}$$
The overhead drops by a factor of over **16,000-fold**, reducing timer latency to absolute zero in practice.

---

#### Example 10.8: Accumulator Precision Under Floating-Point Addition
*Scenario:* An engine stores its accumulator in a single-precision 32-bit float (`float`). The fixed timestep is $\Delta t = \frac{1}{60}\text{ s} \approx 0.0166666675\text{ s}$. Over 10 hours of continuous simulation, $N = 10 \times 3600 \times 60 = 2,160,000$ physics steps are executed.
Explain why accumulating continuous elapsed time via `acc += dt` in a 32-bit float will eventually freeze physics advancement entirely.

*Step 1: ULP expansion of 32-bit float:*
A 32-bit float has 24 bits of mantissa ($\approx 7.2$ decimal digits).
After 10 hours, the total accumulated time is:
$$T = 10 \times 3600 = 36,000\text{ seconds}$$
Find the Unit in the Last Place (ULP) around $36,000$:
$2^{15} = 32,768 \le 36,000 < 65,536 = 2^{16}$.
Exponent $E = 15$.
$$\text{ULP}(36,000) = 2^{E - 23} = 2^{15 - 23} = 2^{-8} = \frac{1}{256} \approx 0.00390625\text{ s}$$

*Step 2: Long-term drift:*
If the simulation runs for 5 days ($T \approx 432,000\text{ s}$):
$2^{18} \le 432,000 < 2^{19}$.
$$\text{ULP}(432,000) = 2^{18 - 23} = 2^{-5} = \frac{1}{32} = 0.03125\text{ s}$$
Since $\Delta t_{\text{frame}} \approx 0.0166667\text{ s}$, we have:
$$\Delta t_{\text{frame}} < \frac{1}{2} \text{ULP}(432,000)$$
By the rules of IEEE 754 Round-to-Nearest:
$$432,000.0f + 0.0166667f \equiv 432,000.0f$$
The addition **completely absorbs** the incoming delta! The accumulator stops advancing, and physics permanently freezes!

*Architectural Rule:* The accumulator must **always** be decremented by $\Delta t$ during the consumption loop (`accumulator -= dt`), keeping the accumulator bounded near zero ($0 \le \text{acc} < \Delta t$) where ULP is $2^{-23} \approx 10^{-7}\text{ s}$, or stored as a 64-bit integer in nanoseconds!

---

#### Example 10.9: Multi-Rate Physics and Sub-Stepping
*Scenario:* A vehicle physics simulator runs broadphase collision detection at 60 Hz ($\Delta t_{\text{broad}} = 16.67\text{ ms}$), but requires tire friction integration at 240 Hz ($\Delta t_{\text{tire}} = 4.167\text{ ms}$) to prevent stiff spring explosion.
Design the sub-stepping loop and calculate how many tire steps are executed per broadphase tick.

*Step 1: Sub-step ratio:*
$$N_{\text{sub}} = \frac{\Delta t_{\text{broad}}}{\Delta t_{\text{tire}}} = \frac{16.6667\text{ ms}}{4.1667\text{ ms}} = 4\text{ sub-steps}$$

*Step 2: Execution architecture:*
```typescript
function physicsStep(dtBroad: number) {
  // 1. Broadphase collision: executed once per 16.67 ms
  detectBroadphaseCollisions();

  // 2. Sub-stepped tire friction: executed 4 times per 16.67 ms
  const dtSub = dtBroad / 4;
  for (let i = 0; i < 4; i++) {
    integrateTireFriction(dtSub);
    resolveSpringDamperSuspension(dtSub);
  }

  // 3. Position integration
  integratePositions(dtBroad);
}
```

*Sanity Check:* By sub-stepping only the computationally stiff differential equations (tire friction and suspension) rather than the entire world broadphase, we gain the stability of a 240 Hz solver while spending 70% less CPU time!

---

#### Example 10.10: Complete Fixed-Timestep Class Implementation
*Scenario:* Write a minimal, self-contained TypeScript class `SimulationClock` that implements the accumulator pattern with maximum frame clamping and sub-tick alpha calculation.

```typescript
export class SimulationClock {
  public readonly dt: number;         // Fixed timestep in seconds (e.g. 1/60)
  public readonly maxFrameTime: number; // Clamp threshold (e.g. 0.1s)
  
  private accumulator: number = 0;
  private lastTime: number = 0;
  private alpha: number = 0;

  constructor(physicsHz: number = 60, maxFrameTimeSeconds: number = 0.1) {
    this.dt = 1.0 / physicsHz;
    this.maxFrameTime = maxFrameTimeSeconds;
  }

  public start(initialTimestamp: number): void {
    this.lastTime = initialTimestamp;
    this.accumulator = 0;
    this.alpha = 0;
  }

  /**
   * Advances clock with current timestamp (in seconds).
   * Calls stepCallback for each fixed slice.
   * Returns sub-tick interpolation alpha in [0, 1).
   */
  public update(currentTimestamp: number, stepCallback: (dt: number) => void): number {
    let frameTime = currentTimestamp - this.lastTime;
    this.lastTime = currentTimestamp;

    // Defense against Spiral of Death
    if (frameTime > this.maxFrameTime) {
      frameTime = this.maxFrameTime;
    }

    this.accumulator += frameTime;

    while (this.accumulator >= this.dt) {
      stepCallback(this.dt);
      this.accumulator -= this.dt;
    }

    // Compute sub-tick fractional remainder
    this.alpha = this.accumulator / this.dt;
    return this.alpha;
  }
}
```

---

### 10.7 Chapter Mastery Exercises

#### Tier 1: Conceptual Foundations (Exercises 10.1 – 10.2)

##### Exercise 10.1
Define the term **Spiral of Death** in real-time physics simulations. What is the fundamental mathematical condition that triggers it, and why does an unclamped accumulator guarantee total thread lockup?

##### Exercise 10.2
Why is an unthrottled `while (true)` simulation loop unacceptable on modern computing platforms featuring heterogeneous CPU cores (e.g., performance vs. efficiency cores)?

---

#### Tier 2: Accumulator Mathematics (Exercises 10.3 – 10.4)

##### Exercise 10.3
A physics simulation operates at $\Delta t = 20\text{ ms}$ ($50\text{ Hz}$). The display refreshes at an unlocked $200\text{ Hz}$ ($\Delta t_{\text{frame}} = 5\text{ ms}$). Starting with an empty accumulator ($\text{acc}_0 = 0$), list the number of physics steps executed and the residual accumulator value for the first 8 consecutive render frames.

##### Exercise 10.4
An engine runs at 60 Hz physics ($\Delta t = 16.67\text{ ms}$). Over a span of 10 render frames, the monitor experiences micro-stutter with frame times alternating between $10\text{ ms}$ and $24\text{ ms}$ (`[10, 24, 10, 24, ...]`). Calculate the sequence of physics steps executed per frame. Does the physics experience any instability?

---

#### Tier 3: Numerical Integrity & Symplectic Conservation (Exercises 10.5 – 10.6)

##### Exercise 10.5
Explain how variable delta-time ($\Delta t$) breaks the symplectic properties of a Verlet integrator. Specifically discuss why varying $\Delta t$ between steps causes an orbit to artificially gain or lose mechanical energy.

##### Exercise 10.6
A high-velocity projectile moves at $v = 1,200\text{ m/s}$. The target is a defensive shield of thickness $d = 0.5\text{ m}$.
1. Under a fixed timestep of $\Delta t = 0.002\text{ s}$ ($500\text{ Hz}$), calculate the distance traveled per step. Does the projectile risk tunneling through the shield?
2. If a sudden garbage collection lag spike causes a variable-timestep engine to take a single step of $\Delta t = 0.050\text{ s}$, calculate the displacement during that step and explain the collision failure.

---

#### Tier 4: Engineering Defense & Clamping (Exercises 10.7 – 10.8)

##### Exercise 10.7
A physics simulation runs at $\Delta t = 0.016667\text{ s}$. Each physics step requires $t_{\text{phys}} = 0.025\text{ s}$ of CPU execution time. The engine clamps the maximum frame time to $T_{\text{max}} = 0.050\text{ s}$.
1. How many physics steps are executed per frame in steady-state?
2. Calculate the resulting frame rate (FPS) of the rendering thread.
3. Calculate the time dilation factor (how many real seconds elapse per simulated second).

##### Exercise 10.8
Explain why storing the accumulator as a running monotonic timestamp (e.g., `accumulator = currentWallTime - totalSimulatedTime`) causes catastrophic numerical loss of precision in 32-bit floating-point runtimes after several hours of execution.

---

#### Tier 5: Systems Architecture & Sub-Stepping (Exercises 10.9 – 10.10)

##### Exercise 10.9
A planetary solar system simulation requires simulating orbital mechanics for 100 years. If the orbital integrator uses a fixed timestep of $\Delta t = 1\text{ hour}$ ($3,600\text{ s}$):
1. How many total integration steps are required?
2. If the user accelerates game speed by $1,000\times$, explain how the accumulator architecture handles fast-forwarding without altering the underlying physics step size $\Delta t$.

##### Exercise 10.10
Design a complete mathematical proof showing that for any arbitrary sequence of positive render frame times $\{f_1, f_2, \dots, f_K\}$ where $\sum_{i=1}^K f_i = T_{\text{total}}$, an accumulator-based loop with fixed timestep $\Delta t$ executes exactly $N = \lfloor T_{\text{total}} / \Delta t \rfloor$ steps, and the residual accumulator is strictly bounded by $0 \le \text{acc} < \Delta t$.

---

### 10.8 Complete Step-by-Step Solutions to Chapter Exercises

#### Solution to Exercise 10.1
*Definition:* The **Spiral of Death** is a catastrophic runaway feedback loop in an accumulator-based simulation loop where the CPU cannot compute physical updates as fast as real wall-clock time elapses.

*Trigger Condition:*
$$t_{\text{phys}}(\Delta t) > \Delta t$$
Where $t_{\text{phys}}(\Delta t)$ is the real CPU time required to calculate one physics step of duration $\Delta t$.

*Lockup Mechanics:*
When $t_{\text{phys}} > \Delta t$, the engine takes longer to simulate a unit of time than that unit of time takes to pass in reality. Consequently:
1. Each frame takes longer to finish.
2. The high-resolution timer measures a larger $\text{frameTime}$.
3. The accumulator receives more time than was consumed in the previous frame.
4. The inner loop $\text{while (accumulator} \ge \Delta t)$ is forced to execute more steps in the next frame.
5. Computing more steps takes even more CPU time, widening the frame time further.
6. The number of steps required per frame grows without bound until the application freezes completely, rendering 0 frames per second.

---

#### Solution to Exercise 10.2
An unthrottled `while (true)` loop is unacceptable on modern systems for three primary reasons:
1. **Heterogeneous CPU Architectures (ARM big.LITTLE / Intel Alder Lake):** Modern processors contain high-performance cores and low-power efficiency cores. If the OS thread scheduler moves the unthrottled thread from an E-core (running at 1.8 GHz) to a P-core (running at 5.0 GHz), the simulation speed jumps instantaneously by nearly 300%, causing erratic, unpredictable physics behavior.
2. **Thermal Throttling & Power Consumption:** Running an unthrottled loop pegs the CPU core at 100% utilization, dissipating maximum wattage, draining mobile device batteries in minutes, and triggering CPU thermal throttling that reduces clock frequencies unpredictably.
3. **Decoupled Refresh Rates:** Displays operate at fixed refresh cycles (V-Sync). Running an unthrottled loop at 2,000 FPS on a 60 Hz monitor wastes 97% of compute power generating frames that are never displayed, while introducing severe screen tearing.

---

#### Solution to Exercise 10.3
Given $\Delta t_{\text{phys}} = 20\text{ ms}$, $\Delta t_{\text{frame}} = 5\text{ ms}$, $\text{acc}_0 = 0\text{ ms}$.
- **Frame 1:** $\text{acc} = 0 + 5 = 5\text{ ms} < 20 \implies$ **0 steps**. Remainder: $5\text{ ms}$.
- **Frame 2:** $\text{acc} = 5 + 5 = 10\text{ ms} < 20 \implies$ **0 steps**. Remainder: $10\text{ ms}$.
- **Frame 3:** $\text{acc} = 10 + 5 = 15\text{ ms} < 20 \implies$ **0 steps**. Remainder: $15\text{ ms}$.
- **Frame 4:** $\text{acc} = 15 + 5 = 20\text{ ms} \ge 20 \implies$ **1 step** ($20\text{ ms}$). Remainder: $20 - 20 = 0\text{ ms}$.
- **Frame 5:** $\text{acc} = 0 + 5 = 5\text{ ms} < 20 \implies$ **0 steps**. Remainder: $5\text{ ms}$.
- **Frame 6:** $\text{acc} = 5 + 5 = 10\text{ ms} < 20 \implies$ **0 steps**. Remainder: $10\text{ ms}$.
- **Frame 7:** $\text{acc} = 10 + 5 = 15\text{ ms} < 20 \implies$ **0 steps**. Remainder: $15\text{ ms}$.
- **Frame 8:** $\text{acc} = 15 + 5 = 20\text{ ms} \ge 20 \implies$ **1 step** ($20\text{ ms}$). Remainder: $0\text{ ms}$.

*Pattern:* Exactly 1 physics step is executed every 4 render frames ($20 / 5 = 4$).

---

#### Solution to Exercise 10.4
Given $\Delta t = 16.67\text{ ms}$, alternating frames $[10, 24, 10, 24, \dots]$:
- **Frame 1 ($10\text{ ms}$):** $\text{acc} = 10\text{ ms} < 16.67 \implies$ **0 steps**. Remainder: $10.0\text{ ms}$.
- **Frame 2 ($24\text{ ms}$):** $\text{acc} = 10 + 24 = 34\text{ ms} \ge 16.67 \implies$ **2 steps** ($2 \times 16.67 = 33.34\text{ ms}$). Remainder: $34 - 33.34 = 0.66\text{ ms}$.
- **Frame 3 ($10\text{ ms}$):** $\text{acc} = 0.66 + 10 = 10.66\text{ ms} < 16.67 \implies$ **0 steps**. Remainder: $10.66\text{ ms}$.
- **Frame 4 ($24\text{ ms}$):** $\text{acc} = 10.66 + 24 = 34.66\text{ ms} \ge 16.67 \implies$ **2 steps** ($33.34\text{ ms}$). Remainder: $34.66 - 33.34 = 1.32\text{ ms}$.
- **Frames 5-10:** Continue alternating **0 steps, 2 steps, 0 steps, 2 steps**.

*Stability Analysis:* The physics engine experiences **zero instability**. Even though render frames fluctuate wildly, every single physics step executed inside the loop receives the exact, invariant constant $\Delta t = 16.67\text{ ms}$. The physics remains 100% stable, deterministic, and energy-conserving.

---

#### Solution to Exercise 10.5
In Verlet integration, the position update for a constant timestep $\Delta t$ is:

$$\mathbf{x}_{n+1} = 2\mathbf{x}_n - \mathbf{x}_{n-1} + \mathbf{a}_n \Delta t^2$$

This formula is derived from the Taylor expansions of $\mathbf{x}(t + \Delta t)$ and $\mathbf{x}(t - \Delta t)$, where the odd-order truncation error terms ($O(\Delta t^3)$) cancel identically, preserving symplectic phase space volume and bounded energy oscillation.

*Failure Under Variable Timestep:* If the previous timestep was $\Delta t_{\text{prev}}$ and the current timestep is $\Delta t_{\text{curr}}$, the odd-order terms **do not cancel**:

$$\mathbf{x}_{n+1} = \mathbf{x}_n + (\mathbf{x}_n - \mathbf{x}_{n-1})\frac{\Delta t_{\text{curr}}}{\Delta t_{\text{prev}}} + \mathbf{a}_n \frac{\Delta t_{\text{curr}}(\Delta t_{\text{curr}} + \Delta t_{\text{prev}})}{2}$$

This modified equation is **non-symplectic**. The artificial scaling ratio $\frac{\Delta t_{\text{curr}}}{\Delta t_{\text{prev}}}$ pumps spurious numerical energy into the system whenever $\Delta t$ expands, and drains energy when $\Delta t$ shrinks. Over thousands of orbits or spring cycles, this non-conservative drift causes planetary orbits to artificially expand into interstellar space or collapse into the central star.

---

#### Solution to Exercise 10.6
*Part 1: Fixed Timestep ($\Delta t = 0.002\text{ s}$):*
$$v = 1,200\text{ m/s}, \quad d_{\text{shield}} = 0.5\text{ m}$$
Displacement per step:
$$\Delta x = v \cdot \Delta t = 1,200\text{ m/s} \times 0.002\text{ s} = 2.4\text{ m}$$
Because $\Delta x = 2.4\text{ m} > 0.5\text{ m}$, even at 500 Hz a discrete point test might tunnel! However, with Continuous Collision Detection (swept raycasts), a $2.4\text{ m}$ segment easily intersects the shield.

*Part 2: Variable Timestep Lag Spike ($\Delta t = 0.050\text{ s}$):*
Displacement during the spike:
$$\Delta x = 1,200\text{ m/s} \times 0.050\text{ s} = 60.0\text{ m}$$
The projectile travels **60 meters in a single frame**. If the simulation uses standard discrete bounding box checks, the projectile was $20\text{ m}$ in front of the shield in Frame $N$, and $40\text{ m}$ behind the shield in Frame $N+1$. The collision test detects no overlap in either frame, allowing the projectile to pass directly through the shield as if it did not exist.

---

#### Solution to Exercise 10.7
Given: $\Delta t = 0.016667\text{ s}$ ($16.67\text{ ms}$), $t_{\text{phys}} = 0.025\text{ s}$ ($25\text{ ms}$), $T_{\text{max}} = 0.050\text{ s}$ ($50\text{ ms}$).

*Part 1: Steady-state steps per frame:*
The accumulator is clamped to absorb at most $T_{\text{max}} = 50\text{ ms}$ per frame:
$$N_{\text{steps}} = \left\lfloor \frac{50\text{ ms}}{16.67\text{ ms}} \right\rfloor = 3\text{ steps}$$
(Over time, alternating between 2 and 3 steps with an average of $50 / 16.67 = 3.0$ steps).

*Part 2: Rendering frame rate (FPS):*
Computing 3 physics steps takes:
$$T_{\text{calc}} = 3 \times 25\text{ ms} = 75\text{ ms}$$
Rendering Frame Rate:
$$\text{FPS} = \frac{1}{0.075\text{ s}} \approx 13.33\text{ FPS}$$

*Part 3: Time dilation factor:*
In each 75 ms frame, simulated time advances by:
$$\Delta t_{\text{sim}} = 3 \times 16.67\text{ ms} = 50\text{ ms} = 0.050\text{ s}$$
Real wall-clock time elapsed:
$$\Delta t_{\text{real}} = 75\text{ ms} = 0.075\text{ s}$$
Dilation ratio:
$$\gamma = \frac{0.050}{0.075} = \frac{2}{3} \approx 0.667$$
The simulation runs smoothly in slow motion at **66.7% of real-time speed**, completely preventing a crash.

---

#### Solution to Exercise 10.8
When tracking simulation time as monotonic real numbers:
$$\text{accumulator} = t_{\text{wall}} - t_{\text{sim}}$$
As the simulation runs, both $t_{\text{wall}}$ and $t_{\text{sim}}$ grow monotonically toward large values.
In IEEE 754 single-precision float:
- At $t = 100,000\text{ seconds}$ ($\approx 27.7\text{ hours}$), the spacing between consecutive representable numbers is:
  $$\text{ULP}(100,000) = 2^{\lfloor \log_2(100,000) \rfloor - 23} = 2^{16 - 23} = 2^{-7} = \frac{1}{128} \approx 0.0078125\text{ s}$$
When subtracting two large numbers that are close to each other:
$$\text{accumulator} = t_{\text{wall}} - t_{\text{sim}}$$
The operation suffers from **catastrophic cancellation**. The precision of the accumulator drops from 24 bits to just 1 or 2 bits of precision! The accumulator begins jittering violently between 0 and discrete fractions of a second, causing the engine to randomly drop physics frames or execute bursts of 5 steps followed by 0 steps.

*Remedy:* Keep the accumulator strictly as a local residual bounded within $[0, \Delta t)$ by decrementing $\Delta t$ directly on each step.

---

#### Solution to Exercise 10.9
*Part 1: Total integration steps:*
$$T_{\text{total}} = 100\text{ years} \times 365.25\text{ days/year} \times 24\text{ hours/day} = 876,600\text{ hours}$$
Since $\Delta t = 1\text{ hour}$, exactly:
$$N = 876,600\text{ steps}$$

*Part 2: Fast-forward accumulator mechanics:*
When the user selects $1,000\times$ game speed, the engine does **not** change $\Delta t$ to $1,000\text{ hours}$ (which would cause planets to fly out of orbit).
Instead, the engine multiplies the incoming wall-clock delta by 1,000 before pouring it into the accumulator:
$$\text{accumulator} += \text{frameTime} \times 1000$$
The inner physics loop still executes `physicsStep(1.0 hour)`. At 60 FPS, the loop simply executes:
$$\frac{0.01667\text{ s} \times 1000 \times 1\text{ hr/s}}{1\text{ hr}} \approx 16.67\text{ steps per render frame}$$
The physics calculations remain 100% numerically identical to running at normal speed; the computer simply executes more fixed steps per second.

---

#### Solution to Exercise 10.10
*Theorem:* Let $\{f_1, f_2, \dots, f_K\}$ be an arbitrary sequence of non-negative real numbers representing frame times, such that $\sum_{i=1}^K f_i = T_{\text{total}}$. An accumulator loop initialized with $\text{acc}_0 = 0$ that performs:
1. $\text{acc} \leftarrow \text{acc} + f_i$
2. While $\text{acc} \ge \Delta t$: $\text{acc} \leftarrow \text{acc} - \Delta t$, increment $N$
executes exactly $N_{\text{total}} = \lfloor T_{\text{total}} / \Delta t \rfloor$ steps, and the final accumulator satisfies $0 \le \text{acc}_{\text{final}} < \Delta t$.

*Proof by Induction on Frame Index $k$:*
*Base Case ($k=0$):* $\text{acc}_0 = 0$. $0 \le 0 < \Delta t$, $N_0 = 0 = \lfloor 0 / \Delta t \rfloor$. Holds trivially.
*Inductive Step:* Assume after frame $k$, the total steps executed is $N_k$ and the accumulator is $\text{acc}_k$, with:
$$T_k = N_k \Delta t + \text{acc}_k, \quad \text{where } 0 \le \text{acc}_k < \Delta t$$
At frame $k+1$, we add $f_{k+1}$:
$$\text{acc}_{\text{temp}} = \text{acc}_k + f_{k+1}$$
The while loop subtracts $\Delta t$ exactly $m_{k+1}$ times, where $m_{k+1} = \lfloor \text{acc}_{\text{temp}} / \Delta t \rfloor$.
The new accumulator is:
$$\text{acc}_{k+1} = \text{acc}_{\text{temp}} - m_{k+1} \Delta t = \text{acc}_{\text{temp}} \bmod \Delta t$$
By definition of the modulo operator on real numbers, $0 \le \text{acc}_{k+1} < \Delta t$.
The total steps executed becomes:
$$N_{k+1} = N_k + m_{k+1} = N_k + \left\lfloor \frac{\text{acc}_k + f_{k+1}}{\Delta t} \right\rfloor$$
Substituting $N_k \Delta t + \text{acc}_k = T_k$:
$$N_{k+1} \Delta t + \text{acc}_{k+1} = T_k + f_{k+1} = T_{k+1}$$
Taking the floor of both sides divided by $\Delta t$:
$$N_{k+1} = \left\lfloor \frac{T_{k+1}}{\Delta t} \right\rfloor$$
By mathematical induction, after all $K$ frames:
$$N_{\text{total}} = \left\lfloor \frac{T_{\text{total}}}{\Delta t} \right\rfloor, \quad 0 \le \text{acc}_{\text{final}} < \Delta t$$
$\blacksquare$

*Significance:* This formal proof guarantees that regardless of how erratic the rendering framerate is, the accumulator loop is provably invariant: it never loses or creates simulated time.
