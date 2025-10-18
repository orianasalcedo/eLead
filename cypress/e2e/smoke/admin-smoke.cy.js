// Smoke Tests for eLead Promo Admin Site
describe('Admin Site Smoke Tests', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
    cy.handleNetworkError()
  })

  it('should load admin login page', () => {
    cy.xrayTestCase('ADMIN-001')
    
    cy.xrayStep('Navigate to admin login page')
    cy.visit('/admin/login')
    
    cy.xrayStep('Verify login page elements are visible')
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-submit"]').should('be.visible')
    
    cy.xrayPass('ADMIN-001')
  })

  it('should login with valid admin credentials', () => {
    cy.xrayTestCase('ADMIN-002')
    
    cy.xrayStep('Login with valid admin credentials')
    cy.fixture('users/admin.json').then(({ email, password }) => {
      cy.loginByApi(email, password)
    })
    
    cy.xrayStep('Navigate to admin dashboard')
    cy.visit('/admin/dashboard')
    
    cy.xrayStep('Verify dashboard is loaded')
    cy.contains('Welcome').should('be.visible')
    cy.url().should('include', '/admin/dashboard')
    
    cy.xrayPass('ADMIN-002')
  })

  it('should access stores section', () => {
    cy.xrayTestCase('ADMIN-003')
    
    cy.xrayStep('Login as admin')
    cy.fixture('users/admin.json').then(({ email, password }) => {
      cy.loginByApi(email, password)
    })
    
    cy.xrayStep('Navigate to stores section')
    cy.visit('/admin/stores')
    
    cy.xrayStep('Verify stores page is loaded')
    cy.get('[data-testid="stores-list"]').should('be.visible')
    cy.contains('Stores').should('be.visible')
    
    cy.xrayPass('ADMIN-003')
  })

  it('should access orders section', () => {
    cy.xrayTestCase('ADMIN-004')
    
    cy.xrayStep('Login as admin')
    cy.fixture('users/admin.json').then(({ email, password }) => {
      cy.loginByApi(email, password)
    })
    
    cy.xrayStep('Navigate to orders section')
    cy.visit('/admin/orders')
    
    cy.xrayStep('Verify orders page is loaded')
    cy.get('[data-testid="orders-list"]').should('be.visible')
    cy.contains('Orders').should('be.visible')
    
    cy.xrayPass('ADMIN-004')
  })

  it('should access customers section', () => {
    cy.xrayTestCase('ADMIN-005')
    
    cy.xrayStep('Login as admin')
    cy.fixture('users/admin.json').then(({ email, password }) => {
      cy.loginByApi(email, password)
    })
    
    cy.xrayStep('Navigate to customers section')
    cy.visit('/admin/customers')
    
    cy.xrayStep('Verify customers page is loaded')
    cy.get('[data-testid="customers-list"]').should('be.visible')
    cy.contains('Customers').should('be.visible')
    
    cy.xrayPass('ADMIN-005')
  })
})
