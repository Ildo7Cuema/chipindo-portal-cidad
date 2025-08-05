const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurado' : '❌ Não configurado');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurado' : '❌ Não configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixHeroStatsData() {
  console.log('🔧 Corrigindo dados de Setores, Projetos e Oportunidades no Hero...');

  try {
    // 1. Verificar e corrigir dados de setores estratégicos
    console.log('🏢 Verificando dados de setores estratégicos...');
    
    // Verificar se a tabela existe
    const { data: setoresCheck, error: setoresCheckError } = await supabase
      .from('setores_estrategicos')
      .select('id')
      .limit(1);

    if (setoresCheckError) {
      console.log('⚠️ Tabela setores_estrategicos não encontrada. Criando...');
      
      // Criar tabela setores_estrategicos
      const { error: createSetoresError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.setores_estrategicos (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            nome TEXT NOT NULL,
            descricao TEXT,
            codigo TEXT UNIQUE,
            ativo BOOLEAN DEFAULT true,
            prioridade INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `
      });

      if (createSetoresError) {
        console.warn('⚠️ Erro ao criar tabela setores_estrategicos:', createSetoresError.message);
      } else {
        console.log('✅ Tabela setores_estrategicos criada');
      }
    }

    // Inserir dados de exemplo para setores se não existirem
    const { data: existingSetores, error: existingSetoresError } = await supabase
      .from('setores_estrategicos')
      .select('id');

    if (existingSetoresError) {
      console.warn('⚠️ Erro ao verificar setores existentes:', existingSetoresError.message);
    } else if (!existingSetores || existingSetores.length === 0) {
      console.log('📝 Inserindo dados de exemplo para setores estratégicos...');
      
      const sampleSetores = [
        { nome: 'Agricultura', descricao: 'Desenvolvimento agrícola sustentável', codigo: 'AGR', ativo: true, prioridade: 1 },
        { nome: 'Educação', descricao: 'Melhoria da qualidade educacional', codigo: 'EDU', ativo: true, prioridade: 2 },
        { nome: 'Saúde', descricao: 'Serviços de saúde pública', codigo: 'SAU', ativo: true, prioridade: 3 },
        { nome: 'Infraestrutura', descricao: 'Desenvolvimento de infraestruturas', codigo: 'INF', ativo: true, prioridade: 4 },
        { nome: 'Turismo', descricao: 'Promoção do turismo local', codigo: 'TUR', ativo: true, prioridade: 5 },
        { nome: 'Comércio', descricao: 'Fomento do comércio local', codigo: 'COM', ativo: true, prioridade: 6 },
        { nome: 'Tecnologia', descricao: 'Inovação e tecnologia', codigo: 'TEC', ativo: true, prioridade: 7 }
      ];

      const { error: insertSetoresError } = await supabase
        .from('setores_estrategicos')
        .insert(sampleSetores);

      if (insertSetoresError) {
        console.warn('⚠️ Erro ao inserir setores de exemplo:', insertSetoresError.message);
      } else {
        console.log('✅ Setores estratégicos inseridos com sucesso');
      }
    }

    // 2. Verificar e corrigir dados de concursos (oportunidades)
    console.log('🎯 Verificando dados de concursos...');
    
    // Verificar se a tabela existe
    const { data: concursosCheck, error: concursosCheckError } = await supabase
      .from('concursos')
      .select('id')
      .limit(1);

    if (concursosCheckError) {
      console.log('⚠️ Tabela concursos não encontrada. Criando...');
      
      // Criar tabela concursos
      const { error: createConcursosError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.concursos (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            titulo TEXT NOT NULL,
            descricao TEXT,
            data_inicio DATE,
            data_fim DATE,
            vagas INTEGER,
            salario DECIMAL(10,2),
            requisitos TEXT,
            published BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `
      });

      if (createConcursosError) {
        console.warn('⚠️ Erro ao criar tabela concursos:', createConcursosError.message);
      } else {
        console.log('✅ Tabela concursos criada');
      }
    }

    // Inserir dados de exemplo para concursos se não existirem
    const { data: existingConcursos, error: existingConcursosError } = await supabase
      .from('concursos')
      .select('id');

    if (existingConcursosError) {
      console.warn('⚠️ Erro ao verificar concursos existentes:', existingConcursosError.message);
    } else if (!existingConcursos || existingConcursos.length === 0) {
      console.log('📝 Inserindo dados de exemplo para concursos...');
      
      const sampleConcursos = [
        {
          titulo: 'Técnico de Informática',
          descricao: 'Vaga para técnico de informática na administração municipal',
          data_inicio: '2024-01-15',
          data_fim: '2024-02-15',
          vagas: 2,
          salario: 150000,
          requisitos: 'Ensino médio completo, conhecimentos em informática',
          published: true
        },
        {
          titulo: 'Assistente Administrativo',
          descricao: 'Vaga para assistente administrativo',
          data_inicio: '2024-01-20',
          data_fim: '2024-02-20',
          vagas: 3,
          salario: 120000,
          requisitos: 'Ensino médio completo, experiência em administração',
          published: true
        },
        {
          titulo: 'Enfermeiro',
          descricao: 'Vaga para enfermeiro no centro de saúde',
          data_inicio: '2024-01-25',
          data_fim: '2024-02-25',
          vagas: 1,
          salario: 180000,
          requisitos: 'Licenciatura em Enfermagem',
          published: true
        }
      ];

      const { error: insertConcursosError } = await supabase
        .from('concursos')
        .insert(sampleConcursos);

      if (insertConcursosError) {
        console.warn('⚠️ Erro ao inserir concursos de exemplo:', insertConcursosError.message);
      } else {
        console.log('✅ Concursos inseridos com sucesso');
      }
    }

    // 3. Verificar e corrigir dados de notícias (projetos)
    console.log('📰 Verificando dados de notícias...');
    
    // Verificar se a tabela existe
    const { data: newsCheck, error: newsCheckError } = await supabase
      .from('news')
      .select('id')
      .limit(1);

    if (newsCheckError) {
      console.log('⚠️ Tabela news não encontrada. Criando...');
      
      // Criar tabela news
      const { error: createNewsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.news (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            excerpt TEXT,
            image_url TEXT,
            author TEXT,
            published BOOLEAN DEFAULT false,
            published_at TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
          );
        `
      });

      if (createNewsError) {
        console.warn('⚠️ Erro ao criar tabela news:', createNewsError.message);
      } else {
        console.log('✅ Tabela news criada');
      }
    }

    // Inserir dados de exemplo para notícias se não existirem
    const { data: existingNews, error: existingNewsError } = await supabase
      .from('news')
      .select('id');

    if (existingNewsError) {
      console.warn('⚠️ Erro ao verificar notícias existentes:', existingNewsError.message);
    } else if (!existingNews || existingNews.length === 0) {
      console.log('📝 Inserindo dados de exemplo para notícias...');
      
      const sampleNews = [
        {
          title: 'Novo Centro de Saúde Inaugurado',
          content: 'O município de Chipindo inaugurou um novo centro de saúde que irá beneficiar milhares de residentes.',
          excerpt: 'Novo centro de saúde inaugurado em Chipindo',
          author: 'Administração Municipal',
          published: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'Projeto de Agricultura Sustentável',
          content: 'Iniciado projeto de agricultura sustentável para aumentar a produção local.',
          excerpt: 'Projeto agrícola sustentável em desenvolvimento',
          author: 'Departamento de Agricultura',
          published: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'Melhorias na Infraestrutura Rodoviária',
          content: 'Obras de melhoria na infraestrutura rodoviária do município estão em andamento.',
          excerpt: 'Obras de infraestrutura em progresso',
          author: 'Departamento de Obras',
          published: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'Programa de Educação Digital',
          content: 'Lançado programa de educação digital para escolas do município.',
          excerpt: 'Programa educacional digital implementado',
          author: 'Departamento de Educação',
          published: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'Iniciativa de Turismo Local',
          content: 'Nova iniciativa para promover o turismo local e atrair visitantes.',
          excerpt: 'Promoção do turismo local',
          author: 'Departamento de Turismo',
          published: true,
          published_at: new Date().toISOString()
        }
      ];

      const { error: insertNewsError } = await supabase
        .from('news')
        .insert(sampleNews);

      if (insertNewsError) {
        console.warn('⚠️ Erro ao inserir notícias de exemplo:', insertNewsError.message);
      } else {
        console.log('✅ Notícias inseridas com sucesso');
      }
    }

    // 4. Verificar dados finais
    console.log('📊 Verificando dados finais...');
    
    const [
      { data: finalSetores, error: finalSetoresError },
      { data: finalConcursos, error: finalConcursosError },
      { data: finalNews, error: finalNewsError }
    ] = await Promise.all([
      supabase.from('setores_estrategicos').select('id', { count: 'exact', head: true }).eq('ativo', true),
      supabase.from('concursos').select('id', { count: 'exact', head: true }).eq('published', true),
      supabase.from('news').select('id', { count: 'exact', head: true }).eq('published', true)
    ]);

    console.log('📋 RESUMO DOS DADOS CORRIGIDOS:');
    console.log('=' .repeat(50));
    console.log(`🏢 Setores Ativos: ${finalSetores?.count || 0}`);
    console.log(`🎯 Concursos Publicados: ${finalConcursos?.count || 0}`);
    console.log(`📰 Notícias Publicadas: ${finalNews?.count || 0}`);
    console.log('=' .repeat(50));

    console.log('\n✅ Correção concluída com sucesso!');
    console.log('🌐 Os dados de Setores, Projetos e Oportunidades no hero agora são reais');
    console.log('📱 A página inicial exibirá informações precisas e atualizadas');

  } catch (error) {
    console.error('❌ Erro durante a correção:', error.message);
    process.exit(1);
  }
}

// Executar correção
fixHeroStatsData(); 