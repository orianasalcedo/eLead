# Xray Integration for Cypress Framework

This document explains how to use the Xray integration features in your Cypress test framework.

## Overview

The Xray integration provides seamless connection between your Cypress tests and Xray test management system, allowing you to:

- Track test execution results
- Upload test results to Xray
- Manage test cases and test plans
- Generate comprehensive test reports

## Features

- **Test Case Tracking**: Automatically track test execution with Xray test case IDs
- **Step-by-Step Reporting**: Report individual test steps and their results
- **Automatic Result Upload**: Upload test results to Xray after execution
- **Attachment Support**: Upload screenshots and videos as test evidence
- **Test Status Mapping**: Map Cypress test statuses to Xray statuses
- **Flexible Configuration**: Support for both Xray Cloud and Xray Server

## Setup

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Xray Cloud Configuration
XRAY_CLIENT_ID=your-client-id
XRAY_CLIENT_SECRET=your-client-secret

# Xray Server Configuration (if using Xray Server)
XRAY_USERNAME=your-username
XRAY_PASSWORD=your-password
XRAY_SERVER_URL=https://your-jira-instance.com

# Test Execution Settings
XRAY_TEST_PLAN_KEY=TEST-PLAN-123
XRAY_ENVIRONMENT=Cypress
XRAY_VERSION=1.0
XRAY_REVISION=1

# Upload Settings
XRAY_AUTO_UPLOAD=true
XRAY_UPLOAD_SCREENSHOTS=true
XRAY_UPLOAD_VIDEOS=false
XRAY_MAX_FILE_SIZE=10
```

### 2. Test Case ID Format

Ensure your test cases follow the expected ID format:

- `ELP-1234` (e.g., ELP-4190)
- `TEST-1234` (e.g., TEST-001)
- `TC-1234` (e.g., TC-001)

## Usage

### Basic Test with Xray Integration

```javascript
describe('Address Management', () => {
  it('Dropdown Shows Only Saved Addresses When Admin Addresses Not Configured', () => {
    // Start Xray test tracking
    cy.xrayStartTest(
      'ELP-4190',
      'Dropdown Shows Only Saved Addresses When Admin Addresses Not Configured',
    )

    // Test step 1: Navigate to checkout page
    cy.xrayAddStep(
      'Navigate to checkout page',
      'Checkout page loads successfully',
      true,
    )
    cy.visit('/checkout')
    cy.url().should('include', '/checkout')

    // Test step 2: Verify dropdown is visible
    cy.xrayAddStep(
      'Verify address dropdown is visible',
      'Address dropdown is displayed on the page',
      true,
    )
    cy.get('[data-testid="address-dropdown"]').should('be.visible')

    // Pass the test
    cy.xrayPassTest('All address dropdown functionality working as expected')
  })
})
```

### Available Commands

#### `cy.xrayStartTest(testId, testName)`

Starts tracking a test case in Xray.

**Parameters:**

- `testId` (string): Xray test case ID (e.g., 'ELP-4190')
- `testName` (string): Test name/description

#### `cy.xrayAddStep(description, expectedResult, passed)`

Adds a test step to the current test.

**Parameters:**

- `description` (string): Step description
- `expectedResult` (string): Expected result
- `passed` (boolean): Whether the step passed (default: true)

#### `cy.xrayPassTest(comment)`

Marks the current test as passed.

**Parameters:**

- `comment` (string): Optional comment about the test result

#### `cy.xrayFailTest(error, comment)`

Marks the current test as failed.

**Parameters:**

- `error` (string): Error message or reason for failure
- `comment` (string): Optional comment about the test result

#### `cy.xraySkipTest(reason)`

Marks the current test as skipped.

**Parameters:**

- `reason` (string): Reason for skipping the test

#### `cy.xrayAddAttachment(filename, contentType, data)`

Adds an attachment to the current test.

**Parameters:**

- `filename` (string): Name of the file
- `contentType` (string): MIME type
- `data` (string): File data (base64 encoded)

#### `cy.xrayUploadResults(xrayUrl, clientId, clientSecret)`

Uploads test results to Xray.

**Parameters:**

- `xrayUrl` (string): Xray API URL
- `clientId` (string): Xray client ID
- `clientSecret` (string): Xray client secret

#### `cy.xrayGetResults()`

Gets all test results from the current session.

## Generated Test Files

The CSV to Cypress converter generates test files organized by feature:

### Feature Categories

1. **Xpedite Integration** - Tests for Xpedite shipment and order processing
2. **AAT (Automated Acceptance Testing)** - Automated acceptance testing scenarios
3. **Address Management** - Address dropdown, selection, and management functionality
4. **Tax and Shipping** - Tax calculation, shipping costs, and handling fees
5. **Slideshow Component** - Slideshow carousel functionality and navigation
6. **Product Matching** - Product matching, brand visibility, and supplier integration
7. **Page Management** - Parent/child page creation, editing, and management
8. **Payment Methods** - Payment method configuration and GhostCard functionality
9. **Inventory Management** - Stock availability, inventory updates, and product visibility
10. **Email Notifications** - Order confirmation emails and notification system
11. **Order Processing** - Order creation, confirmation, and transaction processing
12. **UI Display** - UI elements display and user interface functionality
13. **General Features** - General feature tests that don't fit into specific categories

### File Structure

```
cypress/e2e/features/
├── address-management.cy.js
├── tax-and-shipping.cy.js
├── xpedite-integration.cy.js
├── feature-index.cy.js
└── test-summary.json
```

## Running Tests

### Run All Feature Tests

```bash
npx cypress run --spec "cypress/e2e/features/**/*.cy.js"
```

### Run Specific Feature Tests

```bash
npx cypress run --spec "cypress/e2e/features/address-management.cy.js"
```

### Run Tests with Xray Integration

```bash
XRAY_AUTO_UPLOAD=true npx cypress run --spec "cypress/e2e/features/**/*.cy.js"
```

## Test Results

### Local Results

Test results are stored locally and can be accessed using:

```javascript
cy.xrayGetResults().then((results) => {
  console.log('Test Results:', results)
})
```

### Xray Upload

Results can be uploaded to Xray automatically or manually:

```javascript
// Automatic upload (if XRAY_AUTO_UPLOAD=true)
// Results are uploaded automatically after test completion

