-- Migração para corrigir o tipo do campo user_id na tabela news_likes
-- Esta migração altera o campo user_id de UUID para TEXT para permitir valores 'anonymous'

-- Primeiro, vamos verificar se a tabela existe
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'news_likes') THEN
        -- Remover a constraint de foreign key se existir
        ALTER TABLE public.news_likes DROP CONSTRAINT IF EXISTS news_likes_user_id_fkey;
        
        -- Alterar o tipo do campo user_id de UUID para TEXT
        ALTER TABLE public.news_likes ALTER COLUMN user_id TYPE TEXT;
        
        -- Recriar as políticas RLS com o tipo correto
        DROP POLICY IF EXISTS "Anyone can view all likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Anyone can insert public likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Authenticated users can insert their likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Anyone can delete public likes" ON public.news_likes;
        DROP POLICY IF EXISTS "Users can delete their own likes" ON public.news_likes;
        
        -- Criar novas políticas com o tipo TEXT
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
        
        RAISE NOTICE 'Tabela news_likes atualizada com sucesso!';
    ELSE
        RAISE NOTICE 'Tabela news_likes não existe. Execute primeiro o script de criação.';
    END IF;
END $$; 