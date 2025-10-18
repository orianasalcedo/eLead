/**
 * Products Page Object
 * Rule 06: Page Objects - Class-based, atomic UI actions only, no assertions
 */

class ProductsPage {
  // Navigation
  visit() {
    cy.visit('/products')
  }

  // Product List Elements
  getProductList() {
    return cy.get('[data-cy="product-list"]')
  }

  getProductItems() {
    return cy.get('[data-cy="product-item"]')
  }

  getFirstProduct() {
    return this.getProductItems().first()
  }

  getProductByIndex(index) {
    return this.getProductItems().eq(index)
  }

  // Search Elements
  getSearchInput() {
    return cy.get('[data-cy="search-input"]')
  }

  getSearchButton() {
    return cy.get('[data-cy="search-button"]')
  }

  // Filter Elements
  getCategoryFilter() {
    return cy.get('[data-cy="category-filter"]')
  }

  // Cart Elements
  getAddToCartButton() {
    return cy.get('[data-cy="add-to-cart"]')
  }

  getCartCount() {
    return cy.get('[data-cy="cart-count"]')
  }

  // Product Details Elements
  getProductDetails() {
    return cy.get('[data-cy="product-details"]')
  }

  // Actions (atomic UI actions)
  typeInSearch(searchTerm) {
    this.getSearchInput().clear().type(searchTerm)
  }

  clickSearchButton() {
    this.getSearchButton().click()
  }

  selectCategory(category) {
    this.getCategoryFilter().select(category)
  }

  clickFirstProduct() {
    this.getFirstProduct().click()
  }

  addFirstProductToCart() {
    this.getFirstProduct().within(() => {
      this.getAddToCartButton().click()
    })
  }
}

module.exports = { ProductsPage }

