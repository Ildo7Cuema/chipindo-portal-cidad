-- Create population history table for automatic growth rate calculation
CREATE TABLE IF NOT EXISTS public.population_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  population_count INTEGER NOT NULL,
  source TEXT DEFAULT 'official',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year)
);

-- Enable RLS
ALTER TABLE public.population_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view population history"
ON public.population_history
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage population history"
ON public.population_history
FOR ALL
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_population_history_updated_at
BEFORE UPDATE ON public.population_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample historical data for Chipindo
INSERT INTO public.population_history (year, population_count, source, notes) VALUES
  (2020, 145000, 'official', 'Censo oficial 2020'),
  (2021, 148500, 'estimate', 'Estimativa baseada em crescimento natural'),
  (2022, 152000, 'estimate', 'Estimativa baseada em crescimento natural'),
  (2023, 155500, 'estimate', 'Estimativa baseada em crescimento natural'),
  (2024, 159000, 'estimate', 'Estimativa atual')
ON CONFLICT (year) DO NOTHING;

-- Function to calculate growth rate between two years
CREATE OR REPLACE FUNCTION public.calculate_population_growth_rate(
  start_year INTEGER,
  end_year INTEGER
)
RETURNS DECIMAL(5,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_population INTEGER;
  end_population INTEGER;
  growth_rate DECIMAL(5,2);
BEGIN
  -- Get start year population
  SELECT population_count INTO start_population
  FROM public.population_history
  WHERE year = start_year;
  
  -- Get end year population
  SELECT population_count INTO end_population
  FROM public.population_history
  WHERE year = end_year;
  
  -- Calculate growth rate
  IF start_population IS NOT NULL AND end_population IS NOT NULL AND start_population > 0 THEN
    growth_rate := ((end_population::DECIMAL - start_population::DECIMAL) / start_population::DECIMAL) * 100;
    RETURN ROUND(growth_rate, 2);
  ELSE
    RETURN NULL;
  END IF;
END;
$$;

-- Function to get current growth rate (last 2 years)
CREATE OR REPLACE FUNCTION public.get_current_population_growth_rate()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year INTEGER;
  previous_year INTEGER;
  current_population INTEGER;
  previous_population INTEGER;
  growth_rate DECIMAL(5,2);
  result JSONB;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);
  previous_year := current_year - 1;
  
  -- Get current year population
  SELECT population_count INTO current_population
  FROM public.population_history
  WHERE year = current_year;
  
  -- Get previous year population
  SELECT population_count INTO previous_population
  FROM public.population_history
  WHERE year = previous_year;
  
  -- Calculate growth rate
  IF current_population IS NOT NULL AND previous_population IS NOT NULL AND previous_population > 0 THEN
    growth_rate := ((current_population::DECIMAL - previous_population::DECIMAL) / previous_population::DECIMAL) * 100;
    
    result := jsonb_build_object(
      'growth_rate', ROUND(growth_rate, 2),
      'current_year', current_year,
      'previous_year', previous_year,
      'current_population', current_population,
      'previous_population', previous_population,
      'description', 'Taxa de crescimento populacional anual',
      'period', current_year::TEXT,
      'calculated_at', CURRENT_TIMESTAMP
    );
  ELSE
    result := jsonb_build_object(
      'growth_rate', NULL,
      'error', 'Dados insuficientes para cálculo',
      'current_year', current_year,
      'previous_year', previous_year
    );
  END IF;
  
  RETURN result;
END;
$$;

-- Function to update site settings with calculated growth rate
CREATE OR REPLACE FUNCTION public.update_growth_rate_from_population()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  growth_data JSONB;
  result JSONB;
BEGIN
  -- Get calculated growth rate
  growth_data := public.get_current_population_growth_rate();
  
  -- Update site settings if we have valid data
  IF (growth_data->>'growth_rate') IS NOT NULL THEN
    UPDATE public.site_settings 
    SET 
      growth_rate = (growth_data->>'growth_rate'),
      growth_description = (growth_data->>'description'),
      growth_period = (growth_data->>'period'),
      updated_at = CURRENT_TIMESTAMP
    WHERE id IS NOT NULL;
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Taxa de crescimento atualizada automaticamente',
      'growth_data', growth_data
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'message', 'Não foi possível calcular a taxa de crescimento',
      'growth_data', growth_data
    );
  END IF;
  
  RETURN result;
END;
$$; 