import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function debugTableStructure() {
  console.log('🔍 Debugando estrutura das tabelas...\n');

  try {
    // 1. Verificar estrutura da tabela setores_estrategicos
    console.log('🏭 Verificando estrutura da tabela setores_estrategicos...');
    const { data: setoresSample, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .limit(3);

    if (setoresError) {
      console.error('❌ Erro ao buscar setores:', setoresError.message);
    } else {
      console.log('✅ Estrutura da tabela setores_estrategicos:');
      if (setoresSample && setoresSample.length > 0) {
        console.log('📋 Campos disponíveis:', Object.keys(setoresSample[0]));
        console.log('📊 Amostra de dados:');
        setoresSample.forEach((setor, index) => {
          console.log(`   ${index + 1}. ID: ${setor.id}, Nome: ${setor.nome}, Ativo: ${setor.ativo}, Categoria: ${setor.categoria}`);
        });

        // Testar diferentes consultas de contagem
        console.log('\n🧪 Testando diferentes consultas de contagem para setores:');
        
        // Consulta 1: Contagem simples
        const { count: count1 } = await supabase
          .from('setores_estrategicos')
          .select('*', { count: 'exact', head: true });
        console.log(`   Contagem simples: ${count1}`);

        // Consulta 2: Contagem com filtro ativo
        const { count: count2 } = await supabase
          .from('setores_estrategicos')
          .select('*', { count: 'exact', head: true })
          .eq('ativo', true);
        console.log(`   Contagem com ativo=true: ${count2}`);

        // Consulta 3: Contagem com filtro ativo como string
        const { count: count3 } = await supabase
          .from('setores_estrategicos')
          .select('*', { count: 'exact', head: true })
          .eq('ativo', 'true');
        console.log(`   Contagem com ativo='true': ${count3}`);

        // Consulta 4: Contagem sem filtro
        const { count: count4 } = await supabase
          .from('setores_estrategicos')
          .select('id', { count: 'exact', head: true });
        console.log(`   Contagem apenas IDs: ${count4}`);
      }
    }

    // 2. Verificar estrutura da tabela concursos
    console.log('\n🎯 Verificando estrutura da tabela concursos...');
    const { data: concursosSample, error: concursosError } = await supabase
      .from('concursos')
      .select('*')
      .limit(3);

    if (concursosError) {
      console.error('❌ Erro ao buscar concursos:', concursosError.message);
    } else {
      console.log('✅ Estrutura da tabela concursos:');
      if (concursosSample && concursosSample.length > 0) {
        console.log('📋 Campos disponíveis:', Object.keys(concursosSample[0]));
        console.log('📊 Amostra de dados:');
        concursosSample.forEach((concurso, index) => {
          console.log(`   ${index + 1}. ID: ${concurso.id}, Título: ${concurso.titulo}, Published: ${concurso.published}, Categoria: ${concurso.categoria}`);
        });

        // Testar diferentes consultas de contagem
        console.log('\n🧪 Testando diferentes consultas de contagem para concursos:');
        
        // Consulta 1: Contagem simples
        const { count: count1 } = await supabase
          .from('concursos')
          .select('*', { count: 'exact', head: true });
        console.log(`   Contagem simples: ${count1}`);

        // Consulta 2: Contagem com filtro published
        const { count: count2 } = await supabase
          .from('concursos')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);
        console.log(`   Contagem com published=true: ${count2}`);

        // Consulta 3: Contagem com filtro published como string
        const { count: count3 } = await supabase
          .from('concursos')
          .select('*', { count: 'exact', head: true })
          .eq('published', 'true');
        console.log(`   Contagem com published='true': ${count3}`);
      }
    }

    // 3. Verificar estrutura da tabela news
    console.log('\n📰 Verificando estrutura da tabela news...');
    const { data: newsSample, error: newsError } = await supabase
      .from('news')
      .select('*')
      .limit(3);

    if (newsError) {
      console.error('❌ Erro ao buscar notícias:', newsError.message);
    } else {
      console.log('✅ Estrutura da tabela news:');
      if (newsSample && newsSample.length > 0) {
        console.log('📋 Campos disponíveis:', Object.keys(newsSample[0]));
        console.log('📊 Amostra de dados:');
        newsSample.forEach((news, index) => {
          console.log(`   ${index + 1}. ID: ${news.id}, Title: ${news.title}, Published: ${news.published}, Category: ${news.category}`);
        });

        // Testar diferentes consultas de contagem
        console.log('\n🧪 Testando diferentes consultas de contagem para notícias:');
        
        // Consulta 1: Contagem simples
        const { count: count1 } = await supabase
          .from('news')
          .select('*', { count: 'exact', head: true });
        console.log(`   Contagem simples: ${count1}`);

        // Consulta 2: Contagem com filtro published
        const { count: count2 } = await supabase
          .from('news')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);
        console.log(`   Contagem com published=true: ${count2}`);

        // Consulta 3: Contagem com filtro published como string
        const { count: count3 } = await supabase
          .from('news')
          .select('*', { count: 'exact', head: true })
          .eq('published', 'true');
        console.log(`   Contagem com published='true': ${count3}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
debugTableStructure(); 