# ARCHITECTURE DECISION LOG (ADR)

> This document maintains the permanent chronological record of all significant architectural, ontological, and engineering decisions.

---

## ADR-001: Separation of System A (Tree of Discovery) and System B (Tree of Knowledge)
- **Status:** **Accepted**
- **Date:** 2026-11-18
- **Context:** The master vision encompasses both the historical evolution of scientific ideas (Tree of Discovery) and the practical, competency-driven learning system (Tree of Knowledge). Building both simultaneously risks extreme scope creep and delayed value delivery.
- **Decision:** Explicitly defer the operational implementation of System A to post-V1, while keeping System B as the strict focus of Version 1. However, introduce reserved `discovery_context` hooks in the module schema to guarantee forward compatibility.
- **Consequences:** Accelerates V1 delivery while avoiding costly architectural rework when System A is introduced.

---

## ADR-002: Sovereign, File-First Knowledge Storage (Git-Backed)
- **Status:** **Accepted**
- **Date:** 2026-11-18
- **Context:** We evaluated using an external graph database (e.g., Neo4j) or relational database (PostgreSQL) vs. a Git-backed, file-first storage model (YAML metadata + Markdown content).
- **Decision:** Store all canonical modules, pathways, and schemas as declarative files in the repository. Maintain in-memory graph structures during runtime.
- **Rationale:**
  1. Complete version control, branchability, and pull-request-based peer review.
  2. Maximum portability; zero proprietary database lock-in.
  3. In-memory DAG operations on thousands of nodes execute in milliseconds, rendering external graph DB overhead completely unnecessary for V1.
- **Consequences:** Content is human-readable, easily diffable, and editable with standard developer tools. Fast CI/CD validation.

---

## ADR-003: 2D Physics Simulator as the V1 Pilot Anchor
- **Status:** **Accepted**
- **Date:** 2026-11-18
- **Context:** We need a concrete, compelling demonstration that cross-disciplinary modules can be composed into an actionable learning pathway.
- **Decision:** Select the **2D Physics Simulator** as the capstone pilot, synthesizing Mathematics (2D vectors, calculus), Physics (kinematics, dynamics, collisions), and Computer Science (game loops, numerical integration, collision detection).
- **Rationale:** It embodies the core axiom: *"Knowledge organized around understanding and the ability to create."* It produces an immediately visual, interactive, and satisfying artifact.
- **Consequences:** Guides the selection of the initial 12–16 modules for Phase 4.

---

## ADR-004: Multi-Platform Architecture (Web, Desktop, Mobile & Offline-First)
- **Status:** **Accepted**
- **Date:** 2026-11-19
- **Context:** The system must not be constrained to a traditional web browser; it must eventually package seamlessly as a cross-platform desktop application (Windows, macOS, Linux) and mobile/tablet application (iOS, Android) with full offline functionality.
- **Decision:**
  1. The Core Domain & Graph Engine is implemented in 100% pure, platform-agnostic TypeScript with zero OS-native binary bindings. It executes identically in Node.js, browsers, web workers, and mobile webviews.
  2. The Presentation Layer will be built as a responsive Single Page Application (SPA / PWA) utilizing standard web technologies (HTML5 Canvas, WebGL, SVG, KaTeX).
  3. Packaging targets:
     - **Web:** Hosted Progressive Web App (PWA) with Service Worker caching.
     - **Desktop:** Native desktop wrapper via **Tauri** or **Electron** bundling local file storage.
     - **Mobile:** Native mobile wrapper via **Capacitor** or React Native WebView.
  4. Knowledge repositories are completely offline-capable: modules can be bundled locally or synchronized via IndexedDB/SQLite.
- **Consequences:** Zero vendor lock-in; true "write once, run everywhere" capability from high-end desktop workstations to offline mobile devices.

---

