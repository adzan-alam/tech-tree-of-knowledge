# MASTER ROADMAP: The Tech Tree of Knowledge

> **Execution Strategy:** Phased, gated, human-in-the-loop development. Every phase requires explicit review and approval before proceeding to the next.

---

## 🗺️ High-Level Phase Progression

```text
[Phase 0: Discovery & Master Planning] (APPROVED BASELINE)
      │
      ▼
[Phase 1: Knowledge Ontology, Schemas & Validation Engine] (COMPLETED)
      │
      ▼
[Phase 2: Core Graph Engine & Pathway Generator] (COMPLETED)
      │
      ▼
[Phase 3: Content Authoring System & Verification Pipeline] (COMPLETED)
      │
      ▼
[Phase 4: Foundational Pilot Content Creation (Math, Physics, CS, Chem)] (COMPLETED)
      │
      ▼
[Phase 5: Learner Interface & Interactive Tech Tree Visualizer] (CURRENT PHASE)
      │
      ▼
[Phase 6: Advanced Content Expansion: 3D Physics, AI Environments & Embodied Robotics]
      │
      ▼
[Phase 7: End-to-End System Testing & Quality Assurance]
      │
      ▼
[Phase 8: Version 1 Release, Multi-Platform Packaging & System A Transition]
```

---

## 📋 Phase-by-Phase Detailed Specifications

### Phase 0: Project Discovery & Architecture Blueprint
- **Status:** **Completed & Approved**
- **Objectives:** Establish vision, analyze feasibility, define requirements, design ontology, and map system architecture.
- **Key Deliverables:** Repository memory docs (`README.md`, `PROJECT_VISION.md`, `PRODUCT_REQUIREMENTS.md`, `ARCHITECTURE.md`, `KNOWLEDGE_ONTOLOGY.md`, `MODULE_SPECIFICATION.md`, `DATA_MODEL.md`, `ROADMAP.md`, `DEVELOPMENT_GUIDELINES.md`, `TESTING_STRATEGY.md`, `DECISION_LOG.md`, `CHANGELOG.md`, `CONTRIBUTING.md`).
- **Acceptance Criteria:** Master planning document approved by project principal.

---

### Phase 1: Knowledge Ontology, Schemas & Validation Engine
- **Status:** *Next Up (Pending Authorization)*
- **Objectives:** Implement formal, executable validation schemas for all entities and build a lightweight validation CLI.
- **Scope:**
  - Formal JSON Schemas for `module.yaml`, `content.md` frontmatter, `assessment.yaml`, `pathway.yaml`.
  - Schema validation test runner ensuring bad modules are immediately detected.
  - Cycle detection specification and fixture tests.
- **Deliverables:**
  - `schemas/` directory with production JSON schemas.
  - Core validation CLI tool (`validate-schemas`).
  - Automated unit test suite verifying schema validation passes on valid fixtures and fails on invalid fixtures.
- **Acceptance Criteria:** `npm test` or `pytest` runs schema validator on test fixtures with 100% pass rate.

---

### Phase 2: Core Graph Engine & Pathway Generator
- **Status:** *Queued*
- **Objectives:** Build the pure, decoupled graph traversal and pathway synthesis engine.
- **Scope:**
  - Directed Acyclic Graph (DAG) construction from filesystem modules.
  - Cycle detection using three-color DFS.
  - Topological sorting via Kahn's algorithm.
  - Transitive reduction of prerequisites.
  - Backwards-chaining goal pathway planner.
- **Deliverables:**
  - Decoupled Graph Engine library with clean API.
  - Unit tests covering cycle rejection, deep dependency graphs, disconnected components, and linear ordering.
- **Acceptance Criteria:** Graph engine accurately resolves arbitrary prerequisite chains and successfully rejects cyclic graphs.

---

### Phase 3: Content Authoring System & Verification Pipeline
- **Status:** *Queued*
- **Objectives:** Construct authoring workflows, citation validators, and verification status tracking.
- **Scope:**
  - Module scaffolding generator (`create-module --discipline ...`).
  - Source provenance linter checking citation schemas and URL/ISBN validity.
  - Verification workflow auditor tracking stages (`draft` $\to$ `published`).
- **Deliverables:**
  - Authoring CLI suite.
  - Source verification report generator.
- **Acceptance Criteria:** Authors can scaffold and lint modules in under 30 seconds with complete compliance reporting.

---

