import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PopulationData {
  year: number;
  population_count: number;
  growth_rate: number;
  area_total: number;
  density: number;
  created_at: string;
}

export function usePopulationData() {
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopulationData = async () => {
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
        const area_total = 9532; // Área total fixa do município de Chipindo
        const density = record.population_count / area_total;
        
        // Calcular growth_rate baseado no registro anterior
        let growth_rate = 0;
        if (data.length > 1) {
          const previousRecord = data.find(r => r.year === record.year - 1);
          if (previousRecord && previousRecord.population_count > 0) {
            growth_rate = ((record.population_count - previousRecord.population_count) / previousRecord.population_count) * 100;
          }
        }
        
        return {
          year: record.year,
          population_count: record.population_count,
          growth_rate: Math.round(growth_rate * 100) / 100,
          area_total,
          density: Math.round(density * 100) / 100,
          created_at: record.created_at
        };
      });

      setPopulationData(recordsWithDerivedFields);
      setError(null);
    } catch (err) {
      console.error('Error fetching population data:', err);
      setError('Erro ao carregar dados populacionais');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPopulation = () => {
    if (populationData.length === 0) {
      return {
        year: new Date().getFullYear(),
        population_count: 0,
        growth_rate: 0,
        area_total: 9532,
        density: 0,
        created_at: new Date().toISOString()
      };
    }
    
    const currentYear = new Date().getFullYear();
    const currentData = populationData.find(data => data.year === currentYear);
    return currentData || populationData[0];
  };

  const getGrowthRate = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_current_population_growth_rate');

      if (error) {
        throw error;
      }

      if (data && data.growth_rate !== null) {
        return {
          current_population: data.current_population,
          growth_rate: data.growth_rate,
          description: data.description || "Taxa de crescimento anual",
          period: data.period || `${data.current_year}`
        };
      } else {
        // Fallback para cálculo local
        const current = getCurrentPopulation();
        return {
          current_population: current.population_count,
          growth_rate: current.growth_rate,
          description: "Taxa de crescimento anual",
          period: `${current.year}`
        };
      }
    } catch (err) {
      console.error('Error getting growth rate:', err);
      // Fallback para dados locais
      const current = getCurrentPopulation();
      return {
        current_population: current.population_count,
        growth_rate: current.growth_rate,
        description: "Taxa de crescimento anual",
        period: `${current.year}`
      };
    }
  };

  useEffect(() => {
    fetchPopulationData();
  }, []);

  // Calcular valores derivados para o componente
  const currentData = getCurrentPopulation();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const previousData = populationData.find(data => data.year === previousYear);
  
  const currentPopulation = currentData.population_count;
  const previousPopulation = previousData?.population_count || currentPopulation;
  const populationChange = currentPopulation - previousPopulation;
  
  // Calcular mudança total desde o primeiro registro
  const totalChange = populationData.length > 1 
    ? populationData[0].population_count - populationData[populationData.length - 1].population_count
    : 0;
  
  const percentageChange = previousPopulation > 0 
    ? ((currentPopulation - previousPopulation) / previousPopulation) * 100
    : 0;

  return {
    populationData,
    currentPopulation,
    previousPopulation,
    growthRate: currentData.growth_rate,
    growthDescription: "Taxa de crescimento anual",
    period: `${currentData.year}`,
    latestYear: currentYear,
    previousYear,
    totalChange,
    percentageChange,
    yearsOfData: populationData.length,
    populationChange,
    loading,
    error,
    fetchPopulationData,
    refreshData: fetchPopulationData,
    getCurrentPopulation,
    getGrowthRate
  };
} 