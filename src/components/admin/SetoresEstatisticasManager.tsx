import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  TrendingUpIcon,
  BarChart3Icon
} from 'lucide-react';
import { useSetoresEstatisticas } from '@/hooks/useSetoresEstatisticas';
import { useToast } from '@/hooks/use-toast';
import { EstatisticaSetor } from '@/hooks/useSetoresEstrategicos';

interface SetoresEstatisticasManagerProps {
  setorId: string;
  setorNome: string;
}

export const SetoresEstatisticasManager = ({ setorId, setorNome }: SetoresEstatisticasManagerProps) => {
  const { estatisticas, loading, error, createEstatistica, updateEstatistica, deleteEstatistica } = useSetoresEstatisticas(setorId);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEstatistica, setEditingEstatistica] = useState<EstatisticaSetor | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    icone: 'TrendingUp',
    ordem: 0
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      valor: '',
      icone: 'TrendingUp',
      ordem: 0
    });
    setEditingEstatistica(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const estatisticaData = {
        setor_id: setorId,
        ...formData
      };

      if (editingEstatistica) {
        await updateEstatistica(editingEstatistica.id, estatisticaData);
        toast({
          title: "Estatística actualizada",
          description: "A estatística foi actualizada com sucesso.",
        });
      } else {
        await createEstatistica(estatisticaData);
        toast({
          title: "Estatística criada",
          description: "A estatística foi criada com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a estatística.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (estatistica: EstatisticaSetor) => {
    setEditingEstatistica(estatistica);
    setFormData({
      nome: estatistica.nome,
      valor: estatistica.valor,
      icone: estatistica.icone,
      ordem: estatistica.ordem
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta estatística?')) {
      try {
        await deleteEstatistica(id);
        toast({
          title: "Estatística excluída",
          description: "A estatística foi excluída com sucesso.",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao excluir a estatística.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewEstatistica = () => {
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
          <p className="text-red-600">Erro ao carregar estatísticas: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Estatísticas do Sector</h3>
          <p className="text-muted-foreground">
            Gerencie as estatísticas do sector {setorNome}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewEstatistica}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Nova Estatística
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingEstatistica ? 'Editar Estatística' : 'Nova Estatística'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Número de escolas"
                  required
                />
              </div>

              <div>
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="Ex: 12 escolas"
                  required
                />
              </div>

              <div>
                <Label htmlFor="icone">Ícone</Label>
                <Input
                  id="icone"
                  value={formData.icone}
                  onChange={(e) => setFormData({ ...formData, icone: e.target.value })}
                  placeholder="TrendingUp"
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

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingEstatistica ? 'Actualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {estatisticas.map((estatistica) => (
          <Card key={estatistica.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3Icon className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm">{estatistica.nome}</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  Ordem: {estatistica.ordem}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-2">
                {estatistica.valor}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <TrendingUpIcon className="w-4 h-4" />
                <span>Ícone: {estatistica.icone}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="sm:w-auto w-full"
                  onClick={() => handleEdit(estatistica)}
                >
                  <EditIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 sm:w-auto w-full"
                  onClick={() => handleDelete(estatistica.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {estatisticas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma estatística encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando a primeira estatística para este sector.
            </p>
            <Button onClick={handleNewEstatistica}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Criar Primeira Estatística
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 