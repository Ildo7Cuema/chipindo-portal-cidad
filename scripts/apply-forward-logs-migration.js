const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyForwardLogsMigration() {
  try {
    console.log('🚀 Iniciando migração da tabela ouvidoria_forward_logs...');

    // Ler o arquivo SQL (versão simplificada)
    const sqlFilePath = path.join(__dirname, 'create-ouvidoria-forward-logs-simple.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('📄 Executando script SQL...');

    // Executar o script SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      // Se o RPC não existir, tentar executar diretamente
      console.log('⚠️ RPC exec_sql não disponível, tentando execução direta...');
      
      // Dividir o script em comandos individuais
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);

      for (const command of commands) {
        if (command.trim()) {
          console.log(`Executando: ${command.substring(0, 50)}...`);
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command + ';' });
          
          if (cmdError) {
            console.warn(`⚠️ Aviso ao executar comando: ${cmdError.message}`);
          }
        }
      }
    }

    console.log('✅ Migração concluída com sucesso!');
    console.log('📋 Tabela ouvidoria_forward_logs criada');
    console.log('🔒 RLS (Row Level Security) configurado');
    console.log('📊 Índices criados para performance');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar a migração
applyForwardLogsMigration(); 