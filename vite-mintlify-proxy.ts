import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import https from 'node:https';

const MINTLIFY_ORIGIN = 'https://staplehire.mintlify.dev';

/** Proxy /docs/* to Mintlify before Vite's SPA fallback (dev + preview). */
function proxyDocs(req: IncomingMessage, res: ServerResponse) {
  const path = req.url ?? '/docs';
  const target = new URL(path, MINTLIFY_ORIGIN);

  const headers = { ...req.headers, host: target.host };
  delete headers['accept-encoding'];

  const proxyReq = https.request(
    target,
    { method: req.method, headers },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', () => {
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end('Docs proxy error');
    }
  });

  req.pipe(proxyReq);
}

function docsProxyMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  if (req.url?.startsWith('/docs')) {
    proxyDocs(req, res);
    return;
  }
  next();
}

export function mintlifyDocsProxy(): Plugin {
  return {
    name: 'mintlify-docs-proxy',
    configureServer(server) {
      server.middlewares.use(docsProxyMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(docsProxyMiddleware);
    },
  };
}
