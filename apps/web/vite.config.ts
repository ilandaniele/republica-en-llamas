import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Stable vendor chunks: cached across deploys and fetched only by screens that need them.
const VENDOR_CHUNKS: Record<string, string[]> = {
  'vendor-react': ['react', 'react-dom', 'react-router-dom', 'scheduler'],
  'vendor-motion': ['framer-motion'],
  'vendor-gsap': ['gsap', '@gsap/react'],
  'vendor-supabase': ['@supabase/'],
  'vendor-query': ['@tanstack/'],
  'vendor-i18n': ['i18next', 'react-i18next'],
};

function vendorChunk(id: string): string | undefined {
  if (!id.includes('node_modules')) return undefined;
  const modulePath = id.split('node_modules/').pop() ?? '';
  return Object.keys(VENDOR_CHUNKS).find((chunk) =>
    VENDOR_CHUNKS[chunk]?.some((pkg) => modulePath.startsWith(pkg.endsWith('/') ? pkg : `${pkg}/`)),
  );
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': path.resolve(__dirname, '../../packages/game-engine/src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: { manualChunks: vendorChunk },
    },
  },
});
