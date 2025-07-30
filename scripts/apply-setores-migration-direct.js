import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Supabase
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('📋 Criando tabelas...');
  
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
      console.log(`   Criando tabela: ${table.name}`);
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql });
      if (error) {
        console.log(`   ⚠️  Tabela ${table.name} pode já existir ou erro: ${error.message}`);
      } else {
        console.log(`   ✅ Tabela ${table.name} criada`);
      }
    } catch (err) {
      console.log(`   ⚠️  Erro ao criar ${table.name}: ${err.message}`);
    }
  }
}

async function insertInitialData() {
  console.log('\n📊 Inserindo dados iniciais...');
  
  // Dados dos setores estratégicos
  const setoresData = [
    {
      nome: 'Educação',
      slug: 'educacao',
      descricao: 'O setor de educação de Chipindo está comprometido em proporcionar uma educação inclusiva, de qualidade e acessível a todos os cidadãos, desde a primeira infância até a formação superior.',
      visao: 'Ser referência em educação municipal, formando cidadãos competentes e preparados para os desafios do futuro.',
      missao: 'Proporcionar educação de qualidade, inclusiva e inovadora, promovendo o desenvolvimento integral dos estudantes e contribuindo para o progresso da comunidade.',
      cor_primaria: '#3B82F6',
      cor_secundaria: '#1E40AF',
      icone: 'GraduationCap',
      ordem: 1,
      ativo: true
    },
    {
      nome: 'Saúde',
      slug: 'saude',
      descricao: 'O setor da saúde de Chipindo está dedicado a proporcionar cuidados de saúde de qualidade, acessíveis e equitativos para todos os cidadãos, promovendo o bem-estar e a qualidade de vida da população.',
      visao: 'Ser referência em saúde municipal, garantindo acesso universal a serviços de qualidade e promovendo uma comunidade saudável e resiliente.',
      missao: 'Proporcionar cuidados de saúde integrais, preventivos e curativos, promovendo a saúde pública e o bem-estar da população de Chipindo.',
      cor_primaria: '#EF4444',
      cor_secundaria: '#DC2626',
      icone: 'Heart',
      ordem: 2,
      ativo: true
    },
    {
      nome: 'Agricultura',
      slug: 'agricultura',
      descricao: 'O setor agrícola de Chipindo está focado em promover o desenvolvimento rural sustentável, modernizar as práticas agrícolas e garantir a segurança alimentar da população.',
      visao: 'Ser referência em agricultura sustentável e moderna, promovendo o desenvolvimento rural e garantindo a segurança alimentar do município.',
      missao: 'Promover o desenvolvimento agrícola sustentável, modernizar as práticas rurais e apoiar os agricultores locais para aumentar a produção e qualidade.',
      cor_primaria: '#22C55E',
      cor_secundaria: '#16A34A',
      icone: 'Sprout',
      ordem: 3,
      ativo: true
    },
    {
      nome: 'Setor Mineiro',
      slug: 'sector-mineiro',
      descricao: 'O setor mineiro de Chipindo está comprometido com a exploração sustentável dos recursos minerais, promovendo o desenvolvimento económico e a proteção ambiental.',
      visao: 'Ser referência em mineração sustentável e responsável, contribuindo para o desenvolvimento económico e social do município.',
      missao: 'Explorar os recursos minerais de forma sustentável e responsável, promovendo o desenvolvimento económico e a proteção ambiental.',
      cor_primaria: '#EAB308',
      cor_secundaria: '#CA8A04',
      icone: 'Pickaxe',
      ordem: 4,
      ativo: true
    },
    {
      nome: 'Desenvolvimento Económico',
      slug: 'desenvolvimento-economico',
      descricao: 'O setor de desenvolvimento económico de Chipindo está focado em promover o crescimento económico sustentável, atrair investimentos e criar oportunidades de emprego.',
      visao: 'Ser referência em desenvolvimento económico municipal, promovendo o crescimento sustentável e a criação de oportunidades para todos os cidadãos.',
      missao: 'Promover o desenvolvimento económico sustentável, atrair investimentos e criar oportunidades de emprego e negócio para a população.',
      cor_primaria: '#10B981',
      cor_secundaria: '#059669',
      icone: 'TrendingUp',
      ordem: 5,
      ativo: true
    },
    {
      nome: 'Cultura',
      slug: 'cultura',
      descricao: 'O setor cultural de Chipindo está dedicado a preservar, promover e desenvolver a rica herança cultural local, fomentando a criatividade e a expressão artística.',
      visao: 'Ser referência em promoção cultural municipal, preservando a herança local e fomentando a criatividade e expressão artística.',
      missao: 'Preservar e promover a herança cultural local, fomentar a criatividade e proporcionar oportunidades de expressão artística para todos.',
      cor_primaria: '#A855F7',
      cor_secundaria: '#9333EA',
      icone: 'Palette',
      ordem: 6,
      ativo: true
    },
    {
      nome: 'Tecnologia',
      slug: 'tecnologia',
      descricao: 'O setor tecnológico de Chipindo está comprometido em promover a inovação digital, modernizar os serviços públicos e fomentar o desenvolvimento de competências tecnológicas.',
      visao: 'Ser referência em inovação tecnológica municipal, promovendo a transformação digital e o desenvolvimento de competências tecnológicas.',
      missao: 'Promover a inovação tecnológica, modernizar os serviços públicos e fomentar o desenvolvimento de competências digitais na população.',
      cor_primaria: '#6366F1',
      cor_secundaria: '#4F46E5',
      icone: 'Cpu',
      ordem: 7,
      ativo: true
    },
    {
      nome: 'Energia e Água',
      slug: 'energia-agua',
      descricao: 'O setor de energia e água de Chipindo está comprometido em fornecer serviços de qualidade, promover a eficiência energética e garantir o acesso universal a estes recursos essenciais.',
      visao: 'Ser referência em fornecimento sustentável de energia e água, garantindo qualidade e acessibilidade.',
      missao: 'Proporcionar serviços de energia e água de qualidade, promovendo a sustentabilidade e eficiência.',
      cor_primaria: '#06B6D4',
      cor_secundaria: '#0891B2',
      icone: 'Zap',
      ordem: 8,
      ativo: true
    }
  ];

  // Inserir setores
  for (const setor of setoresData) {
    try {
      const { data, error } = await supabase
        .from('setores_estrategicos')
        .upsert(setor, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.log(`   ⚠️  Erro ao inserir ${setor.nome}: ${error.message}`);
      } else {
        console.log(`   ✅ Setor ${setor.nome} inserido/atualizado`);
        
        // Inserir estatísticas para este setor
        await insertEstatisticas(data.id, setor.slug);
      }
    } catch (err) {
      console.log(`   ⚠️  Erro ao inserir ${setor.nome}: ${err.message}`);
    }
  }
}

