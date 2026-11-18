# DEVELOPMENT GUIDELINES & ENGINEERING STANDARDS

> **Standard:** Tech Tree Engineering Standard (TTES-1.0)

---

## 1. Core Operating Principles

1. **Understand Before Implementing:** Never write a line of code or generate a module without knowing its architectural purpose, ontological position, and verification requirement.
2. **Modularity is Non-Negotiable:** Components must communicate via typed, explicit interfaces. No tight coupling between the presentation layer and the knowledge repository.
3. **Local-First & Git-Backed:** The filesystem is the source of truth. Data must be readable, diffable, and editable using standard text editors.
4. **Zero Silent Errors:** Validation failures, cyclic dependencies, missing citations, or broken prerequisite references must raise loud, actionable errors immediately.
5. **No Premature Optimization:** Prefer simple, elegant, deterministic algorithms (e.g., standard in-memory graph traversals) over distributed or external databases until scale empirically demands it.

---

## 2. Directory Layout Convention

```text
tech-tree/
├── docs/                     # Architectural specs and design records
├── modules/                  # Canonical Knowledge Repository
│   ├── mathematics/
│   ├── physics/
│   ├── computer-science/
│   └── chemistry/
├── pathways/                 # Composable goal-based pathways
├── schemas/                  # Formal JSON/YAML schemas
├── src/                      # Core software source code
│   ├── core/                 # Decoupled domain models, graph algorithms, validation
│   ├── authoring/            # Scaffolding tools, linters, provenance verifiers
│   ├── api/                  # Application services and query interfaces
│   └── web/                  # Presentation UI, visual tree canvas, module reader
└── tests/                    # Multi-level test suites
    ├── unit/
    ├── integration/
    ├── knowledge/
    └── fixtures/
```

---

## 3. Coding & Syntax Conventions

- **Typing:** Strict typing throughout (TypeScript for JS/TS; Python 3.12+ type annotations and Pydantic if Python).
- **Pure Functions for Core Logic:** Graph algorithms (cycle detection, topological sort, transitive reduction) must be pure functions with zero side effects.
- **Error Messages:** Every graph error must explain:
  1. What entity triggered the error.
  2. The exact chain of relationships causing the failure.
  3. Actionable remediation steps for the author.
