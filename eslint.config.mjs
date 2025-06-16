import { configs } from 'eslint-config-blazex';

export default [
  {
    ...configs.node,
    rules: {
      ...configs.node.rules,
      'unicorn/prefer-module': 'off',
      'n/no-unpublished-require': ['error', {
        allowModules: ['@faker-js/faker', 'supertest', 'mongodb-memory-server', 'eslint-config-blazex'],
      }],
    },
  },
  {
    ignores: ['coverage', 'dist', 'node_modules'],
  },
];
