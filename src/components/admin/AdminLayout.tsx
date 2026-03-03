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
  icon: any; // LucideIcon bypass to allow strokeWidth injection
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      {/* Mobile Header - Brutalist */}
      <div className={cn(
        "sticky top-0 z-50 w-full border-b-4 border-slate-900 dark:border-slate-50 bg-white dark:bg-slate-900 transition-all duration-300 lg:hidden",
        headerCollapsed ? "h-14" : "h-20"
      )}>
        <div className="flex h-full items-center justify-between px-4">
          {/* Left Section - Menu & Title */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 w-10 p-0 border-2 border-slate-900 rounded-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-200 bg-white dark:bg-slate-800"
                >
                  <MenuIcon className="w-5 h-5 text-slate-900 dark:text-white" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[85vw] max-w-sm p-0 border-r-4 border-slate-900 dark:border-slate-50 bg-white dark:bg-slate-900">
                <SheetHeader className="p-6 border-b-4 border-slate-900 dark:border-slate-50 bg-amber-400 dark:bg-amber-600">
                  <SheetTitle className="text-left flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 border-2 border-slate-900 dark:border-white rounded-sm flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <Settings className="w-6 h-6 text-amber-400" strokeWidth={3} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-xl text-slate-900 uppercase tracking-tighter truncate">PORTAL ADMIN</div>
                      <div className="text-sm text-slate-900 font-bold truncate">CHIPINDO</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category} className="p-4 space-y-3">
                      <div className="text-xs font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-4 px-2 py-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-50 rounded-sm">
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
                              "w-full flex items-center gap-4 text-left p-3 rounded-sm transition-all duration-200 group border-2",
                              isActive
                                ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:bg-white dark:text-slate-900 dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                                : "bg-white text-slate-900 border-transparent hover:border-slate-900 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-slate-50"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300 border-2",
                              isActive
                                ? "bg-amber-400 border-slate-900 text-slate-900 dark:bg-amber-500"
                                : "bg-slate-100 border-slate-200 text-slate-500 group-hover:border-slate-900 group-hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:group-hover:border-slate-50 dark:group-hover:text-slate-50"
                            )}>
                              <Icon className="w-5 h-5" strokeWidth={isActive ? 3 : 2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={cn(
                                "font-bold uppercase tracking-wide truncate transition-colors",
                                isActive ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-50"
                              )}>
                                {item.label}
                              </div>
                              <div className={cn(
                                "text-xs truncate mt-0.5 transition-colors font-medium",
                                isActive ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"
                              )}>
                                {item.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}

                  {/* User Profile in Mobile Sidebar */}
                  <div className="p-4 border-t-4 border-slate-900 dark:border-slate-50 bg-slate-100 dark:bg-slate-800 mt-4">
                    <div className="flex items-center gap-4 mb-4 p-3 bg-white dark:bg-slate-900 rounded-sm border-2 border-slate-900 dark:border-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <Avatar className="w-12 h-12 border-2 border-slate-900 rounded-sm">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                        <AvatarFallback className="bg-amber-400 text-slate-900 font-black text-lg rounded-none">
                          {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-slate-900 dark:text-white truncate uppercase">{profile?.full_name || profile?.email}</div>
                        <Badge variant="outline" className="text-[10px] mt-1 font-bold border-2 border-slate-900 text-slate-900 rounded-sm bg-white dark:bg-slate-800 dark:text-white dark:border-slate-50">
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
                      className="w-full h-12 font-black uppercase text-rose-600 border-2 border-slate-900 dark:border-slate-50 hover:bg-rose-600 hover:text-white hover:translate-y-[2px] transition-all rounded-sm shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none"
                    >
                      <LogOut className="w-5 h-5 mr-2" strokeWidth={3} />
                      SAIR DO SISTEMA
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Current Section - Title Mobile Header */}
            <div className="flex flex-col min-w-0 ml-2">
              <ResponsiveText variant="h5" className="truncate font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {activeItem?.label}
              </ResponsiveText>
            </div>
          </div>

          {/* Right Section - User Avatar Mobile */}
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 border-2 border-slate-900 dark:border-slate-50 rounded-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] bg-amber-400">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
              <AvatarFallback className="text-slate-900 font-black text-sm rounded-none">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Desktop Header - Brutalist */}
      <div className="hidden lg:block sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b-4 border-slate-900 dark:border-slate-50 shadow-[0px_4px_0px_0px_rgba(15,23,42,1)] dark:shadow-[0px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left Section - Portal Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 bg-amber-400 dark:bg-amber-500 border-2 border-slate-900 dark:border-slate-50 rounded-sm flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                <Settings className="w-5 h-5 text-slate-900" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <ResponsiveText variant="h5" className="font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">PORTAL ADMIN</ResponsiveText>
                <ResponsiveText variant="small" className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">CHIPINDO</ResponsiveText>
              </div>
            </div>

            <div className="w-1 h-8 bg-slate-900 dark:bg-slate-50 ml-2" />

            {/* Current Section Spacer & Breadcrumb */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col justify-center translate-y-0.5">
                <ResponsiveText variant="body" className="font-black text-slate-900 dark:text-white uppercase tracking-wide leading-none">{activeItem?.label}</ResponsiveText>
                <ResponsiveText variant="small" className="text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">{activeItem?.description}</ResponsiveText>
              </div>
            </div>
          </div>

          {/* Right Section - User Profile & Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefreshData}
                className="h-9 px-4 font-bold uppercase tracking-wider text-xs border-2 border-slate-900 dark:border-slate-50 text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 rounded-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-2" strokeWidth={2.5} />
                Actualizar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onExportData}
                className="h-9 px-4 font-bold uppercase tracking-wider text-xs border-2 border-slate-900 dark:border-slate-50 text-slate-900 dark:text-white bg-amber-400 hover:bg-amber-500 rounded-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <Download className="w-3.5 h-3.5 mr-2" strokeWidth={2.5} />
                Exportar
              </Button>
            </div>

            <div className="w-1 h-8 bg-slate-900 dark:bg-slate-50" />

            {/* User Profile */}
            <div className="flex items-center gap-3 px-2">
              <div className="text-right">
                <ResponsiveText variant="body" className="font-black text-slate-900 dark:text-white uppercase leading-none">
                  {profile?.full_name || profile?.email}
                </ResponsiveText>
                <Badge variant="outline" className="text-[10px] mt-1 font-bold border-2 border-slate-900 text-slate-900 rounded-sm bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-50">
                  {getRoleLabel(role)}
                </Badge>
              </div>

              <Avatar className="w-10 h-10 border-2 border-slate-900 dark:border-slate-50 rounded-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] bg-amber-400 hover:-translate-y-1 transition-transform cursor-pointer">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                <AvatarFallback className="text-slate-900 font-black text-sm rounded-none">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="w-1 h-8 bg-slate-900 dark:bg-slate-50" />

            {/* Sign Out Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onSignOut}
              className="h-9 w-9 p-0 bg-white hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-600 border-2 border-slate-900 dark:border-slate-50 rounded-sm shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              title="Terminar Sessão"
            >
              <LogOut className="w-4 h-4 ml-0.5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Brutalist */}
      <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r-4 border-slate-900 dark:border-slate-50 overflow-y-auto w-72 flex-shrink-0">
        <div className="p-4 space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <div className="text-xs font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-3 px-3 py-1 bg-slate-100 dark:bg-slate-800 border-2 border-slate-900 dark:border-slate-50 rounded-sm">
                {category}
              </div>
              <div className="space-y-2 mt-2">
                {items.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-sm text-left transition-all duration-200 group border-2",
                        isActive
                          ? "bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:bg-white dark:text-slate-900 dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                          : "bg-white text-slate-900 border-transparent hover:border-slate-900 dark:bg-slate-900 dark:text-slate-50 dark:hover:border-slate-50"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300 border-2",
                        isActive
                          ? "bg-amber-400 border-slate-900 text-slate-900 dark:bg-amber-500"
                          : "bg-slate-100 border-slate-200 text-slate-500 group-hover:border-slate-900 group-hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:group-hover:border-slate-50 dark:group-hover:text-slate-50"
                      )}>
                        <Icon className="w-4 h-4" {...(isActive ? { strokeWidth: 3 } : { strokeWidth: 2 })} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <ResponsiveText variant="body" className={cn(
                          "font-bold uppercase tracking-wide truncate transition-colors",
                          isActive ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-slate-50"
                        )}>
                          {item.label}
                        </ResponsiveText>
                        <ResponsiveText variant="small" className={cn(
                          "text-xs truncate transition-colors font-medium block",
                          isActive ? "text-slate-300 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"
                        )}>
                          {item.description}
                        </ResponsiveText>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className={cn(
                          "text-[10px] font-bold border-2 rounded-sm uppercase tracking-wider",
                          isActive
                            ? "bg-white text-slate-900 border-slate-900 dark:bg-slate-900 dark:text-white dark:border-white"
                            : "bg-amber-400 text-slate-900 border-slate-900"
                        )}>
                          {item.badge}
                        </Badge>
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
      <main className="flex-1 overflow-x-hidden">
        <ResponsiveContainer>
          {/* Content Header - Brutalist */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 p-6 bg-amber-400 dark:bg-amber-600 rounded-sm border-2 border-slate-900 dark:border-slate-50 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] relative overflow-hidden">
            {/* Halftone texture overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,black_1px,transparent_1.5px)] dark:bg-[radial-gradient(circle_at_center,white_1px,transparent_1.5px)] bg-[length:6px_6px]" />

            <div className="relative z-10 flex-1 min-w-0">
              <ResponsiveText variant="h2" className="font-black text-slate-900 uppercase tracking-tighter leading-none">{activeItem?.label}</ResponsiveText>
              <ResponsiveText variant="body" className="text-slate-800 dark:text-slate-900 font-bold max-w-2xl mt-2 line-clamp-2">
                {activeItem?.description}
              </ResponsiveText>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex h-10 px-4 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-sm font-bold uppercase tracking-wider"
              >
                <Filter className="w-4 h-4 mr-2" strokeWidth={3} />
                Filtros
              </Button>

              {/* More Options Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 w-10 p-0 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-sm flex items-center justify-center"
                  >
                    <MoreVertical className="w-5 h-5" strokeWidth={2.5} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 border-2 border-slate-900 dark:border-slate-50 rounded-sm shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-0">
                  <DropdownMenuLabel className="font-black text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 py-3 px-4 border-b-2 border-slate-900 dark:border-slate-50">
                    Ações Rápidas
                  </DropdownMenuLabel>
                  <div className="p-1">
                    <DropdownMenuItem onClick={onRefreshData} className="cursor-pointer font-bold focus:bg-slate-100 dark:focus:bg-slate-800 rounded-sm mb-1">
                      <RefreshCw className="w-4 h-4 mr-3 text-slate-900 dark:text-white" strokeWidth={2.5} />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Actualizar Dados</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onExportData} className="cursor-pointer font-bold focus:bg-slate-100 dark:focus:bg-slate-800 rounded-sm mb-1">
                      <Download className="w-4 h-4 mr-3 text-slate-900 dark:text-white" strokeWidth={2.5} />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Exportar Dados</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-900 dark:bg-slate-50 h-[2px] my-1" />
                    <DropdownMenuItem onClick={onArchiveItems} className="cursor-pointer font-bold focus:bg-amber-100 dark:focus:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-sm mb-1">
                      <Archive className="w-4 h-4 mr-3" strokeWidth={2.5} />
                      <div>
                        <div className="font-bold uppercase tracking-wider text-xs">Arquivar Selecionados</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-rose-600 dark:text-rose-500 focus:bg-rose-100 dark:focus:bg-rose-900/30 cursor-pointer font-bold rounded-sm mb-1">
                      <Trash2 className="w-4 h-4 mr-3" strokeWidth={2.5} />
                      <div>
                        <div className="font-bold uppercase tracking-wider text-xs">Excluir Selecionados</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-900 dark:bg-slate-50 h-[2px] my-1" />
                    <DropdownMenuItem onClick={onOpenHelp} className="cursor-pointer font-bold focus:bg-slate-100 dark:focus:bg-slate-800 rounded-sm">
                      <HelpCircle className="w-4 h-4 mr-3 text-slate-900 dark:text-white" strokeWidth={2.5} />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">Menu Ajuda</div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[calc(100vh-12rem)] mt-6">
            {children}
          </div>
        </ResponsiveContainer>
      </main>
    </div>

      {/* Mobile Bottom Navigation - Brutalist */ }
  <div className={cn(
    "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300",
    showBottomNav ? "translate-y-0" : "translate-y-full"
  )}>
    <div className="bg-white dark:bg-slate-900 border-t-4 border-slate-900 dark:border-slate-50">
      <div className="flex items-center justify-around p-2">
        {/* Quick Actions */}
        <button
          className="flex flex-col items-center gap-1 p-2 rounded-sm transition-all duration-200 min-w-0 flex-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-amber-400 dark:hover:bg-amber-500 active:bg-amber-500"
          onClick={onRefreshData}
        >
          <RefreshCw className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-wider">Actualizar</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 rounded-sm transition-all duration-200 min-w-0 flex-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-amber-400 dark:hover:bg-amber-500 active:bg-amber-500"
          onClick={onExportData}
        >
          <Download className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-wider">Exportar</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 rounded-sm transition-all duration-200 min-w-0 flex-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-amber-400 dark:hover:bg-amber-500 active:bg-amber-500"
          onClick={onOpenHelp}
        >
          <HelpCircle className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-wider">Ajuda</span>
        </button>

        <button
          className="flex flex-col items-center gap-1 p-2 rounded-sm transition-all duration-200 min-w-0 flex-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-wider">Menu</span>
        </button>
      </div>
    </div>
  </div>
    </div >
  );
};