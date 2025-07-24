-- Add social media links to site_settings table
ALTER TABLE public.site_settings 
ADD COLUMN social_facebook TEXT,
ADD COLUMN social_instagram TEXT,
ADD COLUMN social_twitter TEXT,
ADD COLUMN social_youtube TEXT;