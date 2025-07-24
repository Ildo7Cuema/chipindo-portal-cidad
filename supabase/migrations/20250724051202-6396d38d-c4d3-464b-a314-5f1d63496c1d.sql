-- Create organigrama table for municipal administration structure
CREATE TABLE public.organigrama (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  superior_id UUID REFERENCES public.organigrama(id),
  email TEXT,
  telefone TEXT,
  descricao TEXT,
  foto_url TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.organigrama ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active organigrama" 
ON public.organigrama 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins can manage organigrama" 
ON public.organigrama 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create storage bucket for organigrama photos
INSERT INTO storage.buckets (id, name, public) VALUES ('organigrama-fotos', 'organigrama-fotos', true);

-- Create storage policies for organigrama photos
CREATE POLICY "Anyone can view organigrama photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'organigrama-fotos');

CREATE POLICY "Admins can upload organigrama photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'organigrama-fotos' AND is_current_user_admin());

CREATE POLICY "Admins can update organigrama photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'organigrama-fotos' AND is_current_user_admin());

CREATE POLICY "Admins can delete organigrama photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'organigrama-fotos' AND is_current_user_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_organigrama_updated_at
BEFORE UPDATE ON public.organigrama
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();