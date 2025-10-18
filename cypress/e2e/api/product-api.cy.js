describe('API Tests', () => {
  beforeEach(() => {
    cy.fixture('testData').as('testData')
  })

  it('should get products list', () => {
    cy.apiRequest('GET', '/products').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
      expect(response.body.length).to.be.greaterThan(0)
    })
  })

  it('should create new product', () => {
    const newProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 99.99,
      category: 'Electronics',
      stock: 100,
    }

    cy.apiRequest('POST', '/products', newProduct).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('id')
      expect(response.body.name).to.eq(newProduct.name)
    })
  })

  it('should update existing product', () => {
    const updatedProduct = {
      name: 'Updated Product',
      price: 149.99,
    }

    cy.apiRequest('PUT', '/products/1', updatedProduct).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.name).to.eq(updatedProduct.name)
      expect(response.body.price).to.eq(updatedProduct.price)
    })
  })

  it('should delete product', () => {
    cy.apiRequest('DELETE', '/products/1').then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('should handle authentication', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    }

    cy.apiRequest('POST', '/auth/login', credentials).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('token')
    })
  })

  it('should validate required fields', () => {
    const invalidProduct = {
      name: '', // Empty name should fail
      price: -10, // Negative price should fail
    }

    cy.apiRequest('POST', '/products', invalidProduct).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body).to.have.property('errors')
    })
  })
})
