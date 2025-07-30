import { useState, useEffect } from 'react';

export interface HeroStats {
  population: number;
  populationFormatted: string;
  growthRate: number;
  growthDescription: string;
  period: string;
  sectors: number;
  projects: number;
  opportunities: number;
  loading: boolean;
  error: string | null;
  growth_rate: number;
  area_total: number;
}

const mockHeroStats: HeroStats = {
  population: 85000,
  populationFormatted: "85.000+",
  growthRate: 2.3,
  growthDescription: "Taxa de crescimento anual",
  period: "2023-2024",
  sectors: 7,
  projects: 25,
  opportunities: 50,
  loading: false,
  error: null,
  growth_rate: 2.3,
  area_total: 9532
};

export function useHeroStats() {
  const [stats, setStats] = useState<HeroStats>(mockHeroStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      setStats(mockHeroStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching hero stats:', err);
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const updatePopulation = async (population: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setStats(prev => ({ ...prev, population }));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating population:', err);
      setError('Erro ao atualizar população');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateAreaTotal = async (area_total: number) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setStats(prev => ({ ...prev, area_total }));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating area total:', err);
      setError('Erro ao atualizar área total');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    ...stats,
    refreshStats: fetchStats
  };
}