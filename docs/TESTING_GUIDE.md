# 🧪 Testing Guide - eLead Promo Cypress Framework

Complete guide for writing and running tests.

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Running Tests](#running-tests)
3. [Writing Tests](#writing-tests)
4. [Page Object Model](#page-object-model)
5. [Actions Pattern](#actions-pattern)
6. [Fixtures & Test Data](#fixtures--test-data)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Run Your First Test
```bash
# Open Cypress in QA
npm run cy:open:qa

# Run smoke tests
npm run cy:run:smoke
```

---

## 🎮 Running Tests

### Interactive Mode (Cypress Test Runner)
```bash
# QA environment
npm run cy:open:qa

# Staging environment
npm run cy:open:stg
```

### Headless Mode (CI/CD)
```bash
# Run all tests in QA
npm run cy:run:qa

# Run smoke tests
npm run cy:run:smoke

# Run API tests
npm run cy:run:api

# Run specific test
npx cypress run --env environment=qa --spec "cypress/e2e/api/api-smoke-working.cy.js"
```

### Available Environments
- **qa**: https://tienda1.qa.eleaddev.com
- **staging**: https://aya.stg.eleaddev.com

---

## ✍️ Writing Tests

### Directory Structure
```
cypress/e2e/
├── api/           # API tests (no UI interaction)
├── ui/            # UI tests (must use Page Objects)
├── smoke/         # Quick health checks
├── regression/    # Full user journeys
└── features/      # Feature-specific tests
```

### Test Naming Convention
```javascript
// ✅ GOOD
it('should display product list when user visits products page', () => {})

// ❌ BAD
it('test1', () => {})
```

---

## 🏗️ Page Object Model

### What is a Page Object?
A Page Object is a class that encapsulates all interactions with a specific page.

### Creating a Page Object
```javascript
// cypress/pages/ProductsPage.js
class ProductsPage {
  // Navigation
  visit() {
    cy.visit('/products')
  }

  // Element getters
  getProductList() {
    return cy.get('[data-cy="product-list"]')
  }

  getSearchInput() {
    return cy.get('[data-cy="search-input"]')
  }

  // Atomic actions
  typeInSearch(searchTerm) {
    this.getSearchInput().clear().type(searchTerm)
  }

  clickSearchButton() {
    cy.get('[data-cy="search-button"]').click()
  }
}

module.exports = { ProductsPage }
```

### Rules for Page Objects
- ✅ One class per page/component
- ✅ Methods return `cy` commands (chainable)
- ✅ NO assertions in Page Objects
- ✅ Use `data-cy` selectors first
- ❌ NO business logic

---

## 🎯 Actions Pattern

### What is an Action?
An Action is a business flow that uses Page Objects.

### Creating an Action
```javascript
// cypress/actions/products.actions.js
const { ProductsPage } = require('../pages/ProductsPage')

const productsActions = {
  searchProduct(searchTerm) {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.typeInSearch(searchTerm)
    productsPage.clickSearchButton()
  }
}

module.exports = { productsActions }
```

### Rules for Actions
- ✅ Uses Page Objects (never direct cy.get())
- ✅ Represents a business flow
- ✅ Minimal assertions (URL, visibility)
- ❌ NO detailed assertions (those go in tests)

---

## 📦 Fixtures & Test Data

### Fixture Structure
```
cypress/fixtures/
├── users/
│   └── admin.json
├── addresses/
│   ├── shipping.json
│   └── billing.json
└── api/
    └── orders/
        ├── list.json
        ├── empty.json
        └── error.json
```

### Using Fixtures
```javascript
// Load fixture
cy.fixture('users/admin').then((user) => {
  cy.login(user.email, user.password)
})

// Mock API response
cy.intercept('GET', '/api/orders', { fixture: 'api/orders/list.json' })
```

### Dynamic Data (Utils)
```javascript
// cypress/utils/address-generator.js
const { randomEmail } = require('../../utils/data')
const { createShippingAddress } = require('../../utils/address-generator')

// Generate unique email
const email = randomEmail('test')

// Generate address with real IDs
const address = createShippingAddress(realCountryId, realStateId)
```

### Data Management Rules
- ✅ Use fixtures for **static** base data
- ✅ Use utils for **dynamic** data generation
- ✅ Get **real IDs** from API (not hardcoded)
- ❌ NO dummy data (`country_id: 1`)

---

## 📝 Test Structure (Correct Pattern)

### ✅ CORRECT - Uses Actions + Page Objects
```javascript
// cypress/e2e/ui/product-search.cy.js
const { productsActions } = require('../../actions/products.actions')
const { ProductsPage } = require('../../pages/ProductsPage')

describe('Product Search', () => {
  it('should find products by search term', () => {
    // Use Action for business flow
    productsActions.searchProduct('laptop')

    // Use Page Object for assertions
    const productsPage = new ProductsPage()
    productsPage.getProductItems().should('contain', 'Laptop')
  })
})
```

### ❌ INCORRECT - Direct cy.get() calls
```javascript
// ❌ BAD - Violates Page Object Model
it('should find products', () => {
  cy.visit('/products')                   // ❌ Direct
  cy.get('[data-cy="search"]').type('laptop')  // ❌ Direct
  cy.get('[data-cy="results"]').should('be.visible')
})
```

---

## 🎯 Best Practices

### 1. Selectors
```javascript
✅ GOOD: cy.get('[data-cy="login-button"]')
✅ GOOD: cy.get('[data-testid="email-input"]')
❌ BAD:  cy.get('.btn-primary')
❌ BAD:  cy.get('#submitBtn')
```

### 2. Waits
```javascript
✅ GOOD: 
cy.intercept('GET', '/api/users').as('getUsers')
cy.wait('@getUsers').its('response.statusCode').should('eq', 200)

❌ BAD:  
cy.wait(5000)  // Never use arbitrary waits!
```

### 3. Test Isolation
```javascript
✅ GOOD:
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.login(user.email, user.password)
})

❌ BAD:
// Tests depend on each other
```

### 4. Assertions
```javascript
✅ GOOD:
productsPage.getProductList().should('be.visible')
productsPage.getProductItems().should('have.length.greaterThan', 0)

❌ BAD:
expect(products.length).to.be.greaterThan(0)  // Use Cypress assertions
```

---

## 🔧 Custom Commands

### Available Commands
```javascript
// Authentication
cy.eleadpromoLogin(email, password)
cy.logout()

// API requests
cy.apiRequest(method, endpoint, body)
cy.authenticatedApiRequest(method, endpoint, body)

// Data helpers
cy.getRealCountryAndState()
cy.dataCy('element-id')  // Same as cy.get('[data-cy="element-id"]')
```

### Using Custom Commands
```javascript
it('should access authenticated endpoint', () => {
  cy.eleadpromoLogin('user@example.com', 'password')
  cy.getRealCountryAndState()
  
  cy.get('@realCountryId').then((countryId) => {
    cy.authenticatedApiRequest('GET', `/api/v1/countries/${countryId}`)
  })
})
```

---

## 📊 Test Categories

### API Tests (`cypress/e2e/api/`)
- Test backend endpoints
- No UI interaction
- Focus on response structure, status codes
- Example: `api-smoke-working.cy.js`

### UI Tests (`cypress/e2e/ui/`)
- Test user interface
- **MUST use Page Objects + Actions**
- Focus on user interactions
- Example: `product-management-refactored.cy.js`

### Smoke Tests (`cypress/e2e/smoke/`)
- Quick health checks
- Run before deployments
- Critical path only
- Example: `login.cy.js`

### Feature Tests (`cypress/e2e/features/`)
- Feature-specific scenarios
- Can be UI or API
- Based on requirements
- Example: `slideshow-multi-env.cy.js`

---

## 🐛 Troubleshooting

### Tests Failing?
1. **Check environment**: `--env environment=qa`
2. **Check baseUrl**: Verify in `cypress.config.js`
3. **Check test data**: Verify fixtures exist
4. **Check selectors**: Ensure Page Objects are updated

### Import Errors?
```bash
# Check for broken imports
npm run lint

# Common fix: Verify paths
const { LoginPage } = require('../pages/LoginPage')  // ✅
const { LoginPage } = require('./pages/LoginPage')   // ❌
```

### Linting Errors?
```bash
# Auto-fix most issues
npm run lint:fix

# Format code
npm run format
```

### Environment Issues?
```bash
# Verify environment is set
npx cypress run --env environment=qa

# Check config
cat cypress.config.js | grep -A 5 "if (envName === 'qa')"
```

---

## 📚 Additional Resources

- **Cypress Docs**: https://docs.cypress.io
- **Page Object Pattern**: https://martinfowler.com/bliki/PageObject.html
- **eLead Promo API**: See `elead-promo.postman_collection.json`

---

## ✅ Checklist for New Tests

Before committing a new test:
- [ ] Uses Page Objects (if UI test)
- [ ] Uses Actions (if business flow)
- [ ] Uses fixtures for test data
- [ ] NO hardcoded data (country_id: 1, etc.)
- [ ] NO arbitrary waits (cy.wait(5000))
- [ ] Uses data-cy selectors
- [ ] Passes linting (`npm run lint`)
- [ ] Formatted (`npm run format`)

---

**For more details, see `README.md` or individual Page Objects/Actions files.**

