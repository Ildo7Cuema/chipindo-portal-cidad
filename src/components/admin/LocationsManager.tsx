import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useMunicipalityLocations, MunicipalityLocation } from '@/hooks/useMunicipalityLocations';
import { useToast } from '@/hooks/use-toast';

const locationTypes = [
  { value: 'office', label: 'Escritório/Sede' },
  { value: 'school', label: 'Escola' },
  { value: 'hospital', label: 'Hospital/Centro de Saúde' },
  { value: 'park', label: 'Parque/Área Verde' },
  { value: 'market', label: 'Mercado' },
  { value: 'cultural', label: 'Centro Cultural' },
  { value: 'sports', label: 'Centro Desportivo' },
  { value: 'other', label: 'Outros' }
];

export function LocationsManager() {
  const { locations, loading, addLocation, updateLocation, deleteLocation } = useMunicipalityLocations();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MunicipalityLocation | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    type: 'office',
    address: '',
    phone: '',
    email: '',
    opening_hours: '',
    active: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      type: 'office',
      address: '',
      phone: '',
      email: '',
      opening_hours: '',
      active: true
    });
    setEditingLocation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast({
        title: "Erro",
        description: "Nome, latitude e longitude são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      const locationData = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      if (editingLocation) {
        await updateLocation(editingLocation.id, locationData);
        toast({
          title: "Sucesso",
          description: "Localização atualizada com sucesso!"
        });
      } else {
        await addLocation(locationData);
        toast({
          title: "Sucesso",
          description: "Localização adicionada com sucesso!"
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar localização.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (location: MunicipalityLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || '',
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      type: location.type,
      address: location.address || '',
      phone: location.phone || '',
      email: location.email || '',
      opening_hours: location.opening_hours || '',
      active: location.active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar esta localização?')) {
      try {
        await deleteLocation(id);
        toast({
          title: "Sucesso",
          description: "Localização eliminada com sucesso!"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao eliminar localização.",
          variant: "destructive"
        });
      }
    }
  };

  const getTypeLabel = (type: string) => {
    return locationTypes.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return <div>A carregar localizações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Localizações do Município</h2>
          <p className="text-muted-foreground">
            Gerir pontos de interesse e localizações importantes do município
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Localização
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? 'Editar Localização' : 'Nova Localização'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome da localização"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da localização"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="-14.7844"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="13.4623"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+244 XXX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="opening_hours">Horário de Funcionamento</Label>
                <Input
                  id="opening_hours"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  placeholder="Segunda a Sexta: 08:00 - 16:00"
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
                  {editingLocation ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {location.name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      {getTypeLabel(location.type)}
                    </Badge>
                    {location.active && (
                      <Badge variant="default">Ativo</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(location)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(location.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {location.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {location.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Coordenadas:</strong> {location.latitude}, {location.longitude}
                </div>
                {location.address && (
                  <div>
                    <strong>Endereço:</strong> {location.address}
                  </div>
                )}
                {location.phone && (
                  <div>
                    <strong>Telefone:</strong> {location.phone}
                  </div>
                )}
                {location.email && (
                  <div>
                    <strong>Email:</strong> {location.email}
                  </div>
                )}
                {location.opening_hours && (
                  <div className="col-span-2">
                    <strong>Horário:</strong> {location.opening_hours}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {locations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Nenhuma localização cadastrada ainda.
                <br />
                Clique em "Adicionar Localização" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}