import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';
import { ModuleManifest, VerificationStatus } from '../core/validation/types.js';
import { ProvenanceLinter } from './provenance-linter.js';
import { VerificationAuditSummary } from './types.js';

export class VerificationAuditor {
  /**
   * Scans a root modules directory, audits every module's verification tier, and compiles a comprehensive report.
   */
  public static auditRepository(modulesDir: string): VerificationAuditSummary {
    const summary: VerificationAuditSummary = {
      totalModules: 0,
      byStatus: {
        'draft': 0,
        'research-verified': 0,
        'technically-verified': 0,
        'expert-reviewed': 0,
        'published': 0
      },
      modules: []
    };

    if (!fs.existsSync(modulesDir)) {
      return summary;
    }

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
            const manifest = yaml.load(raw) as ModuleManifest;
            const parentDir = path.dirname(fullPath);

            const provAudit = ProvenanceLinter.auditModule(parentDir);
            const status: VerificationStatus = manifest.verification?.status || 'draft';

            summary.totalModules++;
            summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

            const moduleIssues: string[] = [];

            // Add provenance errors
            for (const issue of provAudit.issues) {
              if (issue.type === 'error') {
                moduleIssues.push(`[Provenance Error] ${issue.field}: ${issue.message}`);
              }
            }

            // Consistency checks
            if ((status === 'technically-verified' || status === 'published') && !provAudit.valid) {
              moduleIssues.push(`[Status Mismatch] Module is tagged as '${status}' but fails provenance verification.`);
            }

            // Check if assessment.yaml exists
            const assessmentPath = path.join(parentDir, 'assessment.yaml');
            if (!fs.existsSync(assessmentPath) && status !== 'draft') {
              moduleIssues.push(`[Missing Assessment] assessment.yaml is missing for non-draft module.`);
            }

            summary.modules.push({
              slug: manifest.slug || path.basename(parentDir),
              title: manifest.title || 'Untitled',
              discipline: manifest.classification?.discipline || 'physics',
              proficiencyTier: manifest.classification?.proficiency_tier || 1,
              status,
              sourcesCount: manifest.provenance?.sources?.length || 0,
              objectivesCount: manifest.learning_objectives?.length || 0,
              issues: moduleIssues
            });
          } catch (err: any) {
            // malformed YAML
            summary.modules.push({
              slug: path.basename(path.dirname(fullPath)),
              title: 'Parse Error',
              discipline: 'physics',
              proficiencyTier: 1,
              status: 'draft',
              sourcesCount: 0,
              objectivesCount: 0,
              issues: [`YAML Parse Error: ${err.message}`]
            });
          }
        }
      }
    };

    scan(modulesDir);
    return summary;
  }

  /**
   * Generates a human-readable CLI table / report
   */
  public static generateReportString(summary: VerificationAuditSummary): string {
    const lines: string[] = [];
    lines.push(`\n📊 Tech Tree Verification & Quality Assurance Audit`);
    lines.push(`Total Sovereign Modules Scanned: ${summary.totalModules}`);
    lines.push(`--------------------------------------------------`);
    lines.push(`Status Breakdown:`);
    lines.push(`  - Draft:                ${summary.byStatus['draft']}`);
    lines.push(`  - Research-Verified:   ${summary.byStatus['research-verified']}`);
    lines.push(`  - Technically-Verified:${summary.byStatus['technically-verified']}`);
    lines.push(`  - Expert-Reviewed:     ${summary.byStatus['expert-reviewed']}`);
    lines.push(`  - Published:           ${summary.byStatus['published']}`);
    lines.push(`--------------------------------------------------`);

    if (summary.modules.length > 0) {
      lines.push(`\nModule Status Details:`);
      for (const mod of summary.modules) {
        const statusBadge = `[${mod.status.toUpperCase()}]`;
        const issuesBadge = mod.issues.length === 0 ? '✅ Pass' : `⚠️ ${mod.issues.length} issue(s)`;
        lines.push(`  • ${mod.slug} (${mod.discipline}, Tier ${mod.proficiencyTier}) ${statusBadge} - ${issuesBadge}`);
        for (const iss of mod.issues) {
          lines.push(`     └─ ${iss}`);
        }
      }
    }

    return lines.join('\n');
  }
}
