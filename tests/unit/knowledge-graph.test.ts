import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { KnowledgeGraph } from '../../src/core/graph/knowledge-graph.js';
import { ModuleManifest } from '../../src/core/validation/types.js';

function createMockManifest(slug: string, prereqs: string[] = [], related: string[] = []): ModuleManifest {
  return {
    id: `550e8400-e29b-41d4-a716-${slug.padEnd(12, '0').slice(0, 12)}`,
    slug,
    title: `Title for ${slug}`,
    summary: `Summary for ${slug} with sufficient length for validation`,
    version: '1.0.0',
    classification: {
      discipline: 'physics',
      domain: 'classical-mechanics',
      proficiency_tier: 2,
      estimated_duration_minutes: 60
    },
    verification: {
      status: 'technically-verified'
    },
    relationships: {
      prerequisites: prereqs.map(p => ({ slug: p, rationale: `Requires ${p}` })),
      related_modules: related.map(r => ({ slug: r, relationship: 'subsequent_concept' }))
    },
    learning_objectives: [
      { id: 'obj-1', statement: `Objective for ${slug}`, bloom_level: 'understand' }
    ],
    provenance: {
      sources: [
        { id: 'src-1', citation: 'Standard Textbook', claims_supported: ['all'] }
      ]
    }
  };
}

