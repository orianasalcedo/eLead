describe('Orders', () => {
  it('renders orders from API', () => {
    cy.intercept('GET', '/api/orders*').as('getOrders')
    cy.visit('/orders')
    cy.wait('@getOrders').its('response.statusCode').should('eq', 200)
    cy.dataTest('order-row').should('have.length.at.least', 1)
  })

  it('shows empty state', () => {
    cy.intercept('GET', '/api/orders*', { statusCode: 200, body: [] }).as(
      'empty',
    )
    cy.visit('/orders')
    cy.wait('@empty')
    cy.contains('No orders yet').should('be.visible')
  })

  it('shows friendly error on 500', () => {
    cy.intercept('GET', '/api/orders*', {
      statusCode: 500,
      body: { message: 'Internal error' },
    }).as('fail')
    cy.visit('/orders')
    cy.wait('@fail')
    cy.dataTest('toast-error')
      .should('be.visible')
      .and('contain', 'Something went wrong')
  })
})
