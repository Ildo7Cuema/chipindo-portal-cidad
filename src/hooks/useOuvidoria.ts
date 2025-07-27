import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OuvidoriaItem {
  id: string;
  protocolo: string;
  nome: string;
  email: string;
  telefone: string;
  categoria: string;
  assunto: string;
  descricao: string;
  status: 'pendente' | 'em_analise' | 'respondido' | 'resolvido' | 'arquivado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  data_abertura: string;
  data_resposta?: string;
  resposta?: string;
  avaliacao?: number;
  comentario_avaliacao?: string;
  anexos?: string[];
  departamento_responsavel?: string;
  tempo_resposta?: number;
}

export interface OuvidoriaStats {
  total_manifestacoes: number;
  pendentes: number;
  respondidas: number;
  resolvidas: number;
  tempo_medio_resposta: number;
  satisfacao_geral: number;
  categorias_mais_comuns: string[];
}

export interface OuvidoriaCategoria {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
}

export interface ManifestacaoFormData {
  nome: string;
  email: string;
  telefone?: string;
  categoria: string;
  assunto: string;
  descricao: string;
}

export const useOuvidoria = () => {
  const [manifestacoes, setManifestacoes] = useState<OuvidoriaItem[]>([]);
  const [stats, setStats] = useState<OuvidoriaStats | null>(null);
  const [categorias, setCategorias] = useState<OuvidoriaCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_ouvidoria_stats' as any);
      
      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return;
      }

      if (data) {
        setStats(data as OuvidoriaStats);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  // Buscar categorias
  const fetchCategorias = async () => {
    try {
      // Buscar diretamente da tabela em vez de usar RPC
      const { data, error } = await supabase
        .from('ouvidoria_categorias')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar categorias:', error);
        return;
      }

      if (data) {
        // Formatar as categorias para o formato esperado
        const formattedCategories = data.map(cat => ({
          id: cat.id,
          name: cat.nome,
          description: cat.descricao,
          color: cat.cor,
          bgColor: cat.bg_color
        }));
        setCategorias(formattedCategories);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Buscar manifestações
  const fetchManifestacoes = async (
    search?: string,
    categoria?: string,
    status?: string,
    sortBy: string = 'data_abertura',
    sortOrder: 'asc' | 'desc' = 'desc',
    limit: number = 50,
    offset: number = 0
  ) => {
    try {
      setLoading(true);
      
      // Buscar diretamente da tabela em vez de usar RPC
      let query = supabase
        .from('ouvidoria_manifestacoes')
        .select('*')
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);
      
      // Aplicar filtros
      if (search && search.trim() !== '') {
        query = query.or(`assunto.ilike.%${search}%,nome.ilike.%${search}%,protocolo.ilike.%${search}%`);
      }
      
      if (categoria && categoria !== 'all') {
        query = query.eq('categoria', categoria);
      }
      
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar manifestações:', error);
        setManifestacoes([]);
        return;
      }

      // Garantir que data seja sempre um array
      if (data && Array.isArray(data)) {
        setManifestacoes(data);
      } else {
        console.warn('Dados de manifestações não são um array:', data);
        setManifestacoes([]);
      }
    } catch (error) {
      console.error('Erro ao buscar manifestações:', error);
      setManifestacoes([]);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova manifestação
  const createManifestacao = async (formData: ManifestacaoFormData) => {
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase.rpc('create_manifestacao' as any, {
        p_nome: formData.nome,
        p_email: formData.email,
        p_telefone: formData.telefone || null,
        p_categoria: formData.categoria,
        p_assunto: formData.assunto,
        p_descricao: formData.descricao
      });
      
      if (error) {
        console.error('Erro ao criar manifestação:', error);
        toast.error('Erro ao enviar manifestação. Tente novamente.');
        return null;
      }

      if (data && (data as any).success) {
        toast.success(`Manifestação enviada com sucesso! Protocolo: ${(data as any).protocolo}`);
        
        // Atualizar estatísticas
        await fetchStats();
        
        return data;
      } else {
        toast.error('Erro ao enviar manifestação. Tente novamente.');
        return null;
      }
    } catch (error) {
      console.error('Erro ao criar manifestação:', error);
      toast.error('Erro ao enviar manifestação. Tente novamente.');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // Atualizar status de manifestação
  const updateManifestacaoStatus = async (
    id: string,
    status: string,
    resposta?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('update_manifestacao_status' as any, {
        p_id: id,
        p_status: status,
        p_resposta: resposta || null
      });
      
      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status. Tente novamente.');
        return false;
      }

      if (data && (data as any).success) {
        toast.success('Status atualizado com sucesso!');
        
        // Atualizar lista de manifestações
        await fetchManifestacoes();
        
        return true;
      } else {
        toast.error('Erro ao atualizar status. Tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status. Tente novamente.');
      return false;
    }
  };

  // Avaliar manifestação
  const rateManifestacao = async (
    id: string,
    avaliacao: number,
    comentario?: string
  ) => {
    try {
      const { data, error } = await supabase.rpc('rate_manifestacao' as any, {
        p_id: id,
        p_avaliacao: avaliacao,
        p_comentario: comentario || null
      });
      
      if (error) {
        console.error('Erro ao avaliar manifestação:', error);
        toast.error('Erro ao registrar avaliação. Tente novamente.');
        return false;
      }

      if (data && (data as any).success) {
        toast.success('Avaliação registrada com sucesso!');
        
        // Atualizar estatísticas
        await fetchStats();
        
        return true;
      } else {
        toast.error('Erro ao registrar avaliação. Tente novamente.');
        return false;
      }
    } catch (error) {
      console.error('Erro ao avaliar manifestação:', error);
      toast.error('Erro ao registrar avaliação. Tente novamente.');
      return false;
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchStats(),
        fetchCategorias(),
        fetchManifestacoes()
      ]);
    };

    loadInitialData();
  }, []);

  return {
    manifestacoes,
    stats,
    categorias,
    loading,
    submitting,
    fetchManifestacoes,
    createManifestacao,
    updateManifestacaoStatus,
    rateManifestacao,
    fetchStats,
    fetchCategorias
  };
}; 