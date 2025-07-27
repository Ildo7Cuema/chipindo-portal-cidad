import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List, 
  Eye, 
  EyeOff, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  Navigation, 
  Building2, 
  School, 
  Hospital, 
  ShoppingBag, 
  Theater, 
  Trophy, 
  Settings, 
  Target, 
  FileText, 
  Calendar, 
  Star, 
  Heart, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  ExternalLink, 
  Download, 
  Copy, 
  RotateCcw, 
  Move, 
  GripVertical,
  Map,
  Compass,
  Route,
  Flag,
  Home,
  Store,
  Camera,
  Monitor,
  Smartphone,
  Tablet,
  Link,
  Hash,
  Tag,
  Bookmark,
  Share2,
  MoreVertical,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Layers,
  Pin,
  Crosshair,
  Navigation2
} from 'lucide-react';
import { useMunicipalityLocations, MunicipalityLocation } from '@/hooks/useMunicipalityLocations';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const locationTypes = [
  { value: 'office', label: 'Escritório/Sede', icon: Building2, color: 'blue' },
  { value: 'school', label: 'Escola', icon: School, color: 'green' },
  { value: 'hospital', label: 'Hospital/Centro de Saúde', icon: Hospital, color: 'red' },
  { value: 'park', label: 'Parque/Área Verde', icon: MapPin, color: 'emerald' },
  { value: 'market', label: 'Mercado', icon: ShoppingBag, color: 'orange' },
  { value: 'cultural', label: 'Centro Cultural', icon: Theater, color: 'purple' },
  { value: 'sports', label: 'Centro Desportivo', icon: Trophy, color: 'yellow' },
  { value: 'other', label: 'Outros', icon: Building2, color: 'gray' }
];

export function LocationsManager() {
  const { locations, loading, addLocation, updateLocation, deleteLocation } = useMunicipalityLocations();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MunicipalityLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewMode, setPreviewMode] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byType: {} as Record<string, number>
  });

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

  useEffect(() => {
    // Calculate stats
    const total = locations.length;
    const active = locations.filter(loc => loc.active).length;
    const inactive = total - active;
    
    const byType = locations.reduce((acc, loc) => {
      acc[loc.type] = (acc[loc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({ total, active, inactive, byType });
  }, [locations]);

  const filteredLocations = locations
    .filter(location => {
      const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          location.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          location.address?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || location.type === filterType;
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && location.active) ||
                          (filterStatus === 'inactive' && !location.active);
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof MunicipalityLocation];
      let bValue = b[sortBy as keyof MunicipalityLocation];
      
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
      toast.error('Nome, latitude e longitude são obrigatórios.');
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
        toast.success('Localização atualizada com sucesso!', {
          description: 'As alterações foram aplicadas.'
        });
      } else {
        await addLocation(locationData);
        toast.success('Localização adicionada com sucesso!', {
          description: 'A nova localização foi adicionada ao mapa.'
        });
      }

      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Erro ao salvar localização', {
        description: 'Tente novamente ou contacte o administrador.'
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
        toast.success('Localização eliminada com sucesso!');
      } catch (error) {
        toast.error('Erro ao eliminar localização');
      }
    }
  };

  const handleToggleStatus = async (location: MunicipalityLocation) => {
    try {
      await updateLocation(location.id, { active: !location.active });
      toast.success(`Localização ${location.active ? 'desativada' : 'ativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da localização');
    }
  };

  const duplicateLocation = async (location: MunicipalityLocation) => {
    try {
      const newLocation = {
        ...location,
        name: `${location.name} (Cópia)`,
        id: undefined
      };
      await addLocation(newLocation);
      toast.success('Localização duplicada com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar localização');
    }
  };

  const getTypeLabel = (type: string) => {
    return locationTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: string) => {
    return locationTypes.find(t => t.value === type)?.icon || Building2;
  };

  const getTypeColor = (type: string) => {
    return locationTypes.find(t => t.value === type)?.color || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando localizações...</p>
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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Localizações</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativas</p>
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
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Inativas</p>
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
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Tipos Únicos</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {Object.keys(stats.byType).length}
                </p>
              </div>
              <Layers className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Gestão de Localizações</h2>
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
                  <Button onClick={() => resetForm()} className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Localização
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {editingLocation ? 'Editar Localização' : 'Nova Localização'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                        <TabsTrigger value="location">Localização</TabsTrigger>
                        <TabsTrigger value="contact">Contacto</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Nome *
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Nome da localização"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type" className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Tipo
                            </Label>
                            <Select
                              value={formData.type}
                              onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {locationTypes.map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
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
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descrição da localização"
                            rows={3}
                          />
                        </div>

                        
                      </TabsContent>

                      <TabsContent value="location" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="latitude" className="flex items-center gap-2">
                              <Crosshair className="h-4 w-4" />
                              Latitude *
                            </Label>
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
                          <div className="space-y-2">
                            <Label htmlFor="longitude" className="flex items-center gap-2">
                              <Navigation2 className="h-4 w-4" />
                              Longitude *
                            </Label>
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

                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <Home className="h-4 w-4" />
                            Endereço
                          </Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Endereço completo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="opening_hours" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Horário de Funcionamento
                          </Label>
                          <Input
                            id="opening_hours"
                            value={formData.opening_hours}
                            onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                            placeholder="Segunda a Sexta: 08:00 - 16:00"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="contact" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Telefone
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+244 XXX XXX XXX"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="email@exemplo.com"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Status
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                              />
                              <Label htmlFor="active" className="text-sm">
                                {formData.active ? 'Ativa' : 'Inativa'}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
                        {editingLocation ? 'Atualizar' : 'Adicionar'}
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
                placeholder="Pesquisar localizações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  {locationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(value: 'all' | 'active' | 'inactive') => setFilterStatus(value)}>
                <SelectTrigger className="w-[140px]">
                  <Eye className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="type">Tipo</SelectItem>
                  <SelectItem value="created_at">Data Criação</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
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
        {filteredLocations.length === 0 ? (
          <Card className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma localização encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de pesquisa.' : 'Comece adicionando a primeira localização.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Localização
              </Button>
            )}
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredLocations.map((location) => {
              const TypeIcon = getTypeIcon(location.type);
              const typeColor = getTypeColor(location.type);
              
              return (
                <Card key={location.id} className={cn(
                  "group hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
                  !location.active && "opacity-60"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg truncate">{location.name}</CardTitle>
                          <Badge variant={location.active ? "default" : "secondary"} className="text-xs">
                            {location.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <TypeIcon className={cn("h-4 w-4", `text-${typeColor}-600`)} />
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(location.type)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(location)}
                        >
                          {location.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateLocation(location)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(location.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {location.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {location.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Crosshair className="h-3 w-3" />
                          <span className="truncate">{location.latitude}, {location.longitude}</span>
                        </div>
                        {location.address && (
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            <span className="truncate">{location.address}</span>
                          </div>
                        )}
                        {location.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span className="truncate">{location.phone}</span>
                          </div>
                        )}
                        {location.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{location.email}</span>
                          </div>
                        )}
                      </div>

                      {(location.opening_hours) && (
                        <div className="pt-2 border-t">
                          <div className="space-y-1 text-xs text-muted-foreground">
                            {location.opening_hours && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="truncate">{location.opening_hours}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}