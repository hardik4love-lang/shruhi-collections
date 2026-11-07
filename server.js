/**
 * Shruhi Collections — Production Static HTTP Web Server
 * =======================================================
 * Zero-dependency, high-performance HTTP/1.1 static server with:
 * - Gzip compression
 * - Security response headers (nosniff, SAMEORIGIN, referrer-policy)
 * - HTTP Cache-Control (30-day immutable caching for static assets, 1h revalidate for HTML)
 * - Path traversal sanitization
 * - Automated /health and /api/catalog endpoints
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = parseInt(process.env.PORT || '8096', 10);
const ROOT_DIR = path.resolve(__dirname);
const START_TIME = Date.now();

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=UTF-8',
  '.txt': 'text/plain; charset=UTF-8',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.tsv': 'text/tab-separated-values; charset=UTF-8'
};

// Security headers applied to all responses
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block'
};

// Load catalog count once at startup
let catalogCount = 59;
try {
  const catalogFile = fs.readFileSync(path.join(ROOT_DIR, 'catalog-data.js'), 'utf8');
  const match = catalogFile.match(/["']?id["']?\s*:\s*["'][^"']+["']/g);
  if (match) {
    catalogCount = match.length;
  }
} catch (e) {
  // default fallback
}

const server = http.createServer((req, res) => {
  // Apply standard security headers
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  // Health check endpoint
  if (pathname === '/health' || pathname === '/healthz') {
    const payload = JSON.stringify({
      status: 'healthy',
      service: 'shruhi-collections-web',
      catalog_count: catalogCount,
      uptime_seconds: Math.floor((Date.now() - START_TIME) / 1000),
      timestamp: new Date().toISOString()
    });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(payload);
    return;
  }

  // API Status & Catalog Diagnostics
  if (pathname === '/api/status' || pathname === '/api/catalog') {
    const payload = JSON.stringify({
      status: 'online',
      platform: 'Shruhi Collections Surat Digital Flagship',
      catalog_count: catalogCount,
      primary_wa: '+91 90542 41725',
      mens_wa: '+91 88496 01725',
      node_version: process.version
    });
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(payload);
    return;
  }

  // Normalize default file routing
  if (pathname === '/') {
    pathname = '/index.html';
  } else if (!path.extname(pathname)) {
    // If requesting e.g. /collections/curvy-couture, look for .html
    if (fs.existsSync(path.join(ROOT_DIR, `${pathname}.html`))) {
      pathname = `${pathname}.html`;
    }
  }

  // Path traversal prevention
  const safePath = path.normalize(path.join(ROOT_DIR, pathname));
  if (!safePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Stat file
  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 handler with fallback to index.html if SPA or direct 404
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;text-align:center;padding:4rem;"><h1>404 — Edition Not Found</h1><p>The requested page does not exist.</p><a href="/" style="color:#6d1b29;font-weight:bold;">Return to Shruhi Collections Storefront</a></body></html>`);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Service Worker special headers
    if (pathname === '/service-worker.js') {
      res.setHeader('Service-Worker-Allowed', '/');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else if (safePath.includes(`${path.sep}assets${path.sep}`) || ext === '.jpg' || ext === '.png' || ext === '.webp') {
      // Static media: Cache for 30 days, immutable
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    } else if (ext === '.css' || ext === '.js') {
      // CSS & JS: Cache for 1 day with revalidation
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=43200');
    } else if (ext === '.webmanifest') {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      // HTML & metadata: Cache for 1 hour with revalidation
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Last-Modified', stats.mtime.toUTCString());

    // 304 Not Modified support
    const ifModifiedSince = req.headers['if-modified-since'];
    if (ifModifiedSince && new Date(ifModifiedSince) >= stats.mtime) {
      res.writeHead(304);
      res.end();
      return;
    }

    // Only GET and HEAD allowed
    if (req.method === 'HEAD') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('405 Method Not Allowed');
      return;
    }

    // Check Gzip support for text assets
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const isCompressible = contentType.includes('text') || contentType.includes('javascript') || contentType.includes('json') || contentType.includes('xml');

    if (isCompressible && acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      res.writeHead(200);
      const rawStream = fs.createReadStream(safePath);
      const gzipStream = zlib.createGzip();
      rawStream.pipe(gzipStream).pipe(res);
    } else {
      res.setHeader('Content-Length', stats.size);
      res.writeHead(200);
      fs.createReadStream(safePath).pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Shruhi Collections] Production Web Server online at http://0.0.0.0:${PORT}`);
  console.log(`[Shruhi Collections] Serving catalog with ${catalogCount} editions.`);
});

// Graceful termination
const shutdown = () => {
  console.log('[Shruhi Collections] Shutting down web server cleanly...');
  server.close(() => {
    process.exit(0);
  });
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;
