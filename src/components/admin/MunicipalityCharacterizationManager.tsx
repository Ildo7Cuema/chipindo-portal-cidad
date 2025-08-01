import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Users, 
  Building2, 
  TreePine, 
  Globe, 
  Save, 
  RefreshCw, 
  Edit,
  Plus,
  Trash2,
  Navigation,
  Compass,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MunicipalityCharacterizationManager = () => {
  const [characterization, setCharacterization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCharacterization();
  }, []);

  const loadCharacterization = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('municipality_characterization')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCharacterization(data);
      }
    } catch (error) {
      console.error('Erro ao carregar caracterização:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar a caracterização do município",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncDemographicData = async () => {
    try {
      setSyncing(true);
      
      // Buscar dados populacionais atualizados
      const { data: populationData, error: populationError } = await supabase
        .from('population_history')
        .select('*')
        .order('year', { ascending: false })
        .limit(1)
        .single();

      if (populationError) {
        throw new Error('Erro ao buscar dados populacionais');
      }

      if (populationData) {
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

        // Atualizar dados demográficos
        const updatedDemography = {
          population: `${currentPopulation.toLocaleString('pt-AO')} habitantes`,
          density: `${density} hab/km²`,
          growth: growthRate,
          households: characterization?.demography?.households || "26.500 famílias",
          urbanRate: characterization?.demography?.urbanRate || "35%"
        };

        setCharacterization(prev => ({
          ...prev,
          demography: updatedDemography
        }));

        toast({
          title: "Dados sincronizados",
          description: "Informações demográficas atualizadas com dados populacionais recentes"
        });
      }
    } catch (error) {
      console.error('Erro ao sincronizar dados demográficos:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os dados demográficos",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('municipality_characterization')
        .upsert([characterization], { onConflict: 'id' });

      if (error) {
        throw error;
      }

      setEditing(false);
      
      toast({
        title: "Caracterização atualizada",
        description: "Os dados foram salvos com sucesso"
      });
    } catch (error) {
      console.error('Erro ao salvar caracterização:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setCharacterization(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayAdd = (section: string, field: string) => {
    const newItem = prompt(`Adicionar novo ${field}:`);
    if (newItem && newItem.trim()) {
      setCharacterization(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...(prev[section][field] || []), newItem.trim()]
        }
      }));
    }
  };

  const handleArrayRemove = (section: string, field: string, index: number) => {
    setCharacterization(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando caracterização...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Caracterização do Município</h2>
          <p className="text-muted-foreground">
            Gerir informações sobre Chipindo
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={syncDemographicData} 
            disabled={syncing}
            variant="outline"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-2" />
            )}
            Sincronizar Demografia
          </Button>
          {editing ? (
            <>
              <Button onClick={() => setEditing(false)} variant="outline">
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="geography" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="geography">
            <MapPin className="w-4 h-4 mr-2" />
            Geografia
          </TabsTrigger>
          <TabsTrigger value="boundaries">
            <Navigation className="w-4 h-4 mr-2" />
            Delimitações
          </TabsTrigger>
          <TabsTrigger value="coordinates">
            <Compass className="w-4 h-4 mr-2" />
            Coordenadas
          </TabsTrigger>
          <TabsTrigger value="demography">
            <Users className="w-4 h-4 mr-2" />
            Demografia
          </TabsTrigger>
          <TabsTrigger value="infrastructure">
            <Building2 className="w-4 h-4 mr-2" />
            Infraestrutura
          </TabsTrigger>
          <TabsTrigger value="economy">
            <Globe className="w-4 h-4 mr-2" />
            Economia
          </TabsTrigger>
          <TabsTrigger value="naturalResources">
            <TreePine className="w-4 h-4 mr-2" />
            Recursos
          </TabsTrigger>
          <TabsTrigger value="culture">
            <Globe className="w-4 h-4 mr-2" />
            Cultura
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Geografia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Área Total</Label>
                  <Input
                    value={characterization?.geography?.area || ''}
                    onChange={(e) => handleInputChange('geography', 'area', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Altitude</Label>
                  <Input
                    value={characterization?.geography?.altitude || ''}
                    onChange={(e) => handleInputChange('geography', 'altitude', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Clima</Label>
                  <Input
                    value={characterization?.geography?.climate || ''}
                    onChange={(e) => handleInputChange('geography', 'climate', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Temperatura</Label>
                  <Input
                    value={characterization?.geography?.temperature || ''}
                    onChange={(e) => handleInputChange('geography', 'temperature', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Precipitação</Label>
                  <Input
                    value={characterization?.geography?.rainfall || ''}
                    onChange={(e) => handleInputChange('geography', 'rainfall', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boundaries">
          <Card>
            <CardHeader>
              <CardTitle>Delimitações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Norte</Label>
                  <Input
                    value={characterization?.geography?.boundaries?.north || ''}
                    onChange={(e) => handleInputChange('geography', 'boundaries', {
                      ...characterization?.geography?.boundaries,
                      north: e.target.value
                    })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Sul</Label>
                  <Input
                    value={characterization?.geography?.boundaries?.south || ''}
                    onChange={(e) => handleInputChange('geography', 'boundaries', {
                      ...characterization?.geography?.boundaries,
                      south: e.target.value
                    })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Este</Label>
                  <Input
                    value={characterization?.geography?.boundaries?.east || ''}
                    onChange={(e) => handleInputChange('geography', 'boundaries', {
                      ...characterization?.geography?.boundaries,
                      east: e.target.value
                    })}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Oeste</Label>
                  <Input
                    value={characterization?.geography?.boundaries?.west || ''}
                    onChange={(e) => handleInputChange('geography', 'boundaries', {
                      ...characterization?.geography?.boundaries,
                      west: e.target.value
                    })}
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coordinates">
          <Card>
            <CardHeader>
              <CardTitle>Coordenadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input
                    value={characterization?.geography?.coordinates?.latitude || ''}
                    onChange={(e) => handleInputChange('geography', 'coordinates', {
                      ...characterization?.geography?.coordinates,
                      latitude: e.target.value
                    })}
                    disabled={!editing}
                    placeholder="Ex: 13.8333° S"
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    value={characterization?.geography?.coordinates?.longitude || ''}
                    onChange={(e) => handleInputChange('geography', 'coordinates', {
                      ...characterization?.geography?.coordinates,
                      longitude: e.target.value
                    })}
                    disabled={!editing}
                    placeholder="Ex: 14.1667° E"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demography">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Demografia
                <Badge variant="secondary" className="text-xs">
                  Sincronizado com dados populacionais
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>População</Label>
                  <Input
                    value={characterization?.demography?.population || ''}
                    onChange={(e) => handleInputChange('demography', 'population', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 159.000 habitantes"
                  />
                </div>
                <div>
                  <Label>Densidade</Label>
                  <Input
                    value={characterization?.demography?.density || ''}
                    onChange={(e) => handleInputChange('demography', 'density', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 76 hab/km²"
                  />
                </div>
                <div>
                  <Label>Crescimento</Label>
                  <Input
                    value={characterization?.demography?.growth || ''}
                    onChange={(e) => handleInputChange('demography', 'growth', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 2.3% ao ano"
                  />
                </div>
                <div>
                  <Label>Famílias</Label>
                  <Input
                    value={characterization?.demography?.households || ''}
                    onChange={(e) => handleInputChange('demography', 'households', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 26.500 famílias"
                  />
                </div>
                <div>
                  <Label>Taxa Urbana</Label>
                  <Input
                    value={characterization?.demography?.urbanRate || ''}
                    onChange={(e) => handleInputChange('demography', 'urbanRate', e.target.value)}
                    disabled={!editing}
                    placeholder="Ex: 35%"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <p><strong>Nota:</strong> Os dados de população, densidade e crescimento são automaticamente sincronizados com a tabela de histórico populacional para garantir consistência com a seção de Informações Demográficas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure">
          <Card>
            <CardHeader>
              <CardTitle>Infraestrutura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estradas</Label>
                  <Input
                    value={characterization?.infrastructure?.roads || ''}
                    onChange={(e) => handleInputChange('infrastructure', 'roads', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Escolas</Label>
                  <Input
                    value={characterization?.infrastructure?.schools || ''}
                    onChange={(e) => handleInputChange('infrastructure', 'schools', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economy">
          <Card>
            <CardHeader>
              <CardTitle>Economia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>PIB</Label>
                  <Input
                    value={characterization?.economy?.gdp || ''}
                    onChange={(e) => handleInputChange('economy', 'gdp', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Emprego</Label>
                  <Input
                    value={characterization?.economy?.employment || ''}
                    onChange={(e) => handleInputChange('economy', 'employment', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Sectores Principais</Label>
                  {editing && (
                    <Button size="sm" onClick={() => handleArrayAdd('economy', 'mainSectors')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {characterization?.economy?.mainSectors?.map((sector: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {sector}
                      {editing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArrayRemove('economy', 'mainSectors', index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="naturalResources">
          <Card>
            <CardHeader>
              <CardTitle>Recursos Naturais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Floresta</Label>
                  <Input
                    value={characterization?.natural_resources?.forests || ''}
                    onChange={(e) => handleInputChange('natural_resources', 'forests', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Fauna e Flora</Label>
                  <Input
                    value={characterization?.natural_resources?.wildlife || ''}
                    onChange={(e) => handleInputChange('natural_resources', 'wildlife', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Principais Rios</Label>
                  {editing && (
                    <Button size="sm" onClick={() => handleArrayAdd('natural_resources', 'rivers')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {characterization?.natural_resources?.rivers?.map((river: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {river}
                      {editing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArrayRemove('natural_resources', 'rivers', index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="culture">
          <Card>
            <CardHeader>
              <CardTitle>Cultura e Tradições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tradições</Label>
                  <Input
                    value={characterization?.culture?.traditions || ''}
                    onChange={(e) => handleInputChange('culture', 'traditions', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Artesanato</Label>
                  <Input
                    value={characterization?.culture?.crafts || ''}
                    onChange={(e) => handleInputChange('culture', 'crafts', e.target.value)}
                    disabled={!editing}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Grupos Étnicos</Label>
                  {editing && (
                    <Button size="sm" onClick={() => handleArrayAdd('culture', 'ethnicGroups')}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {characterization?.culture?.ethnicGroups?.map((group: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {group}
                      {editing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArrayRemove('culture', 'ethnicGroups', index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 