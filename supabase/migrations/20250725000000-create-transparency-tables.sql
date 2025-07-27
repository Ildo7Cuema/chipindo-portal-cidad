-- Create transparency_documents table
CREATE TABLE IF NOT EXISTS transparency_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('published', 'pending', 'archived')),
    file_size TEXT,
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    file_url TEXT,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budget_execution table
CREATE TABLE IF NOT EXISTS budget_execution (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year TEXT NOT NULL,
    category TEXT NOT NULL,
    total_budget DECIMAL(15,2) NOT NULL,
    executed_budget DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'on_track' CHECK (status IN ('on_track', 'over_budget', 'under_budget')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transparency_projects table
CREATE TABLE IF NOT EXISTS transparency_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(15,2) NOT NULL,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('active', 'completed', 'planned')),
    location TEXT NOT NULL,
    beneficiaries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transparency_documents_category ON transparency_documents(category);
CREATE INDEX IF NOT EXISTS idx_transparency_documents_status ON transparency_documents(status);
CREATE INDEX IF NOT EXISTS idx_transparency_documents_date ON transparency_documents(date);
CREATE INDEX IF NOT EXISTS idx_budget_execution_year ON budget_execution(year);
CREATE INDEX IF NOT EXISTS idx_budget_execution_category ON budget_execution(category);
CREATE INDEX IF NOT EXISTS idx_transparency_projects_status ON transparency_projects(status);
CREATE INDEX IF NOT EXISTS idx_transparency_projects_location ON transparency_projects(location);

-- Enable RLS (Row Level Security)
ALTER TABLE transparency_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE transparency_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for transparency_documents
CREATE POLICY "Public read access for published documents" ON transparency_documents
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admin full access to documents" ON transparency_documents
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for budget_execution
CREATE POLICY "Public read access for budget data" ON budget_execution
    FOR SELECT USING (true);

CREATE POLICY "Admin full access to budget data" ON budget_execution
    FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for transparency_projects
CREATE POLICY "Public read access for projects" ON transparency_projects
    FOR SELECT USING (true);

CREATE POLICY "Admin full access to projects" ON transparency_projects
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data for transparency_documents
INSERT INTO transparency_documents (title, category, date, status, file_size, downloads, views, description, tags) VALUES
('Relatório Anual 2023', 'relatorios', '2023-12-31', 'published', '2.5 MB', 45, 120, 'Relatório anual de atividades do município de Chipindo', ARRAY['relatório', 'anual', '2023']),
('Orçamento Municipal 2024', 'orcamento', '2024-01-15', 'published', '1.8 MB', 78, 234, 'Orçamento municipal para o ano de 2024', ARRAY['orçamento', '2024', 'municipal']),
('Contrato de Fornecimento de Água', 'contratos', '2024-02-01', 'published', '3.2 MB', 32, 89, 'Contrato para fornecimento de água potável', ARRAY['contrato', 'água', 'fornecimento']),
('Prestação de Contas 2023', 'prestacao-contas', '2024-01-30', 'published', '4.1 MB', 56, 167, 'Prestação de contas do exercício de 2023', ARRAY['prestação', 'contas', '2023']),
('Plano de Desenvolvimento 2024-2027', 'planos', '2024-01-10', 'published', '5.7 MB', 23, 78, 'Plano de desenvolvimento municipal 2024-2027', ARRAY['plano', 'desenvolvimento', '2024-2027']),
('Auditoria Externa 2023', 'auditorias', '2024-01-20', 'published', '2.8 MB', 34, 95, 'Relatório de auditoria externa 2023', ARRAY['auditoria', 'externa', '2023']);

-- Insert sample data for budget_execution
INSERT INTO budget_execution (year, category, total_budget, executed_budget, percentage, status) VALUES
('2024', 'Infraestrutura', 50000000.00, 35000000.00, 70.00, 'on_track'),
('2024', 'Educação', 30000000.00, 28000000.00, 93.33, 'over_budget'),
('2024', 'Saúde', 25000000.00, 18000000.00, 72.00, 'on_track'),
('2024', 'Agricultura', 15000000.00, 12000000.00, 80.00, 'on_track'),
('2024', 'Transportes', 20000000.00, 16000000.00, 80.00, 'on_track'),
('2023', 'Infraestrutura', 45000000.00, 42000000.00, 93.33, 'over_budget'),
('2023', 'Educação', 28000000.00, 27500000.00, 98.21, 'over_budget'),
('2023', 'Saúde', 22000000.00, 20000000.00, 90.91, 'on_track');

-- Insert sample data for transparency_projects
INSERT INTO transparency_projects (name, description, budget, progress, start_date, end_date, status, location, beneficiaries) VALUES
('Pavimentação da Rua Principal', 'Pavimentação da rua principal do centro da cidade de Chipindo', 25000000.00, 75.00, '2024-01-01', '2024-06-30', 'active', 'Centro da Cidade', 5000),
('Construção da Escola Primária', 'Construção de uma nova escola primária no bairro novo', 40000000.00, 100.00, '2023-03-01', '2024-02-28', 'completed', 'Bairro Novo', 300),
('Sistema de Abastecimento de Água', 'Instalação de sistema de abastecimento de água potável', 35000000.00, 45.00, '2024-02-01', '2024-12-31', 'active', 'Zona Rural', 8000),
('Centro de Saúde Municipal', 'Construção de centro de saúde com equipamentos modernos', 50000000.00, 0.00, '2024-07-01', '2025-06-30', 'planned', 'Centro da Cidade', 15000),
('Rede de Iluminação Pública', 'Instalação de rede de iluminação pública LED', 18000000.00, 100.00, '2023-09-01', '2024-01-31', 'completed', 'Toda a Cidade', 12000),
('Mercado Municipal', 'Construção de mercado municipal coberto', 30000000.00, 60.00, '2024-03-01', '2024-11-30', 'active', 'Centro Comercial', 3000); 