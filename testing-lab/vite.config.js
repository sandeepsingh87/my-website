import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function emitIndexHtml() {
  return {
    name: 'emit-index-html',
    closeBundle() {
      const from = resolve(__dirname, 'dist/dev.html');
      const to = resolve(__dirname, 'dist/index.html');
      if (existsSync(from)) {
        copyFileSync(from, to);
      }
    }
  };
}

/** Vite rejects `/testing-lab` when `base` is `/testing-lab/`. Redirect before that check. */
function redirectBareBase(basePath = '/testing-lab') {
  function middleware(req, res, next) {
    const raw = req.url || '';
    const q = raw.indexOf('?');
    const pathname = q === -1 ? raw : raw.slice(0, q);
    const search = q === -1 ? '' : raw.slice(q);
    if (pathname === basePath) {
      res.statusCode = 308;
      res.setHeader('Location', `${basePath}/${search}`);
      res.end();
      return;
    }
    next();
  }

  return {
    name: 'redirect-bare-base',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    }
  };
}

export default defineConfig({
  plugins: [redirectBareBase(), react(), emitIndexHtml()],
  base: '/testing-lab/',
  appType: 'spa',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'dev.html')
      }
    }
  },
  server: {
    port: 5173,
    strictPort: false
  },
  preview: {
    port: 4173
  }
});
