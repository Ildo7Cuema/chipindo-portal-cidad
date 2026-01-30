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
  totalVisits: number;
  loading: boolean;
}

export function useRealTimeStats(role?: string, setorId?: string | null) {
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
    totalVisits: 0,
    loading: true,
  });

  const fetchStats = async () => {
    try {
      // Base queries
      let newsQuery = supabase.from('news').select('id, published', { count: 'exact' });
      let concursosQuery = supabase.from('concursos').select('id, published, deadline', { count: 'exact' });
      let acervoQuery = supabase.from('acervo_digital').select('id, is_public', { count: 'exact' });
      let eventsQuery = supabase.from('events').select('id, status', { count: 'exact' });

      // Apply sector filter if not admin and has sectorId
      if (role !== 'admin' && setorId) {
        newsQuery = newsQuery.eq('setor_id', setorId);
        concursosQuery = concursosQuery.eq('setor_id', setorId);
        acervoQuery = acervoQuery.eq('setor_id', setorId);
        eventsQuery = eventsQuery.eq('setor_id', setorId);
      }

      const [
        { data: newsData },
        { data: concursosData },
        { data: acervoData },
        { data: eventsData },
        { data: direcoesData },
        { data: organigramaData },
        { data: usersData },
        { count: visitsCount }
      ] = await Promise.all([
        newsQuery,
        concursosQuery,
        acervoQuery,
        eventsQuery,
        supabase.from('departamentos').select('id, ativo'),
        supabase.from('organigrama').select('id, ativo'),
        role === 'admin' ? supabase.from('profiles').select('id') : Promise.resolve({ data: [] }),
        // Contagem real: apenas acessos à página inicial pública (/)
        supabase.from('site_visits').select('*', { count: 'exact', head: true }).eq('page_path', '/')
      ]);

      // Calculate statistics
      const totalNews = newsData?.length || 0;
      const publishedNews = newsData?.filter(n => n.published).length || 0;

      const totalConcursos = concursosData?.length || 0;
      const activeConcursos = concursosData?.filter(c =>
        c.published && (!c.deadline || new Date(c.deadline) > new Date())
      ).length || 0;

      const totalEvents = eventsData?.length || 0;

      const totalDirecoes = direcoesData?.filter(d => d.ativo).length || 0;
      const totalOrganigramaMembers = organigramaData?.filter(m => m.ativo).length || 0;
      const totalAcervoItems = acervoData?.length || 0;
      const publicAcervoItems = acervoData?.filter(a => a.is_public).length || 0;
      const totalUsers = usersData?.length || 0;
      const totalVisits = visitsCount || 0;

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
        totalVisits,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, [role, setorId]);

  return { stats, refetch: fetchStats };
}