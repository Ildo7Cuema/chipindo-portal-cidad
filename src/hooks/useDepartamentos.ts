import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Direccao {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  funcionarios?: number;
}

export const useDepartamentos = () => {
  const [direcoes, setDirecoes] = useState<Direccao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDirecoes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setDirecoes(data || []);
    } catch (err) {
      console.error('Erro ao buscar direcções:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Buscar direcções na inicialização
  useEffect(() => {
    fetchDirecoes();
  }, []);

  return {
    direcoes,
    loading,
    error,
    fetchDirecoes,
    // Helper para obter apenas os nomes das direcções
    direcaoNames: direcoes.map(direcao => direcao.nome),
    // Helper para obter opções de dropdown
    direcaoOptions: [
      { value: "all", label: "Todas as áreas" },
      ...direcoes.map(direcao => ({ value: direcao.nome, label: direcao.nome }))
    ]
  };
};