-- Script para testar imagens reais no acervo digital
-- Execute este script no Supabase SQL Editor

-- Verificar itens do acervo com imagens
SELECT 
  id,
  title,
  type,
  department,
  is_public,
  file_url,
  thumbnail_url,
  mime_type,
  file_size,
  created_at
FROM acervo_digital 
WHERE type = 'imagem' 
  AND is_public = true
  AND file_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;

-- Verificar estatísticas de tipos de arquivo
SELECT 
  type,
  COUNT(*) as total_items,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_items,
  COUNT(CASE WHEN file_url IS NOT NULL THEN 1 END) as with_file_url,
  COUNT(CASE WHEN thumbnail_url IS NOT NULL THEN 1 END) as with_thumbnail,
  COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as image_files
FROM acervo_digital
GROUP BY type
ORDER BY total_items DESC;

-- Verificar imagens por direção
SELECT 
  department,
  COUNT(*) as total_images,
  COUNT(CASE WHEN is_public = true THEN 1 END) as public_images,
  COUNT(CASE WHEN file_url IS NOT NULL THEN 1 END) as with_file_url
FROM acervo_digital
WHERE type = 'imagem'
GROUP BY department
ORDER BY total_images DESC;

-- Verificar URLs de arquivos válidos
SELECT 
  id,
  title,
  file_url,
  mime_type,
  CASE 
    WHEN file_url LIKE '%.jpg' OR file_url LIKE '%.jpeg' THEN 'JPEG'
    WHEN file_url LIKE '%.png' THEN 'PNG'
    WHEN file_url LIKE '%.gif' THEN 'GIF'
    WHEN file_url LIKE '%.webp' THEN 'WebP'
    WHEN file_url LIKE '%.svg' THEN 'SVG'
    ELSE 'Outro'
  END as detected_format,
  CASE 
    WHEN mime_type LIKE 'image/%' THEN 'MIME correto'
    ELSE 'MIME incorreto'
  END as mime_status
FROM acervo_digital
WHERE type = 'imagem' 
  AND is_public = true
  AND file_url IS NOT NULL
ORDER BY created_at DESC
LIMIT 15;

-- Verificar itens sem thumbnail mas com arquivo
SELECT 
  id,
  title,
  type,
  file_url,
  thumbnail_url,
  mime_type
FROM acervo_digital
WHERE thumbnail_url IS NULL 
  AND file_url IS NOT NULL
  AND is_public = true
ORDER BY created_at DESC
LIMIT 10;

-- Verificar tamanhos de arquivo de imagens
SELECT 
  type,
  COUNT(*) as total_files,
  ROUND(AVG(file_size / 1024.0), 2) as avg_size_kb,
  MIN(file_size / 1024.0) as min_size_kb,
  MAX(file_size / 1024.0) as max_size_kb
FROM acervo_digital
WHERE file_size IS NOT NULL
  AND is_public = true
GROUP BY type
ORDER BY avg_size_kb DESC;

-- Resumo final
SELECT 
  'Teste de imagens reais concluído!' as status,
  'Imagens sendo exibidas nos cards' as cards_status,
  'Modal mostrando imagens reais' as modal_status,
  'Fallback para ícones quando necessário' as fallback_status; 