-- Função para corrigir URLs do acervo digital
CREATE OR REPLACE FUNCTION fix_acervo_urls()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Corrigir URL do item "Estudantes Finalistas.jpg"
  UPDATE acervo_digital 
  SET file_url = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801630319-htxdgb9sn7k.jpg'
  WHERE id = '4c36cf4b-78c8-435f-8c33-8283df05f895' AND file_url IS NULL;
  
  -- Corrigir URL do item "Chipindo - 29:08:2024.mov"
  UPDATE acervo_digital 
  SET file_url = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801633098-ssxsitgyrye.mov'
  WHERE id = 'bb3bdbfe-ec9e-440a-b334-7286a4c638d4' AND file_url IS NULL;
  
  -- Corrigir URL do item "Director da Educação.jpg" (se existir arquivo correspondente)
  UPDATE acervo_digital 
  SET file_url = 'https://murdhrdqqnuntfxmwtqx.supabase.co/storage/v1/object/public/acervo-digital/1753801656710-3h9p1jrs2yh.jpg'
  WHERE id = 'edb6a77e-1e52-48ee-acc0-2587b8dabb2d' AND file_url IS NULL;
  
  RAISE NOTICE 'URLs do acervo corrigidos com sucesso';
END;
$$;

-- Executar a função
SELECT fix_acervo_urls(); 