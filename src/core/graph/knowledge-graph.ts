import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { ModuleManifest } from '../validation/types.js';
import { SchemaValidator } from '../validation/schema-validator.js';
import { 
  KnowledgeNode, 
  GraphEdge, 
  CycleDetectionResult, 
  PathwayResolutionResult 
} from './types.js';

// Graph node color states for 3-color cycle detection
const COLOR_UNVISITED = 0;
const COLOR_VISITING = 1;
const COLOR_VISITED = 2;

export class KnowledgeGraph {
  // Primary node registry indexed by slug
  private nodes: Map<string, KnowledgeNode> = new Map();

  // Forward adjacency: prerequisite -> Set of dependent module slugs (A -> B means A is prereq of B)
  private forwardEdges: Map<string, Set<string>> = new Map();

  // Reverse adjacency: dependent module slug -> Set of its prerequisite slugs (B -> Set of A)
  private reverseEdges: Map<string, Set<string>> = new Map();

  // Edge metadata map
  private edgeMetadata: Map<string, GraphEdge> = new Map();

  constructor() {}

  /**
   * Registers a validated module manifest into the graph
   */
  public addModule(manifest: ModuleManifest): KnowledgeNode {
    const slug = manifest.slug;
    const prereqSlugs = manifest.relationships.prerequisites.map(p => p.slug);
    const related = manifest.relationships.related_modules || [];

    const node: KnowledgeNode = {
      slug,
      id: manifest.id,
      title: manifest.title,
      version: manifest.version,
      discipline: manifest.classification.discipline,
      domain: manifest.classification.domain,
      proficiencyTier: manifest.classification.proficiency_tier,
      verificationStatus: manifest.verification.status,
      estimatedDurationMinutes: manifest.classification.estimated_duration_minutes,
      prerequisites: prereqSlugs,
      relatedModules: related,
      learningObjectivesCount: manifest.learning_objectives.length,
      rawManifest: manifest
    };

    this.nodes.set(slug, node);

    if (!this.forwardEdges.has(slug)) {
      this.forwardEdges.set(slug, new Set());
    }
    if (!this.reverseEdges.has(slug)) {
      this.reverseEdges.set(slug, new Set());
    }

    // Connect declared prerequisites
    for (const prereq of manifest.relationships.prerequisites) {
      this.addEdge(prereq.slug, slug, 'prerequisite', prereq.rationale);
    }

    return node;
  }

  /**
   * Adds a directed edge: fromSlug -> toSlug (fromSlug must be learned before toSlug)
   */
  public addEdge(fromSlug: string, toSlug: string, type: GraphEdge['type'] = 'prerequisite', rationale?: string): void {
    if (!this.forwardEdges.has(fromSlug)) {
      this.forwardEdges.set(fromSlug, new Set());
    }
    this.forwardEdges.get(fromSlug)!.add(toSlug);

    if (!this.reverseEdges.has(toSlug)) {
      this.reverseEdges.set(toSlug, new Set());
    }
    this.reverseEdges.get(toSlug)!.add(fromSlug);

    const edgeKey = `${fromSlug}->${toSlug}`;
    this.edgeMetadata.set(edgeKey, {
      from: fromSlug,
      to: toSlug,
      type,
      rationale
    });
  }

  public getNode(slug: string): KnowledgeNode | undefined {
    return this.nodes.get(slug);
  }

