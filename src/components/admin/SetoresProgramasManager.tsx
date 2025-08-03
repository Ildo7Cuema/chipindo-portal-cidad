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
  BookOpenIcon,
  CheckCircleIcon,
  UsersIcon
} from 'lucide-react';
import { useSetoresProgramas } from '@/hooks/useSetoresProgramas';
import { useToast } from '@/hooks/use-toast';
import { ProgramaSetor } from '@/hooks/useSetoresEstrategicos';

interface SetoresProgramasManagerProps {
  setorId: string;
  setorNome: string;
}

export const SetoresProgramasManager = ({ setorId, setorNome }: SetoresProgramasManagerProps) => {
  const { programas, loading, error, createPrograma, updatePrograma, deletePrograma } = useSetoresProgramas(setorId);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrograma, setEditingPrograma] = useState<ProgramaSetor | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    beneficios: [] as string[],
    requisitos: [] as string[],
    contacto: '',
    ativo: true,
    ordem: 0
  });
  const [beneficioInput, setBeneficioInput] = useState('');
  const [requisitoInput, setRequisitoInput] = useState('');

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      beneficios: [],
      requisitos: [],
      contacto: '',
      ativo: true,
      ordem: 0
    });
    setBeneficioInput('');
    setRequisitoInput('');
    setEditingPrograma(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const programaData = {
        setor_id: setorId,
        ...formData
      };

      if (editingPrograma) {
        await updatePrograma(editingPrograma.id, programaData);
        toast({
          title: "Programa actualizado",
          description: "O programa foi actualizado com sucesso.",
        });
      } else {
        await createPrograma(programaData);
        toast({
          title: "Programa criado",
          description: "O programa foi criado com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o programa.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (programa: ProgramaSetor) => {
    setEditingPrograma(programa);
    setFormData({
      titulo: programa.titulo,
      descricao: programa.descricao,
      beneficios: programa.beneficios || [],
      requisitos: programa.requisitos || [],
      contacto: programa.contacto,
      ativo: programa.ativo,
      ordem: programa.ordem
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este programa?')) {
      try {
        await deletePrograma(id);
        toast({
          title: "Programa excluído",
          description: "O programa foi excluído com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o programa.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewPrograma = () => {
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
          <p className="text-red-600">Erro ao carregar programas: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Programas do Sector</h3>
          <p className="text-muted-foreground">
            Gerencie os programas do sector {setorNome}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPrograma}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Programa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPrograma ? 'Editar Programa' : 'Novo Programa'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Programa de Bolsas de Estudo"
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
                  placeholder="Descrição detalhada do programa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contacto">Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  placeholder="Ex: email@exemplo.com ou telefone"
                  required
                />
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
                  {editingPrograma ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programas.map((programa) => (
          <Card key={programa.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpenIcon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{programa.titulo}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={programa.ativo ? "default" : "secondary"}>
                    {programa.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Ordem: {programa.ordem}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {programa.descricao}
              </p>
              
              <div className="space-y-2 mb-4">
                {programa.beneficios && programa.beneficios.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-green-600">Benefícios:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {programa.beneficios.slice(0, 2).map((beneficio, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {beneficio}
                        </Badge>
                      ))}
                      {programa.beneficios.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{programa.beneficios.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {programa.requisitos && programa.requisitos.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-blue-600">Requisitos:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {programa.requisitos.slice(0, 2).map((requisito, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {requisito}
                        </Badge>
                      ))}
                      {programa.requisitos.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{programa.requisitos.length - 2} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                <strong>Contacto:</strong> {programa.contacto}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(programa)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(programa.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpenIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum programa encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando o primeiro programa para este sector.
            </p>
            <Button onClick={handleNewPrograma}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeiro Programa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 