import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { usePopulationHistory, PopulationRecord } from "@/hooks/usePopulationHistory";
import { 
  LoaderIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Calculator, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export function PopulationHistoryManager() {
  const {
    records,
    growthCalculation,
    loading,
    error,
    fetchRecords,
    fetchGrowthCalculation,
    addRecord,
    updateRecord,
    updateGrowthRateAutomatically,
    deleteRecord
  } = usePopulationHistory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PopulationRecord | null>(null);
  const [activeTab, setActiveTab] = useState("history");

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    population_count: 0,
    source: 'official',
    notes: ''
  });

  // Função para calcular campos derivados
  const calculateDerivedFields = (year: number, population_count: number) => {
    const area_total = 9532; // Área total fixa do município
    const density = population_count / area_total;
    
    // Calcular growth_rate baseado no registro anterior
    let growth_rate = 0;
    if (records && records.length > 0) {
      const previousRecord = records.find(r => r.year === year - 1);
      if (previousRecord) {
        growth_rate = ((population_count - previousRecord.population_count) / previousRecord.population_count) * 100;
      }
    }
    
    return {
      growth_rate: Math.round(growth_rate * 100) / 100,
      area_total,
      density: Math.round(density * 100) / 100
    };
  };

  // Funções utilitárias locais
  const getLatestPopulation = () => {
    if (!records || records.length === 0) return 0;
    return records[0].population_count;
  };

  const getPopulationChange = () => {
    if (!records || records.length < 2) return 0;
    return records[0].population_count - records[1].population_count;
  };

  const getPopulationTrend = () => {
    if (!records || records.length < 2) return 'stable';
    const change = getPopulationChange();
    if (change > 0) return 'increasing';
    if (change < 0) return 'decreasing';
    return 'stable';
  };

  const currentGrowthRate = growthCalculation?.growth_rate || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!formData.year || !formData.population_count || !formData.source) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    // Validação de valores mínimos
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 10) {
      toast.error("Ano deve estar entre 1900 e " + (new Date().getFullYear() + 10));
      return;
    }
    
    if (formData.population_count <= 0) {
      toast.error("População deve ser maior que zero");
      return;
    }
    
    try {
      if (editingRecord) {
        // Calcular campos derivados para atualização
        const derivedFields = calculateDerivedFields(formData.year, formData.population_count);
        const updateData = {
          year: formData.year,
          population_count: formData.population_count,
          source: formData.source,
          notes: formData.notes,
          ...derivedFields
        };
        
        const result = await updateRecord(editingRecord.id, updateData);
        
        if (result && result.success) {
          toast.success("Registo populacional atualizado com sucesso!");
        } else {
          toast.error("Erro ao atualizar registo populacional");
          return;
        }
      } else {
        // Calcular campos derivados para novo registro
        const derivedFields = calculateDerivedFields(formData.year, formData.population_count);
        const newRecord = {
          ...formData,
          ...derivedFields
        };
        
        console.log('Tentando adicionar novo registro:', newRecord);
        
        const result = await addRecord([newRecord]);
        console.log('Resultado da adição:', result);
        
        if (result && result.success) {
          toast.success("Registo populacional adicionado com sucesso!");
        } else {
          toast.error("Erro ao adicionar registo populacional");
          return;
        }
      }
      
      setIsDialogOpen(false);
      setEditingRecord(null);
      setFormData({
        year: new Date().getFullYear(),
        population_count: 0,
        source: 'official',
        notes: ''
      });
    } catch (error) {
      toast.error("Erro ao salvar registo populacional");
    }
  };

  const handleEdit = (record: PopulationRecord) => {
    setEditingRecord(record);
    setFormData({
      year: record.year,
      population_count: record.population_count,
      source: record.source,
      notes: record.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este registo?")) {
      try {
        await deleteRecord(id);
        toast.success("Registo eliminado com sucesso!");
      } catch (error) {
        toast.error("Erro ao eliminar registo");
      }
    }
  };

  const handleAutoUpdate = async () => {
    try {
      const result = await updateGrowthRateAutomatically();
      if (result && typeof result === 'object' && 'success' in result && (result as any).success) {
        toast.success("Taxa de crescimento atualizada automaticamente!");
      } else {
        toast.error("Não foi possível calcular a taxa automaticamente");
      }
    } catch (error) {
      toast.error("Erro ao actualizar taxa automaticamente");
    }
  };

  // Variáveis calculadas para uso no template

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando histórico populacional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Registos</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {records.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">População Atual</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {getLatestPopulation().toLocaleString('pt-AO') || 'N/A'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Taxa Atual</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {currentGrowthRate}%
                </p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Crescimento Total</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {getPopulationChange().toLocaleString('pt-AO')}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestão do Histórico Populacional
              </CardTitle>
              <CardDescription>
                Gerencie dados históricos de população e cálculos automáticos de crescimento.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAutoUpdate}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? (
                  <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Calculando...' : 'Actualizar Taxa'}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Registo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingRecord ? 'Editar Registo' : 'Adicionar Registo'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Ano</Label>
                        <Input
                          id="year"
                          type="number"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="population_count">População</Label>
                        <Input
                          id="population_count"
                          type="number"
                          value={formData.population_count}
                          onChange={(e) => setFormData({ ...formData, population_count: parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="source">Fonte</Label>
                      <Select
                        value={formData.source}
                        onValueChange={(value) => setFormData({ ...formData, source: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="official">Oficial</SelectItem>
                          <SelectItem value="estimate">Estimativa</SelectItem>
                          <SelectItem value="census">Censo</SelectItem>
                          <SelectItem value="survey">Inquérito</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Informações adicionais sobre este registo..."
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingRecord(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingRecord ? 'Actualizar' : 'Adicionar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="calculations">Cálculos</TabsTrigger>
              <TabsTrigger value="trends">Tendências</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-4">
              <div className="space-y-4">
                {records.map((record) => (
                  <Card key={record.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{record.year}</div>
                          <div className="text-sm text-muted-foreground">Ano</div>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div>
                          <div className="text-xl font-semibold">
                            {record.population_count.toLocaleString('pt-AO')}
                          </div>
                          <div className="text-sm text-muted-foreground">Habitantes</div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {record.source}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {record.notes && (
                          <div className="text-sm text-muted-foreground max-w-xs truncate">
                            {record.notes}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calculations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Cálculos de Crescimento
                  </CardTitle>
                  <CardDescription>
                    Análise detalhada das taxas de crescimento populacional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Growth Rate */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Taxa Atual</p>
                            <p className="text-2xl font-bold">
                              {currentGrowthRate}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Última atualização: {new Date().toLocaleDateString('pt-AO')}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Crescimento Total</p>
                            <p className="text-2xl font-bold">
                              {getPopulationChange().toLocaleString('pt-AO')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {records.length} registos
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Growth Details */}
                    {records && records.length >= 2 && (
                      <Card className="p-4">
                        <h4 className="font-semibold mb-3">Detalhes do Cálculo</h4>
                        <div className="grid gap-3 text-sm">
                          <div className="flex justify-between">
                            <span>População {records[1].year}:</span>
                            <span className="font-medium">
                              {records[1].population_count.toLocaleString('pt-AO')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>População {records[0].year}:</span>
                            <span className="font-medium">
                              {records[0].population_count.toLocaleString('pt-AO')}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Diferença:</span>
                            <span>
                              {getPopulationChange().toLocaleString('pt-AO')}
                            </span>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendência Populacional
                  </CardTitle>
                  <CardDescription>
                    Evolução da população ao longo dos anos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {records && records.length > 0 ? (
                      records.map((record, index) => {
                        const firstRecord = records[0];
                        const lastRecord = records[records.length - 1];
                        const percentage = lastRecord.population_count !== firstRecord.population_count 
                          ? ((record.population_count - firstRecord.population_count) / (lastRecord.population_count - firstRecord.population_count)) * 100
                          : 0;
                        
                        return (
                          <div key={record.id} className="flex items-center gap-4">
                            <div className="w-16 text-sm font-medium">{record.year}</div>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.max(0, Math.min(100, percentage))}%` 
                                }}
                              />
                            </div>
                            <div className="w-24 text-sm text-right">
                              {record.population_count.toLocaleString('pt-AO')}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {record.source}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum registo populacional encontrado
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 