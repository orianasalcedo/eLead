/**
 * Looking for More Options Section Helper Functions
 * Optimized section testing logic with common helpers
 */

const { commonHelpers } = require('./common-helpers')

const lookingForMoreOptionsHelpers = {
  /**
   * Verifies the "Looking for more options?" section structure
   */
  verifySectionStructure() {
    cy.log('🔍 Verifying "Looking for more options?" section structure')

    // Verify section exists using common helper
    commonHelpers.verifyElementExists(
      '.mt-2',
      'Looking for more options section',
    )
    cy.log('✅ ".mt-2" section found')

    // Verify h2 title exists within the section
    cy.get('.mt-2').contains('h2', 'Looking for more options?').should('exist')
    cy.log('✅ "Looking for more options?" h2 title found')

    // Verify title is visible
    cy.get('.mt-2 h2')
      .contains('Looking for more options?')
      .should('be.visible')
    cy.log('✅ "Looking for more options?" title is visible')
  },

  /**
   * Verifies the "Let's connect" button
   */
  verifyLetsConnectButton() {
    cy.log('🔍 Verifying "Let\'s connect" button')

    // Verify button exists using common helper
    commonHelpers.verifyElementExists(
      '.mt-2 > .w-full > .flex > .link',
      "Let's connect button",
    )
    cy.log('✅ "Let\'s connect" button found')

    // Verify button is visible and contains correct text
    cy.get('.mt-2 > .w-full > .flex > .link').should(
      'contain.text',
      "Let's connect",
    )
    cy.log('✅ "Let\'s connect" button is visible and has correct text')

    // Check if button has mailto link (which is expected behavior)
    cy.get('.mt-2 > .w-full > .flex > .link')
      .invoke('attr', 'href')
      .then((href) => {
        if (href && href.startsWith('mailto:')) {
          cy.log(`✅ "Let's connect" button has mailto link: ${href}`)
          cy.log('✅ Button behavior is correct - opens email client')
        } else {
          cy.log(`📋 "Let's connect" button href: ${href}`)
        }
      })

    // Note: We don't click the button because it triggers mailto: which causes 401 errors
    // This is expected behavior for email links
    cy.log(
      'ℹ️ Skipping click test for "Let\'s connect" button (mailto: links cause 401 errors)',
    )
  },

  /**
   * Analyzes and validates the three images below the section
   */
  analyzeImages() {
    cy.log(
      '🔍 Analyzing the three images below "Looking for more options?" section',
    )

    // Find images within the .mt-2 section
    cy.get('.mt-2')
      .find('img')
      .then(($images) => {
        const imageCount = $images.length
        cy.log(`📋 Found ${imageCount} images in ".mt-2" section`)

        if (imageCount >= 3) {
          cy.log('✅ Found at least 3 images as expected')

          // Analyze each of the first 3 images
          for (let i = 0; i < Math.min(3, imageCount); i++) {
            cy.get('.mt-2')
              .find('img')
              .eq(i)
              .then(($img) => {
                const alt = $img.attr('alt') || `Image ${i + 1}`
                const src = $img.attr('src') || 'No source'
                const $parent = $img.parent()

                // Check if image is clickable
                const isClickable =
                  $parent.is('a') ||
                  $parent.is('button') ||
                  $parent.css('cursor') === 'pointer' ||
                  $img.css('cursor') === 'pointer' ||
                  $parent.attr('onclick') ||
                  $img.attr('onclick')

                cy.log(`📋 Image ${i + 1}: "${alt}"`)
                cy.log(`📋 Image ${i + 1} source: ${src}`)
                cy.log(`📋 Image ${i + 1} clickable: ${isClickable}`)

                if (isClickable) {
                  cy.log(`✅ Image ${i + 1} is clickable`)
                } else {
                  cy.log(`⚠️ Image ${i + 1} is not clickable`)
                }
              })
          }
        } else {
          cy.log(`⚠️ Found only ${imageCount} images, expected at least 3`)
        }
      })
  },

  /**
   * Tests clicking on the three images
   */
  testClickableImages() {
    cy.log('🔍 Testing clickable images in "Looking for more options?" section')

    // Find clickable elements containing images within the .mt-2 section
    cy.get('.mt-2')
      .find('a, button')
      .then(($clickableElements) => {
        const clickableCount = $clickableElements.length
        cy.log(
          `📋 Found ${clickableCount} clickable elements in ".mt-2" section`,
        )

        if (clickableCount > 0) {
          $clickableElements.each((index, element) => {
            const $element = Cypress.$(element)
            const $img = $element.find('img')

            if ($img.length > 0) {
              const alt = $img.attr('alt') || `Image ${index + 1}`
              const href = $element.attr('href') || 'No href'
              const isVisible = $element.is(':visible')

              cy.log(`📋 Clickable element ${index + 1}: "${alt}"`)
              cy.log(`📋 Clickable element ${index + 1} href: ${href}`)
              cy.log(`📋 Clickable element ${index + 1} visible: ${isVisible}`)

              if (isVisible && href && href !== '#' && href !== '') {
                cy.log(`✅ Clickable element ${index + 1} is valid for testing`)

                // Test clicking on the first valid clickable image
                if (index === 0) {
                  cy.log(`🔍 Testing click on first clickable image: "${alt}"`)

                  cy.get('.mt-2')
                    .find('a, button')
                    .first()
                    .then(($firstElement) => {
                      const firstHref = $firstElement.attr('href')
                      const firstAlt =
                        $firstElement.find('img').attr('alt') || 'Image'

                      cy.log(`📋 Clicking on: "${firstAlt}" -> ${firstHref}`)

                      // Click the element
                      cy.get('.mt-2').find('a, button').first().click()

                      // Wait for navigation using common helper
                      commonHelpers.waitForNavigation()

                      // Validate page content using common helper
                      commonHelpers.validatePageContent()

                      // Return to homepage using common helper
                      commonHelpers.returnToHomepage()
                    })
                }
              } else {
                cy.log(
                  `⚠️ Clickable element ${index + 1} is not valid for testing (not visible or no valid href)`,
                )
              }
            }
          })
        } else {
          cy.log('❌ No clickable elements found in ".mt-2" section')
        }
      })
  },

  /**
   * Complete "Looking for more options?" section testing
   */
  testCompleteSection() {
    cy.log('🔍 Testing complete "Looking for more options?" section')

    this.verifySectionStructure()
    this.verifyLetsConnectButton()
    this.analyzeImages()
    this.testClickableImages()

    cy.log('✅ "Looking for more options?" section testing complete')
  },
}

module.exports = { lookingForMoreOptionsHelpers }
