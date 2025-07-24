import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Building2 } from 'lucide-react';

interface Direccao {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export function DirecoesManager() {
  const [direcoes, setDirecoes] = useState<Direccao[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDirecao, setEditingDirecao] = useState<Direccao | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    codigo: '',
    ordem: 0,
    ativo: true
  });

  useEffect(() => {
    fetchDirecoes();
  }, []);

  const fetchDirecoes = async () => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      setDirecoes(data || []);
    } catch (error) {
      console.error('Error fetching direcoes:', error);
      toast.error('Erro ao carregar direcções');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDirecao) {
        const { error } = await supabase
          .from('departamentos')
          .update(formData)
          .eq('id', editingDirecao.id);

        if (error) throw error;
        toast.success('Direcção atualizada com sucesso!');
      } else {
        const { error } = await supabase
          .from('departamentos')
          .insert([formData]);

        if (error) throw error;
        toast.success('Direcção adicionada com sucesso!');
      }

      setIsDialogOpen(false);
      setEditingDirecao(null);
      resetForm();
      fetchDirecoes();
    } catch (error) {
      console.error('Error saving departamento:', error);
      toast.error('Erro ao salvar direcção');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (direccao: Direccao) => {
    setEditingDirecao(direccao);
    setFormData({
      nome: direccao.nome,
      descricao: direccao.descricao || '',
      codigo: direccao.codigo || '',
      ordem: direccao.ordem,
      ativo: direccao.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta direcção?')) return;

    try {
      const { error } = await supabase
        .from('departamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Direcção excluída com sucesso!');
      fetchDirecoes();
    } catch (error) {
      console.error('Error deleting departamento:', error);
      toast.error('Erro ao excluir direcção');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      codigo: '',
      ordem: 0,
      ativo: true
    });
  };

  const openDialog = () => {
    resetForm();
    setEditingDirecao(null);
    setIsDialogOpen(true);
  };

  if (loading && direcoes.length === 0) {
    return <div className="p-6">Carregando direcções...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Gestão de Direcções</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Direcção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDirecao ? 'Editar Direcção' : 'Adicionar Direcção'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Direcção *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ex: ADM, FIN, SAU"
                    maxLength={10}
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
                  placeholder="Descrição das atividades e responsabilidades da direcção"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ordem">Ordem de Exibição</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : editingDirecao ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {direcoes.map((direccao) => (
          <Card key={direccao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{direccao.nome}</CardTitle>
                  {direccao.codigo && (
                    <Badge variant="outline" className="mt-1">
                      {direccao.codigo}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(direccao)}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(direccao.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {direccao.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {direccao.descricao}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Ordem: {direccao.ordem}</span>
                  <Badge variant={direccao.ativo ? "default" : "secondary"}>
                    {direccao.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {direcoes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhuma direcção encontrada
          </h3>
          <p className="text-muted-foreground">
            Comece adicionando a primeira direcção.
          </p>
        </div>
      )}
    </div>
  );
}