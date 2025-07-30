import { useState, useEffect } from 'react';

interface SetorStats {
  visitas: number;
  tempoMedio: number;
  satisfacao: number;
  ultimaAtualizacao: Date;
}

interface UseSetorStatsProps {
  setorSlug: string;
}

export const useSetorStats = ({ setorSlug }: UseSetorStatsProps) => {
  const [stats, setStats] = useState<SetorStats>({
    visitas: 0,
    tempoMedio: 0,
    satisfacao: 0,
    ultimaAtualizacao: new Date()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gerar dados simulados baseados no setor
        const baseStats = {
          educacao: { visitas: 1247, tempoMedio: 4.2, satisfacao: 92 },
          saude: { visitas: 2156, tempoMedio: 3.8, satisfacao: 89 },
          agricultura: { visitas: 892, tempoMedio: 5.1, satisfacao: 94 },
          'sector-mineiro': { visitas: 1567, tempoMedio: 4.7, satisfacao: 87 },
          'desenvolvimento-economico': { visitas: 2034, tempoMedio: 4.0, satisfacao: 91 },
          cultura: { visitas: 678, tempoMedio: 6.2, satisfacao: 96 },
          tecnologia: { visitas: 1345, tempoMedio: 3.5, satisfacao: 88 },
          'energia-agua': { visitas: 1123, tempoMedio: 4.8, satisfacao: 90 }
        };
        
        const setorStats = baseStats[setorSlug as keyof typeof baseStats] || {
          visitas: 1000,
          tempoMedio: 4.0,
          satisfacao: 85
        };
        
        // Adicionar variação aleatória para simular dados em tempo real
        const variation = 0.1; // 10% de variação
        const randomVariation = (base: number) => {
          const min = base * (1 - variation);
          const max = base * (1 + variation);
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        
        setStats({
          visitas: randomVariation(setorStats.visitas),
          tempoMedio: Number((setorStats.tempoMedio + (Math.random() - 0.5) * 0.5).toFixed(1)),
          satisfacao: randomVariation(setorStats.satisfacao),
          ultimaAtualizacao: new Date()
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    
    return () => clearInterval(interval);
  }, [setorSlug]);

  return { stats, loading };
}; 