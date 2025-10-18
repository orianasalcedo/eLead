const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class CSVToCypressConverter {
  constructor() {
    this.testCases = [];
    this.features = new Map();
  }

  async parseCSV(csvFilePath) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // Filter only Test type issues
          if (row['Issue Type'] === 'Test') {
            this.testCases.push(row);
          }
        })
        .on('end', () => {
          console.log(`Parsed ${this.testCases.length} test cases from CSV`);
          resolve();
        })
        .on('error', reject);
    });
  }

  categorizeByFeature() {
    this.testCases.forEach(testCase => {
      const summary = testCase.Summary || '';
      const description = testCase.Description || '';
      
      // Extract feature from summary or description
      let feature = this.extractFeature(summary, description);
      
      if (!this.features.has(feature)) {
        this.features.set(feature, []);
      }
      
      this.features.get(feature).push(testCase);
    });

    console.log(`Categorized tests into ${this.features.size} features:`);
    this.features.forEach((tests, feature) => {
      console.log(`  - ${feature}: ${tests.length} tests`);
    });
  }

  extractFeature(summary, description) {
    // Common feature patterns based on the test summaries
    const featurePatterns = [
      { pattern: /xpedite/i, feature: 'Xpedite Integration' },
      { pattern: /aat/i, feature: 'AAT (Automated Acceptance Testing)' },
      { pattern: /dropdown|address/i, feature: 'Address Management' },
      { pattern: /tax|shipping|handling/i, feature: 'Tax and Shipping' },
      { pattern: /slideshow|carousel/i, feature: 'Slideshow Component' },
      { pattern: /brand|product.*match/i, feature: 'Product Matching' },
      { pattern: /page.*type|parent.*page|child.*page/i, feature: 'Page Management' },
      { pattern: /ghostcard|payment.*method/i, feature: 'Payment Methods' },
      { pattern: /stock|inventory|availability/i, feature: 'Inventory Management' },
      { pattern: /email|notification/i, feature: 'Email Notifications' },
      { pattern: /order.*confirmation|sale.*transaction/i, feature: 'Order Processing' },
      { pattern: /ui.*display|display.*ui/i, feature: 'UI Display' }
    ];

    const combinedText = `${summary} ${description}`.toLowerCase();
    
    for (const { pattern, feature } of featurePatterns) {
      if (pattern.test(combinedText)) {
        return feature;
      }
    }

    // Default fallback
    return 'General Features';
  }

  generateCypressTest(feature, testCases) {
    const featureName = feature.replace(/\s+/g, '-').toLowerCase();
    const testContent = this.createTestFileContent(feature, testCases);
    
    const outputDir = path.join(__dirname, '..', 'cypress', 'e2e', 'features');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileName = `${featureName}.cy.js`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, testContent);
    console.log(`Generated: ${fileName}`);
    
    return filePath;
  }

  createTestFileContent(feature, testCases) {
    const featureDescription = this.getFeatureDescription(feature);
    
    let content = `/**
 * ${feature} Tests
 * Generated from Xray test cases
 * 
 * ${featureDescription}
 */

describe('${feature}', () => {
  beforeEach(() => {
    // Setup for ${feature} tests
    cy.visit('/');
  });

`;

    testCases.forEach((testCase, index) => {
      const testId = testCase['Issue key'] || `TEST-${index + 1}`;
      const summary = testCase.Summary || 'Untitled Test';
      const description = testCase.Description || '';
      const priority = testCase.Priority || 'Medium';
      
      // Clean up test name for Cypress
      const testName = this.sanitizeTestName(summary);
      
      content += `  it('${testName}', () => {
    // Xray Test ID: ${testId}
    // Priority: ${priority}
    // Description: ${description.replace(/\n/g, ' ').substring(0, 100)}...
    
    // TODO: Implement test steps based on Xray test case
    // This is a placeholder - replace with actual test implementation
    
    cy.log('Test case: ${testId}');
    cy.log('Summary: ${summary}');
    
    // Example test structure - customize based on actual requirements
    cy.get('body').should('be.visible');
    
    // Add specific test steps here based on the test case requirements
    // Example:
    // cy.get('[data-testid="element"]').should('be.visible');
    // cy.get('[data-testid="button"]').click();
    // cy.url().should('include', '/expected-path');
  });

`;
    });

    content += `});
`;

    return content;
  }

  getFeatureDescription(feature) {
    const descriptions = {
      'Xpedite Integration': 'Tests for Xpedite shipment and order processing integration',
      'AAT (Automated Acceptance Testing)': 'Automated acceptance testing scenarios for order processing',
      'Address Management': 'Tests for address dropdown, selection, and management functionality',
      'Tax and Shipping': 'Tests for tax calculation, shipping costs, and handling fees',
      'Slideshow Component': 'Tests for slideshow carousel functionality and navigation',
      'Product Matching': 'Tests for product matching, brand visibility, and supplier integration',
      'Page Management': 'Tests for parent/child page creation, editing, and management',
      'Payment Methods': 'Tests for payment method configuration and GhostCard functionality',
      'Inventory Management': 'Tests for stock availability, inventory updates, and product visibility',
      'Email Notifications': 'Tests for order confirmation emails and notification system',
      'Order Processing': 'Tests for order creation, confirmation, and transaction processing',
      'UI Display': 'Tests for UI elements display and user interface functionality',
      'General Features': 'General feature tests that don\'t fit into specific categories'
    };
    
    return descriptions[feature] || 'Feature-specific test cases';
  }

  sanitizeTestName(name) {
    return name
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
      .substring(0, 100); // Limit length
  }

  generateFeatureIndex() {
    const indexContent = `/**
 * Feature Test Index
 * Generated from Xray test cases
 * 
 * This file provides an overview of all feature test files
 */

describe('Feature Test Index', () => {
  it('should have all feature test files', () => {
    const features = [
${Array.from(this.features.keys()).map(feature => `      '${feature}'`).join(',\n')}
    ];
    
    features.forEach(feature => {
      cy.log(\`Feature: \${feature} - \${this.features.get(feature).length} tests\`);
    });
    
    // Verify we have tests for all features
    expect(features.length).to.be.greaterThan(0);
  });
});
`;

    const outputDir = path.join(__dirname, '..', 'cypress', 'e2e', 'features');
    const indexPath = path.join(outputDir, 'feature-index.cy.js');
    fs.writeFileSync(indexPath, indexContent);
    console.log('Generated: feature-index.cy.js');
  }

  generateTestSummary() {
    const summary = {
      totalTests: this.testCases.length,
      features: Array.from(this.features.entries()).map(([name, tests]) => ({
        name,
        testCount: tests.length,
        testIds: tests.map(t => t['Issue key']).filter(Boolean)
      })),
      generatedAt: new Date().toISOString()
    };

    const summaryPath = path.join(__dirname, '..', 'cypress', 'e2e', 'features', 'test-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log('Generated: test-summary.json');
  }

  async convert(csvFilePath) {
    try {
      console.log('Starting CSV to Cypress conversion...');
      
      await this.parseCSV(csvFilePath);
      this.categorizeByFeature();
      
      // Generate test files for each feature
      const generatedFiles = [];
      this.features.forEach((testCases, feature) => {
        const filePath = this.generateCypressTest(feature, testCases);
        generatedFiles.push(filePath);
      });
      
      this.generateFeatureIndex();
      this.generateTestSummary();
      
      console.log('\nConversion completed successfully!');
      console.log(`Generated ${generatedFiles.length} feature test files`);
      console.log(`Total test cases processed: ${this.testCases.length}`);
      
      return generatedFiles;
    } catch (error) {
      console.error('Error during conversion:', error);
      throw error;
    }
  }
}

// CLI usage
if (require.main === module) {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.error('Usage: node csv-to-cypress-converter.js <path-to-csv-file>');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }
  
  const converter = new CSVToCypressConverter();
  converter.convert(csvFilePath)
    .then(() => {
      console.log('\nNext steps:');
      console.log('1. Review generated test files in cypress/e2e/features/');
      console.log('2. Implement actual test logic for each test case');
      console.log('3. Update test data and selectors as needed');
      console.log('4. Run tests with: npx cypress run --spec "cypress/e2e/features/**/*.cy.js"');
    })
    .catch(error => {
      console.error('Conversion failed:', error);
      process.exit(1);
    });
}

module.exports = CSVToCypressConverter;
