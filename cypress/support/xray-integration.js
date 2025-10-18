/**
 * Xray Integration Helper for Cypress Tests
 * Provides utilities for integrating with Xray test management
 */

class XrayIntegration {
  constructor() {
    this.testResults = new Map();
    this.currentTestId = null;
    this.testStartTime = null;
  }

  /**
   * Start tracking a test case
   * @param {string} testId - Xray test case ID (e.g., ELP-4190)
   * @param {string} testName - Test name
   */
  startTest(testId, testName) {
    this.currentTestId = testId;
    this.testStartTime = new Date();
    
    cy.log(`Starting Xray Test: ${testId} - ${testName}`);
    
    // Store test metadata
    this.testResults.set(testId, {
      testId,
      testName,
      startTime: this.testStartTime,
      status: 'RUNNING',
      steps: [],
      attachments: []
    });
  }

  /**
   * Add a test step
   * @param {string} stepDescription - Description of the step
   * @param {string} expectedResult - Expected result
   * @param {boolean} passed - Whether the step passed
   */
  addTestStep(stepDescription, expectedResult, passed = true) {
    if (!this.currentTestId) {
      cy.log('Warning: No active test. Call startTest() first.');
      return;
    }

    const testData = this.testResults.get(this.currentTestId);
    testData.steps.push({
      description: stepDescription,
      expectedResult,
      passed,
      timestamp: new Date()
    });

    cy.log(`Step: ${stepDescription} - ${passed ? 'PASSED' : 'FAILED'}`);
  }

  /**
   * Mark test as passed
   * @param {string} comment - Optional comment
   */
  passTest(comment = '') {
    this.finishTest('PASSED', comment);
  }

  /**
   * Mark test as failed
   * @param {string} error - Error message or reason for failure
   * @param {string} comment - Optional comment
   */
  failTest(error, comment = '') {
    this.finishTest('FAILED', comment, error);
  }

  /**
   * Mark test as skipped
   * @param {string} reason - Reason for skipping
   */
  skipTest(reason = '') {
    this.finishTest('SKIPPED', reason);
  }

  /**
   * Finish the current test
   * @param {string} status - Test status (PASSED, FAILED, SKIPPED)
   * @param {string} comment - Optional comment
   * @param {string} error - Optional error message
   */
  finishTest(status, comment = '', error = '') {
    if (!this.currentTestId) {
      cy.log('Warning: No active test to finish.');
      return;
    }

    const testData = this.testResults.get(this.currentTestId);
    testData.status = status;
    testData.endTime = new Date();
    testData.duration = testData.endTime - testData.startTime;
    testData.comment = comment;
    testData.error = error;

    cy.log(`Finished Xray Test: ${this.currentTestId} - ${status}`);
    
    // Reset current test
    this.currentTestId = null;
    this.testStartTime = null;
  }

  /**
   * Add attachment to current test
   * @param {string} filename - Name of the file
   * @param {string} contentType - MIME type
   * @param {string} data - File data (base64 encoded)
   */
  addAttachment(filename, contentType, data) {
    if (!this.currentTestId) {
      cy.log('Warning: No active test. Call startTest() first.');
      return;
    }

    const testData = this.testResults.get(this.currentTestId);
    testData.attachments.push({
      filename,
      contentType,
      data,
      timestamp: new Date()
    });

    cy.log(`Added attachment: ${filename}`);
  }

  /**
   * Get all test results
   * @returns {Map} Map of test results
   */
  getAllResults() {
    return this.testResults;
  }

  /**
   * Get results for a specific test
   * @param {string} testId - Test ID
   * @returns {Object} Test result data
   */
  getTestResult(testId) {
    return this.testResults.get(testId);
  }

  /**
   * Generate Xray-compatible test execution report
   * @returns {Object} Test execution report
   */
  generateExecutionReport() {
    const results = Array.from(this.testResults.values());
    
    return {
      testExecutionKey: `EXEC-${Date.now()}`,
      info: {
        summary: 'Cypress Test Execution',
        description: 'Automated test execution from Cypress',
        version: '1.0',
        user: 'cypress-automation',
        revision: '1',
        startDate: new Date().toISOString(),
        finishDate: new Date().toISOString()
      },
      tests: results.map(test => ({
        testKey: test.testId,
        status: test.status,
        comment: test.comment || '',
        executedBy: 'cypress-automation',
        executedOn: test.endTime?.toISOString() || new Date().toISOString(),
        duration: test.duration || 0,
        steps: test.steps.map(step => ({
          status: step.passed ? 'PASSED' : 'FAILED',
          comment: step.description,
          actualResult: step.expectedResult
        })),
        defects: test.error ? [test.error] : [],
        evidence: test.attachments.map(att => ({
          filename: att.filename,
          contentType: att.contentType,
          data: att.data
        }))
      }))
    };
  }

  /**
   * Upload test results to Xray
   * @param {string} xrayUrl - Xray API URL
   * @param {string} clientId - Xray client ID
   * @param {string} clientSecret - Xray client secret
   */
  async uploadToXray(xrayUrl, clientId, clientSecret) {
    const report = this.generateExecutionReport();
    
    try {
      const response = await cy.request({
        method: 'POST',
        url: `${xrayUrl}/api/v2/import/execution`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getXrayToken(clientId, clientSecret)}`
        },
        body: report
      });

      cy.log(`Test results uploaded to Xray: ${response.body.testExecutionKey}`);
      return response.body;
    } catch (error) {
      cy.log(`Failed to upload to Xray: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get Xray authentication token
   * @param {string} clientId - Xray client ID
   * @param {string} clientSecret - Xray client secret
   * @returns {string} Authentication token
   */
  async getXrayToken(clientId, clientSecret) {
    const response = await cy.request({
      method: 'POST',
      url: 'https://xray.cloud.getxray.app/api/v2/authenticate',
      body: {
        client_id: clientId,
        client_secret: clientSecret
      }
    });

    return response.body;
  }
}

// Create global instance
const xrayIntegration = new XrayIntegration();

// Make it available globally
Cypress.Commands.add('xrayStartTest', (testId, testName) => {
  xrayIntegration.startTest(testId, testName);
});

Cypress.Commands.add('xrayAddStep', (description, expectedResult, passed = true) => {
  xrayIntegration.addTestStep(description, expectedResult, passed);
});

Cypress.Commands.add('xrayPassTest', (comment = '') => {
  xrayIntegration.passTest(comment);
});

Cypress.Commands.add('xrayFailTest', (error, comment = '') => {
  xrayIntegration.failTest(error, comment);
});

Cypress.Commands.add('xraySkipTest', (reason = '') => {
  xrayIntegration.skipTest(reason);
});

Cypress.Commands.add('xrayAddAttachment', (filename, contentType, data) => {
  xrayIntegration.addAttachment(filename, contentType, data);
});

Cypress.Commands.add('xrayUploadResults', (xrayUrl, clientId, clientSecret) => {
  return xrayIntegration.uploadToXray(xrayUrl, clientId, clientSecret);
});

Cypress.Commands.add('xrayGetResults', () => {
  return xrayIntegration.getAllResults();
});

// Export for use in other files
module.exports = XrayIntegration;
