import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PopulationData {
  currentPopulation: number;
  previousPopulation: number;
  growthRate: number;
  growthDescription: string;
  period: string;
  latestYear: number;
  previousYear: number;
  totalChange: number;
  percentageChange: number;
  yearsOfData: number;
  loading: boolean;
  error: string | null;
}

export function usePopulationData() {
  const [populationData, setPopulationData] = useState<PopulationData>({
    currentPopulation: 0,
    previousPopulation: 0,
    growthRate: 0,
    growthDescription: 'Taxa de crescimento populacional anual',
    period: new Date().getFullYear().toString(),
    latestYear: new Date().getFullYear(),
    previousYear: new Date().getFullYear() - 1,
    totalChange: 0,
    percentageChange: 0,
    yearsOfData: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPopulationData = async () => {
      try {
        setPopulationData(prev => ({ ...prev, loading: true, error: null }));

        // Get current growth rate from the function
        const { data: growthData, error: growthError } = await supabase
          .rpc('get_current_population_growth_rate');

        if (growthError) {
          console.error('Error fetching growth rate:', growthError);
          setPopulationData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Erro ao carregar dados de crescimento' 
          }));
          return;
        }

        // Get all population history for additional calculations
        const { data: historyData, error: historyError } = await supabase
          .from('population_history')
          .select('*')
          .order('year', { ascending: true });

        if (historyError) {
          console.error('Error fetching population history:', historyError);
          setPopulationData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Erro ao carregar histórico populacional' 
          }));
          return;
        }

        // Calculate additional statistics
        let totalChange = 0;
        let percentageChange = 0;
        let yearsOfData = historyData?.length || 0;

        if (historyData && historyData.length >= 2) {
          const earliest = historyData[0];
          const latest = historyData[historyData.length - 1];
          totalChange = latest.population_count - earliest.population_count;
          percentageChange = ((totalChange / earliest.population_count) * 100);
        }

        // Update population data
        setPopulationData({
          currentPopulation: growthData?.current_population || 0,
          previousPopulation: growthData?.previous_population || 0,
          growthRate: growthData?.growth_rate || 0,
          growthDescription: growthData?.description || 'Taxa de crescimento populacional anual',
          period: growthData?.period || new Date().getFullYear().toString(),
          latestYear: growthData?.current_year || new Date().getFullYear(),
          previousYear: growthData?.previous_year || new Date().getFullYear() - 1,
          totalChange,
          percentageChange: Math.round(percentageChange * 100) / 100,
          yearsOfData,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error in usePopulationData:', error);
        setPopulationData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Erro inesperado ao carregar dados populacionais' 
        }));
      }
    };

    fetchPopulationData();
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    setPopulationData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const { data: growthData, error: growthError } = await supabase
        .rpc('get_current_population_growth_rate');

      if (growthError) {
        throw growthError;
      }

      const { data: historyData, error: historyError } = await supabase
        .from('population_history')
        .select('*')
        .order('year', { ascending: true });

      if (historyError) {
        throw historyError;
      }

      let totalChange = 0;
      let percentageChange = 0;
      let yearsOfData = historyData?.length || 0;

      if (historyData && historyData.length >= 2) {
        const earliest = historyData[0];
        const latest = historyData[historyData.length - 1];
        totalChange = latest.population_count - earliest.population_count;
        percentageChange = ((totalChange / earliest.population_count) * 100);
      }

      setPopulationData({
        currentPopulation: growthData?.current_population || 0,
        previousPopulation: growthData?.previous_population || 0,
        growthRate: growthData?.growth_rate || 0,
        growthDescription: growthData?.description || 'Taxa de crescimento populacional anual',
        period: growthData?.period || new Date().getFullYear().toString(),
        latestYear: growthData?.current_year || new Date().getFullYear(),
        previousYear: growthData?.previous_year || new Date().getFullYear() - 1,
        totalChange,
        percentageChange: Math.round(percentageChange * 100) / 100,
        yearsOfData,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error refreshing population data:', error);
      setPopulationData(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao atualizar dados populacionais' 
      }));
    }
  };

  return {
    ...populationData,
    refreshData
  };
} 