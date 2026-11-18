# KNOWLEDGE ONTOLOGY SPECIFICATION

> **Purpose:** Formal semantic ontology defining the classification, entities, and relationship models for human knowledge in the Tech Tree.

---

## 1. Ontological Entities Hierarchy

```text
Universe of Knowledge
└── Discipline (e.g., Mathematics, Physics, Computer Science, Chemistry)
    └── Domain (e.g., Classical Mechanics, Linear Algebra, Algorithms)
        └── Knowledge Module (e.g., 2D Vectors & Coordinate Systems)
            ├── Learning Objective / Competency (Bloom's Taxonomy)
            ├── Learning Activity (Exposition, Derivation, Simulation)
            ├── Assessment Unit (Formative, Summative, Rubric)
            └── Capstone Creative Project
```

---

## 2. Entity Definitions

### 2.1 Discipline
The broadest category of human inquiry. Disciplines provide top-level organization and mental partitioning.
- **Attributes:** `id`, `slug`, `name`, `description`, `icon`, `color_token`.
- **Version 1 Pilot Disciplines:**
  1. `mathematics`: The language of structure, space, quantity, and change.
  2. `physics`: The fundamental laws governing matter, energy, space, and time.
  3. `computer-science`: The theory, architecture, and engineering of computation and information.
  4. `chemistry`: The study of matter, atomic structure, bonding, and chemical transformations.

### 2.2 Domain
A major subdivision within a discipline sharing common theoretical foundations, methodologies, or historical conventions.
- **Examples in Physics:** `classical-mechanics`, `thermodynamics`, `electromagnetism`, `optics`.
- **Examples in Mathematics:** `algebra`, `geometry`, `calculus`, `linear-algebra`, `discrete-math`.
- **Examples in Computer Science:** `programming-fundamentals`, `data-structures-and-algorithms`, `numerical-computing`, `computer-systems`.

### 2.3 Knowledge Module (The Sovereign Unit)
The primary building block of the Tech Tree. A module is an independent, versioned, reusable instructional package designed around specific competencies.
- **Atomic vs. Composite:**
  - *Atomic Module:* Focuses on a single tightly focused concept (estimated duration: 30–60 minutes), e.g., `math-vectors-2d`.
  - *Composite Module:* Assembles atomic modules into a cohesive thematic unit with integrated worked examples and multi-part labs.
- **Mandatory Invariants:**
  - Must have a stable UUID and human-readable slug.
  - Must declare explicit prerequisites (or declare `prerequisites: []` for axiomatic roots).
  - Must declare measurable learning objectives tagged with Bloom's Taxonomy.
  - Must maintain full source provenance and verification status.

### 2.4 Learning Objective (Competency)
A specific, testable statement describing what a learner will be able to do upon mastering the module.
- **Classification:** Categorized according to revised **Bloom's Taxonomy**:
  1. `remember`: Recall facts, basic terms, and definitions.
  2. `understand`: Explain ideas or concepts in own words.
  3. `apply`: Use information in new situations, solve standard equations.
  4. `analyze`: Draw connections among ideas, decompose complex systems.
  5. `evaluate`: Justify a stand or decision, assess physical approximations.
  6. `create`: Produce new or original work, build a simulation or tool.

### 2.5 Learning Pathway
A composable, directed sequence of knowledge modules designed to guide a learner from their current state of knowledge to a specific conceptual mastery or creative goal.
- **Key Characteristic:** Pathways contain **references** to modules, never copied module content.

---

## 3. Proficiency Levels (Competency Tiers)

To liberate knowledge from arbitrary school-grade boundaries (e.g., Class 10, Grade 12, Sophomore), the Tech Tree categorizes modules into **Proficiency Tiers**:

| Tier | Name | Target Competence & Cognitive Depth | Typical Academic Analog |
| :---: | :--- | :--- | :--- |
| **1** | **Foundational** | Intuitive grasp, qualitative models, basic arithmetic and geometric representations, visual phenomena. | Middle School / Introductory High School |
| **2** | **Intermediate** | Operational algebra, formal physical laws, vector manipulation, procedural computation, standard laboratory experiments. | High School (CBSE 11-12 / AP / IB) |
| **3** | **Advanced** | Calculus-based formulations, differential equations, theoretical proofs, numerical analysis, algorithmic complexity. | Undergraduate University (B.S. Level) |
| **4** | **Specialist** | Variational principles, tensor calculus, non-linear dynamics, advanced quantum/solid-state mechanics, distributed systems. | Postgraduate / Master's / Doctoral |

---

## 4. Relationship Types (Graph Edges)

The Knowledge Graph supports several explicit relationship types between modules:

1. `prerequisite_of` (Strict Dependency): Module $A$ must be understood before Module $B$ can be comprehended. (Enforces the DAG).
2. `builds_upon` (Recommended Progression): Module $B$ directly extends concepts in Module $A$, but $A$ is not an absolute mathematical prerequisite.
3. `cross_disciplinary_application` (Horizontal Connection): Shows how a concept in Discipline $X$ is applied in Discipline $Y$ (e.g., `math-vectors-2d` applied in `phys-kinematics-2d` and `cs-graphics-rendering`).
4. `historical_antecedent` (Future System A Hook): Indicates historical influence or discovery lineage.
