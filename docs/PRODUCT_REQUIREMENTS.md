# Product Requirements Document (PRD) - eLead Promo

## Overview
This document outlines the complete requirements for the eLead Promo e-commerce platform, including admin management features, customer-facing functionality, and business logic.

## Table of Contents
1. [Incentives Management](#incentives-management)
2. [Product Management](#product-management)
3. [Orders Management](#orders-management)
4. [Customer Management](#customer-management)
5. [Payment Methods](#payment-methods)
6. [Themes & Site Settings](#themes--site-settings)
7. [Shipping Settings](#shipping-settings)
8. [Pricing Rules](#pricing-rules)
9. [Inventory Management](#inventory-management)
10. [Email Notifications](#email-notifications)
11. [Business Logic](#business-logic)

---

## Incentives Management

### Overview
The Incentives section allows administrators to manage promotional codes (Gift Codes, User Codes, and Promo Codes) for each store.

### Features
- **Gift Codes**: Unique monetary codes with expiration dates
- **User Codes**: Gift codes assigned to specific users
- **Promo Codes**: Promotional codes with discounts

### Admin Workflow
1. Navigate to Sites → Select Store → Incentives tab
2. Toggle between "Gift Codes" and "Promo Codes"
3. Manage codes with CRUD operations
4. Import/Export functionality
5. Email distribution

### Test Scenarios
- Create new gift code
- Assign gift code to user
- Apply promo code during checkout
- Validate code expiration
- Test code usage limits

---

## Product Management

### Overview
Administrators can add and edit products for stores, including color options, logo positioning, and inventory management.

### Features
- **Product Editing**: Modify existing product attributes
- **Color Management**: Manage color variants with logo options
- **Batch Operations**: Add multiple products at once
- **Location Assignment**: Assign products to specific locations

### Admin Workflow
1. Navigate to Stores → Select Store → Products tab
2. View product list with search/filter options
3. Edit existing products or add new ones
4. Configure color options and logo positioning
5. Assign to locations

### Test Scenarios
- Add new product to store
- Edit product attributes
- Configure color options
- Assign products to locations
- Test batch operations

---

## Orders Management

### Overview
Comprehensive order management system with filtering, detailed views, and status management.

### Features
- **Order List**: Table view with filtering options
- **Order Details**: Complete order information
- **Status Management**: Order, payment, and shipping status
- **Invoice Management**: Generate and print invoices
- **Shipment Tracking**: Manage shipments and notifications

### Admin Workflow
1. Navigate to Orders section
2. Apply filters (Site, Status, Date Range)
3. View order list
4. Click "View Order Details" for detailed view
5. Manage order status and shipments

### Test Scenarios
- View order list with filters
- Access order details
- Update order status
- Manage shipments
- Generate invoices
- Test notification system

---

## Customer Management

### Overview
Customer data management with profile viewing, order history, and account management.

### Features
- **Customer List**: Table view with search functionality
- **Customer Details**: View and edit customer information
- **Order History**: View customer's order history
- **Account Management**: Send new passwords, manage accounts

### Admin Workflow
1. Navigate to Customers section
2. Filter by store if needed
3. Search customers by name/company
4. Use action menu for customer operations
5. Add new customers as needed

### Test Scenarios
- View customer list
- Search customers
- View customer details
- Access order history
- Send new password
- Add new customer

---

## Payment Methods

### Overview
Manage payment methods for stores including credit card, corporate credit card, and Bill Me Later options.

### Features
- **Payment Method Configuration**: Enable/disable methods
- **Priority Settings**: Set display order
- **Tax Configuration**: Configure tax settings
- **Gift Code Integration**: Enable gift codes per method

### Admin Workflow
1. Navigate to Stores → Select Store → More → Payment Methods
2. View payment methods list
3. Edit payment method settings
4. Configure priorities and tax settings
5. Set up invoice notifications

### Test Scenarios
- Configure payment methods
- Set payment priorities
- Test tax settings
- Enable/disable gift codes
- Configure invoice notifications

---

## Themes & Site Settings

### Overview
Comprehensive theme and site configuration including checkout flow customization, email settings, and site management.

### Features
- **Checkout Customization**: Configure checkout steps
- **Theme Settings**: Customize store appearance
- **Email Configuration**: Set up email notifications
- **Site Management**: Activate/deactivate sites
- **Security Settings**: Password protection, access codes

### Admin Workflow
1. Navigate to Stores → Select Store → Themes/Settings
2. Configure checkout flow options
3. Set up theme preferences
4. Configure email notifications
5. Manage site settings

### Test Scenarios
- Configure checkout flow
- Set up theme options
- Test email notifications
- Manage site settings
- Test security features

---

## Shipping Settings

### Overview
Shipping configuration including rates, handling fees, and country selection.

### Features
- **Shipping Rates**: Configure base price and per-pound rates
- **Country Selection**: Set shipping destinations
- **Handling Fees**: Configure decorator handling fees
- **Shipping Labels**: Customize shipping labels

### Admin Workflow
1. Navigate to Stores → Select Store → More → Shipping
2. Configure shipping rates
3. Set up country/state selection
4. Configure handling fees
5. Customize shipping labels

### Test Scenarios
- Configure shipping rates
- Set up country selection
- Test handling fee calculation
- Customize shipping labels
- Test shipping cost calculation

---

## Pricing Rules

### Overview
Profit margin management with quantity-based pricing rules.

### Features
- **Margin Configuration**: Set profit margins
- **Quantity Ranges**: Configure quantity-based pricing
- **Rule Management**: Add, edit, delete pricing rules

### Admin Workflow
1. Navigate to Stores → Select Store → More → Pricing Rules
2. View existing pricing rules
3. Add new pricing rules
4. Configure quantity ranges
5. Set profit margins

### Test Scenarios
- Create pricing rules
- Configure quantity ranges
- Test margin calculations
- Edit existing rules
- Delete pricing rules

---

## Inventory Management

### Overview
Inventory tracking system for product variants with transaction management.

### Features
- **Inventory Tracking**: Track product variants
- **Transaction Management**: Manage sales and adjustments
- **Stock Management**: Update inventory levels
- **Product Variants**: Manage color/size combinations

### Admin Workflow
1. Navigate to Sites → Inventory
2. Select site to view inventory
3. Search for specific products
4. Manage transactions
5. Update stock levels

### Test Scenarios
- View inventory list
- Search inventory items
- Manage transactions
- Update stock levels
- Test automatic transactions

---

## Email Notifications

### Overview
Comprehensive email notification system for customers and administrators.

### Features
- **Customer Emails**: Registration, order confirmation, shipping
- **Admin Notifications**: Order notifications, contact us
- **Email Configuration**: Set up email addresses and content
- **Template Management**: Customize email templates

### Admin Workflow
1. Configure notification recipients in Site Settings
2. Set up email addresses
3. Customize email content in Themes
4. Test email delivery
5. Monitor email status

### Test Scenarios
- Test registration emails
- Verify order confirmations
- Test shipping notifications
- Configure admin notifications
- Test email templates

---

## Business Logic

### Price Calculation
The system calculates final product prices using:
1. **Base Price**: Supplier price from master products
2. **Decorator Costs**: Printing costs based on logo colors
3. **Personalization**: Additional costs for customization
4. **Pricing Rules**: Profit margins (typically 30%)
5. **Shipping**: Base price + (rate per pound × weight)
6. **Handling Fees**: Decorator-specific fees
7. **Taxes**: Based on destination state

### Order Status Flow
1. **Order Created**: Status = "Processed"
2. **Payment Received**: Status = "Confirmed"
3. **Shipment Sent**: Status = "Completed"
4. **Error Handling**: Status = "Backorder" or "Canceled"

### Key Business Rules
- Gift codes cannot be used with "Bill Me Later"
- Minimum quantity requirements for certain payment methods
- Decorator costs vary by logo complexity
- Handling fees can be included in shipping or displayed separately
- Inventory transactions are automatic for sales, manual for adjustments

---

## Test Data Requirements

### Test Users
- Admin users with full access
- Store users with limited access
- Customer accounts for testing

### Test Products
- Apparel products (t-shirts, hoodies)
- Non-apparel products (mugs, speakers)
- Products with different color options
- Products with logo requirements

### Test Stores
- Company stores with full features
- Popup shops with limited features
- Stores with different configurations

### Test Orders
- Orders with different payment methods
- Orders with gift codes
- Orders with multiple products
- Orders with different shipping methods

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Stores
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store details
- `PUT /api/stores/:id` - Update store

### Products
- `GET /api/stores/:id/products` - List store products
- `POST /api/stores/:id/products` - Add product to store
- `PUT /api/products/:id` - Update product

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Customers
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer details
- `POST /api/customers` - Create customer

---

## Security Considerations

### Access Control
- Role-based permissions
- Store-specific access
- Feature-level restrictions

### Data Protection
- Sensitive data encryption
- Secure API endpoints
- Audit logging

### Compliance
- PCI DSS for payment processing
- Data privacy regulations
- Secure communication protocols

---

## Performance Requirements

### Response Times
- Page load: < 3 seconds
- API responses: < 1 second
- Search results: < 2 seconds

### Scalability
- Support for multiple stores
- Concurrent user access
- Database optimization

### Monitoring
- Error tracking
- Performance metrics
- User activity logging

---

## Future Enhancements

### Planned Features
- Real-time shipping tracking
- ACH payment option with fees
- Product image carousels
- Enhanced reporting

### Technical Improvements
- API optimization
- Database performance
- Caching strategies
- Mobile responsiveness

---

## Conclusion

This PRD provides a comprehensive overview of the eLead Promo platform requirements. The system is designed to handle complex e-commerce operations with multiple stores, products, and customer management features. The modular architecture allows for flexible configuration and scalability.

For implementation, prioritize core features first (Orders, Products, Customers) followed by advanced features (Incentives, Pricing Rules, Inventory). Ensure thorough testing of business logic, especially price calculations and order status flows.
