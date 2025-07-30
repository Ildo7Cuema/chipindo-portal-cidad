import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PopulationRecord {
  id: string;
  year: number;
  population_count: number;
  source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthCalculation {
  growth_rate: number;
  current_year: number;
  previous_year: number;
  current_population: number;
  previous_population: number;
  description: string;
  period: string;
  calculated_at: string;
}

export function usePopulationHistory() {
  const [populationHistory, setPopulationHistory] = useState<PopulationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentGrowthRate, setCurrentGrowthRate] = useState<GrowthCalculation | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Fetch population history
  const fetchPopulationHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('population_history')
        .select('*')
        .order('year', { ascending: true });

      if (error) {
        console.error('Error fetching population history:', error);
      } else {
        setPopulationHistory(data || []);
      }
    } catch (error) {
      console.error('Error fetching population history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current growth rate
  const calculateCurrentGrowthRate = async () => {
    setCalculating(true);
    try {
      const { data, error } = await supabase
        .rpc('get_current_population_growth_rate');

      if (error) {
        console.error('Error calculating growth rate:', error);
      } else {
        setCurrentGrowthRate(data);
      }
    } catch (error) {
      console.error('Error calculating growth rate:', error);
    } finally {
      setCalculating(false);
    }
  };

  // Add new population record
  const addPopulationRecord = async (record: Omit<PopulationRecord, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('population_history')
        .insert([record])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPopulationHistory(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding population record:', error);
      throw error;
    }
  };

  // Update population record
  const updatePopulationRecord = async (id: string, updates: Partial<PopulationRecord>) => {
    try {
      const { data, error } = await supabase
        .from('population_history')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPopulationHistory(prev => 
        prev.map(record => record.id === id ? data : record)
      );
      return data;
    } catch (error) {
      console.error('Error updating population record:', error);
      throw error;
    }
  };

  // Delete population record
  const deletePopulationRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('population_history')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPopulationHistory(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting population record:', error);
      throw error;
    }
  };

  // Auto-update growth rate in site settings
  const updateGrowthRateAutomatically = async () => {
    setCalculating(true);
    try {
      const { data, error } = await supabase
        .rpc('update_growth_rate_from_population');

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating growth rate automatically:', error);
      throw error;
    } finally {
      setCalculating(false);
    }
  };

  // Calculate growth rate between specific years
  const calculateGrowthRateBetweenYears = async (startYear: number, endYear: number) => {
    try {
      const { data, error } = await supabase
        .rpc('calculate_population_growth_rate', {
          start_year: startYear,
          end_year: endYear
        });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error calculating growth rate between years:', error);
      throw error;
    }
  };

  // Get population trend data for charts
  const getPopulationTrend = () => {
    return populationHistory.map(record => ({
      year: record.year,
      population: record.population_count,
      source: record.source
    }));
  };

  // Get latest population data
  const getLatestPopulation = () => {
    if (populationHistory.length === 0) return null;
    return populationHistory[populationHistory.length - 1];
  };

  // Get population change over time
  const getPopulationChange = () => {
    if (populationHistory.length < 2) return null;
    
    const latest = populationHistory[populationHistory.length - 1];
    const earliest = populationHistory[0];
    
    const totalChange = latest.population_count - earliest.population_count;
    const percentageChange = ((totalChange / earliest.population_count) * 100);
    
    return {
      totalChange,
      percentageChange: Math.round(percentageChange * 100) / 100,
      years: latest.year - earliest.year
    };
  };

  useEffect(() => {
    fetchPopulationHistory();
  }, []);

  useEffect(() => {
    if (populationHistory.length > 0) {
      calculateCurrentGrowthRate();
    }
  }, [populationHistory]);

  return {
    populationHistory,
    loading,
    currentGrowthRate,
    calculating,
    fetchPopulationHistory,
    addPopulationRecord,
    updatePopulationRecord,
    deletePopulationRecord,
    updateGrowthRateAutomatically,
    calculateGrowthRateBetweenYears,
    getPopulationTrend,
    getLatestPopulation,
    getPopulationChange
  };
} 