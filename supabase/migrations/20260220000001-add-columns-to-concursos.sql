-- Adicionar colunas reais à tabela concursos para eliminar dados simulados
-- Esta migração adiciona os campos que o formulário já permite preencher
-- mas que não estavam a ser guardados na base de dados

ALTER TABLE public.concursos 
  ADD COLUMN IF NOT EXISTS salary_range TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS positions_available INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Actualizar registos existentes com valores padrão
UPDATE public.concursos 
SET 
  positions_available = 1,
  priority = 'normal',
  views_count = 0
WHERE positions_available IS NULL OR priority IS NULL OR views_count IS NULL;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN public.concursos.salary_range IS 'Faixa salarial do concurso, ex: 150.000 - 200.000 Kz';
COMMENT ON COLUMN public.concursos.location IS 'Localização/sede do concurso';
COMMENT ON COLUMN public.concursos.positions_available IS 'Número de vagas disponíveis';
COMMENT ON COLUMN public.concursos.priority IS 'Prioridade do concurso: low, normal, high, urgent';
COMMENT ON COLUMN public.concursos.views_count IS 'Contador de visualizações públicas do concurso';
