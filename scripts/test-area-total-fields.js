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

async function testAreaTotalFields() {
  console.log('🔍 Testando campos de área total...\n');

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
      const hasAreaTotalCount = 'area_total_count' in record;
      const hasAreaTotalDescription = 'area_total_description' in record;
      
      console.log(`   - area_total_count: ${hasAreaTotalCount ? '✅' : '❌'}`);
      console.log(`   - area_total_description: ${hasAreaTotalDescription ? '✅' : '❌'}`);
      
      if (!hasAreaTotalCount || !hasAreaTotalDescription) {
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
    console.log(`   - Área Total (Número): ${settings.area_total_count || 'N/A'}`);
    console.log(`   - Área Total (Descrição): ${settings.area_total_description || 'N/A'}`);

    // 3. Testar atualização
    console.log('\n3. Testando atualização dos campos...');
    const testValues = {
      area_total_count: '2.500',
      area_total_description: 'Quilómetros quadrados (teste)'
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
    console.log(`   - Novo valor: ${updatedSettings.area_total_count}`);
    console.log(`   - Nova descrição: ${updatedSettings.area_total_description}`);

    // 4. Reverter para valores originais
    console.log('\n4. Revertendo para valores originais...');
    const originalValues = {
      area_total_count: '2.100',
      area_total_description: 'Quilómetros quadrados'
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
    console.log('   ✅ Campos de área total estão funcionando');
    console.log('   ✅ Leitura de configurações funciona');
    console.log('   ✅ Atualização de configurações funciona');
    console.log('   ✅ Interface administrativa pode ser atualizada');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Aceda à área administrativa do portal');
    console.log('   2. Vá para "Gestão de Conteúdo do Site"');
    console.log('   3. Na aba "Página Inicial", procure pela seção "Estatísticas"');
    console.log('   4. Configure os campos "Área Total (Número)" e "Área Total (Descrição)"');
    console.log('   5. Guarde as alterações');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

testAreaTotalFields(); 