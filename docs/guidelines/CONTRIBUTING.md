# CONTRIBUTING GUIDELINES

> How to curate, verify, and engineer knowledge for the Tech Tree.

---

## 1. Principles of Contribution

1. **Accuracy Above Speed:** Never rush unverified content. A module with 3 verified equations and traceable sources is infinitely superior to 50 unvetted pages.
2. **Sovereignty:** Every module must stand independently. Never assume a reader has read a module from another discipline unless it is explicitly declared in `relationships.prerequisites`.
3. **Traceability:** Cite peer-reviewed literature, standard university textbooks, or verified open-access archives. Never assert non-obvious facts without a citation.

---

## 2. Verification Levels

Every module undergoes a strict peer review process:
1. `draft`: Authoring in progress. May contain incomplete sections.
2. `research-verified`: All sources checked for legitimacy, citations attached.
3. `technically-verified`: All formulas proven, code tested, and simulations verified.
4. `expert-reviewed`: Validated by an educational or scientific specialist.
5. `published`: Available for public learning pathways.

---

## 3. Pull Request Checklist

Before submitting a PR containing a new module or code changes:
- [ ] Module conforms to `schemas/module.schema.json`.
- [ ] No circular dependencies introduced (`npm test` or `pytest`).
- [ ] Equations render cleanly in KaTeX.
- [ ] Code examples execute without runtime errors.
- [ ] All claims cite credible sources in `provenance.sources`.
