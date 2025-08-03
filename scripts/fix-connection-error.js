// Script para diagnosticar e corrigir o erro "Could not establish connection"
// Execute este script no console do navegador (F12 > Console)

console.log('🔍 Iniciando diagnóstico do erro de conexão...');

// 1. Verificar se há Service Workers registrados
async function checkServiceWorkers() {
  console.log('\n📋 Verificando Service Workers...');
  
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`✅ Service Workers encontrados: ${registrations.length}`);
      
      registrations.forEach((registration, index) => {
        console.log(`  ${index + 1}. Scope: ${registration.scope}`);
        console.log(`     Estado: ${registration.active ? 'Ativo' : 'Inativo'}`);
        console.log(`     URL: ${registration.active?.scriptURL || 'N/A'}`);
      });
      
      return registrations;
    } catch (error) {
      console.error('❌ Erro ao verificar Service Workers:', error);
      return [];
    }
  } else {
    console.log('❌ Service Workers não suportados neste navegador');
    return [];
  }
}

// 2. Verificar extensões do navegador
function checkBrowserExtensions() {
  console.log('\n🔧 Verificando extensões do navegador...');
  
  // Verificar se há scripts de extensões carregados
  const scripts = document.querySelectorAll('script');
  const extensionScripts = Array.from(scripts).filter(script => 
    script.src && (
      script.src.includes('chrome-extension://') ||
      script.src.includes('moz-extension://') ||
      script.src.includes('safari-extension://') ||
      script.src.includes('all-frames.js')
    )
  );
  
  if (extensionScripts.length > 0) {
    console.log(`⚠️  Scripts de extensão detectados: ${extensionScripts.length}`);
    extensionScripts.forEach((script, index) => {
      console.log(`  ${index + 1}. ${script.src}`);
    });
  } else {
    console.log('✅ Nenhum script de extensão detectado');
  }
  
  return extensionScripts;
}

// 3. Verificar conexões WebSocket
function checkWebSocketConnections() {
  console.log('\n🌐 Verificando conexões WebSocket...');
  
  // Verificar se há WebSockets ativos
  const websockets = window.websockets || [];
  console.log(`WebSockets ativos: ${websockets.length}`);
  
  return websockets;
}

// 4. Verificar mensagens de erro no console
function checkConsoleErrors() {
  console.log('\n🚨 Verificando erros no console...');
  
  // Interceptar erros futuros
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push({
      message: args.join(' '),
      timestamp: new Date().toISOString(),
      stack: new Error().stack
    });
    originalError.apply(console, args);
  };
  
  console.log('✅ Interceptação de erros ativada');
  return errors;
}

// 5. Verificar se há problemas com iframes
function checkIframes() {
  console.log('\n🖼️  Verificando iframes...');
  
  const iframes = document.querySelectorAll('iframe');
  console.log(`Iframes encontrados: ${iframes.length}`);
  
  iframes.forEach((iframe, index) => {
    console.log(`  ${index + 1}. Src: ${iframe.src}`);
    console.log(`     Id: ${iframe.id}`);
    console.log(`     Name: ${iframe.name}`);
  });
  
  return iframes;
}

// 6. Verificar conexões com Supabase
async function checkSupabaseConnection() {
  console.log('\n🗄️  Verificando conexão com Supabase...');
  
  try {
    // Verificar se o Supabase está disponível
    if (window.supabase) {
      console.log('✅ Supabase client encontrado');
      
      // Testar conexão básica
      const { data, error } = await window.supabase.from('system_settings').select('id').limit(1);
      
      if (error) {
        console.error('❌ Erro na conexão com Supabase:', error);
        return false;
      }
      
      console.log('✅ Conexão com Supabase funcionando');
      return true;
    } else {
      console.log('❌ Supabase client não encontrado');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar Supabase:', error);
    return false;
  }
}

// 7. Limpar caches e Service Workers
async function clearCachesAndSW() {
  console.log('\n🧹 Limpando caches e Service Workers...');
  
  try {
    // Limpar caches do Service Worker
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log(`Caches encontrados: ${cacheNames.length}`);
      
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log(`🗑️  Cache removido: ${cacheName}`);
      }
    }
    
    // Desregistrar Service Workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log(`🗑️  Service Worker desregistrado: ${registration.scope}`);
      }
    }
    
    console.log('✅ Limpeza concluída');
    return true;
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    return false;
  }
}

// 8. Função principal de diagnóstico
async function runDiagnostic() {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  const results = {
    serviceWorkers: await checkServiceWorkers(),
    extensions: checkBrowserExtensions(),
    websockets: checkWebSocketConnections(),
    errors: checkConsoleErrors(),
    iframes: checkIframes(),
    supabase: await checkSupabaseConnection()
  };
  
  console.log('\n📊 RESUMO DO DIAGNÓSTICO:');
  console.log('========================');
  console.log(`Service Workers: ${results.serviceWorkers.length}`);
  console.log(`Extensões: ${results.extensions.length}`);
  console.log(`WebSockets: ${results.websockets.length}`);
  console.log(`Iframes: ${results.iframes.length}`);
  console.log(`Supabase: ${results.supabase ? '✅' : '❌'}`);
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  
  if (results.extensions.length > 0) {
    console.log('⚠️  Desative extensões do navegador temporariamente');
  }
  
  if (results.serviceWorkers.length > 0) {
    console.log('🔄 Recarregue a página após limpar Service Workers');
  }
  
  if (!results.supabase) {
    console.log('🔧 Verifique a configuração do Supabase');
  }
  
  return results;
}

// 9. Função para aplicar correções
async function applyFixes() {
  console.log('\n🔧 Aplicando correções...');
  
  // Limpar caches e Service Workers
  await clearCachesAndSW();
  
  // Recarregar a página
  console.log('🔄 Recarregando a página...');
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Exportar funções para uso no console
window.diagnosticTools = {
  runDiagnostic,
  applyFixes,
  checkServiceWorkers,
  checkBrowserExtensions,
  clearCachesAndSW
};

console.log('✅ Script de diagnóstico carregado!');
console.log('📝 Use: diagnosticTools.runDiagnostic() para executar diagnóstico completo');
console.log('🔧 Use: diagnosticTools.applyFixes() para aplicar correções automáticas');

// Executar diagnóstico automático
runDiagnostic(); 