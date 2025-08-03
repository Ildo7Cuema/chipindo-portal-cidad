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
  BriefcaseIcon,
  CheckCircleIcon,
  UsersIcon,
  CalendarIcon
} from 'lucide-react';
import { useSetoresOportunidades } from '@/hooks/useSetoresOportunidades';
import { useToast } from '@/hooks/use-toast';
import { OportunidadeSetor } from '@/hooks/useSetoresEstrategicos';

interface SetoresOportunidadesManagerProps {
  setorId: string;
  setorNome: string;
}

export const SetoresOportunidadesManager = ({ setorId, setorNome }: SetoresOportunidadesManagerProps) => {
  const { oportunidades, loading, error, createOportunidade, updateOportunidade, deleteOportunidade } = useSetoresOportunidades(setorId);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOportunidade, setEditingOportunidade] = useState<OportunidadeSetor | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: [] as string[],
    beneficios: [] as string[],
    prazo: '',
    vagas: 1,
    ativo: true,
    ordem: 0
  });
  const [beneficioInput, setBeneficioInput] = useState('');
  const [requisitoInput, setRequisitoInput] = useState('');

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      requisitos: [],
      beneficios: [],
      prazo: '',
      vagas: 1,
      ativo: true,
      ordem: 0
    });
    setBeneficioInput('');
    setRequisitoInput('');
    setEditingOportunidade(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const oportunidadeData = {
        setor_id: setorId,
        ...formData
      };

      if (editingOportunidade) {
        await updateOportunidade(editingOportunidade.id, oportunidadeData);
        toast({
          title: "Oportunidade actualizada",
          description: "A oportunidade foi actualizada com sucesso.",
        });
      } else {
        await createOportunidade(oportunidadeData);
        toast({
          title: "Oportunidade criada",
          description: "A oportunidade foi criada com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a oportunidade.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (oportunidade: OportunidadeSetor) => {
    setEditingOportunidade(oportunidade);
    setFormData({
      titulo: oportunidade.titulo,
      descricao: oportunidade.descricao,
      requisitos: oportunidade.requisitos || [],
      beneficios: oportunidade.beneficios || [],
      prazo: oportunidade.prazo,
      vagas: oportunidade.vagas,
      ativo: oportunidade.ativo,
      ordem: oportunidade.ordem
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      try {
        await deleteOportunidade(id);
        toast({
          title: "Oportunidade excluída",
          description: "A oportunidade foi excluída com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir a oportunidade.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewOportunidade = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const addBeneficio = () => {
    if (beneficioInput.trim()) {
      setFormData({
        ...formData,
        beneficios: [...formData.beneficios, beneficioInput.trim()]
      });
      setBeneficioInput('');
    }
  };

  const removeBeneficio = (index: number) => {
    setFormData({
      ...formData,
      beneficios: formData.beneficios.filter((_, i) => i !== index)
    });
  };

  const addRequisito = () => {
    if (requisitoInput.trim()) {
      setFormData({
        ...formData,
        requisitos: [...formData.requisitos, requisitoInput.trim()]
      });
      setRequisitoInput('');
    }
  };

  const removeRequisito = (index: number) => {
    setFormData({
      ...formData,
      requisitos: formData.requisitos.filter((_, i) => i !== index)
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
          <p className="text-red-600">Erro ao carregar oportunidades: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Oportunidades do Sector</h3>
          <p className="text-muted-foreground">
            Gerencie as oportunidades do sector {setorNome}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewOportunidade}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nova Oportunidade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOportunidade ? 'Editar Oportunidade' : 'Nova Oportunidade'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Vaga para Professor"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  placeholder="Descrição detalhada da oportunidade"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prazo">Prazo</Label>
                  <Input
                    id="prazo"
                    value={formData.prazo}
                    onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                    placeholder="Ex: 31/12/2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vagas">Número de Vagas</Label>
                  <Input
                    id="vagas"
                    type="number"
                    value={formData.vagas}
                    onChange={(e) => setFormData({ ...formData, vagas: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Benefícios</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={beneficioInput}
                        onChange={(e) => setBeneficioInput(e.target.value)}
                        placeholder="Adicionar benefício"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBeneficio())}
                      />
                      <Button type="button" onClick={addBeneficio} size="sm">
                        +
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {formData.beneficios.map((beneficio, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          <span className="flex-1 text-sm">{beneficio}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBeneficio(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Requisitos</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={requisitoInput}
                        onChange={(e) => setRequisitoInput(e.target.value)}
                        placeholder="Adicionar requisito"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequisito())}
                      />
                      <Button type="button" onClick={addRequisito} size="sm">
                        +
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {formData.requisitos.map((requisito, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <UsersIcon className="w-4 h-4 text-blue-600" />
                          <span className="flex-1 text-sm">{requisito}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequisito(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
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
                  {editingOportunidade ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {oportunidades.map((oportunidade) => (
          <Card key={oportunidade.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BriefcaseIcon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{oportunidade.titulo}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={oportunidade.ativo ? "default" : "secondary"}>
                    {oportunidade.ativo ? "Ativa" : "Inativa"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Ordem: {oportunidade.ordem}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {oportunidade.descricao}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="w-4 h-4 text-orange-600" />
                  <span><strong>Prazo:</strong> {oportunidade.prazo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="w-4 h-4 text-blue-600" />
                  <span><strong>Vagas:</strong> {oportunidade.vagas}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {oportunidade.beneficios && oportunidade.beneficios.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-green-600">Benefícios:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {oportunidade.beneficios.slice(0, 2).map((beneficio, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {beneficio}
                        </Badge>
                      ))}
                      {oportunidade.beneficios.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{oportunidade.beneficios.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {oportunidade.requisitos && oportunidade.requisitos.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-600">Requisitos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {oportunidade.requisitos.slice(0, 2).map((requisito, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {requisito}
                        </Badge>
                      ))}
                      {oportunidade.requisitos.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{oportunidade.requisitos.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(oportunidade)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(oportunidade.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {oportunidades.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BriefcaseIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma oportunidade encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando a primeira oportunidade para este sector.
            </p>
            <Button onClick={handleNewOportunidade}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeira Oportunidade
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 