import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ConcursoItem {
  id: string;
  title: string;
  description: string;
  requirements: string;
  deadline: string;
  contact_info: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export const ConcursosManager = () => {
  const [concursos, setConcursos] = useState<ConcursoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConcurso, setEditingConcurso] = useState<ConcursoItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    deadline: "",
    contact_info: "",
    published: false,
  });

  useEffect(() => {
    fetchConcursos();
  }, []);

  const fetchConcursos = async () => {
    try {
      const { data, error } = await supabase
        .from('concursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar concursos",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setConcursos(data || []);
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível carregar os concursos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const concursoData = {
        ...formData,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      };

      let error;

      if (editingConcurso) {
        const { error: updateError } = await supabase
          .from('concursos')
          .update(concursoData)
          .eq('id', editingConcurso.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('concursos')
          .insert([concursoData]);
        error = insertError;
      }

      if (error) {
        toast({
          title: editingConcurso ? "Erro ao atualizar concurso" : "Erro ao criar concurso",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: editingConcurso ? "Concurso atualizado" : "Concurso criado",
          description: "A operação foi realizada com sucesso.",
        });
        
        setIsDialogOpen(false);
        setEditingConcurso(null);
        setFormData({
          title: "",
          description: "",
          requirements: "",
          deadline: "",
          contact_info: "",
          published: false,
        });
        fetchConcursos();
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a operação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (concurso: ConcursoItem) => {
    setEditingConcurso(concurso);
    setFormData({
      title: concurso.title,
      description: concurso.description,
      requirements: concurso.requirements || "",
      deadline: concurso.deadline ? new Date(concurso.deadline).toISOString().split('T')[0] : "",
      contact_info: concurso.contact_info || "",
      published: concurso.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este concurso?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('concursos')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir concurso",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Concurso excluído",
          description: "O concurso foi excluído com sucesso.",
        });
        fetchConcursos();
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Não foi possível excluir o concurso.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Concursos</h2>
          <p className="text-muted-foreground">Gerencie os concursos públicos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingConcurso(null);
                setFormData({
                  title: "",
                  description: "",
                  requirements: "",
                  deadline: "",
                  contact_info: "",
                  published: false,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Concurso
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingConcurso ? "Editar Concurso" : "Novo Concurso"}
              </DialogTitle>
              <DialogDescription>
                {editingConcurso ? "Edite os dados do concurso" : "Preencha os dados do novo concurso"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requirements">Requisitos</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Data Limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact_info">Informações de Contato</Label>
                <Textarea
                  id="contact_info"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Publicar</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : (editingConcurso ? "Atualizar" : "Criar")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Carregando concursos...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {concursos.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Nenhum concurso encontrado.</p>
              </CardContent>
            </Card>
          ) : (
            concursos.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="mt-2">{item.description}</CardDescription>
                      <div className="flex items-center gap-4 mt-3">
                        {item.deadline && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Prazo: {formatDate(item.deadline)}
                          </div>
                        )}
                        {item.published && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Publicado
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};