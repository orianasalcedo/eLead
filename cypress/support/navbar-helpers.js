/**
 * Navbar Navigation Helper Functions
 * Optimized navbar testing logic with common helpers
 */

const { commonHelpers } = require('./common-helpers')

const navbarHelpers = {
  /**
   * Gets all valid navbar links excluding non-navigation elements
   * @returns {Array} Array of valid navbar selectors
   */
  getValidNavbarSelectors() {
    return [
      ':nth-child(1) > .mb-5',
      ':nth-child(2) > .mb-5',
      ':nth-child(3) > .mb-5',
      ':nth-child(4) > .mb-5',
      ':nth-child(5) > .mb-5',
      ':nth-child(6) > .mb-5',
      ':nth-child(7) > .mb-5',
      ':nth-child(8) > .mb-5',
    ]
  },

  /**
   * Tests navigation to a navbar link with H1 validation
   * @param {string} selector - CSS selector for the navbar element
   * @param {string} linkText - Text content of the element
   */
  testNavbarNavigation(selector, linkText) {
    cy.log(`🔍 Testing navigation: "${linkText}"`)

    // Set up network intercepts using common helper
    commonHelpers.setupNetworkIntercepts()

    // Click the element
    cy.get(selector).click()

    // Wait for navigation using common helper
    commonHelpers.waitForNavigation()

    // Validate H1 using common helper
    commonHelpers.validateH1Match(linkText)

    // Verify page navigation
    cy.verifyPageNavigation()
  },

  /**
   * Tests all valid navbar links
   */
  testAllNavbarLinks() {
    const selectors = this.getValidNavbarSelectors()

    selectors.forEach((selector, index) => {
      cy.log(`🔍 Testing selector ${index + 1}: ${selector}`)

      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .should('exist')
            .then(($element) => {
              const linkText = $element.text().trim()

              if (!commonHelpers.shouldSkipText(linkText)) {
                cy.log(`✅ Valid navbar link found: "${linkText}"`)
                this.testNavbarNavigation(selector, linkText)

                // Return to homepage using common helper
                commonHelpers.returnToHomepage()
              } else {
                cy.log(
                  `⚠️ Skipped element: "${linkText}" (not a navigation link)`,
                )
              }
            })
        } else {
          cy.log(`❌ Selector not found: ${selector}`)
        }
      })
    })
  },
}

module.exports = { navbarHelpers }
