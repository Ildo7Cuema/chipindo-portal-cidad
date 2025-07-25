import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { User, Session } from '@supabase/supabase-js';
import { 
  LogOut, 
  Home,
  Bell,
  FileText,
  Trophy,
  FolderOpen,
  Network,
  Building2,
  Brush,
  ImageIcon,
  MapPin,
  Phone,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  BarChart3,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Download,
  RefreshCw,
  HelpCircle,
  Archive,
  Trash2,
  Eye,
  EyeOff
} from "lucide-react";
import { NewsManager } from "@/components/admin/NewsManager";
import { ConcursosManager } from "@/components/admin/ConcursosManager";
import AcervoDigitalManager from "@/components/admin/AcervoDigitalManager";
import { OrganigramaManager } from "@/components/admin/OrganigramaManager";
import { DirecoesManager } from "@/components/admin/DepartamentosManager";
import { UserManager } from "@/components/admin/UserManager";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { HeroCarouselManager } from "@/components/admin/HeroCarouselManager";
import { LocationsManager } from "@/components/admin/LocationsManager";
import { EmergencyContactsManager } from "@/components/admin/EmergencyContactsManager";
import { useUserRole } from "@/hooks/useUserRole";
import NotificationsManager from "@/components/admin/NotificationsManager";
import { AdminLoading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "last_30_days",
    status: "all",
    showHidden: false,
    priority: "all"
  });
  const navigate = useNavigate();
  
  // Get user role and permissions
  const { profile, loading: roleLoading, isAdmin, canManageContent, role } = useUserRole(user);

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Visão geral do sistema"
    },
    {
      id: "notifications",
      label: "Notificações",
      icon: Bell,
      description: "Gerir notificações",
      badge: "3"
    },
    {
      id: "news",
      label: "Notícias",
      icon: FileText,
      description: "Gerir notícias"
    },
    {
      id: "concursos",
      label: "Concursos",
      icon: Trophy,
      description: "Gerir concursos"
    },
    {
      id: "acervo",
      label: "Acervo Digital",
      icon: FolderOpen,
      description: "Documentos e arquivos"
    },
    {
      id: "organigrama",
      label: "Organigrama",
      icon: Network,
      description: "Estrutura organizacional"
    },
    {
      id: "departamentos",
      label: "Direcções",
      icon: Building2,
      description: "Gerir departamentos"
    },
    {
      id: "content",
      label: "Conteúdo",
      icon: Brush,
      description: "Gerir conteúdo do site"
    },
    {
      id: "carousel",
      label: "Carrossel",
      icon: ImageIcon,
      description: "Gerir carrossel principal"
    },
    {
      id: "locations",
      label: "Localizações",
      icon: MapPin,
      description: "Gerir localizações"
    },
    {
      id: "emergency-contacts",
      label: "Emergências",
      icon: Phone,
      description: "Contactos de emergência"
    }
  ];

  const adminOnlyItems: NavigationItem[] = [
    {
      id: "users",
      label: "Usuários",
      icon: Users,
      description: "Gerir usuários"
    },
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      description: "Configurações do sistema"
    }
  ];

  const allItems = isAdmin ? [...navigationItems, ...adminOnlyItems] : navigationItems;

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session?.user) {
          setTimeout(() => {
            navigate("/auth");
          }, 100);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        navigate("/auth");
      }
      setLoading(false);
    });

    // Listen for navigation events from dashboard quick actions
    const handleAdminNavigate = (event: CustomEvent) => {
      if (event.detail?.tab) {
        setActiveTab(event.detail.tab);
      }
    };

    window.addEventListener('admin-navigate', handleAdminNavigate as EventListener);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('admin-navigate', handleAdminNavigate as EventListener);
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
    }
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filtros aplicados",
      description: "Os filtros foram aplicados com sucesso.",
    });
    setFilterDialogOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: "last_30_days",
      status: "all",
      showHidden: false,
      priority: "all"
    });
    toast({
      title: "Filtros resetados",
      description: "Todos os filtros foram resetados para os valores padrão.",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Dados atualizados",
      description: "Os dados foram atualizados com sucesso.",
    });
    // Here you would typically refresh the current tab's data
    window.location.reload();
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo preparados para download.",
    });
    // Here you would implement actual export functionality
  };

  const handleArchiveItems = () => {
    toast({
      title: "Itens arquivados",
      description: "Os itens selecionados foram arquivados.",
    });
  };

  if (loading || roleLoading) {
    return <AdminLoading />;
  }

  if (!user || !canManageContent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
            <p className="text-muted-foreground mb-6">
              Você não tem permissões para acessar esta área.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                Voltar ao Início
              </Button>
              <Button onClick={() => navigate("/auth")} variant="default">
                Fazer Login
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getRoleLabel = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'Administrador';
      case 'editor':
        return 'Editor';
      default:
        return 'Usuário';
    }
  };

  const getRoleBadgeVariant = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'default';
      case 'editor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const activeItem = allItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Top Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Portal Administrativo</h1>
                <p className="text-xs text-muted-foreground">Município de Chipindo</p>
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/* Current Section Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              {activeItem && (
                <>
                  <activeItem.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{activeItem.label}</span>
                </>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                    {getRoleLabel(role)}
                  </Badge>
                </div>
              </div>
              
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || user.email}`} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {(profile?.full_name || user.email || 'U').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "sticky top-16 h-[calc(100vh-4rem)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r transition-all duration-300 overflow-y-auto",
          sidebarCollapsed ? "w-16" : "w-72"
        )}>
          <div className="p-4 space-y-2">
            {allItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "hover:bg-muted/60 hover:-translate-y-0.5 hover:shadow-sm"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium truncate",
                          isActive ? "text-primary-foreground" : "text-foreground"
                        )}>
                          {item.label}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                        )}>
                          {item.description}
                        </p>
                      </div>
                      
                      {item.badge && (
                        <Badge 
                          variant={isActive ? "secondary" : "default"} 
                          className="text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Content Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {activeItem?.label}
                </h2>
                <div className="flex items-center gap-2">
                  {/* Filter Dialog */}
                  <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtros
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Filtros Avançados</DialogTitle>
                        <DialogDescription>
                          Configure os filtros para personalizar a visualização dos dados.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="date-range">Período</Label>
                          <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                              <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                              <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                              <SelectItem value="this_year">Este ano</SelectItem>
                              <SelectItem value="all_time">Todo o período</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="published">Publicados</SelectItem>
                              <SelectItem value="draft">Rascunhos</SelectItem>
                              <SelectItem value="archived">Arquivados</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Prioridade</Label>
                          <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              <SelectItem value="high">Alta</SelectItem>
                              <SelectItem value="medium">Média</SelectItem>
                              <SelectItem value="low">Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-hidden">Mostrar itens ocultos</Label>
                          <Switch 
                            id="show-hidden"
                            checked={filters.showHidden}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showHidden: checked }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleResetFilters} variant="outline" className="flex-1">
                          Resetar
                        </Button>
                        <Button onClick={handleApplyFilters} className="flex-1">
                          Aplicar Filtros
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* More Options Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleRefreshData}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Atualizar Dados
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Dados
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleArchiveItems}>
                        <Archive className="w-4 h-4 mr-2" />
                        Arquivar Selecionados
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Selecionados
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Ajuda
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <p className="text-muted-foreground">
                {activeItem?.description}
              </p>
            </div>

            {/* Tab Content */}
            <div className="min-h-[calc(100vh-12rem)]">
              {activeTab === "dashboard" && <DashboardStats />}
              {activeTab === "notifications" && <NotificationsManager />}
              {activeTab === "news" && <NewsManager />}
              {activeTab === "concursos" && <ConcursosManager />}
              {activeTab === "acervo" && <AcervoDigitalManager />}
              {activeTab === "organigrama" && <OrganigramaManager />}
              {activeTab === "departamentos" && <DirecoesManager />}
              {activeTab === "content" && <SiteContentManager />}
              {activeTab === "carousel" && <HeroCarouselManager />}
              {activeTab === "locations" && <LocationsManager />}
              {activeTab === "emergency-contacts" && <EmergencyContactsManager />}
              {isAdmin && activeTab === "users" && <UserManager currentUserRole={role} />}
              {isAdmin && activeTab === "settings" && <SystemSettings />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;