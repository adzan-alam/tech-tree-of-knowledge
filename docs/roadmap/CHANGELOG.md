# CHANGELOG: The Tech Tree of Knowledge

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
