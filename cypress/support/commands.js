Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password }).then(
    ({ body }) => {
      window.localStorage.setItem('token', body.token)
    },
  )
})

Cypress.Commands.add('dataTest', (id) => cy.get(`[data-testid="${id}"]`))

// Clear session data to simulate fresh visits
Cypress.Commands.add('clearSessionData', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.log('🧹 Session data cleared - simulating fresh visit')
})

// Smart modal handler - Only handles modal on homepage
Cypress.Commands.add('handleWelcomeModalIfPresent', () => {
  cy.url().then((currentUrl) => {
    if (currentUrl.includes(Cypress.config('baseUrl')) && !currentUrl.includes('/login') && !currentUrl.includes('/forgot-password')) {
      cy.log('🏠 On homepage, checking for welcome modal')
      cy.handleWelcomeModal()
    } else {
      cy.log('ℹ️ Not on homepage, skipping modal check')
    }
  })
})

// Smart session clearing - Only when needed
Cypress.Commands.add('clearSessionDataIfNeeded', (shouldClear = true) => {
  if (shouldClear) {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.log('🧹 Session data cleared - simulating fresh visit')
  } else {
    cy.log('ℹ️ Skipping session data clearing')
  }
})

// Welcome modal handler - Based on specifications
Cypress.Commands.add('handleWelcomeModal', () => {
  cy.get('body').then(($body) => {
    // Check for welcome modal with "Start Shopping" button
    if ($body.text().includes('Start Shopping')) {
      cy.log('Welcome modal detected, clicking "Start Shopping"')
      cy.contains('Start Shopping').click({ force: true })
      cy.wait(1000) // Wait for modal to fully close
    } else {
      cy.log('No welcome modal found - continuing')
    }
  })
})

// Robust welcome modal handler - Optional modal handling
Cypress.Commands.add('handleWelcomeModalOptional', () => {
  cy.get('body').then(($body) => {
    // Check for welcome modal with "Start Shopping" button
    if ($body.text().includes('Start Shopping')) {
      cy.log('Welcome modal detected, clicking "Start Shopping"')
      cy.contains('Start Shopping').click({ force: true })
      cy.wait(1000) // Wait for modal to fully close
    } else {
      cy.log('No welcome modal found - continuing without modal handling')
    }
  })
})

// Safe welcome modal handler - Never fails, always continues
Cypress.Commands.add('handleWelcomeModalSafe', () => {
  cy.get('body', { timeout: 3000 }).then(($body) => {
    try {
      // Check for welcome modal with "Start Shopping" button
      if ($body.text().includes('Start Shopping')) {
        cy.log('Welcome modal detected, clicking "Start Shopping"')
        cy.contains('Start Shopping').click({ force: true })
        cy.wait(1000) // Wait for modal to fully close
      } else {
        cy.log('No welcome modal found - continuing')
      }
    } catch (error) {
      cy.log('Modal handling skipped due to error - continuing')
    }
  })
})

// Minimal welcome modal handler - Just logs and continues
Cypress.Commands.add('handleWelcomeModalMinimal', () => {
  cy.log('Checking for welcome modal...')
  cy.get('body').then(($body) => {
    if ($body.text().includes('Start Shopping')) {
      cy.log('Welcome modal found, handling it')
      cy.contains('Start Shopping').click({ force: true })
      cy.wait(1000)
    } else {
      cy.log('No welcome modal - continuing normally')
    }
  })
})

// Global modal handler - Updated based on welcome modal specifications
Cypress.Commands.add('dismissModal', () => {
  cy.get('body').then(($body) => {
    // Check for welcome modal with "Start Shopping" button first
    if ($body.text().includes('Start Shopping')) {
      cy.log('Dismissing welcome modal with "Start Shopping"')
      cy.contains('Start Shopping').click({ force: true })
      cy.wait(1000)
    }
    // Check for modal overlay (clicking outside to close)
    else if ($body.find('[role="button"][tabindex="0"]').length > 0) {
      cy.log('Dismissing modal overlay by clicking outside')
      cy.get('[role="button"][tabindex="0"]').first().click({ force: true })
      cy.wait(1000)
    }
    // Check for any modal with close button
    else if ($body.find('[aria-label*="close"], [aria-label*="Close"], .close, .modal-close').length > 0) {
      cy.log('Dismissing modal with close button')
      cy.get('[aria-label*="close"], [aria-label*="Close"], .close, .modal-close').first().click({ force: true })
      cy.wait(1000)
    }
    // Check for any overlay that might be blocking
    else if ($body.find('.fixed, .overlay, .modal').length > 0) {
      cy.log('Dismissing generic modal/overlay')
      cy.get('.fixed, .overlay, .modal').first().click({ force: true })
      cy.wait(1000)
    }
    else {
      cy.log('No modal detected - continuing')
    }
  })
})
