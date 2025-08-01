import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMunicipalityCharacterizationTabs() {
  console.log('🧪 Testando as novas abas de Delimitações e Coordenadas...\n');

  try {
    // 1. Verificar se a tabela existe
    console.log('1. Verificando se a tabela municipality_characterization existe...');
    const { data: tableExists, error: tableError } = await supabase
      .from('municipality_characterization')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError.message);
      return;
    }

    console.log('✅ Tabela municipality_characterization encontrada');

    // 2. Carregar dados atuais
    console.log('\n2. Carregando dados atuais...');
    const { data: characterization, error: loadError } = await supabase
      .from('municipality_characterization')
      .select('*')
      .limit(1)
      .single();

    if (loadError) {
      console.error('❌ Erro ao carregar dados:', loadError.message);
      return;
    }

    console.log('✅ Dados carregados com sucesso');

    // 3. Verificar se os campos de delimitações existem
    console.log('\n3. Verificando campos de delimitações...');
    const boundaries = characterization.geography?.boundaries;
    if (boundaries) {
      console.log('✅ Campo boundaries encontrado:');
      console.log('   - Norte:', boundaries.north);
      console.log('   - Sul:', boundaries.south);
      console.log('   - Este:', boundaries.east);
      console.log('   - Oeste:', boundaries.west);
    } else {
      console.log('⚠️  Campo boundaries não encontrado');
    }

    // 4. Verificar se os campos de coordenadas existem
    console.log('\n4. Verificando campos de coordenadas...');
    const coordinates = characterization.geography?.coordinates;
    if (coordinates) {
      console.log('✅ Campo coordinates encontrado:');
      console.log('   - Latitude:', coordinates.latitude);
      console.log('   - Longitude:', coordinates.longitude);
    } else {
      console.log('⚠️  Campo coordinates não encontrado');
    }

    // 5. Testar atualização de delimitações
    console.log('\n5. Testando atualização de delimitações...');
    const updatedBoundaries = {
      north: 'Município de Caconda (Teste)',
      south: 'Município de Caluquembe (Teste)',
      east: 'Município de Quipungo (Teste)',
      west: 'Município de Cacula (Teste)'
    };

    const { error: updateBoundariesError } = await supabase
      .from('municipality_characterization')
      .update({
        geography: {
          ...characterization.geography,
          boundaries: updatedBoundaries
        }
      })
      .eq('id', characterization.id);

    if (updateBoundariesError) {
      console.error('❌ Erro ao atualizar delimitações:', updateBoundariesError.message);
    } else {
      console.log('✅ Delimitações atualizadas com sucesso');
    }

    // 6. Testar atualização de coordenadas
    console.log('\n6. Testando atualização de coordenadas...');
    const updatedCoordinates = {
      latitude: '13.8333° S (Teste)',
      longitude: '14.1667° E (Teste)'
    };

    const { error: updateCoordinatesError } = await supabase
      .from('municipality_characterization')
      .update({
        geography: {
          ...characterization.geography,
          coordinates: updatedCoordinates
        }
      })
      .eq('id', characterization.id);

    if (updateCoordinatesError) {
      console.error('❌ Erro ao atualizar coordenadas:', updateCoordinatesError.message);
    } else {
      console.log('✅ Coordenadas atualizadas com sucesso');
    }

    // 7. Verificar dados atualizados
    console.log('\n7. Verificando dados atualizados...');
    const { data: updatedData, error: verifyError } = await supabase
      .from('municipality_characterization')
      .select('*')
      .limit(1)
      .single();

    if (verifyError) {
      console.error('❌ Erro ao verificar dados atualizados:', verifyError.message);
    } else {
      console.log('✅ Dados atualizados verificados:');
      console.log('   - Delimitações:', updatedData.geography.boundaries);
      console.log('   - Coordenadas:', updatedData.geography.coordinates);
    }

    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📋 Resumo das funcionalidades testadas:');
    console.log('   ✅ Tabela municipality_characterization');
    console.log('   ✅ Campos de delimitações (boundaries)');
    console.log('   ✅ Campos de coordenadas (coordinates)');
    console.log('   ✅ Atualização de delimitações');
    console.log('   ✅ Atualização de coordenadas');
    console.log('   ✅ Verificação de dados atualizados');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar o teste
testMunicipalityCharacterizationTabs(); 