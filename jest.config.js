// jest.config.js

module.exports = {
  globalSetup: '<rootDir>/scripts/jest-setup.js', 
  
  // Інші налаштування Jest
  testEnvironment: 'node',
  testMatch: ['**/test/integration/**/*.test.js'],
  verbose: true,
  clearMocks: true,
  forceExit: true,
};