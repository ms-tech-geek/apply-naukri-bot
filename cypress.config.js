const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Disable SSL verification
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          launchOptions.args.push('--ignore-certificate-errors');
          launchOptions.args.push(
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          );
        }
        return launchOptions;
      });
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
