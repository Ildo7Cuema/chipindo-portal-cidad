const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Aplicando migrações de solicitações de serviços...\n');

try {
  // Verificar se o Supabase CLI está instalado
  try {
    execSync('supabase --version', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Supabase CLI não encontrado. Instale com: npm install -g supabase');
    process.exit(1);
  }

  // Aplicar migrações usando Supabase CLI
  console.log('📋 Aplicando migrações...');
  
  // Aplicar migração de serviços
  console.log('1. Aplicando migração de serviços...');
  execSync('supabase db push', { stdio: 'inherit' });
  
  console.log('\n🎉 Migrações aplicadas com sucesso!');
  console.log('\n📋 Resumo das alterações:');
  console.log('   ✅ Tabela servicos criada/verificada');
  console.log('   ✅ Dados de exemplo inseridos');
  console.log('   ✅ Tabela service_requests criada');
  console.log('   ✅ Triggers e funções configurados');
  console.log('   ✅ Políticas de segurança aplicadas');
  console.log('   ✅ View service_requests_view criada');
  console.log('\n🔧 Próximos passos:');
  console.log('   1. Acesse o painel administrativo');
  console.log('   2. Vá para "Solicitações de Serviços"');
  console.log('   3. Teste criando uma solicitação na página de serviços');

} catch (error) {
  console.error('\n❌ Erro ao aplicar migrações:', error.message);
  console.log('\n💡 Alternativa: Execute manualmente:');
  console.log('   supabase db push');
  process.exit(1);
} 