import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Servico {
  id: string;
  title: string;
  description: string;
  direcao: string;
  categoria: string;
  setor_id?: string;
  icon: string;
  requisitos: string[];
  documentos: string[];
  horario: string;
  localizacao: string;
  contacto: string;
  email: string;
  prazo: string;
  taxa: string;
  prioridade: 'baixa' | 'media' | 'alta';
  digital: boolean;
  ativo: boolean;
  views: number;
  requests: number;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export const useServicos = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setServicos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const getServicosBySetor = async (setorNome: string, setorId?: string): Promise<Servico[]> => {
    try {
      let query = supabase
        .from('servicos')
        .select('*')
        .order('ordem', { ascending: true });

      if (setorId) {
        query = query.eq('setor_id', setorId);
      } else {
        query = query.eq('categoria', setorNome);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Erro ao buscar serviços do setor:', err);
      return [];
    }
  };

  const createServico = async (servico: Omit<Servico, 'id' | 'created_at' | 'updated_at' | 'views' | 'requests'>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert([servico])
        .select()
        .single();

      if (error) throw error;
      
      setServicos(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar serviço');
    }
  };

  const updateServico = async (id: string, updates: Partial<Servico>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setServicos(prev => prev.map(servico => 
        servico.id === id ? data : servico
      ));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar serviço');
    }
  };

  const deleteServico = async (id: string) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setServicos(prev => prev.filter(servico => servico.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao excluir serviço');
    }
  };

  const toggleServicoStatus = async (id: string) => {
    try {
      const servico = servicos.find(s => s.id === id);
      if (!servico) throw new Error('Serviço não encontrado');

      const { data, error } = await supabase
        .from('servicos')
        .update({ ativo: !servico.ativo })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setServicos(prev => prev.map(s => s.id === id ? data : s));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao alterar status do serviço');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const { error } = await supabase
        .from('servicos')
        .update({ views: supabase.rpc('increment', { row_id: id, column_name: 'views' }) })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao incrementar visualizações:', err);
    }
  };

  const getServicosStats = () => {
    const total = servicos.length;
    const ativos = servicos.filter(s => s.ativo).length;
    const digitais = servicos.filter(s => s.digital).length;
    const totalViews = servicos.reduce((sum, s) => sum + s.views, 0);
    const totalRequests = servicos.reduce((sum, s) => sum + s.requests, 0);

    return {
      total,
      ativos,
      digitais,
      totalViews,
      totalRequests
    };
  };

  return {
    servicos,
    loading,
    error,
    fetchServicos,
    getServicosBySetor,
    createServico,
    updateServico,
    deleteServico,
    toggleServicoStatus,
    incrementViews,
    getServicosStats
  };
}; 