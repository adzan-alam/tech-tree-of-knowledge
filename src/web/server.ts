import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../');
const publicDir = path.join(projectRoot, 'public');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.yaml': 'text/yaml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url || '/';
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
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found - Tech Tree Web Server');
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌳 The Tech Tree of Knowledge: Web Interface Active!`);
  console.log(`Local Access URL: http://localhost:${PORT}`);
  console.log(`Serving directory: ${publicDir}`);
  console.log(`Press Ctrl+C to stop.`);
  console.log(`======================================================\n`);
});
