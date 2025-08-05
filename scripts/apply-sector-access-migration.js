const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySectorAccessMigration() {
  console.log('🚀 Aplicando migração de acesso por setor...');

  try {
    // 1. Adicionar coluna setor_id à tabela profiles
    console.log('📝 Adicionando coluna setor_id à tabela profiles...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE SET NULL;
      `
    });

    if (alterError) {
      console.error('❌ Erro ao adicionar coluna setor_id:', alterError);
      return;
    }

    // 2. Atualizar constraint de role
    console.log('🔧 Atualizando constraint de role...');
    const { error: constraintError } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$ 
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.table_constraints 
                WHERE constraint_name = 'profile_role_check' 
                AND table_name = 'profiles'
            ) THEN
                ALTER TABLE profiles DROP CONSTRAINT profile_role_check;
            END IF;
        END $$;

        ALTER TABLE profiles ADD CONSTRAINT profile_role_check 
        CHECK (role IS NULL OR role IN ('user', 'editor', 'admin', 'educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua'));
      `
    });

    if (constraintError) {
      console.error('❌ Erro ao atualizar constraint:', constraintError);
      return;
    }

    // 3. Criar índice
    console.log('📊 Criando índice para setor_id...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_profiles_setor_id ON profiles(setor_id);
      `
    });

    if (indexError) {
      console.error('❌ Erro ao criar índice:', indexError);
      return;
    }

    // 4. Criar função para verificar acesso por setor
    console.log('🔐 Criando função de verificação de acesso...');
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION check_sector_access(user_role TEXT, requested_sector_id UUID)
        RETURNS BOOLEAN AS $$
        BEGIN
            -- Administradores têm acesso a tudo
            IF user_role = 'admin' THEN
                RETURN TRUE;
            END IF;
            
            -- Editores têm acesso a tudo
            IF user_role = 'editor' THEN
                RETURN TRUE;
            END IF;
            
            -- Utilizadores comuns não têm acesso administrativo
            IF user_role = 'user' THEN
                RETURN FALSE;
            END IF;
            
            -- Verificar se o role do utilizador corresponde ao setor solicitado
            IF user_role IN ('educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua') THEN
                -- Buscar o setor correspondente ao role
                DECLARE
                    sector_slug TEXT;
                    sector_id UUID;
                BEGIN
                    CASE user_role
                        WHEN 'educacao' THEN sector_slug := 'educacao';
                        WHEN 'saude' THEN sector_slug := 'saude';
                        WHEN 'agricultura' THEN sector_slug := 'agricultura';
                        WHEN 'sector-mineiro' THEN sector_slug := 'sector-mineiro';
                        WHEN 'desenvolvimento-economico' THEN sector_slug := 'desenvolvimento-economico';
                        WHEN 'cultura' THEN sector_slug := 'cultura';
                        WHEN 'tecnologia' THEN sector_slug := 'tecnologia';
                        WHEN 'energia-agua' THEN sector_slug := 'energia-agua';
                    END CASE;
                    
                    -- Buscar o ID do setor
                    SELECT id INTO sector_id FROM setores_estrategicos WHERE slug = sector_slug;
                    
                    -- Verificar se o setor solicitado corresponde ao setor do utilizador
                    RETURN sector_id = requested_sector_id;
                END;
            END IF;
            
            RETURN FALSE;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (functionError) {
      console.error('❌ Erro ao criar função de verificação:', functionError);
      return;
    }

    // 5. Criar função para obter setor do utilizador
    console.log('👤 Criando função para obter setor do utilizador...');
    const { error: getUserSectorError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION get_user_sector(user_role TEXT)
        RETURNS UUID AS $$
        DECLARE
            sector_id UUID;
        BEGIN
            IF user_role IN ('educacao', 'saude', 'agricultura', 'sector-mineiro', 'desenvolvimento-economico', 'cultura', 'tecnologia', 'energia-agua') THEN
                DECLARE
                    sector_slug TEXT;
                BEGIN
                    CASE user_role
                        WHEN 'educacao' THEN sector_slug := 'educacao';
                        WHEN 'saude' THEN sector_slug := 'saude';
                        WHEN 'agricultura' THEN sector_slug := 'agricultura';
                        WHEN 'sector-mineiro' THEN sector_slug := 'sector-mineiro';
                        WHEN 'desenvolvimento-economico' THEN sector_slug := 'desenvolvimento-economico';
                        WHEN 'cultura' THEN sector_slug := 'cultura';
                        WHEN 'tecnologia' THEN sector_slug := 'tecnologia';
                        WHEN 'energia-agua' THEN sector_slug := 'energia-agua';
                    END CASE;
                    
                    SELECT id INTO sector_id FROM setores_estrategicos WHERE slug = sector_slug;
                    RETURN sector_id;
                END;
            END IF;
            
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (getUserSectorError) {
      console.error('❌ Erro ao criar função get_user_sector:', getUserSectorError);
      return;
    }

    console.log('✅ Migração de acesso por setor aplicada com sucesso!');
    console.log('');
    console.log('📋 Resumo das alterações:');
    console.log('   • Adicionada coluna setor_id à tabela profiles');
    console.log('   • Atualizada constraint de role para incluir roles por setor');
    console.log('   • Criado índice para melhorar performance');
    console.log('   • Criadas funções de verificação de acesso');
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('   • Teste o sistema de gestão de utilizadores');
    console.log('   • Verifique o acesso por setor na área administrativa');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar a migração
applySectorAccessMigration(); 