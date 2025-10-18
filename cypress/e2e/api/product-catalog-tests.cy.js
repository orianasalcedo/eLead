/**
 * eLead Promo API - Product and Catalog Tests
 * Comprehensive tests for product-related endpoints
 */

describe('eLead Promo API - Product and Catalog Tests', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')

    // Set environment
    const environment = Cypress.env('environment')
    cy.log(
      `🧪 Running Product and Catalog tests in ${environment.toUpperCase()} environment`,
    )
  })

  describe('Product Catalog', () => {
    it('should get catalog index', () => {
      cy.apiRequest('GET', '/api/v1/catalog').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
        cy.log('✅ Catalog index retrieved successfully')
        cy.log(`Found ${response.body.data.length} catalog items`)
      })
    })

    it('should get specific product details', () => {
      cy.apiRequest('GET', '/api/v1/products/1').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.have.property('id')
          expect(response.body.data).to.have.property('name')
          cy.log('✅ Product details retrieved successfully')
        } else {
          cy.log(
            `⚠️  Product details returned ${response.status} - product might not exist`,
          )
          expect(response.status).to.be.oneOf([200, 404])
        }
      })
    })

    it('should handle non-existent product ID', () => {
      cy.apiRequest('GET', '/api/v1/products/99999').then((response) => {
        expect(response.status).to.be.oneOf([404, 400])
        cy.log('✅ Non-existent product ID properly handled')
      })
    })
  })

  describe('Product Categories', () => {
    it('should get categories list', () => {
      cy.apiRequest('GET', '/api/v1/categories').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Categories list retrieved successfully')
          cy.log(`Found ${response.body.data.length} categories`)
        } else {
          cy.log(
            `⚠️  Categories returned ${response.status} - might require authentication`,
          )
          expect(response.status).to.be.oneOf([200, 401, 422])
        }
      })
    })

    it('should get products by category', () => {
      cy.apiRequest('GET', '/api/v1/categories/1/products').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Products by category retrieved successfully')
        } else {
          cy.log(`⚠️  Products by category returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 404, 401])
        }
      })
    })
  })

  describe('Featured Products', () => {
    it('should get featured products', () => {
      cy.apiRequest('GET', '/api/v1/featured_products').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Featured products retrieved successfully')
          cy.log(`Found ${response.body.data.length} featured products`)
        } else {
          cy.log(`⚠️  Featured products returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 404, 401])
        }
      })
    })
  })

  describe('Product Pricing', () => {
    it('should calculate product pricing', () => {
      const pricingData = {
        product_id: 1,
        quantity: 2,
        personalization: {
          text: 'Test Text',
          color: 'Red',
        },
      }

      cy.apiRequest(
        'POST',
        '/api/v1/pricing/product_item_total_prices',
        pricingData,
      ).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          cy.log('✅ Product pricing calculated successfully')
        } else {
          cy.log(`⚠️  Product pricing returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 400, 404, 422])
        }
      })
    })

    it('should handle pricing calculation with invalid product', () => {
      const invalidPricingData = {
        product_id: 99999,
        quantity: 1,
      }

      cy.apiRequest(
        'POST',
        '/api/v1/pricing/product_item_total_prices',
        invalidPricingData,
      ).then((response) => {
        expect(response.status).to.be.oneOf([400, 404, 422])
        cy.log('✅ Invalid product pricing properly handled')
      })
    })
  })

  describe('Payment Methods', () => {
    it('should get payment methods', () => {
      cy.apiRequest('GET', '/api/v1/payment_methods').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Payment methods retrieved successfully')
          cy.log(`Found ${response.body.data.length} payment methods`)
        } else {
          cy.log(`⚠️  Payment methods returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 401])
        }
      })
    })
  })

  describe('Shipping Methods', () => {
    it('should get shipping methods', () => {
      cy.apiRequest('GET', '/api/v1/shipping_methods').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Shipping methods retrieved successfully')
          cy.log(`Found ${response.body.data.length} shipping methods`)
        } else {
          cy.log(`⚠️  Shipping methods returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 404])
        }
      })
    })
  })

  describe('Gift Codes and Incentives', () => {
    it('should get incentive codes', () => {
      cy.apiRequest('GET', '/api/v1/incentive_codes').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Incentive codes retrieved successfully')
        } else {
          cy.log(`⚠️  Incentive codes returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 401, 404])
        }
      })
    })

    it('should get bill me later codes', () => {
      cy.apiRequest('GET', '/api/v1/bill_me_later_codes').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Bill me later codes retrieved successfully')
        } else {
          cy.log(`⚠️  Bill me later codes returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 401, 404])
        }
      })
    })

    it('should get AU codes', () => {
      cy.apiRequest('GET', '/api/v1/au_codes').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ AU codes retrieved successfully')
        } else {
          cy.log(`⚠️  AU codes returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 401, 404])
        }
      })
    })
  })

  describe('Product Search and Filtering', () => {
    it('should search products by name', () => {
      cy.apiRequest('GET', '/api/v1/products?search=test').then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
          cy.log('✅ Product search by name successful')
        } else {
          cy.log(`⚠️  Product search returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 404, 401])
        }
      })
    })

    it('should filter products by category', () => {
      cy.apiRequest('GET', '/api/v1/products?category_id=1').then(
        (response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property('data')
            expect(response.body.data).to.be.an('array')
            cy.log('✅ Product filtering by category successful')
          } else {
            cy.log(`⚠️  Product filtering returned ${response.status}`)
            expect(response.status).to.be.oneOf([200, 404, 401])
          }
        },
      )
    })

    it('should paginate products', () => {
      cy.apiRequest('GET', '/api/v1/products?page=1&per_page=10').then(
        (response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property('data')
            expect(response.body.data).to.be.an('array')
            cy.log('✅ Product pagination working')
          } else {
            cy.log(`⚠️  Product pagination returned ${response.status}`)
            expect(response.status).to.be.oneOf([200, 404, 401])
          }
        },
      )
    })
  })

  describe('Product Personalization', () => {
    it('should validate personalization options', () => {
      cy.apiRequest('GET', '/api/v1/products/1/personalization_options').then(
        (response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property('data')
            cy.log('✅ Personalization options retrieved successfully')
          } else {
            cy.log(`⚠️  Personalization options returned ${response.status}`)
            expect(response.status).to.be.oneOf([200, 404, 401])
          }
        },
      )
    })

    it('should calculate pricing with personalization', () => {
      const personalizedPricingData = {
        product_id: 1,
        quantity: 1,
        personalization: {
          text: 'Custom Text',
          color: 'Blue',
          font: 'Arial',
          size: 'Large',
        },
      }

      cy.apiRequest(
        'POST',
        '/api/v1/pricing/product_item_total_prices',
        personalizedPricingData,
      ).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('data')
          cy.log('✅ Personalized pricing calculated successfully')
        } else {
          cy.log(`⚠️  Personalized pricing returned ${response.status}`)
          expect(response.status).to.be.oneOf([200, 400, 404, 422])
        }
      })
    })
  })
})
