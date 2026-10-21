import { defineConfig } from 'vite';

// face-api trae su propio TensorFlow.js: se excluye del pre-empaquetado para que Vite no lo procese en cada arranque.
export default defineConfig({
  optimizeDeps: { exclude: ['@vladmandic/face-api'] },
  build: { chunkSizeWarningLimit: 2000 },
});