  public getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }

  public getNodeCount(): number {
    return this.nodes.size;
  }

  public getDirectPrerequisites(slug: string): string[] {
    const prereqs = this.reverseEdges.get(slug);
    return prereqs ? Array.from(prereqs) : [];
  }

  public getDirectDependents(slug: string): string[] {
    const dependents = this.forwardEdges.get(slug);
    return dependents ? Array.from(dependents) : [];
  }

  /**
   * Scans a directory recursively, parsing all module.yaml manifests and indexing them.
   */
  public loadFromDirectory(dirPath: string, validator?: SchemaValidator): { loaded: number; errors: string[] } {
    const errors: string[] = [];
    let loaded = 0;

    const scan = (currentDir: string) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
            scan(fullPath);
          }
        } else if (entry.isFile() && (entry.name === 'module.yaml' || entry.name === 'module.yml')) {
          try {
            const raw = fs.readFileSync(fullPath, 'utf-8');
            const data = yaml.load(raw) as ModuleManifest;
            if (validator) {
              const res = validator.validateModule(data);
              if (!res.valid) {
                errors.push(`Validation Error in ${fullPath}: ${res.errors.join('; ')}`);
                continue;
              }
            }
            this.addModule(data);
            loaded++;
          } catch (err: any) {
            errors.push(`Parse Error in ${fullPath}: ${err.message}`);
          }
        }
      }
    };

    if (fs.existsSync(dirPath)) {
      scan(dirPath);
    } else {
      errors.push(`Directory does not exist: ${dirPath}`);
    }

    return { loaded, errors };
  }

  /**
   * Detects cycles in the prerequisite graph using 3-color DFS.
   * Colors: 0 = UNVISITED, 1 = VISITING (active on recursion stack), 2 = VISITED.
   * Returns exact cycle path if a cycle is present.
   */
  public detectCycles(): CycleDetectionResult {
    const color = new Map<string, number>();
    const parent = new Map<string, string | null>();

    // Collect all node keys (including any referenced in edges that might not be registered yet)
    const allKeys = new Set<string>();
    for (const key of this.nodes.keys()) allKeys.add(key);
    for (const key of this.forwardEdges.keys()) allKeys.add(key);
    for (const key of this.reverseEdges.keys()) allKeys.add(key);

    for (const key of allKeys) {
      color.set(key, COLOR_UNVISITED);
      parent.set(key, null);
    }

    for (const nodeKey of allKeys) {
      if (color.get(nodeKey) === COLOR_UNVISITED) {
        const cycleFound = this.dfsCycle(nodeKey, color, parent);
        if (cycleFound) {
          return cycleFound;
        }
      }
    }

    return { hasCycle: false, cyclePath: [] };
  }

  private dfsCycle(
    u: string, 
    color: Map<string, number>, 
    parent: Map<string, string | null>
  ): CycleDetectionResult | null {
    color.set(u, COLOR_VISITING);

    const neighbors = this.forwardEdges.get(u) || new Set();
    for (const v of neighbors) {
      if (color.get(v) === COLOR_VISITING) {
        // Cycle detected: edge u -> v points back to an ancestor on the recursion stack
        if (u === v) {
          return { hasCycle: true, cyclePath: [u, u] };
        }
        const cyclePath: string[] = [v, u];
        let curr: string | null = parent.get(u) || null;
        while (curr && curr !== v) {
          cyclePath.push(curr);
          curr = parent.get(curr) || null;
        }
        cyclePath.push(v);
        cyclePath.reverse();
        return { hasCycle: true, cyclePath };
      }

      if (color.get(v) === COLOR_UNVISITED) {
        parent.set(v, u);
        const cycleResult = this.dfsCycle(v, color, parent);
        if (cycleResult) return cycleResult;
      }
    }

    color.set(u, COLOR_VISITED);
    return null;
  }

  /**
   * Computes a valid topological ordering of modules using Kahn's algorithm.
   * Prerequisites always appear before dependent modules.
   * Tie-breaks: lower proficiency tier first, then alphabetical by title/slug.
   */
  public topologicalSort(subsetSlugs?: string[]): string[] {
    const cycleCheck = this.detectCycles();
    if (cycleCheck.hasCycle) {
      throw new Error(`Cannot compute topological sort: Cycle detected: ${cycleCheck.cyclePath.join(' -> ')}`);
    }

    const targetSet = new Set(subsetSlugs || Array.from(this.nodes.keys()));
    const inDegree = new Map<string, number>();

    // Calculate in-degree restricted to the targetSet
    for (const slug of targetSet) {
      let degree = 0;
      const prereqs = this.reverseEdges.get(slug) || new Set();
      for (const p of prereqs) {
        if (targetSet.has(p)) {
          degree++;
        }
      }
      inDegree.set(slug, degree);
    }

    // Comparator for deterministic priority queue / tie-breaking
    const comparator = (a: string, b: string): number => {
      const nodeA = this.nodes.get(a);
      const nodeB = this.nodes.get(b);
      const tierA = nodeA ? nodeA.proficiencyTier : 1;
      const tierB = nodeB ? nodeB.proficiencyTier : 1;
      if (tierA !== tierB) return tierA - tierB;
      const titleA = nodeA ? nodeA.title : a;
      const titleB = nodeB ? nodeB.title : b;
      return titleA.localeCompare(titleB);
    };

    // Initialize queue with in-degree 0 nodes
    const queue: string[] = [];
    for (const [slug, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(slug);
      }
    }
    queue.sort(comparator);

    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      const dependents = this.forwardEdges.get(current) || new Set();
      const newlyReady: string[] = [];

      for (const dep of dependents) {
        if (targetSet.has(dep)) {
          const currentDeg = inDegree.get(dep)! - 1;
          inDegree.set(dep, currentDeg);
          if (currentDeg === 0) {
            newlyReady.push(dep);
          }
        }
      }

      if (newlyReady.length > 0) {
        newlyReady.sort(comparator);
        queue.push(...newlyReady);
        queue.sort(comparator);
      }
    }

    return result;
  }

  /**
   * Resolves a goal-based or target-based pathway:
   * 1. Traverses backwards from target module(s) through reverse edges to gather the full dependency subgraph.
   * 2. Topologically sorts the sequence.
   * 3. Calculates missing modules against completed modules.
   * 4. Discovers related/recommended modules that enrich the pathway.
   */
  public resolvePathway(
    targetSlugs: string | string[],
    completedSlugs: string[] = []
  ): PathwayResolutionResult {
    const targets = Array.isArray(targetSlugs) ? targetSlugs : [targetSlugs];
    const completedSet = new Set(completedSlugs);
    const requiredSet = new Set<string>();

    // Backwards BFS traversal from all targets to discover all ancestors
    const queue = [...targets];
    for (const t of targets) requiredSet.add(t);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const prereqs = this.reverseEdges.get(current) || new Set();
      for (const p of prereqs) {
        if (!requiredSet.has(p)) {
          requiredSet.add(p);
          queue.push(p);
        }
      }
    }

    // Topologically sort the required subgraph
    const sortedSlugs = this.topologicalSort(Array.from(requiredSet));

    const orderedSequence: KnowledgeNode[] = [];
    let estimatedTotalMinutes = 0;

    for (const slug of sortedSlugs) {
      const node = this.nodes.get(slug);
      if (node) {
        orderedSequence.push(node);
        estimatedTotalMinutes += node.estimatedDurationMinutes;
      }
    }

    const missingSlugs = sortedSlugs.filter(slug => !completedSet.has(slug));
    const alreadyCompletedSlugs = sortedSlugs.filter(slug => completedSet.has(slug));

    // Discover recommended modules from related_modules links
    const recommendedMap = new Map<string, KnowledgeNode>();
    for (const node of orderedSequence) {
      for (const rel of node.relatedModules) {
        if (!requiredSet.has(rel.slug) && this.nodes.has(rel.slug)) {
          recommendedMap.set(rel.slug, this.nodes.get(rel.slug)!);
        }
      }
    }

    return {
      targetSlugs: targets,
      orderedSequence,
      allRequiredSlugs: sortedSlugs,
      missingSlugs,
      alreadyCompletedSlugs,
      recommendedModules: Array.from(recommendedMap.values()),
      estimatedTotalMinutes
    };
  }

  /**
   * Calculates transitive reduction of prerequisite edges:
   * Identifies redundant edges (e.g. if A -> B and B -> C and A -> C, edge A -> C is redundant).
   * Returns a map of sourceSlug -> Set of redundant targetSlugs.
   */
  public findTransitiveRedundancies(): Array<{ from: string; to: string; via: string }> {
    const redundancies: Array<{ from: string; to: string; via: string }> = [];

    for (const [u, dependents] of this.forwardEdges.entries()) {
      for (const v of dependents) {
        // Check if there is an alternative path from u to v of length >= 2
        for (const intermediate of dependents) {
          if (intermediate !== v) {
            if (this.hasDirectedPath(intermediate, v, new Set([u]))) {
              redundancies.push({ from: u, to: v, via: intermediate });
              break;
            }
          }
        }
      }
    }

    return redundancies;
  }

  private hasDirectedPath(from: string, to: string, visited: Set<string>): boolean {
    if (from === to) return true;
    visited.add(from);

    const neighbors = this.forwardEdges.get(from) || new Set();
    for (const next of neighbors) {
      if (!visited.has(next)) {
        if (this.hasDirectedPath(next, to, visited)) {
          return true;
        }
      }
    }

    return false;
  }
}
