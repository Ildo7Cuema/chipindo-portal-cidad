-- Create departamentos table for municipal departments/directions
CREATE TABLE public.departamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  codigo TEXT UNIQUE,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active departamentos" 
ON public.departamentos 
FOR SELECT 
USING (ativo = true);

CREATE POLICY "Admins can manage departamentos" 
ON public.departamentos 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Add trigger for updated_at
CREATE TRIGGER update_departamentos_updated_at
BEFORE UPDATE ON public.departamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default departments
INSERT INTO public.departamentos (nome, descricao, codigo, ordem) VALUES
('Gabinete do Administrador', 'Gabinete do Administrador Municipal', 'GAB', 1),
('Secretaria Geral', 'Secretaria Geral da Administração', 'SEC', 2),
('Departamento Administrativo', 'Gestão administrativa e recursos humanos', 'ADM', 3),
('Departamento de Obras Públicas', 'Infraestruturas e obras públicas', 'OBR', 4),
('Departamento de Saúde', 'Serviços de saúde municipal', 'SAU', 5),
('Departamento de Educação', 'Educação e ensino municipal', 'EDU', 6),
('Departamento de Agricultura', 'Desenvolvimento agrícola e rural', 'AGR', 7),
('Departamento de Água e Saneamento', 'Abastecimento de água e saneamento', 'AGU', 8),
('Departamento de Segurança', 'Segurança e ordem pública', 'SEG', 9),
('Departamento de Finanças', 'Gestão financeira e orçamental', 'FIN', 10),
('Departamento de Cultura e Turismo', 'Cultura, desporto e turismo', 'CUL', 11),
('Departamento de Assuntos Sociais', 'Ação social e comunitária', 'SOC', 12);