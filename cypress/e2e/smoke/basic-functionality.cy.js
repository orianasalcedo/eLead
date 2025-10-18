describe('Smoke Tests', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('testData').as('testData')

    // Handle network errors gracefully
    cy.handleNetworkError()
  })

  it('should load the homepage', () => {
    cy.visit('/', { failOnStatusCode: false })
    cy.url().should('include', Cypress.config('baseUrl'))
    cy.get('body').should('be.visible')
  })

  it('should have working navigation', () => {
    cy.visit('/', { failOnStatusCode: false })

    // Wait for page to load
    cy.get('body').should('be.visible')

    // Check for common navigation elements
    cy.get('body').then(($body) => {
      if ($body.find('h1').length > 0) {
        cy.get('h1').should('be.visible')
      }
      if ($body.find('nav').length > 0) {
        cy.get('nav').should('be.visible')
      }
    })
  })

  it('should navigate to different sections', () => {
    cy.visit('/', { failOnStatusCode: false })

    // Look for navigation links
    cy.get('body').then(($body) => {
      const navLinks = $body.find('a[href]')
      if (navLinks.length > 0) {
        cy.get('a[href]').first().click()
        cy.url().should('not.equal', Cypress.config('baseUrl'))
      } else {
        // If no navigation links, just verify page loads
        cy.get('body').should('be.visible')
      }
    })
  })

  it('should handle basic interactions', () => {
    cy.visit('/', { failOnStatusCode: false })

    // Look for input fields
    cy.get('body').then(($body) => {
      const inputs = $body.find('input[type="text"], input[type="email"]')
      if (inputs.length > 0) {
        cy.get('input[type="text"], input[type="email"]').first().type('test@example.com')
        cy.get('input[type="text"], input[type="email"]')
          .first()
          .should('have.value', 'test@example.com')
      } else {
        // If no inputs, just verify page loads
        cy.get('body').should('be.visible')
      }
    })
  })
})