## ADR-005: Expansion of V1 Scope to Include 3D Physics, AI Environments, and Embodied Robotics Synthesis
- **Status:** **Accepted**
- **Date:** 2026-11-20
- **Context:** The initial pilot focused on the 2D Physics Simulator. To fully prove that the Tech Tree architecture supports multi-tiered knowledge composition and advanced real-world engineering, the user requested expanding Version 1 to include:
  1. 3D Physics Engine Pathway (Spatial math, Quaternions, 3D Collision Detection).
  2. AI in Simulated Environments Pathway (Neural Networks, Reinforcement Learning, MDPs, Policy Gradients).
  3. Embodied AI & Robotics Synthesis Pathway (Synthesizing 3D Physics + AI Control + Computer Vision + Sensor State Estimation).
- **Decision:**
  1. Expand the master roadmap to incorporate these advanced tiers into Version 1.
  2. Implement Phase 5 (Learner Interface & Tech Tree Visualizer) immediately, equipped with the interactive visualizer, module reader, and live 2D simulator, while supporting the preview and visualization of the expanded pathways.
  3. Structure Phase 6 as the Advanced Generative Content phase (curating 3D Physics, Reinforcement Learning, and Embodied Robotics modules).
  4. Preserve all strict modularity invariants: every advanced module must remain sovereign and declare explicit prerequisites down to the foundational math/physics/CS layers.
- **Consequences:** Elevates Version 1 from an educational pilot into an industry-grade knowledge infrastructure spanning first principles to modern autonomous systems.

---

## ADR-006: Adoption of the GSMS-10 Masterwork Module Standard (Zero-to-Mastery Progression)
- **Status:** **Accepted**
- **Date:** 2026-11-20
- **Context:** Initial module content, while mathematically sound, suffered from premature abstraction—introducing college-level notation ($\mathbb{R}^2$, basis vectors, matrices, norms) without intuitive bridging from middle school foundations (Class 6). This alienates beginners and makes learning passive rather than generative.
- **Decision:** Formally adopt the **Gold Standard Module Specification (GSMS-10)** as codified in `docs/standards/GOLD_STANDARD_MODULE_SPECIFICATION.md`:
  1. Every foundational module must begin from absolute zero (assuming only basic arithmetic and everyday experience) using an Anchor Paradox (e.g., The Treasure Paradox).
  2. Every module must construct an unbroken 9-level cognitive ladder spanning intuitive explanation, step-by-step mathematical derivation (no skipped steps), spatial demonstrations, misconception debunking, software edge cases, multi-disciplinary applications, complete production code, and multi-tiered mastery exercises (Class 6 to University level).
  3. The web client must embed interactive graphical visualizers directly inside the reading experience to allow hands-on manipulation of concepts.
- **Consequences:** Elevates every module from a standard textbook summary (6/10) to a world-class educational masterwork (10/10) that can teach any human being from first principles to creative mastery.

---

## ADR-007: Elevation of Differential Calculus (`math-calculus-derivatives`) to GSMS-10 & Interactive Tangent Studio
- **Status:** **Accepted**
- **Date:** 2026-11-20
- **Context:** Following the elevation of `math-vectors-2d`, `math-calculus-derivatives` required elevation from a summary stub (6/10) to the 10/10 Masterwork Standard (GSMS-10). Differential calculus is the mathematical bedrock for classical kinematics (`phys-kinematics-1d-2d`), dynamics (`phys-newtons-laws`), and numerical physics simulation (`cs-numerical-integration`).
- **Decision:**
  1. Grounded the entire topic in the everyday Speedometer Paradox and Zeno's Arrow Paradox (Class 6 intuition), demonstrating why static arithmetic collapses at $\Delta t = 0$ ($0/0$) and how the limit concept resolves it.
  2. Built an unbroken 9-level cognitive ladder with full, unskipped algebraic derivations for $f(x) = x^2$, the Binomial Power Rule, the Product Rule expanding rectangle, the Chain Rule gear ratio multiplier, and the trigonometric derivatives.
  3. Codified the kinematic motion hierarchy ($s \to v \to a \to j \to s$) with directional sign rules and engineering motivations for jerk minimization (elevator S-curves, drone flight control).
  4. Exposed the catastrophic floating-point cancellation trap in IEEE-754 double precision (why $h = 10^{-16}$ outputs $0$ and causes $100\%$ error) and proved the optimal central difference step size $h \approx \sqrt[3]{\epsilon_{\text{mach}}} \approx 10^{-5}$.
  5. Implemented a production-grade TypeScript `CalculusEngine` with central differences, second derivatives, Richardson extrapolation, and Newton-Raphson root finding.
  6. Integrated the interactive `#calculusLabBox` visualizer into the Reader Studio on `http://localhost:3000`, enabling users to manipulate $x_0$, change functions, and click "⚡ Shrink h → 0" to watch secant lines pivot onto tangent lines in real time.
