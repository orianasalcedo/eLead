#!/usr/bin/env node

/**
 * Xray Test Migration Helper
 * This script helps migrate existing Xray tests to Cypress format
 */

const fs = require('fs')
const path = require('path')

// Example Xray test data structure
const xrayTestData = {
  testCases: [
    {
      id: 'PROJ-001',
      summary: 'User Login with Valid Credentials',
      description: 'Verify that users can login with valid email and password',
      steps: [
        'Navigate to login page',
        'Enter valid email address',
        'Enter valid password',
        'Click login button',
        'Verify successful login'
      ],
      expectedResult: 'User should be logged in and redirected to dashboard'
    },
    {
      id: 'PROJ-002',
      summary: 'User Login with Invalid Credentials',
      description: 'Verify that users cannot login with invalid credentials',
      steps: [
        'Navigate to login page',
        'Enter invalid email address',
        'Enter invalid password',
        'Click login button',
        'Verify error message is displayed'
      ],
      expectedResult: 'Error message should be displayed'
    }
  ]
}

/**
 * Generate Cypress test file from Xray test case
 */
function generateCypressTest(testCase) {
  const testName = testCase.summary.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ')
  
  return `// Generated from Xray test case: ${testCase.id}
describe('${testCase.summary}', () => {
  it('${testName} - ${testCase.id}', () => {
    // Link to Xray test case
    cy.xrayTestCase('${testCase.id}')
    
    // Test steps
${testCase.steps.map((step, index) => `    cy.xrayStep('${step}')
    // TODO: Implement step ${index + 1}`).join('\n')}
    
    // Expected result: ${testCase.expectedResult}
    
    // Mark test as passed (update based on actual test result)
    cy.xrayPass('${testCase.id}')
  })
})
`
}

/**
 * Generate test mapping document
 */
function generateTestMapping(testCases) {
  let mapping = '# Xray Test Case Mapping\n\n'
  mapping += '| Test Case ID | Summary | Cypress File | Status |\n'
  mapping += '|--------------|---------|--------------|--------|\n'
  
  testCases.forEach(testCase => {
    const fileName = testCase.summary.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
    mapping += `| ${testCase.id} | ${testCase.summary} | ${fileName}.cy.js | TODO |\n`
  })
  
  return mapping
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Xray Test Migration Helper')
  console.log('=============================\n')
  
  // Generate test files
  console.log('📝 Generating Cypress test files...')
  testCases.forEach(testCase => {
    const testContent = generateCypressTest(testCase)
    const fileName = testCase.summary.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')
    const filePath = path.join('cypress', 'e2e', 'xray-migrated', `${fileName}.cy.js`)
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(filePath, testContent)
    console.log(`✅ Generated: ${filePath}`)
  })
  
  // Generate mapping document
  console.log('\n📋 Generating test mapping document...')
  const mapping = generateTestMapping(testCases)
  fs.writeFileSync('XRAY_TEST_MAPPING.md', mapping)
  console.log('✅ Generated: XRAY_TEST_MAPPING.md')
  
  console.log('\n🎉 Migration helper completed!')
  console.log('\nNext steps:')
  console.log('1. Review generated test files')
  console.log('2. Implement actual test logic')
  console.log('3. Update test mapping document')
  console.log('4. Run tests to verify integration')
}

// Export for use in other scripts
module.exports = {
  generateCypressTest,
  generateTestMapping,
  xrayTestData
}

// Run if called directly
if (require.main === module) {
  const { testCases } = xrayTestData
  main()
}
