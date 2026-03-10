import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const mockEnable = env.VITE_MOCK_ENABLE !== 'false'

  return {
    plugins: [
      vue(),
      tailwindcss(),
      viteMockServe({
        mockPath: './src/mock',
        enable: mockEnable,
        logger: true,
      }),
      visualizer({ open: true, gzipSize: true, filename: 'stats.html' }),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: '尊享商城',
          short_name: '尊享商城',
          theme_color: '#C8A84C',
          background_color: '#1a1a1a',
          display: 'standalone',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /\/api\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 300,
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: !mockEnable
        ? {
            '/api': {
              target: 'http://localhost:8001',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ''),
            },
          }
        : {},
    },
  }
})
