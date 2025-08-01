import fs from 'fs';
import path from 'path';

// Ler o arquivo de migração
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250725000010-create-municipality-characterization.sql');

try {
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('🚀 SQL para aplicar a migração da caracterização do município:\n');
  console.log('📋 Copie e cole este código no SQL Editor do Supabase:\n');
  console.log('=' .repeat(80));
  console.log(migrationSQL);
  console.log('=' .repeat(80));
  
  console.log('\n📝 Instruções:');
  console.log('1. Acesse o Supabase Dashboard');
  console.log('2. Vá para SQL Editor');
  console.log('3. Cole o código acima');
  console.log('4. Clique em "Run"');
  console.log('5. Verifique se a tabela foi criada com sucesso');
  
  console.log('\n✅ Após executar o SQL, a tabela municipality_characterization será criada');
  console.log('✅ Os dados padrão serão inseridos');
  console.log('✅ As funções RPC serão criadas');
  console.log('✅ As políticas de segurança serão configuradas');
  
} catch (error) {
  console.error('❌ Erro ao ler arquivo de migração:', error.message);
} 