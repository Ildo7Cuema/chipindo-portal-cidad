-- Create table for digital archive items
CREATE TABLE public.acervo_digital (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('documento', 'imagem', 'video')),
  category TEXT,
  department TEXT NOT NULL,
  file_url TEXT,
  thumbnail_url TEXT,
  file_size INTEGER,
  mime_type TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  author_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.acervo_digital ENABLE ROW LEVEL SECURITY;

-- Public can view only public items
CREATE POLICY "Anyone can view public acervo items" 
ON public.acervo_digital 
FOR SELECT 
USING (is_public = true);

-- Authenticated users can view all items (for admin interface)
CREATE POLICY "Authenticated users can view all acervo items" 
ON public.acervo_digital 
FOR SELECT 
TO authenticated
USING (true);

-- Authors and admins can manage items
CREATE POLICY "Authors can manage their own acervo items" 
ON public.acervo_digital 
FOR ALL 
TO authenticated
USING (auth.uid() = author_id OR is_current_user_admin());

CREATE POLICY "Authors can create acervo items" 
ON public.acervo_digital 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_acervo_digital_updated_at
BEFORE UPDATE ON public.acervo_digital
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for acervo files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('acervo-digital', 'acervo-digital', true);

-- Create storage policies
CREATE POLICY "Public can view acervo files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'acervo-digital');

CREATE POLICY "Authenticated users can upload acervo files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'acervo-digital');

CREATE POLICY "Authors can update their own acervo files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'acervo-digital');

CREATE POLICY "Authors can delete their own acervo files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'acervo-digital');