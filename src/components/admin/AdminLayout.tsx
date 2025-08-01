import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  ResponsiveContainer,
  ResponsiveText
} from "@/components/layout/ResponsiveLayout";
import { 
  LogOut, 
  Settings, 
  ChevronRight, 
  MoreVertical, 
  RefreshCw, 
  Download, 
  Archive, 
  Trash2, 
  HelpCircle, 
  MenuIcon,
  Filter
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSafeScrollListener } from "@/hooks/useSafeEventListeners";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string;
  category?: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  navigationItems: NavigationItem[];
  user: any;
  profile: any;
  role: string;
  onSignOut: () => void;
  onRefreshData: () => void;
  onExportData: () => void;
  onArchiveItems: () => void;
  onOpenHelp: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  navigationItems,
  user,
  profile,
  role,
  onSignOut,
  onRefreshData,
  onExportData,
  onArchiveItems,
  onOpenHelp
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  // Usar hook seguro para scroll
  useSafeScrollListener(() => {
    const scrollY = window.scrollY;
    setShowBottomNav(scrollY > 100);
    setHeaderCollapsed(scrollY > 50);
  }, { throttle: 100 });

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

  const activeItem = navigationItems.find(item => item.id === activeTab);

  // Agrupar itens por categoria para mobile
  const groupedItems = navigationItems.reduce((acc, item) => {
    const category = item.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      <div className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-sm transition-all duration-300 lg:hidden",
        headerCollapsed ? "h-12" : "h-16"
      )}>
        <div className="flex h-full items-center justify-between px-4">
          {/* Left Section - Menu & Title */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl"
                >
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
                <SheetHeader className="p-6 border-b border-border/50 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5">
                  <SheetTitle className="text-left flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Settings className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-foreground">Portal Administrativo</div>
                      <div className="text-sm text-muted-foreground font-medium">Município de Chipindo</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto">
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="p-4 space-y-3">
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4 px-2 py-1 bg-primary/5 rounded-lg">
                        {category}
                      </div>
                      
                      {items.map((item) => {
                        const isActive = activeTab === item.id;
                        const Icon = item.icon;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onTabChange(item.id);
                              setSidebarOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-4 text-left p-4 rounded-xl transition-all duration-300 group",
                              isActive 
                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-2 border-primary/20 shadow-lg" 
                                : "text-foreground hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 hover:text-primary hover:shadow-md"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
                              isActive 
                                ? "bg-primary text-primary-foreground shadow-md" 
                                : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn(
                                "font-semibold truncate transition-colors",
                                isActive ? "text-primary" : "text-foreground"
                              )}>
                                {item.label}
                              </div>
                              <div className={cn(
                                "text-xs truncate mt-1 transition-colors",
                                isActive ? "text-primary/80" : "text-muted-foreground"
                              )}>
                                {item.description}
                              </div>
                            </div>
                            {isActive && (
                              <div className="w-3 h-3 bg-primary rounded-full shadow-lg animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                  
                  {/* User Profile in Mobile Sidebar */}
                  <div className="p-4 border-t border-border/50 bg-gradient-to-br from-muted/20 to-muted/10">
                    <div className="flex items-center gap-4 mb-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-border/30">
                      <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-md">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground truncate">{profile?.full_name || profile?.email}</div>
                        <Badge variant={getRoleBadgeVariant(role) as any} className="text-xs mt-1 font-medium">
                          {getRoleLabel(role)}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        onSignOut();
                        setSidebarOpen(false);
                      }}
                      className="w-full h-11 font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Terminar Sessão
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Current Section */}
            <div className="flex flex-col min-w-0">
              <ResponsiveText variant="h5" className="truncate font-bold text-foreground">
                {activeItem?.label}
              </ResponsiveText>
              {!headerCollapsed && (
                <ResponsiveText variant="small" className="text-muted-foreground truncate font-medium">
                  {activeItem?.description}
                </ResponsiveText>
              )}
            </div>
          </div>

          {/* Right Section - User Avatar */}
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-md hover:border-primary/40 transition-all duration-300">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left Section - Portal Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center border border-primary/20">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <ResponsiveText variant="h5" className="font-bold text-foreground">Portal Administrativo</ResponsiveText>
                <ResponsiveText variant="small" className="text-muted-foreground">Município de Chipindo</ResponsiveText>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            {/* Current Section */}
            <div className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <ResponsiveText variant="body" className="font-semibold text-foreground">{activeItem?.label}</ResponsiveText>
                <ResponsiveText variant="small" className="text-muted-foreground">{activeItem?.description}</ResponsiveText>
              </div>
            </div>
          </div>

          {/* Right Section - User Profile & Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRefreshData}
                className="h-9 px-3 hover:bg-muted/60"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onExportData}
                className="h-9 px-3 hover:bg-muted/60"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <ResponsiveText variant="body" className="font-medium text-foreground leading-tight">
                  {profile?.full_name || profile?.email}
                </ResponsiveText>
                <Badge variant={getRoleBadgeVariant(role) as any} className="text-xs mt-1">
                  {getRoleLabel(role)}
                </Badge>
              </div>
              
              <Avatar className="w-10 h-10 border-2 border-muted/20 hover:border-primary/30 transition-colors">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Sign Out Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSignOut}
              className="h-9 px-4 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
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
                        onClick={() => onTabChange(item.id)}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-6 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-border/50 shadow-sm">
              <div className="flex-1 min-w-0">
                <ResponsiveText variant="h2" className="mb-2 font-bold text-foreground">{activeItem?.label}</ResponsiveText>
                <ResponsiveText variant="body" className="text-muted-foreground leading-relaxed">
                  {activeItem?.description}
                </ResponsiveText>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex h-9 px-4 hover:bg-muted/60"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>

                {/* More Options Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-9 px-3 hover:bg-muted/60"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-semibold">Ações Rápidas</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onRefreshData} className="cursor-pointer">
                      <RefreshCw className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Actualizar Dados</div>
                        <div className="text-xs text-muted-foreground">Sincronizar informações</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportData} className="cursor-pointer">
                      <Download className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Exportar Dados</div>
                        <div className="text-xs text-muted-foreground">Baixar relatórios</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onArchiveItems} className="cursor-pointer">
                      <Archive className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Arquivar Selecionados</div>
                        <div className="text-xs text-muted-foreground">Mover para arquivo</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-3" />
                      <div>
                        <div className="font-medium">Excluir Selecionados</div>
                        <div className="text-xs text-muted-foreground">Remover permanentemente</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onOpenHelp} className="cursor-pointer">
                      <HelpCircle className="w-4 h-4 mr-3 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Ajuda</div>
                        <div className="text-xs text-muted-foreground">Documentação e suporte</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[calc(100vh-12rem)]">
              {children}
            </div>
          </ResponsiveContainer>
        </main>
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
              onClick={onRefreshData}
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-xs font-medium">Actualizar</span>
            </button>
            
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={onExportData}
            >
              <Download className="w-5 h-5" />
              <span className="text-xs font-medium">Exportar</span>
            </button>
            
            <button
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              onClick={onOpenHelp}
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