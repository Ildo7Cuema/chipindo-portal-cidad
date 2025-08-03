import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InfraestruturaSetor } from './useSetoresEstrategicos';

export const useSetoresInfraestruturas = (setorId?: string) => {
  const [infraestruturas, setInfraestruturas] = useState<InfraestruturaSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInfraestruturas = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('setores_infraestruturas')
        .select('*')
        .order('ordem', { ascending: true });

      if (id) {
        query = query.eq('setor_id', id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar infraestruturas:', error);
        setError('Erro ao carregar infraestruturas');
        return;
      }

      setInfraestruturas(data || []);
    } catch (err) {
      console.error('Erro ao buscar infraestruturas:', err);
      setError('Erro ao carregar infraestruturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setorId) {
      fetchInfraestruturas(setorId);
    }
  }, [setorId]);

  const createInfraestrutura = async (infraestrutura: Omit<InfraestruturaSetor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores_infraestruturas')
        .insert([infraestrutura])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar infraestrutura:', error);
        throw error;
      }
      
      await fetchInfraestruturas(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao criar infraestrutura:', err);
      throw err;
    }
  };

  const updateInfraestrutura = async (id: string, updates: Partial<InfraestruturaSetor>) => {
    try {
      const { data, error } = await supabase
        .from('setores_infraestruturas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao actualizar infraestrutura:', error);
        throw error;
      }
      
      await fetchInfraestruturas(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao actualizar infraestrutura:', err);
      throw err;
    }
  };

  const deleteInfraestrutura = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores_infraestruturas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir infraestrutura:', error);
        throw error;
      }
      
      await fetchInfraestruturas(setorId);
    } catch (err) {
      console.error('Erro ao excluir infraestrutura:', err);
      throw err;
    }
  };

  return {
    infraestruturas,
    loading,
    error,
    fetchInfraestruturas,
    createInfraestrutura,
    updateInfraestrutura,
    deleteInfraestrutura
  };
}; 