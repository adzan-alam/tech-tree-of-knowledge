import { Discipline, ProficiencyTier, BloomLevel, VerificationStatus } from '../core/validation/types.js';

export interface ScaffoldModuleOptions {
  slug: string;
  title: string;
  discipline: Discipline;
  domain: string;
  proficiencyTier?: ProficiencyTier;
  estimatedDurationMinutes?: number;
  outputBaseDir?: string;
}

export interface ScaffoldResult {
  moduleDir: string;
  moduleYamlPath: string;
  contentMdPath: string;
  assessmentYamlPath: string;
}

export interface ProvenanceAuditIssue {
  type: 'error' | 'warning';
  field: string;
  message: string;
}

export interface ProvenanceAuditResult {
  valid: boolean;
  moduleSlug: string;
  issues: ProvenanceAuditIssue[];
}

export interface VerificationAuditSummary {
  totalModules: number;
  byStatus: Record<VerificationStatus, number>;
  modules: Array<{
    slug: string;
    title: string;
    discipline: Discipline;
    proficiencyTier: ProficiencyTier;
    status: VerificationStatus;
    sourcesCount: number;
    objectivesCount: number;
    issues: string[];
  }>;
}
