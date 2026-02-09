import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.ts'],
    ignores: [
      'dist/**',
      'node_modules/**',
      '.eslintrc.js',
      'eslint.config.mjs',
      'cypress/**',
      '**/cypress/**',
      'vitest.config.ts',
      '**/*.spec.ts',
      '**/*.test.ts',
      'coverage/**',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      globals: {
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier: prettier,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      ...eslintConfigPrettier.rules,

      // ===== TypeScript Rules =====
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // Desabilitado - NestJS usa any em error handling e injeção de dependências
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ===== Regras de Segurança e Boas Práticas =====
      // Proíbe console.log em produção (use Logger do NestJS)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Enforça uso de const
      'prefer-const': 'error',

      // Proíbe var
      'no-var': 'error',

      // Exige === em vez de ==
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // Evita código morto
      'no-unreachable': 'error',
      'no-unused-expressions': 'warn',

      // ===== Regras específicas para NestJS =====
      // Permite injeção de dependências sem uso imediato
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',

      // Permite decorators
      '@typescript-eslint/no-inferrable-types': 'off',
    },
  },
];
