-- Migração para criar tabela de visualizações de notícias
-- Execute este script no Supabase SQL Editor

-- Criar tabela para visualizações de notícias
CREATE TABLE IF NOT EXISTS public.news_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id TEXT, -- NULL para usuários anônimos, UUID para usuários autenticados
  ip_address TEXT, -- Para rastrear visualizações únicas por IP
  user_agent TEXT, -- Para identificar diferentes dispositivos
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, ip_address) -- Uma visualização por IP por notícia
);

-- Habilitar RLS
ALTER TABLE public.news_views ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para visualizações
CREATE POLICY "Anyone can view all news_views" 
ON public.news_views 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert news_views" 
ON public.news_views 
FOR INSERT 
WITH CHECK (true);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_news_views_news_id ON public.news_views(news_id);
CREATE INDEX IF NOT EXISTS idx_news_views_viewed_at ON public.news_views(viewed_at);

-- Trigger para atualização automática de timestamp
CREATE TRIGGER update_news_views_updated_at
BEFORE UPDATE ON public.news_views
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para registrar visualização
CREATE OR REPLACE FUNCTION register_news_view(
  p_news_id UUID,
  p_user_id TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Tentar inserir visualização
  INSERT INTO public.news_views (news_id, user_id, ip_address, user_agent)
  VALUES (p_news_id, p_user_id, p_ip_address, p_user_agent)
  ON CONFLICT (news_id, ip_address) DO NOTHING;
  
  -- Retornar true se inseriu, false se já existia
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se a tabela foi criada
SELECT 'Tabela news_views criada com sucesso!' as status; 