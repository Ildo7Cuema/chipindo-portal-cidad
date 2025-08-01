#!/usr/bin/env node

/**
 * Script para corrigir erro do mobile navigation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigindo erro do mobile navigation...\n');

try {
  // 1. Limpar cache do Vite
  console.log('📦 Limpando cache do Vite...');
  const viteCachePath = path.join(process.cwd(), 'node_modules', '.vite');
  if (fs.existsSync(viteCachePath)) {
    fs.rmSync(viteCachePath, { recursive: true, force: true });
    console.log('✅ Cache do Vite limpo');
  }

  // 2. Limpar cache do npm
  console.log('📦 Limpando cache do npm...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache do npm limpo');

  // 3. Reinstalar dependências
  console.log('📦 Reinstalando dependências...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências reinstaladas');

  // 4. Verificar sintaxe TypeScript
  console.log('🔍 Verificando sintaxe TypeScript...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ Sintaxe TypeScript OK');

  // 5. Verificar ESLint
  console.log('🔍 Verificando ESLint...');
  execSync('npx eslint src/components/ui/mobile-navigation.tsx --fix', { stdio: 'inherit' });
  console.log('✅ ESLint OK');

  console.log('\n🎉 Correções aplicadas com sucesso!');
  console.log('\n🚀 Para testar:');
  console.log('npm run dev');
  console.log('\n📱 Teste o mobile navigation:');
  console.log('1. Abra DevTools (F12)');
  console.log('2. Ative "Toggle device toolbar"');
  console.log('3. Selecione um dispositivo móvel');
  console.log('4. Teste o menu mobile');

} catch (error) {
  console.error('❌ Erro durante a correção:', error.message);
  console.log('\n🔧 Tentando correção manual...');
  
  try {
    // Tentar apenas limpar cache e reiniciar
    console.log('📦 Limpando cache...');
    execSync('rm -rf node_modules/.vite', { stdio: 'inherit' });
    console.log('✅ Cache limpo');
    
    console.log('\n🚀 Tente executar:');
    console.log('npm run dev');
    
  } catch (manualError) {
    console.error('❌ Erro na correção manual:', manualError.message);
    console.log('\n📋 Passos manuais:');
    console.log('1. Pare o servidor (Ctrl+C)');
    console.log('2. Delete a pasta node_modules/.vite');
    console.log('3. Execute: npm run dev');
  }
} 