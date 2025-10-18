// Example test with Xray integration
describe('User Authentication - Xray Integration', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
  })

  it('should login with valid credentials - PROJ-001', () => {
    // Link to Xray test case
    cy.xrayTestCase('PROJ-001')
    
    // Add test steps
    cy.xrayStep('Navigate to login page')
    cy.visit('/login')
    
    cy.xrayStep('Fill login form with valid credentials')
    const { validUser } = Cypress.env('testData') || {}
    cy.login(validUser?.email || 'test@example.com', validUser?.password || 'password123')
    
    cy.xrayStep('Verify successful login')
    cy.url().should('not.include', '/login')
    cy.get('[data-cy="user-menu"]').should('be.visible')
    
    // Mark test as passed
    cy.xrayPass('PROJ-001')
  })

  it('should show error with invalid credentials - PROJ-002', () => {
    cy.xrayTestCase('PROJ-002')
    
    cy.xrayStep('Navigate to login page')
    cy.visit('/login')
    
    cy.xrayStep('Fill login form with invalid credentials')
    cy.get('[data-cy="email-input"]').type('invalid@example.com')
    cy.get('[data-cy="password-input"]').type('wrongpassword')
    
    cy.xrayStep('Submit login form')
    cy.get('[data-cy="login-button"]').click()
    
    cy.xrayStep('Verify error message is displayed')
    cy.get('[data-cy="error-message"]').should('be.visible')
    
    // Capture evidence
    cy.xrayEvidence('error-message-screenshot')
    
    cy.xrayPass('PROJ-002')
  })

  it('should logout successfully - PROJ-003', () => {
    cy.xrayTestCase('PROJ-003')
    
    cy.xrayStep('Login with valid user')
    const { validUser } = Cypress.env('testData') || {}
    cy.login(validUser?.email || 'test@example.com', validUser?.password || 'password123')
    
    cy.xrayStep('Click logout button')
    cy.logout()
    
    cy.xrayStep('Verify redirect to login page')
    cy.url().should('include', '/login')
    
    cy.xrayPass('PROJ-003')
  })
})
