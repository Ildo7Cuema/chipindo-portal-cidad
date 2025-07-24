import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Eye, Edit, Trash2, FileText, Image, Video } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface AcervoItem {
  id: string;
  title: string;
  description: string | null;
  type: 'documento' | 'imagem' | 'video';
  category: string | null;
  department: string;
  file_url: string | null;
  thumbnail_url: string | null;
  file_size: number | null;
  mime_type: string | null;
  is_public: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

const departments = [
  { value: 'gabinete', label: 'Gabinete do Administrador' },
  { value: 'educacao', label: 'Educação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'obras-publicas', label: 'Obras Públicas' },
  { value: 'turismo', label: 'Turismo e Cultura' },
  { value: 'comercio', label: 'Comércio e Indústria' },
  { value: 'recursos-humanos', label: 'Recursos Humanos' },
  { value: 'financas', label: 'Finanças' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'meio-ambiente', label: 'Meio Ambiente' },
  { value: 'seguranca', label: 'Segurança' }
];

export default function AcervoDigitalManager() {
  const [items, setItems] = useState<AcervoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AcervoItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'documento' as 'documento' | 'imagem' | 'video',
    category: '',
    department: '',
    is_public: false,
    file: null as File | null
  });

  useEffect(() => {
    getUser();
    fetchItems();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('acervo_digital')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems((data || []).map(item => ({ 
        ...item, 
        type: item.type as 'documento' | 'imagem' | 'video' 
      })));
    } catch (error) {
      console.error('Error fetching acervo items:', error);
      toast.error('Erro ao carregar itens do acervo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${formData.department}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('acervo-digital')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('acervo-digital')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao fazer upload do arquivo');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    try {
      let fileUrl = null;
      if (formData.file) {
        fileUrl = await handleFileUpload(formData.file);
        if (!fileUrl) return;
      }

      const itemData = {
        title: formData.title,
        description: formData.description || null,
        type: formData.type,
        category: formData.category || null,
        department: formData.department,
        file_url: fileUrl,
        file_size: formData.file?.size || null,
        mime_type: formData.file?.type || null,
        is_public: formData.is_public,
        author_id: user.id
      };

      if (editingItem) {
        const { error } = await supabase
          .from('acervo_digital')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast.success('Item atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('acervo_digital')
          .insert([itemData]);

        if (error) throw error;
        toast.success('Item criado com sucesso!');
      }

      resetForm();
      setIsDialogOpen(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Erro ao salvar item');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: AcervoItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      type: item.type,
      category: item.category || '',
      department: item.department,
      is_public: item.is_public,
      file: null
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('acervo_digital')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item excluído com sucesso!');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'documento',
      category: '',
      department: '',
      is_public: false,
      file: null
    });
    setEditingItem(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documento': return <FileText className="h-4 w-4" />;
      case 'imagem': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão do Acervo Digital</h2>
          <p className="text-muted-foreground">
            Gerencie documentos, imagens e vídeos da administração municipal
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Upload className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Edite as informações do item do acervo' : 'Adicione um novo item ao acervo digital'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'documento' | 'imagem' | 'video') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documento">Documento</SelectItem>
                      <SelectItem value="imagem">Imagem</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Direção/Área</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a direção" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Relatórios, Eventos, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="file">Arquivo</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="is_public">Tornar público</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Salvando...' : (editingItem ? 'Atualizar' : 'Criar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Itens do Acervo</CardTitle>
          <CardDescription>
            Lista de todos os itens cadastrados no acervo digital
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Direção</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(item.type)}
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      {departments.find(d => d.value === item.department)?.label || item.department}
                    </TableCell>
                    <TableCell>{item.category || 'N/A'}</TableCell>
                    <TableCell>{formatFileSize(item.file_size)}</TableCell>
                    <TableCell>
                      <Badge variant={item.is_public ? 'default' : 'secondary'}>
                        {item.is_public ? 'Público' : 'Interno'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {item.file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(item.file_url!, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}