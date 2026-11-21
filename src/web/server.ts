import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const publicDir = path.join(projectRoot, 'public');
const modulesDir = path.join(projectRoot, 'modules');
const pathwaysDir = path.join(projectRoot, 'pathways');
const dataDir = path.join(projectRoot, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const progressFilePath = path.join(dataDir, 'user-progress.json');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.yaml': 'text/yaml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

// Helper: Read modules bundle
function getModulesData(): Record<string, any> {
  const bundlePath = path.join(publicDir, 'data', 'modules.json');
  if (fs.existsSync(bundlePath)) {
    try {
      return JSON.parse(fs.readFileSync(bundlePath, 'utf-8'));
    } catch (e) {
      console.error('Error parsing modules.json:', e);
    }
  }
  return {};
}

// Helper: Find module directory by slug
function findModuleDirBySlug(slug: string): string | null {
  function scan(dir: string): string | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        const manifest = path.join(full, 'module.yaml');
        if (fs.existsSync(manifest)) {
          try {
            const doc = yaml.load(fs.readFileSync(manifest, 'utf-8')) as any;
            if (doc && doc.slug === slug) {
              return full;
            }
          } catch (e) {
            // ignore
          }
        }
        const res = scan(full);
        if (res) return res;
      }
    }
    return null;
  }
  return scan(modulesDir);
}

// Helper: Read user progress
function readUserProgress(): any {
  if (fs.existsSync(progressFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(progressFilePath, 'utf-8'));
    } catch (e) {
      console.error('Error reading progress file:', e);
    }
  }
  return {
    completedModules: [],
    currentModule: 'math-vectors-2d',
    currentChapter: null,
    quizScores: {},
    lastActive: new Date().toISOString()
  };
}

// Helper: Save user progress
function saveUserProgress(progress: any): void {
  progress.lastActive = new Date().toISOString();
  fs.writeFileSync(progressFilePath, JSON.stringify(progress, null, 2), 'utf-8');
}

