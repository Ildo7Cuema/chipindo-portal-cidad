import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OportunidadeSetor } from './useSetoresEstrategicos';

export const useSetoresOportunidades = (setorId?: string) => {
  const [oportunidades, setOportunidades] = useState<OportunidadeSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOportunidades = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('setores_oportunidades')
        .select('*')
        .order('ordem', { ascending: true });

      if (id) {
        query = query.eq('setor_id', id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar oportunidades:', error);
        setError('Erro ao carregar oportunidades');
        return;
      }

      setOportunidades(data || []);
    } catch (err) {
      console.error('Erro ao buscar oportunidades:', err);
      setError('Erro ao carregar oportunidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setorId) {
      fetchOportunidades(setorId);
    }
  }, [setorId]);

  const createOportunidade = async (oportunidade: Omit<OportunidadeSetor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores_oportunidades')
        .insert([oportunidade])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar oportunidade:', error);
        throw error;
      }
      
      await fetchOportunidades(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao criar oportunidade:', err);
      throw err;
    }
  };

  const updateOportunidade = async (id: string, updates: Partial<OportunidadeSetor>) => {
    try {
      const { data, error } = await supabase
        .from('setores_oportunidades')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao actualizar oportunidade:', error);
        throw error;
      }
      
      await fetchOportunidades(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao actualizar oportunidade:', err);
      throw err;
    }
  };

  const deleteOportunidade = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores_oportunidades')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir oportunidade:', error);
        throw error;
      }
      
      await fetchOportunidades(setorId);
    } catch (err) {
      console.error('Erro ao excluir oportunidade:', err);
      throw err;
    }
  };

  return {
    oportunidades,
    loading,
    error,
    fetchOportunidades,
    createOportunidade,
    updateOportunidade,
    deleteOportunidade
  };
}; 