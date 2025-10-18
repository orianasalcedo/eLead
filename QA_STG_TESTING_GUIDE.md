# eLead Promo - QA & STG Environment Testing Guide

## 🎯 **Environment Configuration**

### **QA Environment (Primary)**
- **Frontend**: https://tienda1.qa.eleaddev.com/
- **Admin**: https://api.qa.eleaddev.com/
- **API**: https://api.qa.eleaddev.com/
- **Environment**: `qa`

### **STG Environment (Secondary)**
- **Frontend**: https://aya.stg.eleaddev.com/
- **Admin**: https://api.stg.eleaddev.com/
- **API**: https://api.stg.eleaddev.com/
- **Environment**: `staging`

## 🚀 **Available Test Commands**

### **QA Environment Tests**
```bash
# Run all tests in QA environment
npm run test:qa

# Open Cypress Test Runner for QA
npm run test:qa:open

# Run smoke tests in QA
npm run test:qa:smoke

# Run feature tests in QA
npm run test:qa:features
```

### **STG Environment Tests**
```bash
# Run all tests in STG environment
npm run test:stg

# Open Cypress Test Runner for STG
npm run test:stg:open

# Run smoke tests in STG
npm run test:stg:smoke

# Run feature tests in STG
npm run test:stg:features
```

## 👥 **Test Users**

### **QA Environment**
- **Admin**: `admin@example.com` / `Password?1`
- **Customer**: `oriana.salcedo@rootstrap.com` / `Testing2!`

### **STG Environment**
- **Admin**: `oriana.salcedo@rootstrap.com` / `Testing2!`
- **Customer**: `oriana.salcedo@rootstrap.com` / `Testing2!`

## 🧪 **First Test Implementation**

### **Test: Slideshow Component**
- **File**: `cypress/e2e/features/slideshow-multi-env.cy.js`
- **Xray ID**: ELP-4078
- **Description**: Slideshow carousel auto-plays through all slide_show child pages

### **How to Run**
```bash
# Test in QA environment
npm run test:qa -- --spec "cypress/e2e/features/slideshow-multi-env.cy.js"

# Test in STG environment
npm run test:stg -- --spec "cypress/e2e/features/slideshow-multi-env.cy.js"
```

## 🔧 **Environment Variables**

### **QA Environment** (`env.development`)
```bash
BASE_URL=https://tienda1.qa.eleaddev.com
API_URL=https://api.qa.eleaddev.com
ADMIN_URL=https://api.qa.eleaddev.com
TEST_USER_EMAIL=oriana.salcedo@rootstrap.com
TEST_USER_PASSWORD=Testing2!
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Password?1
CYPRESS_ENV=qa
```

### **STG Environment** (`env.staging`)
```bash
BASE_URL=https://aya.stg.eleaddev.com
API_URL=https://api.stg.eleaddev.com
ADMIN_URL=https://api.stg.eleaddev.com
TEST_USER_EMAIL=oriana.salcedo@rootstrap.com
TEST_USER_PASSWORD=Testing2!
ADMIN_EMAIL=oriana.salcedo@rootstrap.com
ADMIN_PASSWORD=Testing2!
CYPRESS_ENV=staging
```

## 📊 **Test Data**

### **Available Test Data**
- **Products**: Available in admin panel
- **Addresses**: Created through store signup
- **Payment Methods**: Configured in admin panel
- **Test Data File**: `cypress/fixtures/eleadpromo-test-data.json`

## 🎯 **Next Steps**

### **1. Run First Test**
```bash
# Test slideshow functionality in QA
npm run test:qa:open
# Then select: cypress/e2e/features/slideshow-multi-env.cy.js
```

### **2. Verify Environment Configuration**
- Check that URLs are correct
- Verify test user credentials work
- Confirm Xray integration is set up

### **3. Implement Additional Tests**
- Address Management tests
- Payment Method tests
- Inventory Management tests

## 🔗 **Project Links**

- **Jira Board**: https://rootstrap.atlassian.net/jira/software/c/projects/ELP/boards/248
- **QA Drive**: https://drive.google.com/drive/u/0/folders/1rKOBGglbQ8noyd4gekSl25if7LZ9ULb7
- **PRD**: https://docs.google.com/document/d/1BjTLCaJ_XpcO9-5YxstPcI5lQNZ-a3Dn0gX-qDjMrmg/edit?usp=drive_link
- **Figma**: https://www.figma.com/design/2XxYpKMC7GxurowxXgQAtZ/eLead-Promo-%2F-UI?node-id=2002-4744&node-type=canvas&t=TvCeuuh4kosN9KaD-0

## 📝 **Notes**

- **Customer Creation**: Customers are created through store signup - avoid creating new ones for each test
- **Admin Users**: Must be created by BE team
- **Test Data**: Use existing test data from admin panel
- **Environment Switching**: Use `CYPRESS_ENV` variable to switch between environments
