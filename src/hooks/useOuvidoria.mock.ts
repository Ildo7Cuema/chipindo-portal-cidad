import { useState, useEffect } from 'react';

export interface OuvidoriaCategory {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  bg_color: string;
  ativo: boolean;
  created_at: string;
}

export interface OuvidoriaItem {
  id: string;
  protocolo: string;
  nome: string;
  email: string;
  telefone: string;
  categoria_id: string;
  tipo: string;
  assunto: string;
  descricao: string;
  status: string;
  resposta?: string;
  anexos: string[];
  data_prazo?: string;
  created_at: string;
  updated_at: string;
}

const mockCategories: OuvidoriaCategory[] = [
  {
    id: '1',
    nome: 'Reclamação',
    descricao: 'Manifestações de insatisfação',
    cor: '#ef4444',
    bg_color: '#fef2f2',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    nome: 'Sugestão',
    descricao: 'Propostas de melhoria',
    cor: '#3b82f6',
    bg_color: '#eff6ff',
    ativo: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    nome: 'Elogio',
    descricao: 'Manifestações positivas',
    cor: '#10b981',
    bg_color: '#f0fdf4',
    ativo: true,
    created_at: new Date().toISOString()
  }
];

const mockManifestacoes: OuvidoriaItem[] = [
  {
    id: '1',
    protocolo: 'OUV-2024-001',
    nome: 'João Silva',
    email: 'joao@exemplo.com',
    telefone: '923456789',
    categoria_id: '1',
    tipo: 'reclamacao',
    assunto: 'Problema na estrada',
    descricao: 'Buraco na estrada principal causando acidentes',
    status: 'em_analise',
    anexos: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useOuvidoria() {
  const [categories, setCategories] = useState<OuvidoriaCategory[]>(mockCategories);
  const [manifestacoes, setManifestacoes] = useState<OuvidoriaItem[]>(mockManifestacoes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setCategories(mockCategories);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const fetchManifestacoes = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      setManifestacoes(mockManifestacoes);
      setError(null);
    } catch (err) {
      console.error('Error fetching manifestações:', err);
      setError('Erro ao carregar manifestações');
    } finally {
      setLoading(false);
    }
  };

  const submitManifestacao = async (data: Partial<OuvidoriaItem>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newManifestacao: OuvidoriaItem = {
        id: Date.now().toString(),
        protocolo: `OUV-2024-${String(manifestacoes.length + 1).padStart(3, '0')}`,
        nome: data.nome || '',
        email: data.email || '',
        telefone: data.telefone || '',
        categoria_id: data.categoria_id || '1',
        tipo: data.tipo || 'reclamacao',
        assunto: data.assunto || '',
        descricao: data.descricao || '',
        status: 'pendente',
        anexos: data.anexos || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setManifestacoes(prev => [newManifestacao, ...prev]);
      setError(null);
      return { success: true, data: newManifestacao };
    } catch (err) {
      console.error('Error submitting manifestação:', err);
      setError('Erro ao enviar manifestação');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchManifestacoes();
  }, []);

  return {
    categories,
    manifestacoes,
    loading,
    error,
    fetchCategories,
    fetchManifestacoes,
    submitManifestacao
  };
}