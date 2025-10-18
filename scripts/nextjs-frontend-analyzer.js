#!/usr/bin/env node

/**
 * Next.js Frontend Repository Analyzer
 * Specifically analyzes the Next.js eleadpromo-nextjs repository
 */

const fs = require('fs')
const path = require('path')

class NextjsFrontendAnalyzer {
  constructor() {
    this.repositoryPath = './repos/eleadpromo-nextjs'
  }

  /**
   * Analyze the Next.js repository structure
   */
  analyzeRepository() {
    console.log('🔍 Analyzing Next.js eleadpromo-nextjs repository...')

    const analysis = {
      name: 'eleadpromo-nextjs',
      path: this.repositoryPath,
      type: 'Next.js with TypeScript',
      packageJson: null,
      nextConfig: null,
      structure: {},
      pages: [],
      components: [],
      apiRoutes: [],
      hooks: [],
      utils: [],
      types: [],
      selectors: [],
      testFiles: [],
      frontendFeatures: [],
    }

    try {
      // Read package.json
      const packageJsonPath = path.join(this.repositoryPath, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        analysis.packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf8'),
        )
        console.log('📦 package.json found')
      }

      // Read next.config.mjs
      const nextConfigPath = path.join(this.repositoryPath, 'next.config.mjs')
      if (fs.existsSync(nextConfigPath)) {
        analysis.nextConfig = fs.readFileSync(nextConfigPath, 'utf8')
        console.log('⚙️  next.config.mjs found')
      }

      // Analyze directory structure
      analysis.structure = this.getDirectoryStructure(this.repositoryPath)
      console.log('📁 Directory structure analyzed')

      // Find pages
      analysis.pages = this.findPages(this.repositoryPath)
      console.log(`📄 ${analysis.pages.length} pages found`)

      // Find components
      analysis.components = this.findComponents(this.repositoryPath)
      console.log(`🧩 ${analysis.components.length} components found`)

      // Find API routes
      analysis.apiRoutes = this.findApiRoutes(this.repositoryPath)
      console.log(`🔌 ${analysis.apiRoutes.length} API routes found`)

      // Find hooks
      analysis.hooks = this.findHooks(this.repositoryPath)
      console.log(`🪝 ${analysis.hooks.length} hooks found`)

      // Find utils
      analysis.utils = this.findUtils(this.repositoryPath)
      console.log(`🛠️  ${analysis.utils.length} utility files found`)

      // Find types
      analysis.types = this.findTypes(this.repositoryPath)
      console.log(`📝 ${analysis.types.length} type files found`)

      // Find data-testid selectors
      analysis.selectors = this.findSelectors(this.repositoryPath)
      console.log(
        `🎯 ${analysis.selectors.length} files with data-testid found`,
      )

      // Find existing test files
      analysis.testFiles = this.findTestFiles(this.repositoryPath)
      console.log(`🧪 ${analysis.testFiles.length} test files found`)

      // Analyze frontend-specific features
      analysis.frontendFeatures = this.analyzeFrontendFeatures(
        this.repositoryPath,
      )
      console.log(
        `🛒 ${analysis.frontendFeatures.length} frontend features identified`,
      )
    } catch (error) {
      console.error(`❌ Error analyzing repository:`, error.message)
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
        } else if (
          stat.isFile() &&
          (item.endsWith('.tsx') ||
            item.endsWith('.ts') ||
            item.endsWith('.js') ||
            item.endsWith('.jsx'))
        ) {
          structure[item] = 'file'
        }
      }
    } catch (error) {
      // Ignore permission errors
    }

    return structure
  }

  /**
   * Find Next.js pages (App Router)
   */
  findPages(repoPath) {
    const pages = []
    const appPath = path.join(repoPath, 'src', 'app')

    if (!fs.existsSync(appPath)) return pages

    try {
      const findPages = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findPages(itemPath)
          } else if (
            item === 'page.tsx' ||
            item === 'page.ts' ||
            item === 'page.js' ||
            item === 'page.jsx'
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')
            pages.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              route:
                itemPath
                  .replace(repoPath + '/src/app', '')
                  .replace('/page.tsx', '')
                  .replace('/page.ts', '')
                  .replace('/page.js', '')
                  .replace('/page.jsx', '') || '/',
              isApiRoute: itemPath.includes('/api/'),
              hasDataTestId: content.includes('data-testid'),
              isFrontendPage: this.isFrontendPage(content, item),
            })
          }
        }
      }

      findPages(appPath)
    } catch (error) {
      // Ignore errors
    }

    return pages
  }

  /**
   * Verificar si es una página específica de frontend
   */
  isFrontendPage(content, filename) {
    const frontendKeywords = [
      'cart',
      'checkout',
      'product',
      'catalog',
      'store',
      'address',
      'payment',
      'shipping',
      'order',
      'user',
      'account',
      'login',
    ]

    const lowerContent = content.toLowerCase()
    const lowerFilename = filename.toLowerCase()

    return frontendKeywords.some(
      (keyword) =>
        lowerContent.includes(keyword) || lowerFilename.includes(keyword),
    )
  }

  /**
   * Encontrar componentes React (App Router)
   */
  findComponents(repoPath) {
    const components = []
    const appPath = path.join(repoPath, 'src', 'app')
    const componentsPath = path.join(repoPath, 'src', 'components')

    // Search in both app directory and components directory
    const searchPaths = [appPath, componentsPath]

    searchPaths.forEach((searchPath) => {
      if (!fs.existsSync(searchPath)) return

      try {
        const findComponents = (dir) => {
          const items = fs.readdirSync(dir)

          for (const item of items) {
            const itemPath = path.join(dir, item)
            const stat = fs.statSync(itemPath)

            if (stat.isDirectory()) {
              findComponents(itemPath)
            } else if (
              item.endsWith('.tsx') ||
              item.endsWith('.ts') ||
              item.endsWith('.js') ||
              item.endsWith('.jsx')
            ) {
              const content = fs.readFileSync(itemPath, 'utf8')

              // Skip page.tsx files (already handled in findPages)
              if (
                item === 'page.tsx' ||
                item === 'page.ts' ||
                item === 'page.js' ||
                item === 'page.jsx'
              ) {
                return
              }

              if (
                content.includes('export') &&
                (content.includes('function') || content.includes('const'))
              ) {
                components.push({
                  file: item,
                  path: itemPath.replace(repoPath, ''),
                  hasDataTestId: content.includes('data-testid'),
                  hasClassName: content.includes('className'),
                  isFrontendComponent: this.isFrontendComponent(content, item),
                  isHook: content.includes('use') && content.includes('('),
                  isLayout: item === 'layout.tsx' || item === 'layout.ts',
                  isTemplate: item === 'template.tsx' || item === 'template.ts',
                })
              }
            }
          }
        }

        findComponents(searchPath)
      } catch (error) {
        // Ignore errors
      }
    })

    return components
  }

  /**
   * Verificar si es un componente específico de frontend
   */
  isFrontendComponent(content, filename) {
    const frontendKeywords = [
      'cart',
      'checkout',
      'product',
      'catalog',
      'store',
      'address',
      'payment',
      'shipping',
      'order',
      'user',
      'account',
      'login',
      'button',
      'form',
      'input',
      'dropdown',
      'modal',
      'card',
    ]

    const lowerContent = content.toLowerCase()
    const lowerFilename = filename.toLowerCase()

    return frontendKeywords.some(
      (keyword) =>
        lowerContent.includes(keyword) || lowerFilename.includes(keyword),
    )
  }

  /**
   * Encontrar rutas API
   */
  findApiRoutes(repoPath) {
    const apiRoutes = []
    const apiPath = path.join(repoPath, 'src', 'pages', 'api')

    if (!fs.existsSync(apiPath)) return apiRoutes

    try {
      const findApiRoutes = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findApiRoutes(itemPath)
          } else if (item.endsWith('.ts') || item.endsWith('.js')) {
            const content = fs.readFileSync(itemPath, 'utf8')
            apiRoutes.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              hasGet:
                content.includes('export default function handler') ||
                content.includes('GET'),
              hasPost: content.includes('POST'),
              hasPut: content.includes('PUT'),
              hasDelete: content.includes('DELETE'),
            })
          }
        }
      }

      findApiRoutes(apiPath)
    } catch (error) {
      // Ignore errors
    }

    return apiRoutes
  }

  /**
   * Encontrar hooks personalizados
   */
  findHooks(repoPath) {
    const hooks = []
    const hooksPath = path.join(repoPath, 'src', 'hooks')

    if (!fs.existsSync(hooksPath)) return hooks

    try {
      const items = fs.readdirSync(hooksPath)

      for (const item of items) {
        if (
          item.endsWith('.ts') ||
          item.endsWith('.tsx') ||
          item.endsWith('.js') ||
          item.endsWith('.jsx')
        ) {
          const itemPath = path.join(hooksPath, item)
          const content = fs.readFileSync(itemPath, 'utf8')

          hooks.push({
            file: item,
            path: itemPath.replace(repoPath, ''),
            hookName: item.replace(/\.(ts|tsx|js|jsx)$/, ''),
            hasDataTestId: content.includes('data-testid'),
          })
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return hooks
  }

  /**
   * Encontrar archivos de utilidades
   */
  findUtils(repoPath) {
    const utils = []
    const utilsPath = path.join(repoPath, 'src', 'utils')

    if (!fs.existsSync(utilsPath)) return utils

    try {
      const items = fs.readdirSync(utilsPath)

      for (const item of items) {
        if (item.endsWith('.ts') || item.endsWith('.js')) {
          const itemPath = path.join(utilsPath, item)
          const content = fs.readFileSync(itemPath, 'utf8')

          utils.push({
            file: item,
            path: itemPath.replace(repoPath, ''),
            hasDataTestId: content.includes('data-testid'),
          })
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return utils
  }

  /**
   * Encontrar archivos de tipos TypeScript
   */
  findTypes(repoPath) {
    const types = []
    const typesPath = path.join(repoPath, 'src', 'types')

    if (!fs.existsSync(typesPath)) return types

    try {
      const items = fs.readdirSync(typesPath)

      for (const item of items) {
        if (item.endsWith('.ts') || item.endsWith('.d.ts')) {
          const itemPath = path.join(typesPath, item)
          const content = fs.readFileSync(itemPath, 'utf8')

          types.push({
            file: item,
            path: itemPath.replace(repoPath, ''),
            hasInterfaces: content.includes('interface'),
            hasTypes: content.includes('type '),
          })
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return types
  }

  /**
   * Encontrar selectores data-testid
   */
  findSelectors(repoPath) {
    const selectors = []

    try {
      const findSelectors = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (
            stat.isDirectory() &&
            !item.startsWith('.') &&
            item !== 'node_modules'
          ) {
            findSelectors(itemPath)
          } else if (
            item.endsWith('.tsx') ||
            item.endsWith('.ts') ||
            item.endsWith('.js') ||
            item.endsWith('.jsx')
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
   * Encontrar archivos de test existentes
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
            item.includes('__tests__')
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
   * Analizar características específicas de frontend
   */
  analyzeFrontendFeatures(repoPath) {
    const features = []

    try {
      const findFeatures = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findFeatures(itemPath)
          } else if (
            item.endsWith('.tsx') ||
            item.endsWith('.ts') ||
            item.endsWith('.js') ||
            item.endsWith('.jsx')
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')

            // Look for frontend-specific features
            const frontendFeatures = [
              { keyword: 'cart', name: 'Shopping Cart' },
              { keyword: 'checkout', name: 'Checkout Process' },
              { keyword: 'product', name: 'Product Management' },
              { keyword: 'catalog', name: 'Product Catalog' },
              { keyword: 'address', name: 'Address Management' },
              { keyword: 'payment', name: 'Payment Processing' },
              { keyword: 'shipping', name: 'Shipping Management' },
              { keyword: 'order', name: 'Order Management' },
              { keyword: 'user', name: 'User Management' },
              { keyword: 'account', name: 'Account Management' },
              { keyword: 'login', name: 'Authentication' },
            ]

            frontendFeatures.forEach((feature) => {
              if (content.toLowerCase().includes(feature.keyword)) {
                features.push({
                  feature: feature.name,
                  file: item,
                  path: itemPath.replace(repoPath, ''),
                  keyword: feature.keyword,
                })
              }
            })
          }
        }
      }

      findFeatures(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return features
  }

  /**
   * Generar reporte de análisis
   */
  generateReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      repository: analysis,
      summary: {
        totalPages: analysis.pages.length,
        totalComponents: analysis.components.length,
        totalApiRoutes: analysis.apiRoutes.length,
        totalHooks: analysis.hooks.length,
        totalUtils: analysis.utils.length,
        totalTypes: analysis.types.length,
        totalSelectors: analysis.selectors.length,
        totalTestFiles: analysis.testFiles.length,
        totalFrontendFeatures: analysis.frontendFeatures.length,
      },
      recommendations: this.generateRecommendations(analysis),
    }

    // Save report
    const reportPath = path.join(
      __dirname,
      '..',
      'docs',
      'nextjs-frontend-analysis.json',
    )
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

    console.log(`📊 Reporte de análisis guardado en: ${reportPath}`)
    return report
  }

  /**
   * Generar recomendaciones basadas en el análisis
   */
  generateRecommendations(analysis) {
    const recommendations = []

    // Check for data-testid coverage
    const totalComponents = analysis.components.length
    const componentsWithTestIds = analysis.components.filter(
      (comp) => comp.hasDataTestId,
    ).length

    if (componentsWithTestIds < totalComponents * 0.3) {
      recommendations.push({
        type: 'selector',
        priority: 'high',
        message:
          'Baja cobertura de data-testid en componentes. Considera agregar atributos data-testid para mejor estabilidad de tests.',
      })
    }

    // Check for existing test files
    if (analysis.testFiles.length === 0) {
      recommendations.push({
        type: 'testing',
        priority: 'high',
        message:
          'No se encontraron archivos de test existentes. Considera implementar tests Jest junto con tests de Cypress.',
      })
    }

    // Check for frontend-specific features
    const frontendFeatures = analysis.frontendFeatures.length
    if (frontendFeatures > 0) {
      recommendations.push({
        type: 'frontend',
        priority: 'medium',
        message: `Se identificaron ${frontendFeatures} características de frontend. Considera implementar tests específicos para estas funcionalidades.`,
      })
    }

    return recommendations
  }

  /**
   * Ejecutar análisis completo
   */
  async runAnalysis() {
    try {
      console.log(
        '🚀 Iniciando análisis del repositorio Next.js eleadpromo-nextjs...\n',
      )

      // Analyze repository
      const analysis = this.analyzeRepository()

      // Generate report
      const report = this.generateReport(analysis)

      console.log('\n✅ Análisis del repositorio completado!')
      console.log(`📄 Encontradas ${report.summary.totalPages} páginas`)
      console.log(
        `🧩 Encontrados ${report.summary.totalComponents} componentes`,
      )
      console.log(`🔌 Encontradas ${report.summary.totalApiRoutes} rutas API`)
      console.log(`🪝 Encontrados ${report.summary.totalHooks} hooks`)
      console.log(
        `🛠️  Encontrados ${report.summary.totalUtils} archivos de utilidades`,
      )
      console.log(
        `📝 Encontrados ${report.summary.totalTypes} archivos de tipos`,
      )
      console.log(
        `🎯 Encontrados ${report.summary.totalSelectors} archivos con data-testid`,
      )
      console.log(
        `🧪 Encontrados ${report.summary.totalTestFiles} archivos de test`,
      )
      console.log(
        `🛒 Encontradas ${report.summary.totalFrontendFeatures} características de frontend`,
      )

      return report
    } catch (error) {
      console.error('❌ Análisis falló:', error.message)
      throw error
    }
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new NextjsFrontendAnalyzer()

  analyzer
    .runAnalysis()
    .then((report) => {
      console.log('\n🎉 Análisis completado exitosamente!')
      console.log(
        '📋 Revisa docs/nextjs-frontend-analysis.json para resultados detallados',
      )
    })
    .catch((error) => {
      console.error('\n💥 Análisis falló:', error.message)
      process.exit(1)
    })
}

module.exports = NextjsFrontendAnalyzer
