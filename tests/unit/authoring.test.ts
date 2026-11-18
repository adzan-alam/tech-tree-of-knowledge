import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ModuleScaffolder } from '../../src/authoring/scaffold.js';
import { ProvenanceLinter } from '../../src/authoring/provenance-linter.js';
import { VerificationAuditor } from '../../src/authoring/verification-auditor.js';
import { SchemaValidator } from '../../src/core/validation/schema-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const testTempDir = path.join(projectRoot, 'tests/fixtures/author-temp');

describe('Authoring & Verification Pipeline Test Suite', () => {
  const validator = new SchemaValidator();

  before(() => {
    if (fs.existsSync(testTempDir)) {
      fs.rmSync(testTempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testTempDir, { recursive: true });
  });

  after(() => {
    if (fs.existsSync(testTempDir)) {
      fs.rmSync(testTempDir, { recursive: true, force: true });
    }
  });

  describe('ModuleScaffolder', () => {
    it('should scaffold a complete sovereign module that passes schema validation', () => {
      const res = ModuleScaffolder.scaffoldModule({
        slug: 'phys-work-energy',
        title: 'Work, Kinetic Energy, and the Work-Energy Theorem',
        discipline: 'physics',
        domain: 'classical-mechanics',
        proficiencyTier: 2,
        estimatedDurationMinutes: 75,
        outputBaseDir: testTempDir
      });

      assert.ok(fs.existsSync(res.moduleDir));
      assert.ok(fs.existsSync(res.moduleYamlPath));
      assert.ok(fs.existsSync(res.contentMdPath));
      assert.ok(fs.existsSync(res.assessmentYamlPath));

      // Assert that scaffolded module.yaml passes schema validation
      const moduleValid = validator.validateModuleFile(res.moduleYamlPath);
      assert.equal(moduleValid.valid, true, `Scaffolded module failed schema: ${moduleValid.errors.join('; ')}`);

      // Assert that scaffolded assessment.yaml passes schema validation
      const assessmentValid = validator.validateAssessmentFile(res.assessmentYamlPath);
      assert.equal(assessmentValid.valid, true, `Scaffolded assessment failed schema: ${assessmentValid.errors.join('; ')}`);
    });

    it('should throw an error when attempting to overwrite an existing module without approval', () => {
      assert.throws(
        () => ModuleScaffolder.scaffoldModule({
          slug: 'phys-work-energy',
          title: 'Duplicate',
          discipline: 'physics',
          domain: 'classical-mechanics',
          outputBaseDir: testTempDir
        }),
        /Module directory already exists/
      );
    });
  });

  describe('ProvenanceLinter', () => {
    it('should pass an audited module with valid citations and locators', () => {
      const validModuleDir = path.join(projectRoot, 'tests/fixtures/valid');
      const audit = ProvenanceLinter.auditModule(validModuleDir);
      assert.equal(audit.valid, true);
    });

    it('should reject a module when a source lacks URL, ISBN, or DOI locators', () => {
      const audit = ProvenanceLinter.auditModule({
        id: '550e8400-e29b-41d4-a716-446655440001',
        slug: 'test-no-locator',
        title: 'Module Without Source Locator',
        summary: 'Testing that source provenance enforces at least one verifiable locator.',
        version: '1.0.0',
        classification: {
          discipline: 'physics',
          domain: 'mechanics',
          proficiency_tier: 2,
          estimated_duration_minutes: 30
        },
        verification: { status: 'draft' },
        relationships: { prerequisites: [] },
        learning_objectives: [
          { id: 'obj-1', statement: 'Explain core concept in own words.', bloom_level: 'understand' }
        ],
        provenance: {
          sources: [
            {
              id: 'src-1',
              citation: 'A book without any locator',
              claims_supported: ['all']
              // Missing url, isbn, doi
            }
          ]
        }
      });

      assert.equal(audit.valid, false);
      assert.ok(audit.issues.some(i => i.field.includes('provenance.sources') && i.message.includes('lacks a verifiable locator')));
    });

    it('should emit a warning when learning objective statement lacks Bloom action verbs', () => {
      const audit = ProvenanceLinter.auditModule({
        id: '550e8400-e29b-41d4-a716-446655440002',
        slug: 'test-bloom-mismatch',
        title: 'Module With Bloom Mismatch',
        summary: 'Testing that bloom taxonomy mismatch produces actionable warning.',
        version: '1.0.0',
        classification: {
          discipline: 'physics',
          domain: 'mechanics',
          proficiency_tier: 2,
          estimated_duration_minutes: 30
        },
        verification: { status: 'draft' },
        relationships: { prerequisites: [] },
        learning_objectives: [
          // Declared 'create', but statement is passive without action verbs
          { id: 'obj-1', statement: 'Passive contemplation of energy.', bloom_level: 'create' }
        ],
        provenance: {
          sources: [
            { id: 'src-1', citation: 'Good Book', url: 'https://example.com', claims_supported: ['all'] }
          ]
        }
      });

      assert.ok(audit.issues.some(i => i.type === 'warning' && i.message.includes('Bloom tier')));
    });
  });

  describe('VerificationAuditor', () => {
    it('should audit repository and generate a structured summary breakdown', () => {
      const summary = VerificationAuditor.auditRepository(testTempDir);
      assert.equal(summary.totalModules, 1);
      assert.equal(summary.byStatus['draft'], 1);
      
      const report = VerificationAuditor.generateReportString(summary);
      assert.ok(report.includes('Total Sovereign Modules Scanned: 1'));
      assert.ok(report.includes('phys-work-energy'));
    });
  });
});
