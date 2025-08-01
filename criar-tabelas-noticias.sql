-- =====================================================
-- CRIAÇÃO DAS TABELAS DE NOTÍCIAS
-- Execute este SQL no painel do Supabase > SQL Editor
-- =====================================================

-- 1. Criar tabela de notícias
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

-- 2. Criar índices para notícias
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);

-- 3. Habilitar RLS para notícias
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para notícias
DROP POLICY IF EXISTS "Notícias públicas visíveis para todos" ON news;
CREATE POLICY "Notícias públicas visíveis para todos" ON news
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Autores podem gerenciar suas notícias" ON news;
CREATE POLICY "Autores podem gerenciar suas notícias" ON news
  FOR ALL USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins podem gerenciar todas as notícias" ON news;
CREATE POLICY "Admins podem gerenciar todas as notícias" ON news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 5. Criar tabela de visualizações de notícias
CREATE TABLE IF NOT EXISTS news_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Criar índices para visualizações
CREATE INDEX IF NOT EXISTS idx_news_views_news_id ON news_views(news_id);
CREATE INDEX IF NOT EXISTS idx_news_views_user_id ON news_views(user_id);
CREATE INDEX IF NOT EXISTS idx_news_views_created_at ON news_views(created_at);

-- 7. Habilitar RLS para visualizações
ALTER TABLE news_views ENABLE ROW LEVEL SECURITY;

-- 8. Políticas RLS para visualizações
DROP POLICY IF EXISTS "Qualquer pessoa pode registrar visualização" ON news_views;
CREATE POLICY "Qualquer pessoa pode registrar visualização" ON news_views
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários podem ver suas próprias visualizações" ON news_views;
CREATE POLICY "Usuários podem ver suas próprias visualizações" ON news_views
  FOR SELECT USING (auth.uid() = user_id);

-- 9. Criar tabela de curtidas de notícias
CREATE TABLE IF NOT EXISTS news_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID REFERENCES news(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(news_id, user_id)
);

-- 10. Criar índices para curtidas
CREATE INDEX IF NOT EXISTS idx_news_likes_news_id ON news_likes(news_id);
CREATE INDEX IF NOT EXISTS idx_news_likes_user_id ON news_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_news_likes_created_at ON news_likes(created_at);

-- 11. Habilitar RLS para curtidas
ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;

-- 12. Políticas RLS para curtidas
DROP POLICY IF EXISTS "Usuários autenticados podem curtir" ON news_likes;
CREATE POLICY "Usuários autenticados podem curtir" ON news_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem remover suas curtidas" ON news_likes;
CREATE POLICY "Usuários podem remover suas curtidas" ON news_likes
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Curtidas são visíveis para todos" ON news_likes;
CREATE POLICY "Curtidas são visíveis para todos" ON news_likes
  FOR SELECT USING (true);

