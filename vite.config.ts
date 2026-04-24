import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    proxy: {
      // 将以 /api 开头的请求代理到 http://localhost:3000
      '/api': {
        //target: 'http://localhost:8080',
        //target: 'http://backend:8080',
        target: 'http://http://8.136.159.195:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
