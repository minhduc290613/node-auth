import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'public',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(process.cwd(), 'src/client/js/main.js'),
      output: {
        entryFileNames: 'js/bundle.js',
        assetFileNames: 'css/bundle.[ext]'
      }
    }
  }
});