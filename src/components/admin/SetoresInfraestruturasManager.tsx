import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  BuildingIcon,
  MapPinIcon,
  SettingsIcon
} from 'lucide-react';
import { useSetoresInfraestruturas } from '@/hooks/useSetoresInfraestruturas';
import { useToast } from '@/hooks/use-toast';
import { InfraestruturaSetor } from '@/hooks/useSetoresEstrategicos';

interface SetoresInfraestruturasManagerProps {
  setorId: string;
  setorNome: string;
}

export const SetoresInfraestruturasManager = ({ setorId, setorNome }: SetoresInfraestruturasManagerProps) => {
  const { infraestruturas, loading, error, createInfraestrutura, updateInfraestrutura, deleteInfraestrutura } = useSetoresInfraestruturas(setorId);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInfraestrutura, setEditingInfraestrutura] = useState<InfraestruturaSetor | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    localizacao: '',
    capacidade: '',
    estado: '',
    equipamentos: [] as string[],
    ativo: true,
    ordem: 0
  });
  const [equipamentoInput, setEquipamentoInput] = useState('');

  const resetForm = () => {
    setFormData({
      nome: '',
      localizacao: '',
      capacidade: '',
      estado: '',
      equipamentos: [],
      ativo: true,
      ordem: 0
    });
    setEquipamentoInput('');
    setEditingInfraestrutura(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const infraestruturaData = {
        setor_id: setorId,
        ...formData
      };

      if (editingInfraestrutura) {
        await updateInfraestrutura(editingInfraestrutura.id, infraestruturaData);
        toast({
          title: "Infraestrutura actualizada",
          description: "A infraestrutura foi actualizada com sucesso.",
        });
      } else {
        await createInfraestrutura(infraestruturaData);
        toast({
          title: "Infraestrutura criada",
          description: "A infraestrutura foi criada com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a infraestrutura.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (infraestrutura: InfraestruturaSetor) => {
    setEditingInfraestrutura(infraestrutura);
    setFormData({
      nome: infraestrutura.nome,
      localizacao: infraestrutura.localizacao,
      capacidade: infraestrutura.capacidade,
      estado: infraestrutura.estado,
      equipamentos: infraestrutura.equipamentos || [],
      ativo: infraestrutura.ativo,
      ordem: infraestrutura.ordem
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta infraestrutura?')) {
      try {
        await deleteInfraestrutura(id);
        toast({
          title: "Infraestrutura excluída",
          description: "A infraestrutura foi excluída com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir a infraestrutura.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewInfraestrutura = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const addEquipamento = () => {
    if (equipamentoInput.trim()) {
      setFormData({
        ...formData,
        equipamentos: [...formData.equipamentos, equipamentoInput.trim()]
      });
      setEquipamentoInput('');
    }
  };

  const removeEquipamento = (index: number) => {
    setFormData({
      ...formData,
      equipamentos: formData.equipamentos.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Erro ao carregar infraestruturas: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Infraestruturas do Sector</h3>
          <p className="text-muted-foreground">
            Gerencie as infraestruturas do sector {setorNome}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewInfraestrutura}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nova Infraestrutura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInfraestrutura ? 'Editar Infraestrutura' : 'Nova Infraestrutura'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Escola Primária Central"
                  required
                />
              </div>

              <div>
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  placeholder="Ex: Rua Principal, nº 123"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacidade">Capacidade</Label>
                  <Input
                    id="capacidade"
                    value={formData.capacidade}
                    onChange={(e) => setFormData({ ...formData, capacidade: e.target.value })}
                    placeholder="Ex: 500 estudantes"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    placeholder="Ex: Funcionando"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Equipamentos</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={equipamentoInput}
                      onChange={(e) => setEquipamentoInput(e.target.value)}
                      placeholder="Adicionar equipamento"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipamento())}
                    />
                    <Button type="button" onClick={addEquipamento} size="sm">
                      +
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.equipamentos.map((equipamento, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <SettingsIcon className="w-4 h-4 text-blue-600" />
                        <span className="flex-1 text-sm">{equipamento}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEquipamento(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingInfraestrutura ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infraestruturas.map((infraestrutura) => (
          <Card key={infraestrutura.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BuildingIcon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{infraestrutura.nome}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={infraestrutura.ativo ? "default" : "secondary"}>
                    {infraestrutura.ativo ? "Ativa" : "Inativa"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Ordem: {infraestrutura.ordem}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPinIcon className="w-4 h-4 text-red-600" />
                  <span><strong>Localização:</strong> {infraestrutura.localizacao}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BuildingIcon className="w-4 h-4 text-blue-600" />
                  <span><strong>Capacidade:</strong> {infraestrutura.capacidade}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <SettingsIcon className="w-4 h-4 text-green-600" />
                  <span><strong>Estado:</strong> {infraestrutura.estado}</span>
                </div>
              </div>
              
              {infraestrutura.equipamentos && infraestrutura.equipamentos.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-medium text-blue-600">Equipamentos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {infraestrutura.equipamentos.slice(0, 3).map((equipamento, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {equipamento}
                      </Badge>
                    ))}
                    {infraestrutura.equipamentos.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{infraestrutura.equipamentos.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(infraestrutura)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(infraestrutura.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {infraestruturas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BuildingIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma infraestrutura encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando a primeira infraestrutura para este sector.
            </p>
            <Button onClick={handleNewInfraestrutura}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeira Infraestrutura
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 