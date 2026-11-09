import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { insideRoot } from './load-config.mjs';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export function createStaticServer(directory) {
  const root = resolve(directory);
  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    try {
      if ((request.url?.length ?? 0) > 4096) {
        response.writeHead(414).end();
        return;
      }
      const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
      const file = resolve(root, pathname === '/' ? 'index.html' : `.${pathname}`);
      if (!insideRoot(root, file)) {
        response.writeHead(400).end();
        return;
      }
      const info = await stat(file);
      if (!info.isFile()) {
        response.writeHead(404).end();
        return;
      }
      response.writeHead(200, {
        'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
        'Content-Length': info.size,
      });
      if (request.method === 'HEAD') {
        response.end();
        return;
      }
      const stream = createReadStream(file);
      stream.on('error', () => response.destroy());
      response.on('close', () => stream.destroy());
      stream.pipe(response);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 400).end();
    }
  });
}

export async function listenLocal(directory) {
  const server = createStaticServer(directory);
  server.requestTimeout = 5000;
  server.headersTimeout = 5000;
  await new Promise((accept, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', accept);
  });
  return { server, baseUrl: `http://127.0.0.1:${server.address().port}` };
}
