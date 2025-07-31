-- Create municipality_characterization table
CREATE TABLE IF NOT EXISTS municipality_characterization (
  id SERIAL PRIMARY KEY,
  
  -- Geography data
  geography JSONB DEFAULT '{
    "area": "2.100 km²",
    "altitude": "1.200 - 1.800 metros",
    "climate": "Tropical de altitude",
    "rainfall": "800 - 1.200 mm/ano",
    "temperature": "15°C - 25°C",
    "boundaries": {
      "north": "Município de Caconda",
      "south": "Município de Caluquembe",
      "east": "Município de Quipungo",
      "west": "Município de Cacula"
    },
    "coordinates": {
      "latitude": "13.8333° S",
      "longitude": "14.1667° E"
    }
  }',
  
  -- Demography data
  demography JSONB DEFAULT '{
    "population": "150.000+ habitantes",
    "density": "71 hab/km²",
    "growth": "2.5% ao ano",
    "households": "25.000 famílias",
    "urbanRate": "35%"
  }',
  
  -- Infrastructure data
  infrastructure JSONB DEFAULT '{
    "roads": "500 km de estradas",
    "schools": "45 escolas",
    "healthCenters": "8 centros de saúde",
    "markets": "12 mercados",
    "waterSupply": "60% da população"
  }',
  
  -- Economy data
  economy JSONB DEFAULT '{
    "mainSectors": ["Agricultura", "Pecuária", "Comércio", "Serviços"],
    "gdp": "Crescimento de 4.2%",
    "employment": "85% da população ativa",
    "mainProducts": ["Milho", "Feijão", "Café", "Gado bovino"]
  }',
  
  -- Natural resources data
  natural_resources JSONB DEFAULT '{
    "rivers": ["Rio Cunene", "Rio Caculuvar", "Rio Caculovar"],
    "forests": "Floresta de miombo",
    "minerals": ["Granito", "Mármore", "Areia"],
    "wildlife": "Diversidade de fauna e flora"
  }',
  
  -- Culture data
  culture JSONB DEFAULT '{
    "ethnicGroups": ["Ovimbundu", "Nyaneka", "Herero"],
    "languages": ["Umbundu", "Português"],
    "traditions": "Festivais tradicionais",
    "crafts": "Artesanato local"
  }',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_municipality_characterization_id ON municipality_characterization(id);

-- Insert default characterization data
INSERT INTO municipality_characterization (
  geography,
  demography,
  infrastructure,
  economy,
  natural_resources,
  culture
) VALUES (
  '{
    "area": "2.100 km²",
    "altitude": "1.200 - 1.800 metros",
    "climate": "Tropical de altitude",
    "rainfall": "800 - 1.200 mm/ano",
    "temperature": "15°C - 25°C",
    "boundaries": {
      "north": "Município de Caconda",
      "south": "Município de Caluquembe",
      "east": "Município de Quipungo",
      "west": "Município de Cacula"
    },
    "coordinates": {
      "latitude": "13.8333° S",
      "longitude": "14.1667° E"
    }
  }',
  '{
    "population": "150.000+ habitantes",
    "density": "71 hab/km²",
    "growth": "2.5% ao ano",
    "households": "25.000 famílias",
    "urbanRate": "35%"
  }',
  '{
    "roads": "500 km de estradas",
    "schools": "45 escolas",
    "healthCenters": "8 centros de saúde",
    "markets": "12 mercados",
    "waterSupply": "60% da população"
  }',
  '{
    "mainSectors": ["Agricultura", "Pecuária", "Comércio", "Serviços"],
    "gdp": "Crescimento de 4.2%",
    "employment": "85% da população ativa",
    "mainProducts": ["Milho", "Feijão", "Café", "Gado bovino"]
  }',
  '{
    "rivers": ["Rio Cunene", "Rio Caculuvar", "Rio Caculovar"],
    "forests": "Floresta de miombo",
    "minerals": ["Granito", "Mármore", "Areia"],
    "wildlife": "Diversidade de fauna e flora"
  }',
  '{
    "ethnicGroups": ["Ovimbundu", "Nyaneka", "Herero"],
    "languages": ["Umbundu", "Português"],
    "traditions": "Festivais tradicionais",
    "crafts": "Artesanato local"
  }'
) ON CONFLICT (id) DO NOTHING;

-- Function to get municipality characterization
CREATE OR REPLACE FUNCTION get_municipality_characterization()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT to_jsonb(municipality_characterization.*)
  INTO result
  FROM municipality_characterization
  LIMIT 1;
  
  RETURN result;
END;
$$;

-- Function to update municipality characterization
CREATE OR REPLACE FUNCTION update_municipality_characterization(
  p_geography JSONB DEFAULT NULL,
  p_demography JSONB DEFAULT NULL,
  p_infrastructure JSONB DEFAULT NULL,
  p_economy JSONB DEFAULT NULL,
  p_natural_resources JSONB DEFAULT NULL,
  p_culture JSONB DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE municipality_characterization
  SET 
    geography = COALESCE(p_geography, geography),
    demography = COALESCE(p_demography, demography),
    infrastructure = COALESCE(p_infrastructure, infrastructure),
    economy = COALESCE(p_economy, economy),
    natural_resources = COALESCE(p_natural_resources, natural_resources),
    culture = COALESCE(p_culture, culture),
    updated_at = NOW()
  WHERE id = 1;
  
  RETURN FOUND;
END;
$$;

-- Enable RLS
ALTER TABLE municipality_characterization ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to municipality characterization" ON municipality_characterization
  FOR SELECT USING (true);

CREATE POLICY "Allow admin to update municipality characterization" ON municipality_characterization
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to insert municipality characterization" ON municipality_characterization
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_municipality_characterization_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_municipality_characterization_updated_at
  BEFORE UPDATE ON municipality_characterization
  FOR EACH ROW
  EXECUTE FUNCTION update_municipality_characterization_updated_at(); 