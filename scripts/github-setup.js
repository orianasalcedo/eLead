#!/usr/bin/env node

/**
 * GitHub Setup Helper
 * Ayuda a configurar el acceso a GitHub para el análisis de repositorios
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubSetup {
  constructor() {
    this.envFile = '.env';
  }

  /**
   * Verificar si ya existe un token de GitHub
   */
  checkExistingToken() {
    if (fs.existsSync(this.envFile)) {
      const envContent = fs.readFileSync(this.envFile, 'utf8');
      if (envContent.includes('GITHUB_TOKEN=')) {
        console.log('✅ GITHUB_TOKEN ya está configurado en .env');
        return true;
      }
    }
    return false;
  }

  /**
   * Verificar si SSH está configurado
   */
  checkSSHConfig() {
    try {
      execSync('ssh -T git@github.com', { stdio: 'pipe' });
      console.log('✅ SSH está configurado para GitHub');
      return true;
    } catch (error) {
      console.log('❌ SSH no está configurado para GitHub');
      return false;
    }
  }

  /**
   * Crear archivo .env con el token
   */
  createEnvFile(token) {
    const envContent = `# GitHub Configuration
GITHUB_TOKEN=${token}

# Xray Configuration
XRAY_CLIENT_ID=your-client-id
XRAY_CLIENT_SECRET=your-client-secret
XRAY_AUTO_UPLOAD=false

# Test Environment
BASE_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
API_URL=http://localhost:8000
`;

    fs.writeFileSync(this.envFile, envContent);
    console.log('✅ Archivo .env creado con GITHUB_TOKEN');
  }

  /**
   * Actualizar archivo .env existente
   */
  updateEnvFile(token) {
    let envContent = '';
    
    if (fs.existsSync(this.envFile)) {
      envContent = fs.readFileSync(this.envFile, 'utf8');
    }

    // Actualizar o agregar GITHUB_TOKEN
    if (envContent.includes('GITHUB_TOKEN=')) {
      envContent = envContent.replace(/GITHUB_TOKEN=.*/, `GITHUB_TOKEN=${token}`);
    } else {
      envContent += `\nGITHUB_TOKEN=${token}\n`;
    }

    fs.writeFileSync(this.envFile, envContent);
    console.log('✅ GITHUB_TOKEN actualizado en .env');
  }

  /**
   * Probar el token de GitHub
   */
  testToken(token) {
    try {
      const response = execSync(`curl -H "Authorization: token ${token}" https://api.github.com/user`, { 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      const userInfo = JSON.parse(response);
      console.log(`✅ Token válido para usuario: ${userInfo.login}`);
      return true;
    } catch (error) {
      console.log('❌ Token inválido o sin permisos');
      return false;
    }
  }

  /**
   * Mostrar instrucciones para crear token
   */
  showTokenInstructions() {
    console.log('\n📋 Instrucciones para crear un Personal Access Token:');
    console.log('1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)');
    console.log('2. Click "Generate new token (classic)"');
    console.log('3. Selecciona los scopes:');
    console.log('   - ✅ repo (Full control of private repositories)');
    console.log('   - ✅ read:org (Read org and team membership)');
    console.log('4. Copia el token generado');
    console.log('5. Ejecuta: npm run setup:github');
    console.log('\n💡 El token se guardará en .env y no se compartirá');
  }

  /**
   * Configurar GitHub access
   */
  async setup() {
    console.log('🔧 Configurando acceso a GitHub...\n');

    // Verificar configuración existente
    const hasToken = this.checkExistingToken();
    const hasSSH = this.checkSSHConfig();

    if (hasToken) {
      console.log('✅ Ya tienes GITHUB_TOKEN configurado');
      return;
    }

    if (hasSSH) {
      console.log('✅ SSH está configurado, puedes usar SSH para clonar repositorios');
      console.log('💡 Ejecuta: npm run analyze:repos');
      return;
    }

    // Mostrar instrucciones
    this.showTokenInstructions();

    // Solicitar token
    console.log('\n🔑 Ingresa tu Personal Access Token:');
    console.log('(El token no se mostrará en pantalla por seguridad)');
    
    // En un entorno real, usarías readline para input seguro
    console.log('\n💡 Para configurar el token, ejecuta:');
    console.log('   export GITHUB_TOKEN=tu_token_aqui');
    console.log('   npm run analyze:repos');
    console.log('\n   O edita manualmente el archivo .env');
  }

  /**
   * Clonar repositorios manualmente
   */
  cloneManually() {
    console.log('📁 Clonando repositorios manualmente...\n');

    const commands = [
      {
        name: 'Frontend',
        command: 'git clone -b eleadpromo-nextjs-dev https://github.com/rootstrap/eleadpromo-nextjs.git ./repos/eleadpromo-nextjs'
      },
      {
        name: 'Admin',
        command: 'git clone -b e-lead-promo-admin-develop https://github.com/rootstrap/e-lead-promo-admin.git ./repos/e-lead-promo-admin'
      }
    ];

    console.log('Ejecuta estos comandos manualmente:');
    commands.forEach(cmd => {
      console.log(`\n# ${cmd.name}`);
      console.log(cmd.command);
    });

    console.log('\nDespués de clonar, ejecuta:');
    console.log('npm run analyze:repos');
  }
}

// CLI usage
if (require.main === module) {
  const setup = new GitHubSetup();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--manual')) {
    setup.cloneManually();
  } else {
    setup.setup();
  }
}

module.exports = GitHubSetup;
