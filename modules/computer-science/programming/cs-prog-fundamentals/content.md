# Programming Fundamentals: State, Loops, and Discrete Simulation

## 1. Conceptual Foundations & Intuitive Overview
In physical reality, time flows continuously. In digital computing, machines process information in **discrete ticks**. A computer simulation creates the illusion of continuous physical dynamics by executing an iterative loop:

```text
[ Read Inputs ] -> [ Update Physics by dt ] -> [ Render Canvas ] -> [ Repeat ]
```

Every simulated entity is represented by an in-memory **state** (such as coordinates $x, y$ and velocity components $v_x, v_y$). At each tick of duration $\Delta t$, a function calculates new states based on the physical rules.

---

## 2. Mathematical & Algorithmic Formalism

### 2.1 State Representation
An entity state $S_t$ at discrete time $t = k \cdot \Delta t$ is a vector of values:

$$ S_k = \begin{bmatrix} x_k \\ y_k \\ v_{x, k} \\ v_{y, k} \end{bmatrix} $$

A **simulation step** is a deterministic transition function $T$:
$$ S_{k+1} = T(S_k, \Delta t) $$

### 2.2 The Fixed Time-Step Game Loop
If a simulation uses variable frame time $\Delta t_{\text{frame}}$ directly, the physics will behave unpredictably when framerates fluctuate (e.g. tunneling through walls on lag spikes).
Professional simulations use a **Fixed Delta Time Accumulator**:

```javascript
let accumulatedTime = 0;
const FIXED_DT = 1 / 60; // 60 Hz physics tick (~0.01667 seconds)

function mainLoop(currentFrameTime) {
  const deltaFrame = (currentFrameTime - lastFrameTime) / 1000;
  lastFrameTime = currentFrameTime;

  accumulatedTime += Math.min(deltaFrame, 0.25); // Clamp to prevent spiral of death

  // Run fixed physics ticks
  while (accumulatedTime >= FIXED_DT) {
    physicsTick(FIXED_DT);
    accumulatedTime -= FIXED_DT;
  }

  // Render current state to screen
  render(canvasContext);

  requestAnimationFrame(mainLoop);
}
```

---

## 3. Worked Examples

### Example 1: Simulating Constant Velocity
A ball starts at $x = 0$ with velocity $v = 15 \text{ m/s}$. We simulate 3 discrete steps with $\Delta t = 0.1 \text{ s}$.

**Step-by-step trace:**
- $k = 0: \quad t = 0.0 \text{ s}, \quad x_0 = 0.0 \text{ m}$
- $k = 1: \quad t = 0.1 \text{ s}, \quad x_1 = x_0 + v \cdot \Delta t = 0.0 + 15(0.1) = 1.5 \text{ m}$
- $k = 2: \quad t = 0.2 \text{ s}, \quad x_2 = x_1 + v \cdot \Delta t = 1.5 + 15(0.1) = 3.0 \text{ m}$
- $k = 3: \quad t = 0.3 \text{ s}, \quad x_3 = x_2 + v \cdot \Delta t = 3.0 + 15(0.1) = 4.5 \text{ m}$

Notice that analytical solution gives $x(0.3) = 15 \times 0.3 = 4.5 \text{ m}$. For constant velocity, the discrete Euler step is mathematically exact.

---

## 4. Interactive Simulation & Practical Computation

```javascript
// Entity manager updating an array of simulated bodies
class SimulationWorld {
  constructor(dt = 0.016) {
    this.dt = dt;
    this.bodies = [];
  }

  addBody(body) {
    this.bodies.push(body);
  }

  step() {
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      // Update position from velocity
      b.x += b.vx * this.dt;
      b.y += b.vy * this.dt;
    }
  }
}
```
