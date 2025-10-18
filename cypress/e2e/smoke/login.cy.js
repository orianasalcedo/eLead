describe('Login', () => {
  it('should login via API and reach Home', () => {
    cy.fixture('users/admin').then(({ email, password }) => {
      cy.session([email], () => { cy.loginByApi(email, password) })
      cy.visit('/home')
      cy.contains('Welcome').should('be.visible')
    })
  })
})
