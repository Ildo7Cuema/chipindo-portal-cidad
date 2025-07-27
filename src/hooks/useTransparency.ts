import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export interface TransparencyDocument {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'published' | 'pending' | 'archived';
  fileSize: string;
  downloads: number;
  views: number;
  description: string;
  tags: string[];
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetExecution {
  id: string;
  year: string;
  category: string;
  totalBudget: number;
  executedBudget: number;
  percentage: number;
  status: 'on_track' | 'over_budget' | 'under_budget';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  budget: number;
  progress: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planned';
  location: string;
  beneficiaries: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransparencyStats {
  totalDocuments: number;
  totalDownloads: number;
  totalViews: number;
  totalBudget: number;
  executedBudget: number;
  activeProjects: number;
  completedProjects: number;
  beneficiaries: number;
}

export const useTransparency = () => {
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetExecution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<TransparencyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar documentos de transparência
  const loadDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Erro ao carregar documentos:', err);
      setError('Erro ao carregar documentos de transparência');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados orçamentários
  const loadBudgetData = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_execution')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setBudgetData(data || []);
    } catch (err) {
      console.error('Erro ao carregar dados orçamentários:', err);
    }
  };

  // Carregar projetos
  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('transparency_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    }
  };

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_transparency_stats');

      if (error) throw error;
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    }
  };

  // Incrementar visualizações
  const incrementViews = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('transparency_documents')
        .update({ views: documents.find(d => d.id === documentId)?.views + 1 })
        .eq('id', documentId);

      if (error) throw error;
      
      // Atualizar estado local
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, views: doc.views + 1 }
            : doc
        )
      );
    } catch (err) {
      console.error('Erro ao incrementar visualizações:', err);
    }
  };

  // Incrementar downloads
  const incrementDownloads = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('transparency_documents')
        .update({ downloads: documents.find(d => d.id === documentId)?.downloads + 1 })
        .eq('id', documentId);

      if (error) throw error;
      
      // Atualizar estado local
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, downloads: doc.downloads + 1 }
            : doc
        )
      );
    } catch (err) {
      console.error('Erro ao incrementar downloads:', err);
    }
  };

  // Filtrar documentos
  const filterDocuments = (searchTerm: string, category: string) => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = category === 'all' || doc.category === category;
      return matchesSearch && matchesCategory;
    });
  };

  // Ordenar documentos
  const sortDocuments = (documents: TransparencyDocument[], sortBy: string, sortOrder: 'asc' | 'desc') => {
    return [...documents].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'downloads') {
        return sortOrder === 'asc' ? a.downloads - b.downloads : b.downloads - a.downloads;
      }
      if (sortBy === 'views') {
        return sortOrder === 'asc' ? a.views - b.views : b.views - a.views;
      }
      return 0;
    });
  };

  // Carregar todos os dados
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadDocuments(),
        loadBudgetData(),
        loadProjects(),
        loadStats()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dados de transparência:', err);
      setError('Erro ao carregar dados de transparência');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadAllData();
  }, []);

  return {
    documents,
    budgetData,
    projects,
    stats,
    loading,
    error,
    incrementViews,
    incrementDownloads,
    filterDocuments,
    sortDocuments,
    loadAllData
  };
}; 