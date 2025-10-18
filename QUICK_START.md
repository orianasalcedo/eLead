# Cypress Testing Framework

## Quick Commands

### Development
```bash
# Install dependencies
npm install

# Open Cypress Test Runner
npm run cypress:open

# Run all tests
npm run cypress:run
```

### Testing Categories
```bash
# Smoke tests (quick verification)
npm run test:smoke

# UI tests
npm run test:ui

# API tests
npm run test:api

# Regression tests
npm run test:regression
```

### Browser Testing
```bash
# Chrome
npm run test:chrome

# Firefox
npm run test:firefox

# Edge
npm run test:edge

# Headed mode (with browser UI)
npm run test:headed
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Docker
```bash
# Build Docker image
docker build -t cypress-framework .

# Run tests in Docker
docker run --rm cypress-framework

# Run with Docker Compose
docker-compose up cypress
```

## Project Structure
```
cypress-framework/
├── cypress/
│   ├── e2e/           # Test files
│   ├── fixtures/       # Test data
│   ├── support/        # Custom commands
│   └── downloads/      # Downloaded files
├── cypress.config.js   # Configuration
└── package.json        # Dependencies
```

## Custom Commands Available
- `cy.login(email, password)` - Login user
- `cy.logout()` - Logout user
- `cy.apiRequest(method, endpoint, body)` - API requests
- `cy.fillForm(formData)` - Fill forms
- `cy.mobileViewport()` - Mobile viewport
- `cy.desktopViewport()` - Desktop viewport
- `cy.waitForElement(selector)` - Wait for element
- `cy.clickByText(text)` - Click by text content

## Environment Variables
Copy `.env.example` to `.env` and configure:
- `CYPRESS_baseUrl` - Application URL
- `CYPRESS_apiUrl` - API base URL
- `CYPRESS_testUser_email` - Test user email
- `CYPRESS_testUser_password` - Test user password

## CI/CD
GitHub Actions workflow included in `.github/workflows/cypress.yml`
- Runs tests on multiple browsers
- Parallel execution
- Artifact upload on failure
- Separate smoke test job

## Best Practices
1. Use `data-cy` attributes for selectors
2. Organize tests by feature/functionality
3. Use fixtures for test data
4. Implement page object pattern for complex pages
5. Keep tests independent and atomic
6. Use custom commands for reusable actions
7. Add proper assertions and error handling
8. Document test cases and expected behavior
