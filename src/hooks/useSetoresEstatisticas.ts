import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EstatisticaSetor } from './useSetoresEstrategicos';

export const useSetoresEstatisticas = (setorId?: string) => {
  const [estatisticas, setEstatisticas] = useState<EstatisticaSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticas = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('setores_estatisticas')
        .select('*')
        .order('ordem', { ascending: true });

      if (id) {
        query = query.eq('setor_id', id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        setError('Erro ao carregar estatísticas');
        return;
      }

      setEstatisticas(data || []);
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setorId) {
      fetchEstatisticas(setorId);
    }
  }, [setorId]);

  const createEstatistica = async (estatistica: Omit<EstatisticaSetor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores_estatisticas')
        .insert([estatistica])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar estatística:', error);
        throw error;
      }
      
      await fetchEstatisticas(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao criar estatística:', err);
      throw err;
    }
  };

  const updateEstatistica = async (id: string, updates: Partial<EstatisticaSetor>) => {
    try {
      const { data, error } = await supabase
        .from('setores_estatisticas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao actualizar estatística:', error);
        throw error;
      }
      
      await fetchEstatisticas(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao actualizar estatística:', err);
      throw err;
    }
  };

  const deleteEstatistica = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores_estatisticas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir estatística:', error);
        throw error;
      }
      
      await fetchEstatisticas(setorId);
    } catch (err) {
      console.error('Erro ao excluir estatística:', err);
      throw err;
    }
  };

  return {
    estatisticas,
    loading,
    error,
    fetchEstatisticas,
    createEstatistica,
    updateEstatistica,
    deleteEstatistica
  };
}; 