import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Upload, Users } from 'lucide-react';

interface OrganigramaMember {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  superior_id: string | null;
  email: string | null;
  telefone: string | null;
  descricao: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

const departments = [
  'Gabinete do Administrador',
  'Secretaria Geral',
  'Departamento Administrativo',
  'Departamento de Obras Públicas',
  'Departamento de Saúde',
  'Departamento de Educação',
  'Departamento de Agricultura',
  'Departamento de Água e Saneamento',
  'Departamento de Segurança',
  'Departamento de Finanças',
  'Departamento de Cultura e Turismo',
  'Departamento de Assuntos Sociais'
];

export function OrganigramaManager() {
  const [members, setMembers] = useState<OrganigramaMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganigramaMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    departamento: '',
    superior_id: '',
    email: '',
    telefone: '',
    descricao: '',
    ordem: 0,
    ativo: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('organigrama')
        .select('*')
        .order('departamento', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching organigrama:', error);
      toast.error('Erro ao carregar organigrama');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert "none" back to null for superior_id
      const submitData = {
        ...formData,
        superior_id: formData.superior_id === 'none' ? null : formData.superior_id || null
      };
      if (editingMember) {
        const { error } = await supabase
          .from('organigrama')
          .update(submitData)
          .eq('id', editingMember.id);

        if (error) throw error;
        toast.success('Membro atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('organigrama')
          .insert([submitData]);

        if (error) throw error;
        toast.success('Membro adicionado com sucesso!');
      }

      setIsDialogOpen(false);
      setEditingMember(null);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Erro ao salvar membro');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: OrganigramaMember) => {
    setEditingMember(member);
    setFormData({
      nome: member.nome,
      cargo: member.cargo,
      departamento: member.departamento,
      superior_id: member.superior_id || 'none',
      email: member.email || '',
      telefone: member.telefone || '',
      descricao: member.descricao || '',
      ordem: member.ordem,
      ativo: member.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;

    try {
      const { error } = await supabase
        .from('organigrama')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Membro excluído com sucesso!');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Erro ao excluir membro');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, memberId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('organigrama-fotos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('organigrama-fotos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('organigrama')
        .update({ foto_url: publicUrl })
        .eq('id', memberId);

      if (updateError) throw updateError;

      toast.success('Foto atualizada com sucesso!');
      fetchMembers();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Erro ao enviar foto');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      departamento: '',
      superior_id: 'none',
      email: '',
      telefone: '',
      descricao: '',
      ordem: 0,
      ativo: true
    });
  };

  const openDialog = () => {
    resetForm();
    setEditingMember(null);
    setIsDialogOpen(true);
  };

  const getAvailableSuperiors = () => {
    return members.filter(member => 
      member.id !== editingMember?.id && 
      member.ativo
    );
  };

  if (loading && members.length === 0) {
    return <div className="p-6">Carregando organigrama...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Gestão do Organigrama</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Editar Membro' : 'Adicionar Membro'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cargo">Cargo *</Label>
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Select
                    value={formData.departamento}
                    onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="superior">Superior Hierárquico</Label>
                  <Select
                    value={formData.superior_id}
                    onValueChange={(value) => setFormData({ ...formData, superior_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o superior" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {getAvailableSuperiors().map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.nome} - {member.cargo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição/Responsabilidades</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
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
                  {loading ? 'Salvando...' : editingMember ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {departments.map((dept) => {
          const deptMembers = members.filter(member => member.departamento === dept);
          if (deptMembers.length === 0) return null;

          return (
            <Card key={dept}>
              <CardHeader>
                <CardTitle className="text-lg">{dept}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {deptMembers.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.foto_url || ''} alt={member.nome} />
                            <AvatarFallback>
                              {member.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <label className="absolute -bottom-1 -right-1 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(e, member.id)}
                              disabled={uploading}
                            />
                            <div className="bg-primary text-primary-foreground rounded-full p-1 hover:bg-primary/80">
                              <Upload className="h-3 w-3" />
                            </div>
                          </label>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{member.nome}</h4>
                          <p className="text-sm text-muted-foreground">{member.cargo}</p>
                          {member.email && (
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <Badge variant={member.ativo ? "default" : "secondary"}>
                              {member.ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(member)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(member.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}