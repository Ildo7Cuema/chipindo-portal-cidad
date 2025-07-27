-- Add extra fields to hero_carousel table
ALTER TABLE public.hero_carousel 
ADD COLUMN IF NOT EXISTS link_url TEXT,
ADD COLUMN IF NOT EXISTS button_text TEXT,
ADD COLUMN IF NOT EXISTS overlay_opacity DECIMAL(3,2) DEFAULT 0.5;

-- Add comments for documentation
COMMENT ON COLUMN public.hero_carousel.link_url IS 'Optional URL for the carousel image link';
COMMENT ON COLUMN public.hero_carousel.button_text IS 'Optional text for the call-to-action button';
COMMENT ON COLUMN public.hero_carousel.overlay_opacity IS 'Opacity of the overlay on the image (0.0 to 1.0)'; 