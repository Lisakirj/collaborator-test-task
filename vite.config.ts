import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const REPO_NAME = 'collaborator-test-task';

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
