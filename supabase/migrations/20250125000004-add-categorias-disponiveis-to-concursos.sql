-- Add categorias_disponiveis field to concursos table
ALTER TABLE public.concursos 
ADD COLUMN categorias_disponiveis TEXT[] DEFAULT '{}';

-- Update existing records to have an empty array
UPDATE public.concursos 
SET categorias_disponiveis = '{}' 
WHERE categorias_disponiveis IS NULL; 