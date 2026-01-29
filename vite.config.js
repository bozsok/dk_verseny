import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // === ALAPBEÁLLÍTÁSOK ===
  root: '.',
  publicDir: 'public',

  // === BUILD BEÁLLÍTÁSOK ===
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,

    // Rollup beállítások
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Asset naming
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',

        // Manual chunks
        manualChunks: {
          'core': ['src/core/state/GameStateManager.js', 'src/core/events/EventBus.js', 'src/core/logging/GameLogger.js'],
          'ui': ['src/ui/components/Button.js', 'src/ui/components/Card.js'],
          'features': ['src/features/navigation/Hub.js']
        }
      }
    },

    // Terser beállítások
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        safari10: true
      }
    }
  },

  // === DEVELOPMENT SERVER ===
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true
  },

  // === RESOLVE BEÁLLÍTÁSOK ===
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, 'src/core'),
      '@features': resolve(__dirname, 'src/features'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@utils': resolve(__dirname, 'src/utils')
    },

    // File extensions
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },

  // === CSS BEÁLLÍTÁSOK ===
  css: {
    // CSS Variables support
    preprocessorOptions: {
      css: {
        charset: false
      }
    },

    // PostCSS beállítások
    // postcss: './postcss.config.js'
  },

  // === OPTIMIZE DEPS ===
  optimizeDeps: {
    include: [
      'src/core/state/GameStateManager.js',
      'src/core/events/EventBus.js',
      'src/core/logging/GameLogger.js',
      'src/ui/components/Button.js',
      'src/ui/components/Card.js',
      'src/features/navigation/Hub.js'
    ]
  },

  // === PLUGIN BEÁLLÍTÁSOK ===
  plugins: [
    // Environment variables
    {
      name: 'environment-variables',
      config(config) {
        config.define = {
          ...config.define,
          __DEV__: process.env.NODE_ENV === 'development',
          __PROD__: process.env.NODE_ENV === 'production'
        };
      }
    },
    // Video Config API (Development only)
    {
      name: 'video-config-api',
      configureServer(server) {
        const fs = require('fs');
        const path = require('path');

        // GET /\_\_api/video-config/:grade
        server.middlewares.use((req, res, next) => {
          const match = req.url.match(/^\/__api\/video-config\/(\d+)$/);
          if (!match) return next();

          const grade = match[1];
          const configPath = path.resolve(__dirname, `src/content/grade${grade}/video-config.json`);

          if (req.method === 'GET') {
            try {
              if (fs.existsSync(configPath)) {
                const data = fs.readFileSync(configPath, 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
              } else {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ slides: {} }));
              }
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const data = JSON.parse(body);
                fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8');
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                console.log(`[Video Config API] Saved config for grade ${grade}`);
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],

  // === WORKER SUPPORT ===
  worker: {
    format: 'es'
  },

  // === ASSET IMPORT ===
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot', '**/*.mp4', '**/*.webm', '**/*.ogg', '**/*.mp3', '**/*.wav', '**/*.flac', '**/*.aac'],

  // === PERFORMANCE ===
  esbuild: {
    // Tree shaking
    treeShaking: true,

    // Target
    target: 'es2015',

    // Drop debugger
    drop: process.env.NODE_ENV === 'production' ? ['debugger', 'console'] : []
  },

  // === PREVIEW SERVER ===
  preview: {
    port: 4173,
    open: true,
    cors: true
  },

  // === ENVIRONMENT SPECIFIC ===
  define: {
    // Version info
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),

    // Build info
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __BUILD_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
  },

  // === LOGGING ===
  logLevel: 'info',
  clearScreen: false,

  // === LEGACY SUPPORT ===
  legacy: {
    // IE11 support (ha szükséges)
    targets: ['defaults', 'not IE 11']
  }
});