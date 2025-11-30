import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  // Define a raiz como o diretório atual onde está o index.html
=======
  // A raiz do projeto é o diretório atual (.)
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
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
<<<<<<< HEAD
      '@': '.', 
    },
	base: './' ,
=======
      // Garante que importações com @/ funcionem se necessário, apontando para a raiz
      '@': '.', 
    }
>>>>>>> b511febc2fc91451d023da32066bfa29f2a24dc8
  }
});