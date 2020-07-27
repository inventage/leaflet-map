module.exports = {
  root: true,
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'],
  env: {
    browser: true,
  },
  rules: {
    'import/no-unresolved': 'off',
    'import/extensions': ['error', 'always', { ignorePackages: true }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/*.test.ts', '**/*.spec.ts'] }],
  },
  overrides: [
    {
      files: ['karma.conf.js', '.eslintrc.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
      plugins: ['@typescript-eslint'],
      rules: {
        'no-unexpected-multiline': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['test/**/*.test.ts'],
      rules: {
        'babel/no-unused-expressions': 'off',
      },
    },
  ],
};