- **Consequences:** Provides an accessible, rigorous, and verifiable foundation for all subsequent physics and robotics pathways.


## ADR-008: Elevation of Classical Mechanics Foundation Modules (Kinematics, Newton's Laws, Momentum Conservation) to GSMS-10
- **Context:** Modules 3, 4, and 5 (`phys-kinematics-1d-2d`, `phys-newtons-laws`, `phys-momentum-conservation`) form the mechanical spine connecting foundational mathematics (`math-vectors-2d`, `math-calculus-derivatives`) to computational simulation (`cs-numerical-integration`, `cs-collision-detection`). They required elevation from basic formulas to the 10/10 Gold Standard Module Specification.
- **Decision:**
  1. Grounded each module in intuitive historical and physical paradoxes (Galileo's Leaning Tower and Apollo 15 hammer-feather drop for kinematics; Aristotle's cart friction illusion and horse-cart paradox for Newton's laws; ice-skater push-off and Newton's cradle collision mystery for momentum).
  2. Provided complete step-by-step mathematical proofs without skipped steps: calculus and trapezoid area derivations of the four golden kinematic equations, parabolic trajectory parameter elimination, Coulomb friction on inclined planes, coupled Atwood systems, Noether's spatial translation symmetry proving internal force cancellation, 1D elastic collisions via center-of-mass and restitution frames, and 2D oblique billiard $90^\circ$ scattering via dot products.
  3. Provided production-grade TypeScript engines: `KinematicsEngine` (analytical & numerical ballistic solvers with quadratic drag), `NewtonianBody` (force accumulator, inverse mass, static/kinetic friction), and `MomentumCollisionResolver` (normal impulse scalar $J$, restitution $e$, and Baumgarte penetration stabilization).
  4. Created 5-tier multi-level practice problem sets with complete step-by-step arithmetic solutions and updated YAML manifests with 5 Bloom taxonomy levels and 5 tiered assessment questions.
- **Consequences:** All 3 modules achieve full GSMS-10 compliance, passing `npm run validate`, `npm run module:lint`, and `npm run test:ts`.


## ADR-009: Elevation of CS Foundation Modules (Programming Fundamentals, Numerical Integration, Collision Detection) to GSMS-10
- **Context:** Modules 6, 7, and 8 (`cs-prog-fundamentals`, `cs-numerical-integration`, `cs-collision-detection`) provide the foundational bridge between physical laws and discrete computational realization. They complete the core requirements of Pathway 1 (`pathway-2d-physics-simulator.yaml`).
- **Decision:**
  1. Grounded each module in historical/everyday anchor paradoxes (The Flipbook Illusion & Wall Glitch for programming; The Exploding Trampoline for numerical integration; The Ghost in the Wall & Jittering Stack for collision detection).
  2. Provided complete step-by-step mathematical proofs without skipped steps: CPU memory cache lines (64-byte burst reads) and SoA vs AoS memory bandwidth analysis, Liouville's phase-space volume conservation theorem, Explicit Euler's determinant expansion proof ($\det = 1 + \omega^2\Delta t^2 > 1$), Semi-Implicit Euler's exact symplecticity proof ($\det \equiv 1.0$), Velocity Verlet's symmetric Taylor series cancellation of odd derivative powers ($O(\Delta t^2)$ global accuracy), the CFL stability criterion ($\omega\Delta t < 2$), Separating Axis Theorem (SAT) interval projection, and Baumgarte positional stabilization with slop tolerance.
  3. Provided production-grade TypeScript engines: `DeterministicSimulationEngine` with fixed-timestep accumulator, temporal interpolation, and circular ring-buffer rollback; `NumericalIntegratorSuite` benchmarking Explicit Euler, Symplectic Euler, Velocity Verlet, and RK4 with live energy telemetry; and `CollisionPipeline2D` with spatial hash grid broadphase, SAT polygon narrowphase, and Baumgarte contact resolution.
  4. Authored 5-tier multi-level practice problem sets with complete step-by-step arithmetic solutions and updated YAML manifests with 5 Bloom taxonomy levels and 5 tiered assessment questions.
