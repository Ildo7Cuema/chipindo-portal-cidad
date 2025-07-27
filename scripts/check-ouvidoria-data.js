import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndInsertOuvidoriaData() {
  console.log('🔍 Verificando dados da ouvidoria...\n');

  try {
    // Verificar manifestações existentes
    console.log('📋 Verificando manifestações existentes...');
    const { data: manifestacoes, error: manifestacoesError } = await supabase
      .from('ouvidoria_manifestacoes')
      .select('*')
      .order('data_abertura', { ascending: false });
    
    if (manifestacoesError) {
      console.error('❌ Erro ao buscar manifestações:', manifestacoesError);
    } else {
      console.log(`✅ Manifestações encontradas: ${manifestacoes?.length || 0}`);
      
      if (manifestacoes && manifestacoes.length > 0) {
        console.log('📊 Exemplos de manifestações:');
        manifestacoes.slice(0, 3).forEach((man, index) => {
          console.log(`  ${index + 1}. ${man.assunto} (${man.status}) - ${man.protocolo}`);
        });
      }
    }

    // Verificar estatísticas
    console.log('\n📊 Verificando estatísticas...');
    const { data: stats, error: statsError } = await supabase.rpc('get_ouvidoria_stats');
    
    if (statsError) {
      console.error('❌ Erro ao buscar estatísticas:', statsError);
    } else {
      console.log('✅ Estatísticas atuais:', stats);
    }

    // Se não há manifestações suficientes, inserir dados de teste
    if (!manifestacoes || manifestacoes.length < 5) {
      console.log('\n➕ Inserindo dados de teste...');
      
      const manifestacoesTeste = [
        {
          nome: 'João Silva',
          email: 'joao.silva@email.com',
          telefone: '+244 912 345 678',
          categoria: 'reclamacao',
          assunto: 'Falta de iluminação na rua principal',
          descricao: 'A rua principal do bairro está sem iluminação há mais de uma semana, causando insegurança para os moradores.',
          status: 'pendente',
          prioridade: 'alta',
          protocolo: 'OUV-2025-001'
        },
        {
          nome: 'Maria Santos',
          email: 'maria.santos@email.com',
          telefone: '+244 923 456 789',
          categoria: 'sugestao',
          assunto: 'Sugestão para parque infantil',
          descricao: 'Sugiro a construção de um parque infantil no centro da cidade para as crianças brincarem.',
          status: 'em_analise',
          prioridade: 'media',
          protocolo: 'OUV-2025-002'
        },
        {
          nome: 'Pedro Costa',
          email: 'pedro.costa@email.com',
          telefone: '+244 934 567 890',
          categoria: 'elogio',
          assunto: 'Elogio ao atendimento da prefeitura',
          descricao: 'Gostaria de elogiar o excelente atendimento recebido na prefeitura na semana passada.',
          status: 'resolvido',
          prioridade: 'baixa',
          protocolo: 'OUV-2025-003',
          avaliacao: 5,
          comentario_avaliacao: 'Atendimento muito bom!'
        },
        {
          nome: 'Ana Oliveira',
          email: 'ana.oliveira@email.com',
          telefone: '+244 945 678 901',
          categoria: 'denuncia',
          assunto: 'Denúncia de irregularidade',
          descricao: 'Denuncio a construção irregular de uma casa no bairro sem autorização.',
          status: 'respondido',
          prioridade: 'urgente',
          protocolo: 'OUV-2025-004',
          resposta: 'Sua denúncia foi recebida e está sendo investigada pela equipe responsável.'
        },
        {
          nome: 'Carlos Ferreira',
          email: 'carlos.ferreira@email.com',
          telefone: '+244 956 789 012',
          categoria: 'solicitacao',
          assunto: 'Solicitação de informações sobre licenças',
          descricao: 'Preciso de informações sobre como obter licença para abrir um pequeno comércio.',
          status: 'resolvido',
          prioridade: 'media',
          protocolo: 'OUV-2025-005',
          resposta: 'Informações enviadas por email. Consulte a documentação necessária.',
          avaliacao: 4,
          comentario_avaliacao: 'Resposta rápida e útil'
        }
      ];

      for (const manifestacao of manifestacoesTeste) {
        const { data, error } = await supabase.rpc('create_manifestacao', {
          p_nome: manifestacao.nome,
          p_email: manifestacao.email,
          p_telefone: manifestacao.telefone,
          p_categoria: manifestacao.categoria,
          p_assunto: manifestacao.assunto,
          p_descricao: manifestacao.descricao
        });

        if (error) {
          console.error(`❌ Erro ao criar manifestação ${manifestacao.protocolo}:`, error);
        } else {
          console.log(`✅ Manifestação ${manifestacao.protocolo} criada`);
          
          // Se a manifestação tem resposta, atualizar status
          if (manifestacao.resposta) {
            const { error: updateError } = await supabase.rpc('update_manifestacao_status', {
              p_id: data.id,
              p_status: manifestacao.status,
              p_resposta: manifestacao.resposta
            });
            
            if (updateError) {
              console.error(`❌ Erro ao atualizar status:`, updateError);
            }
          }
          
          // Se a manifestação tem avaliação, registrar
          if (manifestacao.avaliacao) {
            const { error: rateError } = await supabase.rpc('rate_manifestacao', {
              p_id: data.id,
              p_avaliacao: manifestacao.avaliacao,
              p_comentario: manifestacao.comentario_avaliacao
            });
            
            if (rateError) {
              console.error(`❌ Erro ao registrar avaliação:`, rateError);
            }
          }
        }
      }

      console.log('\n📊 Verificando estatísticas após inserção...');
      const { data: newStats, error: newStatsError } = await supabase.rpc('get_ouvidoria_stats');
      
      if (newStatsError) {
        console.error('❌ Erro ao buscar novas estatísticas:', newStatsError);
      } else {
        console.log('✅ Novas estatísticas:', newStats);
      }
    }

    console.log('\n🎉 Verificação concluída!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkAndInsertOuvidoriaData(); 