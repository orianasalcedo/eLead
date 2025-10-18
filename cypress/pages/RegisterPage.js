/**
 * Register Page Object
 * Rule 06: Page Objects - Class-based, atomic UI actions only, no assertions
 */

class RegisterPage {
  // Navigation
  visit() {
    cy.visit('/register')
  }

  // Form Elements
  getFirstNameInput() {
    return cy.get('[data-cy="first-name"]')
  }

  getLastNameInput() {
    return cy.get('[data-cy="last-name"]')
  }

  getEmailInput() {
    return cy.get('[data-cy="email"]')
  }

  getPasswordInput() {
    return cy.get('[data-cy="password"]')
  }

  getConfirmPasswordInput() {
    return cy.get('[data-cy="confirm-password"]')
  }

  getRegisterButton() {
    return cy.get('[data-cy="register-button"]')
  }

  // Messages
  getSuccessMessage() {
    return cy.get('[data-cy="success-message"]')
  }

  getErrorMessage() {
    return cy.get('[data-cy="error-message"]')
  }

  // Atomic Actions
  fillFirstName(firstName) {
    this.getFirstNameInput().clear().type(firstName)
  }

  fillLastName(lastName) {
    this.getLastNameInput().clear().type(lastName)
  }

  fillEmail(email) {
    this.getEmailInput().clear().type(email)
  }

  fillPassword(password) {
    this.getPasswordInput().clear().type(password, { log: false })
  }

  fillConfirmPassword(password) {
    this.getConfirmPasswordInput().clear().type(password, { log: false })
  }

  clickRegisterButton() {
    this.getRegisterButton().click()
  }

  fillRegistrationForm(userData) {
    this.fillFirstName(userData.firstName)
    this.fillLastName(userData.lastName)
    this.fillEmail(userData.email)
    this.fillPassword(userData.password)
    this.fillConfirmPassword(userData.confirmPassword || userData.password)
  }
}

module.exports = { RegisterPage }