- **Consequences:** All 3 modules achieve full GSMS-10 compliance, passing schema validation, provenance linting, and unit test suites.


## ADR-010: Elevation of 3D Physics Engine Pathway (3D Vectors, Matrices & Quaternions, 3D Rigid Body Dynamics, 3D Collision BVH) to GSMS-10
- **Context:** Modules 9, 10, 11, and 12 (`math-vectors-3d`, `math-matrices-quaternions`, `phys-rigid-body-3d`, `cs-3d-collision-bvh`) constitute the entire mathematical and computational foundation of Pathway 2 (`pathway-3d-physics-engine.yaml`). They required elevation to the 10/10 Gold Standard Module Specification.
- **Decision:**
  1. Grounded each module in historical/everyday anchor paradoxes (The Room Corner & Turning Screwdriver for 3D vectors; The Stunt Jet Gyroscope Freeze & Apollo 11 alarm for matrices/quaternions; The Spinning Book & Dzhanibekov space station wingnut tumble for 3D rigid bodies; The 1,000-Room Mansion & Billion-Pixel Laser Sight for 3D BVH trees).
  2. Provided complete step-by-step mathematical proofs without skipped steps: Double Pythagoras 3D Euclidean magnitude proof, vector cross product formal determinant expansion, mutual perpendicularity dot-product proof, triple scalar product parallelepiped volume derivation, point-normal plane equation and ray-plane analytical hit equation, algebraic proof of Gimbal Lock at $\theta = \pm 90^\circ$ collapsing into $(\psi \pm \phi)$, Hamilton quaternion product algebra, quaternion sandwich rotation $p' = q p q^*$, SLERP great-circle constant angular velocity with antipodal shortest-path protection, rotational kinetic energy tensor quadratic form derivation ($T = \frac{1}{2}\vec{\omega}^T \mathbf{I} \vec{\omega}$), Euler's rotational equations of motion with rigorous eigenvalue instability proof of the intermediate principal axis ($\ddot{\epsilon}_1 - \lambda^2\epsilon_1 = 0$), gyroscopic precession frequency derivation ($\Omega_p = \tau/L$), Kay-Kajiya 3D slab ray-box test, Möller-Trumbore Cramer's rule barycentric derivation, 15-axis SAT candidate categorization for OBBs, and Surface Area Heuristic (SAH) cost optimization.
  3. Provided production-grade TypeScript engines: `MathSuite3D` (`Vector3D`, `Matrix4x4`, `Quaternion`, `Plane3D`, `Ray3D`), `RigidBody3D` (6-DoF linear & rotational dynamics, similarity transformed world inertia, torque accumulator, quaternion attitude integration), and `BVHTree` (SAH tree building, slab pruning, stack-based traversal, and Möller-Trumbore raycasting).
  4. Authored 5-tier multi-level practice problem sets with complete step-by-step arithmetic solutions and updated YAML manifests with 5 Bloom taxonomy levels and 5 tiered assessment questions.
- **Consequences:** All 4 modules achieve full GSMS-10 compliance, passing schema validation, provenance linting, and unit test suites.

