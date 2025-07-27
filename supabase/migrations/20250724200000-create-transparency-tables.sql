-- Create transparency_documents table
CREATE TABLE public.transparency_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending', 'archived')),
  file_size TEXT NOT NULL,
  downloads INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget_execution table
CREATE TABLE public.budget_execution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  category TEXT NOT NULL,
  total_budget BIGINT NOT NULL,
  executed_budget BIGINT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'over_budget', 'under_budget')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transparency_projects table
CREATE TABLE public.transparency_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  budget BIGINT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('active', 'completed', 'planned')),
  location TEXT NOT NULL,
  beneficiaries INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transparency_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transparency_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for transparency_documents (public read, admin write)
CREATE POLICY "Public can view transparency documents" 
ON public.transparency_documents 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage transparency documents" 
ON public.transparency_documents 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create policies for budget_execution (public read, admin write)
CREATE POLICY "Public can view budget execution" 
ON public.budget_execution 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage budget execution" 
ON public.budget_execution 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create policies for transparency_projects (public read, admin write)
CREATE POLICY "Public can view transparency projects" 
ON public.transparency_projects 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage transparency projects" 
ON public.transparency_projects 
FOR ALL 
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

-- Create triggers to update timestamps
CREATE TRIGGER update_transparency_documents_updated_at
BEFORE UPDATE ON public.transparency_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_execution_updated_at
BEFORE UPDATE ON public.budget_execution
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transparency_projects_updated_at
BEFORE UPDATE ON public.transparency_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get transparency statistics
CREATE OR REPLACE FUNCTION public.get_transparency_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_documents', COALESCE((SELECT COUNT(*) FROM public.transparency_documents), 0),
    'total_downloads', COALESCE((SELECT SUM(downloads) FROM public.transparency_documents), 0),
    'total_views', COALESCE((SELECT SUM(views) FROM public.transparency_documents), 0),
    'total_budget', COALESCE((SELECT SUM(total_budget) FROM public.budget_execution), 0),
    'executed_budget', COALESCE((SELECT SUM(executed_budget) FROM public.budget_execution), 0),
    'active_projects', COALESCE((SELECT COUNT(*) FROM public.transparency_projects WHERE status = 'active'), 0),
    'completed_projects', COALESCE((SELECT COUNT(*) FROM public.transparency_projects WHERE status = 'completed'), 0),
    'beneficiaries', COALESCE((SELECT SUM(beneficiaries) FROM public.transparency_projects), 0)
  ) INTO stats;
  
  RETURN stats;
END;
$$;

-- Insert sample data for transparency_documents
INSERT INTO public.transparency_documents (
  title, category, date, status, file_size, downloads, views, description, tags
) VALUES
('Relatório Anual de Gestão 2023', 'relatorios', '2024-01-15', 'published', '2.5 MB', 156, 342, 'Relatório completo das atividades da Administração Municipal em 2023', ARRAY['gestão', 'anual', '2023']),
('Orçamento Municipal 2024', 'orcamento', '2024-01-10', 'published', '1.8 MB', 203, 456, 'Orçamento detalhado da Administração Municipal para 2024', ARRAY['orcamento', '2024', 'finanças']),
('Contratos Públicos - Q1 2024', 'contratos', '2024-03-20', 'published', '3.2 MB', 89, 234, 'Lista de contratos públicos celebrados no primeiro trimestre de 2024', ARRAY['contratos', 'públicos', 'Q1-2024']),
('Prestação de Contas - Dezembro 2023', 'prestacao-contas', '2024-01-05', 'published', '1.5 MB', 134, 298, 'Prestação de contas mensal de dezembro de 2023', ARRAY['prestação', 'contas', 'dezembro-2023']),
('Plano de Desenvolvimento Municipal 2024-2027', 'planos', '2024-02-15', 'published', '4.1 MB', 178, 412, 'Plano estratégico de desenvolvimento municipal para o período 2024-2027', ARRAY['plano', 'desenvolvimento', '2024-2027']),
('Auditoria Externa - 2023', 'auditorias', '2024-01-20', 'published', '2.8 MB', 95, 267, 'Relatório de auditoria externa realizada em 2023', ARRAY['auditoria', 'externa', '2023']);

-- Insert sample data for budget_execution
INSERT INTO public.budget_execution (
  year, category, total_budget, executed_budget, percentage, status
) VALUES
('2024', 'Infraestrutura', 250000000, 187500000, 75.00, 'on_track'),
('2024', 'Educação', 150000000, 120000000, 80.00, 'on_track'),
('2024', 'Saúde', 100000000, 95000000, 95.00, 'over_budget'),
('2024', 'Segurança', 80000000, 48000000, 60.00, 'under_budget'),
('2024', 'Cultura e Desporto', 120000000, 90000000, 75.00, 'on_track');

-- Insert sample data for transparency_projects
INSERT INTO public.transparency_projects (
  name, description, budget, progress, start_date, end_date, status, location, beneficiaries
) VALUES
('Reabilitação da Estrada Principal', 'Reabilitação completa da estrada principal de Chipindo', 45000000, 85, '2024-01-15', '2024-06-30', 'active', 'Centro da Cidade', 15000),
('Construção de Escola Primária', 'Nova escola primária com 6 salas de aula', 35000000, 100, '2023-08-01', '2024-02-28', 'completed', 'Bairro Novo', 300),
('Sistema de Abastecimento de Água', 'Melhoria do sistema de abastecimento de água potável', 28000000, 60, '2024-03-01', '2024-08-31', 'active', 'Zona Norte', 8000),
('Centro de Saúde Comunitário', 'Construção de centro de saúde com equipamentos modernos', 40000000, 0, '2024-09-01', '2025-03-31', 'planned', 'Bairro Central', 12000); 