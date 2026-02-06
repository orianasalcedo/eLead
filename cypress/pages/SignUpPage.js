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

  /** Wait for sign-up form first name field to be visible (no assertion in action layer) */
  waitForSignUpFormVisible() {
    cy.get(
      'input[placeholder*="first name"], input[placeholder*="First name"], input[name="firstName"]',
    )
      .first()
      .should('be.visible')
  }

  clickSignUpTab() {
    this.getSignUpTab().click()
  }

  fillFirstName(value) {
    const sel =
      'input[placeholder*="first name"], input[placeholder*="First name"], input[name="firstName"], input[name="first_name"]'
    cy.get(sel).first().clear()
    cy.get(sel).first().type(value)
  }

  fillLastName(value) {
    const sel =
      'input[placeholder*="last name"], input[placeholder*="Last name"], input[name="lastName"], input[name="last_name"]'
    cy.get(sel).first().clear()
    cy.get(sel).first().type(value)
  }

  fillEmail(value) {
    cy.get('input[type="email"]').first().clear()
    cy.get('input[type="email"]').first().type(value)
  }

  fillPassword(value) {
    cy.get('input[type="password"]').first().clear()
    cy.get('input[type="password"]').first().type(value, { log: false })
  }

  fillConfirmPassword(value) {
    cy.get('input[type="password"]').eq(1).clear()
    cy.get('input[type="password"]').eq(1).type(value, { log: false })
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
