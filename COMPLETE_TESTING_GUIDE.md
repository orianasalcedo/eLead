# eLead Promo - Complete Testing Guide

## 🎯 **Ready to Test!**

Based on the Postman collection analysis, we now have a complete testing framework ready for eLead Promo.

## 📊 **What We've Built**

### **1. API Tests** ✅
- **File**: `cypress/e2e/api/api-smoke-tests.cy.js`
- **Coverage**: Store settings, categories, countries, payment methods, shipping methods, customer authentication
- **Xray Integration**: All tests linked to Xray test cases

### **2. UI Tests** ✅
- **File**: `cypress/e2e/features/slideshow-multi-env.cy.js`
- **Coverage**: Slideshow functionality across QA and STG environments
- **Environment-Aware**: Automatically adapts to QA/STG

### **3. Custom Commands** ✅
- `cy.apiRequest()` - Enhanced for eLead Promo API
- `cy.eleadpromoLogin()` - Customer authentication
- `cy.authenticatedApiRequest()` - Authenticated API calls
- `cy.xrayTestCase()` - Xray integration

## 🚀 **Available Test Commands**

### **API Tests**
```bash
# Run API smoke tests in QA
npm run test:qa:api:smoke

# Run API smoke tests in STG
npm run test:stg:api:smoke

# Run all API tests in QA
npm run test:qa:api

# Run all API tests in STG
npm run test:stg:api
```

### **UI Tests**
```bash
# Run slideshow tests in QA
npm run test:qa -- --spec "cypress/e2e/features/slideshow-multi-env.cy.js"

# Run slideshow tests in STG
npm run test:stg -- --spec "cypress/e2e/features/slideshow-multi-env.cy.js"
```

### **Open Cypress Test Runner**
```bash
# Open Cypress for QA
npm run test:qa:open

# Open Cypress for STG
npm run test:stg:open
```

## 🧪 **Test Coverage**

### **API Endpoints Tested**
- ✅ `GET /api/v1/store_settings` - Store configuration
- ✅ `GET /api/v1/home_settings` - Home page settings
- ✅ `GET /api/v1/categories` - Product categories
- ✅ `GET /api/v1/countries` - Available countries
- ✅ `GET /api/v1/payment_methods` - Payment options
- ✅ `GET /api/v1/shipping_methods` - Shipping options
- ✅ `POST /api/v1/customers/sign_in` - Customer authentication

### **UI Components Tested**
- ✅ Slideshow carousel functionality
- ✅ Auto-play behavior
- ✅ Date restrictions
- ✅ Click interactions

## 🔧 **Environment Configuration**

### **QA Environment**
- **Frontend**: https://tienda1.qa.eleaddev.com/
- **API**: https://api.qa.eleaddev.com/
- **Test User**: `oriana.salcedo@rootstrap.com` / `Testing2!`

### **STG Environment**
- **Frontend**: https://aya.stg.eleaddev.com/
- **API**: https://api.stg.eleaddev.com/
- **Test User**: `oriana.salcedo@rootstrap.com` / `Testing2!`

## 🎯 **Recommended First Test**

### **Start with API Smoke Tests**
```bash
# Run API smoke tests in QA environment
npm run test:qa:api:smoke
```

This will test:
1. Store settings endpoint
2. Home settings endpoint
3. Categories endpoint
4. Countries endpoint
5. Payment methods endpoint
6. Shipping methods endpoint
7. Customer signin (valid credentials)
8. Customer signin (invalid credentials)

## 📋 **Next Steps**

### **1. Run First Test**
```bash
npm run test:qa:api:smoke
```

### **2. Verify Results**
- Check console output for API responses
- Verify Xray integration is working
- Confirm environment configuration

### **3. Expand Test Coverage**
- Add more API endpoints
- Implement UI tests for other components
- Add integration tests

## 🔗 **Project Resources**

- **Jira Board**: https://rootstrap.atlassian.net/jira/software/c/projects/ELP/boards/248
- **API Analysis**: `docs/API_ANALYSIS.md`
- **Postman Collection**: `elead-promo.postman_collection.json`
- **Test Data**: `cypress/fixtures/eleadpromo-test-data.json`

## 📝 **Notes**

- **Authentication**: Uses Devise Token Auth with headers
- **CORS**: X-Origin header required for API requests
- **Error Handling**: Comprehensive error logging and handling
- **Xray Integration**: All tests linked to Xray test cases
- **Environment Switching**: Automatic environment detection

## 🚀 **Ready to Test!**

**Run your first test:**
```bash
npm run test:qa:api:smoke
```

**We're fully configured and ready to start testing! 🎉**
