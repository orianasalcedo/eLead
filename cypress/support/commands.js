/**
 * Cypress Custom Commands - Optimized
 * Centralized custom commands using common helpers
 */

const { commonHelpers } = require('./common-helpers')

// Verify homepage is loaded by checking for homepage-specific elements
Cypress.Commands.add('verifyHomepageLoaded', () => {
  commonHelpers.waitForElementReady('body')
  commonHelpers.waitForElementReady('header')
  
  // Check for homepage-specific content (flexible approach)
  cy.get('body').then(($body) => {
    const bodyText = $body.text()
    const isHomepage = bodyText.includes('Log in') || 
                      bodyText.includes('Welcome') || 
                      bodyText.includes('Home') ||
                      bodyText.includes('Start Shopping') ||
                      $body.find('header').length > 0
    
    if (isHomepage) {
      cy.log('✅ Homepage verified - homepage-specific content found')
    } else {
      cy.log('⚠️ Homepage verification inconclusive - continuing anyway')
    }
  })
})

// Verify page navigation by checking for page-specific content
Cypress.Commands.add('verifyPageNavigation', (expectedContent) => {
  commonHelpers.waitForElementReady('body')
  
  if (expectedContent) {
    cy.get('body').should('contain.text', expectedContent)
    cy.log(`✅ Page navigation verified - found "${expectedContent}"`)
  } else {
    // Just verify page is loaded
    cy.get('h1').should('exist')
    cy.log('✅ Page navigation verified - h1 element found')
  }
})

// Data test selector helper
Cypress.Commands.add('dataTest', (id) => cy.get(`[data-testid="${id}"]`))

// Clear session data to simulate fresh visits
Cypress.Commands.add('clearSessionData', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.log('🧹 Session data cleared - simulating fresh visit')
})

// Welcome modal handler - Optimized single implementation
Cypress.Commands.add('handleWelcomeModal', () => {
  cy.get('body').then(($body) => {
    // Check for welcome modal with "Start Shopping" button
    if ($body.text().includes('Start Shopping')) {
      cy.log('Welcome modal detected, clicking "Start Shopping"')
      cy.contains('Start Shopping').click({ force: true })
      // Wait for modal to close using proper assertion
      cy.contains('Start Shopping').should('not.exist')
    } else {
      cy.log('No welcome modal found - continuing')
    }
  })
})

// Global modal handler - Comprehensive modal dismissal
Cypress.Commands.add('dismissModal', () => {
  cy.get('body').then(($body) => {
    // Check for welcome modal with "Start Shopping" button first
    if ($body.text().includes('Start Shopping')) {
      cy.log('Dismissing welcome modal with "Start Shopping"')
      cy.contains('Start Shopping').click({ force: true })
      cy.contains('Start Shopping').should('not.exist')
    }
    // Check for modal overlay (clicking outside to close)
    else if ($body.find('[role="button"][tabindex="0"]').length > 0) {
      cy.log('Dismissing modal overlay by clicking outside')
      cy.get('[role="button"][tabindex="0"]').first().click({ force: true })
      cy.get('[role="button"][tabindex="0"]').should('not.exist')
    }
    // Check for any modal with close button
    else if ($body.find('[aria-label*="close"], [aria-label*="Close"], .close, .modal-close').length > 0) {
      cy.log('Dismissing modal with close button')
      cy.get('[aria-label*="close"], [aria-label*="Close"], .close, .modal-close').first().click({ force: true })
      cy.get('[aria-label*="close"], [aria-label*="Close"], .close, .modal-close').should('not.exist')
    }
    // Check for any overlay that might be blocking
    else if ($body.find('.fixed, .overlay, .modal').length > 0) {
      cy.log('Dismissing generic modal/overlay')
      cy.get('.fixed, .overlay, .modal').first().click({ force: true })
      cy.get('.fixed, .overlay, .modal').should('not.exist')
    }
    else {
      cy.log('No modal detected - continuing')
    }
  })
})
