const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias não encontradas');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySetoresMigrations() {
  console.log('🚀 Aplicando migrações dos setores...');

  try {
    // Read migration files
    const fs = require('fs');
    const path = require('path');

    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    
    // Apply tables migration
    const tablesMigration = fs.readFileSync(
      path.join(migrationsDir, '20250125000003-create-setores-data-tables.sql'),
      'utf8'
    );

    console.log('📋 Criando tabelas dos setores...');
    const { error: tablesError } = await supabase.rpc('exec_sql', { sql: tablesMigration });
    
    if (tablesError) {
      console.error('❌ Erro ao criar tabelas:', tablesError);
      return;
    }
    console.log('✅ Tabelas criadas com sucesso');

    // Apply initial data migration
    const dataMigration = fs.readFileSync(
      path.join(migrationsDir, '20250125000004-insert-setores-initial-data.sql'),
      'utf8'
    );

    console.log('📊 Inserindo dados iniciais...');
    const { error: dataError } = await supabase.rpc('exec_sql', { sql: dataMigration });
    
    if (dataError) {
      console.error('❌ Erro ao inserir dados:', dataError);
      return;
    }
    console.log('✅ Dados iniciais inseridos com sucesso');

    // Verify data insertion
    console.log('🔍 Verificando dados inseridos...');
    
    const { data: culturaStats, error: culturaError } = await supabase
      .from('cultura_estatisticas')
      .select('count')
      .single();

    if (culturaError) {
      console.error('❌ Erro ao verificar dados de cultura:', culturaError);
    } else {
      console.log(`✅ Cultura: ${culturaStats.count} estatísticas inseridas`);
    }

    const { data: tecnologiaStats, error: tecnologiaError } = await supabase
      .from('tecnologia_estatisticas')
      .select('count')
      .single();

    if (tecnologiaError) {
      console.error('❌ Erro ao verificar dados de tecnologia:', tecnologiaError);
    } else {
      console.log(`✅ Tecnologia: ${tecnologiaStats.count} estatísticas inseridas`);
    }

    const { data: economicoStats, error: economicoError } = await supabase
      .from('economico_estatisticas')
      .select('count')
      .single();

    if (economicoError) {
      console.error('❌ Erro ao verificar dados económicos:', economicoError);
    } else {
      console.log(`✅ Desenvolvimento Económico: ${economicoStats.count} estatísticas inseridas`);
    }

    console.log('🎉 Migrações dos setores aplicadas com sucesso!');
    console.log('');
    console.log('📋 Tabelas criadas:');
    console.log('  - cultura_info, cultura_estatisticas, cultura_areas, cultura_eventos');
    console.log('  - cultura_programas, cultura_oportunidades, cultura_infraestruturas, cultura_contactos');
    console.log('  - tecnologia_info, tecnologia_estatisticas, tecnologia_areas, tecnologia_servicos_digitais');
    console.log('  - tecnologia_programas, tecnologia_oportunidades, tecnologia_infraestruturas, tecnologia_contactos');
    console.log('  - economico_info, economico_estatisticas, economico_setores, economico_programas');
    console.log('  - economico_oportunidades, economico_infraestruturas, economico_contactos');
    console.log('');
    console.log('🔐 Políticas de segurança configuradas para acesso público e administrativo');

  } catch (error) {
    console.error('❌ Erro durante a aplicação das migrações:', error);
    process.exit(1);
  }
}

// Run the migration
applySetoresMigrations(); 