Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password }).then(({ body }) => {
    window.localStorage.setItem('token', body.token)
  })
})
Cypress.Commands.add('dataTest', (id) => cy.get(`[data-testid="${id}"]`))
