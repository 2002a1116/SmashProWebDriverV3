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
})
