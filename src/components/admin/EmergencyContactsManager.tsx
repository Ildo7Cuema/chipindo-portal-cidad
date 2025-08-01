import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List, 
  Eye, 
  EyeOff, 
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
  Navigation2,
  Shield,
  AlertTriangle,
  Ambulance,
  Flame,
  MessageSquare,
  UserCheck
} from "lucide-react";
import { useEmergencyContacts, EmergencyContact } from "@/hooks/useEmergencyContacts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const contactTypes = [
  { value: 'police', label: 'Polícia', icon: Shield, color: 'blue' },
  { value: 'fire', label: 'Bombeiros', icon: Flame, color: 'red' },
  { value: 'ambulance', label: 'Ambulância', icon: Ambulance, color: 'green' },
  { value: 'hospital', label: 'Hospital', icon: Hospital, color: 'purple' },
  { value: 'emergency', label: 'Emergência Geral', icon: AlertTriangle, color: 'orange' },
  { value: 'security', label: 'Segurança', icon: Shield, color: 'gray' },
  { value: 'other', label: 'Outros', icon: Phone, color: 'yellow' }
];

export function EmergencyContactsManager() {
  const { contacts, loading, addContact, updateContact, deleteContact } = useEmergencyContacts();
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewMode, setPreviewMode] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byType: {} as Record<string, number>
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    priority: 0,
    active: true,
    type: 'emergency',
    email: '',
    address: '',
    department: '',
    availability: ''
  });

  useEffect(() => {
    // Calculate stats
    const total = contacts.length;
    const active = contacts.filter(contact => contact.active).length;
    const inactive = total - active;
    
    const byType = contacts.reduce((acc, contact) => {
      const type = contact.type || 'other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    setStats({ total, active, inactive, byType });
  }, [contacts]);

  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || contact.type === filterType;
      const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && contact.active) ||
                          (filterStatus === 'inactive' && !contact.active);
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof EmergencyContact];
      let bValue = b[sortBy as keyof EmergencyContact];
      
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
      name: "",
      phone: "",
      description: "",
      priority: 0,
      active: true,
      type: 'emergency',
      email: '',
      address: '',
      department: '',
      availability: ''
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addContact(formData);
      setIsDialogOpen(false);
      resetForm();
      toast.success("Contacto de emergência adicionado com sucesso!", {
        description: "O contacto foi adicionado à lista de emergência."
      });
    } catch (error) {
      toast.error("Erro ao adicionar contacto de emergência", {
        description: "Tente novamente ou contacte o administrador."
      });
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      description: contact.description || "",
      priority: contact.priority,
      active: contact.active,
      type: contact.type || 'emergency',
      email: contact.email || '',
      address: contact.address || '',
      department: contact.department || '',
      availability: contact.availability || ''
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact) return;

    try {
      await updateContact(editingContact.id, formData);
      setIsDialogOpen(false);
      setEditingContact(null);
      resetForm();
      toast.success("Contacto de emergência atualizado com sucesso!", {
        description: "As alterações foram aplicadas."
      });
    } catch (error) {
      toast.error("Erro ao actualizar contacto de emergência", {
        description: "Tente novamente ou contacte o administrador."
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este contacto de emergência?")) {
      try {
        await deleteContact(id);
        toast.success("Contacto de emergência eliminado com sucesso!");
      } catch (error) {
        toast.error("Erro ao eliminar contacto de emergência");
      }
    }
  };

  const handleToggleStatus = async (contact: EmergencyContact) => {
    try {
      await updateContact(contact.id, { active: !contact.active });
      toast.success(`Contacto ${contact.active ? 'desativado' : 'ativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do contacto');
    }
  };

  const duplicateContact = async (contact: EmergencyContact) => {
    try {
      const newContact = {
        ...contact,
        name: `${contact.name} (Cópia)`,
        id: undefined
      };
      await addContact(newContact);
      toast.success('Contacto duplicado com sucesso!');
    } catch (error) {
      toast.error('Erro ao duplicar contacto');
    }
  };

  const getTypeLabel = (type: string) => {
    return contactTypes.find(t => t.value === type)?.label || type;
  };

  const getTypeIcon = (type: string) => {
    return contactTypes.find(t => t.value === type)?.icon || Phone;
  };

  const getTypeColor = (type: string) => {
    return contactTypes.find(t => t.value === type)?.color || 'gray';
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) return { variant: 'destructive' as const, label: 'Crítico' };
    if (priority >= 6) return { variant: 'default' as const, label: 'Alto' };
    if (priority >= 4) return { variant: 'secondary' as const, label: 'Médio' };
    return { variant: 'outline' as const, label: 'Baixo' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando contactos de emergência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Total de Contactos</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{stats.total}</p>
              </div>
              <Phone className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Ativos</p>
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
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Inativos</p>
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
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Gestão de Contactos de Emergência</h2>
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
                    Adicionar Contacto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {editingContact ? 'Editar Contacto' : 'Novo Contacto de Emergência'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingContact ? handleUpdate : handleAdd} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                        <TabsTrigger value="contact">Contacto</TabsTrigger>
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              Nome *
                            </Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="Nome do contacto"
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
                              onValueChange={(value) => setFormData({...formData, type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {contactTypes.map((type) => {
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
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Descrição do contacto"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="priority" className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Prioridade (1-10)
                            </Label>
                            <Input
                              id="priority"
                              type="number"
                              min="1"
                              max="10"
                              value={formData.priority}
                              onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value) || 0})}
                              placeholder="5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department" className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Departamento
                            </Label>
                            <Input
                              id="department"
                              value={formData.department}
                              onChange={(e) => setFormData({...formData, department: e.target.value})}
                              placeholder="Departamento"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="contact" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Telefone *
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              placeholder="+244 XXX XXX XXX"
                              required
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
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              placeholder="email@exemplo.com"
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
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Endereço completo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="availability" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Disponibilidade
                          </Label>
                          <Input
                            id="availability"
                            value={formData.availability}
                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                            placeholder="24/7, Segunda a Sexta, etc."
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Status
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="active"
                              checked={formData.active}
                              onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                            />
                            <Label htmlFor="active" className="text-sm">
                              {formData.active ? 'Ativo' : 'Inativo'}
                            </Label>
                          </div>
                        </div>

                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Informações de Prioridade:</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">8-10</Badge>
                              <span>Crítico - Emergências imediatas</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="text-xs">6-7</Badge>
                              <span>Alto - Situações urgentes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">4-5</Badge>
                              <span>Médio - Contactos importantes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">1-3</Badge>
                              <span>Baixo - Contactos gerais</span>
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
                        {editingContact ? 'Actualizar' : 'Adicionar'}
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
                placeholder="Pesquisar contactos..."
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
                  {contactTypes.map((type) => (
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
                  <SelectItem value="priority">Prioridade</SelectItem>
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
        {filteredContacts.length === 0 ? (
          <Card className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum contacto encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de pesquisa.' : 'Comece adicionando o primeiro contacto de emergência.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => resetForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Contacto
              </Button>
            )}
          </Card>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
          )}>
            {filteredContacts.map((contact) => {
              const TypeIcon = getTypeIcon(contact.type || 'other');
              const typeColor = getTypeColor(contact.type || 'other');
              const priorityBadge = getPriorityBadge(contact.priority);
              
              return (
                <Card key={contact.id} className={cn(
                  "group hover:shadow-lg transition-all duration-200 hover:-translate-y-1",
                  !contact.active && "opacity-60"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg truncate">{contact.name}</CardTitle>
                          <Badge variant={contact.active ? "default" : "secondary"} className="text-xs">
                            {contact.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <TypeIcon className={cn("h-4 w-4", `text-${typeColor}-600`)} />
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(contact.type || 'other')}
                          </Badge>
                          <Badge variant={priorityBadge.variant} className="text-xs">
                            {priorityBadge.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(contact)}
                        >
                          {contact.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateContact(contact)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(contact)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(contact.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contact.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {contact.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        )}
                        {contact.department && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate">{contact.department}</span>
                          </div>
                        )}
                        {contact.address && (
                          <div className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            <span className="truncate">{contact.address}</span>
                          </div>
                        )}
                      </div>

                      {(contact.availability) && (
                        <div className="pt-2 border-t">
                          <div className="space-y-1 text-xs text-muted-foreground">
                            {contact.availability && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="truncate">{contact.availability}</span>
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