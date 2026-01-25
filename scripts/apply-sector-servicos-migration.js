import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySetorServicosMigration() {
  console.log('🚀 Aplicando migração de setor_id para serviços...\n');

  try {
    // 1. Adicionar coluna setor_id
    console.log('📝 Adicionando coluna setor_id...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE servicos ADD COLUMN IF NOT EXISTS setor_id UUID REFERENCES setores_estrategicos(id) ON DELETE SET NULL;
      `
    });

    if (alterError) {
      console.error('❌ Erro ao adicionar coluna setor_id:', alterError);
      return;
    }

    // 2. Criar índice
    console.log('📊 Criando índice para setor_id...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE INDEX IF NOT EXISTS idx_servicos_setor_id ON servicos(setor_id);
      `
    });

    if (indexError) {
      console.error('❌ Erro ao criar índice:', indexError);
      return;
    }

    // 3. Atualizar serviços existentes
    console.log('🔄 Atualizando serviços existentes...');
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql_query: `
        UPDATE servicos 
        SET setor_id = (
          SELECT id 
          FROM setores_estrategicos 
          WHERE nome = servicos.categoria
        )
        WHERE setor_id IS NULL;
      `
    });

    if (updateError) {
      console.error('❌ Erro ao atualizar serviços:', updateError);
      return;
    }

    // 4. Adicionar política RLS
    console.log('🔒 Adicionando política RLS...');
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql_query: `
        DROP POLICY IF EXISTS "Users can view services by setor" ON servicos;
        CREATE POLICY "Users can view services by setor" ON servicos
          FOR SELECT USING (
            setor_id IN (
              SELECT id FROM setores_estrategicos WHERE ativo = true
            )
          );
      `
    });

    if (policyError) {
      console.error('❌ Erro ao adicionar política RLS:', policyError);
      return;
    }

    // 5. Verificar resultados
    console.log('✅ Verificando resultados...');
    const { data: servicos, error: selectError } = await supabase
      .from('servicos')
      .select('id, title, categoria, setor_id')
      .limit(5);

    if (selectError) {
      console.error('❌ Erro ao verificar serviços:', selectError);
      return;
    }

    console.log('📋 Exemplo de serviços atualizados:');
    servicos.forEach(servico => {
      console.log(`  - ${servico.title} (${servico.categoria}) -> setor_id: ${servico.setor_id || 'NULL'}`);
    });

    // 6. Contar serviços por setor
    const { data: setores, error: setoresError } = await supabase
      .from('setores_estrategicos')
      .select('id, nome');

    if (!setoresError && setores) {
      console.log('\n📊 Serviços por setor:');
      for (const setor of setores) {
        const { count } = await supabase
          .from('servicos')
          .select('*', { count: 'exact', head: true })
          .eq('setor_id', setor.id);
        
        console.log(`  - ${setor.nome}: ${count || 0} serviços`);
      }
    }

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('🎯 Agora os administradores podem gerir os serviços de cada setor na página de Gestão de Sectores Estratégicos.');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
  }
}

applySetorServicosMigration(); 