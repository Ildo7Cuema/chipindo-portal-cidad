-- Script para testar notícias com imagens
-- Execute este script no Supabase SQL Editor

-- Verificar notícias existentes
SELECT 
  id,
  title,
  excerpt,
  image_url,
  published,
  created_at
FROM news 
ORDER BY created_at DESC 
LIMIT 10;

-- Verificar se há notícias com imagens
SELECT 
  COUNT(*) as total_news,
  COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as with_images,
  COUNT(CASE WHEN image_url IS NULL THEN 1 END) as without_images
FROM news 
WHERE published = true;

-- Inserir notícia de teste com imagem (se não existir)
INSERT INTO news (
  id,
  title,
  excerpt,
  content,
  author_id,
  published,
  featured,
  image_url,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Nova Infraestrutura Municipal',
  'O município de Chipindo inaugura novas obras de infraestrutura que vão melhorar significativamente a qualidade de vida dos cidadãos.',
  'O município de Chipindo está orgulhoso de anunciar a inauguração de importantes obras de infraestrutura que representam um marco no desenvolvimento da nossa região.

Estas novas instalações incluem:

• Melhorias no sistema de abastecimento de água
• Renovação das estradas principais
• Construção de novos centros educacionais
• Modernização dos serviços de saúde

O projeto foi desenvolvido com foco na sustentabilidade e no bem-estar da comunidade, garantindo que as futuras gerações possam desfrutar de uma cidade mais próspera e organizada.

O investimento total superou as expectativas iniciais, demonstrando o compromisso da administração municipal com o progresso e desenvolvimento da região.

"Estamos construindo o futuro de Chipindo", declarou o administrador municipal durante a cerimônia de inauguração.',
  (SELECT id FROM auth.users LIMIT 1),
  true,
  true,
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Verificar notícias após inserção
SELECT 
  id,
  title,
  excerpt,
  image_url,
  published,
  created_at
FROM news 
WHERE published = true
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar estrutura da tabela news
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'news' 
ORDER BY ordinal_position; 