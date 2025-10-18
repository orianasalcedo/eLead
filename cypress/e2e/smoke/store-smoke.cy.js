// Smoke Tests for eLead Promo Client Store
describe('Client Store Smoke Tests', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
    cy.handleNetworkError()
  })

  it('should load client store homepage', () => {
    cy.xrayTestCase('STORE-001')
    
    cy.xrayStep('Navigate to client store homepage')
    cy.visit('/')
    
    cy.xrayStep('Verify homepage elements are visible')
    cy.get('[data-testid="store-header"]').should('be.visible')
    cy.get('[data-testid="product-catalog"]').should('be.visible')
    
    cy.xrayPass('STORE-001')
  })

  it('should display product catalog', () => {
    cy.xrayTestCase('STORE-002')
    
    cy.xrayStep('Navigate to product catalog')
    cy.visit('/products')
    
    cy.xrayStep('Verify product catalog is loaded')
    cy.get('[data-testid="product-list"]').should('be.visible')
    cy.get('[data-testid="product-item"]').should('have.length.at.least', 1)
    
    cy.xrayPass('STORE-002')
  })

  it('should access product detail page', () => {
    cy.xrayTestCase('STORE-003')
    
    cy.xrayStep('Navigate to product catalog')
    cy.visit('/products')
    
    cy.xrayStep('Click on first product')
    cy.get('[data-testid="product-item"]').first().click()
    
    cy.xrayStep('Verify product detail page is loaded')
    cy.get('[data-testid="product-details"]').should('be.visible')
    cy.get('[data-testid="product-image"]').should('be.visible')
    cy.get('[data-testid="add-to-cart"]').should('be.visible')
    
    cy.xrayPass('STORE-003')
  })

  it('should access shopping cart', () => {
    cy.xrayTestCase('STORE-004')
    
    cy.xrayStep('Navigate to shopping cart')
    cy.visit('/cart')
    
    cy.xrayStep('Verify cart page is loaded')
    cy.get('[data-testid="cart-container"]').should('be.visible')
    
    cy.xrayPass('STORE-004')
  })

  it('should access checkout process', () => {
    cy.xrayTestCase('STORE-005')
    
    cy.xrayStep('Add product to cart')
    cy.visit('/products')
    cy.get('[data-testid="product-item"]').first().click()
    cy.get('[data-testid="add-to-cart"]').click()
    
    cy.xrayStep('Navigate to checkout')
    cy.visit('/checkout')
    
    cy.xrayStep('Verify checkout page is loaded')
    cy.get('[data-testid="checkout-form"]').should('be.visible')
    
    cy.xrayPass('STORE-005')
  })

  it('should access user login page', () => {
    cy.xrayTestCase('STORE-006')
    
    cy.xrayStep('Navigate to login page')
    cy.visit('/login')
    
    cy.xrayStep('Verify login page is loaded')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-submit"]').should('be.visible')
    
    cy.xrayPass('STORE-006')
  })
})
