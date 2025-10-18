#!/usr/bin/env node

/**
 * Rails Admin Repository Analyzer
 * Specifically analyzes the Rails e-lead-promo-admin repository
 */

const fs = require('fs')
const path = require('path')

class RailsAdminRepositoryAnalyzer {
  constructor() {
    this.repositoryPath = './repos/e-lead-promo-admin'
  }

  /**
   * Analyze the Rails repository structure
   */
  analyzeRepository() {
    console.log('🔍 Analyzing Rails e-lead-promo-admin repository...')

    const analysis = {
      name: 'e-lead-promo-admin',
      path: this.repositoryPath,
      type: 'Ruby on Rails',
      packageJson: null,
      gemfile: null,
      structure: {},
      controllers: [],
      models: [],
      views: [],
      components: [],
      javascriptFiles: [],
      routes: [],
      selectors: [],
      testFiles: [],
      adminFeatures: [],
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

      // Read Gemfile
      const gemfilePath = path.join(this.repositoryPath, 'Gemfile')
      if (fs.existsSync(gemfilePath)) {
        analysis.gemfile = fs.readFileSync(gemfilePath, 'utf8')
        console.log('💎 Gemfile found')
      }

      // Analyze directory structure
      analysis.structure = this.getDirectoryStructure(this.repositoryPath)
      console.log('📁 Directory structure analyzed')

      // Find controllers
      analysis.controllers = this.findControllers(this.repositoryPath)
      console.log(`🎮 ${analysis.controllers.length} controllers found`)

      // Find models
      analysis.models = this.findModels(this.repositoryPath)
      console.log(`📊 ${analysis.models.length} models found`)

      // Find views
      analysis.views = this.findViews(this.repositoryPath)
      console.log(`👁️  ${analysis.views.length} views found`)

      // Find Stimulus components
      analysis.components = this.findStimulusComponents(this.repositoryPath)
      console.log(`🧩 ${analysis.components.length} Stimulus components found`)

      // Find JavaScript files
      analysis.javascriptFiles = this.findJavaScriptFiles(this.repositoryPath)
      console.log(
        `📜 ${analysis.javascriptFiles.length} JavaScript files found`,
      )

      // Find routes
      analysis.routes = this.findRoutes(this.repositoryPath)
      console.log(`🛣️  ${analysis.routes.length} routes found`)

      // Find data-testid selectors
      analysis.selectors = this.findSelectors(this.repositoryPath)
      console.log(
        `🎯 ${analysis.selectors.length} files with data-testid found`,
      )

      // Find existing test files
      analysis.testFiles = this.findTestFiles(this.repositoryPath)
      console.log(`🧪 ${analysis.testFiles.length} test files found`)

      // Analyze admin-specific features
      analysis.adminFeatures = this.analyzeAdminFeatures(this.repositoryPath)
      console.log(
        `⚙️  ${analysis.adminFeatures.length} admin features identified`,
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
          (item.endsWith('.rb') ||
            item.endsWith('.js') ||
            item.endsWith('.erb'))
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
   * Find Rails controllers
   */
  findControllers(repoPath) {
    const controllers = []
    const controllersPath = path.join(repoPath, 'app', 'controllers')

    if (!fs.existsSync(controllersPath)) return controllers

    try {
      const findControllers = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findControllers(itemPath)
          } else if (item.endsWith('_controller.rb')) {
            const content = fs.readFileSync(itemPath, 'utf8')
            controllers.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              name: item.replace('_controller.rb', ''),
              isAdminController: this.isAdminController(content, item),
              actions: this.extractActions(content),
            })
          }
        }
      }

