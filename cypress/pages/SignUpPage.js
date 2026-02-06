/**
 * Sign Up Page Object (modal opened from Homepage via Log in → Sign Up tab)
 * Rule 06: Page Objects - atomic UI actions only, no assertions
 */

class SignUpPage {
  getSignUpTab() {
    return cy.contains('Sign Up').first()
  }

  getRegisterButton() {
    return cy.contains('button', 'Register').first()
  }

  clickSignUpTab() {
    this.getSignUpTab().click()
  }

  fillFirstName(value) {
    cy.get('input[placeholder*="first name"], input[placeholder*="First name"], input[name="firstName"], input[name="first_name"]').first().clear().type(value)
  }

  fillLastName(value) {
    cy.get('input[placeholder*="last name"], input[placeholder*="Last name"], input[name="lastName"], input[name="last_name"]').first().clear().type(value)
  }

  fillEmail(value) {
    // Email field in sign-up form - clear first in case it's pre-filled
    cy.get('input[type="email"]').first().clear().type(value)
  }

  fillPassword(value) {
    // After clicking SIGN UP tab, the sign-up form should be visible
    // Get all password fields and use the first one (password field)
    cy.get('input[type="password"]').first().clear().type(value, { log: false })
  }

  fillConfirmPassword(value) {
    // After clicking SIGN UP tab, get the second password field (confirm password)
    cy.get('input[type="password"]').eq(1).clear().type(value, { log: false })
  }

  clickRegister() {
    this.getRegisterButton().click()
  }

  fillSignUpForm({ firstName, lastName, email, password }) {
    this.fillFirstName(firstName)
    this.fillLastName(lastName)
    this.fillEmail(email)
    this.fillPassword(password)
    this.fillConfirmPassword(password)
  }
}

module.exports = { SignUpPage }
