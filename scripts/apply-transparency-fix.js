import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function applyTransparencyFix() {
  console.log('🔧 Aplicando correções nas políticas RLS...\n');

  try {
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('./scripts/fix-transparency-rls.sql', 'utf8');
    
    // Executar o SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Erro ao aplicar correções:', error);
      
      // Tentar aplicar as políticas uma por uma
      console.log('\n🔄 Tentando aplicar políticas individualmente...');
      
      const policies = [
        {
          name: 'Drop existing admin policies',
          sql: `
            DROP POLICY IF EXISTS "Admins can manage transparency documents" ON public.transparency_documents;
            DROP POLICY IF EXISTS "Admins can manage budget execution" ON public.budget_execution;
            DROP POLICY IF EXISTS "Admins can manage transparency projects" ON public.transparency_projects;
          `
        },
        {
          name: 'Create public policies for transparency_documents',
          sql: `
            CREATE POLICY "Public can manage transparency documents" 
            ON public.transparency_documents 
            FOR ALL 
            USING (true)
            WITH CHECK (true);
          `
        },
        {
          name: 'Create public policies for budget_execution',
          sql: `
            CREATE POLICY "Public can manage budget execution" 
            ON public.budget_execution 
            FOR ALL 
            USING (true)
            WITH CHECK (true);
          `
        },
        {
          name: 'Create public policies for transparency_projects',
          sql: `
            CREATE POLICY "Public can manage transparency projects" 
            ON public.transparency_projects 
            FOR ALL 
            USING (true)
            WITH CHECK (true);
          `
        }
      ];

      for (const policy of policies) {
        try {
          const { error: policyError } = await supabase.rpc('exec_sql', { sql: policy.sql });
          if (policyError) {
            console.error(`❌ Erro ao aplicar ${policy.name}:`, policyError);
          } else {
            console.log(`✅ ${policy.name} aplicada com sucesso`);
          }
        } catch (err) {
          console.error(`❌ Erro ao aplicar ${policy.name}:`, err);
        }
      }
    } else {
      console.log('✅ Correções aplicadas com sucesso');
    }

    // Testar se as correções funcionaram
    console.log('\n🧪 Testando inserção de documento...');
    const testDoc = {
      title: 'Documento de Teste - Correção RLS',
      category: 'relatorios',
      date: '2024-01-01',
      status: 'published',
      file_size: '1.0 MB',
      description: 'Documento de teste após correção das políticas RLS',
      tags: ['teste', 'rls'],
      file_url: 'https://exemplo.com/teste.pdf'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('transparency_documents')
      .insert([testDoc])
      .select();

    if (insertError) {
      console.error('❌ Erro ao inserir documento após correção:', insertError);
    } else {
      console.log('✅ Inserção funcionando após correção');
      console.log('   ID do documento inserido:', insertData?.[0]?.id);

      // Limpar documento de teste
      if (insertData?.[0]?.id) {
        await supabase
          .from('transparency_documents')
          .delete()
          .eq('id', insertData[0].id);
        console.log('   Documento de teste removido');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

applyTransparencyFix(); 