// Script de correção para o erro "Could not establish connection"
// Execute este script no console do navegador (F12 > Console)

console.log('🔧 Iniciando correção do erro de conexão...');

// 1. Limpar caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log(`🗑️ Encontrados ${cacheNames.length} caches para limpar`);
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
      console.log('   Cache removido:', cacheName);
    });
  });
}

// 2. Desregistrar Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log(`🗑️ Encontrados ${registrations.length} Service Workers para desregistrar`);
    registrations.forEach(registration => {
      registration.unregister();
      console.log('   Service Worker desregistrado:', registration.scope);
    });
  });
}

// 3. Limpar localStorage e sessionStorage
localStorage.clear();
sessionStorage.clear();
console.log('🗑️ Storage limpo');

// 4. Verificar e limpar WebSockets
if (window.websockets) {
  window.websockets.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
      console.log('   WebSocket fechado');
    }
  });
}

// 5. Recarregar a página após 2 segundos
setTimeout(() => {
  console.log('🔄 Recarregando página...');
  window.location.reload();
}, 2000);

console.log('✅ Correção aplicada! A página será recarregada em 2 segundos.'); 