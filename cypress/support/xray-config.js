/**
 * Xray Configuration
 * Configuration settings for Xray integration
 */

const xrayConfig = {
  // Xray Cloud configuration
  cloud: {
    clientId: Cypress.env('XRAY_CLIENT_ID') || 'your-client-id',
    clientSecret: Cypress.env('XRAY_CLIENT_SECRET') || 'your-client-secret',
    baseUrl: 'https://xray.cloud.getxray.app/api/v2'
  },
  
  // Xray Server configuration (if using Xray Server)
  server: {
    username: Cypress.env('XRAY_USERNAME') || 'your-username',
    password: Cypress.env('XRAY_PASSWORD') || 'your-password',
    baseUrl: Cypress.env('XRAY_SERVER_URL') || 'https://your-jira-instance.com'
  },
  
  // Test execution settings
  execution: {
    // Test execution key prefix
    keyPrefix: 'EXEC',
    
    // Test plan key (optional)
    testPlanKey: Cypress.env('XRAY_TEST_PLAN_KEY') || null,
    
    // Test environment
    environment: Cypress.env('XRAY_ENVIRONMENT') || 'Cypress',
    
    // Test version
    version: Cypress.env('XRAY_VERSION') || '1.0',
    
    // Test revision
    revision: Cypress.env('XRAY_REVISION') || '1'
  },
  
  // Upload settings
  upload: {
    // Whether to upload results automatically after test run
    autoUpload: Cypress.env('XRAY_AUTO_UPLOAD') === 'true' || false,
    
    // Whether to upload screenshots as attachments
    uploadScreenshots: Cypress.env('XRAY_UPLOAD_SCREENSHOTS') === 'true' || true,
    
    // Whether to upload videos as attachments
    uploadVideos: Cypress.env('XRAY_UPLOAD_VIDEOS') === 'true' || false,
    
    // Maximum file size for attachments (in MB)
    maxFileSize: parseInt(Cypress.env('XRAY_MAX_FILE_SIZE')) || 10
  },
  
  // Test result mapping
  statusMapping: {
    'PASSED': 'PASS',
    'FAILED': 'FAIL',
    'SKIPPED': 'TODO',
    'PENDING': 'TODO'
  },
  
  // Test case ID patterns
  testIdPatterns: [
    /ELP-\d+/,  // ELP-1234 format
    /TEST-\d+/, // TEST-1234 format
    /TC-\d+/    // TC-1234 format
  ]
};

module.exports = xrayConfig;
