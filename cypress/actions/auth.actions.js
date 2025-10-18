/**
 * Authentication Actions
 * Rule 07: Actions - Business flows, Specs → Actions → Pages
 */

const { LoginPage } = require('../pages/LoginPage')
const { RegisterPage } = require('../pages/RegisterPage')

const authActions = {
  /**
   * Login via UI
   * @param {string} email - User email
   * @param {string} password - User password
   */
  uiLogin(email, password) {
    const loginPage = new LoginPage()
    loginPage.visit()
    loginPage.fillLoginForm(email, password)
    loginPage.submitForm()
    // Minimal assertion: URL changed
    cy.url().should('not.include', '/login')
  },

  /**
   * Login via API (for speed)
   * @param {string} email - User email
   * @param {string} password - User password
   */
  apiLogin(email, password) {
    cy.request('POST', '/api/auth/login', { email, password }).then(
      ({ body }) => {
        window.localStorage.setItem('token', body.token)
      },
    )
  },

  /**
   * Register new user via UI
   * @param {Object} userData - User registration data
   */
  registerUser(userData) {
    const registerPage = new RegisterPage()
    registerPage.visit()
    registerPage.fillRegistrationForm(userData)
    registerPage.clickRegisterButton()
  },

  /**
   * Login with invalid credentials
   * @param {string} email - User email
   * @param {string} password - User password
   */
  attemptInvalidLogin(email, password) {
    const loginPage = new LoginPage()
    loginPage.visit()
    loginPage.fillLoginForm(email, password)
    loginPage.submitForm()
    // Should stay on login page
    cy.url().should('include', '/login')
  },
}

module.exports = { authActions }
