-- Migration: Create setores_galeria table and setup storage

-- Create table
CREATE TABLE IF NOT EXISTS public.setores_galeria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setor_id UUID REFERENCES public.setores_estrategicos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    imagem_url TEXT NOT NULL,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_setores_galeria_setor_id ON public.setores_galeria(setor_id);
CREATE INDEX IF NOT EXISTS idx_setores_galeria_ativo ON public.setores_galeria(ativo);

-- Trigger for updated_at
CREATE TRIGGER update_setores_galeria_updated_at 
    BEFORE UPDATE ON public.setores_galeria 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.setores_galeria ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Table
CREATE POLICY "Galeria visível para todos" ON public.setores_galeria
    FOR SELECT USING (true);

CREATE POLICY "Apenas admins podem modificar galeria" ON public.setores_galeria
    FOR ALL USING (auth.role() = 'authenticated');


-- Storage setup
insert into storage.buckets (id, name, public)
values ('setor_gallery', 'setor_gallery', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Galeria de setores visível para todos"
  on storage.objects for select
  using ( bucket_id = 'setor_gallery' );

create policy "Apenas utilizadores autenticados podem fazer upload para a galeria de setores"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'setor_gallery' );

create policy "Apenas utilizadores autenticados podem atualizar imagens da galeria de setores"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'setor_gallery' );

create policy "Apenas utilizadores autenticados podem apagar imagens da galeria de setores"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'setor_gallery' );
