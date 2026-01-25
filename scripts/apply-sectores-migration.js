import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Supabase
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  try {
    console.log('🚀 Iniciando migração dos Setores Estratégicos...\n');

    // Ler e executar o script de criação das tabelas
    console.log('📋 Criando tabelas...');
    const createTablesSQL = fs.readFileSync(
      path.join(__dirname, 'create-setores-tables.sql'), 
      'utf8'
    );

    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: createTablesSQL
    });

    if (createError) {
      console.error('❌ Erro ao criar tabelas:', createError);
      return;
    }

    console.log('✅ Tabelas criadas com sucesso!\n');

    // Ler e executar o script de inserção de dados
    console.log('📊 Inserindo dados iniciais...');
    const seedDataSQL = fs.readFileSync(
      path.join(__dirname, 'seed-setores-data.sql'), 
      'utf8'
    );

    const { error: seedError } = await supabase.rpc('exec_sql', {
      sql: seedDataSQL
    });

    if (seedError) {
      console.error('❌ Erro ao inserir dados:', seedError);
      return;
    }

    console.log('✅ Dados inseridos com sucesso!\n');

    // Verificar se os dados foram inseridos
    console.log('🔍 Verificando dados inseridos...');
    const { data: setores, error: checkError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .order('ordem');

    if (checkError) {
      console.error('❌ Erro ao verificar dados:', checkError);
      return;
    }

    console.log(`✅ ${setores.length} setores estratégicos encontrados:`);
    setores.forEach(setor => {
      console.log(`   - ${setor.nome} (${setor.slug})`);
    });

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Acesse a área administrativa');
    console.log('   2. Vá para "Setores Estratégicos"');
    console.log('   3. Gerencie os dados dos setores');
    console.log('   4. Acesse as páginas públicas para ver os resultados');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração
applyMigrations(); 