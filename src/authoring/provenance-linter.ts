import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { ModuleManifest, BloomLevel, SourceCitation, LearningObjective } from '../core/validation/types.js';
import { ProvenanceAuditResult, ProvenanceAuditIssue } from './types.js';

export const BLOOM_ACTION_VERBS: Record<BloomLevel, string[]> = {
  remember: ['define', 'recall', 'list', 'state', 'name', 'identify', 'recognize', 'retrieve', 'cite'],
  understand: ['explain', 'describe', 'summarize', 'interpret', 'classify', 'compare', 'illustrate', 'articulate', 'represent'],
  apply: ['apply', 'calculate', 'compute', 'solve', 'implement', 'execute', 'derive', 'determine', 'demonstrate', 'use', 'resolve'],
  analyze: ['analyze', 'differentiate', 'distinguish', 'decompose', 'examine', 'isolate', 'categorize', 'contrast', 'diagnose'],
  evaluate: ['evaluate', 'justify', 'assess', 'critique', 'judge', 'validate', 'verify', 'defend', 'appraise'],
  create: ['create', 'construct', 'design', 'formulate', 'build', 'synthesize', 'generate', 'model', 'program', 'compose']
};

export class ProvenanceLinter {
  /**
   * Performs in-depth pedagogical, citation, and markdown auditing on a module directory or manifest.
   */
  public static auditModule(moduleDirOrManifest: string | ModuleManifest): ProvenanceAuditResult {
    let manifest: ModuleManifest;
    let moduleSlug = 'unknown';
    let moduleDir: string | null = null;
    const issues: ProvenanceAuditIssue[] = [];

    if (typeof moduleDirOrManifest === 'string') {
      const dirPath = moduleDirOrManifest;
      moduleDir = dirPath;
      const yamlPath = path.join(dirPath, 'module.yaml');
      if (!fs.existsSync(yamlPath)) {
        return {
          valid: false,
          moduleSlug: path.basename(dirPath),
          issues: [{ type: 'error', field: 'filesystem', message: `Missing module.yaml in ${dirPath}` }]
        };
      }
      try {
        manifest = yaml.load(fs.readFileSync(yamlPath, 'utf-8')) as ModuleManifest;
      } catch (err: any) {
        return {
          valid: false,
          moduleSlug: path.basename(dirPath),
          issues: [{ type: 'error', field: 'syntax', message: `YAML parse error: ${err.message}` }]
        };
      }
    } else {
      manifest = moduleDirOrManifest;
    }

    moduleSlug = manifest.slug || 'unknown';

    // 1. Audit Source Provenance
    if (!manifest.provenance || !manifest.provenance.sources || manifest.provenance.sources.length === 0) {
      issues.push({
        type: 'error',
        field: 'provenance.sources',
        message: 'Module must contain at least one peer-verifiable citation source.'
      });
    } else {
      manifest.provenance.sources.forEach((src: SourceCitation, idx: number) => {
        // Enforce recommendation: every source must have at least one locator (URL, ISBN, or DOI)
        const hasLocator = Boolean(src.url || src.isbn || (src as any).doi);
        if (!hasLocator) {
          issues.push({
            type: 'error',
            field: `provenance.sources[${idx}]`,
            message: `Source "${src.id}" lacks a verifiable locator. Must provide at least one of 'url', 'isbn', or 'doi'.`
          });
        }

        if (!src.claims_supported || src.claims_supported.length === 0) {
          issues.push({
            type: 'error',
            field: `provenance.sources[${idx}].claims_supported`,
            message: `Source "${src.id}" must explicitly state which claims it supports (claims_supported cannot be empty).`
          });
        }

        if (!src.citation || src.citation.trim().length < 10) {
          issues.push({
            type: 'error',
            field: `provenance.sources[${idx}].citation`,
            message: `Source "${src.id}" has an incomplete or truncated citation string.`
          });
        }
      });
    }

    // 2. Audit Learning Objectives & Bloom's Taxonomy Alignment
    if (manifest.learning_objectives) {
      manifest.learning_objectives.forEach((obj: LearningObjective, idx: number) => {
        const declaredLevel = obj.bloom_level;
        const expectedVerbs = BLOOM_ACTION_VERBS[declaredLevel] || [];
        const words = obj.statement.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
        
        // Check if statement contains at least one recommended action verb for the declared Bloom tier
        const matchedVerb = expectedVerbs.some(verb => words.includes(verb));
        if (!matchedVerb) {
          issues.push({
            type: 'warning',
            field: `learning_objectives[${idx}].bloom_level`,
            message: `Objective "${obj.id}" declared as Bloom tier '${declaredLevel}', but statement does not contain expected action verbs (${expectedVerbs.slice(0, 4).join(', ')}...).`
          });
        }
      });
    }

    // 3. Audit content.md KaTeX formatting if directory is available
    if (moduleDir) {
      const contentPath = path.join(moduleDir, 'content.md');
      if (fs.existsSync(contentPath)) {
        const content = fs.readFileSync(contentPath, 'utf-8');
        // Check for unmatched display math $$ delimiters
        const displayMathMatches = content.match(/\$\$/g);
        if (displayMathMatches && displayMathMatches.length % 2 !== 0) {
          issues.push({
            type: 'error',
            field: 'content.md.katex',
            message: 'Unmatched display math delimiter ($$) found in content.md.'
          });
        }
      } else {
        issues.push({
          type: 'warning',
          field: 'content.md',
          message: 'content.md is missing from module directory.'
        });
      }
    }

    const hasErrors = issues.some(i => i.type === 'error');

    return {
      valid: !hasErrors,
      moduleSlug,
      issues
    };
  }
}
