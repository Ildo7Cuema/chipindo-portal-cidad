import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixEventRegistrationsSimple() {
  console.log('🔧 Correção simples para erro 406 em event_registrations');
  console.log('='.repeat(60));

  try {
    // Remover política restritiva e criar uma mais permissiva
    const fixSQL = `
      -- Remover política restritiva
      DROP POLICY IF EXISTS "Public can view confirmed registrations" ON event_registrations;
      
      -- Criar política mais permissiva que permite verificar inscrições existentes
      CREATE POLICY "Public can check registrations" ON event_registrations
          FOR SELECT USING (true);
      
      -- Garantir que outras políticas existem
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

    const { error } = await supabase.rpc('exec_sql', { sql: fixSQL });
    
    if (error) {
      console.error('❌ Erro ao aplicar correção:', error.message);
      return;
    }

    console.log('✅ Correção aplicada com sucesso!');
    console.log('📝 A política SELECT agora permite verificar inscrições existentes');
    console.log('🔍 O erro 406 deve estar resolvido');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

fixEventRegistrationsSimple(); 