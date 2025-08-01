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
import { Pencil, Trash2, Plus, Upload, Users, User, Briefcase, Mail, Phone, Building2, Network, ListOrdered, ImageUp, Info } from 'lucide-react';

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
  'Direcção Administrativa',
  'Direcção de Obras Públicas',
  'Direcção de Saúde',
  'Direcção de Educação',
  'Direcção de Agricultura',
  'Direcção de Água e Saneamento',
  'Direcção de Segurança',
  'Direcção de Finanças',
  'Direcção de Cultura e Turismo',
  'Direcção de Assuntos Sociais'
];

interface Direccao {
  id: string;
  nome: string;
  descricao: string | null;
  codigo: string | null;
  ativo: boolean;
  ordem: number;
}

export function OrganigramaManager() {
  const [members, setMembers] = useState<OrganigramaMember[]>([]);
  const [direcoes, setDirecoes] = useState<Direccao[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganigramaMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    fetchDirecoes();
  }, []);

  const fetchDirecoes = async () => {
    try {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      setDirecoes(data || []);
    } catch (error) {
      console.error('Error fetching direcoes:', error);
    }
  };

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

      let memberId = editingMember?.id;

      if (editingMember) {
        const { error } = await supabase
          .from('organigrama')
          .update(submitData)
          .eq('id', editingMember.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('organigrama')
          .insert([submitData])
          .select()
          .single();

        if (error) throw error;
        memberId = data.id;
      }

      // Upload image if selected
      if (selectedImage && memberId) {
        await uploadMemberImage(selectedImage, memberId);
      }

      toast.success(editingMember ? 'Membro atualizado com sucesso!' : 'Membro adicionado com sucesso!');
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
    setSelectedImage(null);
    setImagePreview(member.foto_url);
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

  const uploadMemberImage = async (file: File, memberId: string) => {
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
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
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
    setSelectedImage(null);
    setImagePreview(null);
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
          <DialogContent className="sm:max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Users className="h-7 w-7 text-primary" />
                {editingMember ? 'Editar Membro do Organigrama' : 'Adicionar Novo Membro'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-base">Nome Completo <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                      className="pl-10 text-base py-2"
                      placeholder="Nome do membro"
                  />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo" className="text-base">Cargo <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="cargo"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    required
                      className="pl-10 text-base py-2"
                      placeholder="Cargo do membro"
                  />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="departamento" className="text-base">Direcção <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <Select
                    value={formData.departamento}
                    onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                  >
                      <SelectTrigger className="pl-10 text-base py-2">
                      <SelectValue placeholder="Selecione a direcção" />
                    </SelectTrigger>
                    <SelectContent>
                      {direcoes.map((direccao) => (
                        <SelectItem key={direccao.id} value={direccao.nome}>
                          {direccao.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="superior" className="text-base">Superior Hierárquico</Label>
                  <div className="relative">
                    <Network className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <Select
                    value={formData.superior_id}
                    onValueChange={(value) => setFormData({ ...formData, superior_id: value })}
                  >
                      <SelectTrigger className="pl-10 text-base py-2">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 text-base py-2"
                      placeholder="email@example.com"
                  />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="text-base">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="pl-10 text-base py-2"
                      placeholder="+244 9xx xxx xxx"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="ordem" className="text-base">Ordem de Exibição <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <ListOrdered className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="ordem"
                      type="number"
                      value={formData.ordem}
                      onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) })}
                      required
                      className="pl-10 text-base py-2"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2 flex items-center pt-8">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo" className="ml-2 text-base">Membro Ativo</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-base">Descrição (Biografia)</Label>
                <div className="relative">
                  <Info className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                  <Textarea
                    id="descricao"
                    value={formData.descricao || ''}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="min-h-[100px] pl-10 text-base py-2"
                    placeholder="Breve descrição sobre as funções ou biografia..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto" className="text-base">Foto do Membro</Label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="flex justify-center">
                      <Avatar className="h-24 w-24 border-2 border-primary-500 shadow-md">
                        <AvatarImage src={imagePreview} alt="Preview" />
                        <AvatarFallback className="text-xl font-semibold bg-gray-200 text-gray-600">
                          {formData.nome.split(' ').map(n => n[0]).join('').toUpperCase() || <ImageUp className="h-8 w-8 text-gray-500" />}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      id="foto"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      disabled={uploading}
                      className="file:text-primary-foreground file:bg-primary hover:file:bg-primary/90 file:font-semibold text-base py-2"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                  </div>
                  {uploading && <p className="text-sm text-muted-foreground">A carregar imagem...</p>}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? 'A Salvar...' : (editingMember ? 'Salvar Alterações' : 'Adicionar Membro')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {direcoes.map((direccao) => {
          const deptMembers = members.filter(member => member.departamento === direccao.nome);
          if (deptMembers.length === 0) return null;

          return (
            <Card key={direccao.id}>
              <CardHeader>
                <CardTitle className="text-lg">{direccao.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {deptMembers.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.foto_url || ''} alt={member.nome} />
                          <AvatarFallback>
                            {member.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
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