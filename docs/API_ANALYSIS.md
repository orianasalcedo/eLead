# eLead Promo API Analysis from Postman Collection

## 📊 **API Structure Overview**

Based on the Postman collection analysis, here are the main API endpoints:

### **🔐 Authentication & Users**
- **POST** `/api/v1/customers` - Customer Signup
- **POST** `/api/v1/customers/sign_in` - Customer SignIn
- **PUT** `/api/v1/customers` - Update Customer
- **GET** `/api/v1/customers` - Get Customer
- **POST** `/api/v1/customers/password` - Reset Password (step 1)
- **PUT** `/api/v1/customers/password` - Reset Password (step 3)

### **📍 Address Management**
- **GET** `/api/v1/countries` - Get Countries
- **GET** `/api/v1/states` - Get States
- **PUT** `/api/v1/billing_address` - Update Billing Address
- **POST** `/api/v1/billing_address` - Create Billing Address
- **PUT** `/api/v1/shipping_address` - Update Shipping Address
- **POST** `/api/v1/shipping_address` - Create Shipping Address
- **DELETE** `/api/v1/shipping_address` - Destroy Shipping Address
- **GET** `/api/v1/shipping_address` - Show Shipping Address
- **GET** `/api/v1/shipping_addresses` - Index Shipping Addresses

### **🏪 Store & Settings**
- **GET** `/api/v1/store_settings` - Store Settings
- **GET** `/api/v1/home_settings` - Home Settings
- **GET** `/api/v1/categories` - Categories Index
- **GET** `/api/v1/payment_methods` - Payment Methods
- **GET** `/api/v1/shipping_methods` - Shipping Methods

### **📄 Pages & Content**
- **GET** `/api/v1/pages/faqs` - FAQs
- **GET** `/api/v1/pages/privacy_policy` - Privacy Policy
- **GET** `/api/v1/pages/terms_of_use` - Terms of Use
- **GET** `/api/v1/pages/about_us` - About Us
- **GET** `/api/v1/pages/more_products_options` - More Products Options
- **GET** `/api/v1/pages/gift_codes` - Gift Codes
- **GET** `/api/v1/pages/return_policy` - Return Policy
- **GET** `/api/v1/pages/contact_us` - Contact Us

### **🛒 Orders**
- **GET** `/api/v1/orders` - Orders Index
- **GET** `/api/v1/orders/:id` - Show Order

### **📞 Contact**
- **POST** `/api/v1/contact_us_requests` - Create Contact Request

## 🔑 **Authentication Headers**

The API uses Devise Token Auth with these headers:
- `access-token`
- `token-type`
- `client`
- `expiry`
- `uid`
- `X-Origin` (for CORS)

## 🌐 **Environment Variables**

- `{{url}}` - Base API URL
- `{{x-origin}}` - Origin header for CORS

## 📝 **Sample Request Bodies**

### Customer Signup
```json
{
    "customer": {
        "email": "juan@test.com",
        "password": "Password?12",
        "password_confirmation": "Password?12",
        "first_name": "Nano",
        "last_name": "Eizmendi"
    }
}
```

### Customer SignIn
```json
{
    "customer": {
        "email": "juan@test.com",
        "password": "Password?12"
    }
}
```
