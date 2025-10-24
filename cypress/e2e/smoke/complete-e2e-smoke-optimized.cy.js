/**
 * Complete E2E Smoke Test Suite - Consolidated
 * Single file containing all smoke tests for the eLeadPromo application
 * AMBIENTE: QA
 * URL: https://tienda1.qa.eleaddev.com
 * 
 * Refactored to use Page Object Model and Actions for better maintainability
 */

const { userJourneyActions } = require('../../actions/user-journey.actions')

describe('Complete E2E Smoke Test Suite - Consolidated', () => {
  // Handle uncaught exceptions from React
  before(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Minified React error')) {
        return false
      }
      return true
    })
    // Clear session data only once at the beginning for clean start
    cy.clearSessionData()
  })

  describe('Store Frontend Authentication Flow', () => {
    it('should complete full user journey from homepage to authenticated store access', () => {
      cy.log('🚀 Starting complete user journey test')

      // Load test data from fixture
      cy.fixture('test-user').then((testData) => {
        cy.log('📋 Test data loaded from fixture')
        
        // Execute complete user journey using actions
        userJourneyActions.completeUserJourney(testData)
        
        cy.log('✅ Complete user journey successful!')
        cy.log('✅ User authenticated and redirected to homepage')
        cy.log('✅ Homepage content rendering verified')
        cy.log('✅ Ready to continue with store navigation and shopping flow')
      })
    })
  })
})