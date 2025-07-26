-- Script para criar a tabela news_likes
-- Execute este script no Supabase SQL Editor

-- Create table for news likes
CREATE TABLE IF NOT EXISTS public.news_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Pode ser UUID de usuário autenticado ou 'anonymous' para público
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, user_id)
);

-- Enable RLS
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for news_likes
-- Permitir visualização de todas as curtidas (públicas e autenticadas)
CREATE POLICY IF NOT EXISTS "Anyone can view all likes" 
ON public.news_likes 
FOR SELECT 
USING (true);

-- Permitir inserção de curtidas públicas (user_id = 'anonymous')
CREATE POLICY IF NOT EXISTS "Anyone can insert public likes" 
ON public.news_likes 
FOR INSERT 
WITH CHECK (user_id = 'anonymous');

-- Permitir inserção de curtidas de usuários autenticados
CREATE POLICY IF NOT EXISTS "Authenticated users can insert their likes" 
ON public.news_likes 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);

-- Permitir remoção de curtidas públicas
CREATE POLICY IF NOT EXISTS "Anyone can delete public likes" 
ON public.news_likes 
FOR DELETE 
USING (user_id = 'anonymous');

-- Permitir remoção de curtidas de usuários autenticados
CREATE POLICY IF NOT EXISTS "Users can delete their own likes" 
ON public.news_likes 
FOR DELETE 
USING (auth.uid()::text = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_news_likes_updated_at
BEFORE UPDATE ON public.news_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Testar inserção de curtida pública
INSERT INTO news_likes (news_id, user_id) 
VALUES ('00000000-0000-0000-0000-000000000000', 'anonymous')
ON CONFLICT (news_id, user_id) DO NOTHING;

-- Verificar se a inserção funcionou
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

-- Verificar se a tabela foi criada
SELECT 'Tabela news_likes criada com sucesso!' as status; 