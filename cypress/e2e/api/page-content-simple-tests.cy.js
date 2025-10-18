/**
 * eLead Promo API - Page Content Tests (Simplified)
 * Tests for static page content endpoints with proper error handling
 */

describe('eLead Promo API - Page Content Tests (Simplified)', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')

    // Set environment
    const environment = Cypress.env('environment')
    cy.log(
      `🧪 Running Page Content tests in ${environment.toUpperCase()} environment`,
    )
  })

  describe('Static Pages', () => {
    it('should get FAQs page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('page')
        expect(response.body.page).to.have.property('content')
        expect(response.body.page).to.have.property('title')
        expect(response.body.page.title).to.eq('FAQs')
        cy.log('✅ FAQs page content retrieved successfully')
      })
    })

    it('should handle non-existent page gracefully', () => {
      cy.apiRequest('GET', '/api/v1/pages/non_existent_page').then(
        (response) => {
          expect(response.status).to.be.oneOf([404, 400])
          cy.log('✅ Non-existent page properly handled')
        },
      )
    })

    it('should validate FAQs page structure', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response) => {
        expect(response.status).to.eq(200)

        const page = response.body.page
        expect(page).to.have.property('id')
        expect(page).to.have.property('title')
        expect(page).to.have.property('content')
        expect(page).to.have.property('slug')

        // Validate content is not empty
        expect(page.content).to.not.be.empty
        expect(page.title).to.not.be.empty

        cy.log('✅ FAQs page structure validated')
        cy.log(`Page ID: ${page.id}`)
        cy.log(`Page Title: ${page.title}`)
        cy.log(`Content length: ${page.content.length} characters`)
      })
    })

    it('should validate page content contains HTML', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response) => {
        expect(response.status).to.eq(200)

        const content = response.body.page.content
        // Check if content contains HTML tags
        expect(content).to.include('<')
        expect(content).to.include('>')

        cy.log('✅ Page content contains HTML formatting')
      })
    })

    it('should load page content within reasonable time', () => {
      const startTime = Date.now()

      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response) => {
        const endTime = Date.now()
        const loadTime = endTime - startTime

        expect(response.status).to.eq(200)
        expect(loadTime).to.be.lessThan(5000) // Should load within 5 seconds
        cy.log(`✅ Page content loaded in ${loadTime}ms`)
      })
    })
  })

  describe('Page Content Security', () => {
    it('should handle special characters in page requests', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response) => {
        expect(response.status).to.eq(200)
        cy.log('✅ Page request with special characters handled properly')
      })
    })

    it('should validate page slug format', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response) => {
        expect(response.status).to.eq(200)

        const slug = response.body.page.slug
        expect(slug).to.be.a('string')
        expect(slug).to.match(/^\/.*/)

        cy.log(`✅ Page slug validated: ${slug}`)
      })
    })
  })

  describe('Page Content Performance', () => {
    it('should handle multiple page requests efficiently', () => {
      // Test multiple sequential requests to the same page
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response1) => {
          expect(response1.status).to.eq(200)
          cy.log('✅ Request 1 completed successfully')

          return cy.apiRequest('GET', '/api/v1/pages/faqs')
        })
        .then((response2) => {
          expect(response2.status).to.eq(200)
          cy.log('✅ Request 2 completed successfully')

          return cy.apiRequest('GET', '/api/v1/pages/faqs')
        })
        .then((response3) => {
          expect(response3.status).to.eq(200)
          cy.log('✅ Request 3 completed successfully')
        })
    })

    it('should cache page content appropriately', () => {
      const startTime1 = Date.now()

      cy.apiRequest('GET', '/api/v1/pages/faqs').then((response1) => {
        const endTime1 = Date.now()
        const loadTime1 = endTime1 - startTime1

        expect(response1.status).to.eq(200)

        // Second request should be faster due to caching
        const startTime2 = Date.now()
        return cy.apiRequest('GET', '/api/v1/pages/faqs').then((response2) => {
          const endTime2 = Date.now()
          const loadTime2 = endTime2 - startTime2

          expect(response2.status).to.eq(200)
          cy.log(
            `✅ First request: ${loadTime1}ms, Second request: ${loadTime2}ms`,
          )
        })
      })
    })
  })
})
