describe('Product Management Tests', () => {
  beforeEach(() => {
    cy.fixture('products').as('products')
  })

  it('should display product list', () => {
    cy.visit('/products')
    cy.get('[data-cy="product-list"]').should('be.visible')
    cy.get('[data-cy="product-item"]').should('have.length.greaterThan', 0)
  })

  it('should filter products by category', () => {
    cy.visit('/products')
    cy.get('[data-cy="category-filter"]').select('Electronics')
    cy.get('[data-cy="product-item"]').each(($item) => {
      cy.wrap($item).should('contain', 'Electronics')
    })
  })

  it('should search for products', () => {
    cy.visit('/products')
    cy.get('[data-cy="search-input"]').type('laptop')
    cy.get('[data-cy="search-button"]').click()
    cy.get('[data-cy="product-item"]').should('contain', 'Laptop')
  })

  it('should add product to cart', () => {
    cy.visit('/products')
    cy.get('[data-cy="product-item"]')
      .first()
      .within(() => {
        cy.get('[data-cy="add-to-cart"]').click()
      })
    cy.get('[data-cy="cart-count"]').should('contain', '1')
  })

  it('should view product details', () => {
    cy.visit('/products')
    cy.get('[data-cy="product-item"]').first().click()
    cy.url().should('include', '/product/')
    cy.get('[data-cy="product-details"]').should('be.visible')
  })
})
