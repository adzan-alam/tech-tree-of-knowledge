# THE PROJECT CHRONICLE: Genesis & Evolution of the Tech Tree

> *"If we are building the Tech Tree of human civilization's knowledge, we must also preserve an unbroken chronicle of our own history, so that future thinkers, builders, and custodians understand why every brick was placed, what mistakes were avoided, and how the tree grew."*

---

## 🧭 Philosophical Genesis & Origins

- **Project Title:** The Tech Tree of Knowledge (Tech Tree of Civilization)
- **Genesis Date:** November 18, 2026
- **Founders & Custodians:** Adzan Alam (Project Principal) & Antigravity (Technical Co-founder & Systems Architect)

The initiative began with a fundamental recognition: human education is paralyzed by obsolete institutional structures—departmental silos, arbitrary age-grade brackets, and passive textual consumption. The objective of this project is to construct an interconnected, sovereign, and generative knowledge infrastructure where understanding is coupled directly to the creative ability to build real systems.

---

## 📜 The Dual-System Architecture
From inception, the architecture was divided into two intertwined systems:
1. **System A — The Tree of Discovery:** The historical, epistemological lineage of how scientific instruments, experiments, hypotheses, and thinkers led to downstream breakthroughs across human history. (Architecturally preserved, deferred from V1).
2. **System B — The Tree of Knowledge / Learning:** Sovereign, versioned, reusable knowledge modules composed into dynamic, project-oriented learning pathways (the operational target of Version 1).

---

## 🏛️ Epochs & Milestones

### Epoch 1: Foundations & Architecture (November 2026)
- **Phase 0 — Project Discovery, Ontology & Master Planning:**
  - Codified the master vision and core requirements.
  - Designed the knowledge ontology (Disciplines, Domains, Modules, Competencies, Pathways).
  - Selected the **2D Physics Simulator Pathway** (Mathematics + Physics + Computer Science) as the golden thread demonstrating cross-disciplinary composition.
  - Established the file-first Git architecture and decoupled graph engine.
  - Established this historical chronicle and organized repository memory.
  - *Phase Report:* [`phase-reports/PHASE_0_DISCOVERY_REPORT.md`](./phase-reports/PHASE_0_DISCOVERY_REPORT.md)

- **Phase 1 — Knowledge Ontology, Schemas & Validation Engine:**
  - Formulated formal JSON Schemas (`module.schema.json`, `pathway.schema.json`, `assessment.schema.json`).
  - Implemented the TypeScript schema validation engine with Ajv and YAML support.
  - Built the `techtree-validate` CLI tool for recursive module linting.
  - Established automated test suite with valid and invalid fixtures (100% test pass rate).
  - *Phase Report:* [`phase-reports/PHASE_1_SCHEMA_REPORT.md`](./phase-reports/PHASE_1_SCHEMA_REPORT.md)

- **Phase 2 — Core Graph Engine & Pathway Generator:**
  - Implemented platform-agnostic `KnowledgeGraph` with bidirectional adjacency lists.
  - Engineered 3-color DFS cycle detector returning explicit circular paths.
  - Engineered Kahn's topological sorter with proficiency tier prioritization.
  - Implemented backwards-chaining pathway synthesis with competency delta calculation.
  - Added discovery of recommended / complementary modules along pathways.
  - Codified ADR-004 (Multi-Platform Client Portability: Web, Desktop, Mobile, Offline-first).
  - Linked GitHub remote (`adzan-alam/tech-tree-of-knowledge`) and established automated cloud sync.
  - *Phase Report:* [`phase-reports/PHASE_2_GRAPH_ENGINE_REPORT.md`](./phase-reports/PHASE_2_GRAPH_ENGINE_REPORT.md)

- **Phase 3 — Content Authoring System & Verification Pipeline:**
  - Built `ModuleScaffolder` generating valid sovereign module directories (`module.yaml`, `content.md`, `assessment.yaml`).
  - Built `ProvenanceLinter` enforcing locator requirements (URL/ISBN/DOI) and Bloom's Taxonomy active verb alignment.
  - Built `VerificationAuditor` compiling repository-wide readiness reports across verification tiers.
  - Added CLI suite (`techtree-author create`, `lint`, `audit`).
  - Expanded test suite to 21 automated tests (100% pass rate).
  - *Phase Report:* [`phase-reports/PHASE_3_AUTHORING_REPORT.md`](./phase-reports/PHASE_3_AUTHORING_REPORT.md)

- **Phase 4 — Foundational Pilot Content Creation (The Generative Triad):**
  - Curated 9 sovereign, peer-referenced, mathematically verified modules across Mathematics, Physics, Computer Science, and Chemistry.
  - Authored complete `module.yaml`, KaTeX-equipped `content.md`, and evaluation rubrics `assessment.yaml` for all 9 modules.
  - Formulated the capstone `pathways/pathway-2d-physics-simulator.yaml`.
  - Audited full repository: 100% schema validation pass, 0 cycles in DAG, all 9 modules classified as `technically-verified`.
  - *Phase Report:* [`phase-reports/PHASE_4_PILOT_CONTENT_REPORT.md`](./phase-reports/PHASE_4_PILOT_CONTENT_REPORT.md)

- **Phase 5 — Learner Interface & Interactive Tech Tree Visualizer:**
  - Built interactive web application in `public/index.html` with pan/zoom SVG graph canvas, discipline filtering, and dynamic prerequisite ancestor illumination.
  - Built multi-pathway explorer with timeline sequencing and competency progress tracking.
  - Built module reader studio with live KaTeX formula rendering and self-checking interactive quizzes.
  - Built live embedded 2D Physics Simulator sandbox running Velocity Verlet integration, drag, gravity, and circle-circle restitution impulses.
  - Created zero-dependency local web server (`src/web/server.ts`, `npm run serve`).
  - Formally codified ADR-005 expanding V1 scope to 3D Physics, AI Environments, and Embodied Robotics Synthesis.
  - *Phase Report:* [`phase-reports/PHASE_5_LEARNER_INTERFACE_REPORT.md`](./phase-reports/PHASE_5_LEARNER_INTERFACE_REPORT.md)

---

## 🔮 Planning Ahead & Planning Behind

The development of the Tech Tree adheres strictly to the rule of **Retrospective & Prospective Equilibrium**:
- **Planning Behind (Retrospective Memory):**
  - We never discard historical decisions or overwrite past rationale.
  - Every architectural choice is recorded in [`docs/architecture/DECISION_LOG.md`](../architecture/DECISION_LOG.md).
  - Every completed phase preserves an unedited completion report in `docs/chronicle/phase-reports/`.
  - Every Git commit reflects a discrete, verifiable step of civilizational progress.
- **Planning Ahead (Prospective Horizon):**
  - Every current phase is bound by the downstream requirements of future phases (e.g., Phase 1 schemas must anticipate Phase 5 interactive web rendering and post-V1 System A discovery links).
  - Risks are identified before writing code, not discovered after release.
