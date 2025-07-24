import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Departamento {
  id: string;
  nome: string;
  codigo: string | null;
  descricao: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export function useDepartamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDepartamentos = async () => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem');

      if (error) {
        console.error('Error fetching departamentos:', error);
      } else {
        setDepartamentos(data || []);
      }
    } catch (error) {
      console.error('Error fetching departamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDepartamento = async (departamento: Omit<Departamento, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .insert([departamento])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchDepartamentos();
      return data;
    } catch (error) {
      console.error('Error adding departamento:', error);
      throw error;
    }
  };

  const updateDepartamento = async (id: string, updates: Partial<Departamento>) => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchDepartamentos();
      return data;
    } catch (error) {
      console.error('Error updating departamento:', error);
      throw error;
    }
  };

  const deleteDepartamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchDepartamentos();
    } catch (error) {
      console.error('Error deleting departamento:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  return {
    departamentos,
    loading,
    addDepartamento,
    updateDepartamento,
    deleteDepartamento,
    refetch: fetchDepartamentos
  };
}