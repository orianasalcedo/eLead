describe('Regression Tests', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
  })

  it('should complete full user journey', () => {
    // Register new user
    cy.visit('/register')
    cy.fillForm({
      'first-name': 'Jane',
      'last-name': 'Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      'confirm-password': 'password123',
    })
    cy.get('[data-cy="register-button"]').click()
    cy.get('[data-cy="success-message"]').should('be.visible')

    // Login with new user
    cy.login('jane.smith@example.com', 'password123')

    // Browse products
    cy.visit('/products')
    cy.get('[data-cy="product-item"]').should('have.length.greaterThan', 0)

    // Add product to cart
    cy.get('[data-cy="product-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="add-to-cart"]').click()
      })

    // Go to cart
    cy.get('[data-cy="cart-icon"]').click()
    cy.get('[data-cy="cart-items"]').should('be.visible')

    // Proceed to checkout
    cy.get('[data-cy="checkout-button"]').click()
    cy.url().should('include', '/checkout')

    // Fill checkout form
    cy.fillForm({
      'shipping-address': '123 Main St',
      city: 'New York',
      zip: '10001',
      'card-number': '4111111111111111',
      expiry: '12/25',
      cvv: '123',
    })

    // Complete purchase
    cy.get('[data-cy="place-order"]').click()
    cy.get('[data-cy="order-success"]').should('be.visible')
  })

  it('should handle responsive design', () => {
    // Test mobile viewport
    cy.mobileViewport()
    cy.visit('/')
    cy.get('[data-cy="mobile-menu"]').should('be.visible')

    // Test tablet viewport
    cy.tabletViewport()
    cy.visit('/')
    cy.get('[data-cy="navigation"]').should('be.visible')

    // Test desktop viewport
    cy.desktopViewport()
    cy.visit('/')
    cy.get('[data-cy="full-navigation"]').should('be.visible')
  })

  it('should handle error scenarios gracefully', () => {
    // Test 404 page
    cy.visit('/non-existent-page', { failOnStatusCode: false })
    cy.get('[data-cy="404-error"]').should('be.visible')

    // Test network error handling
    cy.intercept('GET', '/api/products', { forceNetworkError: true })
    cy.visit('/products')
    cy.get('[data-cy="error-message"]').should('be.visible')
  })
})
