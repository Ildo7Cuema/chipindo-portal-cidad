import { useState, useEffect } from 'react';

export interface PopulationRecord {
  id: string;
  year: number;
  population_count: number;
  growth_rate: number;
  area_total: number;
  density: number;
  source: string;
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

const mockRecords: PopulationRecord[] = [
  {
    id: '1',
    year: 2024,
    population_count: 85000,
    growth_rate: 2.3,
    area_total: 9532,
    density: 8.9,
    source: 'Censo Municipal',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    year: 2023,
    population_count: 83000,
    growth_rate: 2.1,
    area_total: 9532,
    density: 8.7,
    source: 'Estimativa INE',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    year: 2022,
    population_count: 81000,
    growth_rate: 1.9,
    area_total: 9532,
    density: 8.5,
    source: 'Estimativa INE',
    created_at: '2022-01-01T00:00:00Z',
    updated_at: '2022-01-01T00:00:00Z'
  }
];

const mockGrowthCalculation: GrowthCalculation = {
  growth_rate: 2.3,
  calculation_method: 'Média ponderada dos últimos 3 anos',
  data_points_used: 3,
  confidence_level: 'Alto',
  last_updated: new Date().toISOString()
};

export function usePopulationHistory() {
  const [records, setRecords] = useState<PopulationRecord[]>(mockRecords);
  const [growthCalculation, setGrowthCalculation] = useState<GrowthCalculation>(mockGrowthCalculation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setRecords(mockRecords);
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
      await new Promise(resolve => setTimeout(resolve, 100));
      setGrowthCalculation(mockGrowthCalculation);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const recordsWithIds = newRecords.map(record => ({
        ...record,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      setRecords(prev => [...recordsWithIds, ...prev]);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error adding records:', err);
      setError('Erro ao adicionar registros');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateGrowthRateAutomatically = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate automatic calculation
      const newGrowthRate = 2.5 + (Math.random() - 0.5) * 0.5;
      
      setGrowthCalculation(prev => ({
        ...prev,
        growth_rate: Math.round(newGrowthRate * 100) / 100,
        last_updated: new Date().toISOString()
      }));
      
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating growth rate:', err);
      setError('Erro ao atualizar taxa de crescimento');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setRecords(prev => prev.filter(record => record.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error deleting record:', err);
      setError('Erro ao deletar registro');
      return { success: false };
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
    updateGrowthRateAutomatically,
    deleteRecord
  };
}