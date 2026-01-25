-- Add setor_id column to servicos table for better relationship with setores
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE SET NULL;

-- Create index for setor_id
CREATE INDEX IF NOT EXISTS idx_servicos_setor_id ON servicos(setor_id);

-- Update existing services to link with setores based on categoria
UPDATE servicos 
SET setor_id = (
  SELECT id 
  FROM setores_estrategicos 
  WHERE nome = servicos.categoria
)
WHERE setor_id IS NULL;

-- Add RLS policy for setor_id
CREATE POLICY "Users can view services by setor" ON servicos
  FOR SELECT USING (
    setor_id IN (
      SELECT id FROM setores_estrategicos WHERE ativo = true
    )
  );

-- Grant permissions
GRANT SELECT ON servicos TO anon;
GRANT ALL ON servicos TO authenticated; 