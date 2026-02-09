import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    // Timeout para testes de integração com banco
    testTimeout: 15000,
    hookTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'clover'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'test/**',
        'cypress/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.cy.ts',
        '**/*.config.{js,ts,mjs}',
        '**/.eslintrc.js',
        '**/eslint.config.mjs',
        'src/main.ts',
        'src/app.module.ts',
        '**/*.module.ts',
        '**/*.dto.ts',
        '**/*.schema.ts',
        '**/*.interface.ts',
        '**/*.entity.ts',
      ],
      include: ['src/**/*.ts'],
      all: true,
      // Thresholds realistas para backend NestJS
      lines: 70,
      functions: 70,
      branches: 65,
      statements: 70,
      thresholds: {
        autoUpdate: false,
        perFile: false,
        lines: 70,
        functions: 70,
        branches: 65,
        statements: 70,
      },
      clean: true,
      cleanOnRerun: true,
    },
    // Pool configuration para melhor performance
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: false,
      },
    },
  },
});
