import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MunicipalStats {
  totalDirecoes: number;
  totalNews: number;
  totalConcursos: number;
  totalEmergencyContacts: number;
  totalAcervo: number;
}

export const useMunicipalStats = () => {
  const [stats, setStats] = useState<MunicipalStats>({
    totalDirecoes: 0,
    totalNews: 0,
    totalConcursos: 0,
    totalEmergencyContacts: 0,
    totalAcervo: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all statistics in parallel
      const [
        departmentsResult,
        newsResult, 
        concursosResult,
        emergencyResult,
        acervoResult
      ] = await Promise.all([
        supabase.from('departamentos').select('id', { count: 'exact', head: true }).eq('ativo', true),
        supabase.from('news').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('concursos').select('id', { count: 'exact', head: true }).eq('published', true),
        supabase.from('emergency_contacts').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('acervo_digital').select('id', { count: 'exact', head: true }).eq('is_public', true)
      ]);

      setStats({
        totalDirecoes: departmentsResult.count || 0,
        totalNews: newsResult.count || 0,
        totalConcursos: concursosResult.count || 0,
        totalEmergencyContacts: emergencyResult.count || 0,
        totalAcervo: acervoResult.count || 0
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching municipal stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}; 