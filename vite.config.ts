import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';
import electron from 'vite-plugin-electron';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 2560,
      verbose: false, 
    }),
    electron({
      entry: 'electron/main.js', // 指定主进程入口
    }),
  ],
  build: {
    outDir: 'dist', // 确保构建输出目录与主进程加载路径一致
  },
  base: './',
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
