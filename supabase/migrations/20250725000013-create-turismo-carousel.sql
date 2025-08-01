-- Criar storage bucket para imagens turísticas e ambientais
INSERT INTO storage.buckets (id, name, public) VALUES ('turismo-ambiente', 'turismo-ambiente', true);

-- Criar políticas para imagens turísticas e ambientais
CREATE POLICY "Turismo ambiente images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'turismo-ambiente');

CREATE POLICY "Authenticated users can upload turismo ambiente images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'turismo-ambiente' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update turismo ambiente images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'turismo-ambiente' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete turismo ambiente images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'turismo-ambiente' AND auth.role() = 'authenticated');

-- Criar tabela para carrossel de imagens turísticas e ambientais
CREATE TABLE public.turismo_ambiente_carousel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'turismo', -- 'turismo' ou 'ambiente'
  location TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.turismo_ambiente_carousel ENABLE ROW LEVEL SECURITY;

-- Criar políticas para tabela de carrossel
CREATE POLICY "Anyone can view active turismo ambiente carousel images" 
ON public.turismo_ambiente_carousel 
FOR SELECT 
USING (active = true);

CREATE POLICY "Authenticated users can manage turismo ambiente carousel" 
ON public.turismo_ambiente_carousel 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Criar trigger para atualização automática de timestamps
CREATE TRIGGER update_turismo_ambiente_carousel_updated_at
BEFORE UPDATE ON public.turismo_ambiente_carousel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais de exemplo
INSERT INTO public.turismo_ambiente_carousel (title, description, image_url, category, location, order_index) VALUES
  ('Cascata do Chipindo', 'Uma das mais belas cascatas da região, com águas cristalinas e paisagem deslumbrante', '/turismo-ambiente/cascata-chipindo.jpg', 'turismo', 'Zona Rural de Chipindo', 1),
  ('Parque Natural Municipal', 'Área protegida com rica biodiversidade e trilhos para caminhadas', '/turismo-ambiente/parque-natural.jpg', 'ambiente', 'Parque Natural Municipal', 2),
  ('Vista Panorâmica da Cidade', 'Miradouro com vista deslumbrante sobre toda a cidade de Chipindo', '/turismo-ambiente/vista-panoramica.jpg', 'turismo', 'Miradouro Central', 3),
  ('Floresta Tropical', 'Área de floresta tropical preservada com espécies únicas', '/turismo-ambiente/floresta-tropical.jpg', 'ambiente', 'Reserva Florestal', 4),
  ('Rio Chipindo', 'Rio principal da região, ideal para atividades aquáticas e pesca', '/turismo-ambiente/rio-chipindo.jpg', 'turismo', 'Margens do Rio Chipindo', 5),
  ('Jardim Botânico', 'Jardim com espécies nativas e exóticas, ideal para educação ambiental', '/turismo-ambiente/jardim-botanico.jpg', 'ambiente', 'Centro da Cidade', 6); 