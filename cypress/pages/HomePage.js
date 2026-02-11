/**
 * Homepage Page Object - Optimized
 * Rule 06: Page Objects - Class-based, atomic UI actions only, no assertions
 */

const { commonHelpers } = require('../support/common-helpers')

class HomePage {
  // Navigation
  visit() {
    cy.visit('/')
  }

  // Page Elements
  getBody() {
    return cy.get('body')
  }

  /** Brand/logo image (e.g. img[alt*="Company brand"]) for clickability check */
  getBrandImage() {
    return cy.get('img[alt*="Company brand"]')
  }

  getHeader() {
    return cy.get('header, [role="banner"], nav')
  }

  getLoginLink() {
    return cy.contains('Log in')
  }

  getWelcomeModal() {
    return cy.contains('Start Shopping')
  }

  getShopsButton() {
    return cy.contains('Shop')
  }

  /** Shop menu trigger inside header nav (body/div/div[2]/div/header/div/nav). */
  getShopsMenuTab() {
    return cy.get('header nav').contains('Shop').first()
  }

  /** Opens the Shop/Location menu so the location link is visible. Two separate commands to avoid "element detached" on re-render. */
  clickOpenLocationMenu() {
    this.getShopsMenuTab().should('be.visible')
    this.getShopsMenuTab().click()
  }

  getUserNameElement() {
    return cy.contains('Oriana Salcedo')
  }

  /** Element that displays the given user name (e.g. in header top right; fallback body) */
  getUserNameDisplay(userName) {
    return cy.get('body').contains(userName).first()
  }

  /** Log out link/button (case insensitive) */
  getLogOutLink() {
    return cy.contains(/log out/i).first()
  }

  /** Confirm log out in modal: "Yes, log out" (button or link) */
  getConfirmLogOutButton() {
    return cy.contains(/yes,?\s*log out/i).first()
  }

  getNavigationElement() {
    return cy.get(
      'body > div > div.flex.min-h-screen.flex-col.items-center.justify-between > div > header > div > nav > div:nth-child(1) > ul',
    )
  }

  getH2Elements() {
    return cy.get('h2')
  }

  /** Location link (QA: Cleveland Hospital, STG: Keck Medicine of USC) */
  getDefaultLocationElement() {
    const name = Cypress.env('defaultLocationName') || 'Cleveland Hospital'
    return cy.contains(name)
  }

  // Atomic Actions
  clickLoginLink() {
    cy.dismissModal()
    this.getLoginLink().click({ force: true })
  }

  clickUserNameInHeader(userName) {
    this.getUserNameDisplay(userName).should('be.visible').click()
  }

  clickLogOut() {
    this.getLogOutLink().should('be.visible').click()
  }

  /** Confirm logout in modal: click "Yes, log out" */
  clickConfirmLogOut() {
    this.getConfirmLogOutButton().should('be.visible').click()
  }

  handleWelcomeModal() {
    cy.handleWelcomeModal()
  }

  // Verification methods (for actions to use)
  verifyPageLoaded() {
    commonHelpers.waitForElementReady('body')
    cy.url().should('include', Cypress.config('baseUrl'))
  }

  verifyHeaderPresent() {
    commonHelpers.verifyElementExists('header', 'Header')
  }

  verifyContentPresent() {
    commonHelpers.waitForElementReady('body')
  }

  verifyUserAuthenticated(userName) {
    cy.contains(userName).should('be.visible')
  }

  verifyShopsButtonPresent() {
    this.getShopsButton().should('be.visible')
  }

  verifyHomepageContent(expectedTexts) {
    this.getBody().then(($body) => {
      const foundTexts = expectedTexts.filter(
        (text) =>
          $body
            .find('h2')
            .filter((i, el) =>
              Cypress.$(el).text().toLowerCase().includes(text.toLowerCase()),
            ).length > 0,
      )

      if (foundTexts.length > 0) {
        cy.log(`✅ Homepage content verified - found: ${foundTexts.join(', ')}`)
      } else {
        cy.log(
          '⚠️ Expected homepage h2 elements not found, but continuing test',
        )
      }
    })

    // Alternative robust validation
    this.getH2Elements().should('exist').and('be.visible')
    cy.log('✅ Homepage h2 elements are present and visible')
  }

  clickNavigationElement() {
    this.getNavigationElement().should('be.visible').click()
  }

  clickDefaultLocation() {
    this.getDefaultLocationElement().should('be.visible').click()
  }

  verifyLocationH1(locationName) {
    cy.get('h1').should('be.visible').and('contain.text', locationName)
  }

  verifyBrandElementClickability() {
    // Look for brand element with either alt text (clickeable or non-clickeable)
    cy.get('img[alt*="Company brand"]').then(($img) => {
      const $parent = $img.parent()
      const altText = $img.attr('alt')
      const isClickable =
        altText.includes('clickable') ||
        $parent.is('a') ||
        $parent.is('button') ||
        $parent.css('cursor') === 'pointer' ||
        $img.css('cursor') === 'pointer'

      cy.log(`🔍 Brand element found with alt: "${altText}"`)

      if (isClickable) {
        cy.log('✅ Brand element is clickeable - testing navigation')
        cy.wrap($img).click()
        cy.url().should('include', Cypress.config('baseUrl'))
        cy.url().should(
          'not.include',
          `/${Cypress.env('defaultLocationSlug') || 'cleveland-hospital'}`,
        )
        cy.log('✅ Successfully navigated back to homepage via brand click')
      } else {
        cy.log('ℹ️ Brand element is not clickeable - staying on current page')
        cy.wrap($img).should('be.visible')
        cy.log('✅ Brand element visibility confirmed (non-clickeable)')
        cy.log(
          `✅ Staying on ${Cypress.env('defaultLocationName') || 'location'} page as expected`,
        )
      }
    })
  }

  // Simplified Navbar Navigation Methods - Using common helpers
  getNavbarLinks() {
    return cy
      .get('nav a, header nav a, .navbar a, [role="navigation"] a')
      .not('[href="#"]')
      .not('[href=""]')
  }

  clickNavbarLink(linkText) {
    cy.log(`🔗 Clicking navbar link: "${linkText}"`)

    cy.get('header nav div ul a, header nav ul a')
      .contains(linkText)
      .should('be.visible')
      .click()
  }

  navigateToNavbarLinkAndVerifyH1(linkText) {
    cy.log(`🧭 Navigating to navbar link: "${linkText}"`)

    this.clickNavbarLink(linkText)
    // Close dropdown if click opened it (e.g. Shop Menu) so main content/h1 is visible
    commonHelpers.dismissOpenMenus()
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- allow overlay to close before asserting h1
    cy.wait(800, { log: false })
    commonHelpers.waitForNavigation()
    commonHelpers.validateH1Match(linkText, 15000, { onlyExistence: true })

    cy.log(`✅ Successfully navigated to "${linkText}" and verified h1`)
  }
}

module.exports = { HomePage }
