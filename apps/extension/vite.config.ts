import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
        popup: resolve(__dirname, 'src/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  plugins: [
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy manifest.json to dist/
        const manifestSrc = resolve(__dirname, 'manifest.json');
        const manifestDist = resolve(__dirname, 'dist/manifest.json');
        if (fs.existsSync(manifestSrc)) {
          let manifestContent = fs.readFileSync(manifestSrc, 'utf-8');
          // Fix relative paths for dist/ root
          manifestContent = manifestContent.replace(/dist\//g, '');
          fs.writeFileSync(manifestDist, manifestContent);
        }

        // Copy popup.html to dist/
        const popupSrc = resolve(__dirname, 'popup.html');
        const popupDist = resolve(__dirname, 'dist/popup.html');
        if (fs.existsSync(popupSrc)) {
          let popupContent = fs.readFileSync(popupSrc, 'utf-8');
          popupContent = popupContent.replace(/dist\/popup\.js/g, 'popup.js');
          fs.writeFileSync(popupDist, popupContent);
        }
      },
    },
  ],
});
