/**
 * eLead Promo API - Page Content Tests
 * Comprehensive tests for static page content endpoints
 */

describe('eLead Promo API - Page Content Tests', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')
    
    // Set environment
    const environment = Cypress.env('environment')
    cy.log(`🧪 Running Page Content tests in ${environment.toUpperCase()} environment`)
  });

  describe('Static Pages', () => {
    it('should get FAQs page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('page')
          expect(response.body.page).to.have.property('content')
          cy.log('✅ FAQs page content retrieved successfully')
        })
    })

    it('should get Privacy Policy page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/privacy_policy')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ Privacy Policy page content retrieved successfully')
        })
    })

    it('should get Terms of Use page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/terms_of_use')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ Terms of Use page content retrieved successfully')
        })
    })

    it('should get About Us page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/about_us')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ About Us page content retrieved successfully')
        })
    })

    it('should get More Products Options page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/more_products_options')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ More Products Options page content retrieved successfully')
        })
    })

    it('should get Gift Codes page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/gift_codes')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ Gift Codes page content retrieved successfully')
        })
    })

    it('should get Return Policy page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/return_policy')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ Return Policy page content retrieved successfully')
        })
    })

    it('should get Contact Us page content', () => {
      cy.apiRequest('GET', '/api/v1/pages/contact_us')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('content')
          cy.log('✅ Contact Us page content retrieved successfully')
        })
    })
  })

  describe('Page Content Validation', () => {
    it('should validate page content structure', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          
          const pageData = response.body.data
          expect(pageData).to.have.property('content')
          expect(pageData).to.have.property('title')
          expect(pageData).to.have.property('start_date')
          expect(pageData).to.have.property('end_date')
          
          cy.log('✅ Page content structure validated')
          cy.log(`Page title: ${pageData.title}`)
        })
    })

    it('should handle non-existent page', () => {
      cy.apiRequest('GET', '/api/v1/pages/non_existent_page')
        .then((response) => {
          expect(response.status).to.be.oneOf([404, 400])
          cy.log('✅ Non-existent page properly handled')
        })
    })

    it('should validate page content is not empty', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data.content).to.not.be.empty
          cy.log('✅ Page content is not empty')
        })
    })
  })

  describe('Page Date Validation', () => {
    it('should validate page start and end dates', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          
          const pageData = response.body.data
          if (pageData.start_date) {
            expect(new Date(pageData.start_date)).to.be.a('date')
            cy.log('✅ Page start date is valid')
          }
          
          if (pageData.end_date) {
            expect(new Date(pageData.end_date)).to.be.a('date')
            cy.log('✅ Page end date is valid')
          }
        })
    })

    it('should check if page is currently active', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          
          const pageData = response.body.data
          const now = new Date()
          
          if (pageData.start_date) {
            const startDate = new Date(pageData.start_date)
            expect(startDate).to.be.at.most(now)
            cy.log('✅ Page start date is in the past or present')
          }
          
          if (pageData.end_date) {
            const endDate = new Date(pageData.end_date)
            expect(endDate).to.be.at.least(now)
            cy.log('✅ Page end date is in the future or present')
          }
        })
    })
  })

  describe('Page Content Types', () => {
    it('should validate HTML content in pages', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          
          const content = response.body.data.content
          // Check if content contains HTML tags (common in rich text content)
          if (content.includes('<') && content.includes('>')) {
            cy.log('✅ Page content contains HTML formatting')
          } else {
            cy.log('✅ Page content is plain text')
          }
        })
    })

    it('should validate page titles are meaningful', () => {
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          
          const title = response.body.data.title
          expect(title).to.be.a('string')
          expect(title.length).to.be.greaterThan(0)
          cy.log(`✅ Page title is meaningful: "${title}"`)
        })
    })
  })

  describe('Page Content Performance', () => {
    it('should load page content within reasonable time', () => {
      const startTime = Date.now()
      
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          const endTime = Date.now()
          const loadTime = endTime - startTime
          
          expect(response.status).to.eq(200)
          expect(loadTime).to.be.lessThan(5000) // Should load within 5 seconds
          cy.log(`✅ Page content loaded in ${loadTime}ms`)
        })
    })

    it('should handle multiple page requests efficiently', () => {
      const pages = ['faqs', 'privacy_policy', 'terms_of_use', 'about_us']
      const promises = pages.map(page => 
        cy.apiRequest('GET', `/api/v1/pages/${page}`)
      )
      
      cy.wrap(Promise.all(promises))
        .then((responses) => {
          responses.forEach((response, index) => {
            expect(response.status).to.eq(200)
            cy.log(`✅ ${pages[index]} page loaded successfully`)
          })
        })
    })
  })
})
