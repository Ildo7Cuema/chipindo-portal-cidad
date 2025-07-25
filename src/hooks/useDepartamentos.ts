import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interface para Direcções Municipais
// Nota: Mantém nome "Departamento" para compatibilidade com banco de dados
export interface Departamento {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean | null;
  ordem: number | null;
  created_at: string;
  updated_at: string;
}

export const useDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartamentos = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setDepartamentos(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching departamentos:', err);
      setError(err.message);
      setDepartamentos([]);
    } finally {
      setLoading(false);
    }
  };

  const getDepartamentoByCode = (codigo: string) => {
    return departamentos.find(dept => dept.codigo === codigo);
  };

  const getDepartamentosByType = (prefix: string) => {
    return departamentos.filter(dept => dept.codigo?.startsWith(prefix));
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  return { 
    departamentos, 
    loading, 
    error, 
    refetch: fetchDepartamentos,
    getDepartamentoByCode,
    getDepartamentosByType
  };
};