# Environment Setup Guide

## Quick Start

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Update with your values:**
   - Set `BASE_URL` to your application URL
   - Set `API_URL` to your API endpoint
   - Update test user credentials

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run tests:**
   ```bash
   # Development environment
   npm run test:dev
   
   # Staging environment
   npm run test:staging
   
   # Production environment
   npm run test:prod
   ```

## Environment Variables

### Required Variables
- `BASE_URL` - Your application base URL
- `API_URL` - Your API base URL

### Optional Variables
- `TEST_USER_EMAIL` - Test user email
- `TEST_USER_PASSWORD` - Test user password
- `ENABLE_NEW_FEATURE` - Feature flag (true/false)
- `CYPRESS_ENV` - Environment name (development/staging/production)

## Environment-Specific Configuration

### Development
```bash
BASE_URL=http://localhost:3000
API_URL=http://localhost:3000/api
CYPRESS_ENV=development
```

### Staging
```bash
BASE_URL=https://staging.example.com
API_URL=https://staging.example.com/api
CYPRESS_ENV=staging
```

### Production
```bash
BASE_URL=https://example.com
API_URL=https://example.com/api
CYPRESS_ENV=production
```

## CI/CD Secrets

Add these secrets to your GitHub repository:

- `BASE_URL` - Base URL for tests
- `API_URL` - API URL for tests
- `TEST_USER_EMAIL` - Test user email
- `TEST_USER_PASSWORD` - Test user password
- `STAGING_URL` - Staging environment URL
- `PRODUCTION_URL` - Production environment URL
- `STAGING_API_URL` - Staging API URL
- `PRODUCTION_API_URL` - Production API URL
