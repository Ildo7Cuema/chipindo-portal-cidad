import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PopulationRecord {
  id: string;
  year: number;
  population_count: number;
  growth_rate: number;
  area_total: number;
  density: number;
  source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthCalculation {
  growth_rate: number;
  calculation_method: string;
  data_points_used: number;
  confidence_level: string;
  last_updated: string;
}

export function usePopulationHistory() {
  const [records, setRecords] = useState<PopulationRecord[]>([]);
  const [growthCalculation, setGrowthCalculation] = useState<GrowthCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para calcular campos derivados
  const calculateDerivedFields = (population_count: number) => {
    const area_total = 9532; // Área total fixa do município de Chipindo
    const density = population_count / area_total;
    
    return {
      area_total,
      density: Math.round(density * 100) / 100
    };
  };

  // Função para calcular growth_rate baseado em registros existentes
  const calculateGrowthRate = (year: number, population_count: number, existingRecords: PopulationRecord[]) => {
    const previousRecord = existingRecords.find(r => r.year === year - 1);
    if (previousRecord && previousRecord.population_count > 0) {
      return Math.round(((population_count - previousRecord.population_count) / previousRecord.population_count) * 100 * 100) / 100;
    }
    return 0;
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('population_history')
        .select('*')
        .order('year', { ascending: false });

      if (error) {
        throw error;
      }

      // Calcular campos derivados para cada registro
      const recordsWithDerivedFields = data.map(record => {
        const derivedFields = calculateDerivedFields(record.population_count);
        return {
          ...record,
          ...derivedFields,
          growth_rate: calculateGrowthRate(record.year, record.population_count, data)
        };
      });

      setRecords(recordsWithDerivedFields);
      setError(null);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  const fetchGrowthCalculation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_current_population_growth_rate');

      if (error) {
        throw error;
      }

      if (data && data.growth_rate !== null) {
        setGrowthCalculation({
          growth_rate: data.growth_rate,
          calculation_method: 'Cálculo automático baseado nos últimos 2 anos',
          data_points_used: 2,
          confidence_level: 'Alto',
          last_updated: new Date().toISOString()
        });
      } else {
        setGrowthCalculation({
          growth_rate: 0,
          calculation_method: 'Dados insuficientes',
          data_points_used: 0,
          confidence_level: 'Baixo',
          last_updated: new Date().toISOString()
        });
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching growth calculation:', err);
      setError('Erro ao carregar cálculo de crescimento');
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (newRecords: Omit<PopulationRecord, 'id' | 'created_at' | 'updated_at'>[]) => {
    setLoading(true);
    try {
      // Preparar dados para inserção (remover campos derivados que não existem na tabela)
      const recordsToInsert = newRecords.map(record => ({
        year: record.year,
        population_count: record.population_count,
        source: record.source,
        notes: record.notes
      }));

      const { data, error } = await supabase
        .from('population_history')
        .insert(recordsToInsert)
        .select();

      if (error) {
        throw error;
      }

      // Recarregar registros para obter dados atualizados
      await fetchRecords();
      
      setError(null);
      return { success: true, data };
    } catch (err) {
      console.error('Error adding records:', err);
      setError('Erro ao adicionar registros');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (id: string, updatedData: Partial<PopulationRecord>) => {
    setLoading(true);
    try {
      // Preparar dados para atualização (apenas campos que existem na tabela)
      const dataToUpdate = {
        year: updatedData.year,
        population_count: updatedData.population_count,
        source: updatedData.source,
        notes: updatedData.notes
      };

      const { data, error } = await supabase
        .from('population_history')
        .update(dataToUpdate)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      // Recarregar registros para obter dados atualizados
      await fetchRecords();
      
      setError(null);
      return { success: true, data };
    } catch (err) {
      console.error('Error updating record:', err);
      setError('Erro ao atualizar registro');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('population_history')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Recarregar registros para obter dados atualizados
      await fetchRecords();
      
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Erro ao deletar registro');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateGrowthRateAutomatically = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('update_growth_rate_from_population');

      if (error) {
        throw error;
      }

      // Recarregar cálculo de crescimento
      await fetchGrowthCalculation();
      
      setError(null);
      return { success: data?.success || false, data };
    } catch (err) {
      console.error('Error updating growth rate:', err);
      setError('Erro ao atualizar taxa de crescimento');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchGrowthCalculation();
  }, []);

  return {
    records,
    growthCalculation,
    loading,
    error,
    fetchRecords,
    fetchGrowthCalculation,
    addRecord,
    updateRecord,
    updateGrowthRateAutomatically,
    deleteRecord
  };
} 