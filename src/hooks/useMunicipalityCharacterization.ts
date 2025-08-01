import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MunicipalityCharacterizationData {
  // Informações Geográficas
  geography: {
    area: string;
    altitude: string;
    climate: string;
    rainfall: string;
    temperature: string;
    boundaries: {
      north: string;
      south: string;
      east: string;
      west: string;
    };
    coordinates: {
      latitude: string;
      longitude: string;
    };
  };
  
  // Demografia
  demography: {
    population: string;
    density: string;
    growth: string;
    households: string;
    urbanRate: string;
  };
  
  // Infraestrutura
  infrastructure: {
    roads: string;
    schools: string;
    healthCenters: string;
    markets: string;
    waterSupply: string;
  };
  
  // Economia
  economy: {
    mainSectors: string[];
    gdp: string;
    employment: string;
    mainProducts: string[];
  };
  
  // Recursos Naturais
  naturalResources: {
    rivers: string[];
    forests: string;
    minerals: string[];
    wildlife: string;
  };
  
  // Cultura e Tradições
  culture: {
    ethnicGroups: string[];
    languages: string[];
    traditions: string;
    crafts: string;
  };
}

// Dados padrão de caracterização do município de Chipindo
const DEFAULT_CHARACTERIZATION: MunicipalityCharacterizationData = {
  geography: {
    area: "2.100 km²",
    altitude: "1.200 - 1.800 metros",
    climate: "Tropical de altitude",
    rainfall: "800 - 1.200 mm/ano",
    temperature: "15°C - 25°C",
    boundaries: {
      north: "Município de Caconda",
      south: "Município de Caluquembe",
      east: "Município de Quipungo",
      west: "Município de Cacula"
    },
    coordinates: {
      latitude: "13.8333° S",
      longitude: "14.1667° E"
    }
  },
  
  demography: {
    population: "159.000 habitantes",
    density: "76 hab/km²",
    growth: "2.3% ao ano",
    households: "26.500 famílias",
    urbanRate: "35%"
  },
  
  infrastructure: {
    roads: "500 km de estradas",
    schools: "45 escolas",
    healthCenters: "8 centros de saúde",
    markets: "12 mercados",
    waterSupply: "60% da população"
  },
  
  economy: {
    mainSectors: ["Agricultura", "Pecuária", "Comércio", "Serviços"],
    gdp: "Crescimento de 4.2%",
    employment: "85% da população ativa",
    mainProducts: ["Milho", "Feijão", "Café", "Gado bovino"]
  },
  
  naturalResources: {
    rivers: ["Rio Cunene", "Rio Caculuvar", "Rio Caculovar"],
    forests: "Floresta de miombo",
    minerals: ["Granito", "Mármore", "Areia"],
    wildlife: "Diversidade de fauna e flora"
  },
  
  culture: {
    ethnicGroups: ["Ovimbundu", "Nyaneka", "Herero"],
    languages: ["Umbundu", "Português"],
    traditions: "Festivais tradicionais",
    crafts: "Artesanato local"
  }
};

