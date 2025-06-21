/** @type {import('jest').Config} */
const config = {
  transform: {
    // '\\.mjs$': 'babel-jest',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.mjs',
  ],
  testEnvironment: 'node',
};

export default config;
