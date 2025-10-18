# 👨‍💻 Development Guide - eLead Promo Cypress Framework

Complete guide for developers contributing to the test framework.

---

## 📋 Table of Contents
1. [Setup](#setup)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Creating Page Objects](#creating-page-objects)
5. [Creating Actions](#creating-actions)
6. [Data Management](#data-management)
7. [Compliance & Standards](#compliance--standards)

---

## 🔧 Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
# Clone repository (when it has a remote)
git clone <your-repo-url>
cd cypress-framework

# Install dependencies
npm install

# Verify Cypress
npx cypress verify
```

### Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit with your values
# QA: https://tienda1.qa.eleaddev.com
# STG: https://aya.stg.eleaddev.com
```

---

## 📁 Project Structure

```
cypress-framework/
├── cypress/
│   ├── e2e/              # Test specifications
│   │   ├── api/          # API tests (8 files)
│   │   ├── ui/           # UI tests (2 files) - Must use POM
│   │   ├── smoke/        # Smoke tests (5 files)
│   │   └── features/     # Feature tests (14 files)
│   ├── pages/            # Page Objects ⭐
│   ├── actions/          # Business flows ⭐
│   ├── fixtures/         # Test data
│   ├── utils/            # Utilities
│   └── support/          # Custom commands
├── docs/                 # Documentation (this file)
└── scripts/              # Utility scripts
```

---

## 🔄 Development Workflow

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Add Page Objects if needed
- Add Actions if needed
- Write tests
- Update documentation

### 3. Validate
```bash
# Format code
npm run format

# Run linter
npm run lint:fix

# Run tests
npm run cy:run:qa
```

### 4. Commit
```bash
git add -A
git commit -m "feat: add product search tests"
```

---

## 📄 Creating Page Objects

### When to Create a Page Object
Create a Page Object when you need to interact with a new page or component.

### Template
```javascript
// cypress/pages/CheckoutPage.js
/**
 * Checkout Page Object
 * Rule 06: Page Objects - Class-based, atomic UI actions only
 */

class CheckoutPage {
  // Navigation
  visit() {
    cy.visit('/checkout')
  }

  // Element getters (return cy commands)
  getShippingAddressField() {
    return cy.get('[data-cy="shipping-address"]')
  }

  getBillingAddressField() {
    return cy.get('[data-cy="billing-address"]')
  }

  getSubmitButton() {
    return cy.get('[data-cy="checkout-submit"]')
  }

  // Atomic actions (UI interactions only)
  fillShippingAddress(address) {
    this.getShippingAddressField().clear().type(address)
  }

  fillBillingAddress(address) {
    this.getBillingAddressField().clear().type(address)
  }

  clickSubmit() {
    this.getSubmitButton().click()
  }
}

module.exports = { CheckoutPage }
```

### Rules for Page Objects
- ✅ One class per page/component
- ✅ Methods return cy commands (chainable)
- ✅ Only UI interactions
- ❌ NO assertions
- ❌ NO business logic

---

## 🎯 Creating Actions

### When to Create an Action
Create an Action when you have a business flow that uses Page Objects.

### Template
```javascript
// cypress/actions/checkout.actions.js
/**
 * Checkout Actions
 * Rule 07: Actions - Business flows using Page Objects
 */

const { CheckoutPage } = require('../pages/CheckoutPage')
const { ProductsPage } = require('../pages/ProductsPage')

const checkoutActions = {
  /**
   * Complete checkout flow
   */
  completeCheckout(shippingAddress, billingAddress) {
    const checkoutPage = new CheckoutPage()
    checkoutPage.visit()
    checkoutPage.fillShippingAddress(shippingAddress)
    checkoutPage.fillBillingAddress(billingAddress)
    checkoutPage.clickSubmit()
    
    // Minimal assertion: flow completed
    cy.url().should('include', '/order-confirmation')
  },

  /**
   * Add product and checkout
   */
  quickCheckout(productIndex = 0) {
    const productsPage = new ProductsPage()
    productsPage.visit()
    productsPage.addProductToCart(productIndex)
    
    this.completeCheckout('123 Main St', '456 Oak Ave')
  }
}

module.exports = { checkoutActions }
```

### Rules for Actions
- ✅ Uses Page Objects (not direct cy.get())
- ✅ Represents business flow
- ✅ Can have minimal assertions
- ❌ NO detailed assertions

---

## 🗂️ Data Management

### Fixtures (Static Data)
```javascript
// cypress/fixtures/users/customer.json
{
  "email": "customer@example.com",
  "password": "securePass123",
  "firstName": "John",
  "lastName": "Doe"
}

// In test:
cy.fixture('users/customer').then((user) => {
  cy.login(user.email, user.password)
})
```

### Utils (Dynamic Data)
```javascript
// cypress/utils/data.js
function randomEmail(prefix = 'user') {
  const n = Math.floor(Math.random() * 1e6)
  return `${prefix}${n}@example.com`
}

// In test:
const { randomEmail } = require('../../utils/data')
const email = randomEmail('test')
```

### Getting Real Data from API
```javascript
// ✅ CORRECT - Get real country/state IDs
beforeEach(() => {
  cy.eleadpromoLogin(email, password)
  cy.getRealCountryAndState()
})

it('should create address', () => {
  cy.get('@realCountryId').then((countryId) => {
    cy.get('@realStateId').then((stateId) => {
      const address = createAddress(countryId, stateId)
      cy.apiRequest('POST', '/api/v1/addresses', address)
    })
  })
})
```

---

## ✅ Compliance & Standards

### Code Style
```bash
# Check linting
npm run lint

# Auto-fix
npm run lint:fix

# Format code
npm run format
```

### Selector Policy
**Priority order**:
1. `[data-cy="element-id"]` (best)
2. `[data-testid="element-id"]` (good)
3. `[role="button"]` (acceptable)
4. `.class-name` (avoid)
5. `#id` (avoid)
6. `:nth-child()` (never)

### Import Rules
```javascript
// ✅ Tests import Actions (not Pages directly)
const { authActions } = require('../../actions/auth.actions')

// ❌ Tests should NOT import Pages directly
// const { LoginPage } = require('../../pages/LoginPage')  // ESLint error!

// ✅ Actions import Pages
const { LoginPage } = require('../pages/LoginPage')
```

---

## 🚀 Adding a New Feature Test

### Step-by-Step

#### 1. Identify what you need
- Page interactions? → Need Page Object
- Business flow? → Need Action
- Test data? → Need Fixture or Util

#### 2. Create Page Object (if UI test)
```bash
touch cypress/pages/NewFeaturePage.js
```

#### 3. Create Action (if complex flow)
```bash
touch cypress/actions/newFeature.actions.js
```

#### 4. Create Fixture (if static data)
```bash
mkdir -p cypress/fixtures/newFeature
touch cypress/fixtures/newFeature/data.json
```

#### 5. Write Test
```bash
touch cypress/e2e/features/new-feature.cy.js
```

```javascript
const { newFeatureActions } = require('../../actions/newFeature.actions')

describe('New Feature', () => {
  it('should do something', () => {
    newFeatureActions.doSomething()
    // Assertions here
  })
})
```

#### 6. Validate
```bash
npm run format
npm run lint
npm run cy:run:qa -- --spec "cypress/e2e/features/new-feature.cy.js"
```

---

## 📊 Quality Checklist

Before merging:
- [ ] Code formatted (`npm run format`)
- [ ] Linting passes (`npm run lint`)
- [ ] Uses Page Objects (if UI)
- [ ] Uses Actions (if business flow)
- [ ] Uses fixtures/utils (no dummy data)
- [ ] Tests pass in QA
- [ ] Documentation updated (if needed)

---

## 🔍 Debugging

### Cypress Debug Mode
```bash
# Open Cypress with debug
DEBUG=cypress:* npm run cy:open:qa
```

### Console Logs in Tests
```javascript
cy.log('Custom message')
cy.task('log', 'Message in terminal')
```

### Take Screenshots
```javascript
cy.screenshot('debug-screenshot')
```

---

## 📚 Reference Documentation

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - This file
- **[README.md](../README.md)** - Main repository guide
- **[COMPLIANCE_REPORT.md](./COMPLIANCE_REPORT.md)** - Rules compliance
- **[DATA_MANAGEMENT_GUIDE.md](./DATA_MANAGEMENT_GUIDE.md)** - Data best practices

---

## 🤝 Contributing

1. Follow Page Object Model
2. Write clear, descriptive tests
3. Use fixtures and utils
4. Keep selectors in Page Objects
5. Document your changes
6. Run linter before committing

---

**Questions?** Check the documentation or ask the team!

