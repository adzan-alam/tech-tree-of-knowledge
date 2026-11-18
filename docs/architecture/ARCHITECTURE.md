# SYSTEM ARCHITECTURE: The Tech Tree of Knowledge

> **Scope:** High-Level Architecture, Layering Principles, Component Boundaries & Future Extension Interfaces.

---

## 1. Architectural Philosophy

The architectural design of the **Tech Tree of Knowledge** is guided by five inviolable mandates:
1. **Separation of Concerns:** Knowledge data, dependency graphs, pathway generation, verification pipelines, and presentation rendering must remain completely decoupled.
2. **Data Independence & Local-First Portability:** The canonical source of truth for all knowledge is stored in version-controlled, human-readable structured files (Git-backed). The system must never be locked into a proprietary database schema.
3. **Controlled Complexity (Modular Monolith First):** Resist microservice sprawl and complex distributed infrastructure in early versions. A clean modular library running in-memory or backed by lightweight local persistence (SQLite) provides superior testability, zero latency, and minimal operational overhead.
4. **Deterministic Graph Operations:** Knowledge navigation and dependency management are modeled purely as Directed Acyclic Graphs (DAGs) using well-established algorithms (Kahn's algorithm, Depth-First Search with 3-color cycle detection, Tarjan's strongly connected components).
5. **Future-Proofing for System A (Tree of Discovery):** Clean extension points in the data model allow historical lineage nodes to hook into modern learning modules without modifying the core learning engine.

---

## 2. Layered Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                            Layer 4: Presentation Tier                             |
|  - Interactive Tech Tree Canvas (Zoomable Node-Link Visualizer)                   |
|  - Module Reader Studio (KaTeX Math, Interactive p5/Canvas/WebGL, Code Sandboxes) |
|  - Goal-Based Learning Pathway Dashboard                                          |
|  - Verification & Content Curation Inspector                                      |
+-----------------------------------------------------------------------------------+
                                          ▲
                                          │ REST / Local File JSON Protocol
                                          ▼
+-----------------------------------------------------------------------------------+
|                         Layer 3: Application & API Service                        |
|  - Pathway Synthesis Service (Backwards-Chaining Prerequisite Planner)            |
|  - Module Retrieval & Search Service                                              |
|  - Verification & Audit Pipeline Service                                          |
|  - User Competency & Progress Tracker (Local / IndexedDB / SQLite)               |
+-----------------------------------------------------------------------------------+
                                          ▲
                                          │ Direct Function Calls / In-Memory API
                                          ▼
+-----------------------------------------------------------------------------------+
|                        Layer 2: Domain Core & Graph Engine                        |
|  - Graph Parser & Indexer (Constructs in-memory DAG from filesystem)               |
|  - Cycle Detection & Validation Engine (Rejects circular dependencies)            |
|  - Topological Sorter (Kahn's Algorithm with multi-criteria tie-breaking)         |
|  - Semantic Schema Validator (Validates schema adherence, Bloom taxonomy, etc.)   |
|  - Transitive Reduction & Delta Planner (Calculates missing prerequisite chains)  |
+-----------------------------------------------------------------------------------+
                                          ▲
                                          │ Filesystem / Git Storage Provider
                                          ▼
+-----------------------------------------------------------------------------------+
|                   Layer 1: Sovereign Knowledge Repository (Git)                   |
|  - /modules/{discipline}/{domain}/{module_slug}/                                  |
|      - module.yaml (Metadata, prerequisites, competencies, provenance)            |
|      - content.md (Exposition, derivations, practice, code)                       |
|      - assessment.yaml (Formative & summative questions + rubrics)                |
|  - /pathways/{pathway_slug}.yaml (Goal definitions & composable module refs)       |
|  - /schemas/ (JSON Schema / Zod definitions for modules, pathways, assessments)  |
|  - /provenance/ (Shared bibliography, citation records, OER license registries)  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Subsystem Breakdown

### 3.1 Sovereign Knowledge Repository (Layer 1)
- **Local-first & Git-backed:** All modules are stored as discrete directories containing declarative YAML metadata and structured Markdown content.
- **Atomic File Layout:**
  ```text
  modules/
  ├── mathematics/
  │   └── linear-algebra/
  │       └── math-vectors-2d/
  │           ├── module.yaml
  │           ├── content.md
  │           └── assessment.yaml
  ├── physics/
  │   └── classical-mechanics/
  │       └── phys-newtons-laws/
  │           ├── module.yaml
  │           ├── content.md
  │           └── assessment.yaml
  ```
- **Portability:** Any module can be exported, cloned, or published as a standalone Open Educational Resource (OER).

### 3.2 Domain Core & Graph Engine (Layer 2)
- **Zero Framework Dependency:** Written in clean, typed code without coupling to web or UI frameworks.
- **Deterministic DAG Validation:**
  - On startup or file change, the Graph Engine scans `modules/` and builds an in-memory directed graph $G = (V, E)$, where $V$ are modules and $E = (u, v)$ indicates that $u$ is a prerequisite of $v$.
  - It runs a three-color DFS cycle detector (`WHITE`, `GRAY`, `BLACK`). If a `GRAY` node is encountered, an explicit cycle error is raised with the full circular path.
  - Generates valid topological orderings using Kahn's algorithm.

### 3.3 Application & Pathway Service (Layer 3)
- **Goal Resolution:** Given a target goal (e.g., `goal-2d-physics-simulator`), the service performs a reverse traversal from the terminal module(s) back through all ancestor prerequisites, collecting the minimum required subgraph.
- **Topological Linearization:** Sorts the resulting subgraph into a recommended sequence that honors all prerequisite constraints while grouping conceptually related modules.
- **Competency Gap Analysis:** Compares the learner's completed module set $C$ with the required pathway set $P$. The delta $D = P \setminus C$ represents the tailored curriculum.

### 3.4 Presentation Tier (Layer 4)
- **Interactive Tech Tree Canvas:** Renders the graph visually (via SVG/Canvas or D3-style layout), enabling learners to explore nodes, zoom into disciplines, and trace dependency lines.
- **Rich Module Reader:** Renders mathematical formulas using KaTeX ($LaTeX$), diagrams using Mermaid and SVG, and embeds runnable code/simulations via standard web containers.

---

## 4. Future-Proofing: The Tree of Discovery Extension Bridge

To ensure System A (The Tree of Discovery) can be integrated in later versions without structural refactoring, the `module.yaml` schema includes an explicit extension hook:

```yaml
# Extension Point for Future System A (Tree of Discovery)
discovery_context:
  historical_significance: "Formalized during the 17th-century Newtonian synthesis."
  historical_influences:
    - discovery_id: "disc-galileo-kinematics-1638"
      relationship: "formalizes_empirical_observation"
    - discovery_id: "disc-kepler-laws-1609"
      relationship: "generalizes_empirical_model"
  related_instruments:
    - "inst-inclined-plane"
    - "inst-water-clock"
```

In Version 1, these fields are treated as optional metadata. In subsequent versions, the Tree of Discovery will consume these references to map historical breakthroughs directly onto modern pedagogical modules.
