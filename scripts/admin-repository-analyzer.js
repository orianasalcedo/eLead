#!/usr/bin/env node

/**
 * Admin Repository Analyzer
 * Specifically analyzes the e-lead-promo-admin repository
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AdminRepositoryAnalyzer {
  constructor() {
    this.repository = {
      url: 'https://github.com/rootstrap/e-lead-promo-admin.git',
      branch: 'develop',
      localPath: './repos/e-lead-promo-admin'
    };
  }

  /**
   * Clone the admin repository
   */
  async cloneRepository() {
    console.log('🔄 Cloning e-lead-promo-admin repository...');
    
    // Create repos directory
    if (!fs.existsSync('./repos')) {
      fs.mkdirSync('./repos');
    }

    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN;
    
    try {
      // Remove existing directory if it exists
      if (fs.existsSync(this.repository.localPath)) {
        execSync(`rm -rf ${this.repository.localPath}`);
      }

      let cloneUrl = this.repository.url;
      
      // Use token authentication if available
      if (githubToken) {
        cloneUrl = this.repository.url.replace('https://github.com/', `https://${githubToken}@github.com/`);
        console.log('🔐 Using token authentication');
      } else {
        console.log('⚠️  No GITHUB_TOKEN found, attempting to clone without authentication');
      }

      // Clone repository
      execSync(`git clone -b ${this.repository.branch} ${cloneUrl} ${this.repository.localPath}`, {
        stdio: 'inherit'
      });

      console.log(`✅ e-lead-promo-admin repository cloned successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error cloning repository:`, error.message);
      console.log('\n💡 Alternative options:');
      console.log('1. Configure GITHUB_TOKEN: export GITHUB_TOKEN=your_token');
      console.log('2. Clone manually:');
      console.log(`   git clone -b ${this.repository.branch} ${this.repository.url} ${this.repository.localPath}`);
      return false;
    }
  }

  /**
   * Analyze the repository structure
   */
  analyzeRepository() {
    console.log('🔍 Analyzing e-lead-promo-admin repository...');
    
    const analysis = {
      name: 'e-lead-promo-admin',
      path: this.repository.localPath,
      packageJson: null,
      structure: {},
      components: [],
      pages: [],
      apiEndpoints: [],
      selectors: [],
      testFiles: [],
      adminFeatures: []
    };

    try {
      // Read package.json
      const packageJsonPath = path.join(this.repository.localPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        analysis.packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        console.log('📦 package.json found');
      }

      // Analyze directory structure
      analysis.structure = this.getDirectoryStructure(this.repository.localPath);
      console.log('📁 Directory structure analyzed');

      // Find components
      analysis.components = this.findComponents(this.repository.localPath);
      console.log(`🧩 ${analysis.components.length} componentes encontrados`);

      // Find pages
      analysis.pages = this.findPages(this.repository.localPath);
      console.log(`📄 ${analysis.pages.length} páginas encontradas`);

      // Find API endpoints
      analysis.apiEndpoints = this.findApiEndpoints(this.repository.localPath);
      console.log(`🔌 ${analysis.apiEndpoints.length} archivos con endpoints API encontrados`);

      // Find data-testid selectors
      analysis.selectors = this.findSelectors(this.repository.localPath);
      console.log(`🎯 ${analysis.selectors.length} archivos con data-testid encontrados`);

      // Find existing test files
      analysis.testFiles = this.findTestFiles(this.repository.localPath);
      console.log(`🧪 ${analysis.testFiles.length} archivos de test encontrados`);

      // Analyze admin-specific features
      analysis.adminFeatures = this.analyzeAdminFeatures(this.repository.localPath);
      console.log(`⚙️  ${analysis.adminFeatures.length} características de admin identificadas`);

    } catch (error) {
      console.error(`❌ Error analizando repositorio:`, error.message);
    }

    return analysis;
  }

  /**
   * Obtener estructura de directorios
   */
  getDirectoryStructure(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return {};

    const structure = {};
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          structure[item] = this.getDirectoryStructure(itemPath, maxDepth, currentDepth + 1);
        } else if (stat.isFile() && (item.endsWith('.json') || item.endsWith('.js') || item.endsWith('.ts'))) {
          structure[item] = 'file';
        }
      }
    } catch (error) {
      // Ignore permission errors
    }

    return structure;
  }

  /**
   * Encontrar componentes React
   */
  findComponents(repoPath) {
    const components = [];
    
    try {
      const findComponents = (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            findComponents(itemPath);
          } else if (item.endsWith('.jsx') || item.endsWith('.tsx') || item.endsWith('.js')) {
            const content = fs.readFileSync(itemPath, 'utf8');
            
            // Look for component patterns
            if (content.includes('data-testid') || content.includes('className') || content.includes('export default')) {
              components.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                hasDataTestId: content.includes('data-testid'),
                hasClassName: content.includes('className'),
                isAdminComponent: this.isAdminComponent(content, item)
              });
            }
          }
        }
      };

      findComponents(repoPath);
    } catch (error) {
      // Ignore errors
    }

    return components;
  }

  /**
   * Verificar si es un componente específico de admin
   */
  isAdminComponent(content, filename) {
    const adminKeywords = [
      'order', 'product', 'customer', 'inventory', 'payment', 'shipping',
      'admin', 'dashboard', 'management', 'settings', 'configuration'
    ];
    
    const lowerContent = content.toLowerCase();
    const lowerFilename = filename.toLowerCase();
    
    return adminKeywords.some(keyword => 
      lowerContent.includes(keyword) || lowerFilename.includes(keyword)
    );
  }

  /**
   * Encontrar páginas/rutas
   */
  findPages(repoPath) {
    const pages = [];
    
    try {
      const findPages = (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            findPages(itemPath);
          } else if (item.endsWith('.jsx') || item.endsWith('.tsx') || item.endsWith('.js')) {
            const content = fs.readFileSync(itemPath, 'utf8');
            
            // Look for page patterns
            if (content.includes('getServerSideProps') || content.includes('getStaticProps') || content.includes('useRouter')) {
              pages.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                hasServerSideProps: content.includes('getServerSideProps'),
                hasStaticProps: content.includes('getStaticProps'),
                hasRouter: content.includes('useRouter'),
                isAdminPage: this.isAdminPage(content, item)
              });
            }
          }
        }
      };

      findPages(repoPath);
    } catch (error) {
      // Ignore errors
    }

    return pages;
  }

  /**
   * Verificar si es una página específica de admin
   */
  isAdminPage(content, filename) {
    const adminPageKeywords = [
      'orders', 'products', 'customers', 'inventory', 'payments', 'shipping',
      'admin', 'dashboard', 'management', 'settings', 'configuration', 'analytics'
    ];
    
    const lowerContent = content.toLowerCase();
    const lowerFilename = filename.toLowerCase();
    
    return adminPageKeywords.some(keyword => 
      lowerContent.includes(keyword) || lowerFilename.includes(keyword)
    );
  }

  /**
   * Encontrar endpoints API
   */
  findApiEndpoints(repoPath) {
    const endpoints = [];
    
    try {
      const findEndpoints = (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            findEndpoints(itemPath);
          } else if (item.endsWith('.js') || item.endsWith('.ts')) {
            const content = fs.readFileSync(itemPath, 'utf8');
            
            // Look for API patterns
            const apiMatches = content.match(/['"`]\/api\/[^'"`]+['"`]/g);
            if (apiMatches) {
              endpoints.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                endpoints: apiMatches.map(match => match.replace(/['"`]/g, ''))
              });
            }
          }
        }
      };

      findEndpoints(repoPath);
    } catch (error) {
      // Ignore errors
    }

    return endpoints;
  }

  /**
   * Encontrar selectores data-testid
   */
  findSelectors(repoPath) {
    const selectors = [];
    
    try {
      const findSelectors = (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            findSelectors(itemPath);
          } else if (item.endsWith('.jsx') || item.endsWith('.tsx') || item.endsWith('.js')) {
            const content = fs.readFileSync(itemPath, 'utf8');
            
            // Look for data-testid patterns
            const testIdMatches = content.match(/data-testid=['"`]([^'"`]+)['"`]/g);
            if (testIdMatches) {
              selectors.push({
                file: item,
                path: itemPath.replace(repoPath, ''),
                selectors: testIdMatches.map(match => {
                  const id = match.match(/data-testid=['"`]([^'"`]+)['"`]/)[1];
                  return id;
                })
              });
            }
          }
        }
      };

      findSelectors(repoPath);
    } catch (error) {
      // Ignore errors
    }

    return selectors;
  }

  /**
   * Encontrar archivos de test existentes
   */
  findTestFiles(repoPath) {
    const testFiles = [];
    
    try {
      const findTestFiles = (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            findTestFiles(itemPath);
          } else if (item.includes('.test.') || item.includes('.spec.') || item.includes('cypress')) {
            testFiles.push({
              file: item,
              path: itemPath.replace(repoPath, ''),
              type: item.includes('cypress') ? 'cypress' : 'unit'
            });
          }
        }
      };

      findTestFiles(repoPath);
    } catch (error) {
      // Ignore errors
    }

    return testFiles;
  }

  /**
   * Analizar características específicas de admin
   */
  analyzeAdminFeatures(repoPath) {
    const features = [];
    
    try {
      const findFeatures = (dir) => {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const itemPath = path.join(dir, item);
          const stat = fs.statSync(itemPath);
          
          if (stat.isDirectory()) {
            findFeatures(itemPath);
          } else if (item.endsWith('.jsx') || item.endsWith('.tsx') || item.endsWith('.js')) {
            const content = fs.readFileSync(itemPath, 'utf8');
            
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
              { keyword: 'report', name: 'Reports' }
            ];
            
            adminFeatures.forEach(feature => {
              if (content.toLowerCase().includes(feature.keyword)) {
                features.push({
                  feature: feature.name,
                  file: item,
                  path: itemPath.replace(repoPath, ''),
                  keyword: feature.keyword
                });
              }
            });
          }
        }
      };

      findFeatures(repoPath);
    } catch (error) {
      // Ignore errors
    }

    return features;
  }

  /**
   * Generar reporte de análisis
   */
  generateReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      repository: analysis,
      summary: {
        totalComponents: analysis.components.length,
        totalPages: analysis.pages.length,
        totalApiEndpoints: analysis.apiEndpoints.length,
        totalSelectors: analysis.selectors.length,
        totalTestFiles: analysis.testFiles.length,
        totalAdminFeatures: analysis.adminFeatures.length
      },
      recommendations: this.generateRecommendations(analysis)
    };

    // Save report
    const reportPath = path.join(__dirname, '..', 'docs', 'admin-repository-analysis.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Reporte de análisis guardado en: ${reportPath}`);
    return report;
  }

  /**
   * Generar recomendaciones basadas en el análisis
   */
  generateRecommendations(analysis) {
    const recommendations = [];

    // Check for data-testid coverage
    const totalComponents = analysis.components.length;
    const componentsWithTestIds = analysis.components.filter(comp => comp.hasDataTestId).length;

    if (componentsWithTestIds < totalComponents * 0.5) {
      recommendations.push({
        type: 'selector',
        priority: 'high',
        message: 'Baja cobertura de data-testid. Considera agregar atributos data-testid a los componentes para mejor estabilidad de tests.'
      });
    }

    // Check for existing test files
    if (analysis.testFiles.length === 0) {
      recommendations.push({
        type: 'testing',
        priority: 'high',
        message: 'No se encontraron archivos de test existentes. Considera implementar tests unitarios junto con tests de Cypress.'
      });
    }

    // Check for admin-specific features
    const adminFeatures = analysis.adminFeatures.length;
    if (adminFeatures > 0) {
      recommendations.push({
        type: 'admin',
        priority: 'medium',
        message: `Se identificaron ${adminFeatures} características de admin. Considera implementar tests específicos para estas funcionalidades.`
      });
    }

    return recommendations;
  }

  /**
   * Ejecutar análisis completo
   */
  async runAnalysis() {
    try {
      console.log('🚀 Iniciando análisis del repositorio e-lead-promo-admin...\n');
      
      // Clone repository
      const cloned = await this.cloneRepository();
      if (!cloned) {
        console.log('❌ No se pudo clonar el repositorio');
        return;
      }
      
      // Analyze repository
      const analysis = this.analyzeRepository();
      
      // Generate report
      const report = this.generateReport(analysis);
      
      console.log('\n✅ Análisis del repositorio completado!');
      console.log(`📊 Encontrados ${report.summary.totalComponents} componentes`);
      console.log(`📄 Encontradas ${report.summary.totalPages} páginas`);
      console.log(`🔌 Encontrados ${report.summary.totalApiEndpoints} archivos con endpoints API`);
      console.log(`🎯 Encontrados ${report.summary.totalSelectors} archivos con data-testid`);
      console.log(`🧪 Encontrados ${report.summary.totalTestFiles} archivos de test`);
      console.log(`⚙️  Encontradas ${report.summary.totalAdminFeatures} características de admin`);
      
      return report;
    } catch (error) {
      console.error('❌ Análisis falló:', error.message);
      throw error;
    }
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new AdminRepositoryAnalyzer();
  
  analyzer.runAnalysis()
    .then((report) => {
      console.log('\n🎉 Análisis completado exitosamente!');
      console.log('📋 Revisa docs/admin-repository-analysis.json para resultados detallados');
    })
    .catch(error => {
      console.error('\n💥 Análisis falló:', error.message);
      process.exit(1);
    });
}

module.exports = AdminRepositoryAnalyzer;
