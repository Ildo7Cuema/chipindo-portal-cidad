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
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MunicipalityCharacterizationManager = () => {
  const [characterization, setCharacterization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
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

  const handleInputChange = (section: string, field: string, value: string) => {
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="geography">
            <MapPin className="w-4 h-4 mr-2" />
            Geografia
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demography">
          <Card>
            <CardHeader>
              <CardTitle>Demografia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>População</Label>
                  <Input
                    value={characterization?.demography?.population || ''}
                    onChange={(e) => handleInputChange('demography', 'population', e.target.value)}
                    disabled={!editing}
                  />
                </div>
                <div>
                  <Label>Densidade</Label>
                  <Input
                    value={characterization?.demography?.density || ''}
                    onChange={(e) => handleInputChange('demography', 'density', e.target.value)}
                    disabled={!editing}
                  />
                </div>
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