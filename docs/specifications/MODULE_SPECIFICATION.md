# KNOWLEDGE MODULE SPECIFICATION

> **Standard:** Tech Tree Module Specification (TTMS-v1.0)  
> **Status:** Draft Proposal (Phase 0)  

---

## 1. Directory Structure of a Module

Each knowledge module is stored in its own sovereign directory under `modules/{discipline}/{domain}/{module_slug}/`:

```text
modules/physics/classical-mechanics/phys-newtons-laws/
├── module.yaml         # Structured metadata, prerequisites, competencies, provenance
├── content.md          # Core pedagogical text, LaTeX math, diagrams, derivations
├── exercises.yaml      # Practice problems, worked solutions, coding challenges
├── assessment.yaml     # Summative evaluation questions, scoring rubric
└── assets/             # Vector diagrams, SVG illustrations, interactive scripts
```

---

## 2. Schema Specification: `module.yaml`

The `module.yaml` file is the machine-readable manifest defining the module's identity, dependencies, and verification status:

```yaml
# ==============================================================================
# TECH TREE KNOWLEDGE MODULE MANIFEST (TTMS-v1.0)
# ==============================================================================

id: "550e8400-e29b-41d4-a716-446655440001"    # Immutable UUIDv4
slug: "phys-newtons-laws"                     # Unique human-readable identifier
title: "Newton's Laws of Motion & Classical Dynamics"
summary: "Foundational laws governing the motion of macroscopic bodies, force interactions, mass, friction, and inertial reference frames."

version: "1.0.0"                              # Semantic versioning (SemVer 2.0.0)
created_at: "2026-11-18T22:00:00Z"
updated_at: "2026-11-18T22:00:00Z"

classification:
  discipline: "physics"                       # Top-level discipline
  domain: "classical-mechanics"               # Sub-discipline domain
  proficiency_tier: 2                         # 1=Foundational, 2=Intermediate, 3=Advanced, 4=Specialist
  difficulty_score: 0.45                      # Continuous rating [0.0 - 1.0]
  estimated_duration_minutes: 90

verification:
  status: "technically-verified"              # draft | research-verified | technically-verified | expert-reviewed | published
  reviewed_by: ["verifier-agent-01", "human-reviewer-alice"]
  verification_date: "2026-11-18"
  notes: "Derivations and simulation code verified; unit tests passing."

relationships:
  prerequisites:
    - slug: "phys-kinematics-1d-2d"
      min_version: "^1.0.0"
      rationale: "Requires vector acceleration and kinematic equations of motion."
    - slug: "math-vectors-2d"
      min_version: "^1.0.0"
      rationale: "Requires vector addition, scalar multiplication, and orthogonal decomposition."
  
  related_modules:
    - slug: "phys-work-energy"
      relationship: "subsequent_concept"
    - slug: "cs-numerical-integration"
      relationship: "computational_application"

learning_objectives:
  - id: "obj-newton-1"
    statement: "State and explain the principle of inertia and the concept of inertial reference frames."
    bloom_level: "understand"
  - id: "obj-newton-2"
    statement: "Formulate Newton's Second Law as a differential vector equation (F_net = dp/dt = m*a) and solve 2D multi-body force problems."
    bloom_level: "apply"
  - id: "obj-newton-3"
    statement: "Apply Newton's Third Law to identify action-reaction pairs in coupled mechanical systems without confounding internal and external forces."
    bloom_level: "analyze"

practical_applications:
  - title: "2D Particle Physics Engine Step"
    type: "computational_simulation"
    description: "Calculate net forces from gravity and air resistance to update particle acceleration in a discrete time step."

provenance:
  sources:
    - id: "src-halliday-resnick"
      citation: "Halliday, D., Resnick, R., & Walker, J. (2018). Fundamentals of Physics (11th ed.). Wiley."
      isbn: "978-1119460138"
      license: "All Rights Reserved (Referenced for scientific consensus)"
      claims_supported: ["Newton's laws statements", "friction models"]
    - id: "src-feynman-lectures-vol1"
      citation: "Feynman, R. P., Leighton, R. B., & Sands, M. (1963). The Feynman Lectures on Physics, Vol. I, Chapter 9: Newton's Laws of Dynamics. Caltech."
      url: "https://www.feynmanlectures.caltech.edu/I_09.html"
      license: "Free to read online (Educational citation)"
      claims_supported: ["Operational definition of force and inertial frames"]

discovery_context:                            # System A Future Extension Hook
  historical_significance: "Published in Philosophiæ Naturalis Principia Mathematica (1687), establishing modern physics."
  historical_influences:
    - discovery_id: "disc-galileo-inertia"
    - discovery_id: "disc-kepler-planetary-motion"
```

---

## 3. Structure of `content.md`

`content.md` contains the educational narrative formatted in standard GitHub Flavored Markdown with KaTeX math blocks:

```markdown
# Newton's Laws of Motion

## 1. Intuitive Overview & Conceptual Foundations
...

## 2. Mathematical Formalism
Newton's Second Law for a body of constant mass $m$ is expressed as:
$$ \vec{F}_{\text{net}} = \sum_{i=1}^{n} \vec{F}_i = m \vec{a} = m \frac{d^2\vec{r}}{dt^2} $$

In Cartesian 2D coordinates:
$$ F_{\text{net}, x} = m a_x = m \frac{d v_x}{dt} $$
$$ F_{\text{net}, y} = m a_y = m \frac{d v_y}{dt} $$

## 3. Worked Examples
...

## 4. Interactive Simulation & Practical Computation
...
```

---

## 4. Verification Workflow Requirements

1. **Schema Validation:** Automated CI/CD tool validates `module.yaml` against `schemas/module.schema.json`.
2. **DAG Integrity:** CI/CD builds the entire graph and asserts zero cycles and zero broken prerequisite slugs.
3. **Citation Audit:** Every factual section must have a corresponding source entry in `provenance.sources`.
