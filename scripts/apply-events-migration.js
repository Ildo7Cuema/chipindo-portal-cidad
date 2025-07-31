import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  console.log('📝 Crie um arquivo .env com as seguintes variáveis:');
  console.log('   VITE_SUPABASE_URL=sua_url_do_supabase');
  console.log('   VITE_SUPABASE_ANON_KEY=sua_chave_anonima');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyEventsMigration() {
  console.log('🚀 Aplicando migração da tabela de eventos...\n');

  try {
    // Ler o arquivo de migração
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250725000011-create-events-table.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Arquivo de migração não encontrado:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📋 Executando migração da tabela events...');
    
    // Executar a migração
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Erro ao executar migração:', error.message);
      
      // Tentar executar partes da migração separadamente
      console.log('🔄 Tentando executar partes da migração separadamente...');
      
      // 1. Criar tabela
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            event_time TIME,
            location VARCHAR(255),
            organizer VARCHAR(255),
            contact VARCHAR(100),
            email VARCHAR(255),
            website VARCHAR(255),
            price VARCHAR(100) DEFAULT 'Gratuito',
            max_participants INTEGER DEFAULT 0,
            current_participants INTEGER DEFAULT 0,
            category VARCHAR(100) DEFAULT 'community',
            status VARCHAR(50) DEFAULT 'upcoming',
            featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (createError) {
        console.error('❌ Erro ao criar tabela:', createError.message);
      } else {
        console.log('✅ Tabela events criada com sucesso');
      }
      
      // 2. Inserir dados de exemplo
      const insertDataSQL = `
        INSERT INTO events (title, description, date, event_time, location, organizer, contact, email, category, status, featured) VALUES
        (
            'Festival Cultural de Chipindo',
            'Celebração da cultura local com música, dança e artesanato tradicional',
            '2025-08-15',
            '18:00:00',
            'Praça Central de Chipindo',
            'Câmara Municipal de Chipindo',
            '+244 123 456 789',
            'cultura@chipindo.gov.ao',
            'cultural',
            'upcoming',
            true
        ),
        (
            'Feira de Agricultura',
            'Exposição de produtos agrícolas locais e demonstrações de técnicas modernas',
            '2025-09-20',
            '09:00:00',
            'Mercado Municipal',
            'Direção de Agricultura',
            '+244 987 654 321',
            'agricultura@chipindo.gov.ao',
            'business',
            'upcoming',
            false
        ),
        (
            'Campeonato de Futebol Local',
            'Torneio de futebol entre equipas locais',
            '2025-07-30',
            '15:00:00',
            'Estádio Municipal',
            'Direção de Desporto',
            '+244 555 123 456',
            'desporto@chipindo.gov.ao',
            'sports',
            'upcoming',
            false
        ),
        (
            'Workshop de Empreendedorismo',
            'Formação sobre criação e gestão de pequenos negócios',
            '2025-08-10',
            '14:00:00',
            'Sala de Conferências',
            'Direção de Economia',
            '+244 777 888 999',
            'economia@chipindo.gov.ao',
            'educational',
            'upcoming',
            true
        ),
        (
            'Limpeza Comunitária',
            'Iniciativa de limpeza e preservação ambiental',
            '2025-07-25',
            '08:00:00',
            'Várias localizações',
            'Direção de Ambiente',
            '+244 111 222 333',
            'ambiente@chipindo.gov.ao',
            'community',
            'upcoming',
            false
        );
      `;
      
      const { error: insertError } = await supabase.rpc('exec_sql', { sql: insertDataSQL });
      
      if (insertError) {
        console.error('❌ Erro ao inserir dados:', insertError.message);
      } else {
        console.log('✅ Dados de exemplo inseridos com sucesso');
      }
      
    } else {
      console.log('✅ Migração executada com sucesso');
    }

    // Verificar se a tabela foi criada
    console.log('\n📋 Verificando tabela events...');
    const { data: eventsData, error: checkError } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('❌ Erro ao verificar tabela:', checkError.message);
    } else {
      console.log('✅ Tabela events verificada com sucesso');
      console.log(`   Registros encontrados: ${eventsData?.length || 0}`);
      
      if (eventsData && eventsData.length > 0) {
        console.log('   Exemplo de evento:');
        console.log(`   - Título: ${eventsData[0].title}`);
        console.log(`   - Data: ${eventsData[0].date}`);
        console.log(`   - Hora: ${eventsData[0].event_time}`);
        console.log(`   - Local: ${eventsData[0].location}`);
      }
    }

    // Testar funções RPC
    console.log('\n🧪 Testando funções RPC...');
    
    const rpcFunctions = [
      'get_events',
      'create_event',
      'update_event',
      'delete_event'
    ];

    for (const func of rpcFunctions) {
      try {
        const { error } = await supabase.rpc(func);
        if (error) {
          console.log(`⚠️  Função ${func}: ${error.message}`);
        } else {
          console.log(`✅ Função ${func}: Disponível`);
        }
      } catch (err) {
        console.log(`❌ Função ${func}: Não disponível`);
      }
    }

    console.log('\n✅ Migração da tabela de eventos concluída!');
    console.log('\n🎯 Próximos passos:');
    console.log('1. Acesse a área administrativa em /admin');
    console.log('2. Navegue até "Eventos" no menu lateral');
    console.log('3. Teste as funcionalidades de gestão de eventos');
    console.log('4. Verifique se os dados estão sendo exibidos corretamente');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
applyEventsMigration(); 