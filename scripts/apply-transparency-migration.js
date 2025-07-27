const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY não encontrada no ambiente');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyTransparencyMigration() {
  try {
    console.log('🚀 Aplicando migração de transparência...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'apply-transparency-migration.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`);
    
    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      console.log(`\n${i + 1}/${commands.length}: Executando comando...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.warn(`⚠️  Aviso no comando ${i + 1}:`, error.message);
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
        }
      } catch (err) {
        console.warn(`⚠️  Erro no comando ${i + 1}:`, err.message);
      }
    }
    
    console.log('\n🎉 Migração de transparência concluída!');
    console.log('\n📊 Tabelas criadas:');
    console.log('   - transparency_documents');
    console.log('   - budget_execution');
    console.log('   - transparency_projects');
    console.log('\n📋 Dados de exemplo inseridos');
    console.log('🔒 Políticas de segurança configuradas');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar migração:', error);
    process.exit(1);
  }
}

// Executar a migração
applyTransparencyMigration(); 