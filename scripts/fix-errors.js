#!/usr/bin/env node

/**
 * Script para limpar e reiniciar o projeto
 * Resolve problemas de cache, listeners duplicados e erros de DOM
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Iniciando limpeza e correção de erros...\n');

// Função para executar comandos
function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído\n`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar: ${description}`);
    console.error(error.message);
    return false;
  }
}

// Função para limpar cache do Vite
function clearViteCache() {
  const cacheDir = path.join(__dirname, '../node_modules/.vite');
  if (fs.existsSync(cacheDir)) {
    console.log('🗑️  Limpando cache do Vite...');
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Cache do Vite limpo\n');
  }
}

// Função para limpar cache do npm/yarn
function clearPackageCache() {
  console.log('🗑️  Limpando cache de pacotes...');
  
  try {
    // Limpar cache do npm
    execSync('npm cache clean --force', { stdio: 'pipe' });
    console.log('✅ Cache do npm limpo');
  } catch (error) {
    console.log('⚠️  Erro ao limpar cache do npm (pode ser ignorado)');
  }
  
  try {
    // Limpar cache do yarn
    execSync('yarn cache clean', { stdio: 'pipe' });
    console.log('✅ Cache do yarn limpo');
  } catch (error) {
    console.log('⚠️  Erro ao limpar cache do yarn (pode ser ignorado)');
  }
  
  console.log('');
}

// Função para verificar e corrigir dependências
function fixDependencies() {
  console.log('🔍 Verificando dependências...');
  
  // Verificar se node_modules existe
  const nodeModulesPath = path.join(__dirname, '../node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Instalando dependências...');
    runCommand('npm install', 'Instalação de dependências');
  } else {
    console.log('📦 Reinstalando dependências...');
    runCommand('rm -rf node_modules package-lock.json', 'Remoção de node_modules');
    runCommand('npm install', 'Reinstalação de dependências');
  }
}

// Função para verificar TypeScript
function checkTypeScript() {
  console.log('🔍 Verificando TypeScript...');
  runCommand('npx tsc --noEmit', 'Verificação de tipos TypeScript');
}

// Função para verificar ESLint
function checkESLint() {
  console.log('🔍 Verificando ESLint...');
  runCommand('npx eslint src --ext .ts,.tsx --fix', 'Correção automática do ESLint');
}

// Função para build de desenvolvimento
function buildDev() {
  console.log('🔨 Construindo projeto...');
  runCommand('npm run build', 'Build do projeto');
}

// Função para iniciar servidor de desenvolvimento
function startDev() {
  console.log('🚀 Iniciando servidor de desenvolvimento...');
  console.log('📝 Para parar o servidor, pressione Ctrl+C\n');
  runCommand('npm run dev', 'Servidor de desenvolvimento');
}

// Função principal
function main() {
  console.log('🛠️  Script de Correção de Erros do Portal de Chipindo\n');
  
  // Verificar se estamos no diretório correto
  const packageJsonPath = path.join(__dirname, '../package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json não encontrado. Execute este script na raiz do projeto.');
    process.exit(1);
  }
  
  // Executar limpezas
  clearViteCache();
  clearPackageCache();
  
  // Verificar e corrigir dependências
  fixDependencies();
  
  // Verificações de código
  checkTypeScript();
  checkESLint();
  
  // Build do projeto
  buildDev();
  
  console.log('🎉 Limpeza e correção concluídas!\n');
  console.log('📋 Próximos passos:');
  console.log('   1. Execute: npm run dev');
  console.log('   2. Abra o navegador em: http://localhost:8080');
  console.log('   3. Verifique se os erros foram resolvidos');
  console.log('   4. Se ainda houver problemas, reinicie o navegador\n');
  
  // Perguntar se quer iniciar o servidor
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('🚀 Deseja iniciar o servidor de desenvolvimento agora? (y/n): ', (answer) => {
    rl.close();
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      startDev();
    } else {
      console.log('👋 Execute "npm run dev" quando estiver pronto!');
    }
  });
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  clearViteCache,
  clearPackageCache,
  fixDependencies,
  checkTypeScript,
  checkESLint,
  buildDev,
  startDev
}; 