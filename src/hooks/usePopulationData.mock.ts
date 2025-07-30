import { useState, useEffect } from 'react';

export interface PopulationData {
  year: number;
  population_count: number;
  growth_rate: number;
  area_total: number;
  density: number;
  created_at: string;
}

const mockPopulationData: PopulationData[] = [
  {
    year: 2024,
    population_count: 85000,
    growth_rate: 2.3,
    area_total: 9532,
    density: 8.9,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    year: 2023,
    population_count: 83000,
    growth_rate: 2.1,
    area_total: 9532,
    density: 8.7,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    year: 2022,
    population_count: 81000,
    growth_rate: 1.9,
    area_total: 9532,
    density: 8.5,
    created_at: '2022-01-01T00:00:00Z'
  }
];

export function usePopulationData() {
  const [populationData, setPopulationData] = useState<PopulationData[]>(mockPopulationData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopulationData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setPopulationData(mockPopulationData);
      setError(null);
    } catch (err) {
      console.error('Error fetching population data:', err);
      setError('Erro ao carregar dados populacionais');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPopulation = () => {
    const currentYear = new Date().getFullYear();
    const currentData = populationData.find(data => data.year === currentYear);
    return currentData || mockPopulationData[0];
  };

  const getGrowthRate = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const current = getCurrentPopulation();
      return {
        current_population: current.population_count,
        growth_rate: current.growth_rate,
        description: "Taxa de crescimento anual",
        period: `${current.year}`
      };
    } catch (err) {
      console.error('Error getting growth rate:', err);
      return {
        current_population: 85000,
        growth_rate: 2.3,
        description: "Taxa de crescimento anual",
        period: "2024"
      };
    }
  };

  useEffect(() => {
    fetchPopulationData();
  }, []);

  // Calculate derived values for the component
  const currentData = getCurrentPopulation();
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;
  const previousData = populationData.find(data => data.year === previousYear) || mockPopulationData[1];
  
  const currentPopulation = currentData.population_count;
  const previousPopulation = previousData.population_count;
  const populationChange = currentPopulation - previousPopulation;
  const totalChange = mockPopulationData[0].population_count - mockPopulationData[mockPopulationData.length - 1].population_count;
  const percentageChange = ((currentPopulation - previousPopulation) / previousPopulation) * 100;

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
    yearsOfData: mockPopulationData.length,
    populationChange,
    loading,
    error,
    fetchPopulationData,
    refreshData: fetchPopulationData,
    getCurrentPopulation,
    getGrowthRate
  };
}