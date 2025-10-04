import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixEventRegistrationsRLS() {
  try {
    console.log('🔧 Corrigindo políticas RLS da tabela event_registrations...\n');

    // 1. Verificar se a tabela existe
    console.log('1️⃣ Verificando tabela event_registrations...');
    
    const { data: tableExists, error: tableError } = await supabase
      .from('event_registrations')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Tabela event_registrations não existe:', tableError.message);
      return;
    }

    console.log('✅ Tabela event_registrations existe');

    // 2. Testar inserção para confirmar erro RLS
    console.log('\n2️⃣ Testando inserção para confirmar erro RLS...');
    
    const testRegistration = {
      event_id: 16, // Festival Cultural de Chipindo
      participant_name: 'Teste RLS',
      participant_email: 'teste.rls@email.com',
      participant_phone: '+244 123 456 789',
      participant_age: 30,
      participant_gender: 'Masculino',
      participant_address: 'Rua de Teste',
      participant_occupation: 'Testador',
      participant_organization: 'Sistema de Teste',
      special_needs: 'Nenhuma',
      dietary_restrictions: 'Nenhuma',
      emergency_contact_name: 'Contacto Teste',
      emergency_contact_phone: '+244 987 654 321'
    };

    try {
      const { data: result, error: insertError } = await supabase
        .from('event_registrations')
        .insert([testRegistration])
        .select()
        .single();

      if (insertError) {
        if (insertError.message.includes('row-level security policy')) {
          console.log('✅ Erro RLS confirmado: políticas precisam ser corrigidas');
        } else {
          console.error('❌ Erro diferente:', insertError.message);
          return;
        }
      } else {
        console.log('✅ Inserção funcionou, RLS pode estar correto');
        return;
      }
    } catch (err) {
      console.error('❌ Erro inesperado:', err.message);
      return;
    }

    // 3. Fornecer correção das políticas RLS
    console.log('\n3️⃣ Fornecendo correção das políticas RLS...');
    
    console.log('💡 Execute este código SQL no Supabase SQL Editor para corrigir as políticas RLS:');
    console.log('\n' + '='.repeat(80));
    console.log(`
-- Corrigir políticas RLS para event_registrations
-- 1. Remover políticas existentes
DROP POLICY IF EXISTS "Public can view confirmed registrations" ON event_registrations;
DROP POLICY IF EXISTS "Public can register for events" ON event_registrations;
DROP POLICY IF EXISTS "Admin has full access to registrations" ON event_registrations;

-- 2. Criar nova política para inserção pública (qualquer pessoa pode se inscrever)
CREATE POLICY "Public can register for events" ON event_registrations
    FOR INSERT WITH CHECK (true);

-- 3. Criar política para visualização pública (apenas inscrições confirmadas)
CREATE POLICY "Public can view confirmed registrations" ON event_registrations
    FOR SELECT USING (status = 'confirmed');

-- 4. Criar política para administradores (acesso completo)
CREATE POLICY "Admin has full access to registrations" ON event_registrations
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('admin', 'content_manager')
        )
    );

-- 5. Verificar se RLS está habilitado
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- 6. Garantir permissões
GRANT SELECT, INSERT, UPDATE, DELETE ON event_registrations TO anon, authenticated;
GRANT USAGE ON SEQUENCE event_registrations_id_seq TO anon, authenticated;
    `);
    console.log('='.repeat(80));

    console.log('\n📝 **Explicação das políticas:**');
    console.log('   1. **INSERT**: Qualquer pessoa pode se inscrever (WITH CHECK (true))');
    console.log('   2. **SELECT**: Apenas inscrições confirmadas são visíveis publicamente');
    console.log('   3. **ALL**: Administradores têm acesso completo a todas as inscrições');

    console.log('\n🎯 **Após aplicar a correção:**');
    console.log('   1. O modal de inscrição funcionará corretamente');
    console.log('   2. As inscrições serão salvas no banco de dados');
    console.log('   3. Apenas administradores verão todas as inscrições');
    console.log('   4. O público só verá inscrições confirmadas');

    console.log('\n✅ **Para testar após aplicar a correção:**');
    console.log('   1. Execute o código SQL acima no Supabase');
    console.log('   2. Execute: node scripts/test-direct-registration.js');
    console.log('   3. Teste o modal de inscrição na página de eventos');

    // 4. Testar novamente após instruções
    console.log('\n4️⃣ Testando novamente após instruções...');
    console.log('💡 Execute o código SQL acima primeiro, depois execute este script novamente');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
fixEventRegistrationsRLS(); 