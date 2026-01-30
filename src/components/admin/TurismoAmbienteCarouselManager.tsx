import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Eye, 
  EyeOff, 
  ImageIcon, 
  ArrowUpDown, 
  Filter, 
  Search, 
  Grid3X3, 
  List, 
  Globe,
  Trees,
  MapPin,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

export interface TurismoAmbienteCarouselImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  location: string;
  active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const TurismoAmbienteCarouselManager = () => {
  const [images, setImages] = useState<TurismoAmbienteCarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<TurismoAmbienteCarouselImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'turismo' | 'ambiente'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'turismo',
    location: '',
    active: true,
    order_index: 0
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('turismo_ambiente_carousel')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Erro ao buscar imagens:', error);
        toast.error('Erro ao carregar imagens do carrossel');
        return;
      }

      setImages(data || []);
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
      toast.error('Erro ao carregar imagens do carrossel');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'turismo',
      location: '',
      active: true,
      order_index: 0
    });
    setSelectedImage(null);
  };

  const openDialog = (image?: TurismoAmbienteCarouselImage) => {
    if (image) {
      setSelectedImage(image);
      setFormData({
        title: image.title,
        description: image.description || '',
        image_url: image.image_url,
        category: image.category,
        location: image.location || '',
        active: image.active,
        order_index: image.order_index
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `turismo-ambiente/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('turismo-ambiente')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        toast.error('Erro ao fazer upload da imagem');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('turismo-ambiente')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Imagem carregada com sucesso');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image_url) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (selectedImage) {
        const { error } = await supabase
          .from('turismo_ambiente_carousel')
          .update({
            title: formData.title,
            description: formData.description,
            image_url: formData.image_url,
            category: formData.category,
            location: formData.location,
            active: formData.active,
            order_index: formData.order_index
          })
          .eq('id', selectedImage.id);

        if (error) {
          console.error('Erro ao actualizar imagem:', error);
          toast.error('Erro ao actualizar imagem');
          return;
        }

        toast.success('Imagem atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('turismo_ambiente_carousel')
          .insert([formData]);

        if (error) {
          console.error('Erro ao criar imagem:', error);
          toast.error('Erro ao criar imagem');
          return;
        }

        toast.success('Imagem criada com sucesso');
      }

      closeDialog();
      fetchImages();
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      toast.error('Erro ao salvar imagem');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const { error } = await supabase
        .from('turismo_ambiente_carousel')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir imagem:', error);
        toast.error('Erro ao excluir imagem');
        return;
      }

      toast.success('Imagem excluída com sucesso');
      fetchImages();
    } catch (error) {
      console.error('Erro ao excluir imagem:', error);
      toast.error('Erro ao excluir imagem');
    }
  };

  const toggleActive = async (image: TurismoAmbienteCarouselImage) => {
    try {
      const { error } = await supabase
        .from('turismo_ambiente_carousel')
        .update({ active: !image.active })
        .eq('id', image.id);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast.error('Erro ao alterar status da imagem');
        return;
      }

      toast.success(`Imagem ${image.active ? 'desativada' : 'ativada'} com sucesso`);
      fetchImages();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status da imagem');
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && image.active) ||
                         (filterStatus === 'inactive' && !image.active);
    
    const matchesCategory = filterCategory === 'all' || image.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'turismo':
        return <Globe className="w-4 h-4" />;
      case 'ambiente':
        return <Trees className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'turismo':
        return 'bg-blue-100 text-blue-800';
      case 'ambiente':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Carrossel Turismo e Meio Ambiente</h2>
          <p className="text-muted-foreground">
            Gerir imagens do carrossel turístico e ambiental
          </p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Imagem
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Pesquisar imagens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="turismo">Turismo</SelectItem>
                <SelectItem value="ambiente">Ambiente</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid/List */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {filteredImages.map((image) => (
          <Card key={image.id} className={cn(
            "overflow-hidden",
            !image.active && "opacity-60"
          )}>
            <div className="relative h-48">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Imagem+não+encontrada';
                }}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge variant={image.active ? "default" : "secondary"}>
                  {image.active ? "Ativa" : "Inativa"}
                </Badge>
                <Badge className={getCategoryColor(image.category)}>
                  {getCategoryIcon(image.category)}
                  <span className="ml-1 capitalize">{image.category}</span>
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{image.title}</h3>
              {image.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {image.description}
                </p>
              )}
              {image.location && (
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {image.location}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Ordem: {image.order_index}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(image)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(image)}
                  >
                    {image.active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma imagem encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Tente ajustar os filtros de pesquisa'
                : 'Comece adicionando a primeira imagem ao carrossel'
              }
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Imagem
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedImage ? 'Editar Imagem' : 'Adicionar Nova Imagem'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da imagem"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turismo">Turismo</SelectItem>
                    <SelectItem value="ambiente">Ambiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da imagem"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Localização da imagem"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order_index">Ordem</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Activa</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="image">Imagem *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="URL da imagem"
                  required
                />
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {formData.image_url && (
              <div>
                <Label>Pré-visualização</Label>
                <div className="relative h-48 rounded-lg overflow-hidden border">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Erro+ao+carregar+imagem';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedImage ? 'Actualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 