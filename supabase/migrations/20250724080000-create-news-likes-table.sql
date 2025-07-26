-- Create table for news likes
CREATE TABLE public.news_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_id, user_id)
);

-- Enable RLS
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for news_likes
CREATE POLICY "Users can view all likes" 
ON public.news_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like their own likes" 
ON public.news_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.news_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_news_likes_updated_at
BEFORE UPDATE ON public.news_likes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column(); 