export const useMunicipalityCharacterization = () => {
  const [characterization, setCharacterization] = useState<MunicipalityCharacterizationData>(DEFAULT_CHARACTERIZATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCharacterization();
  }, []);

  const loadCharacterization = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar dados da base de dados
      const { data, error: dbError } = await supabase
        .from('municipality_characterization')
        .select('*')
        .limit(1)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        console.warn('Erro ao carregar caracterização da base de dados:', dbError);
        // Usar dados padrão se não conseguir carregar da base de dados
        setCharacterization(DEFAULT_CHARACTERIZATION);
      } else if (data) {
        // Converter dados da base de dados para o formato esperado
        let formattedData: MunicipalityCharacterizationData = {
          geography: {
            area: data.geography?.area || DEFAULT_CHARACTERIZATION.geography.area,
            altitude: data.geography?.altitude || DEFAULT_CHARACTERIZATION.geography.altitude,
            climate: data.geography?.climate || DEFAULT_CHARACTERIZATION.geography.climate,
            rainfall: data.geography?.rainfall || DEFAULT_CHARACTERIZATION.geography.rainfall,
            temperature: data.geography?.temperature || DEFAULT_CHARACTERIZATION.geography.temperature,
            boundaries: {
              north: data.geography?.boundaries?.north || DEFAULT_CHARACTERIZATION.geography.boundaries.north,
              south: data.geography?.boundaries?.south || DEFAULT_CHARACTERIZATION.geography.boundaries.south,
              east: data.geography?.boundaries?.east || DEFAULT_CHARACTERIZATION.geography.boundaries.east,
              west: data.geography?.boundaries?.west || DEFAULT_CHARACTERIZATION.geography.boundaries.west
            },
            coordinates: {
              latitude: data.geography?.coordinates?.latitude || DEFAULT_CHARACTERIZATION.geography.coordinates.latitude,
              longitude: data.geography?.coordinates?.longitude || DEFAULT_CHARACTERIZATION.geography.coordinates.longitude
            }
          },
          demography: {
            population: data.demography?.population || DEFAULT_CHARACTERIZATION.demography.population,
            density: data.demography?.density || DEFAULT_CHARACTERIZATION.demography.density,
            growth: data.demography?.growth || DEFAULT_CHARACTERIZATION.demography.growth,
            households: data.demography?.households || DEFAULT_CHARACTERIZATION.demography.households,
            urbanRate: data.demography?.urbanRate || DEFAULT_CHARACTERIZATION.demography.urbanRate
          },
          infrastructure: {
            roads: data.infrastructure?.roads || DEFAULT_CHARACTERIZATION.infrastructure.roads,
            schools: data.infrastructure?.schools || DEFAULT_CHARACTERIZATION.infrastructure.schools,
            healthCenters: data.infrastructure?.healthCenters || DEFAULT_CHARACTERIZATION.infrastructure.healthCenters,
            markets: data.infrastructure?.markets || DEFAULT_CHARACTERIZATION.infrastructure.markets,
            waterSupply: data.infrastructure?.waterSupply || DEFAULT_CHARACTERIZATION.infrastructure.waterSupply
          },
          economy: {
            mainSectors: data.economy?.mainSectors || DEFAULT_CHARACTERIZATION.economy.mainSectors,
            gdp: data.economy?.gdp || DEFAULT_CHARACTERIZATION.economy.gdp,
            employment: data.economy?.employment || DEFAULT_CHARACTERIZATION.economy.employment,
            mainProducts: data.economy?.mainProducts || DEFAULT_CHARACTERIZATION.economy.mainProducts
          },
          naturalResources: {
            rivers: data.naturalResources?.rivers || DEFAULT_CHARACTERIZATION.naturalResources.rivers,
            forests: data.naturalResources?.forests || DEFAULT_CHARACTERIZATION.naturalResources.forests,
            minerals: data.naturalResources?.minerals || DEFAULT_CHARACTERIZATION.naturalResources.minerals,
            wildlife: data.naturalResources?.wildlife || DEFAULT_CHARACTERIZATION.naturalResources.wildlife
          },
          culture: {
            ethnicGroups: data.culture?.ethnicGroups || DEFAULT_CHARACTERIZATION.culture.ethnicGroups,
            languages: data.culture?.languages || DEFAULT_CHARACTERIZATION.culture.languages,
            traditions: data.culture?.traditions || DEFAULT_CHARACTERIZATION.culture.traditions,
            crafts: data.culture?.crafts || DEFAULT_CHARACTERIZATION.culture.crafts
          }
        };

        // Sincronizar dados demográficos com population_history
        try {
          const { data: populationData, error: populationError } = await supabase
            .from('population_history')
            .select('*')
            .order('year', { ascending: false })
            .limit(1)
            .single();

          if (!populationError && populationData) {
            const currentYear = new Date().getFullYear();
            const currentPopulation = populationData.population_count;
            
            // Calcular densidade baseada na população atual e área
            const areaKm2 = 2100; // Área do município em km²
            const density = (currentPopulation / areaKm2).toFixed(1);
            
            // Calcular taxa de crescimento se houver dados do ano anterior
            const { data: previousYearData } = await supabase
              .from('population_history')
              .select('population_count')
              .eq('year', currentYear - 1)
              .single();

            let growthRate = "2.3% ao ano"; // Valor padrão
            if (previousYearData && previousYearData.population_count > 0) {
              const growth = ((currentPopulation - previousYearData.population_count) / previousYearData.population_count) * 100;
              growthRate = `${growth.toFixed(1)}% ao ano`;
            }

            // Atualizar dados demográficos com informações sincronizadas
            formattedData.demography = {
              ...formattedData.demography,
              population: `${currentPopulation.toLocaleString('pt-AO')} habitantes`,
              density: `${density} hab/km²`,
              growth: growthRate
            };
          }
        } catch (populationError) {
          console.warn('Erro ao sincronizar dados populacionais:', populationError);
          // Continuar com os dados originais se não conseguir sincronizar
        }

        setCharacterization(formattedData);
      } else {
        // Usar dados padrão se não houver dados na base de dados
        setCharacterization(DEFAULT_CHARACTERIZATION);
      }
    } catch (err) {
      console.error('Erro ao carregar caracterização do município:', err);
      setError('Erro ao carregar dados de caracterização');
      setCharacterization(DEFAULT_CHARACTERIZATION);
    } finally {
      setLoading(false);
    }
  };

  const updateCharacterization = async (newData: Partial<MunicipalityCharacterizationData>) => {
    try {
      setLoading(true);
      setError(null);

      // Atualizar estado local
      setCharacterization(prev => ({ ...prev, ...newData }));

      // Tentar salvar na base de dados
      const { error: dbError } = await supabase
        .from('municipality_characterization')
        .upsert([newData], { onConflict: 'id' });

      if (dbError) {
        console.warn('Erro ao salvar caracterização na base de dados:', dbError);
        // Não reverter o estado local, apenas logar o erro
      }

      return true;
    } catch (err) {
      console.error('Erro ao actualizar caracterização:', err);
      setError('Erro ao actualizar dados de caracterização');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setCharacterization(DEFAULT_CHARACTERIZATION);
  };

  return {
    characterization,
    loading,
    error,
    updateCharacterization,
    resetToDefaults,
    refreshData: loadCharacterization
  };
}; 