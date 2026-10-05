/**
 * Jest configuration. Every option: https://jestjs.io/docs/configuration
 * @type {import('jest').Config}
 */
const config = {
  testEnvironment: 'node',
  // Reset mock state between tests so one test's calls never leak into the next.
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
};

module.exports = config;
