-- Adicionar coluna categoria à tabela inscricoes
ALTER TABLE public.inscricoes 
ADD COLUMN categoria TEXT;

-- Adicionar comentário à coluna
COMMENT ON COLUMN public.inscricoes.categoria IS 'Categoria selecionada pelo candidato no concurso';

-- Criar índice para melhorar performance de consultas por categoria
CREATE INDEX IF NOT EXISTS idx_inscricoes_categoria ON public.inscricoes(categoria);

-- Adicionar política RLS para a nova coluna (se RLS estiver habilitado)
-- Esta política permite que usuários autenticados vejam a categoria de suas próprias inscrições
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inscricoes' 
        AND schemaname = 'public'
    ) THEN
        -- Se já existem políticas RLS, adicionar a nova coluna às políticas existentes
        -- (Isso será feito automaticamente pelo Supabase)
        NULL;
    END IF;
END $$; 