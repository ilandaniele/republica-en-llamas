import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'json-summary'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/**/*.d.ts'],
      },
      server: {
        deps: {
          inline: [/@tanstack\//, /react-i18next/, /zustand/, /use-sync-external-store/, /@gsap\/react/],
        },
      },
      deps: {
        optimizer: { client: { enabled: true, include: ['use-sync-external-store/shim/with-selector.js'] } },
      },
    },
  }),
);
