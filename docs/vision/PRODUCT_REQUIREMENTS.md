# PRODUCT REQUIREMENTS DOCUMENT (PRD)

> **Product Name:** The Tech Tree of Knowledge (Version 1)  
> **Status:** Approved Baseline (Phase 0)  
> **Target Release:** Version 1.0 (Pilot Demonstration)  

---

## 1. Product Goals

1. **Demonstrate Cross-Disciplinary Knowledge Composition:** Prove that independently created and maintained knowledge modules from Mathematics, Physics, and Computer Science can be dynamically composed into an actionable learning pathway without content duplication.
2. **Deliver the Foundational Capstone (2D Physics Simulator):** Guide a learner through the prerequisite concepts and coding exercises required to build a functioning, interactive **2D Physics Simulator** from first principles.
3. **Deliver the Advanced Generative Tracks (V1 Expanded):**
   - **3D Physics & Spatial Computing Pathway:** Extending 2D vectors and mechanics to 3D rigid bodies, quaternions, and 3D collision detection.
   - **AI in Simulated Environments Pathway:** Guiding learners through probability, neural networks, Markov decision processes, and deep reinforcement learning agents.
   - **Embodied AI & Robotics Synthesis Pathway:** Uniting 3D physics engines, simulated environments, and computer vision / sensor fusion into an autonomous physical agent capable of real-world interaction.
4. **Establish an Auditable Knowledge Infrastructure:** Implement a rigorous, schema-validated content repository with strict source provenance, multi-level verification statuses, and automated dependency validation.
5. **Multi-Platform Deployment:** Deliver the interface as an offline-first responsive web application ready for packaging onto desktop (Tauri/Electron) and mobile (Capacitor/PWA).

---

## 2. User Personas

- **The Builder / Self-Directed Learner:** A curious student, hobbyist, or developer who has a concrete project goal (e.g., build a simulator) and needs an efficient, non-redundant path through the required theoretical and computational concepts.
- **The Knowledge Curator / Educator:** A subject-matter specialist who writes, verifies, refines, and maintains knowledge modules, verifying mathematical correctness and citation accuracy.
- **The System Administrator / Reviewer:** An editor responsible for evaluating content verification stages (`Draft` $\to$ `Research-Verified` $\to$ `Technically-Verified` $\to$ `Expert-Reviewed` $\to$ `Published`).

---

## 3. Functional Requirements

### 3.1 Module Management & Specification
- **FR-MOD-01:** Each module must possess a globally unique, immutable identifier (`id`, UUIDv4) and a human-readable unique slug (`slug`).
- **FR-MOD-02:** Modules must follow semantic versioning (`major.minor.patch`). Breaking changes to prerequisites or learning outcomes require a major version bump.
- **FR-MOD-03:** Modules must define structured metadata including: Discipline, Domain, Proficiency Level, Estimated Duration, and Verification Status.
- **FR-MOD-04:** Content sections must be structured to accommodate: Conceptual Exposition, Mathematical Formulations (LaTeX/KaTeX), Diagrams/Illustrations, Worked Examples, Practice Problems, Interactive Experiments/Simulations, and Summative Assessments.
- **FR-MOD-05:** Modules must include a `provenance` block listing all source citations, author/institutional provenance, access dates, license types (e.g., CC BY-SA 4.0, Public Domain), and specific supported claims.

### 3.2 Graph Engine & Dependency Management
- **FR-GRAPH-01:** Prerequisites between modules must be represented as directed edges in a Directed Acyclic Graph (DAG).
- **FR-GRAPH-02:** The system must detect and reject circular dependencies during schema validation.
- **FR-GRAPH-03:** The graph engine must support topological sorting to compute valid linear sequences for any selected subset of modules.
- **FR-GRAPH-04:** The graph engine must calculate the transitive reduction of prerequisites to eliminate redundant transitive edges where appropriate while preserving the necessary learning sequence.
- **FR-GRAPH-05:** Prerequisite gaps must be detectable: given a learner's completed modules and a target module, the engine must return the exact delta required.

### 3.3 Learning Pathway Generation
- **FR-PATH-01:** A Learning Pathway must be defined as an ordered composition of module references, a capstone project goal, and an explicit sequence rationale.
- **FR-PATH-02:** Pathways must never duplicate module content; all content must resolve dynamically from the canonical module repository.
- **FR-PATH-03:** The system must support goal-based pathway resolution (e.g., input: `goal-2d-physics-simulator`, output: topologically ordered prerequisite sequence spanning Mathematics, Physics, and Computer Science).

### 3.4 Verification & Quality Assurance Pipeline
- **FR-VERIF-01:** Every module must have an explicit verification status:
  - `draft`: Initial drafting (AI-assisted or human outline).
  - `research-verified`: Citations, factual assertions, and historical claims verified against peer-reviewed or standard academic literature.
  - `technically-verified`: Mathematical equations, worked examples, code blocks, and simulations tested and programmatically verified.
  - `expert-reviewed`: Peer-reviewed by a human subject-matter specialist.
  - `published`: Approved for general public consumption in standard pathways.
- **FR-VERIF-02:** Automated schema linting must verify that all required fields, citations, and dependency references are syntactically and referentially valid.

---

## 4. Non-Functional Requirements

- **NFR-PORT-01 (Portability):** Content and ontology schemas must be format-agnostic, human-readable, and version-controlled via Git (e.g., structured Markdown with YAML frontmatter or JSON).
- **NFR-DECOUP-01 (Decoupling):** The graph resolution and module parsing engine must have zero runtime dependencies on any specific frontend or UI framework.
- **NFR-PERF-01 (Performance):** In-memory cycle detection and topological sorting of up to 10,000 modules must execute in $< 50$ milliseconds.
- **NFR-EXT-01 (Extensibility):** Adding a new discipline (e.g., Biology, Philosophy) or a new learning activity type must require no changes to the core graph engine.
- **NFR-FUT-01 (Future-Proofing for System A):** The module schema must provide an optional, non-breaking hook for historical lineage links (`historical_influences`, `discovery_ref`), allowing future integration of the Tree of Discovery.
