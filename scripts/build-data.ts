import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../');
const modulesDir = path.join(projectRoot, 'modules');
const outputJson = path.join(projectRoot, 'public', 'data', 'modules.json');
const outputJs = path.join(projectRoot, 'public', 'data', 'modules.js');

const COORDINATES: Record<string, { x: number; y: number }> = {
  'math-vectors-2d': { x: 100, y: 150 },
  'math-calculus-derivatives': { x: 100, y: 350 },
  'phys-kinematics-1d-2d': { x: 350, y: 150 },
  'phys-newtons-laws': { x: 600, y: 150 },
  'phys-momentum-conservation': { x: 850, y: 150 },
  'cs-prog-fundamentals': { x: 350, y: 350 },
  'cs-numerical-integration': { x: 600, y: 350 },
  'cs-collision-detection': { x: 850, y: 350 },
  'chem-atomic-structure': { x: 100, y: 520 },
  'math-vectors-3d': { x: 340, y: 660 },
  'math-matrices-quaternions': { x: 600, y: 480 },
  'phys-rigid-body-3d': { x: 860, y: 300 },
  'cs-3d-collision-bvh': { x: 860, y: 480 },
  'math-probability-statistics': { x: 340, y: 480 },
  'cs-neural-networks-foundations': { x: 600, y: 660 },
  'cs-reinforcement-learning-mdp': { x: 860, y: 660 },
  'cs-deep-rl-agents': { x: 1120, y: 200 },
  'cs-computer-vision-foundations': { x: 1120, y: 380 },
  'phys-robotics-inverse-kinematics': { x: 1120, y: 560 },
  'math-kalman-filtering': { x: 1120, y: 740 },
  'cs-sim-to-real-embodied-ai': { x: 1380, y: 450 }
};

function findModuleDirs(dir: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(full, 'module.yaml'))) {
        results.push(full);
      } else {
        results = results.concat(findModuleDirs(full));
      }
    }
  }
  return results;
}

console.log('Building consolidated Tech Tree Knowledge Repository...');
const moduleDirs = findModuleDirs(modulesDir);
console.log(`Discovered ${moduleDirs.length} sovereign modules.`);

const fullModules: Record<string, any> = {};

for (const mDir of moduleDirs) {
  const modYamlPath = path.join(mDir, 'module.yaml');
  const assessYamlPath = path.join(mDir, 'assessment.yaml');
  const contentMdPath = path.join(mDir, 'content.md');

  const modData = yaml.load(fs.readFileSync(modYamlPath, 'utf8')) as any;
  const assessData = yaml.load(fs.readFileSync(assessYamlPath, 'utf8')) as any;
  const contentMd = fs.readFileSync(contentMdPath, 'utf8');

  const slug = modData.slug;
  const coords = COORDINATES[slug] || { x: 200, y: 200 };

  const quiz = (assessData.questions || []).map((q: any) => ({
    prompt: q.prompt,
    options: q.options,
    correctIndex: q.correct_option_index,
    explanation: q.explanation
  }));

  const sources = (modData.provenance?.sources || []).map((s: any) => ({
    citation: s.citation,
    isbn: s.isbn,
    doi: s.doi,
    url: s.url
  }));

  fullModules[slug] = {
    id: modData.id,
    slug: modData.slug,
    title: modData.title,
    discipline: modData.discipline,
    domain: modData.domain,
    proficiencyTier: modData.proficiency_tier,
    duration: modData.estimated_duration_minutes,
    summary: modData.summary,
    prerequisites: modData.prerequisites?.required || [],
    x: coords.x,
    y: coords.y,
    quiz,
    sources,
    content: contentMd
  };
}

// Write JSON
fs.writeFileSync(outputJson, JSON.stringify(fullModules, null, 2), 'utf8');
console.log(`✅ Wrote JSON bundle to: ${outputJson}`);

// Write JS (window.TECH_TREE_FULL_MODULES)
const jsBundle = `// Sovereign Tech Tree of Knowledge - Consolidated Offline Repository
// Generated automatically from verified GSMS-10 modules
window.TECH_TREE_FULL_MODULES = ${JSON.stringify(fullModules, null, 2)};
`;
fs.writeFileSync(outputJs, jsBundle, 'utf8');
console.log(`✅ Wrote offline JS bundle to: ${outputJs}`);
console.log(`Bundle generated successfully for ${Object.keys(fullModules).length} modules.`);
