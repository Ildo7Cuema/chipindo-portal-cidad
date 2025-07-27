import { createClient } from '@supabase/supabase-js';

// Usar as credenciais corretas do projeto
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyCategoriesFix() {
  console.log('🔧 Aplicando correção das categorias...\n');

  try {
    // Primeiro, vamos verificar as categorias atuais
    console.log('📋 Verificando categorias atuais...');
    const { data: currentCategories, error: currentError } = await supabase
      .from('ouvidoria_categorias')
      .select('*');
    
    if (currentError) {
      console.error('❌ Erro ao buscar categorias:', currentError);
    } else {
      console.log('✅ Categorias encontradas:', currentCategories);
    }

    // Agora vamos testar a função corrigida
    console.log('\n📂 Testando função get_ouvidoria_categorias...');
    const { data: categoriesData, error: categoriesError } = await supabase.rpc('get_ouvidoria_categorias');
    
    if (categoriesError) {
      console.error('❌ Erro na função get_ouvidoria_categorias:', categoriesError);
      
      // Vamos tentar aplicar a correção
      console.log('\n🔧 Aplicando correção da função...');
      const { error: fixError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE OR REPLACE FUNCTION get_ouvidoria_categorias() RETURNS TABLE (
            id VARCHAR,
            name VARCHAR,
            description TEXT,
            color VARCHAR,
            bgColor VARCHAR
          ) AS $$
          BEGIN
            RETURN QUERY SELECT 
              oc.id,
              oc.nome as name,
              oc.descricao as description,
              oc.cor as color,
              oc.bg_color as bgColor
            FROM ouvidoria_categorias oc
            WHERE oc.ativo = true
            ORDER BY oc.nome;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });
      
      if (fixError) {
        console.error('❌ Erro ao aplicar correção:', fixError);
      } else {
        console.log('✅ Correção aplicada com sucesso');
        
        // Testar novamente
        console.log('\n🔄 Testando função corrigida...');
        const { data: testData, error: testError } = await supabase.rpc('get_ouvidoria_categorias');
        
        if (testError) {
          console.error('❌ Erro persistente:', testError);
        } else {
          console.log('✅ Função corrigida funcionando:', testData);
        }
      }
    } else {
      console.log('✅ Função funcionando corretamente:', categoriesData);
    }

    console.log('\n🎉 Processo concluído!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar correção
applyCategoriesFix(); 