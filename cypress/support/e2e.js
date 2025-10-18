import 'cypress-mochawesome-reporter/register'
import './commands'
import './eleadpromo-commands' // ✅ Domain-specific commands
// Optional: cypress-grep
// require('cypress-grep')()
// Optional: cypress-axe
// import 'cypress-axe'

beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

// Optional: fail on console errors
// DISABLED - Causes issues with API tests
// Cypress.on('window:before:load', (win) => {
//   cy.stub(win.console, 'error').as('consoleError')
// })
// afterEach(() => {
//   cy.get('@consoleError').then((stub) => {
//     if (stub && stub.callCount > 0) {
//       throw new Error(`Console errors detected: ${stub.callCount}`)
//     }
//   })
// })