      findControllers(controllersPath)
    } catch (error) {
      // Ignore errors
    }

    return controllers
  }

  /**
   * Verificar si es un controlador de admin
   */
  isAdminController(content, filename) {
    const adminKeywords = [
      'admin',
      'order',
      'product',
      'customer',
      'inventory',
      'payment',
      'shipping',
      'dashboard',
      'management',
      'settings',
      'configuration',
    ]

    const lowerContent = content.toLowerCase()
    const lowerFilename = filename.toLowerCase()

    return adminKeywords.some(
      (keyword) =>
        lowerContent.includes(keyword) || lowerFilename.includes(keyword),
    )
  }

  /**
   * Extraer acciones del controlador
   */
  extractActions(content) {
    const actions = []
    const actionMatches = content.match(/def\s+(\w+)/g)

    if (actionMatches) {
      actions.push(...actionMatches.map((match) => match.replace('def ', '')))
    }

    return actions
  }

  /**
   * Encontrar modelos Rails
   */
  findModels(repoPath) {
    const models = []
    const modelsPath = path.join(repoPath, 'app', 'models')

    if (!fs.existsSync(modelsPath)) return models

    try {
      const items = fs.readdirSync(modelsPath)

      for (const item of items) {
        if (item.endsWith('.rb')) {
          const itemPath = path.join(modelsPath, item)
          const content = fs.readFileSync(itemPath, 'utf8')

          models.push({
            file: item,
            path: itemPath.replace(repoPath, ''),
            name: item.replace('.rb', ''),
            isAdminModel: this.isAdminModel(content, item),
          })
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return models
  }

  /**
   * Verificar si es un modelo de admin
   */
  isAdminModel(content, filename) {
    const adminKeywords = [
      'order',
      'product',
      'customer',
      'inventory',
      'payment',
      'shipping',
      'admin',
      'user',
      'store',
      'supplier',
    ]

    const lowerContent = content.toLowerCase()
    const lowerFilename = filename.toLowerCase()

    return adminKeywords.some(
      (keyword) =>
        lowerContent.includes(keyword) || lowerFilename.includes(keyword),
    )
  }

  /**
   * Encontrar vistas Rails
   */
  findViews(repoPath) {
    const views = []
    const viewsPath = path.join(repoPath, 'app', 'views')

    if (!fs.existsSync(viewsPath)) return views

    try {
      const findViews = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findViews(itemPath)
          } else if (item.endsWith('.erb') || item.endsWith('.html.erb')) {
            const content = fs.readFileSync(itemPath, 'utf8')
            views.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              hasDataTestId: content.includes('data-testid'),
              hasForm: content.includes('<form'),
              hasTable: content.includes('<table'),
            })
          }
        }
      }

      findViews(viewsPath)
    } catch (error) {
      // Ignore errors
    }

    return views
  }

  /**
   * Encontrar componentes Stimulus
   */
  findStimulusComponents(repoPath) {
    const components = []
    const componentsPath = path.join(repoPath, 'app', 'components')

    if (!fs.existsSync(componentsPath)) return components

    try {
      const findComponents = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (stat.isDirectory()) {
            findComponents(itemPath)
          } else if (item.endsWith('.js')) {
            const content = fs.readFileSync(itemPath, 'utf8')

            if (
              content.includes('Controller') ||
              content.includes('stimulus')
            ) {
              components.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                isStimulusController: content.includes('Controller'),
                hasDataTestId: content.includes('data-testid'),
              })
            }
          }
        }
      }

      findComponents(componentsPath)
    } catch (error) {
      // Ignore errors
    }

    return components
  }

  /**
   * Encontrar archivos JavaScript
   */
  findJavaScriptFiles(repoPath) {
    const jsFiles = []

    try {
      const findJsFiles = (dir) => {
        const items = fs.readdirSync(dir)

        for (const item of items) {
          const itemPath = path.join(dir, item)
          const stat = fs.statSync(itemPath)

          if (
            stat.isDirectory() &&
            !item.startsWith('.') &&
            item !== 'node_modules'
          ) {
            findJsFiles(itemPath)
          } else if (
            item.endsWith('.js') ||
            item.endsWith('.jsx') ||
            item.endsWith('.ts')
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')
            jsFiles.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              hasDataTestId: content.includes('data-testid'),
              hasAjax: content.includes('fetch') || content.includes('ajax'),
            })
          }
        }
      }

      findJsFiles(repoPath)
    } catch (error) {
      // Ignore errors
    }

    return jsFiles
  }

  /**
   * Encontrar rutas
   */
  findRoutes(repoPath) {
    const routes = []
    const routesPath = path.join(repoPath, 'config', 'routes.rb')

    if (!fs.existsSync(routesPath)) return routes

    try {
      const content = fs.readFileSync(routesPath, 'utf8')

      // Extract route patterns
      const routeMatches = content.match(
        /(get|post|put|patch|delete|resources)\s+['"`]([^'"`]+)['"`]/g,
      )
      if (routeMatches) {
        routes.push(
          ...routeMatches.map((match) => {
            const parts = match.match(
              /(get|post|put|patch|delete|resources)\s+['"`]([^'"`]+)['"`]/,
            )
            return {
              method: parts[1],
              path: parts[2],
              isAdminRoute: this.isAdminRoute(parts[2]),
            }
          }),
        )
      }
    } catch (error) {
      // Ignore errors
    }

    return routes
  }

  /**
   * Verificar si es una ruta de admin
   */
  isAdminRoute(routePath) {
    const adminKeywords = [
      'admin',
      'orders',
      'products',
      'customers',
      'inventory',
      'payments',
      'shipping',
      'dashboard',
      'management',
      'settings',
    ]

    return adminKeywords.some((keyword) => routePath.includes(keyword))
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
            item.endsWith('.erb') ||
            item.endsWith('.js') ||
            item.endsWith('.rb')
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
            item.includes('_spec.rb') ||
            item.includes('.test.') ||
            item.includes('.spec.')
          ) {
            testFiles.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              type: item.includes('_spec.rb') ? 'rspec' : 'other',
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
   * Analizar características específicas de admin
   */
  analyzeAdminFeatures(repoPath) {
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
            item.endsWith('.rb') ||
            item.endsWith('.erb') ||
            item.endsWith('.js')
          ) {
            const content = fs.readFileSync(itemPath, 'utf8')

            // Look for admin-specific features
            const adminFeatures = [
              { keyword: 'order', name: 'Order Management' },
              { keyword: 'product', name: 'Product Management' },
              { keyword: 'customer', name: 'Customer Management' },
              { keyword: 'inventory', name: 'Inventory Management' },
              { keyword: 'payment', name: 'Payment Management' },
              { keyword: 'shipping', name: 'Shipping Management' },
              { keyword: 'dashboard', name: 'Dashboard' },
              { keyword: 'settings', name: 'Settings' },
              { keyword: 'analytics', name: 'Analytics' },
              { keyword: 'report', name: 'Reports' },
            ]

            adminFeatures.forEach((feature) => {
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
        totalControllers: analysis.controllers.length,
        totalModels: analysis.models.length,
        totalViews: analysis.views.length,
        totalComponents: analysis.components.length,
        totalJavaScriptFiles: analysis.javascriptFiles.length,
        totalRoutes: analysis.routes.length,
        totalSelectors: analysis.selectors.length,
        totalTestFiles: analysis.testFiles.length,
        totalAdminFeatures: analysis.adminFeatures.length,
      },
      recommendations: this.generateRecommendations(analysis),
    }

    // Save report
    const reportPath = path.join(
      __dirname,
      '..',
      'docs',
      'rails-admin-analysis.json',
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
    const totalViews = analysis.views.length
    const viewsWithTestIds = analysis.views.filter(
      (view) => view.hasDataTestId,
    ).length

    if (viewsWithTestIds < totalViews * 0.3) {
      recommendations.push({
        type: 'selector',
        priority: 'high',
        message:
          'Baja cobertura de data-testid en vistas. Considera agregar atributos data-testid para mejor estabilidad de tests.',
      })
    }

    // Check for existing test files
    if (analysis.testFiles.length === 0) {
      recommendations.push({
        type: 'testing',
        priority: 'high',
        message:
          'No se encontraron archivos de test existentes. Considera implementar tests RSpec junto con tests de Cypress.',
      })
    }

    // Check for admin-specific features
    const adminFeatures = analysis.adminFeatures.length
    if (adminFeatures > 0) {
      recommendations.push({
        type: 'admin',
        priority: 'medium',
        message: `Se identificaron ${adminFeatures} características de admin. Considera implementar tests específicos para estas funcionalidades.`,
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
        '🚀 Iniciando análisis del repositorio Rails e-lead-promo-admin...\n',
      )

      // Analyze repository
      const analysis = this.analyzeRepository()

      // Generate report
      const report = this.generateReport(analysis)

      console.log('\n✅ Análisis del repositorio completado!')
      console.log(
        `🎮 Encontrados ${report.summary.totalControllers} controladores`,
      )
      console.log(`📊 Encontrados ${report.summary.totalModels} modelos`)
      console.log(`👁️  Encontradas ${report.summary.totalViews} vistas`)
      console.log(
        `🧩 Encontrados ${report.summary.totalComponents} componentes Stimulus`,
      )
      console.log(
        `📜 Encontrados ${report.summary.totalJavaScriptFiles} archivos JavaScript`,
      )
      console.log(`🛣️  Encontradas ${report.summary.totalRoutes} rutas`)
      console.log(
        `🎯 Encontrados ${report.summary.totalSelectors} archivos con data-testid`,
      )
      console.log(
        `🧪 Encontrados ${report.summary.totalTestFiles} archivos de test`,
      )
      console.log(
        `⚙️  Encontradas ${report.summary.totalAdminFeatures} características de admin`,
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
  const analyzer = new RailsAdminRepositoryAnalyzer()

  analyzer
    .runAnalysis()
    .then((report) => {
      console.log('\n🎉 Análisis completado exitosamente!')
      console.log(
        '📋 Revisa docs/rails-admin-analysis.json para resultados detallados',
      )
    })
    .catch((error) => {
      console.error('\n💥 Análisis falló:', error.message)
      process.exit(1)
    })
}

module.exports = RailsAdminRepositoryAnalyzer
