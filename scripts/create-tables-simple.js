import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Criando tabelas dos Setores Estratégicos...\n');

  const tables = [
    {
      name: 'setores_estrategicos',
      sql: `
        CREATE TABLE IF NOT EXISTS setores_estrategicos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome VARCHAR(100) NOT NULL,
          slug VARCHAR(50) UNIQUE NOT NULL,
          descricao TEXT,
          visao TEXT,
          missao TEXT,
          cor_primaria VARCHAR(7) DEFAULT '#3B82F6',
          cor_secundaria VARCHAR(7) DEFAULT '#1E40AF',
          icone VARCHAR(50),
          ordem INTEGER DEFAULT 0,
          ativo BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'setores_estatisticas',
      sql: `
        CREATE TABLE IF NOT EXISTS setores_estatisticas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
          nome VARCHAR(100) NOT NULL,
          valor VARCHAR(50) NOT NULL,
          icone VARCHAR(50),
          ordem INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'setores_programas',
      sql: `
        CREATE TABLE IF NOT EXISTS setores_programas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
          titulo VARCHAR(200) NOT NULL,
          descricao TEXT,
          beneficios JSONB DEFAULT '[]',
          requisitos JSONB DEFAULT '[]',
          contacto VARCHAR(200),
          ativo BOOLEAN DEFAULT true,
          ordem INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'setores_oportunidades',
      sql: `
        CREATE TABLE IF NOT EXISTS setores_oportunidades (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
          titulo VARCHAR(200) NOT NULL,
          descricao TEXT,
          requisitos JSONB DEFAULT '[]',
          beneficios JSONB DEFAULT '[]',
          prazo DATE,
          vagas INTEGER DEFAULT 1,
          ativo BOOLEAN DEFAULT true,
          ordem INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'setores_infraestruturas',
      sql: `
        CREATE TABLE IF NOT EXISTS setores_infraestruturas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
          nome VARCHAR(200) NOT NULL,
          localizacao VARCHAR(200),
          capacidade VARCHAR(100),
          estado VARCHAR(50) DEFAULT 'Operacional',
          equipamentos JSONB DEFAULT '[]',
          ativo BOOLEAN DEFAULT true,
          ordem INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'setores_contactos',
      sql: `
        CREATE TABLE IF NOT EXISTS setores_contactos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE CASCADE,
          endereco TEXT,
          telefone VARCHAR(50),
          email VARCHAR(200),
          horario VARCHAR(200),
          responsavel VARCHAR(200),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      console.log(`📋 Criando tabela: ${table.name}`);
      
      // Tentar criar a tabela usando SQL direto
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      
      if (error) {
        console.log(`   ⚠️  Erro ao criar ${table.name}: ${error.message}`);
        console.log(`   💡 Tentando método alternativo...`);
        
        // Método alternativo: tentar inserir um registro de teste
        if (table.name === 'setores_estrategicos') {
          const { error: testError } = await supabase
            .from('setores_estrategicos')
            .select('id')
            .limit(1);
          
          if (testError && testError.code === '42P01') {
            console.log(`   ❌ Tabela ${table.name} não existe e não pode ser criada via RPC`);
            console.log(`   📝 Por favor, crie a tabela manualmente no Supabase Dashboard`);
          } else {
            console.log(`   ✅ Tabela ${table.name} já existe`);
          }
        }
      } else {
        console.log(`   ✅ Tabela ${table.name} criada com sucesso`);
      }
    } catch (err) {
      console.log(`   ❌ Erro ao criar ${table.name}: ${err.message}`);
    }
  }

  console.log('\n📝 Instruções para criar as tabelas manualmente:');
  console.log('1. Acesse o Supabase Dashboard');
  console.log('2. Vá para SQL Editor');
  console.log('3. Execute o conteúdo do arquivo scripts/create-setores-tables.sql');
  console.log('4. Execute o conteúdo do arquivo scripts/seed-setores-data.sql');
  console.log('5. Ou execute: node scripts/insert-setores-data.js');
}

// Executar criação das tabelas
createTables(); 