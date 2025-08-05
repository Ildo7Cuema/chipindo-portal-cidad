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
  growth_rate: number;
  area_total: number;
}

export function useHeroStats() {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Buscar dados populacionais
      const { data: populationData, error: populationError } = await supabase
        .from('population_history')
        .select('*')
        .order('year', { ascending: false })
        .limit(2);

      if (populationError) {
        throw new Error(`Erro ao buscar dados populacionais: ${populationError.message}`);
      }

      // Buscar dados de setores estratégicos
      const { data: setoresData, error: setoresError } = await supabase
        .from('setores_estrategicos')
        .select('id', { count: 'exact', head: true })
        .eq('ativo', true);

      if (setoresError) {
        console.warn('Erro ao buscar setores:', setoresError.message);
      }

      // Buscar dados de concursos (oportunidades)
      const { data: concursosData, error: concursosError } = await supabase
        .from('concursos')
        .select('id', { count: 'exact', head: true })
        .eq('published', true);

      if (concursosError) {
        console.warn('Erro ao buscar concursos:', concursosError.message);
      }

      // Buscar dados de notícias (projetos)
      const { data: newsData, error: newsError } = await supabase
        .from('news')
        .select('id', { count: 'exact', head: true })
        .eq('published', true);

      if (newsError) {
        console.warn('Erro ao buscar notícias:', newsError.message);
      }

      // Calcular estatísticas populacionais
      let currentPopulation = 0;
      let growthRate = 0;
      let period = new Date().getFullYear().toString();

      if (populationData && populationData.length > 0) {
        const currentRecord = populationData[0];
        const previousRecord = populationData[1];

        currentPopulation = currentRecord.population_count;
        period = currentRecord.year.toString();

        // Calcular taxa de crescimento
        if (previousRecord && previousRecord.population_count > 0) {
          growthRate = ((currentPopulation - previousRecord.population_count) / previousRecord.population_count) * 100;
        }
      }

      // Formatar população
      const populationFormatted = currentPopulation > 0 
        ? `${currentPopulation.toLocaleString('pt-AO')}+`
        : "0";

      // Preparar estatísticas
      const heroStats: HeroStats = {
        population: currentPopulation,
        populationFormatted,
        growthRate: Math.round(growthRate * 100) / 100,
        growthDescription: "Taxa de crescimento anual",
        period,
        sectors: setoresData?.count || 0,
        projects: newsData?.count || 0,
        opportunities: concursosData?.count || 0,
        loading: false,
        error: null,
        growth_rate: Math.round(growthRate * 100) / 100,
        area_total: 9532
      };

      setStats(heroStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching hero stats:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
      
      // Fallback para dados básicos
      setStats(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar estatísticas'
      }));
    } finally {
      setLoading(false);
    }
  };

  const updatePopulation = async (population: number) => {
    setLoading(true);
    try {
      // Atualizar na tabela population_history
      const currentYear = new Date().getFullYear();
      const { error: updateError } = await supabase
        .from('population_history')
        .upsert({
          year: currentYear,
          population_count: population,
          source: 'official',
          notes: 'Atualização via hero stats'
        });

      if (updateError) {
        throw new Error(`Erro ao atualizar população: ${updateError.message}`);
      }

      // Recarregar estatísticas
      await fetchStats();
      return { success: true };
    } catch (err) {
      console.error('Error updating population:', err);
      setError(err instanceof Error ? err.message : 'Erro ao actualizar população');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateAreaTotal = async (area_total: number) => {
    setLoading(true);
    try {
      // Atualizar nas configurações do site
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ area_total_count: area_total.toString() })
        .neq('id', '');

      if (updateError) {
        throw new Error(`Erro ao atualizar área total: ${updateError.message}`);
      }

      // Atualizar estatísticas locais
      setStats(prev => ({ ...prev, area_total }));
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error updating area total:', err);
      setError(err instanceof Error ? err.message : 'Erro ao actualizar área total');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    ...stats,
    refreshStats: fetchStats,
    updatePopulation,
    updateAreaTotal
  };
} 