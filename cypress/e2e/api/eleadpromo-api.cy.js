/**
 * eLead Promo API Tests
 * Based on Postman collection analysis
 * Tests for customer authentication, addresses, and store functionality
 */

describe('eLead Promo API Tests', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')
    
    // Set base API URL based on environment
    const environment = Cypress.env('environment')
    cy.log(`🧪 Running API tests in ${environment.toUpperCase()} environment`)
  });

  describe('Customer Authentication', () => {
    it('should allow customer signup', () => {
      // Xray Test ID: ELP-CUSTOMER-001
      cy.xrayTestCase('ELP-CUSTOMER-001')
      
      const signupData = {
        customer: {
          email: `test-${Date.now()}@example.com`,
          password: 'Password?12',
          password_confirmation: 'Password?12',
          first_name: 'Test',
          last_name: 'User'
        }
      }

      cy.apiRequest('POST', '/api/v1/customers', signupData)
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('email')
          
          // Store auth headers for subsequent requests
          cy.wrap(response.headers['access-token']).as('accessToken')
          cy.wrap(response.headers['client']).as('client')
          cy.wrap(response.headers['uid']).as('uid')
        })
        
      cy.xrayPass('ELP-CUSTOMER-001', 'Customer signup successful')
    })

    it('should allow customer signin', () => {
      // Xray Test ID: ELP-CUSTOMER-002
      cy.xrayTestCase('ELP-CUSTOMER-002')
      
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
          
          // Store auth headers
          cy.wrap(response.headers['access-token']).as('accessToken')
          cy.wrap(response.headers['client']).as('client')
          cy.wrap(response.headers['uid']).as('uid')
        })
        
      cy.xrayPass('ELP-CUSTOMER-002', 'Customer signin successful')
    })

    it('should get customer information', () => {
      // Xray Test ID: ELP-CUSTOMER-003
      cy.xrayTestCase('ELP-CUSTOMER-003')
      
      // First sign in to get auth headers
      const signinData = {
        customer: {
          email: Cypress.env('testUser').email,
          password: Cypress.env('testUser').password
        }
      }

      cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData)
        .then((response) => {
          const authHeaders = {
            'access-token': response.headers['access-token'],
            'client': response.headers['client'],
            'uid': response.headers['uid']
          }
          
          // Get customer info
          return cy.apiRequest('GET', '/api/v1/customers', null, { headers: authHeaders })
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('email')
        })
        
      cy.xrayPass('ELP-CUSTOMER-003', 'Customer information retrieved successfully')
    })
  })

  describe('Address Management', () => {
    it('should get countries list', () => {
      // Xray Test ID: ELP-ADDRESS-001
      cy.xrayTestCase('ELP-ADDRESS-001')
      
      cy.apiRequest('GET', '/api/v1/countries')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
          expect(response.body.length).to.be.greaterThan(0)
        })
        
      cy.xrayPass('ELP-ADDRESS-001', 'Countries list retrieved successfully')
    })

    it('should get states list', () => {
      // Xray Test ID: ELP-ADDRESS-002
      cy.xrayTestCase('ELP-ADDRESS-002')
      
      cy.apiRequest('GET', '/api/v1/states')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
        })
        
      cy.xrayPass('ELP-ADDRESS-002', 'States list retrieved successfully')
    })

    it('should get shipping addresses', () => {
      // Xray Test ID: ELP-ADDRESS-003
      cy.xrayTestCase('ELP-ADDRESS-003')
      
      // First sign in to get auth headers
      const signinData = {
        customer: {
          email: Cypress.env('testUser').email,
          password: Cypress.env('testUser').password
        }
      }

      cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData)
        .then((response) => {
          const authHeaders = {
            'access-token': response.headers['access-token'],
            'client': response.headers['client'],
            'uid': response.headers['uid']
          }
          
          // Get shipping addresses
          return cy.apiRequest('GET', '/api/v1/shipping_addresses', null, { headers: authHeaders })
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
        })
        
      cy.xrayPass('ELP-ADDRESS-003', 'Shipping addresses retrieved successfully')
    })
  })

  describe('Store Settings', () => {
    it('should get store settings', () => {
      // Xray Test ID: ELP-STORE-001
      cy.xrayTestCase('ELP-STORE-001')
      
      cy.apiRequest('GET', '/api/v1/store_settings')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
        })
        
      cy.xrayPass('ELP-STORE-001', 'Store settings retrieved successfully')
    })

    it('should get home settings', () => {
      // Xray Test ID: ELP-STORE-002
      cy.xrayTestCase('ELP-STORE-002')
      
      cy.apiRequest('GET', '/api/v1/home_settings')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
        })
        
      cy.xrayPass('ELP-STORE-002', 'Home settings retrieved successfully')
    })

    it('should get categories', () => {
      // Xray Test ID: ELP-STORE-003
      cy.xrayTestCase('ELP-STORE-003')
      
      cy.apiRequest('GET', '/api/v1/categories')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
        })
        
      cy.xrayPass('ELP-STORE-003', 'Categories retrieved successfully')
    })

    it('should get payment methods', () => {
      // Xray Test ID: ELP-STORE-004
      cy.xrayTestCase('ELP-STORE-004')
      
      cy.apiRequest('GET', '/api/v1/payment_methods')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
        })
        
      cy.xrayPass('ELP-STORE-004', 'Payment methods retrieved successfully')
    })

    it('should get shipping methods', () => {
      // Xray Test ID: ELP-STORE-005
      cy.xrayTestCase('ELP-STORE-005')
      
      cy.apiRequest('GET', '/api/v1/shipping_methods')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
        })
        
      cy.xrayPass('ELP-STORE-005', 'Shipping methods retrieved successfully')
    })
  })

  describe('Pages & Content', () => {
    it('should get FAQs page', () => {
      // Xray Test ID: ELP-PAGES-001
      cy.xrayTestCase('ELP-PAGES-001')
      
      cy.apiRequest('GET', '/api/v1/pages/faqs')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
        })
        
      cy.xrayPass('ELP-PAGES-001', 'FAQs page retrieved successfully')
    })

    it('should get privacy policy page', () => {
      // Xray Test ID: ELP-PAGES-002
      cy.xrayTestCase('ELP-PAGES-002')
      
      cy.apiRequest('GET', '/api/v1/pages/privacy_policy')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
        })
        
      cy.xrayPass('ELP-PAGES-002', 'Privacy policy page retrieved successfully')
    })

    it('should get terms of use page', () => {
      // Xray Test ID: ELP-PAGES-003
      cy.xrayTestCase('ELP-PAGES-003')
      
      cy.apiRequest('GET', '/api/v1/pages/terms_of_use')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
        })
        
      cy.xrayPass('ELP-PAGES-003', 'Terms of use page retrieved successfully')
    })

    it('should get gift codes page', () => {
      // Xray Test ID: ELP-PAGES-004
      cy.xrayTestCase('ELP-PAGES-004')
      
      cy.apiRequest('GET', '/api/v1/pages/gift_codes')
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('data')
        })
        
      cy.xrayPass('ELP-PAGES-004', 'Gift codes page retrieved successfully')
    })
  })

  describe('Orders', () => {
    it('should get orders list', () => {
      // Xray Test ID: ELP-ORDERS-001
      cy.xrayTestCase('ELP-ORDERS-001')
      
      // First sign in to get auth headers
      const signinData = {
        customer: {
          email: Cypress.env('testUser').email,
          password: Cypress.env('testUser').password
        }
      }

      cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData)
        .then((response) => {
          const authHeaders = {
            'access-token': response.headers['access-token'],
            'client': response.headers['client'],
            'uid': response.headers['uid']
          }
          
          // Get orders
          return cy.apiRequest('GET', '/api/v1/orders', null, { headers: authHeaders })
        })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
        })
        
      cy.xrayPass('ELP-ORDERS-001', 'Orders list retrieved successfully')
    })
  })
})
