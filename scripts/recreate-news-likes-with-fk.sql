-- Script para recriar a tabela news_likes com foreign key
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_likes') 
    THEN 'Tabela existe - será recriada'
    ELSE 'Tabela não existe - será criada'
  END as status;

-- Recriar a tabela do zero
DO $$
BEGIN
    -- Remover a tabela se existir (isso remove automaticamente todas as políticas)
    DROP TABLE IF EXISTS public.news_likes CASCADE;
    
    -- Criar a tabela com o tipo correto desde o início
    CREATE TABLE public.news_likes (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      news_id UUID NOT NULL, -- Sem constraint inicialmente
      user_id TEXT NOT NULL, -- Pode ser UUID de usuário autenticado ou 'anonymous' para público
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      UNIQUE(news_id, user_id)
    );
    
    -- Habilitar RLS
    ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;
    
    -- Criar políticas RLS
    CREATE POLICY "Anyone can view all likes" 
    ON public.news_likes 
    FOR SELECT 
    USING (true);

    CREATE POLICY "Anyone can insert public likes" 
    ON public.news_likes 
    FOR INSERT 
    WITH CHECK (user_id = 'anonymous');

    CREATE POLICY "Authenticated users can insert their likes" 
    ON public.news_likes 
    FOR INSERT 
    WITH CHECK (auth.uid()::text = user_id);

    CREATE POLICY "Anyone can delete public likes" 
    ON public.news_likes 
    FOR DELETE 
    USING (user_id = 'anonymous');

    CREATE POLICY "Users can delete their own likes" 
    ON public.news_likes 
    FOR DELETE 
    USING (auth.uid()::text = user_id);
    
    -- Criar trigger para atualização automática de timestamp
    CREATE TRIGGER update_news_likes_updated_at
    BEFORE UPDATE ON public.news_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
    
    RAISE NOTICE '✅ Tabela news_likes recriada com sucesso!';
    RAISE NOTICE '✅ Campo user_id configurado como TEXT!';
    RAISE NOTICE '✅ Políticas RLS configuradas!';
END $$;

-- Verificar a estrutura da nova tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'news_likes'
ORDER BY ordinal_position;

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'news_likes';

-- Testar inserção de curtida pública
DO $$
DECLARE
  test_news_id UUID;
BEGIN
    -- Buscar um news_id válido
    SELECT id INTO test_news_id FROM news LIMIT 1;
    
    -- Se não encontrar nenhuma notícia, criar uma notícia de teste
    IF test_news_id IS NULL THEN
        INSERT INTO news (id, title, content, published, author_id) 
        VALUES (
            gen_random_uuid(),
            'Notícia de Teste',
            'Conteúdo de teste para verificar curtidas',
            true,
            (SELECT id FROM auth.users LIMIT 1)
        ) ON CONFLICT DO NOTHING;
        
        SELECT id INTO test_news_id FROM news WHERE title = 'Notícia de Teste' LIMIT 1;
    END IF;
    
    -- Inserir curtida de teste
    INSERT INTO news_likes (news_id, user_id) 
    VALUES (test_news_id, 'anonymous')
    ON CONFLICT (news_id, user_id) DO NOTHING;
    
    RAISE NOTICE '✅ Teste de inserção realizado com news_id: %', test_news_id;
END $$;

-- Verificar se a inserção funcionou
SELECT 
  'Teste de inserção' as test,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Inserção funcionou'
    ELSE '❌ Inserção falhou'
  END as status
FROM news_likes 
WHERE user_id = 'anonymous';

-- Limpar dados de teste
DELETE FROM news_likes 
WHERE user_id = 'anonymous';

-- Adicionar foreign key constraint se houver notícias
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news') THEN
        -- Adicionar foreign key constraint
        ALTER TABLE public.news_likes 
        ADD CONSTRAINT news_likes_news_id_fkey 
        FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;
        
        RAISE NOTICE '✅ Foreign key constraint adicionada!';
    ELSE
        RAISE NOTICE '⚠️ Tabela news não existe - foreign key não adicionada';
    END IF;
END $$;

-- Resumo final
SELECT 
  'Tabela news_likes recriada com sucesso!' as status,
  'Campo user_id configurado como TEXT' as user_id_type,
  'Políticas RLS configuradas para usuários públicos e autenticados' as policies_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'news_likes_news_id_fkey')
    THEN 'Foreign key constraint adicionada'
    ELSE 'Foreign key constraint não adicionada (tabela news não existe)'
  END as fk_status; 