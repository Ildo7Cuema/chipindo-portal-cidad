import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

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
  categoria: string;
  assunto: string;
  descricao: string;
  status: string;
  prioridade: string;
  data_abertura: string;
  data_resposta?: string;
  resposta?: string;
  avaliacao?: number;
  comentario_avaliacao?: string;
  anexos: string[];
  departamento_responsavel?: string;
  tempo_resposta?: number;
  created_at: string;
  updated_at: string;
}

export interface OuvidoriaStats {
  total_manifestacoes: number;
  pendentes: number;
  respondidas: number;
  resolvidas: number;
  tempo_medio_resposta: number;
  satisfacao_geral: number;
  categorias_mais_comuns: string[];
}

export function useOuvidoria() {
  const [categories, setCategories] = useState<OuvidoriaCategory[]>([]);
  const [manifestacoes, setManifestacoes] = useState<OuvidoriaItem[]>([]);
  const [stats, setStats] = useState<OuvidoriaStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ouvidoria_categorias' as any)
        .select('*')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;

      setCategories((data as unknown as OuvidoriaCategory[]) || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Erro ao carregar categorias');
      toast({
        title: "Erro",
        description: "Erro ao carregar categorias da ouvidoria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchManifestacoes = async (sectorFilter?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ouvidoria_manifestacoes' as any)
        .select('*')
        .order('data_abertura', { ascending: false });

      if (error) throw error;

      let filteredManifestacoes = (data as unknown as OuvidoriaItem[]) || [];
      
      // Filtrar por setor se especificado
      if (sectorFilter && sectorFilter !== 'all') {
        console.log('Ouvidoria - Aplicando filtro para setor:', sectorFilter);
        
        filteredManifestacoes = ((data as unknown as OuvidoriaItem[]) || []).filter(manifestacao => {
          const assunto = manifestacao.assunto?.toLowerCase() || '';
          const descricao = manifestacao.descricao?.toLowerCase() || '';
          const departamento = manifestacao.departamento_responsavel?.toLowerCase() || '';
          const sectorName = sectorFilter.toLowerCase();
          
          // Mapeamento de setores para palavras-chave mais específicas
          const sectorKeywords: Record<string, string[]> = {
            'educação': ['escola', 'escolar', 'académico', 'professor', 'aluno', 'educacional', 'sala de aula', 'parque infantil'],
            'saúde': ['hospital', 'médico', 'enfermeiro', 'clínica', 'atendimento médico', 'sanitário', 'saúde pública'],
            'agricultura': ['agricultura', 'agricultor', 'fazenda', 'colheita', 'campo', 'rural', 'apoio técnico'],
            'setor mineiro': ['mina', 'mineiro', 'mineração', 'mineral', 'extrativo', 'segurança na mina'],
            'desenvolvimento económico': ['desenvolvimento económico', 'emprego', 'economia', 'negócio', 'comercial', 'oportunidades'],
            'cultura': ['cultura', 'cultural', 'arte', 'evento cultural', 'teatro', 'artístico', 'arte local'],
            'tecnologia': ['tecnologia', 'tecnológico', 'sistema', 'digital', 'computador', 'informática', 'modernizar sistemas'],
            'energia e água': ['energia', 'água', 'eletricidade', 'abastecimento de água', 'saneamento', 'iluminação pública']
          };
          
          // Verificar se o setor tem palavras-chave específicas
          const keywords = sectorKeywords[sectorName] || [sectorName];
          
          // Filtrar baseado no conteúdo da manifestação com lógica mais precisa
          let matches = false;
          
          // Priorizar departamento_responsavel se estiver preenchido
          if (departamento) {
            const departamentoMatch = keywords.some(keyword => 
              departamento.includes(keyword)
            );
            if (departamentoMatch) {
              matches = true;
            }
          }
          
          // Se não encontrou no departamento, verificar assunto e descrição
          if (!matches) {
            // Verificar se o assunto contém palavras-chave específicas
            const assuntoMatch = keywords.some(keyword => 
              assunto.includes(keyword)
            );
            
            // Verificar se a descrição contém palavras-chave específicas
            const descricaoMatch = keywords.some(keyword => 
              descricao.includes(keyword)
            );
            
            matches = assuntoMatch || descricaoMatch;
          }
          
          if (matches) {
            console.log('Ouvidoria - Match encontrado:', {
              assunto,
              departamento,
              sectorName,
              keywords
            });
          }
          
          return matches;
        });
        
        console.log('Ouvidoria - Total filtrado:', filteredManifestacoes.length);
      }
      
      setManifestacoes(filteredManifestacoes);
      setError(null);
    } catch (err) {
      console.error('Error fetching manifestações:', err);
      setError('Erro ao carregar manifestações');
      toast({
        title: "Erro",
        description: "Erro ao carregar manifestações da ouvidoria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_ouvidoria_stats' as any);

      if (error) throw error;

      setStats(data as unknown as OuvidoriaStats);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const submitManifestacao = async (data: Partial<OuvidoriaItem>) => {
    setLoading(true);
    try {
      // Gerar protocolo único
      const timestamp = new Date().getTime();
      const protocolo = `OUV-${new Date().getFullYear()}-${String(timestamp).slice(-6)}`;

      const manifestacaoData = {
        protocolo,
        nome: data.nome || '',
        email: data.email || '',
        telefone: data.telefone || '',
        categoria: data.categoria || 'reclamacao',
        assunto: data.assunto || '',
        descricao: data.descricao || '',
        status: 'pendente',
        prioridade: 'media',
        anexos: data.anexos || []
      };

      const { data: newManifestacao, error } = await supabase
        .from('ouvidoria_manifestacoes' as any)
        .insert([manifestacaoData])
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      setManifestacoes(prev => [newManifestacao as unknown as OuvidoriaItem, ...prev]);
      
      // Atualizar estatísticas
      await fetchStats();
      
      setError(null);
      
      toast({
        title: "Manifestação Enviada!",
        description: "Sua manifestação foi enviada com sucesso. Protocolo: " + protocolo,
      });

      return { success: true, data: newManifestacao };
    } catch (err) {
      console.error('Error submitting manifestação:', err);
      setError('Erro ao enviar manifestação');
      toast({
        title: "Erro",
        description: "Erro ao enviar manifestação. Tente novamente.",
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const updateManifestacaoStatus = async (id: string, status: string, resposta?: string) => {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (resposta) {
        updateData.resposta = resposta;
        updateData.data_resposta = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('ouvidoria_manifestacoes' as any)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      setManifestacoes(prev => 
        prev.map(m => m.id === id ? data as unknown as OuvidoriaItem : m)
      );

      toast({
        title: "Status Atualizado",
        description: "Status da manifestação atualizado com sucesso",
      });

      return data;
    } catch (err) {
      console.error('Error updating manifestação:', err);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da manifestação",
        variant: "destructive"
      });
      throw err;
    }
  };

  const rateManifestacao = async (id: string, avaliacao: number, comentario?: string) => {
    try {
      const { data, error } = await supabase
        .from('ouvidoria_manifestacoes' as any)
        .update({
          avaliacao,
          comentario_avaliacao: comentario,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar lista local
      setManifestacoes(prev => 
        prev.map(m => m.id === id ? data as unknown as OuvidoriaItem : m)
      );

      toast({
        title: "Avaliação Enviada",
        description: "Obrigado pela sua avaliação!",
      });

      return data;
    } catch (err) {
      console.error('Error rating manifestação:', err);
      toast({
        title: "Erro",
        description: "Erro ao enviar avaliação",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteManifestacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ouvidoria_manifestacoes' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar lista local
      setManifestacoes(prev => prev.filter(m => m.id !== id));

      toast({
        title: "Manifestação Removida",
        description: "Manifestação removida com sucesso",
      });
    } catch (err) {
      console.error('Error deleting manifestação:', err);
      toast({
        title: "Erro",
        description: "Erro ao remover manifestação",
        variant: "destructive"
      });
      throw err;
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  return {
    categories,
    manifestacoes,
    stats,
    loading,
    error,
    fetchCategories,
    fetchManifestacoes,
    fetchStats,
    submitManifestacao,
    updateManifestacaoStatus,
    rateManifestacao,
    deleteManifestacao
  };
}