// Server implementation
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // ---------------------------------------------------------------------------
  // REST API ROUTING
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    // 1. Health check
    if (pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'Tech Tree Sovereign Knowledge API',
        version: '0.2.0',
        node: process.version
      }));
      return;
    }

    // 2. All modules list
    if (pathname === '/api/modules') {
      const modulesMap = getModulesData();
      const list = Object.values(modulesMap).map((m: any) => {
        const modDir = findModuleDirBySlug(m.slug);
        let chaptersCount = 0;
        if (modDir) {
          const chapDir = path.join(modDir, 'chapters');
          if (fs.existsSync(chapDir)) {
            chaptersCount = fs.readdirSync(chapDir).filter(f => f.endsWith('.md')).length;
          }
        }
        return {
          id: m.id,
          slug: m.slug,
          title: m.title,
          discipline: m.discipline,
          domain: m.domain,
          proficiencyTier: m.proficiencyTier,
          duration: m.duration,
          summary: m.summary,
          prerequisites: m.prerequisites,
          wordCount: (m.content || '').trim().split(/\s+/).length,
          hasChapters: chaptersCount > 0,
          chaptersCount
        };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(list, null, 2));
      return;
    }

    // 3. Specific module chapters list: /api/modules/:slug/chapters
    const chaptersMatch = pathname.match(/^\/api\/modules\/([a-zA-Z0-9_\-]+)\/chapters$/);
    if (chaptersMatch) {
      const slug = chaptersMatch[1];
      const modDir = findModuleDirBySlug(slug);
      if (!modDir) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Module '${slug}' not found` }));
        return;
      }
      const chapDir = path.join(modDir, 'chapters');
      if (!fs.existsSync(chapDir)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
        return;
      }
      const files = fs.readdirSync(chapDir).filter(f => f.endsWith('.md')).sort();
      const chapters = files.map(filename => {
        const filePath = path.join(chapDir, filename);
        const text = fs.readFileSync(filePath, 'utf-8');
        const firstLine = text.split('\n').find(l => l.startsWith('# ')) || filename;
        const title = firstLine.replace(/^#\s*/, '').trim();
        const words = text.trim().split(/\s+/).length;
        return {
          filename,
          title,
          wordCount: words,
          downloadUrl: `/api/modules/${slug}/chapters/${filename}`
        };
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(chapters, null, 2));
      return;
    }

    // 4. Specific module single chapter content: /api/modules/:slug/chapters/:chapterFile
    const singleChapMatch = pathname.match(/^\/api\/modules\/([a-zA-Z0-9_\-]+)\/chapters\/([a-zA-Z0-9_\-\.]+)$/);
    if (singleChapMatch) {
      const slug = singleChapMatch[1];
      const filename = singleChapMatch[2];
      const modDir = findModuleDirBySlug(slug);
      if (!modDir) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Module '${slug}' not found` }));
        return;
      }
      const filePath = path.join(modDir, 'chapters', filename);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Chapter file '${filename}' not found` }));
        return;
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      if (url.searchParams.get('format') === 'json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ filename, content, wordCount: content.trim().split(/\s+/).length }));
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `inline; filename="${filename}"`
        });
        res.end(content);
      }
      return;
    }

    // 5. Specific module detail: /api/modules/:slug
    const moduleMatch = pathname.match(/^\/api\/modules\/([a-zA-Z0-9_\-]+)$/);
    if (moduleMatch) {
      const slug = moduleMatch[1];
      const modulesMap = getModulesData();
      const mod = modulesMap[slug];
      if (!mod) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: `Module '${slug}' not found` }));
        return;
      }
      const modDir = findModuleDirBySlug(slug);
      let chapters: any[] = [];
      if (modDir) {
        const chapDir = path.join(modDir, 'chapters');
        if (fs.existsSync(chapDir)) {
          chapters = fs.readdirSync(chapDir).filter(f => f.endsWith('.md')).sort().map(f => {
            const p = path.join(chapDir, f);
            const txt = fs.readFileSync(p, 'utf-8');
            const heading = (txt.split('\n').find(l => l.startsWith('# ')) || f).replace(/^#\s*/, '').trim();
            return { filename: f, title: heading, wordCount: txt.trim().split(/\s+/).length };
          });
        }
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ...mod, chapters }, null, 2));
      return;
    }

    // 6. Learning Pathways: /api/pathways
    if (pathname === '/api/pathways') {
      try {
        const files = fs.readdirSync(pathwaysDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
        const pathways = files.map(f => {
          const content = fs.readFileSync(path.join(pathwaysDir, f), 'utf-8');
          const doc = yaml.load(content) as any;
          return { filename: f, ...doc };
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(pathways, null, 2));
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read pathways', details: err.message }));
      }
      return;
    }

    // 7. Learner Progress: GET /api/progress & POST /api/progress
    if (pathname === '/api/progress') {
      if (req.method === 'GET') {
        const progress = readUserProgress();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(progress, null, 2));
        return;
      } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const update = JSON.parse(body || '{}');
            const current = readUserProgress();
            const merged = { ...current, ...update };
            saveUserProgress(merged);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, progress: merged }));
          } catch (err: any) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON', details: err.message }));
          }
        });
        return;
      }
    }

    // Unmatched /api
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `API route '${pathname}' not found` }));
    return;
  }

  // ---------------------------------------------------------------------------
  // STATIC FILE SERVING
  // ---------------------------------------------------------------------------
  let reqPath = pathname;
  if (reqPath === '/' || reqPath.startsWith('/?')) {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(publicDir, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found - Tech Tree Sovereign Web Server');
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌳 The Tech Tree of Knowledge: Sovereign Web Server Active!`);
  console.log(`Local UI Access: http://localhost:${PORT}`);
  console.log(`REST API Health: http://localhost:${PORT}/api/health`);
  console.log(`REST API Modules: http://localhost:${PORT}/api/modules`);
  console.log(`Serving static: ${publicDir}`);
  console.log(`======================================================\n`);
});