---

## ADR-011: Elevation of AI Agent & Environment Pathway (Probability & Statistics, Neural Networks Foundations, Reinforcement Learning & MDPs, Deep RL Agents) to GSMS-10
- **Status:** **Accepted**
- **Date:** 2026-11-20
- **Context:** Modules 13, 14, 15, and 16 (`math-probability-statistics`, `cs-neural-networks-foundations`, `cs-reinforcement-learning-mdp`, `cs-deep-rl-agents`) constitute Pathway 3 (`pathway-ai-agent-environment.yaml`). They bridge pure classical mechanics and autonomous software decision-making under uncertainty, requiring elevation to the 10/10 Gold Standard Module Specification.
- **Decision:**
  1. Grounded each module in intuitive physical/cognitive anchor paradoxes: The 99% Accurate Medical Test Lie & Gambler's Fallacy for probability; The Four-Dot (XOR) Puzzle & First AI Winter for neural networks; The Rat in the Cheese Maze & The Instant Gratification Trap for MDPs; The Overconfident CartPole Robot & The Deadly Feedback Loop for deep RL.
  2. Delivered complete first-principles mathematical derivations without skipped steps: Kolmogorov probability axioms, expectation and variance shortcuts, Gaussian normal distribution and Central Limit Theorem derivation, Bayes' theorem and 1D sensor fusion formula, XOR algebraic non-linear inseparability proof, Universal Approximation Theorem formulation, multivariable calculus chain rule backpropagation for arbitrary layer matrices and bias vectors ($\delta^L = (a^L - y) \odot \sigma'(z^L)$, $\delta^l = ((W^{l+1})^T \delta^{l+1}) \odot \sigma'(z^l)$), Bellman Expectation and Optimality equations, Banach Fixed-Point Contraction Mapping Theorem proof ($\|T U - T V\|_\infty \le \gamma \|U - V\|_\infty$), Watkins Q-learning temporal difference updates, Policy Gradient Theorem derivation via the log-derivative trick ($\nabla_\theta J(\theta) = \mathbb{E}[\sum \nabla_\theta \log\pi(a_t \mid s_t) G_t]$), baseline invariance proof ($\mathbb{E}[\nabla_\theta \log\pi(a \mid s) b(s)] \equiv 0$), Advantage Actor-Critic (A2C), and Double DQN target decoupling.
  3. Engineered production-grade TypeScript engines: `ProbabilitySuite` (Gaussian sampling, Bayesian 1D fusion, covariance analysis), `MultiLayerPerceptron` (from-scratch matrix forward/backward passes, ReLU/Sigmoid activations, gradient descent), `GridWorldMDP` & `TabularQLearningAgent` (synchronous value iteration and epsilon-decay Q-learning), and `DeepQAgent` (circular replay buffer, online/target networks, Huber loss).
  4. Authored comprehensive 5-tier practice problem sets (Class 6 to Graduate/Research level) with unabridged step-by-step arithmetic solutions, and updated all YAML manifests to 5 Bloom levels and 5 tiered assessment questions.
- **Consequences:** Pathway 3 is fully elevated to GSMS-10 masterwork quality with verified schema compliance, zero Bloom linter warnings, and passing tests.

---

