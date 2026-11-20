import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const publicDir = path.join(projectRoot, 'public');

describe('Web Interface Test Suite', () => {
  it('should verify that public/index.html exists and contains necessary structural views', () => {
    const indexPath = path.join(publicDir, 'index.html');
    assert.ok(fs.existsSync(indexPath), 'public/index.html must exist');

    const content = fs.readFileSync(indexPath, 'utf-8');
    assert.ok(content.includes('tab-graph'), 'Must include interactive graph view');
    assert.ok(content.includes('tab-pathways'), 'Must include pathway explorer view');
    assert.ok(content.includes('tab-reader'), 'Must include module reader view');
    assert.ok(content.includes('tab-simulator'), 'Must include physics simulator view');
    assert.ok(content.includes('math-vectors-2d'), 'Must embed pilot modules');
    assert.ok(content.includes('physicsCanvas'), 'Must include interactive HTML5 canvas');
  });
});
