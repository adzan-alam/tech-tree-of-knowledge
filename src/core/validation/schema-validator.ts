import _Ajv, { ValidateFunction, ErrorObject } from 'ajv';
import _addFormats from 'ajv-formats';
import yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { 
  ValidationResult 
} from './types.js';

// Resolve Ajv default export under NodeNext / ESM
const Ajv = (_Ajv as any).default || _Ajv;
const addFormats = (_addFormats as any).default || _addFormats;

// Resolve directory for schemas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../');
const schemasDir = path.join(projectRoot, 'schemas');

export class SchemaValidator {
  private ajv: any;
  private validateModuleSchema: ValidateFunction;
  private validatePathwaySchema: ValidateFunction;
  private validateAssessmentSchema: ValidateFunction;

  constructor(customSchemasDir?: string) {
    const baseDir = customSchemasDir || schemasDir;
    
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);

    const moduleSchemaPath = path.join(baseDir, 'module.schema.json');
    const pathwaySchemaPath = path.join(baseDir, 'pathway.schema.json');
    const assessmentSchemaPath = path.join(baseDir, 'assessment.schema.json');

    const moduleSchema = JSON.parse(fs.readFileSync(moduleSchemaPath, 'utf-8'));
    const pathwaySchema = JSON.parse(fs.readFileSync(pathwaySchemaPath, 'utf-8'));
    const assessmentSchema = JSON.parse(fs.readFileSync(assessmentSchemaPath, 'utf-8'));

    this.validateModuleSchema = this.ajv.compile(moduleSchema);
    this.validatePathwaySchema = this.ajv.compile(pathwaySchema);
    this.validateAssessmentSchema = this.ajv.compile(assessmentSchema);
  }

  public validateModule(data: unknown): ValidationResult {
    const valid = this.validateModuleSchema(data) as boolean;
    if (!valid && this.validateModuleSchema.errors) {
      return {
        valid: false,
        errors: this.validateModuleSchema.errors.map((err: ErrorObject) => 
          `${err.instancePath || 'root'}: ${err.message}${err.params ? ' (' + JSON.stringify(err.params) + ')' : ''}`
        )
      };
    }
    return { valid: true, errors: [] };
  }

  public validatePathway(data: unknown): ValidationResult {
    const valid = this.validatePathwaySchema(data) as boolean;
    if (!valid && this.validatePathwaySchema.errors) {
      return {
        valid: false,
        errors: this.validatePathwaySchema.errors.map((err: ErrorObject) => 
          `${err.instancePath || 'root'}: ${err.message}${err.params ? ' (' + JSON.stringify(err.params) + ')' : ''}`
        )
      };
    }
    return { valid: true, errors: [] };
  }

  public validateAssessment(data: unknown): ValidationResult {
    const valid = this.validateAssessmentSchema(data) as boolean;
    if (!valid && this.validateAssessmentSchema.errors) {
      return {
        valid: false,
        errors: this.validateAssessmentSchema.errors.map((err: ErrorObject) => 
          `${err.instancePath || 'root'}: ${err.message}${err.params ? ' (' + JSON.stringify(err.params) + ')' : ''}`
        )
      };
    }
    return { valid: true, errors: [] };
  }

  public validateModuleFile(filePath: string): ValidationResult {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = filePath.endsWith('.json') ? JSON.parse(content) : yaml.load(content);
      return this.validateModule(parsed);
    } catch (err: any) {
      return {
        valid: false,
        errors: [`File Read / Parse Error [${filePath}]: ${err.message}`]
      };
    }
  }

  public validatePathwayFile(filePath: string): ValidationResult {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = filePath.endsWith('.json') ? JSON.parse(content) : yaml.load(content);
      return this.validatePathway(parsed);
    } catch (err: any) {
      return {
        valid: false,
        errors: [`File Read / Parse Error [${filePath}]: ${err.message}`]
      };
    }
  }

  public validateAssessmentFile(filePath: string): ValidationResult {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = filePath.endsWith('.json') ? JSON.parse(content) : yaml.load(content);
      return this.validateAssessment(parsed);
    } catch (err: any) {
      return {
        valid: false,
        errors: [`File Read / Parse Error [${filePath}]: ${err.message}`]
      };
    }
  }
}