## ADR-012: Elevation of Embodied AI, Robotics, Computer Vision, and Physical Chemistry to GSMS-10 (Full 21/21 Repository Completion)
- **Status:** **Accepted**
- **Date:** 2026-11-20
- **Context:** Modules 17, 18, 19, 20, and 21 (`cs-computer-vision-foundations`, `math-kalman-filtering`, `phys-robotics-inverse-kinematics`, `cs-sim-to-real-embodied-ai`, `chem-atomic-structure`) represent the pinnacle synthesis of the Tech Tree (Pathway 4: Embodied AI & Robotics) along with pioneer physical science. They required elevation to the 10/10 Gold Standard Module Specification, achieving complete 21/21 module elevation across the entire civilizational repository.
- **Decision:**
  1. Grounded each module in historical/physical anchor paradoxes: The Pinhole Cardboard Box & The Inverted Shrunken Candle for computer vision; The Lost Submarine & The Two Imperfect Compasses for Kalman filtering; The Blindfolded Reaching Arm & The Impossible Point for inverse kinematics; The Virtual Quadruped That Tripped on a Carpet for Sim-to-Real; The 15-Inch Naval Shell Bouncing off Tissue Paper & The 99.999999999999% Empty Atom for atomic structure.
  2. Provided complete step-by-step mathematical proofs without skipped steps: Pinhole camera similar triangles perspective projection ($x_s / f = X / Z$), Intrinsic matrix $K$, Extrinsic transformation $[R \mid t]$, stereo vision disparity depth equation ($Z = f B / d$), Sobel gradient filter separable decomposition, CNN parameter compression ratio ($169,500,000\times$ vs dense MLP), Kalman filter process/measurement models, first-principles derivation of the optimal Kalman Gain matrix $K = P H^T (H P H^T + R)^{-1}$ via trace minimization of the posterior covariance matrix $\text{Tr}(P_{k|k})$, Joseph form covariance update, Extended Kalman Filter (EKF) Jacobian linearizations, Denavit-Hartenberg (DH) 4-parameter homogeneous link transforms, analytical 2-link planar arm inverse kinematics ($\theta_2 = \pm\arccos$, $\theta_1 = \text{atan2}$ subtraction), Geometric Jacobian matrix $J(\theta)$ derivation, singularity determinant proof ($\det(J) = L_1 L_2 \sin\theta_2 = 0$), Damped Least Squares (DLS) Tikhonov regularized inversion ($\Delta\theta = J^T(J J^T + \lambda^2 I)^{-1} e$), Yoshikawa manipulability measure ($w = L_1 L_2 |\sin\theta_2|$), three pillars of the Reality Gap (dynamics, sensing, latency), log-uniform sampling probability density proof ($p(x) = \frac{1}{x \ln(b/a)}$), transport delay phase lag calculation ($\Delta\phi = -\omega\tau$), teacher-student privileged distillation loss, Rutherford gold foil scattering deduction, Bohr angular momentum quantization ($L = n\hbar$), complete algebraic derivation of the Bohr radius ($a_0 \approx 0.529\text{ \AA}$) and quantized energy levels ($E_n = -13.6\text{ eV}/n^2$), Rydberg spectral emission formula, four quantum numbers ($n, l, m_l, m_s$), Aufbau/Pauli/Hund orbital filling, effective nuclear charge $Z_{\text{eff}} = Z - S$, and first-principles integration of Larmor's classical electrodynamic atomic collapse time ($\tau \approx 1.56 \times 10^{-11}\text{ s}$).
  3. Built production-grade TypeScript engines: `PinholeCamera` & `VisionProcessor` (projection with near-plane clipping, separable Gaussian blur, Sobel edge gradients), `KalmanFilter2D` (4x4 matrix kinematic state estimation with symmetrization), `Planar2LinkRobot` (analytical FK/IK, DLS numerical solver, Jacobian), `SimToRealEnvironment` (ADR dynamics sampling, circular latency delay queue, sensor corruption, low-level PD joint torque control), and `AtomicPhysicsEngine` (Bohr radius, Rydberg spectral calculator, electron configuration generator with Hund/Aufbau rules).
  4. Authored 5-tier practice problem sets (Class 6 to University/Research) with complete step-by-step arithmetic solutions, and updated all YAML manifests to 5 Bloom levels and 5 tiered assessment questions.
- **Consequences:** Every single one of the 21 modules in the Tech Tree of Knowledge is now at 10/10 Gold Standard (GSMS-10). All 49 schema targets validate with zero errors, the pedagogical linter reports zero warnings across all 21 modules, the prerequisite DAG is verified strictly acyclic, and the full test suite passes at 100%.
