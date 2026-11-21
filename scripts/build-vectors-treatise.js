import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const moduleDir = path.resolve(__dirname, '..', 'modules', 'mathematics', 'linear-algebra', 'math-vectors-2d');
const chaptersDir = path.join(moduleDir, 'chapters');
const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.md')).sort();

let content = `# 2D Cartesian Vectors and Vector Algebra: The Sovereign Master Treatise (SMTS-40K)
*From Grade 6 Intuitive Roots to University Computational Physics and Robotics Engine*

> **Pedagogical Standard:** Sovereign Master Treatise Standard 40,000+ Words (\`SMTS-40K\`)
> **Rigor & Structure:** 12 Sovereign Master Chapters | 120 Progressive Worked Numerical Examples | 120 Solved Chapter Mastery Exercises
> **Modular Architecture:** Sovereign standalone chapters located in \`chapters/\` for focused study and offline export.

---

## 🗺️ Master Curriculum & Chapter Table of Contents

| Chapter | Title | Focus & Scope | Pedagogical Assets |
| :--- | :--- | :--- | :--- |
| **01** | **The Layman's Genesis: The Scalar Illusion & The Lost Island** | Class 6 roots, scalars vs space, Pirate Island Paradox, 1714 Scilly naval disaster | 10 Examples, 10 Solved Exercises |
| **02** | **The Grid World: Descartes, The Fly, and The Birth of Coordinates** | 1637 Descartes fly story, 2D Cartesian plane, quadrant physics, points vs vectors | 10 Examples, 10 Solved Exercises |
| **03** | **The Anatomy of an Arrow: Components, Displacements & Standard Notation** | $\\Delta x, \\Delta y$, standard position, basis vectors $\\hat{i}, \\hat{j}$, column matrices | 10 Examples, 10 Solved Exercises |
| **04** | **Pythagoras in Flatland: Distance, Metric, and Vector Magnitude** | Geometric Pythagorean derivation, length formula, taxicab vs Euclidean geometry | 10 Examples, 10 Solved Exercises |
| **05** | **The Geometry of Combining: Tip-to-Tail, Parallelograms, and Resultants** | Stevin 1586, tip-to-tail, commutative/associative laws, component addition proof | 10 Examples, 10 Solved Exercises |
| **06** | **The Anti-Arrow & Scaling: Scalar Multiplication, Subtraction & Relative Velocity** | Opposite direction, scaling, relative motion, Galileo 1632 ship thought experiment | 10 Examples, 10 Solved Exercises |
| **07** | **The Compass Needle: Unit Vectors, Pure Direction & Normalization** | Unit vectors $\\hat{u}$, zero division hazard, normalization in simulation, Quake III trick | 10 Examples, 10 Solved Exercises |
| **08** | **The Dance of Angles: Polar Coordinates, Trigonometry & The Four Quadrants** | Polar $(r, \\theta)$, $\\cos, \\sin$, inverse tangents, quadrant ambiguity, \`atan2(y, x)\` | 10 Examples, 10 Solved Exercises |
| **09** | **The Teamwork Meter: The Dot Product, Geometric Invariance & Work** | Dot product formula, Law of Cosines equivalence proof, Cauchy-Schwarz, physics work | 10 Examples, 10 Solved Exercises |
| **10** | **The Shadow and The Mirror: Projections, Decompositions & Elastic Reflections** | Orthogonal projection, rejection, billiard/laser reflection formula $\\vec{v} - 2(\\vec{v}\\cdot\\hat{n})\\hat{n}$ | 10 Examples, 10 Solved Exercises |
| **11** | **Turning in Flatland: Perpendiculars, The 2D Cross Product & Robot Steering** | $90^\\circ$ perp vector, 2D pseudo-cross product / determinant, signed area, left/right steering | 10 Examples, 10 Solved Exercises |
| **12** | **The Sovereign Computational Engine & Civilizational Grand Gauntlet** | Production-ready typed TypeScript \`Vector2D\` class, 10 Capstone Mastery Problems | Full TypeScript Engine + Capstone Solutions |

---

`;

for (let i = 0; i < files.length; i++) {
  const f = files[i];
  const filePath = path.join(chaptersDir, f);
  const text = fs.readFileSync(filePath, 'utf-8');
  content += text + '\n\n---\n\n';
}

const outputPath = path.join(moduleDir, 'content.md');
fs.writeFileSync(outputPath, content, 'utf-8');

const wordCount = content.trim().split(/\s+/).length;
const charCount = content.length;
console.log(`Successfully compiled Sovereign Master Treatise!`);
console.log(`Chapters combined: ${files.length}`);
console.log(`Output: ${outputPath}`);
console.log(`Total Word Count: ${wordCount.toLocaleString()} words`);
console.log(`Total Character Count: ${charCount.toLocaleString()} characters`);
