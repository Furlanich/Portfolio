// Serves the exported `out/` directory the way GitHub Pages does, for the production browser
// specs (PLAYWRIGHT_SERVE_EXPORT=1) and local production checks. Unlike `next dev`, it has no route
// compilation, and unlike a single-page-app server it NEVER rewrites a missing route to an index: a
// retired route is a real 404 with the export's own 404 page.
//
// Usage: node scripts/serve-static-export.mjs
// Environment: PLAYWRIGHT_PORT or PORT (default 3100), HOST (default 127.0.0.1),
//   NEXT_PUBLIC_BASE_PATH (default none, e.g. /Portfolio), EXPORT_DIR (default out).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.map': 'application/json; charset=utf-8',
};

// GitHub Pages sends max-age=600 for every file; the same keeps cache behavior comparable.
const CACHE_CONTROL = 'max-age=600';

/** Mirrors `normalizeBasePath` in tests/e2e/support/paths.ts: '' or '/segment'. */
export function normalizeBasePath(value = '') {
  const trimmed = String(value).trim();
  if (!trimmed || trimmed === '/') return '';
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
}

function isInside(root, candidate) {
  return candidate === root || candidate.startsWith(root + path.sep);
}

function send(request, response, status, headers, body) {
  response.writeHead(status, { ...headers, 'content-length': body.length });
  response.end(request.method === 'HEAD' ? undefined : body);
}

export function createExportServer({ root, basePath = '' }) {
  const base = normalizeBasePath(basePath);
  const exportRoot = path.resolve(root);

  function notFound(request, response) {
    const page = path.join(exportRoot, '404.html');
    const body = fs.existsSync(page) ? fs.readFileSync(page) : Buffer.from('Not found');
    send(request, response, 404, { 'content-type': CONTENT_TYPES['.html'], 'cache-control': CACHE_CONTROL }, body);
  }

  function redirect(request, response, location) {
    send(request, response, 301, { location, 'cache-control': CACHE_CONTROL }, Buffer.alloc(0));
  }

  return http.createServer((request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      send(request, response, 405, { allow: 'GET, HEAD' }, Buffer.alloc(0));
      return;
    }

    let url;
    try {
      url = new URL(request.url ?? '/', 'http://export.invalid');
    } catch {
      notFound(request, response);
      return;
    }
    const { pathname, search } = url;

    if (base && pathname === base) {
      redirect(request, response, `${base}/${search}`);
      return;
    }
    if (base && !pathname.startsWith(`${base}/`)) {
      notFound(request, response);
      return;
    }

    let relative;
    try {
      relative = decodeURIComponent(pathname.slice(base.length));
    } catch {
      notFound(request, response);
      return;
    }
    const segments = relative.split('/').filter(Boolean);
    if (segments.some((segment) => segment === '..' || segment.includes('\0') || segment.includes('\\'))) {
      notFound(request, response);
      return;
    }

    const target = path.join(exportRoot, ...segments);
    if (!isInside(exportRoot, target)) {
      notFound(request, response);
      return;
    }

    let stats;
    try {
      stats = fs.statSync(target);
    } catch {
      notFound(request, response);
      return;
    }

    let file = target;
    if (stats.isDirectory()) {
      if (!pathname.endsWith('/')) {
        redirect(request, response, `${pathname}/${search}`);
        return;
      }
      file = path.join(target, 'index.html');
      if (!fs.existsSync(file)) {
        notFound(request, response);
        return;
      }
    } else if (pathname.endsWith('/')) {
      notFound(request, response);
      return;
    }

    send(
      request,
      response,
      200,
      { 'content-type': CONTENT_TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'cache-control': CACHE_CONTROL },
      fs.readFileSync(file),
    );
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PLAYWRIGHT_PORT ?? process.env.PORT ?? 3100);
  const host = process.env.HOST ?? '127.0.0.1';
  const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH ?? '');
  const root = path.resolve(process.cwd(), process.env.EXPORT_DIR ?? 'out');

  if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error(`No static export at ${root}. Run a clean \`npm run build\` first.`);
    process.exit(1);
  }
  const server = createExportServer({ root, basePath });
  server.listen(port, host, () => {
    console.log(`Serving ${root} at http://${host}:${port}${basePath}/`);
  });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
