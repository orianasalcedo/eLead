# Xray-Jira Integration Guide

## Overview
This guide explains how to integrate your Cypress tests with Xray test management in Jira.

## Setup

### 1. Install Dependencies
```bash
npm install --save-dev @csvtuda/cypress-xray-plugin
```

### 2. Configure Environment Variables
Add these to your `.env` file:

```bash
# Xray-Jira Integration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USERNAME=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=PROJ
JIRA_TEST_PLAN_KEY=PROJ-123
JIRA_TEST_EXECUTION_KEY=PROJ-456
```

### 3. Get Jira API Token
1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a name and copy the token
4. Add it to your environment variables

## Usage in Tests

### Basic Test Case Linking
```javascript
it('should login with valid credentials - PROJ-001', () => {
  // Link to Xray test case
  cy.xrayTestCase('PROJ-001')
  
  // Your test steps here
  cy.visit('/login')
  cy.login('user@example.com', 'password')
  
  // Mark test as passed
  cy.xrayPass('PROJ-001')
})
```

### Test Steps and Comments
```javascript
it('should create new user - PROJ-002', () => {
  cy.xrayTestCase('PROJ-002')
  
  cy.xrayStep('Navigate to registration page')
  cy.visit('/register')
  
  cy.xrayStep('Fill registration form')
  cy.fillForm({
    'first-name': 'John',
    'last-name': 'Doe',
    'email': 'john@example.com',
    'password': 'password123'
  })
  
  cy.xrayStep('Submit registration form')
  cy.get('[data-cy="register-button"]').click()
  
  cy.xrayStep('Verify success message')
  cy.get('[data-cy="success-message"]').should('contain', 'Registration successful')
  
  cy.xrayPass('PROJ-002')
})
```

### Error Handling and Evidence
```javascript
it('should handle API error - PROJ-003', () => {
  cy.xrayTestCase('PROJ-003')
  
  cy.xrayStep('Make API request that will fail')
  cy.apiRequest('GET', '/api/nonexistent')
    .then((response) => {
      expect(response.status).to.eq(404)
    })
  
  // Capture evidence
  cy.xrayEvidence('api-error-screenshot')
  
  cy.xrayPass('PROJ-003')
})
```

### Test Failure Handling
```javascript
it('should fail gracefully - PROJ-004', () => {
  cy.xrayTestCase('PROJ-004')
  
  try {
    cy.xrayStep('Attempt to access restricted page')
    cy.visit('/admin')
    
    cy.xrayStep('Verify access is denied')
    cy.url().should('include', '/login')
    
    cy.xrayPass('PROJ-004')
  } catch (error) {
    cy.xrayFail('PROJ-004', `Test failed: ${error.message}`)
    throw error
  }
})
```

## Available Commands

### Core Commands
- `cy.xrayTestCase(testCaseId)` - Link test to Xray test case
- `cy.xrayStep(step)` - Add test step description
- `cy.xrayComment(comment)` - Add comment to test execution
- `cy.xrayEvidence(name)` - Capture screenshot evidence
- `cy.xrayPass(testCaseId)` - Mark test as passed
- `cy.xrayFail(testCaseId, reason)` - Mark test as failed

### Advanced Commands
- `cy.xrayCreateExecution(testPlanKey, summary)` - Create new test execution
- `cy.xrayUpdateResult(testExecutionKey, testCaseId, status)` - Update test result

## Test Case Naming Convention

### Recommended Format
```javascript
it('should [action] [condition] - [TEST-CASE-ID]', () => {
  // Test implementation
})
```

### Examples
```javascript
it('should login with valid credentials - PROJ-001', () => {})
it('should show error with invalid email - PROJ-002', () => {})
it('should redirect to dashboard after login - PROJ-003', () => {})
```

## CI/CD Integration

### GitHub Actions
Add Xray environment variables to your GitHub secrets:

```yaml
env:
  JIRA_BASE_URL: ${{ secrets.JIRA_BASE_URL }}
  JIRA_USERNAME: ${{ secrets.JIRA_USERNAME }}
  JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
  JIRA_PROJECT_KEY: ${{ secrets.JIRA_PROJECT_KEY }}
```

### Test Execution Workflow
1. Tests run with Xray integration
2. Results are automatically sent to Xray
3. Test execution is updated in Jira
4. Screenshots and evidence are attached
5. Test reports are generated

## Best Practices

### 1. Test Case Organization
- Use consistent test case IDs
- Group related tests in the same test plan
- Use descriptive test case names

### 2. Evidence Collection
- Capture screenshots for key steps
- Add comments for important decisions
- Document any deviations from expected behavior

### 3. Error Handling
- Always mark tests as pass/fail
- Provide meaningful failure reasons
- Capture evidence for failures

### 4. Test Data Management
- Use fixtures for test data
- Keep test data consistent with Xray test cases
- Document test data requirements

## Troubleshooting

### Common Issues
1. **API Token Issues**: Ensure your API token has proper permissions
2. **Test Case Not Found**: Verify test case IDs exist in Jira
3. **Connection Issues**: Check Jira base URL and network connectivity

### Debug Mode
Enable debug logging by setting:
```bash
CYPRESS_DEBUG=xray:*
```

## Migration from Existing Tests

### Step 1: Identify Test Cases
Map your existing tests to Xray test cases:
- Review existing test documentation
- Identify test case IDs in Jira
- Create mapping document

### Step 2: Update Test Files
1. Add `cy.xrayTestCase()` calls
2. Add `cy.xrayStep()` for key actions
3. Add `cy.xrayPass()` or `cy.xrayFail()` calls
4. Add evidence capture where needed

### Step 3: Validate Integration
1. Run tests locally
2. Check Xray for test results
3. Verify evidence is captured
4. Test CI/CD integration

## Support

For issues with Xray integration:
1. Check the [plugin documentation](https://www.npmjs.com/package/@csvtuda/cypress-xray-plugin)
2. Review Jira API permissions
3. Verify environment configuration
4. Check network connectivity to Jira
