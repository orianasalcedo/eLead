/**
 * User Authentication Tests - REFACTORED
 * ✅ Uses Page Objects (Rule 06)
 * ✅ Uses Actions (Rule 07)
 * ✅ Uses Fixtures (Rule 08)
 * ✅ NO direct cy.visit(), cy.get() in tests
 */

const { authActions } = require('../../actions/auth.actions')
const { LoginPage } = require('../../pages/LoginPage')
const { RegisterPage } = require('../../pages/RegisterPage')

describe('User Authentication Tests - Refactored', () => {
  let testData

  beforeEach(() => {
    cy.fixture('eleadpromo-test-data').then((data) => {
      testData = data
    })
  })

  it('should login with valid credentials', () => {
    const { email, password } = testData.users.qaCustomerOri

    // ✅ Uses Action
    authActions.uiLogin(email, password)

    // ✅ Uses Page Object for assertions
    const loginPage = new LoginPage()
    loginPage.getUserMenu().should('be.visible')
  })

  it('should show error with invalid credentials', () => {
    // ✅ Uses Action
    authActions.attemptInvalidLogin('invalid@example.com', 'wrongpassword')

    // ✅ Uses Page Object for assertions
    const loginPage = new LoginPage()
    loginPage.getErrorMessage().should('be.visible')
  })

  it('should logout successfully', () => {
    const { email, password } = testData.users.qaCustomerOri

    // ✅ Login first
    authActions.uiLogin(email, password)

    // ✅ Then logout (custom command)
    cy.logout()

    // ✅ Verify redirected to login
    cy.url().should('include', '/login')
  })

  it('should register new user', () => {
    const timestamp = Date.now()
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: `newuser-${timestamp}@example.com`,
      password: 'Password?12',
      confirmPassword: 'Password?12',
    }

    // ✅ Uses Action
    authActions.registerUser(userData)

    // ✅ Uses Page Object for assertions
    const registerPage = new RegisterPage()
    registerPage.getSuccessMessage().should('contain', 'Registration successful')
  })
})

