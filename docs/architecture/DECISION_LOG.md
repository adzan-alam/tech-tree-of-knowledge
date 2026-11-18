# ARCHITECTURE DECISION LOG (ADR)

> This document maintains the permanent chronological record of all significant architectural, ontological, and engineering decisions.

---

## ADR-001: Separation of System A (Tree of Discovery) and System B (Tree of Knowledge)
- **Status:** **Accepted**
- **Date:** 2026-11-18
- **Context:** The master vision encompasses both the historical evolution of scientific ideas (Tree of Discovery) and the practical, competency-driven learning system (Tree of Knowledge). Building both simultaneously risks extreme scope creep and delayed value delivery.
- **Decision:** Explicitly defer the operational implementation of System A to post-V1, while keeping System B as the strict focus of Version 1. However, introduce reserved `discovery_context` hooks in the module schema to guarantee forward compatibility.
- **Consequences:** Accelerates V1 delivery while avoiding costly architectural rework when System A is introduced.

---

## ADR-002: Sovereign, File-First Knowledge Storage (Git-Backed)
- **Status:** **Accepted**
- **Date:** 2026-11-18
- **Context:** We evaluated using an external graph database (e.g., Neo4j) or relational database (PostgreSQL) vs. a Git-backed, file-first storage model (YAML metadata + Markdown content).
- **Decision:** Store all canonical modules, pathways, and schemas as declarative files in the repository. Maintain in-memory graph structures during runtime.
- **Rationale:**
  1. Complete version control, branchability, and pull-request-based peer review.
  2. Maximum portability; zero proprietary database lock-in.
  3. In-memory DAG operations on thousands of nodes execute in milliseconds, rendering external graph DB overhead completely unnecessary for V1.
- **Consequences:** Content is human-readable, easily diffable, and editable with standard developer tools. Fast CI/CD validation.

---

## ADR-003: 2D Physics Simulator as the V1 Pilot Anchor
- **Status:** **Accepted**
- **Date:** 2026-11-18
- **Context:** We need a concrete, compelling demonstration that cross-disciplinary modules can be composed into an actionable learning pathway.
- **Decision:** Select the **2D Physics Simulator** as the capstone pilot, synthesizing Mathematics (2D vectors, calculus), Physics (kinematics, dynamics, collisions), and Computer Science (game loops, numerical integration, collision detection).
- **Rationale:** It embodies the core axiom: *"Knowledge organized around understanding and the ability to create."* It produces an immediately visual, interactive, and satisfying artifact.
- **Consequences:** Guides the selection of the initial 12–16 modules for Phase 4.

---

## ADR-004: Multi-Platform Architecture (Web, Desktop, Mobile & Offline-First)
- **Status:** **Accepted**
- **Date:** 2026-11-19
- **Context:** The system must not be constrained to a traditional web browser; it must eventually package seamlessly as a cross-platform desktop application (Windows, macOS, Linux) and mobile/tablet application (iOS, Android) with full offline functionality.
- **Decision:**
  1. The Core Domain & Graph Engine is implemented in 100% pure, platform-agnostic TypeScript with zero OS-native binary bindings. It executes identically in Node.js, browsers, web workers, and mobile webviews.
  2. The Presentation Layer will be built as a responsive Single Page Application (SPA / PWA) utilizing standard web technologies (HTML5 Canvas, WebGL, SVG, KaTeX).
  3. Packaging targets:
     - **Web:** Hosted Progressive Web App (PWA) with Service Worker caching.
     - **Desktop:** Native desktop wrapper via **Tauri** or **Electron** bundling local file storage.
     - **Mobile:** Native mobile wrapper via **Capacitor** or React Native WebView.
  4. Knowledge repositories are completely offline-capable: modules can be bundled locally or synchronized via IndexedDB/SQLite.
- **Consequences:** Zero vendor lock-in; true "write once, run everywhere" capability from high-end desktop workstations to offline mobile devices.
