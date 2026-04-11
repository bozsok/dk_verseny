module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  globals: {
    __DEV__: 'readonly',
    __PROD__: 'readonly',
    __VERSION__: 'readonly',
    __BUILD_TIME__: 'readonly',
    __BUILD_ENV__: 'readonly'
  },
  extends: [
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/'
  ]
};