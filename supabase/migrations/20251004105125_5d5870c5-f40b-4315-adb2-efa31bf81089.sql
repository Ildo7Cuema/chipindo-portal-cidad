-- Adicionar campos para suportar múltiplas imagens na tabela news
ALTER TABLE public.news 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS featured_image_index INTEGER DEFAULT 0;

-- Adicionar comentários para documentação
COMMENT ON COLUMN public.news.images IS 'Array de URLs de imagens associadas à notícia';
COMMENT ON COLUMN public.news.featured_image_index IS 'Índice da imagem destacada no array images';

-- Migrar dados existentes: se existe image_url, adicionar ao array images
UPDATE public.news 
SET images = jsonb_build_array(image_url)
WHERE image_url IS NOT NULL AND image_url != '' AND (images IS NULL OR images = '[]'::jsonb);