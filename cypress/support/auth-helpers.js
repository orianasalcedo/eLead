/**
 * Authentication Helper Functions
 * Optimized authentication logic with common helpers
 */

const { HomePage } = require('../pages/HomePage')
const { LoginPage } = require('../pages/LoginPage')
const { commonHelpers } = require('./common-helpers')

const authHelpers = {
  /**
   * Ensures user is authenticated before proceeding with tests
   * @param {Object} testData - Test data from fixture
   * @returns {Promise} - Resolves when authentication is complete
   */
  ensureAuthenticated(testData) {
    cy.log('🔐 Ensuring user authentication')

    const homepage = new HomePage()

    // Visit homepage and handle initial setup
    homepage.visit()
    homepage.handleWelcomeModal()
    homepage.verifyPageLoaded()

    // Check authentication status
    cy.get('body').then(($body) => {
      if ($body.text().includes('Log in')) {
        cy.log('🔐 User not authenticated, proceeding with login flow')
        this.performLogin(testData)
      } else {
        cy.log('✅ User already authenticated')
      }
    })

    // Wait for page to be ready using common helper
    commonHelpers.waitForElementReady('body')
    commonHelpers.waitForElementReady('header')
  },

  /**
   * Ensures homepage is loaded without requiring authentication
   * @returns {Promise} - Resolves when homepage is ready
   */
  ensureHomepageLoaded() {
    cy.log('🏠 Ensuring homepage is loaded')

    const homepage = new HomePage()

    // Visit homepage and handle initial setup
    homepage.visit()
    homepage.handleWelcomeModal()
    homepage.verifyPageLoaded()

    // Wait for page to be ready using common helper
    commonHelpers.waitForElementReady('body')
    commonHelpers.waitForElementReady('header')

    cy.log('✅ Homepage loaded and ready')
  },

  /**
   * Performs login flow
   * @param {Object} testData - Test data from fixture
   */
  performLogin(testData) {
    const homepage = new HomePage()
    const loginPage = new LoginPage()

    homepage.clickLoginLink()
    cy.url().should('include', '/login')
    loginPage.clickLogInTab()

    loginPage.fillLoginForm(testData.testUser.email, testData.testUser.password)
    loginPage.submitForm()

    cy.url().should('include', Cypress.config('baseUrl'))
    cy.url().should('not.include', '/login')
    cy.log('✅ Authentication successful')
  },

  /**
   * Navigates back to homepage after testing
   */
  returnToHomepage() {
    commonHelpers.returnToHomepage()
  },
}

module.exports = { authHelpers }
