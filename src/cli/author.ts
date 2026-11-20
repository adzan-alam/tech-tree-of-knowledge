#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { ModuleScaffolder } from '../authoring/scaffold.js';
import { ProvenanceLinter } from '../authoring/provenance-linter.js';
import { VerificationAuditor } from '../authoring/verification-auditor.js';
import { Discipline, ProficiencyTier } from '../core/validation/types.js';

const program = new Command();

program
  .name('techtree-author')
  .description('Authoring studio CLI for scaffolding modules, citation linting, and verification auditing.')
  .version('0.1.0');

program
  .command('create')
  .description('Scaffold a new sovereign knowledge module directory')
  .requiredOption('-s, --slug <slug>', 'Unique kebab-case module slug (e.g. phys-work-energy)')
  .requiredOption('-t, --title <title>', 'Full human-readable title of the module')
  .requiredOption('-d, --discipline <discipline>', 'Discipline (mathematics, physics, computer-science, chemistry)')
  .requiredOption('--domain <domain>', 'Domain or subfield (e.g. classical-mechanics, linear-algebra)')
  .option('--tier <tier>', 'Proficiency tier (1, 2, 3, 4)', '2')
  .option('--duration <minutes>', 'Estimated duration in minutes', '60')
  .option('-o, --output <dir>', 'Base directory for modules', 'modules')
  .action((options) => {
    try {
      console.log(`\n🌱 Scaffolding New Sovereign Knowledge Module:`);
      console.log(`  Slug:       ${options.slug}`);
      console.log(`  Title:      ${options.title}`);
      console.log(`  Discipline: ${options.discipline}`);
      console.log(`  Domain:     ${options.domain}`);
      console.log(`  Tier:       ${options.tier}`);

      const res = ModuleScaffolder.scaffoldModule({
        slug: options.slug,
        title: options.title,
        discipline: options.discipline as Discipline,
        domain: options.domain,
        proficiencyTier: parseInt(options.tier, 10) as ProficiencyTier,
        estimatedDurationMinutes: parseInt(options.duration, 10),
        outputBaseDir: path.resolve(process.cwd(), options.output)
      });

      console.log(`\n✅ Successfully scaffolded module at:`);
      console.log(`  Directory:  ${res.moduleDir}`);
      console.log(`  Manifest:   ${res.moduleYamlPath}`);
      console.log(`  Content:    ${res.contentMdPath}`);
      console.log(`  Assessment: ${res.assessmentYamlPath}\n`);
    } catch (err: any) {
      console.error(`\n❌ Error scaffolding module: ${err.message}\n`);
      process.exit(1);
    }
  });

program
  .command('lint')
  .description('Audit source citations, Bloom taxonomy alignment, and KaTeX formatting')
  .option('-p, --path <target>', 'Target module directory', 'modules')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.path);
    console.log(`\n🔍 Provenance & Pedagogical Linter`);
    console.log(`Scanning: ${targetDir}\n`);

    // Check if targetDir is a single module or a collection directory
    const moduleYamlPath = path.join(targetDir, 'module.yaml');
    const moduleDirs: string[] = [];

    if (fs.existsSync(moduleYamlPath)) {
      moduleDirs.push(targetDir);
    } else {
      // Find all module directories recursively
      const scan = (dir: string) => {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist') {
              if (fs.existsSync(path.join(fullPath, 'module.yaml'))) {
                moduleDirs.push(fullPath);
              } else {
                scan(fullPath);
              }
            }
          }
        }
      };
      scan(targetDir);
    }

    if (moduleDirs.length === 0) {
      console.error(`❌ No modules found to lint in ${targetDir}`);
      process.exit(1);
    }

    let overallSuccess = true;
    for (const mDir of moduleDirs) {
      const result = ProvenanceLinter.auditModule(mDir);
      if (result.valid) {
        console.log(`✅ [PASS] ${result.moduleSlug}`);
        if (result.issues.length > 0) {
          for (const w of result.issues) {
            console.log(`     ⚠️  ${w.field}: ${w.message}`);
          }
        }
      } else {
        overallSuccess = false;
        console.error(`❌ [FAIL] ${result.moduleSlug}:`);
        for (const err of result.issues) {
          const icon = err.type === 'error' ? '🚫' : '⚠️ ';
          console.log(`     ${icon} ${err.field}: ${err.message}`);
        }
      }
    }

    if (!overallSuccess) {
      process.exit(1);
    }
  });

program
  .command('audit')
  .description('Audit verification readiness of all modules across the repository')
  .option('-p, --path <target>', 'Root modules directory to audit', 'modules')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.path);
    const summary = VerificationAuditor.auditRepository(targetDir);
    console.log(VerificationAuditor.generateReportString(summary));
    console.log(``);
  });

program.parse(process.argv);
