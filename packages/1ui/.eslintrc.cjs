module.exports = {
  extends: ['../../.eslintrc.base.cjs'],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['storybook-static/**/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            varsIgnorePattern: '^React$',
          },
        ],
      },
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        '@nx/dependency-checks': [
          'error',
          {
            checkObsoleteDependencies: false,
          },
        ],
      },
    },
  ],
}