-- 13. Inserir dados de exemplo
INSERT INTO news (title, excerpt, content, published, featured, image_url, category) VALUES
(
  'Nova Escola Primária Inaugurada em Chipindo',
  'A Administração Municipal inaugurou uma nova escola primária que beneficiará mais de 200 crianças da região.',
  'A Administração Municipal de Chipindo inaugurou oficialmente uma nova escola primária no bairro central da cidade. A cerimónia contou com a presença do Administrador Municipal, representantes do Ministério da Educação e membros da comunidade local.

A nova infraestrutura inclui 6 salas de aula, uma biblioteca, um laboratório de informática e um campo de jogos. A escola tem capacidade para acolher mais de 200 alunos e irá aliviar significativamente a sobrelotação das escolas existentes na região.

"Esta é uma conquista importante para a educação no nosso município", afirmou o Administrador Municipal durante a cerimónia. "Investir na educação é investir no futuro dos nossos filhos e do nosso município."

A construção da escola foi financiada através de uma parceria entre o Governo Provincial da Huíla e a Administração Municipal de Chipindo, num investimento total de 2.5 milhões de kwanzas.',
  true,
  true,
  'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=800&h=600&fit=crop',
  'educacao'
),
(
  'Melhorias na Rede Rodoviária Municipal',
  'Iniciaram-se as obras de reabilitação de 15 km de estradas municipais para melhorar a mobilidade urbana.',
  'A Administração Municipal de Chipindo iniciou um ambicioso projeto de reabilitação da rede rodoviária municipal. O projeto inclui a reabilitação de 15 quilómetros de estradas, incluindo a pavimentação de vias secundárias e a melhoria do sistema de drenagem.

As obras estão a ser executadas em fases, começando pelas vias de maior fluxo de tráfego. A primeira fase inclui a reabilitação da Avenida Principal e das ruas adjacentes ao centro da cidade.

"Este projeto vai transformar significativamente a mobilidade urbana no nosso município", explicou o Engenheiro Municipal responsável pelo projeto. "Estamos a trabalhar para criar uma cidade mais acessível e moderna."

O projeto tem uma duração prevista de 18 meses e irá beneficiar diretamente mais de 50.000 habitantes. Além da reabilitação das estradas, o projeto inclui também a instalação de iluminação pública e a melhoria dos passeios peonais.',
  true,
  true,
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop',
  'obras'
),
(
  'Programa de Saúde Comunitária Lançado',
  'Novo programa visa melhorar o acesso aos cuidados de saúde primários em todas as comunidades do município.',
  'A Administração Municipal de Chipindo, em parceria com o Ministério da Saúde, lançou um programa abrangente de saúde comunitária. O programa visa melhorar o acesso aos cuidados de saúde primários em todas as comunidades do município.

O programa inclui a criação de postos de saúde móveis que irão percorrer as comunidades mais remotas, a formação de agentes comunitários de saúde e a implementação de campanhas de vacinação e sensibilização.

"O acesso à saúde é um direito fundamental de todos os cidadãos", afirmou o Diretor Municipal de Saúde. "Este programa vai garantir que nenhuma comunidade fique sem acesso aos cuidados básicos de saúde."

O programa também inclui a reabilitação e equipamento de 3 postos de saúde existentes e a construção de 2 novos centros de saúde. Estima-se que o programa irá beneficiar mais de 30.000 pessoas em todo o município.',
  true,
  false,
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
  'saude'
),
(
  'Desenvolvimento Agrícola Sustentável',
  'Iniciativa municipal promove agricultura sustentável e modernização do sector agrícola local.',
  'A Administração Municipal de Chipindo lançou uma iniciativa abrangente para promover o desenvolvimento agrícola sustentável no município. O programa visa modernizar o sector agrícola local e aumentar a produtividade dos agricultores.

O projeto inclui a distribuição de sementes melhoradas, formação em técnicas agrícolas modernas, acesso a microcréditos e a criação de cooperativas agrícolas. Além disso, está prevista a instalação de sistemas de irrigação e a construção de armazéns para conservação de produtos.

"O desenvolvimento agrícola é fundamental para a economia local e para garantir a segurança alimentar das nossas comunidades", explicou o Diretor Municipal de Agricultura. "Este programa vai capacitar os nossos agricultores e modernizar o sector."

O programa tem como objetivo beneficiar mais de 1.000 famílias de agricultores e aumentar a produção agrícola em 40% nos próximos três anos.',
  true,
  true,
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
  'agricultura'
),
(
  'Festival Cultural Municipal 2024',
  'Evento cultural anual celebra a diversidade e riqueza cultural do município de Chipindo.',
  'A Administração Municipal de Chipindo anunciou a realização do Festival Cultural Municipal 2024, um evento que celebra a diversidade e riqueza cultural do município. O festival terá lugar durante uma semana e incluirá apresentações de música tradicional, dança, teatro, exposições de arte e gastronomia local.

O evento contará com a participação de artistas locais, grupos culturais das diferentes comunidades do município e convidados especiais de outras regiões do país. Serão realizadas atividades para todas as idades, incluindo workshops de artesanato, contação de histórias e apresentações musicais.

"O Festival Cultural Municipal é uma oportunidade para celebrar a nossa identidade cultural e promover o turismo local", afirmou o Diretor Municipal de Cultura. "É um momento de união e celebração da nossa rica herança cultural."

O festival é gratuito e aberto ao público, com atividades distribuídas por diferentes locais do município.',
  true,
  false,
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
  'cultura'
)
ON CONFLICT (id) DO NOTHING;

-- 14. Verificar se as tabelas foram criadas
SELECT 
  'news' as tabela,
  COUNT(*) as registos
FROM news
UNION ALL
SELECT 
  'news_views' as tabela,
  COUNT(*) as registos
FROM news_views
UNION ALL
SELECT 
  'news_likes' as tabela,
  COUNT(*) as registos
FROM news_likes;

-- =====================================================
-- FIM DO SCRIPT
-- ===================================================== 