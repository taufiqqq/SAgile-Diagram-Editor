import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/backend/index.ts'],
  outDir: 'dist-server',
  format: 'esm',
  target: 'node20',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  shims: false,
});
