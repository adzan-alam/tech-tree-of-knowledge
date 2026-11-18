#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { SchemaValidator } from '../core/validation/schema-validator.js';

const program = new Command();
const validator = new SchemaValidator();

program
  .name('techtree-validate')
  .description('Validate Tech Tree module, pathway, and assessment manifests against formal schemas.')
  .version('0.1.0')
  .option('-p, --path <target>', 'Target file or directory to scan', '.')
  .option('-t, --type <type>', 'Type of validation: auto, module, pathway, assessment', 'auto')
  .action((options) => {
    const targetPath = path.resolve(process.cwd(), options.path);
    console.log(`\n🔍 Tech Tree Schema Validator`);
    console.log(`Target: ${targetPath}`);
    console.log(`Mode: ${options.type}\n`);

    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Error: Target path "${targetPath}" does not exist.`);
      process.exit(1);
    }

    const stat = fs.statSync(targetPath);
    let totalFiles = 0;
    let failedFiles = 0;

    function processFile(filePath: string) {
      const fileName = path.basename(filePath);
      let res: { valid: boolean; errors: string[] } | null = null;
      let detectedType = options.type;

      if (detectedType === 'auto') {
        if (fileName === 'module.yaml' || fileName === 'module.yml' || fileName === 'module.json') {
          detectedType = 'module';
        } else if (fileName === 'assessment.yaml' || fileName === 'assessment.yml' || fileName === 'assessment.json') {
          detectedType = 'assessment';
        } else if (filePath.includes('pathways') && (fileName.endsWith('.yaml') || fileName.endsWith('.yml') || fileName.endsWith('.json'))) {
          detectedType = 'pathway';
        } else if (fileName.endsWith('.yaml') || fileName.endsWith('.yml') || fileName.endsWith('.json')) {
          // Content-based heuristic detection
          try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            if (raw.includes('classification:') || raw.includes('learning_objectives:')) {
              detectedType = 'module';
            } else if (raw.includes('target_goal:') || raw.includes('capstone_project:')) {
              detectedType = 'pathway';
            } else if (raw.includes('passing_threshold_percent:')) {
              detectedType = 'assessment';
            }
          } catch {
            // ignore read error here, processFile will report
          }
        }
      }

      if (detectedType === 'module') {
        res = validator.validateModuleFile(filePath);
      } else if (detectedType === 'pathway') {
        res = validator.validatePathwayFile(filePath);
      } else if (detectedType === 'assessment') {
        res = validator.validateAssessmentFile(filePath);
      }

      if (res) {
        totalFiles++;
        const relativePath = path.relative(process.cwd(), filePath);
        if (res.valid) {
          console.log(`  ✅ [${detectedType.toUpperCase()}] ${relativePath}`);
        } else {
          failedFiles++;
          console.log(`  ❌ [${detectedType.toUpperCase()}] ${relativePath}`);
          for (const err of res.errors) {
            console.log(`     └─ ${err}`);
          }
        }
      }
    }

    function scanDir(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
            scanDir(full);
          }
        } else if (entry.isFile()) {
          processFile(full);
        }
      }
    }

    if (stat.isDirectory()) {
      scanDir(targetPath);
    } else {
      processFile(targetPath);
    }

    console.log(`\n----------------------------------------`);
    console.log(`Summary: ${totalFiles} scanned | ${totalFiles - failedFiles} passed | ${failedFiles} failed.`);
    console.log(`----------------------------------------\n`);

    if (failedFiles > 0) {
      process.exit(1);
    }
  });

program.parse(process.argv);
