import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndCreateTables() {
  console.log('🔍 Verificando tabelas de notícias...');

  try {
    // 1. Verificar se a tabela news existe
    console.log('\n📰 Verificando tabela "news"...');
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('id')
      .limit(1);

    if (newsError) {
      console.log('❌ Tabela "news" não existe. Criando...');
      
      // Criar tabela news
      const { error: createNewsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS news (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            author_id UUID REFERENCES auth.users(id),
            published BOOLEAN DEFAULT false,
            featured BOOLEAN DEFAULT false,
            image_url TEXT,
            category TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Criar índices
          CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
          CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);
          CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
          
          -- Habilitar RLS
          ALTER TABLE news ENABLE ROW LEVEL SECURITY;
          
          -- Políticas RLS
          CREATE POLICY "Notícias públicas visíveis para todos" ON news
            FOR SELECT USING (published = true);
            
          CREATE POLICY "Autores podem gerenciar suas notícias" ON news
            FOR ALL USING (auth.uid() = author_id);
            
          CREATE POLICY "Admins podem gerenciar todas as notícias" ON news
            FOR ALL USING (
              EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
              )
            );
        `
      });

      if (createNewsError) {
        console.error('❌ Erro ao criar tabela news:', createNewsError);
      } else {
        console.log('✅ Tabela "news" criada com sucesso!');
      }
    } else {
      console.log('✅ Tabela "news" já existe');
    }

    // 2. Verificar se a tabela news_views existe
    console.log('\n👁️ Verificando tabela "news_views"...');
    const { data: viewsData, error: viewsError } = await supabase
      .from('news_views')
      .select('id')
      .limit(1);

    if (viewsError) {
      console.log('❌ Tabela "news_views" não existe. Criando...');
      
      // Criar tabela news_views
      const { error: createViewsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS news_views (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            news_id UUID REFERENCES news(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Criar índices
          CREATE INDEX IF NOT EXISTS idx_news_views_news_id ON news_views(news_id);
          CREATE INDEX IF NOT EXISTS idx_news_views_user_id ON news_views(user_id);
          CREATE INDEX IF NOT EXISTS idx_news_views_created_at ON news_views(created_at);
          
          -- Habilitar RLS
          ALTER TABLE news_views ENABLE ROW LEVEL SECURITY;
          
          -- Políticas RLS
          CREATE POLICY "Qualquer pessoa pode registrar visualização" ON news_views
            FOR INSERT WITH CHECK (true);
            
          CREATE POLICY "Usuários podem ver suas próprias visualizações" ON news_views
            FOR SELECT USING (auth.uid() = user_id);
        `
      });

      if (createViewsError) {
        console.error('❌ Erro ao criar tabela news_views:', createViewsError);
      } else {
        console.log('✅ Tabela "news_views" criada com sucesso!');
      }
    } else {
      console.log('✅ Tabela "news_views" já existe');
    }

    // 3. Verificar se a tabela news_likes existe
    console.log('\n❤️ Verificando tabela "news_likes"...');
    const { data: likesData, error: likesError } = await supabase
      .from('news_likes')
      .select('id')
      .limit(1);

    if (likesError) {
      console.log('❌ Tabela "news_likes" não existe. Criando...');
      
      // Criar tabela news_likes
      const { error: createLikesError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS news_likes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            news_id UUID REFERENCES news(id) ON DELETE CASCADE,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(news_id, user_id)
          );
          
          -- Criar índices
          CREATE INDEX IF NOT EXISTS idx_news_likes_news_id ON news_likes(news_id);
          CREATE INDEX IF NOT EXISTS idx_news_likes_user_id ON news_likes(user_id);
          CREATE INDEX IF NOT EXISTS idx_news_likes_created_at ON news_likes(created_at);
          
          -- Habilitar RLS
          ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;
          
          -- Políticas RLS
          CREATE POLICY "Usuários autenticados podem curtir" ON news_likes
            FOR INSERT WITH CHECK (auth.uid() = user_id);
            
          CREATE POLICY "Usuários podem remover suas curtidas" ON news_likes
            FOR DELETE USING (auth.uid() = user_id);
            
          CREATE POLICY "Curtidas são visíveis para todos" ON news_likes
            FOR SELECT USING (true);
        `
      });

      if (createLikesError) {
        console.error('❌ Erro ao criar tabela news_likes:', createLikesError);
      } else {
        console.log('✅ Tabela "news_likes" criada com sucesso!');
      }
    } else {
      console.log('✅ Tabela "news_likes" já existe');
    }

    // 4. Inserir dados de exemplo se não existirem
    console.log('\n📝 Verificando dados de exemplo...');
    const { data: existingNews, error: checkError } = await supabase
      .from('news')
      .select('id')
      .limit(1);

    if (!checkError && (!existingNews || existingNews.length === 0)) {
      console.log('📝 Inserindo dados de exemplo...');
      
      const { error: insertError } = await supabase
        .from('news')
        .insert([
          {
            title: 'Nova Escola Primária Inaugurada em Chipindo',
            excerpt: 'A Administração Municipal inaugurou uma nova escola primária que beneficiará mais de 200 crianças da região.',
            content: 'A Administração Municipal de Chipindo inaugurou oficialmente uma nova escola primária no bairro central da cidade. A cerimónia contou com a presença do Administrador Municipal, representantes do Ministério da Educação e membros da comunidade local.\n\nA nova infraestrutura inclui 6 salas de aula, uma biblioteca, um laboratório de informática e um campo de jogos. A escola tem capacidade para acolher mais de 200 alunos e irá aliviar significativamente a sobrelotação das escolas existentes na região.\n\n"Esta é uma conquista importante para a educação no nosso município", afirmou o Administrador Municipal durante a cerimónia. "Investir na educação é investir no futuro dos nossos filhos e do nosso município."\n\nA construção da escola foi financiada através de uma parceria entre o Governo Provincial da Huíla e a Administração Municipal de Chipindo, num investimento total de 2.5 milhões de kwanzas.',
            published: true,
            featured: true,
            image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=600&fit=crop',
            category: 'educacao'
          },
          {
            title: 'Melhorias na Rede Rodoviária Municipal',
            excerpt: 'Iniciaram-se as obras de reabilitação de 15 km de estradas municipais para melhorar a mobilidade urbana.',
            content: 'A Administração Municipal de Chipindo iniciou um ambicioso projeto de reabilitação da rede rodoviária municipal. O projeto inclui a reabilitação de 15 quilómetros de estradas, incluindo a pavimentação de vias secundárias e a melhoria do sistema de drenagem.\n\nAs obras estão a ser executadas em fases, começando pelas vias de maior fluxo de tráfego. A primeira fase inclui a reabilitação da Avenida Principal e das ruas adjacentes ao centro da cidade.\n\n"Este projeto vai transformar significativamente a mobilidade urbana no nosso município", explicou o Engenheiro Municipal responsável pelo projeto. "Estamos a trabalhar para criar uma cidade mais acessível e moderna."\n\nO projeto tem uma duração prevista de 18 meses e irá beneficiar diretamente mais de 50.000 habitantes. Além da reabilitação das estradas, o projeto inclui também a instalação de iluminação pública e a melhoria dos passeios peonais.',
            published: true,
            featured: true,
            image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop',
            category: 'obras'
          },
          {
            title: 'Programa de Saúde Comunitária Lançado',
            excerpt: 'Novo programa visa melhorar o acesso aos cuidados de saúde primários em todas as comunidades do município.',
            content: 'A Administração Municipal de Chipindo, em parceria com o Ministério da Saúde, lançou um programa abrangente de saúde comunitária. O programa visa melhorar o acesso aos cuidados de saúde primários em todas as comunidades do município.\n\nO programa inclui a criação de postos de saúde móveis que irão percorrer as comunidades mais remotas, a formação de agentes comunitários de saúde e a implementação de campanhas de vacinação e sensibilização.\n\n"O acesso à saúde é um direito fundamental de todos os cidadãos", afirmou o Diretor Municipal de Saúde. "Este programa vai garantir que nenhuma comunidade fique sem acesso aos cuidados básicos de saúde."\n\nO programa também inclui a reabilitação e equipamento de 3 postos de saúde existentes e a construção de 2 novos centros de saúde. Estima-se que o programa irá beneficiar mais de 30.000 pessoas em todo o município.',
            published: true,
            featured: false,
            image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
            category: 'saude'
          }
        ]);

      if (insertError) {
        console.error('❌ Erro ao inserir dados de exemplo:', insertError);
      } else {
        console.log('✅ Dados de exemplo inseridos com sucesso!');
      }
    } else {
      console.log('✅ Dados já existem na tabela');
    }

    console.log('\n🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

// Executar o script
checkAndCreateTables(); 