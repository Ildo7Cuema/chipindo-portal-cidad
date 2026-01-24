import { useState, useEffect } from 'react';
import { usePopulationData } from './usePopulationData';

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

// Dados estáticos baseados nos dados reais que encontramos
const STATIC_STATS: HeroStats = {
  population: 176994,
  populationFormatted: "176 994+",
  growthRate: 11.32,
  growthDescription: "Taxa de crescimento anual",
  period: "2025",
  sectors: 8,
  projects: 4,
  opportunities: 1,
  loading: false,
  error: null,
  growth_rate: 11.32,
  area_total: 9532
};

export function useHeroStats() {
  const {
    currentPopulation,
    growthRate: populationGrowthRate,
    loading: populationLoading
  } = usePopulationData();

  const [stats, setStats] = useState<HeroStats>({
    population: 0,
    populationFormatted: "0",
    growthRate: 0,
    growthDescription: "Taxa de crescimento anual",
    period: new Date().getFullYear().toString(),
    sectors: 0,
    projects: 0,
    opportunities: 0,
    loading: true,
    error: null,
    growth_rate: 0,
    area_total: 9532
  });

  const fetchStats = async () => {
    // Simular carregamento para outros dados que ainda são estáticos
    setStats(prev => ({ ...prev, loading: true }));

    // Simular delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Combinar dados dinâmicos de população com dados estáticos de outros setores
    setStats({
      ...STATIC_STATS,
      population: currentPopulation,
      populationFormatted: currentPopulation ? currentPopulation.toLocaleString('pt-AO') : "...",
      growthRate: populationGrowthRate,
      growth_rate: populationGrowthRate,
      // Manter outros dados estáticos por enquanto
      loading: populationLoading
    });
  };

  const updatePopulation = async (population: number) => {
    console.log('Atualização de população solicitada:', population);
    // Por enquanto, apenas logar a atualização
    return { success: true };
  };

  const updateAreaTotal = async (area_total: number) => {
    console.log('Atualização de área total solicitada:', area_total);
    // Por enquanto, apenas logar a atualização
    setStats(prev => ({ ...prev, area_total }));
    return { success: true };
  };

  useEffect(() => {
    if (!populationLoading) {
      fetchStats();
    }
  }, [populationLoading, currentPopulation]);

  return {
    ...stats,
    refreshStats: fetchStats,
    updatePopulation,
    updateAreaTotal
  };
} 