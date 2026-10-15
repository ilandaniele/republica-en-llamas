import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Stable vendor chunks: cached across deploys and fetched only by screens that need them.
const VENDOR_GROUPS = [
  { name: 'vendor-react', test: /node_modules\/(react|react-dom|react-router|scheduler)\// },
  { name: 'vendor-gsap', test: /node_modules\/(gsap|@gsap\/react)\// },
  { name: 'vendor-supabase', test: /node_modules\/@supabase\// },
  { name: 'vendor-query', test: /node_modules\/@tanstack\// },
  { name: 'vendor-i18n', test: /node_modules\/(i18next|react-i18next)\// },
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@engine': path.resolve(import.meta.dirname, '../../packages/game-engine/src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: 'es2022',
    rolldownOptions: {
      output: { codeSplitting: { groups: VENDOR_GROUPS } },
    },
  },
});
