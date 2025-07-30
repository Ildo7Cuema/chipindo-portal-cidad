import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export function useHeroStats() {
  const [heroStats, setHeroStats] = useState<HeroStats>({
    population: 0,
    populationFormatted: '...',
    growthRate: 0,
    growthDescription: 'Taxa de crescimento populacional anual',
    period: new Date().getFullYear().toString(),
    sectors: 0,
    projects: 0,
    opportunities: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchHeroStats = async () => {
      try {
        setHeroStats(prev => ({ ...prev, loading: true, error: null }));

        // 1. Get population data
        const { data: growthData, error: growthError } = await supabase
          .rpc('get_current_population_growth_rate');

        if (growthError) {
          console.error('Error fetching population data:', growthError);
        }

        // 2. Get sectors (departamentos) data
        const { data: sectorsData, error: sectorsError } = await supabase
          .from('departamentos')
          .select('id, ativo')
          .eq('ativo', true);

        if (sectorsError) {
          console.error('Error fetching sectors data:', sectorsError);
        }

        // 3. Get projects data (concursos + news + other initiatives)
        const { data: concursosData, error: concursosError } = await supabase
          .from('concursos')
          .select('id, published')
          .eq('published', true);

        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('id, published')
          .eq('published', true);

        if (concursosError) {
          console.error('Error fetching concursos data:', concursosError);
        }

        if (newsError) {
          console.error('Error fetching news data:', newsError);
        }

        // 4. Calculate opportunities (based on various factors)
        const totalProjects = (concursosData?.length || 0) + (newsData?.length || 0);
        const opportunities = Math.max(totalProjects * 2, 10); // Estimate opportunities

        // 5. Update stats
        const currentPopulation = growthData?.current_population || 0;
        const populationFormatted = currentPopulation > 0 
          ? `${currentPopulation.toLocaleString('pt-AO')}+`
          : '150.000+';

        setHeroStats({
          population: currentPopulation,
          populationFormatted,
          growthRate: growthData?.growth_rate || 0,
          growthDescription: growthData?.description || 'Taxa de crescimento populacional anual',
          period: growthData?.period || new Date().getFullYear().toString(),
          sectors: sectorsData?.length || 7, // Fallback to 7 if no data
          projects: totalProjects || 25, // Fallback to 25 if no data
          opportunities,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error in useHeroStats:', error);
        setHeroStats(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Erro ao carregar estatísticas do Hero' 
        }));
      }
    };

    fetchHeroStats();
  }, []);

  // Function to refresh stats
  const refreshStats = async () => {
    setHeroStats(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Re-fetch all data
      const { data: growthData, error: growthError } = await supabase
        .rpc('get_current_population_growth_rate');

      const { data: sectorsData, error: sectorsError } = await supabase
        .from('departamentos')
        .select('id, ativo')
        .eq('ativo', true);

      const { data: concursosData, error: concursosError } = await supabase
        .from('concursos')
        .select('id, published')
        .eq('published', true);

      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('id, published')
        .eq('published', true);

      const totalProjects = (concursosData?.length || 0) + (newsData?.length || 0);
      const opportunities = Math.max(totalProjects * 2, 10);

      const currentPopulation = growthData?.current_population || 0;
      const populationFormatted = currentPopulation > 0 
        ? `${currentPopulation.toLocaleString('pt-AO')}+`
        : '150.000+';

      setHeroStats({
        population: currentPopulation,
        populationFormatted,
        growthRate: growthData?.growth_rate || 0,
        growthDescription: growthData?.description || 'Taxa de crescimento populacional anual',
        period: growthData?.period || new Date().getFullYear().toString(),
        sectors: sectorsData?.length || 7,
        projects: totalProjects || 25,
        opportunities,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error refreshing hero stats:', error);
      setHeroStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Erro ao atualizar estatísticas do Hero' 
      }));
    }
  };

  return {
    ...heroStats,
    refreshStats
  };
} 