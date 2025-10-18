// Xray-Jira Integration Utilities
// This file contains helper functions for integrating with Xray test management

/**
 * Add Xray test case ID to a test
 * @param {string} testCaseId - The Xray test case ID (e.g., "PROJ-123")
 */
Cypress.Commands.add('xrayTestCase', (testCaseId) => {
  cy.wrap(null, { log: false }).then(() => {
    Cypress.env('xrayTestCaseId', testCaseId)
  })
})

/**
 * Add Xray test execution comment
 * @param {string} comment - Comment to add to test execution
 */
Cypress.Commands.add('xrayComment', (comment) => {
  cy.wrap(null, { log: false }).then(() => {
    const comments = Cypress.env('xrayComments') || []
    comments.push(comment)
    Cypress.env('xrayComments', comments)
  })
})

/**
 * Add Xray test execution evidence (screenshot)
 * @param {string} name - Name for the evidence
 */
Cypress.Commands.add('xrayEvidence', (name) => {
  cy.screenshot(name)
  cy.xrayComment(`Evidence captured: ${name}`)
})

/**
 * Mark test as passed in Xray
 * @param {string} testCaseId - The Xray test case ID
 */
Cypress.Commands.add('xrayPass', (testCaseId) => {
  cy.wrap(null, { log: false }).then(() => {
    Cypress.env('xrayTestResult', 'PASS')
    Cypress.env('xrayTestCaseId', testCaseId)
  })
})

/**
 * Mark test as failed in Xray
 * @param {string} testCaseId - The Xray test case ID
 * @param {string} reason - Reason for failure
 */
Cypress.Commands.add('xrayFail', (testCaseId, reason) => {
  cy.wrap(null, { log: false }).then(() => {
    Cypress.env('xrayTestResult', 'FAIL')
    Cypress.env('xrayTestCaseId', testCaseId)
    cy.xrayComment(`Test failed: ${reason}`)
  })
})

/**
 * Add Xray test step
 * @param {string} step - Test step description
 */
Cypress.Commands.add('xrayStep', (step) => {
  cy.log(`Xray Step: ${step}`)
  cy.xrayComment(`Step: ${step}`)
})

/**
 * Create Xray test execution
 * @param {string} testPlanKey - Test plan key
 * @param {string} summary - Test execution summary
 */
Cypress.Commands.add('xrayCreateExecution', (testPlanKey, summary) => {
  cy.task('xray:createTestExecution', {
    testPlanKey,
    summary,
    description: `Automated test execution created on ${new Date().toISOString()}`,
  })
})

/**
 * Update Xray test execution result
 * @param {string} testExecutionKey - Test execution key
 * @param {string} testCaseId - Test case ID
 * @param {string} status - Test status (PASS, FAIL, EXECUTING, TODO)
 */
Cypress.Commands.add(
  'xrayUpdateResult',
  (testExecutionKey, testCaseId, status) => {
    cy.task('xray:updateTestResult', {
      testExecutionKey,
      testCaseId,
      status,
      comment: Cypress.env('xrayComments')?.join('\n') || '',
      evidence: Cypress.env('xrayEvidence') || [],
    })
  },
)
