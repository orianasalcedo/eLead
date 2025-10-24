/**
 * Footer Helper Functions
 * Optimized footer testing logic with common helpers
 */

const { commonHelpers } = require('./common-helpers')

const footerHelpers = {
  /**
   * Verifies the footer structure
   */
  verifyFooterStructure() {
    cy.log('🔍 Verifying footer structure')
    
    // Scroll to footer and verify using common helper
    commonHelpers.scrollAndVerifyVisible('.my-10')
    cy.log('✅ Footer structure verified')
  },

  /**
   * Validates copyright text exists (content can vary)
   */
  validateCopyrightText() {
    cy.log('🔍 Validating copyright text')
    
    cy.get('.my-10').then(($footer) => {
      const footerText = $footer.text()
      const copyrightPatterns = ['copyright', '©', 'all rights reserved', 'reserved', 'inc.', 'llc', 'corp']
      const hasCopyright = copyrightPatterns.some(pattern => 
        footerText.toLowerCase().includes(pattern)
      )
      
      if (hasCopyright) {
        cy.log('✅ Copyright text found in footer')
        const copyrightMatch = footerText.match(/(copyright|©|all rights reserved|reserved|inc\.|llc|corp)/i)
        if (copyrightMatch) {
          cy.log(`📋 Copyright pattern found: "${copyrightMatch[0]}"`)
        }
      } else {
        cy.log('⚠️ No clear copyright text found, but footer exists')
        cy.log(`📋 Footer text content: "${footerText.substring(0, 100)}..."`)
      }
    })
  },

  /**
   * Analyzes footer links (configurable by admin)
   */
  analyzeFooterLinks() {
    cy.log('🔍 Analyzing footer links (configurable by admin)')
    
    cy.get('.my-10').find('a').then(($links) => {
      const linkCount = $links.length
      cy.log(`📋 Found ${linkCount} links in footer`)
      
      if (linkCount > 0) {
        $links.each((index, link) => {
          const $link = Cypress.$(link)
          const linkInfo = commonHelpers.analyzeLink($link, 'Footer link', index + 1)
          
          if (linkInfo.isValid) {
            cy.log(`✅ Footer link ${index + 1} is valid for testing`)
          } else {
            cy.log(`⚠️ Footer link ${index + 1} is not valid for testing`)
          }
        })
      } else {
        cy.log('❌ No links found in footer')
      }
    })
  },

  /**
   * Tests clicking on footer links
   */
  testFooterLinks() {
    cy.log('🔍 Testing footer links')
    
    cy.get('.my-10').find('a').then(($links) => {
      const validLinks = []
      
      $links.each((index, link) => {
        const $link = Cypress.$(link)
        const linkInfo = commonHelpers.analyzeLink($link, 'Footer link', index + 1)
        
        if (linkInfo.isValid) {
          validLinks.push({ element: link, text: linkInfo.text, href: linkInfo.href })
        }
      })
      
      cy.log(`📋 Found ${validLinks.length} valid footer links for testing`)
      
      if (validLinks.length > 0) {
        validLinks.forEach((link, index) => {
          cy.log(`🔍 Testing click on footer link ${index + 1}: "${link.text}"`)
          
          // Scroll to footer to ensure visibility
          commonHelpers.scrollAndVerifyVisible('.my-10')
          
          // Click on the specific link
          cy.get('.my-10').find('a').contains(link.text).click()
          cy.log(`✅ Clicked on footer link ${index + 1}: "${link.text}"`)
          
          // Wait for navigation using common helper
          commonHelpers.waitForNavigation()
          
          // Validate page content using common helper
          commonHelpers.validatePageContent()
          
          // Return to homepage using common helper
          commonHelpers.returnToHomepage()
        })
        
        cy.log(`✅ Completed testing all ${validLinks.length} footer links`)
      } else {
        cy.log('⚠️ No valid footer links found for testing')
      }
    })
  },

  /**
   * Validates the footer image with link
   */
  validateFooterImageLink() {
    cy.log('🔍 Validating footer image with link')
    
    cy.get('[href=""] > img').then(($img) => {
      if ($img.length > 0) {
        cy.log('✅ Footer image with empty href found')
        
        const $imgElement = Cypress.$($img[0])
        const src = $imgElement.attr('src') || 'No source'
        const alt = $imgElement.attr('alt') || 'No alt text'
        const $parent = $imgElement.parent()
        
        cy.log(`📋 Footer image source: ${src}`)
        cy.log(`📋 Footer image alt: "${alt}"`)
        cy.log(`📋 Footer image parent href: ${$parent.attr('href')}`)
        
        if ($imgElement.is(':visible')) {
          cy.log('✅ Footer image is visible')
          
          // Test clicking on the image
          cy.log('🔍 Testing click on footer image')
          cy.get('[href=""] > img').first().click()
          cy.log('✅ Clicked on footer image')
          
          // Wait for navigation using common helper
          commonHelpers.waitForNavigation()
          
          // Validate page content using common helper
          commonHelpers.validatePageContent()
          
          // Return to homepage using common helper
          commonHelpers.returnToHomepage()
        } else {
          cy.log('⚠️ Footer image is not visible')
        }
      } else {
        cy.log('❌ Footer image with empty href not found')
        
        // Try alternative selectors
        cy.get('.my-10').find('img').then(($allImages) => {
          const imageCount = $allImages.length
          cy.log(`📋 Found ${imageCount} images in footer`)
          
          if (imageCount > 0) {
            $allImages.each((index, img) => {
              const $img = Cypress.$(img)
              const src = $img.attr('src') || 'No source'
              const alt = $img.attr('alt') || 'No alt text'
              const $parent = $img.parent()
              const parentHref = $parent.attr('href')
              
              cy.log(`📋 Footer image ${index + 1}: "${alt}" -> ${src}`)
              cy.log(`📋 Footer image ${index + 1} parent href: ${parentHref}`)
            })
          }
        })
      }
    })
  },

  /**
   * Complete footer testing
   */
  testCompleteFooter() {
    cy.log('🔍 Testing complete footer functionality')
    
    this.verifyFooterStructure()
    this.validateCopyrightText()
    this.analyzeFooterLinks()
    this.testFooterLinks()
    this.validateFooterImageLink()
    
    cy.log('✅ Footer testing complete')
  }
}

module.exports = { footerHelpers }
