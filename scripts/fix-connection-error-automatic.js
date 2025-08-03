// Script de correção automática para o erro "Could not establish connection"
// Execute: node scripts/fix-connection-error-automatic.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('🔧 Iniciando correção automática do erro de conexão...\n');

async function checkSupabaseConnection() {
  console.log('1️⃣ Verificando conexão com Supabase...');
  
  try {
    const { data, error } = await supabase.from('system_settings').select('id').limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão com Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Conexão com Supabase funcionando corretamente');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error.message);
    return false;
  }
}

async function checkServiceWorkerFile() {
  console.log('\n2️⃣ Verificando arquivo do Service Worker...');
  
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  
  try {
    if (fs.existsSync(swPath)) {
      const stats = fs.statSync(swPath);
      console.log('✅ Arquivo sw.js encontrado');
      console.log(`   Tamanho: ${stats.size} bytes`);
      console.log(`   Modificado: ${stats.mtime}`);
      return true;
    } else {
      console.log('❌ Arquivo sw.js não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar arquivo sw.js:', error.message);
    return false;
  }
}

async function checkViteConfig() {
  console.log('\n3️⃣ Verificando configuração do Vite...');
  
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
  
  try {
    if (fs.existsSync(viteConfigPath)) {
      const content = fs.readFileSync(viteConfigPath, 'utf8');
      
      if (content.includes('serviceWorker') || content.includes('sw.js')) {
        console.log('⚠️  Configuração de Service Worker encontrada no Vite');
      } else {
        console.log('✅ Configuração do Vite sem Service Worker');
      }
      
      return true;
    } else {
      console.log('❌ Arquivo vite.config.ts não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar vite.config.ts:', error.message);
    return false;
  }
}

async function checkPackageJson() {
  console.log('\n4️⃣ Verificando dependências do projeto...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  
  try {
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const problematicPackages = [
        'workbox-webpack-plugin',
        'workbox-cli',
        'service-worker-webpack-plugin',
        'sw-precache-webpack-plugin'
      ];
      
      const found = problematicPackages.filter(pkg => dependencies[pkg]);
      
      if (found.length > 0) {
        console.log('⚠️  Pacotes que podem causar conflitos encontrados:');
        found.forEach(pkg => console.log(`   - ${pkg}`));
      } else {
        console.log('✅ Nenhum pacote problemático encontrado');
      }
      
      return true;
    } else {
      console.log('❌ Arquivo package.json não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar package.json:', error.message);
    return false;
  }
}

async function checkNodeModules() {
  console.log('\n5️⃣ Verificando node_modules...');
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  try {
    if (fs.existsSync(nodeModulesPath)) {
      const stats = fs.statSync(nodeModulesPath);
      console.log('✅ node_modules encontrado');
      console.log(`   Tamanho: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      
      // Verificar se há arquivos corrompidos
      const packageLockPath = path.join(process.cwd(), 'package-lock.json');
      if (fs.existsSync(packageLockPath)) {
        console.log('✅ package-lock.json encontrado');
      } else {
        console.log('⚠️  package-lock.json não encontrado');
      }
      
      return true;
    } else {
      console.log('❌ node_modules não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar node_modules:', error.message);
    return false;
  }
}

async function generateFixScript() {
  console.log('\n6️⃣ Gerando script de correção...');
  
  const fixScript = `
// Script de correção para o erro "Could not establish connection"
// Execute este script no console do navegador (F12 > Console)

console.log('🔧 Aplicando correções...');

// 1. Limpar caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
      console.log('🗑️ Cache removido:', cacheName);
    });
  });
}

// 2. Desregistrar Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🗑️ Service Worker desregistrado:', registration.scope);
    });
  });
}

// 3. Limpar localStorage e sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log('🗑️ Storage limpo');

// 4. Recarregar a página
setTimeout(() => {
  console.log('🔄 Recarregando página...');
  window.location.reload();
}, 1000);
`;

  const scriptPath = path.join(process.cwd(), 'scripts', 'browser-fix.js');
  
  try {
    fs.writeFileSync(scriptPath, fixScript);
    console.log('✅ Script de correção gerado: scripts/browser-fix.js');
    return true;
  } catch (error) {
    console.error('❌ Erro ao gerar script:', error.message);
    return false;
  }
}

async function runAllChecks() {
  console.log('🚀 Executando verificações completas...\n');
  
  const results = {
    supabase: await checkSupabaseConnection(),
    serviceWorker: await checkServiceWorkerFile(),
    viteConfig: await checkViteConfig(),
    packageJson: await checkPackageJson(),
    nodeModules: await checkNodeModules()
  };
  
  console.log('\n📊 RESUMO DAS VERIFICAÇÕES:');
  console.log('==========================');
  console.log(`Supabase: ${results.supabase ? '✅' : '❌'}`);
  console.log(`Service Worker: ${results.serviceWorker ? '✅' : '❌'}`);
  console.log(`Vite Config: ${results.viteConfig ? '✅' : '❌'}`);
  console.log(`Package.json: ${results.packageJson ? '✅' : '❌'}`);
  console.log(`Node Modules: ${results.nodeModules ? '✅' : '❌'}`);
  
  // Gerar script de correção
  await generateFixScript();
  
  console.log('\n💡 RECOMENDAÇÕES:');
  console.log('================');
  
  if (!results.supabase) {
    console.log('🔧 Verifique as credenciais do Supabase');
  }
  
  if (results.serviceWorker) {
    console.log('🔄 Considere desabilitar temporariamente o Service Worker');
  }
  
  console.log('🧹 Execute: npm run clean && npm install');
  console.log('🌐 Use o script gerado: scripts/browser-fix.js');
  console.log('📱 Teste em modo incógnito ou desative extensões');
  
  return results;
}

// Executar verificações
runAllChecks().catch(console.error); 