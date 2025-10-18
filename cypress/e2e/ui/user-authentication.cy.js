describe('User Authentication Tests', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
  })

  it('should login with valid credentials', () => {
    const { validUser } = Cypress.env('testData') || {}

    cy.login(validUser?.email || 'test@example.com', validUser?.password || 'password123')
    cy.url().should('not.include', '/login')
    cy.get('[data-cy="user-menu"]').should('be.visible')
  })

  it('should show error with invalid credentials', () => {
    cy.visit('/login')
    cy.get('[data-cy="email-input"]').type('invalid@example.com')
    cy.get('[data-cy="password-input"]').type('wrongpassword')
    cy.get('[data-cy="login-button"]').click()
    cy.get('[data-cy="error-message"]').should('be.visible')
  })

  it('should logout successfully', () => {
    const { validUser } = Cypress.env('testData') || {}

    cy.login(validUser?.email || 'test@example.com', validUser?.password || 'password123')
    cy.logout()
    cy.url().should('include', '/login')
  })

  it('should register new user', () => {
    cy.visit('/register')
    cy.fillForm({
      'first-name': 'John',
      'last-name': 'Doe',
      email: 'newuser@example.com',
      password: 'password123',
      'confirm-password': 'password123',
    })
    cy.get('[data-cy="register-button"]').click()
    cy.get('[data-cy="success-message"]').should('contain', 'Registration successful')
  })
})
