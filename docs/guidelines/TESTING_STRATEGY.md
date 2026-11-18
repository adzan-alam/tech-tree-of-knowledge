# TESTING STRATEGY & QUALITY ASSURANCE

> **Standard:** Multi-Dimensional Quality Assurance for the Tech Tree

---

## 1. Multi-Tier Testing Pyramid

The Tech Tree requires two distinct testing vectors: **Software Engineering Tests** and **Knowledge & Pedagogical Tests**.

```text
               / \
              /   \
             / E2E \       <-- Full Pathway & UI Navigation Tests
            /-------\
           / Knowledge\    <-- Math correctness, Citation verification, Bloom alignment
          /-------------\
         /  Integration  \ <-- Graph generation, Topological sorting, Pathway resolution
        /-----------------\
       /    Unit Tests     \ <-- Schema validators, Cycle detection, Pure algorithms
      /---------------------\
```

---

## 2. Software Engineering Test Categories

### 2.1 Unit Testing
- **Schema Validation Tests:** Ensure all valid modules pass and every missing or malformed field triggers a distinct schema validation error.
- **Graph Algorithm Tests:**
  - Cycle detection: Verify that cyclic dependency chains (e.g., $A \to B \to C \to A$) are detected and rejected with accurate error paths.
  - Topological sorting: Verify correct ordering on complex DAGs with parallel branches and deep serial chains.
  - Transitive reduction: Verify that redundant edges (e.g., $A \to B, B \to C, A \to C$) are simplified when constructing linear learning paths.

### 2.2 Integration Testing
- **Full Repository Graph Integrity:** Test runner parses every single module in `modules/`, builds the unified knowledge graph, and asserts zero unresolved prerequisites, zero duplicate slugs, and zero orphaned references.
- **Pathway Synthesis Integration:** Test that all defined pathways in `pathways/` resolve to complete, contiguous, topologically valid sequences of modules.

---

## 3. Knowledge & Pedagogical Verification

Knowledge is not merely text; it is an assertion of physical, mathematical, or empirical truth.

1. **Mathematical Accuracy:** Every equation must be written in valid KaTeX syntax. Dimensional analysis must balance across both sides of physical equations ($[F] = M L T^{-2}$).
2. **Computational Verification:** Code blocks demonstrating numerical methods (e.g., Euler integration, Verlet integration) must be backed by automated test scripts that verify numerical stability and error convergence.
3. **Source Provenance Auditing:** Automated tools verify that every source listed has an author, year, valid URL or ISBN, and specific claims attributed to it.
4. **Bloom's Taxonomy Verification:** Learning objectives must strictly utilize approved action verbs matching the declared Bloom tier.
