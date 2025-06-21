import { configs } from 'eslint-config-blazex';

export default [
  {
    ...configs.node,
    rules: {
      ...configs.node.rules,
      'n/no-unpublished-import': ['error', {
        allowModules: ['@faker-js/faker', 'supertest', 'mongodb-memory-server', 'eslint-config-blazex'],
      }],
    },
  },
  {
    ignores: ['coverage', 'dist', 'node_modules'],
  },
];
