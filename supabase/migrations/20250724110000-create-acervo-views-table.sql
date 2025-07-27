-- Migração para criar tabela de visualizações do acervo digital
-- Execute este script no Supabase SQL Editor

-- Criar tabela para visualizações do acervo digital
CREATE TABLE IF NOT EXISTS public.acervo_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  acervo_id UUID NOT NULL REFERENCES public.acervo_digital(id) ON DELETE CASCADE,
  user_id TEXT, -- NULL para usuários anônimos, UUID para usuários autenticados
  ip_address TEXT, -- Para rastrear visualizações únicas por IP
  user_agent TEXT, -- Para identificar diferentes dispositivos
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(acervo_id, ip_address) -- Uma visualização por IP por item
);

-- Habilitar RLS
ALTER TABLE public.acervo_views ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para visualizações do acervo
CREATE POLICY "Anyone can view all acervo_views" 
ON public.acervo_views 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert acervo_views" 
ON public.acervo_views 
FOR INSERT 
WITH CHECK (true);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_acervo_views_acervo_id ON public.acervo_views(acervo_id);
CREATE INDEX IF NOT EXISTS idx_acervo_views_viewed_at ON public.acervo_views(viewed_at);

-- Trigger para atualização automática de timestamp
CREATE TRIGGER update_acervo_views_updated_at
BEFORE UPDATE ON public.acervo_views
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para registrar visualização do acervo
CREATE OR REPLACE FUNCTION register_acervo_view(
  p_acervo_id UUID,
  p_user_id TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  -- Tentar inserir visualização
  INSERT INTO public.acervo_views (acervo_id, user_id, ip_address, user_agent)
  VALUES (p_acervo_id, p_user_id, p_ip_address, p_user_agent)
  ON CONFLICT (acervo_id, ip_address) DO NOTHING;
  
  -- Retornar true se inseriu, false se já existia
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se a tabela foi criada
SELECT 'Tabela acervo_views criada com sucesso!' as status; 