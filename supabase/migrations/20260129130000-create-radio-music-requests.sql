-- ============================================================
-- Rádio: pedidos musicais dos ouvintes
-- ============================================================

CREATE TABLE IF NOT EXISTS public.music_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listener_name VARCHAR(255) NOT NULL,
    listener_contact VARCHAR(255), -- email/telefone opcional
    location VARCHAR(255),          -- cidade/país opcional
    song_title VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    dedication TEXT,                -- mensagem/dedicatória opcional
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'played', 'rejected')),
    played_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_music_requests_status ON public.music_requests(status);
CREATE INDEX IF NOT EXISTS idx_music_requests_created ON public.music_requests(created_at DESC);

ALTER TABLE public.music_requests ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode submeter um pedido (formulário público no portal)
DROP POLICY IF EXISTS "Anyone can insert music requests" ON public.music_requests;
CREATE POLICY "Anyone can insert music requests" ON public.music_requests
    FOR INSERT WITH CHECK (true);

-- Apenas administradores autenticados podem ler/gerir
DROP POLICY IF EXISTS "Authenticated can view music requests" ON public.music_requests;
CREATE POLICY "Authenticated can view music requests" ON public.music_requests
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update music requests" ON public.music_requests;
CREATE POLICY "Authenticated can update music requests" ON public.music_requests
    FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete music requests" ON public.music_requests;
CREATE POLICY "Authenticated can delete music requests" ON public.music_requests
    FOR DELETE USING (auth.role() = 'authenticated');
