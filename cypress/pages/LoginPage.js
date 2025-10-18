/**
 * Login Page Object
 * Rule 06: Page Objects - Class-based, atomic UI actions only, no assertions
 */

class LoginPage {
  // Navigation
  visit() {
    cy.visit('/login')
  }

  // Form Elements
  getEmailInput() {
    return cy.get('[data-cy="email-input"]')
  }

  getPasswordInput() {
    return cy.get('[data-cy="password-input"]')
  }

  getLoginButton() {
    return cy.get('[data-cy="login-button"]')
  }

  // Messages
  getErrorMessage() {
    return cy.get('[data-cy="error-message"]')
  }

  getUserMenu() {
    return cy.get('[data-cy="user-menu"]')
  }

  // Atomic Actions
  fillEmail(email) {
    this.getEmailInput().clear().type(email)
  }

  fillPassword(password) {
    this.getPasswordInput().clear().type(password, { log: false })
  }

  clickLoginButton() {
    this.getLoginButton().click()
  }

  fillLoginForm(email, password) {
    this.fillEmail(email)
    this.fillPassword(password)
  }

  submitForm() {
    this.clickLoginButton()
  }
}

module.exports = { LoginPage }
