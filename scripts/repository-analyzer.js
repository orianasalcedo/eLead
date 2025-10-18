#!/usr/bin/env node

/**
 * Repository Analysis Helper
 * Helps analyze the eLead Promo repositories and update our Cypress framework
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class RepositoryAnalyzer {
  constructor() {
    this.repositories = {
      frontend: {
        url: 'https://github.com/rootstrap/eleadpromo-nextjs.git',
        branch: 'eleadpromo-nextjs-dev',
        localPath: './repos/eleadpromo-nextjs',
      },
      admin: {
        url: 'https://github.com/rootstrap/e-lead-promo-admin.git',
        branch: 'e-lead-promo-admin-develop',
        localPath: './repos/e-lead-promo-admin',
      },
    }
  }

  /**
   * Clone repositories for analysis
   */
  async cloneRepositories() {
    console.log('🔄 Cloning repositories for analysis...')

    // Create repos directory
    if (!fs.existsSync('./repos')) {
      fs.mkdirSync('./repos')
    }

    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      console.log('⚠️  No GITHUB_TOKEN found. You can:')
      console.log('   1. Set GITHUB_TOKEN environment variable')
      console.log('   2. Clone repositories manually')
      console.log('   3. Use SSH if configured')
      return
    }

    for (const [name, repo] of Object.entries(this.repositories)) {
      try {
        console.log(`📁 Cloning ${name} repository...`)

        // Remove existing directory if it exists
        if (fs.existsSync(repo.localPath)) {
          execSync(`rm -rf ${repo.localPath}`)
        }

        // Clone repository with token authentication
        const authUrl = repo.url.replace(
          'https://github.com/',
          `https://${githubToken}@github.com/`,
        )
        execSync(`git clone -b ${repo.branch} ${authUrl} ${repo.localPath}`, {
          stdio: 'inherit',
        })

        console.log(`✅ ${name} repository cloned successfully`)
      } catch (error) {
        console.error(`❌ Failed to clone ${name} repository:`, error.message)
        console.log(
          '💡 Try cloning manually or check your GitHub token permissions',
        )
      }
    }
  }

  /**
   * Analyze repository structure
   */
  analyzeRepository(repoPath, repoName) {
    console.log(`🔍 Analyzing ${repoName} repository...`)

    const analysis = {
      name: repoName,
      path: repoPath,
      packageJson: null,
      structure: {},
      components: [],
      pages: [],
      apiEndpoints: [],
      selectors: [],
      testFiles: [],
    }

    try {
      // Read package.json
      const packageJsonPath = path.join(repoPath, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        analysis.packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf8'),
        )
      }

      // Analyze directory structure
      analysis.structure = this.getDirectoryStructure(repoPath)

      // Find components
      analysis.components = this.findComponents(repoPath)

      // Find pages
      analysis.pages = this.findPages(repoPath)

      // Find API endpoints
      analysis.apiEndpoints = this.findApiEndpoints(repoPath)

      // Find data-testid selectors
      analysis.selectors = this.findSelectors(repoPath)

      // Find existing test files
      analysis.testFiles = this.findTestFiles(repoPath)
    } catch (error) {
      console.error(`❌ Error analyzing ${repoName}:`, error.message)
    }

    return analysis
  }

  /**
   * Get directory structure
   */
  getDirectoryStructure(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return {}

    const structure = {}

    try {
      const items = fs.readdirSync(dirPath)

      for (const item of items) {
        const itemPath = path.join(dirPath, item)
        const stat = fs.statSync(itemPath)

        if (
          stat.isDirectory() &&
          !item.startsWith('.') &&
          item !== 'node_modules'
        ) {
          structure[item] = this.getDirectoryStructure(
            itemPath,
            maxDepth,
            currentDepth + 1,
          )
        } else if (stat.isFile() && item.endsWith('.json')) {
          structure[item] = 'file'
        }
      }
    } catch (error) {
      // Ignore permission errors
    }

    return structure
  }

  /**
   * Find React components
   */
  findComponents(repoPath) {
    const components = []

    try {
      const findComponents = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findComponents(itemPath)
          } else if (
            item.endsWith('.jsx') ||
            item.endsWith('.tsx') ||
            item.endsWith('.js')
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')

            // Look for component patterns
            if (
              content.includes('data-testid') ||
              content.includes('className') ||
              content.includes('export default')
            ) {
              components.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                hasDataTestId: content.includes('data-testid'),
                hasClassName: content.includes('className'),
              })
            }
          }
        }
      }

      findComponents(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return components
  }

  /**
   * Find pages/routes
   */
  findPages(repoPath) {
    const pages = []

    try {
      const findPages = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findPages(itemPath)
          } else if (
            item.endsWith('.jsx') ||
            item.endsWith('.tsx') ||
            item.endsWith('.js')
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')

            // Look for page patterns
            if (
              content.includes('getServerSideProps') ||
              content.includes('getStaticProps') ||
              content.includes('useRouter')
            ) {
              pages.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                hasServerSideProps: content.includes('getServerSideProps'),
                hasStaticProps: content.includes('getStaticProps'),
                hasRouter: content.includes('useRouter'),
              })
            }
          }
        }
      }

      findPages(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return pages
  }

  /**
   * Find API endpoints
   */
  findApiEndpoints(repoPath) {
    const endpoints = []

    try {
      const findEndpoints = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findEndpoints(itemPath)
          } else if (item.endsWith('.js') || item.endsWith('.ts')) {
            const content = fs.readFileSync(itemPath, 'utf8')

            // Look for API patterns
            const apiMatches = content.match(/['"`]\/api\/[^'"`]+['"`]/g)
            if (apiMatches) {
              endpoints.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                endpoints: apiMatches.map((match) =>
                  match.replace(/['"`]/g, ''),
                ),
              })
            }
          }
        }
      }

      findEndpoints(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return endpoints
  }

  /**
   * Find data-testid selectors
   */
  findSelectors(repoPath) {
    const selectors = []

    try {
      const findSelectors = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findSelectors(itemPath)
          } else if (
            item.endsWith('.jsx') ||
            item.endsWith('.tsx') ||
            item.endsWith('.js')
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')

            // Look for data-testid patterns
            const testIdMatches = content.match(
              /data-testid=['"`]([^'"`]+)['"`]/g,
            )
            if (testIdMatches) {
              selectors.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                selectors: testIdMatches.map((match) => {
                  const id = match.match(/data-testid=['"`]([^'"`]+)['"`]/)[1]
                  return id
                }),
              })
            }
          }
        }
      }

      findSelectors(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return selectors
  }

  /**
   * Find existing test files
   */
  findTestFiles(repoPath) {
    const testFiles = []

    try {
      const findTestFiles = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findTestFiles(itemPath)
          } else if (
            item.includes('.test.') ||
            item.includes('.spec.') ||
            item.includes('cypress')
          ) {
            testFiles.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              type: item.includes('cypress') ? 'cypress' : 'unit',
            })
          }
        }
      }

      findTestFiles(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return testFiles
  }

  /**
   * Generate analysis report
   */
  generateReport(analyses) {
    const report = {
      timestamp: new Date().toISOString(),
      repositories: analyses,
      summary: {
        totalComponents: analyses.reduce(
          (sum, analysis) => sum + analysis.components.length,
          0,
        ),
        totalPages: analyses.reduce(
          (sum, analysis) => sum + analysis.pages.length,
          0,
        ),
        totalApiEndpoints: analyses.reduce(
          (sum, analysis) => sum + analysis.apiEndpoints.length,
          0,
        ),
        totalSelectors: analyses.reduce(
          (sum, analysis) => sum + analysis.selectors.length,
          0,
        ),
        totalTestFiles: analyses.reduce(
          (sum, analysis) => sum + analysis.testFiles.length,
          0,
        ),
      },
      recommendations: this.generateRecommendations(analyses),
    }

    // Save report
    const reportPath = path.join(
      __dirname,
      '..',
      'docs',
      'repository-analysis.json',
    )
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    console.log(`📊 Analysis report saved to: ${reportPath}`)
    return report
  }

  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(analyses) {
    const recommendations = []

    // Check for data-testid coverage
    const totalComponents = analyses.reduce(
      (sum, analysis) => sum + analysis.components.length,
      0,
    )
    const componentsWithTestIds = analyses.reduce(
      (sum, analysis) =>
        sum + analysis.components.filter((comp) => comp.hasDataTestId).length,
      0,
    )

    if (componentsWithTestIds < totalComponents * 0.5) {
      recommendations.push({
        type: 'selector',
        priority: 'high',
        message:
          'Low data-testid coverage. Consider adding data-testid attributes to components for better test stability.',
      })
    }

    // Check for existing test files
    const totalTestFiles = analyses.reduce(
      (sum, analysis) => sum + analysis.testFiles.length,
      0,
    )
    if (totalTestFiles === 0) {
      recommendations.push({
        type: 'testing',
        priority: 'high',
        message:
          'No existing test files found. Consider implementing unit tests alongside Cypress tests.',
      })
    }

    // Check for API endpoint coverage
    const totalApiEndpoints = analyses.reduce(
      (sum, analysis) => sum + analysis.apiEndpoints.length,
      0,
    )
    if (totalApiEndpoints > 0) {
      recommendations.push({
        type: 'api',
        priority: 'medium',
        message:
          'API endpoints found. Consider implementing API tests in addition to UI tests.',
      })
    }

    return recommendations
  }

  /**
   * Run complete analysis
   */
  async runAnalysis() {
    try {
      console.log('🚀 Starting repository analysis...')

      // Clone repositories
      await this.cloneRepositories()

      // Analyze each repository
      const analyses = []
      for (const [name, repo] of Object.entries(this.repositories)) {
        if (fs.existsSync(repo.localPath)) {
          const analysis = this.analyzeRepository(repo.localPath, name)
          analyses.push(analysis)
        }
      }

      // Generate report
      const report = this.generateReport(analyses)

      console.log('✅ Repository analysis completed!')
      console.log(`📊 Found ${report.summary.totalComponents} components`)
      console.log(`📄 Found ${report.summary.totalPages} pages`)
      console.log(`🔌 Found ${report.summary.totalApiEndpoints} API endpoints`)
      console.log(
        `🎯 Found ${report.summary.totalSelectors} data-testid selectors`,
      )
      console.log(`🧪 Found ${report.summary.totalTestFiles} test files`)

      return report
    } catch (error) {
      console.error('❌ Analysis failed:', error.message)
      throw error
    }
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new RepositoryAnalyzer()

  analyzer
    .runAnalysis()
    .then((report) => {
      console.log('\n🎉 Analysis completed successfully!')
      console.log('📋 Check docs/repository-analysis.json for detailed results')
    })
    .catch((error) => {
      console.error('\n💥 Analysis failed:', error.message)
      process.exit(1)
    })
}

module.exports = RepositoryAnalyzer
