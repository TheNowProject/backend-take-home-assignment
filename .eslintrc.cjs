const path = require('path')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: path.join(__dirname, 'tsconfig.json'),
  },
  plugins: [
    '@typescript-eslint', //
    'prettier',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended', //
    'next',
    'prettier',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'no-console': 'error',
    'no-unreachable': 'error',
    'curly': 'error',
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],
    'import/order': [
      'error',
      {
        'groups': [
          'type',
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'object',
        ],
        'pathGroups': [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
        'pathGroupsExcludedImportTypes': ['type'],
        'newlines-between': 'always',
      },
    ],
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: [
        '**/pages/**/*.*',
        'next.config.mjs',
        'vitest.config.ts',
        'tailwind.config.ts',
      ],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
