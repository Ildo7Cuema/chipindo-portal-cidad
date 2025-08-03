import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface InterestArea {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useInterestAreas = () => {
  const [areas, setAreas] = useState<InterestArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar a tabela departamentos em vez de interest_areas
      const { data, error: fetchError } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      // Converter dados de departamentos para o formato de áreas
      const convertedAreas = (data || []).map(dept => ({
        id: dept.id,
        name: dept.nome,
        description: dept.descricao,
        active: dept.ativo,
        created_at: dept.created_at,
        updated_at: dept.updated_at
      }));

      setAreas(convertedAreas);
    } catch (err) {
      console.error('Erro ao buscar áreas:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Buscar áreas na inicialização
  useEffect(() => {
    fetchAreas();
  }, []);

  return {
    areas,
    loading,
    error,
    fetchAreas,
    // Helper para obter apenas os nomes das áreas
    areaNames: areas.map(area => area.name),
    // Helper para obter opções de dropdown
    areaOptions: [
      { value: "all", label: "Todas as áreas" },
      ...areas.map(area => ({ value: area.name, label: area.name }))
    ]
  };
}; 