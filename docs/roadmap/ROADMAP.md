# MASTER ROADMAP: The Tech Tree of Knowledge

> **Execution Strategy:** Phased, gated, human-in-the-loop development. Every phase requires explicit review and approval before proceeding to the next.

---

## 🗺️ High-Level Phase Progression

```text
[Phase 0: Discovery & Master Planning] (APPROVED BASELINE)
      │
      ▼
[Phase 1: Knowledge Ontology, Schemas & Validation Engine]
      │
      ▼
[Phase 2: Core Graph Engine & Pathway Generator]
      │
      ▼
[Phase 3: Content Authoring System & Verification Pipeline]
      │
      ▼
[Phase 4: Foundational Pilot Content Creation (Math, Physics, CS, Chem)]
      │
      ▼
[Phase 5: Learner Interface & Interactive Tech Tree Visualizer]
      │
      ▼
[Phase 6: End-to-End System Testing & Quality Assurance]
      │
      ▼
[Phase 7: Version 1 Release & Tree of Discovery Architectural Transition]
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
- **Status:** *Queued*
- **Objectives:** Develop the web-based interactive Tech Tree visualizer and rich module reader.
- **Scope:**
  - Zoomable, pan-able interactive graph canvas displaying disciplines and module nodes.
  - Dynamic prerequisite highlight: clicking a module highlights its ancestry path in green.
  - Rich module reader with KaTeX mathematical formulas, syntax-highlighted code blocks, and embedded interactive canvas simulations.
- **Deliverables:** Working local web interface demonstrating graph navigation and module reading.
- **Acceptance Criteria:** Learner can click the "2D Physics Simulator" pathway, view the sequenced nodes on the canvas, open each module, and run the simulator.

---

### Phase 6: End-to-End System Testing & Quality Assurance
- **Status:** *Queued*
- **Objectives:** Comprehensive testing of code, graph resolution, mathematical accuracy, and user experience.
- **Scope:**
  - Unit tests, integration tests, end-to-end pathway progression tests.
  - Mathematical and scientific verification review.
  - Broken link and dead citation scans.
- **Deliverables:** Automated QA test suite and formal Verification Report.
- **Acceptance Criteria:** Zero test failures, zero broken dependencies, and 100% verified citations across pilot modules.

---

### Phase 7: Version 1 Release & Tree of Discovery Architectural Transition
- **Status:** *Queued*
- **Objectives:** Package Version 1, finalize documentation, and draft the formal architectural transition plan for System A (The Tree of Discovery).
- **Deliverables:** V1 Release tag, updated ADRs, user documentation, and System A RFC.
