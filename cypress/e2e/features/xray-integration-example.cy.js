/**
 * Example Test with Xray Integration
 * Demonstrates how to use Xray integration commands in Cypress tests
 */

describe('Xray Integration Example', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Example test with Xray integration - Address Dropdown Functionality', () => {
    // Start Xray test tracking
    cy.xrayStartTest('ELP-4190', 'Dropdown Shows Only Saved Addresses When Admin Addresses Not Configured');
    
    // Test step 1: Navigate to checkout page
    cy.xrayAddStep(
      'Navigate to checkout page',
      'Checkout page loads successfully',
      true
    );
    cy.visit('/checkout');
    cy.url().should('include', '/checkout');
    
    // Test step 2: Verify dropdown is visible
    cy.xrayAddStep(
      'Verify address dropdown is visible',
      'Address dropdown is displayed on the page',
      true
    );
    cy.get('[data-testid="address-dropdown"]').should('be.visible');
    
    // Test step 3: Click on dropdown to open it
    cy.xrayAddStep(
      'Click on address dropdown to open it',
      'Dropdown opens and shows available addresses',
      true
    );
    cy.get('[data-testid="address-dropdown"]').click();
    cy.get('[data-testid="address-dropdown"] .dropdown-item').should('be.visible');
    
    // Test step 4: Verify only saved addresses are shown
    cy.xrayAddStep(
      'Verify only saved addresses are shown (no admin addresses)',
      'All displayed addresses are saved addresses, no admin addresses visible',
      true
    );
    cy.get('[data-testid="address-dropdown"] .dropdown-item')
      .should('have.length.greaterThan', 0)
      .each(($item) => {
        cy.wrap($item).should('not.have.class', 'admin-address');
      });
    
    // Test step 5: Verify no admin address indicator
    cy.xrayAddStep(
      'Verify no admin address indicator is present',
      'No admin address indicator is displayed',
      true
    );
    cy.get('[data-testid="admin-address-indicator"]').should('not.exist');
    
    // Add screenshot as evidence
    cy.screenshot('address-dropdown-test', { capture: 'fullPage' });
    
    // Pass the test
    cy.xrayPassTest('All address dropdown functionality working as expected');
  });

  it('Example test with Xray integration - Test Failure Scenario', () => {
    // Start Xray test tracking
    cy.xrayStartTest('ELP-4189', 'Dropdown Hidden If Show Saved Addresses Disabled And No Admin Addresses');
    
    // Test step 1: Navigate to checkout page
    cy.xrayAddStep(
      'Navigate to checkout page',
      'Checkout page loads successfully',
      true
    );
    cy.visit('/checkout');
    
    // Test step 2: Verify dropdown is hidden (this might fail)
    cy.xrayAddStep(
      'Verify dropdown is hidden when feature is disabled',
      'Address dropdown is not visible on the page',
      false // This step fails
    );
    
    // This will fail if dropdown is visible
    cy.get('[data-testid="address-dropdown"]').should('not.be.visible');
    
    // If we reach here, the test passes
    cy.xrayPassTest('Dropdown correctly hidden when feature disabled');
  });

  it('Example test with Xray integration - Skipped Test', () => {
    // Start Xray test tracking
    cy.xrayStartTest('ELP-4179', 'Continue Enabled After Selecting Address');
    
    // Skip this test due to some condition
    cy.xraySkipTest('Test skipped due to environment configuration');
  });

  after(() => {
    // Get all test results
    cy.xrayGetResults().then((results) => {
      cy.log('Test Results Summary:');
      results.forEach((result, testId) => {
        cy.log(`${testId}: ${result.status} (${result.duration}ms)`);
      });
    });
    
    // Example of uploading results to Xray (commented out)
    // cy.xrayUploadResults(
    //   'https://your-xray-instance.com',
    //   'your-client-id',
    //   'your-client-secret'
    // );
  });
});
