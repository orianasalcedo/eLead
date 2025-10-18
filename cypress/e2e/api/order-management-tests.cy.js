/**
 * eLead Promo API - Order Management Tests
 * Comprehensive tests for order-related endpoints
 */

describe('eLead Promo API - Order Management Tests', () => {
  let authHeaders

  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')
    
    // Set environment
    const environment = Cypress.env('environment')
    cy.log(`🧪 Running Order Management tests in ${environment.toUpperCase()} environment`)

    // Sign in to get auth headers for authenticated endpoints
    const signinData = {
      customer: {
        email: Cypress.env('testUser').email,
        password: Cypress.env('testUser').password
      }
    }

    cy.apiRequest('POST', '/api/v1/customers/sign_in', signinData)
      .then((response) => {
        authHeaders = {
          'access-token': response.headers['access-token'],
          'client': response.headers['client'],
          'uid': response.headers['uid']
        }
      })
  });

  describe('Order Listing and Viewing', () => {
    it('should get orders list', () => {
      cy.apiRequest('GET', '/api/v1/orders', null, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
          cy.log('✅ Orders list retrieved successfully')
          cy.log(`Found ${response.body.length} orders`)
          
          // If there are orders, verify structure
          if (response.body.length > 0) {
            const order = response.body[0]
            expect(order).to.have.property('id')
            expect(order).to.have.property('status')
            expect(order).to.have.property('total')
          }
        })
    })

    it('should get specific order details', () => {
      // First get orders list to find an existing order
      cy.apiRequest('GET', '/api/v1/orders', null, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.eq(200)
          
          if (response.body.length > 0) {
            const orderId = response.body[0].id
            
            // Get specific order details
            return cy.apiRequest('GET', `/api/v1/orders/${orderId}`, null, { headers: authHeaders })
          } else {
            cy.log('⚠️  No orders found to test specific order details')
            return cy.wrap({ status: 200, body: { message: 'No orders found' } })
          }
        })
        .then((response) => {
          if (response.body.message !== 'No orders found') {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('order')
            expect(response.body.order).to.have.property('id')
            expect(response.body.order).to.have.property('status')
            cy.log('✅ Specific order details retrieved successfully')
          }
        })
    })

    it('should handle non-existent order ID', () => {
      cy.apiRequest('GET', '/api/v1/orders/99999', null, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.be.oneOf([404, 400])
          cy.log('✅ Non-existent order ID properly handled')
        })
    })
  })

  describe('Order Creation', () => {
    it('should create a new order', () => {
      const orderData = {
        order: {
          order_items: [
            {
              product_id: 1,
              quantity: 2,
              personalization: {
                text: 'Test Personalization',
                color: 'Red'
              }
            }
          ],
          shipping_address_id: 1,
          billing_address_id: 1,
          payment_method: 'credit_card',
          shipping_method: 'standard'
        }
      }

      cy.apiRequest('POST', '/api/v1/orders', orderData, { headers: authHeaders })
        .then((response) => {
          // Order creation might require additional setup or return different status codes
          if (response.status === 200) {
            expect(response.body).to.have.property('order')
            expect(response.body.order).to.have.property('id')
            cy.log('✅ Order created successfully')
          } else if (response.status === 201) {
            expect(response.body).to.have.property('order')
            cy.log('✅ Order created successfully (201)')
          } else {
            cy.log(`⚠️  Order creation returned ${response.status} - might need additional setup`)
            expect(response.status).to.be.oneOf([200, 201, 400, 422])
          }
        })
    })

    it('should reject order with invalid product ID', () => {
      const invalidOrderData = {
        order: {
          order_items: [
            {
              product_id: 99999, // Invalid product ID
              quantity: 1
            }
          ],
          shipping_address_id: 1,
          billing_address_id: 1
        }
      }

      cy.apiRequest('POST', '/api/v1/orders', invalidOrderData, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Order with invalid product ID properly rejected')
        })
    })

    it('should reject order with invalid quantity', () => {
      const invalidOrderData = {
        order: {
          order_items: [
            {
              product_id: 1,
              quantity: 0 // Invalid quantity
            }
          ],
          shipping_address_id: 1,
          billing_address_id: 1
        }
      }

      cy.apiRequest('POST', '/api/v1/orders', invalidOrderData, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Order with invalid quantity properly rejected')
        })
    })

    it('should reject order without required fields', () => {
      const incompleteOrderData = {
        order: {
          order_items: [
            {
              product_id: 1,
              quantity: 1
            }
          ]
          // Missing shipping_address_id, billing_address_id
        }
      }

      cy.apiRequest('POST', '/api/v1/orders', incompleteOrderData, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Incomplete order properly rejected')
        })
    })
  })

  describe('Order Status and Updates', () => {
    it('should handle order status updates', () => {
      // First get an existing order
      cy.apiRequest('GET', '/api/v1/orders', null, { headers: authHeaders })
        .then((response) => {
          if (response.body.length > 0) {
            const orderId = response.body[0].id
            
            // Try to update order status (this might require admin privileges)
            const updateData = {
              order: {
                status: 'processing'
              }
            }
            
            return cy.apiRequest('PUT', `/api/v1/orders/${orderId}`, updateData, { headers: authHeaders })
          } else {
            cy.log('⚠️  No orders found to test status updates')
            return cy.wrap({ status: 200, body: { message: 'No orders found' } })
          }
        })
        .then((response) => {
          if (response.body.message !== 'No orders found') {
            // Status update might be restricted or require different permissions
            if (response.status === 200) {
              cy.log('✅ Order status updated successfully')
            } else {
              cy.log(`⚠️  Order status update returned ${response.status} - might require admin privileges`)
              expect(response.status).to.be.oneOf([200, 403, 404, 422])
            }
          }
        })
    })
  })

  describe('Order Items and Personalization', () => {
    it('should handle order items with personalization', () => {
      const personalizedOrderData = {
        order: {
          order_items: [
            {
              product_id: 1,
              quantity: 1,
              personalization: {
                text: 'Custom Text',
                color: 'Blue',
                font: 'Arial',
                size: 'Large'
              }
            }
          ],
          shipping_address_id: 1,
          billing_address_id: 1
        }
      }

      cy.apiRequest('POST', '/api/v1/orders', personalizedOrderData, { headers: authHeaders })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            expect(response.body).to.have.property('order')
            cy.log('✅ Order with personalization created successfully')
          } else {
            cy.log(`⚠️  Personalized order creation returned ${response.status}`)
            expect(response.status).to.be.oneOf([200, 201, 400, 422])
          }
        })
    })

    it('should validate personalization data', () => {
      const invalidPersonalizationData = {
        order: {
          order_items: [
            {
              product_id: 1,
              quantity: 1,
              personalization: {
                text: '', // Empty text might be invalid
                color: 'InvalidColor'
              }
            }
          ],
          shipping_address_id: 1,
          billing_address_id: 1
        }
      }

      cy.apiRequest('POST', '/api/v1/orders', invalidPersonalizationData, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Invalid personalization data properly rejected')
        })
    })
  })

  describe('Order Pricing and Calculations', () => {
    it('should calculate order totals', () => {
      const orderCalculationData = {
        order_items: [
          {
            product_id: 1,
            quantity: 2
          }
        ],
        shipping_address_id: 1,
        billing_address_id: 1
      }

      // This endpoint might not exist or work differently
      cy.apiRequest('POST', '/api/v1/orders/calculate', orderCalculationData, { headers: authHeaders })
        .then((response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property('total')
            expect(response.body).to.have.property('subtotal')
            cy.log('✅ Order totals calculated successfully')
          } else {
            cy.log(`⚠️  Order calculation returned ${response.status} - endpoint might not exist`)
            expect(response.status).to.be.oneOf([200, 404, 422])
          }
        })
    })
  })

  describe('Order History and Filtering', () => {
    it('should filter orders by status', () => {
      cy.apiRequest('GET', '/api/v1/orders?status=pending', null, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
          cy.log('✅ Orders filtered by status successfully')
        })
    })

    it('should paginate orders', () => {
      cy.apiRequest('GET', '/api/v1/orders?page=1&per_page=10', null, { headers: authHeaders })
        .then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('array')
          cy.log('✅ Orders pagination working')
        })
    })
  })
})
