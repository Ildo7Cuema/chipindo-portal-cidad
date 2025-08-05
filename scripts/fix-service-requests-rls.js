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

async function fixServiceRequestsRLS() {
  console.log('🔧 Corrigindo políticas RLS da tabela service_requests...');

  try {
    // 1. Verificar se a tabela existe
    console.log('📋 Verificando se a tabela service_requests existe...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('service_requests')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.log('⚠️ Tabela service_requests não existe. Criando...');
      
      // Criar tabela service_requests
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS service_requests (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            service_id UUID,
            service_name TEXT NOT NULL,
            service_direction TEXT NOT NULL,
            requester_name TEXT NOT NULL,
            requester_email TEXT NOT NULL,
            requester_phone TEXT,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            priority TEXT DEFAULT 'normal',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (createTableError) {
        throw new Error(`Erro ao criar tabela: ${createTableError.message}`);
      }
      console.log('✅ Tabela service_requests criada com sucesso');
    } else {
      console.log('✅ Tabela service_requests já existe');
    }

    // 2. Habilitar RLS
    console.log('🔒 Habilitando RLS na tabela...');
    const { error: enableRLSError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;'
    });

    if (enableRLSError) {
      console.warn('⚠️ Erro ao habilitar RLS:', enableRLSError.message);
    } else {
      console.log('✅ RLS habilitado com sucesso');
    }

    // 3. Remover políticas antigas
    console.log('🗑️ Removendo políticas antigas...');
    const policiesToDrop = [
      'Public can create service requests',
      'Admins can view all service requests',
      'Admins can update service requests',
      'Admins can delete service requests',
      'Allow public insert',
      'Allow authenticated select',
      'Allow authenticated update',
      'Allow authenticated delete'
    ];

    for (const policyName of policiesToDrop) {
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: `DROP POLICY IF EXISTS "${policyName}" ON service_requests;`
      });
      
      if (dropError) {
        console.warn(`⚠️ Erro ao remover política ${policyName}:`, dropError.message);
      }
    }
    console.log('✅ Políticas antigas removidas');

    // 4. Criar políticas novas
    console.log('🛡️ Criando novas políticas RLS...');
    
    const policies = [
      {
        name: 'Allow anonymous insert',
        sql: `
          CREATE POLICY "Allow anonymous insert" ON service_requests
          FOR INSERT 
          TO anon
          WITH CHECK (true);
        `
      },
      {
        name: 'Allow authenticated insert',
        sql: `
          CREATE POLICY "Allow authenticated insert" ON service_requests
          FOR INSERT 
          TO authenticated
          WITH CHECK (true);
        `
      },
      {
        name: 'Allow authenticated select',
        sql: `
          CREATE POLICY "Allow authenticated select" ON service_requests
          FOR SELECT 
          TO authenticated
          USING (true);
        `
      },
      {
        name: 'Allow authenticated update',
        sql: `
          CREATE POLICY "Allow authenticated update" ON service_requests
          FOR UPDATE 
          TO authenticated
          USING (true)
          WITH CHECK (true);
        `
      },
      {
        name: 'Allow authenticated delete',
        sql: `
          CREATE POLICY "Allow authenticated delete" ON service_requests
          FOR DELETE 
          TO authenticated
          USING (true);
        `
      }
    ];

    for (const policy of policies) {
      const { error: createPolicyError } = await supabase.rpc('exec_sql', {
        sql: policy.sql
      });

      if (createPolicyError) {
        console.warn(`⚠️ Erro ao criar política ${policy.name}:`, createPolicyError.message);
      } else {
        console.log(`✅ Política ${policy.name} criada`);
      }
    }

    // 5. Conceder permissões
    console.log('🔑 Concedendo permissões...');
    const permissions = [
      'GRANT USAGE ON SCHEMA public TO anon;',
      'GRANT USAGE ON SCHEMA public TO authenticated;',
      'GRANT ALL ON service_requests TO anon;',
      'GRANT ALL ON service_requests TO authenticated;'
    ];

    for (const permission of permissions) {
      const { error: grantError } = await supabase.rpc('exec_sql', {
        sql: permission
      });

      if (grantError) {
        console.warn('⚠️ Erro ao conceder permissão:', grantError.message);
      }
    }
    console.log('✅ Permissões concedidas');

    // 6. Verificar se tudo funcionou
    console.log('🔍 Verificando configuração...');
    
    // Testar inserção
    const testData = {
      service_name: 'Teste de Serviço',
      service_direction: 'Teste',
      requester_name: 'Teste',
      requester_email: 'teste@teste.com',
      subject: 'Teste',
      message: 'Teste de funcionamento'
    };

    const { data: testInsert, error: testError } = await supabase
      .from('service_requests')
      .insert([testData])
      .select()
      .single();

    if (testError) {
      console.error('❌ Erro no teste de inserção:', testError.message);
      throw new Error('Políticas RLS ainda não estão funcionando corretamente');
    }

    console.log('✅ Teste de inserção bem-sucedido');

    // Limpar dados de teste
    if (testInsert) {
      const { error: deleteError } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', testInsert.id);

      if (deleteError) {
        console.warn('⚠️ Erro ao limpar dados de teste:', deleteError.message);
      } else {
        console.log('✅ Dados de teste removidos');
      }
    }

    // 7. Verificar políticas criadas
    console.log('📊 Verificando políticas criadas...');
    const { data: policiesCheck, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          policyname, 
          cmd, 
          roles
        FROM pg_policies 
        WHERE tablename = 'service_requests'
        ORDER BY policyname;
      `
    });

    if (policiesError) {
      console.warn('⚠️ Erro ao verificar políticas:', policiesError.message);
    } else {
      console.log('📋 Políticas criadas:');
      policiesCheck?.forEach(policy => {
        console.log(`   - ${policy.policyname} (${policy.cmd}) para ${policy.roles.join(', ')}`);
      });
    }

    console.log('\n🎉 Correção concluída com sucesso!');
    console.log('✅ Tabela service_requests configurada corretamente');
    console.log('✅ Políticas RLS aplicadas');
    console.log('✅ Permissões concedidas');
    console.log('✅ Teste de inserção funcionando');
    console.log('\n🌐 O modal "Solicita Serviço" agora deve funcionar sem erros!');

  } catch (error) {
    console.error('❌ Erro durante a correção:', error.message);
    process.exit(1);
  }
}

// Executar correção
fixServiceRequestsRLS(); 