import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define a raiz como o diretório atual onde está o index.html
  root: '.', 
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true, // Permite acesso via IP na rede local
  },
  resolve: {
    alias: {
      '@': '.', 
    },
	base: './' ,
  }
});