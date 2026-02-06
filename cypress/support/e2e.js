import 'cypress-mochawesome-reporter/register'
import './commands'
// Optional: cypress-grep
// require('cypress-grep')()
// Optional: cypress-axe
// import 'cypress-axe'

// Cypress automatically clears cookies and localStorage between tests
// No need for manual cleanup in beforeEach

// Disable uncaught exception handling for React errors
Cypress.on('uncaught:exception', (err) => {
  // Don't fail tests on React errors
  if (
    err.message.includes('Minified React error') ||
    err.message.includes('React error') ||
    err.message.includes('418')
  ) {
    return false
  }
  // Don't fail tests on network errors
  if (err.message.includes('Network Error') || err.message.includes('fetch')) {
    return false
  }
  // Don't fail tests on ResizeObserver errors
  if (err.message.includes('ResizeObserver')) {
    return false
  }
  return true
})
