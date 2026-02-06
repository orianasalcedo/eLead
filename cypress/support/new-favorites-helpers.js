/**
 * New Favorites Section Helper Functions
 * Optimized carousel testing logic with common helpers
 */

const { commonHelpers } = require('./common-helpers')

const newFavoritesHelpers = {
  /**
   * Verifies the New Favorites section structure
   */
  verifySectionStructure() {
    cy.log('🔍 Verifying New Favorites section structure')

    // Verify section exists and structure using common helpers
    commonHelpers.verifyElementExists('section', 'New Favorites section')
    cy.get('section').contains('h2', 'New Favorites').should('exist')
    cy.log('✅ "New Favorites" section found')

    // Verify section structure
    cy.get('section')
      .contains('h2', 'New Favorites')
      .parent()
      .should('have.class', 'relative')
    cy.log('✅ Section has correct CSS classes')

    // Verify title styling
    cy.get('section h2')
      .contains('New Favorites')
      .should('have.class', 'text-secondary')
    cy.log('✅ "New Favorites" title has correct styling')

    // Verify navigation arrows
    commonHelpers.verifyElementExists('section .custom-prev', 'Previous arrow')
    commonHelpers.verifyElementExists('section .custom-next', 'Next arrow')
    cy.log('✅ Navigation arrows found')

    // Verify swiper container
    commonHelpers.verifyElementExists('section .swiper', 'Swiper container')
    cy.log('✅ Swiper container found')

    // Verify swiper slides
    cy.get('section .swiper-slide').should('have.length.at.least', 1)
    cy.log('✅ Swiper slides found')
  },

  /**
   * Analyzes and logs product information
   */
  analyzeProducts() {
    cy.log('🔍 Analyzing products in New Favorites section')

    cy.get('section .swiper-slide').then(($slides) => {
      const slideCount = $slides.length
      cy.log(`📋 Found ${slideCount} product slides`)

      $slides.each((index, slide) => {
        const $slide = Cypress.$(slide)

        // Check for product link
        const productLink = $slide.find('a[href*="/shop/"]')
        if (productLink.length > 0) {
          const href = productLink.attr('href')
          cy.log(`📋 Product ${index + 1}: ${href}`)
        }

        // Check for product image
        const productImage = $slide.find('img')
        if (productImage.length > 0) {
          const alt = productImage.attr('alt')
          cy.log(`📋 Product ${index + 1} image: ${alt}`)
        }

        // Check for product title
        const productTitle = $slide.find('a.line-clamp-2')
        if (productTitle.length > 0) {
          const title = productTitle.text().trim()
          cy.log(`📋 Product ${index + 1} title: "${title}"`)
        }

        // Check for "New" badge
        const newBadge = $slide
          .find('span')
          .filter((i, el) => Cypress.$(el).text().trim() === 'New')
        if (newBadge.length > 0) {
          cy.log(`📋 Product ${index + 1}: Has "New" badge`)
        }
      })
    })
  },

  /**
   * Tests navigation arrows functionality
   */
  testNavigationArrows() {
    cy.log('🔍 Testing navigation arrows')

    // Test previous arrow
    cy.get('section .custom-prev').then(($prevArrow) => {
      if ($prevArrow.is(':visible')) {
        cy.log('📋 Previous arrow is visible, testing click')
        cy.get('section .custom-prev').click()
        // Wait for element to be ready instead of fixed wait
        commonHelpers.waitForElementReady('section .swiper-slide')
        cy.log('✅ Previous arrow clicked')
      } else {
        cy.log('⚠️ Previous arrow not visible (hidden on smaller screens)')
      }
    })

    // Test next arrow
    cy.get('section .custom-next').then(($nextArrow) => {
      if ($nextArrow.is(':visible')) {
        cy.log('📋 Next arrow is visible, testing click')
        cy.get('section .custom-next').click()
        // Wait for element to be ready instead of fixed wait
        commonHelpers.waitForElementReady('section .swiper-slide')
        cy.log('✅ Next arrow clicked')
      } else {
        cy.log('⚠️ Next arrow not visible (hidden on smaller screens)')
      }
    })
  },

  /**
   * Clicks on the first product in the carousel
   */
  clickFirstProduct() {
    cy.log('🔍 Testing click on first product in New Favorites carousel')

    // Find products within the New Favorites section
    cy.get('section')
      .contains('h2', 'New Favorites')
      .parent()
      .find('.swiper-slide')
      .then(($productSlides) => {
        const productSlideCount = $productSlides.length
        cy.log(
          `📋 Found ${productSlideCount} product slides in New Favorites section`,
        )

        if (productSlideCount > 0) {
          // Get the first product slide
          cy.get('section')
            .contains('h2', 'New Favorites')
            .parent()
            .find('.swiper-slide')
            .first()
            .then(($firstProductSlide) => {
              cy.log('📋 Found first product slide in New Favorites')

              // Look for product links in this slide
              const productLinks = $firstProductSlide.find('a[href*="/shop/"]')

              if (productLinks.length > 0) {
                const productHref = Cypress.$(productLinks[0]).attr('href')
                const productTitle =
                  $firstProductSlide.find('img').attr('alt') || 'Product'

                cy.log(
                  `📋 Found product link: "${productTitle}" - ${productHref}`,
                )

                // Click the product link
                cy.get('section')
                  .contains('h2', 'New Favorites')
                  .parent()
                  .find('.swiper-slide')
                  .first()
                  .find('a[href*="/shop/"]')
                  .first()
                  .click()

                // Wait for navigation using common helper
                commonHelpers.waitForNavigation()

                // Verify we're on a product page
                cy.contains('Product ID:', { timeout: 10000 })
                  .should('exist')
                  .then(($productIdElement) => {
                    const productIdText = $productIdElement.text().trim()
                    cy.log(
                      `✅ Successfully navigated to product detail page - Found: "${productIdText}"`,
                    )
                  })
              } else {
                cy.log(
                  '❌ No shop links found in first product slide - TEST FAILING',
                )
                throw new Error('No shop links found in New Favorites carousel')
              }
            })
        } else {
          cy.log(
            '❌ No product slides found in New Favorites section - TEST FAILING',
          )
          throw new Error('No product slides found in New Favorites section')
        }
      })
  },

  /**
   * Complete New Favorites section testing
   */
  testCompleteSection() {
    cy.log('🔍 Testing complete New Favorites section')

    // Set up network intercepts using common helper
    commonHelpers.setupNetworkIntercepts()

    this.verifySectionStructure()
    this.analyzeProducts()
    this.testNavigationArrows()

    cy.log('✅ "New Favorites" section testing complete')
  },
}

module.exports = { newFavoritesHelpers }
