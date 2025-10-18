# 🧪 Cypress Testing Framework - eLead Promo

A comprehensive Cypress testing framework following industry best practices and Page Object Model pattern.

---

## 📁 Repository Layout (After Cleanup)

```
cypress-framework/
├── cypress/
│   ├── e2e/                      # Test specifications
│   │   ├── api/                  # API tests (8 files)
│   │   │   ├── api-smoke-working.cy.js
│   │   │   ├── authentication-tests.cy.js
│   │   │   ├── address-management-improved.cy.js
│   │   │   ├── order-management-tests.cy.js
│   │   │   ├── contact-form-tests.cy.js
│   │   │   ├── page-content-simple-tests.cy.js
│   │   │   └── product-catalog-tests.cy.js
│   │   ├── ui/                   # UI tests (2 files - refactored)
│   │   │   ├── product-management-refactored.cy.js
│   │   │   └── user-authentication-refactored.cy.js
│   │   ├── features/             # Feature tests (14 files)
│   │   ├── smoke/                # Smoke tests (5 files)
│   │   └── regression/           # Regression tests (1 file)
│   ├── pages/                    # Page Objects (POM)
│   │   ├── LoginPage.js
│   │   ├── ProductsPage.js
│   │   ├── RegisterPage.js
│   │   └── components/
│   ├── actions/                  # Business flow actions
│   │   ├── auth.actions.js
│   │   └── products.actions.js
│   ├── fixtures/                 # Test data
│   │   ├── addresses/
│   │   ├── users/
│   │   └── api/
│   ├── utils/                    # Utilities & helpers
│   │   ├── data.js
│   │   └── address-generator.js
│   └── support/                  # Custom commands & config
│       ├── commands.js
│       ├── eleadpromo-commands.js
│       └── e2e.js
├── docs/                         # Documentation
│   ├── COMPLIANCE_REPORT.md
│   ├── DATA_MANAGEMENT_GUIDE.md
│   ├── REFACTORING_PLAN.md
│   ├── TESTING_GUIDE.md
│   └── XRAY_INTEGRATION_GUIDE.md
├── scripts/                      # Utility scripts
├── .eslintrc.json               # Linting rules
├── .prettierrc                  # Code formatting
├── cypress.config.js            # Cypress configuration
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
npm install
```

### Run Tests

#### Open Cypress Test Runner
```bash
# QA environment
npm run cy:open:qa

# Staging environment
npm run cy:open:stg
```

#### Run Tests Headlessly
```bash
# Run all smoke tests in QA
npm run cy:run:qa -- --spec "cypress/e2e/smoke/**"

# Run all API tests in Staging
npm run cy:run:stg -- --spec "cypress/e2e/api/**"

# Run specific test
npx cypress run --env environment=qa --spec "cypress/e2e/api/api-smoke-working.cy.js"
```

---

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run cy:open` | Open Cypress Test Runner |
| `npm run cy:run` | Run tests headlessly |
| `npm run cy:run:headed` | Run tests with browser visible |
| `npm run cy:open:qa` | Open Cypress in QA environment |
| `npm run cy:open:stg` | Open Cypress in Staging environment |
| `npm run cy:run:qa` | Run tests in QA environment |
| `npm run cy:run:stg` | Run tests in Staging environment |
| `npm run cy:run:smoke` | Run smoke tests |
| `npm run cy:run:api` | Run API tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

---

## 🏗️ Architecture

### Page Object Model (POM)
All UI interactions are abstracted into Page Objects located in `cypress/pages/`.

**Example:**
```javascript
// cypress/pages/LoginPage.js
class LoginPage {
  visit() { cy.visit('/login') }
  getEmailInput() { return cy.get('[data-cy="email-input"]') }
  fillEmail(email) { this.getEmailInput().clear().type(email) }
}
```

### Actions Pattern
Business flows are encapsulated in Actions located in `cypress/actions/`.

**Example:**
```javascript
// cypress/actions/auth.actions.js
const { LoginPage } = require('../pages/LoginPage')

const authActions = {
  uiLogin(email, password) {
    const loginPage = new LoginPage()
    loginPage.visit()
    loginPage.fillLoginForm(email, password)
    loginPage.submitForm()
  }
}
```

### Test Structure
Tests import Actions (not Page Objects directly) and focus on assertions.

**Example:**
```javascript
// cypress/e2e/ui/user-authentication-refactored.cy.js
const { authActions } = require('../../actions/auth.actions')

