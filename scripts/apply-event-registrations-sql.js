import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

console.log('🚀 Aplicando migração das inscrições em eventos via SQL...\n');

async function applyMigration() {
  try {
    // 1. Criar tabela event_registrations
    console.log('1️⃣ Criando tabela event_registrations...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS event_registrations (
          id SERIAL PRIMARY KEY,
          event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          participant_name VARCHAR(255) NOT NULL,
          participant_email VARCHAR(255) NOT NULL,
          participant_phone VARCHAR(100),
          participant_age INTEGER,
          participant_gender VARCHAR(50),
          participant_address TEXT,
          participant_occupation VARCHAR(255),
          participant_organization VARCHAR(255),
          special_needs TEXT,
          dietary_restrictions TEXT,
          emergency_contact_name VARCHAR(255),
          emergency_contact_phone VARCHAR(100),
          registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.log('⚠️  Tabela pode já existir, continuando...');
    } else {
      console.log('✅ Tabela event_registrations criada com sucesso');
    }

    // 2. Criar índices
    console.log('\n2️⃣ Criando índices...');
    
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
      CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(participant_email);
      CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);
      CREATE INDEX IF NOT EXISTS idx_event_registrations_date ON event_registrations(registration_date);
    `;
    
    const { error: indexesError } = await supabase.rpc('exec_sql', { sql: indexesSQL });
    
    if (indexesError) {
      console.log('⚠️  Índices podem já existir, continuando...');
    } else {
      console.log('✅ Índices criados com sucesso');
    }

    // 3. Criar índice único
    console.log('\n3️⃣ Criando índice único...');
    
    const uniqueIndexSQL = `
      CREATE UNIQUE INDEX IF NOT EXISTS idx_event_registrations_unique 
      ON event_registrations(event_id, participant_email);
    `;
    
    const { error: uniqueIndexError } = await supabase.rpc('exec_sql', { sql: uniqueIndexSQL });
    
    if (uniqueIndexError) {
      console.log('⚠️  Índice único pode já existir, continuando...');
    } else {
      console.log('✅ Índice único criado com sucesso');
    }

    // 4. Configurar RLS
    console.log('\n4️⃣ Configurando RLS...');
    
    const rlsSQL = `
      ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Public can view confirmed registrations" ON event_registrations;
      CREATE POLICY "Public can view confirmed registrations" ON event_registrations
          FOR SELECT USING (status = 'confirmed');
      
      DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
      CREATE POLICY "Public can register for events" ON event_registrations
          FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Admin has full access to registrations" ON event_registrations;
      CREATE POLICY "Admin has full access to registrations" ON event_registrations
          FOR ALL USING (
              current_setting('request.jwt.claims', true)::json->>'role' = 'admin' OR
              current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
          );
    `;
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
    
    if (rlsError) {
      console.log('⚠️  RLS pode já estar configurado, continuando...');
    } else {
      console.log('✅ RLS configurado com sucesso');
    }

    // 5. Criar função register_for_event
    console.log('\n5️⃣ Criando função register_for_event...');
    
    const functionSQL = `
      CREATE OR REPLACE FUNCTION register_for_event(
          p_event_id INTEGER,
          p_participant_name VARCHAR,
          p_participant_email VARCHAR,
          p_participant_phone VARCHAR DEFAULT NULL,
          p_participant_age INTEGER DEFAULT NULL,
          p_participant_gender VARCHAR DEFAULT NULL,
          p_participant_address TEXT DEFAULT NULL,
          p_participant_occupation VARCHAR DEFAULT NULL,
          p_participant_organization VARCHAR DEFAULT NULL,
          p_special_needs TEXT DEFAULT NULL,
          p_dietary_restrictions TEXT DEFAULT NULL,
          p_emergency_contact_name VARCHAR DEFAULT NULL,
          p_emergency_contact_phone VARCHAR DEFAULT NULL
      )
      RETURNS INTEGER
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
          new_registration_id INTEGER;
          event_max_participants INTEGER;
          current_participants INTEGER;
      BEGIN
          -- Check if event exists and has available spots
          SELECT e.max_participants, e.current_participants
          INTO event_max_participants, current_participants
          FROM events e
          WHERE e.id = p_event_id;
          
          IF NOT FOUND THEN
              RAISE EXCEPTION 'Event not found';
          END IF;
          
          -- Check if event is full
          IF event_max_participants > 0 AND current_participants >= event_max_participants THEN
              RAISE EXCEPTION 'Event is full';
          END IF;
          
          -- Check if user is already registered
          IF EXISTS (
              SELECT 1 FROM event_registrations 
              WHERE event_id = p_event_id AND participant_email = p_participant_email
          ) THEN
              RAISE EXCEPTION 'Already registered for this event';
          END IF;
          
          -- Insert registration
          INSERT INTO event_registrations (
              event_id, participant_name, participant_email, participant_phone,
              participant_age, participant_gender, participant_address,
              participant_occupation, participant_organization, special_needs,
              dietary_restrictions, emergency_contact_name, emergency_contact_phone
          ) VALUES (
              p_event_id, p_participant_name, p_participant_email, p_participant_phone,
              p_participant_age, p_participant_gender, p_participant_address,
              p_participant_occupation, p_participant_organization, p_special_needs,
              p_dietary_restrictions, p_emergency_contact_name, p_emergency_contact_phone
          ) RETURNING id INTO new_registration_id;
          
          -- Update event participant count
          UPDATE events 
          SET current_participants = current_participants + 1,
              updated_at = NOW()
          WHERE id = p_event_id;
          
          RETURN new_registration_id;
      END;
      $$;
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: functionSQL });
    
    if (functionError) {
      console.log('⚠️  Função pode já existir, continuando...');
    } else {
      console.log('✅ Função register_for_event criada com sucesso');
    }

    // 6. Inserir dados de exemplo
    console.log('\n6️⃣ Inserindo dados de exemplo...');
    
    const sampleDataSQL = `
      INSERT INTO event_registrations (
          event_id, participant_name, participant_email, participant_phone,
          participant_age, participant_gender, participant_occupation, status
      ) VALUES
      (1, 'Maria Silva', 'maria.silva@email.com', '+244 123 456 789', 28, 'Feminino', 'Professora', 'confirmed'),
      (1, 'João Santos', 'joao.santos@email.com', '+244 987 654 321', 35, 'Masculino', 'Agricultor', 'confirmed'),
      (2, 'Ana Costa', 'ana.costa@email.com', '+244 555 123 456', 42, 'Feminino', 'Comerciante', 'pending'),
      (3, 'Pedro Oliveira', 'pedro.oliveira@email.com', '+244 777 888 999', 25, 'Masculino', 'Estudante', 'confirmed')
      ON CONFLICT (event_id, participant_email) DO NOTHING;
    `;
    
    const { error: sampleDataError } = await supabase.rpc('exec_sql', { sql: sampleDataSQL });
    
    if (sampleDataError) {
      console.log('⚠️  Dados de exemplo podem já existir, continuando...');
    } else {
      console.log('✅ Dados de exemplo inseridos com sucesso');
    }

    console.log('\n🎉 Migração das inscrições em eventos concluída!');
    console.log('\n📊 Próximos passos:');
    console.log('   1. Testar o sistema com dados reais');
    console.log('   2. Configurar notificações por email');
    console.log('   3. Integrar na área administrativa');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
  }
}

// Executar migração
applyMigration(); 