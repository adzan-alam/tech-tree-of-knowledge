# CHANGELOG: The Tech Tree of Knowledge

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.0] - 2026-11-19 (Phase 4: Foundational Pilot Content Creation)

### Added
- **Sovereign Knowledge Modules:**
  - `modules/mathematics/linear-algebra/math-vectors-2d/`: Complete manifest, exposition, and assessment.
  - `modules/mathematics/calculus/math-calculus-derivatives/`: Complete manifest, exposition, and assessment.
  - `modules/physics/classical-mechanics/phys-kinematics-1d-2d/`: Complete manifest, exposition, and assessment.
  - `modules/physics/classical-mechanics/phys-newtons-laws/`: Complete manifest, exposition, and assessment.
  - `modules/physics/classical-mechanics/phys-momentum-conservation/`: Complete manifest, exposition, and assessment.
  - `modules/computer-science/programming/cs-prog-fundamentals/`: Complete manifest, exposition, and assessment.
  - `modules/computer-science/numerical-computing/cs-numerical-integration/`: Complete manifest, exposition, and assessment.
  - `modules/computer-science/graphics-simulation/cs-collision-detection/`: Complete manifest, exposition, and assessment.
  - `modules/chemistry/physical-chemistry/chem-atomic-structure/`: Complete manifest, exposition, and assessment (proving ontology generality).
- **Capstone Cross-Disciplinary Pathway:**
  - `pathways/pathway-2d-physics-simulator.yaml`: Sequences the 8 mechanics and computational modules into an unbroken generative pathway culminating in the 2D Physics Simulator.
- **Verification Audit:**
  - All 9 modules verified with `npm run validate`, `npm run graph:check`, `npm run module:lint`, and `npm run module:audit` (0 errors, 100% pass rate).

---

## [0.4.0] - 2026-11-19 (Phase 3: Content Authoring System & Verification Pipeline)

### Added
- **Module Scaffolder Subsystem:**
  - `src/authoring/scaffold.ts`: Automated sovereign module generator outputting compliant `module.yaml`, `content.md`, and `assessment.yaml`.
- **Provenance & Pedagogical Linter:**
  - `src/authoring/provenance-linter.ts`: Strict citation checker requiring verified locators (URL/ISBN/DOI) and Bloom's Taxonomy active verb auditing.
  - KaTeX mathematical delimiter syntax validation.
- **Verification Workflow Auditor:**
  - `src/authoring/verification-auditor.ts`: Repository-wide quality auditor evaluating verification readiness.
- **Authoring Studio CLI Commands:**
  - `src/cli/author.ts`: `techtree-author` CLI with `create`, `lint`, and `audit` commands.
  - Added npm scripts: `npm run module:create`, `npm run module:lint`, `npm run module:audit`.
- **Automated Tests:**
  - `tests/unit/authoring.test.ts`: Expanded test suite from 15 to 21 tests (100% pass rate).

---

## [0.3.0] - 2026-11-19 (Phase 2: Core Graph Engine & Pathway Generator)

### Added
- **Core Graph Engine:**
  - `src/core/graph/knowledge-graph.ts`: Decoupled, in-memory knowledge DAG indexer.
  - `src/core/graph/types.ts`: Graph edge, node, cycle result, and pathway resolution types.
  - Three-color Depth-First Search (`WHITE`, `GRAY`, `BLACK`) cycle detection engine.
  - Kahn's algorithm topological sorting with deterministic tie-breaking.
  - Backwards-chaining goal pathway resolution and delta competency calculations.
  - Recommended and complementary module surfacing along learning paths.
  - Transitive redundancy identification.
- **Graph CLI Subsystem:**
  - `src/cli/graph.ts`: `techtree-graph` CLI with `check` and `pathway` commands.
  - Scripts `npm run graph:check` and `npm run graph:path`.
- **Architectural Records:**
  - `docs/architecture/DECISION_LOG.md`: Added ADR-004 (Multi-Platform Client Portability: Web, Desktop, Mobile, Offline-first).
- **Automated Tests:**
  - `tests/unit/knowledge-graph.test.ts`: Comprehensive tests for cycle detection, topological sorting, pathway resolution, and transitive reduction (15/15 tests passing across project).
- **Cloud Synchronization:**
  - Linked GitHub remote `https://github.com/adzan-alam/tech-tree-of-knowledge.git` on `main`.

---

## [0.2.0] - 2026-11-19 (Phase 1: Knowledge Ontology, Schemas & Validation Engine)

### Added
- **Validation Schemas:**
  - `schemas/module.schema.json`: Complete schema for sovereign module manifests.
  - `schemas/pathway.schema.json`: Schema for composable learning pathways.
  - `schemas/assessment.schema.json`: Schema for module assessments and rubrics.
- **Validation Engine & CLI:**
  - `src/core/validation/schema-validator.ts`: TypeScript validation engine utilizing Ajv.
  - `src/core/validation/types.ts`: Comprehensive domain TypeScript types.
  - `src/cli/validate.ts`: `techtree-validate` CLI scanner.
- **Automated Test Suite:**
  - Positive fixtures in `tests/fixtures/valid/`.
  - Negative fixtures in `tests/fixtures/invalid/`.
  - Unit test suite `tests/unit/schema-validator.test.ts` (5/5 tests passing).
- **Chronicle & Institutional Memory:**
  - `docs/chronicle/phase-reports/PHASE_1_SCHEMA_REPORT.md`: Detailed completion report.

---

## [0.1.0] - 2026-11-18 (Phase 0: Project Discovery & Architecture Baseline)

### Added
- **Master Vision & Architectural Specifications:** Completed Phase 0 planning, approved by project leadership.
- **Repository Institutional Memory Suite:**
  - `README.md`: High-level summary, mission statement, and documentation map.
  - `PROJECT_VISION.md`: Deep philosophical foundations and dual-system paradigm.
  - `PRODUCT_REQUIREMENTS.md`: Formal functional (FR) and non-functional (NFR) requirements.
  - `ARCHITECTURE.md`: Layered component boundaries, data independence, and System A forward-compatibility.
  - `KNOWLEDGE_ONTOLOGY.md`: Entity definitions (Discipline, Domain, Module, Competency, Pathway) and Bloom-aligned tiers.
  - `MODULE_SPECIFICATION.md`: Sovereign module folder structure, manifest schema, and markdown convention.
  - `DATA_MODEL.md`: Formal JSON schemas for Modules and Pathways, ER diagram.
  - `ROADMAP.md`: Phased progression from Phase 0 to Phase 7.
  - `DEVELOPMENT_GUIDELINES.md`: Engineering and coding standards.
  - `TESTING_STRATEGY.md`: Dual-vector testing strategy (Software + Pedagogical QA).
  - `DECISION_LOG.md`: Initial Architecture Decision Records (ADR-001 through ADR-003).
  - `CONTRIBUTING.md`: Workflow standards for authors, reviewers, and engineers.
