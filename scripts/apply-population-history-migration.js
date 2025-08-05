const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurado' : '❌ Não configurado');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Configurado' : '❌ Não configurado');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyPopulationHistoryMigration() {
  console.log('🚀 Aplicando migração de Population History...');

  try {
    // 1. Criar tabela population_history
    console.log('📋 Criando tabela population_history...');
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (createTableError) {
      console.error('❌ Erro ao criar tabela:', createTableError);
      return;
    }
    console.log('✅ Tabela population_history criada com sucesso');

    // 2. Habilitar RLS
    console.log('🔒 Habilitando Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.population_history ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError) {
      console.error('❌ Erro ao habilitar RLS:', rlsError);
      return;
    }
    console.log('✅ RLS habilitado com sucesso');

    // 3. Criar políticas
    console.log('📜 Criando políticas de segurança...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Anyone can view population history"
        ON public.population_history
        FOR SELECT
        USING (true);

        CREATE POLICY IF NOT EXISTS "Admins can manage population history"
        ON public.population_history
        FOR ALL
        USING (true)
        WITH CHECK (true);
      `
    });

    if (policiesError) {
      console.error('❌ Erro ao criar políticas:', policiesError);
      return;
    }
    console.log('✅ Políticas criadas com sucesso');

    // 4. Criar trigger para updated_at
    console.log('⚡ Criando trigger para updated_at...');
    const { error: triggerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER IF NOT EXISTS update_population_history_updated_at
        BEFORE UPDATE ON public.population_history
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
      `
    });

    if (triggerError) {
      console.error('❌ Erro ao criar trigger:', triggerError);
      return;
    }
    console.log('✅ Trigger criado com sucesso');

    // 5. Inserir dados de exemplo
    console.log('📊 Inserindo dados de exemplo...');
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: `
        INSERT INTO public.population_history (year, population_count, source, notes) VALUES
          (2020, 145000, 'official', 'Censo oficial 2020'),
          (2021, 148500, 'estimate', 'Estimativa baseada em crescimento natural'),
          (2022, 152000, 'estimate', 'Estimativa baseada em crescimento natural'),
          (2023, 155500, 'estimate', 'Estimativa baseada em crescimento natural'),
          (2024, 159000, 'estimate', 'Estimativa atual')
        ON CONFLICT (year) DO NOTHING;
      `
    });

    if (insertError) {
      console.error('❌ Erro ao inserir dados:', insertError);
      return;
    }
    console.log('✅ Dados de exemplo inseridos com sucesso');

    // 6. Criar funções para cálculos
    console.log('🧮 Criando funções de cálculo...');
    const { error: functionsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (functionsError) {
      console.error('❌ Erro ao criar funções:', functionsError);
      return;
    }
    console.log('✅ Funções de cálculo criadas com sucesso');

    console.log('🎉 Migração de Population History aplicada com sucesso!');
    console.log('📊 Tabela population_history criada e populada');
    console.log('🔒 Políticas de segurança configuradas');
    console.log('⚡ Triggers e funções criados');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração
applyPopulationHistoryMigration(); 