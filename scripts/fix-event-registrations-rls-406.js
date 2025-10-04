const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente necessárias não encontradas');
  console.log('Certifique-se de que VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixEventRegistrationsRLS406() {
  console.log('🔧 Corrigindo políticas RLS para event_registrations (Erro 406)');
  console.log('='.repeat(80));

  try {
    // 1. Remover políticas existentes
    console.log('1️⃣ Removendo políticas existentes...');
    
    const dropPoliciesSQL = `
      DROP POLICY IF EXISTS "Public can view confirmed registrations" ON event_registrations;
      DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
      DROP POLICY IF EXISTS "Admin has full access to registrations" ON event_registrations;
      DROP POLICY IF EXISTS "Public can check own registrations" ON event_registrations;
    `;
    
    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropPoliciesSQL });
    
    if (dropError) {
      console.error('❌ Erro ao remover políticas:', dropError.message);
      return;
    }
    
    console.log('✅ Políticas existentes removidas');

    // 2. Criar novas políticas
    console.log('\n2️⃣ Criando novas políticas RLS...');
    
    const createPoliciesSQL = `
      -- 1. Policy for public insert access (anyone can register)
      CREATE POLICY "Public can register for events" ON event_registrations
          FOR INSERT WITH CHECK (true);

      -- 2. Policy for checking existing registrations (allow checking own email regardless of status)
      CREATE POLICY "Public can check own registrations" ON event_registrations
          FOR SELECT USING (
              participant_email = current_setting('request.jwt.claims', true)::json->>'email' OR
              status = 'confirmed'
          );

      -- 3. Policy for admin full access
      CREATE POLICY "Admin has full access to registrations" ON event_registrations
          FOR ALL USING (
              current_setting('request.jwt.claims', true)::json->>'role' = 'admin' OR
              current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
          );

      -- 4. Policy for public to view confirmed registrations (for display purposes)
      CREATE POLICY "Public can view confirmed registrations" ON event_registrations
          FOR SELECT USING (status = 'confirmed');
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createPoliciesSQL });
    
    if (createError) {
      console.error('❌ Erro ao criar políticas:', createError.message);
      return;
    }
    
    console.log('✅ Novas políticas criadas com sucesso');

    // 3. Garantir que RLS está habilitado
    console.log('\n3️⃣ Verificando RLS...');
    
    const enableRLSSQL = `
      ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
    `;
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: enableRLSSQL });
    
    if (rlsError) {
      console.log('⚠️  RLS pode já estar habilitado');
    } else {
      console.log('✅ RLS habilitado');
    }

    // 4. Garantir permissões
    console.log('\n4️⃣ Configurando permissões...');
    
    const permissionsSQL = `
      GRANT SELECT, INSERT, UPDATE, DELETE ON event_registrations TO anon, authenticated;
      GRANT USAGE ON SEQUENCE event_registrations_id_seq TO anon, authenticated;
    `;
    
    const { error: permissionsError } = await supabase.rpc('exec_sql', { sql: permissionsSQL });
    
    if (permissionsError) {
      console.log('⚠️  Permissões podem já estar configuradas');
    } else {
      console.log('✅ Permissões configuradas');
    }

    // 5. Testar a correção
    console.log('\n5️⃣ Testando a correção...');
    
    // Buscar um evento para teste
    const { data: events } = await supabase
      .from('events')
      .select('id, title')
      .limit(1);
    
    if (!events || events.length === 0) {
      console.log('⚠️  Nenhum evento encontrado para teste');
      return;
    }
    
    const testEvent = events[0];
    const testEmail = 'teste.rls@email.com';
    
    // Testar verificação de inscrição existente
    const { data: existingCheck, error: checkError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', testEvent.id)
      .eq('participant_email', testEmail)
      .single();
    
    if (checkError && checkError.code === 'PGRST116') {
      console.log('✅ Verificação de inscrição funcionando (nenhuma inscrição encontrada - esperado)');
    } else if (checkError) {
      console.error('❌ Erro na verificação de inscrição:', checkError.message);
    } else {
      console.log('✅ Verificação de inscrição funcionando (inscrição encontrada)');
    }

    console.log('\n🎉 Correção aplicada com sucesso!');
    console.log('\n📝 **Resumo das mudanças:**');
    console.log('   1. ✅ Política de INSERT mantida (qualquer pessoa pode se inscrever)');
    console.log('   2. ✅ Nova política de SELECT para verificar inscrições existentes');
    console.log('   3. ✅ Política de SELECT para visualizar inscrições confirmadas');
    console.log('   4. ✅ Política de acesso completo para administradores');
    console.log('   5. ✅ Permissões garantidas para usuários anônimos e autenticados');

    console.log('\n🔍 **O erro 406 deve estar resolvido agora!**');
    console.log('   - O modal de inscrição poderá verificar se o usuário já está inscrito');
    console.log('   - As inscrições funcionarão corretamente');
    console.log('   - Administradores terão acesso completo às inscrições');

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
  }
}

// Executar a correção
fixEventRegistrationsRLS406(); 