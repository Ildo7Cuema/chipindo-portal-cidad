import { createClient } from '@supabase/supabase-js';

// Usar as credenciais corretas do projeto
const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixOuvidoriaFunctions() {
  console.log('🔧 Corrigindo funções da ouvidoria...\n');

  try {
    // Corrigir função get_manifestacoes
    console.log('📝 Corrigindo função get_manifestacoes...');
    const { error: manifestacoesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION get_manifestacoes(
          p_search VARCHAR DEFAULT NULL,
          p_categoria VARCHAR DEFAULT NULL,
          p_status VARCHAR DEFAULT NULL,
          p_sort_by VARCHAR DEFAULT 'data_abertura',
          p_sort_order VARCHAR DEFAULT 'desc',
          p_limit INTEGER DEFAULT 50,
          p_offset INTEGER DEFAULT 0
        ) RETURNS TABLE (
          id UUID,
          protocolo VARCHAR,
          nome VARCHAR,
          email VARCHAR,
          telefone VARCHAR,
          categoria VARCHAR,
          assunto VARCHAR,
          descricao TEXT,
          status VARCHAR,
          prioridade VARCHAR,
          data_abertura TIMESTAMP WITH TIME ZONE,
          data_resposta TIMESTAMP WITH TIME ZONE,
          resposta TEXT,
          avaliacao INTEGER,
          comentario_avaliacao TEXT,
          anexos TEXT[],
          departamento_responsavel VARCHAR,
          tempo_resposta INTEGER
        ) AS $$
        DECLARE
          v_where TEXT := 'WHERE 1=1';
          v_order TEXT;
        BEGIN
          IF p_search IS NOT NULL AND p_search != '' THEN
            v_where := v_where || ' AND (assunto ILIKE ''%' || p_search || '%'' OR nome ILIKE ''%' || p_search || '%'' OR protocolo ILIKE ''%' || p_search || '%'')';
          END IF;
          
          IF p_categoria IS NOT NULL AND p_categoria != 'all' THEN
            v_where := v_where || ' AND categoria = ''' || p_categoria || '''';
          END IF;
          
          IF p_status IS NOT NULL AND p_status != 'all' THEN
            v_where := v_where || ' AND status = ''' || p_status || '''';
          END IF;
          
          v_order := 'ORDER BY ' || p_sort_by || ' ' || p_sort_order;
          
          RETURN QUERY EXECUTE 'SELECT 
            id, protocolo, nome, email, telefone, categoria, assunto, descricao,
            status, prioridade, data_abertura, data_resposta, resposta,
            avaliacao, comentario_avaliacao, anexos, departamento_responsavel, tempo_resposta
            FROM ouvidoria_manifestacoes ' || v_where || ' ' || v_order || ' LIMIT ' || p_limit || ' OFFSET ' || p_offset;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });

    if (manifestacoesError) {
      console.error('❌ Erro ao corrigir get_manifestacoes:', manifestacoesError);
    } else {
      console.log('✅ Função get_manifestacoes corrigida');
    }

    // Corrigir função get_ouvidoria_categorias
    console.log('\n📂 Corrigindo função get_ouvidoria_categorias...');
    const { error: categoriasError } = await supabase.rpc('exec_sql', {
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

    if (categoriasError) {
      console.error('❌ Erro ao corrigir get_ouvidoria_categorias:', categoriasError);
    } else {
      console.log('✅ Função get_ouvidoria_categorias corrigida');
    }

    console.log('\n🎉 Correções aplicadas!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Executar correções
fixOuvidoriaFunctions(); 