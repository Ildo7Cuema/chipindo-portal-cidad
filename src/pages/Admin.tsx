import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpPage } from "@/components/admin/HelpPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  LogOut, 
  Home, Bell, FileText, Trophy, FolderOpen, Network, Building2, Brush, ImageIcon, MapPin, Phone, Users, Settings, ChevronLeft, ChevronRight, Activity, BarChart3, Calendar, Search, Filter, MoreVertical, RefreshCw, Download, Archive, Trash2, HelpCircle, ImageUp, AlertTriangle, EyeIcon, MessageSquare
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminLoading } from "@/components/ui/loading";
import { useUserRole } from "@/hooks/useUserRole";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Component imports
import { DashboardStats } from "@/components/admin/DashboardStats";
import { NewsManager } from "@/components/admin/NewsManager";
import { NotificationsManager } from "@/components/admin/NotificationsManager";
import { ConcursosManager } from "@/components/admin/ConcursosManager";
import AcervoDigitalManager from "@/components/admin/AcervoDigitalManager";
import { OrganigramaManager } from "@/components/admin/OrganigramaManager";
import { DepartamentosManager } from "@/components/admin/DepartamentosManager";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { HeroCarouselManager } from "@/components/admin/HeroCarouselManager";
import { LocationsManager } from "@/components/admin/LocationsManager";
import { EmergencyContactsManager } from "@/components/admin/EmergencyContactsManager";
import { UserManager } from "@/components/admin/UserManager";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { TransparencyManager } from "@/components/admin/TransparencyManager";
import { OuvidoriaManager } from "@/components/admin/OuvidoriaManager";
import { PopulationHistoryManager } from "@/components/admin/PopulationHistoryManager";
import { SetoresEstrategicosManager } from "@/components/admin/SetoresEstrategicosManager";
import { MunicipalityCharacterizationManager } from "@/components/admin/MunicipalityCharacterizationManager";
import { EventsManager } from "@/components/admin/EventsManager";
import { TurismoAmbienteCarouselManager } from "@/components/admin/TurismoAmbienteCarouselManager";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
}

