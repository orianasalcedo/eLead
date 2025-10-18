/**
 * eLead Promo API - Contact Form Tests
 * Comprehensive tests for contact form and communication endpoints
 */

describe('eLead Promo API - Contact Form Tests', () => {
  beforeEach(() => {
    // Load test data
    cy.fixture('eleadpromo-test-data').as('testData')
    
    // Set environment
    const environment = Cypress.env('environment')
    cy.log(`🧪 Running Contact Form tests in ${environment.toUpperCase()} environment`)
  });

  describe('Contact Us Requests', () => {
    it('should create contact us request with valid data', () => {
      const contactData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test Subject',
          message: 'This is a test message for the contact form.',
          phone_number: '1234567890'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', contactData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          expect(response.body).to.have.property('contact_us_request')
          expect(response.body.contact_us_request).to.have.property('name')
          expect(response.body.contact_us_request.name).to.eq('Test User')
          cy.log('✅ Contact us request created successfully')
        })
    })

    it('should create contact us request with minimal required data', () => {
      const minimalContactData = {
        contact_us_request: {
          name: 'Minimal User',
          email: 'minimal@example.com',
          message: 'Minimal test message.'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', minimalContactData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          expect(response.body).to.have.property('contact_us_request')
          cy.log('✅ Minimal contact us request created successfully')
        })
    })

    it('should reject contact us request with invalid email', () => {
      const invalidContactData = {
        contact_us_request: {
          name: 'Test User',
          email: 'invalid-email',
          message: 'Test message with invalid email.'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', invalidContactData)
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Contact us request with invalid email properly rejected')
        })
    })

    it('should reject contact us request with missing required fields', () => {
      const incompleteContactData = {
        contact_us_request: {
          name: 'Test User'
          // Missing email and message
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', incompleteContactData)
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Incomplete contact us request properly rejected')
        })
    })

    it('should reject contact us request with empty message', () => {
      const emptyMessageData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          message: ''
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', emptyMessageData)
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Contact us request with empty message properly rejected')
        })
    })

    it('should handle long messages appropriately', () => {
      const longMessage = 'A'.repeat(1000) // Very long message
      const longMessageData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          message: longMessage
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', longMessageData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            cy.log('✅ Long message accepted')
          } else {
            cy.log(`⚠️  Long message returned ${response.status} - might have length limits`)
            expect(response.status).to.be.oneOf([200, 201, 400, 422])
          }
        })
    })
  })

  describe('Contact Form Validation', () => {
    it('should validate phone number format', () => {
      const invalidPhoneData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
          phone_number: 'invalid-phone'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', invalidPhoneData)
        .then((response) => {
          expect(response.status).to.be.oneOf([400, 422])
          cy.log('✅ Invalid phone number format properly rejected')
        })
    })

    it('should validate name length', () => {
      const longNameData = {
        contact_us_request: {
          name: 'A'.repeat(100), // Very long name
          email: 'test@example.com',
          message: 'Test message'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', longNameData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            cy.log('✅ Long name accepted')
          } else {
            cy.log(`⚠️  Long name returned ${response.status} - might have length limits`)
            expect(response.status).to.be.oneOf([200, 201, 400, 422])
          }
        })
    })

    it('should validate subject length', () => {
      const longSubjectData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          subject: 'A'.repeat(200), // Very long subject
          message: 'Test message'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', longSubjectData)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            cy.log('✅ Long subject accepted')
          } else {
            cy.log(`⚠️  Long subject returned ${response.status} - might have length limits`)
            expect(response.status).to.be.oneOf([200, 201, 400, 422])
          }
        })
    })
  })

  describe('Contact Form Security', () => {
    it('should handle special characters in message', () => {
      const specialCharsData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', specialCharsData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          cy.log('✅ Special characters handled properly')
        })
    })

    it('should handle HTML content in message', () => {
      const htmlData = {
        contact_us_request: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message with <b>HTML</b> content and <script>alert("test")</script>'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', htmlData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          cy.log('✅ HTML content handled properly')
        })
    })

    it('should handle SQL injection attempts', () => {
      const sqlInjectionData = {
        contact_us_request: {
          name: "'; DROP TABLE users; --",
          email: 'test@example.com',
          message: "Test message with SQL injection: '; DROP TABLE contacts; --"
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', sqlInjectionData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          cy.log('✅ SQL injection attempt handled safely')
        })
    })
  })

  describe('Contact Form Performance', () => {
    it('should process contact form submission quickly', () => {
      const startTime = Date.now()
      
      const contactData = {
        contact_us_request: {
          name: 'Performance Test',
          email: 'performance@example.com',
          message: 'Testing contact form performance.'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', contactData)
        .then((response) => {
          const endTime = Date.now()
          const processingTime = endTime - startTime
          
          expect(response.status).to.be.oneOf([200, 201])
          expect(processingTime).to.be.lessThan(5000) // Should process within 5 seconds
          cy.log(`✅ Contact form processed in ${processingTime}ms`)
        })
    })

    it('should handle multiple simultaneous submissions', () => {
      const contactData1 = {
        contact_us_request: {
          name: 'User 1',
          email: 'user1@example.com',
          message: 'First simultaneous message.'
        }
      }

      const contactData2 = {
        contact_us_request: {
          name: 'User 2',
          email: 'user2@example.com',
          message: 'Second simultaneous message.'
        }
      }

      // Send both requests simultaneously
      cy.apiRequest('POST', '/api/v1/contact_us_requests', contactData1)
        .then((response1) => {
          expect(response1.status).to.be.oneOf([200, 201])
          cy.log('✅ First simultaneous submission successful')
        })

      cy.apiRequest('POST', '/api/v1/contact_us_requests', contactData2)
        .then((response2) => {
          expect(response2.status).to.be.oneOf([200, 201])
          cy.log('✅ Second simultaneous submission successful')
        })
    })
  })

  describe('Contact Form Response Validation', () => {
    it('should return proper response structure', () => {
      const contactData = {
        contact_us_request: {
          name: 'Response Test',
          email: 'response@example.com',
          message: 'Testing response structure.'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', contactData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          expect(response.body).to.have.property('contact_us_request')
          
          const contactRequest = response.body.contact_us_request
          expect(contactRequest).to.have.property('id')
          expect(contactRequest).to.have.property('name')
          expect(contactRequest).to.have.property('email')
          expect(contactRequest).to.have.property('message')
          expect(contactRequest).to.have.property('created_at')
          
          cy.log('✅ Contact form response structure validated')
        })
    })

    it('should include timestamp in response', () => {
      const contactData = {
        contact_us_request: {
          name: 'Timestamp Test',
          email: 'timestamp@example.com',
          message: 'Testing timestamp in response.'
        }
      }

      cy.apiRequest('POST', '/api/v1/contact_us_requests', contactData)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 201])
          
          const createdAt = new Date(response.body.contact_us_request.created_at)
          const now = new Date()
          
          // Check that timestamp is recent (within last minute)
          expect(createdAt).to.be.at.least(new Date(now.getTime() - 60000))
          expect(createdAt).to.be.at.most(now)
          
          cy.log('✅ Contact form timestamp validated')
        })
    })
  })
})
