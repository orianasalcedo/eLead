/**
 * eLead Promo API Smoke Tests
 * Simple API tests to verify basic functionality
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
    // Xray Test ID: ELP-API-001
    // cy.xrayTestCase('ELP-API-001')
    
    cy.apiRequest('GET', '/api/v1/store_settings')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        cy.log('✅ Store settings endpoint accessible')
      })
      
    // cy.xrayPass('ELP-API-001', 'Store settings endpoint accessible')
  })

  it('should access home settings endpoint', () => {
    // Xray Test ID: ELP-API-002
    // cy.xrayTestCase('ELP-API-002')
    
    cy.apiRequest('GET', '/api/v1/home_settings')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        cy.log('✅ Home settings endpoint accessible')
      })
      
    // cy.xrayPass('ELP-API-002', 'Home settings endpoint accessible')
  })

  it('should access categories endpoint', () => {
    // Xray Test ID: ELP-API-003
    cy.xrayTestCase('ELP-API-003')
    
    cy.apiRequest('GET', '/api/v1/categories')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Categories endpoint accessible')
      })
      
    cy.xrayPass('ELP-API-003', 'Categories endpoint accessible')
  })

  it('should access countries endpoint', () => {
    // Xray Test ID: ELP-API-004
    cy.xrayTestCase('ELP-API-004')
    
    cy.apiRequest('GET', '/api/v1/countries')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        cy.log('✅ Countries endpoint accessible')
      })
      
    cy.xrayPass('ELP-API-004', 'Countries endpoint accessible')
  })

  it('should access payment methods endpoint', () => {
    // Xray Test ID: ELP-API-005
    cy.xrayTestCase('ELP-API-005')
    
    cy.apiRequest('GET', '/api/v1/payment_methods')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Payment methods endpoint accessible')
      })
      
    cy.xrayPass('ELP-API-005', 'Payment methods endpoint accessible')
  })

  it('should access shipping methods endpoint', () => {
    // Xray Test ID: ELP-API-006
    cy.xrayTestCase('ELP-API-006')
    
    cy.apiRequest('GET', '/api/v1/shipping_methods')
      .then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        cy.log('✅ Shipping methods endpoint accessible')
      })
      
    cy.xrayPass('ELP-API-006', 'Shipping methods endpoint accessible')
  })

  it('should test customer signin with valid credentials', () => {
    // Xray Test ID: ELP-API-007
    cy.xrayTestCase('ELP-API-007')
    
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
      
    cy.xrayPass('ELP-API-007', 'Customer signin successful')
  })

  it('should test customer signin with invalid credentials', () => {
    // Xray Test ID: ELP-API-008
    cy.xrayTestCase('ELP-API-008')
    
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
      
    cy.xrayPass('ELP-API-008', 'Invalid credentials properly rejected')
  })
})
