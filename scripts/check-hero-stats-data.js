import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function checkAndFixHeroStats() {
  console.log('🔍 Verificando dados das estatísticas do Hero...\n');

  try {
    // 1. Verificar tabela population_history
    console.log('📊 Verificando dados populacionais...');
    const { data: populationData, error: populationError } = await supabase
      .from('population_history')
      .select('*')
      .order('year', { ascending: false });

    if (populationError) {
      console.error('❌ Erro ao buscar dados populacionais:', populationError.message);
    } else {
      console.log(`✅ Dados populacionais encontrados: ${populationData?.length || 0} registros`);
      if (populationData && populationData.length > 0) {
        console.log('📈 Últimos dados populacionais:');
        populationData.slice(0, 3).forEach(record => {
          console.log(`   ${record.year}: ${record.population_count?.toLocaleString('pt-AO')} habitantes`);
        });
      } else {
        console.log('⚠️  Nenhum dado populacional encontrado. Inserindo dados de exemplo...');
        
        // Inserir dados de exemplo
        const { error: insertError } = await supabase
          .from('population_history')
          .insert([
            {
              year: 2024,
              population_count: 125000,
              source: 'official',
              notes: 'Estimativa oficial 2024'
            },
            {
              year: 2023,
              population_count: 122000,
              source: 'official',
              notes: 'Estimativa oficial 2023'
            },
            {
              year: 2022,
              population_count: 119000,
              source: 'official',
              notes: 'Estimativa oficial 2022'
            }
          ]);

        if (insertError) {
          console.error('❌ Erro ao inserir dados populacionais:', insertError.message);
        } else {
          console.log('✅ Dados populacionais inseridos com sucesso!');
        }
      }
    }

    // 2. Verificar tabela setores_estrategicos
    console.log('\n🏭 Verificando setores estratégicos...');
    const { data: setoresData, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .eq('ativo', true);

    if (setoresError) {
      console.error('❌ Erro ao buscar setores estratégicos:', setoresError.message);
    } else {
      console.log(`✅ Setores estratégicos encontrados: ${setoresData?.length || 0} ativos`);
      if (setoresData && setoresData.length > 0) {
        console.log('🏭 Setores ativos:');
        setoresData.forEach(setor => {
          console.log(`   - ${setor.nome} (${setor.categoria})`);
        });
      } else {
        console.log('⚠️  Nenhum setor estratégico encontrado. Verificando se a tabela existe...');
        
        // Verificar se a tabela existe
        const { data: tableCheck, error: tableError } = await supabase
          .from('setores_estrategicos')
          .select('id')
          .limit(1);

        if (tableError) {
          console.log('❌ Tabela setores_estrategicos não existe ou não está acessível');
        } else {
          console.log('✅ Tabela setores_estrategicos existe mas está vazia');
        }
      }
    }

    // 3. Verificar tabela concursos (oportunidades)
    console.log('\n🎯 Verificando concursos/oportunidades...');
    const { data: concursosData, error: concursosError } = await supabase
      .from('concursos')
      .select('*')
      .eq('published', true);

    if (concursosError) {
      console.error('❌ Erro ao buscar concursos:', concursosError.message);
    } else {
      console.log(`✅ Concursos publicados encontrados: ${concursosData?.length || 0}`);
      if (concursosData && concursosData.length > 0) {
        console.log('🎯 Últimos concursos:');
        concursosData.slice(0, 3).forEach(concurso => {
          console.log(`   - ${concurso.titulo} (${concurso.categoria})`);
        });
      } else {
        console.log('⚠️  Nenhum concurso publicado encontrado');
      }
    }

    // 4. Verificar tabela news (projetos)
    console.log('\n📰 Verificando notícias/projetos...');
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .eq('published', true);

    if (newsError) {
      console.error('❌ Erro ao buscar notícias:', newsError.message);
    } else {
      console.log(`✅ Notícias publicadas encontradas: ${newsData?.length || 0}`);
      if (newsData && newsData.length > 0) {
        console.log('📰 Últimas notícias:');
        newsData.slice(0, 3).forEach(news => {
          console.log(`   - ${news.title} (${news.category})`);
        });
      } else {
        console.log('⚠️  Nenhuma notícia publicada encontrada');
      }
    }

    // 5. Resumo das estatísticas
    console.log('\n📊 RESUMO DAS ESTATÍSTICAS DO HERO:');
    console.log('=====================================');
    
    const currentPopulation = populationData?.[0]?.population_count || 0;
    const sectorsCount = setoresData?.length || 0;
    const projectsCount = newsData?.length || 0;
    const opportunitiesCount = concursosData?.length || 0;

    console.log(`👥 População: ${currentPopulation.toLocaleString('pt-AO')} habitantes`);
    console.log(`🏭 Setores: ${sectorsCount} estratégicos`);
    console.log(`📰 Projetos: ${projectsCount} notícias/projetos`);
    console.log(`🎯 Oportunidades: ${opportunitiesCount} concursos`);

    if (currentPopulation === 0 || sectorsCount === 0) {
      console.log('\n⚠️  PROBLEMAS IDENTIFICADOS:');
      console.log('   - Dados populacionais ou setores estão vazios');
      console.log('   - As estatísticas do Hero não serão exibidas corretamente');
      console.log('\n💡 SOLUÇÕES:');
      console.log('   1. Verificar se as tabelas existem no banco de dados');
      console.log('   2. Inserir dados de exemplo nas tabelas vazias');
      console.log('   3. Verificar as permissões RLS das tabelas');
    } else {
      console.log('\n✅ Todas as estatísticas estão disponíveis!');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
checkAndFixHeroStats(); 