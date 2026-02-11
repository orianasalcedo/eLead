const { defineConfig } = require('cypress')
require('dotenv').config()

// Get environment from process.env or default to 'qa'
const environment = process.env.CYPRESS_ENV || 'qa'

// Set baseUrl based on environment
let baseUrl
if (environment === 'qa') {
  baseUrl = process.env.BASE_URL || 'https://tienda1.qa.eleaddev.com'
} else if (environment === 'staging') {
  baseUrl = process.env.BASE_URL || 'https://usc.stg.eleaddev.com'
} else if (environment === 'production') {
  baseUrl = process.env.PRODUCTION_URL || 'https://example.com'
} else {
  baseUrl = process.env.BASE_URL || 'http://localhost:3000'
}

// eslint-disable-next-line no-console
console.log(`Using ${environment.toUpperCase()} Environment:`, baseUrl)

module.exports = defineConfig({
  e2e: {
    baseUrl, // Set baseUrl directly in config
    specPattern: 'cypress/e2e/**/*.{cy,spec}.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1440,
    viewportHeight: 900,
    video: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    testIsolation: false,
    chromeWebSecurity: false, // Allow Chrome to handle security
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on)

      // Location name / URL identifier per environment
      // QA: path /cleveland-hospital | STG: /shop?location=Keck%20Medicine%20of%20USC&location_key=KECK
      const envName = process.env.CYPRESS_ENV || 'qa'
      config.env.defaultLocationName =
        envName === 'staging' ? 'Keck Medicine of USC' : 'Cleveland Hospital'
      config.env.defaultLocationSlug =
        envName === 'staging' ? 'shop?location=Keck' : 'cleveland-hospital'

      // Xray Integration - Temporarily disabled due to plugin issues
      // const xrayPlugin = require('@csvtuda/cypress-xray-plugin')
      // xrayPlugin(on, config, {
      //   jira: {
      //     url: 'https://rootstrap.atlassian.net',
      //     username: 'oriana.salcedo@rootstrap.com',
      //     password: 'siemprecrecer',
      //     projectKey: 'ELP'
      //   },
      //   xray: {
      //     testExecutionKey: 'ELP-3785',
      //     testPlanKey: 'ELP-49',
      //     testEnvironment: 'QA'
      //   }
      // })

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
