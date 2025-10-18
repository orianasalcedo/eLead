# Cypress Testing Framework

A comprehensive Cypress testing framework with clear folder structure and base configuration for end-to-end testing.

## 📁 Project Structure

```
cypress-framework/
├── cypress/
│   ├── e2e/                    # Test files
│   │   ├── smoke/              # Smoke tests
│   │   ├── regression/         # Regression tests
│   │   ├── api/                # API tests
│   │   └── ui/                 # UI tests
│   ├── fixtures/               # Test data files
│   │   ├── testData.json       # Test data
│   │   ├── products.json       # Product data
│   │   └── config.json         # Configuration data
│   ├── support/                # Support files
│   │   ├── commands.js         # Custom commands
│   │   └── e2e.js             # Global configuration
│   ├── downloads/              # Downloaded files
│   ├── screenshots/            # Screenshots
│   └── videos/                 # Test videos
├── cypress.config.js           # Cypress configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm (version 8 or higher)

### Installation

1. **Clone or download this framework**
   ```bash
   # If you have this as a repository
   git clone <repository-url>
   cd cypress-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Open Cypress Test Runner**
   ```bash
   npm run cypress:open
   ```

4. **Run tests in headless mode**
   ```bash
   npm run cypress:run
   ```

## 📋 Available Scripts

### Basic Commands
- `npm run cypress:open` - Open Cypress Test Runner
- `npm run cypress:run` - Run tests in headless mode
- `npm run test` - Alias for cypress:run

### Browser-Specific Tests
- `npm run test:chrome` - Run tests in Chrome
- `npm run test:firefox` - Run tests in Firefox
- `npm run test:edge` - Run tests in Edge
- `npm run test:headed` - Run tests with browser UI

### Test Categories
- `npm run test:smoke` - Run smoke tests only
- `npm run test:regression` - Run regression tests only
- `npm run test:api` - Run API tests only
- `npm run test:ui` - Run UI tests only

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## ⚙️ Configuration

### Environment Variables

The framework supports multiple environments through the `cypress.config.js`:

```javascript
// Set environment via command line
CYPRESS_ENV=staging npm run cypress:run

// Or modify cypress.config.js
env: {
  environment: 'staging' // development, staging, production
}
```

### Base URLs

- **Development**: `http://localhost:3000`
- **Staging**: `https://staging.example.com`
- **Production**: `https://example.com`

## 🛠️ Custom Commands

The framework includes several custom commands in `cypress/support/commands.js`:

### Authentication
```javascript
cy.login('email@example.com', 'password')
cy.logout()
```

### API Testing
```javascript
cy.apiRequest('GET', '/api/products')
cy.apiRequest('POST', '/api/products', { name: 'Product' })
```

### Form Handling
```javascript
cy.fillForm({
  'email': 'test@example.com',
  'password': 'password123'
})
```

### Viewport Management
```javascript
cy.mobileViewport()    // 375x667
cy.tabletViewport()   // 768x1024
cy.desktopViewport()  // 1280x720
cy.largeDesktopViewport() // 1920x1080
```

### Utility Commands
```javascript
cy.waitForElement('[data-cy="button"]')
cy.clickByText('Submit')
cy.elementExists('[data-cy="modal"]')
cy.generateRandomString(10)
```

## 📊 Test Data Management

### Fixtures

Test data is organized in the `cypress/fixtures/` folder:

- `testData.json` - User accounts, messages, API endpoints
- `products.json` - Product information
- `config.json` - Environment and configuration data

### Using Fixtures

```javascript
describe('My Test', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
  })

  it('should use test data', () => {
    cy.get('@testData').then((data) => {
      cy.login(data.users.validUser.email, data.users.validUser.password)
    })
  })
})
```

## 🎯 Test Organization

### Smoke Tests (`cypress/e2e/smoke/`)
Quick tests to verify basic functionality:
- Page loads
- Navigation works
- Forms are accessible
- API connectivity

### UI Tests (`cypress/e2e/ui/`)
User interface focused tests:
- User authentication
- Form submissions
- Navigation flows
- User interactions

### API Tests (`cypress/e2e/api/`)
Backend API testing:
- CRUD operations
- Authentication
- Error handling
- Data validation

### Regression Tests (`cypress/e2e/regression/`)
Comprehensive end-to-end tests:
- Complete user journeys
- Cross-browser compatibility
- Error scenario handling
- Performance testing

## 🔧 Best Practices

### Selectors
Use data-cy attributes for reliable selectors:
```html
<button data-cy="submit-button">Submit</button>
```

### Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  })

  it('should do something specific', () => {
    // Test steps
  })
})
```

### Assertions
```javascript
cy.get('[data-cy="element"]')
  .should('be.visible')
  .should('contain', 'Expected Text')
  .should('have.attr', 'href', '/expected-url')
```

### Page Object Model
Consider creating page objects for complex pages:
```javascript
// cypress/support/pages/LoginPage.js
class LoginPage {
  visit() {
    cy.visit('/login')
  }

  fillCredentials(email, password) {
    cy.get('[data-cy="email-input"]').type(email)
    cy.get('[data-cy="password-input"]').type(password)
  }

  submit() {
    cy.get('[data-cy="login-button"]').click()
  }
}

export default new LoginPage()
```

## 🐛 Debugging

### Debug Mode
```javascript
cy.debug() // Pause execution
cy.pause() // Pause and show debugger
```

### Console Logs
```javascript
cy.log('Custom log message')
cy.then(() => {
  console.log('Debug information')
})
```

### Screenshots
```javascript
cy.screenshot('test-screenshot')
cy.takeFullPageScreenshot('full-page')
```

## 📈 Reporting

### Built-in Reporter
The framework uses the default spec reporter. For more advanced reporting, consider:

- **Mochawesome**: `npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator`
- **Cypress Dashboard**: For CI/CD integration
- **Custom reporters**: Extend with your own reporting solution

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run cypress:run
```

### Docker Support
```dockerfile
FROM cypress/included:13.6.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "cypress:run"]
```

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Examples](https://example.cypress.io/)
- [Cypress Real World App](https://github.com/cypress-io/cypress-realworld-app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tests following the established patterns
4. Run the linter: `npm run lint:fix`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Testing! 🎉**
