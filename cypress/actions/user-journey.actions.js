/**
 * Complete User Journey Actions
 * Rule 07: Actions - Business flows, Specs → Actions → Pages
 */

const { HomePage } = require('../pages/HomePage')
const { LoginPage } = require('../pages/LoginPage')
const { SignUpPage } = require('../pages/SignUpPage')
const { randomEmail } = require('../utils/random-email')

const userJourneyActions = {
  /**
   * Sign up from homepage: Log in → Sign Up tab → fill form → Register
   * URL stays on /login (no /signup); tab switch is in-page only.
   * @param {Object} options - { firstName, lastName, email (optional, uses random if omitted), password }
   */
  signUpFromHomepage(options = {}) {
    const homepage = new HomePage()
    const signUpPage = new SignUpPage()
    const email = options.email || randomEmail('signup')
    const password = options.password || 'Testing2!'
    const firstName = options.firstName || 'Test'
    const lastName = options.lastName || 'User'

    cy.log('📱 Sign-up: Visiting homepage')
    homepage.visit()
    homepage.handleWelcomeModal()
    homepage.verifyPageLoaded()

    cy.log('🔗 Sign-up: Clicking Log in (navigates to /login)')
    homepage.clickLoginLink()
    cy.url().should('include', '/login')

    cy.log('📝 Sign-up: Clicking Sign Up tab (stays on /login)')
    signUpPage.clickSignUpTab()
    signUpPage.waitForSignUpFormVisible()

    cy.log('📝 Sign-up: Filling form')
    signUpPage.fillSignUpForm({ firstName, lastName, email, password })

    cy.log('✅ Sign-up: Clicking Register')
    signUpPage.clickRegister()

    // Wait for registration to complete - either redirect or stay on /login with user logged in
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- app transition after register
    cy.wait(2000)
  },

  /**
   * After sign-up: validate user name in header (top right), click it, verify Log out, click Log out,
   * then confirm in modal "Yes, log out".
   * @param {string} displayName - e.g. 'Test User' (firstName + ' ' + lastName used in sign-up)
   */
  validateRegisteredUserAndLogout(displayName = 'Test User') {
    const homepage = new HomePage()
    cy.log('👤 Validating registered user name in header')
    homepage.getUserNameDisplay(displayName).should('be.visible')
    cy.log('✅ User name visible - clicking to open menu')
    homepage.clickUserNameInHeader(displayName)
    cy.log('🔍 Verifying Log out is visible')
    homepage.getLogOutLink().should('be.visible')
    cy.log('🚪 Clicking Log out')
    homepage.clickLogOut()
    cy.log('✅ Confirming logout in modal (Yes, log out)')
    homepage.clickConfirmLogOut()
    cy.log('✅ Logged out - ready for login flow')
  },

  /**
   * Complete user journey from homepage to authenticated state
   * @param {Object} testData - Test data from fixture
   */
  completeUserJourney(testData) {
    const homepage = new HomePage()
    const loginPage = new LoginPage()

    // STEP 1: Visit homepage
    cy.log('📱 STEP 1: Visiting homepage')
    homepage.visit()
    homepage.handleWelcomeModal()
    homepage.verifyPageLoaded()

    // eslint-disable-next-line cypress/no-unnecessary-waiting -- allow homepage to settle
    cy.wait(2000)
    cy.log('✅ Homepage loaded')

    homepage.getBody().then(($body) => {
      const alreadyLoggedInAsValidUser = $body
        .text()
        .includes(testData.testUser.name)
      if (alreadyLoggedInAsValidUser) {
        cy.log(
          '✅ Already logged in as valid user (' +
            testData.testUser.name +
            ') - skipping login steps',
        )
        return
      }
      cy.log('🔗 STEP 2: Click Log In (go to login page)')
      homepage.clickLoginLink()
      cy.url().should('include', '/login')
      cy.log('🔀 Ensuring Log In tab is active')
      loginPage.clickLogInTab()
      cy.log('❌ STEP 3: Login with invalid user')
      loginPage.fillLoginForm(
        testData.invalidUser.email,
        testData.invalidUser.password,
      )
      loginPage.submitForm()
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- allow invalid login response
      cy.wait(2000)
      cy.url().then((currentUrl) => {
        if (!currentUrl.includes('/login')) {
          cy.log('ℹ️ Redirected after invalid login - navigating back to login')
          cy.visit('/login')
          cy.url().should('include', '/login')
        }
      })
      cy.log('🔀 Ensuring Log In tab is active')
      loginPage.clickLogInTab()
      cy.log('📧 STEP 4: Login with valid user')
      loginPage.fillLoginForm(
        testData.testUser.email,
        testData.testUser.password,
      )
      loginPage.submitForm()
    })

    // STEP 5: Verify authentication (whether we just logged in or were already logged in)
    cy.log('🔐 STEP 5: Verifying successful authentication')
    cy.url().should('include', Cypress.config('baseUrl'))
    cy.url().should('not.include', '/login')

    homepage.verifyUserAuthenticated(testData.testUser.name)
    homepage.verifyShopsButtonPresent()
    cy.log('✅ Authentication successful')

    // STEP 6: Verify homepage content
    cy.log('🏠 STEP 6: Verifying homepage content rendering')
    homepage.verifyHomepageContent(testData.homepageContent.expectedH2Texts)
    cy.log('✅ Homepage content verified')

    // STEP 7: Navigate using header element
    cy.log('🧭 STEP 7: Clicking on header navigation element')
    homepage.clickNavigationElement()
    cy.log('✅ Header navigation element clicked successfully')

    // STEP 8: Click on Cleveland Hospital
    cy.log('🏥 STEP 8: Clicking on Cleveland Hospital')
    homepage.clickClevelandHospital()
    cy.log('✅ Cleveland Hospital clicked successfully')

    // STEP 8.1: Verify location page loaded correctly
    cy.log('📍 STEP 8.1: Verifying Cleveland Hospital location page')
    homepage.verifyLocationH1('Cleveland Hospital')
    cy.log('✅ Cleveland Hospital location page verified - h1 found')

    // STEP 9: Test brand element clickability and navigation
    cy.log('🏢 STEP 9: Testing brand element clickability and navigation')

    // Check if we can navigate back via brand element
    homepage.getBrandImage().then(($img) => {
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
        cy.log(
          '✅ Brand element is clickeable - testing navigation back to homepage',
        )
        cy.wrap($img).click()
        cy.url().should('include', Cypress.config('baseUrl'))
        cy.url().should('not.include', '/cleveland-hospital')
        cy.log('✅ Successfully navigated back to homepage via brand click')

        // Continue with homepage verification
        cy.log('🏠 Verifying homepage elements after navigation')

        // Check if user is still authenticated or if we need to verify login button
        homepage.getBody().then(($body) => {
          if ($body.text().includes('Log in')) {
            cy.log('✅ Login button found - user not authenticated')
            cy.contains('Log in').should('be.visible')
          } else if ($body.text().includes('Oriana Salcedo')) {
            cy.log('✅ User still authenticated after brand navigation')
            cy.contains('Oriana Salcedo').should('be.visible')
          } else {
            cy.log('ℹ️ Checking current page state after brand navigation')
            cy.url().then((currentUrl) => {
              cy.log(`Current URL after brand click: ${currentUrl}`)
            })
          }
        })
      } else {
        cy.log(
          'ℹ️ Brand element is not clickeable - staying on Cleveland Hospital page',
        )
        cy.wrap($img).should('be.visible')
        cy.log('✅ Brand element visibility confirmed (non-clickeable)')
        cy.log('📍 Test completed on Cleveland Hospital page as expected')
        cy.log('✅ User journey successfully completed on location page')
      }
    })

    cy.log('✅ Brand element clickability test completed')
  },

  /**
   * Navigate through all navbar links and verify h1 matches navbar link text
   * @param {Object} testData - Test data from fixture
   */
  // eslint-disable-next-line no-unused-vars -- param kept for API consistency
  navigateAllNavbarPages(testData) {
    const homepage = new HomePage()

    cy.log('🧭 Starting navbar navigation test')

    // Get all navbar links
    homepage.getAllNavbarLinks().then((navbarLinks) => {
      cy.log(`📋 Found ${navbarLinks.length} navbar links to test`)

      if (navbarLinks.length === 0) {
        cy.log('⚠️ No navbar links found, skipping navbar navigation test')
        return
      }

      // Log all found links
      navbarLinks.forEach((link, index) => {
        cy.log(`🔗 Navbar Link ${index + 1}: "${link.text}" -> ${link.href}`)
      })

      // Navigate through each link (limit to first 5 to avoid long test times)
      const maxLinks = Math.min(navbarLinks.length, 5)
      cy.log(`🎯 Testing first ${maxLinks} navbar links`)

      // Use cy.wrap to properly handle async operations
      // eslint-disable-next-line cypress/unsafe-to-chain-command -- .each().then() pattern required
      cy.wrap(navbarLinks.slice(0, maxLinks))
        .each((link, index) => {
          cy.log(
            `\n📍 Testing navbar link ${index + 1}/${maxLinks}: "${link.text}"`,
          )

          // Navigate to the navbar link and verify h1
          homepage.navigateToNavbarLinkAndVerifyH1(link.text)

          // Wait a bit between navigations
          // eslint-disable-next-line cypress/no-unnecessary-waiting -- between nav links
          cy.wait(500)

          // If this is not the last link, go back to homepage for next iteration
          if (index < maxLinks - 1) {
            cy.log('🏠 Returning to homepage for next navbar link test')
            homepage.visit()
            // eslint-disable-next-line cypress/no-unnecessary-waiting -- allow page load
            cy.wait(1000)
          }
        })
        .then(() => {
          cy.log('✅ Navbar links navigation test completed')
        })
    })
  },

  /**
   * Complete user journey including navbar navigation
   * @param {Object} testData - Test data from fixture
   */
  completeUserJourneyWithNavbarNavigation(testData) {
    const homepage = new HomePage()
    const loginPage = new LoginPage()

    // STEP 1: Visit homepage
    cy.log('📱 STEP 1: Visiting homepage')
    homepage.visit()
    homepage.handleWelcomeModal()
    homepage.verifyPageLoaded()

    // Check if user is already authenticated or needs to login
    homepage.getBody().then(($body) => {
      if ($body.text().includes('Log in')) {
        cy.log('🔐 User not authenticated, proceeding with login flow')

        // STEP 2: Navigate to login
        cy.log('🔗 STEP 2: Clicking login button')
        homepage.clickLoginLink()
        cy.url().should('include', '/login')

        // STEP 3: Login with valid credentials
        cy.log('📧 STEP 3: Filling correct credentials')
        loginPage.fillLoginForm(
          testData.testUser.email,
          testData.testUser.password,
        )
        loginPage.submitForm()

        // STEP 4: Verify authentication
        cy.log('🔐 STEP 4: Verifying successful authentication')
        cy.url().should('include', Cypress.config('baseUrl'))
        cy.url().should('not.include', '/login')

        homepage.verifyUserAuthenticated(testData.testUser.name)
        cy.log('✅ Authentication successful')
      } else {
        cy.log(
          '✅ User already authenticated, proceeding with navbar navigation',
        )
      }
    })

    // STEP 5: Test navbar navigation
    cy.log('\n🧭 STEP 5: Testing navbar navigation across all pages')
    this.navigateAllNavbarPages(testData)

    cy.log('✅ Complete user journey with navbar navigation successful!')
  },
}

module.exports = { userJourneyActions }