// Manual upload
cy.xrayUploadResults(
  'https://your-xray-instance.com',
  'your-client-id',
  'your-client-secret',
)
```

## Configuration

### Xray Cloud vs Xray Server

The integration supports both Xray Cloud and Xray Server:

**Xray Cloud:**

- Uses OAuth 2.0 authentication
- Requires client ID and client secret
- Base URL: `https://xray.cloud.getxray.app/api/v2`

**Xray Server:**

- Uses basic authentication
- Requires username and password
- Base URL: Your Jira instance URL

### Custom Configuration

You can customize the configuration by modifying `cypress/support/xray-config.js`:

```javascript
const xrayConfig = {
  // Your custom configuration
  execution: {
    keyPrefix: 'CUSTOM-EXEC',
    environment: 'Staging',
    version: '2.0',
  },
}
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your client ID and client secret (Xray Cloud)
   - Verify your username and password (Xray Server)
   - Check if your Xray instance URL is correct

2. **Test Case ID Not Found**
   - Ensure test case IDs follow the expected format
   - Verify test cases exist in Xray
   - Check if test cases are in the correct project

3. **Upload Failures**
   - Check network connectivity
   - Verify Xray API permissions
   - Check file size limits for attachments

### Debug Mode

Enable debug mode by setting:

```bash
DEBUG=xray:* npx cypress run
```

## Best Practices

1. **Test Case Naming**: Use descriptive test case names that match your Xray test cases
2. **Step Documentation**: Document each test step clearly with expected results
3. **Error Handling**: Always handle errors gracefully and provide meaningful error messages
4. **Attachment Management**: Be mindful of file sizes when uploading attachments
5. **Test Organization**: Organize tests by feature for better maintainability

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the Xray API documentation
3. Check Cypress documentation for command usage
4. Contact your Xray administrator for API access issues
