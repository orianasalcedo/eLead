# 📖 API Reference - eLead Promo

Technical reference for eLead Promo API endpoints and data structures.

---

## 🔗 Base URLs

| Environment | Frontend URL                    | API URL                      |
| ----------- | ------------------------------- | ---------------------------- |
| **QA**      | https://tienda1.qa.eleaddev.com | https://api.qa.eleaddev.com  |
| **Staging** | https://aya.stg.eleaddev.com    | https://api.stg.eleaddev.com |

---

## 🔐 Authentication

### Headers Required

```
Content-Type: application/json
Accept: application/json
X-Origin: <frontend-url>  // Required for multi-tenant
```

### Devise Token Auth

After successful login, include these headers:

```
access-token: <token>
client: <client>
uid: <email>
```

---

## 📊 API Endpoints Summary

### Authentication

- `POST /api/v1/customers` - Sign up
- `POST /api/v1/customers/sign_in` - Sign in
- `DELETE /api/v1/customers/sign_out` - Sign out
- `POST /api/v1/customers/password` - Password reset
- `GET /api/v1/customer` - Get profile
- `PUT /api/v1/customer` - Update profile

### Store Settings

- `GET /api/v1/store_settings` - Get store configuration
- `GET /api/v1/home_settings` - Get home page settings

### Addresses

- `GET /api/v1/countries` - List countries (requires auth)
- `GET /api/v1/countries/:id/states` - List states for country
- `POST /api/v1/shipping_addresses` - Create shipping address
- `PUT /api/v1/shipping_addresses/:id` - Update shipping address
- `POST /api/v1/billing_addresses` - Create billing address
- `PUT /api/v1/billing_addresses/:id` - Update billing address

### Orders

- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order
- `GET /api/v1/orders` - List orders

### Products

- `GET /api/v1/categories` - List categories
- `GET /api/v1/products` - List products
- `GET /api/v1/products/:id` - Get product

### Pages

- `GET /api/v1/pages/:slug` - Get page content (e.g., /faqs)

### Checkout

- `GET /api/v1/payment_methods` - List payment methods
- `GET /api/v1/shipping_methods` - List shipping methods

### Contact

- `POST /api/v1/contact_us_requests` - Submit contact form

---

## 📝 Request/Response Examples

### Sign In

```javascript
// Request
POST /api/v1/customers/sign_in
{
  "customer": {
    "email": "user@example.com",
    "password": "password123"
  }
}

// Response (200 OK)
{
  "customer": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}

// Response Headers
access-token: <token>
client: <client>
uid: user@example.com
```

### Get Countries

```javascript
// Request (requires authentication headers)
GET /api/v1/countries
Headers: {
  access-token, client, uid
}

// Response (200 OK)
{
  "countries": [
    {
      "id": 1,
      "name": "United States",
      "code": "US"
    }
  ]
}
```

### Create Shipping Address

```javascript
// Request
POST /api/v1/shipping_addresses
{
  "shipping_address": {
    "address_line": "123 Main St",
    "address_line_two": "Apt 4",
    "city": "Springfield",
    "zip_code": "12345",
    "phone_number": "5551234567",
    "country_id": 1,
    "state_id": 5
  }
}

// Response (201 Created)
{
  "shipping_address": {
    "id": 10,
    "address_line": "123 Main St",
    // ... full address object
  }
}
```

---

## 🔍 Common Error Codes

| Code    | Meaning              | Common Causes                   |
| ------- | -------------------- | ------------------------------- |
| **200** | OK                   | Success                         |
| **201** | Created              | Resource created successfully   |
| **400** | Bad Request          | Invalid data format             |
| **401** | Unauthorized         | Missing or invalid auth headers |
| **404** | Not Found            | Resource doesn't exist          |
| **422** | Unprocessable Entity | Validation errors               |
| **500** | Server Error         | Backend issue                   |

---

## 🛠️ Using in Cypress Tests

### With Custom Command

```javascript
// Authenticated request
cy.eleadpromoLogin(email, password)
cy.authenticatedApiRequest('GET', '/api/v1/countries')

// Unauthenticated request
cy.apiRequest('GET', '/api/v1/store_settings')
```

### Direct cy.request

```javascript
cy.request({
  method: 'POST',
  url: 'https://api.qa.eleaddev.com/api/v1/customers/sign_in',
  headers: {
    'Content-Type': 'application/json',
    'X-Origin': 'https://tienda1.qa.eleaddev.com',
  },
  body: {
    customer: { email, password },
  },
})
```

---

## 📚 Additional Resources

- **Postman Collection**: `elead-promo.postman_collection.json`
- **API Tests**: `cypress/e2e/api/`
- **Custom Commands**: `cypress/support/eleadpromo-commands.js`

---

**For testing examples, see [TESTING_GUIDE.md](./TESTING_GUIDE.md)**
