import { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useHeroCarousel, HeroCarouselImage } from '@/hooks/useHeroCarousel';
import { toast } from 'sonner';

export const HeroCarouselManager = () => {
  const { images, loading, createImage, updateImage, deleteImage, uploadImage } = useHeroCarousel();
  const [selectedImage, setSelectedImage] = useState<HeroCarouselImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    active: true,
    order_index: 0
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      active: true,
      order_index: 0
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
        order_index: image.order_index
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

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast.success('Imagem carregada com sucesso');
    } catch (error) {
      console.error('Error uploading file:', error);
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
      if (selectedImage) {
        await updateImage(selectedImage.id, formData);
      } else {
        await createImage(formData);
      }
      closeDialog();
    } catch (error) {
      console.error('Error saving hero carousel image:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta imagem?')) {
      await deleteImage(id);
    }
  };

  const toggleActive = async (image: HeroCarouselImage) => {
    await updateImage(image.id, { active: !image.active });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Carrossel da Página Inicial</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedImage ? 'Editar Imagem' : 'Adicionar Nova Imagem'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da imagem"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição opcional"
                />
              </div>

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

              <div>
                <Label htmlFor="image">Imagem</Label>
                <div className="space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-muted-foreground">Carregando imagem...</p>}
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Ativa</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={uploading}>
                  {selectedImage ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className={!image.active ? 'opacity-50' : ''}>
            <CardHeader className="p-0">
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-48 object-cover rounded-t"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{image.title}</CardTitle>
                  {image.description && (
                    <p className="text-sm text-muted-foreground mt-1">{image.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Ordem: {image.order_index}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleActive(image)}
                  className="text-muted-foreground"
                >
                  {image.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(image)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma imagem cadastrada no carrossel.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione imagens para exibir no fundo da página inicial.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};