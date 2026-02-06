/**
 * Login Page Object
 * Rule 06: Page Objects - Class-based, atomic UI actions only, no assertions
 */

class LoginPage {
  // Navigation
  visit() {
    cy.visit('/login')
  }

  // Tab: click Log In tab (tab text is "Log In")
  clickLogInTab() {
    cy.contains('Log In').first().click()
  }

  // Form Elements: scope to the LOG IN form (has "Log in" submit, not "Register")
  _getLoginForm() {
    return cy.get('form').filter((i, form) => {
      const $form = Cypress.$(form)
      const $btn = $form.find('button[type="submit"]')
      return $btn.length > 0 && /log\s*in/i.test($btn.text()) && !/register/i.test($btn.text())
    }).first()
  }

  getEmailInput() {
    return this._getLoginForm().find('#email, input[name="email"]').first()
  }

  getPasswordInput() {
    return this._getLoginForm().find('input[type="password"], input[name="password"]').first()
  }

  getLoginButton() {
    return this._getLoginForm().find('button[type="submit"]')
  }

  // Messages
  getErrorMessage() {
    return cy.get('[data-cy="error-message"]')
  }

  getUserMenu() {
    return cy.get('[data-cy="user-menu"]')
  }

  // Atomic Actions (break chain to avoid "subject detached" when app re-renders after clear)
  fillEmail(email) {
    this.getEmailInput().clear()
    this.getEmailInput().type(email)
  }

  fillPassword(password) {
    this.getPasswordInput().clear()
    this.getPasswordInput().type(password, { log: false })
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
