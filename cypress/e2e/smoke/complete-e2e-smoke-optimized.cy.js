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
  // Handle uncaught exceptions from React and expected auth/network errors
  before(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Minified React error')) {
        return false
      }
      if (err.message.includes('Request failed with status code 401')) {
        return false
      }
      if (err.message.includes('status code 401')) {
        return false
      }
      return true
    })
    // Clear session data only once at the beginning for clean start
    cy.clearSessionData()
  })

  describe('Store Frontend Authentication Flow', () => {
    it('should complete sign up, validate user name in header, log out, then login with invalid and valid user', () => {
      cy.log('🚀 Sign-up → validate name → log out → login (invalid + valid)')

      userJourneyActions.signUpFromHomepage({ password: 'Testing2!' })

      cy.log('✅ Sign-up successful - validating registered user name top right')
      userJourneyActions.validateRegisteredUserAndLogout('Test User')

      cy.log('📋 Proceeding with login flow: invalid then valid user')
      cy.fixture('test-user').then((testData) => {
        userJourneyActions.completeUserJourney(testData)
      })

      cy.log('✅ Full auth flow complete: sign up, logout, invalid login, valid login')
    })

    it('should complete full user journey from homepage to authenticated store access', () => {
      cy.log('🚀 Starting complete user journey test')

      cy.fixture('test-user').then((testData) => {
        cy.log('📋 Test data loaded from fixture')
        userJourneyActions.completeUserJourney(testData)
        cy.log('✅ Complete user journey successful!')
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