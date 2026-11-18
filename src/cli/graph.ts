#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import { KnowledgeGraph } from '../core/graph/knowledge-graph.js';
import { SchemaValidator } from '../core/validation/schema-validator.js';

const program = new Command();
const validator = new SchemaValidator();

program
  .name('techtree-graph')
  .description('Graph engine CLI for inspecting dependencies, cycle detection, and pathway synthesis.')
  .version('0.1.0');

program
  .command('check')
  .description('Scan modules directory, build knowledge DAG, and check for cycles and anomalies')
  .option('-p, --path <dir>', 'Directory containing modules', 'modules')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.path);
    console.log(`\n🌐 Tech Tree Graph Inspector`);
    console.log(`Scanning directory: ${targetDir}\n`);

    const graph = new KnowledgeGraph();
    const loadResult = graph.loadFromDirectory(targetDir, validator);

    console.log(`Loaded ${loadResult.loaded} module(s).`);
    if (loadResult.errors.length > 0) {
      console.log(`⚠️ Warnings/Errors during load:`);
      for (const err of loadResult.errors) {
        console.log(`  - ${err}`);
      }
    }

    const cycleResult = graph.detectCycles();
    if (cycleResult.hasCycle) {
      console.error(`\n❌ CIRCULAR PREREQUISITE DETECTED!`);
      console.error(`Cycle Path: ${cycleResult.cyclePath.join(' -> ')}\n`);
      process.exit(1);
    } else {
      console.log(`✅ Prerequisite DAG is strictly acyclic (No cycles detected).`);
    }

    const redundancies = graph.findTransitiveRedundancies();
    if (redundancies.length > 0) {
      console.log(`\nℹ️ Transitive Redundancies Found (${redundancies.length}):`);
      for (const red of redundancies) {
        console.log(`  - Edge [${red.from} -> ${red.to}] is redundant via [${red.via}]`);
      }
    } else {
      console.log(`✅ Zero transitive redundancies.`);
    }

    console.log(`\nGraph Summary:`);
    console.log(`  - Total Sovereign Nodes: ${graph.getNodeCount()}`);
    console.log(`----------------------------------------\n`);
  });

program
  .command('pathway')
  .description('Resolve a complete prerequisite pathway to a target module or capstone')
  .requiredOption('-t, --target <slugs...>', 'Target module slug(s)')
  .option('-c, --completed <slugs...>', 'Slugs of already completed modules', [])
  .option('-p, --path <dir>', 'Directory containing modules', 'modules')
  .action((options) => {
    const targetDir = path.resolve(process.cwd(), options.path);
    const graph = new KnowledgeGraph();
    graph.loadFromDirectory(targetDir, validator);

    console.log(`\n🧭 Tech Tree Pathway Resolver`);
    console.log(`Target(s): ${options.target.join(', ')}`);
    if (options.completed.length > 0) {
      console.log(`Completed: ${options.completed.join(', ')}`);
    }
    console.log(``);

    try {
      const resolution = graph.resolvePathway(options.target, options.completed);

      console.log(`Ordered Learning Sequence (${resolution.orderedSequence.length} step(s), ~${resolution.estimatedTotalMinutes} mins):`);
      resolution.orderedSequence.forEach((node, idx) => {
        const isDone = resolution.alreadyCompletedSlugs.includes(node.slug);
        const marker = isDone ? '✓ [COMPLETED]' : `Step ${idx + 1}`;
        console.log(`  ${marker} ${node.title} (${node.slug}) [Tier ${node.proficiencyTier} | ~${node.estimatedDurationMinutes}m]`);
      });

      if (resolution.missingSlugs.length === 0) {
        console.log(`\n🎉 All prerequisites completed! Ready to build capstone.`);
      } else {
        console.log(`\nPending to study: ${resolution.missingSlugs.length} module(s).`);
      }

      if (resolution.recommendedModules.length > 0) {
        console.log(`\n💡 Recommended Complementary Modules:`);
        for (const rec of resolution.recommendedModules) {
          console.log(`  - ${rec.title} (${rec.slug}) [${rec.discipline}/${rec.domain}]`);
        }
      }
      console.log(``);
    } catch (err: any) {
      console.error(`❌ Pathway Resolution Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
