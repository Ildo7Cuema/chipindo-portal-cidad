-- ============================================================
-- Rádio Online: tabelas radio_settings e radio_schedule
-- ============================================================

-- Tabela de configurações da Rádio (1 linha)
CREATE TABLE IF NOT EXISTS public.radio_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Rádio Chipindo',
    tagline VARCHAR(255) DEFAULT 'A voz do Município',
    description TEXT,
    stream_url TEXT NOT NULL DEFAULT '',
    stream_type VARCHAR(50) DEFAULT 'icecast', -- icecast | shoutcast | mp3 | aac | hls
    logo_url TEXT,
    cover_url TEXT,
    website_url TEXT,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    is_live BOOLEAN DEFAULT true,
    enabled BOOLEAN DEFAULT true,
    social_facebook TEXT,
    social_instagram TEXT,
    social_youtube TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de grelha de programação
CREATE TABLE IF NOT EXISTS public.radio_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    presenter VARCHAR(255),
    description TEXT,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Domingo, 6=Sábado
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    category VARCHAR(100),
    active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_radio_schedule_day ON public.radio_schedule(day_of_week);
CREATE INDEX IF NOT EXISTS idx_radio_schedule_active ON public.radio_schedule(active);

-- RLS
ALTER TABLE public.radio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radio_schedule ENABLE ROW LEVEL SECURITY;

-- Leitura pública (o portal é público)
DROP POLICY IF EXISTS "Public can view radio settings" ON public.radio_settings;
CREATE POLICY "Public can view radio settings" ON public.radio_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view radio schedule" ON public.radio_schedule;
CREATE POLICY "Public can view radio schedule" ON public.radio_schedule
    FOR SELECT USING (true);

-- Escrita apenas para utilizadores autenticados (admin)
DROP POLICY IF EXISTS "Authenticated can insert radio settings" ON public.radio_settings;
CREATE POLICY "Authenticated can insert radio settings" ON public.radio_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update radio settings" ON public.radio_settings;
CREATE POLICY "Authenticated can update radio settings" ON public.radio_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete radio settings" ON public.radio_settings;
CREATE POLICY "Authenticated can delete radio settings" ON public.radio_settings
    FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can insert radio schedule" ON public.radio_schedule;
CREATE POLICY "Authenticated can insert radio schedule" ON public.radio_schedule
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update radio schedule" ON public.radio_schedule;
CREATE POLICY "Authenticated can update radio schedule" ON public.radio_schedule
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete radio schedule" ON public.radio_schedule;
CREATE POLICY "Authenticated can delete radio schedule" ON public.radio_schedule
    FOR DELETE USING (auth.role() = 'authenticated');

-- Linha inicial de configuração (placeholder)
INSERT INTO public.radio_settings (name, tagline, description, stream_url, stream_type, enabled, is_live)
SELECT
    'Rádio Chipindo',
    'A voz do Município',
    'Rádio oficial do Município de Chipindo. Ouça notícias, música e programas culturais em directo, a partir de qualquer lugar do mundo.',
    '',
    'icecast',
    true,
    true
WHERE NOT EXISTS (SELECT 1 FROM public.radio_settings);
