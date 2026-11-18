/**
 * Tech Tree Domain & Schema Types
 */

export type Discipline = 
  | 'mathematics' 
  | 'physics' 
  | 'computer-science' 
  | 'chemistry' 
  | 'biology' 
  | 'engineering' 
  | 'philosophy';

export type ProficiencyTier = 1 | 2 | 3 | 4;

export type VerificationStatus = 
  | 'draft' 
  | 'research-verified' 
  | 'technically-verified' 
  | 'expert-reviewed' 
  | 'published';

export type BloomLevel = 
  | 'remember' 
  | 'understand' 
  | 'apply' 
  | 'analyze' 
  | 'evaluate' 
  | 'create';

export interface PrerequisiteRef {
  slug: string;
  min_version?: string;
  rationale?: string;
}

export interface RelatedModuleRef {
  slug: string;
  relationship: 'subsequent_concept' | 'computational_application' | 'alternative_derivation' | 'experimental_verification';
}

export interface LearningObjective {
  id: string;
  statement: string;
  bloom_level: BloomLevel;
}

export interface SourceCitation {
  id: string;
  citation: string;
  url?: string;
  isbn?: string;
  license?: string;
  claims_supported: string[];
}

export interface HistoricalInfluence {
  discovery_id: string;
  relationship?: string;
}

export interface ModuleManifest {
  id: string;
  slug: string;
  title: string;
  summary: string;
  version: string;
  created_at?: string;
  updated_at?: string;
  classification: {
    discipline: Discipline;
    domain: string;
    proficiency_tier: ProficiencyTier;
    difficulty_score?: number;
    estimated_duration_minutes: number;
  };
  verification: {
    status: VerificationStatus;
    reviewed_by?: string[];
    verification_date?: string;
    notes?: string;
  };
  relationships: {
    prerequisites: PrerequisiteRef[];
    related_modules?: RelatedModuleRef[];
  };
  learning_objectives: LearningObjective[];
  practical_applications?: Array<{
    title: string;
    type: 'computational_simulation' | 'laboratory_experiment' | 'mathematical_proof' | 'engineering_design';
    description: string;
  }>;
  provenance: {
    sources: SourceCitation[];
  };
  discovery_context?: {
    historical_significance?: string;
    historical_influences?: HistoricalInfluence[];
    related_instruments?: string[];
  };
}

export interface LearningPathwayManifest {
  id: string;
  slug: string;
  title: string;
  description: string;
  target_goal: string;
  target_proficiency_tier?: ProficiencyTier;
  capstone_project: {
    title: string;
    description: string;
    deliverable_type: 'interactive_simulation' | 'software_application' | 'hardware_model' | 'research_paper';
  };
  modules: Array<{
    slug: string;
    sequence_order: number;
    curation_note: string;
  }>;
}

export interface AssessmentManifest {
  module_slug: string;
  passing_threshold_percent: number;
  questions: Array<{
    id: string;
    target_objective_id: string;
    prompt: string;
    type: 'multiple_choice' | 'numerical_calculation' | 'symbolic_derivation' | 'code_implementation';
    options?: Array<{
      id: string;
      text: string;
      is_correct: boolean;
    }>;
    numerical_solution?: {
      value: number;
      tolerance: number;
      unit: string;
    };
    explanation: string;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
