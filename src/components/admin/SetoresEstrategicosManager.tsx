import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  EyeIcon,
  BuildingIcon,
  UsersIcon,
  TrendingUpIcon,
  HeartHandshakeIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon
} from 'lucide-react';
import { useSetoresEstrategicos, SetorEstrategico } from '@/hooks/useSetoresEstrategicos';
import { useToast } from '@/hooks/use-toast';

export const SetoresEstrategicosManager = () => {
  const { setores, loading, error, createSetor, updateSetor, deleteSetor } = useSetoresEstrategicos();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSetor, setEditingSetor] = useState<SetorEstrategico | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    descricao: '',
    visao: '',
    missao: '',
    cor_primaria: '#3B82F6',
    cor_secundaria: '#1E40AF',
    icone: 'Building',
    ordem: 0,
    ativo: true
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      slug: '',
      descricao: '',
      visao: '',
      missao: '',
      cor_primaria: '#3B82F6',
      cor_secundaria: '#1E40AF',
      icone: 'Building',
      ordem: 0,
      ativo: true
    });
    setEditingSetor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSetor) {
        await updateSetor(editingSetor.id, formData);
        toast({
          title: "Setor actualizado",
          description: "O setor foi actualizado com sucesso.",
        });
      } else {
        await createSetor(formData);
        toast({
          title: "Setor criado",
          description: "O setor foi criado com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o setor.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (setor: SetorEstrategico) => {
    setEditingSetor(setor);
    setFormData({
      nome: setor.nome,
      slug: setor.slug,
      descricao: setor.descricao,
      visao: setor.visao,
      missao: setor.missao,
      cor_primaria: setor.cor_primaria,
      cor_secundaria: setor.cor_secundaria,
      icone: setor.icone,
      ordem: setor.ordem,
      ativo: setor.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este setor?')) {
      try {
        await deleteSetor(id);
        toast({
          title: "Setor excluído",
          description: "O setor foi excluído com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir o setor.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewSetor = () => {
    resetForm();
    setIsDialogOpen(true);
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
          <p className="text-red-600">Erro ao carregar setores: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Sectores Estratégicos</h2>
          <p className="text-muted-foreground">
            Gerencie os sectores estratégicos do município
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewSetor}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSetor ? 'Editar Setor' : 'Novo Setor'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="educacao"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="visao">Visão</Label>
                <Textarea
                  id="visao"
                  value={formData.visao}
                  onChange={(e) => setFormData({ ...formData, visao: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="missao">Missão</Label>
                <Textarea
                  id="missao"
                  value={formData.missao}
                  onChange={(e) => setFormData({ ...formData, missao: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <Input
                    id="cor_primaria"
                    type="color"
                    value={formData.cor_primaria}
                    onChange={(e) => setFormData({ ...formData, cor_primaria: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <Input
                    id="cor_secundaria"
                    type="color"
                    value={formData.cor_secundaria}
                    onChange={(e) => setFormData({ ...formData, cor_secundaria: e.target.value })}
                  />
                </div>
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
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">Ativo</Label>
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
                  {editingSetor ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setores.map((setor) => (
          <Card key={setor.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: setor.cor_primaria }}
                  >
                    <BuildingIcon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">{setor.nome}</CardTitle>
                </div>
                <Badge variant={setor.ativo ? "default" : "secondary"}>
                  {setor.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {setor.descricao.substring(0, 100)}...
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Slug: {setor.slug}</span>
                <span>Ordem: {setor.ordem}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(setor)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => window.open(`/${setor.slug}`, '_blank')}
                >
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(setor.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {setores.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BuildingIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum setor encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando o primeiro setor estratégico.
            </p>
            <Button onClick={handleNewSetor}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeiro Setor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 