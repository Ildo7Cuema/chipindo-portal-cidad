// Script para testar e corrigir filtros por área
// Este script ajuda a identificar problemas com os filtros de área

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.SUPABASE_URL || 'https://murdhrdqqnuntfxmwtqx.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAreaFilters() {
  console.log('🔍 Testando filtros por área...\n');

  try {
    // 1. Buscar todos os registros
    const { data: allRegistrations, error: allError } = await supabase
      .from('interest_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (allError) {
      console.error('❌ Erro ao buscar registros:', allError);
      return;
    }

    console.log(`📊 Total de registros encontrados: ${allRegistrations.length}\n`);

    // 2. Analisar áreas de interesse
    const areaAnalysis = {};
    const uniqueAreas = new Set();

    allRegistrations.forEach(reg => {
      if (reg.areas_of_interest && Array.isArray(reg.areas_of_interest)) {
        reg.areas_of_interest.forEach(area => {
          uniqueAreas.add(area);
          areaAnalysis[area] = (areaAnalysis[area] || 0) + 1;
        });
      }
    });

    console.log('🏷️  Áreas de interesse encontradas:');
    Object.entries(areaAnalysis).forEach(([area, count]) => {
      console.log(`   - ${area}: ${count} registros`);
    });
    console.log('');

    // 3. Testar filtros por área específica
    const testAreas = ['Agricultura', 'Educação', 'Saúde', 'Tecnologia', 'Programa'];
    
    for (const testArea of testAreas) {
      console.log(`🔍 Testando filtro para: "${testArea}"`);
      
      // Buscar registros que contêm esta área
      const { data: filteredData, error: filterError } = await supabase
        .from('interest_registrations')
        .select('*')
        .contains('areas_of_interest', [testArea]);

      if (filterError) {
        console.error(`   ❌ Erro no filtro:`, filterError);
      } else {
        console.log(`   ✅ Encontrados: ${filteredData.length} registros`);
        
        // Mostrar alguns exemplos
        if (filteredData.length > 0) {
          console.log(`   📝 Exemplos:`);
          filteredData.slice(0, 3).forEach(reg => {
            console.log(`      - ${reg.full_name}: [${reg.areas_of_interest.join(', ')}]`);
          });
        }
      }
      console.log('');
    }

    // 4. Verificar registros sem áreas
    const registrationsWithoutAreas = allRegistrations.filter(reg => 
      !reg.areas_of_interest || 
      !Array.isArray(reg.areas_of_interest) || 
      reg.areas_of_interest.length === 0
    );

    if (registrationsWithoutAreas.length > 0) {
      console.log(`⚠️  Registros sem áreas de interesse: ${registrationsWithoutAreas.length}`);
      registrationsWithoutAreas.slice(0, 5).forEach(reg => {
        console.log(`   - ${reg.full_name} (ID: ${reg.id})`);
      });
      console.log('');
    }

    // 5. Sugestões de correção
    console.log('💡 Sugestões de correção:');
    console.log('   1. Verificar se todos os registros têm areas_of_interest como array');
    console.log('   2. Padronizar nomes das áreas (maiúsculas/minúsculas)');
    console.log('   3. Usar contains() para busca parcial em vez de igualdade exata');
    console.log('   4. Implementar busca case-insensitive');
    console.log('');

    // 6. Exemplo de correção para registros problemáticos
    if (registrationsWithoutAreas.length > 0) {
      console.log('🔧 Exemplo de correção para registros sem áreas:');
      console.log(`
        UPDATE interest_registrations 
        SET areas_of_interest = ARRAY['Programa'] 
        WHERE areas_of_interest IS NULL 
        OR areas_of_interest = '{}' 
        OR areas_of_interest = '[]';
      `);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

async function fixAreaFilters() {
  console.log('🔧 Corrigindo filtros por área...\n');

  try {
    // 1. Atualizar registros sem áreas para ter uma área padrão
    const { data: updateResult, error: updateError } = await supabase
      .from('interest_registrations')
      .update({ areas_of_interest: ['Programa'] })
      .is('areas_of_interest', null);

    if (updateError) {
      console.error('❌ Erro ao atualizar registros sem áreas:', updateError);
    } else {
      console.log('✅ Registros sem áreas foram atualizados');
    }

    // 2. Padronizar nomes das áreas (opcional)
    console.log('\n📝 Para padronizar nomes das áreas, execute:');
    console.log(`
      UPDATE interest_registrations 
      SET areas_of_interest = ARRAY(
        SELECT DISTINCT unnest(areas_of_interest)
        ORDER BY unnest(areas_of_interest)
      )
      WHERE areas_of_interest IS NOT NULL;
    `);

  } catch (error) {
    console.error('❌ Erro ao corrigir filtros:', error);
  }
}

// Executar testes
async function main() {
  console.log('🚀 Iniciando testes de filtros por área\n');
  
  await testAreaFilters();
  
  console.log('Deseja corrigir automaticamente os filtros? (y/n)');
  // Em um ambiente real, você pode usar readline ou process.argv
  
  // await fixAreaFilters();
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAreaFilters, fixAreaFilters }; 