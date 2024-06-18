const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://www.naukri.com',
    specPattern: 'cypress/e2e/**/*.js',
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    headers: {
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' https://www.naukri.com",
    },
    env: {
      NO_PROXY: 'www.naukri.com',
    },
  },
});