### Phase 4: Foundational Pilot Content Creation (The Generative Triad)
- **Status:** *Queued*
- **Objectives:** Curate and technically verify 12–16 golden-thread modules leading to the 2D Physics Simulator, plus a foundational Chemistry module.
- **Curated Modules:**
  1. `math-vectors-2d`: Cartesian coordinates, vector arithmetic, dot products, normalization.
  2. `math-calculus-derivatives`: Rates of change, derivatives of polynomial functions.
  3. `phys-kinematics-1d-2d`: Displacement, velocity, constant and non-constant acceleration.
  4. `phys-newtons-laws`: Inertia, $F = ma$, action-reaction, friction, normal forces.
  5. `phys-momentum-conservation`: Impulse, linear momentum, elastic and inelastic collisions.
  6. `cs-prog-fundamentals`: Program state, loops, functions, discrete time steps ($\Delta t$).
  7. `cs-numerical-integration`: Explicit Euler method vs. Velocity Verlet integration, stability and error.
  8. `cs-collision-detection`: Axis-Aligned Bounding Box (AABB) and Circle-Circle collision algorithms.
  9. `chem-atomic-structure`: Nucleus, electrons, Bohr model, periodic trends (validating ontology universality).
  10. Capstone Project: `project-2d-physics-simulator`.
- **Deliverables:** Fully written, peer-referenced, formula-verified module files with complete provenance.
- **Acceptance Criteria:** All pilot modules pass Phase 1 & 2 validators with `technically-verified` status.

---

### Phase 5: Learner Interface & Interactive Tech Tree Visualizer
- **Status:** **In Progress (Active Phase)**
- **Objectives:** Develop the web-based interactive Tech Tree visualizer, pathway explorer, rich module reader, and live physics sandbox.
- **Scope:**
  - Zoomable, pan-able interactive graph canvas displaying disciplines, domains, and module nodes with directed prerequisite edges.
  - Dynamic pathway highlighting (click any goal to see its required ancestry illuminated on the canvas).
  - Rich module reader with KaTeX mathematical formulas, code blocks, and interactive self-check quizzes.
  - Built-in real-time 2D Physics Simulator interactive canvas where users can adjust gravity, restitution, and air drag.
  - Multi-pathway selector previewing the 2D Physics, 3D Physics, AI Environment, and Embodied Robotics pathways.
- **Deliverables:** Standalone, production-grade interactive web application in `public/index.html` and `src/web/`.
- **Acceptance Criteria:** A learner can navigate the graph, inspect all modules, review derivations and formulas, take quizzes, and run the live 2D simulator.

---

### Phase 6: Advanced Generative Content: 3D Physics, AI Environments & Embodied Robotics
- **Status:** *Queued (Expanded V1 Scope)*
- **Objectives:** Curate and verify advanced higher-tier modules across 3 intersecting pathways:
  1. **3D Physics & Spatial Computing Pathway:**
     - 3D Vectors & Cross Products (`math-vectors-3d`)
     - Quaternions & Rotational Kinematics (`math-matrices-quaternions`)
     - Rigid Body Dynamics & Inertia Tensors (`phys-rigid-body-3d`)
     - 3D Collision Detection & Bounding Volume Hierarchies (`cs-3d-collision-bvh`)
  2. **AI in Simulated Environments Pathway:**
     - Probability, Statistics & Loss Functions (`math-probability-statistics`)
     - Neural Network Foundations & Backpropagation (`cs-neural-networks-foundations`)
     - Markov Decision Processes & Reinforcement Learning (`cs-reinforcement-learning-mdp`)
     - Deep Q-Learning & Policy Gradients (`cs-deep-rl-agents`)
  3. **Embodied AI & Physical Robotics Synthesis Pathway:**
     - Computer Vision & Spatial Depth Perception (`cs-computer-vision-foundations`)
     - Robotics Kinematics & Inverse Kinematics (`phys-robotics-inverse-kinematics`)
     - State Estimation & Kalman Filtering (`math-kalman-filtering`)
     - Sim-to-Real Transfer & Physics-Informed Neural Models (`cs-sim-to-real-embodied-ai`)
- **Deliverables:** Complete sovereign modules and pathway declarations for all 3 advanced tracks.
- **Acceptance Criteria:** All advanced modules pass schema validation, 0 cycles in DAG, and resolve valid cross-disciplinary pathways.

---

### Phase 7: End-to-End System Testing & Quality Assurance
- **Status:** *Queued*
- **Objectives:** Comprehensive automated regression testing across all 20+ modules, DAG algorithms, and interactive simulators.
- **Deliverables:** Automated QA test suite and formal Verification Report.
- **Acceptance Criteria:** 100% test pass rate, 0 cyclic dependencies, 100% verified citations across all modules.

---

### Phase 8: Version 1 Release, Multi-Platform Packaging & System A Transition
- **Status:** *Queued*
- **Objectives:** Release Version 1.0, package multi-platform artifacts (Web PWA, Desktop Tauri/Electron wrapper, Mobile Capacitor wrapper), finalize ADRs, and produce the formal RFC for System A (The Tree of Discovery).
- **Deliverables:** V1.0 tag, multi-platform binaries, complete repository documentation, and System A architecture blueprint.