async function insertEstatisticas(setorId, slug) {
  const estatisticas = {
    'educacao': [
      { nome: 'Escolas Primárias', valor: '12', icone: 'Building', ordem: 1 },
      { nome: 'Escolas Secundárias', valor: '3', icone: 'GraduationCap', ordem: 2 },
      { nome: 'Professores', valor: '156', icone: 'Users', ordem: 3 },
      { nome: 'Estudantes', valor: '2.847', icone: 'BookOpen', ordem: 4 },
      { nome: 'Taxa de Alfabetização', valor: '78%', icone: 'TrendingUp', ordem: 5 },
      { nome: 'Programas de Bolsas', valor: '45', icone: 'HeartHandshake', ordem: 6 }
    ],
    'saude': [
      { nome: 'Unidades de Saúde', valor: '8', icone: 'Building', ordem: 1 },
      { nome: 'Profissionais', valor: '89', icone: 'Users', ordem: 2 },
      { nome: 'Consultas Mensais', valor: '3.245', icone: 'Activity', ordem: 3 },
      { nome: 'Cobertura Vacinal', valor: '92%', icone: 'Shield', ordem: 4 },
      { nome: 'Programas Ativos', valor: '12', icone: 'HeartHandshake', ordem: 5 },
      { nome: 'Emergências Atendidas', valor: '156/mês', icone: 'AlertTriangle', ordem: 6 }
    ],
    'agricultura': [
      { nome: 'Agricultores', valor: '1.245', icone: 'Users', ordem: 1 },
      { nome: 'Hectares Cultivados', valor: '8.750', icone: 'Map', ordem: 2 },
      { nome: 'Produção Anual', valor: '12.500 ton', icone: 'TrendingUp', ordem: 3 },
      { nome: 'Programas Ativos', valor: '8', icone: 'HeartHandshake', ordem: 4 },
      { nome: 'Cooperativas', valor: '15', icone: 'Building', ordem: 5 },
      { nome: 'Técnicos Agrícolas', valor: '23', icone: 'UserCheck', ordem: 6 }
    ],
    'sector-mineiro': [
      { nome: 'Minas Ativas', valor: '8', icone: 'Building', ordem: 1 },
      { nome: 'Empregos Diretos', valor: '450', icone: 'Users', ordem: 2 },
      { nome: 'Produção Anual', valor: '25.000 ton', icone: 'TrendingUp', ordem: 3 },
      { nome: 'Recursos Minerais', valor: '4', icone: 'Gem', ordem: 4 },
      { nome: 'Programas de Segurança', valor: '6', icone: 'Shield', ordem: 5 },
      { nome: 'Investimento Anual', valor: '5.2M USD', icone: 'DollarSign', ordem: 6 }
    ],
    'desenvolvimento-economico': [
      { nome: 'Empresas Registadas', valor: '245', icone: 'Building', ordem: 1 },
      { nome: 'Empregos Criados', valor: '1.850', icone: 'Users', ordem: 2 },
      { nome: 'Investimento Total', valor: '25M USD', icone: 'DollarSign', ordem: 3 },
      { nome: 'Programas Ativos', valor: '12', icone: 'HeartHandshake', ordem: 4 },
      { nome: 'Startups Apoiadas', valor: '18', icone: 'Zap', ordem: 5 },
      { nome: 'Crescimento PIB', valor: '4.2%', icone: 'TrendingUp', ordem: 6 }
    ],
    'cultura': [
      { nome: 'Grupos Culturais', valor: '25', icone: 'Users', ordem: 1 },
      { nome: 'Eventos Anuais', valor: '48', icone: 'Calendar', ordem: 2 },
      { nome: 'Artistas Registados', valor: '156', icone: 'UserCheck', ordem: 3 },
      { nome: 'Programas Culturais', valor: '8', icone: 'HeartHandshake', ordem: 4 },
      { nome: 'Espaços Culturais', valor: '6', icone: 'Building', ordem: 5 },
      { nome: 'Participantes/Ano', valor: '12.450', icone: 'Users', ordem: 6 }
    ],
    'tecnologia': [
      { nome: 'Startups Tech', valor: '15', icone: 'Zap', ordem: 1 },
      { nome: 'Profissionais IT', valor: '89', icone: 'Users', ordem: 2 },
      { nome: 'Projetos Digitais', valor: '32', icone: 'Code', ordem: 3 },
      { nome: 'Programas de Formação', valor: '8', icone: 'GraduationCap', ordem: 4 },
      { nome: 'Cobertura Internet', valor: '65%', icone: 'Wifi', ordem: 5 },
      { nome: 'Serviços Digitais', valor: '12', icone: 'Smartphone', ordem: 6 }
    ],
    'energia-agua': [
      { nome: 'Cobertura Elétrica', valor: '78%', icone: 'Zap', ordem: 1 },
      { nome: 'Cobertura de Água', valor: '65%', icone: 'Droplets', ordem: 2 },
      { nome: 'Consumidores', valor: '12.450', icone: 'Users', ordem: 3 },
      { nome: 'Centrais Elétricas', valor: '3', icone: 'Building', ordem: 4 },
      { nome: 'Estações de Água', valor: '5', icone: 'Gauge', ordem: 5 },
      { nome: 'Projetos Ativos', valor: '15', icone: 'HeartHandshake', ordem: 6 }
    ]
  };

  const stats = estatisticas[slug];
  if (stats) {
    for (const stat of stats) {
      try {
        const { error } = await supabase
          .from('setores_estatisticas')
          .upsert({ ...stat, setor_id: setorId }, { onConflict: 'setor_id,nome' });

        if (error) {
          console.log(`      ⚠️  Erro ao inserir estatística ${stat.nome}: ${error.message}`);
        }
      } catch (err) {
        console.log(`      ⚠️  Erro ao inserir estatística ${stat.nome}: ${err.message}`);
      }
    }
    console.log(`      ✅ Estatísticas inseridas para ${slug}`);
  }
}

async function verifyData() {
  console.log('\n🔍 Verificando dados inseridos...');
  
  try {
    const { data: setores, error } = await supabase
      .from('setores_estrategicos')
      .select('*')
      .order('ordem');

    if (error) {
      console.error('❌ Erro ao verificar dados:', error);
      return;
    }

    console.log(`✅ ${setores.length} setores estratégicos encontrados:`);
    setores.forEach(setor => {
      console.log(`   - ${setor.nome} (${setor.slug})`);
    });

    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Acesse a área administrativa');
    console.log('   2. Vá para "Setores Estratégicos"');
    console.log('   3. Gerencie os dados dos setores');
    console.log('   4. Acesse as páginas públicas para ver os resultados');

  } catch (error) {
    console.error('❌ Erro durante a verificação:', error);
  }
}

async function applyMigrations() {
  try {
    console.log('🚀 Iniciando migração dos Setores Estratégicos...\n');

    await createTables();
    await insertInitialData();
    await verifyData();

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

// Executar migração
applyMigrations(); 