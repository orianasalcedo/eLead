/**
 * eLead Promo API - Address Management Tests
 * Comprehensive tests for address-related endpoints
 */

describe('eLead Promo API - Address Management Tests', () => {
  let authHeaders

  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')

    // Set environment
    const environment = Cypress.env('environment')
    cy.log(
      `🧪 Running Address Management tests in ${environment.toUpperCase()} environment`,
    )

    // Sign in to get auth headers for authenticated endpoints
    const signinData = {
      customer: {
        email: Cypress.env('testUser').email,
        password: Cypress.env('testUser').password,
      },
    }

    cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData).then(
      (response) => {
        authHeaders = {
          'access-token': response.headers['access-token'],
          client: response.headers['client'],
          uid: response.headers['uid'],
        }
      },
    )
  })

  describe('Countries and States', () => {
    it('should get countries list', () => {
      cy.apiRequest('GET', '/api/v1/countries', null, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('countries')
        expect(response.body.countries).to.be.an('array')
        expect(response.body.countries.length).to.be.greaterThan(0)
        cy.log('✅ Countries list retrieved successfully')
        cy.log(`Found ${response.body.countries.length} countries`)

        // Verify structure of country objects
        const country = response.body.countries[0]
        expect(country).to.have.property('id')
        expect(country).to.have.property('name')
      })
    })

    it('should get states for a specific country', () => {
      cy.apiRequest('GET', '/api/v1/states?country_id=1', null, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        cy.log('✅ States list retrieved successfully')
        cy.log(`Found ${response.body.length} states for country ID 1`)

        // Verify structure of state objects
        const state = response.body[0]
        expect(state).to.have.property('id')
        expect(state).to.have.property('name')
      })
    })

    it('should handle invalid country ID for states', () => {
      cy.apiRequest('GET', '/api/v1/states?country_id=99999', null, {
        headers: authHeaders,
      }).then((response) => {
        // Should return empty array or error for invalid country ID
        if (response.status === 200) {
          expect(response.body).to.be.an('array')
          cy.log('✅ Invalid country ID handled gracefully (empty array)')
        } else {
          expect(response.status).to.be.oneOf([400, 404])
          cy.log('✅ Invalid country ID properly rejected')
        }
      })
    })
  })

  describe('Billing Address', () => {
    it('should create billing address', () => {
      const billingAddressData = {
        billing_address: {
          address_line: '123 Test Street',
          address_line_two: 'Apt 4B',
          city: 'Test City',
          zip_code: '12345',
          phone_number: '1234567890',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('POST', '/api/v1/billing_address', billingAddressData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('billing_address')
        expect(response.body.billing_address).to.have.property('address_line')
        expect(response.body.billing_address.address_line).to.eq(
          '123 Test Street',
        )
        cy.log('✅ Billing address created successfully')
      })
    })

    it('should update billing address', () => {
      const updateData = {
        billing_address: {
          address_line: '456 Updated Street',
          city: 'Updated City',
          zip_code: '54321',
          phone_number: '0987654321',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('PUT', '/api/v1/billing_address', updateData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('billing_address')
        expect(response.body.billing_address.address_line).to.eq(
          '456 Updated Street',
        )
        cy.log('✅ Billing address updated successfully')
      })
    })

    it('should reject billing address with missing required fields', () => {
      const invalidData = {
        billing_address: {
          address_line: '123 Test Street',
          // Missing required fields like city, zip_code, etc.
        },
      }

      cy.apiRequest('POST', '/api/v1/billing_address', invalidData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
        cy.log('✅ Invalid billing address properly rejected')
      })
    })
  })

  describe('Shipping Address', () => {
    it('should create shipping address', () => {
      const shippingAddressData = {
        shipping_address: {
          address_line: '789 Shipping Street',
          address_line_two: 'Suite 100',
          city: 'Shipping City',
          zip_code: '67890',
          phone_number: '5551234567',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_address', shippingAddressData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('shipping_address')
        expect(response.body.shipping_address).to.have.property('address_line')
        expect(response.body.shipping_address.address_line).to.eq(
          '789 Shipping Street',
        )
        cy.log('✅ Shipping address created successfully')
      })
    })

    it('should get shipping addresses list', () => {
      cy.apiRequest('GET', '/api/v1/shipping_addresses', null, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Shipping addresses list retrieved successfully')
        cy.log(`Found ${response.body.length} shipping addresses`)
      })
    })

    it('should get specific shipping address', () => {
      // First create a shipping address
      const shippingAddressData = {
        shipping_address: {
          address_line: '999 Get Address Street',
          city: 'Get City',
          zip_code: '99999',
          phone_number: '9999999999',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_address', shippingAddressData, {
        headers: authHeaders,
      })
        .then((response) => {
          expect(response.status).to.eq(200)
          const addressId = response.body.shipping_address.id

          // Now get the specific address
          return cy.apiRequest(
            'GET',
            `/api/v1/shipping_address/${addressId}`,
            null,
            { headers: authHeaders },
          )
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('shipping_address')
          expect(response.body.shipping_address).to.have.property(
            'address_line',
          )
          cy.log('✅ Specific shipping address retrieved successfully')
        })
    })

    it('should update shipping address', () => {
      const updateData = {
        shipping_address: {
          address_line: '888 Updated Shipping Street',
          city: 'Updated Shipping City',
          zip_code: '88888',
          phone_number: '8888888888',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('PUT', '/api/v1/shipping_address', updateData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('shipping_address')
        expect(response.body.shipping_address.address_line).to.eq(
          '888 Updated Shipping Street',
        )
        cy.log('✅ Shipping address updated successfully')
      })
    })

    it('should delete shipping address', () => {
      // First create a shipping address to delete
      const shippingAddressData = {
        shipping_address: {
          address_line: '777 Delete Address Street',
          city: 'Delete City',
          zip_code: '77777',
          phone_number: '7777777777',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_address', shippingAddressData, {
        headers: authHeaders,
      })
        .then((response) => {
          expect(response.status).to.eq(200)
          const addressId = response.body.shipping_address.id

          // Now delete the address
          return cy.apiRequest(
            'DELETE',
            `/api/v1/shipping_address/${addressId}`,
            null,
            { headers: authHeaders },
          )
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          cy.log('✅ Shipping address deleted successfully')
        })
    })

    it('should reject shipping address with invalid country/state', () => {
      const invalidData = {
        shipping_address: {
          address_line: '123 Test Street',
          city: 'Test City',
          zip_code: '12345',
          phone_number: '1234567890',
          country_id: 99999, // Invalid country ID
          state_id: 99999, // Invalid state ID
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_address', invalidData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
        cy.log('✅ Invalid country/state properly rejected')
      })
    })
  })

  describe('Address Validation', () => {
    it('should validate phone number format', () => {
      const invalidPhoneData = {
        shipping_address: {
          address_line: '123 Test Street',
          city: 'Test City',
          zip_code: '12345',
          phone_number: 'invalid-phone', // Invalid phone format
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_address', invalidPhoneData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
        cy.log('✅ Invalid phone number format properly rejected')
      })
    })

    it('should validate zip code format', () => {
      const invalidZipData = {
        shipping_address: {
          address_line: '123 Test Street',
          city: 'Test City',
          zip_code: 'invalid-zip', // Invalid zip format
          phone_number: '1234567890',
          country_id: 1,
          state_id: 1,
        },
      }

      cy.apiRequest('POST', '/api/v1/shipping_address', invalidZipData, {
        headers: authHeaders,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422])
        cy.log('✅ Invalid zip code format properly rejected')
      })
    })
  })
})
