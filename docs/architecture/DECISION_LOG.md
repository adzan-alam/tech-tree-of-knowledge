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
