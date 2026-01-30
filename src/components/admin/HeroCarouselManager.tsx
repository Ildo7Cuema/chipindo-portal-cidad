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
  Settings, 
  Palette, 
  Target, 
  FileText, 
  Calendar, 
  Star, 
  Heart, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ExternalLink, 
  Download, 
  Copy, 
  RotateCcw, 
  Move, 
  GripVertical,
  Image as ImageIcon2,
  FileImage,
  Camera,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Link,
  Hash,
  Clock,
  Tag,
  Bookmark,
  Share2,
  MoreVertical,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useHeroCarousel, HeroCarouselImage } from '@/hooks/useHeroCarousel';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const HeroCarouselManager = () => {
  const { images, loading, createImage, updateImage, deleteImage, uploadImage } = useHeroCarousel();
  const [selectedImage, setSelectedImage] = useState<HeroCarouselImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState('order_index');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewMode, setPreviewMode] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    active: true,
    order_index: 0,
    link_url: '',
    button_text: '',
    overlay_opacity: 0.5
  });

  useEffect(() => {
    // Calculate stats
    const total = images.length;
    const active = images.filter(img => img.active).length;
    const inactive = total - active;
    setStats({ total, active, inactive });
  }, [images]);

  const filteredImages = images
    .filter(image => {
      const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          image.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && image.active) ||
                          (filterStatus === 'inactive' && !image.active);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof HeroCarouselImage];
      let bValue = b[sortBy as keyof HeroCarouselImage];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      active: true,
      order_index: 0,
      link_url: '',
      button_text: '',
      overlay_opacity: 0.5
    });
    setSelectedImage(null);
  };

  const openDialog = (image?: HeroCarouselImage) => {
    if (image) {
      setSelectedImage(image);
      setFormData({
        title: image.title,
        description: image.description || '',
        image_url: image.image_url,
        active: image.active,
        order_index: image.order_index,
        link_url: image.link_url || '',
        button_text: image.button_text || '',
        overlay_opacity: image.overlay_opacity || 0.5
      });
    } else {
      resetForm();
      setFormData(prev => ({
        ...prev,
        order_index: images.length
      }));
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

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast.success('Imagem carregada com sucesso!', {
        description: 'A imagem foi processada e está pronta para uso.'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Erro ao carregar imagem', {
        description: 'Tente novamente ou contacte o administrador.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    if (!formData.image_url.trim()) {
      toast.error('A imagem é obrigatória');
      return;
    }

    try {
      // Preparar dados para envio, removendo campos vazios
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: formData.image_url.trim(),
        active: formData.active,
        order_index: formData.order_index,
        ...(formData.link_url.trim() && { link_url: formData.link_url.trim() }),
        ...(formData.button_text.trim() && { button_text: formData.button_text.trim() }),
        ...(formData.overlay_opacity !== 0.5 && { overlay_opacity: formData.overlay_opacity })
      };

      if (selectedImage) {
        await updateImage(selectedImage.id, submitData);
        toast.success('Imagem atualizada com sucesso!', {
          description: 'As alterações foram aplicadas ao carrossel.'
        });
      } else {
        await createImage(submitData);
        toast.success('Imagem adicionada com sucesso!', {
          description: 'A nova imagem foi adicionada ao carrossel.'
        });
      }
      closeDialog();
    } catch (error) {
      console.error('Error saving hero carousel image:', error);
      toast.error('Erro ao salvar imagem', {
        description: 'Tente novamente ou contacte o administrador.'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta imagem?')) {
      try {
        await deleteImage(id);
        toast.success('Imagem removida com sucesso!');
      } catch (error) {
        toast.error('Erro ao remover imagem');
      }
    }
  };

  const toggleActive = async (image: HeroCarouselImage) => {
    try {
      await updateImage(image.id, { active: !image.active });
      toast.success(`Imagem ${image.active ? 'desativada' : 'ativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da imagem');
    }
  };

  const duplicateImage = async (image: HeroCarouselImage) => {
    try {
      const newImage = {
        ...image,
        title: `${image.title} (Cópia)`,
        order_index: images.length
      };
      delete newImage.id;
      await createImage(newImage);
      toast.success('Imagem duplicada com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar imagem');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando carrossel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Imagens</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Activas</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.active}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Inactivas</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.inactive}</p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Taxa Ativa</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Gestão do Carrossel</h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? 'Ocultar Preview' : 'Preview'}
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openDialog()} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Imagem
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      {selectedImage ? 'Editar Imagem' : 'Adicionar Nova Imagem'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                        <TabsTrigger value="image">Imagem</TabsTrigger>
                        <TabsTrigger value="advanced">Avançado</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Título *
                            </Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Título da imagem"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="order_index" className="flex items-center gap-2">
                              <ArrowUpDown className="h-4 w-4" />
                              Ordem de Exibição
                            </Label>
                            <Input
                              id="order_index"
                              type="number"
                              value={formData.order_index}
                              onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                              min="0"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Descrição
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descrição opcional da imagem"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="link_url" className="flex items-center gap-2">
                              <Link className="h-4 w-4" />
                              Link (Opcional)
                            </Label>
                            <Input
                              id="link_url"
                              value={formData.link_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                              placeholder="https://exemplo.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="button_text" className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Texto do Botão
                            </Label>
                            <Input
                              id="button_text"
                              value={formData.button_text}
                              onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                              placeholder="Saiba mais"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="image" className="space-y-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="image" className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              Carregar Imagem *
                            </Label>
                            <div className="space-y-2">
                              <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                              />
                              {uploading && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                  Carregando imagem...
                                </div>
                              )}
                            </div>
                          </div>

                          {formData.image_url && (
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2">
                                <ImageIcon className="h-4 w-4" />
                                Preview da Imagem
                              </Label>
                              <div className="relative">
                                <img
                                  src={formData.image_url}
                                  alt="Preview"
                                  className="w-full h-48 object-cover rounded-lg border"
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge variant="secondary" className="bg-black/50 text-white">
                                    Preview
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Status
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                              />
                              <Label htmlFor="active" className="text-sm">
                                {formData.active ? 'Activa' : 'Inactiva'}
                              </Label>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="overlay_opacity" className="flex items-center gap-2">
                              <Palette className="h-4 w-4" />
                              Opacidade do Overlay
                            </Label>
                            <Input
                              id="overlay_opacity"
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={formData.overlay_opacity}
                              onChange={(e) => setFormData(prev => ({ ...prev, overlay_opacity: parseFloat(e.target.value) }))}
                            />
                            <span className="text-xs text-muted-foreground">
                              {Math.round(formData.overlay_opacity * 100)}%
                            </span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={closeDialog}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={uploading} className="bg-gradient-to-r from-primary to-primary/80">
                        {uploading ? 'Carregando...' : selectedImage ? 'Actualizar' : 'Adicionar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar imagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_index">Ordem</SelectItem>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="created_at">Data Criação</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <ArrowUpDown className="h-4 w-4" /> : <ArrowUpDown className="h-4 w-4" />}
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredImages.length === 0 ? (
          <Card className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma imagem encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de pesquisa.' : 'Comece adicionando a primeira imagem ao carrossel.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Imagem
              </Button>
            )}
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredImages.map((image) => (
              <Card key={image.id} className={cn(
                "group hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
                !image.active && "opacity-60"
              )}>
                <CardHeader className="p-0 relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-48 object-cover rounded-t"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!image.active && (
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactiva
                      </Badge>
                    )}
                    {/* Removed link_url reference since property doesn't exist */}
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-black/50 text-white">
                      Ordem: {image.order_index}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{image.title}</CardTitle>
                        {image.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(image)}
                        >
                          {image.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateImage(image)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(image)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(image.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};