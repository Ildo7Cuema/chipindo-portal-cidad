-- Add setor_id to news
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES public.setores_estrategicos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_news_setor_id ON public.news(setor_id);

-- Add setor_id to events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES public.setores_estrategicos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_events_setor_id ON public.events(setor_id);

-- Add setor_id to concursos
ALTER TABLE public.concursos ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES public.setores_estrategicos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_concursos_setor_id ON public.concursos(setor_id);

-- Add setor_id to acervo_digital
ALTER TABLE public.acervo_digital ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES public.setores_estrategicos(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_acervo_digital_setor_id ON public.acervo_digital(setor_id);
