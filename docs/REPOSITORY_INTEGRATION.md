# eLead Promo - Repository Configuration

## Repository Information
- **Frontend/Storefront**: https://github.com/rootstrap/eleadpromo-nextjs.git
- **Admin Dashboard**: https://github.com/rootstrap/e-lead-promo-admin.git
- **Frontend Branch**: eleadpromo-nextjs-dev
- **Admin Branch**: e-lead-promo-admin-develop
- **Access**: Private

## Environment Configuration

### Development Environment
```bash
# Frontend (Next.js)
FRONTEND_URL=http://localhost:3000
FRONTEND_REPO=https://github.com/rootstrap/eleadpromo-nextjs.git

# Admin Dashboard
ADMIN_URL=http://localhost:3001
ADMIN_REPO=https://github.com/rootstrap/e-lead-promo-admin.git

# API
API_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000/api

# Database
DATABASE_URL=postgresql://localhost:5432/eleadpromo

# External Services
TAXCLOUD_API_KEY=your-taxcloud-key
TAXCLOUD_API_ID=your-taxcloud-id
XPEDITE_API_URL=https://api.xpedite.com
XPEDITE_API_KEY=your-xpedite-key

# Email (AWS SES)
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@eleadpromo.com
```

### Test Environment
```bash
# Test URLs
TEST_FRONTEND_URL=https://staging-store.eleadpromo.com
TEST_ADMIN_URL=https://staging-admin.eleadpromo.com
TEST_API_URL=https://staging-api.eleadpromo.com

# Test Database
TEST_DATABASE_URL=postgresql://test-db:5432/eleadpromo_test

# Test Services
TEST_TAXCLOUD_API_KEY=test-taxcloud-key
TEST_XPEDITE_API_URL=https://test-api.xpedite.com
```

## Project Structure Analysis Needed

### Frontend (Next.js) - eleadpromo-nextjs
```
src/
├── components/
│   ├── checkout/
│   ├── product/
│   ├── cart/
│   └── address/
├── pages/
│   ├── checkout/
│   ├── product/
│   └── cart/
├── hooks/
├── utils/
└── types/
```

### Admin Dashboard - e-lead-promo-admin
```
src/
├── components/
│   ├── orders/
│   ├── products/
│   ├── customers/
│   └── settings/
├── pages/
│   ├── orders/
│   ├── products/
│   └── customers/
├── hooks/
├── utils/
└── types/
```

## API Endpoints to Identify

### Frontend API Calls
- Authentication endpoints
- Product listing and details
- Cart management
- Checkout process
- Address management
- Payment processing

### Admin API Calls
- Order management
- Product management
- Customer management
- Inventory tracking
- Settings configuration

## Test Data Requirements

### Test Users
- Admin users (full access)
- Store users (limited access)
- Customer accounts
- Verified email addresses (for email testing)

### Test Products
- Apparel products (t-shirts, hoodies)
- Non-apparel products (mugs, speakers)
- Products with different color options
- Products with logo requirements
- Inventoried vs non-inventoried products

### Test Stores
- Company stores with full features
- Stores with different configurations
- Stores with different payment methods

### Test Orders
- Orders with different payment methods
- Orders with gift codes
- Orders with multiple products
- Orders with different shipping methods
- Bill Me Later orders (with constraints)

## Selector Strategy

### Frontend Selectors
```javascript
// Checkout flow
'[data-testid="address-dropdown"]'
'[data-testid="continue-button"]'
'[data-testid="payment-method"]'
'[data-testid="gift-code-input"]'

// Product pages
'[data-testid="product-image"]'
'[data-testid="color-selector"]'
'[data-testid="add-to-cart"]'

// Cart
'[data-testid="cart-item"]'
'[data-testid="quantity-input"]'
'[data-testid="checkout-button"]'
```

### Admin Selectors
```javascript
// Order management
'[data-testid="order-row"]'
'[data-testid="order-status"]'
'[data-testid="order-details"]'

// Product management
'[data-testid="product-row"]'
'[data-testid="edit-product"]'
'[data-testid="inventory-status"]'

// Customer management
'[data-testid="customer-row"]'
'[data-testid="customer-details"]'
'[data-testid="order-history"]'
```

## Integration Points

### Xray Integration
- Test case IDs: ELP-XXXX format
- Test execution reporting
- Result upload to Xray
- Step-by-step tracking

### External Services
- TaxCloud integration
- Xpedite fulfillment
- AWS SES email
- Payment gateways

## Next Steps

1. **Analyze Repository Structure**
   - Review package.json files
   - Identify main components and pages
   - Understand API structure

2. **Update Test Framework**
   - Align selectors with actual implementation
   - Update API endpoints
   - Configure environment variables

3. **Implement Real Tests**
   - Replace placeholder tests with actual implementations
   - Test real business logic
   - Validate integration points

4. **Configure CI/CD**
   - Set up GitHub Actions
   - Configure test environments
   - Integrate with Xray reporting
