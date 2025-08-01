import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HelpPage } from "@/components/admin/HelpPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveSection,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { 
  LogOut, 
  Home, Bell, FileText, Trophy, FolderOpen, Network, Building2, Brush, ImageIcon, MapPin, Phone, Users, Settings, ChevronLeft, ChevronRight, Activity, BarChart3, Calendar, Search, Filter, MoreVertical, RefreshCw, Download, Archive, Trash2, HelpCircle, ImageUp, AlertTriangle, EyeIcon, MessageSquare, MenuIcon
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminLoading } from "@/components/ui/loading";
import { useUserRole } from "@/hooks/useUserRole";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSafeScrollListener } from "@/hooks/useSafeEventListeners";
import { MobileSidebar } from "@/components/ui/mobile-sidebar";

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
  category?: string;
}

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Get user role and permissions
  const { profile, loading: roleLoading, isAdmin, canManageContent, role } = useUserRole(user);
  
  // Get notifications data
  const { stats: notificationStats } = useNotifications();

  // Usar hook seguro para scroll
  useSafeScrollListener(() => {
    const scrollY = window.scrollY;
    setShowBottomNav(scrollY > 100);
    setHeaderCollapsed(scrollY > 50);
  }, { throttle: 100 });

  // Navigation items with categories
  const navigationItems: NavigationItem[] = [
    { id: "dashboard", label: "Dashboard Executivo", icon: BarChart3, description: "Painel de controle e estatísticas", category: "Principal" },
    { id: "notifications", label: "Notificações", icon: Bell, description: "Gerir notificações", category: "Principal" },
    { id: "news", label: "Notícias", icon: FileText, description: "Gerir notícias", category: "Conteúdo" },
    { id: "concursos", label: "Concursos", icon: Trophy, description: "Gerir concursos", category: "Conteúdo" },
    { id: "acervo", label: "Acervo Digital", icon: FolderOpen, description: "Gerir acervo digital", category: "Conteúdo" },
    { id: "organigrama", label: "Organigrama", icon: Network, description: "Gerir estrutura organizacional", category: "Estrutura" },
    { id: "departamentos", label: "Direcções", icon: Building2, description: "Gerir departamentos", category: "Estrutura" },
    { id: "setores", label: "Sectores Estratégicos", icon: Building2, description: "Gerir sectores estratégicos", category: "Estrutura" },
    { id: "content", label: "Conteúdo", icon: FileText, description: "Gerir conteúdo do site", category: "Conteúdo" },
    { id: "carousel", label: "Carousel", icon: ImageUp, description: "Gerir imagens do carousel", category: "Conteúdo" },
    { id: "locations", label: "Localizações", icon: MapPin, description: "Gerir localizações", category: "Dados" },
    { id: "emergency-contacts", label: "Contactos", icon: AlertTriangle, description: "Contactos de emergência", category: "Dados" },
    { id: "transparency", label: "Transparência", icon: EyeIcon, description: "Gerir documentos de transparência", category: "Dados" },
    { id: "ouvidoria", label: "Ouvidoria", icon: MessageSquare, description: "Gerir manifestações da ouvidoria", category: "Dados" },
    { id: "population", label: "População", icon: Users, description: "Gestão do histórico populacional", category: "Dados" },
    { id: "characterization", label: "Caracterização", icon: MapPin, description: "Caracterização do município", category: "Dados" },
    { id: "events", label: "Eventos", icon: Calendar, description: "Gerir eventos do município", category: "Conteúdo" },
    { id: "turismo-carousel", label: "Carrossel Turismo", icon: ImageIcon, description: "Gerir carrossel turístico e ambiental", category: "Conteúdo" },
    { id: "users", label: "Utilizadores", icon: Users, description: "Gerir utilizadores do sistema", category: "Sistema" }
  ];

  const adminOnlyItems: NavigationItem[] = [
    {
      id: "settings",
      label: "Configurações",
      icon: Settings,
      description: "Configurações do sistema",
      category: "Sistema"
    }
  ];

  const allItems = isAdmin ? [...navigationItems, ...adminOnlyItems] : navigationItems;

  // Agrupar itens por categoria
  const groupedItems = allItems.reduce((acc, item) => {
    const category = item.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

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
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro",
        description: "Erro ao terminar sessão.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = () => {
    toast({
      title: "Dados actualizados",
      description: "Os dados foram actualizados com sucesso.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "A exportação dos dados foi iniciada.",
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

  if (!user || !profile) {
    return (
      <ResponsiveContainer>
        <ResponsiveSection spacing="lg" className="min-h-screen flex items-center justify-center">
          <ResponsiveCard className="max-w-md w-full text-center">
            <ResponsiveText variant="h3" className="mb-4">
              Acesso Negado
            </ResponsiveText>
            <ResponsiveText variant="body" className="text-muted-foreground mb-6">
              Você não tem permissão para acessar esta área.
            </ResponsiveText>
            <Button onClick={() => navigate("/")} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar ao Portal
            </Button>
          </ResponsiveCard>
        </ResponsiveSection>
      </ResponsiveContainer>
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
      {/* Mobile Header */}
      <div className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg transition-all duration-300 lg:hidden",
        headerCollapsed ? "h-12" : "h-16"
      )}>
        <div className="flex h-full items-center px-4">
          {/* Menu Button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mr-3 h-10 w-10 p-0"
              >
                <MenuIcon className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          
          {/* Mobile Sidebar Component */}
          <MobileSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            navigationItems={allItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            profile={profile}
            role={role}
            onSignOut={handleSignOut}
            getRoleLabel={getRoleLabel}
            getRoleBadgeVariant={getRoleBadgeVariant}
          />

          {/* Current Section */}
          <div className="flex-1 min-w-0">
            <ResponsiveText variant="h5" className="truncate">
              {activeItem?.label}
            </ResponsiveText>
            {!headerCollapsed && (
              <ResponsiveText variant="small" className="text-muted-foreground truncate">
                {activeItem?.description}
              </ResponsiveText>
            )}
          </div>

          {/* User Avatar */}
          <Avatar className="w-8 h-8 ml-3">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
            <AvatarFallback>
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
        <div className="flex h-16 items-center px-6">
          {/* Portal Title */}
          <div className="flex items-center gap-3 mr-6">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <ResponsiveText variant="h5" className="font-bold">Portal Administrativo</ResponsiveText>
              <ResponsiveText variant="small" className="text-muted-foreground">Município de Chipindo</ResponsiveText>
            </div>
          </div>

          {/* Current Section */}
          <div className="flex items-center gap-2 mr-auto">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <ResponsiveText variant="body" className="font-medium">{activeItem?.label}</ResponsiveText>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <ResponsiveText variant="body" className="font-medium">{profile?.full_name || profile?.email}</ResponsiveText>
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
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-r overflow-y-auto">
          <div className="p-4 space-y-2">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                  {category}
                </div>
                <div className="space-y-1">
                  {items.map((item) => {
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
                        <div className="flex-1 min-w-0">
                          <ResponsiveText variant="body" className={cn("font-medium truncate", isActive ? "text-primary-foreground" : "text-foreground")}>
                            {item.label}
                          </ResponsiveText>
                          <ResponsiveText variant="small" className={cn("truncate", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                            {item.description}
                          </ResponsiveText>
                        </div>
                        {item.badge && (
                          <Badge variant={isActive ? "secondary" : "default"} className="text-xs">{item.badge}</Badge>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <ResponsiveContainer>
            {/* Content Header */}
            <ResponsiveSection spacing="sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <ResponsiveText variant="h2" className="mb-2">{activeItem?.label}</ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground">
                    {activeItem?.description}
                  </ResponsiveText>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
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
            </ResponsiveSection>

            {/* Tab Content */}
            <ResponsiveSection spacing="lg">
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
                  <ResponsiveCard className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Settings className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <ResponsiveText variant="body" className="text-muted-foreground font-medium">
                      Secção em desenvolvimento
                    </ResponsiveText>
                    <ResponsiveText variant="small" className="text-muted-foreground/70 mt-1">
                      Esta funcionalidade será implementada em breve
                    </ResponsiveText>
                  </ResponsiveCard>
                )}
              </div>
            </ResponsiveSection>
          </ResponsiveContainer>
        </main>

        {/* Help Page Modal */}
        <HelpPage open={showHelp} onOpenChange={setShowHelp} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
        showBottomNav ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-border/50 shadow-lg">
          <div className="flex items-center justify-around p-2">
            {/* Quick Actions */}
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={handleRefreshData}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs font-medium">Actualizar</span>
            </button>
            
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={handleExportData}
            >
              <Download className="w-5 h-5" />
              <span className="text-xs font-medium">Exportar</span>
            </button>
            
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={handleOpenHelp}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-xs font-medium">Ajuda</span>
            </button>
            
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="w-5 h-5" />
              <span className="text-xs font-medium">Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;