module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:prettier/recommended', 'prettier', 'eslint:recommended'],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'no-var': 'error',
    semi: 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-multi-spaces': 0,
    'space-in-parens': 0,
    'no-multiple-empty-lines': 0,
    'prefer-const': 0,
    'no-unused-vars': 0,
  },
};
