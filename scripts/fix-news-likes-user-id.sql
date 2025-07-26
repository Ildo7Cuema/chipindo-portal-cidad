-- Script para corrigir o tipo do campo user_id na tabela news_likes
-- Execute este script no Supabase SQL Editor

-- Verificar se a tabela existe
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_likes') 
    THEN 'Tabela existe - prosseguindo com correção'
    ELSE 'Tabela não existe - execute primeiro o script de criação'
  END as status;

-- Se a tabela existe, corrigir o tipo do campo user_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_likes') THEN
        -- Primeiro, remover TODAS as políticas RLS
        DROP POLICY IF EXISTS "Anyone can view all likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Anyone can insert public likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Authenticated users can insert their likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Anyone can delete public likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Users can delete their own likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Users can like their own likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Users can view all likes" ON public.news_likes;
        
        -- Remover constraint de foreign key se existir
        ALTER TABLE public.news_likes DROP CONSTRAINT IF EXISTS news_likes_user_id_fkey;
        
        -- Agora alterar o tipo do campo user_id de UUID para TEXT
        ALTER TABLE public.news_likes ALTER COLUMN user_id TYPE TEXT;
        
        -- Recriar as políticas RLS com o tipo correto
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
        
        RAISE NOTICE '✅ Campo user_id corrigido para TEXT!';
        RAISE NOTICE '✅ Políticas RLS atualizadas!';
    ELSE
        RAISE NOTICE '❌ Tabela news_likes não existe. Execute primeiro scripts/create-news-likes-table.sql';
    END IF;
END $$;

-- Verificar a estrutura atualizada
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'news_likes'
ORDER BY ordinal_position;

-- Verificar políticas
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'news_likes';

-- Testar inserção de curtida pública
INSERT INTO news_likes (news_id, user_id) 
VALUES ('00000000-0000-0000-0000-000000000000', 'anonymous')
ON CONFLICT (news_id, user_id) DO NOTHING;

-- Verificar se funcionou
SELECT 
  'Teste de inserção' as test,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Inserção funcionou'
    ELSE '❌ Inserção falhou'
  END as status
FROM news_likes 
WHERE news_id = '00000000-0000-0000-0000-000000000000' AND user_id = 'anonymous';

-- Limpar dados de teste
DELETE FROM news_likes 
WHERE news_id = '00000000-0000-0000-0000-000000000000' AND user_id = 'anonymous';

SELECT '✅ Correção concluída com sucesso!' as final_status; 