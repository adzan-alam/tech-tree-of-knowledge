import { ModuleManifest, Discipline, ProficiencyTier, VerificationStatus } from '../validation/types.js';

export type EdgeType = 
  | 'prerequisite'
  | 'builds_upon'
  | 'cross_disciplinary'
  | 'historical';

export interface GraphEdge {
  from: string; // Prerequisite / source slug
  to: string;   // Dependent / target slug
  type: EdgeType;
  rationale?: string;
}

export interface KnowledgeNode {
  slug: string;
  id: string;
  title: string;
  version: string;
  discipline: Discipline;
  domain: string;
  proficiencyTier: ProficiencyTier;
  verificationStatus: VerificationStatus;
  estimatedDurationMinutes: number;
  prerequisites: string[];
  relatedModules: Array<{ slug: string; relationship: string }>;
  learningObjectivesCount: number;
  rawManifest: ModuleManifest;
}

export interface CycleDetectionResult {
  hasCycle: boolean;
  cyclePath: string[]; // e.g. ['phys-newtons-laws', 'phys-kinematics', 'phys-newtons-laws']
}

export interface PathwayResolutionResult {
  targetSlugs: string[];
  orderedSequence: KnowledgeNode[];
  allRequiredSlugs: string[];
  missingSlugs: string[];
  alreadyCompletedSlugs: string[];
  recommendedModules: KnowledgeNode[];
  estimatedTotalMinutes: number;
}
