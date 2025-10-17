import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Use happy-dom for faster tests (alternative: jsdom)
    environment: 'happy-dom',
    // Setup files to run before each test file
    setupFiles: ['./src/test/setup.ts'],
    // Enable globals like describe, it, expect without imports
    globals: true,
    // Exclude E2E tests from Vitest (use Playwright for those)
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/.{idea,git,cache,output,temp}/**'],
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', 'e2e/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
