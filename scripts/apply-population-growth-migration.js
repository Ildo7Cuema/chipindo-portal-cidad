import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyPopulationGrowthMigration() {
  console.log('🚀 Aplicando migração para cálculo automático de taxa de crescimento populacional...\n');

  try {
    // 1. Verificar se a migração já foi aplicada
    console.log('1. Verificando se a migração já foi aplicada...');
    const { data: existingTable, error: checkError } = await supabase
      .from('population_history')
      .select('count')
      .limit(1);

    if (checkError && checkError.code === 'PGRST116') {
      console.log('   - Tabela population_history não existe, aplicando migração...');
    } else if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message);
      return;
    } else {
      console.log('   - Tabela population_history já existe');
      console.log('   - Verificando se as funções estão disponíveis...');
      
      // Verificar se as funções existem
      const { data: functionCheck, error: functionError } = await supabase
        .rpc('get_current_population_growth_rate');
      
      if (functionError && functionError.code === '42883') {
        console.log('   - Funções não existem, aplicando migração...');
      } else if (functionError) {
        console.error('❌ Erro ao verificar funções:', functionError.message);
        return;
      } else {
        console.log('   - Funções já existem');
        console.log('✅ Migração já foi aplicada anteriormente');
        return;
      }
    }

    // 2. Aplicar migração SQL
    console.log('\n2. Aplicando migração SQL...');
    
    // Nota: As migrações SQL devem ser aplicadas através do Supabase CLI
    // Este script apenas verifica e prepara os dados
    
    console.log('   - Migração SQL deve ser aplicada via Supabase CLI');
    console.log('   - Execute: supabase db push');
    console.log('   - Ou aplique manualmente o arquivo: supabase/migrations/20250725000008-create-population-history.sql');

    // 3. Verificar se os campos de taxa de crescimento existem em site_settings
    console.log('\n3. Verificando campos de taxa de crescimento...');
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError) {
      console.error('❌ Erro ao verificar site_settings:', settingsError.message);
      return;
    }

    const hasGrowthRate = 'growth_rate' in settings;
    const hasGrowthDescription = 'growth_description' in settings;
    const hasGrowthPeriod = 'growth_period' in settings;

    console.log(`   - growth_rate: ${hasGrowthRate ? '✅' : '❌'}`);
    console.log(`   - growth_description: ${hasGrowthDescription ? '✅' : '❌'}`);
    console.log(`   - growth_period: ${hasGrowthPeriod ? '✅' : '❌'}`);

    if (!hasGrowthRate || !hasGrowthDescription || !hasGrowthPeriod) {
      console.log('\n⚠️  Campos de taxa de crescimento não encontrados');
      console.log('   Execute o script: node scripts/test-growth-rate-fields.js');
      console.log('   Ou aplique manualmente: scripts/apply-area-total-fields.sql');
    }

    // 4. Inserir dados de exemplo se a tabela existir
    console.log('\n4. Verificando dados de exemplo...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('population_history')
      .select('*')
      .order('year', { ascending: true });

    if (sampleError) {
      console.log('   - Tabela population_history ainda não existe');
      console.log('   - Dados de exemplo serão inseridos após migração');
    } else {
      console.log(`   - Dados encontrados: ${sampleData.length} registos`);
      if (sampleData.length === 0) {
        console.log('   - Inserindo dados de exemplo...');
        
        const sampleData = [
          { year: 2020, population_count: 145000, source: 'official', notes: 'Censo oficial 2020' },
          { year: 2021, population_count: 148500, source: 'estimate', notes: 'Estimativa baseada em crescimento natural' },
          { year: 2022, population_count: 152000, source: 'estimate', notes: 'Estimativa baseada em crescimento natural' },
          { year: 2023, population_count: 155500, source: 'estimate', notes: 'Estimativa baseada em crescimento natural' },
          { year: 2024, population_count: 159000, source: 'estimate', notes: 'Estimativa atual' }
        ];

        const { error: insertError } = await supabase
          .from('population_history')
          .insert(sampleData);

        if (insertError) {
          console.error('❌ Erro ao inserir dados de exemplo:', insertError.message);
        } else {
          console.log('✅ Dados de exemplo inseridos com sucesso');
        }
      }
    }

    // 5. Testar funcionalidade
    console.log('\n5. Testando funcionalidade...');
    console.log('   - Execute: node scripts/test-population-growth-calculation.js');
    console.log('   - Para testar a implementação completa');

    // 6. Resumo final
    console.log('\n🎉 Preparação concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Execute: supabase db push (para aplicar migrações)');
    console.log('   2. Execute: node scripts/test-population-growth-calculation.js (para testar)');
    console.log('   3. Aceda à área administrativa → População');
    console.log('   4. Adicione registos históricos de população');
    console.log('   5. Use o botão "Atualizar Taxa" para cálculo automático');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

applyPopulationGrowthMigration(); 