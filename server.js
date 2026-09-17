const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const requestUrl = decodeURIComponent(req.url.split('?')[0]);
  const relativePath = requestUrl === '/' ? 'index.html' : requestUrl.replace(/^\/+/, '');

  // Resolve and guard against path traversal outside the public directory.
  const filePath = path.normalize(path.join(PUBLIC_DIR, relativePath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err404, data404) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end(err404 ? '404 Not Found' : data404);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Yoga with Sheena — Bangalore Retreat 2027 running at http://localhost:${PORT}`);
});
