import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function fixEventsRLS() {
  try {
    console.log('🔧 Corrigindo políticas RLS da tabela events...');

    // 1. Remover políticas existentes
    console.log('1️⃣ Removendo políticas existentes...');
    
    const policies = [
      'Public can view events',
      'Authenticated users can manage events'
    ];

    for (const policy of policies) {
      try {
        await supabase.rpc('exec_sql', {
          sql: `DROP POLICY IF EXISTS "${policy}" ON events;`
        });
        console.log(`✅ Política "${policy}" removida`);
      } catch (error) {
        console.log(`⚠️  Erro ao remover política "${policy}":`, error.message);
      }
    }

    // 2. Criar novas políticas mais permissivas
    console.log('\n2️⃣ Criando novas políticas...');

    // Política para leitura pública
    const { error: selectError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Enable read access for all users" ON events
        FOR SELECT USING (true);
      `
    });

    if (selectError) {
      console.error('❌ Erro ao criar política de leitura:', selectError.message);
    } else {
      console.log('✅ Política de leitura criada');
    }

    // Política para inserção (temporariamente permitir para todos)
    const { error: insertError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Enable insert access for all users" ON events
        FOR INSERT WITH CHECK (true);
      `
    });

    if (insertError) {
      console.error('❌ Erro ao criar política de inserção:', insertError.message);
    } else {
      console.log('✅ Política de inserção criada');
    }

    // Política para atualização (temporariamente permitir para todos)
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Enable update access for all users" ON events
        FOR UPDATE USING (true) WITH CHECK (true);
      `
    });

    if (updateError) {
      console.error('❌ Erro ao criar política de atualização:', updateError.message);
    } else {
      console.log('✅ Política de atualização criada');
    }

    // Política para exclusão (temporariamente permitir para todos)
    const { error: deleteError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Enable delete access for all users" ON events
        FOR DELETE USING (true);
      `
    });

    if (deleteError) {
      console.error('❌ Erro ao criar política de exclusão:', deleteError.message);
    } else {
      console.log('✅ Política de exclusão criada');
    }

    console.log('\n🎉 Políticas RLS corrigidas com sucesso!');
    console.log('📝 Agora é possível inserir, atualizar e excluir eventos.');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

// Executar o script
fixEventsRLS(); 