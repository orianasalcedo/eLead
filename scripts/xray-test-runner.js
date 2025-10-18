#!/usr/bin/env node

/**
 * Xray Test Runner
 * Runs Cypress tests and uploads results to Xray
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class XrayTestRunner {
  constructor() {
    this.config = this.loadConfig();
    this.results = [];
  }

  loadConfig() {
    // Load environment variables
    require('dotenv').config();
    
    return {
      xrayClientId: process.env.XRAY_CLIENT_ID,
      xrayClientSecret: process.env.XRAY_CLIENT_SECRET,
      xrayServerUrl: process.env.XRAY_SERVER_URL,
      xrayUsername: process.env.XRAY_USERNAME,
      xrayPassword: process.env.XRAY_PASSWORD,
      testPlanKey: process.env.XRAY_TEST_PLAN_KEY,
      environment: process.env.XRAY_ENVIRONMENT || 'Cypress',
      version: process.env.XRAY_VERSION || '1.0',
      autoUpload: process.env.XRAY_AUTO_UPLOAD === 'true',
      uploadScreenshots: process.env.XRAY_UPLOAD_SCREENSHOTS === 'true',
      uploadVideos: process.env.XRAY_UPLOAD_VIDEOS === 'true'
    };
  }

  async runTests(specPattern = 'cypress/e2e/features/**/*.cy.js') {
    console.log('🚀 Starting Cypress test execution...');
    console.log(`📁 Spec pattern: ${specPattern}`);
    
    try {
      // Run Cypress tests
      const command = `npx cypress run --spec "${specPattern}" --reporter json --reporter-options output=results.json`;
      console.log(`🔧 Running command: ${command}`);
      
      execSync(command, { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      
      console.log('✅ Tests completed successfully');
      
      // Load test results
      this.loadResults();
      
      // Upload to Xray if enabled
      if (this.config.autoUpload) {
        await this.uploadToXray();
      }
      
    } catch (error) {
      console.error('❌ Test execution failed:', error.message);
      process.exit(1);
    }
  }

  loadResults() {
    const resultsFile = path.join(process.cwd(), 'results.json');
    
    if (fs.existsSync(resultsFile)) {
      const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
      this.results = results.runs || [];
      console.log(`📊 Loaded ${this.results.length} test run results`);
    } else {
      console.log('⚠️  No results file found');
    }
  }

  async uploadToXray() {
    console.log('📤 Uploading results to Xray...');
    
    try {
      // Generate Xray execution report
      const executionReport = this.generateExecutionReport();
      
      // Upload to Xray
      const response = await this.uploadExecutionReport(executionReport);
      
      console.log(`✅ Results uploaded successfully`);
      console.log(`🔗 Test Execution Key: ${response.testExecutionKey}`);
      
      // Save execution key for reference
      this.saveExecutionKey(response.testExecutionKey);
      
    } catch (error) {
      console.error('❌ Failed to upload to Xray:', error.message);
      throw error;
    }
  }

  generateExecutionReport() {
    const tests = [];
    
    this.results.forEach(run => {
      run.tests.forEach(test => {
        // Extract test case ID from test title
        const testId = this.extractTestId(test.title);
        
        if (testId) {
          tests.push({
            testKey: testId,
            status: this.mapStatus(test.state),
            comment: test.title,
            executedBy: 'cypress-automation',
            executedOn: new Date().toISOString(),
            duration: test.duration || 0,
            steps: this.generateTestSteps(test),
            defects: test.state === 'failed' ? [test.title] : [],
            evidence: this.generateEvidence(test)
          });
        }
      });
    });

    return {
      testExecutionKey: `EXEC-${Date.now()}`,
      info: {
        summary: 'Cypress Test Execution',
        description: 'Automated test execution from Cypress',
        version: this.config.version,
        user: 'cypress-automation',
        revision: '1',
        startDate: new Date().toISOString(),
        finishDate: new Date().toISOString(),
        testPlanKey: this.config.testPlanKey,
        environment: this.config.environment
      },
      tests: tests
    };
  }

  extractTestId(title) {
    // Extract test case ID from test title
    const patterns = [
      /ELP-\d+/,
      /TEST-\d+/,
      /TC-\d+/
    ];
    
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return null;
  }

  mapStatus(state) {
    const statusMap = {
      'passed': 'PASS',
      'failed': 'FAIL',
      'pending': 'TODO',
      'skipped': 'TODO'
    };
    
    return statusMap[state] || 'TODO';
  }

  generateTestSteps(test) {
    // Generate test steps based on test execution
    const steps = [];
    
    if (test.state === 'passed') {
      steps.push({
        status: 'PASSED',
        comment: 'Test executed successfully',
        actualResult: 'Test passed'
      });
    } else if (test.state === 'failed') {
      steps.push({
        status: 'FAILED',
        comment: 'Test execution failed',
        actualResult: test.displayError || 'Test failed'
      });
    }
    
    return steps;
  }

  generateEvidence(test) {
    const evidence = [];
    
    // Add screenshots if available
    if (this.config.uploadScreenshots && test.screenshots) {
      test.screenshots.forEach(screenshot => {
        evidence.push({
          filename: path.basename(screenshot.path),
          contentType: 'image/png',
          data: this.encodeFile(screenshot.path)
        });
      });
    }
    
    // Add videos if available
    if (this.config.uploadVideos && test.video) {
      evidence.push({
        filename: path.basename(test.video),
        contentType: 'video/mp4',
        data: this.encodeFile(test.video)
      });
    }
    
    return evidence;
  }

  encodeFile(filePath) {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      return fileBuffer.toString('base64');
    } catch (error) {
      console.warn(`⚠️  Could not encode file ${filePath}:`, error.message);
      return null;
    }
  }

  async uploadExecutionReport(executionReport) {
    const xrayUrl = this.config.xrayServerUrl || 'https://xray.cloud.getxray.app/api/v2';
    
    // Use appropriate authentication method
    let authHeader;
    if (this.config.xrayClientId && this.config.xrayClientSecret) {
      // Xray Cloud authentication
      const token = await this.getXrayCloudToken();
      authHeader = `Bearer ${token}`;
    } else if (this.config.xrayUsername && this.config.xrayPassword) {
      // Xray Server authentication
      const credentials = Buffer.from(`${this.config.xrayUsername}:${this.config.xrayPassword}`).toString('base64');
      authHeader = `Basic ${credentials}`;
    } else {
      throw new Error('No valid Xray authentication credentials found');
    }
    
    const response = await fetch(`${xrayUrl}/import/execution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(executionReport)
    });
    
    if (!response.ok) {
      throw new Error(`Xray API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  async getXrayCloudToken() {
    const response = await fetch('https://xray.cloud.getxray.app/api/v2/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: this.config.xrayClientId,
        client_secret: this.config.xrayClientSecret
      })
    });
    
    if (!response.ok) {
      throw new Error(`Xray Cloud authentication failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }

  saveExecutionKey(executionKey) {
    const keyFile = path.join(process.cwd(), 'xray-execution-key.txt');
    fs.writeFileSync(keyFile, executionKey);
    console.log(`💾 Execution key saved to: ${keyFile}`);
  }

  printSummary() {
    console.log('\n📋 Test Execution Summary');
    console.log('========================');
    
    if (this.results.length === 0) {
      console.log('No test results found');
      return;
    }
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    let skippedTests = 0;
    
    this.results.forEach(run => {
      totalTests += run.tests.length;
      run.tests.forEach(test => {
        switch (test.state) {
          case 'passed':
            passedTests++;
            break;
          case 'failed':
            failedTests++;
            break;
          case 'pending':
          case 'skipped':
            skippedTests++;
            break;
        }
      });
    });
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏭️  Skipped: ${skippedTests}`);
    console.log(`📊 Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const specPattern = args[0] || 'cypress/e2e/features/**/*.cy.js';
  
  const runner = new XrayTestRunner();
  
  runner.runTests(specPattern)
    .then(() => {
      runner.printSummary();
      console.log('\n🎉 Test execution completed successfully!');
    })
    .catch(error => {
      console.error('\n💥 Test execution failed:', error.message);
      process.exit(1);
    });
}

module.exports = XrayTestRunner;
