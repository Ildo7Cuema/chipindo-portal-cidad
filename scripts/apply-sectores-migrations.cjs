const fs = require('fs');
const path = require('path');

console.log('🚀 Configuração dos Setores Estratégicos - Banco de Dados\n');

console.log('📋 Arquivos de migração criados:');
console.log('✅ supabase/migrations/20250125000001-create-setores-estrategicos.sql');
console.log('✅ supabase/migrations/20250125000002-insert-setores-data.sql');

console.log('\n📊 Dados incluídos:');
console.log('• 8 setores estratégicos principais');
console.log('• Estatísticas para cada setor');
console.log('• Programas e oportunidades');
console.log('• Infraestruturas e contactos');

console.log('\n🔧 Para aplicar as migrações no Supabase:');
console.log('\n1. Acesse o Supabase Dashboard:');
console.log('   https://supabase.com/dashboard');

console.log('\n2. Selecione seu projeto');

console.log('\n3. Vá para SQL Editor');

console.log('\n4. Execute o primeiro arquivo:');
console.log('   - Abra: supabase/migrations/20250125000001-create-setores-estrategicos.sql');
console.log('   - Copie todo o conteúdo');
console.log('   - Cole no SQL Editor e execute');

console.log('\n5. Execute o segundo arquivo:');
console.log('   - Abra: supabase/migrations/20250125000002-insert-setores-data.sql');
console.log('   - Copie todo o conteúdo');
console.log('   - Cole no SQL Editor e execute');

console.log('\n6. Verifique as tabelas criadas:');
console.log('   - Vá para Table Editor');
console.log('   - Verifique se as tabelas foram criadas:');
console.log('     • setores_estrategicos');
console.log('     • setores_estatisticas');
console.log('     • setores_programas');
console.log('     • setores_oportunidades');
console.log('     • setores_infraestruturas');
console.log('     • setores_contactos');

console.log('\n🎯 Após aplicar as migrações:');
console.log('1. Acesse: http://localhost:8082/admin');
console.log('2. Faça login na área administrativa');
console.log('3. Vá para "Setores Estratégicos"');
console.log('4. Os dados estarão persistentes no banco!');

console.log('\n✨ Configuração concluída!'); 