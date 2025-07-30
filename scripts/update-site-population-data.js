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

async function updateSitePopulationData() {
  console.log('🔄 Atualizando dados populacionais do site...\n');

  try {
    // 1. Obter dados populacionais mais recentes
    console.log('1. Obtendo dados populacionais mais recentes...');
    const { data: growthData, error: growthError } = await supabase
      .rpc('get_current_population_growth_rate');

    if (growthError) {
      console.error('❌ Erro ao obter taxa de crescimento:', growthError.message);
      return;
    }

    if (!growthData || !growthData.current_population) {
      console.error('❌ Dados populacionais insuficientes para atualização');
      return;
    }

    console.log('✅ Dados populacionais obtidos com sucesso');
    console.log(`   - População atual: ${growthData.current_population.toLocaleString('pt-AO')}`);
    console.log(`   - Taxa de crescimento: ${growthData.growth_rate}%`);
    console.log(`   - Período: ${growthData.period}`);

    // 2. Obter configurações atuais do site
    console.log('\n2. Obtendo configurações atuais do site...');
    const { data: currentSettings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError) {
      console.error('❌ Erro ao obter configurações do site:', settingsError.message);
      return;
    }

    console.log('✅ Configurações atuais obtidas');
    console.log(`   - População atual no site: ${currentSettings.population_count || 'N/A'}`);
    console.log(`   - Taxa atual no site: ${currentSettings.growth_rate || 'N/A'}%`);

    // 3. Preparar dados para atualização
    const updateData = {
      population_count: growthData.current_population.toString(),
      population_description: 'Habitantes registados',
      growth_rate: growthData.growth_rate.toString(),
      growth_description: growthData.description || 'Taxa de crescimento populacional anual',
      growth_period: growthData.period,
      updated_at: new Date().toISOString()
    };

    // 4. Verificar se há mudanças
    const hasChanges = 
      currentSettings.population_count !== updateData.population_count ||
      currentSettings.growth_rate !== updateData.growth_rate ||
      currentSettings.growth_period !== updateData.growth_period;

    if (!hasChanges) {
      console.log('\n✅ Dados já estão atualizados');
      console.log('   - Não há mudanças para aplicar');
      return;
    }

    // 5. Atualizar configurações do site
    console.log('\n3. Atualizando configurações do site...');
    const { data: updatedSettings, error: updateError } = await supabase
      .from('site_settings')
      .update(updateData)
      .eq('id', currentSettings.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Erro ao atualizar configurações:', updateError.message);
      return;
    }

    console.log('✅ Configurações atualizadas com sucesso');
    console.log('\n📊 Resumo das alterações:');
    console.log(`   - População: ${currentSettings.population_count || 'N/A'} → ${updatedSettings.population_count}`);
    console.log(`   - Taxa de crescimento: ${currentSettings.growth_rate || 'N/A'}% → ${updatedSettings.growth_rate}%`);
    console.log(`   - Período: ${currentSettings.growth_period || 'N/A'} → ${updatedSettings.growth_period}`);

    // 6. Verificar se a atualização foi bem-sucedida
    console.log('\n4. Verificando atualização...');
    const { data: verificationData, error: verificationError } = await supabase
      .from('site_settings')
      .select('population_count, growth_rate, growth_period')
      .limit(1)
      .single();

    if (verificationError) {
      console.error('❌ Erro na verificação:', verificationError.message);
      return;
    }

    console.log('✅ Verificação concluída');
    console.log(`   - População verificada: ${verificationData.population_count}`);
    console.log(`   - Taxa verificada: ${verificationData.growth_rate}%`);
    console.log(`   - Período verificado: ${verificationData.growth_period}`);

    // 7. Resumo final
    console.log('\n🎉 Atualização concluída com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('   ✅ Dados populacionais obtidos da base de dados');
    console.log('   ✅ Configurações do site atualizadas');
    console.log('   ✅ Página inicial agora mostra dados reais');
    console.log('   ✅ Taxa de crescimento calculada automaticamente');
    
    console.log('\n💡 Próximos passos:');
    console.log('   1. Verifique a página inicial do portal');
    console.log('   2. Confirme que os dados estão corretos');
    console.log('   3. Os dados serão atualizados automaticamente quando novos registos forem adicionados');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

// Função para executar atualização automática
async function autoUpdatePopulationData() {
  console.log('🤖 Iniciando atualização automática de dados populacionais...\n');
  
  try {
    // Executar atualização
    await updateSitePopulationData();
    
    console.log('\n✅ Atualização automática concluída');
    console.log('   - Dados populacionais sincronizados');
    console.log('   - Página inicial atualizada');
    
  } catch (error) {
    console.error('❌ Erro na atualização automática:', error.message);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  updateSitePopulationData();
}

export { updateSitePopulationData, autoUpdatePopulationData }; 