describe('KnowledgeGraph Test Suite', () => {
  describe('Graph Construction & Invariants', () => {
    it('should register modules and build bidirectional adjacency lists', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('math-vectors'));
      graph.addModule(createMockManifest('phys-kinematics', ['math-vectors']));

      assert.equal(graph.getNodeCount(), 2);
      assert.deepEqual(graph.getDirectPrerequisites('phys-kinematics'), ['math-vectors']);
      assert.deepEqual(graph.getDirectDependents('math-vectors'), ['phys-kinematics']);
      assert.deepEqual(graph.getDirectPrerequisites('math-vectors'), []);
    });
  });

  describe('Cycle Detection Engine', () => {
    it('should confirm that a valid acyclic DAG has no cycles', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('math-vectors'));
      graph.addModule(createMockManifest('phys-kinematics', ['math-vectors']));
      graph.addModule(createMockManifest('phys-dynamics', ['phys-kinematics']));

      const res = graph.detectCycles();
      assert.equal(res.hasCycle, false);
      assert.equal(res.cyclePath.length, 0);
    });

    it('should detect a direct 2-node cycle (A <-> B)', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('module-a', ['module-b']));
      graph.addModule(createMockManifest('module-b', ['module-a']));

      const res = graph.detectCycles();
      assert.equal(res.hasCycle, true);
      assert.ok(res.cyclePath.length >= 3);
      assert.equal(res.cyclePath[0], res.cyclePath[res.cyclePath.length - 1]);
    });

    it('should detect a multi-node indirect cycle (A -> B -> C -> A)', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('node-a', ['node-c']));
      graph.addModule(createMockManifest('node-b', ['node-a']));
      graph.addModule(createMockManifest('node-c', ['node-b']));

      const res = graph.detectCycles();
      assert.equal(res.hasCycle, true);
      assert.ok(res.cyclePath.includes('node-a'));
      assert.ok(res.cyclePath.includes('node-b'));
      assert.ok(res.cyclePath.includes('node-c'));
    });

    it('should detect self-referencing cycle (A -> A)', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('self-referencing', ['self-referencing']));

      const res = graph.detectCycles();
      assert.equal(res.hasCycle, true);
      assert.deepEqual(res.cyclePath, ['self-referencing', 'self-referencing']);
    });
  });

  describe('Topological Sorting (Kahn Algorithm)', () => {
    it('should correctly linearize an acyclic dependency graph', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('math-vectors'));
      graph.addModule(createMockManifest('cs-programming'));
      graph.addModule(createMockManifest('phys-kinematics', ['math-vectors']));
      graph.addModule(createMockManifest('phys-dynamics', ['phys-kinematics']));
      graph.addModule(createMockManifest('sim-physics-engine', ['phys-dynamics', 'cs-programming']));

      const order = graph.topologicalSort();
      
      // Prerequisites must strictly precede their dependents in the ordering
      const posVectors = order.indexOf('math-vectors');
      const posKinematics = order.indexOf('phys-kinematics');
      const posDynamics = order.indexOf('phys-dynamics');
      const posProg = order.indexOf('cs-programming');
      const posSim = order.indexOf('sim-physics-engine');

      assert.ok(posVectors < posKinematics, 'math-vectors must precede phys-kinematics');
      assert.ok(posKinematics < posDynamics, 'phys-kinematics must precede phys-dynamics');
      assert.ok(posDynamics < posSim, 'phys-dynamics must precede sim-physics-engine');
      assert.ok(posProg < posSim, 'cs-programming must precede sim-physics-engine');
    });

    it('should throw an informative error when topological sort is attempted on a cyclic graph', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('cycle-1', ['cycle-2']));
      graph.addModule(createMockManifest('cycle-2', ['cycle-1']));

      assert.throws(
        () => graph.topologicalSort(),
        /Cannot compute topological sort: Cycle detected/
      );
    });
  });

  describe('Pathway Resolution & Prerequisite Delta', () => {
    it('should resolve a complete pathway to a terminal goal module with delta calculation', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('math-vectors'));
      graph.addModule(createMockManifest('math-calculus'));
      graph.addModule(createMockManifest('phys-kinematics', ['math-vectors']));
      graph.addModule(createMockManifest('phys-newton', ['phys-kinematics', 'math-calculus']));
      graph.addModule(createMockManifest('cs-euler-integration', ['phys-newton']));
      graph.addModule(createMockManifest('phys-relativity', ['phys-newton'])); // Unrelated branch

      // Target: cs-euler-integration. Learner has already finished math-vectors.
      const resolution = graph.resolvePathway('cs-euler-integration', ['math-vectors']);

      assert.deepEqual(resolution.targetSlugs, ['cs-euler-integration']);
      assert.deepEqual(resolution.alreadyCompletedSlugs, ['math-vectors']);
      
      // phys-relativity should NOT be in the required sequence (not an ancestor)
      assert.equal(resolution.allRequiredSlugs.includes('phys-relativity'), false);
      
      // Missing modules to study
      assert.ok(resolution.missingSlugs.includes('math-calculus'));
      assert.ok(resolution.missingSlugs.includes('phys-kinematics'));
      assert.ok(resolution.missingSlugs.includes('phys-newton'));
      assert.ok(resolution.missingSlugs.includes('cs-euler-integration'));
      assert.equal(resolution.missingSlugs.includes('math-vectors'), false);
    });

    it('should discover recommended complementary modules connected to the path', () => {
      const graph = new KnowledgeGraph();
      graph.addModule(createMockManifest('math-vectors', [], ['math-matrices']));
      graph.addModule(createMockManifest('math-matrices'));
      graph.addModule(createMockManifest('phys-kinematics', ['math-vectors']));

      const resolution = graph.resolvePathway('phys-kinematics');
      assert.equal(resolution.recommendedModules.length, 1);
      assert.equal(resolution.recommendedModules[0].slug, 'math-matrices');
    });
  });

  describe('Transitive Redundancy Detection', () => {
    it('should identify redundant transitive prerequisite edges', () => {
      const graph = new KnowledgeGraph();
      // A -> B, B -> C, and A -> C (direct edge A -> C is redundant)
      graph.addModule(createMockManifest('mod-a'));
      graph.addModule(createMockManifest('mod-b', ['mod-a']));
      graph.addModule(createMockManifest('mod-c', ['mod-b', 'mod-a']));

      const redundancies = graph.findTransitiveRedundancies();
      assert.equal(redundancies.length, 1);
      assert.equal(redundancies[0].from, 'mod-a');
      assert.equal(redundancies[0].to, 'mod-c');
      assert.equal(redundancies[0].via, 'mod-b');
    });
  });
});
