import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: './demo',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: '../dist/demo',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-prosemirror': [
            'prosemirror-model',
            'prosemirror-state',
            'prosemirror-view',
            'prosemirror-commands',
            'prosemirror-history',
            'prosemirror-keymap',
            'prosemirror-dropcursor',
            'prosemirror-tables',
          ],
          'vendor-docx': ['jszip', 'pizzip', 'docxtemplater', 'xml-js'],
        },
      },
    },
  },
});
