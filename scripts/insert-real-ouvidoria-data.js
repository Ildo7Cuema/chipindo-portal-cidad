import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://murdhrdqqnuntfxmwtqx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cmRocmRxcW51bnRmeG13dHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMjE2MTYsImV4cCI6MjA2ODg5NzYxNn0.GeaTovaTUnw4LvEnFtKbjw_vlkkT7JQ16wxUjp0ZpuA";

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertRealOuvidoriaData() {
  console.log('➕ Inserindo dados realistas de manifestações...\n');

  try {
    const manifestacoesRealistas = [
      {
        nome: 'António Mendes',
        email: 'antonio.mendes@email.com',
        telefone: '+244 912 111 111',
        categoria: 'reclamacao',
        assunto: 'Falta de água no bairro central',
        descricao: 'O bairro central está sem água há 3 dias. Os moradores estão enfrentando dificuldades para atividades básicas.',
        status: 'pendente',
        prioridade: 'urgente'
      },
      {
        nome: 'Isabel Santos',
        email: 'isabel.santos@email.com',
        telefone: '+244 923 222 222',
        categoria: 'sugestao',
        assunto: 'Sugestão para biblioteca municipal',
        descricao: 'Sugiro a criação de uma biblioteca municipal com livros em português e línguas locais para incentivar a leitura.',
        status: 'em_analise',
        prioridade: 'media'
      },
      {
        nome: 'Manuel Costa',
        email: 'manuel.costa@email.com',
        telefone: '+244 934 333 333',
        categoria: 'elogio',
        assunto: 'Elogio ao serviço de limpeza',
        descricao: 'Gostaria de elogiar a equipe de limpeza que tem mantido a cidade muito bem cuidada.',
        status: 'resolvido',
        prioridade: 'baixa'
      },
      {
        nome: 'Rosa Ferreira',
        email: 'rosa.ferreira@email.com',
        telefone: '+244 945 444 444',
        categoria: 'denuncia',
        assunto: 'Denúncia de desmatamento ilegal',
        descricao: 'Denuncio o desmatamento ilegal na área próxima ao rio. Árvores estão sendo cortadas sem autorização.',
        status: 'respondido',
        prioridade: 'alta'
      },
      {
        nome: 'João Silva',
        email: 'joao.silva@email.com',
        telefone: '+244 956 555 555',
        categoria: 'solicitacao',
        assunto: 'Informações sobre programa de emprego',
        descricao: 'Preciso de informações sobre programas de emprego para jovens da comunidade.',
        status: 'resolvido',
        prioridade: 'media'
      },
      {
        nome: 'Maria Oliveira',
        email: 'maria.oliveira@email.com',
        telefone: '+244 967 666 666',
        categoria: 'reclamacao',
        assunto: 'Estrada em mau estado',
        descricao: 'A estrada que liga o centro à zona rural está em péssimo estado, dificultando o transporte.',
        status: 'em_analise',
        prioridade: 'alta'
      },
      {
        nome: 'Pedro Santos',
        email: 'pedro.santos@email.com',
        telefone: '+244 978 777 777',
        categoria: 'sugestao',
        assunto: 'Sugestão para mercado municipal',
        descricao: 'Sugiro a construção de um mercado municipal coberto para os vendedores locais.',
        status: 'pendente',
        prioridade: 'media'
      },
      {
        nome: 'Ana Costa',
        email: 'ana.costa@email.com',
        telefone: '+244 989 888 888',
        categoria: 'elogio',
        assunto: 'Elogio ao atendimento médico',
        descricao: 'Excelente atendimento no posto de saúde. Os médicos são muito atenciosos.',
        status: 'resolvido',
        prioridade: 'baixa'
      },
      {
        nome: 'Carlos Mendes',
        email: 'carlos.mendes@email.com',
        telefone: '+244 990 999 999',
        categoria: 'denuncia',
        assunto: 'Denúncia de poluição do rio',
        descricao: 'Denuncio o despejo de lixo no rio que está poluindo a água e afetando a pesca.',
        status: 'respondido',
        prioridade: 'urgente'
      },
      {
        nome: 'Lucia Ferreira',
        email: 'lucia.ferreira@email.com',
        telefone: '+244 991 000 000',
        categoria: 'solicitacao',
        assunto: 'Solicitação de documentos',
        descricao: 'Preciso de orientação sobre como obter documentos pessoais para minha filha.',
        status: 'resolvido',
        prioridade: 'media'
      }
    ];

    console.log(`📝 Inserindo ${manifestacoesRealistas.length} manifestações realistas...`);

    for (const manifestacao of manifestacoesRealistas) {
      const { data, error } = await supabase.rpc('create_manifestacao', {
        p_nome: manifestacao.nome,
        p_email: manifestacao.email,
        p_telefone: manifestacao.telefone,
        p_categoria: manifestacao.categoria,
        p_assunto: manifestacao.assunto,
        p_descricao: manifestacao.descricao
      });

      if (error) {
        console.error(`❌ Erro ao criar manifestação:`, error);
      } else {
        console.log(`✅ Manifestação criada: ${manifestacao.assunto}`);
        
        // Simular respostas e avaliações para algumas manifestações
        if (manifestacao.status === 'resolvido') {
          // Adicionar resposta
          const { error: updateError } = await supabase.rpc('update_manifestacao_status', {
            p_id: data.id,
            p_status: 'resolvido',
            p_resposta: 'Sua manifestação foi analisada e as medidas necessárias foram tomadas. Obrigado por nos contatar.'
          });
          
          if (!updateError) {
            // Adicionar avaliação positiva
            const { error: rateError } = await supabase.rpc('rate_manifestacao', {
              p_id: data.id,
              p_avaliacao: Math.floor(Math.random() * 2) + 4, // 4 ou 5
              p_comentario: 'Resposta rápida e eficiente!'
            });
            
            if (rateError) {
              console.error(`❌ Erro ao registrar avaliação:`, rateError);
            }
          }
        } else if (manifestacao.status === 'respondido') {
          // Adicionar resposta
          const { error: updateError } = await supabase.rpc('update_manifestacao_status', {
            p_id: data.id,
            p_status: 'respondido',
            p_resposta: 'Sua manifestação foi recebida e está sendo analisada pela equipe responsável. Entraremos em contato em breve.'
          });
          
          if (!updateError) {
            // Adicionar avaliação
            const { error: rateError } = await supabase.rpc('rate_manifestacao', {
              p_id: data.id,
              p_avaliacao: Math.floor(Math.random() * 3) + 3, // 3, 4 ou 5
              p_comentario: 'Atendimento satisfatório.'
            });
            
            if (rateError) {
              console.error(`❌ Erro ao registrar avaliação:`, rateError);
            }
          }
        }
      }
    }

    console.log('\n📊 Verificando estatísticas finais...');
    const { data: finalStats, error: statsError } = await supabase.rpc('get_ouvidoria_stats');
    
    if (statsError) {
      console.error('❌ Erro ao buscar estatísticas:', statsError);
    } else {
      console.log('✅ Estatísticas finais:', finalStats);
    }

    console.log('\n🎉 Dados realistas inseridos com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

insertRealOuvidoriaData(); 