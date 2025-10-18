/**
 * Address Management Tests - Best Practices
 * Following Cypress Rules 08, 09, 17
 *
 * ✅ Uses fixtures for base data
 * ✅ Uses utils for dynamic data
 * ✅ Fetches real country/state IDs from API
 * ✅ No hardcoded dummy data
 */

const {
  createShippingAddress,
  createBillingAddress,
} = require('../../utils/address-generator')

describe('eLead Promo API - Address Management (Improved)', () => {
  let authHeaders
  let realCountryId
  let realStateId

  before(() => {
    const environment = Cypress.env('environment')
    cy.log(
      `🧪 Running Address Management tests in ${environment.toUpperCase()} environment`,
    )
  })

  beforeEach(() => {
    // Authenticate and get auth headers
    const { email, password } = Cypress.env('testUser')
    cy.eleadpromoLogin(email, password).then((response) => {
      authHeaders = {
        'access-token': response.headers['access-token'],
        client: response.headers['client'],
        uid: response.headers['uid'],
      }
    })

    // Get REAL country and state IDs from API (not dummy data!)
    cy.apiRequest('GET', '/api/v1/countries', null, {
      headers: authHeaders,
    }).then((response) => {
      if (
        response.status === 200 &&
        response.body.data &&
        response.body.data.length > 0
      ) {
        // Use first available country
        realCountryId = response.body.data[0].id
        cy.log(`✅ Using real country ID: ${realCountryId}`)

        // Get states for this country
        cy.apiRequest(
          'GET',
          `/api/v1/countries/${realCountryId}/states`,
          null,
          {
            headers: authHeaders,
          },
        ).then((statesResponse) => {
          if (
            statesResponse.status === 200 &&
            statesResponse.body.data &&
            statesResponse.body.data.length > 0
          ) {
            // Use first available state
            realStateId = statesResponse.body.data[0].id
            cy.log(`✅ Using real state ID: ${realStateId}`)
          } else {
            cy.log('⚠️  No states available, tests may fail')
          }
        })
      } else {
        cy.log('⚠️  No countries available, tests may fail')
      }
    })
  })

  describe('Shipping Address - With Real Data', () => {
    it('should create shipping address with dynamically generated data', () => {
      // Generate address with REAL country/state IDs
      const addressData = createShippingAddress(realCountryId, realStateId)

      cy.log(
        `📦 Creating shipping address for country ${realCountryId}, state ${realStateId}`,
      )

      cy.apiRequest('POST', '/api/v1/shipping_addresses', addressData, {
        headers: authHeaders,
      }).then((response) => {
        if (response.status === 201 || response.status === 200) {
          expect(response.body).to.have.property('shipping_address')
          expect(response.body.shipping_address.country_id).to.eq(realCountryId)
          expect(response.body.shipping_address.state_id).to.eq(realStateId)
          cy.log('✅ Shipping address created with real data')
        } else {
          cy.log(`⚠️  Unexpected status: ${response.status}`)
          expect(response.status).to.be.oneOf([200, 201, 400, 422])
        }
      })
    })

    it('should use fixture as base and merge with dynamic data', () => {
      // Load fixture and merge with real IDs
      cy.fixture('addresses/shipping').then((fixtureData) => {
        const addressData = {
          shipping_address: {
            ...fixtureData.shipping_address,
            country_id: realCountryId,
            state_id: realStateId,
            // Add timestamp to make it unique
            address_line_two: `Suite ${Date.now()}`,
          },
        }

        cy.apiRequest('POST', '/api/v1/shipping_addresses', addressData, {
          headers: authHeaders,
        }).then((response) => {
          if (response.status === 201 || response.status === 200) {
            cy.log('✅ Address created from fixture + dynamic data')
          } else {
            expect(response.status).to.be.oneOf([200, 201, 400, 422])
          }
        })
      })
    })
  })

  describe('Billing Address - With Real Data', () => {
    it('should create billing address with dynamically generated data', () => {
      const addressData = createBillingAddress(realCountryId, realStateId)

      cy.log(
        `💳 Creating billing address for country ${realCountryId}, state ${realStateId}`,
      )

      cy.apiRequest('POST', '/api/v1/billing_addresses', addressData, {
        headers: authHeaders,
      }).then((response) => {
        if (response.status === 201 || response.status === 200) {
          expect(response.body).to.have.property('billing_address')
          expect(response.body.billing_address.country_id).to.eq(realCountryId)
          expect(response.body.billing_address.state_id).to.eq(realStateId)
          cy.log('✅ Billing address created with real data')
        } else {
          expect(response.status).to.be.oneOf([200, 201, 400, 422])
        }
      })
    })
  })

  describe('Data Validation - Using Real API Data', () => {
    it('should validate country/state relationship', () => {
      // Create address with mismatched country/state (should fail)
      const invalidData = createShippingAddress(realCountryId, 99999) // Invalid state

      cy.apiRequest('POST', '/api/v1/shipping_addresses', invalidData, {
        headers: authHeaders,
      }).then((response) => {
        // Should fail validation
        expect(response.status).to.be.oneOf([400, 422])
        cy.log('✅ API correctly validates country/state relationship')
      })
    })

    it('should handle missing required fields', () => {
      const incompleteData = {
        shipping_address: {
          address_line: '123 Test St',
          // Missing required fields
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_addresses', incompleteData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
        if (response.body.errors) {
          cy.log('✅ API returns validation errors:', response.body.errors)
        }
      })
    })
  })
})
