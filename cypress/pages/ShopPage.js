/**
 * Shop / Location catalog page (e.g. /shop?location=...).
 * After clicking a location from homepage we land here; catalog has product links to /shop/:id
 */

class ShopPage {
  /** Links to product detail pages (href like /shop/123 or /shop/12345) */
  getCatalogProductLinks() {
    return cy.get('a[href*="/shop/"]')
  }

  /**
   * First product link in the catalog whose href is a product detail path (/shop/:id).
   * Excludes links that are just /shop or /shop?
   */
  getFirstCatalogProductLink() {
    return this.getCatalogProductLinks().filter((_i, el) => {
      const href = el.getAttribute('href') || ''
      const afterShop = href.split('/shop/')[1]
      const pathSegment = afterShop ? afterShop.split('?')[0].split('/')[0] : ''
      return pathSegment.length > 0
    })
  }

  /** Click the first product in the catalog to open product detail */
  clickFirstCatalogProduct() {
    this.getFirstCatalogProductLink().first().should('be.visible').click()
  }

  /** Assert we are on a product detail page (url has /shop/:id and page shows product content). */
  verifyProductDetailPage(timeout = 10000) {
    cy.url({ timeout }).should('match', /\/shop\/[^/?]+/)
    cy.contains('Product ID:', { timeout }).should('exist')
  }
}

module.exports = { ShopPage }
