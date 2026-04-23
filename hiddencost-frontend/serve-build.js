const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.FRONTEND_PORT || 3000;
const BUILD_DIR = path.join(__dirname, 'build');
const INDEX_FILE = path.join(BUILD_DIR, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function sendFile(filePath, response) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Server error');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000',
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const requestedPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const safePath = requestedPath === '/' ? '/index.html' : requestedPath;
  const filePath = path.normalize(path.join(BUILD_DIR, safePath));

  if (!filePath.startsWith(BUILD_DIR)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(filePath, response);
      return;
    }

    sendFile(INDEX_FILE, response);
  });
});

server.listen(PORT, () => {
  console.log(`HiddenCost frontend running at http://localhost:${PORT}`);
});