const Admin = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  
  // Get user role and permissions
  const { profile, loading: roleLoading, isAdmin, canManageContent, role } = useUserRole(user);
  
  // Get notifications data
  const { stats: notificationStats } = useNotifications();

  // Navigation items
  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, description: "Visão geral do sistema" },
    { id: "notifications", label: "Notificações", icon: Bell, description: "Gerir notificações" },
    { id: "news", label: "Notícias", icon: FileText, description: "Gerir notícias" },
    { id: "concursos", label: "Concursos", icon: Trophy, description: "Gerir concursos" },
    { id: "acervo", label: "Acervo Digital", icon: Archive, description: "Gerir acervo digital" },
    { id: "organigrama", label: "Organigrama", icon: Network, description: "Gerir estrutura organizacional" },
    { id: "departamentos", label: "Direcções", icon: Building2, description: "Gerir departamentos" },
    { id: "setores", label: "Sectores Estratégicos", icon: Building2, description: "Gerir sectores estratégicos" },
    { id: "content", label: "Conteúdo", icon: FileText, description: "Gerir conteúdo do site" },
    { id: "carousel", label: "Carousel", icon: ImageUp, description: "Gerir imagens do carousel" },
    { id: "locations", label: "Localizações", icon: MapPin, description: "Gerir localizações" },
    { id: "emergency-contacts", label: "Contactos", icon: AlertTriangle, description: "Contactos de emergência" },
    { id: "transparency", label: "Transparência", icon: EyeIcon, description: "Gerir documentos de transparência" },
    { id: "ouvidoria", label: "Ouvidoria", icon: MessageSquare, description: "Gerir manifestações da ouvidoria" },
    { id: "population", label: "População", icon: Users, description: "Gestão do histórico populacional" },
    { id: "characterization", label: "Caracterização", icon: MapPin, description: "Caracterização do município" },
    { id: "events", label: "Eventos", icon: Calendar, description: "Gerir eventos do município" },
    { id: "turismo-carousel", label: "Carrossel Turismo", icon: ImageIcon, description: "Gerir carrossel turístico e ambiental" },
    { id: "users", label: "Utilizadores", icon: Users, description: "Gerir utilizadores do sistema" }
  ];

  const adminOnlyItems: NavigationItem[] = [
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
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (!currentSession?.user) {
          setTimeout(() => {
            navigate("/auth");
          }, 100);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (!currentSession?.user) {
        setTimeout(() => {
          navigate("/auth");
        }, 100);
      }
      setLoading(false);
    });

    // Handle admin navigation events
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
      await supabase.auth.signOut();
      toast({
        title: "Sessão terminada",
        description: "Logout realizado com sucesso.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao terminar sessão",
        description: "Ocorreu um erro durante o logout.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = () => {
    toast({
      title: "Dados actualizados",
      description: "Os dados foram actualizados com sucesso.",
    });
    window.location.reload();
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo preparados para download.",
    });
  };

  const handleArchiveItems = () => {
    toast({
      title: "Itens arquivados",
      description: "Os itens selecionados foram arquivados.",
    });
  };

  const handleOpenHelp = () => {
    setShowHelp(true);
  };

  if (loading || roleLoading) {
    return <AdminLoading />;
  }

  if (!user || !canManageContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <Settings className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Acesso Restrito</h2>
            <p className="text-muted-foreground mt-2">
              Você não tem permissão para acessar esta área.
            </p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar ao Portal
          </Button>
        </div>
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
          {/* Sidebar Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="mr-4 lg:hidden"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Portal Title */}
          <div className="flex items-center gap-3 mr-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Portal Administrativo</h1>
              <p className="text-xs text-muted-foreground">Município de Chipindo</p>
            </div>
          </div>

          {/* Current Section */}
          <div className="hidden md:flex items-center gap-2 mr-auto">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{activeItem?.label}</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.full_name || profile?.email}</p>
                <Badge variant={getRoleBadgeVariant(role) as any} className="text-xs">
                  {getRoleLabel(role)}
                </Badge>
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                <AvatarFallback>
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
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
                    isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/60 hover:-translate-y-0.5 hover:shadow-sm"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-medium truncate", isActive ? "text-primary-foreground" : "text-foreground")}>{item.label}</p>
                        <p className={cn("text-xs truncate", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>{item.description}</p>
                      </div>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "default"} className="text-xs">{item.badge}</Badge>
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
                <h2 className="text-2xl font-bold text-foreground">{activeItem?.label}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>

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
                        Actualizar Dados
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
                      <DropdownMenuItem onClick={handleOpenHelp}>
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
              {activeTab === "departamentos" && <DepartamentosManager />}
              {activeTab === "setores" && <SetoresEstrategicosManager />}
              {activeTab === "content" && <SiteContentManager />}
              {activeTab === "carousel" && <HeroCarouselManager />}
              {activeTab === "locations" && <LocationsManager />}
              {activeTab === "emergency-contacts" && <EmergencyContactsManager />}
              {activeTab === "transparency" && <TransparencyManager />}
              {activeTab === "ouvidoria" && <OuvidoriaManager />}
              {activeTab === "population" && <PopulationHistoryManager />}
              {activeTab === "characterization" && <MunicipalityCharacterizationManager />}
              {activeTab === "events" && <EventsManager />}
              {activeTab === "turismo-carousel" && <TurismoAmbienteCarouselManager />}
              {activeTab === "users" && <UserManager currentUserRole={role} />}
              {activeTab === "settings" && <SystemSettings />}
              {/* Other tabs would be added here */}
              {activeTab !== "dashboard" && activeTab !== "notifications" && activeTab !== "news" && activeTab !== "concursos" && activeTab !== "acervo" && activeTab !== "organigrama" && activeTab !== "departamentos" && activeTab !== "content" && activeTab !== "carousel" && activeTab !== "locations" && activeTab !== "emergency-contacts" && activeTab !== "transparency" && activeTab !== "ouvidoria" && activeTab !== "users" && activeTab !== "settings" && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Secção em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Esta funcionalidade será implementada em breve
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Help Page Modal */}
        <HelpPage open={showHelp} onOpenChange={setShowHelp} />
      </div>
    </div>
  );
};

export default Admin;