describe('Authentication', () => {
  it('should login successfully', () => {
    authActions.uiLogin('user@example.com', 'password')
    cy.url().should('not.include', '/login')
  })
})
```

---

## 🌍 Environments

### Configuration
Environments are configured in `cypress.config.js` and can be selected via:
```bash
--env environment=<env>
```

### Available Environments
- **qa**: https://tienda1.qa.eleaddev.com
- **staging**: https://aya.stg.eleaddev.com
- **production**: (configured in PRODUCTION_URL env var)

### Environment Files
- `env.development` - QA environment
- `env.staging` - Staging environment
- `env.production` - Production environment

---

## ✅ Best Practices

### 1. **Use Page Objects**
```javascript
❌ BAD: cy.get('[data-cy="email"]').type('test@example.com')
✅ GOOD: loginPage.fillEmail('test@example.com')
```

### 2. **Use Actions for Business Flows**
```javascript
❌ BAD: Test contains cy.visit(), cy.get() calls
✅ GOOD: Test calls authActions.uiLogin()
```

### 3. **Use Fixtures for Test Data**
```javascript
❌ BAD: const user = { email: 'test@example.com' }
✅ GOOD: cy.fixture('users/admin')
```

### 4. **No Hardcoded Waits**
```javascript
❌ BAD: cy.wait(5000)
✅ GOOD: cy.intercept('GET', '/api/users').as('getUsers'); cy.wait('@getUsers')
```

### 5. **Use data-cy Selectors**
```javascript
❌ BAD: cy.get('.btn-primary')
✅ GOOD: cy.get('[data-cy="login-button"]')
```

---

## 📚 Documentation

- **[CLEANUP_PLAN.md](./CLEANUP_PLAN.md)** - Repository cleanup and organization plan
- **[docs/COMPLIANCE_REPORT.md](./docs/COMPLIANCE_REPORT.md)** - Cypress rules compliance
- **[docs/DATA_MANAGEMENT_GUIDE.md](./docs/DATA_MANAGEMENT_GUIDE.md)** - Test data best practices
- **[docs/REFACTORING_PLAN.md](./docs/REFACTORING_PLAN.md)** - Refactoring strategy
- **[docs/XRAY_INTEGRATION_GUIDE.md](./docs/XRAY_INTEGRATION_GUIDE.md)** - Xray integration

---

## 🔧 Development

### Adding New Tests

#### 1. Create Page Object (if needed)
```bash
# Create in cypress/pages/
touch cypress/pages/CheckoutPage.js
```

#### 2. Create Action (if needed)
```bash
# Create in cypress/actions/
touch cypress/actions/checkout.actions.js
```

#### 3. Create Test
```bash
# Create in appropriate folder
touch cypress/e2e/ui/checkout.cy.js
```

### Running Linters
```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix

# Format code
npm run format
```

---

## 🐛 Troubleshooting

### Tests Failing?
1. Check environment configuration
2. Verify test data in fixtures
3. Check if Page Objects are up to date
4. Review console errors in Cypress runner

### Import Errors?
1. Run `npm run lint` to check for broken imports
2. Ensure Page Objects are in `cypress/pages/`
3. Ensure Actions are in `cypress/actions/`

### Environment Issues?
1. Verify `--env environment=<env>` is set
2. Check `cypress.config.js` for correct URLs
3. Review environment files (`env.*`)

---

## 📊 Test Coverage

| Category | Files | Status |
|----------|-------|--------|
| API Tests | 8 | ✅ Refactored |
| UI Tests | 2 | ✅ Refactored (POM) |
| Feature Tests | 14 | ⚠️ Need review |
| Smoke Tests | 5 | ✅ Ready |
| Regression Tests | 1 | ✅ Ready |

---

## 🤝 Contributing

1. Create a feature branch
2. Follow Page Object Model pattern
3. Write tests using Actions
4. Run linters before committing
5. Update documentation if needed

---

## 📝 License

MIT

---

## 📞 Support

For questions or issues, refer to:
- [Documentation](./docs/)
- [Cleanup Plan](./CLEANUP_PLAN.md)
- [Compliance Report](./docs/COMPLIANCE_REPORT.md)

---

**Last Updated**: October 18, 2025
**Version**: 2.0.0 (Post-Cleanup)
