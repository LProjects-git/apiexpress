module.exports = {
  testEnvironment: 'node',
  testMatch: ['**api/**/integration-tests/**/*integration.test.js'], 
  verbose: true,
  setupFiles: ['dotenv/config'],
};