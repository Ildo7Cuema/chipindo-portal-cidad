-- Create storage bucket for hero carousel images
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-carousel', 'hero-carousel', true);

-- Create policies for hero carousel images
CREATE POLICY "Hero carousel images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'hero-carousel');

CREATE POLICY "Authenticated users can upload hero carousel images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'hero-carousel' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero carousel images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'hero-carousel' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero carousel images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'hero-carousel' AND auth.role() = 'authenticated');

-- Create table for hero carousel images
CREATE TABLE public.hero_carousel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_carousel ENABLE ROW LEVEL SECURITY;

-- Create policies for hero carousel table
CREATE POLICY "Anyone can view active hero carousel images" 
ON public.hero_carousel 
FOR SELECT 
USING (active = true);

CREATE POLICY "Authenticated users can manage hero carousel" 
ON public.hero_carousel 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hero_carousel_updated_at
BEFORE UPDATE ON public.hero_carousel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();