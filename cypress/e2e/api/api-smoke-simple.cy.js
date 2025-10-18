/**
 * eLead Promo API Smoke Tests - Simplified Version
 * Simple API tests to verify basic functionality (without Xray integration)
 */

describe('eLead Promo API Smoke Tests', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')
    
    // Set environment
    const environment = Cypress.env('environment')
    cy.log(`🧪 Running API smoke tests in ${environment.toUpperCase()} environment`)
  });

  it('should access store settings endpoint', () => {
    cy.apiRequest('GET', '/api/v1/store_settings')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        cy.log('✅ Store settings endpoint accessible')
      })
  })

  it('should access home settings endpoint', () => {
    cy.apiRequest('GET', '/api/v1/home_settings')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        cy.log('✅ Home settings endpoint accessible')
      })
  })

  it('should access categories endpoint', () => {
    cy.apiRequest('GET', '/api/v1/categories')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Categories endpoint accessible')
      })
  })

  it('should access countries endpoint', () => {
    cy.apiRequest('GET', '/api/v1/countries')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        cy.log('✅ Countries endpoint accessible')
      })
  })

  it('should access payment methods endpoint', () => {
    cy.apiRequest('GET', '/api/v1/payment_methods')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Payment methods endpoint accessible')
      })
  })

  it('should access shipping methods endpoint', () => {
    cy.apiRequest('GET', '/api/v1/shipping_methods')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Shipping methods endpoint accessible')
      })
  })

  it('should test customer signin with valid credentials', () => {
    const signinData = {
      customer: {
        email: Cypress.env('testUser').email,
        password: Cypress.env('testUser').password
      }
    }

    cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData)
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('email')
        expect(response.headers).to.have.property('access-token')
        cy.log('✅ Customer signin successful')
      })
  })

  it('should test customer signin with invalid credentials', () => {
    const signinData = {
      customer: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      }
    }

    cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData)
      .then((response) => {
        expect(response.status).to.eq(401)
        cy.log('✅ Invalid credentials properly rejected')
      })
  })
})
