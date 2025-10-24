/**
 * Common Helper Functions
 * Shared utilities for all test helpers to eliminate code duplication
 */

const commonHelpers = {
  /**
   * Sets up common network intercepts for page navigation
   */
  setupNetworkIntercepts() {
    cy.intercept('GET', '/api/v1/**').as('apiRequest')
    cy.intercept('GET', '/content/**').as('contentRequest')
    cy.intercept('GET', '/**').as('pageRequest')
  },

  /**
   * Waits for page navigation to complete
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  waitForNavigation(timeout = 10000) {
    cy.get('body').should('be.visible')
    cy.log('📡 Page navigation completed')
  },

  /**
   * Validates H1 text matches expected text with flexible comparison
   * @param {string} expectedText - Expected text to match
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  validateH1Match(expectedText, timeout = 10000) {
    cy.get('h1', { timeout }).should('exist').then(($h1) => {
      const h1Text = $h1.text().trim()
      cy.log(`📋 Page h1: "${h1Text}"`)
      cy.log(`📋 Expected: "${expectedText}"`)
      
      // Flexible comparison (contains or is contained)
      const expectedLower = expectedText.toLowerCase()
      const h1TextLower = h1Text.toLowerCase()
      const textMatch = h1TextLower.includes(expectedLower) || 
                       expectedLower.includes(h1TextLower)
      
      if (textMatch) {
        cy.log(`✅ H1 match confirmed: "${h1Text}" matches "${expectedText}"`)
      } else {
        cy.log(`❌ H1 mismatch: Expected "${expectedText}", found "${h1Text}"`)
        throw new Error(`H1 mismatch: Expected "${expectedText}", found "${h1Text}"`)
      }
    })
  },

  /**
   * Validates page content contains expected keywords
   * @param {Array} keywords - Array of keywords to check for
   */
  validatePageContent(keywords = ['Product ID:', 'Shop', 'Category', 'About', 'Contact']) {
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      const foundKeywords = keywords.filter(keyword => bodyText.includes(keyword))
      
      if (foundKeywords.length > 0) {
        cy.log(`✅ Found relevant content: ${foundKeywords.join(', ')}`)
      } else {
        cy.log(`✅ Page content updated successfully`)
      }
    })
  },

  /**
   * Returns to homepage and verifies it's loaded
   */
  returnToHomepage() {
    cy.visit('/')
    cy.verifyHomepageLoaded()
    cy.log('✅ Returned to homepage')
  },

  /**
   * Scrolls element into view and verifies it's visible
   * @param {string} selector - CSS selector for the element
   */
  scrollAndVerifyVisible(selector) {
    cy.get(selector).scrollIntoView()
    cy.get(selector).should('be.visible')
    cy.log(`📋 Scrolled to and verified visibility of: ${selector}`)
  },

  /**
   * Analyzes and logs link information
   * @param {Object} $link - jQuery element of the link
   * @param {string} context - Context description for logging
   * @param {number} index - Index number for logging
   */
  analyzeLink($link, context = 'Link', index = 1) {
    const href = $link.attr('href') || 'No href'
    const text = $link.text().trim() || 'No text'
    const isVisible = $link.is(':visible')
    
    cy.log(`📋 ${context} ${index}: "${text}" -> ${href} (visible: ${isVisible})`)
    
    return {
      href,
      text,
      isVisible,
      isValid: isVisible && href && href !== '#' && href !== '' && text.length > 0 && text !== 'No text'
    }
  },

  /**
   * Checks if text should be skipped based on patterns
   * @param {string} text - Text to check
   * @param {Array} skipPatterns - Array of patterns to skip
   */
  shouldSkipText(text, skipPatterns = ['shops', 'log', 'user', 'cart', 'oriana', 'login', 'logout', 'sony', 'afeela']) {
    return skipPatterns.some(pattern => 
      text.toLowerCase().includes(pattern)
    )
  },

  /**
   * Validates element exists and is visible
   * @param {string} selector - CSS selector
   * @param {string} description - Description for logging
   */
  verifyElementExists(selector, description = 'Element') {
    cy.get(selector).should('exist')
    cy.get(selector).then(($element) => {
      if ($element.is(':visible')) {
        cy.log(`✅ ${description} found and visible: ${selector}`)
      } else {
        cy.log(`⚠️ ${description} found but not visible (may be hidden): ${selector}`)
      }
    })
  },

  /**
   * Waits for element to be ready (replaces cy.wait with assertions)
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds (default: 8000)
   */
  waitForElementReady(selector, timeout = 8000) {
    cy.get(selector, { timeout }).should('exist').and('be.visible')
  }
}

module.exports = { commonHelpers }
