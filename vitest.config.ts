/// <reference types="vitest" />

import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    include: ['./src/server/tests/**/*.test.ts'],
    globalSetup: './src/server/tests/global-setup.ts',
    testTimeout: 30 * 1000,
    bail: 1,
    threads: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
