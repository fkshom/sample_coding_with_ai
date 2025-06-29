import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  base: '/sample_coding_with_ai/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 12000,
    cors: true,
    allowedHosts: ['work-1-fxtbxxyytxumvjjk.prod-runtime.all-hands.dev'],
  },
})
