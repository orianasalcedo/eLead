/**
 * Complete E2E Smoke Test Suite - Optimized
 * Single file containing all smoke tests for the eLeadPromo application
 * AMBIENTE: QA
 * URL: https://tienda1.qa.eleaddev.com
 * 
 * Optimized with helper functions to eliminate code duplication
 */

const { userJourneyActions } = require('../../actions/user-journey.actions')
const { authHelpers } = require('../../support/auth-helpers')
const { navbarHelpers } = require('../../support/navbar-helpers')
const { newFavoritesHelpers } = require('../../support/new-favorites-helpers')
const { lookingForMoreOptionsHelpers } = require('../../support/looking-for-more-options-helpers')
const { footerHelpers } = require('../../support/footer-helpers')

describe('Complete E2E Smoke Test Suite - Optimized', () => {
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

    it('should navigate through all navbar pages with H1 validation', () => {
      cy.log('🔍 Testing navbar navigation with H1 validation')

      // Load test data from fixture
      cy.fixture('test-user').then((testData) => {
        cy.log('📋 Test data loaded from fixture')
        
        // Ensure user is authenticated
        authHelpers.ensureAuthenticated(testData)
        
        // Test all navbar links with H1 validation
        navbarHelpers.testAllNavbarLinks()
        
        cy.log('✅ Navbar H1 validation complete')
        
        // Test the "New Favorites" section
        newFavoritesHelpers.testCompleteSection()
      })
    })

    it('should test clicking first product in New Favorites carousel', () => {
      cy.log('🔍 Testing click on first product in New Favorites carousel')

      // Load test data from fixture
      cy.fixture('test-user').then((testData) => {
        cy.log('📋 Test data loaded from fixture')
        
        // Ensure user is authenticated
        authHelpers.ensureAuthenticated(testData)
        
        // Click first product
        newFavoritesHelpers.clickFirstProduct()
        
        // Return to homepage
        authHelpers.returnToHomepage()
        
        cy.log('✅ Product click test complete')
      })
    })

    it('should test "Looking for more options?" section with clickable images', () => {
      cy.log('🔍 Testing "Looking for more options?" section with clickable images')

      // Load test data from fixture
      cy.fixture('test-user').then((testData) => {
        cy.log('📋 Test data loaded from fixture')
        
        // Ensure user is authenticated
        authHelpers.ensureAuthenticated(testData)
        
        // Test the complete "Looking for more options?" section
        lookingForMoreOptionsHelpers.testCompleteSection()
        
        cy.log('✅ "Looking for more options?" section test complete')
      })
    })

    it('should test footer functionality with configurable links', () => {
      cy.log('🔍 Testing footer functionality with configurable links')

      // Load test data from fixture
      cy.fixture('test-user').then((testData) => {
        cy.log('📋 Test data loaded from fixture')
        
        // Ensure homepage is loaded (no authentication required for footer)
        authHelpers.ensureHomepageLoaded()
        
        // Test the complete footer functionality
        footerHelpers.testCompleteFooter()
        
        cy.log('✅ Footer functionality test complete')
      })
    })
  })
})