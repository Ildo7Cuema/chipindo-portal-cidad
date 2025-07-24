import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeStats {
  totalNews: number;
  publishedNews: number;
  totalConcursos: number;
  activeConcursos: number;
  totalDirecoes: number;
  totalOrganigramaMembers: number;
  totalAcervoItems: number;
  publicAcervoItems: number;
  totalUsers: number;
  loading: boolean;
}

export function useRealTimeStats() {
  const [stats, setStats] = useState<RealTimeStats>({
    totalNews: 0,
    publishedNews: 0,
    totalConcursos: 0,
    activeConcursos: 0,
    totalDirecoes: 0,
    totalOrganigramaMembers: 0,
    totalAcervoItems: 0,
    publicAcervoItems: 0,
    totalUsers: 0,
    loading: true,
  });

  const fetchStats = async () => {
    try {
      // Fetch news statistics
      const { data: newsData } = await supabase
        .from('news')
        .select('id, published');

      // Fetch concursos statistics  
      const { data: concursosData } = await supabase
        .from('concursos')
        .select('id, published, deadline');

      // Fetch departamentos statistics
      const { data: direcoesData } = await supabase
        .from('departamentos')
        .select('id, ativo');

      // Fetch organigrama statistics
      const { data: organigramaData } = await supabase
        .from('organigrama')
        .select('id, ativo');

      // Fetch acervo statistics
      const { data: acervoData } = await supabase
        .from('acervo_digital')
        .select('id, is_public');

      // Fetch users statistics (only if admin)
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id');

      // Calculate statistics
      const totalNews = newsData?.length || 0;
      const publishedNews = newsData?.filter(n => n.published).length || 0;
      
      const totalConcursos = concursosData?.length || 0;
      const activeConcursos = concursosData?.filter(c => 
        c.published && (!c.deadline || new Date(c.deadline) > new Date())
      ).length || 0;

      const totalDirecoes = direcoesData?.filter(d => d.ativo).length || 0;
      const totalOrganigramaMembers = organigramaData?.filter(m => m.ativo).length || 0;
      const totalAcervoItems = acervoData?.length || 0;
      const publicAcervoItems = acervoData?.filter(a => a.is_public).length || 0;
      const totalUsers = usersData?.length || 0;

      setStats({
        totalNews,
        publishedNews,
        totalConcursos,
        activeConcursos,
        totalDirecoes,
        totalOrganigramaMembers,
        totalAcervoItems,
        publicAcervoItems,
        totalUsers,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, refetch: fetchStats };
}