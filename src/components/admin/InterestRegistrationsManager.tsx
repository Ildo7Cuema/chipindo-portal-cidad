import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useInterestAreas } from "@/hooks/useInterestAreas";
import { supabase } from "@/integrations/supabase/client";
import { useAccessControl } from "@/hooks/useAccessControl";
import { SectorFilter } from "@/components/admin/SectorFilter";
import { Users, Search, Bell, Calendar, TrendingUp, Clock, Trash2, MoreVertical, Eye } from "lucide-react";
import { ExportRegistrationsList } from "./ExportRegistrationsList";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface InterestRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  profession: string | null;
  areas_of_interest: string[];
  additional_info: string | null;
  created_at: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const InterestRegistrationsManager = () => {
  const [registrations, setRegistrations] = useState<InterestRegistration[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("registrations");
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Usar hook para buscar áreas dinamicamente
  const { areaOptions, loading: areasLoading } = useInterestAreas();

  // Controle de acesso
  const { isAdmin, getCurrentSector, getCurrentSectorName } = useAccessControl();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let registrationsQuery = supabase
        .from('interest_registrations' as any)
        .select('*')
        .order('created_at', { ascending: false });

      // Filtrar por setor se não for admin - será feito no frontend
      // Removido filtro da query para evitar problemas com colunas inexistentes

      const { data: registrationsData, error: registrationsError } = await registrationsQuery;

      if (registrationsError) throw registrationsError;

      const { data: notificationsData, error: notificationsError } = await supabase
        .from('admin_notifications' as any)
        .select('*')
        .eq('type', 'interest_registration')
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;

      // Filtrar por setor no frontend se não for admin
      let filteredRegistrations = (registrationsData as unknown as InterestRegistration[]) || [];
      if (!isAdmin) {
        const currentSectorName = getCurrentSectorName();
        if (currentSectorName) {
          // Filtrar no frontend por nome ou profissão
          filteredRegistrations = filteredRegistrations.filter(registration => 
            (registration.full_name && registration.full_name.toLowerCase().includes(currentSectorName.toLowerCase())) ||
            (registration.profession && registration.profession.toLowerCase().includes(currentSectorName.toLowerCase()))
          );
        }
      }
      
      setRegistrations(filteredRegistrations);
      setNotifications((notificationsData as unknown as NotificationItem[]) || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos registros de interesse.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (registration.profession && registration.profession.toLowerCase().includes(searchQuery.toLowerCase()));

    // Corrigir filtro por área - verificar se a área está contida no array
    const matchesArea = areaFilter === "all" || 
                       (registration.areas_of_interest && 
                        registration.areas_of_interest.some(area => 
                          area.toLowerCase().includes(areaFilter.toLowerCase())
                        ));

    return matchesSearch && matchesArea;
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('interest_registrations' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRegistrations(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Sucesso",
        description: "Registro eliminado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao eliminar:', error);
      toast({
        title: "Erro",
        description: "Erro ao eliminar registro.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('interest_registrations' as any)
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      setRegistrations(prev => prev.filter(r => !selectedIds.includes(r.id)));
      setSelectedIds([]);
      toast({
        title: "Sucesso",
        description: `${selectedIds.length} registros eliminados com sucesso.`
      });
    } catch (error) {
      console.error('Erro ao eliminar em massa:', error);
      toast({
        title: "Erro",
        description: "Erro ao eliminar registros selecionados.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAreaBadgeColor = (area: string) => {
    const colors: { [key: string]: string } = {
      'Agricultura': 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      'Educação': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      'Saúde': 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      'Tecnologia': 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
      'Cultura': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      'Turismo': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
      'Meio Ambiente': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
      'Desenvolvimento Económico': 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
      'Energia e Água': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
      'Sector Mineiro': 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
      'Programa': 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400'
    };
    return colors[area] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
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
      {/* Sector Filter */}
      <SectorFilter />
      
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{registrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">
                  {registrations.filter(r => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(r.created_at) >= monthAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">
                  {registrations.filter(r => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(r.created_at) >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notificações</p>
                <p className="text-2xl font-bold">{notifications.filter(n => !n.read).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registrations">Registros de Interesse</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Tab de Registros */}
        <TabsContent value="registrations" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome, email ou profissão..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={areaFilter} onValueChange={setAreaFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrar por área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ExportRegistrationsList onExportComplete={fetchData} />
                <Button onClick={fetchData} variant="outline">
                  Actualizar
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Lista de registros */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Registros de Interesse</CardTitle>
                  <CardDescription>
                    {filteredRegistrations.length} registros encontrados
                  </CardDescription>
                </div>
                {selectedIds.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar Selecionados ({selectedIds.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja eliminar {selectedIds.length} registros selecionados? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredRegistrations.map((registration) => (
                    <Card key={registration.id} className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedIds.includes(registration.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedIds(prev => [...prev, registration.id]);
                                } else {
                                  setSelectedIds(prev => prev.filter(id => id !== registration.id));
                                }
                              }}
                            />
                            <h3 className="font-semibold text-lg">{registration.full_name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {formatDate(registration.created_at)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowDetails(registration.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(registration.email)}>
                                  📧 Copiar email
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => setDeleteDialogOpen(registration.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📧 {registration.email}</span>
                          {registration.phone && <span>📞 {registration.phone}</span>}
                          {registration.profession && <span>💼 {registration.profession}</span>}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {registration.areas_of_interest.map((area, index) => (
                            <Badge key={index} className={getAreaBadgeColor(area)}>
                              {area}
                            </Badge>
                          ))}
                        </div>

                        {registration.additional_info && (
                          <div className="text-sm text-muted-foreground">
                            <p className="line-clamp-2">{registration.additional_info}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                  
                  {filteredRegistrations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum registro encontrado</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações de Registros</CardTitle>
              <CardDescription>
                Notificações automáticas de novos registros de interesse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={`p-4 transition-colors ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" : ""
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                Nova
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {formatDate(notification.created_at)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </Card>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma notificação encontrada</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de detalhes */}
      <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Registro</DialogTitle>
            <DialogDescription>
              Informações completas do registro de interesse
            </DialogDescription>
          </DialogHeader>
          {showDetails && (() => {
            const registration = registrations.find(r => r.id === showDetails);
            if (!registration) return null;
            
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{registration.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="font-medium">{registration.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p className="font-medium">{registration.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Profissão</p>
                    <p className="font-medium">{registration.profession || 'Não informado'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Áreas de Interesse</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {registration.areas_of_interest.map((area, index) => (
                      <Badge key={index} className={getAreaBadgeColor(area)}>
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {registration.additional_info && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Informações Adicionais</p>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap text-sm">{registration.additional_info}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Registro</p>
                  <p className="font-medium">{formatDate(registration.created_at)}</p>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de eliminação */}
      <AlertDialog open={!!deleteDialogOpen} onOpenChange={() => setDeleteDialogOpen(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar este registro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteDialogOpen && handleDelete(deleteDialogOpen)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 