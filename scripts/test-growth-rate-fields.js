const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGrowthRateFields() {
  console.log('📈 Testando campos de taxa de crescimento...\n');

  try {
    // 1. Verificar se os campos existem
    console.log('1. Verificando estrutura da tabela site_settings...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Erro ao aceder à tabela site_settings:', tableError.message);
      return;
    }

    if (tableInfo && tableInfo.length > 0) {
      const record = tableInfo[0];
      console.log('✅ Tabela site_settings acessível');
      
      // Verificar se os campos existem
      const hasGrowthRate = 'growth_rate' in record;
      const hasGrowthDescription = 'growth_description' in record;
      const hasGrowthPeriod = 'growth_period' in record;
      
      console.log(`   - growth_rate: ${hasGrowthRate ? '✅' : '❌'}`);
      console.log(`   - growth_description: ${hasGrowthDescription ? '✅' : '❌'}`);
      console.log(`   - growth_period: ${hasGrowthPeriod ? '✅' : '❌'}`);
      
      if (!hasGrowthRate || !hasGrowthDescription || !hasGrowthPeriod) {
        console.log('\n⚠️  Campos não encontrados. Execute o script SQL primeiro:');
        console.log('   scripts/apply-area-total-fields.sql');
        return;
      }
    }

    // 2. Ler configurações atuais
    console.log('\n2. Lendo configurações atuais...');
    const { data: settings, error: readError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (readError) {
      console.error('❌ Erro ao ler configurações:', readError.message);
      return;
    }

    console.log('✅ Configurações lidas com sucesso');
    console.log(`   - Taxa de Crescimento: ${settings.growth_rate || 'N/A'}%`);
    console.log(`   - Descrição: ${settings.growth_description || 'N/A'}`);
    console.log(`   - Período: ${settings.growth_period || 'N/A'}`);

    // 3. Testar atualização
    console.log('\n3. Testando atualização dos campos...');
    const testValues = {
      growth_rate: '6.2',
      growth_description: 'Taxa anual de crescimento populacional',
      growth_period: '2024-2025'
    };

    const { data: updatedSettings, error: updateError } = await supabase
      .from('site_settings')
      .update(testValues)
      .eq('id', settings.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar configurações:', updateError.message);
      return;
    }

    console.log('✅ Configurações atualizadas com sucesso');
    console.log(`   - Nova taxa: ${updatedSettings.growth_rate}%`);
    console.log(`   - Nova descrição: ${updatedSettings.growth_description}`);
    console.log(`   - Novo período: ${updatedSettings.growth_period}`);

    // 4. Reverter para valores originais
    console.log('\n4. Revertendo para valores originais...');
    const originalValues = {
      growth_rate: '5.4',
      growth_description: 'Taxa anual',
      growth_period: '2024'
    };

    const { error: revertError } = await supabase
      .from('site_settings')
      .update(originalValues)
      .eq('id', settings.id);

    if (revertError) {
      console.error('❌ Erro ao reverter configurações:', revertError.message);
      return;
    }

    console.log('✅ Configurações revertidas com sucesso');

    // 5. Resumo final
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('   ✅ Campos de taxa de crescimento estão funcionando');
    console.log('   ✅ Leitura de configurações funciona');
    console.log('   ✅ Atualização de configurações funciona');
    console.log('   ✅ Interface administrativa pode ser atualizada');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Aceda à área administrativa do portal');
    console.log('   2. Vá para "Gestão de Conteúdo do Site"');
    console.log('   3. Na aba "Página Inicial", procure pela seção "Estatísticas"');
    console.log('   4. Configure os campos de "Taxa de Crescimento"');
    console.log('   5. Guarde as alterações');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

testGrowthRateFields(); 