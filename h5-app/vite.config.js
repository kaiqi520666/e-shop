import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { visualizer } from 'rollup-plugin-visualizer'
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
