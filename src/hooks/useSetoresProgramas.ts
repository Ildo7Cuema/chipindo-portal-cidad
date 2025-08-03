import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProgramaSetor } from './useSetoresEstrategicos';

export const useSetoresProgramas = (setorId?: string) => {
  const [programas, setProgramas] = useState<ProgramaSetor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgramas = async (id?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('setores_programas')
        .select('*')
        .order('ordem', { ascending: true });

      if (id) {
        query = query.eq('setor_id', id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar programas:', error);
        setError('Erro ao carregar programas');
        return;
      }

      setProgramas(data || []);
    } catch (err) {
      console.error('Erro ao buscar programas:', err);
      setError('Erro ao carregar programas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setorId) {
      fetchProgramas(setorId);
    }
  }, [setorId]);

  const createPrograma = async (programa: Omit<ProgramaSetor, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('setores_programas')
        .insert([programa])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar programa:', error);
        throw error;
      }
      
      await fetchProgramas(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao criar programa:', err);
      throw err;
    }
  };

  const updatePrograma = async (id: string, updates: Partial<ProgramaSetor>) => {
    try {
      const { data, error } = await supabase
        .from('setores_programas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao actualizar programa:', error);
        throw error;
      }
      
      await fetchProgramas(setorId);
      return data;
    } catch (err) {
      console.error('Erro ao actualizar programa:', err);
      throw err;
    }
  };

  const deletePrograma = async (id: string) => {
    try {
      const { error } = await supabase
        .from('setores_programas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir programa:', error);
        throw error;
      }
      
      await fetchProgramas(setorId);
    } catch (err) {
      console.error('Erro ao excluir programa:', err);
      throw err;
    }
  };

  return {
    programas,
    loading,
    error,
    fetchProgramas,
    createPrograma,
    updatePrograma,
    deletePrograma
  };
}; 