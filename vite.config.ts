import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 2560,
      verbose: false, 
    }),
  ],
  base: '',
  /*server: {
    proxy: {
      // 将以 /api 开头的请求代理到 http://localhost:3000
      '/api': {
        //target: 'http://localhost:8080',
        //target: 'http://backend:8080',
        target: 'http://8.136.159.195:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }*/
})
