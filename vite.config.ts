import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // A raiz do projeto é o diretório atual (.)
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
      // Garante que importações com @/ funcionem se necessário, apontando para a raiz
      '@': '.', 
    }
  }
});