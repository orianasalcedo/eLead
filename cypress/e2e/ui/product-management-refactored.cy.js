/**
 * Product Management Tests - REFACTORED
 * ✅ Uses Page Objects (Rule 06)
 * ✅ Uses Actions (Rule 07)
 * ✅ Uses Fixtures (Rule 08)
 * ✅ NO direct cy.visit(), cy.get() in tests
 */

const { productsActions } = require('../../actions/products.actions')
const { ProductsPage } = require('../../pages/ProductsPage')

describe('Product Management Tests - Refactored', () => {
  beforeEach(() => {
    cy.fixture('products').as('products')
  })

  it('should display product list', () => {
    // ✅ Uses Action
    productsActions.viewProductList()

    // ✅ Uses Page Object for assertions
    const productsPage = new ProductsPage()
    productsPage.getProductItems().should('have.length.greaterThan', 0)
  })

  it('should filter products by category', () => {
    // ✅ Uses Action
    productsActions.filterByCategory('Electronics')

    // ✅ Uses Page Object for assertions
    const productsPage = new ProductsPage()
    productsPage.getProductItems().each(($item) => {
      cy.wrap($item).should('contain', 'Electronics')
    })
  })

  it('should search for products', () => {
    // ✅ Uses Action
    productsActions.searchProduct('laptop')

    // ✅ Uses Page Object for assertions
    const productsPage = new ProductsPage()
    productsPage.getProductItems().should('contain', 'Laptop')
  })

  it('should add product to cart', () => {
    // ✅ Uses Action
    productsActions.addFirstProductToCart()

    // ✅ Uses Page Object for assertions
    const productsPage = new ProductsPage()
    productsPage.getCartCount().should('contain', '1')
  })

  it('should view product details', () => {
    // ✅ Uses Action (already has minimal assertions inside)
    productsActions.viewProductDetails()

    // ✅ Uses Page Object for additional assertions
    const productsPage = new ProductsPage()
    productsPage.getProductDetails().should('be.visible')
  })
})

