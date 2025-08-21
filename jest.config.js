export default {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/data.js',
    '!**/node_modules/**'
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true
};