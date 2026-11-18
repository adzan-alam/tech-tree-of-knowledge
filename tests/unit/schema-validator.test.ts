import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { SchemaValidator } from '../../src/core/validation/schema-validator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const fixturesDir = path.join(projectRoot, 'tests/fixtures');

describe('SchemaValidator Test Suite', () => {
  const validator = new SchemaValidator();

  describe('Module Schema Validation', () => {
    it('should successfully validate a fully compliant module manifest', () => {
      const validModulePath = path.join(fixturesDir, 'valid/module.yaml');
      const result = validator.validateModuleFile(validModulePath);
      assert.equal(result.valid, true, `Expected valid module, but got errors: ${result.errors.join('; ')}`);
      assert.equal(result.errors.length, 0);
    });

    it('should reject a module manifest missing required fields (learning_objectives, provenance)', () => {
      const missingFieldsPath = path.join(fixturesDir, 'invalid/missing-fields.yaml');
      const result = validator.validateModuleFile(missingFieldsPath);
      assert.equal(result.valid, false, 'Expected module to be invalid due to missing required fields');
      assert.ok(result.errors.length >= 2, 'Expected at least two validation errors');
      assert.ok(
        result.errors.some(e => e.includes('learning_objectives') || e.includes('provenance')),
        'Expected error mentioning missing learning_objectives or provenance'
      );
    });

    it('should reject a module with invalid enum values, types, and bad UUIDs', () => {
      const badTypesPath = path.join(fixturesDir, 'invalid/bad-types.yaml');
      const result = validator.validateModuleFile(badTypesPath);
      assert.equal(result.valid, false, 'Expected module to be rejected for malformed types');
      assert.ok(result.errors.length >= 3, 'Expected multiple type/pattern errors');
    });
  });

  describe('Pathway Schema Validation', () => {
    it('should successfully validate a valid pathway definition', () => {
      const validPathwayPath = path.join(fixturesDir, 'valid/pathway.yaml');
      const result = validator.validatePathwayFile(validPathwayPath);
      assert.equal(result.valid, true, `Expected valid pathway, but got errors: ${result.errors.join('; ')}`);
      assert.equal(result.errors.length, 0);
    });
  });

  describe('Assessment Schema Validation', () => {
    it('should successfully validate a valid module assessment', () => {
      const validAssessmentPath = path.join(fixturesDir, 'valid/assessment.yaml');
      const result = validator.validateAssessmentFile(validAssessmentPath);
      assert.equal(result.valid, true, `Expected valid assessment, but got errors: ${result.errors.join('; ')}`);
      assert.equal(result.errors.length, 0);
    });
  });
});
