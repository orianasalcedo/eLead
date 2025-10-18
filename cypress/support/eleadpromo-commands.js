/**
 * eLead Promo Domain-Specific Custom Commands
 * Rule 04: Custom Commands
 * 
 * These commands are specific to eLead Promo business logic
 */

/**
 * Login to eLead Promo and get auth tokens
 * @param {string} email - Customer email
 * @param {string} password - Customer password
 */
Cypress.Commands.add('eleadpromoLogin', (email, password) => {
  const signinData = {
    customer: {
      email,
      password,
    },
  }

  return cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData).then((response) => {
    if (response.status === 200) {
      // Store auth headers for subsequent requests
      cy.wrap(response.headers['access-token']).as('accessToken')
      cy.wrap(response.headers['client']).as('client')
      cy.wrap(response.headers['uid']).as('uid')
      cy.wrap(response.headers['token-type']).as('tokenType')
      cy.wrap(response.headers['expiry']).as('expiry')

      cy.log('✅ eLead Promo login successful')
      return cy.wrap(response)
    } else {
      throw new Error(`Login failed with status ${response.status}`)
    }
  })
})

/**
 * Make an authenticated API request
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional options
 */
Cypress.Commands.add(
  'authenticatedApiRequest',
  (method, endpoint, body = null, options = {}) => {
    return cy.get('@accessToken').then((accessToken) => {
      const authHeaders = {
        'access-token': accessToken,
        client: Cypress.env('client'),
        uid: Cypress.env('uid'),
        'token-type': Cypress.env('tokenType') || 'Bearer',
      }

      return cy.apiRequest(method, endpoint, body, {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
      })
    })
  }
)

/**
 * Get real country and state IDs from API
 * Stores realCountryId and realStateId as aliases
 */
Cypress.Commands.add('getRealCountryAndState', () => {
  return cy.get('@accessToken').then((accessToken) => {
    const authHeaders = {
      'access-token': accessToken,
      client: Cypress.env('client'),
      uid: Cypress.env('uid'),
    }

    return cy
      .apiRequest('GET', '/api/v1/countries', null, { headers: authHeaders })
      .then((response) => {
        if (response.status === 200 && response.body.data && response.body.data.length > 0) {
          const countryId = response.body.data[0].id
          cy.wrap(countryId).as('realCountryId')
          cy.log(`✅ Using real country ID: ${countryId}`)

          return cy
            .apiRequest('GET', `/api/v1/countries/${countryId}/states`, null, {
              headers: authHeaders,
            })
            .then((statesResponse) => {
              if (
                statesResponse.status === 200 &&
                statesResponse.body.data &&
                statesResponse.body.data.length > 0
              ) {
                const stateId = statesResponse.body.data[0].id
                cy.wrap(stateId).as('realStateId')
                cy.log(`✅ Using real state ID: ${stateId}`)
                return cy.wrap({ countryId, stateId })
              } else {
                throw new Error('No states available')
              }
            })
        } else {
          throw new Error('No countries available')
        }
      })
  })
})

/**
 * Logout from eLead Promo
 */
Cypress.Commands.add('logout', () => {
  // Navigate to logout or clear session
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.visit('/login')
})

/**
 * Custom command for data-cy selectors
 * @param {string} id - data-cy attribute value
 */
Cypress.Commands.add('dataCy', (id) => {
  return cy.get(`[data-cy="${id}"]`)
})

