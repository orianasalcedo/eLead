/**
 * Products Actions
 * Rule 07: Actions - Business flows, Specs → Actions → Pages
 */

const { ProductsPage } = require('../pages/ProductsPage')

const productsActions = {
  /**
   * View product list
   */
  viewProductList() {
    const productsPage = new ProductsPage()
    productsPage.visit()
    // Minimal assertion: page loaded
    productsPage.getProductList().should('be.visible')
  },

  /**
   * Search for a product
   * @param {string} searchTerm - Product name to search for
   */
  searchProduct(searchTerm) {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.typeInSearch(searchTerm)
    productsPage.clickSearchButton()
  },

  /**
   * Filter products by category
   * @param {string} category - Category name
   */
  filterByCategory(category) {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.selectCategory(category)
  },

  /**
   * Add first product to cart
   */
  addFirstProductToCart() {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.addFirstProductToCart()
  },

  /**
   * View product details
   */
  viewProductDetails() {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.clickFirstProduct()
    // Minimal assertion: URL changed
    cy.url().should('include', '/product/')
  },
}

module.exports = { productsActions }

