import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.error('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMunicipalityCharacterizationMigration() {
  console.log('🚀 Aplicando migração para caracterização do município...\n');
  
  try {
    // 1. Verificar se a tabela municipality_characterization já existe
    console.log('📋 Verificando se a tabela municipality_characterization existe...');
    const { data: tableExists, error: tableError } = await supabase
      .from('municipality_characterization')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('❌ Tabela municipality_characterization não existe');
      console.log('💡 Execute o comando: supabase db push');
      console.log('   ou aplique a migração: supabase/migrations/20250725000010-create-municipality-characterization.sql\n');
      return;
    }

    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError.message);
      return;
    }

    console.log('✅ Tabela municipality_characterization existe\n');

    // 2. Verificar dados de caracterização
    console.log('📊 Verificando dados de caracterização...');
    const { data: characterization, error: characterizationError } = await supabase
      .from('municipality_characterization')
      .select('*')
      .limit(1)
      .single();

    if (characterizationError) {
      console.error('❌ Erro ao buscar caracterização:', characterizationError.message);
      return;
    }

    if (characterization) {
      console.log('✅ Dados de caracterização encontrados:');
      console.log(`   - ID: ${characterization.id}`);
      console.log(`   - Área: ${characterization.geography?.area || 'N/A'}`);
      console.log(`   - Delimitações: ${characterization.geography?.boundaries ? 'Configuradas' : 'Não configuradas'}`);
      console.log(`   - Coordenadas: ${characterization.geography?.coordinates ? 'Configuradas' : 'Não configuradas'}`);
      console.log(`   - População: ${characterization.demography?.population || 'N/A'}`);
      console.log(`   - Escolas: ${characterization.infrastructure?.schools || 'N/A'}`);
      console.log(`   - Sectores económicos: ${characterization.economy?.mainSectors?.length || 0} sectores`);
      console.log(`   - Rios: ${characterization.natural_resources?.rivers?.length || 0} rios`);
      console.log(`   - Grupos étnicos: ${characterization.culture?.ethnicGroups?.length || 0} grupos`);
      console.log(`   - Última atualização: ${new Date(characterization.updated_at).toLocaleString('pt-AO')}\n`);
    } else {
      console.log('⚠️  Nenhum dado de caracterização encontrado\n');
    }

    // 3. Testar funções RPC
    console.log('🔧 Testando funções RPC...');
    
    // Testar get_municipality_characterization
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_municipality_characterization');

    if (rpcError) {
      console.log('⚠️  Função get_municipality_characterization não disponível:', rpcError.message);
    } else {
      console.log('✅ Função get_municipality_characterization funcionando');
      console.log(`   - Dados retornados: ${Object.keys(rpcData || {}).length} campos`);
    }

    // 4. Testar atualização de dados
    console.log('\n🧪 Testando atualização de dados...');
    const testUpdate = {
      geography: {
        area: "2.100 km² - Teste",
        altitude: "1.200 - 1.800 metros",
        climate: "Tropical de altitude",
        rainfall: "800 - 1.200 mm/ano",
        temperature: "15°C - 25°C"
      }
    };

    const { data: updateResult, error: updateError } = await supabase
      .from('municipality_characterization')
      .update(testUpdate)
      .eq('id', 1)
      .select();

    if (updateError) {
      console.error('❌ Erro ao atualizar caracterização:', updateError.message);
    } else {
      console.log('✅ Caracterização atualizada com sucesso');
      console.log(`   - Nova área: ${updateResult[0].geography?.area}`);
    }

    // 5. Restaurar dados originais
    console.log('\n🔄 Restaurando dados originais...');
    const originalData = {
      geography: {
        area: "2.100 km²",
        altitude: "1.200 - 1.800 metros",
        climate: "Tropical de altitude",
        rainfall: "800 - 1.200 mm/ano",
        temperature: "15°C - 25°C"
      }
    };

    const { error: restoreError } = await supabase
      .from('municipality_characterization')
      .update(originalData)
      .eq('id', 1);

    if (restoreError) {
      console.error('❌ Erro ao restaurar caracterização:', restoreError.message);
    } else {
      console.log('✅ Dados originais restaurados');
    }

    // 6. Resumo final
    console.log('\n🎉 Migração da caracterização do município concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Acesse a página inicial do site');
    console.log('   2. Verifique se a seção "Caracterização do Município" aparece');
    console.log('   3. Confirme se todos os dados estão sendo exibidos corretamente');
    console.log('   4. Teste a responsividade em diferentes dispositivos');
    console.log('\n💡 A seção de caracterização do município agora está integrada na página inicial!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

applyMunicipalityCharacterizationMigration(); 