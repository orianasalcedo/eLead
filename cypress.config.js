const { defineConfig } = require('cypress')
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    testIsolation: true,
    setupNodeEvents(on, config) {
      const envName = config.env.environment
      if (envName === 'qa') {
        config.baseUrl =
          process.env.BASE_URL || 'https://tienda1.qa.eleaddev.com'
        // eslint-disable-next-line no-console
        console.log('Using QA Environment:', config.baseUrl)
      } else if (envName === 'staging') {
        config.baseUrl = process.env.BASE_URL || 'https://aya.stg.eleaddev.com'
        // eslint-disable-next-line no-console
        console.log('Using STG Environment:', config.baseUrl)
      } else if (envName === 'production') {
        config.baseUrl = process.env.PRODUCTION_URL || 'https://example.com'
        // eslint-disable-next-line no-console
        console.log('Using PROD Environment:', config.baseUrl)
      } else {
        config.baseUrl = process.env.BASE_URL || 'http://localhost:3000'
        // eslint-disable-next-line no-console
        console.log('Using LOCAL Environment:', config.baseUrl)
      }
      require('cypress-mochawesome-reporter/plugin')(on)
      return config
    },
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'reports',
    charts: true,
    overwrite: false,
    html: true,
    json: true,
  },
})
