const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://www.naukri.com',
    specPattern: 'cypress/e2e/**/*.js',
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' https://www.naukri.com",
    },
    retries: {
      runMode: 2,
      openMode: 1,
    },
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    defaultCommandTimeout: 60000, // Increase default timeout
    requestTimeout: 60000, // Increase request timeout
    responseTimeout: 60000, // Increase response timeout
    env: {
      NO_PROXY: 'www.naukri.com',
    },
  },
});
