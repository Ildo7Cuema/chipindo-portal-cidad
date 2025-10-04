const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  try {
    console.log('🔍 Verificando estrutura da tabela ouvidoria_forward_logs...');

    // Verificar se a tabela existe
    const { data: tableExists, error: tableError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'ouvidoria_forward_logs'
          );
        ` 
      });

    if (tableError) {
      console.error('❌ Erro ao verificar se a tabela existe:', tableError);
      return;
    }

    console.log('✅ Tabela ouvidoria_forward_logs existe');

    // Verificar estrutura da tabela
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT 
            column_name, 
            data_type, 
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = 'ouvidoria_forward_logs' 
          ORDER BY ordinal_position;
        ` 
      });

    if (columnsError) {
      console.error('❌ Erro ao verificar colunas:', columnsError);
      return;
    }

    console.log('📋 Estrutura da tabela:');
    console.table(columns);

    // Verificar se request_id existe
    const hasRequestId = columns.some(col => col.column_name === 'request_id');
    
    if (hasRequestId) {
      console.log('✅ Campo request_id existe na tabela');
    } else {
      console.log('❌ Campo request_id NÃO existe na tabela');
      console.log('💡 Execute a migração para adicionar o campo:');
      console.log('   node scripts/apply-request-id-migration.js');
    }

    // Verificar índices
    const { data: indexes, error: indexesError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT 
            indexname,
            indexdef
          FROM pg_indexes 
          WHERE tablename = 'ouvidoria_forward_logs';
        ` 
      });

    if (indexesError) {
      console.error('❌ Erro ao verificar índices:', indexesError);
      return;
    }

    console.log('📊 Índices da tabela:');
    console.table(indexes);

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

// Executar a verificação
checkTableStructure(); 